# NFR Workspace pitch: appendix and live-demo audit (before v6)

Audited on 2026-11-24 against release v30 (`v30-fb8c020`, branch `feat/pitch-v5`, not yet deployed; live site still v29). Baseline tag: `baseline-pre-pitch-v6`. Working branch: `feat/pitch-v6`. The product side (`nfr-workos`) is audited separately in that repository's `docs/DEMO_READINESS_AUDIT.md`.

## 1. The decision this audit serves

v6 makes the real NFR Workspace product the main demonstration. The deck today carries its own animated mock of the product (screens 06 to 09: start-up, home, periodic-review journey, Agent Builder) with its own case (`TPRM-PR-042`, "Cloud hosting provider"), labels and navigation. That is a second, competing representation of the product. The mock goes; a short "Enter NFR Workspace" transition hands over to the live product, and the fallback is captures of the live product, not the mock.

## 2. Core route inventory

| ID / hash | Headline | Buyer question answered | Kind | Unique value | Duplicates | Decision |
|---|---|---|---|---|---|---|
| `#cover` | From firefighting to prepared judgement. | What is this conversation about? | Strategic | Frame and principle | Its Workspace silhouette restates the mock home | **Refine**: show a capture of the real product instead of the mock silhouette |
| `#assistance-here` | Most banks already have AI assistance. | Do we not have AI already? | Strategic | Acknowledges current maturity | None | Keep; takeaway per v6 |
| `#remaining-burden` | NFR specialists still absorb the integration burden. | So what is still hard? | Strategic | Names the integration burden | None | **Refine**: v6 headline "The NFR professional still connects the work." |
| `#four-ways` | One Workspace. Four ways to get work done. | What is NFR Workspace? | Strategic | Ask, Use, Run, Create; assistant-versus-Workspace sentence | None | Keep; deep link to the capability-governance page |
| `#three-layers` | Scaling requires three layers to move together. | What has to change to scale? | Strategic | Three parallel layers | None | Keep |
| `#workspace-boot` | Role, permissions and controls load before the assistant. | What does the working day look like? | Product | Context before chat | Ends in the mock home | **Refine**: 5 to 8 second "Enter NFR Workspace" transition ending on a cue to open the live product |
| `#workspace-home` | Start with the next decision, not a blank chat. | Where does the day start? | Product (mock) | Decision-first home, visual answer | **The live product, acts 1 and 2** | **Remove** |
| `#workspace-journey` | For standard work, the case arrives prepared end to end. | How does standard work run? | Product (mock) | Write-back preview and receipt | **The live product, acts 3 to 5** | **Remove** |
| `#workspace-builder` | For the long tail, create a controlled ad hoc agent. | What about work no app covers? | Product (mock) | Governed ad hoc agent | **The live product, act 5** | **Remove** |
| `#authority-boundary` | AI prepares. Professionals decide. Systems record. | Who holds authority? | Control | The principle | None | **Refine**: the return point after the live demo; map what the audience just saw |
| `#six-month-route` | Six months to prove one loop on reusable foundations. | What is the first proof? | Delivery | Three lanes, three phases | Atlas workstreams view | Keep; link to the proof page instead of the atlas |
| `#value-decision` | Value grows as assistance becomes operational work. | What is the value, where do we start? | Economic | Three value groups and the workshop question | None | **Refine**: split into Value and a separate Workshop decision screen |

Result: ten screens (cover, assistance, burden, four ways, three layers, Enter NFR Workspace, principle, six months, value, workshop decision), with the live product between screens six and seven.

## 3. Appendix inventory

Questions: (1) the buyer question; (2) the buyer most likely to ask; (3) the decision it helps; (4) already covered in the core route; (5) the visual adds understanding; (6) the presenter can enter and leave without losing the flow; (7) bank-neutral and public-safe; (8) claim status.

