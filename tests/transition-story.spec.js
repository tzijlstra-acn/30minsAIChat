// @ts-check
/**
 * TPRM transition story -- V27 core route acceptance tests.
 * One synthetic case, one process, one six-month route, one business case.
 * Every test sets its own viewport, so the file runs once, in the chromium project.
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const CORE = [
  'cover', 'pressure-gap', 'north-star', 'today-integration-layer', 'connection-work', 'pilot-trap',
  'prepared-decision', 'role-workspace', 'workspace-live', 'authority-boundary',
  'six-month-route', 'm6-proof', 'business-case',
  'reuse-core', 'integrated-delivery', 'first-move'
];
const CASE_SCREENS = ['connection-work', 'pilot-trap', 'prepared-decision', 'role-workspace', 'authority-boundary', 'm6-proof', 'business-case'];
const JARGON = ['agentic', 'multi-agent', 'slm', 'knowledge graph', 'semantic layer', 'control plane', 'orchestrator', 'model gateway'];
// Agreed floor for rendered canvas text (canvas px x fit scale). Canvas text is never set
// below 12px; the floor drops only where the viewport itself shrinks the stage.
const MIN_TEXT_PX = { '1920x1080': 11, '1440x900': 11, '1366x768': 10, '1280x720': 10, '1024x768': 9.5 };

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'story tests set their own viewport and run once');
});

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

async function open(page) {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html');
  await page.waitForSelector('section[data-slide]');
  await page.waitForFunction(() => typeof sections !== 'undefined' && sections.length > 0);
}

// Scroll to a core screen and wait until its scene reports complete
async function enter(page, id, timeout) {
  await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
  await page.waitForFunction((sid) => sections[current] && sections[current].id === sid && SceneDirector.getState() === 'complete',
    id, { timeout: timeout || 15000 });
}

function sceneFiles() {
  return fs.readdirSync(path.join(ROOT, 'assets/js/story/scenes')).filter((f) => f.endsWith('.js')).sort();
}

// ── SCENE CONTRACT ──
test.describe('Scene contract', () => {
  test('sixteen scene files, one per core screen, all registered', () => {
    const declared = [...read('pitch.html').matchAll(/data-route="core"[^>]*? data-scene="([a-z0-9-]+)"/g)].map((m) => m[1] + '.js').sort();
    expect(declared).toHaveLength(16);
    expect(sceneFiles()).toEqual(declared);
  });

  test('every scene supports the SceneDirector lifecycle and dispatches scene:complete', () => {
    const keys = ['play:', 'pause:', 'resume:', 'seek:', 'reset:', 'finish:', 'resize:', 'destroy:', 'renderStatic:', 'renderError:', 'getAccessibleSummary:'];
    for (const f of sceneFiles()) {
      const src = read('assets/js/story/scenes/' + f);
      expect(src, f).toContain("SceneDirector.register('" + f.replace('.js', '') + "'");
      keys.forEach((k) => expect(src, f + ' ' + k).toContain(k));
      expect(src, f).toContain('createTimeline(');
      expect(src, f).toContain('S.complete(container)');
      expect(src, f).not.toMatch(/cursor:\s*pointer/);
    }
  });

  test('scenes read case facts from TPRM_CASE instead of hard-coding them', () => {
    const facts = ['TPRM-PR-042', 'Ireland', 'Two exceptions', 'September', 'Penetration-test', '30-day', 'Cloud hosting'];
    for (const f of sceneFiles()) {
      const src = read('assets/js/story/scenes/' + f);
      facts.forEach((fact) => expect(src.includes(fact), f + ' hard-codes "' + fact + '"').toBe(false));
    }
  });

  test('every core screen has a static fallback SVG on its design canvas', () => {
    const html = read('pitch.html');
    for (const id of CORE) {
      const start = html.indexOf('<section id="' + id + '"');
      const chunk = html.slice(start, html.indexOf('</section>', start));
      const box = id === 'cover' ? '0 0 560 440' : '0 0 1040 520';
      expect(chunk, id).toContain('<svg data-scene-fallback viewBox="' + box + '" preserveAspectRatio="xMidYMid meet"');
    }
  });

  test('manifest titles match the screen titles, within word limits', async ({ page }) => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    await open(page);
    for (const s of m.screens) {
      const h2 = (await page.locator('#' + s.id + ' h2').textContent()).trim();
      const sub = (await page.locator('#' + s.id + ' .slide-sub').textContent()).trim();
      expect(h2, s.id).toBe(s.title);
      expect(sub, s.id).toBe(s.subtitle);
      expect(h2.split(/\s+/).length, s.id).toBeLessThanOrEqual(10);
      expect(sub.split(/\s+/).length, s.id).toBeLessThanOrEqual(22);
      expect(await page.locator('#' + s.id).getAttribute('data-scene'), s.id).toBe(s.scene);
    }
  });
});

// ── PLAYBACK ──
test.describe('Playback', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('reduced motion: every scene shows a complete static state and dispatches scene:complete', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Listen before load: the cover completes immediately under reduced motion
    await page.addInitScript(() => {
      window.__done = [];
      document.addEventListener('scene:complete', (e) => { const s = e.target.closest('section'); if (s) window.__done.push(s.id); });
    });
    await open(page);
    for (const id of CORE) {
      await enter(page, id);
      const info = await page.evaluate((sid) => {
        const st = document.querySelector('#' + sid + ' [data-scene-container]');
        const cv = st.querySelector('.ts-canvas');
        const summary = st.querySelector('.scene-accessible-summary');
        const hidden = cv ? [...cv.querySelectorAll('.ts-hide')].filter((e) => !e.classList.contains('ts-on') && !e.classList.contains('is-dropped')).length : -1;
        return { canvas: !!cv, children: cv ? cv.children.length : 0, summary: summary ? summary.textContent.length : 0, hidden: hidden };
      }, id);
      expect(info.canvas, id).toBe(true);
      expect(info.children, id).toBeGreaterThan(3);
      expect(info.summary, id + ' accessible summary').toBeGreaterThan(60);
      expect(info.hidden, id + ' elements left hidden in the final state').toBe(0);
    }
    const done = await page.evaluate(() => window.__done);
    CORE.forEach((id) => expect(done, id).toContain(id));
  });

  test('full motion: every scene plays to completion and dispatches scene:complete', async ({ page }) => {
    test.setTimeout(240000);
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    await open(page);
    for (const s of m.screens) {
      const started = Date.now();
      await enter(page, s.id, s.durationMs + 6000);
      expect(Date.now() - started, s.id + ' completed suspiciously fast').toBeGreaterThan(Math.min(2000, s.durationMs / 3));
    }
  });

  test('pause holds the timeline and resume continues from the same point', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('connection-work').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'connection-work' && SceneDirector.getState() === 'playing');
    await page.waitForTimeout(1600);
    await page.evaluate(() => SceneDirector.togglePause());
    const shown = await page.evaluate(() => document.querySelectorAll('#connection-work .ts-on').length);
    await page.waitForTimeout(1800);
    expect(await page.evaluate(() => document.querySelectorAll('#connection-work .ts-on').length)).toBe(shown);
    await page.evaluate(() => SceneDirector.togglePause());
    await page.waitForFunction(() => SceneDirector.getState() === 'complete', null, { timeout: 12000 });
  });
});

// ── CASE PERSISTENCE ──
test.describe('Synthetic case', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the case identifier appears on every case screen, from TPRM_CASE', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const id = await page.evaluate(() => window.TPRM_CASE.id);
    expect(id).toBe('TPRM-PR-042');
    for (const sid of CASE_SCREENS) {
      await enter(page, sid);
      const stageText = await page.locator('#' + sid + ' [data-scene-container]').innerText();
      expect(stageText, sid).toContain(id);
      await expect(page.locator('#' + sid + ' .case-thread'), sid).toContainText(id);
    }
  });

  test('the case is marked synthetic and immutable', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => ({ frozen: Object.isFrozen(window.TPRM_CASE) && Object.isFrozen(window.TPRM_CASE.changes[0]), synthetic: window.TPRM_CASE.synthetic }));
    expect(r).toEqual({ frozen: true, synthetic: true });
    const threads = await page.$$eval('.case-thread', (t) => t.map((x) => x.textContent));
    threads.forEach((t) => expect(t).toContain('Synthetic example'));
  });

  test('the visible case state moves forward through the route', async ({ page }) => {
    await open(page);
    const order = await page.evaluate(() => {
      const ids = window.TPRM_CASE.states.map((s) => s.id);
      return [...document.querySelectorAll('section[data-route="core"] .case-thread')].map((t) => ids.indexOf(t.dataset.caseState));
    });
    expect(order.every((v) => v >= 0)).toBe(true);
    for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThanOrEqual(order[i - 1]);
  });

  test('missing evidence stays visible and writes wait for approval', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'prepared-decision');
    await expect(page.locator('#prepared-decision .ts-uncertain')).toContainText('Missing');
    await expect(page.locator('#prepared-decision .ts-gate')).toContainText('Write only after approval');
    await enter(page, 'authority-boundary');
    await expect(page.locator('#authority-boundary .ts-receipt[data-state="acknowledged"]')).toBeVisible();
  });
});

// ── LAYOUT AT SUPPORTED VIEWPORTS ──
for (const [w, h] of [[1440, 900], [1366, 768], [1280, 720], [1920, 1080], [1024, 768]]) {
  const vp = w + 'x' + h;
  test.describe('Layout ' + vp, () => {
    test.use({ viewport: { width: w, height: h } });

    test('every scene fits its stage, keeps text above the size floor and truncates nothing', async ({ page }) => {
      test.setTimeout(120000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      for (const id of CORE) {
        await enter(page, id);
        const r = await page.evaluate(([sid, min]) => {
          const st = document.querySelector('#' + sid + ' [data-scene-container]');
          const cv = st.querySelector('.ts-canvas');
          const scale = parseFloat(cv.dataset.scale || '1');
          const sr = st.getBoundingClientRect();
          const cr = cv.getBoundingClientRect();
          const out = [];
          const small = [];
          const cut = [];
          if (cr.left < sr.left - 1 || cr.right > sr.right + 1 || cr.top < sr.top - 1 || cr.bottom > sr.bottom + 1) out.push('canvas');
          cv.querySelectorAll('*').forEach((el) => {
            if (el.closest('.ts-svg') || el.closest('.scene-accessible-summary')) return;
            if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            if (r.left < cr.left - 2 || r.right > cr.right + 2 || r.top < cr.top - 2 || r.bottom > cr.bottom + 2) out.push(el.className || el.tagName);
            const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (ownText) {
              const px = parseFloat(getComputedStyle(el).fontSize) * scale;
              if (px < min) small.push((el.textContent || '').trim().slice(0, 30) + ' ' + px.toFixed(1));
              if (getComputedStyle(el).textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) cut.push((el.textContent || '').slice(0, 40));
            }
          });
          return { out: out.slice(0, 5), small: small.slice(0, 5), cut: cut.slice(0, 5) };
        }, [id, MIN_TEXT_PX[vp]]);
        expect(r.out, id + ' elements outside the canvas at ' + vp).toEqual([]);
        expect(r.small, id + ' text below ' + MIN_TEXT_PX[vp] + 'px at ' + vp).toEqual([]);
        expect(r.cut, id + ' truncated text at ' + vp).toEqual([]);
      }
    });

    test('no core screen overflows and every footer is fully visible', async ({ page }) => {
      await open(page);
      for (const id of CORE) {
        await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
        const r = await page.evaluate((sid) => {
          const s = document.getElementById(sid);
          const footer = s.querySelector('.scene-footer') || s.querySelector('.landing-route');
          const f = footer.getBoundingClientRect();
          return { overflow: s.scrollWidth > s.clientWidth + 2, footerBottom: f.bottom, vh: window.innerHeight };
        }, id);
        expect(r.overflow, id).toBe(false);
        expect(r.footerBottom, id + ' footer below the viewport').toBeLessThanOrEqual(r.vh + 1);
      }
    });
  });
}

// ── FALLBACKS ──
test.describe('Static fallbacks', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('a scene script that fails to load leaves its static fallback visible', async ({ page }) => {
    await page.route('**/scenes/prepared-decision.js*', (route) => route.abort());
    await open(page);
    await page.evaluate(() => document.getElementById('prepared-decision').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1200);
    const box = await page.locator('#prepared-decision [data-scene-fallback]').boundingBox();
    expect(box && box.height).toBeGreaterThan(100);
  });

  test('a scene that throws while rendering restores its static fallback', async ({ page }) => {
    await page.route('**/scenes/pilot-trap.js*', async (route) => {
      const res = await route.fetch();
      const body = (await res.text())
        .replace('play: function() {', "play: function() { throw new Error('simulated play failure');")
        .replace('finish: function() {', "finish: function() { throw new Error('simulated finish failure');");
      await route.fulfill({ response: res, body: body });
    });
    await open(page);
    await page.evaluate(() => document.getElementById('pilot-trap').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'pilot-trap' && SceneDirector.getState() === 'error', null, { timeout: 8000 });
    const box = await page.locator('#pilot-trap [data-scene-fallback]').boundingBox();
    expect(box && box.height).toBeGreaterThan(100);
  });
});

