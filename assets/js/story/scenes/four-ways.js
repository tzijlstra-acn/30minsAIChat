// Scene: four-ways (v2 screen 04)
// Causal story: one Workspace, four ways to get work done, revealed one at a time:
// Ask (NFR Assist), Use (NFR Apps), Run (NFR Automations), Create (Agent Builder).
// Plain verbs lead; the product name and a one-line definition follow. Then all four
// connect to one shared foundation: same identity, permissions, evidence and record.
// One colour for all four capabilities: they differ by verb and icon, not by hue.
SceneDirector.register('four-ways', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var CARD = { y: 0, w: 245, h: 334, gap: 9, x0: 16 };
  var BASE = { y: 392, h: 96 };

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
      card.appendChild(S.el('div', 'fw-verb', c.verb));
      card.appendChild(S.el('div', 'ts-label ts-ink fw-product', c.product));
      card.appendChild(S.el('div', 'fw-line', c.line));
      card.appendChild(S.el('div', 'fw-def', c.definition));
      var ex = S.el('div', 'fw-examples');
      ex.appendChild(S.el('div', 'fw-ex-k', 'For example'));
      c.examples.forEach(function(e) { ex.appendChild(S.el('div', 'fw-ex', e)); });
      card.appendChild(ex);
      root.appendChild(card);
      n.cards.push(card);
      var cx = x + CARD.w / 2;
      n.links.push(S.path(g, 'M' + cx + ' ' + (CARD.y + CARD.h + 2) + ' L' + cx + ' ' + (BASE.y - 2), 'ts-s-data fw-link', cv.marker('data')));
    });

    var base = S.el('div', 'fw-base ts-hide', null, { left: 16, top: BASE.y, width: W - 32, height: BASE.h });
    var lbl = S.el('div', 'fw-base-head');
    lbl.appendChild(S.el('span', 'ws-mark fw-mark'));
    lbl.appendChild(S.el('span', 'fw-base-name', D.product));
    lbl.appendChild(S.el('span', 'ts-label', 'One shared foundation'));
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
    { delay: 4300, run: function() { S.on(n.items[0]); } },
    { delay: 4550, run: function() { S.on(n.items[1]); } },
    { delay: 4800, run: function() { S.on(n.items[2]); } },
    { delay: 5050, run: function() { S.on(n.items[3]); } },
    { delay: 5600, run: complete }
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
      return 'One Workspace, four ways to work. ' + D.capabilities.map(function(c) { return c.verb + ', ' + c.product + ': ' + c.line; }).join(' ')
        + ' All four share one foundation: ' + D.foundation.join(', ').toLowerCase() + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
