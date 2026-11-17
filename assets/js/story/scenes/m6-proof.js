// Scene: m6-proof (Screen 08)
// Causal story: five linked proof points define done at month six. Each turns green
// only when the one before it is complete: trigger, evidence, decision, action, proof.
// The final gate offers three outcomes: scale, adjust or stop. A scope box makes
// clear what is in and what is deliberately out of scope by month six.
SceneDirector.register('m6-proof', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var NODE_W = 160, NODE_H = 150, NODE_Y = 8, NODE_STEP = 178;

  var PROOFS = [
    { title: 'Trigger',  text: 'A periodic review enters the flow.' },
    { title: 'Evidence', text: 'Authorised sources retrieved, material changes shown, gaps named.' },
    { title: 'Decision', text: 'A professional outcome and rationale are recorded.' },
    { title: 'Action',   text: 'An approved action is acknowledged and a receipt created.' },
    { title: 'Proof',    text: 'Outcomes compared with baseline, users find it useful, no boundary breached.' }
  ];
  var IN_SCOPE = [
    'One repeated periodic-review journey',
    'High or critical providers',
    'One Third-Party Risk team and named approvers',
    'GRC records, inventory, approved documents, incidents',
    'Read-only first',
    'One bounded write after proof'
  ];
  var OUT_SCOPE = [
    'Full TPRM lifecycle',
    'Autonomous material decisions',
    'Broad source-system remediation',
    'Unrestricted writes',
    'Enterprise-wide rollout'
  ];
  var OUTCOMES = [
    { label: 'Scale', c: 'proof' },
    { label: 'Adjust', c: 'human' },
    { label: 'Stop', c: 'neutral' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function nodeX(i) { return 16 + i * NODE_STEP; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'm6-proof' });
    n = { nodes: [], arrows: [], ins: [], outs: [], outcomes: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    PROOFS.forEach(function(p, i) {
      var x = nodeX(i);
      var node = S.el('div', 'mp-node ts-hide ts-up', null, { left: x, top: NODE_Y, width: NODE_W, height: NODE_H });
      var head = S.el('div', 'mp-node-head');
      head.appendChild(S.el('span', 'mp-num', String(i + 1)));
      head.appendChild(S.el('span', 'mp-title', p.title));
      node.appendChild(head);
      node.appendChild(S.el('div', 'ts-text mp-text', p.text));
      root.appendChild(node);
      n.nodes.push(node);
      if (i < PROOFS.length - 1) {
        var y = NODE_Y + NODE_H / 2;
        n.arrows.push(S.path(g, 'M' + (x + NODE_W + 2) + ' ' + y + ' L' + (nodeX(i + 1) - 4) + ' ' + y, 'ts-s-proof', cv.marker('proof')));
      }
    });

    // Final gate: the month-six decision with three outcomes
    var gx = nodeX(4) + NODE_W + 18;
    n.gateArrow = S.path(g, 'M' + (nodeX(4) + NODE_W + 2) + ' ' + (NODE_Y + NODE_H / 2) + ' L' + (gx + 14) + ' ' + (NODE_Y + NODE_H / 2), 'ts-s-human', cv.marker('human'));
    var gate = S.DecisionGate.create(null, { label: 'Month six' });
    gate.el.classList.add('ts-hide', 'ts-pop');
    gate.el.style.position = 'absolute';
    gate.el.style.left = (gx + 4) + 'px';
    gate.el.style.top = (NODE_Y + NODE_H / 2 - 20) + 'px';
    gate.el.style.width = (W - gx - 8) + 'px';
    root.appendChild(gate.el);
    n.gate = gate;
    OUTCOMES.forEach(function(o, i) {
      var chip = S.el('div', 'ts-chip ts-c-' + o.c + ' mp-outcome ts-hide ts-pop', o.label, { left: gx + 22, top: NODE_Y + NODE_H / 2 + 52 + i * 30, width: 82 });
      root.appendChild(chip);
      n.outcomes.push(chip);
    });

    // The synthetic case, traced end to end
    var trace = S.el('div', 'mp-trace ts-hide', null, { left: 16, top: NODE_Y + NODE_H + 16 });
    trace.appendChild(S.el('span', 'ts-label', 'Traced end to end, for example'));
    S.CaseBadge.create(trace, { compact: true, state: 'measured' });
    root.appendChild(trace);
    n.trace = trace;

    // Scope: in and out by month six
    var inBox = S.el('div', 'ts-obj ts-c-proof mp-scope ts-hide ts-up', null, { left: 16, top: 226, width: 500, height: 286 });
    inBox.appendChild(S.el('div', 'ts-label ts-ink', 'In scope by month six'));
    IN_SCOPE.forEach(function(t) {
      var row = S.el('div', 'mp-scope-row ts-hide ts-left');
      row.appendChild(S.icon('ti-check', 'ts-ink'));
      row.appendChild(S.el('span', null, t));
      inBox.appendChild(row);
      n.ins.push(row);
    });
    root.appendChild(inBox);
    n.inBox = inBox;

    var outBox = S.el('div', 'mp-scope mp-out ts-hide ts-up', null, { left: 532, top: 226, width: 492, height: 286 });
    outBox.appendChild(S.el('div', 'ts-label', 'Not in scope by month six'));
    OUT_SCOPE.forEach(function(t) {
      var row = S.el('div', 'mp-scope-row mp-out-row ts-hide ts-left');
      row.appendChild(S.icon('ti-x'));
      row.appendChild(S.el('span', null, t));
      outBox.appendChild(row);
      n.outs.push(row);
    });
    root.appendChild(outBox);
    n.outBox = outBox;
  }

  function prove(i) {
    n.nodes[i].classList.add('is-proven');
    if (i > 0) S.on(n.arrows[i - 1]);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.nodes); } },
    { delay: 900,  run: function() { prove(0); } },
    { delay: 1600, run: function() { prove(1); } },
    { delay: 2300, run: function() { prove(2); } },
    { delay: 3000, run: function() { prove(3); S.on(n.trace); } },
    { delay: 3700, run: function() { prove(4); } },
    { delay: 4300, run: function() { S.on(n.gateArrow); S.on(n.gate.el); n.gate.activate(); } },
    { delay: 4800, run: function() { S.on(n.outcomes); } },
    { delay: 5400, run: function() { S.on(n.inBox); S.on(n.ins); } },
    { delay: 6200, run: function() { S.on(n.outBox); S.on(n.outs); } },
    { delay: 7000, run: complete }
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
      var c = window.TPRM_CASE;
      return 'Five proof points define done at month six, each green only after the one before: '
        + PROOFS.map(function(p) { return p.title.toLowerCase() + ', ' + p.text.toLowerCase(); }).join(' ')
        + ' The month-six gate decides to scale, adjust or stop. Traced end to end, for example on case ' + (c ? c.id : '') + '. '
        + 'In scope: ' + IN_SCOPE.join('; ').toLowerCase() + '. Not in scope: ' + OUT_SCOPE.join('; ').toLowerCase() + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
