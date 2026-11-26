# NFR Workspace: presenter guide (v7, merged proposition)

A 30-minute conversation for two buyers: the NFR business owner first, the IT strategist second. v7 merges the earlier control-platform proposition into one story: **NFR Workspace**. The deck tells it in fourteen screens in four chapters; **the real NFR Workspace product is the demonstration**, shown live after screen 08. The deck carries no mock of the product. Everything on screen is synthetic and bank-neutral.

## The idea in sixty seconds (read this first)

**The idea.** Banks already have AI assistants, but each one sees a single system: the mailbox, the open file, the GRC records. An NFR question, such as which critical suppliers are deteriorating and why, needs contracts, incidents, indicators, assurance reports, controls and dependencies together, so today a professional joins them by hand. NFR Workspace connects the content of every system for each NFR role, prepares the answer in small steps that can be tested, and leaves the decision with a named person.

**The positioning.** The future of NFR, coordinated: one Workspace that coordinates your people, your systems and your AI where it matters, under one set of controls.

**The storyline.** The shift (01 to 04): why NFR work outgrows standalone AI, and what one change costs today. The model (05 to 07): how the information flows, how four ways of working leave no gap, and how it grows team by team. The Workspace (the product, then 09 to 11): who did what in the answer, how one change reaches every owner, and when a person must step in. The path (12 to 14): value measured gate by gate, how to bring it in, and what we agree today.

**Where the value sits.** The systems record the outcome; the work, and the exceptions that matter, happen in emails, spreadsheets and meetings around them. NFR Workspace runs the routine and brings each exception to a person with its context.

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
| 01 | The future of NFR, coordinated | "One Workspace coordinates your people, systems and AI where it matters. AI prepares, your people decide, every step on record." | Space |
| 02 | Every question cuts across five levels | "Who asks, what, where the data lives, who helps, and how. Four questions: six askers, eight systems, five teams, four methods." | Space |
| 03 | Standalone AI sees three of eight | "Red is what no assistant sees. The answer needs all eight: the 360 view." | Space |
| 04 | One change, and the record stays green | "One move to a new tool. Every link breaks, every record still says green, for 97 days. With the Workspace: flagged the same day." | Space |
| 05 | How it flows, per role, at three depths | "Light: what they see. Medium: where it comes from. Deep: how each button runs, defined once, stored with versions, written back once approved." | Space (Medium, then Deep); click a role or a button |
| 06 | Four ways, no gap | "Each way is strong where another stops. Together, no question falls through." | Space |
| 07 | Set up once, grow by module | "Pilots do not scale. Set up once with the third-party risk team in six months, then add a team at a time, in-house or managed." | Space |
| 08 | The product itself | Live product: press L. No product on your laptop: press F for the walkthrough | L or F |
| Demo | Five acts, at least act 3 | "No single assistant could answer this: 15 evidence items from six registers." | Space |
| 09 | Four kinds of agent | "Retrieval found it, process calculated it, policy judged it, and the manager decided. The more judgement, the closer the person." | Space |
| 10 | Every owner told | "One failed test: four records found, four owners told, the same day, before anyone signs." | Space |
| 11 | Thresholds decide who looks | "Your risk owners set the thresholds. Routine work earns automation; material judgement stays with a person." | Space |
| 12 | Value, gate by gate | "Insight and speed, baselined on your data. Each gate opens on evidence and lets the next team in." | Space |
| 13 | Three ways to bring it in | "Start managed, move in-house when ready. The commercial model is agreed with you." | Space |
| 14 | What we agree today | "Role, process, data, proof criteria. Here is an example answer for each." | |

Also useful: A (appendix index), 1 to 4 (appendix domains), M (back to the story), 0 (back to the cover), S (safe mode on a slow laptop).

**Two rules.** Show at least act 3 of the demonstration before screen 09: screen 09 replays that answer. If the live product is not on your laptop, the walkthrough (F) is the demonstration; present it with confidence, it is the same product captured on the same records.

## Two editions

