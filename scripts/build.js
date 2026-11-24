#!/usr/bin/env node
/**
 * build -- assemble the two editions of the deck.
 *
 *   node scripts/build.js public     -> dist/            (the only edition GitHub Pages publishes)
 *   node scripts/build.js internal   -> dist-internal/   (local only; needs the git-ignored internal/ folder)
 *   node scripts/build.js scan <dir> -> scan a built folder for internal terms
 *   node scripts/build.js hash-terms -> rewrite scripts/forbidden-terms.json from internal/forbidden-terms.txt
 *
 * The public edition copies index.html, pitch.html and assets/ only: no docs, tests,
 * scripts or internal files. It then scans every text file for internal terms. The
 * terms are kept as SHA-256 hashes of normalised phrases (scripts/forbidden-terms.json),
 * so this public repository never names them; any hit fails the build.
 *
 * The internal edition is the public edition plus the overlay in internal/: two data
 * files loaded before the story and appendix data (they replace or append objects
 * before those are frozen), a stylesheet, and one section shell per internal appendix
 * page. It is never published.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var ROOT = path.dirname(__dirname);
var TERMS = path.join(ROOT, 'scripts', 'forbidden-terms.json');
var INTERNAL = path.join(ROOT, 'internal');
var TEXT = /\.(html|js|css|json|svg|md|txt)$/i;

function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(function(e) {
    var s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  });
}
function walk(dir, out) {
  out = out || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  });
  return out;
}

// ── Term scanning: lowercase, split on anything that is not a letter or digit, then
// hash every run of one to four words and compare with the list ──
// The salt only stops a lookup in precomputed tables. A short term can still be guessed
// and confirmed against its hash, so this list is a tripwire, not a secret.
function normalise(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function digest(salt, phrase) { return crypto.createHash('sha256').update(salt + '\n' + phrase).digest('hex'); }
function hash(t, salt) { return digest(salt, normalise(t)); }
function loadHashes() {
  var j = fs.existsSync(TERMS) ? JSON.parse(fs.readFileSync(TERMS, 'utf8')) : { salt: '', hashes: [] };
  var set = new Set(j.hashes);
  set.salt = j.salt || '';
  return set;
}
function scanText(text, hashes) {
  var words = normalise(text).split(' ');
  var hits = [];
  for (var i = 0; i < words.length; i++) {
    var phrase = '';
    for (var n = 0; n < 4 && i + n < words.length; n++) {
      phrase = n ? phrase + ' ' + words[i + n] : words[i];
      if (hashes.has(digest(hashes.salt, phrase))) hits.push({ at: i, words: n + 1 });
    }
  }
  return hits;
}
function scanDir(dir, hashes) {
  var found = [];
  walk(dir).filter(function(f) { return TEXT.test(f); }).forEach(function(f) {
    var hits = scanText(fs.readFileSync(f, 'utf8'), hashes);
    if (hits.length) found.push({ file: path.relative(dir, f), count: hits.length });
  });
  return found;
}

function buildPublic(out) {
  rmrf(out);
  fs.mkdirSync(out, { recursive: true });
  ['index.html', 'pitch.html'].forEach(function(f) { fs.copyFileSync(path.join(ROOT, f), path.join(out, f)); });
  copyDir(path.join(ROOT, 'assets'), path.join(out, 'assets'));
  var html = fs.readFileSync(path.join(out, 'pitch.html'), 'utf8');
  if (/src="\.\/internal\//.test(html)) throw new Error('pitch.html references the internal overlay');
  var hashes = loadHashes();
  if (!hashes.size) throw new Error('scripts/forbidden-terms.json is missing or empty');
  var found = scanDir(out, hashes);
  if (found.length) {
    found.forEach(function(x) { console.error('  internal term in ' + x.file + ' (' + x.count + ')'); });
    throw new Error('public build contains internal terms');
  }
  return { files: walk(out).length, hashes: hashes.size };
}

function buildInternal(out) {
  if (!fs.existsSync(path.join(INTERNAL, 'appendix-internal.js'))) throw new Error('internal/ overlay not found: the internal edition is built only where it exists');
  rmrf(out);
  fs.mkdirSync(out, { recursive: true });
  ['index.html', 'pitch.html'].forEach(function(f) { fs.copyFileSync(path.join(ROOT, f), path.join(out, f)); });
  copyDir(path.join(ROOT, 'assets'), path.join(out, 'assets'));
  fs.mkdirSync(path.join(out, 'internal'), { recursive: true });
  if (fs.existsSync(path.join(INTERNAL, 'assets'))) copyDir(path.join(INTERNAL, 'assets'), path.join(out, 'internal', 'assets'));
  ['story-internal.js', 'appendix-internal.js', 'internal.css'].forEach(function(f) { fs.copyFileSync(path.join(INTERNAL, f), path.join(out, 'internal', f)); });

  var P = path.join(out, 'pitch.html');
  var crlf = /\r\n/.test(fs.readFileSync(P, 'utf8'));
  var s = fs.readFileSync(P, 'utf8').replace(/\r\n/g, '\n');
  function rep(a, b) { if (s.indexOf(a) < 0) throw new Error('internal build: missing ' + a); s = s.replace(a, b); }
  var ver = (s.match(/workspace-demo\.js\?v=([0-9a-f]+)/) || [])[1] || 'local';
  rep('<script src="./assets/data/workspace-demo.js?v=' + ver + '"></script>', '<script src="./internal/story-internal.js?v=' + ver + '"></script>\n<script src="./assets/data/workspace-demo.js?v=' + ver + '"></script>');
  rep('<script src="./assets/data/appendix-modules.js?v=' + ver + '"></script>', '<script src="./internal/appendix-internal.js?v=' + ver + '"></script>\n<script src="./assets/data/appendix-modules.js?v=' + ver + '"></script>');
  rep('</head>', '<link rel="stylesheet" href="./internal/internal.css?v=' + ver + '">\n<meta name="robots" content="noindex, nofollow">\n</head>');
  s = s.replace(/<title>([^<]*)<\/title>/, '<title>$1 (internal edition)</title>');

  // Section shells for the internal appendix pages, after the last page of their module
  global.NFR_APPENDIX_INTERNAL = undefined;
  var overlayPath = require.resolve(path.join(INTERNAL, 'appendix-internal.js'));
  delete require.cache[overlayPath];
  require(overlayPath);
  delete require.cache[overlayPath];
  var dataPath = require.resolve(path.join(ROOT, 'assets', 'data', 'appendix-modules.js'));
  delete require.cache[dataPath];
  var APX = require(dataPath);
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var added = 0;
  APX.modules.forEach(function(m) {
    var extra = m.pages.filter(function(p) { return p.internal; });
    if (!extra.length) return;
    var last = m.pages.filter(function(p) { return !p.internal; }).pop();
    var at = s.indexOf('</section>', s.indexOf('<section id="' + last.id + '"')) + '</section>'.length;
    var shells = extra.map(function(p) {
      added++;
      return '\n\n<section id="' + p.id + '" data-slide data-route="reference" data-apx-page data-module="' + m.id + '" data-internal data-density="long" data-chapter-id="reference" data-chapter-title="APPENDIX" data-nav-title="' + esc(p.code + '. ' + p.title) + '">\n'
        + '  <div class="inner apx-page">\n    <div data-apx-chrome></div>\n    <h2 class="slide-h">' + esc(p.title) + '</h2>\n    <p class="slide-sub">' + esc(p.answer) + '</p>\n    <div class="apx-body" data-apx-body></div>\n  </div>\n</section>';
    }).join('');
    s = s.slice(0, at) + shells + s.slice(at);
  });
  delete require.cache[dataPath];
  global.NFR_APPENDIX_INTERNAL = undefined;
  fs.writeFileSync(P, crlf ? s.replace(/\n/g, '\r\n') : s);
  return { files: walk(out).length, internalPages: added };
}

function hashTerms() {
  var src = path.join(INTERNAL, 'forbidden-terms.txt');
  if (!fs.existsSync(src)) throw new Error('internal/forbidden-terms.txt not found');
  var terms = fs.readFileSync(src, 'utf8').split(/\r?\n/).map(function(l) { return l.replace(/#.*/, '').trim(); }).filter(Boolean);
  terms.forEach(function(t) { if (normalise(t).split(' ').length > 4) throw new Error('term longer than four words: line "' + t.slice(0, 12) + '..."'); });
  var salt = crypto.randomBytes(16).toString('hex');
  var hashes = Array.from(new Set(terms.map(function(t) { return hash(t, salt); }))).sort();
  fs.writeFileSync(TERMS, JSON.stringify({
    note: 'Salted SHA-256 of normalised phrases (lowercase; anything but letters and digits becomes one space). The plain list is kept outside this repository. Regenerate with: node scripts/build.js hash-terms',
    salt: salt,
    hashes: hashes
  }, null, 2) + '\n');
  return hashes.length;
}

