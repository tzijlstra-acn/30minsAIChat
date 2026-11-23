# NFR Workspace pitch: current-state audit (before v4)

Audited on 2026-11-23 against the live build (release v28, commit `ee2aa2b`, `https://tzijlstra-acn.github.io/30minsAIChat/`). Baseline tag: `baseline-pre-pitch-v4`. Working branch: `feat/pitch-v4`.

## 1. Repository

| Concern | Finding |
|---|---|
| Structure | Plain static HTML, CSS and JavaScript; no build step. Kept. |
| Entry points | `index.html` (access gate) then `pitch.html` (experience). |
| Password | Client-side check in `index.html`, sets `sessionStorage.pitch_auth`. A presentation gate only: the code and every file are readable without it. |
| Scene registry | `section[data-slide]` in `pitch.html`; one `SceneDirector` scene per screen (`assets/js/story/scenes/`); `assets/data/story-manifest.json` generated from the DOM. |
| Hash routing | `#<section id>` kept in the URL by `history.replaceState`; atlas views use `#ref/<view>`. |
| Demo components | `assets/js/story/workspace-kit.js` (shell, queue, NFR Assist, stepper) and the four app scenes. |
| Content | `assets/data/workspace-demo.js` (v2 copy) and `assets/data/tprm-case.js` (case facts). |
| Animation | CSS transitions on `createTimeline` schedules; reduced motion and safe mode render final states. |
| Presenter controls | `assets/js/story/presenter-controls.js`: Space, W, A, T, R, 0, Escape, `?`; nav buttons for keys, technical depth, safe mode, replay, pause. |
| Appendix | Index, business case, prototype captures, Evidence Atlas, A1 to A6. Technical depth drawer (T) with architecture, lifecycle, controls, measures. |
| Build and deploy | `node scripts/stamp-build.js v28`; GitHub Pages deploys the repository root on push to `main`. |
| Tests | Playwright (`tests/`), audits (`npm run audit:all`, `lint-copy`, `check-emdash`), `npm run qa:visual`. Last run: 347 passed, 0 failed. |
| Runtime dependencies | None external; fonts, icons and libraries are vendored. |
| Console | No errors or warnings on load or across the route (Playwright and visual QA). |
| Visibility | **The repository is public, and Pages serves every committed file**, including `docs/`, `tests/` and `scripts/` (checked: `docs/PRESENTER_GUIDE.md` returns 200). Anything committed is public. |

## 2. Scene inventory

| ID / hash | Current headline | Takeaway | Action | Decision |
|---|---|---|---|---|
| `#cover` | From firefighting to prepared judgement. | NFR Workspace connects assistance to controlled work | none | Keep; queue silhouette follows the new home |
| `#assistance-here` | AI assistance is becoming part of the working day. | AI already helps one person with one activity | none | Keep |
| `#remaining-burden` | The NFR professional still connects the process. | The person is the integration layer | none | Keep |
| `#four-ways` | One Workspace. Four ways to get work done. | Ask, Use, Run, Create on one foundation | none | **Refine**: generic examples, no "which path" rule, no assistant-versus-Workspace sentence |
| `#three-layers` | Scaling requires three layers to move together. | Roles, process and platform move in parallel | none | Keep |
| `#workspace-boot` | Role, permissions and controls load before the assistant. | Context before chat | Space skips | Keep |
| `#workspace-home` | Start with the next decision, not a blank chat. | The day starts from decisions | Space asks questions | **Refine**: three equal cards from three unrelated journeys, no dominant item, answers are bullet text, no hand-off from Assist to the app |
| `#workspace-journey` | For standard work, the case arrives prepared end to end. | AI prepares, the professional decides | Space steps | **Refine**: the decision records immediately; no write-back preview, no confirm step, no visible queue change |
| `#workspace-builder` | For the long tail, create a controlled ad hoc agent. | Governed long tail | Space steps | **Refine**: result is text only; no schedule option; "not a fifth platform" line missing |
| `#authority-boundary` | AI prepares. Professionals decide. Systems record. | No capability owns the risk | none | Keep |
| `#six-month-route` | Six months to prove one loop on reusable foundations. | One loop in six months | none | Keep |
| `#value-decision` | Value grows as assistance becomes operational work. | Choose the first loop | none | Keep |

