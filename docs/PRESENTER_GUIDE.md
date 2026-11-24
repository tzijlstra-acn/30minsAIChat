# NFR Workspace: presenter guide (v7, merged proposition)

A 30-minute conversation for two buyers: the NFR business owner first, the IT strategist second. v7 merges the earlier control-platform proposition into one story: **NFR Workspace**. The deck tells it in fourteen screens in four chapters; **the real NFR Workspace product is the demonstration**, shown live after screen 07. The deck carries no mock of the product. Everything on screen is synthetic and bank-neutral.

## The idea in sixty seconds (read this first)

**The idea.** Banks already have AI assistants, but each one sees a single system: the mailbox, the open file, the GRC records. An NFR question, such as which critical suppliers are deteriorating and why, needs contracts, incidents, indicators, assurance reports, controls and dependencies together, so today a professional joins them by hand. NFR Workspace connects the content of every system for each NFR role, prepares the answer in small steps that can be tested, and leaves the decision with a named person.

**Three messages to repeat.**

1. Standalone AI sees one system. NFR answers need all of them.
2. NFR Workspace connects them for each role, in small steps that can be tested.
3. AI prepares. Professionals decide. Systems record.

**The ask.** Agree one role, one decision, representative data and the proof criteria, and qualify it in five weeks.

**Do not say.** "Replaces your GRC", "fully autonomous", "regulator ready", "built on" any named Accenture asset, or any client name or figure that has not passed claim review.

The live product has its own script: `docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in the `nfr-workos` repository. It is authoritative for the five acts; this guide covers the deck, the hand-off, the return and the appendix.

## Cue card (one page)

Print this. One point per screen, one sentence to say, the key to press. The detailed talk tracks follow further down.

| # | The point | Say | Key |
|---|---|---|---|
| 01 | A working product for one NFR role | "Work prepared for one role, decided by a person, recorded by the system." | Space |
| 02 | Questions come from everywhere | "None of these arrives with a method. Which did you get this month?" | Space |
| 03 | Change from above, drift from below | "The chain breaks in the middle, and today the professional re-maps it by hand." | Space |
| 04 | Standalone AI sees one system | "Each assistant sees one slice. The answer needs all eight. You will see it answered in a moment." | Space |
| 05 | Four ways of working | "One supplier: a question, one review, a monthly chase, a new watch. Same access and controls." | Space |
| 06 | Three layers improve together | "Pilots do not scale. One role first, then every role, on one connected core." | Space |
| 07 | The product itself | Live product: press L. No product on your laptop: press F for the walkthrough | L or F |
| Demo | Five acts, at least act 3 | "No single assistant could answer this: 15 evidence items from six registers." | Space |
| 08 | Calculated, not guessed | "Rules did the maths, AI explained it, checked, and a person decided." | Space |
| 09 | One failed test, everything it touches | "Found at audit today. Flagged the same day here." | Space |
| 10 | Who does what | "AI drafted, you approved, the system recorded who and when." | Space |
| 11 | Three kinds of value, measured | "Each measured on its own from your baseline. None of it is headcount." | Space |
| 12 | Start small, earn each step | "Five weeks on one question, six months live, then reuse. We need a role owner, a process expert and access." | Space |
| 13 | Done before | "Client examples are shared separately, with permission." | Space |
| 14 | What we agree today | "Role, process, data, proof criteria. Here is an example answer for each." | |

Also useful: A (appendix index), 1 to 4 (appendix domains), M (back to the story), 0 (back to the cover), S (safe mode on a slow laptop).

**Two rules.** Show at least act 3 of the demonstration before screen 08: screen 08 replays that answer. If the live product is not on your laptop, the walkthrough (F) is the demonstration; present it with confidence, it is the same product captured on the same records.

## Two editions

| Edition | Built with | Where it runs | Contents |
|---|---|---|---|
| Public | `npm run build:public` (also what GitHub Pages publishes) | The Pages site, or `npm run serve:public` on port 8190 | Fourteen screens, 28 appendix pages, the product walkthrough. No client details, no credentials, no commercial terms, no internal asset names |
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

0. Get the access code for the deck from its owner. It is not written in this guide or the repository, which is public. Without the live product on your laptop, skip step 1 and present the walkthrough (F) at screen 07.
1. Start the standalone product with `Launch NFROS.cmd` (port 3200), not a development server; on the meeting morning use `Launch NFROS.cmd --reset`. The window ends with **Ready. The showcase day is clean.** `http://localhost:3200/api/health/demo` shows the same checks.
2. Rehearse the five acts once, including the write-back; then reset the demonstration so the meeting starts on a clean day.
3. Regenerate and check the fallbacks: the product walkthrough in the deck (key F), the product's screen recording, and the PDF of the deck (`npm run fallback`, then copy `artifacts/fallback/NFR-Workspace-<release>.pdf` to the desktop).
4. Keep a local clone of this repository, so the deck also runs from `npm run serve:public` without the internet.

