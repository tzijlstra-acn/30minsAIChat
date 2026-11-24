# NFR Workspace: presenter guide (v6, live product)

A 30-minute conversation for two buyers: the NFR business owner first, the IT strategist second. The deck tells the story in ten screens; **the real NFR Workspace product is the demonstration**, shown live between screens 06 and 07. The deck carries no mock of the product. Everything on screen is synthetic and bank-neutral.

The one idea the room must leave with: **most banks already have AI assistance; NFR Workspace is the step from isolated assistance to role-specific applications, governed ad hoc agents and controlled automation around real NFR work.** The principle: **AI prepares. Professionals decide. Systems record.**

The live product has its own script: `docs/NFR_WORKSPACE_PRESENTER_GUIDE.md` in the `nfr-workos` repository. It is authoritative for the five acts; this guide covers the deck, the hand-off, the return and the appendix.

## Timeboxes

| Minutes | Part | Screens |
|---|---|---|
| 0 to 7 | Problem, four ways to work, three layers | 01 to 05 |
| 7 to 15 | The live product, five acts | 06, then the product |
| 15 to 20 | The principle and the six-month route | 07, 08 |
| 20 to 24 | Value and economics | 09 (and V2 or V3 if asked) |
| 24 to 30 | The workshop decision and discussion | 10, then appendix pages by question |

Do not try to show every appendix module. Open one door when a buyer asks.

## Before the meeting

### The day before

1. Start the standalone product with `Launch NFROS.cmd` (port 3200), not a development server. Confirm it reports ready and that the first question answers.
2. Rehearse the five acts once, including the write-back; then reset the demonstration so the meeting starts on a clean day.
3. Regenerate and check the fallbacks: the captured acts in the deck (key F), the product's screen recording, and the PDF of the deck (`npm run fallback`, then copy `artifacts/fallback/NFR-Workspace-<release>.pdf` to the desktop).
4. Keep a local clone of this repository, so the deck also runs from `npm run serve` without the internet.

### Thirty minutes before

| Check | How |
|---|---|
| Browser | A dedicated window or profile, notifications off, password-manager pop-ups off, no personal bookmarks or account details visible |
| Two tabs | Tab 1: the deck, signed in through the access page, on the cover. Tab 2: the product on `http://localhost:3200`, reset, signed out at the sign-in screen |
| Readiness | The product's readiness check reports ready; the first question has been asked once after the reset (it is pre-warmed by the launcher) and the demo reset again |
| Zoom and resolution | Browser zoom at 100 percent on both tabs; test the shared screen at the real resolution (1366 x 768 and up) |
| Screen sharing | Share the browser window (both tabs are in it), not a single tab |
| Deck | Press `0`: everything returns to the cover. If the laptop is slow, press `S` for safe mode |
| Clicker | Page Down and Page Up move between screens |

## Keys (deck)

| Key | What it does |
|---|---|
| Right / Left, Page Down / Page Up | Next or previous screen; on the captured fallback, next or previous capture |
| Space | Advance the scene; at its end, the next screen |
| W | Go to Enter NFR Workspace (screen 06) |
| L | Open the live product (`http://localhost:3200/`; add `?live=<url>` to the deck address to change it) |
| F | The five acts, captured from the product |
| A | Appendix index |
| 1, 2, 3, 4 | Appendix module: Value & Economics; Operating Model & Control; Data, Systems & Knowledge; Platform, Delivery & Scale |
| M | Back to the main story |
| R | Replay the screen |
| S | Safe mode on or off |
| Escape | Close the open panel, or go back one level (page, index, story) |
| 0 | Reset everything to the cover |
| ? | Shows the keys |
| Browser Back | From an appendix page, back to the screen that opened it |

## Opening

> "We are not here to propose another chatbot. We want to explore how the AI assistance already appearing across the bank can become connected, controlled operating capability around real NFR work."

---

## 01 Cover: From firefighting to prepared judgement

- **Remember:** a working product for one NFR role, not a drawing of one.
- **Talk track (30 s):** "On the right is the real product's Today screen for a third-party risk manager: work prepared for one role, decided by a person, recorded by the system. That is where we end up in ten minutes."
- **Visual state:** a framed capture of Today; the principle under it.
- **If asked "is this real?":** "Yes, it runs on this laptop on synthetic records. You will use it in a moment."

## 02 Most banks already have AI assistance

