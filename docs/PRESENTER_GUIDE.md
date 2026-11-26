# NFR Workspace: presenter guide (v7, merged proposition)

A 30-minute conversation for two buyers: the NFR business owner first, the IT strategist second. v7 merges the earlier control-platform proposition into one story: **NFR Workspace**. The deck tells it in fourteen screens in four chapters; **the real NFR Workspace product is the demonstration**, shown live after screen 08. The deck carries no mock of the product. Everything on screen is synthetic and bank-neutral.

## The idea in sixty seconds (read this first)

**The idea.** Banks already have AI assistants, but each one sees a single system: the mailbox, the open file, the GRC records. An NFR question, such as which critical suppliers are deteriorating and why, needs contracts, incidents, indicators, assurance reports, controls and dependencies together, so today a professional joins them by hand. NFR Workspace connects the content of every system for each NFR role, prepares the answer in small steps that can be tested, and leaves the decision with a named person.

**The positioning.** The future of NFR, coordinated: one Workspace that coordinates your people, your systems and your AI where it matters, under one set of controls.

**The storyline.** Three chapters, each opened by a divider. Today's problem (01 to 04): why NFR work outgrows standalone AI, and what one supplier change costs today. The answer (05 to 07): how the information flows, how four ways of working leave no gap, and how it grows team by team. The Workspace (08, 09, then the product): how each person's profile comes from your identity system and decides what they see, then the product itself. The core story ends there. After the product: the buyer's questions, answered from the appendix, and the ask.

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
| 04 | A supplier changes, your records do not | "Novalink moves its hosting to Basalt Cloud. Four records still say green; the notice sat in a mailbox from day 12; an outage shows it on day 110. With the Workspace: flagged on day 12." | Space |
| 05 | How it flows, per role, at three depths | "Light: what they see. Medium: where it comes from. Deep: how each button runs, defined once, stored with versions, written back once approved." | Space (Medium, then Deep); click a role or a button |
| 06 | Four ways, no gap | "Each way is strong where another stops. Together, no question falls through." | Space |
| 07 | Set up once, grow by module | "Pilots do not scale. Set up once with the third-party risk team in six months, then add a team at a time, in-house or managed." | Space |
| 08 | One profile per person | "Your identity system sets each profile, in six levels down to a single field. Maya and Ben share a role, not a scope: different suppliers, different screen." | Space (next person) or click a person |
| 09 | The product itself | Live product: press L. No product on your laptop: press F for the walkthrough | L or F |
| Demo | Five acts, at least act 3 | "No single assistant could answer this: 15 evidence items from six registers." | Space |
| After | Questions, then the ask | Open the appendix page the buyer asks about (A, then the domain). Close with the ask: one role, one decision, one process to measure. | A, 1 to 4 |

Also useful: A (appendix index), 1 to 4 (appendix domains), M (back to the story), 0 (back to the cover), S (safe mode on a slow laptop).

**Dividers.** Each chapter opens with a divider: say its one line and press Space. Today's problem: "Why NFR questions outgrow the tools banks use today." The answer: "How a connected AI workflow resolves these issues", then read its three pairs, each problem from chapter 1 with its answer. The Workspace: "Each person gets their own Workspace. Then we open it."

**Two rules.** The core story ends with the product: after it, go to the appendix (Space from the last capture, or A) and answer questions page by page; do not walk the appendix in order. If the live product is not on your laptop, the walkthrough (F) is the demonstration; present it with confidence, it is the same product captured on the same records.

## Two editions

| Edition | Built with | Where it runs | Contents |
|---|---|---|---|
| Public | `npm run build:public` (also what GitHub Pages publishes) | The Pages site, or `npm run serve:public` on port 8190 | Fourteen screens, 28 appendix pages, the product walkthrough. No client details, no credentials, no commercial terms, no internal asset names |
| Internal | `npm run build:internal` (needs the git-ignored `internal/` folder) | Locally only: `npm run serve:internal` on port 8191 | The public edition plus internal pages and an edition badge. Never shared by link; see `internal/README.local.md` |

Use the public edition with clients unless every internal page you plan to show has passed its claim review.

## Timeboxes

| Minutes | Chapter | Screens |
|---|---|---|
| 0 to 6 | Today's problem: how the work arrives, what no assistant sees, a supplier change the records miss | 01 to 04 |
| 6 to 11 | The answer: how the information flows, four ways that leave no gap, set up once and grow by module | 05 to 07 |
| 11 to 13 | Profiles and access, then the doorway | 08, 09 |
| 13 to 21 | The live product, five acts | the product |
| 21 to 30 | Questions from the appendix, then the ask | appendix by question |

