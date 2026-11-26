# NFR Workspace v2: implementation notes

Audit of the repository as found on 2026-11-23, and the decisions taken for v2.

## 1. Baseline

| Item | Value |
|---|---|
| Deployed baseline | `origin/main` at `f8f1882` (v27, "TPRM six-month transition story") |
| Backup point | local tag `baseline-pre-workspace-v2` on `f8f1882`; the commit is also on `origin/main` |
| Working branch | `feat/nfr-workspace-v2`, created from `origin/main` |
| Untouched | the local `main` checkout (18 commits behind `origin/main`, with unrelated uncommitted edits) and `feat/tprm-six-month-story` |

## 2. Repository audit

| Concern | Finding |
|---|---|
| Architecture | Plain static HTML, CSS and JavaScript. No build step, no framework. Kept as is. |
| Entry points | `index.html` (access gate) redirects to `pitch.html` (the experience). |
| Access gate | Front-end code in `index.html`; sets `sessionStorage.pitch_auth = '1'`. `pitch.html` redirects back without it. A presentation gate, not a security boundary. Unchanged. |
| Screens | Every screen is a `section[data-slide]` with `data-route` (`core`, `divider`, `reference`), `data-chapter-id`, `data-nav-title` and optional `data-scene`. The DOM is the source of truth; nav, agenda, edge rail and counter are built from it. |
| Navigation | Vertical scroll with `scroll-snap`, an IntersectionObserver picks the current section, `history.replaceState` keeps `#id` in the URL. Arrow keys, G (agenda), R (replay), Space (pause), Escape. Deep links such as `pitch.html#cover` work through the hash. |
| Scenes | `SceneDirector` (`assets/js/story/scene-director.js`) mounts one scene per screen on arrival and destroys it on departure. Lifecycle: play, pause, resume, seek, reset, finish, resize, destroy, renderStatic, renderError, getAccessibleSummary. Reduced motion calls `finish()` instead of `play()`. |
| Scene drawing | `StoryKit` (`assets/js/story/visual-grammar.js`): a fixed design canvas (1040 x 520) scaled to the stage, reveal classes `ts-hide` / `ts-on`, semantic colour classes. Each core section also carries a static fallback SVG that shows if the scene fails. |
| Design tokens | CSS variables in `assets/css/pitch.css` (`:root` and `[data-theme="dark"]`). Dark theme by default. Semantic colours: cyan data, purple AI work, amber human judgement, green recorded evidence, pink gaps only. Fonts: Space Grotesk, Inter, JetBrains Mono, bundled locally. |
| Animation | CSS transitions driven by class changes on a `createTimeline` schedule. A vendored Motion build exists but the story scenes do not use it. A full-screen "neural" particle canvas runs behind every screen. |
| Runtime dependencies | All local: vendored d3, d3-sankey, Motion, elkjs, Tabler icon font, fonts. No CDN, no API, no network fetch except local JSON. |
| Deployment | GitHub Pages from `main` via `.github/workflows/deploy.yml`, uploading the repository root. Relative paths throughout. |
| Responsive | Sections are `100dvh`; canvases scale to fit. Tested at 1024x768 up to 1920x1080. |
| Appendix | `appendix` index, Evidence Atlas (`ref-room`, `assets/js/evidence-atlas.js`), A1 to A6. |
| Tests | Playwright (`tests/*.spec.js`, six projects by viewport) plus Node and Python audits (`npm run audit:all`, `lint-copy`, `check-emdash`, `validate-data`). The copy linter bans em dashes and words such as "will", "must", "never" and "always" in strings. |
| Line endings | `pitch.html` and `assets/css/scenes.css` are CRLF in the index; every other text file is LF. |
| Client references | None found. The synthetic institution in the prototype captures is "Arcadia Bank AG". |

## 3. Decisions for v2

