/* ============================================================
 * ConnectorRouting
 * SVG path generation for connector routing strategies.
 *
 * Exposes: window.ConnectorRouting
 * Pattern: IIFE, no build step, no external dependencies.
 * British English throughout.
 * ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
   * Internal helpers
   * ============================================================ */

  /** Round a number to 2 decimal places for tidy SVG output. */
  function f(n) { return Math.round(n * 100) / 100; }

  /* ============================================================
   * smoothPolyline (internal)
   *
   * Convert an array of waypoints into a smooth SVG path string.
   * Interior corners are rounded using quadratic Bezier curves
   * (Q command) so that no hard 90-degree angles appear.
   *
   * pts : Array<{ x, y }>
   * r   : elbow radius in SVG user units
   * ============================================================ */
  function smoothPolyline(pts, r) {
    if (!pts || pts.length < 2) return '';
    r = (r == null) ? 12 : r;

    if (pts.length === 2) {
      return 'M ' + f(pts[0].x) + ' ' + f(pts[0].y) +
             ' L ' + f(pts[1].x) + ' ' + f(pts[1].y);
    }

    var d = 'M ' + f(pts[0].x) + ' ' + f(pts[0].y);

    for (var i = 1; i < pts.length - 1; i++) {
      var prev = pts[i - 1];
      var curr = pts[i];
      var next = pts[i + 1];

      var dx1  = curr.x - prev.x;
      var dy1  = curr.y - prev.y;
      var len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

      var dx2  = next.x - curr.x;
      var dy2  = next.y - curr.y;
      var len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      if (len1 < 0.001 || len2 < 0.001) continue;

      /* Clamp the rounding radius to half the shortest adjacent segment */
      var t = Math.min(r, len1 / 2, len2 / 2);

      /* Tangent point approaching the corner */
      var bx = curr.x - t * (dx1 / len1);
      var by = curr.y - t * (dy1 / len1);

      /* Tangent point leaving the corner */
      var ax = curr.x + t * (dx2 / len2);
      var ay = curr.y + t * (dy2 / len2);

      d += ' L ' + f(bx) + ' ' + f(by);
      /* Quadratic bezier: control point = curr, end point = ax,ay */
      d += ' Q ' + f(curr.x) + ' ' + f(curr.y) + ' ' + f(ax) + ' ' + f(ay);
    }

    var last = pts[pts.length - 1];
    d += ' L ' + f(last.x) + ' ' + f(last.y);

    return d;
  }

  /* ============================================================
   * direct
   *
   * Straight-line connector between two boundary points.
   *
   * src, tgt : { x, y }
   * Returns  : SVG path d string
   * ============================================================ */
  function direct(src, tgt) {
    if (!src || !tgt) return '';
    return 'M ' + f(src.x) + ' ' + f(src.y) +
           ' L ' + f(tgt.x) + ' ' + f(tgt.y);
  }

  /* ============================================================
   * orthogonal
   *
   * Orthogonal (right-angle) connector with smooth rounded elbows.
   *
   * src, tgt             : { x, y }  -- boundary points (clearance applied)
   * srcNormal, tgtNormal : { dx, dy } -- outward unit normals
   * elbowRadius          : number    -- corner rounding radius (default 12)
   *
   * Strategy:
   *  1. Exit src along srcNormal for at least minLeg units.
   *  2. Enter tgt along -tgtNormal for at least minLeg units.
   *  3. Connect the two exit/entry segments with axis-aligned waypoints.
   *  4. Smooth all corners with smoothPolyline.
   * ============================================================ */
  function orthogonal(src, tgt, srcNormal, tgtNormal, elbowRadius) {
    if (!src || !tgt) return '';

    elbowRadius = (elbowRadius == null) ? 12 : elbowRadius;
    srcNormal   = srcNormal  || { dx: 1, dy: 0 };
    tgtNormal   = tgtNormal  || { dx: -1, dy: 0 };

    var minLeg = Math.max(elbowRadius * 2, 24);

    /* Points after exiting src and before entering tgt */
    var ex = {
      x: src.x + srcNormal.dx * minLeg,
      y: src.y + srcNormal.dy * minLeg
    };
    var en = {
      x: tgt.x + tgtNormal.dx * minLeg,
      y: tgt.y + tgtNormal.dy * minLeg
    };

    /* Axis classification */
    var srcHoriz = Math.abs(srcNormal.dx) > 0.5;
    var tgtHoriz = Math.abs(tgtNormal.dx) > 0.5;

    var pts = [src, ex];

    if (srcHoriz && tgtHoriz) {
      /* Both exits are horizontal -- need a vertical mid-segment */
      var sameXDir = srcNormal.dx * tgtNormal.dx > 0;
      if (sameXDir) {
        /* U-shaped route: extend past the further exit, then come back */
        var extX = (srcNormal.dx > 0)
          ? Math.max(ex.x, en.x) + 40
          : Math.min(ex.x, en.x) - 40;
        pts.push({ x: extX, y: ex.y });
        pts.push({ x: extX, y: en.y });
      } else {
        /* S-shaped: vertical mid-segment at the midpoint x */
        var midX = (ex.x + en.x) / 2;
        pts.push({ x: midX, y: ex.y });
        pts.push({ x: midX, y: en.y });
      }
    } else if (!srcHoriz && !tgtHoriz) {
      /* Both exits are vertical -- need a horizontal mid-segment */
      var sameYDir = srcNormal.dy * tgtNormal.dy > 0;
      if (sameYDir) {
        var extY = (srcNormal.dy > 0)
          ? Math.max(ex.y, en.y) + 40
          : Math.min(ex.y, en.y) - 40;
        pts.push({ x: ex.x, y: extY });
        pts.push({ x: en.x, y: extY });
      } else {
        var midY = (ex.y + en.y) / 2;
        pts.push({ x: ex.x, y: midY });
        pts.push({ x: en.x, y: midY });
      }
    } else if (srcHoriz && !tgtHoriz) {
      /* Horizontal exit, vertical entry -- L-shape with one corner */
      pts.push({ x: en.x, y: ex.y });
    } else {
      /* Vertical exit, horizontal entry -- L-shape with one corner */
      pts.push({ x: ex.x, y: en.y });
    }

    pts.push(en);
    pts.push(tgt);

    return smoothPolyline(pts, elbowRadius);
  }

  /* ============================================================
   * bus
   *
   * Bus connector: multiple source boundary points feed into a
   * shared axis (spine), then a single segment runs to the target.
   *
   * sources        : Array<{ x, y }>  -- source boundary points
   * axis           : 'x' | 'y'
   *   'x' = vertical spine at x = busX_or_busY
   *   'y' = horizontal spine at y = busX_or_busY
   * busX_or_busY   : number  -- position of the shared bus axis
   * target         : { x, y }
   * elbowRadius    : number
   *
   * Returns: a compound SVG path d string (multiple M...L subpaths).
   * ============================================================ */
  function bus(sources, axis, busX_or_busY, target, elbowRadius) {
    if (!sources || sources.length === 0 || !target) return '';

    elbowRadius = (elbowRadius == null) ? 12 : elbowRadius;
    axis        = axis || 'x';

    var busCoord = busX_or_busY || 0;
    var compound = '';

    if (axis === 'x') {
      /* Vertical spine at x = busCoord */
      var busYs = [];

      for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        if (!s) continue;
        compound += ' ' + smoothPolyline(
          [s, { x: busCoord, y: s.y }],
          elbowRadius
        );
        busYs.push(s.y);
      }

      /* Include target's y so the spine always reaches it */
      busYs.push(target.y);

      var minY = Math.min.apply(null, busYs);
      var maxY = Math.max.apply(null, busYs);

      /* Spine segment along the bus */
      if (maxY - minY > 0.1) {
        compound += ' M ' + f(busCoord) + ' ' + f(minY) +
                    ' L ' + f(busCoord) + ' ' + f(maxY);
      }

      /* Spine to target */
      compound += ' ' + smoothPolyline(
        [{ x: busCoord, y: target.y }, target],
        elbowRadius
      );

    } else {
      /* Horizontal spine at y = busCoord */
      var busXs = [];

      for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        if (!s) continue;
        compound += ' ' + smoothPolyline(
          [s, { x: s.x, y: busCoord }],
          elbowRadius
        );
        busXs.push(s.x);
      }

      busXs.push(target.x);

      var minX = Math.min.apply(null, busXs);
      var maxX = Math.max.apply(null, busXs);

      if (maxX - minX > 0.1) {
        compound += ' M ' + f(minX) + ' ' + f(busCoord) +
                    ' L ' + f(maxX) + ' ' + f(busCoord);
      }

      compound += ' ' + smoothPolyline(
        [{ x: target.x, y: busCoord }, target],
        elbowRadius
      );
    }

    return compound.trim();
  }

  /* ============================================================
   * chooseMode
   *
   * Automatically select a routing strategy based on the
   * relative positions of registered node descriptors.
   *
   * src, tgt  : node descriptors with a .pos { x, y } property
   * allNodes  : optional array of all nodes (used to detect bus patterns)
   *
   * Returns: 'direct' | 'orthogonal' | 'bus'
   * ============================================================ */
  function chooseMode(src, tgt, allNodes) {
    if (!src || !tgt) return 'direct';

    /* If three or more nodes share the same target, suggest a bus */
    if (Array.isArray(allNodes) && allNodes.length >= 3) {
      return 'bus';
    }

    var sp = src.pos || { x: 0, y: 0 };
    var tp = tgt.pos || { x: 0, y: 0 };

    var dx = Math.abs(tp.x - sp.x);
    var dy = Math.abs(tp.y - sp.y);

    /* Prefer orthogonal routing when there is meaningful positional offset */
    if (dy > 30 || dx > 50) return 'orthogonal';

    return 'direct';
  }

  /* ============================================================
   * Public API
   * ============================================================ */
  global.ConnectorRouting = {
    direct:      direct,
    orthogonal:  orthogonal,
    bus:         bus,
    chooseMode:  chooseMode
  };

}(window));
