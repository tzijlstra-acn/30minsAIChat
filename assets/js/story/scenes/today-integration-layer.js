// Scene: today-integration-layer (Screen 01)
// Causal story: five kinds of input arrive one by one. Each one creates more manual
// connection work for the TPRM professional, while the approver waits for a review
// package that is not ready. The integration happens in a person, not in the system.
SceneDirector.register('today-integration-layer', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var PRO = { x: 540, y: 236, r: 64 };

  var INPUTS = [
    { label: 'GRC and third-party inventory',  icon: 'ti-database',   task: 'Copy' },
    { label: 'Contracts and assurance reports', icon: 'ti-file-text',  task: 'Compare' },
    { label: 'Incidents and KRIs',             icon: 'ti-chart-bar',  task: 'Reconcile' },
    { label: 'Mail, Teams and meetings',       icon: 'ti-mail',       task: 'Chase' },
    { label: 'Trackers, tasks and deadlines',  icon: 'ti-clock',      task: 'Re-key' }
  ];
  var TASK_POS = [
    { x: 432, y: 120 }, { x: 600, y: 116 }, { x: 640, y: 324 }, { x: 420, y: 336 }, { x: 532, y: 368 }
  ];
  var LINES_PER_INPUT = 3;

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'today-integration-layer' });
    n = { inputs: [], links: [], tasks: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    INPUTS.forEach(function(inp, i) {
      var y = 34 + i * 88;
      var box = S.el('div', 'ts-obj ts-c-data il-input ts-hide ts-left', null, { left: 16, top: y, width: 268, height: 62 });
      var icon = S.icon(inp.icon, 'ts-ink');
      box.appendChild(icon);
      box.appendChild(S.el('span', 'il-input-label', inp.label));
      root.appendChild(box);
      n.inputs.push(box);

      // Several manual lines per input: copying, comparing and chasing by hand
      var group = [];
      for (var k = 0; k < LINES_PER_INPUT; k++) {
        var sy = y + 16 + k * 15;
        var ty = PRO.y - 18 + i * 9 + k * 3;
        var d = 'M286 ' + sy + ' C' + (380 + k * 14) + ' ' + sy + ' ' + (PRO.x - 150 + k * 10) + ' ' + ty + ' ' + (PRO.x - PRO.r - 4) + ' ' + ty;
        group.push(S.path(g, d, 'ts-s-neutral il-manual'));
      }
      n.links.push(group);

      var tp = TASK_POS[i];
      var tag = S.el('div', 'ts-chip ts-c-neutral ts-hide ts-pop', inp.task, { left: tp.x, top: tp.y });
      root.appendChild(tag);
      n.tasks.push(tag);
    });

    // The professional: a person doing integration work before any judgement
    var pro = S.el('div', 'il-pro ts-hide ts-pop', null, { left: PRO.x - PRO.r, top: PRO.y - PRO.r, width: PRO.r * 2, height: PRO.r * 2 });
    var picon = S.icon('ti-user');
    pro.appendChild(picon);
    root.appendChild(pro);
    n.pro = pro;
    n.proLabel = S.el('div', 'ts-title il-center ts-hide', 'TPRM professional', { left: PRO.x - 100, top: PRO.y + PRO.r + 8, width: 200 });
    root.appendChild(n.proLabel);

    // Count of open manual connections
    var meter = S.el('div', 'il-meter ts-hide', null, { left: PRO.x - 100, top: 438, width: 200 });
    n.count = S.el('div', 'ts-big il-count', '0');
    meter.appendChild(n.count);
    meter.appendChild(S.el('div', 'ts-label', 'Open manual connections'));
    root.appendChild(meter);
    n.meter = meter;

    // The approver waits for a package that is not ready
    var appr = S.el('div', 'ts-obj ts-c-human ts-dash il-approver ts-hide ts-right', null, { left: 800, top: 176, width: 224, height: 120 });
    var aicon = S.icon('ti-user-check', 'ts-ink');
    appr.appendChild(aicon);
    appr.appendChild(S.el('div', 'ts-title', 'Approver'));
    n.apprState = S.el('div', 'ts-label ts-ink', 'Waiting for review package');
    appr.appendChild(n.apprState);
    appr.appendChild(S.el('div', 'ts-text', 'Decision not started'));
    root.appendChild(appr);
    n.appr = appr;

    n.gap = S.path(g, 'M' + (PRO.x + PRO.r + 6) + ' ' + PRO.y + ' L794 ' + PRO.y, 'ts-s-gap il-gap');
    n.gapLabel = S.el('div', 'ts-label ts-ink ts-c-gap ts-hide', 'Package not ready', { left: 640, top: PRO.y - 26 });
    root.appendChild(n.gapLabel);
  }

  function arrive(i) {
    S.on(n.inputs[i]);
    S.on(n.links[i]);
    S.on(n.tasks[i]);
    n.count.textContent = String((i + 1) * LINES_PER_INPUT);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.pro); S.on(n.proLabel); S.on(n.meter); S.on(n.appr); } },
    { delay: 800,  run: function() { arrive(0); } },
    { delay: 1700, run: function() { arrive(1); } },
    { delay: 2600, run: function() { arrive(2); } },
    { delay: 3500, run: function() { arrive(3); } },
    { delay: 4400, run: function() { arrive(4); } },
    { delay: 5300, run: function() { S.on(n.gap); S.on(n.gapLabel); } },
    { delay: 6100, run: function() { n.appr.classList.add('is-waiting'); } },
    { delay: 6800, run: complete }
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
      return 'Five inputs arrive one by one: GRC and third-party inventory, contracts and assurance reports, incidents and KRIs, '
        + 'mail and meetings, and trackers. Each creates more manual connections into the TPRM professional, who copies, compares, '
        + 'reconciles, chases and re-keys. The approver waits for a review package that is not ready, so the decision has not started.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
