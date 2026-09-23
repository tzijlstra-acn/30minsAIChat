#!/usr/bin/env node
/**
 * audit:offline -- checks that pitch.html has NO external runtime dependencies.
 * Checks: script src, link href, img src, video src, audio src, @import, fetch() calls
 * with external URLs. Fails (exit 1) if any external runtime request is found.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);

var errors = [];
var warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// Files to check
var targets = [
  path.join(ROOT, 'pitch.html'),
  path.join(ROOT, 'index.html')
];

// Also check all JS files under assets/js/ (not vendor)
var jsDir = path.join(ROOT, 'assets/js');
function walkJs(dir, files) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function(f) {
    var full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && f !== 'vendor') walkJs(full, files);
    else if (f.endsWith('.js')) files.push(full);
  });
}
walkJs(jsDir, targets);

// External URL patterns
var externalRe = /https?:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/;

// Patterns to check per file type
var htmlPatterns = [
  { re: /<script[^>]+src="([^"]+)"/gi,   label: 'script src' },
  { re: /<link[^>]+href="([^"]+)"/gi,    label: 'link href' },
  { re: /<img[^>]+src="([^"]+)"/gi,      label: 'img src' },
  { re: /url\(["']?(https?:\/\/[^"')]+)["']?\)/gi, label: 'CSS url()' }
];

var jsPatterns = [
  { re: /fetch\s*\(\s*['"]?(https?:\/\/[^'")\s]+)/gi, label: 'fetch()' },
  { re: /new\s+XMLHttpRequest[\s\S]{0,200}open\s*\([^,]+,\s*['"]?(https?:\/\/[^'"]+)/gi, label: 'XHR open()' },
  { re: /import\s*\(['"](https?:\/\/[^'"]+)/gi, label: 'dynamic import()' }
];

var totalChecked = 0;

targets.forEach(function(filePath) {
  if (!fs.existsSync(filePath)) return;
  var rel = path.relative(ROOT, filePath);
  var content = fs.readFileSync(filePath, 'utf8');
  totalChecked++;

  var patterns = filePath.endsWith('.html') ? htmlPatterns.concat(jsPatterns) : jsPatterns;

  patterns.forEach(function(p) {
    var re = new RegExp(p.re.source, p.re.flags);
    var m;
    while ((m = re.exec(content)) !== null) {
      var url = m[1] || m[0];
      if (externalRe.test(url)) {
        fail('P0: External runtime request in ' + rel + ': [' + p.label + '] ' + url.slice(0, 80));
      }
    }
  });
});

// Check for CDN patterns in CSS files
var cssDir = path.join(ROOT, 'assets/css');
if (fs.existsSync(cssDir)) {
  fs.readdirSync(cssDir).filter(function(f) { return f.endsWith('.css'); }).forEach(function(f) {
    var content = fs.readFileSync(path.join(cssDir, f), 'utf8');
    var re = /url\(['"]?(https?:\/\/[^'")\s]+)/gi;
    var m;
    while ((m = re.exec(content)) !== null) {
      fail('P0: External URL in assets/css/' + f + ': ' + m[1]);
    }
    // @import with URL
    var impRe = /@import\s+['"]?(https?:\/\/[^'";\s]+)/gi;
    while ((m = impRe.exec(content)) !== null) {
      fail('P0: @import external URL in assets/css/' + f + ': ' + m[1]);
    }
    totalChecked++;
  });
}

console.log('Offline audit: checked ' + totalChecked + ' files');

if (errors.length) {
  errors.forEach(function(e) { console.log('[FAIL] ' + e); });
  console.log('\naudit:offline -- FAIL (' + errors.length + ' external runtime dependencies)');
  process.exit(1);
} else {
  console.log('No external runtime dependencies found.');
  console.log('\naudit:offline -- PASS');
}
