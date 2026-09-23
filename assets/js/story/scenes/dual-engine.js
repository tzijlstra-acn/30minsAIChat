// Scene: dual-engine (Screen 10 - HOW TO SCALE)
// V16 overhaul: Accenture proposition.
// Three connected fields (Business/Technology/Economics) around the use case.
// Delivery spine: Frame -> Design -> Build -> Prove -> Industrialise -> Optimise.
SceneDirector.register('dual-engine', function(container, manifest, reduced) {

  var fields = [
    {
      id:    'business',
      label: 'Business and risk understanding',
      color: 'var(--cyan)',
      items: [
        'Risk capability and service design',
        'Process and control model',
        'Human decision rights',
        'Regulatory and policy interpretation',
        'Workforce and adoption'
      ]
    },
    {
      id:    'technology',
      label: 'Technical implementation',
      color: 'var(--accent)',
      items: [
        'Data and context model',
        'Knowledge graph and integration',
        'Model and agent orchestration',
        'Security, identity and evidence',
        'Evaluation and observability'
      ]
    },
    {
      id:    'economics',
      label: 'Cost-efficient setup',
      color: 'var(--green)',
      items: [
        'Least complex suitable technology',
        'Reuse shared platform and context',
        'Route work to the right model',
        'Risk-based human review',
        'Track cost per successful case'
      ]
    }
  ];

  var spineSteps = ['Frame', 'Design', 'Build', 'Prove', 'Industrialise', 'Optimise'];

  var evidenceTiles = [
    { label: '47-capability risk model',         color: 'var(--accent)' },
    { label: '28 source-backed AI solutions',     color: 'var(--cyan)'   },
    { label: 'Process and workforce methods',     color: 'var(--amber)'  },
    { label: 'Architecture and economics assets', color: 'var(--green)'  }
  ];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:8px 14px;';

    // Three-field row
    var fields3 = document.createElement('div');
    fields3.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;flex:1;min-height:0;';

    fields.forEach(function(field, fi) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'field-' + field.id;
      card.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:12px;'
        + 'background:var(--surface-1);border:1px solid ' + field.color + ';border-radius:10px;overflow:hidden;';

      // Field header
      var hdr = document.createElement('div');
      hdr.style.cssText = 'flex-shrink:0;';
      hdr.innerHTML =
        '<div style="width:28px;height:3px;background:' + field.color + ';border-radius:2px;margin-bottom:7px"></div>'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:' + field.color + ';line-height:1.2;margin-bottom:8px">' + field.label + '</div>';
      card.appendChild(hdr);

      // Items
      var items = document.createElement('div');
      items.style.cssText = 'display:flex;flex-direction:column;gap:4px;flex:1;overflow:hidden;';
      field.items.forEach(function(item) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:flex-start;gap:6px;font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2);line-height:1.45;';
        row.innerHTML = '<span style="color:' + field.color + ';flex-shrink:0;margin-top:2px">&#8227;</span>' + item;
        items.appendChild(row);
      });
      card.appendChild(items);
      fields3.appendChild(card);
    });
    outer.appendChild(fields3);

    // Delivery spine
    var spine = document.createElement('div');
    spine.className = 'scene-node';
    spine.dataset.beat = 'spine';
    spine.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:5px;';

    var spineHdr = document.createElement('div');
    spineHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:2px;';
    spineHdr.textContent = 'Delivery route';
    spine.appendChild(spineHdr);

    var spineRow = document.createElement('div');
    spineRow.style.cssText = 'display:flex;align-items:center;gap:4px;overflow-x:auto;';
    spineSteps.forEach(function(step, i) {
      var chip = document.createElement('div');
      chip.style.cssText = 'display:flex;align-items:center;gap:4px;padding:4px 10px;'
        + 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:20px;white-space:nowrap;'
        + 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);';
      chip.textContent = step;
      spineRow.appendChild(chip);
      if (i < spineSteps.length - 1) {
        var arr = document.createElement('span');
        arr.style.cssText = 'color:var(--border-2);font-size:14px;flex-shrink:0;';
        arr.textContent = '→';
        spineRow.appendChild(arr);
      }
    });
    spine.appendChild(spineRow);
    outer.appendChild(spine);

    // Evidence tiles
    var tilesRow = document.createElement('div');
    tilesRow.className = 'scene-node';
    tilesRow.dataset.beat = 'tiles';
    tilesRow.style.cssText = 'flex-shrink:0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;';

    evidenceTiles.forEach(function(tile) {
      var t = document.createElement('div');
      t.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 10px;'
        + 'background:var(--surface-2);border:1px solid ' + tile.color + ';border-radius:6px;';
      t.innerHTML = '<div style="width:6px;height:6px;border-radius:50%;background:' + tile.color + ';flex-shrink:0"></div>'
        + '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);line-height:1.3">' + tile.label + '</span>';
      tilesRow.appendChild(t);
    });
    outer.appendChild(tilesRow);

    container.appendChild(outer);
  }

  var steps = [
    { delay: 300,  run: function() {
      var f = container.querySelector('[data-beat="field-business"]');
      if (f) f.classList.add('visible');
    }},
    { delay: 1000, run: function() {
      var f = container.querySelector('[data-beat="field-technology"]');
      if (f) f.classList.add('visible');
    }},
    { delay: 1700, run: function() {
      var f = container.querySelector('[data-beat="field-economics"]');
      if (f) f.classList.add('visible');
    }},
    { delay: 2600, run: function() {
      var s = container.querySelector('[data-beat="spine"]');
      if (s) s.classList.add('visible');
    }},
    { delay: 3400, run: function() {
      var t = container.querySelector('[data-beat="tiles"]');
      if (t) t.classList.add('visible');
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
