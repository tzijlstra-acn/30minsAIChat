// Scene: work-arrives (screen 02)
// Causal story: every NFR question cuts across several levels at once. Five rows stack up:
// who asks, what they ask, where the answer lives, who has to help, and how it is worked
// out. The screen then steps through the four everyday questions; each lights the askers,
// systems, teams and method it needs, with lines to the askers above and the systems
// below. It ends on the fourth question, the one screen 04 types out, and counts the
// whole: six askers, four questions, eight systems, five teams, four methods. None of the
// questions arrives labelled with a method. A click on a question card shows its links.
SceneDirector.register('work-arrives', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var A = D.arrives;
  var W = 1040, H = 520;
  var LBL = { x: 16, w: 118 };
  var X0 = 148, CW = 1024 - X0;
  var ROW = {
    who: { y: 0, h: 40, gap: 8 },
    ask: { y: 76, h: 92, gap: 12 },
    data: { y: 206, h: 40, gap: 6 },
    help: { y: 272, h: 32, gap: 10 },
    method: { y: 330, h: 32, gap: 12 }
  };
  var TOT = { y: 390, h: 54, gap: 10 };
  var NOTE = 462;
  var FOCUS = { start: 2100, every: 1200 };

  var cv = null;
  var n = {};
  var done = false;
  var cur = -1;

  function slot(key, count, i) {
    var r = ROW[key], w = (CW - (count - 1) * r.gap) / count;
    return { left: X0 + i * (w + r.gap), top: r.y, width: w, height: r.h };
  }
  function lists() { return { who: A.askers, data: A.systems, help: A.teams, method: A.methods }; }
  function total(key) { return key === 'asks' ? A.asks.length : key === 'askers' ? A.askers.length : key === 'systems' ? A.systems.length : key === 'teams' ? A.teams.length : A.methods.length; }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'work-arrives' });
    cv.el.classList.add('wa3-root');
    n = { labels: [], chips: { who: [], data: [], help: [], method: [] }, cards: [], lines: [], totals: [] };
    done = false;
    cur = -1;
    var root = cv.el;

    Object.keys(ROW).forEach(function(k) {
      var r = ROW[k];
      var l = S.el('div', 'ts-label wa3-level ts-hide', A.levels[k], { left: LBL.x, top: r.y, width: LBL.w, height: r.h });
      root.appendChild(l);
      n.labels.push(l);
    });

    var L = lists();
    ['who', 'data', 'help', 'method'].forEach(function(k) {
      L[k].forEach(function(item, i) {
        var g = k === 'method' ? slot('method', A.asks.length, i) : slot(k, L[k].length, i);
        var c = S.el('div', 'ts-obj wa3-chip wa3-' + k + ' ts-hide ts-up', null, g);
        c.setAttribute('data-id', item.id);
        c.appendChild(S.el('span', 'wa3-chip-t', item.label));
        root.appendChild(c);
        n.chips[k].push(c);
      });
    });

    A.asks.forEach(function(a, i) {
      var c = S.el('button', 'ts-obj ts-c-human wa3-card ts-hide ts-up', null, slot('ask', A.asks.length, i));
      c.type = 'button';
      c.setAttribute('aria-pressed', 'false');
      var chan = S.el('span', 'wa3-chan ts-ink');
      chan.appendChild(S.icon(a.icon));
      chan.appendChild(S.el('span', null, a.channel));
      c.appendChild(chan);
      c.appendChild(S.el('span', 'wa3-q', a.text));
      c.addEventListener('click', function(e) { e.stopPropagation(); focus(i); });
      root.appendChild(c);
      n.cards.push(c);
    });

    A.totals.forEach(function(tt, i) {
      var w = (1008 - (A.totals.length - 1) * TOT.gap) / A.totals.length;
      var b = S.el('div', 'ts-obj ts-c-human ts-soft wa3-total ts-hide ts-up', null, { left: 16 + i * (w + TOT.gap), top: TOT.y, width: w, height: TOT.h });
      b.appendChild(S.el('span', 'wa3-total-n ts-ink', String(total(tt[0]))));
      b.appendChild(S.el('span', 'wa3-total-l', tt[1]));
      root.appendChild(b);
      n.totals.push(b);
    });

    n.note = S.el('div', 'ah-note ts-hide', null, { left: 16, top: NOTE, width: 1008 });
    n.note.appendChild(S.el('span', 'ah-note-strong', A.strong));
    n.note.appendChild(S.el('span', 'ts-text', A.line));
    root.appendChild(n.note);
  }

  // Light one question: its askers, systems, teams and method; lines up and down
  function focus(i) {
    if (!cv) return;
    var a = A.asks[i];
    cur = i;
    var g = cv.svg;
    n.lines.forEach(function(p) { if (p.parentNode) p.parentNode.removeChild(p); });
    n.lines = [];
    cv.el.classList.add('has-focus');
    n.cards.forEach(function(c, j) { c.classList.toggle('is-active', j === i); c.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    var want = { who: a.who, data: a.data, help: a.help, method: [a.method] };
    Object.keys(want).forEach(function(k) {
      n.chips[k].forEach(function(c) { c.classList.toggle('is-on', want[k].indexOf(c.getAttribute('data-id')) >= 0); });
    });
    var card = slot('ask', A.asks.length, i), cx = card.left + card.width / 2;
    n.chips.who.forEach(function(c, j) {
      if (!c.classList.contains('is-on')) return;
      var s = slot('who', A.askers.length, j);
      n.lines.push(S.path(g, 'M' + cx + ' ' + (card.top - 2) + ' L' + (s.left + s.width / 2) + ' ' + (s.top + s.height + 2), 'ts-s-human wa3-line'));
    });
    n.chips.data.forEach(function(c, j) {
      if (!c.classList.contains('is-on')) return;
      var s = slot('data', A.systems.length, j);
      n.lines.push(S.path(g, 'M' + cx + ' ' + (card.top + card.height + 2) + ' L' + (s.left + s.width / 2) + ' ' + (s.top - 2), 'ts-s-human wa3-line'));
    });
    if (n.lines.length) n.lines[0].getBoundingClientRect();
    S.on(n.lines);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.labels); S.on(n.chips.who); } },
    { delay: 600,  run: function() { S.on(n.cards); } },
    { delay: 1000, run: function() { S.on(n.chips.data); } },
    { delay: 1300, run: function() { S.on(n.chips.help); } },
    { delay: 1600, run: function() { S.on(n.chips.method); } }
  ];
  A.asks.forEach(function(a, i) { steps.push({ delay: FOCUS.start + i * FOCUS.every, run: function() { focus(i); } }); });
  var tt = FOCUS.start + (A.asks.length - 1) * FOCUS.every + 900;
  A.totals.forEach(function(x, i) { steps.push({ delay: tt + i * 100, run: function() { S.on(n.totals[i]); } }); });
  steps.push(
    { delay: tt + 800,  run: function() { S.on(n.note); } },
    { delay: tt + 1300, run: complete }
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
      var L = lists();
      function names(k, ids) { return ids.map(function(id) { return L[k].filter(function(x) { return x.id === id; })[0].label.toLowerCase(); }).join(' and '); }
      return A.asks.map(function(a) {
        return a.channel + ': ' + a.text + ' Asked by ' + names('who', a.who) + '; the answer lives in ' + names('data', a.data) + '; help from ' + names('help', a.help) + '; worked out by ' + names('method', [a.method]) + '.';
      }).join(' ') + ' In all: ' + A.totals.map(function(x) { return total(x[0]) + ' ' + x[1]; }).join(', ') + '. ' + A.strong + ' ' + A.line;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
