# NFR Workspace: presenter guide

Twelve screens, about 30 minutes, for two buyers: the NFR business owner (main route) and the IT strategist or enterprise architect (technical depth on demand). Everything on screen is synthetic and bank-neutral.

## Before you start

| Check | How |
|---|---|
| Open the deck | `pitch.html` on GitHub Pages, or `npm run serve` and open `http://localhost:8080`. Enter the access code (shared separately). |
| Screen size | Any 16:9 screen from 1366 x 768 up. Share the browser tab or window in Teams, not the whole desktop. Full screen: F11. |
| Reset | Press `0` before you begin. Everything returns to the cover. |
| If the laptop is slow | Turn on safe mode (the square icon in the nav bar, or add `?safe=1` to the address). Every screen shows its final state and every demo button still works. Switching it re-renders the current screen, so a demo restarts at its first step; switch before you start a demo. |
| Focus | Click once on an empty part of the screen before using the keyboard. If a button has focus, Space presses that button. |

### Keys

| Key | What it does |
|---|---|
| Right / Left | Next or previous screen |
| Space | Advance the demo step; at the last step, next screen. On story screens, next screen. |
| W | Jump into the NFR Workspace (screen 06) |
| A | Show or hide the automation trace (screen 08) |
| T | Technical depth: appendix A to E and the measurement library, as a drawer |
| R | Replay the current screen, or reset the active demo |
| Escape | Close the open panel; in the Workspace with nothing open, return to the story (screen 10); on an appendix page, return to the screen you came from |
| 0 | Reset everything and return to the cover |
| G | Agenda |
| ? | Shows these keys on screen |

The nav bar also has visible buttons for technical depth, keys, safe mode, replay and pause.

## Opening script

> "AI assistance is already becoming part of how people work. The question is no longer whether an assistant can summarise a document or draft an email. The question is how we connect that assistance to the role, the case, the controls and the systems, so that real NFR work becomes easier to run and to scale. NFR Workspace is our view of that next step."

---

## 01 Cover: From firefighting to prepared judgement

- **Objective:** set the frame: not a new risk framework, not another chatbot.
- **Remember:** NFR Workspace connects everyday AI assistance to role-based, controlled work.
- **Talk track (30 s):** "This is a view of how NFR work can become role-based, connected, controlled and easier to scale. On the right you see where we end up: a workspace that starts with prepared decisions, with the assistant beside the work. Three words carry the whole conversation: AI prepares, professionals decide, systems record."
- **Action:** none. The frame draws itself; the four chapter buttons at the bottom jump ahead if needed.
- **Visual state:** wordmark, headline, the three-part principle, a Workspace frame with three decision cards and NFR Assist.
- **Business owner asks:** "Is this a product we would buy?" **Answer:** "It is a pattern we build with you on your platforms, proven on one journey first."
- **IT strategist asks:** "Which platform is this?" **Answer:** "Platform-neutral. The technical-depth panel (T) shows the reference layers; your existing identity, GRC and data platforms stay authoritative."
- **If the animation is skipped:** "Everything we discuss leads to this: prepared work, human decisions, recorded outcomes."

## 02 AI assistance is becoming part of the working day

- **Objective:** acknowledge that the bank already has useful AI.
- **Remember:** assistance helps one person with one activity.
- **Talk track (40 s):** "We are not assuming you have no AI. Email drafts the reply, chat answers a question, documents summarise, meetings write their own minutes, search finds the file. Each of those helps. But look underneath: one NFR case still runs through a case record, an evidence store, a policy library, an issue tracker and an approver, joined by copying, chasing, re-checking and waiting."
- **Action:** none.
- **Visual state:** five channels marked "helps here" around one professional; below, five systems joined by dashed handoffs.
- **Business owner asks:** "So our assistant rollout was wasted?" **Answer:** "No. It is the starting point. The next step is connecting it to the case and the controls."
- **IT strategist asks:** "Do we replace those tools?" **Answer:** "No. They stay. The Workspace uses the same identity and adds case and control context."
- **Fallback line:** "Individual assistance is here; operational work is still fragmented."

## 03 The NFR professional still connects the process

