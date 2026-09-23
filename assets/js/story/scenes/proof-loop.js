// Scene: proof-loop (Screen 07)
// V26: Evidence test rig. Five stages run as one connected pipeline strip -- not equal cards.
// Five evidence tracks fill as MetricStrips. Gate appears as one human approval element.
// No fictional results. No preselected outcome.
SceneDirector.register('proof-loop', function(container, manifest, reduced) {

  var _timers = [];

  var nodes = [
    { id: 'baseline',  label: 'Baseline',  color: '#4A5064',  labelColor: 'var(--text-2)' },
    { id: 'run',       label: 'Run',        color: '#B44CFF',  labelColor: 'var(--accent)' },
    { id: 'compare',   label: 'Compare',    color: '#B44CFF',  labelColor: 'var(--accent)' },
    { id: 'challenge', label: 'Challenge',  color: '#F3B34C',  labelColor: 'var(--amber)'  },
    { id: 'decide',    label: 'Decide',     color: '#58C994',  labelColor: 'var(--green)'  }
  ];

  var tracks = [
    { id: 'speed',     label: 'Speed',     color: 'var(--cyan)',   barText: 'Processing time recorded'  },
    { id: 'quality',   label: 'Quality',   color: 'var(--accent)', barText: 'Expert agreement: logged'  },
    { id: 'control',   label: 'Control',   color: 'var(--green)',  barText: 'Provenance: complete'       },
    { id: 'adoption',  label: 'Adoption',  color: 'var(--amber)',  barText: 'Reviewer log: complete'     },
    { id: 'economics', label: 'Economics', color: 'var(--pink)',   barText: 'Run cost: recorded'         }
  ];

  var gateOptions = [
    'Stop and review',
    'Refine approach',
    'Repeat proof',
    'Controlled scale'
  ];

  // ── DOM construction ──────────────────────────────────────────────────────

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:12px;padding:8px 0;';

    // -- Process pipeline: one connected strip, not 5 equal cards -------------
    // V26 box rule: this strip is one system boundary, not multiple cards.
    var pipeWrap = document.createElement('div');
    pipeWrap.id = 'pf-flow-row';
    pipeWrap.style.cssText = 'display:flex;flex-direction:row;height:46px;flex-shrink:0;'
      + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:4px;'
      + 'overflow:hidden;opacity:0;transition:opacity 400ms ease;';

    nodes.forEach(function(node, i) {
      var stepEl = document.createElement('div');
      stepEl.id = 'pf-node-' + node.id;
      stepEl.style.cssText = 'flex:1;display:flex;flex-direction:column;'
        + 'align-items:center;justify-content:center;gap:4px;position:relative;'
        + (i > 0 ? 'border-left:1px solid var(--border-1);' : '')
        + 'transition:background 400ms ease;';

      var labelEl = document.createElement('div');
      labelEl.id = 'pf-label-' + node.id;
      labelEl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;'
        + 'font-weight:700;color:var(--text-3);transition:color 400ms ease;';
      labelEl.textContent = node.label;
      stepEl.appendChild(labelEl);

      // Obligation token: small colored dot beneath the label
      var token = document.createElement('div');
      token.id = 'pf-token-' + node.id;
      token.style.cssText = 'width:8px;height:8px;border-radius:4px;background:#7C4DFF;'
        + 'opacity:0;transition:opacity 280ms ease;flex-shrink:0;';
      stepEl.appendChild(token);

      pipeWrap.appendChild(stepEl);
    });

    root.appendChild(pipeWrap);

    // -- Evidence tracks: MetricStrip-style rows ----------------------------
    var tracksSection = document.createElement('div');
    tracksSection.style.cssText = 'display:flex;flex-direction:column;gap:8px;flex:1;';

    tracks.forEach(function(track) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:10px;';

      var labelEl = document.createElement('div');
      labelEl.style.cssText = 'width:120px;font-family:\'Space Grotesk\',sans-serif;'
        + 'font-size:14px;font-weight:700;color:' + track.color + ';flex-shrink:0;';
      labelEl.textContent = track.label;
      row.appendChild(labelEl);

      var barWrap = document.createElement('div');
      barWrap.style.cssText = 'flex:1;background:var(--surface-2);border-radius:4px;'
        + 'height:32px;position:relative;overflow:hidden;';

      var placeholder = document.createElement('div');
      placeholder.id = 'pf-placeholder-' + track.id;
      placeholder.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);'
        + 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--text-3);'
        + 'z-index:1;white-space:nowrap;transition:opacity 250ms ease;';
      placeholder.textContent = 'Not yet measured';
      barWrap.appendChild(placeholder);

      var fill = document.createElement('div');
      fill.id = 'pf-fill-' + track.id;
      fill.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:0;'
        + 'border-radius:4px;background:' + track.color + ';opacity:0.25;'
        + 'transition:width 600ms ease;';
      barWrap.appendChild(fill);

      var evidenceEl = document.createElement('div');
      evidenceEl.id = 'pf-evidence-' + track.id;
      evidenceEl.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);'
        + 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:' + track.color + ';'
        + 'z-index:2;white-space:nowrap;opacity:0;transition:opacity 300ms ease 280ms;';
      evidenceEl.textContent = track.barText;
      barWrap.appendChild(evidenceEl);

      row.appendChild(barWrap);
      tracksSection.appendChild(row);
    });

    root.appendChild(tracksSection);

    // -- Decision gate: one human approval element, not 4 equal chips --------
    // V26 box rule: a human approval gate is a permitted visual object.
    var gateWrap = document.createElement('div');
    gateWrap.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;';

    var gateLabel = document.createElement('div');
    gateLabel.id = 'pf-gate-label';
    gateLabel.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);'
      + 'opacity:0;transition:opacity 400ms ease;';
    gateLabel.textContent = 'EVIDENCE GATE -- NO OUTCOME PRESELECTED';
    gateWrap.appendChild(gateLabel);

    // Single gate element with internal dividers between options
    var gateEl = document.createElement('div');
    gateEl.id = 'pf-gate-chips';
    gateEl.style.cssText = 'display:flex;flex-direction:row;'
      + 'border:1px solid var(--green);border-radius:3px;overflow:hidden;'
      + 'background:rgba(88,201,148,0.05);opacity:0;transition:opacity 400ms ease;';

    gateOptions.forEach(function(opt, i) {
      var item = document.createElement('div');
      item.style.cssText = 'flex:1;padding:9px 12px;font-family:\'Space Grotesk\',sans-serif;'
        + 'font-size:14px;font-weight:500;color:var(--text-2);text-align:center;'
        + (i > 0 ? 'border-left:1px solid rgba(88,201,148,0.2);' : '');
      item.textContent = opt;
      gateEl.appendChild(item);
    });

    gateWrap.appendChild(gateEl);
    root.appendChild(gateWrap);

    container.appendChild(root);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function highlightNode(nodeId, bgColor, labelColor) {
    var nodeEl = container.querySelector('#pf-node-' + nodeId);
    if (nodeEl) nodeEl.style.background = bgColor + '18';
    var labelEl = container.querySelector('#pf-label-' + nodeId);
    if (labelEl) labelEl.style.color = labelColor || bgColor;
  }

  function placeToken(nodeId) {
    nodes.forEach(function(n) {
      var t = container.querySelector('#pf-token-' + n.id);
      if (t) t.style.opacity = '0';
    });
    var token = container.querySelector('#pf-token-' + nodeId);
    if (token) token.style.opacity = '1';
  }

  function fillTrack(trackId) {
    var fill = container.querySelector('#pf-fill-' + trackId);
    var placeholder = container.querySelector('#pf-placeholder-' + trackId);
    var evidenceEl = container.querySelector('#pf-evidence-' + trackId);
    if (placeholder) placeholder.style.opacity = '0';
    if (fill) requestAnimationFrame(function() { fill.style.width = '100%'; });
    if (evidenceEl) evidenceEl.style.opacity = '1';
  }

  function showFinalFrame() {
    var flowRow = container.querySelector('#pf-flow-row');
    if (flowRow) { flowRow.style.transition = 'none'; flowRow.style.opacity = '1'; }

    nodes.forEach(function(node) {
      var nodeEl = container.querySelector('#pf-node-' + node.id);
      if (nodeEl) { nodeEl.style.transition = 'none'; nodeEl.style.background = node.color + '18'; }
      var labelEl = container.querySelector('#pf-label-' + node.id);
      if (labelEl) { labelEl.style.transition = 'none'; labelEl.style.color = node.labelColor; }
    });

    placeToken('decide');

    tracks.forEach(function(track) {
      var fill = container.querySelector('#pf-fill-' + track.id);
      var placeholder = container.querySelector('#pf-placeholder-' + track.id);
      var evidenceEl = container.querySelector('#pf-evidence-' + track.id);
      if (fill) { fill.style.transition = 'none'; fill.style.width = '100%'; }
      if (placeholder) { placeholder.style.transition = 'none'; placeholder.style.opacity = '0'; }
      if (evidenceEl) { evidenceEl.style.transition = 'none'; evidenceEl.style.opacity = '1'; }
    });

    var gateLabel = container.querySelector('#pf-gate-label');
    if (gateLabel) { gateLabel.style.transition = 'none'; gateLabel.style.opacity = '1'; }
    var chipsRow = container.querySelector('#pf-gate-chips');
    if (chipsRow) { chipsRow.style.transition = 'none'; chipsRow.style.opacity = '1'; }
  }

  // ── Timeline steps ────────────────────────────────────────────────────────

  var steps = [
    // 1. 200ms: process pipeline appears
    { delay: 200, run: function() {
      var el = container.querySelector('#pf-flow-row');
      if (el) el.style.opacity = '1';
    }},
    // 2. 600ms: Baseline activates
    { delay: 600, run: function() {
      highlightNode('baseline', '#4A5064', 'var(--text-2)');
    }},
    // 3. 1000ms: token appears at Baseline
    { delay: 1000, run: function() {
      placeToken('baseline');
    }},
    // 4. 1400ms: Run activates; token moves
    { delay: 1400, run: function() {
      highlightNode('run', '#B44CFF', 'var(--accent)');
      placeToken('run');
    }},
    // 5. 1800ms: Compare activates; token moves
    { delay: 1800, run: function() {
      highlightNode('compare', '#B44CFF', 'var(--accent)');
      placeToken('compare');
    }},
    // 6. 2200ms: Challenge activates; token moves
    { delay: 2200, run: function() {
      highlightNode('challenge', '#F3B34C', 'var(--amber)');
      placeToken('challenge');
    }},
    // 7. 2600ms: Decide activates; gate label appears
    { delay: 2600, run: function() {
      highlightNode('decide', '#58C994', 'var(--green)');
      placeToken('decide');
      var gl = container.querySelector('#pf-gate-label');
      if (gl) gl.style.opacity = '1';
    }},
    // 8. 3200ms: Speed fills
    { delay: 3200, run: function() { fillTrack('speed'); }},
    // 9. 3800ms: Quality fills
    { delay: 3800, run: function() { fillTrack('quality'); }},
    // 10. 4400ms: Control fills
    { delay: 4400, run: function() { fillTrack('control'); }},
    // 11. 5000ms: Adoption fills
    { delay: 5000, run: function() { fillTrack('adoption'); }},
    // 12. 5600ms: Economics fills
    { delay: 5600, run: function() { fillTrack('economics'); }},
    // 13. 6200ms: gate appears + complete
    { delay: 6200, run: function() {
      var el = container.querySelector('#pf-gate-chips');
      if (el) el.style.opacity = '1';
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 500));
    }}
  ];

  var tl = createTimeline(steps);

  // ── Public API ────────────────────────────────────────────────────────────

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showFinalFrame(); return; }
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
      showFinalFrame();
    },
    getAccessibleSummary: function() {
      return 'A proof pipeline runs an obligation through five stages: Baseline, Run, Compare, Challenge, and Decide. Five evidence tracks -- Speed, Quality, Control, Adoption, and Economics -- fill progressively. A human approval gate presents four options with no outcome preselected.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
