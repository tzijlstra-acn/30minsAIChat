# NFR Workspace pitch: QA checklist (release v32, merged proposition v7)

Status as of 2026-11-24 on branch `feat/pitch-v7`. The product side is checked in `nfr-workos` (`docs/DEMO_READINESS_AUDIT.md`, branch `feat/demo-readiness-v6`). "Automated" names the Playwright test or audit that covers an item.

```
npm run build:public && node scripts/build.js scan-repo
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
node scripts/serve.js 8190 dist     # then, against the public build:
node scripts/visual-qa.js 8190 artifacts/visual-qa/v32
node scripts/export-fallback.js 8190
```

Last full run: 350 passed, 0 failed on the five desktop projects (see the release note at the end).

## 1. Meeting-survival tests (v7 plan)

| Test | Status | Evidence |
|---|---|---|
| Comprehension: a first-time viewer explains why work arrives as a question, why the chain drifts, why an assistant is not the Workspace, Ask / Use / Run / Create, the three layers, why small methods, where authority remains, what five weeks and six months prove | **Not done.** Needs people | Screens 02 to 04 carry the problem by minute six; screen 08 explains the demonstration; the principle is on the cover and screen 10 |
| Business owner: which of my requests, what changes for my team, what it costs, how we start | Pass on paper | Screens 02, 11, 12, 14; appendix V1 to V3, S1, S2 |
| IT strategist: what sits behind it, what stays authoritative, identity and access, model risk, the graph, facts to visuals, write-back, runtime dependency | Pass on paper | Appendix D1 to D9, M2, M5, M6, M7 |
| Claims: every appendix page carries one claim status; no core screen claims production deployment, autonomy or guaranteed compliance | Pass | Automated: claim status on every page, banned-claims list on core and appendix text, copy lint |
| Confidentiality: internal content is physically absent from the public bundle | Pass | Automated: `tests/build.spec.js`, term scan of `dist/`, every committable file and the full history (section 5) |
| Technical: product readiness, standalone launch, reset, fallback without internet | Pass on the product branch, **not yet merged** | As v31: launcher on `feat/demo-readiness-v6`; deck fallback and offline run automated |

## 2. Deck critical path

| # | Check | Status | How |
|---|---|---|---|
| 1 | Fourteen core screens, four chapters (4, 2, 4, 4), counter 1 / 14, landing buttons to 01, 05, 07, 11 | Pass | Automated |
| 2 | No mock of the product in the deck | Pass | Automated |
| 3 | Enter NFR Workspace: four statuses, ends on the live cue, Space skips | Pass | Automated |
| 4 | L opens the live product; `?live=` changes the URL | Pass | Automated |
| 5 | After the demonstration, Space on screen 07 and the end of the captured fallback both continue to screen 08 | Pass | Automated |
| 6 | Appendix: four domains (5, 8, 9, 6 pages), each page with question, answer, visual, implication, claim status, index, previous, next, main story; no v6 page ids left | Pass | Automated |
| 7 | Keys: A, 1 to 4, M, Escape one level; browser Back returns from a page | Pass | Automated |
| 8 | Thirteen deep links from eight core screens into the matching pages | Pass | Automated |
| 9 | V3 calculator recalculates deterministically and resets | Pass | Automated |
| 10 | Safe mode, offline run, reset (0), state model covers every state the route reaches | Pass | Automated |
| 11 | No console errors | Pass | Automated per viewport; visual QA and the PDF export report zero |
| 12 | Icons render once (v31 showed some twice) | Pass | Visual QA |

## 3. Visual

| Check | Status |
|---|---|
| Core screens at 1024 x 768 to 1920 x 1080: no clipping, no element outside its canvas, text above the floor | Pass, automated |
| Appendix pages and the fallback at every size: no horizontal overflow, text above the floor, each page under 1.8 screens | Pass, automated |
| 125 percent zoom (1536 x 864 and 1152 x 720 at 1.25) | Pass, scripted check on the public build: 14 screens at each size, 0 issues, 0 errors |
| Contact sheet of all core screens at 1366 x 768 | Pass: reviewed by eye; icons render once |

## 4. Claim review

Claim statuses: *Shown in the live product*, *Target design*, *Illustrative, synthetic figures*, *Delivery practice*, *Concept for validation*, *Implementation option*. The public edition shows no client names, no client figures, no credentials and no commercial terms; screen 13 describes areas of experience only and says examples are shared separately, subject to permission. The internal edition's credentials carry a claim-review line and need the engagement lead's sign-off before client use (local notes).

## 5. Confidentiality

| Check | Status |
|---|---|
| Repository | **Public**. From v32, Pages serves `dist/` (index.html, pitch.html, assets/) built by `npm run build:public`; `docs/`, `tests/` and `scripts/` are no longer served, though they remain readable in the repository |
| Served public build | `docs/PRESENTER_GUIDE.md` and `internal/story-internal.js` return 404 from `dist/` |
| Internal edition | Built only from the git-ignored `internal/` folder into the git-ignored `dist-internal/`. Not referenced from any tracked file; the public `pitch.html` has no overlay hook paths |
| Term scan | Salted hashes in `scripts/forbidden-terms.json`; the public build fails on a hit. `dist/`: clean. Every committable file (`scan-repo`): clean. Full history (232 commits, vendor and images excluded): clean |
| Product captures | Unchanged from v31: synthetic institution and names only |
| Limits | A term scan only sees text: images are reviewed by eye. Hashes of short terms can be guessed and confirmed, so the list is a tripwire, not a secret. The scan does not catch paraphrase |

## Not covered

- The two-person comprehension test (needs people) and an end-to-end Teams screen-share.
- The product branch `feat/demo-readiness-v6` is not merged into `feat/nfr-workspace-v3`.
- Claim review of the internal credentials (engagement lead) and of the indicative commercials (deal team, legal).

## Release note

v32 (`v32-5492c5a`), 2026-11-24: desktop matrix (chromium, 1366 x 768, 1440 x 900, 1920 x 1080, 1024 x 768) 350 passed, 0 failed; the 440 skips are per-project by design. The `mobile` project needs WebKit, which is not installed on this machine, and is not part of the matrix. All audits, the dash check and the copy lint pass. Against the public build served from `dist/`: visual QA 56 screenshots at each of 1920 x 1080, 1600 x 900, 1440 x 900 and 1366 x 768 with 0 console errors; 125 percent zoom clean; PDF fallback 56 pages, 0 console errors. Internal edition PDF: 60 pages, 0 console errors, kept in `internal/fallback/` (git-ignored).
