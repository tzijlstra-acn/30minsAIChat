// Scene: role-views (screen 05)
// Causal story: one question, and how the information really flows to answer it, for the
// role that asks. Four roles sit in two groups: the Head of NFR, who leads the function,
// and three roles that run the work. The chosen role's question is typed. Then, left to
// right: 1 each of screen 04's eight systems checks that person's access (full, partial or
// none); 2 what may be read is read live from the source (exact records) or from a cached
// index (documents and mail, each with its date); 3 the knowledge graph links the records
// across systems; 4 deterministic rules calculate, and AI explains, each claim cited; 5 the
// answer, shaped for the role, says what was not shown and what the role may do next.
// Space steps through the roles in data order, then moves on; a click shows a role at once.
// Roles that are not in the product today say "Target design" on their card.
SceneDirector.register('role-views', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var R = D.roles;
  var W = 1040, H = 520;
  var CARD = { y: 18, w: 243, h: 68, gap: 12 };
  var Q = { y: 96, h: 44 };
  var STEP = 152;
  var TOP = 172;
  var ROW = { x: 16, w: 232, h: 23, gap: 4, group: 11 };
  var READ = { x: 272, w: 168 };
  var GRAPH = { x: 462, w: 198 };
  var WORK = { x: 684, w: 340, h: 102, gap: 15 };
  var ANS = { y: 404, h: 66 };
  var NOTE = 478;
  var TYPE = { every: 30, chars: 2 };
  var INTRO = 1000;

  // The eight systems of screen 04, grouped by how they are read
  var SYS = ['live', 'cache'].reduce(function(acc, m) {
    return acc.concat(D.sees.needs.filter(function(s) { return R.modeOf[s.id] === m; }));
  }, []);
  var rows = [];
  (function() {
    var y = TOP, prev = null;
    SYS.forEach(function(s) {
      var m = R.modeOf[s.id];
      if (prev && m !== prev) y += ROW.group;
      rows.push({ id: s.id, mode: m, y: y });
      y += ROW.h + ROW.gap;
      prev = m;
    });
  }());
  var BOX = {};
  ['live', 'cache'].forEach(function(m) {
    var r = rows.filter(function(x) { return x.mode === m; });
    BOX[m] = { y: r[0].y, h: r[r.length - 1].y + ROW.h - r[0].y };
  });
  var BOTTOM = BOX.cache.y + BOX.cache.h;

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var cur = R.order[0];

  function role(id) { for (var i = 0; i < R.list.length; i++) if (R.list[i].id === id) return R.list[i]; return R.list[0]; }
  function cardX(i) { return 16 + i * (CARD.w + CARD.gap); }
  function access(r, sysId) {
    var a = r.access[sysId] || 'none';
    if (a === 'full') return { kind: 'full', note: R.access.full.label };
    if (a === 'none') return { kind: 'none', note: R.access.none.label };
    return { kind: 'part', note: a };
  }
  function reads(r, mode) {
    var list = SYS.filter(function(s) { return !mode || R.modeOf[s.id] === mode; });
    return { n: list.filter(function(s) { return access(r, s.id).kind !== 'none'; }).length, t: list.length };
  }
  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }
  function box(cls, geom, spec) {
    var b = S.el('div', 'ts-obj ' + cls + ' ts-hide', null, geom);
    var h = S.el('div', 'rv-box-head');
    h.appendChild(S.icon(spec.icon, 'ts-ink'));
    h.appendChild(S.el('span', 'rv-box-t', spec.label));
    b.appendChild(h);
    return { el: b, head: h };
  }

  // ── The fixed frame: groups, role cards, question bar, the five steps, closing line ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'role-views', align: 'top' });
    n = { chrome: [], cards: {}, rows: [], rowState: [], spokes: [], flows: [], reads: {}, joins: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.chrome.push(root.appendChild(S.el('div', 'ts-label rv-group ts-hide', R.groups.lead, { left: 16, top: 0, width: CARD.w })));
    n.chrome.push(root.appendChild(S.el('div', 'ts-label rv-group ts-hide', R.groups.work, { left: cardX(1), top: 0, width: 400 })));
    n.chrome.push(root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', R.tag, { left: 624, top: 0, width: 400 })));
    n.chrome.push(root.appendChild(S.el('div', 'rv-divider ts-hide', null, { left: cardX(1) - CARD.gap / 2, top: 2, width: 1, height: CARD.y + CARD.h - 2 })));

    n.cardList = R.list.map(function(r, i) {
      var b = S.el('button', 'rv-role ts-hide ts-up', null, { left: cardX(i), top: CARD.y, width: CARD.w, height: CARD.h });
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      var head = S.el('span', 'rv-role-head');
      head.appendChild(S.icon(r.icon, 'rv-role-icon'));
      head.appendChild(S.el('span', 'rv-role-l', r.label));
      b.appendChild(head);
      b.appendChild(S.el('span', 'rv-role-s', r.scope));
      b.appendChild(S.el('span', 'rv-role-t is-' + r.status, R.status[r.status]));
      b.addEventListener('click', function(e) { e.stopPropagation(); select(r.id, !instant()); });
      root.appendChild(b);
      n.cards[r.id] = b;
      return b;
    });

    // The question, typed as the chosen role asks it
    n.q = S.el('div', 'ts-obj ts-c-ai ts-soft ah-q rv-q ts-hide ts-pop', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    n.q.appendChild(S.icon('ti-search', 'ah-q-icon ts-ink'));
    n.qWho = S.el('span', 'ah-q-k rv-q-who', '');
    n.q.appendChild(n.qWho);
    var line = S.el('span', 'ah-q-line');
    n.qText = S.el('span', 'ah-q-t', '');
    line.appendChild(n.qText);
    line.appendChild(S.el('span', 'ah-caret'));
    n.q.appendChild(line);
    root.appendChild(n.q);
    n.chrome.push(n.q);

    // Step labels over the four columns; the fifth sits inside the answer
    [[ROW.x, ROW.w], [READ.x, READ.w], [GRAPH.x, GRAPH.w], [WORK.x, WORK.w]].forEach(function(c, i) {
      n.chrome.push(root.appendChild(S.el('div', 'ts-label ts-hide', R.steps[i], { left: c[0], top: STEP, width: c[1] })));
    });

    // 1 Each system, with its access state
    rows.forEach(function(rw) {
      var s = D.sees.needs.filter(function(x) { return x.id === rw.id; })[0];
      var row = S.el('div', 'ts-obj rv-sys ts-hide ts-left', null, { left: ROW.x, top: rw.y, width: ROW.w, height: ROW.h });
      row.setAttribute('data-sys', rw.id);
      row.appendChild(S.el('span', 'rv-sys-l', s.system));
      root.appendChild(row);
      n.rows.push(row);
      n.chrome.push(row);
    });

    // 2 How it is read: a live query or a cached index
    ['live', 'cache'].forEach(function(m) {
      var b = box('ts-c-data rv-read', { left: READ.x, top: BOX[m].y, width: READ.w, height: BOX[m].h }, R.modes[m]);
      n.reads[m] = S.el('span', 'rv-read-n ts-hide', '');
      b.head.appendChild(n.reads[m]);
      b.el.appendChild(S.el('div', 'rv-box-x', R.modes[m].text));
      root.appendChild(b.el);
      n.chrome.push(b.el);
    });

    // 3 The knowledge graph links the records
    var gb = box('ts-c-ai rv-graph', { left: GRAPH.x, top: TOP, width: GRAPH.w, height: BOTTOM - TOP }, R.graph);
    n.chain = S.el('div', 'rv-chain');
    gb.el.appendChild(n.chain);
    root.appendChild(gb.el);
    n.chrome.push(gb.el);

    // 4 Worked out: rules calculate, then AI explains
    var rb = box('ts-c-data rv-work', { left: WORK.x, top: TOP, width: WORK.w, height: WORK.h }, R.rules);
    rb.el.appendChild(S.el('div', 'rv-box-x', R.rules.text));
    n.rule = S.el('div', 'rv-fact ts-hide', '');
    rb.el.appendChild(n.rule);
    root.appendChild(rb.el);
    n.chrome.push(rb.el);
    var ab = box('ts-c-ai rv-work', { left: WORK.x, top: BOTTOM - WORK.h, width: WORK.w, height: WORK.h }, R.ai);
    ab.el.appendChild(S.el('div', 'rv-box-x', R.ai.text));
    n.ai = S.el('div', 'rv-fact ts-hide', '');
    ab.el.appendChild(n.ai);
    root.appendChild(ab.el);
    n.chrome.push(ab.el);

    // Fixed connectors between the steps
    var gx = GRAPH.x, wx = WORK.x, mid = WORK.x + WORK.w / 2;
    ['live', 'cache'].forEach(function(m) {
      var y = BOX[m].y + BOX[m].h / 2;
      n.joins.push(S.path(g, 'M' + (READ.x + READ.w + 2) + ' ' + y + ' L' + (gx - 4) + ' ' + y, 'ts-s-data rv-spoke', cv.marker('data')));
    });
    n.joins.push(S.path(g, 'M' + (gx + GRAPH.w + 2) + ' ' + (TOP + WORK.h / 2) + ' L' + (wx - 4) + ' ' + (TOP + WORK.h / 2), 'ts-s-ai rv-spoke', cv.marker('ai')));
    n.joins.push(S.path(g, 'M' + mid + ' ' + (TOP + WORK.h + 2) + ' L' + mid + ' ' + (BOTTOM - WORK.h - 4), 'ts-s-ai rv-spoke', cv.marker('ai')));
    n.joins.push(S.path(g, 'M' + mid + ' ' + (BOTTOM + 2) + ' L' + mid + ' ' + (ANS.y - 3), 'ts-s-proof rv-spoke', cv.marker('proof')));

    // 5 The answer, shaped for the role
    n.ans = S.el('div', 'ts-obj ts-c-proof rv-ans ts-hide', null, { left: 16, top: ANS.y, width: 1008, height: ANS.h });
    root.appendChild(n.ans);
    n.chrome.push(n.ans);

    n.note = S.el('div', 'ah-note rv-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', R.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', R.line[1]));
    root.appendChild(n.note);

    prepare(role(cur));
    tl = createTimeline(introSteps());
  }

  // ── Fill the frame for one role; everything it reveals starts hidden ──
  function prepare(r) {
    var g = cv.svg;
    R.list.forEach(function(x) {
      var on = x.id === r.id;
      n.cards[x.id].classList.toggle('is-active', on);
      n.cards[x.id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    n.qWho.textContent = r.label + ' ' + R.asks;
    n.qText.textContent = '';
    n.q.classList.remove('is-typed');

    n.spokes.concat(n.flows).forEach(function(p) { if (p.parentNode) p.parentNode.removeChild(p); });
    n.spokes = []; n.flows = []; n.rowState = [];
    rows.forEach(function(rw, i) {
      var a = access(r, rw.id);
      var row = n.rows[i];
      row.classList.remove('is-full', 'is-part', 'is-none');
      var old = row.querySelector('.rv-sys-st');
      if (old) row.removeChild(old);
      var st = S.el('span', 'rv-sys-st ts-hide ts-c-' + R.access[a.kind].tone);
      st.appendChild(S.icon(R.access[a.kind].icon, 'ts-ink'));
      st.appendChild(S.el('span', 'rv-sys-n', a.note));
      row.appendChild(st);
      n.rowState.push({ el: st, kind: a.kind });
      var y = rw.y + ROW.h / 2;
      var x0 = ROW.x + ROW.w + 2, x1 = READ.x - 2;
      if (a.kind === 'none') {
        // The request reaches the system and is refused: nothing comes back
        var sp = S.svg('path', { d: 'M' + x1 + ' ' + y + ' L' + (x0 + 3) + ' ' + y }, 'ts-hide ts-s-gap rv-spoke is-none');
        g.appendChild(sp);
        n.spokes.push(sp);
      } else {
        n.spokes.push(S.path(g, 'M' + x0 + ' ' + y + ' L' + (x1 - 2) + ' ' + y, 'ts-s-data rv-spoke', cv.marker('data')));
        var f = S.svg('path', { d: 'M' + x0 + ' ' + y + ' L' + (x1 - 6) + ' ' + y }, 'ts-hide rv-flow');
        g.appendChild(f);
        n.flows.push(f);
      }
    });
    ['live', 'cache'].forEach(function(m) {
      var c = reads(r, m);
      n.reads[m].textContent = R.reads.replace('{n}', c.n).replace('{t}', c.t);
      n.reads[m].classList.remove('ts-on');
    });

    n.chain.innerHTML = '';
    n.links = r.links.map(function(l) {
      var c = S.el('div', 'ts-obj ts-c-ai rv-link ts-hide ts-up');
      c.appendChild(S.el('span', 'rv-link-k', l.type));
      c.appendChild(S.el('span', 'rv-link-v', l.text));
      n.chain.appendChild(c);
      return c;
    });
    n.rule.textContent = r.rule;
    n.rule.classList.remove('ts-on');
    n.ai.textContent = r.ai;
    n.ai.classList.remove('ts-on');

    var A = r.answer;
    n.ans.innerHTML = '';
    var lead = S.el('div', 'rv-ans-lead');
    lead.appendChild(S.el('div', 'rv-ans-k', R.steps[4]));
    n.ansText = S.el('div', 'rv-ans-t ts-hide', A.text);
    lead.appendChild(n.ansText);
    n.ans.appendChild(lead);
    n.vis = visual(A.visual);
    n.ans.appendChild(n.vis);
    var notes = S.el('div', 'rv-ans-notes ts-hide');
    var ns = S.el('div', 'rv-ans-row');
    ns.appendChild(S.icon('ti-eye-off', 'rv-ans-i is-gap'));
    ns.appendChild(S.el('span', 'rv-ans-rk', R.notShownLabel));
    ns.appendChild(S.el('span', null, A.notShown));
    notes.appendChild(ns);
    var my = S.el('div', 'rv-ans-row');
    my.appendChild(S.icon('ti-user-check', 'rv-ans-i is-human'));
    my.appendChild(S.el('span', 'rv-ans-rk', R.mayLabel));
    my.appendChild(S.el('span', null, A.may));
    notes.appendChild(my);
    n.notes = notes;
    n.ans.appendChild(notes);
  }

  // A small picture per role: dots out of a total, tiles in a grid, or two rows compared
  function visual(v) {
    var b = S.el('div', 'rv-vis rv-vis-' + v.kind + ' ts-hide ts-up');
    if (v.kind === 'dots') {
      var dots = S.el('div', 'rv-dots');
      for (var i = 0; i < v.total; i++) dots.appendChild(S.el('span', 'rv-dot' + (i < v.hit ? ' is-hit' : '')));
      b.appendChild(dots);
      b.appendChild(S.el('div', 'rv-vis-cap', v.label));
    } else if (v.kind === 'tiles') {
      var grid = S.el('div', 'rv-tiles');
      v.items.forEach(function(t) {
        var tile = S.el('span', 'rv-tile ts-c-' + t.tone);
        tile.appendChild(S.el('span', 'rv-tile-dot'));
        tile.appendChild(S.el('span', 'rv-tile-l', t.label));
        grid.appendChild(tile);
      });
      b.appendChild(grid);
    } else {
      v.rows.forEach(function(x) {
        var row = S.el('div', 'rv-cmp ts-c-' + x.tone);
        row.appendChild(S.el('span', 'rv-cmp-l', x.label));
        row.appendChild(S.el('span', 'rv-cmp-v ts-ink', x.value));
        b.appendChild(row);
      });
    }
    return b;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  // ── Timelines: the frame appears once, then each role plays the same flow ──
  function roleSteps(r, t0) {
    var full = r.question;
    var steps = [];
    for (var k = TYPE.chars; k < full.length + TYPE.chars; k += TYPE.chars) {
      steps.push({ delay: t0 + 100 + (k / TYPE.chars) * TYPE.every, run: (function(m) { return function() { n.qText.textContent = full.slice(0, m); }; })(Math.min(k, full.length)) });
    }
    var t = t0 + 100 + Math.ceil(full.length / TYPE.chars) * TYPE.every;
    steps.push({ delay: t + 100, run: function() { n.q.classList.add('is-typed'); } });
    // 1 access, system by system
    rows.forEach(function(rw, i) {
      steps.push({ delay: t + 250 + i * 55, run: function() {
        var st = n.rowState[i];
        n.rows[i].classList.add('is-' + st.kind);
        S.on(st.el);
        S.on(n.spokes[i]);
      } });
    });
    var t2 = t + 250 + rows.length * 55 + 100;
    // 2 read
    steps.push({ delay: t2, run: function() { S.on(n.flows); S.on(n.reads.live); S.on(n.reads.cache); } });
    steps.push({ delay: t2 + 150, run: function() { S.on(n.joins.slice(0, 2)); } });
    // 3 connected
    r.links.forEach(function(l, i) { steps.push({ delay: t2 + 300 + i * 120, run: function() { S.on(n.links[i]); } }); });
    var t3 = t2 + 300 + r.links.length * 120 + 80;
    // 4 worked out
    steps.push({ delay: t3, run: function() { S.on(n.joins[2]); } });
    steps.push({ delay: t3 + 150, run: function() { S.on(n.rule); } });
    steps.push({ delay: t3 + 350, run: function() { S.on(n.joins[3]); } });
    steps.push({ delay: t3 + 500, run: function() { S.on(n.ai); } });
    // 5 answer
    steps.push({ delay: t3 + 700, run: function() { S.on(n.joins[4]); } });
    steps.push({ delay: t3 + 850, run: function() { S.on(n.ansText); } });
    steps.push({ delay: t3 + 1000, run: function() { S.on(n.vis); } });
    steps.push({ delay: t3 + 1150, run: function() { S.on(n.notes); S.on(n.note); } });
    steps.push({ delay: t3 + 1350, run: complete });
    return steps;
  }

  function introSteps() {
    var steps = [{ delay: 150, run: function() { S.on(n.chrome.slice(0, 4)); } }];
    n.cardList.forEach(function(c, i) { steps.push({ delay: 250 + i * 110, run: function() { S.on(c); } }); });
    steps.push({ delay: 750, run: function() { S.on(n.chrome.slice(4)); } });
    return steps.concat(roleSteps(role(cur), INTRO));
  }

  // Show one role. The frame is shown at once if it was still coming in.
  function select(id, animate) {
    if (!cv) return;
    if (tl) tl.destroy();
    cur = id;
    S.on(n.chrome); S.on(n.cardList);
    // The connectors between steps redraw with the role's flow
    n.joins.forEach(function(p) { p.setAttribute('class', p.getAttribute('class').replace(/\s*ts-on\b/g, '')); });
    prepare(role(id));
    tl = createTimeline(roleSteps(role(id), 0));
    if (animate) { cv.setStatic(false); tl.play(); }
    else { cv.setStatic(true); tl.finish(); }
  }

  return {
    play: function() { build(); cv.setStatic(false); tl.play(); },
    pause: function() { if (tl) tl.pause(); },
    resume: function() { if (tl) tl.resume(); },
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { if (tl) tl.reset(); cur = R.order[0]; build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    // Space: complete the current role first, then the next role in order, then move on
    advance: function() {
      if (!cv) return false;
      if (!done) {
        cv.setStatic(true); tl.finish();
        if (!instant()) setTimeout(function() { if (cv) cv.setStatic(false); }, 60);
        return true;
      }
      var i = R.order.indexOf(cur);
      if (i < 0 || i >= R.order.length - 1) return false;
      select(R.order[i + 1], !instant());
      return true;
    },
    current: function() { return cur; },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { if (tl) tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      var how = R.steps.slice(0, 4).join(', ') + ': ' + R.modes.live.label + ', ' + R.modes.live.text.toLowerCase() + '; ' + R.modes.cache.label + ', ' + R.modes.cache.text.toLowerCase()
        + '; ' + R.graph.label + ', ' + R.graph.text.toLowerCase() + '; ' + R.rules.label + ', ' + R.rules.text.toLowerCase() + ' ' + R.ai.label + ', ' + R.ai.text.toLowerCase();
      return how + ' ' + R.list.map(function(r) {
        var part = SYS.filter(function(s) { return access(r, s.id).kind === 'part'; }).map(function(s) { return s.system.toLowerCase() + ' (' + access(r, s.id).note.toLowerCase() + ')'; });
        var none = SYS.filter(function(s) { return access(r, s.id).kind === 'none'; }).map(function(s) { return s.system.toLowerCase(); });
        var all = reads(r);
        return r.label + ', ' + r.scope.toLowerCase() + ', ' + R.status[r.status].toLowerCase() + '. Asks: ' + r.question + ' Reads ' + all.n + ' of ' + all.t + ' systems'
          + (part.length ? '; partly ' + part.join(', ') : '') + (none.length ? '; no access to ' + none.join(', ') : '') + '. '
          + r.links.map(function(l) { return l.type.toLowerCase() + ': ' + l.text; }).join(', ') + '. ' + r.rule + '. ' + r.ai + '. Answer: ' + r.answer.text
          + ' ' + R.notShownLabel + ' ' + r.answer.notShown.toLowerCase() + '. ' + R.mayLabel + ' ' + r.answer.may.toLowerCase() + '.';
      }).join(' ') + ' ' + R.line.join(' ');
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
