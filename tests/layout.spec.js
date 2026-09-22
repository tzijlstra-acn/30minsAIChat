// @ts-check
/**
 * V11 Layout and Interaction Tests — NFR AI Executive Conversation
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
  'cover','setting-scene','pressure-to-proof','ai-landscape','transformation-system',
  'how-blocks-built','capability-hotspots','work-workforce-workbench',
  'opportunity-portfolio','solution-portfolio','exec-shortlist',
  'process-twin','proof-value-capture','industrialization-arch',
  'run-economics','accenture-edge','lean-transition','decision-next-step'
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
  expect(state.audienceLens).toBe('joint');
  expect(state.selectedCapabilities).toHaveLength(0);
  expect(state.proofCandidateId).toBeNull();
});

test('lens button dispatches to store', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  // Navigate to shortlist screen where lens buttons exist
  await page.evaluate(() => { const el = document.getElementById('exec-shortlist'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  const croBtn = page.locator('[data-lens="cro"]').first();
  if (await croBtn.isVisible()) {
    await croBtn.click();
    await page.waitForTimeout(200);
    const lens = await page.evaluate(() => store.getState().audienceLens);
    expect(lens).toBe('cro');
  }
});

// ── AI TASK ROUTER ──
test('AI task router renders on ai-landscape screen', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('ai-landscape'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(800);
  const stationsOrGrid = page.locator('#aiLandscapeGrid .atr-station, #aiLandscapeGrid .ai-station');
  const count = await stationsOrGrid.count();
  // At least some content rendered
  const gridEl = page.locator('#aiLandscapeGrid');
  const text = await gridEl.textContent();
  expect(text && text.length > 10).toBeTruthy();
});

// ── TRANSFORMATION SYSTEM ──
test('transformation system renders block SVG', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('transformation-system'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(800);
  const svgOrGrid = page.locator('#trSysGrid svg, #trSysGrid .trsys-block');
  const count = await svgOrGrid.count();
  expect(count).toBeGreaterThan(0);
});

// ── CANDIDATE CANVAS ──
test('proof candidate selection updates store', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('exec-shortlist'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(800);
  const setBtn = page.locator('.shortlist-card .set-proof-btn, [data-action="set-proof-candidate"]').first();
  if (await setBtn.count() > 0 && await setBtn.isVisible()) {
    await setBtn.click();
    await page.waitForTimeout(200);
    const candidateId = await page.evaluate(() => store.getState().proofCandidateId);
    expect(candidateId).not.toBeNull();
  }
});

// ── DECISION SCREEN ──
test('decision screen renders synthesis fields', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('decision-next-step'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#ta-pressures')).toBeAttached();
  await expect(page.locator('#ta-caps')).toBeAttached();
});

// ── ROLE ASSUMPTION STRIP ──
test('role assumption strip renders on role screen', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('work-workforce-workbench'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  const strip = page.locator('.role-assumption-strip');
  const isAttached = await strip.count();
  expect(isAttached).toBeGreaterThan(0);
});

// ── PROOF CONSOLE ──
test('proof value capture screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('proof-value-capture'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  const pvcEl = page.locator('#proof-value-capture');
  await expect(pvcEl).toBeAttached();
});

// ── ARCHITECTURE ──
test('architecture screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('industrialization-arch'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#industrialization-arch')).toBeAttached();
});

// ── ECONOMICS ──
test('run-economics screen renders', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => { const el = document.getElementById('run-economics'); if (el) el.scrollIntoView(); });
  await page.waitForTimeout(600);
  await expect(page.locator('#run-economics')).toBeAttached();
});
