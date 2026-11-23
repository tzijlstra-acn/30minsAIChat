// -- APPENDIX TOPICS -- v5 --
// Renders the technical-depth topics from NFR_WORKSPACE_DEMO.technical, once, for two
// places: the appendix pages (section [data-topic], filled at load) and the technical
// drawer (T). Topics: choice (A), authority (B), architecture (C), writeback (D),
// lifecycle (E), runtime (F) and proof (G). Public-safe: no internal asset is named.
// Exposes: window.AppendixTopics

(function() {
  'use strict';

  function D() { return window.NFR_WORKSPACE_DEMO; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function icon(name) { var i = el('i', 'ti ' + name); i.setAttribute('aria-hidden', 'true'); return i; }
  function footer(parent, text) { if (text) parent.appendChild(el('p', 'at-footer', text)); }

  var RENDER = {
    // A: which capability should handle the work
    choice: function(c, T) {
      var table = el('table', 'at-table');
      var thead = el('thead');
      var hr = el('tr');
      T.columns.forEach(function(h) { hr.appendChild(el('th', null, h)); });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tb = el('tbody');
      var caps = {};
      D().capabilities.forEach(function(cap) { caps[cap.verb] = cap; });
      T.rows.forEach(function(r) {
        var tr = el('tr');
        tr.appendChild(el('td', 'at-need', r.need));
        var path = el('td', 'at-path');
        if (caps[r.path]) path.appendChild(icon(caps[r.path].icon));
        path.appendChild(el('span', 'at-verb', r.path));
        path.appendChild(el('span', 'at-product', r.product));
        tr.appendChild(path);
        tr.appendChild(el('td', null, r.example));
        tr.appendChild(el('td', 'at-authority', r.authority));
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      c.appendChild(table);
      footer(c, T.footer);
    },

    // B: AI-assisted work, deterministic rules and human authority, side by side
    authority: function(c, T) {
      var cols = el('div', 'at-cols at-authority');
      T.columns.forEach(function(col) {
        var box = el('div', 'at-col at-col-' + col.id);
        var title = el('div', 'at-col-title');
        title.appendChild(icon(col.icon));
        title.appendChild(el('span', null, col.label));
        box.appendChild(title);
        var ul = el('ul');
        col.items.forEach(function(it) { ul.appendChild(el('li', null, it)); });
        box.appendChild(ul);
        var demo = T.demo.filter(function(d) { return d.id === col.id; })[0];
        if (demo) {
          var ex = el('div', 'at-col-demo');
          ex.appendChild(el('span', 'at-col-demo-k', T.demoTitle));
          ex.appendChild(el('span', null, demo.text));
          box.appendChild(ex);
        }
        cols.appendChild(box);
      });
      c.appendChild(cols);
      footer(c, T.footer);
    },

    // C: from business experience to governed execution
    architecture: function(c, T) {
      var stack = el('div', 'at-stack');
      T.layers.forEach(function(layer, i) {
        var row = el('div', 'at-layer at-layer-' + (i + 1));
        var head = el('div', 'at-layer-head');
        head.appendChild(el('span', 'at-layer-num', String(i + 1)));
        var t = el('div');
        t.appendChild(el('div', 'at-layer-label', layer.label));
        t.appendChild(el('div', 'at-layer-note', layer.note));
        head.appendChild(t);
        row.appendChild(head);
        var items = el('div', 'at-pills');
        layer.items.forEach(function(it) { items.appendChild(el('span', 'at-pill', it)); });
        row.appendChild(items);
        stack.appendChild(row);
      });
      c.appendChild(stack);
      footer(c, T.footer);
    },

    // F: candidate runtime reuse, in generic terms
    runtime: function(c, T) {
      var cols = el('div', 'at-cols');
      T.columns.forEach(function(col) {
        var box = el('div', 'at-col at-col-' + col.id);
        box.appendChild(el('div', 'at-col-title', col.label));
        var ul = el('ul');
        col.items.forEach(function(it) { ul.appendChild(el('li', null, it)); });
        box.appendChild(ul);
        cols.appendChild(box);
      });
      c.appendChild(cols);
      var fit = el('div', 'at-fit');
      fit.appendChild(el('span', 'at-fit-title', T.fitTitle));
      T.fit.forEach(function(f) {
        var item = el('span', 'at-fit-item');
        item.appendChild(el('b', null, f.path));
        var bar = el('span', 'at-fit-bar');
        for (var i = 0; i < 3; i++) bar.appendChild(el('i', i < f.level ? 'is-on' : ''));
        item.appendChild(bar);
        item.appendChild(el('span', null, f.text));
        fit.appendChild(item);
      });
      c.appendChild(fit);
      footer(c, T.footer);
    },

    // E: how ad hoc work becomes governed and reusable
    lifecycle: function(c, T) {
      var row = el('ol', 'at-stages');
      T.stages.forEach(function(s, i) {
        var li = el('li', 'at-stage');
        li.appendChild(el('span', 'at-stage-num', String(i + 1)));
        li.appendChild(el('div', 'at-stage-label', s.label));
        var ul = el('ul');
        s.points.forEach(function(p) { ul.appendChild(el('li', null, p)); });
        li.appendChild(ul);
        row.appendChild(li);
      });
      c.appendChild(row);
      var gates = el('div', 'at-gates');
      gates.appendChild(el('span', 'at-gates-title', T.gatesTitle));
      T.gates.forEach(function(g) { gates.appendChild(el('span', 'at-gate', g)); });
      c.appendChild(gates);
      footer(c, T.footer);
    },

    // D: governed write-back (and, in the drawer, the control catalogue)
    writeback: function(c, T, mode) {
      var flow = el('ol', 'at-flow');
      T.flow.forEach(function(step, i) {
        var li = el('li', 'at-flow-step' + (i === 3 ? ' is-human' : '') + (i >= 5 ? ' is-record' : ''));
        li.appendChild(el('span', 'at-flow-num', String(i + 1)));
        li.appendChild(el('span', 'at-flow-text', step));
        flow.appendChild(li);
      });
      c.appendChild(flow);
      var strip = el('div', 'at-strip');
      T.strip.forEach(function(s) { strip.appendChild(el('span', 'at-strip-item', s)); });
      c.appendChild(strip);
      if (mode === 'drawer') {
        c.appendChild(el('div', 'at-sub', T.catalogueTitle));
        var dl = el('dl', 'pc-controls');
        T.catalogue.forEach(function(row) { dl.appendChild(el('dt', null, row[0])); dl.appendChild(el('dd', null, row[1])); });
        c.appendChild(dl);
      }
    },

    // G: proof gates and the measures behind them
    proof: function(c, T) {
      var gates = el('ol', 'at-stages at-proof-gates');
      T.gates.forEach(function(g, i) {
        var li = el('li', 'at-stage');
        li.appendChild(el('span', 'at-stage-num', String(i + 1)));
        li.appendChild(el('div', 'at-stage-label', g.label));
        li.appendChild(el('div', 'at-stage-note', g.note));
        gates.appendChild(li);
      });
      c.appendChild(el('div', 'at-sub', T.gatesTitle));
      c.appendChild(gates);
      c.appendChild(el('div', 'at-sub', T.measuresTitle));
      var grid = el('div', 'at-measures');
      T.metrics.forEach(function(m) {
        var it = el('div', 'at-measure');
        it.appendChild(el('span', 'at-measure-k', m[0]));
        it.appendChild(el('span', 'at-measure-v', m[1]));
        grid.appendChild(it);
      });
      c.appendChild(grid);
      footer(c, T.footer);
    }
  };

  function render(id, container, mode) {
    var T = D().technical;
    container.innerHTML = '';
    if (!RENDER[id]) return;
    // The drawer shows the topic's headline; an appendix page has its own h2
    if (mode === 'drawer' && T[id] && T[id].headline) container.appendChild(el('p', 'at-lead', T[id].headline));
    RENDER[id](container, T[id], mode);
  }

  function fillPages() {
    document.querySelectorAll('[data-topic]').forEach(function(c) { render(c.dataset.topic, c, 'page'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillPages); else fillPages();

  window.AppendixTopics = {
    render: render,
    tabs: function() { return D().technical.tabs; },
    has: function(id) { return !!RENDER[id]; }
  };
}());
