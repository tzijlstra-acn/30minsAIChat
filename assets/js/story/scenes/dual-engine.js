// Scene: dual-engine (Screen 10 - HOW TO SCALE)
// V17: Reduce the hand-off tax.
// 4-state progression: fragmented islands -- delivery spine -- integrated route -- proof points
SceneDirector.register('dual-engine', function(container, manifest, reduced) {

  // Phase 1: fragmented islands (before Accenture)
  var ISLANDS = [
    { label: 'Risk team',        note: 'Interprets the obligation', color: 'rgba(85,199,232,.08)',  tc: 'var(--cyan)'   },
    { label: 'AI team',          note: 'Builds without full context', color: 'rgba(180,76,255,.08)', tc: 'var(--accent)' },
    { label: 'Run team',         note: 'Operates without design intent', color: 'rgba(88,201,148,.08)', tc: 'var(--green)' }
  ];

  // Phase 2: delivery spine
  var SPINE_STEPS = ['Frame', 'Design', 'Build', 'Prove', 'Industrialise', 'Optimise'];

  // Phase 3: integrated fields (replaces islands)
  var FIELDS = [
    {
      id:    'risk',
      label: 'Risk and regulatory design',
      color: 'var(--cyan)',
      items: [
        'Risk capability and obligation mapping',
        'Process and control model',
        'Human decision rights and gate criteria',
        'Regulatory interpretation and evidence standard'
      ]
    },
    {
      id:    'build',
      label: 'AI build and integration',
      color: 'var(--accent)',
      items: [
        'Data and context model',
        'Knowledge graph and retrieval',
        'Model selection and agent orchestration',
        'Security, identity and provenance'
      ]
    },
    {
      id:    'run',
      label: 'Production run and scale',
      color: 'var(--green)',
      items: [
        'Least complex suitable technology',
        'Shared platform and context reuse',
        'Cost per case tracking and optimisation',
        'Risk-based human review routing'
      ]
    }
  ];

  // Phase 4: proof points
  var PROOFS = [
    { label: '47-capability risk model',         color: 'var(--accent)' },
    { label: '28 source-backed AI solutions',     color: 'var(--cyan)'   },
    { label: 'Process and workforce methods',     color: 'var(--amber)'  },
    { label: 'Architecture and economics assets', color: 'var(--green)'  }
  ];

  // --- Build helpers ---

  function makeIslandRow() {
    var row = document.createElement('div');
    row.className = 'de-islands scene-node';
    row.dataset.beat = 'islands';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;'
      + 'flex:1;min-height:0;overflow:hidden;';
    ISLANDS.forEach(function(isl) {
      var card = document.createElement('div');
      card.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;'
        + 'gap:8px;padding:14px;background:' + isl.color + ';border-radius:8px;'
        + 'border:1px dashed ' + isl.tc + ';text-align:center;';
      card.innerHTML =
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:' + isl.tc + '">' + isl.label + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-3);line-height:1.4">' + isl.note + '</div>'
        + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;color:var(--text-3);'
        + 'text-transform:uppercase;padding:3px 8px;background:var(--surface-1);border-radius:20px">isolated</div>';
      row.appendChild(card);
    });
    return row;
  }

  function makeSpineRow(showLabel) {
    var wrap = document.createElement('div');
    wrap.className = 'de-spine scene-node';
    wrap.dataset.beat = 'spine';
    wrap.style.cssText = 'flex-shrink:0;display:flex;flex-direction:column;gap:5px;'
      + 'opacity:0;transition:opacity .6s;';
    if (showLabel) {
      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;'
        + 'text-transform:uppercase;color:var(--text-3);';
      lbl.textContent = 'Delivery route';
      wrap.appendChild(lbl);
    }
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:4px;';
    SPINE_STEPS.forEach(function(step, i) {
      var chip = document.createElement('div');
      chip.style.cssText = 'padding:4px 11px;background:var(--surface-2);border-radius:20px;'
        + 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);'
        + 'white-space:nowrap;border:1px solid var(--border-2);';
      chip.textContent = step;
      row.appendChild(chip);
      if (i < SPINE_STEPS.length - 1) {
        var arr = document.createElement('span');
        arr.style.cssText = 'color:var(--border-2);font-size:14px;flex-shrink:0;';
        arr.innerHTML = '&#8594;';
        row.appendChild(arr);
      }
    });
    wrap.appendChild(row);
    return wrap;
  }

  function makeFieldsRow() {
    var row = document.createElement('div');
    row.className = 'de-fields scene-node';
    row.dataset.beat = 'fields';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;'
      + 'flex:1;min-height:0;overflow:hidden;opacity:0;transition:opacity .6s;';
    FIELDS.forEach(function(field) {
      var card = document.createElement('div');
      card.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:12px;'
        + 'background:var(--surface-1);border-top:3px solid ' + field.color + ';border-radius:8px;overflow:hidden;';
      card.innerHTML =
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:' + field.color + ';line-height:1.2">' + field.label + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:4px;overflow:hidden;">'
        + field.items.map(function(item) {
          return '<div style="display:flex;align-items:flex-start;gap:6px;font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);line-height:1.4">'
            + '<span style="color:' + field.color + ';flex-shrink:0;margin-top:2px">&#8227;</span>' + item + '</div>';
        }).join('')
        + '</div>';
      row.appendChild(card);
    });
    return row;
  }

  function makeProofsRow() {
    var row = document.createElement('div');
    row.className = 'de-proofs scene-node';
    row.dataset.beat = 'proofs';
    row.style.cssText = 'flex-shrink:0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;'
      + 'opacity:0;transition:opacity .5s;';
    PROOFS.forEach(function(p) {
      var t = document.createElement('div');
      t.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 10px;'
        + 'background:var(--surface-2);border-left:3px solid ' + p.color + ';border-radius:4px;';
      t.innerHTML = '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);line-height:1.3">' + p.label + '</span>';
      row.appendChild(t);
    });
    return row;
  }

  // State machine: 4 phases
  // Phase 0 (start): islands only
  // Phase 1 (beat spine): spine appears below islands
  // Phase 2 (beat fields): islands fade out, fields fade in
  // Phase 3 (beat proofs): proofs appear below spine

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:8px 14px;';

    // Label: before
    var beforeLbl = document.createElement('div');
    beforeLbl.className = 'de-before-lbl scene-node';
    beforeLbl.dataset.beat = 'before-lbl';
    beforeLbl.style.cssText = 'flex-shrink:0;font-family:\'JetBrains Mono\',monospace;font-size:9px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);padding:0 2px;';
    beforeLbl.textContent = 'Without integration';
    outer.appendChild(beforeLbl);

    outer.appendChild(makeIslandRow());

    // Spine (hidden initially)
    var spine = makeSpineRow(true);
    outer.appendChild(spine);

    // Fields (hidden initially, overlaps islands in DOM but opacity:0)
    var fields = makeFieldsRow();
    outer.appendChild(fields);

    // Proofs (hidden initially)
    outer.appendChild(makeProofsRow());

    container.appendChild(outer);
  }

  var steps = [
    // Phase 0: islands visible immediately
    { delay: 100, run: function() {
      container.querySelectorAll('.de-islands,.de-before-lbl').forEach(function(n) {
        n.classList.add('visible');
        n.style.opacity = '1';
      });
    }},
    // Phase 1: spine appears
    { delay: 1800, run: function() {
      var s = container.querySelector('.de-spine');
      if (s) { s.classList.add('visible'); s.style.opacity = '1'; }
    }},
    // Phase 2: islands/label fade, fields appear
    { delay: 3200, run: function() {
      var isl = container.querySelector('.de-islands');
      var lbl = container.querySelector('.de-before-lbl');
      if (isl) isl.style.cssText += 'opacity:0;transition:opacity .6s;pointer-events:none;';
      if (lbl) lbl.style.opacity = '0';
      var f = container.querySelector('.de-fields');
      if (f) {
        f.classList.add('visible'); f.style.opacity = '1';
        // restructure: fields row replaces islands row visually by absolute positioning is complex,
        // simpler: let islands collapse. Use grid-row trick.
        f.style.gridRow = '';
      }
    }},
    // Phase 3: proofs appear
    { delay: 5000, run: function() {
      var p = container.querySelector('.de-proofs');
      if (p) { p.classList.add('visible'); p.style.opacity = '1'; }
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play:   function() { build(); tl.play(); },
    pause:  tl.pause,
    resume: tl.resume,
    reset:  function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) {
        n.classList.add('visible');
        n.style.opacity = '1';
      });
      var isl = container.querySelector('.de-islands');
      if (isl) { isl.style.opacity = '0'; isl.style.pointerEvents = 'none'; }
      var lbl = container.querySelector('.de-before-lbl');
      if (lbl) lbl.style.opacity = '0';
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
