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
  'cover', 'work-arrives', 'assistance-here', 'chain-drift', 'engine-run', 'four-ways', 'profiles-access', 'security', 'enter-workspace',
  'three-layers', 'six-months', 'next-decision'
];
const INTERACTIVE = ['engine-run', 'profiles-access', 'enter-workspace', 'live-fallback'];
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
  test('twelve core screens; one scene file per declared scene, core and appendix', () => {
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
    expect(m.version).toBe('47');
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

// ── SCREEN 05: ONE QUESTION, RUN THROUGH THE ENGINE ──
test.describe('Engine run', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('seven steps; the records read add up to the sources cited; every system read is within the worker\'s access', () => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    const E = d.engine;
    expect(E.steps.map((s) => s.id)).toEqual(['understand', 'access', 'read', 'connect', 'calculate', 'explain', 'record']);
    expect(E.systems.map((s) => s.id).sort()).toEqual(d.sees.needs.map((n) => n.id).sort());
    const total = E.systems.reduce((a, s) => a + s.records, 0);
    expect(E.answer.sources).toBe(total + ' sources cited');
    // The worker is the third-party risk manager: every system read is one that role may access
    const tprm = d.roles.list.find((r) => r.id === 'tprm');
    E.systems.filter((s) => s.records).forEach((s) => expect(tprm.access[s.id], s.id).not.toBe('none'));
    expect(E.systems.filter((s) => s.records).length).toBe(6);
  });

  test('the final state shows every step done, the records counted and the answer on Maya\'s screen; Space moves on', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'engine-run');
    const r = await page.evaluate(() => {
      const s = document.getElementById('engine-run');
      return { q: s.querySelector('.en-q-t').textContent, open: s.querySelector('.en-engine').classList.contains('is-open'),
        done: s.querySelectorAll('.en-pill.is-done').length, records: s.querySelector('.en-records').textContent,
        answer: s.querySelector('.en-ans-t').classList.contains('ts-on'), run: s.querySelector('.en-run').textContent };
    });
    expect(r.q).toBe('Which critical third-party services are deteriorating, and why?');
    expect([r.open, r.done, r.answer, r.run]).toEqual([true, 7, true, 'Run again']);
    expect(r.records).toContain('15 records');
    // Run again replays it, and ends in the same place
    await page.locator('#engine-run .en-run').click();
    expect(await page.locator('#engine-run .en-pill.is-done').count()).toBe(7);
    await page.keyboard.press('Space');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 4000 });
  });

  test('full motion: the question types, Run is pressed, the engine flips out and steps through to the answer', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('engine-run').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'engine-run' && SceneDirector.getState() === 'playing', null, { timeout: 6000 });
    await page.waitForTimeout(700);
    const early = await page.evaluate(() => ({ q: document.querySelector('#engine-run .en-q-t').textContent.length, open: document.querySelector('#engine-run .en-engine').classList.contains('is-open') }));
    expect(early.open).toBe(false);
    expect(early.q).toBeLessThan('Which critical third-party services are deteriorating, and why?'.length);
    await page.waitForFunction(() => document.querySelector('#engine-run .en-pill.is-run'), null, { timeout: 6000 });
    expect(await page.locator('#engine-run .en-engine').getAttribute('class')).toContain('is-open');
    await page.waitForFunction(() => document.querySelector('#engine-run .en-ans-t').classList.contains('ts-on'), null, { timeout: 12000 });
    expect(await page.locator('#engine-run .en-pill.is-done').count()).toBe(7);
  });
});

