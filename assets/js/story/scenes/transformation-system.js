// Scene: transformation-system (Screen 05 - WHERE IT APPLIES)
// V16 overhaul: knowledge graph as centre + five systems around it.
// Sequence: expand graph from obligation -> assemble systems -> show reuse.
SceneDirector.register('transformation-system', function(container, manifest, reduced) {

  var GRAPH_DATA_URL = './assets/data/context-graph/regulation-coverage.json';

  var systems = [
    { id: 'work',       label: 'Work and decisions',      color: 'var(--cyan)',   nodeIds: ['prc-001'] },
    { id: 'data',       label: 'Data and technology',     color: 'var(--accent)', nodeIds: ['sys-001'] },
    { id: 'people',     label: 'People and roles',        color: 'var(--amber)',  nodeIds: ['own-001'] },
    { id: 'governance', label: 'Governance and assurance',color: 'var(--green)',  nodeIds: ['ctl-001','evd-001'] },
    { id: 'value',      label: 'Value and ownership',     color: 'var(--pink)',   nodeIds: ['evd-001','iss-001'] }
  ];

  var _graph = null;
  var _graphData = null;
  var _loaded = false;

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

  function buildFallback() {
    // Fallback: card grid if graph data unavailable
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';
    var token = document.createElement('div');
    token.className = 'scene-node';
    token.dataset.beat = 'token';
    token.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:12px;padding:8px 14px;'
      + 'background:rgba(180,76,255,.07);border:1px solid rgba(180,76,255,.3);border-radius:6px;';
    token.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--accent)">OBL-27</span>'
      + '<span style="font-size:14px;color:var(--border-2)">&#8594;</span>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-2)">'
      + 'One use case. Five systems that may need to move together.'
      + '</span>';
    outer.appendChild(token);
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:8px;flex:1;min-height:0;';
    systems.forEach(function(sys) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'sys-' + sys.id;
      card.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:14px 12px;'
        + 'background:var(--surface-1);border:1px solid ' + sys.color + ';border-radius:10px;';
      card.innerHTML = '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1);line-height:1.2">'
        + sys.label + '</span>';
      row.appendChild(card);
    });
    outer.appendChild(row);
    container.appendChild(outer);
  }

  function buildWithGraph(graphData) {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:8px 14px;';

    // OBL-27 token bar
    var token = document.createElement('div');
    token.className = 'scene-node';
    token.dataset.beat = 'token';
    token.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:12px;padding:7px 12px;'
      + 'background:rgba(180,76,255,.07);border:1px solid rgba(180,76,255,.3);border-radius:6px;';
    token.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--accent)">OBL-27</span>'
      + '<span style="font-size:14px;color:var(--border-2)">&#8594;</span>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-2)">'
      + 'One obligation. Nine connected objects. Five systems that may need to move together.'
      + '</span>';
    outer.appendChild(token);

    // Two-column layout: graph (left 55%) + systems (right 45%)
    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:55% 45%;gap:12px;flex:1;min-height:0;';

    // Left: knowledge graph container
    var graphWrap = document.createElement('div');
    graphWrap.className = 'scene-node kg-container';
    graphWrap.dataset.beat = 'graph';
    graphWrap.style.cssText = 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:10px;overflow:hidden;height:100%;position:relative;';

    var graphInner = document.createElement('div');
    graphInner.style.cssText = 'width:100%;height:100%;';
    graphWrap.appendChild(graphInner);
    cols.appendChild(graphWrap);

    // Right: five system cards
    var systemsCol = document.createElement('div');
    systemsCol.style.cssText = 'display:flex;flex-direction:column;gap:5px;overflow:hidden;';

    var sysHdr = document.createElement('div');
    sysHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);padding:2px 0 4px;flex-shrink:0;';
    sysHdr.textContent = 'Five systems that may move';
    systemsCol.appendChild(sysHdr);

    systems.forEach(function(sys) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'sys-' + sys.id;
      card.style.cssText = 'flex:1;display:flex;align-items:center;gap:8px;padding:8px 10px;'
        + 'background:var(--surface-1);border:1px solid ' + sys.color + ';border-radius:8px;min-height:0;';
      card.innerHTML =
        '<div style="width:8px;height:8px;border-radius:50%;background:' + sys.color + ';flex-shrink:0"></div>'
        + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1);line-height:1.2">' + sys.label + '</span>';
      systemsCol.appendChild(card);
    });
    cols.appendChild(systemsCol);
    outer.appendChild(cols);

    // Reuse note (appears last)
    var reuseNote = document.createElement('div');
    reuseNote.className = 'scene-node';
    reuseNote.dataset.beat = 'reuse';
    reuseNote.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:6px 12px;'
      + 'background:rgba(85,199,232,.06);border:1px solid var(--cyan);border-radius:6px;';
    reuseNote.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--cyan);flex-shrink:0">Context reuse</span>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2)">A second use case enters the same graph -- regulation, policy and control nodes already exist. Only the process and evidence differ.</span>';
    outer.appendChild(reuseNote);

    container.appendChild(outer);

    // Initialise graph renderer
    if (typeof KnowledgeGraph !== 'undefined') {
      _graph = KnowledgeGraph.create(graphInner, graphData);
    }
  }

  function build(cb) {
    if (reduced) {
      buildFallback();
      if (cb) cb(false);
      return;
    }
    loadGraph(function(data) {
      if (data) {
        buildWithGraph(data);
        if (cb) cb(true);
      } else {
        buildFallback();
        if (cb) cb(false);
      }
    });
  }

  // Graph animation sequence
  var GRAPH_SEQUENCE = [
    // Beat 0: show regulation + obligation
    { nodeIds: ['reg-001','obl-001'], edgeIds: [] },
    // Beat 1: add policy + control
    { nodeIds: ['pol-001','ctl-001'], edgeIds: ['reg-001-obl-001','obl-001-pol-001','pol-001-ctl-001'] },
    // Beat 2: add process + system + owner
    { nodeIds: ['prc-001','sys-001','own-001'], edgeIds: ['ctl-001-prc-001','prc-001-sys-001','prc-001-own-001'] },
    // Beat 3: add evidence
    { nodeIds: ['evd-001'], edgeIds: ['prc-001-evd-001'] },
    // Beat 4: add issue
    { nodeIds: ['iss-001'], edgeIds: ['evd-001-iss-001'] }
  ];

  var _tl = null;

  function makeSteps(hasGraph) {
    var steps = [
      { delay: 300, run: function() {
        var t = container.querySelector('[data-beat="token"]');
        if (t) t.classList.add('visible');
      }},
      { delay: 700, run: function() {
        var g = container.querySelector('[data-beat="graph"]');
        if (g) g.classList.add('visible');
        if (hasGraph && _graph) {
          // Show regulation and obligation
          _graph.showNode('reg-001').showNode('obl-001');
          _graph.showEdge('reg-001', 'obl-001');
        }
      }},
      { delay: 1400, run: function() {
        if (hasGraph && _graph) {
          _graph.showNode('pol-001').showNode('ctl-001');
          _graph.showEdge('obl-001', 'pol-001').showEdge('pol-001', 'ctl-001');
        }
      }},
      { delay: 2200, run: function() {
        if (hasGraph && _graph) {
          _graph.showNode('prc-001').showNode('sys-001').showNode('own-001');
          _graph.showEdge('ctl-001', 'prc-001').showEdge('prc-001', 'sys-001').showEdge('prc-001', 'own-001');
        }
        // First system card appears
        var s = container.querySelector('[data-beat="sys-work"]');
        if (s) s.classList.add('visible');
      }},
      { delay: 2900, run: function() {
        var s = container.querySelector('[data-beat="sys-data"]');
        if (s) s.classList.add('visible');
      }},
      { delay: 3500, run: function() {
        if (hasGraph && _graph) {
          _graph.showNode('evd-001').showEdge('prc-001', 'evd-001');
        }
        var s = container.querySelector('[data-beat="sys-people"]');
        if (s) s.classList.add('visible');
      }},
      { delay: 4100, run: function() {
        if (hasGraph && _graph) {
          _graph.showNode('iss-001').showEdge('evd-001', 'iss-001');
          _graph.highlightPath(['reg-001','obl-001','pol-001','ctl-001','prc-001','evd-001']);
        }
        var s = container.querySelector('[data-beat="sys-governance"]');
        if (s) s.classList.add('visible');
      }},
      { delay: 4700, run: function() {
        var s = container.querySelector('[data-beat="sys-value"]');
        if (s) s.classList.add('visible');
      }},
      { delay: 5500, run: function() {
        if (hasGraph && _graph) {
          _graph.showReuseIndicator(['prc-001','evd-001']);
        }
        var r = container.querySelector('[data-beat="reuse"]');
        if (r) r.classList.add('visible');
      }}
    ];
    return steps;
  }

  // Async play: load graph data first, then start timeline
  function play() {
    build(function(hasGraph) {
      _tl = createTimeline(makeSteps(hasGraph));
      _tl.play();
    });
  }

  function finish() {
    build(function(hasGraph) {
      // Show all nodes
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
      if (hasGraph && _graph) {
        _graph.showAll();
        _graph.highlightPath(['reg-001','obl-001','pol-001','ctl-001','prc-001','evd-001']);
        _graph.showReuseIndicator(['prc-001','evd-001']);
      }
    });
  }

  return {
    play:   play,
    pause:  function() { if (_tl) _tl.pause(); },
    resume: function() { if (_tl) _tl.resume(); },
    reset:  function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _graph = null;
      build(function(hasGraph) {});
    },
    finish:  finish,
    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _graph = null;
      container.innerHTML = '';
    }
  };
});
