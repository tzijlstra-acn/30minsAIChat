// Scene: next-move (Screen 11 - WHAT NEXT)
// Three parallel decision lanes (FRAME, MAP, PROVE) with concrete actions and gate criteria.
// Animation: lanes appear left-to-right, then the gate bar with criteria appears.
SceneDirector.register('next-move', function(container, manifest, reduced) {

  var lanes = [
    {
      label:   'FRAME',
      icon:    'ti-target',
      color:   'var(--cyan)',
      heading: 'Confirm the outcome',
      actions: [
        'Name the regulatory obligation or risk decision to improve',
        'Agree the quality and evidence standard the output must meet',
        'Set the human approval gate and its criteria in advance'
      ],
      gate:    'Gate: outcome statement with agreed evidence standard.'
    },
    {
      label:   'MAP',
      icon:    'ti-route',
      color:   'var(--accent)',
      heading: 'Trace one real process',
      actions: [
        'Follow one obligation from receipt to evidence, end to end',
        'Identify where AI can assist, automate or analyse',
        'Confirm data availability and human touchpoints'
      ],
      gate:    'Gate: process map with AI insertion points and human gates marked.'
    },
    {
      label:   'PROVE',
      icon:    'ti-check-circle',
      color:   'var(--green)',
      heading: 'Test one bounded path',
      actions: [
        'Run AI on real work in a controlled environment',
        'Measure all five dimensions: quality, control, adoption, speed, economics',
        'Present gate-ready evidence before scaling investment'
      ],
      gate:    'Gate: five-dimension evidence pack, board-ready.'
    }
  ];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:12px 16px;';

    // Lanes row
    var lanesRow = document.createElement('div');
    lanesRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;flex:1;min-height:0;';

    lanes.forEach(function(lane, i) {
      var col = document.createElement('div');
      col.className = 'scene-node';
      col.dataset.beat = 'lane-' + i;
      col.style.cssText = 'background:var(--surface-1);border:1px solid ' + lane.color
        + ';border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;';

      // Lane header
      var hdr = document.createElement('div');
      hdr.style.cssText = 'display:flex;align-items:center;gap:10px;';
      hdr.innerHTML =
        '<i class="ti ' + lane.icon + '" style="font-size:22px;color:' + lane.color + ';flex-shrink:0"></i>'
        + '<div>'
        + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:.1em;font-weight:700;color:' + lane.color + '">' + lane.label + '</div>'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1);margin-top:2px;line-height:1.2">' + lane.heading + '</div>'
        + '</div>';
      col.appendChild(hdr);

      // Actions
      var actions = document.createElement('div');
      actions.style.cssText = 'display:flex;flex-direction:column;gap:6px;flex:1;';
      lane.actions.forEach(function(action) {
        var el = document.createElement('div');
        el.style.cssText = 'display:flex;align-items:flex-start;gap:7px;font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2);line-height:1.5;';
        el.innerHTML = '<span style="color:' + lane.color + ';flex-shrink:0;margin-top:3px">&#8227;</span>' + action;
        actions.appendChild(el);
      });
      col.appendChild(actions);

      // Gate line at bottom
      var gateEl = document.createElement('div');
      gateEl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.04em;color:'
        + lane.color + ';background:rgba(0,0,0,.15);border-radius:4px;padding:5px 8px;line-height:1.4;';
      gateEl.textContent = lane.gate;
      col.appendChild(gateEl);

      lanesRow.appendChild(col);
    });
    outer.appendChild(lanesRow);

    // Closing gate bar
    var gateBar = document.createElement('div');
    gateBar.className = 'scene-node';
    gateBar.dataset.beat = 'gate';
    gateBar.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 16px;'
      + 'background:rgba(52,211,153,.06);border:1px solid var(--green);border-radius:7px;flex-shrink:0;';
    gateBar.innerHTML =
      '<i class="ti ti-lock-check" style="font-size:18px;color:var(--green);flex-shrink:0"></i>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--green);margin-bottom:2px">First objective</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1)">One decision supported by evidence -- before any platform investment.</div>'
      + '</div>';
    outer.appendChild(gateBar);

    container.appendChild(outer);
  }

  var steps = lanes.map(function(_, i) {
    return { delay: 300 + i * 600, run: function() {
      var node = container.querySelector('[data-beat="lane-' + i + '"]');
      if (node) node.classList.add('visible');
    }};
  }).concat([{
    delay: 300 + lanes.length * 600 + 300,
    run: function() {
      var gate = container.querySelector('[data-beat="gate"]');
      if (gate) gate.classList.add('visible');
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
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
