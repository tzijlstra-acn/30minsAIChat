// Scene: regulation-process -- Wow 2: One clause becomes a governed decision
// V19 Viewport Wow System -- 10-beat hero flow, SVG-native.
SceneDirector.register('regulation-process', function(container, manifest, reduced) {

  var _timers = [];

  var W = 1240, H = 520;
  var CY = 60, CH = 340, CW = 200;
  var CXS = [20, 265, 510, 755, 1000];
  var ARR_Y = CY + CH / 2; // 230

  var C = {
    accent:  '#B44CFF',
    amber:   '#F3B34C',
    green:   '#58C994',
    pink:    '#F0758A',
    text1:   '#F7F7FA',
    text2:   '#D4D8E2',
    text3:   '#B3BAC8',
    border1: '#343949',
    border2: '#4A5168',
    bg1:     '#0F111A',
    bg2:     '#161927',
    bg3:     '#1D2135'
  };

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  var els = {};
  var svg;

  // ── Card definitions ──
  var CARDS = [
    {
      id: 'source',
      tag: '01 SOURCE',
      title: 'Regulatory text',
      body: ['Source document arrives'],
      borderColor: C.border1,
      topBarColor: null,
      tagColor: C.text3,
      titleColor: C.text1
    },
    {
      id: 'structure',
      tag: '02 STRUCTURE',
      title: 'Obligation extracted',
      body: ['Actor, action,', 'condition, frequency'],
      borderColor: C.accent,
      topBarColor: C.accent,
      tagColor: C.accent,
      titleColor: C.text1
    },
    {
      id: 'connect',
      tag: '03 CONNECT',
      title: 'Policy and control mapped',
      body: ['Gap identified', 'by AI analysis'],
      borderColor: C.accent,
      topBarColor: C.accent,
      tagColor: C.accent,
      titleColor: C.text1
    },
    {
      id: 'challenge',
      tag: '04 CHALLENGE',
      title: 'Human reviews',
      body: ['Analyst challenges', 'AI output'],
      borderColor: C.amber,
      topBarColor: C.amber,
      tagColor: C.amber,
      titleColor: C.amber
    },
    {
      id: 'evidence',
      tag: '05 EVIDENCE',
      title: 'Approved and traceable',
      body: ['Evidence record', 'Audit trail complete'],
      borderColor: C.green,
      topBarColor: C.green,
      tagColor: C.green,
      titleColor: C.green
    }
  ];

  // ── Build DOM ──
  function build() {
    container.innerHTML = '';
    els = {};

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden';

    svg = svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet',
      style: 'width:100%;height:100%;display:block'
    });

    // Background
    svg.appendChild(svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: C.bg1 }));

    buildHeader();
    buildCards();
    buildArrows();
    buildPauseIndicator();
    buildTraceLabel();

    root.appendChild(svg);
    container.appendChild(root);
  }

  function buildHeader() {
    var g = svgEl('g', { opacity: '0' });
    g.style.transition = 'opacity 400ms ease';
    els.header = g;

    g.appendChild(svgEl('rect', {
      x: 20, y: 12, width: W - 40, height: 34,
      rx: 4, fill: C.bg2, stroke: C.border1, 'stroke-width': 1
    }));

    var ht = svgEl('text', {
      x: 36, y: 34,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 12,
      'letter-spacing': '0.1em',
      fill: C.text3
    });
    ht.textContent = 'ART. 7(3) -- COVERAGE MAPPING';
    g.appendChild(ht);

    // LIVE pill -- measured to ensure text stays inside the pill rect
    var livePill = buildLivePill(g);
    g.appendChild(livePill);

    svg.appendChild(g);
  }

  // Build a measured status pill for the LIVE indicator.
  // Returns a <g> containing a rect + centred text; adjusts pill width to the
  // measured text extent so text never clips or overflows the box.
  function buildLivePill(parentG) {
    var PILL_H  = 18;
    var PAD_X   = 12;
    var MIN_W   = 54;
    var SAFE_R  = 22; // min gap from viewBox right edge
    var PILL_CY = 29; // vertical centre of the header strip

    // Temporary off-screen text to measure width
    var tMeasure = svgEl('text', {
      x: '-9999', y: '-9999',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 11,
      'letter-spacing': '0.1em',
      visibility: 'hidden'
    });
    tMeasure.textContent = 'LIVE';
    svg.appendChild(tMeasure);
    var tw = 28; // fallback
    try { tw = tMeasure.getComputedTextLength() || tMeasure.getBBox().width || 28; } catch(e) {}
    svg.removeChild(tMeasure);

    var pillW = Math.max(MIN_W, Math.ceil(tw) + PAD_X * 2);
    // Centre-left of the header bar -- avoids the far-right clip zone
    var pillX = Math.round(W * 0.68) - Math.round(pillW / 2);

    var pg = svgEl('g', {});

    // Pill background rect
    pg.appendChild(svgEl('rect', {
      x: pillX, y: PILL_CY - PILL_H / 2,
      width: pillW, height: PILL_H,
      rx: 4,
      fill: 'rgba(180,76,255,0.12)',
      stroke: C.accent, 'stroke-width': 1
    }));

    // Live dot
    pg.appendChild(svgEl('circle', {
      cx: pillX + 10, cy: PILL_CY, r: 3,
      fill: C.accent, opacity: '0.9'
    }));

    // Centred LIVE text (after dot)
    var lsTxt = svgEl('text', {
      x: pillX + 10 + 8 + (pillW - 18) / 2, y: PILL_CY,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 11,
      'letter-spacing': '0.1em',
      fill: C.accent
    });
    lsTxt.textContent = 'LIVE';
    pg.appendChild(lsTxt);

    return pg;
  }

  function buildCards() {
    CARDS.forEach(function(card, i) {
      var cx = CXS[i];
      var g = svgEl('g', { opacity: '0' });
      g.style.transition = 'opacity 500ms ease';
      els['card_' + card.id] = g;

      // Card background rect
      g.appendChild(svgEl('rect', {
        x: cx, y: CY, width: CW, height: CH,
        rx: 6, fill: C.bg2,
        stroke: card.borderColor, 'stroke-width': 1.5
      }));

      // Top accent bar
      if (card.topBarColor) {
        g.appendChild(svgEl('rect', {
          x: cx + 1, y: CY + 1, width: CW - 2, height: 7,
          rx: 5, fill: card.topBarColor, opacity: '0.9'
        }));
      }

      var tagY = CY + (card.topBarColor ? 30 : 22);

      // Tag
      var tag = svgEl('text', {
        x: cx + 12, y: tagY,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9,
        'letter-spacing': '0.12em',
        fill: card.tagColor
      });
      tag.textContent = card.tag;
      g.appendChild(tag);

      // Title
      var title = svgEl('text', {
        x: cx + 12, y: tagY + 24,
        'font-family': 'Space Grotesk, sans-serif',
        'font-size': 15,
        'font-weight': '700',
        fill: card.titleColor
      });
      title.textContent = card.title;
      g.appendChild(title);

      // Body lines
      card.body.forEach(function(line, li) {
        var bt = svgEl('text', {
          x: cx + 12, y: tagY + 46 + li * 17,
          'font-family': 'Space Grotesk, sans-serif',
          'font-size': 13,
          fill: C.text2
        });
        bt.textContent = line;
        g.appendChild(bt);
      });

      // Per-card extra content
      if (card.id === 'source') buildSourceExtras(g, cx, tagY);
      if (card.id === 'structure') buildStructureExtras(g, cx, tagY);
      if (card.id === 'connect') buildConnectExtras(g, cx);
      if (card.id === 'challenge') buildChallengeExtras(g, cx);
      if (card.id === 'evidence') buildEvidenceExtras(g, cx);

      svg.appendChild(g);
    });
  }

  function buildSourceExtras(g, cx, tagY) {
    // Separator line at bottom
    g.appendChild(svgEl('line', {
      x1: cx + 12, y1: CY + CH - 26,
      x2: cx + CW - 12, y2: CY + CH - 26,
      stroke: C.border1, 'stroke-width': 1.5
    }));
    var hint = svgEl('text', {
      x: cx + 12, y: CY + CH - 12,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 9,
      'letter-spacing': '0.08em',
      fill: C.text3, opacity: '0.7'
    });
    hint.textContent = 'INGESTED';
    g.appendChild(hint);

    // Document icon
    var dx = cx + CW / 2 - 18, dy = CY + 155;
    g.appendChild(svgEl('rect', {
      x: dx, y: dy, width: 36, height: 44,
      rx: 3, fill: 'none', stroke: C.border2, 'stroke-width': 1.5
    }));
    [[6, 12], [6, 20], [6, 28]].forEach(function(p, li) {
      g.appendChild(svgEl('line', {
        x1: dx + p[0], y1: dy + p[1],
        x2: dx + (li < 2 ? 30 : 22), y2: dy + p[1],
        stroke: C.text3, 'stroke-width': 1.2, opacity: '0.6'
      }));
    });
  }

  function buildStructureExtras(g, cx, tagY) {
    var chips = ['actor', 'action', 'condition', 'frequency'];
    var chipY0 = CY + 200;
    chips.forEach(function(chip, ci) {
      var row = Math.floor(ci / 2);
      var col = ci % 2;
      var chipX = cx + 10 + col * 96;
      var chipG = svgEl('g', { opacity: '0' });
      chipG.style.cssText = 'transition:opacity 300ms ease,transform 300ms ease;transform-box:fill-box;transform-origin:center;transform:scale(0)';
      els['chip_' + ci] = chipG;

      chipG.appendChild(svgEl('rect', {
        x: chipX, y: chipY0 + row * 28, width: 84, height: 20,
        rx: 10,
        fill: 'rgba(180,76,255,0.10)',
        stroke: C.accent, 'stroke-width': 0.8
      }));
      var ct = svgEl('text', {
        x: chipX + 42, y: chipY0 + row * 28 + 14,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9,
        'text-anchor': 'middle',
        'letter-spacing': '0.06em',
        fill: C.accent
      });
      ct.textContent = chip;
      chipG.appendChild(ct);
      g.appendChild(chipG);
    });
  }

  function buildConnectExtras(g, cx) {
    var gcx = cx + CW / 2;
    var gcy = CY + 225;
    var nodes = [
      { x: gcx - 42, y: gcy + 10, label: 'obligation', color: C.accent },
      { x: gcx + 8,  y: gcy - 22, label: 'policy',     color: C.accent },
      { x: gcx + 50, y: gcy + 14, label: 'control',    color: C.green }
    ];

    // Edges -- stored so we can dim one for gap highlight
    var edgeG = svgEl('g', { opacity: '0' });
    edgeG.style.transition = 'opacity 400ms ease';
    els.graphEdges = edgeG;

    var edge1 = svgEl('line', {
      x1: nodes[0].x, y1: nodes[0].y,
      x2: nodes[1].x, y2: nodes[1].y,
      stroke: C.accent, 'stroke-width': 1.2, opacity: '0.65'
    });
    els.graphEdge1 = edge1;
    edgeG.appendChild(edge1);

    var edge2 = svgEl('line', {
      x1: nodes[1].x, y1: nodes[1].y,
      x2: nodes[2].x, y2: nodes[2].y,
      stroke: C.green, 'stroke-width': 1.2, opacity: '0.65'
    });
    edgeG.appendChild(edge2);
    g.appendChild(edgeG);

    nodes.forEach(function(np) {
      g.appendChild(svgEl('circle', {
        cx: np.x, cy: np.y, r: 5,
        fill: np.color, opacity: '0.9'
      }));
      var nl = svgEl('text', {
        x: np.x, y: np.y + 16,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9,
        'text-anchor': 'middle',
        fill: C.text3
      });
      nl.textContent = np.label;
      g.appendChild(nl);
    });
  }

  function buildChallengeExtras(g, cx) {
    var dcx = cx + CW / 2, dcy = CY + 230, ds = 22;
    var diamond = svgEl('polygon', {
      points: [
        dcx + ',' + (dcy - ds),
        (dcx + ds) + ',' + dcy,
        dcx + ',' + (dcy + ds),
        (dcx - ds) + ',' + dcy
      ].join(' '),
      fill: 'rgba(243,179,76,0.12)',
      stroke: C.amber, 'stroke-width': 1.8
    });
    diamond.style.cssText = 'transform-box:fill-box;transform-origin:center;transform:scale(1);transition:transform 150ms ease';
    els.diamond = diamond;
    g.appendChild(diamond);

    var dq = svgEl('text', {
      x: dcx, y: dcy + 5,
      'font-family': 'Space Grotesk, sans-serif',
      'font-size': 14,
      'font-weight': '700',
      'text-anchor': 'middle',
      fill: C.amber
    });
    dq.textContent = '?';
    g.appendChild(dq);
  }

  function buildEvidenceExtras(g, cx) {
    var scx = cx + CW / 2, scy = CY + 230;
    var sealG = svgEl('g', { opacity: '0' });
    sealG.style.cssText = 'transform-box:fill-box;transform-origin:center;transform:scale(0);transition:opacity 300ms ease,transform 420ms cubic-bezier(0.175,0.885,0.32,1.275)';
    els.seal = sealG;

    sealG.appendChild(svgEl('circle', {
      cx: scx, cy: scy, r: 23,
      fill: 'rgba(88,201,148,0.12)',
      stroke: C.green, 'stroke-width': 2
    }));

    // Checkmark
    sealG.appendChild(svgEl('polyline', {
      points: (scx - 10) + ',' + scy + ' ' + (scx - 3) + ',' + (scy + 8) + ' ' + (scx + 12) + ',' + (scy - 8),
      fill: 'none',
      stroke: C.green,
      'stroke-width': 2.5,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    g.appendChild(sealG);
  }

  function buildArrows() {
    var arrowColors = [C.accent, C.accent, C.amber, C.green];
    var arrowIds = ['arr01', 'arr12', 'arr23', 'arr34'];

    for (var ai = 0; ai < 4; ai++) {
      var ax1 = CXS[ai] + CW + 2;
      var ax2 = CXS[ai + 1] - 2;
      var color = arrowColors[ai];

      var ag = svgEl('g', { opacity: '0' });
      ag.style.transition = 'opacity 400ms ease';
      els[arrowIds[ai]] = ag;

      ag.appendChild(svgEl('line', {
        x1: ax1, y1: ARR_Y,
        x2: ax2 - 8, y2: ARR_Y,
        stroke: color, 'stroke-width': 1.5, opacity: '0.8'
      }));

      ag.appendChild(svgEl('polygon', {
        points: ax2 + ',' + ARR_Y + ' '
          + (ax2 - 8) + ',' + (ARR_Y - 5) + ' '
          + (ax2 - 8) + ',' + (ARR_Y + 5),
        fill: color, opacity: '0.9'
      }));

      svg.appendChild(ag);
    }
  }

  function buildPauseIndicator() {
    // Between CONNECT and CHALLENGE (arrow arr23 region)
    var midX = (CXS[2] + CW + CXS[3]) / 2;
    var pg = svgEl('g', { opacity: '0' });
    pg.style.transition = 'opacity 400ms ease';
    els.pauseIndicator = pg;

    pg.appendChild(svgEl('rect', {
      x: midX - 36, y: ARR_Y - 32, width: 72, height: 18,
      rx: 3,
      fill: 'rgba(243,179,76,0.10)',
      stroke: C.amber, 'stroke-width': 0.8
    }));
    var pt = svgEl('text', {
      x: midX, y: ARR_Y - 19,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 9,
      'text-anchor': 'middle',
      'letter-spacing': '0.07em',
      fill: C.amber
    });
    pt.textContent = 'HUMAN GATE';
    pg.appendChild(pt);
    svg.appendChild(pg);
  }

  function buildTraceLabel() {
    var tg = svgEl('g', { opacity: '0' });
    tg.style.transition = 'opacity 500ms ease';
    els.trace = tg;

    tg.appendChild(svgEl('rect', {
      x: 20, y: H - 34, width: W - 40, height: 18,
      rx: 3, fill: C.bg2, stroke: C.border1, 'stroke-width': 1
    }));

    var tt = svgEl('text', {
      x: W / 2, y: H - 21,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 9,
      'text-anchor': 'middle',
      'letter-spacing': '0.08em',
      fill: C.text3, opacity: '0.7'
    });
    tt.textContent = 'SOURCE-BACKED FLOW -- ILLUSTRATIVE TIMING -- NOT CLIENT DATA';
    tg.appendChild(tt);
    svg.appendChild(tg);
  }

  // ── Animation helpers ──
  function showEl(el) {
    if (el) el.setAttribute('opacity', '1');
  }

  function showCard(id) {
    showEl(els['card_' + id]);
  }

  function showArrow(id) {
    showEl(els[id]);
  }

  function pulseDiamond() {
    var d = els.diamond;
    if (!d) return;
    d.style.transform = 'scale(0.8)';
    _timers.push(setTimeout(function() {
      if (d) d.style.transform = 'scale(1.2)';
      _timers.push(setTimeout(function() {
        if (d) d.style.transform = 'scale(1.0)';
      }, 160));
    }, 160));
  }

  function showSeal() {
    var s = els.seal;
    if (!s) return;
    s.setAttribute('opacity', '1');
    // Defer one frame so transition fires
    _timers.push(setTimeout(function() {
      if (s) s.style.transform = 'scale(1)';
    }, 20));
  }

  function bloomChips() {
    [0, 1, 2, 3].forEach(function(ci) {
      _timers.push(setTimeout(function() {
        var c = els['chip_' + ci];
        if (c) {
          c.setAttribute('opacity', '1');
          c.style.transform = 'scale(1)';
        }
      }, ci * 110));
    });
  }

  function bloomGraphEdges() {
    _timers.push(setTimeout(function() {
      showEl(els.graphEdges);
    }, 280));
  }

  function gapHighlight() {
    // Briefly dim edge1 to red then restore
    var e = els.graphEdge1;
    if (!e) return;
    _timers.push(setTimeout(function() {
      if (e) {
        e.style.transition = 'stroke 250ms ease';
        e.setAttribute('stroke', C.pink);
      }
      _timers.push(setTimeout(function() {
        if (e) e.setAttribute('stroke', C.accent);
      }, 500));
    }, 300));
  }

  // ── Timeline steps ──
  var steps = [
    // Beat 1 -- 200ms: header
    { delay: 200, run: function() {
      showEl(els.header);
    }},

    // Beat 2 -- 600ms: SOURCE card
    { delay: 600, run: function() {
      showCard('source');
    }},

    // Beat 3 -- 1200ms: STRUCTURE card + chips
    { delay: 1200, run: function() {
      showCard('structure');
      _timers.push(setTimeout(function() { bloomChips(); }, 250));
    }},

    // Beat 4 -- 1800ms: arrow SOURCE->STRUCTURE
    { delay: 1800, run: function() {
      showArrow('arr01');
    }},

    // Beat 5 -- 2400ms: CONNECT card + graph edges bloom
    { delay: 2400, run: function() {
      showCard('connect');
      bloomGraphEdges();
    }},

    // Beat 6 -- 3000ms: arrow STRUCTURE->CONNECT + gap highlight
    { delay: 3000, run: function() {
      showArrow('arr12');
      gapHighlight();
    }},

    // Beat 7 -- 3600ms: CHALLENGE card + diamond pulse
    { delay: 3600, run: function() {
      showCard('challenge');
      _timers.push(setTimeout(function() { pulseDiamond(); }, 350));
    }},

    // Beat 8 -- 4200ms: arrow CONNECT->CHALLENGE + pause indicator
    { delay: 4200, run: function() {
      showArrow('arr23');
      showEl(els.pauseIndicator);
    }},

    // Beat 9 -- 4800ms: EVIDENCE card + seal stamps in
    { delay: 4800, run: function() {
      showCard('evidence');
      _timers.push(setTimeout(function() { showSeal(); }, 220));
    }},

    // Beat 10 -- 5400ms: arrow CHALLENGE->EVIDENCE + trace label + complete
    { delay: 5400, run: function() {
      showArrow('arr34');
      showEl(els.trace);
      _timers.push(setTimeout(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 600));
    }}
  ];

  var tl = createTimeline(steps);

  function showAll() {
    showEl(els.header);
    CARDS.forEach(function(card) { showCard(card.id); });
    ['arr01', 'arr12', 'arr23', 'arr34'].forEach(showArrow);
    [0, 1, 2, 3].forEach(function(ci) {
      var c = els['chip_' + ci];
      if (c) { c.setAttribute('opacity', '1'); c.style.transform = 'scale(1)'; }
    });
    showEl(els.graphEdges);
    showEl(els.pauseIndicator);
    showEl(els.trace);
    var s = els.seal;
    if (s) { s.setAttribute('opacity', '1'); s.style.transform = 'scale(1)'; }
  }

  return {
    play: function() {
      build();
      if (reduced) { showAll(); return; }
      tl.play();
    },
    pause: function() { tl.pause(); },
    resume: function() { tl.resume(); },
    reset: function() {
      tl.reset();
      build();
    },
    finish: function() {
      build();
      showAll();
    },
    getAccessibleSummary: function() {
      return 'A regulatory clause passes through five stages: Source, Structure, Connect, Challenge, and Evidence. Obligations are extracted, matched to policy and controls, challenged by a human reviewer, and sealed with verified evidence. Each step is source-backed.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout);
      _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
