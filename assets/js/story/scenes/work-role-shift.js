// Scene: work-role-shift (Screen 06 - WHERE IT APPLIES)
// Single role-family (Compliance Officer) shows task-level shift from execution to judgement
SceneDirector.register('work-role-shift', function(container, manifest, reduced) {
  var tasks = [
    { label: 'Receive and log regulatory update',     from: 'Manual intake',     to: 'AI ingestion',         shift: 'automation' },
    { label: 'Extract and structure obligations',      from: 'Manual reading',    to: 'AI extraction agent',  shift: 'automation' },
    { label: 'Check coverage against controls',        from: 'Spreadsheet match', to: 'AI gap analysis',      shift: 'automation' },
    { label: 'Challenge AI assessment for accuracy',   from: 'N/A',               to: 'Human challenge gate', shift: 'judgement'  },
    { label: 'Approve action and record evidence',     from: 'Manual sign-off',   to: 'Named approval gate',  shift: 'judgement'  },
    { label: 'Escalate edge cases and exceptions',     from: 'Ad hoc',            to: 'Defined escalation',   shift: 'judgement'  }
  ];

  var shiftColors = { automation: 'var(--accent)', judgement: 'var(--green)' };
  var shiftLabels = { automation: 'AI', judgement: 'Human judgement' };

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;height:100%;padding:16px;justify-content:center;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;gap:12px;margin-bottom:6px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);';
    hdr.innerHTML = '<span style="flex:1">Task</span><span style="width:160px">Shifts to</span><span style="width:100px">Pattern</span>';
    wrap.appendChild(hdr);

    tasks.forEach(function(t, i) {
      var row = document.createElement('div');
      row.className = 'scene-node';
      row.style.cssText = 'display:flex;gap:12px;align-items:center;background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;padding:8px 12px;';
      row.innerHTML =
        '<span style="flex:1;font-size:14px;color:var(--text-1);line-height:1.4">' + t.label + '</span>' +
        '<span style="width:160px;font-size:14px;color:' + shiftColors[t.shift] + ';font-weight:600;line-height:1.3">' + t.to + '</span>' +
        '<span style="width:100px;font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.06em;color:' + shiftColors[t.shift] + '">' + shiftLabels[t.shift] + '</span>';
      wrap.appendChild(row);
    });
    container.appendChild(wrap);
  }

  var steps = tasks.map(function(_, i) {
    return { delay: 400 + i * 800, run: function() {
      var nodes = container.querySelectorAll('.scene-node');
      if (nodes[i]) nodes[i].classList.add('visible');
    }};
  });

  var tl = createTimeline(steps);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