- **Objective:** name the remaining burden without blaming the team.
- **Remember:** the person is still the integration layer.
- **Talk track (45 s):** "Eight things gather around one professional: find the case, retrieve evidence, reconcile what changed, apply policy and method, chase missing input, prepare the decision, route challenge and approval, record the outcome. The cost is delay at every handoff, rework when evidence is missing and inconsistency because everyone connects it differently. This is not a people problem. The process has no connecting layer, so the person becomes it."
- **Action:** none.
- **Visual state:** eight numbered tasks around the professional; delays, rework and inconsistency on the right.
- **Business owner asks:** "How much time is this?" **Answer:** "We measure it on your baseline in the first two months. The appendix business case shows the method, labelled illustrative."
- **IT strategist asks:** "Is this an integration problem?" **Answer:** "Partly. It is integration plus case state plus control points, which is why one tool does not fix it."
- **Fallback line:** "The gap is not intelligence; it is that people carry the case between systems."

## 04 One Workspace. Four ways to get work done.

- **Objective:** introduce the one model the rest of the story uses, and the one sentence that separates it from an assistant.
- **Remember:** an assistant helps a person complete an activity; NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.
- **Talk track (60 s):** "Four ways to work, each with a plain rule for when to use it. Ask, NFR Assist, when you need help inside the task you are doing: summarise what changed in this review. Use, NFR Apps, when you need to complete a defined role task: a periodic third-party review. Run, NFR Automations, for a repeatable process across systems: collect evidence, check completeness, route challenge, record the outcome. Create, the Agent Builder, for a new or temporary analysis: a concentration briefing from approved records. And the sentence at the bottom is the point: an assistant helps a person complete an activity; the Workspace carries the role, the case, the evidence, the controls and the permitted actions across the work."
- **Action:** none. "Which path? (T)" opens Appendix A, the capability-choice table.
- **Visual state:** four cards revealed one by one, each with "Use it when" and an example, joined to one foundation strip under the difference sentence.
- **Business owner asks:** "Is this another chatbot?" **Answer:** "No. Assistance is one of four modes. The Workspace also holds the work queue, the case, the evidence, the apps, the controls, the decisions and the recorded outcomes."
- **IT strategist asks:** "Four platforms?" **Answer:** "One foundation, four modes. Same entitlements, same audit, same evidence services (Appendix B)."
- **Fallback line:** "Ask, use, run, create: four ways, one foundation, and the Workspace carries the case across all of them."

## 05 Scaling requires three layers to move together

- **Objective:** show that technology alone does not scale.
- **Remember:** improving only the AI layer creates another pilot.
- **Talk track (45 s):** "To scale, three layers move in parallel. Work and roles: each role receives prepared work and clear decision points. Process and controls: bounded automations move cases through evidence, challenge, approval and recording. Data and platform: reusable identity, permissions, evidence, case state, audit and monitoring. Change only one and you get another pilot."
- **Action:** none.
- **Visual state:** three lanes from today to future, one "in parallel" bracket, converging into NFR Workspace.
- **Business owner asks:** "Who owns the operating-model change?" **Answer:** "Your process owner. A delivery cell builds the loop; existing roles keep their accountability."
- **IT strategist asks:** "What do we build once?" **Answer:** "The data and platform lane: identity, connectors, case state, audit. Each new journey reuses it."
- **Fallback line:** "Roles, process and platform move together, or the pilot stays a pilot."

### Transition into the product

> "The simplest way to understand the proposition is to enter the working day of an NFR risk manager. The Workspace does not start with a blank chat. It starts with the next decision."

## 06 Enter the Workspace: role and controls load first

- **Objective:** make the switch from slides to an application.
- **Remember:** work, case and controls exist before the chat opens.
- **Talk track (20 s):** "Watch what loads first: the role, its permissions, the approved applications, the connected evidence, the control policies and case state. Only then does the assistant open, beside the work."
- **Action:** arrive on the screen (or press W from anywhere). Space skips the start-up; R replays it.
- **Visual state:** about two seconds: wordmark, "Role context · NFR Risk Manager", four checks, "Workspace ready", cards resolve, NFR Assist slides in last. "Synthetic demonstration" badge in the header.
- **Business owner asks:** "Is this live data?" **Answer:** "No. It is a synthetic, deterministic demonstration. Nothing connects to a bank system."
- **IT strategist asks:** "Where do permissions come from?" **Answer:** "From your identity provider and entitlement model. The Workspace inherits them; it does not create access."
- **Fallback line:** "The Workspace knows the role and its controls before anyone types a question."

