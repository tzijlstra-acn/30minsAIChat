// Scene: transformation-system (Screen 05 -- WHERE IT APPLIES)
// Message: "One use case changes five systems."
// Reimagined as a clean left/right HTML layout: obligation trigger card on the left,
// five impact cards on the right that illuminate one by one.
// Eliminates all text-over-border issues from the previous SVG knowledge graph approach.
SceneDirector.register('transformation-system', function(container, manifest, reduced) {

  var _timers = [];
  var _tl = null;

  function _t(fn, delay) {
    var id = setTimeout(fn, delay);
    _timers.push(id);
    return id;
  }

  // Five systems that the obligation change touches
  var SYSTEMS = [
    {
      label: 'Policy documentation',
      sub:   'Affected clause requires revision',
      color: '#58C994',
      bg:    'rgba(88,201,148,0.08)',
      border:'rgba(88,201,148,0.30)'
    },
    {
      label: 'Control framework',
      sub:   'Two controls require redesign',
      color: '#55C7E8',
      bg:    'rgba(85,199,232,0.08)',
      border:'rgba(85,199,232,0.30)'
    },
    {
      label: 'Data catalogue',
      sub:   'Processing basis entries updated',
      color: '#B44CFF',
      bg:    'rgba(180,76,255,0.08)',
      border:'rgba(180,76,255,0.30)'
    },
    {
      label: 'Process maps',
      sub:   'Workflow decision node changes',
      color: '#F3B34C',
      bg:    'rgba(243,179,76,0.08)',
      border:'rgba(243,179,76,0.28)'
    },
    {
      label: 'Governance register',
      sub:   'Approval gate record updated',
      color: '#F0758A',
      bg:    'rgba(240,117,138,0.08)',
      border:'rgba(240,117,138,0.28)'
    }
  ];

  function build() {
    container.innerHTML = '';

    var root = document.createElement('div');
    root.className = 'scene-root';
    root.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:row;gap:0;'
      + 'align-items:stretch;overflow:hidden;box-sizing:border-box;padding:14px 18px;';

    // ── LEFT PANEL: Obligation trigger ──────────────────────────────────────
    var leftPanel = document.createElement('div');
    leftPanel.id = 'ts-left';
    leftPanel.style.cssText = 'flex:0 0 310px;display:flex;flex-direction:column;gap:14px;'
      + 'opacity:0;transform:translateX(-28px);'
      + 'transition:opacity .5s ease,transform .5s cubic-bezier(.16,1,.3,1);';

    // Tag
    var oblTag = document.createElement('div');
    oblTag.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
      + 'letter-spacing:.14em;text-transform:uppercase;color:rgba(180,76,255,.55);flex-shrink:0;';
    oblTag.textContent = 'Obligation';
    leftPanel.appendChild(oblTag);

    // Obligation card
    var oblCard = document.createElement('div');
    oblCard.style.cssText = 'border:2px solid rgba(180,76,255,.42);border-radius:12px;'
      + 'background:rgba(180,76,255,.08);padding:22px 20px 18px;display:flex;'
      + 'flex-direction:column;gap:10px;flex-shrink:0;';

    var artNum = document.createElement('div');
    artNum.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:26px;'
      + 'font-weight:700;color:rgba(180,76,255,.45);line-height:1;';
    artNum.textContent = 'Art. 7(3)';
    oblCard.appendChild(artNum);

    var artTitle = document.createElement('div');
    artTitle.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:21px;'
      + 'font-weight:700;color:var(--text-1);line-height:1.2;';
    artTitle.textContent = 'Data minimisation';
    oblCard.appendChild(artTitle);

    var artScope = document.createElement('div');
    artScope.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:12px;'
      + 'color:rgba(180,76,255,.60);margin-top:2px;';
    artScope.textContent = 'Processing activities — Coverage mapping';
    oblCard.appendChild(artScope);

    leftPanel.appendChild(oblCard);

    // Impact counter
    var implRow = document.createElement('div');
    implRow.id = 'ts-impl';
    implRow.style.cssText = 'opacity:0;transition:opacity .5s ease;flex-shrink:0;'
      + 'display:flex;align-items:baseline;gap:8px;padding:12px 16px;'
      + 'background:rgba(255,255,255,0.04);border-radius:8px;'
      + 'border:1px solid rgba(255,255,255,0.12);';

    var implPre = document.createElement('span');
    implPre.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:14px;color:var(--text-3);';
    implPre.textContent = 'One change touches';
    implRow.appendChild(implPre);

    var counter = document.createElement('span');
    counter.id = 'ts-counter';
    counter.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:32px;'
      + 'font-weight:700;color:var(--text-1);line-height:1;';
    counter.textContent = '0';
    implRow.appendChild(counter);

    var implPost = document.createElement('span');
    implPost.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:14px;color:var(--text-3);';
    implPost.textContent = 'systems';
    implRow.appendChild(implPost);

    leftPanel.appendChild(implRow);
    root.appendChild(leftPanel);

    // ── CENTER DIVIDER ──────────────────────────────────────────────────────
    var divider = document.createElement('div');
    divider.id = 'ts-divider';
    divider.style.cssText = 'flex:0 0 44px;display:flex;align-items:center;justify-content:center;'
      + 'opacity:0;transition:opacity .5s ease;'
      + 'font-family:\'JetBrains Mono\',monospace;font-size:22px;color:rgba(255,255,255,.20);';
    divider.textContent = '›';
    root.appendChild(divider);

    // ── RIGHT PANEL: System impact cards ────────────────────────────────────
    var rightPanel = document.createElement('div');
    rightPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:8px;';

    // Header
    var rightHdr = document.createElement('div');
    rightHdr.id = 'ts-right-hdr';
    rightHdr.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;'
      + 'letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.25);flex-shrink:0;'
      + 'opacity:0;transition:opacity .5s ease;';
    rightHdr.textContent = 'Systems affected';
    rightPanel.appendChild(rightHdr);

    SYSTEMS.forEach(function(s, i) {
      var card = document.createElement('div');
      card.id = 'ts-sys-' + i;
      card.style.cssText = 'flex:1;display:flex;flex-direction:row;align-items:center;gap:16px;'
        + 'background:' + s.bg + ';border:1px solid ' + s.border + ';border-radius:10px;'
        + 'padding:0 18px;'
        + 'opacity:0;transform:translateX(24px);'
        + 'transition:opacity .4s ease,transform .4s cubic-bezier(.16,1,.3,1);';

      // Number badge
      var badge = document.createElement('div');
      badge.style.cssText = 'flex-shrink:0;width:38px;height:38px;border-radius:50%;'
        + 'background:' + s.bg + ';border:2px solid ' + s.border + ';'
        + 'display:flex;align-items:center;justify-content:center;';
      badge.innerHTML = '<span style="font-family:\'JetBrains Mono\',monospace;font-size:16px;'
        + 'font-weight:700;color:' + s.color + '">' + (i + 1) + '</span>';
      card.appendChild(badge);

      // Label + sub
      var textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex:1;';
      textWrap.innerHTML =
        '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:16px;font-weight:700;'
        + 'color:var(--text-1);margin-bottom:3px;line-height:1.2">' + s.label + '</div>'
        + '<div style="font-family:\'Inter\',sans-serif;font-size:14px;color:var(--text-2)">' + s.sub + '</div>';
      card.appendChild(textWrap);

      // Right accent bar
      var bar = document.createElement('div');
      bar.style.cssText = 'flex-shrink:0;width:4px;height:22px;border-radius:2px;'
        + 'background:' + s.color + ';opacity:.55;';
      card.appendChild(bar);

      rightPanel.appendChild(card);
    });

    root.appendChild(rightPanel);
    container.appendChild(root);
  }

  // ── Animation helpers ──────────────────────────────────────────────────────
  function showLeft() {
    var el = container.querySelector('#ts-left');
    if (!el) return;
    el.style.opacity = '1';
    el.style.transform = 'translateX(0)';
  }

  function showDivider() {
    var el = container.querySelector('#ts-divider');
    if (el) el.style.opacity = '1';
    var hdr = container.querySelector('#ts-right-hdr');
    if (hdr) hdr.style.opacity = '1';
  }

  function showImplication() {
    var el = container.querySelector('#ts-impl');
    if (el) el.style.opacity = '1';
  }

  function showSystem(i) {
    var card = container.querySelector('#ts-sys-' + i);
    if (card) {
      card.style.opacity = '1';
      card.style.transform = 'translateX(0)';
    }
    var ctr = container.querySelector('#ts-counter');
    if (ctr) ctr.textContent = String(i + 1);
  }

  function showAll() {
    showLeft();
    showDivider();
    showImplication();
    for (var i = 0; i < SYSTEMS.length; i++) { showSystem(i); }
  }

  // ── Timeline ──────────────────────────────────────────────────────────────
  var _steps = [
    { delay: 200,  run: showLeft },
    { delay: 750,  run: function() { showDivider(); showImplication(); } },
    { delay: 1100, run: function() { showSystem(0); } },
    { delay: 1500, run: function() { showSystem(1); } },
    { delay: 1900, run: function() { showSystem(2); } },
    { delay: 2300, run: function() { showSystem(3); } },
    { delay: 2700, run: function() {
      showSystem(4);
      _t(function() {
        container.dispatchEvent(new CustomEvent('scene:complete', { bubbles: true }));
      }, 600);
    }}
  ];

  // ── Public interface ──────────────────────────────────────────────────────
  return {
    play: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      build();
      if (reduced) { showAll(); return; }
      _tl = createTimeline(_steps);
      _tl.play();
    },

    pause: function() { if (_tl) _tl.pause(); },

    resume: function() { if (_tl) _tl.resume(); },

    reset: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      build();
      _tl = createTimeline(_steps);
      _tl.reset();
    },

    finish: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      build();
      showAll();
    },

    getAccessibleSummary: function() {
      return 'Obligation Art. 7(3) Data minimisation triggers changes across five systems: '
        + 'Policy documentation, Control framework, Data catalogue, Process maps, and Governance register. '
        + 'One use case change touches five connected systems.';
    },

    destroy: function() {
      if (_tl) { _tl.destroy(); _tl = null; }
      _timers.forEach(clearTimeout); _timers = [];
      container.innerHTML = '';
    }
  };
});
