// Scene: bring-in (screen 13)
// Causal story: three ways to bring NFR Workspace in, over the same methods. A managed
// service (the recommended start), a sovereign cloud instance, or a full deployment on the
// client's own infrastructure. Each says what it is, when it fits, what it involves and
// its commercial model; the public edition says the model is agreed with the client and
// shared separately, the internal edition shows the models themselves. The options are
// designed to move: start managed, move in-house when ready. Then what we need from you.
SceneDirector.register('bring-in', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.bringIn;
  // The internal edition carries the commercial models, so its cards are taller
  var COMM = B.options.some(function(o) { return o.commercial && o.commercial.length; });
  var CARD = { y: 22, h: COMM ? 336 : 300, w: 330, gap: 9 };
  var MOVE = { y: CARD.y + CARD.h + 12, h: 40 };
  var NEED = { y: MOVE.y + MOVE.h + 10, h: 46 };
  var NOTE = NEED.y + NEED.h + 12;
  var W = 1040, H = NOTE + 44;

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return 16 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'bring-in', refHeight: 520 });
    n = { cards: [] };
    done = false;
    var root = cv.el;

    n.label = S.el('div', 'ts-label ts-hide', B.label, { left: 16, top: 0, width: 600 });
    root.appendChild(n.label);
    B.options.forEach(function(o, i) {
      var b = S.el('div', 'ts-obj ts-c-' + o.tone + ' bi-card ts-hide ts-up', null, { left: cardX(i), top: CARD.y, width: CARD.w, height: CARD.h });
      var h = S.el('div', 'bi-head ts-ink');
      h.appendChild(S.icon(o.icon));
      h.appendChild(S.el('span', 'bi-name', o.label));
      b.appendChild(h);
      b.appendChild(S.el('div', 'bi-sub', o.sub));
      b.appendChild(S.el('span', 'bi-fit ts-ink', o.fit));
      var ul = S.el('ul', 'vd-list bi-list');
      o.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      var cm = S.el('div', 'bi-comm');
      cm.appendChild(S.el('div', 'vd-k', B.commercialLabel));
      if (o.commercial && o.commercial.length) {
        o.commercial.forEach(function(c) {
          var r = S.el('div', 'bi-comm-r');
          r.appendChild(S.el('span', 'bi-comm-k', c[0]));
          r.appendChild(S.el('span', 'bi-comm-t', c[1]));
          cm.appendChild(r);
        });
      } else {
        cm.appendChild(S.el('div', 'bi-comm-note', B.commercialNote));
      }
      b.appendChild(cm);
      root.appendChild(b);
      n.cards.push(b);
    });

    n.move = S.el('div', 'ts-obj ts-c-neutral ts-soft qp-need bi-move ts-hide ts-up', null, { left: 16, top: MOVE.y, width: 1008, height: MOVE.h });
    n.move.appendChild(S.icon('ti-arrows-exchange', 'bi-move-i'));
    n.move.appendChild(S.el('span', 'bi-move-t', B.move + (B.claim ? ' ' + B.claim : '')));
    root.appendChild(n.move);

    var P = D.path;
    if (P && P.fromYou) {
      n.need = S.el('div', 'ts-obj ts-c-human ts-soft qp-need ts-hide ts-up', null, { left: 16, top: NEED.y, width: 1008, height: NEED.h });
      n.need.appendChild(S.icon('ti-users', 'ts-ink'));
      n.need.appendChild(S.el('span', 'qp-need-k ts-ink', P.fromYou.label));
      P.fromYou.items.forEach(function(t) { n.need.appendChild(S.el('span', 'qp-chip', t)); });
      root.appendChild(n.need);
    }

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', B.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', B.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.label); S.on(n.cards[0]); } },
    { delay: 700,  run: function() { S.on(n.cards[1]); } },
    { delay: 1200, run: function() { S.on(n.cards[2]); } },
    { delay: 1900, run: function() { S.on(n.move); } },
    { delay: 2400, run: function() { S.on(n.need); } },
    { delay: 2900, run: function() { S.on(n.note); } },
    { delay: 3400, run: complete }
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
      var P = D.path;
      return B.label + ': ' + B.options.map(function(o) {
        return o.label + ', ' + o.sub.toLowerCase() + ', ' + o.fit.toLowerCase() + ': ' + o.items.join(', ').toLowerCase() + '. ' + B.commercialLabel + ': '
          + (o.commercial && o.commercial.length ? o.commercial.map(function(c) { return c[0].toLowerCase() + ', ' + c[1]; }).join('; ') : B.commercialNote.toLowerCase()) + '.';
      }).join(' ') + ' ' + B.move + (B.claim ? ' ' + B.claim : '') + (P && P.fromYou ? ' ' + P.fromYou.label + ': ' + P.fromYou.items.join(', ').toLowerCase() + '.' : '') + ' ' + B.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
