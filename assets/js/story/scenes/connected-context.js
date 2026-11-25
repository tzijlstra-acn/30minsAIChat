// Scene: connected-context (screen 10)
// Causal story: connected records show at once what one change affects. A control test
// fails. Straight connectors run from it to the four records it touches, each in its own
// system: the risk it mitigates, the obligation that relies on it, the self-assessment
// that still rates it effective, and the attestation due for sign-off. Then the contrast:
// today it is found by hand, often at audit; with NFR Workspace it is flagged the same
// day, before anyone signs. It works the other way for a new obligation too.
SceneDirector.register('connected-context', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.connected;
  var W = 1040, H = 470;
  var EV = { x: 262, y: 0, w: 516, h: 66 };
  var BUS = 94;
  var CARD = { y: 122, w: 243, h: 134, gap: 12 };
  var CMP = { y: 280, w: 498, h: 64, gap: 12 };

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return 16 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'connected-context', refHeight: 520 });
    n = { cards: [], drops: [], cmp: [] };
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
      root.appendChild(c);
      n.cards.push(c);
    });

    C.compare.forEach(function(x, i) {
      var b = S.el('div', 'ts-obj ts-c-' + x.tone + (i ? ' ts-soft' : ' ts-dash') + ' cc-cmp ts-hide ts-up', null, { left: 16 + i * (CMP.w + CMP.gap), top: CMP.y, width: CMP.w, height: CMP.h });
      b.appendChild(S.icon(x.icon, 'cc-cmp-icon ts-ink'));
      var body = S.el('div', 'cc-cmp-body');
      body.appendChild(S.el('div', 'cc-cmp-label ts-ink', x.label));
      body.appendChild(S.el('div', 'cc-cmp-text', x.text));
      b.appendChild(body);
      root.appendChild(b);
      n.cmp.push(b);
    });

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: CMP.y + CMP.h + 22, width: 1008 });
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
    { delay: 2800, run: function() { S.on(n.cmp[0]); } },
    { delay: 3300, run: function() { S.on(n.cmp[1]); } },
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
        + C.affected.map(function(a) { return a.type.toLowerCase() + ' ' + a.id + ' in the ' + a.system.toLowerCase() + ': ' + a.impact.toLowerCase(); }).join('; ')
        + '. ' + C.compare.map(function(x) { return x.label + ': ' + x.text; }).join(' ') + ' ' + C.line.join(' ');
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
