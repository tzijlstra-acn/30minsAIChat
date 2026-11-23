// Scene: value-decision (v2 screen 12)
// Causal story: value grows as assistance becomes operational work. A four-step ladder
// rises from Assist to role apps to automations to the Agent Builder, each with its
// primary value. Three outcome groups are measured separately: risk, operating
// performance, capacity and economics. The conversation ends on one decision for the
// room: which role, decision and bounded process becomes the first controlled loop, and
// what evidence would authorise the next wave.
SceneDirector.register('value-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var STEP = { x0: 16, w: 246, gap: 8, base: 150, heights: [96, 112, 128, 144] };
  var OUT = { y: 168, w: 330, gap: 9, h: 156 };
  var Q = { y: 366, h: 132 };

  var cv = null;
  var n = {};
  var done = false;

  function stepX(i) { return STEP.x0 + i * (STEP.w + STEP.gap); }
  function outX(i) { return 16 + i * (OUT.w + OUT.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'value-decision' });
    n = { steps: [], outs: [] };
    done = false;
    var root = cv.el;
    var V = D.value;

    D.capabilities.forEach(function(c, i) {
      var h = STEP.heights[i];
      var st = S.el('div', 'ts-obj ts-c-ai vd-step ts-hide ts-up', null, { left: stepX(i), top: STEP.base - h, width: STEP.w, height: h });
      st.style.setProperty('--vd-level', String(i));
      var head = S.el('div', 'vd-step-head');
      head.appendChild(S.icon(c.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'vd-verb', c.verb));
      head.appendChild(S.el('span', 'ts-label ts-ink', c.product));
      st.appendChild(head);
      st.appendChild(S.el('div', 'ts-text vd-value', c.value));
      root.appendChild(st);
      n.steps.push(st);
    });

    var icons = { risk: 'ti-shield-check', operating: 'ti-clock', capacity: 'ti-scale' };
    V.outcomes.forEach(function(o, i) {
      var box = S.el('div', 'vd-out ts-hide ts-up', null, { left: outX(i), top: OUT.y, width: OUT.w, height: OUT.h });
      var head = S.el('div', 'vd-out-head');
      head.appendChild(S.icon(icons[o.id]));
      head.appendChild(S.el('span', null, o.label));
      box.appendChild(head);
      var ul = S.el('ul', 'vd-out-list');
      o.items.forEach(function(it) { ul.appendChild(S.el('li', null, it)); });
      box.appendChild(ul);
      root.appendChild(box);
      n.outs.push(box);
    });
    n.measure = S.el('div', 'ts-note vd-measure ts-hide', V.measureNote, { left: 16, top: OUT.y + OUT.h + 10, width: 1008 });
    root.appendChild(n.measure);

    var q = S.el('div', 'vd-question ts-hide ts-pop', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    var gate = S.DecisionGate.create(q, { size: 'small' });
    gate.el.classList.add('vd-gate');
    n.gate = gate;
    var body = S.el('div', 'vd-q-body');
    body.appendChild(S.el('div', 'ts-label ts-ink ts-c-human', 'Workshop decision'));
    body.appendChild(S.el('div', 'vd-q-text', V.question));
    body.appendChild(S.el('div', 'vd-q-next', V.next));
    var crit = S.el('div', 'vd-criteria');
    V.criteria.forEach(function(c) { crit.appendChild(S.el('span', 'ts-chip ts-c-human', c)); });
    body.appendChild(crit);
    q.appendChild(body);
    root.appendChild(q);
    n.question = q;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.steps[0]); } },
    { delay: 600,  run: function() { S.on(n.steps[1]); } },
    { delay: 1000, run: function() { S.on(n.steps[2]); } },
    { delay: 1400, run: function() { S.on(n.steps[3]); } },
    { delay: 2200, run: function() { S.on(n.outs[0]); } },
    { delay: 2500, run: function() { S.on(n.outs[1]); } },
    { delay: 2800, run: function() { S.on(n.outs[2]); } },
    { delay: 3300, run: function() { S.on(n.measure); } },
    { delay: 4000, run: function() { S.on(n.question); n.gate.activate(); } },
    { delay: 4600, run: complete }
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
      var V = D.value;
      return 'Value grows from ' + D.capabilities.map(function(c) { return c.product + ' (' + c.value.toLowerCase() + ')'; }).join(' to ') + '. '
        + V.outcomes.map(function(o) { return o.label + ': ' + o.items.join(', ').toLowerCase(); }).join('. ') + '. ' + V.measureNote
        + ' Workshop decision: ' + V.question + ' ' + V.next + ' Criteria: ' + V.criteria.join(', ').toLowerCase() + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
