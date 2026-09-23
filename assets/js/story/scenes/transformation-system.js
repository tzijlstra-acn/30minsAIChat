// Scene: transformation-system (Screen 05 - WHERE IT APPLIES)
// V19: hub-and-spoke reveals five system categories, then the OBL-27 knowledge
// graph overlay fades in showing all nine connected objects from regulation-coverage.json.
SceneDirector.register('transformation-system', function(container, manifest, reduced) {

  var GRAPH_DATA_URL = './assets/data/context-graph/regulation-coverage.json';

  // Hub layout -- ViewBox 0 0 800 400
  var HUB_CENTER = { x: 250, y: 140, w: 300, h: 120 };

  var HUB_NODES = [
    { id: 'work',       label: 'Work and decisions',       color: '#55C7E8', x: 30,  y: 50,  w: 200, h: 80  },
    { id: 'data',       label: 'Data and technology',      color: '#B44CFF', x: 30,  y: 270, w: 200, h: 80  },
    { id: 'governance', label: 'Governance and assurance', color: '#58C994', x: 570, y: 50,  w: 200, h: 80  },
    { id: 'value',      label: 'Value and ownership',      color: '#F0758A', x: 570, y: 270, w: 200, h: 80  },
    { id: 'people',     label: 'People and roles',         color: '#F3B34C', x: 250, y: 340, w: 300, h: 60  }
  ];

  var HUB_LINES = [
    { id: 'line-work',       from: [230, 90],  to: [250, 185] },
    { id: 'line-data',       from: [230, 310], to: [250, 225] },
    { id: 'line-governance', from: [570, 90],  to: [550, 185] },
    { id: 'line-value',      from: [570, 310], to: [550, 225] },
    { id: 'line-people',     from: [400, 340], to: [400, 260] }
  ];

  var _graphData = null;
  var _xhr = null;

  // Fire-and-forget prefetch; populates _graphData when the XHR resolves.
  function prefetchGraph() {
    if (_graphData || _xhr) return;
    _xhr = new XMLHttpRequest();
    _xhr.open('GET', GRAPH_DATA_URL);
    _xhr.onload = function() {
      if (_xhr.status === 200) {
        try { _graphData = JSON.parse(_xhr.responseText); } catch(e) {}
      }
      _xhr = null;
    };
    _xhr.onerror = function() { _xhr = null; };
    _xhr.send();
  }

  // Node type colours -- pitch palette
  var TYPE_COLORS = {
    regulation: '#FF6B6B', obligation: '#B44CFF', policy: '#55C7E8',
    control: '#58C994',    process: '#F3B34C',    system: '#74B9FF',
    owner: '#F0758A',      evidence: '#00CEC9',   issue: '#A29BFE'
  };

  // Nodes on the main OBL-27 causal chain (highlighted in the graph overlay)
  var OBL_CHAIN = {
    'reg-001': true, 'obl-001': true, 'pol-001': true, 'ctl-001': true,
    'prc-001': true, 'evd-001': true, 'iss-001': true
  };

  function buildHub() {
    container.innerHTML = '';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.cssText = 'width:100%;height:100%;display:block;';

    // Connector lines (revealed with their node)
    HUB_LINES.forEach(function(line) {
      var l = svgEl('line', {
        'data-beat': line.id,
        x1: line.from[0], y1: line.from[1],
        x2: line.to[0],   y2: line.to[1],
        stroke: 'var(--border-1,#343949)', 'stroke-width': '1.5', opacity: '0'
      });
      l.style.cssText = 'transition:opacity 350ms ease;';
      svg.appendChild(l);
    });

    // Centre rect
    var cx = HUB_CENTER.x, cy = HUB_CENTER.y, cw = HUB_CENTER.w, ch = HUB_CENTER.h;
    var centreG = svgEl('g', { 'data-beat': 'centre', opacity: '0' });
    centreG.style.cssText = 'transition:opacity 400ms ease;';
    centreG.appendChild(svgEl('rect', {
      x: cx, y: cy, width: cw, height: ch, rx: '10',
      fill: 'rgba(180,76,255,.07)', stroke: 'rgba(180,76,255,.5)', 'stroke-width': '2'
    }));
    var cLabel = svgEl('text', {
      x: cx + cw / 2, y: cy + 42,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#B44CFF', 'font-size': '17',
      'font-family': 'Space Grotesk,sans-serif', 'font-weight': '700'
    });
    cLabel.textContent = 'Regulation Coverage';
    centreG.appendChild(cLabel);
    var cSub = svgEl('text', {
      x: cx + cw / 2, y: cy + 70,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'var(--text-2,#A4A9B7)', 'font-size': '13',
      'font-family': 'Space Grotesk,sans-serif'
    });
    cSub.textContent = 'One obligation — nine connected objects';
    centreG.appendChild(cSub);
    var cBadge = svgEl('text', {
      x: cx + cw / 2, y: cy + 94,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'var(--text-3,#71758A)', 'font-size': '10',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5'
    });
    cBadge.textContent = 'OBL-27 — ILLUSTRATIVE';
    centreG.appendChild(cBadge);
    svg.appendChild(centreG);

    // System node groups
    HUB_NODES.forEach(function(n) {
      var g = svgEl('g', { 'data-beat': 'node-' + n.id, opacity: '0' });
      g.style.cssText = 'transition:opacity 400ms ease;';
      g.appendChild(svgEl('rect', {
        x: n.x, y: n.y, width: n.w, height: n.h, rx: '8',
        fill: 'var(--surface-1,#191C25)', stroke: n.color, 'stroke-width': '1.5'
      }));
      g.appendChild(svgEl('rect', {
        x: n.x, y: n.y, width: n.w, height: '4', rx: '8',
        fill: n.color, opacity: '0.6'
      }));
      var nLabel = svgEl('text', {
        x: n.x + n.w / 2, y: n.y + n.h / 2,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: 'var(--text-1,#E8E9F0)', 'font-size': '14',
        'font-family': 'Space Grotesk,sans-serif', 'font-weight': '700'
      });
      nLabel.textContent = n.label;
      g.appendChild(nLabel);
      svg.appendChild(g);
    });

    // Empty placeholder for knowledge graph overlay (populated by renderGraph)
    svg.appendChild(svgEl('g', { 'data-beat': 'graph', opacity: '0' }));

    // Reuse note banner
    var reuseG = svgEl('g', { 'data-beat': 'reuse', opacity: '0' });
    reuseG.style.cssText = 'transition:opacity 400ms ease;';
    reuseG.appendChild(svgEl('rect', {
      x: '0', y: '378', width: '800', height: '22', rx: '4',
      fill: 'rgba(85,199,232,.05)', stroke: 'rgba(85,199,232,.25)', 'stroke-width': '1'
    }));
    var reuseT = svgEl('text', {
      x: '400', y: '389',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#55C7E8', 'font-size': '11',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1'
    });
    reuseT.textContent = 'A second use case enters the same graph — regulation, policy and control nodes already exist';
    reuseG.appendChild(reuseT);
    svg.appendChild(reuseG);

    container.appendChild(svg);
  }

  function show(beat) {
    var el = container.querySelector('[data-beat="' + beat + '"]');
    if (el) el.setAttribute('opacity', '1');
  }

  // Render the knowledge graph overlay from regulation-coverage.json data.
  // instant=true skips the CSS fade transition (used by finish/showAll paths).
  function renderGraph(instant) {
    if (!_graphData) return;
    var svg = container.querySelector('svg');
    if (!svg) return;

    var data = _graphData;

    // Remove existing graph group (placeholder or prior render)
    var existing = container.querySelector('[data-beat="graph"]');
    if (existing) { existing.parentNode.removeChild(existing); }

    var graphG = svgEl('g', { 'data-beat': 'graph', opacity: instant ? '1' : '0' });
    if (!instant) { graphG.style.cssText = 'transition:opacity 700ms ease;'; }

    // Dark overlay panel -- covers the hub centre so the graph reads clearly
    graphG.appendChild(svgEl('rect', {
      x: '130', y: '12', width: '540', height: '345', rx: '12',
      fill: 'rgba(13,15,22,0.93)', stroke: 'rgba(180,76,255,0.45)', 'stroke-width': '1.5'
    }));

    // Panel title
    var panelTitle = svgEl('text', {
      x: '400', y: '36',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#B44CFF', 'font-size': '12', 'font-weight': '700',
      'font-family': 'Space Grotesk,sans-serif'
    });
    panelTitle.textContent = 'OBL-27 — nine connected objects';
    graphG.appendChild(panelTitle);

    // Grid layout driven by row/col from JSON (cols 0-3, rows 0-2)
    // Usable area inside panel: x 148-668, y 52-348
    var G_LEFT = 148, G_TOP = 52, COL_W = 121, ROW_H = 88;
    var N_W = 80, N_H = 50;

    function nodeX(col) { return G_LEFT + col * COL_W + N_W / 2; }
    function nodeY(row) { return G_TOP + row * ROW_H + N_H / 2; }

    // Index nodes by id for fast edge lookup
    var nodeById = {};
    data.nodes.forEach(function(n) { nodeById[n.id] = n; });

    // Draw edges first (rendered behind node rects)
    data.edges.forEach(function(edge) {
      var src = nodeById[edge.source], tgt = nodeById[edge.target];
      if (!src || !tgt) return;
      var highlighted = OBL_CHAIN[src.id] && OBL_CHAIN[tgt.id];
      graphG.appendChild(svgEl('line', {
        x1: nodeX(src.col), y1: nodeY(src.row),
        x2: nodeX(tgt.col), y2: nodeY(tgt.row),
        stroke: highlighted ? 'rgba(180,76,255,0.65)' : 'rgba(164,169,183,0.2)',
        'stroke-width': highlighted ? '2' : '1',
        'stroke-dasharray': highlighted ? '' : '4,4'
      }));
    });

    // Draw nodes
    data.nodes.forEach(function(node) {
      var cx = nodeX(node.col), cy = nodeY(node.row);
      var color = TYPE_COLORS[node.type] || '#A4A9B7';
      var isObl  = node.id === 'obl-001';
      var onChain = !!OBL_CHAIN[node.id];

      var ng = svgEl('g', {});

      ng.appendChild(svgEl('rect', {
        x: cx - N_W / 2, y: cy - N_H / 2, width: N_W, height: N_H, rx: '6',
        fill: isObl ? 'rgba(180,76,255,0.18)' : 'rgba(22,25,35,0.95)',
        stroke: color,
        'stroke-width': isObl ? '2.5' : (onChain ? '1.5' : '1'),
        opacity: onChain ? '1' : '0.5'
      }));

      // Colour accent strip along top edge for chain nodes
      if (onChain) {
        ng.appendChild(svgEl('rect', {
          x: cx - N_W / 2, y: cy - N_H / 2, width: N_W, height: '3', rx: '6',
          fill: color, opacity: '0.85'
        }));
      }

      var lt = svgEl('text', {
        x: cx, y: cy - 7,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: onChain ? color : 'var(--text-3,#71758A)',
        'font-size': '11', 'font-weight': '700',
        'font-family': 'Space Grotesk,sans-serif'
      });
      lt.textContent = node.label;
      ng.appendChild(lt);

      var sub = node.sublabel || '';
      var st = svgEl('text', {
        x: cx, y: cy + 9,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: 'rgba(113,117,138,0.8)', 'font-size': '8',
        'font-family': 'JetBrains Mono,monospace'
      });
      st.textContent = sub.length > 22 ? sub.substring(0, 20) + '…' : sub;
      ng.appendChild(st);

      graphG.appendChild(ng);
    });

    // Insert before reuse banner so graph renders above hub but below reuse note
    var reuseEl = container.querySelector('[data-beat="reuse"]');
    if (reuseEl) { svg.insertBefore(graphG, reuseEl); } else { svg.appendChild(graphG); }

    // For animated path: double rAF ensures CSS transition fires after paint
    if (!instant) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var el = container.querySelector('[data-beat="graph"]');
          if (el) el.setAttribute('opacity', '1');
        });
      });
    }
  }

  function showAll() {
    ['centre', 'line-work', 'node-work', 'line-data', 'node-data',
     'line-governance', 'node-governance', 'line-value', 'node-value',
     'line-people', 'node-people', 'reuse'].forEach(show);
    renderGraph(true);
  }

  var steps = [
    { delay: 300,  run: function() { show('centre'); }},
    { delay: 900,  run: function() { show('line-work');       show('node-work'); }},
    { delay: 1500, run: function() { show('line-data');       show('node-data'); }},
    { delay: 2100, run: function() { show('line-governance'); show('node-governance'); }},
    { delay: 2700, run: function() { show('line-value');      show('node-value'); }},
    { delay: 3300, run: function() { show('line-people');     show('node-people'); }},
    { delay: 3900, run: function() { renderGraph(false); }},
    { delay: 4500, run: function() { show('reuse'); }}
  ];

  var _tl = null;

  return {
    play: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      prefetchGraph(); // starts fetching immediately; resolves well before 3900ms step
      buildHub();
      if (reduced) { showAll(); return; }
      _tl = createTimeline(steps);
      _tl.play();
    },
    pause:  function() { if (_tl) _tl.pause(); },
    resume: function() { if (_tl) _tl.resume(); },
    reset:  function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      prefetchGraph();
      buildHub();
      _tl = createTimeline(steps);
      _tl.reset();
    },
    finish: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      prefetchGraph();
      buildHub();
      showAll();
    },
    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      if (_xhr) { try { _xhr.abort(); } catch(e) {} _xhr = null; }
      container.innerHTML = '';
    }
  };
});
