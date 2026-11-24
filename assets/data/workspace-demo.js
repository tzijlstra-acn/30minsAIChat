// -- NFR WORKSPACE STORY -- copy for the core route --
// One immutable object. Every core screen reads its words from here; no scene restates
// them in its own code. v7: one proposition. NFR Workspace is the role-based experience;
// reusable NFR methods, governed execution services, a connected NFR core and approved
// integrations sit underneath it. The real product is shown live between screens 07
// and 08. Everything is synthetic and bank-neutral.
// The internal edition (built locally, never published) may replace a few objects
// through window.NFR_STORY_INTERNAL before this object is frozen; the public build has
// no such file.
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
    edition: 'public',
    product: 'NFR Workspace',
    principle: ['AI prepares.', 'Professionals decide.', 'Systems record.'],
    syntheticLabel: 'Synthetic demonstration',
    // The one sentence that separates an assistant from the Workspace
    difference: ['The assistant helps the person.', 'NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.'],

    // ── 01 Cover: a capture of the real product, not a drawing of it ──
    cover: {
      role: 'Third-Party Risk Manager',
      capture: 'assets/img/product/act2-today.png',
      alt: 'NFR Workspace, Today for the Third-Party Risk Manager, on synthetic records',
      label: 'Today, in the live product',
      foot: 'Prepared for one role. Decided by a person. Recorded by the system.'
    },

    // ── 02 This is how the work arrives ──
    arrives: {
      queue: 'Risk and controls: one queue',
      asks: [
        { channel: 'Email', icon: 'ti-mail', text: 'Which controls duplicate across our entities, and which are deliberately different?', needs: 'Two inventories, descriptions, owners' },
        { channel: 'Meeting', icon: 'ti-users', text: 'What does the new regulation require beyond our current framework?', needs: 'Clauses, policies, mapped controls' },
        { channel: 'Audit request', icon: 'ti-file-text', text: 'Can we prove that our key controls are operating, not only documented?', needs: 'Tests, evidence, attestations' },
        { channel: 'Chat', icon: 'ti-message-circle', text: 'Which critical third-party services are deteriorating, and why?', needs: 'Indicators, incidents, issues, dependencies' }
      ],
      line: 'The answer usually requires several records, documents, rules, judgements and owners.'
    },

    // ── 03 Regulation from above, drift from below ──
    chain: {
      above: { label: 'Change from above', icon: 'ti-arrow-down', items: ['New regulation', 'Revised policy or standard', 'Supervisory or audit finding', 'Internal policy update'] },
      below: { label: 'Drift from below', icon: 'ti-arrow-up', items: ['Control no longer addresses the risk', 'Control not performed as designed', 'Evidence stale or missing', 'Attestation no longer reflects reality'] },
      links: ['Obligation', 'Risk or process', 'Control', 'Evidence', 'Assessment', 'Decision'],
      // Links that no longer tell the same story (between link i and i + 1)
      broken: [1, 2, 3],
      person: 'The NFR professional re-maps the chain by hand',
      consequences: [
        { label: 'Fragmented', text: 'No traced line from obligation to evidence.' },
        { label: 'Falsely assured', text: 'Attestations state what is no longer true.' },
        { label: 'Burdensome', text: 'Every new rule and every audit becomes a project.' }
      ],
      line: 'Not a lack of documents or dashboards: the cost is keeping context, evidence and decisions aligned.'
    },

    // ── 04 Assistance helps the person; the operating gap remains ──
    channels: [
      { id: 'email', label: 'Email', icon: 'ti-mail', helps: 'Drafts the reply' },
      { id: 'chat', label: 'Chat and search', icon: 'ti-message-circle', helps: 'Answers a question' },
      { id: 'documents', label: 'Documents', icon: 'ti-file-text', helps: 'Summarises a policy' },
      { id: 'meetings', label: 'Meetings', icon: 'ti-users', helps: 'Writes the minutes' },
      { id: 'policy', label: 'Policy questions', icon: 'ti-search', helps: 'Explains the rule' }
    ],
    gapTitle: 'The remaining operating gap',
    gap: ['Identify the case and required evidence', 'Retrieve from approved sources', 'Apply the correct method', 'Detect exceptions and changes',
      'Route to the accountable role', 'Obtain approval', 'Update the authoritative record', 'Keep a complete audit trail'],

    // ── 05 Four ways to work: plain verb, product, when to use it, one concrete example ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'NFR Assist', icon: 'ti-message-circle',
        line: 'Role-steered help in chat, email, documents and the Workspace.',
        when: 'You need help within the current activity',
        example: 'Summarise what changed in this review.',
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication' },
      { id: 'app', verb: 'Use', product: 'NFR Apps', icon: 'ti-apps',
        line: 'A connected app with the approved method, evidence, permissions and actions.',
        when: 'You need to complete a defined specialist task',
        example: 'Complete a periodic third-party review.',
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution' },
      { id: 'automation', verb: 'Run', product: 'NFR Automations', icon: 'ti-route',
        line: 'Controlled automation across systems and human gates.',
        when: 'You need a repeatable cross-system process',
        example: 'Collect evidence, check completeness, route challenge, record the approved outcome.',
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing' },
      { id: 'builder', verb: 'Create', product: 'Agent Builder', icon: 'ti-wand',
        line: 'A governed ad hoc report, analysis or agent using inherited access.',
        when: 'You need a new or temporary multi-source analysis',
        example: 'Build a temporary concentration briefing from approved records.',
        authority: 'Read, analyse, draft and monitor within explicit permissions',
        value: 'Faster answers to new questions, broader coverage of ad hoc work' }
    ],
    foundation: ['Same identity', 'Same permissions', 'Same evidence', 'Same control record'],

    // ── 06 Three layers that mature together ──
    layers: [
      { id: 'work', label: 'Work & roles', icon: 'ti-users',
        today: 'People assemble context and coordinate handoffs.',
        future: 'A role queue, clear decision rights, challenge and approval, adoption in the working day.' },
      { id: 'process', label: 'Process & controls', icon: 'ti-route',
        today: 'AI helps single steps; controls and handoffs stay manual.',
        future: 'A case lifecycle, evidence requirements, rules and exceptions, human gates, write-back and monitoring.' },
      { id: 'platform', label: 'Data & platform', icon: 'ti-database',
        today: 'Pilots rely on isolated data and one-off integrations.',
        future: 'Identity and entitlement, source connections, case state, reusable methods, audit and observability.' }
    ],
    layersLine: 'Improving only the AI component creates another pilot.',
    layersLine2: 'NFR Workspace is where all three meet.',

    // ── 07 The doorway into the live product ──
    enter: {
      statuses: ['Resolving role and permissions', 'Loading current decisions', 'Connecting approved applications', 'Workspace ready'],
      cue: 'Open live Workspace',
      cueKey: 'L',
      fallback: 'Captured fallback',
      fallbackKey: 'F',
      hint: 'After the demonstration, return here and press Space.',
      // The five acts of the product's own presenter guide
      acts: ['The Workspace feels real', 'The next decision arrives prepared', 'A live question, a visual answer', 'From insight to action', 'The long tail, governed'],
      // The live product on the presenter's machine; ?live=<url> overrides it
      liveUrl: 'http://localhost:3200/'
    },

    // ── 08 What happened beneath the experience ──
    beneath: {
      steps: [
        { kind: 'context', icon: 'ti-user-check', label: 'Understand the request and the case', detail: 'Role, case, scope and permitted actions' },
        { kind: 'plan', icon: 'ti-list-check', label: 'Select narrow methods and governed data', detail: 'A plan of small steps, not one prompt' },
        { kind: 'method', icon: 'ti-calculator', label: 'Calculate, compare and verify', detail: 'Rules first; narrow model calls checked against the source' },
        { kind: 'human', icon: 'ti-hand-stop', label: 'Pause where judgement is required', detail: 'The human gate is a step in the plan' },
        { kind: 'record', icon: 'ti-file-certificate', label: 'Record the approved outcome and evidence', detail: 'Receipt, sources, versions, who and when' }
      ],
      typesTitle: 'Three kinds of step',
      types: [
        { id: 'rule', label: 'Deterministic', flow: ['Input', 'Rule', 'Output'], text: 'Counting, matching, set difference, thresholds and dates. No model involved.' },
        { id: 'model', label: 'Narrow model call', flow: ['Input', 'Model', 'Check', 'Output'], text: 'One narrow question about language, with the answer checked against the source.' },
        { id: 'human', label: 'Human judgement', flow: ['Prepared', 'Decide', 'Recorded'], text: 'Materiality, challenge, acceptance and treatment stay with a named person.' }
      ],
      inDemo: 'In the demonstration: every figure was computed from the records; the professional approved before anything was written.',
      line: 'Complex outcomes are assembled from small, testable steps.'
    },

    // ── 09 Connected context keeps the answer true ──
    connected: {
      nodes: [
        { label: 'Obligation', id: 'OBL-12' },
        { label: 'Risk or process', id: 'R-21' },
        { label: 'Control', id: 'CTL-0417', meet: true },
        { label: 'Evidence', id: 'Q3 test missing', gap: true },
        { label: 'Assessment', id: 'RCSA Q3' },
        { label: 'Decision', id: 'Attestation' }
      ],
      topDown: { label: 'Top-down', trigger: 'A new obligation arrives', steps: ['Tied to its clause', 'Linked risks and controls found', 'Gaps and touched links go to review'] },
      bottomUp: { label: 'Bottom-up', trigger: 'A control test fails', steps: ['The failure is recorded', 'Traced up to risks and obligations', 'Attestations flagged before sign-off'] },
      meet: 'Both traces meet on CTL-0417: the new obligation relies on a control with a missing test.',
      line: 'The connected core computes the ripple. People decide what to do about it.'
    },

    // ── 10 Human authority is designed into the process ──
    boundary: {
      columns: [
        { key: 'ai', tone: 'ai', icon: 'ti-sparkles', label: 'AI-assisted preparation', items: ['Retrieve and summarise evidence', 'Extract and compare information', 'Identify anomalies and changes', 'Draft findings and actions', 'Explain the sources'] },
        { key: 'rules', tone: 'data', icon: 'ti-route', label: 'Deterministic control', items: ['Entitlements', 'Mandatory evidence checks', 'Thresholds and routing', 'Write-back constraints', 'Audit logging'] },
        { key: 'human', tone: 'human', icon: 'ti-user-check', label: 'Human authority', gate: 'Named decision maker', items: ['Challenge the evidence', 'Determine materiality', 'Approve the risk conclusion', 'Accept, reject or amend treatment', 'Approve material system changes'] }
      ],
      tableTitle: 'Default authority by capability',
      tableNote: 'Executing a step grants no authority.',
      noteText: 'Automation does not acquire authority merely because it can execute a step. Accountability stays with named people.'
    },

    // ── 11 Value comes from three places ──
    value: {
      outcomes: [
        { id: 'risk', label: 'Risk outcomes', items: ['More complete and current evidence', 'Earlier detection of material change', 'Consistent policy and method', 'More complete decision trace', 'Fewer unsupported conclusions'] },
        { id: 'operating', label: 'Operating performance', items: ['Shorter cycle time', 'Fewer handoffs and follow-ups', 'Fewer overdue reviews', 'Faster escalation', 'Less rework'] },
        { id: 'capacity', label: 'Capacity and economics', items: ['Lower human touch time', 'Lower cost per prepared case', 'Capacity redirected to challenge', 'Reuse across later journeys'] }
      ],
      measureNote: 'Capacity, cycle time and control quality are measured separately. Waiting time saved is not converted into labour savings.'
    },

    // ── 12 Qualify in five weeks, prove the loop in six months ──
    path: {
      sprint: { label: 'Phase 0', title: 'Five-week qualification', steps: [
        { label: 'Baseline', when: 'Weeks 1 and 2', text: 'Goals, scope, process, data and authority map' },
        { label: 'Configure', when: 'Week 3', text: 'Source onboarding, method fit, first run', gate: 'Fit gate' },
        { label: 'Challenge', when: 'Weeks 4 and 5', text: 'Full representative run, expert challenge, findings, value case, roadmap' }
      ] },
      loop: { label: 'Phase 1', title: 'Six-month working loop', lanes: [
        { id: 'work', label: 'Work & roles', text: 'Role, decisions and authority; test the journey; embed and measure adoption' },
        { id: 'process', label: 'Process & controls', text: 'Case map, evidence and gates; automate bounded steps; operate and prove control' },
        { id: 'platform', label: 'Data & platform', text: 'Sources and access; integrations, methods and audit; harden, monitor, reuse' }
      ] },
      scale: { label: 'Phase 2', title: 'Scale', items: ['Reuse shared services', 'Promote proven ad hoc agents', 'Add role apps and processes', 'Extend the connected core'] },
      line: 'Five weeks proves fit and value. Six months proves the operating model.'
    },

    // ── 13 Relevant experience ──
    // Public edition: what the approach has been applied to, without client details.
    // The internal edition replaces this object with claim-reviewed credentials.
    experience: {
      title: 'Accenture experience',
      items: [
        { icon: 'ti-list-check', label: 'Control inventory rationalisation', text: 'Redundant and weak controls identified, descriptions scored and rewritten, one shared view across the lines of defence.' },
        { icon: 'ti-shield-check', label: 'ICT and cyber control harmonisation', text: 'Inventories harmonised and mapped to regulation and standards, coverage gaps closed, documentation standardised for automated testing.' },
        { icon: 'ti-scale', label: 'Assessment challenge', text: 'RCSA and control ratings challenged against evidence and method, with generated narratives for review.' }
      ],
      note: 'Accenture delivery experience with the same methods. Client examples and measured results are shared separately, subject to permission.'
    },

    // ── 14 The decision for the room ──
    decision: {
      label: 'The decision',
      question: 'Which role, decision and bounded process should become the first working loop?',
      agree: [
        { icon: 'ti-user-check', label: 'Target role' },
        { icon: 'ti-route', label: 'Target decision or process' },
        { icon: 'ti-database', label: 'Representative data and cases' },
        { icon: 'ti-target', label: 'Proof criteria at five weeks and six months' }
      ],
      secondary: 'Which existing AI, workflow, GRC and data capabilities should the Workspace reuse rather than rebuild?'
    },

    // Six-month detail (appendix S2 reads it)
    roadmap: {
      phases: [
        { id: 'define', months: 'Months 0 to 2', label: 'Define' },
        { id: 'build', months: 'Months 2 to 4', label: 'Build and test' },
        { id: 'prove', months: 'Months 4 to 6', label: 'Operate and prove' }
      ],
      cells: {
        work: ['Role, decisions and authority', 'Test the journey and handoffs', 'Embed and measure adoption'],
        process: ['Case map, evidence and gates', 'Automate bounded steps', 'Operate and prove control'],
        platform: ['Sources, access and the approved path', 'Integrations, methods and audit', 'Harden, monitor and reuse']
      }
    }
  };

  // Internal edition only: replace whole objects (never present in the public build)
  var X = global.NFR_STORY_INTERNAL;
  if (X && typeof X === 'object') Object.keys(X).forEach(function(k) { DEMO[k] = X[k]; });

  var FROZEN = deepFreeze(DEMO);
  global.NFR_WORKSPACE_DEMO = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
