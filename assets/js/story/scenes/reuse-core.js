// Scene: reuse-core (Screen 10)
// Causal story: the TPRM journey builds each shared component, one by one. When the
// next journey (RCSA) arrives, the shared core stays in place and is reused; only the
// new domain layer grows. The first process proves value; reuse creates the operating
// system. Effort bars show shape only: illustrative, no figures.
SceneDirector.register('reuse-core', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var L = { x: 16, w: 262 };
  var C = { x: 334, w: 372 };
  var R = { x: 762, w: 262 };
  var CORE_TOP = 44, CORE_STEP = 56, CORE_H = 46;

  var CORE = [
    { label: 'Role workspace and work queue', icon: 'ti-layout-dashboard' },
    { label: 'Persistent case and process state', icon: 'ti-database' },
    { label: 'Evidence objects and semantics', icon: 'ti-file-check' },
    { label: 'Decisions and approvals', icon: 'ti-user-check' },
    { label: 'Connectors and receipts', icon: 'ti-plug' },
    { label: 'Evaluation and routing', icon: 'ti-route' },
    { label: 'Identity, authority, audit and monitoring', icon: 'ti-shield-check' }
  ];
  var TPRM_DOMAIN = ['Provider objects', 'Due-diligence evidence', 'TPRM stages'];
  var NEXT_DOMAIN = ['RCSA stages', 'Risk appetite and rating', 'Challenge and sign-off rules', 'Additional data feeds'];

  var cv = null;
  var n = {};
  var done = false;

  function coreY(i) { return CORE_TOP + i * CORE_STEP; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'reuse-core' });
    n = { core: [], status: [], built: [], reused: [], nextChips: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // Journey one: TPRM periodic review
    var left = S.el('div', 'ts-obj ts-c-data rc-journey ts-hide ts-left', null, { left: L.x, top: 60, width: L.w, height: 230 });
    left.appendChild(S.el('div', 'ts-label ts-ink', 'Journey 1'));
    left.appendChild(S.el('div', 'rc-journey-title', 'TPRM periodic review'));
    left.appendChild(S.el('div', 'ts-note', 'Adds domain logic'));
    TPRM_DOMAIN.forEach(function(d) { left.appendChild(S.el('div', 'ts-chip ts-c-data rc-domain', d)); });
    root.appendChild(left);
    n.left = left;

    // Shared core, built once
    var core = S.el('div', 'rc-core ts-hide', null, { left: C.x, top: 8, width: C.w, height: coreY(6) + CORE_H + 14 - 8 });
    root.appendChild(core);
    n.coreBox = core;
    n.coreLabel = S.el('div', 'ts-label ts-ink ts-c-proof ts-hide', 'Shared core, built once', { left: C.x + 16, top: 16 });
    root.appendChild(n.coreLabel);
    CORE.forEach(function(c, i) {
      var row = S.el('div', 'rc-comp ts-hide ts-pop', null, { left: C.x + 14, top: coreY(i), width: C.w - 28, height: CORE_H });
      row.appendChild(S.icon(c.icon));
      row.appendChild(S.el('span', 'rc-comp-label', c.label));
      var st = S.el('span', 'rc-status', 'Built by TPRM');
      row.appendChild(st);
      root.appendChild(row);
      n.core.push(row);
      n.status.push(st);
      var y = coreY(i) + CORE_H / 2;
      n.built.push(S.path(g, 'M' + (L.x + L.w + 2) + ' 175 C' + (L.x + L.w + 30) + ' 175 ' + (C.x - 26) + ' ' + y + ' ' + (C.x + 12) + ' ' + y, 'ts-s-data rc-link'));
      n.reused.push(S.path(g, 'M' + (R.x - 2) + ' 175 C' + (R.x - 30) + ' 175 ' + (C.x + C.w + 26) + ' ' + y + ' ' + (C.x + C.w - 12) + ' ' + y, 'ts-s-proof rc-link'));
    });

    // Journey two: RCSA or next journey, adds mainly domain logic
    var right = S.el('div', 'ts-obj ts-c-data ts-dash rc-journey ts-hide ts-right', null, { left: R.x, top: 60, width: R.w, height: 230 });
    right.appendChild(S.el('div', 'ts-label ts-ink', 'Journey 2'));
    right.appendChild(S.el('div', 'rc-journey-title', 'RCSA or next journey'));
    right.appendChild(S.el('div', 'ts-note', 'Adds mainly domain logic'));
    NEXT_DOMAIN.forEach(function(d) {
      var chip = S.el('div', 'ts-chip ts-c-data rc-domain ts-hide ts-up', d);
      right.appendChild(chip);
      n.nextChips.push(chip);
    });
    root.appendChild(right);
    n.right = right;

    // Effort shape: journey one builds core plus domain; journey two mainly domain
    n.effortLabel = S.el('div', 'ts-label ts-hide', 'Build effort, illustrative shape', { left: L.x, top: 326 });
    root.appendChild(n.effortLabel);
    var e1 = S.el('div', 'rc-effort ts-hide', null, { left: L.x, top: 352, width: L.w, height: 22 });
    e1.appendChild(S.el('span', 'rc-eff-core'));
    e1.appendChild(S.el('span', 'rc-eff-domain'));
    root.appendChild(e1);
    n.e1 = e1;
    n.e1Label = S.el('div', 'ts-note ts-hide', 'Shared core + TPRM domain', { left: L.x, top: 382, width: L.w });
    root.appendChild(n.e1Label);

    n.effortLabel2 = S.el('div', 'ts-label ts-hide', 'Build effort, illustrative shape', { left: R.x, top: 326 });
    root.appendChild(n.effortLabel2);
    var e2 = S.el('div', 'rc-effort rc-effort-2 ts-hide', null, { left: R.x, top: 352, width: R.w, height: 22 });
    e2.appendChild(S.el('span', 'rc-eff-reused'));
    e2.appendChild(S.el('span', 'rc-eff-domain'));
    root.appendChild(e2);
    n.e2 = e2;
    n.e2Label = S.el('div', 'ts-note ts-hide', 'Core reused + new domain logic', { left: R.x, top: 382, width: R.w });
    root.appendChild(n.e2Label);
  }

  function buildComp(i) {
    S.on(n.core[i]);
    S.on(n.built[i]);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.left); S.on(n.coreBox); S.on(n.coreLabel); } },
    { delay: 700,  run: function() { buildComp(0); } },
    { delay: 1000, run: function() { buildComp(1); } },
    { delay: 1300, run: function() { buildComp(2); } },
    { delay: 1600, run: function() { buildComp(3); } },
    { delay: 1900, run: function() { buildComp(4); } },
    { delay: 2200, run: function() { buildComp(5); } },
    { delay: 2500, run: function() { buildComp(6); } },
    { delay: 3100, run: function() { S.on([n.effortLabel, n.e1, n.e1Label]); } },
    { delay: 3900, run: function() { S.on(n.right); } },
    { delay: 4500, run: function() {
      S.on(n.reused);
      n.core.forEach(function(c) { c.classList.add('is-reused'); });
      n.status.forEach(function(s) { s.textContent = 'Reused'; });
    } },
    { delay: 5300, run: function() { S.on(n.nextChips); } },
    { delay: 6200, run: function() { S.on([n.effortLabel2, n.e2, n.e2Label]); } },
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
      return 'The TPRM periodic review builds seven shared components once: ' + CORE.map(function(c) { return c.label.toLowerCase(); }).join('; ')
        + '. It adds TPRM domain logic: ' + TPRM_DOMAIN.join(', ').toLowerCase() + '. When RCSA or the next journey arrives, the shared core is reused and only new domain logic grows: '
        + NEXT_DOMAIN.join(', ').toLowerCase() + '. Illustrative effort bars show journey two building mainly domain logic.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
