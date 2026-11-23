// Scene: workspace-journey (v2 screen 08)
// Causal story: one periodic third-party review, end to end. The case opens with a
// summary the Workspace has already prepared. The role app shows what it gathered:
// the evidence checklist, current versus previous, the requirements, the gaps and the
// follow-up questions. The automation trace shows how the case got here and that it
// paused for a human. The professional makes the material judgement; only then is the
// outcome recorded, actions created, monitoring scheduled and an audit receipt issued.
// Beats: case-open, role-app-open, automation-trace-open, human-decision, decision-recorded.
SceneDirector.register('workspace-journey', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var K = window.WorkspaceKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var J = D.journey;

  var BEATS = ['case-open', 'role-app-open', 'automation-trace-open', 'human-decision', 'decision-recorded'];
  var TYPE_ICON = { system: 'ti-database', rule: 'ti-list-check', 'ai-assisted': 'ti-sparkles', 'human-gate': 'ti-user-check' };

  var cv = null;
  var n = {};
  var done = false;
  var beat = 0;
  var view = null;
  var choice = null;
  var timers = [];

  function C() { return window.TPRM_CASE; }
  function clearTimers() { timers.forEach(function(t) { t.destroy(); }); timers = []; }
  function reveal(groups, stagger, start) { timers.push(K.sequence(groups, stagger, start)); }

  function build() {
    clearTimers();
    if (cv) cv.destroy();
    cv = S.canvas(container, K.W, K.H, { id: 'ws-journey', maxScale: 1.4 });
    n = {};
    done = false;
    beat = 0;
    view = null;
    choice = null;
    var sh = K.shell(cv.el, { active: 'cases', assist: 'rail' });
    sh.app.classList.add('is-framed');
    n.shell = sh;
  }

  // Case header shared by every view of this case
  function caseHeader(parent, status, tone) {
    var c = C();
    var head = S.el('div', 'wj-head');
    var crumb = S.el('button', 'wj-crumb');
    crumb.type = 'button';
    crumb.appendChild(S.icon('ti-arrow-back-up'));
    crumb.appendChild(S.el('span', null, 'Decisions'));
    crumb.addEventListener('click', function(e) { e.stopPropagation(); K.goScreen('workspace-home'); });
    head.appendChild(crumb);
    head.appendChild(S.el('span', 'wj-title', c.provider));
    head.appendChild(K.chip(c.id, 'neutral'));
    head.appendChild(K.chip(K.dueLabel(c.due), 'human', 'ti-clock'));
    head.appendChild(S.el('span', 'ws-spacer'));
    n.status = K.chip(status, tone);
    n.status.classList.add('wj-status');
    head.appendChild(n.status);
    parent.appendChild(head);
    return head;
  }

  function panel(parent, title, cls) {
    var p = S.el('div', 'wj-panel' + (cls ? ' ' + cls : ''));
    p.appendChild(S.el('div', 'wj-panel-title', title));
    parent.appendChild(p);
    return p;
  }

  // ── Beat 0: the case summary ──
  function showCase() {
    clearTimers();
    n.shell.clearMain();
    view = 'case';
    var c = C();
    var main = n.shell.main;
    caseHeader(main, 'Prepared overnight', 'ai');
    var lead = S.el('div', 'wj-lead', J.appName + ' · ' + c.reviewType.toLowerCase() + ' · synthetic case');
    main.appendChild(lead);
    var grid = S.el('div', 'wj-summary');
    var cells = J.summary.map(function(f, i) {
      var cell = S.el('div', 'wj-sum' + (i === 4 ? ' is-gap' : ''));
      cell.appendChild(S.el('div', 'ws-field-k', f.k));
      cell.appendChild(S.el('div', 'wj-sum-v', f.v));
      grid.appendChild(cell);
      return cell;
    });
    main.appendChild(grid);
    var prep = S.el('div', 'wj-prepared');
    prep.appendChild(S.icon('ti-route'));
    prep.appendChild(S.el('span', null, 'Prepared overnight by NFR Automations in ' + J.trace.length + ' steps, then paused for your challenge.'));
    main.appendChild(prep);
    var actions = S.el('div', 'wj-actions');
    n.openApp = K.btn('Open the ' + J.appName.toLowerCase(), { kind: 'primary', icon: 'ti-apps', onClick: function() { go(1); } });
    n.openApp.classList.add('ws-cue');
    actions.appendChild(n.openApp);
    main.appendChild(actions);
    K.hide(cells, 'ts-up');
    K.hide([prep, actions]);
    reveal([cells.slice(0, 3), cells.slice(3), prep, actions], 140, 120);
  }

  // ── Beats 1 to 3: the role app ──
  function showApp() {
    if (view === 'app') return;
    clearTimers();
    n.shell.clearMain();
    view = 'app';
    var c = C();
    var main = n.shell.main;
    var head = caseHeader(main, 'Ready for judgement', 'ai');
    n.traceBtn = K.btn('Trace (A)', { kind: 'ghost', icon: 'ti-route', title: 'Automation trace: how the case was prepared (A)', onClick: function() { toggleTrace(); } });
    n.traceBtn.classList.add('wj-trace-btn');
    head.appendChild(n.traceBtn);

    var app = S.el('div', 'wj-app');
    var left = S.el('div', 'wj-col');
    var right = S.el('div', 'wj-col');

    var ev = panel(left, 'Evidence checklist');
    c.changes.forEach(function(ch) {
      var row = S.el('div', 'wj-ev is-in');
      row.appendChild(S.icon('ti-file-check'));
      row.appendChild(S.el('span', 'wj-ev-name', ch.evidence));
      row.appendChild(K.chip(ch.evidenceState, 'proof'));
      ev.appendChild(row);
    });
    c.missing.forEach(function(m) {
      var row = S.el('div', 'wj-ev is-gap');
      row.appendChild(S.icon('ti-alert-triangle'));
      row.appendChild(S.el('span', 'wj-ev-name', m.title));
      row.appendChild(K.chip('Missing', 'human'));
      ev.appendChild(row);
    });

    var cmp = panel(left, 'Current versus previous review');
    var hdr = S.el('div', 'wj-cmp wj-cmp-hd');
    ['Change', 'Previous', 'Current', 'Source'].forEach(function(h) { hdr.appendChild(S.el('span', null, h)); });
    cmp.appendChild(hdr);
    c.changes.forEach(function(ch) {
      var r = S.el('div', 'wj-cmp');
      r.appendChild(S.el('span', 'wj-cmp-k', ch.type));
      r.appendChild(S.el('span', 'wj-cmp-prev', ch.previous));
      r.appendChild(S.el('span', 'wj-cmp-cur', ch.current));
      r.appendChild(K.chip(ch.evidence, 'data'));
      cmp.appendChild(r);
    });

    var req = panel(right, 'Policy and method requirements');
    J.requirements.forEach(function(t) { var r = S.el('div', 'wj-line'); r.appendChild(S.icon('ti-file-certificate')); r.appendChild(S.el('span', null, t)); req.appendChild(r); });
    var gaps = panel(right, 'Exceptions and data gaps', 'is-gaps');
    J.exceptions.forEach(function(t) { var r = S.el('div', 'wj-line'); r.appendChild(S.icon('ti-alert-triangle')); r.appendChild(S.el('span', null, t)); gaps.appendChild(r); });
    var qs = panel(right, 'Proposed follow-up questions');
    J.questions.forEach(function(t) { var r = S.el('div', 'wj-line'); r.appendChild(S.icon('ti-message-circle')); r.appendChild(S.el('span', null, t)); qs.appendChild(r); });

    app.appendChild(left);
    app.appendChild(right);
    main.appendChild(app);
    n.app = app;

    var foot = S.el('div', 'wj-foot');
    foot.appendChild(S.el('span', 'wj-foot-note', 'Treatment options are proposed at the decision. Nothing is written until you decide.'));
    n.toDecision = K.btn('Go to decision', { kind: 'human', icon: 'ti-user-check', onClick: function() { go(3); } });
    foot.appendChild(n.toDecision);
    main.appendChild(foot);
    n.foot = foot;

    var parts = [ev, cmp, req, gaps, qs];
    K.hide(parts, 'ts-up');
    K.hide(foot);
    reveal([[ev, req], [cmp, gaps], qs, foot], 150, 80);
  }

  // Automation trace drawer over the role app
  function setTrace(open) {
    if (n.trace) { n.trace.remove(); n.trace = null; }
    if (n.traceBtn) n.traceBtn.setAttribute('aria-pressed', open ? 'true' : 'false');
    if (!open) return;
    var dr = S.el('div', 'wj-trace');
    dr.setAttribute('role', 'region');
    dr.setAttribute('aria-label', 'Automation trace');
    var th = S.el('div', 'wj-trace-head');
    th.appendChild(S.icon('ti-route'));
    th.appendChild(S.el('span', 'wj-trace-title', 'Automation trace'));
    th.appendChild(K.chip('Run AR-5518', 'neutral'));
    th.appendChild(S.el('span', 'ws-spacer'));
    th.appendChild(K.btn('Close', { kind: 'ghost', icon: 'ti-x', onClick: function() { toggleTrace(false); } }));
    dr.appendChild(th);
    var list = S.el('ol', 'wj-trace-list');
    var rows = J.trace.map(function(ev) {
      var li = S.el('li', 'wj-tr wj-tr-' + ev.type + (ev.status === 'waiting' ? ' is-waiting' : ''));
      li.appendChild(S.el('span', 'wj-tr-time', ev.t || '·'));
      li.appendChild(S.icon(TYPE_ICON[ev.type]));
      var body = S.el('span', 'wj-tr-body');
      body.appendChild(S.el('span', 'wj-tr-label', ev.label));
      body.appendChild(S.el('span', 'wj-tr-detail', ev.detail));
      li.appendChild(body);
      li.appendChild(K.chip(J.traceTypes[ev.type], ev.type === 'human-gate' ? 'human' : ev.type === 'ai-assisted' ? 'ai' : 'data'));
      list.appendChild(li);
      return li;
    });
    dr.appendChild(list);
    dr.appendChild(S.el('div', 'wj-trace-note', 'Read-only steps ran on their own. The case stopped at the human gate; nothing was written.'));
    n.shell.main.appendChild(dr);
    n.trace = dr;
    K.hide(rows, 'ts-left');
    reveal(rows, 110, 120);
  }

  // Decision panel over the lower part of the role app
  function showDecision() {
    if (n.decision) return;
    if (n.foot) n.foot.classList.add('is-hidden');
    if (n.app) n.app.classList.add('is-behind');
    if (n.status) { n.status.textContent = 'Human decision'; n.status.className = 'ws-chip ws-tone-human wj-status'; }
    var p = S.el('div', 'wj-decide');
    var hd = S.el('div', 'wj-decide-head');
    var gate = S.DecisionGate.create(hd, { size: 'small' });
    gate.activate();
    hd.appendChild(S.el('span', 'wj-decide-title', J.decisionTitle));
    hd.appendChild(S.el('span', 'wj-decide-note', J.decisionNote));
    p.appendChild(hd);
    var body = S.el('div', 'wj-decide-body');
    var rat = S.el('label', 'wj-rationale');
    rat.appendChild(S.el('span', 'ws-field-k', 'Rationale, drafted for you to edit'));
    var ta = document.createElement('textarea');
    ta.className = 'wj-rationale-input';
    ta.rows = 3;
    ta.value = J.rationale;
    rat.appendChild(ta);
    body.appendChild(rat);
    var opts = S.el('div', 'wj-options');
    J.decisions.forEach(function(d) {
      var b = K.btn(d.label, { kind: d.proposed ? 'human' : 'option', icon: d.proposed ? 'ti-circle-check' : (d.id === 'hold' ? 'ti-hand-stop' : 'ti-arrow-big-right'), onClick: function() { choice = d; go(4); } });
      b.classList.add('wj-option');
      if (d.proposed) { b.classList.add('ws-cue'); b.appendChild(K.chip('Proposed', 'ai')); }
      opts.appendChild(b);
    });
    body.appendChild(opts);
    p.appendChild(body);
    n.shell.main.appendChild(p);
    n.decision = p;
    K.hide(p, 'ts-up');
    reveal([p], 0, 40);
  }

  // ── Beat 4: recorded outcome and audit receipt ──
  function showRecorded() {
    clearTimers();
    n.shell.clearMain();
    n.decision = null;
    n.trace = null;
    view = 'recorded';
    var d = choice || J.decisions[0];
    var r = J.receipt;
    var main = n.shell.main;
    caseHeader(main, 'Decision recorded', 'proof');
    var wrap = S.el('div', 'wj-rec');
    var left = S.el('div', 'wj-rec-left');
    function item(icon, title, lines, tone) {
      var it = S.el('div', 'wj-rec-item' + (tone ? ' is-' + tone : ''));
      it.appendChild(S.icon(icon));
      var b = S.el('div', 'wj-rec-body');
      b.appendChild(S.el('div', 'wj-rec-title', title));
      lines.forEach(function(l) { b.appendChild(S.el('div', 'wj-rec-line', l)); });
      it.appendChild(b);
      left.appendChild(it);
      return it;
    }
    var items = [
      item('ti-user-check', 'Your decision', [d.label, 'By the ' + D.role.label + ' at ' + r.time], 'human'),
      item('ti-database', 'Outcome', [d.outcome, r.ack], 'proof'),
      item('ti-checklist', 'Actions created', d.actions, 'proof'),
      item('ti-calendar-event', 'Next monitoring event', [d.monitoring], 'data')
    ];
    wrap.appendChild(left);

    var rc = S.el('div', 'wj-receipt');
    var rh = S.el('div', 'wj-receipt-head');
    rh.appendChild(S.icon('ti-file-certificate'));
    rh.appendChild(S.el('span', 'wj-receipt-title', 'Audit receipt'));
    rh.appendChild(K.chip(r.id, 'proof'));
    rc.appendChild(rh);
    var dl = S.el('dl', 'wj-receipt-list');
    [['Decision', d.label], ['Decided by', r.decidedBy], ['Time', r.time], ['Sources', r.sources], ['Policy', r.policy], ['Automation', r.trace], ['Model', r.model]].forEach(function(kv) {
      dl.appendChild(S.el('dt', null, kv[0]));
      dl.appendChild(S.el('dd', null, kv[1]));
    });
    rc.appendChild(dl);
    var ack = S.ReceiptState.create(rc, { state: 'acknowledged', label: r.ack });
    ack.el.classList.add('wj-ack');
    wrap.appendChild(rc);
    main.appendChild(wrap);

    var foot = S.el('div', 'wj-foot');
    foot.appendChild(S.el('span', 'wj-principle', D.principle.join(' ')));
    foot.appendChild(K.btn('Replay this case', { kind: 'ghost', icon: 'ti-refresh', onClick: function() { go(0); } }));
    foot.appendChild(K.btn('Back to decisions', { kind: 'ghost', icon: 'ti-arrow-back-up', onClick: function() { K.goScreen('workspace-home'); } }));
    main.appendChild(foot);
    K.hide(items, 'ts-left');
    K.hide(rc, 'ts-pop');
    K.hide(foot);
    reveal([items[0], items[1], items[2], items[3], rc, foot], 160, 80);
  }

  function toggleTrace(force) {
    var open = force === undefined ? !n.trace : !!force;
    if (beat === 1 && open) { go(2); return; }
    if (beat === 2 && !open) { go(1); return; }
    if (beat === 3) { setTrace(open); K.setState(open ? 'automation-trace-open' : 'human-decision'); }
  }

  function go(b) {
    beat = b;
    if (b === 0) { choice = null; showCase(); }
    else if (b === 1) { showApp(); setTrace(false); }
    else if (b === 2) { showApp(); setTrace(true); }
    else if (b === 3) { showApp(); setTrace(false); showDecision(); }
    else if (b === 4) { showRecorded(); }
    K.setState(BEATS[b]);
    container.setAttribute('data-beat', BEATS[b]);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 60,   run: function() { go(0); } },
    { delay: 1500, run: function() { if (n.openApp) n.openApp.classList.add('is-ready'); } },
    { delay: 2200, run: complete }
  ];
  var tl = createTimeline(steps);

  function finishEntry() { if (cv) cv.setStatic(true); tl.finish(); if (cv && !K.isStatic()) cv.setStatic(false); }

  return {
    play: function() { build(); cv.setStatic(false); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { tl.reset(); build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { tl.reset(); clearTimers(); if (cv) cv.destroy(); S.restoreFallback(container); },
    advance: function() {
      if (!done) { finishEntry(); return true; }
      if (beat === 3) { choice = J.decisions[0]; go(4); return true; }
      if (beat < BEATS.length - 1) { go(beat + 1); return true; }
      return false;
    },
    key: function(k) {
      if (k === 'a' || k === 'A') {
        if (beat >= 1 && beat <= 3) { toggleTrace(); return true; }
        if (beat === 0) { go(2); return true; }
        return false;
      }
      if (k === 'Escape' && n.trace) { toggleTrace(false); return true; }
      return false;
    },
    getAccessibleSummary: function() {
      var c = C();
      return 'Periodic third-party review ' + c.id + ' in the NFR Workspace. The case summary shows ' + J.summary.map(function(f) { return f.k.toLowerCase() + ': ' + f.v; }).join('; ')
        + '. The role app shows the evidence checklist, current versus previous, requirements, gaps and follow-up questions. The automation trace lists '
        + J.trace.length + ' steps and ends paused for human challenge. The professional decides; then the outcome is recorded, actions are created, monitoring is scheduled and an audit receipt is issued.';
    },
    destroy: function() { tl.destroy(); clearTimers(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