**Twenty-minute route:** 01, 02, 03, 04, 05 (Light and Medium; Deep only for architects), 06, 08 (Maya and Ben), 09 and the product, then the ask. Screen 07 has an appendix page (S3) to open if a buyer asks.

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
| Click a person on screen 08 | Show that person's profile and screen; the levels that changed are marked. Space steps to the next person |
| W | Go to Enter NFR Workspace (screen 09) |
| L | Open the live product (`http://localhost:3200/`; add `?live=<url>` to the deck address to change it) |
| F | The five acts, captured from the product |
| A | Appendix index |
| 1, 2, 3, 4 | Appendix domain: Data & Systems; Control & Assurance; Value & Economics; Delivery & Operating Model |
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

## Chapter 1: today's problem

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
- **IT strategist asks:** "Does that mean one big data lake?" **Answer:** "No. The Workspace reads through approved connections under the user's own access (D2, D6)."

### 04 A supplier changes. Your records do not.

- **Remember:** a third-party risk example, in two columns. One change at a critical supplier, and four records that still say what was true before. The information arrived on day 12, in a shared mailbox, but nothing joined it to the records; today the bank finds out in an outage, 98 days later.
- **Visual:** the change first: Novalink moves its hosting to Basalt Cloud. Then four records, each in its own system: on the left what the record says, all green; on the right, row by row, what is true now. Then one timeline: the notice on day 12, the outage on day 110, and the same change with NFR Workspace, flagged on day 12.
- **Talk track (60 s):** "One ordinary change at a critical supplier. Novalink moves its hosting to Basalt Cloud, a subcontractor. Look at your records. The contract says Novalink hosts the service itself. Due diligence passed in March, with no subcontractors. The risk rating is medium. The exit plan is tested and current. All green. What is true now: the hosting is subcontracted; Basalt Cloud has not been assessed; two critical services now sit on one provider; and the exit plan assumes hosting that no longer exists. Novalink did tell you, on day 12, in a notice to a shared mailbox. Nobody joined it to the contract, the rating or the exit plan. Today you find out on day 110, when an outage takes two critical services down at once. With the Workspace, the notice is read on day 12, joined to the records, and the rating is flagged for the owner."
- **If asked "is this realistic?":** "Subcontracting changes are among the most common third-party changes, and the notice usually arrives by email. The example is illustrative, on synthetic records; the pattern is the point: a record changes when someone updates it, not when the supplier changes."
- **If asked "what about regulation?":** "A change like this also leaves the register of subcontractors incomplete, which supervisors now ask for. The same flag covers it."
- **Deep dive:** D4 (the connected NFR core).

## Chapter 2: the answer

### 05 From question to answer: how the information flows

- **Remember:** one question, at the depth the room wants. Light is what the person sees. Medium is where it comes from. Deep is how it runs: each button is defined once, with what it reads, calculates, stores and writes back. That is how the system knows which systems a button needs, and why it is more than AI: compute, storage with versions and write-back are layers of their own.
- **Action:** the screen opens at Light on the third-party risk manager, with the question from screen 03. Space unfolds Medium, then Deep, then moves on. Click a role card to switch roles at the same depth; click Light, Medium or Deep, or a folded layer, to fold in or out; click a button on the screen to light up its route. For a business audience stop at Medium; for architects go to Deep and click **Request evidence**.
- **Visual, top to bottom:** on the screen, the answer, its picture and three buttons (a view, an explanation, an action); Route (Deep), the button's definition, such as TP-DET v3: how many systems it reads, its calculation, whether AI explains or drafts, where it writes; Read (Medium), each of the eight systems with the person's access (green full, amber partial, pink no access; lightning for a live query, a box for the dated cache), with the button's systems lit; Connect, the knowledge graph's links; Compute, rules with no model, then AI through the approved model, each claim cited and each call logged; Store (Deep), the answer kept with the version of every record it used, the dated index and the audit log; Write back (Deep), the system the action writes to, and the person who approves first.
- **Talk track (90 s):** "Light: this is what the third-party risk manager sees. The question, the answer, three buttons. [Space] Medium: where it comes from. Each system checks their access before anything comes back; five are read live, three from a cached index with dates; the knowledge graph links eleven services to Basalt Cloud; rules calculate, and AI explains. [Space] Deep: how it runs. The system does not guess which systems to call. Each button is defined once: Deteriorating services reads six systems and runs the deterioration score, and writes nothing. [Click Request evidence.] This one reads three, AI drafts the request, and it writes to vendor management, only after you approve every field. Every answer is kept with the version of each record it used, and the audit log keeps who asked, what was read and what was shown. A new question has no definition yet: AI plans it, using only the connectors this person may use. [Click Control owner.] Same layers: five systems, own records only, and the attestation is signed by them."
- **Business owner asks:** "Can my team see what the Head of NFR sees?" **Answer:** "Only if their role allows it. Access comes from your existing systems and roles; the Workspace grants none of its own."
- **IT strategist asks:** "How does a button know which systems to call?" **Answer:** "Each button is a versioned definition: its sources, its calculation, its AI step and where it writes. It is reviewed like a method. Access is still checked per system, per user, when it runs. A new question is planned by AI from the approved connectors only, and becomes a definition once it is reviewed (D3, D5)."
- **IT strategist asks:** "Where is access enforced, and what is cached?" **Answer:** "In each source system, with the user's own identity, before anything reaches the AI. Structured records are queried live; documents and mail are indexed on change and carry their date and source; the graph holds relationships with provenance. Read and write are separate permissions, and a write goes through the target system's own rules (D2, D3, D4, D6)."
- **Be precise:** the third-party risk manager and the operational risk partner are roles in the product today, and their cards say so. The Head of NFR and control owner views are target design, also marked on their cards. The layers and the button definitions (such as TP-DET v3) are the target design, shown on synthetic records; appendix D5 has the full pipeline.
- **Deep dives:** D3 (what travels with a question), D6 (access and audit).

