// Scene: next-move (Screen 11)
// V26: Decision runway. Three gates, four work lanes. Artefact footer is one panel,
// not 4 equal cards. V26 box rule: the panel is one evidence output boundary.
SceneDirector.register('next-move', function(container, manifest, reduced) {
  var AMBER  = '#F3B34C';
  var ACCENT = '#B44CFF';
  var GREEN  = '#58C994';
  var CYAN   = '#55C7E8';

  var GATES = [
    { label: 'GATE 1', heading: 'Frame the evidence',  color: AMBER  },
    { label: 'GATE 2', heading: 'Prove on real work',  color: ACCENT },
    { label: 'GATE 3', heading: 'Decide the next move', color: GREEN }
  ];

  var LANES = [
    { label: 'Business and value',          color: CYAN   },
    { label: 'Process and use case',        color: ACCENT },
    { label: 'Data, platform and controls', color: GREEN  },
    { label: 'People and adoption',         color: AMBER  }
  ];

  // Pills[lane][gate]
  var PILLS = [
    ['Evidence standard', 'Proof KPIs',     'Evidence pack'     ],
    ['Process map',       'AI path',         'Quality assessment'],
    ['System scope',      'Integration log', 'Architecture view' ],
    ['Role assumptions',  'Adoption log',    'Change plan'       ]
  ];

  var ARTEFACTS = [
    { label: 'Proof contract',           color: CYAN,   icon: 'ti-file-check'        },
    { label: 'Architecture view',        color: ACCENT, icon: 'ti-sitemap'           },
    { label: 'Economics view',           color: GREEN,  icon: 'ti-chart-bar'         },
    { label: 'Next-step recommendation', color: AMBER,  icon: 'ti-arrow-right-circle'}
  ];

  var LABEL_W = '140px';

  var _timers = [];

  function _t(fn, delay) {
    var id = setTimeout(fn, delay);
    _timers.push(id);
    return id;
  }

  function rgba(hex, a) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function q(id) { return container.querySelector('#' + id); }

  function show(id) {
    var el = q(id);
    if (el) el.style.opacity = '1';
  }

  function stamp(id) {
    var el = q(id);
    if (el) el.style.opacity = '1';
  }

  // Reveal all 4 pills for one gate column, staggered by 100ms each
  function showGate(gi) {
    for (var li = 0; li < 4; li++) {
      (function(laneIdx, gateIdx) {
        _t(function() { show('nm-pill-' + laneIdx + '-' + gateIdx); }, laneIdx * 100);
      })(li, gi);
    }
  }

  function showAll() {
    show('nm-hdr');
    for (var i = 0; i < 4; i++) { show('nm-lane-' + i); }
    show('nm-div1');
    show('nm-div2');
    for (var j = 0; j < 4; j++) {
      for (var k = 0; k < 3; k++) { show('nm-pill-' + j + '-' + k); }
    }
    show('nm-footer');
    for (var m = 0; m < 4; m++) { stamp('nm-art-' + m); }
  }

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;gap:0;'
      + 'overflow:hidden;box-sizing:border-box;';

    // ── GATE HEADER ──
    var hdr = document.createElement('div');
    hdr.id = 'nm-hdr';
    hdr.style.cssText = 'display:flex;flex-direction:row;flex-shrink:0;opacity:0;transition:opacity .4s;';

    // Spacer to align with lane label column
    var spacer = document.createElement('div');
    spacer.style.cssText = 'width:' + LABEL_W + ';flex-shrink:0;';
    hdr.appendChild(spacer);

    GATES.forEach(function(g) {
      var col = document.createElement('div');
      col.style.cssText = 'flex:1;padding:8px 12px 6px;border-bottom:3px solid ' + g.color + ';';
      col.innerHTML =
        '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;'
        + 'letter-spacing:.12em;text-transform:uppercase;color:' + g.color + '">' + g.label + '</div>'
        + '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:700;'
        + 'color:var(--text-1);margin-top:2px;line-height:1.2">' + g.heading + '</div>';
      hdr.appendChild(col);
    });

    root.appendChild(hdr);

    // ── RUNWAY ──
    var runway = document.createElement('div');
    runway.id = 'nm-runway';
    runway.style.cssText = 'flex:1;position:relative;display:flex;flex-direction:column;min-height:0;';

    // Vertical gate dividers (absolutely positioned, animate in)
    var divLayer = document.createElement('div');
    divLayer.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:2;';

    var div1 = document.createElement('div');
    div1.id = 'nm-div1';
    div1.style.cssText = 'position:absolute;top:0;bottom:0;'
      + 'left:calc(' + LABEL_W + ' + (100% - ' + LABEL_W + ') / 3);'
      + 'width:0;border-left:1px dashed var(--border-2);opacity:0;transition:opacity .4s;';

    var div2 = document.createElement('div');
    div2.id = 'nm-div2';
    div2.style.cssText = 'position:absolute;top:0;bottom:0;'
      + 'left:calc(' + LABEL_W + ' + (100% - ' + LABEL_W + ') * 2 / 3);'
      + 'width:0;border-left:1px dashed var(--border-2);opacity:0;transition:opacity .4s;';

    divLayer.appendChild(div1);
    divLayer.appendChild(div2);
    runway.appendChild(divLayer);

    // Four work lanes
    LANES.forEach(function(lane, li) {
      var row = document.createElement('div');
      row.id = 'nm-lane-' + li;
      row.style.cssText = 'flex:1;display:flex;flex-direction:row;align-items:center;'
        + 'border-bottom:1px dashed ' + rgba(lane.color, 0.35) + ';'
        + 'background:' + rgba(lane.color, 0.04) + ';'
        + 'opacity:0;transition:opacity .3s;min-height:0;position:relative;z-index:1;';

      // Lane label
      var lbl = document.createElement('div');
      lbl.style.cssText = 'flex-shrink:0;width:' + LABEL_W + ';padding:0 8px 0 14px;'
        + 'font-family:\'Inter\',sans-serif;font-size:14px;font-weight:600;color:' + lane.color + ';'
        + 'line-height:1.3;';
      lbl.textContent = lane.label;
      row.appendChild(lbl);

      // Three pill cells, one per gate column
      for (var gi = 0; gi < 3; gi++) {
        (function(gateIdx) {
          var cell = document.createElement('div');
          cell.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;';

          var pill = document.createElement('div');
          pill.id = 'nm-pill-' + li + '-' + gateIdx;
          pill.style.cssText = 'font-size:11px;font-family:\'Inter\',sans-serif;color:var(--text-2);'
            + 'background:var(--surface-2,#1E2433);border:1px solid ' + lane.color + ';border-radius:4px;'
            + 'padding:3px 8px;white-space:nowrap;opacity:0;transition:opacity .3s;';
          pill.textContent = PILLS[li][gateIdx];

          cell.appendChild(pill);
          row.appendChild(cell);
        })(gi);
      }

      runway.appendChild(row);
    });

    root.appendChild(runway);

    // ── ARTEFACTS FOOTER: one evidence output panel, not 4 equal cards ──
    // V26 box rule: one panel = one evidence record boundary. Items share dividers.
    var footer = document.createElement('div');
    footer.id = 'nm-footer';
    footer.style.cssText = 'flex-shrink:0;padding:8px 14px;opacity:0;transition:opacity .4s;box-sizing:border-box;';

    var artPanel = document.createElement('div');
    artPanel.style.cssText = 'display:flex;flex-direction:row;height:80px;'
      + 'border:1px solid rgba(88,201,148,0.4);border-radius:4px;overflow:hidden;';

    ARTEFACTS.forEach(function(a, ai) {
      var item = document.createElement('div');
      item.id = 'nm-art-' + ai;
      item.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:center;gap:4px;'
        + 'padding:8px 12px;'
        + (ai > 0 ? 'border-left:1px solid rgba(88,201,148,0.18);' : '')
        + 'background:' + rgba(a.color, 0.04) + ';'
        + 'opacity:0;transition:opacity .3s;';
      item.innerHTML =
        '<i class="ti ' + a.icon + '" style="color:' + a.color + ';font-size:15px;"></i>'
        + '<div style="font-size:14px;font-weight:700;font-family:\'Space Grotesk\',sans-serif;'
        + 'color:' + a.color + ';line-height:1.3">' + a.label + '</div>';
      artPanel.appendChild(item);
    });

    footer.appendChild(artPanel);
    root.appendChild(footer);
    container.appendChild(root);
  }

  var steps = [
    // 1. Gate headers appear
    { delay: 200,  run: function() { show('nm-hdr'); }},
    // 2. Runway lanes appear (all 4 instantly)
    { delay: 600,  run: function() { for (var i = 0; i < 4; i++) { show('nm-lane-' + i); } }},
    // 3. Gate dividers draw
    { delay: 1000, run: function() { show('nm-div1'); show('nm-div2'); }},
    // 4. Gate 1 work items (staggered 100ms per lane)
    { delay: 1600, run: function() { showGate(0); }},
    // 5. Gate 2 work items
    { delay: 2400, run: function() { showGate(1); }},
    // 6. Gate 3 work items
    { delay: 3200, run: function() { showGate(2); }},
    // 7. Artefact footer appears
    { delay: 4000, run: function() { show('nm-footer'); }},
    // 8. All artefacts stamp in sequentially via _t so createTimeline does not block
    { delay: 4200, run: function() {
      stamp('nm-art-0');
      _t(function() { stamp('nm-art-1'); }, 400);
      _t(function() { stamp('nm-art-2'); }, 800);
      _t(function() {
        stamp('nm-art-3');
        _t(function() {
          container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
        }, 500);
      }, 1200);
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showAll(); } else { tl.play(); }
    },
    pause:  tl.pause,
    resume: tl.resume,
    reset: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      tl.reset();
    },
    finish: function() {
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showAll();
    },
    getAccessibleSummary: function() {
      return 'Three decision gates -- Frame the evidence, Prove on real work, Decide the next move -- are shown as a runway with four work lanes. Each gate contains work items across business, process, data and people dimensions. Four artefacts stamp in at the end: proof contract, architecture view, economics view, and next-step recommendation.';
    },
    destroy: function() {
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
      tl.destroy();
    }
  };
});
