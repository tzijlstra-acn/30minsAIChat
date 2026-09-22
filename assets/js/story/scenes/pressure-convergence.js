// Scene: pressure-convergence (Screen 01 - WHY NOW)
// Three pressure cards enter sequentially, then converge toward a central point
SceneDirector.register('pressure-convergence', function(container, manifest, reduced) {
  var pressures = [
    { icon: 'ti-gavel',   label: 'Regulatory volume',  sub: 'More obligations, faster cycles, cross-border reach' },
    { icon: 'ti-cpu',     label: 'AI deployment pace',  sub: 'Business functions deploying AI the risk function must govern' },
    { icon: 'ti-coin',    label: 'Cost constraints',    sub: 'Cost per risk decision under pressure while quality requirements rise' }
  ];
  var result = 'The operating model may need to evolve.';

  function build() {
    container.innerHTML = '';
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;height:100%;padding:16px;';

    var cardsCol = document.createElement('div');
    cardsCol.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
    pressures.forEach(function(p, i) {
      var card = document.createElement('div');
      card.className = 'pressure-card';
      card.style.cssText = 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:10px;padding:12px 14px;transition-delay:' + (i * 0) + 'ms';
      card.innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><i class="ti ' + p.icon + '" style="color:var(--accent);font-size:20px"></i><span style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;color:var(--text-1)">' + p.label + '</span></div><div style="font-size:14px;color:var(--text-2);line-height:1.5">' + p.sub + '</div>';
      cardsCol.appendChild(card);
    });

    var arrowCol = document.createElement('div');
    arrowCol.style.cssText = 'font-size:28px;color:var(--border-2,rgba(255,255,255,.2));opacity:0;transition:opacity 400ms ease 0ms;';
    arrowCol.textContent = '→';
    arrowCol.id = 'pcArrow';

    var resultBox = document.createElement('div');
    resultBox.className = 'pressure-card';
    resultBox.style.cssText = 'background:var(--surface-2);border:1px solid rgba(161,0,255,.25);border-radius:10px;padding:16px;font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:600;color:var(--text-1);line-height:1.4;transition-delay:0ms';
    resultBox.textContent = result;

    grid.appendChild(cardsCol);
    grid.appendChild(arrowCol);
    grid.appendChild(resultBox);
    container.appendChild(grid);
  }

  var steps = [
    { delay: 300,  run: function() { container.querySelectorAll('.pressure-card')[0].classList.add('visible'); }},
    { delay: 900,  run: function() { container.querySelectorAll('.pressure-card')[1].classList.add('visible'); }},
    { delay: 1500, run: function() { container.querySelectorAll('.pressure-card')[2].classList.add('visible'); }},
    { delay: 2200, run: function() { var a = container.querySelector('#pcArrow'); if(a) a.style.opacity = '1'; }},
    { delay: 2600, run: function() { container.querySelectorAll('.pressure-card')[3].classList.add('visible'); }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.pressure-card').forEach(function(c) { c.classList.add('visible'); });
      var a = container.querySelector('#pcArrow'); if(a) a.style.opacity = '1';
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
