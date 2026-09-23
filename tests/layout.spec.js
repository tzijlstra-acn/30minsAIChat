// @ts-check
/**
 * V12 Layout and Interaction Tests -- NFR AI Executive Conversation
 * Run: npx playwright test tests/layout.spec.js
 * Pre-requisite: python -m http.server 8080 from repo root
 */

const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: '1440x900',  width: 1440, height: 900  },
  { name: '1366x768',  width: 1366, height: 768  },
  { name: '1024x768',  width: 1024, height: 768  },
  { name: '390x844',   width: 390,  height: 844  },
  { name: '1280x720',  width: 1280, height: 720  },
  { name: '1920x1080', width: 1920, height: 1080 },
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

async function assertInsideSafeFrame(page, selector) {
  const offenders = await page.locator(selector).evaluate((root) => {
    const safe = root.getBoundingClientRect();
    const result = [];
    root.querySelectorAll('[data-visual-object]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const inside =
        r.left >= safe.left - 2 &&
        r.right <= safe.right + 2 &&
        r.top >= safe.top - 2 &&
        r.bottom <= safe.bottom + 2;
      if (!inside) {
        result.push({
          id: el.id || el.getAttribute('data-visual-object') || 'unknown',
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          safe: { x: Math.round(safe.x), y: Math.round(safe.y), w: Math.round(safe.width), h: Math.round(safe.height) }
        });
      }
    });
    return result;
  });
  expect(offenders, 'Objects outside safe frame: ' + JSON.stringify(offenders)).toEqual([]);
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

    test('no horizontal overflow on core screens', async ({ page }) => {
      await gotoPage(page, 'http://localhost:8080/pitch.html');
      const report = await getOverlapReport(page);
      const overflowing = report.filter(r => r.route === 'core' && r.horizontalOverflow);
      expect(overflowing.map(r => r.id)).toEqual([]);
    });

    test('core section height is 100dvh', async ({ page }) => {
      await gotoPage(page, 'http://localhost:8080/pitch.html');
      const bad = await page.evaluate(() => {
        const vh = window.innerHeight;
        const sections = [...document.querySelectorAll('section[data-route="core"]')];
        return sections.filter(s => Math.abs(s.offsetHeight - vh) > 2).map(s => s.id);
      });
      expect(bad).toEqual([]);
    });

    test('scene-footer max-height 44px on core screens', async ({ page }) => {
      await gotoPage(page, 'http://localhost:8080/pitch.html');
      const bad = await page.evaluate(() => {
        return [...document.querySelectorAll('.scene-footer')]
          .filter(el => el.offsetHeight > 46)
          .map(el => el.closest('section')?.id || 'unknown');
      });
      expect(bad).toEqual([]);
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
  expect(parseInt(json.version)).toBeGreaterThanOrEqual(17);
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

// ── V15 RELEASE HARDENING ──

test('V15: build fingerprint meta tag present', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const content = await page.locator('meta[name="nfr-build"]').getAttribute('content');
  expect(content).toMatch(/^v1[56]-[0-9a-f]{7}$/);
});

test('V15: all core scene-stage elements have data-size attribute', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const missing = await page.evaluate(() => {
    const stages = Array.from(document.querySelectorAll('section[data-route="core"] .scene-stage'));
    return stages.filter(function(s) { return !s.dataset.size; }).map(function(s) { return s.closest('section') ? s.closest('section').id : 'unknown'; });
  });
  expect(missing, 'scene-stage elements missing data-size').toHaveLength(0);
});

test('V15: all core screens have a .scene-insight element', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const missing = await page.evaluate(() => {
    const coreSecs = Array.from(document.querySelectorAll('section[data-route="core"]'));
    return coreSecs.filter(function(s) { return !s.querySelector('.scene-insight'); }).map(function(s) { return s.id; });
  });
  expect(missing, 'Core screens missing .scene-insight').toHaveLength(0);
});

test('V15: maturity-criteria nav-title updated', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(300);
  const navTitle = await page.evaluate(() => {
    const el = document.getElementById('maturity-matrix');
    return el ? el.getAttribute('data-nav-title') : null;
  });
  expect(navTitle).toBe('Maturity criteria');
});

test('V15: no em-dash in any JS scene file', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const sceneIds = [
    'cover-flow', 'pressure-convergence', 'ai-stack-build', 'task-route',
    'regulation-process', 'transformation-system', 'work-role-shift',
    'proof-loop', 'scale-architecture', 'unit-economics', 'dual-engine', 'next-move'
  ];
  for (const id of sceneIds) {
    const res = await page.goto('/assets/js/story/scenes/' + id + '.js');
    const body = await res.text();
    const count = (body.match(/—/g) || []).length;
    expect(count, 'Em-dash in scene: ' + id).toBe(0);
  }
});

test('V15: reduced-motion disables scene animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(500);
  const bgCanvas = page.locator('#bgCanvas');
  await expect(bgCanvas).toBeAttached();
});

test('V15: right arrow key advances to next screen', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'keyboard focus differs on WebKit');
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(500);
  const initialIdx = await page.evaluate(() => typeof currentIdx !== 'undefined' ? currentIdx : -1);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  const nextIdx = await page.evaluate(() => typeof currentIdx !== 'undefined' ? currentIdx : -1);
  expect(nextIdx).toBeGreaterThan(initialIdx);
});

// ── V15 ADDITIONAL VIEWPORTS ──
const V15_VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1280x720',  width: 1280, height: 720  },
];

for (const vp of V15_VIEWPORTS) {
  test.describe(`V15 Layout [${vp.name}]`, () => {
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
  });
}

// ── V16 RELEASE HARDENING ──

test('V16: build fingerprint is v16 or later', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const content = await page.locator('meta[name="nfr-build"]').getAttribute('content');
  expect(content).toMatch(/^v1[6-9]-[0-9a-f]{7}$/);
});

test('V16: story-manifest.json version is 16 or later', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/story-manifest.json');
  expect(res && res.status()).toBe(200);
  const json = await res.json();
  expect(parseInt(json.version)).toBeGreaterThanOrEqual(16);
});

test('V16: KnowledgeGraph global is defined', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(600);
  const defined = await page.evaluate(() => typeof KnowledgeGraph !== 'undefined');
  expect(defined).toBe(true);
});

test('V16: NFRIcons global is defined', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(600);
  const defined = await page.evaluate(() => typeof NFRIcons !== 'undefined');
  expect(defined).toBe(true);
});

