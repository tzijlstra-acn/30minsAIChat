// Scene: unit-economics (Screen 09 -- Live cost telemetry)
// V19: one case moves through a cost path. A meter accumulates generic cost units.
// Design controls activate one by one, reducing the meter with explanations.
// Generic units only. No client data. No validated percentages.
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
    { id: 'preprocess', label: 'Deterministic preprocessing', tradeoff: null,                     meter: 80 },
    { id: 'routing',    label: 'Model routing',               tradeoff: null,                     meter: 68 },
    { id: 'cache',      label: 'Cached context',              tradeoff: null,                     meter: 56 },
    { id: 'bounded',    label: 'Bounded retries',             tradeoff: null,                     meter: 46 },
    { id: 'exception',  label: 'Exception-based review',      tradeoff: 'Quality: sampling only', meter: 38 },
    { id: 'shared',     label: 'Shared services',             tradeoff: null,                     meter: 30 }
  ];

  var _timers   = [];
  var _meterFill  = null;
  var _levelLabel = null;
  var _tradeoffEl = null;
  var _cardEls    = {};

  function build() {
    container.innerHTML = '';
    _cardEls    = {};
    _meterFill  = null;
    _levelLabel = null;
    _tradeoffEl = null;

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:10px;padding:8px 0;';

    // ── Section 1: Cost path stations ──────────────────────────────
    var stRow = document.createElement('div');
    stRow.id = 'ue-stations';
    stRow.style.cssText = 'display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;'
      + 'gap:4px;flex-shrink:0;opacity:0;transition:opacity 400ms ease;overflow:hidden;';

    stations.forEach(function(st, i) {
      var box = document.createElement('div');
      box.style.cssText = 'display:flex;flex-direction:column;gap:2px;padding:5px 7px;'
        + 'background:var(--surface-1);border-radius:6px;border:1px solid var(--border-1);'
        + 'min-width:0;flex:1;overflow:hidden;';

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;'
        + 'color:' + st.color + ';line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      lbl.textContent = st.label;

      var sub = document.createElement('div');
      sub.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
        + 'color:var(--text-3);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      sub.textContent = st.sublabel;

      box.appendChild(lbl);
      box.appendChild(sub);
      stRow.appendChild(box);

      if (i < stations.length - 1) {
        var plus = document.createElement('div');
        plus.style.cssText = 'font-size:16px;font-weight:700;color:var(--text-3);flex-shrink:0;padding:0 2px;';
        plus.textContent = '+';
        stRow.appendChild(plus);
      }
    });

    var eq = document.createElement('div');
    eq.style.cssText = 'font-size:16px;font-weight:700;color:var(--text-3);flex-shrink:0;padding:0 4px;';
    eq.textContent = '=';
    stRow.appendChild(eq);

    var totalBox = document.createElement('div');
    totalBox.style.cssText = 'display:flex;flex-direction:column;justify-content:center;padding:5px 10px;'
      + 'background:var(--surface-1);border-radius:6px;border:2px solid var(--cyan);flex-shrink:0;';
    var totalLbl = document.createElement('div');
    totalLbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;'
      + 'color:var(--cyan);line-height:1.2;white-space:nowrap;';
    totalLbl.textContent = 'Cost per successful case';
    totalBox.appendChild(totalLbl);
    stRow.appendChild(totalBox);

    root.appendChild(stRow);

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

    // ── Section 3: Design controls ─────────────────────────────────
    var compSec = document.createElement('div');
    compSec.id = 'ue-controls';
    compSec.style.cssText = 'display:flex;flex-direction:column;gap:6px;flex:1;min-height:0;opacity:0;transition:opacity 400ms ease;';

    var compTitle = document.createElement('div');
    compTitle.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-1);flex-shrink:0;';
    compTitle.textContent = 'Design controls';
    compSec.appendChild(compTitle);

    var cardsWrap = document.createElement('div');
    cardsWrap.style.cssText = 'display:flex;flex-direction:column;gap:5px;flex:1;';

    controls.forEach(function(ctrl) {
      var card = document.createElement('div');
      card.style.cssText = 'border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:12px;'
        + 'background:var(--surface-1);border:1px solid var(--border-1);opacity:.5;'
        + 'transition:background 400ms ease,border-color 400ms ease,opacity 400ms ease;';

      var cardLbl = document.createElement('div');
      cardLbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1);flex:1;';
      cardLbl.textContent = ctrl.label;

      var pill = document.createElement('div');
      pill.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--green);'
        + 'background:rgba(88,201,148,.1);border-radius:4px;padding:2px 8px;flex-shrink:0;';
      pill.textContent = '-';

      card.appendChild(cardLbl);
      card.appendChild(pill);
      cardsWrap.appendChild(card);
      _cardEls[ctrl.id] = card;
    });

    compSec.appendChild(cardsWrap);

    _tradeoffEl = document.createElement('div');
    _tradeoffEl.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);'
      + 'padding:2px 0;opacity:0;transition:opacity 300ms ease;flex-shrink:0;min-height:16px;';
    compSec.appendChild(_tradeoffEl);

    root.appendChild(compSec);
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

  function activateCard(id) {
    var card = _cardEls[id];
    if (!card) return;
    card.style.background    = 'rgba(88,201,148,.08)';
    card.style.borderColor   = 'var(--green)';
    card.style.opacity       = '1';
  }

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
    var stRow    = container.querySelector('#ue-stations');
    var meterSec = container.querySelector('#ue-meter');
    var compSec  = container.querySelector('#ue-controls');
    if (stRow)    stRow.style.opacity    = '1';
    if (meterSec) meterSec.style.opacity = '1';
    if (compSec)  compSec.style.opacity  = '1';
    if (_meterFill) {
      _meterFill.style.transition = 'none';
      _meterFill.style.width      = '30%';
    }
    setLevel('LOWER', 'var(--green)');
    controls.forEach(function(ctrl) { activateCard(ctrl.id); });
  }

  var steps = [
    // 200ms: stations row appears
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

    // 1400ms: comparison area appears, all 6 cards inactive
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
      build();
      tl.play();
    },
    pause:  tl.pause,
    resume: tl.resume,
    reset:  function() {
      _timers.forEach(function(id) { clearTimeout(id); });
      _timers = [];
      build();
      tl.reset();
    },
    finish: function() {
      build();
      showFinal();
    },
    getAccessibleSummary: function() {
      return 'Six cost stations are shown: Data and context, Model reasoning, Orchestration, Retries, Human review, and Platform assurance. Six design controls activate one by one, each reducing the cost meter. The meter ends at LOWER. One control notes a quality trade-off. No client data, no validated percentages.';
    },
    destroy: function() {
      _timers.forEach(function(id) { clearTimeout(id); });
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
