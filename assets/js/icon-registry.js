// icon-registry.js -- V18 icon system: audit + geometric fallback for blank slots
(function() {
  'use strict';

  var FALLBACK_THRESHOLD_PX = 6;

  var DIAMOND = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" '
    + 'width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" '
    + 'stroke-linecap="round" stroke-linejoin="round" '
    + 'aria-hidden="true" data-icon-fallback="1" '
    + 'style="display:inline-block;vertical-align:middle;opacity:.55">'
    + '<path d="M12 3 L21 12 L12 21 L3 12 Z"/>'
    + '</svg>';

  function _applyFallbacks(icons) {
    var replaced = 0;
    for (var i = 0; i < icons.length; i++) {
      var el = icons[i];
      if (el.dataset.iconChecked) continue;
      el.dataset.iconChecked = '1';
      var rect = el.getBoundingClientRect();
      if (rect.width < FALLBACK_THRESHOLD_PX || rect.height < FALLBACK_THRESHOLD_PX) {
        var wrapper = document.createElement('span');
        wrapper.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;'
          + 'width:1em;height:1em;vertical-align:middle;';
        wrapper.innerHTML = DIAMOND;
        el.parentNode.insertBefore(wrapper, el);
        el.parentNode.removeChild(el);
        replaced++;
      }
    }
    return replaced;
  }

  var NFRIcons = {
    _ready: false,

    init: function() {
      if (this._ready) return;
      this._ready = true;

      var style = document.createElement('style');
      style.textContent = '.ti{display:inline-flex;align-items:center;justify-content:center;line-height:1;}';
      document.head.appendChild(style);

      var self = this;
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() { self._scan(); });
      } else {
        setTimeout(function() { self._scan(); }, 2000);
      }
    },

    _scan: function() {
      var icons = document.querySelectorAll('i.ti');
      var replaced = _applyFallbacks(icons);
      if (replaced > 0) {
        console.warn('[NFRIcons] ' + replaced + ' blank icon slot(s) replaced with geometric fallback.');
      }

      var observer = new MutationObserver(function(mutations) {
        var added = [];
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.nodeType === 1) {
              if (n.matches && n.matches('i.ti')) added.push(n);
              else if (n.querySelectorAll) {
                n.querySelectorAll('i.ti').forEach(function(el) { added.push(el); });
              }
            }
          });
        });
        if (added.length) _applyFallbacks(added);
      });

      observer.observe(document.body, { childList: true, subtree: true });
    },

    audit: function() {
      var icons = document.querySelectorAll('i.ti');
      var issues = [];
      icons.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.width < FALLBACK_THRESHOLD_PX || rect.height < FALLBACK_THRESHOLD_PX) {
          issues.push(el.className);
        }
      });
      if (issues.length > 0) {
        console.warn('[NFRIcons] Possible rendering issues:', issues);
      } else {
        console.info('[NFRIcons] Audit OK: ' + icons.length + ' icons, no blank slots.');
      }
      return issues;
    }
  };

  window.NFRIcons = NFRIcons;

  document.addEventListener('DOMContentLoaded', function() { NFRIcons.init(); });
}());