Per-scene checks (understandable without the presenter, advances the story, visual carries meaning, bank-neutral, no unexplained terms, no replacement of GRC or authoritative systems, no autonomous risk authority): all pass except the refinements marked above.

## 3. Requirement gap matrix

| Requirement | Status |
|---|---|
| NFR Workspace naming consistent | present and strong |
| Existing AI assistance acknowledged early | present and strong |
| Remaining integration burden understandable | present and strong |
| Ask / Use / Run / Create explicit | present but unclear (examples generic, no selection rule) |
| Assistant versus Workspace difference stated | missing |
| Three transformation layers explicit | present and strong |
| Workspace load transition purposeful | present and strong |
| Application opens with work and decisions | present but unclear (no dominant item) |
| One coherent journey across the demo | present but unclear (home mixes unrelated journeys) |
| Standardised NFR journey demonstrated | present and strong |
| Assist hands off to the role app | missing |
| Agent Builder as the governed long tail | present but unclear (no schedule, text-only result) |
| One visual, evidence-backed output | missing |
| Human decision point visible | present and strong |
| Controlled write-back and recorded state change | present but unclear (no preview or confirm, no queue change) |
| Six-month path mirrors the three layers | present and strong |
| Value across risk, operating performance, capacity | present and strong |
| Technical depth without interrupting the route | present but unclear (no runtime layer, no write-back pattern, lifecycle without gates, no capability-choice page) |
| Appendix pages have a return control | missing (only the atlas has one) |
| Reset, replay and safe mode | present and strong |

## 4. Visual baseline

Checked at 1920x1080, 1600x900, 1440x900, 1366x768 (100 percent) and 1536x864 at 1.25 device pixel ratio (125 percent browser zoom on a 1080p screen).

| Check | Result |
|---|---|
| Text clipping, overflow, tiny labels | None (automated floors and screenshots) |
| Scrolling inside screens | None in the core route |
| Modal and drawer positioning | Trace drawer, decision panel, reuse panel and technical drawer all inside the frame |
| Animation | Smooth; no jank seen in full-motion walkthroughs |
| Deep links | `#cover` and every section hash load and recover |
| After password entry | Same layout |
| Console errors | None |

## 5. Confidentiality scan

| Item | Result |
|---|---|
| Secrets, tokens, model keys | None found |
| Client names or branding | None |
| Internal asset names, source or screenshots | None |
| Internal URLs | One link to the team's own "NFR AI Assets" portal (restricted access) |
| Personal information | The team appendix publishes seven colleagues' names, work emails and photos (`assets/data/reference/team.json`, `assets/team/`); `assets/data/claims.json` lists one owner email. Deliberate content; confirm the team agrees to public exposure |
| Access code | In `index.html` by design; not a security control |

## 6. P0 scope for v4

1. Four ways: concrete, journey-linked examples, a "use it when" rule on each card, and the assistant-versus-Workspace sentence.
2. Home: one dominant "Now" decision, "Next", "Watching" and "Done by Workspace", all from the third-party world; one question answered as a visual, source-linked insight that hands off to the Periodic Review app.
3. Journey: propose, inspect, approve, commit, receipt, with a write-back preview and a visible case and queue change.
4. Agent Builder: the "not a fifth platform" line, "Run once" naming, a schedule option and a visual result.
5. Appendix A to E (capability choice, experience to execution, candidate runtime reuse in generic terms, ad hoc to standard lifecycle, governed write-back), merged into the technical drawer; a return control on every appendix page.
6. Material about any specific internal asset only in a git-ignored local file.
