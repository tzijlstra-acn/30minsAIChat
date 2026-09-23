// Scene: pressure-convergence (Screen 01 -- WHY NOW)
// Three obligation/pressure streams converge on a manual bottleneck,
// then an arrow shows the path to an evidence-led operating model.
SceneDirector.register('pressure-convergence', function(container, manifest, reduced) {
  var _timers = [];

  // ── colours ──
  var C_PINK   = '#F0758A';
  var C_AMBER  = '#F3B34C';
  var C_PURPLE = '#B44CFF';
  var C_CYAN   = '#55C7E8';
  var C_DARK   = 'rgba(255,255,255,0.06)';
  var C_BORDER = 'rgba(255,255,255,0.18)';

  function build() {
    container.innerHTML = '';

    // Root wrapper
    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';

    // SVG
    var svg = svgEl('svg', {
      viewBox: '0 0 1120 440',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'width:100%;height:100%;display:block;'
    });

    // ── defs: arrowhead markers ──
    var defs = svgEl('defs');

    function makeMarker(id, color) {
      var marker = svgEl('marker', {
        id: id,
        markerWidth: '8',
        markerHeight: '6',
        refX: '7',
        refY: '3',
        orient: 'auto'
      });
      var poly = svgEl('polygon', {
        points: '0 0, 8 3, 0 6',
        fill: color
      });
      marker.appendChild(poly);
      return marker;
    }

    defs.appendChild(makeMarker('arrow-pink',   C_PINK));
    defs.appendChild(makeMarker('arrow-amber',  C_AMBER));
    defs.appendChild(makeMarker('arrow-purple', C_PURPLE));
    defs.appendChild(makeMarker('arrow-cyan',   C_CYAN));
    svg.appendChild(defs);

    // ── Stream labels (left side) ──
    // Stream 1 -- obligation (y=80)
    var lbl1 = svgEl('text', {
      x: '30', y: '68',
      fill: C_PINK,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '15',
      'font-weight': '700',
      opacity: '0'
    });
    lbl1.textContent = 'Rising obligation volume';
    lbl1.id = 'pc-lbl1';
    svg.appendChild(lbl1);

    var sub1 = svgEl('text', {
      x: '30', y: '84',
      fill: C_PINK,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '12',
      'font-weight': '400',
      opacity: '0'
    });
    sub1.textContent = 'More obligations, faster cycles';
    sub1.id = 'pc-sub1';
    svg.appendChild(sub1);

    // Stream 2 -- cost (y=220)
    var lbl2 = svgEl('text', {
      x: '30', y: '208',
      fill: C_AMBER,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '15',
      'font-weight': '700',
      opacity: '0'
    });
    lbl2.textContent = 'Tighter economics';
    lbl2.id = 'pc-lbl2';
    svg.appendChild(lbl2);

    var sub2 = svgEl('text', {
      x: '30', y: '224',
      fill: C_AMBER,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '12',
      'font-weight': '400',
      opacity: '0'
    });
    sub2.textContent = 'Cost per decision under pressure';
    sub2.id = 'pc-sub2';
    svg.appendChild(sub2);

    // Stream 3 -- AI (y=360)
    var lbl3 = svgEl('text', {
      x: '30', y: '348',
      fill: C_PURPLE,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '15',
      'font-weight': '700',
      opacity: '0'
    });
    lbl3.textContent = 'More capable AI available';
    lbl3.id = 'pc-lbl3';
    svg.appendChild(lbl3);

    var sub3 = svgEl('text', {
      x: '30', y: '364',
      fill: C_PURPLE,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '12',
      'font-weight': '400',
      opacity: '0'
    });
    sub3.textContent = 'Opportunity and new governance obligations';
    sub3.id = 'pc-sub3';
    svg.appendChild(sub3);

    // ── Flow arrows (stream paths) ──
    // Stream 1: y=100 straight line to bottleneck left edge x=500
    var path1 = svgEl('path', {
      d: 'M 180 100 L 500 100',
      stroke: C_PINK,
      'stroke-width': '2.5',
      'stroke-dasharray': '6 4',
      fill: 'none',
      'marker-end': 'url(#arrow-pink)',
      opacity: '0'
    });
    path1.id = 'pc-path1';
    svg.appendChild(path1);

    // Stream 2: y=220 curve toward bottleneck centre
    var path2 = svgEl('path', {
      d: 'M 180 220 C 340 220 440 220 500 220',
      stroke: C_AMBER,
      'stroke-width': '2.5',
      fill: 'none',
      'marker-end': 'url(#arrow-amber)',
      opacity: '0'
    });
    path2.id = 'pc-path2';
    svg.appendChild(path2);

    // Stream 3: y=360 curve upward toward bottleneck
    var path3 = svgEl('path', {
      d: 'M 180 360 C 340 360 440 260 500 240',
      stroke: C_PURPLE,
      'stroke-width': '2.5',
      fill: 'none',
      'marker-end': 'url(#arrow-purple)',
      opacity: '0'
    });
    path3.id = 'pc-path3';
    svg.appendChild(path3);

    // ── Bottleneck box (x=500, y=160, 120x120) ──
    var bottleneckG = svgEl('g', { opacity: '0', id: 'pc-bottleneck' });

    var bnRect = svgEl('rect', {
      x: '500', y: '160',
      width: '140', height: '130',
      rx: '10',
      fill: C_DARK,
      stroke: C_BORDER,
      'stroke-width': '1.5'
    });
    bottleneckG.appendChild(bnRect);

    var bnTitle1 = svgEl('text', {
      x: '570', y: '184',
      'text-anchor': 'middle',
      fill: 'var(--text-1,#F0F0F0)',
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '13',
      'font-weight': '700'
    });
    bnTitle1.textContent = 'Manual operating';
    bottleneckG.appendChild(bnTitle1);

    var bnTitle2 = svgEl('text', {
      x: '570', y: '200',
      'text-anchor': 'middle',
      fill: 'var(--text-1,#F0F0F0)',
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '13',
      'font-weight': '700'
    });
    bnTitle2.textContent = 'bottleneck';
    bottleneckG.appendChild(bnTitle2);

    svg.appendChild(bottleneckG);

    // ── Queue tokens (inside bottleneck) ──
    var token1 = svgEl('rect', { x: '516', y: '214', width: '32', height: '18', rx: '4', fill: 'rgba(255,255,255,0.12)', stroke: C_BORDER, 'stroke-width': '1', opacity: '0', id: 'pc-tok1' });
    var token2 = svgEl('rect', { x: '516', y: '236', width: '32', height: '18', rx: '4', fill: 'rgba(255,255,255,0.12)', stroke: C_BORDER, 'stroke-width': '1', opacity: '0', id: 'pc-tok2' });
    var token3 = svgEl('rect', { x: '516', y: '258', width: '32', height: '18', rx: '4', fill: 'rgba(255,255,255,0.12)', stroke: C_BORDER, 'stroke-width': '1', opacity: '0', id: 'pc-tok3' });
    svg.appendChild(token1);
    svg.appendChild(token2);
    svg.appendChild(token3);

    // Queue label
    var queueLbl = svgEl('text', {
      x: '556', y: '226',
      fill: 'var(--text-2,rgba(240,240,240,0.55))',
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '11',
      opacity: '0',
      id: 'pc-queue-lbl'
    });
    queueLbl.textContent = 'queue';
    svg.appendChild(queueLbl);

    // ── Hand-off cost badge ──
    var badgeG = svgEl('g', { opacity: '0', id: 'pc-badge' });
    var badgeRect = svgEl('rect', {
      x: '506', y: '286',
      width: '128', height: '22',
      rx: '4',
      fill: 'rgba(243,179,76,0.18)',
      stroke: C_AMBER,
      'stroke-width': '1'
    });
    badgeG.appendChild(badgeRect);
    var badgeTxt = svgEl('text', {
      x: '570', y: '301',
      'text-anchor': 'middle',
      fill: C_AMBER,
      'font-family': "'JetBrains Mono',monospace",
      'font-size': '11',
      'font-weight': '700',
      'letter-spacing': '0.05em'
    });
    badgeTxt.textContent = 'HAND-OFF COST';
    badgeG.appendChild(badgeTxt);
    svg.appendChild(badgeG);

    // ── Output arrow (bottleneck -> evidence-led) ──
    var outPath = svgEl('path', {
      d: 'M 640 225 L 890 225',
      stroke: C_CYAN,
      'stroke-width': '3',
      fill: 'none',
      'marker-end': 'url(#arrow-cyan)',
      opacity: '0',
      id: 'pc-outpath'
    });
    svg.appendChild(outPath);

    // Output label
    var outLbl1 = svgEl('text', {
      x: '900', y: '210',
      fill: C_CYAN,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '15',
      'font-weight': '700',
      opacity: '0',
      id: 'pc-outlbl1'
    });
    outLbl1.textContent = 'Evidence-led';
    svg.appendChild(outLbl1);

    var outLbl2 = svgEl('text', {
      x: '900', y: '228',
      fill: C_CYAN,
      'font-family': "'Space Grotesk',sans-serif",
      'font-size': '15',
      'font-weight': '700',
      opacity: '0',
      id: 'pc-outlbl2'
    });
    outLbl2.textContent = 'operating model';
    svg.appendChild(outLbl2);

    root.appendChild(svg);
    container.appendChild(root);
  }

  // Utility: set opacity via transition
  function show(id, dur) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    el.style.transition = 'opacity ' + (dur || 350) + 'ms ease';
    // double-raf to ensure transition fires
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.setAttribute('opacity', '1');
      });
    });
  }

  // Animate a path by stroke-dashoffset
  function drawPath(id, dur) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    var len = 400; // generous fallback; getTotalLength not always available on hidden SVG
    try { var l = el.getTotalLength(); if (l > 0) len = l; } catch(e) {}
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.setAttribute('opacity', '1');
    el.style.transition = 'stroke-dashoffset ' + (dur || 600) + 'ms ease';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.style.strokeDashoffset = '0';
      });
    });
  }

  // Scale-in the bottleneck box
  function scaleIn(id) {
    var el = container.querySelector('#' + id);
    if (!el) return;
    el.style.transformOrigin = '570px 225px';
    el.style.transform = 'scale(0)';
    el.setAttribute('opacity', '1');
    el.style.transition = 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.style.transform = 'scale(1)';
      });
    });
  }

  // ── showAll: reveal final state without animation ──
  function showAll() {
    ['pc-lbl1','pc-sub1','pc-lbl2','pc-sub2','pc-lbl3','pc-sub3'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) el.setAttribute('opacity', '1');
    });
    ['pc-path1','pc-path2','pc-path3'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (!el) return;
      el.setAttribute('opacity', '1');
      el.style.strokeDashoffset = '0';
    });
    var bn = container.querySelector('#pc-bottleneck');
    if (bn) { bn.setAttribute('opacity','1'); bn.style.transform = 'scale(1)'; }
    ['pc-tok1','pc-tok2','pc-tok3','pc-queue-lbl'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) el.setAttribute('opacity', '1');
    });
    var badge = container.querySelector('#pc-badge');
    if (badge) badge.setAttribute('opacity','1');
    ['pc-outpath','pc-outlbl1','pc-outlbl2'].forEach(function(id) {
      var el = container.querySelector('#' + id);
      if (el) { el.setAttribute('opacity','1'); el.style.strokeDashoffset = '0'; }
    });
  }

  var steps = [
    // 1. Obligation label
    { delay: 200,  run: function() { show('pc-lbl1'); show('pc-sub1'); } },
    // 2. Cost label
    { delay: 600,  run: function() { show('pc-lbl2'); show('pc-sub2'); } },
    // 3. AI label
    { delay: 1000, run: function() { show('pc-lbl3'); show('pc-sub3'); } },
    // 4. Stream 1 arrow draws
    { delay: 1400, run: function() { drawPath('pc-path1', 550); } },
    // 5. Stream 2 arrow draws
    { delay: 1800, run: function() { drawPath('pc-path2', 550); } },
    // 6. Stream 3 arrow draws
    { delay: 2200, run: function() { drawPath('pc-path3', 650); } },
    // 7. Bottleneck box scales in
    { delay: 2800, run: function() { scaleIn('pc-bottleneck'); } },
    // 8. Queue tokens stack up
    { delay: 3400, run: function() { show('pc-tok1', 250); } },
    { delay: 3650, run: function() { show('pc-tok2', 250); } },
    { delay: 3900, run: function() { show('pc-tok3', 250); show('pc-queue-lbl', 300); } },
    // 9. Hand-off cost badge
    { delay: 4000, run: function() { show('pc-badge', 350); } },
    // 10. Cyan output arrow + labels
    { delay: 4800, run: function() { drawPath('pc-outpath', 600); show('pc-outlbl1', 400); show('pc-outlbl2', 400); } }
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      build();
      tl.play();
    },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() {
      build();
      tl.reset();
    },
    finish: function() {
      build();
      if (reduced) {
        showAll();
      } else {
        tl.finish();
      }
    },
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
