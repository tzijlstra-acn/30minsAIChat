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
- **Headlines.** Edit the `<h2>` and `.slide-sub` in `pitch.html`, then regenerate the manifest from the DOM (the generator lives outside the repo; the test "manifest titles match the screen titles" catches drift).
- **Build stamp.** `node scripts/stamp-build.js v28` after the final commit sets the release, the commit and every `?v=` string.
- **Retired screens.** The v27 scenes and their CSS were removed. `git show baseline-pre-workspace-v2:pitch.html` and the tag restore the previous route.
- **Prototype captures.** `assets/img/nfros/` still shows the prototype's working title. Recapture when the prototype is rebranded.
- **Historical notes.** `TRANSITION_RELEASE.md`, `TRANSITION_BASELINE.md`, `V23_BASELINE.md` and `AUDIT_BASELINE.md` describe earlier releases and still use the old name.
