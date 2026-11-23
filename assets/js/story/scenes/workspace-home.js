// Scene: workspace-home (screen 07)
// Causal story: the working day starts from decisions, not a blank chat. One item is
// dominant (Now: the periodic review due today), two follow (Next), three signals are
// watched and the overnight work is quiet (Done by the Workspace). Each item says why
// it is here, what changed, what was prepared and which decision is needed.
// NFR Assist sits beside the work. Space asks it a portfolio question, answered as a
// visual, source-linked insight; Space again asks what changed, and Assist hands the
// work to the Periodic Review app; Space again opens that app on the next screen.
// After the review is recorded (screen 08), the queue shows it as done.
SceneDirector.register('workspace-home', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var K = window.WorkspaceKit;
  var D = window.NFR_WORKSPACE_DEMO;

  var cv = null;
  var n = {};
  var done = false;
  var asked = -1;
  var view = 'home';
  var timers = [];

  function clearTimers() { timers.forEach(function(t) { t.destroy(); }); timers = []; }
  function recorded() { return window.NFRExperience && NFRExperience.getFlag ? NFRExperience.getFlag('reviewRecorded') : null; }

  function openApp() {
    if (window.NFRExperience && NFRExperience.handoff) NFRExperience.handoff('workspace-journey', 'role-app-open');
    K.goScreen('workspace-journey');
  }
  function openCase() { K.goScreen('workspace-journey'); }

  function showHome() {
    clearTimers();
    n.shell.clearMain();
    view = 'home';
    n.home = K.home(n.shell.main, { onOpen: openCase, recorded: recorded() });
    n.fields = n.home.fields;
    K.setState('workspace-home');
  }

  function showInsight() {
    clearTimers();
    n.shell.clearMain();
    view = 'insight';
    var ins = K.insight(n.shell.main, { onBack: function() { showHome(); }, onOpenApp: openApp });
    K.hide(ins.parts, 'ts-up');
    timers.push(K.sequence(ins.parts, 110, 40));
    K.setState('insight-visible');
  }

  function build() {
    clearTimers();
    if (cv) cv.destroy();
    cv = S.canvas(container, K.W, K.H, { id: 'ws-home', maxScale: 1.4 });
    n = {};
    done = false;
    asked = -1;
    var sh = K.shell(cv.el, { active: 'home', assist: 'panel' });
    sh.app.classList.add('is-framed');
    n.shell = sh;
    n.assist = K.assistPanel(sh.assist, {
      onAsk: function(i) { asked = i; },
      onInsight: showInsight,
      onOpenApp: openApp
    });
    n.sugg = n.assist.questions;
    K.hide(n.sugg, 'ts-up');
    showHome();
  }

  function emphasise(i) {
    (n.fields || []).forEach(function(f, j) { f.classList.toggle('is-lit', j === i); });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 100,  run: function() { K.setState('workspace-home'); } },
    { delay: 450,  run: function() { emphasise(0); } },
    { delay: 850,  run: function() { emphasise(1); } },
    { delay: 1250, run: function() { emphasise(2); } },
    { delay: 1650, run: function() { emphasise(3); } },
    { delay: 2150, run: function() { emphasise(-1); S.on(n.sugg); } },
    { delay: 2500, run: complete }
  ];
  var tl = createTimeline(steps);

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
    // Space: the visual insight, then the hand-off from Assist, then the role app
    advance: function() {
      if (!done) { if (cv) cv.setStatic(true); tl.finish(); if (cv && !K.isStatic()) cv.setStatic(false); return true; }
      if (asked < 0 || (asked === 0 && view !== 'insight')) { n.assist.ask(0); asked = 0; return true; }
      if (asked === 0) { n.assist.ask(1); asked = 1; return true; }
      if (asked >= 1) { openApp(); return true; }
      return false;
    },
    key: function(k) {
      if (k === 'Escape' && view === 'insight') { showHome(); return true; }
      return false;
    },
    getAccessibleSummary: function() {
      var H = D.home, q = H.now;
      return 'Workspace home for the ' + D.role.label + '. Now: ' + q.journey.toLowerCase() + ' ' + q.id + ', ' + q.title + '. Why it is here: ' + q.why.toLowerCase()
        + '. What changed: ' + q.changed.toLowerCase() + '. Prepared: ' + q.prepared.toLowerCase() + '. Decision needed: ' + q.decision.toLowerCase() + '. Next: '
        + H.next.map(function(x) { return x.title; }).join(' and ') + '. Watching: ' + H.watching.map(function(w) { return w.text; }).join('; ')
        + '. NFR Assist offers: ' + D.assist.questions.map(function(x) { return x.q; }).join(' ');
    },
    destroy: function() { tl.destroy(); clearTimers(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