### Thirty minutes before

| Check | How |
|---|---|
| Browser | A dedicated window or profile, notifications off, password-manager pop-ups off, no personal bookmarks or account details visible |
| Two tabs | Tab 1: the deck on the cover. Tab 2: the product on `http://localhost:3200`, reset, signed out at the sign-in screen |
| Edition | The public edition, unless an internal page has passed claim review. The internal edition shows a badge at the bottom of every screen |
| Readiness | The product's readiness check reports ready; the first question has been asked once after the reset and the demo reset again |
| Zoom and resolution | Browser zoom at 100 percent on both tabs; test the shared screen at the real resolution (1366 x 768 and up) |
| Full screen | Put the deck tab in full screen (F11). In a browser window on a 1366 x 768 laptop the smallest labels shrink to about 9.5 px; full screen keeps them above 10 px |
| Screen sharing | Share the browser window (both tabs are in it), not a single tab |
| Deck | Press `0`: everything returns to the cover. If the laptop is slow, press `S` for safe mode |
| Clicker | Page Down and Page Up move between screens |

## Keys (deck)

| Key | What it does |
|---|---|
| Right / Left, Page Down / Page Up | Next or previous screen; in the product walkthrough, next or previous capture |
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

- **Remember:** four everyday questions, from four places. Each needs several sources and several people before anyone can answer.
- **Talk track (45 s):** "Your week looks like this. The COO emails: which controls duplicate across our entities? The regulatory forum asks what the new regulation adds. Internal Audit asks you to prove key controls operate. Procurement asks which critical suppliers are deteriorating. Look at what each one needs: inventories, clauses, test results, indicators, and the people who hold them. None arrives with a method. The answer sits across several systems; no single tool holds it."
- **Ask the room:** "Which of these did you get this month?"
- **Deep dive:** V1 (where to start; its detail lists the nine kinds of request risk functions bring).

### 03 Regulation changes from above. Practice drifts from below.

- **Remember:** not regulation, not people: rules are re-mapped by hand and drift stays unseen until audit.
- **Talk track (50 s):** point at the middle row first. "This is the chain every NFR function maintains: obligation, risk, control, evidence, assessment, decision. From above, change keeps arriving: new regulation, revised policy, audit findings. It lands on the obligations and the risks. From below, practice drifts: a control no longer covers the risk, it is not performed as designed, the evidence goes stale, an attestation is no longer true. The links in the middle break. Three consequences: the picture is fragmented, the bank is falsely assured, and every audit becomes a project. Today the professional re-maps the chain by hand."
- **Deep dive:** D4 (the connected NFR core).

### 04 Standalone AI sees one system. NFR needs the whole picture.

- **Remember:** this is the key screen of the first chapter. Each assistant sees one system; the NFR answer needs all of them.
- **Visual:** the question types itself out first. Let it finish before speaking.
- **Talk track (60 s):** "Take one question: which critical third-party services are deteriorating, and why? The answer needs eight things, and each lives in its own system: the third-party register, contracts and SLAs, incidents, risk indicators, supplier mail, assurance reports, controls and issues, service dependencies. The email assistant sees the mailbox. The document assistant sees the open file. The GRC assistant sees the GRC records. The chat assistant sees what you paste in. Nobody sees the other five, so the professional joins them by hand, for every question. NFR Workspace brings every system's content into one picture, within the user's permissions. You will see it answer exactly this question in a few minutes."
- **Business owner asks:** "So our assistant rollout was wasted?" **Answer:** "No. Each assistant helps with its own slice. The Workspace joins the slices."
- **IT strategist asks:** "Does that mean one big data lake?" **Answer:** "No. The Workspace reads through approved connections under the user's own access (D2, D9)."

