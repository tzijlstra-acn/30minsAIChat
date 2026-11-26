// Scene: profiles-access (screen 08)
// Causal story: every person gets one profile, built from the bank's identity system, and
// the profile decides their screen. Pick a person. Left to right: 1 what comes from the
// identity system (sign-in, the HR record, the access groups; joiners, movers and leavers
// follow HR); 2 the profile in six levels, coarse to fine: role, scope, records, fields,
// actions, delegation, each with where it comes from; 3 their screen: the menu (what is not
// in the profile is locked), today's queue, what is in view and what is masked. Switching
// person marks the levels that changed: Maya and Ben share a role, not a scope. Under it,
// how the data knows where it belongs: tagged at the source, mapped once, inherited by new
// records, checked at every read. Space steps through the people, then moves on.
SceneDirector.register('profiles-access', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var P = D.profiles;
  var W = 1040, H = 476;
  var PEOPLE = { y: 0, w: 246, h: 46, step: 254 };
  var COL = { label: 58, y: 78, h: 300 };
  var IDM = { x: 16, w: 232 };
  var PRO = { x: 274, w: 404 };
  var SCR = { x: 704, w: 320 };
  var DATA = { label: 394, y: 414, h: 58, w: 237, gap: 20 };
  var INTRO = 1100;

  var cv = null;
  var n = {};
  var tl = null;
  var done = false;
  var cur = P.order[0];
  var prev = null;

  function person(id) { for (var i = 0; i < P.people.length; i++) if (P.people[i].id === id) return P.people[i]; return P.people[0]; }
  function instant() { return !!reduced || !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced()); }

  // ── The fixed frame: people, the three columns and the data strip ──
  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'profiles-access', align: 'top' });
    n = { cards: {}, cardList: [], chrome: [], data: [] };
    done = false;
    prev = null;
    var root = cv.el;
    var g = cv.svg;

    P.people.forEach(function(x, i) {
      var b = S.el('button', 'pa-person ts-hide ts-up', null, { left: 16 + i * PEOPLE.step, top: PEOPLE.y, width: PEOPLE.w, height: PEOPLE.h });
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(S.el('span', 'pa-avatar', x.initials));
      var t = S.el('span', 'pa-person-t');
      var nm = S.el('span', 'pa-person-n');
      nm.appendChild(S.el('span', null, x.name));
      nm.appendChild(S.el('span', 'pa-person-s', x.scope));
      t.appendChild(nm);
      t.appendChild(S.el('span', 'pa-person-r', x.role));
      b.appendChild(t);
      b.addEventListener('click', function(e) { e.stopPropagation(); select(x.id, !instant()); });
      root.appendChild(b);
      n.cards[x.id] = b;
      n.cardList.push(b);
    });

    [[IDM.x, IDM.w], [PRO.x, PRO.w], [SCR.x, SCR.w]].forEach(function(c, i) {
      n.chrome.push(root.appendChild(S.el('div', 'ts-label ts-hide', P.cols[i], { left: c[0], top: COL.label, width: c[1] })));
    });
    // The tag sits on the data strip's label row, clear of the column labels
    n.chrome.push(root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', P.tag, { left: 624, top: DATA.label, width: 400 })));

    n.idm = S.el('div', 'ts-obj ts-c-data pa-idm ts-hide ts-up', null, { left: IDM.x, top: COL.y, width: IDM.w, height: COL.h });
    n.pro = S.el('div', 'ts-obj ts-c-ai pa-pro ts-hide ts-up', null, { left: PRO.x, top: COL.y, width: PRO.w, height: COL.h });
    n.scr = S.el('div', 'ts-obj ts-c-proof pa-scr ts-hide ts-up', null, { left: SCR.x, top: COL.y, width: SCR.w, height: COL.h });
    root.appendChild(n.idm);
    root.appendChild(n.pro);
    root.appendChild(n.scr);
    var my = COL.y + COL.h / 2;
    n.joins = [
      S.path(g, 'M' + (IDM.x + IDM.w + 3) + ' ' + my + ' L' + (PRO.x - 5) + ' ' + my, 'ts-s-data pa-join', cv.marker('data')),
      S.path(g, 'M' + (PRO.x + PRO.w + 3) + ' ' + my + ' L' + (SCR.x - 5) + ' ' + my, 'ts-s-ai pa-join', cv.marker('ai'))
    ];

    // How the data knows where it belongs
    n.dataLabel = root.appendChild(S.el('div', 'ts-label ts-hide', P.data.label, { left: 16, top: DATA.label, width: 600 }));
    P.data.steps.forEach(function(st, i) {
      var x = 16 + i * (DATA.w + DATA.gap);
      var b = S.el('div', 'ts-obj ts-c-neutral pa-data ts-hide ts-up', null, { left: x, top: DATA.y, width: DATA.w, height: DATA.h });
      b.appendChild(S.icon(st.icon, 'pa-data-i'));
      var t = S.el('div', 'pa-data-b');
      t.appendChild(S.el('div', 'pa-data-k', st.k));
      t.appendChild(S.el('div', 'pa-data-t', st.text));
      b.appendChild(t);
      root.appendChild(b);
      n.data.push(b);
      if (i < P.data.steps.length - 1) {
        var a = S.el('div', 'ab-arrow pa-data-arr ts-hide', null, { left: x + DATA.w, top: DATA.y + DATA.h / 2 - 10, width: DATA.gap, height: 20 });
        a.appendChild(S.icon('ti-chevron-right'));
        root.appendChild(a);
        n.data.push(a);
      }
    });

    prepare(person(cur));
    tl = createTimeline(introSteps());
  }

  // ── Fill the three columns for one person; marks the levels that changed ──
  function prepare(x) {
    var before = prev ? person(prev) : null;
    P.people.forEach(function(y) {
      var on = y.id === x.id;
      n.cards[y.id].classList.toggle('is-active', on);
      n.cards[y.id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    n.items = [];

    n.idm.innerHTML = '';
    P.idm.forEach(function(it) {
      var b = S.el('div', 'pa-idm-row ts-hide');
      var k = S.el('div', 'pa-idm-k');
      k.appendChild(S.icon(it.icon, 'ts-ink'));
      k.appendChild(S.el('span', null, it.k));
      b.appendChild(k);
      b.appendChild(S.el('div', 'pa-idm-v' + (it.id === 'groups' ? ' is-code' : ''), x.idm[it.id]));
      n.idm.appendChild(b);
      n.items.push(b);
    });

    n.pro.innerHTML = '';
    n.changed = [];
    P.levels.forEach(function(l, i) {
      var changed = !!before && before.levels[l.id] !== x.levels[l.id];
      var r = S.el('div', 'pa-lvl ts-hide' + (changed ? ' is-changed' : ''));
      r.setAttribute('data-level', l.id);
      var k = S.el('div', 'pa-lvl-k');
      k.appendChild(S.el('span', 'pa-lvl-t', (i + 1) + ' ' + l.label));
      if (changed) k.appendChild(S.el('span', 'pa-lvl-c', P.changedLabel));
      r.appendChild(k);
      var v = S.el('div', 'pa-lvl-b');
      v.appendChild(S.el('div', 'pa-lvl-v', x.levels[l.id]));
      v.appendChild(S.el('div', 'pa-lvl-f', l.from));
      r.appendChild(v);
      n.pro.appendChild(r);
      n.items.push(r);
      if (changed) n.changed.push(l.id);
    });

    // Their screen: the menu, the queue, what is in view and what is masked
    n.scr.innerHTML = '';
    var bar = S.el('div', 'pa-bar ts-hide');
    bar.appendChild(S.el('span', 'pa-bar-dot'));
    bar.appendChild(S.el('span', 'pa-bar-t', P.app));
    var me = S.el('span', 'pa-bar-me');
    me.appendChild(S.el('span', 'pa-avatar is-small', x.initials));
    me.appendChild(S.el('span', null, x.name));
    bar.appendChild(me);
    n.scr.appendChild(bar);
    n.items.push(bar);
    var body = S.el('div', 'pa-body');
    var menu = S.el('div', 'pa-menu ts-hide');
    P.menu.forEach(function(m, i) {
      var on = x.menu[i];
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
    x.today.forEach(function(t, i) { today.appendChild(S.el('div', 'pa-tile' + (i === 0 ? ' is-first' : ''), t)); });
    main.appendChild(today);
    n.items.push(today);
    var facts = S.el('div', 'pa-facts ts-hide');
    [[P.inViewLabel, x.inView], [P.maskedLabel, x.masked]].forEach(function(f) {
      var r = S.el('div', 'pa-fact');
      r.appendChild(S.el('span', 'pa-k', f[0]));
      r.appendChild(S.el('span', 'pa-fact-v', f[1]));
      facts.appendChild(r);
    });
    main.appendChild(facts);
    n.items.push(facts);
    body.appendChild(main);
    n.scr.appendChild(body);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  function personSteps(t0) {
    var steps = [];
    n.items.forEach(function(el, i) { steps.push({ delay: t0 + 80 + i * 70, run: function() { S.on(el); } }); });
    steps.push({ delay: t0 + 80 + n.items.length * 70 + 150, run: complete });
    return steps;
  }

  function introSteps() {
    var steps = [];
    n.cardList.forEach(function(c, i) { steps.push({ delay: 120 + i * 90, run: function() { S.on(c); } }); });
    steps.push({ delay: 450, run: function() { S.on(n.chrome); } });
    steps.push({ delay: 550, run: function() { S.on(n.idm); } });
    steps.push({ delay: 650, run: function() { S.on(n.joins[0]); S.on(n.pro); } });
    steps.push({ delay: 750, run: function() { S.on(n.joins[1]); S.on(n.scr); } });
    steps.push({ delay: 900, run: function() { S.on(n.dataLabel); S.on(n.data); } });
    return steps.concat(personSteps(INTRO));
  }

  // Show one person. The frame is shown at once if it was still coming in.
  function select(id, animate) {
    if (!cv) return;
    if (tl) tl.destroy();
    prev = cur;
    cur = id;
    S.on(n.cardList); S.on(n.chrome); S.on([n.idm, n.pro, n.scr, n.dataLabel]); S.on(n.joins); S.on(n.data);
    prepare(person(id));
    tl = createTimeline(personSteps(0));
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
    // Space: complete the intro first, then the next person in order, then move on
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
      return P.cols.join('; ') + '. ' + P.people.map(function(x) {
        return x.name + ', ' + x.role + ', ' + x.scope + '. ' + P.idm.map(function(it) { return it.k + ': ' + x.idm[it.id]; }).join('; ') + '. Profile: '
          + P.levels.map(function(l) { return l.label + ', ' + x.levels[l.id].toLowerCase() + ' (' + l.from.toLowerCase() + ')'; }).join('; ') + '. Screen: '
          + P.menu.filter(function(m, i) { return x.menu[i]; }).map(function(m) { return m.label; }).join(', ')
          + (x.menu.indexOf(false) >= 0 ? '; locked: ' + P.menu.filter(function(m, i) { return !x.menu[i]; }).map(function(m) { return m.label; }).join(', ') : '')
          + '. ' + P.todayLabel + ': ' + x.today.join(', ').toLowerCase() + '. ' + P.inViewLabel + ': ' + x.inView + '. ' + P.maskedLabel + ': ' + x.masked.toLowerCase() + '.';
      }).join(' ') + ' ' + P.data.label + ': ' + P.data.steps.map(function(st) { return st.k.toLowerCase() + ', ' + st.text.toLowerCase(); }).join('; ') + '.';
    },
    destroy: function() { if (tl) tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
