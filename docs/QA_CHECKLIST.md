# NFR Workspace pitch: QA checklist (release v40, presentable by any consultant v10)

Status as of 2026-11-25 on branch `feat/pitch-v8` (v9 work continues on it). The product side is checked in `nfr-workos` (`docs/DEMO_READINESS_AUDIT.md`, branch `feat/demo-readiness-v6`). "Automated" names the Playwright test or audit that covers an item.

```
npm run build:public && node scripts/build.js scan-repo
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
node scripts/serve.js 8190 dist     # then, against the public build:
node scripts/visual-qa.js 8190 artifacts/visual-qa/v40
node scripts/export-fallback.js 8190
```

Last full run: 363 passed, 0 failed on the five desktop projects (v40; see the release note at the end).

## 1. Meeting-survival tests (v7 plan)

| Test | Status | Evidence |
|---|---|---|
| Comprehension: a first-time viewer explains why work arrives as a question, why the chain drifts, why an assistant is not the Workspace, what each role sees, Ask / Use / Run / Create, the three layers, why small methods, where authority remains, what five weeks and six months prove | **Not done.** Needs people | Screens 02 to 04 carry the problem by minute six; screen 05 shows each role's view; screen 09 explains the demonstration; the principle is on the cover and screen 11 |
| Business owner: which of my requests, what changes for my team, what it costs, how we start | Pass on paper | Screens 02, 05, 12, 13, 15; appendix V1 to V3, S1, S2 |
| IT strategist: what sits behind it, what stays authoritative, identity and access, model risk, the graph, facts to visuals, write-back, runtime dependency | Pass on paper | Screen 05; appendix D1 to D9, M2, M5, M6, M7 |
| Claims: every appendix page carries one claim status; no core screen claims production deployment, autonomy or guaranteed compliance | Pass | Automated: claim status on every page, banned-claims list on core and appendix text, copy lint |
| Confidentiality: internal content is physically absent from the public bundle | Pass | Automated: `tests/build.spec.js`, term scan of `dist/`, every committable file and the full history (section 5) |
| Technical: product readiness, standalone launch, reset, fallback without internet | Pass on the product branch, **not yet merged** | As v31: launcher on `feat/demo-readiness-v6`; deck fallback and offline run automated |

## 2. Deck critical path

| # | Check | Status | How |
|---|---|---|---|
| 1 | Fifteen core screens, four chapters (4, 3, 4, 4), counter 1 / 15, landing buttons to 01, 05, 08, 12 | Pass | Automated |
| 2 | No mock of the product in the deck | Pass | Automated |
| 3 | Enter NFR Workspace: four statuses, ends on the live cue, Space skips | Pass | Automated |
| 4 | L opens the live product; `?live=` changes the URL | Pass | Automated |
| 5 | After the demonstration, Space on screen 08 and the end of the captured fallback both continue to screen 09 | Pass | Automated |
| 6 | Appendix: four domains (5, 8, 9, 6 pages), each page with question, answer, visual, implication, claim status, index, previous, next, main story; no v6 page ids left | Pass | Automated |
| 7 | Keys: A, 1 to 4, M, Escape one level; browser Back returns from a page | Pass | Automated |
| 8 | Fifteen deep links from nine core screens into the matching pages | Pass | Automated |
| 9 | V3 calculator recalculates deterministically and resets | Pass | Automated |
| 10 | Safe mode, offline run, reset (0), state model covers every state the route reaches | Pass | Automated |
| 11 | No console errors | Pass | Automated per viewport; visual QA and the PDF export report zero |
| 12 | Icons render once (v31 showed some twice) | Pass | Visual QA |
| 13 | Screen 05: four roles in two groups; a click or Space switches the role; access per system, linked records and answer per role; every role fits with its text inside its boxes at every size; one PDF page per role | Pass | Automated, and the PDF export |

## 3. Visual

| Check | Status |
|---|---|
| Core screens at 1024 x 768 to 1920 x 1080, and 1366 x 650 (a browser window on a 1366 x 768 laptop): no clipping, no element outside its canvas, no text outside its box, text above the floor | Pass, automated. Floor 10 px at 1366 x 768 and up; 9.4 px at 1366 x 650, where every screen's smallest labels render at about 9.5 px (the guide says full screen) |
| Appendix pages and the fallback at every size: no horizontal overflow, text above the floor, no text outside its box, visuals below the subtitle, each page under 1.8 screens | Pass, automated |
| One type size across screens: body text median 12.9 to 15.1 px on every core screen at 1366 x 768 (v32: screen 02 at 17 px, screen 14 at 19 px; screens 11 to 14 scaled 9 to 18 percent larger) | Pass, scripted measurement |
| 125 percent zoom (1536 x 864 and 1152 x 720 at 1.25) | Pass, scripted check on the public build: 14 screens at each size, 0 issues, 0 errors |
| Contact sheets at 1366 x 768 and 1920 x 1080 | Pass: reviewed by eye; wrapped headlines break into two even lines |

## 4. Claim review

