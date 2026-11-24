// Scene: chain-drift (screen 03)
// Causal story: regulation changes from above, practice drifts from below, and the chain
// between them (obligation, risk or process, control, evidence, assessment, decision)
// stops telling one story. Change comes down from a band above the chain, drift comes up
// from a band below it, each with straight arrows into the links it hits. Some links
// break. The consequences: fragmented, falsely assured, burdensome. The professional
// re-maps the chain by hand.
SceneDirector.register('chain-drift', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.chain;
  var W = 1040, H = 520;
  var BAND = { h: 80 };
  var ABOVE_Y = 0, LINK = { y: 128, w: 150, h: 56 }, BELOW_Y = 232;
  var CONS = { y: 344, w: 330, h: 88, gap: 9 };

  var cv = null;
  var n = {};
  var done = false;

  function linkX(i) { var gap = (W - 32 - C.links.length * LINK.w) / (C.links.length - 1); return 16 + i * (LINK.w + gap); }

  function band(spec, y, tone) {
    var b = S.el('div', 'ts-obj ts-c-' + tone + ' cd-band ts-hide ts-up', null, { left: 16, top: y, width: 1008, height: BAND.h });
    var h = S.el('div', 'cd-band-head ts-ink');
    h.appendChild(S.icon(spec.icon));
    h.appendChild(S.el('span', null, spec.label));
    b.appendChild(h);
    var row = S.el('div', 'cd-band-items');
    spec.items.forEach(function(t) { row.appendChild(S.el('span', 'cd-item', t)); });
    b.appendChild(row);
    return b;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'chain-drift' });
    n = { links: [], joins: [], breaks: [], down: [], up: [], cons: [] };
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
    // Straight arrows: down from the band above, up from the band below
    C.above.hits.forEach(function(i) {
      var x = linkX(i) + LINK.w / 2;
      n.down.push(S.path(g, 'M' + x + ' ' + (ABOVE_Y + BAND.h + 4) + ' L' + x + ' ' + (LINK.y - 6), 'ts-s-data cd-arrow', cv.marker('data')));
    });
    C.below.hits.forEach(function(i) {
      var x = linkX(i) + LINK.w / 2;
      n.up.push(S.path(g, 'M' + x + ' ' + (BELOW_Y - 4) + ' L' + x + ' ' + (LINK.y + LINK.h + 6), 'ts-s-gap cd-arrow', cv.marker('gap')));
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
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 452, width: 1008 });
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
    { delay: 800,  run: function() { S.on(n.above); } },
    { delay: 1200, run: function() { S.on(n.down); } },
    { delay: 1800, run: function() { S.on(n.below); } },
    { delay: 2200, run: function() { S.on(n.up); } },
    { delay: 2800, run: function() { S.on(n.breaks); } },
    { delay: 3400, run: function() { S.on(n.cons); } },
    { delay: 4100, run: function() { S.on(n.note); } },
    { delay: 4700, run: complete }
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
      return C.above.label + ': ' + C.above.items.join(', ').toLowerCase() + '. ' + C.below.label + ': ' + C.below.items.join(', ').toLowerCase()
        + '. The chain ' + C.links.join(', ').toLowerCase() + ' no longer tells one story. Consequences: '
        + C.consequences.map(function(c) { return c.label.toLowerCase() + ', ' + c.text.toLowerCase(); }).join(' ') + ' ' + C.person + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
