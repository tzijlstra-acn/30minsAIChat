// Scene: three-layers (v2 screen 05)
// Causal story: three lanes, work and roles, process and controls, data and platform,
// each with a fragmented today. The three move to their future state at the same time
// (one "in parallel" bracket, three arrows drawing together), then converge into the
// NFR Workspace. Improving only the AI layer creates another pilot.
SceneDirector.register('three-layers', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var LBL = { x: 16, w: 168 };
  var TODAY = { x: 196, w: 244 };
  var FUT = { x: 566, w: 270 };
  var WS = { x: 880, w: 144 };
  var ROW = { y0: 30, h: 104, gap: 16 };

  var cv = null;
  var n = {};
  var done = false;

  function rowY(i) { return ROW.y0 + i * (ROW.h + ROW.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'three-layers' });
    n = { labels: [], today: [], future: [], arrows: [], merge: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    var bottom = rowY(2) + ROW.h;

    n.hToday = S.el('div', 'ts-label ts-hide', 'Today', { left: TODAY.x, top: 2, width: TODAY.w });
    n.hFut = S.el('div', 'ts-label ts-ink ts-c-ai ts-hide', 'With NFR Workspace', { left: FUT.x, top: 2, width: FUT.w });
    root.appendChild(n.hToday);
    root.appendChild(n.hFut);

    D.layers.forEach(function(l, i) {
      var y = rowY(i);
      var lab = S.el('div', 'tl-lane ts-hide ts-left', null, { left: LBL.x, top: y, width: LBL.w, height: ROW.h });
      lab.appendChild(S.icon(l.icon));
      lab.appendChild(S.el('span', 'tl-lane-name', l.label));
      root.appendChild(lab);
      n.labels.push(lab);
      var t = S.el('div', 'tl-today ts-hide', null, { left: TODAY.x, top: y, width: TODAY.w, height: ROW.h });
      t.appendChild(S.el('span', 'ts-text', l.today));
      root.appendChild(t);
      n.today.push(t);
      var f = S.el('div', 'ts-obj ts-c-ai tl-future ts-hide ts-right', null, { left: FUT.x, top: y, width: FUT.w, height: ROW.h });
      f.appendChild(S.el('span', 'tl-future-text', l.future));
      root.appendChild(f);
      n.future.push(f);
      var cy = y + ROW.h / 2;
      n.arrows.push(S.path(g, 'M' + (TODAY.x + TODAY.w + 8) + ' ' + cy + ' L' + (FUT.x - 8) + ' ' + cy, 'ts-s-ai tl-arrow', cv.marker('ai')));
      var mx = WS.x - 4;
      var wy = ROW.y0 + 30 + i * ((bottom - ROW.y0 - 60) / 2);
      n.merge.push(S.path(g, 'M' + (FUT.x + FUT.w + 4) + ' ' + cy + ' C' + (FUT.x + FUT.w + 30) + ' ' + cy + ' ' + (mx - 20) + ' ' + wy + ' ' + mx + ' ' + wy, 'ts-s-ai tl-merge'));
    });

    // One bracket: the three layers move in parallel, not in sequence
    n.par = S.el('div', 'tl-parallel ts-hide', null, { left: TODAY.x + TODAY.w + 14, top: ROW.y0 - 4, width: FUT.x - TODAY.x - TODAY.w - 28, height: bottom - ROW.y0 + 8 });
    root.appendChild(n.par);
    var px = TODAY.x + TODAY.w + 14, pw = FUT.x - TODAY.x - TODAY.w - 28;
    n.parLabel = S.el('div', 'ts-label ts-ink ts-c-ai tl-par-label ts-hide', 'In parallel', { left: px - 20, top: 2, width: pw + 40 });
    root.appendChild(n.parLabel);

    var ws = S.el('div', 'tl-ws ts-hide ts-pop', null, { left: WS.x, top: ROW.y0, width: WS.w, height: bottom - ROW.y0 });
    ws.appendChild(S.el('span', 'ws-mark tl-mark'));
    ws.appendChild(S.el('span', 'tl-ws-name', D.product));
    ws.appendChild(S.el('span', 'ts-text tl-ws-sub', 'Roles, process and platform improve together'));
    root.appendChild(ws);
    n.ws = ws;

    n.quote = S.el('div', 'tl-quote ts-hide', null, { left: 16, top: 404, width: 1008, height: 96 });
    n.quote.appendChild(S.el('div', 'tl-quote-main', D.layersLine));
    n.quote.appendChild(S.el('div', 'ts-text', D.layersLine2));
    root.appendChild(n.quote);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.labels); } },
    { delay: 700,  run: function() { S.on(n.hToday); S.on(n.today); } },
    { delay: 1700, run: function() { S.on(n.par); S.on(n.parLabel); } },
    { delay: 2100, run: function() { S.on(n.arrows); } },
    { delay: 2700, run: function() { S.on(n.hFut); S.on(n.future); } },
    { delay: 3600, run: function() { S.on(n.merge); } },
    { delay: 4100, run: function() { S.on(n.ws); } },
    { delay: 4900, run: function() { S.on(n.quote); } },
    { delay: 5500, run: complete }
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
      return 'Three layers move in parallel into the NFR Workspace. ' + D.layers.map(function(l) { return l.label + ': today, ' + l.today.toLowerCase() + ' Future: ' + l.future.toLowerCase(); }).join(' ')
        + ' ' + D.layersLine + ' ' + D.layersLine2;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
