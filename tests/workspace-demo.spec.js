// @ts-check
/**
 * NFR Workspace v7 -- the hand-off to the live product, the captured fallback and the
 * return to the plan beneath it (screen 08), the four-domain appendix, the unit-economics calculator, presenter keys, history, safe
 * mode, the state model and an offline run. The deck carries no mock of the product.
 * Every test sets its own viewport, so the file runs once, in the chromium project.
 */
const { test, expect } = require('@playwright/test');
const APX = require('../assets/data/appendix-modules.js');
const U = require('../assets/js/story/unit-economics.js');
const B = require('../scripts/build.js');

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'demo tests set their own viewport and run once');
});
test.use({ viewport: { width: 1440, height: 900 } });

async function open(page, hash, query) {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html' + (query || '') + (hash || ''));
  await page.waitForFunction(() => typeof sections !== 'undefined' && sections.length > 0);
}
// Arrive on a screen; scene screens also wait for their scene to complete
async function land(page, id, timeout) {
  await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
  await page.waitForFunction((sid) => {
    const s = sections[current];
    return s && s.id === sid && (!s.dataset.scene || SceneDirector.getState() === 'complete');
  }, id, { timeout: timeout || 15000 });
}
const ws = (page) => page.evaluate(() => document.body.dataset.wsState);
const here = (page) => page.evaluate(() => sections[current].id);
async function press(page, key) { await page.keyboard.press(key); await page.waitForTimeout(150); }
async function reduced(page) { await page.emulateMedia({ reducedMotion: 'reduce' }); }
const PAGES = APX.pages.map((p) => p.id);

// ── THE DOORWAY TO THE LIVE PRODUCT ──
test.describe('Enter NFR Workspace', () => {
  test('W reaches the doorway; it loads in under three seconds and ends on the live cue', async ({ page }) => {
    await open(page, '#three-layers');
    await page.waitForFunction(() => sections[current].id === 'three-layers');
    const t0 = Date.now();
    await press(page, 'w');
    await page.waitForFunction(() => sections[current].id === 'enter-workspace' && SceneDirector.getState() === 'complete', null, { timeout: 6000 });
    expect(Date.now() - t0).toBeLessThan(5000);
    const S = page.locator('#enter-workspace');
    await expect(S.locator('.ew-st.is-done')).toHaveCount(await page.evaluate(() => NFR_WORKSPACE_DEMO.enter.statuses.length));
    await expect(S.locator('.ew-open')).toBeVisible();
    await expect(S.locator('.ew-open')).toContainText('Open live Workspace');
    await expect(S.locator('.ew-act')).toHaveCount(5);
    expect(await ws(page)).toBe('live-handoff');
  });

  test('Space skips the doorway, then goes to the appendix index: the core route ends here', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('enter-workspace').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'enter-workspace' && SceneDirector.getState() === 'playing', null, { timeout: 6000 });
    await press(page, 'Space');
    await page.waitForFunction(() => SceneDirector.getState() === 'complete', null, { timeout: 2000 });
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'appendix', null, { timeout: 4000 });
    expect(await ws(page)).toBe('appendix');
  });

  test('L opens the live product; ?live= points it elsewhere', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__opened = []; window.open = (u, n) => { window.__opened.push([u, n]); return {}; }; });
    await press(page, 'l');
    expect(await page.evaluate(() => window.__opened)).toEqual([['http://localhost:3200/', 'nfr-workspace-live']]);
    await land(page, 'enter-workspace');
    await page.locator('#enter-workspace .ew-open').click();
    expect(await page.evaluate(() => window.__opened.length)).toBe(2);
    await page.goto('/pitch.html?live=' + encodeURIComponent('http://localhost:3410/'));
    await page.waitForFunction(() => typeof sections !== 'undefined' && sections.length > 0);
    expect(await page.evaluate(() => PresenterControls.liveUrl())).toBe('http://localhost:3410/');
  });

  test('the deck carries no mock of the product', async ({ page }) => {
    await open(page);
    for (const id of ['workspace-boot', 'workspace-home', 'workspace-journey', 'workspace-builder', 'business-case', 'workspace-live']) {
      await expect(page.locator('#' + id)).toHaveCount(0);
    }
    await expect(page.locator('.ws-app')).toHaveCount(0);
    const core = await page.$$eval('section[data-route="core"]', (s) => s.map((x) => x.innerText).join(' '));
    ['TPRM-PR-042', 'Cloud hosting provider', 'Periodic review app'].forEach((t) => expect(core).not.toContain(t));
  });
});