// ── SCREEN 07: CONNECTED ON DAY ONE; THE ROLE SETS THE SCREEN ──
test.describe('Smart profiling', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('one template per role, each scoped by HR, each with a day-one screen; the menu follows the role', () => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    const P = d.profiles;
    expect(P.templates.map((t) => t.id)).toEqual(['tprm', 'head', 'orm', 'owner']);
    expect([...P.order].sort()).toEqual(P.templates.map((t) => t.id).sort());
    // The templates are the roles of screen 05
    expect(P.templates.map((t) => t.role).sort()).toEqual(d.roles.list.map((r) => r.label).sort());
    expect(P.menu.map((m) => m.label)).toEqual(d.capabilities.map((c) => c.product));
    P.templates.forEach((t) => {
      P.idm.forEach((it) => expect(typeof t.idm[it.id] === 'string' && t.idm[it.id].length > 0, t.id + ' ' + it.id).toBe(true));
      P.tpl.forEach((it) => expect(typeof t.tpl[it.id] === 'string' && t.tpl[it.id].length > 0, t.id + ' ' + it.id).toBe(true));
      expect(t.menu, t.id).toHaveLength(P.menu.length);
      expect(t.today, t.id).toHaveLength(3);
      expect(t.count, t.id).toBeGreaterThan(0);
      expect(t.tpl.template, t.id).toBe(t.role);
    });
    // The control owner's role has no processes or agents
    expect(P.templates.find((t) => t.id === 'owner').menu).toEqual([true, true, false, false]);
  });

  test('a click shows a template at once; Space steps through the templates, then moves on', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'profiles-access');
    const state = () => page.evaluate(() => {
      const s = document.getElementById('profiles-access');
      return { active: [...s.querySelectorAll('.pa-tpl')].findIndex((b) => b.classList.contains('is-active')),
        joins: s.querySelector('.pa-joins').textContent, locked: s.querySelectorAll('.pa-menu-i.is-locked').length, here: sections[current].id };
    });
    let r = await state();
    expect([r.active, r.joins, r.locked]).toEqual([0, 'MRMaya joins', 0]);
    await page.locator('#profiles-access .pa-tpl').nth(3).click();
    r = await state();
    expect([r.active, r.joins, r.locked]).toEqual([3, 'TDTom joins', 2]);
    await page.locator('#profiles-access .pa-tpl').nth(0).click();
    for (const i of [1, 2, 3]) {
      await page.keyboard.press('Space');
      expect((await state()).active).toBe(i);
    }
    await page.keyboard.press('Space');
    await page.waitForFunction(() => sections[current].id === 'security', null, { timeout: 4000 });
  });
});

// ── SCREENS 06 AND 08: THE SAME FOUR AGENTS BENEATH EVERY WAY; SECURITY AND TRACKING ──
test.describe('Agents and security', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('four agents work hand in hand beneath every way, each handing its result on', async ({ page }) => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    const G = d.ways;
    expect(G.agents.map((a) => a.label)).toEqual(['Retrieval agent', 'Process agent', 'Policy agent', 'Principal agent']);
    G.agents.forEach((a) => ['does', 'demo', 'trust', 'hands'].forEach((k) => expect(typeof a[k] === 'string' && a[k].length > 0, a.id + ' ' + k).toBe(true)));
    // They work hand in hand: each hands its result on, the last to the person who decides
    expect(G.agents[3].hands).toContain('the person who decides');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'four-ways');
    const r = await page.evaluate(() => ({ ways: document.querySelectorAll('#four-ways .fw4-way').length, fans: document.querySelectorAll('#four-ways .fw4-fan').length,
      agents: [...document.querySelectorAll('#four-ways .fw4-agent .fw3-agent-t')].map((e) => e.textContent), trust: document.querySelectorAll('#four-ways .fw4-trust').length,
      hands: document.querySelectorAll('#four-ways .fw5-hand').length }));
    // Three handoffs between the four agents
    expect(r.hands).toBe(3);
    // Four ways lead into one layer: every way draws on all four agents
    expect([r.ways, r.fans, r.trust]).toEqual([4, 4, 4]);
    expect(r.agents).toEqual(['Retrieval agent', 'Process agent', 'Policy agent', 'Principal agent']);
  });

  test('security: six steps, the same record per person, and every record tracked', async ({ page }) => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    const X = d.security;
    expect(X.stages.map((s) => s.id)).toEqual(['signin', 'ask', 'retrieve', 'process', 'answer', 'keep']);
    expect(X.people).toEqual(d.profiles.peopleOrder);
    X.fields.forEach((f) => X.people.forEach((p) => {
      const v = f.see[p];
      expect(Object.keys(X.states), f.label + ' ' + p).toContain(typeof v === 'string' ? v : v[0]);
    }));
    expect(X.tracking.events.length).toBeGreaterThanOrEqual(4);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'security');
    const r = await page.evaluate(() => ({ stages: document.querySelectorAll('#security .sc-stage').length,
      masked: document.querySelectorAll('#security .sc-cell.is-masked').length, all: document.querySelectorAll('#security .sc-cell.is-all').length,
      events: document.querySelectorAll('#security .sc-evt').length }));
    // Ben's scope does not include the supplier: one cell for the whole column
    expect(r).toEqual({ stages: 6, masked: 2, all: 1, events: X.tracking.events.length });
  });

  test('next steps: the first six months in three phases, then two decisions at month six', () => {
    const d = require(path.join(ROOT, 'assets/data/workspace-demo.js'));
    expect(d.team.phases.map((p) => p.label)).toEqual(['Qualify', 'Build and test', 'Run live']);
    expect(d.team.yours.map((y) => y.role)).toEqual(['Role owner', 'Process expert', 'IT and security contact']);
    expect(d.decide.run.map((o) => o.id)).toEqual(['managed', 'inhouse']);
    expect(d.decide.expand.items.length).toBeGreaterThanOrEqual(3);
  });
});

