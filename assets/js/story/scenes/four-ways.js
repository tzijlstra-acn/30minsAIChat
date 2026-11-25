// Scene: four-ways (screen 06)
// Causal story: four ways of working, and together no kind of question falls through. A
// grid: across, how standard the work is (a new question, a standard task); up, how often
// it comes (once, now; again and again). The four cells start as gaps, each naming the
// kind of work. Then each way fills its cell: Ask (a new question, once), Use (a standard
// task, one case), Run (standard steps, many cases), Create (a new question, again and
// again). Each card says what the way is strong at and where it stops; where one stops,
// the next takes over. One Workspace underneath: same identity, permissions, evidence and
// control record.
SceneDirector.register('four-ways', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var G = D.ways;
  var W = 1040, H = 520;
  var LBL = { x: 16, w: 112 };
  var GRID = { x: 140, y: 24, w: 434, h: 164, gap: 14 };
  var XL = 380;
  var BASE = { y: 410, h: 40 };
  var NOTE = 462;

  var cv = null;
  var n = {};
  var done = false;

  function cell(col, row) { return { left: GRID.x + col * (GRID.w + GRID.gap), top: GRID.y + row * (GRID.h + GRID.gap), width: GRID.w, height: GRID.h }; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'four-ways' });
    n = { axes: [], gaps: [], cards: [], items: [] };
    done = false;
    var root = cv.el;

    // Axes: how often (up), how standard (across)
    n.axes.push(root.appendChild(S.el('div', 'ts-label fw2-axis ts-hide', G.up.label, { left: LBL.x, top: 0, width: 300 })));
    [G.up.top, G.up.bottom].forEach(function(t, r) {
      var g = cell(0, r);
      n.axes.push(root.appendChild(S.el('div', 'fw2-row ts-hide', t, { left: LBL.x, top: g.top, width: LBL.w, height: g.height })));
    });
    n.axes.push(root.appendChild(S.el('div', 'ts-label fw2-axis ts-hide', G.across.label, { left: LBL.x, top: XL, width: LBL.w + 8 })));
    [G.across.left, G.across.right].forEach(function(t, c) {
      var g = cell(c, 0);
      n.axes.push(root.appendChild(S.el('div', 'fw2-col ts-hide', t, { left: g.left, top: XL - 2, width: g.width })));
    });

    D.capabilities.forEach(function(c, i) {
      var at = G.cells[c.id];
      var g = cell(at[0], at[1]);
      // The gap: the kind of work, before a way fills it
      var gap = S.el('div', 'fw2-gap ts-hide', null, g);
      gap.appendChild(S.icon('ti-help-circle'));
      gap.appendChild(S.el('span', null, c.when));
      root.appendChild(gap);
      n.gaps.push(gap);

      var card = S.el('div', 'ts-obj ts-c-ai fw2-card ts-hide ts-pop', null, g);
      var top = S.el('div', 'fw2-top');
      top.appendChild(S.el('span', 'fw-num', '0' + (i + 1)));
      top.appendChild(S.el('span', 'fw2-verb', c.verb));
      top.appendChild(S.el('span', 'ts-label ts-ink fw2-product', c.product));
      top.appendChild(S.icon(c.icon, 'ts-ink fw2-icon'));
      card.appendChild(top);
      card.appendChild(S.el('div', 'fw2-when', c.when));
      card.appendChild(S.el('div', 'fw2-ex', '“' + c.example + '”'));
      [['pro', 'ti-circle-plus', G.proLabel, c.pro], ['con', 'ti-circle-minus', G.conLabel, c.con]].forEach(function(x) {
        var row = S.el('div', 'fw2-pc is-' + x[0]);
        row.appendChild(S.icon(x[1], 'fw2-pc-i'));
        row.appendChild(S.el('span', 'fw2-pc-k', x[2]));
        row.appendChild(S.el('span', 'fw2-pc-t', x[3]));
        card.appendChild(row);
      });
      root.appendChild(card);
      n.cards.push(card);
    });

    // One Workspace underneath all four
    n.base = S.el('div', 'fw2-base ts-hide', null, { left: 16, top: BASE.y, width: 1008, height: BASE.h });
    n.base.appendChild(S.el('span', 'ws-mark fw-mark'));
    D.foundation.forEach(function(f) { n.base.appendChild(S.el('span', 'fw-base-item fw2-item', f)); });
    root.appendChild(n.base);

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', G.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', G.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200, run: function() { S.on(n.axes); S.on(n.gaps); } }
  ];
  D.capabilities.forEach(function(c, i) {
    steps.push({ delay: 1000 + i * 650, run: function() { n.gaps[i].classList.add('is-filled'); S.on(n.cards[i]); } });
  });
  steps.push(
    { delay: 3800, run: function() { S.on(n.base); } },
    { delay: 4400, run: function() { S.on(n.note); } },
    { delay: 4900, run: complete }
  );
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
      return G.across.label + ': ' + G.across.left.toLowerCase() + ' or ' + G.across.right.toLowerCase() + '. ' + G.up.label + ': ' + G.up.bottom.toLowerCase() + ' or ' + G.up.top.toLowerCase() + '. '
        + D.capabilities.map(function(c) { return c.verb + ' (' + c.product + '): ' + c.when + '. For example: ' + c.example + ' ' + G.proLabel + ': ' + c.pro + '. ' + G.conLabel + ': ' + c.con + '.'; }).join(' ')
        + ' ' + D.foundation.join(', ') + '. ' + G.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
