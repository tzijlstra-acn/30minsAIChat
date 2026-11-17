// Scene: business-case (Screen 09) -- the only interactive core screen
// Causal story: current effort per review appears first; preparation reduces only the
// eligible categories while professional judgement stays intact; realism factors then
// reduce gross hours to net capacity; the outputs and payback appear last.
// Formulas live in roi-model.js; data in business-case.js; session state in
// business-case-state.js. This file only draws and wires inputs.
// Three measures stay apart: task preparation rate, direct effort reduction, net capacity.

(function() {
  var DATA = window.NFR_BUSINESS_CASE;
  var M = window.ROIModel;
  var STATE = window.BusinessCaseState;
  var F = M ? M.format : null;

  function pct(v) { return Math.round(v * 100); }

  // ── Assumptions drawer (works whether or not the scene is on screen) ──
  var DRAWER_FIELDS = [
    { section: 'Volume and labour', fields: [
      { path: 'annualReviewVolume', label: 'Periodic reviews per year', unit: '', bound: 'annualReviewVolume' },
      { path: 'loadedHourlyCost', label: 'Loaded cost per hour (EUR)', unit: '', bound: 'loadedHourlyCost' },
      { path: 'productiveHoursPerFte', label: 'Productive hours per FTE', unit: '', bound: 'productiveHoursPerFte' }
    ]},
    { section: 'Elapsed time', fields: [
      { path: 'elapsedDays', label: 'Current elapsed days per review', unit: '', bound: 'elapsedDays' },
      { path: 'waitingReduction', label: 'Waiting time removed', unit: '%', bound: 'factor' }
    ]},
    { section: 'One-time build (EUR)', fields: [
      { path: 'buildCost.design', label: 'Design and build', unit: '', bound: 'money' },
      { path: 'buildCost.data', label: 'Data and integration', unit: '', bound: 'money' },
      { path: 'buildCost.change', label: 'Change and training', unit: '', bound: 'money' }
    ]},
    { section: 'Annual run (EUR)', fields: [
      { path: 'runCost.platform', label: 'Platform', unit: '', bound: 'money' },
      { path: 'runCost.modelAndData', label: 'Model and data', unit: '', bound: 'money' },
      { path: 'runCost.support', label: 'Monitoring, support and assurance', unit: '', bound: 'money' }
    ]},
    { section: 'Ramp, rework and reuse', fields: [
      { path: 'rampYearOne', label: 'Year-one adoption ramp', unit: '%', bound: 'factor' },
      { path: 'measuredReworkValue', label: 'Measured rework value per year (EUR)', unit: '', bound: 'money' },
      { path: 'reuseShare', label: 'Build reused by journey two', unit: '%', bound: 'factor' }
    ]}
  ];

  function fieldInput(f) {
    var b = DATA.bounds[f.bound];
    var raw = STATE.readField(f.path);
    var isPct = f.unit === '%';
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'ts-input bc-dr-input';
    input.min = isPct ? Math.round(b.min * 100) : b.min;
    input.max = isPct ? Math.round(b.max * 100) : b.max;
    input.step = isPct ? 5 : b.step;
    input.value = isPct ? pct(raw || 0) : raw;
    input.setAttribute('aria-label', f.label + (isPct ? ', percent' : ''));
    input.dataset.edited = STATE.isEdited(f.path) ? 'true' : 'false';
    input.addEventListener('change', function() {
      var v = parseFloat(input.value);
      if (isNaN(v)) return;
      STATE.setField(f.path, isPct ? v / 100 : v);
      input.dataset.edited = 'true';
      var lbl = input.parentNode.querySelector('.bc-dr-claim');
      if (lbl) lbl.textContent = STATE.labelFor(f.path);
    });
    return input;
  }

  function renderInputsTab(body) {
    var wrap = document.createElement('div');
    wrap.className = 'bc-drawer';
    var note = document.createElement('div');
    note.className = 'bc-dr-label';
    note.textContent = DATA.defaultLabel;
    wrap.appendChild(note);
    DRAWER_FIELDS.forEach(function(sec) {
      var h = document.createElement('div');
      h.className = 'bc-dr-h';
      h.textContent = sec.section;
      wrap.appendChild(h);
      sec.fields.forEach(function(f) {
        var row = document.createElement('label');
        row.className = 'bc-dr-row';
        var text = document.createElement('span');
        text.className = 'bc-dr-text';
        text.textContent = f.label;
        row.appendChild(text);
        row.appendChild(fieldInput(f));
        var claim = document.createElement('span');
        claim.className = 'bc-dr-claim';
        claim.textContent = STATE.labelFor(f.path);
        row.appendChild(claim);
        wrap.appendChild(row);
      });
    });
    var reset = document.createElement('button');
    reset.className = 'ts-btn bc-dr-reset';
    reset.type = 'button';
    reset.textContent = 'Reset to illustrative defaults';
    reset.addEventListener('click', function() {
      STATE.reset();
      body.innerHTML = '';
      renderInputsTab(body);
    });
    wrap.appendChild(reset);
    body.appendChild(wrap);
  }

  function renderFormulasTab(body) {
    var wrap = document.createElement('div');
    wrap.className = 'bc-drawer';
    DATA.formulas.forEach(function(fm) {
      var row = document.createElement('div');
      row.className = 'bc-dr-formula';
      var a = document.createElement('div');
      a.className = 'bc-dr-h';
      a.textContent = fm[0];
      var b = document.createElement('div');
      b.className = 'bc-dr-code';
      b.textContent = fm[1];
      row.appendChild(a);
      row.appendChild(b);
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }

  function renderLabelsTab(body) {
    var wrap = document.createElement('div');
    wrap.className = 'bc-drawer';
    var items = [
      ['Task preparation rate', 'The share of a bounded task prepared automatically. Retrieval, comparison and re-entry may support high rates.'],
      ['Direct effort reduction', 'Hours removed from one completed review after human review, exceptions and rework.'],
      ['Net capacity release', 'Usable capacity after adoption, exception leakage and capacity conversion. Capacity, not a headcount forecast.'],
      ['Selected preparation steps', 'May support 70 to 95 percent preparation. The effect on the full review is calculated from the actual task mix and validated in use.'],
      ['Avoided regulatory findings', 'Kept outside every scenario. Shown, if at all, as a separate risk-adjusted upside.']
    ];
    Object.keys(DATA.scenarios).forEach(function(id) {
      var sc = DATA.scenarios[id];
      items.push([sc.label + ' scenario (' + DATA.claimLabels[sc.claim] + ')', sc.description + '.']);
    });
    Object.keys(DATA.claimLabels).forEach(function(k) {
      items.push(['Label: ' + DATA.claimLabels[k], k === 'baseline' ? 'A value entered in this session.' : 'Evidence status shown next to inputs and outputs.']);
    });
    items.forEach(function(it) {
      var h = document.createElement('div');
      h.className = 'bc-dr-h';
      h.textContent = it[0];
      var p = document.createElement('div');
      p.className = 'bc-dr-text';
      p.textContent = it[1];
      wrap.appendChild(h);
      wrap.appendChild(p);
    });
    body.appendChild(wrap);
  }

  function openAssumptions() {
    if (typeof openDrawer !== 'function' || !STATE) return;
    openDrawer('Business-case assumptions', [
      { id: 'inputs', label: 'Assumptions', render: renderInputsTab },
      { id: 'formulas', label: 'Formulas', render: renderFormulasTab },
      { id: 'labels', label: 'Claims and labels', render: renderLabelsTab }
    ], 'inputs');
  }

  window.BusinessCaseScene = { openAssumptions: openAssumptions };

  // ── Scene ──
  SceneDirector.register('business-case', function(container, manifest, reduced) {
    var S = window.StoryKit;
    var W = 1040, H = 520;
    var LEFT = { x: 0, w: 424 };
    var MID = { x: 444, w: 266 };
    var RIGHT = { x: 728, w: 312 };
    var ROW_TOP = 98, ROW_STEP = 46;
    var BAR_X = 318, BAR_W = 106, BAR_MAX_H = 4;

    var cv = null;
    var n = {};
    var done = false;
    var unsubscribe = null;
    var announceTimer = null;

    function money(v) { return F.money(v, DATA.currency); }
    function bare(v) { return F.money(v, DATA.currency).replace(DATA.currency + ' ', ''); }

    function build() {
      if (cv) cv.destroy();
      if (unsubscribe) unsubscribe();
      cv = S.canvas(container, W, H, { id: 'business-case', maxScale: 1.2 });
      n = { rows: [], wf: [], outs: [] };
      done = false;
      var root = cv.el;
      var a = STATE.get().assumptions;

      // Top bar: claim label, scenario ladder, drawer and reset
      n.claim = S.el('div', 'bc-claim ts-hide', DATA.defaultLabel, { left: 0, top: 0, width: 420 });
      root.appendChild(n.claim);
      var sc = S.el('div', 'bc-scenarios ts-hide', null, { left: 444, top: 0 });
      sc.setAttribute('role', 'group');
      sc.setAttribute('aria-label', 'Scenario');
      n.scButtons = {};
      Object.keys(DATA.scenarios).forEach(function(id) {
        var btn = S.el('button', 'ts-btn bc-sc-btn', DATA.scenarios[id].label);
        btn.type = 'button';
        btn.setAttribute('aria-pressed', a.scenario === id ? 'true' : 'false');
        btn.addEventListener('click', function() { STATE.setScenario(id); });
        sc.appendChild(btn);
        n.scButtons[id] = btn;
      });
      root.appendChild(sc);
      n.scenarios = sc;
      var tools = S.el('div', 'bc-tools ts-hide', null, { left: 760, top: 0, width: 280 });
      var asm = S.el('button', 'ts-btn', 'Assumptions');
      asm.type = 'button';
      asm.setAttribute('aria-haspopup', 'dialog');
      asm.addEventListener('click', openAssumptions);
      var rst = S.el('button', 'ts-btn', 'Reset');
      rst.type = 'button';
      rst.addEventListener('click', function() { STATE.reset(); });
      tools.appendChild(asm);
      tools.appendChild(rst);
      root.appendChild(tools);
      n.tools = tools;

      // Left: current effort per review
      n.leftHead = S.el('div', 'bc-col-head ts-hide', null, { left: LEFT.x, top: 46, width: LEFT.w });
      n.leftHead.appendChild(S.el('span', 'ts-label', 'Current effort per review'));
      S.CaseBadge.create(n.leftHead, { compact: true });
      root.appendChild(n.leftHead);
      n.colHeads = S.el('div', 'bc-cols ts-hide', null, { left: LEFT.x, top: 72, width: LEFT.w });
      [['Work category', 172], ['Hours', 64], ['Prepared', 74], ['Removed, left', BAR_W]].forEach(function(c) {
        var h = S.el('span', 'ts-label bc-colh', c[0]);
        h.style.width = c[1] + 'px';
        n.colHeads.appendChild(h);
      });
      root.appendChild(n.colHeads);

      a.categories.forEach(function(cat, i) {
        var y = ROW_TOP + i * ROW_STEP;
        var row = { cat: cat };
        row.el = S.el('div', 'bc-row ts-hide' + (cat.eligible ? '' : ' bc-row-judge'), null, { left: LEFT.x, top: y, width: LEFT.w, height: 38 });
        row.el.appendChild(S.el('span', 'bc-row-label', cat.label));
        row.hours = numberInput('categories.' + cat.id + '.hours', cat.label + ': current hours per review', cat.hours, DATA.bounds.hours, false);
        row.el.appendChild(row.hours);
        if (cat.eligible) {
          row.rate = numberInput('categories.' + cat.id + '.rate', cat.label + ': preparation rate, percent', cat.rate, DATA.bounds.rate, true);
          row.el.appendChild(row.rate);
          row.el.appendChild(S.el('span', 'bc-unit', '%'));
        } else {
          var lock = S.el('span', 'bc-lock');
          lock.appendChild(S.icon('ti-lock-check'));
          lock.appendChild(S.el('span', null, 'Human'));
          row.el.appendChild(lock);
        }
        root.appendChild(row.el);
        var bar = S.el('div', 'bc-bar', null, { left: BAR_X, top: y + 12, width: BAR_W, height: 14 });
        row.prep = S.el('span', 'bc-bar-prep');
        row.rest = S.el('span', 'bc-bar-rest' + (cat.eligible ? '' : ' bc-bar-judge'));
        bar.appendChild(row.prep);
        bar.appendChild(row.rest);
        row.el.appendChild(bar);
        bar.style.left = (BAR_X - LEFT.x) + 'px';
        bar.style.top = '12px';
        n.rows.push(row);
      });
      n.totals = S.el('div', 'bc-totals ts-hide', null, { left: LEFT.x, top: ROW_TOP + 6 * ROW_STEP + 4, width: LEFT.w });
      root.appendChild(n.totals);
      n.judgeNote = S.el('div', 'ts-label ts-ink ts-c-human bc-judge-note ts-hide', 'Professional judgement stays at zero automation', { left: LEFT.x, top: ROW_TOP + 6 * ROW_STEP + 30, width: LEFT.w });
      root.appendChild(n.judgeNote);
      n.measures = S.el('div', 'bc-measures ts-hide', null, { left: LEFT.x, top: ROW_TOP + 6 * ROW_STEP + 60, width: LEFT.w });
      [['Task preparation rate', 'share of a bounded task prepared'], ['Direct effort reduction', 'hours removed from one completed review'], ['Net capacity release', 'usable capacity after realism factors']].forEach(function(m, i) {
        var r = S.el('div', 'bc-measure');
        r.appendChild(S.el('span', 'bc-measure-num', String(i + 1)));
        r.appendChild(S.el('span', 'bc-measure-name', m[0]));
        r.appendChild(S.el('span', 'bc-measure-text', m[1]));
        n.measures.appendChild(r);
      });
      root.appendChild(n.measures);

      // Middle: gross to net
      n.midHead = S.el('div', 'bc-col-head ts-hide', null, { left: MID.x, top: 46, width: MID.w });
      n.midHead.appendChild(S.el('span', 'ts-label', 'Gross to net capacity'));
      root.appendChild(n.midHead);
      var WF = [
        { key: 'gross', label: 'Gross prepared per review' },
        { key: 'adoption', label: 'Adoption', path: 'adoption' },
        { key: 'leakage', label: 'Exception leakage', path: 'exceptionLeakage' },
        { key: 'conversion', label: 'Capacity conversion', path: 'capacityConversion' },
        { key: 'net', label: 'Net capacity per review' }
      ];
      WF.forEach(function(w, i) {
        var y = 76 + i * 66;
        var box = S.el('div', 'bc-wf' + (w.key === 'net' ? ' bc-wf-net' : '') + ' ts-hide ts-left', null, { left: MID.x, top: y, width: MID.w, height: 58 });
        var head = S.el('div', 'bc-wf-head');
        head.appendChild(S.el('span', 'bc-wf-label', (w.path ? (w.key === 'leakage' ? 'x (1 - ' : 'x ') : '') + w.label + (w.key === 'leakage' ? ')' : '')));
        var entry = { key: w.key, el: box };
        if (w.path) {
          entry.input = numberInput(w.path, w.label + ', percent', a[w.path], DATA.bounds.factor, true);
          head.appendChild(entry.input);
          head.appendChild(S.el('span', 'bc-unit', '%'));
        }
        box.appendChild(head);
        var track = S.el('div', 'bc-wf-track');
        entry.fill = S.el('span', 'bc-wf-fill');
        track.appendChild(entry.fill);
        box.appendChild(track);
        entry.value = S.el('span', 'bc-wf-value');
        box.appendChild(entry.value);
        root.appendChild(box);
        n.wf.push(entry);
      });

      // Right: outputs, in decision order
      n.rightHead = S.el('div', 'bc-col-head ts-hide', null, { left: RIGHT.x, top: 46, width: RIGHT.w });
      n.rightHead.appendChild(S.el('span', 'ts-label', 'Outputs'));
      n.scenarioClaim = S.el('span', 'ts-chip ts-c-ai bc-out-claim', '');
      n.rightHead.appendChild(n.scenarioClaim);
      root.appendChild(n.rightHead);
      var OUTS = ['hours', 'capacity', 'direct', 'elapsed', 'rework', 'control', 'value', 'payback', 'cost', 'reuse'];
      var OUT_LABELS = {
        hours: 'Hours returned per review', capacity: 'Annual capacity', direct: 'Direct effort reduction',
        elapsed: 'Elapsed time per review', rework: 'Rework per review', control: 'Control outcome',
        value: 'Annual value', payback: 'Payback', cost: 'Cost per completed review', reuse: 'Reuse for the next journey'
      };
      n.out = {};
      OUTS.forEach(function(k, i) {
        // The headline output gets a taller row; the rest share the remaining height
        var y = i === 0 ? 72 : 126 + (i - 1) * 43;
        var row = S.el('div', 'bc-out' + (k === 'hours' ? ' bc-out-main' : '') + (k === 'payback' ? ' bc-out-payback' : '') + ' ts-hide ts-right', null, { left: RIGHT.x, top: y, width: RIGHT.w, height: i === 0 ? 50 : 40 });
        row.appendChild(S.el('div', 'bc-out-label', OUT_LABELS[k]));
        var val = S.el('div', 'bc-out-value');
        row.appendChild(val);
        root.appendChild(row);
        n.out[k] = val;
        n.outs.push(row);
      });

      // Polite announcement of recalculated outputs, debounced
      n.live = S.el('div', 'scene-accessible-summary');
      n.live.setAttribute('aria-live', 'polite');
      root.appendChild(n.live);

      unsubscribe = STATE.subscribe(function() { update(true); });
      update(false);
    }

    function numberInput(path, label, value, bound, isPct) {
      var input = S.el('input', 'ts-input bc-input');
      input.type = 'number';
      input.min = isPct ? Math.round(bound.min * 100) : bound.min;
      input.max = isPct ? Math.round(bound.max * 100) : bound.max;
      input.step = isPct ? Math.round(bound.step * 100) : bound.step;
      input.value = isPct ? pct(value) : value;
      input.setAttribute('aria-label', label);
      input.dataset.path = path;
      input.dataset.pct = isPct ? '1' : '0';
      input.dataset.edited = STATE.isEdited(path) ? 'true' : 'false';
      input.title = STATE.labelFor(path);
      input.addEventListener('change', function() {
        var v = parseFloat(input.value);
        if (isNaN(v)) { update(false); return; }
        STATE.setField(path, isPct ? v / 100 : v);
      });
      return input;
    }

    // Sync inputs, bars and outputs with the current state. Never animates layout.
    function update(announce) {
      var st = STATE.get();
      var r = STATE.result();
      var a = r.assumptions;
      var edited = STATE.anyEdited();

      n.claim.textContent = edited ? 'Edited values are labelled Client baseline. Others: illustrative.' : DATA.defaultLabel;
      n.claim.classList.toggle('is-edited', edited);
      Object.keys(n.scButtons).forEach(function(id) { n.scButtons[id].setAttribute('aria-pressed', a.scenario === id ? 'true' : 'false'); });
      var scd = DATA.scenarios[a.scenario];
      n.scenarioClaim.textContent = DATA.claimLabels[scd.claim];

      container.querySelectorAll('input.bc-input').forEach(function(inp) {
        var raw = STATE.readField(inp.dataset.path);
        if (document.activeElement !== inp) inp.value = inp.dataset.pct === '1' ? pct(raw) : raw;
        inp.dataset.edited = st.edited[inp.dataset.path] ? 'true' : 'false';
        inp.title = STATE.labelFor(inp.dataset.path);
      });

      var maxH = Math.max(BAR_MAX_H, Math.max.apply(null, r.savings.rows.map(function(x) { return x.hours; })));
      r.savings.rows.forEach(function(row, i) {
        var nr = n.rows[i];
        if (!nr) return;
        var scale = BAR_W / maxH;
        nr.prep.style.width = Math.round(row.grossSaved * scale) + 'px';
        nr.rest.style.width = Math.round(row.remaining * scale) + 'px';
        nr.el.classList.toggle('bc-row-off', row.id === 'rework' && a.includeRework === false);
      });
      n.totals.textContent = 'Current ' + F.hours(r.savings.currentHours) + ' per review. Gross prepared ' + F.hours(r.savings.grossSavedHours)
        + (a.includeRework === false ? '. Rework not counted in this scenario.' : '.');

      var gross = r.savings.grossSavedHours || 1;
      var adopted = r.savings.grossSavedHours * a.adoption;
      var stepVals = { gross: r.savings.grossSavedHours, adoption: adopted, leakage: r.capacity.directEffortHours, conversion: r.capacity.netSavedHoursPerReview, net: r.capacity.netSavedHoursPerReview };
      n.wf.forEach(function(w) {
        var v = stepVals[w.key];
        w.fill.style.width = Math.round(Math.min(1, v / gross) * 100) + '%';
        w.value.textContent = F.hours(v);
      });

      var o = n.out;
      o.hours.textContent = F.hours(r.capacity.netSavedHoursPerReview) + ' (' + F.percent(r.capacity.netCapacityShare) + ' of ' + F.hours(r.savings.currentHours) + ')';
      o.capacity.textContent = F.number(r.capacity.annualCapacityHours) + ' h / ' + r.capacity.fteEquivalentCapacity.toFixed(1) + ' FTE-equivalent, not headcount';
      o.direct.textContent = F.percent(r.capacity.directEffortReduction) + ' (' + F.hours(r.capacity.directEffortHours) + ' removed)';
      o.elapsed.textContent = r.elapsed.counted
        ? Math.round(r.elapsed.currentDays) + ' to ' + r.elapsed.futureDays.toFixed(1) + ' days'
        : 'Not counted in this scenario';
      o.rework.textContent = F.hours(r.rework.before) + ' to ' + F.hours(r.rework.after);
      o.control.textContent = 'Judgement 100% human, gated writes';
      o.value.textContent = 'Net ' + money(r.value.annualNetValue) + ' / gross ' + bare(r.value.annualGrossCapacityValue) + ' / run ' + bare(r.value.annualRunCost);
      o.payback.textContent = (r.payback.positive ? r.payback.months.toFixed(1) + ' months' : r.payback.label)
        + (r.roi.roi === null ? '' : ' / 3-year ROI ' + r.roi.label);
      o.payback.parentNode.classList.toggle('is-negative', r.payback.positive === false);
      o.cost.textContent = money(r.costPerReview.before) + ' to ' + money(r.costPerReview.after);
      o.reuse.textContent = r.roi.avoidedBuildCostFromReuse > 0
        ? money(r.roi.avoidedBuildCostFromReuse) + ' avoided build (stretch hypothesis)'
        : 'Not counted in this scenario';

      if (announce) {
        clearTimeout(announceTimer);
        announceTimer = setTimeout(function() {
          if (!n.live) return;
          n.live.textContent = 'Recalculated. Hours returned per review ' + F.hours(r.capacity.netSavedHoursPerReview)
            + '. Payback ' + (r.payback.positive ? r.payback.months.toFixed(1) + ' months' : r.payback.label) + '.';
        }, 700);
      }
    }

    // Animation stage: current hours first, before any preparation is shown
    function showCurrentOnly() {
      var r = STATE.result();
      var maxH = Math.max(BAR_MAX_H, Math.max.apply(null, r.savings.rows.map(function(x) { return x.hours; })));
      r.savings.rows.forEach(function(row, i) {
        n.rows[i].prep.style.width = '0px';
        n.rows[i].rest.style.width = Math.round(row.hours * BAR_W / maxH) + 'px';
      });
    }

    function complete() {
      if (done) return;
      done = true;
      S.complete(container);
    }

    var steps = [
      { delay: 150,  run: function() { S.on([n.claim, n.scenarios, n.tools, n.leftHead, n.colHeads]); showCurrentOnly(); } },
      { delay: 400,  run: function() { n.rows.forEach(function(r) { S.on(r.el); }); } },
      { delay: 1300, run: function() { update(false); S.on(n.totals); S.on(n.judgeNote); } },
      { delay: 2100, run: function() { S.on(n.midHead); S.on(n.wf[0].el); } },
      { delay: 2500, run: function() { S.on(n.wf[1].el); } },
      { delay: 2900, run: function() { S.on(n.wf[2].el); } },
      { delay: 3300, run: function() { S.on(n.wf[3].el); } },
      { delay: 3700, run: function() { S.on(n.wf[4].el); S.on(n.measures); } },
      { delay: 4200, run: function() { S.on(n.rightHead); S.on(n.outs.slice(0, 5)); } },
      { delay: 4700, run: function() { S.on(n.outs.slice(5)); } },
      { delay: 5300, run: function() { n.outs[7].classList.add('is-highlight'); } },
      { delay: 6000, run: complete }
    ];
    var tl = createTimeline(steps);

    function teardown() {
      clearTimeout(announceTimer);
      announceTimer = null;
      if (unsubscribe) unsubscribe();
      unsubscribe = null;
    }

    return {
      play: function() { build(); cv.setStatic(false); tl.play(); },
      pause: tl.pause,
      resume: tl.resume,
      seek: function(p) { build(); cv.setStatic(true); tl.seek(p); },
      reset: function() { tl.reset(); build(); },
      finish: function() { build(); cv.setStatic(true); tl.finish(); },
      resize: function() { if (cv) cv.fit(); },
      renderStatic: function() { build(); cv.setStatic(true); tl.finish(); },
      renderError: function() { tl.reset(); teardown(); if (cv) cv.destroy(); S.restoreFallback(container); },
      getAccessibleSummary: function() {
        var r = STATE.result();
        var sc = DATA.scenarios[r.assumptions.scenario];
        return 'Interactive business case for one completed periodic review. ' + DATA.defaultLabel + ' '
          + sc.label + ' scenario. Current effort ' + F.hours(r.savings.currentHours) + ' per review, of which professional judgement '
          + F.hours(r.savings.judgementHours) + ' stays at zero automation. Gross prepared ' + F.hours(r.savings.grossSavedHours)
          + ', net capacity returned ' + F.hours(r.capacity.netSavedHoursPerReview) + ' per review after adoption, exception leakage and capacity conversion. '
          + 'Payback ' + (r.payback.positive ? r.payback.months.toFixed(1) + ' months' : r.payback.label) + '. '
          + 'Every input can be edited; edited values are labelled client baseline. Open Assumptions for volumes, costs and formulas.';
      },
      destroy: function() { tl.destroy(); teardown(); if (cv) cv.destroy(); cv = null; container.innerHTML = ''; }
    };
  });
}());
