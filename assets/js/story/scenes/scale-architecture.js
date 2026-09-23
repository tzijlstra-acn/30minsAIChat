// Scene: scale-architecture (Screen 08 - HOW TO SCALE)
// V19: Wow 4 -- Proof zooms into production and enterprise reuse.
// Semantic zoom via CSS scale() on the scene root reveals three concentric layers.
SceneDirector.register('scale-architecture', function(container, manifest, reduced) {

  var _timers   = [];
  var _spineRaf = null;
  var _tl       = null;
  var _root     = null;
  var _svg      = null;

  var C_CYAN   = 'var(--cyan,#4DD9E0)';
  var C_GREEN  = 'var(--green,#58C994)';
  var C_PINK   = 'var(--pink,#F0758A)';
  var C_S1     = 'var(--surface-1,#1C1F2B)';
  var C_BORDER = 'rgba(255,255,255,.10)';
  var C_TEXT2  = 'var(--text-2,#A0A6B8)';
  var C_TEXT3  = 'var(--text-3,#606678)';

  function svgEl(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // ── Data ──────────────────────────────────────
  var PROD_NODES = [
    { id: 'identity', label: 'Identity',         cx: 430,  cy: 90,  lx: 430,  ly: 68,  ta: 'middle' },
    { id: 'eval',     label: 'Evaluation',        cx: 770,  cy: 90,  lx: 770,  ly: 68,  ta: 'middle' },
    { id: 'monitor',  label: 'Monitoring',        cx: 912,  cy: 260, lx: 934,  ly: 264, ta: 'start'  },
    { id: 'fallback', label: 'Fallback',          cx: 800,  cy: 472, lx: 800,  ly: 500, ta: 'middle' },
    { id: 'incident', label: 'Incident handling', cx: 400,  cy: 472, lx: 400,  ly: 500, ta: 'middle' },
    { id: 'risk',     label: 'Risk control',      cx: 288,  cy: 260, lx: 266,  ly: 264, ta: 'end'    }
  ];

  var FLOW = [
    { id: 'fn0', label: 'Input',        x: 455, y: 260 },
    { id: 'fn1', label: 'AI Analysis',  x: 535, y: 260 },
    { id: 'fn2', label: 'Human Review', x: 615, y: 260 },
    { id: 'fn3', label: 'Evidence',     x: 695, y: 260 }
  ];

  var ENT_SVCS = [
    { x: 210, v: 'Context'       },
    { x: 400, v: 'Orchestration' },
    { x: 600, v: 'Security'      },
    { x: 790, v: 'Evidence'      },
    { x: 970, v: 'Cost'          }
  ];

  // ── Helpers ───────────────────────────────────
  function $id(id) { return _svg ? _svg.querySelector('#' + id) : null; }

  function fadeInEl(id, ms) {
    var e = $id(id); if (!e) return;
    e.style.transition = 'opacity ' + (ms || 400) + 'ms ease';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { e.style.opacity = '1'; });
    });
  }

  function zoomTo(s) {
    if (!_root) return;
    _root.style.transition = 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)';
    _root.style.transform  = 'scale(' + s + ')';
  }

  function lightNode(idx, fill, stroke) {
    var c = $id(FLOW[idx].id + '-c'); if (!c) return;
    c.style.transition = 'fill 300ms ease, stroke 300ms ease';
    c.style.fill   = fill   || 'rgba(77,217,224,.4)';
    c.style.stroke = stroke || C_CYAN;
  }

  function resetFlow() {
    FLOW.forEach(function(_, i) { lightNode(i, C_S1, C_BORDER); });
  }

  function runFlow(fill, stroke) {
    FLOW.forEach(function(_, i) {
      var t = setTimeout(function() { lightNode(i, fill, stroke); }, i * 220);
      _timers.push(t);
    });
  }

  function drawSpine() {
    var spine = $id('ent-spine'); if (!spine) return;
    var t0 = Date.now(), dur = 800;
    function step() {
      if (!_svg) return;
      var p = Math.min(1, (Date.now() - t0) / dur);
      spine.setAttribute('x2', 140 + p * 920);
      if (p < 1) { _spineRaf = requestAnimationFrame(step); }
      else        { _spineRaf = null; }
    }
    _spineRaf = requestAnimationFrame(step);
  }

  function showEntLabels() {
    if (!_svg) return;
    var items = _svg.querySelectorAll('[data-ent]');
    Array.prototype.forEach.call(items, function(e, i) {
      var t = setTimeout(function() {
        e.style.transition = 'opacity 300ms ease';
        e.style.opacity    = '1';
      }, i * 90);
      _timers.push(t);
    });
  }

  function showProdNodes() {
    PROD_NODES.forEach(function(n, i) {
      var t = setTimeout(function() {
        var ng = $id('pn-' + n.id); if (!ng) return;
        ng.style.transition = 'opacity 300ms ease';
        ng.style.opacity    = '1';
      }, i * 120);
      _timers.push(t);
    });
  }

  // ── Build ─────────────────────────────────────
  function build() {
    container.innerHTML = '';

    _root = document.createElement('div');
    _root.className = 'scene-root';
    _root.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';
    _root.style.transformOrigin = 'center center';
    _root.style.transform       = 'scale(1.8)';
    container.appendChild(_root);

    _svg = svgEl('svg', { viewBox: '0 0 1200 540', width: '100%', height: '100%' });
    _root.appendChild(_svg);

    _buildEnt();
    _buildProd();
    _buildProof();
    _buildFallbackChip();
    _buildReuseBadge();
  }

  function _buildEnt() {
    var g = svgEl('g', { id: 'ent-layer' });
    g.style.opacity = '0';

    // Frame
    g.appendChild(svgEl('rect', {
      x: 100, y: 20, width: 1000, height: 520, rx: 14,
      fill: 'rgba(88,201,148,.04)', stroke: C_GREEN,
      'stroke-width': 1.5, 'stroke-dasharray': '6 4'
    }));

    // Label (top-left so reuse badge can occupy top-centre)
    var hdr = svgEl('text', {
      x: 120, y: 40, 'text-anchor': 'start',
      'font-family': "'JetBrains Mono',monospace",
      'font-size': 12, 'letter-spacing': '0.10em', fill: C_GREEN, 'font-weight': '700'
    });
    hdr.textContent = 'ENTERPRISE REUSE';
    g.appendChild(hdr);

    // Spine line (animated)
    g.appendChild(svgEl('line', {
      id: 'ent-spine', x1: 140, y1: 510, x2: 140, y2: 510,
      stroke: C_GREEN, 'stroke-width': 1.5, opacity: '0.5'
    }));

    // Service labels and separators
    ENT_SVCS.forEach(function(s, i) {
      var t = svgEl('text', {
        x: s.x, y: 528, 'text-anchor': 'middle',
        'font-family': "'JetBrains Mono',monospace",
        'font-size': 11, fill: C_GREEN
      });
      t.textContent = s.v;
      t.style.opacity = '0';
      t.setAttribute('data-ent', '1');
      g.appendChild(t);

      if (i < ENT_SVCS.length - 1) {
        var sep = svgEl('text', {
          x: (s.x + ENT_SVCS[i + 1].x) / 2, y: 528, 'text-anchor': 'middle',
          'font-family': "'JetBrains Mono',monospace",
          'font-size': 11, fill: C_GREEN
        });
        sep.textContent = '--';
        sep.style.opacity = '0';
        sep.setAttribute('data-ent', '1');
        g.appendChild(sep);
      }
    });

    _svg.appendChild(g);
  }

  function _buildProd() {
    var g = svgEl('g', { id: 'prod-layer' });
    g.style.opacity = '0';

    // Ring rect
    g.appendChild(svgEl('rect', {
      x: 280, y: 80, width: 640, height: 400, rx: 12,
      fill: 'rgba(77,217,224,.03)', stroke: C_CYAN, 'stroke-width': 1.5
    }));

    // Label (centre-top, between the two top control nodes)
    var hdr = svgEl('text', {
      x: 600, y: 98, 'text-anchor': 'middle',
      'font-family': "'JetBrains Mono',monospace",
      'font-size': 14, 'letter-spacing': '0.12em', fill: C_CYAN, 'font-weight': '700'
    });
    hdr.textContent = 'PRODUCTION';
    g.appendChild(hdr);

    // Control nodes
    PROD_NODES.forEach(function(n) {
      var ng = svgEl('g', { id: 'pn-' + n.id });
      ng.style.opacity = '0';

      ng.appendChild(svgEl('circle', {
        cx: n.cx, cy: n.cy, r: 16,
        fill: 'rgba(77,217,224,.08)', stroke: C_CYAN, 'stroke-width': 1.5
      }));

      var abbr = svgEl('text', {
        x: n.cx, y: n.cy + 4, 'text-anchor': 'middle',
        'font-family': "'JetBrains Mono',monospace", 'font-size': 8, fill: C_CYAN
      });
      abbr.textContent = n.id.slice(0, 3).toUpperCase();
      ng.appendChild(abbr);

      var lbl = svgEl('text', {
        x: n.lx, y: n.ly, 'text-anchor': n.ta,
        'font-family': "'JetBrains Mono',monospace", 'font-size': 11, fill: C_TEXT2
      });
      lbl.textContent = n.label;
      ng.appendChild(lbl);

      g.appendChild(ng);
    });

    _svg.appendChild(g);
  }

  function _buildProof() {
    var g = svgEl('g', { id: 'proof-layer' });
    g.style.opacity = '0';

    // Box (dashed border)
    g.appendChild(svgEl('rect', {
      x: 400, y: 140, width: 400, height: 280, rx: 10,
      fill: C_S1, stroke: C_CYAN, 'stroke-width': 1.5, 'stroke-dasharray': '6 3'
    }));

    // PROOF label
    var hdr = svgEl('text', {
      x: 600, y: 163, 'text-anchor': 'middle',
      'font-family': "'JetBrains Mono',monospace",
      'font-size': 14, 'letter-spacing': '0.12em', fill: C_CYAN, 'font-weight': '700'
    });
    hdr.textContent = 'PROOF';
    g.appendChild(hdr);

    // Context tags
    ['Bounded context', 'Selected documents', 'One workflow', 'Manual fallback']
      .forEach(function(tag, i) {
        var t = svgEl('text', {
          x: 420, y: 182 + i * 16,
          'font-family': "'JetBrains Mono',monospace", 'font-size': 10, fill: C_TEXT3
        });
        t.textContent = '+ ' + tag;
        g.appendChild(t);
      });

    // Connector lines between flow nodes
    for (var i = 0; i < FLOW.length - 1; i++) {
      g.appendChild(svgEl('line', {
        x1: FLOW[i].x + 13,     y1: FLOW[i].y,
        x2: FLOW[i + 1].x - 13, y2: FLOW[i + 1].y,
        stroke: C_BORDER, 'stroke-width': 1.5
      }));
    }

    // Flow nodes
    FLOW.forEach(function(n) {
      var ng = svgEl('g', { id: n.id });

      ng.appendChild(svgEl('circle', {
        id: n.id + '-c', cx: n.x, cy: n.y, r: 12,
        fill: C_S1, stroke: C_BORDER, 'stroke-width': 1.5
      }));

      var lbl = svgEl('text', {
        x: n.x, y: n.y + 30, 'text-anchor': 'middle',
        'font-family': "'JetBrains Mono',monospace", 'font-size': 10, fill: C_TEXT3
      });
      lbl.textContent = n.label;
      ng.appendChild(lbl);

      g.appendChild(ng);
    });

    // Failure overlay circle on node 4 (starts hidden)
    var fail = svgEl('circle', {
      id: 'fail-node',
      cx: FLOW[3].x, cy: FLOW[3].y, r: 14,
      fill: 'rgba(240,117,138,.25)', stroke: C_PINK, 'stroke-width': 2
    });
    fail.style.opacity = '0';
    g.appendChild(fail);

    _svg.appendChild(g);
  }

  function _buildFallbackChip() {
    var g = svgEl('g', { id: 'fallback-chip' });
    g.style.opacity = '0';

    g.appendChild(svgEl('rect', {
      x: 480, y: 384, width: 240, height: 26, rx: 5,
      fill: 'rgba(88,201,148,.1)', stroke: C_GREEN, 'stroke-width': 1
    }));

    var t = svgEl('text', {
      x: 600, y: 401, 'text-anchor': 'middle',
      'font-family': "'JetBrains Mono',monospace", 'font-size': 11, fill: C_GREEN
    });
    t.textContent = 'Controlled fallback';
    g.appendChild(t);

    _svg.appendChild(g);
  }

  function _buildReuseBadge() {
    var g = svgEl('g', { id: 'reuse-badge' });
    g.style.opacity = '0';

    // Opaque rect so it reads clearly at top-centre of enterprise frame
    g.appendChild(svgEl('rect', {
      x: 310, y: 26, width: 580, height: 30, rx: 6,
      fill: 'rgba(15,17,26,.92)', stroke: C_GREEN, 'stroke-width': 1.5
    }));

    var t = svgEl('text', {
      x: 600, y: 46, 'text-anchor': 'middle',
      'font-family': "'JetBrains Mono',monospace", 'font-size': 14, fill: C_GREEN
    });
    t.textContent = 'Pattern reused: 6 shared services, 0 duplicated builds';
    g.appendChild(t);

    _svg.appendChild(g);
  }

  // ── Show-all (finish / reduced motion) ────────
  function showAll() {
    if (!_root || !_svg) return;
    _root.style.transition = 'none';
    _root.style.transform  = 'scale(0.9)';

    ['proof-layer', 'prod-layer', 'ent-layer', 'fallback-chip', 'reuse-badge']
      .forEach(function(id) {
        var e = $id(id); if (e) e.style.opacity = '1';
      });

    FLOW.forEach(function(_, i) { lightNode(i, 'rgba(88,201,148,.45)', C_GREEN); });

    PROD_NODES.forEach(function(n) {
      var ng = $id('pn-' + n.id); if (ng) ng.style.opacity = '1';
    });

    var spine = $id('ent-spine');
    if (spine) spine.setAttribute('x2', '1060');

    var items = _svg.querySelectorAll('[data-ent]');
    Array.prototype.forEach.call(items, function(e) { e.style.opacity = '1'; });
  }

  // ── Timeline steps (11 beats) ─────────────────
  var STEPS = [
    // Beat 1 (200ms): PROOF box appears
    { delay: 200, run: function() {
      fadeInEl('proof-layer', 500);
    }},

    // Beat 2 (600ms): obligation token flows through proof
    { delay: 600, run: function() {
      runFlow('rgba(77,217,224,.45)', C_CYAN);
    }},

    // Beat 3 (1400ms): failure at node 4 -- red pulse
    { delay: 1400, run: function() {
      var c = $id('fn3-c');
      if (c) {
        c.style.transition = 'fill 200ms ease, stroke 200ms ease';
        c.style.fill   = 'rgba(240,117,138,.3)';
        c.style.stroke = C_PINK;
      }
      var f = $id('fail-node');
      if (f) {
        f.style.transition = 'opacity 300ms ease';
        f.style.opacity = '1';
      }
    }},

    // Beat 4 (1900ms): failure fades, controlled fallback chip appears
    { delay: 1900, run: function() {
      var f = $id('fail-node');
      if (f) { f.style.transition = 'opacity 400ms ease'; f.style.opacity = '0'; }
      resetFlow();
      fadeInEl('fallback-chip', 400);
    }},

    // Beat 5 (2500ms): zoom-out 1 -- scale 1.8 -> 1.0
    { delay: 2500, run: function() {
      zoomTo(1.0);
    }},

    // Beat 6 (3200ms): PRODUCTION ring fades in, control nodes stagger
    { delay: 3200, run: function() {
      fadeInEl('prod-layer', 500);
      showProdNodes();
    }},

    // Beat 7 (3900ms): obligation runs again through full production path (green)
    { delay: 3900, run: function() {
      runFlow('rgba(88,201,148,.45)', C_GREEN);
    }},

    // Beat 8 (4600ms): second obligation token appears at proof input
    { delay: 4600, run: function() {
      var c = $id('fn0-c');
      if (c) {
        c.style.transition = 'fill 300ms ease, stroke 300ms ease';
        c.style.fill   = 'rgba(77,217,224,.65)';
        c.style.stroke = C_CYAN;
      }
    }},

    // Beat 9 (5100ms): slight pull-back to show enterprise frame border
    { delay: 5100, run: function() {
      zoomTo(0.9);
    }},

    // Beat 10 (5800ms): ENTERPRISE frame fades in, spine draws left-to-right
    { delay: 5800, run: function() {
      fadeInEl('ent-layer', 500);
      var t1 = setTimeout(drawSpine,     350);
      var t2 = setTimeout(showEntLabels, 650);
      _timers.push(t1, t2);
    }},

    // Beat 11 (6500ms): reuse badge
    { delay: 6500, run: function() {
      fadeInEl('reuse-badge', 500);
    }}
  ];

  // ── Cleanup helper ─────────────────────────────
  function _cleanup() {
    _timers.forEach(clearTimeout);
    _timers = [];
    if (_spineRaf) { cancelAnimationFrame(_spineRaf); _spineRaf = null; }
    if (_tl) { _tl.destroy(); _tl = null; }
  }

  // ── Public API ────────────────────────────────
  return {
    play: function() {
      _cleanup();
      build();
      _tl = createTimeline(STEPS);
      _tl.play();
    },
    pause:  function() { if (_tl) _tl.pause(); },
    resume: function() { if (_tl) _tl.resume(); },
    reset: function() {
      _cleanup();
      build();
      _tl = createTimeline(STEPS);
    },
    finish: function() {
      _cleanup();
      build();
      showAll();
    },
    destroy: function() {
      _cleanup();
      _root = null;
      _svg  = null;
      container.innerHTML = '';
    }
  };
});