## Chapter 2: the model

### 05 One Workspace. Four ways to get work done.

- **Remember:** one supplier, four ways of working. The difference is how often and how standard the work is. The labels under each verb are the names in the product's own menu: Ask the records, Work Hub, Processes, Agents.
- **Talk track (60 s):** "Ask: a one-off question, answered now: what changed in this supplier's SOC 2 report? Use: a standard task, one case at a time: the annual review of one critical supplier, in an app with the approved method and sign-off. Run: the same steps across many cases: every month, chase missing evidence from all critical suppliers, pausing for people at the gates. Create: a new question no app covers yet: track our dependence on one cloud provider this quarter. All four share the same identity, permissions, evidence and control record."
- **Deep dive:** M1 (which capability handles which work).

### 06 AI scales when work, process and data move together

- **Remember:** read left to right as an improvement: today's pilots, the first live process for one role, then every role.
- **Talk track (45 s):** "Today, each person uses AI their own way, handoffs stay manual, and every pilot copies its own data. That is why pilots do not scale. In the first live process, one role works from a prepared queue, one process has evidence, gates and approval, and the data comes through approved connections. At scale, every NFR role works that way, proven methods are reused, and one connected core serves every role. Improving only the AI component creates another pilot."

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
| 3 A live question, a visual answer | The question from screen 04, answered. Say: "No single assistant could answer this: the answer drew on 15 evidence items from six registers." Not prose: a governed analysis from connected records; no number came from a model | D8, D4, D5 |
| 4 From insight to action | The professional approves; the system records | M7, D9 |
| 5 The long tail, governed | Agents cover the long tail without bypassing controls | M8, M1 |

**Return to the deck:** switch to the deck tab, still on screen 07, and press Space. The deck continues to screen 08, which explains what the audience just saw. From the product walkthrough, Space at the last capture does the same.

### Recovery during the live demonstration

| Situation | What to do |
|---|---|
| A screen is slow | Keep talking about what it will show; a second click usually lands |
| The expected state is missing | Reset the demonstration from the account menu, or switch to the deck and press F for that act |
| The product will not start | Press F in the deck and walk the five acts from the captures; or play the product's recording |
| The day shows earlier work | Account menu, **Reset demonstration**, then **Confirm reset** |
| The network is blocked | The product and the deck both run locally; nothing needs the internet after the first load |

### 08 Every number in that answer was calculated, not guessed

- **Remember:** this screen answers the question every NFR audience asks after a demo: can I trust it? It replays the answer they just saw, step by step.
- **Talk track (50 s):** "Here is how the answer you just saw was built. A rule found the critical services in the register. The Workspace gathered 15 evidence items from six registers: the third-party register, performance history, incidents, issues, risk acceptances and fourth-party dependencies. A rule calculated each change: three deteriorating, Novalink up 23 points. Only then did AI explain why, two share one cloud provider, with every claim pointing at its source. And a person decided the next step. Rules do the maths, AI does one narrow language task and is checked, a person decides. So model risk is judged step by step, not for one big model."
- **Deep dives:** M2 (why small methods), D8 (how a question becomes a visual answer).

### 09 One failed test shows everything it affects

- **Remember:** connected records turn a surprise at audit into a flag on the same day.
- **Talk track (45 s):** "A control test fails: the supplier access review. On its own, that is one line in a testing tool. Connected, you see at once what it touches: the risk it mitigates needs a new rating; the third-party obligation now relies on an untested control; the self-assessment still rates it effective; and the quarterly attestation is due. Four records, four systems. Today this is found by hand, often at audit, after someone has signed. Here it is flagged the same day, before anyone signs. It works the other way too: a new obligation shows which controls it relies on."
- **Deep dives:** D4 (the connected core), D5 (when a knowledge graph adds value).

