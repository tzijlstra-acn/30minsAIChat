# NFR Workspace: presenter guide (v7, merged proposition)

A 30-minute conversation for two buyers: the NFR business owner first, the IT strategist second. v7 merges the earlier control-platform proposition into one story: **NFR Workspace**. The deck tells it in fourteen screens in four chapters; **the real NFR Workspace product is the demonstration**, shown live after screen 07. The deck carries no mock of the product. Everything on screen is synthetic and bank-neutral.

The one idea the room must leave with: **NFR work arrives as a question, not a method; the assistant helps the person, and NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.** The principle: **AI prepares. Professionals decide. Systems record.**

The live product has its own script: `docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in the `nfr-workos` repository. It is authoritative for the five acts; this guide covers the deck, the hand-off, the return and the appendix.

## Two editions

| Edition | Built with | Where it runs | Contents |
|---|---|---|---|
| Public | `npm run build:public` (also what GitHub Pages publishes) | The Pages site, or `npm run serve:public` on port 8190 | Fourteen screens, 28 appendix pages, the captured fallback. No client details, no credentials, no commercial terms, no internal asset names |
| Internal | `npm run build:internal` (needs the git-ignored `internal/` folder) | Locally only: `npm run serve:internal` on port 8191 | The public edition plus internal pages and an edition badge. Never shared by link; see `internal/README.local.md` |

Use the public edition with clients unless every internal page you plan to show has passed its claim review.

## Timeboxes

| Minutes | Chapter | Screens |
|---|---|---|
| 0 to 6 | The shift: how the work arrives, how the chain drifts, assistant and Workspace | 01 to 04 |
| 6 to 9 | The model: four ways to work, three layers | 05, 06 |
| 9 to 17 | The live product, five acts | 07, then the product |
| 17 to 21 | What happened beneath it: the plan, the connected context, the authority boundary | 08 to 10 |
| 21 to 25 | Value; qualify in five weeks, prove in six months | 11, 12 |
| 25 to 30 | Experience, the workshop decision, appendix pages by question | 13, 14 |

**Twenty-minute route:** 01, 02, 04, 05, 07 and the product, 08, 10, 12, 14. Screens 03, 06, 09, 11 and 13 each have an appendix page to open if a buyer asks.

Do not try to show every appendix domain. Open one page when a buyer asks.

## Before the meeting

### The day before

1. Start the standalone product with `Launch NFROS.cmd` (port 3200), not a development server; on the meeting morning use `Launch NFROS.cmd --reset`. The window ends with **Ready. The showcase day is clean.** `http://localhost:3200/api/health/demo` shows the same checks.
2. Rehearse the five acts once, including the write-back; then reset the demonstration so the meeting starts on a clean day.
3. Regenerate and check the fallbacks: the captured acts in the deck (key F), the product's screen recording, and the PDF of the deck (`npm run fallback`, then copy `artifacts/fallback/NFR-Workspace-<release>.pdf` to the desktop).
4. Keep a local clone of this repository, so the deck also runs from `npm run serve:public` without the internet.

### Thirty minutes before

| Check | How |
|---|---|
| Browser | A dedicated window or profile, notifications off, password-manager pop-ups off, no personal bookmarks or account details visible |
| Two tabs | Tab 1: the deck on the cover. Tab 2: the product on `http://localhost:3200`, reset, signed out at the sign-in screen |
| Edition | The public edition, unless an internal page has passed claim review. The internal edition shows a badge at the bottom of every screen |
| Readiness | The product's readiness check reports ready; the first question has been asked once after the reset and the demo reset again |
| Zoom and resolution | Browser zoom at 100 percent on both tabs; test the shared screen at the real resolution (1366 x 768 and up) |
| Screen sharing | Share the browser window (both tabs are in it), not a single tab |
| Deck | Press `0`: everything returns to the cover. If the laptop is slow, press `S` for safe mode |
| Clicker | Page Down and Page Up move between screens |

## Keys (deck)

