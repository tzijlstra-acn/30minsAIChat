// Scene: engine-run (screen 05)
// Causal story: every source integrated; the latest AI prepares the answer. One worker,
// one question. Maya types the question into the Workspace and presses Run. The engine
// flips out beneath the screen and runs in seven steps, each lighting its part: understand
// (the approved method, six systems needed), check access (each system checks Maya's
// access), read (live and cached; the records counted as they come in), connect (the
// knowledge graph links suppliers, services and incidents), calculate (rules score each
// service against the threshold; no model), explain (AI writes the why, each claim
// cited), record (the question, the records with their versions and the answer kept).
// Then the answer lands on Maya's screen. Run again replays it; Space finishes it, then
// moves on.
SceneDirector.register('engine-run', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var E = D.engine;
  var Q = D.sees.question.text;
  var W = 1040, H = 520;
  var SCR = { x: 16, y: 0, w: 1008, h: 124 };
  var ENG = { x: 16, y: 138, w: 1008, h: 376 };
  var PILL = { y: 34, w: 136, gap: 4, h: 32, x: 14 };
  var REG = { y: 78 };
  var R1 = { x: 14, w: 360 }, R2 = { x: 388, w: 254 }, R3 = { x: 656, w: 338 };
  var REC = { y: 324, h: 38 };
  var STEP = 800;
  var TYPE = { every: 30, chars: 2 };

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var NODE = { basalt: [75, 8], novalink: [0, 72], ardent: [150, 72], inc: [0, 136], sla: [150, 136] };

  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }
  function total() { return E.systems.reduce(function(a, s) { return a + s.records; }, 0); }

  // ── The frame: Maya's screen, and the engine beneath it ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'engine-run', align: 'top' });
    n = {};
    done = false;
    var root = cv.el;

    // Maya's screen
    n.screen = S.el('div', 'ts-obj ts-c-proof en-screen ts-hide ts-up', null, { left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h });
    var bar = S.el('div', 'en-bar', null, { left: 14, top: 8, width: SCR.w - 28, height: 24 });
    bar.appendChild(S.el('span', 'pa-bar-dot'));
    bar.appendChild(S.el('span', 'en-bar-t', E.app));
    bar.appendChild(S.el('span', 'en-bar-x', E.ask));
    var me = S.el('span', 'en-bar-me');
    me.appendChild(S.el('span', 'pa-avatar is-small', E.worker.initials));
    me.appendChild(S.el('span', null, E.worker.name + ' · ' + E.worker.role));
    bar.appendChild(me);
    n.screen.appendChild(bar);
    var q = S.el('div', 'en-q', null, { left: 14, top: 40, width: SCR.w - 28 - 128, height: 36 });
    q.appendChild(S.icon('ti-search', 'en-q-i'));
    n.qText = S.el('span', 'en-q-t', '');
    q.appendChild(n.qText);
    n.caret = q.appendChild(S.el('span', 'ah-caret'));
    n.screen.appendChild(q);
    n.run = S.el('button', 'en-run', null, { left: SCR.w - 14 - 116, top: 40, width: 116, height: 36 });
    n.run.type = 'button';
    n.runIcon = n.run.appendChild(S.icon('ti-player-play'));
    n.runLabel = n.run.appendChild(S.el('span', null, E.run));
    n.run.addEventListener('click', function(e) { e.stopPropagation(); again(); });
    n.screen.appendChild(n.run);
    n.ans = S.el('div', 'en-ans', null, { left: 14, top: 84, width: SCR.w - 28, height: 30 });
    n.placeholder = n.ans.appendChild(S.el('span', 'en-ans-ph', E.placeholder));
    n.ansText = n.ans.appendChild(S.el('span', 'en-ans-t ts-hide', E.answer.text));
    n.ansSrc = S.el('span', 'en-ans-src ts-hide');
    n.ansSrc.appendChild(S.icon('ti-quote'));
    n.ansSrc.appendChild(S.el('span', null, E.answer.sources));
    n.ans.appendChild(n.ansSrc);
    n.screen.appendChild(n.ans);
    root.appendChild(n.screen);

    // The engine, folded under the screen until Run
    n.engine = S.el('div', 'ts-obj ts-c-ai en-engine', null, { left: ENG.x, top: ENG.y, width: ENG.w, height: ENG.h });
    n.engine.appendChild(S.el('div', 'ts-label ts-ink', E.engineLabel, { left: 14, top: 10, width: 400 }));
    n.status = n.engine.appendChild(S.el('div', 'en-status', '', { left: ENG.w - 14 - 400, top: 9, width: 400 }));
    n.pills = E.steps.map(function(st, i) {
      var b = S.el('div', 'en-pill', null, { left: PILL.x + i * (PILL.w + PILL.gap), top: PILL.y, width: PILL.w, height: PILL.h });
      b.appendChild(S.el('span', 'en-pill-n', String(i + 1)));
      b.appendChild(S.icon(st.icon, 'en-pill-i'));
      b.appendChild(S.el('span', 'en-pill-t', st.label));
      n.engine.appendChild(b);
      return b;
    });

    // 1 to 3: the integrated data
    var r1 = S.el('div', 'en-region', null, { left: R1.x, top: REG.y, width: R1.w, height: 238 });
    r1.appendChild(S.el('div', 'en-region-k', E.dataLabel));
    n.method = r1.appendChild(S.el('div', 'en-method ts-hide', E.method));
    n.tiles = {};
    E.systems.forEach(function(sy, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var t = S.el('div', 'en-sys ts-hide' + (sy.records ? '' : ' is-idle'), null, { left: col * 184, top: 46 + row * 44, width: 176, height: 38 });
      t.appendChild(S.icon(sy.mode === 'live' ? 'ti-bolt' : 'ti-archive', 'en-sys-mode'));
      t.appendChild(S.el('span', 'en-sys-l', sy.label));
      var st = S.el('span', 'en-sys-st');
      st.appendChild(S.icon(sy.records ? 'ti-circle-check' : 'ti-minus'));
      st.appendChild(S.el('span', 'en-sys-n', sy.records ? '0' : E.notNeeded));
      t.appendChild(st);
      r1.appendChild(t);
      n.tiles[sy.id] = { el: t, num: st.lastChild };
    });
    n.records = r1.appendChild(S.el('div', 'en-records ts-hide', E.recordsLabel.replace('{n}', '0'), { left: 0, top: 224, width: R1.w, height: 18 }));
    n.engine.appendChild(r1);

    // 4: connected
    var r2 = S.el('div', 'en-region', null, { left: R2.x, top: REG.y, width: R2.w, height: 238 });
    r2.appendChild(S.el('div', 'en-region-k', E.graphLabel));
    var ga = S.el('div', 'en-graph', null, { left: 0, top: 26, width: R2.w, height: 172 });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'en-graph-svg');
    svg.setAttribute('width', R2.w); svg.setAttribute('height', 172);
    ga.appendChild(svg);
    n.edges = E.graph.edges.map(function(e) {
      var a = NODE[e[0]], b = NODE[e[1]];
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', a[0] + 52); l.setAttribute('y1', a[1] + 15); l.setAttribute('x2', b[0] + 52); l.setAttribute('y2', b[1] + 15);
      l.setAttribute('class', 'en-edge ts-hide');
      svg.appendChild(l);
      return l;
    });
    n.nodes = E.graph.nodes.map(function(nd) {
      var at = NODE[nd.id];
      var c = S.el('div', 'en-node ts-c-' + nd.tone + ' ts-hide ts-pop', nd.label, { left: at[0], top: at[1], width: 104, height: 30 });
      ga.appendChild(c);
      return c;
    });
    r2.appendChild(ga);
    n.graphNote = r2.appendChild(S.el('div', 'en-graph-note ts-hide', E.graph.note, { left: 0, top: 206, width: R2.w, height: 18 }));
    n.engine.appendChild(r2);

    // 5 and 6: worked out
    var r3 = S.el('div', 'en-region', null, { left: R3.x, top: REG.y, width: R3.w, height: 238 });
    r3.appendChild(S.el('div', 'en-region-k', E.workLabel));
    n.rules = S.el('div', 'ts-obj ts-c-data en-box ts-hide', null, { left: 0, top: 22, width: R3.w, height: 108 });
    var rh = S.el('div', 'en-box-h');
    rh.appendChild(S.el('span', 'en-box-t ts-ink', E.rules.label));
    rh.appendChild(S.el('span', 'en-box-x', E.rules.text));
    n.rules.appendChild(rh);
    n.bars = E.rules.rows.map(function(rw) {
      var row = S.el('div', 'en-bar-row');
      row.appendChild(S.el('span', 'en-bar-l', rw[0]));
      var track = S.el('span', 'en-track');
      var fill = S.el('span', 'en-fill');
      track.appendChild(fill);
      track.appendChild(S.el('span', 'en-thr'));
      row.appendChild(track);
      row.appendChild(S.el('span', 'en-bar-v', String(rw[1])));
      n.rules.appendChild(row);
      return { fill: fill, v: rw[1] };
    });
    n.rules.appendChild(S.el('div', 'en-box-x', E.rules.rest));
    r3.appendChild(n.rules);
    n.ai = S.el('div', 'ts-obj ts-c-ai en-box ts-hide', null, { left: 0, top: 138, width: R3.w, height: 98 });
    var ah = S.el('div', 'en-box-h');
    ah.appendChild(S.el('span', 'en-box-t ts-ink', E.ai.label));
    n.ai.appendChild(ah);
    n.aiText = n.ai.appendChild(S.el('div', 'en-ai-t', ''));
    var cites = S.el('div', 'en-cites');
    n.cites = E.ai.cites.map(function(c, i) {
      var x = S.el('span', 'en-cite ts-hide', '[' + (i + 1) + '] ' + c);
      cites.appendChild(x);
      return x;
    });
    n.ai.appendChild(cites);
    r3.appendChild(n.ai);
    n.engine.appendChild(r3);

    // 7: recorded
    n.rec = S.el('div', 'en-rec ts-hide', null, { left: 14, top: REC.y, width: ENG.w - 28, height: REC.h });
    n.rec.appendChild(S.icon('ti-archive'));
    n.rec.appendChild(S.el('span', null, E.recorded));
    n.engine.appendChild(n.rec);
    root.appendChild(n.engine);

    tl = createTimeline(introSteps());
  }

  // ── Put the engine back to the start of a run ──
  function resetRun() {
    done = false;
    n.engine.classList.remove('is-open');
    n.pills.forEach(function(p) { p.classList.remove('is-run', 'is-done'); });
    [n.method, n.records, n.graphNote, n.rules, n.ai, n.rec, n.ansText, n.ansSrc].concat(n.nodes, n.edges, n.cites).forEach(function(x) { off(x); });
    E.systems.forEach(function(sy) { off(n.tiles[sy.id].el); if (sy.records) n.tiles[sy.id].num.textContent = '0'; });
    n.records.textContent = E.recordsLabel.replace('{n}', '0');
    n.bars.forEach(function(b) { b.fill.style.width = '0'; });
    n.aiText.textContent = '';
    n.placeholder.classList.remove('is-gone');
    n.status.textContent = '';
    setRun('idle');
  }
  function off(x) { var c = x.getAttribute('class') || ''; x.setAttribute('class', c.replace(/\s*\bts-on\b/g, '')); }
  function setRun(state) {
    n.run.classList.toggle('is-running', state === 'running');
    n.run.disabled = state === 'running';
    n.runIcon.className = 'ti ' + (state === 'running' ? 'ti-loader-2' : state === 'done' ? 'ti-refresh' : 'ti-player-play');
    n.runLabel.textContent = state === 'running' ? E.running : state === 'done' ? E.again : E.run;
  }
  function stepOn(i) {
    n.pills.forEach(function(p, k) { p.classList.toggle('is-run', k === i); p.classList.toggle('is-done', k < i); });
    n.status.textContent = E.stepOf.replace('{n}', i + 1).replace('{t}', E.steps.length).replace('{label}', E.steps[i].label);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  // The seven steps of one run, from t0
  function runSteps(t0) {
    var st = [];
    st.push({ delay: t0, run: function() { setRun('running'); n.engine.classList.add('is-open'); } });
    var t = t0 + 600;
    // 1 understand
    st.push({ delay: t, run: function() { stepOn(0); S.on(n.method); } });
    // 2 check access, system by system
    t += STEP;
    st.push({ delay: t, run: function() { stepOn(1); } });
    E.systems.forEach(function(sy, i) { st.push({ delay: t + 60 + i * 70, run: function() { S.on(n.tiles[sy.id].el); } }); });
    // 3 read: the records count in
    t += STEP;
    st.push({ delay: t, run: function() { stepOn(2); S.on(n.records); } });
    [1, 2, 3, 4].forEach(function(k) {
      st.push({ delay: t + k * 150, run: function() {
        var sum = 0;
        E.systems.forEach(function(sy) { if (!sy.records) return; var v = Math.round(sy.records * k / 4); sum += v; n.tiles[sy.id].num.textContent = String(v); });
        n.records.textContent = E.recordsLabel.replace('{n}', sum);
      } });
    });
    // 4 connect
    t += STEP;
    st.push({ delay: t, run: function() { stepOn(3); } });
    n.nodes.forEach(function(nd, i) { st.push({ delay: t + 60 + i * 90, run: function() { S.on(nd); } }); });
    st.push({ delay: t + 450, run: function() { n.edges.forEach(function(e) { S.on(e); }); S.on(n.graphNote); } });
    // 5 calculate
    t += STEP;
    st.push({ delay: t, run: function() { stepOn(4); S.on(n.rules); } });
    st.push({ delay: t + 150, run: function() { n.bars.forEach(function(b) { b.fill.style.width = b.v + '%'; }); } });
    // 6 explain: the why, typed, then its sources
    t += STEP;
    st.push({ delay: t, run: function() { stepOn(5); S.on(n.ai); } });
    var full = E.ai.text;
    for (var k = 4; k < full.length + 4; k += 4) {
      st.push({ delay: t + 100 + (k / 4) * 18, run: (function(m) { return function() { n.aiText.textContent = full.slice(0, m); }; })(Math.min(k, full.length)) });
    }
    var tc = t + 100 + Math.ceil(full.length / 4) * 18;
    n.cites.forEach(function(c, i) { st.push({ delay: tc + i * 80, run: function() { S.on(c); } }); });
    // 7 record
    t = Math.max(t + STEP, tc + 300);
    st.push({ delay: t, run: function() { stepOn(6); S.on(n.rec); } });
    // The answer lands on Maya's screen
    t += STEP;
    st.push({ delay: t, run: function() {
      n.pills.forEach(function(p) { p.classList.remove('is-run'); p.classList.add('is-done'); });
      n.status.textContent = E.allDone;
      n.placeholder.classList.add('is-gone');
      S.on(n.ansText); S.on(n.ansSrc);
      setRun('done');
    } });
    st.push({ delay: t + 400, run: complete });
    return st;
  }

  function introSteps() {
    var steps = [{ delay: 100, run: function() { S.on(n.screen); } }];
    var t0 = 500;
    for (var k = TYPE.chars; k < Q.length + TYPE.chars; k += TYPE.chars) {
      steps.push({ delay: t0 + (k / TYPE.chars) * TYPE.every, run: (function(m) { return function() { n.qText.textContent = Q.slice(0, m); }; })(Math.min(k, Q.length)) });
    }
    var t1 = t0 + Math.ceil(Q.length / TYPE.chars) * TYPE.every + 250;
    steps.push({ delay: t1, run: function() { n.caret.classList.add('is-gone'); n.run.classList.add('is-pressed'); } });
    steps.push({ delay: t1 + 200, run: function() { n.run.classList.remove('is-pressed'); } });
    return steps.concat(runSteps(t1 + 250));
  }

  // Run again: the same question, the engine from the start
  function again() {
    if (!cv || n.run.disabled) return;
    if (tl) tl.destroy();
    S.on(n.screen);
    n.qText.textContent = Q;
    n.caret.classList.add('is-gone');
    resetRun();
    tl = createTimeline(runSteps(0));
    if (!instant()) { cv.setStatic(false); tl.play(); } else { cv.setStatic(true); tl.finish(); }
  }

  return {
    play: function() { build(); resetRun(); cv.setStatic(false); tl.play(); },
    pause: function() { if (tl) tl.pause(); },
    resume: function() { if (tl) tl.resume(); },
    seek: function(p) { build(); resetRun(); cv.setStatic(true); tl.seek(p); },
    reset: function() { if (tl) tl.reset(); build(); resetRun(); },
    finish: function() { build(); resetRun(); cv.setStatic(true); tl.finish(); },
    // Space: finish the run first, then move on
    advance: function() {
      if (!cv) return false;
      if (!done) {
        cv.setStatic(true); tl.finish();
        if (!instant()) setTimeout(function() { if (cv) cv.setStatic(false); }, 60);
        return true;
      }
      return false;
    },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); resetRun(); cv.setStatic(true); tl.finish(); },
    renderError: function() { if (tl) tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      return E.worker.name + ', ' + E.worker.role.toLowerCase() + ', asks: ' + Q + ' ' + E.engineLabel + ', in ' + E.steps.length + ' steps: '
        + E.steps.map(function(s) { return s.label.toLowerCase(); }).join(', ') + '. ' + E.method + '. ' + E.dataLabel + ': '
        + E.systems.map(function(s) { return s.label + ' (' + (s.mode === 'live' ? 'live query' : 'cached index') + '), ' + (s.records ? s.records + ' records' : E.notNeeded.toLowerCase()); }).join('; ')
        + '. ' + E.recordsLabel.replace('{n}', total()) + '. ' + E.graphLabel + ': ' + E.graph.note + '. ' + E.rules.label + ': ' + E.rules.text + ' '
        + E.rules.rows.map(function(r) { return r[0] + ' ' + r[1]; }).join(', ') + '; ' + E.rules.rest + '. ' + E.ai.label + ': ' + E.ai.text + ' Sources: ' + E.ai.cites.join(', ') + '. '
        + E.recorded + '. Answer: ' + E.answer.text + ' ' + E.answer.sources + '.';
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