1. **Stay on the existing architecture.** New screens are SceneDirector scenes on StoryKit canvases. The Workspace demo is a set of scenes that share one application shell (`assets/js/story/workspace-kit.js`).
2. **Twelve core screens, no chapter dividers.** The brief asks for about twelve scenes in a linear route. Dividers would add four more stops, so the four chapters remain as nav tabs only. The divider code still supports dividers if they return.
3. **Retired screens.** The v27 screens that the new model replaces are removed from the route and their scene files deleted; all of them are recoverable from the baseline tag. `authority-boundary` and `six-month-route` keep their IDs because their meaning is unchanged; their content is new.
4. **Kept as appendix.** The interactive business-case calculator and the running-prototype captures move to the appendix.
5. **One Workspace, four app screens.** `workspace-boot`, `workspace-home`, `workspace-journey` and `workspace-builder` render the same application frame at the same geometry, and moving between them scrolls instantly, so the application appears to stay put while the headline changes.
6. **Deterministic demo state.** Demo content lives in `assets/data/workspace-demo.js`; the periodic-review facts stay in `assets/data/tprm-case.js`. The interactive scenes run a small explicit state machine (beats). No generative output, no network.
7. **Presenter controls.** Space advances the scripted demo, then moves on. W, A, T, R, 0, Escape and a shortcut overlay (`?`). Safe mode via `?safe=1` or the nav toggle.
8. **No particle background.** The neural canvas is switched off: the brief rules out particle fields, and a moving background degrades screen sharing.
9. **House copy rules win over the brief's punctuation.** No em dashes, no "will/must/never/always" in copy, headlines of ten words or fewer. Brief headlines were shortened where needed (for example "For standard work, the case arrives prepared end to end.").

## 4. Where things live (v2)

| Concern | File |
|---|---|
| Workspace demo content (roles, capabilities, layers, queue, builder, roadmap, value) | `assets/data/workspace-demo.js` |
| Periodic-review case facts | `assets/data/tprm-case.js` |
| Application shell and demo components | `assets/js/story/workspace-kit.js` |
| Experience state, keys, safe mode, technical drawer | `assets/js/story/presenter-controls.js` |
| Scenes | `assets/js/story/scenes/*.js` |
| Styles for v2 scenes and the application | `assets/css/workspace.css` |
| Presenter guide | `docs/PRESENTER_GUIDE.md` |
| QA checklist | `docs/QA_CHECKLIST.md` |

## 5. What v2 delivers

| Priority | Item | State |
|---|---|---|
| P0 | NFR OS rebranded as NFR Workspace (title, nav, edge rail, copy, manifest) | Done |
| P0 | Core route rebuilt on four ways to work and three layers to scale (12 screens, 4 chapters) | Done |
| P0 | Workspace start-up (about 2.3 s, skippable, replayable, reduced-motion aware) | Done |
| P0 | Workspace home with decision queue and NFR Assist | Done |
| P0 | Periodic-review journey: summary, role app, automation trace, human decision, recorded outcome, audit receipt | Done |
| P0 | Agent Builder: goal, scope and permissions before any run, plan, staged run, cited briefing, reuse and promotion path | Done |
| P0 | Control boundary, six-month three-lane roadmap, value and workshop decision | Done |
| P0 | Reset, replay and safe mode (`?safe=1` and nav toggle) | Done |
| P0 | Synthetic, bank-neutral data only | Done |
| P0 | Presenter guide (`docs/PRESENTER_GUIDE.md`) | Done |
| P1 | Technical depth drawer: reference architecture, agent governance lifecycle, control catalogue, measurement library (key T) | Done |
| P1 | Automation trace with step types and the human gate | Done |
| P1 | Repeatable visual QA (`npm run qa:visual`) | Done |
| P1 | Dedicated evidence and citation drawer | Not built. Citations and sources show inline in the role app, NFR Assist and the briefing |
| P2 | Node diagrams, more journeys, theme switcher, mobile, live LLM | Not started, by design |

## 6. Notes for maintainers

- **Demo beats.** App scenes expose `advance()` (Space) and `key()` (A, Escape) to SceneDirector. A scene re-mounts on every arrival, so a demo always starts from its first beat. `NFRExperience.get()` and `body[data-ws-state]` report the current state; `body[data-builder-state]` reports the builder flow.
- **Copy.** Change words in `assets/data/workspace-demo.js` (or `tprm-case.js` for the case), never in scene code; a test fails if scenes hard-code case facts or product names.
- **Headlines.** Edit the `<h2>` and `.slide-sub` in `pitch.html`, then run `node scripts/build-manifest.js` (in the repository since v5; the test "manifest titles match the screen titles" catches drift).
- **Build stamp.** `node scripts/stamp-build.js v<n>` after the final commit sets the release, the commit and every `?v=` string.
- **Retired screens.** The v27 scenes and their CSS were removed. `git show baseline-pre-workspace-v2:pitch.html` and the tag restore the previous route.
- **Prototype captures.** `assets/img/nfros/` still shows the prototype's working title. Recapture when the prototype is rebranded.
- **Historical notes.** `TRANSITION_RELEASE.md`, `TRANSITION_BASELINE.md`, `V23_BASELINE.md` and `AUDIT_BASELINE.md` describe earlier releases and still use the old name.

