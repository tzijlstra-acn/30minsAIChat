// Scene: scale-architecture (Screen 08 - HOW TO SCALE)
// Three states: proof -> production -> reuse. Shows shared platform spine assembling
SceneDirector.register('scale-architecture', function(container, manifest, reduced) {
  var states = [
    { label: 'Proof',       color: 'var(--cyan)',    desc: 'One bounded use case, controlled environment, gate-ready evidence' },
    { label: 'Production',  color: 'var(--accent)',  desc: 'Live with monitoring, human-in-loop gates, compliance trail'       },
    { label: 'Reuse',       color: 'var(--green)',   desc: 'Shared data, orchestration and controls reduce build effort'       }
  ];
  var spine = ['Data mesh', 'Orchestration', 'Identity and access', 'Evaluation', 'Monitoring'];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:14px;height:100%;padding:16px;justify-content:center;';

    // State progression
    var statesRow = document.createElement('div');
    statesRow.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;';
    states.forEach(function(s) {
      var el = document.createElement('div');
      el.className = 'scene-node';
      el.dataset.stateLabel = s.label;
      el.style.cssText = 'background:var(--surface-1);border:1px solid ' + s.color + ';border-radius:10px;padding:14px;text-align:center;';
      el.innerHTML = '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:' + s.color + ';margin-bottom:6px">' + s.label + '</div><div style="font-size:11px;color:var(--text-2);line-height:1.4">' + s.desc + '</div>';
      statesRow.appendChild(el);
    });
    wrap.appendChild(statesRow);

    // Shared platform spine
    var spineLabel = document.createElement('div');
    spineLabel.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:8.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-3);margin-bottom:4px;';
    spineLabel.textContent = 'Shared platform spine';
    spineLabel.className = 'scene-node';
    spineLabel.dataset.spineLabel = '1';
    wrap.appendChild(spineLabel);

    var spineRow = document.createElement('div');
    spineRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
    spine.forEach(function(s) {
      var chip = document.createElement('div');
      chip.className = 'scene-node';
      chip.dataset.spineChip = '1';
      chip.style.cssText = 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:5px;padding:5px 10px;font-family:"JetBrains Mono",monospace;font-size:9px;color:var(--text-2);';
      chip.textContent = s;
      spineRow.appendChild(chip);
    });
    wrap.appendChild(spineRow);
    container.appendChild(wrap);
  }

  var steps = [
    { delay: 300,  run: function() { var n = container.querySelector('[data-state-label="Proof"]'); if(n) n.classList.add('visible'); }},
    { delay: 1100, run: function() { var n = container.querySelector('[data-state-label="Production"]'); if(n) n.classList.add('visible'); }},
    { delay: 1900, run: function() { var n = container.querySelector('[data-state-label="Reuse"]'); if(n) n.classList.add('visible'); }},
    { delay: 2600, run: function() {
      container.querySelectorAll('[data-spine-label]').forEach(function(n) { n.classList.add('visible'); });
      container.querySelectorAll('[data-spine-chip]').forEach(function(n) { n.classList.add('visible'); });
    }}
  ];

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
