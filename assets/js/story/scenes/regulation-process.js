// Scene: regulation-process (Screen 04 - WHERE IT APPLIES)
// V15 overhaul: 5-beat cinematic executive flow replacing the 28-cell process grid.
// source -> structure -> match -> challenge -> evidence
// One obligation token (OBL-27) transforms as it moves through the flow.
SceneDirector.register('regulation-process', function(container, manifest, reduced) {

  var beats = [
    {
      id: 'source',
      label: 'SOURCE',
      sub: 'Regulatory text',
      lane: 'Data',
      laneColor: 'var(--cyan)',
      color: 'var(--cyan)',
      icon: 'ti-file-text',
      hint: 'Document ingested'
    },
    {
      id: 'structure',
      label: 'STRUCTURE',
      sub: 'Obligation record',
      lane: 'AI',
      laneColor: 'var(--accent)',
      color: 'var(--accent)',
      icon: 'ti-database',
      hint: 'Elements extracted'
    },
    {
      id: 'match',
      label: 'MATCH',
      sub: 'Policy and control',
      lane: 'AI',
      laneColor: 'var(--accent)',
      color: 'var(--accent)',
      icon: 'ti-sitemap',
      hint: 'Coverage assessed'
    },
    {
      id: 'challenge',
      label: 'CHALLENGE',
      sub: 'Gap and review',
      lane: 'Human',
      laneColor: 'var(--amber)',
      color: 'var(--amber)',
      icon: 'ti-user-check',
      hint: 'Analyst challenge gate',
      isGate: true
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      sub: 'Approved action record',
      lane: 'Evidence',
      laneColor: 'var(--green)',
      color: 'var(--green)',
      icon: 'ti-certificate',
      hint: 'Traceable and approved'
    }
  ];

  var tokenFields = [
    { key: 'ID',        val: 'OBL-27'              },
    { key: 'Actor',     val: 'Control owner'        },
    { key: 'Action',    val: 'Review access rights' },
    { key: 'Condition', val: 'Critical systems'     },
    { key: 'Frequency', val: 'Quarterly'            }
  ];

  function build() {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;height:100%;padding:10px 16px;';

    // ── Obligation token area ──
    var tokenWrap = document.createElement('div');
    tokenWrap.className = 'scene-node';
    tokenWrap.dataset.tokenWrap = '1';
    tokenWrap.style.cssText = 'flex-shrink:0;background:var(--surface-2);border:1px solid var(--border-1);border-radius:8px;padding:10px 14px;transition:border-color 600ms,background 600ms;';

    // Raw text phase
    var rawDiv = document.createElement('div');
    rawDiv.dataset.phase = 'raw';
    rawDiv.style.cssText = 'display:flex;align-items:center;gap:10px;';
    rawDiv.innerHTML =
      '<i class="ti ti-file-description" style="font-size:20px;color:var(--cyan);flex-shrink:0"></i>'
      + '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--text-3);line-height:1.5">'
      + '&ldquo;Art.&nbsp;7(3): Each institution shall assess coverage of obligations mapped to internal controls on a quarterly basis&hellip;&rdquo;'
      + '</span>';
    tokenWrap.appendChild(rawDiv);

    // Structured phase
    var structDiv = document.createElement('div');
    structDiv.dataset.phase = 'structured';
    structDiv.style.cssText = 'display:none;align-items:center;gap:14px;flex-wrap:wrap;';

    tokenFields.forEach(function(f, i) {
      var field = document.createElement('div');
      if (i === 0) {
        field.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:.1em;font-weight:700;color:var(--accent);padding:3px 10px;background:rgba(180,76,255,.1);border:1px solid var(--accent);border-radius:4px;flex-shrink:0;';
        field.textContent = f.val;
      } else {
        field.style.cssText = 'display:flex;flex-direction:column;gap:1px;';
        field.innerHTML = '<span style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3)">' + f.key + '</span>'
          + '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1)">' + f.val + '</span>';
      }
      structDiv.appendChild(field);
    });
    tokenWrap.appendChild(structDiv);
    wrap.appendChild(tokenWrap);

    // ── Flow spine ──
    var spine = document.createElement('div');
    spine.style.cssText = 'display:flex;align-items:stretch;gap:0;flex:1;min-height:0;';

    beats.forEach(function(beat, i) {
      // Node card
      var node = document.createElement('div');
      node.className = 'scene-node';
      node.dataset.beat = 'beat-' + beat.id;
      node.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 10px;'
        + 'background:var(--surface-1);border:1px solid var(--border-1);border-radius:10px;'
        + 'min-width:0;text-align:center;position:relative;transition:border-color 400ms ease,background 400ms ease;';

      if (beat.isGate) {
        var gateMark = document.createElement('div');
        gateMark.style.cssText = 'position:absolute;top:-9px;left:50%;transform:translateX(-50%);'
          + 'font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;'
          + 'color:var(--amber);background:var(--surface-1);padding:0 6px;border:1px solid var(--amber);border-radius:3px;white-space:nowrap;';
        gateMark.textContent = 'Human gate';
        node.appendChild(gateMark);
      }

      var ico = document.createElement('div');
      ico.style.cssText = 'font-size:24px;color:' + beat.color + ';margin-top:' + (beat.isGate ? '4px' : '0') + ';';
      ico.innerHTML = '<i class="ti ' + beat.icon + '"></i>';
      node.appendChild(ico);

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.14em;font-weight:700;color:' + beat.color + ';';
      lbl.textContent = beat.label;
      node.appendChild(lbl);

      var sub = document.createElement('div');
      sub.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:600;color:var(--text-1);line-height:1.2;';
      sub.textContent = beat.sub;
      node.appendChild(sub);

      var hint = document.createElement('div');
      hint.style.cssText = 'font-family:\'Inter\',sans-serif;font-size:11px;color:var(--text-3);line-height:1.3;margin-top:auto;';
      hint.textContent = beat.hint;
      node.appendChild(hint);

      var badge = document.createElement('div');
      badge.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;'
        + 'color:' + beat.laneColor + ';border:1px solid ' + beat.laneColor + ';border-radius:3px;padding:2px 6px;opacity:.6;';
      badge.textContent = beat.lane;
      node.appendChild(badge);

      spine.appendChild(node);

      if (i < beats.length - 1) {
        var connWrap = document.createElement('div');
        connWrap.style.cssText = 'flex-shrink:0;width:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;position:relative;';

        var arr = document.createElement('div');
        arr.className = 'scene-node';
        arr.dataset.beat = 'arr-' + i;
        arr.style.cssText = 'font-size:16px;color:var(--border-2);';
        arr.textContent = '→';
        connWrap.appendChild(arr);

        // Gap indicator appears between MATCH and CHALLENGE
        if (i === 2) {
          var gapPin = document.createElement('div');
          gapPin.className = 'scene-node';
          gapPin.dataset.beat = 'gap-pin';
          gapPin.style.cssText = 'position:absolute;top:8px;font-family:\'JetBrains Mono\',monospace;font-size:8px;'
            + 'letter-spacing:.08em;text-transform:uppercase;color:var(--pink);background:rgba(240,117,138,.1);'
            + 'border:1px solid var(--pink);border-radius:3px;padding:1px 5px;white-space:nowrap;';
          gapPin.textContent = 'Gap';
          connWrap.appendChild(gapPin);
        }

        spine.appendChild(connWrap);
      }
    });

    wrap.appendChild(spine);
    container.appendChild(wrap);
  }

  function activateNode(beatId) {
    beats.forEach(function(b) {
      var n = container.querySelector('[data-beat="beat-' + b.id + '"]');
      if (!n) return;
      if (b.id === beatId) {
        n.style.borderColor = b.color;
        n.style.background = 'rgba(0,0,0,.12)';
      }
    });
  }

  function showStructured() {
    var rawDiv = container.querySelector('[data-phase="raw"]');
    var structDiv = container.querySelector('[data-phase="structured"]');
    if (rawDiv) rawDiv.style.display = 'none';
    if (structDiv) structDiv.style.display = 'flex';
  }

  var steps = [
    { delay: 300, run: function() {
      var tw = container.querySelector('[data-token-wrap]');
      if (tw) tw.classList.add('visible');
      var n = container.querySelector('[data-beat="beat-source"]');
      if (n) n.classList.add('visible');
      activateNode('source');
    }},
    { delay: 1000, run: function() {
      var a = container.querySelector('[data-beat="arr-0"]');
      if (a) a.classList.add('visible');
      showStructured();
      var n = container.querySelector('[data-beat="beat-structure"]');
      if (n) n.classList.add('visible');
      activateNode('structure');
    }},
    { delay: 2000, run: function() {
      var a = container.querySelector('[data-beat="arr-1"]');
      if (a) a.classList.add('visible');
      var n = container.querySelector('[data-beat="beat-match"]');
      if (n) n.classList.add('visible');
      activateNode('match');
    }},
    { delay: 3200, run: function() {
      var g = container.querySelector('[data-beat="gap-pin"]');
      if (g) g.classList.add('visible');
      var a = container.querySelector('[data-beat="arr-2"]');
      if (a) a.classList.add('visible');
    }},
    { delay: 4000, run: function() {
      var n = container.querySelector('[data-beat="beat-challenge"]');
      if (n) n.classList.add('visible');
      activateNode('challenge');
    }},
    { delay: 5200, run: function() {
      var a = container.querySelector('[data-beat="arr-3"]');
      if (a) a.classList.add('visible');
      var n = container.querySelector('[data-beat="beat-evidence"]');
      if (n) {
        n.classList.add('visible');
        n.style.borderColor = 'var(--green)';
        n.style.background = 'rgba(88,201,148,.07)';
      }
      var tw = container.querySelector('[data-token-wrap]');
      if (tw) {
        tw.style.borderColor = 'var(--green)';
        tw.style.background = 'rgba(88,201,148,.06)';
      }
    }}
  ];

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      container.querySelectorAll('.scene-node').forEach(function(n) { n.classList.add('visible'); });
      showStructured();
      beats.forEach(function(b) { activateNode(b.id); });
      var evNode = container.querySelector('[data-beat="beat-evidence"]');
      if (evNode) {
        evNode.style.borderColor = 'var(--green)';
        evNode.style.background = 'rgba(88,201,148,.07)';
      }
      var tw = container.querySelector('[data-token-wrap]');
      if (tw) {
        tw.style.borderColor = 'var(--green)';
        tw.style.background = 'rgba(88,201,148,.06)';
      }
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