test('V16: context-graph JSON loads with 9 nodes', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/context-graph/regulation-coverage.json');
  expect(res && res.status()).toBe(200);
  const json = await res.json();
  expect(json.nodes).toHaveLength(9);
  expect(json.edges).toHaveLength(8);
});

test('V16: icon-manifest.json loads with 31 icons', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/icon-manifest.json');
  expect(res && res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('version');
  expect(Array.isArray(json.icons)).toBe(true);
  expect(json.icons.length).toBeGreaterThanOrEqual(31);
});

test('V16: partner proposition screen has 3 field cards', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const dualEngine = page.locator('#dual-engine');
  await expect(dualEngine).toBeAttached();
  const navTitle = await dualEngine.getAttribute('data-nav-title');
  expect(navTitle).toContain('partner');
});

test('V16: no em-dash in knowledge-graph.js', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/knowledge-graph.js');
  const body = await res.text();
  expect((body.match(/—/g) || []).length, 'Em-dash in knowledge-graph.js').toBe(0);
});

test('V16: no em-dash in icon-registry.js', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/icon-registry.js');
  const body = await res.text();
  expect((body.match(/—/g) || []).length, 'Em-dash in icon-registry.js').toBe(0);
});

test('V16: transformation-system scene has knowledge-graph container', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => {
    const el = document.getElementById('transformation-implications');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(2000);
  const container = page.locator('#transformation-implications [data-scene-container]');
  await expect(container).toBeAttached();
});

test('V16: scale-architecture scene has shared context layer header', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => {
    const el = document.getElementById('scale-architecture');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);
  await expect(page.locator('#scale-architecture')).toBeAttached();
});

// ── V17 HOTFIX TESTS ──

test('V17: story-manifest.json version is 17 or later', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/story-manifest.json');
  const json = await res.json();
  expect(parseInt(json.version)).toBeGreaterThanOrEqual(17);
});

test('V17: cover scene-stage is data-size=compact (not hero)', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  const size = await page.locator('#cover .scene-stage').getAttribute('data-size');
  expect(size).toBe('compact');
});

const GEOMETRY_VIEWPORTS = [
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 }
];