// ── CHAPTER DIVIDERS ──
test.describe('Chapter dividers', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('four chapters, each opened by a divider that is not counted as a screen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const r = await page.evaluate(() => [...document.querySelectorAll('section[data-route="divider"]')].map((d) => ({ id: d.id, chapter: d.dataset.chapterId,
      title: d.querySelector('.divider-title').textContent, question: d.querySelector('.divider-question').textContent,
      screens: [...d.querySelectorAll('[data-divider-screens] a')].map((a) => a.dataset.n + ' ' + a.getAttribute('href')) })));
    expect(r.map((d) => d.id)).toEqual(['ch-problem', 'ch-answer', 'ch-workspace', 'ch-next']);
    expect(r.map((d) => d.title)).toEqual(["Today's problem", 'The answer', 'The Workspace', 'Next steps']);
    expect(r[1].question).toBe('How a connected AI workflow resolves these issues.');
    // Each lists its chapter's screens with their own numbers in the story
    expect(r[0].screens).toEqual(['02 #work-arrives', '03 #assistance-here', '04 #chain-drift']);
    expect(r[1].screens).toEqual(['05 #engine-run', '06 #four-ways']);
    expect(r[2].screens).toEqual(['07 #profiles-access', '08 #security', '09 #enter-workspace']);
    expect(r[3].screens).toEqual(['10 #three-layers', '11 #six-months', '12 #next-decision']);
    // The answer pairs each of today's problems with how it is resolved
    await expect(page.locator('#ch-answer .divider-pair')).toHaveCount(3);
    // Dividers are not screens: the counter counts the twelve screens
    await expect(page.locator('#counter')).toHaveText('1 / 12');
  });

  test('Space passes through each divider in story order', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'cover');
    await page.keyboard.press('Space');
    await page.waitForFunction(() => sections[current].id === 'ch-problem', null, { timeout: 4000 });
    await page.keyboard.press('Space');
    await page.waitForFunction(() => sections[current].id === 'work-arrives', null, { timeout: 4000 });
  });

  for (const [w, h] of [[1366, 768], [1366, 650], [1024, 768], [1920, 1080]]) {
    test('every divider fits one window at ' + w + 'x' + h, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      for (const id of ['ch-problem', 'ch-answer', 'ch-workspace', 'ch-next']) {
        await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
        await page.waitForFunction((sid) => sections[current].id === sid, id, { timeout: 4000 });
        const r = await page.evaluate((sid) => {
          const s = document.getElementById(sid);
          const inner = s.querySelector('.inner.divider');
          const b = s.getBoundingClientRect();
          const out = [...inner.querySelectorAll('*')].filter((e) => { const q = e.getBoundingClientRect(); return q.height && (q.bottom > b.bottom + 1 || q.right > b.right + 1); }).map((e) => String(e.className).slice(0, 30));
          return { overflow: s.scrollHeight > s.clientHeight + 2 || s.scrollWidth > s.clientWidth + 2, out: out.slice(0, 3) };
        }, id);
        expect(r.overflow, id + ' overflows at ' + w + 'x' + h).toBe(false);
        expect(r.out, id + ' content outside the window at ' + w + 'x' + h).toEqual([]);
      }
    });
  }
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

    test('screen 07: every role template fits the stage and keeps the text inside its boxes', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page);
      await enter(page, 'profiles-access');
      const people = await page.locator('#profiles-access .pa-tpl').count();
      for (let i = 0; i < people; i++) {
        await page.locator('#profiles-access .pa-tpl').nth(i).click();
        const r = await page.evaluate((min) => {
          const cv = document.querySelector('#profiles-access [data-scene-container] .ts-canvas');
          const scale = parseFloat(cv.dataset.scale || '1');
          const cr = cv.getBoundingClientRect();
          const out = [], small = [], spill = [];
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
              const framed = ['Top', 'Right', 'Bottom', 'Left'].every((x) => parseFloat(bs['border' + x + 'Width']) > 0 && bs['border' + x + 'Style'] !== 'none');
              if (!framed && !box.classList.contains('ts-obj')) continue;
              const b = box.getBoundingClientRect();
              if (q.left < b.left - 2 || q.right > b.right + 2 || q.top < b.top - 2 || q.bottom > b.bottom + 2) { spill.push(el.textContent.trim().slice(0, 30)); break; }
            }
          });
          return { out: out.slice(0, 5), small: small.slice(0, 5), spill: spill.slice(0, 5) };
        }, MIN_TEXT_PX[vp]);
        const at = 'person ' + i + ', ' + vp;
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
          // The takeaway under each screen is one line, never cut off
          const take = s.querySelector('.scene-footer-insight');
          return { overflow: s.scrollWidth > s.clientWidth + 2, footerBottom: f.bottom, vh: window.innerHeight,
            subClipped: sub ? sub.scrollWidth > sub.clientWidth + 1 : false, takeCut: take ? take.scrollWidth > take.clientWidth + 1 : false };
        }, id);
        expect(r.overflow, id).toBe(false);
        expect(r.subClipped, id + ' subtitle clipped').toBe(false);
        expect(r.takeCut, id + ' takeaway cut off').toBe(false);
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
      JARGON.filter((j) => !(id === 'engine-run' && j === 'knowledge graph')).forEach((j) => expect(new RegExp('\\b' + j + '\\b').test(lower), id + ' uses "' + j + '"').toBe(false));
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
    expect(external).toEqual([]);
  });
});