// ── COPY AND CLAIMS ──
test.describe('Copy and claims', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('visible core text has no em dash, no en dash, no unlabelled percentage and no unexplained jargon', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const id of CORE) {
      await enter(page, id);
      const text = await page.locator('#' + id).innerText();
      expect(text.includes(EM) || text.includes(EN), id + ' dash').toBe(false);
      const lower = text.toLowerCase();
      JARGON.forEach((j) => expect(new RegExp('\\b' + j + '\\b').test(lower), id + ' uses "' + j + '"').toBe(false));
      if (id === 'business-case') {
        expect(text).toContain('Illustrative only. Replace with client baseline.');
      } else {
        expect(text.includes('%'), id + ' shows a percentage outside the labelled business case').toBe(false);
      }
    }
  });

  test('no runtime request leaves the local origin', async ({ page, baseURL }) => {
    const origin = new URL(baseURL || 'http://localhost:8080').origin;
    const external = [];
    page.on('request', (req) => {
      const u = req.url();
      if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u);
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const id of CORE) await enter(page, id);
    await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
    await page.waitForSelector('#ref-room .ea-shell', { timeout: 8000 });
    expect(external).toEqual([]);
  });
});

// ── BUSINESS CASE ──
test.describe('Business case', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'business-case');
  });

  test('illustrative defaults: 5.8 hours returned, labelled illustrative, expected scenario', async ({ page }) => {
    await expect(page.locator('#business-case .bc-out-main .bc-out-value')).toContainText('5.8 h');
    await expect(page.locator('#business-case .bc-claim')).toHaveText('Illustrative only. Replace with client baseline.');
    await expect(page.locator('#business-case .bc-sc-btn[aria-pressed="true"]')).toHaveText('Expected');
  });

  test('professional judgement is not automated in the calculator', async ({ page }) => {
    const judge = page.locator('#business-case .bc-row-judge');
    await expect(judge.locator('input[aria-label*="preparation rate"]')).toHaveCount(0);
    await expect(judge.locator('.bc-lock')).toBeVisible();
    expect(await judge.locator('.bc-bar-prep').evaluate((e) => e.style.width)).toBe('0px');
    await expect(page.locator('#business-case .bc-out').filter({ hasText: 'Control outcome' })).toContainText('Judgement 100% human');
  });

  test('negative annual value shows Not yet positive instead of a payback', async ({ page }) => {
    await page.evaluate(() => BusinessCaseState.setField('runCost.platform', 5000000));
    await expect(page.locator('#business-case .bc-out-payback .bc-out-value')).toContainText('Not yet positive');
  });

  test('inputs persist while navigating away and back, in sessionStorage only', async ({ page }) => {
    const input = page.locator('#business-case input[data-path="categories.find.hours"]');
    await input.fill('4');
    await input.press('Tab');
    await expect(page.locator('#business-case .bc-claim')).toContainText('Client baseline');
    await enter(page, 'cover');
    await enter(page, 'business-case');
    await expect(page.locator('#business-case input[data-path="categories.find.hours"]')).toHaveValue('4');
    const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('nfr_roi_assumptions_v1')));
    expect(stored.assumptions.categories.find((c) => c.id === 'find').hours).toBe(4);
  });

  test('reset restores the illustrative defaults and label', async ({ page }) => {
    const input = page.locator('#business-case input[data-path="categories.find.hours"]');
    await input.fill('6');
    await input.press('Tab');
    await page.locator('#business-case .bc-tools button', { hasText: 'Reset' }).click();
    await expect(input).toHaveValue('2.5');
    await expect(page.locator('#business-case .bc-claim')).toHaveText('Illustrative only. Replace with client baseline.');
    expect(await page.evaluate(() => sessionStorage.getItem('nfr_roi_assumptions_v1'))).toBeNull();
  });

  test('scenario toggles work from the keyboard', async ({ page }) => {
    const stretch = page.locator('#business-case .bc-sc-btn', { hasText: 'Stretch' });
    await stretch.focus();
    await page.keyboard.press('Space');
    await expect(stretch).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#business-case .bc-out').filter({ hasText: 'Reuse for the next journey' })).toContainText('avoided build');
    const cons = page.locator('#business-case .bc-sc-btn', { hasText: 'Conservative' });
    await cons.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#business-case .bc-out').filter({ hasText: 'Elapsed time' })).toContainText('Not counted');
  });

  test('recalculated outputs are announced politely', async ({ page }) => {
    await page.evaluate(() => BusinessCaseState.setField('annualReviewVolume', 2000));
    const live = page.locator('#business-case .ts-canvas [aria-live="polite"]');
    await expect(live).toContainText('Recalculated', { timeout: 3000 });
  });

  test('assumptions drawer opens, edits the case and closes with Escape', async ({ page }) => {
    const before = await page.locator('#business-case .bc-out').filter({ hasText: 'Annual capacity' }).locator('.bc-out-value').textContent();
    await page.locator('#business-case .bc-tools button', { hasText: 'Assumptions' }).click();
    await expect(page.locator('#drawerOverlay')).toHaveClass(/open/);
    expect(await page.locator('#drawerBody input').count()).toBeGreaterThanOrEqual(10);
    const vol = page.locator('#drawerBody input[aria-label="Periodic reviews per year"]');
    await vol.fill('2000');
    await vol.press('Tab');
    await page.keyboard.press('Escape');
    await expect(page.locator('#drawerOverlay')).not.toHaveClass(/open/);
    const after = await page.locator('#business-case .bc-out').filter({ hasText: 'Annual capacity' }).locator('.bc-out-value').textContent();
    expect(after).not.toBe(before);
  });

  test('the agenda quick jump opens the assumptions drawer', async ({ page }) => {
    await enter(page, 'cover');
    await page.evaluate(() => openAgenda());
    await page.locator('#agendaRoiJump').click();
    await expect(page.locator('#drawerOverlay')).toHaveClass(/open/, { timeout: 4000 });
    await expect(page.locator('#drawerTitle')).toHaveText('Business-case assumptions');
  });
});

