// Scene: proof-loop (Screen 07)
// V30: Evidence test bench. Obligation runs through five stages.
// Validation-as-a-Service pattern: AI first pass surfaces findings,
// expert challenge resolves open items, evidence pack assembles stage by stage.
SceneDirector.register('proof-loop', function(container, manifest, reduced) {

  var C_CYAN   = '#55C7E8';
  var C_ACCENT = '#B44CFF';
  var C_AMBER  = '#F3B34C';
  var C_GREEN  = '#58C994';
  var C_PINK   = '#F0758A';
  var C_GREY   = '#4A5064';
  var C_TEXT2  = 'var(--text-2)';
  var C_TEXT3  = 'var(--text-3)';
  var C_SURF1  = 'var(--surface-1)';
  var C_SURF2  = 'var(--surface-2)';
  var C_BDR1   = 'var(--border-1)';

  var stages = [
    { id: 'baseline',  label: 'BASELINE',        color: C_GREY,   lcol: C_TEXT2   },
    { id: 'aipass',    label: 'AI FIRST PASS',   color: C_ACCENT, lcol: C_ACCENT  },
    { id: 'challenge', label: 'EXPERT CHALLENGE', color: C_AMBER,  lcol: C_AMBER   },
    { id: 'evidence',  label: 'EVIDENCE',         color: C_GREEN,  lcol: C_GREEN   },
    { id: 'decision',  label: 'DECISION',         color: C_GREEN,  lcol: C_GREEN   }
  ];

  var findings = [
    { id: 'f0', text: 'Clause scope',      stateA: 'confirmed',  colA: C_GREEN, stateB: 'confirmed',  colB: C_GREEN },
    { id: 'f1', text: 'Evidence standard', stateA: 'unresolved', colA: C_AMBER, stateB: 'defined',    colB: C_GREEN },
    { id: 'f2', text: 'Policy link',       stateA: 'incomplete', colA: C_AMBER, stateB: 'completed',  colB: C_GREEN }
  ];

  var tracks = [
    { id: 'speed',     label: 'Speed',                    color: C_CYAN,   fillText: 'Processing time recorded'  },
    { id: 'quality',   label: 'Quality',                  color: C_ACCENT, fillText: 'Expert agreement logged'   },
    { id: 'control',   label: 'Control and traceability', color: C_GREEN,  fillText: 'Provenance complete'       },
    { id: 'adoption',  label: 'Adoption',                 color: C_AMBER,  fillText: 'Reviewer log complete'     },
    { id: 'economics', label: 'Economics',                color: C_PINK,   fillText: 'Run cost recorded'         }
  ];

  var gateOptions = [
    { label: 'Stop',             sub: 'Evidence does not support continuation. Pause and investigate.' },
    { label: 'Refine',           sub: 'Adjust the model or process and re-test.'                      },
    { label: 'Repeat',           sub: 'Expand sample or scope and run again.'                         },
    { label: 'Controlled scale', sub: 'Evidence supports expansion under defined governance.'         }
  ];

  var _timers = [];

  function _t(fn, delay) { var id = setTimeout(fn, delay); _timers.push(id); return id; }
  function q(id) { return container.querySelector('#pl-' + id); }
  function show(id) { var el = q(id); if (el) el.style.opacity = '1'; }

  function activateStage(stageId) {
    var s = stages.filter(function(x) { return x.id === stageId; })[0];
    if (!s) return;
    var el = q('stage-' + stageId);
    if (el) el.style.background = s.color + '1A';
    var lbl = q('stlabel-' + stageId);
    if (lbl) lbl.style.color = s.lcol;
    stages.forEach(function(other) {
      var od = q('dot-' + other.id);
      if (od) od.style.opacity = other.id === stageId ? '1' : '0';
    });
  }

  function showFinding(fId, stateKey) {
    var f = findings.filter(function(x) { return x.id === fId; })[0];
    if (!f) return;
    var chip = q('finding-' + fId); if (!chip) return;
    chip.style.opacity = '1';
    var isB  = stateKey === 'B';
    var col  = isB ? f.colB : f.colA;
    var text = isB ? f.stateB : f.stateA;
    var dot  = q('fdot-' + fId);   if (dot)  dot.style.background  = col;
    var stEl = q('fstate-' + fId); if (stEl) { stEl.style.color = col; stEl.textContent = text; }
    if (isB || col === C_GREEN) {
      chip.style.borderColor = 'rgba(88,201,148,.30)';
      chip.style.background  = 'rgba(88,201,148,.06)';
    } else {
      chip.style.borderColor = 'rgba(243,179,76,.30)';
      chip.style.background  = 'rgba(243,179,76,.06)';
    }
  }

  function fillTrack(trackId) {
    var ph   = q('ph-' + trackId);   if (ph)   ph.style.opacity = '0';
    var fill = q('fill-' + trackId);
    if (fill) {
      fill.style.transition = 'width 650ms cubic-bezier(.25,1,.25,1)';
      requestAnimationFrame(function() { fill.style.width = '100%'; });
    }
    var ftxt = q('ftxt-' + trackId); if (ftxt) ftxt.style.opacity = '1';
  }

  function showAll() {
    show('flow');
    stages.forEach(function(s) { activateStage(s.id); });
    show('findings');
    findings.forEach(function(f) { showFinding(f.id, 'B'); });
    tracks.forEach(function(t) { fillTrack(t.id); });
    show('gate-hdr');
    show('gate-chips');
  }

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:8px;'
      + 'padding:4px 0;box-sizing:border-box;';

    // ── Process flow strip ─────────────────────────────────────────────────
    var flowRow = document.createElement('div');
    flowRow.id = 'pl-flow';
    flowRow.style.cssText = 'display:flex;flex-direction:row;height:46px;flex-shrink:0;'
      + 'background:' + C_SURF1 + ';border:1px solid ' + C_BDR1 + ';border-radius:4px;'
      + 'overflow:hidden;opacity:0;transition:opacity 400ms ease;';

    stages.forEach(function(s, i) {
      var el = document.createElement('div');
      el.id = 'pl-stage-' + s.id;
      el.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;'
        + 'justify-content:center;gap:3px;'
        + (i > 0 ? 'border-left:1px solid ' + C_BDR1 + ';' : '')
        + 'transition:background 400ms ease;';

      var lbl = document.createElement('div');
      lbl.id = 'pl-stlabel-' + s.id;
      lbl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:8.5px;font-weight:700;'
        + 'letter-spacing:.09em;color:' + C_TEXT3 + ';transition:color 400ms ease;text-align:center;';
      lbl.textContent = s.label;
      el.appendChild(lbl);

      var dot = document.createElement('div');
      dot.id = 'pl-dot-' + s.id;
      dot.style.cssText = 'width:5px;height:5px;border-radius:3px;background:' + s.color + ';'
        + 'opacity:0;transition:opacity 300ms ease;flex-shrink:0;';
      el.appendChild(dot);

      flowRow.appendChild(el);
    });
    root.appendChild(flowRow);

    // ── AI findings strip ──────────────────────────────────────────────────
    var findingsRow = document.createElement('div');
    findingsRow.id = 'pl-findings';
    findingsRow.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;'
      + 'flex-shrink:0;opacity:0;transition:opacity 400ms ease;';

    var flbl = document.createElement('div');
    flbl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:8.5px;'
      + 'letter-spacing:.12em;color:' + C_TEXT3 + ';white-space:nowrap;flex-shrink:0;';
    flbl.textContent = 'AI FINDINGS';
    findingsRow.appendChild(flbl);

    findings.forEach(function(f) {
      var chip = document.createElement('div');
      chip.id = 'pl-finding-' + f.id;
      chip.style.cssText = 'display:flex;align-items:center;gap:5px;padding:3px 9px;'
        + 'border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);'
        + 'opacity:0;transition:opacity 300ms ease,border-color 400ms ease,background 400ms ease;flex-shrink:0;';

      var dot = document.createElement('div');
      dot.id = 'pl-fdot-' + f.id;
      dot.style.cssText = 'width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.18);'
        + 'flex-shrink:0;transition:background 400ms ease;';
      chip.appendChild(dot);

      var txt = document.createElement('span');
      txt.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:12px;font-weight:600;'
        + 'color:' + C_TEXT2 + ';white-space:nowrap;';
      txt.textContent = f.text;
      chip.appendChild(txt);

      var stEl = document.createElement('span');
      stEl.id = 'pl-fstate-' + f.id;
      stEl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:8.5px;'
        + 'color:rgba(255,255,255,.28);white-space:nowrap;transition:color 400ms ease;';
      stEl.textContent = f.stateA;
      chip.appendChild(stEl);

      findingsRow.appendChild(chip);
    });
    root.appendChild(findingsRow);

    // ── Body: evidence tracks left, gate right ────────────────────────────
    var bodyRow = document.createElement('div');
    bodyRow.style.cssText = 'display:flex;flex-direction:row;flex:1;min-height:0;gap:0;';

    // Left: evidence tracks
    var tracksDiv = document.createElement('div');
    tracksDiv.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:8px;padding-right:20px;';

    var tracksHdr = document.createElement('div');
    tracksHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:8.5px;'
      + 'letter-spacing:.14em;color:' + C_TEXT3 + ';flex-shrink:0;margin-bottom:2px;';
    tracksHdr.textContent = 'EVIDENCE COLLECTED';
    tracksDiv.appendChild(tracksHdr);

    tracks.forEach(function(t) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:10px;flex:1;min-height:0;';

      var lbl = document.createElement('div');
      lbl.style.cssText = 'width:158px;font-family:\'Space Grotesk\',sans-serif;font-size:13px;'
        + 'font-weight:700;color:' + t.color + ';flex-shrink:0;line-height:1.2;';
      lbl.textContent = t.label;
      row.appendChild(lbl);

      var bar = document.createElement('div');
      bar.style.cssText = 'flex:1;background:' + C_SURF2 + ';border-radius:4px;height:28px;'
        + 'position:relative;overflow:hidden;';

      var ph = document.createElement('div');
      ph.id = 'pl-ph-' + t.id;
      ph.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);'
        + 'font-family:\'JetBrains Mono\',monospace;font-size:9.5px;color:' + C_TEXT3 + ';'
        + 'z-index:1;white-space:nowrap;transition:opacity 250ms ease;letter-spacing:.04em;';
      ph.textContent = 'NOT YET MEASURED';
      bar.appendChild(ph);

      var fill = document.createElement('div');
      fill.id = 'pl-fill-' + t.id;
      fill.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:0;'
        + 'border-radius:4px;opacity:.22;background:' + t.color + ';';
      bar.appendChild(fill);

      var ftxt = document.createElement('div');
      ftxt.id = 'pl-ftxt-' + t.id;
      ftxt.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);'
        + 'font-family:\'JetBrains Mono\',monospace;font-size:9.5px;color:' + t.color + ';'
        + 'z-index:2;white-space:nowrap;opacity:0;transition:opacity 300ms ease 280ms;letter-spacing:.04em;';
      ftxt.textContent = t.fillText;
      bar.appendChild(ftxt);

      row.appendChild(bar);
      tracksDiv.appendChild(row);
    });
    bodyRow.appendChild(tracksDiv);

    // Right: gate panel
    var gateDiv = document.createElement('div');
    gateDiv.style.cssText = 'flex:0 0 256px;display:flex;flex-direction:column;gap:10px;'
      + 'padding-left:18px;border-left:1px solid ' + C_BDR1 + ';';

    var gateHdr = document.createElement('div');
    gateHdr.id = 'pl-gate-hdr';
    gateHdr.style.cssText = 'display:flex;flex-direction:column;gap:8px;opacity:0;'
      + 'transition:opacity 500ms ease;flex-shrink:0;';

    var iconRow = document.createElement('div');
    iconRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

    var iconBox = document.createElement('div');
    iconBox.style.cssText = 'width:32px;height:32px;border-radius:7px;flex-shrink:0;'
      + 'background:rgba(88,201,148,.12);border:1px solid rgba(88,201,148,.28);'
      + 'display:flex;align-items:center;justify-content:center;color:' + C_GREEN + ';';
    iconBox.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>';

    var gateLbls = document.createElement('div');
    gateLbls.innerHTML = '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8.5px;'
      + 'letter-spacing:.12em;color:' + C_GREEN + ';line-height:1.2">EVIDENCE GATE</div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.06em;'
      + 'color:' + C_TEXT3 + ';margin-top:2px">HUMAN DECISION POINT</div>';

    iconRow.appendChild(iconBox);
    iconRow.appendChild(gateLbls);
    gateHdr.appendChild(iconRow);

    var gateSub = document.createElement('div');
    gateSub.style.cssText = 'font-size:11px;color:' + C_TEXT2 + ';line-height:1.5;'
      + 'border-left:2px solid rgba(88,201,148,.28);padding-left:8px;';
    gateSub.textContent = 'Analyst reviews each dimension and selects the next move. No outcome is preselected.';
    gateHdr.appendChild(gateSub);
    gateDiv.appendChild(gateHdr);

    var gateChips = document.createElement('div');
    gateChips.id = 'pl-gate-chips';
    gateChips.style.cssText = 'display:flex;flex-direction:column;gap:5px;opacity:0;transition:opacity 500ms ease;';

    gateOptions.forEach(function(opt) {
      var item = document.createElement('div');
      item.style.cssText = 'padding:7px 10px;border-radius:5px;'
        + 'border:1px solid rgba(88,201,148,.20);background:rgba(88,201,148,.04);';
      item.innerHTML = '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;'
        + 'font-weight:700;color:var(--text-1);margin-bottom:2px">' + opt.label + '</div>'
        + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8.5px;color:' + C_TEXT3 + ';line-height:1.45">'
        + opt.sub + '</div>';
      gateChips.appendChild(item);
    });
    gateDiv.appendChild(gateChips);

    bodyRow.appendChild(gateDiv);
    root.appendChild(bodyRow);
    container.appendChild(root);
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  var steps = [
    { delay: 200,  run: function() { show('flow'); }},
    { delay: 500,  run: function() { activateStage('baseline'); }},
    { delay: 1300, run: function() { activateStage('aipass'); }},
    { delay: 2200, run: function() {
      show('findings');
      _t(function() { showFinding('f0', 'A'); }, 0);
      _t(function() { showFinding('f1', 'A'); }, 200);
      _t(function() { showFinding('f2', 'A'); }, 420);
    }},
    { delay: 4000, run: function() { activateStage('challenge'); }},
    { delay: 4650, run: function() {
      _t(function() { showFinding('f0', 'B'); }, 0);
      _t(function() { showFinding('f1', 'B'); }, 260);
      _t(function() { showFinding('f2', 'B'); }, 540);
    }},
    { delay: 5200, run: function() {
      activateStage('evidence');
      _t(function() { fillTrack('speed');     }, 0);
      _t(function() { fillTrack('quality');   }, 440);
      _t(function() { fillTrack('control');   }, 880);
      _t(function() { fillTrack('adoption');  }, 1320);
      _t(function() { fillTrack('economics'); }, 1760);
    }},
    { delay: 7350, run: function() {
      activateStage('decision');
      show('gate-hdr');
    }},
    { delay: 8500, run: function() { show('gate-chips'); }},
    { delay: 9300, run: function() {
      container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showAll(); return; }
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
      showAll();
    },
    getAccessibleSummary: function() {
      return 'An evidence test bench runs an obligation through five stages: Baseline, AI First Pass, Expert Challenge, Evidence, and Decision. '
        + 'Three AI findings appear at the first pass: clause scope confirmed, evidence standard unresolved, policy link incomplete. '
        + 'Expert challenge resolves both open items. '
        + 'Five evidence channels fill in sequence: Speed, Quality, Control and traceability, Adoption, and Economics. '
        + 'A human decision gate presents four options: Stop, Refine, Repeat, or Controlled scale. No outcome is preselected.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
