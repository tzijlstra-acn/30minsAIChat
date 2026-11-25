// Scene: authority-boundary (screen 11)
// Causal story: thresholds decide when a person steps in, and automation is earned. Every
// case is checked against the bank's thresholds (materiality, confidence in the evidence,
// policy rules), set by its risk owners. Three lanes follow: runs on its own (low
// materiality, high confidence; logged and sampled), a person reviews (higher materiality
// or low confidence), a person decides (material, or a policy says so; AI prepares the
// options). Then how routine work moves to automation: at go-live every output is
// reviewed; once proven, routine cases are sampled; at scale routine runs on its own,
// monitored. The share that a person decides stays the same: material judgement stays
// with a named person. AI prepares. Professionals decide. Systems record.
SceneDirector.register('authority-boundary', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.boundary;
  var Rt = B.routing;
  var W = 1040, H = 470;
  var IN = { y: 0, h: 44 };
  var LANE = { y: 78, h: 168, w: 320, gap: 24 };
  var PROG = { label: 264, y: 286, h: 74, w: 320, gap: 24 };
  var KEEP = 376;
  var NOTE = 418;
  var TONES = ['proof', 'ai', 'human'];

  var cv = null;
  var n = {};
  var done = false;

  function laneX(i) { return 16 + i * (LANE.w + LANE.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'authority-boundary', refHeight: 520 });
    n = { lanes: [], drops: [], stages: [], arrows: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // Every case is checked against the bank's thresholds
    n.input = S.el('div', 'ts-obj ts-c-neutral ts-soft qp-need ab2-in ts-hide', null, { left: 16, top: IN.y, width: 1008, height: IN.h });
    n.input.appendChild(S.icon('ti-adjustments', 'ab2-in-i'));
    n.input.appendChild(S.el('span', 'qp-need-k', Rt.inLabel));
    Rt.inputs.forEach(function(t) { n.input.appendChild(S.el('span', 'qp-chip', t)); });
    n.input.appendChild(S.el('span', 'ab2-setby', Rt.setBy));
    root.appendChild(n.input);

    Rt.lanes.forEach(function(l, i) {
      var x = laneX(i), cx = x + LANE.w / 2;
      n.drops.push(S.path(g, 'M' + cx + ' ' + (IN.y + IN.h + 3) + ' L' + cx + ' ' + (LANE.y - 5), 'ts-s-' + l.tone + ' ab2-drop', cv.marker(l.tone)));
      var b = S.el('div', 'ts-obj ts-c-' + l.tone + ' ab2-lane ts-hide ts-up', null, { left: x, top: LANE.y, width: LANE.w, height: LANE.h });
      var h = S.el('div', 'ab-head ts-ink');
      h.appendChild(S.icon(l.icon));
      h.appendChild(S.el('span', 'ab2-lane-t', l.label));
      b.appendChild(h);
      b.appendChild(S.el('div', 'ab2-rule', l.rule));
      b.appendChild(S.el('div', 'ab2-how', l.how));
      var ex = S.el('div', 'ab2-ex');
      ex.appendChild(S.el('div', 'ab-k', 'For example'));
      ex.appendChild(S.el('div', 'ab2-ex-t', l.example));
      b.appendChild(ex);
      root.appendChild(b);
      n.lanes.push(b);
    });

    // How routine work moves to automation; the share a person decides stays the same
    n.progLabel = S.el('div', 'ts-label ts-hide', Rt.progressLabel, { left: 16, top: PROG.label, width: 520 });
    root.appendChild(n.progLabel);
    n.key = S.el('div', 'ab2-key ts-hide', null, { left: 524, top: PROG.label - 1, width: 500 });
    Rt.lanes.forEach(function(l, j) {
      var k = S.el('span', 'ab2-key-i ts-c-' + TONES[j]);
      k.appendChild(S.el('span', 'ab2-key-sw'));
      k.appendChild(S.el('span', null, l.label));
      n.key.appendChild(k);
    });
    root.appendChild(n.key);
    Rt.stages.forEach(function(st, i) {
      var x = laneX(i);
      var b = S.el('div', 'ts-obj ts-c-neutral ab2-stage ts-hide ts-up', null, { left: x, top: PROG.y, width: PROG.w, height: PROG.h });
      var hd = S.el('div', 'ab2-stage-head');
      hd.appendChild(S.el('span', 'ab2-when', st.when));
      hd.appendChild(S.el('span', 'ab2-stage-t', st.text));
      b.appendChild(hd);
      var mix = S.el('div', 'ab2-mix');
      st.mix.forEach(function(v, j) {
        if (!v) return;
        var seg = S.el('span', 'ab2-seg ts-c-' + TONES[j]);
        seg.style.flexGrow = String(v);
        mix.appendChild(seg);
      });
      b.appendChild(mix);
      root.appendChild(b);
      n.stages.push(b);
      if (i < Rt.stages.length - 1) {
        var a = S.el('div', 'ab-arrow ts-hide', null, { left: x + PROG.w, top: PROG.y + PROG.h / 2 - 10, width: PROG.gap, height: 20 });
        a.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(a);
        n.arrows.push(a);
      }
    });
    n.keep = S.el('div', 'ab2-keep ts-hide', null, { left: 16, top: KEEP, width: 1008, height: 24 });
    n.keep.appendChild(S.icon('ti-user-check', 'ab2-keep-i'));
    n.keep.appendChild(S.el('span', 'ab2-keep-t', Rt.keep));
    n.keep.appendChild(S.el('span', 'ab2-move', Rt.move));
    root.appendChild(n.keep);

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
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
    { delay: 200,  run: function() { S.on(n.input); } },
    { delay: 700,  run: function() { S.on(n.drops); } },
    { delay: 1000, run: function() { S.on(n.lanes[0]); } },
    { delay: 1400, run: function() { S.on(n.lanes[1]); } },
    { delay: 1800, run: function() { S.on(n.lanes[2]); } },
    { delay: 2500, run: function() { S.on(n.progLabel); S.on(n.key); S.on(n.stages[0]); } },
    { delay: 3000, run: function() { S.on(n.arrows[0]); S.on(n.stages[1]); } },
    { delay: 3500, run: function() { S.on(n.arrows[1]); S.on(n.stages[2]); } },
    { delay: 4100, run: function() { S.on(n.keep); } },
    { delay: 4600, run: function() { S.on(n.note); } },
    { delay: 5100, run: complete }
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
      return Rt.inLabel + ' ' + Rt.inputs.join(', ').toLowerCase() + '. ' + Rt.setBy + '. '
        + Rt.lanes.map(function(l) { return l.label + ': ' + l.rule.toLowerCase() + '; ' + l.how.toLowerCase() + '; for example, ' + l.example.toLowerCase(); }).join('. ') + '. '
        + Rt.progressLabel + ': ' + Rt.stages.map(function(st) { return st.when + ', ' + st.text.toLowerCase(); }).join('; then ') + '. '
        + Rt.keep + ' ' + Rt.move + ' ' + B.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
