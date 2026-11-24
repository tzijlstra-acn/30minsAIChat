// Scene: value-decision (screen 11)
// Causal story: three kinds of value, each measured on its own. Risk outcomes, operating
// performance, and capacity and economics: what improves, and the one measure the
// five-week qualification baselines for each. Waiting time saved is not counted as
// headcount.
SceneDirector.register('value-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var V = D.value;
  var W = 1040, H = 370;
  var COL = { y: 0, w: 330, h: 262, gap: 9 };

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'value-decision', refHeight: 520 });
    n = { cols: [], measures: [] };
    done = false;
    var root = cv.el;
    V.outcomes.forEach(function(o, i) {
      var b = S.el('div', 'ts-obj ts-c-' + o.tone + ' vd-col ts-hide ts-up', null, { left: 16 + i * (COL.w + COL.gap), top: COL.y, width: COL.w, height: COL.h });
      var head = S.el('div', 'vd-head ts-ink');
      head.appendChild(S.icon(o.icon));
      head.appendChild(S.el('span', 'vd-head-t', o.label));
      b.appendChild(head);
      b.appendChild(S.el('div', 'vd-k', V.improvesLabel));
      var ul = S.el('ul', 'vd-list');
      o.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      var m = S.el('div', 'vd-measure ts-hide');
      m.appendChild(S.el('div', 'vd-k', V.measureLabel));
      m.appendChild(S.el('div', 'vd-measure-t ts-ink', o.measure));
      b.appendChild(m);
      root.appendChild(b);
      n.cols.push(b);
      n.measures.push(m);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: COL.y + COL.h + 24, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', V.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', V.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cols[0]); } },
    { delay: 600,  run: function() { S.on(n.cols[1]); } },
    { delay: 1000, run: function() { S.on(n.cols[2]); } },
    { delay: 1700, run: function() { S.on(n.measures); } },
    { delay: 2400, run: function() { S.on(n.note); } },
    { delay: 3000, run: complete }
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
      return V.outcomes.map(function(o) { return o.label + ': ' + o.items.join(', ').toLowerCase() + '. ' + V.measureLabel + ': ' + o.measure.toLowerCase() + '.'; }).join(' ') + ' ' + V.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
