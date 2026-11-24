// Scene: transition-cover (landing)
// Causal story: a restrained frame, not an AI motif. The frame appears, then the real
// product resolves inside it and keeps changing: four moments of one working day
// (Today with the next decision prepared, a live question answered visually, the review
// before anything is written, an agent that inherits the user's access), each cropped to
// its focal area so it reads at cover size, crossfading every few seconds with a caption
// and progress dots. One line underneath states the principle. Reduced motion and safe
// mode show the first moment only. If a capture cannot load, the frame keeps neutral
// placeholder lines.
SceneDirector.register('transition-cover', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var D = window.NFR_WORKSPACE_DEMO;
  var C = D.cover;
  var W = 560, H = 440;
  var FRAME = { x: 10, y: 24, w: 540, h: 360 };
  var BAR = 40;
  var SLIDES = C.slides && C.slides.length ? C.slides : [{ file: C.capture, label: C.label, focus: [0, 0, C.imageWidth || 1920] }];

  var cv = null;
  var n = {};
  var done = false;
  var current = 0;
  var timer = null;

  function still() { return reduced || (window.SceneDirector && SceneDirector.isSafe && SceneDirector.isSafe()) || SLIDES.length < 2; }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function show(i) {
    current = i;
    if (!n.imgs) return;
    n.imgs.forEach(function(im, k) { im.classList.toggle('is-on', k === i); });
    n.dots.forEach(function(d, k) { d.classList.toggle('is-on', k === i); });
    n.caption.textContent = SLIDES[i].label;
  }
  function start() {
    stop();
    if (still() || !done) return;
    timer = setInterval(function() { show((current + 1) % SLIDES.length); }, C.every || 4500);
  }

  function build() {
    stop();
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'cover' });
    n = { imgs: [], dots: [] };
    done = false;
    current = 0;
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
    var shotH = FRAME.h - BAR;
    SLIDES.forEach(function(sl, i) {
      // A frame-sized panel showing the focus region: the capture is scaled so the region's
      // width fills the frame, then shifted. Nothing extends past the frame.
      var k = FRAME.w / sl.focus[2];
      var slide = S.el('div', 'tc-slide' + (i === 0 ? ' is-on' : ''));
      slide.setAttribute('role', 'img');
      slide.setAttribute('aria-label', i === 0 ? C.alt : sl.label);
      slide.style.backgroundImage = 'url("' + sl.file + '")';
      slide.style.backgroundSize = Math.round((C.imageWidth || 1920) * k) + 'px auto';
      slide.style.backgroundPosition = Math.round(-sl.focus[0] * k) + 'px ' + Math.round(-sl.focus[1] * k) + 'px';
      if (i === 0) {
        var probe = new Image();
        probe.addEventListener('load', function() { shot.classList.add('is-loaded'); });
        probe.addEventListener('error', function() { shot.classList.add('is-missing'); });
        probe.src = sl.file;
      }
      shot.appendChild(slide);
      n.imgs.push(slide);
    });
    var cap = S.el('div', 'tc-cap');
    n.caption = S.el('span', 'tc-cap-t', SLIDES[0].label);
    cap.appendChild(n.caption);
    shot.appendChild(cap);
    if (SLIDES.length > 1) {
      var dots = S.el('div', 'tc-dots');
      SLIDES.forEach(function(sl, i) { var d = S.el('span', 'tc-dot' + (i === 0 ? ' is-on' : '')); dots.appendChild(d); n.dots.push(d); });
      shot.appendChild(dots);
    }
    frame.appendChild(shot);
    root.appendChild(frame);
    n.frame = frame;
    n.shot = shot;
    n.foot = S.el('div', 'tc-foot ts-hide', C.foot, { left: FRAME.x, top: FRAME.y + FRAME.h + 16, width: FRAME.w });
    root.appendChild(n.foot);
    if (shotH <= 0) shot.classList.add('is-missing');
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
    start();
  }

  var steps = [
    { delay: 120,  run: function() { S.on(n.frame); } },
    { delay: 700,  run: function() { n.shot.classList.add('is-shown'); } },
    { delay: 1600, run: function() { S.on(n.foot); } },
    { delay: 2200, run: complete }
  ];
  var tl = createTimeline(steps);

  return {
    play: function() { build(); cv.setStatic(false); tl.play(); },
    pause: function() { stop(); tl.pause(); },
    resume: function() { tl.resume(); start(); },
    seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
    reset: function() { stop(); tl.reset(); build(); },
    finish: function() { build(); cv.setStatic(true); tl.finish(); },
    resize: function() { if (cv) cv.fit(); },
    renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
    renderError: function() { stop(); tl.reset(); if (cv) cv.destroy(); S.restoreFallback(container); },
    getAccessibleSummary: function() {
      return 'A frame showing the live product, ' + C.alt + ', changing through four moments: ' + SLIDES.map(function(s) { return s.label.toLowerCase(); }).join('; ') + '. ' + C.foot;
    },
    destroy: function() { stop(); tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
