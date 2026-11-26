// @ts-check
/**
 * NFR Workspace v7 -- core route acceptance tests.
 * Fourteen screens in four chapters: how the work arrives and drifts, the assistant and
 * the Workspace; one connected picture with a view per role, four ways and three layers; the doorway into the live product, the plan
 * beneath it, connected context and the authority boundary; value, qualify and prove,
 * experience and the workshop decision. The product is shown live; the deck carries no
 * mock of it. Bank-neutral, synthetic data.
 * Every test sets its own viewport, so the file runs once, in the chromium project.
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const CORE = [
  'cover', 'work-arrives', 'assistance-here', 'chain-drift', 'role-views', 'four-ways', 'three-layers', 'enter-workspace',
  'method-plan', 'connected-context', 'authority-boundary', 'value-decision', 'bring-in', 'workshop-decision'
];
const INTERACTIVE = ['role-views', 'enter-workspace', 'live-fallback'];
const JARGON = ['agentic', 'multi-agent', 'slm', 'knowledge graph', 'semantic layer', 'control plane', 'orchestrator', 'orchestration',
  'model gateway', 'autonomous', 'llm', 'rag', 'copilot'];
const CLAIMS = ['fully autonomous', 'replaces all systems', 'all nfr processes', 'zero human effort', 'instant deployment',
  'regulator-ready', 'guaranteed compliance', 'any agent in one sentence', 'skills built in a sentence', 'one team owns the whole loop']; // lint-ok: phrases the deck avoids
// Agreed floor for rendered canvas text (canvas px x fit scale)
const MIN_TEXT_PX = { '1920x1080': 11, '1600x900': 11, '1440x900': 11, '1366x768': 10, '1366x650': 9.4, '1280x720': 10, '1024x768': 9.5 };

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'story tests set their own viewport and run once');
});

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

async function open(page, hash) {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html' + (hash || ''));
  await page.waitForSelector('section[data-slide]');
  await page.waitForFunction(() => typeof sections !== 'undefined' && sections.length > 0);
}

// Scroll to a screen and wait until its scene reports complete
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
  test('fourteen core screens; one scene file per declared scene, core and appendix', () => {
    const html = read('pitch.html');
    const core = [...html.matchAll(/<section id="([a-z0-9-]+)" data-slide data-route="core"/g)].map((m) => m[1]);
    expect(core).toEqual(CORE);
    const declared = [...html.matchAll(/data-scene="([a-z0-9-]+)"/g)].map((m) => m[1] + '.js').sort();
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

  test('the doorway and the fallback are interactive: Space steps them with advance()', () => {
    for (const id of INTERACTIVE) expect(read('assets/js/story/scenes/' + id + '.js'), id).toContain('advance:');
  });

  test('scenes read their copy from data files instead of hard-coding it', () => {
    const facts = ['Third-Party Risk Manager', 'localhost:3200', 'Open live Workspace', 'Loading role context', 'Workshop decision',
      'Agent Builder', 'Today, in the live product', 'Which role, decision'];
    for (const f of sceneFiles()) {
      const src = read('assets/js/story/scenes/' + f).split('\n').filter((l) => /^\s*\/\//.test(l) === false).join('\n');
      facts.forEach((fact) => expect(src.includes(fact), f + ' hard-codes "' + fact + '"').toBe(false));
    }
  });

  test('every core screen has a static fallback SVG sized to its design canvas', () => {
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
    expect(m.version).toBe('42');
    expect(m.screens.filter((s) => s.route === 'core').map((s) => s.id)).toEqual(CORE);
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
        return { canvas: !!cv, nodes: cv ? cv.querySelectorAll('*').length : 0, summary: summary ? summary.textContent.length : 0, hidden: hidden };
      }, id);
      expect(info.canvas, id).toBe(true);
      expect(info.nodes, id).toBeGreaterThan(8);
      expect(info.summary, id + ' accessible summary').toBeGreaterThan(60);
      expect(info.hidden, id + ' elements left hidden in the final state').toBe(0);
    }
    await enter(page, 'live-fallback');
    expect(await page.locator('#live-fallback .scene-accessible-summary').textContent()).toContain('act 1');
    const done = await page.evaluate(() => window.__done);
    CORE.concat(['live-fallback']).forEach((id) => expect(done, id).toContain(id));
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
    await page.evaluate(() => document.getElementById('chain-drift').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'chain-drift' && SceneDirector.getState() === 'playing');
    await page.waitForTimeout(1600);
    await page.evaluate(() => SceneDirector.togglePause());
    const shown = await page.evaluate(() => document.querySelectorAll('#chain-drift .ts-on').length);
    await page.waitForTimeout(1800);
    expect(await page.evaluate(() => document.querySelectorAll('#chain-drift .ts-on').length)).toBe(shown);
    await page.evaluate(() => SceneDirector.togglePause());
    await page.waitForFunction(() => SceneDirector.getState() === 'complete', null, { timeout: 12000 });
  });
});

// ── DATA ──
test.describe('Story data', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the story and the appendix data are marked synthetic and immutable', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => ({
      demoFrozen: Object.isFrozen(window.NFR_WORKSPACE_DEMO) && Object.isFrozen(window.NFR_WORKSPACE_DEMO.enter.acts),
      apxFrozen: Object.isFrozen(window.NFR_APPENDIX) && Object.isFrozen(window.NFR_APPENDIX.modules[0].pages[0]),
      capturesFrozen: Object.isFrozen(window.NFR_LIVE_CAPTURES),
      synthetic: window.NFR_WORKSPACE_DEMO.synthetic
    }));
    expect(r).toEqual({ demoFrozen: true, apxFrozen: true, capturesFrozen: true, synthetic: true });
  });

  test('the four ways and three layers are named consistently in data, screens and roadmap', () => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    expect(d.capabilities.map((c) => c.verb)).toEqual(['Ask', 'Use', 'Run', 'Create']);
    expect(d.capabilities.map((c) => c.product)).toEqual(['Ask the records', 'Work Hub', 'Processes', 'Agents']);
    expect(d.layers.map((l) => l.label)).toEqual(['Work & roles', 'Process & controls', 'Data & platform']);
    d.layers.forEach((l) => expect(d.roadmap.cells[l.id], l.id).toHaveLength(3));
    expect(d.enter.acts).toHaveLength(5);
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.model.waysToWork).toEqual(['Ask', 'Use', 'Run', 'Create']);
  });
});

// ── SCREEN 05: HOW THE INFORMATION FLOWS, PER ROLE, AT THREE DEPTHS ──
test.describe('Role views', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('four roles read the eight systems of screen 03 within their access; each button reads only what its role may see', () => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    const R = d.roles;
    expect(R.list.map((r) => r.id)).toEqual(['head', 'tprm', 'orm', 'owner']);
    expect(R.list.map((r) => r.group)).toEqual(['lead', 'work', 'work', 'work']);
    // The screen starts with the role the demonstration uses, asking the question screen 03 types
    expect(R.order[0]).toBe('tprm');
    expect([...R.order].sort()).toEqual(R.list.map((r) => r.id).sort());
    expect(R.list.find((r) => r.id === 'tprm').question).toBe(d.sees.question.text);
    // Only the roles available in the live product say so
    expect(R.list.filter((r) => r.status === 'live').map((r) => r.id)).toEqual(['tprm', 'orm']);
    // Three depths; the screen shows at the first, every other layer opens at Medium or Deep
    expect(R.depths.map((x) => x.id)).toEqual(['light', 'medium', 'deep']);
    expect(R.layers.map((l) => l.id)).toEqual(['screen', 'route', 'read', 'connect', 'compute', 'store', 'write']);
    expect(R.layers.map((l) => l.depth)).toEqual(['light', 'deep', 'medium', 'medium', 'medium', 'deep', 'deep']);
    const systems = d.sees.needs.map((n) => n.id);
    expect(Object.keys(R.short).sort()).toEqual([...systems].sort());
    // Every system is read one way: a live query or a cached index
    expect(Object.keys(R.modeOf).sort()).toEqual([...systems].sort());
    Object.values(R.modeOf).forEach((m) => expect(['live', 'cache']).toContain(m));
    R.list.forEach((r) => {
      expect(Object.keys(r.access).sort(), r.id).toEqual([...systems].sort());
      Object.values(r.access).forEach((a) => expect(typeof a === 'string' && a.length > 0 && a.length <= 13, r.id + ' ' + a).toBe(true));
      expect(typeof r.rule === 'string' && r.rule.length > 0, r.id + ' rule').toBe(true);
      expect(typeof r.ai === 'string' && r.ai.length > 0, r.id + ' ai').toBe(true);
      expect(r.links, r.id).toHaveLength(4);
      expect(['dots', 'tiles', 'compare'], r.id).toContain(r.answer.visual.kind);
      // Three buttons: a view that calculates, an explanation, an action. Only the action
      // writes back, and only once a person approves. No button reads a system its role may not
      expect(r.outputs.map((o) => o.kind), r.id).toEqual(['view', 'explain', 'action']);
      r.outputs.forEach((o) => {
        expect(o.reads.length, r.id + ' ' + o.id).toBeGreaterThan(0);
        o.reads.forEach((s) => expect(!!r.access[s] && r.access[s] !== 'none', r.id + ' ' + o.id + ' reads ' + s).toBe(true));
        expect(!!o.write, r.id + ' ' + o.id + ' writes').toBe(o.kind === 'action');
        expect(!!o.rule, r.id + ' ' + o.id + ' calculates').toBe(o.kind === 'view');
        expect(o.def, r.id + ' ' + o.id).toMatch(/^[A-Z]{2,3}-[A-Z]{3} v\d$/);
        expect(typeof o.store === 'string' && o.store.length > 0, r.id + ' ' + o.id + ' store').toBe(true);
        if (o.write) expect(o.write.gate.length, r.id + ' gate').toBeGreaterThan(0);
      });
    });
    // The scopes differ: the leader reads summaries, the control owner only its own records
    const reads = (id) => Object.values(R.list.find((r) => r.id === id).access).filter((a) => a !== 'none').length;
    expect([reads('head'), reads('tprm'), reads('orm'), reads('owner')]).toEqual([7, 8, 6, 5]);
  });

  test('roles and buttons switch at once; Space unfolds Medium, then Deep, then moves on', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'role-views');
    const state = () => page.evaluate(() => {
      const s = document.getElementById('role-views');
      return { active: [...s.querySelectorAll('.rv-role')].findIndex((b) => b.classList.contains('is-active')),
        depth: s.querySelector('.ts-canvas').getAttribute('data-depth'),
        open: [...s.querySelectorAll('.rx-band')].filter((b) => !b.classList.contains('is-folded')).map((b) => b.dataset.layer).join(','),
        question: s.querySelector('.rx-q-t').textContent, answer: s.querySelector('.rx-ans-t').textContent,
        rows: Object.fromEntries([...s.querySelectorAll('.rx-sys')].map((r) => [r.dataset.sys, (r.className.match(/is-(full|part|none)/) || [])[1]])),
        used: [...s.querySelectorAll('.rx-sys.is-used')].map((r) => r.dataset.sys).sort().join(','),
        sel: [...s.querySelectorAll('.rx-out')].findIndex((b) => b.classList.contains('is-sel')),
        def: s.querySelector('.rx-route-def').textContent, write: s.querySelector('.rx-body-write').textContent,
        here: sections[current].id };
    });
    let r = await state();
    expect([r.active, r.depth, r.open]).toEqual([1, 'light', 'screen']);
    expect(r.question).toBe('Which critical third-party services are deteriorating, and why?');
    expect(r.rows).toEqual({ register: 'full', incidents: 'full', kri: 'full', controls: 'full', dependencies: 'full', contracts: 'full', mail: 'part', assurance: 'full' });
    // Space: Medium opens where it comes from, then Deep how it runs
    await page.keyboard.press('Space');
    r = await state();
    expect([r.here, r.depth, r.open]).toEqual(['role-views', 'medium', 'screen,read,connect,compute']);
    await page.keyboard.press('Space');
    r = await state();
    expect([r.here, r.depth, r.open]).toEqual(['role-views', 'deep', 'screen,route,read,connect,compute,store,write']);
    // The view button reads six systems and writes nothing; the action writes, once approved
    expect([r.sel, r.def]).toEqual([0, 'TP-DET v3']);
    expect(r.used).toBe('assurance,contracts,dependencies,incidents,kri,register');
    expect(r.write).toContain('Nothing is written back');
    await page.locator('#role-views .rx-out').nth(2).click();
    r = await state();
    expect([r.sel, r.def, r.used]).toEqual([2, 'TP-REQ v1', 'contracts,mail,register']);
    expect(r.write).toContain('Vendor management');
    expect(r.write).toContain('After you approve every field');
    // Another role keeps the depth and starts on its first button; locks where it has no access
    await page.locator('#role-views .rv-role').nth(3).click();
    r = await state();
    expect([r.active, r.depth, r.sel]).toEqual([3, 'deep', 0]);
    expect(r.question).toBe('Which of my controls need evidence before the Q3 sign-off?');
    expect(r.rows).toEqual({ register: 'part', incidents: 'part', kri: 'none', controls: 'part', dependencies: 'none', contracts: 'none', mail: 'part', assurance: 'part' });
    expect(r.answer).toContain('Two of your six controls');
    expect(await page.locator('#role-views .rx-sys.is-none').count()).toBe(3);
    // The depth switch folds back; a folded layer opens at its own depth
    await page.locator('#role-views .rx-seg[data-depth="light"]').click();
    r = await state();
    expect([r.depth, r.open]).toEqual(['light', 'screen']);
    await page.locator('#role-views .rx-band[data-layer="store"]').click();
    expect((await state()).depth).toBe('deep');
    // At Deep, Space moves on
    await page.keyboard.press('Space');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 4000 });
  });

  test('full motion: the question types, the answer follows, and a layer folds open', async ({ page }) => {
    await open(page);
    await enter(page, 'role-views', 12000);
    await page.locator('#role-views .rv-role').nth(0).click();
    await page.waitForTimeout(250);
    const early = await page.evaluate(() => ({ q: document.querySelector('#role-views .rx-q-t').textContent.length, ans: document.querySelector('#role-views .rx-ans-t').classList.contains('ts-on') }));
    expect(early.ans).toBe(false);
    expect(early.q).toBeLessThan('Where is NFR risk moving towards its appetite limits?'.length);
    await page.waitForFunction(() => document.querySelector('#role-views .rx-ans-t').classList.contains('ts-on'), null, { timeout: 6000 });
    expect(await page.locator('#role-views .rx-q-t').textContent()).toBe('Where is NFR risk moving towards its appetite limits?');
    // Medium: the read layer grows from a folded line to its full height
    const height = () => page.evaluate(() => document.querySelector('#role-views .rx-band[data-layer="read"]').getBoundingClientRect().height);
    const h0 = await height();
    await page.locator('#role-views .rx-seg[data-depth="medium"]').click();
    await page.waitForTimeout(900);
    expect(await height()).toBeGreaterThan(h0 * 2);
    expect(await page.locator('#role-views .rx-sys.is-none').count()).toBe(1);
  });
});

// ── LAYOUT AT SUPPORTED VIEWPORTS ──
for (const [w, h] of [[1440, 900], [1366, 768], [1366, 650], [1600, 900], [1280, 720], [1920, 1080], [1024, 768]]) {
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
          const spill = [];
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
              // Text stays inside every box that holds it: a .ts-obj or any element with a
              // border on all four sides (v36: screen 14's two-line examples ran out of their cards)
              for (let box = el.parentElement; box && box !== cv; box = box.parentElement) {
                const bs = getComputedStyle(box);
                const framed = ['Top', 'Right', 'Bottom', 'Left'].every((s) => parseFloat(bs['border' + s + 'Width']) > 0 && bs['border' + s + 'Style'] !== 'none');
                if (!framed && !box.classList.contains('ts-obj')) continue;
                const b = box.getBoundingClientRect();
                if (r.left < b.left - 2 || r.right > b.right + 2 || r.top < b.top - 2 || r.bottom > b.bottom + 2) { spill.push((el.textContent || '').trim().slice(0, 30)); break; }
              }
            }
          });
          return { out: out.slice(0, 5), small: small.slice(0, 5), cut: cut.slice(0, 5), spill: spill.slice(0, 5) };
        }, [id, MIN_TEXT_PX[vp]]);
        expect(r.out, id + ' elements outside the canvas at ' + vp).toEqual([]);
        expect(r.small, id + ' text below ' + MIN_TEXT_PX[vp] + 'px at ' + vp).toEqual([]);
        expect(r.cut, id + ' truncated text at ' + vp).toEqual([]);
        expect(r.spill, id + ' text outside its box at ' + vp).toEqual([]);
      }
    });

    test('screen 05: every role, at every depth and on every button, fits its stage and keeps its text inside its boxes', async ({ page }) => {
      test.setTimeout(90000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      await enter(page, 'role-views');
      const roles = await page.locator('#role-views .rv-role').count();
      const views = [];
      for (const dep of ['light', 'medium', 'deep']) for (let i = 0; i < roles; i++) for (const o of (dep === 'deep' ? [0, 1, 2] : [0])) views.push([dep, i, o]);
      for (const [dep, i, o] of views) {
        await page.locator('#role-views .rx-seg[data-depth="' + dep + '"]').click();
        await page.locator('#role-views .rv-role').nth(i).click();
        await page.locator('#role-views .rx-out').nth(o).click();
        const r = await page.evaluate((min) => {
          const st = document.querySelector('#role-views [data-scene-container]');
          const cv = st.querySelector('.ts-canvas');
          const scale = parseFloat(cv.dataset.scale || '1');
          const sr = st.getBoundingClientRect(), cr = cv.getBoundingClientRect();
          const out = [], small = [], spill = [];
          if (cr.top < sr.top - 1 || cr.bottom > sr.bottom + 1 || cr.left < sr.left - 1 || cr.right > sr.right + 1) out.push('canvas');
          cv.querySelectorAll('*').forEach((el) => {
            if (el.closest('.ts-svg') || el.closest('.scene-accessible-summary')) return;
            if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
            const q = el.getBoundingClientRect();
            if (!q.width || !q.height) return;
            if (q.left < cr.left - 2 || q.right > cr.right + 2 || q.top < cr.top - 2 || q.bottom > cr.bottom + 2) out.push(String(el.className).slice(0, 30));
            if (![...el.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) return;
            if (parseFloat(getComputedStyle(el).fontSize) * scale < min) small.push(el.textContent.trim().slice(0, 30));
            for (let box = el.parentElement; box && box !== cv; box = box.parentElement) {
              const bs = getComputedStyle(box);
              const framed = ['Top', 'Right', 'Bottom', 'Left'].every((s) => parseFloat(bs['border' + s + 'Width']) > 0 && bs['border' + s + 'Style'] !== 'none');
              if (!framed && !box.classList.contains('ts-obj')) continue;
              const b = box.getBoundingClientRect();
              if (q.left < b.left - 2 || q.right > b.right + 2 || q.top < b.top - 2 || q.bottom > b.bottom + 2) { spill.push(el.textContent.trim().slice(0, 30)); break; }
            }
          });
          return { out: out.slice(0, 5), small: small.slice(0, 5), spill: spill.slice(0, 5) };
        }, MIN_TEXT_PX[vp]);
        const at = 'role ' + i + ' at ' + dep + ', button ' + o + ', ' + vp;
        expect(r.out, at + ': outside the canvas').toEqual([]);
        expect(r.small, at + ': text below the floor').toEqual([]);
        expect(r.spill, at + ': text outside its box').toEqual([]);
      }
    });

    test('no core screen overflows, headers are not clipped and every footer is visible', async ({ page }) => {
      await open(page);
      for (const id of CORE) {
        await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
        const r = await page.evaluate((sid) => {
          const s = document.getElementById(sid);
          const footer = s.querySelector('.scene-footer') || s.querySelector('.landing-route');
          const f = footer.getBoundingClientRect();
          const sub = s.querySelector('.slide-sub');
          return { overflow: s.scrollWidth > s.clientWidth + 2, footerBottom: f.bottom, vh: window.innerHeight,
            subClipped: sub ? sub.scrollWidth > sub.clientWidth + 1 : false };
        }, id);
        expect(r.overflow, id).toBe(false);
        expect(r.subClipped, id + ' subtitle clipped').toBe(false);
        expect(r.footerBottom, id + ' footer below the viewport').toBeLessThanOrEqual(r.vh + 1);
      }
    });

    test('appendix pages and the fallback fit the width and keep text readable', async ({ page }) => {
      test.setTimeout(120000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      const ids = await page.evaluate(() => ['appendix', 'live-fallback'].concat(NFR_APPENDIX.pages.map((p) => p.id)));
      for (const id of ids) {
        await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
        const r = await page.evaluate(([sid, min]) => {
          const s = document.getElementById(sid);
          const small = [];
          const spill = [];
          const above = [];
          // The visual stays below the subtitle
          const sub = s.querySelector('.slide-sub');
          const vis = s.querySelector('.apx-visual');
          if (sub && vis) {
            const sb = sub.getBoundingClientRect().bottom;
            vis.querySelectorAll('*').forEach((e) => { const q = e.getBoundingClientRect(); if (q.height && q.top < sb - 1) above.push(String(e.className).slice(0, 30)); });
          }
          s.querySelectorAll('*').forEach((el) => {
            if (el.closest('.ws-sr-only') || el.closest('details:not([open])')) return;
            if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
            const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (!ownText) return;
            const fs = parseFloat(getComputedStyle(el).fontSize);
            const svg = el.ownerSVGElement;
            const scale = svg ? svg.getBoundingClientRect().width / svg.viewBox.baseVal.width : 1;
            if (fs * scale < min) small.push((el.textContent || '').trim().slice(0, 30) + ' ' + (fs * scale).toFixed(1));
            const box = el.closest('.apx-col, .apx-wave, .apx-stage, .apx-pool, .apx-sprint-phase');
            if (box && box !== el) {
              const b = box.getBoundingClientRect(), q = el.getBoundingClientRect();
              if (q.left < b.left - 2 || q.right > b.right + 2 || q.top < b.top - 2 || q.bottom > b.bottom + 2) spill.push((el.textContent || '').trim().slice(0, 30));
            }
          });
          return { overflow: s.scrollWidth > s.clientWidth + 2, height: s.offsetHeight / window.innerHeight, small: small.slice(0, 5), spill: spill.slice(0, 5), above: above.slice(0, 3) };
        }, [id, MIN_TEXT_PX[vp]]);
        expect(r.overflow, id + ' overflows at ' + vp).toBe(false);
        expect(r.small, id + ' text below the floor at ' + vp).toEqual([]);
        expect(r.spill, id + ' text outside its box at ' + vp).toEqual([]);
        expect(r.above, id + ' visual rises into the subtitle at ' + vp).toEqual([]);
        // Tall pages scroll; past about 1.8 screens the screen tracker could miss them
        expect(r.height, id + ' height in screens at ' + vp).toBeLessThan(1.8);
      }
    });
  });
}

// ── FALLBACKS ──
test.describe('Static fallbacks', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('a scene script that fails to load leaves its static fallback visible', async ({ page }) => {
    await page.route('**/scenes/four-ways.js*', (route) => route.abort());
    await open(page);
    await page.evaluate(() => document.getElementById('four-ways').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1200);
    const box = await page.locator('#four-ways [data-scene-fallback]').boundingBox();
    expect(box && box.height).toBeGreaterThan(100);
  });

  test('a scene that throws while rendering restores its static fallback', async ({ page }) => {
    await page.route('**/scenes/assistance-here.js*', async (route) => {
      const res = await route.fetch();
      const body = (await res.text())
        .replace('play: function() {', "play: function() { throw new Error('simulated play failure');")
        .replace('finish: function() {', "finish: function() { throw new Error('simulated finish failure');");
      await route.fulfill({ response: res, body: body });
    });
    await open(page);
    await page.evaluate(() => document.getElementById('assistance-here').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'assistance-here' && SceneDirector.getState() === 'error', null, { timeout: 8000 });
    const box = await page.locator('#assistance-here [data-scene-fallback]').boundingBox();
    expect(box && box.height).toBeGreaterThan(100);
  });

  test('if the doorway fails to load, its static picture still carries the live cue', async ({ page }) => {
    await page.route('**/scenes/enter-workspace.js*', (route) => route.abort());
    await open(page);
    await page.evaluate(() => document.getElementById('enter-workspace').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1200);
    const fb = page.locator('#enter-workspace [data-scene-fallback]');
    expect((await fb.boundingBox()).height).toBeGreaterThan(200);
    expect(await fb.textContent()).toContain('Open live Workspace');
  });
});

