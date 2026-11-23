// @ts-check
/**
 * NFR Workspace v2 -- the deterministic product demo and presenter controls.
 * Start-up, home, the periodic-review journey, the Agent Builder, keys, safe mode.
 * Every test sets its own viewport, so the file runs once, in the chromium project.
 */
const { test, expect } = require('@playwright/test');

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'demo tests set their own viewport and run once');
});
test.use({ viewport: { width: 1440, height: 900 } });

async function open(page, hash, query) {
  await page.addInitScript(() => { sessionStorage.setItem('pitch_auth', '1'); });
  await page.goto('/pitch.html' + (query || '') + (hash || ''));
  await page.waitForFunction(() => typeof sections !== 'undefined' && sections.length > 0);
}
async function enter(page, id, timeout) {
  await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
  await page.waitForFunction((sid) => sections[current] && sections[current].id === sid && SceneDirector.getState() === 'complete', id, { timeout: timeout || 15000 });
}
const ws = (page) => page.evaluate(() => document.body.dataset.wsState);
const builder = (page) => page.evaluate(() => document.body.dataset.builderState);
const here = (page) => page.evaluate(() => sections[current].id);
async function press(page, key) { await page.keyboard.press(key); await page.waitForTimeout(150); }

// ── START-UP ──
test.describe('Workspace start-up', () => {
  test('W enters the Workspace from the story; context loads before the assistant', async ({ page }) => {
    await open(page, '#three-layers');
    await page.waitForFunction(() => sections[current].id === 'three-layers');
    await press(page, 'w');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'playing', null, { timeout: 8000 });
    // Midway: the four status items are loading, the assistant is not there yet
    await page.waitForTimeout(1300);
    const mid = await page.evaluate(() => ({
      statuses: document.querySelectorAll('#workspace-boot .wb-st.ts-on').length,
      assist: document.querySelector('#workspace-boot .ws-assist').classList.contains('ts-on'),
      state: document.body.dataset.wsState
    }));
    expect(mid.statuses).toBeGreaterThanOrEqual(3);
    expect(mid.assist).toBe(false);
    expect(mid.state).toBe('booting');
    await page.waitForFunction(() => SceneDirector.getState() === 'complete', null, { timeout: 5000 });
    const end = await page.evaluate(() => ({
      done: document.querySelectorAll('#workspace-boot .wb-st.is-done').length,
      assist: document.querySelector('#workspace-boot .ws-assist').classList.contains('ts-on'),
      boot: document.querySelector('#workspace-boot .wb-boot').classList.contains('is-gone'),
      synthetic: document.querySelector('#workspace-boot .ws-top').textContent.includes('Synthetic demonstration')
    }));
    expect(end).toEqual({ done: 4, assist: true, boot: true, synthetic: true });
    expect(await ws(page)).toBe('workspace-home');
  });

  test('the start-up takes about two seconds, can be skipped with Space and replayed with R', async ({ page }) => {
    await open(page);
    const started = Date.now();
    await enter(page, 'workspace-boot');
    const took = Date.now() - started;
    expect(took).toBeGreaterThan(1800);
    expect(took).toBeLessThan(4500);
    await press(page, 'r');
    await page.waitForFunction(() => SceneDirector.getState() === 'playing');
    await page.waitForTimeout(300);
    await press(page, 'Space');
    await page.waitForFunction(() => document.querySelector('#workspace-boot .wb-boot').classList.contains('is-gone'), null, { timeout: 1000 });
    expect(await here(page)).toBe('workspace-boot');
    await page.locator('#workspace-boot .ws-assist').waitFor();
  });

  test('reduced motion shows the ready Workspace at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '#workspace-boot');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'complete', null, { timeout: 5000 });
    await expect(page.locator('#workspace-boot .ws-card')).toHaveCount(3);
    await expect(page.locator('#workspace-boot .wb-boot')).toHaveClass(/is-gone/);
  });
});

