/* ============================================================
 * ConnectorPorts
 * Port position resolution, semantic mapping and pair scoring
 * for the shared connector engine.
 *
 * Exposes: window.ConnectorPorts
 * Pattern: IIFE, no build step, no external dependencies.
 * British English throughout.
 * ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
   * portsForRect
   *
   * Returns the 8 named port positions for a given rect.
   * rect: { x, y, width, height }
   *
   * Each port: { x, y, normal: { dx, dy } }
   * Normal vectors point outward from the shape boundary.
   * ============================================================ */
  function portsForRect(rect) {
    if (!rect) return {};

    var x  = rect.x      || 0;
    var y  = rect.y      || 0;
    var w  = rect.width  || 0;
    var h  = rect.height || 0;
    var cx = x + w / 2;
    var cy = y + h / 2;
    var D  = 0.7071; /* cos(45 deg) */

    return {
      'top':          { x: cx,     y: y,     normal: { dx:  0,  dy: -1 } },
      'right':        { x: x + w,  y: cy,    normal: { dx:  1,  dy:  0 } },
      'bottom':       { x: cx,     y: y + h, normal: { dx:  0,  dy:  1 } },
      'left':         { x: x,      y: cy,    normal: { dx: -1,  dy:  0 } },
      'top-left':     { x: x,      y: y,     normal: { dx: -D,  dy: -D } },
      'top-right':    { x: x + w,  y: y,     normal: { dx:  D,  dy: -D } },
      'bottom-right': { x: x + w,  y: y + h, normal: { dx:  D,  dy:  D } },
      'bottom-left':  { x: x,      y: y + h, normal: { dx: -D,  dy:  D } }
    };
  }

  /* ============================================================
   * semanticToPhysical
   *
   * Maps a semantic port role to a physical port name.
   *
   * layout : 'horizontal' | 'vertical' | 'radial'
   * role   : 'in' | 'out' | 'human' | 'control' |
   *          'evidence' | 'exception' | 'context'
   *
   * Returns a port name string ('left', 'right', 'top', 'bottom', ...).
   * ============================================================ */
  /* V25 semantic port types (uppercase aliases accepted):
   * INPUT, OUTPUT, CONTEXT, HUMAN, CONTROL, EVIDENCE, EXCEPTION, REUSE
   * Legacy lowercase types are still accepted.
   */
  var SEMANTIC_MAP = {
    horizontal: {
      'in':        'left',
      'input':     'left',
      'INPUT':     'left',
      'out':       'right',
      'output':    'right',
      'OUTPUT':    'right',
      'human':     'top',
      'HUMAN':     'top',
      'control':   'top',
      'CONTROL':   'top',
      'evidence':  'bottom',
      'EVIDENCE':  'bottom',
      'exception': 'right',
      'EXCEPTION': 'right',
      'context':   'left',
      'CONTEXT':   'left',
      'reuse':     'bottom',
      'REUSE':     'bottom'
    },
    vertical: {
      'in':        'top',
      'input':     'top',
      'INPUT':     'top',
      'out':       'bottom',
      'output':    'bottom',
      'OUTPUT':    'bottom',
      'human':     'left',
      'HUMAN':     'left',
      'control':   'top',
      'CONTROL':   'top',
      'evidence':  'bottom',
      'EVIDENCE':  'bottom',
      'exception': 'right',
      'EXCEPTION': 'right',
      'context':   'left',
      'CONTEXT':   'left',
      'reuse':     'right',
      'REUSE':     'right'
    },
    radial: {
      'in':        'left',
      'input':     'left',
      'INPUT':     'left',
      'out':       'right',
      'output':    'right',
      'OUTPUT':    'right',
      'human':     'top',
      'HUMAN':     'top',
      'control':   'top',
      'CONTROL':   'top',
      'evidence':  'bottom',
      'EVIDENCE':  'bottom',
      'exception': 'right',
      'EXCEPTION': 'right',
      'context':   'left',
      'CONTEXT':   'left',
      'reuse':     'bottom',
      'REUSE':     'bottom'
    }
  };

  function semanticToPhysical(role, layout) {
    if (!role) return 'right';
    var map = SEMANTIC_MAP[layout] || SEMANTIC_MAP.horizontal;
    return map[role] || 'right';
  }

  /* ============================================================
   * scorePair
   *
   * Score a candidate port pair for a connection (lower = better).
   *
   * srcPos         : { x, y }  -- centre of the source node
   * srcPort        : { x, y, normal: { dx, dy } }  -- source port
   * tgtPos         : { x, y }  -- centre of the target node
   * tgtPort        : { x, y, normal: { dx, dy } }  -- target port
   * usedSrcPorts   : string[]  -- port names already in use on source
   * usedTgtPorts   : string[]  -- port names already in use on target
   *
   * Considers:
   *   - Manhattan distance between port positions
   *   - Reverse-direction penalty (port normal opposes connector direction)
   *   - Congestion penalty (port already used by another connector)
   * ============================================================ */
  function scorePair(srcPos, srcPort, tgtPos, tgtPort, usedSrcPorts, usedTgtPorts) {
    if (!srcPort || !tgtPort) return Infinity;

    usedSrcPorts = usedSrcPorts || [];
    usedTgtPorts = usedTgtPorts || [];

    /* Base score: manhattan distance between the two port positions */
    var score = Math.abs(srcPort.x - tgtPort.x) + Math.abs(srcPort.y - tgtPort.y);

    /* Reverse-direction penalty for the source port */
    if (srcPort.normal) {
      var toTgtX = tgtPort.x - srcPort.x;
      var toTgtY = tgtPort.y - srcPort.y;
      var toTgtLen = Math.sqrt(toTgtX * toTgtX + toTgtY * toTgtY);
      if (toTgtLen > 0.001) {
        var dotSrc = srcPort.normal.dx * (toTgtX / toTgtLen) +
                     srcPort.normal.dy * (toTgtY / toTgtLen);
        /* Connector travels opposite to the port's outward normal */
        if (dotSrc < 0) score += 200;
      }
    }

    /* Reverse-direction penalty for the target port */
    if (tgtPort.normal) {
      var fromSrcX = srcPort.x - tgtPort.x;
      var fromSrcY = srcPort.y - tgtPort.y;
      var fromSrcLen = Math.sqrt(fromSrcX * fromSrcX + fromSrcY * fromSrcY);
      if (fromSrcLen > 0.001) {
        var dotTgt = tgtPort.normal.dx * (fromSrcX / fromSrcLen) +
                     tgtPort.normal.dy * (fromSrcY / fromSrcLen);
        /* Connector arrives opposite to the port's outward normal */
        if (dotTgt < 0) score += 200;
      }
    }

    /* Congestion penalty: each additional use of the same port costs 30 */
    score += usedSrcPorts.length * 30;
    score += usedTgtPorts.length * 30;

    return score;
  }

  /* ============================================================
   * bestPair
   *
   * Find the best (lowest-score) port pair by exhaustive scoring.
   *
   * srcPorts     : Array<{ name: string, pos: { x, y, normal } }>
   * tgtPorts     : Array<{ name: string, pos: { x, y, normal } }>
   * usedSrcPorts : string[]  -- port names already used on source
   * usedTgtPorts : string[]  -- port names already used on target
   *
   * Returns: { srcPort, tgtPort }  -- the winning descriptors.
   * ============================================================ */
  function bestPair(srcPorts, tgtPorts, usedSrcPorts, usedTgtPorts) {
    if (!srcPorts || !tgtPorts ||
        srcPorts.length === 0 || tgtPorts.length === 0) {
      return { srcPort: null, tgtPort: null };
    }

    usedSrcPorts = usedSrcPorts || [];
    usedTgtPorts = usedTgtPorts || [];

    var bestScore = Infinity;
    var bestSrc   = srcPorts[0];
    var bestTgt   = tgtPorts[0];

    for (var i = 0; i < srcPorts.length; i++) {
      var sp = srcPorts[i];
      if (!sp || !sp.pos) continue;

      /* Count how many times this port name is already in use */
      var spUsed = usedSrcPorts.filter(function (p) { return p === sp.name; });

      for (var j = 0; j < tgtPorts.length; j++) {
        var tp = tgtPorts[j];
        if (!tp || !tp.pos) continue;

        var tpUsed = usedTgtPorts.filter(function (p) { return p === tp.name; });

        var score = scorePair(
          sp.pos,  /* srcPos  (port position used as node-centre proxy) */
          sp.pos,  /* srcPort */
          tp.pos,  /* tgtPos  (port position used as node-centre proxy) */
          tp.pos,  /* tgtPort */
          spUsed,
          tpUsed
        );

        if (score < bestScore) {
          bestScore = score;
          bestSrc   = sp;
          bestTgt   = tp;
        }
      }
    }

    return { srcPort: bestSrc, tgtPort: bestTgt };
  }

  /* ============================================================
   * Public API
   * ============================================================ */
  global.ConnectorPorts = {
    portsForRect:       portsForRect,
    semanticToPhysical: semanticToPhysical,
    scorePair:          scorePair,
    bestPair:           bestPair
  };

}(window));
