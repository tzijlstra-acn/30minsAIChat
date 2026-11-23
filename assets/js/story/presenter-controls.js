// -- PRESENTER CONTROLS -- v2 --
// Experience state, presenter keys, safe mode, the shortcut overlay and the technical
// depth drawer. navigation.js hands every keydown to handleKey() first.
//
// Keys: Space advances the scripted demo, then moves on. W enters the Workspace.
// A toggles the automation trace. T opens technical depth. R replays or resets the
// current screen. 0 resets the whole experience to the cover. ? lists the keys.
// Escape closes the top overlay; in the Workspace with nothing open it returns to the story.
// Exposes: window.NFRExperience, window.PresenterControls

(function() {
  'use strict';

  var WORKSPACE_ENTRY = 'workspace-boot';
  var STORY_RETURN = 'authority-boundary';

  // ── Experience state (deck, booting, workspace-home, case-open, ... see brief §8.1) ──
  var _state = 'deck';
  var NFRExperience = {
    get: function() { return _state; },
    set: function(s) {
      _state = s;
      if (document.body) document.body.setAttribute('data-ws-state', s);
    },
    reset: function() {
      NFRExperience.set('deck');
      if (document.body) document.body.removeAttribute('data-builder-state');
    }
  };
  window.NFRExperience = NFRExperience;

  function D() { return window.NFR_WORKSPACE_DEMO; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function currentSection() {
    return (typeof sections !== 'undefined' && sections[current]) || null;
  }
  function isApp(sec) { return !!(sec && sec.dataset.kind === 'app'); }

  // Called by navigation.js on every screen change
  function onScreen(sec) {
    if (!isApp(sec)) NFRExperience.set('deck');
    document.body.classList.toggle('in-workspace', isApp(sec));
  }

  // ── Overlays ──
  var _keys = null, _tech = null, _techTab = 'architecture', _lastFocus = null;

  function overlayShell(id, title, labelledBy) {
    var ov = el('div', 'pc-overlay');
    ov.id = id;
    ov.setAttribute('aria-hidden', 'true');
    var panel = el('div', 'pc-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', labelledBy);
    panel.tabIndex = -1;
    var head = el('div', 'pc-head');
    var h = el('h2', 'pc-title', title);
    h.id = labelledBy;
    head.appendChild(h);
    var close = el('button', 'pc-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
    head.appendChild(close);
    panel.appendChild(head);
    ov.appendChild(panel);
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e) { if (e.target === ov) closeOverlay(ov); });
    close.addEventListener('click', function() { closeOverlay(ov); });
    return { ov: ov, panel: panel, head: head };
  }

  function openOverlay(ov) {
    _lastFocus = document.activeElement;
    ov.classList.add('open');
    ov.setAttribute('aria-hidden', 'false');
    var p = ov.querySelector('.pc-panel');
    if (p) p.focus();
  }
  function closeOverlay(ov) {
    if (!ov) return;
    ov.classList.remove('open');
    ov.setAttribute('aria-hidden', 'true');
    if (_lastFocus && _lastFocus.focus) { try { _lastFocus.focus(); } catch (e) {} }
  }
  function isOpen(ov) { return !!(ov && ov.classList.contains('open')); }

  // Presenter keys
  var KEYS = [
    ['Right / Left', 'Next or previous screen'],
    ['Space', 'Advance the demo step; at the last step, next screen'],
    ['W', 'Enter the NFR Workspace'],
    ['A', 'Show or hide the automation trace (case demo)'],
    ['T', 'Technical depth: architecture, governance, controls, measures'],
    ['R', 'Replay the screen or reset the active demo'],
    ['Escape', 'Close the open panel; in the Workspace, back to the story'],
    ['0', 'Reset everything and return to the cover'],
    ['G', 'Agenda'],
    ['?', 'This list']
  ];
  function buildKeys() {
    var o = overlayShell('keysOverlay', 'Presenter keys', 'keysTitle');
    o.panel.classList.add('pc-keys');
    var list = el('dl', 'pc-keylist');
    KEYS.forEach(function(k) {
      list.appendChild(el('dt', null, k[0]));
      list.appendChild(el('dd', null, k[1]));
    });
    o.panel.appendChild(list);
    var safe = el('p', 'pc-note', 'Safe mode (nav bar, or add ?safe=1 to the address) shows every screen in its final state without animation. The demo controls keep working.');
    o.panel.appendChild(safe);
    _keys = o.ov;
  }

  // Technical depth drawer, built from NFR_WORKSPACE_DEMO.technical
  var TECH_TABS = [
    { id: 'architecture', label: 'Reference architecture' },
    { id: 'lifecycle', label: 'Agent governance' },
    { id: 'controls', label: 'Control catalogue' },
    { id: 'metrics', label: 'Measurement library' }
  ];
  function buildTech() {
    var t = D().technical;
    var o = overlayShell('techDrawer', 'Technical depth', 'techTitle');
    o.ov.classList.add('pc-drawer');
    o.panel.appendChild(el('p', 'pc-sub', 'Optional detail for architecture, risk and technology questions. The core story does not depend on it.'));
    var tabs = el('div', 'pc-tabs');
    tabs.setAttribute('role', 'tablist');
    var body = el('div', 'pc-body');
    var btns = {};
    TECH_TABS.forEach(function(tab) {
      var b = el('button', 'pc-tab', tab.label);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.tab = tab.id;
      b.addEventListener('click', function() { showTech(tab.id); });
      btns[tab.id] = b;
      tabs.appendChild(b);
    });
    o.panel.appendChild(tabs);
    o.panel.appendChild(body);

    function render(id) {
      body.innerHTML = '';
      if (id === 'architecture') {
        var stack = el('div', 'pc-arch');
        t.architecture.forEach(function(layer, i) {
          var row = el('div', 'pc-arch-layer' + (i === t.architecture.length - 1 ? ' is-record' : ''));
          row.appendChild(el('div', 'pc-arch-num', String(i + 1)));
          var main = el('div', 'pc-arch-main');
          main.appendChild(el('div', 'pc-arch-label', layer.label));
          var items = el('div', 'pc-arch-items');
          layer.items.forEach(function(it) { items.appendChild(el('span', 'pc-pill', it)); });
          main.appendChild(items);
          row.appendChild(main);
          stack.appendChild(row);
        });
        body.appendChild(stack);
        body.appendChild(el('p', 'pc-note', t.architectureNote));
      } else if (id === 'lifecycle') {
        var ol = el('ol', 'pc-life');
        t.lifecycle.forEach(function(s) { ol.appendChild(el('li', null, s)); });
        body.appendChild(ol);
        body.appendChild(el('p', 'pc-note', D().builder.promotionLine));
      } else if (id === 'controls') {
        var dl = el('dl', 'pc-controls');
        t.controls.forEach(function(c) { dl.appendChild(el('dt', null, c[0])); dl.appendChild(el('dd', null, c[1])); });
        body.appendChild(dl);
      } else if (id === 'metrics') {
        var grid = el('div', 'pc-metrics');
        t.metrics.forEach(function(g) {
          var col = el('div', 'pc-metric-group');
          col.appendChild(el('div', 'pc-metric-hd', g[0]));
          var ul = el('ul');
          g[1].forEach(function(m) { ul.appendChild(el('li', null, m)); });
          col.appendChild(ul);
          grid.appendChild(col);
        });
        body.appendChild(grid);
        body.appendChild(el('p', 'pc-note', t.metricsNote));
      }
      Object.keys(btns).forEach(function(k) {
        btns[k].classList.toggle('is-active', k === id);
        btns[k].setAttribute('aria-selected', k === id ? 'true' : 'false');
      });
    }
    _tech = o.ov;
    _tech._render = render;
  }

  function showTech(tab) {
    if (!_tech) buildTech();
    _techTab = tab || _techTab;
    _tech._render(_techTab);
    if (!isOpen(_tech)) openOverlay(_tech);
  }
  function toggleTech() { if (isOpen(_tech)) closeOverlay(_tech); else showTech(); }
  function toggleKeys() {
    if (!_keys) buildKeys();
    if (isOpen(_keys)) closeOverlay(_keys); else openOverlay(_keys);
  }

  // ── Safe mode toggle ──
  function syncSafeButton() {
    var b = document.getElementById('safeModeBtn');
    if (!b || !window.SceneDirector) return;
    var on = SceneDirector.isSafe();
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.classList.toggle('is-on', on);
  }
  function toggleSafe() {
    if (!window.SceneDirector) return;
    var on = SceneDirector.setSafe(!SceneDirector.isSafe());
    syncSafeButton();
    if (typeof showToast === 'function') showToast(on ? 'Safe mode on: final states, no animation' : 'Safe mode off');
  }

  // ── Reset everything ──
  function resetAll() {
    [_keys, _tech].forEach(function(o) { if (isOpen(o)) closeOverlay(o); });
    if (typeof closeAgenda === 'function') closeAgenda();
    if (typeof closeDrawer === 'function') closeDrawer();
    NFRExperience.reset();
    var cover = document.getElementById('cover');
    if (!cover) return;
    if (currentSection() === cover && window.SceneDirector) { SceneDirector.replay(); return; }
    cover.scrollIntoView({ behavior: 'instant' });
  }

  // ── Keys: returns true when the key was handled here ──
  function handleKey(e) {
    var k = e.key;
    if (e.metaKey || e.ctrlKey || e.altKey) return false;
    // Overlays first. While one is open the deck behind it does not move; other keys keep
    // their browser default (Tab, arrows scrolling the panel).
    if (isOpen(_keys)) {
      if (k === 'Escape' || k === '?') { e.preventDefault(); closeOverlay(_keys); }
      return true;
    }
    if (isOpen(_tech)) {
      if (k === 'Escape' || k === 't' || k === 'T') { e.preventDefault(); closeOverlay(_tech); }
      return true;
    }
    if (k === '?') { e.preventDefault(); toggleKeys(); return true; }
    if (k === 't' || k === 'T') { e.preventDefault(); showTech(); return true; }
    if (k === 'w' || k === 'W') { e.preventDefault(); if (typeof goToId === 'function') goToId(WORKSPACE_ENTRY); return true; }
    if (k === '0') { e.preventDefault(); resetAll(); return true; }
    if (k === 'a' || k === 'A') {
      if (window.SceneDirector && SceneDirector.key('a')) { e.preventDefault(); return true; }
      return false;
    }
    if (k === ' ') {
      e.preventDefault();
      if (window.SceneDirector && SceneDirector.advance()) return true;
      if (typeof goToIndex === 'function') goToIndex(current + 1);
      return true;
    }
    if (k === 'Escape') {
      var agenda = document.getElementById('agendaOverlay');
      var drawer = document.getElementById('drawerOverlay');
      if ((agenda && agenda.classList.contains('open')) || (drawer && drawer.classList.contains('open'))) return false;
      if (window.SceneDirector && SceneDirector.key('Escape')) { e.preventDefault(); return true; }
      if (isApp(currentSection())) { e.preventDefault(); if (typeof goToId === 'function') goToId(STORY_RETURN); return true; }
      return false;
    }
    return false;
  }

  function init() {
    var safeBtn = document.getElementById('safeModeBtn');
    if (safeBtn) safeBtn.addEventListener('click', toggleSafe);
    var keysBtn = document.getElementById('keysBtn');
    if (keysBtn) keysBtn.addEventListener('click', toggleKeys);
    var techBtn = document.getElementById('techBtn');
    if (techBtn) techBtn.addEventListener('click', function() { showTech(); });
    document.querySelectorAll('[data-tech-tab]').forEach(function(a) {
      a.addEventListener('click', function(e) { e.preventDefault(); showTech(a.dataset.techTab); });
    });
    // A mouse click leaves focus on the button, and Space would then press it again
    // (for example switching safe mode back off). Release focus after mouse clicks on
    // presenter and demo controls; keyboard activation (detail 0) keeps its focus.
    document.addEventListener('click', function(e) {
      if (!e.detail) return;
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      if (b.closest('.nav') || b.classList.contains('ws-btn') || b.classList.contains('ws-nav-item') || b.classList.contains('landing-chapter') || b.classList.contains('wj-crumb')) b.blur();
    }, true);  // capture phase: demo buttons stop propagation of their own clicks
    syncSafeButton();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.PresenterControls = {
    handleKey: handleKey, onScreen: onScreen,
    showTech: showTech, toggleKeys: toggleKeys, toggleSafe: toggleSafe, resetAll: resetAll,
    isTechOpen: function() { return isOpen(_tech); },
    STORY_RETURN: STORY_RETURN, WORKSPACE_ENTRY: WORKSPACE_ENTRY
  };
}());
