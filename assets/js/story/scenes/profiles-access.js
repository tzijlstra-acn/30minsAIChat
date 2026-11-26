// Scene: profiles-access (screen 07)
// Causal story: connected on day one; the role sets the screen. Smart profiling: pick a
// role template (one per role, each used by many people). Left to right: 1 connected,
// what the identity system says about the person who joins (sign-in, the HR record, the
// access group); 2 the smart profile, built automatically: the role template, the scope
// from HR, the masked fields; 3 their screen on day one, already shaped for the role: the
// menu (what is not in the role is locked), today's queue, what is in view. Under it: the
// profile follows HR the same day when someone joins, moves or leaves. Space steps through
// the templates, then moves on; a click shows one at once.
SceneDirector.register('profiles-access', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var P = D.profiles;
  var W = 1040, H = 462;
  var TPL = { y: 0, w: 246, h: 52, step: 254 };
  var STEP = { y: 64 };
  var COL = { y: 100, h: 270 };
  var C1 = { x: 16, w: 280 }, C2 = { x: 322, w: 330 }, C3 = { x: 678, w: 346 };
  var LIFE = { y: 400, h: 52 };
  var INTRO = 1000;

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var cur = P.order[0];

  function tpl(id) { for (var i = 0; i < P.templates.length; i++) if (P.templates[i].id === id) return P.templates[i]; return P.templates[0]; }
  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }

  // ── The fixed frame: the templates, the three steps and the lifecycle ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'profiles-access', align: 'top' });
    n = { cards: {}, cardList: [], chrome: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    P.order.forEach(function(id, i) {
      var t = tpl(id);
      var b = S.el('button', 'pa-tpl ts-hide ts-up', null, { left: 16 + i * TPL.step, top: TPL.y, width: TPL.w, height: TPL.h });
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(S.icon(t.icon, 'pa-tpl-i'));
      var tx = S.el('span', 'pa-tpl-t');
      tx.appendChild(S.el('span', 'pa-tpl-n', t.role));
      tx.appendChild(S.el('span', 'pa-tpl-c', P.templatesLabel.replace('per role', '') .trim() + ' · ' + P.usedBy.replace('{n}', t.count)));
      b.appendChild(tx);
      b.addEventListener('click', function(e) { e.stopPropagation(); select(id, !instant()); });
      root.appendChild(b);
      n.cards[id] = b;
      n.cardList.push(b);
    });

    [C1, C2, C3].forEach(function(c, i) {
      var l = S.el('div', 'pa-step ts-hide', null, { left: c.x, top: STEP.y, width: c.w, height: 32 });
      l.appendChild(S.el('div', 'ts-label', P.steps[i].k));
      l.appendChild(S.el('div', 'pa-step-s', P.steps[i].sub));
      root.appendChild(l);
      n.chrome.push(l);
    });
    n.chrome.push(root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', P.tag, { left: 624, top: COL.y + COL.h + 8, width: 400 })));

    n.c1 = S.el('div', 'ts-obj ts-c-data pa-col ts-hide ts-up', null, { left: C1.x, top: COL.y, width: C1.w, height: COL.h });
    n.c2 = S.el('div', 'ts-obj ts-c-ai pa-col ts-hide ts-up', null, { left: C2.x, top: COL.y, width: C2.w, height: COL.h });
    n.c3 = S.el('div', 'ts-obj ts-c-proof pa-scr ts-hide ts-up', null, { left: C3.x, top: COL.y, width: C3.w, height: COL.h });
    root.appendChild(n.c1); root.appendChild(n.c2); root.appendChild(n.c3);
    var my = COL.y + COL.h / 2;
    n.joins = [
      S.path(g, 'M' + (C1.x + C1.w + 3) + ' ' + my + ' L' + (C2.x - 5) + ' ' + my, 'ts-s-data pa-join', cv.marker('data')),
      S.path(g, 'M' + (C2.x + C2.w + 3) + ' ' + my + ' L' + (C3.x - 5) + ' ' + my, 'ts-s-ai pa-join', cv.marker('ai'))
    ];

    // It follows HR, the same day
    n.life = S.el('div', 'ts-obj ts-c-neutral pa-life ts-hide ts-up', null, { left: 16, top: LIFE.y, width: 1008, height: LIFE.h });
    n.life.appendChild(S.el('span', 'pa-life-k', P.lifecycle.label));
    P.lifecycle.items.forEach(function(it) {
      var c = S.el('span', 'pa-life-i');
      c.appendChild(S.el('b', null, it[0]));
      c.appendChild(S.el('span', null, it[1]));
      n.life.appendChild(c);
    });
    root.appendChild(n.life);

    prepare(tpl(cur));
    tl = createTimeline(introSteps());
  }

  // ── Fill the three steps for one role template ──
  function prepare(t) {
    P.order.forEach(function(id) {
      var on = id === t.id;
      n.cards[id].classList.toggle('is-active', on);
      n.cards[id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    n.items = [];

    n.c1.innerHTML = '';
    var who = S.el('div', 'pa-joins ts-hide');
    who.appendChild(S.el('span', 'pa-avatar', t.person.initials));
    who.appendChild(S.el('span', null, P.joins.replace('{name}', t.person.name)));
    n.c1.appendChild(who);
    n.items.push(who);
    P.idm.forEach(function(it) { n.items.push(n.c1.appendChild(row(it, t.idm[it.id], it.id === 'group'))); });

    n.c2.innerHTML = '';
    P.tpl.forEach(function(it) { n.items.push(n.c2.appendChild(row(it, t.tpl[it.id], false))); });
    var auto = S.el('div', 'pa-auto ts-hide');
    auto.appendChild(S.icon('ti-sparkles'));
    auto.appendChild(S.el('span', null, P.auto));
    n.c2.appendChild(auto);
    n.items.push(auto);

    // Their screen, day one
    n.c3.innerHTML = '';
    var bar = S.el('div', 'pa-bar ts-hide');
    bar.appendChild(S.el('span', 'pa-bar-dot'));
    bar.appendChild(S.el('span', 'pa-bar-t', P.app));
    var me = S.el('span', 'pa-bar-me');
    me.appendChild(S.el('span', 'pa-avatar is-small', t.person.initials));
    me.appendChild(S.el('span', null, t.person.name));
    bar.appendChild(me);
    n.c3.appendChild(bar);
    n.items.push(bar);
    var body = S.el('div', 'pa-body');
    var menu = S.el('div', 'pa-menu ts-hide');
    P.menu.forEach(function(m, i) {
      var on = t.menu[i];
      var it = S.el('div', 'pa-menu-i' + (on ? '' : ' is-locked'));
      it.appendChild(S.icon(on ? m.icon : 'ti-lock'));
      it.appendChild(S.el('span', null, m.label));
      if (!on) it.setAttribute('title', P.lockedLabel);
      menu.appendChild(it);
    });
    body.appendChild(menu);
    n.items.push(menu);
    var main = S.el('div', 'pa-main');
    var today = S.el('div', 'pa-today ts-hide');
    today.appendChild(S.el('div', 'pa-k', P.todayLabel));
    t.today.forEach(function(x, i) { today.appendChild(S.el('div', 'pa-tile' + (i === 0 ? ' is-first' : ''), x)); });
    main.appendChild(today);
    n.items.push(today);
    var view = S.el('div', 'pa-fact ts-hide');
    view.appendChild(S.el('span', 'pa-k', P.inViewLabel));
    view.appendChild(S.el('span', 'pa-fact-v', t.inView));
    main.appendChild(view);
    n.items.push(view);
    body.appendChild(main);
    n.c3.appendChild(body);
  }

  function row(spec, value, code) {
    var b = S.el('div', 'pa-row ts-hide');
    var k = S.el('div', 'pa-idm-k');
    k.appendChild(S.icon(spec.icon, 'ts-ink'));
    k.appendChild(S.el('span', null, spec.k));
    b.appendChild(k);
    b.appendChild(S.el('div', 'pa-idm-v' + (code ? ' is-code' : ''), value));
    return b;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  function tplSteps(t0) {
    var steps = [];
    n.items.forEach(function(el, i) { steps.push({ delay: t0 + 80 + i * 80, run: function() { S.on(el); } }); });
    steps.push({ delay: t0 + 80 + n.items.length * 80 + 150, run: complete });
    return steps;
  }

  function introSteps() {
    var steps = [];
    n.cardList.forEach(function(c, i) { steps.push({ delay: 120 + i * 90, run: function() { S.on(c); } }); });
    steps.push({ delay: 450, run: function() { S.on(n.chrome); } });
    steps.push({ delay: 550, run: function() { S.on(n.c1); } });
    steps.push({ delay: 650, run: function() { S.on(n.joins[0]); S.on(n.c2); } });
    steps.push({ delay: 750, run: function() { S.on(n.joins[1]); S.on(n.c3); } });
    steps.push({ delay: 900, run: function() { S.on(n.life); } });
    return steps.concat(tplSteps(INTRO));
  }

  // Show one template. The frame is shown at once if it was still coming in.
  function select(id, animate) {
    if (!cv) return;
    if (tl) tl.destroy();
    cur = id;
    S.on(n.cardList); S.on(n.chrome); S.on([n.c1, n.c2, n.c3, n.life]); S.on(n.joins);
    prepare(tpl(id));
    tl = createTimeline(tplSteps(0));
    if (animate) { cv.setStatic(false); tl.play(); }
    else { cv.setStatic(true); tl.finish(); }
  }

  return {
    play: function() { cur = P.order[0]; build(); cv.setStatic(false); tl.play(); },
    pause: function() { if (tl) tl.pause(); },
    resume: function() { if (tl) tl.resume(); },
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { if (tl) tl.reset(); cur = P.order[0]; build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    // Space: complete the intro first, then the next template in order, then move on
    advance: function() {
      if (!cv) return false;
      if (!done) {
        cv.setStatic(true); tl.finish();
        if (!instant()) setTimeout(function() { if (cv) cv.setStatic(false); }, 60);
        return true;
      }
      var i = P.order.indexOf(cur);
      if (i < 0 || i >= P.order.length - 1) return false;
      select(P.order[i + 1], !instant());
      return true;
    },
    current: function() { return cur; },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { if (tl) tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      return P.steps.map(function(s) { return s.k + ', ' + s.sub.toLowerCase(); }).join('; ') + '. ' + P.templates.map(function(t) {
        return t.role + ', ' + P.usedBy.replace('{n}', t.count).toLowerCase() + '. ' + P.joins.replace('{name}', t.person.name) + ': '
          + P.idm.map(function(it) { return it.k + ' ' + t.idm[it.id]; }).join('; ') + '. Smart profile: '
          + P.tpl.map(function(it) { return it.k + ' ' + t.tpl[it.id]; }).join('; ') + '. Day one: '
          + P.menu.filter(function(m, i) { return t.menu[i]; }).map(function(m) { return m.label; }).join(', ')
          + (t.menu.indexOf(false) >= 0 ? '; locked: ' + P.menu.filter(function(m, i) { return !t.menu[i]; }).map(function(m) { return m.label; }).join(', ') : '')
          + '. ' + P.todayLabel + ': ' + t.today.join(', ').toLowerCase() + '. ' + P.inViewLabel + ': ' + t.inView + '.';
      }).join(' ') + ' ' + P.auto + '. ' + P.lifecycle.label + ': ' + P.lifecycle.items.map(function(x) { return x[0].toLowerCase() + ', ' + x[1].toLowerCase(); }).join('; ') + '.';
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
