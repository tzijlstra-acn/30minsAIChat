// Scene: authority-boundary (v2 screen 10)
// Causal story: the principle behind every screen of the demo. Three columns, left to
// right: AI and automation prepare, professionals decide, systems record. The record
// is acknowledged only after the decision. Below, each capability's default authority:
// Assist drafts and explains, a role app prepares and validates, an automation runs
// approved steps and pauses at human gates, an ad hoc agent reads, analyses and drafts.
// No capability owns the risk.
SceneDirector.register('authority-boundary', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var COL = { y: 0, w: 310, h: 292, gap: 39, x0: 16 };
  var TBL = { x: 16, y: 318, w: 690 };

  var COLS = [
    { key: 'prepare', tone: 'ai', icon: 'ti-sparkles' },
    { key: 'decide', tone: 'human', icon: 'ti-user-check' },
    { key: 'record', tone: 'proof', icon: 'ti-database' }
  ];

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return COL.x0 + i * (COL.w + COL.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'authority-boundary' });
    n = { cols: [], arrows: [], rows: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    var B = D.boundary;

    COLS.forEach(function(c, i) {
      var spec = B[c.key];
      var x = colX(i);
      var col = S.el('div', 'ts-obj ts-c-' + c.tone + ' cb-col ts-hide ts-up', null, { left: x, top: COL.y, width: COL.w, height: COL.h });
      var head = S.el('div', 'cb-head');
      head.appendChild(S.icon(c.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'cb-head-text ts-ink', spec.label));
      col.appendChild(head);
      var ul = S.el('ul', 'cb-items');
      spec.items.forEach(function(it) { ul.appendChild(S.el('li', null, it)); });
      col.appendChild(ul);
      if (c.key === 'record') {
        var rc = S.ReceiptState.create(col, { state: 'acknowledged', label: 'Recorded after the decision' });
        rc.el.classList.add('cb-receipt');
      }
      if (c.key === 'decide') {
        var gate = S.DecisionGate.create(col, { size: 'small', label: 'Named decision maker' });
        gate.el.classList.add('cb-gate');
        n.gate = gate;
      }
      root.appendChild(col);
      n.cols.push(col);
      if (i < COLS.length - 1) {
        var ax = x + COL.w + 6, bx = colX(i + 1) - 6, ay = COL.y + COL.h / 2;
        n.arrows.push(S.path(g, 'M' + ax + ' ' + ay + ' L' + bx + ' ' + ay, 'ts-s-' + COLS[i + 1].tone + ' cb-arrow', cv.marker(COLS[i + 1].tone)));
      }
    });

    n.tblLabel = S.el('div', 'ts-label ts-hide', B.tableTitle, { left: TBL.x, top: TBL.y, width: TBL.w });
    root.appendChild(n.tblLabel);
    D.capabilities.forEach(function(c, i) {
      var r = S.el('div', 'cb-row ts-hide ts-left', null, { left: TBL.x, top: TBL.y + 26 + i * 42, width: TBL.w, height: 36 });
      var who = S.el('div', 'cb-who');
      who.appendChild(S.icon(c.icon));
      who.appendChild(S.el('span', 'cb-verb', c.verb));
      who.appendChild(S.el('span', 'cb-product', c.product));
      r.appendChild(who);
      r.appendChild(S.el('div', 'cb-auth', c.authority));
      root.appendChild(r);
      n.rows.push(r);
    });

    var note = S.el('div', 'cb-note ts-hide ts-pop', null, { left: 734, top: TBL.y + 26, width: 290, height: 162 });
    note.appendChild(S.el('div', 'cb-note-main', B.tableNote));
    note.appendChild(S.el('div', 'ts-text', 'Authority changes only through an explicit control decision. Capability can grow; accountability stays with named people.'));
    root.appendChild(note);
    n.note = note;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cols[0]); } },
    { delay: 900,  run: function() { S.on(n.arrows[0]); } },
    { delay: 1200, run: function() { S.on(n.cols[1]); n.gate.activate(); } },
    { delay: 1900, run: function() { S.on(n.arrows[1]); } },
    { delay: 2200, run: function() { S.on(n.cols[2]); } },
    { delay: 3000, run: function() { S.on(n.tblLabel); S.on(n.rows[0]); } },
    { delay: 3300, run: function() { S.on(n.rows[1]); } },
    { delay: 3600, run: function() { S.on(n.rows[2]); } },
    { delay: 3900, run: function() { S.on(n.rows[3]); } },
    { delay: 4500, run: function() { S.on(n.note); } },
    { delay: 5100, run: complete }
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
      var B = D.boundary;
      return B.prepare.label + ': ' + B.prepare.items.join(', ').toLowerCase() + '. ' + B.decide.label + ': ' + B.decide.items.join(', ').toLowerCase() + '. '
        + B.record.label + ': ' + B.record.items.join(', ').toLowerCase() + '. Default authority: '
        + D.capabilities.map(function(c) { return c.product + ', ' + c.authority.toLowerCase(); }).join('; ') + '. ' + B.tableNote;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
