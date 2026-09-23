#!/usr/bin/env node
/**
 * audit:icons -- checks all icon classes used in pitch.html and scene JS files
 * against icon-manifest.json. Fails (exit 1) if any icon class is absent from manifest.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);

var errors = [];
var warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// Load manifest
var manifestPath = path.join(ROOT, 'assets/data/icon-manifest.json');
var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
var manifestIcons = Array.isArray(manifest) ? manifest : (manifest.icons || []);
var manifestClasses = new Set(manifestIcons.map(function(i) { return i.class; }));

console.log('Icon manifest: ' + manifestClasses.size + ' icons (version ' + (manifest.version || 'legacy') + ')');

// Collect all icon classes from pitch.html
var html = fs.readFileSync(path.join(ROOT, 'pitch.html'), 'utf8');
var htmlIcons = new Set();
var htmlRe = /class="[^"]*\b(ti-[a-z][a-z0-9-]+)\b[^"]*"/g;
var m;
while ((m = htmlRe.exec(html)) !== null) {
  if (m[1] !== 'ti') htmlIcons.add(m[1]);
}

// Collect icon classes from all scene JS files
var scenesDir = path.join(ROOT, 'assets/js/story/scenes');
var sceneIcons = new Set();
if (fs.existsSync(scenesDir)) {
  fs.readdirSync(scenesDir).filter(function(f) { return f.endsWith('.js'); }).forEach(function(f) {
    var code = fs.readFileSync(path.join(scenesDir, f), 'utf8');
    // Match icon class names in quoted strings and in class attribute values inside JS strings
    var re = /(?:['"](ti-[a-z][a-z0-9-]+)['"]|class="[^"]*\b(ti-[a-z][a-z0-9-]+)\b[^"]*")/g;
    var sm;
    while ((sm = re.exec(code)) !== null) {
      var cls = sm[1] || sm[2];
      if (cls && cls !== 'ti') sceneIcons.add(cls);
    }
  });
}

var allUsed = new Set([...htmlIcons, ...sceneIcons]);

// Check all used classes are in manifest
var missing = [];
allUsed.forEach(function(cls) {
  if (!manifestClasses.has(cls)) missing.push(cls);
});

// Check for unused manifest entries (info only)
var unused = [];
manifestClasses.forEach(function(cls) {
  if (!allUsed.has(cls)) unused.push(cls);
});

console.log('Icons in pitch.html (static): ' + htmlIcons.size);
console.log('Icons in scene JS files: ' + sceneIcons.size);
console.log('Total distinct icons used: ' + allUsed.size);

if (missing.length > 0) {
  console.log('\nMissing from manifest (' + missing.length + '):');
  missing.forEach(function(cls) {
    var src = htmlIcons.has(cls) ? 'html' : 'scene';
    fail('P0: icon class "' + cls + '" used in ' + src + ' but absent from icon-manifest.json');
    console.log('  [FAIL] ' + cls + ' (' + src + ')');
  });
} else {
  console.log('All used icon classes found in manifest -- OK');
}

if (unused.length > 0) {
  console.log('\nUnused manifest entries (' + unused.length + '):');
  unused.forEach(function(cls) {
    warn('P3: manifest entry "' + cls + '" is not used in pitch.html or any scene');
    console.log('  [WARN] ' + cls);
  });
}

if (errors.length) {
  console.log('\naudit:icons -- FAIL (' + errors.length + ' errors)');
  process.exit(1);
} else {
  console.log('\naudit:icons -- PASS' + (warnings.length ? ' (' + warnings.length + ' warnings)' : ''));
}