module.exports = { normalise: normalise, hash: hash, scanText: scanText, scanDir: scanDir, loadHashes: loadHashes, buildPublic: buildPublic, buildInternal: buildInternal };

if (require.main === module) {
  var cmd = process.argv[2];
  try {
    if (cmd === 'public') {
      var r = buildPublic(path.join(ROOT, process.argv[3] || 'dist'));
      console.log('Public edition: ' + r.files + ' files, scanned against ' + r.hashes + ' internal terms, clean.');
    } else if (cmd === 'internal') {
      var q = buildInternal(path.join(ROOT, process.argv[3] || 'dist-internal'));
      console.log('Internal edition: ' + q.files + ' files, ' + q.internalPages + ' internal appendix pages. Not for publication.');
    } else if (cmd === 'scan') {
      var f = scanDir(path.resolve(process.argv[3] || 'dist'), loadHashes());
      f.forEach(function(x) { console.log('  ' + x.file + ': ' + x.count); });
      console.log(f.length ? f.length + ' files contain internal terms' : 'clean');
      process.exit(f.length ? 1 : 0);
    } else if (cmd === 'scan-repo') {
      // The repository is public too: scan every file git would commit (tracked or not ignored)
      var list = require('child_process').execSync('git -C "' + ROOT + '" ls-files -co --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
      var hs = loadHashes(), bad = 0;
      list.filter(function(f) { return TEXT.test(f) && fs.existsSync(path.join(ROOT, f)); }).forEach(function(f) {
        var n = scanText(fs.readFileSync(path.join(ROOT, f), 'utf8'), hs).length;
        if (n) { bad++; console.log('  ' + f + ': ' + n); }
      });
      console.log(bad ? bad + ' committable files contain internal terms' : 'clean: ' + list.length + ' committable files');
      process.exit(bad ? 1 : 0);
    } else if (cmd === 'hash-terms') {
      console.log(hashTerms() + ' terms hashed into scripts/forbidden-terms.json');
    } else {
      console.log('usage: node scripts/build.js public|internal|scan <dir>|hash-terms');
      process.exit(2);
    }
  } catch (e) {
    console.error('build failed: ' + e.message);
    process.exit(1);
  }
}
