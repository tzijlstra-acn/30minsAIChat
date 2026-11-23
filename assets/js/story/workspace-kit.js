// -- WORKSPACE KIT -- v2 --
// The NFR Workspace application shell and its parts, shared by the four app screens
// (workspace-boot, workspace-home, workspace-journey, workspace-builder) and the visual
// insight. Every app
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
  function dueLabel(due) { return 'Due ' + (due === 'Today' || due === 'Tomorrow' ? due.toLowerCase() : due); }

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

  // ── Decision card: the dominant "Now" item on the home screen ──
  // Answers: why it is here, what changed, what was prepared, which decision, when.
  // opts: { onOpen: fn } adds the Open case control
  function queueCard(item, opts) {
    opts = opts || {};
    var K = S(), F = D().home.fields;
    var card = K.el('div', 'ws-card is-next');
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
    function field(k, v, extra, cls) {
      var f = K.el('div', 'ws-field' + (cls ? ' ' + cls : ''));
      f.appendChild(K.el('div', 'ws-field-k', k));
      var val = K.el('div', 'ws-field-v', v);
      if (extra) val.insertBefore(extra, val.firstChild);
      f.appendChild(val);
      fields.appendChild(f);
      return f;
    }
    field(F.why, item.why);
    field(F.changed, item.changed);
    field(F.prepared, item.prepared, meter(item.evidenceHave, item.evidenceTotal));
    field(F.decision, item.decision, null, 'is-decision');
    card.appendChild(fields);
    if (opts.onOpen) {
      var actions = K.el('div', 'ws-card-actions');
      actions.appendChild(K.el('span', 'ws-card-evidence', 'Evidence ' + item.evidenceHave + ' of ' + item.evidenceTotal + ' · ' + item.evidenceNote));
      actions.appendChild(btn('Open case', { kind: 'primary', icon: 'ti-arrow-right', onClick: opts.onOpen }));
      card.appendChild(actions);
    }
    return card;
  }

  // A compact "Next" row: title, why and decision on one line, due chip
  function nextRow(item) {
    var K = S();
    var row = K.el('div', 'ws-next');
    row.setAttribute('data-case', item.id);
    row.appendChild(K.icon(item.icon));
    var body = K.el('div', 'ws-next-body');
    var top = K.el('div', 'ws-next-top');
    top.appendChild(K.el('span', 'ws-next-title', item.title));
    top.appendChild(K.el('span', 'ws-card-journey', item.journey));
    body.appendChild(top);
    body.appendChild(K.el('div', 'ws-next-line', item.why + ' · Prepared: ' + item.prepared.charAt(0).toLowerCase() + item.prepared.slice(1)));
    row.appendChild(body);
    row.appendChild(chip(dueLabel(item.due), 'neutral', 'ti-clock'));
    return row;
  }

  // ── Home: Now, Next, Watching, Done by the Workspace ──
  // opts: { onOpen, recorded: { decision label, time } when the review was recorded this session }
  function home(main, opts) {
    opts = opts || {};
    var K = S(), H = D().home;
    var wrap = K.el('div', 'ws-home');
    var head = K.el('div', 'ws-view-head');
    head.appendChild(K.el('div', 'ws-view-title', H.title));
    head.appendChild(K.el('div', 'ws-view-meta', opts.recorded ? '1 decision recorded today · ' + H.next.length + ' still waiting' : H.meta));
    wrap.appendChild(head);
    var parts = [];

    var nowItem = opts.recorded ? H.next[0] : H.now;
    var nextItems = opts.recorded ? H.next.slice(1) : H.next;
    var nowBlock = K.el('div', 'ws-block');
    nowBlock.appendChild(label(H.labels.now, 'ws-block-label is-now'));
    var card = queueCard(nowItem, { onOpen: opts.recorded ? null : opts.onOpen });
    nowBlock.appendChild(card);
    wrap.appendChild(nowBlock);
    parts.push(nowBlock);

    var nextBlock = K.el('div', 'ws-block');
    nextBlock.appendChild(label(H.labels.next, 'ws-block-label'));
    nextItems.forEach(function(it) { nextBlock.appendChild(nextRow(it)); });
    wrap.appendChild(nextBlock);
    parts.push(nextBlock);

    var lower = K.el('div', 'ws-lower');
    var watch = K.el('div', 'ws-block ws-watch');
    watch.appendChild(label(H.labels.watching, 'ws-block-label'));
    H.watching.forEach(function(w) {
      var r = K.el('div', 'ws-watch-row ws-tone-' + w.tone);
      r.appendChild(K.icon(w.icon));
      r.appendChild(K.el('span', null, w.text));
      watch.appendChild(r);
    });
    lower.appendChild(watch);
    var done = K.el('div', 'ws-block ws-done');
    done.appendChild(label(opts.recorded ? H.labels.recorded : H.labels.done, 'ws-block-label'));
    if (opts.recorded) {
      var rec = K.el('div', 'ws-done-recorded');
      rec.appendChild(K.icon('ti-circle-check'));
      rec.appendChild(K.el('span', null, H.now.title + ' · ' + opts.recorded.status + ' · ' + opts.recorded.time));
      done.appendChild(rec);
    }
    done.appendChild(K.el('div', 'ws-done-line', H.done.join(' · ')));
    lower.appendChild(done);
    wrap.appendChild(lower);
    parts.push(lower);

    main.appendChild(wrap);
    return { el: wrap, head: head, card: card, parts: parts, fields: Array.prototype.slice.call(card.querySelectorAll('.ws-field')) };
  }

  // ── Structured insight: one question answered as a decision product ──
  // Conclusion, key figures, a ranked bar chart, a trend line, drivers with sources,
  // freshness, the recommended next action and save options. Data is synthetic and fixed.
  // opts: { onBack, onOpenApp }
  function insight(main, opts) {
    opts = opts || {};
    var K = S(), I = D().insight, svg = K.svg;
    var wrap = K.el('div', 'wi');
    wrap.setAttribute('data-insight', '');

    var head = K.el('div', 'wi-head');
    var crumb = document.createElement('button');
    crumb.type = 'button';
    crumb.className = 'wj-crumb';
    crumb.appendChild(K.icon('ti-arrow-back-up'));
    crumb.appendChild(K.el('span', null, D().home.title));
    crumb.addEventListener('click', function(e) { e.stopPropagation(); if (opts.onBack) opts.onBack(); });
    head.appendChild(crumb);
    head.appendChild(K.el('span', 'wi-q', I.question));
    var saved = K.el('div', 'wi-saved');
    saved.setAttribute('aria-live', 'polite');
    wrap.appendChild(head);
    wrap.appendChild(K.el('div', 'wi-conclusion', I.conclusion));

    var figs = K.el('div', 'wi-figs');
    I.figures.forEach(function(f) {
      var t = K.el('div', 'wi-fig');
      t.appendChild(K.el('div', 'wi-fig-v', f.v));
      t.appendChild(K.el('div', 'wi-fig-k', f.k));
      figs.appendChild(t);
    });
    wrap.appendChild(figs);

    var charts = K.el('div', 'wi-charts');
    // Ranked horizontal bars, zero line inside the track so a fall reads leftwards
    var rank = K.el('div', 'wi-panel');
    rank.appendChild(K.el('div', 'wi-panel-title', I.rankingTitle));
    var vals = I.ranking.map(function(r) { return r.v; });
    var min = Math.min(0, Math.min.apply(null, vals)) - 2, max = Math.max.apply(null, vals) + 2;
    var span = max - min, zero = (0 - min) / span * 100;
    var bars = K.el('div', 'wi-bars');
    bars.setAttribute('role', 'img');
    bars.setAttribute('aria-label', I.rankingTitle + ': ' + I.ranking.map(function(r) { return r.label + ' ' + (r.v > 0 ? '+' : '') + r.v; }).join(', '));
    I.ranking.forEach(function(r) {
      var row = K.el('div', 'wi-bar-row' + (r.selected ? ' is-selected' : '') + (r.v >= 5 ? ' is-worse' : ''));
      var name = K.el('div', 'wi-bar-name');
      name.appendChild(K.el('span', 'wi-bar-label', r.label));
      row.appendChild(name);
      var track = K.el('div', 'wi-track');
      var z = K.el('i', 'wi-zero');
      z.style.left = zero + '%';
      track.appendChild(z);
      var fill = K.el('i', 'wi-fill');
      var w = Math.abs(r.v) / span * 100;
      fill.style.left = (r.v >= 0 ? zero : zero - w) + '%';
      fill.style.width = w + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(K.el('span', 'wi-bar-v', (r.v > 0 ? '+' : '') + r.v));
      bars.appendChild(row);
    });
    rank.appendChild(bars);
    charts.appendChild(rank);

    // Trend line for the selected service, with the appetite threshold
    var trend = K.el('div', 'wi-panel');
    trend.appendChild(K.el('div', 'wi-panel-title', I.trendTitle));
    var TW = 300, TH = 78, pad = 6;
    var tv = I.trend.values, tmin = Math.min.apply(null, tv.concat([I.trend.threshold])) - 4, tmax = Math.max.apply(null, tv) + 4;
    function px(i) { return pad + i * (TW - 2 * pad) / (tv.length - 1); }
    function py(v) { return TH - pad - (v - tmin) / (tmax - tmin) * (TH - 2 * pad); }
    var g = svg('svg', { viewBox: '0 0 ' + TW + ' ' + TH, width: TW, height: TH, role: 'img', 'aria-label': I.trendTitle + ': ' + tv.join(', ') + '; threshold ' + I.trend.threshold });
    g.setAttribute('class', 'wi-trend');
    g.style.width = TW + 'px';
    g.style.height = TH + 'px';
    g.appendChild(svg('line', { x1: pad, x2: TW - pad, y1: py(I.trend.threshold), y2: py(I.trend.threshold), 'class': 'wi-threshold' }));
    g.appendChild(svg('polyline', { points: tv.map(function(v, i) { return px(i).toFixed(1) + ',' + py(v).toFixed(1); }).join(' '), 'class': 'wi-line' }));
    tv.forEach(function(v, i) { g.appendChild(svg('circle', { cx: px(i), cy: py(v), r: i === tv.length - 1 ? 4 : 2.5, 'class': v > I.trend.threshold ? 'wi-dot is-over' : 'wi-dot' })); });
    trend.appendChild(g);
    var months = K.el('div', 'wi-months');
    I.trend.labels.forEach(function(m) { months.appendChild(K.el('span', null, m)); });
    trend.appendChild(months);
    trend.appendChild(K.el('div', 'wi-trend-note', I.trendNote));
    charts.appendChild(trend);
    wrap.appendChild(charts);

    var drivers = K.el('div', 'wi-panel wi-drivers');
    drivers.appendChild(K.el('div', 'wi-panel-title', I.driversTitle));
    var dl = K.el('div', 'wi-driver-grid');
    I.drivers.forEach(function(dr) {
      var r = K.el('div', 'wi-driver' + (dr.gap ? ' is-gap' : ''));
      r.appendChild(K.icon(dr.gap ? 'ti-alert-triangle' : 'ti-trending-up'));
      r.appendChild(K.el('span', 'wi-driver-text', dr.text));
      r.appendChild(chip(dr.source, dr.gap ? 'human' : 'data'));
      dl.appendChild(r);
    });
    drivers.appendChild(dl);
    wrap.appendChild(drivers);

    var fresh = K.el('div', 'wi-fresh');
    fresh.appendChild(K.icon('ti-file-check'));
    fresh.appendChild(K.el('span', 'wi-fresh-text', I.answeredBy + ' · ' + I.freshness));
    I.saves.forEach(function(sv) {
      fresh.appendChild(btn(sv.label, { kind: 'ghost', icon: sv.icon, cls: 'wi-save', onClick: function() { saved.textContent = sv.result; saved.classList.add('is-set'); } }));
    });
    wrap.appendChild(fresh);
    wrap.appendChild(saved);

    var act = K.el('div', 'wi-action');
    var actText = K.el('div', 'wi-action-text');
    actText.appendChild(K.el('div', 'ws-label', I.nextTitle));
    actText.appendChild(K.el('div', 'wi-action-line', I.next));
    act.appendChild(actText);
    var open = btn(D().assist.openApp, { kind: 'primary', icon: 'ti-apps', onClick: function() { if (opts.onOpenApp) opts.onOpenApp(); } });
    open.classList.add('ws-cue');
    act.appendChild(open);
    wrap.appendChild(act);

    main.appendChild(wrap);
    return { el: wrap, parts: [head, wrap.querySelector('.wi-conclusion'), figs, charts, drivers, fresh, act] };
  }

  // ── NFR Assist panel ──
  // Suggested questions with deterministic answers. ask(i) shows answer i.
  // opts: { onAsk(i), onInsight(), onOpenApp() }
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
    body.appendChild(label('Suggested for your day', 'ws-assist-sugg'));
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
      if (q.handoff) {
        // Assist explains, then hands the work to the bounded role app
        var hand = K.el('div', 'ws-handoff');
        hand.appendChild(K.el('div', 'ws-handoff-text', q.handoff));
        var open = btn(a.openApp, { kind: 'primary', icon: 'ti-apps', onClick: function() { if (opts.onOpenApp) opts.onOpenApp(); } });
        open.classList.add('ws-handoff-btn');
        hand.appendChild(open);
        bubble.appendChild(hand);
      } else {
        var list = K.el('ul', 'ws-answer-list');
        q.a.forEach(function(line) { list.appendChild(K.el('li', null, line)); });
        bubble.appendChild(list);
      }
      if (!q.handoff) {
        bubble.appendChild(K.el('div', 'ws-answer-src', 'Sources: ' + q.sources.join(', ')));
        bubble.appendChild(K.el('div', 'ws-answer-note', a.note));
      }
      answer.appendChild(bubble);
      if (q.insight && opts.onInsight) opts.onInsight();
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
    shell: shell, queueCard: queueCard, nextRow: nextRow, home: home, insight: insight, assistPanel: assistPanel,
    sequence: sequence, hide: hide, stepper: stepper
  };
}());
