// @ts-check
/**
 * Layout and platform tests -- NFR OS pitch, V27 (13-screen TPRM transition story)
 * Run: npx playwright test tests/layout.spec.js
 * The suite's web server is node scripts/serve.js 8080 (see playwright.config.js).
 *
 * V27 removed the V13 to V26 gates that tested the deleted scene files (cover-flow,
 * task-route, next-move and the rest). Story-specific checks live in
 * tests/transition-story.spec.js; pure model tests in tests/roi-model.spec.js.
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const VIEWPORTS = [
  { name: '1440x900',  width: 1440, height: 900  },
  { name: '1366x768',  width: 1366, height: 768  },
  { name: '1024x768',  width: 1024, height: 768  },
  { name: '390x844',   width: 390,  height: 844  },
  { name: '1280x720',  width: 1280, height: 720  },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const CORE_SLIDES = [
  'cover', 'today-integration-layer', 'connection-work', 'pilot-trap',
  'prepared-decision', 'role-workspace', 'authority-boundary',
  'six-month-route', 'm6-proof', 'business-case',
  'reuse-core', 'integrated-delivery', 'first-move'
];

async function gotoPage(page, url) {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto(url || '/pitch.html');
  await page.waitForSelector('section[data-slide]', { timeout: 10000 });
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// Static checks read files from disk; run them once, in the chromium project.
function chromiumOnly() {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'static check runs once');
  });
}

// ── LAYOUT PER VIEWPORT ──
for (const vp of VIEWPORTS) {
  test.describe(`Layout [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('no console errors on load', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', (err) => errors.push(err.message));
      await gotoPage(page);
      await page.waitForTimeout(1200);
      expect(errors, `Console errors at ${vp.name}: ${errors.join('; ')}`).toHaveLength(0);
    });

    test('no horizontal overflow on core screens', async ({ page }) => {
      await gotoPage(page);
      await page.waitForTimeout(600);
      const overflowing = await page.evaluate(() =>
        [...document.querySelectorAll('section[data-route="core"]')]
          .filter((s) => s.scrollWidth > s.clientWidth + 2).map((s) => s.id));
      expect(overflowing).toEqual([]);
    });

    test('all 13 core screens are attached to the DOM', async ({ page }) => {
      await gotoPage(page);
      for (const id of CORE_SLIDES) {
        await expect(page.locator(`#${id}`), `${id} missing at ${vp.name}`).toBeAttached();
      }
    });

    test('core section height is the viewport height', async ({ page }) => {
      await gotoPage(page);
      const bad = await page.evaluate(() => {
        const vh = window.innerHeight;
        return [...document.querySelectorAll('section[data-route="core"]')]
          .filter((s) => Math.abs(s.offsetHeight - vh) > 2).map((s) => s.id);
      });
      expect(bad).toEqual([]);
    });

    test('scene footer stays within 46px on core screens', async ({ page }) => {
      await gotoPage(page);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll('section[data-route="core"] .scene-footer')]
          .filter((el) => el.offsetHeight > 46).map((el) => el.closest('section').id));
      expect(bad).toEqual([]);
    });
  });
}

// ── NAVIGATION AND SHELL ──
test('html element has data-theme=dark', async ({ page }) => {
  await gotoPage(page);
  expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
});

test('auth gate redirects to index.html without a session flag', async ({ page }) => {
  await page.goto('/pitch.html');
  await page.waitForURL(/index\.html/, { timeout: 5000 });
  expect(page.url()).toContain('index.html');
});

test('edge rail panel exists in DOM', async ({ page }) => {
  await gotoPage(page);
  await expect(page.locator('#edgePanel')).toBeAttached();
  await expect(page.locator('#edgeRail')).toBeAttached();
});

test('G key opens edge panel', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'keyboard focus differs on WebKit');
  await gotoPage(page);
  await page.waitForTimeout(400);
  await page.keyboard.press('g');
  await page.waitForTimeout(200);
  expect(await page.locator('#edgePanel').getAttribute('class')).toContain('open');
});

test('right arrow key advances to the next screen', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'keyboard focus differs on WebKit');
  await gotoPage(page);
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => current);
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction((b) => current > b, before, { timeout: 4000 });
  expect(await page.evaluate(() => current)).toBeGreaterThan(before);
});

test('store is initialised with defaults', async ({ page }) => {
  await gotoPage(page);
  const state = await page.evaluate(() => (typeof store !== 'undefined' ? store.getState() : null));
  expect(state).not.toBeNull();
});

test('exactly 13 core screens, reference room excluded from the core route', async ({ page }) => {
  await gotoPage(page);
  const ids = await page.$$eval('section[data-route="core"]', (s) => s.map((x) => x.id));
  expect(ids).toEqual(CORE_SLIDES);
  expect(await page.locator('#ref-room').getAttribute('data-route')).toBe('reference');
});

test('counter total comes from the DOM', async ({ page }) => {
  await gotoPage(page);
  await page.waitForTimeout(500);
  await expect(page.locator('#counter')).toHaveText('1 / 13');
});

test('nav bar has an Evidence Atlas button', async ({ page }) => {
  await gotoPage(page);
  await expect(page.locator('.nav button[title*="Evidence Atlas"]')).toBeAttached();
});

test('agenda lists the five chapters and a business-case quick jump', async ({ page }) => {
  await gotoPage(page);
  const chapters = await page.$$eval('#agendaStory .agenda-ch-name', (e) => e.map((x) => x.textContent));
  for (const c of ['TODAY', 'THE NEW WORKDAY', 'SIX MONTHS', 'THE BUSINESS CASE', 'SCALE AND START']) {
    expect(chapters).toContain(c);
  }
  await expect(page.locator('#agendaRoiJump')).toBeAttached();
});

test('SceneDirector is defined and exposes getState', async ({ page }) => {
  await gotoPage(page);
  expect(await page.evaluate(() => typeof SceneDirector !== 'undefined' && typeof SceneDirector.getState === 'function')).toBe(true);
});

test('every core screen declares a registered scene', async ({ page }) => {
  await gotoPage(page);
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('section[data-route="core"]')]
      .filter((s) => !s.dataset.scene || !SceneDirector.hasScene(s.dataset.scene)).map((s) => s.id));
  expect(missing).toEqual([]);
});

test('every core scene stage has a data-size attribute', async ({ page }) => {
  await gotoPage(page);
  const missing = await page.$$eval('section[data-route="core"] .scene-stage', (st) =>
    st.filter((s) => !s.dataset.size).map((s) => s.closest('section').id));
  expect(missing).toEqual([]);
});

test('KnowledgeGraph and the icon registry are defined', async ({ page }) => {
  await gotoPage(page);
  expect(await page.evaluate(() => typeof KnowledgeGraph)).not.toBe('undefined');
  expect(await page.evaluate(() => typeof NFRIconRegistry)).toBe('object');
});

// ── EVIDENCE ATLAS ──
test('Evidence Atlas renders its shell when the reference room is reached', async ({ page }) => {
  await gotoPage(page);
  await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
  await expect(page.locator('#ref-room .ea-shell')).toBeVisible({ timeout: 8000 });
});

test('Evidence Atlas tabs carry ARIA roles and one selected tab', async ({ page }) => {
  await gotoPage(page);
  await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
  await page.waitForSelector('#ref-room [role="tab"]', { timeout: 8000 });
  const tabs = await page.$$eval('#ref-room [role="tab"]', (t) => t.map((x) => x.getAttribute('aria-selected')));
  expect(tabs.length).toBe(10);
  expect(tabs.filter((s) => s === 'true')).toHaveLength(1);
  await expect(page.locator('#ref-room .ea-canvas[role="tabpanel"]')).toBeAttached();
});

test('Evidence Atlas rail is grouped by the five client questions', async ({ page }) => {
  await gotoPage(page);
  await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
  await page.waitForSelector('#ref-room .ea-rail-group', { timeout: 8000 });
  const groups = await page.$$eval('#ref-room .ea-rail-group', (g) => g.map((x) => x.textContent));
  expect(groups).toEqual(['Process and journey', 'Architecture and models', 'Data and integration', 'Control and delivery', 'Economics and proof']);
});

test('Evidence Atlas hides its loading hint after init', async ({ page }) => {
  await gotoPage(page);
  await page.evaluate(() => document.getElementById('ref-room').scrollIntoView({ behavior: 'instant' }));
  await page.waitForSelector('#ref-room .ea-shell', { timeout: 8000 });
  const hint = page.locator('#ea-loading-hint');
  if (await hint.count()) await expect(hint).toBeHidden();
});

// ── STATIC: BUILD, ASSETS, COPY ──
test.describe('Static checks', () => {
  chromiumOnly();

  test('build fingerprint is v27', () => {
    const html = read('pitch.html');
    expect(html).toMatch(/<meta name="nfr-build" content="v27-[0-9a-f]{7}">/);
    expect(html).toMatch(/window\.NFR_BUILD=\{release:'v27'/);
  });

  test('all local asset ?v= strings share one fingerprint', () => {
    const shas = new Set([...read('pitch.html').matchAll(/\.(?:js|css)\?v=([^"]+)"/g)].map((m) => m[1]));
    expect([...shas]).toHaveLength(1);
  });

  test('story manifest is version 27 with five chapters and thirteen screens', () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.version).toBe('27');
    expect(m.chapters.map((c) => c.id)).toEqual(['today', 'new-workday', 'six-months', 'business-case', 'scale-start']);
    expect(m.screens.map((s) => s.id)).toEqual(CORE_SLIDES);
  });

  test('vendor scripts load in the body, before application scripts', () => {
    const html = read('pitch.html');
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).not.toMatch(/vendor\/(d3|motion|elkjs)/);
    expect(html.indexOf('vendor/d3/d3.min.js')).toBeLessThan(html.indexOf('assets/js/app.js'));
  });

  test('no em dash or en dash in pitch.html, index.html, application JS or CSS', () => {
    const files = ['pitch.html', 'index.html'];
    for (const dir of ['assets/js', 'assets/data', 'assets/css']) {
      (function walk(d) {
        fs.readdirSync(path.join(ROOT, d)).forEach((f) => {
          const rel = d + '/' + f;
          if (fs.statSync(path.join(ROOT, rel)).isDirectory()) walk(rel);
          else if (/\.(js|css|json)$/.test(f)) files.push(rel);
        });
      }(dir));
    }
    const hits = files.filter((f) => { const t = read(f); return t.includes(EM) || t.includes(EN); });
    expect(hits).toEqual([]);
  });

  test('no external runtime resources in pitch.html', () => {
    const ext = [...read('pitch.html').matchAll(/(?:<script[^>]+src|<link[^>]+href|<img[^>]+src)="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
    expect(ext).toEqual([]);
  });

  test('scene-director keeps the lifecycle helpers and a DOM-derived scene list', () => {
    const src = read('assets/js/story/scene-director.js');
    ['renderStatic', 'renderError', 'getAccessibleSummary', 'seek', 'visibilitychange', 'getState'].forEach((k) => expect(src).toContain(k));
    expect(src).toContain("querySelectorAll('section[data-scene]')");
  });

  test('visual grammar exposes the V26 primitives and the V27 story kit', () => {
    const src = read('assets/js/story/visual-grammar.js');
    ['SystemField', 'WorkLane', 'MetricStrip', 'ReuseMarker', 'StoryKit', 'CaseBadge', 'EvidenceChip', 'UncertaintyBadge', 'DecisionGate', 'ReceiptState', 'ProofGate'].forEach((k) => expect(src).toContain(k));
  });

  test('scenes.css keeps the accessible-summary class and a 48px footer cap', () => {
    const css = read('assets/css/scenes.css');
    expect(css).toContain('.scene-accessible-summary');
    expect(css).toMatch(/\.scene-footer\s*\{[^}]*max-height:\s*48px/);
  });

  test('sections do not double-offset the fixed nav', () => {
    expect(read('assets/css/pitch.css')).not.toMatch(/section\[data-slide\]\{[^}]*scroll-margin-top/);
  });

  test('icon sprite, connector engine and data files are present', () => {
    ['assets/icons/tabler-sprite.svg', 'assets/css/connectors.css', 'assets/js/visual-system/connector-engine.js',
     'assets/js/visual-system/ports.js', 'assets/data/claims.json', 'assets/data/icon-manifest.json'].forEach((f) => {
      expect(fs.existsSync(path.join(ROOT, f)), f).toBe(true);
    });
  });
});