| Edition | Built with | Where it runs | Contents |
|---|---|---|---|
| Public | `npm run build:public` (also what GitHub Pages publishes) | The Pages site, or `npm run serve:public` on port 8190 | Fourteen screens, 28 appendix pages, the product walkthrough. No client details, no credentials, no commercial terms, no internal asset names |
| Internal | `npm run build:internal` (needs the git-ignored `internal/` folder) | Locally only: `npm run serve:internal` on port 8191 | The public edition plus internal pages and an edition badge. Never shared by link; see `internal/README.local.md` |

Use the public edition with clients unless every internal page you plan to show has passed its claim review.

## Timeboxes

| Minutes | Chapter | Screens |
|---|---|---|
| 0 to 6 | The shift: how the work arrives, assistant and Workspace, one change that breaks the chain | 01 to 04 |
| 6 to 10 | The model: how the information flows, four ways that leave no gap, set up once and grow by module | 05 to 07 |
| 10 to 17 | The live product, five acts | 08, then the product |
| 17 to 21 | What happened beneath it: the plan, the connected context, the authority boundary | 09 to 11 |
| 21 to 26 | Value measured gate by gate; three ways to bring it in | 12, 13 |
| 26 to 30 | The workshop decision, appendix pages by question | 14 |

**Twenty-minute route:** 01, 02, 03, 04, 05 (Light and Medium; Deep only for architects), 06, 08 and the product, 09, 11, 12, 14. Screens 07, 10 and 13 each have an appendix page to open if a buyer asks.

Do not try to show every appendix domain. Open one page when a buyer asks.

## Before the meeting

### The day before

0. Get the access code for the deck from its owner. It is not written in this guide or the repository, which is public. Without the live product on your laptop, skip step 1 and present the walkthrough (F) at screen 08.
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
| Space | Advance the scene; at its end, the next screen. On screen 05, the next depth: Medium, then Deep |
| Click a role card | On screen 05, show that role at once, at the same depth |
| Click Light, Medium or Deep, or a folded layer | On screen 05, fold the layers in or out |
| Click a button on screen 05 | Light up what that button reads, calculates, stores and writes back |
| W | Go to Enter NFR Workspace (screen 08) |
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

### 01 The future of NFR, coordinated

- **Remember:** this is the future way of working in NFR: one Workspace that coordinates the bank's people, systems and AI where it matters, with the decision left to a person.
- **Talk track (40 s):** "This is how NFR will work: coordinated. One Workspace for your people, from the Head of NFR to each control owner. Connected to your systems, within each user's own access. And one place for all your AI work: asking, using, running and creating, under one set of controls. On the right is the real product's Today screen for a third-party risk manager. You will use it in about ten minutes."
- **If asked "is this real?":** "Yes, it runs on this laptop on synthetic records."

### 02 Every NFR question cuts across roles, systems and teams

- **Remember:** the complexity is in the levels, not in any single question. Who asks, what they ask, where the answer lives, who has to help, and how it is worked out.
- **Visual:** five rows. The screen steps through the four questions and lights what each one needs; let it run once. Click a question card to show its links again.
- **Talk track (60 s):** "Read it top down. Six people or bodies ask: the board risk committee, the COO, the regulatory change forum, internal audit, the supervisor, procurement. Four everyday questions. Each one pulls in different systems: the COO's question needs the GRC platform and the policy library; procurement's needs vendor management, incidents, the service inventory and documents. Each needs different people to help, and each is worked out a different way: mapping, a gap analysis, testing, a trend. Four questions, six askers, eight systems, five teams, four methods. And look where the work happens: the record shows the outcome, but the work, and the exceptions that matter, sit in emails, spreadsheets and meetings around it."
- **Ask the room:** "Which of these did you get this month?"
- **Deep dive:** V1 (where to start; its detail lists the nine kinds of request risk functions bring).

### 03 Standalone AI sees one system. NFR needs the whole picture.

