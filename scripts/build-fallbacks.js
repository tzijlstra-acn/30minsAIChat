#!/usr/bin/env node
/**
 * build-fallbacks -- regenerate the static fallback picture of each core scene from the
 * scene itself, so a fallback never shows older copy than the live screen.
 *
 *   node scripts/build-fallbacks.js [port] [id ...]
 *
 * Start a server first (npm run serve, port 8080 by default). For each scene it renders
 * the final state in reduced motion at its design size, saves the canvas as
 * assets/img/fallback/<id>.jpg and points the scene's <svg data-scene-fallback> in
 * pitch.html at it. The cover and the doorway keep their hand-drawn vector fallbacks:
 * the doorway's carries the live cue as text, which a test checks.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var chromium = require('playwright').chromium;

var ROOT = path.dirname(__dirname);
var PORT = process.argv[2] || '8080';
var KEEP = ['cover', 'enter-workspace'];
var OUT = path.join(ROOT, 'assets', 'img', 'fallback');

(async function() {
  fs.mkdirSync(OUT, { recursive: true });
  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.25 });
  var errors = [];
  page.on('pageerror', function(e) { errors.push(e.message); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(function() { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('http://localhost:' + PORT + '/pitch.html');
  await page.waitForFunction(function() { return typeof sections !== 'undefined' && sections.length > 0; });
  await page.evaluate(function() { return document.fonts.ready; });
  var ids = process.argv.slice(3);
  if (!ids.length) ids = await page.evaluate(function(keep) { return sections.filter(function(x) { return x.dataset.route === 'core' && x.dataset.scene && keep.indexOf(x.id) < 0; }).map(function(x) { return x.id; }); }, KEEP);
  var made = [];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    await page.evaluate(function(sid) { document.getElementById(sid).scrollIntoView({ behavior: 'instant' }); }, id);
    await page.waitForFunction(function(sid) { return sections[current].id === sid && SceneDirector.getState() === 'complete'; }, id, { timeout: 15000 });
    // Natural size: no fit scale, no lift
    var size = await page.evaluate(function(sid) {
      var cv = document.querySelector('#' + sid + ' .ts-canvas');
      cv.style.transform = 'translate(-50%,-50%) scale(1)';
      return { w: cv.offsetWidth, h: cv.offsetHeight };
    }, id);
    await page.waitForTimeout(150);
    var file = path.join(OUT, id + '.jpg');
    await page.locator('#' + id + ' .ts-canvas').screenshot({ path: file, type: 'jpeg', quality: 74 });
    made.push({ id: id, w: size.w, h: size.h, kb: Math.round(fs.statSync(file).size / 1024) });
  }
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

  // Point each fallback at its picture; short canvases sit at the top, as on screen
  var P = path.join(ROOT, 'pitch.html');
  var raw = fs.readFileSync(P, 'utf8');
  var crlf = /\r\n/.test(raw);
  var s = raw.replace(/\r\n/g, '\n');
  var ver = (s.match(/<meta name="nfr-build" content="([^"]+)">/) || [])[1] || 'local';
  made.forEach(function(m) {
    var a = s.indexOf('<section id="' + m.id + '"');
    var b = s.indexOf('<svg data-scene-fallback', a);
    var c = s.indexOf('</svg>', b) + '</svg>'.length;
    if (a < 0 || b < 0 || b > s.indexOf('</section>', a)) throw new Error('no fallback in ' + m.id);
    var svg = '<svg data-scene-fallback viewBox="0 0 1040 520" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'
      + '<image href="./assets/img/fallback/' + m.id + '.jpg?v=' + ver + '" x="0" y="0" width="' + m.w + '" height="' + m.h + '"/></svg>';
    s = s.slice(0, b) + svg + s.slice(c);
  });
  fs.writeFileSync(P, crlf ? s.replace(/\n/g, '\r\n') : s);
  made.forEach(function(m) { console.log('  ' + m.id + ': ' + m.w + 'x' + m.h + ', ' + m.kb + ' KB'); });
  console.log(made.length + ' fallbacks written to assets/img/fallback/ and linked in pitch.html');
}()).catch(function(e) { console.error(e); process.exit(1); });