// ── COPY AND CLAIMS ──
test.describe('Copy and claims', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('visible core text: no dashes, no percentages, no unexplained jargon, no overclaiming', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const id of CORE) {
      await enter(page, id);
      const text = await page.locator('#' + id).innerText();
      expect(text.includes(EM) || text.includes(EN), id + ' dash').toBe(false);
      expect(text.includes('%'), id + ' shows a percentage').toBe(false);
      const lower = text.toLowerCase();
      // Screen 05 names the knowledge graph at the owner's request, next to a plain step label
      JARGON.filter((j) => !(id === 'role-views' && j === 'knowledge graph')).forEach((j) => expect(new RegExp('\\b' + j + '\\b').test(lower), id + ' uses "' + j + '"').toBe(false));
      CLAIMS.forEach((c) => expect(lower.includes(c), id + ' claims "' + c + '"').toBe(false));
      expect(/\bad-hoc\b|\badhoc\b|paralel|parallell/.test(lower), id + ' misspells ad hoc or parallel').toBe(false);
    }
  });

  test('appendix text: no dashes and no overclaiming', async ({ page }) => {
    await open(page);
    const ids = await page.evaluate(() => ['appendix', 'live-fallback'].concat(NFR_APPENDIX.pages.map((p) => p.id)));
    for (const id of ids) {
      const text = (await page.locator('#' + id).innerText());
      expect(text.includes(EM) || text.includes(EN), id + ' dash').toBe(false);
      const lower = text.toLowerCase();
      CLAIMS.forEach((c) => expect(lower.includes(c), id + ' claims "' + c + '"').toBe(false));
    }
  });

  test('NFR OS is gone from the visible experience and the source copy', async ({ page }) => {
    const sources = ['pitch.html', 'index.html', 'assets/data/workspace-demo.js', 'assets/data/appendix-modules.js', 'assets/data/live-captures.js', 'assets/data/story-manifest.json', 'assets/js/edge-rail.js']
      .concat(sceneFiles().map((f) => 'assets/js/story/scenes/' + f));
    sources.forEach((f) => expect(/NFR ?OS\b/.test(read(f)), f).toBe(false));
    await open(page);
    expect(await page.title()).toContain('NFR Workspace');
    expect(await page.locator('body').innerText()).not.toMatch(/NFR ?OS\b/);
  });

  test('no client branding: the experience is bank-neutral', () => {
    const src = read('pitch.html') + read('assets/data/workspace-demo.js') + read('assets/data/appendix-modules.js') + read('assets/data/live-captures.js');
    expect(/\bUBS\b|Credit Suisse|Julius B/i.test(src)).toBe(false);
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

// ── ROUTE SHAPE ──
test.describe('Route', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('four chapters: the shift, the model, the Workspace, the path', () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.chapters.map((c) => c.label)).toEqual(['THE SHIFT', 'THE MODEL', 'THE WORKSPACE', 'THE PATH']);
    const core = m.screens.filter((s) => s.route === 'core');
    expect(core.map((s) => s.chapterId)).toEqual(['shift', 'shift', 'shift', 'shift', 'model', 'model', 'model', 'workspace', 'workspace', 'workspace', 'workspace', 'path', 'path', 'path']);
  });

  test('the landing is a landing, with one button per chapter that jumps to its first screen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const r = await page.evaluate(() => {
      const c = document.getElementById('cover');
      return { kind: c.dataset.kind, header: !!c.querySelector('.screen-hdr'), route: [...c.querySelectorAll('.landing-chapter')].map((b) => b.dataset.target) };
    });
    expect(r.kind).toBe('landing');
    expect(r.header).toBe(false);
    expect(r.route).toEqual(['cover', 'role-views', 'enter-workspace', 'value-decision']);
    await page.locator('#cover .landing-chapter').nth(2).click();
    await page.waitForFunction(() => sections[current].id === 'enter-workspace', null, { timeout: 6000 });
  });

  test('the counter counts fourteen core screens and says Appendix in the appendix', async ({ page }) => {
    await open(page);
    await expect(page.locator('#counter')).toHaveText('1 / 14');
    await expect(page.locator('.nav-ch-btn[data-chid="reference"] .nav-ch-name')).toHaveText('Appendix');
    await page.evaluate(() => document.getElementById('appendix').scrollIntoView({ behavior: 'instant' }));
    await expect(page.locator('#counter')).toHaveText('Appendix', { timeout: 4000 });
  });

  test('the cover fills one viewport without overflow at every supported size', async ({ page }) => {
    test.setTimeout(120000);
    for (const [w, h] of [[1440, 900], [1366, 768], [1600, 900], [1280, 720], [1920, 1080], [1024, 768]]) {
      await page.setViewportSize({ width: w, height: h });
      await open(page);
      const bad = await page.evaluate(() => {
        const s = document.getElementById('cover');
        return s.scrollWidth > s.clientWidth + 2 || s.scrollHeight > s.clientHeight + 2 || Math.abs(s.offsetHeight - window.innerHeight) > 2;
      });
      expect(bad, w + 'x' + h).toBe(false);
    }
  });

  test('the agenda quick jumps reach the fallback, the appendix and the calculator', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const [link, id] of [['#agendaFallbackJump', 'live-fallback'], ['#agendaAppendixJump', 'appendix'], ['#agendaRoiJump', 'appendix-v3']]) {
      await page.evaluate(() => openAgenda());
      await page.locator(link).click();
      await page.waitForFunction((sid) => sections[current].id === sid, id, { timeout: 6000 });
    }
  });
});