- **Remember:** this is the key screen of the first chapter. Each assistant sees one system; the NFR answer needs all eight. Red marks the systems missing from every assistant.
- **Visual:** the question types itself out first. The eight sources appear grey; the three that an assistant sees turn purple; then the five missing ones turn red, one by one, each marked Missing. The bars at the bottom count it: standalone AI sees three of eight, NFR Workspace fills to eight of eight, the 360 view. Let it finish before the last sentence.
- **Talk track (60 s):** "Take one question: which critical third-party services are deteriorating, and why? The answer needs eight things, and each lives in its own system: the third-party register, contracts and SLAs, incidents, risk indicators, supplier mail, assurance reports, controls and issues, service dependencies. The email assistant sees the mailbox. The document assistant sees the open file. The GRC assistant sees the GRC records. The chat assistant sees what you paste in. The five in red: no assistant sees them, so the professional joins them by hand, for every question. Standalone AI gets three of eight. The answer needs eight of eight: the 360 view, which NFR Workspace brings together within the user's own access. And these systems do not stand still. Next, what one change does."
- **Business owner asks:** "So our assistant rollout was wasted?" **Answer:** "No. Each assistant helps with its own slice. The Workspace joins the slices."
- **IT strategist asks:** "Does that mean one big data lake?" **Answer:** "No. The Workspace reads through approved connections under the user's own access (D2, D9)."

### 04 One change breaks the chain. The record stays green.

- **Remember:** why it matters, in one change. The record shows the outcome, not the change: every link still says green while the control no longer works, for 97 days, until audit finds it. Change from outside, such as a new rule like DORA, does the same from the top of the chain.
- **Visual:** the chain first, every record green. The change lands on the control; the break travels both ways, link by link, and each link shows what is really happening while its record still says green. Then the timeline: what the record says, what is happening, the 97 days between them, and the same change with NFR Workspace, flagged the same day and fixed before the sign-off. Then why it matters: exposure, accountability, cost.
- **Talk track (60 s):** "One ordinary change. Procurement moves supplier onboarding to a new sourcing tool, and the access review still runs on the old tool's list. Follow it. The control, CTL-0417, still says effective. The review log is on file, but misses nine new accounts. The self-assessment rates the control effective, on that log. The Q3 attestation is signed, on old evidence. Upstream, the risk says covered and the obligation says met. Every record is green, and none of it is true, for 97 days, until audit finds it. Why it matters: nine supplier accounts with access nobody reviewed, a Head of Procurement who signed on old evidence, and a finding, then the chain re-mapped by hand. With the Workspace the same change is flagged the same day, because the evidence is read at the source; screen 10 shows how. From outside it works the same way: a new rule such as DORA moves the chain from the top."
- **If asked "is this internal or external change?":** "This one is internal, the most common kind. External change, such as a new rule, enters at the top of the chain: the same breaks, the same green records."
- **If asked "are the 97 days real?":** "It is an illustrative example on synthetic records. The pattern is the point: a record changes when someone updates it, not when reality changes."
- **Deep dive:** D4 (the connected NFR core).

## Chapter 2: the model

### 05 From question to answer: how the information flows