// ── ROUTE SHAPE ──
test.describe('Route', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("four chapters: today's problem, the answer, the Workspace, next steps", () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.chapters.map((c) => c.label)).toEqual(["TODAY'S PROBLEM", 'THE ANSWER', 'THE WORKSPACE', 'NEXT STEPS']);
    const core = m.screens.filter((s) => s.route === 'core');
    expect(core.map((s) => s.chapterId)).toEqual(['problem', 'problem', 'problem', 'problem', 'answer', 'answer', 'workspace', 'workspace', 'workspace', 'next', 'next', 'next']);
  });

  test('the landing is a landing, with one button per chapter that jumps to its divider', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const r = await page.evaluate(() => {
      const c = document.getElementById('cover');
      return { kind: c.dataset.kind, header: !!c.querySelector('.screen-hdr'), route: [...c.querySelectorAll('.landing-chapter')].map((b) => b.dataset.target) };
    });
    expect(r.kind).toBe('landing');
    expect(r.header).toBe(false);
    expect(r.route).toEqual(['ch-problem', 'ch-answer', 'ch-workspace', 'ch-next']);
    await page.locator('#cover .landing-chapter').nth(2).click();
    await page.waitForFunction(() => sections[current].id === 'ch-workspace', null, { timeout: 6000 });
  });

  test('the counter counts twelve core screens and says Appendix in the appendix', async ({ page }) => {
    await open(page);
    await expect(page.locator('#counter')).toHaveText('1 / 12');
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
    expect(ref.map((r) => r.id)).toEqual(['appendix'].concat(APX.pages.map((p) => p.id)).concat(['live-fallback', 'app-team']));
    ref.forEach((r) => expect(r.chapter, r.id).toBe('APPENDIX'));
    const order = await page.$$eval('section[data-slide]', (s) => s.map((x) => x.dataset.route));
    expect(order.lastIndexOf('core')).toBeLessThan(order.indexOf('reference'));
  });

  test('the retired pages and the Evidence Atlas are gone', async ({ page }) => {
    await open(page);
    for (const id of ['business-case', 'workspace-live', 'app-rai', 'app-method', 'app-evidence', 'app-kpis', 'app-assumptions', 'appendix-capability-choice', 'appendix-runtime-reuse', 'appendix-proof-gates']) {
      await expect(page.locator('#' + id), id).toHaveCount(0);
    }
    await expect(page.locator('section[data-route="core"] [data-atlas-view]')).toHaveCount(0);
    await expect(page.locator('#ref-room')).toHaveCount(0);
    await expect(page.locator('#appendix .apx-extra[href="#ref-room"]')).toHaveCount(0);
    // Ten pages retired in v18: the appendix keeps 18, numbered without gaps
    for (const id of ['appendix-v5', 'appendix-d7', 'appendix-d8', 'appendix-d9', 'appendix-m5', 'appendix-m6', 'appendix-m7', 'appendix-m8', 'appendix-s6']) await expect(page.locator('#' + id), id).toHaveCount(0);
  });

  test('appendix copy stays consistent with the business-case rules', () => {
    const src = read('pitch.html') + read('assets/data/appendix-modules.js');
    ['FTE redeployment rate', 'Penalty avoidance', 'five executive systems', 'transformation systems screen', 'regulatory breach rate'].forEach((t) => expect(src).not.toContain(t));
  });
});