// ── HOME ──
test.describe('Workspace home', () => {
  test('starts from a decision queue: why, what changed, evidence, decision and due date', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-home');
    const first = page.locator('#workspace-home .ws-card').first();
    for (const k of ['Why it is here', 'What changed', 'Evidence', 'Decision required']) await expect(first).toContainText(k);
    await expect(first).toContainText('Due today');
    await expect(page.locator('#workspace-home .ws-nav-item.is-active')).toHaveText('Home');
    await expect(page.locator('#workspace-home .ws-card')).toHaveCount(3);
  });

  test('Space asks the three suggested questions in order, then moves on', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-home');
    const qs = await page.evaluate(() => NFR_WORKSPACE_DEMO.assist.questions.map((q) => q.q));
    for (const q of qs) {
      await press(page, 'Space');
      await expect(page.locator('#workspace-home .ws-answer-q')).toHaveText(q);
      await expect(page.locator('#workspace-home .ws-answer-src')).toContainText('Sources:');
    }
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'workspace-journey', null, { timeout: 4000 });
  });

  test('Open case leads into the periodic-review journey', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-home');
    await page.locator('#workspace-home .ws-card').first().getByRole('button', { name: 'Open case' }).click();
    await page.waitForFunction(() => sections[current].id === 'workspace-journey', null, { timeout: 4000 });
  });
});

// ── STANDARD JOURNEY ──
test.describe('Periodic-review journey', () => {
  test('runs end to end: summary, role app, trace, human decision, recorded outcome and receipt', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-journey');
    const J = page.locator('#workspace-journey');
    expect(await ws(page)).toBe('case-open');
    await expect(J.locator('.wj-sum')).toHaveCount(6);
    await expect(J.locator('.wj-sum.is-gap')).toContainText('penetration-test report');
    await expect(J.locator('.ts-receipt')).toHaveCount(0);

    await J.getByRole('button', { name: /Open the periodic review app/ }).click();
    expect(await ws(page)).toBe('role-app-open');
    await expect(J.locator('.wj-ev')).toHaveCount(4);
    await expect(J.locator('.wj-ev.is-gap')).toContainText('Missing');
    await expect(J.locator('.wj-cmp:not(.wj-cmp-hd)')).toHaveCount(3);

    await press(page, 'a');
    expect(await ws(page)).toBe('automation-trace-open');
    const trace = J.locator('.wj-trace .wj-tr');
    await expect(trace).toHaveCount(8);
    await expect(trace.last()).toHaveClass(/is-waiting/);
    await expect(trace.last()).toContainText('Human gate');
    await press(page, 'Escape');
    expect(await ws(page)).toBe('role-app-open');
    expect(await here(page)).toBe('workspace-journey');

    await J.getByRole('button', { name: 'Go to decision' }).click();
    expect(await ws(page)).toBe('human-decision');
    await expect(J.locator('.wj-option')).toHaveCount(3);
    await expect(J.locator('.wj-option').first()).toContainText('Proposed');
    await expect(J.locator('.ts-receipt')).toHaveCount(0);

    await J.locator('.wj-option').first().click();
    expect(await ws(page)).toBe('decision-recorded');
    await expect(J.locator('.wj-receipt')).toContainText('Audit receipt');
    await expect(J.locator('.wj-receipt .ts-receipt[data-state="acknowledged"]')).toBeVisible();
    for (const t of ['Your decision', 'Outcome', 'Actions created', 'Next monitoring event']) await expect(J.locator('.wj-rec')).toContainText(t);
  });

  test('Space walks the same journey and records the proposed decision', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-journey');
    const seen = [];
    for (let i = 0; i < 4; i++) { await press(page, 'Space'); seen.push(await ws(page)); }
    expect(seen).toEqual(['role-app-open', 'automation-trace-open', 'human-decision', 'decision-recorded']);
    const proposed = await page.evaluate(() => NFR_WORKSPACE_DEMO.journey.decisions[0].label);
    await expect(page.locator('#workspace-journey .wj-receipt')).toContainText(proposed);
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'workspace-builder', null, { timeout: 4000 });
  });

  test('each decision records its own outcome; Replay returns to the case', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-journey');
    const decisions = await page.evaluate(() => NFR_WORKSPACE_DEMO.journey.decisions.map((d) => ({ label: d.label, outcome: d.outcome })));
    for (let i = 0; i < decisions.length; i++) {
      await press(page, 'Space'); await press(page, 'Space'); await press(page, 'Space');
      await page.locator('#workspace-journey .wj-option').nth(i).click();
      await expect(page.locator('#workspace-journey .wj-rec')).toContainText(decisions[i].outcome);
      await page.locator('#workspace-journey').getByRole('button', { name: 'Replay this case' }).click();
      expect(await ws(page)).toBe('case-open');
    }
  });
});

