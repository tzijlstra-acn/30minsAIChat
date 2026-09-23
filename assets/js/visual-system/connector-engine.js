/* ============================================================
 * ConnectorEngine
 * Shared connector rendering engine for the NFR pitch deck.
 * Replaces scene-specific hard-coded arrow positioning.
 *
 * Dependencies (must be loaded first):
 *   ConnectorGeometry  (geometry.js)
 *   ConnectorPorts     (ports.js)
 *   ConnectorRouting   (connector-routing.js)
 *
 * Exposes: window.ConnectorEngine
 * Pattern: IIFE, no build step, no external dependencies.
 * British English throughout.
 * ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ============================================================
   * Marker definitions
   *
   * Each marker is injected as an SVG string into the <defs> block
   * on engine initialisation. The prefix is configurable so that
   * multiple engines on a single page do not create ID collisions.
   *
   * All markers share:
   *   markerUnits="strokeWidth"
   *   orient="auto"
   *   viewBox="0 0 10 10"
   *   refX="8.2"  refY="5"
   *   markerWidth="7"  markerHeight="7"
   * ============================================================ */
  var MARKER_DEFS = [
    {
      key: 'primary',
      /* Filled triangle, uses the path stroke colour */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-primary"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0 0 L 10 5 L 0 10 Z"' +
               ' fill="var(--border-2, #4B5067)"/></marker>';
      }
    },
    {
      key: 'context',
      /* Open triangle, cyan */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-context"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0 0 L 10 5 L 0 10"' +
               ' fill="none" stroke="var(--cyan, #55C7E8)"' +
               ' stroke-width="1.5"/></marker>';
      }
    },
    {
      key: 'human',
      /* Amber filled triangle, slightly inset for a rounder feel */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-human"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0.5 0.5 L 9.5 5 L 0.5 9.5 Z"' +
               ' fill="var(--amber, #F3B34C)"/></marker>';
      }
    },
    {
      key: 'control',
      /* Green filled triangle */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-control"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0 0 L 10 5 L 0 10 Z"' +
               ' fill="var(--green, #58C994)"/></marker>';
      }
    },
    {
      key: 'evidence',
      /* Green double-chevron (two staggered V-shapes) */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-evidence"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0 2 L 7 5 L 0 8"' +
               ' fill="none" stroke="var(--green, #58C994)" stroke-width="1.5"/>' +
               '<path d="M 3 2 L 10 5 L 3 8"' +
               ' fill="none" stroke="var(--green, #58C994)" stroke-width="1.5"/>' +
               '</marker>';
      }
    },
    {
      key: 'hypothesis',
      /* Grey open triangle */
      svg: function (pfx) {
        return '<marker id="' + pfx + '-ce-arrow-hypothesis"' +
               ' markerUnits="strokeWidth" orient="auto"' +
               ' viewBox="0 0 10 10" refX="8.2" refY="5"' +
               ' markerWidth="7" markerHeight="7">' +
               '<path d="M 0 0 L 10 5 L 0 10"' +
               ' fill="none" stroke="var(--text-3, #A4A9B7)"' +
               ' stroke-width="1.5"/></marker>';
      }
    }
  ];

  /* ============================================================
   * Dependency accessor
   * Logs a warning if a dependency is missing but does not throw.
   * ============================================================ */
  function dep(name) {
    if (!global[name]) {
      console.warn('[ConnectorEngine] ' + name +
        ' is not available on window. Load it before connector-engine.js.');
    }
    return global[name] || {};
  }

  /* ============================================================
   * init
   *
   * Initialise the engine for a given SVG element.
   *
   * svgEl   : HTMLElement (the <svg> node)
   * options : {
   *   markerPrefix  : string  (default 'ce')
   *   defaultStroke : number  (default 1.5)
   *   defaultColor  : string  (default 'var(--border-2, #4B5067)')
   * }
   *
   * Returns an engine instance.
   * ============================================================ */
  function init(svgEl, options) {
    if (!svgEl) {
      console.warn('[ConnectorEngine] init() requires a valid SVG element.');
      return null;
    }

    options = options || {};
    var markerPrefix  = options.markerPrefix  || 'ce';
    var defaultStroke = (options.defaultStroke != null) ? options.defaultStroke : 1.5;
    var defaultColor  = options.defaultColor  || 'var(--border-2, #4B5067)';

    /* Internal registries */
    var _nodes      = {};
    var _connectors = {};

    /* Layer elements (created lazily in _ensureLayers) */
    var _connLayer  = null;
    var _labelLayer = null;

    /* ResizeObserver + debounce state */
    var _observer     = null;
    var _debounceId   = null;

    /* ---- Inject SVG marker definitions ---- */
    function _ensureDefs() {
      var defs = svgEl.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS(NS, 'defs');
        svgEl.insertBefore(defs, svgEl.firstChild);
      }

      /* Only inject if the primary marker is absent */
      if (!defs.querySelector('#' + markerPrefix + '-ce-arrow-primary')) {
        var html = '';
        for (var i = 0; i < MARKER_DEFS.length; i++) {
          html += MARKER_DEFS[i].svg(markerPrefix);
        }
        defs.insertAdjacentHTML('beforeend', html);
      }
    }

    /* ---- Create or locate the connector and label layers ---- */
    function _ensureLayers() {
      /* Connector layer -- must sit BEHIND node content */
      _connLayer = svgEl.querySelector('g[data-ce-layer="connectors"]');
      if (!_connLayer) {
        _connLayer = document.createElementNS(NS, 'g');
        _connLayer.setAttribute('data-ce-layer', 'connectors');

        var nodesLayer = svgEl.querySelector('g[data-ce-layer="nodes"]');
        if (nodesLayer) {
          /* Insert before the nodes group so connectors render behind */
          svgEl.insertBefore(_connLayer, nodesLayer);
        } else {
          /* Insert immediately after <defs>, or as second child */
          var defs = svgEl.querySelector('defs');
          if (defs && defs.nextSibling) {
            svgEl.insertBefore(_connLayer, defs.nextSibling);
          } else {
            svgEl.appendChild(_connLayer);
          }
        }
      }

      /* Label layer -- appended last so labels render on top */
      _labelLayer = svgEl.querySelector('g[data-ce-layer="connector-labels"]');
      if (!_labelLayer) {
        _labelLayer = document.createElementNS(NS, 'g');
        _labelLayer.setAttribute('data-ce-layer', 'connector-labels');
        svgEl.appendChild(_labelLayer);
      }
    }

    /* ---- Resolve bounding rect for a node element ---- */
    function _rectForNode(node) {
      var el   = node.el;
      var opts = node.opts || {};
      if (!el) return null;

      var Geom = dep('ConnectorGeometry');

      if (el instanceof SVGElement) {
        try {
          var bbox = el.getBBox();
          return {
            x:      bbox.x,
            y:      bbox.y,
            width:  bbox.width,
            height: bbox.height,
            rx:     opts.rx != null ? opts.rx : 8,
            cx:     bbox.x + bbox.width  / 2,
            cy:     bbox.y + bbox.height / 2
          };
        } catch (e) {
          return null;
        }
      }

      /* HTML element -- convert via viewBox mapping */
      if (Geom.htmlElToSvgRect) {
        var r = Geom.htmlElToSvgRect(svgEl, el);
        r.rx = opts.rx != null ? opts.rx : 8;
        return r;
      }

      return null;
    }

    /* ---- Resolve a port position for a node given a semantic role ---- */
    function _portForRole(node, role) {
      var rect = _rectForNode(node);
      if (!rect) return { x: 0, y: 0, normal: { dx: 1, dy: 0 } };

      var Ports = dep('ConnectorPorts');
      var opts  = node.opts || {};

      /* Determine physical port name: custom override or semantic mapping */
      var physName;
      if (opts.ports && opts.ports[role] &&
          Array.isArray(opts.ports[role]) &&
          opts.ports[role].length > 0) {
        physName = opts.ports[role][0];
      } else {
        physName = (Ports.semanticToPhysical)
          ? Ports.semanticToPhysical(role || 'out', 'horizontal')
          : 'right';
      }

      var portMap = (Ports.portsForRect) ? Ports.portsForRect(rect) : {};
      return portMap[physName] || { x: rect.cx, y: rect.cy, normal: { dx: 1, dy: 0 } };
    }

    /* ---- Draw or redraw a single connector by id ---- */
    function _drawConnector(connId) {
      var conn = _connectors[connId];
      if (!conn) return;

      var srcNode = _nodes[conn.srcId];
      var tgtNode = _nodes[conn.tgtId];
      if (!srcNode || !tgtNode) return;

      var srcRect = _rectForNode(srcNode);
      var tgtRect = _rectForNode(tgtNode);
      if (!srcRect || !tgtRect) return;

      var opts = conn.opts || {};

      /* Resolve port descriptors */
      var srcPortPos = _portForRole(srcNode, opts.srcRole || 'out');
      var tgtPortPos = _portForRole(tgtNode, opts.tgtRole || 'in');

      /* Compute boundary exit/entry points (adjusted for stroke and clearance) */
      var Geom      = dep('ConnectorGeometry');
      var clearance = 4;

      var srcBound = (Geom.boundaryPoint)
        ? Geom.boundaryPoint(
            { x: srcRect.x, y: srcRect.y, width: srcRect.width, height: srcRect.height, rx: srcRect.rx },
            { x: srcRect.cx, y: srcRect.cy },
            srcPortPos,
            srcNode.opts.strokeW || 1,
            clearance
          )
        : { x: srcPortPos.x, y: srcPortPos.y };

      var tgtBound = (Geom.boundaryPoint)
        ? Geom.boundaryPoint(
            { x: tgtRect.x, y: tgtRect.y, width: tgtRect.width, height: tgtRect.height, rx: tgtRect.rx },
            { x: tgtRect.cx, y: tgtRect.cy },
            tgtPortPos,
            tgtNode.opts.strokeW || 1,
            clearance
          )
        : { x: tgtPortPos.x, y: tgtPortPos.y };

      /* Choose routing strategy */
      var Routing = dep('ConnectorRouting');
      var mode    = opts.mode || 'auto';

      if (mode === 'auto' && Routing.chooseMode) {
        mode = Routing.chooseMode(
          { pos: { x: srcRect.cx, y: srcRect.cy } },
          { pos: { x: tgtRect.cx, y: tgtRect.cy } },
          null
        );
      } else if (mode === 'auto') {
        mode = 'orthogonal';
      }

      /* Generate path string */
      var pathD = '';
      if (mode === 'bus') {
        /* Bus mode at the single-connect level: route as orthogonal.
         * For multi-source bus layout, call ConnectorRouting.bus() directly
         * after registering all sources, then pass the compound path to
         * a manually created <path> element. */
        if (Routing.orthogonal) {
          pathD = Routing.orthogonal(srcBound, tgtBound, srcPortPos.normal, tgtPortPos.normal, 12);
        }
      } else if (mode === 'orthogonal' && Routing.orthogonal) {
        pathD = Routing.orthogonal(srcBound, tgtBound, srcPortPos.normal, tgtPortPos.normal, 12);
      } else if (Routing.direct) {
        pathD = Routing.direct(srcBound, tgtBound);
      }

      /* Marker ID */
      var markerType = opts.marker || 'primary';
      var markerId   = markerPrefix + '-ce-arrow-' + markerType;

      /* Create or retrieve the <path> element */
      var pathEl = conn.pathEl;
      if (!pathEl) {
        pathEl = document.createElementNS(NS, 'path');
        pathEl.setAttribute('data-ce-id', connId);
        pathEl.setAttribute('pointer-events', 'none');
        _connLayer.appendChild(pathEl);
        conn.pathEl = pathEl;
      }

      /* Apply attributes */
      pathEl.setAttribute('d', pathD);
      pathEl.setAttribute('class', 'ce-path ce-path--' + markerType);
      pathEl.setAttribute('marker-end', 'url(#' + markerId + ')');

      if (opts.stroke    != null) pathEl.setAttribute('stroke-width', String(opts.stroke));
      if (opts.color)             pathEl.setAttribute('stroke', opts.color);
      if (opts.dashArray)         pathEl.setAttribute('stroke-dasharray', opts.dashArray);

      /* Connector label */
      var labelEl = conn.labelEl;
      if (opts.label) {
        if (!labelEl) {
          labelEl = document.createElementNS(NS, 'text');
          labelEl.setAttribute('pointer-events', 'none');
          labelEl.setAttribute('class', 'ce-label');
          _labelLayer.appendChild(labelEl);
          conn.labelEl = labelEl;
        }
        var lx = (srcBound.x + tgtBound.x) / 2 + (opts.labelOffset ? opts.labelOffset.x : 0);
        var ly = (srcBound.y + tgtBound.y) / 2 + (opts.labelOffset ? opts.labelOffset.y : -8);
        labelEl.setAttribute('x', String(lx));
        labelEl.setAttribute('y', String(ly));
        labelEl.setAttribute('text-anchor', 'middle');
        labelEl.setAttribute('dominant-baseline', 'middle');
        labelEl.textContent = opts.label;
      } else if (labelEl) {
        labelEl.textContent = '';
      }
    }

    /* ============================================================
     * Public instance API
     * ============================================================ */

    /**
     * Register a connectable node.
     * id   : unique string
     * el   : HTML element or SVG <g> element
     * opts : {
     *   ports   : { 'in': ['left'], 'out': ['right'], ... }
     *   shape   : 'rect' | 'circle' | 'diamond'
     *   rx      : number  (border-radius for rects)
     *   strokeW : number  (border stroke width)
     * }
     */
    function register(id, el, opts) {
      if (!id || !el) return;
      _nodes[id] = { id: id, el: el, opts: opts || {} };
    }

    /**
     * Draw or redraw a connector between two registered nodes.
     * id             : unique connector id
     * srcId, tgtId   : registered node ids
     * opts : {
     *   srcRole    : semantic port role on source  (default 'out')
     *   tgtRole    : semantic port role on target  (default 'in')
     *   mode       : 'direct' | 'orthogonal' | 'bus' | 'auto'
     *   marker     : 'primary' | 'context' | 'human' | 'control' | 'evidence' | 'hypothesis'
     *   stroke     : number
     *   color      : string
     *   dashArray  : string | null
     *   label      : string | null
     *   labelOffset: { x, y }
     * }
     * Returns: the created <path> element, or null on failure.
     */
    function connect(id, srcId, tgtId, opts) {
      if (!id || !srcId || !tgtId) return null;
      opts = opts || {};

      /* Remove any existing connector with this id */
      if (_connectors[id]) {
        if (_connectors[id].pathEl)  _connectors[id].pathEl.remove();
        if (_connectors[id].labelEl) _connectors[id].labelEl.remove();
      }

      _connectors[id] = {
        id:      id,
        srcId:   srcId,
        tgtId:   tgtId,
        opts:    opts,
        pathEl:  null,
        labelEl: null
      };

      _drawConnector(id);
      return _connectors[id].pathEl || null;
    }

    /**
     * Remove a connector by id.
     */
    function disconnect(id) {
      var conn = _connectors[id];
      if (!conn) return;
      if (conn.pathEl)  conn.pathEl.remove();
      if (conn.labelEl) conn.labelEl.remove();
      delete _connectors[id];
    }

    /**
     * Recalculate all connectors.
     * Call after layout changes, resize events, or theme changes.
     */
    function recalculate() {
      var ids = Object.keys(_connectors);
      for (var i = 0; i < ids.length; i++) {
        _drawConnector(ids[i]);
      }
    }

    /**
     * Destroy the engine instance and remove all drawn elements.
     */
    function destroy() {
      var ids = Object.keys(_connectors);
      for (var i = 0; i < ids.length; i++) {
        disconnect(ids[i]);
      }
      if (_connLayer)  _connLayer.remove();
      if (_labelLayer) _labelLayer.remove();
      if (_observer)   _observer.disconnect();
      if (_debounceId) clearTimeout(_debounceId);
      _nodes      = {};
      _connectors = {};
      _connLayer  = null;
      _labelLayer = null;
    }

    /** Return the internal node registry (for debug/inspection). */
    function nodes() { return _nodes; }

    /** Return the internal connector registry (for debug/inspection). */
    function connectors() { return _connectors; }

    /* ============================================================
     * Initialisation sequence
     * ============================================================ */
    _ensureDefs();
    _ensureLayers();

    /* Debounced ResizeObserver: recomputes layout after 150 ms of quiet */
    if (typeof ResizeObserver !== 'undefined') {
      _observer = new ResizeObserver(function () {
        clearTimeout(_debounceId);
        _debounceId = setTimeout(recalculate, 150);
      });
      _observer.observe(svgEl);
    }

    /* First layout pass after fonts are fully loaded */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { recalculate(); });
    } else {
      /* Graceful fallback for environments without fonts.ready */
      setTimeout(recalculate, 100);
    }

    return {
      register:    register,
      connect:     connect,
      disconnect:  disconnect,
      recalculate: recalculate,
      destroy:     destroy,
      nodes:       nodes,
      connectors:  connectors
    };
  }

  /* ============================================================
   * Public module API
   * ============================================================ */
  global.ConnectorEngine = {
    init: init
  };

}(window));