// ── REFERENCE MATERIAL ──
test.describe('Reference material', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('everything after the core route is labelled appendix, in a fixed order', async ({ page }) => {
    await open(page);
    const ref = await page.$$eval('section[data-route="reference"]', (s) => s.map((x) => ({ id: x.id, chapter: x.dataset.chapterTitle })));
    const APX = require(path.join(ROOT, 'assets/data/appendix-modules.js'));
    expect(ref.map((r) => r.id)).toEqual(['appendix'].concat(APX.pages.map((p) => p.id)).concat(['live-fallback', 'ref-room', 'app-team']));
    ref.forEach((r) => expect(r.chapter, r.id).toBe('APPENDIX'));
    const order = await page.$$eval('section[data-slide]', (s) => s.map((x) => x.dataset.route));
    expect(order.lastIndexOf('core')).toBeLessThan(order.indexOf('reference'));
  });

  test('the retired pages are gone and the Evidence Atlas is reachable from the index only', async ({ page }) => {
    await open(page);
    for (const id of ['business-case', 'workspace-live', 'app-rai', 'app-method', 'app-evidence', 'app-kpis', 'app-assumptions', 'appendix-capability-choice', 'appendix-runtime-reuse', 'appendix-proof-gates']) {
      await expect(page.locator('#' + id), id).toHaveCount(0);
    }
    await expect(page.locator('section[data-route="core"] [data-atlas-view]')).toHaveCount(0);
    await expect(page.locator('#appendix .apx-extra[href="#ref-room"]')).toHaveCount(1);
  });

  test('the Evidence Atlas still opens and returns', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
    await page.waitForSelector('#ref-room .ea-shell', { timeout: 8000 });
    await page.evaluate(() => EvidenceAtlas.switchView('economics'));
    await expect(page.locator('#ref-room .ea-rail-btn.active')).toHaveText('Formulas and assumptions', { timeout: 8000 });
  });

  test('appendix copy stays consistent with the business-case rules', () => {
    const src = read('pitch.html') + read('assets/data/appendix-modules.js');
    ['FTE redeployment rate', 'Penalty avoidance', 'five executive systems', 'transformation systems screen', 'regulatory breach rate'].forEach((t) => expect(src).not.toContain(t));
  });
});
