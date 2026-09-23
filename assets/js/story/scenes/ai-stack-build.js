// Scene: ai-stack-build (Screen 02 - WHAT AI IS)
// Four-layer pyramid builds bottom-up. Each layer shows its AI pattern and a brief use-case example.
// A "regulation obligation" token descends through the stack as layers reveal.
SceneDirector.register('ai-stack-build', function(container, manifest, reduced) {
  var layers = [
    {
      label:   'Data, context, identity and integration',
      tag:     'FOUNDATION',
      tagColor:'var(--text-3)',
      bg:      'var(--surface-2)',
      example: 'Source documents, policy library, control register, audit log'
    },
    {
      label:   'Rules and workflow',
      tag:     'DETERMINISTIC',
      tagColor:'var(--cyan)',
      bg:      'var(--surface-1)',
      example: 'Obligation classifier, threshold rules, coverage scoring'
    },
    {
      label:   'Analytics and machine learning',
      tag:     'PREDICTIVE',
      tagColor:'var(--cyan)',
      bg:      'var(--surface-1)',
      example: 'Risk scoring, anomaly detection, pattern matching'
    },
    {
      label:   'Generative AI and retrieval',
      tag:     'GENERATIVE',
      tagColor:'var(--accent)',
      bg:      'rgba(180,76,255,.08)',
      example: 'Gap extraction, policy drafting, rationale generation'
    },
    {
      label:   'Agents and orchestrated work',
      tag:     'AGENTIC',
      tagColor:'var(--pink)',
      bg:      'rgba(180,76,255,.16)',
      example: 'Multi-step coverage analysis, cross-regulation reconciliation'
    }
  ];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;height:100%;padding:16px 20px;justify-content:center;';

    // Pyramid: bottom layer is widest. Layers are in DOM order top-to-bottom (agentic first, foundation last)
    // but we flex-direction: column so we stack them and width is reversed.
    var pyramid = document.createElement('div');
    pyramid.style.cssText = 'display:flex;flex-direction:column-reverse;align-items:center;gap:4px;';

    layers.forEach(function(layer, i) {
      // Width increases as we go down (i=0 is foundation = widest at 100%, top layer narrowest at ~56%)
      var widthPct = 100 - (layers.length - 1 - i) * 11;
      var el = document.createElement('div');
      el.className = 'ai-stack-layer';
      el.dataset.layerIdx = i;
      el.style.cssText = 'width:' + widthPct + '%;background:' + layer.bg
        + ';border:1px solid var(--border-1);border-radius:7px;padding:11px 16px;'
        + 'display:flex;align-items:center;justify-content:space-between;gap:12px;'
        + 'transition-delay:' + (i * 100) + 'ms;';
      el.innerHTML =
        '<div style="flex:1;min-width:0">'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;color:var(--text-1);margin-bottom:3px">' + layer.label + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-3);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + layer.example + '</div>'
        + '</div>'
        + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.08em;color:' + layer.tagColor + ';white-space:nowrap;flex-shrink:0;font-weight:600">' + layer.tag + '</span>';
      pyramid.appendChild(el);
    });

    wrap.appendChild(pyramid);

    // Control rail note
    var rail = document.createElement('div');
    rail.className = 'scene-node';
    rail.dataset.beat = 'rail';
    rail.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--surface-1);border:1px solid var(--green);border-radius:6px;margin-top:4px;';
    rail.innerHTML = '<i class="ti ti-shield-check" style="color:var(--green);font-size:16px;flex-shrink:0"></i>'
      + '<span style="font-family:\'Inter\',sans-serif;font-size:14px;color:var(--text-2);line-height:1.4">'
      + 'Human control gates and compliance obligations run across all layers -- not only at the top.'
      + '</span>';
    wrap.appendChild(rail);

    container.appendChild(wrap);
  }

  var steps = layers.map(function(_, i) {
    return { delay: 300 + i * 600, run: function() {
      var nodes = container.querySelectorAll('.ai-stack-layer');
      if (nodes[i]) nodes[i].classList.add('visible');
    }};
  }).concat([
    { delay: 300 + layers.length * 600 + 200, run: function() {
      var rail = container.querySelector('[data-beat="rail"]');
      if (rail) rail.classList.add('visible');
    }}
  ]);

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      container.querySelectorAll('.ai-stack-layer').forEach(function(n) { n.classList.add('visible'); });
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