- **Remember:** one question, at the depth the room wants. Light is what the person sees. Medium is where it comes from. Deep is how it runs: each button is defined once, with what it reads, calculates, stores and writes back. That is how the system knows which systems a button needs, and why it is more than AI: compute, storage with versions and write-back are layers of their own.
- **Action:** the screen opens at Light on the third-party risk manager, with the question from screen 03. Space unfolds Medium, then Deep, then moves on. Click a role card to switch roles at the same depth; click Light, Medium or Deep, or a folded layer, to fold in or out; click a button on the screen to light up its route. For a business audience stop at Medium; for architects go to Deep and click **Request evidence**.
- **Visual, top to bottom:** on the screen, the answer, its picture and three buttons (a view, an explanation, an action); Route (Deep), the button's definition, such as TP-DET v3: how many systems it reads, its calculation, whether AI explains or drafts, where it writes; Read (Medium), each of the eight systems with the person's access (green full, amber partial, pink no access; lightning for a live query, a box for the dated cache), with the button's systems lit; Connect, the knowledge graph's links; Compute, rules with no model, then AI through the approved model, each claim cited and each call logged; Store (Deep), the answer kept with the version of every record it used, the dated index and the audit log; Write back (Deep), the system the action writes to, and the person who approves first.
- **Talk track (90 s):** "Light: this is what the third-party risk manager sees. The question, the answer, three buttons. [Space] Medium: where it comes from. Each system checks their access before anything comes back; five are read live, three from a cached index with dates; the knowledge graph links eleven services to Basalt Cloud; rules calculate, and AI explains. [Space] Deep: how it runs. The system does not guess which systems to call. Each button is defined once: Deteriorating services reads six systems and runs the deterioration score, and writes nothing. [Click Request evidence.] This one reads three, AI drafts the request, and it writes to vendor management, only after you approve every field. Every answer is kept with the version of each record it used, and the audit log keeps who asked, what was read and what was shown. A new question has no definition yet: AI plans it, using only the connectors this person may use. [Click Control owner.] Same layers: five systems, own records only, and the attestation is signed by them."
- **Business owner asks:** "Can my team see what the Head of NFR sees?" **Answer:** "Only if their role allows it. Access comes from your existing systems and roles; the Workspace grants none of its own."
- **IT strategist asks:** "How does a button know which systems to call?" **Answer:** "Each button is a versioned definition: its sources, its calculation, its AI step and where it writes. It is reviewed like a method. Access is still checked per system, per user, when it runs. A new question is planned by AI from the approved connectors only, and becomes a definition once it is reviewed (D3, D8)."
- **IT strategist asks:** "Where is access enforced, and what is cached?" **Answer:** "In each source system, with the user's own identity, before anything reaches the AI. Structured records are queried live; documents and mail are indexed on change and carry their date and source; the graph holds relationships with provenance. Read and write are separate permissions, and a write goes through the target system's own rules (D2, D3, D4, D9)."
- **Be precise:** the third-party risk manager and the operational risk partner are roles in the product today, and their cards say so. The Head of NFR and control owner views are target design, also marked on their cards. The layers and the button definitions (such as TP-DET v3) are the target design, shown on synthetic records; appendix D8 has the full pipeline.
- **Deep dives:** D3 (what travels with a question), D9 (access and audit).

### 06 Four ways of working. Together, no question falls through.

- **Remember:** the four ways fill a grid: how standard the work is (a new question or a standard task) against how often it comes (once, or again and again). Each is strong where another stops, so together nothing falls through. The labels are the product's own menu names.
- **Visual:** four gaps first, each naming a kind of work; then each way fills its gap, with what it is strong at and where it stops.
- **Talk track (60 s):** "A one-off question: Ask. Answered now, with its sources, but it is not repeatable. A standard task, one case at a time: Use, an app with the approved method and sign-off. The same steps across many cases: Run. The routine runs on its own and the exceptions come to people; it needs a stable process. A new question that keeps coming back: Create, your own agent, starting constrained and reviewed before it is shared. Where one stops, the next takes over: a repeated question becomes an app, a repeated task a process, a new question an agent. All on the same identity, permissions, evidence and control record."
- **Deep dive:** M1 (which capability handles which work).

### 07 From AI pilots to a Workspace that grows by module

- **Remember:** left, how most banks start with AI today; right, how the Workspace starts and grows. Set up once, with one team live in six months, then one team at a time on the same core. Run it in-house or managed.
- **Talk track (75 s):** "Most banks start like this: each person uses AI their own way, AI helps one step while the handoffs stay manual, and every pilot copies its own data. Pilots that do not scale, share or prove control. With the Workspace you set up once: identity and access, approved connectors, the connected core, controls and audit. In the first six months one team goes live, for example third-party risk: define the role, cases and gates; build and test on your records; operate live and measure. Then the next group, the operational risk partners, on the same core, and it goes live faster because the foundation is reused. Then further teams, one at a time. And you choose who runs it: in-house after enablement, managed by Accenture, or start managed and move in-house."
- **Deep dives:** S3 (what is reused), S6 (scale across the portfolio).

### Transition into the product

> "The simplest way to see the difference is to open the working day of a third-party risk manager. It does not start with a blank chat. It starts with the next decision."

## Chapter 3: the Workspace

### 08 Enter NFR Workspace (the doorway)

- **Remember:** the live product is the evidence; this screen is only the doorway.
- **Action:** arrive on the screen (or press W). It resolves the role and permissions, loads the current decisions, connects the approved applications and shows **Open live Workspace (L)**. Press L or click it, or switch to the product tab.
- **If the product is unavailable:** press F for the five acts captured from the product. Say: "Here is the same working day, captured from the product." Do not apologise for the technology.