## 07 Start with the next decision, not a blank chat

- **Objective:** show the decision-first home, one visual answer, and the hand-off from assistance to a role app.
- **Remember:** the day starts from one decision; Assist explains, the role app carries the method.
- **Talk track (90 s):** "One decision is dominant: the periodic review of the cloud hosting provider, due today. It says why it is here, what changed, what was prepared and which decision is needed. Two items are next, three signals are watched, and the overnight work is quiet. Now I ask Assist a portfolio question." Space. "The answer is not a paragraph. One conclusion, four figures, a ranking of services, the trend for the worst one, the drivers with their sources, and how fresh the data is. The recommended action is to open the review." Space. "Ask it what changed, and it hands the work over:" read the hand-off line. "The assistant can explain the case, but the role app carries the approved method, the required evidence, the permitted actions and the decision path." Space opens the app.
- **Action:** Space three times: the visual insight, the hand-off, then "Open Periodic Review App". Or click the questions and buttons. "Your day" returns from the insight.
- **Visual state:** Now card with the four fields and Open case; Next, Watching, Done by the Workspace; the insight with a ranked bar chart and a trend line; the Assist hand-off with its button.
- **Business owner asks:** "Who decides the ranking?" **Answer:** "Queue rules your process owner agrees: due date, criticality, materiality. Visible and versioned."
- **IT strategist asks:** "Does the model draw the chart?" **Answer:** "No. Charts come from a fixed set of approved visualisations filled with sourced data; the model never writes chart code."
- **Fallback line:** "The experience starts with the role and the next decision. Chat is available, but it hands real work to the app that owns it."

## 08 For standard work, the case arrives prepared end to end

- **Objective:** show one controlled loop: propose, inspect, approve, commit, receipt.
- **Remember:** AI and automation prepare and route; the professional makes the material judgement; nothing is written until it is confirmed.
- **Talk track (90 s):** "We arrive in the role app, already prepared: the evidence checklist with the missing report in amber, current versus previous, the requirements, the gaps and the follow-up questions." A for the trace: "Eight steps, read only, and it stopped at a human gate." Space to the decision: "Three options, the proposed one marked." Choose it: "Before anything is written, a preview: the target system, the record, every field that changes, and the checks: role and record scope, delegated authority, a scoped connector with no credentials in the model." Confirm: "Now the system of record acknowledges, the case status changes, the item leaves my queue, actions and monitoring are created, and the audit receipt holds who, when, which sources, which policy, which automation and which model."
- **Action:** Space steps role app, trace, decision, preview, commit. Or click "Trace (A)", "Go to decision", a decision, "Confirm and record". "Back to the decision" leaves the preview without writing. "Back to decisions" shows the home queue with the review recorded; "Replay this case" resets it.
- **Visual state:** amber "Nothing written yet" until confirmation; then the green state-change strip and the receipt.
- **Business owner asks:** "What if I disagree with the proposal?" **Answer:** "Hold or escalate; each previews and records its own outcome and reason."
- **IT strategist asks:** "How is write-back controlled?" **Answer:** "Propose, check role and record scope, approve where required, a governed connector with scoped credentials, confirmation from the authoritative system, then the receipt (Appendix E)."
- **Fallback line:** "Prepared by the Workspace, decided by the professional, written only after a previewed confirmation, recorded by the system."

### Transition into the Agent Builder

> "Not every need should become a centrally built application. The long tail changes too quickly. Here the user can create an ad hoc analysis, but the Workspace makes the data, actions and boundaries explicit before anything runs."

## 09 For the long tail, create a controlled ad hoc agent

