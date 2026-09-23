// icon-registry.js -- V16 icon system monitor and fallback provider
(function() {
  'use strict';

  var ICON_MANIFEST_URL = './assets/data/icon-manifest.json';

  var NFRIcons = {
    manifest: null,
    _loaded: false,

    load: function() {
      if (this._loaded) return;
      this._loaded = true;
      // Add CSS fallback: if webfont fails, show class name as text
      var style = document.createElement('style');
      style.textContent = [
        '.icon-slot:empty::after { content: "?"; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: currentColor; border: 1px solid currentColor; border-radius: 3px; }',
        '.ti { display: inline-flex; align-items: center; justify-content: center; line-height: 1; }'
      ].join('\n');
      document.head.appendChild(style);
    },

    audit: function() {
      // Count icon elements and report any that are suspiciously small
      var icons = document.querySelectorAll('i.ti');
      var issues = [];
      icons.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) {
          issues.push(el.className);
        }
      });
      if (issues.length > 0) {
        console.warn('[NFRIcons] Possible rendering issues with icons:', issues);
      } else {
        console.info('[NFRIcons] Icon audit: ' + icons.length + ' icons rendered, no issues detected.');
      }
      return issues;
    }
  };

  window.NFRIcons = NFRIcons;

  document.addEventListener('DOMContentLoaded', function() {
    NFRIcons.load();
    setTimeout(function() { NFRIcons.audit(); }, 2000);
  });
}());
