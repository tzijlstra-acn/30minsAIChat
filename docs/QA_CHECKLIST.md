# NFR Workspace pitch: QA checklist (release v30, meeting-ready plan v5)

Status as of 2026-11-23 on branch `feat/pitch-v5`. "Automated" names the Playwright test or audit that covers the item. "Visual" means checked on screenshots at 1920x1080, 1600x900, 1440x900 and 1366x768, plus 125 percent browser zoom (1536x864 and 1152x720 at 1.25 device pixel ratio).

```
npm run serve
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
npm run qa:visual
npm run fallback
```

Last full run: 360 passed, 0 failed (the remaining skips are per-project by design). All audits pass.

## 1. Meeting-survival gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Five-minute comprehension | Pass on content, **people test not done** | Screens 01 to 05 cover what the Workspace is, the assistant difference, the four ways and the three layers by about 5:45; the principle is on the cover. See section 3 |
| 2. One complete operating loop | Pass | Trigger (review due), prepared evidence, visual insight with sources, challenge at the human gate, previewed write-back, changed case and queue state, audit receipt. Automated |
| 3. Controlled Agent Builder | Pass | Purpose, sources, inherited permissions, prohibited actions ("Cannot"), plan, human review, output, save and promotion path. Automated |
| 4. Honest architecture | Pass | Appendix C separates experience, runtime services and authoritative systems; Appendix F is a candidate, not a dependency; nothing claims production readiness |
| 5. Reliable presentation | Pass | No live AI, API, key or bank system. Automated: no request leaves the local origin; the route and the demo run offline after the first load |
| 6. Fallback | Pass | Safe mode (S, `?safe=1`), the local copy (`npm run serve`), and a PDF of the whole route (`npm run fallback`, 35 pages) |

## 2. Critical path (brief 12.1)

| # | Check | Status | How |
|---|---|---|---|
| 1 | Local and deployed URL open | Pass locally | Live check after each deploy |
| 2 | Password gate works | Pass | Automated: redirect to `index.html` without the session flag |
| 3 | `#cover` deep link works | Pass | Automated, after a reload |
| 4 | Core route starts in a known state | Pass | Automated: `0` returns to the cover with state `cover` and no flags |
| 5 | Next and previous controls | Pass | Automated: arrows, Space, Page Down and Page Up |
| 6 | Browser Back and Forward do not corrupt state | Pass | Automated: Back from an appendix page returns to the screen that opened it; Forward goes back in. The deck owns scroll restoration |
| 7 | Start-up plays, skips and replays | Pass | Automated: about 2.4 seconds; Space skips; R replays; Assist appears last |
| 8 | Decision-first home | Pass | Automated: one Now card, Next, Watching, Done |
| 9 | Standard case opens | Pass | Automated: Open case and the Assist hand-off |
| 10 | Assist hands off to the role app | Pass | Automated: the journey opens at `role-app-open` |
| 11 | Structured visual insight | Pass | Automated: conclusion, four decision facts, conclusion-titled charts with units, data tables, five ranked bars, trend line, drivers |
| 12 | Evidence detail opens and closes | Pass | Automated: every source chip opens a read-only record (state `source-detail-open`); Escape and Space close it first |
| 13 | Automation pauses at a human gate | Pass | Automated: eight steps, the last waiting |
| 14 | Human action opens a write-back preview | Pass | Automated: target, record, decision, reason, action owner and due date, approver, evidence, field changes |
| 15 | Confirmation visibly changes state | Pass | Automated: case status, queue, actions, monitoring; the home shows the review recorded |
| 16 | Audit receipt | Pass | Automated: transaction, actor, role, time, action, target record, sources, policy, automation, model, acknowledgement |
| 17 | Agent Builder: goal, permissions, prohibited actions, plan, result | Pass | Automated: permissions before any Run control exists |
| 18 | Save and promotion lifecycle | Pass | Automated: run once, save, schedule, template; promotion path |
| 19 | Roadmap matches three layers | Pass | Automated: three lanes from the same layer data |
| 20 | Main route ends before the appendix | Pass | Automated |
| 21 | Appendix opens and returns | Pass | Automated: A to G by hash, letters in order, Back to the story, Escape, browser Back |
| 22 | Reset restores the known state | Pass | Automated |
| 23 | Safe mode carries the story | Pass | Automated: `?safe=1`, the toggle and S; demo beats still work |
| 24 | No uncaught console error | Pass | Automated per viewport; visual QA and the PDF export report zero |

## 3. Comprehension (brief 12.2)