// ── AGENT BUILDER ──
test.describe('Agent Builder', () => {
  test('goal, then scope and permissions before any run, then plan, run and a cited briefing', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-builder');
    const B = page.locator('#workspace-builder');
    const D = await page.evaluate(() => NFR_WORKSPACE_DEMO.builder);
    await expect(B.locator('.wa-prompt-input')).toHaveValue(D.prompt);
    expect(await builder(page)).toBe('idle');

    await B.getByRole('button', { name: 'Interpret request' }).click();
    expect(await builder(page)).toBe('goal-interpreted');
    await expect(B.locator('.wa-goal-list dt')).toHaveText(D.goal.map((g) => g.k));

    await B.getByRole('button', { name: 'Continue to scope' }).click();
    expect(await ws(page)).toBe('agent-builder-scope');
    await expect(B.locator('.wa-scope-col.is-read li')).toHaveText(D.scope.read);
    await expect(B.locator('.wa-scope-col.is-create li')).toHaveText(D.scope.create);
    await expect(B.locator('.wa-scope-col.is-cannot li')).toHaveText(D.scope.cannot);
    await expect(B).toContainText(D.scope.inherit);
    await expect(B).toContainText('Output: private to you');
    await expect(B).toContainText('Human review before sharing');
    await expect(B.getByRole('button', { name: 'Run' })).toHaveCount(0);

    await B.getByRole('button', { name: 'Review the plan' }).click();
    expect(await builder(page)).toBe('plan-reviewed');
    await expect(B.locator('.wa-plan-step')).toHaveCount(5);
    await expect(B.getByRole('button', { name: 'Edit plan' })).toBeVisible();

    await B.getByRole('button', { name: 'Run', exact: true }).click();
    expect(await builder(page)).toBe('output-ready');
    await expect(B.locator('.wa-report-title')).toHaveText(D.report.title);
    await expect(B.locator('.wa-cite').first()).toBeVisible();
    await expect(B.locator('.wa-sources li')).toHaveCount(D.report.citations.length);
    await expect(B.locator('.wa-gap')).toHaveCount(D.report.gaps.length);
    await expect(B.locator('.wa-outbar')).toContainText('human review required');
  });

  test('the run is staged and deterministic in full motion', async ({ page }) => {
    await open(page);
    await enter(page, 'workspace-builder');
    await press(page, 'Space'); await press(page, 'Space'); await press(page, 'Space');
    await press(page, 'Space');
    expect(await ws(page)).toBe('agent-builder-running');
    await expect(page.locator('#workspace-builder .wa-stage')).toHaveCount(5);
    await page.waitForFunction(() => document.body.dataset.builderState === 'output-ready', null, { timeout: 6000 });
    await expect(page.locator('#workspace-builder .wa-report')).toBeVisible();
  });

  test('reuse is governed: save privately, then request a reviewed team template', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-builder');
    for (let i = 0; i < 5; i++) await press(page, 'Space');
    expect(await ws(page)).toBe('agent-builder-save');
    const R = page.locator('#workspace-builder .wa-reuse');
    await expect(R.locator('.wa-promo-label')).toHaveText(await page.evaluate(() => NFR_WORKSPACE_DEMO.builder.promotion));
    await R.getByRole('button', { name: 'Save to My Agents' }).click();
    expect(await builder(page)).toBe('saved-personal');
    await expect(R.locator('.wa-reuse-result')).toContainText('private to you');
    await expect(R.locator('.wa-promo-step.is-here')).toContainText('Personal agent');
    await R.getByRole('button', { name: 'Request team template' }).click();
    expect(await builder(page)).toBe('publication-requested');
    await expect(R.locator('.wa-promo-step.is-here')).toContainText('Reviewed team template');
    await expect(R).toContainText('Not a back door');
  });

  test('the request and the goal can be edited; Use example restores the scenario', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-builder');
    const B = page.locator('#workspace-builder');
    await B.locator('.wa-prompt-input').fill('Something else entirely');
    await expect(B.locator('.wa-edited')).toBeVisible();
    await B.getByRole('button', { name: 'Use example' }).click();
    await expect(B.locator('.wa-edited')).toBeHidden();
    await B.getByRole('button', { name: 'Interpret request' }).click();
    await B.getByRole('button', { name: 'Edit goal' }).click();
    await B.locator('.wa-goal-list input').first().fill('Two-page briefing');
    await B.getByRole('button', { name: 'Done' }).click();
    await expect(B.locator('.wa-goal-list dd').first()).toHaveText('Two-page briefing');
  });
});

