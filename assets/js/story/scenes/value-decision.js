// Scene: value-decision (screen 12)
// Causal story: value measured from week one, and each gate opens on evidence. Two lenses:
// insight (what you can now see, in time to act) and speed (how fast the work moves),
// each with what improves and the one measure it is judged by. Under them, value grows
// gate by gate: baseline on your own cases (week 0), first findings on your data (week
// 5), one team live and measured (month 6), the next team onboarded on the same core. The
// gates between them open on evidence: findings confirmed and a value case agreed;
// measures met and controls proven live; the same measures for each new team.
SceneDirector.register('value-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var V = D.value;
  var W = 1040, H = 500;
  var LENS = { y: 0, h: 160, w: 498, gap: 12 };
  var STAIR = { label: 176, bottom: 386, w: 210, gap: 56, h0: 96, rise: 28 };
  var CAP = { y: 398, h: 44, w: 250 };
  var NOTE = 454;

  var cv = null;
  var n = {};
  var done = false;

  function stepX(i) { return 16 + i * (STAIR.w + STAIR.gap); }
  function stepH(i) { return STAIR.h0 + i * STAIR.rise; }
  function stepTop(i) { return STAIR.bottom - stepH(i); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'value-decision', refHeight: 520 });
    n = { lenses: [], steps: [], gates: [], caps: [] };
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

    // Value grows gate by gate: a rising step per stage, a gate between each
    n.growLabel = S.el('div', 'ts-label ts-hide', V.growLabel, { left: 16, top: STAIR.label, width: 600 });
    root.appendChild(n.growLabel);
    var pts = [];
    V.steps.forEach(function(st, i) {
      var b = S.el('div', 'ts-obj ts-c-' + (i ? (i === V.steps.length - 1 ? 'proof' : 'ai') : 'neutral') + ' ts-soft vd2-step ts-hide ts-up', null, { left: stepX(i), top: stepTop(i), width: STAIR.w, height: stepH(i) });
      b.appendChild(S.el('span', 'vd2-when ts-ink', st.when));
      b.appendChild(S.el('span', 'vd2-step-t', st.label));
      b.appendChild(S.el('span', 'vd2-step-x', st.text));
      root.appendChild(b);
      n.steps.push(b);
      pts.push((stepX(i) + STAIR.w / 2) + ' ' + (stepTop(i) - 8));
    });
    n.line = S.path(g, 'M' + pts.join(' L'), 'ts-s-proof vd2-line', cv.marker('proof'));
    V.gates.forEach(function(gt, i) {
      var gx = stepX(i) + STAIR.w;
      var d = S.el('div', 'vd2-gate ts-hide ts-pop', null, { left: gx, top: stepTop(i + 1) + 14, width: STAIR.gap, height: 40 });
      d.appendChild(S.icon('ti-diamond'));
      d.appendChild(S.el('span', null, gt.label));
      root.appendChild(d);
      n.gates.push(d);
      var cx = gx + STAIR.gap / 2;
      var c = S.el('div', 'vd2-cap ts-hide', null, { left: Math.max(16, Math.min(1024 - CAP.w, cx - CAP.w / 2)), top: CAP.y, width: CAP.w, height: CAP.h });
      c.appendChild(S.el('span', 'vd2-cap-k', gt.label + ':'));
      c.appendChild(S.el('span', null, ' ' + gt.opens));
      root.appendChild(c);
      n.caps.push(c);
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
    steps.push({ delay: 1700 + i * 700, run: function() { S.on(n.gates[i]); S.on(n.caps[i]); } });
    steps.push({ delay: 2000 + i * 700, run: function() { S.on(n.steps[i + 1]); } });
  });
  var tl0 = 2000 + V.gates.length * 700;
  steps.push(
    { delay: tl0, run: function() { S.on(n.line); } },
    { delay: tl0 + 600, run: function() { S.on(n.note); } },
    { delay: tl0 + 1100, run: complete }
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
