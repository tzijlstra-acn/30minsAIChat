// Scene: four-ways (screen 06)
// Causal story: four ways of working, each run by its own kind of agent, in rising order
// of judgement. Column by column: the way (Ask, Use, Run, Create), the agent beneath it
// (retrieval, process, policy, principal) and its job, one supplier example, and why the
// person can trust the answer: sources cited; the approved method; the rule and threshold
// shown, exceptions to a person; options laid out, a named person decides. Under the
// columns, judgement rises from none to broad, and so does how close the person is.
SceneDirector.register('four-ways', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var G = D.ways;
  var CAPS = D.capabilities;
  var W = 1040, H = 470;
  var COL = { step: 254, w: 246 };
  var WAY = { y: 0, h: 76 };
  var BY = { y: 80 };
  var AGENT = { y: 100, h: 96 };
  var EX = { y: 206, h: 66 };
  var TRUST = { y: 280, h: 106 };
  var AXIS = { y: 420, h: 8 };
  var WHO = { y: 440, h: 28 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * COL.step; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'four-ways', refHeight: 520 });
    n = { cols: [] };
    done = false;
    var root = cv.el;

    CAPS.forEach(function(c, i) {
      var a = G.agents[c.id];
      var x = colX(i);
      var col = {};
      col.way = S.el('div', 'ts-obj ts-c-neutral fw3-way ts-hide ts-up', null, { left: x, top: WAY.y, width: COL.w, height: WAY.h });
      var hd = S.el('div', 'fw3-way-h');
      hd.appendChild(S.icon(c.icon, 'fw3-way-i'));
      hd.appendChild(S.el('span', 'fw3-verb', c.verb));
      hd.appendChild(S.el('span', 'fw3-prod', c.product));
      col.way.appendChild(hd);
      col.way.appendChild(S.el('div', 'fw3-when', c.when));
      root.appendChild(col.way);

      col.by = S.el('div', 'fw3-by ts-hide', null, { left: x, top: BY.y, width: COL.w, height: 18 });
      col.by.appendChild(S.icon('ti-arrow-down'));
      col.by.appendChild(S.el('span', null, G.agentLabel));
      root.appendChild(col.by);

      col.agent = S.el('div', 'ts-obj ts-c-' + a.tone + ' ts-soft fw3-agent ts-hide ts-up', null, { left: x, top: AGENT.y, width: COL.w, height: AGENT.h });
      var ah = S.el('div', 'fw3-agent-h ts-ink');
      ah.appendChild(S.icon(a.icon));
      ah.appendChild(S.el('span', 'fw3-agent-t', a.label));
      col.agent.appendChild(ah);
      col.agent.appendChild(S.el('div', 'fw3-does', a.does));
      root.appendChild(col.agent);

      col.ex = S.el('div', 'fw3-ex ts-hide', null, { left: x, top: EX.y, width: COL.w, height: EX.h });
      col.ex.appendChild(S.el('div', 'fw3-k', G.exampleLabel));
      col.ex.appendChild(S.el('div', 'fw3-ex-t', a.example));
      root.appendChild(col.ex);

      col.trust = S.el('div', 'ts-obj ts-c-proof ts-soft fw3-trust ts-hide ts-up', null, { left: x, top: TRUST.y, width: COL.w, height: TRUST.h });
      var th = S.el('div', 'fw3-trust-h ts-ink');
      th.appendChild(S.icon('ti-shield-check'));
      th.appendChild(S.el('span', null, G.trustLabel));
      col.trust.appendChild(th);
      col.trust.appendChild(S.el('div', 'fw3-trust-t', a.trust));
      root.appendChild(col.trust);

      col.who = S.el('div', 'fw3-who is-' + a.tone + ' ts-hide ts-pop', null, { left: x, top: WHO.y, width: COL.w, height: WHO.h });
      col.who.appendChild(S.icon(a.tone === 'human' ? 'ti-user-check' : a.tone === 'ai' ? 'ti-user-question' : 'ti-robot'));
      col.who.appendChild(S.el('span', null, a.who));
      root.appendChild(col.who);
      n.cols.push(col);
    });

    // Judgement rises from left to right, and the person comes closer
    n.axis = S.el('div', 'fw3-axis ts-hide', null, { left: 16, top: AXIS.y, width: 1008, height: AXIS.h });
    root.appendChild(n.axis);
    n.axisLow = root.appendChild(S.el('div', 'fw3-axis-l ts-hide', G.axis.label + ': ' + G.axis.low, { left: 16, top: AXIS.y - 18, width: 300 }));
    n.axisHigh = root.appendChild(S.el('div', 'fw3-axis-l is-high ts-hide', G.axis.high, { left: 724, top: AXIS.y - 18, width: 300 }));
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [];
  CAPS.forEach(function(c, i) {
    var t = 200 + i * 600;
    steps.push({ delay: t, run: function() { S.on(n.cols[i].way); } });
    steps.push({ delay: t + 150, run: function() { S.on(n.cols[i].by); S.on(n.cols[i].agent); } });
    steps.push({ delay: t + 300, run: function() { S.on(n.cols[i].ex); } });
    steps.push({ delay: t + 450, run: function() { S.on(n.cols[i].trust); } });
  });
  var t1 = 200 + CAPS.length * 600;
  steps.push({ delay: t1, run: function() { S.on([n.axis, n.axisLow, n.axisHigh]); } });
  CAPS.forEach(function(c, i) { steps.push({ delay: t1 + 200 + i * 120, run: function() { S.on(n.cols[i].who); } }); });
  steps.push({ delay: t1 + 200 + CAPS.length * 120 + 300, run: complete });
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
      return CAPS.map(function(c) {
        var a = G.agents[c.id];
        return c.verb + ' (' + c.product + '), ' + c.when.toLowerCase() + '. ' + G.agentLabel + ' the ' + a.label.toLowerCase() + ': ' + a.does.toLowerCase()
          + '. ' + G.exampleLabel + ': ' + a.example + ' ' + G.trustLabel + ': ' + a.trust + ' ' + a.who + '.';
      }).join(' ') + ' ' + G.axis.label + ' rises from ' + G.axis.low.toLowerCase() + ' to ' + G.axis.high.toLowerCase() + '. ' + G.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
