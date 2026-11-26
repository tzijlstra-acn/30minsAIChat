// Scene: six-months (screen 11)
// Causal story: a nimble team of experts, six months, one live process. For the COO and
// the NFR business owner. On top, who comes (our nimble team, inside the bank) and what
// the bank brings, part-time (a role owner, a process expert, an IT and security contact).
// Then the first six months in three phases: qualify (weeks 1 to 5, gate Go), build and
// test (months 2 and 3), run live (months 4 to 6, gate Scale, then the decision). Last,
// what the COO and the business owner get.
SceneDirector.register('six-months', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var T = D.team;
  var W = 1040, H = 430;
  var OURS = { x: 16, y: 0, w: 624, h: 162 };
  var YOURS = { x: 652, y: 0, w: 372, h: 162 };
  var PH = { label: 178, y: 198, h: 140, w: 320, gap: 24 };
  var GET = { label: 354, y: 374, h: 52, w: 246, step: 254 };

  var cv = null;
  var n = {};
  var done = false;

  function phX(i) { return 16 + i * (PH.w + PH.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'six-months', refHeight: 520 });
    n = { ours: [], yours: [], phases: [], arrows: [], get: [] };
    done = false;
    var root = cv.el;

    // Who comes, and what you bring
    n.oursBox = S.el('div', 'ts-obj ts-c-ai ts-soft sm-team ts-hide ts-up', null, { left: OURS.x, top: OURS.y, width: OURS.w, height: OURS.h });
    n.oursBox.appendChild(S.el('div', 'sm-team-h ts-ink', T.oursLabel));
    T.ours.forEach(function(r) {
      var row = S.el('div', 'sm-member ts-hide');
      row.appendChild(S.icon(r.icon, 'sm-member-i'));
      row.appendChild(S.el('span', 'sm-member-r', r.role));
      row.appendChild(S.el('span', 'sm-member-x', r.text));
      n.oursBox.appendChild(row);
      n.ours.push(row);
    });
    root.appendChild(n.oursBox);
    n.yoursBox = S.el('div', 'ts-obj ts-c-human ts-soft sm-team ts-hide ts-up', null, { left: YOURS.x, top: YOURS.y, width: YOURS.w, height: YOURS.h });
    n.yoursBox.appendChild(S.el('div', 'sm-team-h ts-ink', T.yoursLabel));
    T.yours.forEach(function(r) {
      var row = S.el('div', 'sm-yours ts-hide');
      row.appendChild(S.icon(r.icon, 'sm-member-i'));
      var t = S.el('span', 'sm-yours-t');
      t.appendChild(S.el('span', 'sm-member-r', r.role));
      t.appendChild(S.el('span', 'sm-member-x', r.text));
      row.appendChild(t);
      n.yoursBox.appendChild(row);
      n.yours.push(row);
    });
    root.appendChild(n.yoursBox);

    // The first six months
    n.phLabel = root.appendChild(S.el('div', 'ts-label ts-hide', T.phasesLabel, { left: 16, top: PH.label, width: 600 }));
    T.phases.forEach(function(ph, i) {
      var b = S.el('div', 'ts-obj ts-c-' + ph.tone + ' ts-soft sm-phase ts-hide ts-up', null, { left: phX(i), top: PH.y, width: PH.w, height: PH.h });
      b.appendChild(S.el('div', 'sm-when ts-ink', ph.when));
      b.appendChild(S.el('div', 'sm-phase-t', ph.label));
      var ul = S.el('ul', 'sc-list sm-list');
      ph.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      var gate = S.el('div', 'sm-gate' + (/^Gate/.test(ph.gate) ? ' is-gate' : ''));
      gate.appendChild(S.icon(/^Gate/.test(ph.gate) ? 'ti-diamond' : 'ti-users'));
      gate.appendChild(S.el('span', null, ph.gate));
      b.appendChild(gate);
      root.appendChild(b);
      n.phases.push(b);
      if (i < T.phases.length - 1) {
        var a = S.el('div', 'ab-arrow ts-hide', null, { left: phX(i) + PH.w, top: PH.y + PH.h / 2 - 10, width: PH.gap, height: 20 });
        a.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(a);
        n.arrows.push(a);
      }
    });

    // What they get
    n.getLabel = root.appendChild(S.el('div', 'ts-label ts-hide', T.getLabel, { left: 16, top: GET.label, width: 600 }));
    T.get.forEach(function(t, i) {
      var b = S.el('div', 'ts-obj ts-c-proof sm-get ts-hide ts-up', null, { left: 16 + i * GET.step, top: GET.y, width: GET.w, height: GET.h });
      b.appendChild(S.icon('ti-circle-check', 'sm-get-i'));
      b.appendChild(S.el('span', 'sm-get-t', t));
      root.appendChild(b);
      n.get.push(b);
    });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 150, run: function() { S.on(n.oursBox); } }
  ];
  T.ours.forEach(function(r, i) { steps.push({ delay: 300 + i * 110, run: function() { S.on(n.ours[i]); } }); });
  steps.push({ delay: 950, run: function() { S.on(n.yoursBox); } });
  T.yours.forEach(function(r, i) { steps.push({ delay: 1100 + i * 120, run: function() { S.on(n.yours[i]); } }); });
  steps.push({ delay: 1600, run: function() { S.on(n.phLabel); } });
  T.phases.forEach(function(ph, i) { steps.push({ delay: 1750 + i * 450, run: function() { S.on(n.phases[i]); if (i) S.on(n.arrows[i - 1]); } }); });
  var t1 = 1750 + T.phases.length * 450 + 150;
  steps.push({ delay: t1, run: function() { S.on(n.getLabel); } });
  T.get.forEach(function(g, i) { steps.push({ delay: t1 + 150 + i * 150, run: function() { S.on(n.get[i]); } }); });
  steps.push({ delay: t1 + 150 + T.get.length * 150 + 300, run: complete });
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
      return T.oursLabel + ': ' + T.ours.map(function(r) { return r.role + ', ' + r.text.toLowerCase(); }).join('; ') + '. '
        + T.yoursLabel + ': ' + T.yours.map(function(r) { return r.role + ', ' + r.text.toLowerCase(); }).join('; ') + '. '
        + T.phasesLabel + ': ' + T.phases.map(function(ph) { return ph.when + ', ' + ph.label + ': ' + ph.items.join(', ').toLowerCase() + '; ' + ph.gate.toLowerCase(); }).join('. ') + '. '
        + T.getLabel + ': ' + T.get.join(', ').toLowerCase() + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
