// Scene: pressure-gap (Screen 01) -- the hook
// Causal story: three pressures arrive one by one (more dependence, higher
// expectations, faster change). Each pushes oversight demand up, while team capacity
// stays flat. The widening gap is filled with firefighting, which the team feels as
// late reviews, evidence chased by hand and judgement squeezed into the last hour.
// The chart is an illustrative shape only: no figures, no client data.
SceneDirector.register('pressure-gap', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;

  var PRESSURES = [
    { title: 'More dependence', icon: 'ti-sitemap', text: 'More critical third parties, cloud concentration and outsourced processes to oversee' },
    { title: 'Higher expectations', icon: 'ti-gavel', text: 'Regulation such as DORA and operational-resilience rules expects evidence, not assertions' },
    { title: 'Faster change', icon: 'ti-clock', text: 'Incidents, control changes, assessments and regulatory updates arrive all year, not once a year' }
  ];
  var SYMPTOMS = [
    { label: 'Reviews run late', icon: 'ti-clock' },
    { label: 'Evidence is chased by hand', icon: 'ti-mail' },
    { label: 'Judgement gets the last hour', icon: 'ti-user' }
  ];
  // Chart geometry: demand rises in three steps against flat capacity
  var CAP_Y = 250;
  var SEGMENTS = [
    'M480 268 C540 266 600 248 650 236',
    'M650 236 C710 222 770 200 820 178',
    'M820 178 C880 152 940 124 1000 100'
  ];
  var MARKS = [{ x: 650, y: 236 }, { x: 820, y: 178 }, { x: 1000, y: 100 }];
  var GAP = 'M590 250 C615 244 632 240 650 236 C710 222 770 200 820 178 C880 152 940 124 1000 100 L1000 250 Z';

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'pressure-gap' });
    n = { pressures: [], segs: [], marks: [], symptoms: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    n.leftLabel = S.el('div', 'ts-label ts-hide', 'What is changing', { left: 16, top: 8 });
    root.appendChild(n.leftLabel);
    PRESSURES.forEach(function(p, i) {
      var box = S.el('div', 'ts-obj ts-c-data pg-pressure ts-hide ts-left', null, { left: 16, top: 34 + i * 100, width: 410, height: 88 });
      var head = S.el('div', 'pg-head');
      head.appendChild(S.el('span', 'pg-num', String(i + 1)));
      head.appendChild(S.icon(p.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'ts-title', p.title));
      box.appendChild(head);
      box.appendChild(S.el('div', 'ts-text', p.text));
      root.appendChild(box);
      n.pressures.push(box);
    });

    // Illustrative chart: a labelled region, not a data chart
    n.field = S.el('div', 'ts-boundary pg-field ts-hide', null, { left: 456, top: 34, width: 568, height: 288 });
    root.appendChild(n.field);
    n.fieldLabel = S.el('div', 'ts-label ts-hide', 'Illustrative shape, not client data', { left: 472, top: 44 });
    root.appendChild(n.fieldLabel);
    n.axis = S.path(g, 'M480 300 L1004 300', 'ts-s-neutral', cv.marker('neutral'));
    n.time = S.el('div', 'ts-label ts-hide', 'Time', { left: 966, top: 304 });
    root.appendChild(n.time);

    n.gap = S.svg('path', { d: GAP }, 'pg-gap');
    g.appendChild(n.gap);
    n.capacity = S.path(g, 'M480 ' + CAP_Y + ' L1004 ' + CAP_Y, 'ts-s-human pg-line');
    n.capLabel = S.el('div', 'ts-label ts-ink ts-c-human ts-hide', 'Team capacity', { left: 872, top: CAP_Y + 8 });
    root.appendChild(n.capLabel);
    SEGMENTS.forEach(function(d, i) {
      n.segs.push(S.path(g, d, 'ts-s-data pg-line'));
      var mk = S.el('div', 'pg-mark ts-hide ts-pop', String(i + 1), { left: MARKS[i].x - 10, top: MARKS[i].y - 10, width: 20, height: 20 });
      root.appendChild(mk);
      n.marks.push(mk);
    });
    n.demandLabel = S.el('div', 'ts-label ts-ink ts-c-data ts-hide', 'Oversight demand', { left: 820, top: 76, width: 150 });
    root.appendChild(n.demandLabel);
    n.gapLabel = S.el('div', 'ts-label ts-ink ts-c-gap pg-gap-label ts-hide', 'The gap: firefighting', { left: 838, top: 206, width: 150 });
    root.appendChild(n.gapLabel);

    // What the team feels
    n.feelLabel = S.el('div', 'ts-label ts-hide', 'What the team feels', { left: 16, top: 352 });
    root.appendChild(n.feelLabel);
    SYMPTOMS.forEach(function(s, i) {
      var box = S.el('div', 'pg-symptom ts-hide ts-up', null, { left: 16 + i * 342, top: 380, width: 324, height: 64 });
      box.appendChild(S.icon(s.icon));
      box.appendChild(S.el('span', 'pg-symptom-text', s.label));
      root.appendChild(box);
      n.symptoms.push(box);
    });
    n.bridge = S.el('div', 'ts-note pg-bridge ts-hide', 'Next: the north star, then one worked example from third-party risk', { left: 16, top: 470, width: 1008 });
    root.appendChild(n.bridge);
  }

  function push(i) {
    S.on(n.pressures[i]);
    S.on(n.segs[i]);
    S.on(n.marks[i]);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on([n.leftLabel, n.field, n.fieldLabel, n.axis, n.time]); } },
    { delay: 600,  run: function() { S.on(n.capacity); S.on(n.capLabel); } },
    { delay: 1300, run: function() { push(0); } },
    { delay: 2300, run: function() { push(1); } },
    { delay: 3300, run: function() { push(2); S.on(n.demandLabel); } },
    { delay: 4300, run: function() { S.on(n.gap); S.on(n.gapLabel); } },
    { delay: 5100, run: function() { S.on(n.feelLabel); S.on(n.symptoms[0]); } },
    { delay: 5450, run: function() { S.on(n.symptoms[1]); } },
    { delay: 5800, run: function() { S.on(n.symptoms[2]); } },
    { delay: 6400, run: function() { S.on(n.bridge); } },
    { delay: 7000, run: complete }
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
      return 'Three pressures arrive one by one: ' + PRESSURES.map(function(p) { return p.title.toLowerCase() + ', ' + p.text.toLowerCase(); }).join('; ')
        + '. Each pushes oversight demand up while team capacity stays flat, shown as an illustrative shape without figures. '
        + 'The widening gap is filled with firefighting. The team feels it as: ' + SYMPTOMS.map(function(s) { return s.label.toLowerCase(); }).join(', ') + '.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
