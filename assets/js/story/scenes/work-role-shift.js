// Scene: work-role-shift (Screen 06) -- V23 three-lane redesign
// Three synchronised lanes: AI execution | Human judgement | Evidence and accountability.
// A continuous accountability line runs under all tasks -- always terminates at the named owner.
// Source: RCSA Agent / Regulation Coverage -- ILLUSTRATIVE TASK SHIFT -- NOT A HEADCOUNT FORECAST

SceneDirector.register('work-role-shift', function(container, manifest, reduced) {

  var _timers = [];
  var ACCENT = '#B44CFF';
  var AMBER  = '#F3B34C';
  var GREEN  = '#58C994';
  var CYAN   = '#55C7E8';

  // Five RCSA-style tasks with three-lane assignments
  var TASKS = [
    {
      label:     'Extract obligations from source',
      ai:        { text: 'AI extraction',    color: ACCENT },
      human:     null,
      evidence:  { text: 'Structured record', color: CYAN }
    },
    {
      label:     'Match to policies and controls',
      ai:        { text: 'AI pattern match', color: ACCENT },
      human:     null,
      evidence:  { text: 'Match log created', color: CYAN }
    },
    {
      label:     'Identify gaps and draft rationale',
      ai:        { text: 'AI gap analysis',  color: ACCENT },
      human:     { text: 'Challenge',        color: AMBER },
      evidence:  { text: 'Challenge recorded', color: AMBER }
    },
    {
      label:     'Assemble control evidence',
      ai:        { text: 'Agent assembles',  color: ACCENT },
      human:     { text: 'Review and adjust', color: AMBER },
      evidence:  { text: 'Control evidence',  color: GREEN }
    },
    {
      label:     'Final approval and sign-off',
      ai:        null,
      human:     { text: 'Risk owner approves', color: AMBER, final: true },
      evidence:  { text: 'Provenance complete',  color: GREEN, final: true }
    }
  ];

  // ── pill factory ──────────────────────────────────────────────────────────
  function makePill(text, color, isFinal) {
    var span = document.createElement('span');
    var c = color || ACCENT;
    span.style.cssText = 'display:inline-flex;align-items:center;padding:3px 9px;border-radius:4px;'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.04em;'
      + 'white-space:nowrap;flex-shrink:0;line-height:1.4;'
      + 'background:' + c + '18;border:1px solid ' + c + ';color:' + c + ';'
      + (isFinal ? 'font-weight:700;' : '');
    span.textContent = text;
    return span;
  }

  // ── cell factory ─────────────────────────────────────────────────────────
  function makeCell(laneConfig, flex) {
    var cell = document.createElement('div');
    cell.style.cssText = 'flex:' + (flex || '1') + ';display:flex;align-items:center;gap:6px;'
                       + 'min-width:0;padding:0 8px;';
    if (laneConfig) {
      cell.appendChild(makePill(laneConfig.text, laneConfig.color, laneConfig.final));
    } else {
      var dash = document.createElement('span');
      dash.style.cssText = 'font-size:13px;color:var(--border-2);user-select:none;';
      dash.textContent = '--';
      cell.appendChild(dash);
    }
    return cell;
  }

  // ── DOM builder ───────────────────────────────────────────────────────────
  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:0;';

    // Lane header row
    var hdrRow = document.createElement('div');
    hdrRow.dataset.beat = 'col-hdrs';
    hdrRow.style.cssText = 'display:flex;flex-direction:row;flex-shrink:0;'
                         + 'padding:6px 0 6px;border-bottom:2px solid var(--border-1);'
                         + 'opacity:0;transition:opacity 300ms ease;';

    var laneHdrs = [
      { label: 'AI and agent execution', color: ACCENT, flex: '1' },
      { label: 'Human judgement',        color: AMBER,  flex: '1' },
      { label: 'Evidence and accountability', color: GREEN, flex: '1.1' }
    ];

    laneHdrs.forEach(function(h) {
      var div = document.createElement('div');
      div.style.cssText = 'flex:' + h.flex + ';padding:0 8px;font-family:\'Space Grotesk\',sans-serif;'
                        + 'font-size:12px;font-weight:700;color:' + h.color + ';';
      div.textContent = h.label;
      hdrRow.appendChild(div);
    });
    root.appendChild(hdrRow);

    // Task rows (flex:1, share remaining height evenly)
    var taskGrid = document.createElement('div');
    taskGrid.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0;';

    TASKS.forEach(function(task, i) {
      var row = document.createElement('div');
      row.dataset.beat = 'task-row-' + i;
      row.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0;'
                        + 'border-bottom:1px solid var(--border-1);justify-content:center;'
                        + 'opacity:0;transform:translateY(8px);'
                        + 'transition:opacity 300ms ease,transform 300ms ease;';

      // Row label line
      var lblRow = document.createElement('div');
      lblRow.style.cssText = 'display:flex;flex-direction:row;align-items:center;'
                           + 'padding:6px 0 4px;';

      var taskLabel = document.createElement('div');
      taskLabel.style.cssText = 'flex:0 0 calc(33.33% + 2px);padding:0 8px;font-size:13px;'
                              + 'color:var(--text-1);line-height:1.3;font-weight:600;'
                              + 'font-family:\'Space Grotesk\',sans-serif;';
      taskLabel.textContent = task.label;
      lblRow.appendChild(taskLabel);

      // AI lane
      lblRow.appendChild(makeCell(task.ai, '1'));
      // Human lane
      lblRow.appendChild(makeCell(task.human, '1'));
      // Evidence lane
      lblRow.appendChild(makeCell(task.evidence, '1.1'));

      row.appendChild(lblRow);
      taskGrid.appendChild(row);
    });

    root.appendChild(taskGrid);

    // Accountability line (always visible under all tasks)
    var acctLine = document.createElement('div');
    acctLine.dataset.beat = 'acct-line';
    acctLine.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;'
                           + 'padding:7px 8px;border-top:2px solid ' + GREEN + ';'
                           + 'opacity:0;transition:opacity 400ms ease;';

    var acctLabel = document.createElement('span');
    acctLabel.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
                            + 'letter-spacing:.12em;text-transform:uppercase;color:' + GREEN + ';'
                            + 'white-space:nowrap;';
    acctLabel.textContent = 'ACCOUNTABILITY REMAINS HUMAN THROUGHOUT';
    acctLine.appendChild(acctLabel);

    var acctOwner = document.createElement('span');
    acctOwner.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;'
                            + 'letter-spacing:.08em;text-transform:uppercase;color:' + AMBER + ';'
                            + 'margin-left:auto;white-space:nowrap;';
    acctOwner.textContent = 'RISK OWNER: NAMED -- ACCOUNTABLE';
    acctLine.appendChild(acctOwner);

    root.appendChild(acctLine);

    container.appendChild(root);
  }

  // ── reveal helpers ────────────────────────────────────────────────────────
  function revealHeaders() {
    var hdr = container.querySelector('[data-beat="col-hdrs"]');
    if (hdr) hdr.style.opacity = '1';
  }

  function revealRow(idx) {
    var row = container.querySelector('[data-beat="task-row-' + idx + '"]');
    if (row) {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }
  }

  function revealAcctLine() {
    var line = container.querySelector('[data-beat="acct-line"]');
    if (line) line.style.opacity = '1';
  }

  function showAll() {
    revealHeaders();
    for (var i = 0; i < TASKS.length; i++) { revealRow(i); }
    revealAcctLine();
  }

  // ── timeline ──────────────────────────────────────────────────────────────
  var steps = [
    { delay: 100,  run: revealHeaders },
    { delay: 350,  run: function() { revealRow(0); } },
    { delay: 700,  run: function() { revealRow(1); } },
    { delay: 1050, run: function() { revealRow(2); } },
    { delay: 1400, run: function() { revealRow(3); } },
    { delay: 1750, run: function() { revealRow(4); } },
    { delay: 2200, run: function() {
      revealAcctLine();
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 500));
    }}
  ];

  var tl = createTimeline(steps);

  // ── public interface ──────────────────────────────────────────────────────
  return {
    play: function() {
      build();
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
      return 'Five RCSA tasks are shown across three lanes: AI execution, Human judgement, and Evidence and accountability. AI handles extraction and pattern matching. Humans challenge and review. Every task terminates at a named risk owner. Accountability remains human throughout.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
