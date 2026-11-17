# Transition story baseline

Recorded before the TPRM six-month transition story replaced the V26 core route.

- Commit: `d54af8a` (`main`), run from a clean, detached worktree
- Date: 2026-11-17
- Core route: 12 screens (cover, pressure-rising, ai-stack, task-route, regulation-process, transformation-implications, work-role-shift, proof-loop, scale-architecture, unit-economics, dual-engine, next-move)
- Screenshots: 24 PNGs at 1440x900 and 1366x768, final state, in `artifacts/baseline/transition/` (gitignored)

## Playwright suite

`npx playwright test` across the six configured projects: **854 passed, 634 failed** (1,488 tests, 43 minutes with 6 workers).

| Project | Failures | Cause |
|---|---:|---|
| mobile (iPhone 14) | 248 of 248 | WebKit is not installed on this machine (`browserType.launch: Executable doesn't exist`). Environment, not code. |
| chromium | 77 | 25 test-server failures, 52 stale or real assertion failures (below) |
| 1366x768 | 75 | Same pattern as chromium |
| 1440x900 | 80 | Same pattern as chromium |
| 1920x1080 | 77 | Same pattern as chromium |
| 1024x768 | 77 | Same pattern as chromium |

### Test-server failures (25 in chromium)

`net::ERR_CONNECTION_REFUSED`, `Network.getResponseBody: No resource`, `Download is starting` and 30-second timeouts. The suite's web server is `python -m http.server`, which refuses connections under six parallel workers on Windows. Results that depend on page loads are therefore flaky.

### Stale or real assertion failures (52 in chromium)

Version gates that no longer match the V26 build (for example `build fingerprint is v15/v16/v17/v25`, `story-manifest.json version is 19`, `NFR_BUILD commit is 3e5ec2d`), geometry gates from older covers (`cover scene-stage height <= 320px`, `cover SVG viewBox is fixed 1120 x 280`, `cover scene-stage is data-size=compact`), checks for selectors the V26 screens no longer use (`.scene-insight`, `regulation-process evidence badge`, `next-move has three sequential stages`, `partner proposition screen has 3 field cards`), source-text checks against renamed code (`scene-director.js has ... renderFallback`, `every scene file has a _timers array`), em dash in `transformation-system.js`, and `right arrow key advances` (reads a `currentIdx` global that does not exist).

## Audit scripts

| Script | Result | Notes |
|---|---|---|
| `npm run lint-copy` | FAIL, 57 items | 23 are `exclamation-in-string` false positives on JavaScript operators (`!==`, `!important`); the rest are `must`, `will`, `always`, `highest`, `lowest` in reference-room copy and `content.js`, plus one em dash in `evidence-atlas.js` |
| `npm run check-emdash` | FAIL | Em dash in `evidence-atlas.js`, `transformation-system.js`, `scripts/audit-all.js`, `tests/layout.spec.js`, `package.json`, `AUDIT_BASELINE.md` |
| `npm run audit:story` | PASS, 3 warnings | Reference subtitles over 22 words |
| `npm run audit:motion` | PASS, 3 warnings | One untracked `setTimeout` in `ai-stack-build.js`; two scenes over 7 seconds |
| `npm run audit:offline` | PASS | No external runtime dependencies |
| `npm run audit:icons` | FAIL, 5 errors | `ti-lock`, `ti-building-bank`, `ti-eye`, `ti-pencil`, `ti-bolt` used in reference HTML but missing from `icon-manifest.json` |

## Layout defect found while capturing

Every core section after the cover hid its bottom 56 px, including the footer insight line. `section[data-slide]` had both `padding-top: 56px` (space for the fixed nav) and `scroll-margin-top: 56px`, so `scrollIntoView` pushed each section 56 px below the top of the viewport. Visible in the baseline screenshots (for example `regulation-process`: no footer).
