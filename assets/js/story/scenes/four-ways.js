// Scene: four-ways (screen 06)
// Causal story: four ways in, the same four agents beneath every one. On top, the four
// ways of working (Ask, Use, Run, Create), each with what it is for. All four lead into
// one layer: the same four kinds of agent work beneath every way, in rising order of
// judgement (retrieval, process, policy, principal). Each agent card: its job, what it did
// for one answer (which critical services are deteriorating, and why), why the person can
// trust it, and who decides. Under the layer, judgement rises from none to broad.
SceneDirector.register('four-ways', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var G = D.ways;
  var CAPS = D.capabilities;
  var W = 1040, H = 468;
  var COL = { step: 254, w: 246 };
  var WAY = { y: 18, h: 60 };
  var BAND = { y: 108, h: 318 };
  var AG = { x: 28, y: 150, w: 236, step: 248, h: 264 };
  var AXIS = { label: 436, y: 454, h: 8 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'four-ways', refHeight: 520 });
    n = { ways: [], fans: [], agents: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.inLabel = root.appendChild(S.el('div', 'ts-label ts-hide', G.inLabel, { left: 16, top: 0, width: 400 }));
    CAPS.forEach(function(c, i) {
      var x = 16 + i * COL.step;
      var b = S.el('div', 'ts-obj ts-c-neutral fw4-way ts-hide ts-up', null, { left: x, top: WAY.y, width: COL.w, height: WAY.h });
      var hd = S.el('div', 'fw3-way-h');
      hd.appendChild(S.icon(c.icon, 'fw3-way-i'));
      hd.appendChild(S.el('span', 'fw3-verb', c.verb));
      hd.appendChild(S.el('span', 'fw3-prod', c.product));
      b.appendChild(hd);
      b.appendChild(S.el('div', 'fw3-when', c.when));
      root.appendChild(b);
      n.ways.push(b);
      var cx = x + COL.w / 2;
      n.fans.push(S.path(g, 'M' + cx + ' ' + (WAY.y + WAY.h + 3) + ' L' + cx + ' ' + (BAND.y - 5), 'ts-s-ai fw4-fan', cv.marker('ai')));
    });

    // The same four agents, beneath every way
    n.band = S.el('div', 'ts-obj ts-c-ai ts-soft fw4-band ts-hide', null, { left: 16, top: BAND.y, width: 1008, height: BAND.h });
    var bh = S.el('div', 'fw4-band-h');
    bh.appendChild(S.el('span', 'fw4-band-t ts-ink', G.layerLabel));
    bh.appendChild(S.el('span', 'fw4-band-q', G.question));
    n.band.appendChild(bh);
    root.appendChild(n.band);
    G.agents.forEach(function(a, i) {
      var b = S.el('div', 'ts-obj ts-c-' + a.tone + ' fw4-agent ts-hide ts-up', null, { left: AG.x + i * AG.step, top: AG.y, width: AG.w, height: AG.h });
      var ah = S.el('div', 'fw3-agent-h ts-ink');
      ah.appendChild(S.icon(a.icon));
      ah.appendChild(S.el('span', 'fw3-agent-t', a.label));
      b.appendChild(ah);
      b.appendChild(S.el('div', 'fw3-does', a.does));
      var demo = S.el('div', 'fw4-demo');
      demo.appendChild(S.el('div', 'fw3-k', G.demoLabel));
      demo.appendChild(S.el('div', 'fw4-demo-t', a.demo));
      b.appendChild(demo);
      var tr = S.el('div', 'fw4-trust');
      var th = S.el('div', 'fw3-trust-h');
      th.appendChild(S.icon('ti-shield-check'));
      th.appendChild(S.el('span', null, G.trustLabel));
      tr.appendChild(th);
      tr.appendChild(S.el('div', 'fw4-trust-t', a.trust));
      b.appendChild(tr);
      var who = S.el('div', 'fw4-who is-' + a.tone);
      who.appendChild(S.icon(a.tone === 'human' ? 'ti-user-check' : a.tone === 'ai' ? 'ti-user-question' : 'ti-robot'));
      who.appendChild(S.el('span', null, a.who));
      b.appendChild(who);
      root.appendChild(b);
      n.agents.push(b);
    });

    // Judgement rises from left to right, and the person comes closer
    n.axis = S.el('div', 'fw3-axis ts-hide', null, { left: 16, top: AXIS.y, width: 1008, height: AXIS.h });
    root.appendChild(n.axis);
    n.axisLow = root.appendChild(S.el('div', 'fw3-axis-l ts-hide', G.axis.label + ': ' + G.axis.low, { left: 16, top: AXIS.label, width: 300 }));
    n.axisHigh = root.appendChild(S.el('div', 'fw3-axis-l is-high ts-hide', G.axis.high, { left: 724, top: AXIS.label, width: 300 }));
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [{ delay: 150, run: function() { S.on(n.inLabel); } }];
  CAPS.forEach(function(c, i) { steps.push({ delay: 250 + i * 150, run: function() { S.on(n.ways[i]); } }); });
  steps.push({ delay: 1000, run: function() { S.on(n.fans); } });
  steps.push({ delay: 1350, run: function() { S.on(n.band); } });
  G.agents.forEach(function(a, i) { steps.push({ delay: 1650 + i * 450, run: function() { S.on(n.agents[i]); } }); });
  var t1 = 1650 + G.agents.length * 450 + 150;
  steps.push({ delay: t1, run: function() { S.on([n.axis, n.axisLow, n.axisHigh]); } });
  steps.push({ delay: t1 + 400, run: complete });
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
      return G.inLabel + ': ' + CAPS.map(function(c) { return c.verb + ' (' + c.product + '), ' + c.when.toLowerCase(); }).join('; ') + '. '
        + G.layerLabel + '. ' + G.question + ' ' + G.agents.map(function(a) {
          return a.label + ': ' + a.does.toLowerCase() + '. ' + G.demoLabel + ': ' + a.demo.toLowerCase() + '. ' + G.trustLabel + ': ' + a.trust.toLowerCase() + '. ' + a.who + '.';
        }).join(' ') + ' ' + G.axis.label + ' rises from ' + G.axis.low.toLowerCase() + ' to ' + G.axis.high.toLowerCase() + '. ' + G.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
