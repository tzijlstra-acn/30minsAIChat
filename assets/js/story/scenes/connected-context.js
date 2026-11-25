// Scene: connected-context (screen 10)
// Causal story: one failed test, every affected record found, every owner told. A control
// test fails. Straight connectors run from it to the four records it touches, each in its
// own system: the risk it mitigates, the obligation that relies on it, the self-assessment
// that still rates it effective, and the attestation due for sign-off. Each card then
// shows its owner's next step: review the rating, check the obligation, reassess, pause
// the sign-off. Flagged the same day, before anyone signs, and each owner sees only their
// part. It works the other way for a new obligation too.
SceneDirector.register('connected-context', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.connected;
  var W = 1040, H = 470;
  var RES = { y: 340, h: 46 };
  var EV = { x: 262, y: 0, w: 516, h: 66 };
  var BUS = 94;
  var CARD = { y: 122, w: 243, h: 196, gap: 12 };

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return 16 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'connected-context', refHeight: 520 });
    n = { cards: [], drops: [], owners: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    var E = C.event;

    n.event = S.el('div', 'ts-obj ts-c-gap ts-soft cc-event ts-hide ts-pop', null, { left: EV.x, top: EV.y, width: EV.w, height: EV.h });
    n.event.appendChild(S.icon('ti-alert-triangle', 'cc-event-icon ts-ink'));
    var eb = S.el('div', 'cc-event-body');
    eb.appendChild(S.el('div', 'cc-event-label', E.label));
    eb.appendChild(S.el('div', 'cc-event-meta', [E.id, E.name, E.system].join('  ·  ')));
    n.event.appendChild(eb);
    root.appendChild(n.event);

    // Straight connectors: a trunk down from the event, a bus across, a drop to each record
    var first = cardX(0) + CARD.w / 2, last = cardX(C.affected.length - 1) + CARD.w / 2;
    n.trunk = S.path(g, 'M' + (EV.x + EV.w / 2) + ' ' + (EV.y + EV.h + 2) + ' V' + BUS + ' M' + first + ' ' + BUS + ' H' + last, 'ts-s-gap cc-wire');
    C.affected.forEach(function(a, i) {
      var x = cardX(i) + CARD.w / 2;
      n.drops.push(S.path(g, 'M' + x + ' ' + BUS + ' V' + (CARD.y - 6), 'ts-s-gap cc-wire', cv.marker('gap')));
      var c = S.el('div', 'ts-obj ts-c-data cc-card ts-hide ts-up', null, { left: cardX(i), top: CARD.y, width: CARD.w, height: CARD.h });
      var head = S.el('div', 'cc-card-head ts-ink');
      head.appendChild(S.icon(a.icon));
      head.appendChild(S.el('span', null, a.type));
      c.appendChild(head);
      c.appendChild(S.el('div', 'cc-card-name', a.name));
      c.appendChild(S.el('div', 'cc-card-meta', a.id + '  ·  ' + a.system));
      var imp = S.el('div', 'cc-impact');
      imp.appendChild(S.icon('ti-point'));
      imp.appendChild(S.el('span', null, a.impact));
      c.appendChild(imp);
      var own = S.el('div', 'cc-owner ts-hide');
      var ok = S.el('div', 'cc-owner-k');
      ok.appendChild(S.icon('ti-user-check'));
      ok.appendChild(S.el('span', null, C.ownerLabel + ' ' + a.owner));
      own.appendChild(ok);
      own.appendChild(S.el('div', 'cc-owner-t', a.action));
      c.appendChild(own);
      n.owners.push(own);
      root.appendChild(c);
      n.cards.push(c);
    });

    n.result = S.el('div', 'ts-obj ts-c-proof ts-soft qp-need cc-result ts-hide ts-up', null, { left: 16, top: RES.y, width: 1008, height: RES.h });
    n.result.appendChild(S.icon('ti-bolt', 'ts-ink'));
    n.result.appendChild(S.el('span', 'cc-result-t', C.result));
    root.appendChild(n.result);

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: RES.y + RES.h + 20, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', C.line[0]));
    n.note.appendChild(S.el('span', 'ts-text', C.line[1]));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.event); } },
    { delay: 800,  run: function() { S.on(n.trunk); S.on(n.drops); } }
  ];
  C.affected.forEach(function(a, i) { steps.push({ delay: 1300 + i * 300, run: function() { S.on(n.cards[i]); } }); });
  steps.push(
    { delay: 2700, run: function() { S.on(n.owners); } },
    { delay: 3300, run: function() { S.on(n.result); } },
    { delay: 3900, run: function() { S.on(n.note); } },
    { delay: 4500, run: complete }
  );
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
      var E = C.event;
      return E.label + ': ' + E.id + ', ' + E.name.toLowerCase() + ', in the ' + E.system.toLowerCase() + '. It affects '
        + C.affected.map(function(a) { return a.type.toLowerCase() + ' ' + a.id + ' in the ' + a.system.toLowerCase() + ': ' + a.impact.toLowerCase() + '; ' + C.ownerLabel.toLowerCase() + ' ' + a.owner.toLowerCase() + ': ' + a.action.toLowerCase(); }).join('; ')
        + '. ' + C.result + ' ' + C.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