// ── EVIDENCE ATLAS LINKS ──
test.describe('Evidence Atlas links', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('core screens open their atlas view, and the view leads back to the screen', async ({ page }) => {
    test.setTimeout(90000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const links = [
      ['pilot-trap', 'Reference architecture'],
      ['authority-boundary', 'Controlled write'],
      ['six-month-route', 'Workstreams and gates'],
      ['business-case', 'Formulas and assumptions'],
      ['reuse-core', 'Reuse across NFR journeys']
    ];
    for (const [screen, label] of links) {
      await enter(page, screen);
      await page.locator('#' + screen + ' .ts-atlas-link').click();
      await expect(page.locator('#ref-room .ea-rail-btn.active')).toHaveText(label, { timeout: 8000 });
      await page.locator('#ref-room .ea-back-btn').click();
      await page.waitForFunction((sid) => sections[current].id === sid, screen, { timeout: 8000 });
    }
  });

  test('each new atlas view links back to its core screen', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
    await page.waitForSelector('#ref-room .ea-shell', { timeout: 8000 });
    for (const [view, screen] of [['controlled-write', 'authority-boundary'], ['workstreams', 'six-month-route'], ['economics', 'business-case'], ['reuse', 'reuse-core']]) {
      await page.evaluate((v) => EvidenceAtlas.switchView(v), view);
      await page.locator('#ref-room .ea-story-back').click();
      await page.waitForFunction((sid) => sections[current].id === sid, screen, { timeout: 8000 });
      await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
      await page.waitForFunction(() => sections[current].id === 'ref-room');
    }
  });
});

