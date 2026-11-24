// -- APPENDIX MODULES -- v7 --
// The buyer-led appendix: four domains, one question per page. Every page has a question
// as its title, a short answer, one main visual, a decision implication, a claim status
// and optional detail. assets/js/story/appendix-modules.js renders them; pitch.html holds
// one section shell per page (id = page.id). Public edition: synthetic, bank-neutral,
// no internal asset names, no client details, no commercial terms.
// The internal edition (built locally, never published) appends pages through
// window.NFR_APPENDIX_INTERNAL before this object is frozen.
// Exposes window.NFR_APPENDIX and module.exports (tests).

(function(global) {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(k) { var v = obj[k]; if (v && typeof v === 'object') deepFreeze(v); });
    return Object.freeze(obj);
  }

  var KINDS = { strategic: 'Strategic', economic: 'Economic', control: 'Control', technical: 'Technical', delivery: 'Delivery' };
  var STATUS = {
    demonstrated: 'Shown in the live product',
    target: 'Target design',
    illustrative: 'Illustrative, synthetic figures',
    practice: 'Delivery practice',
    concept: 'Concept for validation',
    option: 'Implementation option',
    credential: 'Accenture credential, claim review'
  };

  var MODULES = [
    // ───────────────────────────── 1 VALUE & ECONOMICS ─────────────────────────────
    { id: 'value', key: '1', label: 'Value & Economics', icon: 'ti-chart-bar', kind: 'economic',
      question: 'Is this worth funding, and where do we start?',
      trigger: '"What is the business case?"',
      pages: [
        { id: 'appendix-v1', code: 'V1', kind: 'strategic', status: 'concept',
          title: 'Where should we start?',
          answer: 'With a bounded journey where the value or risk significance is high and the data, method and ownership are ready enough to measure.',
          visual: { type: 'matrix',
            x: 'Feasibility: data access, standardisation, write-back, named owner', y: 'Value and risk significance: volume, effort, evidence burden, change',
            zones: [
              { id: 'start', label: 'Start now', pos: 'tr' },
              { id: 'prepare', label: 'Prepare data and process first', pos: 'tl' },
              { id: 'human', label: 'Retain as human-led specialist work', pos: 'bl' },
              { id: 'defer', label: 'Defer', pos: 'br' }
            ],
            items: [
              { label: 'Third-party periodic review', x: 78, y: 80, pick: true },
              { label: 'Control inventory rationalisation', x: 70, y: 70 },
              { label: 'Issue remediation', x: 84, y: 60 },
              { label: 'Control testing evidence', x: 62, y: 56 },
              { label: 'Regulatory change impact', x: 34, y: 78 },
              { label: 'RCSA challenge', x: 26, y: 62 },
              { label: 'Incident assessment', x: 22, y: 30 },
              { label: 'Management reporting', x: 80, y: 24 }
            ] },
          detail: [
            { title: 'Scoring dimensions', items: ['Case volume', 'Human effort', 'Evidence burden', 'Frequency of change', 'Control or regulatory significance', 'Source-data accessibility', 'Decision standardisation', 'Write-back complexity', 'Named business owner', 'Measurable baseline'] },
            { title: 'The questions risk functions bring', items: ['Show we meet a control framework, such as SOC 2', 'Review a control inventory before it moves to a new GRC platform', 'Reduce the control inventory by about a third', 'Understand what a new regulation adds to existing local requirements', 'Answer repeated control questionnaires from external parties', 'Make scenario analysis more meaningful', 'Show that key controls operate, not only that they are documented', 'Automate RCSA to meet a regulatory requirement', 'Improve control design'] }
          ],
          implication: 'Pick the first process from the top right: real value, a clear authority boundary and a measurable baseline.' },

        { id: 'appendix-v2', code: 'V2', kind: 'economic', status: 'concept',
          title: 'Where does value come from?',
          answer: 'Better connected evidence leads to fewer late surprises, less rework and faster decisions, which return capacity to challenge and remediation.',
          visual: { type: 'tree', root: 'Value of a controlled NFR process',
            chain: ['Better connected evidence', 'Fewer missing items and late surprises', 'Less rework and faster decisions', 'More capacity for challenge and remediation'],
            branches: [
              { id: 'risk', label: 'Risk outcomes', icon: 'ti-shield-check', items: ['More complete and current evidence', 'Earlier detection of material change', 'Consistent policy and method', 'More complete decision trace', 'Fewer unsupported conclusions'] },
              { id: 'operating', label: 'Operating performance', icon: 'ti-clock', items: ['Shorter cycle time', 'Fewer handoffs and follow-ups', 'Fewer overdue reviews', 'Faster escalation', 'Less rework'] },
              { id: 'capacity', label: 'Capacity and economics', icon: 'ti-scale', items: ['Lower human touch time', 'Lower cost per prepared case', 'Capacity redirected to challenge', 'Reuse across later journeys'] }
            ] },
          detail: [
            { title: 'Outside the base case', items: ['Avoided losses and avoided regulatory findings: shown as upside only, unless there is defensible evidence', 'Waiting time removed: reported as elapsed time, not converted into labour savings'] }
          ],
          implication: 'Lead with risk and operating outcomes; count capacity as hours returned to judgement.' },

        { id: 'appendix-v3', code: 'V3', kind: 'economic', status: 'illustrative',
          title: 'What are the unit economics?',
          answer: 'Cost per case falls when preparation removes addressable work, net of exceptions and run cost. Change the inputs; the model recalculates.',
          visual: { type: 'calculator' },
          detail: [
            { title: 'Assumptions and disclaimers', items: ['Every default is synthetic and illustrative; replace it with the client baseline before any proposal', 'Capacity, cycle time and control quality are kept apart, not added into one number', 'Waiting time removed is not converted into labour savings', 'Avoided losses and avoided findings are excluded from the base case', 'Payback is simple payback on recurring net benefit, before ramp and financing', 'Nothing here is regulatory or legal advice'] }
          ],
          implication: 'Fund the first process on measured capacity and operating benefit, then validate with client data in the qualification.' },

        { id: 'appendix-v4', code: 'V4', kind: 'economic', status: 'illustrative',
          title: 'Why do later journeys cost less?',
          answer: 'The first journey pays for shared foundations. Later journeys cost less where reuse is real, but each keeps its own domain work.',
          visual: { type: 'reuse', unit: 'EUR thousand, one-off',
            bands: [
              { id: 'foundation', label: 'Reusable foundation' },
              { id: 'domain', label: 'Reusable NFR methods' },
              { id: 'specific', label: 'Journey-specific work' }
            ],
            journeys: [
              { label: 'Journey 1', foundation: 220, domain: 120, specific: 110 },
              { label: 'Journey 2', foundation: 30, domain: 50, specific: 100 },
              { label: 'Journey 3', foundation: 20, domain: 35, specific: 100 },
              { label: 'Journey 4', foundation: 20, domain: 30, specific: 95 },
              { label: 'Journey 5', foundation: 20, domain: 25, specific: 95 }
            ] },
          detail: [
            { title: 'Reusable foundation', items: ['Identity and entitlement', 'Audit', 'Case and context contract', 'Connector framework', 'Visual-insight renderer', 'Evaluation framework', 'Human-approval component', 'Write-back service', 'Monitoring'] },
            { title: 'Journey-specific', items: ['Data mapping', 'Methodology and rules', 'Role experience', 'Exceptions', 'Approval routing', 'Source-system actions', 'Evaluation set'] }
          ],
          implication: 'Scale comes from reusable services and methods, not from assuming every NFR process is the same.' },

        { id: 'appendix-v5', code: 'V5', kind: 'economic', status: 'illustrative',
          title: 'What does total cost include?',
          answer: 'Far more than model usage: integration, data quality, method evaluation, change and assurance carry most of the cost.',
          visual: { type: 'tco',
            stacks: [
              { label: 'One-off', items: [
                { label: 'Source integration', w: 16 }, { label: 'Data-quality remediation', w: 16 }, { label: 'Method design and evaluation', w: 18 },
                { label: 'Product and change management', w: 14 }, { label: 'Training and adoption', w: 12 }, { label: 'Security and architecture approval', w: 10 } ] },
              { label: 'Recurring, per year', items: [
                { label: 'Runtime and model usage', w: 9, highlight: true }, { label: 'Platform operations', w: 13 }, { label: 'Monitoring and assurance', w: 13 },
                { label: 'Support and release management', w: 13 }, { label: 'Revalidation after policy or source changes', w: 12 }, { label: 'Data-quality ownership', w: 10 }, { label: 'Product ownership', w: 11 } ] }
            ],
            note: 'Block sizes are illustrative shares, not estimates.' },
          detail: [],
          implication: 'Token cost is one component of total cost, not the business case.' }
      ] },

    // ───────────────────────────── 2 METHODS, CONTROL & ASSURANCE ─────────────────────────────
    { id: 'methods', key: '2', label: 'Methods, Control & Assurance', icon: 'ti-shield-check', kind: 'control',
      question: 'How is the work done, judged and governed?',
      trigger: '"What does the AI decide?"',
      pages: [
        { id: 'appendix-m1', code: 'M1', kind: 'control', status: 'target',
          title: 'Which capability handles which work?',
          answer: 'Six questions decide the path: recurrence, systems, materiality, action, method stability and monitoring.',
          visual: { type: 'grid', corner: 'Question', columns: ['Ask', 'Use', 'Run', 'Create'],
            products: ['Ask the records', 'Work Hub', 'Processes', 'Agents'],
            rows: [
              ['One-off or recurring?', 'One-off help', 'Recurring task', 'Recurring process', 'New or temporary need'],
              ['Several systems?', 'Current context', 'The app\'s approved sources', 'Yes, across systems', 'Yes, selected sources'],
              ['Material output?', 'No, a draft', 'Yes, with a decision', 'Yes, at the gates', 'Draft until reviewed'],
              ['System action required?', 'No', 'Bounded task actions', 'Approved automated steps', 'Read and draft by default'],
              ['Method stable and approved?', 'Not needed', 'Yes', 'Yes', 'Not yet'],
              ['Persistent monitoring?', 'No', 'Task quality and control', 'Process, runtime and control', 'Scheduled runs, under review']
            ] },
          detail: [
            { title: 'Governance follows authority', items: ['Ask: the user reviews the output', 'Use: a human gate at the material decision', 'Run: configured control gates and runtime monitoring', 'Create: inherited access, read and draft by default, review before publication'] }
          ],
          implication: 'Not every question needs an agent. Not every agent should become an application.' },

        { id: 'appendix-m2', code: 'M2', kind: 'control', status: 'target',
          title: 'Why small methods, not one large model?',
          answer: 'Each step does one job with a defined input, output and error rate, so it can be tested, challenged and reused.',
          visual: { type: 'methods',
            types: [
              { id: 'rule', label: 'Deterministic', items: ['Count', 'Join', 'Set difference', 'Threshold', 'Date logic'] },
              { id: 'model', label: 'Narrow AI-assisted', items: ['Extract', 'Classify', 'Compare text', 'Map clauses', 'Draft'] },
              { id: 'human', label: 'Human judgement', items: ['Materiality', 'Challenge', 'Risk acceptance', 'Treatment'] }
            ],
            exampleTitle: 'Worked example: which controls duplicate across our entities?',
            example: [
              { kind: 'model', label: 'Extract controls' },
              { kind: 'model', label: 'Normalise descriptions' },
              { kind: 'rule', label: 'Calculate similarity candidates' },
              { kind: 'rule', label: 'Verify source and ownership' },
              { kind: 'model', label: 'Challenge: duplicate or deliberate?' },
              { kind: 'human', label: 'Human accepts, rejects or merges' },
              { kind: 'rule', label: 'Finding with evidence and provenance' }
            ] },
          detail: [
            { title: 'Why it matters', items: ['Model risk is judged step by step, not in one lump', 'The plan is visible: which steps ran, in what order, what each produced, where a person signed', 'The same blocks serve a new register or regulation in a different order'] }
          ],
          implication: 'Each step can be tested and challenged.' },

        { id: 'appendix-m3', code: 'M3', kind: 'control', status: 'concept',
          title: 'Which methods exist?',
          answer: 'A catalogue of method pools, each a small chain of steps assembled per question.',
          visual: { type: 'pools', pools: [
            { label: 'Inventory reconciliation', purpose: 'Redundancy and harmonisation: the same control, twice', steps: ['Extract', 'Compare', 'Resolve', 'Judge'] },
            { label: 'Description quality', purpose: 'Completeness and quality scoring against a standard', steps: ['Extract', 'Link', 'Score', 'Rewrite'] },
            { label: 'Map and gap', purpose: 'Obligations, frameworks and policy against coverage', steps: ['Extract', 'Assess', 'Resolve', 'Draft'] },
            { label: 'Assessment challenge', purpose: 'RCSA, ratings, evidence and rationale', steps: ['Extract', 'Compare', 'Challenge'] },
            { label: 'Third-party and resilience signals', purpose: 'Deterioration, concentration and evidence freshness', steps: ['Extract', 'Compare', 'Rank', 'Explain'], live: true }
          ] },
          detail: [],
          implication: 'A new question reuses the same blocks in a different order.' },

        { id: 'appendix-m4', code: 'M4', kind: 'control', status: 'concept',
          title: 'What does each analysis function do?',
          answer: 'Five functions, each with allowed inputs, an expected output, a quality measure and a condition that escalates to a person.',
          visual: { type: 'grid', corner: 'Function', columns: ['Allowed inputs', 'Expected output', 'Kind', 'Quality measure', 'Escalates when'],
            rows: [
              ['Extract', 'Source documents and records', 'Structured items with citations', 'AI-assisted, checked', 'Precision and recall', 'A source cannot be read or cited'],
              ['Verify', 'An extracted item and its source', 'Confirmed or rejected link', 'Deterministic first', 'Citation correctness', 'The source does not support the claim'],
              ['Judge', 'Verified items and the method', 'A proposed verdict with reasons', 'AI-assisted', 'Agreement with experts', 'Confidence is low or the case is material'],
              ['Challenge', 'The proposed verdict', 'The strongest counter-argument', 'AI-assisted', 'Disagreement found', 'The counter-argument holds'],
              ['Synthesise', 'Verdicts, evidence and gaps', 'A decision brief for the professional', 'AI-assisted, then human', 'Completeness of the brief', 'Reviewed before every decision']
            ] },
          detail: [],
          implication: 'The functions prepare; the professional decides on what they prepare.' },

        { id: 'appendix-m5', code: 'M5', kind: 'control', status: 'target',
          title: 'How are methods evaluated and assured?',
          answer: 'Each method is evaluated for its own task before use, then monitored in operation with named owners for incidents.',
          visual: { type: 'groups', groups: [
            { label: 'Method evaluation', icon: 'ti-file-check', items: ['Extraction precision and recall', 'Citation correctness', 'Relationship-mapping accuracy', 'Material-change detection recall', 'False positive rate'] },
            { label: 'Human control', icon: 'ti-user-check', items: ['Human disagreement rate', 'Abstention appropriateness', 'Override reasons', 'Missed control gates'] },
            { label: 'Reproducibility', icon: 'ti-refresh', items: ['Same input, same output', 'Complete audit replay', 'Model, prompt, rule and data versions'] },
            { label: 'Runtime and outcomes', icon: 'ti-chart-line', items: ['Availability and latency', 'Cost and failed runs', 'Case completeness', 'Rework and cycle time'] }
          ],
            ownersTitle: 'Incident response and pause',
            owners: [
              ['Product owner', 'Pauses a capability and decides on restart'],
              ['Platform owner', 'Operates the technical stop'],
              ['Control owner', 'Confirms the manual fallback runs'],
              ['Second line', 'Reviews the incident and the restart conditions']
            ] },
          detail: [
            { title: 'Minimum before go-live', items: ['Explainable outputs with sources for every material statement', 'Immutable audit trail: inputs, outputs, versions, actor', 'Named owner for each capability', 'Tested on representative cases, with error analysis', 'Human override available at every gate', 'Manual fallback documented and rehearsed'] }
          ],
          implication: 'Assurance is an operating discipline with owners, not a launch checklist.' },

        { id: 'appendix-m6', code: 'M6', kind: 'control', status: 'target',
          title: 'What belongs to AI, rules and people?',
          answer: 'AI prepares, deterministic rules constrain, and named people hold every material judgement.',
          visual: { type: 'columns', columns: [
            { id: 'ai', label: 'AI-assisted', icon: 'ti-wand', items: ['Retrieve and summarise evidence', 'Extract and compare information', 'Identify anomalies and changes', 'Draft findings and actions', 'Explain the sources'] },
            { id: 'rules', label: 'Deterministic rules and services', icon: 'ti-route', items: ['Entitlements', 'Mandatory evidence checks', 'Thresholds and routing', 'Workflow state and approval routes', 'Write-back constraints and audit logging'] },
            { id: 'human', label: 'Human authority', icon: 'ti-user-check', items: ['Challenge the evidence', 'Determine materiality', 'Approve the risk conclusion', 'Accept, reject or amend treatment', 'Approve material system changes'] }
          ],
            principlesTitle: 'Principles',
            principles: ['Authority is not inferred from access', 'Approvals stay attributable to a named role', 'Shared evidence does not remove independent challenge', 'No silent write-back', 'Manual fallback stays available'] },
          detail: [],
          implication: 'AI prepares. Rules constrain. Professionals decide. Systems record.' },

        { id: 'appendix-m7', code: 'M7', kind: 'control', status: 'demonstrated',
          title: 'How does governed write-back work?',
          answer: 'Every material action is resolved, checked, previewed, approved by name, executed by a governed connector, confirmed and recorded.',
          visual: { type: 'flow',
            steps: ['Recommendation', 'Target record resolved', 'User entitlement checked', 'Policy and action constraints checked', 'Before and after preview', 'Named approval', 'Connector executes', 'Source system confirms', 'Workspace state changes', 'Audit receipt issued'],
            human: [5], record: [7, 8, 9],
            stripTitle: 'When something fails',
            strip: ['Connector fails: nothing changes; retry or manual fallback', 'Source rejects: shown to the user, case unchanged', 'Partial write: compensating action, then review', 'Duplicate request: idempotent, applied once', 'Approval expires: preview again'] },
          detail: [],
          implication: 'The source record changes only after the permitted human approves it.' },

        { id: 'appendix-m8', code: 'M8', kind: 'control', status: 'target',
          title: 'How does an ad hoc agent become managed capability?',
          answer: 'Through gated stages, each with more ownership and review, with periodic revalidation and retirement built in.',
          visual: { type: 'lifecycle',
            stages: [
              { label: 'Run once', points: ['Private', 'Explicit sources and permissions', 'Read, analyse and draft', 'Full trace'] },
              { label: 'Personal agent', points: ['Reusable by its creator', 'Usage and value measured', 'No material write-back by default'] },
              { label: 'Reviewed team template', points: ['Named owner', 'Approved data and actions', 'Tested output quality'] },
              { label: 'Standard role app or automation', points: ['Stable process and control design', 'Formal release ownership', 'Approved write-back and escalation'] },
              { label: 'Revalidation or retirement', points: ['On policy or source change', 'Access revoked when roles change', 'Unused agents expire'] }
            ],
            gatesTitle: 'Promotion gates',
            gates: ['Recurrence', 'Materiality', 'Data sensitivity', 'Reliability', 'Named owner', 'Support model', 'Demonstrated value', 'Approved authority boundaries'],
            retireTitle: 'Retirement',
            retire: ['Superseded templates archived', 'Revalidated after source or policy change'] },
          detail: [],
          implication: 'Agility for the long tail, with a controlled path to standard capability and a way out.' }
      ] },

    // ───────────────────────────── 3 DATA, KNOWLEDGE & SYSTEMS ─────────────────────────────
    { id: 'data', key: '3', label: 'Data, Knowledge & Systems', icon: 'ti-database', kind: 'technical',
      question: 'How does it connect, and where do the facts come from?',
      trigger: '"Is this replacing our GRC?"',
      pages: [
        { id: 'appendix-d1', code: 'D1', kind: 'technical', status: 'target',
          title: 'What sits between the experience and the systems?',
          answer: 'Four layers: the Workspace, a runtime gateway, approved execution services, and the authoritative systems that keep the record.',
          visual: { type: 'layers', layers: [
            { label: 'NFR Workspace', note: 'Experience', items: ['Role experience', 'Role apps', 'Insights', 'Decisions', 'Write-back preview', 'Agents'] },
            { label: 'NFR runtime gateway', note: 'Stable contract', items: ['Identity mapping', 'Case context', 'Output validation', 'Approvals', 'Audit correlation', 'Runtime abstraction'] },
            { label: 'Approved execution services', note: 'Execution', items: ['Analytics', 'Reusable NFR methods', 'Agents', 'Workflows and triggers', 'Rules', 'Memory and knowledge', 'Monitoring and cost control'] },
            { label: 'Authoritative systems', note: 'System of record', items: ['GRC', 'Policy', 'Issues', 'Incidents', 'Third parties', 'Evidence stores', 'Process and entity masters'] }
          ] },
          detail: [],
          implication: 'Keep the design runtime-pluggable and system-of-record neutral: no single runtime is a mandatory dependency.' },

        { id: 'appendix-d2', code: 'D2', kind: 'technical', status: 'target',
          title: 'How do the systems connect?',
          answer: 'Four patterns, each with its own latency, entitlement source, provenance and failure handling.',
          visual: { type: 'grid', corner: 'Pattern', columns: ['Typical latency', 'Entitlement source', 'Provenance kept', 'Failure handling'],
            rows: [
              ['Query', 'On demand', 'The user\'s access in the source', 'Source IDs and as-of dates', 'Show stale or missing data; do not fill it'],
              ['Event', 'Near real time or batch', 'Service account, scoped to the event', 'Event ID, source and time', 'Deduplicate, retry, alert the owner'],
              ['Evidence ingestion', 'Batch or on demand', 'Document permissions', 'Version, source, owner and validity', 'Quarantine unreadable or unverified files'],
              ['Transactional write-back', 'Transactional', 'The approving user, through a governed connector', 'Before and after, approval, receipt', 'Nothing changes on failure; manual fallback']
            ] },
          detail: [
            { title: 'Typical systems and patterns', items: ['GRC, risk and control: query, event, write-back', 'Third-party inventory and sourcing: query, event, write-back', 'Incidents and resilience: query, event', 'Issues and actions: query, event, write-back', 'Policy and obligations: query, ingestion', 'Documents and evidence: ingestion, query', 'Identity and access: query', 'Collaboration: event, write-back', 'Data and analytics: query'] }
          ],
          implication: 'Design each connection for its pattern; not every system needs every pattern.' },

        { id: 'appendix-d3', code: 'D3', kind: 'technical', status: 'target',
          title: 'What context travels through the Workspace?',
          answer: 'One context contract, shared by questions, the Work Hub, processes and agents, so every step works in the same scope.',
          visual: { type: 'envelope', title: 'NFR context contract',
            groups: [
              { label: 'Who', items: ['User and role', 'Organisation and legal entity'] },
              { label: 'Which case', items: ['Case ID and case type', 'Process state', 'Risk, control, service and provider references'] },
              { label: 'On what basis', items: ['Evidence references and versions', 'Policy and method version', 'As-of date'] },
              { label: 'What is allowed', items: ['Permitted actions', 'Required approvals', 'Sensitivity classification'] },
              { label: 'How it is traced', items: ['Source-system identifiers', 'Audit correlation ID'] }
            ],
            route: ['Ask the records', 'Work Hub', 'Processes', 'Agents', 'Governed connectors'] },
          detail: [],
          implication: 'This is why the Workspace is more than a chat interface: the case, not the conversation, carries the work.' },

        { id: 'appendix-d4', code: 'D4', kind: 'technical', status: 'concept',
          title: 'What is the connected NFR core?',
          answer: 'A relationship layer over the authoritative records: obligations, policies, risks, controls, evidence, assessments and decisions, linked with provenance.',
          visual: { type: 'graph', w: 1000, h: 330,
            nodes: [
              { id: 'obl', label: 'Obligation', x: 80, y: 40, g: 'risk' },
              { id: 'pol', label: 'Policy', x: 290, y: 40, g: 'risk' },
              { id: 'risk', label: 'Risk', x: 500, y: 40, g: 'risk' },
              { id: 'proc', label: 'Process or service', x: 710, y: 40, g: 'svc' },
              { id: 'ctl', label: 'Control', x: 920, y: 40, g: 'risk' },
              { id: 'own', label: 'Owner', x: 290, y: 160, g: 'org' },
              { id: 'ev', label: 'Evidence', x: 920, y: 160, g: 'ev' },
              { id: 'test', label: 'Test or issue', x: 710, y: 160, g: 'event' },
              { id: 'asm', label: 'Assessment', x: 80, y: 280, g: 'org' },
              { id: 'dec', label: 'Decision', x: 290, y: 280, g: 'event' },
              { id: 'act', label: 'Action', x: 500, y: 280, g: 'event' },
              { id: 'acc', label: 'Acceptance', x: 710, y: 280, g: 'event' }
            ],
            edges: [['obl', 'pol', 'implemented_by'], ['pol', 'risk', 'applies_to'], ['risk', 'proc', 'affects'], ['proc', 'ctl', 'mitigated_by'], ['pol', 'own', 'owned_by'],
              ['ctl', 'ev', 'evidenced_by'], ['ctl', 'test', 'tested_by'], ['asm', 'dec', 'informs'], ['dec', 'act', 'creates'], ['act', 'acc', 'closes_or_accepts'], ['asm', 'obl', 'assesses']],
            carries: ['Source system', 'Source record ID', 'Version', 'Provenance', 'Ownership'] },
          detail: [],
          implication: 'The connected core is a semantic relationship layer. Authoritative records remain in their source systems.' },

        { id: 'appendix-d5', code: 'D5', kind: 'technical', status: 'concept',
          title: 'When does a knowledge graph add value?',
          answer: 'When the question depends on multi-hop relationships across systems. For lists, lookups and single-system work it adds nothing.',
          visual: { type: 'decision',
            yes: { label: 'A graph adds value', items: ['Which critical services share an underlying fourth party?', 'Which controls and evidence does a new obligation affect?', 'Which incidents, issues, controls and actions cluster around one process?', 'Which attestations rely on a control with stale evidence?', 'Which decisions were based on a superseded policy version?'] },
            no: { label: 'A graph may be unnecessary', items: ['Simple case lists', 'Direct record lookup', 'A single-system workflow', 'Basic aggregation', 'A temporary analysis with no reusable relationship model'] } },
          detail: [],
          implication: 'Use a graph for relationships and impact, not as a replacement for structured systems.' },

        { id: 'appendix-d6', code: 'D6', kind: 'technical', status: 'concept',
          title: 'What would the graph model contain?',
          answer: 'The entities NFR work already uses, joined by named relationships, each carrying its source, version and review status.',
          visual: { type: 'graph',
            nodes: [
              { id: 'le', label: 'Legal entity', x: 80, y: 40, g: 'org' },
              { id: 'bu', label: 'Business unit', x: 80, y: 130, g: 'org' },
              { id: 'proc', label: 'Process', x: 80, y: 220, g: 'org' },
              { id: 'inc', label: 'Incident', x: 80, y: 310, g: 'event' },
              { id: 'iss', label: 'Issue', x: 80, y: 400, g: 'event' },
              { id: 'own', label: 'Owner', x: 520, y: 40, g: 'org' },
              { id: 'tp', label: 'Third party', x: 520, y: 130, g: 'svc' },
              { id: 'app', label: 'Application', x: 520, y: 220, g: 'svc' },
              { id: 'ra', label: 'Risk acceptance', x: 520, y: 310, g: 'event' },
              { id: 'ctl', label: 'Control', x: 520, y: 400, g: 'risk' },
              { id: 'svc', label: 'Critical service', x: 300, y: 220, g: 'svc' },
              { id: 'risk', label: 'Risk', x: 300, y: 310, g: 'risk' },
              { id: 'act', label: 'Action', x: 300, y: 400, g: 'event' },
              { id: 'fp', label: 'Fourth party', x: 740, y: 130, g: 'svc' },
              { id: 'ev', label: 'Evidence', x: 740, y: 310, g: 'ev' },
              { id: 'pol', label: 'Policy', x: 740, y: 400, g: 'risk' },
              { id: 'dec', label: 'Decision', x: 920, y: 220, g: 'event' },
              { id: 'test', label: 'Test', x: 920, y: 310, g: 'ev' },
              { id: 'obl', label: 'Obligation', x: 920, y: 400, g: 'risk' }
            ],
            edges: [
              ['le', 'bu', 'owned_by'], ['bu', 'proc', 'owns'], ['proc', 'svc', 'supports'], ['tp', 'svc', 'provided_by'],
              ['tp', 'fp', 'depends_on'], ['svc', 'app', 'depends_on'], ['svc', 'risk', 'affected_by'], ['risk', 'ctl', 'mitigates'],
              ['ctl', 'pol', 'applies_to'], ['pol', 'obl', 'supersedes'], ['ctl', 'ev', 'evidenced_by'], ['ev', 'test', 'tested_by'],
              ['inc', 'risk', 'affected_by'], ['inc', 'iss', 'creates'], ['iss', 'act', 'closes'],
              ['risk', 'ra', 'approved_by'], ['tp', 'own', 'owned_by'], ['dec', 'ev', 'evidenced_by']
            ],
            carries: ['Source system', 'Source record ID', 'Source version', 'Valid from and to', 'Ingestion date', 'Provenance', 'Classification', 'Ownership', 'Confidence if derived', 'Review status if inferred'] },
          detail: [],
          implication: 'The graph is a relationship layer; authoritative records stay in their source systems.' },

        { id: 'appendix-d7', code: 'D7', kind: 'technical', status: 'concept',
          title: 'How is the graph built safely?',
          answer: 'Incrementally, starting from the first journey, with derived links treated as proposals until reviewed.',
          visual: { type: 'phases', phases: [
            { label: 'Stable identifiers', points: ['Master-data links', 'Critical entities mapped', 'Source record IDs'] },
            { label: 'Curated relationships', points: ['Only what the first journey needs', 'Validated with business owners'] },
            { label: 'Document-derived candidates', points: ['Extracted with confidence', 'Material or uncertain links reviewed'] },
            { label: 'Events and versioning', points: ['React to source changes', 'Version every link'] },
            { label: 'Quality and lineage', points: ['Quality monitoring', 'Impact analysis', 'Lineage checks'] }
          ],
            qualityTitle: 'Quality controls',
            quality: ['Entity resolution precision', 'Orphan and duplicate detection', 'Invalid relationship checks', 'Provenance completeness', 'Source freshness', 'Confidence thresholds', 'Human validation of material derived links'] },
          detail: [],
          implication: 'Do not load all NFR data into a graph before a use case is proven.' },

        { id: 'appendix-d8', code: 'D8', kind: 'technical', status: 'demonstrated',
          title: 'How does a question become a visual answer?',
          answer: 'Governed data services calculate the facts; a validated insight schema shapes the answer; the model helps interpret and explain.',
          visual: { type: 'pipeline',
            steps: ['Natural-language question', 'Identity, role and entitlement', 'Intent, entities, period and output', 'Query and method plan', 'Records, documents, relationships and rules', 'Calculated facts', 'Validated insight schema', 'Conclusion, KPIs, chart, drivers, evidence, actions', 'Audit and optional write-back'],
            modelSteps: [2, 3],
            schemaTitle: 'Insight schema', schema: ['Conclusion', 'Metrics', 'Chart type and data', 'Ranked drivers', 'Time period', 'Comparison baseline', 'Evidence references', 'Uncertainty and missing data', 'Recommended actions', 'Permitted write-backs'],
            modesTitle: 'Retrieval modes', modes: [
              ['Structured query', 'Exact records and metrics'],
              ['Relationship traversal', 'Dependencies and impact'],
              ['Document retrieval', 'Unstructured evidence'],
              ['Deterministic rules', 'Thresholds and policy logic']
            ] },
          detail: [],
          implication: 'The model may interpret and explain. Governed data services calculate the facts.' },

        { id: 'appendix-d9', code: 'D9', kind: 'technical', status: 'target',
          title: 'How are entitlements, provenance and audit kept?',
          answer: 'Identity flows to every query and action, read and write are separate permissions, and every answer and action carries its sources and versions.',
          visual: { type: 'flow',
            steps: ['Inherited user access', 'Service accounts only for bounded automation', 'Read and write permissions kept separate', 'Record- and field-level controls', 'Source citation and version', 'External documents treated as data, not instructions', 'Model, prompt, rule and data versions stored', 'One correlation ID across question, run, action and receipt'],
            human: [], record: [6, 7],
            stripTitle: 'Retention',
            strip: ['Retention by classification', 'Masking where required', 'Supervisory retrieval where required'] },
          detail: [],
          implication: 'The Workspace inherits and enforces access. It does not create new access.' }
      ] },

    // ───────────────────────────── 4 DELIVERY, SCALE & CREDENTIALS ─────────────────────────────
    { id: 'delivery', key: '4', label: 'Delivery, Scale & Credentials', icon: 'ti-stack-2', kind: 'delivery',
      question: 'How do we start, who runs it, and how does it grow?',
      trigger: '"What do we commit to first?"',
      pages: [
        { id: 'appendix-s1', code: 'S1', kind: 'delivery', status: 'practice',
          title: 'What happens in the five-week qualification?',
          answer: 'Three phases with one gate: baseline the question and data, configure and fit the methods, then run, challenge and decide.',
          visual: { type: 'sprint', weeks: ['W1', 'W2', 'W3', 'W4', 'W5'],
            phases: [
              { label: 'Baseline', from: 0, to: 1, items: ['Kick-off: goals and scope', 'Map controls, processes and policy hierarchy', 'Data onboarding and a pilot run'], output: 'Architecture and process map, data model' },
              { label: 'Configure', from: 2, to: 2, items: ['Fit-gap against the existing methods', 'Calibrate, first statistics'], output: 'Fit-gap and first statistics', gate: 'Fit gate' },
              { label: 'Challenge', from: 3, to: 4, items: ['Full representative run', 'Expert challenge, targeted re-runs', 'Synthesis and recommendation'], output: 'Validated findings, value case, six-month roadmap' }
            ],
            teamTitle: 'Team',
            team: [['Initiative lead', 'Sponsor; opens, attends the gate, presents'], ['Risk subject-matter expert', 'Owns the challenge that makes findings defensible'], ['Engagement lead', 'Runs delivery; single point of contact'], ['AI specialist', 'Builds and runs the methods, with a risk background']] },
          detail: [
            { title: 'Outputs', items: ['Current-state architecture and process map', 'Target role and decision', 'Source and entitlement map', 'Method fit-gap', 'First statistics or findings', 'Risk and control boundary', 'Value baseline', 'Six-month roadmap to a live process'] }
          ],
          implication: 'Five weeks proves fit and value before the operating model is built.' },

        { id: 'appendix-s2', code: 'S2', kind: 'delivery', status: 'concept',
          title: 'What happens in the six months live?',
          answer: 'Three layers move together through three phases and four gates, on real or production-representative cases.',
          visual: { type: 'lanes',
            heads: ['Months 0 to 2', 'Months 2 to 4', 'Months 4 to 6'],
            lanes: [
              { label: 'Work & roles', steps: ['Role, decisions and authority', 'Test the journey and handoffs', 'Embed and measure adoption'] },
              { label: 'Process & controls', steps: ['Case map, evidence and gates', 'Automate bounded steps', 'Operate and prove control'] },
              { label: 'Data & platform', steps: ['Sources, access and the approved path', 'Integrations, methods and audit', 'Harden, monitor and reuse'] }
            ],
            gatesTitle: 'Gates', gates: ['Process and data viability', 'Output quality', 'Control readiness', 'Live or representative proof'],
            entryTitle: 'Entry conditions', entry: ['A qualified journey', 'Named business and process owner', 'Representative cases and source access', 'Approved platform route', 'Agreed AI, rules and human boundary', 'Agreed proof thresholds'] },
          detail: [],
          implication: 'Six months proves one live process, not an enterprise platform.' },

        { id: 'appendix-s3', code: 'S3', kind: 'delivery', status: 'target',
          title: 'What is reusable, and what is journey-specific?',
          answer: 'The foundation and the NFR methods are reused and owned centrally; each journey designs its own mapping, rules, roles and actions.',
          visual: { type: 'bands', bands: [
            { id: 'platform', label: 'Reusable foundation', owner: 'Platform owner', items: ['Identity and entitlement', 'Audit', 'Context contract', 'Connector framework', 'Insight renderer', 'Evaluation framework', 'Approval component', 'Write-back service', 'Monitoring'] },
            { id: 'nfr', label: 'Reusable NFR methods', owner: 'Method owner', items: ['Inventory reconciliation', 'Description quality', 'Map and gap', 'Assessment challenge', 'Third-party signals'] },
            { id: 'journey', label: 'Journey-specific', owner: 'Process owner', items: ['Data mapping', 'Methodology and rules', 'Role experience', 'Exceptions', 'Approval routing', 'Source-system actions', 'Evaluation set'] }
          ] },
          detail: [],
          implication: 'Measure reuse; do not assume it.' },

        { id: 'appendix-s4', code: 'S4', kind: 'delivery', status: 'concept',
          title: 'Who owns and operates it?',
          answer: 'Named accountabilities across the business, process, control, data, platform and model, with independent assurance kept separate.',
          visual: { type: 'raci', columns: ['Delivery', 'Operation', 'Decision authority', 'Independent challenge', 'Technical support'],
            rows: [
              ['NFR business owner', [0, 0, 1, 0, 0]],
              ['Process owner', [1, 1, 1, 0, 0]],
              ['Control owner', [0, 1, 1, 0, 0]],
              ['Data owner', [0, 1, 0, 0, 1]],
              ['Platform owner', [1, 1, 0, 0, 1]],
              ['AI and model owner', [1, 1, 0, 0, 1]],
              ['Technology operations', [0, 1, 0, 0, 1]],
              ['Independent risk and assurance', [0, 0, 0, 1, 0]],
              ['Change and adoption lead', [1, 0, 0, 0, 0]]
            ] },
          detail: [],
          implication: 'No single team owns the whole process in a way that removes lines-of-defence independence.' },

        { id: 'appendix-s5', code: 'S5', kind: 'delivery', status: 'option',
          title: 'How can we bring this in?',
          answer: 'Three options on the same methods: a managed diagnostic, a dedicated managed environment, or a client deployment.',
          visual: { type: 'options', options: [
            { label: 'A. Managed diagnostic', sub: 'We run a bounded analysis with you', items: ['Bounded scope in an agreed secure environment', 'Limited initial client technology dependency; architecture involved early', 'Data handling and deletion agreed up front', 'Expert challenge included', 'Output: findings and a roadmap, not a production workflow'] },
            { label: 'B. Dedicated managed environment', sub: 'Operated for you', items: ['Dedicated instance in an approved jurisdiction or cloud', 'You control identity and data access', 'Recurring runs and team use', 'Operating and outsourcing controls agreed'] },
            { label: 'C. Client deployment', sub: 'On your infrastructure', items: ['Your infrastructure and model gateway', 'Integrated with enterprise systems', 'Client-owned operations after enablement', 'Ongoing method and product support'] }
          ] },
          detail: [],
          implication: 'Reusable methods and patterns are adapted to the target control and technology environment; nothing transfers unchanged.' },

        { id: 'appendix-s6', code: 'S6', kind: 'delivery', status: 'concept',
          title: 'How does it scale across the portfolio?',
          answer: 'From one question to a portfolio, one bounded step at a time, with reuse measured rather than assumed.',
          visual: { type: 'waves', waves: [
            { label: 'One question', text: 'Qualified in five weeks' },
            { label: 'One bounded journey', text: 'One live process in six months' },
            { label: 'Reusable methods and connectors', text: 'Shared across adjacent journeys' },
            { label: 'Multiple role apps', text: 'Standard apps, monitored agents, common automations' },
            { label: 'Portfolio-wide NFR Workspace', text: 'Shared context across domains' }
          ],
            criteriaTitle: 'Constraints',
            criteria: ['Modular domains', 'Isolated releases', 'Explicit ownership', 'No single uncontrolled failure domain', 'Measured reuse'] },
          detail: [],
          implication: 'Each step is earned by evidence from the one before.' }
      ] }
  ];

  var APPENDIX = {
    kinds: KINDS,
    status: STATUS,
    edition: 'public',
    modules: MODULES,
    index: { id: 'appendix', title: 'Appendix: four doors into the detail', sub: 'Open a door when a buyer asks. Each page answers one question and returns to the story.' },
    extras: [
      { id: 'live-fallback', label: 'Product walkthrough, captured from the live product', icon: 'ti-device-desktop' },
      { id: 'app-team', label: 'Team and credentials', icon: 'ti-users' },
      { id: 'ref-room', label: 'Reference library (Evidence Atlas)', icon: 'ti-book' }
    ]
  };

  // Internal edition only: append pages to modules (never present in the public build)
  var X = global.NFR_APPENDIX_INTERNAL;
  if (X && X.pages) {
    APPENDIX.edition = 'internal';
    MODULES.forEach(function(m) { (X.pages[m.id] || []).forEach(function(p) { m.pages.push(p); }); });
  }

  APPENDIX.pages = [];
  MODULES.forEach(function(m) { m.pages.forEach(function(p, i) { APPENDIX.pages.push({ id: p.id, code: p.code, module: m.id, index: i, title: p.title, answer: p.answer, internal: !!p.internal }); }); });

  var FROZEN = deepFreeze(APPENDIX);
  global.NFR_APPENDIX = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
