// Scene: three-layers (screen 06)
// Causal story: AI scales when work, process and data improve together, one role at a
// time. Three stages run left to right: today (AI pilots), the first loop (one NFR role
// in the Workspace), at scale (every NFR role). Three layers run top to bottom: work and
// roles, process and controls, data and platform. Today's cells show the pilot problem;
// the next two columns show each layer improving. NFR Workspace is where all three meet.
SceneDirector.register('three-layers', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 440;
  var LABEL = { x: 16, w: 160 };
  var COL = { x0: 190, w: 254, gap: 36 };
  var HEAD = { y: 0, h: 60 };
  var ROW = { y0: 76, h: 82, gap: 10 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return COL.x0 + i * (COL.w + COL.gap); }
  function rowY(r) { return ROW.y0 + r * (ROW.h + ROW.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'three-layers', refHeight: 520 });
    n = { heads: [], labels: [], cols: [[], [], []], arrows: [[], []] };
    done = false;
    var root = cv.el;

    D.stages.forEach(function(st, c) {
      var h = S.el('div', 'tl-stage ts-c-' + st.tone + ' ts-hide ts-up', null, { left: colX(c), top: HEAD.y, width: COL.w, height: HEAD.h });
      var top = S.el('div', 'tl-stage-top ts-ink');
      top.appendChild(S.icon(st.icon));
      top.appendChild(S.el('span', null, st.label));
      h.appendChild(top);
      h.appendChild(S.el('div', 'tl-stage-sub', st.sub));
      root.appendChild(h);
      n.heads.push(h);
      if (c < D.stages.length - 1) {
        var a = S.el('div', 'tl-arrow tl-arrow-head ts-hide', null, { left: colX(c) + COL.w, top: HEAD.y + HEAD.h / 2 - 11, width: COL.gap, height: 22 });
        a.appendChild(S.icon('ti-arrow-right'));
        root.appendChild(a);
        n.arrows[c].push(a);
      }
    });

    D.layers.forEach(function(l, r) {
      var lab = S.el('div', 'tl-layer ts-hide ts-left', null, { left: LABEL.x, top: rowY(r), width: LABEL.w, height: ROW.h });
      lab.appendChild(S.icon(l.icon));
      lab.appendChild(S.el('span', null, l.label));
      root.appendChild(lab);
      n.labels.push(lab);
      D.stages.forEach(function(st, c) {
        var text = l[st.id];
        var cell = S.el('div', 'ts-obj ts-c-' + st.tone + ' tl-cell' + (c === 0 ? ' ts-dash is-today' : ' ts-soft') + ' ts-hide ts-up', null, { left: colX(c), top: rowY(r), width: COL.w, height: ROW.h });
        cell.appendChild(S.icon(c === 0 ? 'ti-x' : 'ti-check', 'tl-mark ts-ink'));
        cell.appendChild(S.el('span', 'tl-cell-t', text));
        root.appendChild(cell);
        n.cols[c].push(cell);
        if (c < D.stages.length - 1) {
          var a = S.el('div', 'tl-arrow ts-hide', null, { left: colX(c) + COL.w, top: rowY(r) + ROW.h / 2 - 11, width: COL.gap, height: 22 });
          a.appendChild(S.icon('ti-arrow-right'));
          root.appendChild(a);
          n.arrows[c].push(a);
        }
      });
    });

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: rowY(3) + 18, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', D.layersLine));
    n.note.appendChild(S.el('span', 'ts-text', D.layersLine2));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.heads); } },
    { delay: 700,  run: function() { S.on(n.labels); S.on(n.cols[0]); } },
    { delay: 1500, run: function() { S.on(n.arrows[0]); S.on(n.cols[1]); } },
    { delay: 2300, run: function() { S.on(n.arrows[1]); S.on(n.cols[2]); } },
    { delay: 3000, run: function() { S.on(n.note); } },
    { delay: 3600, run: complete }
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
      return D.layers.map(function(l) {
        return l.label + ': ' + D.stages.map(function(st) { return st.label.toLowerCase() + ', ' + l[st.id].toLowerCase(); }).join('; ');
      }).join('. ') + '. ' + D.layersLine + ' ' + D.layersLine2;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
