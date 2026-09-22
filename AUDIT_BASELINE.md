# AUDIT BASELINE — NFR AI Pitch V11

Created: 2026-09-22
Commit baseline: 4f45f74 (V9 Phase 9 complete)

---

## 1. Section and chapter inventory

### Core route (17 screens)

| # | Section ID | Chapter | Nav title | Renderer |
|--:|-----------|---------|-----------|---------|
| 00 | `cover` | Cover | Risk at machine speed | (static + canvas) |
| 01 | `setting-scene` | AI Landscape | Why act now? | (static) |
| 02 | `ai-landscape` | AI Landscape | AI landscape today | `aiLandscape` |
| 03 | `transformation-system` | Transformation System | Transformation system | `trSystem` |
| 04 | `how-blocks-built` | Transformation System | How blocks are designed | `evidenceFlow` |
| 05 | `capability-hotspots` | Locate the Value | Risk capability map | `capHotspots` |
| 06 | `work-workforce-workbench` | Locate the Value | AI impact on roles | `roleBars` |
| 07 | `opportunity-portfolio` | Locate the Value | AI opportunity patterns | `oppPortfolio` |
| 08 | `solution-portfolio` | Prove Safely | Source-backed solutions | `solutionPortfolio` |
| 09 | `exec-shortlist` | Prove Safely | Working candidate set | `shortlist` |
| 10 | `process-twin` | Prove Safely | Process and data flow | `processTwin` |
| 11 | `proof-value-capture` | Prove Safely | Proof and value capture | `proofValueCapture` |
| 12 | `industrialization-arch` | Build to Scale | Industrialization architecture | (static) |
| 13 | `run-economics` | Build to Scale | Run economics and tokenomics | `calcEco()` |
| 14 | `accenture-edge` | Build to Scale | Accenture dual-engine USP | `accentureEdge` |
| 15 | `lean-transition` | Commit | Roadmap and stage gates | (static) |
| 16 | `decision-next-step` | Commit | Decision and next step | `takeaway` |

Note: V11 plan adds `maturity-matrix` (currently reference M1) to core route as a calibrator.

### Reference route (12 screens)

| Ref ID | Section ID | Nav title |
|--------|-----------|---------|
| M1 | `maturity-matrix` | Maturity matrix |
| A1 | `app-caps` | 47 capability catalogue |
| A2 | `app-blocks` | Transformation block detail |
| A3 | `app-maturity` | Maturity level definitions |
| A4 | `app-evidence` | Evidence requirements |
| A5 | `app-method` | Methodology detail |
| A6 | `app-usecases` | Use case inventory |
| A7 | `app-kpis` | KPI library |
| A8 | `app-rai` | Responsible AI checklist |
| A9 | `app-arch` | Architecture reference |
| A10 | `app-assets` | NFR AI Assets portal |
| A11 | `app-assumptions` | Assumptions and disclaimers |
| A12 | `app-team` | Team and credentials |

---

## 2. Navigation and hash behaviour

- Top navigation bar with chapter tabs (`navChapters`), chapter label, slide counter, agenda button, theme toggle.
- Chapter tabs built dynamically from `data-chapter-id` on each section.
- Agenda overlay with Story / Questions / Deep Dives / Method tabs.
- Hash updates via `history.replaceState` on each slide change.
- IntersectionObserver at 0.5 threshold drives slide tracking and rendering.
- Reveal observer at 0.12 threshold triggers `.reveal` animations.
- Keyboard: Arrow keys advance slides; `G` opens agenda; `Escape` closes overlays.
- Touch: 52px swipe threshold.
- **Gap**: No left-edge navigation rail (V11 requirement). No pin mode. No mobile swipe-to-open menu.

---

## 3. Interactive controls inventory