// ── OPENING ORDER ──
test.describe('Opening', () => {
  test('the route opens with the hook, then the north star, then the TPRM officer', () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.screens.slice(0, 4).map((s) => s.id)).toEqual(['cover', 'pressure-gap', 'north-star', 'today-integration-layer']);
    expect(m.screens[1].chapterId).toBe('setting-scene');
    expect(m.screens[2].chapterId).toBe('setting-scene');
    expect(m.screens[3].subtitle).toContain('Worked example: one TPRM officer');
  });
});

// ── APPENDIX ──
test.describe('Appendix', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('everything after the core route is labelled appendix, in story order', async ({ page }) => {
    await open(page);
    const ref = await page.$$eval('section[data-route="reference"]', (s) => s.map((x) => ({
      id: x.id, chapter: x.dataset.chapterTitle,
      tag: (x.querySelector('.sec-tag') || {}).textContent || ''
    })));
    expect(ref[0].id).toBe('appendix');
    ref.forEach((r) => expect(r.chapter, r.id).toBe('APPENDIX'));
    const tags = ref.filter((r) => r.id.startsWith('app-')).map((r) => r.tag);
    expect(tags).toHaveLength(6);
    tags.forEach((t, i) => expect(t).toMatch(new RegExp('^Appendix A' + (i + 1) + ' . Behind ')));
    const allCore = await page.$$eval('section[data-slide]', (s) => s.map((x) => x.dataset.route));
    expect(allCore.lastIndexOf('core')).toBeLessThan(allCore.indexOf('reference'));
  });

  test('the appendix index links every appendix page and atlas deep dive', async ({ page }) => {
    await open(page);
    const targets = await page.$$eval('#appendix .apx-link', (a) => a.map((x) => x.dataset.atlasView ? 'atlas:' + x.dataset.atlasView : x.getAttribute('href').slice(1)));
    const pages = await page.$$eval('section[id^="app-"]', (s) => s.map((x) => x.id));
    pages.forEach((p) => expect(targets, p).toContain(p));
    ['reuse', 'risk-map', 'solutions', 'controlled-write', 'workstreams', 'economics', 'toolkit'].forEach((v) => expect(targets).toContain('atlas:' + v));
  });

  test('the nav tab and counter say Appendix', async ({ page }) => {
    await open(page);
    await expect(page.locator('.nav-ch-btn[data-chid="reference"] .nav-ch-name')).toHaveText('Appendix');
    await page.evaluate(() => document.getElementById('appendix').scrollIntoView({ behavior: 'instant' }));
    await expect(page.locator('#counter')).toHaveText('Appendix', { timeout: 4000 });
  });

  test('appendix copy stays consistent with the business-case rules', () => {
    const html = read('pitch.html');
    ['FTE redeployment rate', 'Penalty avoidance', 'five executive systems', 'transformation systems screen'].forEach((t) => expect(html).not.toContain(t));
  });
});

