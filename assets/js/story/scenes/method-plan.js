// Scene: method-plan (screen 09, the return point after the live demonstration)
// Causal story: every number in the answer the audience just saw was calculated, not
// guessed. The question from act 3 sits on top; under it the five steps that produced the
// answer, each tagged with what did the work (a rule, connected data, AI checked against
// the sources, or a person) and what it produced. A legend explains the kinds of step.
// Model risk is judged step by step.
SceneDirector.register('method-plan', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var B = D.beneath;
  var W = 1040, H = 450;
  var Q = { y: 0, h: 44 };
  var STEP = { y: 66, w: 188, h: 186, gap: 17 };
  var LEG = { y: 274, w: 330, h: 74, gap: 9 };

  var cv = null;
  var n = {};
  var done = false;

  function stepX(i) { return 16 + i * (STEP.w + STEP.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'method-plan', refHeight: 520 });
    n = { steps: [], arrows: [], legend: [] };
    done = false;
    var root = cv.el;

    n.q = S.el('div', 'ts-obj ts-c-neutral ts-soft mp-q ts-hide', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    n.q.appendChild(S.el('span', 'mp-q-k', B.question.label));
    n.q.appendChild(S.el('span', 'mp-q-t', B.question.text));
    root.appendChild(n.q);

    B.trail.forEach(function(st, i) {
      var k = B.kinds[st.kind];
      var c = S.el('div', 'ts-obj ts-c-' + k.tone + ' mp-step ts-hide ts-up', null, { left: stepX(i), top: STEP.y, width: STEP.w, height: STEP.h });
      var top = S.el('div', 'mp-step-top');
      top.appendChild(S.el('span', 'mp-step-n', String(i + 1)));
      var chip = S.el('span', 'mp-kind ts-ink');
      chip.appendChild(S.icon(k.icon));
      chip.appendChild(S.el('span', null, k.label));
      top.appendChild(chip);
      c.appendChild(top);
      c.appendChild(S.el('div', 'mp-step-label', st.label));
      var out = S.el('div', 'mp-out');
      out.appendChild(S.el('span', 'mp-out-k', B.producedLabel));
      out.appendChild(S.el('span', 'mp-out-v', st.out));
      c.appendChild(out);
      root.appendChild(c);
      n.steps.push(c);
      if (i < B.trail.length - 1) {
        var a = S.el('div', 'mp-arrow ts-hide', null, { left: stepX(i) + STEP.w, top: STEP.y + STEP.h / 2 - 10, width: STEP.gap, height: 20 });
        a.appendChild(S.icon('ti-arrow-right'));
        root.appendChild(a);
        n.arrows.push(a);
      }
    });

    B.legend.forEach(function(id, i) {
      var k = B.kinds[id];
      var b = S.el('div', 'ts-obj ts-c-' + k.tone + ' mp-leg ts-hide ts-up', null, { left: 16 + i * (LEG.w + LEG.gap), top: LEG.y, width: LEG.w, height: LEG.h });
      var h = S.el('div', 'mp-leg-head ts-ink');
      h.appendChild(S.icon(k.icon));
      h.appendChild(S.el('span', null, k.label));
      b.appendChild(h);
      b.appendChild(S.el('div', 'ts-text', k.text));
      root.appendChild(b);
      n.legend.push(b);
    });

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: LEG.y + LEG.h + 22, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', B.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', B.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [{ delay: 200, run: function() { S.on(n.q); } }];
  B.trail.forEach(function(st, i) {
    steps.push({ delay: 700 + i * 450, run: function() { S.on(n.steps[i]); if (i) S.on(n.arrows[i - 1]); } });
  });
  steps.push(
    { delay: 3100, run: function() { S.on(n.legend); } },
    { delay: 3700, run: function() { S.on(n.note); } },
    { delay: 4300, run: complete }
  );
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
      return B.question.label + ': ' + B.question.text + ' The answer was built in ' + B.trail.length + ' steps: '
        + B.trail.map(function(st, i) { return (i + 1) + ', ' + st.label.toLowerCase() + ' (' + B.kinds[st.kind].label.toLowerCase() + '), produced ' + st.out.toLowerCase(); }).join('; ')
        + '. ' + B.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