| Key | What it does |
|---|---|
| Right / Left, Page Down / Page Up | Next or previous screen; on the captured fallback, next or previous capture |
| Space | Advance the scene; at its end, the next screen |
| W | Go to Enter NFR Workspace (screen 07) |
| L | Open the live product (`http://localhost:3200/`; add `?live=<url>` to the deck address to change it) |
| F | The five acts, captured from the product |
| A | Appendix index |
| 1, 2, 3, 4 | Appendix domain: Value & Economics; Methods, Control & Assurance; Data, Knowledge & Systems; Delivery, Scale & Credentials |
| M | Back to the main story |
| R | Replay the screen |
| S | Safe mode on or off |
| Escape | Close the open panel, or go back one level (page, index, story) |
| 0 | Reset everything to the cover |
| ? | Shows the keys |
| Browser Back | From an appendix page, back to the screen that opened it |

## Opening

> "We are not here to propose another chatbot. We want to explore how the questions your risk function is asked every week can be answered as connected, controlled work, with the professional deciding."

---

## Chapter 1: the shift

### 01 From firefighting to prepared judgement

- **Remember:** a working product for one NFR role, not a drawing of one.
- **Talk track (30 s):** "On the right is the real product's Today screen for a third-party risk manager: work prepared for one role, decided by a person, recorded by the system. You will use it in about ten minutes."
- **If asked "is this real?":** "Yes, it runs on this laptop on synthetic records."

### 02 NFR work arrives as a question, not a method

- **Remember:** requests come by email, meeting, audit request and chat, and none of them names a method, a data set or an owner.
- **Talk track (45 s):** read two of the four requests aloud. "None of these arrives labelled. Each needs several records, documents, rules, judgements and owners, and they all land in one role's queue."
- **Deep dive:** V1 (where to start; its detail lists the nine kinds of request risk functions bring).

### 03 Regulation changes from above. Practice drifts from below.

- **Remember:** not regulation, not people: rules are re-mapped by hand and drift stays unseen until audit.
- **Talk track (50 s):** "From above: new regulation, revised standards, findings, policy updates. From below: controls that no longer address the risk, are not performed as designed, rely on stale evidence, or attestations that no longer reflect reality. The chain from obligation to decision stops telling one story, and the professional re-maps it by hand. The result is fragmented, falsely assured and burdensome."
- **Deep dive:** D4 (the connected NFR core).

### 04 The assistant helps. The Workspace carries the work.

- **Remember:** assistance improves individual activities; it does not create a complete controlled process.
- **Talk track (45 s):** walk the eight steps of the gap (identify the case, retrieve, apply the method, detect exceptions, route, approve, update the record, keep the trail). "The assistant helps with a step. The Workspace carries all eight."
- **Business owner asks:** "So our assistant rollout was wasted?" **Answer:** "No. It is the starting point."

## Chapter 2: the model

### 05 One Workspace. Four ways to get work done.

- **Talk track (60 s):** Ask, Use, Run, Create, each with its rule and example. "Same identity, same permissions, same evidence, same control record."
- **Deep dive:** M1 (which capability handles which work).

### 06 Scaling requires three layers to move together

- **Remember:** improving only the AI component creates another pilot. NFR Workspace is where all three meet.
- **Talk track (45 s):** work and roles, process and controls, data and platform, maturing together.

### Transition into the product

> "The simplest way to see the difference is to open the working day of a third-party risk manager. It does not start with a blank chat. It starts with the next decision."

## Chapter 3: the Workspace

### 07 Enter NFR Workspace (the doorway)

- **Remember:** the live product is the evidence; this screen is only the doorway.
- **Action:** arrive on the screen (or press W). It resolves the role and permissions, loads the current decisions, connects the approved applications and shows **Open live Workspace (L)**. Press L or click it, or switch to the product tab.
- **If the product is unavailable:** press F for the five acts captured from the product. Say: "Here is the same working day, captured from the product." Do not apologise for the technology.

### Live demonstration: five acts (in the product)

