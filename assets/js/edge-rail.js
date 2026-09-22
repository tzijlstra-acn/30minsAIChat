// ── LEFT-EDGE NAVIGATION RAIL ──
// Opens on deliberate hover (140 ms dwell), keyboard (G toggle, P pin, Escape close),
// or mobile menu button. Overlays content; does not push the page.
// Pinned mode (1536 px+ only) reserves 312 px after explicit user action.

(function() {
  var EDGE_DWELL_MS  = 140;
  var EDGE_CLOSE_MS  = 350;
  var PANEL_WIDTH    = 312;
  var PIN_VIEWPORT   = 1536;

  var rail, panel, backdrop, mobileBtn;
  var openTimer = null, closeTimer = null;
  var isPinned = false;
  var isOpen   = false;

  function init() {
    rail     = document.getElementById('edgeRail');
    panel    = document.getElementById('edgePanel');
    backdrop = document.getElementById('edgeBackdrop');
    mobileBtn = document.getElementById('edgeMobileBtn');

    if (!rail || !panel) return;

    buildPanelContent();

    // Desktop: activation zone hover
    rail.addEventListener('mouseenter', onRailEnter);
    panel.addEventListener('mouseenter', onPanelEnter);
    panel.addEventListener('mouseleave', onPanelLeave);

    // Backdrop click
    if (backdrop) backdrop.addEventListener('click', function() { close(); });

    // Mobile button
    if (mobileBtn) mobileBtn.addEventListener('click', function() { isOpen ? close() : open(); });

    // Touch: swipe from left 24 px
    var touchStartX = 0;
    document.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (touchStartX < 24 && dx > 40) { open(); }
      else if (isOpen && dx < -40) { close(); }
    }, { passive: true });

    // Keyboard
    document.addEventListener('keydown', function(e) {
      if (['INPUT', 'TEXTAREA'].indexOf(e.target.tagName) > -1) return;
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && isOpen) {
        e.preventDefault();
        togglePin();
      }
      if (e.key === 'Escape' && isOpen) { close(); }
    });

    // Store: update active screen highlight on state change
    document.addEventListener('nfr:statechange', function(e) {
      if (e.detail && e.detail.action && (e.detail.action.type === 'SET_PROOF_CANDIDATE' || e.detail.action.type === 'SET_LENS')) {
        updateActiveChip(e.detail.state);
      }
    });

    // Navigate to hash on load
    if (location.hash) {
      var hashEl = document.getElementById(location.hash.slice(1));
      if (hashEl) setTimeout(function() { hashEl.scrollIntoView(); }, 200);
    }
  }

  function buildPanelContent() {
    if (!panel) return;
    var sections = Array.from(document.querySelectorAll('section[data-slide]'));

    // Group by chapter
    var chapters = {}, chapterOrder = [];
    sections.forEach(function(sec) {
      var cid = sec.dataset.chapterId || 'unknown';
      var ctitle = sec.dataset.chapterTitle || cid;
      if (!chapters[cid]) { chapters[cid] = { id: cid, title: ctitle, slides: [] }; chapterOrder.push(cid); }
      var route = sec.dataset.route || 'core';
      chapters[cid].slides.push({
        id: sec.id,
        navTitle: sec.dataset.navTitle || sec.id,
        route: route,
        el: sec
      });
    });

    var html = '<div class="er-header">'
      + '<div class="er-title">NFR AI</div>'
      + '<div class="er-subtitle">Executive Conversation</div>'
      + '</div>'
      + '<div class="er-candidate-chip" id="erCandidateChip" style="display:none">'
      + '<span class="er-chip-label" id="erCandidateLabel"></span>'
      + '</div>'
      + '<div class="er-search-wrap"><input class="er-search" id="erSearch" placeholder="Search screens..." autocomplete="off" aria-label="Search screens"></div>'
      + '<div class="er-chapters" id="erChapters">';

    var coreChapters = chapterOrder.filter(function(cid) { return chapters[cid].slides.some(function(s) { return s.route === 'core'; }); });
    var refChapters  = chapterOrder.filter(function(cid) { return !coreChapters.indexOf(cid) < 0 && chapters[cid].slides.some(function(s) { return s.route === 'reference'; }); });

    coreChapters.forEach(function(cid) {
      var ch = chapters[cid];
      html += '<div class="er-chapter"><div class="er-ch-name">' + ch.title + '</div><div class="er-slides">';
      ch.slides.filter(function(s) { return s.route === 'core'; }).forEach(function(slide) {
        html += '<a class="er-slide-link" href="#' + slide.id + '" data-sid="' + slide.id + '">' + slide.navTitle + '</a>';
      });
      html += '</div></div>';
    });

    if (refChapters.length) {
      html += '<div class="er-divider"></div><div class="er-chapter er-chapter-ref"><div class="er-ch-name">Reference</div><div class="er-slides">';
      refChapters.forEach(function(cid) {
        chapters[cid].slides.filter(function(s) { return s.route === 'reference'; }).forEach(function(slide) {
          html += '<a class="er-slide-link" href="#' + slide.id + '" data-sid="' + slide.id + '">' + slide.navTitle + '</a>';
        });
      });
      html += '</div></div>';
    }

    html += '</div>'
      + '<div class="er-footer">'
      + '<button class="er-mode-btn active" data-mode="present" title="Present mode"><i class="ti ti-presentation"></i><span>Present</span></button>'
      + '<button class="er-mode-btn" data-mode="explore" title="Explore mode"><i class="ti ti-adjustments"></i><span>Explore</span></button>'
      + '<button class="er-pin-btn" id="erPinBtn" title="Pin panel (P)" aria-pressed="false"><i class="ti ti-pin"></i></button>'
      + '</div>';

    panel.innerHTML = html;

    // Delegate link clicks
    panel.addEventListener('click', function(e) {
      var link = e.target.closest('.er-slide-link');
      if (link) {
        e.preventDefault();
        var sid = link.dataset.sid;
        var target = document.getElementById(sid);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        if (!isPinned) close();
      }
      var modeBtn = e.target.closest('.er-mode-btn');
      if (modeBtn) {
        var m = modeBtn.dataset.mode;
        panel.querySelectorAll('.er-mode-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.mode === m); });
        if (typeof setMode === 'function') setMode(m);
        document.documentElement.setAttribute('data-mode', m);
      }
      var pinBtn = e.target.closest('.er-pin-btn');
      if (pinBtn) togglePin();
    });

    // Search
    var searchInput = panel.querySelector('#erSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = searchInput.value.toLowerCase().trim();
        panel.querySelectorAll('.er-slide-link').forEach(function(a) {
          var match = !q || a.textContent.toLowerCase().indexOf(q) > -1;
          a.style.display = match ? '' : 'none';
        });
        panel.querySelectorAll('.er-chapter').forEach(function(ch) {
          var visible = Array.from(ch.querySelectorAll('.er-slide-link')).some(function(a) { return a.style.display !== 'none'; });
          ch.style.display = visible ? '' : 'none';
        });
      });
    }
  }

  function updateHighlight(sectionId) {
    if (!panel) return;
    panel.querySelectorAll('.er-slide-link').forEach(function(a) {
      a.classList.toggle('active', a.dataset.sid === sectionId);
    });
    // Update active chapter
    var activeSec = document.getElementById(sectionId);
    if (activeSec) {
      var cid = activeSec.dataset.chapterId;
      panel.querySelectorAll('.er-chapter').forEach(function(ch) {
        var names = Array.from(ch.querySelectorAll('.er-slide-link')).map(function(a) { return (document.getElementById(a.dataset.sid) || {}).dataset || {}; });
        var inChapter = names.some(function(d) { return d.chapterId === cid; });
        ch.classList.toggle('er-chapter-active', inChapter);
      });
    }
  }

  function updateActiveChip(state) {
    var chip = document.getElementById('erCandidateChip');
    var label = document.getElementById('erCandidateLabel');
    if (!chip || !label) return;
    var cid = state && state.proofCandidateId;
    if (cid) {
      var candidate = typeof USE_CASES !== 'undefined' ? USE_CASES.find(function(u) { return u.id === cid; }) : null;
      label.textContent = candidate ? candidate.title || candidate.name : cid;
      chip.style.display = '';
    } else {
      chip.style.display = 'none';
    }
  }

  // ── OPEN / CLOSE ──
  function open() {
    if (isOpen) return;
    clearTimeout(openTimer); clearTimeout(closeTimer);
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('visible');
    // Focus first link or search
    var first = panel.querySelector('.er-search');
    if (first) setTimeout(function() { first.focus(); }, 50);
  }

  function close() {
    if (!isOpen || isPinned) return;
    clearTimeout(openTimer); clearTimeout(closeTimer);
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('visible');
  }

  function togglePin() {
    if (window.innerWidth < PIN_VIEWPORT) return;
    isPinned = !isPinned;
    panel.classList.toggle('pinned', isPinned);
    document.body.classList.toggle('edge-pinned', isPinned);
    var btn = document.getElementById('erPinBtn');
    if (btn) btn.setAttribute('aria-pressed', String(isPinned));
    if (isPinned) { isOpen = true; panel.classList.add('open'); }
  }

  // ── HOVER INTENT ──
  function onRailEnter(e) {
    clearTimeout(closeTimer);
    openTimer = setTimeout(open, EDGE_DWELL_MS);
  }

  function onPanelEnter() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
  }

  function onPanelLeave() {
    if (isPinned) return;
    closeTimer = setTimeout(close, EDGE_CLOSE_MS);
  }

  // Expose updateHighlight for navigation.js
  window.edgeRailHighlight = updateHighlight;

  document.addEventListener('DOMContentLoaded', init);
}());
