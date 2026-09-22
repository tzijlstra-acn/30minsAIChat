// Scene: dual-engine (Screen 10 - HOW TO SCALE)
// Two interlocking engines: client transformation + delivery acceleration
SceneDirector.register('dual-engine', function(container, manifest, reduced) {
  var engineA = {
    label: 'Engine A: Transform the client function',
    color: 'var(--accent)',
    items: ['Regulation coverage automation', 'Risk decision support', 'Monitoring and surveillance', 'Report and evidence generation']
  };
  var engineB = {
    label: 'Engine B: Accelerate delivery',
    color: 'var(--cyan)',
    items: ['Reusable AI components', 'Pre-built data pipelines', 'Control frameworks', 'AI-assisted quality review']
  };

  function buildEngine(eng) {
    var col = document.createElement('div');
    col.style.cssText = 'flex:1;background:var(--surface-1);border:1px solid ' + eng.color + ';border-radius:12px;padding:16px;';

    var hdr = document.createElement('div');
    hdr.className = 'scene-node';
    hdr.dataset.engineHdr = eng.label;
    hdr.style.cssText = 'font-family:"Space Grotesk",sans-serif;font-size:12px;font-weight:700;color:' + eng.color + ';margin-bottom:10px;line-height:1.3;';
    hdr.textContent = eng.label;
    col.appendChild(hdr);

    eng.items.forEach(function(item) {
      var el = document.createElement('div');
      el.className = 'scene-node';
      el.dataset.engineItem = item;
      el.style.cssText = 'display:flex;align-items:center;gap:7px;margin-bottom:7px;font-size:11.5px;color:var(--text-2);';
      el.innerHTML = '<i class="ti ti-check" style="color:' + eng.color + ';font-size:12px;flex-shrink:0"></i>' + item;
      col.appendChild(el);
    });
    return col;
  }

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:16px;height:100%;padding:16px;align-items:stretch;';
    wrap.appendChild(buildEngine(engineA));

    var conn = document.createElement('div');
    conn.style.cssText = 'display:flex;align-items:center;color:var(--border-2,rgba(255,255,255,.15));font-size:24px;';
    conn.className = 'scene-node';
    conn.dataset.connArrow = '1';
    conn.textContent = '↔';
    wrap.appendChild(conn);

    wrap.appendChild(buildEngine(engineB));
    container.appendChild(wrap);
  }

  var allEngineItems = engineA.items.concat(engineB.items);
  var steps = [
    { delay: 300,  run: function() { container.querySelectorAll('[data-engine-hdr]').forEach(function(n){n.classList.add('visible');}); }},
    { delay: 700,  run: function() { container.querySelectorAll('[data-conn-arrow]').forEach(function(n){n.classList.add('visible');}); }}
  ].concat(allEngineItems.map(function(item, i) {
    return { delay: 1000 + i * 600, run: function() {
      var el = container.querySelector('[data-engine-item="' + item + '"]');
      if (el) el.classList.add('visible');
    }};
  }));

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
