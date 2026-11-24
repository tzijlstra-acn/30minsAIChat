// Scene: qualify-and-prove (screen 12)
// Causal story: start small and earn each next step. Three phases left to right: qualify
// (five weeks, one real question on the bank's own data), prove (six months, one role's
// loop live end to end), scale (add roles and processes on the same core). Each shows its
// goal, its parts and what the bank gets; a decision gate sits between phases.
SceneDirector.register('qualify-and-prove', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var P = D.path;
  var W = 1040, H = 410;
  var NEED = { y: 288, h: 46 };
  var PH = { y: 0, w: 288, h: 270, gap: 72 };

  var cv = null;
  var n = {};
  var done = false;

  function phX(i) { return 16 + i * (PH.w + PH.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'qualify-and-prove', refHeight: 520 });
    n = { phases: [], gates: [] };
    done = false;
    var root = cv.el;
    P.phases.forEach(function(p, i) {
      var b = S.el('div', 'ts-obj ts-c-' + p.tone + ' qp-phase2 ts-hide ts-up', null, { left: phX(i), top: PH.y, width: PH.w, height: PH.h });
      var head = S.el('div', 'qp-head2');
      var t = S.el('div', 'qp-title ts-ink');
      t.appendChild(S.icon(p.icon));
      t.appendChild(S.el('span', null, p.label));
      head.appendChild(t);
      head.appendChild(S.el('span', 'qp-when', p.when));
      b.appendChild(head);
      b.appendChild(S.el('div', 'qp-k', P.goalLabel));
      b.appendChild(S.el('div', 'qp-goal', p.goal));
      var chips = S.el('div', 'qp-chips');
      p.steps.forEach(function(s) { chips.appendChild(S.el('span', 'qp-chip', s)); });
      b.appendChild(chips);
      var get = S.el('div', 'qp-get');
      get.appendChild(S.el('div', 'qp-k', P.getLabel));
      get.appendChild(S.el('div', 'qp-get-t', p.get));
      b.appendChild(get);
      root.appendChild(b);
      n.phases.push(b);
      if (i < P.phases.length - 1) {
        var gate = S.el('div', 'qp-gate2 ts-hide ts-pop', null, { left: phX(i) + PH.w, top: PH.y + PH.h / 2 - 34, width: PH.gap, height: 68 });
        gate.appendChild(S.icon('ti-diamond'));
        gate.appendChild(S.el('span', null, P.gates[i]));
        root.appendChild(gate);
        n.gates.push(gate);
      }
    });
    if (P.fromYou) {
      n.need = S.el('div', 'ts-obj ts-c-human ts-soft qp-need ts-hide ts-up', null, { left: 16, top: NEED.y, width: 1008, height: NEED.h });
      n.need.appendChild(S.icon('ti-users', 'ts-ink'));
      n.need.appendChild(S.el('span', 'qp-need-k ts-ink', P.fromYou.label));
      P.fromYou.items.forEach(function(t) { n.need.appendChild(S.el('span', 'qp-chip', t)); });
      root.appendChild(n.need);
    }
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NEED.y + NEED.h + 18, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', P.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.phases[0]); } },
    { delay: 900,  run: function() { S.on(n.gates[0]); S.on(n.phases[1]); } },
    { delay: 1600, run: function() { S.on(n.gates[1]); S.on(n.phases[2]); } },
    { delay: 2300, run: function() { S.on(n.need); } },
    { delay: 2800, run: function() { S.on(n.note); } },
    { delay: 3400, run: complete }
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
      return P.phases.map(function(p, i) {
        return p.label + ', ' + p.when.toLowerCase() + '. ' + P.goalLabel + ': ' + p.goal.toLowerCase() + '. ' + P.getLabel + ': ' + p.get.toLowerCase() + '.' + (i < P.gates.length ? ' Then: ' + P.gates[i].toLowerCase() + '.' : '');
      }).join(' ') + (P.fromYou ? ' ' + P.fromYou.label + ': ' + P.fromYou.items.join(', ').toLowerCase() + '.' : '') + ' ' + P.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
