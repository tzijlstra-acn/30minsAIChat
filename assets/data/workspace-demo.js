// -- NFR WORKSPACE DEMO -- synthetic content for the v2 core route --
// One immutable object. Every v2 scene reads its words and numbers from here (and the
// periodic-review facts from window.TPRM_CASE); no scene restates them in its own code.
// Everything is synthetic and bank-neutral: no client names, systems or data.
// Exposes: window.NFR_WORKSPACE_DEMO (browser) and module.exports (Node, for tests).

(function(global) {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      var value = obj[key];
      if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(obj);
  }

  var C = global.TPRM_CASE || (typeof require === 'function' ? require('./tprm-case.js') : null);

  var DEMO = {
    synthetic: true,
    product: 'NFR Workspace',
    principle: ['AI prepares.', 'Professionals decide.', 'Systems record.'],
    syntheticLabel: 'Synthetic demonstration',

    // ── The role the demo runs as ──
    role: {
      id: 'nfr-risk-manager',
      label: 'NFR Risk Manager',
      user: 'Synthetic user',
      unit: 'Third-party and operational risk',
      responsibilities: ['Challenge evidence', 'Decide on prepared cases', 'Own follow-up actions'],
      permittedActions: ['Read approved sources', 'Approve or amend conclusions', 'Create follow-up actions'],
      prohibitedActions: ['Change source records without approval', 'Accept risk above delegated authority']
    },

    // ── Four ways to work (scene four, and the authority and value tables) ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'NFR Assist', icon: 'ti-message-circle',
        line: 'Get role-steered help in email, chat, documents and the Workspace.',
        definition: 'Conversational help that uses role and case context where permitted.',
        examples: ['Summarise a policy change', 'Draft a challenge question'],
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication' },
      { id: 'app', verb: 'Use', product: 'NFR Apps', icon: 'ti-apps',
        line: 'Complete a defined NFR task with the right case, evidence, method and actions.',
        definition: 'Role app: a connected application for a defined NFR task.',
        examples: ['Third-party periodic review', 'Incident materiality assessment'],
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution' },
      { id: 'automation', verb: 'Run', product: 'NFR Automations', icon: 'ti-route',
        line: 'Move repeatable cases across systems and human control points.',
        definition: 'Automation: a controlled process that moves work between systems and people.',
        examples: ['Create a review when it falls due', 'Pause for human approval'],
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing' },
      { id: 'builder', verb: 'Create', product: 'Agent Builder', icon: 'ti-wand',
        line: 'Build a permission-aware analysis for a new or ad hoc need.',
        definition: 'Ad hoc agent: a temporary or reusable analysis inside approved permissions.',
        examples: ['One-off portfolio briefing', 'Monitor a temporary issue'],
        authority: 'Read, analyse and draft within explicit permissions',
        value: 'Faster answers to new questions, broader coverage of ad hoc work' }
    ],
    foundation: ['Same identity', 'Same permissions', 'Same evidence', 'Same control record'],

    // ── Three layers that move in parallel (scene five and the roadmap) ──
    layers: [
      { id: 'work', label: 'Work & roles', icon: 'ti-users',
        today: 'People assemble context and coordinate handoffs.',
        future: 'Each role receives prepared work and clear decision points.' },
      { id: 'process', label: 'Process & controls', icon: 'ti-route',
        today: 'AI helps single steps; controls and handoffs stay manual.',
        future: 'Bounded automations move cases through evidence, challenge, approval and recording.' },
      { id: 'platform', label: 'Data & platform', icon: 'ti-database',
        today: 'Pilots rely on isolated data and one-off integrations.',
        future: 'Reusable identity, permissions, evidence, case state, audit and monitoring.' }
    ],
    layersLine: 'Improving only the AI layer creates another pilot.',
    layersLine2: 'Scaling NFR work needs roles, processes and the platform to move together.',

    // ── Scene two: assistance is already here ──
    channels: [
      { id: 'email', label: 'Email', icon: 'ti-mail', helps: 'Drafts the reply' },
      { id: 'chat', label: 'Chat', icon: 'ti-message-circle', helps: 'Answers a question' },
      { id: 'documents', label: 'Documents', icon: 'ti-file-text', helps: 'Summarises a policy' },
      { id: 'meetings', label: 'Meetings', icon: 'ti-users', helps: 'Writes the minutes' },
      { id: 'search', label: 'Search', icon: 'ti-search', helps: 'Finds the file' }
    ],
    caseSpan: {
      label: 'One NFR case',
      systems: ['Case record', 'Evidence store', 'Policy library', 'Issue tracker', 'Approver'],
      handoffs: ['Copy', 'Chase', 'Re-check', 'Wait']
    },

    // ── Scene three: the professional still connects the process ──
    burden: [
      'Find the relevant case', 'Retrieve evidence', 'Reconcile changes', 'Apply policy and method',
      'Chase missing input', 'Prepare the decision', 'Route challenge and approval', 'Record the outcome'
    ],
    consequences: [
      { label: 'Delays', text: 'Work waits at every handoff.' },
      { label: 'Rework', text: 'Missing evidence sends cases back.' },
      { label: 'Inconsistency', text: 'Each person connects it differently.' }
    ],

    // ── Scene six: the Workspace start-up ──
    boot: {
      roleContext: 'Role context',
      statuses: ['Role and permissions', 'Approved applications', 'Connected evidence', 'Control policies and case state'],
      ready: 'Workspace ready'
    },

    // ── Application shell ──
    nav: [
      { id: 'home', label: 'Home', icon: 'ti-home', target: 'workspace-home' },
      { id: 'work', label: 'My work', icon: 'ti-checklist' },
      { id: 'cases', label: 'Cases', icon: 'ti-folder', target: 'workspace-journey' },
      { id: 'apps', label: 'Applications', icon: 'ti-apps' },
      { id: 'create', label: 'Create', icon: 'ti-wand', target: 'workspace-builder' },
      { id: 'insights', label: 'Insights', icon: 'ti-chart-bar' }
    ],

    // ── Scene seven: the decision queue ──
    queueTitle: 'Decisions waiting for you',
    queueMeta: '3 need your judgement · 9 prepared in the background',
    queue: [
      { id: C.id, journey: 'Periodic third-party review', icon: 'ti-building-bank', title: C.provider,
        why: C.criticality + ' service, review due ' + C.due.toLowerCase(),
        changed: C.changes.length + ' material changes since the last review',
        evidenceHave: C.changes.length, evidenceTotal: C.changes.length + C.missing.length,
        evidenceNote: C.missing.length + ' report missing',
        decision: 'Renew, with or without conditions', due: C.due, open: true },
      { id: 'CTL-EX-213', journey: 'Control effectiveness challenge', icon: 'ti-shield-check', title: 'Access recertification control',
        why: 'New exception raised by the first line',
        changed: 'Exception count above tolerance in the latest test',
        evidenceHave: 4, evidenceTotal: 4, evidenceNote: 'Evidence prepared',
        decision: 'Challenge the first-line conclusion', due: 'Thursday' },
      { id: 'INC-2611-018', journey: 'Incident materiality assessment', icon: 'ti-alert-triangle', title: 'Payment file delay',
        why: 'Event detected overnight; initial facts assembled',
        changed: 'Facts gathered from 3 sources',
        evidenceHave: 2, evidenceTotal: 3, evidenceNote: 'Client impact still open',
        decision: 'Determine materiality', due: 'Friday' }
    ],

    // ── NFR Assist: suggested questions and deterministic answers ──
    assist: {
      contextChip: 'Your role and open cases',
      placeholder: 'Ask about your work',
      note: 'Draft for your review. NFR Assist explains; you decide.',
      questions: [
        { q: 'What changed since the previous review?',
          a: C.changes.map(function(ch) { return ch.type + ': ' + ch.detail; }),
          sources: C.changes.map(function(ch) { return ch.evidence; }) },
        { q: 'Which evidence is missing or stale?',
          a: [C.missing[0].title + ': missing, ' + C.missing[0].requirement.toLowerCase(), C.changes[1].evidence + ': current, ' + C.changes[1].tag.toLowerCase() + ' noted'],
          sources: ['Evidence checklist', 'Third-party policy 4.2'] },
        { q: 'Explain why this case is prioritised.',
          a: [C.criticality + ' service and due ' + C.due.toLowerCase(), C.changes.length + ' material changes and ' + C.missing.length + ' named gap', 'Ranked first by due date and criticality, under the queue rules for your role'],
          sources: ['Queue rules v3', 'Case record'] }
      ]
    },

    // ── Scene eight: the standard journey (periodic third-party review) ──
    journey: {
      appName: 'Periodic review app',
      summary: [
        { k: 'Criticality', v: C.criticality },
        { k: 'Previous conclusion', v: C.previousConclusion + ', ' + C.lastReview },
        { k: 'Review due', v: C.due },
        { k: 'Material changes', v: C.changes.length + ' since the last review' },
        { k: 'Missing or stale evidence', v: C.missing.length + ': ' + C.missing[0].title.toLowerCase() },
        { k: 'Open issues and actions', v: C.openIssues.length + ': ' + C.openIssues[0].title.toLowerCase() }
      ],
      requirements: [
        'Policy 4.2: current independent assurance for critical services',
        'Policy 4.5: review material sub-processor changes',
        'Method: penetration test within 12 months'
      ],
      exceptions: [
        C.missing[0].title + ' missing',
        'SOC 2: ' + C.changes[1].tag.toLowerCase() + ' on change management'
      ],
      questions: [
        'Does the new sub-processor handle client data?',
        'Are the SOC 2 exceptions remediated or accepted?',
        C.challenge
      ],
      trace: [
        { id: 'due', label: 'Review became due', type: 'rule', detail: 'Annual cycle, critical service', t: '06:00' },
        { id: 'case', label: 'Case created', type: 'system', detail: C.id, t: '06:00' },
        { id: 'retrieve', label: 'Evidence retrieved from approved sources', type: 'system', detail: (C.changes.length + C.missing.length) + ' sources, read only', t: '06:02' },
        { id: 'fresh', label: 'Freshness and completeness checked', type: 'rule', detail: C.missing.length + ' report missing', t: '06:03' },
        { id: 'compare', label: 'Changes compared with the last review', type: 'ai-assisted', detail: C.changes.length + ' material changes', t: '06:05' },
        { id: 'map', label: 'Requirements mapped', type: 'ai-assisted', detail: 'Third-party policy, section 4', t: '06:06' },
        { id: 'exceptions', label: 'Exceptions identified', type: 'ai-assisted', detail: 'SOC 2 exceptions and 1 gap', t: '06:07' },
        { id: 'pause', label: 'Paused for human challenge', type: 'human-gate', detail: 'Waiting for the risk manager', status: 'waiting' }
      ],
      traceTypes: { system: 'System', rule: 'Rule', 'ai-assisted': 'AI-assisted', 'human-gate': 'Human gate' },
      decisionTitle: 'Your decision',
      decisionNote: 'The Workspace prepared and routed this case. The judgement is yours.',
      rationale: 'Sub-processor and SOC 2 changes reviewed; report gap is time-bound and owned.',
      decisions: [
        { id: 'approve-condition', label: C.proposedAction, proposed: true,
          outcome: 'Approved outcome recorded in the system of record',
          actions: ['30-day follow-up: obtain the ' + C.missing[0].title.toLowerCase(), 'Track the SOC 2 exceptions to closure'],
          monitoring: 'Day-30 evidence check scheduled' },
        { id: 'hold', label: 'Hold the renewal until the report arrives',
          outcome: 'Hold recorded with its reason',
          actions: ['Evidence request drafted for the vendor manager to send'],
          monitoring: 'Case resumes when the report arrives, or in 10 days' },
        { id: 'escalate', label: 'Escalate to second-line challenge',
          outcome: 'Escalation recorded with the prepared case attached',
          actions: ['Second-line reviewer assigned'],
          monitoring: 'Challenge due in 5 days' }
      ],
      receipt: {
        id: 'RCPT-1124-0042',
        decidedBy: 'NFR Risk Manager (synthetic user)',
        time: '09:42',
        sources: (C.changes.length + C.missing.length) + ' sources, versions pinned',
        policy: 'Third-party policy v7.2',
        trace: 'Automation run AR-5518, 8 steps',
        model: 'Approved model, prompt version 12',
        ack: 'Acknowledged by the system of record'
      }
    },

    // ── Scene nine: the Agent Builder ──
    builder: {
      title: 'Create an ad hoc agent',
      intro: 'Describe the report or analysis you need. The Workspace proposes a plan using only approved data and actions available to your role.',
      prompt: 'Create a one-page briefing of critical third-party services with worsening risk indicators, open high-severity issues, or risk acceptances expiring in the next 90 days. Group the findings by underlying provider concentration and cite every material statement.',
      editedNote: 'This demonstration interprets the example request. Your edits stay in the box.',
      steps: ['Goal', 'Scope', 'Plan', 'Run', 'Reuse'],
      goal: [
        { k: 'Output', v: 'One-page briefing' },
        { k: 'Population', v: 'Critical third-party services' },
        { k: 'Conditions', v: 'Worsening indicators, severe open issues, acceptances expiring within 90 days' },
        { k: 'Grouping', v: 'Underlying provider concentration' },
        { k: 'Evidence', v: 'Citation for every material statement' }
      ],
      scope: {
        read: ['Third-party inventory', 'Service catalogue', 'Risk indicators', 'Incident records', 'Issues and actions', 'Risk-acceptance register', 'Approved policy library'],
        create: ['A draft report', 'A source list', 'A data-gap list', 'Suggested follow-up questions'],
        cannot: ['Change source records', 'Approve or accept risk', 'Close issues', 'Notify external parties', 'Publish to a team without review'],
        visibility: 'Private to you',
        review: 'Human review before sharing',
        inherit: 'This agent inherits your access. It does not create new access.',
        principles: ['No privilege escalation', 'Record-level access', 'Allowlisted actions only', 'Writeback disabled', 'Gaps shown, not filled', 'Every run traced']
      },
      plan: [
        { text: 'Identify in-scope services', uses: ['Third-party inventory', 'Service catalogue'] },
        { text: 'Cross-check indicators, incidents, issues and acceptances', uses: ['Risk indicators', 'Incident records', 'Issues and actions', 'Risk-acceptance register'] },
        { text: 'Group services by underlying provider', uses: ['Third-party inventory'] },
        { text: 'Flag missing or inconsistent data', uses: ['All read sources'] },
        { text: 'Draft a source-linked briefing for review', uses: ['Approved policy library'] }
      ],
      stages: [
        { label: 'Finding in-scope records', result: '42 critical services in scope' },
        { label: 'Comparing risk signals', result: '7 services meet a condition' },
        { label: 'Checking evidence and data gaps', result: '2 data gaps flagged' },
        { label: 'Drafting the briefing', result: '1 page, 7 sources cited' },
        { label: 'Complete, human review required', result: 'Draft ready for you' }
      ],
      report: {
        title: 'Critical third-party services: emerging risk briefing',
        meta: ['Draft', 'Private to you', 'Synthetic data'],
        summary: 'Seven of 42 critical services meet at least one condition. Four of the seven run on the same underlying cloud provider, so concentration matters more than any single service. Two risk acceptances expire within 90 days.',
        findings: [
          { text: 'Four services rely on Provider A, the shared cloud host, including payments and the client portal.', cite: '1, 2' },
          { text: 'Indicators worsened for three services over two quarters, led by availability.', cite: '3, 4' },
          { text: 'Two high-severity issues are open on Provider A services; one is past its target date.', cite: '5' }
        ],
        clusters: [
          { provider: 'Provider A', kind: 'Cloud hosting', count: 4, services: 'Payments gateway, client portal, data warehouse, document archive' },
          { provider: 'Provider B', kind: 'Managed network', count: 2, services: 'Branch connectivity, trading network' },
          { provider: 'Provider C', kind: 'Card processing', count: 1, services: 'Card authorisation' }
        ],
        expiries: [
          { id: 'RA-0331', text: 'Client portal encryption gap', days: 21, cite: '6' },
          { id: 'RA-0317', text: 'Card authorisation exit plan', days: 64, cite: '6' }
        ],
        gaps: [
          'Two services have no indicator feed for 30 days.',
          'One service links to a provider with no ultimate parent recorded.'
        ],
        questions: [
          'Is the Provider A concentration within appetite?',
          'Renew or remediate RA-0331 before it expires?',
          'Who owns the missing indicator feeds?'
        ],
        citations: ['Third-party inventory', 'Service catalogue', 'Risk indicators', 'Incident records', 'Issues and actions', 'Risk-acceptance register', 'Third-party policy 4.2']
      },
      reuse: [
        { id: 'once', label: 'Run once', icon: 'ti-player-play', result: 'Run recorded in your history. Nothing saved or shared.', stage: 0 },
        { id: 'save', label: 'Save to My Agents', icon: 'ti-device-floppy', result: 'Saved to My Agents, private to you. Each rerun uses your access at that time.', stage: 1 },
        { id: 'template', label: 'Request team template', icon: 'ti-users-group', result: 'Request sent to the template owner. Published only after owner and control review.', stage: 2 }
      ],
      promotion: ['Ad hoc run', 'Personal agent', 'Reviewed team template', 'Standard app or automation'],
      promotionLine: 'Not a back door around standardisation: a controlled way to cover the long tail and find the needs worth industrialising.'
    },

    // ── Scene ten: the control boundary ──
    boundary: {
      prepare: { label: 'AI and automation prepare', items: ['Retrieve and compare evidence', 'Flag missing or stale information', 'Map requirements', 'Draft summaries and questions', 'Route work', 'Propose next actions'] },
      decide: { label: 'Professionals decide', items: ['Challenge evidence', 'Determine materiality', 'Approve or amend conclusions', 'Accept, mitigate or escalate risk', 'Authorise material writeback'] },
      record: { label: 'Systems record', items: ['Approved outcome', 'Named decision maker', 'Actions and owners', 'Source and policy versions', 'Automation and model trace', 'Next monitoring event'] },
      tableTitle: 'Default authority by capability',
      tableNote: 'No capability owns the risk.'
    },

    // ── Scene eleven: six months, three lanes ──
    roadmap: {
      phases: [
        { id: 'define', months: 'Months 0 to 2', label: 'Define' },
        { id: 'build', months: 'Months 2 to 4', label: 'Build and test' },
        { id: 'prove', months: 'Months 4 to 6', label: 'Operate and prove' }
      ],
      cells: {
        work: ['Select the role, decisions, responsibilities and authority boundaries', 'Test the role journey, interface and human handoffs', 'Embed in the operating cadence and measure adoption'],
        process: ['Map the case lifecycle, evidence, controls, exceptions and approvals', 'Build the role app, a bounded automation and the ad hoc read and draft pattern', 'Run the full controlled process on live or representative cases'],
        platform: ['Confirm sources, permissions, case-state needs and the technical path', 'Build connectors, identity integration, reusable services, audit and monitoring', 'Harden, deploy, monitor and name what the next journey reuses']
      },
      entryTitle: 'Entry conditions',
      entry: ['Named process owner', 'Bounded case type', 'Representative data and system access', 'Agreed AI, automation and human boundary'],
      proofTitle: 'What month six proves',
      proof: ['One role experience', 'One connected role app', 'One bounded automation loop', 'One constrained ad hoc reporting pattern', 'Measured risk, process and capacity outcomes'],
      notInScope: 'Not in scope: an enterprise-wide NFR platform in six months.'
    },

    // ── Scene twelve: value and the workshop decision ──
    value: {
      outcomes: [
        { id: 'risk', label: 'Risk outcomes', items: ['Evidence completeness and freshness', 'Consistent application of requirements', 'Earlier sight of material change', 'Complete decision trace', 'Fewer unsupported conclusions'] },
        { id: 'operating', label: 'Operating performance', items: ['Lower human touch time', 'Shorter review cycle', 'Less rework', 'Fewer overdue cases', 'Faster escalation and ad hoc analysis'] },
        { id: 'capacity', label: 'Capacity and economics', items: ['Capacity returned to judgement and challenge', 'Sustainable cost per case', 'Less central build for the long tail', 'Reuse of connectors, controls and role patterns'] }
      ],
      measureNote: 'Capacity, elapsed time and control quality are measured separately. Waiting time saved is not headcount.',
      question: 'Which role, decision and bounded journey should become the first controlled loop?',
      criteria: ['High manual integration burden', 'Bounded data and decision path', 'Measurable risk and operating outcome']
    },

    // ── Technical depth (drawer, opened with T) ──
    technical: {
      architecture: [
        { label: 'Channels and experience', items: ['Email', 'Chat', 'NFR Workspace', 'Role apps'] },
        { label: 'Role and case context', items: ['Identity', 'Role', 'Permissions', 'Case state', 'Task context'] },
        { label: 'Execution', items: ['Assistant', 'Role applications', 'Workflow and rules', 'Agent Builder', 'Human gates'] },
        { label: 'Shared control services', items: ['Approved models and tools', 'Policy and methodology', 'Source lineage', 'Audit and replay', 'Monitoring', 'Versioning', 'Fallback'] },
        { label: 'Authoritative systems and evidence', items: ['GRC', 'Third-party risk', 'Incidents', 'Issues and actions', 'Policy repositories', 'Document and data platforms'] }
      ],
      architectureNote: 'Authoritative systems remain authoritative. The Workspace reads from them and writes back only approved outcomes.',
      lifecycle: ['Personal draft', 'Permission and action validation', 'Test run', 'Personal use', 'Request for team publication', 'Owner and control review', 'Versioned team template', 'Promotion to a standard app or automation, where justified', 'Retirement and monitoring'],
      controls: [
        ['Identity and entitlement inheritance', 'Every capability runs as the user, with the user\'s access.'],
        ['Source-level lineage', 'Each statement links to its source record and version.'],
        ['Evidence freshness', 'Stale evidence is flagged before it is used.'],
        ['Policy versioning', 'The policy version applied is stored with the outcome.'],
        ['Action allowlists', 'Agents and automations call only approved actions.'],
        ['Abstention and uncertainty', 'Gaps and low confidence are shown, not filled.'],
        ['Prompt-injection protection', 'External documents are treated as data, not instructions.'],
        ['Human approval for material writeback', 'No material change reaches a system of record without a named approval.'],
        ['Run logging and replay', 'Every run can be replayed from its trace.'],
        ['Manual fallback', 'Each journey keeps a documented manual path.'],
        ['First-line and second-line separation', 'Preparation and challenge stay with different roles.']
      ],
      metrics: [
        ['Evidence quality', ['Evidence completeness', 'Evidence freshness', 'Extraction and citation accuracy', 'Material-change detection recall']],
        ['Decision quality', ['Human override rate and reason', 'Rework', 'Unsupported or unauthorised writebacks', 'Audit replay success']],
        ['Process performance', ['Touch time', 'Cycle time', 'Overdue cases', 'Run cost per case or report']],
        ['Ad hoc and adoption', ['Time to create an ad hoc report', 'Ad hoc agent reuse rate', 'Promotion rate to governed templates', 'Adoption by eligible users and cases']]
      ],
      metricsNote: 'Waiting time saved is reported as elapsed time, not as headcount.'
    }
  };

  var FROZEN = deepFreeze(DEMO);
  global.NFR_WORKSPACE_DEMO = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
