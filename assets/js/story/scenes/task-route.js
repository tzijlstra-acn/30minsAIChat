// Scene: task-route (Screen 03 -- WHAT AI IS FOR THIS TASK)
// V26: Work Pattern Scanner. One task enters at a time. Five dimensions illuminate.
// A fingerprint maps to the AI terrain. Four examples cycle sequentially.
// Final state locks on the Regulation Coverage example, transitioning into Screen 04.
// Constraints: no em-dash, no equal-card grid, no border-radius cards. No fabricated data.
SceneDirector.register('task-route', function(container, manifest, reduced) {

  var DIMS = [
    { id: 'rule',    label: 'Rule stability',       color: '#55C7E8' },
    { id: 'input',   label: 'Input structure',       color: '#55C7E8' },
    { id: 'ambig',   label: 'Ambiguity',             color: '#B44CFF' },
    { id: 'action',  label: 'Action complexity',     color: '#F3B34C' },
    { id: 'control', label: 'Control sensitivity',   color: '#58C994' }
  ];

  var EXAMPLES = [
    {
      label: 'Check a known threshold',
      sub: null,
      dims: { rule: 90, input: 85, ambig: 10, action: 15, control: 40 },
      layer: 0,
      layerColor: '#55C7E8'
    },
    {
      label: 'Route a review request',
      sub: null,
      dims: { rule: 75, input: 70, ambig: 20, action: 35, control: 45 },
      layer: 1,
      layerColor: '#55C7E8'
    },
    {
      label: 'Detect an unusual pattern',
      sub: null,
      dims: { rule: 55, input: 50, ambig: 45, action: 30, control: 35 },
      layer: 2,
      layerColor: '#55C7E8'
    },
    {
      label: 'Draft a policy-gap rationale',
      sub: null,
      dims: { rule: 20, input: 25, ambig: 80, action: 55, control: 70 },
      layer: 3,
      layerColor: '#B44CFF'
    },
    {
      label: 'REGULATION COVERAGE',
      sub: 'Screen 04 example',
      dims: { rule: 30, input: 40, ambig: 70, action: 80, control: 90 },
      layer: 4,
      layerColor: '#F0758A'
    }
  ];

  var LAYERS = [
    { label: 'Rules and workflow',    color: '#55C7E8' },
    { label: 'RPA and orchestration', color: '#55C7E8' },
    { label: 'Analytics and ML',      color: '#55C7E8' },
    { label: 'Generative AI',         color: '#B44CFF' },
    { label: 'Agents',                color: '#F0758A' }
  ];

  var _timers = [];
  var _barEls   = {};
  var _levelEls = {};
  var _layerEls = [];
  var _taskLbl  = null;
  var _taskSub  = null;
  var _taskIdx  = null;

  function _t(fn, delay) {
    var id = setTimeout(fn, delay);
    _timers.push(id);
    return id;
  }

  function _hexToRgb(hex) {
    return parseInt(hex.slice(1,3),16) + ',' + parseInt(hex.slice(3,5),16) + ',' + parseInt(hex.slice(5,7),16);
  }

  function build() {
    container.innerHTML = '';
    _barEls = {}; _levelEls = {}; _layerEls = [];
    _taskLbl = null; _taskSub = null; _taskIdx = null;

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:0;';

    // Header
    var hdr = document.createElement('div');
    hdr.id = 'tr-header';
    hdr.style.cssText = 'display:flex;align-items:center;gap:12px;padding:6px 0 5px;flex-shrink:0;opacity:0;transition:opacity .4s;';

    var hdrLabel = document.createElement('span');
    hdrLabel.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.25);white-space:nowrap;';
    hdrLabel.textContent = 'WORK PATTERN SCANNER';
    hdr.appendChild(hdrLabel);

    var hdrSep = document.createElement('div');
    hdrSep.style.cssText = 'flex:1;height:1px;background:rgba(255,255,255,.06);';
    hdr.appendChild(hdrSep);
    root.appendChild(hdr);

    // Main 3-column area
    var main = document.createElement('div');
    main.id = 'tr-main';
    main.style.cssText = 'flex:1;display:flex;flex-direction:row;gap:0;min-height:0;opacity:0;transition:opacity .4s;';

    // Left: current task display
    var leftPanel = document.createElement('div');
    leftPanel.style.cssText = 'flex-shrink:0;width:210px;display:flex;flex-direction:column;justify-content:center;padding:0 22px 0 0;border-right:1px dashed rgba(255,255,255,.06);';

    _taskIdx = document.createElement('div');
    _taskIdx.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.2);margin-bottom:10px;';
    _taskIdx.textContent = '01 OF 05';
    leftPanel.appendChild(_taskIdx);

    _taskLbl = document.createElement('div');
    _taskLbl.style.cssText = 'font-family:"Space Grotesk",sans-serif;font-size:16px;font-weight:700;color:var(--text-1);line-height:1.3;margin-bottom:6px;transition:color .3s;';
    _taskLbl.textContent = EXAMPLES[0].label;
    leftPanel.appendChild(_taskLbl);

    _taskSub = document.createElement('div');
    _taskSub.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.08em;color:rgba(255,255,255,.3);';
    _taskSub.textContent = '';
    leftPanel.appendChild(_taskSub);
    main.appendChild(leftPanel);

    // Center: 5 dimension bars
    var centerPanel = document.createElement('div');
    centerPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:0 28px;';

    DIMS.forEach(function(dim) {
      var row = document.createElement('div');
      row.className = 'tr-row';
      row.style.cssText = 'display:flex;align-items:center;gap:12px;height:24px;';

      var lbl = document.createElement('div');
      lbl.style.cssText = 'flex-shrink:0;width:130px;font-family:"Space Grotesk",sans-serif;font-size:14px;color:rgba(255,255,255,.5);line-height:1;';
      lbl.textContent = dim.label;

      var track = document.createElement('div');
      track.style.cssText = 'flex:1;height:4px;background:rgba(255,255,255,.06);border-radius:2px;position:relative;overflow:hidden;';

      var fill = document.createElement('div');
      fill.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:0%;background:' + dim.color + ';border-radius:2px;transition:width 550ms cubic-bezier(.16,1,.3,1);';
      track.appendChild(fill);
      _barEls[dim.id] = fill;

      var levEl = document.createElement('div');
      levEl.style.cssText = 'flex-shrink:0;width:36px;font-family:"JetBrains Mono",monospace;font-size:10px;color:rgba(255,255,255,.3);text-align:right;';
      levEl.textContent = '--';
      _levelEls[dim.id] = levEl;

      row.appendChild(lbl);
      row.appendChild(track);
      row.appendChild(levEl);
      centerPanel.appendChild(row);
    });
    main.appendChild(centerPanel);

    // Right: terrain map
    var rightPanel = document.createElement('div');
    rightPanel.style.cssText = 'flex-shrink:0;width:172px;display:flex;flex-direction:column;justify-content:center;gap:0;padding:0 0 0 24px;border-left:1px dashed rgba(255,255,255,.06);';

    var mapLabel = document.createElement('div');
    mapLabel.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.2);margin-bottom:8px;';
    mapLabel.textContent = 'MAPPED TO';
    rightPanel.appendChild(mapLabel);

    LAYERS.forEach(function(layer, li) {
      var el = document.createElement('div');
      el.style.cssText = 'padding:7px 10px;font-family:"Space Grotesk",sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.2);border-left:2px solid rgba(255,255,255,.06);margin-bottom:3px;transition:color .3s,border-color .3s,background .3s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      el.textContent = layer.label;
      _layerEls.push(el);
      rightPanel.appendChild(el);
    });
    main.appendChild(rightPanel);
    root.appendChild(main);

    // Insight line
    var insight = document.createElement('div');
    insight.setAttribute('data-beat', 'insight');
    insight.style.cssText = 'flex-shrink:0;padding:6px 0 2px;font-family:"Space Grotesk",sans-serif;font-size:14px;color:rgba(255,255,255,.35);opacity:0;transition:opacity .4s;line-height:1.4;';
    insight.textContent = 'Task complexity determines which AI layer applies. More constrained tasks with clear rules sit lower in the terrain.';
    root.appendChild(insight);

    container.appendChild(root);
  }

  function _setExample(idx) {
    var ex = EXAMPLES[idx];
    _taskIdx.textContent = '0' + (idx + 1) + ' OF 05';
    _taskLbl.style.color = ex.layerColor;
    _taskLbl.textContent = ex.label;
    _taskSub.textContent = ex.sub || '';

    DIMS.forEach(function(dim) {
      var val = ex.dims[dim.id];
      _barEls[dim.id].style.width = val + '%';
      _levelEls[dim.id].textContent = val >= 70 ? 'HIGH' : val >= 40 ? 'MED' : 'LOW';
    });

    _layerEls.forEach(function(el, li) {
      var active = li === ex.layer;
      el.style.color = active ? LAYERS[li].color : 'rgba(255,255,255,.2)';
      el.style.borderColor = active ? LAYERS[li].color : 'rgba(255,255,255,.06)';
      el.style.background = active ? 'rgba(' + _hexToRgb(LAYERS[li].color) + ',.07)' : 'transparent';
    });
  }

  function _show(id) {
    var el = container.querySelector('#' + id);
    if (el) el.style.opacity = '1';
  }

  function showAll() {
    _show('tr-header');
    _show('tr-main');
    var insight = container.querySelector('[data-beat="insight"]');
    if (insight) insight.style.opacity = '1';
    _setExample(EXAMPLES.length - 1);
  }

  var steps = [
    { delay: 200,  run: function() { _show('tr-header'); }},
    { delay: 500,  run: function() { _show('tr-main'); }},
    { delay: 800,  run: function() { _setExample(0); }},
    { delay: 2800, run: function() { _setExample(1); }},
    { delay: 4800, run: function() { _setExample(2); }},
    { delay: 6800, run: function() { _setExample(3); }},
    { delay: 8800, run: function() { _setExample(4); }},
    { delay: 10400, run: function() {
      var insight = container.querySelector('[data-beat="insight"]');
      if (insight) insight.style.opacity = '1';
      _t(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 500);
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showAll(); } else { tl.play(); }
    },
    pause:  tl.pause,
    resume: tl.resume,
    reset: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      tl.reset();
    },
    finish: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showAll();
    },
    renderStatic: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showAll();
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
      showAll();
    },
    seek: function(p) {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      var idx = Math.min(EXAMPLES.length - 1, Math.floor(p * EXAMPLES.length));
      _show('tr-header');
      _show('tr-main');
      _setExample(idx);
      if (p >= 1) {
        var ins = container.querySelector('[data-beat="insight"]');
        if (ins) ins.style.opacity = '1';
      }
    },
    getAccessibleSummary: function() {
      return 'A Work Pattern Scanner cycles through five task examples. Five dimensions -- Rule stability, Input structure, Ambiguity, Action complexity, and Control sensitivity -- illuminate as bars. Each task maps to an AI terrain layer. The final example, Regulation Coverage, maps to the Agents layer.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