- **Objective:** show agility without uncontrolled autonomy, and that the builder is not a fifth platform.
- **Remember:** standard apps and automations cover repeatable work; the Agent Builder covers changing and ad hoc needs within the same permissions, evidence and controls. The agent inherits the user's access; it does not create new access.
- **Talk track (90 s):** "Standard work is built deliberately; the long tail changes too quickly. I describe what I need. The Workspace restates the goal; I can edit it. Before anything runs: what it can read, what it can create, and what it cannot do. Private to me, review before sharing. The plan, five steps. Run. A one-page briefing: concentration by provider as bars, expiring acceptances on a 90-day line, gaps shown, every statement cited. Then reuse: run once, save it, schedule it weekly, or ask for a reviewed team template. That is the path from a single run to a supported app or automation."
- **Action:** Space steps goal, permissions, plan, run, reuse; then Space selects "Save to My Agents" and "Request team template". "Schedule weekly" is a click.
- **Visual state:** stepper; read, create and cannot columns; the briefing with bars and the timeline; the four reuse options and the promotion path.
- **Business owner asks:** "How do we stop hundreds of uncontrolled agents?" **Answer:** "Agents start private and read-only. Reuse, scheduling, team publication and write-back need progressively stronger ownership and review (Appendix D)."
- **IT strategist asks:** "What runs it?" **Answer:** "Approved execution services behind a runtime gateway (Appendices B and C). The builder never grants access the user does not have."
- **Fallback line:** "The builder is not a back door around standardisation; it covers the long tail and shows what to industrialise next."

## 10 AI prepares. Professionals decide. Systems record.

- **Objective:** make the authority boundary explicit.
- **Remember:** no capability owns the risk.
- **Talk track (45 s):** "What we just saw, in one picture. AI and automation retrieve, compare, flag, map, draft, route and propose. Professionals challenge, determine materiality, approve or amend, accept, mitigate or escalate, and authorise material writeback. Systems record the outcome, the named decision maker, the actions, the versions, the trace and the next monitoring event. Each capability has a default authority, and none of them owns the risk."
- **Action:** none. "Atlas: controlled write" and "Controls (T)" open the detail.
- **Visual state:** three columns with arrows, the "named decision maker" gate, "Recorded after the decision", and the authority table.
- **Business owner asks:** "Does second line still challenge?" **Answer:** "Yes. First-line preparation and second-line challenge stay with different roles; it is in the control catalogue."
- **IT strategist asks:** "Can an automation change a record on its own?" **Answer:** "Only approved, non-material steps inside policy. Material writeback needs a named approval."
- **Fallback line:** "Automation does not grant authority."

## 11 Six months to prove one loop on reusable foundations

- **Objective:** a credible, bounded first proof.
- **Remember:** one working loop and its foundation, not a universal platform.
- **Talk track (60 s):** "The same three layers, over six months. Define: the role, decisions and boundaries; the case lifecycle and controls; sources, permissions and the technical path. Build and test: the role journey; the role app, a bounded automation and the ad hoc read-and-draft pattern; connectors, identity, audit and monitoring. Operate and prove: in the operating cadence, on live or representative cases, hardened and reusable. We need four things to start: a named process owner, a bounded case type, representative data access and an agreed AI, automation and human boundary."
- **Action:** none. "Atlas: workstreams" for the detailed plan.
- **Visual state:** three lanes by three phases, gates between phases, entry conditions and what month six proves.
- **Business owner asks:** "What do we have at month six?" **Answer:** "One role experience, one connected role app, one bounded automation loop, one constrained ad hoc reporting pattern, and measured outcomes."
- **IT strategist asks:** "What is reusable for journey two?" **Answer:** "Identity integration, connectors, case-state and audit services, the control patterns and the role shell."
- **Fallback line:** "Six months to prove one loop, not to deliver an enterprise platform."

## 12 Value grows as assistance becomes operational work

- **Objective:** separate the value types and get a decision.
- **Remember:** choose the first role, decision and bounded journey.
- **Talk track (45 s):** "Value grows as we move from assistance to operational work: from faster drafting, to better evidence, to fewer handoffs, to answering new questions quickly. We measure risk outcomes, operating performance and capacity separately; waiting time saved is not headcount. So the question for this room: which role, decision and bounded journey should become the first controlled loop? Look for a high manual integration burden, a bounded data and decision path, and an outcome we can measure."
- **Action:** none. "Appendix: business case" opens the illustrative calculator.
- **Visual state:** the value ladder, three outcome groups, and the workshop question in amber.
- **Business owner asks:** "What is the business case?" **Answer:** "The appendix calculator shows the method on illustrative numbers; we replace them with your baseline in the first phase."
- **IT strategist asks:** "What does it cost to run?" **Answer:** "Run cost per case is one of the measures; the business case keeps it visible."
- **Fallback line:** "Start with one role, one bounded decision journey and one measurable loop."

