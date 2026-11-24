// -- NFR WORKSPACE STORY -- copy for the core route --
// One immutable object. Every core screen reads its words from here; no scene restates
// them in its own code. v7: one proposition. NFR Workspace is the role-based experience;
// reusable NFR methods, governed execution services, a connected NFR core and approved
// integrations sit underneath it. The real product is shown live between screens 07
// and 08. Everything is synthetic and bank-neutral.
// v9: every screen has one point a first-time viewer gets at a glance, with an example
// the audience recognises. The comment above each block names that point.
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
    difference: ['The assistant helps the person.', 'NFR Workspace connects the systems and carries the role, case, evidence and controls across the work.'],

    // ── 01 Cover: a capture of the real product, not a drawing of it ──
    cover: {
      role: 'Third-Party Risk Manager',
      capture: 'assets/img/product/act2-today.jpg',
      // The cover rotates through four moments of the live product. focus: [x, y, width] of
      // the region shown, in the capture's own pixels (captures are imageWidth wide).
      imageWidth: 1920,
      slides: [
        { file: 'assets/img/product/act2-today.jpg', label: 'Today: the next decision, prepared', focus: [430, 80, 1350] },
        { file: 'assets/img/product/act3-answer.jpg', label: 'A live question, a visual answer', focus: [300, 80, 1600] },
        { file: 'assets/img/product/act4-review.jpg', label: 'Nothing is written until you commit', focus: [840, 0, 1080] },
        { file: 'assets/img/product/act5-agent-builder.jpg', label: 'An agent inherits your access', focus: [300, 50, 1440] }
      ],
      every: 4500,
      alt: 'NFR Workspace, Today for the Third-Party Risk Manager, on synthetic records',
      label: 'Today, in the live product',
      foot: 'Prepared for one role. Decided by a person. Recorded by the system.'
    },

    // ── 02 The point: questions come from everywhere, and each needs sources, a method and people ──
    arrives: {
      needsTitle: 'To answer it',
      whoTitle: 'Who has to help',
      asks: [
        { channel: 'Email', icon: 'ti-mail', from: 'From the Chief Operating Officer', text: 'Which controls duplicate across our entities, and which are deliberately different?',
          needs: ['Control inventories of each entity', 'Control descriptions and owners', 'The risks each control covers'], who: 'Control owners in every entity' },
        { channel: 'Meeting', icon: 'ti-users', from: 'Regulatory change forum', text: 'What does the new regulation require beyond our current framework?',
          needs: ['The regulatory text, clause by clause', 'Current policies and standards', 'Controls already mapped to them'], who: 'Compliance and legal' },
        { channel: 'Audit request', icon: 'ti-file-search', from: 'From Internal Audit', text: 'Can we prove that our key controls operate, not only that they are documented?',
          needs: ['Control test results', 'The evidence behind each test', 'Signed attestations'], who: 'Control testers and owners' },
        { channel: 'Chat', icon: 'ti-message-circle', from: 'From the Head of Procurement', text: 'Which critical third-party services are deteriorating, and why?',
          needs: ['Supplier risk indicators', 'Incidents and open issues', 'Service dependencies'], who: 'Supplier owners and IT' }
      ],
      strong: 'No request arrives labelled with a method.',
      line: 'The answer sits across several systems; no single tool holds it.'
    },

    // ── 03 The point: change comes from above, drift from below, and the chain between them breaks ──
    chain: {
      above: { label: 'Change from above', icon: 'ti-arrow-down', items: ['New regulation', 'Revised policy or standard', 'Audit or supervisory finding', 'Internal policy update'], hits: [0, 1] },
      below: { label: 'Drift from below', icon: 'ti-arrow-up', items: ['Control misses the risk', 'Not performed as designed', 'Evidence stale or missing', 'Attestation no longer true'], hits: [2, 3, 4] },
      links: ['Obligation', 'Risk or process', 'Control', 'Evidence', 'Assessment', 'Decision'],
      // Links that no longer tell the same story (between link i and i + 1)
      broken: [1, 2, 3],
      consequences: [
        { label: 'Fragmented', icon: 'ti-puzzle', text: 'No traced line from obligation to evidence.' },
        { label: 'Falsely assured', icon: 'ti-shield-x', text: 'Attestations state what is no longer true.' },
        { label: 'Burdensome', icon: 'ti-weight', text: 'Every new rule and every audit becomes a project.' }
      ],
      person: 'The NFR professional re-maps the chain by hand.',
      line: 'The cost is keeping context, evidence and decisions aligned, not a lack of documents.'
    },

    // ── 04 The point: standalone AI sees one system; the NFR answer needs all of them ──
    // The question is the one the live product answers in act 3. Needs 1 to 4 are the
    // top row; needs 5 to 8 sit above tools 1 to 4. A tool "covers" the one need it sees.
    sees: {
      question: { label: 'One question', text: 'Which critical third-party services are deteriorating, and why?' },
      needsTitle: 'What the answer needs, and where each part lives',
      needs: [
        { id: 'register', label: 'Third-party register', system: 'Vendor management' },
        { id: 'contracts', label: 'Contracts and SLAs', system: 'Contract repository' },
        { id: 'incidents', label: 'Incidents', system: 'Incident register' },
        { id: 'kri', label: 'Key risk indicators', system: 'Risk reporting' },
        { id: 'mail', label: 'Supplier correspondence', system: 'Mailbox' },
        { id: 'assurance', label: 'Assurance reports', system: 'Document store' },
        { id: 'controls', label: 'Controls and issues', system: 'GRC platform' },
        { id: 'dependencies', label: 'Service dependencies', system: 'IT service inventory' }
      ],
      seesLabel: 'Sees',
      tools: [
        { id: 'email', label: 'Email assistant', icon: 'ti-mail', sees: 'The mailbox', covers: 'mail' },
        { id: 'documents', label: 'Document assistant', icon: 'ti-file-text', sees: 'The open file', covers: 'assurance' },
        { id: 'grc', label: 'GRC assistant', icon: 'ti-shield-check', sees: 'The GRC records', covers: 'controls' },
        { id: 'chat', label: 'Chat assistant', icon: 'ti-message-circle', sees: 'What you paste or upload', covers: null }
      ],
      person: 'The professional joins the other five by hand, for every question.',
      note: ['Each assistant helps with its own slice.', "NFR Workspace brings every system's content into one picture, within the user's permissions."]
    },

    // ── 05 The point: four ways of working, told apart by one supplier example each ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'NFR Assist', icon: 'ti-message-circle',
        line: 'Ask a question and get an answer with its sources, in the moment.',
        when: 'A one-off question, answered now',
        example: "What changed in this supplier's latest SOC 2 report?",
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication' },
      { id: 'app', verb: 'Use', product: 'NFR Apps', icon: 'ti-apps',
        line: 'Do a standard task in an app with the approved method, form and sign-off.',
        when: 'A standard task, one case at a time',
        example: 'Complete the annual review of one critical supplier.',
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution' },
      { id: 'automation', verb: 'Run', product: 'NFR Automations', icon: 'ti-route',
        line: 'Let a process run across systems and cases, pausing for people at the gates.',
        when: 'The same steps, across many cases',
        example: 'Every month, chase missing evidence from all critical suppliers.',
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing' },
      { id: 'builder', verb: 'Create', product: 'Agent Builder', icon: 'ti-wand',
        line: 'Build your own analysis or agent for a new question, with your existing access.',
        when: 'A new question no app covers yet',
        example: 'Track our dependence on one cloud provider, weekly, this quarter.',
        authority: 'Read, analyse, draft and monitor within explicit permissions',
        value: 'Faster answers to new questions, broader coverage of ad hoc work' }
    ],
    foundation: ['Same identity', 'Same permissions', 'Same evidence', 'Same control record'],

    // ── 06 The point: scale comes from three layers improving together, one role at a time ──
    stages: [
      { id: 'today', label: 'Today', sub: 'AI pilots', icon: 'ti-circle-dashed', tone: 'gap' },
      { id: 'first', label: 'First loop', sub: 'One NFR role', icon: 'ti-user-check', tone: 'ai' },
      { id: 'scale', label: 'At scale', sub: 'Every NFR role', icon: 'ti-users-group', tone: 'proof' }
    ],
    layers: [
      { id: 'work', label: 'Work & roles', icon: 'ti-users',
        today: 'Each person uses AI in their own way',
        first: 'One role works from a prepared queue',
        scale: 'Every NFR role works the same way' },
      { id: 'process', label: 'Process & controls', icon: 'ti-route',
        today: 'AI helps one step; handoffs stay manual',
        first: 'One process with evidence, gates and approval',
        scale: 'Proven methods reused across processes' },
      { id: 'platform', label: 'Data & platform', icon: 'ti-database',
        today: 'Each pilot copies its own data',
        first: 'Approved connections to the systems it needs',
        scale: 'One connected core for every role' }
    ],
    layersLine: 'NFR Workspace is where all three meet.',
    layersLine2: 'Improving only the AI component creates another pilot.',

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

    // ── 08 The point: the answer they just saw was calculated and checked, step by step ──
    // Facts from the live product's act 3 and act 4 (synthetic records).
    beneath: {
      question: { label: 'The question from the demonstration', text: 'Which critical third-party services are deteriorating, and why?' },
      producedLabel: 'Produced',
      trail: [
        { kind: 'rule', label: 'Find the critical services', out: 'Read from the third-party register' },
        { kind: 'data', label: 'Gather what changed', out: '15 evidence items from six registers' },
        { kind: 'rule', label: 'Calculate each change', out: '3 deteriorating, led by Novalink, up 23 points' },
        { kind: 'ai', label: 'Explain why', out: '2 share one cloud provider; each claim cites its source' },
        { kind: 'person', label: 'Decide the next step', out: 'Evidence request approved and recorded' }
      ],
      kinds: {
        rule: { label: 'Rule', icon: 'ti-calculator', tone: 'data', text: 'Counts, compares and calculates. No model involved.' },
        data: { label: 'Connected data', icon: 'ti-database', tone: 'data', text: 'Read through approved connections, with each source and its date.' },
        ai: { label: 'AI, checked', icon: 'ti-sparkles', tone: 'ai', text: 'One narrow language task, checked against the sources.' },
        person: { label: 'Person', icon: 'ti-user-check', tone: 'human', text: 'Judgement, materiality and approval stay with a named person.' }
      },
      legend: ['rule', 'ai', 'person'],
      line: ['Model risk is judged step by step.', 'Each step has one job, a defined input and a check, so it can be tested on its own.']
    },

    // ── 09 The point: connected records show at once what one change affects ──
    connected: {
      event: { label: 'A control test fails', id: 'CTL-0417', name: 'Supplier access review', system: 'Testing tool' },
      affected: [
        { type: 'Risk', icon: 'ti-shield', id: 'R-21', name: 'Unauthorised supplier access', system: 'Risk register', impact: 'Rating needs review' },
        { type: 'Obligation', icon: 'ti-gavel', id: 'OBL-12', name: 'Third-party ICT access', system: 'Regulatory library', impact: 'Now relies on an untested control' },
        { type: 'Self-assessment', icon: 'ti-clipboard-data', id: 'RCSA Q3', name: 'Supplier management', system: 'RCSA tool', impact: 'Still rates the control effective' },
        { type: 'Attestation', icon: 'ti-file-certificate', id: 'Q3 sign-off', name: 'Head of Procurement', system: 'Attestation workflow', impact: 'Flagged before it is signed' }
      ],
      compare: [
        { label: 'Today', tone: 'gap', icon: 'ti-clock', text: 'Found by hand, often at audit, after the attestation is signed.' },
        { label: 'With NFR Workspace', tone: 'proof', icon: 'ti-bolt', text: 'Flagged the same day, before anyone signs.' }
      ],
      line: ['It works the other way too.', 'A new obligation shows at once which controls it relies on, and which of them are untested.']
    },

    // ── 10 The point: who does what, shown with the step from the demonstration ──
    boundary: {
      demoLabel: 'In the demonstration',
      columns: [
        { key: 'ai', tone: 'ai', icon: 'ti-sparkles', label: 'AI prepares', demo: 'Drafted the evidence request and the reason for it.',
          items: ['Finds and summarises evidence', 'Spots changes and gaps', 'Drafts findings and actions'] },
        { key: 'human', tone: 'human', icon: 'ti-user-check', label: 'Professionals decide', demo: 'Reviewed every field and approved it as their own judgement.',
          items: ['Challenges the evidence', 'Decides what is material', 'Approves any change to a record'] },
        { key: 'system', tone: 'data', icon: 'ti-database', label: 'Systems record', demo: 'Checked permissions, wrote the change and issued a receipt.',
          items: ['Enforces permissions and required evidence', 'Writes only approved changes', 'Keeps who, what and when'] }
      ],
      line: ['Running a step grants no authority.', "Every material change needs a named person's approval, and the record shows who decided and when."]
    },

    // ── 11 The point: three kinds of value, each measured on its own ──
    value: {
      improvesLabel: 'What improves',
      measureLabel: 'How we measure it',
      outcomes: [
        { id: 'risk', tone: 'proof', icon: 'ti-shield-check', label: 'Risk outcomes',
          items: ['Evidence complete and current', 'Material change spotted earlier', 'Every decision traceable'],
          measure: 'Share of critical suppliers with current, complete evidence' },
        { id: 'operating', tone: 'data', icon: 'ti-clock', label: 'Operating performance',
          items: ['Shorter review cycles', 'Fewer handoffs and chasers', 'Fewer overdue reviews'],
          measure: 'Days from trigger to decision, per case' },
        { id: 'capacity', tone: 'human', icon: 'ti-users', label: 'Capacity and economics',
          items: ['Less time preparing each case', 'Time moved to challenge and judgement', 'Later journeys reuse the first'],
          measure: 'Hours of preparation per case, before and after' }
      ],
      line: ['Waiting time saved is not counted as headcount.', 'The business case is built from your own baseline during the five weeks.']
    },

    // ── 12 The point: start small and earn each next step ──
    path: {
      goalLabel: 'Goal',
      getLabel: 'You get',
      phases: [
        { id: 'qualify', label: 'Qualify', when: 'Five weeks', icon: 'ti-flask', tone: 'ai',
          goal: 'Answer one real question on your own data',
          steps: ['Baseline', 'Configure', 'Challenge'],
          get: 'Findings, a value case and a clear go or stop' },
        { id: 'prove', label: 'Prove', when: 'Six months', icon: 'ti-refresh', tone: 'human',
          goal: "Run one role's loop live, end to end",
          steps: ['Work', 'Process', 'Data'],
          get: 'A working loop, measured against the baseline' },
        { id: 'scale', label: 'Scale', when: 'After month six', icon: 'ti-trending-up', tone: 'proof',
          goal: 'Add roles and processes on the same core',
          steps: ['Methods', 'Connectors', 'Agents'],
          get: 'Each new journey reuses what the first one built' }
      ],
      gates: ['Go decision', 'Scale decision'],
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

    // ── 14 The point: four things to agree today, each with an example answer ──
    decision: {
      label: 'Agree today',
      exampleLabel: 'For example',
      question: 'Which role, decision and bounded process should become the first working loop?',
      agree: [
        { icon: 'ti-user-check', label: 'Target role', hint: 'Who does the work today, and who decides', example: 'Third-party risk manager' },
        { icon: 'ti-route', label: 'Target decision or process', hint: 'One bounded journey with a clear outcome', example: 'Annual review of critical suppliers' },
        { icon: 'ti-database', label: 'Representative data and cases', hint: "Real records, under the bank's own controls", example: "Last year's files for 20 critical suppliers" },
        { icon: 'ti-target', label: 'Proof criteria at five weeks and six months', hint: 'What each gate shows to earn the next step', example: 'Review time and evidence completeness' }
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
