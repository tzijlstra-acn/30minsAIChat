// -- VISUAL GRAMMAR -- V27 --
// Reusable visual primitive factories for scene composition.
// V27 adds the story kit (StoryKit) for the TPRM transition story, at the end of this file.
// V26 semantic colours:
//   Cyan   (#55C7E8) -- data and context
//   Purple (#B44CFF) -- AI work
//   Amber  (#F3B34C) -- human judgement and control
//   Green  (#58C994) -- approved evidence
//   Red    (#F0758A) -- gap, exception or failure only
// V26 box rule: a box is allowed only for a real process object, system boundary,
//               human approval gate, evidence record, or measurable state.
//               Use SystemField for labelled background regions. Use MetricStrip for metrics.
// Primitives: SIGNAL, CONTEXT, HUMAN GATE, EVIDENCE RECORD, SYSTEM FIELD, WORK LANE, METRIC STRIP
// Exposes: Signal, ContextNode, HumanGate, EvidenceRecord, ObligationToken, ReuseMarker,
//          SystemField, WorkLane, MetricStrip
// Safe to include before scene files; no external dependencies.

(function() {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function _svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function _injectKeyframes(id, css) {
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ── Signal ──
  // Creates a luminous pulsing dot at (x, y) inside container.
  var Signal = {
    create: function(container, opts) {
      opts = opts || {};
      var x     = opts.x     !== undefined ? opts.x     : 0;
      var y     = opts.y     !== undefined ? opts.y     : 0;
      var color = opts.color || 'var(--cyan)';
      var size  = opts.size  || 8;
      var label = opts.label || '';
      var pulse = opts.pulse !== false;

      var el = document.createElement('div');
      el.setAttribute('data-visual-object', 'signal');
      el.style.cssText = [
        'position:absolute',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'border-radius:50%',
        'background:' + color,
        'box-shadow:0 0 ' + (size * 2) + 'px ' + color + ',0 0 ' + (size * 4) + 'px ' + color,
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
      ].join(';');

      if (label) {
        var lbl = document.createElement('span');
        lbl.style.cssText = [
          'position:absolute',
          'top:' + (size + 4) + 'px',
          'left:50%',
          'transform:translateX(-50%)',
          'font-size:10px',
          'white-space:nowrap',
          'color:' + color,
          'pointer-events:none',
        ].join(';');
        lbl.textContent = label;
        el.appendChild(lbl);
      }

      container.appendChild(el);

      function doPulse() {
        _injectKeyframes('vg-signal-pulse-kf',
          '@keyframes signal-pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}' +
          '50%{transform:translate(-50%,-50%) scale(1.4)}}');
        el.style.animation = 'signal-pulse 1.2s ease-in-out infinite';
      }

      function stopPulse() {
        el.style.animation = 'none';
      }

      function destroy() {
        if (el.parentNode) el.parentNode.removeChild(el);
      }

      if (pulse) doPulse();

      return { el: el, pulse: doPulse, stop: stopPulse, destroy: destroy };
    }
  };

  // ── ContextNode ──
  // Creates an SVG circle or rect node with a text label.
  var ContextNode = {
    create: function(svg, opts) {
      opts = opts || {};
      var x     = opts.x     !== undefined ? opts.x     : 0;
      var y     = opts.y     !== undefined ? opts.y     : 0;
      var label = opts.label || '';
      var color = opts.color || 'var(--text-2)';
      var size  = opts.size  || 20;
      var type  = opts.type  || 'circle';

      var g = _svgEl('g');
      g.setAttribute('data-visual-object', 'context-node');

      var shape;
      if (type === 'rect') {
        shape = _svgEl('rect', {
          x: x - size / 2,
          y: y - size / 2,
          width:  size,
          height: size,
          rx: '3',
          fill: color,
          opacity: '0.85',
        });
      } else {
        shape = _svgEl('circle', {
          cx: x,
          cy: y,
          r:  size / 2,
          fill: color,
          opacity: '0.85',
        });
      }
      g.appendChild(shape);

      if (label) {
        var t = _svgEl('text', {
          x: x,
          y: y + size / 2 + 14,
          'text-anchor': 'middle',
          'font-size': '11',
          fill: 'var(--text-1,#e8eaf0)',
        });
        t.textContent = label;
        g.appendChild(t);
      }

      svg.appendChild(g);

      var _lines = [];

      function highlight(c) {
        shape.setAttribute('fill', c || color);
        shape.setAttribute('opacity', '1');
      }

      function dim() {
        shape.setAttribute('fill', color);
        shape.setAttribute('opacity', '0.4');
      }

      function connect(otherNode) {
        if (!otherNode || !otherNode._pos) return null;
        var line = _svgEl('line', {
          x1: x,
          y1: y,
          x2: otherNode._pos.x,
          y2: otherNode._pos.y,
          stroke: 'var(--text-2,#8b90a0)',
          'stroke-width': '1',
          opacity: '0.5',
          'stroke-dasharray': '3 3',
        });
        svg.insertBefore(line, svg.firstChild);
        _lines.push(line);
        return line;
      }

      function destroy() {
        _lines.forEach(function(l) { if (l.parentNode) l.parentNode.removeChild(l); });
        if (g.parentNode) g.parentNode.removeChild(g);
      }

      return {
        el: g,
        _pos: { x: x, y: y },
        highlight: highlight,
        dim: dim,
        connect: connect,
        destroy: destroy,
      };
    }
  };

  // ── HumanGate ──
  // Creates an amber diamond/ring with a role label.
  var HumanGate = {
    create: function(container, opts) {
      opts = opts || {};
      var x    = opts.x    !== undefined ? opts.x    : 0;
      var y    = opts.y    !== undefined ? opts.y    : 0;
      var role = opts.role || 'Risk Owner';
      var color = opts.color || 'var(--amber)';
      var size = opts.size || 48;

      var wrap = document.createElement('div');
      wrap.setAttribute('data-visual-object', 'human-gate');
      wrap.style.cssText = [
        'position:absolute',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
      ].join(';');

      var svgNode = document.createElementNS(SVG_NS, 'svg');
      svgNode.setAttribute('width', size);
      svgNode.setAttribute('height', size);
      svgNode.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
      svgNode.style.overflow = 'visible';

      var half = size / 2;
      var pts  = [
        half + ',' + 2,
        (size - 2) + ',' + half,
        half + ',' + (size - 2),
        2 + ',' + half,
      ].join(' ');

      var diamond = document.createElementNS(SVG_NS, 'polygon');
      diamond.setAttribute('points', pts);
      diamond.setAttribute('fill', 'none');
      diamond.setAttribute('stroke', color);
      diamond.setAttribute('stroke-width', '2');
      svgNode.appendChild(diamond);

      var ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', half);
      ring.setAttribute('cy', half);
      ring.setAttribute('r', half - 2);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', color);
      ring.setAttribute('stroke-width', '1.5');
      ring.setAttribute('stroke-dasharray', '4 3');
      ring.setAttribute('opacity', '0.6');
      svgNode.appendChild(ring);

      wrap.appendChild(svgNode);

      var lbl = document.createElement('div');
      lbl.style.cssText = [
        'position:absolute',
        'top:' + (size + 4) + 'px',
        'left:50%',
        'transform:translateX(-50%)',
        'font-size:10px',
        'white-space:nowrap',
        'color:' + color,
        'text-align:center',
      ].join(';');
      lbl.textContent = role;
      wrap.appendChild(lbl);

      container.appendChild(wrap);

      function activate() {
        _injectKeyframes('vg-gate-pulse-kf',
          '@keyframes gate-pulse{0%,100%{opacity:0.6}50%{opacity:1}}');
        ring.style.animation = 'gate-pulse 1.5s ease-in-out infinite';
        diamond.setAttribute('stroke-width', '3');
      }

      function deactivate() {
        ring.style.animation = 'none';
        diamond.setAttribute('stroke-width', '2');
      }

      function destroy() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }

      return { el: wrap, ring: ring, activate: activate, deactivate: deactivate, destroy: destroy };
    }
  };

  // ── EvidenceRecord ──
  // Creates a green signed artefact rect with a checkmark and timestamp.
  var EvidenceRecord = {
    create: function(container, opts) {
      opts = opts || {};
      var x          = opts.x     !== undefined ? opts.x     : 0;
      var y          = opts.y     !== undefined ? opts.y     : 0;
      var label      = opts.label      || 'Evidence';
      var provenance = opts.provenance || '';
      var color      = opts.color      || 'var(--green)';

      var el = document.createElement('div');
      el.setAttribute('data-visual-object', 'evidence-record');
      el.style.cssText = [
        'position:absolute',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'transform:translate(-50%,-50%)',
        'border:1.5px solid ' + color,
        'border-radius:4px',
        'padding:6px 10px',
        'display:flex',
        'align-items:center',
        'gap:6px',
        'background:rgba(0,0,0,0.4)',
        'pointer-events:none',
        'min-width:100px',
      ].join(';');

      var check = document.createElement('span');
      check.style.cssText = 'color:' + color + ';font-size:14px;line-height:1;flex-shrink:0;';
      check.textContent = '✓';
      el.appendChild(check);

      var textEl = document.createElement('span');
      textEl.style.cssText = 'font-size:11px;color:var(--text-1,#e8eaf0);';
      textEl.textContent = label;
      el.appendChild(textEl);

      if (provenance) {
        var prov = document.createElement('span');
        prov.style.cssText = 'font-size:9px;color:' + color + ';margin-left:4px;';
        prov.textContent = provenance;
        el.appendChild(prov);
      }

      var ts = document.createElement('div');
      ts.style.cssText = [
        'font-size:9px',
        'color:' + color,
        'opacity:0.7',
        'margin-top:2px',
        'position:absolute',
        'bottom:3px',
        'right:6px',
      ].join(';');
      ts.textContent = new Date().toISOString().slice(0, 10);
      el.appendChild(ts);

      container.appendChild(el);

      function stamp() {
        _injectKeyframes('vg-stamp-kf',
          '@keyframes evidence-stamp{' +
          '0%{transform:translate(-50%,-50%) scale(0)}' +
          '70%{transform:translate(-50%,-50%) scale(1.1)}' +
          '100%{transform:translate(-50%,-50%) scale(1)}}');
        el.style.animation = 'none';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            el.style.animation = 'evidence-stamp 0.4s ease-out forwards';
          });
        });
      }

      function destroy() {
        if (el.parentNode) el.parentNode.removeChild(el);
      }

      return { el: el, stamp: stamp, destroy: destroy };
    }
  };

  // ── ObligationToken state machine ──
  // Persistent pill that morphs through obligation workflow states.
  var _STATES = [
    'source', 'structured', 'graphed', 'processed', 'proven', 'produced', 'costed', 'bounded'
  ];

  var _STATUS_MAP = {
    source:     { text: 'Source',     cls: 's-source'     },
    structured: { text: 'Structured', cls: 's-structured' },
    graphed:    { text: 'Graphed',    cls: 's-graphed'    },
    processed:  { text: 'Processing', cls: 's-processing' },
    proven:     { text: 'Proven',     cls: 's-proven'     },
    produced:   { text: 'Produced',   cls: 's-produced'   },
    costed:     { text: 'Costed',     cls: 's-costed'     },
    bounded:    { text: 'Bounded',    cls: 's-bounded'    },
  };

  var ObligationToken = {
    state:  'source',
    label:  'Art. 7(3) -- Coverage mapping',
    status: 'Processing',
    _el:        null,
    _statusEl:  null,

    create: function(container, opts) {
      opts = opts || {};
      var label        = opts.label || this.label;
      var initialState = opts.state || this.state;
      var shortLabel   = label.indexOf('--') !== -1
        ? label.split('--')[0].trim()
        : label;

      var el = document.createElement('div');
      el.className = 'obligation-token';
      el.setAttribute('data-visual-object', 'obligation-token');

      var tag = document.createElement('span');
      tag.className = 'obligation-token-tag';
      tag.textContent = 'OBLIGATION';
      el.appendChild(tag);

      var textEl = document.createElement('span');
      textEl.className = 'obligation-token-text';
      textEl.textContent = shortLabel;
      el.appendChild(textEl);

      var stateInfo  = _STATUS_MAP[initialState] || _STATUS_MAP['processed'];
      var statusEl   = document.createElement('span');
      statusEl.className = 'obligation-token-status ' + stateInfo.cls;
      statusEl.textContent = stateInfo.text;
      el.appendChild(statusEl);

      if (container) container.appendChild(el);

      this._el       = el;
      this._statusEl = statusEl;
      this.state     = initialState;

      return el;
    },

    advance: function(newState) {
      if (!this._el || !this._statusEl) return;
      if (_STATES.indexOf(newState) === -1) return;
      var self = this;
      this.state = newState;
      var info   = _STATUS_MAP[newState] || { text: newState, cls: 's-source' };
      // Remove all existing state classes before applying the new one
      _STATES.forEach(function(s) {
        var c = _STATUS_MAP[s] ? _STATUS_MAP[s].cls : '';
        if (c) self._statusEl.classList.remove(c);
      });
      this._statusEl.className = 'obligation-token-status ' + info.cls;
      this._statusEl.textContent = info.text;
    },

    getElement: function() {
      return this._el;
    }
  };

  // ── ReuseMarker ──
  // Small annotated dashed arc indicating that a second use case
  // reuses a shared context node. SVG-only; placed at (x, y).
  var ReuseMarker = {
    create: function(svg, opts) {
      opts = opts || {};
      var x     = opts.x     !== undefined ? opts.x     : 0;
      var y     = opts.y     !== undefined ? opts.y     : 0;
      var label = opts.label || 'REUSES SHARED CONTEXT';
      var color = opts.color || 'var(--green, #58C994)';

      function _svgEl2(tag, attrs) {
        var el = document.createElementNS(SVG_NS, tag);
        if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
        return el;
      }

      var g = _svgEl2('g', { 'class': 'vg-reuse-marker', 'pointer-events': 'none' });

      /* Token circle */
      var circle = _svgEl2('circle', {
        cx: String(x), cy: String(y), r: '6',
        fill: 'rgba(88,201,148,.12)',
        stroke: color, 'stroke-width': '1'
      });
      /* Token label */
      var text = _svgEl2('text', {
        x: String(x + 12), y: String(y + 4),
        'font-family': 'JetBrains Mono,monospace',
        'font-size': '9', 'letter-spacing': '.08em',
        fill: color, 'text-anchor': 'start'
      });
      text.textContent = label;

      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
      return g;
    }
  };

  // ── SystemField ──
  // V26: a labelled background region -- NOT a card. Use for system boundary zones.
  // Container is a positioned div; field is an absolutely-positioned label+region.
  var SystemField = {
    create: function(container, opts) {
      opts = opts || {};
      var label  = opts.label  || '';
      var color  = opts.color  || 'rgba(255,255,255,0.04)';
      var border = opts.border || 'rgba(255,255,255,0.06)';
      var x      = opts.x      !== undefined ? opts.x      : 0;
      var y      = opts.y      !== undefined ? opts.y      : 0;
      var w      = opts.w      !== undefined ? opts.w      : 200;
      var h      = opts.h      !== undefined ? opts.h      : 120;
      var labelColor = opts.labelColor || 'rgba(255,255,255,0.25)';

      var el = document.createElement('div');
      el.setAttribute('data-visual-object', 'system-field');
      el.style.cssText = [
        'position:absolute',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'width:' + w + 'px',
        'height:' + h + 'px',
        'background:' + color,
        'border:1px solid ' + border,
        'border-radius:6px',
        'box-sizing:border-box',
        'pointer-events:none',
      ].join(';');

      if (label) {
        var lbl = document.createElement('span');
        lbl.style.cssText = [
          'position:absolute',
          'top:6px',
          'left:10px',
          'font-family:"JetBrains Mono",monospace',
          'font-size:9px',
          'letter-spacing:.1em',
          'text-transform:uppercase',
          'color:' + labelColor,
          'white-space:nowrap',
        ].join(';');
        lbl.textContent = label;
        el.appendChild(lbl);
      }

      container.appendChild(el);
      return { el: el, destroy: function() { if (el.parentNode) el.parentNode.removeChild(el); } };
    }
  };

  // ── WorkLane ──
  // V26: horizontal accountability lane for relay scenes.
  // Returns a flex row that slots into a lane-based layout.
  var WorkLane = {
    create: function(container, opts) {
      opts = opts || {};
      var label = opts.label || '';
      var color = opts.color || 'rgba(255,255,255,0.15)';
      var bg    = opts.bg    || 'rgba(255,255,255,0.02)';

      var el = document.createElement('div');
      el.setAttribute('data-visual-object', 'work-lane');
      el.style.cssText = [
        'display:flex',
        'align-items:center',
        'flex:1',
        'min-height:0',
        'border-bottom:1px dashed ' + color,
        'background:' + bg,
        'position:relative',
      ].join(';');

      if (label) {
        var lbl = document.createElement('div');
        lbl.style.cssText = [
          'flex-shrink:0',
          'width:140px',
          'padding:0 10px 0 14px',
          'font-family:"Space Grotesk",sans-serif',
          'font-size:14px',
          'font-weight:600',
          'color:' + color,
          'line-height:1.3',
        ].join(';');
        lbl.textContent = label;
        el.appendChild(lbl);
      }

      container.appendChild(el);
      return { el: el, destroy: function() { if (el.parentNode) el.parentNode.removeChild(el); } };
    }
  };

  // ── MetricStrip ──
  // V26: slim horizontal gauge for one metric channel. Not a card.
  // Use inside evidence test rig or cost waterfall compositions.
  var MetricStrip = {
    create: function(container, opts) {
      opts = opts || {};
      var label  = opts.label  || '';
      var color  = opts.color  || '#58C994';
      var value  = opts.value  !== undefined ? opts.value  : 0;    // 0-100
      var unit   = opts.unit   || '';

      var el = document.createElement('div');
      el.setAttribute('data-visual-object', 'metric-strip');
      el.style.cssText = 'display:flex;align-items:center;gap:10px;height:28px;';

      var lbl = document.createElement('div');
      lbl.style.cssText = 'flex-shrink:0;width:90px;font-size:11px;font-family:"Space Grotesk",sans-serif;color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
      lbl.textContent = label;

      var track = document.createElement('div');
      track.style.cssText = 'flex:1;height:4px;background:rgba(255,255,255,.08);border-radius:2px;position:relative;overflow:hidden;';

      var fill = document.createElement('div');
      fill.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:0%;background:' + color + ';border-radius:2px;transition:width 600ms ease;';
      track.appendChild(fill);

      var valEl = document.createElement('div');
      valEl.style.cssText = 'flex-shrink:0;width:50px;font-size:11px;font-family:"JetBrains Mono",monospace;color:' + color + ';text-align:right;';
      valEl.textContent = 'NOT YET';

      el.appendChild(lbl);
      el.appendChild(track);
      el.appendChild(valEl);
      container.appendChild(el);

      function setValue(v, displayText) {
        fill.style.width = Math.max(0, Math.min(100, v)) + '%';
        valEl.textContent = displayText !== undefined ? displayText : (Math.round(v) + (unit ? ' ' + unit : ''));
        valEl.style.color = color;
      }

      return {
        el: el,
        setValue: setValue,
        destroy: function() { if (el.parentNode) el.parentNode.removeChild(el); }
      };
    }
  };

  // ══ V27 STORY KIT ══════════════════════════════════════════════
  // Primitives for the TPRM transition story. Colours come from CSS classes in
  // scenes.css (ts-c-data, ts-c-ai, ts-c-human, ts-c-proof, ts-c-gap), never from
  // inline hex values. Case facts come from window.TPRM_CASE.
  // Exposes: StoryKit.canvas, el, svg, path, on, complete, CaseBadge, EvidenceChip,
  //          UncertaintyBadge, DecisionGate, ReceiptState, ProofGate

  // Element helper: el('div', 'ts-obj ts-c-ai', 'Text', { left: 10, top: 20, width: 100 })
  // Numeric geometry keys become absolute px positions inside the design canvas.
  var _GEOM = ['left', 'top', 'width', 'height', 'right', 'bottom'];
  function el(tag, cls, text, geom) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    if (geom) {
      node.style.position = 'absolute';
      _GEOM.forEach(function(k) { if (geom[k] !== undefined) node.style[k] = geom[k] + 'px'; });
    }
    return node;
  }

  function svg(tag, attrs, cls) {
    var node = _svgEl(tag, attrs);
    if (cls) node.setAttribute('class', cls);
    return node;
  }

  // Icon as a span with the local Tabler icon font. A span (not <i>) keeps the icon
  // registry from swapping it for a sprite SVG that the stage-wide svg rule would stretch.
  function icon(name, cls) {
    var node = document.createElement('span');
    node.className = 'ti ' + name + (cls ? ' ' + cls : '');
    node.setAttribute('aria-hidden', 'true');
    return node;
  }

  // Connector path that draws itself when it gains ts-on. pathLength=1 avoids measuring.
  function path(parent, d, cls, markerId) {
    var p = svg('path', { d: d, pathLength: '1' }, 'ts-draw ' + (cls || ''));
    if (markerId) p.setAttribute('marker-end', 'url(#' + markerId + ')');
    parent.appendChild(p);
    return p;
  }

  function on(node) {
    if (!node) return;
    if (node.length !== undefined && !node.classList) {
      Array.prototype.forEach.call(node, on);
      return;
    }
    if (node.classList) node.classList.add('ts-on');
    else node.setAttribute('class', (node.getAttribute('class') || '') + ' ts-on');
  }

  function complete(container) {
    container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
  }

  // Design canvas: a fixed w x h coordinate space scaled to fit the stage, centred.
  // The scene's static fallback SVG is detached and kept, so renderError can restore it.
  function canvas(container, w, h, opts) {
    opts = opts || {};
    var fallback = container.querySelector('[data-scene-fallback]');
    if (fallback) container._tsFallback = fallback;
    // Keep the accessible summary the director injected before the scene built
    var summary = container.querySelector(':scope > .scene-accessible-summary');
    container.innerHTML = '';
    if (summary) container.appendChild(summary);

    var root = el('div', 'scene-root ts-root');
    var cv = el('div', 'ts-canvas');
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    var overlay = svg('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, 'aria-hidden': 'true' }, 'ts-svg');
    var defs = svg('defs');
    ['data', 'ai', 'human', 'proof', 'gap', 'neutral'].forEach(function(c) {
      var m = svg('marker', { id: 'ts-arrow-' + (opts.id || 'x') + '-' + c, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
      m.appendChild(svg('path', { d: 'M0,0 L10,5 L0,10 z' }, 'ts-fill-' + c));
      defs.appendChild(m);
    });
    overlay.appendChild(defs);
    cv.appendChild(overlay);
    root.appendChild(cv);
    container.appendChild(root);

    function fit() {
      var r = root.getBoundingClientRect();
      // refHeight: a shorter canvas scales as if it were this tall, so text keeps one size across screens
      var s = Math.min(r.width / w, r.height / Math.max(h, opts.refHeight || 0), opts.maxScale || 1.3);
      if (!isFinite(s) || s <= 0) s = 1;
      // ...and starts where that taller canvas would start, so it sits under the headline, not mid-stage
      var lift = Math.max(0, (Math.max(h, opts.refHeight || 0) - h) * s / 2);
      cv.style.transform = 'translate(-50%,-50%)' + (lift ? ' translateY(-' + lift.toFixed(1) + 'px)' : '') + ' scale(' + s + ')';
      cv.dataset.scale = s.toFixed(3);
    }
    fit();

    var ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function() { fit(); });
      ro.observe(root);
    }

    return {
      root: root, el: cv, svg: overlay,
      marker: function(c) { return 'ts-arrow-' + (opts.id || 'x') + '-' + c; },
      fit: fit,
      setStatic: function(isStatic) { root.classList.toggle('ts-static', !!isStatic); },
      destroy: function() { if (ro) ro.disconnect(); ro = null; }
    };
  }

  // Restore the static fallback after a render error. Never leaves the stage blank.
  function restoreFallback(container) {
    // The scene may have failed before it built, so the fallback can still be in place
    var fb = container._tsFallback || container.querySelector('[data-scene-fallback]');
    var summary = container.querySelector(':scope > .scene-accessible-summary');
    container.innerHTML = '';
    if (fb) {
      container.appendChild(fb);
      fb.style.display = 'block';
      fb.removeAttribute('hidden');
    }
    if (summary) container.appendChild(summary);
  }

  function _case() { return window.TPRM_CASE || null; }

  function _stateLabel(stateId) {
    var c = _case();
    if (!c) return stateId || '';
    var s = c.states.filter(function(x) { return x.id === stateId; })[0];
    return s ? s.label : (stateId || '');
  }

  // ── CaseBadge ── persistent synthetic-case identity, read from TPRM_CASE
  var CaseBadge = {
    create: function(parent, opts) {
      opts = opts || {};
      var c = _case();
      var node = el('div', 'ts-case' + (opts.compact ? ' ts-case-compact' : ''));
      node.setAttribute('data-visual-object', 'case-badge');
      node.setAttribute('data-case-id', c ? c.id : '');
      node.appendChild(el('span', 'ts-case-tag', c ? c.label : 'Synthetic case'));
      node.appendChild(el('span', 'ts-case-id', c ? c.id : ''));
      if (!opts.compact && c) node.appendChild(el('span', 'ts-case-meta', c.providerShort));
      var state = el('span', 'ts-case-state', _stateLabel(opts.state));
      if (opts.state) state.setAttribute('data-state', opts.state);
      node.appendChild(state);
      if (parent) parent.appendChild(node);
      return {
        el: node,
        setState: function(id) { state.textContent = _stateLabel(id); state.setAttribute('data-state', id); }
      };
    }
  };

  // ── EvidenceChip ── one authorised evidence object and its state
  var EvidenceChip = {
    create: function(parent, opts) {
      opts = opts || {};
      var st = (opts.state || 'verified').toLowerCase();
      var node = el('div', 'ts-evidence s-' + st);
      node.setAttribute('data-visual-object', 'evidence-chip');
      node.appendChild(icon(st === 'missing' ? 'ti-alert-triangle' : 'ti-file-check'));
      var body = el('div', 'ts-evidence-body');
      body.appendChild(el('div', 'ts-evidence-name', opts.label || ''));
      if (opts.detail) body.appendChild(el('div', 'ts-evidence-detail', opts.detail));
      node.appendChild(body);
      node.appendChild(el('span', 'ts-evidence-state', opts.stateLabel || st));
      if (parent) parent.appendChild(node);
      return { el: node };
    }
  };

  // ── UncertaintyBadge ── a named gap. Amber, dashed, always visible.
  var UncertaintyBadge = {
    create: function(parent, opts) {
      opts = opts || {};
      var node = el('div', 'ts-uncertain');
      node.setAttribute('data-visual-object', 'uncertainty');
      node.appendChild(icon('ti-alert-triangle'));
      node.appendChild(el('span', 'ts-uncertain-text', opts.label || ''));
      if (opts.note) node.appendChild(el('span', 'ts-uncertain-note', opts.note));
      if (parent) parent.appendChild(node);
      return { el: node };
    }
  };

  // ── DecisionGate ── amber human decision gate. activate() marks it as waiting.
  var DecisionGate = {
    create: function(parent, opts) {
      opts = opts || {};
      var node = el('div', 'ts-gate' + (opts.size === 'small' ? ' ts-gate-small' : ''));
      node.setAttribute('data-visual-object', 'decision-gate');
      node.appendChild(el('div', 'ts-gate-mark'));
      if (opts.label) node.appendChild(el('div', 'ts-gate-label', opts.label));
      if (opts.sub) node.appendChild(el('div', 'ts-gate-sub', opts.sub));
      if (parent) parent.appendChild(node);
      return {
        el: node,
        activate: function() { node.classList.add('is-active'); },
        pass: function() { node.classList.remove('is-active'); node.classList.add('is-passed'); }
      };
    }
  };

  // ── ReceiptState ── pending, writing, acknowledged. Green only on acknowledgement.
  var _RECEIPT = {
    pending: { icon: 'ti-clock', text: 'Not written' },
    blocked: { icon: 'ti-lock-check', text: 'Write blocked until approval' },
    writing: { icon: 'ti-plug', text: 'Connector writing' },
    acknowledged: { icon: 'ti-circle-check', text: 'Acknowledged, receipt recorded' }
  };
  var ReceiptState = {
    create: function(parent, opts) {
      opts = opts || {};
      var node = el('div', 'ts-receipt');
      node.setAttribute('data-visual-object', 'receipt');
      var glyph = icon('');
      var text = el('span', 'ts-receipt-text');
      node.appendChild(glyph);
      node.appendChild(text);
      function set(state, label) {
        var info = _RECEIPT[state] || _RECEIPT.pending;
        node.setAttribute('data-state', state);
        glyph.className = 'ti ' + info.icon;
        text.textContent = label || info.text;
      }
      set(opts.state || 'pending', opts.label);
      if (parent) parent.appendChild(node);
      return { el: node, set: set };
    }
  };

  // ── ProofGate ── a delivery or evidence gate: decide continue, adjust or stop.
  var ProofGate = {
    create: function(parent, opts) {
      opts = opts || {};
      var node = el('div', 'ts-proofgate');
      node.setAttribute('data-visual-object', 'proof-gate');
      node.appendChild(el('div', 'ts-proofgate-mark'));
      if (opts.label) node.appendChild(el('div', 'ts-proofgate-label', opts.label));
      if (opts.sub) node.appendChild(el('div', 'ts-proofgate-sub', opts.sub));
      if (parent) parent.appendChild(node);
      return { el: node, pass: function() { node.classList.add('is-passed'); } };
    }
  };

  window.StoryKit = {
    el: el, svg: svg, icon: icon, path: path, on: on, complete: complete,
    canvas: canvas, restoreFallback: restoreFallback,
    CaseBadge: CaseBadge, EvidenceChip: EvidenceChip, UncertaintyBadge: UncertaintyBadge,
    DecisionGate: DecisionGate, ReceiptState: ReceiptState, ProofGate: ProofGate
  };

  window.VisualGrammar = {
    Signal:          Signal,
    ContextNode:     ContextNode,
    HumanGate:       HumanGate,
    EvidenceRecord:  EvidenceRecord,
    ObligationToken: ObligationToken,
    ReuseMarker:     ReuseMarker,
    SystemField:     SystemField,
    WorkLane:        WorkLane,
    MetricStrip:     MetricStrip,
    StoryKit:        window.StoryKit,
  };

}());
