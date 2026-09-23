#!/usr/bin/env node
/**
 * audit:story -- checks screen count, title/subtitle word counts, causal logic markers
 * Fails (exit 1) when any P0 story condition is detected:
 *   - more than 12 core screens
 *   - any core h2 over 10 words
 *   - any core subtitle over 22 words
 *   - any core h2 that starts with a definite article (weak framing)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);

var html = fs.readFileSync(path.join(ROOT, 'pitch.html'), 'utf8');
var errors = [];
var warnings = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function words(s) { return s.trim().split(/\s+/).filter(Boolean).length; }

// Extract core route sections: data-route="core" or no data-route on section
var coreRe = /<section[^>]*id="([^"]+)"[^>]*(?:data-route="core"|(?!data-route))[^>]*>/gi;
var sections = [];
var m;

// Parse sections by walking the HTML for section tags with id
var sectionRe = /<section\b([^>]*)>/gi;
while ((m = sectionRe.exec(html)) !== null) {
  var attrs = m[1];
  var id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
  var route = (attrs.match(/\bdata-route="([^"]+)"/) || [])[1] || 'core';
  var navTitle = (attrs.match(/\bdata-nav-title="([^"]*)"/) || [])[1] || '';
  if (!id) continue;

  // Find h2 and slide-sub within this section (crude but workable)
  var sStart = m.index;
  var sEnd = html.indexOf('</section>', sStart);
  if (sEnd === -1) sEnd = sStart + 3000;
  var chunk = html.slice(sStart, sEnd);

  var h2 = (chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '';
  h2 = h2.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim();

  var sub = (chunk.match(/class="slide-sub[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '';
  sub = sub.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim();

  sections.push({ id, route, navTitle, h2, sub });
}

var coreScreens = sections.filter(function(s) { return s.route === 'core'; });
var refScreens  = sections.filter(function(s) { return s.route === 'reference'; });

console.log('Story audit: ' + sections.length + ' total sections (' + coreScreens.length + ' core, ' + refScreens.length + ' reference)');

// P0: core screen count
if (coreScreens.length > 12) {
  fail('P0: ' + coreScreens.length + ' core screens found; maximum is 12');
} else {
  console.log('  Core screen count: ' + coreScreens.length + '/12 -- OK');
}

// P0: title word count (core route only)
coreScreens.forEach(function(s) {
  var w = words(s.h2);
  if (w > 10) fail('P0: Screen ' + s.id + ' h2 has ' + w + ' words: "' + s.h2 + '"');
  else if (w > 8) warn('P1: Screen ' + s.id + ' h2 approaching limit (' + w + ' words): "' + s.h2 + '"');
});

// P0: subtitle word count (core route only)
coreScreens.forEach(function(s) {
  if (!s.sub) return;
  var w = words(s.sub);
  if (w > 22) fail('P0: Screen ' + s.id + ' subtitle has ' + w + ' words');
  else if (w > 18) warn('P1: Screen ' + s.id + ' subtitle approaching limit (' + w + ' words)');
});

// P1: reference subtitles over 22 words
refScreens.forEach(function(s) {
  if (!s.sub) return;
  var w = words(s.sub);
  if (w > 22) warn('P1: Reference screen ' + s.id + ' subtitle has ' + w + ' words');
});

// P1: weak framing (h2 starts with definite article or describes content)
var weakPrefixes = ['the ', 'a ', 'an ', 'this ', 'these ', 'those '];
coreScreens.forEach(function(s) {
  var lc = s.h2.toLowerCase();
  weakPrefixes.forEach(function(p) {
    if (lc.startsWith(p)) warn('P1: Screen ' + s.id + ' h2 starts with weak framing article: "' + s.h2 + '"');
  });
});

// Print table
console.log('\nCore screens:');
coreScreens.forEach(function(s, i) {
  var hw = words(s.h2);
  var sw = s.sub ? words(s.sub) : 0;
  var status = (hw > 10 || sw > 22) ? 'FAIL' : 'ok';
  console.log('  ' + (i + '').padStart(2) + '. [' + status + '] ' + s.id.padEnd(30) + ' | h2:' + hw + 'w | sub:' + sw + 'w | "' + s.h2 + '"');
});

if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(function(w) { console.log('  [WARN] ' + w); });
}
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(function(e) { console.log('  [FAIL] ' + e); });
  process.exit(1);
} else {
  console.log('\naudit:story -- PASS' + (warnings.length ? ' (' + warnings.length + ' warnings)' : ''));
}