Claim statuses: *Shown in the live product*, *Target design*, *Illustrative, synthetic figures*, *Delivery practice*, *Concept for validation*, *Implementation option*. The public edition shows no client names, no client figures, no credentials and no commercial terms; screen 14 describes areas of experience only and says examples are shared separately, subject to permission. The internal edition's credentials carry a claim-review line and need the engagement lead's sign-off before client use (local notes).

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

v40 (`v40-6a12389`), 2026-11-25: exceptions as the value story (02, 06, 12), how far AI goes step by step on 11, and earned autonomy on 13; guide additions. Desktop matrix 363 passed, 0 failed. Audits, dash check, copy lint and term scan pass; both editions build. Against the public build: visual QA 57 screenshots at each of four sizes, 0 console errors; PDF fallback 60 pages, 0 console errors.

v39 (`v39-20c5309`), 2026-11-25: the opening chapter reworked from the owner's review. 01 positioning (the one place for AI in non-financial risk); 02 five levels per question, stepped through four questions with totals; 03 external and internal change on one chain, with a worked example; 04 missing systems in red, one by one, and the 360 view counted in two bars; 05 the information flow in five steps per role (access, live query or cached index, knowledge graph, rules, AI, answer). Desktop matrix 363 passed, 0 failed. Audits, dash check, copy lint and term scan pass; both editions build. Against the public build: visual QA 57 screenshots at each of four sizes, 0 console errors; PDF fallback 60 pages, 0 console errors. The cover fits 1366 x 650 and 1024 x 768.

v38 (`v38-a56bf06`), 2026-11-25: a new screen 05, one connected picture with a view per role, opens chapter 2 (screens 05 to 14 are now 06 to 15; chapters 4, 3, 4, 4). Four roles in two groups; each role's question, the access each of the eight systems grants it, the records linked and the answer shaped for the role; the Head of NFR and control owner views are marked target design. Desktop matrix 363 passed, 0 failed (ten new tests for screen 05). Audits, dash check, copy lint and term scan pass; the internal edition builds. Against the public build: visual QA 57 screenshots at each of four sizes, 0 console errors; PDF fallback 60 pages (one per role on screen 05), 0 console errors. Every role checked for text inside its boxes and above the floor at eight sizes.

v37 (`v37-000c1c0`), 2026-11-25: screen 14's two-line examples ran about 19 px below their cards; the cards are taller, the four "For example" strips line up, and the fallback picture is redrawn. The box test now checks every box framed on all four sides, not only `.ts-obj` (it fails on v36, passes on v37). Desktop matrix 353 passed, 0 failed. Audits, dash check, copy lint and term scan pass. Against the public build: visual QA 56 screenshots at each of four sizes, 0 console errors; PDF fallback 56 pages, 0 console errors.

v36 (`v36-e8663bd`), 2026-11-24: presentable by any consultant, clear to the NFR business owner; sharper product captures and a rotating cover; the answer's evidence count corrected to the product's (15 items from six registers). Desktop matrix 353 passed, 0 failed. Audits, dash check, copy lint and term scan pass. Against the public build: visual QA 56 screenshots at each of four sizes, 0 console errors; 125 percent zoom clean; PDF fallback 56 pages, 0 console errors. Box audit at eight sizes: no text outside its box.

v34 (`v34-ce4b3d5`), 2026-11-24: screens 02 to 14 reworked so each lands one point with a recognisable example. Desktop matrix 353 passed, 0 failed. Audits, dash check, copy lint and term scan pass. Against the public build: visual QA 56 screenshots at each of four sizes, 0 console errors; 125 percent zoom clean; PDF fallback 56 pages, 0 console errors. Box audit at eight sizes: no text outside its box. Body text medians 13.0 to 14.8 px across core screens; smallest labels 9.46 px only in the 1366 x 650 window. Scene fallbacks regenerated from the scenes (12 pictures, about 1 MB).

v33 (`v33-73f05f2`), 2026-11-24: desktop matrix 353 passed, 0 failed (the 452 skips are per-project by design; `mobile` needs WebKit, not installed here). Audits, dash check, copy lint and the term scan pass. Against the public build: visual QA 56 screenshots at each of four sizes, 0 console errors; 125 percent zoom clean; PDF fallback 56 pages, 0 console errors. Box audit at eight sizes (including 1366 x 650, 1536 x 730 and 1920 x 960): no text outside its box, nothing clipped, no overlapping boxes.

v32 (`v32-5492c5a`), 2026-11-24: desktop matrix (chromium, 1366 x 768, 1440 x 900, 1920 x 1080, 1024 x 768) 350 passed, 0 failed; the 440 skips are per-project by design. The `mobile` project needs WebKit, which is not installed on this machine, and is not part of the matrix. All audits, the dash check and the copy lint pass. Against the public build served from `dist/`: visual QA 56 screenshots at each of 1920 x 1080, 1600 x 900, 1440 x 900 and 1366 x 768 with 0 console errors; 125 percent zoom clean; PDF fallback 56 pages, 0 console errors. Internal edition PDF: 60 pages, 0 console errors, kept in `internal/fallback/` (git-ignored).
