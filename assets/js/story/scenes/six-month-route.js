// Scene: six-month-route (v2 screen 11)
// Causal story: the same three layers from screen five, now as three lanes over six
// months: define, build and test, operate and prove. Each phase fills all three lanes
// at once, so the layers visibly move in parallel, with a gate between phases. Below:
// the four entry conditions, and what month six proves. It proves one working loop and
// reusable foundations, not an enterprise-wide platform.
SceneDirector.register('six-month-route', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var LBL = { x: 16, w: 150 };
  var PH = { x0: 178, w: 266, gap: 26, y: 0, hh: 46 };
  var ROW = { y0: 54, h: 80, gap: 8 };
  var LOW = { y: 324 };

  var cv = null;
  var n = {};
  var done = false;

  function phX(i) { return PH.x0 + i * (PH.w + PH.gap); }
  function rowY(i) { return ROW.y0 + i * (ROW.h + ROW.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'six-month-route' });
    n = { heads: [], labels: [], cells: [[], [], []], gates: [], entry: [], proof: [] };
    done = false;
    var root = cv.el;
    var R = D.roadmap;
    var tones = ['data', 'ai', 'proof'];

    R.phases.forEach(function(p, i) {
      var h = S.el('div', 'sx-phase ts-hide ts-c-' + tones[i], null, { left: phX(i), top: PH.y, width: PH.w, height: PH.hh });
      h.appendChild(S.el('span', 'ts-label ts-ink', p.months));
      h.appendChild(S.el('span', 'sx-phase-name', p.label));
      root.appendChild(h);
      n.heads.push(h);
      if (i < R.phases.length - 1) {
        var gate = S.ProofGate.create(null, {});
        gate.el.classList.add('sx-gate', 'ts-hide', 'ts-pop');
        gate.el.style.position = 'absolute';
        gate.el.style.left = (phX(i) + PH.w + PH.gap / 2 - 11) + 'px';
        gate.el.style.top = (PH.y + PH.hh - 13) + 'px';
        root.appendChild(gate.el);
        n.gates.push(gate);
      }
    });

    D.layers.forEach(function(l, r) {
      var y = rowY(r);
      var lab = S.el('div', 'sx-lane ts-hide ts-left', null, { left: LBL.x, top: y, width: LBL.w, height: ROW.h });
      lab.appendChild(S.icon(l.icon));
      lab.appendChild(S.el('span', 'sx-lane-name', l.label));
      root.appendChild(lab);
      n.labels.push(lab);
      R.cells[l.id].forEach(function(text, c) {
        var cell = S.el('div', 'ts-obj ts-c-' + tones[c] + ' sx-cell ts-hide', null, { left: phX(c), top: y, width: PH.w, height: ROW.h });
        cell.appendChild(S.el('span', 'sx-cell-text', text));
        root.appendChild(cell);
        n.cells[c].push(cell);
      });
    });

    var entry = S.el('div', 'sx-box sx-entry ts-hide ts-up', null, { left: 16, top: LOW.y, width: 400, height: 186 });
    entry.appendChild(S.el('div', 'ts-label ts-ink ts-c-human', R.entryTitle));
    R.entry.forEach(function(e) {
      var row = S.el('div', 'sx-row');
      row.appendChild(S.icon('ti-circle-check'));
      row.appendChild(S.el('span', null, e));
      entry.appendChild(row);
      n.entry.push(row);
    });
    root.appendChild(entry);
    n.entryBox = entry;

    var proof = S.el('div', 'sx-box sx-proof ts-hide ts-up', null, { left: 432, top: LOW.y, width: 592, height: 186 });
    proof.appendChild(S.el('div', 'ts-label ts-ink ts-c-proof', R.proofTitle));
    var grid = S.el('div', 'sx-proof-grid');
    R.proof.forEach(function(p) {
      var row = S.el('div', 'sx-row');
      row.appendChild(S.icon('ti-circle-check'));
      row.appendChild(S.el('span', null, p));
      grid.appendChild(row);
    });
    proof.appendChild(grid);
    proof.appendChild(S.el('div', 'sx-not', R.notInScope));
    root.appendChild(proof);
    n.proofBox = proof;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.labels); } },
    { delay: 600,  run: function() { S.on(n.heads[0]); S.on(n.cells[0]); } },
    { delay: 1500, run: function() { S.on(n.gates[0].el); n.gates[0].pass(); } },
    { delay: 1800, run: function() { S.on(n.heads[1]); S.on(n.cells[1]); } },
    { delay: 2700, run: function() { S.on(n.gates[1].el); n.gates[1].pass(); } },
    { delay: 3000, run: function() { S.on(n.heads[2]); S.on(n.cells[2]); } },
    { delay: 4000, run: function() { S.on(n.entryBox); } },
    { delay: 4600, run: function() { S.on(n.proofBox); } },
    { delay: 5300, run: complete }
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
      var R = D.roadmap;
      return 'Six months in three parallel lanes. ' + D.layers.map(function(l) {
        return l.label + ': ' + R.phases.map(function(p, i) { return p.label.toLowerCase() + ', ' + R.cells[l.id][i].toLowerCase(); }).join('; ');
      }).join('. ') + '. ' + R.entryTitle + ': ' + R.entry.join(', ').toLowerCase() + '. ' + R.proofTitle + ': ' + R.proof.join(', ').toLowerCase() + '. ' + R.notInScope;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
