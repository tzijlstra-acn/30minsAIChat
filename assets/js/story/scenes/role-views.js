// Scene: role-views (screen 05)
// Causal story: one question, and how it is answered, at the depth the audience wants.
// Pick a role (the Head of NFR, who leads the function, or one of three roles that run the
// work); the role's question is typed. Then pick a depth, and the layers beneath the screen
// fold out:
//   Light   what the person sees: the answer, its picture and three buttons;
//   Medium  where it comes from: each of screen 03's eight systems checks the person's
//           access, then is read live or from a dated cache; the knowledge graph links the
//           records; rules calculate and AI explains, each claim cited;
//   Deep    how it runs: each button is defined once (what it reads, calculates and
//           writes); what is stored, with versions; what is written back, and only once a
//           person approves.
// A click on a button lights the systems, the calculation and the write-back that button
// uses. Space unfolds the next depth, then moves on; the depth buttons fold back.
SceneDirector.register('role-views', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var R = D.roles;
  var W = 1040, H = 520;
  var ROLE = { y: 0, w: 246, h: 44, step: 254 };
  var Q = { y: 54, h: 44, w: 704 };
  var TOG = { x: 730, y: 54, w: 294, h: 44 };
  var TOP = 108, GAP = 6, FOLD = 22;
  // Open heights per layer; the screen takes what is left
  var OPEN = { route: 50, read: 64, connect: 44, compute: 56, store: 48, write: 52 };
  var TYPE = { every: 30, chars: 2 };
  var INTRO = 900;
  var DEPTHS = R.depths.map(function(d) { return d.id; });
  var SYS = ['live', 'cache'].reduce(function(acc, m) {
    return acc.concat(D.sees.needs.filter(function(s) { return R.modeOf[s.id] === m; }));
  }, []);

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var cur = R.order[0];
  var depth = DEPTHS[0];
  var out = 0;

  function role(id) { for (var i = 0; i < R.list.length; i++) if (R.list[i].id === id) return R.list[i]; return R.list[0]; }
  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }
  function open(layer, d) { return DEPTHS.indexOf(layer.depth) <= DEPTHS.indexOf(d); }
  function access(r, sysId) {
    var a = r.access[sysId] || 'none';
    if (a === 'full') return { kind: 'full', note: null };
    if (a === 'none') return { kind: 'none', note: R.access.none.label };
    return { kind: 'part', note: a };
  }
  function depthOf(id) { for (var i = 0; i < R.depths.length; i++) if (R.depths[i].id === id) return R.depths[i]; return R.depths[0]; }

  // Where each layer sits at a depth: open layers at their height, the others folded
  function layout(d) {
    var rest = 0, gaps = (R.layers.length - 1) * GAP;
    R.layers.forEach(function(l) { if (l.id !== 'screen') rest += open(l, d) ? OPEN[l.id] : FOLD; });
    var y = TOP, geo = {};
    R.layers.forEach(function(l) {
      var h = l.id === 'screen' ? (H - TOP - gaps - rest) : (open(l, d) ? OPEN[l.id] : FOLD);
      geo[l.id] = { top: y, height: h, open: open(l, d) };
      y += h + GAP;
    });
    return geo;
  }

  // ── The fixed frame: role buttons, question, depth switch and the seven layers ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'role-views', align: 'top' });
    n = { cards: {}, cardList: [], segs: {}, bands: {}, sys: {}, outs: [] };
    done = false;
    var root = cv.el;
    root.classList.add('rx');
    root.setAttribute('data-depth', depth);

    R.list.forEach(function(r, i) {
      var b = S.el('button', 'rv-role rx-role ts-hide ts-up' + (r.group === 'lead' ? ' is-lead' : ''), null, { left: 16 + i * ROLE.step, top: ROLE.y, width: ROLE.w, height: ROLE.h });
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      var head = S.el('span', 'rv-role-head');
      head.appendChild(S.icon(r.icon, 'rv-role-icon'));
      head.appendChild(S.el('span', 'rv-role-l', r.label));
      b.appendChild(head);
      b.appendChild(S.el('span', 'rv-role-t is-' + r.status, R.status[r.status]));
      b.addEventListener('click', function(e) { e.stopPropagation(); select(r.id, !instant()); });
      root.appendChild(b);
      n.cards[r.id] = b;
      n.cardList.push(b);
    });

    // The question, typed as the chosen role asks it
    n.q = S.el('div', 'ts-obj ts-c-ai ts-soft rx-q ts-hide ts-pop', null, { left: 16, top: Q.y, width: Q.w, height: Q.h });
    n.q.appendChild(S.icon('ti-search', 'rx-q-icon ts-ink'));
    var qb = S.el('div', 'rx-q-body');
    n.qWho = S.el('div', 'rx-q-who', '');
    qb.appendChild(n.qWho);
    var line = S.el('div', 'rx-q-line');
    n.qText = S.el('span', 'rx-q-t', '');
    line.appendChild(n.qText);
    line.appendChild(S.el('span', 'ah-caret'));
    qb.appendChild(line);
    n.q.appendChild(qb);
    root.appendChild(n.q);

    // Light, Medium, Deep
    n.tog = S.el('div', 'rx-tog ts-hide ts-pop', null, { left: TOG.x, top: TOG.y, width: TOG.w, height: TOG.h });
    n.tog.setAttribute('role', 'group');
    n.tog.setAttribute('aria-label', R.depthLabel);
    R.depths.forEach(function(d) {
      var b = S.el('button', 'rx-seg');
      b.type = 'button';
      b.setAttribute('data-depth', d.id);
      b.appendChild(S.el('span', 'rx-seg-l', d.label));
      b.appendChild(S.el('span', 'rx-seg-s', d.sub));
      b.addEventListener('click', function(e) { e.stopPropagation(); setDepth(d.id, !instant()); });
      n.tog.appendChild(b);
      n.segs[d.id] = b;
    });
    root.appendChild(n.tog);

    // The layers, top to bottom
    var geo = layout(depth);
    R.layers.forEach(function(l) {
      var g = geo[l.id];
      var b = S.el('div', 'ts-obj rx-band rx-' + l.id + ' ts-hide' + (g.open ? '' : ' is-folded'), null, { left: 16, top: g.top, width: 1008, height: g.height });
      b.setAttribute('data-layer', l.id);
      var head = S.el('div', 'rx-head');
      var hl = S.el('div', 'rx-head-l');
      hl.appendChild(S.icon(l.icon, 'rx-head-i'));
      hl.appendChild(S.el('span', 'rx-head-t', l.label));
      head.appendChild(hl);
      head.appendChild(S.el('div', 'rx-head-s', l.sub));
      if (l.id === 'read') {
        var lg = S.el('div', 'rx-legend');
        ['live', 'cache'].forEach(function(m) {
          var k = S.el('span', 'rx-legend-k');
          k.appendChild(S.icon(R.modes[m].icon, 'rx-mode'));
          k.appendChild(S.el('span', null, R.modes[m].label));
          lg.appendChild(k);
        });
        head.appendChild(lg);
      }
      b.appendChild(head);
      if (l.id !== 'screen') {
        var tag = S.el('div', 'rx-fold');
        tag.appendChild(S.el('span', null, R.opensAt + ' ' + depthOf(l.depth).label));
        tag.appendChild(S.icon('ti-chevron-down'));
        b.appendChild(tag);
        // A folded layer opens at its depth
        b.addEventListener('click', function(e) { if (b.classList.contains('is-folded')) { e.stopPropagation(); setDepth(l.depth, !instant()); } });
      }
      var body = S.el('div', 'rx-body rx-body-' + l.id);
      b.appendChild(body);
      root.appendChild(b);
      n.bands[l.id] = { el: b, body: body };
    });

    prepare(role(cur));
    paintDepth();
    tl = createTimeline(introSteps());
  }

  // ── Fill the layers for one role; what each role reveals starts hidden ──
  function prepare(r) {
    out = 0;
    R.list.forEach(function(x) {
      var on = x.id === r.id;
      n.cards[x.id].classList.toggle('is-active', on);
      n.cards[x.id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    n.qWho.textContent = [r.label, R.groups[r.group], r.scope].join(' · ');
    n.qText.textContent = '';
    n.q.classList.remove('is-typed');
    n.reveal = [];

    // On the screen: the answer, its picture, the buttons and what is not shown
    var sb = n.bands.screen.body;
    sb.innerHTML = '';
    var main = S.el('div', 'rx-sb-main');
    n.ansText = S.el('div', 'rx-ans-t ts-hide', r.answer.text);
    main.appendChild(n.ansText);
    n.vis = visual(r.answer.visual);
    main.appendChild(n.vis);
    sb.appendChild(main);
    var outs = S.el('div', 'rx-outs');
    n.outs = r.outputs.map(function(o, i) {
      var b = S.el('button', 'rx-out ts-hide ts-up is-' + o.kind);
      b.type = 'button';
      b.appendChild(S.icon(o.icon, 'rx-out-i'));
      b.appendChild(S.el('span', 'rx-out-l', o.label));
      b.appendChild(S.el('span', 'rx-out-k', R.kinds[o.kind]));
      b.addEventListener('click', function(e) { e.stopPropagation(); pick(i); });
      outs.appendChild(b);
      return b;
    });
    sb.appendChild(outs);
    n.notes = S.el('div', 'rx-notes ts-hide');
    [['ti-eye-off', 'is-gap', R.notShownLabel, r.answer.notShown], ['ti-user-check', 'is-human', R.mayLabel, r.answer.may]].forEach(function(x) {
      var row = S.el('span', 'rx-note');
      row.appendChild(S.icon(x[0], 'rx-note-i ' + x[1]));
      row.appendChild(S.el('span', 'rx-note-k', x[2]));
      row.appendChild(S.el('span', null, x[3]));
      n.notes.appendChild(row);
    });
    sb.appendChild(n.notes);

    // Read: each system with the person's access, and how it is read
    var rb = n.bands.read.body;
    rb.innerHTML = '';
    n.sys = {};
    var grid = S.el('div', 'rx-sys-grid');
    SYS.forEach(function(s) {
      var a = access(r, s.id);
      var c = S.el('div', 'rx-sys ts-hide is-' + a.kind);
      c.setAttribute('data-sys', s.id);
      c.appendChild(S.icon(R.modes[R.modeOf[s.id]].icon, 'rx-mode'));
      c.appendChild(S.el('span', 'rx-sys-l', R.short[s.id]));
      var st = S.el('span', 'rx-sys-st ts-c-' + R.access[a.kind].tone);
      st.appendChild(S.icon(R.access[a.kind].icon, 'ts-ink'));
      if (a.note) st.appendChild(S.el('span', 'rx-sys-n', a.note));
      c.appendChild(st);
      grid.appendChild(c);
      n.sys[s.id] = c;
    });
    rb.appendChild(grid);

    // Connect: the knowledge graph links the records
    var kb = n.bands.connect.body;
    kb.innerHTML = '';
    n.links = r.links.map(function(l) {
      var c = S.el('div', 'rx-link ts-hide ts-left');
      c.appendChild(S.el('span', 'rx-link-k', l.type));
      c.appendChild(S.el('span', 'rx-link-v', l.text));
      kb.appendChild(c);
      return c;
    });

    // Compute: rules first, then AI
    var cb = n.bands.compute.body;
    cb.innerHTML = '';
    n.rule = calc('rx-calc-rule ts-c-data', R.rules, r.rule);
    n.ai = calc('rx-calc-ai ts-c-ai', R.ai, r.ai);
    cb.appendChild(n.rule);
    cb.appendChild(n.ai);

    n.reveal = [n.ansText, n.vis].concat(n.outs, [n.notes]);
    paintOutput();
  }

  function calc(cls, spec, fact) {
    var b = S.el('div', 'rx-calc ' + cls + ' ts-hide');
    var h = S.el('div', 'rx-calc-h');
    h.appendChild(S.el('span', 'rx-calc-t ts-ink', spec.label));
    h.appendChild(S.el('span', 'rx-calc-x', spec.text));
    b.appendChild(h);
    b.appendChild(S.el('div', 'rx-calc-f', fact));
    return b;
  }

  // A small picture per role: dots out of a total, tiles in a grid, or two rows compared
  function visual(v) {
    var b = S.el('div', 'rx-vis rx-vis-' + v.kind + ' ts-hide ts-up');
    if (v.kind === 'dots') {
      var dots = S.el('div', 'rx-dots');
      for (var i = 0; i < v.total; i++) dots.appendChild(S.el('span', 'rx-dot' + (i < v.hit ? ' is-hit' : '')));
      b.appendChild(dots);
      b.appendChild(S.el('div', 'rx-vis-cap', v.label));
    } else if (v.kind === 'tiles') {
      var grid = S.el('div', 'rx-tiles');
      v.items.forEach(function(t) {
        var tile = S.el('span', 'rx-tile ts-c-' + t.tone);
        tile.appendChild(S.el('span', 'rx-tile-dot'));
        tile.appendChild(S.el('span', 'rx-tile-l', t.label));
        grid.appendChild(tile);
      });
      b.appendChild(grid);
    } else {
      v.rows.forEach(function(x) {
        var row = S.el('div', 'rx-cmp ts-c-' + x.tone);
        row.appendChild(S.el('span', 'rx-cmp-l', x.label));
        row.appendChild(S.el('span', 'rx-cmp-v ts-ink', x.value));
        b.appendChild(row);
      });
    }
    return b;
  }

  // ── One button: what it reads, calculates, stores and writes ──
  function paintOutput() {
    var r = role(cur);
    var o = r.outputs[out];
    n.outs.forEach(function(b, i) { b.classList.toggle('is-sel', i === out); b.setAttribute('aria-pressed', i === out ? 'true' : 'false'); });
    SYS.forEach(function(s) {
      var c = n.sys[s.id];
      var used = o.reads.indexOf(s.id) >= 0;
      c.classList.toggle('is-used', used);
      c.classList.toggle('is-idle', !used && access(r, s.id).kind !== 'none');
    });
    n.rule.classList.toggle('is-idle', !o.rule);
    n.ai.classList.toggle('is-idle', o.kind === 'view');

    // Route: the button's definition
    var rt = n.bands.route.body;
    rt.innerHTML = '';
    var row = S.el('div', 'rx-route');
    var name = S.el('span', 'rx-route-o');
    name.appendChild(S.icon(o.icon, 'rx-out-i'));
    name.appendChild(S.el('span', null, o.label));
    row.appendChild(name);
    row.appendChild(S.icon('ti-arrow-right', 'rx-route-arr'));
    row.appendChild(S.el('span', 'rx-route-def', o.def));
    [R.route.reads.replace('{n}', o.reads.length), o.rule || R.route.noRule, R.route.ai[o.kind],
      o.write ? R.route.write.replace('{to}', o.write.to) : R.route.noWrite].forEach(function(t, i) {
      row.appendChild(S.el('span', 'rx-chip' + (i === 3 && o.write ? ' is-write' : ''), t));
    });
    rt.appendChild(row);
    rt.appendChild(S.el('div', 'rx-route-new', R.route.fresh));

    // Store: this answer, the dated index and the audit log
    var st = n.bands.store.body;
    st.innerHTML = '';
    R.store.forEach(function(x) {
      var c = S.el('div', 'rx-store');
      c.appendChild(S.el('span', 'rx-store-k', x.k));
      c.appendChild(S.el('span', 'rx-store-v', x.text || o.store));
      st.appendChild(c);
    });

    // Write back: only once a person approves
    var wb = n.bands.write.body;
    wb.innerHTML = '';
    var wr = S.el('div', 'rx-write');
    if (o.write) {
      var to = S.el('span', 'rx-write-to');
      to.appendChild(S.icon('ti-database', 'rx-write-i'));
      to.appendChild(S.el('span', null, o.write.to));
      wr.appendChild(to);
      wr.appendChild(S.icon('ti-arrow-left', 'rx-route-arr'));
      wr.appendChild(S.el('span', 'rx-write-what', o.write.what));
      var gate = S.el('span', 'rx-write-gate');
      gate.appendChild(S.icon('ti-user-check', 'rx-write-i'));
      gate.appendChild(S.el('span', null, o.write.gate));
      wr.appendChild(gate);
    } else {
      wr.appendChild(S.el('span', 'rx-write-none', R.write.none));
    }
    wb.appendChild(wr);
    wb.appendChild(S.el('div', 'rx-route-new', R.write.note));
  }

  function pick(i) {
    if (!cv) return;
    out = i;
    paintOutput();
  }

  // ── Depth: open the layers that belong to it, fold the others ──
  function paintDepth() {
    var geo = layout(depth);
    cv.el.setAttribute('data-depth', depth);
    R.depths.forEach(function(d) {
      var on = d.id === depth;
      n.segs[d.id].classList.toggle('is-on', on);
      n.segs[d.id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var k = 0;
    R.layers.forEach(function(l) {
      var b = n.bands[l.id], g = geo[l.id];
      var was = !b.el.classList.contains('is-folded');
      b.el.style.top = g.top + 'px';
      b.el.style.height = g.height + 'px';
      b.el.classList.toggle('is-folded', !g.open);
      // Layers that open now unfold one after another, top to bottom
      b.body.style.transitionDelay = g.open && !was ? (0.18 + 0.09 * k++) + 's' : '';
    });
  }

  function setDepth(d, animate) {
    if (!cv || DEPTHS.indexOf(d) < 0) return;
    if (!done && tl) { tl.finish(); }
    depth = d;
    cv.setStatic(!animate);
    paintDepth();
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  // ── Timelines: the frame appears once, then each role types its question and answers ──
  function roleSteps(r, t0) {
    var full = r.question;
    var steps = [];
    for (var k = TYPE.chars; k < full.length + TYPE.chars; k += TYPE.chars) {
      steps.push({ delay: t0 + 100 + (k / TYPE.chars) * TYPE.every, run: (function(m) { return function() { n.qText.textContent = full.slice(0, m); }; })(Math.min(k, full.length)) });
    }
    var t = t0 + 100 + Math.ceil(full.length / TYPE.chars) * TYPE.every;
    steps.push({ delay: t + 100, run: function() { n.q.classList.add('is-typed'); } });
    // The layers beneath fill top to bottom, whether they are open or folded
    SYS.forEach(function(s, i) { steps.push({ delay: t + 150 + i * 40, run: function() { S.on(n.sys[s.id]); } }); });
    n.links.forEach(function(c, i) { steps.push({ delay: t + 300 + i * 80, run: function() { S.on(c); } }); });
    steps.push({ delay: t + 500, run: function() { S.on(n.rule); } });
    steps.push({ delay: t + 650, run: function() { S.on(n.ai); } });
    // Then the answer on the screen
    n.reveal.forEach(function(el, i) { steps.push({ delay: t + 300 + i * 130, run: function() { S.on(el); } }); });
    steps.push({ delay: t + 300 + n.reveal.length * 130 + 150, run: complete });
    return steps;
  }

  function introSteps() {
    var steps = [];
    n.cardList.forEach(function(c, i) { steps.push({ delay: 120 + i * 90, run: function() { S.on(c); } }); });
    steps.push({ delay: 450, run: function() { S.on(n.q); S.on(n.tog); } });
    R.layers.forEach(function(l, i) { steps.push({ delay: 550 + i * 50, run: function() { S.on(n.bands[l.id].el); } }); });
    return steps.concat(roleSteps(role(cur), INTRO));
  }

  // Show one role at the current depth. The frame is shown at once if it was still coming in.
  function select(id, animate) {
    if (!cv) return;
    if (tl) tl.destroy();
    cur = id;
    S.on(n.cardList); S.on(n.q); S.on(n.tog);
    R.layers.forEach(function(l) { S.on(n.bands[l.id].el); });
    prepare(role(id));
    tl = createTimeline(roleSteps(role(id), 0));
    if (animate) { cv.setStatic(false); tl.play(); }
    else { cv.setStatic(true); tl.finish(); }
  }

  return {
    play: function() { depth = DEPTHS[0]; build(); cv.setStatic(false); tl.play(); },
    pause: function() { if (tl) tl.pause(); },
    resume: function() { if (tl) tl.resume(); },
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { if (tl) tl.reset(); cur = R.order[0]; depth = DEPTHS[0]; build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    // Space: complete the intro first, then unfold the next depth, then move on
    advance: function() {
      if (!cv) return false;
      if (!done) {
        cv.setStatic(true); tl.finish();
        if (!instant()) setTimeout(function() { if (cv) cv.setStatic(false); }, 60);
        return true;
      }
      var i = DEPTHS.indexOf(depth);
      if (i >= DEPTHS.length - 1) return false;
      setDepth(DEPTHS[i + 1], !instant());
      return true;
    },
    current: function() { return cur; },
    depth: function() { return depth; },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { if (tl) tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      var how = R.depths.map(function(d) {
        return d.label + ', ' + d.sub.toLowerCase() + ': ' + R.layers.filter(function(l) { return l.depth === d.id; }).map(function(l) { return l.label.toLowerCase() + ' (' + l.sub.toLowerCase() + ')'; }).join(', ');
      }).join('. ') + '. ' + R.modes.live.label + ': ' + R.modes.live.text.toLowerCase() + '. ' + R.modes.cache.label + ': ' + R.modes.cache.text.toLowerCase()
        + '. ' + R.rules.label + ': ' + R.rules.text.toLowerCase() + ' ' + R.ai.label + ': ' + R.ai.text.toLowerCase() + ' ' + R.route.fresh;
      return how + ' ' + R.list.map(function(r) {
        var part = SYS.filter(function(s) { return access(r, s.id).kind === 'part'; }).map(function(s) { return s.system.toLowerCase() + ' (' + access(r, s.id).note.toLowerCase() + ')'; });
        var none = SYS.filter(function(s) { return access(r, s.id).kind === 'none'; }).map(function(s) { return s.system.toLowerCase(); });
        return r.label + ', ' + R.groups[r.group].toLowerCase() + ', ' + r.scope.toLowerCase() + ', ' + R.status[r.status].toLowerCase() + '. Asks: ' + r.question
          + (part.length ? ' Partial access to ' + part.join(', ') + '.' : '') + (none.length ? ' No access to ' + none.join(', ') + '.' : '')
          + ' Answer: ' + r.answer.text + ' ' + R.notShownLabel + ' ' + r.answer.notShown.toLowerCase() + '. Buttons: ' + r.outputs.map(function(o) {
            return o.label + ' (' + R.kinds[o.kind].toLowerCase() + ', defined as ' + o.def + ', reads ' + o.reads.map(function(id) { return R.short[id].toLowerCase(); }).join(', ')
              + (o.rule ? ', calculates ' + o.rule.toLowerCase() : '') + ', ' + R.route.ai[o.kind].toLowerCase() + ', '
              + (o.write ? 'writes to ' + o.write.to + ': ' + o.write.what.toLowerCase() + ', ' + o.write.gate.toLowerCase() : 'writes nothing') + ')';
          }).join('; ') + '. Linked: ' + r.links.map(function(l) { return l.type.toLowerCase() + ', ' + l.text; }).join('; ') + '. ' + r.rule + '. ' + r.ai + '.';
      }).join(' ') + ' ' + R.line.join(' ');
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