// ── LANDING AND CHAPTER DIVIDERS ──
const CHAPTERS = ['setting-scene', 'today', 'new-workday', 'six-months', 'scale-start'];

test.describe('Landing and dividers', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the first slide is a landing, not a standard screen', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => {
      const c = document.getElementById('cover');
      return { kind: c.dataset.kind, footer: !!c.querySelector('.scene-footer'), header: !!c.querySelector('.screen-hdr'),
        route: [...c.querySelectorAll('.landing-chapter')].map((b) => b.textContent) };
    });
    expect(r.kind).toBe('landing');
    expect(r.footer).toBe(false);
    expect(r.header).toBe(false);
    expect(r.route).toHaveLength(5);
  });

  test('landing chapter buttons jump to their dividers', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await page.locator('#cover .landing-chapter').nth(3).click();
    await page.waitForFunction(() => sections[current].id === 'ch-six-months', null, { timeout: 6000 });
  });

  test('one divider opens each chapter, right before its first screen', async ({ page }) => {
    await open(page);
    const order = await page.$$eval('section[data-slide]', (s) => s.map((x) => ({ id: x.id, route: x.dataset.route, ch: x.dataset.chapterId })));
    const dividers = order.filter((o) => o.route === 'divider');
    expect(dividers.map((d) => d.ch)).toEqual(CHAPTERS);
    dividers.forEach((d) => {
      const i = order.findIndex((o) => o.id === d.id);
      expect(order[i + 1].route, d.id).toBe('core');
      expect(order[i + 1].ch, d.id).toBe(d.ch);
      const before = order.slice(0, i).filter((o) => o.route === 'core' && o.ch === d.ch).map((o) => o.id);
      expect(before.filter((id) => id !== 'cover'), d.id + ' has chapter screens before it').toEqual([]);
    });
  });

  test('each divider lists the screens that follow it and marks where we are', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => [...document.querySelectorAll('section[data-route="divider"]')].map((d, i) => ({
      listed: [...d.querySelectorAll('[data-divider-screens] a')].map((a) => a.getAttribute('href').slice(1)),
      expected: [...document.querySelectorAll('section[data-route="core"][data-chapter-id="' + d.dataset.chapterId + '"]')].map((s) => s.id).filter((id) => id !== 'cover'),
      here: [...d.querySelectorAll('.divider-step')].findIndex((s) => s.classList.contains('is-here')),
      index: i
    })));
    r.forEach((d) => {
      expect(d.listed).toEqual(d.expected);
      expect(d.here).toBe(d.index);
    });
  });

  test('dividers are not counted as screens: the counter shows the chapter', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await page.evaluate(() => document.getElementById('ch-six-months').scrollIntoView({ behavior: 'instant' }));
    await expect(page.locator('#counter')).toHaveText('Ch 4 / 5', { timeout: 4000 });
    await enter(page, 'business-case');
    // The counter includes the landing, so the business case (tag 12) is screen 13 of 16
    await expect(page.locator('#counter')).toHaveText('13 / 16');
  });

  test('dividers stay out of the agenda and edge-rail screen lists', async ({ page }) => {
    await open(page);
    const agenda = await page.$$eval('#agendaStory .agenda-slide-link', (a) => a.map((x) => x.getAttribute('href')));
    expect(agenda.filter((h) => h.startsWith('#ch-'))).toEqual([]);
    const rail = await page.$$eval('#edgePanel [data-sid]', (a) => a.map((x) => x.dataset.sid));
    expect(rail.filter((s) => s.startsWith('ch-'))).toEqual([]);
  });

  test('dividers and the landing fill one viewport without overflow at every supported size', async ({ page }) => {
    for (const [w, h] of [[1440, 900], [1366, 768], [1280, 720], [1920, 1080], [1024, 768]]) {
      await page.setViewportSize({ width: w, height: h });
      await open(page);
      const bad = await page.evaluate(() => [...document.querySelectorAll('section[data-route="divider"], #cover')]
        .filter((s) => s.scrollWidth > s.clientWidth + 2 || s.scrollHeight > s.clientHeight + 2 || Math.abs(s.offsetHeight - window.innerHeight) > 2)
        .map((s) => s.id));
      expect(bad, w + 'x' + h).toEqual([]);
    }
  });

  test('the appendix opens with its own landing', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => {
      const a = document.getElementById('appendix');
      return { kind: a.dataset.kind, letter: (a.querySelector('.apx-letter') || {}).textContent, eyebrow: (a.querySelector('.divider-eyebrow') || {}).textContent };
    });
    expect(r).toEqual({ kind: 'appendix-landing', letter: 'A', eyebrow: 'End of the core route' });
  });
});

