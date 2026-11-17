// Scene: transition-cover (Screen 00)
// Causal story: scattered source signals converge into one case thread, the thread
// passes through one role workspace, stops at an amber human decision, and a green
// recorded action closes the loop. NFR OS stays a subtle mark: no architecture yet.
SceneDirector.register('transition-cover', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var MERGE = { x: 380, y: 270 };

  // Labels sit left of their dot so no converging line crosses them
  var SIGNALS = [
    { x: 214, y: 112, label: 'GRC record' },
    { x: 256, y: 190, label: 'Contract annex' },
    { x: 196, y: 270, label: 'Assurance report' },
    { x: 250, y: 350, label: 'Incident log' },
    { x: 222, y: 428, label: 'Mail thread' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'transition-cover' });
    n = { signals: [], feeds: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    SIGNALS.forEach(function(s) {
      var dot = S.el('div', 'tc-signal ts-hide ts-pop', null, { left: s.x - 6, top: s.y - 6, width: 12, height: 12 });
      var lbl = S.el('div', 'ts-text tc-signal-label ts-hide', s.label, { left: s.x - 176, top: s.y - 10, width: 160 });
      root.appendChild(dot);
      root.appendChild(lbl);
      n.signals.push(dot, lbl);
      var d = 'M' + (s.x + 8) + ' ' + s.y + ' C' + (s.x + 80) + ' ' + s.y + ' ' + (MERGE.x - 70) + ' ' + MERGE.y + ' ' + MERGE.x + ' ' + MERGE.y;
      n.feeds.push(S.path(g, d, 'ts-s-data'));
    });

    n.label = S.el('div', 'ts-label ts-hide', 'Scattered signals', { left: 40, top: 56 });
    root.appendChild(n.label);

    n.thread1 = S.path(g, 'M' + MERGE.x + ' ' + MERGE.y + ' L420 ' + MERGE.y, 'ts-s-ai tc-thread');

    // One role workspace: the only box, because it is a real system boundary
    var ws = S.el('div', 'ts-obj ts-soft ts-c-ai ts-hide ts-pop', null, { left: 420, top: 200, width: 220, height: 140 });
    ws.appendChild(S.el('div', 'ts-label ts-ink', 'Role workspace'));
    ws.appendChild(S.el('div', 'ts-title tc-ws-title', 'One case, prepared'));
    ws.appendChild(S.el('div', 'ts-text', 'Evidence, changes and gaps in one place'));
    root.appendChild(ws);
    n.ws = ws;
    n.mark = S.el('div', 'tc-mark ts-hide', 'NFR OS', { left: 420, top: 176 });
    root.appendChild(n.mark);

    n.thread2 = S.path(g, 'M640 ' + MERGE.y + ' L726 ' + MERGE.y, 'ts-s-ai tc-thread');

    var gate = S.DecisionGate.create(null, { label: 'Human decision' });
    gate.el.classList.add('ts-hide', 'ts-pop');
    gate.el.style.position = 'absolute';
    gate.el.style.left = '692px';
    gate.el.style.top = (MERGE.y - 20) + 'px';
    gate.el.style.width = '120px';
    root.appendChild(gate.el);
    n.gate = gate;

    n.thread3 = S.path(g, 'M780 ' + MERGE.y + ' L842 ' + MERGE.y, 'ts-s-proof tc-thread');

    var receipt = S.ReceiptState.create(null, { state: 'acknowledged', label: 'Action recorded' });
    receipt.el.classList.add('ts-hide', 'ts-pop');
    receipt.el.style.position = 'absolute';
    receipt.el.style.left = '846px';
    receipt.el.style.top = (MERGE.y - 18) + 'px';
    root.appendChild(receipt.el);
    n.receipt = receipt;

    // The record feeds the next review: the loop closes
    n.loop = S.path(g, 'M920 ' + (MERGE.y + 22) + ' C920 450 360 450 ' + MERGE.x + ' ' + (MERGE.y + 6), 'ts-s-proof tc-loop', cv.marker('proof'));
    n.loopLabel = S.el('div', 'ts-label ts-ink ts-c-proof ts-hide', 'Recorded, ready for the next review', { left: 520, top: 448 });
    root.appendChild(n.loopLabel);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.label); S.on(n.signals.slice(0, 2)); } },
    { delay: 380,  run: function() { S.on(n.signals.slice(2, 4)); } },
    { delay: 560,  run: function() { S.on(n.signals.slice(4, 6)); } },
    { delay: 740,  run: function() { S.on(n.signals.slice(6, 8)); } },
    { delay: 920,  run: function() { S.on(n.signals.slice(8, 10)); } },
    { delay: 1500, run: function() { S.on(n.feeds); } },
    { delay: 2300, run: function() { S.on(n.thread1); } },
    { delay: 2700, run: function() { S.on(n.ws); S.on(n.mark); } },
    { delay: 3300, run: function() { S.on(n.thread2); } },
    { delay: 3800, run: function() { S.on(n.gate.el); n.gate.activate(); } },
    { delay: 4800, run: function() { n.gate.el.classList.remove('is-active'); S.on(n.thread3); } },
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