### 06 Four ways of working. Together, no question falls through.

- **Remember:** the four ways fill a grid: how standard the work is (a new question or a standard task) against how often it comes (once, or again and again). Each is strong where another stops, so together nothing falls through. The labels are the product's own menu names.
- **Visual:** four gaps first, each naming a kind of work; then each way fills its gap, with what it is strong at and where it stops.
- **Talk track (60 s):** "A one-off question: Ask. Answered now, with its sources, but it is not repeatable. A standard task, one case at a time: Use, an app with the approved method and sign-off. The same steps across many cases: Run. The routine runs on its own and the exceptions come to people; it needs a stable process. A new question that keeps coming back: Create, your own agent, starting constrained and reviewed before it is shared. Where one stops, the next takes over: a repeated question becomes an app, a repeated task a process, a new question an agent. All on the same identity, permissions, evidence and control record."

### 07 From AI pilots to a Workspace that grows by module

- **Remember:** left, how most banks start with AI today; right, how the Workspace starts and grows. Set up once, with one team live in six months, then one team at a time on the same core. Run it in-house or managed.
- **Talk track (75 s):** "Most banks start like this: each person uses AI their own way, AI helps one step while the handoffs stay manual, and every pilot copies its own data. Pilots that do not scale, share or prove control. With the Workspace you set up once: identity and access, approved connectors, the connected core, controls and audit. In the first six months one team goes live, for example third-party risk: define the role, cases and gates; build and test on your records; operate live and measure. Then the next group, the operational risk partners, on the same core, and it goes live faster because the foundation is reused. Then further teams, one at a time. And you choose who runs it: in-house after enablement, managed by Accenture, or start managed and move in-house."
- **Deep dive:** S3 (what is reused).

## Chapter 3: the Workspace

### 08 One profile per person: their screen, data and actions.

- **Remember:** each person's profile comes from the bank's identity system, not from the Workspace. It has six levels, coarse to fine: role, scope, records, fields, actions and delegation. The profile decides the person's screen: the menu, today's queue, what is in view and what is masked. The data knows where it belongs because every record carries tags from its source.
- **Visual, left to right:** what comes from the identity system (sign-in, the HR record, the access groups; joiners, movers and leavers follow HR the same day); the profile, level by level, each with where it comes from; their screen. Under it: tagged at the source, mapped once, inherited by new records, checked at every read.
- **Action:** the screen opens on Maya, a third-party risk manager in retail banking. Space shows Ben, then Sara, then Tom, then moves on; click a person to jump. The levels that changed from the person before are marked. Show at least Maya, then Ben: same role, different scope.
- **Talk track (75 s):** "How does each person get their own Workspace? Not by setting it up in the Workspace. Maya signs in with your single sign-on. The HR record says retail banking, main entity. The access groups say third-party risk manager, approving up to tier 2. From that, the profile builds itself in six levels: the role; the scope, retail banking; the records, the 38 retail suppliers of 214; the fields, personal data masked; the actions, request evidence and approve up to tier 2; and while Ben is away, Maya covers that queue, for those two weeks only. That profile is the screen Maya sees: the menu, the queue, the suppliers. [Space] Ben has the same role, in wealth management. Only three levels change: the scope, 22 suppliers instead of 38, and no delegation. Different suppliers, different screen, same rules. [Click Tom.] A control owner in procurement: six own controls, bank details masked, and no processes or agents on the menu. And how does the Workspace know which data is whose? Every record carries its tags from the source: unit, entity, supplier, risk type, sensitivity. Each system is mapped to those tags once; new records inherit them; and every read checks the role, the scope and the tags before anything is shown."
- **Business owner asks:** "How granular can roles get?" **Answer:** "Six levels: role, scope, records, fields, actions and delegation. Two people with the same role can see different suppliers, and one person can see a record but not one of its fields."
- **Business owner asks:** "Who maintains all this?" **Answer:** "Your identity and HR processes, as today. The Workspace maps your groups to its roles once; a mover changes the profile the same day; a leaver loses access at the source, so nothing is left behind in the Workspace. Access reviews stay in your own process."
- **IT strategist asks:** "Is this role-based or attribute-based?" **Answer:** "Both: the role comes from the access group, the scope and fields from attributes and tags. Each source system still checks its own entitlements at every read, with the user's own identity (D6, D2)."
- **Be precise:** the profile levels, the data tags and the delegation are the target design, shown with synthetic people; the product today has the third-party risk manager and operational risk partner roles.
- **Deep dives:** D6 (entitlements, provenance and audit), D2 (how the systems connect).

