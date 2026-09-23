// ── ICON REGISTRY V23 ──
// Upgrades <i class="ti ti-*"> elements to inline SVG <use> references
// pointing at assets/icons/tabler-sprite.svg#ti-{name}.
// Falls back gracefully when a symbol is not in the sprite.
// The CSS font class remains as a secondary rendering path.

(function() {
  var SPRITE_PATH = 'assets/icons/tabler-sprite.svg';

  // Known sprite symbols (matches tabler-sprite.svg)
  var SPRITE_SYMBOLS = {
    'ti-menu-2': 1, 'ti-list': 1, 'ti-player-skip-back': 1,
    'ti-player-pause': 1, 'ti-player-play': 1, 'ti-x': 1,
    'ti-mail': 1, 'ti-book': 1, 'ti-file-text': 1, 'ti-sitemap': 1,
    'ti-database': 1, 'ti-shield': 1, 'ti-shield-check': 1,
    'ti-clock': 1, 'ti-chart-bar': 1, 'ti-coin': 1,
    'ti-check': 1, 'ti-alert-triangle': 1, 'ti-info-circle': 1,
    'ti-external-link': 1, 'ti-arrow-right': 1, 'ti-arrow-right-circle': 1,
    'ti-robot': 1, 'ti-user-check': 1, 'ti-sparkles': 1,
    'ti-layers': 1, 'ti-scale': 1, 'ti-certificate': 1, 'ti-target': 1
  };

  function getIconName(el) {
    var classes = Array.prototype.slice.call(el.classList);
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('ti-') === 0 && classes[i] !== 'ti') {
        return classes[i];
      }
    }
    return null;
  }

  function upgradeSingle(el) {
    var name = getIconName(el);
    if (!name || !SPRITE_SYMBOLS[name]) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '1em');
    svg.setAttribute('height', '1em');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'display:inline-block;vertical-align:-0.125em;fill:none;stroke:currentColor;'
                      + 'stroke-width:2;stroke-linecap:round;stroke-linejoin:round;';

    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', SPRITE_PATH + '#' + name);
    svg.appendChild(use);

    // Transfer class and style to wrapper span (keep ti class for CSS fallback)
    var span = document.createElement('span');
    span.className = el.className;
    span.setAttribute('aria-hidden', 'true');
    span.style.cssText = 'display:inline-flex;align-items:center;font-size:inherit;';
    span.appendChild(svg);

    el.parentNode.replaceChild(span, el);
  }

  function upgradeAll() {
    var icons = document.querySelectorAll('i.ti');
    var arr = Array.prototype.slice.call(icons);
    arr.forEach(upgradeSingle);
  }

  // Upgrade on DOMContentLoaded, then watch for dynamic additions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeAll);
  } else {
    upgradeAll();
  }

  // MutationObserver fallback: catch icons injected after load (scene renders, etc.)
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'I' && node.classList.contains('ti')) {
            upgradeSingle(node);
          } else {
            var found = node.querySelectorAll ? node.querySelectorAll('i.ti') : [];
            Array.prototype.slice.call(found).forEach(upgradeSingle);
          }
        });
      });
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // Expose for manual use by scenes that render icons programmatically
  window.NFRIconRegistry = {
    upgrade: upgradeAll,
    upgradeSingle: upgradeSingle
  };
}());
