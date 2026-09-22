// ── SCENE DIRECTOR ──
// Manages deterministic scene playback for each core screen.
// One scene plays per screen. Scenes are loaded on demand and cancelled on navigation.
// Contract: every scene module exports createScene(container, manifest, reducedMotion)
// returning { play(), pause(), resume(), reset(), finish(), destroy() }.

var SceneDirector = (function() {
  var _scenes = {};        // registered scene factories: id -> createScene
  var _current = null;     // { sceneId, instance, manifest }
  var _reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var _paused = false;

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
    _reduced = e.matches;
  });

  function register(sceneId, createFn) {
    _scenes[sceneId] = createFn;
  }

  function enter(sectionEl, manifestEntry) {
    cancel();
    if (!manifestEntry || !manifestEntry.scene) return;
    var factory = _scenes[manifestEntry.scene];
    if (!factory) return;
    var container = sectionEl.querySelector('[data-scene-container]') || sectionEl;
    var instance;
    try {
      instance = factory(container, manifestEntry, _reduced);
    } catch (e) {
      console.warn('SceneDirector: scene init error', e);
      return;
    }
    _current = { sceneId: manifestEntry.scene, instance: instance, manifest: manifestEntry };
    _paused = false;
    requestAnimationFrame(function() {
      try {
        if (_reduced) {
          instance.finish();
        } else {
          instance.play();
        }
      } catch (e) {
        console.warn('SceneDirector: scene play error', e);
      }
    });
  }

  function cancel() {
    if (_current) {
      try { _current.instance.destroy(); } catch(e) {}
      _current = null;
    }
    _paused = false;
  }

  function replay() {
    if (!_current) return;
    _paused = false;
    try {
      _current.instance.reset();
      if (_reduced) {
        _current.instance.finish();
      } else {
        _current.instance.play();
      }
    } catch (e) {
      console.warn('SceneDirector: replay error', e);
    }
  }

  function togglePause() {
    if (!_current) return;
    if (_paused) {
      try { _current.instance.resume(); } catch(e) {}
      _paused = false;
    } else {
      try { _current.instance.pause(); } catch(e) {}
      _paused = true;
    }
    return _paused;
  }

  function finish() {
    if (!_current) return;
    try { _current.instance.finish(); } catch(e) {}
    _paused = false;
  }

  return { register: register, enter: enter, cancel: cancel, replay: replay, togglePause: togglePause, finish: finish };
}());

// ── BASE SCENE HELPER ──
// All scene factories can use this to manage a sequence of timed steps
// and respect the contract interface without boilerplate.
function createTimeline(steps) {
  // steps: array of { delay: ms, run: function }
  var timers = [];
  var finished = false;

  function play() {
    reset();
    finished = false;
    steps.forEach(function(step) {
      timers.push(setTimeout(function() {
        if (!finished) try { step.run(); } catch(e) {}
      }, step.delay));
    });
  }

  function pause() {
    // Timers already scheduled -- cancel remaining, record position
    timers.forEach(clearTimeout);
    timers = [];
  }

  function resume() {
    // Simplified: replay from start (full resume requires checkpoint tracking)
    play();
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    finished = false;
  }

  function finish() {
    reset();
    finished = true;
    // Run all steps immediately in order
    steps.forEach(function(step) {
      try { step.run(); } catch(e) {}
    });
  }

  function destroy() {
    reset();
    finished = true;
  }

  return { play: play, pause: pause, resume: resume, reset: reset, finish: finish, destroy: destroy };
}

// ── FADE HELPER ──
// Utility for CSS-transition-based reveals used by scenes
function fadeIn(el, delayMs, durationMs) {
  if (!el) return;
  el.style.opacity = '0';
  el.style.transition = 'opacity ' + (durationMs || 400) + 'ms ease ' + (delayMs || 0) + 'ms';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      el.style.opacity = '1';
    });
  });
}

function revealSequence(els, startDelay, stagger, duration) {
  els.forEach(function(el, i) {
    fadeIn(el, startDelay + i * stagger, duration);
  });
}

// ── SVG HELPERS ──
function svgEl(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
  return el;
}

function svgText(content, x, y, cls) {
  var t = svgEl('text', { x: x, y: y, class: cls || '' });
  t.textContent = content;
  return t;
}

function animatePath(pathEl, duration, easing) {
  var len = pathEl.getTotalLength ? pathEl.getTotalLength() : 200;
  pathEl.style.strokeDasharray = len;
  pathEl.style.strokeDashoffset = len;
  pathEl.style.transition = 'stroke-dashoffset ' + (duration || 600) + 'ms ' + (easing || 'ease') + ' 0ms';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      pathEl.style.strokeDashoffset = '0';
    });
  });
}

// Expose utilities
window.sceneUtils = {
  fadeIn: fadeIn,
  revealSequence: revealSequence,
  svgEl: svgEl,
  svgText: svgText,
  animatePath: animatePath,
  createTimeline: createTimeline
};