| Page | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Decision |
|---|---|---|---|---|---|---|---|---|---|
| `#appendix` index | Where is the detail? | Both | Which deep dive to open | no | grouped list only | yes | yes | n/a | **Refine** into four doors |
| A Capability choice | Which path handles the work? | Business owner | Ask, Use, Run or Create | partly (four ways) | table | yes | yes | target design | **Merge** into C2 (governance per capability) |
| B AI, rules and human authority | Where is authority retained? | Both | Control allocation | partly (principle screen) | three columns | yes | yes | target design | Keep as **C1** |
| C Architecture | What sits behind the Workspace? | IT strategist | Target layers | no | layer stack | yes | yes | target design | Keep as **P1** |
| D Governed write-back | What stops silent record changes? | Both | Write-back control pattern | partly (demo) | eight-step flow | yes | yes | target pattern | Keep as **C4** |
| E Ad hoc to managed | How do we prevent uncontrolled personal agents? | Business owner | Promotion gates | no | four stages | yes | yes | target design | Keep as **C3**, add retirement |
| F Candidate runtime reuse | Can existing runtime assets accelerate this? | IT strategist | Build or reuse the runtime | no | three columns | yes | generic but **internal by intent** | candidate | **Remove from the public route** (v6 P6 is internal only); notes stay in the local file |
| G Proof gates and measures | How do we know the proof worked? | Both | Gate criteria | partly (six months) | gates and measures | yes | yes | plan | **Merge** gates into P3, measures into C5 |
| `#business-case` calculator | What is the business case? | Business owner | Payback on one journey | no | interactive | yes | yes, illustrative | hypothesis | **Merge** into V3 (unit economics with role-level inputs, waterfall, payback, sensitivity) |
| `#workspace-live` prototype captures | Does this exist? | Both | Credibility | no | screenshots | yes | yes | implemented (prototype) | **Refine** into the live-demo fallback: five acts captured from the current product (old captures predate the rename) |
| `#ref-room` Evidence Atlas (10 views) | Many | Both | Many | partly | rich | entering is fine; leaving needs its own return | yes | mixed | **Keep as a reference library outside the four doors**; remove core-screen links to it |
| A1 Responsible AI checklist | What must be true before go-live? | Risk, model governance | Readiness criteria | no | text cards | yes | yes | practice guidance | **Merge** into C5 detail |
| A2 Methodology principles | How do you run the engagement? | Both | Engagement approach | partly | text cards | yes | yes | practice guidance | **Merge** into P3 detail |
| A3 Evidence before the first proof | What do we need to provide? | Business owner | Readiness of inputs | no | text cards | yes | yes | practice guidance | **Merge** into V1 detail |
| A4 Proof KPIs | What do we measure? | Both | Measures | duplicates G | text cards | yes | includes breach-rate measures v6 advises against | practice guidance | **Remove** (C5 and P3 carry measures) |
| A5 Assumptions and disclaimers | What are the caveats? | Both | Trust in the numbers | no | text | yes | yes | disclaimer | **Merge** into V3 detail |
| A6 Team and credentials | Who would do this? | Both | Who to engage | no | photos | yes | owner decision: keep | fact | Keep, outside the four doors |

## 4. Target appendix: four buyer-led modules

| Module | Pages | Kind |
|---|---|---|
| 1 Value & Economics | V1 Where should we start? · V2 Where does value come from? · V3 What are the unit economics? (interactive) · V4 How does the case improve with reuse? · V5 What does total cost include? | Economic, strategic |
| 2 Operating Model & Control | C1 What belongs to AI, rules and people? · C2 How is each capability governed? · C3 How does an ad hoc agent become managed capability? · C4 How does governed write-back work? · C5 How is the capability assured in operation? | Control |
| 3 Data, Systems & Knowledge | D1 How does the Workspace connect without replacing systems? · D2 What are the integration patterns? · D3 What context travels through the Workspace? · D4 Do we need a knowledge graph? · D5 What would the NFR knowledge graph contain? · D6 How is the graph built safely? · D7 How does a question become a visual answer? · D8 How are access and provenance preserved? | Technical |
| 4 Platform, Delivery & Scale | P1 What sits behind the Workspace? · P2 What is reusable and what is journey-specific? · P3 How do we prove one working loop in six months? · P4 Who owns and operates it? · P5 How does it scale across the portfolio? | Technical, strategic |

P6 (candidate runtime reuse) is internal only and is not built into the public deck. Every page: a question as title, a short answer, one main visual, a decision implication, a claim-status badge, progressive detail, its own hash, index, previous and next within the module, and return to the main story.

## 5. Public-safety baseline

Repository public; Pages serves every committed file. No internal asset name in tracked files or history; no client names; team appendix and owner email kept by the owner's decision (2026-11-23). Product captures added in v6 must be checked for internal names, personal data, internal URLs and the old wordmark before they are committed.
