// Scene: workspace-home (v2 screen 07)
// Causal story: the working day starts from a decision queue, not a blank chat. Each
// card says why it is here, what changed, how complete the evidence is, which decision
// is needed and when. The first card's anatomy lights up field by field. NFR Assist sits
// beside the work with three questions about it; Space (or a click) asks them in turn.
// "Open case" leads into the periodic-review journey on the next screen.
SceneDirector.register('workspace-home', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var K = window.WorkspaceKit;
  var D = window.NFR_WORKSPACE_DEMO;

  var cv = null;
  var n = {};
  var done = false;
  var asked = -1;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, K.W, K.H, { id: 'ws-home', maxScale: 1.4 });
    n = {};
    done = false;
    asked = -1;
    var sh = K.shell(cv.el, { active: 'home', assist: 'panel' });
    sh.app.classList.add('is-framed');
    n.shell = sh;
    n.queue = K.queue(sh.main, { onOpen: function() { K.goScreen('workspace-journey'); } });
    n.fields = Array.prototype.slice.call(n.queue.cards[0].querySelectorAll('.ws-field'));
    n.assist = K.assistPanel(sh.assist, { onAsk: function(i) { asked = i; } });
    n.sugg = n.assist.questions;
    K.hide(n.sugg, 'ts-up');
  }

  function emphasise(i) {
    n.fields.forEach(function(f, j) { f.classList.toggle('is-lit', j === i); });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 100,  run: function() { K.setState('workspace-home'); } },
    { delay: 500,  run: function() { emphasise(0); } },
    { delay: 950,  run: function() { emphasise(1); } },
    { delay: 1400, run: function() { emphasise(2); } },
    { delay: 1850, run: function() { emphasise(3); } },
    { delay: 2350, run: function() { emphasise(-1); n.queue.cards[0].classList.add('is-read'); S.on(n.sugg); } },
    { delay: 2600, run: complete }
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
    renderError: function() { tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    // Space asks the suggested questions in order, then the deck moves on
    advance: function() {
      if (!done) { if (cv) cv.setStatic(true); tl.finish(); return true; }
      var next = asked + 1;
      if (next >= D.assist.questions.length) return false;
      n.assist.ask(next);
      asked = next;
      return true;
    },
    getAccessibleSummary: function() {
      var q = D.queue[0];
      return 'Workspace home for the ' + D.role.label + '. ' + D.queue.length + ' decisions are waiting. The first is a '
        + q.journey.toLowerCase() + ' for ' + q.id + ': ' + q.why.toLowerCase() + '; ' + q.changed.toLowerCase() + '; evidence '
        + q.evidenceHave + ' of ' + q.evidenceTotal + '; decision required: ' + q.decision.toLowerCase() + '. NFR Assist offers three questions: '
        + D.assist.questions.map(function(x) { return x.q; }).join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