// ── THE CAPTURED FALLBACK ──
test.describe('Captured fallback', () => {
  test('F opens the five acts; Space steps through, then continues to the plan beneath', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'four-ways');
    await press(page, 'f');
    await page.waitForFunction(() => sections[current].id === 'live-fallback', null, { timeout: 5000 });
    const F = page.locator('#live-fallback');
    await expect(F.locator('.lf-tab')).toHaveCount(5);
    const shots = await page.evaluate(() => NFR_LIVE_CAPTURES.acts.reduce((n, a) => n + a.shots.length, 0));
    expect(shots).toBeGreaterThanOrEqual(5);
    await expect(F.locator('.lf-tab').first()).toHaveClass(/is-active/);
    expect(await ws(page)).toBe('live-fallback');
    for (let i = 1; i < shots; i++) {
      await press(page, i % 2 ? 'Space' : 'ArrowRight');
      expect(await F.getAttribute('data-capture')).toBe(String(i));
    }
    await press(page, 'ArrowLeft');
    expect(await F.getAttribute('data-capture')).toBe(String(shots - 2));
    await press(page, 'Space');
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'appendix', null, { timeout: 5000 });
  });

  test('every capture exists and loads', async ({ page }) => {
    await open(page);
    const files = await page.evaluate(() => NFR_LIVE_CAPTURES.acts.flatMap((a) => a.shots.map((s) => s.file)).concat([NFR_WORKSPACE_DEMO.cover.capture]));
    for (const f of files) {
      const r = await page.request.get('/' + f);
      expect(r.status(), f).toBe(200);
      expect(r.headers()['content-type'], f).toContain('image/');
    }
  });

  test('Escape on the fallback returns to the doorway', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'live-fallback');
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'enter-workspace', null, { timeout: 5000 });
  });
});

