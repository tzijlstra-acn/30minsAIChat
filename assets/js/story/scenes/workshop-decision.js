// Scene: workshop-decision (screen 14)
// Causal story: the conversation ends on one decision for the room. The headline asks the
// question, so the screen does not repeat it: four things to agree today (target role,
// target decision or process, representative data and cases, proof criteria at five
// weeks and six months), each with one line on what a good answer looks like; then the
// secondary question about what to reuse rather than rebuild.
SceneDirector.register('workshop-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.decision;
  var W = 1040, H = 356;
  var CARD = { y: 30, w: 243, gap: 12, h: 216 };
  var SEC = { y: 272, h: 76 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'workshop-decision', refHeight: 520 });
    n = { cards: [] };
    done = false;
    var root = cv.el;
    n.label = S.el('div', 'ts-label ts-ink ts-c-human ts-hide', X.label, { left: 16, top: 0, width: 600 });
    root.appendChild(n.label);
    X.agree.forEach(function(a, i) {
      var c = S.el('div', 'wd-card wd-agree ts-hide ts-up', null, { left: 16 + i * (CARD.w + CARD.gap), top: CARD.y, width: CARD.w, height: CARD.h });
      var h = S.el('div', 'wd-card-head');
      h.appendChild(S.el('span', 'wd-agree-n', String(i + 1)));
      h.appendChild(S.icon(a.icon));
      c.appendChild(h);
      c.appendChild(S.el('div', 'wd-agree-label', a.label));
      if (a.hint) c.appendChild(S.el('div', 'wd-agree-hint', a.hint));
      if (a.example) {
        var ex = S.el('div', 'wd-agree-ex');
        ex.appendChild(S.el('div', 'wd-agree-ex-k', X.exampleLabel));
        ex.appendChild(S.el('div', 'wd-agree-ex-t', a.example));
        c.appendChild(ex);
      }
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
    { delay: 200,  run: function() { S.on(n.label); S.on(n.cards[0]); } },
    { delay: 500,  run: function() { S.on(n.cards[1]); } },
    { delay: 800,  run: function() { S.on(n.cards[2]); } },
    { delay: 1100, run: function() { S.on(n.cards[3]); } },
    { delay: 1700, run: function() { S.on(n.secondary); } },
    { delay: 2300, run: complete }
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
      return X.label + ': ' + X.agree.map(function(a) { return a.label.toLowerCase() + (a.hint ? ', ' + a.hint.toLowerCase() : '') + (a.example ? ', for example ' + a.example.toLowerCase() : ''); }).join('; ') + '. ' + X.secondary;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
