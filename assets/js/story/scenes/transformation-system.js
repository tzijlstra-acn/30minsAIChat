// Scene: transformation-system (Screen 05 - WHERE IT APPLIES)
// V17: deterministic hub-and-spoke SVG, no async XHR dependency.
// Static hub is built synchronously at play(); nodes revealed sequentially.
// No blank state possible. Knowledge graph overlay attempted after hub is stable.
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

  // Lines: [ [x1,y1], [x2,y2] ] from system node edge to centre rect edge
  var HUB_LINES = [
    { id: 'line-work',       from: [230, 90],  to: [250, 185] },
    { id: 'line-data',       from: [230, 310], to: [250, 225] },
    { id: 'line-governance', from: [570, 90],  to: [550, 185] },
    { id: 'line-value',      from: [570, 310], to: [550, 225] },
    { id: 'line-people',     from: [400, 340], to: [400, 260] }
  ];

  var _graphData = null;

  function loadGraph(cb) {
    if (_graphData) { cb(_graphData); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', GRAPH_DATA_URL);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try { _graphData = JSON.parse(xhr.responseText); } catch(e) { _graphData = null; }
      }
      cb(_graphData);
    };
    xhr.onerror = function() { cb(null); };
    xhr.send();
  }

  function buildHub() {
    container.innerHTML = '';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.cssText = 'width:100%;height:100%;display:block;';

    // Connector lines (start hidden, revealed with their node)
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

    // Centre rect (beat: 'centre')
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
    cSub.textContent = 'One obligation -- nine connected objects';
    centreG.appendChild(cSub);
    var cBadge = svgEl('text', {
      x: cx + cw / 2, y: cy + 94,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'var(--text-3,#71758A)', 'font-size': '10',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5'
    });
    cBadge.textContent = 'OBL-27 -- ILLUSTRATIVE';
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
      // Colour accent strip
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

    // Reuse note (beat: 'reuse')
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
    reuseT.textContent = 'A second use case enters the same graph -- regulation, policy and control nodes already exist';
    reuseG.appendChild(reuseT);
    svg.appendChild(reuseG);

    container.appendChild(svg);
  }

  function show(beat) {
    var el = container.querySelector('[data-beat="' + beat + '"]');
    if (el) el.setAttribute('opacity', '1');
  }

  function showAll() {
    ['centre', 'line-work', 'node-work', 'line-data', 'node-data',
     'line-governance', 'node-governance', 'line-value', 'node-value',
     'line-people', 'node-people', 'reuse'].forEach(show);
  }

  var steps = [
    { delay: 300,  run: function() { show('centre'); }},
    { delay: 900,  run: function() { show('line-work');       show('node-work'); }},
    { delay: 1500, run: function() { show('line-data');       show('node-data'); }},
    { delay: 2100, run: function() { show('line-governance'); show('node-governance'); }},
    { delay: 2700, run: function() { show('line-value');      show('node-value'); }},
    { delay: 3300, run: function() { show('line-people');     show('node-people'); }},
    { delay: 4200, run: function() { show('reuse'); }}
  ];

  var _tl = null;

  return {
    play: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      buildHub();
      if (reduced) {
        showAll();
        return;
      }
      _tl = createTimeline(steps);
      _tl.play();
    },
    pause:  function() { if (_tl) _tl.pause(); },
    resume: function() { if (_tl) _tl.resume(); },
    reset:  function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      buildHub();
      _tl = createTimeline(steps);
      _tl.reset();
    },
    finish: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      buildHub();
      showAll();
    },
    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      container.innerHTML = '';
    }
  };
});
