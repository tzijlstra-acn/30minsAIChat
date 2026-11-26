// Scene: chain-drift (screen 04)
// Causal story: a supplier changes, and the records do not. One change at a critical
// supplier (Novalink moves its hosting to Basalt Cloud) opens the screen. Four records
// follow, each in its own system: first what the record says, all green; then, row by
// row, what is true now. Then when the bank finds out: the notice lands in a shared
// mailbox on day 12, but today nobody joins it to the records, and an outage on day 110
// shows it; with NFR Workspace the notice is read on day 12 and the rating is flagged.
// The 98 days between are the information that was there but never joined.
SceneDirector.register('chain-drift', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.chain;
  var T = C.timeline;
  var W = 1040, H = 478;
  var EV = { y: 20, h: 48 };
  var COLS = { y: 86, label: { x: 16, w: 196 }, record: { x: 224, w: 384 }, truth: { x: 620, w: 404 } };
  var ROW = { y: 108, h: 44, gap: 6 };
  var TL = { title: 326, events: 344, lane: 362, laneH: 24, laneGap: 6, label: 16, labelW: 160, x: 186, w: 838 };
  var AXIS = 424;
  var WIN = { y: 444, h: 20 };

  var cv = null;
  var n = {};
  var done = false;

  function dayX(d) { return TL.x + d / T.days * TL.w; }
  function laneY(i) { return TL.lane + i * (TL.laneH + TL.laneGap); }
  function rowY(i) { return ROW.y + i * (ROW.h + ROW.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'chain-drift', refHeight: 520 });
    n = { labels: [], records: [], truths: [], segs: [[], []], lanes: [], events: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.label = root.appendChild(S.el('div', 'ts-label ts-hide', C.label, { left: 16, top: 0, width: 600 }));
    n.tag = root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', C.tag, { left: 624, top: 0, width: 400 }));

    // The change at the supplier
    n.ev = S.el('div', 'ts-obj ts-c-human ts-soft cd3-ev ts-hide ts-pop', null, { left: 16, top: EV.y, width: 1008, height: EV.h });
    n.ev.appendChild(S.icon(C.event.icon, 'cd3-ev-i ts-ink'));
    n.ev.appendChild(S.el('span', 'cd3-ev-k ts-ink', C.event.k));
    n.ev.appendChild(S.el('span', 'cd3-ev-t', C.event.text));
    root.appendChild(n.ev);

    // What each record says, and what is true now
    n.colRecord = root.appendChild(S.el('div', 'ts-label ts-ink ts-c-proof ts-hide', C.cols.record, { left: COLS.record.x, top: COLS.y, width: COLS.record.w }));
    n.colTruth = root.appendChild(S.el('div', 'ts-label ts-ink ts-c-gap ts-hide', C.cols.truth, { left: COLS.truth.x, top: COLS.y, width: COLS.truth.w }));
    C.rows.forEach(function(r, i) {
      var y = rowY(i);
      var l = S.el('div', 'cd3-row-l ts-hide', null, { left: COLS.label.x, top: y, width: COLS.label.w, height: ROW.h });
      l.appendChild(S.el('span', 'cd3-row-t', r.label));
      l.appendChild(S.el('span', 'cd3-row-s', r.system));
      root.appendChild(l);
      n.labels.push(l);
      var rec = S.el('div', 'ts-obj ts-c-proof ts-soft cd3-cell ts-hide ts-left', null, { left: COLS.record.x, top: y, width: COLS.record.w, height: ROW.h });
      rec.appendChild(S.icon('ti-circle-check', 'cd3-cell-i ts-ink'));
      rec.appendChild(S.el('span', 'cd3-cell-t', r.record));
      root.appendChild(rec);
      n.records.push(rec);
      var tr = S.el('div', 'ts-obj ts-c-gap ts-soft cd3-cell is-truth ts-hide ts-left', null, { left: COLS.truth.x, top: y, width: COLS.truth.w, height: ROW.h });
      tr.appendChild(S.icon('ti-alert-triangle', 'cd3-cell-i ts-ink'));
      tr.appendChild(S.el('span', 'cd3-cell-t', r.truth));
      root.appendChild(tr);
      n.truths.push(tr);
    });

    // When the bank finds out
    n.tlTitle = root.appendChild(S.el('div', 'ts-label ts-hide', T.label, { left: 16, top: TL.title, width: 600 }));
    T.events.forEach(function(e) {
      var x = dayX(e[0]);
      var right = x > TL.x + TL.w * 0.6;
      var lab = S.el('div', 'cd2-ev ts-hide' + (right ? ' is-end' : ' is-start'), e[1], right ? { left: x - 300, top: TL.events, width: 300 } : { left: x, top: TL.events, width: 300 });
      root.appendChild(lab);
      var line = S.svg('path', { d: 'M' + x + ' ' + (TL.events + 15) + ' L' + x + ' ' + (AXIS - 1) }, 'ts-hide cd2-ev-line');
      g.appendChild(line);
      n.events.push(lab, line);
    });
    T.lanes.forEach(function(ln, i) {
      var y = laneY(i);
      var lab = S.el('div', 'cd2-lane-l ts-hide' + (i === T.lanes.length - 1 ? ' is-ws' : ''), ln.label, { left: TL.label, top: y, width: TL.labelW, height: TL.laneH });
      root.appendChild(lab);
      n.lanes.push(lab);
      ln.segs.forEach(function(sg) {
        var x0 = dayX(sg[0]), x1 = dayX(sg[1]);
        var b = S.el('div', 'cd2-seg ts-c-' + sg[2] + ' ts-hide', null, { left: x0 + 1, top: y, width: x1 - x0 - 2, height: TL.laneH });
        if (sg[3]) b.appendChild(S.el('span', 'cd2-seg-t', sg[3]));
        root.appendChild(b);
        n.segs[i].push(b);
      });
    });
    n.axis = S.svg('path', { d: 'M' + TL.x + ' ' + AXIS + ' L' + (TL.x + TL.w) + ' ' + AXIS }, 'ts-hide cd2-axis');
    g.appendChild(n.axis);
    n.ticks = T.ticks.map(function(d, i) {
      var x = dayX(d);
      var last = i === T.ticks.length - 1;
      var el = S.el('div', 'cd2-tick ts-hide' + (i === 0 ? ' is-start' : last ? ' is-end' : ''), T.tick.replace('{d}', d), i === 0 ? { left: x, top: AXIS + 3, width: 60 } : last ? { left: x - 60, top: AXIS + 3, width: 60 } : { left: x - 30, top: AXIS + 3, width: 60 });
      root.appendChild(el);
      return el;
    });
    var w0 = dayX(T.window[0]), w1 = dayX(T.window[1]);
    n.win = S.el('div', 'cd2-win ts-hide', null, { left: w0, top: WIN.y, width: w1 - w0, height: WIN.h });
    n.win.appendChild(S.el('span', 'cd2-win-t', T.window[2]));
    root.appendChild(n.win);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 150, run: function() { S.on([n.label, n.tag]); } },
    { delay: 350, run: function() { S.on(n.ev); } },
    { delay: 900, run: function() { S.on([n.colRecord]); S.on(n.labels); } }
  ];
  // First the records, all green; then what is true now, row by row
  C.rows.forEach(function(r, i) { steps.push({ delay: 1100 + i * 150, run: function() { S.on(n.records[i]); } }); });
  steps.push({ delay: 1900, run: function() { S.on(n.colTruth); } });
  C.rows.forEach(function(r, i) { steps.push({ delay: 2050 + i * 350, run: function() { S.on(n.truths[i]); } }); });
  var t1 = 2050 + C.rows.length * 350 + 300;
  steps = steps.concat([
    { delay: t1, run: function() { S.on(n.tlTitle); S.on(n.axis); S.on(n.ticks); S.on(n.lanes); } },
    { delay: t1 + 250, run: function() { S.on(n.segs[0]); } },
    { delay: t1 + 750, run: function() { S.on(n.events); } },
    { delay: t1 + 1150, run: function() { S.on(n.win); } },
    { delay: t1 + 1650, run: function() { S.on(n.segs[1]); } },
    { delay: t1 + 2200, run: complete }
  ]);
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
      return C.label + '. ' + C.event.k + ': ' + C.event.text + ' ' + C.rows.map(function(r) {
        return r.label + ' (' + r.system + '): ' + C.cols.record.toLowerCase() + ', ' + r.record.toLowerCase() + '; ' + C.cols.truth.toLowerCase() + ', ' + r.truth.toLowerCase();
      }).join('. ') + '. ' + T.label + ': ' + T.events.map(function(e) { return 'day ' + e[0] + ', ' + e[1].toLowerCase(); }).join('; ') + '. '
        + T.lanes.map(function(ln) { return ln.label + ': ' + ln.segs.filter(function(sg) { return sg[3]; }).map(function(sg) { return sg[3].toLowerCase(); }).join(', then '); }).join('. ')
        + '. ' + T.window[2] + '. ' + C.person + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
