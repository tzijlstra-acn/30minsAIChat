// Scene: remaining-burden (v2 screen 03)
// Causal story: eight connecting tasks accumulate, one by one, around one NFR
// professional: find the case, retrieve evidence, reconcile, apply policy, chase,
// prepare, route, record. The result is delay, rework and inconsistency. The tone
// is respectful: the gap is not the team, it is that the person is the integration layer.
SceneDirector.register('remaining-burden', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var W = 1040, H = 520;
  var P = { x: 360, y: 250, r: 46 };
  var RX = 246, RY = 196;
  var CHIP = { w: 214, h: 42 };
  var COL = { x: 724, w: 300 };

  var cv = null;
  var n = {};
  var done = false;

  function pos(i, count) {
    var a = -Math.PI / 2 + i * (2 * Math.PI / count);
    return { x: P.x + RX * Math.cos(a), y: P.y + RY * Math.sin(a) };
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'remaining-burden' });
    n = { tasks: [], links: [], cons: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    var person = S.el('div', 'rb-person ts-hide ts-pop', null, { left: P.x - P.r, top: P.y - P.r, width: P.r * 2, height: P.r * 2 });
    person.appendChild(S.icon('ti-user'));
    person.appendChild(S.el('span', 'rb-person-label', 'NFR professional'));
    root.appendChild(person);
    n.person = person;

    D.burden.forEach(function(t, i) {
      var c = pos(i, D.burden.length);
      var dx = c.x - P.x, dy = c.y - P.y, len = Math.sqrt(dx * dx + dy * dy);
      var sx = P.x + dx / len * (P.r + 6), sy = P.y + dy / len * (P.r + 6);
      var ex = c.x - dx / len * 30, ey = c.y - dy / len * 22;
      n.links.push(S.path(g, 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' L' + ex.toFixed(1) + ' ' + ey.toFixed(1), 'ts-s-human rb-link'));
      var chip = S.el('div', 'rb-task ts-hide ts-pop', null, { left: Math.round(c.x - CHIP.w / 2), top: Math.round(c.y - CHIP.h / 2), width: CHIP.w, height: CHIP.h });
      chip.appendChild(S.el('span', 'rb-num', String(i + 1)));
      chip.appendChild(S.el('span', 'rb-task-text', t));
      root.appendChild(chip);
      n.tasks.push(chip);
    });

    n.colLabel = S.el('div', 'ts-label ts-hide', 'What it costs', { left: COL.x, top: 40, width: COL.w });
    root.appendChild(n.colLabel);
    D.consequences.forEach(function(c, i) {
      var box = S.el('div', 'rb-cons ts-hide ts-right', null, { left: COL.x, top: 72 + i * 100, width: COL.w, height: 84 });
      box.appendChild(S.el('div', 'rb-cons-label', c.label));
      box.appendChild(S.el('div', 'ts-text', c.text));
      root.appendChild(box);
      n.cons.push(box);
    });
    n.note = S.el('div', 'rb-note ts-hide', 'Not a people problem. The process has no connecting layer, so the person becomes it.', { left: COL.x, top: 384, width: COL.w });
    root.appendChild(n.note);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [{ delay: 200, run: function() { S.on(n.person); } }];
  D.burden.forEach(function(t, i) {
    steps.push({ delay: 600 + i * 380, run: function() { S.on(n.links[i]); S.on(n.tasks[i]); n.person.classList.toggle('is-loaded', i >= 4); } });
  });
  steps.push({ delay: 4000, run: function() { n.person.classList.add('is-heavy'); S.on(n.colLabel); S.on(n.cons[0]); } });
  steps.push({ delay: 4400, run: function() { S.on(n.cons[1]); } });
  steps.push({ delay: 4800, run: function() { S.on(n.cons[2]); } });
  steps.push({ delay: 5500, run: function() { S.on(n.note); } });
  steps.push({ delay: 6100, run: complete });
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
      return 'Eight connecting tasks gather around one NFR professional: ' + D.burden.join(', ').toLowerCase() + '. '
        + 'The cost: ' + D.consequences.map(function(c) { return c.label.toLowerCase() + ', ' + c.text.toLowerCase(); }).join(' ')
        + ' Not a people problem: the process has no connecting layer, so the person becomes it.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
