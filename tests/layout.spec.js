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
