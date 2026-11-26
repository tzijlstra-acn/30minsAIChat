// Scene: chain-drift (screen 04)
// Causal story: one internal change, followed link by link. The chain (obligation, risk,
// control, evidence, self-assessment, sign-off) first shows what the record says: all
// green. Then the change lands on the control, and the break travels both ways along the
// chain: each link shows what is really happening, while its record still says green. The
// timeline shows for how long: the record says effective for 97 days while supplier
// accounts go unreviewed, until audit finds it; with NFR Workspace the same change is
// flagged the same day and fixed before the sign-off. Then why it matters: exposure,
// accountability and cost. The records match the roles of screen 05.
SceneDirector.register('chain-drift', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.chain;
  var T = C.timeline;
  var W = 1040, H = 500;
  var TRIG = { y: 20, h: 46 };
  var LINK = { y: 84, w: 156, h: 100 };
  var TL = { title: 198, events: 216, lane: 232, laneH: 24, laneGap: 4, label: 16, labelW: 160, x: 186, w: 838 };
  var AXIS = 316;
  var WIN = { y: 336, h: 20 };
  var CONS = { label: 366, y: 384, w: 330, h: 60, gap: 9 };
  var NOTE = 456;

  var cv = null;
  var n = {};
  var done = false;

  function linkX(i) { var gap = (W - 32 - C.links.length * LINK.w) / (C.links.length - 1); return 16 + i * (LINK.w + gap); }
  function dayX(d) { return TL.x + d / T.days * TL.w; }
  function laneY(i) { return TL.lane + i * (TL.laneH + TL.laneGap); }
  // The order the break travels: the link hit first, then outwards, one step each way
  function rippleOrder() {
    var out = [[C.hit]];
    for (var k = 1; k < C.links.length; k++) {
      var step = [];
      if (C.hit + k < C.links.length) step.push(C.hit + k);
      if (C.hit - k >= 0) step.push(C.hit - k);
      if (step.length) out.push(step);
    }
    return out;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'chain-drift', refHeight: 520 });
    n = { links: [], truth: [], joins: [], breaks: [], segs: [[], [], []], lanes: [], events: [], cons: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.label = root.appendChild(S.el('div', 'ts-label ts-hide', C.label, { left: 16, top: 0, width: 600 }));
    n.tag = root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', C.tag, { left: 624, top: 0, width: 400 }));

    // The change, and where it lands
    n.trig = S.el('div', 'ts-obj ts-c-gap ts-soft cd2-trig ts-hide ts-pop', null, { left: 16, top: TRIG.y, width: 1008, height: TRIG.h });
    n.trig.appendChild(S.icon(C.trigger.icon, 'cd2-trig-i ts-ink'));
    n.trig.appendChild(S.el('span', 'cd2-trig-k ts-ink', C.trigger.k));
    n.trig.appendChild(S.el('span', 'cd2-trig-t', C.trigger.text));
    root.appendChild(n.trig);
    var hx = linkX(C.hit) + LINK.w / 2;
    n.drop = S.path(g, 'M' + hx + ' ' + (TRIG.y + TRIG.h + 2) + ' L' + hx + ' ' + (LINK.y - 4), 'ts-s-gap cd-arrow', cv.marker('gap'));

    // The chain: each link with what its record says, and what is really happening
    var cy = LINK.y + LINK.h / 2;
    C.links.forEach(function(l, i) {
      var x = linkX(i);
      var b = S.el('div', 'ts-obj ts-c-neutral cd2-link ts-hide', null, { left: x, top: LINK.y, width: LINK.w, height: LINK.h });
      b.appendChild(S.el('div', 'cd2-link-k', l.label));
      b.appendChild(S.el('div', 'cd2-link-id', l.id));
      var rec = S.el('div', 'cd2-rec');
      rec.appendChild(S.el('span', 'cd2-rec-k', C.recordLabel));
      rec.appendChild(S.el('span', 'cd2-rec-v', l.record));
      b.appendChild(rec);
      var t = S.el('div', 'cd2-true ts-hide');
      t.appendChild(S.el('span', 'cd2-true-k', C.trueLabel + ':'));
      t.appendChild(document.createTextNode(' ' + l.truth));
      b.appendChild(t);
      root.appendChild(b);
      n.links.push(b);
      n.truth.push(t);
      if (i < C.links.length - 1) {
        var x2 = linkX(i + 1);
        var p = S.svg('path', { d: 'M' + (x + LINK.w + 3) + ' ' + cy + ' L' + (x2 - 3) + ' ' + cy }, 'ts-s-data cd-join');
        g.appendChild(p);
        n.joins.push(p);
        var mark = S.el('div', 'cd-break ts-hide ts-pop', null, { left: (x + LINK.w + x2) / 2 - 9, top: cy - 9, width: 18, height: 18 });
        mark.appendChild(S.icon('ti-unlink'));
        root.appendChild(mark);
        n.breaks.push(mark);
      }
    });

    // How long: what the record says, what is happening, and the same change with the Workspace
    n.tlTitle = root.appendChild(S.el('div', 'ts-label ts-hide', T.label, { left: 16, top: TL.title, width: 600 }));
    T.events.forEach(function(e) {
      var x = dayX(e[0]);
      var lab = S.el('div', 'cd2-ev ts-hide' + (e[0] === 0 ? ' is-start' : ''), e[1], e[0] === 0 ? { left: x, top: TL.events, width: 140 } : { left: x - 70, top: TL.events, width: 140 });
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
        b.appendChild(S.el('span', 'cd2-seg-t', sg[3]));
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

    // Why it matters
    n.consLabel = root.appendChild(S.el('div', 'ts-label ts-hide', C.mattersLabel, { left: 16, top: CONS.label, width: 600 }));
    C.consequences.forEach(function(c, i) {
      var b = S.el('div', 'ts-obj ts-c-gap cd-cons ts-hide ts-up', null, { left: 16 + i * (CONS.w + CONS.gap), top: CONS.y, width: CONS.w, height: CONS.h });
      b.appendChild(S.icon(c.icon, 'cd-cons-icon ts-ink'));
      var body = S.el('div', 'cd-cons-body');
      body.appendChild(S.el('div', 'cd-cons-label', c.label));
      body.appendChild(S.el('div', 'ts-text', c.text));
      b.appendChild(body);
      root.appendChild(b);
      n.cons.push(b);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', C.person));
    n.note.appendChild(S.el('span', 'ts-text', C.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  function breakLink(i) {
    n.links[i].classList.remove('ts-c-neutral');
    n.links[i].classList.add('ts-c-gap', 'is-broken');
    if (i === C.hit) n.links[i].classList.add('is-hit');
    S.on(n.truth[i]);
  }
  function breakJoin(i) {
    if (!n.joins[i]) return;
    n.joins[i].setAttribute('class', 'ts-s-gap cd-join is-broken');
    S.on(n.breaks[i]);
  }

  var steps = [
    { delay: 150, run: function() { S.on([n.label, n.tag]); } },
    { delay: 250, run: function() { S.on(n.links); S.on(n.joins); } },
    { delay: 1000, run: function() { S.on(n.trig); } },
    { delay: 1400, run: function() { S.on(n.drop); } }
  ];
  rippleOrder().forEach(function(group, k) {
    steps.push({ delay: 1700 + k * 220, run: function() {
      group.forEach(function(i) {
        breakLink(i);
        // The join between this link and the one it came from
        if (i > C.hit) breakJoin(i - 1);
        if (i < C.hit) breakJoin(i);
      });
    } });
  });
  var t1 = 1700 + rippleOrder().length * 220 + 300;
  steps = steps.concat([
    { delay: t1, run: function() { S.on(n.tlTitle); S.on(n.axis); S.on(n.ticks); S.on(n.events); S.on(n.lanes.slice(0, 2)); } },
    { delay: t1 + 300, run: function() { S.on(n.segs[0]); } },
    { delay: t1 + 700, run: function() { S.on(n.segs[1]); } },
    { delay: t1 + 1100, run: function() { S.on(n.win); } },
    { delay: t1 + 1600, run: function() { S.on(n.lanes[2]); S.on(n.segs[2]); } },
    { delay: t1 + 2200, run: function() { S.on(n.consLabel); S.on(n.cons); } },
    { delay: t1 + 2700, run: function() { S.on(n.note); } },
    { delay: t1 + 3100, run: complete }
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
      return C.label + '. ' + C.trigger.k + ': ' + C.trigger.text + ' ' + C.links.map(function(l) {
        return l.label + ' ' + l.id + ': the record says ' + l.record.toLowerCase() + '; really, ' + l.truth.charAt(0).toLowerCase() + l.truth.slice(1);
      }).join('. ') + '. ' + T.label + ': ' + T.lanes.map(function(ln) {
        return ln.label + ', ' + ln.segs.map(function(sg) { return sg[3].toLowerCase() + ' from day ' + sg[0] + ' to day ' + sg[1]; }).join(', then ');
      }).join('. ') + '. ' + T.window[2] + '. ' + C.mattersLabel + ': ' + C.consequences.map(function(c) { return c.label.toLowerCase() + ', ' + c.text.toLowerCase(); }).join(' ')
        + ' ' + C.person + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
