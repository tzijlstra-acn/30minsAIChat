// Scene: three-layers (screen 10, the first of next steps)
// Causal story: from AI pilots to a Workspace that grows by module. Left, how most banks
// start with AI today, layer by layer (each person their own AI, handoffs manual, each
// pilot its own copy of the data): pilots that do not scale, share or prove control.
// Right, NFR Workspace: set up once (identity and access, approved connectors, the
// connected core, controls and audit), with a first team live in six months; then the
// next team on the same core, then further teams, one at a time. Screen 11 opens the first
// six months; screen 12 is the decision on what comes next and who runs it.
SceneDirector.register('three-layers', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var G = D.grow;
  var W = 1040, H = 410;
  var LEFT = { x: 16, y: 22, w: 300, h: 316 };
  var RIGHT = { x: 360, w: 664 };
  var MOD = { y: 44, h: 206, gap: 14 };
  var FOUND = { y: 270, h: 68 };
  var NOTE = 360;

  var cv = null;
  var n = {};
  var done = false;

  function modX(i) { var w = (RIGHT.w - (G.modules.length - 1) * MOD.gap) / G.modules.length; return { x: RIGHT.x + i * (w + MOD.gap), w: w }; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'three-layers', align: 'top' });
    n = { rows: [], mods: [], arrows: [], drops: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // Today: how most banks start with AI
    n.todayLabel = S.el('div', 'ts-label ts-hide', G.todayLabel, { left: LEFT.x, top: 0, width: LEFT.w + 20 });
    root.appendChild(n.todayLabel);
    n.today = S.el('div', 'ts-obj ts-c-gap ts-dash tl2-today ts-hide ts-up', null, { left: LEFT.x, top: LEFT.y, width: LEFT.w, height: LEFT.h });
    D.layers.forEach(function(l) {
      var r = S.el('div', 'tl2-layer');
      var k = S.el('div', 'tl2-layer-k');
      k.appendChild(S.icon(l.icon));
      k.appendChild(S.el('span', null, l.label));
      r.appendChild(k);
      r.appendChild(S.el('div', 'tl2-layer-t', l.today));
      n.today.appendChild(r);
    });
    var res = S.el('div', 'tl2-result ts-ink');
    res.appendChild(S.icon('ti-circle-dashed'));
    res.appendChild(S.el('span', null, G.todayResult));
    n.today.appendChild(res);
    root.appendChild(n.today);
    n.shift = S.el('div', 'tl2-shift ts-hide', null, { left: LEFT.x + LEFT.w + 4, top: LEFT.y + LEFT.h / 2 - 16, width: RIGHT.x - LEFT.x - LEFT.w - 8, height: 32 });
    n.shift.appendChild(S.icon('ti-arrow-right'));
    root.appendChild(n.shift);

    // With NFR Workspace: modules on one foundation
    n.label = S.el('div', 'ts-label ts-ink ts-c-ai ts-hide', G.label, { left: RIGHT.x, top: 0, width: RIGHT.w });
    root.appendChild(n.label);
    G.modules.forEach(function(m, i) {
      var p = modX(i);
      var b = S.el('div', 'ts-obj ts-c-' + m.tone + ' tl2-mod ts-hide ts-up', null, { left: p.x, top: MOD.y, width: p.w, height: MOD.h });
      b.appendChild(S.el('div', 'tl2-when ts-ink', m.when));
      var h = S.el('div', 'tl2-mod-head');
      h.appendChild(S.icon(m.icon, 'ts-ink'));
      h.appendChild(S.el('span', null, m.label));
      b.appendChild(h);
      var ul = S.el('ul', 'tl2-steps');
      m.steps.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      var get = S.el('div', 'tl2-get');
      get.appendChild(S.icon('ti-check', 'ts-ink'));
      get.appendChild(S.el('span', null, m.get));
      b.appendChild(get);
      root.appendChild(b);
      n.mods.push(b);
      var cx = p.x + p.w / 2;
      n.drops.push(S.path(g, 'M' + cx + ' ' + (MOD.y + MOD.h + 2) + ' L' + cx + ' ' + (FOUND.y - 3), 'ts-s-data tl2-drop'));
      if (i < G.modules.length - 1) {
        var a = S.el('div', 'tl2-arrow ts-hide', null, { left: p.x + p.w, top: MOD.y + MOD.h / 2 - 10, width: MOD.gap, height: 20 });
        a.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(a);
        n.arrows.push(a);
      }
    });
    n.found = S.el('div', 'ts-obj ts-c-data ts-soft tl2-found ts-hide ts-up', null, { left: RIGHT.x, top: FOUND.y, width: RIGHT.w, height: FOUND.h });
    var fk = S.el('div', 'tl2-found-k ts-ink');
    fk.appendChild(S.el('span', 'ws-mark fw-mark'));
    fk.appendChild(S.el('span', null, G.foundation.label));
    n.found.appendChild(fk);
    var fr = S.el('div', 'tl2-found-row');
    G.foundation.items.forEach(function(t) { fr.appendChild(S.el('span', 'tl2-found-i', t)); });
    n.found.appendChild(fr);
    root.appendChild(n.found);

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
    { delay: 200,  run: function() { S.on(n.todayLabel); S.on(n.today); } },
    { delay: 1100, run: function() { S.on(n.shift); S.on(n.label); } },
    { delay: 1400, run: function() { S.on(n.found); } },
    { delay: 1900, run: function() { S.on(n.mods[0]); S.on(n.drops[0]); } },
    { delay: 2600, run: function() { S.on(n.arrows[0]); S.on(n.mods[1]); S.on(n.drops[1]); } },
    { delay: 3200, run: function() { S.on(n.arrows[1]); S.on(n.mods[2]); S.on(n.drops[2]); } },
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
      return G.todayLabel + ': ' + D.layers.map(function(l) { return l.label + ', ' + l.today.toLowerCase(); }).join('; ') + '. ' + G.todayResult + '. '
        + G.label + ': ' + G.foundation.label + ', ' + G.foundation.items.join(', ').toLowerCase() + '. '
        + G.modules.map(function(m) { return m.when + ': ' + m.label + ', ' + m.steps.join(', ').toLowerCase() + '; ' + m.get.toLowerCase(); }).join('. ') + '. '
        + G.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
