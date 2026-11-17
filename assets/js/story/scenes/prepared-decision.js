// Scene: prepared-decision (Screen 04)
// Causal story: evidence objects enter from authorised sources; only the differences
// reach the decision, not full documents; the missing report stays amber and visible;
// the proposed action appears last; then the amber human decision gate activates.
// This is the first screen where the NFR OS name is prominent.
// All case facts come from window.TPRM_CASE.
SceneDirector.register('prepared-decision', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;
  var CARD = { x: 330, y: 8, w: 694, h: 504 };
  var ROW = { x: CARD.x + 24, w: CARD.w - 48, h: 38 };
  var ROW_Y = [150, 196, 242];
  var MISSING_Y = 290;

  var cv = null;
  var n = {};
  var done = false;

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'prepared-decision' });
    n = { sources: [], links: [], rows: [] };
    done = false;
    var C = window.TPRM_CASE;
    var root = cv.el;
    var g = cv.svg;

    n.srcLabel = S.el('div', 'ts-label ts-hide', 'Authorised sources', { left: 16, top: 112 });
    root.appendChild(n.srcLabel);

    // Evidence objects: one per material change, plus the missing report
    var evidence = C.changes.map(function(ch) {
      return { label: ch.evidence, detail: ch.type, state: ch.evidenceState };
    }).concat(C.missing.map(function(m) {
      return { label: m.title, detail: m.detail, state: 'Missing' };
    }));
    evidence.forEach(function(ev, i) {
      var y = 140 + i * 66;
      var chip = S.EvidenceChip.create(null, { label: ev.label, detail: ev.detail, state: ev.state, stateLabel: ev.state });
      chip.el.classList.add('ts-hide', 'ts-left');
      chip.el.style.position = 'absolute';
      chip.el.style.left = '16px';
      chip.el.style.top = y + 'px';
      chip.el.style.width = '262px';
      root.appendChild(chip.el);
      n.sources.push(chip.el);
      var targetY = i < ROW_Y.length ? ROW_Y[i] + ROW.h / 2 : MISSING_Y + ROW.h / 2;
      var cls = i < ROW_Y.length ? 'ts-s-proof' : 'ts-s-human';
      n.links.push(S.path(g, 'M280 ' + (y + 25) + ' C310 ' + (y + 25) + ' 320 ' + targetY + ' ' + (ROW.x - 4) + ' ' + targetY, cls));
    });

    // The prepared-decision card: a real process object
    var card = S.el('div', 'ts-obj ts-c-ai pd-card ts-hide ts-pop', null, { left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h });
    root.appendChild(card);
    n.card = card;

    // Header, question and meta live inside the card and reveal with it
    var head = S.el('div', 'pd-head');
    head.appendChild(S.el('span', 'ts-label ts-ink ts-c-ai', 'NFR OS / Prepared decision'));
    n.needs = S.el('span', 'ts-chip ts-c-human pd-needs', 'Needs judgement');
    head.appendChild(n.needs);
    card.appendChild(head);
    card.appendChild(S.el('div', 'pd-title', C.question));
    var metaRow = S.el('div', 'pd-meta');
    metaRow.appendChild(S.el('span', 'ts-text', C.reviewType + ' / ' + C.criticality + ' provider / Due ' + C.due.toLowerCase()));
    S.CaseBadge.create(metaRow, { compact: true });
    card.appendChild(metaRow);

    n.changedLabel = S.el('div', 'ts-label ts-ink ts-c-ai ts-hide', 'What changed', { left: ROW.x, top: 124 });
    root.appendChild(n.changedLabel);
    C.changes.forEach(function(ch, i) {
      var row = S.el('div', 'pd-row ts-hide ts-left', null, { left: ROW.x, top: ROW_Y[i], width: ROW.w, height: ROW.h });
      row.appendChild(S.el('span', 'pd-row-title', ch.title));
      row.appendChild(S.el('span', 'ts-chip ts-c-ai pd-tag', ch.tag));
      root.appendChild(row);
      n.rows.push(row);
    });

    var miss = C.missing[0];
    var unc = S.UncertaintyBadge.create(null, { label: 'Missing: ' + miss.title, note: miss.requirement });
    unc.el.classList.add('ts-hide', 'ts-left');
    unc.el.style.position = 'absolute';
    unc.el.style.left = ROW.x + 'px';
    unc.el.style.top = MISSING_Y + 'px';
    unc.el.style.width = ROW.w + 'px';
    unc.el.style.height = ROW.h + 'px';
    root.appendChild(unc.el);
    n.missing = unc.el;

    var prop = S.el('div', 'pd-proposed ts-hide ts-up', null, { left: ROW.x, top: 346, width: ROW.w, height: 52 });
    prop.appendChild(S.el('span', 'ts-label ts-ink ts-c-ai', 'Proposed action'));
    var pt = S.el('div', 'pd-proposed-text');
    pt.appendChild(S.el('div', 'pd-proposed-main', C.proposedAction));
    pt.appendChild(S.el('div', 'ts-text', C.followUp));
    prop.appendChild(pt);
    root.appendChild(prop);
    n.proposed = prop;

    // Human decision: the gate activates last
    var decide = S.el('div', 'pd-decide ts-hide ts-up', null, { left: ROW.x, top: 420, width: ROW.w, height: 72 });
    ['Approve', 'Edit', 'Reject'].forEach(function(lbl, i) {
      decide.appendChild(S.el('span', 'pd-btn' + (i === 0 ? ' pd-btn-primary' : ''), lbl));
    });
    var gate = S.DecisionGate.create(decide, { size: 'small', label: 'Human decision', sub: 'Write only after approval' });
    gate.el.classList.add('pd-gate');
    root.appendChild(decide);
    n.decide = decide;
    n.gate = gate;
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 200,  run: function() { S.on(n.card); } },
    { delay: 600,  run: function() { S.on(n.srcLabel); S.on(n.sources[0]); } },
    { delay: 850,  run: function() { S.on(n.sources[1]); } },
    { delay: 1100, run: function() { S.on(n.sources[2]); } },
    { delay: 1350, run: function() { S.on(n.sources[3]); } },
    { delay: 1900, run: function() { S.on(n.changedLabel); S.on(n.links.slice(0, 3)); } },
    { delay: 2300, run: function() { S.on(n.rows[0]); } },
    { delay: 2550, run: function() { S.on(n.rows[1]); } },
    { delay: 2800, run: function() { S.on(n.rows[2]); } },
    { delay: 3300, run: function() { S.on(n.links[3]); S.on(n.missing); } },
    { delay: 4200, run: function() { S.on(n.proposed); } },
    { delay: 5100, run: function() { S.on(n.decide); n.gate.activate(); n.needs.classList.add('is-active'); } },
    { delay: 6000, run: complete }
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
      var C = window.TPRM_CASE;
      return 'Prepared decision for synthetic case ' + C.id + ', ' + C.provider + ', ' + C.reviewType.toLowerCase() + ' due ' + C.due.toLowerCase() + '. '
        + 'Evidence enters from authorised sources and only the changes are shown: '
        + C.changes.map(function(ch) { return ch.detail.toLowerCase(); }).join('; ') + '. '
        + 'Missing and visible: ' + C.missing[0].title.toLowerCase() + ', ' + C.missing[0].requirement.toLowerCase() + '. '
        + 'Proposed action: ' + C.proposedAction.toLowerCase() + '. An amber human decision gate is active: approve, edit or reject. Writing happens only after approval.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
