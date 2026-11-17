// Scene: connection-work (Screen 02)
// Causal story: the case moves through one corridor (find, reconcile, coordinate,
// re-enter, judge). It waits at every handover, is sent back once for missing
// evidence, and reaches the judgement window late. The value pool is effort plus
// waiting plus rework. Proportions are illustrative, never client figures.
SceneDirector.register('connection-work', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;

  var STAGES = [
    { label: 'Find',       role: 'Third-Party Risk',   x: 16,  c: 'data'  },
    { label: 'Reconcile',  role: 'Third-Party Risk',   x: 226, c: 'data'  },
    { label: 'Coordinate', role: 'Owner and specialist', x: 436, c: 'data' },
    { label: 'Re-enter',   role: 'Third-Party Risk',   x: 646, c: 'data'  },
    { label: 'Judge',      role: 'Officer and approver', x: 856, c: 'human' }
  ];
  var STAGE_W = 156, STAGE_TOP = 52, STAGE_H = 84;
  var WAITS = ['Waiting for owner', 'Waiting for specialist', 'Waiting for re-entry', 'Waiting for package'];
  var TOKEN_Y = 158;

  // Illustrative proportions of one review: shape only, no numbers shown
  var BASELINE = [
    { label: 'Direct effort', share: 0.42, cls: 'cw-seg-effort' },
    { label: 'Waiting time',  share: 0.30, cls: 'cw-seg-wait' },
    { label: 'Rework',        share: 0.13, cls: 'cw-seg-rework' },
    { label: 'Judgement',     share: 0.15, cls: 'cw-seg-judge' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function stageCentre(i) { return STAGES[i].x + STAGE_W / 2; }
  function gapCentre(i) { return STAGES[i].x + STAGE_W + (STAGES[i + 1].x - STAGES[i].x - STAGE_W) / 2; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'connection-work' });
    n = { stages: [], waits: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.corridor = S.el('div', 'ts-label ts-hide', 'One periodic review, end to end', { left: 16, top: 14 });
    root.appendChild(n.corridor);

    STAGES.forEach(function(st, i) {
      var box = S.el('div', 'ts-obj cw-stage ts-c-' + st.c + (st.c === 'human' ? ' ts-soft' : '') + ' ts-hide ts-up', null,
        { left: st.x, top: STAGE_TOP, width: i === 4 ? 168 : STAGE_W, height: STAGE_H });
      box.appendChild(S.el('div', 'ts-label', st.role));
      box.appendChild(S.el('div', 'ts-title cw-stage-name' + (st.c === 'human' ? ' ts-ink' : ''), st.label));
      root.appendChild(box);
      n.stages.push(box);
      if (i < 4) {
        var gx = STAGES[i].x + STAGE_W + 4;
        var gw = STAGES[i + 1].x - STAGES[i].x - STAGE_W - 8;
        var wait = S.el('div', 'cw-wait ts-hide', null, { left: gx, top: STAGE_TOP + 18, width: gw, height: STAGE_H - 36 });
        var wicon = S.icon('ti-clock');
        wait.appendChild(wicon);
        root.appendChild(wait);
        n.waits.push(wait);
      }
    });

    // One callout at a time explains what the case is waiting for
    n.callout = S.el('div', 'ts-label cw-callout ts-hide', '', { left: 16, top: 200 });
    root.appendChild(n.callout);

    // Rework loop from specialist challenge back to Third-Party Risk
    n.rework = S.path(g, 'M' + stageCentre(2) + ' ' + (STAGE_TOP + STAGE_H + 4) + ' C' + stageCentre(2) + ' 240 ' + stageCentre(0) + ' 240 ' + stageCentre(0) + ' ' + (STAGE_TOP + STAGE_H + 4), 'ts-s-gap cw-rework', cv.marker('gap'));
    n.reworkLabel = S.el('div', 'ts-label ts-ink ts-c-gap ts-hide', 'Missing evidence: back to Third-Party Risk', { left: stageCentre(0) + 30, top: 232 });
    root.appendChild(n.reworkLabel);

    // Elapsed review time, with the judgement window at the end
    var track = S.el('div', 'cw-track ts-hide', null, { left: 16, top: 286, width: 1008, height: 8 });
    n.fill = S.el('div', 'cw-track-fill');
    track.appendChild(n.fill);
    track.appendChild(S.el('div', 'cw-track-window'));
    root.appendChild(track);
    n.track = track;
    n.trackLabel = S.el('div', 'ts-label ts-hide', 'Elapsed review time', { left: 16, top: 300 });
    n.windowLabel = S.el('div', 'ts-label ts-ink ts-c-human ts-hide', 'Judgement window', { left: 878, top: 300 });
    root.appendChild(n.trackLabel);
    root.appendChild(n.windowLabel);

    // The case itself, read from TPRM_CASE
    var badge = S.CaseBadge.create(null, { compact: true, state: 'incomplete' });
    badge.el.classList.add('cw-token', 'ts-hide');
    badge.el.style.position = 'absolute';
    badge.el.style.left = '0px';
    badge.el.style.top = TOKEN_Y + 'px';
    root.appendChild(badge.el);
    n.token = badge;

    // Baseline strip: where one review's time goes
    n.baseTitle = S.el('div', 'ts-label ts-hide', 'Where one review goes. Illustrative proportions, baseline measured with the client', { left: 16, top: 356 });
    root.appendChild(n.baseTitle);
    var x = 16;
    n.segs = [];
    BASELINE.forEach(function(b) {
      var w = Math.round(1008 * b.share);
      var seg = S.el('div', 'cw-seg ' + b.cls + ' ts-hide', null, { left: x, top: 382, width: w - 4, height: 34 });
      var lbl = S.el('div', 'cw-seg-label', b.label, { left: x, top: 424, width: w - 4 });
      lbl.classList.add('ts-hide');
      root.appendChild(seg);
      root.appendChild(lbl);
      n.segs.push(seg, lbl);
      x += w;
    });
    n.valueBrace = S.el('div', 'cw-brace ts-hide', null, { left: 16, top: 456, width: Math.round(1008 * 0.85) - 4, height: 10 });
    n.valueLabel = S.el('div', 'ts-label ts-ink ts-c-ai ts-hide', 'Value pool: effort plus waiting plus rework', { left: 16, top: 474 });
    root.appendChild(n.valueBrace);
    root.appendChild(n.valueLabel);
  }

  // Centre the case token on x, kept inside the canvas
  function moveToken(x, progress) {
    var w = n.token.el.offsetWidth || 200;
    var left = Math.max(16, Math.min(W - 16 - w, x - w / 2));
    n.token.el.style.transform = 'translateX(' + Math.round(left) + 'px)';
    n.fill.style.width = Math.round(progress * 100) + '%';
  }

  function say(text, x, cls) {
    n.callout.textContent = text;
    n.callout.style.left = Math.max(16, Math.min(W - 300, x - 90)) + 'px';
    n.callout.className = 'ts-label cw-callout ts-hide ts-on ' + (cls || '');
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.corridor); S.on(n.stages); S.on(n.track); S.on(n.trackLabel); S.on(n.windowLabel); } },
    { delay: 700,  run: function() { S.on(n.token.el); moveToken(stageCentre(0), 0.06); } },
    { delay: 1500, run: function() { S.on(n.waits[0]); moveToken(gapCentre(0), 0.2); say(WAITS[0], gapCentre(0)); } },
    { delay: 2300, run: function() { moveToken(stageCentre(1), 0.28); } },
    { delay: 2900, run: function() { S.on(n.waits[1]); moveToken(gapCentre(1), 0.38); say(WAITS[1], gapCentre(1)); } },
    { delay: 3600, run: function() { moveToken(stageCentre(2), 0.46); } },
    { delay: 4300, run: function() { S.on(n.rework); S.on(n.reworkLabel); moveToken(stageCentre(0), 0.56); say('', 0); n.callout.classList.remove('ts-on'); } },
    { delay: 5200, run: function() { moveToken(stageCentre(2), 0.66); } },
    { delay: 5800, run: function() { S.on(n.waits[2]); moveToken(gapCentre(2), 0.74); say(WAITS[2], gapCentre(2)); } },
    { delay: 6400, run: function() { moveToken(stageCentre(3), 0.8); } },
    { delay: 6900, run: function() { S.on(n.waits[3]); moveToken(gapCentre(3), 0.86); say(WAITS[3], gapCentre(3)); } },
    { delay: 7500, run: function() { moveToken(stageCentre(4), 0.94); say('Judgement starts late', stageCentre(4) - 40, 'ts-ink ts-c-human'); n.stages[4].classList.add('is-late'); } },
    { delay: 8000, run: function() { S.on(n.baseTitle); S.on(n.segs); } },
    { delay: 8500, run: function() { S.on(n.valueBrace); S.on(n.valueLabel); } },
    { delay: 9000, run: complete }
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
      return 'Case ' + (c ? c.id : '') + ' moves through one periodic review: find, reconcile, coordinate, re-enter and judge. '
        + 'It waits at every handover, is sent back once from specialist challenge for missing evidence, and reaches the judgement window late. '
        + 'An illustrative baseline strip splits one review into direct effort, waiting time, rework and judgement time. '
        + 'The value pool is effort plus waiting plus rework.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
