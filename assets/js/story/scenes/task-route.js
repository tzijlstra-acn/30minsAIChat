// Scene: task-route (Screen 03 - WHAT AI IS)
// Decision tree auto-routing 4 example tasks through: task type -> evidence type -> decision right -> pattern
SceneDirector.register('task-route', function(container, manifest, reduced) {
  var examples = [
    { task: 'Extract obligations from regulation text',   pattern: 'RAG extraction',       tier: 'Generative',   color: 'var(--accent)' },
    { task: 'Classify transaction as high / low risk',   pattern: 'Classification model', tier: 'Deterministic', color: 'var(--cyan)'   },
    { task: 'Draft gap assessment with rationale',        pattern: 'LLM with context',     tier: 'Generative',   color: 'var(--accent)' },
    { task: 'Approve and record compliance decision',     pattern: 'Human judgement gate', tier: 'Human',         color: 'var(--green)'  }
  ];

  function build() {
    container.innerHTML = '';
    var list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:16px;justify-content:center;';

    examples.forEach(function(ex) {
      var row = document.createElement('div');
      row.className = 'scene-node';
      row.style.cssText = 'display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;background:var(--surface-1);border:1px solid var(--border-1);border-radius:8px;padding:10px 14px;';
      row.innerHTML =
        '<span style="font-size:15px;color:var(--text-1);line-height:1.4">' + ex.task + '</span>' +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.06em;color:' + ex.color + ';white-space:nowrap;font-weight:600">' + ex.tier + '</span>' +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.04em;color:var(--text-2);white-space:nowrap">' + ex.pattern + '</span>';
      list.appendChild(row);
    });
    container.appendChild(list);
  }

  var steps = examples.map(function(_, i) {
    return { delay: 500 + i * 1000, run: function() {
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
