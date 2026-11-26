#!/usr/bin/env node
/**
 * export-fallback -- a static PDF of the whole presentation, for a meeting where the
 * live site is blocked or the interactive demo cannot run.
 * Usage: node scripts/export-fallback.js [port] [out]   (default 8080, artifacts/fallback)
 * Start a server first: npm run serve, or node scripts/serve.js 8190 dist for the public
 * build. For the internal edition, write the PDF inside internal/ so it stays git-ignored.
 *
 * Renders at 1920x1080 in reduced motion (every screen in its final state), in story
 * order: the core screens, with the five acts captured from the live product after
 * Enter NFR Workspace and one page per role on screen 05, then the appendix index and
 * every question page.
 * Writes <out>/NFR-Workspace-<release>.pdf, one screen per page, plus the JPEG frames.
 * Exits 1 on any console error. artifacts/ is gitignored: the PDF is not published.
 */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;

var PORT = process.argv[2] || '8080';
var OUT = process.argv[3] || path.join(path.dirname(__dirname), 'artifacts', 'fallback');
var W = 1920, H = 1080;
var BASE = 'http://localhost:' + PORT + '/pitch.html';

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.readdirSync(OUT).filter(function(f) { return /\.(jpg|html)$/.test(f); }).forEach(function(f) { fs.unlinkSync(path.join(OUT, f)); });
  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: W, height: H } });
  var errors = [];
  page.on('console', function(m) { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', function(e) { errors.push(e.message); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(function() { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto(BASE);
  await page.waitForFunction(function() { return typeof sections !== 'undefined' && sections.length > 0; });
  var release = await page.evaluate(function() { return (window.NFR_BUILD && (window.NFR_BUILD.release + '-' + window.NFR_BUILD.commit)) || 'local'; });

  var frames = [];
  async function shot(name) {
    await page.waitForTimeout(300);
    var file = String(frames.length).padStart(2, '0') + '-' + name + '.jpg';
    await page.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 90 });
    frames.push(file);
  }
  async function go(id) {
    await page.evaluate(function(x) { document.getElementById(x).scrollIntoView({ behavior: 'instant' }); }, id);
    await page.waitForFunction(function(x) {
      var s = sections[current];
      return s.id === x && (!s.dataset.scene || SceneDirector.getState() === 'complete');
    }, id, { timeout: 10000 });
  }
  async function key(k) { await page.keyboard.press(k); await page.waitForTimeout(250); }

  // The story, with the five captured acts where the live product would be shown
  // The core screens and the chapter dividers, in story order
  var core = await page.evaluate(function() { return sections.filter(function(x) { return x.dataset.route === 'core' || x.dataset.route === 'divider'; }).map(function(x) { return x.id; }); });
  for (var i = 0; i < core.length; i++) {
    await go(core[i]);
    await shot(core[i]);
    // Screen 05: the first role at Light, Medium and Deep (Space unfolds each), then every
    // other role at Deep
    if (core[i] === 'role-views') {
      await key('Space'); await shot('role-views-medium');
      await key('Space'); await shot('role-views-deep');
      var order = await page.evaluate(function() { return NFR_WORKSPACE_DEMO.roles.order; });
      for (var r = 1; r < order.length; r++) {
        await page.evaluate(function(id) {
          var at = NFR_WORKSPACE_DEMO.roles.list.map(function(x) { return x.id; }).indexOf(id);
          document.querySelectorAll('#role-views .rv-role')[at].click();
        }, order[r]);
        await page.waitForTimeout(250);
        await shot('role-views-' + order[r]);
      }
    }
    // Screen 08: one page per person, in the order Space steps through them
    if (core[i] === 'profiles-access') {
      var people = await page.evaluate(function() { return NFR_WORKSPACE_DEMO.profiles.order; });
      for (var q = 1; q < people.length; q++) { await key('Space'); await shot('profiles-access-' + people[q]); }
    }
    if (core[i] === 'enter-workspace') {
      await go('live-fallback');
      var n = await page.evaluate(function() { return NFR_LIVE_CAPTURES.acts.reduce(function(t, a) { return t + a.shots.length; }, 0); });
      for (var c = 0; c < n; c++) { await shot('live-act-capture-' + (c + 1)); if (c < n - 1) await key('Space'); }
    }
  }
  var apx = await page.evaluate(function() { return ['appendix'].concat(NFR_APPENDIX.pages.map(function(p) { return p.id; })); });
  for (var a = 0; a < apx.length; a++) { await go(apx[a]); await shot(apx[a]); }

  // One page per frame, full bleed
  var html = '<!doctype html><meta charset="utf-8"><title>NFR Workspace ' + release + '</title><style>'
    + '@page{size:' + W + 'px ' + H + 'px;margin:0}html,body{margin:0;background:#0b0c10}'
    + '.p{width:' + W + 'px;height:' + H + 'px;page-break-after:always;overflow:hidden}.p img{display:block;width:100%;height:100%}'
    + '</style>' + frames.map(function(f) { return '<div class="p"><img src="' + f + '"></div>'; }).join('');
  var htmlPath = path.join(OUT, 'fallback.html');
  fs.writeFileSync(htmlPath, html);
  var pdfPage = await browser.newPage();
  await pdfPage.goto(require('url').pathToFileURL(htmlPath).href);
  await pdfPage.waitForFunction(function() { return Array.prototype.every.call(document.images, function(im) { return im.complete && im.naturalWidth > 0; }); });
  var pdf = path.join(OUT, 'NFR-Workspace-' + release + '.pdf');
  await pdfPage.pdf({ path: pdf, width: W + 'px', height: H + 'px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  fs.unlinkSync(htmlPath);
  await browser.close();

  console.log(frames.length + ' pages, ' + errors.length + ' console errors');
  errors.forEach(function(e) { console.log('  ' + e); });
  console.log('PDF: ' + pdf + ' (' + Math.round(fs.statSync(pdf).size / 1024) + ' KB)');
  process.exit(errors.length ? 1 : 0);
}

run().catch(function(e) { console.error(e); process.exit(1); });
