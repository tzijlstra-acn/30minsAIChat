// Scene: unit-economics (Screen 09 - HOW TO SCALE)
// Cost stations bar chart with relative proportions and a lever for each station.
// Animation: bars grow left-to-right, levers appear alongside each bar.
// Note: proportions are illustrative. No client-specific or industry benchmark data.
SceneDirector.register('unit-economics', function(container, manifest, reduced) {

  var stations = [
    {
      label:    'Inference compute',
      relative: 0.35,
      color:    'var(--accent)',
      lever:    'Model size, batching strategy, response caching'
    },
    {
      label:    'Human review overhead',
      relative: 0.25,
      color:    'var(--green)',
      lever:    'Review rate design, escalation threshold, sampling logic'
    },
    {
      label:    'Data retrieval',
      relative: 0.20,
      color:    'var(--cyan)',
      lever:    'Embedding refresh rate, vector DB scale, chunking strategy'
    },
    {
      label:    'Model risk and compliance',
      relative: 0.10,
      color:    'var(--amber)',
      lever:    'Validation cycle scope, documentation automation'
    },
    {
      label:    'Platform and tooling',
      relative: 0.07,
      color:    'var(--pink)',
      lever:    'Shared infrastructure amortisation across use cases'
    },
    {
      label:    'Retraining and drift',
      relative: 0.03,
      color:    'var(--text-3)',
      lever:    'Drift detection automation, retraining trigger criteria'
    }
  ];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;height:100%;padding:14px 16px;justify-content:center;';

    // Column headers
    var hdrs = document.createElement('div');
    hdrs.style.cssText = 'display:grid;grid-template-columns:190px 1fr 220px;gap:10px;align-items:center;margin-bottom:4px;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-3);';
    hdrs.innerHTML = '<span>Cost component</span><span>Relative proportion</span><span>Primary levers</span>';
    wrap.appendChild(hdrs);

    stations.forEach(function(s, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:190px 1fr 220px;gap:10px;align-items:center;';

      // Label
      var label = document.createElement('div');
      label.style.cssText = 'font-size:14px;color:var(--text-2);line-height:1.3;font-weight:500;';
      label.textContent = s.label;

      // Bar + pct
      var barWrap = document.createElement('div');
      barWrap.style.cssText = 'position:relative;background:var(--surface-1);border-radius:4px;height:22px;overflow:visible;';

      var bar = document.createElement('div');
      bar.className = 'cost-station-bar';
      bar.dataset.stationIdx = i;
      var pct = Math.round(s.relative * 100);
      bar.style.cssText = 'height:100%;width:' + pct + '%;background:' + s.color
        + ';border-radius:4px;transform:scaleX(0);transition:transform 600ms ease;transform-origin:left;';
      barWrap.appendChild(bar);

      var pctLabel = document.createElement('div');
      pctLabel.style.cssText = 'position:absolute;right:-36px;top:50%;transform:translateY(-50%);'
        + 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:' + s.color
        + ';font-weight:600;opacity:0;transition:opacity 300ms ease;white-space:nowrap;';
      pctLabel.dataset.pctIdx = i;
      pctLabel.textContent = pct + '%';
      barWrap.appendChild(pctLabel);

      // Lever text
      var lever = document.createElement('div');
      lever.dataset.leverIdx = i;
      lever.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-3);line-height:1.4;opacity:0;transition:opacity 300ms ease;';
      lever.textContent = s.lever;

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(lever);
      wrap.appendChild(row);
    });

    // Evidence note
    var note = document.createElement('div');
    note.className = 'scene-node';
    note.dataset.beat = 'note';
    note.style.cssText = 'margin-top:8px;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.06em;color:var(--text-3);line-height:1.5;';
    note.textContent = 'Illustrative proportions. Actual cost structure depends on model selection, call volume, review rate design, and infrastructure choices. Baseline must be established from client data before a business case is prepared.';
    wrap.appendChild(note);

    container.appendChild(wrap);
  }

  var steps = stations.map(function(_, i) {
    return { delay: 300 + i * 700, run: function() {
      var bar   = container.querySelector('[data-station-idx="' + i + '"]');
      var pct   = container.querySelector('[data-pct-idx="' + i + '"]');
      var lever = container.querySelector('[data-lever-idx="' + i + '"]');
      if (bar)   bar.style.transform = 'scaleX(1)';
      if (pct)   pct.style.opacity   = '1';
      if (lever) lever.style.opacity = '1';
    }};
  }).concat([{
    delay: 300 + stations.length * 700 + 200,
    run: function() {
      var note = container.querySelector('[data-beat="note"]');
      if (note) note.classList.add('visible');
    }
  }]);

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      stations.forEach(function(_, i) {
        var bar   = container.querySelector('[data-station-idx="' + i + '"]');
        var pct   = container.querySelector('[data-pct-idx="' + i + '"]');
        var lever = container.querySelector('[data-lever-idx="' + i + '"]');
        if (bar)   bar.style.transform = 'scaleX(1)';
        if (pct)   pct.style.opacity   = '1';
        if (lever) lever.style.opacity = '1';
      });
      var note = container.querySelector('[data-beat="note"]');
      if (note) note.classList.add('visible');
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