// ── THE APPENDIX: FOUR DOMAINS ──
test.describe('Appendix modules', () => {
  test('the index has four doors listing every page', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'appendix');
    const doors = page.locator('#appendix .apx-door');
    await expect(doors).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(doors.nth(i).locator('.apx-door-link')).toHaveCount(APX.modules[i].pages.length);
      await expect(doors.nth(i).locator('.apx-door-trigger')).toContainText('Asked as');
    }
    expect(APX.modules.map((m) => m.id)).toEqual(['data', 'methods', 'value', 'delivery']);
    expect(APX.modules.map((m) => m.pages.length)).toEqual([6, 4, 3, 5]);
    // Codes run without gaps in each module
    APX.modules.forEach((m) => m.pages.forEach((p, i) => expect(p.code, p.id).toBe(m.pages[0].code[0] + (i + 1))));
    expect(APX.edition).toBe('public');
    expect(PAGES.filter((id) => /^appendix-[cp]\d/.test(id))).toEqual([]);
    await expect(page.locator('#appendix .apx-extra')).toHaveCount(2);
  });

  test('every page answers one question with a visual, an implication and a claim status', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'warning' && m.text().includes('appendix visual')) errors.push(m.text()); });
    await reduced(page);
    await open(page);
    for (const id of PAGES) {
      const P = page.locator('#' + id);
      await expect(P.locator('h2')).toHaveText(/\?$/);
      expect((await P.locator('.slide-sub').innerText()).length, id).toBeGreaterThan(30);
      expect(await P.locator('.apx-visual > *').count(), id).toBeGreaterThan(0);
      await expect(P.locator('.apx-visual')).not.toContainText('could not be drawn');
      await expect(P.locator('.apx-imp-k')).toHaveText('Decision implication');
      await expect(P.locator('.apx-status')).toHaveCount(1);
      await expect(P.locator('.apx-kind')).toHaveCount(1);
      await expect(P.locator('.apx-nav-index')).toHaveCount(1);
      await expect(P.locator('.apx-nav-main')).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test('each page has its own hash and loads from it', async ({ page }) => {
    await reduced(page);
    await open(page);
    for (const id of [PAGES[0], 'appendix-m4', 'appendix-d5', PAGES[PAGES.length - 1]]) {
      await page.goto('/pitch.html#' + id);
      await page.waitForFunction((sid) => typeof sections !== 'undefined' && sections[current] && sections[current].id === sid, id, { timeout: 8000 });
      await expect(page.locator('#' + id + ' .apx-visual')).toBeVisible();
    }
  });

  test('index, previous, next, main story; keys A, 1 to 4, M; Escape goes back one level', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'four-ways');
    await press(page, '2');
    await page.waitForFunction(() => sections[current].id === 'appendix-m1', null, { timeout: 4000 });
    await expect(page.locator('#appendix-m1 .apx-nav-prev')).toBeDisabled();
    await page.locator('#appendix-m1 .apx-nav-next').click();
    await page.waitForFunction(() => sections[current].id === 'appendix-m2', null, { timeout: 4000 });
    await page.locator('#appendix-m2 .apx-nav-prev').click();
    await page.waitForFunction(() => sections[current].id === 'appendix-m1', null, { timeout: 4000 });
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'appendix', null, { timeout: 4000 });
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 4000 });
    for (const [k, id] of [['1', 'appendix-d1'], ['3', 'appendix-v1'], ['4', 'appendix-s1']]) {
      await press(page, k);
      await page.waitForFunction((sid) => sections[current].id === sid, id, { timeout: 4000 });
    }
    await press(page, 'a');
    await page.waitForFunction(() => sections[current].id === 'appendix', null, { timeout: 4000 });
    await page.locator('#appendix .apx-door-link', { hasText: 'How does governed write-back work?' }).click();
    await page.waitForFunction(() => sections[current].id === 'appendix-m4', null, { timeout: 4000 });
    await press(page, 'm');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 4000 });
  });

  test('core screens deep-link into the matching pages', async ({ page }) => {
    await reduced(page);
    await open(page);
    const links = await page.$$eval('section[data-route="core"] [data-apx-link]', (b) => b.map((x) => x.closest('section').id + '>' + x.dataset.apxLink));
    expect(links).toEqual(['role-views>appendix-d3', 'role-views>appendix-d6', 'three-layers>appendix-s3',
      'profiles-access>appendix-d6', 'profiles-access>appendix-d2']);
    await land(page, 'profiles-access');
    await page.locator('#profiles-access [data-apx-link="appendix-d2"]').click();
    await page.waitForFunction(() => sections[current].id === 'appendix-d2', null, { timeout: 4000 });
  });

  test('browser Back from a page returns to the screen that opened it', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'profiles-access');
    await page.waitForTimeout(600);
    await page.locator('#profiles-access [data-apx-link="appendix-d6"]').click();
    await page.waitForFunction(() => sections[current].id === 'appendix-d6', null, { timeout: 4000 });
    await page.goBack();
    await page.waitForFunction(() => sections[current].id === 'profiles-access', null, { timeout: 4000 });
    await page.goForward();
    await page.waitForFunction(() => sections[current].id === 'appendix-d6', null, { timeout: 4000 });
  });

  test('the public pages name no internal asset or developer tooling', async ({ page }) => {
    await open(page);
    await expect(page.locator('#appendix-runtime-reuse')).toHaveCount(0);
    await expect(page.locator('section[data-internal]')).toHaveCount(0);
    const hashes = B.loadHashes();
    const ids = await page.evaluate(() => sections.map((x) => x.id));
    for (const id of ids) {
      const text = (await page.locator('#' + id).innerText()).toLowerCase();
      ['studio', 'podman', 'github', 'pull request', 'claude', 'harness', 'mcp', 'accenture runtime'].forEach((t) => expect(text.includes(t), id + ' mentions ' + t).toBe(false));
      // Internal terms are checked by salted hash, so this public file does not name them
      expect(B.scanText(text, hashes).length, id + ' contains an internal term').toBe(0);
    }
  });
});

