#!/usr/bin/env node
// build-manifest -- regenerate assets/data/story-manifest.json from pitch.html, so the
// manifest copy cannot drift from the screens. Keeps the current version; run
// node scripts/stamp-build.js v<n> afterwards to stamp a release.
// Usage: node scripts/build-manifest.js [repo]   (default: this repository)
'use strict';
const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || path.dirname(__dirname);
const current = JSON.parse(fs.readFileSync(path.join(repo, 'assets/data/story-manifest.json'), 'utf8')).version;
const html = fs.readFileSync(path.join(repo, 'pitch.html'), 'utf8');

function decode(t) {
  return t.replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
}
function sectionOf(id) {
  const start = html.indexOf('<section id="' + id + '"');
  return html.slice(start, html.indexOf('</section>', start));
}

const META = {
  'cover':              { q: 'What will this conversation show me?', ms: 5000, token: 'workspace-frame' },
  'assistance-here':    { q: 'Do we not have AI already?', ms: 5200, token: 'channels' },
  'remaining-burden':   { q: 'So what is still hard?', ms: 6400, token: 'integration-layer' },
  'four-ways':          { q: 'What is NFR Workspace?', ms: 5900, token: 'four-ways' },
  'three-layers':       { q: 'What has to change to scale it?', ms: 5800, token: 'three-layers' },
  'workspace-boot':     { q: 'What does the working day look like?', ms: 2600, token: 'workspace', interactive: true, state: 'booting' },
  'workspace-home':     { q: 'Where does the day start?', ms: 2800, token: 'workspace', interactive: true, state: 'workspace-home', caseState: 'prepared' },
  'workspace-journey':  { q: 'How does standard work run end to end?', ms: 2400, token: 'workspace', interactive: true, state: 'case-open', caseState: 'decision' },
  'workspace-builder':  { q: 'What about work no app covers?', ms: 2300, token: 'workspace', interactive: true, state: 'agent-builder-goal' },
  'authority-boundary': { q: 'What does AI do, and what stays human?', ms: 5400, token: 'controlled-receipt', caseState: 'receipt', atlasView: 'controlled-write' },
  'six-month-route':    { q: 'What is the first six-month proof?', ms: 5600, token: 'three-lanes', atlasView: 'workstreams' },
  'value-decision':     { q: 'What is the value, and where do we start?', ms: 4900, token: 'first-loop' },
  'business-case':      { q: 'What is the value and when does it pay back?', ms: 6000, token: 'business-case', interactive: true, caseState: 'measured', atlasView: 'economics' },
  'workspace-live':     { q: 'Does this exist beyond the slides?', ms: 9000, token: 'prototype' }
};

const re = /<section id="([a-z0-9-]+)" data-slide data-route="(core|reference)"([^>]*)>/g;
const screens = [];
let m, order = 0;
while ((m = re.exec(html)) !== null) {
  const id = m[1], route = m[2], attrs = m[3];
  const scene = (attrs.match(/data-scene="([^"]+)"/) || [])[1];
  if (!scene || !META[id]) continue;
  const chunk = sectionOf(id);
  const meta = META[id];
  const entry = {
    id: id,
    order: order++,
    route: route,
    chapterId: (attrs.match(/data-chapter-id="([^"]+)"/) || [])[1],
    kind: (attrs.match(/data-kind="([^"]+)"/) || [])[1] || 'scene',
    title: decode((chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || ''),
    subtitle: decode((chunk.match(/class="slide-sub[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || ''),
    closingLine: decode((chunk.match(/class="scene-footer-insight"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || ''),
    question: meta.q,
    scene: scene,
    durationMs: meta.ms,
    autoplay: true,
    handoffToken: meta.token
  };
  const ev = chunk.match(/class="scene-footer-evidence"[^>]*>([\s\S]*?)<\/div>/);
  if (ev) entry.evidenceLabel = decode(ev[1]);
  if (meta.interactive) entry.interactive = true;
  if (meta.state) entry.experienceState = meta.state;
  if (meta.caseState) entry.caseState = meta.caseState;
  if (meta.atlasView) entry.atlasView = meta.atlasView;
  screens.push(entry);
}

const manifest = {
  version: current,
  story: 'NFR Workspace: from firefighting to prepared judgement',
  model: { waysToWork: ['Ask', 'Use', 'Run', 'Create'], layers: ['Work & roles', 'Process & controls', 'Data & platform'] },
  anchorJourney: 'Periodic third-party review',
  caseId: 'TPRM-PR-042',
  chapters: [
    { id: 'shift', label: 'THE SHIFT' },
    { id: 'model', label: 'THE MODEL' },
    { id: 'workspace', label: 'THE WORKSPACE' },
    { id: 'path', label: 'THE PATH' }
  ],
  screens: screens
};
fs.writeFileSync(path.join(repo, 'assets/data/story-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(screens.length + ' screens:', screens.map(function(s) { return s.id + (s.route === 'reference' ? '*' : ''); }).join(', '));