// ── WORKED-EXAMPLE FRAMING ──
test.describe('Worked-example framing', () => {
  test('the opening speaks for all of NFR; TPRM is introduced as the worked example', () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    const byId = Object.fromEntries(m.screens.map((s) => [s.id, s]));
    ['cover', 'pressure-gap', 'north-star'].forEach((id) => {
      expect(byId[id].title, id).not.toMatch(/TPRM|third-party/i);
    });
    expect(byId.cover.subtitle).toMatch(/every NFR domain/);
    expect(byId['today-integration-layer'].subtitle).toMatch(/^Worked example/);
    expect(byId['reuse-core'].subtitle).toMatch(/RCSA, issues, incidents and regulatory change/);
  });

  test('every chapter between the opening and the scale chapter marks the worked example', async ({ page }) => {
    await open(page);
    const r = await page.$$eval('section[data-route="divider"]', (d) => d.map((x) => ({ id: x.id, ex: (x.querySelector('.divider-example') || {}).textContent || '' })));
    r.filter((x) => ['ch-today', 'ch-new-workday', 'ch-six-months'].includes(x.id)).forEach((x) => expect(x.ex, x.id).toContain('TPRM periodic review. The same pattern applies'));
    expect(r.find((x) => x.id === 'ch-scale-start').ex).toContain('every NFR domain');
  });
});