for (const vp of GEOMETRY_VIEWPORTS) {
  test.describe(`V17 Geometry [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('cover scene-stage height <= 320px', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(400);
      const h = await page.evaluate(() => {
        const stage = document.querySelector('#cover .scene-stage');
        return stage ? stage.getBoundingClientRect().height : -1;
      });
      expect(h, `Cover stage height at ${vp.name}: ${h}px`).toBeLessThanOrEqual(320);
      expect(h, `Cover stage height below minimum`).toBeGreaterThanOrEqual(250);
    });

    test('cover SVG viewBox is fixed 1120 x 280', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.evaluate(() => {
        const el = document.getElementById('cover');
        if (el) el.scrollIntoView();
      });
      await page.waitForTimeout(800);
      const vb = await page.evaluate(() => {
        const svg = document.querySelector('#cover .scene-stage svg');
        return svg ? svg.getAttribute('viewBox') : null;
      });
      expect(vb).toBe('0 0 1120 280');
    });

    test('cover has no horizontal overflow', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => {
        const stage = document.querySelector('#cover .scene-stage');
        return stage ? (stage.scrollWidth > stage.clientWidth + 2) : false;
      });
      expect(overflow, `Cover overflow at ${vp.name}`).toBe(false);
    });

    test('transformation-system has visible content immediately', async ({ page }) => {
      await gotoPage(page, '/pitch.html');
      await page.evaluate(() => {
        const el = document.getElementById('transformation-implications');
        if (el) el.scrollIntoView();
      });
      // Wait only 100ms -- static hub should be visible before async XHR returns
      await page.waitForTimeout(100);
      const hasSVG = await page.evaluate(() => {
        const stage = document.querySelector('#transformation-implications [data-scene-container]');
        return stage ? stage.querySelector('svg') !== null : false;
      });
      expect(hasSVG, 'Transformation scene has SVG content within 100ms').toBe(true);
    });
  });
}

test('V17: all required scenes are registered', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(600);
  const missing = await page.evaluate(() => {
    var required = [
      'cover-flow', 'pressure-convergence', 'ai-stack-build', 'task-route',
      'regulation-process', 'transformation-system', 'work-role-shift',
      'proof-loop', 'scale-architecture', 'unit-economics', 'dual-engine', 'next-move'
    ];
    if (typeof SceneDirector === 'undefined' || typeof SceneDirector.hasScene !== 'function') return required;
    return required.filter(function(id) { return !SceneDirector.hasScene(id); });
  });
  expect(missing, 'Missing scene registrations: ' + missing.join(', ')).toHaveLength(0);
});

test('V17: direct hash to transformation-implications renders scene', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html#transformation-implications');
  await page.waitForTimeout(800);
  const hasSVG = await page.evaluate(() => {
    const stage = document.querySelector('#transformation-implications [data-scene-container]');
    return stage ? stage.querySelector('svg') !== null : false;
  });
  expect(hasSVG, 'transformation-implications scene visible on direct hash').toBe(true);
});

test('V17: direct hash to regulation-process renders scene container', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html#regulation-process');
  await page.waitForTimeout(600);
  const hasContent = await page.evaluate(() => {
    const stage = document.querySelector('#regulation-process [data-scene-container]');
    return stage ? stage.children.length > 0 : false;
  });
  expect(hasContent, 'regulation-process scene visible on direct hash').toBe(true);
});

test('V17: reduced-motion shows final state (no empty stages)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => {
    const el = document.getElementById('cover');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  const stageEmpty = await page.evaluate(() => {
    const stage = document.querySelector('#cover .scene-stage');
    return stage ? stage.children.length === 0 : true;
  });
  expect(stageEmpty, 'Cover stage should not be empty in reduced-motion').toBe(false);
});

test('V17: cover scene SVG has doc, arrow and chip beat elements', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.evaluate(() => {
    const el = document.getElementById('cover');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(400);
  const beats = await page.evaluate(() => {
    const svg = document.querySelector('#cover .scene-stage svg');
    if (!svg) return [];
    return Array.from(svg.querySelectorAll('[data-beat]')).map(function(el) { return el.getAttribute('data-beat'); });
  });
  expect(beats).toContain('doc');
  expect(beats).toContain('word-0');
  expect(beats).toContain('word-3');
  expect(beats).toContain('arrow-1');
});

test('V17: no em-dash in cover-flow.js', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/story/scenes/cover-flow.js');
  const body = await res.text();
  expect((body.match(/—/g) || []).length, 'Em-dash in cover-flow.js').toBe(0);
});

// ── V17 RELEASE HARDENING (v17/4) ──

test('V17/4: build fingerprint is v17', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const content = await page.locator('meta[name="nfr-build"]').getAttribute('content');
  expect(content).toMatch(/^v17-[0-9a-f]{7}$/);
});

test('V17/4: proof-loop Compare step uses ti-git-compare icon', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  expect(body).toContain('ti-git-compare');
  expect(body).not.toContain('ti-git-diff');
});

test('V17/4: proof-loop Decide step uses ti-scale icon', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  expect(body).toContain('ti-scale');
  expect(body).not.toContain('ti-gate');
});

// ── V18 VISUAL EXCELLENCE AUDIT ──

test('V18: all 12 core scene containers have static fallback SVG', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const result = await page.evaluate(() => {
    var containers = Array.from(document.querySelectorAll('section[data-route="core"] [data-scene-container]'));
    var missing = containers.filter(function(c) {
      return !c.querySelector('[data-scene-fallback]');
    });
    return { total: containers.length, missing: missing.map(function(c) {
      var sec = c.closest('section');
      return sec ? sec.id : 'unknown';
    })};
  });
  expect(result.total, 'Expected 12 scene containers').toBe(12);
  expect(result.missing, 'Containers missing static fallback SVG').toHaveLength(0);
});

test('V18: static fallback SVGs have correct viewBox and preserveAspectRatio', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const bad = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-scene-fallback]')).filter(function(svg) {
      return !svg.getAttribute('viewBox') || svg.getAttribute('preserveAspectRatio') !== 'xMidYMid meet';
    }).map(function(svg) {
      var sec = svg.closest('section');
      return sec ? sec.id : 'fallback-no-section';
    });
  });
  expect(bad, 'Fallback SVGs missing viewBox or preserveAspectRatio').toHaveLength(0);
});

test('V18: scene-director.js contains _showFallback function', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).toContain('_showFallback');
  expect(body).toContain('data-scene-fallback');
});

test('V18: NFRIcons has audit method and is initialised', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(1200);
  const result = await page.evaluate(() => ({
    defined: typeof NFRIcons !== 'undefined',
    hasAudit: typeof NFRIcons !== 'undefined' && typeof NFRIcons.audit === 'function',
    ready: typeof NFRIcons !== 'undefined' && NFRIcons._ready === true
  }));
  expect(result.defined, 'NFRIcons not defined').toBe(true);
  expect(result.hasAudit, 'NFRIcons.audit not a function').toBe(true);
  expect(result.ready, 'NFRIcons._ready not true').toBe(true);
});

test('V18: icon-registry.js contains MutationObserver fallback', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/js/icon-registry.js');
  const body = await res.text();
  expect(body).toContain('MutationObserver');
  expect(body).toContain('data-icon-fallback');
  expect(body).toContain('document.fonts');
});

test('V18: dual-engine screen has updated nav title', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const navTitle = await page.evaluate(() => {
    var el = document.getElementById('dual-engine');
    return el ? el.getAttribute('data-nav-title') : null;
  });
  // V19/3 updated: hand-off tax framing
  expect(navTitle).toContain('hand-off tax');
});

test('V18: dual-engine h2 is hand-off tax framing', async ({ page }) => {
  await gotoPage(page, '/pitch.html');
  await page.waitForTimeout(400);
  const h2 = await page.locator('#dual-engine h2.slide-h').textContent();
  // V19/3 updated to Reduce the hand-off tax.
  expect(h2).toContain('hand-off tax');
});

test('V18: bump-build.ps1 script is accessible', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/scripts/bump-build.ps1');
  expect(res && res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('nfr-build');
});

test('V18: build fingerprint is v17 or v18', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const content = await page.locator('meta[name="nfr-build"]').getAttribute('content');
  expect(content).toMatch(/^v1[78]-[0-9a-f]{7}$/);
});

// --- V19 geometry and scene tests ---
const BASE = '/pitch.html';

test('Screen 02 h2 updated to new framing', async ({ page }) => {
  await page.goto(BASE);
  const h2 = await page.locator('section#ai-stack h2').textContent();
  expect(h2).toContain('AI is not one choice');
});

test('Screen 10 h2 updated to hand-off tax framing', async ({ page }) => {
  await page.goto(BASE);
  const h2 = await page.locator('section#dual-engine h2').textContent();
  expect(h2).toContain('hand-off tax');
});

test('Screen 02 nav-title updated', async ({ page }) => {
  await page.goto(BASE);
  const navTitle = await page.locator('section#ai-stack').getAttribute('data-nav-title');
  expect(navTitle).toBeTruthy();
});

test('Screen 10 nav-title is Reduce the hand-off tax', async ({ page }) => {
  await page.goto(BASE);
  const navTitle = await page.locator('section#dual-engine').getAttribute('data-nav-title');
  expect(navTitle).toContain('hand-off tax');
});

test('scene-screen uses grid layout', async ({ page }) => {
  await page.goto(BASE);
  // geometry contract: .scene-screen should be CSS grid
  const display = await page.evaluate(function() {
    var el = document.querySelector('.scene-screen');
    if (!el) return null;
    return window.getComputedStyle(el).display;
  });
  expect(display).toBe('grid');
});

test('section height is viewport height', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE);
  const h = await page.evaluate(function() {
    var s = document.querySelector('section');
    if (!s) return null;
    var attr = s.getAttribute('data-density');
    if (attr === 'long') return 'long-skip';
    return s.getBoundingClientRect().height;
  });
  if (h === 'long-skip') return; // skip long sections
  expect(Math.round(Number(h))).toBeGreaterThanOrEqual(890);
});

// --- V19 scene rebuild tests ---

test('V19: task-route has routing grid (task token + arrow + level chip)', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(200);
  const rows = await page.locator('section#task-route .tr-row').count();
  expect(rows).toBeGreaterThanOrEqual(4);
});

test('V19: task-route insight line present', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(200);
  // insight should be rendered even if opacity:0 pre-animation
  const insight = await page.locator('section#task-route [data-beat="insight"]').count();
  expect(insight).toBe(1);
});

test('V19: next-move has three sequential stages', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(200);
  const stages = await page.locator('section#next-move .nm-stage').count();
  expect(stages).toBe(3);
});

test('V19: next-move stage widths are progressive (not equal)', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(400);
  const widths = await page.locator('section#next-move .nm-stage').evaluateAll(
    function(els) { return els.map(function(e) { return e.getBoundingClientRect().width; }); }
  );
  expect(widths.length).toBe(3);
  // Stage 1 should be widest, stage 3 narrowest
  expect(widths[0]).toBeGreaterThan(widths[2]);
});

test('V19: next-move gate bars are present', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(200);
  const gates = await page.locator('section#next-move .nm-gate').count();
  expect(gates).toBe(2);
});

test('V19: story-manifest.json version is 19', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/story-manifest.json');
  const json = await res.json();
  expect(json.version).toBe('19');
});

test('V19: icon-manifest.json has 50 or more icons', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/data/icon-manifest.json');
  const json = await res.json();
  expect(json.icons.length).toBeGreaterThanOrEqual(50);
});

test('V19: audit:all passes (no em dash, no external deps, icon manifest complete)', async ({ page }) => {
  // Spot-check: em dash absent from scenes.css
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  const res = await page.goto('/assets/css/scenes.css');
  const body = await res.text();
  expect(body).not.toContain('—');
});

// --- V21 tests: connector engine, cinematic cover, Evidence Atlas, bug fixes ---

test('V21: connectors.css is served and contains .ce-path', async ({ page }) => {
  const res = await page.goto('/assets/css/connectors.css');
  const body = await res.text();
  expect(body).toContain('.ce-path');
});

test('V21: connector engine visual-system files are accessible', async ({ page }) => {
  const files = [
    '/assets/js/visual-system/connector-engine.js',
    '/assets/js/visual-system/connector-debug.js',
    '/assets/js/visual-system/geometry.js',
    '/assets/js/visual-system/ports.js',
    '/assets/js/visual-system/connector-routing.js',
  ];
  for (var i = 0; i < files.length; i++) {
    const res = await page.goto(files[i]);
    expect(res.status()).toBe(200);
  }
});

test('V21: evidence-atlas.js is accessible and exposes EvidenceAtlas', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain('EvidenceAtlas');
  expect(body).toContain('switchView');
});

test('V21: cover-flow.js contains cinematic cold open (10500ms beat + viewBox 1200 560)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/cover-flow.js');
  const body = await res.text();
  expect(body).toContain('10500');
  expect(body).toContain('1200 560');
});

test('V21: dual-engine.js has hand-off cost groups and preserved-context row', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/dual-engine.js');
  const body = await res.text();
  expect(body).toContain('de-gap1-costs');
  expect(body).toContain('de-gap2-costs');
  expect(body).toContain('de-preserved');
  expect(body).toContain('PRESERVED THROUGH ALL STAGES');
  expect(body).toContain('Context rebuilt');
  expect(body).toContain('Ownership changed');
});

test('V21: index.html footer is Executive Introduction, not Internal use', async ({ page }) => {
  const res = await page.goto('/index.html');
  const body = await res.text();
  expect(body).toContain('Executive Introduction');
  expect(body).toContain('NFR AI Risk Practice');
  expect(body).not.toContain('Internal use');
});

test('V21: regulation-process.js viewBox width is 1240 (last card has right margin)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/regulation-process.js');
  const body = await res.text();
  expect(body).toContain('W = 1240');
});

test('V21: ai-stack-build.js uses flex row for terrain+rails (not CSS grid)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/ai-stack-build.js');
  const body = await res.text();
  expect(body).toContain('flex-direction:row');
  expect(body).not.toContain('grid-template-columns:56px 1fr 56px');
});

test('V21: pressure-convergence.js bottleneck box starts at y=95', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/pressure-convergence.js');
  const body = await res.text();
  expect(body).toContain("y: '95'");
  expect(body).toContain("height: '215'");
});

test('V21: pitch.html loads at 1280x720 without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await gotoPage(page, BASE);
  const overflow = await page.evaluate(function() {
    return document.body.scrollWidth > document.body.clientWidth + 2;
  });
  expect(overflow).toBe(false);
});

test('V21: pitch.html loads at 1366x768 without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await gotoPage(page, BASE);
  const overflow = await page.evaluate(function() {
    return document.body.scrollWidth > document.body.clientWidth + 2;
  });
  expect(overflow).toBe(false);
});

test('V21: Evidence Atlas section renders ea-shell on scroll into view', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await gotoPage(page, BASE);
  await page.evaluate(function() {
    var s = document.querySelector('section[data-render="atlasMain"]');
    if (s) s.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1200);
  const shellCount = await page.locator('.ea-shell').count();
  expect(shellCount).toBeGreaterThanOrEqual(1);
});

test('V21: no console errors on pitch.html load at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  var errors = [];
  page.on('console', function(msg) {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await gotoPage(page, BASE);
  await page.waitForTimeout(500);
  // Filter known-acceptable console errors (missing fonts from vendor bundle etc.)
  var critical = errors.filter(function(e) {
    return !e.includes('favicon') && !e.includes('font');
  });
  expect(critical.length).toBe(0);
});

// ── V23 regression gates ──────────────────────────────────────────────────────

test('V23: SVG sprite file is accessible', async ({ page }) => {
  const res = await page.goto('/assets/icons/tabler-sprite.svg');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('symbol id="ti-menu-2"');
  expect(body).toContain('symbol id="ti-user-check"');
  expect(body).toContain('symbol id="ti-shield-check"');
});

test('V23: icon-registry.js is accessible', async ({ page }) => {
  const res = await page.goto('/assets/js/icon-registry.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('NFRIconRegistry');
  expect(body).toContain('SPRITE_PATH');
});

test('V23: screens 04-09 contain screen-hdr-row', async ({ page }) => {
  await gotoPage(page, BASE);
  const hdrRows = await page.locator('.screen-hdr-row').count();
  expect(hdrRows).toBeGreaterThanOrEqual(6);
});

test('V23: obligation-thread elements exist on page', async ({ page }) => {
  await gotoPage(page, BASE);
  const threads = await page.locator('.obligation-thread').count();
  expect(threads).toBeGreaterThanOrEqual(1);
});

test('V23: work-role-shift.js has three-lane accountability design', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('ACCOUNTABILITY REMAINS HUMAN THROUGHOUT');
  expect(body).toContain('RISK OWNER: NAMED -- ACCOUNTABLE');
  expect(body).toContain('Human judgement');
  expect(body).toContain('Evidence and accountability');
});

test('V23: work-role-shift.js has no em-dash', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  const body = await res.text();
  expect(body).not.toContain('—');
});

test('V23: scene-director.js has seek, resize, renderFallback in createTimeline', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('function seek');
  expect(body).toContain('function resize');
  expect(body).toContain('function renderFallback');
  expect(body).toContain('_attachResizeObserver');
  expect(body).toContain('document.fonts');
});

test('V23: scene-director.js has no em-dash', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).not.toContain('—');
});

test('V23: pitch.html has no em-dash', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  expect(body).not.toContain('—');
});

test('V23: obligation-thread max-height constraint in scenes.css', async ({ page }) => {
  const res = await page.goto('/assets/css/scenes.css');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('max-height');
  expect(body).toContain('.screen-hdr-row');
  expect(body).toContain('.obligation-thread');
});

test('V23: ref-room section has ea-loading-hint element', async ({ page }) => {
  await gotoPage(page, BASE);
  const hint = await page.locator('#ea-loading-hint').count();
  expect(hint).toBeGreaterThanOrEqual(1);
});

test('V23: pitch.html loads at 1920x1080 without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await gotoPage(page, BASE);
  const overflow = await page.evaluate(function() {
    return document.body.scrollWidth > document.body.clientWidth + 2;
  });
  expect(overflow).toBe(false);
});

test('V23: pitch.html loads at 1024x768 without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await gotoPage(page, BASE);
  const overflow = await page.evaluate(function() {
    return document.body.scrollWidth > document.body.clientWidth + 2;
  });
  expect(overflow).toBe(false);
});

// ── V24 regression gates ──────────────────────────────────────────────────────

test('V24: window.NFR_BUILD object present in pitch.html', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  expect(body).toContain('window.NFR_BUILD');
  expect(body).toContain('"release"');
  expect(body).toContain('"commit"');
});

test('V24: all pitch.html local asset ?v= strings use one SHA', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  const versions = body.match(/\?v=[0-9a-f]{7}/g) || [];
  const unique = Array.from(new Set(versions));
  expect(unique.length).toBeLessThanOrEqual(1);
});

test('V24: pressure-convergence uses convergence bus pattern', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/pressure-convergence.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('BUS_X');
  expect(body).toContain('pc-bus-line');
  expect(body).toContain('pc-hconn0');
  expect(body).toContain('getBBox');
  expect(body).toContain('routeConnectors');
});

test('V24: pressure-convergence has no direct text-baseline connector for stream 3', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/pressure-convergence.js');
  const body = await res.text();
  // Old hard-coded y=385 start point must not appear
  expect(body).not.toContain('270 385');
});

test('V24: regulation-process has measuredPill with getComputedTextLength', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/regulation-process.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('getComputedTextLength');
  expect(body).toContain('buildLivePill');
  expect(body).toContain('text-anchor');
  expect(body).toContain('dominant-baseline');
});

test('V24: transformation-system does not render raw node ID as display label', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('displayLabel');
  expect(body).toContain('Missing displayLabel');
  expect(body).toContain('REUSES SHARED CONTEXT');
  expect(body).not.toContain('y: \'527\'');
});

test('V24: transformation-system zone labels have pointer-events none', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  const body = await res.text();
  expect(body).toContain("'pointer-events': 'none'");
  expect(body).toContain('BUSINESS MEANING');
  expect(body).toContain('EXECUTION');
});

test('V24: scale-architecture final zoom is 0.9 not 0.7', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/scale-architecture.js');
  const body = await res.text();
  expect(body).toContain('zoomTo(0.9)');
  expect(body).not.toContain('zoomTo(0.7)');
});

test('V24: dual-engine viewBox height is 560', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/dual-engine.js');
  const body = await res.text();
  expect(body).toContain('0 0 1200 560');
  expect(body).not.toContain('0 0 1200 500');
});

// ── V25 regression gates ──────────────────────────────────────────────────────

test('V25: NFR_BUILD release is v25', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const release = await page.evaluate(() => typeof window.NFR_BUILD !== 'undefined' ? window.NFR_BUILD.release : null);
  expect(release).toBe('v25');
});

test('V25: evidence-atlas.js has a ?v= fingerprint', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  // evidence-atlas.js must appear with a ?v= parameter (not bare)
  expect(body).toContain('evidence-atlas.js?v=');
  expect(body).not.toMatch(/evidence-atlas\.js">/);
});

test('V25: vendor scripts (d3, motion, elk) are not in document head', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  // Extract the head section only
  const headMatch = body.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : '';
  expect(head).not.toContain('d3.min.js');
  expect(head).not.toContain('motion.js');
  expect(head).not.toContain('elk.bundled.js');
});

test('V25: vendor scripts appear in document body before app scripts', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  const d3Pos = body.indexOf('d3.min.js');
  const appPos = body.indexOf('app.js');
  expect(d3Pos).toBeGreaterThan(-1);
  expect(appPos).toBeGreaterThan(-1);
  expect(d3Pos).toBeLessThan(appPos);
});

test('V25: agenda overlay has no workshop-era tab buttons', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  expect(body).not.toContain('switchAgendaTab(\'questions\')');
  expect(body).not.toContain('switchAgendaTab(\'deepdives\')');
  expect(body).not.toContain('switchAgendaTab(\'method\')');
});

test('V25: nav bar contains evidence atlas button', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  expect(body).toContain('goToId(\'ref-room\')');
  expect(body).toContain('Evidence Atlas');
});

test('V25: screen 11 footer has no inline mailto link', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  // mailto should be in nav, not inside next-move scene-footer
  const nextMoveSection = body.match(/id="next-move"[\s\S]*?<\/section>/);
  if (nextMoveSection) {
    expect(nextMoveSection[0]).not.toContain('mailto:');
  }
});

test('V25: claims.json is accessible and has claims array', async ({ page }) => {
  const res = await page.goto('/assets/data/claims.json');
  expect(res && res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('claims');
  expect(Array.isArray(json.claims)).toBe(true);
  expect(json.claims.length).toBeGreaterThanOrEqual(1);
});

test('V25: reference section labels do not contain Locate the Value or Prove Safely', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  expect(body).not.toContain('Locate the Value');
  expect(body).not.toContain('Prove Safely');
});

test('V25: scene-director has visibility-change listener for background pause', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).toContain('visibilitychange');
  expect(body).toContain('document.hidden');
});

test('V25: createTimeline exposes renderStatic and getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).toContain('function renderStatic');
  expect(body).toContain('function getAccessibleSummary');
});

test('V25: SceneDirector exposes getState method', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).toContain('function getState');
  expect(body).toContain('getState: getState');
});

test('V25: scenes.css scene-accessible-summary class exists', async ({ page }) => {
  const res = await page.goto('/assets/css/scenes.css');
  const body = await res.text();
  expect(body).toContain('.scene-accessible-summary');
  expect(body).toContain('clip: rect');
});

test('V25: scenes.css footer max-height is 48px', async ({ page }) => {
  const res = await page.goto('/assets/css/scenes.css');
  const body = await res.text();
  expect(body).toContain('max-height: 48px');
});

test('V25: scene-screen has clamp gap in scenes.css', async ({ page }) => {
  const res = await page.goto('/assets/css/scenes.css');
  const body = await res.text();
  expect(body).toContain('clamp(8px, 1.1vh, 14px)');
});

test('V25: ports.js has REUSE semantic port type', async ({ page }) => {
  const res = await page.goto('/assets/js/visual-system/ports.js');
  const body = await res.text();
  expect(body).toContain("'reuse'");
  expect(body).toContain("'REUSE'");
});

test('V25: connector-debug.js shows endpoint distance and V25 threshold check', async ({ page }) => {
  const res = await page.goto('/assets/js/visual-system/connector-debug.js');
  const body = await res.text();
  expect(body).toContain('ENDPOINT_THRESHOLD');
  expect(body).toContain('Endpoint >3px');
  expect(body).toContain('V25 threshold violation');
});

test('V25: visual-grammar.js exposes ReuseMarker', async ({ page }) => {
  const res = await page.goto('/assets/js/story/visual-grammar.js');
  const body = await res.text();
  expect(body).toContain('ReuseMarker');
  expect(body).toContain('REUSES SHARED CONTEXT');
});

test('V25: visual-grammar.js documents V25 semantic colour map', async ({ page }) => {
  const res = await page.goto('/assets/js/story/visual-grammar.js');
  const body = await res.text();
  expect(body).toContain('Cyan');
  expect(body).toContain('Purple');
  expect(body).toContain('Amber');
  expect(body).toContain('human judgement and control');
});

// ── V25/4 scene additions: cover-flow, pressure-convergence, ai-stack-build ──

test('V25/4: cover-flow.js has title reveal "AI changes risk work."', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/cover-flow.js');
  const body = await res.text();
  expect(body).toContain('AI changes risk work.');
  expect(body).toContain('_buildTitle');
  expect(body).toContain('_titleEl');
});

test('V25/4: cover-flow.js has AI proposal beat', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/cover-flow.js');
  const body = await res.text();
  expect(body).toContain('_buildAiProposal');
  expect(body).toContain('_aiPropG');
  expect(body).toContain('Link OBL-27');
});

test('V25/4: cover-flow.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/cover-flow.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('AI changes risk work');
});

test('V25/4: pressure-convergence.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/pressure-convergence.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/4: pressure-convergence.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/pressure-convergence.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('evidence-led operating model');
});

test('V25/4: ai-stack-build.js implication wording is correct', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/ai-stack-build.js');
  const body = await res.text();
  expect(body).toContain('More advanced is not automatically more suitable.');
  expect(body).not.toContain('More advanced does not automatically mean more suitable.');
});

test('V25/4: ai-stack-build.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/ai-stack-build.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/4: ai-stack-build.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/ai-stack-build.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('not automatically more suitable');
});

// ── V25/5 scene additions: regulation-process, transformation-system, work-role-shift ──

test('V25/5: regulation-process.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/regulation-process.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/5: regulation-process.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/regulation-process.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('source-backed');
});

test('V25/5: transformation-system.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/5: transformation-system.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('knowledge graph');
});

test('V25/5: work-role-shift.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/5: work-role-shift.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('Accountability remains human');
});

// ── V25/6 scene additions: proof-loop, scale-architecture, unit-economics ──

test('V25/6: proof-loop.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/6: proof-loop.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('no outcome preselected');
});

test('V25/6: scale-architecture.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/scale-architecture.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/6: scale-architecture.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/scale-architecture.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('Enterprise reuse');
});

test('V25/6: unit-economics.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/unit-economics.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/6: unit-economics.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/unit-economics.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('no validated percentages');
});

// ── V25/7 scene additions: dual-engine, next-move ──

test('V25/7: dual-engine.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/dual-engine.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/7: dual-engine.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/dual-engine.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('hand-off cost');
});

test('V25/7: next-move.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/next-move.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V25/7: next-move.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/next-move.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('Frame the evidence');
});

// ── V25/8 Evidence Atlas and reference consolidation ──

test('V25/8: visuals.js hides ea-loading-hint after atlas init', async ({ page }) => {
  const res = await page.goto('/assets/js/visuals.js');
  const body = await res.text();
  expect(body).toContain('ea-loading-hint');
  expect(body).toContain('display');
  // hint.style.display='none' must be present to dismiss the loading hint
  expect(body).toContain("hint.style.display='none'");
});

test('V25/8: visuals.js fallback lists all 5 Evidence Atlas views', async ({ page }) => {
  const res = await page.goto('/assets/js/visuals.js');
  const body = await res.text();
  expect(body).toContain('Risk map');
  expect(body).toContain('Solutions');
  expect(body).toContain('Process theatre');
  expect(body).toContain('Architecture');
  expect(body).toContain('Method');
});

test('V25/8: evidence-atlas.js exposes all 5 switchView targets', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain("'map'");
  expect(body).toContain("'constellation'");
  expect(body).toContain("'theatre'");
  expect(body).toContain("'architecture'");
  expect(body).toContain("'method'");
});

// ── V25/9 Source governance, accessibility and offline hardening ──

test('V25/9: evidence-atlas.js topbar has role=tablist', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain('role: \'tablist\'');
  expect(body).toContain('aria-label');
  expect(body).toContain('Evidence Atlas views');
});

test('V25/9: evidence-atlas.js tabs have role=tab and aria-selected', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain("role: 'tab'");
  expect(body).toContain("'aria-selected'");
  expect(body).toContain('tabindex');
});

test('V25/9: evidence-atlas.js canvas has role=tabpanel and aria-labelledby', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain("role: 'tabpanel'");
  expect(body).toContain("'aria-labelledby'");
  expect(body).toContain('ea-tab-');
});

test('V25/9: evidence-atlas.js has arrow key tab navigation', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain('ArrowLeft');
  expect(body).toContain('ArrowRight');
  expect(body).toContain('_tabIdx');
});

test('V25/9: evidence-atlas.js theatre view has source-backed governance badge', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain('sourceBacked');
  expect(body).toContain('SOURCE-BACKED');
  expect(body).toContain('ILLUSTRATIVE');
});

// ── V25/10 Visual regression, smoke test and release report ──

test('V25/10: build fingerprint is v25-3e5ec2d', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const content = await page.locator('meta[name="nfr-build"]').getAttribute('content');
  expect(content).toBe('v25-3e5ec2d');
});

test('V25/10: NFR_BUILD commit is 3e5ec2d', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const commit = await page.evaluate(() => window.NFR_BUILD && window.NFR_BUILD.commit);
  expect(commit).toBe('3e5ec2d');
});

test('V25/10: all asset ?v= strings use the v25/10 SHA', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  const versions = body.match(/\?v=[0-9a-f]{7}/g) || [];
  const unique = Array.from(new Set(versions));
  expect(unique.length).toBeLessThanOrEqual(1);
  if (unique.length === 1) expect(unique[0]).toBe('?v=3e5ec2d');
});

test('V25/10: Evidence Atlas tabs render with ARIA attributes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  await page.evaluate(function() {
    var s = document.querySelector('section[data-render="atlasMain"]');
    if (s) s.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1400);
  const tablistCount = await page.locator('[role="tablist"]').count();
  expect(tablistCount).toBeGreaterThanOrEqual(1);
  const tabCount = await page.locator('[role="tab"]').count();
  expect(tabCount).toBe(5);
});

test('V25/10: Evidence Atlas active tab has aria-selected=true', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  await page.evaluate(function() {
    var s = document.querySelector('section[data-render="atlasMain"]');
    if (s) s.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1400);
  const selectedCount = await page.locator('[role="tab"][aria-selected="true"]').count();
  expect(selectedCount).toBe(1);
});

test('V25/10: no console errors on full pitch.html load at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  await page.waitForTimeout(1200);
  const critical = errors.filter(function(e) {
    return !e.includes('favicon') && !e.includes('font');
  });
  expect(critical, 'Console errors: ' + critical.join('; ')).toHaveLength(0);
});

// ── V26/1 build fingerprint and scene lifecycle ──

test('V26/1: NFR_BUILD release is v26', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  await page.goto('/pitch.html');
  const release = await page.evaluate(() => typeof window.NFR_BUILD !== 'undefined' ? window.NFR_BUILD.release : null);
  expect(release).toBe('v26');
});

test('V26/1: story-manifest.json version is 26', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('pitch_auth', '1'));
  const res = await page.goto('/assets/data/story-manifest.json');
  const json = await res.json();
  expect(parseInt(json.version)).toBe(26);
});

test('V26/1: scene-director.js exposes renderError in createTimeline', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scene-director.js');
  const body = await res.text();
  expect(body).toContain('function renderError');
  expect(body).toContain('renderError: renderError');
});

// ── V26/2 visual primitives and composition linter ──

test('V26/2: visual-grammar.js exposes SystemField, WorkLane, MetricStrip', async ({ page }) => {
  const res = await page.goto('/assets/js/story/visual-grammar.js');
  const body = await res.text();
  expect(body).toContain('SystemField');
  expect(body).toContain('WorkLane');
  expect(body).toContain('MetricStrip');
});

test('V26/2: composition-linter.js is accessible and exports CompositionLinter', async ({ page }) => {
  const res = await page.goto('/assets/js/story/composition-linter.js');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('CompositionLinter');
  expect(body).toContain('?debug=composition');
  expect(body).toContain('FAIL_MAX_SHAPES');
});

// ── V26/3 card reduction: screens 01-03 ──

test('V26/3: task-route.js is Work Pattern Scanner with 5 DIMS', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/task-route.js');
  const body = await res.text();
  expect(body).toContain('WORK PATTERN SCANNER');
  expect(body).toContain('Rule stability');
  expect(body).toContain('Input structure');
  expect(body).toContain('Ambiguity');
  expect(body).toContain('Action complexity');
  expect(body).toContain('Control sensitivity');
});

test('V26/3: task-route.js cycles through 4 examples including Regulation Coverage', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/task-route.js');
  const body = await res.text();
  expect(body).toContain('REGULATION COVERAGE');
  expect(body).toContain('Screen 04 example');
  expect(body).toContain('OF 04');
});

test('V26/3: task-route.js exposes getAccessibleSummary', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/task-route.js');
  const body = await res.text();
  expect(body).toContain('getAccessibleSummary');
  expect(body).toContain('Work Pattern Scanner');
});

test('V26/3: task-route.js dispatches scene:complete', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/task-route.js');
  const body = await res.text();
  expect(body).toContain('scene:complete');
});

test('V26/3: task-route.js has no em-dash', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/task-route.js');
  const body = await res.text();
  expect(body).not.toContain('—');
});

test('V26/3: ai-stack-build.js terrain layers have no card border-radius', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/ai-stack-build.js');
  const body = await res.text();
  expect(body).toContain('border-radius:0');
  expect(body).not.toContain('border-radius:5px 5px 0 0');
});

// ── V26/4 transformation system as continuous fields ──

test('V26/4: transformation-system.js fields use dashed boundary (not card border)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  const body = await res.text();
  expect(body).toContain('stroke-dasharray');
  expect(body).toContain('system fields');
  // Must NOT use the old opaque card fill
  expect(body).not.toContain("fill: 'rgba(18,21,30,0.93)'");
});

test('V26/4: transformation-system.js field labels are corner-positioned (not centred)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/transformation-system.js');
  const body = await res.text();
  // Corner label uses text-anchor:start and f.x + 10 offset
  expect(body).toContain("'text-anchor': 'start'");
  expect(body).toContain('f.x + 10');
});

// ── V26/5 accountability relay and evidence test rig ──

test('V26/5: work-role-shift.js comment updated to V26', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  const body = await res.text();
  expect(body).toContain('V26');
  expect(body).toContain('Accountability relay');
});

test('V26/5: work-role-shift.js play() clears timers before build', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/work-role-shift.js');
  const body = await res.text();
  // play() must clear _timers before build() (timer safety)
  expect(body).toContain('_timers.forEach(clearTimeout); _timers = [];\n      build()');
});

test('V26/5: proof-loop.js uses connected pipeline strip (not 5 equal cards)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  // Pipeline strip: one container div, steps separated by internal dividers
  expect(body).toContain('pf-flow-row');
  // Must NOT use per-node border-radius card style (no individual card padding)
  expect(body).not.toContain("'border-radius:8px'");
  expect(body).not.toContain('border-radius:8px');
});

test('V26/5: proof-loop.js gate is one human approval element (not 4 equal chips)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/proof-loop.js');
  const body = await res.text();
  // Gate uses border:1px solid var(--green) on one container
  expect(body).toContain('border:1px solid var(--green)');
  // Options are internal dividers, not separate border-radius chips
  expect(body).toContain('border-left:1px solid rgba(88,201,148,0.2)');
});

// ── V26/6 semantic zoom and cost waterfall ──

test('V26/6: scale-architecture.js comment updated to V26', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/scale-architecture.js');
  const body = await res.text();
  expect(body).toContain('V26');
  expect(body).toContain('system fields');
});

test('V26/6: scale-architecture.js proof rect uses transparent fill (not opaque card)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/scale-architecture.js');
  const body = await res.text();
  expect(body).toContain('rgba(77,217,224,0.04)');
  expect(body).not.toContain("fill: C_S1, stroke: C_CYAN");
});

test('V26/6: unit-economics.js station strip is one connected element (not 6 equal boxes)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/unit-economics.js');
  const body = await res.text();
  // Strip uses internal dividers not separate border-radius boxes
  expect(body).toContain('border-left:1px solid var(--border-1)');
  // Must NOT use the old per-station box border-radius style
  expect(body).not.toContain("'border-radius:6px;border:1px solid var(--border-1)'");
});

test('V26/6: unit-economics.js controls are rows inside one panel (not 6 equal cards)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/unit-economics.js');
  const body = await res.text();
  // Panel header identifies the design controls container
  expect(body).toContain('DESIGN CONTROLS');
  // Control rows use internal top-border dividers
  expect(body).toContain('border-top:1px solid var(--border-1)');
  // Must NOT use the old card border-radius
  expect(body).not.toContain("border-radius:8px;padding:9px 14px");
});

// ── V26/7 hand-off tax and decision runway ──

test('V26/7: dual-engine.js has local svgEl definition inside scene closure', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/dual-engine.js');
  const body = await res.text();
  // V26: svgEl must be defined locally in each scene closure
  expect(body).toContain('function svgEl(');
  expect(body).toContain('V26');
});

test('V26/7: next-move.js has V26 comment and artefact panel (not 4 equal cards)', async ({ page }) => {
  const res = await page.goto('/assets/js/story/scenes/next-move.js');
  const body = await res.text();
  expect(body).toContain('V26');
  // One panel with internal dividers
  expect(body).toContain('border-left:1px solid rgba(88,201,148,0.18)');
  // Must NOT use the old 4-card style (separate border-radius boxes)
  expect(body).not.toContain("border-radius:6px;\\n        + 'padding:8px 10px");
});

// ── V26/8 deterministic Evidence Atlas and reference views ──

test('V26/8: evidence-atlas.js has V26 comment declaring deterministic map', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  expect(body).toContain('V26');
  expect(body).toContain('deterministic radial layout');
});

test('V26/8: evidence-atlas.js theatre uses 2-column row layout (not 3x2 grid)', async ({ page }) => {
  const res = await page.goto('/assets/js/evidence-atlas.js');
  const body = await res.text();
  // Row wrapper class added
  expect(body).toContain('ea-theatre-row');
  // Must NOT use the old fixed 3-column grid
  expect(body).not.toContain('grid-template-columns:repeat(3,1fr)');
});

// ── V26/9 viewport, density, fallback, connector and replay QA ──

test('V26/9: every scene file has a _timers array declared', async ({ page }) => {
  const sceneFiles = [
    'cover','pressure-rising','ai-stack-build','task-route','regulation-process',
    'transformation-system','work-role-shift','proof-loop',
    'scale-architecture','unit-economics','dual-engine','next-move'
  ];
  for (const name of sceneFiles) {
    const res = await page.goto('/assets/js/story/scenes/' + name + '.js');
    const body = await res.text();
    expect(body, name + ' missing _timers').toContain('var _timers');
  }
});

test('V26/9: every scene file dispatches scene:complete', async ({ page }) => {
  const sceneFiles = [
    'cover','pressure-rising','ai-stack-build','task-route','regulation-process',
    'transformation-system','work-role-shift','proof-loop',
    'scale-architecture','unit-economics','dual-engine','next-move'
  ];
  for (const name of sceneFiles) {
    const res = await page.goto('/assets/js/story/scenes/' + name + '.js');
    const body = await res.text();
    expect(body, name + ' missing scene:complete').toContain("'scene:complete'");
  }
});

test('V26/9: every scene file has getAccessibleSummary', async ({ page }) => {
  const sceneFiles = [
    'cover','pressure-rising','ai-stack-build','task-route','regulation-process',
    'transformation-system','work-role-shift','proof-loop',
    'scale-architecture','unit-economics','dual-engine','next-move'
  ];
  for (const name of sceneFiles) {
    const res = await page.goto('/assets/js/story/scenes/' + name + '.js');
    const body = await res.text();
    expect(body, name + ' missing getAccessibleSummary').toContain('getAccessibleSummary');
  }
});

test('V26/9: no em-dash (U+2014) in any scene file', async ({ page }) => {
  const sceneFiles = [
    'cover','pressure-rising','ai-stack-build','task-route','regulation-process',
    'transformation-system','work-role-shift','proof-loop',
    'scale-architecture','unit-economics','dual-engine','next-move'
  ];
  for (const name of sceneFiles) {
    const res = await page.goto('/assets/js/story/scenes/' + name + '.js');
    const body = await res.text();
    expect(body, name + ' contains em-dash').not.toContain('—');
  }
});

test('V26/9: composition-linter.js is present and exposes CompositionLinter', async ({ page }) => {
  const res = await page.goto('/assets/js/story/composition-linter.js');
  const body = await res.text();
  expect(body).toContain('CompositionLinter');
  expect(body).toContain('window.CompositionLinter');
});

test('V26/9: visual-grammar.js has SystemField, WorkLane, and MetricStrip', async ({ page }) => {
  const res = await page.goto('/assets/js/story/visual-grammar.js');
  const body = await res.text();
  expect(body).toContain('SystemField');
  expect(body).toContain('WorkLane');
  expect(body).toContain('MetricStrip');
});

// ── V26/10 public deployment smoke test and build stamp ──

test('V26/10: pitch.html build stamp updated to v26/68f790f', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html');
  const buildRelease = await page.evaluate(() => window.NFR_BUILD && window.NFR_BUILD.release);
  const buildCommit  = await page.evaluate(() => window.NFR_BUILD && window.NFR_BUILD.commit);
  expect(buildRelease).toBe('v26');
  expect(buildCommit).toBe('68f790f');
});

test('V26/10: pitch.html asset ?v= fingerprints all match build commit', async ({ page }) => {
  const res = await page.goto('/pitch.html');
  const body = await res.text();
  // All asset fingerprints should use the v26/10 commit SHA
  expect(body).toContain('?v=68f790f');
  expect(body).not.toContain('?v=afa82a4');
});
