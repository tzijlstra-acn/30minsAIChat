# NFR Workspace pitch: current-state audit (before v5)

Audited on 2026-11-23 against the deployed build (release v29, commit `298e7ee`, `https://tzijlstra-acn.github.io/30minsAIChat/`), opened through the password flow. Baseline tag: `baseline-pre-pitch-v5` (535cc3b). Working branch: `feat/pitch-v5`. The v4 audit is in the history of this file.

## 1. How the build runs

| Step | Command | Note |
|---|---|---|
| Install | none for the deck; `npm install` only for the test tools | No runtime dependencies; fonts, icons and libraries are vendored |
| Local preview | `npm run serve` (port 8080) or `node scripts/serve.js <port>` | Open `index.html`, enter the access code, land on `pitch.html#cover` |
| Production build | none | Plain HTML, CSS and JavaScript; `node scripts/stamp-build.js v<n>` stamps release, commit and cache keys |
| Tests | `npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768` | Mobile (WebKit) is not installed on this machine |
| Audits | `npm run audit:all`, `python scripts/check-emdash.py`, `python scripts/lint-copy.py` | Story, icons, motion, offline, claims, copy |
| Screenshots | `npm run qa:visual` | Core screens, demo beats and appendix pages at four sizes |
| Deploy | push to `main` | GitHub Pages, two-job workflow (build uploads, deploy waits) |

## 2. Repository inventory

| Concern | Finding |
|---|---|
| Structure | Static HTML, CSS and JavaScript. Kept. |
| Entry points | `index.html` (access gate, `location.replace` to the deck) then `pitch.html`. |
| Scene registry | `section[data-slide]` in `pitch.html`; one `SceneDirector` scene per screen (`assets/js/story/scenes/`); `assets/data/story-manifest.json` generated from the DOM. |
| Password | Client-side check; sets `sessionStorage.pitch_auth`. Presentation gating only. |
| Hash navigation | `#<section id>` via `history.replaceState`; atlas views use `#ref/<view>`. Deep links load on start. |
| Demo components | `assets/js/story/workspace-kit.js` (shell, queue, insight, Assist, stepper) and four app scenes. |
| Content | `assets/data/workspace-demo.js` (all copy and numbers), `assets/data/tprm-case.js` (case facts). |
| Animation | CSS transitions on `createTimeline` schedules; reduced motion and safe mode render final states. |
| Presenter controls | `presenter-controls.js`: Space, W, A, T, R, 0, Escape, `?`; arrows in `navigation.js`. |
| Appendix | Index, A to E pages (`appendix-topics.js`), business case, prototype captures, Evidence Atlas, A1 to A6. Technical drawer (T) renders the same topics. |
| External dependencies | None at runtime. No CDN. |
| Console | No errors or warnings across the route and the demo (visual QA, 4 sizes). |
| Visibility | **Public repository; Pages serves every committed file.** Internal notes live only in git-ignored `*.local.md`. |

## 3. Scene inventory (default route)

| Hash | Current headline | One sentence to remember | Decision | Reason |
|---|---|---|---|---|
| `#cover` | From firefighting to prepared judgement. | This is a future NFR working experience, not an AI architecture pitch | Keep | Clear; supporting line close to the brief |
| `#assistance-here` | AI assistance is becoming part of the working day. | Banks already have assistance; operationalising it is next | **Refine** | "Is becoming" undersells current maturity; say banks already have it |
| `#remaining-burden` | The NFR professional still connects the process. | Fragmented systems make specialists the integration layer | **Refine** | Use the brief's sharper headline about the integration burden |
| `#four-ways` | One Workspace. Four ways to get work done. | Ask, Use, Run, Create, on one foundation | Keep | Examples, rule and assistant-versus-Workspace sentence present |
| `#three-layers` | Scaling requires three layers to move together. | Roles, process and platform move in parallel | **Refine** | Footer says "AI layer", but there is no AI layer on the screen |
| `#workspace-boot` | Role, permissions and controls load before the assistant. | Context loads before chat | **Refine** | Status copy should say what is loading (decisions, case and evidence state) |
| `#workspace-home` | Start with the next decision, not a blank chat. | The day starts from decisions; one answer is visual and hands off to the app | **Refine** | Chart titles describe, not conclude; no data table; source chips do not open the source; figures mix context with decision facts |
| `#workspace-journey` | For standard work, the case arrives prepared end to end. | Automation pauses; the professional decides; the record changes | **Refine** | Preview lacks owner, due date and reason; receipt lacks role, action and target record |
| `#workspace-builder` | For the long tail, create a controlled ad hoc agent. | Long-tail work stays inside permissions | Keep | Purpose, sources, permissions, prohibited actions, plan, review and promotion all shown |
| `#authority-boundary` | AI prepares. Professionals decide. Systems record. | No capability owns the risk | Keep | |
| `#six-month-route` | Six months to prove one loop on reusable foundations. | One loop in six months | **Refine** | Entry conditions miss the platform route and proof thresholds; brief's month-six line |
| `#value-decision` | Value grows as assistance becomes operational work. | Choose the first loop and the evidence for the next wave | **Refine** | Close asks for the first loop only, not for the evidence to scale |

