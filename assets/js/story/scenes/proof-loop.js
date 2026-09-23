// Scene: proof-loop (Screen 07)
// V26: Evidence test rig. Five stages run as one connected pipeline strip.
// Five evidence tracks fill as MetricStrips. Gate is a human approval element --
// displayed alongside the tracks so the decision context is always visible.
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
    {
      label: 'Stop and review',
      sub:   'Evidence does not support continuation. Pause and investigate the gap.'
    },
    {
      label: 'Refine approach',
      sub:   'Sufficient signal but model or process needs adjustment before re-running.'
    },
    {
      label: 'Repeat proof',
      sub:   'Promising result but sample or scope is insufficient. Run again with more data.'
    },
    {
      label: 'Controlled scale',
      sub:   'Evidence supports expansion to wider scope under defined governance conditions.'
    }
  ];

  // ── DOM construction ──────────────────────────────────────────────────────

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:12px;padding:8px 0;';

    // -- Process pipeline: one connected strip --------------------------------
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

      var token = document.createElement('div');
      token.id = 'pf-token-' + node.id;
      token.style.cssText = 'width:8px;height:8px;border-radius:4px;background:#7C4DFF;'
        + 'opacity:0;transition:opacity 280ms ease;flex-shrink:0;';
      stepEl.appendChild(token);

      pipeWrap.appendChild(stepEl);
    });

    root.appendChild(pipeWrap);

    // -- Body row: tracks (left) + gate (right) side by side ------------------
    var bodyRow = document.createElement('div');
    bodyRow.style.cssText = 'display:flex;flex-direction:row;gap:0;flex:1;min-height:0;';

    // Left: evidence tracks
    var tracksSection = document.createElement('div');
    tracksSection.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:8px;padding-right:18px;';

    var tracksHeading = document.createElement('div');
    tracksHeading.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:2px;';
    tracksHeading.textContent = 'EVIDENCE COLLECTED';
    tracksSection.appendChild(tracksHeading);

    tracks.forEach(function(track) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:10px;';

      var labelEl = document.createElement('div');
      labelEl.style.cssText = 'width:92px;font-family:\'Space Grotesk\',sans-serif;'
        + 'font-size:14px;font-weight:700;color:' + track.color + ';flex-shrink:0;';
      labelEl.textContent = track.label;
      row.appendChild(labelEl);

      var barWrap = document.createElement('div');
      barWrap.style.cssText = 'flex:1;background:var(--surface-2);border-radius:4px;'
        + 'height:30px;position:relative;overflow:hidden;';

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

    bodyRow.appendChild(tracksSection);

    // Right: gate section -- always visible alongside the tracks
    var gateWrap = document.createElement('div');
    gateWrap.style.cssText = 'flex:0 0 270px;display:flex;flex-direction:column;gap:10px;'
      + 'padding-left:18px;border-left:1px solid var(--border-1);';

    // Gate header
    var gateHeaderWrap = document.createElement('div');
    gateHeaderWrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;opacity:0;transition:opacity 500ms ease;';
    gateHeaderWrap.id = 'pf-gate-header';

    var gateIconRow = document.createElement('div');
    gateIconRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

    var gateIcon = document.createElement('div');
    gateIcon.style.cssText = 'width:32px;height:32px;border-radius:7px;background:rgba(88,201,148,.12);'
      + 'border:1px solid rgba(88,201,148,.30);display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    gateIcon.innerHTML = '<i class="ti ti-user-check" style="font-size:17px;color:var(--green)"></i>';

    var gateLabel = document.createElement('div');
    gateLabel.id = 'pf-gate-label';
    gateLabel.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:var(--green);line-height:1.2;';
    gateLabel.innerHTML = 'EVIDENCE GATE<br><span style="color:var(--text-3);font-size:8px;letter-spacing:.06em">HUMAN DECISION POINT</span>';

    gateIconRow.appendChild(gateIcon);
    gateIconRow.appendChild(gateLabel);
    gateHeaderWrap.appendChild(gateIconRow);

    var gateSub = document.createElement('div');
    gateSub.style.cssText = 'font-size:12px;color:var(--text-2);line-height:1.5;'
      + 'border-left:2px solid rgba(88,201,148,.30);padding-left:8px;';
    gateSub.textContent = 'Once the evidence above is assembled, a decision-maker reviews each dimension and selects the next move. The AI does not determine the outcome.';
    gateHeaderWrap.appendChild(gateSub);

    gateWrap.appendChild(gateHeaderWrap);

    // Gate options
    var gateOptions_el = document.createElement('div');
    gateOptions_el.id = 'pf-gate-chips';
    gateOptions_el.style.cssText = 'display:flex;flex-direction:column;gap:6px;'
      + 'opacity:0;transition:opacity 500ms ease;';

    gateOptions.forEach(function(opt, i) {
      var item = document.createElement('div');
      item.style.cssText = 'padding:8px 10px;border-radius:5px;'
        + 'border:1px solid rgba(88,201,148,0.22);background:rgba(88,201,148,0.04);';

      var itemLabel = document.createElement('div');
      itemLabel.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;'
        + 'font-weight:700;color:var(--text-1);margin-bottom:2px;';
      itemLabel.textContent = opt.label;

      var itemSub = document.createElement('div');
      itemSub.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;'
        + 'color:var(--text-3);line-height:1.4;';
      itemSub.textContent = opt.sub;

      item.appendChild(itemLabel);
      item.appendChild(itemSub);
      gateOptions_el.appendChild(item);
    });

    gateWrap.appendChild(gateOptions_el);

    bodyRow.appendChild(gateWrap);
    root.appendChild(bodyRow);

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

    var gateHeader = container.querySelector('#pf-gate-header');
    if (gateHeader) { gateHeader.style.transition = 'none'; gateHeader.style.opacity = '1'; }
    var chipsRow = container.querySelector('#pf-gate-chips');
    if (chipsRow) { chipsRow.style.transition = 'none'; chipsRow.style.opacity = '1'; }
  }

  // ── Timeline steps ────────────────────────────────────────────────────────

  var steps = [
    // 1. 200ms: pipeline appears
    { delay: 200, run: function() {
      var el = container.querySelector('#pf-flow-row');
      if (el) el.style.opacity = '1';
    }},
    // 2. 600ms: Baseline activates
    { delay: 600, run: function() {
      highlightNode('baseline', '#4A5064', 'var(--text-2)');
    }},
    // 3. 1000ms: token at Baseline
    { delay: 1000, run: function() {
      placeToken('baseline');
    }},
    // 4. 1400ms: Run activates
    { delay: 1400, run: function() {
      highlightNode('run', '#B44CFF', 'var(--accent)');
      placeToken('run');
    }},
    // 5. 1800ms: Compare activates
    { delay: 1800, run: function() {
      highlightNode('compare', '#B44CFF', 'var(--accent)');
      placeToken('compare');
    }},
    // 6. 2200ms: Challenge activates
    { delay: 2200, run: function() {
      highlightNode('challenge', '#F3B34C', 'var(--amber)');
      placeToken('challenge');
    }},
    // 7. 2600ms: Decide activates; gate header appears alongside
    { delay: 2600, run: function() {
      highlightNode('decide', '#58C994', 'var(--green)');
      placeToken('decide');
      var gh = container.querySelector('#pf-gate-header');
      if (gh) gh.style.opacity = '1';
    }},
    // 8. 3200ms: Speed fills
    { delay: 3200, run: function() { fillTrack('speed'); }},
    // 9. 3800ms: Quality fills
    { delay: 3800, run: function() { fillTrack('quality'); }},
    // 10. 4400ms: Control fills
    { delay: 4400, run: function() { fillTrack('control'); }},
    // 11. 5000ms: Adoption fills
    { delay: 5000, run: function() { fillTrack('adoption'); }},
    // 12. 5600ms: Economics fills; gate options appear
    { delay: 5600, run: function() {
      fillTrack('economics');
      var el = container.querySelector('#pf-gate-chips');
      if (el) el.style.opacity = '1';
    }},
    // 13. 6400ms: complete
    { delay: 6400, run: function() {
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 400));
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
    renderStatic: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showFinalFrame();
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
      showFinalFrame();
    },
    seek: function(p) {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (p >= 1) { showFinalFrame(); return; }
      var el = container.querySelector('#pf-flow-row');
      if (el) el.style.opacity = '1';
      var stepsToShow = Math.floor(p * nodes.length);
      nodes.slice(0, stepsToShow).forEach(function(node) {
        highlightNode(node.id, node.color, node.labelColor);
      });
      var tracksToFill = Math.floor(Math.max(0, p - 0.5) / 0.5 * tracks.length);
      tracks.slice(0, tracksToFill).forEach(function(track) { fillTrack(track.id); });
    },
    getAccessibleSummary: function() {
      return 'A proof pipeline runs an obligation through five stages: Baseline, Run, Compare, Challenge, and Decide. Five evidence tracks fill progressively. An evidence gate presents four human-selected paths -- Stop and review, Refine approach, Repeat proof, or Controlled scale -- with no outcome preselected. A human decision-maker reviews the evidence and chooses.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
