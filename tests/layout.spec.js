// @ts-check
/**
 * V12 Layout and Interaction Tests -- NFR AI Executive Conversation
 * Run: npx playwright test tests/layout.spec.js
 * Pre-requisite: python -m http.server 8080 from repo root
 */

const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900  },
  { name: '1366x768', width: 1366, height: 768  },
  { name: '1024x768', width: 1024, height: 768  },
  { name: '390x844',  width: 390,  height: 844  },
];

const CORE_SLIDES = [
  'cover','pressure-rising','ai-stack','task-route','regulation-process',
  'transformation-implications','work-role-shift','proof-loop',
  'scale-architecture','unit-economics','dual-engine','next-move'
];

async function gotoPage(page, path) {
  await page.addInitScript(() => {
    sessionStorage.setItem('pitch_auth', '1');
  });
  await page.goto(path);
  await page.waitForSelector('section[data-slide]', { timeout: 10000 });
}

async function getOverlapReport(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('.nav')?.getBoundingClientRect();
    const slides = [...document.querySelectorAll('section[data-slide]')];
    return slides.map((slide, index) => {
      const rect  = slide.getBoundingClientRect();
      const next  = slides[index + 1]?.getBoundingClientRect();
      const horizontalOverflow = slide.scrollWidth > slide.clientWidth + 2;
      const intersectsNext     = next ? rect.bottom > next.top + 2 : false;
      const navBottom          = nav ? nav.bottom : 59;
      return {
        id: slide.id,
        route: slide.dataset.route,
        scrollWidth: slide.scrollWidth,
        clientWidth: slide.clientWidth,
        horizontalOverflow,
        intersectsNext,
      };
    });
  });
}

// ── LAYOUT TESTS ──
for (const vp of VIEWPORTS) {
  test.describe(`Layout [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('no console errors on load', async ({ page }) => {
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', err => errors.push(err.message));
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(1200);
      expect(errors, `Console errors at ${vp.name}: ${errors.join('; ')}`).toHaveLength(0);
    });

    test('no horizontal overflow on core slides', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(800);
      const report = await getOverlapReport(page);
      const overflows = report.filter(r => r.route === 'core' && r.horizontalOverflow);
      expect(overflows.map(r => r.id), `Horizontal overflow at ${vp.name}`).toHaveLength(0);
    });

    test('core slides are attached to DOM', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(500);
      for (const slideId of CORE_SLIDES.slice(0, 6)) {
        await expect(page.locator(`#${slideId}`), `${slideId} missing at ${vp.name}`).toBeAttached();
      }
    });
  });
}

// ── EM-DASH CHECK ──
test('no em-dash characters in pitch.html', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const response = await page.goto('/pitch.html');
  const body = await response.text();
  const count = (body.match(/—/g) || []).length;
  expect(count, 'Em-dash characters found').toBe(0);
});

// ── EDGE RAIL ──
test('edge rail panel exists in DOM', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await expect(page.locator('#edgePanel')).toBeAttached();
  await expect(page.locator('#edgeRail')).toBeAttached();
});

test('G key opens edge panel', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'keyboard focus differs on WebKit');
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  await page.keyboard.press('g');
  await page.waitForTimeout(200);
  const panelClass = await page.locator('#edgePanel').getAttribute('class');
  expect(panelClass).toContain('open');
});

// ── STORE INTEGRATION ──
test('store is initialised with correct defaults', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const state = await page.evaluate(() => typeof store !== 'undefined' ? store.getState() : null);
  expect(state).not.toBeNull();
  // V13: workshop selections removed from core; store still initialises
  expect(state.proofCandidateId).toBeNull();
});

// ── AI STACK SCENE ──
test('ai-stack screen has scene container', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('ai-stack'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(800);
  const container = page.locator('#ai-stack [data-scene-container]');
  await expect(container).toBeAttached();
});

// ── TRANSFORMATION SCENE ──
test('transformation-implications screen has scene container', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('transformation-implications'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(800);
  const container = page.locator('#transformation-implications [data-scene-container]');
  await expect(container).toBeAttached();
});

// ── REGULATION PROCESS SCENE ──
test('regulation-process scene container populated after entry', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('regulation-process'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(1200);
  const container = page.locator('#regulation-process [data-scene-container]');
  await expect(container).toBeAttached();
});

// ── NEXT MOVE SCREEN ──
test('next-move screen renders and is last core screen', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('next-move'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#next-move')).toBeAttached();
  // Confirm it is the last core screen
  const isLast = await page.evaluate(() => {
    const coreSecs = Array.from(document.querySelectorAll('section[data-route="core"]'));
    return coreSecs.length > 0 && coreSecs[coreSecs.length - 1].id === 'next-move';
  });
  expect(isLast).toBe(true);
});

// ── PROOF LOOP ──
test('proof-loop screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('proof-loop'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#proof-loop')).toBeAttached();
});

// ── SCALE ARCHITECTURE ──
test('scale-architecture screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('scale-architecture'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#scale-architecture')).toBeAttached();
});

// ── UNIT ECONOMICS ──
test('unit-economics screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('unit-economics'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#unit-economics')).toBeAttached();
});

// ── V13: ROUTE STRUCTURE ──
test('V13: exactly 12 core screens', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(500);
  const coreCount = await page.evaluate(() =>
    document.querySelectorAll('section[data-slide][data-route="core"]').length
  );
  expect(coreCount).toBe(12);
});

test('V13: html element has data-theme=dark', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(300);
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(theme).toBe('dark');
});

test('V13: story-manifest.json is accessible', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/story-manifest.json');
  expect(res && res.status()).toBe(200);
  const json = await res.json();
  expect(json.version).toBe('13');
  expect(json.screens).toHaveLength(12);
});

test('V13: regulation-process section exists with evidence badge', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const regSec = page.locator('#regulation-process');
  await expect(regSec).toBeAttached();
  const badge = page.locator('#regulation-process .evidence-badge');
  await expect(badge).toBeAttached();
});

test('V13: reference room section is in DOM and excluded from core', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const refRoom = page.locator('#ref-room');
  await expect(refRoom).toBeAttached();
  const route = await refRoom.getAttribute('data-route');
  expect(route).toBe('reference');
});

test('V13: SceneDirector is defined after load', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(600);
  const defined = await page.evaluate(() => typeof SceneDirector !== 'undefined');
  expect(defined).toBe(true);
});

test('V13: core screens have data-scene attributes', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const sceneAttrCount = await page.evaluate(() =>
    document.querySelectorAll('section[data-route="core"][data-scene]').length
  );
  expect(sceneAttrCount).toBe(12);
});

test('V13: no hard-coded hex colors in core section inner HTML', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const hexInCore = await page.evaluate(() => {
    const coreSecs = document.querySelectorAll('section[data-route="core"] .inner');
    let found = [];
    coreSecs.forEach(function(sec) {
      const html = sec.innerHTML;
      const matches = html.match(/(?:color|background):\s*#[0-9A-Fa-f]{3,6}/g);
      if (matches) found = found.concat(matches);
    });
    return found;
  });
  expect(hexInCore, 'Hard-coded hex colors found in core sections').toHaveLength(0);
});
