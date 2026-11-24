// Scene: qualify-and-prove (screen 12)
// Causal story: the commitment is staged. Phase 0, a five-week qualification, confirms
// the question, the data and the method fit, and closes on a fit gate and a value case.
// Phase 1, a six-month working loop, moves work and roles, process and controls, data
// and platform together on real or representative cases. Phase 2 scales by reuse.
// Five weeks proves fit and value; six months proves the operating model.
SceneDirector.register('qualify-and-prove', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var P = D.path;
  var W = 1040, H = 470;
  var BOX = { y: 0, h: 380 };
  var X0 = { x: 16, w: 360 }, X1 = { x: 398, w: 414 }, X2 = { x: 834, w: 190 };

  var cv = null;
  var n = {};
  var done = false;

  function phaseBox(spec, rect, tone) {
    var b = S.el('div', 'ts-obj ts-c-' + tone + ' qp-phase ts-hide ts-up', null, { left: rect.x, top: BOX.y, width: rect.w, height: BOX.h });
    var h = S.el('div', 'qp-head');
    h.appendChild(S.el('span', 'qp-phase-label ts-ink', spec.label));
    h.appendChild(S.el('span', 'qp-title', spec.title));
    b.appendChild(h);
    return b;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'qualify-and-prove' });
    n = { sprint: [], lanes: [], scale: [], arrows: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.p0 = phaseBox(P.sprint, X0, 'human');
    P.sprint.steps.forEach(function(st) {
      var r = S.el('div', 'qp-step' + (st.gate ? ' has-gate' : ''));
      var top = S.el('div', 'qp-step-top');
      top.appendChild(S.el('span', 'qp-step-label', st.label));
      top.appendChild(S.el('span', 'qp-when', st.when));
      r.appendChild(top);
      r.appendChild(S.el('div', 'ts-text', st.text));
      if (st.gate) {
        var gt = S.el('div', 'qp-gate');
        gt.appendChild(S.icon('ti-diamond'));
        gt.appendChild(S.el('span', null, st.gate));
        r.appendChild(gt);
      }
      n.p0.appendChild(r);
      n.sprint.push(r);
    });
    root.appendChild(n.p0);

    n.p1 = phaseBox(P.loop, X1, 'ai');
    P.loop.lanes.forEach(function(l) {
      var r = S.el('div', 'qp-lane is-' + l.id);
      r.appendChild(S.el('div', 'qp-lane-label', l.label));
      r.appendChild(S.el('div', 'ts-text', l.text));
      n.p1.appendChild(r);
      n.lanes.push(r);
    });
    root.appendChild(n.p1);

    n.p2 = phaseBox(P.scale, X2, 'proof');
    var ul = S.el('ul', 'qp-scale');
    P.scale.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
    n.p2.appendChild(ul);
    root.appendChild(n.p2);

    var ay = BOX.y + 40;
    n.arrows.push(S.path(g, 'M' + (X0.x + X0.w + 3) + ' ' + ay + ' L' + (X1.x - 3) + ' ' + ay, 'ts-s-ai qp-arrow', cv.marker('ai')));
    n.arrows.push(S.path(g, 'M' + (X1.x + X1.w + 3) + ' ' + ay + ' L' + (X2.x - 3) + ' ' + ay, 'ts-s-proof qp-arrow', cv.marker('proof')));

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: BOX.y + BOX.h + 20, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', P.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.p0); } },
    { delay: 1200, run: function() { S.on(n.arrows[0]); S.on(n.p1); } },
    { delay: 2300, run: function() { S.on(n.arrows[1]); S.on(n.p2); } },
    { delay: 3000, run: function() { S.on(n.note); } },
    { delay: 3500, run: complete }
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
      return P.sprint.label + ', ' + P.sprint.title.toLowerCase() + ': ' + P.sprint.steps.map(function(s) { return s.label + ' (' + s.when.toLowerCase() + '), ' + s.text.toLowerCase(); }).join('; ')
        + '. ' + P.loop.label + ', ' + P.loop.title.toLowerCase() + ': ' + P.loop.lanes.map(function(l) { return l.label + ', ' + l.text.toLowerCase(); }).join('; ')
        + '. ' + P.scale.label + ', ' + P.scale.title.toLowerCase() + ': ' + P.scale.items.join(', ').toLowerCase() + '. ' + P.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
