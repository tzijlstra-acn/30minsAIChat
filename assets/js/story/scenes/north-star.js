// Scene: north-star (Screen 02)
// Causal story: five non-financial risk journeys appear, each needing the same thread
// (prepared, decided, recorded). They settle onto one operating layer, the NFR OS,
// with three promises. Then four journeys dim and the TPRM periodic review lights up:
// the route to the north star starts with one journey. Plain language only: this is
// the destination, not an architecture diagram.
SceneDirector.register('north-star', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var CARD_W = 192, CARD_H = 128, CARD_Y = 30, CARD_STEP = 204;
  var LAYER = { x: 16, y: 206, w: 1008, h: 92 };

  var JOURNEYS = [
    { id: 'tprm', label: 'Third-party risk', icon: 'ti-building' },
    { id: 'rcsa', label: 'Risk and control self-assessment', icon: 'ti-clipboard-data' },
    { id: 'issues', label: 'Issues and actions', icon: 'ti-list' },
    { id: 'regchange', label: 'Regulatory change', icon: 'ti-gavel' },
    { id: 'incidents', label: 'Incidents and KRIs', icon: 'ti-chart-bar' }
  ];
  var LAYER_CHIPS = ['Role workspaces', 'Persistent cases', 'Authorised evidence', 'Approvals and receipts', 'Controls and audit'];
  var PROMISES = [
    { title: 'Work arrives prepared', text: 'Evidence gathered, changes named, gaps visible', c: 'ai' },
    { title: 'Judgement stays human', text: 'Professionals decide and own the outcome', c: 'human' },
    { title: 'Every action is recorded', text: 'Approved, acknowledged and auditable', c: 'proof' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return 16 + i * CARD_STEP; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'north-star' });
    n = { cards: [], links: [], chips: [], promises: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.label = S.el('div', 'ts-label ts-hide', 'Every non-financial risk journey needs the same thread: prepared, decided, recorded', { left: 16, top: 6, width: 1008 });
    root.appendChild(n.label);

    JOURNEYS.forEach(function(j, i) {
      var x = cardX(i);
      var card = S.el('div', 'ns-card ts-hide ts-up', null, { left: x, top: CARD_Y, width: CARD_W, height: CARD_H });
      var head = S.el('div', 'ns-card-head');
      head.appendChild(S.icon(j.icon));
      head.appendChild(S.el('span', 'ns-card-title', j.label));
      card.appendChild(head);
      // The same thread in every journey: prepared, decided, recorded
      var thread = S.el('div', 'ns-thread');
      [['ai', 'Prepared'], ['human', 'Decided'], ['proof', 'Recorded']].forEach(function(t, k) {
        if (k > 0) thread.appendChild(S.el('span', 'ns-thread-line'));
        var dot = S.el('span', 'ns-dot ts-c-' + t[0]);
        dot.title = t[1];
        thread.appendChild(dot);
      });
      card.appendChild(thread);
      root.appendChild(card);
      n.cards.push(card);
      n.links.push(S.path(g, 'M' + (x + CARD_W / 2) + ' ' + (CARD_Y + CARD_H + 2) + ' L' + (x + CARD_W / 2) + ' ' + (LAYER.y - 4), 'ts-s-ai ns-link'));
    });

    // One operating layer underneath every journey
    var layer = S.el('div', 'ns-layer ts-hide ts-pop', null, { left: LAYER.x, top: LAYER.y, width: LAYER.w, height: LAYER.h });
    var lh = S.el('div', 'ns-layer-head');
    lh.appendChild(S.el('span', 'ns-layer-title', 'NFR OS'));
    lh.appendChild(S.el('span', 'ts-label ts-ink ts-c-ai', 'One operating layer'));
    layer.appendChild(lh);
    var row = S.el('div', 'ns-chips');
    LAYER_CHIPS.forEach(function(c) {
      var chip = S.el('span', 'ts-chip ts-c-ai ns-chip ts-hide', c);
      row.appendChild(chip);
      n.chips.push(chip);
    });
    layer.appendChild(row);
    root.appendChild(layer);
    n.layer = layer;

    // Three promises the layer keeps
    PROMISES.forEach(function(p, i) {
      var box = S.el('div', 'ts-obj ts-soft ts-c-' + p.c + ' ns-promise ts-hide ts-up', null, { left: 16 + i * 342, top: 320, width: 324, height: 74 });
      box.appendChild(S.el('div', 'ns-promise-title ts-ink', p.title));
      box.appendChild(S.el('div', 'ts-text', p.text));
      root.appendChild(box);
      n.promises.push(box);
    });

    // The route starts with one journey
    var start = S.el('div', 'ns-start ts-hide ts-up', null, { left: 16, top: 420, width: 1008, height: 70 });
    start.appendChild(S.icon('ti-target'));
    var st = S.el('div', 'ns-start-text');
    st.appendChild(S.el('div', 'ns-start-title', 'Start here: one TPRM periodic review, in six months'));
    st.appendChild(S.el('div', 'ts-text', 'Prove the thread on one journey, then reuse it for the next'));
    start.appendChild(st);
    start.appendChild(S.el('span', 'ts-label ts-ink ts-c-human ns-next', 'Next: the TPRM officer today'));
    root.appendChild(start);
    n.start = start;
  }

  function spotlight() {
    n.cards.forEach(function(c, i) { c.classList.toggle('is-dim', i !== 0); c.classList.toggle('is-first', i === 0); });
    n.links.forEach(function(l, i) { l.classList.toggle('ns-link-dim', i !== 0); });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.label); S.on(n.cards[0]); } },
    { delay: 450,  run: function() { S.on(n.cards[1]); } },
    { delay: 700,  run: function() { S.on(n.cards[2]); } },
    { delay: 950,  run: function() { S.on(n.cards[3]); } },
    { delay: 1200, run: function() { S.on(n.cards[4]); } },
    { delay: 1900, run: function() { S.on(n.links); } },
    { delay: 2500, run: function() { S.on(n.layer); } },
    { delay: 2900, run: function() { S.on(n.chips); } },
    { delay: 3700, run: function() { S.on(n.promises[0]); } },
    { delay: 4100, run: function() { S.on(n.promises[1]); } },
    { delay: 4500, run: function() { S.on(n.promises[2]); } },
    { delay: 5600, run: function() { spotlight(); } },
    { delay: 6200, run: function() { S.on(n.start); } },
    { delay: 7200, run: complete }
  ];
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
      return 'The north star. Five non-financial risk journeys, ' + JOURNEYS.map(function(j) { return j.label.toLowerCase(); }).join(', ')
        + ', each need the same thread: prepared, decided, recorded. They sit on one operating layer, the NFR OS, with '
        + LAYER_CHIPS.join(', ').toLowerCase() + '. Three promises: ' + PROMISES.map(function(p) { return p.title.toLowerCase(); }).join('; ')
        + '. The route starts with one journey: a TPRM periodic review, in six months.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
