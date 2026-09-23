// Scene: pressure-convergence (Screen 01 -- WHY NOW)
// Three pressure streams converge on a shared vertical bus, then route to the manual bottleneck.
// V24: convergence bus replaces three independent diagonal arrows.
// Connectors are routed from measured label-group ports (getBBox) after DOM insertion.
SceneDirector.register('pressure-convergence', function(container, manifest, reduced) {
  var _timers = [];

  var C_PINK   = '#F0758A';
  var C_AMBER  = '#F3B34C';
  var C_PURPLE = '#B44CFF';
  var C_CYAN   = '#55C7E8';
  var C_DARK   = 'rgba(255,255,255,0.06)';
  var C_BORDER = 'rgba(255,255,255,0.18)';
  var C_BUS    = 'rgba(255,255,255,0.38)';
  var BUS_X    = 316;

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function makeMkr(defs, id, color) {
    var m = svgEl('marker', { id: id, markerWidth: '8', markerHeight: '6', refX: '7', refY: '3', orient: 'auto' });
    m.appendChild(svgEl('polygon', { points: '0 0, 8 3, 0 6', fill: color }));
    defs.appendChild(m);
  }

  function build() {
    container.innerHTML = '';
    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';

    var svg = svgEl('svg', {
      viewBox: '0 0 1120 440',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'width:100%;height:100%;display:block;'
    });

    var defs = svgEl('defs');
    makeMkr(defs, 'arr-pink',   C_PINK);
    makeMkr(defs, 'arr-amber',  C_AMBER);
    makeMkr(defs, 'arr-purple', C_PURPLE);
    makeMkr(defs, 'arr-bus',    C_BUS);
    makeMkr(defs, 'arr-cyan',   C_CYAN);
    svg.appendChild(defs);

    // ── Pressure stream label groups ─────────────────────────────────────
    // Each group: two text nodes (title + subtitle), measured after DOM insertion
    // for right-centre port routing.

    // Stream 1 (pink) -- obligation
    var grp1 = svgEl('g', { id: 'pc-grp1', opacity: '0' });
    var l1 = svgEl('text', { x: '30', y: '56', fill: C_PINK,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '15', 'font-weight': '700' });
    l1.textContent = 'Rising obligation volume';
    var s1 = svgEl('text', { x: '30', y: '74', fill: C_PINK,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '12' });
    s1.textContent = 'More obligations, faster cycles';
    grp1.appendChild(l1); grp1.appendChild(s1);
    svg.appendChild(grp1);

    // Stream 2 (amber) -- cost
    var grp2 = svgEl('g', { id: 'pc-grp2', opacity: '0' });
    var l2 = svgEl('text', { x: '30', y: '192', fill: C_AMBER,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '15', 'font-weight': '700' });
    l2.textContent = 'Tighter economics';
    var s2 = svgEl('text', { x: '30', y: '210', fill: C_AMBER,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '12' });
    s2.textContent = 'Cost per decision under pressure';
    grp2.appendChild(l2); grp2.appendChild(s2);
    svg.appendChild(grp2);

    // Stream 3 (purple) -- AI
    var grp3 = svgEl('g', { id: 'pc-grp3', opacity: '0' });
    var l3 = svgEl('text', { x: '30', y: '340', fill: C_PURPLE,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '15', 'font-weight': '700' });
    l3.textContent = 'More capable AI available';
    var s3 = svgEl('text', { x: '30', y: '358', fill: C_PURPLE,
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '12' });
    s3.textContent = 'Opportunity and new governance obligations';
    grp3.appendChild(l3); grp3.appendChild(s3);
    svg.appendChild(grp3);

    // ── Connector layer (filled after DOM insertion via routeConnectors) ──
    var connG = svgEl('g', { id: 'pc-conn' });
    svg.appendChild(connG);

    // ── Bottleneck box ────────────────────────────────────────────────────
    var bnG = svgEl('g', { id: 'pc-bottleneck', opacity: '0' });
    bnG.appendChild(svgEl('rect', {
      x: '500', y: '95', width: '140', height: '215', rx: '10',
      fill: 'rgba(243,179,76,0.14)', stroke: C_AMBER, 'stroke-width': '2'
    }));
    var bnTag = svgEl('text', { x: '570', y: '84', 'text-anchor': 'middle',
      fill: C_AMBER, 'font-family': "'JetBrains Mono',monospace",
      'font-size': '9', 'letter-spacing': '1.5', 'font-weight': '700' });
    bnTag.textContent = 'BOTTLENECK';
    bnG.appendChild(bnTag);
    var bt1 = svgEl('text', { x: '570', y: '128', 'text-anchor': 'middle',
      fill: C_AMBER, 'font-family': "'Space Grotesk',sans-serif",
      'font-size': '14', 'font-weight': '700' });
    bt1.textContent = 'Manual operating';
    bnG.appendChild(bt1);
    var bt2 = svgEl('text', { x: '570', y: '147', 'text-anchor': 'middle',
      fill: C_AMBER, 'font-family': "'Space Grotesk',sans-serif",
      'font-size': '14', 'font-weight': '700' });
    bt2.textContent = 'bottleneck';
    bnG.appendChild(bt2);
    svg.appendChild(bnG);

    // Queue tokens
    ['pc-tok1', 'pc-tok2', 'pc-tok3'].forEach(function(id, i) {
      svg.appendChild(svgEl('rect', {
        id: id, x: '516', y: String(168 + i * 24), width: '32', height: '18',
        rx: '4', fill: 'rgba(255,255,255,0.12)', stroke: C_BORDER,
        'stroke-width': '1', opacity: '0'
      }));
    });
    var qLbl = svgEl('text', {
      id: 'pc-queue-lbl', x: '556', y: '200',
      fill: 'var(--text-2,rgba(240,240,240,0.55))',
      'font-family': "'Space Grotesk',sans-serif", 'font-size': '11', opacity: '0'
    });
    qLbl.textContent = 'queue';
    svg.appendChild(qLbl);

    // Hand-off cost badge
    var bdG = svgEl('g', { id: 'pc-badge', opacity: '0' });
    bdG.appendChild(svgEl('rect', {
      x: '506', y: '268', width: '128', height: '22', rx: '4',
      fill: 'rgba(243,179,76,0.18)', stroke: C_AMBER, 'stroke-width': '1'
    }));
    var bdTxt = svgEl('text', {
      x: '570', y: '283', 'text-anchor': 'middle',
      fill: C_AMBER, 'font-family': "'JetBrains Mono',monospace",
      'font-size': '11', 'font-weight': '700', 'letter-spacing': '0.05em'
    });
    bdTxt.textContent = 'HAND-OFF COST';
    bdG.appendChild(bdTxt);
    svg.appendChild(bdG);

    // Output arrow + labels
    var outPath = svgEl('path', {
      id: 'pc-outpath',
      d: 'M 640 202 L 878 202',
      stroke: C_CYAN, 'stroke-width': '3', fill: 'none',
      'marker-end': 'url(#arr-cyan)', opacity: '0'
    });
    svg.appendChild(outPath);
    // Target-state destination box
    var futureBox = svgEl('g', { id: 'pc-futurebox', opacity: '0' });
    futureBox.appendChild(svgEl('rect', {
      x: '888', y: '160', width: '216', height: '86', rx: '10',
      fill: 'rgba(85,199,232,0.10)', stroke: C_CYAN, 'stroke-width': '2'
    }));
    var futTag = svgEl('text', {
      x: '996', y: '176',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: C_CYAN, 'font-family': "'JetBrains Mono',monospace",
      'font-size': '9', 'letter-spacing': '1.5'
    });
    futTag.textContent = 'TARGET STATE';
    futureBox.appendChild(futTag);
    svg.appendChild(futureBox);
    var oL1 = svgEl('text', {
      id: 'pc-outlbl1', x: '996', y: '204',
      'text-anchor': 'middle',
      fill: C_CYAN, 'font-family': "'Space Grotesk',sans-serif",
      'font-size': '17', 'font-weight': '700', opacity: '0'
    });
    oL1.textContent = 'Evidence-led';
    svg.appendChild(oL1);
    var oL2 = svgEl('text', {
      id: 'pc-outlbl2', x: '996', y: '226',
      'text-anchor': 'middle',
      fill: C_CYAN, 'font-family': "'Space Grotesk',sans-serif",
      'font-size': '17', 'font-weight': '700', opacity: '0'
    });
    oL2.textContent = 'operating model';
    svg.appendChild(oL2);

    root.appendChild(svg);
    container.appendChild(root);

    // Route connectors now that groups are in the DOM and fonts are ready
    routeConnectors(svg, connG);
  }

  // Measure each label group's bounding box and build the bus + connector paths.
  // Called after DOM insertion (fonts.ready guard is in scene-director).
  function routeConnectors(svg, connG) {
    var grpIds = ['pc-grp1', 'pc-grp2', 'pc-grp3'];
    var colors = [C_PINK, C_AMBER, C_PURPLE];
    var fallbacks = [
      { x: 258, y: 65 },
      { x: 228, y: 201 },
      { x: 272, y: 349 }
    ];

    var ports = grpIds.map(function(id, i) {
      var g = svg.querySelector('#' + id);
      if (!g) return fallbacks[i];
      try {
        var box = g.getBBox();
        if (box.width > 0) {
          return {
            x: Math.min(box.x + box.width + 8, BUS_X - 4),
            y: box.y + box.height / 2
          };
        }
      } catch(e) {}
      return fallbacks[i];
    });

    var topY    = ports[0].y;
    var botY    = ports[2].y;
    var busMidY = Math.round((topY + botY) / 2);

    // Horizontal dash connectors: port → bus
    grpIds.forEach(function(_, i) {
      var p = ports[i];
      var line = svgEl('line', {
        id: 'pc-hconn' + i,
        x1: String(Math.round(p.x)), y1: String(Math.round(p.y)),
        x2: String(BUS_X),           y2: String(Math.round(p.y)),
        stroke: colors[i], 'stroke-width': '2',
        'stroke-dasharray': '5 3', opacity: '0'
      });
      connG.appendChild(line);
    });

    // Vertical bus
    connG.appendChild(svgEl('line', {
      id: 'pc-bus-line',
      x1: String(BUS_X), y1: String(Math.round(topY)),
      x2: String(BUS_X), y2: String(Math.round(botY)),
      stroke: C_BUS, 'stroke-width': '2', opacity: '0'
    }));

    // Junction dots at each port on the bus
    grpIds.forEach(function(_, i) {
      connG.appendChild(svgEl('circle', {
        id: 'pc-dot' + i,
        cx: String(BUS_X), cy: String(Math.round(ports[i].y)), r: '3.5',
        fill: colors[i], opacity: '0'
      }));
    });

    // Bus centre → bottleneck left
    connG.appendChild(svgEl('line', {
      id: 'pc-bus-out',
      x1: String(BUS_X), y1: String(busMidY),
      x2: '498',          y2: String(busMidY),
      stroke: C_BUS, 'stroke-width': '2.5',
      'marker-end': 'url(#arr-bus)', opacity: '0'
    }));
  }

  // Fade in by element id
  function show(id, dur) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    el.style.transition = 'opacity ' + (dur || 350) + 'ms ease';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { el.setAttribute('opacity', '1'); });
    });
  }

  // Draw a path with stroke-dashoffset animation
  function drawPath(id, dur) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    var len = 400;
    try { var l = el.getTotalLength(); if (l > 0) len = l; } catch(e) {}
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.setAttribute('opacity', '1');
    el.style.transition = 'stroke-dashoffset ' + (dur || 600) + 'ms ease';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { el.style.strokeDashoffset = '0'; });
    });
  }

  function scaleIn(id) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    el.style.transformOrigin = '570px 202px';
    el.style.transform = 'scale(0)';
    el.setAttribute('opacity', '1');
    el.style.transition = 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { el.style.transform = 'scale(1)'; });
    });
  }

  // Reveal bus group: horizontal connectors + bus line + dots + output
  function showBus() {
    ['pc-hconn0', 'pc-hconn1', 'pc-hconn2'].forEach(function(id) { show(id, 280); });
    show('pc-bus-line', 380);
    show('pc-dot0', 180); show('pc-dot1', 180); show('pc-dot2', 180);
    _timers.push(setTimeout(function() { show('pc-bus-out', 450); }, 320));
  }

  function showAll() {
    ['pc-grp1', 'pc-grp2', 'pc-grp3'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) el.setAttribute('opacity', '1');
    });
    ['pc-hconn0', 'pc-hconn1', 'pc-hconn2', 'pc-bus-line',
     'pc-dot0', 'pc-dot1', 'pc-dot2', 'pc-bus-out'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) el.setAttribute('opacity', '1');
    });
    var bn = container.querySelector('#pc-bottleneck');
    if (bn) { bn.setAttribute('opacity', '1'); bn.style.transform = 'scale(1)'; }
    ['pc-tok1', 'pc-tok2', 'pc-tok3', 'pc-queue-lbl'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) el.setAttribute('opacity', '1');
    });
    var badge = container.querySelector('#pc-badge');
    if (badge) badge.setAttribute('opacity', '1');
    ['pc-outpath', 'pc-futurebox', 'pc-outlbl1', 'pc-outlbl2'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) { el.setAttribute('opacity', '1'); el.style.strokeDashoffset = '0'; }
    });
  }

  var steps = [
    { delay: 200,  run: function() { show('pc-grp1', 350); } },
    { delay: 600,  run: function() { show('pc-grp2', 350); } },
    { delay: 1000, run: function() { show('pc-grp3', 350); } },
    { delay: 1500, run: showBus },
    { delay: 2600, run: function() { scaleIn('pc-bottleneck'); } },
    { delay: 3200, run: function() { show('pc-tok1', 250); } },
    { delay: 3450, run: function() { show('pc-tok2', 250); } },
    { delay: 3700, run: function() { show('pc-tok3', 250); show('pc-queue-lbl', 300); } },
    { delay: 3800, run: function() { show('pc-badge', 350); } },
    { delay: 4600, run: function() {
      drawPath('pc-outpath', 600);
      show('pc-futurebox', 400);
      show('pc-outlbl1', 400);
      show('pc-outlbl2', 400);
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 700));
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      tl.play();
    },
    pause:  tl.pause,
    resume: tl.resume,
    reset: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      tl.reset();
    },
    finish: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showAll();
    },
    getAccessibleSummary: function() {
      return 'Three pressure streams -- rising obligation volume, tighter economics, and more capable AI -- converge on a manual bottleneck. Cases queue. The bottleneck gives way to an evidence-led operating model.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
