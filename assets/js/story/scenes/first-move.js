// Scene: first-move (Screen 12)
// Causal story: three cards (ownership, access, proof) validate in sequence. When all
// three are ready, the six-month route appears as the next action. The first-move
// hypothesis states the bounded scope, and the closing question opens the first
// working session.
SceneDirector.register('first-move', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var CARD_W = 222, CARD_H = 296, CARD_Y = 8;

  var CARDS = [
    { title: 'Ownership', c: 'human', icon: 'ti-user-check',
      items: ['Sponsor and product owner', 'Journey and user cohort', 'Process, control and platform reviewers'] },
    { title: 'Access', c: 'data', icon: 'ti-database',
      items: ['Source access', 'Target architecture and environment', 'Representative historical and live cases'] },
    { title: 'Proof', c: 'proof', icon: 'ti-target',
      items: ['Current baseline', 'Month-six measures', 'Read and write boundary', 'Gate criteria'] }
  ];
  var HYPOTHESIS = [
    'TPRM periodic review',
    'High or critical providers',
    'One team and named approvers',
    'Selected GRC, inventory, document and incident sources',
    'Read-only first',
    'One gated write after proof'
  ];
  var ROUTE = [
    { label: 'Frame', sub: 'Months 0 to 2', c: 'data' },
    { label: 'Build', sub: 'Months 2 to 4', c: 'ai' },
    { label: 'Test in use', sub: 'Months 4 to 6', c: 'proof' }
  ];
  var QUESTION = 'Which periodic-review cohort gives us the strongest mix of repeated effort, measurable value and usable data?';

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'first-move' });
    n = { cards: [], checks: [], route: [] };
    done = false;
    var root = cv.el;

    CARDS.forEach(function(c, i) {
      var x = 16 + i * (CARD_W + 16);
      var card = S.el('div', 'ts-obj ts-c-' + c.c + ' fm-card ts-hide ts-up', null, { left: x, top: CARD_Y, width: CARD_W, height: CARD_H });
      var head = S.el('div', 'fm-card-head');
      head.appendChild(S.icon(c.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'fm-card-title', c.title));
      var ok = S.el('span', 'fm-ready', 'Ready');
      head.appendChild(ok);
      card.appendChild(head);
      var checks = [];
      c.items.forEach(function(it) {
        var row = S.el('div', 'fm-item');
        row.appendChild(S.el('span', 'fm-box'));
        row.appendChild(S.el('span', null, it));
        card.appendChild(row);
        checks.push(row);
      });
      root.appendChild(card);
      n.cards.push(card);
      n.checks.push(checks);
    });

    var hyp = S.el('div', 'ts-obj ts-soft ts-c-ai fm-hyp ts-hide ts-right', null, { left: 734, top: CARD_Y, width: 290, height: CARD_H });
    hyp.appendChild(S.el('div', 'ts-label ts-ink', 'First-move hypothesis'));
    HYPOTHESIS.forEach(function(h, i) {
      var row = S.el('div', 'fm-hyp-row' + (i === 0 ? ' fm-hyp-main' : ''));
      row.appendChild(S.icon(i === 0 ? 'ti-target' : 'ti-point', 'ts-ink'));
      row.appendChild(S.el('span', null, h));
      hyp.appendChild(row);
    });
    root.appendChild(hyp);
    n.hyp = hyp;

    // The six-month route appears once ownership, access and proof are ready
    n.next = S.el('div', 'ts-label ts-ink ts-c-human fm-next ts-hide', 'Next action: start the six-month route', { left: 16, top: 330 });
    root.appendChild(n.next);
    ROUTE.forEach(function(r, i) {
      var seg = S.el('div', 'fm-seg ts-c-' + r.c + ' ts-hide ts-left', null, { left: 16 + i * 340, top: 356, width: 326, height: 48 });
      seg.appendChild(S.el('span', 'fm-seg-title', r.label));
      seg.appendChild(S.el('span', 'ts-note', r.sub));
      root.appendChild(seg);
      n.route.push(seg);
    });

    n.question = S.el('div', 'fm-question ts-hide ts-up', QUESTION, { left: 16, top: 430, width: 1008 });
    root.appendChild(n.question);
  }

  function validate(ci) {
    n.checks[ci].forEach(function(row) { row.classList.add('is-checked'); });
    n.cards[ci].classList.add('is-ready');
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.cards); } },
    { delay: 600,  run: function() { S.on(n.hyp); } },
    { delay: 1400, run: function() { validate(0); } },
    { delay: 2400, run: function() { validate(1); } },
    { delay: 3400, run: function() { validate(2); } },
    { delay: 4300, run: function() { S.on(n.next); S.on(n.route[0]); } },
    { delay: 4600, run: function() { S.on(n.route[1]); } },
    { delay: 4900, run: function() { S.on(n.route[2]); } },
    { delay: 5700, run: function() { S.on(n.question); } },
    { delay: 6500, run: complete }
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
      return CARDS.map(function(c) { return c.title + ': ' + c.items.join(', ').toLowerCase() + '.'; }).join(' ')
        + ' All three validate in turn, then the six-month route appears: frame, build, test in use. '
        + 'First-move hypothesis: ' + HYPOTHESIS.join('; ').toLowerCase() + '. Closing question: ' + QUESTION;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
