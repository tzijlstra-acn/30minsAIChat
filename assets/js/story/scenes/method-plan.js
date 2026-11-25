// Scene: method-plan (screen 09, the return point after the live demonstration)
// Causal story: four kinds of agent built the answer the audience just saw, each with one
// job and its own limit, in rising order of judgement. A retrieval agent found the
// evidence; a process agent ran the approved method (rules calculate, no number is
// guessed); a policy agent judged the change material within the policy and drafted the
// request, which a person confirmed; a principal agent laid out the next step, and the
// manager decided. Under the four, the judgement axis: the more judgement, the closer the
// person. A chat assistant stops at retrieval.
SceneDirector.register('method-plan', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.agents;
  var Qd = D.beneath.question;
  var W = 1040, H = 456;
  var Q = { y: 0, h: 44 };
  var CARD = { y: 64, h: 272, arrow: 20 };
  var AXIS = { y: 352, h: 30 };
  var NOTE = 402;

  var cv = null;
  var n = {};
  var done = false;

  var CW = (1008 - (A.list.length - 1) * CARD.arrow) / A.list.length;
  function cardX(i) { return 16 + i * (CW + CARD.arrow); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'method-plan', refHeight: 520 });
    n = { cards: [], arrows: [] };
    done = false;
    var root = cv.el;

    n.q = S.el('div', 'ts-obj ts-c-neutral ts-soft mp-q ts-hide', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    n.q.appendChild(S.el('span', 'mp-q-k', Qd.label));
    n.q.appendChild(S.el('span', 'mp-q-t', Qd.text));
    root.appendChild(n.q);

    A.list.forEach(function(a, i) {
      var b = S.el('div', 'ts-obj ts-c-' + a.tone + ' mp2-card ts-hide ts-up', null, { left: cardX(i), top: CARD.y, width: CW, height: CARD.h });
      var h = S.el('div', 'mp2-head ts-ink');
      h.appendChild(S.icon(a.icon));
      h.appendChild(S.el('span', 'mp2-name', a.label));
      b.appendChild(h);
      b.appendChild(S.el('div', 'mp2-does', a.does));
      var demo = S.el('div', 'mp2-demo');
      demo.appendChild(S.el('div', 'mp2-k', A.demoLabel));
      demo.appendChild(S.el('div', 'mp2-demo-t', a.demo));
      b.appendChild(demo);
      var ctl = S.el('div', 'mp2-ctl');
      ctl.appendChild(S.el('div', 'mp2-k', A.controlLabel));
      ctl.appendChild(S.el('div', 'mp2-ctl-t', a.control));
      b.appendChild(ctl);
      var who = S.el('div', 'mp2-who ts-ink');
      who.appendChild(S.icon(i < 2 ? 'ti-cpu' : 'ti-user-check'));
      who.appendChild(S.el('span', null, a.who));
      b.appendChild(who);
      root.appendChild(b);
      n.cards.push(b);
      if (i < A.list.length - 1) {
        var ar = S.el('div', 'ab-arrow ts-hide', null, { left: cardX(i) + CW, top: CARD.y + CARD.h / 2 - 10, width: CARD.arrow, height: 20 });
        ar.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(ar);
        n.arrows.push(ar);
      }
    });

    // The judgement axis: none on the left, broad on the right
    n.axis = S.el('div', 'mp2-axis ts-hide', null, { left: 16, top: AXIS.y, width: 1008, height: AXIS.h });
    n.axis.appendChild(S.el('span', 'mp2-axis-k', A.axis.label));
    var bar = S.el('div', 'mp2-axis-bar');
    bar.appendChild(S.el('span', 'mp2-axis-lo', A.axis.low));
    bar.appendChild(S.el('span', 'mp2-axis-hi', A.axis.high));
    n.axis.appendChild(bar);
    root.appendChild(n.axis);

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', A.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', A.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [{ delay: 150, run: function() { S.on(n.q); } }];
  A.list.forEach(function(a, i) {
    steps.push({ delay: 600 + i * 700, run: function() { if (i) S.on(n.arrows[i - 1]); S.on(n.cards[i]); } });
  });
  steps.push(
    { delay: 3500, run: function() { S.on(n.axis); } },
    { delay: 4100, run: function() { S.on(n.note); } },
    { delay: 4600, run: complete }
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
      return Qd.label + ': ' + Qd.text + ' ' + A.list.map(function(a) {
        return a.label + ': ' + a.does.toLowerCase() + '. ' + A.demoLabel + ': ' + a.demo.toLowerCase() + '. ' + A.controlLabel + ': ' + a.control.toLowerCase() + '. ' + a.who + '.';
      }).join(' ') + ' ' + A.axis.label + ' rises from ' + A.axis.low.toLowerCase() + ' to ' + A.axis.high.toLowerCase() + '. ' + A.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
