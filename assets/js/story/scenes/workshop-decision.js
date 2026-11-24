// Scene: workshop-decision (screen 14)
// Causal story: the conversation ends on one decision for the room. The question appears
// first; then the four things to agree (target role, target decision or process,
// representative data and cases, proof criteria at five weeks and six months); then the
// secondary question about what to reuse rather than rebuild.
SceneDirector.register('workshop-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.decision;
  var W = 1040, H = 470;
  var Q = { y: 0, h: 150 };
  var CARD = { y: 176, w: 243, gap: 12, h: 120 };
  var SEC = { y: 322, h: 76 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'workshop-decision' });
    n = { cards: [] };
    done = false;
    var root = cv.el;
    var q = S.el('div', 'wd-question ts-hide ts-pop', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    var gate = S.DecisionGate.create(q, { size: 'small' });
    gate.el.classList.add('wd-gate');
    n.gate = gate;
    var body = S.el('div', 'wd-q-body');
    body.appendChild(S.el('div', 'ts-label ts-ink ts-c-human', X.label));
    body.appendChild(S.el('div', 'wd-q-text', X.question));
    q.appendChild(body);
    root.appendChild(q);
    n.question = q;
    X.agree.forEach(function(a, i) {
      var c = S.el('div', 'wd-card wd-agree ts-hide ts-up', null, { left: 16 + i * (CARD.w + CARD.gap), top: CARD.y, width: CARD.w, height: CARD.h });
      var h = S.el('div', 'wd-card-head');
      h.appendChild(S.el('span', 'wd-agree-n', String(i + 1)));
      h.appendChild(S.icon(a.icon));
      c.appendChild(h);
      c.appendChild(S.el('div', 'wd-agree-label', a.label));
      root.appendChild(c);
      n.cards.push(c);
    });
    n.secondary = S.el('div', 'wd-secondary ts-hide', null, { left: 16, top: SEC.y, width: 1008, height: SEC.h });
    n.secondary.appendChild(S.el('span', 'wd-sec-k', 'And'));
    n.secondary.appendChild(S.el('span', 'wd-sec-q', X.secondary));
    root.appendChild(n.secondary);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.question); n.gate.activate(); } },
    { delay: 900,  run: function() { S.on(n.cards[0]); } },
    { delay: 1150, run: function() { S.on(n.cards[1]); } },
    { delay: 1400, run: function() { S.on(n.cards[2]); } },
    { delay: 1650, run: function() { S.on(n.cards[3]); } },
    { delay: 2200, run: function() { S.on(n.secondary); } },
    { delay: 2700, run: complete }
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
    getAccessibleSummary: function() {
      return X.label + ': ' + X.question + ' Agree: ' + X.agree.map(function(a) { return a.label.toLowerCase(); }).join(', ') + '. ' + X.secondary;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