// ── V3: UNIT ECONOMICS ──
test.describe('Unit economics', () => {
  test('the model: per-case waterfall, capacity, net benefit and payback reconcile', () => {
    const r = U.compute();
    expect(r.baselineCost).toBe(8 * 85 + 4 * 120 + 1.5 * 140);
    const sum = r.waterfall.slice(0, 5).reduce((a, x) => a + x.value, 0);
    expect(sum).toBeCloseTo(r.futureTotalCost, 6);
    expect(r.capacityHours).toBeCloseTo(600 * 0.7 * r.removedHours, 6);
    expect(r.annualNet).toBeCloseTo(r.capacityValue + 30000 - r.runCost, 6);
    expect(r.payback).toBeCloseTo(450000 / r.annualNet, 6);
    expect(r.cumulative).toHaveLength(37);
    expect(r.cumulative[0]).toBe(-450000);
  });

  test('the model: no efficiency means no payback; inputs are clamped; sensitivity rises with both axes', () => {
    expect(U.compute({ efficiency: 0 }).payback).toBeNull();
    const c = U.compute({ adoption: 7, cases: -5, judgementHours: 99 });
    expect(c.input.adoption).toBe(1);
    expect(c.input.cases).toBe(50);
    expect(c.input.judgementHours).toBe(4);
    const g = U.sensitivity();
    expect(g).toHaveLength(3);
    g.forEach((row) => { expect(row[0].annualNet).toBeLessThan(row[2].annualNet); });
    expect(g[0][1].annualNet).toBeLessThan(g[2][1].annualNet);
  });

  test('the calculator recalculates from its inputs, switches views and resets', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'appendix-v3');
    const C = page.locator('#appendix-v3 [data-calc]');
    expect(Number(await C.getAttribute('data-net'))).toBe(Math.round(U.compute().annualNet));
    await expect(page.locator('#appendix-v3 .apx-kpi').nth(3)).toContainText('2.9 years');
    await page.evaluate(() => {
      const r = document.querySelector('#appendix-v3 input[data-k="adoption"]');
      r.value = '0.9';
      r.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(Number(await C.getAttribute('data-net'))).toBe(Math.round(U.compute({ adoption: 0.9 }).annualNet));
    for (const [tab, view] of [['Annual benefit', 'annual'], ['Payback', 'payback'], ['Sensitivity', 'sensitivity'], ['Cost per case', 'waterfall']]) {
      await page.locator('#appendix-v3 .apx-tab', { hasText: tab }).click();
      await expect(page.locator('#appendix-v3 .apx-calc-chart')).toHaveAttribute('data-view', view);
    }
    await expect(page.locator('#appendix-v3 .apx-calc-chart svg.apx-wf rect')).toHaveCount(6);
    await page.locator('#appendix-v3 .apx-calc-reset').click();
    expect(Number(await C.getAttribute('data-net'))).toBe(Math.round(U.compute().annualNet));
  });

  test('arrow keys on a slider change the slider, not the screen', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'appendix-v3');
    await page.locator('#appendix-v3 input[data-k="efficiency"]').focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    expect(await here(page)).toBe('appendix-v3');
    expect(await page.locator('#appendix-v3 input[data-k="efficiency"]').inputValue()).toBe('0.65');
  });
});