## Close

> "The first step is not to build the universal NFR platform. It is to select one role, one bounded decision journey and one measurable loop, then reuse what we prove."

---

## Appendix and technical depth

Five appendix pages answer the questions that come after the core route. Each has its own address, and **Back to the story** (top right) or Escape returns to the screen you came from.

| Page | Address | Use it for |
|---|---|---|
| A. Which capability should handle the work? | `#appendix-capability-choice` | "Which path do I use?" Need, path, example, default authority |
| B. From business experience to governed execution | `#appendix-architecture` | The four layers: Workspace, runtime gateway, execution services, authoritative systems |
| C. Candidate runtime reuse | `#appendix-runtime-reuse` | What an existing runtime could provide, what to adapt, what stays out of the business UI |
| D. How ad hoc work becomes governed and reusable | `#appendix-agent-lifecycle` | Run once, personal agent, reviewed template, standard app; the gates between |
| E. Governed write-back | `#appendix-writeback` | The eight-step write pattern and its controls |

T opens the same topics as a drawer, plus the measurement library, without leaving the current screen. Appendix C is deliberately generic in the public deck; any discussion of a specific internal asset stays in your local, untracked notes.

### Architecture transition

> "The NFR professional should not need to see the agent runtime. The Workspace owns the role experience; approved platform services execute the work behind it; authoritative systems still hold the record."

## Likely buyer questions

### NFR business owner

- **Is this another chatbot?** No. Assistance is one interaction mode. The Workspace also holds the role context, work queue, case, evidence, applications, controls, decisions and recorded outcomes.
- **Are you replacing our GRC platform?** No. Authoritative systems remain authoritative. The Workspace prepares and coordinates the work across them and writes back only through approved controls.
- **Who owns the conclusion?** The named professional or accountable role. AI prepares; the professional challenges and decides.
- **What happens when the AI is uncertain?** It shows missing evidence, contradictions and limits, and abstains where a result is unsupported. The case stays with the professional.
- **Why do we need an Agent Builder?** Standard apps cannot cover every emerging event, temporary analysis or management question. The builder covers that long tail without bypassing access and review.
- **How do we stop hundreds of uncontrolled agents?** Agents start private and constrained. Reuse, publication, scheduling, write-back and standardisation need progressively stronger ownership and review.

### IT strategist

- **Does NFR Workspace depend on a specific agent runtime?** No. Execution services sit behind a stable runtime gateway, so an approved runtime can be swapped. Existing assets are candidate accelerators, validated before any commitment.
- **Is the runtime model-independent?** The Workspace architecture is runtime-pluggable. Whether a given runtime can change models or its agent framework is part of its validation; do not assume it is configuration only.
- **Where does workflow state live?** In the appropriate enterprise system of record or an approved orchestration service, not in a developer tool.
- **How is write-back controlled?** The Workspace proposes an action, checks role and record scope, obtains approval where required, calls a governed connector with scoped credentials and records the confirmed outcome with an audit reference.
- **How do you manage cost and runaway agents?** Bounded iterations, budgets, schedule and concurrency limits, observable usage, cancellation and escalation. Verify which controls the chosen runtime ships before making claims.

## When something goes wrong

| Problem | Recovery |
|---|---|
| A screen looks stuck or half-drawn | Press R, or turn on safe mode. |
| The demo is in an odd state | R resets the current demo; 0 resets everything. |
| Space does nothing | A button has focus. Click an empty area, or use the arrow keys. |
| Animation stutters on a shared screen | Safe mode: final states, same content, same buttons. |
| A scene fails to load | A static picture of the screen appears in its place; keep talking to it. |
| Someone wants architecture detail | T opens technical depth; Escape closes it. The appendix (nav tab "Appendix") has the rest. |

## Comprehension check

After one pass, a colleague without AI-platform background should be able to answer:

1. What is NFR Workspace?
2. How is it different from ordinary chat?
3. What are the four ways of working?
4. What are the three layers that must change?
5. What does AI do, and what remains human?
6. What is the first six-month proof?

If any answer needs the appendix, tighten the screen that should have carried it.
