// Scene: cover-flow (Screen 00 -- Introduction)
// Cinematic clause-to-evidence cold open. ~10.5 seconds.
// ViewBox: 0 0 1200 560. No external deps. No em-dash.
SceneDirector.register('cover-flow', function(container, manifest, reduced) {

  var _timers = [];
  var _alive  = false;
  var _hdr    = null;

  // ── Local SVG element helper ──────────────────────────────────────────────
  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    }
    return el;
  }

  // ── Colours ───────────────────────────────────────────────────────────────
  var C = {
    accent : '#B44CFF',
    cyan   : '#55C7E8',
    amber  : '#F3B34C',
    green  : '#58C994',
    red    : 'rgba(239,68,68,0.7)',
    surf   : '#191C25',
    border : '#343949',
    text1  : '#E8E9F0',
    text2  : '#A4A9B7',
    text3  : '#71758A'
  };

  // ── Graph data ────────────────────────────────────────────────────────────
  var NODES = [
    { id: 'obligation', cx: 780, cy: 250, r: 18, fill: C.accent, label: 'OBL-27', ldy: 24 },
    { id: 'policy',     cx: 860, cy: 200, r: 12, fill: C.text2,  label: 'policy',  ldy: 18 },
    { id: 'control',    cx: 940, cy: 250, r: 12, fill: C.green,  label: 'control', ldy: 18 },
    { id: 'process',    cx: 900, cy: 330, r: 12, fill: C.cyan,   label: 'process', ldy: 18 },
    { id: 'system',     cx: 820, cy: 390, r: 10, fill: C.text2,  label: 'system',  ldy: 16 },
    { id: 'owner',      cx: 740, cy: 340, r: 10, fill: C.amber,  label: 'owner',   ldy: 16 }
  ];

  var EDGES = [
    { from: 'obligation', to: 'policy',  stroke: C.accent, opacity: '0.6', id: 'e-obl-pol' },
    { from: 'policy',     to: 'control', stroke: C.text3,  opacity: '0.5', id: 'e-pol-ctl' },
    { from: 'control',    to: 'process', stroke: C.green,  opacity: '0.6', id: 'e-ctl-prc' },
    { from: 'process',    to: 'system',  stroke: C.text3,  opacity: '0.4', id: 'e-prc-sys' },
    { from: 'obligation', to: 'owner',   stroke: C.amber,  opacity: '0.5', id: 'e-obl-own' }
  ];

  var PILLS = [
    { label: 'WHO',       x: 340, y: 200, stroke: C.cyan   },
    { label: 'WHAT',      x: 340, y: 260, stroke: C.accent },
    { label: 'WHEN',      x: 340, y: 320, stroke: C.text3  },
    { label: 'CONDITION', x: 340, y: 380, stroke: C.amber  },
    { label: 'DOMAIN',    x: 340, y: 440, stroke: C.text3  }
  ];

  function getNode(id) {
    for (var i = 0; i < NODES.length; i++) { if (NODES[i].id === id) return NODES[i]; }
    return null;
  }

  // ── Element refs (populated in build()) ──────────────────────────────────
  var _svg, _rootG;
  var _pageG, _clauseRect;
  var _fragG, _pills, _bracketG;
  var _graphG, _nodes, _edges, _gapEdge, _gapBadge, _gapText, _connArrow;
  var _gateG, _diamond;
  var _evidenceG;

  // ── Header reveal ─────────────────────────────────────────────────────────
  function revealHeader(show) {
    if (!_hdr) {
      var screen = container.closest('.scene-screen');
      _hdr = screen ? screen.querySelector('.screen-hdr') : null;
    }
    if (_hdr) {
      _hdr.style.transition = 'opacity 600ms ease';
      _hdr.style.opacity = show ? '1' : '0';
    }
  }

  // ── BUILD ─────────────────────────────────────────────────────────────────
  function build() {
    container.innerHTML = '';
    _timers.forEach(clearTimeout);
    _timers = [];
    _pills  = [];
    _nodes  = [];
    _edges  = [];
    _gapEdge = null;

    revealHeader(false);

    _svg = svgEl('svg', {
      viewBox: '0 0 1200 560',
      preserveAspectRatio: 'xMidYMid meet'
    });
    _svg.style.cssText = 'width:100%;height:100%;display:block;';

    _rootG = svgEl('g', {});
    _svg.appendChild(_rootG);

    _buildRegPage();
    _buildFragments();
    _buildGraph();
    _buildGate();
    _buildEvidence();

    container.appendChild(_svg);
  }

  function _buildRegPage() {
    _pageG = svgEl('g', {});
    _pageG.style.cssText = 'opacity:0;transform-origin:180px 300px;transform:scale(0.96);transition:opacity 600ms ease,transform 600ms ease;';

    _pageG.appendChild(svgEl('rect', {
      x: 80, y: 180, width: 200, height: 240,
      rx: 4, fill: C.surf, stroke: C.border, 'stroke-width': '1'
    }));

    for (var i = 0; i < 8; i++) {
      _pageG.appendChild(svgEl('rect', {
        x: 92, y: 205 + i * 22,
        width: i % 3 === 2 ? 140 : 170, height: 6,
        rx: 2, fill: C.text3, opacity: '0.25'
      }));
    }

    _clauseRect = svgEl('rect', {
      x: 80, y: 360, width: 200, height: 28,
      fill: 'rgba(85,199,232,0.12)',
      stroke: 'rgba(85,199,232,0.4)',
      'stroke-width': '1'
    });
    _pageG.appendChild(_clauseRect);
    _rootG.appendChild(_pageG);
  }

  function _buildFragments() {
    _fragG = svgEl('g', {});
    _fragG.style.cssText = 'opacity:0;';

    var PW = 120, PH = 28;

    PILLS.forEach(function(p, i) {
      var g = svgEl('g', {});
      g.style.cssText = 'opacity:0;transform:translateY(20px);transition:opacity 400ms ease,transform 400ms ease;';

      g.appendChild(svgEl('rect', {
        x: p.x, y: p.y - PH / 2,
        width: PW, height: PH, rx: 4,
        fill: 'rgba(18,21,30,0.85)',
        stroke: p.stroke, 'stroke-width': '1'
      }));

      var t = svgEl('text', {
        x: p.x + PW / 2, y: p.y,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: C.text1, 'font-size': '10',
        'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5'
      });
      t.textContent = p.label;
      g.appendChild(t);

      _fragG.appendChild(g);
      _pills.push(g);
    });

    // Bracket { and group label
    _bracketG = svgEl('g', {});
    _bracketG.style.cssText = 'opacity:0;transition:opacity 400ms ease;';

    var bx   = 340 + 120 + 10;
    var by1  = 200;
    var by2  = 440;
    var bmid = (by1 + by2) / 2;
    var bw   = 10;

    _bracketG.appendChild(svgEl('path', {
      d: 'M' + (bx + bw) + ',' + by1 +
         ' Q' + bx + ',' + by1 + ' ' + bx + ',' + (by1 + 14) +
         ' L' + bx + ',' + (bmid - 14) +
         ' Q' + bx + ',' + bmid + ' ' + (bx - bw) + ',' + bmid +
         ' Q' + bx + ',' + bmid + ' ' + bx + ',' + (bmid + 14) +
         ' L' + bx + ',' + (by2 - 14) +
         ' Q' + bx + ',' + by2 + ' ' + (bx + bw) + ',' + by2,
      fill: 'none', stroke: C.text3, 'stroke-width': '1.2'
    }));

    var glt = svgEl('text', {
      x: bx, y: by1 - 16,
      'text-anchor': 'middle',
      fill: C.text3, 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1'
    });
    glt.textContent = 'OBLIGATION OBJECT';
    _bracketG.appendChild(glt);

    // Arrow to graph
    var arrowX1 = bx - bw;
    var arrowX2 = 520;
    var arrowY  = bmid;
    _bracketG.appendChild(svgEl('line', {
      x1: arrowX1, y1: arrowY, x2: arrowX2 - 8, y2: arrowY,
      stroke: C.text3, 'stroke-width': '1', 'stroke-dasharray': '3 3'
    }));
    _bracketG.appendChild(svgEl('polygon', {
      points: (arrowX2 - 8) + ',' + (arrowY - 4) + ' ' +
              arrowX2       + ',' +  arrowY       + ' ' +
              (arrowX2 - 8) + ',' + (arrowY + 4),
      fill: C.text3
    }));

    _fragG.appendChild(_bracketG);
    _rootG.appendChild(_fragG);
  }

  function _buildGraph() {
    _graphG = svgEl('g', {});

    // Edges (behind nodes)
    var edgeLayer = svgEl('g', {});
    EDGES.forEach(function(ed) {
      var n1 = getNode(ed.from);
      var n2 = getNode(ed.to);
      if (!n1 || !n2) return;
      var dx  = n2.cx - n1.cx;
      var dy  = n2.cy - n1.cy;
      var len = Math.round(Math.sqrt(dx * dx + dy * dy));
      var path = svgEl('path', {
        d: 'M' + n1.cx + ',' + n1.cy + ' L' + n2.cx + ',' + n2.cy,
        fill: 'none',
        stroke: ed.stroke,
        'stroke-width': '1.5',
        opacity: ed.opacity,
        'stroke-dasharray': len,
        'stroke-dashoffset': len,
        id: ed.id
      });
      path.style.cssText = 'transition:stroke-dashoffset 400ms ease;';
      edgeLayer.appendChild(path);
      _edges.push({ el: path, len: len, data: ed });
    });
    _graphG.appendChild(edgeLayer);

    // Gap edge ref
    _edges.forEach(function(e) { if (e.data.id === 'e-ctl-prc') _gapEdge = e.el; });

    // Nodes
    var nodeLayer = svgEl('g', {});
    NODES.forEach(function(n) {
      var g = svgEl('g', {});
      g.style.cssText = 'opacity:0;transition:opacity 300ms ease;';
      g.appendChild(svgEl('circle', {
        cx: n.cx, cy: n.cy, r: n.r,
        fill: n.fill, opacity: '0.88'
      }));
      var lbl = svgEl('text', {
        x: n.cx, y: n.cy + n.r + n.ldy,
        'text-anchor': 'middle',
        fill: C.text2, 'font-size': '9',
        'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.5'
      });
      lbl.textContent = n.label;
      g.appendChild(lbl);
      nodeLayer.appendChild(g);
      _nodes.push({ el: g, data: n });
    });
    _graphG.appendChild(nodeLayer);

    // Connection arrow from obligation-object group to obligation node
    _connArrow = svgEl('g', { id: 'conn-arrow' });
    _connArrow.style.cssText = 'opacity:0;transition:opacity 400ms ease;';
    _connArrow.appendChild(svgEl('line', {
      x1: 480, y1: 320, x2: 780 - 20, y2: 252,
      stroke: C.text3, 'stroke-width': '1',
      'stroke-dasharray': '3 3', opacity: '0.5'
    }));
    _graphG.appendChild(_connArrow);

    // Gap badge
    var gmx = (940 + 900) / 2;
    var gmy = (250 + 330) / 2;
    _gapBadge = svgEl('g', {});
    _gapBadge.style.cssText = 'opacity:0;transition:opacity 300ms ease;';
    _gapBadge.appendChild(svgEl('rect', {
      x: gmx - 14, y: gmy - 9, width: 28, height: 16,
      rx: 3, fill: 'rgba(239,68,68,0.85)'
    }));
    var gbt = svgEl('text', {
      x: gmx, y: gmy,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#fff', 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace'
    });
    gbt.textContent = 'GAP';
    _gapBadge.appendChild(gbt);
    _graphG.appendChild(_gapBadge);

    // Gap recommendation text
    _gapText = svgEl('text', {
      x: 860, y: 490,
      'text-anchor': 'middle',
      fill: 'rgba(239,68,68,0.7)',
      'font-size': '11',
      'font-family': 'Space Grotesk,sans-serif'
    });
    _gapText.textContent = 'Obligation not linked to process evidence';
    _gapText.style.cssText = 'opacity:0;transition:opacity 400ms ease;';
    _graphG.appendChild(_gapText);

    _rootG.appendChild(_graphG);
  }

  function _buildGate() {
    _gateG = svgEl('g', {});
    _gateG.style.cssText = 'opacity:0;transition:opacity 400ms ease;';

    var cx = 840, cy = 290;
    _diamond = svgEl('polygon', {
      points: cx + ',' + (cy - 22) + ' ' +
              (cx + 16) + ',' + cy + ' ' +
              cx + ',' + (cy + 22) + ' ' +
              (cx - 16) + ',' + cy,
      fill: 'none', stroke: C.amber, 'stroke-width': '2.5'
    });
    _gateG.appendChild(_diamond);

    var lbl = svgEl('text', {
      x: cx, y: cy + 36,
      'text-anchor': 'middle',
      fill: C.amber, 'font-size': '10',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1'
    });
    lbl.textContent = 'RISK OWNER';
    _gateG.appendChild(lbl);

    _rootG.appendChild(_gateG);
  }

  function _buildEvidence() {
    _evidenceG = svgEl('g', {});
    _evidenceG.style.cssText = 'opacity:0;transform-origin:950px 386px;transform:scale(0);transition:opacity 300ms ease,transform 300ms ease;';

    var ex = 860, ey = 360, ew = 180, eh = 52;

    // Provenance line back to clause
    _evidenceG.appendChild(svgEl('path', {
      d: 'M' + ex + ',' + ey +
         ' C' + (ex - 200) + ',' + (ey - 80) +
         ' 200,310' +
         ' 180,374',
      fill: 'none', stroke: C.green, 'stroke-width': '1',
      'stroke-dasharray': '4 4', opacity: '0.4'
    }));

    _evidenceG.appendChild(svgEl('rect', {
      x: ex, y: ey, width: ew, height: eh,
      rx: 6, fill: 'rgba(0,0,0,0.4)',
      stroke: C.green, 'stroke-width': '1.5'
    }));

    var ck = svgEl('text', {
      x: ex + 14, y: ey + 26,
      'dominant-baseline': 'middle',
      fill: C.green, 'font-size': '16',
      'font-family': 'sans-serif'
    });
    ck.textContent = '✓';
    _evidenceG.appendChild(ck);

    var evLbl = svgEl('text', {
      x: ex + 28, y: ey + 20,
      fill: C.text1, 'font-size': '11',
      'font-family': 'Space Grotesk,sans-serif'
    });
    evLbl.textContent = 'Control linkage confirmed';
    _evidenceG.appendChild(evLbl);

    var evDate = svgEl('text', {
      x: ex + 28, y: ey + 38,
      fill: C.green, 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace'
    });
    evDate.textContent = '2025-06-18 -- auto-linked';
    _evidenceG.appendChild(evDate);

    _rootG.appendChild(_evidenceG);
  }

  // ── Show final static frame (reduced mode + finish) ───────────────────────
  function showFinal() {
    // Page
    _pageG.style.transition = 'none';
    _pageG.style.opacity    = '1';
    _pageG.style.transform  = 'scale(1)';

    // Clause bright
    _clauseRect.setAttribute('stroke', 'rgba(85,199,232,0.8)');
    _clauseRect.setAttribute('fill', 'rgba(85,199,232,0.18)');

    // Fragment group + pills
    _fragG.style.opacity = '1';
    _pills.forEach(function(p) {
      p.style.transition = 'none';
      p.style.opacity    = '1';
      p.style.transform  = 'translateY(0)';
    });
    _bracketG.style.transition = 'none';
    _bracketG.style.opacity    = '1';

    // Nodes
    _nodes.forEach(function(n) {
      n.el.style.transition = 'none';
      n.el.style.opacity    = '1';
    });

    // Edges
    _edges.forEach(function(e) {
      e.el.style.transition = 'none';
      if (e.data.id === 'e-ctl-prc') {
        e.el.setAttribute('stroke', 'rgba(239,68,68,0.7)');
        e.el.setAttribute('stroke-dasharray', '3 4');
        e.el.setAttribute('stroke-dashoffset', '0');
      } else {
        e.el.setAttribute('stroke-dashoffset', '0');
      }
    });

    // Connection arrow
    _connArrow.style.transition = 'none';
    _connArrow.style.opacity    = '1';

    // Gap
    _gapBadge.style.transition = 'none';
    _gapBadge.style.opacity    = '1';
    _gapText.style.transition  = 'none';
    _gapText.style.opacity     = '1';

    // Gate (solid, no pulse)
    _gateG.style.transition = 'none';
    _gateG.style.opacity    = '1';

    // Evidence
    _evidenceG.style.transition = 'none';
    _evidenceG.style.opacity    = '1';
    _evidenceG.style.transform  = 'scale(1)';

    revealHeader(true);
  }

  // ── Beat handlers ─────────────────────────────────────────────────────────
  function _beat0() {
    _pageG.style.opacity   = '1';
    _pageG.style.transform = 'scale(1)';
  }

  function _beat1() {
    // Scan line via rAF
    var scanG = svgEl('g', {});
    var scanL = svgEl('line', {
      x1: 80, y1: 180, x2: 280, y2: 180,
      stroke: C.amber, 'stroke-width': '1', opacity: '0.8'
    });
    scanG.appendChild(scanL);
    _rootG.insertBefore(scanG, _pageG.nextSibling);

    var startY = 180, endY = 420, dur = 1200;
    var t0 = null;
    var dimmed = false;

    function step(ts) {
      if (!_alive) return;
      if (!t0) t0 = ts;
      var prog = Math.min((ts - t0) / dur, 1);
      var cy   = startY + (endY - startY) * prog;
      scanL.setAttribute('y1', cy);
      scanL.setAttribute('y2', cy);

      if (!dimmed && cy >= 358) {
        dimmed = true;
        _clauseRect.setAttribute('stroke', 'rgba(85,199,232,0.8)');
        _clauseRect.setAttribute('fill', 'rgba(85,199,232,0.18)');
        _pageG.style.opacity = '0.4';
      }

      if (prog < 1) {
        requestAnimationFrame(step);
      } else {
        if (scanG.parentNode) scanG.parentNode.removeChild(scanG);
        _pageG.style.opacity = '0.35';
      }
    }
    requestAnimationFrame(step);
  }

  function _beat2() {
    _fragG.style.opacity = '1';

    PILLS.forEach(function(p, i) {
      _timers.push(setTimeout(function() {
        if (!_alive) return;
        var pill = _pills[i];
        pill.style.opacity   = '1';
        pill.style.transform = 'translateY(0)';
      }, i * 150));
    });

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _bracketG.style.opacity = '1';
    }, PILLS.length * 150 + 200));
  }

  function _beat3() {
    _nodes.forEach(function(n, i) {
      _timers.push(setTimeout(function() {
        if (!_alive) return;
        n.el.style.opacity = '1';
      }, i * 250));
    });

    var edgeStart = _nodes.length * 250 + 100;
    _edges.forEach(function(e, i) {
      _timers.push(setTimeout(function() {
        if (!_alive) return;
        e.el.setAttribute('stroke-dashoffset', '0');
      }, edgeStart + i * 400));
    });

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _connArrow.style.opacity = '1';
    }, edgeStart));
  }

  function _beat4() {
    if (_gapEdge) {
      _gapEdge.style.transition = 'stroke 300ms ease';
      _gapEdge.setAttribute('stroke', 'rgba(239,68,68,0.7)');
      _gapEdge.setAttribute('stroke-dasharray', '3 4');
    }
    _gapBadge.style.opacity = '1';

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _gapText.style.opacity = '1';
    }, 600));
  }

  function _beat5() {
    _gateG.style.opacity = '1';

    // Inject pulse keyframe once
    if (!document.getElementById('cf-gate-style')) {
      var s = document.createElement('style');
      s.id = 'cf-gate-style';
      s.textContent = '@keyframes cfGatePulse{0%,100%{opacity:.7}50%{opacity:1}}';
      document.head.appendChild(s);
    }
    _diamond.style.animation = 'cfGatePulse 1.2s ease-in-out infinite';
  }

  function _beat6() {
    // Freeze diamond
    if (_diamond) _diamond.style.animation = 'none';

    // Spring stamp: 0 -> 1.1 -> 1.0
    _evidenceG.style.transition = 'opacity 200ms ease,transform 200ms ease';
    _evidenceG.style.opacity    = '1';
    _evidenceG.style.transform  = 'scale(1.1)';

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _evidenceG.style.transform = 'scale(1.0)';
    }, 220));
  }

  function _beat7() {
    // Subtle pull-back on root group
    _rootG.style.transition      = 'transform 600ms ease';
    _rootG.style.transformOrigin = '600px 280px';
    _rootG.style.transform       = 'scale(0.95)';

    revealHeader(true);
  }

  function _addControlStrip() {
    var strip = document.createElement('div');
    strip.style.cssText = 'position:absolute;bottom:6px;right:10px;display:flex;gap:16px;pointer-events:none;';
    ['replay', 'pause', 'next'].forEach(function(lbl) {
      var sp = document.createElement('span');
      sp.style.cssText = 'font-family:JetBrains Mono,monospace;font-size:11px;color:var(--text-3,#71758A);letter-spacing:.05em;';
      sp.textContent = lbl;
      strip.appendChild(sp);
    });
    container.style.position = 'relative';
    container.appendChild(strip);
  }

  // ── Timeline ──────────────────────────────────────────────────────────────
  var tl = createTimeline([
    { delay:     0, run: function() { _beat0(); } },
    { delay:  1000, run: function() { _beat1(); } },
    { delay:  2500, run: function() { _beat2(); } },
    { delay:  4000, run: function() { _beat3(); } },
    { delay:  5800, run: function() { _beat4(); } },
    { delay:  7000, run: function() { _beat5(); } },
    { delay:  8200, run: function() { _beat6(); } },
    { delay:  9300, run: function() { _beat7(); } },
    { delay: 10500, run: function() {
      _addControlStrip();
      container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
    }}
  ]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  return {
    play: function() {
      _alive = true;
      build();
      if (reduced) { showFinal(); return; }
      tl.play();
    },
    pause:  function() { tl.pause(); },
    resume: function() { tl.resume(); },
    reset:  function() {
      _alive = false;
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.reset();
      revealHeader(false);
    },
    finish:  function() { build(); showFinal(); },
    destroy: function() {
      _alive = false;
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
      revealHeader(true);
    }
  };
});
