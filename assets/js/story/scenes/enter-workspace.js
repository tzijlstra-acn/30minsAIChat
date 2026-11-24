// Scene: enter-workspace (screen 06)
// Causal story: a short doorway into the real product, not a simulation of it. The
// wordmark appears, the role context and the current decisions load, the Workspace
// reports ready, and a cue invites the presenter to open the live product. The five acts
// the audience is about to see sit underneath. About two and a half seconds; Space skips
// the start-up and then moves on to the principle screen, which is where the presenter
// returns after the live demonstration. L opens the live product; F the captured fallback.
SceneDirector.register('enter-workspace', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var E = D.enter;
  var W = 1040, H = 520;
  var cv = null;
  var n = {};
  var done = false;

  function PC() { return window.PresenterControls || {}; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'enter-workspace' });
    n = { st: [], acts: [] };
    done = false;
    var root = cv.el;
    n.mark = S.el('div', 'ew-mark ts-hide ts-pop', null, { left: 488, top: 6, width: 64, height: 64 });
    n.mark.appendChild(S.el('span', 'ws-mark ew-mark-sq'));
    root.appendChild(n.mark);
    n.word = S.el('div', 'ew-word ts-hide', D.product, { left: 220, top: 80, width: 600 });
    root.appendChild(n.word);
    var list = S.el('div', 'ew-status', null, { left: 360, top: 138, width: 320 });
    E.statuses.forEach(function(label, i) {
      var row = S.el('div', 'ew-st ts-hide ts-left' + (i === E.statuses.length - 1 ? ' is-ready' : ''));
      row.appendChild(S.icon('ti-circle-dashed', 'ew-wait'));
      row.appendChild(S.icon('ti-circle-check', 'ew-done'));
      row.appendChild(S.el('span', null, label));
      list.appendChild(row);
      n.st.push(row);
    });
    root.appendChild(list);

    var cue = S.el('div', 'ew-cue ts-hide ts-up', null, { left: 220, top: 252, width: 600, height: 120 });
    var open = document.createElement('button');
    open.type = 'button';
    open.className = 'ew-open';
    open.appendChild(S.icon('ti-external-link'));
    open.appendChild(S.el('span', null, E.cue + ' (' + E.cueKey + ')'));
    open.addEventListener('click', function(e) { e.stopPropagation(); if (PC().openLive) PC().openLive(); });
    cue.appendChild(open);
    var fb = document.createElement('button');
    fb.type = 'button';
    fb.className = 'ew-fallback';
    fb.appendChild(S.icon('ti-photo'));
    fb.appendChild(S.el('span', null, E.fallback + ' (' + E.fallbackKey + ')'));
    fb.addEventListener('click', function(e) { e.stopPropagation(); if (typeof goToId === 'function') goToId('live-fallback'); });
    cue.appendChild(fb);
    cue.appendChild(S.el('div', 'ew-hint', E.hint));
    root.appendChild(cue);
    n.cue = cue;
    n.open = open;

    var acts = S.el('div', 'ew-acts', null, { left: 16, top: 404, width: 1008, height: 96 });
    E.acts.forEach(function(a, i) {
      var c = S.el('div', 'ew-act ts-hide ts-up');
      c.appendChild(S.el('span', 'ew-act-n', 'Act ' + (i + 1)));
      c.appendChild(S.el('span', 'ew-act-t', a));
      acts.appendChild(c);
      n.acts.push(c);
    });
    root.appendChild(acts);
  }

  function loaded(i) { n.st[i].classList.add('is-done'); }

  function complete() {
    if (done) return;
    done = true;
    if (window.NFRExperience) NFRExperience.set('live-handoff');
    S.complete(container);
  }

  var steps = [
    { delay: 40,   run: function() { if (window.NFRExperience) NFRExperience.set('entering-workspace'); S.on(n.mark); } },
    { delay: 260,  run: function() { S.on(n.word); } },
    { delay: 520,  run: function() { S.on(n.st[0]); } },
    { delay: 960,  run: function() { loaded(0); S.on(n.st[1]); } },
    { delay: 1400, run: function() { loaded(1); S.on(n.st[2]); loaded(2); } },
    { delay: 1800, run: function() { S.on(n.cue); n.open.classList.add('is-ready'); } },
    { delay: 2050, run: function() { S.on(n.acts); } },
    { delay: 2500, run: complete }
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
    // Space during the start-up finishes it; afterwards the deck moves on
    advance: function() { if (done) return false; if (cv) cv.setStatic(true); tl.finish(); return true; },
    getAccessibleSummary: function() {
      return D.product + ' starts: ' + E.statuses.join(', ').toLowerCase() + '. The presenter now opens the live product. The demonstration has five acts: '
        + E.acts.join('; ').toLowerCase() + '. A captured fallback of the same acts is available.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