| Control | Element | Current behaviour | State updated | Visual change |
|---------|---------|-----------------|---------------|---------------|
| Route start buttons (Executive / Working session) | `[data-start-route]` | Calls `setRouteMode()` + `goToIndex(1)` | `CLIENT_STATE.route` | None visible — `setRouteMode` is a stub |
| Archetype toggle A/B | `[data-arch]` | Calls `setArchetype()`, re-renders role bars | `CLIENT_STATE.archetype` | Role bars re-render |
| Lens toggle Joint/CRO/CFO | `[data-lens]` | Calls `setLens()`, re-renders shortlist | `CLIENT_STATE.lens` | Shortlist re-renders |
| Pressure cards | `[data-pid]` | Calls `togglePressure()`, updates card opacity | `CLIENT_STATE.pressures` | Card opacity/selection |
| Eco calculator inputs | `#eco-vol`, `#eco-review`, `#eco-ctx`, `#eco-reuse` | Calls `calcEco()` | (local) | Output cards update |
| Eco tree drivers | `.eco-driver-hdr` | Toggles `open` class | None | Accordion expand |
| Capability hotspot cards | `.cap-cat-btn` | Opens sub-capability list | `CLIENT_STATE.selectedCapabilityIds` | Card highlight, shortlist deferred |
| Transformation block | SVG `g[data-blockid]` | Opens `openBlockDrawer(id)` | None | Drawer opens |
| Role expand rows | `.role-row` | Toggles `open` class | None | Row expands |
| Agenda overlay | `[data-atab]` | Switches agenda tab | None | Tab panel visible |
| Context drawer tabs | `#drawerTabs` | Switches drawer tab | None | Tab panel visible |
| Maturity matrix cells | `.mat-cell` | Cycles C/T/blank | `CLIENT_STATE.maturity` / `targetMaturity` | Cell marker updates |
| Theme toggle | `#themeBtn` | Calls `toggleTheme()` | `localStorage['nfr-pitch-theme']` | `data-theme` attribute |
| Agenda slide links | `.agenda-slide-link` | Calls `goToIndex(idx)` | `current` | Scrolls to section |

### Dead controls (click but no visual consequence)

- Route start buttons: `setRouteMode` does not filter or reorder sections.
- Proof candidate selection on shortlist: state updated but process twin and proof screens do not react.
- Capability selection on hotspots: state updated but shortlist and candidate canvas do not auto-update.

---

## 4. State variables

### Current state (state.js — CLIENT_STATE)

```js
{
  route: 'executive',
  archetype: 'A',
  lens: 'joint',
  pressures: [],
  selectedCapabilityIds: [],
  selectedOpportunityIds: [],
  selectedBlockIds: [],
  maturity: {},
  targetMaturity: {},
  criteriaWeights: { executiveImpact:1, feasibility:1, controlComplexity:1, reusePotential:1, timeToEvidence:1, runCostProfile:1 },
  proofCapabilityId: null,
  proofUseCaseId: null,
  foundationMoveId: null,
  scaleWaveIds: [],
  openDecisions: [],
  evidenceNotes: {},
  sessionNotes: ''
}
```

No central dispatcher or subscriber pattern. Mutations are direct property writes.
`localStorage` used only for `nfr-pitch-theme`.
`sessionStorage` used for `pitch_auth`.

---

## 5. Render targets and renderer contracts

Renderers are triggered by `renderSection(sec)` inside `updateNav()` on first view.
All renderers expect a section element and use `sec.querySelector('#targetId')` to find their mount point.

| Renderer | Mount point | Data source |
|---------|------------|------------|
| `renderAILandscape` | `#aiLandscapeGrid` | `AI_OPPORTUNITIES`, `CLIENT_STATE` |
| `renderTransformationSystem` | `#trSysGrid` | `TRANSFORMATION_BLOCKS`, `CLIENT_STATE` |
| `renderEvidenceFlow` | `#evidenceFlowDiagram` | (static template) |
| `renderMaturityMatrix` | `#maturityTable` | `TRANSFORMATION_BLOCKS`, `CLIENT_STATE.maturity` |
| `renderCapHotspots` | `#capHotspotArea` | `RISK_CATEGORIES`, `RISK_CAPABILITIES`, `CLIENT_STATE` |
| `renderRoleBars` | `#rolesTable` | `ROLE_DATA`, `CLIENT_STATE` |
| `renderOppPortfolio` | `#oppPortfolioArea` | `AI_OPPORTUNITIES`, `CLIENT_STATE` |
| `renderSolutionPortfolio` | `#solutionPortfolioArea` | `SOLUTIONS` (solutions.js) |
| `renderShortlist` | `#shortlistGrid` | `USE_CASES`, `CLIENT_STATE` |
| `renderProcessTwin` | `#processTwinArea` | `PROCESS_TWIN_TEMPLATES`, `CLIENT_STATE` |
| `renderProofValueCapture` | `#valueWaterfall` | `CLIENT_STATE` |
| `renderAccentureEdge` | `#engineA`, `#engineB` | (static template) |
| `renderTakeaway` | `#ta-*` fields | `CLIENT_STATE` |
| `renderTeam` | `#teamGrid` | `experts` array |
| `renderAppCaps` | `#appCapsBody` | `RISK_CAPABILITIES` |

