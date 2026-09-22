// Scene: ai-stack-build (Screen 02 - WHAT AI IS)
// Tapered pyramid built layer by layer bottom-up, token descends on entry
SceneDirector.register('ai-stack-build', function(container, manifest, reduced) {
  var layers = [
    { label: 'Data and controls',             color: 'var(--surface-2)',  tag: 'FOUNDATION',   tagColor: 'var(--text-3)' },
    { label: 'Rules and classification',      color: 'var(--surface-2)',  tag: 'DETERMINISTIC', tagColor: 'var(--cyan)'   },
    { label: 'Language models and RAG',       color: 'rgba(161,0,255,.12)', tag: 'GENERATIVE',  tagColor: 'var(--accent)' },
    { label: 'Agentic and orchestrated work', color: 'rgba(161,0,255,.22)', tag: 'AGENTIC',     tagColor: 'var(--pink)'   }
  ];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column-reverse;align-items:center;justify-content:flex-end;gap:4px;height:100%;padding:16px;';

    layers.forEach(function(layer, i) {
      var w = (40 + i * 15) + '%';
      var el = document.createElement('div');
      el.className = 'ai-stack-layer';
      el.style.cssText = 'width:' + w + ';background:' + layer.color + ';border:1px solid var(--border-1);border-radius:6px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;';
      el.innerHTML = '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:600;color:var(--text-1)">' + layer.label + '</span>' +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.08em;color:' + layer.tagColor + '">' + layer.tag + '</span>';
      wrap.appendChild(el);
    });
    container.appendChild(wrap);
  }

  var steps = layers.map(function(_, i) {
    return { delay: 400 + i * 700, run: function() {
      var nodes = container.querySelectorAll('.ai-stack-layer');
      if (nodes[i]) nodes[i].classList.add('visible');
    }};
  });

  var tl = createTimeline(steps);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.ai-stack-layer').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
