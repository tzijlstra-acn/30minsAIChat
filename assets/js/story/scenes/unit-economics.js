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

  var _timers    = [];
  var _meterFill  = null;
  var _levelLabel = null;
  var _tradeoffEl = null;
  var _rowEls     = {};

  function build() {
    container.innerHTML = '';
    _rowEls     = {};
    _meterFill  = null;
    _levelLabel = null;
    _tradeoffEl = null;

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
    meterNote.textContent = 'Generic cost units -- illustrative only';
    meterSec.appendChild(meterNote);

    root.appendChild(meterSec);

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

  function showFinal() {
    var stStrip  = container.querySelector('#ue-stations');
    var meterSec = container.querySelector('#ue-meter');
    var ctrlPanel = container.querySelector('#ue-controls');
    if (stStrip)   stStrip.style.opacity   = '1';
    if (meterSec)  meterSec.style.opacity  = '1';
    if (ctrlPanel) ctrlPanel.style.opacity = '1';
    if (_meterFill) {
      _meterFill.style.transition = 'none';
      _meterFill.style.width      = '30%';
    }
    setLevel('LOWER', 'var(--green)');
    controls.forEach(function(ctrl) { activateRow(ctrl.id); });
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

    // 6000ms: control 6 -- meter 30%, label LOWER + complete
    { delay: 6000, run: function() {
      activateCard('shared');
      setMeter(30);
      setLevel('LOWER', 'var(--green)');
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
    renderStatic: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showFinal();
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
      showFinal();
    },
    seek: function(p) {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (p >= 1) { showFinal(); return; }
      var st = container.querySelector('#ue-stations');
      var mt = container.querySelector('#ue-meter');
      var cp = container.querySelector('#ue-controls');
      if (st) st.style.opacity = '1';
      if (p > 0.15 && mt) {
        mt.style.opacity = '1';
        var pctHigh = 90 - Math.floor(p * 60);
        setMeter(Math.max(30, pctHigh));
        setLevel(pctHigh > 50 ? 'HIGH' : 'LOWER', pctHigh > 50 ? 'var(--pink)' : 'var(--green)');
      }
      if (p > 0.3 && cp) {
        cp.style.opacity = '1';
        var ctrlCount = Math.floor((p - 0.3) / 0.7 * controls.length);
        controls.slice(0, ctrlCount).forEach(function(ctrl) { activateRow(ctrl.id); });
      }
    },
    getAccessibleSummary: function() {
      return 'Six cost stations are shown: Data and context, Model reasoning, Orchestration, Retries, Human review, and Platform assurance. Six design controls activate one by one, each reducing the cost meter. The meter ends at LOWER. One control notes a quality trade-off. No client data, no validated percentages.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
