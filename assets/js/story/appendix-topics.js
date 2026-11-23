// -- APPENDIX TOPICS -- v4 --
// Renders the technical-depth topics from NFR_WORKSPACE_DEMO.technical, once, for two
// places: the appendix pages (section [data-topic], filled at load) and the technical
// drawer (T). Topics: choice (A), architecture (B), runtime (C), lifecycle (D),
// writeback (E) and metrics. Public-safe: no internal asset is named.
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

    // B: from business experience to governed execution
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

    // C: candidate runtime reuse, in generic terms
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

    // D: how ad hoc work becomes governed and reusable
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

    // E: governed write-back (and, in the drawer, the control catalogue)
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

    // Measurement library
    metrics: function(c) {
      var T = D().technical;
      var grid = el('div', 'pc-metrics');
      T.metrics.forEach(function(g) {
        var col = el('div', 'pc-metric-group');
        col.appendChild(el('div', 'pc-metric-hd', g[0]));
        var ul = el('ul');
        g[1].forEach(function(m) { ul.appendChild(el('li', null, m)); });
        col.appendChild(ul);
        grid.appendChild(col);
      });
      c.appendChild(grid);
      footer(c, T.metricsNote);
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
