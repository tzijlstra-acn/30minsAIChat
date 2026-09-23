// -- COMPOSITION LINTER -- V26 --
// Development-only audit tool. Activated by ?debug=composition in the URL.
// Records per core screen:
//   - enclosed shape count (border-radius elements >= 20px)
//   - equal-card count (groups of 3+ elements with identical width/height)
//   - smallest font-size (px)
//   - visual density score (total area of enclosed shapes / viewport area)
//   - whether a static fallback (data-scene-fallback) is present
//   - whether any essential label is below 14px
// Fail thresholds (logged as FAIL in console and red badge in UI):
//   - more than 7 major enclosed shapes
//   - more than 3 equal cards
//   - any essential label below 14px

(function() {
  'use strict';

  if (window.location.search.indexOf('debug=composition') === -1) return;

  var FAIL_MAX_SHAPES = 7;
  var FAIL_MAX_EQUAL_CARDS = 3;
  var FAIL_MIN_FONT = 14;

  function isVisible(el) {
    var style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0.05;
  }

  function parseSize(val) {
    if (!val) return 0;
    return parseFloat(val) || 0;
  }

  function auditSection(sec) {
    var id = sec.id || '(no id)';
    var sceneContainer = sec.querySelector('[data-scene-container]') || sec;

    // 1. Enclosed shapes: elements with border-radius >= 20px, visible, area >= 2000px2
    var allEls = Array.from(sceneContainer.querySelectorAll('*'));
    var shapes = allEls.filter(function(el) {
      if (!isVisible(el)) return false;
      var style = window.getComputedStyle(el);
      var br = parseSize(style.borderRadius);
      if (br < 4) return false;
      var rect = el.getBoundingClientRect();
      return rect.width * rect.height >= 2000;
    });

    // 2. Equal cards: find groups of 3+ elements with same width (within 4px) and same height (within 4px)
    var sizeGroups = {};
    shapes.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var w = Math.round(rect.width / 4) * 4;
      var h = Math.round(rect.height / 4) * 4;
      var key = w + 'x' + h;
      sizeGroups[key] = (sizeGroups[key] || 0) + 1;
    });
    var equalCardGroups = Object.keys(sizeGroups).filter(function(k) { return sizeGroups[k] >= 3; });
    var equalCardCount = equalCardGroups.reduce(function(sum, k) { return sum + sizeGroups[k]; }, 0);

    // 3. Smallest font-size across visible text nodes
    var minFont = Infinity;
    allEls.forEach(function(el) {
      if (!isVisible(el)) return;
      if (!el.children.length && el.textContent.trim().length > 0) {
        var fs = parseSize(window.getComputedStyle(el).fontSize);
        if (fs > 0 && fs < minFont) minFont = fs;
      }
    });
    if (minFont === Infinity) minFont = 0;

    // 4. Static fallback present
    var hasFallback = !!sceneContainer.querySelector('[data-scene-fallback]');

    // 5. Visual density
    var secRect = sceneContainer.getBoundingClientRect();
    var secArea = secRect.width * secRect.height || 1;
    var shapeArea = shapes.reduce(function(s, el) {
      var r = el.getBoundingClientRect();
      return s + r.width * r.height;
    }, 0);
    var density = Math.round(shapeArea / secArea * 100);

    // Results
    var fails = [];
    if (shapes.length > FAIL_MAX_SHAPES)   fails.push('shapes=' + shapes.length + '>' + FAIL_MAX_SHAPES);
    if (equalCardCount > FAIL_MAX_EQUAL_CARDS) fails.push('equal-cards=' + equalCardCount + '>' + FAIL_MAX_EQUAL_CARDS);
    if (minFont > 0 && minFont < FAIL_MIN_FONT) fails.push('min-font=' + minFont.toFixed(1) + 'px<' + FAIL_MIN_FONT + 'px');

    var status = fails.length ? 'FAIL' : 'PASS';
    var style = fails.length ? 'color:#F0758A;font-weight:bold' : 'color:#58C994';

    console.log(
      '%c[composition-linter] ' + status + ' #' + id,
      style,
      '| shapes:' + shapes.length,
      '| equal-cards:' + equalCardCount,
      '| min-font:' + (minFont || '--') + 'px',
      '| density:' + density + '%',
      '| fallback:' + hasFallback,
      fails.length ? '| FAILS: ' + fails.join(', ') : ''
    );

    return { id: id, shapes: shapes.length, equalCards: equalCardCount, minFont: minFont, density: density, hasFallback: hasFallback, fails: fails };
  }

  function injectBadge(sec, result) {
    var badge = document.createElement('div');
    var ok = result.fails.length === 0;
    badge.style.cssText = [
      'position:absolute',
      'top:4px',
      'left:4px',
      'z-index:9999',
      'font-size:10px',
      'font-family:JetBrains Mono,monospace',
      'background:rgba(0,0,0,.75)',
      'color:' + (ok ? '#58C994' : '#F0758A'),
      'padding:3px 7px',
      'border-radius:3px',
      'border:1px solid ' + (ok ? '#58C994' : '#F0758A'),
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';');
    badge.textContent = (ok ? 'PASS' : 'FAIL') + ' shapes:' + result.shapes + ' minFont:' + (result.minFont || '--') + 'px';
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    sec.appendChild(badge);
  }

  function run() {
    var sections = Array.from(document.querySelectorAll('section[data-route="core"]'));
    if (!sections.length) {
      console.warn('[composition-linter] No core sections found. Ensure ?debug=composition is used on the pitch page.');
      return;
    }
    console.group('[composition-linter] V26 composition audit');
    var results = sections.map(function(sec) {
      var r = auditSection(sec);
      injectBadge(sec, r);
      return r;
    });
    var failCount = results.filter(function(r) { return r.fails.length; }).length;
    console.log('[composition-linter] Summary: ' + failCount + ' / ' + results.length + ' screens have composition failures.');
    console.groupEnd();
    return results;
  }

  // Run after fonts and first paint
  if (document.readyState === 'complete') {
    document.fonts.ready.then(function() { setTimeout(run, 1200); });
  } else {
    window.addEventListener('load', function() {
      document.fonts.ready.then(function() { setTimeout(run, 1200); });
    });
  }

  window.CompositionLinter = { run: run, auditSection: auditSection };

}());
