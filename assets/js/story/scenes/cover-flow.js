// Scene: cover-flow (Screen 00 -- Introduction)
// V26: Fast cinematic cold open. ~4 seconds.
// The clause becomes the obligation; AI detects a gap; evidence locks.
// Title shown via screen-hdr only -- no SVG duplicate.
// ViewBox: 0 0 1200 560. No external deps. No em-dash.
SceneDirector.register('cover-flow', function(container, manifest, reduced) {

  var _timers = [];
  var _alive  = false;
  var _hdr    = null;

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

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

  var NODES = [
    { id: 'obligation', cx: 780, cy: 250, r: 22, fill: C.accent, label: 'OBL-27', ldy: 28 },
    { id: 'policy',     cx: 860, cy: 200, r: 16, fill: C.text2,  label: 'policy',  ldy: 22 },
    { id: 'control',    cx: 940, cy: 250, r: 16, fill: C.green,  label: 'control', ldy: 22 },
    { id: 'process',    cx: 900, cy: 330, r: 16, fill: C.cyan,   label: 'process', ldy: 22 },
    { id: 'system',     cx: 820, cy: 390, r: 13, fill: C.text2,  label: 'system',  ldy: 19 },
    { id: 'owner',      cx: 740, cy: 340, r: 13, fill: C.amber,  label: 'owner',   ldy: 19 }
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

  var _svg, _rootG;
  var _pageG, _clauseRect;
  var _fragG, _pills, _bracketG;
  var _graphG, _nodes, _edges, _gapEdge, _gapBadge, _gapText;
  var _aiPropG, _evidenceG;

  // ── Header ────────────────────────────────────────────────────────────────
  function revealHeader(show) {
    if (!_hdr) {
      var screen = container.closest('.scene-screen');
      _hdr = screen ? screen.querySelector('.screen-hdr') : null;
    }
    if (_hdr) {
      _hdr.style.transition = 'opacity 400ms ease';
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

    revealHeader(true);

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
    _buildEvidence();
    _buildAiProposal();

    container.appendChild(_svg);
  }

  function _buildRegPage() {
    _pageG = svgEl('g', {});
    // Starts shifted up slightly -- slides down into place on beat0
    _pageG.style.cssText = 'opacity:0;transform:translateY(-18px);'
      + 'transform-origin:180px 300px;'
      + 'transition:opacity 320ms cubic-bezier(.16,1,.3,1),transform 320ms cubic-bezier(.16,1,.3,1);';

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

    PILLS.forEach(function(p) {
      var g = svgEl('g', {});
      // Start lower, slides up -- burst animation
      g.style.cssText = 'opacity:0;transform:translateY(14px);transition:opacity 280ms ease,transform 280ms cubic-bezier(.16,1,.3,1);';

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

    _bracketG = svgEl('g', {});
    _bracketG.style.cssText = 'opacity:0;transition:opacity 300ms ease;';

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

    // Label positioned well above the bracket so it never clips the first pill
    var glt = svgEl('text', {
      x: bx, y: by1 - 30,
      'text-anchor': 'middle',
      fill: C.text3, 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1'
    });
    glt.textContent = 'OBLIGATION OBJECT';
    _bracketG.appendChild(glt);

    var arrowX1 = bx + bw + 4;
    var arrowX2 = 540;
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
      path.style.cssText = 'transition:stroke-dashoffset 320ms ease;';
      edgeLayer.appendChild(path);
      _edges.push({ el: path, len: len, data: ed });
    });
    _graphG.appendChild(edgeLayer);

    _edges.forEach(function(e) { if (e.data.id === 'e-ctl-prc') _gapEdge = e.el; });

    var nodeLayer = svgEl('g', {});
    NODES.forEach(function(n) {
      var g = svgEl('g', {});
      g.style.cssText = 'opacity:0;transition:opacity 220ms ease;';

      g.appendChild(svgEl('circle', {
        cx: n.cx, cy: n.cy,
        r: Math.round(n.r * 1.55),
        fill: n.fill,
        opacity: n.id === 'obligation' ? '0.18' : '0.12'
      }));

      g.appendChild(svgEl('circle', {
        cx: n.cx, cy: n.cy, r: n.r,
        fill: n.fill, opacity: '0.92'
      }));

      g.appendChild(svgEl('circle', {
        cx: Math.round(n.cx - n.r * 0.28),
        cy: Math.round(n.cy - n.r * 0.28),
        r: Math.round(n.r * 0.36),
        fill: '#ffffff', opacity: '0.30'
      }));

      var lbl = svgEl('text', {
        x: n.cx, y: n.cy + n.r + n.ldy,
        'text-anchor': 'middle',
        fill: C.text2, 'font-size': '10',
        'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.5'
      });
      lbl.textContent = n.label;
      g.appendChild(lbl);
      nodeLayer.appendChild(g);
      _nodes.push({ el: g, data: n });
    });
    _graphG.appendChild(nodeLayer);

    // Gap badge -- larger and more dramatic than before
    var gmx = (940 + 900) / 2;
    var gmy = (250 + 330) / 2;
    _gapBadge = svgEl('g', {});
    _gapBadge.style.cssText = 'opacity:0;transform-origin:' + gmx + 'px ' + gmy + 'px;'
      + 'transform:scale(0.5);transition:opacity 200ms ease,transform 220ms cubic-bezier(.16,1,.3,1);';

    _gapBadge.appendChild(svgEl('rect', {
      x: gmx - 20, y: gmy - 11, width: 40, height: 20,
      rx: 4, fill: 'rgba(239,68,68,0.9)'
    }));
    var gbt = svgEl('text', {
      x: gmx, y: gmy,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#fff', 'font-size': '10', 'font-weight': '700',
      'font-family': 'JetBrains Mono,monospace'
    });
    gbt.textContent = 'GAP';
    _gapBadge.appendChild(gbt);
    _graphG.appendChild(_gapBadge);

    _gapText = svgEl('text', {
      x: 860, y: 490,
      'text-anchor': 'middle',
      fill: 'rgba(239,68,68,0.75)',
      'font-size': '12',
      'font-family': 'Space Grotesk,sans-serif'
    });
    _gapText.textContent = 'Obligation not linked to process evidence';
    _gapText.style.cssText = 'opacity:0;transition:opacity 300ms ease;';
    _graphG.appendChild(_gapText);

    _rootG.appendChild(_graphG);
  }

  function _buildEvidence() {
    _evidenceG = svgEl('g', {});
    // Positioned to the right of all graph nodes (rightmost: control cx=940); clear at x=1010+
    _evidenceG.style.cssText = 'opacity:0;transform-origin:1097px 226px;transform:scale(0.6);'
      + 'transition:opacity 200ms ease,transform 260ms cubic-bezier(.16,1,.3,1);';

    var ex = 1010, ey = 200, ew = 175, eh = 52;

    _evidenceG.appendChild(svgEl('path', {
      d: 'M' + ex + ',' + (ey + eh) +
         ' C' + ex + ',440' +
         ' 220,450' +
         ' 180,374',
      fill: 'none', stroke: C.green, 'stroke-width': '1',
      'stroke-dasharray': '4 4', opacity: '0.4'
    }));

    _evidenceG.appendChild(svgEl('rect', {
      x: ex, y: ey, width: ew, height: eh,
      rx: 6, fill: 'rgba(0,0,0,0.4)',
      stroke: C.green, 'stroke-width': '2'
    }));

    var ck = svgEl('text', {
      x: ex + 14, y: ey + 26,
      'dominant-baseline': 'middle',
      fill: C.green, 'font-size': '18',
      'font-family': 'sans-serif'
    });
    ck.textContent = '✓';
    _evidenceG.appendChild(ck);

    var evLbl = svgEl('text', {
      x: ex + 32, y: ey + 20,
      fill: C.text1, 'font-size': '12', 'font-weight': '600',
      'font-family': 'Space Grotesk,sans-serif'
    });
    evLbl.textContent = 'Control linkage confirmed';
    _evidenceG.appendChild(evLbl);

    var evDate = svgEl('text', {
      x: ex + 32, y: ey + 38,
      fill: C.green, 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace'
    });
    evDate.textContent = '2025-06-18 -- auto-linked';
    _evidenceG.appendChild(evDate);

    _rootG.appendChild(_evidenceG);
  }

  function _buildAiProposal() {
    _aiPropG = svgEl('g', {});
    // Starts from above; slides down into cleared top space
    _aiPropG.style.cssText = 'opacity:0;transform:translateY(-16px);'
      + 'transition:opacity 280ms ease,transform 280ms cubic-bezier(.16,1,.3,1);';

    // Positioned above the graph cluster (nodes start at cy=200); clear at y=50-96
    var px = 700, py = 50, pw = 240, ph = 46;

    _aiPropG.appendChild(svgEl('rect', {
      x: px, y: py, width: pw, height: ph, rx: 5,
      fill: 'rgba(180,76,255,0.10)',
      stroke: C.accent, 'stroke-width': '1.5'
    }));

    _aiPropG.appendChild(svgEl('rect', {
      x: px + 8, y: py + 8, width: 22, height: 13, rx: 3,
      fill: C.accent
    }));
    var badgeTxt = svgEl('text', {
      x: px + 19, y: py + 17,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#fff', 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.5'
    });
    badgeTxt.textContent = 'AI';
    _aiPropG.appendChild(badgeTxt);

    var propTxt = svgEl('text', {
      x: px + 36, y: py + 17,
      'dominant-baseline': 'middle',
      fill: C.text1, 'font-size': '11', 'font-weight': '600',
      'font-family': 'Space Grotesk,sans-serif'
    });
    propTxt.textContent = 'Link OBL-27 to evidence record';
    _aiPropG.appendChild(propTxt);

    var subTxt = svgEl('text', {
      x: px + 8, y: py + 37,
      fill: C.text3, 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace'
    });
    subTxt.textContent = 'confidence high -- auto-linked';
    _aiPropG.appendChild(subTxt);

    // Arrow pointing from box center-bottom down to the GAP badge
    var arrowMx = px + Math.round(pw / 2);
    _aiPropG.appendChild(svgEl('line', {
      x1: String(arrowMx), y1: String(py + ph + 4),
      x2: '918', y2: '264',
      stroke: C.accent, 'stroke-width': '1.5',
      'stroke-dasharray': '4 3', opacity: '0.55'
    }));
    _aiPropG.appendChild(svgEl('polygon', {
      points: '913,256 923,256 918,265',
      fill: C.accent, opacity: '0.55'
    }));

    _rootG.appendChild(_aiPropG);
  }

  // ── Show final static frame ───────────────────────────────────────────────
  function showFinal() {
    _pageG.style.transition   = 'none';
    _pageG.style.opacity      = '1';
    _pageG.style.transform    = 'translateY(0)';
    _clauseRect.setAttribute('stroke', 'rgba(85,199,232,0.8)');
    _clauseRect.setAttribute('fill', 'rgba(85,199,232,0.18)');
    _pageG.style.opacity      = '0.4';

    _fragG.style.opacity = '1';
    _pills.forEach(function(p) {
      p.style.transition = 'none';
      p.style.opacity    = '1';
      p.style.transform  = 'translateY(0)';
    });
    _bracketG.style.transition = 'none';
    _bracketG.style.opacity    = '1';

    _nodes.forEach(function(n) {
      n.el.style.transition = 'none';
      n.el.style.opacity    = '1';
    });

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

    _gapBadge.style.transition = 'none';
    _gapBadge.style.opacity    = '1';
    _gapBadge.style.transform  = 'scale(1)';
    _gapText.style.transition  = 'none';
    _gapText.style.opacity     = '1';

    _aiPropG.style.transition  = 'none';
    _aiPropG.style.opacity     = '1';
    _aiPropG.style.transform   = 'translateY(0)';

    _evidenceG.style.transition = 'none';
    _evidenceG.style.opacity    = '1';
    _evidenceG.style.transform  = 'scale(1)';

    revealHeader(true);
  }

  // ── Beat handlers ─────────────────────────────────────────────────────────

  // Beat 0 (0ms): document drops in
  function _beat0() {
    _pageG.style.opacity   = '1';
    _pageG.style.transform = 'translateY(0)';
  }

  // Beat 1 (380ms): clause flashes bright, page dims -- "clause fires"
  function _beat1() {
    _clauseRect.style.transition = 'fill 160ms ease, stroke 160ms ease';
    _clauseRect.setAttribute('stroke', 'rgba(85,199,232,0.9)');
    _clauseRect.setAttribute('fill', 'rgba(85,199,232,0.22)');

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _pageG.style.transition = 'opacity 400ms ease';
      _pageG.style.opacity    = '0.4';
    }, 200));
  }

  // Beat 2 (800ms): ALL pills burst out simultaneously (tiny stagger 50ms)
  function _beat2() {
    _fragG.style.opacity = '1';

    _pills.forEach(function(pill, i) {
      _timers.push(setTimeout(function() {
        if (!_alive) return;
        pill.style.opacity   = '1';
        pill.style.transform = 'translateY(0)';
      }, i * 50));
    });

    // Bracket appears after the last pill
    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _bracketG.style.opacity = '1';
    }, _pills.length * 50 + 120));
  }

  // Beat 3 (1300ms): graph nodes flash in fast (60ms stagger)
  function _beat3() {
    _nodes.forEach(function(n, i) {
      _timers.push(setTimeout(function() {
        if (!_alive) return;
        n.el.style.opacity = '1';
      }, i * 60));
    });
  }

  // Beat 4 (1750ms): all edges draw simultaneously
  function _beat4() {
    _edges.forEach(function(e) {
      if (!_alive) return;
      e.el.setAttribute('stroke-dashoffset', '0');
    });
  }

  // Beat 5 (2200ms): GAP -- red edge + badge pounds in + text
  function _beat5() {
    if (_gapEdge) {
      _gapEdge.style.transition = 'stroke 200ms ease';
      _gapEdge.setAttribute('stroke', 'rgba(239,68,68,0.8)');
      _gapEdge.setAttribute('stroke-dasharray', '3 4');
    }

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _gapBadge.style.opacity   = '1';
      _gapBadge.style.transform = 'scale(1)';
    }, 120));

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _gapText.style.opacity = '1';
    }, 360));
  }

  // Beat 6 (2800ms): AI proposal slides up
  function _beat6() {
    _aiPropG.style.opacity   = '1';
    _aiPropG.style.transform = 'translateY(0)';
  }

  // Beat 7 (3300ms): evidence stamps in -- spring from scale(0.6) to scale(1.08) to scale(1)
  function _beat7() {
    _evidenceG.style.opacity   = '1';
    _evidenceG.style.transform = 'scale(1.08)';

    _timers.push(setTimeout(function() {
      if (!_alive) return;
      _evidenceG.style.transition = 'transform 180ms ease';
      _evidenceG.style.transform  = 'scale(1)';
    }, 260));
  }

  // ── Timeline ──────────────────────────────────────────────────────────────
  var tl = createTimeline([
    { delay:    0, run: function() { _beat0(); } },   // doc drops in
    { delay:  380, run: function() { _beat1(); } },   // clause fires
    { delay:  800, run: function() { _beat2(); } },   // pills burst
    { delay: 1300, run: function() { _beat3(); } },   // graph nodes
    { delay: 1750, run: function() { _beat4(); } },   // edges draw
    { delay: 2200, run: function() { _beat5(); } },   // GAP detected
    { delay: 2800, run: function() { _beat6(); } },   // AI proposal
    { delay: 3300, run: function() { _beat7(); } },   // evidence stamp
    { delay: 4000, run: function() {
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
    renderStatic: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showFinal();
    },
    renderError: function(err) {
      container.innerHTML = '';
      var w = document.createElement('div');
      w.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;';
      var m = document.createElement('div');
      m.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--text-3);text-align:center;';
      m.textContent = 'Scene unavailable';
      var s = document.createElement('div');
      s.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;color:var(--border-2);text-align:center;';
      s.textContent = err && err.message ? err.message : 'render error';
      w.appendChild(m); w.appendChild(s); container.appendChild(w);
    },
    resize: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showFinal();
    },
    seek: function(p) {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (p >= 1) { showFinal(); }
    },
    getAccessibleSummary: function() {
      return 'A regulatory clause is parsed into a structured obligation object. AI detects a gap in the evidence chain and proposes a link. The obligation connects to a verified evidence record. AI changes risk work.';
    },
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
