// Scene: assistance-here (screen 04)
// Causal story: standalone AI sees one system. One NFR question (the one the live
// product answers in act 3) needs eight sources, each living in its own system. The
// email, document and GRC assistants each see one of them; the chat assistant sees only
// what is pasted in. Five sources stay unseen, so the professional joins the picture by
// hand. NFR Workspace brings every system's content into one picture, within the
// user's permissions.
SceneDirector.register('assistance-here', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.sees;
  var W = 1040, H = 520;
  var Q = { y: 0, h: 56 };
  var CHIP = { y: 108, w: 243, h: 54, gap: 12, row: 10 };
  var TOOL = { y: 292, w: 243, h: 84 };
  var PERSON = { y: 396, h: 40 };

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * (CHIP.w + CHIP.gap); }
  function chipY(row) { return CHIP.y + row * (CHIP.h + CHIP.row); }
  function seenBy(id) { for (var i = 0; i < A.tools.length; i++) if (A.tools[i].covers === id) return A.tools[i]; return null; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'assistance-here' });
    n = { row1: [], row2: [], tools: [], links: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    // The question, as it arrives
    n.q = S.el('div', 'ts-obj ts-c-neutral ah-q ts-hide ts-up', null, { left: 16, top: Q.y, width: 1008, height: Q.h });
    n.q.appendChild(S.el('span', 'ah-q-k', A.question.label));
    n.q.appendChild(S.el('span', 'ah-q-t', A.question.text));
    root.appendChild(n.q);

    // What the answer needs, and where each part lives: row 2 sits above the tools
    n.needsLabel = S.el('div', 'ts-label ts-hide', A.needsTitle, { left: 16, top: CHIP.y - 26, width: 700 });
    root.appendChild(n.needsLabel);
    var at = {};
    A.needs.forEach(function(nd, i) {
      var col = i % 4, row = Math.floor(i / 4);
      var seen = !!seenBy(nd.id);
      var c = S.el('div', 'ts-obj ' + (seen ? 'ts-c-ai is-seen' : 'ts-c-gap is-unseen') + ' ah-need ts-hide ts-up', null, { left: colX(col), top: chipY(row), width: CHIP.w, height: CHIP.h });
      c.appendChild(S.el('span', 'ah-need-l', nd.label));
      c.appendChild(S.el('span', 'ah-need-s', nd.system));
      if (seen) c.appendChild(S.icon('ti-eye', 'ah-need-eye'));
      root.appendChild(c);
      (row ? n.row2 : n.row1).push(c);
      at[nd.id] = { x: colX(col) + CHIP.w / 2, y: chipY(row) + CHIP.h };
    });

    // Each AI tool and the one source it sees
    A.tools.forEach(function(t, i) {
      var x = colX(i);
      var b = S.el('div', 'ts-obj ts-c-ai ah-tool ts-hide ts-up', null, { left: x, top: TOOL.y, width: TOOL.w, height: TOOL.h });
      var head = S.el('div', 'ah-head');
      head.appendChild(S.icon(t.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'ts-title', t.label));
      b.appendChild(head);
      var sees = S.el('div', 'ah-tool-sees');
      sees.appendChild(S.el('span', 'ah-tool-k', A.seesLabel));
      sees.appendChild(S.el('span', 'ah-tool-v', t.sees));
      b.appendChild(sees);
      root.appendChild(b);
      n.tools.push(b);
      var to = t.covers && at[t.covers];
      if (to) n.links.push(S.path(g, 'M' + (x + TOOL.w / 2) + ' ' + (TOOL.y - 4) + ' L' + to.x + ' ' + (to.y + 6), 'ts-s-ai ah-seeline', cv.marker('ai')));
    });

    n.person = S.el('div', 'ah-joins ts-hide', null, { left: 16, top: PERSON.y, width: 1008, height: PERSON.h });
    n.person.appendChild(S.icon('ti-user'));
    n.person.appendChild(S.el('span', null, A.person));
    root.appendChild(n.person);

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 452, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', A.note[0]));
    n.note.appendChild(S.el('span', 'ts-text', A.note[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.q); } },
    { delay: 800,  run: function() { S.on(n.needsLabel); S.on(n.row1); } },
    { delay: 1200, run: function() { S.on(n.row2); } },
    { delay: 1900, run: function() { S.on(n.tools); } },
    { delay: 2500, run: function() { S.on(n.links); } },
    { delay: 3200, run: function() { S.on(n.person); } },
    { delay: 3900, run: function() { S.on(n.note); } },
    { delay: 4500, run: complete }
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
      return A.question.label + ': ' + A.question.text + ' ' + A.needsTitle + ': '
        + A.needs.map(function(x) { return x.label.toLowerCase() + ' in the ' + x.system.toLowerCase(); }).join(', ') + '. '
        + A.tools.map(function(t) { return 'the ' + t.label.toLowerCase() + ' sees ' + t.sees.toLowerCase(); }).join('; ') + '. '
        + A.person + ' ' + A.note.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