| Check | Status |
|---|---|
| Two colleagues not involved in the build (one business or risk, one technology) watch the default route unbriefed and answer: what is NFR Workspace; how is it different from chat or a copilot; what are Ask, Use, Run and Create; what are the three layers; where does the professional decide; what changes in the system after approval; what would be proven in six months; what role could an enterprise agent runtime play | **Not done.** Needs people. Do not explain before they answer; fix any screen that produces a wrong or vague answer |

## 4. Visual (brief 12.3)

| Check | Status | How |
|---|---|---|
| No clipping, no tiny text | Pass | Automated per viewport (1024x768 to 1920x1080) with text floors of 9.5 to 11 px; 125 percent zoom pass: no element outside the viewport, no text under 9.5 px |
| No chart overflow, no broken SVG | Pass | Visual; the trend chart has a fixed size; both charts carry a label and a data table |
| No hidden primary action | Pass | Visual at 1366x768: the insight action bar, preview confirm, reuse panel and drawers sit inside the frame |
| No off-screen drawer | Pass | Source detail, trace, decision panel and technical drawer inside the frame |
| Stable application shell | Pass | Automated: app-to-app moves are instant and the frame does not shift |
| Motion smooth or safely disabled | Pass | Full-motion walkthroughs; safe mode and reduced motion render final states |
| Contrast | Pass | Dark theme tokens; meaning is carried by labels and icons as well as colour |
| No layout jump after password entry | Pass | Same layout through the gate |

## 5. Claim audit (brief 12.4)

| Claim on screen | Class |
|---|---|
| Most banks already have AI assistance | Hypothesis requiring client validation (market observation; the room confirms its own maturity) |
| The Workspace prepares a case, the professional decides, the system records | Demonstrated in the presentation (synthetic); target state for a product |
| Assist hands work to a role app; insights are visual and source-linked | Demonstrated in the presentation; target state |
| Charts come only from a validated registry, never from model-written code | Implemented in current code (the deck's chart registry and fallback); target state for a product |
| Agents inherit the user's access and do not create new access | Demonstrated in the presentation; target state, to be validated in the chosen runtime |
| Write-back is previewed, checked, approved, attributed and recorded | Demonstrated in the presentation; Appendix D is the target control pattern |
| Six months prove one loop and reusable foundations | Hypothesis requiring client validation (entry conditions and proof gates on screen) |
| Value across risk, operating performance and capacity | Hypothesis requiring client validation; the business case is labelled illustrative |
| A validated runtime can provide execution and governance (Appendix F) | Candidate, stated as such. Asset-specific status ("documented as shipped" for some primitives, with gaps) lives only in local notes, verified against the source on 2026-11-23 |
| The demo runs without live AI, APIs or a network after load | Implemented in current code (automated) |
| Running prototype captures (appendix) | Implemented in a separate development prototype on a synthetic bank; labelled as a development build |

No screen claims an internal asset is used, shipped or production-ready.

## 6. Performance and reliability (brief 12.5)

| Check | Status |
|---|---|
| Cold load, no large media, no remote assets | Pass: vendored fonts and libraries; every test starts cold |
| No runtime API | Pass: automated "no runtime request leaves the local origin" |
| Works offline after the first load | Pass: automated offline run of the core route and the periodic-review demo |
| No memory growth from repeated replay | Pass: repeated replays of the home, journey and builder leave the JS heap flat |
| No duplicate listeners after navigation | Pass: scenes are destroyed on departure and rebuilt on arrival; global key and history listeners are registered once |
| No autoplay that blocks presenter control | Pass: Space skips or advances every timeline; keys work in every state |

## 7. Security and confidentiality (brief 10)

| Check | Status |
|---|---|
| Repository visibility | **Public**, and Pages serves every committed file (docs, tests, scripts). Treat everything committed as public |
| Credentials, tokens, model keys | None (pattern scan of tracked files) |
| Client names or branding | None; automated bank-neutral check |
| Internal asset name | None in tracked files; none in the history of any branch (`git log --all -S`) |
| Images from the uploaded asset | None: 58 asset images hashed, 0 match a tracked file |
| Internal URLs | One link to the team's NFR AI Assets portal (restricted access) |
| Personal information | Decided 2026-11-23 by the deck owner: the team appendix (seven colleagues' names, work emails and photos) and the owner email stay as they are. No other personal data |
| Stale naming (`NFR OS`) | None on screen; automated |
| Confidential presenter notes | Only in git-ignored `docs/PRESENTER_GUIDE_INTERNAL.local.md` |
| Reliance on the password | None; the gate is presentation-only and the guide says so |

## Not covered

- The `mobile` Playwright project (WebKit) does not run on this machine. Mobile is not a goal.
- Microsoft Teams screen-sharing not tried end to end; the text floors and the 125 percent pass are the proxy.
- The NFR AI Assets catalogue entry (separate repository) is not updated in this pass.
