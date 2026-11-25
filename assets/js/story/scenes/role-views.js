// Scene: role-views (screen 05)
// Causal story: one connected picture, and each role sees its own answer. Four roles sit in
// two groups: the Head of NFR, who leads the function, and three roles that run the work.
// The chosen role's question is typed. It travels with that user's identity to the eight
// systems screen 04 named, and each system answers only within the user's access: full,
// partial or none. So the AI sees only what the person asking may see. The records that come
// back are linked, and the answer is shaped for the role: what it shows, what it leaves out,
// and what the role may do next. Space steps through the roles in data order, then moves on;
// a click on a role card shows that role at once. Roles that are not in the product today
// say "Target design" on their card.
SceneDirector.register('role-views', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var R = D.roles;
  var SYS = D.sees.needs;
  var W = 1040, H = 520;
  var CARD = { y: 22, w: 243, h: 80, gap: 12 };
  var Q = { y: 116, h: 50 };
  var ALSO = { y: 174, h: 22 };
  var STEP = 206;
  var ROW = { x: 16, y: 228, w: 280, h: 26, gap: 4 };
  var HUB = { x: 326, y: 228, w: 284, h: 236 };
  var ANS = { x: 640, y: 228, w: 384, h: 236 };
  var NOTE = 478;
  var TYPE = { every: 30, chars: 2 };
  var INTRO = 1000;

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var cur = R.order[0];

  function role(id) { for (var i = 0; i < R.list.length; i++) if (R.list[i].id === id) return R.list[i]; return R.list[0]; }
  function cardX(i) { return 16 + i * (CARD.w + CARD.gap); }
  function rowY(i) { return ROW.y + i * (ROW.h + ROW.gap); }
  function access(r, sysId) {
    var a = r.access[sysId] || 'none';
    if (a === 'full') return { kind: 'full', note: R.access.full.label };
    if (a === 'none') return { kind: 'none', note: R.access.none.label };
    return { kind: 'part', note: a };
  }
  function reads(r) { return SYS.filter(function(s) { return access(r, s.id).kind !== 'none'; }).length; }
  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }

  // ── The fixed frame: groups, role cards, question bar, three columns, closing line ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'role-views' });
    n = { chrome: [], cards: {}, rows: [], rowState: [], spokes: [], flows: [] };
    done = false;
    var root = cv.el;

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

    n.also = S.el('div', 'rv-also ts-hide', null, { left: 16, top: ALSO.y, width: 1008, height: ALSO.h });
    root.appendChild(n.also);

    // Column labels
    [[ROW.x, ROW.w], [HUB.x, HUB.w], [ANS.x, ANS.w]].forEach(function(c, i) {
      n.chrome.push(root.appendChild(S.el('div', 'ts-label ts-hide', R.steps[i], { left: c[0], top: STEP, width: c[1] })));
    });

    // 1 Each system, with its access state
    SYS.forEach(function(s, i) {
      var row = S.el('div', 'ts-obj rv-sys ts-hide ts-left', null, { left: ROW.x, top: rowY(i), width: ROW.w, height: ROW.h });
      row.appendChild(S.el('span', 'rv-sys-l', s.system));
      root.appendChild(row);
      n.rows.push(row);
      n.chrome.push(row);
    });

    // 2 The Workspace links what came back
    n.hub = S.el('div', 'ts-obj ts-c-ai rv-hub ts-hide', null, { left: HUB.x, top: HUB.y, width: HUB.w, height: HUB.h });
    var hh = S.el('div', 'rv-hub-head');
    hh.appendChild(S.icon('ti-affiliate', 'ts-ink'));
    hh.appendChild(S.el('span', 'ts-title', R.hub.title));
    n.hub.appendChild(hh);
    n.id = S.el('div', 'ts-obj ts-c-human ts-soft rv-id ts-hide');
    var idl = S.el('div', 'rv-id-line');
    idl.appendChild(S.icon('ti-id-badge-2', 'ts-ink'));
    idl.appendChild(S.el('span', 'rv-id-k', R.hub.as));
    n.idName = S.el('span', 'rv-id-n', '');
    idl.appendChild(n.idName);
    n.id.appendChild(idl);
    n.idReads = S.el('div', 'rv-id-r', '');
    n.id.appendChild(n.idReads);
    n.hub.appendChild(n.id);
    n.chain = S.el('div', 'rv-chain');
    n.hub.appendChild(n.chain);
    root.appendChild(n.hub);
    n.chrome.push(n.hub);

    // 3 The answer, shaped for the role
    n.ans = S.el('div', 'ts-obj ts-c-proof rv-ans ts-hide', null, { left: ANS.x, top: ANS.y, width: ANS.w, height: ANS.h });
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

    n.also.classList.remove('ts-on');
    n.also.innerHTML = '';
    n.also.appendChild(S.el('span', 'ts-label', R.alsoLabel));
    r.also.forEach(function(t) { n.also.appendChild(S.el('span', 'rv-also-q', t)); });

    n.id.classList.remove('ts-on');
    n.idName.textContent = r.label;
    n.idReads.textContent = R.hub.reads.replace('{n}', reads(r)).replace('{t}', SYS.length);

    n.spokes.concat(n.flows).forEach(function(p) { if (p.parentNode) p.parentNode.removeChild(p); });
    n.spokes = []; n.flows = []; n.rowState = [];
    SYS.forEach(function(s, i) {
      var a = access(r, s.id);
      var row = n.rows[i];
      row.classList.remove('is-full', 'is-part', 'is-none');
      var old = row.querySelector('.rv-sys-st');
      if (old) row.removeChild(old);
      var st = S.el('span', 'rv-sys-st ts-hide ts-c-' + R.access[a.kind].tone);
      st.appendChild(S.icon(R.access[a.kind].icon, 'ts-ink'));
      st.appendChild(S.el('span', 'rv-sys-n', a.note));
      row.appendChild(st);
      n.rowState.push({ el: st, kind: a.kind });
      var y = rowY(i) + ROW.h / 2;
      var x0 = ROW.x + ROW.w + 2, x1 = HUB.x - 2;
      if (a.kind === 'none') {
        // The request reaches the system and is refused: nothing comes back
        var sp = S.svg('path', { d: 'M' + x1 + ' ' + y + ' L' + (x0 + 4) + ' ' + y }, 'ts-hide ts-s-gap rv-spoke is-none');
        g.appendChild(sp);
        n.spokes.push(sp);
      } else {
        n.spokes.push(S.path(g, 'M' + x0 + ' ' + y + ' L' + (x1 - 2) + ' ' + y, 'ts-s-data rv-spoke', cv.marker('data')));
        n.flows.push(S.svg('path', { d: 'M' + x0 + ' ' + y + ' L' + (x1 - 6) + ' ' + y }, 'ts-hide rv-flow'));
        g.appendChild(n.flows[n.flows.length - 1]);
      }
    });

    n.chain.innerHTML = '';
    n.links = r.links.map(function(l) {
      var c = S.el('div', 'ts-obj ts-c-data rv-link ts-hide ts-up');
      c.appendChild(S.el('span', 'rv-link-k', l.type));
      c.appendChild(S.el('span', 'rv-link-v', l.text));
      n.chain.appendChild(c);
      return c;
    });

    if (n.arrow && n.arrow.parentNode) n.arrow.parentNode.removeChild(n.arrow);
    var my = HUB.y + HUB.h / 2;
    n.arrow = S.path(g, 'M' + (HUB.x + HUB.w + 2) + ' ' + my + ' L' + (ANS.x - 4) + ' ' + my, 'ts-s-ai rv-spoke', cv.marker('ai'));

    var A = r.answer;
    n.ans.innerHTML = '';
    n.ansText = S.el('div', 'rv-ans-t ts-hide', A.text);
    n.ans.appendChild(n.ansText);
    n.vis = visual(A.visual);
    n.ans.appendChild(n.vis);
    n.notShown = S.el('div', 'rv-ans-row ts-hide');
    n.notShown.appendChild(S.icon('ti-eye-off', 'rv-ans-i is-gap'));
    n.notShown.appendChild(S.el('span', 'rv-ans-k', R.notShownLabel));
    n.notShown.appendChild(S.el('span', null, A.notShown));
    n.ans.appendChild(n.notShown);
    n.may = S.el('div', 'rv-ans-row ts-hide');
    n.may.appendChild(S.icon('ti-user-check', 'rv-ans-i is-human'));
    n.may.appendChild(S.el('span', 'rv-ans-k', R.mayLabel));
    n.may.appendChild(S.el('span', null, A.may));
    n.ans.appendChild(n.may);
    n.method = S.el('div', 'rv-ans-m ts-hide', R.method);
    n.ans.appendChild(n.method);
  }

  // A small picture per role: dots out of a total, tiles in a grid, or two rows compared
  function visual(v) {
    var box = S.el('div', 'rv-vis rv-vis-' + v.kind + ' ts-hide ts-up');
    if (v.kind === 'dots') {
      var dots = S.el('div', 'rv-dots');
      for (var i = 0; i < v.total; i++) dots.appendChild(S.el('span', 'rv-dot' + (i < v.hit ? ' is-hit' : '')));
      box.appendChild(dots);
      box.appendChild(S.el('div', 'rv-vis-cap', v.label));
    } else if (v.kind === 'tiles') {
      var grid = S.el('div', 'rv-tiles');
      v.items.forEach(function(t) {
        var tile = S.el('span', 'rv-tile ts-c-' + t.tone);
        tile.appendChild(S.el('span', 'rv-tile-dot'));
        tile.appendChild(S.el('span', 'rv-tile-l', t.label));
        grid.appendChild(tile);
      });
      box.appendChild(grid);
    } else {
      v.rows.forEach(function(x) {
        var row = S.el('div', 'rv-cmp ts-c-' + x.tone);
        row.appendChild(S.el('span', 'rv-cmp-l', x.label));
        row.appendChild(S.el('span', 'rv-cmp-v ts-ink', x.value));
        box.appendChild(row);
      });
    }
    return box;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  // ── Timelines: the frame appears once, then each role plays the same sequence ──
  function roleSteps(r, t0) {
    var full = r.question;
    var steps = [];
    for (var k = TYPE.chars; k < full.length + TYPE.chars; k += TYPE.chars) {
      steps.push({ delay: t0 + 100 + (k / TYPE.chars) * TYPE.every, run: (function(m) { return function() { n.qText.textContent = full.slice(0, m); }; })(Math.min(k, full.length)) });
    }
    var t = t0 + 100 + Math.ceil(full.length / TYPE.chars) * TYPE.every;
    steps.push({ delay: t + 100, run: function() { n.q.classList.add('is-typed'); S.on(n.also); } });
    steps.push({ delay: t + 250, run: function() { S.on(n.id); } });
    SYS.forEach(function(s, i) {
      steps.push({ delay: t + 400 + i * 60, run: function() {
        var st = n.rowState[i];
        n.rows[i].classList.add('is-' + st.kind);
        S.on(st.el);
        S.on(n.spokes[i]);
      } });
    });
    var t2 = t + 400 + SYS.length * 60 + 120;
    steps.push({ delay: t2, run: function() { S.on(n.flows); } });
    r.links.forEach(function(l, i) { steps.push({ delay: t2 + 100 + i * 120, run: function() { S.on(n.links[i]); } }); });
    var t3 = t2 + 100 + r.links.length * 120 + 100;
    steps.push({ delay: t3, run: function() { S.on(n.arrow); } });
    steps.push({ delay: t3 + 200, run: function() { S.on(n.ansText); } });
    steps.push({ delay: t3 + 400, run: function() { S.on(n.vis); } });
    steps.push({ delay: t3 + 600, run: function() { S.on(n.notShown); S.on(n.may); S.on(n.method); S.on(n.note); } });
    steps.push({ delay: t3 + 800, run: complete });
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
      return R.list.map(function(r) {
        var part = SYS.filter(function(s) { return access(r, s.id).kind === 'part'; }).map(function(s) { return s.system.toLowerCase() + ' (' + access(r, s.id).note.toLowerCase() + ')'; });
        var none = SYS.filter(function(s) { return access(r, s.id).kind === 'none'; }).map(function(s) { return s.system.toLowerCase(); });
        return r.label + ', ' + r.scope.toLowerCase() + ', ' + R.status[r.status].toLowerCase() + '. Asks: ' + r.question + ' Reads ' + reads(r) + ' of ' + SYS.length + ' systems'
          + (part.length ? '; partly ' + part.join(', ') : '') + (none.length ? '; no access to ' + none.join(', ') : '') + '. '
          + r.links.map(function(l) { return l.type.toLowerCase() + ': ' + l.text; }).join(', ') + '. Answer: ' + r.answer.text
          + ' ' + R.notShownLabel + ' ' + r.answer.notShown.toLowerCase() + '. ' + R.mayLabel + ' ' + r.answer.may.toLowerCase() + '.';
      }).join(' ') + ' ' + R.method + ' ' + R.line.join(' ');
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
