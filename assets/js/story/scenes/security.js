// Scene: security (screen 09)
// Causal story: every step is secured, and every person sees only their part. One request
// end to end, step by step, each with its controls: sign in, ask (the question carries the
// profile), retrieve (each system checks access; only permitted fields leave it), process
// (in the approved environment; personal data masked first), answer (filtered for the
// person; every claim cited), keep and write back (encrypted, versioned, written only once
// approved, every step in the audit log); the links between steps are encrypted. Under it,
// the same supplier record as each of screen 08's people sees it: shown, a summary, masked,
// or not in scope. Ben's scope is wealth management, so the record does not reach him.
SceneDirector.register('security', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var X = D.security;
  var W = 1040, H = 452;
  var STAGE = { y: 22, h: 148, w: 156 };
  var MX = { label: 194, head: 216, headH: 42, row: 264, rowH: 38, rowGap: 6, fx: 16, fw: 222, cx: 248, cw: 188, cstep: 194 };

  var cv = null;
  var n = {};
  var done = false;

  function stageX(i) { var gap = (1008 - X.stages.length * STAGE.w) / (X.stages.length - 1); return 16 + i * (STAGE.w + gap); }
  function person(id) { return D.profiles.people.filter(function(p) { return p.id === id; })[0]; }
  function rowY(j) { return MX.row + j * (MX.rowH + MX.rowGap); }
  function cell(v) { return typeof v === 'string' ? { state: v, label: X.states[v].label } : { state: v[0], label: v[1] }; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'security', refHeight: 520 });
    n = { stages: [], locks: [], heads: [], fields: [], cells: [] };
    done = false;
    var root = cv.el;

    n.label = root.appendChild(S.el('div', 'ts-label ts-hide', X.label, { left: 16, top: 0, width: 500 }));
    n.tag = root.appendChild(S.el('div', 'ts-label rv-tag ts-hide', X.tag, { left: 624, top: 0, width: 400 }));

    // One request, step by step
    X.stages.forEach(function(st, i) {
      var x = stageX(i);
      var b = S.el('div', 'ts-obj ts-c-data ts-soft sc-stage ts-hide ts-up', null, { left: x, top: STAGE.y, width: STAGE.w, height: STAGE.h });
      var h = S.el('div', 'sc-stage-h ts-ink');
      h.appendChild(S.el('span', 'sc-num', String(i + 1)));
      h.appendChild(S.el('span', 'sc-stage-t', st.label));
      h.appendChild(S.icon(st.icon, 'sc-stage-i'));
      b.appendChild(h);
      var ul = S.el('ul', 'sc-list');
      st.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      b.appendChild(ul);
      root.appendChild(b);
      n.stages.push(b);
      if (i < X.stages.length - 1) {
        var x2 = stageX(i + 1);
        var l = S.el('div', 'sc-lock ts-hide ts-pop', null, { left: x + STAGE.w, top: STAGE.y + STAGE.h / 2 - 9, width: x2 - x - STAGE.w, height: 18 });
        l.appendChild(S.icon('ti-lock'));
        root.appendChild(l);
        n.locks.push(l);
      }
    });
    n.transit = S.el('div', 'sc-transit ts-hide', null, { left: 624, top: STAGE.y + STAGE.h + 4, width: 400, height: 16 });
    n.transit.appendChild(S.icon('ti-lock'));
    n.transit.appendChild(S.el('span', null, X.transit));
    root.appendChild(n.transit);

    // The same record, as each person sees it
    n.mxLabel = root.appendChild(S.el('div', 'ts-label ts-hide', X.seeLabel, { left: 16, top: MX.label, width: 600 }));
    n.rec = S.el('div', 'ts-obj ts-c-neutral sc-rec ts-hide', null, { left: MX.fx, top: MX.head, width: MX.fw, height: MX.headH });
    n.rec.appendChild(S.icon('ti-building', 'sc-rec-i'));
    n.rec.appendChild(S.el('span', null, X.record));
    root.appendChild(n.rec);
    X.people.forEach(function(pid, k) {
      var p = person(pid);
      var x = MX.cx + k * MX.cstep;
      var h = S.el('div', 'sc-person ts-hide', null, { left: x, top: MX.head, width: MX.cw, height: MX.headH });
      h.appendChild(S.el('span', 'pa-avatar', p.initials));
      var t = S.el('span', 'sc-person-t');
      t.appendChild(S.el('span', 'sc-person-n', p.name));
      t.appendChild(S.el('span', 'sc-person-r', X.roles[pid]));
      h.appendChild(t);
      root.appendChild(h);
      n.heads.push(h);
      n.cells.push([]);
    });
    X.fields.forEach(function(f, j) {
      var y = rowY(j);
      n.fields.push(root.appendChild(S.el('div', 'sc-field ts-hide', f.label, { left: MX.fx, top: y, width: MX.fw, height: MX.rowH })));
    });
    X.people.forEach(function(pid, k) {
      var x = MX.cx + k * MX.cstep;
      var allOut = X.fields.every(function(f) { return cell(f.see[pid]).state === 'out'; });
      if (allOut) {
        // A profile the record does not reach: one cell for the whole column
        var y0 = rowY(0), y1 = rowY(X.fields.length - 1) + MX.rowH;
        var b = S.el('div', 'ts-obj ts-c-neutral sc-cell is-out is-all ts-hide', null, { left: x, top: y0, width: MX.cw, height: y1 - y0 });
        b.appendChild(S.icon(X.states.out.icon, 'sc-cell-i'));
        b.appendChild(S.el('span', 'sc-cell-t', X.states.out.label));
        b.appendChild(S.el('span', 'sc-cell-x', X.outNote));
        root.appendChild(b);
        n.cells[k].push(b);
        return;
      }
      X.fields.forEach(function(f, j) {
        var c = cell(f.see[pid]);
        var st = X.states[c.state];
        var b = S.el('div', 'ts-obj ts-c-' + st.tone + ' ts-soft sc-cell is-' + c.state + ' ts-hide', null, { left: x, top: rowY(j), width: MX.cw, height: MX.rowH });
        b.appendChild(S.icon(st.icon, 'sc-cell-i ts-ink'));
        b.appendChild(S.el('span', 'sc-cell-t', c.label));
        root.appendChild(b);
        n.cells[k].push(b);
      });
    });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [{ delay: 150, run: function() { S.on([n.label, n.tag]); } }];
  X.stages.forEach(function(st, i) {
    steps.push({ delay: 300 + i * 260, run: function() { S.on(n.stages[i]); if (i) S.on(n.locks[i - 1]); } });
  });
  var t1 = 300 + X.stages.length * 260 + 200;
  steps.push({ delay: t1, run: function() { S.on(n.transit); S.on(n.mxLabel); S.on(n.rec); S.on(n.fields); } });
  X.people.forEach(function(pid, k) {
    steps.push({ delay: t1 + 300 + k * 400, run: function() { S.on(n.heads[k]); S.on(n.cells[k]); } });
  });
  steps.push({ delay: t1 + 300 + X.people.length * 400 + 300, run: complete });
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
      return X.label + ': ' + X.stages.map(function(st, i) { return (i + 1) + ' ' + st.label + ', ' + st.items.join(', ').toLowerCase(); }).join('; ') + '. ' + X.transit + '. '
        + X.seeLabel + ', ' + X.record + ': ' + X.people.map(function(pid) {
          var p = person(pid);
          return p.name + ' (' + p.role + ', ' + p.scope + '): ' + X.fields.map(function(f) { return f.label.toLowerCase() + ' ' + cell(f.see[pid]).label.toLowerCase(); }).join(', ');
        }).join('; ') + '. ' + X.outNote;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
