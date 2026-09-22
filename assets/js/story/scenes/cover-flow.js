// Scene: cover-flow (Screen 00 - Introduction)
// Reveals the signal-to-decision line: a horizontal connector animating word by word
SceneDirector.register('cover-flow', function(container, manifest, reduced) {
  var words = ['Work.', 'Evidence.', 'Decision.'];
  var colors = ['var(--text-1)', 'var(--cyan)', 'var(--accent)'];

  function prepare() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:32px;height:100%;padding:20px;';
    words.forEach(function(w, i) {
      var el = document.createElement('div');
      el.className = 'scene-node';
      el.style.cssText = 'font-family:"Space Grotesk",sans-serif;font-size:clamp(20px,4vw,48px);font-weight:700;color:' + colors[i] + ';letter-spacing:-.01em;';
      el.textContent = w;
      if (i < words.length - 1) {
        var sep = document.createElement('div');
        sep.className = 'scene-node';
        sep.style.cssText = 'font-size:24px;color:var(--border-2,rgba(255,255,255,.15));font-weight:300;';
        sep.textContent = '/';
        wrap.appendChild(el);
        wrap.appendChild(sep);
      } else {
        wrap.appendChild(el);
      }
    });
    container.appendChild(wrap);
    return wrap;
  }

  var wrap;
  var tl;

  var steps = words.map(function(_, i) {
    return { delay: 600 + i * 800, run: function() {
      var nodes = container.querySelectorAll('.scene-node');
      var idx = i * 2;
      if (nodes[idx]) nodes[idx].classList.add('visible');
      if (i < words.length - 1 && nodes[idx + 1]) nodes[idx + 1].classList.add('visible');
    }};
  });

  tl = createTimeline(steps);

  return {
    play: function() { wrap = prepare(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { if (wrap) wrap = prepare(); tl.reset(); },
    finish: function() {
      wrap = prepare();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
