// Scene: pilot-trap (Screen 03)
// Causal story: four useful AI pilots each light up and produce a good output, but
// every output drops into its own file, chat, spreadsheet or inbox. The case stays
// incomplete because five operating rails are missing. Tone: pilots are useful
// learning that now needs assembling into one flow, not a failure of the IT team.
SceneDirector.register('pilot-trap', function(container, manifest, reduced) {
  var S = window.StoryKit;
  var W = 1040, H = 520;

  var PILOTS = [
    { label: 'Document summariser', icon: 'ti-file-description', output: 'Summary', silo: 'Separate file' },
    { label: 'Evidence chatbot',    icon: 'ti-robot',            output: 'Answer',  silo: 'Chat window' },
    { label: 'Classifier',          icon: 'ti-category',           output: 'Labels',  silo: 'Spreadsheet' },
    { label: 'Drafting assistant',  icon: 'ti-file-text',        output: 'Draft',   silo: 'Inbox' }
  ];
  var RAILS = [
    'No persistent case',
    'No named decision right',
    'No controlled write',
    'No process receipt',
    'No common value baseline'
  ];
  var COL_W = 236, COL_GAP = 21;

  var cv = null;
  var n = {};
  var done = false;

  function colX(i) { return 16 + i * (COL_W + COL_GAP); }

  function build() {
    if (cv) cv.destroy();
    cv = S.canvas(container, W, H, { id: 'pilot-trap' });
    n = { pilots: [], outputs: [], silos: [], rails: [] };
    done = false;
    var root = cv.el;
    var g = cv.svg;

    PILOTS.forEach(function(p, i) {
      var x = colX(i);
      var tile = S.el('div', 'ts-obj ts-c-ai pt-pilot ts-hide ts-up', null, { left: x, top: 12, width: COL_W, height: 84 });
      var head = S.el('div', 'pt-pilot-head');
      var icon = S.icon(p.icon, 'ts-ink');
      head.appendChild(icon);
      head.appendChild(S.el('span', 'ts-title', p.label));
      tile.appendChild(head);
      var ok = S.el('div', 'ts-label pt-works');
      ok.textContent = 'Useful output';
      tile.appendChild(ok);
      root.appendChild(tile);
      n.pilots.push(tile);

      var out = S.el('div', 'ts-chip ts-c-ai pt-output ts-hide', p.output, { left: x + COL_W / 2 - 40, top: 104, width: 80 });
      root.appendChild(out);
      n.outputs.push(out);

      var silo = S.el('div', 'pt-silo ts-hide', null, { left: x + 28, top: 150, width: COL_W - 56, height: 48 });
      silo.appendChild(S.el('span', 'ts-label', p.silo));
      root.appendChild(silo);
      n.silos.push(silo);
    });

    // The case these outputs never reach
    var box = S.el('div', 'pt-case ts-hide ts-pop', null, { left: 270, top: 236, width: 500, height: 268 });
    var badge = S.CaseBadge.create(box, { state: 'incomplete' });
    badge.el.classList.add('pt-case-badge');
    box.appendChild(S.el('div', 'ts-label pt-case-note', 'Outputs stop at the tool'));
    root.appendChild(box);
    n.caseBox = box;

    RAILS.forEach(function(r, i) {
      var rail = S.el('div', 'pt-rail ts-hide ts-left', null, { left: 300, top: 318 + i * 36, width: 440, height: 28 });
      var x = S.icon('ti-x');
      rail.appendChild(x);
      rail.appendChild(S.el('span', 'pt-rail-text', r));
      root.appendChild(rail);
      n.rails.push(rail);
    });

    // Respectful framing: the pilots are learning to assemble, not wasted work
    n.left = S.el('div', 'ts-text pt-aside ts-hide', 'Each pilot is useful learning.', { left: 16, top: 330, width: 230 });
    n.right = S.el('div', 'ts-text pt-aside ts-hide', 'The next step: connect the learning into one journey.', { left: 794, top: 330, width: 230 });
    root.appendChild(n.left);
    root.appendChild(n.right);
  }

  function light(i) {
    S.on(n.pilots[i]);
    n.pilots[i].classList.add('is-lit');
  }

  function drop(i) {
    S.on(n.outputs[i]);
    S.on(n.silos[i]);
    n.outputs[i].classList.add('is-dropped');
  }

  function complete() {
    if (done) return;
    done = true;
    S.complete(container);
  }

  var steps = [
    { delay: 300,  run: function() { light(0); } },
    { delay: 700,  run: function() { drop(0); } },
    { delay: 1100, run: function() { light(1); } },
    { delay: 1500, run: function() { drop(1); } },
    { delay: 1900, run: function() { light(2); } },
    { delay: 2300, run: function() { drop(2); } },
    { delay: 2700, run: function() { light(3); } },
    { delay: 3100, run: function() { drop(3); S.on(n.left); } },
    { delay: 3800, run: function() { S.on(n.caseBox); } },
    { delay: 4300, run: function() { S.on(n.rails[0]); } },
    { delay: 4650, run: function() { S.on(n.rails[1]); } },
    { delay: 5000, run: function() { S.on(n.rails[2]); } },
    { delay: 5350, run: function() { S.on(n.rails[3]); } },
    { delay: 5700, run: function() { S.on(n.rails[4]); } },
    { delay: 6300, run: function() { S.on(n.right); } },
    { delay: 7000, run: complete }
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
      var c = window.TPRM_CASE;
      return 'Four useful AI pilots, a document summariser, an evidence chatbot, a classifier and a drafting assistant, each produce a good output. '
        + 'Each output lands in its own file, chat window, spreadsheet or inbox. Case ' + (c ? c.id : '') + ' stays incomplete because five rails are missing: '
        + RAILS.join(', ').toLowerCase() + '. The pilots are useful learning to connect into one journey.';
    },
    destroy: function() { tl.destroy(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
  };
});
