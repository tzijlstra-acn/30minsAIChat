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
| T | Technical depth: architecture, agent governance, controls, measures |
| R | Replay the current screen, or reset the active demo |
| Escape | Close the open panel; in the Workspace with nothing open, return to the story (screen 10) |
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

- **Objective:** introduce the one model the rest of the story uses.
- **Remember:** Ask, Use, Run, Create, on one shared foundation.
- **Talk track (60 s):** "There are four ways to work in the Workspace. Ask: NFR Assist, role-steered help in email, chat, documents and the Workspace. Use: NFR Apps, a connected application for a defined task such as a periodic review. Run: NFR Automations, which move repeatable cases across systems and pause at human control points. Create: the Agent Builder, for the new or ad hoc need nobody has built for yet. All four share the same identity, permissions, evidence and control record. The Workspace is not the assistant; it is where all four work with the same role and controls."
- **Action:** none. Press T if someone wants the architecture now.
- **Visual state:** four cards revealed one by one, then joined to one foundation strip.
- **Business owner asks:** "Which of these do my people see first?" **Answer:** "Ask and Use on day one; Run where the journey is repeatable; Create for the long tail."
- **IT strategist asks:** "Four platforms?" **Answer:** "One foundation, four modes. Same entitlements, same audit, same evidence services (T, reference architecture)."
- **Fallback line:** "Ask, use, run, create: four ways, one foundation."

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

- **Objective:** show the role-based home.
- **Remember:** the day starts from a ranked decision queue.
- **Talk track (45 s):** "Three decisions are waiting: a periodic third-party review, a control effectiveness challenge and an incident materiality assessment. Each card says why it is here, what changed, how complete the evidence is, the decision required and when. NFR Assist sits beside the work. Let me ask it three questions." Press Space three times.
- **Action:** Space asks: "What changed since the previous review?", "Which evidence is missing or stale?", "Explain why this case is prioritised." Then "Open case" or Space.
- **Visual state:** the first card's fields light up in turn; answers appear in the Assist panel with sources and the note "NFR Assist explains; you decide."
- **Business owner asks:** "Who decides the ranking?" **Answer:** "Queue rules your process owner agrees: due date, criticality, materiality. They are visible and versioned."
- **IT strategist asks:** "Is the assistant grounded?" **Answer:** "Answers cite the case's own sources and stay within the user's access."
- **Fallback line:** "The experience begins with the role and the next decision; chat is available but not the organising principle."

## 08 For standard work, the case arrives prepared end to end

- **Objective:** show one controlled case loop from summary to receipt.
- **Remember:** AI and automation prepare and route; the professional makes the material judgement.
- **Talk track (60 to 90 s):** "This periodic review was prepared overnight. Here is the summary: criticality, the previous conclusion, three material changes, one missing report, one open issue. In the role app the evidence checklist, current versus previous, the policy requirements, the gaps and the follow-up questions are already there. The automation trace (A) shows how it got here: eight steps, read only, and it stopped at a human gate. Now the decision. The rationale is drafted; I can edit it. I approve with a 30-day condition. Only now is the outcome written to the system of record, the follow-up actions created, the next monitoring event scheduled and an audit receipt issued."
- **Action:** Space steps: case summary, role app, trace, decision, recorded. Or click: "Open the periodic review app", "Trace (A)", "Go to decision", then one of the three decisions. "Replay this case" starts again.
- **Visual state:** the missing report stays amber throughout; the trace ends on "Paused for human challenge"; no receipt exists until a decision is chosen.
- **Business owner asks:** "What if I disagree with the proposal?" **Answer:** "Choose hold or escalate; each records its own outcome and reason. Overrides are measured, not hidden."
- **IT strategist asks:** "What exactly is written, and when?" **Answer:** "Nothing before the decision. After it, the approved outcome only, through a controlled connector, with the source, policy and model versions in the receipt."
- **Fallback line:** "Prepared by the Workspace, decided by the professional, recorded by the system."

### Transition into the Agent Builder

> "Not every need should become a centrally built application. The long tail changes too quickly. Here the user can create an ad hoc analysis, but the Workspace makes the data, actions and boundaries explicit before anything runs."

## 09 For the long tail, create a controlled ad hoc agent

- **Objective:** show agility without uncontrolled autonomy.
- **Remember:** the agent inherits the user's access; it does not create new access.
- **Talk track (90 s):** "The request: a one-page briefing of critical third-party services with worsening indicators, severe open issues or expiring risk acceptances, grouped by provider concentration, every statement cited. Step one, the Workspace restates the goal; I can edit it. Step two, before anything runs, the scope: what it can read, what it can create, what it cannot do. It cannot change records, accept risk, close issues, notify anyone outside or publish without review. Output is private to me. Step three, the plan, five steps. Run. A one-page briefing, sources cited, data gaps shown rather than filled, marked for human review. Step five: run once, save it to My Agents, or ask for a reviewed team template. That is the path from an ad hoc run to a standard app or automation."
- **Action:** Space steps through Goal, Scope, Plan, Run (staged, about three seconds), Output, Reuse; then Space selects "Save to My Agents" and then "Request team template". Buttons do the same. "Use example" restores the request if someone edits it.
- **Visual state:** stepper across the top; scope columns read, create, cannot; the briefing with citations; the promotion path with the current stage highlighted.
- **Business owner asks:** "Can anyone build anything?" **Answer:** "Anyone can build within their own access and approved actions. Sharing with a team needs owner and control review."
- **IT strategist asks:** "How do you avoid agent sprawl?" **Answer:** "Private by default, every run traced, team templates versioned and owned, and recurring agents are promoted into supported apps or automations (T, agent governance)."
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
