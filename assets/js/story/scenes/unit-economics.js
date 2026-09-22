// Scene: unit-economics (Screen 09 - HOW TO SCALE)
// 6 cost stations appear as bars, then optimisation sequence highlights levers
SceneDirector.register('unit-economics', function(container, manifest, reduced) {
  var stations = [
    { label: 'Inference compute',        relative: 0.35, color: 'var(--accent)',   lever: 'Model size, batching, caching'          },
    { label: 'Data retrieval',           relative: 0.20, color: 'var(--cyan)',     lever: 'Embedding refresh rate, vector DB scale' },
    { label: 'Human review overhead',    relative: 0.25, color: 'var(--green)',    lever: 'Review rate design, escalation threshold' },
    { label: 'Model risk and compliance',relative: 0.10, color: 'var(--amber)',    lever: 'Validation cycles, documentation scope'  },
    { label: 'Platform and tooling',     relative: 0.07, color: 'var(--pink)',     lever: 'Shared infrastructure amortisation'       },
    { label: 'Retraining and drift',     relative: 0.03, color: 'var(--text-3)',  lever: 'Drift detection automation'               }
  ];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;height:100%;padding:16px;justify-content:center;';

    stations.forEach(function(s, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;';

      var label = document.createElement('div');
      label.style.cssText = 'width:160px;font-size:11px;color:var(--text-2);flex-shrink:0;text-align:right;';
      label.textContent = s.label;

      var barWrap = document.createElement('div');
      barWrap.style.cssText = 'flex:1;background:var(--surface-1);border-radius:3px;height:20px;overflow:hidden;';

      var bar = document.createElement('div');
      bar.className = 'cost-station-bar';
      bar.dataset.stationIdx = i;
      bar.style.cssText = 'height:100%;width:' + Math.round(s.relative * 100) + '%;background:' + s.color + ';border-radius:3px;transform-origin:left;transform:scaleX(0);transition:transform 600ms ease;';
      barWrap.appendChild(bar);

      var pct = document.createElement('div');
      pct.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:8.5px;color:' + s.color + ';width:32px;text-align:right;opacity:0;transition:opacity 300ms ease;';
      pct.textContent = Math.round(s.relative * 100) + '%';
      pct.dataset.pctIdx = i;

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(pct);
      wrap.appendChild(row);
    });
    container.appendChild(wrap);
  }

  var steps = stations.map(function(_, i) {
    return { delay: 400 + i * 900, run: function() {
      var bar = container.querySelector('[data-station-idx="' + i + '"]');
      var pct = container.querySelector('[data-pct-idx="' + i + '"]');
      if (bar) bar.style.transform = 'scaleX(1)';
      if (pct) pct.style.opacity = '1';
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
      stations.forEach(function(_, i) {
        var bar = container.querySelector('[data-station-idx="' + i + '"]');
        var pct = container.querySelector('[data-pct-idx="' + i + '"]');
        if (bar) bar.style.transform = 'scaleX(1)';
        if (pct) pct.style.opacity = '1';
      });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
