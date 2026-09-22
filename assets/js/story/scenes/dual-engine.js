// Scene: dual-engine (Screen 10 - HOW TO SCALE)
// Shows the two delivery engines: client transformation + accelerated delivery.
// Visual: two columns connected by a shared spine ("Reusable across both").
// Animation: engine headers appear, then items stagger in, then shared spine chips.
SceneDirector.register('dual-engine', function(container, manifest, reduced) {

  var engineA = {
    label:    'Engine A',
    sublabel: 'Transform the client function',
    color:    'var(--accent)',
    icon:     'ti-building',
    items: [
      { text: 'Regulation coverage automation',  note: 'Straight-through for standard obligations' },
      { text: 'Risk decision support',           note: 'AI-drafted rationale, named human approval' },
      { text: 'Monitoring and surveillance',     note: 'Continuous signal detection and alert routing' },
      { text: 'Report and evidence generation',  note: 'Regulatory-grade evidence packaging at scale' }
    ]
  };

  var engineB = {
    label:    'Engine B',
    sublabel: 'Accelerate selected delivery activities',
    color:    'var(--cyan)',
    icon:     'ti-rocket',
    items: [
      { text: 'Reusable AI components',          note: 'Shared inference, retrieval and evaluation' },
      { text: 'Pre-built data pipelines',        note: 'Regulatory data and control-library connectors' },
      { text: 'Control frameworks',              note: 'Model risk, audit, and evidence templates' },
      { text: 'AI-assisted quality review',      note: 'Faster internal review, earlier issue detection' }
    ]
  };

  var spineItems = ['Shared data layer', 'Orchestration platform', 'Evaluation and monitoring', 'Identity and access'];

  function buildEngine(eng) {
    var col = document.createElement('div');
    col.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;';

    // Engine header
    var hdr = document.createElement('div');
    hdr.className = 'scene-node';
    hdr.dataset.beat = 'hdr-' + eng.label;
    hdr.style.cssText = 'background:var(--surface-2);border:1px solid ' + eng.color
      + ';border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:3px;';
    hdr.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px">'
      + '<i class="ti ' + eng.icon + '" style="font-size:20px;color:' + eng.color + '"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.1em;font-weight:700;color:' + eng.color + '">' + eng.label + '</span>'
      + '</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;color:var(--text-1);margin-top:2px">' + eng.sublabel + '</div>';
    col.appendChild(hdr);

    // Items
    eng.items.forEach(function(item, i) {
      var el = document.createElement('div');
      el.className = 'scene-node';
      el.dataset.beat = 'item-' + eng.label + '-' + i;
      el.style.cssText = 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:8px;padding:10px 14px;';
      el.innerHTML =
        '<div style="font-size:14px;color:var(--text-1);font-weight:600;margin-bottom:3px">' + item.text + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-3);line-height:1.4">' + item.note + '</div>';
      col.appendChild(el);
    });
    return col;
  }

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:12px 16px;';

    // Engines row
    var engines = document.createElement('div');
    engines.style.cssText = 'display:flex;gap:12px;flex:1;min-height:0;';
    engines.appendChild(buildEngine(engineA));

    // Connector column
    var conn = document.createElement('div');
    conn.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0;';
    var connLine1 = document.createElement('div');
    connLine1.className = 'scene-node';
    connLine1.dataset.beat = 'conn';
    connLine1.style.cssText = 'width:1px;flex:1;background:var(--border-1);';
    var connIcon = document.createElement('div');
    connIcon.className = 'scene-node';
    connIcon.dataset.beat = 'conn';
    connIcon.style.cssText = 'font-size:18px;color:var(--border-2,rgba(255,255,255,.15));';
    connIcon.textContent = '↔';
    var connLine2 = document.createElement('div');
    connLine2.className = 'scene-node';
    connLine2.dataset.beat = 'conn';
    connLine2.style.cssText = 'width:1px;flex:1;background:var(--border-1);';
    conn.appendChild(connLine1);
    conn.appendChild(connIcon);
    conn.appendChild(connLine2);
    engines.appendChild(conn);
    engines.appendChild(buildEngine(engineB));
    outer.appendChild(engines);

    // Shared platform spine
    var spineWrap = document.createElement('div');
    spineWrap.className = 'scene-node';
    spineWrap.dataset.beat = 'spine';
    spineWrap.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;flex-shrink:0;flex-wrap:wrap;';
    spineWrap.innerHTML = '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);white-space:nowrap">Shared across both</span>';
    spineItems.forEach(function(s) {
      var chip = document.createElement('span');
      chip.style.cssText = 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:4px;padding:3px 10px;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-2);';
      chip.textContent = s;
      spineWrap.appendChild(chip);
    });
    outer.appendChild(spineWrap);
    container.appendChild(outer);
  }

  function byBeat(beat) { return container.querySelectorAll('[data-beat="' + beat + '"]'); }

  var steps = [
    { delay: 300,  run: function() { byBeat('hdr-' + engineA.label).forEach(function(n){n.classList.add('visible');}); byBeat('hdr-' + engineB.label).forEach(function(n){n.classList.add('visible');}); }},
    { delay: 700,  run: function() { byBeat('conn').forEach(function(n){n.classList.add('visible');}); }}
  ];

  // Stagger items from both engines together
  var maxItems = Math.max(engineA.items.length, engineB.items.length);
  for (var i = 0; i < maxItems; i++) {
    (function(idx) {
      steps.push({ delay: 1100 + idx * 600, run: function() {
        byBeat('item-' + engineA.label + '-' + idx).forEach(function(n){n.classList.add('visible');});
        byBeat('item-' + engineB.label + '-' + idx).forEach(function(n){n.classList.add('visible');});
      }});
    })(i);
  }
  steps.push({ delay: 1100 + maxItems * 600 + 200, run: function() { byBeat('spine').forEach(function(n){n.classList.add('visible');}); }});

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
