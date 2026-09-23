# V23 Baseline -- Confirmed Defects and Starting State

Date: 2026-09-23
Branch: v23-improvement-only
Tagged: v22-before-v23

---

## 1. Build identity

| Field | Value |
|---|---|
| meta nfr-build | v21-f6b1f35 |
| pitch.css cache-buster | 0bb727b |
| scenes.css cache-buster | 0bb727b |
| story-manifest.json version | 19 |
| story.json version | 12 (stale, unused) |
| icon-manifest.json version | 18 |

---

## 2. Twelve core screens (document order)

| # | Section ID | data-scene | Chapter |
|---|---|---|---|
| 00 | cover | cover-flow | INTRODUCTION |
| 01 | pressure-rising | pressure-convergence | WHY NOW |
| 02 | ai-stack | ai-stack-build | WHAT AI IS |
| 03 | task-route | task-route | WHAT AI IS |
| 04 | regulation-process | regulation-process | WHERE IT APPLIES |
| 05 | transformation-implications | transformation-system | WHERE IT APPLIES |
| 06 | work-role-shift | work-role-shift | WHERE IT APPLIES |
| 07 | proof-loop | proof-loop | HOW TO PROVE |
| 08 | scale-architecture | scale-architecture | HOW TO SCALE |
| 09 | unit-economics | unit-economics | HOW TO SCALE |
| 10 | dual-engine | dual-engine | HOW TO SCALE |
| 11 | next-move | next-move | WHAT NEXT |

---

## 3. Screen geometry contract (V19)

Layer hierarchy:
- `section[data-slide]` -- 100dvh, flex column, padding 56px 48px 0, overflow: clip
- `.inner` -- max-width 1100px, no height set
- `.scene-screen` -- flex:1, grid 3-row (auto / 1fr / auto), gap 12px, overflow:clip
- `.scene-stage` -- height:100%, overflow:clip, contain layout paint size

The 3-row grid contract already exists. The `.scene-screen` grid is correctly specified.

---

## 4. Scene lifecycle (current)

Six methods required: `play`, `pause`, `resume`, `reset`, `finish`, `destroy`.

Missing from V23 target: `mount`, `seek`, `resize`, `renderFallback`.

`createTimeline` helper provides all six methods but `pause()` simplification: it cancels timers but does not checkpoint position, so `resume()` replays from start.

No `document.fonts.ready` guard before text measurement in any scene.

No `ResizeObserver` in any scene -- resize causes visual corruption without page reload.

---

## 5. Confirmed defects

### P0 -- Rendering failures

- **No resize handling**: Changing viewport or zoom after scene starts causes stale geometry in all SVG scenes. No ResizeObserver exists.
- **No font-ready guard**: Scenes start measuring text before fonts are loaded. Text labels clip or overflow at cold load.

### P1 -- Visual quality

- **Separate evidence-badge and insight rows**: Each screen has up to three footer elements (obligation-thread, evidence-badge, scene-insight) stacking vertically. This steals height from the scene stage on short viewports (800px and below).
- **Obligation thread is a full extra row**: Creates a 50px+ row in the header area separate from the chapter tag row.
- **Lower-half screen differentiation**: Screens 07-10 share similar card-box visual grammar. The V23 plan requires clearly different visual actions per screen (measure, zoom, accumulate, connect).
- **Task Route (Screen 03)**: Generic decision-tree visual with boxes rather than a Work Pattern Scanner.
- **Proof Loop (Screen 07)**: Circular methodology rather than an evidence test rig.
- **Unit Economics (Screen 09)**: Explanatory cards rather than a two-pass live cost path.

### P2 -- Icon and typography

- **Tabler icon font**: External font file loaded at runtime from `assets/vendor/tabler-icons/`. Empty icon slots visible when font fails to load.
- **Evidence badge font size**: 11px -- below the 11.5px floor set by V23.
- **Inline maturity disclaimer**: 8.5px -- below the 11.5px floor for reference notes.
- **Obligation-thread-status text**: 9px -- below the 14px floor for core labels.

### P3 -- Reference Room

- **ref-room lands as static placeholder**: The Evidence Atlas heading (h2, p) is `display:none`. The `atlasMain` render target exists but the atlas opens with a knowledge-graph placeholder, not the five-view atlas described in V23.
- **No separate reference JS directory**: All reference rendering in `assets/js/evidence-atlas.js`, `components.js`, `visuals.js`.
- **Workshop artefacts**: No workshop controls remain. CRO/CFO/archetype selectors have been removed in previous versions.

### P4 -- Tests

- **Playwright viewports**: Only 1280x720 (Desktop Chrome) and 390x844 (iPhone 14). Missing: 1366x768, 1440x900, 1920x1080, 1024x768.
- **No midpoint captures**: Tests check initial and final states but not 40% progress.
- **No resize tests**: No test verifies scene stability after viewport change.
- **No connector geometry tests**: No test verifies endpoint position, arrowhead clearance, label crossing.

---

## 6. Source provenance and claims

No em-dash (U+2014) characters found anywhere. Existing double-hyphen separators (--) are correct.

No unsupported percentage savings or workforce claims in current code.

Solution status categories not normalised: some solutions use ad-hoc text labels rather than the structured `evidenceStatus` model.

---

## 7. External dependencies

Zero external runtime network requests. All fonts, icons, D3, Motion, ELK are self-hosted vendor bundles. Only user-initiated links to NFRAIAssets (GitHub Pages) exist.

---

## 8. V23 implementation order

Phase 1 -- Geometry and scene lifecycle (this session)
Phase 2 -- Shared visual system (SVG sprite, semantic tokens)
Phase 3 -- Core scene improvements (selected screens)
Phase 4 -- Evidence Atlas redesign
Phase 5 -- Data governance
Phase 6 -- Tests and coverage
Phase 7 -- Deployment integrity