Follow the product's guide (`docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in `nfr-workos`). Synthetic institution: Arcadia Bank AG. Six to eight minutes in all.

| Act | Takeaway | If asked how |
|---|---|---|
| 1 The Workspace feels real | The user does not start with a blank chatbot | M1, D1 |
| 2 The next decision arrives prepared | The case, the evidence and the action arrive together | D3, M6 |
| 3 A live question, a visual answer | Not prose: a governed analysis from connected records; no number came from a model | D8, D4, D5 |
| 4 From insight to action | The professional approves; the system records | M7, D9 |
| 5 The long tail, governed | Agents cover the long tail without bypassing controls | M8, M1 |

**Return to the deck:** switch to the deck tab, still on screen 07, and press Space. The deck continues to screen 08, which explains what the audience just saw. From the captured fallback, Space at the last capture does the same.

### Recovery during the live demonstration

| Situation | What to do |
|---|---|
| A screen is slow | Keep talking about what it will show; a second click usually lands |
| The expected state is missing | Reset the demonstration from the account menu, or switch to the deck and press F for that act |
| The product will not start | Press F in the deck and walk the five acts from the captures; or play the product's recording |
| The day shows earlier work | Account menu, **Reset demonstration**, then **Confirm reset** |
| The network is blocked | The product and the deck both run locally; nothing needs the internet after the first load |

### 08 No single large model worked this out

- **Remember:** complex outcomes are assembled from small, testable steps; you see a plan, not a model.
- **Talk track (50 s):** the five steps (understand the request and the case; select narrow methods and governed data; calculate, compare and verify; pause where judgement is required; record the approved outcome). Then the three kinds of step: deterministic, narrow model call, human judgement. "In the demonstration, every figure was computed from the records, and the professional approved before anything was written."
- **Deep dives:** M2 (why small methods), D8 (how a question becomes a visual answer).

### 09 Every answer keeps the line from obligation to evidence

- **Remember:** the connected core computes the ripple; people decide what to do about it.
- **Talk track (45 s):** top-down, a new obligation arrives and finds its risks and controls; bottom-up, a control test fails and is traced up to obligations and attestations. "Both traces meet on one control: the new obligation relies on a control with a missing test."
- **Deep dives:** D4 (the connected core), D5 (when a knowledge graph adds value).

### 10 AI prepares. Professionals decide. Systems record.

- **Remember:** human authority is designed into the process. Executing a step grants no authority.
- **Talk track (45 s):** the three columns: AI-assisted preparation, deterministic control, human authority with a named decision maker.
- **Deep dives:** M6 (AI, rules and people), M7 (governed write-back).

## Chapter 4: the path

### 11 Prove better risk outcomes, and the capacity returned

- **Remember:** risk outcomes, operating performance and capacity are measured separately, and none of them is headcount.
- **Deep dives:** V2 (value tree), V3 (the unit-economics calculator: change adoption or efficiency live if the economic buyer engages).

### 12 Qualify in five weeks. Prove the loop in six months.

- **Remember:** five weeks proves fit and value; six months proves the operating model.
- **Talk track (60 s):** the five weeks: baseline, configure with a fit gate, challenge. Then the six-month loop in three lanes, then scale through reuse.
- **Deep dives:** S1 (the five-week qualification), S2 (the six-month working loop).

### 13 The approach has been applied before

- **Remember:** experience of the delivery team, not of the product.
- **Public edition:** three areas of experience, without client details. If asked for names or figures: "We share client examples separately, with their permission."
- **Deep dive:** S5 (how to bring this in).

### 14 Which role, decision and process becomes the first loop?

- **Remember:** agree four things today: the target role, the decision or process, representative data and cases, and the proof criteria at five weeks and six months.
- **Secondary question:** which existing AI, workflow, GRC and data capabilities the Workspace should reuse rather than rebuild.
- **Deep dive:** V1 (where to start).

## Close

> "The first step is not the universal NFR platform. It is one role, one bounded decision journey and one measurable loop, with the evidence that earns the next wave."

