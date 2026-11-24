# NFR Workspace pitch: QA checklist (release v31, live-demo plan v6)

Status as of 2026-11-24 on branch `feat/pitch-v6`. The product side is checked in `nfr-workos` (`docs/DEMO_READINESS_AUDIT.md`, branch `feat/demo-readiness-v6`). "Automated" names the Playwright test or audit that covers an item.

```
npm run serve
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
npm run qa:visual
npm run fallback
```

Last full run: see the release note at the end of this file.

## 1. Meeting-survival tests (plan section 17)

| Test | Status | Evidence |
|---|---|---|
| Comprehension: a first-time business viewer explains the assistant difference, Ask / Use / Run / Create, the three layers, where authority remains, what the first journey proves | **Not done.** Needs people | Screens 01 to 05 carry it by minute seven; the principle is on the cover and screen 07 |
| Product credibility: role, work, question, visual insight, evidence, decision, write-back, changed state, audit receipt | Pass in the product | Product rehearsal script: 20 steps, 0 console errors, 2 of 2 end-to-end tests (product audit) |
| Technical credibility: connections, what stays authoritative, identity, the graph, facts to visuals, controlled actions, a pluggable runtime | Pass | Appendix D1, D2, D3, D4 to D6, D7, D8, C4, P1 |
| Economic credibility: capacity, cycle time, quality, one-off cost, recurring cost, first-journey cost, reuse economics | Pass | Appendix V2, V3 (interactive, tested model), V4, V5 |
| Reliability: standalone launch after restart; no dependency on a development session; fast first query; reset; no console errors; fallback without internet | Pass on the product branch, **not yet merged** | Launcher rebuilt on `feat/demo-readiness-v6`: first answer 1.3 s (was 18.2 s), readiness check, warm-up, reset. The main checkout still has the old launcher until the merge |

## 2. Deck critical path

| # | Check | Status | How |
|---|---|---|---|
| 1 | Password gate and `#cover` deep link | Pass | Automated |
| 2 | Ten core screens, four chapters, counter 1 / 10 | Pass | Automated |
| 3 | No mock of the product in the deck | Pass | Automated: no app screens, no app shell, no mock case in core text |
| 4 | Cover shows a capture of the real product | Pass | Automated: every capture file loads |
| 5 | Enter NFR Workspace: about 2.5 seconds, ends on the live cue, Space skips | Pass | Automated |
| 6 | L opens the live product; `?live=` changes the URL | Pass | Automated |
| 7 | F opens the five acts captured from the product; Space, arrows and the clicker step through; the end continues to screen 07 | Pass | Automated |
| 8 | The principle screen maps what the product showed | Pass | Copy aligned to the product's five acts |
| 9 | Six months, value and the workshop decision are separate screens | Pass | Automated |
| 10 | Appendix: four doors, 23 pages, each with question, answer, visual, implication, claim status, index, previous, next, main story | Pass | Automated |
| 11 | Keys: A, 1 to 4, M, Escape one level; browser Back returns from a page | Pass | Automated |
| 12 | Deep links from the story into the matching pages | Pass | Automated |
| 13 | V3 calculator recalculates deterministically and resets | Pass | Automated, against the unit-tested model |
| 14 | Safe mode (S, `?safe=1`) carries the story, the fallback and the appendix | Pass | Automated |
| 15 | Offline after the first load: story, fallback and appendix | Pass | Automated; the icon sprite is inlined and captures are preloaded |
| 16 | Reset (0) restores the cover; state model covers every state | Pass | Automated |
| 17 | No console errors | Pass | Automated per viewport; visual QA and the PDF export report zero |

## 3. Visual

| Check | Status |
|---|---|
| Core screens at 1024 x 768 to 1920 x 1080: no clipping, no element outside its canvas, text above the floor | Pass, automated |
| Appendix pages and the fallback at every size: no horizontal overflow, text above the floor, each page under 1.8 screens | Pass, automated |
| 125 percent zoom (1536 x 864 and 1152 x 720 at 1.25) | Pass, scripted check |
| Charts and diagrams (matrix, waterfall, reuse, graph, pipeline) readable at 1366 x 768 | Pass, screenshots |

## 4. Claim review

Every appendix page carries one claim status: *Shown in the live product* (C4 write-back, D7 question to visual answer), *Target design*, *Illustrative, synthetic figures* (V3 to V5), or *Concept for validation*. The live demonstration shows synthetic records only. No page claims a production deployment, an enterprise connector, a knowledge-graph service or a specific runtime asset.

## 5. Confidentiality

| Check | Status |
|---|---|
| Repository | **Public**; Pages serves every committed file |
| Product captures (13 files in `assets/img/product`) | Reviewed one by one: synthetic institution and names only (Arcadia Bank AG, Novalink, Basalt Cloud), no emails, no internal URLs, no browser chrome, no internal asset name, no old wordmark. The empty evidence drawer capture is excluded |
| Candidate runtime reuse (plan P6) | Not in the public deck; talk track only in the git-ignored local notes |
| Internal asset name, client names, secrets | None in tracked files or history (scan) |
| Old prototype captures with the old wordmark | Removed |
| Team appendix and owner email | Kept by the owner's decision of 2026-11-23 |

## Not covered

- The two-person comprehension test (needs people) and an end-to-end Teams screen-share.
- The product branch `feat/demo-readiness-v6` is not merged into `feat/nfr-workspace-v3`: another session was editing that checkout. Until the merge, `Launch NFROS.cmd` in the main checkout is the old launcher.
- The product's model-written narration work (other session) could add a live AI dependency to the scripted path; check it before the meeting.
- Proposed product changes not made (they sit in the insight area of the other session): four figures instead of five, and the shared-provider point in the chart title.
