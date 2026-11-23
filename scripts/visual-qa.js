#!/usr/bin/env node
/**
 * visual-qa -- repeatable screenshots of the v2 route and the Workspace demo.
 * Usage: node scripts/visual-qa.js [port] [out]      (default 8080, artifacts/visual-qa)
 * Start the server first: npm run serve
 *
 * For each presentation size (1920x1080, 1600x900, 1440x900, 1366x768) it captures:
 *   - every core screen in its final state (reduced motion), and
 *   - every beat of the Workspace demo, driven with the presenter keys.
 * It prints console errors and the experience state at each beat, and exits 1 on errors.
 * Screenshots land in <out>/<size>/; artifacts/ is gitignored.
 */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;

var PORT = process.argv[2] || '8080';
var OUT = process.argv[3] || path.join(path.dirname(__dirname), 'artifacts', 'visual-qa');
var SIZES = [[1920, 1080], [1600, 900], [1440, 900], [1366, 768]];
var BASE = 'http://localhost:' + PORT + '/pitch.html';

async function run() {
  var browser = await chromium.launch();
  var failures = 0;
  for (var s = 0; s < SIZES.length; s++) {
    var w = SIZES[s][0], h = SIZES[s][1];
    var dir = path.join(OUT, w + 'x' + h);
    fs.mkdirSync(dir, { recursive: true });
    var page = await browser.newPage({ viewport: { width: w, height: h } });
    var errors = [];
    page.on('console', function(m) { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', function(e) { errors.push(e.message); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(function() { sessionStorage.setItem('pitch_auth', '1'); });
    await page.goto(BASE);
    await page.waitForFunction(function() { return typeof sections !== 'undefined' && sections.length > 0; });
    var n = 0;
    var shot = async function(name) {
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(dir, String(n++).padStart(2, '0') + '-' + name + '.png') });
    };

    // Every core screen, final state
    var ids = await page.evaluate(function() { return sections.filter(function(x) { return x.dataset.route === 'core'; }).map(function(x) { return x.id; }); });
    for (var i = 0; i < ids.length; i++) {
      await page.evaluate(function(id) { document.getElementById(id).scrollIntoView({ behavior: 'instant' }); }, ids[i]);
      await page.waitForFunction(function(id) { return sections[current].id === id && SceneDirector.getState() === 'complete'; }, ids[i], { timeout: 10000 });
      await shot(ids[i]);
    }

    // The demo, beat by beat, with the presenter keys
    var key = async function(k) { await page.keyboard.press(k); await page.waitForTimeout(200); };
    var state = function() { return page.evaluate(function() { return sections[current].id + ' ' + (document.body.dataset.wsState || '') + ' ' + (document.body.dataset.builderState || ''); }); };
    await page.evaluate(function() { document.getElementById('workspace-home').scrollIntoView({ behavior: 'instant' }); });
    await page.waitForFunction(function() { return sections[current].id === 'workspace-home' && SceneDirector.getState() === 'complete'; });
    await key('Space'); await shot('home-assist');
    await page.evaluate(function() { document.getElementById('workspace-journey').scrollIntoView({ behavior: 'instant' }); });
    await page.waitForFunction(function() { return sections[current].id === 'workspace-journey' && SceneDirector.getState() === 'complete'; });
    var beats = ['journey-role-app', 'journey-trace', 'journey-decision', 'journey-recorded'];
    for (var b = 0; b < beats.length; b++) { await key('Space'); await shot(beats[b]); console.log('  ' + w + 'x' + h + ' ' + (await state())); }
    await key('Space');
    await page.waitForFunction(function() { return sections[current].id === 'workspace-builder' && SceneDirector.getState() === 'complete'; });
    var steps = ['builder-goal', 'builder-scope', 'builder-plan', 'builder-output', 'builder-reuse', 'builder-saved', 'builder-template'];
    for (var t = 0; t < steps.length; t++) { await key('Space'); await shot(steps[t]); }
    console.log('  ' + w + 'x' + h + ' ' + (await state()));
    await key('t'); await shot('technical-depth'); await key('Escape');

    console.log(w + 'x' + h + ': ' + n + ' screenshots, ' + errors.length + ' console errors');
    errors.forEach(function(e) { console.log('    ' + e); });
    failures += errors.length;
    await page.close();
  }
  await browser.close();
  console.log('Screenshots in ' + OUT);
  process.exit(failures ? 1 : 0);
}

run().catch(function(e) { console.error(e); process.exit(1); });
