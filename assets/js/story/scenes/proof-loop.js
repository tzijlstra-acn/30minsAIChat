// Scene: proof-loop (Screen 07 -- V19 proof console)
// Process flow + five evidence tracks + neutral 4-option gate.
// No fictional results. No preselected outcome.
SceneDirector.register('proof-loop', function(container, manifest, reduced) {

  var _timers = [];

  var nodes = [
    { id: 'baseline',  label: 'Baseline',  border: '#4A5064',      label_color: 'var(--text-2)' },
    { id: 'run',       label: 'Run',        border: 'var(--accent)', label_color: 'var(--accent)' },
    { id: 'compare',   label: 'Compare',    border: 'var(--accent)', label_color: 'var(--accent)' },
    { id: 'challenge', label: 'Challenge',  border: 'var(--amber)',  label_color: 'var(--amber)'  },
    { id: 'decide',    label: 'Decide',     border: 'var(--green)',  label_color: 'var(--green)'  }
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

    // -- Process flow row --------------------------------------------------
    var flowRow = document.createElement('div');
    flowRow.id = 'pf-flow-row';
    flowRow.style.cssText = [
      'display:flex',
      'flex-direction:row',
      'align-items:stretch',
      'gap:4px',
      'opacity:0',
      'transition:opacity 400ms ease'
    ].join(';');

    nodes.forEach(function(node, i) {
      var nodeEl = document.createElement('div');
      nodeEl.id = 'pf-node-' + node.id;
      nodeEl.style.cssText = [
        'background:var(--surface-1)',
        'border:1px solid var(--border-1)',
        'border-radius:8px',
        'padding:10px 14px',
        'min-width:120px',
        'flex:1',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'gap:6px',
        'transition:border-color 400ms ease, box-shadow 400ms ease'
      ].join(';');

      var labelEl = document.createElement('div');
      labelEl.id = 'pf-label-' + node.id;
      labelEl.style.cssText = [
        'font-family:\'Space Grotesk\',sans-serif',
        'font-size:14px',
        'font-weight:700',
        'color:var(--text-2)',
        'transition:color 400ms ease'
      ].join(';');
      labelEl.textContent = node.label;
      nodeEl.appendChild(labelEl);

      // Obligation token (purple pill, 12px height) -- hidden until activated
      var token = document.createElement('div');
      token.id = 'pf-token-' + node.id;
      token.style.cssText = [
        'height:12px',
        'width:38px',
        'border-radius:6px',
        'background:#7C4DFF',
        'opacity:0',
        'transition:opacity 280ms ease'
      ].join(';');
      nodeEl.appendChild(token);

      flowRow.appendChild(nodeEl);

      // Arrow connector (not after last node)
      if (i < nodes.length - 1) {
        var arrow = document.createElement('div');
        arrow.style.cssText = [
          'display:flex',
          'align-items:center',
          'justify-content:center',
          'color:var(--text-3)',
          'font-size:14px',
          'flex-shrink:0',
          'padding:0 2px',
          'user-select:none'
        ].join(';');
        arrow.textContent = '→';
        flowRow.appendChild(arrow);
      }
    });

    root.appendChild(flowRow);

    // -- Evidence tracks ---------------------------------------------------
    var tracksSection = document.createElement('div');
    tracksSection.style.cssText = 'display:flex;flex-direction:column;gap:8px;flex:1;';

    tracks.forEach(function(track) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:10px;';

      var labelEl = document.createElement('div');
      labelEl.style.cssText = [
        'width:120px',
        'font-family:\'Space Grotesk\',sans-serif',
        'font-size:14px',
        'font-weight:700',
        'color:' + track.color,
        'flex-shrink:0'
      ].join(';');
      labelEl.textContent = track.label;
      row.appendChild(labelEl);

      // Bar wrapper
      var barWrap = document.createElement('div');
      barWrap.style.cssText = [
        'flex:1',
        'background:var(--surface-2)',
        'border-radius:4px',
        'height:32px',
        'position:relative',
        'overflow:hidden'
      ].join(';');

      // "Not yet measured" placeholder text
      var placeholder = document.createElement('div');
      placeholder.id = 'pf-placeholder-' + track.id;
      placeholder.style.cssText = [
        'position:absolute',
        'left:10px',
        'top:50%',
        'transform:translateY(-50%)',
        'font-family:\'JetBrains Mono\',monospace',
        'font-size:11px',
        'color:var(--text-3)',
        'z-index:1',
        'white-space:nowrap',
        'transition:opacity 250ms ease'
      ].join(';');
      placeholder.textContent = 'Not yet measured';
      barWrap.appendChild(placeholder);

      // Fill bar (width animates 0 -> 100%)
      var fill = document.createElement('div');
      fill.id = 'pf-fill-' + track.id;
      fill.style.cssText = [
        'position:absolute',
        'left:0',
        'top:0',
        'height:100%',
        'width:0',
        'border-radius:4px',
        'background:' + track.color,
        'opacity:0.25',
        'transition:width 600ms ease'
      ].join(';');
      barWrap.appendChild(fill);

      // Evidence label (fades in after fill starts)
      var evidenceEl = document.createElement('div');
      evidenceEl.id = 'pf-evidence-' + track.id;
      evidenceEl.style.cssText = [
        'position:absolute',
        'left:10px',
        'top:50%',
        'transform:translateY(-50%)',
        'font-family:\'JetBrains Mono\',monospace',
        'font-size:11px',
        'color:' + track.color,
        'z-index:2',
        'white-space:nowrap',
        'opacity:0',
        'transition:opacity 300ms ease 280ms'
      ].join(';');
      evidenceEl.textContent = track.barText;
      barWrap.appendChild(evidenceEl);

      row.appendChild(barWrap);
      tracksSection.appendChild(row);
    });

    root.appendChild(tracksSection);

    // -- Decision gate -----------------------------------------------------
    var gateWrap = document.createElement('div');
    gateWrap.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:8px;';

    // Gate label (appears at step 7, 2600ms)
    var gateLabel = document.createElement('div');
    gateLabel.id = 'pf-gate-label';
    gateLabel.style.cssText = [
      'font-family:\'JetBrains Mono\',monospace',
      'font-size:9px',
      'letter-spacing:.12em',
      'text-transform:uppercase',
      'color:var(--text-3)',
      'opacity:0',
      'transition:opacity 400ms ease'
    ].join(';');
    gateLabel.textContent = 'EVIDENCE GATE -- NO OUTCOME PRESELECTED';
    gateWrap.appendChild(gateLabel);

    // Gate chips row (appears at step 13, 6200ms)
    var chipsRow = document.createElement('div');
    chipsRow.id = 'pf-gate-chips';
    chipsRow.style.cssText = [
      'display:flex',
      'flex-direction:row',
      'gap:10px',
      'opacity:0',
      'transition:opacity 400ms ease'
    ].join(';');

    gateOptions.forEach(function(opt) {
      var chip = document.createElement('div');
      chip.style.cssText = [
        'font-family:\'Space Grotesk\',sans-serif',
        'font-size:14px',
        'font-weight:500',
        'color:var(--text-2)',
        'border:1px solid var(--border-1)',
        'border-radius:6px',
        'padding:8px 14px',
        'flex:1',
        'text-align:center',
        'user-select:none'
      ].join(';');
      chip.textContent = opt;
      chipsRow.appendChild(chip);
    });

    gateWrap.appendChild(chipsRow);
    root.appendChild(gateWrap);

    container.appendChild(root);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function highlightNode(nodeId, borderColor, labelColor) {
    var nodeEl = container.querySelector('#pf-node-' + nodeId);
    if (nodeEl) {
      nodeEl.style.borderColor = borderColor;
      nodeEl.style.boxShadow = '0 0 0 2px ' + borderColor + '44';
    }
    var labelEl = container.querySelector('#pf-label-' + nodeId);
    if (labelEl) labelEl.style.color = labelColor || borderColor;
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
    if (fill) {
      requestAnimationFrame(function() {
        fill.style.width = '100%';
      });
    }
    if (evidenceEl) evidenceEl.style.opacity = '1';
  }

  function showFinalFrame() {
    // Remove transitions for instant reveal
    var flowRow = container.querySelector('#pf-flow-row');
    if (flowRow) { flowRow.style.transition = 'none'; flowRow.style.opacity = '1'; }

    nodes.forEach(function(node) {
      var nodeEl = container.querySelector('#pf-node-' + node.id);
      if (nodeEl) { nodeEl.style.transition = 'none'; nodeEl.style.borderColor = node.border; nodeEl.style.boxShadow = '0 0 0 2px ' + node.border + '44'; }
      var labelEl = container.querySelector('#pf-label-' + node.id);
      if (labelEl) { labelEl.style.transition = 'none'; labelEl.style.color = node.label_color; }
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
    // 1. 200ms: process flow appears
    { delay: 200, run: function() {
      var el = container.querySelector('#pf-flow-row');
      if (el) el.style.opacity = '1';
    }},
    // 2. 600ms: Baseline highlights
    { delay: 600, run: function() {
      highlightNode('baseline', '#4A5064', 'var(--text-2)');
    }},
    // 3. 1000ms: token appears at Baseline
    { delay: 1000, run: function() {
      placeToken('baseline');
    }},
    // 4. 1400ms: Run highlights; token at Run
    { delay: 1400, run: function() {
      highlightNode('run', 'var(--accent)', 'var(--accent)');
      placeToken('run');
    }},
    // 5. 1800ms: Compare highlights; token at Compare
    { delay: 1800, run: function() {
      highlightNode('compare', 'var(--accent)', 'var(--accent)');
      placeToken('compare');
    }},
    // 6. 2200ms: Challenge highlights; token at Challenge
    { delay: 2200, run: function() {
      highlightNode('challenge', 'var(--amber)', 'var(--amber)');
      placeToken('challenge');
    }},
    // 7. 2600ms: Decide highlights; token at Decide; gate label appears
    { delay: 2600, run: function() {
      highlightNode('decide', 'var(--green)', 'var(--green)');
      placeToken('decide');
      var gl = container.querySelector('#pf-gate-label');
      if (gl) gl.style.opacity = '1';
    }},
    // 8. 3200ms: Speed fills
    { delay: 3200, run: function() {
      fillTrack('speed');
    }},
    // 9. 3800ms: Quality fills
    { delay: 3800, run: function() {
      fillTrack('quality');
    }},
    // 10. 4400ms: Control fills
    { delay: 4400, run: function() {
      fillTrack('control');
    }},
    // 11. 5000ms: Adoption fills
    { delay: 5000, run: function() {
      fillTrack('adoption');
    }},
    // 12. 5600ms: Economics fills
    { delay: 5600, run: function() {
      fillTrack('economics');
    }},
    // 13. 6200ms: gate chips appear + complete
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
      build();
      tl.play();
    },
    pause:  tl.pause,
    resume: tl.resume,
    reset: function() {
      build();
      tl.reset();
    },
    finish: function() {
      tl.reset();
      build();
      showFinalFrame();
    },
    getAccessibleSummary: function() {
      return 'A proof loop runs an obligation through five stages: Baseline, Run, Compare, Challenge, and Decide. Five evidence tracks -- Speed, Quality, Control, Adoption, and Economics -- fill progressively. The gate presents four options with no outcome preselected.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
