/* ============================================================
 * ConnectorDebug
 * Debug overlay for the ConnectorEngine.
 *
 * Draws bounding boxes, port dots, path hitboxes and endpoint
 * clearance circles over the SVG; writes a console report.
 * Activated automatically when the URL contains ?debug=connectors.
 *
 * Exposes: window.ConnectorDebug
 * Pattern: IIFE, no build step, no external dependencies.
 * British English throughout.
 * ============================================================ */
(function (global) {
  'use strict';

  var NS            = 'http://www.w3.org/2000/svg';
  var DEBUG_ATTR    = 'data-ce-layer';
  var DEBUG_VAL     = 'debug';

  /* ============================================================
   * _findSvgEl (internal)
   *
   * Attempt to locate the SVG element that the engine is drawing
   * into, starting from the registered nodes.
   * ============================================================ */
  function _findSvgEl(engine) {
    var nodes = engine.nodes ? engine.nodes() : {};
    var ids   = Object.keys(nodes);

    for (var i = 0; i < ids.length; i++) {
      var el = nodes[ids[i]].el;
      if (!el) continue;
      /* Walk up the DOM looking for an <svg> ancestor */
      var ancestor = el;
      while (ancestor) {
        if (ancestor.tagName && ancestor.tagName.toLowerCase() === 'svg') {
          return ancestor;
        }
        ancestor = ancestor.parentElement;
      }
    }

    /* Fallback: find the SVG via the connector layer */
    var layer = document.querySelector('g[data-ce-layer="connectors"]');
    if (layer) {
      var closest = layer;
      while (closest) {
        if (closest.tagName && closest.tagName.toLowerCase() === 'svg') return closest;
        closest = closest.parentElement;
      }
    }

    return null;
  }

  /* ============================================================
   * _svgEl (internal shorthand)
   * ============================================================ */
  function _el(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        el.setAttribute(k, attrs[k]);
      }
    }
    el.setAttribute('pointer-events', 'none');
    return el;
  }

  /* ============================================================
   * _text (internal shorthand)
   * ============================================================ */
  function _txt(x, y, content, fill, size, anchor) {
    var t = _el('text', {
      x:             String(x),
      y:             String(y),
      'font-size':   String(size || 8),
      fill:          fill || 'rgba(34,211,238,0.9)',
      'text-anchor': anchor || 'middle'
    });
    t.textContent = content;
    return t;
  }

  /* ============================================================
   * activate
   *
   * Draw debug overlays for all registered nodes and connectors
   * in the given engine instance. Writes a console report.
   * ============================================================ */
  function activate(engine) {
    if (!engine) {
      console.warn('[ConnectorDebug] No engine instance provided to activate().');
      return;
    }

    /* Start clean */
    deactivate(engine);

    var nodes      = engine.nodes      ? engine.nodes()      : {};
    var connectors = engine.connectors ? engine.connectors() : {};
    var svgEl      = _findSvgEl(engine);

    if (!svgEl) {
      console.warn('[ConnectorDebug] Could not locate an SVG element. ' +
                   'Register at least one node before calling activate().');
      return;
    }

    /* Create a dedicated debug layer at the top of the SVG */
    var debugLayer = _el('g', {});
    debugLayer.setAttribute(DEBUG_ATTR, DEBUG_VAL);
    svgEl.appendChild(debugLayer);

    var Geom  = global.ConnectorGeometry || {};
    var Ports = global.ConnectorPorts    || {};

    /* ---- Node overlays ---- */
    Object.keys(nodes).forEach(function (id) {
      var node = nodes[id];
      if (!node || !node.el) return;

      /* Resolve the node rect in SVG space */
      var rect = null;
      if (node.el instanceof SVGElement) {
        try {
          var bb = node.el.getBBox();
          rect = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
        } catch (e) { return; }
      } else if (Geom.htmlElToSvgRect) {
        rect = Geom.htmlElToSvgRect(svgEl, node.el);
      }
      if (!rect || rect.width === 0) return;

      /* Dashed red bounding box */
      debugLayer.appendChild(_el('rect', {
        'class':  'ce-debug-box',
        x:        String(Math.round(rect.x * 100) / 100),
        y:        String(Math.round(rect.y * 100) / 100),
        width:    String(Math.round(rect.width  * 100) / 100),
        height:   String(Math.round(rect.height * 100) / 100)
      }));

      /* Node id label */
      debugLayer.appendChild(
        _txt(rect.x + 4, rect.y + 11, id, 'rgba(239,68,68,0.9)', 9, 'start')
      );

      /* Cyan port dots and labels */
      if (Ports.portsForRect) {
        var portMap = Ports.portsForRect(rect);
        Object.keys(portMap).forEach(function (pname) {
          var p = portMap[pname];
          /* Port dot */
          debugLayer.appendChild(_el('circle', {
            'class': 'ce-debug-port',
            cx:      String(Math.round(p.x * 100) / 100),
            cy:      String(Math.round(p.y * 100) / 100),
            r:       '3'
          }));
          /* Port name label, offset along the outward normal */
          var nx = p.normal ? p.normal.dx : 0;
          var ny = p.normal ? p.normal.dy : 0;
          debugLayer.appendChild(
            _txt(p.x + nx * 12, p.y + ny * 12,
                 pname, 'rgba(34,211,238,0.85)', 7, 'middle')
          );
        });
      }
    });

    /* ---- Connector overlays ---- */
    Object.keys(connectors).forEach(function (id) {
      var conn = connectors[id];
      if (!conn || !conn.pathEl) return;

      var d = conn.pathEl.getAttribute('d') || '';
      if (!d) return;

      var srcRole = (conn.opts || {}).srcRole || 'out';
      var tgtRole = (conn.opts || {}).tgtRole || 'in';

      /* Wide semi-transparent hitbox */
      var hitbox = _el('path', {
        d:             d,
        fill:          'none',
        stroke:        'rgba(161,0,255,0.15)',
        'stroke-width': '10'
      });
      hitbox.setAttribute('class', 'ce-debug-hitbox');
      debugLayer.appendChild(hitbox);

      /* Source endpoint circle and port label */
      var mMatch = d.match(/^M\s*([-\d.]+)\s+([-\d.]+)/);
      if (mMatch) {
        var sx = parseFloat(mMatch[1]);
        var sy = parseFloat(mMatch[2]);
        debugLayer.appendChild(_el('circle', {
          cx:              String(sx),
          cy:              String(sy),
          r:               '5',
          fill:            'none',
          stroke:          'rgba(251,191,36,0.7)',
          'stroke-width':  '1',
          'stroke-dasharray': '2 1'
        }));
        debugLayer.appendChild(
          _txt(sx, sy - 9, id + ':' + srcRole, 'rgba(251,191,36,0.9)', 8, 'middle')
        );
      }

      /* Target endpoint circle and port label
       * Parse the final L or M command to locate the last point. */
      var lMatch = d.match(/[LM]\s*([-\d.]+)\s+([-\d.]+)\s*$/);
      if (lMatch) {
        var ex = parseFloat(lMatch[1]);
        var ey = parseFloat(lMatch[2]);
        debugLayer.appendChild(_el('circle', {
          cx:              String(ex),
          cy:              String(ey),
          r:               '5',
          fill:            'none',
          stroke:          'rgba(34,211,238,0.7)',
          'stroke-width':  '1',
          'stroke-dasharray': '2 1'
        }));
        debugLayer.appendChild(
          _txt(ex, ey + 16, tgtRole, 'rgba(34,211,238,0.9)', 8, 'middle')
        );
      }
    });

    /* ---- V25 endpoint distance validation ---- */
    var ENDPOINT_THRESHOLD = 3; /* px -- V25 release requirement */
    var thresholdViolations = [];

    Object.keys(connectors).forEach(function (id) {
      var conn = connectors[id];
      if (!conn || !conn.pathEl) return;
      var d = conn.pathEl.getAttribute('d') || '';
      var lMatch = d.match(/[LM]\s*([-\d.]+)\s+([-\d.]+)\s*$/);
      if (!lMatch) return;
      var ex = parseFloat(lMatch[1]);
      var ey = parseFloat(lMatch[2]);

      /* Find the target node element */
      var tgtId = (conn.opts || {}).target;
      if (!tgtId || !nodes[tgtId] || !nodes[tgtId].el) return;
      var tgtEl = nodes[tgtId].el;
      var tgtRect = null;
      try {
        if (tgtEl instanceof SVGElement) {
          var bb = tgtEl.getBBox();
          tgtRect = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
        }
      } catch(e) { return; }
      if (!tgtRect) return;

      /* Point-to-rect distance (0 if inside or on boundary) */
      var dx = Math.max(tgtRect.x - ex, 0, ex - (tgtRect.x + tgtRect.width));
      var dy = Math.max(tgtRect.y - ey, 0, ey - (tgtRect.y + tgtRect.height));
      var dist = Math.sqrt(dx * dx + dy * dy);

      /* Draw endpoint distance label */
      debugLayer.appendChild(
        _txt(ex + 4, ey - 4,
             dist.toFixed(1) + 'px',
             dist > ENDPOINT_THRESHOLD ? 'rgba(255,80,80,0.95)' : 'rgba(88,201,148,0.9)',
             7, 'start')
      );

      if (dist > ENDPOINT_THRESHOLD) {
        thresholdViolations.push({ id: id, dist: dist.toFixed(2) });
      }
    });

    /* ---- Console report ---- */
    var vb          = svgEl.viewBox && svgEl.viewBox.baseVal;
    var clientRect  = svgEl.getBoundingClientRect();
    var nodeCount   = Object.keys(nodes).length;
    var connCount   = Object.keys(connectors).length;

    /* Count connectors with empty paths (invalid routes) */
    var invalid = Object.keys(connectors).filter(function (id) {
      var c = connectors[id];
      return !c.pathEl || !(c.pathEl.getAttribute('d') || '').trim();
    });

    /* Estimate crossing count via bounding-box overlap of path elements */
    var pathEls = Object.keys(connectors).map(function (id) {
      return connectors[id].pathEl;
    }).filter(Boolean);

    var crossings = 0;
    try {
      for (var i = 0; i < pathEls.length; i++) {
        for (var j = i + 1; j < pathEls.length; j++) {
          var b1 = pathEls[i].getBBox();
          var b2 = pathEls[j].getBBox();
          var overlapX = b1.x < b2.x + b2.width  && b1.x + b1.width  > b2.x;
          var overlapY = b1.y < b2.y + b2.height && b1.y + b1.height > b2.y;
          if (overlapX && overlapY) crossings++;
        }
      }
    } catch (e) { /* getBBox may throw if SVG is not rendered */ }

    console.group('[ConnectorDebug] Engine report -- V25');
    console.log('Viewport          : ' +
      Math.round(clientRect.width) + ' x ' + Math.round(clientRect.height) + ' px');
    console.log('ViewBox           : ' + (vb
      ? [vb.x, vb.y, vb.width, vb.height].map(Math.round).join(' ')
      : 'not set'));
    console.log('Nodes             : ' + nodeCount);
    console.log('Connectors        : ' + connCount);
    console.log('Invalid routes    : ' + invalid.length +
      (invalid.length > 0 ? ' (' + invalid.join(', ') + ')' : ''));
    console.log('Crossings         : ' + crossings + ' (bounding-box estimate)');
    console.log('Endpoint >3px     : ' + thresholdViolations.length +
      (thresholdViolations.length > 0
        ? ' -- ' + thresholdViolations.map(function(v) { return v.id + '(' + v.dist + ')'; }).join(', ')
        : ' -- OK'));
    if (thresholdViolations.length > 0) {
      console.warn('[ConnectorDebug] V25 threshold violation: ' + thresholdViolations.length +
        ' connector(s) miss their target outline by more than ' + ENDPOINT_THRESHOLD + 'px');
    }
    console.groupEnd();
  }

  /* ============================================================
   * deactivate
   *
   * Remove all debug overlays from the SVG.
   * ============================================================ */
  function deactivate(engine) {
    /* Remove by data attribute -- handles multiple SVGs on one page */
    var layers = document.querySelectorAll('g[' + DEBUG_ATTR + '="' + DEBUG_VAL + '"]');
    for (var i = 0; i < layers.length; i++) {
      layers[i].parentNode && layers[i].parentNode.removeChild(layers[i]);
    }
  }

  /* ============================================================
   * autoActivate
   *
   * Check for ?debug=connectors in the page URL and activate if
   * found. Defers by 200 ms to allow the engine's initial
   * recalculate() to complete.
   * ============================================================ */
  function autoActivate(engine) {
    if (!engine) return;
    try {
      var params = new URLSearchParams(
        (global.location && global.location.search) || ''
      );
      if (params.get('debug') === 'connectors') {
        setTimeout(function () { activate(engine); }, 200);
      }
    } catch (e) {
      /* URLSearchParams not available in older environments -- skip */
    }
  }

  /* ============================================================
   * Public API
   * ============================================================ */
  global.ConnectorDebug = {
    activate:     activate,
    deactivate:   deactivate,
    autoActivate: autoActivate
  };

}(window));