## 7. v4 additions (pitch plan v4, release v29)

| Concern | Where |
|---|---|
| Current-state audit, scene inventory, gap matrix | `docs/CURRENT_STATE_AUDIT.md` |
| Decision-first home (Now, Next, Watching, Done) and the visual insight | `home()` and `insight()` in `assets/js/story/workspace-kit.js`; copy in `NFR_WORKSPACE_DEMO.home` and `.insight` |
| Assist hand-off to the role app | `NFRExperience.handoff()` / `takeHandoff()`; the journey opens at `role-app-open` |
| Write-back preview, commit and queue change | `showPreview()` in the journey scene; `NFRExperience.setFlag('reviewRecorded')` read by the home |
| Appendix A to E pages and the technical drawer | `assets/js/story/appendix-topics.js` renders both from `NFR_WORKSPACE_DEMO.technical` |
| Return to the story from the appendix | `#storyReturn` in the nav; Escape on an appendix page |
| Experience states | Story screens: cover, assistance, integration-burden, four-ways, three-layers, control-boundary, roadmap, value, appendix. App screens: booting, workspace-home, insight-visible, case-open, role-app-open, automation-trace-open, decision-pending, writeback-preview, writeback-complete, agent-builder-goal, -permissions, -plan, -running, -result, -save |
| Internal-only material | Any `*.local.md` file or `docs/internal/` (git-ignored). The repository is public and Pages serves every committed file |

## 8. v5 additions (meeting-ready plan v5, release v30)

| Concern | Where |
|---|---|
| Audit before v5 | `docs/CURRENT_STATE_AUDIT.md`; baseline tag `baseline-pre-pitch-v5` |
| Visual registry and chart validation | `VISUALS`, `validateVisual()` and `renderVisual()` in `workspace-kit.js`. Types: `ranked-bar`, `trend-line`. An invalid visual renders its data as a table; every chart also carries a screen-reader table. Data in `NFR_WORKSPACE_DEMO.insight.visuals` |
| Source detail | `sourceChip()` and `evidenceDrawer()` in the kit; records in `NFR_WORKSPACE_DEMO.evidence`, keyed by the source name a chip shows. Opening sets `source-detail-open`; closing restores the previous state. Space and Escape close it before anything else |
| Write-back preview and receipt | Each decision in `journey.decisions` has `reason` and `actionOwner`; the receipt has `actor` and `role` |
| Appendix A to G | Topics `choice`, `authority`, `architecture`, `writeback`, `lifecycle`, `runtime`, `proof` in `appendix-topics.js`; tabs and letters in `technical.tabs` |
| Experience state model | `NFRExperience.states()` lists every state in route order; `set()` warns on an unknown state, and a test walks the route against the list |
| History | `_syncHistory()` and `_goToHash()` in `navigation.js`: one entry for the story, one more when the appendix is entered; Back and Forward land on the hash; manual scroll restoration. Jumps between story and appendix are instant |
| Keys | Page Up and Page Down (clickers) in `navigation.js`; S (safe mode) in `presenter-controls.js` |
| Static fallback | `npm run fallback` (`scripts/export-fallback.js`): a PDF of the route, demo beats and appendix A to G at 1920x1080 in `artifacts/fallback/` (git-ignored) |
| Manifest generator | `scripts/build-manifest.js` |

## 9. v6 changes (live demo and deep-dive appendix, release v31)

v6 replaces the deck's mock of the product with the real product. Sections 7 and 8 above describe code that v6 removed (the Workspace kit, the mock scenes, appendix A to G, the technical drawer); the history keeps it (tag `baseline-pre-pitch-v6`).

