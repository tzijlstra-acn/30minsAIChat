// @ts-check
/**
 * Layout and platform tests -- NFR Workspace v4 (release v31, ten-screen core route)
 * Run: npx playwright test tests/layout.spec.js
 * The suite's web server is node scripts/serve.js 8080 (see playwright.config.js).
 *
 * Story checks live in tests/workspace-story.spec.js, the interactive demo in
 * tests/workspace-demo.spec.js and pure model tests in tests/roi-model.spec.js.
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
  'cover', 'work-arrives', 'assistance-here', 'chain-drift', 'role-views', 'four-ways', 'three-layers', 'profiles-access', 'security', 'enter-workspace'
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

    test('all 10 core screens are attached to the DOM', async ({ page }) => {
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

test('exactly 10 core screens, appendix excluded from the core route', async ({ page }) => {
  await gotoPage(page);
  const ids = await page.$$eval('section[data-route="core"]', (s) => s.map((x) => x.id));
  expect(ids).toEqual(CORE_SLIDES);
  expect(await page.locator('#app-team').getAttribute('data-route')).toBe('reference');
});

test('counter total comes from the DOM', async ({ page }) => {
  await gotoPage(page);
  await page.waitForTimeout(500);
  await expect(page.locator('#counter')).toHaveText('1 / 10');
});

test('agenda lists the three chapters, the appendix and the quick jumps', async ({ page }) => {
  await gotoPage(page);
  const chapters = await page.$$eval('#agendaStory .agenda-ch-name', (e) => e.map((x) => x.textContent));
  for (const c of ["TODAY'S PROBLEM", 'THE ANSWER', 'THE WORKSPACE', 'APPENDIX']) {
    expect(chapters).toContain(c);
  }
  for (const id of ['agendaLiveJump', 'agendaFallbackJump', 'agendaAppendixJump', 'agendaRoiJump']) await expect(page.locator('#' + id)).toBeAttached();
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

// ── STATIC: BUILD, ASSETS, COPY ──
test.describe('Static checks', () => {
  chromiumOnly();

  test('build fingerprint is v44', () => {
    const html = read('pitch.html');
    expect(html).toMatch(/<meta name="nfr-build" content="v44-[0-9a-f]{7}">/);
    expect(html).toMatch(/window\.NFR_BUILD=\{release:'v44'/);
  });

  test('all local asset ?v= strings share one fingerprint', () => {
    const shas = new Set([...read('pitch.html').matchAll(/\.(?:js|css)\?v=([^"]+)"/g)].map((m) => m[1]));
    expect([...shas]).toHaveLength(1);
  });

  test('story manifest has three chapters and the ten core screens', () => {
    const m = JSON.parse(read('assets/data/story-manifest.json'));
    expect(m.version).toBe('44');
    expect(m.chapters.map((c) => c.id)).toEqual(['problem', 'answer', 'workspace']);
    expect(m.screens.filter((s) => s.route === 'core').map((s) => s.id)).toEqual(CORE_SLIDES);
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
    ['renderStatic', 'renderError', 'getAccessibleSummary', 'seek', 'visibilitychange', 'getState', 'advance', 'setSafe'].forEach((k) => expect(src).toContain(k));
    expect(src).toContain("querySelectorAll('section[data-scene]')");
  });

  test('visual grammar exposes the V26 primitives and the story kit; the appendix renderer exposes its navigation', () => {
    const nav = read('assets/js/story/appendix-modules.js');
    ['go:', 'index:', 'module:', 'step:', 'isPage:'].forEach((k) => expect(nav).toContain(k));
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
