# NFR Workspace v2: QA checklist

Status as of 2026-11-23 on branch `feat/nfr-workspace-v2`. "Automated" names the test or audit that checks the item; "Visual" means checked on screenshots from `npm run qa:visual` (1920x1080, 1600x900, 1440x900, 1366x768) and full-motion walkthroughs.

How to re-run everything:

```
npm run serve                      # in one terminal
npx playwright test --project=chromium --project=1366x768 --project=1440x900 --project=1920x1080 --project=1024x768
npm run audit:all && python scripts/check-emdash.py && python scripts/lint-copy.py
npm run qa:visual                  # screenshots in artifacts/visual-qa/
```

## Functional

| Check | Status | How it is checked |
|---|---|---|
| Password gate still works | Pass | Automated: layout "auth gate redirects to index.html without a session flag" |
| `pitch.html#cover` deep link works | Pass | Automated: demo "refreshing inside the Workspace recovers a valid state; #cover deep link works" |
| Next and previous navigation | Pass | Automated: layout "right arrow key advances"; demo "Space moves on from story screens; arrows move between screens" |
| Browser refresh does not break state | Pass | Automated: refresh inside the journey returns to the case summary |
| Workspace start-up plays, skips and replays | Pass | Automated: "the start-up takes about two seconds, can be skipped with Space and replayed with R" |
| Context loads before the assistant | Pass | Automated: midway through start-up, three or more statuses shown and NFR Assist not yet visible |
| Standard journey completes end to end | Pass | Automated: "runs end to end: summary, role app, trace, human decision, recorded outcome and receipt" |
| Human decision produces outcome and receipt | Pass | Automated: no receipt before the decision; acknowledged receipt after; each of the three decisions records its own outcome |
| Agent Builder completes from goal to output | Pass | Automated: "goal, then scope and permissions before any run, then plan, run and a cited briefing" |
| Permission screen appears before any run | Pass | Automated: the Run control does not exist on the scope step |
| Save and promotion options work | Pass | Automated: saved-personal, then publication-requested, with the promotion path highlighted |
| Escape closes overlays, then leaves the Workspace | Pass | Automated: trace closes first, second Escape returns to the control boundary |
| Reset returns to a known state | Pass | Automated: `0` from the builder returns to the cover with state `deck` |
| Safe mode works | Pass | Automated: `?safe=1` and the nav toggle; the demo still steps through every beat |
| No unhandled console errors | Pass | Automated: layout "no console errors on load" at every viewport; visual QA run reports zero |

## Content

| Check | Status | How it is checked |
|---|---|---|
| No visible "NFR OS" | Pass, one known exception | Automated: "NFR OS is gone from the visible experience and the source copy". Exception: the three prototype screenshots in the appendix (`assets/img/nfros/`) show the prototype's "NFROS" wordmark inside the image. The screen says "Development build: the captures still show the prototype's working title." Recapture after the prototype is rebranded, or remove the appendix screen. |
| No client branding or confidential detail | Pass | Automated: "no client branding: the experience is bank-neutral" |
| All demo names and numbers synthetic | Pass | Data lives in `workspace-demo.js` and `tprm-case.js`, both flagged `synthetic` and frozen; "Synthetic demonstration" badge on every app screen |
| Four capability labels consistent | Pass | Automated: Ask, Use, Run, Create; NFR Assist, NFR Apps, NFR Automations, Agent Builder |
| Three layers consistent | Pass | Automated: Work & roles, Process & controls, Data & platform, reused by the roadmap |
| No screen suggests AI accepts risk on its own | Pass | Control boundary screen: "No capability owns the risk"; automated claim check for overclaiming phrases |
| Workspace does not replace authoritative systems | Pass | Technical depth: "Authoritative systems remain authoritative"; receipts acknowledged by the system of record |
| "Ad hoc" and "parallel" spelled correctly | Pass | Automated: misspelling check on all visible core text |
| House copy rules | Pass | `lint-copy` (no "will/must/never/always", no exclamation marks), `check-emdash`, `audit:story` (headlines of ten words or fewer) |

## Visual

| Check | Status | How it is checked |
|---|---|---|
| No clipped text at required resolutions | Pass | Automated per viewport (1024x768 to 1920x1080): elements inside the canvas, no ellipsis, subtitles not clipped |
| No tiny labels when screen-shared | Pass | Automated text floor: 11px rendered at 1440x900 and above, 10px at 1366x768 and 1280x720, 9.5px at 1024x768. Narrative text renders at 14px or more from 1440x900 up |
| Focus states visible | Pass | Visual: cyan focus outline on every Workspace control and presenter button |
| Motion smooth | Pass | Visual: full-motion walkthrough at 1920x1080; transitions are opacity and transform only |
| Reduced motion usable | Pass | Automated: every scene complete and fully visible under reduced motion |
| Application distinct from narrative slides | Pass | Visual: app screens use a compact header and a full-width application frame |
| Assistant appears after the Workspace context | Pass | Automated (see Functional) |
| Builder output readable without scrolling | Pass | Visual: the one-page briefing fits the application frame at 1366x768 and above |

## Performance and resilience

| Check | Status | How it is checked |
|---|---|---|
| No live API calls | Pass | Automated: "no runtime request leaves the local origin"; `audit:offline` |
| No remote runtime dependencies | Pass | Automated: "no external runtime resources in pitch.html" |
| Assets load from the repository | Pass | Relative paths only; GitHub Pages serves the repository root |
| Fast on a standard laptop | Pass | No particle background; scenes mount on arrival and are destroyed on departure |
| Works with a cold cache | Pass | Every Playwright test starts a fresh browser context |
| Safe mode carries the whole story | Pass | Automated: safe mode renders final states; every screen and demo control remains available |
| A failing scene leaves something on screen | Pass | Automated: static fallback when a script fails to load or throws, including a Workspace screen |

## Comprehension

| Check | Status |
|---|---|
| No-context colleague test (the six questions in the presenter guide) | **Not done yet.** Needs a colleague who was not involved in the design. Run it once before the presentation and tighten any screen they cannot explain. |

## Not covered

- The `mobile` Playwright project (iPhone 14, WebKit) does not run on this machine because WebKit is not installed (`npx playwright install webkit`). Mobile layout is not a goal for this presentation.
- Microsoft Teams screen-sharing has not been tried end to end; the text floors above are the proxy.
