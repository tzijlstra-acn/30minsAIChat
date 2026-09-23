// Scene: task-route (Screen 03)
// V19: Automatic decision tree -- 4 tasks route to least-complex AI pattern.
SceneDirector.register('task-route', function(container, manifest, reduced) {

  var _timers = [];

  // Task pills: left column
  var TASKS = [
    { line1: 'Check a known',      line2: 'threshold',      color: '#55C7E8', ty: 18  },
    { line1: 'Detect an unusual',  line2: 'pattern',        color: '#55C7E8', ty: 100 },
    { line1: 'Draft a policy-gap', line2: 'rationale',      color: '#B44CFF', ty: 182 },
    { line1: 'Coordinate a',       line2: 'multi-step case', color: '#F0758A', ty: 255 }
  ];

  // Pattern nodes: right column (x=480)
  var PATTERNS = [
    { label: 'Rules and workflow', color: '#55C7E8', bg: 'rgba(85,199,232,.08)',  py: 18,  role: 'Own exception policy',     roleAmber: false },
    { label: 'Analytics and ML',  color: '#55C7E8', bg: 'rgba(85,199,232,.08)',  py: 118, role: 'Challenge materiality',    roleAmber: false },
    { label: 'Generative AI',     color: '#B44CFF', bg: 'rgba(180,76,255,.10)',  py: 195, role: 'Review and approve',       roleAmber: false },
    { label: 'Agents',            color: '#F0758A', bg: 'rgba(240,117,138,.12)', py: 268, role: 'Control authority limits', roleAmber: true  }
  ];

  // Arrow paths: right edge of task pill (x=200) to left edge of pattern node (x=480)
  // Center y of each task: ty+22; center y of each pattern: py+22
  var ARROW_PATHS = [
    'M 200 40  C 340 40  340 40  480 40',
    'M 200 122 C 340 122 340 140 480 140',
    'M 200 204 C 340 204 340 217 480 217',
    'M 200 277 C 340 277 340 290 480 290'
  ];

  var ARROW_COLORS  = ['#55C7E8', '#55C7E8', '#B44CFF', '#F0758A'];
  var MARKER_IDS    = ['ar-cyan',  'ar-cyan',  'ar-accent', 'ar-pink'];

  var _svg   = null;
  var _table = null;

  function makeMarker(id, color) {
    var m = svgEl('marker', { id: id, markerWidth: '8', markerHeight: '8', refX: '6', refY: '3.5', orient: 'auto' });
    var p = svgEl('polygon', { points: '0 0, 7 3.5, 0 7', fill: color });
    m.appendChild(p);
    return m;
  }

  function makePillText(g, line1, line2, cx, ty, fill) {
    var t1 = svgEl('text', {
      x: cx, y: ty + 17,
      'text-anchor': 'middle',
      'dominant-baseline': 'auto',
      'font-family': 'Space Grotesk, sans-serif',
      'font-size': '12',
      'font-weight': '700',
      fill: fill
    });
    t1.textContent = line1;
    g.appendChild(t1);
    if (line2) {
      var t2 = svgEl('text', {
        x: cx, y: ty + 32,
        'text-anchor': 'middle',
        'dominant-baseline': 'auto',
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': '12',
        'font-weight': '700',
        fill: fill
      });
      t2.textContent = line2;
      g.appendChild(t2);
    }
  }

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:grid;grid-template-rows:1fr auto;gap:12px';

    // ── SVG routing tree ──
    var svgWrap = document.createElement('div');
    svgWrap.style.cssText = 'width:100%;height:100%;min-height:0;overflow:hidden';

    _svg = svgEl('svg', {
      viewBox: '0 0 1120 320',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'width:100%;height:100%;display:block'
    });

    // Defs: arrowhead markers
    var defs = svgEl('defs');
    defs.appendChild(makeMarker('ar-cyan',   '#55C7E8'));
    defs.appendChild(makeMarker('ar-accent', '#B44CFF'));
    defs.appendChild(makeMarker('ar-pink',   '#F0758A'));
    _svg.appendChild(defs);

    // Column header row
    function hdr(text, x) {
      var t = svgEl('text', {
        x: x, y: '10',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '9',
        'letter-spacing': '0.12em',
        fill: 'var(--text-3)',
        'text-anchor': 'start'
      });
      t.textContent = text;
      return t;
    }
    _svg.appendChild(hdr('TASK', '20'));
    _svg.appendChild(hdr('AI PATTERN', '480'));
    _svg.appendChild(hdr('HUMAN ROLE', '685'));

    // Task pills group
    var taskG = svgEl('g', { id: 'tr-tasks', opacity: '0', style: 'transition:opacity 400ms ease' });
    TASKS.forEach(function(task) {
      var g = svgEl('g');
      g.appendChild(svgEl('rect', {
        x: '20', y: task.ty, width: '180', height: '44', rx: '8',
        fill: 'var(--surface-1)', stroke: task.color, 'stroke-width': '2'
      }));
      makePillText(g, task.line1, task.line2, 110, task.ty, 'var(--text-1)');
      taskG.appendChild(g);
    });
    _svg.appendChild(taskG);

    // Arrows (one per task, hidden initially)
    ARROW_PATHS.forEach(function(d, i) {
      _svg.appendChild(svgEl('path', {
        id: 'tr-arrow-' + i,
        d: d,
        stroke: ARROW_COLORS[i],
        'stroke-width': '2',
        fill: 'none',
        'marker-end': 'url(#' + MARKER_IDS[i] + ')',
        opacity: '0',
        style: 'stroke-dasharray:400;stroke-dashoffset:400'
      }));
    });

    // Pattern nodes (hidden initially)
    PATTERNS.forEach(function(pat, i) {
      var g = svgEl('g', { id: 'tr-pat-' + i, opacity: '0', style: 'transition:opacity 300ms ease' });
      g.appendChild(svgEl('rect', {
        x: '480', y: pat.py, width: '180', height: '44', rx: '8',
        fill: pat.bg, stroke: pat.color, 'stroke-width': '2'
      }));
      var t = svgEl('text', {
        x: '570', y: pat.py + 26,
        'text-anchor': 'middle',
        'dominant-baseline': 'auto',
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': '13',
        'font-weight': '700',
        fill: pat.color
      });
      t.textContent = pat.label;
      g.appendChild(t);
      _svg.appendChild(g);
    });

    // Human role labels group (hidden initially)
    var roleG = svgEl('g', { id: 'tr-roles', opacity: '0', style: 'transition:opacity 400ms ease' });
    PATTERNS.forEach(function(pat) {
      var t = svgEl('text', {
        x: '685', y: pat.py + 26,
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': '12',
        fill: pat.roleAmber ? 'var(--amber)' : 'var(--text-2)'
      });
      t.textContent = pat.role;
      roleG.appendChild(t);
    });
    _svg.appendChild(roleG);

    svgWrap.appendChild(_svg);
    root.appendChild(svgWrap);

    // ── Comparison table ──
    _table = document.createElement('div');
    _table.style.cssText = 'opacity:0;transition:opacity 400ms ease;flex-shrink:0';

    var tbl = document.createElement('table');
    tbl.style.cssText = 'border-collapse:collapse;width:100%';

    var thead = document.createElement('thead');
    var hRow = document.createElement('tr');
    ['Task', 'AI pattern', 'Human role'].forEach(function(h) {
      var th = document.createElement('th');
      th.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;'
        + 'text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);'
        + 'text-align:left;padding:4px 10px;border:1px solid var(--border-1)';
      th.textContent = h;
      hRow.appendChild(th);
    });
    thead.appendChild(hRow);
    tbl.appendChild(thead);

    var tbody = document.createElement('tbody');
    var tblRows = [
      ['Known threshold',  'Rules',          'Own exception policy',     false],
      ['Unusual pattern',  'Analytics ML',   'Challenge materiality',    false],
      ['Document draft',   'Generative AI',  'Review and approve',       true ],
      ['Multi-step case',  'Agents',         'Control authority limits',  true ]
    ];
    tblRows.forEach(function(r) {
      var tr = document.createElement('tr');
      [0, 1, 2].forEach(function(ci) {
        var td = document.createElement('td');
        td.style.cssText = 'font-size:13px;padding:4px 10px;border:1px solid var(--border-1);color:'
          + (ci === 2 && r[3] ? 'var(--amber)' : 'var(--text-2)');
        td.textContent = r[ci];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    _table.appendChild(tbl);
    root.appendChild(_table);

    container.appendChild(root);
  }

  function drawArrow(i) {
    if (!_svg) return;
    var path = _svg.querySelector('#tr-arrow-' + i);
    if (!path) return;
    var len;
    try { len = path.getTotalLength(); } catch (e) { len = 300; }
    path.style.opacity = '1';
    path.style.transition = 'none';
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        path.style.transition = 'stroke-dashoffset 450ms ease';
        path.style.strokeDashoffset = '0';
      });
    });
  }

  function showEl(id) {
    if (!_svg) return;
    var el = _svg.querySelector('#' + id);
    if (el) el.style.opacity = '1';
  }

  function showTaskPills() {
    var g = _svg && _svg.querySelector('#tr-tasks');
    if (g) g.style.opacity = '1';
  }

  var steps = [
    { delay: 100,  run: showTaskPills },
    { delay: 400,  run: function() { drawArrow(0); showEl('tr-pat-0'); } },
    { delay: 900,  run: function() { drawArrow(1); showEl('tr-pat-1'); } },
    { delay: 1400, run: function() { drawArrow(2); showEl('tr-pat-2'); } },
    { delay: 1900, run: function() { drawArrow(3); showEl('tr-pat-3'); } },
    { delay: 2600, run: function() { showEl('tr-roles'); } },
    { delay: 3400, run: function() { if (_table) _table.style.opacity = '1'; } }
  ];

  var tl = createTimeline(steps);

  function finishAll() {
    build();
    showTaskPills();
    for (var i = 0; i < 4; i++) {
      var path = _svg && _svg.querySelector('#tr-arrow-' + i);
      if (path) {
        path.style.transition = 'none';
        path.style.strokeDashoffset = '0';
        path.style.opacity = '1';
      }
      showEl('tr-pat-' + i);
    }
    showEl('tr-roles');
    if (_table) _table.style.opacity = '1';
  }

  return {
    play:   function() { build(); tl.play(); },
    pause:  tl.pause,
    resume: tl.resume,
    reset:  function() { build(); tl.reset(); },
    finish: finishAll,
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
