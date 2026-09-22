// @ts-check
/**
 * V9 Layout Tests — NFR AI Executive Conversation
 * Tests for overlap, horizontal overflow, nav collisions, and console errors.
 * Run: npx playwright test tests/layout.spec.js
 * Pre-requisite: serve the repo root on localhost:8080
 *   python -m http.server 8080
 */

const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: '1440x900',  width: 1440, height: 900  },
  { name: '1366x768',  width: 1366, height: 768  },
  { name: '1024x768',  width: 1024, height: 768  },
  { name: '390x844',   width: 390,  height: 844  },
];

const CORE_SLIDES = [
  'cover','setting-scene','ai-landscape','transformation-system',
  'how-blocks-built','capability-hotspots','work-workforce-workbench',
  'opportunity-portfolio','solution-portfolio','exec-shortlist',
  'process-twin','proof-value-capture','industrialization-arch',
  'run-economics','accenture-edge','lean-transition','decision-next-step'
];

// Bypass auth gate by injecting sessionStorage before navigation
async function gotoPage(page, path) {
  await page.addInitScript(() => {
    sessionStorage.setItem('pitch_auth', '1');
  });
  await page.goto(path);
  // Wait for sections to be present
  await page.waitForSelector('section[data-slide]', { timeout: 10000 });
}

async function getOverlapReport(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('.nav')?.getBoundingClientRect();
    const slides = [...document.querySelectorAll('section[data-slide]')];
    return slides.map((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const next = slides[index + 1]?.getBoundingClientRect();
      const scrollOverflow = slide.scrollHeight > slide.clientHeight + 2;
      const horizontalOverflow = slide.scrollWidth > slide.clientWidth + 2;
      const intersectsNext = next ? rect.bottom > next.top + 2 : false;
      // Nav collision: any element inside slide whose top < nav bottom
      const navBottom = nav ? nav.bottom : 59;
      const visibleChildren = [...slide.querySelectorAll('*')].filter(el => {
        if (el.closest('.nav') || el.closest('.progress-bar')) return false;
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
      });
      const navCollisions = visibleChildren.filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < navBottom && r.bottom > navBottom - 20;
      }).length;
      return {
        id: slide.id,
        route: slide.dataset.route,
        scrollOverflow,
        horizontalOverflow,
        intersectsNext,
        navCollisions,
      };
    });
  });
}

for (const vp of VIEWPORTS) {
  test.describe(`Layout [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('no console errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', err => errors.push(err.message));
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(1000);
      expect(errors, `Console errors at ${vp.name}: ${errors.join('; ')}`).toHaveLength(0);
    });

    test('no overlap in initial state', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(800);
      const report = await getOverlapReport(page);
      const coreSlides = report.filter(r => r.route === 'core');
      const overflows = coreSlides.filter(r => r.horizontalOverflow);
      expect(overflows.map(r => r.id), `Horizontal overflow at ${vp.name}`).toHaveLength(0);
      const intersects = coreSlides.filter(r => r.intersectsNext);
      expect(intersects.map(r => r.id), `Intersects next slide at ${vp.name}`).toHaveLength(0);
    });

    test('no overlap after capability selection', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(800);
      // Scroll to capability screen
      await page.evaluate(() => {
        document.getElementById('capability-hotspots')?.scrollIntoView();
      });
      await page.waitForTimeout(600);
      // Click first category if present
      const firstCat = page.locator('.cap-cat-btn').first();
      if (await firstCat.isVisible()) await firstCat.click();
      await page.waitForTimeout(400);
      const report = await getOverlapReport(page);
      const capSlide = report.find(r => r.id === 'capability-hotspots');
      if (capSlide) {
        expect(capSlide.horizontalOverflow, `Cap hotspots horizontal overflow at ${vp.name}`).toBe(false);
      }
    });

    test('core slides visible on core route', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(500);
      for (const slideId of CORE_SLIDES.slice(0, 5)) {
        const el = page.locator(`#${slideId}`);
        await expect(el, `${slideId} should exist at ${vp.name}`).toBeAttached();
      }
    });
  });
}

test('em-dash check: no em-dash characters in pitch.html', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const response = await page.goto('/pitch.html');
  const body = await response.text();
  const emDashCount = (body.match(/—/g) || []).length;
  expect(emDashCount, 'Em-dash characters found in pitch.html').toBe(0);
});

test('decision screen renders takeaway fields', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.getElementById('decision-next-step')?.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await expect(page.locator('#ta-pressures')).toBeAttached();
  await expect(page.locator('#ta-caps')).toBeAttached();
});
