// -- APPENDIX MODULES -- v7 --
// Renders the four-module appendix from NFR_APPENDIX into the section shells in
// pitch.html: the index (#appendix, four doors) and one page per question
// (section[data-apx-page]). Each page gets its chrome (module, code, kind, claim status,
// index, previous, next, main story), one main visual, a decision implication and
// optional detail. The V3 calculator draws from UnitEconomics.
// Exposes window.AppendixNav: go(id), index(), module(key), step(+1|-1), isPage(sec).

(function() {
  'use strict';

  function A() { return window.NFR_APPENDIX; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function icon(name) { var i = el('i', 'ti ' + name); i.setAttribute('aria-hidden', 'true'); return i; }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function(k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function list(items, cls) {
    var ul = el('ul', cls || 'apx-list');
    items.forEach(function(t) { ul.appendChild(el('li', null, t)); });
    return ul;
  }
  function button(label, cls, onClick, ic, after) {
    var b = el('button', 'apx-btn' + (cls ? ' ' + cls : ''));
    b.type = 'button';
    if (ic && !after) b.appendChild(icon(ic));
    b.appendChild(el('span', null, label));
    if (ic && after) b.appendChild(icon(ic));
    b.addEventListener('click', function(e) { e.stopPropagation(); onClick(); });
    return b;
  }

  // ── Lookups ──
  function findPage(id) {
    var hit = null;
    A().modules.forEach(function(m) { m.pages.forEach(function(p, i) { if (p.id === id || p.code === id) hit = { module: m, page: p, index: i }; }); });
    return hit;
  }
  function moduleByKey(key) { return A().modules.filter(function(m) { return m.key === String(key) || m.id === key; })[0] || null; }
  function goToSection(id) { if (typeof goToId === 'function') goToId(id); }

  // ── Visual renderers: one per visual.type ──
  var V = {};

  // V1: a two-by-two with four zones and plotted candidate journeys
  V.matrix = function(c, v) {
    var wrap = el('div', 'apx-matrix');
    var plot = el('div', 'apx-mx-plot');
    v.zones.forEach(function(z) {
      var zone = el('div', 'apx-mx-zone apx-mx-' + z.pos + ' is-' + z.id);
      zone.appendChild(el('span', 'apx-mx-zone-label', z.label));
      plot.appendChild(zone);
    });
    v.items.forEach(function(it) {
      var dot = el('div', 'apx-mx-dot' + (it.pick ? ' is-pick' : ''));
      dot.style.left = it.x + '%';
      dot.style.top = (100 - it.y) + '%';
      dot.appendChild(el('i'));
      dot.appendChild(el('span', null, it.label));
      plot.appendChild(dot);
    });
    wrap.appendChild(el('div', 'apx-mx-y', v.y));
    wrap.appendChild(plot);
    wrap.appendChild(el('div', 'apx-mx-x', v.x + ' →'));
    c.appendChild(wrap);
  };

  // V2: value tree, root to three branches
  V.tree = function(c, v) {
    var t = el('div', 'apx-tree');
    if (v.chain) {
      var ch = el('ol', 'apx-tree-chain');
      v.chain.forEach(function(x) { ch.appendChild(el('li', null, x)); });
      t.appendChild(ch);
    }
    t.appendChild(el('div', 'apx-tree-root', v.root));
    var row = el('div', 'apx-tree-branches');
    v.branches.forEach(function(b) {
      var col = el('div', 'apx-tree-branch is-' + b.id);
      var h = el('div', 'apx-tree-head');
      h.appendChild(icon(b.icon));
      h.appendChild(el('span', null, b.label));
      col.appendChild(h);
      col.appendChild(list(b.items, 'apx-tree-leaves'));
      row.appendChild(col);
    });
    t.appendChild(row);
    c.appendChild(t);
  };

  // V4: stacked one-off cost per journey, shared foundation falling away
  V.reuse = function(c, v) {
    var max = 0;
    v.journeys.forEach(function(j) { var s = 0; v.bands.forEach(function(b) { s += j[b.id]; }); max = Math.max(max, s); });
    var wrap = el('div', 'apx-reuse');
    var legend = el('div', 'apx-legend');
    v.bands.forEach(function(b) { var l = el('span', 'apx-leg is-' + b.id); l.appendChild(el('i')); l.appendChild(el('span', null, b.label)); legend.appendChild(l); });
    wrap.appendChild(legend);
    var bars = el('div', 'apx-reuse-bars');
    bars.setAttribute('role', 'img');
    bars.setAttribute('aria-label', 'One-off cost per journey, ' + v.unit + ': ' + v.journeys.map(function(j) { return j.label + ' ' + v.bands.reduce(function(s, b) { return s + j[b.id]; }, 0); }).join(', '));
    v.journeys.forEach(function(j) {
      var total = v.bands.reduce(function(s, b) { return s + j[b.id]; }, 0);
      var col = el('div', 'apx-reuse-col');
      col.appendChild(el('div', 'apx-reuse-total', String(total)));
      var stack = el('div', 'apx-reuse-stack');
      stack.style.height = (total / max * 100) + '%';
      v.bands.slice().reverse().forEach(function(b) {
        var seg = el('div', 'apx-reuse-seg is-' + b.id);
        seg.style.flexGrow = String(j[b.id]);
        seg.title = b.label + ': ' + j[b.id];
        stack.appendChild(seg);
      });
      col.appendChild(stack);
      col.appendChild(el('div', 'apx-reuse-label', j.label));
      bars.appendChild(col);
    });
    wrap.appendChild(bars);
    wrap.appendChild(el('div', 'apx-note', v.unit + '. Synthetic and illustrative.'));
    c.appendChild(wrap);
  };

  // V5: two cost stacks, one-off and recurring
  V.tco = function(c, v) {
    var wrap = el('div', 'apx-tco');
    v.stacks.forEach(function(s) {
      var col = el('div', 'apx-tco-col');
      col.appendChild(el('div', 'apx-tco-title', s.label));
      var stack = el('div', 'apx-tco-stack');
      s.items.forEach(function(it) {
        var b = el('div', 'apx-tco-item' + (it.highlight ? ' is-highlight' : ''), it.label);
        b.style.flexGrow = String(it.w);
        stack.appendChild(b);
      });
      col.appendChild(stack);
      wrap.appendChild(col);
    });
    c.appendChild(wrap);
    c.appendChild(el('div', 'apx-note', v.note));
  };

  // C1: three columns
  V.columns = function(c, v) {
    var cols = el('div', 'apx-cols');
    v.columns.forEach(function(col) {
      var box = el('div', 'apx-col is-' + col.id);
      var t = el('div', 'apx-col-title');
      t.appendChild(icon(col.icon));
      t.appendChild(el('span', null, col.label));
      box.appendChild(t);
      box.appendChild(list(col.items));
      cols.appendChild(box);
    });
    c.appendChild(cols);
    if (v.principles) c.appendChild(chips(v.principlesTitle, v.principles, 'is-strip'));
  };

  // C2, D2: a matrix with a corner label, column heads and row labels
  V.grid = function(c, v) {
    var table = el('table', 'apx-grid');
    var thead = el('thead');
    var hr = el('tr');
    hr.appendChild(el('th', 'apx-grid-corner', v.corner));
    v.columns.forEach(function(h, i) {
      var th = el('th', null, h);
      if (v.products) th.appendChild(el('span', 'apx-grid-sub', v.products[i]));
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tb = el('tbody');
    v.rows.forEach(function(r) {
      var tr = el('tr');
      tr.appendChild(el('th', 'apx-grid-row', r[0]));
      r.slice(1).forEach(function(cell) { tr.appendChild(el('td', null, cell)); });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    c.appendChild(table);
  };

  // C3: stages, promotion gates and retirement
  V.lifecycle = function(c, v) {
    var row = el('ol', 'apx-stages' + (v.stages.length === 5 ? ' is-five' : ''));
    v.stages.forEach(function(s, i) {
      var li = el('li', 'apx-stage');
      li.appendChild(el('span', 'apx-stage-num', String(i + 1)));
      li.appendChild(el('div', 'apx-stage-label', s.label));
      li.appendChild(list(s.points));
      row.appendChild(li);
    });
    c.appendChild(row);
    c.appendChild(chips(v.gatesTitle, v.gates, 'is-gate'));
    c.appendChild(chips(v.retireTitle, v.retire, 'is-retire'));
  };
  function chips(title, items, cls) {
    var w = el('div', 'apx-chips ' + (cls || ''));
    w.appendChild(el('span', 'apx-chips-title', title));
    items.forEach(function(t) { w.appendChild(el('span', 'apx-chip', t)); });
    return w;
  }

  // C4, D8: numbered flow with human and record steps marked, and a control strip
  V.flow = function(c, v) {
    var ol = el('ol', 'apx-flow' + (v.steps.length > 7 ? ' is-long' : ''));
    v.steps.forEach(function(s, i) {
      var li = el('li', 'apx-flow-step' + (v.human.indexOf(i) >= 0 ? ' is-human' : '') + (v.record.indexOf(i) >= 0 ? ' is-record' : ''));
      li.appendChild(el('span', 'apx-flow-num', String(i + 1)));
      li.appendChild(el('span', 'apx-flow-text', s));
      ol.appendChild(li);
    });
    c.appendChild(ol);
    if (v.strip && v.strip.length) c.appendChild(chips(v.stripTitle || 'Controls', v.strip, 'is-strip'));
  };

  // C5: monitoring groups and incident ownership
  V.groups = function(c, v) {
    var g = el('div', 'apx-groups');
    v.groups.forEach(function(gr) {
      var box = el('div', 'apx-group-box');
      var t = el('div', 'apx-col-title');
      t.appendChild(icon(gr.icon));
      t.appendChild(el('span', null, gr.label));
      box.appendChild(t);
      box.appendChild(list(gr.items));
      g.appendChild(box);
    });
    c.appendChild(g);
    if (v.owners) {
      var o = el('div', 'apx-owners');
      o.appendChild(el('span', 'apx-chips-title', v.ownersTitle));
      v.owners.forEach(function(r) { var it = el('div', 'apx-owner'); it.appendChild(el('b', null, r[0])); it.appendChild(el('span', null, r[1])); o.appendChild(it); });
      c.appendChild(o);
    }
  };

  // D1: the Workspace in the middle of the authoritative systems
  V.landscape = function(c, v) {
    var wrap = el('div', 'apx-land');
    var legend = el('div', 'apx-legend');
    Object.keys(v.patterns).forEach(function(k) { var l = el('span', 'apx-leg is-' + k); l.appendChild(el('i')); l.appendChild(el('span', null, v.patterns[k])); legend.appendChild(l); });
    wrap.appendChild(legend);
    var grid = el('div', 'apx-land-grid');
    var hub = el('div', 'apx-land-hub');
    hub.appendChild(el('span', 'apx-land-mark'));
    hub.appendChild(el('span', null, v.hub));
    hub.appendChild(el('span', 'apx-land-hub-note', 'Orchestrates the work; holds no master record'));
    v.systems.forEach(function(s, i) {
      if (i === 4) grid.appendChild(hub);
      var card = el('div', 'apx-land-sys');
      card.appendChild(el('div', 'apx-land-name', s.label));
      var tags = el('div', 'apx-land-tags');
      s.p.forEach(function(k) { tags.appendChild(el('span', 'apx-tag is-' + k, v.patterns[k])); });
      card.appendChild(tags);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    c.appendChild(wrap);
  };

  // D3: the case envelope and the route it travels
  V.envelope = function(c, v) {
    var wrap = el('div', 'apx-env');
    var card = el('div', 'apx-env-card');
    card.appendChild(el('div', 'apx-env-title', v.title));
    var grid = el('div', 'apx-env-groups');
    v.groups.forEach(function(g) {
      var box = el('div', 'apx-env-group');
      box.appendChild(el('div', 'apx-env-k', g.label));
      box.appendChild(list(g.items));
      grid.appendChild(box);
    });
    card.appendChild(grid);
    wrap.appendChild(card);
    var route = el('ol', 'apx-env-route');
    v.route.forEach(function(r) { route.appendChild(el('li', null, r)); });
    wrap.appendChild(route);
    c.appendChild(wrap);
  };

  // D4: when a graph helps and when it does not
  V.decision = function(c, v) {
    var wrap = el('div', 'apx-decide');
    [['yes', 'ti-circle-check'], ['no', 'ti-circle-x']].forEach(function(k) {
      var d = v[k[0]];
      var box = el('div', 'apx-decide-col is-' + k[0]);
      var t = el('div', 'apx-col-title');
      t.appendChild(icon(k[1]));
      t.appendChild(el('span', null, d.label));
      box.appendChild(t);
      box.appendChild(list(d.items));
      wrap.appendChild(box);
    });
    c.appendChild(wrap);
  };

  // D5: a readable domain graph, nodes and named relationships
  V.graph = function(c, v) {
    var W = v.w || 1000, H = v.h || 440, NW = 132, NH = 34;
    var byId = {};
    v.nodes.forEach(function(nd) { byId[nd.id] = nd; });
    var g = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'apx-graph', role: 'img', 'aria-label': 'NFR knowledge graph: ' + v.edges.map(function(e) { return byId[e[0]].label + ' ' + e[2].replace(/_/g, ' ') + ' ' + byId[e[1]].label; }).join('; ') });
    v.edges.forEach(function(e) {
      var a = byId[e[0]], b = byId[e[1]];
      g.appendChild(svg('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'class': 'apx-edge' }));
      // Horizontal: label above the nodes; vertical: beside the line; diagonal: at the middle
      var dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
      var lx = (a.x + b.x) / 2, ly = (a.y + b.y) / 2 - 4, anchor = 'middle';
      if (dy < 4) ly = a.y - NH / 2 - 6;
      else if (dx < 4) { lx = a.x + 8; ly = (a.y + b.y) / 2 + 4; anchor = 'start'; }
      var t = svg('text', { x: lx, y: ly, 'class': 'apx-edge-label', 'text-anchor': anchor });
      t.textContent = e[2];
      g.appendChild(t);
    });
    v.nodes.forEach(function(nd) {
      var grp = svg('g', { 'class': 'apx-node is-' + nd.g });
      grp.appendChild(svg('rect', { x: nd.x - NW / 2, y: nd.y - NH / 2, width: NW, height: NH, rx: 8 }));
      var t = svg('text', { x: nd.x, y: nd.y + 5, 'text-anchor': 'middle' });
      t.textContent = nd.label;
      grp.appendChild(t);
      g.appendChild(grp);
    });
    c.appendChild(g);
    c.appendChild(chips('Every node and relationship carries', v.carries, 'is-strip'));
  };

  // D6: incremental phases and quality controls
  V.phases = function(c, v) {
    var row = el('ol', 'apx-stages' + (v.phases.length === 5 ? ' is-five' : ''));
    v.phases.forEach(function(s, i) {
      var li = el('li', 'apx-stage');
      li.appendChild(el('span', 'apx-stage-num', 'Phase ' + (i + 1)));
      li.appendChild(el('div', 'apx-stage-label', s.label));
      li.appendChild(list(s.points));
      row.appendChild(li);
    });
    c.appendChild(row);
    c.appendChild(chips(v.qualityTitle, v.quality, 'is-gate'));
  };

  // D7: the question-to-answer pipeline, the schema and the retrieval modes
  V.pipeline = function(c, v) {
    var ol = el('ol', 'apx-pipe');
    v.steps.forEach(function(s, i) {
      var li = el('li', 'apx-pipe-step' + (v.modelSteps.indexOf(i) >= 0 ? ' is-model' : ''));
      li.appendChild(el('span', null, s));
      ol.appendChild(li);
    });
    c.appendChild(ol);
    var leg = el('div', 'apx-legend');
    var a = el('span', 'apx-leg is-model'); a.appendChild(el('i')); a.appendChild(el('span', null, 'Model helps interpret'));
    var b = el('span', 'apx-leg is-service'); b.appendChild(el('i')); b.appendChild(el('span', null, 'Governed services and rules'));
    leg.appendChild(a); leg.appendChild(b);
    c.appendChild(leg);
    var two = el('div', 'apx-pipe-boxes');
    var s1 = el('div', 'apx-group-box');
    s1.appendChild(el('div', 'apx-col-title', v.schemaTitle));
    s1.appendChild(list(v.schema, 'apx-list apx-list-2'));
    var s2 = el('div', 'apx-group-box');
    s2.appendChild(el('div', 'apx-col-title', v.modesTitle));
    var dl = el('dl', 'apx-modes');
    v.modes.forEach(function(m) { dl.appendChild(el('dt', null, m[0])); dl.appendChild(el('dd', null, m[1])); });
    s2.appendChild(dl);
    two.appendChild(s1);
    two.appendChild(s2);
    c.appendChild(two);
  };

  // P1: four horizontal layers
  V.layers = function(c, v) {
    var stack = el('div', 'apx-layers');
    v.layers.forEach(function(layer, i) {
      var row = el('div', 'apx-layer apx-layer-' + (i + 1));
      var head = el('div', 'apx-layer-head');
      head.appendChild(el('span', 'apx-layer-num', String(i + 1)));
      var t = el('div');
      t.appendChild(el('div', 'apx-layer-label', layer.label));
      t.appendChild(el('div', 'apx-layer-note', layer.note));
      head.appendChild(t);
      row.appendChild(head);
      var pills = el('div', 'apx-pills');
      layer.items.forEach(function(it) { pills.appendChild(el('span', 'apx-pill', it)); });
      row.appendChild(pills);
      stack.appendChild(row);
    });
    c.appendChild(stack);
  };

  // P2: three bands, reusable to journey-specific
  V.bands = function(c, v) {
    var w = el('div', 'apx-bands');
    v.bands.forEach(function(b) {
      var row = el('div', 'apx-band is-' + b.id);
      var lab = el('div', 'apx-band-label', b.label);
      if (b.owner) lab.appendChild(el('span', 'apx-band-owner', 'Owner: ' + b.owner));
      row.appendChild(lab);
      var pills = el('div', 'apx-pills');
      b.items.forEach(function(it) { pills.appendChild(el('span', 'apx-pill', it)); });
      row.appendChild(pills);
      w.appendChild(row);
    });
    c.appendChild(w);
  };

  // P3: three lanes by four steps, with the gates between
  V.lanes = function(c, v) {
    var grid = el('div', 'apx-lanes');
    grid.appendChild(el('div', 'apx-lanes-corner'));
    if (v.heads) {
      grid.classList.add('is-three');
      v.heads.forEach(function(hd) { var h = el('div', 'apx-lanes-gate'); h.appendChild(el('span', null, hd)); grid.appendChild(h); });
    } else {
      v.gates.forEach(function(g, i) { var h = el('div', 'apx-lanes-gate'); h.appendChild(el('span', 'apx-gate-num', 'Gate ' + (i + 1))); h.appendChild(el('span', null, g)); grid.appendChild(h); });
    }
    v.lanes.forEach(function(l) {
      grid.appendChild(el('div', 'apx-lanes-label', l.label));
      l.steps.forEach(function(s) { grid.appendChild(el('div', 'apx-lanes-cell', s)); });
    });
    c.appendChild(grid);
    if (v.heads && v.gates) c.appendChild(chips(v.gatesTitle || 'Gates', v.gates, 'is-gate'));
    if (v.entry) c.appendChild(chips(v.entryTitle || 'Entry conditions', v.entry, 'is-strip'));
  };

  // P4: ownership by role and type
  V.raci = function(c, v) {
    var table = el('table', 'apx-grid apx-raci');
    var thead = el('thead');
    var hr = el('tr');
    hr.appendChild(el('th', 'apx-grid-corner', 'Role'));
    v.columns.forEach(function(h) { hr.appendChild(el('th', null, h)); });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tb = el('tbody');
    v.rows.forEach(function(r) {
      var tr = el('tr');
      tr.appendChild(el('th', 'apx-grid-row', r[0]));
      r[1].forEach(function(on, i) {
        var td = el('td', on ? 'is-on' : 'is-off');
        if (on) { td.appendChild(icon('ti-circle-check')); td.setAttribute('aria-label', v.columns[i]); }
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    c.appendChild(table);
  };

  // P5: four rising waves and the criteria to move on
  V.waves = function(c, v) {
    var row = el('ol', 'apx-waves' + (v.waves.length === 5 ? ' is-five' : ''));
    v.waves.forEach(function(w, i) {
      var li = el('li', 'apx-wave');
      li.style.setProperty('--apx-wave', String(i));
      li.appendChild(el('span', 'apx-stage-num', 'Wave ' + (i + 1)));
      li.appendChild(el('div', 'apx-stage-label', w.label));
      li.appendChild(el('div', 'apx-wave-text', w.text));
      row.appendChild(li);
    });
    c.appendChild(row);
    c.appendChild(chips(v.criteriaTitle, v.criteria, 'is-gate'));
  };

  // M2: three kinds of step, and a worked example assembled from them
  V.methods = function(c, v) {
    var cols = el('div', 'apx-cols');
    var LBL = {};
    v.types.forEach(function(t) {
      LBL[t.id] = t.label;
      var box = el('div', 'apx-col is-' + (t.id === 'model' ? 'ai' : t.id === 'rule' ? 'rules' : 'human'));
      box.appendChild(el('div', 'apx-col-title', t.label));
      var pills = el('div', 'apx-pills');
      t.items.forEach(function(it) { pills.appendChild(el('span', 'apx-pill', it)); });
      box.appendChild(pills);
      cols.appendChild(box);
    });
    c.appendChild(cols);
    c.appendChild(el('div', 'apx-sub-title', v.exampleTitle));
    var ol = el('ol', 'apx-chain');
    v.example.forEach(function(s, i) {
      var li = el('li', 'apx-chain-step is-' + s.kind);
      li.appendChild(el('span', 'apx-chain-kind', LBL[s.kind] || s.kind));
      li.appendChild(el('span', 'apx-chain-label', s.label));
      ol.appendChild(li);
    });
    c.appendChild(ol);
  };

  // M3: method pools, each a short chain of steps
  V.pools = function(c, v) {
    var grid = el('div', 'apx-pools');
    v.pools.forEach(function(pl) {
      var box = el('div', 'apx-pool' + (pl.live ? ' is-live' : ''));
      box.appendChild(el('div', 'apx-col-title', pl.label));
      box.appendChild(el('div', 'apx-pool-purpose', pl.purpose));
      var chain = el('div', 'apx-pool-steps');
      pl.steps.forEach(function(st, i) {
        chain.appendChild(el('span', 'apx-pill', st));
        if (i < pl.steps.length - 1) chain.appendChild(icon('ti-arrow-right'));
      });
      box.appendChild(chain);
      if (pl.live) box.appendChild(el('div', 'apx-pool-live', 'Shown in the live product'));
      grid.appendChild(box);
    });
    c.appendChild(grid);
  };

  // S1: five weeks, three phases, one gate, and the team
  V.sprint = function(c, v) {
    var grid = el('div', 'apx-sprint');
    grid.style.gridTemplateColumns = 'repeat(' + v.weeks.length + ', minmax(0, 1fr))';
    v.weeks.forEach(function(w) { grid.appendChild(el('div', 'apx-sprint-week', w)); });
    v.phases.forEach(function(ph) {
      var b = el('div', 'apx-sprint-phase' + (ph.gate ? ' has-gate' : ''));
      b.style.gridColumn = (ph.from + 1) + ' / ' + (ph.to + 2);
      b.appendChild(el('div', 'apx-col-title', ph.label));
      b.appendChild(list(ph.items));
      var out = el('div', 'apx-sprint-out');
      out.appendChild(el('span', 'apx-chips-title', 'Output'));
      out.appendChild(el('span', null, ph.output));
      b.appendChild(out);
      if (ph.gate) { var gt = el('div', 'apx-sprint-gate'); gt.appendChild(icon('ti-diamond')); gt.appendChild(el('span', null, ph.gate)); b.appendChild(gt); }
      grid.appendChild(b);
    });
    c.appendChild(grid);
    var team = el('div', 'apx-owners');
    team.appendChild(el('span', 'apx-chips-title', v.teamTitle));
    v.team.forEach(function(r) { var it = el('div', 'apx-owner'); it.appendChild(el('b', null, r[0])); it.appendChild(el('span', null, r[1])); team.appendChild(it); });
    c.appendChild(team);
  };

  // S5: delivery options side by side
  V.options = function(c, v) {
    var cols = el('div', 'apx-cols');
    v.options.forEach(function(o, i) {
      var box = el('div', 'apx-col apx-option' + (i === 0 ? ' is-first' : ''));
      box.appendChild(el('div', 'apx-col-title', o.label));
      box.appendChild(el('div', 'apx-pool-purpose', o.sub));
      box.appendChild(list(o.items));
      cols.appendChild(box);
    });
    c.appendChild(cols);
  };

  // ── V3: the unit-economics calculator ──
  var CALC_FIELDS = [
    { k: 'cases', label: 'Eligible cases per year', min: 50, max: 3000, step: 50, fmt: function(v) { return String(v); } },
    { k: 'adoption', label: 'Adoption', min: 0, max: 1, step: 0.05, fmt: pct },
    { k: 'addressable', label: 'Addressable share of work', min: 0, max: 1, step: 0.05, fmt: pct },
    { k: 'efficiency', label: 'Realised efficiency', min: 0, max: 1, step: 0.05, fmt: pct },
    { k: 'exceptionRate', label: 'Exception rate', min: 0, max: 0.6, step: 0.05, fmt: pct },
    { k: 'runtimeCost', label: 'Model and runtime per case', min: 0, max: 120, step: 1, fmt: eur },
    { k: 'supportCost', label: 'Support and control per case', min: 0, max: 150, step: 1, fmt: eur },
    { k: 'operatingBenefit', label: 'Operating benefit per year', min: 0, max: 300000, step: 5000, fmt: money },
    { k: 'oneOff', label: 'One-off delivery cost', min: 50000, max: 2000000, step: 25000, fmt: money }
  ];
  function pct(v) { return Math.round(v * 100) + ' percent'; }
  function eur(v) { return 'EUR ' + Math.round(v); }
  function money(v) { return window.UnitEconomics.money(v); }
  function hours(v) { return Math.round(v).toLocaleString('en-GB') + ' h'; }

  V.calculator = function(c) {
    var U = window.UnitEconomics;
    if (!U) { c.appendChild(el('p', 'apx-note', 'The calculator could not load.')); return; }
    var state = JSON.parse(JSON.stringify(U.DEFAULTS));
    var wrap = el('div', 'apx-calc');
    wrap.setAttribute('data-calc', '');
    var inputs = el('div', 'apx-calc-inputs');
    var outputs = el('div', 'apx-calc-out');
    wrap.appendChild(inputs);
    wrap.appendChild(outputs);
    c.appendChild(wrap);
    var tab = 'waterfall';

    CALC_FIELDS.forEach(function(f) {
      var row = el('label', 'apx-calc-row');
      var top = el('span', 'apx-calc-top');
      top.appendChild(el('span', 'apx-calc-label', f.label));
      var val = el('span', 'apx-calc-val');
      top.appendChild(val);
      row.appendChild(top);
      var r = el('input');
      r.type = 'range';
      r.min = f.min; r.max = f.max; r.step = f.step;
      r.value = state[f.k];
      r.setAttribute('data-k', f.k);
      r.setAttribute('aria-label', f.label);
      r.addEventListener('input', function() { state[f.k] = Number(r.value); draw(); });
      r.addEventListener('keydown', function(e) { e.stopPropagation(); });
      row.appendChild(r);
      inputs.appendChild(row);
      f.valEl = val;
      f.input = r;
    });
    // Roles, rates and retained judgement: progressive detail
    var roles = el('details', 'apx-calc-roles');
    roles.appendChild(el('summary', null, 'Roles, hours and rates'));
    var rt = el('table', 'apx-calc-table');
    var head = el('tr');
    ['Role', 'Hours per case', 'EUR per hour'].forEach(function(h) { head.appendChild(el('th', null, h)); });
    rt.appendChild(head);
    state.roles.forEach(function(role, i) {
      var tr = el('tr');
      tr.appendChild(el('td', null, role.label));
      ['hours', 'rate'].forEach(function(k) {
        var td = el('td');
        var inp = el('input');
        inp.type = 'number'; inp.min = 0; inp.step = k === 'hours' ? 0.5 : 5; inp.value = role[k];
        inp.setAttribute('aria-label', role.label + ' ' + (k === 'hours' ? 'hours per case' : 'EUR per hour'));
        inp.addEventListener('input', function() { state.roles[i][k] = Number(inp.value); draw(); });
        inp.addEventListener('keydown', function(e) { e.stopPropagation(); });
        td.appendChild(inp);
        tr.appendChild(td);
      });
      rt.appendChild(tr);
    });
    var jt = el('tr');
    jt.appendChild(el('td', null, 'Retained judgement (risk manager)'));
    var jtd = el('td');
    var jin = el('input');
    jin.type = 'number'; jin.min = 0; jin.step = 0.5; jin.value = state.judgementHours;
    jin.setAttribute('aria-label', 'Retained judgement hours per case');
    jin.addEventListener('input', function() { state.judgementHours = Number(jin.value); draw(); });
    jin.addEventListener('keydown', function(e) { e.stopPropagation(); });
    jtd.appendChild(jin);
    jt.appendChild(jtd);
    jt.appendChild(el('td', null, 'hours, kept with the professional'));
    rt.appendChild(jt);
    roles.appendChild(rt);
    inputs.appendChild(roles);
    inputs.appendChild(button('Reset to the synthetic defaults', 'apx-calc-reset', function() {
      state = JSON.parse(JSON.stringify(U.DEFAULTS));
      CALC_FIELDS.forEach(function(f) { f.input.value = state[f.k]; });
      rt.querySelectorAll('input').forEach(function(inp, i) {
        if (i < state.roles.length * 2) inp.value = state.roles[Math.floor(i / 2)][i % 2 ? 'rate' : 'hours'];
        else inp.value = state.judgementHours;
      });
      draw();
    }, 'ti-refresh'));

    var kpis = el('div', 'apx-kpis');
    outputs.appendChild(kpis);
    var tabs = el('div', 'apx-tabs');
    tabs.setAttribute('role', 'tablist');
    var TABS = [['waterfall', 'Cost per case'], ['annual', 'Annual benefit'], ['payback', 'Payback'], ['sensitivity', 'Sensitivity']];
    var tabBtns = TABS.map(function(t) {
      var b = el('button', 'apx-tab', t[1]);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('data-tab', t[0]);
      b.addEventListener('click', function(e) { e.stopPropagation(); tab = t[0]; draw(); });
      tabs.appendChild(b);
      return b;
    });
    outputs.appendChild(tabs);
    var chart = el('div', 'apx-calc-chart');
    outputs.appendChild(chart);

    function kpi(label, value, sub, cls) {
      var k = el('div', 'apx-kpi' + (cls ? ' ' + cls : ''));
      k.appendChild(el('div', 'apx-kpi-v', value));
      k.appendChild(el('div', 'apx-kpi-k', label));
      if (sub) k.appendChild(el('div', 'apx-kpi-s', sub));
      return k;
    }

    function draw() {
      var r = U.compute(state);
      CALC_FIELDS.forEach(function(f) { f.valEl.textContent = f.fmt(state[f.k]); });
      kpis.innerHTML = '';
      kpis.appendChild(kpi('Cost per case', money(r.baselineCost) + ' → ' + money(r.futureTotalCost), 'human cost before, total cost after'));
      kpis.appendChild(kpi('Capacity returned', hours(r.capacityHours), 'per year, redirected to judgement'));
      kpis.appendChild(kpi('Annual net benefit', money(r.annualNet), 'after run cost', r.annualNet < 0 ? 'is-neg' : ''));
      kpis.appendChild(kpi('Simple payback', r.payback === null ? 'No payback' : r.payback.toFixed(1) + ' years', 'one-off cost over net benefit', r.payback === null ? 'is-neg' : ''));
      tabBtns.forEach(function(b) { var on = b.getAttribute('data-tab') === tab; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      chart.innerHTML = '';
      chart.setAttribute('data-view', tab);
      if (tab === 'waterfall') waterfall(chart, r);
      else if (tab === 'annual') annual(chart, r);
      else if (tab === 'payback') payback(chart, r);
      else sens(chart, U.sensitivity(state));
      wrap.setAttribute('data-net', String(Math.round(r.annualNet)));
    }

    function waterfall(host, r) {
      var W = 600, H = 210, pad = 30, bw = 70;
      var max = r.baselineCost * 1.08;
      var y = function(v) { return H - pad - v / max * (H - pad - 18); };
      var g = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'apx-wf', role: 'img', 'aria-label': 'Cost per case: ' + r.waterfall.map(function(s) { return s.label + ' ' + Math.round(s.value); }).join(', ') });
      var run = 0;
      r.waterfall.forEach(function(s, i) {
        var x = 18 + i * (bw + 26);
        var top, bottom;
        if (s.kind === 'total') { top = s.value; bottom = 0; run = s.value; }
        else { bottom = run; top = run + s.value; run = top; }
        var y1 = y(Math.max(top, bottom)), y2 = y(Math.min(top, bottom));
        g.appendChild(svg('rect', { x: x, y: y1, width: bw, height: Math.max(1, y2 - y1), rx: 3, 'class': 'apx-wf-bar is-' + s.kind }));
        var v = svg('text', { x: x + bw / 2, y: y1 - 5, 'text-anchor': 'middle', 'class': 'apx-wf-v' });
        v.textContent = (s.kind === 'total' ? '' : s.value > 0 ? '+' : '-') + Math.round(Math.abs(s.value));
        g.appendChild(v);
        var words = s.label.split(' ');
        var mid = Math.ceil(words.length / 2);
        [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].forEach(function(line, li) {
          if (!line) return;
          var t = svg('text', { x: x + bw / 2, y: H - pad + 14 + li * 13, 'text-anchor': 'middle', 'class': 'apx-wf-l' });
          t.textContent = line;
          g.appendChild(t);
        });
      });
      host.appendChild(g);
      host.appendChild(el('div', 'apx-note', 'EUR per case. The removed work is the addressable share times the realised efficiency; judgement and review time stay.'));
    }
    function annual(host, r) {
      var rows = [['Capacity value', r.capacityValue, 'is-up'], ['Operating benefit', r.operatingBenefit, 'is-up'], ['Recurring run cost', -r.runCost, 'is-down'], ['Annual net benefit', r.annualNet, 'is-total']];
      var max = Math.max.apply(null, rows.map(function(x) { return Math.abs(x[1]); })) || 1;
      var box = el('div', 'apx-hbars');
      rows.forEach(function(x) {
        var row = el('div', 'apx-hbar ' + x[2]);
        row.appendChild(el('span', 'apx-hbar-l', x[0]));
        var tr = el('span', 'apx-hbar-track');
        var f = el('i');
        f.style.width = (Math.abs(x[1]) / max * 100) + '%';
        tr.appendChild(f);
        row.appendChild(tr);
        row.appendChild(el('span', 'apx-hbar-v', money(x[1])));
        box.appendChild(row);
      });
      host.appendChild(box);
      host.appendChild(el('div', 'apx-note', r.adoptedCases.toLocaleString('en-GB') + ' cases through the controlled flow. Capacity value is net of exception handling.'));
    }
    function payback(host, r) {
      var W = 600, H = 200, pad = 34;
      var vals = r.cumulative;
      var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals.concat([0]));
      var x = function(i) { return pad + i * (W - pad - 10) / (vals.length - 1); };
      var y = function(v) { return 12 + (max - v) / ((max - min) || 1) * (H - pad - 12); };
      var g = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'apx-pb', role: 'img', 'aria-label': 'Cumulative net position over 36 months, from ' + money(vals[0]) + ' to ' + money(vals[36]) });
      g.appendChild(svg('line', { x1: pad, x2: W - 10, y1: y(0), y2: y(0), 'class': 'apx-pb-zero' }));
      g.appendChild(svg('polyline', { points: vals.map(function(v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' '), 'class': 'apx-pb-line' }));
      [0, 12, 24, 36].forEach(function(m) { var t = svg('text', { x: x(m), y: H - 8, 'text-anchor': 'middle', 'class': 'apx-wf-l' }); t.textContent = 'Month ' + m; g.appendChild(t); });
      if (r.payback !== null && r.payback <= 3) {
        var pm = r.payback * 12;
        g.appendChild(svg('circle', { cx: x(pm), cy: y(0), r: 5, 'class': 'apx-pb-dot' }));
        var t = svg('text', { x: x(pm), y: y(0) - 10, 'text-anchor': 'middle', 'class': 'apx-wf-v' });
        t.textContent = 'Payback, month ' + Math.round(pm);
        g.appendChild(t);
      }
      host.appendChild(g);
      host.appendChild(el('div', 'apx-note', 'Cumulative net position from the one-off cost, three years, before ramp-up and financing.'));
    }
    function sens(host, grid) {
      var t = el('table', 'apx-sens');
      var hr = el('tr');
      hr.appendChild(el('th', null, 'Efficiency, by adoption'));
      grid[0].forEach(function(c0) { hr.appendChild(el('th', null, pct(c0.adoption))); });
      t.appendChild(hr);
      grid.forEach(function(row) {
        var tr = el('tr');
        tr.appendChild(el('th', null, pct(row[0].efficiency)));
        row.forEach(function(cell) {
          var td = el('td', cell.annualNet < 0 ? 'is-neg' : cell.payback !== null && cell.payback <= 2 ? 'is-good' : '');
          td.appendChild(el('b', null, money(cell.annualNet)));
          td.appendChild(el('span', null, cell.payback === null ? 'no payback' : cell.payback.toFixed(1) + ' years'));
          tr.appendChild(td);
        });
        t.appendChild(tr);
      });
      host.appendChild(t);
      host.appendChild(el('div', 'apx-note', 'Annual net benefit and simple payback for each pair; other inputs as set.'));
    }
    draw();
  };

  // ── Page chrome ──
  function renderPage(section) {
    var hit = findPage(section.id);
    var host = section.querySelector('[data-apx-body]');
    if (!hit || !host) return;
    var D = A(), m = hit.module, p = hit.page;
    host.innerHTML = '';
    var top = el('div', 'apx-top');
    var crumb = el('div', 'apx-crumb');
    var mod = el('button', 'apx-mod-chip');
    mod.type = 'button';
    mod.appendChild(icon(m.icon));
    mod.appendChild(el('span', null, m.key + ' · ' + m.label));
    mod.title = 'Back to the appendix index';
    mod.addEventListener('click', function(e) { e.stopPropagation(); index(); });
    crumb.appendChild(mod);
    crumb.appendChild(el('span', 'apx-code', p.code + ' of ' + m.pages[0].code + ' to ' + m.pages[m.pages.length - 1].code));
    crumb.appendChild(el('span', 'apx-kind is-' + p.kind, D.kinds[p.kind]));
    crumb.appendChild(el('span', 'apx-status is-' + p.status, D.status[p.status]));
    top.appendChild(crumb);
    var nav = el('div', 'apx-navbtns');
    nav.appendChild(button('Index (A)', 'apx-nav-index', index, 'ti-layout-grid'));
    var prev = m.pages[hit.index - 1], next = m.pages[hit.index + 1];
    var pb = button(prev ? prev.code : 'Previous', 'apx-nav-prev', function() { if (prev) goToSection(prev.id); }, 'ti-arrow-left');
    pb.disabled = !prev;
    var nb = button(next ? next.code : 'Next', 'apx-nav-next', function() { if (next) goToSection(next.id); }, 'ti-arrow-right', true);
    nb.disabled = !next;
    nav.appendChild(pb);
    nav.appendChild(nb);
    nav.appendChild(button('Main story (M)', 'apx-nav-main', main, 'ti-arrow-back-up'));
    top.appendChild(nav);
    // The chrome sits above the question when the shell has a slot for it
    var chromeHost = section.querySelector('[data-apx-chrome]');
    if (chromeHost) { chromeHost.innerHTML = ''; chromeHost.appendChild(top); } else host.appendChild(top);
    var visual = el('div', 'apx-visual apx-v-' + p.visual.type);
    visual.setAttribute('data-visual', p.visual.type);
    host.appendChild(visual);
    try { V[p.visual.type](visual, p.visual); }
    catch (e) { visual.innerHTML = ''; visual.appendChild(el('p', 'apx-note', 'This visual could not be drawn.')); if (window.console) console.warn('appendix visual ' + p.code, e); }
    var foot = el('div', 'apx-foot');
    var imp = el('div', 'apx-implication');
    imp.appendChild(el('span', 'apx-imp-k', 'Decision implication'));
    imp.appendChild(el('span', 'apx-imp-v', p.implication));
    foot.appendChild(imp);
    host.appendChild(foot);
    if (p.detail && p.detail.length) {
      var d = el('details', 'apx-more');
      d.appendChild(el('summary', null, 'More detail'));
      var grid = el('div', 'apx-more-grid');
      p.detail.forEach(function(blk) {
        var b = el('div', 'apx-more-block');
        b.appendChild(el('div', 'apx-col-title', blk.title));
        b.appendChild(list(blk.items));
        grid.appendChild(b);
      });
      d.appendChild(grid);
      host.appendChild(d);
    }
  }

  // ── The index: four doors ──
  function renderIndex(section) {
    var host = section.querySelector('[data-apx-index]');
    if (!host) return;
    var D = A();
    host.innerHTML = '';
    var doors = el('div', 'apx-doors');
    D.modules.forEach(function(m) {
      var door = el('div', 'apx-door is-' + m.id);
      door.setAttribute('data-module', m.id);
      var h = el('button', 'apx-door-head');
      h.type = 'button';
      h.appendChild(el('span', 'apx-door-key', m.key));
      var t = el('span', 'apx-door-t');
      t.appendChild(el('span', 'apx-door-label', m.label));
      t.appendChild(el('span', 'apx-door-q', m.question));
      h.appendChild(t);
      h.addEventListener('click', function(e) { e.stopPropagation(); goToSection(m.pages[0].id); });
      door.appendChild(h);
      var meta = el('div', 'apx-door-meta');
      meta.appendChild(el('span', 'apx-kind is-' + m.kind, D.kinds[m.kind]));
      meta.appendChild(el('span', null, m.pages.length + ' pages'));
      meta.appendChild(el('span', 'apx-door-trigger', 'Asked as ' + m.trigger));
      door.appendChild(meta);
      var ol = el('ol', 'apx-door-pages');
      m.pages.forEach(function(p) {
        var li = el('li');
        var a = el('a', 'apx-door-link');
        a.href = '#' + p.id;
        a.appendChild(el('span', 'apx-code', p.code));
        a.appendChild(el('span', null, p.title));
        a.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); goToSection(p.id); });
        li.appendChild(a);
        ol.appendChild(li);
      });
      door.appendChild(ol);
      doors.appendChild(door);
    });
    host.appendChild(doors);
    var extras = el('div', 'apx-extras');
    D.extras.forEach(function(x) {
      if (!document.getElementById(x.id)) return;
      var a = el('a', 'apx-extra');
      a.href = '#' + x.id;
      a.appendChild(icon(x.icon));
      a.appendChild(el('span', null, x.label));
      a.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); goToSection(x.id); });
      extras.appendChild(a);
    });
    extras.appendChild(button('Main story (M)', 'apx-nav-main', main, 'ti-arrow-back-up'));
    host.appendChild(extras);
  }

  // ── Navigation ──
  function index() { goToSection('appendix'); }
  function main() { if (window.PresenterControls && PresenterControls.returnToStory) PresenterControls.returnToStory(); }
  function module(key) { var m = moduleByKey(key); if (m) goToSection(m.pages[0].id); return !!m; }
  function isPage(sec) { return !!(sec && sec.hasAttribute && sec.hasAttribute('data-apx-page')); }
  function step(dir) {
    var sec = typeof sections !== 'undefined' ? sections[current] : null;
    var hit = sec && findPage(sec.id);
    if (!hit) return false;
    var p = hit.module.pages[hit.index + dir];
    if (p) goToSection(p.id);
    return !!p;
  }

  function init() {
    if (!A()) return;
    document.querySelectorAll('section[data-apx-page]').forEach(renderPage);
    var idx = document.getElementById('appendix');
    if (idx) renderIndex(idx);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.AppendixNav = { go: goToSection, index: index, main: main, module: module, step: step, isPage: isPage, find: findPage, visuals: Object.keys(V) };
}());
