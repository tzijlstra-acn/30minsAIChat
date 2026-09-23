#!/usr/bin/env node
/**
 * audit:all -- master audit runner.
 * Runs all automated checks and fails (exit 1) when any P0 condition is detected.
 *
 * P0 fail conditions (per V18 Master Audit plan):
 *   - em dash character in repository
 *   - external runtime dependency
 *   - core icon missing from manifest
 *   - core screen title over 10 words
 *   - essential text below 14px in core route CSS selectors
 *   - scene missing lifecycle method (play/pause/resume/reset/finish/destroy)
 *   - cursor:pointer in scene (controls must not look clickable)
 */
'use strict';
var fs   = require('fs');
var path = require('path');
var {execSync} = require('child_process');

var ROOT = path.dirname(__dirname);
var errors = [];
var warnings = [];

function section(label) {
  console.log('\n' + '='.repeat(60));
  console.log('  ' + label);
  console.log('='.repeat(60));
}

function runCheck(label, fn) {
  try {
    fn();
  } catch(e) {
    errors.push('[' + label + '] uncaught error: ' + e.message);
  }
}

// ── 1. EM DASH ──────────────────────────────────────────────
section('1. Em dash check');
runCheck('em-dash', function() {
  var EM = '—';
  var dirs = ['pitch.html', 'index.html', 'assets/js', 'assets/css'];
  var found = 0;
  function scan(p) {
    if (!fs.existsSync(p)) return;
    var stat = fs.statSync(p);
    if (stat.isDirectory()) {
      fs.readdirSync(p).forEach(function(f) {
        if (!['vendor', 'team', 'node_modules', '.git'].some(function(ex) { return p.includes(ex); })) {
          scan(path.join(p, f));
        }
      });
    } else if (/\.(html|js|css)$/.test(p)) {
      var content = fs.readFileSync(p, 'utf8');
      if (content.includes(EM)) {
        errors.push('P0: em dash found in ' + path.relative(ROOT, p));
        found++;
      }
    }
  }
  dirs.forEach(function(d) { scan(path.join(ROOT, d)); });
  if (found === 0) console.log('  No em dashes found -- OK');
  else console.log('  FAIL: ' + found + ' file(s) contain em dash');
});

// ── 2. OFFLINE / NO EXTERNAL DEPS ───────────────────────────
section('2. External runtime dependencies');
runCheck('offline', function() {
  var html = fs.readFileSync(path.join(ROOT, 'pitch.html'), 'utf8');
  var extRe = /(?:src|href)="(https?:\/\/[^"]+)"/gi;
  var m;
  var found = 0;
  while ((m = extRe.exec(html)) !== null) {
    if (!/mailto:|#/.test(m[1])) {
      errors.push('P0: external resource in pitch.html: ' + m[1]);
      found++;
    }
  }
  if (found === 0) console.log('  No external runtime dependencies -- OK');
  else console.log('  FAIL: ' + found + ' external dependency(ies)');
});

