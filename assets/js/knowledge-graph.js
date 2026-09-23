// knowledge-graph.js -- V16 deterministic executive knowledge graph
// Renders a fixed-position SVG graph using D3 for path drawing only.
// No force simulation. Positions determined by row/col in the data.
// Usage: KnowledgeGraph.create(container, graphData, options)
(function(global) {
  'use strict';

  var TYPE_COLORS = {
    regulation: 'var(--cyan)',
    obligation: 'var(--accent)',
    policy:     'var(--accent)',
    control:    'var(--green)',
    process:    'var(--cyan)',
    system:     'var(--text-3)',
    owner:      'var(--amber)',
    evidence:   'var(--green)',
    issue:      'var(--pink)'
  };

  var STATUS_DASH = {
    'source-backed': null,
    'illustrative':  '4 3',
    'hypothesis':    '2 3',
    'client-evidence': null
  };

  function getColor(type) {
    return TYPE_COLORS[type] || 'var(--text-3)';
  }

  // Resolve CSS variable to its computed value (fallback to hex)
  var COLOR_FALLBACKS = {
    'var(--cyan)':    '#55C7E8',
    'var(--accent)':  '#B44CFF',
    'var(--green)':   '#58C994',
    'var(--amber)':   '#F3B34C',
    'var(--pink)':    '#F0758A',
    'var(--text-3)':  '#A4A9B7',
    'var(--border-1)':'#343949'
  };

  function resolveColor(cssVar) {
    return COLOR_FALLBACKS[cssVar] || cssVar;
  }

  var GRID = {
    paddingX:  60,
    paddingY:  40,
    colWidth:  160,
    rowHeight: 100,
    nodeW:     130,
    nodeH:      52,
    nodeR:       8
  };

  function nodeX(col) {
    return GRID.paddingX + col * GRID.colWidth + (GRID.colWidth - GRID.nodeW) / 2;
  }

  function nodeY(row) {
    return GRID.paddingY + row * GRID.rowHeight;
  }

  function nodeCX(col) {
    return nodeX(col) + GRID.nodeW / 2;
  }

  function nodeCY(row) {
    return nodeY(row) + GRID.nodeH / 2;
  }

  function totalWidth(graph) {
    var maxCol = 0;
    graph.nodes.forEach(function(n) { if (n.col > maxCol) maxCol = n.col; });
    return GRID.paddingX * 2 + (maxCol + 1) * GRID.colWidth;
  }

  function totalHeight(graph) {
    var maxRow = 0;
    graph.nodes.forEach(function(n) { if (n.row > maxRow) maxRow = n.row; });
    return GRID.paddingY * 2 + (maxRow + 1) * GRID.rowHeight;
  }

  // Build a straight-line or elbow path between two nodes
  function edgePath(srcNode, tgtNode) {
    var x1 = nodeCX(srcNode.col);
    var y1 = nodeCY(srcNode.row);
    var x2 = nodeCX(tgtNode.col);
    var y2 = nodeCY(tgtNode.row);

    // Adjust start/end to node border
    if (srcNode.row === tgtNode.row) {
      // Same row: horizontal
      x1 = nodeX(srcNode.col) + GRID.nodeW;
      x2 = nodeX(tgtNode.col);
      y1 = nodeCY(srcNode.row);
      y2 = nodeCY(tgtNode.row);
      return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
    } else {
      // Different rows: elbow path
      var midY = (y1 + y2) / 2;
      return 'M ' + x1 + ' ' + y1
        + ' L ' + x1 + ' ' + midY
        + ' L ' + x2 + ' ' + midY
        + ' L ' + x2 + ' ' + y2;
    }
  }

  function KnowledgeGraph() {}

  KnowledgeGraph.prototype.create = function(container, graphData, options) {
    options = options || {};
    var self = this;
    self._container = container;
    self._data = graphData;
    self._options = options;
    self._nodeEls = {};
    self._edgeEls = {};
    self._svg = null;
    self._build();
    return self;
  };

  KnowledgeGraph.prototype._build = function() {
    var self = this;
    var graph = self._data;
    var w = totalWidth(graph);
    var h = totalHeight(graph);

    // SVG element
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('class', 'kg-svg');
    svg.style.cssText = 'width:100%;height:100%;overflow:visible;';
    self._svg = svg;

    // Defs: arrowhead marker
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'kg-arrow-' + (self._uid = Math.random().toString(36).slice(2)));
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', '0 0, 8 3, 0 6');
    poly.setAttribute('fill', resolveColor('var(--border-1)'));
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Row labels
    var rowLabels = ['Business meaning', 'Operating execution', 'Assurance'];
    var rowRows = [0, 1, 2];
    rowRows.forEach(function(row) {
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '6');
      label.setAttribute('y', (nodeCY(row)).toString());
      label.setAttribute('class', 'kg-row-label');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('text-anchor', 'start');
      label.textContent = rowLabels[row] || '';
      svg.appendChild(label);
    });

    // Edges
    var nodeMap = {};
    graph.nodes.forEach(function(n) { nodeMap[n.id] = n; });

    graph.edges.forEach(function(edge, i) {
      var src = nodeMap[edge.source];
      var tgt = nodeMap[edge.target];
      if (!src || !tgt) return;

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', edgePath(src, tgt));
      path.setAttribute('class', 'kg-edge kg-hidden');
      path.dataset = path.dataset || {};
      path.setAttribute('data-edge-id', edge.source + '-' + edge.target);
      path.setAttribute('stroke', resolveColor('var(--border-1)'));
      path.setAttribute('stroke-width', '1.5');
      var dash = STATUS_DASH[edge.status];
      if (dash) path.setAttribute('stroke-dasharray', dash);
      path.setAttribute('marker-end', 'url(#kg-arrow-' + self._uid + ')');
      path.style.cssText = 'transition:opacity 400ms ease,stroke 300ms ease;';
      svg.appendChild(path);
      self._edgeEls[edge.source + '-' + edge.target] = path;
    });

    // Nodes
    graph.nodes.forEach(function(node) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'kg-node kg-type-' + node.type + ' kg-hidden');
      g.setAttribute('data-node-id', node.id);
      g.style.cssText = 'transition:opacity 400ms ease;';

      var x = nodeX(node.col);
      var y = nodeY(node.row);
      var color = resolveColor(getColor(node.type));

      // Node rect
      var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', GRID.nodeW.toString());
      rect.setAttribute('height', GRID.nodeH.toString());
      rect.setAttribute('rx', GRID.nodeR.toString());
      rect.setAttribute('fill', 'var(--surface-1, #191C25)');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('class', 'kg-node-body');
      g.appendChild(rect);

      // Node label
      var labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelEl.setAttribute('x', (x + GRID.nodeW / 2).toString());
      labelEl.setAttribute('y', (y + 20).toString());
      labelEl.setAttribute('class', 'kg-node-label');
      labelEl.setAttribute('text-anchor', 'middle');
      labelEl.setAttribute('dominant-baseline', 'middle');
      labelEl.setAttribute('fill', color);
      labelEl.textContent = node.label;
      g.appendChild(labelEl);

      // Sub-label
      var subEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      subEl.setAttribute('x', (x + GRID.nodeW / 2).toString());
      subEl.setAttribute('y', (y + 37).toString());
      subEl.setAttribute('class', 'kg-node-sublabel');
      subEl.setAttribute('text-anchor', 'middle');
      subEl.setAttribute('dominant-baseline', 'middle');
      subEl.textContent = node.sublabel;
      g.appendChild(subEl);

      // Provenance dot (top-right corner)
      var statusColors = {
        'source-backed':    resolveColor('var(--green)'),
        'illustrative':     resolveColor('var(--amber)'),
        'hypothesis':       resolveColor('var(--text-3)'),
        'client-evidence':  resolveColor('var(--cyan)')
      };
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', (x + GRID.nodeW - 8).toString());
      dot.setAttribute('cy', (y + 8).toString());
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', statusColors[node.status] || resolveColor('var(--text-3)'));
      dot.setAttribute('class', 'kg-provenance');
      g.appendChild(dot);

      svg.appendChild(g);
      self._nodeEls[node.id] = g;
    });

    self._container.innerHTML = '';
    self._container.appendChild(svg);
  };

  // Show a node (remove kg-hidden)
  KnowledgeGraph.prototype.showNode = function(nodeId) {
    var el = this._nodeEls[nodeId];
    if (el) { el.classList.remove('kg-hidden'); el.classList.remove('kg-dim'); }
    return this;
  };

  // Show an edge
  KnowledgeGraph.prototype.showEdge = function(srcId, tgtId) {
    var el = this._edgeEls[srcId + '-' + tgtId];
    if (el) { el.classList.remove('kg-hidden'); el.classList.remove('kg-dim'); }
    return this;
  };

  // Dim all except given node IDs
  KnowledgeGraph.prototype.dimExcept = function(nodeIds) {
    var self = this;
    Object.keys(self._nodeEls).forEach(function(id) {
      var el = self._nodeEls[id];
      if (nodeIds.indexOf(id) === -1) {
        el.classList.add('kg-dim');
      } else {
        el.classList.remove('kg-dim');
      }
    });
    return self;
  };

  // Highlight a specific path (array of node IDs in sequence)
  KnowledgeGraph.prototype.highlightPath = function(nodeIds, color) {
    var self = this;
    color = color || resolveColor('var(--accent)');
    for (var i = 0; i < nodeIds.length - 1; i++) {
      var el = self._edgeEls[nodeIds[i] + '-' + nodeIds[i + 1]];
      if (el) {
        el.setAttribute('stroke', color);
        el.setAttribute('stroke-width', '2.5');
        el.classList.add('kg-active');
      }
    }
    return self;
  };

  // Show all nodes and edges
  KnowledgeGraph.prototype.showAll = function() {
    var self = this;
    Object.keys(self._nodeEls).forEach(function(id) {
      self._nodeEls[id].classList.remove('kg-hidden');
      self._nodeEls[id].classList.remove('kg-dim');
    });
    Object.keys(self._edgeEls).forEach(function(id) {
      self._edgeEls[id].classList.remove('kg-hidden');
      self._edgeEls[id].classList.remove('kg-dim');
    });
    return self;
  };

  // Show second use case indicator on specified nodes
  KnowledgeGraph.prototype.showReuseIndicator = function(nodeIds) {
    var self = this;
    nodeIds.forEach(function(id) {
      var el = self._nodeEls[id];
      if (!el) return;
      var rect = el.querySelector('rect');
      if (rect) {
        rect.setAttribute('stroke-width', '3');
        rect.setAttribute('stroke-dasharray', '5 3');
      }
    });
    return self;
  };

  // Static factory
  KnowledgeGraph.create = function(container, graphData, options) {
    return new KnowledgeGraph().create(container, graphData, options);
  };

  global.KnowledgeGraph = KnowledgeGraph;

}(typeof window !== 'undefined' ? window : this));
