/* ============================================================
 * ConnectorGeometry
 * Geometric utilities for the shared connector engine.
 *
 * Exposes: window.ConnectorGeometry
 * Pattern: IIFE, no build step, no external dependencies.
 * British English throughout.
 * ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
   * Internal helpers
   * ============================================================ */

  var EPS = 1e-9;

  /** Clamp n to [lo, hi]. */
  function clamp(n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; }

  /* ============================================================
   * boundaryPoint
   *
   * Returns the point on the (shrunk) rounded-rectangle boundary
   * where a ray from `center` toward `target` exits.
   *
   * rect     : { x, y, width, height, rx } -- SVG coordinate space
   * center   : { x, y }  -- centre of the rectangle
   * target   : { x, y }  -- point the ray aims toward
   * strokeW  : number    -- border stroke width
   * clearance: number    -- additional margin beyond stroke
   *
   * Algorithm:
   *  1. Shrink the rect inward by (strokeW/2 + clearance).
   *  2. Compute the normalised ray direction from center to target.
   *  3. Test intersections with each straight edge, excluding corner zones.
   *  4. Test intersections with each rounded-corner arc.
   *  5. Return the hit with the smallest positive t.
   * ============================================================ */
  function boundaryPoint(rect, center, target, strokeW, clearance) {
    if (!rect || !center || !target) return { x: 0, y: 0 };

    strokeW  = (strokeW  == null) ? 0 : strokeW;
    clearance = (clearance == null) ? 0 : clearance;

    var margin = strokeW / 2 + clearance;

    /* Shrunk rectangle */
    var sx = rect.x + margin;
    var sy = rect.y + margin;
    var sw = Math.max(0, (rect.width  || 0) - 2 * margin);
    var sh = Math.max(0, (rect.height || 0) - 2 * margin);
    var rx = clamp((rect.rx || 0), 0, Math.min(sw / 2, sh / 2));

    /* Ray direction (normalised) */
    var rdx = target.x - center.x;
    var rdy = target.y - center.y;
    var rlen = Math.sqrt(rdx * rdx + rdy * rdy);
    if (rlen < EPS) {
      /* Degenerate ray: return the right-edge midpoint */
      return { x: sx + sw, y: sy + sh / 2 };
    }
    var ndx = rdx / rlen;
    var ndy = rdy / rlen;

    var bestT  = Infinity;
    var bestPt = null;

    /* ---- Straight-edge intersections ----
     * Each edge is valid only outside the two corner zones of width rx.
     */

    /* Right edge: x = sx + sw */
    if (ndx > EPS) {
      var t = (sx + sw - center.x) / ndx;
      if (t > EPS) {
        var iy = center.y + t * ndy;
        if (iy >= sy + rx - EPS && iy <= sy + sh - rx + EPS) {
          if (t < bestT) { bestT = t; bestPt = { x: sx + sw, y: iy }; }
        }
      }
    }

    /* Left edge: x = sx */
    if (ndx < -EPS) {
      var t = (sx - center.x) / ndx;
      if (t > EPS) {
        var iy = center.y + t * ndy;
        if (iy >= sy + rx - EPS && iy <= sy + sh - rx + EPS) {
          if (t < bestT) { bestT = t; bestPt = { x: sx, y: iy }; }
        }
      }
    }

    /* Bottom edge: y = sy + sh */
    if (ndy > EPS) {
      var t = (sy + sh - center.y) / ndy;
      if (t > EPS) {
        var ix = center.x + t * ndx;
        if (ix >= sx + rx - EPS && ix <= sx + sw - rx + EPS) {
          if (t < bestT) { bestT = t; bestPt = { x: ix, y: sy + sh }; }
        }
      }
    }

    /* Top edge: y = sy */
    if (ndy < -EPS) {
      var t = (sy - center.y) / ndy;
      if (t > EPS) {
        var ix = center.x + t * ndx;
        if (ix >= sx + rx - EPS && ix <= sx + sw - rx + EPS) {
          if (t < bestT) { bestT = t; bestPt = { x: ix, y: sy }; }
        }
      }
    }

    /* ---- Rounded-corner arc intersections ----
     * Each corner is a quarter-circle of radius rx.
     * The arc centre and valid-quadrant predicate differ per corner.
     *
     * Intersection of ray P(t) = center + t*(ndx,ndy) with a circle
     * centred at (acx, acy) of radius rx:
     *   t^2 + 2t*(ex*ndx + ey*ndy) + (ex^2 + ey^2 - rx^2) = 0
     * where ex = center.x - acx, ey = center.y - acy.
     */
    if (rx > EPS) {
      var corners = [
        {
          /* Top-left */
          acx: sx + rx,
          acy: sy + rx,
          inQ: function (px, py) { return px <= sx + rx + EPS && py <= sy + rx + EPS; }
        },
        {
          /* Top-right */
          acx: sx + sw - rx,
          acy: sy + rx,
          inQ: function (px, py) { return px >= sx + sw - rx - EPS && py <= sy + rx + EPS; }
        },
        {
          /* Bottom-right */
          acx: sx + sw - rx,
          acy: sy + sh - rx,
          inQ: function (px, py) { return px >= sx + sw - rx - EPS && py >= sy + sh - rx - EPS; }
        },
        {
          /* Bottom-left */
          acx: sx + rx,
          acy: sy + sh - rx,
          inQ: function (px, py) { return px <= sx + rx + EPS && py >= sy + sh - rx - EPS; }
        }
      ];

      for (var ci = 0; ci < corners.length; ci++) {
        var co = corners[ci];
        var ex  = center.x - co.acx;
        var ey  = center.y - co.acy;
        var bq  = 2 * (ex * ndx + ey * ndy);
        var cq  = ex * ex + ey * ey - rx * rx;
        var disc = bq * bq - 4 * cq;
        if (disc < 0) continue;
        var sqd = Math.sqrt(disc);
        var ts  = [(-bq - sqd) / 2, (-bq + sqd) / 2];
        for (var ti = 0; ti < 2; ti++) {
          var tc = ts[ti];
          if (tc > EPS) {
            var px = center.x + tc * ndx;
            var py = center.y + tc * ndy;
            if (co.inQ(px, py) && tc < bestT) {
              bestT  = tc;
              bestPt = { x: px, y: py };
            }
          }
        }
      }
    }

    /* Fallback: return midpoint of the right edge */
    if (!bestPt) return { x: sx + sw, y: sy + sh / 2 };

    return { x: bestPt.x, y: bestPt.y };
  }

  /* ============================================================
   * screenToSvg
   *
   * Converts screen coordinates to SVG viewBox coordinates.
   * Reads the SVG's viewBox and its bounding rect to compute
   * the correct scale factors.
   * ============================================================ */
  function screenToSvg(svgEl, screenX, screenY) {
    if (!svgEl) return { x: 0, y: 0 };

    var domRect = svgEl.getBoundingClientRect();
    var vb = svgEl.viewBox && svgEl.viewBox.baseVal;

    if (!vb || vb.width === 0 || vb.height === 0 ||
        domRect.width === 0 || domRect.height === 0) {
      /* No viewBox or zero-size element: return raw offsets */
      return {
        x: screenX - domRect.left,
        y: screenY - domRect.top
      };
    }

    var scaleX = vb.width  / domRect.width;
    var scaleY = vb.height / domRect.height;

    return {
      x: vb.x + (screenX - domRect.left) * scaleX,
      y: vb.y + (screenY - domRect.top)  * scaleY
    };
  }

  /* ============================================================
   * htmlElToSvgRect
   *
   * Converts an HTML element's getBoundingClientRect into
   * SVG coordinate space relative to `svgEl`.
   * Returns { x, y, width, height, cx, cy }.
   * ============================================================ */
  function htmlElToSvgRect(svgEl, htmlEl) {
    if (!svgEl || !htmlEl) {
      return { x: 0, y: 0, width: 0, height: 0, cx: 0, cy: 0 };
    }

    var domRect = htmlEl.getBoundingClientRect();
    var tl = screenToSvg(svgEl, domRect.left,  domRect.top);
    var br = screenToSvg(svgEl, domRect.right, domRect.bottom);

    var x = tl.x;
    var y = tl.y;
    var w = br.x - tl.x;
    var h = br.y - tl.y;

    return { x: x, y: y, width: w, height: h, cx: x + w / 2, cy: y + h / 2 };
  }

  /* ============================================================
   * manhattan
   *
   * Manhattan (taxicab) distance between two points.
   * ============================================================ */
  function manhattan(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  /* ============================================================
   * Public API
   * ============================================================ */
  global.ConnectorGeometry = {
    boundaryPoint:   boundaryPoint,
    screenToSvg:     screenToSvg,
    htmlElToSvgRect: htmlElToSvgRect,
    manhattan:       manhattan
  };

}(window));
