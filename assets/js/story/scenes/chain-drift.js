// Scene: chain-drift (screen 03)
// Causal story: two kinds of change land on the same chain (obligation, risk or process,
// control, evidence, assessment, decision). External change comes from outside the bank
// (a new regulation, a supervisory finding, a supplier, a threat) and hits the top of the
// chain; internal change comes from inside it (a reorganisation, a new system, a control no
// longer performed, evidence out of date) and hits the middle. Links break. Then why it
// matters, in one example: one change of each kind, and what it costs today. The
// consequences: fragmented, falsely assured, burdensome.
SceneDirector.register('chain-drift', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.chain;
  var W = 1040, H = 520;
  var BAND = { h: 70 };
  var ABOVE_Y = 0, LINK = { y: 110, w: 150, h: 50 }, BELOW_Y = 200;
  var EX = { label: 290, y: 310, h: 64, w: [290, 290, 380], op: 24 };
  var CONS = { y: 388, w: 330, h: 52, gap: 9 };
  var NOTE = 454;

  var cv = null;
  var n = {};
  var done = false;

  function linkX(i) { var gap = (W - 32 - C.links.length * LINK.w) / (C.links.length - 1); return 16 + i * (LINK.w + gap); }

  function band(spec, y, tone) {
    var b = S.el('div', 'ts-obj ts-c-' + tone + ' cd-band ts-hide ts-up', null, { left: 16, top: y, width: 1008, height: BAND.h });
    var h = S.el('div', 'cd-band-head ts-ink');
    h.appendChild(S.icon(spec.icon));
    h.appendChild(S.el('span', null, spec.label));
    h.appendChild(S.el('span', 'cd-band-sub', spec.sub));
    b.appendChild(h);
    var row = S.el('div', 'cd-band-items');
    spec.items.forEach(function(t) { row.appendChild(S.el('span', 'cd-item', t)); });
    b.appendChild(row);
    return b;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'chain-drift' });
    n = { links: [], joins: [], breaks: [], down: [], up: [], ex: [], ops: [], cons: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    n.above = band(C.above, ABOVE_Y, 'data');
    n.below = band(C.below, BELOW_Y, 'gap');
    root.appendChild(n.above);
    root.appendChild(n.below);

    var cy = LINK.y + LINK.h / 2;
    C.links.forEach(function(l, i) {
      var x = linkX(i);
      var node = S.el('div', 'ts-obj ts-c-neutral cd-link ts-hide', null, { left: x, top: LINK.y, width: LINK.w, height: LINK.h });
      node.appendChild(S.el('span', 'cd-link-text', l));
      root.appendChild(node);
      n.links.push(node);
      if (i < C.links.length - 1) {
        var x2 = linkX(i + 1);
        var broken = C.broken.indexOf(i) >= 0;
        var p = S.svg('path', { d: 'M' + (x + LINK.w + 3) + ' ' + cy + ' L' + (x2 - 3) + ' ' + cy }, broken ? 'ts-s-gap cd-join is-broken' : 'ts-s-data cd-join');
        g.appendChild(p);
        n.joins.push(p);
        if (broken) {
          var mark = S.el('div', 'cd-break ts-hide ts-pop', null, { left: (x + LINK.w + x2) / 2 - 9, top: cy - 9, width: 18, height: 18 });
          mark.appendChild(S.icon('ti-unlink'));
          root.appendChild(mark);
          n.breaks.push(mark);
        }
      }
    });
    // Straight arrows: down from outside the bank, up from inside it
    C.above.hits.forEach(function(i) {
      var x = linkX(i) + LINK.w / 2;
      n.down.push(S.path(g, 'M' + x + ' ' + (ABOVE_Y + BAND.h + 4) + ' L' + x + ' ' + (LINK.y - 6), 'ts-s-data cd-arrow', cv.marker('data')));
    });
    C.below.hits.forEach(function(i) {
      var x = linkX(i) + LINK.w / 2;
      n.up.push(S.path(g, 'M' + x + ' ' + (BELOW_Y - 4) + ' L' + x + ' ' + (LINK.y + LINK.h + 6), 'ts-s-gap cd-arrow', cv.marker('gap')));
    });

    // Why it matters: one change of each kind, and what it costs today
    n.exLabel = S.el('div', 'ts-label ts-hide', C.exampleLabel, { left: 16, top: EX.label, width: 600 });
    root.appendChild(n.exLabel);
    var x = 16;
    C.example.forEach(function(e, i) {
      var b = S.el('div', 'ts-obj ts-c-' + e.tone + ' ts-soft cd-ex ts-hide ts-up', null, { left: x, top: EX.y, width: EX.w[i], height: EX.h });
      b.appendChild(S.el('div', 'cd-ex-k ts-ink', e.k));
      b.appendChild(S.el('div', 'cd-ex-t', e.text));
      root.appendChild(b);
      n.ex.push(b);
      x += EX.w[i];
      if (i < C.example.length - 1) {
        var op = S.el('div', 'cd-op ts-hide', i === C.example.length - 2 ? '=' : '+', { left: x, top: EX.y, width: EX.op, height: EX.h });
        root.appendChild(op);
        n.ops.push(op);
        x += EX.op;
      }
    });

    C.consequences.forEach(function(c, i) {
      var b = S.el('div', 'ts-obj ts-c-gap cd-cons ts-hide ts-up', null, { left: 16 + i * (CONS.w + CONS.gap), top: CONS.y, width: CONS.w, height: CONS.h });
      b.appendChild(S.icon(c.icon, 'cd-cons-icon ts-ink'));
      var body = S.el('div', 'cd-cons-body');
      body.appendChild(S.el('div', 'cd-cons-label', c.label));
      body.appendChild(S.el('div', 'ts-text', c.text));
      b.appendChild(body);
      root.appendChild(b);
      n.cons.push(b);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', C.person));
    n.note.appendChild(S.el('span', 'ts-text', C.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.links); S.on(n.joins); } },
    { delay: 700,  run: function() { S.on(n.above); } },
    { delay: 1100, run: function() { S.on(n.down); } },
    { delay: 1600, run: function() { S.on(n.below); } },
    { delay: 2000, run: function() { S.on(n.up); } },
    { delay: 2500, run: function() { S.on(n.breaks); } },
    { delay: 3100, run: function() { S.on(n.exLabel); S.on(n.ex[0]); } },
    { delay: 3500, run: function() { S.on(n.ops[0]); S.on(n.ex[1]); } },
    { delay: 3900, run: function() { S.on(n.ops[1]); S.on(n.ex[2]); } },
    { delay: 4600, run: function() { S.on(n.cons); } },
    { delay: 5200, run: function() { S.on(n.note); } },
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
      return C.above.label + ', ' + C.above.sub.toLowerCase() + ': ' + C.above.items.join(', ').toLowerCase() + '. ' + C.below.label + ', ' + C.below.sub.toLowerCase() + ': ' + C.below.items.join(', ').toLowerCase()
        + '. Both hit the same chain: ' + C.links.join(', ').toLowerCase() + '; some links break. ' + C.exampleLabel + ': '
        + C.example.map(function(e) { return e.k + ': ' + e.text; }).join(' ') + ' Consequences: '
        + C.consequences.map(function(c) { return c.label.toLowerCase() + ', ' + c.text.toLowerCase(); }).join(' ') + ' ' + C.person + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
