// Scene: next-move (Screen 11 - WHAT NEXT)
// FRAME -> MAP -> PROVE path with decision gate animating to completion
SceneDirector.register('next-move', function(container, manifest, reduced) {
  var steps_data = [
    { label: 'FRAME',  desc: 'Confirm the outcome the business needs to improve.',              color: 'var(--cyan)',   icon: 'ti-target'      },
    { label: 'MAP',    desc: 'Trace one real process from intake to decision and evidence.',     color: 'var(--accent)', icon: 'ti-route'       },
    { label: 'PROVE',  desc: 'Test one bounded AI path on real work with gate criteria set.',   color: 'var(--green)',  icon: 'ti-check-circle' }
  ];
  var gate = 'Gate objective: one decision supported by evidence.';

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:14px;height:100%;padding:16px;justify-content:center;';

    var pathRow = document.createElement('div');
    pathRow.style.cssText = 'display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:8px;';

    steps_data.forEach(function(s, i) {
      var el = document.createElement('div');
      el.className = 'scene-node';
      el.dataset.stepLabel = s.label;
      el.style.cssText = 'background:var(--surface-1);border:1px solid ' + s.color + ';border-radius:10px;padding:14px 12px;text-align:center;';
      el.innerHTML = '<i class="ti ' + s.icon + '" style="font-size:26px;color:' + s.color + ';display:block;margin-bottom:8px"></i><div style="font-family:\'JetBrains Mono\',monospace;font-size:13px;letter-spacing:.1em;color:' + s.color + ';font-weight:700;margin-bottom:6px">' + s.label + '</div><div style="font-size:14px;color:var(--text-2);line-height:1.5">' + s.desc + '</div>';
      pathRow.appendChild(el);

      if (i < steps_data.length - 1) {
        var arr = document.createElement('div');
        arr.className = 'scene-node';
        arr.dataset.arrow = i;
        arr.style.cssText = 'font-size:20px;color:var(--border-2,rgba(255,255,255,.2));text-align:center;';
        arr.textContent = '→';
        pathRow.appendChild(arr);
      }
    });
    wrap.appendChild(pathRow);

    var gateEl = document.createElement('div');
    gateEl.className = 'scene-node';
    gateEl.dataset.gateEl = '1';
    gateEl.style.cssText = 'background:rgba(0,200,100,.06);border:1px solid var(--green);border-radius:8px;padding:14px 20px;font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.06em;color:var(--green);text-align:center;font-weight:600;';
    gateEl.textContent = gate;
    wrap.appendChild(gateEl);

    container.appendChild(wrap);
  }

  var anim_steps = [
    { delay: 400,  run: function() { var n = container.querySelector('[data-step-label="FRAME"]'); if(n) n.classList.add('visible'); }},
    { delay: 1000, run: function() { var n = container.querySelector('[data-arrow="0"]'); if(n) n.classList.add('visible'); }},
    { delay: 1300, run: function() { var n = container.querySelector('[data-step-label="MAP"]'); if(n) n.classList.add('visible'); }},
    { delay: 1900, run: function() { var n = container.querySelector('[data-arrow="1"]'); if(n) n.classList.add('visible'); }},
    { delay: 2200, run: function() { var n = container.querySelector('[data-step-label="PROVE"]'); if(n) n.classList.add('visible'); }},
    { delay: 3000, run: function() { var n = container.querySelector('[data-gate-el]'); if(n) n.classList.add('visible'); }}
  ];

  var tl = createTimeline(anim_steps);

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
