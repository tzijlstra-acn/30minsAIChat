// -- VISUAL GRAMMAR -- V26 --
// Reusable visual primitive factories for scene composition.
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
  };

}());
