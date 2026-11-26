// -- NFR WORKSPACE STORY -- copy for the core route --
// One immutable object. Every core screen reads its words from here; no scene restates
// them in its own code. v7: one proposition. NFR Workspace is the role-based experience;
// reusable NFR methods, governed execution services, a connected NFR core and approved
// integrations sit underneath it. The real product is shown live between screens 08
// and 09. Everything is synthetic and bank-neutral.
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

    // ── 02 The point: every question pulls in askers, systems, teams and a method of its own ──
    // Five levels, one row each. Each question links to the askers, systems, teams and
    // method it needs; the screen steps through the four questions and ends on the last,
    // the one screen 03 types out. The totals are counted from this data.
    arrives: {
      levels: { who: 'Who asks', ask: 'What they ask', data: 'Where the answer lives', help: 'Who has to help', method: 'How it is worked out' },
      askers: [
        { id: 'board', label: 'Board risk committee' }, { id: 'coo', label: 'Chief Operating Officer' }, { id: 'forum', label: 'Regulatory change forum' },
        { id: 'audit', label: 'Internal audit' }, { id: 'supervisor', label: 'Supervisor' }, { id: 'procurement', label: 'Head of Procurement' }
      ],
      systems: [
        { id: 'grc', label: 'GRC platform' }, { id: 'policy', label: 'Policy library' }, { id: 'reg', label: 'Regulatory library' }, { id: 'testing', label: 'Testing tool' },
        { id: 'docs', label: 'Document store' }, { id: 'vendor', label: 'Vendor management' }, { id: 'incidents', label: 'Incident register' }, { id: 'itsi', label: 'IT service inventory' }
      ],
      teams: [
        { id: 'owners', label: 'Control owners' }, { id: 'compliance', label: 'Compliance and legal' }, { id: 'testers', label: 'Control testers' },
        { id: 'suppliers', label: 'Supplier owners' }, { id: 'it', label: 'IT' }
      ],
      methods: [
        { id: 'mapping', label: 'Control mapping' }, { id: 'gap', label: 'Regulatory gap analysis' }, { id: 'testing', label: 'Control testing' }, { id: 'trend', label: 'Trend analysis' }
      ],
      asks: [
        { channel: 'Email', icon: 'ti-mail', text: 'Which controls duplicate across our entities?', who: ['coo', 'board'], data: ['grc', 'policy'], help: ['owners'], method: 'mapping' },
        { channel: 'Meeting', icon: 'ti-users', text: 'What does the new regulation add to our framework?', who: ['forum', 'supervisor'], data: ['reg', 'policy', 'grc'], help: ['compliance'], method: 'gap' },
        { channel: 'Audit request', icon: 'ti-file-search', text: 'Can we prove our key controls operate, not only exist?', who: ['audit', 'board'], data: ['testing', 'docs', 'grc'], help: ['testers', 'owners'], method: 'testing' },
        { channel: 'Chat', icon: 'ti-message-circle', text: 'Which critical third-party services are deteriorating, and why?', who: ['procurement'], data: ['vendor', 'incidents', 'itsi', 'docs'], help: ['suppliers', 'it'], method: 'trend' }
      ],
      totals: [['askers', 'askers'], ['asks', 'questions'], ['systems', 'systems'], ['teams', 'teams'], ['methods', 'methods']],
      strong: 'The record shows the outcome.',
      line: 'The work, and the exceptions that matter, happen in emails, spreadsheets and meetings around it.'
    },

    // ── 03 The point: standalone AI sees one system; the NFR answer needs all of them ──
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
      // Red marks what no assistant sees. The two bars count it: what standalone AI sees,
      // and what the answer needs, the 360 view NFR Workspace brings together.
      legend: { seen: 'Seen by one assistant', missing: 'Missing: no assistant sees it' },
      missingTag: 'Missing',
      context: {
        label: 'Context for this answer',
        standalone: { label: 'Standalone AI', value: '{n} of {t}. The other {m} are joined by hand.' },
        workspace: { label: 'NFR Workspace', value: "{t} of {t}. The 360 view, within the user's access." }
      },
      note: ['Each assistant helps with its own slice.', "NFR Workspace brings every system's content into one picture, within the user's permissions."]
    },

    // ── 04 The point: a supplier changes, and the records do not ──
    // One change at a critical supplier: Novalink moves its hosting to Basalt Cloud, a
    // fourth party, and the notice lands in a shared mailbox on day 12. Four records still
    // say what was true before: each row shows what the record says and what is true now.
    // Then when the bank finds out: today in an outage on day 110; with NFR Workspace on
    // day 12, when the notice is read and joined to the records. Novalink and Basalt Cloud
    // are the ones the third-party risk manager sees on screen 05.
    chain: {
      label: 'One change at a critical supplier',
      tag: 'Illustrative, synthetic records',
      event: { k: 'Day 0', icon: 'ti-cloud', text: 'Novalink, a critical supplier, moves its hosting to Basalt Cloud. It says so in a notice, sent on day 12 to a shared mailbox.' },
      cols: { record: 'What your records say', truth: 'What is true now' },
      rows: [
        { label: 'Contract', system: 'Contract repository', record: 'Novalink hosts the service itself', truth: 'Hosting subcontracted to Basalt Cloud' },
        { label: 'Due diligence', system: 'Vendor management', record: 'Passed in March, no subcontractors', truth: 'Basalt Cloud has not been assessed' },
        { label: 'Risk rating', system: 'Risk register', record: 'Medium', truth: 'Two critical services now on one provider' },
        { label: 'Exit plan', system: 'Resilience plan', record: 'Tested and current', truth: 'Assumes hosting that no longer exists' }
      ],
      // Days 0 to 120. Each segment: [from, to, tone, text]
      timeline: {
        label: 'When the bank finds out',
        days: 120, ticks: [0, 30, 60, 90, 120], tick: 'Day {d}',
        events: [[12, 'Notice lands in a shared mailbox'], [110, 'Outage: two critical services down']],
        lanes: [
          { label: 'Today', segs: [[0, 110, 'proof', 'Every record says green'], [110, 120, 'gap', 'Outage']] },
          { label: 'With NFR Workspace', segs: [[0, 12, 'proof', ''], [12, 120, 'ai', 'Day 12: the notice is read, joined to the records, the rating flagged']] }
        ],
        window: [12, 110, '98 days: the information was there, but nothing joined it']
      },
      person: 'The records show the past, not the change.',
      line: 'The notice sat in a mailbox no assistant joins to the contract, the rating or the exit plan.'
    },

    // ── 05 The point: how the information flows, at the depth the audience wants ──
    // Pick a role, then a depth. Light is what the person sees: the answer and its buttons.
    // Medium folds out where it comes from: each system checks access, the records are read
    // live or from a dated cache, linked, calculated and explained. Deep folds out how it
    // runs: each button is defined once (what it reads, calculates and writes), what is
    // stored with versions, and what is written back, only once a person approves.
    // The eight systems are screen 03's. Access per system: 'full', 'none', or a short note.
    // Each button reads only systems its role may access (a test checks it).
    roles: {
      tag: 'Illustrative, synthetic records',
      groups: { lead: 'Leads the function', work: 'Runs the work' },
      status: { live: 'In the product today', target: 'Target design' },
      asks: 'asks',
      depthLabel: 'Depth',
      depths: [
        { id: 'light', label: 'Light', sub: 'What they see' },
        { id: 'medium', label: 'Medium', sub: 'The sources' },
        { id: 'deep', label: 'Deep', sub: 'How it runs' }
      ],
      opensAt: 'Opens at',
      layers: [
        { id: 'screen', depth: 'light', label: 'On the screen', sub: 'Answer and buttons', icon: 'ti-device-desktop' },
        { id: 'route', depth: 'deep', label: 'Route', sub: 'Each button defined once', icon: 'ti-arrows-split-2' },
        { id: 'read', depth: 'medium', label: 'Read', sub: 'Access checked first', icon: 'ti-database' },
        { id: 'connect', depth: 'medium', label: 'Connect', sub: 'Knowledge graph', icon: 'ti-affiliate' },
        { id: 'compute', depth: 'medium', label: 'Compute', sub: 'Rules, then AI', icon: 'ti-cpu' },
        { id: 'store', depth: 'deep', label: 'Store', sub: 'Kept, with versions', icon: 'ti-archive' },
        { id: 'write', depth: 'deep', label: 'Write back', sub: 'Only once approved', icon: 'ti-pencil' }
      ],
      kinds: { view: 'View', explain: 'Explain', action: 'Action' },
      // Short names for the eight systems, so all eight fit one layer
      short: { register: 'Vendors', contracts: 'Contracts', incidents: 'Incidents', kri: 'Risk reporting', mail: 'Mailbox', assurance: 'Documents', controls: 'GRC', dependencies: 'IT services' },
      // How each system is read: a live query of exact records, or a cached index of documents
      modeOf: { register: 'live', incidents: 'live', kri: 'live', controls: 'live', dependencies: 'live', contracts: 'cache', mail: 'cache', assurance: 'cache' },
      modes: {
        live: { label: 'Live', icon: 'ti-bolt', text: 'Exact records, read at the source now' },
        cache: { label: 'Cached', icon: 'ti-archive', text: 'Documents and mail, each with its date' }
      },
      route: { def: 'Defined once as', reads: 'Reads {n} systems', noRule: 'No calculation', ai: { view: 'No AI', explain: 'AI explains', action: 'AI drafts' },
        write: 'Writes to {to}', noWrite: 'Writes nothing',
        fresh: 'A new question has no definition yet: AI plans it, using only connectors this user may use.' },
      graph: { label: 'Knowledge graph', text: 'Links the records across systems' },
      rules: { label: 'Rules calculate', text: 'Deterministic. No model.' },
      ai: { label: 'AI explains, checked', text: 'Approved model. Each claim cited, each call logged.' },
      store: [
        { k: 'This answer', text: null },
        { k: 'Cached index', text: 'Each document kept with its date' },
        { k: 'Audit log', text: 'Who asked, what was read and shown' }
      ],
      write: { none: 'This button only reads. Nothing is written back.', note: "Written through the system's own rules, with a receipt." },
      access: {
        full: { icon: 'ti-circle-check', tone: 'proof', label: 'Full' },
        part: { icon: 'ti-circle-half-2', tone: 'human' },
        none: { icon: 'ti-lock', tone: 'gap', label: 'No access' }
      },
      notShownLabel: 'Not shown:',
      mayLabel: 'May do next:',
      // The role shown first, then the order the fallback pictures follow
      order: ['tprm', 'head', 'orm', 'owner'],
      list: [
        { id: 'head', group: 'lead', icon: 'ti-user-star', label: 'Head of NFR', scope: 'Every register, summarised', status: 'target',
          question: 'Where is NFR risk moving towards its appetite limits?',
          rule: 'Ratings against appetite: 2 amber, 4 green', ai: 'Explains the concentration, citing both services',
          access: { register: 'Summary', contracts: 'Totals', incidents: 'Summary', kri: 'full', mail: 'none', assurance: 'Summary', controls: 'Summary', dependencies: 'full' },
          links: [{ type: 'Risk types', text: '6 in the profile' }, { type: 'Third party', text: 'Amber, 3 services' }, { type: 'Concentration', text: '2 on one provider' }, { type: 'Board report', text: '1 item to flag' }],
          outputs: [
            { id: 'profile', kind: 'view', icon: 'ti-chart-bar', label: 'Risk against appetite', def: 'NFR-APP v4', rule: 'Appetite rating',
              reads: ['register', 'incidents', 'kri', 'controls', 'assurance'], store: 'The profile and its 31 records, versioned' },
            { id: 'why', kind: 'explain', icon: 'ti-sparkles', label: 'Why it is moving', def: 'NFR-WHY v2', rule: null,
              reads: ['register', 'contracts', 'kri', 'dependencies'], store: 'The explanation, each claim with its source' },
            { id: 'board', kind: 'action', icon: 'ti-flag', label: 'Flag for the board', def: 'NFR-BRD v1', rule: null,
              reads: ['kri', 'dependencies'], store: 'The draft and its approval, one record',
              write: { to: 'Document store', what: 'A draft item for the board report', gate: 'After the Head of NFR approves' } }
          ],
          answer: { text: 'Third-party risk is nearing its limit. Two services rely on one cloud provider.',
            visual: { kind: 'tiles', items: [{ label: 'Third party', tone: 'human' }, { label: 'Resilience', tone: 'human' }, { label: 'Cyber', tone: 'proof' }, { label: 'Data', tone: 'proof' }, { label: 'Conduct', tone: 'proof' }, { label: 'Fraud', tone: 'proof' }] },
            notShown: 'Personal mailboxes, case-level detail',
            may: 'Approve large risk acceptances' } },
        { id: 'tprm', group: 'work', icon: 'ti-briefcase', label: 'Third-party risk manager', scope: 'All suppliers, full records', status: 'live',
          question: 'Which critical third-party services are deteriorating, and why?',
          rule: 'Deterioration score: 3 of 11 over threshold', ai: 'Explains why: two share Basalt Cloud, each claim cited',
          access: { register: 'full', contracts: 'full', incidents: 'full', kri: 'full', mail: 'Own mailbox', assurance: 'full', controls: 'full', dependencies: 'full' },
          links: [{ type: 'Services', text: '11 critical' }, { type: 'Deteriorating', text: '3 services' }, { type: 'Leading', text: 'Novalink, up 23' }, { type: 'Shared provider', text: 'Basalt Cloud' }],
          outputs: [
            { id: 'list', kind: 'view', icon: 'ti-list-details', label: 'Deteriorating services', def: 'TP-DET v3', rule: 'Deterioration score',
              reads: ['register', 'incidents', 'kri', 'dependencies', 'contracts', 'assurance'], store: 'The list and its 15 records, versioned' },
            { id: 'why', kind: 'explain', icon: 'ti-sparkles', label: 'Why, with sources', def: 'TP-WHY v2', rule: null,
              reads: ['register', 'incidents', 'dependencies', 'contracts', 'mail', 'assurance'], store: 'The explanation, each claim with its source' },
            { id: 'request', kind: 'action', icon: 'ti-send', label: 'Request evidence', def: 'TP-REQ v1', rule: null,
              reads: ['register', 'contracts', 'mail'], store: 'The request and its approval, one record',
              write: { to: 'Vendor management', what: 'An evidence request to Novalink', gate: 'After you approve every field' } }
          ],
          answer: { text: 'Three critical services are deteriorating. Novalink leads, up 23 points.',
            visual: { kind: 'dots', total: 11, hit: 3, label: '3 of 11 critical services. Two rely on Basalt Cloud.' },
            notShown: "Other people's mailboxes",
            may: 'Request evidence, once approved' } },
        { id: 'orm', group: 'work', icon: 'ti-shield-check', label: 'Operational risk partner', scope: 'Risks and controls, all units', status: 'live',
          question: 'Which self-assessments still rate a failed control as effective?',
          rule: 'Rating against test result: 1 mismatch', ai: 'Drafts the challenge, citing the test and the RCSA',
          access: { register: 'full', contracts: 'none', incidents: 'full', kri: 'full', mail: 'none', assurance: 'full', controls: 'full', dependencies: 'full' },
          links: [{ type: 'Control', text: 'CTL-0417 failed' }, { type: 'Self-assessment', text: 'RCSA Q3: effective' }, { type: 'Risk', text: 'R-21 to review' }, { type: 'Obligation', text: 'OBL-12 relies on it' }],
          outputs: [
            { id: 'mismatch', kind: 'view', icon: 'ti-checklist', label: 'Rating mismatches', def: 'ORM-MIS v2', rule: 'Rating against test',
              reads: ['controls', 'assurance', 'register'], store: 'The mismatch and its 6 records, versioned' },
            { id: 'draft', kind: 'explain', icon: 'ti-sparkles', label: 'Draft the challenge', def: 'ORM-CHL v1', rule: null,
              reads: ['controls', 'incidents', 'kri', 'assurance'], store: 'The draft, each claim with its source' },
            { id: 'record', kind: 'action', icon: 'ti-pencil', label: 'Record the challenge', def: 'ORM-REC v1', rule: null,
              reads: ['controls'], store: 'The challenge and its approval, one record',
              write: { to: 'GRC platform', what: 'A second-line challenge on RCSA Q3', gate: 'After you approve' } }
          ],
          answer: { text: 'One self-assessment still rates a failed control as effective.',
            visual: { kind: 'compare', rows: [{ label: 'RCSA Q3 rates CTL-0417', value: 'Effective', tone: 'proof' }, { label: 'Latest test of CTL-0417', value: 'Failed', tone: 'gap' }] },
            notShown: 'Contract terms and mailboxes',
            may: 'Record a second-line challenge' } },
        { id: 'owner', group: 'work', icon: 'ti-clipboard-check', label: 'Control owner', scope: 'Own controls, in Procurement', status: 'target',
          question: 'Which of my controls need evidence before the Q3 sign-off?',
          rule: 'Evidence due before sign-off: 2 of 6 controls', ai: 'Lists what is missing, citing each control',
          access: { register: 'Own only', contracts: 'none', incidents: 'Own unit', kri: 'none', mail: 'Own mailbox', assurance: 'Own only', controls: 'Own controls', dependencies: 'none' },
          links: [{ type: 'Your controls', text: '6 in Procurement' }, { type: 'Control', text: 'CTL-0417 failed' }, { type: 'Evidence', text: '2 items missing' }, { type: 'Attestation', text: 'Q3 sign-off flagged' }],
          outputs: [
            { id: 'due', kind: 'view', icon: 'ti-checklist', label: 'Evidence due', def: 'CO-EVD v2', rule: 'Evidence due',
              reads: ['controls', 'assurance'], store: 'The list and its 9 records, versioned' },
            { id: 'missing', kind: 'explain', icon: 'ti-sparkles', label: 'What is missing', def: 'CO-GAP v1', rule: null,
              reads: ['controls', 'assurance', 'mail'], store: 'The gaps, each with its source' },
            { id: 'attest', kind: 'action', icon: 'ti-upload', label: 'Upload and attest', def: 'CO-ATT v1', rule: null,
              reads: ['controls', 'register'], store: 'The evidence and the attestation, one record',
              write: { to: 'GRC platform', what: 'Evidence on CTL-0417 and the Q3 attestation', gate: 'Signed by you' } }
          ],
          answer: { text: 'Two of your six controls need evidence before the Q3 sign-off.',
            visual: { kind: 'tiles', items: [{ label: 'CTL-0417', tone: 'gap' }, { label: 'CTL-0421', tone: 'human' }, { label: 'CTL-0402', tone: 'proof' }, { label: 'CTL-0409', tone: 'proof' }, { label: 'CTL-0411', tone: 'proof' }, { label: 'CTL-0433', tone: 'proof' }] },
            notShown: 'Other units and contracts',
            may: 'Upload evidence and attest' } }
      ],
      line: ['The AI sees only what the person asking may see.', 'Each system checks access before anything reaches the AI.']
    },

    // ── 06 The point: four ways of working, told apart by one supplier example each ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'Ask the records', icon: 'ti-message-circle',
        line: 'Ask a question and get an answer with its sources, in the moment.',
        when: 'A one-off question, answered now',
        example: "What changed in this supplier's latest SOC 2 report?",
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication',
        pro: 'Any question, answered now, with its sources', con: 'Not repeatable: no case, no sign-off' },
      { id: 'app', verb: 'Use', product: 'Work Hub', icon: 'ti-apps',
        line: 'Do a standard task in an app with the approved method, form and sign-off.',
        when: 'A standard task, one case at a time',
        example: 'Complete the annual review of one critical supplier.',
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution',
        pro: 'The approved method, consistent, signed off', con: 'One case at a time, where an app exists' },
      { id: 'automation', verb: 'Run', product: 'Processes', icon: 'ti-route',
        line: 'The routine runs across systems and cases. People get the exceptions, with their context.',
        when: 'The same steps, across many cases',
        example: 'Every month, chase missing evidence from all critical suppliers.',
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing',
        pro: 'Many cases at once; exceptions go to people', con: 'Needs a stable, approved process' },
      { id: 'builder', verb: 'Create', product: 'Agents', icon: 'ti-wand',
        line: 'Build your own analysis or agent for a new question, with your existing access.',
        when: 'A new question no app covers yet',
        example: 'Track our dependence on one cloud provider, weekly, this quarter.',
        authority: 'Read, analyse, draft and monitor within explicit permissions',
        value: 'Faster answers to new questions, broader coverage of ad hoc work',
        pro: 'A new question answered without waiting for IT', con: 'Starts constrained; reviewed before it is shared' }
    ],
    foundation: ['Same identity', 'Same permissions', 'Same evidence', 'Same control record'],
    // 06 grid: across, how standard the work is; up, how often it comes. Each way fills one
    // cell; where one way stops, the next takes over, so no kind of question is left over.
    ways: {
      across: { label: 'How standard the work is', left: 'A new question', right: 'A standard task' },
      up: { label: 'How often it comes', top: 'Again and again', bottom: 'Once, now' },
      cells: { assist: [0, 1], app: [1, 1], automation: [1, 0], builder: [0, 0] },
      proLabel: 'Strong at', conLabel: 'Stops at',
      line: ['Where one way stops, the next takes over.', 'A repeated question becomes an app; a repeated task becomes a process; a new question becomes an agent.']
    },

    // ── 07 The point: scale comes from three layers improving together, one role at a time ──
    stages: [
      { id: 'today', label: 'Today', sub: 'AI pilots', icon: 'ti-circle-dashed', tone: 'gap' },
      { id: 'first', label: 'First process', sub: 'One NFR role, live', icon: 'ti-user-check', tone: 'ai' },
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
    // 07: today's pilots on the left; on the right the Workspace, set up once with a first
    // team in six months, then one team at a time on the same core, run in-house or managed.
    grow: {
      todayLabel: 'Today: how most banks start with AI',
      todayResult: 'Pilots that do not scale, share or prove control',
      label: 'With NFR Workspace: set up once, grow by module',
      modules: [
        { when: 'Months 0 to 6', label: 'Third-party risk team', tone: 'ai', icon: 'ti-briefcase',
          steps: ['Define the role, cases and gates', 'Build and test on your records', 'Operate live and measure'], get: 'One live process, measured' },
        { when: 'Next', label: 'Operational risk partners', tone: 'data', icon: 'ti-shield-check',
          steps: ['Self-assessments and reassessment', 'Reuses the core and the methods'], get: 'Goes live faster, on what is reused' },
        { when: 'Then', label: 'Further teams', tone: 'proof', icon: 'ti-users-group',
          steps: ['Control assurance', 'Incidents and resilience', 'Regulatory change'], get: 'One team at a time' }
      ],
      foundation: { label: 'Set up once', items: ['Identity and access', 'Approved connectors', 'Connected core', 'Controls and audit'] },
      runLabel: 'Run it your way',
      run: ['In-house, after enablement', 'Managed by Accenture', 'Start managed, then move in-house'],
      line: ['Set up once. Then add one team at a time.', 'Each module reuses the identity, connectors, core and controls the first one built.']
    },
    layersLine: 'NFR Workspace is where all three meet.',
    layersLine2: 'Improving only the AI component creates another pilot.',

    // ── 08 The point: one profile per person, built from the bank's identity system ──
    // The identity system (sign-in, the HR record, access groups) feeds a profile in six
    // levels, coarse to fine: role, scope, records, fields, actions, delegation. The profile
    // decides the person's screen: their menu, their queue, what is in view, what is masked.
    // Maya and Ben share a role but not a scope, to show the granularity. Every record
    // carries tags from its source; a data map links each system's fields to them once;
    // every read checks role, scope and tags. Synthetic people; the levels are target design.
    profiles: {
      tag: 'Target design, synthetic profiles',
      cols: ['1 · Your identity system', '2 · The profile, six levels', '3 · Their screen'],
      idm: [
        { id: 'signin', k: 'Sign-in', icon: 'ti-fingerprint' },
        { id: 'hr', k: 'HR record', icon: 'ti-id-badge-2' },
        { id: 'groups', k: 'Access groups', icon: 'ti-users-group' },
        { id: 'changes', k: 'Join, move, leave', icon: 'ti-arrows-exchange' }
      ],
      levels: [
        { id: 'role', label: 'Role', from: 'From the access group' },
        { id: 'scope', label: 'Scope', from: 'From the HR record' },
        { id: 'records', label: 'Records', from: 'From assignments at the source' },
        { id: 'fields', label: 'Fields', from: 'From the sensitivity tags' },
        { id: 'actions', label: 'Actions', from: 'From the approval policy' },
        { id: 'delegation', label: 'Delegation', from: 'Time-bound, recorded' }
      ],
      changedLabel: 'Changed',
      app: 'NFR Workspace',
      menu: [
        { label: 'Ask the records', icon: 'ti-message-circle' },
        { label: 'Work Hub', icon: 'ti-apps' },
        { label: 'Processes', icon: 'ti-route' },
        { label: 'Agents', icon: 'ti-wand' }
      ],
      todayLabel: 'Today',
      inViewLabel: 'In view',
      maskedLabel: 'Masked',
      data: {
        label: 'How the data knows where it belongs',
        steps: [
          { k: 'Tagged at the source', icon: 'ti-tag', text: 'Unit, entity, supplier, risk type, sensitivity' },
          { k: 'Mapped once', icon: 'ti-affiliate', text: "Each system's fields linked to the tags" },
          { k: 'Inherited', icon: 'ti-copy', text: 'New records carry their tags' },
          { k: 'Checked at every read', icon: 'ti-shield-check', text: 'Role, scope and tags; fields masked' }
        ]
      },
      // Space steps through the people in this order, then moves on
      order: ['maya', 'ben', 'sara', 'tom'],
      people: [
        { id: 'maya', name: 'Maya', initials: 'MR', role: 'Third-party risk manager', scope: 'Retail banking',
          idm: { signin: 'Single sign-on, two factors', hr: 'Retail banking, main entity', groups: 'NFR-TPRM, NFR-APPROVE-T2', changes: 'From HR, the same day' },
          levels: { role: 'Third-party risk manager', scope: 'Retail banking, main entity', records: 'Retail suppliers: 38 of 214', fields: 'Personal data masked',
            actions: 'Request evidence; approve to tier 2', delegation: "Covers Ben's queue, 3 to 14 March" },
          menu: [true, true, true, true],
          today: ['4 supplier reviews due', '2 evidence requests open', '1 for your approval'],
          inView: '38 of 214 suppliers', masked: 'Personal data' },
        { id: 'ben', name: 'Ben', initials: 'BK', role: 'Third-party risk manager', scope: 'Wealth management',
          idm: { signin: 'Single sign-on, two factors', hr: 'Wealth management, wealth entity', groups: 'NFR-TPRM, NFR-APPROVE-T2', changes: 'From HR, the same day' },
          levels: { role: 'Third-party risk manager', scope: 'Wealth management, wealth entity', records: 'Wealth suppliers: 22 of 214', fields: 'Personal data masked',
            actions: 'Request evidence; approve to tier 2', delegation: 'None' },
          menu: [true, true, true, true],
          today: ['2 supplier reviews due', '3 evidence requests open', 'None to approve'],
          inView: '22 of 214 suppliers', masked: 'Personal data' },
        { id: 'sara', name: 'Sara', initials: 'SL', role: 'Head of NFR', scope: 'Group',
          idm: { signin: 'Single sign-on, two factors', hr: 'Group risk, every entity', groups: 'NFR-HEAD, NFR-APPROVE-T3', changes: 'From HR, the same day' },
          levels: { role: 'Head of NFR', scope: 'Group: every unit and entity', records: 'All 214 suppliers, summarised', fields: 'Personal data and case detail masked',
            actions: 'Approve acceptances above tier 2', delegation: 'One named deputy' },
          menu: [true, true, true, true],
          today: ['2 risks near appetite', '1 item for the board', '3 acceptances to approve'],
          inView: 'Every unit, summarised', masked: 'Personal data, case detail' },
        { id: 'tom', name: 'Tom', initials: 'TD', role: 'Control owner', scope: 'Procurement',
          idm: { signin: 'Single sign-on, two factors', hr: 'Procurement, main entity', groups: 'NFR-CONTROL-OWNER', changes: 'From HR, the same day' },
          levels: { role: 'Control owner', scope: 'Procurement, main entity', records: 'Own 6 controls and their evidence', fields: 'Supplier bank details masked',
            actions: 'Upload evidence; attest own controls', delegation: 'None' },
          menu: [true, true, false, false],
          today: ['2 controls need evidence', 'Q3 attestation due', '1 query from second line'],
          inView: '6 controls, own unit', masked: 'Bank details, contracts' }
      ],
      lockedLabel: 'Not in this profile'
    },

    // ── 09 The doorway into the live product ──
    enter: {
      statuses: ['Resolving role and permissions', 'Loading current decisions', 'Connecting approved applications', 'Workspace ready'],
      cue: 'Open live Workspace',
      cueKey: 'L',
      fallback: 'Product walkthrough',
      fallbackKey: 'F',
      hint: 'After the demonstration, return here and press Space.',
      // The five acts of the product's own presenter guide
      acts: ['The Workspace feels real', 'The next decision arrives prepared', 'A live question, a visual answer', 'From insight to action', 'The long tail, governed'],
      // The live product on the presenter's machine; ?live=<url> overrides it
      liveUrl: 'http://localhost:3200/'
    },

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
