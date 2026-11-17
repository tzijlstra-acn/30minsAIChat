// Scene: role-workspace (Screen 05)
// Causal story: the workspace ranks the officer's cases by urgency and readiness,
// selects the cloud-provider review, opens its already prepared evidence thread, and
// the professional challenges the proposed action instead of searching for sources.
// The role shift is explicit: before, search and re-key; after, inspect, challenge,
// decide and own follow-up. Accountability never moves to the model.
SceneDirector.register('role-workspace', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var FRAME = { x: 0, y: 0, w: 1040, h: 376 };
  var Q = { x: 16, y: 74, w: 290 };
  var D = { x: 322, y: 56, w: 380, h: 306 };
  var E = { x: 718, y: 56, w: 306, h: 306 };
  var ITEM_H = 72, ITEM_GAP = 8;

  var BEFORE = ['Search', 'Chase', 'Reconcile', 'Merge', 'Draft', 'Re-key'];
  var AFTER = ['Inspect change', 'Test evidence', 'Challenge uncertainty', 'Decide', 'Own follow-up'];

  var cv = null;
  var n = {};
  var done = false;

  // Queue starts unranked, then sorts so the case due today is first
  var START_ORDER = [2, 0, 1];

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'role-workspace' });
    n = { items: [], evidence: [], before: [], after: [], cells: [] };
    done = false;
    var C = window.TPRM_CASE;
    var root = cv.el;

    // Workspace frame: a real system boundary with an app bar
    var frame = S.el('div', 'rw-frame ts-hide', null, { left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h });
    var bar = S.el('div', 'rw-bar');
    bar.appendChild(S.el('span', 'rw-brand', 'NFR OS'));
    bar.appendChild(S.el('span', 'ts-label', 'Third-party risk'));
    bar.appendChild(S.el('span', 'rw-today', 'Today'));
    var spacer = S.el('span', 'rw-spacer');
    bar.appendChild(spacer);
    bar.appendChild(S.el('span', 'ts-chip ts-c-human', C.label));
    var user = S.el('span', 'rw-user');
    user.appendChild(S.icon('ti-user'));
    user.appendChild(S.el('span', null, C.roles.decider));
    bar.appendChild(user);
    frame.appendChild(bar);
    root.appendChild(frame);
    n.frame = frame;

    // Pane 1: prioritised work queue
    n.qLabel = S.el('div', 'ts-label ts-hide', 'Ranked by urgency and readiness', { left: Q.x, top: 56, width: Q.w });
    root.appendChild(n.qLabel);
    C.queue.forEach(function(q, i) {
      var item = S.el('div', 'rw-item ts-hide' + (i === 0 ? ' rw-item-next' : ''), null, { left: Q.x, top: Q.y + 12, width: Q.w, height: ITEM_H });
      var txt = S.el('div', 'rw-item-text');
      txt.appendChild(S.el('div', 'rw-item-title', q.title));
      txt.appendChild(S.el('div', 'ts-text', q.meta));
      txt.appendChild(S.el('div', 'ts-note rw-item-id', q.id));
      item.appendChild(txt);
      item.appendChild(S.el('span', 'ts-chip rw-state rw-state-' + q.state.toLowerCase(), q.state));
      root.appendChild(item);
      n.items.push(item);
    });
    n.bg = S.el('div', 'ts-note ts-hide', (C.queue.length - 1) + ' others prepared in the background', { left: Q.x, top: Q.y + 12 + 3 * (ITEM_H + ITEM_GAP) + 8, width: Q.w });
    root.appendChild(n.bg);

    // Pane 2: next decision with material changes
    var dp = S.el('div', 'ts-obj ts-c-human rw-pane ts-hide', null, { left: D.x, top: D.y, width: D.w, height: D.h });
    var dh = S.el('div', 'rw-pane-head');
    dh.appendChild(S.el('span', 'ts-label ts-ink ts-c-ai', 'Next decision'));
    dh.appendChild(S.el('span', 'ts-chip ts-c-human', 'Needs judgement'));
    dp.appendChild(dh);
    dp.appendChild(S.el('div', 'rw-question', C.question));
    var list = S.el('div', 'rw-changes');
    C.changes.forEach(function(ch) {
      var r = S.el('div', 'rw-change');
      r.appendChild(S.el('span', null, ch.title));
      r.appendChild(S.el('span', 'ts-chip ts-c-ai', ch.tag));
      list.appendChild(r);
    });
    dp.appendChild(list);
    S.UncertaintyBadge.create(dp, { label: 'Missing: ' + C.missing[0].title });
    var prop = S.el('div', 'rw-proposed');
    prop.appendChild(S.el('span', 'ts-label ts-ink ts-c-ai', 'Proposed'));
    prop.appendChild(S.el('span', 'rw-proposed-text', C.proposedAction));
    dp.appendChild(prop);
    // The professional challenges the proposal rather than hunting for sources
    n.challenge = S.el('div', 'rw-challenge ts-hide ts-pop');
    n.challenge.appendChild(S.icon('ti-user-check'));
    n.challenge.appendChild(S.el('span', null, 'Challenge: ' + C.challenge));
    dp.appendChild(n.challenge);
    root.appendChild(dp);
    n.decision = dp;

    // Pane 3: evidence thread and control boundary
    var ep = S.el('div', 'ts-obj ts-c-proof rw-pane ts-hide', null, { left: E.x, top: E.y, width: E.w, height: E.h });
    var eh = S.el('div', 'rw-pane-head');
    eh.appendChild(S.el('span', 'ts-label ts-ink ts-c-proof', 'Evidence thread'));
    var total = C.changes.length + C.missing.length;
    eh.appendChild(S.el('span', 'ts-chip ts-c-proof', total + ' sources'));
    ep.appendChild(eh);
    var meter = S.el('div', 'rw-meter');
    for (var i = 0; i < total; i++) meter.appendChild(S.el('span', i < C.changes.length ? 'rw-meter-in' : 'rw-meter-gap'));
    ep.appendChild(meter);
    ep.appendChild(S.el('div', 'ts-note', C.changes.length + ' in hand, ' + C.missing.length + ' missing'));
    C.changes.forEach(function(ch) {
      var chip = S.EvidenceChip.create(ep, { label: ch.evidence, state: ch.evidenceState, stateLabel: ch.evidenceState });
      chip.el.classList.add('rw-ev', 'ts-hide', 'ts-left');
      n.evidence.push(chip.el);
    });
    var mchip = S.EvidenceChip.create(ep, { label: C.missing[0].title, state: 'missing', stateLabel: 'Missing' });
    mchip.el.classList.add('rw-ev', 'ts-hide', 'ts-left');
    n.evidence.push(mchip.el);
    // Control boundary at the foot of the evidence pane
    var cb = S.el('div', 'rw-boundary ts-hide');
    [['Decision', 'Human'], ['Write', 'Gated'], ['Complete', 'On receipt']].forEach(function(c) {
      var cell = S.el('div', 'rw-cell');
      cell.appendChild(S.el('div', 'ts-text', c[0]));
      cell.appendChild(S.el('div', 'ts-label ts-ink ' + (c[0] === 'Complete' ? 'ts-c-proof' : 'ts-c-human'), c[1]));
      cb.appendChild(cell);
    });
    ep.appendChild(cb);
    n.boundary = cb;
    root.appendChild(ep);
    n.evidencePane = ep;

    // Role shift strip
    var shiftY = 404;
    n.beforeLabel = S.el('div', 'ts-label ts-hide', 'Before', { left: 16, top: shiftY + 6, width: 70 });
    n.afterLabel = S.el('div', 'ts-label ts-ink ts-c-human ts-hide', 'After', { left: 16, top: shiftY + 54, width: 70 });
    root.appendChild(n.beforeLabel);
    root.appendChild(n.afterLabel);
    var bx = 92;
    BEFORE.forEach(function(b) {
      var chip = S.el('span', 'ts-chip ts-c-neutral rw-before ts-hide', b, { left: bx, top: shiftY });
      root.appendChild(chip);
      n.before.push(chip);
      bx += b.length * 8 + 38;
    });
    var ax = 92;
    AFTER.forEach(function(a) {
      var chip = S.el('span', 'ts-chip ts-c-human rw-after ts-hide ts-up', a, { left: ax, top: shiftY + 48 });
      root.appendChild(chip);
      n.after.push(chip);
      ax += a.length * 8 + 38;
    });
    n.owner = S.el('div', 'ts-note ts-hide', 'Accountability stays with the professional', { left: 92, top: shiftY + 92 });
    root.appendChild(n.owner);
  }

  function placeQueue(order) {
    order.forEach(function(itemIdx, slot) {
      n.items[itemIdx].style.transform = 'translateY(' + (slot * (ITEM_H + ITEM_GAP)) + 'px)';
    });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.frame); S.on(n.qLabel); placeQueue(START_ORDER); } },
    { delay: 600,  run: function() { S.on(n.items); } },
    { delay: 1500, run: function() { placeQueue([0, 1, 2]); } },
    { delay: 2200, run: function() { n.items[0].classList.add('is-selected'); S.on(n.bg); } },
    { delay: 2700, run: function() { S.on(n.decision); } },
    { delay: 3300, run: function() { S.on(n.evidencePane); } },
    { delay: 3500, run: function() { S.on(n.evidence[0]); } },
    { delay: 3700, run: function() { S.on(n.evidence[1]); } },
    { delay: 3900, run: function() { S.on(n.evidence[2]); } },
    { delay: 4100, run: function() { S.on(n.evidence[3]); } },
    { delay: 4800, run: function() { S.on(n.challenge); } },
    { delay: 5500, run: function() { S.on(n.boundary); } },
    { delay: 6300, run: function() { S.on(n.beforeLabel); S.on(n.before); } },
    { delay: 6900, run: function() { n.before.forEach(function(b) { b.classList.add('is-struck'); }); } },
    { delay: 7400, run: function() { S.on(n.afterLabel); S.on(n.after); } },
    { delay: 8000, run: function() { S.on(n.owner); } },
    { delay: 8600, run: complete }
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
      return 'Role workspace for the ' + C.roles.decider + '. The queue ranks ' + C.queue.length + ' items by urgency and readiness and selects ' + C.id + ', '
        + C.queue[0].title.toLowerCase() + ', due today; the others are prepared in the background. '
        + 'The next decision shows the material changes, the missing ' + C.missing[0].title.toLowerCase() + ' and the proposed action. '
        + 'The evidence thread shows ' + C.changes.length + ' sources in hand and ' + C.missing.length + ' missing. '
        + 'Control boundary: decision human, write gated, complete on receipt. '
        + 'Before: search, chase, reconcile, merge, draft and re-key. After: inspect change, test evidence, challenge uncertainty, decide and own follow-up.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
