SceneDirector.register('next-move', function(container, manifest, reduced) {
  var STAGES = [
    {
      label: 'STAGE 1', heading: 'Confirm the outcome',
      color: 'var(--cyan)', bg: 'rgba(85,199,232,.06)',
      width: '40%',
      bullets: [
        'Agree one bounded outcome with a named owner',
        'Define the evidence standard before any build',
        'Identify the single process this will first prove'
      ],
      beat: 'stage-0'
    },
    {
      label: 'STAGE 2', heading: 'Trace one real process',
      color: 'var(--accent)', bg: 'rgba(180,76,255,.06)',
      width: '35%',
      bullets: [
        'Map the full process from input to decision record',
        'Mark where AI can assist and where humans decide',
        'Note five system implications for the proof'
      ],
      beat: 'stage-1'
    },
    {
      label: 'STAGE 3', heading: 'Test one bounded path',
      color: 'var(--green)', bg: 'rgba(88,201,148,.06)',
      width: '25%',
      bullets: [
        'Run the AI on real work within the defined boundary',
        'Measure quality, control, adoption, speed and economics',
        'Produce a five-dimension evidence pack, board-ready'
      ],
      beat: 'stage-2'
    }
  ];

  var GATES = [
    { text: 'Gate: agreed outcome statement with named owner and evidence standard', beat: 'gate-0' },
    { text: 'Gate: process map with AI points, human gates and system implications marked', beat: 'gate-1' }
  ];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;height:100%;padding:8px 14px;gap:6px;';

    // Stage row
    var stageRow = document.createElement('div');
    stageRow.style.cssText = 'display:flex;align-items:stretch;gap:0;flex:1;min-height:0;';

    STAGES.forEach(function(stage, i) {
      // Stage card
      var card = document.createElement('div');
      card.className = 'nm-stage scene-node';
      card.dataset.beat = stage.beat;
      card.style.cssText = 'width:' + stage.width + ';display:flex;flex-direction:column;gap:6px;padding:12px;'
        + 'background:' + stage.bg + ';border-top:3px solid ' + stage.color + ';border-radius:6px;'
        + 'flex-shrink:0;opacity:0;transition:opacity .5s;overflow:hidden;';

      card.innerHTML =
        '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:' + stage.color + '">' + stage.label + '</div>'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;color:' + stage.color + ';line-height:1.2">' + stage.heading + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:5px;margin-top:2px;">'
        + stage.bullets.map(function(b) {
          return '<div style="display:flex;align-items:flex-start;gap:6px;font-family:\'Inter\',sans-serif;font-size:12.5px;color:var(--text-2);line-height:1.4">'
            + '<span style="color:' + stage.color + ';flex-shrink:0;margin-top:2px">&#8227;</span>' + b + '</div>';
        }).join('')
        + '</div>';

      stageRow.appendChild(card);

      // Gate bar (after stages 0 and 1)
      if (i < STAGES.length - 1) {
        var gate = GATES[i];
        var gateBar = document.createElement('div');
        gateBar.className = 'nm-gate scene-node';
        gateBar.dataset.beat = gate.beat;
        gateBar.style.cssText = 'width:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;'
          + 'opacity:0;transition:opacity .5s;';
        var gateInner = document.createElement('div');
        gateInner.style.cssText = 'writing-mode:vertical-rl;transform:rotate(180deg);'
          + 'font-family:\'JetBrains Mono\',monospace;font-size:7.5px;letter-spacing:.08em;'
          + 'color:var(--text-3);text-align:center;padding:0 4px;'
          + 'border-right:1px solid var(--border-2);height:100%;';
        gateInner.textContent = gate.text;
        gateBar.appendChild(gateInner);
        stageRow.appendChild(gateBar);
      }
    });

    outer.appendChild(stageRow);

    // Commitment bar
    var commit = document.createElement('div');
    commit.className = 'scene-node';
    commit.dataset.beat = 'commit';
    commit.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:10px;'
      + 'padding:10px 14px;background:rgba(88,201,148,.07);border:1px solid var(--green);'
      + 'border-radius:7px;opacity:0;transition:opacity .5s;';
    commit.innerHTML =
      '<i class="ti ti-lock-check" style="color:var(--green);font-size:18px;flex-shrink:0"></i>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1)">'
      + 'One decision supported by evidence -- before any platform investment.'
      + '</span>';
    outer.appendChild(commit);

    container.appendChild(outer);
  }

  var steps = [
    { delay: 200,  run: function() { var n = container.querySelector('[data-beat="stage-0"]'); if(n){n.classList.add('visible');n.style.opacity='1';} }},
    { delay: 1000, run: function() { var n = container.querySelector('[data-beat="gate-0"]');  if(n){n.classList.add('visible');n.style.opacity='1';} }},
    { delay: 1600, run: function() { var n = container.querySelector('[data-beat="stage-1"]'); if(n){n.classList.add('visible');n.style.opacity='1';} }},
    { delay: 2400, run: function() { var n = container.querySelector('[data-beat="gate-1"]');  if(n){n.classList.add('visible');n.style.opacity='1';} }},
    { delay: 3000, run: function() { var n = container.querySelector('[data-beat="stage-2"]'); if(n){n.classList.add('visible');n.style.opacity='1';} }},
    { delay: 3800, run: function() { var n = container.querySelector('[data-beat="commit"]');  if(n){n.classList.add('visible');n.style.opacity='1';} }}
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
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
