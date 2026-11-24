// Scene: chain-drift (screen 03)
// Causal story: regulation changes from above, practice drifts from below, and the
// chain between them (obligation, risk or process, control, evidence, assessment,
// decision) stops telling one story. Some links break. The NFR professional re-maps
// the chain by hand. The consequences: fragmented, falsely assured, burdensome.
SceneDirector.register('chain-drift', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.chain;
  var W = 1040, H = 520;
  var SIDE = { y: 0, w: 318, h: 178 };
  var LINK = { y: 214, w: 150, h: 56 };
  var CONS = { y: 318, w: 330, h: 84, gap: 9 };

  var cv = null;
  var n = {};
  var done = false;

  function linkX(i) { var gap = (W - 32 - C.links.length * LINK.w) / (C.links.length - 1); return 16 + i * (LINK.w + gap); }

  function sideBox(spec, x, tone) {
    var b = S.el('div', 'ts-obj ts-c-' + tone + ' cd-side ts-hide ts-up', null, { left: x, top: SIDE.y, width: SIDE.w, height: SIDE.h });
    var h = S.el('div', 'cd-side-head');
    h.appendChild(S.icon(spec.icon, 'ts-ink'));
    h.appendChild(S.el('span', 'ts-ink', spec.label));
    b.appendChild(h);
    var ul = S.el('ul', 'cd-list');
    spec.items.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
    b.appendChild(ul);
    return b;
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'chain-drift' });
    n = { links: [], joins: [], breaks: [], cons: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    n.above = sideBox(C.above, 16, 'data');
    n.below = sideBox(C.below, W - 16 - SIDE.w, 'gap');
    root.appendChild(n.above);
    root.appendChild(n.below);

    var person = S.el('div', 'cd-person ts-hide ts-pop', null, { left: 490, top: 40, width: 60, height: 60 });
    person.appendChild(S.icon('ti-user'));
    root.appendChild(person);
    n.person = person;
    n.personLabel = S.el('div', 'ts-text cd-person-label ts-hide', C.person, { left: 350, top: 108, width: 340 });
    root.appendChild(n.personLabel);

    var cy = LINK.y + LINK.h / 2;
    C.links.forEach(function(l, i) {
      var x = linkX(i);
      var node = S.el('div', 'ts-obj ts-c-neutral cd-link ts-hide', null, { left: x, top: LINK.y, width: LINK.w, height: LINK.h });
      node.appendChild(S.el('span', 'cd-link-text', l));
      root.appendChild(node);
      n.links.push(node);
      if (i < C.links.length - 1) {
        var x2 = linkX(i + 1);
        var broken = C.broken.indexOf(i) >= 0;
        var p = S.svg('path', { d: 'M' + (x + LINK.w + 3) + ' ' + cy + ' L' + (x2 - 3) + ' ' + cy }, broken ? 'ts-s-gap cd-join is-broken' : 'ts-s-data cd-join');
        g.appendChild(p);
        n.joins.push(p);
        if (broken) {
          var mark = S.el('div', 'cd-break ts-hide ts-pop', null, { left: (x + LINK.w + x2) / 2 - 9, top: cy - 9, width: 18, height: 18 });
          mark.appendChild(S.icon('ti-unlink'));
          root.appendChild(mark);
          n.breaks.push(mark);
        }
      }
    });
    // Change from above lands on the obligation; drift from below on control and evidence
    n.arrowA = S.path(g, 'M' + (16 + SIDE.w / 2) + ' ' + (SIDE.h + 4) + ' L' + (linkX(0) + LINK.w / 2) + ' ' + (LINK.y - 6), 'ts-s-data cd-arrow', cv.marker('data'));
    n.arrowB = S.path(g, 'M' + (W - 16 - SIDE.w / 2) + ' ' + (SIDE.h + 4) + ' C' + (W - 16 - SIDE.w / 2) + ' ' + (SIDE.h + 30) + ' ' + (linkX(3) + LINK.w / 2) + ' ' + (LINK.y - 30) + ' ' + (linkX(3) + LINK.w / 2) + ' ' + (LINK.y - 6), 'ts-s-gap cd-arrow', cv.marker('gap'));

    C.consequences.forEach(function(c, i) {
      var b = S.el('div', 'ts-obj ts-c-gap cd-cons ts-hide ts-up', null, { left: 16 + i * (CONS.w + CONS.gap), top: CONS.y, width: CONS.w, height: CONS.h });
      b.appendChild(S.el('div', 'cd-cons-label', c.label));
      b.appendChild(S.el('div', 'ts-text', c.text));
      root.appendChild(b);
      n.cons.push(b);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: 430, width: 1008 });
    n.note.appendChild(S.el('span', 'ts-text', C.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.links); S.on(n.joins); } },
    { delay: 900,  run: function() { S.on(n.above); S.on(n.arrowA); } },
    { delay: 1500, run: function() { S.on(n.below); S.on(n.arrowB); } },
    { delay: 2200, run: function() { S.on(n.breaks); } },
    { delay: 2800, run: function() { S.on(n.person); S.on(n.personLabel); } },
    { delay: 3500, run: function() { S.on(n.cons); } },
    { delay: 4200, run: function() { S.on(n.note); } },
    { delay: 4800, run: complete }
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
      return C.above.label + ': ' + C.above.items.join(', ').toLowerCase() + '. ' + C.below.label + ': ' + C.below.items.join(', ').toLowerCase()
        + '. The chain ' + C.links.join(', ').toLowerCase() + ' no longer tells one story; ' + C.person.toLowerCase() + '. Consequences: '
        + C.consequences.map(function(c) { return c.label.toLowerCase() + ', ' + c.text.toLowerCase(); }).join(' ') + ' ' + C.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
