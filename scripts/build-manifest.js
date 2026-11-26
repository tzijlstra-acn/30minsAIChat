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
  'cover':              { q: 'What will this conversation show me?', ms: 2200, token: 'workspace-frame' },
  'work-arrives':       { q: 'What does the risk function keep being asked?', ms: 7900, token: 'requests' },
  'assistance-here':    { q: 'Do we not have AI already?', ms: 8300, token: 'channels' },
  'chain-drift':        { q: 'Why does one change matter?', ms: 6000, token: 'chain' },
  'engine-run':         { q: 'How does one question run through every source to an answer?', ms: 9600, token: 'engine' },
  'four-ways':          { q: 'Who does the work, and why can we trust each answer?', ms: 3700, token: 'four-ways' },
  'three-layers':       { q: 'How does it start, and how does it grow?', ms: 4500, token: 'three-layers' },
  'profiles-access':    { q: 'How is each profile set up, and what does each person see?', ms: 2400, token: 'profiles' },
  'security':           { q: 'How is the data kept safe and tracked, and who sees what?', ms: 5100, token: 'security' },
  'enter-workspace':    { q: 'What does the working day look like?', ms: 2600, token: 'live-handoff', interactive: true, state: 'live-handoff' },
  'six-months':         { q: 'Who comes, what do we bring, and what do the first six months look like?', ms: 3900, token: 'six-months' },
  'next-decision':      { q: 'What do we decide at month six?', ms: 3200, token: 'decision' },
  'live-fallback':      { q: 'What if the live product is unavailable?', ms: 100, token: 'captured-acts', interactive: true, state: 'live-fallback' }
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
  story: 'NFR Workspace: the one place for AI in non-financial risk',
  model: { waysToWork: ['Ask', 'Use', 'Run', 'Create'], layers: ['Work & roles', 'Process & controls', 'Data & platform'] },
  proposition: 'NFR Workspace: one role-based experience, powered by reusable NFR methods, governed execution, a connected NFR core and approved integrations',
  anchorJourney: 'Third-party risk, shown in the live product',
  liveProduct: 'NFR Workspace, standalone on port 3200',
  chapters: [
    { id: 'problem', label: "TODAY'S PROBLEM" },
    { id: 'answer', label: 'THE ANSWER' },
    { id: 'workspace', label: 'THE WORKSPACE' },
    { id: 'next', label: 'NEXT STEPS' }
  ],
  screens: screens
};
fs.writeFileSync(path.join(repo, 'assets/data/story-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(screens.length + ' screens:', screens.map(function(s) { return s.id + (s.route === 'reference' ? '*' : ''); }).join(', '));
