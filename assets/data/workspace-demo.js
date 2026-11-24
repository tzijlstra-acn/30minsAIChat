// -- NFR WORKSPACE STORY -- copy for the core route --
// One immutable object. Every core screen reads its words from here; no scene restates
// them in its own code. v6: the product itself is shown live (the real NFR Workspace,
// on its synthetic demo day), so the deck no longer carries a mock of the application.
// What remains is the business story, the doorway into the live product, the principle
// the audience returns to, the six-month path, value and the workshop decision.
// Everything is synthetic and bank-neutral.
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

  var DEMO = {
    synthetic: true,
    product: 'NFR Workspace',
    principle: ['AI prepares.', 'Professionals decide.', 'Systems record.'],
    syntheticLabel: 'Synthetic demonstration',
    // The one sentence that separates an assistant from the Workspace
    difference: ['An assistant helps a person complete an activity.', 'NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.'],

    // ── Cover: a capture of the real product, not a drawing of it ──
    cover: {
      role: 'Third-Party Risk Manager',
      capture: 'assets/img/product/today.png',
      alt: 'NFR Workspace, Today for the Third-Party Risk Manager, on synthetic records',
      label: 'Today, in the live product',
      foot: 'Prepared for one role. Decided by a person. Recorded by the system.'
    },

    // ── Four ways to work: plain verb, product, when to use it, one concrete example ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'NFR Assist', icon: 'ti-message-circle',
        line: 'Role-steered help in email, chat, documents, meetings and the Workspace.',
        when: 'You need help inside the current task',
        example: 'Summarise what changed in this review.',
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication' },
      { id: 'app', verb: 'Use', product: 'NFR Apps', icon: 'ti-apps',
        line: 'A connected application for a defined NFR task, with its method and evidence.',
        when: 'You need to complete a defined role task',
        example: 'Complete a periodic third-party review.',
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution' },
      { id: 'automation', verb: 'Run', product: 'NFR Automations', icon: 'ti-route',
        line: 'Controlled execution of repeatable work across systems and human control points.',
        when: 'You need a repeatable cross-system process',
        example: 'Collect evidence, check completeness, route challenge, record the approved outcome.',
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing' },
      { id: 'builder', verb: 'Create', product: 'Agent Builder', icon: 'ti-wand',
        line: 'Permission-aware ad hoc reports, analyses and monitoring for the long tail.',
        when: 'You need a new or temporary multi-source analysis',
        example: 'Build a temporary concentration briefing from approved records.',
        authority: 'Read, analyse, draft and monitor within explicit permissions',
        value: 'Faster answers to new questions, broader coverage of ad hoc work' }
    ],
    foundation: ['Same identity', 'Same permissions', 'Same evidence', 'Same control record'],

    // ── Three layers that move in parallel (screen five and the roadmap) ──
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
    layersLine: 'Improving only the AI component creates another pilot.',
    layersLine2: 'Scaling the work requires all three layers to improve together.',

    // ── Screen two: assistance is already here ──
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

    // ── Screen three: the professional still connects the work ──
    burden: [
      'Find the relevant case', 'Retrieve evidence', 'Reconcile changes', 'Apply policy and method',
      'Chase missing input', 'Prepare the decision', 'Route challenge and approval', 'Record the outcome'
    ],
    consequences: [
      { label: 'Delays', text: 'Work waits at every handoff.' },
      { label: 'Rework', text: 'Missing evidence sends cases back.' },
      { label: 'Inconsistency', text: 'Each person connects it differently.' }
    ],

    // ── Screen six: the doorway into the live product ──
    enter: {
      statuses: ['Loading role context', 'Loading current decisions', 'Workspace ready'],
      cue: 'Open live Workspace',
      cueKey: 'L',
      fallback: 'Captured fallback',
      fallbackKey: 'F',
      hint: 'After the demonstration, return here and press Space.',
      acts: ['The role and the work are already known', 'Ask the records: a decision product', 'Into the role app and the evidence', 'A professional decides; the system changes', 'Recorded and reusable'],
      // The live product on the presenter's machine; ?live=<url> overrides it
      liveUrl: 'http://localhost:3200/'
    },

    // ── Screen seven: the principle, mapped to what the audience just saw ──
    boundary: {
      prepare: { label: 'AI and automation prepared', items: ['Today\'s decisions for the role', 'The answer from the records, with charts', 'Evidence compared with the last period', 'Missing and stale evidence flagged', 'The drivers, ranked, with their sources', 'The proposed next action'] },
      decide: { label: 'The professional decided', items: ['Challenged the evidence', 'Determined materiality', 'Chose the action', 'Approved the write-back', 'Kept authority over the conclusion'] },
      record: { label: 'The system recorded', items: ['The changed case state', 'The audit receipt', 'Who decided, and when', 'Source and policy versions', 'The actions and owners', 'The next monitoring step'] },
      tableTitle: 'Default authority by capability',
      tableNote: 'No capability owns the risk.'
    },

    // ── Screen eight: six months, three lanes ──
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
      entry: ['Named business and process owner', 'One bounded case type', 'Representative records and source-system access', 'Approved platform route', 'Agreed AI, rules and human boundary', 'Agreed proof thresholds'],
      proofTitle: 'What month six proves',
      proof: ['One role experience', 'One connected role app', 'One bounded automation loop', 'One constrained ad hoc reporting pattern', 'Measured risk, process and capacity outcomes'],
      notInScope: 'Not in scope: an enterprise-wide NFR platform in six months.'
    },

    // ── Screen nine: value ──
    value: {
      outcomes: [
        { id: 'risk', label: 'Risk outcomes', items: ['Better evidence completeness', 'More consistent policy application', 'Earlier detection of material change', 'More complete decision trace'] },
        { id: 'operating', label: 'Operating performance', items: ['Faster review cycle', 'Fewer handoffs and follow-ups', 'Fewer overdue cases', 'Faster escalation'] },
        { id: 'capacity', label: 'Capacity and economics', items: ['Lower human touch time', 'Less avoidable rework', 'Sustainable cost per case', 'Capacity redirected to judgement'] }
      ],
      measureNote: 'Capacity, elapsed time and control quality are measured separately. Waiting time saved is not headcount.'
    },

    // ── Screen ten: the workshop decision ──
    workshop: {
      label: 'Workshop decision',
      question: 'Which role, decision and bounded process should become the first controlled loop?',
      next: 'And what evidence would authorise the next wave?',
      cards: [
        { id: 'good', label: 'A good first loop has', icon: 'ti-target', items: ['A high manual integration burden', 'A bounded data and decision path', 'A clear authority boundary', 'A measurable risk and operating outcome'] },
        { id: 'bring', label: 'What we ask of you', icon: 'ti-users', items: ['A named business and process owner', 'Representative historical cases', 'Access to the source systems', 'Agreement on the AI, rules and human boundary'] },
        { id: 'leave', label: 'What the workshop produces', icon: 'ti-checklist', items: ['A scored shortlist of journeys', 'The first loop and its decision', 'Proof thresholds for the gates', 'A plan for the first six weeks'] }
      ]
    }
  };

  var FROZEN = deepFreeze(DEMO);
  global.NFR_WORKSPACE_DEMO = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