| Concern | Where |
|---|---|
| Audit before v6 | `docs/APPENDIX_AND_DEMO_AUDIT.md` |
| Core route | Ten screens. Copy in `assets/data/workspace-demo.js` (story only; no product data) |
| Doorway to the live product | Scene `enter-workspace` (about 2.5 seconds). `PresenterControls.openLive()` opens `NFR_WORKSPACE_DEMO.enter.liveUrl` (default `http://localhost:3200/`; `?live=<url>` overrides it for the session) |
| Captured fallback | Section `#live-fallback`, scene `live-fallback`; captures listed in `assets/data/live-captures.js`, files in `assets/img/product/` (taken by the product's own capture script). Preloaded after page load, so the fallback works offline |
| Cover | A capture of the product's Today (`NFR_WORKSPACE_DEMO.cover.capture`); placeholder lines if it cannot load |
| Appendix | Content in `assets/data/appendix-modules.js` (four modules, 23 pages); renderer and navigation in `assets/js/story/appendix-modules.js` (`window.AppendixNav`); styles in `assets/css/appendix.css`. Section shells in `pitch.html` are generated from the data (one per page id) |
| Visual types | matrix, tree, calculator, reuse, tco, columns, grid, lifecycle, flow, groups, landscape, envelope, decision, graph, phases, pipeline, layers, bands, lanes, raci, waves. A visual that throws is replaced by a note and a console warning; the page still renders |
| Unit economics (V3) | `assets/js/story/unit-economics.js`: pure functions (`compute`, `sensitivity`), formulas in the header comment, unit-tested |
| Keys | A index, 1 to 4 modules, M main story, L live product, F fallback; Escape goes back one level (page, index, story). On the fallback, arrows and Page Up and Page Down step through the captures |
| States | `cover`, `assistance`, `integration-burden`, `four-ways`, `three-layers`, `entering-workspace`, `live-handoff`, `live-fallback`, `control-boundary`, `roadmap`, `value`, `workshop`, `appendix` |
| Removed | Mock product scenes and kit, appendix A to G and the technical drawer, the business-case scene, legacy appendix A1 to A5. The Evidence Atlas stays as a reference library (its economics view still uses `roi-model.js`). Candidate runtime reuse is internal only (local notes) |

## 10. v7 changes (merged proposition, two editions, release v32)

v7 merges the earlier control-platform proposition into NFR Workspace: one brand, fourteen screens, four appendix domains. The audit before v7 is `docs/MERGED_PROPOSITION_CURRENT_STATE.md`.

| Concern | Where |
|---|---|
| Core route | Fourteen screens in four chapters (shift 01 to 04, model 05 and 06, Workspace 07 to 10, path 11 to 14). Copy in `assets/data/workspace-demo.js`; new scenes `work-arrives`, `chain-drift`, `method-plan`, `connected-context`, `qualify-and-prove`, `experience`; styles in `assets/css/story-v7.css`. Retired: `remaining-burden`, `six-month-route` |
| Return after the demo | Space on screen 07, or at the end of the captured fallback, continues to screen 08 (`method-plan`); `STORY_RETURN` in `presenter-controls.js` |
| Appendix | Four domains in `assets/data/appendix-modules.js`: Value & Economics (V1 to V5), Methods, Control & Assurance (M1 to M8), Data, Knowledge & Systems (D1 to D9), Delivery, Scale & Credentials (S1 to S6); 28 pages. New visuals `methods`, `pools`, `sprint`, `options`; claim statuses `option` and `credential`; styles in `assets/css/appendix-v7.css` |
| States | `cover`, `work-arrives`, `chain-drift`, `assistance`, `four-ways`, `three-layers`, `entering-workspace`, `live-handoff`, `live-fallback`, `beneath`, `connected`, `control-boundary`, `value`, `qualify`, `experience`, `decision`, `appendix` |
| Icons | `icon-registry.js` no longer swaps font icons for inline sprite icons at runtime (`AUTO = false`); v31 showed some icons twice |
| Public edition | `npm run build:public` (`scripts/build.js public`): copies `index.html`, `pitch.html` and `assets/` into `dist/` and scans every text file against `scripts/forbidden-terms.json`. The Pages workflow runs it and uploads `dist/`, so `docs/`, `tests/` and `scripts/` are no longer served |
| Term scan | Salted SHA-256 hashes of one- to four-word phrases after lowercasing and collapsing punctuation; the plain list stays outside the repository. `node scripts/build.js scan-repo` scans every committable file; `scan <dir>` scans a built folder; `hash-terms` regenerates the hash file. The hashes are a tripwire, not a secret: a short term can be guessed and confirmed |
| Internal edition | `npm run build:internal` writes `dist-internal/` from the git-ignored `internal/` overlay: `story-internal.js` (merged into the story data before it is frozen, via `window.NFR_STORY_INTERNAL`), `appendix-internal.js` (pages appended per domain before freezing, via `window.NFR_APPENDIX_INTERNAL`; the build adds one section shell per page), `internal.css` (edition badge). Title suffix and `noindex`. Never published |
| Tests | `tests/build.spec.js`: the public build holds only the site, no overlay reference, no hashed term; the workflow uploads `dist`; with the overlay present, its pages exist in the internal build and are absent from the public one |
| Preview | `npm run serve:public` (port 8190), `npm run serve:internal` (port 8191); `scripts/serve.js <port> <root>` |

## 11. v8 changes (presentability audit, release v33)

An audit before management presents the deck: text in boxes, font sizes, the story for an NFR audience.

| Concern | Where |
|---|---|
| Key idea | Screen 04 is now "Standalone AI sees one system. NFR needs the whole picture." Data `NFR_WORKSPACE_DEMO.sees`: one question (the one the product answers in act 3), eight sources with their systems, four assistants and the one source each sees. Screen 02's note and screen 09's systems line set it up and pay it off |
| Canvas scale | `S.canvas(..., { refHeight: 520 })`: a shorter canvas scales as if it were 520 high and starts where a 520 canvas starts, so text keeps one size across screens (screens 11 to 14 were 9 to 18 percent larger on height-limited windows) |
| Fixes | Screen 08 flow on one line (text left its box); screen 02 request text at 15 px (was the largest body text in the deck); screen 13 boxes sized to content; screen 14 drops the repeated question and adds one line per item to agree; five-wave visual (S6) no longer rises into the subtitle |
| Tests | Layout runs also at 1366 x 650 (a browser window on a 1366 x 768 laptop); text must stay inside its canvas box and its appendix box; appendix visuals must stay below the subtitle |
| Presenter guide | Opens with the idea in sixty seconds: three messages, the ask, what not to say |

## 12. v9 changes (one point per screen, release v34)

From the owner's review: each screen lands one point at a glance, with an example the audience recognises.

| Screen | Change |
|---|---|
| 02 | Four questions with who asked, what it takes to answer and who has to help; the queue box is gone |
| 03 | Change comes down from a band above the chain and drift comes up from a band below, with straight arrows; icons on the three consequences |
| 04 | The question types itself out before the sources appear (a few characters per timeline step, so seek and finish land on the whole text) |
| 05 | One supplier example per way of working: a one-off question, one case, many cases, a new question |
| 06 | Today, first loop, at scale across the three layers, read as an improvement |
| 08 | The answer from act 3 replayed as five steps, each tagged rule, connected data, AI checked or person, with what it produced |
| 09 | One failed control test and the four records it affects, each in its own system; today against with the Workspace |
| 10 to 12 | Three columns each: the demonstration step per role; one measure per kind of value; goal, parts and what you get per phase, with a decision gate between phases |
| 14 | An example answer on each card |
| v10 (release v36) | Presentable by any consultant, clear to the NFR business owner. Product captures re-taken at 1280 x 800 and 1.5x (JPEG) with a copy of the product's rehearsal script; the cover crossfades through four focal crops (`cover.slides`, `focus` in capture pixels; still in reduced motion and safe mode). The captured demo is the "Product walkthrough" everywhere. "Loop" became "live process" in the story and the appendix. Screen 05 and the appendix use the product's menu names (Ask the records, Work Hub, Processes, Agents). Screen 12 names what the bank provides (`path.fromYou`). The evidence count is the product's: 15 items from six registers |
| Fallbacks | `node scripts/build-fallbacks.js <port>` (`npm run fallbacks:scenes`) renders each scene's final state into `assets/img/fallback/<id>.jpg` and points its `<svg data-scene-fallback>` at it. Rerun after changing a screen. The cover and the doorway keep their vector fallbacks |

## 13. v11 changes (a view per role, release v38)

From the internal review: show the roles, the Head of NFR against the people who run the work, and how the data connects and differs by permission. A new screen 05 opens chapter 2, right after screen 04 says the Workspace brings every system into one picture within the user's permissions. Screens 05 to 14 became 06 to 15; chapters are 4, 3, 4, 4.

| Part | Where | Notes |
|---|---|---|
| Data | `assets/data/workspace-demo.js`, `roles` | Four roles in two groups (`lead`, `work`); `order` is the Space order and starts with the third-party risk manager asking the screen 04 question. `access` per system of `sees.needs`: `full`, `none` or a short note for partial access (13 characters at most). `status` is `live` only for roles available in the product (third-party risk manager, operational risk partner) |
| Scene | `assets/js/story/scenes/role-views.js` | Role cards are buttons; `advance()` completes the current role, then selects the next in `order`, then returns false so Space moves on. A role switch types the question, sets each system's access state, draws the connectors (blocked systems get a dashed line and send nothing back), links the records and builds the answer (`dots`, `tiles` or `compare`) |
| Styles | `assets/css/story-v9.css`, `.rv-*` | The moving dots on open connectors stop in reduced motion and safe mode |
| Placement | `S.canvas(..., { align: 'top' })` in `visual-grammar.js` | The screen starts right under the headline at every size; on a tall window the spare space falls below the tool, not above it. Other screens keep centring |
| Wiring | `presenter-controls.js`, `build-manifest.js`, `export-fallback.js` | State `roles`; role cards release focus after a mouse click; META entry; the PDF adds one page per role |
| Tests | `tests/workspace-story.spec.js` | Role data rules, click and Space order, full-motion typing, and a per-role fit and box check at every supported size |

## 14. v12 changes (screens 01 to 05, release v39)

From the owner's review of the opening chapter: more salesy, more levels, a clearer why, a visible requirement for the full picture, and the information flow in detail.

| Screen | Change |
|---|---|
| 01 | Positioning: "The one place for AI in non-financial risk", with three pillars (every NFR role, every system, every kind of AI work). The headline scales with the window height so the cover fits 1366 x 650 |
| 02 | Five levels in rows (who asks, what they ask, where the answer lives, who has to help, how it is worked out). The screen steps through the four questions, lighting each one's links, ends on the screen 04 question and counts the whole from the data (`arrives`). Question cards are buttons |
| 03 | External change (outside the bank) above the chain, internal change (inside the bank) below it, and one worked example of why it matters (`chain.example`) |
| 04 | Sources start grey; the three an assistant sees turn purple; the five no assistant sees turn red one by one, marked Missing; a legend says so. Two bars count it: standalone AI three of eight, NFR Workspace eight of eight, the 360 view (`sees.legend`, `sees.context`) |
| 05 | The information flow in five steps for the chosen role: access checked per system; read by a live query or from a cached index (`roles.modeOf`, `roles.modes`); linked in the knowledge graph; rules calculate, then AI explains (`rule`, `ai` per role); the answer. The screen names the knowledge graph at the owner's request; the jargon test exempts that term on this screen only |

## 15. v13 changes (exceptions, the judgement ladder, earned autonomy, release v40)

Ideas taken from a vertical-AI conversation the owner shared, translated to NFR. No figures from it are used.

| Screen | Change |
|---|---|
| 02 | Closing line: the record shows the outcome; the work, and the exceptions that matter, happen in emails, spreadsheets and meetings around it (`arrives.strong`, `arrives.line`) |
| 06 | Run: the routine runs across systems and cases; people get the exceptions, with their context |
| 11 | How far AI goes, step by step (`boundary.ladder`): find the evidence (AI), apply the method (AI with rules), judge against policy (AI proposes, a person confirms), decide (a named person); an assistant on one system stops at step 1 |
| 12 | Risk outcomes: exceptions caught before sign-off, not at audit; capacity: time moved from routine work to the exceptions |
| 13 | Autonomy is earned (`path.trust`): every output reviewed, sampled once proven reliable, gates stay where judgement is material |
| Guide | Where the value sits (sixty-second brief), the specialists framing on screen 09, and the buyer question "why not build it ourselves on our GRC platform and a model?" |

## 16. v14 changes (one storyline, fourteen screens, release v41)

From the owner's review: a punchier cover, no repeated scaling story, the four kinds of agent, the Workspace acting rather than another problem statement, thresholds for human review, value gated by evidence, and how to bring it in with its commercial models.

| Screen | Change |
|---|---|
| 01 | "The future of NFR, coordinated." Pillars name the assets coordinated: your people, your systems, your AI |
| 06 | A grid (`ways`): how standard the work is against how often it comes. Four gaps, each filled by one way, with what it is strong at (`pro`) and where it stops (`con`) |
| 07 | Today's pilots against a Workspace that grows by module (`grow`): set up once, the third-party risk team in months 0 to 6, then the next team and further teams on the same core; run it in-house or managed |
| 09 | Four kinds of agent (`agents`): retrieval, process, policy, principal, each with what it did for the act 3 answer, its control and who is in charge; a judgement axis under them |
| 10 | Each affected record shows its owner's next step (`owner`, `action`); the today/with comparison became one result line |
| 11 | Thresholds route each case (`boundary.routing`): runs on its own, a person reviews, a person decides; three stages show routine work moving to automation while the share a person decides stays the same. The v13 ladder and the screen 13 trust strip are folded into it |
| 12 | Two lenses, insight and speed, each with one measure; value grows gate by gate (baseline, qualified, live, next team), each gate opening on evidence (`value.lenses`, `steps`, `gates`) |
| 13 | New `bring-in`: managed service, sovereign cloud, full deployment. Public wording follows S5 and says the commercial model is shared separately; the internal edition replaces `bringIn` with the offer names and the commercial models (internal/story-internal.js) |
| Removed | `qualify-and-prove` (its phases and gates live on 12, the six months on 07) and `experience` (credentials stay in the appendix: S5 public, S7 internal). The decision is screen 14 |

## 17. v15 changes (screens 03 to 05, release v42)

From the owner's review: what no assistant sees belongs at 03; the change screen needed substance and a clear reason why it matters; screen 05 had to show how the system knows which systems each button needs, and that it is more than AI (compute, storage with versions, write-back), with Light, Medium and Deep views per role that fold out.

| Screen | Change |
|---|---|
| 03 | `assistance-here` moves from 04 to 03, otherwise unchanged |
| 04 | `chain-drift` follows one internal change link by link (`chain.links`: what the record says, what is really happening), then a timeline (`chain.timeline`: the record says effective for 97 days while supplier accounts go unreviewed; with NFR Workspace, flagged the same day) and why it matters (exposure, accountability, cost). The records match screen 10 (OBL-12, R-21, CTL-0417, RCSA Q3, the Q3 sign-off). External change is the closing line |
| 05 | `role-views` rebuilt as seven layers (`roles.layers`) that fold out by depth (`roles.depths`): Light the screen; Medium read, connect, compute; Deep route, store, write back. Each role has three buttons (`outputs`: view, explain, action), each a versioned definition with the systems it reads, its calculation, its AI step, what it stores and where it writes; a test checks that no button reads a system its role may not. Space unfolds the next depth, then moves on; clicks switch the role, the depth or the button |
| Tests and PDF | The Role views block is rewritten; the screen 05 layout test checks every role at every depth and, at Deep, every button, at all seven sizes. The PDF has six pages for screen 05: Light, Medium and Deep for the first role, then the other roles at Deep |

## 18. v17 changes (nine core screens, release v43)

From the owner's review: no core screen after Enter NFR Workspace; the screens after it are retired, not kept as backup; a new screen on identity and access before it; the strip under each screen becomes its takeaway.

| Change | Detail |
|---|---|
| Retired | `method-plan`, `connected-context`, `authority-boundary`, `value-decision`, `bring-in`, `workshop-decision`, with their data (`agents`, `beneath`, `connected`, `boundary`, `value`, `path`, `bringIn`, `experience`, `decision`), fallbacks and CSS. Their content lives in the appendix: M2, D8, D4, M6, M7, V1 to V3, S1, S2, S5 (internal S9 holds the commercial models). The THE PATH chapter is gone |
| 08 | New `profiles-access` (data `profiles`): four synthetic people; what comes from the identity system; the profile in six levels (role, scope, records, fields, actions, delegation), the levels that changed from the person before marked; their screen (menu, queue, in view, masked); how the data knows where it belongs. Space steps through the people, then moves on |
| 09 | Enter NFR Workspace is the last core screen. Space after it, and the end of the captured walkthrough, go to the appendix index |
| Takeaways | Each core screen's strip is labelled Takeaway and states the core message in one sentence; a test checks none is cut off |
