// Scene: connected-context (screen 09)
// Causal story: every answer keeps the line from obligation to evidence. The chain sits
// in the middle. A new obligation arrives from the top and is traced down to its risks
// and controls; a failed control test arrives from below and is traced up to risks,
// obligations and attestations. Both traces meet on one control: the new obligation
// relies on a control with a missing test. The connected core computes the ripple;
// people decide what to do about it.
SceneDirector.register('connected-context', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.connected;
  var W = 1040, H = 520;
  var PANEL = { y: 0, w: 496, h: 132 };
  var NODE = { y: 184, w: 152, h: 90 };
  var MEET = { y: 318, h: 60 };

  var cv = null;
  var n = {};
  var done = false;

  function nodeX(i) { var gap = (W - 32 - C.nodes.length * NODE.w) / (C.nodes.length - 1); return 16 + i * (NODE.w + gap); }
  function meetIndex() { for (var i = 0; i < C.nodes.length; i++) if (C.nodes[i].meet) return i; return 2; }
  function gapIndex() { for (var i = 0; i < C.nodes.length; i++) if (C.nodes[i].gap) return i; return 3; }

  function panel(spec, x, tone, icon) {
    var b = S.el('div', 'ts-obj ts-c-' + tone + ' cc-panel ts-hide ts-up', null, { left: x, top: PANEL.y, width: PANEL.w, height: PANEL.h });
    var h = S.el('div', 'cc-panel-head');
    h.appendChild(S.icon(icon, 'ts-ink'));
    h.appendChild(S.el('span', 'ts-ink', spec.label));
    h.appendChild(S.el('span', 'cc-trigger', spec.trigger));
    b.appendChild(h);
    var ol = S.el('ol', 'cc-steps');
    spec.steps.forEach(function(t) { ol.appendChild(S.el('li', null, t)); });
    b.appendChild(ol);
    return b;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'connected-context' });
    n = { nodes: [], joins: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    var cy = NODE.y + NODE.h / 2;
    C.nodes.forEach(function(nd, i) {
      var x = nodeX(i);
      var cls = nd.meet ? 'ts-c-human is-meet' : nd.gap ? 'ts-c-gap' : 'ts-c-data';
      var b = S.el('div', 'ts-obj ' + cls + ' cc-node ts-hide', null, { left: x, top: NODE.y, width: NODE.w, height: NODE.h });
      b.appendChild(S.el('div', 'cc-node-label ts-ink', nd.label));
      b.appendChild(S.el('div', 'cc-node-id', nd.id));
      if (nd.system) b.appendChild(S.el('div', 'cc-node-sys', nd.system));
      root.appendChild(b);
      n.nodes.push(b);
      if (i < C.nodes.length - 1) {
        var p = S.svg('path', { d: 'M' + (x + NODE.w + 3) + ' ' + cy + ' L' + (nodeX(i + 1) - 3) + ' ' + cy }, 'ts-s-data cc-join');
        g.appendChild(p);
        n.joins.push(p);
      }
    });
    n.top = panel(C.topDown, 16, 'data', 'ti-arrow-down');
    n.bottom = panel(C.bottomUp, W - 16 - PANEL.w, 'gap', 'ti-arrow-up');
    root.appendChild(n.top);
    root.appendChild(n.bottom);
    var m = meetIndex(), gi = gapIndex();
    var mx = nodeX(m) + NODE.w / 2, gx = nodeX(gi) + NODE.w / 2;
    // Top-down: from the obligation side into the meeting control; bottom-up: from evidence to it
    n.traceDown = S.path(g, 'M' + (16 + PANEL.w / 2) + ' ' + (PANEL.h + 4) + ' C' + (16 + PANEL.w / 2) + ' ' + (PANEL.h + 30) + ' ' + mx + ' ' + (NODE.y - 30) + ' ' + (mx - 20) + ' ' + (NODE.y - 6), 'ts-s-data cc-trace', cv.marker('data'));
    n.traceUp = S.path(g, 'M' + (W - 16 - PANEL.w / 2) + ' ' + (PANEL.h + 4) + ' C' + (W - 16 - PANEL.w / 2) + ' ' + (PANEL.h + 30) + ' ' + gx + ' ' + (NODE.y - 30) + ' ' + gx + ' ' + (NODE.y - 6), 'ts-s-gap cc-trace', cv.marker('gap'));
    n.ripple = S.path(g, 'M' + (gx - NODE.w / 2 - 4) + ' ' + (NODE.y + NODE.h + 14) + ' C' + (gx - 40) + ' ' + (NODE.y + NODE.h + 34) + ' ' + (mx + 40) + ' ' + (NODE.y + NODE.h + 34) + ' ' + (mx + 10) + ' ' + (NODE.y + NODE.h + 8), 'ts-s-human cc-ripple', cv.marker('human'));
    n.meet = S.el('div', 'cc-meet ts-hide ts-pop', null, { left: 120, top: MEET.y, width: 800, height: MEET.h });
    n.meet.appendChild(S.icon('ti-target'));
    n.meet.appendChild(S.el('span', null, C.meet));
    root.appendChild(n.meet);
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 430, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', C.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.nodes); S.on(n.joins); } },
    { delay: 900,  run: function() { S.on(n.top); } },
    { delay: 1400, run: function() { S.on(n.traceDown); } },
    { delay: 2000, run: function() { S.on(n.bottom); } },
    { delay: 2500, run: function() { S.on(n.traceUp); S.on(n.ripple); } },
    { delay: 3200, run: function() { S.on(n.meet); } },
    { delay: 3900, run: function() { S.on(n.note); } },
    { delay: 4400, run: complete }
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
      return 'The chain ' + C.nodes.map(function(x) { return x.label.toLowerCase() + ' ' + x.id + (x.system ? ' from the ' + x.system.toLowerCase() : ''); }).join(', ') + '. '
        + C.topDown.label + ': ' + C.topDown.trigger.toLowerCase() + ', ' + C.topDown.steps.join(', ').toLowerCase() + '. '
        + C.bottomUp.label + ': ' + C.bottomUp.trigger.toLowerCase() + ', ' + C.bottomUp.steps.join(', ').toLowerCase() + '. ' + C.meet + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
