// Scene: scale-architecture (Screen 08 - HOW TO SCALE)
// V16: PROOF -> PRODUCTION -> REUSE with knowledge graph as shared context layer.
// Shared context layer sits between the columns. Failure/resolution demo preserved.
SceneDirector.register('scale-architecture', function(container, manifest, reduced) {

  var GRAPH_DATA_URL = './assets/data/context-graph/regulation-coverage.json';

  var proofComponents    = ['Limited documents','Single workflow','Manual fallback','Basic evidence log'];
  var productionComponents = ['Identity and access','Monitoring and alerts','Evaluation framework','Resilience and fallback','Controlled integrations','Incident handling'];
  var reuseComponents    = ['Shared context graph','Reusable orchestration','Common evidence framework','Shared security and observability','Cost and value governance'];

  var _graph = null;
  var _graphData = null;

  function loadGraph(cb) {
    if (_graphData) { cb(_graphData); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', GRAPH_DATA_URL);
    xhr.onload = function() {
      try { _graphData = JSON.parse(xhr.responseText); } catch(e) { _graphData = null; }
      cb(_graphData);
    };
    xhr.onerror = function() { cb(null); };
    xhr.send();
  }

  function buildComponentList(items, color) {
    return items.map(function(item) {
      return '<div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04);">'
        + '<span style="font-size:10px;color:' + color + ';flex-shrink:0">&#8226;</span>'
        + '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);line-height:1.3">' + item + '</span>'
        + '</div>';
    }).join('');
  }

  function build(cb) {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:8px 14px;';

    // Failure alert bar (hidden initially)
    var failBar = document.createElement('div');
    failBar.className = 'scene-node';
    failBar.dataset.beat = 'fail-bar';
    failBar.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:7px 12px;'
      + 'background:rgba(240,117,138,.08);border:1px solid var(--pink);border-radius:6px;';
    failBar.innerHTML =
      '<i class="ti ti-alert-triangle" style="font-size:15px;color:var(--pink);flex-shrink:0"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--pink)">Proof failure detected</span>'
      + '<span style="font-size:13px;color:var(--text-2);margin-left:4px">Low retrieval confidence on OBL-27. Process frozen pending review.</span>';
    outer.appendChild(failBar);

    // Main area: three columns + shared context layer
    var mainGrid = document.createElement('div');
    mainGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto 1fr;gap:8px;flex:1;min-height:0;';

    // Shared context layer header (spans all 3 cols)
    var ctxHdr = document.createElement('div');
    ctxHdr.className = 'scene-node';
    ctxHdr.dataset.beat = 'ctx-hdr';
    ctxHdr.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px;padding:6px 12px;'
      + 'background:rgba(180,76,255,.06);border:1px solid rgba(180,76,255,.3);border-radius:7px;';
    ctxHdr.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)">Shared context layer</span>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2)">Regulation, obligation, policy and control graph -- shared across use cases.</span>'
      + '<span style="margin-left:auto;font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.07em;color:var(--text-3)">OBL-27 active</span>';
    mainGrid.appendChild(ctxHdr);

    // PROOF column
    var proofCard = document.createElement('div');
    proofCard.className = 'scene-node';
    proofCard.dataset.beat = 'state-proof';
    proofCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--cyan);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:5px;overflow:hidden;';
    proofCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-shrink:0;">'
      + '<i class="ti ti-flask" style="font-size:17px;color:var(--cyan)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.1em;font-weight:700;color:var(--cyan)">PROOF</span>'
      + '</div>'
      + buildComponentList(proofComponents, 'var(--cyan)');
    mainGrid.appendChild(proofCard);

    // PRODUCTION column
    var prodCard = document.createElement('div');
    prodCard.className = 'scene-node';
    prodCard.dataset.beat = 'state-production';
    prodCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--accent);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:5px;overflow:hidden;';
    prodCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-shrink:0;">'
      + '<i class="ti ti-server" style="font-size:17px;color:var(--accent)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.1em;font-weight:700;color:var(--accent)">PRODUCTION</span>'
      + '</div>'
      + buildComponentList(productionComponents, 'var(--accent)');
    mainGrid.appendChild(prodCard);

    // REUSE column
    var reuseCard = document.createElement('div');
    reuseCard.className = 'scene-node';
    reuseCard.dataset.beat = 'state-reuse';
    reuseCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--green);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:5px;overflow:hidden;';
    reuseCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-shrink:0;">'
      + '<i class="ti ti-recycle" style="font-size:17px;color:var(--green)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.1em;font-weight:700;color:var(--green)">REUSE</span>'
      + '</div>'
      + buildComponentList(reuseComponents, 'var(--green)')
      + '<div style="margin-top:5px;font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);font-style:italic;flex-shrink:0">A second use case enters the same context graph.</div>';
    mainGrid.appendChild(reuseCard);

    outer.appendChild(mainGrid);

    // Governance note
    var govNote = document.createElement('div');
    govNote.className = 'scene-node';
    govNote.dataset.beat = 'gov-note';
    govNote.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:6px 12px;'
      + 'background:rgba(88,201,148,.05);border:1px solid var(--green);border-radius:6px;';
    govNote.innerHTML =
      '<i class="ti ti-shield-check" style="font-size:15px;color:var(--green);flex-shrink:0"></i>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2)">Shared context, governance and evidence services reduce avoidable duplication. Cost per case falls as the base is reused.</span>';
    outer.appendChild(govNote);

    container.appendChild(outer);
    if (cb) cb();
  }

  var _tl = null;

  var steps = [
    { delay: 300,  run: function() {
      var n = container.querySelector('[data-beat="state-proof"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 1200, run: function() {
      var f = container.querySelector('[data-beat="fail-bar"]');
      if (f) f.classList.add('visible');
    }},
    { delay: 2400, run: function() {
      var n = container.querySelector('[data-beat="state-production"]');
      if (n) n.classList.add('visible');
      // Resolve failure bar
      var f = container.querySelector('[data-beat="fail-bar"]');
      if (f) {
        f.style.borderColor = 'var(--green)';
        f.style.background = 'rgba(88,201,148,.05)';
        var ico = f.querySelector('.ti');
        if (ico) ico.style.color = 'var(--green)';
        var spans = f.querySelectorAll('span');
        if (spans[0]) { spans[0].textContent = 'Failure handled'; spans[0].style.color = 'var(--green)'; }
        if (spans[1]) spans[1].textContent = 'Monitoring detected low confidence. Fallback triggered. Process resumed.';
      }
    }},
    { delay: 3600, run: function() {
      var ctx = container.querySelector('[data-beat="ctx-hdr"]');
      if (ctx) ctx.classList.add('visible');
    }},
    { delay: 4600, run: function() {
      var n = container.querySelector('[data-beat="state-reuse"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 5600, run: function() {
      var n = container.querySelector('[data-beat="gov-note"]');
      if (n) n.classList.add('visible');
    }}
  ];

  return {
    play: function() {
      build(function() {
        _tl = createTimeline(steps);
        _tl.play();
      });
    },
    pause:  function() { if (_tl) _tl.pause(); },
    resume: function() { if (_tl) _tl.resume(); },
    reset:  function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      build(function() {});
    },
    finish: function() {
      build(function() {
        container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
        var f = container.querySelector('[data-beat="fail-bar"]');
        if (f) {
          f.style.borderColor = 'var(--green)';
          f.style.background = 'rgba(88,201,148,.05)';
          var spans = f.querySelectorAll('span');
          if (spans[0]) { spans[0].textContent = 'Failure handled'; spans[0].style.color = 'var(--green)'; }
          if (spans[1]) spans[1].textContent = 'Monitoring detected low confidence. Fallback triggered. Process resumed.';
        }
      });
    },
    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _graph = null;
      container.innerHTML = '';
    }
  };
});