// ── PRESENTER CONTROLS ──
test.describe('Presenter controls', () => {
  test('Space moves on from story screens; arrows move between screens', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'assistance-here');
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'remaining-burden', null, { timeout: 4000 });
    await press(page, 'ArrowLeft');
    await page.waitForFunction(() => sections[current].id === 'assistance-here', null, { timeout: 4000 });
  });

  test('Escape closes the trace first, then returns from the Workspace to the story', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-journey');
    await press(page, 'a');
    await expect(page.locator('#workspace-journey .wj-trace')).toHaveCount(1);
    await press(page, 'Escape');
    await expect(page.locator('#workspace-journey .wj-trace')).toHaveCount(0);
    expect(await here(page)).toBe('workspace-journey');
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'authority-boundary', null, { timeout: 4000 });
    expect(await ws(page)).toBe('deck');
  });

  test('0 resets the whole experience to the cover from any state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-builder');
    await press(page, 'Space'); await press(page, 'Space');
    await press(page, '0');
    await page.waitForFunction(() => sections[current].id === 'cover', null, { timeout: 4000 });
    expect(await ws(page)).toBe('deck');
    expect(await builder(page)).toBeUndefined();
  });

  test('T opens technical depth with four tabs; ? lists the keys; Escape closes both', async ({ page }) => {
    await open(page);
    await press(page, 't');
    const drawer = page.locator('#techDrawer');
    await expect(drawer).toHaveClass(/open/);
    await expect(drawer.locator('.pc-tab')).toHaveText(['Reference architecture', 'Agent governance', 'Control catalogue', 'Measurement library']);
    await expect(drawer.locator('.pc-arch-layer')).toHaveCount(5);
    await drawer.getByRole('tab', { name: 'Agent governance' }).click();
    await expect(drawer.locator('.pc-life li')).toHaveCount(9);
    await press(page, 'Escape');
    await expect(drawer).not.toHaveClass(/open/);
    await page.keyboard.press('Shift+Slash');
    await expect(page.locator('#keysOverlay')).toHaveClass(/open/);
    await expect(page.locator('#keysOverlay')).toContainText('Enter the NFR Workspace');
    await press(page, 'Escape');
    await expect(page.locator('#keysOverlay')).not.toHaveClass(/open/);
  });

  test('after a mouse click on a control, Space still advances instead of pressing it again', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'assistance-here');
    await page.locator('#safeModeBtn').click();
    expect(await page.evaluate(() => SceneDirector.isSafe())).toBe(true);
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'remaining-burden', null, { timeout: 4000 });
    expect(await page.evaluate(() => SceneDirector.isSafe())).toBe(true);
    await enter(page, 'workspace-home');
    await page.locator('#workspace-home .ws-assist-q').nth(1).click();
    await press(page, 'Space');
    await expect(page.locator('#workspace-home .ws-answer-q')).not.toHaveText(await page.evaluate(() => NFR_WORKSPACE_DEMO.assist.questions[1].q));
  });

  test('arrow keys do not move the deck behind an open overlay', async ({ page }) => {
    await open(page);
    await press(page, 't');
    await press(page, 'ArrowRight');
    await page.waitForTimeout(400);
    expect(await here(page)).toBe('cover');
    await press(page, 'Escape');
  });

  test('the nav carries visible controls for keys, technical depth, safe mode, replay and pause', async ({ page }) => {
    await open(page);
    for (const id of ['keysBtn', 'techBtn', 'safeModeBtn', 'sceneReplayBtn', 'scenePauseBtn']) await expect(page.locator('#' + id)).toBeVisible();
    await page.locator('#techBtn').click();
    await expect(page.locator('#techDrawer')).toHaveClass(/open/);
  });
});

