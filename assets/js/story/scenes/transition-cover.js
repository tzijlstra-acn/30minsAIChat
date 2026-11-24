// Scene: transition-cover (landing)
// Causal story: a restrained frame, not an AI motif. The frame appears, then a capture of
// the real product's Today screen resolves inside it: the conversation arrives at a
// working product, not at a drawing of one. One line underneath states the principle.
// If the capture cannot load, the frame keeps neutral placeholder lines instead.
SceneDirector.register('transition-cover', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.cover;
  var W = 560, H = 440;
  var FRAME = { x: 10, y: 24, w: 540, h: 360 };
  var BAR = 30;

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'cover' });
    n = {};
    done = false;
    var root = cv.el;
    var frame = S.el('div', 'tc-frame ts-hide', null, { left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h });
    var bar = S.el('div', 'tc-bar');
    bar.appendChild(S.el('span', 'ws-mark tc-mark-sq'));
    bar.appendChild(S.el('span', 'tc-brand', D.product));
    bar.appendChild(S.el('span', 'ws-spacer'));
    bar.appendChild(S.el('span', 'tc-role', C.role));
    frame.appendChild(bar);
    var shot = S.el('div', 'tc-shot');
    var skel = S.el('div', 'tc-shot-skel');
    [62, 84, 48, 76, 58].forEach(function(w) { var line = S.el('i'); line.style.width = w + '%'; skel.appendChild(line); });
    shot.appendChild(skel);
    var img = document.createElement('img');
    img.className = 'tc-shot-img ts-hide';
    img.alt = C.alt;
    img.decoding = 'async';
    img.addEventListener('load', function() { shot.classList.add('is-loaded'); });
    img.addEventListener('error', function() { shot.classList.add('is-missing'); });
    img.src = C.capture;
    shot.appendChild(img);
    frame.appendChild(shot);
    root.appendChild(frame);
    n.frame = frame;
    n.img = img;
    n.label = S.el('div', 'tc-shot-label ts-hide', C.label, { left: FRAME.x + 12, top: FRAME.y + FRAME.h - 38 });
    root.appendChild(n.label);
    n.foot = S.el('div', 'tc-foot ts-hide', C.foot, { left: FRAME.x, top: FRAME.y + FRAME.h + 16, width: FRAME.w });
    root.appendChild(n.foot);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 120,  run: function() { S.on(n.frame); } },
    { delay: 700,  run: function() { S.on(n.img); } },
    { delay: 1300, run: function() { S.on(n.label); } },
    { delay: 1800, run: function() { S.on(n.foot); } },
    { delay: 2200, run: complete }
  ];
  var tl = createTimeline(steps);

  return {
    play: function() { build(); cv.setStatic(false); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { tl.reset(); build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      return 'A frame showing ' + C.alt + '. ' + C.foot;
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
