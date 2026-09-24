// scene-activation-controller.js  V28
// Thin wrapper around SceneDirector that guarantees only the active slide
// mounts and plays its scene. Scene modules are not touched.
//
// Flow:
//   navigation.js updateNav()
//     -> window.dispatchEvent('nfr:slide-enter')
//       -> SceneActivationController (this file)
//         -> wait: document.fonts.ready + 2 rAF
//           -> confirm token still matches (presenter hasn't moved)
//             -> SceneDirector.enter()
//
// The activation token prevents stale scene starts during rapid navigation
// or during the smooth-scroll window between key-press and snap completion.

var SceneActivationController = (function() {

  var _token = 0;

  function _paint2() {
    return new Promise(function(resolve) {
      requestAnimationFrame(function() {
        requestAnimationFrame(resolve);
      });
    });
  }

  function enter(section, manifestEntry) {
    if (typeof SceneDirector === 'undefined') return;
    var t = ++_token;
    // Stop any in-flight scene immediately so the stage is blank while we wait.
    SceneDirector.cancel();

    var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts
      .then(function() { return _paint2(); })
      .then(function() {
        if (t !== _token) return; // presenter moved on -- discard
        SceneDirector.enter(section, manifestEntry);
      });
  }

  function cancel() {
    ++_token; // invalidate any pending activation
    if (typeof SceneDirector !== 'undefined') SceneDirector.cancel();
  }

  // ── Event listener ───────────────────────────────────────────────────────
  // navigation.js dispatches nfr:slide-enter at the end of updateNav().
  // scene-director.js dispatches it from its hash-entry fallback timer.

  window.addEventListener('nfr:slide-enter', function(e) {
    var section = e.detail && e.detail.section;
    var id      = e.detail && e.detail.id;

    if (!section || !section.dataset || !section.dataset.scene) {
      cancel();
      return;
    }

    var manifest = (typeof getManifestEntry === 'function')
      ? getManifestEntry(id)
      : null;

    enter(section, manifest || { scene: section.dataset.scene, id: id });
  });

  // ── Public surface (mirrors SceneDirector for callers that need it) ───────
  return {
    cancel:      cancel,
    replay:      function()  { SceneDirector.replay(); },
    togglePause: function()  { return SceneDirector.togglePause(); },
    finish:      function()  { SceneDirector.finish(); },
    hasScene:    function(id){ return SceneDirector.hasScene(id); },
    getState:    function()  { return SceneDirector.getState(); }
  };
}());