- **Remember:** assistance improves individual activities; it does not create a complete controlled process.
- **Talk track (40 s):** "Email drafts the reply, chat answers the question, documents summarise, meetings write their own minutes, search finds the file. Each helps. Underneath, one NFR case still runs through a case record, an evidence store, a policy library, an issue tracker and an approver, joined by copying, chasing, re-checking and waiting."
- **Business owner asks:** "So our assistant rollout was wasted?" **Answer:** "No. It is the starting point."

## 03 The NFR professional still connects the work

- **Remember:** specialists absorb the integration burden between systems, evidence, handoffs and decisions.
- **Talk track (45 s):** "Eight things gather around one professional. The cost is delay at every handoff, rework when evidence is missing and inconsistency because everyone connects it differently. Not a people problem: the process has no connecting layer, so the person becomes it."

## 04 One Workspace. Four ways to get work done.

- **Remember:** an assistant helps a person complete an activity; NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.
- **Talk track (60 s):** Ask, Use, Run, Create, each with its rule and example; then the sentence at the bottom. "Same identity, same permissions, same evidence, same control record."
- **Deep dive:** C2 (how each capability is governed).

## 05 Scaling requires three layers to move together

- **Remember:** improving only the AI component creates another pilot.
- **Talk track (45 s):** Work and roles, process and controls, data and platform, in parallel.

### Transition into the product

> "The simplest way to see the difference is to open the working day of a third-party risk manager. It does not start with a blank chat. It starts with the next decision."

## 06 Enter NFR Workspace (the doorway)

- **Remember:** the live product is the evidence; this screen is only the doorway.
- **Action:** arrive on the screen (or press W). In about two and a half seconds it loads the role context and the current decisions and shows **Open live Workspace (L)**. Press L or click it, or switch to the product tab.
- **Visual state:** the wordmark, three checks, the live cue, the five acts the audience is about to see.
- **If the product is unavailable:** press F for the five acts captured from the product. Say: "Here is the same working day, captured from the product this morning." Do not apologise for the technology.

## Live demonstration: five acts (in the product)

Follow the product's guide. The five outcomes the audience must see, and the deck page that explains each one if a buyer asks how it works:

| Act | What the audience sees | Takeaway | If asked how |
|---|---|---|---|
| 1 The role and the work are known | Start-up, sign in, Today for the Third-Party Risk Manager | The Workspace starts with the role and the next decision, not a blank chat box | C2, P1 |
| 2 Ask the records | "Which critical third-party services are deteriorating, and why?" answered as a conclusion, figures, a chart, ranked drivers, evidence and a next action | Not prose: a visual, evidence-backed decision product | D7, D8 |
| 3 Role app and evidence | From the answer into the periodic review: evidence, prior period, material changes, gaps, the method | The role application carries the task, evidence, controls and actions | C1, P2, D3 |
| 4 Decide and write back | One governed action: propose, inspect, permission and policy check, human approval, commit, changed state | The professional retains authority; the Workspace makes the approved action operational | C4 |
| 5 Recorded and reusable | The audit receipt, the updated record, a saved analysis or agent | The work becomes an attributable record and a reusable capability | C3, C5 |

**Return to the deck:** switch to the deck tab, still on screen 06, and press Space. Screen 07 maps what they just saw.

### Recovery during the live demonstration

| Situation | What to do |
|---|---|
| A screen is slow | Keep talking about what it will show; the launcher pre-warms the scripted path, so a second click usually lands |
| The expected state is missing | Reset the demonstration from the account menu, or switch to the deck and press F for that act |
| The product will not start | Press F in the deck and walk the five acts from the captures; or play the product's screen recording |
| The network is blocked | The product and the deck both run locally; nothing needs the internet after the first load |

## 07 AI prepares. Professionals decide. Systems record.

- **Remember:** what the audience just saw, in three responsibilities; no capability owns the risk.
- **Talk track (45 s):** "AI and automation prepared Today's decisions, the answer with its charts, the comparison with the last period, the gaps and the next action. The professional challenged the evidence, chose the action and approved the write-back. The system recorded the changed state, the receipt, who decided and when, and the next monitoring step."
- **Deep dives:** C1 (AI, rules and people), C4 (governed write-back).

## 08 Six months to prove one loop on reusable foundations