### 10 AI prepares. Professionals decide. Systems record.

- **Remember:** read the three columns with the demonstration: AI drafted the evidence request, the professional approved it, the system wrote it and issued a receipt.
- **Talk track (45 s):** "In the demo, AI drafted the evidence request and its reason. The professional reviewed every field and approved it as their own judgement. The system checked the permissions, wrote the change and issued a receipt. Running a step does not make the software the decision maker: every material change needs a named person, and the record shows who and when."
- **Deep dives:** M6 (AI, rules and people), M7 (governed write-back).

## Chapter 4: the path

### 11 Prove better risk outcomes, and the capacity returned

- **Remember:** three kinds of value, each with one measure the five weeks baselines. None of them is headcount.
- **Talk track (40 s):** "Risk outcomes: we measure the share of critical suppliers with current, complete evidence. Operating performance: days from trigger to decision. Capacity: hours of preparation per case, before and after. Each is measured on its own, from your baseline."
- **Deep dives:** V2 (value tree), V3 (the unit-economics calculator: change adoption or efficiency live if the economic buyer engages).

### 12 Qualify in five weeks. Prove it live in six months.

- **Remember:** start small and earn each step. Each phase ends in a decision you make.
- **Talk track (45 s):** "Five weeks: we answer one real question on your own data, and you get findings, a value case and a clear go or stop. Six months: one role's process runs live, end to end, measured against the baseline. Then scale: new roles and processes reuse what the first one built."
- **Ask for:** a role owner, a process expert and read access to representative records (the strip under the phases). Effort per week and pricing follow the five-week scope; give them separately.
- **Deep dives:** S1 (the five-week qualification), S2 (the six months live).

### 13 The approach has been applied before

- **Remember:** experience of the delivery team, not of the product.
- **Public edition:** three areas of experience, without client details. If asked for names or figures: "We share client examples separately, with their permission."
- **Deep dive:** S5 (how to bring this in).

### 14 Which role, decision and process do we start with?

- **Remember:** agree four things today: the target role, the decision or process, representative data and cases, and the proof criteria at five weeks and six months. Each card says what a good answer looks like and shows an example answer (third-party risk manager, annual review of critical suppliers, last year's files for 20 suppliers, review time and evidence completeness). Ask the room for their own answers.
- **Secondary question:** which existing AI, workflow, GRC and data capabilities the Workspace should reuse rather than rebuild.
- **Deep dive:** V1 (where to start).

## Close

> "The first step is not the universal NFR platform. It is one role, one decision and one process you can measure, with the evidence that earns the next wave."

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
- **Why five weeks, then six months?** Five weeks qualifies one question against your data and fixes the scope at a gate; six months proves one complete process, live (S1, S2).

- **What does it cost, and how much of my team's time?** "The five weeks are a fixed, bounded scope; we price them with you once we have agreed the question. From your side: a role owner, a process expert and read access to representative records." Do not quote figures that have not been agreed with the delivery lead.

### IT strategist

- **What sits behind it?** The Workspace, a runtime gateway, approved execution services, the authoritative systems (D1).
- **Does it depend on a specific agent runtime or asset?** No. Execution sits behind a stable gateway contract; existing assets are candidates, validated before any commitment.
- **How is model risk assessed?** Step by step: each method has a defined input, output and error rate, so it can be tested and challenged on its own (M2, M5).
- **How do facts become charts?** Governed data services calculate; a validated insight schema chooses the chart; the model helps interpret (D8).
- **Does it widen access?** No. Identity flows to every query and action; results are filtered before the model and the screen (D9).
- **Do we need a knowledge graph?** Only for relationship and impact questions, built one journey at a time (D5 to D7).
- **Who runs it?** A named product owner, with process, control, data and platform owners and independent oversight (S4).

## Comprehension check

After one pass, a first-time viewer should be able to explain: why work arrives as a question; why the chain drifts; why a standalone assistant sees only a slice of the answer; Ask, Use, Run and Create; the three layers; why small methods and not one large model; where professional authority remains; what the five weeks and the six months prove. Ask a business colleague and a technology colleague who did not build the deck, before explaining anything.
