// Scene: proof-loop (Screen 07 - HOW TO PROVE)
// Five evidence dimensions laid out as cards in a ring arrangement.
// Each card reveals with its label, icon, and one concrete proof question.
// Final beat: a central "PROOF OBJECTIVE" label and connecting lines appear.
SceneDirector.register('proof-loop', function(container, manifest, reduced) {
  var dimensions = [
    {
      label:    'Quality',
      icon:     'ti-star',
      color:    'var(--accent)',
      question: 'Does the AI output meet or exceed analyst accuracy on the same sample?'
    },
    {
      label:    'Control',
      icon:     'ti-shield-check',
      color:    'var(--green)',
      question: 'Is every AI decision traceable to a named human approval gate?'
    },
    {
      label:    'Adoption',
      icon:     'ti-users',
      color:    'var(--cyan)',
      question: 'Do the people who must use this actually use it on real work?'
    },
    {
      label:    'Speed',
      icon:     'ti-clock',
      color:    'var(--amber)',
      question: 'Has end-to-end cycle time improved on the bounded process?'
    },
    {
      label:    'Economics',
      icon:     'ti-coin',
      color:    'var(--pink)',
      question: 'Is cost per successful outcome within the target range?'
    }
  ];

  function build() {
    container.innerHTML = '';

    // Two-row layout: 3 cards top, central connector row, 2 cards bottom
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:12px 16px;justify-content:center;';

    // Top row: Quality, Control, Adoption
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;';
    [0, 1, 2].forEach(function(i) { topRow.appendChild(makeCard(dimensions[i])); });
    outer.appendChild(topRow);

    // Center connector: "Five dimensions that together constitute evidence"
    var midRow = document.createElement('div');
    midRow.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:12px;padding:4px 0;';
    var connLine = document.createElement('div');
    connLine.className = 'scene-node';
    connLine.dataset.beat = 'connector';
    connLine.style.cssText = 'flex:1;height:1px;background:var(--border-1);';
    var connLabel = document.createElement('div');
    connLabel.className = 'scene-node';
    connLabel.dataset.beat = 'center-label';
    connLabel.style.cssText = 'flex-shrink:0;font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);text-align:center;padding:0 12px;';
    connLabel.textContent = 'Five dimensions of evidence';
    var connLine2 = document.createElement('div');
    connLine2.className = 'scene-node';
    connLine2.dataset.beat = 'connector';
    connLine2.style.cssText = 'flex:1;height:1px;background:var(--border-1);';
    midRow.appendChild(connLine);
    midRow.appendChild(connLabel);
    midRow.appendChild(connLine2);
    outer.appendChild(midRow);

    // Bottom row: Speed, Economics (centred)
    var botRow = document.createElement('div');
    botRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:66%;margin:0 auto;width:100%;';
    [3, 4].forEach(function(i) { botRow.appendChild(makeCard(dimensions[i])); });
    outer.appendChild(botRow);

    container.appendChild(outer);
  }

  function makeCard(dim) {
    var card = document.createElement('div');
    card.className = 'scene-node';
    card.dataset.dimLabel = dim.label;
    card.style.cssText = 'background:var(--surface-1);border:1px solid ' + dim.color
      + ';border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;';
    card.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px">'
      + '<i class="ti ' + dim.icon + '" style="font-size:20px;color:' + dim.color + ';flex-shrink:0"></i>'
      + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;color:' + dim.color + '">' + dim.label + '</span>'
      + '</div>'
      + '<div style="font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text-2);line-height:1.5">' + dim.question + '</div>';
    return card;
  }

  var steps = dimensions.map(function(dim, i) {
    return { delay: 400 + i * 800, run: function() {
      var card = container.querySelector('[data-dim-label="' + dim.label + '"]');
      if (card) card.classList.add('visible');
    }};
  }).concat([{
    delay: 400 + dimensions.length * 800,
    run: function() {
      container.querySelectorAll('[data-beat="connector"], [data-beat="center-label"]').forEach(function(n) {
        n.classList.add('visible');
      });
    }
  }]);

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