### Transition into the product

> "The simplest way to see the difference is to open the working day of a third-party risk manager with a profile like Maya's. It does not start with a blank chat. It starts with the next decision."

### 09 Enter NFR Workspace (the doorway)

- **Remember:** the live product is the evidence; this screen is only the doorway, and the last screen of the core story.
- **Action:** arrive on the screen (or press W). It resolves the role and permissions, the profile from screen 08, loads the current decisions, connects the approved applications and shows **Open live Workspace (L)**. Press L or click it, or switch to the product tab.
- **If the product is unavailable:** press F for the five acts captured from the product. Say: "Here is the same working day, captured from the product." Do not apologise for the technology.

### Live demonstration: five acts (in the product)

Follow the product's guide (`docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in `nfr-workos`). Synthetic institution: Arcadia Bank AG. Six to eight minutes in all.

| Act | Takeaway | If asked how |
|---|---|---|
| 1 The Workspace feels real | The user does not start with a blank chatbot | D1 |
| 2 The next decision arrives prepared | The case, the evidence and the action arrive together | D3, M3 |
| 3 A live question, a visual answer | The question from screen 03, answered. Say: "No single assistant could answer this: the answer drew on 15 evidence items from six registers." Not prose: a governed analysis from connected records; no number came from a model | D5, D4 |
| 4 From insight to action | The professional approves; the system records | M4, D6 |
| 5 The long tail, governed | Agents cover the long tail without bypassing controls | M3 |

**Return to the deck:** switch to the deck tab, still on screen 09, and press Space. The deck goes to the appendix index, where the questions begin. From the product walkthrough, Space at the last capture does the same.

### Recovery during the live demonstration

| Situation | What to do |
|---|---|
| A screen is slow | Keep talking about what it will show; a second click usually lands |
| The expected state is missing | Reset the demonstration from the account menu, or switch to the deck and press F for that act |
| The product will not start | Press F in the deck and walk the five acts from the captures; or play the product's recording |
| The day shows earlier work | Account menu, **Reset demonstration**, then **Confirm reset** |
| The network is blocked | The product and the deck both run locally; nothing needs the internet after the first load |

## After the demonstration: questions, then the ask

The core story ends with the product. Switch back to the deck and press Space: the appendix index opens. Answer what the room asks, one page at a time:

| If they ask | Open |
|---|---|
| Who did what in that answer? | M1 (why small methods), D5 (how a question becomes a visual answer) |
| What does one change touch? | D4 (the connected NFR core) |
| When does a person step in? | M3 (AI, rules and people), M4 (governed write-back) |
| What is the value, and how is it measured? | V2 (where value comes from), V3 (unit economics) |
| How do we start, and how long does it take? | V1 (where to start), S1 (the five weeks), S2 (the six months live) |
| How do we bring it in, and who runs it? | S5 (ways to bring it in), S4 (who owns and operates it); internal edition: S8, the indicative commercial models |

**The ask.** Agree four things: the target role, the decision or process, representative data and cases, and the proof criteria at five weeks and six months. For example: the third-party risk manager, the annual review of critical suppliers, last year's files for 20 suppliers, review time and evidence completeness. What we need from you: a role owner, a process expert and read access to representative records. Effort per week and pricing follow the five-week scope; give them separately.

## Close

