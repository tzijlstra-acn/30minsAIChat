#!/usr/bin/env node
/**
 * stamp-build -- set the release and build fingerprint in pitch.html (v2).
 * Usage: node scripts/stamp-build.js [release]   e.g. node scripts/stamp-build.js v28
 * Uses the current git short SHA. Updates the nfr-build meta tag, window.NFR_BUILD and
 * every local ?v= cache-busting string, and keeps pitch.html's CRLF line endings.
 * The PowerShell script (npm run build) updates only the SHA; this one also sets the release.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var ROOT = path.dirname(__dirname);
var file = path.join(ROOT, 'pitch.html');
var sha = cp.execSync('git -C "' + ROOT + '" rev-parse --short=7 HEAD').toString().trim();
var html = fs.readFileSync(file, 'utf8');
var current = (html.match(/content="(v\d+)-[0-9a-f]{7}"/) || [])[1];
var release = process.argv[2] || current;
if (!/^v\d+$/.test(release || '')) throw new Error('Release must look like v28');

html = html.replace(/<meta name="nfr-build" content="v\d+-[0-9a-f]{7}">/, '<meta name="nfr-build" content="' + release + '-' + sha + '">');
html = html.replace(/window\.NFR_BUILD=\{release:'v\d+',commit:'[0-9a-f]{7}',builtAt:'[^']*'\}/,
  "window.NFR_BUILD={release:'" + release + "',commit:'" + sha + "',builtAt:'" + new Date().toISOString().slice(0, 10) + "T00:00:00Z'}");
html = html.replace(/(\.(?:js|css)\?v=)[0-9a-zA-Z-]+"/g, '$1' + sha + '"');
fs.writeFileSync(file, html);

var mPath = path.join(ROOT, 'assets/data/story-manifest.json');
var manifest = fs.readFileSync(mPath, 'utf8').replace(/"version"\s*:\s*"\d+"/, '"version": "' + release.slice(1) + '"');
fs.writeFileSync(mPath, manifest);
console.log('Stamped ' + release + '-' + sha);
