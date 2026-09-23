// Scene: unit-economics (Screen 09 - HOW TO SCALE)
// V15 overhaul: case-level cost waterfall.
// Scenario A (isolated design) vs Scenario B (proportionate design).
// Generic units only. No client savings or percentages.
// Label: ILLUSTRATIVE COST PATH -- GENERIC UNITS -- NOT CLIENT DATA
SceneDirector.register('unit-economics', function(container, manifest, reduced) {

  var stations = [
    { id: 'data',      label: 'Data and context',      iconA: 'ti-database',       iconB: 'ti-database',       colorA: 'var(--cyan)',   colorB: 'var(--cyan)',
      noteA: 'Repeated retrieval, full corpus each call',  noteB: 'Cached context, targeted retrieval' },
    { id: 'model',     label: 'Model reasoning',        iconA: 'ti-brain',          iconB: 'ti-brain',          colorA: 'var(--accent)', colorB: 'var(--accent)',
      noteA: 'Large model for every step',               noteB: 'Routing: deterministic first, generative only where needed' },
    { id: 'orch',      label: 'Orchestration',          iconA: 'ti-route',          iconB: 'ti-route',          colorA: 'var(--accent)', colorB: 'var(--accent)',
      noteA: 'No caching, high retry rate',              noteB: 'Controlled retries, shared orchestration' },
    { id: 'review',    label: 'Human review',           iconA: 'ti-user-check',     iconB: 'ti-user-check',     colorA: 'var(--amber)',  colorB: 'var(--amber)',
      noteA: 'High review rate for all outputs',         noteB: 'Exception-based review, risk-stratified sampling' },
    { id: 'platform',  label: 'Platform and assurance', iconA: 'ti-server',         iconB: 'ti-server',         colorA: 'var(--green)',  colorB: 'var(--green)',
      noteA: 'Duplicated services per use case',         noteB: 'Shared services amortised across use cases' }
  ];

  // Relative proportions (A vs B) -- illustrative only
  var wA = [0.55, 0.60, 0.50, 0.65, 0.55];
  var wB = [0.30, 0.30, 0.25, 0.25, 0.20];

  var _timers = [];

  function makeBar(width, color) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;height:18px;background:var(--surface-2);border-radius:4px;overflow:hidden;';
    var fill = document.createElement('div');
    fill.style.cssText = 'height:100%;width:' + Math.round(width * 100) + '%;background:' + color
      + ';border-radius:4px;transform:scaleX(0);transform-origin:left;transition:transform 600ms ease;';
    fill.dataset.bar = '1';
    wrap.appendChild(fill);
    return wrap;
  }

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:10px 16px;';

    // Scenario headers
    var headers = document.createElement('div');
    headers.className = 'scene-node';
    headers.dataset.beat = 'headers';
    headers.style.cssText = 'display:grid;grid-template-columns:160px 1fr 1fr;gap:10px;flex-shrink:0;'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);';
    headers.innerHTML =
      '<span>Cost station</span>'
      + '<span style="color:var(--pink)">Scenario A -- Isolated design</span>'
      + '<span style="color:var(--green)">Scenario B -- Proportionate design</span>';
    outer.appendChild(headers);

    // Rows
    stations.forEach(function(st, i) {
      var row = document.createElement('div');
      row.className = 'scene-node';
      row.dataset.beat = 'row-' + st.id;
      row.style.cssText = 'display:grid;grid-template-columns:160px 1fr 1fr;gap:10px;align-items:start;flex-shrink:0;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);';

      // Label
      var label = document.createElement('div');
      label.style.cssText = 'display:flex;align-items:center;gap:6px;';
      label.innerHTML =
        '<i class="ti ' + st.iconA + '" style="font-size:14px;color:var(--text-3);flex-shrink:0"></i>'
        + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);line-height:1.3">' + st.label + '</span>';
      row.appendChild(label);

      // Scenario A cell
      var cellA = document.createElement('div');
      cellA.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      cellA.appendChild(makeBar(wA[i], 'var(--pink)'));
      var noteA = document.createElement('div');
      noteA.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);line-height:1.3;';
      noteA.textContent = st.noteA;
      cellA.appendChild(noteA);
      row.appendChild(cellA);

      // Scenario B cell
      var cellB = document.createElement('div');
      cellB.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      cellB.appendChild(makeBar(wB[i], 'var(--green)'));
      var noteB = document.createElement('div');
      noteB.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);line-height:1.3;';
      noteB.textContent = st.noteB;
      cellB.appendChild(noteB);
      row.appendChild(cellB);

      outer.appendChild(row);
    });

    // Final statement
    var statement = document.createElement('div');
    statement.className = 'scene-node';
    statement.dataset.beat = 'statement';
    statement.style.cssText = 'flex-shrink:0;padding:8px 12px;background:rgba(88,201,148,.05);'
      + 'border:1px solid rgba(88,201,148,.25);border-radius:6px;'
      + 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);';
    statement.textContent = 'Lower avoidable run cost comes from architecture and process design, not model price alone.';
    outer.appendChild(statement);

    container.appendChild(outer);
  }

  function animateRow(stationId) {
    var row = container.querySelector('[data-beat="row-' + stationId + '"]');
    if (!row) return;
    row.querySelectorAll('[data-bar]').forEach(function(bar) {
      bar.style.transform = 'scaleX(1)';
    });
  }

  var steps = [
    { delay: 300, run: function() {
      var h = container.querySelector('[data-beat="headers"]');
      if (h) h.classList.add('visible');
    }}
  ].concat(stations.map(function(st, i) {
    return { delay: 700 + i * 900, run: function() {
      var row = container.querySelector('[data-beat="row-' + st.id + '"]');
      if (row) row.classList.add('visible');
      _timers.push(setTimeout(function() { animateRow(st.id); }, 50));
    }};
  })).concat([{
    delay: 700 + stations.length * 900 + 300,
    run: function() {
      var n = container.querySelector('[data-beat="statement"]');
      if (n) n.classList.add('visible');
    }
  }]);

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() {
      _timers.forEach(function(id) { clearTimeout(id); });
      _timers = [];
      build(); tl.reset();
    },
    finish:  function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
      stations.forEach(function(st) { animateRow(st.id); });
    },
    destroy: function() {
      _timers.forEach(function(id) { clearTimeout(id); });
      _timers = [];
      container.innerHTML = ''; tl.destroy();
    }
  };
});