- **Remember:** month six proves one complete NFR operating loop, not a collection of AI features.
- **Talk track (60 s):** the three lanes through three phases; the six entry conditions.
- **Deep dive:** P3 (the four gates).

## 09 Value grows as assistance becomes operational work

- **Remember:** risk outcomes, operating performance and capacity are measured separately, and none of them is headcount.
- **Deep dives:** V2 (value tree), V3 (the unit-economics calculator: change adoption or efficiency live if the economic buyer engages).

## 10 Choose the first controlled loop

- **Remember:** one role, one decision, one bounded process, and the evidence that would authorise the next wave.
- **Talk track (45 s):** read the question; walk the three cards: what a good first loop has, what we ask of the client, what the workshop produces.
- **Deep dive:** V1 (where to start).

## Close

> "The first step is not the universal NFR platform. It is one role, one bounded decision journey and one measurable loop, with the evidence that earns the next wave."

---

## Appendix: four doors

Each page answers one buyer question, shows one main visual, states the decision implication and its claim status, and has Index (A), Previous, Next and Main story (M). Escape goes back one level.

| Buyer question | Page | Key |
|---|---|---|
| Where should we start? | V1 | 1 |
| What value, beyond headcount? | V2 | 1, then Next |
| What are the unit economics? | V3 (interactive) | 1, Next twice |
| Why is journey five cheaper than journey one? | V4 | |
| What does total cost include? | V5 | |
| What does the AI decide? | C1 | 2 |
| Do Ask, Use, Run and Create need the same controls? | C2 | |
| How do we stop uncontrolled personal agents? | C3 | |
| Can it change our records? | C4 | |
| How do we know it stays reliable? | C5 | |
| Is this replacing our GRC? | D1 | 3 |
| Are all systems connected the same way? | D2 | |
| How do apps and agents share one case safely? | D3 | |
| Do we need a knowledge graph? | D4, then D5 and D6 | |
| How does a question become a chart? | D7 | |
| Does integration widen data access? | D8 | |
| What sits behind the Workspace? | P1 | 4 |
| What is reusable? | P2 | |
| What happens in the six months? | P3 | |
| Who owns it? | P4 | |
| What happens after the first journey? | P5 | |

Also from the index: the captured live demonstration, the team page, and the Evidence Atlas (reference library). A specific internal runtime asset is not in the public deck; see your local notes.

## Buyer questions

### NFR business owner

- **Is this another chatbot?** No. Chat is one interaction mode. The Workspace also holds the role, case, evidence, applications, controls, decisions and recorded outcomes. You saw it start from Today, not from a chat box.
- **Are you replacing our GRC platform?** No. The authoritative systems stay in place (D1). The Workspace prepares and coordinates work across them and writes back only through approved controls (C4).
- **Why do we need apps if we already have a copilot?** A copilot understands the conversation. A role app also understands the case type, required evidence, approved method, permitted actions and decision route (act 3).
- **Can the agent change risk records?** Material changes follow a proposed action, a permission check, human approval, a governed connector and an audit receipt (act 4, C4).
- **How do we prevent uncontrolled personal agents?** Personal agents inherit existing access and begin constrained; scheduling, publication, write-back and standardisation need stronger review, and unused agents expire (C3).
- **What is the business case?** Built per case from the client baseline: capacity returned, operating benefit, run cost and payback (V3). Waiting time is not converted into headcount.
- **Why six months?** One role, one decision journey, one complete loop, with four gates (P3).

### IT strategist

- **What sits behind it?** Four layers: the Workspace, a runtime gateway, approved execution services, the authoritative systems (P1).
- **Does it depend on a specific agent runtime?** No. Execution sits behind a stable gateway contract; existing runtime assets are candidates, validated before any commitment.
- **How do facts become charts?** Governed data services calculate; a validated insight schema chooses the chart; the model helps interpret (D7).
- **Does it widen access?** No. Identity flows to every query and action; results are filtered before the model and the screen (D8).
- **Do we need a knowledge graph?** Only for relationship and impact questions, built one journey at a time (D4 to D6).
- **Who runs it?** A named product owner, with process, control, data and platform owners and independent oversight (P4).

## Comprehension check

After one pass, a first-time viewer should be able to explain: why an assistant is not the Workspace; Ask, Use, Run and Create; the three layers; where professional authority remains; what changes in the system after approval; what the first journey proves. Ask a business colleague and a technology colleague who did not build the deck, before explaining anything.
