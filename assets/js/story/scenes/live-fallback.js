// Scene: live-fallback (reference, opened from screen 10 with F)
// The captured fallback for the live demonstration: the five acts as screenshots taken
// from the real product on its deterministic demo day (NFR_LIVE_CAPTURES). Act tabs and
// a counter orient the room; Space steps through the captures and, after the last one,
// continues to the appendix index, where the live demonstration also ends: the core
// route stops at screen 10.
// A missing capture shows a labelled placeholder, never a broken image.
SceneDirector.register('live-fallback', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var L = window.NFR_LIVE_CAPTURES;
  var shots = [];
  var at = 0;
  var n = {};
  var done = false;

  function el(tag, cls, text) { var x = document.createElement(tag); if (cls) x.className = cls; if (text !== undefined && text !== null) x.textContent = text; return x; }
  function icon(name) { var i = el('i', 'ti ' + name); i.setAttribute('aria-hidden', 'true'); return i; }

  function flatten() {
    shots = [];
    (L && L.acts || []).forEach(function(a, ai) { a.shots.forEach(function(s, si) { shots.push({ act: a, ai: ai, si: si, shot: s }); }); });
  }

  function build() {
    // Keep the accessible summary the director injected
    var summary = container.querySelector('.scene-accessible-summary');
    container.innerHTML = '';
    if (summary) container.appendChild(summary);
    flatten();
    done = false;
    at = 0;
    var wrap = el('div', 'lf');
    var tabs = el('div', 'lf-tabs');
    tabs.setAttribute('role', 'tablist');
    n.tabs = (L && L.acts || []).map(function(a, ai) {
      var b = el('button', 'lf-tab');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.appendChild(el('span', 'lf-tab-n', 'Act ' + (ai + 1)));
      b.appendChild(el('span', 'lf-tab-t', a.title));
      b.addEventListener('click', function(e) { e.stopPropagation(); show(firstOf(ai)); });
      tabs.appendChild(b);
      return b;
    });
    wrap.appendChild(tabs);
    var stage = el('div', 'lf-stage');
    n.frame = el('div', 'lf-frame');
    stage.appendChild(n.frame);
    var side = el('div', 'lf-side');
    n.counter = el('div', 'lf-counter');
    n.takeaway = el('div', 'lf-takeaway');
    n.caption = el('div', 'lf-caption');
    var ctrl = el('div', 'lf-ctrl');
    n.prev = el('button', 'apx-btn');
    n.prev.type = 'button';
    n.prev.appendChild(icon('ti-arrow-left'));
    n.prev.appendChild(el('span', null, 'Previous'));
    n.prev.addEventListener('click', function(e) { e.stopPropagation(); show(at - 1); });
    n.next = el('button', 'apx-btn');
    n.next.type = 'button';
    n.next.appendChild(el('span', null, 'Next (Space)'));
    n.next.appendChild(icon('ti-arrow-right'));
    n.next.addEventListener('click', function(e) { e.stopPropagation(); advance(); });
    ctrl.appendChild(n.prev);
    ctrl.appendChild(n.next);
    side.appendChild(n.counter);
    side.appendChild(n.takeaway);
    side.appendChild(n.caption);
    side.appendChild(ctrl);
    side.appendChild(el('div', 'lf-source', L ? L.source : 'No captures loaded.'));
    stage.appendChild(side);
    wrap.appendChild(stage);
    container.appendChild(wrap);
    show(0);
  }

  function firstOf(ai) { for (var i = 0; i < shots.length; i++) if (shots[i].ai === ai) return i; return 0; }

  function show(i) {
    if (!shots.length) { n.frame.innerHTML = ''; n.frame.appendChild(el('div', 'lf-missing', 'No captures available.')); return; }
    at = Math.max(0, Math.min(shots.length - 1, i));
    var s = shots[at];
    n.frame.innerHTML = '';
    var img = el('img', 'lf-img');
    img.alt = s.shot.caption;
    img.decoding = 'async';
    img.addEventListener('error', function() {
      n.frame.innerHTML = '';
      n.frame.appendChild(el('div', 'lf-missing', 'Capture not available: ' + s.shot.file));
    });
    img.src = s.shot.file;
    n.frame.appendChild(img);
    n.tabs.forEach(function(b, ai) { var on = ai === s.ai; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    var inAct = s.act.shots.length;
    n.counter.textContent = 'Act ' + (s.ai + 1) + ' of ' + L.acts.length + ' · capture ' + (s.si + 1) + ' of ' + inAct;
    n.takeaway.textContent = s.act.takeaway;
    n.caption.textContent = s.shot.caption;
    n.prev.disabled = at === 0;
    var sec = container.closest('section');
    if (sec) sec.setAttribute('data-capture', String(at));
    if (window.NFRExperience) NFRExperience.set('live-fallback');
  }

  function advance() {
    if (at < shots.length - 1) { show(at + 1); return true; }
    if (typeof goToId === 'function') goToId('appendix');
    return true;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var tl = createTimeline([{ delay: 60, run: complete }]);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    seek: function() { build(); tl.finish(); },
    reset: function() { tl.reset(); build(); },
    finish: function() { build(); tl.finish(); },
    resize: function() {},
    renderStatic: function() { build(); tl.finish(); },
    renderError: function() { tl.reset(); container.innerHTML = ''; },
    advance: advance,
    key: function(k) {
      if (k === 'prev') { show(at - 1); return true; }
      if (k === 'Escape') { if (typeof goToId === 'function') goToId('enter-workspace'); return true; }
      return false;
    },
    getAccessibleSummary: function() {
      return 'Product walkthrough, captured from the live product: ' + (L ? L.acts.map(function(a, i) { return 'act ' + (i + 1) + ', ' + a.title.toLowerCase(); }).join('; ') : 'no captures') + '.';
    },
    destroy: function() { tl.destroy(); container.innerHTML = ''; }
  };
});