### Live demonstration: five acts (in the product)

Follow the product's guide (`docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in `nfr-workos`). Synthetic institution: Arcadia Bank AG. Six to eight minutes in all.

| Act | Takeaway | If asked how |
|---|---|---|
| 1 The Workspace feels real | The user does not start with a blank chatbot | M1, D1 |
| 2 The next decision arrives prepared | The case, the evidence and the action arrive together | D3, M6 |
| 3 A live question, a visual answer | The question from screen 03, answered. Say: "No single assistant could answer this: the answer drew on 15 evidence items from six registers." Not prose: a governed analysis from connected records; no number came from a model | D8, D4, D5 |
| 4 From insight to action | The professional approves; the system records | M7, D9 |
| 5 The long tail, governed | Agents cover the long tail without bypassing controls | M8, M1 |

**Return to the deck:** switch to the deck tab, still on screen 08, and press Space. The deck continues to screen 09, which explains what the audience just saw. From the product walkthrough, Space at the last capture does the same.

### Recovery during the live demonstration

| Situation | What to do |
|---|---|
| A screen is slow | Keep talking about what it will show; a second click usually lands |
| The expected state is missing | Reset the demonstration from the account menu, or switch to the deck and press F for that act |
| The product will not start | Press F in the deck and walk the five acts from the captures; or play the product's recording |
| The day shows earlier work | Account menu, **Reset demonstration**, then **Confirm reset** |
| The network is blocked | The product and the deck both run locally; nothing needs the internet after the first load |

### 09 Four kinds of agent built that answer, one job each

- **Remember:** the answer the audience just saw was built by four kinds of agent, in rising order of judgement. Each has one job, its own control and its own test; the more judgement, the closer the person.
- **Talk track (60 s):** "Here is who did what in the answer you just saw. A retrieval agent found the evidence: 15 items in six registers, each with its source and date. A process agent ran the approved method: rules calculated three of eleven deteriorating, Novalink up 23; no number was guessed. A policy agent judged the change material within the policy and drafted the evidence request; a person confirmed it. And the principal level, weighing the relationship and the trade-off, laid out the next step; the manager decided. Think of it as a team of specialists, each with one job, passing the case along. A chat assistant stops at the first one."
- **If asked "will it ever decide on its own?":** "Only where your thresholds say the work is routine, as the screen after next shows. Material judgement stays with a named person."
- **Deep dives:** M2 (why small methods), D8 (how a question becomes a visual answer).

### 10 One failed test. Every record found, every owner told.

- **Remember:** this is the Workspace acting, not a problem statement. One change; the connected records show everything it touches; each owner gets their next step the same day, within their own access.
- **Talk track (45 s):** "A control test fails: the supplier access review. The connected records show the four things it touches, each in its own system. The risk owner reviews the rating, with the failed test attached. Compliance checks the obligation still holds. The operational risk partner reassesses the self-assessment that still says effective. And the quarterly sign-off is paused until it is fixed. Flagged the same day, before anyone signs, and each owner sees only their part."
- **Deep dives:** D4 (the connected NFR core), D5 (when a graph helps).

### 11 Thresholds decide who looks. Automation is earned.

- **Remember:** every case is routed by the bank's own thresholds, set by its risk owners: materiality, confidence in the evidence and policy rules. Low materiality and high confidence runs on its own, logged and sampled; higher materiality or low confidence is reviewed; material work is decided by a person. As accuracy is proven, routine work moves from review to automation; the share a person decides stays the same.
- **Talk track (75 s):** "Who decides when a person looks? Your thresholds, set by your risk owners. Chasing a missing certificate from a non-critical supplier runs on its own: logged, and a sample is checked. An evidence request to a critical supplier is reviewed before it goes. Accepting a risk, changing a rating or exiting a supplier is decided by a person; AI prepares the options and the evidence. Now over time: at go-live every output is reviewed. Once a step is proven, routine cases are sampled instead. At scale, routine runs on its own and is monitored. The amber part does not shrink: material judgement stays with a named person. The AI applies the thresholds and shows the evidence for moving them; your owners approve every change. AI prepares, professionals decide, systems record."
- **If asked "who can change a threshold?":** "Only the named owner, through the same approval and audit as any other change (M6)."
- **Deep dives:** M6 (AI, rules and people), M7 (governed write-back).

