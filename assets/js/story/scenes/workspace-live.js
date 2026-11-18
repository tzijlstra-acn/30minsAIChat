// Scene: workspace-live (Screen 08)
// Causal story: the workspace on the previous screens is not a mock-up. NFR OS runs
// today on a synthetic bank. Three real captures, in the order a professional meets
// them: the ranked workday, asking the work partner for a skill in a sentence, and
// the skill read back, previewed on the role's own records and saved by the person.
// The guardrails are the product's own: read only, scoped to the role, every run
// audited, and it works without a model key. The captures are screenshots of the
// running product, labelled as such; nothing on them is client data.
SceneDirector.register('workspace-live', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var WIN = { x: 0, y: 0, w: 720, chrome: 30 };
  var SHOT_H = Math.round(WIN.w * 700 / 1120);
  var COL = { x: 744, w: 296 };
  var STEP_H = 116, STEP_GAP = 8, STEP_Y = 0;

  var SHOTS = [
    { src: './assets/img/nfros/nfros-home.jpg', alt: 'NFR OS workday for the Third-Party Risk Manager at the synthetic Arcadia Bank AG: what needs judgement now, what is next, and what ran in the background.' },
    { src: './assets/img/nfros/nfros-partner.jpg', alt: 'The AI Partner chat in NFR OS, asked to build a skill for critical suppliers due for assessment, answering with a read-only preview and a link to Skills.' },
    { src: './assets/img/nfros/nfros-skills.jpg', alt: 'The Skills builder in NFR OS showing the drafted skill: the records it reads, its filters, a read-only preview with one matching supplier, and the save form.' }
  ];
  var STEPS = [
    { title: 'The workday, ranked', text: 'The TPRM officer\'s live workspace: what needs judgement now, and what ran in the background.' },
    { title: 'Ask the partner for a skill', text: '"Build a skill that lists critical suppliers due in the next 90 days."' },
    { title: 'Check it, save it, reuse it', text: 'Read back filter by filter, previewed on the role\'s own records. Saving stays a human step.' }
  ];
  var GUARDS = [
    ['ti-eye', 'Read only'],
    ['ti-building-bank', 'Scoped to the role\'s entity'],
    ['ti-file-check', 'Every run audited'],
    ['ti-shield-check', 'Works without a model key']
  ];

  var cv = null;
  var n = {};
  var done = false;

  function show(index) {
    n.shots.forEach(function(img, i) { img.classList.toggle('is-active', i === index); });
    n.steps.forEach(function(step, i) {
      step.classList.toggle('is-active', i === index);
      step.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
  }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'workspace-live' });
    n = { shots: [], steps: [], guards: [] };
    done = false;
    var root = cv.el;

    // A browser window around the real product
    var win = S.el('div', 'wl-window ts-hide', null, { left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.chrome + SHOT_H });
    var chrome = S.el('div', 'wl-chrome');
    var dots = S.el('span', 'wl-dots');
    dots.appendChild(S.el('i')); dots.appendChild(S.el('i')); dots.appendChild(S.el('i'));
    chrome.appendChild(dots);
    chrome.appendChild(S.el('span', 'wl-title', 'NFR OS, the running product'));
    chrome.appendChild(S.el('span', 'wl-spacer'));
    chrome.appendChild(S.el('span', 'wl-synthetic', 'Synthetic bank'));
    win.appendChild(chrome);
    var viewport = S.el('div', 'wl-viewport', null, { width: WIN.w, height: SHOT_H });
    SHOTS.forEach(function(shot) {
      var img = document.createElement('img');
      img.className = 'wl-shot';
      img.src = shot.src;
      img.alt = shot.alt;
      img.width = WIN.w;
      img.height = SHOT_H;
      img.decoding = 'async';
      viewport.appendChild(img);
      n.shots.push(img);
    });
    win.appendChild(viewport);
    root.appendChild(win);
    n.win = win;

    // The three moments, in the order a professional meets them
    STEPS.forEach(function(step, i) {
      var card = S.el('button', 'wl-step ts-hide ts-right', null, { left: COL.x, top: STEP_Y + i * (STEP_H + STEP_GAP), width: COL.w, height: STEP_H });
      card.type = 'button';
      card.setAttribute('aria-pressed', 'false');
      var head = S.el('span', 'wl-step-head');
      head.appendChild(S.el('span', 'wl-step-num', String(i + 1)));
      head.appendChild(S.el('span', 'wl-step-title', step.title));
      card.appendChild(head);
      card.appendChild(S.el('span', 'wl-step-text', step.text));
      card.addEventListener('click', function() { show(i); });
      root.appendChild(card);
      n.steps.push(card);
    });
    n.note = S.el('div', 'ts-note ts-hide', 'Screenshots of NFR OS on a synthetic institution', { left: COL.x, top: STEP_Y + 3 * (STEP_H + STEP_GAP) + 10, width: COL.w });
    root.appendChild(n.note);

    // The product's own guardrails, in one row under the window
    var row = S.el('div', 'wl-guards', null, { left: 0, top: WIN.chrome + SHOT_H + 12, width: W });
    GUARDS.forEach(function(g) {
      var chip = S.el('span', 'ts-chip ts-c-proof wl-guard ts-hide ts-up');
      chip.appendChild(S.icon(g[0]));
      chip.appendChild(S.el('span', null, g[1]));
      row.appendChild(chip);
      n.guards.push(chip);
    });
    root.appendChild(row);
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.win); show(0); } },
    { delay: 700,  run: function() { S.on(n.steps[0]); } },
    { delay: 3200, run: function() { S.on(n.steps[1]); show(1); } },
    { delay: 6200, run: function() { S.on(n.steps[2]); show(2); } },
    { delay: 7300, run: function() { S.on(n.guards[0]); S.on(n.guards[1]); } },
    { delay: 7700, run: function() { S.on(n.guards[2]); S.on(n.guards[3]); } },
    { delay: 8100, run: function() { S.on(n.note); } },
    { delay: 8800, run: complete }
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
      return 'Screenshots of NFR OS, the running product, on the synthetic Arcadia Bank AG. First, the Third-Party Risk Manager\'s workday, ranked by what needs judgement now. '
        + 'Second, the work partner is asked to build a skill that lists critical suppliers due for assessment in the next 90 days; it drafts the skill, previews it read only and hands it over. '
        + 'Third, the Skills builder reads the skill back filter by filter, previews it on the role\'s own records and leaves saving to the person. '
        + 'Guardrails: read only, scoped to the role\'s entity, every run audited, and it works without a model key.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
