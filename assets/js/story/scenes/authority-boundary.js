// Scene: authority-boundary (screen 10)
// Causal story: AI prepares, professionals decide, systems record. Three columns follow
// the headline, left to right, each opening with what happened in the demonstration
// (AI drafted the evidence request, the professional approved it as their own judgement,
// the system checked permissions, wrote the change and issued a receipt), then what that
// part may do. Running a step grants no authority.
SceneDirector.register('authority-boundary', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.boundary;
  var W = 1040, H = 360;
  var COL = { y: 0, w: 316, h: 232, gap: 30 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * (COL.w + COL.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'authority-boundary', refHeight: 520 });
    n = { cols: [], arrows: [] };
    done = false;
    var root = cv.el;
    B.columns.forEach(function(c, i) {
      var b = S.el('div', 'ts-obj ts-c-' + c.tone + ' ab-col ts-hide ts-up', null, { left: colX(i), top: COL.y, width: COL.w, height: COL.h });
      var head = S.el('div', 'ab-head ts-ink');
      head.appendChild(S.icon(c.icon));
      head.appendChild(S.el('span', 'ab-head-t', c.label));
      b.appendChild(head);
      var demo = S.el('div', 'ab-demo');
      demo.appendChild(S.el('div', 'ab-k', B.demoLabel));
      demo.appendChild(S.el('div', 'ab-demo-t', c.demo));
      b.appendChild(demo);
      var ul = S.el('ul', 'ab-list');
      c.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      root.appendChild(b);
      n.cols.push(b);
      if (i < B.columns.length - 1) {
        var a = S.el('div', 'ab-arrow ts-hide', null, { left: colX(i) + COL.w, top: COL.y + COL.h / 2 - 11, width: COL.gap, height: 22 });
        a.appendChild(S.icon('ti-arrow-right'));
        root.appendChild(a);
        n.arrows.push(a);
      }
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: COL.y + COL.h + 24, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', B.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', B.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cols[0]); } },
    { delay: 900,  run: function() { S.on(n.arrows[0]); S.on(n.cols[1]); } },
    { delay: 1600, run: function() { S.on(n.arrows[1]); S.on(n.cols[2]); } },
    { delay: 2400, run: function() { S.on(n.note); } },
    { delay: 3000, run: complete }
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
      return B.columns.map(function(c) { return c.label + '. ' + B.demoLabel + ': ' + c.demo + ' ' + c.items.join(', ') + '.'; }).join(' ') + ' ' + B.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
