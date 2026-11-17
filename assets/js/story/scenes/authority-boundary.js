// Scene: authority-boundary (Screen 06)
// Causal story: a two-axis field (need for professional judgement x action
// materiality) shows what executes within policy, what is prepared for review, what
// needs a named approval and what stays a human decision. The model then proposes the
// case's follow-up task: it passes identity and role scope, stops at the amber gate,
// is approved, the connector writes, and the state turns green only after the target
// system acknowledges. Automation does not grant authority.
SceneDirector.register('authority-boundary', function(container, manifest, reduced) {
  var S = window.StoryKit;
  // Content ends at 480px: the shorter canvas keeps text larger under this long title
  var W = 1040, H = 480;
  var FIELD = { x: 64, y: 8, w: 530, h: 444 };
  var QW = 258, QH = 212, QGAP = 14;

  var QUADS = [
    { id: 'approval', label: 'Named approval required', c: 'human', x: FIELD.x, y: FIELD.y,
      items: ['Create an internal task', 'Send an external request', 'Update review status'] },
    { id: 'human', label: 'Human decision only', c: 'human', strong: true, x: FIELD.x + QW + QGAP, y: FIELD.y,
      items: ['Accept a control exception', 'Set residual risk', 'Approve the provider'] },
    { id: 'policy', label: 'Execute within policy', c: 'data', x: FIELD.x, y: FIELD.y + QH + QGAP,
      items: ['Retrieve approved evidence', 'Calculate a fixed threshold'] },
    { id: 'prepare', label: 'Prepare for review', c: 'ai', x: FIELD.x + QW + QGAP, y: FIELD.y + QH + QGAP,
      items: ['Compare evidence', 'Draft a narrative'] }
  ];

  var THREAD_X = 632, THREAD_W = 238;
  var TOKEN_X = 882, TOKEN_W = 154;
  var STAGES = [
    { id: 'identity', label: 'Identity',               c: 'data'  },
    { id: 'scope',    label: 'Role scope',             c: 'data'  },
    { id: 'approval', label: 'Exact approval',         c: 'human' },
    { id: 'connector', label: 'Connector',             c: 'ai'    },
    { id: 'ack',      label: 'Target acknowledgement', c: 'proof' },
    { id: 'receipt',  label: 'Audit receipt',          c: 'proof' }
  ];
  var STAGE_H = 46, STAGE_GAP = 20, STAGE_TOP = 42;

  var cv = null;
  var n = {};
  var done = false;

  function stageY(i) { return STAGE_TOP + i * (STAGE_H + STAGE_GAP); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'authority-boundary' });
    n = { quads: [], stages: [], ticks: [] };
    done = false;
    var C = window.TPRM_CASE;
    var root = cv.el;
    var g = cv.svg;

    // Axes
    n.axes = [
      S.path(g, 'M' + (FIELD.x - 14) + ' ' + (FIELD.y + FIELD.h) + ' L' + (FIELD.x + FIELD.w) + ' ' + (FIELD.y + FIELD.h), 'ts-s-neutral', cv.marker('neutral')),
      S.path(g, 'M' + (FIELD.x - 14) + ' ' + (FIELD.y + FIELD.h) + ' L' + (FIELD.x - 14) + ' ' + FIELD.y, 'ts-s-neutral', cv.marker('neutral'))
    ];
    n.xLabel = S.el('div', 'ts-label ts-hide', 'Need for professional judgement', { left: FIELD.x, top: FIELD.y + FIELD.h + 12, width: FIELD.w });
    n.yLabel = S.el('div', 'ts-label ab-ylabel ts-hide', 'Action materiality', { left: -64, top: FIELD.y + FIELD.h / 2 - 8, width: 160 });
    root.appendChild(n.xLabel);
    root.appendChild(n.yLabel);

    QUADS.forEach(function(q) {
      var box = S.el('div', 'ab-quad ts-c-' + q.c + (q.strong ? ' ab-quad-strong' : '') + ' ts-hide ts-pop', null, { left: q.x, top: q.y, width: QW, height: QH });
      box.appendChild(S.el('div', 'ts-title ts-ink ab-quad-title', q.label));
      q.items.forEach(function(it, k) {
        var row = S.el('div', 'ab-item', it);
        if (q.id === 'approval' && k === 0) {
          row.classList.add('ab-item-case');
          n.caseItem = row;
        }
        box.appendChild(row);
      });
      root.appendChild(box);
      n.quads.push(box);
    });

    // Controlled execution thread
    n.threadLabel = S.el('div', 'ts-label ts-hide', 'Controlled execution', { left: THREAD_X, top: 12 });
    root.appendChild(n.threadLabel);
    n.spine = S.path(g, 'M' + (THREAD_X + 22) + ' ' + (STAGE_TOP + STAGE_H / 2) + ' L' + (THREAD_X + 22) + ' ' + (stageY(5) + STAGE_H / 2), 'ts-s-neutral ab-spine');
    STAGES.forEach(function(st, i) {
      var box = S.el('div', 'ab-stage ts-c-' + st.c + ' ts-hide ts-right', null, { left: THREAD_X, top: stageY(i), width: THREAD_W, height: STAGE_H });
      box.appendChild(S.el('span', 'ab-dot'));
      box.appendChild(S.el('span', 'ab-stage-label', st.label));
      var tick = S.el('span', 'ab-tick');
      box.appendChild(tick);
      root.appendChild(box);
      n.stages.push(box);
      n.ticks.push(tick);
    });

    // The proposed action travels down the thread
    var token = S.el('div', 'ab-token ts-hide ts-pop', null, { left: TOKEN_X, top: 0, width: TOKEN_W });
    token.appendChild(S.el('div', 'ts-label ts-ink ts-c-ai', 'Model proposes'));
    token.appendChild(S.el('div', 'ab-token-text', C.followUp));
    n.tokenState = S.el('div', 'ab-token-state', '');
    token.appendChild(n.tokenState);
    root.appendChild(token);
    n.token = token;

    var receipt = S.ReceiptState.create(null, { state: 'pending', label: 'Not written' });
    receipt.el.classList.add('ts-hide');
    receipt.el.style.position = 'absolute';
    receipt.el.style.left = THREAD_X + 'px';
    receipt.el.style.top = (stageY(5) + STAGE_H + 16) + 'px';
    root.appendChild(receipt.el);
    n.receipt = receipt;

  }

  function moveToken(stageIdx, stateText, stateCls) {
    var y = stageY(stageIdx) + 2;
    n.token.style.transform = 'translateY(' + y + 'px)';
    n.tokenState.textContent = stateText || '';
    n.tokenState.className = 'ab-token-state ' + (stateCls || '');
  }

  function pass(i) {
    n.stages[i].classList.add('is-passed');
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.axes); S.on(n.xLabel); S.on(n.yLabel); } },
    { delay: 500,  run: function() { S.on(n.quads[2]); } },
    { delay: 850,  run: function() { S.on(n.quads[3]); } },
    { delay: 1200, run: function() { S.on(n.quads[0]); } },
    { delay: 1550, run: function() { S.on(n.quads[1]); } },
    { delay: 2000, run: function() { S.on(n.threadLabel); S.on(n.spine); S.on(n.stages); S.on(n.receipt.el); } },
    { delay: 2600, run: function() { n.caseItem.classList.add('is-active'); S.on(n.token); moveToken(0, 'Checking identity'); } },
    { delay: 3300, run: function() { pass(0); moveToken(1, 'Checking role scope'); } },
    { delay: 3900, run: function() { pass(1); moveToken(2, 'Stopped: awaiting approval', 'is-human'); n.stages[2].classList.add('is-active'); n.receipt.set('blocked', 'Write blocked'); } },
    { delay: 5100, run: function() { n.stages[2].classList.remove('is-active'); pass(2); moveToken(3, 'Approved by ' + window.TPRM_CASE.roles.decider, 'is-human'); n.receipt.set('writing', 'Connector writing'); } },
    { delay: 5900, run: function() { pass(3); moveToken(4, 'Writing to ' + window.TPRM_CASE.roles.target); } },
    { delay: 6700, run: function() { pass(4); moveToken(5, 'Acknowledged by target', 'is-proof'); } },
    { delay: 7300, run: function() { pass(5); n.receipt.set('acknowledged', 'Receipt recorded'); n.token.classList.add('is-done'); } },
    { delay: 8000, run: complete }
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
      var C = window.TPRM_CASE;
      return 'A field sets need for professional judgement against action materiality. Execute within policy: retrieve approved evidence, calculate a fixed threshold. '
        + 'Prepare for review: compare evidence, draft a narrative. Named approval required: create an internal task, send an external request, update review status. '
        + 'Human decision only: accept a control exception, set residual risk, approve the provider. '
        + 'For case ' + C.id + ' the model proposes: ' + C.followUp.toLowerCase() + '. It passes identity and role scope, stops at the exact-approval gate until the '
        + C.roles.decider + ' approves, the connector writes, and the receipt turns green only after the ' + C.roles.target + ' acknowledges.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
