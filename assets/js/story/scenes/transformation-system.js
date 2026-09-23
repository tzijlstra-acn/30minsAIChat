// Scene: transformation-system (Screen 05 - WHERE IT APPLIES)
// V15 overhaul: 5 executive systems replacing 8 equal blocks.
// Each system carries one implication for the use case from Screen 04.
SceneDirector.register('transformation-system', function(container, manifest, reduced) {

  var systems = [
    {
      id: 'work',
      label: 'Work and decisions',
      icon: 'ti-route',
      color: 'var(--cyan)',
      implication: 'Redesign hand-offs and decision rights'
    },
    {
      id: 'data',
      label: 'Data and technology',
      icon: 'ti-database',
      color: 'var(--accent)',
      implication: 'Connect sources, context and workflow'
    },
    {
      id: 'people',
      label: 'People and roles',
      icon: 'ti-users',
      color: 'var(--amber)',
      implication: 'Shift effort toward challenge and ownership'
    },
    {
      id: 'governance',
      label: 'Governance and assurance',
      icon: 'ti-shield-check',
      color: 'var(--green)',
      implication: 'Define gates, evidence and monitoring'
    },
    {
      id: 'value',
      label: 'Value and ownership',
      icon: 'ti-chart-bar',
      color: 'var(--pink)',
      implication: 'Name the owner and measure the outcome'
    }
  ];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // Reference token
    var token = document.createElement('div');
    token.className = 'scene-node';
    token.dataset.beat = 'token';
    token.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:12px;padding:8px 14px;'
      + 'background:rgba(180,76,255,.07);border:1px solid rgba(180,76,255,.3);border-radius:6px;';
    token.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--accent)">OBL-27</span>'
      + '<span style="font-size:14px;color:var(--border-2)">&#8594;</span>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-2)">'
      + 'One use case. Five systems that may need to move together.'
      + '</span>';
    outer.appendChild(token);

    // 5-card row
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:8px;flex:1;min-height:0;';

    systems.forEach(function(sys) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'sys-' + sys.id;
      card.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:14px 12px;'
        + 'background:var(--surface-1);border:1px solid ' + sys.color + ';border-radius:10px;';

      var hdr = document.createElement('div');
      hdr.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:6px;';
      hdr.innerHTML =
        '<i class="ti ' + sys.icon + '" style="font-size:22px;color:' + sys.color + '"></i>'
        + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1);line-height:1.2">' + sys.label + '</span>';
      card.appendChild(hdr);

      var imp = document.createElement('div');
      imp.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2);line-height:1.45;';
      imp.textContent = sys.implication;
      card.appendChild(imp);

      row.appendChild(card);
    });

    outer.appendChild(row);
    container.appendChild(outer);
  }

  var delays = [300, 900, 1700, 2500, 3300, 4100];

  var steps = [
    { delay: delays[0], run: function() {
      var t = container.querySelector('[data-beat="token"]');
      if (t) t.classList.add('visible');
    }}
  ].concat(systems.map(function(sys, i) {
    return { delay: delays[i + 1], run: function() {
      var n = container.querySelector('[data-beat="sys-' + sys.id + '"]');
      if (n) n.classList.add('visible');
    }};
  }));

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