No scene is merged or removed: twelve screens remain, and none repeats another.

### Per-scene checks (core route)

Questions: (2) understandable without the presenter; (3) advances the story; (4) visual carries meaning; (5) no unexplained AI or architecture terms; (6) cannot be read as replacing bank platforms; (7) cannot be read as delegating risk authority; (8) four or fewer primary ideas; (9) legible on a corporate laptop; (10) claim status.

| Scene | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Cover | yes | yes | yes | yes | yes | yes | yes | yes | concept |
| Assistance | yes | yes | yes | yes | yes | yes | yes | yes | market observation |
| Burden | yes | yes | yes | yes | yes | yes | yes | yes | observation |
| Four ways | yes | yes | yes | yes, terms defined on the cards | yes | yes | yes (four) | yes | target design |
| Three layers | yes | yes | yes | "AI layer" unclear | yes | yes | yes (three) | yes | concept |
| Boot | yes | yes | yes | yes | yes | yes | yes | yes | demonstrated (synthetic) |
| Home and insight | yes | yes | yes | yes | yes | yes | yes | yes | demonstrated (synthetic) |
| Journey | yes | yes | yes | yes | yes, "system of record" stays the record | yes, human gate visible | yes | yes | demonstrated (synthetic) |
| Builder | yes | yes | yes | yes | yes | yes | yes | yes | demonstrated (synthetic) |
| Boundary | yes | yes | yes | yes | yes | yes | yes (three) | yes | principle |
| Six months | yes | yes | yes | yes | yes, "not in scope" line | yes | yes | yes | plan, needs client validation |
| Value | yes | yes | yes | yes | yes | yes | yes (three) | yes | hypothesis |

## 4. Requirement gap matrix

| Requirement | Status |
|---|---|
| NFR Workspace naming consistent | present and strong |
| Existing AI assistance acknowledged early | present but unclear ("becoming", not "already") |
| Remaining integration burden understandable | present and strong |
| Assistant versus Workspace difference explicit | present and strong |
| Ask / Use / Run / Create explicit and concrete | present and strong |
| Three layers explicit | present but unclear (footer names an "AI layer") |
| Workspace loading transition purposeful | present but unclear (statuses are nouns, not what is loading) |
| Starts with a role and a decision | present and strong |
| One bounded NFR journey used consistently | present and strong |
| Visual, structured, evidence-backed output | present but unclear (descriptive chart titles, no data table, sources not openable) |
| Assist hands off to a role app | present and strong |
| Automation visible without a developer canvas | present and strong |
| Agent Builder shows sources, permissions, plan, prohibited actions | present and strong |
| Human decision point visible | present and strong |
| Controlled write-back or recorded state change | present but unclear (preview lacks owner, due date and reason) |
| Audit receipt visible | present but unclear (no role, action or target record line) |
| Roadmap mirrors the three layers | present and strong |
| Value split into risk, operating performance, capacity | present and strong |
| Technical depth available but optional | present but unclear (no AI, rules and human page; proof gates only in the drawer) |
| Reset, replay, deep links, safe mode | present but unclear (no safe-mode key; Page Up and Page Down from a clicker not handled; browser Back leaves the deck from an appendix page) |
| Appendix navigation does not interrupt the route | present and strong |
| Public and internal content boundaries safe | present and strong |
| Static fallback if Pages is blocked | missing (safe mode needs the site; no PDF) |

## 5. Visual baseline

Captured with `npm run qa:visual` (artifacts/visual-qa/baseline-v5) and a 125 percent zoom pass.

| Size | Screens | Result |
|---|---|---|
| 1920x1080, 1600x900, 1440x900, 1366x768 | 12 core, 13 demo beats, drawer, 5 appendix pages | No clipping, overflow, scrolling or off-screen drawers; 0 console errors |
| 1536x864 at 1.25 (1920 at 125 percent) | 12 core | No element outside the viewport, no text under 9.5 px |
| 1152x720 at 1.25 (1440 at 125 percent) | 12 core | Same |

| Check | Result |
|---|---|
| Chart or SVG failures | None |
| Contrast | Dark theme tokens; states carry labels and icons as well as colour |
| Deep links | Every section hash loads; `#cover` recovers after reload |
| Back and forward | Back from any screen leaves the deck, because the deck keeps one history entry |
| Remote assets | None |

## 6. P0 scope for v5

1. Copy: assistance acknowledged as present; integration-burden headline; three-layer footer without an "AI layer"; boot statuses that say what loads; six-month entry conditions and month-six line; close asks for the evidence to authorise the next wave.
2. Insight: conclusion-style chart titles, decision-relevant figures, a data table for each chart, and an evidence detail that opens from every source chip.
3. Write-back preview with owner, due date and reason; receipt with role, action and target record.
4. Appendix re-ordered to the brief (A to G): add B (AI, rules and human authority) and G (proof gates and measures).
5. Controls: S toggles safe mode; Page Up and Page Down navigate; Back from an appendix page returns to the screen that opened it.
6. Static fallback: a PDF of the full route and demo beats, generated from the build.
7. Presenter guide per scene (objective, talk track, objections), buyer Q&A, QA checklist, claim audit and leak scan.