> "The first step is not the universal NFR platform. It is one role, one decision and one process you can measure, with the evidence that earns the next wave."

---

## Appendix: four domains

Sorted in the order buyers ask after the product: how it works, whether it is safe, whether it is worth it, and how to start. Each page answers one question, shows one main visual, states the decision implication and its claim status, and has Index (A), Previous, Next and Main story (M). Escape goes back one level.

| Domain | Key |
|---|---|
| Data & Systems (D1 to D6) | 1 |
| Control & Assurance (M1 to M4) | 2 |
| Value & Economics (V1 to V3) | 3 |
| Delivery & Operating Model (S1 to S5) | 4 |

| Buyer question | Page | Key |
|---|---|---|
| What sits between the experience and the systems? | D1 | 1 |
| How do the systems connect? | D2 |  |
| What context travels through the Workspace? | D3 |  |
| What is the connected NFR core? | D4 |  |
| How does a question become a visual answer? | D5 |  |
| How are entitlements, provenance and audit kept? | D6 |  |
| Why small methods, not one large model? | M1 | 2 |
| How are methods evaluated and assured? | M2 |  |
| What belongs to AI, rules and people? | M3 |  |
| How does governed write-back work? | M4 |  |
| Where should we start? | V1 | 3 |
| Where does value come from? | V2 |  |
| What are the unit economics? | V3 (interactive) |  |
| What happens in the five-week qualification? | S1 | 4 |
| What happens in the six months live? | S2 |  |
| What is reusable, and what is journey-specific? | S3 |  |
| Who owns and operates it? | S4 |  |
| How can we bring this in? | S5 |  |

Also from the index: the captured live demonstration and the team page. The internal edition adds pages for internal use; see `internal/README.local.md` on the presenter machine.

## Buyer questions

### NFR business owner

- **Is this another chatbot?** No. Chat is one interaction mode. The Workspace also holds the role, case, evidence, applications, controls, decisions and recorded outcomes. You saw it start from Today, not from a chat box.
- **Are you replacing our GRC platform?** No. The authoritative systems stay in place (D1). The Workspace prepares and coordinates work across them and writes back only through approved controls (M4).
- **Which of our requests could it answer?** Some need only deterministic methods, some need a narrow model call checked against the source, and some are not yet scoped. The five-week qualification sorts them (V1, S1).
- **Can the agent change risk records?** Material changes follow a proposed action, a permission check, human approval, a governed connector and an audit receipt (act 4, M4).
- **How do we prevent uncontrolled personal agents?** Personal agents inherit existing access and begin constrained; scheduling, publication, write-back and standardisation need stronger review (M3).
- **What is the business case?** Built per case from the client baseline: capacity returned, operating benefit, run cost and payback (V3). Waiting time is not converted into headcount.
- **Why five weeks, then six months?** Five weeks qualifies one question against your data and fixes the scope at a gate; six months proves one complete process, live (S1, S2).

- **What does it cost, and how much of my team's time?** "The five weeks are a fixed, bounded scope; we price them with you once we have agreed the question. From your side: a role owner, a process expert and read access to representative records." Do not quote figures that have not been agreed with the delivery lead.
- **Why not build it ourselves, on our GRC platform and a model?** "You can get a first version quickly. But getting most outputs right is not automating most of the work: if people still check every output, nothing is saved. The effort is in the last stretch: the connections across systems, the method, the exceptions and the testing that lets you stop checking everything. That is what the five weeks proves on your data."

### IT strategist

- **What sits behind it?** The Workspace, a runtime gateway, approved execution services, the authoritative systems (D1).
- **Does it depend on a specific agent runtime or asset?** No. Execution sits behind a stable gateway contract; existing assets are candidates, validated before any commitment.
- **How is model risk assessed?** Step by step: each method has a defined input, output and error rate, so it can be tested and challenged on its own (M1, M2).
- **How do facts become charts?** Governed data services calculate; a validated insight schema chooses the chart; the model helps interpret (D5).
- **Does it widen access?** No. Identity flows to every query and action; results are filtered before the model and the screen (D6).
- **Do we need a knowledge graph?** Only for relationship and impact questions, built one journey at a time (D4).
- **Who runs it?** A named product owner, with process, control, data and platform owners and independent oversight (S4).

## Comprehension check

After one pass, a first-time viewer should be able to explain: why work arrives as a question; why a standalone assistant sees only a slice of the answer; why one change breaks the chain while the record stays green; how one button finds its systems; Ask, Use, Run and Create; the three layers; why small methods and not one large model; where professional authority remains; what the five weeks and the six months prove. Ask a business colleague and a technology colleague who did not build the deck, before explaining anything.
