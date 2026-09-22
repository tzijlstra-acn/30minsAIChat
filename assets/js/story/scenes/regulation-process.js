// Scene: regulation-process (Screen 04 - WHERE IT APPLIES)
// 4-lane process flow for Regulation Coverage -- Art. 7(3) obligation travels stage by stage.
// Animation: obligation pill enters top, then stage columns light up one by one.
// Design: stage header 12px, lane labels 14px, cell text 12px, human gates in green.
SceneDirector.register('regulation-process', function(container, manifest, reduced) {

  var OBLIGATION = 'Art. 7(3): Coverage mapping';

  var lanes = [
    { id: 'work',       label: 'Work & Decisions',  color: 'var(--text-2)'  },
    { id: 'data',       label: 'Data & Objects',     color: 'var(--cyan)'    },
    { id: 'automation', label: 'AI & Automation',    color: 'var(--accent)'  },
    { id: 'human',      label: 'Human & Control',    color: 'var(--green)'   }
  ];

  var stages = [
    {
      id: 's1', label: 'Receive',
      work:       'Receive regulation document',
      data:       'Source document ingested',
      automation: 'Classification agent',
      human:      'Source validation gate'
    },
    {
      id: 's2', label: 'Structure',
      work:       'Extract obligation elements',
      data:       'Obligation objects created',
      automation: 'Extraction agent',
      human:      null
    },
    {
      id: 's3', label: 'Match policies',
      work:       'Map to policy coverage',
      data:       'Policy records linked',
      automation: 'Semantic matching agent',
      human:      null
    },
    {
      id: 's4', label: 'Match controls',
      work:       'Map to control library',
      data:       'Control records linked',
      automation: 'Gap analysis',
      human:      null
    },
    {
      id: 's5', label: 'Assess gaps',
      work:       'Identify gaps and redundancies',
      data:       'Gap report generated',
      automation: 'Draft recommendation',
      human:      'Analyst challenge gate'
    },
    {
      id: 's6', label: 'Approve',
      work:       'Challenge assessment, approve',
      data:       'Approval decision recorded',
      automation: null,
      human:      'Named approval gate'
    },
    {
      id: 's7', label: 'Evidence',
      work:       'Create evidence trail',
      data:       'Evidence package created',
      automation: 'Evidence packaging',
      human:      'Ownership recorded'
    }
  ];

  var humanGates = ['s1', 's5', 's6'];

  // Status labels that update on the obligation pill as stages progress
  var stageStatus = {
    s1: { text: 'Received',    cls: 's-extracting' },
    s2: { text: 'Structuring', cls: 's-extracting' },
    s3: { text: 'Matching',    cls: 's-mapping'    },
    s4: { text: 'Mapping',     cls: 's-mapping'    },
    s5: { text: 'Under review', cls: 's-reviewed'  },
    s6: { text: 'Approved',    cls: 's-approved'   },
    s7: { text: 'Evidenced',   cls: 's-evidenced'  }
  };

  function getCell(stage, laneId) { return stage[laneId] || null; }

  function build() {
    container.innerHTML = '';
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;flex-direction:column;gap:8px;height:100%;padding:12px 16px;';

    // ── Obligation tracker row ──
    var tracker = document.createElement('div');
    tracker.style.cssText = 'display:flex;align-items:center;gap:10px;flex-shrink:0;';

    var trackerDot = document.createElement('div');
    trackerDot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;';
    tracker.appendChild(trackerDot);

    var trackerTag = document.createElement('div');
    trackerTag.style.cssText = 'font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);white-space:nowrap;';
    trackerTag.textContent = 'Obligation';
    tracker.appendChild(trackerTag);

    var trackerText = document.createElement('div');
    trackerText.style.cssText = 'font-family:\'Space Grotesk\',sans-serif;font-size:15px;font-weight:600;color:var(--text-1);';
    trackerText.textContent = OBLIGATION;
    tracker.appendChild(trackerText);

    var trackerStatus = document.createElement('div');
    trackerStatus.id = 'oblig-status';
    trackerStatus.style.cssText = 'margin-left:auto;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:3px;opacity:0;transition:opacity 300ms ease;';
    tracker.appendChild(trackerStatus);

    outer.appendChild(tracker);

    // ── Stage grid ──
    var table = document.createElement('div');
    table.style.cssText = 'display:grid;grid-template-columns:100px repeat(' + stages.length + ',1fr);gap:3px;flex:1;min-height:0;font-family:\'JetBrains Mono\',monospace;';

    // Header row: corner + stage labels
    var corner = document.createElement('div');
    corner.style.cssText = 'padding:4px;';
    table.appendChild(corner);

    stages.forEach(function(s) {
      var hdr = document.createElement('div');
      hdr.style.cssText = 'font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);padding:4px 6px;border-bottom:1px solid var(--border-1);text-align:center;font-weight:600;';
      hdr.textContent = s.label;
      table.appendChild(hdr);
    });

    // Lane rows
    lanes.forEach(function(lane) {
      // Lane label cell
      var laneLabel = document.createElement('div');
      laneLabel.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;padding-right:8px;';

      var laneLabelInner = document.createElement('div');
      laneLabelInner.style.cssText = 'font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:' + lane.color + ';font-weight:600;writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);';
      laneLabelInner.textContent = lane.label;
      laneLabel.appendChild(laneLabelInner);
      table.appendChild(laneLabel);

      // Stage cells for this lane
      stages.forEach(function(stage) {
        var content = getCell(stage, lane.id);
        var isHumanGate = lane.id === 'human' && humanGates.indexOf(stage.id) > -1;
        var cell = document.createElement('div');
        cell.className = 'process-lane-cell';
        cell.dataset.stageId = stage.id;
        cell.dataset.laneId = lane.id;

        var baseStyle = 'border-radius:5px;padding:5px 7px;font-size:11px;line-height:1.3;min-height:0;display:flex;align-items:flex-start;';
        if (content) {
          var bgColor = 'var(--surface-1)';
          var borderColor = isHumanGate ? 'var(--green)' : 'var(--border-1)';
          var textColor = isHumanGate ? 'var(--green)'
            : (lane.id === 'automation' ? 'var(--accent)' : 'var(--text-2)');
          cell.style.cssText = baseStyle + 'background:' + bgColor + ';border:1px solid ' + borderColor + ';color:' + textColor + ';' + (isHumanGate ? 'font-weight:600;' : '');

          // Human gate: prefix with diamond
          if (isHumanGate) {
            cell.innerHTML = '<span style="margin-right:5px;font-size:13px">&#9674;</span>' + content;
          } else {
            cell.textContent = content;
          }
        } else {
          cell.style.cssText = baseStyle + 'background:transparent;';
        }

        table.appendChild(cell);
      });
    });

    outer.appendChild(table);
    container.appendChild(outer);
  }

  function updateStatus(stageId) {
    var statusEl = container.querySelector('#oblig-status');
    if (!statusEl) return;
    var s = stageStatus[stageId];
    if (!s) return;
    // Remove all status classes
    statusEl.className = '';
    statusEl.classList.add('obligation-token-status', s.cls);
    statusEl.textContent = s.text;
    statusEl.style.opacity = '1';
  }

  var steps = stages.map(function(stage, i) {
    return {
      delay: 500 + i * 1100,
      run: function() {
        var cells = container.querySelectorAll('[data-stage-id="' + stage.id + '"]');
        cells.forEach(function(c) { c.classList.add('visible'); });
        updateStatus(stage.id);
      }
    };
  });

  var tl = createTimeline(steps);

  return {
    play:    function() { build(); tl.play(); },
    pause:   tl.pause,
    resume:  tl.resume,
    reset:   function() { build(); tl.reset(); },
    finish:  function() {
      build();
      container.querySelectorAll('.process-lane-cell').forEach(function(c) { c.classList.add('visible'); });
      updateStatus('s7');
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
