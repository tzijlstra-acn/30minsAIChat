// Scene: regulation-process (Screen 04 - WHERE IT APPLIES)
// 4-lane process flow for Regulation Coverage, stages animate sequentially
// Data loaded from regulation-coverage.json (inlined for static deployment)
SceneDirector.register('regulation-process', function(container, manifest, reduced) {
  var lanes = [
    { id: 'work',       label: 'WORK AND DECISIONS',  color: 'var(--text-2)'  },
    { id: 'data',       label: 'DATA AND OBJECTS',     color: 'var(--cyan)'    },
    { id: 'automation', label: 'AI AND AUTOMATION',    color: 'var(--accent)'  },
    { id: 'human',      label: 'HUMAN AND CONTROL',    color: 'var(--green)'   }
  ];
  var stages = [
    { id: 's1', label: 'Receive source',         work: 'Receive regulation or policy document', automation: 'Ingestion and classification', human: 'Source validation' },
    { id: 's2', label: 'Structure obligations',  work: 'Extract obligation elements',           automation: 'Extraction agent',             human: null              },
    { id: 's3', label: 'Match policies',         work: 'Map to policy coverage',                automation: 'Semantic matching agent',      human: null              },
    { id: 's4', label: 'Match controls',         work: 'Map to control library',                automation: 'Gap analysis',                 human: null              },
    { id: 's5', label: 'Assess gaps',            work: 'Identify gaps and redundancies',        automation: 'Draft recommendation',         human: 'Analyst challenge' },
    { id: 's6', label: 'Review and approve',     work: 'Challenge assessment, approve',         automation: null,                           human: 'Named approval gate' },
    { id: 's7', label: 'Record evidence',        work: 'Create evidence trail',                 automation: 'Evidence packaging',           human: 'Ownership record' }
  ];
  var humanGates = ['s1', 's5', 's6'];

  function getCell(stage, laneId) {
    if (laneId === 'work') return stage.work;
    if (laneId === 'data') return null;
    if (laneId === 'automation') return stage.automation;
    if (laneId === 'human') return stage.human;
    return null;
  }

  function build() {
    container.innerHTML = '';
    var table = document.createElement('div');
    table.style.cssText = 'display:grid;grid-template-columns:80px repeat(' + stages.length + ', 1fr);gap:2px;height:100%;padding:16px;font-family:"JetBrains Mono",monospace;';

    // Header row
    var corner = document.createElement('div');
    table.appendChild(corner);
    stages.forEach(function(s) {
      var hdr = document.createElement('div');
      hdr.style.cssText = 'font-size:8px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);padding:4px 6px;border-bottom:1px solid var(--border-1);text-align:center;';
      hdr.textContent = s.label;
      table.appendChild(hdr);
    });

    // Lane rows
    lanes.forEach(function(lane) {
      var laneLabel = document.createElement('div');
      laneLabel.style.cssText = 'font-size:7.5px;letter-spacing:.08em;text-transform:uppercase;color:' + lane.color + ';writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);display:flex;align-items:center;justify-content:center;padding:6px 0;';
      laneLabel.textContent = lane.label;
      table.appendChild(laneLabel);

      stages.forEach(function(stage) {
        var content = getCell(stage, lane.id);
        var isHumanGate = lane.id === 'human' && humanGates.indexOf(stage.id) > -1;
        var cell = document.createElement('div');
        cell.className = 'process-lane-cell';
        cell.dataset.stageId = stage.id;
        cell.dataset.laneId = lane.id;
        cell.style.cssText = 'background:' + (content ? 'var(--surface-1)' : 'transparent') + ';border:' + (content ? '1px solid var(--border-1)' : 'none') + ';border-radius:4px;padding:4px 6px;font-size:9px;color:var(--text-2);line-height:1.3;' + (isHumanGate ? 'border-color:var(--green);' : '');
        if (content) {
          cell.textContent = content;
          if (lane.id === 'automation' && content) cell.style.color = 'var(--accent)';
          if (isHumanGate) { cell.style.color = 'var(--green)'; cell.style.fontWeight = '600'; }
        }
        table.appendChild(cell);
      });
    });

    container.appendChild(table);
  }

  var steps = stages.map(function(stage, i) {
    return { delay: 600 + i * 1200, run: function() {
      var cells = container.querySelectorAll('[data-stage-id="' + stage.id + '"]');
      cells.forEach(function(c) { c.classList.add('visible'); });
    }};
  });

  var tl = createTimeline(steps);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { build(); tl.reset(); },
    finish: function() {
      build();
      container.querySelectorAll('.process-lane-cell').forEach(function(c) { c.classList.add('visible'); });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
