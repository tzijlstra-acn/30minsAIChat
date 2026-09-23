// Scene: transformation-system (Screen 05)
// V19: The operating system assembles around the use case.
// Knowledge graph persists at centre; five transformation fields slide in.
// Failure demo: Work and decisions dims; process gap appears; system restores.
SceneDirector.register('transformation-system', function(container, manifest, reduced) {

  var GRAPH_DATA_URL = './assets/data/context-graph/regulation-coverage.json';

  var _timers = [];
  var _tl = null;

  // ── Field panel definitions ──────────────────────────────────────────────
  // connFrom: midpoint of the edge facing the graph
  // connTo:   target node position in the graph
  var FIELDS = [
    {
      id: 'work', label: 'Work and decisions', color: '#55C7E8',
      x:  40, y:  40, w: 260, h: 120,
      slideDir: 'left',
      connFrom: { x: 300, y: 100 }, connTo: { x: 463, y: 200 }
    },
    {
      id: 'data', label: 'Data and technology', color: '#B44CFF',
      x:  40, y: 390, w: 260, h: 120,
      slideDir: 'bottom-left',
      connFrom: { x: 300, y: 450 }, connTo: { x: 548, y: 360 }
    },
    {
      id: 'governance', label: 'Governance and assurance', color: '#58C994',
      x: 920, y:  40, w: 240, h: 120,
      slideDir: 'right',
      connFrom: { x: 920, y: 100 }, connTo: { x: 718, y: 200 }
    },
    {
      id: 'value', label: 'Value and ownership', color: '#F3B34C',
      x: 920, y: 390, w: 240, h: 120,
      slideDir: 'bottom-right',
      connFrom: { x: 920, y: 450 }, connTo: { x: 695, y: 318 }
    },
    {
      id: 'people', label: 'People and roles', color: '#F0758A',
      x: 450, y: 455, w: 300, h:  90,
      slideDir: 'bottom',
      connFrom: { x: 600, y: 455 }, connTo: { x: 720, y: 268 }
    }
  ];

  function slideOffset(dir) {
    switch (dir) {
      case 'left':         return 'translate(-200px,0)';
      case 'bottom-left':  return 'translate(-160px,100px)';
      case 'right':        return 'translate(200px,0)';
      case 'bottom-right': return 'translate(160px,100px)';
      case 'bottom':       return 'translate(0,120px)';
    }
    return 'translate(0,0)';
  }

  // ── Graph node layout (fixed SVG coords) ────────────────────────────────
  // Colours and positions from V19 spec; labels/sublabels enriched from JSON when available.
  var GRAPH_NODES = [
    // Business meaning zone (top row, y~200)
    { id: 'reg-001', label: 'Regulation', sublabel: '',  cx: 463, cy: 200, r: 11, color: '#55C7E8', onChain: true,  hero: false },
    { id: 'obl-001', label: 'Obligation', sublabel: '',  cx: 545, cy: 200, r: 15, color: '#B44CFF', onChain: true,  hero: true  },
    { id: 'pol-001', label: 'Policy',     sublabel: '',  cx: 633, cy: 200, r: 11, color: '#A4A9B7', onChain: true,  hero: false },
    { id: 'ctl-001', label: 'Control',    sublabel: '',  cx: 718, cy: 200, r: 11, color: '#A4A9B7', onChain: true,  hero: false },
    // Operating execution zone (right side)
    { id: 'prc-001', label: 'Process',    sublabel: '',  cx: 720, cy: 268, r: 11, color: '#58C994', onChain: true,  hero: false },
    { id: 'sys-001', label: 'System',     sublabel: '',  cx: 752, cy: 315, r:  9, color: '#A4A9B7', onChain: false, hero: false },
    { id: 'own-001', label: 'Owner',      sublabel: '',  cx: 695, cy: 318, r:  9, color: '#F3B34C', onChain: false, hero: false },
    // Assurance zone (bottom)
    { id: 'evd-001', label: 'Evidence',   sublabel: '',  cx: 548, cy: 360, r: 13, color: '#58C994', onChain: true,  hero: false },
    { id: 'iss-001', label: 'Issue',      sublabel: '',  cx: 635, cy: 360, r: 10, color: '#F0758A', onChain: false, hero: false }
  ];

  // OBL-27 highlighted chain: reg -> obl -> pol -> ctl -> prc -> evd
  var CHAIN_EDGES = [
    { from: 'reg-001', to: 'obl-001' },
    { from: 'obl-001', to: 'pol-001' },
    { from: 'pol-001', to: 'ctl-001' },
    { from: 'ctl-001', to: 'prc-001' },
    { from: 'prc-001', to: 'evd-001' }
  ];

  // Off-chain edges (dashed, faint)
  var OFFCHAIN_EDGES = [
    { from: 'prc-001', to: 'sys-001' },
    { from: 'prc-001', to: 'own-001' },
    { from: 'evd-001', to: 'iss-001' }
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────
  function nodeById(id) {
    for (var i = 0; i < GRAPH_NODES.length; i++) {
      if (GRAPH_NODES[i].id === id) return GRAPH_NODES[i];
    }
    return null;
  }

  function edgeLen(n1, n2) {
    var dx = n2.cx - n1.cx, dy = n2.cy - n1.cy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function get(id) {
    return container.querySelector('[data-id="' + id + '"]');
  }

  // ── JSON enrichment (synchronous XHR at play() time) ────────────────────
  function loadGraphData() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', GRAPH_DATA_URL, false); // synchronous
      xhr.send(null);
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        if (data && data.nodes) {
          data.nodes.forEach(function(jn) {
            var local = nodeById(jn.id);
            if (local) {
              // Prefer displayLabel; fall back to label. Never render the raw node ID.
              var dl = jn.displayLabel || jn.label;
              if (dl && dl !== jn.id) {
                local.label = dl;
              } else if (!dl || dl === jn.id) {
                if (typeof console !== 'undefined' && console.error) {
                  console.error('[transformation-system] Missing displayLabel for node ' + jn.id);
                }
                // Keep the local default label; do not expose raw ID.
              }
              if (jn.sublabel) local.sublabel = jn.sublabel;
            }
          });
        }
      }
    } catch (e) {
      // Fallback: GRAPH_NODES already populated with reasonable labels
    }
  }

  // ── Build DOM ────────────────────────────────────────────────────────────
  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.style.cssText = 'width:100%;height:100%;position:relative;';

    var svg = svgEl('svg', {
      viewBox: '0 0 1200 560',
      preserveAspectRatio: 'xMidYMid meet'
    });
    svg.style.cssText = 'width:100%;height:100%;display:block;';

    // ── Graph background panel ──
    var graphBg = svgEl('g', { 'data-id': 'graph-bg', opacity: '0' });
    graphBg.style.cssText = 'transition:opacity 400ms ease;';
    graphBg.appendChild(svgEl('rect', {
      x: '428', y: '168', width: '365', height: '214', rx: '14',
      fill: 'rgba(18,21,30,0.92)', stroke: 'rgba(180,76,255,0.35)', 'stroke-width': '1.5'
    }));

    // Zone label: business meaning -- sits in the header band above the nodes.
    // Nodes have cy=200 (min radius 11), so top at y=189. Label is centered at y=176,
    // keeping it clearly in the graph panel header strip (y=168..188).
    var bzLbl = svgEl('text', {
      x: '593', y: '176',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'rgba(164,169,183,0.40)', 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5',
      'pointer-events': 'none'
    });
    bzLbl.textContent = 'BUSINESS MEANING';
    graphBg.appendChild(bzLbl);

    // Zone label: execution -- placed in the left margin of the graph panel,
    // below the off-chain execution cluster (prc/sys/own at cy=268..318).
    // Horizontal, not rotated, to avoid overlapping the PROCESS GAP badge region.
    var execLbl = svgEl('text', {
      x: '436', y: '370',
      'text-anchor': 'start', 'dominant-baseline': 'middle',
      fill: 'rgba(164,169,183,0.30)', 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1',
      'pointer-events': 'none'
    });
    execLbl.textContent = 'EXECUTION';
    graphBg.appendChild(execLbl);

    // OBL-27 badge inside graph panel
    var oblBadge = svgEl('text', {
      x: '609', y: '374',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'rgba(180,76,255,0.55)', 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5'
    });
    oblBadge.textContent = 'OBL-27 -- ILLUSTRATIVE';
    graphBg.appendChild(oblBadge);

    svg.appendChild(graphBg);

    // ── Off-chain edges ──
    var offchainG = svgEl('g', { 'data-id': 'offchain-edges', opacity: '0' });
    offchainG.style.cssText = 'transition:opacity 500ms ease;';
    OFFCHAIN_EDGES.forEach(function(e) {
      var n1 = nodeById(e.from), n2 = nodeById(e.to);
      if (!n1 || !n2) return;
      offchainG.appendChild(svgEl('line', {
        x1: n1.cx, y1: n1.cy, x2: n2.cx, y2: n2.cy,
        stroke: 'rgba(164,169,183,0.25)', 'stroke-width': '1',
        'stroke-dasharray': '3,4'
      }));
    });
    svg.appendChild(offchainG);

    // ── Chain edges (animated stroke-dashoffset) ──
    CHAIN_EDGES.forEach(function(e) {
      var n1 = nodeById(e.from), n2 = nodeById(e.to);
      if (!n1 || !n2) return;
      var len = Math.ceil(edgeLen(n1, n2)) + 1;
      var lineEl = svgEl('line', {
        'data-id': 'chain-edge-' + e.from + '-' + e.to,
        x1: n1.cx, y1: n1.cy, x2: n2.cx, y2: n2.cy,
        stroke: 'rgba(180,76,255,0.75)', 'stroke-width': '2'
      });
      lineEl.style.cssText =
        'stroke-dasharray:' + len + ';' +
        'stroke-dashoffset:' + len + ';' +
        'transition:stroke-dashoffset 380ms ease;';
      svg.appendChild(lineEl);
    });

    // ── Graph nodes ──
    GRAPH_NODES.forEach(function(n) {
      var g = svgEl('g', { 'data-id': 'node-' + n.id });
      g.style.cssText =
        'transform-origin:' + n.cx + 'px ' + n.cy + 'px;' +
        'transform:scale(0);' +
        'transition:transform 320ms cubic-bezier(0.175,0.885,0.32,1.275);' +
        (n.onChain ? '' : 'opacity:0.5;');

      // Hero glow
      if (n.hero) {
        g.appendChild(svgEl('circle', {
          cx: n.cx, cy: n.cy, r: n.r + 7,
          fill: 'rgba(180,76,255,0.12)'
        }));
      }

      // Main circle
      g.appendChild(svgEl('circle', {
        cx: n.cx, cy: n.cy, r: n.r,
        fill: n.hero ? 'rgba(180,76,255,0.22)' : 'rgba(18,21,30,0.95)',
        stroke: n.color,
        'stroke-width': n.hero ? '2.5' : (n.onChain ? '2' : '1.5')
      }));

      // Primary label (below circle)
      var lbl = svgEl('text', {
        x: n.cx, y: n.cy + n.r + 11,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: n.onChain ? n.color : 'rgba(164,169,183,0.55)',
        'font-size': '11', 'font-weight': '600',
        'font-family': 'Space Grotesk,sans-serif'
      });
      lbl.textContent = n.label;
      g.appendChild(lbl);

      svg.appendChild(g);
    });

    // ── Connector lines (field -> graph node) ──
    FIELDS.forEach(function(f) {
      var cl = svgEl('line', {
        'data-id': 'conn-' + f.id,
        x1: f.connFrom.x, y1: f.connFrom.y,
        x2: f.connTo.x,   y2: f.connTo.y,
        stroke: f.color, 'stroke-width': '1',
        'stroke-dasharray': '4,5', opacity: '0'
      });
      cl.style.cssText = 'transition:opacity 350ms ease;';
      svg.appendChild(cl);
    });

    // ── Field panels ──
    FIELDS.forEach(function(f) {
      var g = svgEl('g', { 'data-id': 'field-' + f.id });
      g.style.cssText =
        'transform:' + slideOffset(f.slideDir) + ';' +
        'opacity:0;' +
        'transition:transform 520ms cubic-bezier(0.22,1,0.36,1),' +
        'opacity 520ms ease;';

      // Background rect
      g.appendChild(svgEl('rect', {
        x: f.x, y: f.y, width: f.w, height: f.h, rx: '10',
        fill: 'rgba(18,21,30,0.93)', stroke: f.color, 'stroke-width': '1.5'
      }));

      // Colour accent strip along top
      g.appendChild(svgEl('rect', {
        x: f.x, y: f.y, width: f.w, height: '4', rx: '10',
        fill: f.color, opacity: '0.65'
      }));

      // Field label
      var lbl = svgEl('text', {
        x: f.x + f.w / 2, y: f.y + f.h / 2,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: '#E8E9F0', 'font-size': '14', 'font-weight': '700',
        'font-family': 'Space Grotesk,sans-serif'
      });
      lbl.textContent = f.label;
      g.appendChild(lbl);

      svg.appendChild(g);
    });

    // ── Gap indicator (failure demo overlay) ──
    // Overlays the ctl-001 -> prc-001 edge with a red dashed line + badge
    var ctlN = nodeById('ctl-001'), prcN = nodeById('prc-001');
    var gapG = svgEl('g', { 'data-id': 'gap-indicator', opacity: '0' });
    gapG.style.cssText = 'transition:opacity 380ms ease;';

    if (ctlN && prcN) {
      gapG.appendChild(svgEl('line', {
        x1: ctlN.cx, y1: ctlN.cy, x2: prcN.cx, y2: prcN.cy,
        stroke: '#FF6B6B', 'stroke-width': '2.5', 'stroke-dasharray': '5,4'
      }));
    }

    // PROCESS GAP badge -- to the right of the ctl->prc edge
    gapG.appendChild(svgEl('rect', {
      x: '730', y: '227', width: '98', height: '22', rx: '5',
      fill: 'rgba(255,107,107,0.15)', stroke: '#FF6B6B', 'stroke-width': '1.5'
    }));
    var badgeT = svgEl('text', {
      x: '779', y: '238',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#FF6B6B', 'font-size': '11', 'font-weight': '700',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1'
    });
    badgeT.textContent = 'PROCESS GAP';
    gapG.appendChild(badgeT);

    svg.appendChild(gapG);

    // ── Second use-case token + REUSES SHARED CONTEXT label ──
    // Enters from upper-right edge and routes to illuminate shared nodes.
    // The full sentence is in the HTML footer strip below the scene.
    var reuseG = svgEl('g', { 'data-id': 'reuse-note', opacity: '0' });
    reuseG.style.cssText = 'transition:opacity 500ms ease;';

    // Small use-case token entering from right (positioned above the graph)
    reuseG.appendChild(svgEl('rect', {
      x: '950', y: '110', width: '68', height: '22', rx: '5',
      fill: 'rgba(85,199,232,0.15)', stroke: '#55C7E8', 'stroke-width': '1.5'
    }));
    var tok2T = svgEl('text', {
      x: '984', y: '121',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#55C7E8', 'font-size': '9', 'font-weight': '700',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.5'
    });
    tok2T.textContent = 'USE CASE 2';
    reuseG.appendChild(tok2T);

    // Connector from token to graph (dashed, towards reg-001 at cx=463, cy=200)
    reuseG.appendChild(svgEl('path', {
      d: 'M 950 121 C 800 121 600 180 475 200',
      stroke: '#55C7E8', 'stroke-width': '1.5',
      'stroke-dasharray': '5 3', fill: 'none', opacity: '0.6'
    }));

    // Short label below the token
    var rsLbl = svgEl('text', {
      x: '984', y: '144',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#55C7E8', 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.8'
    });
    rsLbl.textContent = 'REUSES SHARED CONTEXT';
    reuseG.appendChild(rsLbl);

    svg.appendChild(reuseG);

    root.appendChild(svg);
    container.appendChild(root);
  }

  // ── Animation actions ────────────────────────────────────────────────────
  function raf2(fn) {
    requestAnimationFrame(function() { requestAnimationFrame(fn); });
  }

  function showNodes() {
    var bg = get('graph-bg');
    if (bg) bg.setAttribute('opacity', '1');
    var oc = get('offchain-edges');
    if (oc) oc.setAttribute('opacity', '1');

    GRAPH_NODES.forEach(function(n, i) {
      _timers.push(setTimeout(function() {
        var el = get('node-' + n.id);
        if (el) raf2(function() { el.style.transform = 'scale(1)'; });
      }, i * 80));
    });
  }

  function drawChainEdges() {
    CHAIN_EDGES.forEach(function(e) {
      var el = get('chain-edge-' + e.from + '-' + e.to);
      if (el) raf2(function() { el.style.strokeDashoffset = '0'; });
    });
  }

  function revealField(id) {
    var g    = get('field-' + id);
    var conn = get('conn-' + id);
    if (g) {
      g.style.transform = 'translate(0,0)';
      g.style.opacity   = '1';
    }
    if (conn) conn.setAttribute('opacity', '1');
  }

  function setWorkOpacity(opacity) {
    var g = get('field-work');
    if (!g) return;
    g.style.transition = 'opacity 400ms ease';
    g.style.opacity = String(opacity);
  }

  function showGapIndicator(on) {
    var gapG = get('gap-indicator');
    if (gapG) gapG.setAttribute('opacity', on ? '1' : '0');
    // Dim the purple ctl->prc chain edge so red version reads clearly
    var chainEdge = get('chain-edge-ctl-001-prc-001');
    if (chainEdge) {
      chainEdge.setAttribute('stroke',
        on ? 'rgba(180,76,255,0)' : 'rgba(180,76,255,0.75)');
    }
  }

  function showAll() {
    var bg = get('graph-bg');
    if (bg) bg.setAttribute('opacity', '1');
    var oc = get('offchain-edges');
    if (oc) oc.setAttribute('opacity', '1');

    GRAPH_NODES.forEach(function(n) {
      var el = get('node-' + n.id);
      if (el) el.style.transform = 'scale(1)';
    });

    CHAIN_EDGES.forEach(function(e) {
      var el = get('chain-edge-' + e.from + '-' + e.to);
      if (el) el.style.strokeDashoffset = '0';
    });

    FIELDS.forEach(function(f) { revealField(f.id); });

    var reuseG = get('reuse-note');
    if (reuseG) reuseG.setAttribute('opacity', '1');
  }

  // ── Timeline steps ───────────────────────────────────────────────────────
  var _steps = [
    // 200ms  -- graph nodes scale in (staggered internally)
    { delay: 200,  run: function() { showNodes(); } },
    // 800ms  -- OBL-27 chain edges draw
    { delay: 800,  run: function() { drawChainEdges(); } },
    // 1600ms -- Work and decisions slides in from left
    { delay: 1600, run: function() { revealField('work'); } },
    // 2200ms -- Data and technology slides in from bottom-left
    { delay: 2200, run: function() { revealField('data'); } },
    // 2800ms -- People and roles slides in from bottom
    { delay: 2800, run: function() { revealField('people'); } },
    // 3400ms -- Governance and assurance slides in from right
    { delay: 3400, run: function() { revealField('governance'); } },
    // 4000ms -- Value and ownership slides in from bottom-right
    { delay: 4000, run: function() { revealField('value'); } },
    // 4800ms -- 1 second hold (no action needed; createTimeline continues)
    // 5800ms -- Failure demo: Work dims, process gap appears
    { delay: 5800, run: function() {
      setWorkOpacity(0.15);
      showGapIndicator(true);
    }},
    // 6600ms -- Restore: Work restores, gap fades
    { delay: 6600, run: function() {
      setWorkOpacity(1);
      showGapIndicator(false);
    }},
    // 7200ms -- Reuse insight text
    { delay: 7200, run: function() {
      var reuseG = get('reuse-note');
      if (reuseG) reuseG.setAttribute('opacity', '1');
    }}
  ];

  // ── Public interface ─────────────────────────────────────────────────────
  return {
    play: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      loadGraphData();
      build();
      if (reduced) { showAll(); return; }
      _tl = createTimeline(_steps);
      _tl.play();
    },

    pause: function() {
      if (_tl) _tl.pause();
    },

    resume: function() {
      if (_tl) _tl.resume();
    },

    reset: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      loadGraphData();
      build();
      _tl = createTimeline(_steps);
      _tl.reset();
    },

    finish: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      loadGraphData();
      build();
      showAll();
    },

    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
    }
  };
});
