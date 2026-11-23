// -- WORKSPACE KIT -- v2 --
// The NFR Workspace application shell and its parts, shared by the four app screens
// (workspace-boot, workspace-home, workspace-journey, workspace-builder). Every app
// screen draws the same 1280 x 640 frame at the same geometry, so moving between them
// looks like one application changing view.
// Words come from window.NFR_WORKSPACE_DEMO; case facts from window.TPRM_CASE.
// Real controls are <button> elements (.ws-btn); everything else is display only.
// Exposes: window.WorkspaceKit

(function() {
  'use strict';

  var W = 1280, H = 640;
  var NAV_W = 196, TOP_H = 48, ASSIST_W = 300, RAIL_W = 52;

  function S() { return window.StoryKit; }
  function D() { return window.NFR_WORKSPACE_DEMO; }

  // Static rendering: reduced motion or safe mode. Read at call time, never cached.
  function isStatic() {
    return !!(window.SceneDirector && SceneDirector.isReduced && SceneDirector.isReduced());
  }

  function setState(name) {
    if (window.NFRExperience && typeof NFRExperience.set === 'function') NFRExperience.set(name);
  }

  // A real button. opts: { kind: 'primary' | 'ghost' | 'option', icon, title, onClick }
  function btn(label, opts) {
    opts = opts || {};
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ws-btn' + (opts.kind ? ' ws-btn-' + opts.kind : '') + (opts.cls ? ' ' + opts.cls : '');
    if (opts.icon) b.appendChild(S().icon(opts.icon));
    b.appendChild(S().el('span', 'ws-btn-label', label));
    if (opts.title) b.title = opts.title;
    if (opts.onClick) b.addEventListener('click', function(e) { e.stopPropagation(); opts.onClick(e); });
    return b;
  }

  function chip(text, tone, icon) {
    var c = S().el('span', 'ws-chip' + (tone ? ' ws-tone-' + tone : ''));
    if (icon) c.appendChild(S().icon(icon));
    c.appendChild(document.createTextNode(text));
    return c;
  }

  // "Due today", "Due Thursday": only the relative word is lower-cased
  function dueLabel(due) { return 'Due ' + (due === 'Today' ? 'today' : due); }

  function label(text, cls) { return S().el('div', 'ws-label' + (cls ? ' ' + cls : ''), text); }

  // Evidence meter: filled segments for evidence in hand, dashed for gaps
  function meter(have, total) {
    var m = S().el('span', 'ws-meter');
    for (var i = 0; i < total; i++) m.appendChild(S().el('i', i < have ? 'is-in' : 'is-gap'));
    return m;
  }

  // Go to a deck screen from inside the app. App-to-app moves are instant (navigation.js).
  function goScreen(id) { if (typeof goToId === 'function') goToId(id); }

  // ── Shell ──
  // opts: { active: nav id, assist: 'panel' | 'rail' | 'none', parts: true to tag parts for the boot sequence }
  function shell(root, opts) {
    opts = opts || {};
    var K = S(), d = D();
    var app = K.el('div', 'ws-app', null, { left: 0, top: 0, width: W, height: H });
    app.setAttribute('data-ws-app', '');

    // Top bar
    var top = K.el('div', 'ws-top');
    var brand = K.el('div', 'ws-brand');
    brand.appendChild(K.el('span', 'ws-mark'));
    brand.appendChild(K.el('span', 'ws-brand-name', d.product));
    top.appendChild(brand);
    var search = K.el('div', 'ws-search');
    search.appendChild(K.icon('ti-search'));
    search.appendChild(K.el('span', null, 'Search cases, evidence and policies'));
    top.appendChild(search);
    top.appendChild(K.el('span', 'ws-spacer'));
    top.appendChild(chip(d.syntheticLabel, 'human', 'ti-flask'));
    var role = K.el('div', 'ws-role');
    role.appendChild(K.el('span', 'ws-avatar', 'RM'));
    role.appendChild(K.el('span', 'ws-role-name', d.role.label));
    top.appendChild(role);
    app.appendChild(top);

    // Left navigation
    var nav = K.el('nav', 'ws-nav');
    nav.setAttribute('aria-label', 'Workspace navigation');
    var items = {};
    d.nav.forEach(function(item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-nav-item' + (item.id === opts.active ? ' is-active' : '');
      b.appendChild(K.icon(item.icon));
      b.appendChild(K.el('span', null, item.label));
      if (item.target) {
        b.setAttribute('data-target', item.target);
        b.addEventListener('click', function(e) { e.stopPropagation(); goScreen(item.target); });
      } else {
        b.setAttribute('aria-disabled', 'true');
        b.title = 'Not part of this demonstration';
      }
      if (item.id === opts.active) b.setAttribute('aria-current', 'page');
      items[item.id] = b;
      nav.appendChild(b);
    });
    var foot = K.el('div', 'ws-nav-foot');
    foot.appendChild(K.el('div', 'ws-nav-foot-k', 'Signed in as'));
    foot.appendChild(K.el('div', 'ws-nav-foot-v', d.role.user));
    foot.appendChild(K.el('div', 'ws-nav-foot-k', 'Access'));
    foot.appendChild(K.el('div', 'ws-nav-foot-v', 'Inherited from your role'));
    nav.appendChild(foot);
    app.appendChild(nav);

    var main = K.el('div', 'ws-main');
    app.appendChild(main);

    var assist = null, rail = null;
    if (opts.assist === 'panel') {
      app.classList.add('has-assist');
      assist = K.el('aside', 'ws-assist');
      assist.setAttribute('aria-label', 'NFR Assist');
      app.appendChild(assist);
    } else if (opts.assist === 'rail') {
      app.classList.add('has-rail');
      rail = K.el('aside', 'ws-rail');
      rail.setAttribute('aria-label', 'NFR Assist, collapsed');
      rail.appendChild(K.icon('ti-message-circle'));
      rail.appendChild(K.el('span', 'ws-rail-label', 'Assist'));
      app.appendChild(rail);
    }

    root.appendChild(app);
    return {
      app: app, top: top, nav: nav, main: main, assist: assist, rail: rail, items: items,
      brand: brand, search: search, role: role,
      clearMain: function() { main.innerHTML = ''; }
    };
  }

  // ── Decision card (home queue) ──
  // opts: { onOpen: fn } adds the Open case control to the card that opens
  function queueCard(item, opts) {
    opts = opts || {};
    var K = S();
    var card = K.el('div', 'ws-card' + (item.open ? ' is-next' : ''));
    card.setAttribute('data-case', item.id);
    var head = K.el('div', 'ws-card-head');
    head.appendChild(K.icon(item.icon));
    head.appendChild(K.el('span', 'ws-card-journey', item.journey));
    head.appendChild(K.el('span', 'ws-card-id', item.id));
    head.appendChild(K.el('span', 'ws-spacer'));
    head.appendChild(chip(dueLabel(item.due), item.due === 'Today' ? 'human' : 'neutral', 'ti-clock'));
    card.appendChild(head);
    card.appendChild(K.el('div', 'ws-card-title', item.title));
    var fields = K.el('div', 'ws-card-fields');
    function field(k, v, extra) {
      var f = K.el('div', 'ws-field');
      f.appendChild(K.el('div', 'ws-field-k', k));
      var val = K.el('div', 'ws-field-v', v);
      if (extra) val.insertBefore(extra, val.firstChild);
      f.appendChild(val);
      fields.appendChild(f);
      return f;
    }
    field('Why it is here', item.why);
    field('What changed', item.changed);
    field('Evidence', item.evidenceHave + ' of ' + item.evidenceTotal + ' · ' + item.evidenceNote, meter(item.evidenceHave, item.evidenceTotal));
    var dec = field('Decision required', item.decision);
    dec.classList.add('is-decision');
    card.appendChild(fields);
    if (item.open && opts.onOpen) {
      var actions = K.el('div', 'ws-card-actions');
      actions.appendChild(btn('Open case', { kind: 'primary', icon: 'ti-arrow-right', onClick: opts.onOpen }));
      card.appendChild(actions);
    }
    return card;
  }

  // ── Queue (home main area) ──
  function queue(main, opts) {
    var K = S(), d = D();
    var wrap = K.el('div', 'ws-queue');
    var head = K.el('div', 'ws-view-head');
    head.appendChild(K.el('div', 'ws-view-title', d.queueTitle));
    head.appendChild(K.el('div', 'ws-view-meta', d.queueMeta));
    wrap.appendChild(head);
    var cards = d.queue.map(function(item) {
      var c = queueCard(item, opts);
      wrap.appendChild(c);
      return c;
    });
    main.appendChild(wrap);
    return { el: wrap, head: head, cards: cards };
  }

  // ── NFR Assist panel ──
  // Suggested questions with deterministic answers. ask(i) shows answer i.
  function assistPanel(parent, opts) {
    opts = opts || {};
    var K = S(), d = D();
    var a = d.assist;
    var head = K.el('div', 'ws-assist-head');
    head.appendChild(K.icon('ti-message-circle'));
    head.appendChild(K.el('span', 'ws-assist-title', 'NFR Assist'));
    head.appendChild(chip('Role-steered', 'ai'));
    parent.appendChild(head);
    var body = K.el('div', 'ws-assist-body');
    body.appendChild(chip(a.contextChip, 'data', 'ti-user-check'));
    body.appendChild(label('Suggested for this queue', 'ws-assist-sugg'));
    var qs = a.questions.map(function(q, i) {
      var b = btn(q.q, { kind: 'option', cls: 'ws-assist-q', onClick: function() { ask(i); if (opts.onAsk) opts.onAsk(i); } });
      body.appendChild(b);
      return b;
    });
    var answer = K.el('div', 'ws-assist-answer');
    answer.setAttribute('aria-live', 'polite');
    body.appendChild(answer);
    parent.appendChild(body);
    var input = K.el('div', 'ws-assist-input');
    input.appendChild(K.el('span', null, a.placeholder));
    input.appendChild(K.icon('ti-send'));
    parent.appendChild(input);

    var asked = -1;
    function ask(i) {
      asked = i;
      qs.forEach(function(b, j) { b.classList.toggle('is-asked', j === i); b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      answer.innerHTML = '';
      var q = a.questions[i];
      var bubble = K.el('div', 'ws-answer' + (isStatic() ? '' : ' ws-answer-in'));
      bubble.appendChild(K.el('div', 'ws-answer-q', q.q));
      var list = K.el('ul', 'ws-answer-list');
      q.a.forEach(function(line) { list.appendChild(K.el('li', null, line)); });
      bubble.appendChild(list);
      bubble.appendChild(K.el('div', 'ws-answer-src', 'Sources: ' + q.sources.join(', ')));
      bubble.appendChild(K.el('div', 'ws-answer-note', a.note));
      answer.appendChild(bubble);
    }
    return { head: head, body: body, questions: qs, answer: answer, input: input, ask: ask, asked: function() { return asked; } };
  }

  // Reveal a list of nodes (or node arrays) in sequence on a tracked timeline.
  // Static: switch everything on at once and return a finished timeline.
  function sequence(groups, stagger, start) {
    var steps = groups.map(function(g, i) {
      return { delay: (start || 0) + i * (stagger || 90), run: function() { S().on(g); } };
    });
    var tl = createTimeline(steps);
    if (isStatic()) tl.finish(); else tl.play();
    return tl;
  }

  // Mark nodes hidden (reveal-ready) unless rendering statically
  function hide(nodes, dir) {
    (nodes.length !== undefined && !nodes.classList ? Array.prototype.slice.call(nodes) : [nodes]).forEach(function(n) {
      if (!n) return;
      n.classList.add('ts-hide');
      if (dir) n.classList.add(dir);
    });
  }

  // Stepper (builder): labels with one active, earlier ones done
  function stepper(parent, labels) {
    var K = S();
    var row = K.el('ol', 'ws-stepper');
    var cells = labels.map(function(l, i) {
      var li = K.el('li', 'ws-step');
      li.appendChild(K.el('span', 'ws-step-num', String(i + 1)));
      li.appendChild(K.el('span', 'ws-step-label', l));
      row.appendChild(li);
      return li;
    });
    parent.appendChild(row);
    return {
      el: row,
      set: function(active) {
        cells.forEach(function(c, i) {
          c.classList.toggle('is-done', i < active);
          c.classList.toggle('is-active', i === active);
          if (i === active) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current');
        });
      }
    };
  }

  window.WorkspaceKit = {
    W: W, H: H, NAV_W: NAV_W, TOP_H: TOP_H, ASSIST_W: ASSIST_W, RAIL_W: RAIL_W,
    isStatic: isStatic, setState: setState, goScreen: goScreen,
    btn: btn, chip: chip, label: label, meter: meter, dueLabel: dueLabel,
    shell: shell, queueCard: queueCard, queue: queue, assistPanel: assistPanel,
    sequence: sequence, hide: hide, stepper: stepper
  };
}());