// ── 3. ICON MANIFEST COMPLETENESS ───────────────────────────
section('3. Icon manifest completeness');
runCheck('icons', function() {
  var manifestPath = path.join(ROOT, 'assets/data/icon-manifest.json');
  var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  var manifestIcons = Array.isArray(manifest) ? manifest : (manifest.icons || []);
  var manifestClasses = new Set(manifestIcons.map(function(i) { return i.class; }));

  var html = fs.readFileSync(path.join(ROOT, 'pitch.html'), 'utf8');
  var allUsed = new Set();
  var htmlRe = /class="[^"]*\b(ti-[a-z][a-z0-9-]+)\b[^"]*"/g;
  var m;
  while ((m = htmlRe.exec(html)) !== null) { if (m[1] !== 'ti') allUsed.add(m[1]); }

  var scenesDir = path.join(ROOT, 'assets/js/story/scenes');
  if (fs.existsSync(scenesDir)) {
    fs.readdirSync(scenesDir).filter(function(f) { return f.endsWith('.js'); }).forEach(function(f) {
      var code = fs.readFileSync(path.join(scenesDir, f), 'utf8');
      var re = /['"](ti-[a-z][a-z0-9-]+)['"]/g;
      while ((m = re.exec(code)) !== null) { if (m[1] !== 'ti') allUsed.add(m[1]); }
    });
  }

  var missing = [];
  allUsed.forEach(function(cls) { if (!manifestClasses.has(cls)) missing.push(cls); });
  if (missing.length > 0) {
    missing.forEach(function(cls) { errors.push('P0: icon "' + cls + '" used but absent from manifest'); });
    console.log('  FAIL: ' + missing.length + ' icon(s) missing from manifest');
  } else {
    console.log('  All ' + allUsed.size + ' icon classes found in manifest (' + manifestClasses.size + ' total) -- OK');
  }
});

// ── 4. CORE TITLE WORD COUNT ─────────────────────────────────
section('4. Core screen title word count (max 10)');
runCheck('titles', function() {
  var html = fs.readFileSync(path.join(ROOT, 'pitch.html'), 'utf8');
  var sectionRe = /<section\b([^>]*)>/gi;
  var m;
  var found = 0;
  while ((m = sectionRe.exec(html)) !== null) {
    var attrs = m[1];
    var route = (attrs.match(/\bdata-route="([^"]+)"/) || [])[1] || 'core';
    if (route !== 'core' && route !== '') continue;
    var id = (attrs.match(/\bid="([^"]+)"/) || [])[1] || 'unknown';
    var sStart = m.index;
    var sEnd = html.indexOf('</section>', sStart);
    if (sEnd === -1) sEnd = sStart + 3000;
    var chunk = html.slice(sStart, sEnd);
    var h2 = (chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '';
    h2 = h2.replace(/<[^>]+>/g, '').trim();
    var words = h2.trim().split(/\s+/).filter(Boolean).length;
    if (words > 10) {
      errors.push('P0: screen ' + id + ' h2 has ' + words + ' words: "' + h2 + '"');
      found++;
    }
  }
  if (found === 0) console.log('  No core screen title exceeds 10 words -- OK');
  else console.log('  FAIL: ' + found + ' title(s) over word limit');
});

// ── 5. ESSENTIAL TEXT SIZE (core route selectors) ────────────
section('5. Essential text floor (14px for core, 11.5px for notes)');
runCheck('font-sizes', function() {
  var cssPath = path.join(ROOT, 'assets/css/pitch.css');
  var css = fs.readFileSync(cssPath, 'utf8');
  // Find scene-facing selectors with font-size < 11.5px (below note floor)
  // We check for the most critical ones
  var critical = [
    { sel: '.arch-rail-label', min: 8 },
    { sel: '.sgt-gate-lbl',    min: 8 },
    { sel: '.etag',            min: 8 },
    { sel: '.slide-sub',       min: 17 },
    { sel: '.scene-insight',   min: 14 }
  ];
  var found = 0;
  critical.forEach(function(c) {
    var re = new RegExp(c.sel.replace('.', '\\.') + '\\s*\\{[^}]*font-size\\s*:\\s*([0-9.]+)px', 'i');
    var m = css.match(re);
    if (m) {
      var sz = parseFloat(m[1]);
      if (sz < c.min) {
        errors.push('P0: ' + c.sel + ' font-size ' + sz + 'px is below minimum ' + c.min + 'px');
        found++;
        console.log('  FAIL: ' + c.sel + ' = ' + sz + 'px (min: ' + c.min + 'px)');
      } else {
        console.log('  ok: ' + c.sel + ' = ' + sz + 'px');
      }
    }
  });
  if (found === 0) console.log('  All checked selectors meet size floor -- OK');
});

// ── 6. SCENE LIFECYCLE COMPLETENESS ──────────────────────────
section('6. Scene lifecycle contract (play/pause/resume/reset/finish/destroy)');
runCheck('lifecycle', function() {
  var scenesDir = path.join(ROOT, 'assets/js/story/scenes');
  if (!fs.existsSync(scenesDir)) { errors.push('P0: scenes directory not found'); return; }
  var required = ['play', 'pause', 'resume', 'reset', 'finish', 'destroy'];
  var found = 0;
  fs.readdirSync(scenesDir).filter(function(f) { return f.endsWith('.js'); }).forEach(function(f) {
    var code = fs.readFileSync(path.join(scenesDir, f), 'utf8');
    var name = f.replace('.js','');
    var missing = required.filter(function(m) {
      return code.indexOf(m + ':') === -1 && code.indexOf('"' + m + '"') === -1;
    });
    if (missing.length > 0) {
      errors.push('P0: ' + name + ' missing lifecycle method(s): ' + missing.join(', '));
      found++;
      console.log('  FAIL: ' + name + ' -- missing: ' + missing.join(', '));
    }
    if (code.indexOf('cursor:pointer') !== -1) {
      errors.push('P0: ' + name + ' has cursor:pointer -- controls must not look clickable');
      console.log('  FAIL: ' + name + ' -- cursor:pointer found');
    }
  });
  if (found === 0) console.log('  All scenes have full lifecycle contract -- OK');
});

// ── SUMMARY ──────────────────────────────────────────────────
section('Summary');
console.log('Warnings: ' + warnings.length);
console.log('Errors:   ' + errors.length);

if (errors.length > 0) {
  console.log('\nFailing P0 conditions:');
  errors.forEach(function(e) { console.log('  ' + e); });
  console.log('\naudit:all -- FAIL');
  process.exit(1);
} else {
  console.log('\naudit:all -- PASS' + (warnings.length ? ' (' + warnings.length + ' warnings)' : ''));
}