---

## 6. Font sizes below 14 px (core screens)

The following font sizes appear in core screen content (labels, tags, annotations):

| Size | Usage | Count |
|------|-------|-------|
| 8 px | `.eco-input-lbl`, `.pt-state-badge`, `.pt-kpi-lbl`, `.pt-source-note`, layout debug | Many |
| 8.5 px | `.arch-chip`, `.eco-input-lbl`, `.ptw-lane-lbl`, `.arch-rail-label`, `.role-detail-hd`, footer notes | Many |
| 9 px | `.sec-tag` (section tags), `.ptw-phase-name`, legend labels | Many |
| 10 px | External link note, canvas debug | Few |
| 11 px | `.arch-layer` sublabels, role legend, `.role-detail-item` | Many |
| 11.5 px | `.role-expand-text`, `.arch-layer` body, process twin detail | Many |

**V11 non-negotiable**: no core screen content below 14 px.

---

## 7. Sections that can grow beyond viewport

These sections use `data-density="long"`:
- `maturity-matrix`, `capability-hotspots`, `solution-portfolio`, `exec-shortlist`, `process-twin`, `proof-value-capture`, `run-economics`, `lean-transition`, `decision-next-step`
- All 12 reference sections

---

## 8. External runtime dependencies

| Dependency | Source | Status |
|-----------|--------|--------|
| D3 v7 | `/assets/vendor/d3/d3.min.js` | Local |
| D3 Sankey | `/assets/vendor/d3-sankey/d3-sankey.min.js` | Local |
| Space Grotesk, Inter, JetBrains Mono | Google Fonts CDN | **External CDN** |
| Tabler Icons webfont | jsDelivr CDN | **External CDN** |

V11 requirement: vendor all dependencies locally. Tabler Icons and Google Fonts remain CDN for now (client LAN typically permits; document in notices).

---

## 9. Console errors and failed render paths

No systematic console errors observed. Known render-path risks:
- `renderShortlist` returns silently if `USE_CASES` is empty or no capabilities selected.
- `renderProcessTwin` falls back to Regulation Coverage template if no `proofCapabilityId`.
- `renderAILandscape` (Provability Frontier) uses D3 dot positions; may warn on narrow viewports if clip bounds not enforced.
- Em-dash check: 0 remaining U+2014 after V9 Phase 9.

---

## 10. Source, legal-review and evidence-status data

Solution portfolio (28 solutions in `solutions.js`):
- Status values: `ASSET`, `PROTO`, `CONCEPT`, `CLIENT`
- No dedicated `legalReview`, `shareability`, `lastValidated`, or `owner` fields yet.
- V11 requirement: add these fields and show them in solution drawer.

---

## 11. Interaction matrix: control → state → visible change

| Control | State changed | Screens updated | Works now? |
|---------|--------------|----------------|-----------|
| Archetype A/B | `archetype` | Role bars | Yes |
| Lens Joint/CRO/CFO | `lens` | Shortlist | Yes (partial) |
| Pressure card | `pressures` | Card opacity only | Partial |
| Capability select | `selectedCapabilityIds` | None auto-updates | No |
| Set proof candidate | `proofCapabilityId` | Arch screen banner only | No |
| Eco inputs | (local) | Eco output cards | Yes |
| Maturity matrix | `maturity`/`targetMaturity` | None propagate | No |
| Route start buttons | `route` | None | No |
| Block click | None | Drawer opens | Yes |

---

## V11 gap summary

1. No left-edge navigation rail
2. No central store with subscribe/dispatch
3. No derived selectors
4. Route start buttons are stubs
5. Capability selection does not propagate cross-screen
6. Lens weights not visible or editable
7. Candidate canvas does not animate positions on lens change
8. Maturity answers do not update transformation system or architecture
9. Process twin does not respond to proof candidate selection
10. Proof console does not have evidence dials or gate logic
11. Architecture does not have Proof/Production/Enterprise modes
12. Economics does not expose all cost stations
13. Many core labels below 14 px
14. No `data-action` attributes on interactive elements
15. No session-scoped `rendered` set reset on candidate change
