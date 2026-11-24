// Scene: work-arrives (screen 02)
// Causal story: NFR work arrives as a question, not a method. Four requests a risk team
// recognises arrive from four places (an email from the COO, a regulatory meeting, an
// audit request, a chat from procurement). Each card then shows what it takes to answer:
// the records needed and the people who have to help. None arrives labelled with a
// method; the answer sits across several systems.
SceneDirector.register('work-arrives', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.arrives;
  var W = 1040, H = 444;
  var CARD = { x0: 16, y: 0, w: 243, gap: 12, h: 346 };

  var cv = null;
  var n = {};
  var done = false;

  function cardX(i) { return CARD.x0 + i * (CARD.w + CARD.gap); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'work-arrives', refHeight: 520 });
    n = { cards: [], secs: [] };
    done = false;
    var root = cv.el;
    A.asks.forEach(function(a, i) {
      var c = S.el('div', 'ts-obj ts-c-human wa2-card ts-hide ts-up', null, { left: cardX(i), top: CARD.y, width: CARD.w, height: CARD.h });
      var chan = S.el('div', 'wa2-chan ts-ink');
      chan.appendChild(S.icon(a.icon));
      chan.appendChild(S.el('span', null, a.channel));
      c.appendChild(chan);
      c.appendChild(S.el('div', 'wa2-from', a.from));
      c.appendChild(S.el('div', 'wa2-q', a.text));
      var sec = S.el('div', 'wa2-sec ts-hide');
      sec.appendChild(S.el('div', 'wa2-k', A.needsTitle));
      var ul = S.el('ul', 'wa2-list');
      a.needs.forEach(function(t) { ul.appendChild(S.el('li', null, t)); });
      sec.appendChild(ul);
      sec.appendChild(S.el('div', 'wa2-k', A.whoTitle));
      sec.appendChild(S.el('div', 'wa2-who', a.who));
      c.appendChild(sec);
      root.appendChild(c);
      n.cards.push(c);
      n.secs.push(sec);
    });
    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: CARD.y + CARD.h + 22, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', A.strong));
    n.note.appendChild(S.el('span', 'ts-text', A.line));
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cards[0]); } },
    { delay: 600,  run: function() { S.on(n.cards[1]); } },
    { delay: 1000, run: function() { S.on(n.cards[2]); } },
    { delay: 1400, run: function() { S.on(n.cards[3]); } },
    { delay: 2100, run: function() { S.on(n.secs); } },
    { delay: 2900, run: function() { S.on(n.note); } },
    { delay: 3400, run: complete }
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
      return 'Four requests arrive: ' + A.asks.map(function(a) {
        return a.channel.toLowerCase() + ', ' + a.from.toLowerCase() + ': ' + a.text + ' ' + A.needsTitle + ': ' + a.needs.join(', ').toLowerCase() + '. ' + A.whoTitle + ': ' + a.who.toLowerCase() + '.';
      }).join(' ') + ' ' + A.strong + ' ' + A.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
