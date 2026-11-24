// -- APPENDIX MODULES -- v6 --
// The buyer-led appendix: four modules, one question per page. Every page has a question
// as its title, a short answer, one main visual, a decision implication, a claim status
// and optional detail. assets/js/story/appendix-modules.js renders them; pitch.html holds
// one section shell per page (id = page.id). Synthetic, bank-neutral, public-safe: no
// internal asset is named. Exposes window.NFR_APPENDIX and module.exports (tests).

(function(global) {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(k) { var v = obj[k]; if (v && typeof v === 'object') deepFreeze(v); });
    return Object.freeze(obj);
  }

  var KINDS = { strategic: 'Strategic', economic: 'Economic', control: 'Control', technical: 'Technical' };
  var STATUS = {
    demonstrated: 'Shown in the live product',
    target: 'Target design',
    illustrative: 'Illustrative, synthetic figures',
    practice: 'Delivery practice',
    concept: 'Concept for validation'
  };

  var MODULES = [
    // ───────────────────────────── 1 VALUE & ECONOMICS ─────────────────────────────
    { id: 'value', key: '1', label: 'Value & Economics', icon: 'ti-chart-bar', kind: 'economic',
      question: 'Is this worth funding, and where do we start?',
      trigger: '"What is the business case?"',
      pages: [
        { id: 'appendix-v1', code: 'V1', kind: 'strategic', status: 'concept',
          title: 'Where should we start?',
          answer: 'With a bounded journey where the operating pain is real, the work is standardised enough and the outcome can be measured.',
          visual: { type: 'matrix',
            x: 'Standardisation and data readiness', y: 'Operating pain: volume, integration burden, delay',
            zones: [
              { id: 'start', label: 'Start now', pos: 'tr' },
              { id: 'prepare', label: 'Prepare data and process first', pos: 'tl' },
              { id: 'human', label: 'Retain as human-led specialist work', pos: 'bl' },
              { id: 'defer', label: 'Defer', pos: 'br' }
            ],
            items: [
              { label: 'Periodic third-party review', x: 78, y: 82, pick: true },
              { label: 'Risk acceptance renewal', x: 70, y: 64 },
              { label: 'KRI breach explanation', x: 84, y: 58 },
              { label: 'Issue and action follow-up', x: 62, y: 72 },
              { label: 'RCSA preparation', x: 34, y: 78 },
              { label: 'Regulatory change impact', x: 22, y: 66 },
              { label: 'Third-party onboarding', x: 40, y: 58 },
              { label: 'Scenario analysis', x: 18, y: 26 },
              { label: 'Incident root-cause challenge', x: 30, y: 38 },
              { label: 'Policy attestation reminders', x: 82, y: 22 }
            ] },
          detail: [
            { title: 'Scoring criteria', items: ['Case volume and frequency', 'Manual integration burden', 'Elapsed delay', 'Evidence fragmentation', 'Materiality', 'Degree of standardisation', 'Data readiness', 'Write-back complexity', 'Ownership clarity', 'Measurable outcome available'] },
            { title: 'Evidence needed before the first proof', items: ['Process map, approval chain and escalation logic for the journey', 'Policy, method and evidence requirements that apply', 'Source systems, data lineage and access model', 'A sample of representative historical cases', 'Current effort, cycle time and rework baseline'] }
          ],
          implication: 'Pick the first loop from the top right: real pain, a clear authority boundary and a measurable result.' },

        { id: 'appendix-v2', code: 'V2', kind: 'economic', status: 'concept',
          title: 'Where does value come from?',
          answer: 'From better risk outcomes and faster, steadier operations, with capacity redirected to judgement. Headcount is not the base case.',
          visual: { type: 'tree', root: 'Value of a controlled NFR loop',
            branches: [
              { id: 'risk', label: 'Risk outcomes', icon: 'ti-shield-check', items: ['Evidence completeness and freshness', 'Earlier material-change detection', 'More consistent policy application', 'Better challenge preparation', 'More complete decision trace', 'Issue and action follow-through'] },
              { id: 'operating', label: 'Operating performance', icon: 'ti-clock', items: ['Lower human touch time', 'Fewer handoffs', 'Less rework', 'Shorter cycle time', 'Fewer overdue reviews', 'Faster escalation'] },
              { id: 'capacity', label: 'Capacity and economics', icon: 'ti-scale', items: ['Capacity redirected to judgement', 'Lower cost per prepared case', 'Throughput without proportional staffing growth', 'Reuse of connectors, controls and platform services'] }
            ] },
          detail: [
            { title: 'Not in the base case', items: ['Avoided losses and avoided regulatory findings: real but uncertain, shown as upside only', 'Waiting time removed: reported as elapsed time, not converted into labour savings'] }
          ],
          implication: 'Lead with risk and operating outcomes; count capacity as hours returned to judgement.' },

        { id: 'appendix-v3', code: 'V3', kind: 'economic', status: 'illustrative',
          title: 'What are the unit economics?',
          answer: 'Cost per case falls when preparation removes addressable work, net of exceptions and run cost. Change the inputs; the model recalculates.',
          visual: { type: 'calculator' },
          detail: [
            { title: 'Assumptions and disclaimers', items: ['Every default is synthetic and illustrative; replace it with the client baseline before any proposal', 'Waiting time removed is not converted into labour savings', 'Avoided losses and avoided findings are excluded from the base case', 'Payback is simple payback on recurring net benefit, before ramp and financing', 'Nothing here is regulatory or legal advice'] }
          ],
          implication: 'Fund the first loop on measured capacity and operating benefit, then validate with client data in the first phase.' },

        { id: 'appendix-v4', code: 'V4', kind: 'economic', status: 'illustrative',
          title: 'How does the business case improve with reuse?',
          answer: 'The first journey pays for shared foundations. Later journeys cost less where reuse is real, but each keeps its own domain work.',
          visual: { type: 'reuse', unit: 'EUR thousand, one-off',
            bands: [
              { id: 'foundation', label: 'Shared foundation' },
              { id: 'domain', label: 'Reusable domain services' },
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
            { title: 'Shared foundation', items: ['Identity and entitlement integration', 'Runtime gateway', 'Audit and observability', 'Connector framework', 'Evidence and provenance contract', 'Common interface patterns', 'Evaluation and monitoring framework'] },
            { title: 'Reusable domain services', items: ['Policy lookup', 'Evidence classification', 'Material-change detection', 'Task and action creation', 'Document comparison', 'Reporting and visualisation'] },
            { title: 'Journey-specific work', items: ['Process logic', 'Domain rules', 'Required evidence', 'Role and approval model', 'System mapping', 'Exception paths'] }
          ],
          implication: 'Scale comes from reusable services and patterns, not from assuming every NFR process is the same.' },

        { id: 'appendix-v5', code: 'V5', kind: 'economic', status: 'illustrative',
          title: 'What does total cost include?',
          answer: 'Far more than model usage: redesign, data, connectors, assurance and ownership carry most of the cost.',
          visual: { type: 'tco',
            stacks: [
              { label: 'One-off', items: [
                { label: 'Process and control redesign', w: 14 }, { label: 'Data mapping and remediation', w: 18 }, { label: 'Connectors', w: 16 },
                { label: 'Role application', w: 18 }, { label: 'Evaluation', w: 10 }, { label: 'Security and architecture approval', w: 10 }, { label: 'Change and training', w: 14 } ] },
              { label: 'Recurring, per year', items: [
                { label: 'Model and runtime usage', w: 9, highlight: true }, { label: 'Orchestration and hosting', w: 12 }, { label: 'Connector maintenance', w: 12 },
                { label: 'Application support', w: 13 }, { label: 'Monitoring and evaluation', w: 11 }, { label: 'Data-quality ownership', w: 10 },
                { label: 'Control operation and assurance', w: 13 }, { label: 'Product ownership', w: 11 }, { label: 'Ongoing change', w: 9 } ] }
            ],
            note: 'Block sizes are illustrative shares, not estimates.' },
          detail: [],
          implication: 'Token cost is one component of total cost, not the business case.' }
      ] },

    // ───────────────────────────── 2 OPERATING MODEL & CONTROL ─────────────────────────────
    { id: 'control', key: '2', label: 'Operating Model & Control', icon: 'ti-shield-check', kind: 'control',
      question: 'Who holds authority, and how is it governed?',
      trigger: '"What does the AI decide?"',
      pages: [
        { id: 'appendix-c1', code: 'C1', kind: 'control', status: 'target',
          title: 'What belongs to AI, rules and people?',
          answer: 'AI prepares, deterministic rules constrain, and people hold every material judgement.',
          visual: { type: 'columns', columns: [
            { id: 'ai', label: 'AI-assisted', icon: 'ti-wand', items: ['Retrieve and summarise evidence', 'Compare documents and periods', 'Extract and classify information', 'Identify potential changes or gaps', 'Draft findings, questions and actions'] },
            { id: 'rules', label: 'Deterministic rules and services', icon: 'ti-route', items: ['Identity and entitlements', 'Mandatory evidence checks', 'Due dates and thresholds', 'Workflow state', 'Approval routes', 'Write-back permissions', 'Audit capture'] },
            { id: 'human', label: 'Human authority', icon: 'ti-user-check', items: ['Challenge evidence', 'Determine materiality', 'Approve risk conclusions', 'Select treatment or escalation', 'Accept residual risk where authorised', 'Approve material write-back'] }
          ] },
          detail: [],
          implication: 'AI prepares. Rules constrain. Professionals decide. Systems record.' },

        { id: 'appendix-c2', code: 'C2', kind: 'control', status: 'target',
          title: 'How is each capability governed?',
          answer: 'In proportion to its authority: assistance drafts, apps act inside a task, automations run approved steps, ad hoc agents read and draft.',
          visual: { type: 'grid', corner: 'Control dimension', columns: ['Ask', 'Use', 'Run', 'Create'],
            products: ['NFR Assist', 'NFR Apps', 'NFR Automations', 'Agent Builder'],
            rows: [
              ['Primary purpose', 'Assistance', 'Defined task', 'Repeatable process', 'Ad hoc need'],
              ['Use it when', 'Help inside current work', 'A defined role task', 'A repeatable cross-system process', 'A new or temporary multi-source need'],
              ['Context', 'User and session', 'Role, case and method', 'Event, case and state', 'User-defined scope'],
              ['Data access', 'Existing user access', 'Approved application scope', 'Service and case scope', 'Inherited access and explicit selection'],
              ['Actions', 'Draft and explain', 'Bounded task actions', 'Approved automated steps', 'Read, analyse and draft by default'],
              ['Human gate', 'User reviews the output', 'At the material decision', 'Configured control gates', 'Before material action or publication'],
              ['Monitoring', 'Usage and quality', 'Task quality and control', 'Process, runtime and control', 'Usage, scope, promotion eligibility']
            ] },
          detail: [],
          implication: 'Govern in proportion to authority, recurrence and materiality, not identically for every AI interaction.' },

        { id: 'appendix-c3', code: 'C3', kind: 'control', status: 'target',
          title: 'How does an ad hoc agent become managed capability?',
          answer: 'Through gated stages, each with more ownership and review, and with retirement built in.',
          visual: { type: 'lifecycle',
            stages: [
              { label: 'Run once', points: ['Private', 'Explicit sources and permissions', 'Read, analyse and draft', 'Full trace'] },
              { label: 'Personal agent', points: ['Reusable by its creator', 'Usage and value measured', 'No material write-back by default'] },
              { label: 'Reviewed team template', points: ['Named owner', 'Approved data and actions', 'Tested output quality', 'Support and monitoring defined'] },
              { label: 'Standard app or automation', points: ['Stable process and control design', 'Formal release ownership', 'Operational monitoring', 'Approved write-back and escalation'] }
            ],
            gatesTitle: 'Promotion gates',
            gates: ['Recurrence', 'Materiality', 'Data sensitivity', 'Action authority', 'Output quality', 'Demonstrated value', 'Named owner', 'Support and monitoring', 'Control design'],
            retireTitle: 'Retirement',
            retire: ['Unused agents expire', 'Access is revoked when roles change', 'Revalidation on source or policy change', 'Superseded templates are archived or replaced'] },
          detail: [],
          implication: 'Agility for the long tail, with a controlled path to standard capability and a way out.' },

        { id: 'appendix-c4', code: 'C4', kind: 'control', status: 'demonstrated',
          title: 'How does governed write-back work?',
          answer: 'Every material action is proposed, previewed, checked, approved, executed by a governed connector and recorded.',
          visual: { type: 'flow',
            steps: ['Proposed action', 'Target and field preview', 'Permission and policy check', 'Human gate', 'Governed connector', 'Authoritative system confirms', 'Case updated', 'Audit receipt'],
            human: [3], record: [5, 6, 7],
            strip: ['Least privilege', 'Scoped credentials', 'No credential exposure to the model', 'Maker-checker where material', 'Idempotency', 'Retries and compensating action', 'Failure visibility', 'Manual fallback', 'Attributable actor and source evidence'] },
          detail: [],
          implication: 'No AI path changes a record silently: the approval and the receipt are part of the action.' },

        { id: 'appendix-c5', code: 'C5', kind: 'control', status: 'target',
          title: 'How is the capability assured in operation?',
          answer: 'With four layers of monitoring and named owners for incidents, pausing and fallback.',
          visual: { type: 'groups', groups: [
            { label: 'Output quality', icon: 'ti-file-check', items: ['Extraction and citation accuracy', 'Material-change recall', 'Unsupported-claim rate', 'Abstention and escalation rate', 'Disagreement and override reasons'] },
            { label: 'Process control', icon: 'ti-route', items: ['Missed control gates', 'Unauthorised or failed write-backs', 'Replayability', 'Exception backlog', 'Manual fallback use'] },
            { label: 'Runtime', icon: 'ti-server', items: ['Availability', 'Latency', 'Cost', 'Failed runs', 'Repeated loops', 'Connector health'] },
            { label: 'Business outcomes', icon: 'ti-chart-line', items: ['Case completeness', 'Rework', 'Cycle time', 'Overdue population', 'Adoption', 'Capacity realised'] }
          ],
            ownersTitle: 'Incident response and pause',
            owners: [
              ['Product owner', 'Pauses a capability and decides on restart'],
              ['Platform owner', 'Operates the technical stop for a runtime or connector'],
              ['Control owner', 'Confirms the manual fallback runs'],
              ['Second line', 'Reviews the incident and the restart conditions']
            ] },
          detail: [
            { title: 'Minimum before go-live', items: ['Explainable outputs with sources for every material statement', 'Immutable audit trail: inputs, outputs, versions, actor', 'Named owner for each capability', 'Tested on representative cases, with error analysis', 'Bias, privacy and data-handling review', 'Human override available at every gate', 'Manual fallback documented and rehearsed'] }
          ],
          implication: 'Assurance is an operating discipline with owners, not a launch checklist.' }
      ] },

    // ───────────────────────────── 3 DATA, SYSTEMS & KNOWLEDGE ─────────────────────────────
    { id: 'data', key: '3', label: 'Data, Systems & Knowledge', icon: 'ti-database', kind: 'technical',
      question: 'How does it connect, and where do the facts come from?',
      trigger: '"Is this replacing our GRC?"',
      pages: [
        { id: 'appendix-d1', code: 'D1', kind: 'technical', status: 'target',
          title: 'How does the Workspace connect without replacing systems?',
          answer: 'It orchestrates work around the authoritative platforms. They keep the record; the Workspace reads, listens, ingests and writes back under control.',
          visual: { type: 'landscape', hub: 'NFR Workspace',
            patterns: { read: 'Read', event: 'Event', doc: 'Documents', write: 'Write-back' },
            systems: [
              { label: 'GRC, risk and control', p: ['read', 'event', 'write'] },
              { label: 'Third-party inventory and sourcing', p: ['read', 'event', 'write'] },
              { label: 'Incidents and resilience', p: ['read', 'event'] },
              { label: 'Issues and actions', p: ['read', 'event', 'write'] },
              { label: 'Policy and obligations', p: ['read', 'doc'] },
              { label: 'Documents and evidence', p: ['doc', 'read'] },
              { label: 'Identity and access', p: ['read'] },
              { label: 'Collaboration and communication', p: ['event', 'write'] },
              { label: 'Data and analytics', p: ['read'] }
            ] },
          detail: [
            { title: 'Classify every connection by', items: ['Authoritative source', 'Read or query', 'Event or notification', 'Document ingestion', 'Controlled write-back', 'Frequency and latency', 'Record owner', 'Entitlement source', 'Evidence and provenance requirement'] }
          ],
          implication: 'The Workspace orchestrates around authoritative platforms; it does not become an ungoverned duplicate system of record.' },

        { id: 'appendix-d2', code: 'D2', kind: 'technical', status: 'target',
          title: 'What are the integration patterns?',
          answer: 'Four, each with its own latency and its own main control.',
          visual: { type: 'grid', corner: 'Pattern', columns: ['Typical latency', 'Main control', 'Example'],
            rows: [
              ['Query', 'On demand', 'Entitlement and source attribution', 'Retrieve the current issue state'],
              ['Event', 'Near real time or batch', 'Deduplication and routing', 'A review becomes due'],
              ['Document', 'Batch or on demand', 'Version, provenance, classification', 'A new assurance report arrives'],
              ['Write-back', 'Transactional', 'Scoped permission and approval', 'Create a remediation action']
            ] },
          detail: [
            { title: 'Where each pattern is used', items: ['Query: current records and metrics', 'Event: a review falls due, an incident occurs, a KRI breaches, evidence changes', 'Document: policies, reports, contracts, test results, correspondence', 'Write-back: tasks, evidence requests, status changes, approvals, recording'] }
          ],
          implication: 'Design each connection for its pattern; not every system needs every pattern.' },

        { id: 'appendix-d3', code: 'D3', kind: 'technical', status: 'target',
          title: 'What context travels through the Workspace?',
          answer: 'One case envelope, passed between the Workspace, role apps, analytics, agents and connectors, so every step shares the same scope.',
          visual: { type: 'envelope', title: 'Case envelope',
            groups: [
              { label: 'Who', items: ['User and role', 'Organisation and legal entity'] },
              { label: 'Which case', items: ['Case ID and case type', 'Current process state', 'Relevant risks and controls'] },
              { label: 'On what basis', items: ['Evidence references and versions', 'Policy and method version', 'Time and as-of date'] },
              { label: 'What is allowed', items: ['Permitted actions', 'Required approvals', 'Data sensitivity'] },
              { label: 'How it is traced', items: ['Source-system identifiers', 'Correlation and audit IDs'] }
            ],
            route: ['Workspace', 'Role app', 'Analytical services', 'Agent runtime', 'Governed connectors'] },
          detail: [],
          implication: 'Shared context creates continuity; explicit scope stops a general assistant becoming an uncontrolled process actor.' },

        { id: 'appendix-d4', code: 'D4', kind: 'technical', status: 'concept',
          title: 'Do we need a knowledge graph?',
          answer: 'Only where the question depends on relationships across systems. For single records, metrics and workflow state, it adds nothing.',
          visual: { type: 'decision',
            yes: { label: 'A graph adds value', items: ['Which critical services depend on the same underlying provider?', 'Which controls and reviews does a policy change affect?', 'Which incidents, issues and actions cluster around one process or provider?', 'What evidence supports a risk conclusion, and where else is it used?', 'Which obligations are implemented by which policies and controls?'] },
            no: { label: 'A graph is not needed', items: ['Retrieving a single record', 'A metric already held in one governed dataset', 'Straightforward workflow state', 'Transactional write-back'] } },
          detail: [],
          implication: 'Use a graph for relationships and impact analysis, not as a replacement for structured systems.' },

        { id: 'appendix-d5', code: 'D5', kind: 'technical', status: 'concept',
          title: 'What would the NFR knowledge graph contain?',
          answer: 'The entities NFR work already uses, joined by named relationships, each carrying its source and provenance.',
          visual: { type: 'graph',
            nodes: [
              { id: 'le', label: 'Legal entity', x: 80, y: 40, g: 'org' },
              { id: 'bu', label: 'Business unit', x: 80, y: 130, g: 'org' },
              { id: 'proc', label: 'Process', x: 80, y: 220, g: 'org' },
              { id: 'svc', label: 'Critical service', x: 300, y: 220, g: 'svc' },
              { id: 'tp', label: 'Third party', x: 520, y: 130, g: 'svc' },
              { id: 'fp', label: 'Underlying provider', x: 740, y: 130, g: 'svc' },
              { id: 'app', label: 'Application', x: 520, y: 220, g: 'svc' },
              { id: 'risk', label: 'Risk', x: 300, y: 310, g: 'risk' },
              { id: 'ctl', label: 'Control', x: 520, y: 400, g: 'risk' },
              { id: 'obl', label: 'Obligation', x: 920, y: 400, g: 'risk' },
              { id: 'pol', label: 'Policy', x: 740, y: 400, g: 'risk' },
              { id: 'ev', label: 'Evidence', x: 740, y: 310, g: 'ev' },
              { id: 'test', label: 'Test', x: 920, y: 310, g: 'ev' },
              { id: 'inc', label: 'Incident', x: 80, y: 310, g: 'event' },
              { id: 'iss', label: 'Issue', x: 80, y: 400, g: 'event' },
              { id: 'act', label: 'Action', x: 300, y: 400, g: 'event' },
              { id: 'ra', label: 'Risk acceptance', x: 520, y: 310, g: 'event' },
              { id: 'own', label: 'Owner or role', x: 520, y: 40, g: 'org' },
              { id: 'dec', label: 'Decision', x: 920, y: 220, g: 'event' }
            ],
            edges: [
              ['le', 'bu', 'owns'], ['bu', 'proc', 'runs'], ['proc', 'svc', 'supports'], ['tp', 'svc', 'provides'],
              ['tp', 'fp', 'depends_on'], ['svc', 'app', 'depends_on'], ['svc', 'risk', 'exposed_to'], ['risk', 'ctl', 'mitigated_by'],
              ['ctl', 'pol', 'implements'], ['pol', 'obl', 'applies_to'], ['ctl', 'ev', 'evidenced_by'], ['ev', 'test', 'tested_by'],
              ['inc', 'risk', 'affected_by'], ['inc', 'iss', 'caused_or_contributed_to'], ['iss', 'act', 'remediated_by'],
              ['risk', 'ra', 'accepted_by'], ['tp', 'own', 'owned_by'], ['dec', 'ev', 'evidenced_by']
            ],
            carries: ['Source system', 'Source record ID', 'Valid or as-of time', 'Ingestion time', 'Provenance', 'Confidence where derived', 'Data classification', 'Ownership'] },
          detail: [],
          implication: 'The graph is a relationship layer; authoritative records stay in their source systems.' },

        { id: 'appendix-d6', code: 'D6', kind: 'technical', status: 'concept',
          title: 'How is the graph built safely?',
          answer: 'Incrementally, for one journey at a time, with derived links treated as proposals until checked.',
          visual: { type: 'phases', phases: [
            { label: 'Identity and master keys', points: ['Stable identifiers', 'Critical entities mapped', 'Source record IDs linked', 'Provenance defined'] },
            { label: 'Curated links for the first journey', points: ['Only the relationships the use case needs', 'Validated with business owners', 'No enterprise-wide ingestion'] },
            { label: 'Document-derived candidate links', points: ['Obligations, entities and relationships extracted', 'Proposed links with confidence', 'Material or uncertain links reviewed'] },
            { label: 'Change propagation and monitoring', points: ['Reacts to source events', 'Stale or contradictory links detected', 'Graph quality monitored'] }
          ],
            qualityTitle: 'Quality controls',
            quality: ['Entity resolution precision', 'Orphan and duplicate detection', 'Invalid relationship checks', 'Provenance completeness', 'Source freshness', 'Confidence thresholds', 'Human validation of material derived links'] },
          detail: [],
          implication: 'No large data programme before value: the first journey needs only its own relationships.' },

        { id: 'appendix-d7', code: 'D7', kind: 'technical', status: 'demonstrated',
          title: 'How does a question become a visual answer?',
          answer: 'Governed data services calculate the facts; a validated insight schema chooses the chart; the model helps interpret and explain.',
          visual: { type: 'pipeline',
            steps: ['Question', 'Identity and role', 'Intent and scope', 'Query plan', 'Records, graph, documents and rules', 'Calculations', 'Validated insight schema', 'Visual selection', 'Evidence links', 'Action options', 'Audit'],
            modelSteps: [2, 3],
            schemaTitle: 'Insight schema', schema: ['Conclusion', 'Metrics', 'Chart type and data', 'Ranked drivers', 'Time period', 'Comparison baseline', 'Evidence references', 'Uncertainty and missing data', 'Recommended actions', 'Permitted write-backs'],
            modesTitle: 'Retrieval modes', modes: [
              ['Structured query', 'Exact records and metrics'],
              ['Graph traversal', 'Relationships and impact'],
              ['Document retrieval', 'Unstructured evidence'],
              ['Deterministic rules', 'Thresholds and policy logic']
            ] },
          detail: [],
          implication: 'The model may help interpret and explain. Governed data services calculate the facts.' },

        { id: 'appendix-d8', code: 'D8', kind: 'technical', status: 'target',
          title: 'How are access and provenance preserved?',
          answer: 'Identity flows from the Workspace to every query and action; results are filtered before the model or the screen sees them.',
          visual: { type: 'flow',
            steps: ['User and role identity', 'Record and field entitlements checked', 'Governed connector holds the credential', 'Results filtered before model and display', 'Citations tied to source IDs and versions', 'Audit correlated across query, agent, approval, write-back', 'Retention and masking by classification'],
            human: [], record: [4, 5],
            strip: [] },
          detail: [],
          implication: 'The Workspace inherits and enforces access. It does not create new access.' }
      ] },

    // ───────────────────────────── 4 PLATFORM, DELIVERY & SCALE ─────────────────────────────
    { id: 'platform', key: '4', label: 'Platform, Delivery & Scale', icon: 'ti-stack-2', kind: 'technical',
      question: 'What sits behind it, and how does it grow?',
      trigger: '"What do we build, and who runs it?"',
      pages: [
        { id: 'appendix-p1', code: 'P1', kind: 'technical', status: 'target',
          title: 'What sits behind the Workspace?',
          answer: 'Four layers: the business experience, a runtime gateway, approved execution services and the authoritative systems.',
          visual: { type: 'layers', layers: [
            { label: 'NFR Workspace', note: 'Business experience', items: ['Role queue', 'Assist', 'Role applications', 'Agent Builder', 'Visual insights', 'Decisions and write-back preview'] },
            { label: 'NFR runtime gateway', note: 'Stable contract', items: ['Identity and role mapping', 'Context contract', 'Request and result validation', 'Approval orchestration', 'Case correlation', 'Audit correlation', 'Runtime abstraction'] },
            { label: 'Approved enterprise execution services', note: 'Execution', items: ['Analytics and query services', 'Agents and skills', 'Triggers and schedules', 'Workflow and orchestration', 'Rules', 'Memory and knowledge', 'Governed connectors', 'Monitoring and cost control'] },
            { label: 'Authoritative enterprise systems', note: 'System of record', items: ['GRC', 'Third-party inventory', 'Incidents', 'Issues and actions', 'Policy and obligations', 'Documents and evidence', 'Identity and access', 'Collaboration', 'Data and analytics'] }
          ] },
          detail: [],
          implication: 'Keep the design runtime-pluggable and system-of-record neutral.' },

        { id: 'appendix-p2', code: 'P2', kind: 'technical', status: 'target',
          title: 'What is reusable, and what is journey-specific?',
          answer: 'Platform services and NFR capabilities are reused; process stages, evidence, thresholds and authority are designed per journey.',
          visual: { type: 'bands', bands: [
            { id: 'platform', label: 'Reusable platform services', items: ['Identity', 'Audit', 'Connector framework', 'Monitoring', 'Insight renderer', 'Context contract', 'Approval service', 'Runtime gateway'] },
            { id: 'nfr', label: 'Reusable NFR capabilities', items: ['Evidence comparison', 'Policy lookup', 'Material-change detection', 'Entity resolution', 'Task and action creation', 'Visual reporting', 'Evaluation patterns'] },
            { id: 'journey', label: 'Journey-specific design', items: ['Process stages', 'Required evidence', 'Methodology', 'Thresholds', 'Roles and authority', 'Exception paths', 'Source mapping', 'Write-back targets'] }
          ] },
          detail: [],
          implication: 'Budget each new journey for its own design work; reuse lowers the rest.' },

        { id: 'appendix-p3', code: 'P3', kind: 'strategic', status: 'concept',
          title: 'How do we prove one working loop in six months?',
          answer: 'Three lanes move together and pass four gates; month six proves one complete loop on live or representative cases.',
          visual: { type: 'lanes',
            lanes: [
              { label: 'Work & roles', steps: ['Select role and decision', 'Define responsibilities and handoffs', 'Test the role journey', 'Embed in the operating cadence'] },
              { label: 'Process & controls', steps: ['Map case lifecycle and controls', 'Define the AI, rules and human boundary', 'Implement bounded automation', 'Run controlled cases and measure'] },
              { label: 'Data & platform', steps: ['Confirm sources and entitlements', 'Establish context and integration', 'Implement monitoring and audit', 'Harden the reusable foundation'] }
            ],
            gates: ['Process and data viability', 'Output quality', 'Control readiness', 'Live or representative proof'] },
          detail: [
            { title: 'Engagement principles', items: ['Evidence before design: no target state before the diagnostic evidence', 'Gate-first, not timeline-first: the next phase starts when the gate passes', 'One controlled loop before platform investment', 'Human-centred: the professional keeps authority throughout'] },
            { title: 'Example measures at the gates', items: ['Evidence completeness and freshness', 'Extraction and citation correctness', 'Material-change detection recall', 'Override or disagreement rate, with reason', 'Human touch time, rework and cycle time', 'Unsupported or unauthorised write-backs', 'Share of cases fully replayable', 'Run cost per prepared review'] }
          ],
          implication: 'A bounded proof earns the right to scale; each gate decides whether to continue.' },

        { id: 'appendix-p4', code: 'P4', kind: 'strategic', status: 'concept',
          title: 'Who owns and operates it?',
          answer: 'A named NFR product owner, with process, control, data and platform owners, and independent oversight kept separate.',
          visual: { type: 'raci', columns: ['Delivery', 'Operation', 'Decision authority', 'Second-line challenge', 'Technical support'],
            rows: [
              ['NFR product owner', [1, 1, 0, 0, 0]],
              ['Process owner', [0, 1, 1, 0, 0]],
              ['Control owner', [0, 1, 1, 0, 0]],
              ['Data owners', [0, 1, 0, 0, 1]],
              ['Platform and runtime owner', [1, 1, 0, 0, 1]],
              ['AI and model governance', [0, 0, 0, 1, 0]],
              ['Security and architecture', [1, 0, 0, 1, 0]],
              ['Application support', [0, 1, 0, 0, 1]],
              ['Independent oversight and assurance', [0, 0, 0, 1, 0]]
            ] },
          detail: [],
          implication: 'Treat it as a product with an owner, not as a project that ends at go-live.' },

        { id: 'appendix-p5', code: 'P5', kind: 'strategic', status: 'concept',
          title: 'How does it scale across the portfolio?',
          answer: 'In waves: prove one loop, reuse it for adjacent journeys, build a domain portfolio, then use shared context across domains.',
          visual: { type: 'waves', waves: [
            { label: 'Prove one loop', text: 'One role, one decision, one bounded journey' },
            { label: 'Reuse adjacent capabilities', text: 'Journeys that share evidence, systems or roles' },
            { label: 'Build the domain portfolio', text: 'Standard apps, monitored agents, common automation patterns' },
            { label: 'Cross-domain intelligence', text: 'Shared context and relationships for impact, concentration and emerging risk' }
          ],
            criteriaTitle: 'Move to the next wave when there is',
            criteria: ['Demonstrated value', 'Control effectiveness', 'Reusable components', 'Source readiness', 'Named ownership', 'Support capacity'] },
          detail: [],
          implication: 'Each wave is earned by evidence from the one before.' }
      ] }
  ];

  var APPENDIX = {
    kinds: KINDS,
    status: STATUS,
    modules: MODULES,
    index: { id: 'appendix', title: 'Appendix: four doors into the detail', sub: 'Open a door when a buyer asks. Each page answers one question and returns to the story.' },
    extras: [
      { id: 'live-fallback', label: 'Live demonstration, captured from the product', icon: 'ti-device-desktop' },
      { id: 'app-team', label: 'Team and credentials', icon: 'ti-users' },
      { id: 'ref-room', label: 'Reference library (Evidence Atlas)', icon: 'ti-book' }
    ]
  };
  APPENDIX.pages = [];
  MODULES.forEach(function(m) { m.pages.forEach(function(p, i) { APPENDIX.pages.push({ id: p.id, code: p.code, module: m.id, index: i }); }); });

  var FROZEN = deepFreeze(APPENDIX);
  global.NFR_APPENDIX = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
