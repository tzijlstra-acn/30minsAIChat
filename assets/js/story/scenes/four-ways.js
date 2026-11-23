// Scene: four-ways (screen 04)
// Causal story: one Workspace, four ways to get work done, revealed one at a time:
// Ask (NFR Assist), Use (NFR Apps), Run (NFR Automations), Create (Agent Builder).
// Each card says what it is, when to use it and one concrete example from the same
// third-party review. Then all four connect to one foundation, under the sentence that
// separates an assistant from the Workspace. One colour for all four capabilities.
SceneDirector.register('four-ways', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var CARD = { y: 0, w: 245, h: 322, gap: 9, x0: 16 };
  var BASE = { y: 362, h: 148 };

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return CARD.x0 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'four-ways' });
    n = { cards: [], links: [], items: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    D.capabilities.forEach(function(c, i) {
      var x = cardX(i);
      var card = S.el('div', 'ts-obj ts-c-ai fw-card ts-hide ts-up', null, { left: x, top: CARD.y, width: CARD.w, height: CARD.h });
      var top = S.el('div', 'fw-top');
      top.appendChild(S.el('span', 'fw-num', '0' + (i + 1)));
      top.appendChild(S.icon(c.icon, 'ts-ink fw-icon'));
      card.appendChild(top);
      var name = S.el('div', 'fw-name');
      name.appendChild(S.el('span', 'fw-verb', c.verb));
      name.appendChild(S.el('span', 'ts-label ts-ink fw-product', c.product));
      card.appendChild(name);
      card.appendChild(S.el('div', 'fw-line', c.line));
      var when = S.el('div', 'fw-when');
      when.appendChild(S.el('div', 'fw-k', 'Use it when'));
      when.appendChild(S.el('div', 'fw-when-text', c.when));
      card.appendChild(when);
      var ex = S.el('div', 'fw-example');
      ex.appendChild(S.el('div', 'fw-k', 'Example'));
      ex.appendChild(S.el('div', 'fw-ex-text', '“' + c.example + '”'));
      card.appendChild(ex);
      root.appendChild(card);
      n.cards.push(card);
      var cx = x + CARD.w / 2;
      n.links.push(S.path(g, 'M' + cx + ' ' + (CARD.y + CARD.h + 2) + ' L' + cx + ' ' + (BASE.y - 2), 'ts-s-data fw-link', cv.marker('data')));
    });

    var base = S.el('div', 'fw-base ts-hide', null, { left: 16, top: BASE.y, width: W - 32, height: BASE.h });
    var lbl = S.el('div', 'fw-base-head');
    lbl.appendChild(S.el('span', 'ws-mark fw-mark'));
    var diff = S.el('div', 'fw-diff');
    diff.appendChild(S.el('span', 'fw-diff-a', D.difference[0]));
    diff.appendChild(document.createTextNode(' '));
    diff.appendChild(S.el('span', 'fw-diff-b', D.difference[1]));
    lbl.appendChild(diff);
    base.appendChild(lbl);
    var row = S.el('div', 'fw-base-row');
    D.foundation.forEach(function(f) {
      var it = S.el('span', 'fw-base-item ts-hide', f);
      row.appendChild(it);
      n.items.push(it);
    });
    base.appendChild(row);
    root.appendChild(base);
    n.base = base;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cards[0]); } },
    { delay: 1100, run: function() { S.on(n.cards[1]); } },
    { delay: 2000, run: function() { S.on(n.cards[2]); } },
    { delay: 2900, run: function() { S.on(n.cards[3]); } },
    { delay: 3800, run: function() { S.on(n.links); S.on(n.base); } },
    { delay: 4400, run: function() { S.on(n.items[0]); } },
    { delay: 4650, run: function() { S.on(n.items[1]); } },
    { delay: 4900, run: function() { S.on(n.items[2]); } },
    { delay: 5150, run: function() { S.on(n.items[3]); } },
    { delay: 5700, run: complete }
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
      return 'One Workspace, four ways to work. ' + D.capabilities.map(function(c) { return c.verb + ', ' + c.product + ': ' + c.line + ' Use it when: ' + c.when.toLowerCase() + '. Example: ' + c.example; }).join(' ')
        + ' ' + D.difference.join(' ') + ' All four share one foundation: ' + D.foundation.join(', ').toLowerCase() + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
