// Scene: workshop-decision (screen 10)
// Causal story: the conversation ends on one decision for the room. The question appears
// first, with the evidence needed to authorise the next wave; then what makes a good first
// loop, what the client provides, and what the workshop produces.
SceneDirector.register('workshop-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.workshop;
  var W = 1040, H = 470;
  var Q = { y: 0, h: 176 };
  var CARD = { y: 200, w: 330, gap: 9, h: 250 };
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
    body.appendChild(S.el('div', 'wd-q-next', X.next));
    q.appendChild(body);
    root.appendChild(q);
    n.question = q;
    X.cards.forEach(function(c, i) {
      var box = S.el('div', 'wd-card ts-hide ts-up is-' + c.id, null, { left: 16 + i * (CARD.w + CARD.gap), top: CARD.y, width: CARD.w, height: CARD.h });
      var h = S.el('div', 'wd-card-head');
      h.appendChild(S.icon(c.icon));
      h.appendChild(S.el('span', null, c.label));
      box.appendChild(h);
      var ul = S.el('ul', 'wd-list');
      c.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      box.appendChild(ul);
      root.appendChild(box);
      n.cards.push(box);
    });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.question); n.gate.activate(); } },
    { delay: 900,  run: function() { S.on(n.cards[0]); } },
    { delay: 1300, run: function() { S.on(n.cards[1]); } },
    { delay: 1700, run: function() { S.on(n.cards[2]); } },
    { delay: 2100, run: complete }
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
      return X.label + ': ' + X.question + ' ' + X.next + ' ' + X.cards.map(function(c) { return c.label + ': ' + c.items.join(', ').toLowerCase(); }).join('. ') + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