// ── THE WORKSPACE, LIVE ──
test.describe('The workspace, live', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('sits in THE NEW WORKDAY after the role workspace and is labelled as the live product on synthetic data', async ({ page }) => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    const ids = m.screens.map((s) => s.id);
    expect(ids.indexOf('workspace-live')).toBe(ids.indexOf('role-workspace') + 1);
    expect(m.screens.find((s) => s.id === 'workspace-live').chapterId).toBe('new-workday');
    await open(page);
    await expect(page.locator('#workspace-live .sec-tag')).toHaveText(/THE NEW WORKDAY . 08 . LIVE PRODUCT/);
    await expect(page.locator('#workspace-live .scene-footer-evidence')).toContainText('SYNTHETIC INSTITUTION');
  });

  test('steps through three real captures, ends on the Skills builder, and each step can be shown again', async ({ page }) => {
    await open(page);
    await enter(page, 'workspace-live', 16000);
    const shots = page.locator('#workspace-live .wl-shot');
    await expect(shots).toHaveCount(3);
    const srcs = await shots.evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
    expect(srcs).toEqual(['./assets/img/nfros/nfros-home.jpg', './assets/img/nfros/nfros-partner.jpg', './assets/img/nfros/nfros-skills.jpg']);
    for (const src of srcs) expect(fs.existsSync(path.join(ROOT, src))).toBe(true);
    const loaded = await shots.evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth >= 1600));
    expect(loaded).toBe(true);
    await expect(page.locator('#workspace-live .wl-shot.is-active')).toHaveAttribute('src', /nfros-skills/);
    await page.locator('#workspace-live .wl-step').first().click();
    await expect(page.locator('#workspace-live .wl-shot.is-active')).toHaveAttribute('src', /nfros-home/);
    await expect(page.locator('#workspace-live .wl-step').first()).toHaveAttribute('aria-pressed', 'true');
    const alts = await shots.evaluateAll((imgs) => imgs.map((i) => i.alt.length));
    alts.forEach((n) => expect(n).toBeGreaterThan(40));
  });

  test('names the guardrails the product enforces', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-live');
    const text = await page.locator('#workspace-live [data-scene-container]').innerText();
    ['Read only', "Scoped to the role's entity", 'Every run audited', 'Works without a model key'].forEach((g) => expect(text).toContain(g));
  });
});
