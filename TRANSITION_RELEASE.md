# V27 release note: TPRM six-month transition story

The core route now follows one synthetic TPRM periodic review (`TPRM-PR-042`) from today's fragmented work to one controlled, measurable process in six months. Baseline before the change: [TRANSITION_BASELINE.md](TRANSITION_BASELINE.md).

## Route

16 core screens in five chapters. TPRM is the worked example; the opening and the scale chapter speak for every NFR domain.

- SETTING THE SCENE: cover; the hook (non-financial risk is outgrowing the team); the north star (one operating layer for all non-financial risk work, proven first on one TPRM periodic review)
- TODAY: the TPRM officer as the integration layer, connection work, the pilot trap
- THE NEW WORKDAY: prepared decision, role workspace, the workspace live (NFROS, the running product), authority boundary
- SIX MONTHS AND PAYBACK: six-month route, month-six proof, interactive business case
- SCALE AND START: reuse core (closing the loop back to the north star), integrated delivery, first move

Slide types mark the transitions: the cover is a landing slide (hero title, tagline, compact animated visual, clickable five-chapter route); each chapter opens with a full-screen divider (numeral, guiding question, the chapter's screens, progress marker, the worked-example line) that counts as "Ch n / 5" rather than a screen; the appendix opens with its own landing. Divider lists and the landing route are built from the DOM.

## The workspace, live

Screen 08 shows NFROS, the running product, on its synthetic institution (Arcadia Bank AG), in three real captures stepped by the scene and selectable by the presenter: the Third-Party Risk Manager's workday; the AI Partner asked to build a skill in a sentence; and the Skills builder reading that skill back, previewing it on the role's own records and leaving saving to the person. The captures are in `assets/img/nfros/` and come from the NFROS branch `feat/tprm-skills-builder` (Skills on Processes, read only, scoped to the role's entity, every run audited through the `runSkill` READ tool, rule-based drafting when no model key is present). The screen carries no case thread: it shows the product, not the case. If a capture fails to load, the static fallback shows the Skills capture.

Titles, subtitles, closing lines, durations and handoff tokens are in `assets/data/story-manifest.json`; a test keeps them equal to the HTML.

Everything after the core route is a marked appendix: an index screen, the Evidence Atlas, then A1 to A6 in story order, each tagged with the part of the story it supports. The nav tab and counter read "Appendix". Appendix copy that contradicted the story (a link to a removed screen, FTE redeployment and penalty avoidance as KPIs) was rewritten.

## Where things live

| Concern | File |
|---|---|
| Synthetic case (only source of case facts) | `assets/data/tprm-case.js` |
| Business-case defaults, scenarios, bounds, labels, formula text | `assets/data/business-case.js` |
| Calculations (pure, no DOM) | `assets/js/story/roi-model.js` |
| Calculator session state (`sessionStorage` key `nfr_roi_assumptions_v1`) | `assets/js/story/business-case-state.js` |
| Story components and design canvas | `StoryKit` in `assets/js/story/visual-grammar.js` |
| Scene styles | V27 block at the end of `assets/css/scenes.css` |
| One scene per screen | `assets/js/story/scenes/*.js` |
| Evidence Atlas deep dives | `assets/js/evidence-atlas.js` (controlled write, workstreams, economics, reuse) |

Each scene draws on a fixed 1040 x 520 canvas (480 for the authority screen) scaled to fit the stage, so geometry is deterministic at every viewport. Scenes support the full SceneDirector lifecycle and dispatch `scene:complete`; under reduced motion they render the complete final state at once.

## Fixes to existing behaviour

- Sections hid their bottom 56 px (and the footer line) because `section[data-slide]` had both nav padding and `scroll-margin-top`. The scroll margin is removed.
- SceneDirector paused any scene that implements `resize` 120 ms after mount and never resumed it. Resize is now layout-only, and `createTimeline` resumes from where it paused instead of replaying.
- The icon registry rewrote `<i class="ti">` into a sprite SVG that the stage-wide `svg` rule stretched. Story scenes use `<span class="ti">` (same local font).
- Space no longer toggles pause when a button or link has focus.
- The Playwright web server is `node scripts/serve.js`; `python -m http.server` refused connections under parallel workers.
- `lint-copy` no longer reports JavaScript operators (`!==`, `!important`) as exclamation marks. Remaining copy findings were reworded rather than suppressed.

## Results

- Playwright, desktop projects (chromium, 1366x768, 1440x900, 1920x1080, 1024x768): all pass (326 tests run; 344 story tests skip outside chromium because they set their own viewports).
- The `mobile` project (iPhone 14, WebKit) cannot run on this machine: WebKit is not installed (`npx playwright install webkit`).
- `lint-copy`, `check-emdash`, `audit:story`, `audit:motion`, `audit:offline`, `audit:icons`, `audit:all`, `validate-data`: all pass.
- Screenshots (initial, midpoint, final at 1440x900 and 1366x768): `artifacts/baseline/transition-after/` (gitignored).

## Decisions and limits

- Text floor: canvas text is never set below 12 px. Rendered size is at least 11 px at 1440x900 and above, 10 px at 1366x768 and 1280x720, and 9.5 px at 1024x768, where long titles wrap and the stage shrinks.
- Shared components were added only where two or more scenes use them. The calculator's fields and scenario toggle stay local to the business-case scene.
- Handoff tokens are declared in the manifest. Continuity across screens is carried by the case badge and header case thread, not by animated object handoffs between screens.
- The Evidence Atlas is regrouped by client question and has four new deep dives. Some atlas items in the plan (journey prioritisation, task routing, Role App factory, governance lifecycle, proof frontier) are not built yet; existing views cover part of that ground.
- The 12 V26 scene files and their version-gate tests were removed (recoverable from git history).
- The first-gate name in the plan, "month-zero gate", is shown as the ready-to-build gate at the end of month 2, so the timeline does not show month zero at month two.
