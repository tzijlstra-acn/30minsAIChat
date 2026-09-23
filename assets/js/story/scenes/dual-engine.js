// Scene: dual-engine (Screen 10 - HOW TO SCALE)
// V15 overhaul: two parallel lanes converging on one evidence pack.
// Lane 1: Transform the function
// Lane 2: Accelerate delivery
// Three reusable assets shown in Lane 2. Convergence on evidence pack.
SceneDirector.register('dual-engine', function(container, manifest, reduced) {

  var lane1Steps = [
    { label: 'Redesign work',      icon: 'ti-route',        color: 'var(--accent)' },
    { label: 'Build controls',     icon: 'ti-shield-check', color: 'var(--accent)' },
    { label: 'Prove value',        icon: 'ti-certificate',  color: 'var(--green)'  },
    { label: 'Scale the pattern',  icon: 'ti-layers',       color: 'var(--green)'  }
  ];

  var lane2Steps = [
    { label: 'Ingest evidence',          icon: 'ti-database',      color: 'var(--cyan)'   },
    { label: 'Map processes',            icon: 'ti-sitemap',        color: 'var(--cyan)'   },
    { label: 'Generate specifications',  icon: 'ti-file-code',     color: 'var(--cyan)'   },
    { label: 'Test and document',        icon: 'ti-check-circle',  color: 'var(--green)'  }
  ];

  var assets = [
    { label: 'Regulatory data connectors', icon: 'ti-plug' },
    { label: 'Model risk templates',        icon: 'ti-file-check' },
    { label: 'AI-assisted review tooling',  icon: 'ti-cpu' }
  ];

  function makeStep(step) {
    var el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:6px;padding:7px 10px;'
      + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;';
    el.innerHTML =
      '<i class="ti ' + step.icon + '" style="font-size:15px;color:' + step.color + ';flex-shrink:0"></i>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);line-height:1.3">' + step.label + '</span>'
      + '<span style="margin-left:auto;font-size:14px;color:' + step.color + '">&#8594;</span>';
    return el;
  }

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // Two-lane + convergence layout
    var mainRow = document.createElement('div');
    mainRow.style.cssText = 'display:grid;grid-template-columns:1fr 24px 1fr 24px 160px;gap:0;align-items:start;flex:1;min-height:0;';

    // Lane 1: Transform
    var l1 = document.createElement('div');
    l1.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var l1Hdr = document.createElement('div');
    l1Hdr.className = 'scene-node';
    l1Hdr.dataset.beat = 'l1-hdr';
    l1Hdr.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;'
      + 'background:rgba(180,76,255,.08);border:1px solid rgba(180,76,255,.3);border-radius:8px;margin-bottom:2px;';
    l1Hdr.innerHTML =
      '<i class="ti ti-building" style="font-size:18px;color:var(--accent)"></i>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)">Lane 1</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1)">Transform the function</div>'
      + '</div>';
    l1.appendChild(l1Hdr);

    lane1Steps.forEach(function(step, i) {
      var el = makeStep(step);
      el.className = 'scene-node';
      el.dataset.beat = 'l1-step-' + i;
      l1.appendChild(el);
    });
    mainRow.appendChild(l1);

    // Separator 1
    var sep1 = document.createElement('div');
    sep1.style.cssText = 'display:flex;align-items:center;justify-content:center;padding-top:60px;';
    sep1.innerHTML = '<div style="width:1px;height:100%;background:var(--border-1);"></div>';
    mainRow.appendChild(sep1);

    // Lane 2: Accelerate
    var l2 = document.createElement('div');
    l2.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var l2Hdr = document.createElement('div');
    l2Hdr.className = 'scene-node';
    l2Hdr.dataset.beat = 'l2-hdr';
    l2Hdr.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;'
      + 'background:rgba(85,199,232,.07);border:1px solid rgba(85,199,232,.3);border-radius:8px;margin-bottom:2px;';
    l2Hdr.innerHTML =
      '<i class="ti ti-rocket" style="font-size:18px;color:var(--cyan)"></i>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)">Lane 2</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1)">Accelerate delivery</div>'
      + '</div>';
    l2.appendChild(l2Hdr);

    lane2Steps.forEach(function(step, i) {
      var el = makeStep(step);
      el.className = 'scene-node';
      el.dataset.beat = 'l2-step-' + i;
      l2.appendChild(el);
    });

    // Reusable assets (sub-items in lane 2)
    var assetsWrap = document.createElement('div');
    assetsWrap.className = 'scene-node';
    assetsWrap.dataset.beat = 'assets';
    assetsWrap.style.cssText = 'margin-top:4px;display:flex;flex-direction:column;gap:4px;padding:8px 10px;'
      + 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:7px;';
    assetsWrap.innerHTML = '<div style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:4px">Reusable assets entering lane 2</div>'
      + assets.map(function(a) {
        return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2);">'
          + '<i class="ti ' + a.icon + '" style="font-size:12px;color:var(--cyan);flex-shrink:0"></i>' + a.label + '</div>';
      }).join('');
    l2.appendChild(assetsWrap);
    mainRow.appendChild(l2);

    // Separator 2
    var sep2 = document.createElement('div');
    sep2.style.cssText = 'display:flex;align-items:center;justify-content:center;padding-top:60px;';
    sep2.innerHTML = '<div style="font-size:18px;color:var(--border-2)">&#8594;</div>';
    mainRow.appendChild(sep2);

    // Convergence: Evidence pack
    var evidPack = document.createElement('div');
    evidPack.className = 'scene-node';
    evidPack.dataset.beat = 'evid-pack';
    evidPack.style.cssText = 'background:rgba(88,201,148,.07);border:1px solid var(--green);border-radius:10px;padding:12px;'
      + 'display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;';
    evidPack.innerHTML =
      '<i class="ti ti-certificate" style="font-size:28px;color:var(--green)"></i>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--green)">Evidence pack</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:12px;font-weight:600;color:var(--text-1);line-height:1.3">Gate-ready decision support</div>';
    mainRow.appendChild(evidPack);

    outer.appendChild(mainRow);
    container.appendChild(outer);
  }

  var steps = [
    { delay: 300,  run: function() {
      var n = container.querySelector('[data-beat="l1-hdr"]');
      if (n) n.classList.add('visible');
      n = container.querySelector('[data-beat="l2-hdr"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 900,  run: function() {
      ['l1-step-0','l2-step-0'].forEach(function(b) {
        var n = container.querySelector('[data-beat="' + b + '"]');
        if (n) n.classList.add('visible');
      });
    }},
    { delay: 1500, run: function() {
      ['l1-step-1','l2-step-1'].forEach(function(b) {
        var n = container.querySelector('[data-beat="' + b + '"]');
        if (n) n.classList.add('visible');
      });
    }},
    { delay: 2200, run: function() {
      ['l1-step-2','l2-step-2'].forEach(function(b) {
        var n = container.querySelector('[data-beat="' + b + '"]');
        if (n) n.classList.add('visible');
      });
      var a = container.querySelector('[data-beat="assets"]');
      if (a) a.classList.add('visible');
    }},
    { delay: 3000, run: function() {
      ['l1-step-3','l2-step-3'].forEach(function(b) {
        var n = container.querySelector('[data-beat="' + b + '"]');
        if (n) n.classList.add('visible');
      });
    }},
    { delay: 3800, run: function() {
      var n = container.querySelector('[data-beat="evid-pack"]');
      if (n) n.classList.add('visible');
    }}
  ];

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
