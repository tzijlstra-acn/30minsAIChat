// Scene: experience (screen 13)
// Causal story: the approach has been applied before. In the public edition, three areas
// of Accenture experience, without client details. In the internal edition, the data
// object is replaced by claim-reviewed credentials (situation, methods, human role,
// result). Either way: experience of the delivery team, not of the product.
SceneDirector.register('experience', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.experience;
  var W = 1040, H = 470;
  var CARD = { y: 0, h: 330, gap: 12 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'experience' });
    n = { cards: [] };
    done = false;
    var root = cv.el;
    var count = X.items.length;
    var cw = (1008 - (count - 1) * CARD.gap) / count;
    X.items.forEach(function(it, i) {
      var c = S.el('div', 'ts-obj ts-c-proof ex-card ts-hide ts-up', null, { left: 16 + i * (cw + CARD.gap), top: CARD.y, width: cw, height: CARD.h });
      var h = S.el('div', 'ex-head');
      h.appendChild(S.icon(it.icon || 'ti-certificate', 'ts-ink'));
      h.appendChild(S.el('span', 'ex-label', it.label));
      c.appendChild(h);
      if (it.client) c.appendChild(S.el('div', 'ex-client', it.client));
      c.appendChild(S.el('div', 'ts-text ex-text', it.text));
      if (it.results && it.results.length) {
        var rs = S.el('div', 'ex-results');
        it.results.forEach(function(r) { rs.appendChild(S.el('span', 'ts-chip ts-c-proof', r)); });
        c.appendChild(rs);
      }
      if (it.claim) c.appendChild(S.el('div', 'ex-claim', it.claim));
      root.appendChild(c);
      n.cards.push(c);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: CARD.y + CARD.h + 22, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', X.title));
    n.note.appendChild(S.el('span', 'ts-text', X.note));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cards[0]); } },
    { delay: 700,  run: function() { S.on(n.cards.slice(1, 2)); } },
    { delay: 1200, run: function() { S.on(n.cards.slice(2)); } },
    { delay: 1800, run: function() { S.on(n.note); } },
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
      return X.title + ': ' + X.items.map(function(it) { return it.label + (it.client ? ' (' + it.client + ')' : '') + ', ' + it.text; }).join(' ') + ' ' + X.note;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
