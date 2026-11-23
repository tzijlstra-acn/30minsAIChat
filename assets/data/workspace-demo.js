// -- NFR WORKSPACE DEMO -- synthetic content for the core route and appendix --
// One immutable object. Every scene, the appendix pages and the technical drawer read
// their words and numbers from here (and the periodic-review facts from window.TPRM_CASE);
// no scene restates them in its own code. Everything is synthetic and bank-neutral.
// v4: one coherent third-party world across the home, the insight, the journey and the
// builder; the appendix topics A to E are public-safe and name no internal asset.
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
  var WORDS = ['no', 'one', 'two', 'three', 'four', 'five'];
  function word(n) { return WORDS[n] || String(n); }

  var DEMO = {
    synthetic: true,
    product: 'NFR Workspace',
    principle: ['AI prepares.', 'Professionals decide.', 'Systems record.'],
    syntheticLabel: 'Synthetic demonstration',
    // The one sentence that separates an assistant from the Workspace
    difference: ['An assistant helps a person complete an activity.', 'NFR Workspace carries the role, case, evidence, controls and permitted actions across the work.'],

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

    // ── Four ways to work: plain verb, product, when to use it, one concrete example ──
    capabilities: [
      { id: 'assist', verb: 'Ask', product: 'NFR Assist', icon: 'ti-message-circle',
        line: 'Role-steered help in email, chat, documents, meetings and the Workspace.',
        when: 'You need help inside the current task',
        example: 'Summarise what changed in this review.',
        definition: 'Conversational help that uses role and case context where permitted.',
        authority: 'Draft and explain',
        value: 'Faster search, drafting, explanation and communication' },
      { id: 'app', verb: 'Use', product: 'NFR Apps', icon: 'ti-apps',
        line: 'A connected application for a defined NFR task, with its method and evidence.',
        when: 'You need to complete a defined role task',
        example: 'Complete a periodic third-party review.',
        definition: 'Role app: a connected application for a defined NFR task.',
        authority: 'Prepare and validate a defined task',
        value: 'Better evidence quality, consistency and task execution' },
      { id: 'automation', verb: 'Run', product: 'NFR Automations', icon: 'ti-route',
        line: 'Controlled execution of repeatable work across systems and human control points.',
        when: 'You need a repeatable cross-system process',
        example: 'Collect evidence, check completeness, route challenge, record the approved outcome.',
        definition: 'Automation: a controlled process that moves work between systems and people.',
        authority: 'Execute approved steps and pause at human gates',
        value: 'Fewer handoffs, shorter cycles, timely escalation, scalable processing' },
      { id: 'builder', verb: 'Create', product: 'Agent Builder', icon: 'ti-wand',
        line: 'Permission-aware ad hoc reports, analyses and monitoring for the long tail.',
        when: 'You need a new or temporary multi-source analysis',
        example: 'Build a temporary concentration briefing from approved records.',
        definition: 'Ad hoc agent: a temporary or reusable analysis inside approved permissions.',
        authority: 'Read, analyse, draft and monitor within explicit permissions',
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
    layersLine: 'Improving only the AI component creates another pilot.',
    layersLine2: 'Scaling NFR work requires all three layers to move together.',

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
      statuses: ['Resolving role and permissions', 'Loading current decisions', 'Connecting approved applications', 'Synchronising case and evidence state'],
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

    // ── Scene seven: a decision-first home in one third-party world ──
    home: {
      title: 'Your day',
      meta: '1 decision now · 2 next · 3 signals watched',
      labels: { now: 'Now', next: 'Next', watching: 'Watching', done: 'Done by the Workspace overnight', recorded: 'Recorded today' },
      fields: { why: 'Why it is here', changed: 'What changed', prepared: 'What was prepared', decision: 'Decision needed' },
      now: { id: C.id, journey: 'Periodic third-party review', icon: 'ti-building-bank', title: C.provider,
        why: C.criticality + ' service, review due ' + C.due.toLowerCase(),
        changed: C.changes.length + ' material changes since the last review',
        prepared: 'Evidence checklist, comparison with the last review, follow-up questions',
        evidenceHave: C.changes.length, evidenceTotal: C.changes.length + C.missing.length,
        evidenceNote: C.missing.length + ' report missing',
        decision: 'Renew, with or without conditions', due: C.due },
      next: [
        { id: C.queue[1].id, journey: 'Key risk indicator breach', icon: 'ti-alert-triangle', title: 'Managed network availability',
          why: 'Indicator crossed its threshold twice this month', changed: 'Availability fell for two quarters',
          prepared: 'Explanation drafted from incidents and indicator data',
          evidenceHave: 3, evidenceTotal: 3, evidenceNote: 'Evidence prepared',
          decision: 'Accept the explanation or escalate', due: 'Tomorrow' },
        { id: C.queue[2].id, journey: 'Contract renewal', icon: 'ti-file-text', title: 'Card processing provider',
          why: 'Renewal window opens in 30 days', changed: 'Exit-plan acceptance expires in 64 days',
          prepared: 'Terms and exit plan compared with policy',
          evidenceHave: 2, evidenceTotal: 3, evidenceNote: 'Exit test pending',
          decision: 'Confirm the renewal conditions', due: 'Friday' }
      ],
      watching: [
        { text: 'Risk acceptance RA-0331 expires in 21 days', icon: 'ti-clock', tone: 'human' },
        { text: 'Provider A carries four critical services', icon: 'ti-hierarchy-2', tone: 'data' },
        { text: 'Two services without an indicator feed for 30 days', icon: 'ti-alert-triangle', tone: 'gap' }
      ],
      done: ['9 evidence items refreshed', '3 reminders sent', '1 periodic review prepared']
    },

    // ── One visual, source-linked answer (asked from the home screen) ──
    insight: {
      question: 'Which critical third-party services are deteriorating, and why?',
      answeredBy: 'NFR Assist, approved sources',
      conclusion: 'Three of 42 critical services are deteriorating. Cloud hosting moved most, four critical services depend on it, and its review is due ' + C.due.toLowerCase() + '.',
      // Decision facts, consistent with the home, the case and the Agent Builder briefing
      figures: [
        { v: '3', k: 'services deteriorating', tone: 'risk' },
        { v: '2', k: 'severe issues open', tone: 'risk' },
        { v: '2', k: 'acceptances expiring', tone: 'human' },
        { v: String(C.missing.length), k: 'required report missing', tone: 'human' }
      ],
      // Supported visual types only (WorkspaceKit.VISUAL_TYPES); titles state the conclusion
      visuals: [
        { id: 'ranking', type: 'ranked-bar', title: 'Cloud hosting moved most, +18 points', unit: 'points',
          summary: 'Two-quarter change, points', source: 'Risk indicators',
          data: [
            { label: 'Cloud hosting', provider: 'Provider A', value: 18, selected: true },
            { label: 'Managed network', provider: 'Provider B', value: 11 },
            { label: 'Card processing', provider: 'Provider C', value: 7 },
            { label: 'Payroll service', provider: 'Provider D', value: 1 },
            { label: 'Document storage', provider: 'Provider E', value: -2 }
          ] },
        { id: 'trend', type: 'trend-line', title: 'Above appetite since September', unit: 'score',
          summary: 'Score; dashed line: appetite 52', source: 'Risk indicators',
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], values: [42, 44, 47, 55, 57, 60], threshold: 52 }
      ],
      driversTitle: 'What is driving it',
      drivers: C.changes.map(function(ch) { return { text: ch.title + ' · ' + ch.tag, source: ch.evidence }; })
        .concat(C.missing.map(function(m) { return { text: m.title + ' missing', source: 'Evidence checklist', gap: true }; })),
      freshness: 'indicators refreshed 06:00 · within your access',
      nextTitle: 'Recommended next action',
      next: 'Open the Periodic Review app for cloud hosting: ' + word(C.changes.length) + ' material changes and ' + word(C.missing.length) + ' missing report to validate.',
      saves: [
        { id: 'pin', label: 'Pin to My work', icon: 'ti-pin', result: 'Pinned to My work, private to you.' },
        { id: 'attach', label: 'Attach to the case as a draft', icon: 'ti-paperclip', result: 'Attached to the case as a draft note. Nothing written to the system of record.' }
      ]
    },

    // ── Source records behind every source chip (insight, case comparison) ──
    // Keyed by the source name the chips show. Synthetic; opening one changes nothing.
    evidence: {
      'Risk indicators': { record: 'KRI-CH-07 · Cloud hosting availability score', version: 'Refreshed today at 06:00', freshness: 'Current',
        excerpt: 'Score 60 against an appetite of 52. Above appetite since the September incident; up 18 points over two quarters.',
        usedFor: 'Ranking and trend charts' },
      'Contract annex': { record: 'Annex C · Sub-processor list, version 4', version: 'Approved five weeks ago', freshness: 'Current',
        excerpt: 'A third sub-processor is added for data-centre operations in Ireland.',
        usedFor: 'Sub-processor change' },
      'SOC 2 Type II': { record: 'Independent assurance report, 12-month period', version: 'Issued three weeks ago', freshness: 'Current',
        excerpt: 'Two exceptions: change approvals not evidenced for two of 25 sampled changes.',
        usedFor: 'Assurance change, SOC 2 exceptions' },
      'Incident log': { record: 'INC-4471 · Priority 2 · September', version: 'Closed, root cause recorded', freshness: 'Current',
        excerpt: 'Four hours of degraded availability in one region after a failed configuration change.',
        usedFor: 'Incident change, indicator rise' },
      'Evidence checklist': { record: 'Third-party policy 4.2 · Critical services', version: 'Checked today at 06:03', freshness: 'Missing',
        excerpt: 'Penetration-test report within 12 months: not received. The last report is 14 months old.',
        usedFor: 'Missing evidence, case condition' }
    },
    evidenceAccess: 'Read only, within your access',
    evidenceNote: 'Synthetic record. Opening a source reads it; nothing changes.',

    // ── NFR Assist: suggested questions, deterministic answers, hand-off to the app ──
    assist: {
      contextChip: 'Your role and open cases',
      placeholder: 'Ask about your work',
      note: 'Draft for your review. NFR Assist explains; you decide.',
      openApp: 'Open Periodic Review App',
      questions: [
        { id: 'deteriorating', q: 'Which critical third-party services are deteriorating, and why?', insight: true,
          a: ['Answer opened in the workspace: 3 services, ' + (C.changes.length + C.missing.length) + ' drivers, ' + (C.changes.length + 1) + ' sources.'],
          sources: ['Risk indicators', 'Incident log', 'SOC 2 Type II', 'Contract annex'] },
        { id: 'changed', q: 'What changed since the previous review?',
          a: C.changes.map(function(ch) { return ch.type + ': ' + ch.detail; }),
          sources: C.changes.map(function(ch) { return ch.evidence; }),
          handoff: 'I found ' + word(C.changes.length) + ' material changes and ' + word(C.missing.length) + ' missing report. Open the Periodic Review app to validate them against the approved method.' },
        { id: 'missing', q: 'Which evidence is missing or stale?',
          a: [C.missing[0].title + ': missing, ' + C.missing[0].requirement.toLowerCase(), C.changes[1].evidence + ': current, ' + C.changes[1].tag.toLowerCase() + ' noted'],
          sources: ['Evidence checklist', 'Third-party policy 4.2'] }
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
        { id: 'compare', label: 'Material changes identified', type: 'ai-assisted', detail: C.changes.length + ' changes since the last review', t: '06:05' },
        { id: 'map', label: 'Requirements mapped', type: 'ai-assisted', detail: 'Third-party policy, section 4', t: '06:06' },
        { id: 'exceptions', label: 'Exceptions prepared', type: 'ai-assisted', detail: 'SOC 2 exceptions and 1 gap', t: '06:07' },
        { id: 'pause', label: 'Paused for human challenge', type: 'human-gate', detail: 'Waiting for the risk manager', status: 'waiting' }
      ],
      traceAfter: ['Approved conclusion recorded', 'Actions created', 'Monitoring scheduled', 'Audit receipt generated'],
      traceTypes: { system: 'System', rule: 'Rule', 'ai-assisted': 'AI-assisted', 'human-gate': 'Human gate' },
      decisionTitle: 'Your decision',
      decisionNote: 'The Workspace prepared and routed this case. The judgement is yours.',
      rationale: 'Sub-processor and SOC 2 changes reviewed; report gap is time-bound and owned.',
      decisions: [
        { id: 'approve-condition', label: C.proposedAction, proposed: true,
          outcome: 'Approved outcome recorded in the system of record',
          actions: ['30-day follow-up: obtain the ' + C.missing[0].title.toLowerCase(), 'Track the SOC 2 exceptions to closure'],
          monitoring: 'Day-30 evidence check scheduled',
          status: 'Approved with condition',
          reason: 'Changes reviewed; report gap is time-bound',
          actionOwner: 'Vendor manager, due in 30 days',
          changes: [
            { field: 'Review status', from: 'Due ' + C.due.toLowerCase(), to: 'Approved with condition' },
            { field: 'Condition', from: 'None', to: C.missing[0].title + ' within 30 days' },
            { field: 'Follow-up actions', from: 'None', to: '2 to create, with owners' },
            { field: 'Next monitoring', from: 'None', to: 'Day-30 evidence check' }
          ] },
        { id: 'hold', label: 'Hold the renewal until the report arrives',
          outcome: 'Hold recorded with its reason',
          actions: ['Evidence request drafted for the vendor manager to send'],
          monitoring: 'Case resumes when the report arrives, or in 10 days',
          status: 'On hold, evidence requested',
          reason: 'Required report missing before renewal',
          actionOwner: 'Vendor manager, due in 10 days',
          changes: [
            { field: 'Review status', from: 'Due ' + C.due.toLowerCase(), to: 'On hold, evidence requested' },
            { field: 'Follow-up actions', from: 'None', to: '1 evidence request, draft' },
            { field: 'Next monitoring', from: 'None', to: 'Resume on receipt, or in 10 days' }
          ] },
        { id: 'escalate', label: 'Escalate to second-line challenge',
          outcome: 'Escalation recorded with the prepared case attached',
          actions: ['Second-line reviewer assigned'],
          monitoring: 'Challenge due in 5 days',
          status: 'Escalated to second line',
          reason: 'Exceptions need independent challenge',
          actionOwner: 'Second-line reviewer, due in 5 days',
          changes: [
            { field: 'Review status', from: 'Due ' + C.due.toLowerCase(), to: 'Escalated to second line' },
            { field: 'Follow-up actions', from: 'None', to: 'Second-line reviewer assigned' },
            { field: 'Next monitoring', from: 'None', to: 'Challenge due in 5 days' }
          ] }
      ],
      writeback: {
        title: 'Write-back preview',
        pending: 'Nothing written yet',
        intro: 'Check exactly what gets recorded, then confirm.',
        target: 'System of record (synthetic GRC)',
        record: C.id + ' · ' + C.provider,
        approver: 'You, as NFR Risk Manager',
        evidence: (C.changes.length + C.missing.length) + ' sources, versions pinned',
        checks: ['Role and record scope checked', 'Within your delegated authority', 'Scoped connector; the model holds no credentials'],
        confirm: 'Confirm and record',
        back: 'Back to the decision',
        queueChange: 'Moved from Now to Recorded today'
      },
      receipt: {
        id: 'RCPT-1124-0042',
        decidedBy: 'NFR Risk Manager (synthetic user)',
        actor: 'Synthetic user',
        role: 'NFR Risk Manager',
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
      intro: 'Standard apps and automations cover repeatable work. Agent Builder covers changing and ad hoc needs within the same permissions, evidence and controls. Describe what you need; the Workspace proposes a plan using only approved data and actions.',
      prompt: 'Create a one-page briefing of critical third-party services with worsening risk indicators, open high-severity issues, or risk acceptances expiring in the next 90 days. Group the findings by underlying provider concentration and cite every material statement.',
      editedNote: 'This demonstration interprets the example request. Your edits stay in the box.',
      steps: ['Goal', 'Permissions', 'Plan', 'Run', 'Reuse'],
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
        clustersTitle: 'Concentration by provider',
        clusters: [
          { provider: 'Provider A', kind: 'Cloud hosting', count: 4, services: 'Payments gateway, client portal, data warehouse, document archive' },
          { provider: 'Provider B', kind: 'Managed network', count: 2, services: 'Branch connectivity, trading network' },
          { provider: 'Provider C', kind: 'Card processing', count: 1, services: 'Card authorisation' }
        ],
        expiryTitle: 'Acceptances expiring in 90 days',
        expiryWindow: 90,
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
        { id: 'schedule', label: 'Schedule weekly', icon: 'ti-calendar-event', result: 'Scheduled for Mondays at 07:00 as a personal agent. Each run uses your access at that time and stays private.', stage: 1 },
        { id: 'template', label: 'Request team template', icon: 'ti-users-group', result: 'Request sent to the template owner. Published only after owner and control review.', stage: 2 }
      ],
      promotion: ['Run once', 'Personal agent', 'Reviewed team template', 'Standard app or automation'],
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
      entry: ['Named business and process owner', 'One bounded case type', 'Representative records and source-system access', 'Approved platform route', 'Agreed AI, rules and human boundary', 'Agreed proof thresholds'],
      proofTitle: 'What month six proves',
      proof: ['One role experience', 'One connected role app', 'One bounded automation loop', 'One constrained ad hoc reporting pattern', 'Measured risk, process and capacity outcomes'],
      notInScope: 'Not in scope: an enterprise-wide NFR platform in six months.'
    },

    // ── Scene twelve: value and the workshop decision ──
    value: {
      outcomes: [
        { id: 'risk', label: 'Risk outcomes', items: ['Better evidence completeness', 'More consistent policy application', 'Earlier detection of material change', 'More complete decision trace'] },
        { id: 'operating', label: 'Operating performance', items: ['Faster review cycle', 'Fewer handoffs and follow-ups', 'Fewer overdue cases', 'Faster escalation'] },
        { id: 'capacity', label: 'Capacity and economics', items: ['Lower human touch time', 'Less avoidable rework', 'Sustainable cost per case', 'Capacity redirected to judgement'] }
      ],
      measureNote: 'Capacity, elapsed time and control quality are measured separately. Waiting time saved is not headcount.',
      question: 'Which role, decision and bounded process should become the first controlled loop?',
      next: 'And what evidence would authorise the next wave?',
      criteria: ['High manual integration burden', 'Bounded data and decision path', 'Measurable risk and operating outcome']
    },

    // ── Appendix A to E and measures: rendered as appendix pages and in the drawer (T) ──
    // Public-safe: no internal asset is named; the runtime is described generically.
    technical: {
      tabs: [
        { id: 'choice', label: 'A · Capability choice', page: 'appendix-capability-choice' },
        { id: 'architecture', label: 'B · Architecture', page: 'appendix-architecture' },
        { id: 'runtime', label: 'C · Runtime reuse', page: 'appendix-runtime-reuse' },
        { id: 'lifecycle', label: 'D · Agent lifecycle', page: 'appendix-agent-lifecycle' },
        { id: 'writeback', label: 'E · Governed write-back', page: 'appendix-writeback' },
        { id: 'metrics', label: 'Measures' }
      ],
      choice: {
        headline: 'Every NFR need has a suitable path.',
        columns: ['Need', 'Path', 'Example', 'Default authority'],
        rows: [
          { need: 'Help inside current work', path: 'Ask', product: 'NFR Assist', example: 'Summarise a review or draft questions', authority: 'Draft and explain' },
          { need: 'A defined role task', path: 'Use', product: 'NFR Apps', example: 'Complete a periodic review', authority: 'Prepare and validate' },
          { need: 'A repeatable cross-system process', path: 'Run', product: 'NFR Automations', example: 'Collect, check, route and record', authority: 'Execute approved steps and pause at human gates' },
          { need: 'A new or temporary multi-source need', path: 'Create', product: 'Agent Builder', example: 'Build a concentration briefing', authority: 'Read, analyse, draft and monitor within explicit permissions' }
        ],
        footer: 'Not every question needs an agent. Not every agent should become an application. Recurrence, materiality and control needs decide the path.'
      },
      architecture: {
        headline: 'The Workspace owns the experience. Approved runtime services execute the work. Systems of record remain authoritative.',
        layers: [
          { label: 'NFR Workspace', note: 'Business experience', items: ['Role queue', 'NFR Assist', 'Role apps', 'Agent Builder', 'Visual insights', 'Decisions and write-back preview'] },
          { label: 'NFR runtime gateway', note: 'Stable contract', items: ['Identity and role mapping', 'Case correlation', 'Structured request and result contract', 'Permission and policy checks', 'Approval orchestration', 'Audit correlation'] },
          { label: 'Approved enterprise execution services', note: 'Execution', items: ['Agents and skills', 'Triggers and schedules', 'Multi-step flows', 'Memory and knowledge', 'Governed connectors', 'Human gates', 'Cost and runtime controls'] },
          { label: 'Authoritative enterprise systems', note: 'System of record', items: ['GRC', 'Documents and policy', 'Third-party inventory', 'Issues and actions', 'Incidents', 'Controls and KRIs', 'Collaboration channels'] }
        ],
        footer: 'Deliberately runtime-pluggable: NFR Workspace does not depend on one model, one agent runtime or one system of record.'
      },
      runtime: {
        headline: 'NFR Workspace is the business product. A validated agent runtime can provide reusable execution and governance underneath it.',
        columns: [
          { id: 'reuse', label: 'Reuse candidates', items: ['Agent roles and reusable skills', 'Schedules and event triggers', 'Multi-step flows', 'Human approval gates', 'Persistent memory and team knowledge', 'Scoped plugins and credential separation', 'Isolated execution', 'Audit and session trace', 'Loop protection and runtime observability', 'Agent and process templates'] },
          { id: 'adapt', label: 'Adapt before NFR use', items: ['NFR vocabulary and role model', 'Document, email, API and enterprise-event triggers', 'Structured NFR result schemas', 'Identity and entitlement mapping', 'Case state held in an enterprise system', 'Business-system write-back connectors', 'A packaged integration API or runtime gateway', 'Document comparison and evidence lineage', 'NFR monitoring and value measures', 'Production security and data handling'] },
          { id: 'keep', label: 'Keep out of the business UI', items: ['Developer workflow objects such as issues, branches and labels', 'Chat and messaging infrastructure', 'Runtime and container details', 'Model and runtime selection', 'Raw flow wiring', 'Developer administration', 'Platform-specific vocabulary'] }
        ],
        fitTitle: 'Where a runtime matters most',
        fit: [
          { path: 'Ask', level: 1, text: 'Low to medium' },
          { path: 'Use', level: 2, text: 'Medium, as a backend' },
          { path: 'Run', level: 3, text: 'High' },
          { path: 'Create', level: 3, text: 'High, behind a simple builder' }
        ],
        footer: 'Candidate accelerator, not a mandatory dependency. Validate the asset, ownership, licensing, security posture and integration contract before committing the target architecture.'
      },
      lifecycle: {
        headline: 'Ad hoc work can mature without bypassing governance.',
        stages: [
          { label: 'Run once', points: ['Private', 'Read, analyse and draft', 'Explicit sources and permissions', 'Full trace'] },
          { label: 'Personal agent', points: ['Reusable by its creator', 'Usage and value measured', 'No material write-back by default'] },
          { label: 'Reviewed team template', points: ['Named owner', 'Approved data and actions', 'Tested output quality', 'Support and monitoring defined'] },
          { label: 'Standard app or automation', points: ['Stable process and control design', 'Formal release and change ownership', 'Operational monitoring', 'Approved write-back and escalation'] }
        ],
        gatesTitle: 'Decision gates between stages',
        gates: ['Recurrence', 'Materiality', 'Data sensitivity', 'Required authority', 'Value shown', 'Ownership and support', 'Control effectiveness'],
        footer: 'The builder is a discovery and delivery path, not a back door around standardisation.'
      },
      writeback: {
        headline: 'Every material action is proposed, checked, approved, attributed and recorded.',
        flow: ['An insight or automation proposes an action', 'The Workspace shows target, record, fields, reason, evidence and expected change', 'A role and permission check runs', 'A human approves where required', 'A governed connector acts with scoped credentials', 'The authoritative system confirms the result', 'The Workspace updates the case state', 'An audit receipt records actor, time, sources, action and outcome'],
        strip: ['Least privilege', 'No credential exposure to the model', 'Record-level scope', 'Maker-checker where material', 'Idempotent, with safe retry', 'Failure and fallback handling', 'Append-only audit reference', 'Authoritative system remains authoritative'],
        catalogueTitle: 'Control catalogue',
        catalogue: [
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
        ]
      },
      metrics: [
        ['Evidence quality', ['Evidence completeness', 'Evidence freshness', 'Extraction and citation accuracy', 'Material-change detection recall']],
        ['Decision quality', ['Human override rate and reason', 'Rework', 'Unsupported or unauthorised writebacks', 'Audit replay success']],
        ['Process performance', ['Touch time', 'Cycle time', 'Overdue cases', 'Run cost per case or report']],
        ['Ad hoc and adoption', ['Time to create an ad hoc report', 'Ad hoc agent reuse rate', 'Promotion rate to governed templates', 'Adoption by eligible users and cases']]
      ],
      metricsNote: 'Waiting time saved is reported as elapsed time, not as headcount.'
    }
  };

  // The cover's queue silhouette and older callers read one flat list: now, then next
  DEMO.queue = [DEMO.home.now].concat(DEMO.home.next);

  var FROZEN = deepFreeze(DEMO);
  global.NFR_WORKSPACE_DEMO = FROZEN;
  if (typeof module !== 'undefined' && module.exports) module.exports = FROZEN;
}(typeof window !== 'undefined' ? window : globalThis));