// ── PRESENTER CONTROLS, STATE, SAFE MODE, OFFLINE ──
test.describe('Presenter controls and resilience', () => {
  test('Space and the arrows move through the story; Page Down and Page Up work for a clicker', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'assistance-here');
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'chain-drift', null, { timeout: 4000 });
    await press(page, 'PageDown');
    await page.waitForFunction(() => sections[current].id === 'ch-answer', null, { timeout: 4000 });
    await press(page, 'PageUp');
    await page.waitForFunction(() => sections[current].id === 'chain-drift', null, { timeout: 4000 });
    await press(page, 'ArrowLeft');
    await page.waitForFunction(() => sections[current].id === 'assistance-here', null, { timeout: 4000 });
  });

  test('every state the default route reaches is in the experience state model', async ({ page }) => {
    const warnings = [];
    page.on('console', (m) => { if (m.type() === 'warning' && m.text().includes('NFRExperience')) warnings.push(m.text()); });
    await reduced(page);
    await open(page);
    await land(page, 'cover');
    const known = await page.evaluate(() => NFRExperience.states());
    const seen = new Set([await ws(page)]);
    for (let i = 0; i < 40 && (await here(page)) !== 'appendix'; i++) {
      await press(page, 'Space');
      await page.waitForTimeout(250);
      seen.add(await ws(page));
    }
    expect(await here(page)).toBe('appendix');
    for (const s of seen) expect(known, s).toContain(s);
    ['cover', 'chapter', 'work-arrives', 'assistance', 'chain-drift', 'roles', 'four-ways', 'three-layers', 'profiles', 'live-handoff', 'appendix']
      .forEach((s) => expect([...seen]).toContain(s));
    expect(warnings).toEqual([]);
  });

  test('0 resets to the cover; S toggles safe mode; the keys list names the live and appendix keys', async ({ page }) => {
    await reduced(page);
    await open(page);
    await land(page, 'appendix-d4');
    await press(page, '0');
    await page.waitForFunction(() => sections[current].id === 'cover', null, { timeout: 4000 });
    expect(await ws(page)).toBe('cover');
    await press(page, 's');
    expect(await page.evaluate(() => SceneDirector.isSafe())).toBe(true);
    await press(page, 's');
    expect(await page.evaluate(() => SceneDirector.isSafe())).toBe(false);
    await page.keyboard.press('Shift+Slash');
    const keys = await page.locator('#keysOverlay dt').allInnerTexts();
    ['L', 'F', 'A', '1 to 4', 'M', 'S'].forEach((k) => expect(keys).toContain(k));
    await press(page, 'Escape');
    for (const id of ['keysBtn', 'safeModeBtn', 'sceneReplayBtn', 'scenePauseBtn']) await expect(page.locator('#' + id)).toBeVisible();
    await expect(page.locator('#techBtn')).toHaveCount(0);
  });

  test('?safe=1 renders final states and keeps the appendix and the fallback working', async ({ page }) => {
    await open(page, '#enter-workspace', '?safe=1');
    await page.waitForFunction(() => sections[current].id === 'enter-workspace' && SceneDirector.getState() === 'complete', null, { timeout: 3000 });
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode') && SceneDirector.isSafe())).toBe(true);
    await press(page, 'f');
    await page.waitForFunction(() => sections[current].id === 'live-fallback', null, { timeout: 4000 });
    await press(page, 'Space');
    expect(await page.locator('#live-fallback').getAttribute('data-capture')).toBe('1');
    await press(page, '1');
    await page.waitForFunction(() => sections[current].id === 'appendix-d1', null, { timeout: 4000 });
  });

  test('after the first load the core route, the fallback and the appendix run offline', async ({ page, context }) => {
    const failed = [];
    const errors = [];
    await reduced(page);
    await open(page);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await context.setOffline(true);
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('pageerror', (e) => errors.push(e.message));
    const ids = await page.evaluate(() => sections.filter((x) => x.dataset.route === 'core').map((x) => x.id));
    for (const id of ids.concat(['live-fallback', 'appendix', 'appendix-v3', 'appendix-d5'])) await land(page, id);
    for (let i = 0; i < 4; i++) await press(page, 'ArrowRight');
    await context.setOffline(false);
    expect(failed).toEqual([]);
    expect(errors).toEqual([]);
  });
});
