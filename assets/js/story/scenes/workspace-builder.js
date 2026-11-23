// Scene: workspace-builder (v2 screen 09)
// Causal story: for work no app or automation covers, the user describes the outcome.
// The Workspace interprets the goal (editable), then shows the scope before anything
// runs: what the agent can read, what it can create, what it cannot do, who sees the
// output. The user reviews a five-step plan and presses Run. A staged, deterministic
// run produces a one-page, source-linked briefing marked for human review. Reuse is
// governed: run once, save privately, or request a reviewed team template, on a
// promotion path that ends in a standard app or automation.
// Builder flow: idle, goal-interpreted, scope-reviewed, plan-reviewed, running,
// output-ready, saved-personal, publication-requested.
SceneDirector.register('workspace-builder', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var K = window.WorkspaceKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.builder;

  var STATES = ['agent-builder-goal', 'agent-builder-goal', 'agent-builder-scope', 'agent-builder-plan', 'agent-builder-output', 'agent-builder-save'];
  var FLOW = ['idle', 'goal-interpreted', 'scope-reviewed', 'plan-reviewed', 'output-ready', 'output-ready'];

  var cv = null;
  var n = {};
  var done = false;
  var beat = 0;
  var running = false;
  var reuseStage = -1;
  var promptText = '';
  var goalEdits = null;
  var planEdits = null;
  var timers = [];

  function clearTimers() { timers.forEach(function(t) { t.destroy(); }); timers = []; }
  function reveal(groups, stagger, start) { timers.push(K.sequence(groups, stagger, start)); }

  function flow(name) {
    container.setAttribute('data-builder', name);
    if (document.body) document.body.setAttribute('data-builder-state', name);
  }

  function build() {
    clearTimers();
    if (cv) cv.destroy();
    cv = S.canvas(container, K.W, K.H, { id: 'ws-builder', maxScale: 1.4 });
    n = {};
    done = false;
    beat = 0;
    running = false;
    reuseStage = -1;
    promptText = '';
    goalEdits = null;
    planEdits = null;
    var sh = K.shell(cv.el, { active: 'create', assist: 'rail' });
    sh.app.classList.add('is-framed');
    n.shell = sh;
    n.stepper = K.stepper(sh.main, B.steps);
    n.stepper.el.classList.add('wa-stepper');
    n.body = S.el('div', 'wa-body');
    sh.main.appendChild(n.body);
  }

  function title(text, chipText, tone) {
    var row = S.el('div', 'wa-title-row');
    row.appendChild(S.el('div', 'wa-title', text));
    if (chipText) row.appendChild(K.chip(chipText, tone || 'ai'));
    return row;
  }

  function actions(list) {
    var row = S.el('div', 'wa-actions');
    list.forEach(function(b) { row.appendChild(b); });
    return row;
  }

  // Compact request line once the goal is agreed
  function requestLine() {
    var r = S.el('div', 'wa-request');
    r.appendChild(S.el('span', 'ws-label', 'Request'));
    r.appendChild(S.el('span', 'wa-request-text', B.prompt));
    return r;
  }

  // ── Beats 0 and 1: describe, then understand the goal ──
  function showGoal(interpreted, typing) {
    clearTimers();
    n.body.innerHTML = '';
    var head = title(B.title, 'Runs inside your permissions', 'data');
    n.body.appendChild(head);
    n.body.appendChild(S.el('div', 'wa-intro', B.intro));
    var box = S.el('div', 'wa-prompt');
    box.appendChild(S.el('label', 'ws-field-k', 'What do you need?'));
    var ta = document.createElement('textarea');
    ta.className = 'wa-prompt-input';
    ta.rows = interpreted ? 2 : 3;
    ta.setAttribute('aria-label', 'Describe the report or analysis you need');
    ta.value = typing ? '' : (promptText || B.prompt);
    box.appendChild(ta);
    n.prompt = ta;
    var note = S.el('div', 'wa-edited', B.editedNote);
    note.hidden = true;
    n.edited = note;
    ta.addEventListener('input', function() { promptText = ta.value; note.hidden = ta.value.trim() === B.prompt; });
    var btns = [
      K.btn('Use example', { kind: 'ghost', icon: 'ti-refresh', onClick: function() { ta.value = B.prompt; promptText = B.prompt; note.hidden = true; } })
    ];
    if (!interpreted) {
      n.interpret = K.btn('Interpret request', { kind: 'primary', icon: 'ti-sparkles', onClick: function() { go(1); } });
      n.interpret.classList.add('ws-cue');
      btns.push(n.interpret);
    }
    var row = actions(btns);
    row.appendChild(note);
    box.appendChild(row);
    n.body.appendChild(box);
    n.promptRow = row;

    if (interpreted) {
      var card = S.el('div', 'wa-card wa-goal');
      card.appendChild(title('Step 1 · Understand the goal', 'Edit before continuing', 'neutral'));
      var rows = S.el('dl', 'wa-goal-list');
      B.goal.forEach(function(g, i) {
        rows.appendChild(S.el('dt', null, g.k));
        var dd = S.el('dd');
        if (goalEdits) {
          var inp = document.createElement('input');
          inp.className = 'wa-input';
          inp.value = goalEdits[i];
          inp.setAttribute('aria-label', g.k);
          inp.addEventListener('input', function() { goalEdits[i] = inp.value; });
          dd.appendChild(inp);
        } else {
          dd.textContent = (n.goalValues && n.goalValues[i]) || g.v;
        }
        rows.appendChild(dd);
      });
      card.appendChild(rows);
      var editBtn = K.btn(goalEdits ? 'Done' : 'Edit goal', { kind: 'ghost', icon: goalEdits ? 'ti-check' : 'ti-pencil', onClick: function() {
        if (goalEdits) { n.goalValues = goalEdits.slice(); goalEdits = null; } else { goalEdits = (n.goalValues || B.goal.map(function(g) { return g.v; })).slice(); }
        showGoal(true, false);
      } });
      var next = K.btn('Continue to scope', { kind: 'primary', icon: 'ti-arrow-right', onClick: function() { go(2); } });
      next.classList.add('ws-cue');
      card.appendChild(actions([editBtn, next]));
      n.body.appendChild(card);
      K.hide(card, 'ts-up');
      reveal([card], 0, 60);
    }

    if (typing && !K.isStatic()) {
      K.hide(row);
      var chunks = 9;
      var steps = [];
      for (var c = 1; c <= chunks; c++) {
        (function(c) { steps.push({ delay: 120 + c * 130, run: function() { ta.value = B.prompt.slice(0, Math.round(B.prompt.length * c / chunks)); } }); }(c));
      }
      steps.push({ delay: 120 + chunks * 130 + 150, run: function() { S.on(row); } });
      var tl = createTimeline(steps);
      timers.push(tl);
      tl.play();
    } else if (typing) {
      ta.value = B.prompt;
    }
  }

  // ── Beat 2: scope and permissions, before anything runs ──
  function showScope() {
    clearTimers();
    n.body.innerHTML = '';
    var sc = B.scope;
    n.body.appendChild(requestLine());
    n.body.appendChild(title('Step 2 · Review scope and permissions', 'Shown before anything runs', 'human'));
    var cols = S.el('div', 'wa-scope');
    function col(cls, icon, label, items) {
      var c = S.el('div', 'wa-scope-col ' + cls);
      var h = S.el('div', 'wa-scope-head');
      h.appendChild(S.icon(icon));
      h.appendChild(S.el('span', null, label));
      h.appendChild(S.el('span', 'wa-scope-count', String(items.length)));
      c.appendChild(h);
      var ul = S.el('ul');
      items.forEach(function(it) { ul.appendChild(S.el('li', null, it)); });
      c.appendChild(ul);
      cols.appendChild(c);
      return c;
    }
    var cRead = col('is-read', 'ti-eye', 'Can read', sc.read);
    var cMake = col('is-create', 'ti-pencil', 'Can create', sc.create);
    var cNot = col('is-cannot', 'ti-ban', 'Cannot', sc.cannot);
    n.body.appendChild(cols);
    var strip = S.el('div', 'wa-inherit');
    var line = S.el('div', 'wa-inherit-line');
    line.appendChild(S.icon('ti-shield-lock'));
    line.appendChild(S.el('span', null, sc.inherit));
    strip.appendChild(line);
    var chips = S.el('div', 'wa-chips');
    chips.appendChild(K.chip('Output: ' + sc.visibility.toLowerCase(), 'ai', 'ti-lock'));
    chips.appendChild(K.chip(sc.review, 'human', 'ti-user-check'));
    sc.principles.forEach(function(p) { chips.appendChild(K.chip(p, 'neutral')); });
    strip.appendChild(chips);
    n.body.appendChild(strip);
    var next = K.btn('Review the plan', { kind: 'primary', icon: 'ti-arrow-right', onClick: function() { go(3); } });
    next.classList.add('ws-cue');
    var row = actions([K.btn('Back to goal', { kind: 'ghost', icon: 'ti-arrow-back-up', onClick: function() { go(1); } }), next]);
    n.body.appendChild(row);
    K.hide([cRead, cMake, cNot], 'ts-up');
    K.hide([strip, row]);
    reveal([cRead, cMake, cNot, strip, row], 170, 60);
  }

  // ── Beat 3: the proposed plan ──
  function showPlan() {
    clearTimers();
    n.body.innerHTML = '';
    n.body.appendChild(requestLine());
    n.body.appendChild(title('Step 3 · Review the proposed plan', 'Nothing runs until you press Run', 'human'));
    var list = S.el('ol', 'wa-plan');
    var rows = B.plan.map(function(p, i) {
      var li = S.el('li', 'wa-plan-step');
      li.appendChild(S.el('span', 'wa-plan-num', String(i + 1)));
      var body = S.el('div', 'wa-plan-body');
      if (planEdits) {
        var inp = document.createElement('input');
        inp.className = 'wa-input';
        inp.value = planEdits[i];
        inp.setAttribute('aria-label', 'Plan step ' + (i + 1));
        inp.addEventListener('input', function() { planEdits[i] = inp.value; });
        body.appendChild(inp);
      } else {
        body.appendChild(S.el('div', 'wa-plan-text', (n.planValues && n.planValues[i]) || p.text));
      }
      var uses = S.el('div', 'wa-plan-uses');
      p.uses.forEach(function(u) { uses.appendChild(K.chip(u, 'data')); });
      body.appendChild(uses);
      li.appendChild(body);
      list.appendChild(li);
      return li;
    });
    n.body.appendChild(list);
    var bound = S.el('div', 'wa-chips wa-bound');
    bound.appendChild(K.chip('Reads ' + B.scope.read.length + ' approved sources', 'data', 'ti-eye'));
    bound.appendChild(K.chip('Creates a private draft', 'ai', 'ti-pencil'));
    bound.appendChild(K.chip('Writes to no system', 'proof', 'ti-lock'));
    bound.appendChild(K.chip('Human review before sharing', 'human', 'ti-user-check'));
    n.body.appendChild(bound);
    var edit = K.btn(planEdits ? 'Done' : 'Edit plan', { kind: 'ghost', icon: planEdits ? 'ti-check' : 'ti-pencil', onClick: function() {
      if (planEdits) { n.planValues = planEdits.slice(); planEdits = null; } else { planEdits = (n.planValues || B.plan.map(function(p) { return p.text; })).slice(); }
      showPlan();
    } });
    var run = K.btn('Run', { kind: 'primary', icon: 'ti-player-play', onClick: function() { go(4); } });
    run.classList.add('ws-cue');
    var row = actions([edit, run]);
    n.body.appendChild(row);
    K.hide(rows, 'ts-left');
    K.hide([bound, row]);
    reveal(rows.concat([bound, row]), 120, 60);
  }

  // ── Beat 4: run, then the output ──
  function showRun() {
    clearTimers();
    n.body.innerHTML = '';
    if (K.isStatic()) { showOutput(); return; }
    running = true;
    K.setState('agent-builder-running');
    flow('running');
    n.body.appendChild(title('Step 4 · Run', 'Deterministic demonstration run', 'neutral'));
    var list = S.el('ol', 'wa-run');
    var rows = B.stages.map(function(st) {
      var li = S.el('li', 'wa-stage');
      li.appendChild(S.icon('ti-circle-dashed', 'wa-stage-wait'));
      li.appendChild(S.icon('ti-loader-2', 'wa-stage-busy'));
      li.appendChild(S.icon('ti-circle-check', 'wa-stage-done'));
      li.appendChild(S.el('span', 'wa-stage-label', st.label));
      li.appendChild(S.el('span', 'wa-stage-result', st.result));
      list.appendChild(li);
      return li;
    });
    n.body.appendChild(list);
    var bar = S.el('div', 'wa-progress');
    var fill = S.el('i');
    bar.appendChild(fill);
    n.body.appendChild(bar);
    var steps = [];
    var STEP = 560;
    rows.forEach(function(li, i) {
      steps.push({ delay: 80 + i * STEP, run: function() { li.classList.add('is-busy'); fill.style.width = ((i + 0.5) / rows.length * 100) + '%'; } });
      steps.push({ delay: 80 + i * STEP + 420, run: function() { li.classList.remove('is-busy'); li.classList.add('is-done'); fill.style.width = ((i + 1) / rows.length * 100) + '%'; } });
    });
    steps.push({ delay: 80 + rows.length * STEP + 300, run: function() { showOutput(); } });
    var tl = createTimeline(steps);
    n.runTl = tl;
    timers.push(tl);
    tl.play();
  }

  function cite(text) { return S.el('span', 'wa-cite', '[' + text + ']'); }

  function report(parent) {
    var R = B.report;
    var card = S.el('div', 'wa-report');
    var hd = S.el('div', 'wa-report-head');
    hd.appendChild(S.icon('ti-file-report'));
    hd.appendChild(S.el('span', 'wa-report-title', R.title));
    hd.appendChild(S.el('span', 'ws-spacer'));
    R.meta.forEach(function(m, i) { hd.appendChild(K.chip(m, i === 0 ? 'human' : i === 1 ? 'ai' : 'neutral')); });
    card.appendChild(hd);
    var cols = S.el('div', 'wa-report-cols');
    var left = S.el('div', 'wa-report-col');
    var right = S.el('div', 'wa-report-col');
    function sec(col, label) { var s = S.el('div', 'wa-rsec'); s.appendChild(S.el('div', 'ws-label', label)); col.appendChild(s); return s; }

    var s1 = sec(left, 'Executive summary');
    var p = S.el('p', 'wa-summary', R.summary);
    p.appendChild(document.createTextNode(' '));
    p.appendChild(cite('1, 3, 6'));
    s1.appendChild(p);
    var s2 = sec(left, 'Top findings');
    R.findings.forEach(function(f) { var r = S.el('div', 'wa-find'); r.appendChild(S.el('span', null, f.text)); r.appendChild(cite(f.cite)); s2.appendChild(r); });
    var s3 = sec(left, 'Concentration clusters');
    R.clusters.forEach(function(c) {
      var r = S.el('div', 'wa-cluster');
      var who = S.el('div', 'wa-cluster-who');
      who.appendChild(S.el('span', 'wa-cluster-name', c.provider));
      who.appendChild(S.el('span', 'wa-cluster-kind', c.kind));
      r.appendChild(who);
      var dots = S.el('span', 'wa-dots');
      for (var i = 0; i < 4; i++) dots.appendChild(S.el('i', i < c.count ? 'is-on' : ''));
      r.appendChild(dots);
      r.appendChild(S.el('span', 'wa-cluster-svc', c.count + ' · ' + c.services));
      s3.appendChild(r);
    });

    var s4 = sec(right, 'Urgent expiries');
    R.expiries.forEach(function(x) {
      var r = S.el('div', 'wa-exp');
      r.appendChild(K.chip(x.id, 'neutral'));
      r.appendChild(S.el('span', 'wa-exp-text', x.text));
      r.appendChild(K.chip(x.days + ' days', 'human', 'ti-clock'));
      s4.appendChild(r);
    });
    var s5 = sec(right, 'Data gaps');
    R.gaps.forEach(function(g) { var r = S.el('div', 'wa-gap'); r.appendChild(S.icon('ti-alert-triangle')); r.appendChild(S.el('span', null, g)); s5.appendChild(r); });
    var s6 = sec(right, 'Recommended questions');
    R.questions.forEach(function(q) { var r = S.el('div', 'wa-q'); r.appendChild(S.icon('ti-message-circle')); r.appendChild(S.el('span', null, q)); s6.appendChild(r); });
    var s7 = sec(right, 'Sources');
    var ol = S.el('ol', 'wa-sources');
    R.citations.forEach(function(c) { ol.appendChild(S.el('li', null, c)); });
    s7.appendChild(ol);

    cols.appendChild(left);
    cols.appendChild(right);
    card.appendChild(cols);
    parent.appendChild(card);
    return { card: card, parts: [s1, s2, s3, s4, s5, s6, s7] };
  }

  function showOutput() {
    clearTimers();
    running = false;
    n.body.innerHTML = '';
    beat = 4;
    n.stepper.set(3);
    K.setState('agent-builder-output');
    flow('output-ready');
    var rep = report(n.body);
    n.report = rep.card;
    var bar = S.el('div', 'wa-outbar');
    var gate = S.DecisionGate.create(bar, { size: 'small' });
    gate.activate();
    bar.appendChild(S.el('span', 'wa-outbar-text', B.stages[B.stages.length - 1].label + '. Nothing has been shared or written.'));
    bar.appendChild(S.el('span', 'ws-spacer'));
    var next = K.btn('Reuse and govern', { kind: 'primary', icon: 'ti-arrow-right', onClick: function() { go(5); } });
    next.classList.add('ws-cue');
    bar.appendChild(next);
    n.body.appendChild(bar);
    n.outbar = bar;
    K.hide(rep.parts, 'ts-up');
    K.hide(bar);
    reveal(rep.parts.concat([bar]), 90, 60);
  }

  // ── Beat 5: reuse and govern ──
  function showReuse() {
    if (!n.report) showOutput();
    clearTimers();
    if (n.reuse) n.reuse.remove();
    if (n.outbar) n.outbar.classList.add('is-hidden');
    n.report.classList.add('is-behind');
    var p = S.el('div', 'wa-reuse');
    p.appendChild(title('Step 5 · Reuse and govern', 'Private by default', 'ai'));
    var opts = S.el('div', 'wa-reuse-opts');
    n.reuseBtns = B.reuse.map(function(r) {
      var b = K.btn(r.label, { kind: 'option', icon: r.icon, onClick: function() { pick(r.stage); } });
      b.classList.add('wa-reuse-btn');
      opts.appendChild(b);
      return b;
    });
    p.appendChild(opts);
    n.reuseResult = S.el('div', 'wa-reuse-result');
    n.reuseResult.setAttribute('aria-live', 'polite');
    p.appendChild(n.reuseResult);
    var path = S.el('ol', 'wa-promo');
    n.promo = B.promotion.map(function(step, i) {
      var li = S.el('li', 'wa-promo-step');
      li.appendChild(S.el('span', 'wa-promo-num', String(i + 1)));
      li.appendChild(S.el('span', 'wa-promo-label', step));
      path.appendChild(li);
      return li;
    });
    p.appendChild(path);
    p.appendChild(S.el('div', 'wa-promo-line', B.promotionLine));
    n.body.appendChild(p);
    n.reuse = p;
    K.hide(p, 'ts-up');
    reveal([p], 0, 40);
    paintReuse();
  }

  function paintReuse() {
    if (!n.promo) return;
    n.promo.forEach(function(li, i) {
      li.classList.toggle('is-done', reuseStage >= 0 && i < reuseStage);
      li.classList.toggle('is-here', i === Math.max(reuseStage, 0));
    });
    n.reuseBtns.forEach(function(b, i) { b.classList.toggle('is-picked', B.reuse[i].stage === reuseStage); b.setAttribute('aria-pressed', B.reuse[i].stage === reuseStage ? 'true' : 'false'); });
    var pickd = B.reuse.filter(function(r) { return r.stage === reuseStage; })[0];
    n.reuseResult.textContent = pickd ? pickd.result : 'Choose how this agent is reused.';
    n.reuseResult.classList.toggle('is-set', !!pickd);
    if (reuseStage === 1) flow('saved-personal');
    else if (reuseStage === 2) flow('publication-requested');
    else flow('output-ready');
  }

  function pick(stage) { reuseStage = stage; paintReuse(); }

  function go(b) {
    beat = b;
    n.stepper.set(Math.min(b === 0 ? 0 : b - 1, 4));
    if (b === 0) showGoal(false, false);
    else if (b === 1) showGoal(true, false);
    else if (b === 2) showScope();
    else if (b === 3) showPlan();
    else if (b === 4) { showRun(); return; }
    else if (b === 5) { n.stepper.set(4); showReuse(); }
    K.setState(STATES[b]);
    flow(FLOW[b]);
    if (b === 5) paintReuse();
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 60, run: function() { beat = 0; n.stepper.set(0); showGoal(false, true); K.setState(STATES[0]); flow('idle'); } },
    { delay: 2000, run: complete }
  ];
  var tl = createTimeline(steps);

  // Skip the entry: the full request appears at once and typing does not restart
  function finishEntry() {
    if (cv) cv.setStatic(true);
    tl.finish();
    clearTimers();
    if (n.prompt) n.prompt.value = B.prompt;
    if (n.promptRow) S.on(n.promptRow);
    if (cv && !K.isStatic()) cv.setStatic(false);
  }

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
      if (running) { showOutput(); return true; }
      if (beat < 5) { go(beat + 1); return true; }
      if (reuseStage < 1) { pick(1); return true; }
      if (reuseStage < 2) { pick(2); return true; }
      return false;
    },
    getAccessibleSummary: function() {
      return 'Agent Builder in the NFR Workspace. The request: ' + B.prompt + ' The Workspace interprets the goal, then shows the scope before anything runs: it can read '
        + B.scope.read.length + ' approved sources, can create ' + B.scope.create.join(', ').toLowerCase() + ', and cannot ' + B.scope.cannot.join(', ').toLowerCase() + '. '
        + B.scope.inherit + ' The plan has ' + B.plan.length + ' steps. The run produces a one-page, source-linked briefing for human review. '
        + 'Reuse options: ' + B.reuse.map(function(r) { return r.label; }).join(', ') + '. Promotion path: ' + B.promotion.join(', then ') + '.';
    },
    destroy: function() { tl.destroy(); clearTimers(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
