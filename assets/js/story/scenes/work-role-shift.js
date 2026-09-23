// Scene: work-role-shift (Screen 06)
// V19: RCSA-style process showing task shift from human execution to AI/agent execution.
// Two-column layout: AI and agent execution (left) | Human judgement (right).
// Source-backed framing: COVERAGE MAPPING -- ILLUSTRATIVE TASK SHIFT -- NOT A HEADCOUNT FORECAST

SceneDirector.register('work-role-shift', function(container, manifest, reduced) {

  var ACCENT = '#B44CFF';
  var AMBER  = '#F3B34C';
  var GREEN  = '#3EC97F';

  var tasks = [
    {
      label:     'Extract obligations from source',
      aiPill:    { text: 'AI extraction',    type: 'accent' },
      humanPill: null
    },
    {
      label:     'Match to policies and controls',
      aiPill:    { text: 'AI pattern match', type: 'accent' },
      humanPill: null
    },
    {
      label:     'Identify gaps',
      aiPill:    { text: 'AI gap analysis',  type: 'accent' },
      humanPill: { text: 'CHALLENGE GAP',     final: false }
    },
    {
      label:     'Draft assessment',
      aiPill:    { text: 'GenAI draft',      type: 'accent' },
      humanPill: { text: 'REVIEW AND ADJUST', final: false }
    },
    {
      label:     'Record evidence',
      aiPill:    { text: 'Agent records',    type: 'green' },
      humanPill: { text: 'FINAL APPROVAL',   final: true }
    }
  ];

  var _timers = [];

  // ── pill factory ──────────────────────────────────────────────────────────
  function makePill(text, type) {
    var span = document.createElement('span');
    var base = 'border-radius:4px;padding:3px 8px;font-family:\'JetBrains Mono\',monospace;'
             + 'font-size:11px;white-space:nowrap;flex-shrink:0;line-height:1.4;';
    if (type === 'accent') {
      span.style.cssText = base
        + 'background:rgba(180,76,255,.1);border:1px solid ' + ACCENT + ';color:' + ACCENT + ';';
    } else if (type === 'green') {
      span.style.cssText = base
        + 'background:rgba(62,201,127,.1);border:1px solid ' + GREEN + ';color:' + GREEN + ';';
    } else {
      // amber gate
      span.style.cssText = base
        + 'background:rgba(243,179,76,.1);border:1px solid ' + AMBER + ';color:' + AMBER + ';font-weight:700;';
    }
    span.textContent = text;
    return span;
  }

  // ── DOM builder ───────────────────────────────────────────────────────────
  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:8px;padding:4px 0;';

    // Process label -- always visible reference metadata
    var procLabel = document.createElement('div');
    procLabel.style.cssText = 'flex-shrink:0;font-family:\'JetBrains Mono\',monospace;font-size:10px;'
                            + 'letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);';
    procLabel.textContent = 'COVERAGE MAPPING -- ILLUSTRATIVE TASK SHIFT -- NOT A HEADCOUNT FORECAST';
    root.appendChild(procLabel);

    // Grid (flex column, fills remaining height)
    var grid = document.createElement('div');
    grid.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;';

    // Column header row
    var hdrRow = document.createElement('div');
    hdrRow.className = 'scene-node';
    hdrRow.dataset.beat = 'col-hdrs';
    hdrRow.style.cssText = 'display:flex;flex-direction:row;gap:16px;padding-bottom:8px;'
                         + 'border-bottom:2px solid var(--border-1);margin-bottom:2px;flex-shrink:0;';

    var leftHdr = document.createElement('div');
    leftHdr.style.cssText = 'flex:0 0 45%;font-size:12px;font-weight:700;color:' + ACCENT + ';';
    leftHdr.textContent = 'AI and agent execution';
    hdrRow.appendChild(leftHdr);

    var rightHdr = document.createElement('div');
    rightHdr.style.cssText = 'flex:0 0 55%;font-size:12px;font-weight:700;color:' + AMBER + ';';
    rightHdr.textContent = 'Human judgement';
    hdrRow.appendChild(rightHdr);

    grid.appendChild(hdrRow);

    // Task rows
    tasks.forEach(function(task, i) {
      var row = document.createElement('div');
      row.dataset.beat = 'task-row-' + i;
      row.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:16px;'
                        + 'padding:8px 0;border-bottom:1px solid var(--border-1);flex-shrink:0;'
                        + 'opacity:0;transform:translateY(12px);'
                        + 'transition:opacity 350ms ease,transform 350ms ease;';

      // Left cell (45%): task label + AI pill
      var leftCell = document.createElement('div');
      leftCell.style.cssText = 'flex:0 0 45%;display:flex;align-items:center;gap:8px;';

      var taskLabel = document.createElement('span');
      taskLabel.style.cssText = 'font-size:14px;color:var(--text-1);flex:1;line-height:1.3;';
      taskLabel.textContent = task.label;
      leftCell.appendChild(taskLabel);
      leftCell.appendChild(makePill(task.aiPill.text, task.aiPill.type));
      row.appendChild(leftCell);

      // Right cell (55%): human gate pill or placeholder
      var rightCell = document.createElement('div');
      rightCell.style.cssText = 'flex:0 0 55%;display:flex;align-items:center;';

      if (task.humanPill) {
        var pillText = task.humanPill.final ? '✓ ' + task.humanPill.text : task.humanPill.text;
        var hPill = makePill(pillText, 'amber');
        if (task.humanPill.final) {
          hPill.dataset.finalGate = 'true';
        }
        rightCell.appendChild(hPill);
      } else {
        var placeholder = document.createElement('span');
        placeholder.style.cssText = 'font-size:14px;color:var(--text-3);';
        placeholder.textContent = '--';
        rightCell.appendChild(placeholder);
      }

      row.appendChild(rightCell);
      grid.appendChild(row);
    });

    root.appendChild(grid);

    // Insight strip (fades in at end)
    var insight = document.createElement('div');
    insight.dataset.beat = 'insight';
    insight.style.cssText = 'flex-shrink:0;font-size:13px;font-style:italic;color:var(--text-2);'
                          + 'padding:6px 0 2px;opacity:0;transition:opacity 500ms ease;';
    insight.textContent = 'Accountability remains named. Judgement remains human. Only repeatable execution may shift.';
    root.appendChild(insight);

    container.appendChild(root);
  }

  // ── reveal helpers ────────────────────────────────────────────────────────
  function revealHeaders() {
    var hdr = container.querySelector('[data-beat="col-hdrs"]');
    if (hdr) hdr.classList.add('visible');
  }

  function revealRow(idx) {
    var row = container.querySelector('[data-beat="task-row-' + idx + '"]');
    if (row) {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }
  }

  function pulseGate() {
    var gate = container.querySelector('[data-final-gate]');
    if (!gate) return;
    gate.style.transition = 'transform 150ms ease';
    gate.style.transform = 'scale(1.1)';
    _timers.push(setTimeout(function() {
      var g = container.querySelector('[data-final-gate]');
      if (g) g.style.transform = 'scale(1)';
    }, 200));
  }

  function showInsight() {
    var ins = container.querySelector('[data-beat="insight"]');
    if (ins) ins.style.opacity = '1';
  }

  function showAll() {
    revealHeaders();
    for (var i = 0; i < tasks.length; i++) { revealRow(i); }
    showInsight();
  }

  // ── timeline steps ────────────────────────────────────────────────────────
  var steps = [
    { delay: 100,  run: revealHeaders },
    { delay: 400,  run: function() { revealRow(0); } },
    { delay: 900,  run: function() { revealRow(1); } },
    { delay: 1400, run: function() { revealRow(2); } },
    { delay: 1900, run: function() { revealRow(3); } },
    { delay: 2400, run: function() {
      revealRow(4);
      _timers.push(setTimeout(pulseGate, 300));
    }},
    { delay: 3200, run: showInsight }
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
      _timers.forEach(clearTimeout);
      _timers = [];
      build();
      tl.reset();
    },
    finish: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      build();
      showAll();
    },
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
