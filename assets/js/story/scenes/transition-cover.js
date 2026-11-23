// Scene: transition-cover (v2 landing)
// Causal story: a restrained workspace frame, not an AI motif. The frame and its
// navigation appear, three skeleton cards resolve into prepared decisions for one
// role, the first one is marked as needing a human decision, and the assistant column
// fills in last, beside the work. It previews the product the conversation arrives at.
SceneDirector.register('transition-cover', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 560, H = 440;
  var FRAME = { x: 10, y: 24, w: 540, h: 360 };
  var NAV_W = 96, ASSIST_W = 132, TOP = 40;
  var CARD = { x: FRAME.x + NAV_W + 14, w: FRAME.w - NAV_W - ASSIST_W - 28, h: 82, gap: 10, y: FRAME.y + TOP + 40 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'cover' });
    n = { navBars: [], cards: [], skels: [], pills: [] };
    done = false;
    var root = cv.el;

    var frame = S.el('div', 'tc-frame ts-hide', null, { left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h });
    var bar = S.el('div', 'tc-bar');
    bar.appendChild(S.el('span', 'ws-mark tc-mark-sq'));
    bar.appendChild(S.el('span', 'tc-brand', D.product));
    bar.appendChild(S.el('span', 'ws-spacer'));
    bar.appendChild(S.el('span', 'tc-role', D.role.label));
    frame.appendChild(bar);
    var nav = S.el('div', 'tc-nav');
    D.nav.slice(0, 5).forEach(function(item, i) {
      var b = S.el('div', 'tc-nav-item ts-hide' + (i === 0 ? ' is-active' : ''));
      b.appendChild(S.icon(item.icon));
      nav.appendChild(b);
      n.navBars.push(b);
    });
    frame.appendChild(nav);
    root.appendChild(frame);
    n.frame = frame;

    n.qLabel = S.el('div', 'ts-label ts-hide', 'Decisions waiting', { left: CARD.x, top: CARD.y - 26, width: CARD.w });
    root.appendChild(n.qLabel);
    D.queue.forEach(function(q, i) {
      var y = CARD.y + i * (CARD.h + CARD.gap);
      var sk = S.el('div', 'tc-skel ts-hide', null, { left: CARD.x, top: y, width: CARD.w, height: CARD.h });
      [44, 70, 56].forEach(function(w) { var line = S.el('i'); line.style.width = w + '%'; sk.appendChild(line); });
      root.appendChild(sk);
      n.skels.push(sk);
      var card = S.el('div', 'tc-card ts-hide' + (i === 0 ? ' is-next' : ''), null, { left: CARD.x, top: y, width: CARD.w, height: CARD.h });
      card.appendChild(S.el('div', 'tc-card-journey', q.journey));
      card.appendChild(S.el('div', 'tc-card-title', q.title));
      card.appendChild(S.el('div', 'tc-card-due', window.WorkspaceKit.dueLabel(q.due)));
      root.appendChild(card);
      n.cards.push(card);
    });

    var gx = CARD.x + CARD.w - 42, gy = CARD.y + 28;
    var gate = S.DecisionGate.create(null, { size: 'small' });
    gate.el.classList.add('ts-hide', 'ts-pop');
    gate.el.style.position = 'absolute';
    gate.el.style.left = gx + 'px';
    gate.el.style.top = gy + 'px';
    root.appendChild(gate.el);
    n.gate = gate;

    var ax = FRAME.x + FRAME.w - ASSIST_W;
    var assist = S.el('div', 'tc-assist ts-hide ts-right', null, { left: ax, top: FRAME.y + TOP, width: ASSIST_W, height: FRAME.h - TOP });
    var ah = S.el('div', 'tc-assist-head');
    ah.appendChild(S.icon('ti-message-circle'));
    ah.appendChild(S.el('span', null, 'NFR Assist'));
    assist.appendChild(ah);
    for (var p = 0; p < 3; p++) assist.appendChild(S.el('i', 'tc-pill'));
    root.appendChild(assist);
    n.assist = assist;

    n.foot = S.el('div', 'tc-foot ts-hide', 'Prepared for one role. Decided by a person. Recorded by the system.', { left: FRAME.x, top: FRAME.y + FRAME.h + 16, width: FRAME.w });
    root.appendChild(n.foot);
  }

  function resolve(i) { n.skels[i].classList.add('is-gone'); S.on(n.cards[i]); }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.frame); } },
    { delay: 600,  run: function() { S.on(n.navBars); S.on(n.qLabel); } },
    { delay: 1000, run: function() { S.on(n.skels); } },
    { delay: 1700, run: function() { resolve(0); } },
    { delay: 2100, run: function() { resolve(1); } },
    { delay: 2500, run: function() { resolve(2); } },
    { delay: 3100, run: function() { S.on(n.gate.el); n.gate.activate(); } },
    { delay: 3700, run: function() { S.on(n.assist); } },
    { delay: 4300, run: function() { S.on(n.foot); } },
    { delay: 4800, run: complete }
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
      return 'A restrained NFR Workspace frame for the ' + D.role.label + '. Three prepared decisions resolve in a queue: '
        + D.queue.map(function(q) { return q.journey.toLowerCase(); }).join(', ') + '. The first is marked for a human decision. '
        + 'NFR Assist sits beside the work, and the line reads: prepared for one role, decided by a person, recorded by the system.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
