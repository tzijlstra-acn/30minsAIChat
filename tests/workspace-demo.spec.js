// @ts-check
/**
 * NFR Workspace -- the deterministic product demo, presenter controls and appendix A to G.
 * Start-up, decision-first home, visual insight with source detail, Assist-to-app hand-off,
 * the periodic review with write-back preview and commit, the Agent Builder, keys, safe
 * mode, browser history, the state registry and an offline run.
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
async function reduced(page) { await page.emulateMedia({ reducedMotion: 'reduce' }); }

// ── START-UP ──
test.describe('Workspace start-up', () => {
  test('W enters the Workspace from the story; context loads before the assistant', async ({ page }) => {
    await open(page, '#three-layers');
    await page.waitForFunction(() => sections[current].id === 'three-layers');
    await press(page, 'w');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'playing', null, { timeout: 8000 });
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
  });

  test('reduced motion shows the ready Workspace at once', async ({ page }) => {
    await reduced(page);
    await open(page, '#workspace-boot');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'complete', null, { timeout: 5000 });
    await expect(page.locator('#workspace-boot .ws-card')).toHaveCount(1);
    await expect(page.locator('#workspace-boot .wb-boot')).toHaveClass(/is-gone/);
  });
});

// ── HOME AND VISUAL INSIGHT ──
test.describe('Workspace home', () => {
  test('one decision is dominant: Now, then Next, Watching and Done by the Workspace', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-home');
    const H = page.locator('#workspace-home');
    await expect(H.locator('.ws-card')).toHaveCount(1);
    for (const k of ['Why it is here', 'What changed', 'What was prepared', 'Decision needed']) await expect(H.locator('.ws-card')).toContainText(k);
    await expect(H.locator('.ws-card')).toContainText('Due today');
    await expect(H.locator('.ws-next')).toHaveCount(2);
    await expect(H.locator('.ws-watch-row')).toHaveCount(3);
    await expect(H.locator('.ws-done')).toContainText('Done by the Workspace overnight');
    // One third-party world: every item in the queue is a third-party case
    const ids = await H.locator('[data-case]').evaluateAll((e) => e.map((x) => x.dataset.case));
    ids.forEach((id) => expect(id).toMatch(/^TPRM-/));
  });

  test('a question returns a visual, source-linked insight, not a paragraph', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-home');
    await press(page, 'Space');
    expect(await ws(page)).toBe('insight-visible');
    const I = page.locator('#workspace-home .wi');
    await expect(I.locator('.wi-conclusion')).toContainText('Three of 42 critical services are deteriorating');
    await expect(I.locator('.wi-fig')).toHaveCount(4);
    await expect(I.locator('.wi-bar-row')).toHaveCount(5);
    await expect(I.locator('.wi-bar-row.is-selected')).toContainText('Cloud hosting');
    await expect(I.locator('svg.wi-trend polyline')).toHaveCount(1);
    await expect(I.locator('.wi-driver')).toHaveCount(4);
    await expect(I.locator('.wi-driver .ws-chip').first()).toBeVisible();
    await expect(I.locator('.wi-fresh')).toContainText('within your access');
    await expect(I.locator('.wi-action')).toContainText('Recommended next action');
    expect(await I.locator('.wi-bars').getAttribute('aria-label')).toContain('Cloud hosting +18');
    await expect(I.locator('.wi-fig')).toContainText(['services deteriorating', 'severe issues open', 'acceptances expiring', 'required report missing']);
    await expect(I.locator('[data-visual="ranking"] .wi-panel-title')).toHaveText('Cloud hosting moved most, +18 points');
    await expect(I.locator('[data-visual="trend"] .wi-panel-title')).toHaveText('Above appetite since September');
    await expect(I.locator('.wi-chart-foot .ws-source')).toHaveCount(2);
    await expect(I.locator('.wi-drivers .ws-source')).toHaveCount(4);
    // Each chart carries a data table for screen readers: five services; six months and the appetite
    await expect(I.locator('[data-visual="ranking"] table.ws-sr-only tr')).toHaveCount(5);
    await expect(I.locator('[data-visual="trend"] table.ws-sr-only tr')).toHaveCount(7);
    await I.getByRole('button', { name: 'Pin to My work' }).click();
    await expect(I.locator('.wi-saved')).toContainText('Pinned');
    await I.locator('.wj-crumb').click();
    await expect(page.locator('#workspace-home .ws-card')).toHaveCount(1);
  });

  test('Assist hands the work to the Periodic Review app, which opens at the role app', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-home');
    await press(page, 'Space');
    await press(page, 'Space');
    const hand = page.locator('#workspace-home .ws-handoff');
    await expect(hand).toContainText('Open the Periodic Review app to validate them');
    await hand.getByRole('button', { name: 'Open Periodic Review App' }).click();
    await page.waitForFunction(() => sections[current].id === 'workspace-journey' && SceneDirector.getState() === 'complete', null, { timeout: 6000 });
    expect(await ws(page)).toBe('role-app-open');
    await expect(page.locator('#workspace-journey .wj-ev')).toHaveCount(4);
  });

  test('Open case leads into the periodic-review journey at its summary', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-home');
    await page.locator('#workspace-home .ws-card').getByRole('button', { name: 'Open case' }).click();
    await page.waitForFunction(() => sections[current].id === 'workspace-journey' && SceneDirector.getState() === 'complete', null, { timeout: 4000 });
    expect(await ws(page)).toBe('case-open');
  });
});

// ── STANDARD JOURNEY: PROPOSE, INSPECT, APPROVE, COMMIT, RECEIPT ──
test.describe('Periodic-review journey', () => {
  test('nothing is written until the professional confirms a previewed change', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    const J = page.locator('#workspace-journey');
    expect(await ws(page)).toBe('case-open');
    await expect(J.locator('.wj-sum')).toHaveCount(6);
    await J.getByRole('button', { name: /Open the periodic review app/ }).click();
    expect(await ws(page)).toBe('role-app-open');
    await expect(J.locator('.wj-ev.is-gap')).toContainText('Missing');

    await press(page, 'a');
    expect(await ws(page)).toBe('automation-trace-open');
    await expect(J.locator('.wj-trace .wj-tr')).toHaveCount(8);
    await expect(J.locator('.wj-trace .wj-tr').last()).toHaveClass(/is-waiting/);
    await press(page, 'Escape');
    expect(await ws(page)).toBe('role-app-open');

    await J.getByRole('button', { name: 'Go to decision' }).click();
    expect(await ws(page)).toBe('decision-pending');
    await expect(J.locator('.wj-option')).toHaveCount(3);
    await J.locator('.wj-option').first().click();
    expect(await ws(page)).toBe('writeback-preview');
    const P = J.locator('.wj-preview');
    await expect(P).toContainText('Nothing written yet');
    await expect(P).toContainText('System of record (synthetic GRC)');
    await expect(P.locator('.wj-change:not(.wj-change-hd)')).toHaveCount(4);
    await expect(P.locator('.wj-change-to').first()).toHaveText('Approved with condition');
    for (const t of ['Target', 'Record', 'Decision', 'Reason', 'Actions', 'Approver', 'Evidence']) await expect(P.locator('.wj-preview-meta dt', { hasText: t })).toHaveCount(1);
    await expect(P.locator('.wj-preview-meta')).toContainText('Vendor manager, due in 30 days');
    await expect(J.locator('.ts-receipt')).toHaveCount(0);

    await P.getByRole('button', { name: 'Confirm and record' }).click();
    expect(await ws(page)).toBe('writeback-complete');
    await expect(J.locator('.wj-statechange')).toContainText('Approved with condition');
    await expect(J.locator('.wj-statechange')).toContainText('Moved from Now to Recorded today');
    await expect(J.locator('.wj-receipt .ts-receipt[data-state="acknowledged"]')).toBeVisible();
    const receipt = await J.locator('.wj-receipt-list dt').allInnerTexts();
    ['Actor', 'Role', 'Time', 'Action', 'Target record', 'Sources', 'Policy'].forEach((t) => expect(receipt).toContain(t));
    await expect(J.locator('.wj-receipt-list')).toContainText('TPRM-PR-042');
  });

  test('Space walks the journey from the role app to the receipt, then moves on', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    const seen = [];
    for (let i = 0; i < 5; i++) { await press(page, 'Space'); seen.push(await ws(page)); }
    expect(seen).toEqual(['role-app-open', 'automation-trace-open', 'decision-pending', 'writeback-preview', 'writeback-complete']);
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'workspace-builder', null, { timeout: 4000 });
  });

  test('the recorded decision changes the home queue; Replay restores it', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    for (let i = 0; i < 5; i++) await press(page, 'Space');
    await page.locator('#workspace-journey').getByRole('button', { name: 'Back to decisions' }).click();
    await page.waitForFunction(() => sections[current].id === 'workspace-home' && SceneDirector.getState() === 'complete', null, { timeout: 6000 });
    const H = page.locator('#workspace-home');
    await expect(H.locator('.ws-done-recorded')).toContainText('Approved with condition');
    await expect(H.locator('.ws-card')).not.toContainText('Cloud hosting provider');
    await enter(page, 'workspace-journey');
    for (let i = 0; i < 5; i++) await press(page, 'Space');
    await page.locator('#workspace-journey').getByRole('button', { name: 'Replay this case' }).click();
    expect(await ws(page)).toBe('case-open');
    await enter(page, 'workspace-home');
    await expect(page.locator('#workspace-home .ws-done-recorded')).toHaveCount(0);
  });

  test('each decision previews and records its own outcome', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    const decisions = await page.evaluate(() => NFR_WORKSPACE_DEMO.journey.decisions.map((d) => ({ id: d.id, status: d.status, outcome: d.outcome })));
    for (const d of decisions) {
      await press(page, 'Space'); await press(page, 'Space'); await press(page, 'Space');
      await page.locator('#workspace-journey [data-decision="' + d.id + '"]').click();
      await expect(page.locator('#workspace-journey .wj-change-to').first()).toHaveText(d.status);
      await page.locator('#workspace-journey').getByRole('button', { name: 'Confirm and record' }).click();
      await expect(page.locator('#workspace-journey .wj-rec')).toContainText(d.outcome);
      await page.locator('#workspace-journey').getByRole('button', { name: 'Replay this case' }).click();
    }
  });
});

// ── AGENT BUILDER ──
test.describe('Agent Builder', () => {
  test('goal, permissions before any run, plan, run and a visual, cited briefing', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-builder');
    const B = page.locator('#workspace-builder');
    const D = await page.evaluate(() => NFR_WORKSPACE_DEMO.builder);
    await expect(B.locator('.wa-prompt-input')).toHaveValue(D.prompt);
    await expect(B.locator('.wa-intro')).toContainText('Agent Builder covers changing and ad hoc needs');
    await B.getByRole('button', { name: 'Interpret request' }).click();
    expect(await builder(page)).toBe('goal-interpreted');
    await B.getByRole('button', { name: 'Continue to scope' }).click();
    expect(await ws(page)).toBe('agent-builder-permissions');
    await expect(B.locator('.wa-scope-col.is-cannot li')).toHaveText(D.scope.cannot);
    await expect(B).toContainText(D.scope.inherit);
    await expect(B.getByRole('button', { name: 'Run', exact: true })).toHaveCount(0);
    await B.getByRole('button', { name: 'Review the plan' }).click();
    expect(await ws(page)).toBe('agent-builder-plan');
    await B.getByRole('button', { name: 'Run', exact: true }).click();
    expect(await ws(page)).toBe('agent-builder-result');
    await expect(B.locator('.wa-conc-fill')).toHaveCount(D.report.clusters.length);
    await expect(B.locator('.wa-mark')).toHaveCount(D.report.expiries.length);
    await expect(B.locator('.wa-sources li')).toHaveCount(D.report.citations.length);
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
  });

  test('reuse is governed: run once, save, schedule or request a reviewed template', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-builder');
    for (let i = 0; i < 5; i++) await press(page, 'Space');
    expect(await ws(page)).toBe('agent-builder-save');
    const R = page.locator('#workspace-builder .wa-reuse');
    await expect(R.locator('.wa-reuse-btn')).toHaveCount(4);
    await expect(R.locator('.wa-promo-label')).toHaveText(['Run once', 'Personal agent', 'Reviewed team template', 'Standard app or automation']);
    await R.locator('[data-reuse="schedule"]').click();
    expect(await builder(page)).toBe('scheduled-personal');
    await expect(R.locator('.wa-promo-step.is-here')).toContainText('Personal agent');
    await press(page, 'Space');
    expect(await builder(page)).toBe('publication-requested');
    await expect(R.locator('.wa-promo-step.is-here')).toContainText('Reviewed team template');
    await R.locator('[data-reuse="save"]').click();
    expect(await builder(page)).toBe('saved-personal');
  });

  test('the request and the goal can be edited; Use example restores the scenario', async ({ page }) => {
    await reduced(page);
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

// ── FOUR WAYS ──
test.describe('Four ways to work', () => {
  test('each capability says when to use it and gives one concrete example', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'four-ways');
    const caps = await page.evaluate(() => NFR_WORKSPACE_DEMO.capabilities.map((c) => ({ when: c.when, example: c.example })));
    const cards = page.locator('#four-ways .fw-card');
    await expect(cards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(cards.nth(i).locator('.fw-when-text')).toHaveText(caps[i].when);
      await expect(cards.nth(i).locator('.fw-ex-text')).toContainText(caps[i].example);
    }
    await expect(page.locator('#four-ways .fw-diff')).toContainText('An assistant helps a person complete an activity.');
  });
});

// ── APPENDIX A TO G ──
test.describe('Appendix A to G', () => {
  const PAGES = ['appendix-capability-choice', 'appendix-authority', 'appendix-architecture', 'appendix-writeback', 'appendix-agent-lifecycle', 'appendix-runtime-reuse', 'appendix-proof-gates'];

  test('each page has its own hash, renders its topic and returns to the story', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'six-month-route');
    for (const id of PAGES) {
      await page.goto('/pitch.html#' + id);
      await page.waitForFunction((sid) => typeof sections !== 'undefined' && sections[current] && sections[current].id === sid, id, { timeout: 8000 });
      const body = page.locator('#' + id + ' .at-body');
      expect((await body.innerText()).length, id).toBeGreaterThan(150);
      await expect(page.locator('#storyReturn')).toBeVisible();
    }
    await expect(page.locator('#appendix-capability-choice .at-table tbody tr')).toHaveCount(4);
    await expect(page.locator('#appendix-architecture .at-layer')).toHaveCount(4);
    await expect(page.locator('#appendix-runtime-reuse .at-col')).toHaveCount(3);
    await expect(page.locator('#appendix-agent-lifecycle .at-stage')).toHaveCount(4);
    await expect(page.locator('#appendix-writeback .at-flow-step')).toHaveCount(8);
    await expect(page.locator('#appendix-authority .at-col')).toHaveCount(3);
    await expect(page.locator('#appendix-authority .at-footer')).toHaveText('AI prepares. Rules constrain. Professionals decide. Systems record.');
    await expect(page.locator('#appendix-proof-gates .at-stage')).toHaveCount(4);
    await expect(page.locator('#appendix-proof-gates .at-measure')).toHaveCount(10);
    // Letters follow page order
    const tags = await page.$$eval('section[id^="appendix-"] .sec-tag', (t) => t.map((x) => x.textContent.trim().slice(0, 10)));
    expect(tags).toEqual(['Appendix A', 'Appendix B', 'Appendix C', 'Appendix D', 'Appendix E', 'Appendix F', 'Appendix G']);
    await page.locator('#storyReturn').click();
    await page.waitForFunction(() => sections[current].dataset.route === 'core', null, { timeout: 6000 });
    await expect(page.locator('#storyReturn')).toBeHidden();
  });

  test('the public pages name no internal asset or developer tooling', async ({ page }) => {
    await open(page);
    for (const id of PAGES) {
      const text = (await page.locator('#' + id).innerText()).toLowerCase();
      ['studio', 'matrix', 'podman', 'github', 'pull request', 'claude', 'harness', 'mcp'].forEach((t) => expect(text.includes(t), id + ' mentions ' + t).toBe(false));
    }
  });

  test('Escape on an appendix page returns to the last story screen', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'four-ways');
    await page.evaluate(() => document.getElementById('appendix-writeback').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => sections[current].id === 'appendix-writeback');
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 6000 });
  });
});

// ── PRESENTER CONTROLS ──
test.describe('Presenter controls', () => {
  test('Space moves on from story screens; arrows move between screens', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'assistance-here');
    await press(page, 'Space');
    await page.waitForFunction(() => sections[current].id === 'remaining-burden', null, { timeout: 4000 });
    expect(await ws(page)).toBe('integration-burden');
    await press(page, 'ArrowLeft');
    await page.waitForFunction(() => sections[current].id === 'assistance-here', null, { timeout: 4000 });
  });

  test('Escape closes the trace first, then returns from the Workspace to the story', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    await press(page, 'a');
    await expect(page.locator('#workspace-journey .wj-trace')).toHaveCount(1);
    await press(page, 'Escape');
    await expect(page.locator('#workspace-journey .wj-trace')).toHaveCount(0);
    expect(await here(page)).toBe('workspace-journey');
    await press(page, 'Escape');
    await page.waitForFunction(() => sections[current].id === 'authority-boundary', null, { timeout: 4000 });
    expect(await ws(page)).toBe('control-boundary');
  });

  test('0 resets the whole experience to the cover from any state', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-builder');
    await press(page, 'Space'); await press(page, 'Space');
    await press(page, '0');
    await page.waitForFunction(() => sections[current].id === 'cover', null, { timeout: 4000 });
    expect(await ws(page)).toBe('cover');
    expect(await builder(page)).toBeUndefined();
  });

  test('T opens the same topics as the appendix and links to each page', async ({ page }) => {
    await open(page);
    await press(page, 't');
    const drawer = page.locator('#techDrawer');
    await expect(drawer).toHaveClass(/open/);
    await expect(drawer.locator('.pc-tab')).toHaveText(['A · Capability choice', 'B · AI, rules, people', 'C · Architecture', 'D · Write-back', 'E · Agent lifecycle', 'F · Runtime reuse', 'G · Proof gates']);
    await expect(drawer.locator('.at-table tbody tr')).toHaveCount(4);
    await drawer.getByRole('tab', { name: 'D · Write-back' }).click();
    await expect(drawer.locator('.at-flow-step')).toHaveCount(8);
    await expect(drawer.locator('.pc-controls dt')).toHaveCount(11);
    await drawer.locator('.pc-page-link').click();
    await page.waitForFunction(() => sections[current].id === 'appendix-writeback', null, { timeout: 6000 });
    await expect(drawer).not.toHaveClass(/open/);
    await page.keyboard.press('Shift+Slash');
    await expect(page.locator('#keysOverlay')).toHaveClass(/open/);
    await press(page, 'Escape');
    await expect(page.locator('#keysOverlay')).not.toHaveClass(/open/);
  });

  test('after a mouse click on a control, Space still advances instead of pressing it again', async ({ page }) => {
    await reduced(page);
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
    await page.waitForFunction(() => sections[current].id === 'workspace-journey', null, { timeout: 4000 });
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
    await expect(page.locator('#storyReturn')).toBeHidden();
  });
});

// ── V5: SOURCE DETAIL, CHART REGISTRY, KEYS, HISTORY, STATE MODEL ──
test.describe('Source detail, chart registry, keys and history', () => {
  test('a source chip opens a read-only source detail; Escape and Space close it first', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-home');
    await press(page, 'Space');
    const H = page.locator('#workspace-home');
    await H.locator('.wi-drivers .ws-source', { hasText: 'Contract annex' }).click();
    const E = H.locator('.ws-evidence');
    await expect(E).toBeVisible();
    await expect(E).toContainText('Annex C');
    await expect(E).toContainText('Read only, within your access');
    expect(await ws(page)).toBe('source-detail-open');
    await press(page, 'Escape');
    await expect(E).toHaveCount(0);
    expect(await ws(page)).toBe('insight-visible');
    await H.locator('.wi-chart-foot .ws-source').first().click();
    await expect(H.locator('.ws-evidence')).toContainText('KRI-CH-07');
    await press(page, 'Space');
    await expect(H.locator('.ws-evidence')).toHaveCount(0);
    expect(await ws(page)).toBe('insight-visible');
    await press(page, 'Space');
    await expect(H.locator('.ws-handoff')).toBeVisible();
    // In the role app the comparison sources open the same detail; Space closes, then steps on
    await enter(page, 'workspace-journey');
    await press(page, 'Space');
    const J = page.locator('#workspace-journey');
    await J.locator('.wj-cmp .ws-source', { hasText: 'SOC 2 Type II' }).click();
    await expect(J.locator('.ws-evidence')).toContainText('Two exceptions');
    await press(page, 'Space');
    expect(await ws(page)).toBe('role-app-open');
    await press(page, 'Space');
    expect(await ws(page)).toBe('automation-trace-open');
  });

  test('the insight draws only supported chart types and falls back to a table', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(() => {
      const K = window.WorkspaceKit;
      const bad = K.renderVisual({ id: 'x', type: 'pie', title: 'T', unit: 'u', summary: 's', data: [{ label: 'a', value: 1 }] });
      const broken = K.renderVisual({ id: 'y', type: 'trend-line', title: 'T', unit: 'u', summary: 's', labels: ['a'], values: [1, 2], threshold: 1 });
      return {
        types: K.VISUAL_TYPES,
        valid: window.NFR_WORKSPACE_DEMO.insight.visuals.map((v) => K.validateVisual(v)),
        bad: [bad.classList.contains('is-fallback'), bad.querySelectorAll('table.wi-table tr').length, bad.dataset.invalid],
        broken: [broken.classList.contains('is-fallback'), broken.dataset.invalid]
      };
    });
    expect(r.types).toEqual(['ranked-bar', 'trend-line']);
    expect(r.valid).toEqual([null, null]);
    expect(r.bad).toEqual([true, 1, 'unsupported type pie']);
    expect(r.broken[0]).toBe(true);
  });

  test('Page Down and Page Up move between screens, as a clicker sends them', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'four-ways');
    await press(page, 'PageDown');
    await page.waitForFunction(() => sections[current].id === 'three-layers', null, { timeout: 4000 });
    await press(page, 'PageUp');
    await page.waitForFunction(() => sections[current].id === 'four-ways', null, { timeout: 4000 });
  });

  test('S toggles safe mode', async ({ page }) => {
    await open(page);
    await press(page, 's');
    expect(await page.evaluate(() => SceneDirector.isSafe() && document.documentElement.classList.contains('safe-mode'))).toBe(true);
    await expect(page.locator('#safeModeBtn')).toHaveAttribute('aria-pressed', 'true');
    await press(page, 'S');
    expect(await page.evaluate(() => SceneDirector.isSafe())).toBe(false);
  });

  test('browser Back from an appendix page returns to the screen that opened it; Forward goes back in', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    await page.waitForTimeout(600);
    await page.evaluate(() => goToId('appendix-writeback'));
    await page.waitForFunction(() => sections[current].id === 'appendix-writeback', null, { timeout: 4000 });
    expect(page.url()).toContain('#appendix-writeback');
    await page.goBack();
    await page.waitForFunction(() => sections[current].id === 'workspace-journey', null, { timeout: 4000 });
    expect(page.url()).toContain('#workspace-journey');
    await page.goForward();
    await page.waitForFunction(() => sections[current].id === 'appendix-writeback', null, { timeout: 4000 });
    expect(await ws(page)).toBe('appendix');
  });

  test('every state the default route reaches is in the experience state model', async ({ page }) => {
    const warnings = [];
    page.on('console', (m) => { if (m.type() === 'warning' && m.text().includes('NFRExperience')) warnings.push(m.text()); });
    await reduced(page);
    await open(page);
    await enter(page, 'cover');
    const known = await page.evaluate(() => NFRExperience.states());
    const seen = new Set([await ws(page)]);
    for (let i = 0; i < 60 && (await here(page)) !== 'value-decision'; i++) {
      await press(page, 'Space');
      await page.waitForTimeout(250);
      seen.add(await ws(page));
    }
    expect(await here(page)).toBe('value-decision');
    for (const s of seen) expect(known, s).toContain(s);
    ['workspace-home', 'insight-visible', 'role-app-open', 'decision-pending', 'writeback-preview', 'writeback-complete', 'agent-builder-save', 'value'].forEach((s) => expect([...seen]).toContain(s));
    expect(warnings).toEqual([]);
  });
});

// ── SAFE MODE AND RESILIENCE ──
test.describe('Safe mode and resilience', () => {
  test('?safe=1 renders final states without animation and keeps the demo working', async ({ page }) => {
    await open(page, '#workspace-boot', '?safe=1');
    await page.waitForFunction(() => sections[current].id === 'workspace-boot' && SceneDirector.getState() === 'complete', null, { timeout: 3000 });
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode') && SceneDirector.isSafe())).toBe(true);
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
    await page.locator('#safeModeBtn').click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('safe-mode'))).toBe(false);
  });

  test('refreshing inside the Workspace recovers a valid state; #cover deep link works', async ({ page }) => {
    await reduced(page);
    await open(page);
    await enter(page, 'workspace-journey');
    await press(page, 'Space'); await press(page, 'Space');
    await page.reload();
    await page.waitForFunction(() => typeof sections !== 'undefined' && sections[current] && sections[current].id === 'workspace-journey' && SceneDirector.getState() === 'complete', null, { timeout: 8000 });
    expect(await ws(page)).toBe('case-open');
    await page.goto('/pitch.html#cover');
    await page.waitForFunction(() => typeof sections !== 'undefined' && sections[current] && sections[current].id === 'cover', null, { timeout: 8000 });
  });

  test('after the first load the core route and the demo run offline', async ({ page, context }) => {
    const failed = [];
    const errors = [];
    await reduced(page);
    await open(page);
    await page.waitForLoadState('networkidle');
    await context.setOffline(true);
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('pageerror', (e) => errors.push(e.message));
    const ids = await page.evaluate(() => sections.filter((x) => x.dataset.route === 'core').map((x) => x.id));
    for (const id of ids) await enter(page, id);
    await enter(page, 'workspace-journey');
    for (let i = 0; i < 5; i++) await press(page, 'Space');
    expect(await ws(page)).toBe('writeback-complete');
    await context.setOffline(false);
    expect(failed).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('app-to-app moves are instant, so the application stays in place', async ({ page }) => {
    await reduced(page);
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
