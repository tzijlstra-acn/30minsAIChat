// Scene: six-month-route (Screen 07)
// Causal story: a three-act route builds left to right: frame (months 0 to 2), build
// (2 to 4), test in use (4 to 6). Each act shows tangible outputs, not activity labels.
// Seven workstreams rise together under every act, and all seven pass each gate
// together: no workstream reaches a gate alone.
SceneDirector.register('six-month-route', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var X0 = 214, MONTH = 134;           // month 0 at X0, one month = MONTH px
  var ACT_TOP = 30, ACT_H = 226;
  var LANE_TOP = 300, LANE_STEP = 27;

  var ACTS = [
    { from: 0, to: 2, label: 'Months 0 to 2', title: 'Frame', c: 'data',
      focus: 'Agree the journey, baseline and boundaries',
      outputs: ['Journey blueprint', 'Baseline and business case', 'Source and authority map', 'Product backlog', 'Ready-to-build gate'] },
    { from: 2, to: 4, label: 'Months 2 to 4', title: 'Build', c: 'ai',
      focus: 'Build the workspace and the read flow',
      outputs: ['End-to-end read flow', 'Evaluated preparation tasks', 'Usable role workspace', 'Control and operations design', 'Month-3 gate: useful and safe'] },
    { from: 4, to: 6, label: 'Months 4 to 6', title: 'Test in use', c: 'proof',
      focus: 'Run real periodic reviews and measure',
      outputs: ['One process in use', 'Measured operational result', 'Operating runbook', 'Month-6 evidence gate', 'Scale, adjust or stop advice'] }
  ];
  var GATES = [
    { month: 2, label: 'Ready to build', align: 'left-of' },
    { month: 3, label: 'Useful and safe', align: 'right-of' },
    { month: 6, label: 'Evidence gate', align: 'right' }
  ];
  var LANES = [
    'Process and operating model',
    'Experience and workspace',
    'Role App and backend',
    'Data and integration',
    'Models and evaluation',
    'Governance and resilience',
    'Change, adoption and value'
  ];

  var cv = null;
  var n = {};
  var done = false;

  function mx(m) { return X0 + m * MONTH; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'six-month-route' });
    n = { acts: [], outputs: [[], [], []], segs: [[], [], []], gates: [], gateLines: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // Month axis
    n.axis = S.path(g, 'M' + mx(0) + ' 18 L' + mx(6) + ' 18', 'ts-s-neutral');
    n.ticks = [];
    for (var m = 0; m <= 6; m++) {
      var t = S.el('div', 'ts-label sm-tick ts-hide', 'M' + m, { left: mx(m) - 20, top: 0, width: 40 });
      root.appendChild(t);
      n.ticks.push(t);
    }

    ACTS.forEach(function(a, i) {
      var box = S.el('div', 'ts-obj ts-soft ts-c-' + a.c + ' sm-act ts-hide ts-up', null,
        { left: mx(a.from) + 4, top: ACT_TOP, width: (a.to - a.from) * MONTH - 8, height: ACT_H });
      box.appendChild(S.el('div', 'ts-label ts-ink', a.label));
      box.appendChild(S.el('div', 'sm-act-title', a.title));
      box.appendChild(S.el('div', 'ts-text sm-focus', a.focus));
      var list = S.el('div', 'sm-outputs');
      a.outputs.forEach(function(o) {
        var row = S.el('div', 'sm-output ts-hide ts-left');
        row.appendChild(S.icon('ti-check', 'ts-ink'));
        row.appendChild(S.el('span', null, o));
        list.appendChild(row);
        n.outputs[i].push(row);
      });
      box.appendChild(list);
      root.appendChild(box);
      n.acts.push(box);
    });

    // Seven workstream lanes, one segment per act
    n.laneLabels = [];
    LANES.forEach(function(l, li) {
      var y = LANE_TOP + li * LANE_STEP;
      var lbl = S.el('div', 'sm-lane-label ts-hide', l, { left: 0, top: y - 7, width: 200 });
      root.appendChild(lbl);
      n.laneLabels.push(lbl);
      ACTS.forEach(function(a, ai) {
        var seg = S.el('div', 'sm-seg ts-c-' + a.c, null, { left: mx(a.from) + 2, top: y - 3, width: (a.to - a.from) * MONTH - 4, height: 7 });
        root.appendChild(seg);
        n.segs[ai].push(seg);
      });
    });
    n.lanesTitle = S.el('div', 'ts-label ts-hide', 'Seven workstreams', { left: 0, top: LANE_TOP - 34, width: 200 });
    root.appendChild(n.lanesTitle);

    // Gates cut across every lane
    GATES.forEach(function(gt) {
      var x = mx(gt.month);
      var line = S.el('div', 'sm-gate-line ts-hide', null, { left: x - 1, top: LANE_TOP - 16, width: 2, height: LANE_STEP * 6 + 26 });
      root.appendChild(line);
      n.gateLines.push(line);
      var mark = S.el('div', 'sm-gate-mark ts-hide ts-pop', null, { left: x - 9, top: LANE_TOP - 28, width: 18, height: 18 });
      root.appendChild(mark);
      // Labels sit beside the gate line so neighbouring gates never collide
      var lw = 132;
      var left = gt.align === 'right-of' ? x + 14 : x - lw - 14;
      var lbl = S.el('div', 'ts-label ts-ink ts-c-human sm-gate-label ts-hide', gt.label, { left: left, top: LANE_TOP - 34, width: lw });
      lbl.style.textAlign = gt.align === 'right-of' ? 'left' : 'right';
      root.appendChild(lbl);
      n.gates.push([line, mark, lbl]);
    });

    n.together = S.el('div', 'ts-note ts-hide', 'All seven workstreams pass each gate together', { left: X0, top: LANE_TOP + LANE_STEP * 6 + 18 });
    root.appendChild(n.together);
  }

  function grow(ai) {
    n.segs[ai].forEach(function(seg) { seg.classList.add('is-grown'); });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.axis); S.on(n.ticks); S.on(n.laneLabels); S.on(n.lanesTitle); } },
    { delay: 600,  run: function() { S.on(n.acts[0]); } },
    { delay: 1000, run: function() { S.on(n.outputs[0]); } },
    { delay: 1700, run: function() { grow(0); } },
    { delay: 2400, run: function() { S.on(n.gates[0]); } },
    { delay: 3000, run: function() { S.on(n.acts[1]); } },
    { delay: 3400, run: function() { S.on(n.outputs[1]); } },
    { delay: 4100, run: function() { grow(1); } },
    { delay: 4600, run: function() { S.on(n.gates[1]); } },
    { delay: 5300, run: function() { S.on(n.acts[2]); } },
    { delay: 5700, run: function() { S.on(n.outputs[2]); } },
    { delay: 6400, run: function() { grow(2); } },
    { delay: 7000, run: function() { S.on(n.gates[2]); } },
    { delay: 7700, run: function() { S.on(n.together); } },
    { delay: 8300, run: complete }
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
      return ACTS.map(function(a) {
        return a.label + ', ' + a.title + ': ' + a.focus.toLowerCase() + '. Outputs: ' + a.outputs.join(', ').toLowerCase() + '.';
      }).join(' ') + ' Seven workstreams run under all three acts: ' + LANES.join(', ').toLowerCase()
        + '. They pass the ready-to-build, month-3 and month-6 gates together.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
