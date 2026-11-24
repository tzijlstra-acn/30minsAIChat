// @ts-check
/**
 * NFR Workspace v7 -- the two editions. GitHub Pages publishes the public build only:
 * index.html, pitch.html and assets/, scanned for internal terms. The internal edition
 * is built from a git-ignored overlay and is physically absent from the public output,
 * not hidden in it. Internal terms are compared as salted hashes, so this file names none.
 * Node-only checks; they run once, in the chromium project.
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const B = require('../scripts/build.js');

const ROOT = path.join(__dirname, '..');
const HAS_OVERLAY = fs.existsSync(path.join(ROOT, 'internal', 'appendix-internal.js'));

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'build checks run once');
});

function tmp(name) { return fs.mkdtempSync(path.join(os.tmpdir(), 'nfr-' + name + '-')); }
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

test.describe('Public and internal editions', () => {
  test('the scanner matches whole phrases after normalising case, punctuation and spacing', () => {
    const salt = crypto.randomBytes(8).toString('hex');
    const set = new Set([B.hash('synthetic tripwire phrase', salt)]);
    set.salt = salt;
    expect(B.scanText('Here is a Synthetic-Tripwire   PHRASE, planted.', set)).toHaveLength(1);
    expect(B.scanText('synthetic tripwires phrase', set)).toHaveLength(0);
    expect(B.scanText('nothing to see', set)).toHaveLength(0);
  });

  test('the committed term list holds salted hashes only', () => {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'forbidden-terms.json'), 'utf8'));
    expect(j.salt).toMatch(/^[0-9a-f]{32}$/);
    expect(j.hashes.length).toBeGreaterThan(10);
    j.hashes.forEach((h) => expect(h).toMatch(/^[0-9a-f]{64}$/));
    expect(Object.keys(j).sort()).toEqual(['hashes', 'note', 'salt']);
  });

  test('build:public writes the site only, clean of internal terms and of the overlay', () => {
    const out = tmp('public');
    const r = B.buildPublic(out);
    expect(r.hashes).toBeGreaterThan(10);
    expect(fs.readdirSync(out).sort()).toEqual(['assets', 'index.html', 'pitch.html']);
    const files = walk(out).map((f) => path.relative(out, f).split(path.sep).join('/'));
    ['docs/', 'tests/', 'scripts/', 'internal/', 'artifacts/', 'node_modules/'].forEach((d) => expect(files.some((f) => f.startsWith(d)), d).toBe(false));
    expect(files.some((f) => /\.local\.md$/.test(f))).toBe(false);
    const html = fs.readFileSync(path.join(out, 'pitch.html'), 'utf8');
    expect(html).not.toContain('./internal/');
    expect(html).not.toContain('data-internal');
    expect(html).not.toContain('noindex');
    expect(B.scanDir(out, B.loadHashes())).toEqual([]);
    fs.rmSync(out, { recursive: true, force: true });
  });

  test('the Pages workflow publishes the public build and nothing else', () => {
    const wf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8');
    expect(wf).toContain('node scripts/build.js public');
    expect(wf).toMatch(/path:\s*'dist'/);
    ['build.js internal', 'build:internal', 'dist-internal', "path: '.'"].forEach((t) => expect(wf, t).not.toContain(t));
    const ignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8').split(/\r?\n/);
    ['internal/', 'dist/', 'dist-internal/', '*.local.md'].forEach((p) => expect(ignore, p).toContain(p));
  });

  test('build:internal adds its pages and badge; the same pages are absent from the public build', () => {
    test.skip(!HAS_OVERLAY, 'the internal overlay exists only on the presenter machine');
    const outI = tmp('internal');
    const outP = tmp('public');
    const r = B.buildInternal(outI);
    B.buildPublic(outP);
    expect(r.internalPages).toBeGreaterThan(0);
    const html = fs.readFileSync(path.join(outI, 'pitch.html'), 'utf8');
    const ids = [...html.matchAll(/<section id="([a-z0-9-]+)"[^>]*data-internal/g)].map((m) => m[1]);
    expect(ids).toHaveLength(r.internalPages);
    expect(html).toContain('./internal/story-internal.js');
    expect(html).toContain('./internal/appendix-internal.js');
    expect(html).toContain('noindex');
    // The scanner sees the overlay: a positive control on the real term list
    expect(B.scanDir(path.join(outI, 'internal'), B.loadHashes()).length).toBeGreaterThan(0);
    const pub = fs.readFileSync(path.join(outP, 'pitch.html'), 'utf8');
    ids.forEach((id) => expect(pub, id).not.toContain('id="' + id + '"'));
    expect(fs.existsSync(path.join(outP, 'internal'))).toBe(false);
    [outI, outP].forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
  });
});
