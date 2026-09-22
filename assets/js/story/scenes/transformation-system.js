// Scene: transformation-system (Screen 05 - WHERE IT APPLIES)
// 8 transformation blocks assemble around central process concept
SceneDirector.register('transformation-system', function(container, manifest, reduced) {
  var blocks = [
    { id: 'process',    label: 'Work and process',         icon: 'ti-route',       color: 'var(--cyan)'   },
    { id: 'data',       label: 'Data and knowledge',        icon: 'ti-database',    color: 'var(--accent)' },
    { id: 'tech',       label: 'Technology and AI',         icon: 'ti-cpu',         color: 'var(--accent)' },
    { id: 'governance', label: 'Governance and controls',   icon: 'ti-shield-check',color: 'var(--green)'  },
    { id: 'roles',      label: 'Roles and skills',          icon: 'ti-users',       color: 'var(--pink)'   },
    { id: 'metrics',    label: 'Metrics and value',         icon: 'ti-chart-bar',   color: 'var(--amber)'  },
    { id: 'risk',       label: 'Risk and compliance',       icon: 'ti-lock',        color: 'var(--green)'  },
    { id: 'operating',  label: 'Operating model',           icon: 'ti-building',    color: 'var(--text-2)' }
  ];

  function build() {
    container.innerHTML = '';
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;height:100%;padding:16px;align-content:center;';

    blocks.forEach(function(b) {
      var el = document.createElement('div');
      el.className = 'tr-block';
      el.dataset.blockId = b.id;
      el.style.cssText = 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:8px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;';
      el.innerHTML = '<i class="ti ' + b.icon + '" style="font-size:20px;color:' + b.color + '"></i><span style="font-family:\'Space Grotesk\',sans-serif;font-size:11px;font-weight:600;color:var(--text-1);line-height:1.3">' + b.label + '</span>';
      grid.appendChild(el);
    });
    container.appendChild(grid);
  }

  var steps = blocks.map(function(b, i) {
    return { delay: 300 + i * 700, run: function() {
      var el = container.querySelector('[data-block-id="' + b.id + '"]');
      if (el) el.classList.add('visible');
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
      container.querySelectorAll('.tr-block').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
