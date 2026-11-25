// Scene: authority-boundary (screen 11)
// Causal story: AI prepares, professionals decide, systems record. Three columns follow
// the headline, left to right, each opening with what happened in the demonstration
// (AI drafted the evidence request, the professional approved it as their own judgement,
// the system checked permissions, wrote the change and issued a receipt), then what that
// part may do. Then how far AI goes, step by step: it finds the evidence and applies the
// method; it proposes a judgement against policy, which a person confirms; the decision
// belongs to a named person. Running a step grants no authority.
SceneDirector.register('authority-boundary', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.boundary;
  var W = 1040, H = 440;
  var COL = { y: 0, w: 316, h: 232, gap: 30 };
  var LAD = { label: 254, y: 278, h: 96, arrow: 20 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * (COL.w + COL.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'authority-boundary', refHeight: 520 });
    n = { cols: [], arrows: [], steps: [], stepArrows: [] };
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
    // How far AI goes, step by step
    var L = B.ladder;
    n.ladLabel = S.el('div', 'ts-label ts-hide', L.label, { left: 16, top: LAD.label, width: 520 });
    root.appendChild(n.ladLabel);
    n.ladAside = S.el('div', 'ab-aside ts-hide', L.aside, { left: 524, top: LAD.label - 1, width: 500 });
    root.appendChild(n.ladAside);
    var sw = (1008 - (L.steps.length - 1) * LAD.arrow) / L.steps.length;
    L.steps.forEach(function(st, i) {
      var x = 16 + i * (sw + LAD.arrow);
      var b = S.el('div', 'ts-obj ts-c-' + st.tone + ' ts-soft ab-step ts-hide ts-up', null, { left: x, top: LAD.y, width: sw, height: LAD.h });
      var h = S.el('div', 'ab-step-head');
      h.appendChild(S.el('span', 'ab-step-n ts-ink', String(i + 1)));
      h.appendChild(S.el('span', 'ab-step-t', st.label));
      b.appendChild(h);
      b.appendChild(S.el('span', 'ab-step-who ts-ink', st.who));
      b.appendChild(S.el('div', 'ab-step-x', st.example));
      root.appendChild(b);
      n.steps.push(b);
      if (i < L.steps.length - 1) {
        var a = S.el('div', 'ab-arrow ts-hide', null, { left: x + sw, top: LAD.y + LAD.h / 2 - 10, width: LAD.arrow, height: 20 });
        a.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(a);
        n.stepArrows.push(a);
      }
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: LAD.y + LAD.h + 20, width: 1008 });
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
    { delay: 2300, run: function() { S.on(n.ladLabel); S.on(n.steps[0]); } },
    { delay: 2550, run: function() { S.on(n.stepArrows[0]); S.on(n.steps[1]); } },
    { delay: 2800, run: function() { S.on(n.stepArrows[1]); S.on(n.steps[2]); } },
    { delay: 3050, run: function() { S.on(n.stepArrows[2]); S.on(n.steps[3]); } },
    { delay: 3400, run: function() { S.on(n.ladAside); } },
    { delay: 3800, run: function() { S.on(n.note); } },
    { delay: 4300, run: complete }
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
      return B.columns.map(function(c) { return c.label + '. ' + B.demoLabel + ': ' + c.demo + ' ' + c.items.join(', ') + '.'; }).join(' ') + ' '
        + B.ladder.label + ': ' + B.ladder.steps.map(function(st, i) { return (i + 1) + ' ' + st.label.toLowerCase() + ', ' + st.who + ', for example ' + st.example.toLowerCase(); }).join('; ') + '. '
        + B.ladder.aside + ' ' + B.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
