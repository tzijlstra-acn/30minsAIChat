// Scene: workspace-boot (v2 screen 06)
// Causal story: the narrative gives way to an application. The frame and wordmark
// appear, the role resolves, four kinds of context load one by one (role and
// permissions, approved applications, connected evidence, control policies and case
// state) and the Workspace reports ready. Skeleton cards resolve into the decision
// queue, and NFR Assist arrives last: work, case and controls exist before the chat.
// About 2.3 seconds. Space or Skip finishes it; R replays it.
SceneDirector.register('workspace-boot', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var K = window.WorkspaceKit;
  var D = window.NFR_WORKSPACE_DEMO;

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, K.W, K.H, { id: 'ws-boot', maxScale: 1.4 });
    n = { statuses: [], skels: [] };
    done = false;
    var sh = K.shell(cv.el, { active: 'home', assist: 'panel' });
    n.shell = sh;
    sh.app.classList.add('wb-app');

    // Application chrome loads after the boot panel
    K.hide([sh.top, sh.nav]);
    K.hide(sh.assist, 'ts-right');

    // Skeleton cards, replaced by the real queue
    var skel = S.el('div', 'wb-skels');
    for (var i = 0; i < 3; i++) {
      var sc = S.el('div', 'ws-skel ts-hide');
      [38, 62, 90, 74].forEach(function(w) { var bar = S.el('i'); bar.style.width = w + '%'; sc.appendChild(bar); });
      skel.appendChild(sc);
      n.skels.push(sc);
    }
    sh.main.appendChild(skel);
    n.skel = skel;

    var q = K.home(sh.main, { onOpen: function() { K.goScreen('workspace-journey'); } });
    q.el.classList.add('wb-queue');
    K.hide(q.head);
    q.parts.forEach(function(c) { K.hide(c, 'ts-up'); });
    n.queue = q;

    n.assist = K.assistPanel(sh.assist, {});

    // Boot panel, centred on the application
    var boot = S.el('div', 'wb-boot');
    var mark = S.el('div', 'wb-wordmark ts-hide ts-pop');
    mark.appendChild(S.el('span', 'ws-mark'));
    mark.appendChild(S.el('span', 'wb-name', D.product));
    boot.appendChild(mark);
    n.mark = mark;
    n.badge = K.chip(D.syntheticLabel, 'human', 'ti-flask');
    n.badge.classList.add('wb-badge', 'ts-hide');
    boot.appendChild(n.badge);
    var roleLine = S.el('div', 'wb-role ts-hide');
    roleLine.appendChild(S.el('span', 'wb-role-k', D.boot.roleContext));
    roleLine.appendChild(S.el('span', 'wb-role-sep', '·'));
    roleLine.appendChild(S.el('span', 'wb-role-v', D.role.label));
    boot.appendChild(roleLine);
    n.role = roleLine;
    var list = S.el('ul', 'wb-status');
    D.boot.statuses.forEach(function(label) {
      var li = S.el('li', 'wb-st ts-hide ts-left');
      li.appendChild(S.icon('ti-circle-dashed', 'wb-st-wait'));
      li.appendChild(S.icon('ti-circle-check', 'wb-st-done'));
      li.appendChild(S.el('span', null, label));
      list.appendChild(li);
      n.statuses.push(li);
    });
    boot.appendChild(list);
    n.ready = S.el('div', 'wb-ready ts-hide', D.boot.ready);
    boot.appendChild(n.ready);
    var skip = K.btn('Skip start-up', { kind: 'ghost', icon: 'ti-player-skip-forward', onClick: function() { finishNow(); } });
    skip.classList.add('wb-skip');
    boot.appendChild(skip);
    n.skip = skip;
    sh.app.appendChild(boot);
    n.boot = boot;
  }

  function loaded(i) { n.statuses[i].classList.add('is-done'); }

  function complete() {
    if (done) return;
    done = true;
    K.setState('workspace-home');
    S.complete(container);
  }

  var steps = [
    { delay: 50,   run: function() { K.setState('booting'); n.shell.app.classList.add('is-framed'); } },
    { delay: 120,  run: function() { S.on(n.mark); } },
    { delay: 380,  run: function() { S.on(n.badge); S.on(n.role); } },
    { delay: 560,  run: function() { S.on(n.statuses[0]); } },
    { delay: 760,  run: function() { loaded(0); S.on(n.statuses[1]); } },
    { delay: 960,  run: function() { loaded(1); S.on(n.statuses[2]); } },
    { delay: 1160, run: function() { loaded(2); S.on(n.statuses[3]); } },
    { delay: 1360, run: function() { loaded(3); } },
    { delay: 1460, run: function() { S.on(n.ready); n.boot.classList.add('is-ready'); } },
    { delay: 1680, run: function() { n.boot.classList.add('is-gone'); S.on([n.shell.top, n.shell.nav]); S.on(n.skels); } },
    { delay: 1900, run: function() { n.skel.classList.add('is-gone'); S.on(n.queue.head); S.on(n.queue.parts); } },
    { delay: 2150, run: function() { S.on(n.shell.assist); } },
    { delay: 2400, run: complete }
  ];
  var tl = createTimeline(steps);

  function finishNow() { if (cv) cv.setStatic(true); tl.finish(); }

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
    // Space during start-up skips to the ready Workspace; afterwards the deck moves on
    advance: function() { if (done) return false; finishNow(); return true; },
    getAccessibleSummary: function() {
      return 'The NFR Workspace starts up for the ' + D.role.label + ', a synthetic demonstration. Start-up steps: '
        + D.boot.statuses.join(', ').toLowerCase() + ', then the Workspace reports ready. The decision-first home appears: one decision now and '
        + D.home.next.length + ' next, and NFR Assist opens last, beside the work.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
