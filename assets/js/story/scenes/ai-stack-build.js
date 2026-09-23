// Scene: ai-stack-build (Screen 02 - WHAT AI IS)
// V17: true spatial work stack. Layers build bottom-up. No button borders.
// Foundation, 5 AI layers, 2 rails, 4 routed task tokens.
SceneDirector.register('ai-stack-build', function(container, manifest, reduced) {

  var LAYERS = [
    { label: 'Rules and workflow',              tag: 'DETERMINISTIC', bg: 'rgba(85,199,232,.07)',  tc: 'var(--cyan)',   idx: 0 },
    { label: 'RPA and orchestration',           tag: 'AUTOMATION',    bg: 'rgba(85,199,232,.09)',  tc: 'var(--cyan)',   idx: 1 },
    { label: 'Analytics and machine learning',  tag: 'PREDICTIVE',    bg: 'rgba(85,199,232,.12)',  tc: 'var(--cyan)',   idx: 2 },
    { label: 'Generative AI and retrieval',     tag: 'GENERATIVE',    bg: 'rgba(180,76,255,.10)',  tc: 'var(--accent)', idx: 3 },
    { label: 'Agents and orchestrated work',    tag: 'AGENTIC',       bg: 'rgba(180,76,255,.16)',  tc: 'var(--pink)',   idx: 4 }
  ];

  // Task tokens: routed to layer index (0=rules, 2=analytics, 3=genai, 4=agents)
  var TOKENS = [
    { label: 'Check a threshold',             route: 'Rules and workflow',             targetIdx: 0, color: 'var(--cyan)'   },
    { label: 'Detect a deviation',            route: 'Analytics and ML',               targetIdx: 2, color: 'var(--cyan)'   },
    { label: 'Draft from documents',          route: 'GenAI + human review',           targetIdx: 3, color: 'var(--accent)' },
    { label: 'Coordinate obligation mapping', route: 'Agents + approval gates',        targetIdx: 4, color: 'var(--pink)'   }
  ];

  // Width percent per layer: narrowest at top (agentic), widest at bottom (rules)
  // Maps to LAYERS index 0-4 (rules=0 widest, agents=4 narrowest)
  var WIDTHS = [96, 88, 80, 72, 64];

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;height:100%;padding:8px 0 4px;gap:0;';

    // Stack area: 3-column grid [rail | pyramid | rail]
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:56px 1fr 56px;flex:1;min-height:0;';

    // Left rail: Human accountability
    var lRail = document.createElement('div');
    lRail.className = 'scene-node';
    lRail.dataset.beat = 'rail-left';
    lRail.style.cssText = 'display:flex;align-items:stretch;opacity:0;transition:opacity .6s;';
    var lBar = document.createElement('div');
    lBar.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(88,201,148,.05);border-right:2px solid rgba(88,201,148,.28);';
    var lTxt = document.createElement('div');
    lTxt.style.cssText = 'writing-mode:vertical-rl;transform:rotate(180deg);'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.14em;'
      + 'text-transform:uppercase;color:var(--green);';
    lTxt.textContent = 'Human accountability';
    lBar.appendChild(lTxt);
    lRail.appendChild(lBar);
    grid.appendChild(lRail);

    // Center: pyramid layers + foundation + tokens
    var center = document.createElement('div');
    center.style.cssText = 'display:flex;flex-direction:column;justify-content:flex-end;'
      + 'align-items:center;gap:3px;padding:4px 12px 0;min-height:0;';

    // Layers in reverse (agentic first = top of DOM, rules last = closest to foundation)
    var layersReversed = LAYERS.slice().reverse(); // [agents, genai, analytics, rpa, rules]
    layersReversed.forEach(function(ld) {
      var w = WIDTHS[4 - ld.idx]; // agents(idx4)->width[0]=64%, rules(idx0)->width[4]=96%
      var el = document.createElement('div');
      el.className = 'ai-stack-layer scene-node';
      el.dataset.beat = 'layer-' + ld.idx;
      el.style.cssText = 'width:' + w + '%;background:' + ld.bg + ';border-radius:6px;'
        + 'padding:9px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;'
        + 'flex-shrink:0;';
      el.innerHTML =
        '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:14px;font-weight:700;color:var(--text-1);line-height:1.2">'
        + ld.label + '</span>'
        + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.1em;'
        + 'color:' + ld.tc + ';white-space:nowrap;flex-shrink:0">' + ld.tag + '</span>';
      center.appendChild(el);
    });

    // Foundation
    var foundation = document.createElement('div');
    foundation.className = 'ai-stack-layer scene-node';
    foundation.dataset.beat = 'foundation';
    foundation.style.cssText = 'width:100%;background:var(--surface-2);margin-top:4px;'
      + 'border-top:2px solid var(--border-2);border-radius:4px;'
      + 'padding:9px 14px;display:flex;align-items:center;gap:12px;flex-shrink:0;';
    foundation.innerHTML =
      '<span style="font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.1em;'
      + 'color:var(--text-3);text-transform:uppercase;flex-shrink:0">Foundation</span>'
      + ['Data', 'Context', 'Identity', 'Integration'].map(function(f, i, arr) {
        return '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-2)">' + f + '</span>'
          + (i < arr.length - 1 ? '<span style="color:var(--border-2);font-size:12px;margin:0 4px">&#183;</span>' : '');
      }).join('');
    center.appendChild(foundation);

    // Task token routing table
    var tokensWrap = document.createElement('div');
    tokensWrap.className = 'scene-node';
    tokensWrap.dataset.beat = 'tokens';
    tokensWrap.style.cssText = 'width:100%;display:flex;flex-wrap:wrap;gap:5px;justify-content:center;'
      + 'padding:8px 0 0;opacity:0;transition:opacity .5s;';

    TOKENS.forEach(function(t) {
      var tok = document.createElement('div');
      tok.style.cssText = 'display:flex;align-items:center;gap:7px;padding:5px 10px;'
        + 'background:var(--surface-1);border-left:3px solid ' + t.color + ';border-radius:4px;'
        + 'flex-shrink:0;';
      tok.innerHTML =
        '<span style="font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2)">' + t.label + '</span>'
        + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;color:' + t.color
        + ';letter-spacing:.04em;white-space:nowrap">&#8594; ' + t.route + '</span>';
      tokensWrap.appendChild(tok);
    });
    center.appendChild(tokensWrap);

    grid.appendChild(center);

    // Right rail: Security, control and evidence
    var rRail = document.createElement('div');
    rRail.className = 'scene-node';
    rRail.dataset.beat = 'rail-right';
    rRail.style.cssText = 'display:flex;align-items:stretch;opacity:0;transition:opacity .6s;';
    var rBar = document.createElement('div');
    rBar.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(85,199,232,.04);border-left:2px solid rgba(85,199,232,.22);';
    var rTxt = document.createElement('div');
    rTxt.style.cssText = 'writing-mode:vertical-rl;'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.14em;'
      + 'text-transform:uppercase;color:var(--cyan);';
    rTxt.textContent = 'Security, control and evidence';
    rBar.appendChild(rTxt);
    rRail.appendChild(rBar);
    grid.appendChild(rRail);

    outer.appendChild(grid);

    // Final implication
    var impl = document.createElement('div');
    impl.className = 'scene-node';
    impl.dataset.beat = 'implication';
    impl.style.cssText = 'text-align:center;padding:7px 0 0;font-family:\'Space Grotesk\',sans-serif;'
      + 'font-size:13px;font-style:italic;color:var(--text-3);opacity:0;transition:opacity .5s;flex-shrink:0;';
    impl.textContent = 'More advanced does not automatically mean more suitable.';
    outer.appendChild(impl);

    container.appendChild(outer);
  }

  // Layer animation order: foundation first, then rules(0)...agents(4), then rails, then tokens, then implication
  var timeSteps = [
    { delay: 200,  beat: 'foundation' },
    { delay: 600,  beat: 'layer-0' },    // rules
    { delay: 1000, beat: 'layer-1' },    // rpa
    { delay: 1400, beat: 'layer-2' },    // analytics
    { delay: 1800, beat: 'layer-3' },    // genai
    { delay: 2200, beat: 'layer-4' },    // agents
    { delay: 2900, beat: 'rail-left' },
    { delay: 3300, beat: 'rail-right' },
    { delay: 4000, beat: 'tokens' },
    { delay: 5200, beat: 'implication' }
  ];

  var steps = timeSteps.map(function(ts) {
    return { delay: ts.delay, run: function() {
      var el = container.querySelector('[data-beat="' + ts.beat + '"]');
      if (!el) return;
      el.classList.add('visible');
      el.style.opacity = '1';
    }};
  });

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
