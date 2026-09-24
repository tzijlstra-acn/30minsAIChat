// Scene: ai-stack-build (Screen 02 -- WHAT AI IS)
// V26: Continuous AI terrain. Five strata share edges and appear as one system.
// Rails on both sides mark the cross-cutting accountability and control boundaries.
// Task tokens show where real work routes. Implication appears last.
SceneDirector.register('ai-stack-build', function(container, manifest, reduced) {

  // Layer definitions.
  // idx 0 = base terrace (rules, widest), idx 4 = apex terrace (agents, narrowest).
  // w = width as percent of terrain container.
  // bc = border colour (top + sides only -- open bottom for stacked look).
  var LAYERS = [
    {
      label: 'Rules and workflow',
      tag:   'DETERMINISTIC',
      bg:    'rgba(85,199,232,.10)',
      bc:    'rgba(85,199,232,.32)',
      tc:    'var(--cyan)',
      idx: 0,
      w:   96
    },
    {
      label: 'RPA and orchestration',
      tag:   'AUTOMATION',
      bg:    'rgba(85,199,232,.13)',
      bc:    'rgba(85,199,232,.36)',
      tc:    'var(--cyan)',
      idx: 1,
      w:   88
    },
    {
      label: 'Analytics and machine learning',
      tag:   'PREDICTIVE',
      bg:    'rgba(85,199,232,.17)',
      bc:    'rgba(85,199,232,.42)',
      tc:    'var(--cyan)',
      idx: 2,
      w:   80
    },
    {
      label: 'Generative AI and retrieval',
      tag:   'GENERATIVE',
      bg:    'rgba(180,76,255,.12)',
      bc:    'rgba(180,76,255,.36)',
      tc:    'var(--accent)',
      idx: 3,
      w:   72
    },
    {
      label: 'Agents and orchestrated work',
      tag:   'AGENTIC',
      bg:    'rgba(180,76,255,.20)',
      bc:    'rgba(180,76,255,.48)',
      tc:    'var(--pink)',
      idx: 4,
      w:   64
    }
  ];

  // Task routing tokens -- each maps a task type to its appropriate AI layer.
  var TOKENS = [
    { label: 'Check a threshold',             route: 'Rules and workflow',     color: 'var(--cyan)'   },
    { label: 'Detect a deviation',            route: 'Analytics and ML',        color: 'var(--cyan)'   },
    { label: 'Draft from documents',          route: 'GenAI + human review',    color: 'var(--accent)' },
    { label: 'Coordinate obligation mapping', route: 'Agents + approval gates', color: 'var(--pink)'   }
  ];

  // Raw timer handles (none used currently -- pattern required by contract).
  var _timers = [];

  // ── DOM BUILDER ──────────────────────────────────────────────────────────────
  // All scene-node elements start hidden (opacity:0, translateY offset).
  // revealBeat() drives the transition to visible state.
  function build() {
    container.innerHTML = '';

    // scene-root: direct child of container, required by lifecycle contract.
    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'display:flex;flex-direction:column;height:100%;padding:6px 0 4px;';

    // 3-column grid: left-rail | center | right-rail
    var grid = document.createElement('div');
    grid.style.cssText = 'display:flex;flex-direction:row;flex:1;min-height:0;';

    // ── LEFT RAIL: Human accountability ──────────────────────────────────────
    var lRail = document.createElement('div');
    lRail.className = 'scene-node';
    lRail.dataset.beat = 'rail-left';
    lRail.style.cssText = 'flex-shrink:0;width:56px;display:flex;align-items:stretch;opacity:0;transition:opacity .6s ease;';

    var lBar = document.createElement('div');
    lBar.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(88,201,148,.05);border-right:2px solid rgba(88,201,148,.28);';

    var lTxt = document.createElement('div');
    lTxt.style.cssText = 'writing-mode:vertical-rl;transform:rotate(180deg);'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:.10em;'
      + 'text-transform:uppercase;color:var(--green);';
    lTxt.textContent = 'Human accountability';

    lBar.appendChild(lTxt);
    lRail.appendChild(lBar);
    grid.appendChild(lRail);

    // ── CENTER COLUMN: terrain + token table ─────────────────────────────────
    var center = document.createElement('div');
    center.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;';

    // Terrain perspective wrapper.
    // perspective applied HERE -- not on the whole scene-root -- so text in
    // the token table and rails (outside this wrapper) remains fully readable.
    // transform-origin at 95% height keeps the base terrace roughly in-place
    // and tilts the apex layers back into the scene.
    var terrain = document.createElement('div');
    terrain.style.cssText = 'flex:1;min-height:0;display:flex;flex-direction:column;'
      + 'justify-content:flex-end;align-items:center;gap:2px;padding:0 10px 0;'
      + 'transform:perspective(900px) rotateX(12deg);transform-origin:center 95%;';

    // Foundation bar -- dashed cyan border, full width.
    var foundation = document.createElement('div');
    foundation.className = 'scene-node';
    foundation.dataset.beat = 'foundation';
    foundation.style.cssText = 'width:100%;flex-shrink:0;'
      + 'background:rgba(85,199,232,.04);border:1.5px dashed rgba(85,199,232,.38);'
      + 'border-radius:4px;padding:7px 14px;display:flex;align-items:center;gap:10px;'
      + 'opacity:0;transform:translateY(22px);'
      + 'transition:opacity .45s ease-out,transform .45s cubic-bezier(.16,1,.3,1);';

    var fBadge = document.createElement('span');
    fBadge.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
      + 'letter-spacing:.12em;text-transform:uppercase;color:rgba(85,199,232,.52);flex-shrink:0;';
    fBadge.textContent = 'Foundation';
    foundation.appendChild(fBadge);

    ['Data', 'Context', 'Identity', 'Integration'].forEach(function(f, i, arr) {
      var item = document.createElement('span');
      item.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;'
        + 'font-weight:600;color:var(--text-2);';
      item.textContent = f;
      foundation.appendChild(item);
      if (i < arr.length - 1) {
        var pipe = document.createElement('span');
        pipe.style.cssText = 'color:rgba(85,199,232,.28);font-size:11px;flex-shrink:0;';
        pipe.textContent = '|';
        foundation.appendChild(pipe);
      }
    });

    // Terrain layers.
    // DOM order is visual top-to-bottom: with flex-direction:column +
    // justify-content:flex-end, the first child in DOM sits at the TOP of the
    // packed group. We want apex (Agents, narrowest) at the top and base
    // (Rules, widest) at the bottom, so reverse LAYERS before iterating.
    var layersDesc = LAYERS.slice().reverse(); // [idx4, idx3, idx2, idx1, idx0]

    layersDesc.forEach(function(ld) {
      var el = document.createElement('div');
      el.className = 'ai-stack-layer scene-node';
      el.dataset.beat = 'layer-' + ld.idx;
      // Open bottom border simulates the terrace shelf edge.
      // box-shadow beneath each layer creates the "front face" depth illusion
      // that becomes visible once the parent perspective rotateX tilts the terrain.
      // Terrain stratum -- shared edges, no border-radius (strata look like terrain, not cards)
      el.style.cssText = 'width:' + ld.w + '%;flex:1;min-height:44px;border-radius:0;'
        + 'padding:9px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;'
        + 'background:' + ld.bg + ';'
        + 'border-top:1.5px solid ' + ld.bc + ';'
        + 'border-left:1.5px solid ' + ld.bc + ';'
        + 'border-right:1.5px solid ' + ld.bc + ';'
        + 'box-shadow:0 6px 0 rgba(0,0,0,.16);'
        + 'opacity:0;transform:translateY(24px);'
        + 'transition:opacity .45s ease-out,transform .45s cubic-bezier(.16,1,.3,1);';

      var lbl = document.createElement('span');
      lbl.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:14px;'
        + 'font-weight:700;color:var(--text-1);line-height:1.2;';
      lbl.textContent = ld.label;

      var tag = document.createElement('span');
      tag.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
        + 'letter-spacing:.1em;color:' + ld.tc + ';white-space:nowrap;flex-shrink:0;';
      tag.textContent = ld.tag;

      el.appendChild(lbl);
      el.appendChild(tag);
      terrain.appendChild(el);
    });

    terrain.appendChild(foundation);
    center.appendChild(terrain);

    // Task token routing table.
    // Outside the terrain perspective wrapper so text is rendered flat and
    // fully readable at normal reading distance.
    var tokensWrap = document.createElement('div');
    tokensWrap.className = 'scene-node';
    tokensWrap.dataset.beat = 'tokens';
    tokensWrap.style.cssText = 'flex-shrink:0;display:flex;flex-wrap:wrap;gap:5px;'
      + 'justify-content:center;padding:8px 10px 0;opacity:0;transition:opacity .5s ease;';

    TOKENS.forEach(function(t) {
      var tok = document.createElement('div');
      tok.style.cssText = 'display:flex;align-items:center;gap:6px;padding:5px 10px;'
        + 'background:var(--surface-1);border-left:3px solid ' + t.color + ';border-radius:4px;flex-shrink:0;';

      var tokLbl = document.createElement('span');
      tokLbl.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:12px;color:var(--text-2);';
      tokLbl.textContent = t.label;

      var tokRoute = document.createElement('span');
      tokRoute.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11.5px;'
        + 'color:' + t.color + ';letter-spacing:.03em;white-space:nowrap;';
      tokRoute.textContent = '-> ' + t.route;

      tok.appendChild(tokLbl);
      tok.appendChild(tokRoute);
      tokensWrap.appendChild(tok);
    });

    grid.appendChild(center);

    // ── RIGHT RAIL: Security, control and evidence ────────────────────────────
    var rRail = document.createElement('div');
    rRail.className = 'scene-node';
    rRail.dataset.beat = 'rail-right';
    rRail.style.cssText = 'flex-shrink:0;width:56px;display:flex;align-items:stretch;opacity:0;transition:opacity .6s ease;';

    var rBar = document.createElement('div');
    rBar.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(85,199,232,.04);border-left:2px solid rgba(85,199,232,.22);';

    var rTxt = document.createElement('div');
    rTxt.style.cssText = 'writing-mode:vertical-rl;'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:.10em;'
      + 'text-transform:uppercase;color:var(--cyan);';
    rTxt.textContent = 'Security, control and evidence';

    rBar.appendChild(rTxt);
    rRail.appendChild(rBar);
    grid.appendChild(rRail);

    root.appendChild(grid);
    root.appendChild(tokensWrap);

    // ── IMPLICATION text ──────────────────────────────────────────────────────
    var impl = document.createElement('div');
    impl.className = 'scene-node';
    impl.dataset.beat = 'implication';
    impl.style.cssText = 'flex-shrink:0;text-align:center;padding:7px 0 2px;'
      + 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-style:italic;'
      + 'color:var(--text-3);opacity:0;transition:opacity .5s ease;';
    impl.textContent = 'More advanced is not automatically more suitable.';
    root.appendChild(impl);

    container.appendChild(root);
  }

  // ── REVEAL HELPERS ────────────────────────────────────────────────────────────
  // Transition a single beat from hidden to visible.
  function revealBeat(beat) {
    var el = container.querySelector('[data-beat="' + beat + '"]');
    if (!el) return;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }

  // All beats in order. When instant=true, transitions are disabled first so
  // elements appear without animation (used for reduced-motion and finish).
  var BEAT_ORDER = [
    'foundation',
    'layer-0', 'layer-1', 'layer-2', 'layer-3', 'layer-4',
    'rail-left', 'rail-right',
    'tokens',
    'implication'
  ];

  function showAll(instant) {
    if (instant) {
      container.querySelectorAll('.scene-node').forEach(function(n) {
        n.style.transition = 'none';
      });
    }
    BEAT_ORDER.forEach(function(b) { revealBeat(b); });
  }

  // ── TIMELINE STEPS (10-step choreography) ────────────────────────────────────
  // Delays match the V19 Wow 1 choreography spec exactly.
  var steps = [
    { delay:  200, run: function() { revealBeat('foundation');  } },  // 1 foundation assembles
    { delay:  500, run: function() { revealBeat('layer-0');     } },  // 2 rules rises
    { delay:  800, run: function() { revealBeat('layer-1');     } },  // 3 RPA rises
    { delay: 1100, run: function() { revealBeat('layer-2');     } },  // 4 analytics rises
    { delay: 1400, run: function() { revealBeat('layer-3');     } },  // 5 genai rises
    { delay: 1700, run: function() { revealBeat('layer-4');     } },  // 6 agents rises
    { delay: 2200, run: function() { revealBeat('rail-left');   } },  // 7 left rail fades in
    { delay: 2600, run: function() { revealBeat('rail-right');  } },  // 8 right rail fades in
    { delay: 3400, run: function() { revealBeat('tokens');      } },  // 9 token routing table
    { delay: 5000, run: function() {
      revealBeat('implication');
      setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 600);
    }}   // 10 implication text
  ];

  var tl = createTimeline(steps);

  // ── LIFECYCLE CONTRACT ────────────────────────────────────────────────────────
  return {
    play: function() {
      build();
      // Reduced motion: jump straight to final state, no animation.
      if (reduced) { showAll(true); return; }
      tl.play();
    },

    pause:  tl.pause,
    resume: tl.resume,

    reset: function() {
      build();
      tl.reset();
    },

    finish: function() {
      build();
      showAll(true);  // disable transitions, reveal everything
      tl.finish();    // also flush step functions (belt-and-suspenders)
    },

    getAccessibleSummary: function() {
      return 'The AI terrain shows five technology layers from Rules and workflow at the base to Agents at the apex. Foundation services run underneath. Human accountability and security rails bound the terrain. Four task tokens route to the least complex suitable layer. More advanced is not automatically more suitable.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
