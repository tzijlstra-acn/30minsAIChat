// Scene: work-arrives (screen 02)
// Causal story: NFR work arrives as a question, not as a method, a data set or a system
// workflow. Four requests arrive from different channels, one by one, and converge into
// one role queue. Each says what its answer needs: several records, documents, rules,
// judgements and owners.
SceneDirector.register('work-arrives', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.arrives;
  var W = 1040, H = 520;
  var CARD = { y: 0, w: 243, h: 196, gap: 12, x0: 16 };
  var Q = { x: 220, y: 290, w: 600, h: 82 };

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return CARD.x0 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'work-arrives' });
    n = { cards: [], links: [], slots: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    A.asks.forEach(function(a, i) {
      var x = cardX(i);
      var c = S.el('div', 'ts-obj ts-c-human wa2-card ts-hide ts-up', null, { left: x, top: CARD.y, width: CARD.w, height: CARD.h });
      var head = S.el('div', 'wa2-chan');
      head.appendChild(S.icon(a.icon, 'ts-ink'));
      head.appendChild(S.el('span', null, a.channel));
      c.appendChild(head);
      c.appendChild(S.el('div', 'wa2-q', a.text));
      var needs = S.el('div', 'wa2-needs');
      needs.appendChild(S.el('span', 'wa2-needs-k', 'Needs'));
      needs.appendChild(S.el('span', null, a.needs));
      c.appendChild(needs);
      root.appendChild(c);
      n.cards.push(c);
      var sx = x + CARD.w / 2, sy = CARD.y + CARD.h + 4;
      var tx = Q.x + 40 + i * ((Q.w - 80) / 3), ty = Q.y - 4;
      n.links.push(S.path(g, 'M' + sx + ' ' + sy + ' C' + sx + ' ' + (sy + 50) + ' ' + tx + ' ' + (ty - 40) + ' ' + tx + ' ' + ty, 'ts-s-human wa2-link', cv.marker('human')));
    });
    var q = S.el('div', 'wa2-queue ts-hide ts-pop', null, { left: Q.x, top: Q.y, width: Q.w, height: Q.h });
    var qh = S.el('div', 'wa2-queue-head');
    qh.appendChild(S.icon('ti-inbox'));
    qh.appendChild(S.el('span', null, A.queue));
    q.appendChild(qh);
    var slots = S.el('div', 'wa2-slots');
    A.asks.forEach(function(a, i) { var sl = S.el('span', 'wa2-slot', 'Request ' + (i + 1)); slots.appendChild(sl); n.slots.push(sl); });
    q.appendChild(slots);
    root.appendChild(q);
    n.queue = q;
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 430, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', 'No request arrives labelled with a method, a data set or an owner.'));
    n.note.appendChild(S.el('span', 'ts-text', A.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cards[0]); } },
    { delay: 700,  run: function() { S.on(n.cards[1]); } },
    { delay: 1200, run: function() { S.on(n.cards[2]); } },
    { delay: 1700, run: function() { S.on(n.cards[3]); } },
    { delay: 2300, run: function() { S.on(n.links); S.on(n.queue); } },
    { delay: 3100, run: function() { S.on(n.note); } },
    { delay: 3700, run: complete }
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
      return 'Four requests arrive in one role queue: ' + A.asks.map(function(a) { return a.channel.toLowerCase() + ', ' + a.text; }).join(' ') + ' ' + A.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
