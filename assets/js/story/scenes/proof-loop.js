// Scene: proof-loop (Screen 07 - HOW TO PROVE)
// V15 overhaul: proof console -- left side shows the case steps, right side shows
// five evidence tracks starting as NOT YET MEASURED. Decision gate at bottom.
// No fictional results. No preselected success state.
SceneDirector.register('proof-loop', function(container, manifest, reduced) {

  var processSteps = [
    { id: 'baseline', label: 'Baseline',  icon: 'ti-clipboard-data', note: 'Record the current process performance' },
    { id: 'run',      label: 'Run',       icon: 'ti-player-play',    note: 'Process OBL-27 through the AI path'   },
    { id: 'compare',  label: 'Compare',   icon: 'ti-git-compare',    note: 'Compare AI output to analyst sample'  },
    { id: 'challenge',label: 'Challenge', icon: 'ti-user-check',     note: 'Analyst reviews and challenges draft' },
    { id: 'decide',   label: 'Decide',    icon: 'ti-scale',          note: 'Sufficient evidence to continue?'     }
  ];

  var tracks = [
    { id: 'speed',     label: 'Speed',     icon: 'ti-clock',        color: 'var(--cyan)',    evidence: 'Timestamp pair recorded'               },
    { id: 'quality',   label: 'Quality',   icon: 'ti-star',         color: 'var(--accent)', evidence: 'Expert agreement check logged'          },
    { id: 'control',   label: 'Control',   icon: 'ti-shield-check', color: 'var(--green)',  evidence: 'Provenance and approval record'         },
    { id: 'adoption',  label: 'Adoption',  icon: 'ti-users',        color: 'var(--amber)',  evidence: 'Reviewer completion and override log'   },
    { id: 'economics', label: 'Economics', icon: 'ti-coin',         color: 'var(--pink)',   evidence: 'Measured effort and run cost fields'    }
  ];

  var UNMEASURED = 'NOT YET MEASURED';

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // Two-column grid: process steps | evidence tracks
    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;flex:1;min-height:0;';

    // Left: process steps column
    var leftCol = document.createElement('div');
    leftCol.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var leftHdr = document.createElement('div');
    leftHdr.className = 'scene-node';
    leftHdr.dataset.beat = 'left-hdr';
    leftHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;'
      + 'color:var(--text-3);padding:4px 0;border-bottom:1px solid var(--border-1);margin-bottom:2px;';
    leftHdr.textContent = 'Case: OBL-27 -- Art. 7(3) Coverage mapping';
    leftCol.appendChild(leftHdr);

    processSteps.forEach(function(step) {
      var row = document.createElement('div');
      row.className = 'scene-node';
      row.dataset.beat = 'step-' + step.id;
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;'
        + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;'
        + 'transition:border-color 300ms,background 300ms;';
      row.innerHTML =
        '<i class="ti ' + step.icon + '" style="font-size:16px;color:var(--text-3);flex-shrink:0"></i>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1)">' + step.label + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);line-height:1.3">' + step.note + '</div>'
        + '</div>';
      leftCol.appendChild(row);
    });

    // Right: evidence tracks column
    var rightCol = document.createElement('div');
    rightCol.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var rightHdr = document.createElement('div');
    rightHdr.className = 'scene-node';
    rightHdr.dataset.beat = 'right-hdr';
    rightHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;'
      + 'color:var(--text-3);padding:4px 0;border-bottom:1px solid var(--border-1);margin-bottom:2px;';
    rightHdr.textContent = 'Evidence tracks';
    rightCol.appendChild(rightHdr);

    tracks.forEach(function(track) {
      var row = document.createElement('div');
      row.className = 'scene-node';
      row.dataset.beat = 'track-init-' + track.id;
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;'
        + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;'
        + 'transition:border-color 400ms,background 400ms;';

      row.innerHTML =
        '<i class="ti ' + track.icon + '" style="font-size:16px;color:' + track.color + ';flex-shrink:0"></i>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:' + track.color + '">' + track.label + '</div>'
        + '<div class="track-status" style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-3);letter-spacing:.05em">' + UNMEASURED + '</div>'
        + '</div>';
      rightCol.appendChild(row);
    });

    cols.appendChild(leftCol);
    cols.appendChild(rightCol);
    outer.appendChild(cols);

    // Decision gate
    var gate = document.createElement('div');
    gate.className = 'scene-node';
    gate.dataset.beat = 'gate';
    gate.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:12px;padding:10px 14px;'
      + 'background:rgba(52,57,73,.5);border:1px solid var(--border-1);border-radius:7px;';
    gate.innerHTML =
      '<i class="ti ti-gate" style="font-size:18px;color:var(--text-3);flex-shrink:0"></i>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:3px">Decision gate</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-1)">Is the evidence sufficient for a controlled next step?</div>'
      + '</div>'
      + '<div style="margin-left:auto;display:flex;gap:6px;">'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:3px;border:1px solid var(--border-1);color:var(--text-3);">Stop</span>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:3px;border:1px solid var(--border-1);color:var(--text-3);">Refine</span>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:3px;border:1px solid var(--border-1);color:var(--text-3);">Scale</span>'
      + '</div>';
    outer.appendChild(gate);

    container.appendChild(outer);
  }

  function activateStep(stepId, color) {
    var row = container.querySelector('[data-beat="step-' + stepId + '"]');
    if (row) {
      row.style.borderColor = color || 'var(--accent)';
      row.style.background = 'rgba(180,76,255,.06)';
      var ico = row.querySelector('.ti');
      if (ico) ico.style.color = color || 'var(--accent)';
    }
  }

  function populateTrack(trackId, evidenceText, trackColor) {
    var row = container.querySelector('[data-beat="track-init-' + trackId + '"]');
    if (!row) return;
    var status = row.querySelector('.track-status');
    if (status) {
      status.textContent = evidenceText;
      status.style.color = trackColor;
    }
    row.style.borderColor = trackColor;
    row.style.background = 'rgba(0,0,0,.1)';
  }

  var steps = [
    { delay: 300, run: function() {
      var lh = container.querySelector('[data-beat="left-hdr"]');
      if (lh) lh.classList.add('visible');
      var rh = container.querySelector('[data-beat="right-hdr"]');
      if (rh) rh.classList.add('visible');
    }},
    { delay: 700, run: function() {
      var n = container.querySelector('[data-beat="step-baseline"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 1200, run: function() {
      activateStep('baseline', 'var(--cyan)');
      var n = container.querySelector('[data-beat="step-run"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 1800, run: function() {
      activateStep('run', 'var(--accent)');
      var n = container.querySelector('[data-beat="step-compare"]');
      if (n) n.classList.add('visible');
      // Speed and quality tracks land
      var t1 = container.querySelector('[data-beat="track-init-speed"]');
      if (t1) t1.classList.add('visible');
      var t2 = container.querySelector('[data-beat="track-init-quality"]');
      if (t2) t2.classList.add('visible');
      populateTrack('speed',   'Timestamp pair recorded',    'var(--cyan)');
    }},
    { delay: 2500, run: function() {
      activateStep('compare', 'var(--accent)');
      populateTrack('quality', 'Expert agreement check logged', 'var(--accent)');
      var t3 = container.querySelector('[data-beat="track-init-control"]');
      if (t3) t3.classList.add('visible');
      populateTrack('control', 'Provenance and approval record', 'var(--green)');
    }},
    { delay: 3300, run: function() {
      var n = container.querySelector('[data-beat="step-challenge"]');
      if (n) n.classList.add('visible');
      activateStep('challenge', 'var(--amber)');
      var t4 = container.querySelector('[data-beat="track-init-adoption"]');
      if (t4) t4.classList.add('visible');
      populateTrack('adoption', 'Reviewer completion and override log', 'var(--amber)');
    }},
    { delay: 4200, run: function() {
      var n = container.querySelector('[data-beat="step-decide"]');
      if (n) n.classList.add('visible');
      var t5 = container.querySelector('[data-beat="track-init-economics"]');
      if (t5) t5.classList.add('visible');
      populateTrack('economics', 'Measured effort and run cost fields', 'var(--pink)');
    }},
    { delay: 5000, run: function() {
      var g = container.querySelector('[data-beat="gate"]');
      if (g) g.classList.add('visible');
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
      processSteps.forEach(function(s) { activateStep(s.id, 'var(--accent)'); });
      tracks.forEach(function(t) { populateTrack(t.id, t.evidence, t.color); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
