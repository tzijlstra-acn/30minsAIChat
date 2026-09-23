// Scene: work-role-shift (Screen 06 - WHERE IT APPLIES)
// V15 overhaul: one representative role -- Governance and policy analyst.
// TODAY column vs WITH AI column, showing task migration and human judgement.
// Evidence label: ILLUSTRATIVE TASK MODEL -- NOT A HEADCOUNT FORECAST
SceneDirector.register('work-role-shift', function(container, manifest, reduced) {

  var todayTasks = [
    'Collect source material',
    'Compare requirements',
    'Draft obligation mappings',
    'Chase owners for responses',
    'Prepare evidence packages'
  ];

  var withAITasks = [
    { text: 'Interpret ambiguity',    type: 'human', label: 'Judgement' },
    { text: 'Challenge AI matches',   type: 'human', label: 'Challenge' },
    { text: 'Decide materiality',     type: 'human', label: 'Decision'  },
    { text: 'Approve changes',        type: 'human', label: 'Approval'  },
    { text: 'Own the evidence record',type: 'human', label: 'Ownership' }
  ];

  var humanColor = 'var(--amber)';
  var aiColor    = 'var(--accent)';

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // Role header
    var roleHdr = document.createElement('div');
    roleHdr.className = 'scene-node';
    roleHdr.dataset.beat = 'role-hdr';
    roleHdr.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;padding:8px 14px;'
      + 'background:var(--surface-2);border:1px solid var(--border-1);border-radius:6px;';
    roleHdr.innerHTML =
      '<i class="ti ti-user" style="font-size:18px;color:var(--text-2)"></i>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3)">Representative role</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1)">Governance and policy analyst</div>'
      + '</div>'
      + '<div style="margin-left:auto;font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);background:var(--surface-1);border:1px solid var(--border-1);border-radius:3px;padding:2px 6px;">Illustrative</div>';
    outer.appendChild(roleHdr);

    // Two-column layout
    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;flex:1;min-height:0;';

    // TODAY column
    var todayCol = document.createElement('div');
    todayCol.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var todayHdr = document.createElement('div');
    todayHdr.className = 'scene-node';
    todayHdr.dataset.beat = 'col-hdr-today';
    todayHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);padding:4px 8px;border-bottom:2px solid var(--border-1);margin-bottom:2px;';
    todayHdr.textContent = 'Today';
    todayCol.appendChild(todayHdr);

    todayTasks.forEach(function(t, i) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'today-' + i;
      card.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;'
        + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:7px;';
      card.innerHTML =
        '<i class="ti ti-point" style="font-size:12px;color:var(--text-3);flex-shrink:0"></i>'
        + '<span style="font-family:\'Inter\',sans-serif;font-size:14px;color:var(--text-2);line-height:1.3">' + t + '</span>';
      todayCol.appendChild(card);
    });

    // WITH AI column
    var aiCol = document.createElement('div');
    aiCol.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    var aiHdr = document.createElement('div');
    aiHdr.className = 'scene-node';
    aiHdr.dataset.beat = 'col-hdr-ai';
    aiHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:' + humanColor + ';padding:4px 8px;border-bottom:2px solid ' + humanColor + ';margin-bottom:2px;';
    aiHdr.textContent = 'With AI -- human focus';
    aiCol.appendChild(aiHdr);

    withAITasks.forEach(function(t, i) {
      var card = document.createElement('div');
      card.className = 'scene-node';
      card.dataset.beat = 'ai-' + i;
      card.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;'
        + 'background:rgba(243,179,76,.05);border:1px solid rgba(243,179,76,.3);border-radius:7px;';
      card.innerHTML =
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.09em;text-transform:uppercase;'
        + 'color:' + humanColor + ';background:rgba(243,179,76,.1);border:1px solid rgba(243,179,76,.3);border-radius:3px;padding:1px 5px;flex-shrink:0;white-space:nowrap;">' + t.label + '</span>'
        + '<span style="font-family:\'Inter\',sans-serif;font-size:14px;font-weight:600;color:var(--text-1);line-height:1.3">' + t.text + '</span>';
      aiCol.appendChild(card);
    });

    cols.appendChild(todayCol);
    cols.appendChild(aiCol);
    outer.appendChild(cols);

    // AI workbench note
    var note = document.createElement('div');
    note.className = 'scene-node';
    note.dataset.beat = 'ai-note';
    note.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:8px;padding:7px 12px;'
      + 'background:rgba(180,76,255,.05);border:1px solid rgba(180,76,255,.2);border-radius:5px;';
    note.innerHTML =
      '<i class="ti ti-cpu" style="font-size:15px;color:' + aiColor + ';flex-shrink:0"></i>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-3)">AI handles ingestion, extraction, comparison and evidence packaging in the background.</span>';
    outer.appendChild(note);

    container.appendChild(outer);
  }

  var steps = [
    { delay: 300,  run: function() {
      var n = container.querySelector('[data-beat="role-hdr"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 800,  run: function() {
      var n = container.querySelector('[data-beat="col-hdr-today"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 1100, run: function() {
      for (var i = 0; i < todayTasks.length; i++) {
        (function(idx) {
          setTimeout(function() {
            var n = container.querySelector('[data-beat="today-' + idx + '"]');
            if (n) n.classList.add('visible');
          }, idx * 200);
        })(i);
      }
    }},
    { delay: 2500, run: function() {
      var n = container.querySelector('[data-beat="col-hdr-ai"]');
      if (n) n.classList.add('visible');
    }},
    { delay: 2900, run: function() {
      for (var i = 0; i < withAITasks.length; i++) {
        (function(idx) {
          setTimeout(function() {
            var n = container.querySelector('[data-beat="ai-' + idx + '"]');
            if (n) n.classList.add('visible');
            // Fade corresponding today card slightly
            var todayCard = container.querySelector('[data-beat="today-' + idx + '"]');
            if (todayCard) todayCard.style.opacity = '0.4';
          }, idx * 250);
        })(i);
      }
    }},
    { delay: 4300, run: function() {
      var n = container.querySelector('[data-beat="ai-note"]');
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
      for (var i = 0; i < todayTasks.length; i++) {
        var todayCard = container.querySelector('[data-beat="today-' + i + '"]');
        if (todayCard) todayCard.style.opacity = '0.4';
      }
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
