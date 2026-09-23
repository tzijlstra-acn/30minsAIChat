// Scene: scale-architecture (Screen 08 - HOW TO SCALE)
// V15 overhaul: PROOF -> PRODUCTION -> REUSE states.
// Shows a retrieval-confidence failure in Proof and adds Production controls to resolve it.
// Second use case reuses the shared spine.
SceneDirector.register('scale-architecture', function(container, manifest, reduced) {

  var proofComponents = [
    'Limited documents',
    'Single workflow',
    'Manual fallback',
    'Basic evidence log'
  ];

  var productionComponents = [
    'Identity and access',
    'Monitoring and alerts',
    'Evaluation framework',
    'Resilience and fallback',
    'Controlled integrations',
    'Incident handling'
  ];

  var reuseComponents = [
    'Shared context layer',
    'Reusable orchestration',
    'Common evidence framework',
    'Shared security and observability',
    'Cost and value governance'
  ];

  function buildComponentList(items, color) {
    return items.map(function(item) {
      return '<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);">'
        + '<span style="font-size:10px;color:' + color + ';flex-shrink:0">&#8226;</span>'
        + '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);line-height:1.3">' + item + '</span>'
        + '</div>';
    }).join('');
  }

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // Failure alert bar (hidden initially)
    var failBar = document.createElement('div');
    failBar.className = 'scene-node';
    failBar.dataset.beat = 'fail-bar';
    failBar.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:8px 14px;'
      + 'background:rgba(240,117,138,.08);border:1px solid var(--pink);border-radius:6px;';
    failBar.innerHTML =
      '<i class="ti ti-alert-triangle" style="font-size:16px;color:var(--pink);flex-shrink:0"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--pink)">Proof failure detected</span>'
      + '<span style="font-size:13px;color:var(--text-2);margin-left:4px">-- Low retrieval confidence on OBL-27. Process frozen pending review.</span>';
    outer.appendChild(failBar);

    // Three state columns
    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;flex:1;min-height:0;';

    // PROOF
    var proofCard = document.createElement('div');
    proofCard.className = 'scene-node';
    proofCard.dataset.beat = 'state-proof';
    proofCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--cyan);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;';
    proofCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      + '<i class="ti ti-flask" style="font-size:18px;color:var(--cyan)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;font-weight:700;color:var(--cyan)">PROOF</span>'
      + '</div>'
      + buildComponentList(proofComponents, 'var(--cyan)');
    cols.appendChild(proofCard);

    // PRODUCTION
    var prodCard = document.createElement('div');
    prodCard.className = 'scene-node';
    prodCard.dataset.beat = 'state-production';
    prodCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--accent);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;';
    prodCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      + '<i class="ti ti-server" style="font-size:18px;color:var(--accent)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;font-weight:700;color:var(--accent)">PRODUCTION</span>'
      + '</div>'
      + buildComponentList(productionComponents, 'var(--accent)');
    cols.appendChild(prodCard);

    // REUSE
    var reuseCard = document.createElement('div');
    reuseCard.className = 'scene-node';
    reuseCard.dataset.beat = 'state-reuse';
    reuseCard.style.cssText = 'background:var(--surface-1);border:1px solid var(--green);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;';
    reuseCard.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      + '<i class="ti ti-recycle" style="font-size:18px;color:var(--green)"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;font-weight:700;color:var(--green)">REUSE</span>'
      + '</div>'
      + buildComponentList(reuseComponents, 'var(--green)')
      + '<div style="margin-top:6px;font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);font-style:italic">A second use case reuses the shared spine instead of rebuilding it.</div>';
    cols.appendChild(reuseCard);

    outer.appendChild(cols);

    // Shared spine note
    var spineNote = document.createElement('div');
    spineNote.className = 'scene-node';
    spineNote.dataset.beat = 'spine-note';
    spineNote.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:8px 14px;'
      + 'background:rgba(88,201,148,.05);border:1px solid var(--green);border-radius:6px;';
    spineNote.innerHTML =
      '<i class="ti ti-plug-connected" style="font-size:16px;color:var(--green);flex-shrink:0"></i>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2)">Governance wraps the entire path. Only components active for the current step light up.</span>';
    outer.appendChild(spineNote);

    container.appendChild(outer);
  }

  var steps = [
    { delay: 300,  run: function() {
      var n = container.querySelector('[data-beat="state-proof"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 1200, run: function() {
      // Show failure
      var f = container.querySelector('[data-beat="fail-bar"]');
      if (f) f.classList.add('visible');
    }},
    { delay: 2400, run: function() {
      // Production resolves failure
      var n = container.querySelector('[data-beat="state-production"]');
      if (n) n.classList.add('visible');
      var f = container.querySelector('[data-beat="fail-bar"]');
      if (f) {
        f.style.borderColor = 'var(--green)';
        f.style.background = 'rgba(88,201,148,.05)';
        var ico = f.querySelector('.ti');
        if (ico) ico.style.color = 'var(--green)';
        var badge = f.querySelector('[style*="pink"]');
        var allSpans = f.querySelectorAll('span');
        if (allSpans[0]) { allSpans[0].textContent = 'Failure handled'; allSpans[0].style.color = 'var(--green)'; }
        if (allSpans[1]) { allSpans[1].textContent = '-- Monitoring detected low confidence. Fallback triggered and process resumed.'; }
      }
    }},
    { delay: 3800, run: function() {
      var n = container.querySelector('[data-beat="state-reuse"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 5000, run: function() {
      var n = container.querySelector('[data-beat="spine-note"]');
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
