// Scene: assistance-here (screen 04)
// Causal story: AI can already help with individual activities. Email, chat, documents,
// meetings and policy questions light up around one professional. Underneath, the
// remaining operating gap appears: eight steps that assistance does not carry. The
// assistant helps the person; the Workspace carries the work.
SceneDirector.register('assistance-here', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var TILE = { y: 0, w: 188, h: 108, gap: 15, x0: 16 };
  var PERSON = { x: 520, y: 196, r: 30 };
  var GAP = { y: 318, w: 243, h: 52, gap: 12 };

  var cv = null;
  var n = {};
  var done = false;

  function tileX(i) { return TILE.x0 + i * (TILE.w + TILE.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'assistance-here' });
    n = { tiles: [], links: [], nodes: [], gaps: [], marks: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    D.channels.forEach(function(ch, i) {
      var x = tileX(i);
      var t = S.el('div', 'ts-obj ts-c-ai ah-tile ts-hide ts-up', null, { left: x, top: TILE.y, width: TILE.w, height: TILE.h });
      var head = S.el('div', 'ah-head');
      head.appendChild(S.icon(ch.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'ts-title', ch.label));
      t.appendChild(head);
      t.appendChild(S.el('div', 'ts-text', ch.helps));
      var ok = S.el('div', 'ah-ok');
      ok.appendChild(S.icon('ti-circle-check'));
      ok.appendChild(S.el('span', null, 'Helps here'));
      t.appendChild(ok);
      root.appendChild(t);
      n.tiles.push(t);
      var sx = x + TILE.w / 2, sy = TILE.y + TILE.h;
      n.links.push(S.path(g, 'M' + sx + ' ' + sy + ' C' + sx + ' ' + (sy + 50) + ' ' + PERSON.x + ' ' + (PERSON.y - 70) + ' ' + PERSON.x + ' ' + (PERSON.y - PERSON.r - 4), 'ts-s-ai ah-link'));
    });

    var person = S.el('div', 'ah-person ts-hide ts-pop', null, { left: PERSON.x - PERSON.r, top: PERSON.y - PERSON.r, width: PERSON.r * 2, height: PERSON.r * 2 });
    person.appendChild(S.icon('ti-user'));
    root.appendChild(person);
    n.person = person;
    n.personLabel = S.el('div', 'ts-text ah-person-label ts-hide', 'One professional, one activity at a time', { left: PERSON.x - 170, top: PERSON.y + PERSON.r + 8, width: 340 });
    root.appendChild(n.personLabel);

    // The remaining operating gap: what assistance does not carry
    n.laneLabel = S.el('div', 'ts-label ts-ink ts-c-human ts-hide', D.gapTitle, { left: 16, top: GAP.y - 30, width: 600 });
    root.appendChild(n.laneLabel);
    D.gap.forEach(function(t, i) {
      var col = i % 4, row = Math.floor(i / 4);
      var chip = S.el('div', 'ts-obj ts-c-gap ah-gapstep ts-hide ts-up', null, { left: 16 + col * (GAP.w + GAP.gap), top: GAP.y + row * (GAP.h + 10), width: GAP.w, height: GAP.h });
      chip.appendChild(S.el('span', 'ah-gap-n', String(i + 1)));
      chip.appendChild(S.el('span', 'ah-gap-t', t));
      root.appendChild(chip);
      n.nodes.push(chip);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 462, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', D.difference[0]));
    n.note.appendChild(S.el('span', 'ts-text', D.difference[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.tiles[0]); } },
    { delay: 450,  run: function() { S.on(n.tiles[1]); } },
    { delay: 700,  run: function() { S.on(n.tiles[2]); } },
    { delay: 950,  run: function() { S.on(n.tiles[3]); } },
    { delay: 1200, run: function() { S.on(n.tiles[4]); } },
    { delay: 1600, run: function() { S.on(n.links); S.on(n.person); } },
    { delay: 2200, run: function() { S.on(n.personLabel); } },
    { delay: 2900, run: function() { S.on(n.laneLabel); S.on(n.nodes.slice(0, 4)); } },
    { delay: 3500, run: function() { S.on(n.nodes.slice(4)); } },
    { delay: 4300, run: function() { S.on(n.note); } },
    { delay: 4900, run: complete }
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
      return 'AI assistance already helps in ' + D.channels.map(function(c) { return c.label.toLowerCase(); }).join(', ')
        + ', each marked helps here around one professional. ' + D.gapTitle + ': ' + D.gap.join(', ').toLowerCase() + '. ' + D.difference.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