// ── SAFE MODE AND RESILIENCE ──
test.describe('Safe mode and resilience', () => {
  test('?safe=1 renders final states without animation and keeps the demo working', async ({ page }) => {
    await open(page, '#workspace-boot', '?safe=1');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'complete', null, { timeout: 3000 });
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode') && SceneDirector.isSafe())).toBe(true);
    await expect(page.locator('#workspace-boot .wb-boot')).toHaveClass(/is-gone/);
    await enter(page, 'workspace-builder');
    for (let i = 0; i < 4; i++) await press(page, 'Space');
    expect(await builder(page)).toBe('output-ready');
    await expect(page.locator('#safeModeBtn')).toHaveAttribute('aria-pressed', 'true');
  });

  test('the safe mode toggle switches the current screen to its final state', async ({ page }) => {
    await open(page);
    await page.evaluate(() => document.getElementById('remaining-burden').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'remaining-burden' && SceneDirector.getState() === 'playing');
    await page.locator('#safeModeBtn').click();
    await page.waitForFunction(() => SceneDirector.getState() === 'complete', null, { timeout: 2000 });
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode'))).toBe(true);
    await page.locator('#safeModeBtn').click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode'))).toBe(false);
  });

  test('refreshing inside the Workspace recovers a valid state; #cover deep link works', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-journey');
    await press(page, 'Space'); await press(page, 'Space');
    await page.reload();
    await page.waitForFunction(() => typeof sections !== 'undefined' && sections[current] && sections[current].id === 'workspace-journey' && SceneDirector.getState() === 'complete', null, { timeout: 8000 });
    expect(await ws(page)).toBe('case-open');
    await page.goto('/pitch.html#cover');
    await page.waitForFunction(() => typeof sections !== 'undefined' && sections[current] && sections[current].id === 'cover', null, { timeout: 8000 });
  });

  test('app-to-app moves are instant, so the application stays in place', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await enter(page, 'workspace-home');
    const before = await page.locator('#workspace-home .ws-app').boundingBox();
    await page.evaluate(() => goToId('workspace-journey'));
    await page.waitForTimeout(80);
    expect(await here(page)).toBe('workspace-journey');
    const after = await page.locator('#workspace-journey .ws-app').boundingBox();
    expect(Math.abs(after.x - before.x)).toBeLessThan(2);
    expect(Math.abs(after.width - before.width)).toBeLessThan(2);
  });
});
