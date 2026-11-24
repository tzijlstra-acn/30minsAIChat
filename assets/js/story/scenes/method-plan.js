// Scene: method-plan (screen 08, the return point after the live demonstration)
// Causal story: the Workspace did not ask one large model to work everything out. The
// answer the audience just saw was assembled as a plan of five steps: understand the
// request and case, select narrow methods and governed data, calculate and verify,
// pause where judgement is required, record the outcome and evidence. Underneath, three
// kinds of step: deterministic, a narrow model call checked against the source, and
// human judgement. Complex outcomes are assembled from small, testable steps.
SceneDirector.register('method-plan', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.beneath;
  var W = 1040, H = 520;
  var STEP = { y: 0, w: 188, h: 148, gap: 17 };
  var TYPE = { y: 206, w: 330, h: 132, gap: 9 };
  var TONE = { context: 'data', plan: 'data', method: 'ai', human: 'human', record: 'proof' };
  var TTONE = { rule: 'data', model: 'ai', human: 'human' };

  var cv = null;
  var n = {};
  var done = false;

  function stepX(i) { return 16 + i * (STEP.w + STEP.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'method-plan' });
    n = { steps: [], arrows: [], types: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    B.steps.forEach(function(s, i) {
      var x = stepX(i);
      var tone = TONE[s.kind] || 'neutral';
      var c = S.el('div', 'ts-obj ts-c-' + tone + ' mp-step ts-hide ts-up', null, { left: x, top: STEP.y, width: STEP.w, height: STEP.h });
      var head = S.el('div', 'mp-step-head');
      head.appendChild(S.el('span', 'mp-num ts-ink', String(i + 1)));
      head.appendChild(S.icon(s.icon, 'ts-ink'));
      c.appendChild(head);
      c.appendChild(S.el('div', 'mp-label', s.label));
      c.appendChild(S.el('div', 'ts-text mp-detail', s.detail));
      if (s.kind === 'human') {
        var gate = S.DecisionGate.create(c, { size: 'small' });
        gate.el.classList.add('mp-gate');
        n.gate = gate;
      }
      root.appendChild(c);
      n.steps.push(c);
      if (i < B.steps.length - 1) {
        var ay = STEP.y + STEP.h / 2;
        n.arrows.push(S.path(g, 'M' + (x + STEP.w + 2) + ' ' + ay + ' L' + (stepX(i + 1) - 2) + ' ' + ay, 'ts-s-neutral mp-arrow', cv.marker('neutral')));
      }
    });
    n.typesLabel = S.el('div', 'ts-label ts-hide', B.typesTitle, { left: 16, top: TYPE.y - 28, width: 600 });
    root.appendChild(n.typesLabel);
    B.types.forEach(function(t, i) {
      var tone = TTONE[t.id];
      var c = S.el('div', 'ts-obj ts-c-' + tone + ' mp-type ts-hide ts-up', null, { left: 16 + i * (TYPE.w + TYPE.gap), top: TYPE.y, width: TYPE.w, height: TYPE.h });
      c.appendChild(S.el('div', 'mp-type-label ts-ink', t.label));
      var flow = S.el('div', 'mp-flow');
      t.flow.forEach(function(f, j) {
        flow.appendChild(S.el('span', 'mp-chip' + (j === 1 ? ' is-core' : ''), f));
        if (j < t.flow.length - 1) flow.appendChild(S.icon('ti-arrow-right', 'mp-flow-arrow'));
      });
      c.appendChild(flow);
      c.appendChild(S.el('div', 'ts-text', t.text));
      root.appendChild(c);
      n.types.push(c);
    });
    n.demo = S.el('div', 'ts-note mp-demo ts-hide', B.inDemo, { left: 16, top: TYPE.y + TYPE.h + 14, width: 1008 });
    root.appendChild(n.demo);
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 430, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', B.line));
    n.note.appendChild(S.el('span', 'ts-text', 'Each step can be tested and challenged.'));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.steps[0]); } },
    { delay: 550,  run: function() { S.on(n.arrows[0]); S.on(n.steps[1]); } },
    { delay: 900,  run: function() { S.on(n.arrows[1]); S.on(n.steps[2]); } },
    { delay: 1250, run: function() { S.on(n.arrows[2]); S.on(n.steps[3]); if (n.gate) n.gate.activate(); } },
    { delay: 1700, run: function() { S.on(n.arrows[3]); S.on(n.steps[4]); } },
    { delay: 2400, run: function() { S.on(n.typesLabel); S.on(n.types); } },
    { delay: 3100, run: function() { S.on(n.demo); } },
    { delay: 3600, run: function() { S.on(n.note); } },
    { delay: 4100, run: complete }
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
      return 'The answer was assembled in five steps: ' + B.steps.map(function(s, i) { return (i + 1) + ', ' + s.label.toLowerCase(); }).join('; ')
        + '. Three kinds of step: ' + B.types.map(function(t) { return t.label.toLowerCase() + ', ' + t.text.toLowerCase(); }).join(' ') + ' ' + B.inDemo + ' ' + B.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
