// Scene: assistance-here (screen 04)
// Causal story: standalone AI sees one system; the answer needs all of them. The question is
// typed out first (the one the live product answers in act 3). The eight sources the
// answer needs appear, still grey, each in its own system. The email, document and GRC
// assistants each light the one source they see; the chat assistant sees only what is
// pasted in. Then the five sources no assistant sees turn red, one by one, each marked
// Missing. Two bars count it: standalone AI sees three of eight, the rest is joined by hand;
// the full answer needs all eight, the 360 view NFR Workspace brings together within the
// user's access.
SceneDirector.register('assistance-here', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.sees;
  var W = 1040, H = 520;
  var Q = { x: 96, y: 0, w: 848, h: 56 };
  var CHIP = { y: 104, w: 243, h: 54, gap: 12, row: 10 };
  var TOOL = { y: 264, w: 243, h: 72 };
  var CTX = { y: 356, bar: 26, gap: 6, label: 160, seg: 52, segGap: 4 };
  var NOTE = 452;
  var TYPE = { start: 500, every: 40, chars: 2 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * (CHIP.w + CHIP.gap); }
  function chipY(row) { return CHIP.y + row * (CHIP.h + CHIP.row); }
  function seenBy(id) { for (var i = 0; i < A.tools.length; i++) if (A.tools[i].covers === id) return A.tools[i]; return null; }
  var SEEN = A.needs.filter(function(x) { return !!seenBy(x.id); }).length;
  var T = A.needs.length;
  function fill(t) { return t.replace(/\{n\}/g, SEEN).replace(/\{t\}/g, T).replace(/\{m\}/g, T - SEEN); }

  function bar(y, spec, cls) {
    var row = { segs: [] };
    row.label = S.el('div', 'ah-bar-l ts-hide', spec.label, { left: 16, top: y, width: CTX.label, height: CTX.bar });
    cv.el.appendChild(row.label);
    A.needs.forEach(function(nd, i) {
      var s = S.el('div', 'ah-seg ' + cls(nd) + ' ts-hide', null, { left: 16 + CTX.label + 12 + i * (CTX.seg + CTX.segGap), top: y + 4, width: CTX.seg, height: CTX.bar - 8 });
      cv.el.appendChild(s);
      row.segs.push(s);
    });
    var vx = 16 + CTX.label + 12 + T * (CTX.seg + CTX.segGap) + 12;
    row.value = S.el('div', 'ah-bar-v ts-hide', fill(spec.value), { left: vx, top: y, width: 1024 - vx, height: CTX.bar });
    cv.el.appendChild(row.value);
    return row;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'assistance-here' });
    n = { row1: [], row2: [], seen: [], missing: [], tools: [], links: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // The question, typed as the professional asks it
    n.q = S.el('div', 'ts-obj ts-c-ai ts-soft ah-q ts-hide ts-pop', null, { left: Q.x, top: Q.y, width: Q.w, height: Q.h });
    n.q.appendChild(S.icon('ti-search', 'ah-q-icon ts-ink'));
    n.q.appendChild(S.el('span', 'ah-q-k', A.question.label));
    var line = S.el('span', 'ah-q-line');
    n.qText = S.el('span', 'ah-q-t', '');
    line.appendChild(n.qText);
    line.appendChild(S.el('span', 'ah-caret'));
    n.q.appendChild(line);
    root.appendChild(n.q);

    // What the answer needs, and where each part lives; the legend says what red means
    n.needsLabel = S.el('div', 'ts-label ts-hide', A.needsTitle, { left: 16, top: CHIP.y - 24, width: 520 });
    root.appendChild(n.needsLabel);
    n.legend = S.el('div', 'ah-legend ts-hide', null, { left: 524, top: CHIP.y - 26, width: 500 });
    var l1 = S.el('span', 'ah-legend-i is-seen');
    l1.appendChild(S.el('span', 'ah-legend-sw'));
    l1.appendChild(S.el('span', null, A.legend.seen));
    var l2 = S.el('span', 'ah-legend-i is-missing');
    l2.appendChild(S.el('span', 'ah-legend-sw'));
    l2.appendChild(S.el('span', null, A.legend.missing));
    n.legend.appendChild(l1);
    n.legend.appendChild(l2);
    root.appendChild(n.legend);

    var at = {};
    A.needs.forEach(function(nd, i) {
      var col = i % 4, row = Math.floor(i / 4);
      var c = S.el('div', 'ts-obj ts-c-neutral ah-need ts-hide ts-up', null, { left: colX(col), top: chipY(row), width: CHIP.w, height: CHIP.h });
      c.appendChild(S.el('span', 'ah-need-l', nd.label));
      c.appendChild(S.el('span', 'ah-need-s', nd.system));
      if (seenBy(nd.id)) {
        var eye = S.icon('ti-eye', 'ah-need-eye ts-hide');
        c.appendChild(eye);
        n.seen.push({ chip: c, mark: eye });
      } else {
        var tag = S.el('span', 'ah-need-miss ts-hide', A.missingTag);
        c.appendChild(tag);
        n.missing.push({ chip: c, mark: tag });
      }
      root.appendChild(c);
      (row ? n.row2 : n.row1).push(c);
      at[nd.id] = { x: colX(col) + CHIP.w / 2, y: chipY(row) + CHIP.h };
    });

    // Each AI tool and the one source it sees
    A.tools.forEach(function(t, i) {
      var x = colX(i);
      var b = S.el('div', 'ts-obj ts-c-ai ah-tool ts-hide ts-up', null, { left: x, top: TOOL.y, width: TOOL.w, height: TOOL.h });
      var head = S.el('div', 'ah-head');
      head.appendChild(S.icon(t.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'ts-title', t.label));
      b.appendChild(head);
      var sees = S.el('div', 'ah-tool-sees');
      sees.appendChild(S.el('span', 'ah-tool-k', A.seesLabel));
      sees.appendChild(S.el('span', 'ah-tool-v', t.sees));
      b.appendChild(sees);
      root.appendChild(b);
      n.tools.push(b);
      var to = t.covers && at[t.covers];
      if (to) n.links.push(S.path(g, 'M' + (x + TOOL.w / 2) + ' ' + (TOOL.y - 4) + ' L' + to.x + ' ' + (to.y + 6), 'ts-s-ai ah-seeline', cv.marker('ai')));
    });

    // The context the answer needs: what standalone AI sees, and the 360 view
    n.ctxLabel = S.el('div', 'ts-label ts-hide', A.context.label, { left: 16, top: CTX.y, width: 600 });
    root.appendChild(n.ctxLabel);
    var y1 = CTX.y + 20, y2 = y1 + CTX.bar + CTX.gap;
    n.barA = bar(y1, A.context.standalone, function(nd) { return seenBy(nd.id) ? 'is-seen' : 'is-missing'; });
    n.barB = bar(y2, A.context.workspace, function() { return 'is-full'; });
    n.barA.label.classList.add('is-standalone');
    n.barB.label.classList.add('is-workspace');
    n.barB.value.classList.add('is-workspace');

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', A.note[0]));
    n.note.appendChild(S.el('span', 'ts-text', A.note[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  function light(item) {
    item.chip.classList.remove('ts-c-neutral');
    item.chip.classList.add('ts-c-ai', 'is-seen');
    S.on(item.mark);
  }
  function miss(item) {
    item.chip.classList.remove('ts-c-neutral');
    item.chip.classList.add('ts-c-gap', 'is-unseen', 'is-flash');
    S.on(item.mark);
  }
  function segsOf(row, kind) { return row.segs.filter(function(s) { return s.classList.contains(kind); }); }

  // Typing: a few characters per step, so seek, pause and finish all land on whole text
  var full = A.question.text;
  var steps = [{ delay: 150, run: function() { S.on(n.q); } }];
  for (var k = TYPE.chars; k < full.length + TYPE.chars; k += TYPE.chars) {
    steps.push({ delay: TYPE.start + (k / TYPE.chars) * TYPE.every, run: (function(m) { return function() { n.qText.textContent = full.slice(0, m); }; })(Math.min(k, full.length)) });
  }
  var t = TYPE.start + Math.ceil(full.length / TYPE.chars) * TYPE.every;
  steps.push(
    { delay: t + 200,  run: function() { n.q.classList.add('is-typed'); } },
    { delay: t + 500,  run: function() { S.on(n.needsLabel); S.on(n.row1); } },
    { delay: t + 800,  run: function() { S.on(n.row2); } },
    { delay: t + 1300, run: function() { S.on(n.tools); } },
    { delay: t + 1800, run: function() { S.on(n.links); n.seen.forEach(light); S.on(n.ctxLabel); S.on(n.barA.label); S.on(segsOf(n.barA, 'is-seen')); } }
  );
  // The sources no assistant sees turn red, one by one
  var tm = t + 2400;
  A.needs.forEach(function(nd, j) {
    if (seenBy(nd.id)) return;
    steps.push({ delay: tm, run: function() {
      var chip = j < 4 ? n.row1[j] : n.row2[j - 4];
      var it = n.missing.filter(function(x) { return x.chip === chip; })[0];
      if (it) miss(it);
      S.on(n.barA.segs[j]);
    } });
    tm += 260;
  });
  steps.push(
    { delay: tm + 100, run: function() { S.on(n.legend); S.on(n.barA.value); } },
    { delay: tm + 700, run: function() { S.on(n.barB.label); } }
  );
  var tb = tm + 800;
  A.needs.forEach(function(nd, i) { steps.push({ delay: tb + i * 90, run: function() { S.on(n.barB.segs[i]); } }); });
  var tv = tb + T * 90 + 150;
  steps.push(
    { delay: tv,       run: function() { S.on(n.barB.value); } },
    { delay: tv + 600, run: function() { S.on(n.note); } },
    { delay: tv + 1100, run: complete }
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
      var miss = A.needs.filter(function(x) { return !seenBy(x.id); }).map(function(x) { return x.label.toLowerCase(); });
      return A.question.label + ': ' + A.question.text + ' ' + A.needsTitle + ': '
        + A.needs.map(function(x) { return x.label.toLowerCase() + ' in the ' + x.system.toLowerCase(); }).join(', ') + '. '
        + A.tools.map(function(t) { return 'the ' + t.label.toLowerCase() + ' sees ' + t.sees.toLowerCase(); }).join('; ') + '. '
        + A.missingTag + ', seen by no assistant: ' + miss.join(', ') + '. '
        + A.context.standalone.label + ': ' + fill(A.context.standalone.value) + ' ' + A.context.workspace.label + ': ' + fill(A.context.workspace.value) + ' '
        + A.note.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
