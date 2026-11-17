// Scene: transition-cover (Screen 00, landing)
// Causal story: scattered source signals converge into one case thread, the thread
// passes through one role workspace, stops at an amber human decision, and a green
// recorded action closes the loop back to the next review. Compact vertical layout
// for the right column of the landing slide; NFR OS stays a subtle mark.
SceneDirector.register('transition-cover', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 560, H = 440;
  var MERGE = { x: 234, y: 196 };
  var BOX = { x: 262, y: 140, w: 222, h: 112 };
  var AXIS_X = BOX.x + BOX.w / 2;

  // Labels sit left of their dot so no converging line crosses them
  var SIGNALS = [
    { x: 162, y: 48,  label: 'GRC record' },
    { x: 184, y: 122, label: 'Contract annex' },
    { x: 156, y: 196, label: 'Assurance report' },
    { x: 180, y: 270, label: 'Incident log' },
    { x: 158, y: 344, label: 'Mail thread' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'transition-cover', maxScale: 1.15 });
    n = { signals: [], feeds: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    SIGNALS.forEach(function(s) {
      var dot = S.el('div', 'tc-signal ts-hide ts-pop', null, { left: s.x - 6, top: s.y - 6, width: 12, height: 12 });
      var lbl = S.el('div', 'ts-text tc-signal-label ts-hide', s.label, { left: s.x - 150, top: s.y - 10, width: 136 });
      root.appendChild(dot);
      root.appendChild(lbl);
      n.signals.push(dot, lbl);
      var d = 'M' + (s.x + 8) + ' ' + s.y + ' C' + (s.x + 40) + ' ' + s.y + ' ' + (MERGE.x - 40) + ' ' + MERGE.y + ' ' + MERGE.x + ' ' + MERGE.y;
      n.feeds.push(S.path(g, d, 'ts-s-data'));
    });

    n.thread1 = S.path(g, 'M' + MERGE.x + ' ' + MERGE.y + ' L' + (BOX.x - 2) + ' ' + MERGE.y, 'ts-s-ai tc-thread');

    // One role workspace: the only box, because it is a real system boundary
    var ws = S.el('div', 'ts-obj ts-soft ts-c-ai tc-ws ts-hide ts-pop', null, { left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h });
    ws.appendChild(S.el('div', 'ts-label ts-ink', 'Role workspace'));
    ws.appendChild(S.el('div', 'ts-title tc-ws-title', 'One case, prepared'));
    ws.appendChild(S.el('div', 'ts-text', 'Evidence, changes and gaps in one place'));
    root.appendChild(ws);
    n.ws = ws;
    n.mark = S.el('div', 'tc-mark ts-hide', 'NFR OS', { left: BOX.x, top: BOX.y - 24 });
    root.appendChild(n.mark);

    n.thread2 = S.path(g, 'M' + AXIS_X + ' ' + (BOX.y + BOX.h + 2) + ' L' + AXIS_X + ' 284', 'ts-s-ai tc-thread');

    var gate = S.DecisionGate.create(null, { size: 'small', label: 'Human decision' });
    gate.el.classList.add('tc-gate', 'ts-hide', 'ts-pop');
    gate.el.style.position = 'absolute';
    gate.el.style.left = (AXIS_X - 12) + 'px';
    gate.el.style.top = '288px';
    root.appendChild(gate.el);
    n.gate = gate;

    n.thread3 = S.path(g, 'M' + AXIS_X + ' 326 L' + AXIS_X + ' 352', 'ts-s-proof tc-thread');

    var receipt = S.ReceiptState.create(null, { state: 'acknowledged', label: 'Action recorded' });
    receipt.el.classList.add('ts-hide', 'ts-pop');
    receipt.el.style.position = 'absolute';
    receipt.el.style.left = (AXIS_X - 84) + 'px';
    receipt.el.style.top = '356px';
    receipt.el.style.width = '168px';
    receipt.el.style.justifyContent = 'center';
    root.appendChild(receipt.el);
    n.receipt = receipt;

    // The record feeds the next review: the loop closes
    // Loops up the right side, back into the workspace, clear of the signal labels
    n.loop = S.path(g, 'M' + (AXIS_X + 86) + ' 374 C548 374 548 ' + (BOX.y + BOX.h / 2) + ' ' + (BOX.x + BOX.w + 4) + ' ' + (BOX.y + BOX.h / 2), 'ts-s-proof tc-loop', cv.marker('proof'));
    n.loopLabel = S.el('div', 'ts-label ts-ink ts-c-proof tc-loop-label ts-hide', 'Recorded, ready for the next review', { left: 0, top: 408, width: W });
    root.appendChild(n.loopLabel);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 300,  run: function() { S.on(n.signals.slice(0, 2)); } },
    { delay: 480,  run: function() { S.on(n.signals.slice(2, 4)); } },
    { delay: 660,  run: function() { S.on(n.signals.slice(4, 6)); } },
    { delay: 840,  run: function() { S.on(n.signals.slice(6, 8)); } },
    { delay: 1020, run: function() { S.on(n.signals.slice(8, 10)); } },
    { delay: 1600, run: function() { S.on(n.feeds); } },
    { delay: 2400, run: function() { S.on(n.thread1); } },
    { delay: 2800, run: function() { S.on(n.ws); S.on(n.mark); } },
    { delay: 3400, run: function() { S.on(n.thread2); } },
    { delay: 3900, run: function() { S.on(n.gate.el); n.gate.activate(); } },
    { delay: 4900, run: function() { n.gate.el.classList.remove('is-active'); S.on(n.thread3); } },
    { delay: 5300, run: function() { S.on(n.receipt.el); } },
    { delay: 5800, run: function() { S.on(n.loop); S.on(n.loopLabel); } },
    { delay: 6500, run: complete }
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
      return 'Five scattered source signals, from a GRC record to a mail thread, converge into one case thread. '
        + 'The thread passes through one role workspace that prepares the case, stops at an amber human decision gate, '
        + 'and ends in a green recorded action that feeds the next review.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
