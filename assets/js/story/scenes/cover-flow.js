// Scene: cover-flow (Screen 00 - Introduction)
// Thesis: AI re-routes how a regulatory obligation becomes a decision.
// Animation sequence:
//   1. Regulatory document card appears
//   2. Arrow extracts an obligation pill
//   3. Obligation pill ("Art. 7(3) coverage mapping") appears
//   4. Divider line draws
//   5. Three destination words reveal: Work. / Evidence. / Decision.
SceneDirector.register('cover-flow', function(container, manifest, reduced) {

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;height:100%;padding:24px 32px;';

    // ── Source document card ──
    var docCard = document.createElement('div');
    docCard.className = 'scene-node';
    docCard.dataset.beat = 'doc';
    docCard.style.cssText = 'display:flex;align-items:center;gap:14px;padding:12px 20px;background:var(--surface-1);border:1px solid var(--border-1);border-radius:8px;max-width:480px;width:100%;';
    docCard.innerHTML = '<svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:.7">'
      + '<rect x="1" y="1" width="22" height="26" rx="3" stroke="var(--text-3)" stroke-width="1.5"/>'
      + '<line x1="5" y1="8" x2="19" y2="8" stroke="var(--text-3)" stroke-width="1.2" opacity=".6"/>'
      + '<line x1="5" y1="13" x2="19" y2="13" stroke="var(--text-3)" stroke-width="1.2" opacity=".4"/>'
      + '<line x1="5" y1="18" x2="14" y2="18" stroke="var(--text-3)" stroke-width="1.2" opacity=".3"/>'
      + '</svg>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:3px">Regulatory source</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:600;color:var(--text-2)">Basel IV: CRR III Article 7 -- Coverage mapping requirements</div>'
      + '</div>';
    wrap.appendChild(docCard);

    // ── Extraction arrow ──
    var extractRow = document.createElement('div');
    extractRow.className = 'scene-node';
    extractRow.dataset.beat = 'arrow';
    extractRow.style.cssText = 'display:flex;align-items:center;gap:8px;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;color:var(--text-3);text-transform:uppercase;';
    extractRow.innerHTML = '<div style="width:1px;height:20px;background:var(--border-1)"></div><span>AI extraction</span><div style="width:1px;height:20px;background:var(--border-1)"></div>';
    extractRow.style.flexDirection = 'column';
    extractRow.style.alignItems = 'center';
    wrap.appendChild(extractRow);

    // ── Obligation pill ──
    var pill = document.createElement('div');
    pill.className = 'scene-node obligation-pill';
    pill.dataset.beat = 'pill';
    pill.style.cssText = 'display:inline-flex;align-items:center;gap:12px;padding:10px 20px;background:rgba(161,0,255,.07);border:1.5px solid var(--accent);border-radius:8px;max-width:480px;width:100%;';
    pill.innerHTML = '<div style="flex-shrink:0;width:8px;height:8px;border-radius:50%;background:var(--accent)"></div>'
      + '<div>'
      + '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:3px">Regulatory obligation</div>'
      + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;color:var(--text-1)">Art. 7(3) -- Coverage mapping</div>'
      + '</div>'
      + '<div style="margin-left:auto;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:3px;background:rgba(34,211,238,.08);color:var(--cyan);white-space:nowrap">Extracting</div>';
    wrap.appendChild(pill);

    // ── Divider ──
    var div = document.createElement('div');
    div.className = 'scene-node';
    div.dataset.beat = 'divider';
    div.style.cssText = 'width:1px;height:20px;background:var(--border-1);';
    wrap.appendChild(div);

    // ── Four-step horizontal flow: Source -> AI work -> Human decision -> Evidence ──
    var flowRow = document.createElement('div');
    flowRow.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;';

    var flowSteps = [
      { label: 'Source',          color: 'var(--cyan)',   icon: 'ti-file-text'    },
      { label: 'AI-supported',    color: 'var(--accent)', icon: 'ti-cpu'          },
      { label: 'Human decision',  color: 'var(--amber)',  icon: 'ti-user-check'   },
      { label: 'Evidence',        color: 'var(--green)',  icon: 'ti-certificate'  }
    ];

    flowSteps.forEach(function(s, i) {
      var chip = document.createElement('div');
      chip.className = 'scene-node';
      chip.dataset.beat = 'word-' + i;
      chip.style.cssText = 'display:flex;align-items:center;gap:6px;padding:8px 14px;'
        + 'background:var(--surface-1);border:1px solid ' + s.color + ';border-radius:8px;';
      chip.innerHTML = '<i class="ti ' + s.icon + '" style="font-size:16px;color:' + s.color + '"></i>'
        + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:var(--text-1)">' + s.label + '</span>';
      flowRow.appendChild(chip);
      if (i < flowSteps.length - 1) {
        var arr = document.createElement('div');
        arr.className = 'scene-node';
        arr.dataset.beat = 'sep-' + i;
        arr.style.cssText = 'font-size:16px;color:var(--border-2);';
        arr.textContent = '→';
        flowRow.appendChild(arr);
      }
    });
    wrap.appendChild(flowRow);
    container.appendChild(wrap);
  }

  function getByBeat(beat) {
    return container.querySelector('[data-beat="' + beat + '"]');
  }

  var anim_steps = [
    { delay: 300,  run: function() { var n = getByBeat('doc');     if (n) n.classList.add('visible'); }},
    { delay: 900,  run: function() { var n = getByBeat('arrow');   if (n) n.classList.add('visible'); }},
    { delay: 1400, run: function() { var n = getByBeat('pill');    if (n) n.classList.add('visible'); }},
    { delay: 2000, run: function() { var n = getByBeat('divider'); if (n) n.classList.add('visible'); }},
    { delay: 2300, run: function() { var n = getByBeat('word-0');  if (n) n.classList.add('visible'); var s = getByBeat('sep-0'); if (s) s.classList.add('visible'); }},
    { delay: 2900, run: function() { var n = getByBeat('word-1');  if (n) n.classList.add('visible'); var s = getByBeat('sep-1'); if (s) s.classList.add('visible'); }},
    { delay: 3500, run: function() { var n = getByBeat('word-2');  if (n) n.classList.add('visible'); var s = getByBeat('sep-2'); if (s) s.classList.add('visible'); }},
    { delay: 4100, run: function() { var n = getByBeat('word-3');  if (n) n.classList.add('visible'); }}
  ];

  var tl = createTimeline(anim_steps);

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
