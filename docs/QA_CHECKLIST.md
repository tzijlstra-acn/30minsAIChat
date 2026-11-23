# NFR Workspace pitch: QA checklist (release v29, pitch plan v4)

Status as of 2026-11-23 on branch `feat/pitch-v4`. "Automated" names the Playwright test or audit that covers the item; "Visual" means checked on screenshots at 1920x1080, 1600x900, 1440x900, 1366x768 and 125 percent browser zoom (1536x864 at 1.25 device pixel ratio), plus full-motion walkthroughs.

```
npm run serve
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
npm run qa:visual
```

## 1. Critical route (brief 13.1)

| # | Check | Status | How |
|---|---|---|---|
| 1 | Live and local URL open | Pass | Local suite; live check after each deploy |
| 2 | Password gate works | Pass | Automated: "auth gate redirects to index.html without a session flag" |
| 3 | Cover deep link works | Pass | Automated: `#cover` after a reload |
| 4 | Default route linear and understandable | Pass, pending people test | Twelve screens, four chapters; see section 2 |
| 5 | Start-up plays, skips, replays | Pass | Automated: start-up tests |
| 6 | Decision-first home | Pass | Automated: one Now card, Next, Watching, Done; all third-party cases |
| 7 | Standard case opens | Pass | Automated: Open case and the Assist hand-off |
| 8 | Question returns a structured visual answer | Pass | Automated: conclusion, four figures, five ranked bars, trend line, drivers with sources, freshness, next action |
| 9 | Evidence or source detail available | Pass | Source chips on every driver and comparison row; evidence checklist; citations in the briefing |
| 10 | Automation trace pauses at a human gate | Pass | Automated: eight steps, last one waiting at the human gate |
| 11 | Human action produces a visible state change | Pass | Automated: preview, confirm, case status and queue change; home shows the review recorded |
| 12 | Audit receipt appears | Pass | Automated: acknowledged receipt only after the commit |
| 13 | Agent Builder shows goal, permissions, plan, result | Pass | Automated: permissions before any Run control exists; visual, cited briefing |
| 14 | Save and promotion lifecycle understandable | Pass | Automated: run once, save, schedule, template; promotion path |
| 15 | Six-month roadmap matches the three layers | Pass | Automated: three lanes from the same layer data |
| 16 | Main route ends before the appendix | Pass | Automated: last core screen precedes the first reference section |
| 17 | Appendix opens and returns | Pass | Automated: A to E by hash, Back to the story, Escape |
| 18 | Reset restores the known state | Pass | Automated: `0` returns to the cover with state `cover` and no flags |
| 19 | Safe mode carries the story | Pass | Automated: `?safe=1` and the toggle; demo beats still work |
| 20 | No console errors | Pass | Automated per viewport; walkthroughs report zero |

## 2. Comprehension (brief 13.2)

| Check | Status |
|---|---|
| Two colleagues not involved in the build (one business or risk, one technology) watch the default route unbriefed and answer the seven questions | **Not done.** Needs people. Questions: what is NFR Workspace; how is it different from chat; what are Ask, Use, Run and Create; what are the three layers; where does the human decide; what is delivered in six months; what role might an enterprise agent runtime play. Fix any screen they cannot explain. |

## 3. Claim audit (brief 13.3)

| Claim on screen | Status |
|---|---|
| The Workspace prepares a case end to end, the professional decides, the system records | Demonstrated in the pitch with synthetic data; a target design, not a shipped product |
| Assist hands work to a role app; insights are visual and source-linked | Demonstrated in the pitch; target design |
| Agents inherit the user's access and do not create new access | Design principle demonstrated in the pitch; to be validated in the chosen runtime |
| Write-back is previewed, checked, approved, attributed and recorded | Demonstrated in the pitch; Appendix E is the target control pattern |
| Six months prove one loop and reusable foundations | Hypothesis requiring client validation (entry conditions on the screen) |
| Value across risk, operating performance and capacity | Hypothesis; the business case is labelled illustrative |
| A validated agent runtime can provide execution and governance (Appendix C) | Candidate, stated as such on the page; asset-specific status lives only in local notes, verified against the source on 2026-11-23 |
| Running prototype captures (appendix) | Shows the development prototype on a synthetic bank; labelled as a development build |

No screen claims an internal asset is used, shipped or production ready.

## 4. Security and confidentiality (brief 13.4 and 8.3)

| Check | Status |
|---|---|
| Repository visibility | **Public**, and Pages serves every committed file (docs, tests, scripts included). Treat everything committed as public |
| Credentials, tokens, model keys | None found (repository scan) |
| Client data or branding | None; automated bank-neutral check |
| Internal URLs | One link to the team's NFR AI Assets portal (restricted access) |
| Internal asset names, source, screenshots or archive contents | None in tracked files or history; automated check on the appendix pages; asset detail kept in git-ignored `*.local.md` |
| Confidential presenter notes in public files | None; internal talk track only in a local, git-ignored file |
| Reliance on the password | None; the gate is presentation-only and the guide says so |
| Personal information | Decided 2026-11-23 by the deck owner: the team appendix (seven colleagues' names, work emails and photos) and the owner email in `claims.json` stay as they are |

## 5. Visual (brief 13.5)

| Check | Status | How |
|---|---|---|
| No clipping, no tiny text, no overflow | Pass | Automated per viewport (1024x768 to 1920x1080); text floors 9.5 to 11 px rendered |
| No chart overflow, no broken SVG | Pass | Visual; the trend chart has fixed size and an accessible label |
| No hidden primary action, no off-screen drawer | Pass | Visual: insight action bar, preview confirm, reuse panel and drawers inside the frame at 1366x768 |
| Smooth animation | Pass | Full-motion walkthroughs |
| Contrast | Pass | Dark theme tokens; meaning is never colour alone (labels, icons and states carry it) |
| Stable application frame | Pass | Automated: app-to-app moves are instant and the frame does not shift |
| Appendix diagrams fit without zooming | Pass | Visual at 1440x900 and 1366x768 |

## 6. Performance (brief 13.6)

| Check | Status |
|---|---|
| Fast initial load, no large media, no remote fonts | Pass: vendored fonts and libraries; no particle background |
| No live API, cold cache works | Pass: automated "no runtime request leaves the local origin"; every test starts cold |
| Animations stop when a screen is inactive | Pass: scenes are destroyed on departure; timelines are tracked |
| No memory growth from repeated replay | Pass: 25 replays of the home and builder screens left the JS heap at 10 MB and the DOM size unchanged |

## Not covered

- The `mobile` Playwright project (WebKit) does not run on this machine (`npx playwright install webkit`). Mobile is not a goal.
- Microsoft Teams screen-sharing not tried end to end; the text floors are the proxy.
