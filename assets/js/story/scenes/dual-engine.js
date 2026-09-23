// Scene: dual-engine (Wow 5 -- Accenture removes the hand-off tax)
// V19: Fragmented islands -> delivery spine -> integrated route -> proof points
SceneDirector.register('dual-engine', function(container, manifest, reduced) {

  var _timers = [];
  var _rafIds = [];
  var _alive  = false;
  var svg, tl;

  var CYAN   = '#55C7E8';
  var ACCENT = '#B44CFF';
  var GREEN  = '#58C994';
  var AMBER  = '#F5A623';
  var RED    = '#F0758A';
  var SURF2  = '#18182A';

  var SPINE_STEPS = ['Frame', 'Design', 'Build', 'Prove', 'Industrialise', 'Optimise'];
  var SPINE_Y  = 380;
  var SPINE_X0 = 80;
  var SPINE_X1 = 1120;

  // setTimeout tracked for cleanup
  function later(ms, fn) {
    var id = setTimeout(fn, ms);
    _timers.push(id);
    return id;
  }

  // rAF tween: moves SVG group horizontally, fixed y
  function tweenX(el, fromX, toX, fixedY, dur, onDone) {
    if (!_alive || !el) return;
    var start = null;
    function frame(ts) {
      if (!_alive) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      el.setAttribute('transform', 'translate(' + (fromX + (toX - fromX) * e) + ',' + fixedY + ')');
      if (p < 1) {
        var rid = requestAnimationFrame(frame);
        _rafIds.push(rid);
      } else {
        if (onDone) onDone();
      }
    }
    var rid = requestAnimationFrame(frame);
    _rafIds.push(rid);
  }

  // Get element by id within svg
  function $id(id) { return svg && svg.querySelector('#' + id); }

  // Build entire SVG scene
  function build() {
    container.innerHTML = '';
    _alive = true;

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;position:relative;';

    svg = svgEl('svg', {
      viewBox: '0 0 1200 560',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'width:100%;height:100%;display:block;'
    });

    // ── Act 1: Fragmented islands ──────────────────────────────────────
    var islandG = svgEl('g', { id: 'de-islands', opacity: '0' });

    var islandDefs = [
      {
        x: 30,  y: 60, w: 320, h: 280, color: CYAN,
        label: 'RISK AND BUSINESS',
        caps: ['Obligation interpretation', 'Risk appetite and controls', 'Regulatory mapping']
      },
      {
        x: 440, y: 60, w: 320, h: 280, color: ACCENT,
        label: 'BUILD AND INTEGRATION',
        caps: ['AI system development', 'Data and model pipeline', 'Integration and testing']
      },
      {
        x: 850, y: 60, w: 320, h: 280, color: GREEN,
        label: 'RUN AND VALUE',
        caps: ['Production operations', 'Evidence and audit', 'Performance optimisation']
      }
    ];

    islandDefs.forEach(function(isl) {
      var g = svgEl('g', {});

      // Dashed border box
      g.appendChild(svgEl('rect', {
        x: isl.x, y: isl.y, width: isl.w, height: isl.h,
        rx: 6,
        fill: 'rgba(255,255,255,0.02)',
        stroke: isl.color,
        'stroke-width': '1.5',
        'stroke-dasharray': '6 3'
      }));

      // Island label: JetBrains Mono 10px
      var lbl = svgEl('text', {
        x: isl.x + 14, y: isl.y + 24,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '10',
        'letter-spacing': '0.1em',
        fill: isl.color
      });
      lbl.textContent = isl.label;
      g.appendChild(lbl);

      // ISOLATED badge top-right, 9px red chip
      var bx = isl.x + isl.w - 67, by = isl.y + 10;
      g.appendChild(svgEl('rect', {
        x: bx, y: by, width: 58, height: 16,
        rx: 8,
        fill: 'rgba(240,117,138,0.15)',
        stroke: RED,
        'stroke-width': '1'
      }));
      var bTxt = svgEl('text', {
        x: bx + 29, y: by + 12,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '9',
        fill: RED,
        'text-anchor': 'middle'
      });
      bTxt.textContent = 'ISOLATED';
      g.appendChild(bTxt);

      // Capability lines 12px
      isl.caps.forEach(function(cap, ci) {
        var ct = svgEl('text', {
          x: isl.x + 16, y: isl.y + 62 + ci * 22,
          'font-family': 'Inter, sans-serif',
          'font-size': '12',
          fill: 'rgba(255,255,255,0.6)'
        });
        var dot = svgEl('tspan', { fill: isl.color });
        dot.textContent = '• ';
        ct.appendChild(dot);
        var txt = svgEl('tspan', {});
        txt.textContent = cap;
        ct.appendChild(txt);
        g.appendChild(ct);
      });

      islandG.appendChild(g);
    });

    svg.appendChild(islandG);

    // ── Gap annotations (hidden until token reaches each gap) ──────────
    var gapG = svgEl('g', { id: 'de-gaps', opacity: '0' });

    // Gap 1 (Risk -> Build): center x ~395
    var gap1Line = svgEl('line', {
      x1: 358, y1: 198, x2: 432, y2: 198,
      stroke: AMBER, 'stroke-width': '1.5', 'stroke-dasharray': '4 2',
      opacity: '0'
    });
    gap1Line.id = 'de-gap1-line';
    gapG.appendChild(gap1Line);

    var gap1Lbl = svgEl('text', {
      x: 395, y: 186,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '9',
      fill: AMBER,
      'text-anchor': 'middle',
      opacity: '0'
    });
    gap1Lbl.id = 'de-gap1-lbl';
    gap1Lbl.textContent = 'Context recreated';
    gapG.appendChild(gap1Lbl);

    // Gap 2 (Build -> Run): center x ~805
    var gap2Line = svgEl('line', {
      x1: 768, y1: 198, x2: 842, y2: 198,
      stroke: AMBER, 'stroke-width': '1.5', 'stroke-dasharray': '4 2',
      opacity: '0'
    });
    gap2Line.id = 'de-gap2-line';
    gapG.appendChild(gap2Line);

    var gap2Lbl = svgEl('text', {
      x: 805, y: 186,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '9',
      fill: AMBER,
      'text-anchor': 'middle',
      opacity: '0'
    });
    gap2Lbl.id = 'de-gap2-lbl';
    gap2Lbl.textContent = 'Evidence rebuilt';
    gapG.appendChild(gap2Lbl);

    svg.appendChild(gapG);

    // ── Gap 1 hand-off cost items (V21) ───────────────────────────────────
    var gap1CostsG = svgEl('g', { id: 'de-gap1-costs', opacity: '0' });
    [
      { y: 218, text: '· Context rebuilt' },
      { y: 236, text: '· Req. translated' },
      { y: 254, text: '· Evidence rebuilt' },
      { y: 272, text: '· Ownership changed' },
      { y: 290, text: '· Cost assumptions' }
    ].forEach(function(item) {
      var t = svgEl('text', {
        x: 355, y: item.y,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '9',
        fill: AMBER
      });
      t.textContent = item.text;
      gap1CostsG.appendChild(t);
    });
    svg.appendChild(gap1CostsG);

    // ── Gap 2 hand-off cost items (V21) ───────────────────────────────────
    var gap2CostsG = svgEl('g', { id: 'de-gap2-costs', opacity: '0' });
    [
      { y: 218, text: '· Context rebuilt' },
      { y: 236, text: '· Req. translated' },
      { y: 254, text: '· Evidence rebuilt' },
      { y: 272, text: '· Ownership changed' },
      { y: 290, text: '· Cost assumptions' }
    ].forEach(function(item) {
      var t = svgEl('text', {
        x: 765, y: item.y,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '9',
        fill: AMBER
      });
      t.textContent = item.text;
      gap2CostsG.appendChild(t);
    });
    svg.appendChild(gap2CostsG);

    // Waste summary
    var wasteEl = svgEl('text', {
      id: 'de-waste',
      x: 600, y: 320,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '10',
      fill: AMBER,
      'text-anchor': 'middle',
      opacity: '0'
    });
    wasteEl.textContent = '3 hand-offs  --  context rebuilt twice  --  evidence disconnected';
    svg.appendChild(wasteEl);

    // ── Act 1 obligation token ─────────────────────────────────────────
    var tokenG = svgEl('g', {
      id: 'de-token',
      transform: 'translate(60,188)',
      opacity: '0'
    });
    tokenG.appendChild(svgEl('rect', {
      x: 0, y: 0, width: 84, height: 24,
      rx: 12, fill: ACCENT
    }));
    var tokTxt = svgEl('text', {
      x: 42, y: 16,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '11',
      fill: '#fff',
      'text-anchor': 'middle',
      'font-weight': '600'
    });
    tokTxt.textContent = 'Art. 7(3)';
    tokenG.appendChild(tokTxt);
    svg.appendChild(tokenG);

    // ── Shared context strip (Act 2) ───────────────────────────────────
    svg.appendChild(svgEl('rect', {
      id: 'de-strip',
      x: 0, y: 360, width: 1200, height: 40,
      fill: 'rgba(180,76,255,0.08)',
      stroke: ACCENT,
      'stroke-width': '1',
      'stroke-dasharray': '6 3',
      opacity: '0'
    }));

    var stripLblEl = svgEl('text', {
      id: 'de-strip-lbl',
      x: 10, y: 358,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '9',
      'letter-spacing': '0.08em',
      fill: ACCENT,
      opacity: '0'
    });
    stripLblEl.textContent = 'SHARED CONTEXT AND EVIDENCE';
    svg.appendChild(stripLblEl);

    // ── Delivery spine (Act 2) ─────────────────────────────────────────
    var spineG = svgEl('g', { id: 'de-spine', opacity: '0' });

    spineG.appendChild(svgEl('line', {
      x1: SPINE_X0, y1: SPINE_Y, x2: SPINE_X1, y2: SPINE_Y,
      stroke: ACCENT, 'stroke-width': '2'
    }));

    var span = SPINE_X1 - SPINE_X0;
    SPINE_STEPS.forEach(function(step, i) {
      var nx = SPINE_X0 + Math.round(i * span / (SPINE_STEPS.length - 1));
      var ng = svgEl('g', { id: 'de-sn-' + i, opacity: '0' });

      ng.appendChild(svgEl('circle', {
        cx: nx, cy: SPINE_Y, r: 8,
        fill: SURF2,
        stroke: ACCENT, 'stroke-width': '2'
      }));

      var nlbl = svgEl('text', {
        x: nx, y: SPINE_Y + 28,
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': '12',
        'font-weight': '700',
        fill: ACCENT,
        'text-anchor': 'middle'
      });
      nlbl.textContent = step;
      ng.appendChild(nlbl);

      spineG.appendChild(ng);
    });

    svg.appendChild(spineG);

    // ── Act 3: Integrated fields (solid borders, no ISOLATED badge) ────
    var fieldsG = svgEl('g', { id: 'de-fields', opacity: '0' });

    var fieldDefs = [
      {
        x: 30,  y: 80, w: 320, h: 200, color: CYAN,
        label: 'RISK AND REGULATORY DESIGN',
        caps: ['Obligation mapping and interpretation', 'Risk and control design', 'Regulatory evidence standard']
      },
      {
        x: 440, y: 80, w: 320, h: 200, color: ACCENT,
        label: 'AI BUILD AND INTEGRATION',
        caps: ['Context-aware model design', 'Knowledge graph and retrieval', 'Security and provenance']
      },
      {
        x: 850, y: 80, w: 320, h: 200, color: GREEN,
        label: 'PRODUCTION RUN AND SCALE',
        caps: ['Shared platform and reuse', 'Cost per case optimisation', 'Risk-based human review']
      }
    ];

    fieldDefs.forEach(function(field) {
      var fg = svgEl('g', {});

      fg.appendChild(svgEl('rect', {
        x: field.x, y: field.y, width: field.w, height: field.h,
        rx: 6,
        fill: 'rgba(255,255,255,0.04)',
        stroke: field.color,
        'stroke-width': '1.5'
      }));

      var flbl = svgEl('text', {
        x: field.x + 14, y: field.y + 24,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '10',
        'letter-spacing': '0.08em',
        fill: field.color
      });
      flbl.textContent = field.label;
      fg.appendChild(flbl);

      field.caps.forEach(function(cap, ci) {
        var ct = svgEl('text', {
          x: field.x + 16, y: field.y + 54 + ci * 22,
          'font-family': 'Inter, sans-serif',
          'font-size': '12',
          fill: 'rgba(255,255,255,0.6)'
        });
        var dot = svgEl('tspan', { fill: field.color });
        dot.textContent = '• ';
        ct.appendChild(dot);
        var txt = svgEl('tspan', {});
        txt.textContent = cap;
        ct.appendChild(txt);
        fg.appendChild(ct);
      });

      fieldsG.appendChild(fg);
    });

    svg.appendChild(fieldsG);

    // ── Act 4: Integrated obligation token ────────────────────────────
    var tok2G = svgEl('g', {
      id: 'de-tok2',
      transform: 'translate(80,248)',
      opacity: '0'
    });
    tok2G.appendChild(svgEl('rect', {
      x: 0, y: 0, width: 84, height: 24,
      rx: 12, fill: ACCENT
    }));
    var tok2Txt = svgEl('text', {
      x: 42, y: 16,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '11',
      fill: '#fff',
      'text-anchor': 'middle',
      'font-weight': '600'
    });
    tok2Txt.textContent = 'Art. 7(3)';
    tok2G.appendChild(tok2Txt);
    svg.appendChild(tok2G);

    // ── Proof outcomes ────────────────────────────────────────────────
    var proofsG = svgEl('g', { id: 'de-proofs', opacity: '0' });

    var proofDefs = [
      { text: 'Faster route to evidence',                      color: CYAN,   px: 60  },
      { text: 'Lower avoidable build and run effort',          color: GREEN,  px: 410 },
      { text: 'More value retained through reuse and control', color: ACCENT, px: 750 }
    ];

    proofDefs.forEach(function(proof) {
      var chk = svgEl('text', {
        x: proof.px, y: 482,
        'font-family': 'Inter, sans-serif',
        'font-size': '16',
        'font-weight': '700',
        fill: proof.color
      });
      chk.textContent = '✓';
      proofsG.appendChild(chk);

      var ptxt = svgEl('text', {
        x: proof.px + 22, y: 482,
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': '14',
        'font-weight': '600',
        fill: proof.color
      });
      ptxt.textContent = proof.text;
      proofsG.appendChild(ptxt);
    });

    // ── Preserved context row (V21) ───────────────────────────────────────
    var preservedG = svgEl('g', { id: 'de-preserved', opacity: '0' });
    var preservedLbl = svgEl('text', {
      x: 600, y: 436,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '9',
      'letter-spacing': '0.1em',
      fill: GREEN,
      'text-anchor': 'middle'
    });
    preservedLbl.textContent = 'PRESERVED THROUGH ALL STAGES';
    preservedG.appendChild(preservedLbl);
    var preservedItems = svgEl('text', {
      x: 600, y: 454,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '11',
      fill: GREEN,
      opacity: '0.7',
      'text-anchor': 'middle'
    });
    preservedItems.textContent = 'Source context  ·  Decision rights  ·  Technical lineage  ·  Control evidence  ·  Unit economics';
    preservedG.appendChild(preservedItems);
    svg.appendChild(preservedG);

    svg.appendChild(proofsG);

    // Supporting message
    var msgEl = svgEl('text', {
      id: 'de-msg',
      x: 600, y: 536,
      'font-family': 'Inter, sans-serif',
      'font-size': '12',
      fill: 'rgba(255,255,255,0.4)',
      'text-anchor': 'middle',
      opacity: '0'
    });
    msgEl.textContent = 'AI applied to the client process. AI applied to selected delivery activities.';
    svg.appendChild(msgEl);

    root.appendChild(svg);
    container.appendChild(root);
  }

  // Act 1: obligation token travels with dimming at gaps
  function runAct1Token() {
    var tok = $id('de-token');
    if (!tok) return;
    tok.setAttribute('opacity', '1');

    // Leg 1: inside island 0 (x 60 -> 240)
    tweenX(tok, 60, 240, 188, 700, function() {
      tok.setAttribute('opacity', '0.3');
      // Reveal gap 1 indicators
      var g1l = $id('de-gap1-line'), g1t = $id('de-gap1-lbl');
      if (g1l) g1l.setAttribute('opacity', '1');
      if (g1t) g1t.setAttribute('opacity', '1');
      var g1c = $id('de-gap1-costs');
      if (g1c) g1c.setAttribute('opacity', '1');

      // Cross gap 1: x 240 -> 458, enter island 1
      later(480, function() {
        tweenX(tok, 240, 458, 188, 420, function() {
          tok.setAttribute('opacity', '0.9');

          // Leg 3: inside island 1 (x 458 -> 654)
          later(160, function() {
            tweenX(tok, 458, 654, 188, 700, function() {
              tok.setAttribute('opacity', '0.3');
              // Reveal gap 2 indicators
              var g2l = $id('de-gap2-line'), g2t = $id('de-gap2-lbl');
              if (g2l) g2l.setAttribute('opacity', '1');
              if (g2t) g2t.setAttribute('opacity', '1');
              var g2c = $id('de-gap2-costs');
              if (g2c) g2c.setAttribute('opacity', '1');

              // Cross gap 2: x 654 -> 868, enter island 2
              later(480, function() {
                tweenX(tok, 654, 868, 188, 420, function() {
                  tok.setAttribute('opacity', '0.9');
                  // Show waste summary after token settles
                  later(380, function() {
                    var waste = $id('de-waste');
                    if (waste) waste.setAttribute('opacity', '1');
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  // Apply full final state (for finish / reduced motion)
  function applyFinalState() {
    // Hide Act 1 elements
    ['de-islands', 'de-token', 'de-waste', 'de-gap1-costs', 'de-gap2-costs'].forEach(function(id) {
      var el = $id(id);
      if (el) el.setAttribute('opacity', '0');
    });
    ['de-gap1-line', 'de-gap1-lbl', 'de-gap2-line', 'de-gap2-lbl'].forEach(function(id) {
      var el = $id(id);
      if (el) el.setAttribute('opacity', '0');
    });

    // Show context strip
    var strip = $id('de-strip'), stripLbl = $id('de-strip-lbl');
    if (strip)    strip.setAttribute('opacity', '1');
    if (stripLbl) stripLbl.setAttribute('opacity', '1');

    // Show spine and all nodes
    var spineG = $id('de-spine');
    if (spineG) spineG.setAttribute('opacity', '1');
    SPINE_STEPS.forEach(function(_, i) {
      var n = $id('de-sn-' + i);
      if (n) n.setAttribute('opacity', '1');
    });

    // Show integrated fields
    var fields = $id('de-fields');
    if (fields) fields.setAttribute('opacity', '1');

    // Token at end of track
    var tok2 = $id('de-tok2');
    if (tok2) {
      tok2.setAttribute('opacity', '1');
      tok2.setAttribute('transform', 'translate(1036,248)');
    }

    // Proofs and message
    var proofs = $id('de-proofs'), msg = $id('de-msg');
    if (proofs) proofs.setAttribute('opacity', '1');
    if (msg)    msg.setAttribute('opacity', '1');

    var preserved = $id('de-preserved');
    if (preserved) preserved.setAttribute('opacity', '1');
  }

  // Timeline steps
  var steps = [
    // Beat 1: Islands appear
    { delay: 100, run: function() {
      var isl = $id('de-islands');
      if (isl) isl.setAttribute('opacity', '1');
    }},

    // Beat 2: Obligation token starts its fragmented journey
    { delay: 700, run: function() {
      runAct1Token();
    }},

    // Beat 5: Islands fade to 20%, gaps/waste hide, context strip appears
    { delay: 5000, run: function() {
      var isl   = $id('de-islands');
      var tok   = $id('de-token');
      var waste = $id('de-waste');
      if (isl)   isl.setAttribute('opacity', '0.2');
      if (tok)   tok.setAttribute('opacity', '0');
      if (waste) waste.setAttribute('opacity', '0');
      ['de-gap1-line','de-gap1-lbl','de-gap2-line','de-gap2-lbl'].forEach(function(id) {
        var el = $id(id);
        if (el) el.setAttribute('opacity', '0');
      });
      var strip = $id('de-strip'), stripLbl = $id('de-strip-lbl');
      if (strip)    strip.setAttribute('opacity', '1');
      if (stripLbl) stripLbl.setAttribute('opacity', '1');
    }},

    // Beat 6: Spine appears, nodes stagger in
    { delay: 5700, run: function() {
      var spineG = $id('de-spine');
      if (spineG) spineG.setAttribute('opacity', '1');
      SPINE_STEPS.forEach(function(_, i) {
        later(i * 180, function() {
          var n = $id('de-sn-' + i);
          if (n) n.setAttribute('opacity', '1');
        });
      });
    }},

    // Beat 7: Islands fully fade, integrated fields appear
    { delay: 7000, run: function() {
      var isl = $id('de-islands');
      if (isl) isl.setAttribute('opacity', '0');
      var fields = $id('de-fields');
      if (fields) fields.setAttribute('opacity', '1');
    }},

    // Beat 8: Integrated token travels full path without dimming
    { delay: 7700, run: function() {
      var tok2 = $id('de-tok2');
      if (!tok2) return;
      tok2.setAttribute('opacity', '1');
      tweenX(tok2, 80, 1036, 248, 2200, null);
    }},

    // Beat 9: Proof outcomes and supporting message appear
    { delay: 10100, run: function() {
      var proofs = $id('de-proofs'), msg = $id('de-msg');
      if (proofs) proofs.setAttribute('opacity', '1');
      if (msg)    msg.setAttribute('opacity', '1');
      var preserved = $id('de-preserved');
      if (preserved) preserved.setAttribute('opacity', '1');
    }}
  ];

  tl = createTimeline(steps);

  // ── Lifecycle ──────────────────────────────────────────────────────────
  function _clearAll() {
    _alive = false;
    _timers.forEach(clearTimeout);
    _timers = [];
    _rafIds.forEach(cancelAnimationFrame);
    _rafIds = [];
  }

  return {
    play: function() {
      _clearAll();
      build();
      tl.play();
    },
    pause:  function() { tl.pause(); },
    resume: function() { tl.resume(); },
    reset: function() {
      _clearAll();
      tl.reset();
      build();
    },
    finish: function() {
      _clearAll();
      tl.reset();
      build();
      _alive = true;
      applyFinalState();
    },
    destroy: function() {
      _clearAll();
      tl.destroy();
      container.innerHTML = '';
    }
  };
});
