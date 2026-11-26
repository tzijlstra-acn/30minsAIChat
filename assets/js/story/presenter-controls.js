// -- PRESENTER CONTROLS -- v7 --
// Experience state, presenter keys, safe mode, the shortcut overlay, the hand-off to the
// live product and appendix navigation. navigation.js hands every keydown to handleKey()
// first.
//
// Keys: Space advances a scene, then moves on. W goes to Enter NFR Workspace. L opens the
// live product; F the captured fallback. A opens the appendix index; 1 to 4 a module;
// M returns to the main story. R replays the screen. S toggles safe mode. 0 resets the
// whole experience. Escape closes the top overlay, or returns one level (page, index,
// story). ? lists the keys. Arrows and Page Up / Page Down move between screens.
// Exposes: window.NFRExperience, window.PresenterControls

(function() {
  'use strict';

  var WORKSPACE_ENTRY = 'enter-workspace';
  var STORY_RETURN = 'method-plan';
  var STORY_END = 'next-decision';
  var FALLBACK = 'live-fallback';

  // Experience states for the story screens; the doorway and the fallback set their own
  var STATE_BY_SCREEN = {
    'cover': 'cover', 'work-arrives': 'work-arrives', 'chain-drift': 'chain-drift', 'assistance-here': 'assistance',
    'role-views': 'roles', 'four-ways': 'four-ways', 'three-layers': 'three-layers', 'profiles-access': 'profiles', 'security': 'security',
    'six-months': 'six-months', 'next-decision': 'decision',
    'ch-problem': 'chapter', 'ch-answer': 'chapter', 'ch-workspace': 'chapter', 'ch-next': 'chapter'
  };

  // ── The experience state model: every state the deck can be in, in route order ──
  var STATES = [
    'cover', 'chapter', 'work-arrives', 'assistance', 'chain-drift', 'roles', 'four-ways', 'three-layers', 'profiles', 'security',
    'entering-workspace', 'live-handoff', 'live-fallback', 'six-months', 'decision', 'appendix'
  ];

  var _state = 'cover';
  var _flags = {};
  var NFRExperience = {
    states: function() { return STATES.slice(); },
    get: function() { return _state; },
    set: function(s) {
      if (STATES.indexOf(s) < 0 && window.console) console.warn('NFRExperience: unknown state ' + s);
      _state = s;
      if (document.body) document.body.setAttribute('data-ws-state', s);
    },
    setFlag: function(k, v) { _flags[k] = v; },
    getFlag: function(k) { return _flags[k]; },
    reset: function() { _flags = {}; NFRExperience.set('cover'); }
  };
  window.NFRExperience = NFRExperience;

  function D() { return window.NFR_WORKSPACE_DEMO; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function currentSection() { return (typeof sections !== 'undefined' && sections[current]) || null; }
  function isReference(sec) { return !!(sec && sec.dataset.route === 'reference'); }
  function isApxPage(sec) { return !!(sec && sec.hasAttribute('data-apx-page')); }
  function go(id) { if (typeof goToId === 'function') goToId(id); }

  // ── Called by navigation.js on every screen change ──
  var _lastStory = null;
  function onScreen(sec) {
    if (!sec) return;
    if (isReference(sec) && sec.id !== FALLBACK) NFRExperience.set('appendix');
    else if (STATE_BY_SCREEN[sec.id]) NFRExperience.set(STATE_BY_SCREEN[sec.id]);
    if (sec.dataset.route === 'core') _lastStory = sec.id;
    document.body.classList.toggle('in-appendix', isReference(sec) && sec.id !== 'ref-room');
    document.body.classList.toggle('in-apx-page', isApxPage(sec));
  }
  function returnToStory() { go(_lastStory || STORY_END); }

  // ── The live product ──
  // The URL comes from ?live=<url> (remembered for the session), else the default
  function liveUrl() {
    var fromQuery = null;
    try { fromQuery = new URLSearchParams(location.search).get('live'); } catch (e) { fromQuery = null; }
    if (fromQuery && /^https?:\/\//.test(fromQuery)) {
      try { sessionStorage.setItem('nfr_live_url', fromQuery); } catch (e) {}
      return fromQuery;
    }
    var stored = null;
    try { stored = sessionStorage.getItem('nfr_live_url'); } catch (e) { stored = null; }
    return stored || (D() && D().enter.liveUrl) || 'http://localhost:3200/';
  }
  function openLive() {
    var url = liveUrl();
    var w = null;
    try { w = window.open(url, 'nfr-workspace-live'); } catch (e) { w = null; }
    if (typeof showToast === 'function') showToast(w ? 'Live Workspace opened: ' + url : 'Could not open ' + url + '. Use the product walkthrough (F).');
    return !!w;
  }

  // ── Overlays ──
  var _keys = null, _lastFocus = null;

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

  var KEYS = [
    ['Right / Left, Page Down / Up', 'Next or previous screen (works with a clicker)'],
    ['Space', 'Advance the scene; at its end, the next screen'],
    ['W', 'Go to Enter NFR Workspace (screen 08)'],
    ['L', 'Open the live NFR Workspace'],
    ['F', 'Product walkthrough: the five acts, captured from the live product'],
    ['A', 'Appendix index'],
    ['1 to 4', 'Appendix module: value, control, data, platform'],
    ['M', 'Back to the main story'],
    ['R', 'Replay the current screen'],
    ['S', 'Safe mode on or off: final states, no animation'],
    ['Escape', 'Close the open panel, or go back one level'],
    ['0', 'Reset everything and return to the cover'],
    ['G', 'Agenda'],
    ['?', 'This list']
  ];
  function buildKeys() {
    var o = overlayShell('keysOverlay', 'Presenter keys', 'keysTitle');
    o.panel.classList.add('pc-keys');
    var list = el('dl', 'pc-keylist');
    KEYS.forEach(function(k) { list.appendChild(el('dt', null, k[0])); list.appendChild(el('dd', null, k[1])); });
    o.panel.appendChild(list);
    o.panel.appendChild(el('p', 'pc-note', 'Live product: ' + liveUrl() + '. Safe mode (S, the nav bar, or ?safe=1 in the address) shows every screen in its final state without animation.'));
    _keys = o.ov;
  }
  function toggleKeys() {
    if (!_keys) buildKeys();
    if (isOpen(_keys)) closeOverlay(_keys); else openOverlay(_keys);
  }

  // ── Safe mode ──
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
    if (isOpen(_keys)) closeOverlay(_keys);
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
    // While the key list is open the deck behind it does not move
    if (isOpen(_keys)) {
      if (k === 'Escape' || k === '?') { e.preventDefault(); closeOverlay(_keys); }
      return true;
    }
    var sec = currentSection();
    var lower = typeof k === 'string' ? k.toLowerCase() : k;
    if (k === '?') { e.preventDefault(); toggleKeys(); return true; }
    if (lower === 'w') { e.preventDefault(); go(WORKSPACE_ENTRY); return true; }
    if (lower === 'l') { e.preventDefault(); openLive(); return true; }
    if (lower === 'f') { e.preventDefault(); go(FALLBACK); return true; }
    if (lower === 'a') { e.preventDefault(); if (window.AppendixNav) AppendixNav.index(); return true; }
    if (lower === 'm') { e.preventDefault(); returnToStory(); return true; }
    if (k === '1' || k === '2' || k === '3' || k === '4') { e.preventDefault(); if (window.AppendixNav) AppendixNav.module(k); return true; }
    if (k === '0') { e.preventDefault(); resetAll(); return true; }
    if (lower === 's') { e.preventDefault(); toggleSafe(); return true; }
    // On the captured fallback the arrows and the clicker step through the captures
    if (sec && sec.id === FALLBACK && window.SceneDirector) {
      if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); SceneDirector.advance(); return true; }
      if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); SceneDirector.key('prev'); return true; }
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
      // One level up: a question page goes to the index, the index to the story
      if (isApxPage(sec)) { e.preventDefault(); if (window.AppendixNav) AppendixNav.index(); return true; }
      if (sec && sec.id === 'appendix') { e.preventDefault(); returnToStory(); return true; }
      if (isReference(sec)) { e.preventDefault(); if (window.AppendixNav) AppendixNav.index(); return true; }
      return false;
    }
    return false;
  }

  function init() {
    var safeBtn = document.getElementById('safeModeBtn');
    if (safeBtn) safeBtn.addEventListener('click', toggleSafe);
    var keysBtn = document.getElementById('keysBtn');
    if (keysBtn) keysBtn.addEventListener('click', toggleKeys);
    var back = document.getElementById('storyReturn');
    if (back) back.addEventListener('click', returnToStory);
    // Deep links from the story into the appendix
    document.querySelectorAll('[data-apx-link]').forEach(function(a) {
      a.addEventListener('click', function(e) { e.preventDefault(); go(a.dataset.apxLink); });
    });
    // A mouse click leaves focus on the button, and Space would then press it again.
    // Release focus after mouse clicks on presenter and appendix controls; keyboard
    // activation (detail 0) keeps its focus.
    document.addEventListener('click', function(e) {
      if (!e.detail) return;
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      if (b.closest('.nav') || b.classList.contains('apx-btn') || b.classList.contains('apx-tab') || b.classList.contains('apx-mod-chip') || b.classList.contains('apx-door-head')
        || b.classList.contains('ew-open') || b.classList.contains('ew-fallback') || b.classList.contains('lf-tab') || b.classList.contains('rv-role') || b.classList.contains('rx-seg') || b.classList.contains('rx-out') || b.classList.contains('pa-person') || b.classList.contains('pa-tpl') || b.classList.contains('ts-apx-link') || b.classList.contains('landing-chapter')) b.blur();
    }, true);
    syncSafeButton();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.PresenterControls = {
    handleKey: handleKey, onScreen: onScreen, returnToStory: returnToStory,
    toggleKeys: toggleKeys, toggleSafe: toggleSafe, resetAll: resetAll,
    openLive: openLive, liveUrl: liveUrl,
    STORY_RETURN: STORY_RETURN, WORKSPACE_ENTRY: WORKSPACE_ENTRY, FALLBACK: FALLBACK
  };
}());
