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

  function _showFallback(container, sceneId) {
    // Reveal pre-rendered data-scene-fallback SVG if present
    var fb = container.querySelector('[data-scene-fallback]');
    if (fb) {
      fb.removeAttribute('hidden');
      fb.style.display = 'block';
      return;
    }
    if (window.location.search.indexOf('debug=1') !== -1) {
      var lbl = document.createElement('div');
      lbl.style.cssText = 'position:absolute;top:4px;right:4px;font-size:11px;'
        + 'color:#ff6b6b;background:rgba(0,0,0,.7);padding:2px 6px;border-radius:3px;z-index:999;';
      lbl.textContent = 'scene-error: ' + sceneId;
      container.appendChild(lbl);
    }
  }

  var _resizeObserver = null;

  function _attachResizeObserver(container, instance) {
    if (_resizeObserver) { _resizeObserver.disconnect(); _resizeObserver = null; }
    if (!window.ResizeObserver || !instance.resize) return;
    var debounceTimer = null;
    _resizeObserver = new ResizeObserver(function(entries) {
      var entry = entries[0];
      if (!entry) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (!_current) return;
        try {
          instance.pause();
          instance.resize({ width: entry.contentRect.width, height: entry.contentRect.height });
        } catch(e) {}
      }, 120);
    });
    _resizeObserver.observe(container);
  }

  function enter(sectionEl, manifestEntry) {
    cancel();
    if (!manifestEntry || !manifestEntry.scene) return;
    var factory = _scenes[manifestEntry.scene];
    var container = sectionEl.querySelector('[data-scene-container]') || sectionEl;
    if (!factory) {
      _showFallback(container, manifestEntry.scene);
      return;
    }
    var instance;
    try {
      instance = factory(container, manifestEntry, _reduced);
    } catch (e) {
      console.error('[scene:' + manifestEntry.scene + '] init error', e);
      _showFallback(container, manifestEntry.scene);
      if (instance && typeof instance.renderFallback === 'function') {
        try { instance.renderFallback(e); } catch(_) {}
      }
      return;
    }
    _current = { sceneId: manifestEntry.scene, instance: instance, manifest: manifestEntry };
    _paused = false;
    _attachResizeObserver(container, instance);
    var readyPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    readyPromise.then(function() {
      if (!_current || _current.instance !== instance) return;
      requestAnimationFrame(function() {
        try {
          if (_reduced) {
            instance.finish();
          } else {
            instance.play();
          }
        } catch (e) {
          console.error('[scene:' + manifestEntry.scene + '] play error', e);
          _showFallback(container, manifestEntry.scene);
          if (typeof instance.renderFallback === 'function') {
            try { instance.renderFallback(e); } catch(_) {}
          }
        }
      });
    });
  }

  function cancel() {
    if (_resizeObserver) { _resizeObserver.disconnect(); _resizeObserver = null; }
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

  function hasScene(id) { return !!_scenes[id]; }

  return { register: register, enter: enter, cancel: cancel, replay: replay, togglePause: togglePause, finish: finish, hasScene: hasScene };
}());

// ── BASE SCENE HELPER ──
// V23 lifecycle contract: mount, play, pause, resume, seek, finish, resize, destroy, renderFallback.
// All are optional except play/finish/destroy -- SceneDirector calls only what exists.
function createTimeline(steps) {
  // steps: array of { delay: ms, run: function }
  var timers = [];
  var finished = false;
  var _startedAt = 0;

  function play() {
    reset();
    finished = false;
    _startedAt = Date.now();
    steps.forEach(function(step) {
      timers.push(setTimeout(function() {
        if (!finished) try { step.run(); } catch(e) {}
      }, step.delay));
    });
  }

  function pause() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function resume() {
    // Simplified: replay from start (checkpoint tracking would require per-step state)
    play();
  }

  function seek(progress) {
    // Run all steps up to progress (0-1) synchronously, skip the rest
    pause();
    var totalDuration = steps.length ? steps[steps.length - 1].delay : 0;
    var targetMs = progress * totalDuration;
    steps.forEach(function(step) {
      if (step.delay <= targetMs) try { step.run(); } catch(e) {}
    });
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    finished = false;
    _startedAt = 0;
  }

  function finish() {
    reset();
    finished = true;
    steps.forEach(function(step) {
      try { step.run(); } catch(e) {}
    });
  }

  function resize() {
    // Default resize: noop. Scenes that need geometry recalculation override this.
  }

  function renderFallback() {
    // Default renderFallback: noop. Scenes override to show a designed final state.
  }

  function destroy() {
    reset();
    finished = true;
  }

  return {
    play: play, pause: pause, resume: resume, seek: seek,
    reset: reset, finish: finish, resize: resize,
    renderFallback: renderFallback, destroy: destroy
  };
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

// ── STARTUP VALIDATION ──
// Runs after all scene scripts are parsed (DOMContentLoaded fires after inline scripts).
// Logs and marks any missing registrations so they surface before deployment.
document.addEventListener('DOMContentLoaded', function() {
  var REQUIRED_SCENES = [
    'cover-flow', 'pressure-convergence', 'ai-stack-build', 'task-route',
    'regulation-process', 'transformation-system', 'work-role-shift',
    'proof-loop', 'scale-architecture', 'unit-economics', 'dual-engine', 'next-move'
  ];

  var missing = REQUIRED_SCENES.filter(function(id) { return !SceneDirector.hasScene(id); });
  if (missing.length) {
    console.warn('[SceneDirector] Missing scene registrations:', missing.join(', '));
    // Visually flag in development (console only -- no DOM mutation in production)
    missing.forEach(function(id) {
      var sec = document.querySelector('[data-scene="' + id + '"]');
      if (sec) {
        var stage = sec.querySelector('[data-scene-container]');
        if (stage) {
          stage.style.cssText += 'border:2px dashed var(--pink,#F0758A);box-sizing:border-box;';
          var warn = document.createElement('div');
          warn.style.cssText = 'padding:12px;font-family:JetBrains Mono,monospace;font-size:11px;color:var(--pink,#F0758A)';
          warn.textContent = 'Scene not registered: ' + id;
          stage.appendChild(warn);
        }
      }
    });
  }

  // ── Direct-hash rendering ──
  // When the page loads with a hash (e.g. #transformation-implications), the
  // IntersectionObserver fires for the visible section on its first tick.
  // However, if the section is already fully in view AND the browser does not
  // deliver an initial IO callback, we force-enter the scene here.
  var hash = window.location.hash && window.location.hash.slice(1);
  if (hash) {
    setTimeout(function() {
      var sec = document.getElementById(hash);
      if (!sec || !sec.dataset.scene) return;
      if (typeof getManifestEntry === 'function') {
        var entry = getManifestEntry(hash);
        SceneDirector.enter(sec, entry || { scene: sec.dataset.scene, id: hash });
      }
    }, 200);
  }
});
