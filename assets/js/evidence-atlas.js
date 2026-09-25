// evidence-atlas.js -- Visual Evidence Atlas for NFR AI Pitch
// V26: Risk map is a deterministic radial layout (angle-proportional, no force simulation).
// Theatre view uses a 2-column list layout, not a fixed 3x2 card grid.
// Exposes window.EvidenceAtlas with init / destroy / switchView
// Requires: D3 (globally available), RISK_CATEGORIES, RISK_CAPABILITIES,
//           PORTFOLIO_CLUSTERS, SOLUTIONS (all loaded before this file)
// Constraints: no em-dash, no cursor:pointer, no CDN fetches, British English

(function (global) {
  'use strict';

  // ── PRIVATE STATE ──────────────────────────────────────────────
  var _container = null;
  var _currentView = 'map';
  var _drawer = null;
  var _paletteOverlay = null;
  var _paletteInput = null;
  var _playingCard = null;
  var _keyListener = null;

  // ── DESIGN TOKENS ─────────────────────────────────────────────
  var C = {
    canvas:  '#08081A',
    surface: '#0F0F22',
    surf2:   '#181830',
    text1:   '#E8E9F0',
    text2:   '#A4A9B7',
    text3:   '#585D72',
    accent:  '#B44CFF',
    cyan:    '#55C7E8',
    amber:   '#F3B34C',
    green:   '#58C994',
    pink:    '#F0758A',
    border:  'rgba(255,255,255,0.08)'
  };

  // ── STATIC DATA ────────────────────────────────────────────────

  var ARCH_LAYERS = [
    { id: 'source',      name: 'Source systems',              desc: 'ERP, GRC, trading, custody, regulatory feeds',          color: '#0F8A62', components: ['ERP connectors', 'Market data feeds', 'Regulatory feeds', 'Core banking', 'Document stores'] },
    { id: 'integration', name: 'Integration',                  desc: 'API gateway, event bus, data pipelines',                color: '#0E7490', components: ['API gateway', 'Event bus', 'ETL pipelines', 'Change data capture', 'Orchestration layer'] },
    { id: 'knowledge',   name: 'Object and knowledge layer',   desc: 'Knowledge graph, entity store, ontology',               color: '#55C7E8', components: ['Knowledge graph', 'Entity resolution', 'Ontology manager', 'Vector store', 'Semantic index'] },
    { id: 'models',      name: 'Models and agents',            desc: 'Foundation models, ML models, agent runtimes',          color: '#B44CFF', components: ['Foundation models', 'Specialist ML', 'Agent runtimes', 'Prompt registry', 'Model registry'] },
    { id: 'workflow',    name: 'Workflow and tools',           desc: 'Process orchestration, human-in-the-loop gates',        color: '#F3B34C', components: ['Process orchestration', 'Task queues', 'Tool registry', 'Review gates', 'Notification layer'] },
    { id: 'human',       name: 'Human decisions',              desc: 'Review interfaces, approval workflows, audit',          color: '#F0758A', components: ['Review UI', 'Approval workflows', 'Exception handling', 'Audit console', 'Feedback capture'] },
    { id: 'control',     name: 'Control and evidence',         desc: 'Control inventory, evidence ledger, attestation',       color: '#58C994', components: ['Control inventory', 'Evidence ledger', 'Attestation engine', 'Policy engine', 'Reporting layer'] },
    { id: 'monitoring',  name: 'Monitoring and economics',     desc: 'Cost tracking, drift detection, performance metrics',   color: '#E8E9F0', components: ['Cost tracker', 'Drift detection', 'Performance metrics', 'SLA monitoring', 'Incident logging'] }
  ];

  var THEATRE_DEMOS = [
    { id: 'reg-coverage', name: 'Regulation Coverage',       sourceBacked: true,
      desc: 'Regulation to obligation to control evidence',
      steps: [{ l: 'Regulation', c: '#55C7E8' }, { l: 'Obligation', c: '#B44CFF' }, { l: 'Match', c: '#F3B34C' }, { l: 'Gate (SME)', c: '#F0758A' }, { l: 'Evidence', c: '#58C994' }] },
    { id: 'tprm-agent',   name: 'TPRM Agent',               sourceBacked: true,
      desc: 'Third-party risk monitoring and escalation',
      steps: [{ l: 'Monitor', c: '#55C7E8' }, { l: 'Score', c: '#B44CFF' }, { l: 'Flag', c: '#F3B34C' }, { l: 'Gate', c: '#F0758A' }, { l: 'Record', c: '#58C994' }] },
    { id: 'rcsa-agent',   name: 'RCSA Agent',               sourceBacked: true,
      desc: 'AI-assisted RCSA workflow with human review gates',
      steps: [{ l: 'Draft', c: '#55C7E8' }, { l: 'Review', c: '#B44CFF' }, { l: 'Gate', c: '#F3B34C' }, { l: 'Sign-off', c: '#58C994' }] },
    { id: 'vaas',         name: 'Validation as a Service',  sourceBacked: false,
      desc: 'Model validation support and documentation',
      steps: [{ l: 'Submit', c: '#55C7E8' }, { l: 'Validate', c: '#B44CFF' }, { l: 'Report', c: '#58C994' }] },
    { id: 'risk-report',  name: 'Agentic Risk Reporting',   sourceBacked: true,
      desc: 'Automated regulatory report drafting and validation',
      steps: [{ l: 'Collect', c: '#55C7E8' }, { l: 'Draft', c: '#B44CFF' }, { l: 'Review', c: '#F3B34C' }, { l: 'Publish', c: '#58C994' }] },
    { id: 'credit-dec',   name: 'Credit Decision Rationale',sourceBacked: false,
      desc: 'Credit assessment copilot and memo drafting',
      steps: [{ l: 'Input', c: '#55C7E8' }, { l: 'Score', c: '#B44CFF' }, { l: 'Explain', c: '#58C994' }] }
  ];

  var METHOD_STEPS = [
    { label: 'Scope',    desc: 'Define the risk domain and capability boundary. Agree the proof criteria and evidence requirements before any AI work begins.' },
    { label: 'Baseline', desc: 'Measure current-state performance. Establish the counterfactual against which the AI intervention will be assessed.' },
    { label: 'Prove',    desc: 'Run the intervention in a bounded scope with human oversight at every gate. Capture evidence at each decision point.' },
    { label: 'Scale',    desc: 'Expand only if gate criteria are met. Industrialise controls. Embed economics tracking and ongoing drift monitoring.' }
  ];

  var MATURITY_LEVELS = [
    { level: 1, label: 'Assisted',          desc: 'AI surfaces information; human decides and acts.' },
    { level: 2, label: 'Augmented',         desc: 'AI drafts or recommends; human reviews and approves.' },
    { level: 3, label: 'Automated',         desc: 'AI executes routine tasks; human monitors and handles exceptions.' },
    { level: 4, label: 'Adaptive',          desc: 'AI learns from outcomes and adjusts within approved parameters.' },
    { level: 5, label: 'Bounded autonomy',  desc: 'AI acts end-to-end within a defined, auditable scope with human oversight at gates.' }
  ];

  // ── DOM HELPERS ────────────────────────────────────────────────
  function mk(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') { e.className = attrs[k]; }
        else if (k === 'textContent') { e.textContent = attrs[k]; }
        else if (k === 'innerHTML') { e.innerHTML = attrs[k]; }
        else if (k === 'style' && typeof attrs[k] === 'object') {
          Object.keys(attrs[k]).forEach(function (p) { e.style[p] = attrs[k][p]; });
        } else { e.setAttribute(k, attrs[k]); }
      });
    }
    if (children) children.forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  function svgMk(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // Build an SVG arc path (all angles in radians, CCW from east)
  function arcPath(iR, oR, a0, a1) {
    var cos0 = Math.cos(a0), sin0 = Math.sin(a0);
    var cos1 = Math.cos(a1), sin1 = Math.sin(a1);
    var lg = (a1 - a0 > Math.PI) ? 1 : 0;
    return ['M', iR * cos0, iR * sin0,
            'A', iR, iR, 0, lg, 1, iR * cos1, iR * sin1,
            'L', oR * cos1, oR * sin1,
            'A', oR, oR, 0, lg, 0, oR * cos0, oR * sin0, 'Z'].join(' ');
  }

  function fadeIn(el, duration, delay, fromOpacity) {
    var from = fromOpacity === undefined ? 0 : fromOpacity;
    el.style.opacity = from;
    setTimeout(function () {
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var ease = 1 - Math.pow(1 - t, 3);
        el.style.opacity = (from + (1 - from) * ease).toFixed(3);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay || 0);
  }

  // ── INLINE STYLES ──────────────────────────────────────────────
  var STYLE_ID = 'ea-injected-styles';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      /* shell */
      '.ea-shell{display:flex;flex-direction:column;width:100%;height:100%;background:' + C.canvas + ';color:' + C.text1 + ';position:relative;box-sizing:border-box;overflow:hidden}',
      '.ea-topbar{display:flex;align-items:center;gap:0;padding:0 16px;height:44px;background:' + C.surface + ';border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;overflow-x:auto}',
      '.ea-tab{padding:0 14px;height:44px;display:inline-flex;align-items:center;font-size:13px;font-family:"Space Grotesk",sans-serif;color:' + C.text2 + ';background:none;border:none;border-bottom:2px solid transparent;white-space:nowrap}',
      '.ea-tab.active{color:' + C.text1 + ';border-bottom-color:' + C.accent + '}',
      '.ea-tab:hover:not(.active){color:' + C.text1 + '}',
      '.ea-search-btn{margin-left:auto;flex-shrink:0;background:none;border:1px solid rgba(255,255,255,0.12);border-radius:5px;color:' + C.text2 + ';font-family:"JetBrains Mono",monospace;font-size:11px;padding:4px 10px;display:inline-flex;align-items:center;gap:6px}',
      '.ea-search-btn:hover{color:' + C.text1 + ';border-color:rgba(255,255,255,0.25)}',
      '.ea-canvas{flex:1;position:relative;overflow:hidden}',
      /* tooltip */
      '.ea-tip{position:absolute;background:' + C.surface + ';border:1px solid rgba(255,255,255,0.14);border-radius:6px;padding:8px 12px;font-size:13px;font-family:"Space Grotesk",sans-serif;color:' + C.text1 + ';pointer-events:none;opacity:0;transition:opacity 0.12s;max-width:200px;z-index:40;line-height:1.5}',
      /* drawer */
      '.ea-drawer{position:absolute;right:0;top:0;width:340px;height:100%;background:' + C.surface + ';border-left:1px solid rgba(255,255,255,0.07);z-index:50;overflow-y:auto;box-sizing:border-box;padding:20px 18px 20px;transform:translateX(100%);transition:transform 0.25s ease}',
      '.ea-drawer-close{position:absolute;top:14px;right:14px;background:none;border:none;color:' + C.text2 + ';font-size:18px;line-height:1;padding:0 4px}',
      '.ea-drawer-close:hover{color:' + C.text1 + '}',
      '.ea-dr-bc{font-family:"JetBrains Mono",monospace;font-size:11px;color:' + C.text3 + ';margin-bottom:8px}',
      '.ea-dr-title{font-family:"Space Grotesk",sans-serif;font-size:20px;font-weight:700;color:' + C.text1 + ';margin-bottom:16px;line-height:1.2;padding-right:28px}',
      '.ea-dr-label{font-family:"JetBrains Mono",monospace;font-size:9px;color:' + C.text3 + ';letter-spacing:0.08em;margin-bottom:4px;margin-top:12px}',
      '.ea-dr-text{font-size:14px;color:' + C.text1 + ';line-height:1.55;margin-bottom:4px}',
      '.ea-dr-sol{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;color:' + C.text1 + '}',
      '.ea-dr-badge{font-size:9px;font-family:"JetBrains Mono",monospace;padding:2px 5px;border-radius:2px;border-width:1px;border-style:solid;white-space:nowrap}',
      '.ea-dr-evrow{display:flex;align-items:center;gap:6px;font-size:13px;color:' + C.text2 + ';padding:2px 0}',
      /* palette */
      '.ea-pal-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(8,8,26,0.82);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding-top:56px}',
      '.ea-pal-box{width:480px;max-width:calc(100% - 32px);background:' + C.surface + ';border:1px solid rgba(255,255,255,0.14);border-radius:10px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6)}',
      '.ea-pal-input{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.08);color:' + C.text1 + ';font-family:"Space Grotesk",sans-serif;font-size:15px;padding:14px 16px;outline:none;box-sizing:border-box}',
      '.ea-pal-results{max-height:340px;overflow-y:auto}',
      '.ea-pal-group-label{padding:8px 16px 3px;font-size:9px;font-family:"JetBrains Mono",monospace;color:' + C.text3 + ';letter-spacing:0.08em}',
      '.ea-pal-row{padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:8px;font-size:13px;color:' + C.text1 + '}',
      '.ea-pal-row:hover{background:' + C.surf2 + '}',
      '.ea-pal-sub{font-size:11px;color:' + C.text3 + ';flex-shrink:0}',
      /* constellation */
      '.ea-const-wrap{width:100%;height:100%;overflow-y:auto;padding:16px;box-sizing:border-box}',
      '.ea-const-cluster{margin-bottom:18px}',
      '.ea-const-cluster-hd{font-family:"Space Grotesk",sans-serif;font-size:13px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px}',
      '.ea-const-grid{display:flex;flex-wrap:wrap;gap:8px}',
      '.ea-sol-card{width:188px;padding:8px 10px;background:' + C.surface + ';border-width:1px;border-style:solid;border-color:rgba(255,255,255,0.09);border-radius:6px;box-sizing:border-box;flex-shrink:0}',
      '.ea-sol-card:hover{border-color:rgba(255,255,255,0.22)}',
      '.ea-sol-name{font-size:12px;font-family:"Space Grotesk",sans-serif;color:' + C.text1 + ';margin-bottom:3px;line-height:1.35}',
      '.ea-sol-src{font-size:9px;font-family:"JetBrains Mono",monospace;color:' + C.text3 + ';margin-bottom:5px}',
      '.ea-sol-badges{display:flex;flex-wrap:wrap;gap:3px}',
      /* theatre */
      '.ea-theatre-wrap{width:100%;height:100%;display:flex;flex-direction:column;gap:6px;padding:10px;box-sizing:border-box;overflow-y:auto}',
      '.ea-theatre-row{display:flex;flex-direction:row;gap:6px;flex-shrink:0}',
      '.ea-theatre-card{flex:1;background:' + C.surface + ';border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:12px;display:flex;flex-direction:column;overflow:hidden;min-width:0}',
      '.ea-theatre-badge{font-size:8px;font-family:"JetBrains Mono",monospace;padding:1px 5px;border-radius:2px;border-width:1px;border-style:solid;display:inline-block;margin-bottom:8px}',
      '.ea-theatre-title{font-family:"Space Grotesk",sans-serif;font-size:16px;font-weight:700;color:' + C.text1 + ';margin-bottom:5px}',
      '.ea-theatre-desc{font-size:13px;color:' + C.text2 + ';line-height:1.4;flex:1}',
      '.ea-theatre-anim{margin-top:10px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;border-radius:5px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05);flex-shrink:0;padding:6px 8px}',
      '.ea-theatre-step{display:flex;flex-direction:column;align-items:center;gap:3px;transition:opacity 0.3s}',
      '.ea-theatre-step-lbl{font-size:9px;font-family:"JetBrains Mono",monospace}',
      '.ea-play-btn{margin-top:8px;background:none;border:1px solid rgba(255,255,255,0.13);border-radius:5px;color:' + C.text2 + ';font-family:"Space Grotesk",sans-serif;font-size:12px;padding:5px 0;width:100%;flex-shrink:0}',
      '.ea-play-btn:hover{border-color:rgba(255,255,255,0.28);color:' + C.text1 + '}',
      /* architecture */
      '.ea-arch-wrap{width:100%;height:100%;overflow-y:auto;padding:14px 18px;box-sizing:border-box}',
      '.ea-arch-hd{font-family:"Space Grotesk",sans-serif;font-size:16px;font-weight:700;color:' + C.text1 + ';margin-bottom:14px}',
      '.ea-arch-layer{height:44px;margin-bottom:5px;border-radius:6px;border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;padding:0 14px;gap:14px;transition:height 0.3s ease;overflow:hidden;box-sizing:border-box}',
      '.ea-arch-layer:hover{border-color:rgba(255,255,255,0.16)}',
      '.ea-arch-name{font-family:"JetBrains Mono",monospace;font-size:13px;font-weight:600;white-space:nowrap;min-width:210px}',
      '.ea-arch-desc{font-size:12px;color:' + C.text2 + ';flex:1;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ea-arch-comps{display:none;padding:8px 0 2px;flex-wrap:wrap;gap:4px;width:100%;flex-shrink:0}',
      '.ea-arch-chip{display:inline-block;padding:2px 8px;border-radius:3px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:11px;font-family:"Space Grotesk",sans-serif;color:' + C.text2 + ';margin-right:3px;margin-bottom:3px}',
      /* method */
      '.ea-method-wrap{width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;padding:14px;box-sizing:border-box;overflow-y:auto}',
      '.ea-method-col-hd{font-family:"Space Grotesk",sans-serif;font-size:16px;font-weight:700;color:' + C.text1 + ';margin-bottom:12px}',
      '.ea-method-step{padding:11px 13px;margin-bottom:8px;border-radius:6px;background:' + C.surface + ';border:1px solid rgba(255,255,255,0.07);border-left-width:3px;border-left-style:solid}',
      '.ea-method-num{font-family:"JetBrains Mono",monospace;font-size:9px;margin-bottom:3px}',
      '.ea-method-desc{font-size:13px;color:' + C.text2 + ';line-height:1.5}',
      '.ea-mat-row{padding:7px 13px;margin-bottom:5px;border-radius:6px;background:' + C.surface + ';border:1px solid rgba(255,255,255,0.07);border-left-width:3px;border-left-style:solid}',
      '.ea-mat-label{display:flex;align-items:center;gap:6px;margin-bottom:2px}',
      '.ea-mat-lvl{font-family:"JetBrains Mono",monospace;font-size:9px}',
      '.ea-mat-name{font-family:"Space Grotesk",sans-serif;font-size:13px;font-weight:600;color:' + C.text1 + '}',
      '.ea-mat-desc{font-size:11px;color:' + C.text2 + ';line-height:1.4}',
      '.ea-note{font-size:11px;color:' + C.text3 + ';margin-top:10px;line-height:1.5}',
      /* map legend */
      '.ea-legend{position:absolute;bottom:10px;left:12px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}',
      '.ea-legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:' + C.text2 + ';font-family:"Space Grotesk",sans-serif}',
      '.ea-legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}',
      '@keyframes ea-pulse{0%,100%{r:3;opacity:0.9}50%{r:5;opacity:0.45}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ── DRAWER ─────────────────────────────────────────────────────
  function openDrawer(title, breadcrumb, bodyHtml) {
    closeDrawer();
    _drawer = mk('div', { className: 'ea-drawer' });
    _container.appendChild(_drawer);

    var closeBtn = mk('button', { className: 'ea-drawer-close', innerHTML: '&#215;' });
    closeBtn.addEventListener('click', closeDrawer);
    _drawer.appendChild(closeBtn);

    _drawer.appendChild(mk('div', { className: 'ea-dr-bc', textContent: breadcrumb }));
    _drawer.appendChild(mk('div', { className: 'ea-dr-title', textContent: title }));
    var body = mk('div');
    body.innerHTML = bodyHtml;
    _drawer.appendChild(body);

    requestAnimationFrame(function () { _drawer.style.transform = 'translateX(0)'; });
  }

  function closeDrawer() {
    if (!_drawer) return;
    _drawer.style.transform = 'translateX(100%)';
    var d = _drawer;
    _drawer = null;
    setTimeout(function () { if (d.parentNode) d.remove(); }, 270);
  }

  // ── CAPABILITY DRAWER ──────────────────────────────────────────
  function openCapabilityDrawer(capId) {
    var CAPS = (typeof RISK_CAPABILITIES !== 'undefined') ? RISK_CAPABILITIES : [];
    var CATS = (typeof RISK_CATEGORIES !== 'undefined') ? RISK_CATEGORIES : [];
    var SOLS = (typeof SOLUTIONS !== 'undefined') ? SOLUTIONS : [];
    var cap = CAPS.find(function (c) { return c.id === capId; });
    if (!cap) return;
    var cat = CATS.find(function (c) { return c.id === cap.cat; });
    var sols = SOLS.filter(function (s) { return s.capIds && s.capIds.indexOf(capId) > -1; });

    var breadcrumb = (cat ? cat.name : '') + ' > ' + cap.name;

    var shareLabel = function (st) {
      if (!st) return 'unknown';
      return st.replace(/-/g, ' ');
    };
    var shareColor = function (st) {
      if (st === 'shareable') return C.green;
      if (st === 'nda-required') return C.amber;
      if (st === 'team') return C.cyan;
      return C.text3;
    };

    var solRows = sols.length
      ? sols.map(function (s) {
          var sc = shareColor(s.sharingStatus);
          return '<div class="ea-dr-sol">'
            + '<span style="flex:1;font-size:13px">' + s.displayName + '</span>'
            + '<span class="ea-dr-badge" style="color:' + sc + ';border-color:' + sc + '">' + shareLabel(s.sharingStatus).toUpperCase() + '</span>'
            + '</div>';
        }).join('')
      : '<div style="color:' + C.text3 + ';font-size:13px">No linked solutions mapped.</div>';

    var html = '<div class="ea-dr-label">OUTCOME</div>'
      + '<div class="ea-dr-text">' + (cap.outcome || '--') + '</div>'
      + '<div class="ea-dr-label">LINKED SOLUTIONS</div>'
      + solRows;

    openDrawer(cap.name, breadcrumb, html);
  }

  // ── SOLUTION DRAWER ────────────────────────────────────────────
  function openSolDrawer(solId) {
    var SOLS = (typeof SOLUTIONS !== 'undefined') ? SOLUTIONS : [];
    var CLUSTERS = (typeof PORTFOLIO_CLUSTERS !== 'undefined') ? PORTFOLIO_CLUSTERS : [];
    var s = SOLS.find(function (x) { return x.id === solId; });
    if (!s) return;
    var cluster = CLUSTERS.find(function (c) { return c.id === s.portfolioClusterId; });
    var ev = s.evidenceFlags || {};

    function evDot(val) {
      var col = val === true ? C.green : val === false ? C.pink : C.text3;
      return '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + col + ';flex-shrink:0"></span>';
    }
    function evLabel(val) { return val === true ? 'confirmed' : val === false ? 'not found' : 'not yet inspected'; }
    function shareColor(st) {
      if (st === 'shareable') return C.green;
      if (st === 'nda-required') return C.amber;
      if (st === 'team') return C.cyan;
      return C.text3;
    }

    var sc = shareColor(s.sharingStatus);
    var html = '<div class="ea-dr-label">SOURCE</div>'
      + '<div class="ea-dr-text">Source ' + s.sourceNumber + ': ' + s.sourceName + '</div>'
      + (cluster ? '<div class="ea-dr-label">PORTFOLIO CLUSTER</div><div class="ea-dr-text" style="color:' + (cluster.color || C.text1) + '">' + cluster.name + '</div>' : '')
      + '<div class="ea-dr-label">EVIDENCE FLAGS</div>'
      + ['concept', 'prototype', 'asset', 'demo'].map(function (k) {
          return '<div class="ea-dr-evrow">' + evDot(ev[k])
            + '<span>' + k.charAt(0).toUpperCase() + k.slice(1) + ': ' + evLabel(ev[k]) + '</span></div>';
        }).join('')
      + '<div class="ea-dr-label">SHARING STATUS</div>'
      + '<div class="ea-dr-text"><span class="ea-dr-badge" style="color:' + sc + ';border-color:' + sc + '">'
      + (s.sharingStatus || 'unknown').replace(/-/g, ' ').toUpperCase() + '</span></div>'
      + (s.legalReview !== null && s.legalReview !== undefined
          ? '<div class="ea-dr-label">LEGAL REVIEW</div><div class="ea-dr-text">' + (s.legalReview ? 'Complete' : 'In progress or not started') + '</div>'
          : '<div class="ea-dr-label">LEGAL REVIEW</div><div class="ea-dr-text" style="color:' + C.text3 + '">Not yet inspected</div>');

    openDrawer(s.displayName, s.sourceName, html);
  }

  // ── COMMAND PALETTE ────────────────────────────────────────────
  function openPalette() {
    if (_paletteOverlay) return;
    _paletteOverlay = mk('div', { className: 'ea-pal-overlay' });
    var box = mk('div', { className: 'ea-pal-box' });
    _paletteInput = mk('input', { type: 'text', className: 'ea-pal-input', placeholder: 'Search capabilities, solutions, architecture...' });
    var results = mk('div', { className: 'ea-pal-results' });

    _paletteInput.addEventListener('input', function () { renderPaletteResults(_paletteInput.value.trim(), results); });
    box.appendChild(_paletteInput);
    box.appendChild(results);
    _paletteOverlay.appendChild(box);
    _container.appendChild(_paletteOverlay);
    _paletteOverlay.addEventListener('click', function (e) { if (e.target === _paletteOverlay) closePalette(); });
    setTimeout(function () { _paletteInput.focus(); }, 40);
    renderPaletteResults('', results);
  }

  function closePalette() {
    if (_paletteOverlay) { _paletteOverlay.remove(); _paletteOverlay = null; _paletteInput = null; }
  }

  function renderPaletteResults(q, results) {
    results.innerHTML = '';
    var CAPS = (typeof RISK_CAPABILITIES !== 'undefined') ? RISK_CAPABILITIES : [];
    var CATS = (typeof RISK_CATEGORIES !== 'undefined') ? RISK_CATEGORIES : [];
    var SOLS = (typeof SOLUTIONS !== 'undefined') ? SOLUTIONS : [];

    if (!q) {
      results.innerHTML = '<div style="padding:13px 16px;font-size:12px;color:' + C.text3 + ';font-family:\'Space Grotesk\',sans-serif">Type to search capabilities, solutions, or architecture</div>';
      return;
    }
    var ql = q.toLowerCase();
    var caps = CAPS.filter(function (c) { return c.name.toLowerCase().indexOf(ql) > -1; }).slice(0, 5);
    var sols = SOLS.filter(function (s) { return s.displayName.toLowerCase().indexOf(ql) > -1 || (s.sourceName && s.sourceName.toLowerCase().indexOf(ql) > -1); }).slice(0, 5);
    var archs = ARCH_LAYERS.filter(function (l) { return l.name.toLowerCase().indexOf(ql) > -1; }).slice(0, 3);

    if (!caps.length && !sols.length && !archs.length) {
      results.innerHTML = '<div style="padding:13px 16px;font-size:12px;color:' + C.text3 + '">No matches found</div>';
      return;
    }

    function section(label, items, onClickFn) {
      if (!items.length) return;
      results.appendChild(mk('div', { className: 'ea-pal-group-label', textContent: label }));
      items.forEach(function (item) {
        var row = mk('div', { className: 'ea-pal-row' });
        row.innerHTML = '<span style="flex:1">' + item.label + '</span><span class="ea-pal-sub">' + item.sub + '</span>';
        row.addEventListener('click', function () { onClickFn(item); });
        results.appendChild(row);
      });
    }

    section('CAPABILITIES', caps.map(function (c) {
      var cat = CATS.find(function (x) { return x.id === c.cat; });
      return { label: c.name, sub: cat ? cat.name : '', id: c.id };
    }), function (item) {
      closePalette();
      if (_currentView !== 'map') switchView('map');
      setTimeout(function () { openCapabilityDrawer(item.id); }, _currentView !== 'map' ? 400 : 50);
    });

    section('SOLUTIONS', sols.map(function (s) {
      return { label: s.displayName, sub: 'Source ' + s.sourceNumber, id: s.id };
    }), function (item) {
      closePalette();
      if (_currentView !== 'constellation') switchView('constellation');
      setTimeout(function () { openSolDrawer(item.id); }, _currentView !== 'constellation' ? 400 : 50);
    });

    section('ARCHITECTURE', archs.map(function (l) {
      return { label: l.name, sub: l.desc.slice(0, 42) + (l.desc.length > 42 ? '..' : ''), id: l.id };
    }), function () {
      closePalette();
      switchView('architecture');
    });
  }

  // ── VIEW 1: RISK MAP ───────────────────────────────────────────
  function buildRiskMap(canvas) {
    var CATS = (typeof RISK_CATEGORIES !== 'undefined') ? RISK_CATEGORIES : [];
    var CAPS = (typeof RISK_CAPABILITIES !== 'undefined') ? RISK_CAPABILITIES : [];
    var SOLS = (typeof SOLUTIONS !== 'undefined') ? SOLUTIONS : [];
    var CLUSTERS = (typeof PORTFOLIO_CLUSTERS !== 'undefined') ? PORTFOLIO_CLUSTERS : [];
    var totalCaps = CATS.reduce(function (acc, cat) { return acc + cat.caps.length; }, 0) || 1;

    // SVG
    var svg = svgMk('svg', {
      viewBox: '-300 -300 600 600',
      width: '100%', height: '100%',
      role: 'img', 'aria-label': 'Evidence Atlas -- risk domain radial map'
    });
    var defs = svgMk('defs', {});
    svg.appendChild(defs);

    // Pulse keyframes injected via defs style
    var kfStyle = svgMk('style', {});
    kfStyle.textContent = '@keyframes ea-svgpulse{0%,100%{r:3.5;opacity:0.9}50%{r:5.5;opacity:0.4}}';
    defs.appendChild(kfStyle);

    // Tooltip
    var tip = mk('div', { className: 'ea-tip' });
    canvas.appendChild(tip);
    function showTip(e, html) {
      tip.innerHTML = html;
      tip.style.opacity = '1';
      moveTip(e);
    }
    function moveTip(e) {
      var r = canvas.getBoundingClientRect();
      tip.style.left = (e.clientX - r.left + 14) + 'px';
      tip.style.top  = (e.clientY - r.top  - 16) + 'px';
    }
    function hideTip() { tip.style.opacity = '0'; }

    // Compute category angle spans (proportional to cap count)
    var catMeta = [];
    var runAngle = -Math.PI / 2; // start at top (12 o'clock)
    CATS.forEach(function (cat) {
      var capObjs = CAPS.filter(function (c) { return c.cat === cat.id; });
      var span = (cat.caps.length / totalCaps) * 2 * Math.PI;
      catMeta.push({ cat: cat, capObjs: capObjs, start: runAngle, end: runAngle + span, span: span });
      runAngle += span;
    });

    // ── CENTRE ──
    var cg = svgMk('g', { class: 'ea-ctr' });
    cg.style.opacity = '0';
    cg.appendChild(svgMk('circle', { cx: '0', cy: '0', r: '60', fill: C.surface, stroke: 'rgba(255,255,255,0.07)', 'stroke-width': '1' }));
    var ct1 = svgMk('text', { x: '0', y: '-5', 'text-anchor': 'middle', 'font-size': '14', 'font-family': '"Space Grotesk",sans-serif', fill: C.text1, 'font-weight': '600' });
    ct1.textContent = 'Risk function';
    cg.appendChild(ct1);
    var ct2 = svgMk('text', { x: '0', y: '11', 'text-anchor': 'middle', 'font-size': '10', 'font-family': '"JetBrains Mono",monospace', fill: C.text3 });
    ct2.textContent = totalCaps + ' capabilities';
    cg.appendChild(ct2);
    svg.appendChild(cg);
    fadeIn(cg, 400, 0);

    // ── DOMAIN RING ──
    var domainG = svgMk('g', { class: 'ea-domains' });
    svg.appendChild(domainG);

    catMeta.forEach(function (cm, ci) {
      var GAP = 0.022;
      var a0 = cm.start + GAP;
      var a1 = cm.end - GAP;
      var g = svgMk('g', { class: 'ea-domain-' + cm.cat.id });

      var path = svgMk('path', {
        d: arcPath(80, 160, a0, a1),
        fill: cm.cat.color, 'fill-opacity': '0.17',
        stroke: cm.cat.color, 'stroke-width': '1', 'stroke-opacity': '0.5'
      });
      path.style.opacity = '0';
      g.appendChild(path);

      // Domain label
      var midA = (cm.start + cm.end) / 2;
      var labelR = 120;
      var lx = labelR * Math.cos(midA), ly = labelR * Math.sin(midA);
      var words = cm.cat.name.split(' '), half = Math.ceil(words.length / 2);
      var lt = svgMk('text', {
        x: lx.toFixed(1), y: (half > 1 ? ly - 6 : ly + 5).toFixed(1),
        'text-anchor': 'middle', 'font-size': '10', 'font-family': '"Space Grotesk",sans-serif',
        fill: 'white', 'font-weight': '600'
      });
      lt.style.opacity = '0';
      var ln1 = svgMk('tspan', { x: lx.toFixed(1), dy: '0' }); ln1.textContent = words.slice(0, half).join(' '); lt.appendChild(ln1);
      if (half < words.length) { var ln2 = svgMk('tspan', { x: lx.toFixed(1), dy: '12' }); ln2.textContent = words.slice(half).join(' '); lt.appendChild(ln2); }
      g.appendChild(lt);

      g.addEventListener('mouseenter', function (e) {
        path.setAttribute('d', arcPath(80, 175, a0, a1));
        path.setAttribute('fill-opacity', '0.28');
        showTip(e, '<strong style="color:' + cm.cat.color + '">' + cm.cat.name + '</strong><br>' + cm.capObjs.length + ' capabilit' + (cm.capObjs.length === 1 ? 'y' : 'ies'));
      });
      g.addEventListener('mousemove', moveTip);
      g.addEventListener('mouseleave', function () {
        path.setAttribute('d', arcPath(80, 160, a0, a1));
        path.setAttribute('fill-opacity', '0.17');
        hideTip();
      });
      domainG.appendChild(g);

      var delay = 400 + ci * 130;
      setTimeout(function () { fadeIn(path, 500, 0); fadeIn(lt, 500, 0); }, delay);
    });

    // ── CAPABILITY RING ──
    var capG = svgMk('g', { class: 'ea-caps' });
    svg.appendChild(capG);
    var capIdx = 0;

    catMeta.forEach(function (cm) {
      var nCaps = cm.capObjs.length || 1;
      cm.capObjs.forEach(function (cap, ci) {
        var GAP2 = 0.012;
        var a0 = cm.start + (cm.span / nCaps) * ci + GAP2;
        var a1 = cm.start + (cm.span / nCaps) * (ci + 1) - GAP2;
        var hasOpps = cap.opps && cap.opps.length > 0;

        var g = svgMk('g', { class: 'ea-cap-' + cap.id });
        var path = svgMk('path', {
          d: arcPath(170, 230, a0, a1),
          fill: cm.cat.color, 'fill-opacity': hasOpps ? '0.27' : '0.14',
          stroke: cm.cat.color, 'stroke-width': '0.5', 'stroke-opacity': '0.3'
        });
        path.style.opacity = '0';
        g.appendChild(path);

        // Hover label
        var midA2 = (a0 + a1) / 2;
        var lR2 = 200;
        var capLbl = svgMk('text', {
          x: (lR2 * Math.cos(midA2)).toFixed(1),
          y: (lR2 * Math.sin(midA2)).toFixed(1),
          'text-anchor': 'middle', 'font-size': '8',
          'font-family': '"Space Grotesk",sans-serif', fill: 'white'
        });
        capLbl.style.opacity = '0';
        capLbl.style.pointerEvents = 'none';
        capLbl.textContent = cap.name.length > 24 ? cap.name.slice(0, 23) + '..' : cap.name;
        g.appendChild(capLbl);

        g.addEventListener('mouseenter', function (e) {
          path.setAttribute('fill-opacity', hasOpps ? '0.44' : '0.28');
          capLbl.style.opacity = '1';
          showTip(e, '<strong>' + cap.name + '</strong><br><span style="font-size:11px;color:' + C.text2 + '">' + cm.cat.name + '</span>');
        });
        g.addEventListener('mousemove', moveTip);
        g.addEventListener('mouseleave', function () {
          path.setAttribute('fill-opacity', hasOpps ? '0.27' : '0.14');
          capLbl.style.opacity = '0';
          hideTip();
        });
        g.addEventListener('click', function () { openCapabilityDrawer(cap.id); });

        capG.appendChild(g);

        var delay2 = 1400 + capIdx * 18;
        (function (pEl) {
          setTimeout(function () { fadeIn(pEl, 380, 0); }, delay2);
        }(path));
        capIdx++;
      });
    });

    // ── SOLUTION DOTS ──
    var solG = svgMk('g', { class: 'ea-sol-dots' });
    svg.appendChild(solG);

    SOLS.forEach(function (sol, si) {
      var cluster = CLUSTERS.find(function (c) { return c.id === sol.portfolioClusterId; });
      var dotColor = cluster ? cluster.color : C.text3;
      var ev = sol.evidenceFlags || {};
      var capIds = sol.capIds || [];

      // Gather all mid-angles for mapped caps
      var angles = [];
      catMeta.forEach(function (cm) {
        var nCaps = cm.capObjs.length || 1;
        cm.capObjs.forEach(function (cap, ci) {
          if (capIds.indexOf(cap.id) > -1) {
            angles.push(cm.start + (cm.span / nCaps) * (ci + 0.5));
          }
        });
      });
      if (!angles.length) return; // skip unmapped solutions

      var avgA = angles.reduce(function (a, b) { return a + b; }, 0) / angles.length;
      var jitter = ((si % 9) - 4) * 0.028;
      var angle = avgA + jitter;
      var rDot = 252 + (si % 4) * 8;
      var x = (rDot * Math.cos(angle)).toFixed(2);
      var y = (rDot * Math.sin(angle)).toFixed(2);

      var g = svgMk('g', { class: 'ea-sdot-' + sol.id });
      g.style.opacity = '0';

      // Main dot
      var dot = svgMk('circle', { cx: x, cy: y, r: '7', fill: dotColor, 'fill-opacity': '0.85', stroke: dotColor, 'stroke-width': '1.5', 'stroke-opacity': '0.9' });
      g.appendChild(dot);

      // Asset ring (green)
      if (ev.asset === true) {
        g.appendChild(svgMk('circle', { cx: x, cy: y, r: '11', fill: 'none', stroke: C.green, 'stroke-width': '1.5', 'stroke-opacity': '0.85' }));
      }

      // Legal review pending indicator (amber small dot)
      if (sol.legalReview === false) {
        var lrCx = (rDot * Math.cos(angle) + 9).toFixed(1);
        var lrCy = (rDot * Math.sin(angle) - 9).toFixed(1);
        g.appendChild(svgMk('circle', { cx: lrCx, cy: lrCy, r: '3.5', fill: C.amber, 'fill-opacity': '0.9' }));
      }

      // Demo pulsing dot (cyan)
      if (ev.demo === true) {
        var dCx = (rDot * Math.cos(angle) - 9).toFixed(1);
        var dCy = (rDot * Math.sin(angle) - 9).toFixed(1);
        var pulse = svgMk('circle', { cx: dCx, cy: dCy, r: '3.5', fill: C.cyan, 'fill-opacity': '0.9' });
        pulse.style.animation = 'ea-svgpulse 2s ease-in-out infinite';
        g.appendChild(pulse);
      }

      g.addEventListener('mouseenter', function (e) {
        dot.setAttribute('r', '9');
        showTip(e, '<strong>' + sol.displayName + '</strong>'
          + (cluster ? '<br><span style="color:' + dotColor + ';font-size:11px">' + cluster.name + '</span>' : '')
          + '<br><span style="color:' + C.text3 + ';font-size:11px">Source ' + sol.sourceNumber + '</span>');
      });
      g.addEventListener('mousemove', moveTip);
      g.addEventListener('mouseleave', function () { dot.setAttribute('r', '7'); hideTip(); });
      g.addEventListener('click', function () { openSolDrawer(sol.id); });

      solG.appendChild(g);
      var delay3 = 2600 + si * 28;
      (function (gEl) { setTimeout(function () { fadeIn(gEl, 280, 0); }, delay3); }(g));
    });

    canvas.appendChild(svg);

    // Legend
    var legend = mk('div', { className: 'ea-legend' });
    function legItem(color, label, ring) {
      var li = mk('div', { className: 'ea-legend-item' });
      if (ring) {
        var ringEl = mk('span', { style: { width: '10px', height: '10px', borderRadius: '50%', border: '2px solid ' + color, display: 'inline-block', flexShrink: '0' } });
        li.appendChild(ringEl);
      } else {
        li.appendChild(mk('span', { className: 'ea-legend-dot', style: { background: color } }));
      }
      li.appendChild(document.createTextNode(label));
      return li;
    }
    legend.appendChild(legItem('rgba(255,255,255,0.5)', 'Domain', true));
    legend.appendChild(legItem('rgba(255,255,255,0.3)', 'Capability', true));
    legend.appendChild(legItem(C.green, 'Asset available'));
    legend.appendChild(legItem(C.cyan, 'Demo available'));
    legend.appendChild(legItem(C.amber, 'Legal review pending'));
    canvas.appendChild(legend);

    // Controls hint
    var hint = mk('div', {
      style: { position: 'absolute', bottom: '10px', right: '14px', fontSize: '11px', color: C.text3, fontFamily: '"JetBrains Mono",monospace' },
      textContent: 'Click any capability or solution for detail'
    });
    canvas.appendChild(hint);
  }

  // ── VIEW 2: CONSTELLATION ──────────────────────────────────────
  function buildConstellation(canvas) {
    var SOLS = (typeof SOLUTIONS !== 'undefined') ? SOLUTIONS : [];
    var CLUSTERS = (typeof PORTFOLIO_CLUSTERS !== 'undefined') ? PORTFOLIO_CLUSTERS : [];

    var wrap = mk('div', { className: 'ea-const-wrap' });

    CLUSTERS.forEach(function (cluster) {
      var clSols = SOLS.filter(function (s) { return s.portfolioClusterId === cluster.id; });
      if (!clSols.length) return;

      var section = mk('div', { className: 'ea-const-cluster' });
      var hd = mk('div', { className: 'ea-const-cluster-hd', style: { color: cluster.color || C.text1 }, textContent: cluster.name });
      section.appendChild(hd);

      var grid = mk('div', { className: 'ea-const-grid' });
      clSols.forEach(function (sol) {
        var ev = sol.evidenceFlags || {};
        var card = mk('div', { className: 'ea-sol-card', style: { borderColor: (cluster.color || 'rgba(255,255,255,0.09)') + '55' } });
        card.appendChild(mk('div', { className: 'ea-sol-name', textContent: sol.displayName }));
        card.appendChild(mk('div', { className: 'ea-sol-src', textContent: 'Source ' + sol.sourceNumber }));

        var badges = mk('div', { className: 'ea-sol-badges' });
        function badge(label, col) {
          return mk('span', {
            className: 'ea-dr-badge',
            textContent: label,
            style: { color: col, borderColor: col }
          });
        }
        if (ev.concept === true)   badges.appendChild(badge('CONCEPT',   C.text2));
        if (ev.prototype === true) badges.appendChild(badge('PROTOTYPE', C.cyan));
        if (ev.asset === true)     badges.appendChild(badge('ASSET',     C.green));
        if (ev.demo === true)      badges.appendChild(badge('DEMO',      C.cyan));
        var lr = sol.legalReview;
        if (lr === true)  badges.appendChild(badge('LEGAL OK',      C.green));
        if (lr === false) badges.appendChild(badge('LEGAL PENDING', C.amber));
        var sc = sol.sharingStatus === 'shareable' ? C.green : sol.sharingStatus === 'nda-required' ? C.amber : sol.sharingStatus === 'team' ? C.cyan : C.text3;
        badges.appendChild(badge((sol.sharingStatus || 'to confirm').replace(/-/g, ' ').toUpperCase(), sc));
        card.appendChild(badges);

        card.addEventListener('click', function () { openSolDrawer(sol.id); });
        card.addEventListener('mouseenter', function () { card.style.borderColor = cluster.color || C.text1; });
        card.addEventListener('mouseleave', function () { card.style.borderColor = (cluster.color || 'rgba(255,255,255,0.09)') + '55'; });

        grid.appendChild(card);
      });
      section.appendChild(grid);
      wrap.appendChild(section);
    });

    canvas.appendChild(wrap);
  }

  // ── VIEW 3: PROCESS THEATRE ────────────────────────────────────
  // V26: 2-column row layout, not a 3x2 equal-card grid.
  function buildTheatre(canvas) {
    var wrap = mk('div', { className: 'ea-theatre-wrap' });
    var currentRow = null;

    THEATRE_DEMOS.forEach(function (demo, di) {
      // Start a new row every 2 cards
      if (di % 2 === 0) {
        currentRow = mk('div', { className: 'ea-theatre-row' });
        wrap.appendChild(currentRow);
      }
      var card = mk('div', { className: 'ea-theatre-card' });

      var bdgColor = demo.sourceBacked ? C.green : C.amber;
      var bdg = mk('div', { className: 'ea-theatre-badge', textContent: demo.sourceBacked ? 'SOURCE-BACKED' : 'ILLUSTRATIVE', style: { color: bdgColor, borderColor: bdgColor } });
      card.appendChild(bdg);
      card.appendChild(mk('div', { className: 'ea-theatre-title', textContent: demo.name }));
      card.appendChild(mk('div', { className: 'ea-theatre-desc', textContent: demo.desc }));

      var animArea = mk('div', { className: 'ea-theatre-anim' });
      animArea.innerHTML = '<span style="font-size:11px;color:' + C.text3 + ';font-family:\'Space Grotesk\',sans-serif">Press Play to preview</span>';
      card.appendChild(animArea);

      var STEPS = demo.steps;

      function renderStep(s) {
        animArea.innerHTML = '';
        STEPS.forEach(function (st, i) {
          var active = (i === s);
          var dot = mk('div', {
            style: {
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: '0',
              background: active ? st.c : 'transparent',
              border: '2px solid ' + (active ? st.c : 'rgba(255,255,255,0.15)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontFamily: '"JetBrains Mono",monospace',
              color: active ? '#000' : 'rgba(255,255,255,0.25)',
              transition: 'all .2s'
            },
            textContent: (i + 1).toString()
          });
          var lbl = mk('div', {
            className: 'ea-theatre-step-lbl',
            textContent: st.l,
            style: { color: active ? st.c : C.text3, fontSize: '11px', marginTop: '2px', transition: 'color .2s' }
          });
          var stepEl = mk('div', {
            className: 'ea-theatre-step',
            style: { opacity: active ? '1' : '0.3', alignItems: 'center', transition: 'opacity .2s' }
          });
          stepEl.appendChild(dot);
          stepEl.appendChild(lbl);
          animArea.appendChild(stepEl);
          if (i < STEPS.length - 1) {
            animArea.appendChild(mk('span', { style: { color: C.text3, fontSize: '11px' }, textContent: '→' }));
          }
        });
      }

      var playing = false;
      var interval = null;
      var step = 0;
      var playBtn = mk('button', { className: 'ea-play-btn', textContent: 'Play' });

      function stopPlay() {
        playing = false;
        if (_playingCard === playBtn) _playingCard = null;
        clearInterval(interval);
        playBtn.textContent = 'Play';
        animArea.innerHTML = '<span style="font-size:11px;color:' + C.text3 + ';font-family:\'Space Grotesk\',sans-serif">Press Play to preview</span>';
      }

      function startPlay() {
        if (_playingCard && _playingCard !== playBtn) _playingCard.click();
        playing = true;
        _playingCard = playBtn;
        playBtn.textContent = 'Stop';
        step = 0;
        renderStep(0);
        interval = setInterval(function () {
          step += 1;
          if (step >= STEPS.length) { clearInterval(interval); setTimeout(stopPlay, 1200); return; }
          renderStep(step);
        }, 900);
      }

      playBtn.addEventListener('click', function () { if (playing) stopPlay(); else startPlay(); });
      card.appendChild(playBtn);
      currentRow.appendChild(card);
    });

    canvas.appendChild(wrap);
  }

  // ── VIEW 4: ARCHITECTURE ───────────────────────────────────────
  function buildArchitecture(canvas) {
    var wrap = mk('div', { className: 'ea-arch-wrap' });
    wrap.appendChild(mk('div', { className: 'ea-arch-hd', textContent: 'AI risk function -- reference architecture' }));

    ARCH_LAYERS.forEach(function (layer) {
      var layerEl = mk('div', {
        className: 'ea-arch-layer',
        style: { background: 'linear-gradient(90deg,' + layer.color + '18 0%,' + C.surface + ' 100%)' }
      });
      layerEl.appendChild(mk('div', { className: 'ea-arch-name', textContent: layer.name, style: { color: layer.color } }));
      layerEl.appendChild(mk('div', { className: 'ea-arch-desc', textContent: layer.desc }));

      var comps = mk('div', { className: 'ea-arch-comps' });
      layer.components.forEach(function (c) {
        comps.appendChild(mk('span', { className: 'ea-arch-chip', textContent: c }));
      });
      layerEl.appendChild(comps);

      var expanded = false;
      layerEl.addEventListener('click', function () {
        expanded = !expanded;
        if (expanded) {
          layerEl.style.height = '100px';
          layerEl.style.flexWrap = 'wrap';
          layerEl.style.alignItems = 'flex-start';
          layerEl.style.paddingTop = '10px';
          comps.style.display = 'flex';
        } else {
          layerEl.style.height = '44px';
          layerEl.style.flexWrap = '';
          layerEl.style.alignItems = 'center';
          layerEl.style.paddingTop = '';
          comps.style.display = 'none';
        }
      });

      wrap.appendChild(layerEl);
    });

    wrap.appendChild(mk('div', { className: 'ea-note', textContent: 'Click any layer to expand component detail. Architecture is indicative -- validate against the client technology landscape.' }));
    canvas.appendChild(wrap);
  }

  // ── VIEW 5: METHOD ─────────────────────────────────────────────
  function buildMethod(canvas) {
    var wrap = mk('div', { className: 'ea-method-wrap' });
    var matColors = [C.text3, C.cyan, C.green, C.amber, C.accent];

    // Column 1: Evidence to design
    var col1 = mk('div');
    col1.appendChild(mk('div', { className: 'ea-method-col-hd', textContent: 'Evidence-to-design' }));
    METHOD_STEPS.forEach(function (step, i) {
      var s = mk('div', { className: 'ea-method-step', style: { borderLeftColor: C.accent } });
      s.appendChild(mk('div', { className: 'ea-method-num', textContent: (i + 1).toString().padStart(2, '0') + ' -- ' + step.label.toUpperCase(), style: { color: C.accent } }));
      s.appendChild(mk('div', { className: 'ea-method-desc', textContent: step.desc }));
      col1.appendChild(s);
    });
    wrap.appendChild(col1);

    // Column 2: Maturity criteria
    var col2 = mk('div');
    col2.appendChild(mk('div', { className: 'ea-method-col-hd', textContent: 'Maturity criteria' }));
    MATURITY_LEVELS.forEach(function (lvl, i) {
      var r = mk('div', { className: 'ea-mat-row', style: { borderLeftColor: matColors[i] } });
      var lbl = mk('div', { className: 'ea-mat-label' });
      lbl.appendChild(mk('span', { className: 'ea-mat-lvl', textContent: 'L' + lvl.level, style: { color: matColors[i] } }));
      lbl.appendChild(mk('span', { className: 'ea-mat-name', textContent: lvl.label }));
      r.appendChild(lbl);
      r.appendChild(mk('div', { className: 'ea-mat-desc', textContent: lvl.desc }));
      col2.appendChild(r);
    });
    wrap.appendChild(col2);

    // Column 3: Team (D3 ring diagram)
    var col3 = mk('div');
    col3.appendChild(mk('div', { className: 'ea-method-col-hd', textContent: 'Delivery team' }));

    var teamWrap = mk('div', { style: { width: '100%', maxWidth: '240px' } });

    var TEAM_ROLES = [
      { ring: 0, label: 'Lead',        color: C.accent },
      { ring: 1, label: 'Risk SME',    color: C.cyan   },
      { ring: 1, label: 'AI Eng',      color: C.cyan   },
      { ring: 2, label: 'Data',        color: C.green  },
      { ring: 2, label: 'Design',      color: C.green  },
      { ring: 2, label: 'Change',      color: C.green  }
    ];

    if (typeof d3 !== 'undefined') {
      var W2 = 220, H2 = 220, CX2 = 110, CY2 = 110;
      var teamSvg = d3.select(teamWrap).append('svg')
        .attr('viewBox', '0 0 ' + W2 + ' ' + H2).attr('width', '100%').attr('height', '100%')
        .attr('role', 'img').attr('aria-label', 'Delivery team cell diagram');

      // Centre
      teamSvg.append('circle').attr('cx', CX2).attr('cy', CY2).attr('r', 30).attr('fill', C.surface).attr('stroke', C.accent).attr('stroke-width', 1.5).attr('stroke-opacity', 0.7);
      teamSvg.append('text').attr('x', CX2).attr('y', CY2 - 4).attr('text-anchor', 'middle').attr('font-size', '9').attr('font-family', '"Space Grotesk",sans-serif').attr('fill', C.accent).attr('font-weight', '700').text('Proof');
      teamSvg.append('text').attr('x', CX2).attr('y', CY2 + 8).attr('text-anchor', 'middle').attr('font-size', '8').attr('font-family', '"Space Grotesk",sans-serif').attr('fill', C.text3).text('objective');

      [1, 2, 3].forEach(function (r3) {
        teamSvg.append('circle').attr('cx', CX2).attr('cy', CY2).attr('r', r3 * 30 + 4).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 1);
      });

      var byRing = [[], [], []];
      TEAM_ROLES.forEach(function (r4) { byRing[r4.ring].push(r4); });
      byRing.forEach(function (rr2, ri) {
        rr2.forEach(function (role, idx) {
          var angle2 = (2 * Math.PI * idx / Math.max(rr2.length, 1)) - Math.PI / 2;
          var radius3 = (ri + 1) * 30 + 4;
          var rx = CX2 + radius3 * Math.cos(angle2);
          var ry = CY2 + radius3 * Math.sin(angle2);
          teamSvg.append('circle').attr('cx', rx).attr('cy', ry).attr('r', 16).attr('fill', C.surf2).attr('stroke', role.color).attr('stroke-width', 1.5).attr('stroke-opacity', 0.8);
          teamSvg.append('text').attr('x', rx).attr('y', ry + 1).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('font-size', '8').attr('font-family', '"Space Grotesk",sans-serif').attr('fill', role.color).text(role.label);
        });
      });
    } else {
      teamWrap.innerHTML = '<div style="font-size:12px;color:' + C.text2 + ';line-height:2">' + TEAM_ROLES.map(function (r5) { return r5.label; }).join(' -- ') + '</div>';
    }

    col3.appendChild(teamWrap);
    col3.appendChild(mk('div', { className: 'ea-note', textContent: 'Cell structure: one lead, two or three capability SMEs per ring. Scales to engagement size.' }));
    wrap.appendChild(col3);

    canvas.appendChild(wrap);
  }

  // ── SHELL + TABS ───────────────────────────────────────────────
  var _TABS = [
    { id: 'map',          label: 'Risk map'       },
    { id: 'constellation',label: 'Solutions'      },
    { id: 'theatre',      label: 'Process theatre'},
    { id: 'architecture', label: 'Architecture'   },
    { id: 'method',       label: 'Method'         }
  ];

  function buildShell() {
    _container.innerHTML = '';
    _container.style.position = 'relative';
    _container.style.overflow = 'hidden';

    injectStyles();

    var shell = mk('div', { className: 'ea-shell' });

    // Top bar -- ARIA tablist
    var topbar = mk('div', { className: 'ea-topbar', role: 'tablist', 'aria-label': 'Evidence Atlas views' });
    _TABS.forEach(function (tab, idx) {
      var isActive = tab.id === _currentView;
      var btn = mk('button', {
        className: 'ea-tab' + (isActive ? ' active' : ''),
        textContent: tab.label,
        role: 'tab',
        id: 'ea-tab-' + tab.id,
        'aria-selected': isActive ? 'true' : 'false',
        tabindex: isActive ? '0' : '-1'
      });
      btn._tabId = tab.id;
      btn._tabIdx = idx;
      btn.addEventListener('click', function () { switchView(tab.id); });
      topbar.appendChild(btn);
    });

    var searchBtn = mk('button', { className: 'ea-search-btn' });
    searchBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span>Ctrl+K</span>';
    searchBtn.addEventListener('click', function () { if (_paletteOverlay) closePalette(); else openPalette(); });
    topbar.appendChild(searchBtn);

    shell.appendChild(topbar);

    var canvas = mk('div', { className: 'ea-canvas', role: 'tabpanel', 'aria-labelledby': 'ea-tab-' + _currentView });
    shell.appendChild(canvas);
    _container.appendChild(shell);

    // Keyboard handler -- Ctrl+K palette, Escape, and tab arrow navigation
    _keyListener = function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (_paletteOverlay) closePalette(); else openPalette();
        return;
      }
      if (e.key === 'Escape') { closePalette(); closeDrawer(); return; }
      // Arrow key tab navigation only when focus is within the topbar
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var focusedTab = document.activeElement;
      if (!focusedTab || focusedTab._tabIdx === undefined) return;
      var delta = e.key === 'ArrowRight' ? 1 : -1;
      var nextIdx = (focusedTab._tabIdx + delta + _TABS.length) % _TABS.length;
      var allTabs = Array.from(topbar.querySelectorAll('[role="tab"]'));
      var nextBtn = allTabs[nextIdx];
      if (nextBtn) { e.preventDefault(); nextBtn.focus(); switchView(_TABS[nextIdx].id); }
    };
    document.addEventListener('keydown', _keyListener);

    return canvas;
  }

  // ── SWITCH VIEW ────────────────────────────────────────────────
  function switchView(name) {
    _currentView = name;
    closePalette();
    closeDrawer();

    var shell = _container.querySelector('.ea-shell');
    if (!shell) return;
    shell.querySelectorAll('.ea-tab').forEach(function (btn) {
      var active = btn._tabId === name;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });

    var canvas = shell.querySelector('.ea-canvas');
    if (!canvas) return;
    canvas.setAttribute('aria-labelledby', 'ea-tab-' + name);
    canvas.innerHTML = '';

    switch (name) {
      case 'map':           buildRiskMap(canvas);       break;
      case 'constellation': buildConstellation(canvas); break;
      case 'theatre':       buildTheatre(canvas);       break;
      case 'architecture':  buildArchitecture(canvas);  break;
      case 'method':        buildMethod(canvas);        break;
    }
  }

  // ── PUBLIC API ─────────────────────────────────────────────────
  var EvidenceAtlas = {
    init: function (container) {
      _container = container;
      _currentView = 'map';
      var canvas = buildShell();
      buildRiskMap(canvas);
    },
    destroy: function () {
      if (_keyListener) { document.removeEventListener('keydown', _keyListener); _keyListener = null; }
      closePalette();
      closeDrawer();
      if (_container) _container.innerHTML = '';
      _container = null;
    },
    switchView: switchView
  };

  global.EvidenceAtlas = EvidenceAtlas;
}(window));
