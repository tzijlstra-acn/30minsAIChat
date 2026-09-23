// Scene: cover-flow (Screen 00 - Introduction)
// V17: fixed SVG viewBox="0 0 1120 280" -- horizontal 5-beat flow.
// No viewport-derived sizing. No height:100% inside scene descendants.
// Geometry is fully determined by the SVG viewBox and preserveAspectRatio.
// At 1366x768 compact stage (~261px): doc icon <= 92x118px, total height <= 320px.
SceneDirector.register('cover-flow', function(container, manifest, reduced) {

  var VW = 1120, VH = 280;

  // Doc icon: x=45, y=65, w=80, h=100 -- right edge at 125
  // Chip y=80, h=70 -- chip center y=115 = doc center y (65+50)
  // Arrows at y=115 (horizontal through centres)
  // Chips: x=195,425,655,885  width=160 each  gap=65 between chips (arrows fill gap)
  var DOC    = { x: 45,  y: 65, w: 80, h: 100 };
  var CHIP_Y = 80, CHIP_H = 70, CHIP_W = 160;
  var ARROW_Y = 115;

  var CHIPS = [
    { beat: 'word-0', x: 195, color: '#B44CFF', upper: 'AI-ASSISTED', label: 'Analysis'  },
    { beat: 'word-1', x: 425, color: '#F3B34C', upper: 'HUMAN',       label: 'Decision'  },
    { beat: 'word-2', x: 655, color: '#58C994', upper: 'VERIFIED',    label: 'Evidence'  },
    { beat: 'word-3', x: 885, color: '#55C7E8', upper: 'REUSABLE',    label: 'Pattern'   }
  ];

  // Arrow x1 = prev element right edge + 5, x2 = next element left edge - 2
  var ARROWS = [
    { beat: 'arrow-1', x1: 130, x2: 193 },
    { beat: 'sep-0',   x1: 360, x2: 423 },
    { beat: 'sep-1',   x1: 590, x2: 653 },
    { beat: 'sep-2',   x1: 820, x2: 883 }
  ];

  function buildSVG() {
    container.innerHTML = '';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.cssText = 'width:100%;height:100%;display:block;';

    // ── Doc icon group ──
    var docG = svgEl('g', { 'data-beat': 'doc' });
    docG.style.cssText = 'opacity:0;transition:opacity 400ms ease;';

    // Page outline
    docG.appendChild(svgEl('rect', {
      x: DOC.x, y: DOC.y, width: DOC.w, height: DOC.h,
      rx: '5', fill: 'var(--surface-1,#191C25)',
      stroke: 'var(--border-1,#343949)', 'stroke-width': '1.5'
    }));
    // Text lines inside page
    [
      [DOC.x + 12, DOC.y + 28, DOC.x + 68, DOC.y + 28, '.7'],
      [DOC.x + 12, DOC.y + 44, DOC.x + 68, DOC.y + 44, '.45'],
      [DOC.x + 12, DOC.y + 60, DOC.x + 52, DOC.y + 60, '.3']
    ].forEach(function(l) {
      docG.appendChild(svgEl('line', {
        x1: l[0], y1: l[1], x2: l[2], y2: l[3],
        stroke: 'var(--text-3,#71758A)', 'stroke-width': '1.3', opacity: l[4]
      }));
    });
    // Source badge below page
    docG.appendChild(svgEl('rect', {
      x: DOC.x, y: DOC.y + DOC.h + 6, width: DOC.w, height: 15,
      rx: '3', fill: 'rgba(85,199,232,.10)', stroke: 'rgba(85,199,232,.30)', 'stroke-width': '1'
    }));
    var badgeT = svgEl('text', {
      x: DOC.x + DOC.w / 2, y: DOC.y + DOC.h + 14,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#55C7E8', 'font-size': '9',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '2'
    });
    badgeT.textContent = 'SOURCE';
    docG.appendChild(badgeT);
    // Label below badge
    var docLabel = svgEl('text', {
      x: DOC.x + DOC.w / 2, y: DOC.y + DOC.h + 32,
      'text-anchor': 'middle',
      fill: 'var(--text-2,#A4A9B7)', 'font-size': '13',
      'font-family': 'Space Grotesk,sans-serif', 'font-weight': '600'
    });
    docLabel.textContent = 'Regulatory source';
    docG.appendChild(docLabel);
    svg.appendChild(docG);

    // ── Arrows ──
    ARROWS.forEach(function(a) {
      var g = svgEl('g', { 'data-beat': a.beat });
      g.style.cssText = 'opacity:0;transition:opacity 300ms ease;';
      g.appendChild(svgEl('line', {
        x1: a.x1, y1: ARROW_Y, x2: a.x2 - 10, y2: ARROW_Y,
        stroke: 'var(--border-2,#4B5067)', 'stroke-width': '1.5'
      }));
      var tip = a.x2;
      g.appendChild(svgEl('polygon', {
        points: (tip - 10) + ',' + (ARROW_Y - 5) + ' ' + tip + ',' + ARROW_Y + ' ' + (tip - 10) + ',' + (ARROW_Y + 5),
        fill: 'var(--border-2,#4B5067)'
      }));
      svg.appendChild(g);
    });

    // ── Chips ──
    CHIPS.forEach(function(c) {
      var g = svgEl('g', { 'data-beat': c.beat });
      g.style.cssText = 'opacity:0;transition:opacity 400ms ease;';
      g.appendChild(svgEl('rect', {
        x: c.x, y: CHIP_Y, width: CHIP_W, height: CHIP_H,
        rx: '8', fill: 'var(--surface-1,#191C25)',
        stroke: c.color, 'stroke-width': '1.5'
      }));
      var upper = svgEl('text', {
        x: c.x + CHIP_W / 2, y: CHIP_Y + 22,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: c.color, 'font-size': '9',
        'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '1.5'
      });
      upper.textContent = c.upper;
      g.appendChild(upper);
      var lower = svgEl('text', {
        x: c.x + CHIP_W / 2, y: CHIP_Y + 46,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: 'var(--text-1,#E8E9F0)', 'font-size': '16',
        'font-family': 'Space Grotesk,sans-serif', 'font-weight': '700'
      });
      lower.textContent = c.label;
      g.appendChild(lower);
      svg.appendChild(g);
    });

    container.appendChild(svg);
  }

  function showBeat(beat) {
    var el = container.querySelector('[data-beat="' + beat + '"]');
    if (el) el.style.opacity = '1';
  }

  function showAll() {
    ['doc', 'arrow-1', 'word-0', 'sep-0', 'word-1', 'sep-1', 'word-2', 'sep-2', 'word-3'].forEach(showBeat);
  }

  var anim_steps = [
    { delay: 300,  run: function() { showBeat('doc'); }},
    { delay: 900,  run: function() { showBeat('arrow-1'); }},
    { delay: 1300, run: function() { showBeat('word-0'); }},
    { delay: 1900, run: function() { showBeat('sep-0'); showBeat('word-1'); }},
    { delay: 2600, run: function() { showBeat('sep-1'); showBeat('word-2'); }},
    { delay: 3300, run: function() { showBeat('sep-2'); showBeat('word-3'); }}
  ];

  var tl = createTimeline(anim_steps);

  return {
    play:    function() { buildSVG(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { buildSVG(); tl.reset(); },
    finish:  function() { buildSVG(); showAll(); },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
