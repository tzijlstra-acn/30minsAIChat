// Scene: value-decision (screen 12)
// Causal story: value measured from week one, and each gate opens on evidence. Two lenses:
// insight (what you can now see, in time to act) and speed (how fast the work moves),
// each with what improves and the one measure it is judged by. Under them, value grows
// gate by gate on one line: baseline on your own cases (week 0), first findings on your
// data (week 5), one team live and measured (month 6), the next team on the same core. A
// gate sits on each connector (Go, Scale, Next team); each card's meter fills one step
// further. What opens each gate stays in the accessible summary and the guide.
SceneDirector.register('value-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var V = D.value;
  var W = 1040, H = 420;
  var LENS = { y: 0, h: 166, w: 498, gap: 12 };
  var LINE = { label: 190, y: 214, h: 128, w: 199, gap: 70 };
  var NOTE = 366;

  var cv = null;
  var n = {};
  var done = false;

  function stepX(i) { return 16 + i * (LINE.w + LINE.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'value-decision', refHeight: 520 });
    n = { lenses: [], steps: [], gates: [], joins: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    V.lenses.forEach(function(l, i) {
      var b = S.el('div', 'ts-obj ts-c-' + l.tone + ' vd2-lens ts-hide ts-up', null, { left: 16 + i * (LENS.w + LENS.gap), top: LENS.y, width: LENS.w, height: LENS.h });
      var h = S.el('div', 'vd2-head ts-ink');
      h.appendChild(S.icon(l.icon));
      h.appendChild(S.el('span', 'vd2-label', l.label));
      h.appendChild(S.el('span', 'vd2-text', l.text));
      b.appendChild(h);
      var ul = S.el('ul', 'vd-list');
      l.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      var m = S.el('div', 'vd2-measure');
      m.appendChild(S.el('span', 'vd-k', V.measuredLabel));
      m.appendChild(S.el('span', 'vd2-measure-t ts-ink', l.measure));
      b.appendChild(m);
      root.appendChild(b);
      n.lenses.push(b);
    });

    // Value grows gate by gate: four stages on one line, a gate on each connector
    n.growLabel = S.el('div', 'ts-label ts-hide', V.growLabel, { left: 16, top: LINE.label, width: 600 });
    root.appendChild(n.growLabel);
    var last = V.steps.length - 1;
    V.steps.forEach(function(st, i) {
      var b = S.el('div', 'ts-obj ts-c-' + (i ? (i === last ? 'proof' : 'ai') : 'neutral') + ' ts-soft vd3-step ts-hide ts-up', null, { left: stepX(i), top: LINE.y, width: LINE.w, height: LINE.h });
      b.appendChild(S.el('span', 'vd2-when ts-ink', st.when));
      b.appendChild(S.el('span', 'vd2-step-t', st.label));
      b.appendChild(S.el('span', 'vd2-step-x', st.text));
      // The meter fills one step further at each stage
      var m = S.el('span', 'vd3-meter');
      m.appendChild(S.el('span', 'vd3-meter-k', V.meterLabel));
      for (var k = 0; k < last; k++) m.appendChild(S.el('span', 'vd3-pip' + (k < i ? ' is-on' : '')));
      b.appendChild(m);
      root.appendChild(b);
      n.steps.push(b);
    });
    var cy = LINE.y + LINE.h / 2;
    V.gates.forEach(function(gt, i) {
      var x0 = stepX(i) + LINE.w, x1 = stepX(i + 1);
      n.joins.push(S.path(g, 'M' + (x0 + 3) + ' ' + cy + ' L' + (x1 - 5) + ' ' + cy, 'ts-s-proof vd3-join', cv.marker('proof')));
      var d = S.el('div', 'vd3-gate ts-hide ts-pop', null, { left: x0, top: cy - 52, width: LINE.gap, height: 46 });
      d.appendChild(S.icon('ti-diamond'));
      d.appendChild(S.el('span', null, gt.label));
      root.appendChild(d);
      n.gates.push(d);
    });

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', V.gateLine[0]));
    n.note.appendChild(S.el('span', 'ts-text', V.gateLine[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200, run: function() { S.on(n.lenses[0]); } },
    { delay: 600, run: function() { S.on(n.lenses[1]); } },
    { delay: 1200, run: function() { S.on(n.growLabel); S.on(n.steps[0]); } }
  ];
  V.gates.forEach(function(gt, i) {
    steps.push({ delay: 1700 + i * 700, run: function() { S.on(n.joins[i]); S.on(n.gates[i]); } });
    steps.push({ delay: 2000 + i * 700, run: function() { S.on(n.steps[i + 1]); } });
  });
  var tl0 = 2000 + V.gates.length * 700;
  steps.push(
    { delay: tl0 + 300, run: function() { S.on(n.note); } },
    { delay: tl0 + 800, run: complete }
  );
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
      return V.lenses.map(function(l) { return l.label + ', ' + l.text.toLowerCase() + ': ' + l.items.join(', ').toLowerCase() + '. ' + V.measuredLabel + ' ' + l.measure.toLowerCase() + '.'; }).join(' ') + ' '
        + V.growLabel + ': ' + V.steps.map(function(st, i) { return st.when + ', ' + st.label.toLowerCase() + ', ' + st.text.toLowerCase() + (V.gates[i] ? '; gate ' + V.gates[i].label.toLowerCase() + ' opens when ' + V.gates[i].opens.toLowerCase() : ''); }).join('; ') + '. '
        + V.gateLine.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
