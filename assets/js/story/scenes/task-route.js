// Scene: task-route (Screen 03 - TASK CHOICE)
// V19: Automatic routing -- each task connects to the least complex suitable level.
SceneDirector.register('task-route', function(container, manifest, reduced) {

  var LEVELS = [
    { label: 'Rules and workflow',            color: 'var(--cyan)',   bg: 'rgba(85,199,232,.07)',  idx: 0 },
    { label: 'RPA and orchestration',         color: 'var(--cyan)',   bg: 'rgba(85,199,232,.09)',  idx: 1 },
    { label: 'Analytics and ML',              color: 'var(--cyan)',   bg: 'rgba(85,199,232,.12)',  idx: 2 },
    { label: 'GenAI and retrieval',           color: 'var(--accent)', bg: 'rgba(180,76,255,.10)',  idx: 3 },
    { label: 'Agents and orchestration',      color: 'var(--pink)',   bg: 'rgba(240,117,138,.12)', idx: 4 }
  ];

  var TASKS = [
    { label: 'Classify transaction flags',            note: 'Deterministic classification',      levelIdx: 2, color: 'var(--cyan)'   },
    { label: 'Extract obligations from source text',  note: 'Retrieval-augmented generation',    levelIdx: 3, color: 'var(--accent)' },
    { label: 'Draft gap assessment',                  note: 'Generative with document context',  levelIdx: 3, color: 'var(--accent)' },
    { label: 'Approve and record evidence',           note: 'Agents + human decision gate',      levelIdx: 4, color: 'var(--pink)',
      humanGate: true }
  ];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;height:100%;padding:8px 14px;gap:6px;';

    // Column headers
    var hdrs = document.createElement('div');
    hdrs.style.cssText = 'display:grid;grid-template-columns:1fr 60px 1fr;gap:0;padding:0 0 4px;flex-shrink:0;';
    hdrs.innerHTML =
      '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)">Task</div>'
      + '<div></div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)">Least complex suitable pattern</div>';
    outer.appendChild(hdrs);

    // Task rows
    TASKS.forEach(function(task, i) {
      var row = document.createElement('div');
      row.className = 'tr-row scene-node';
      row.dataset.beat = 'task-' + i;
      row.style.cssText = 'display:grid;grid-template-columns:1fr 60px 1fr;align-items:center;gap:0;flex:1;min-height:0;opacity:0;transition:opacity .5s;';

      // Task token (left)
      var token = document.createElement('div');
      token.style.cssText = 'padding:9px 13px;background:var(--surface-1);'
        + 'border-left:3px solid ' + task.color + ';border-radius:6px;';
      token.innerHTML =
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1);line-height:1.2">' + task.label + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:11.5px;color:var(--text-3);margin-top:3px">' + task.note + '</div>';

      // Arrow (center) - expands on reveal
      var arrow = document.createElement('div');
      arrow.className = 'tr-arrow';
      arrow.style.cssText = 'display:flex;align-items:center;justify-content:center;';
      arrow.innerHTML = '<div style="border-top:2px dashed ' + task.color + ';width:100%;opacity:.5;position:relative">'
        + '<span style="position:absolute;right:-4px;top:-9px;color:' + task.color + ';font-size:14px;opacity:.7">&#8594;</span></div>';

      // Level chip (right)
      var level = LEVELS[task.levelIdx];
      var chip = document.createElement('div');
      chip.style.cssText = 'padding:9px 13px;background:' + level.bg + ';border-radius:6px;'
        + 'border-top:2px solid ' + level.color + ';';
      var gateHtml = task.humanGate
        ? '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;color:var(--amber);'
          + 'padding:1px 6px;background:rgba(243,179,76,.12);border-radius:10px;margin-left:6px">+ human gate</span>'
        : '';
      chip.innerHTML =
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:' + level.color + ';line-height:1.2">'
        + level.label + gateHtml + '</div>';

      row.appendChild(token);
      row.appendChild(arrow);
      row.appendChild(chip);
      outer.appendChild(row);
    });

    // Insight
    var insight = document.createElement('div');
    insight.className = 'scene-node';
    insight.dataset.beat = 'insight';
    insight.style.cssText = 'flex-shrink:0;padding:7px 10px;background:var(--surface-2);border-radius:5px;'
      + 'border-left:3px solid var(--green);opacity:0;transition:opacity .5s;margin-top:2px;';
    insight.innerHTML = '<span style="font-family:\'Inter\',sans-serif;font-size:13px;font-style:italic;color:var(--text-2)">'
      + 'Simpler automation is often more reliable, auditable and cost-effective.'
      + '</span>';
    outer.appendChild(insight);

    container.appendChild(outer);
  }

  var steps = [
    { delay: 200, run: function() {
      var n = container.querySelector('[data-beat="task-0"]');
      if (n) { n.classList.add('visible'); n.style.opacity = '1'; }
    }},
    { delay: 1000, run: function() {
      var n = container.querySelector('[data-beat="task-1"]');
      if (n) { n.classList.add('visible'); n.style.opacity = '1'; }
    }},
    { delay: 1800, run: function() {
      var n = container.querySelector('[data-beat="task-2"]');
      if (n) { n.classList.add('visible'); n.style.opacity = '1'; }
    }},
    { delay: 2600, run: function() {
      var n = container.querySelector('[data-beat="task-3"]');
      if (n) { n.classList.add('visible'); n.style.opacity = '1'; }
    }},
    { delay: 3600, run: function() {
      var n = container.querySelector('[data-beat="insight"]');
      if (n) { n.classList.add('visible'); n.style.opacity = '1'; }
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play:   function() { build(); tl.play(); },
    pause:  tl.pause,
    resume: tl.resume,
    reset:  function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) {
        n.classList.add('visible');
        n.style.opacity = '1';
      });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
