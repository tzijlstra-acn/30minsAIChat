// Scene: next-decision (screen 12)
// Causal story: at month six, on the evidence, two decisions. The evidence first: measures
// met, controls proven, the team working in it every day. Then decision 1, expand: which
// NFR teams and tasks come next, each reusing the core, the connectors and the methods.
// Decision 2, choose who runs it: managed services led by Accenture, or in-house
// maintenance after enablement; or start managed and move in-house. Commercial terms are
// agreed separately and are not on this screen.
SceneDirector.register('next-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.decide;
  var W = 1040, H = 376;
  var EV = { y: 0, h: 46 };
  var BOX = { y: 64, h: 300, w: 500 };
  var L = { x: 16 }, Rt = { x: 524 };

  var cv = null;
  var n = {};
  var done = false;

  function head(box, k, icon, label) {
    var h = S.el('div', 'nd-head ts-ink');
    h.appendChild(S.el('span', 'nd-num', k));
    h.appendChild(S.icon(icon));
    h.appendChild(S.el('span', 'nd-head-t', label));
    box.appendChild(h);
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'next-decision', refHeight: 520 });
    n = { rows: [], opts: [] };
    done = false;
    var root = cv.el;

    // On the evidence of the first six months
    n.ev = S.el('div', 'ts-obj ts-c-neutral ts-soft nd-ev ts-hide ts-up', null, { left: 16, top: EV.y, width: 1008, height: EV.h });
    n.ev.appendChild(S.el('span', 'nd-ev-k', X.evidenceLabel));
    X.evidence.forEach(function(t) {
      var c = S.el('span', 'nd-ev-i');
      c.appendChild(S.icon('ti-checks'));
      c.appendChild(S.el('span', null, t));
      n.ev.appendChild(c);
    });
    root.appendChild(n.ev);

    // 1 Expand
    n.expand = S.el('div', 'ts-obj ts-c-proof ts-soft nd-box ts-hide ts-up', null, { left: L.x, top: BOX.y, width: BOX.w, height: BOX.h });
    head(n.expand, X.expand.k, X.expand.icon, X.expand.label);
    X.expand.items.forEach(function(it) {
      var r = S.el('div', 'nd-team ts-hide');
      r.appendChild(S.el('span', 'nd-team-t', it[0]));
      r.appendChild(S.el('span', 'nd-team-x', it[1]));
      n.expand.appendChild(r);
      n.rows.push(r);
    });
    n.reuse = S.el('div', 'nd-note ts-hide');
    n.reuse.appendChild(S.icon('ti-recycle'));
    n.reuse.appendChild(S.el('span', null, X.expand.note));
    n.expand.appendChild(n.reuse);
    root.appendChild(n.expand);

    // 2 Choose who runs it
    n.run = S.el('div', 'ts-obj ts-c-ai ts-soft nd-box ts-hide ts-up', null, { left: Rt.x, top: BOX.y, width: BOX.w, height: BOX.h });
    head(n.run, '2', 'ti-settings', X.runLabel);
    X.run.forEach(function(o) {
      var b = S.el('div', 'ts-obj ts-c-' + o.tone + ' nd-opt ts-hide ts-up');
      var oh = S.el('div', 'nd-opt-h ts-ink');
      oh.appendChild(S.icon(o.icon));
      oh.appendChild(S.el('span', null, o.label));
      b.appendChild(oh);
      var ul = S.el('ul', 'sc-list nd-list');
      o.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      n.run.appendChild(b);
      n.opts.push(b);
    });
    n.or = S.el('div', 'nd-or ts-hide');
    n.or.appendChild(S.icon('ti-arrows-exchange'));
    n.or.appendChild(S.el('span', null, X.or));
    n.run.appendChild(n.or);
    root.appendChild(n.run);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 150, run: function() { S.on(n.ev); } },
    { delay: 700, run: function() { S.on(n.expand); } }
  ];
  X.expand.items.forEach(function(it, i) { steps.push({ delay: 900 + i * 150, run: function() { S.on(n.rows[i]); } }); });
  var t1 = 900 + X.expand.items.length * 150;
  steps.push({ delay: t1, run: function() { S.on(n.reuse); } });
  steps.push({ delay: t1 + 400, run: function() { S.on(n.run); } });
  X.run.forEach(function(o, i) { steps.push({ delay: t1 + 600 + i * 300, run: function() { S.on(n.opts[i]); } }); });
  steps.push({ delay: t1 + 600 + X.run.length * 300 + 100, run: function() { S.on(n.or); } });
  steps.push({ delay: t1 + 600 + X.run.length * 300 + 500, run: complete });
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
      return X.evidenceLabel + ': ' + X.evidence.join(', ').toLowerCase() + '. 1 ' + X.expand.label + ': '
        + X.expand.items.map(function(it) { return it[0] + ', ' + it[1].toLowerCase(); }).join('; ') + '. ' + X.expand.note + '. 2 ' + X.runLabel + ': '
        + X.run.map(function(o) { return o.label + ', ' + o.items.join(', ').toLowerCase(); }).join('; ') + '. ' + X.or + '. ' + X.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