---

## Appendix: four domains

Each page answers one buyer question, shows one main visual, states the decision implication and its claim status, and has Index (A), Previous, Next and Main story (M). Escape goes back one level.

| Buyer question | Page | Key |
|---|---|---|
| Where should we start? | V1 | 1 |
| Where does value come from? | V2 | 1, then Next |
| What are the unit economics? | V3 (interactive) | 1, Next twice |
| Why do later journeys cost less? | V4 | |
| What does total cost include? | V5 | |
| Which capability handles which work? | M1 | 2 |
| Why small methods, not one large model? | M2 | |
| Which methods exist? | M3 | |
| What does each analysis function do? | M4 | |
| How are methods evaluated and assured? | M5 | |
| What belongs to AI, rules and people? | M6 | |
| Can it change our records? | M7 | |
| How does an ad hoc agent become managed capability? | M8 | |
| Is this replacing our GRC? What sits behind the Workspace? | D1 | 3 |
| How do the systems connect? | D2 | |
| What context travels through the Workspace? | D3 | |
| What is the connected NFR core? | D4 | |
| Do we need a knowledge graph? | D5, then D6 and D7 | |
| How does a question become a chart? | D8 | |
| Does integration widen data access? | D9 | |
| What happens in the five weeks? | S1 | 4 |
| What happens in the six months? | S2 | |
| What is reusable? | S3 | |
| Who owns and operates it? | S4 | |
| How can we bring this in? | S5 | |
| How does it scale? | S6 | |

Also from the index: the captured live demonstration, the team page, and the Evidence Atlas (reference library). The internal edition adds pages for internal use; see `internal/README.local.md` on the presenter machine.

## Buyer questions

### NFR business owner

- **Is this another chatbot?** No. Chat is one interaction mode. The Workspace also holds the role, case, evidence, applications, controls, decisions and recorded outcomes. You saw it start from Today, not from a chat box.
- **Are you replacing our GRC platform?** No. The authoritative systems stay in place (D1). The Workspace prepares and coordinates work across them and writes back only through approved controls (M7).
- **Which of our requests could it answer?** Some need only deterministic methods, some need a narrow model call checked against the source, and some are not yet scoped. The five-week qualification sorts them (V1, S1).
- **Can the agent change risk records?** Material changes follow a proposed action, a permission check, human approval, a governed connector and an audit receipt (act 4, M7).
- **How do we prevent uncontrolled personal agents?** Personal agents inherit existing access and begin constrained; scheduling, publication, write-back and standardisation need stronger review (M8).
- **What is the business case?** Built per case from the client baseline: capacity returned, operating benefit, run cost and payback (V3). Waiting time is not converted into headcount.
- **Why five weeks, then six months?** Five weeks qualifies one question against your data and fixes the scope at a gate; six months proves one complete loop (S1, S2).

### IT strategist

- **What sits behind it?** The Workspace, a runtime gateway, approved execution services, the authoritative systems (D1).
- **Does it depend on a specific agent runtime or asset?** No. Execution sits behind a stable gateway contract; existing assets are candidates, validated before any commitment.
- **How is model risk assessed?** Step by step: each method has a defined input, output and error rate, so it can be tested and challenged on its own (M2, M5).
- **How do facts become charts?** Governed data services calculate; a validated insight schema chooses the chart; the model helps interpret (D8).
- **Does it widen access?** No. Identity flows to every query and action; results are filtered before the model and the screen (D9).
- **Do we need a knowledge graph?** Only for relationship and impact questions, built one journey at a time (D5 to D7).
- **Who runs it?** A named product owner, with process, control, data and platform owners and independent oversight (S4).

## Comprehension check

After one pass, a first-time viewer should be able to explain: why work arrives as a question; why the chain drifts; why an assistant is not the Workspace; Ask, Use, Run and Create; the three layers; why small methods and not one large model; where professional authority remains; what the five weeks and the six months prove. Ask a business colleague and a technology colleague who did not build the deck, before explaining anything.
