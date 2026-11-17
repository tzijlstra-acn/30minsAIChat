// Scene: integrated-delivery (Screen 11)
// Causal story: the client's AI pilot team appears first as one useful capability
// beside Data and AI. The other five disciplines then connect around one working
// process so the loop becomes operable, controlled and measurable. Reusable Accenture
// patterns sit underneath. Client process owners keep ownership.
SceneDirector.register('integrated-delivery', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var HUB = { x: 520, y: 182, r: 86 };
  var BOX_W = 286, BOX_H = 72;

  var DISCIPLINES = [
    { id: 'data',   label: 'Data and AI', text: 'Retrieval, comparison, extraction, evaluation, routing', c: 'ai', icon: 'ti-brain', x: 16, y: 146 },
    { id: 'process', label: 'NFR process and operating model', text: 'Journey redesign, decision rights, ownership, controls', c: 'data', icon: 'ti-sitemap', x: 50, y: 20 },
    { id: 'product', label: 'Product and role experience', text: 'Role workspace, work queue, co-design with users', c: 'ai', icon: 'ti-layout-dashboard', x: 704, y: 20 },
    { id: 'arch',   label: 'Architecture and integration', text: 'Process state, connectors, systems of record, operations', c: 'data', icon: 'ti-plug', x: 738, y: 146 },
    { id: 'gov',    label: 'Governance, security and resilience', text: 'Identity, authority, approvals, audit, recovery', c: 'human', icon: 'ti-shield-check', x: 50, y: 272 },
    { id: 'change', label: 'Change, adoption and value', text: 'Baselines, training, transition, benefit tracking', c: 'proof', icon: 'ti-target', x: 704, y: 272 }
  ];
  var PATTERNS = [
    'Journey value method', 'Role App pattern', 'Task router', 'Controlled-write contract',
    'Governance service', 'Data-readiness refinery', 'Reuse model', 'Economics framework'
  ];

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'integrated-delivery' });
    n = { boxes: [], links: [], patterns: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;
    var C = window.TPRM_CASE;

    // One working process at the centre
    var hub = S.el('div', 'id-hub ts-hide ts-pop', null, { left: HUB.x - HUB.r, top: HUB.y - HUB.r, width: HUB.r * 2, height: HUB.r * 2 });
    hub.appendChild(S.el('div', 'id-hub-title', 'One working process'));
    hub.appendChild(S.el('div', 'ts-note', C ? C.reviewType : ''));
    root.appendChild(hub);
    n.hub = hub;
    n.ring = S.path(g, 'M' + HUB.x + ' ' + (HUB.y - HUB.r - 10) + ' A' + (HUB.r + 10) + ' ' + (HUB.r + 10) + ' 0 1 1 ' + (HUB.x - 1) + ' ' + (HUB.y - HUB.r - 10), 'ts-s-human id-ring', cv.marker('human'));
    n.ringLabel = S.el('div', 'ts-label ts-ink ts-c-human id-ring-label ts-hide', 'Operable, controlled, measurable', { left: HUB.x - 150, top: HUB.y + HUB.r + 18, width: 300 });
    root.appendChild(n.ringLabel);

    DISCIPLINES.forEach(function(d) {
      var box = S.el('div', 'ts-obj ts-c-' + d.c + ' id-disc ts-hide ts-pop', null, { left: d.x, top: d.y, width: BOX_W, height: BOX_H });
      var head = S.el('div', 'id-disc-head');
      head.appendChild(S.icon(d.icon, 'ts-ink'));
      head.appendChild(S.el('span', 'id-disc-title', d.label));
      box.appendChild(head);
      box.appendChild(S.el('div', 'ts-text id-disc-text', d.text));
      root.appendChild(box);
      n.boxes.push(box);
      var bx = d.x < HUB.x ? d.x + BOX_W + 2 : d.x - 2;
      var by = d.y + BOX_H / 2;
      var hx = d.x < HUB.x ? HUB.x - HUB.r - 6 : HUB.x + HUB.r + 6;
      var hy = HUB.y + (by - HUB.y) * 0.35;
      n.links.push(S.path(g, 'M' + bx + ' ' + by + ' C' + ((bx + hx) / 2) + ' ' + by + ' ' + ((bx + hx) / 2) + ' ' + hy + ' ' + hx + ' ' + hy, 'ts-s-' + d.c + ' id-link'));
    });

    // The client's AI pilot team: a useful capability, shown with respect
    n.pilotTeam = S.el('div', 'ts-chip ts-c-ai id-pilot ts-hide ts-pop', null, { left: 26, top: 228 });
    n.pilotTeam.appendChild(S.icon('ti-users'));
    n.pilotTeam.appendChild(S.el('span', null, 'Your AI pilot team: useful capability'));
    root.appendChild(n.pilotTeam);

    // Reusable Accenture patterns underneath
    n.patLabel = S.el('div', 'ts-label ts-hide', 'Reusable Accenture patterns', { left: 16, top: 386 });
    root.appendChild(n.patLabel);
    n.ownLabel = S.el('div', 'ts-note id-own ts-hide', 'Client process owners keep ownership', { left: 640, top: 386, width: 384 });
    root.appendChild(n.ownLabel);
    PATTERNS.forEach(function(p, i) {
      var col = i % 4, rowi = Math.floor(i / 4);
      var chip = S.el('div', 'ts-chip ts-c-neutral id-pattern ts-hide ts-up', p, { left: 16 + col * 254, top: 414 + rowi * 40, width: 246 });
      root.appendChild(chip);
      n.patterns.push(chip);
    });
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.hub); } },
    { delay: 700,  run: function() { S.on(n.boxes[0]); S.on(n.pilotTeam); } },
    { delay: 1300, run: function() { S.on(n.links[0]); } },
    { delay: 1800, run: function() { S.on(n.boxes[1]); S.on(n.links[1]); } },
    { delay: 2250, run: function() { S.on(n.boxes[2]); S.on(n.links[2]); } },
    { delay: 2700, run: function() { S.on(n.boxes[3]); S.on(n.links[3]); } },
    { delay: 3150, run: function() { S.on(n.boxes[4]); S.on(n.links[4]); } },
    { delay: 3600, run: function() { S.on(n.boxes[5]); S.on(n.links[5]); } },
    { delay: 4200, run: function() { S.on(n.ring); S.on(n.ringLabel); n.hub.classList.add('is-running'); } },
    { delay: 5000, run: function() { S.on(n.patLabel); S.on(n.patterns); } },
    { delay: 5800, run: function() { S.on(n.ownLabel); } },
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
      return 'One working process sits at the centre. The client AI pilot team appears first as a useful capability within data and AI. '
        + 'Five more disciplines connect around it: ' + DISCIPLINES.slice(1).map(function(d) { return d.label.toLowerCase(); }).join(', ')
        + '. Together the loop becomes operable, controlled and measurable. Reusable Accenture patterns: ' + PATTERNS.join(', ').toLowerCase()
        + '. Client process owners keep ownership.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