## Chapter 4: the path

### 12 Value measured from week one. Each gate opens on evidence.

- **Remember:** two lenses, each with one measure agreed in week one and baselined on the client's own cases: insight (critical suppliers with current, complete evidence) and speed (days from trigger to decision). Value then grows gate by gate, and each gate opens on evidence, not on a date; the last gate lets the next team onboard.
- **Talk track (60 s):** "Two kinds of value. Insight: exceptions caught before sign-off, the full picture on every critical supplier, every decision traceable. Speed: fewer days from trigger to decision, fewer hours of preparation, time moved from routine work to the exceptions. Each has one measure, baselined on your own cases in week one. Then the steps: by week five, first findings on your data; the go gate opens when they are confirmed and the value case is agreed. By month six one team works live, measured against the baseline; the scale gate opens when the measures are met and the controls are proven in operation. Then the next team onboards on the same core, against the same measures."
- **Ask for:** a role owner, a process expert and read access to representative records (on screen 13). Effort per week and pricing follow the five-week scope; give them separately.
- **Deep dives:** V2 (value tree), V3 (the unit-economics calculator), S1 (the five weeks), S2 (the six months live).

### 13 Three ways to bring it in. Start managed, move in-house.

- **Remember:** three ways over the same methods: a managed service (the recommended start), a sovereign cloud instance, or a full deployment on the client's infrastructure. They are designed to move: start managed, move in-house when ready.
- **Commercial models:** the public edition says they are agreed with the client and shared separately. The internal edition shows them (see the local internal notes); they are indicative, and the deal team and legal approve terms before any client sees them.
- **Talk track (45 s):** "Three ways to bring it in. Most clients start with the managed service: a bounded scope in an agreed secure environment, little technology dependency, data handling agreed up front. If data has to stay in the country, a dedicated sovereign cloud instance. If you want to run it yourselves, a full deployment on your infrastructure. Each move is planned and tested, so you can start managed and move in-house. What we need from you: a role owner, a process expert and read access to representative records."
- **Credentials:** no longer a core screen. If a buyer asks, open S5 and describe the areas of experience; client examples are shared separately, with permission (internal edition: S7, after claim review).
- **Deep dives:** S5 (ways to start), S4 (who owns and operates it).

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
- **Why not build it ourselves, on our GRC platform and a model?** "You can get a first version quickly. But getting most outputs right is not automating most of the work: if people still check every output, nothing is saved. The effort is in the last stretch: the connections across systems, the method, the exceptions and the testing that lets you stop checking everything. That is what the five weeks proves on your data."

### IT strategist

- **What sits behind it?** The Workspace, a runtime gateway, approved execution services, the authoritative systems (D1).
- **Does it depend on a specific agent runtime or asset?** No. Execution sits behind a stable gateway contract; existing assets are candidates, validated before any commitment.
- **How is model risk assessed?** Step by step: each method has a defined input, output and error rate, so it can be tested and challenged on its own (M2, M5).
- **How do facts become charts?** Governed data services calculate; a validated insight schema chooses the chart; the model helps interpret (D8).
- **Does it widen access?** No. Identity flows to every query and action; results are filtered before the model and the screen (D9).
- **Do we need a knowledge graph?** Only for relationship and impact questions, built one journey at a time (D5 to D7).
- **Who runs it?** A named product owner, with process, control, data and platform owners and independent oversight (S4).

## Comprehension check

After one pass, a first-time viewer should be able to explain: why work arrives as a question; why a standalone assistant sees only a slice of the answer; why one change breaks the chain while the record stays green; how one button finds its systems; Ask, Use, Run and Create; the three layers; why small methods and not one large model; where professional authority remains; what the five weeks and the six months prove. Ask a business colleague and a technology colleague who did not build the deck, before explaining anything.
