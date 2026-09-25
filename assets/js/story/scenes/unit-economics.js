// Scene: unit-economics (Screen 09)
// V26: Cost waterfall. Stations are one connected strip -- not equal boxes.
// Design controls are rows inside one panel -- not equal cards.
// Generic cost units only. No client data. No validated percentages.
SceneDirector.register('unit-economics', function(container, manifest, reduced) {

  var stations = [
    { id: 'data',     label: 'Data and context',        sublabel: 'Retrieval and context load', color: 'var(--cyan)'   },
    { id: 'model',    label: 'Model reasoning',          sublabel: 'Inference per step',          color: 'var(--accent)' },
    { id: 'orch',     label: 'Orchestration and tools',  sublabel: 'Routing and tool calls',      color: 'var(--text-2)' },
    { id: 'retries',  label: 'Retries',                  sublabel: 'Failure recovery cost',       color: 'var(--pink)'   },
    { id: 'review',   label: 'Human review',             sublabel: 'Manual triage time',          color: 'var(--amber)'  },
    { id: 'platform', label: 'Platform and assurance',   sublabel: 'Infrastructure and audit',    color: 'var(--green)'  }
  ];

  var controls = [
    { id: 'preprocess', label: 'Deterministic preprocessing', meter: 80 },
    { id: 'routing',    label: 'Model routing',               meter: 68 },
    { id: 'cache',      label: 'Cached context',              meter: 56 },
    { id: 'bounded',    label: 'Bounded retries',             meter: 46 },
    { id: 'exception',  label: 'Exception-based review',      meter: 38, tradeoff: 'Quality: sampling only' },
    { id: 'shared',     label: 'Shared services',             meter: 30 }
  ];

  var _timers      = [];
  var _meterFill   = null;
  var _levelLabel  = null;
  var _tradeoffEl  = null;
  var _rowEls      = {};
  var _scenBadge   = null;
  var _scenDesc    = null;

  function build() {
    container.innerHTML = '';
    _rowEls     = {};
    _meterFill  = null;
    _levelLabel = null;
    _tradeoffEl = null;

    _scenBadge  = null;
    _scenDesc   = null;

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:10px;padding:8px 0;';

    // ── Section 1: Cost station strip (one connected element, not 6 equal boxes) ──
    // V26 box rule: this strip is one system boundary showing cost decomposition.
    var stStrip = document.createElement('div');
    stStrip.id = 'ue-stations';
    stStrip.style.cssText = 'display:flex;flex-direction:row;align-items:stretch;flex-shrink:0;'
      + 'border:1px solid var(--border-1);border-radius:4px;overflow:hidden;'
      + 'opacity:0;transition:opacity 400ms ease;';

    stations.forEach(function(st, i) {
      var seg = document.createElement('div');
      seg.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:2px;padding:7px 9px;min-width:0;'
        + (i > 0 ? 'border-left:1px solid var(--border-1);' : '');

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;'
        + 'color:' + st.color + ';line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      lbl.textContent = st.label;

      var sub = document.createElement('div');
      sub.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;'
        + 'color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      sub.textContent = st.sublabel;

      seg.appendChild(lbl);
      seg.appendChild(sub);
      stStrip.appendChild(seg);
    });

    // Total indicator as a distinct segment with accent left-border
    var totalSeg = document.createElement('div');
    totalSeg.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;justify-content:center;'
      + 'padding:7px 12px;border-left:2px solid var(--cyan);';
    var totalLbl = document.createElement('div');
    totalLbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;'
      + 'color:var(--cyan);white-space:nowrap;';
    totalLbl.textContent = 'Cost per case';
    totalSeg.appendChild(totalLbl);
    stStrip.appendChild(totalSeg);

    root.appendChild(stStrip);

    // ── Section 2: Cost meter ──────────────────────────────────────
    var meterSec = document.createElement('div');
    meterSec.id = 'ue-meter';
    meterSec.style.cssText = 'display:flex;flex-direction:column;gap:6px;flex-shrink:0;opacity:0;transition:opacity 400ms ease;';

    var meterHead = document.createElement('div');
    meterHead.style.cssText = 'display:flex;align-items:center;gap:10px;';

    var meterTitle = document.createElement('div');
    meterTitle.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-1);';
    meterTitle.textContent = 'Aggregated cost signal';

    _levelLabel = document.createElement('div');
    _levelLabel.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:14px;font-weight:700;'
      + 'color:var(--pink);transition:color 600ms ease;';
    _levelLabel.textContent = 'HIGH';

    meterHead.appendChild(meterTitle);
    meterHead.appendChild(_levelLabel);
    meterSec.appendChild(meterHead);

    var meterWrap = document.createElement('div');
    meterWrap.style.cssText = 'background:var(--surface-2);overflow:hidden;height:24px;border-radius:4px;border:1px solid var(--border-1);';

    _meterFill = document.createElement('div');
    _meterFill.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,var(--pink),var(--accent));'
      + 'border-radius:4px;transition:width 600ms ease;';
    meterWrap.appendChild(_meterFill);
    meterSec.appendChild(meterWrap);

    var meterNote = document.createElement('div');
    meterNote.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;color:var(--text-3);';
    meterNote.textContent = 'Generic cost units, illustrative only';
    meterSec.appendChild(meterNote);

    root.appendChild(meterSec);

    // ── Scenario indicator ─────────────────────────────────────────────────
    var scenRow = document.createElement('div');
    scenRow.id = 'ue-scenario';
    scenRow.style.cssText = 'display:flex;align-items:center;gap:10px;flex-shrink:0;'
      + 'opacity:0;transition:opacity 400ms ease;';

    _scenBadge = document.createElement('div');
    _scenBadge.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;font-weight:700;'
      + 'letter-spacing:.10em;color:var(--cyan);background:rgba(77,217,224,.10);'
      + 'border:1px solid rgba(77,217,224,.30);border-radius:10px;padding:2px 8px;'
      + 'flex-shrink:0;transition:color 400ms ease,background 400ms ease,border-color 400ms ease;';
    _scenBadge.textContent = 'ISOLATED RUN';
    scenRow.appendChild(_scenBadge);

    _scenDesc = document.createElement('div');
    _scenDesc.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'color:var(--text-3);transition:color 400ms ease;';
    _scenDesc.textContent = 'Each run absorbs full fixed cost';
    scenRow.appendChild(_scenDesc);

    root.appendChild(scenRow);

    // ── Section 3: Design controls panel (one panel, rows inside, not 6 equal cards) ──
    // V26 box rule: this panel is one system boundary for the control levers.
    var ctrlWrap = document.createElement('div');
    ctrlWrap.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0;';

    var ctrlPanel = document.createElement('div');
    ctrlPanel.id = 'ue-controls';
    ctrlPanel.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0;'
      + 'border:1px solid var(--border-1);border-radius:4px;overflow:hidden;'
      + 'opacity:0;transition:opacity 400ms ease;';

    var panelHdr = document.createElement('div');
    panelHdr.style.cssText = 'padding:6px 12px;border-bottom:1px solid var(--border-1);flex-shrink:0;';
    var panelHdrLbl = document.createElement('div');
    panelHdrLbl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);';
    panelHdrLbl.textContent = 'DESIGN CONTROLS';
    panelHdr.appendChild(panelHdrLbl);
    ctrlPanel.appendChild(panelHdr);

    controls.forEach(function(ctrl, i) {
      var row = document.createElement('div');
      row.id = 'ctrl-row-' + ctrl.id;
      row.style.cssText = 'flex:1;display:flex;align-items:center;gap:12px;padding:0 12px;'
        + (i > 0 ? 'border-top:1px solid var(--border-1);' : '')
        + 'opacity:0.35;transition:background 400ms ease,opacity 400ms ease;';

      var rowLbl = document.createElement('div');
      rowLbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;'
        + 'font-weight:700;color:var(--text-1);flex:1;';
      rowLbl.textContent = ctrl.label;

      var rowState = document.createElement('div');
      rowState.id = 'ctrl-state-' + ctrl.id;
      rowState.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
        + 'color:var(--text-3);flex-shrink:0;transition:color 300ms ease;';
      rowState.textContent = '--';

      row.appendChild(rowLbl);
      row.appendChild(rowState);
      ctrlPanel.appendChild(row);
      _rowEls[ctrl.id] = row;
    });

    ctrlWrap.appendChild(ctrlPanel);

    _tradeoffEl = document.createElement('div');
    _tradeoffEl.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);'
      + 'padding:2px 0;opacity:0;transition:opacity 300ms ease;flex-shrink:0;min-height:16px;';
    ctrlWrap.appendChild(_tradeoffEl);

    root.appendChild(ctrlWrap);
    container.appendChild(root);
  }

  function setMeter(pct) {
    if (_meterFill) _meterFill.style.width = pct + '%';
  }

  function setLevel(text, color) {
    if (!_levelLabel) return;
    _levelLabel.textContent = text;
    _levelLabel.style.color = color;
  }

  function activateRow(id) {
    var row = _rowEls[id];
    if (!row) return;
    row.style.background = 'rgba(88,201,148,0.08)';
    row.style.opacity = '1';
    var state = container.querySelector('#ctrl-state-' + id);
    if (state) { state.style.color = 'var(--green)'; state.textContent = 'ACTIVE'; }
  }

  // Back-compat alias used in timeline steps
  function activateCard(id) { activateRow(id); }

  function showTradeoff(text) {
    if (!_tradeoffEl) return;
    _tradeoffEl.textContent  = 'Trade-off: ' + text;
    _tradeoffEl.style.opacity = '1';
    var t = setTimeout(function() {
      if (_tradeoffEl) _tradeoffEl.style.opacity = '0';
    }, 1500);
    _timers.push(t);
  }

  function switchScenario(badge, desc, meterPct, levelText, levelColor) {
    if (_scenBadge) {
      _scenBadge.textContent = badge;
      _scenBadge.style.color           = levelColor;
      _scenBadge.style.background      = levelColor === 'var(--green)' ? 'rgba(88,201,148,.10)' : 'rgba(77,217,224,.10)';
      _scenBadge.style.borderColor     = levelColor === 'var(--green)' ? 'rgba(88,201,148,.30)' : 'rgba(77,217,224,.30)';
    }
    if (_scenDesc) { _scenDesc.textContent = desc; }
    setMeter(meterPct);
    setLevel(levelText, levelColor);
  }

  function showScenario() {
    var el = container.querySelector('#ue-scenario');
    if (el) el.style.opacity = '1';
  }

  function showFinal() {
    var stStrip   = container.querySelector('#ue-stations');
    var meterSec  = container.querySelector('#ue-meter');
    var ctrlPanel = container.querySelector('#ue-controls');
    var scenRow   = container.querySelector('#ue-scenario');
    if (stStrip)   stStrip.style.opacity   = '1';
    if (meterSec)  meterSec.style.opacity  = '1';
    if (ctrlPanel) ctrlPanel.style.opacity = '1';
    if (scenRow)   scenRow.style.opacity   = '1';
    if (_meterFill) {
      _meterFill.style.transition = 'none';
      _meterFill.style.width      = '18%';
    }
    setLevel('MINIMUM FLOOR', 'var(--green)');
    controls.forEach(function(ctrl) { activateRow(ctrl.id); });
    if (_scenBadge) {
      _scenBadge.textContent = 'PROPORTIONATE SHARE';
      _scenBadge.style.color       = 'var(--green)';
      _scenBadge.style.background  = 'rgba(88,201,148,.10)';
      _scenBadge.style.borderColor = 'rgba(88,201,148,.30)';
    }
    if (_scenDesc) { _scenDesc.textContent = 'Platform cost distributed across case volume'; }
  }

  var steps = [
    // 200ms: station strip appears
    { delay: 200, run: function() {
      var el = container.querySelector('#ue-stations');
      if (el) el.style.opacity = '1';
    }},

    // 600ms: meter appears, fill animates to 90%, label HIGH
    { delay: 600, run: function() {
      var el = container.querySelector('#ue-meter');
      if (el) el.style.opacity = '1';
      setMeter(90);
      setLevel('HIGH', 'var(--pink)');
    }},

    // 1400ms: controls panel appears, all 6 rows inactive
    { delay: 1400, run: function() {
      var el = container.querySelector('#ue-controls');
      if (el) el.style.opacity = '1';
    }},

    // 2000ms: control 1 -- meter 80%
    { delay: 2000, run: function() { activateCard('preprocess'); setMeter(80); }},

    // 2800ms: control 2 -- meter 68%
    { delay: 2800, run: function() { activateCard('routing');    setMeter(68); }},

    // 3600ms: control 3 -- meter 56%
    { delay: 3600, run: function() { activateCard('cache');      setMeter(56); }},

    // 4400ms: control 4 -- meter 46%
    { delay: 4400, run: function() { activateCard('bounded');    setMeter(46); }},

    // 5200ms: control 5 -- meter 38%, trade-off note
    { delay: 5200, run: function() {
      activateCard('exception');
      setMeter(38);
      showTradeoff('Quality: sampling only');
    }},

    // 6000ms: control 6 -- meter 30%, label LOWER
    { delay: 6000, run: function() {
      activateCard('shared');
      setMeter(30);
      setLevel('LOWER', 'var(--green)');
    }},

    // 6800ms: Scenario 1 badge appears (Isolated Run)
    { delay: 6800, run: function() {
      switchScenario('ISOLATED RUN', 'Each run absorbs full fixed cost', 30, 'LOWER', 'var(--cyan)');
      showScenario();
    }},

    // 7800ms: Auto-switch to Scenario 2 (Proportionate Share)
    { delay: 7800, run: function() {
      switchScenario('PROPORTIONATE SHARE', 'Platform cost distributed across case volume', 18, 'MINIMUM FLOOR', 'var(--green)');
    }},

    // 9800ms: complete
    { delay: 9800, run: function() {
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 500));
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showFinal(); return; }
      tl.play();
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
      showFinal();
    },
    getAccessibleSummary: function() {
      return 'Six cost stations are shown: Data and context, Model reasoning, Orchestration, Retries, Human review, and Platform assurance. Six design controls activate one by one, each reducing the cost meter. Scenario 1 (Isolated run) shows each run absorbing full fixed cost. Scenario 2 (Proportionate share) shows platform cost distributed across volume, reducing the meter further to minimum floor. No client data, no validated percentages.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
