// ── SCREEN RENDERERS ──
// Each renderer takes the section element and populates it

// TRANSFORMATION SYSTEM (Screen 4): deterministic SVG layout with tab strip
function renderTransformationSystem(sec){
  var container=sec.querySelector('#trSysGrid');if(!container)return;

  // Preserve tab state across re-renders using a DOM property
  if(!container._trTab)container._trTab='dependencies';
  var activeTab=container._trTab;

  // Build tab strip (once only, persists on re-render)
  var tabStrip=container.querySelector('.trsys-tabs');
  if(!tabStrip){
    tabStrip=document.createElement('div');
    tabStrip.className='trsys-tabs';
    var tabDefs=[
      {id:'dependencies',label:'Dependencies'},
      {id:'selected-use-case',label:'Selected use case'},
      {id:'what-may-constrain',label:'What may constrain'}
    ];
    tabDefs.forEach(function(td){
      var btn=document.createElement('button');
      btn.className='trsys-tab-btn';
      btn.setAttribute('data-tabid',td.id);
      btn.textContent=td.label;
      btn.addEventListener('click',function(){
        container._trTab=td.id;
        renderTransformationSystem(sec);
      });
      tabStrip.appendChild(btn);
    });
    container.appendChild(tabStrip);
  }
  tabStrip.querySelectorAll('.trsys-tab-btn').forEach(function(b){
    b.classList.toggle('active',b.getAttribute('data-tabid')===activeTab);
  });

  // Get or create SVG render area (below the tab strip)
  var svgArea=container.querySelector('.trsys-svg-area');
  if(!svgArea){
    svgArea=document.createElement('div');
    svgArea.className='trsys-svg-area';
    container.appendChild(svgArea);
  }
  svgArea.innerHTML='';

  var NS='http://www.w3.org/2000/svg';
  var W=860,H=540;
  var isDark=document.documentElement.getAttribute('data-theme')==='dark';
  var blockBg=isDark?'rgba(18,14,38,0.9)':'rgba(255,255,255,0.96)';
  var edgeC='rgba(161,0,255,0.22)';
  var textM=isDark?'rgba(237,232,247,0.48)':'rgba(21,24,28,0.44)';
  var lay={
    'risk-portfolio':          {x:278,y:10, w:304,h:74},
    'work-decisions-controls': {x:36, y:154,w:258,h:86},
    'org-roles-adoption':      {x:566,y:154,w:258,h:86},
    'data-knowledge-evidence': {x:36, y:308,w:258,h:86},
    'ai-automation-platforms': {x:566,y:308,w:258,h:86},
    'business-risk-tech':      {x:118,y:460,w:624,h:54},
    'governance-security':     {x:8,  y:144,w:22, h:276,rail:true},
    'value-cost-performance':  {x:830,y:144,w:22, h:276,rail:true}
  };
  var edges=[
    {x1:430,y1:84, x2:165,y2:154},
    {x1:430,y1:84, x2:695,y2:154},
    {x1:165,y1:240,x2:165,y2:308},
    {x1:695,y1:240,x2:695,y2:308},
    {x1:294,y1:197,x2:566,y2:197},
    {x1:294,y1:351,x2:566,y2:351},
    {x1:165,y1:394,x2:240,y2:460},
    {x1:695,y1:394,x2:620,y2:460}
  ];
  function mk(tag,attrs){
    var e=document.createElementNS(NS,tag);
    for(var k in attrs)e.setAttribute(k,attrs[k]);
    return e;
  }

  // Compute highlighted blocks based on active tab
  var pathBlocks={};
  var gapBlocks={};
  var proofId=(typeof store!=='undefined')?store.getState().proofCandidateId:null;
  proofId=proofId||(CLIENT_STATE&&CLIENT_STATE.proofCapabilityId);

  if(activeTab==='selected-use-case'&&proofId){
    var probCap=(typeof getCapabilityById==='function')?getCapabilityById(proofId):null;
    if(probCap){
      (probCap.opps||[]).forEach(function(oid){
        var opp=typeof AI_OPPORTUNITIES!=='undefined'&&AI_OPPORTUNITIES.find(function(x){return x.id===oid;});
        if(opp)(opp.blockIds||[]).forEach(function(bid){pathBlocks[bid]=true;});
      });
    }
    var proofUC=(typeof USE_CASES!=='undefined')?USE_CASES.find(function(u){return u.id===proofId;}):null;
    if(proofUC)(proofUC.blockIds||[]).forEach(function(bid){pathBlocks[bid]=true;});
  }

  if(activeTab==='what-may-constrain'&&typeof selectTransformationGaps!=='undefined'&&typeof store!=='undefined'){
    var gaps=selectTransformationGaps(store.getState());
    gaps.forEach(function(g){gapBlocks[g.blockId]=true;});
  }

  var hasPath=Object.keys(pathBlocks).length>0;
  var hasGaps=Object.keys(gapBlocks).length>0;

  // Contextual banner for active tab
  if(activeTab==='selected-use-case'&&proofId){
    var capName=proofId;
    var probCapObj=(typeof getCapabilityById==='function')?getCapabilityById(proofId):null;
    if(probCapObj){capName=probCapObj.name;}
    else{
      var ucObjBnr=(typeof USE_CASES!=='undefined')?USE_CASES.find(function(u){return u.id===proofId;}):null;
      if(ucObjBnr)capName=ucObjBnr.name;
    }
    var banner=document.createElement('div');
    banner.className='trsys-path-banner';
    banner.innerHTML='<i class="ti ti-route"></i> Showing required blocks for: <strong>'+capName+'</strong>'
      +'<button class="trsys-path-clear" onclick="if(typeof store!==\'undefined\')store.dispatch({type:\'SET_PROOF_CANDIDATE\',payload:null});var s=document.getElementById(\'transformation-system\');if(s){rendered.delete(getSlideIndex(\'transformation-system\'));renderSection(s);}"><i class="ti ti-x"></i> Clear</button>';
    svgArea.appendChild(banner);
  }

  if(activeTab==='what-may-constrain'){
    var gapBanner=document.createElement('div');
    gapBanner.className='trsys-gap-banner';
    gapBanner.innerHTML=hasGaps
      ?'<i class="ti ti-alert-triangle"></i> Blocks with potential gaps highlighted. Based on Quick Pulse answers. <span class="status-badge status-illustrative" style="margin-left:6px">SUBJECT TO VALIDATION</span>'
      :'<i class="ti ti-info-circle"></i> Complete the Quick Pulse on the maturity screen (M1) to see gap analysis.';
    svgArea.appendChild(gapBanner);
  }

  var svg=mk('svg',{viewBox:'0 0 '+W+' '+H,width:'100%',height:'100%',xmlns:NS,role:'img','aria-label':'AI Risk Transformation System map'});
  svgArea.appendChild(svg);
  var defs=mk('defs',{});
  var mrk=mk('marker',{id:'tss-arr',markerWidth:'7',markerHeight:'5',refX:'6',refY:'2.5',orient:'auto'});
  mrk.appendChild(mk('path',{d:'M0,0 L7,2.5 L0,5 Z',fill:edgeC}));
  defs.appendChild(mrk);
  svg.appendChild(defs);
  edges.forEach(function(e){
    var horiz=Math.abs(e.y1-e.y2)<8;
    var my=(e.y1+e.y2)/2;
    var d=horiz?('M'+e.x1+' '+e.y1+' L'+e.x2+' '+e.y2):
      ('M'+e.x1+' '+e.y1+' C'+e.x1+' '+my+' '+e.x2+' '+my+' '+e.x2+' '+e.y2);
    svg.appendChild(mk('path',{d:d,stroke:edgeC,'stroke-width':'1.5',fill:'none','stroke-dasharray':'5,3','marker-end':'url(#tss-arr)'}));
  });

  TRANSFORMATION_BLOCKS.forEach(function(b){
    var L=lay[b.id];if(!L)return;
    var g=mk('g',{cursor:'pointer','aria-label':b.name,'data-blockid':b.id});

    // Tab-aware dimming
    if(activeTab==='selected-use-case'&&hasPath&&!pathBlocks[b.id]&&!L.rail){
      g.setAttribute('opacity','0.28');
    }

    g.addEventListener('click',function(){openBlockDrawer(b.id);});
    g.addEventListener('mouseenter',function(){
      var r=g.querySelector('rect');
      if(r)r.setAttribute('stroke-opacity','0.85');
    });
    g.addEventListener('mouseleave',function(){
      var r=g.querySelector('rect');
      if(r)r.setAttribute('stroke-opacity',activeTab==='what-may-constrain'&&gapBlocks[b.id]?'0.9':'0.5');
    });

    var strokeColor=b.color;
    var strokeWidth=L.rail?'1':'1.5';
    var strokeOpacity='0.5';

    // Amber highlight for constraint blocks
    if(activeTab==='what-may-constrain'&&gapBlocks[b.id]&&!L.rail){
      strokeColor='#B46A00';
      strokeWidth='2.5';
      strokeOpacity='0.9';
    }

    var rect=mk('rect',{x:L.x,y:L.y,width:L.w,height:L.h,rx:'8',fill:blockBg,stroke:strokeColor,'stroke-width':strokeWidth,'stroke-opacity':strokeOpacity});
    g.appendChild(rect);
    if(L.rail){
      rect.setAttribute('fill',b.color);rect.setAttribute('fill-opacity','0.13');
      var cx=L.x+L.w/2,cy=L.y+L.h/2;
      var rt=mk('text',{x:cx,y:cy,transform:'rotate(-90,'+cx+','+cy+')','text-anchor':'middle','font-size':'9','font-family':'Inter,sans-serif','font-weight':'700','fill':b.color,'letter-spacing':'0.8'});
      rt.textContent=b.name.toUpperCase().split(/[,\s]+/).slice(0,2).join(' ');
      g.appendChild(rt);
    } else if(b.position==='bridge'){
      var bt=mk('text',{x:L.x+L.w/2,y:L.y+19,'text-anchor':'middle','font-size':'11','font-family':'Inter,sans-serif','font-weight':'600','fill':b.color});
      bt.textContent=b.name;g.appendChild(bt);
      var bq=mk('text',{x:L.x+L.w/2,y:L.y+35,'text-anchor':'middle','font-size':'9.5','font-family':'Inter,sans-serif',fill:textM});
      bq.textContent=(b.executiveQuestion||'').slice(0,90);g.appendChild(bq);
    } else {
      var words=b.name.split(' '),half=Math.ceil(words.length/2);
      var nt=mk('text',{x:L.x+L.w/2,y:L.y+17,'text-anchor':'middle','font-size':'10.5','font-family':'Inter,sans-serif','font-weight':'600','fill':b.color});
      var ts1=mk('tspan',{x:L.x+L.w/2,dy:'0'});ts1.textContent=words.slice(0,half).join(' ');nt.appendChild(ts1);
      if(half<words.length){var ts2=mk('tspan',{x:L.x+L.w/2,dy:'13'});ts2.textContent=words.slice(half).join(' ');nt.appendChild(ts2);}
      g.appendChild(nt);
      var q=b.executiveQuestion||'',qy=(half<words.length)?L.y+44:L.y+32,maxCh=Math.floor((L.w-16)/5.5),qlines=[];
      var qr=q;
      while(qr.length>0&&qlines.length<2){var cut=qr.length<=maxCh?qr.length:qr.lastIndexOf(' ',maxCh);if(cut<=0)cut=maxCh;qlines.push(qr.slice(0,cut));qr=qr.slice(cut).trim();}
      qlines.forEach(function(line,li){
        var qt=mk('text',{x:L.x+L.w/2,y:qy+li*12,'text-anchor':'middle','font-size':'9','font-family':'Inter,sans-serif',fill:textM});
        qt.textContent=(li===1&&qr.length>0)?line.slice(0,-3)+'...':line;g.appendChild(qt);
      });
      g.appendChild(mk('rect',{x:L.x+10,y:L.y+L.h-5,width:L.w-20,height:'3',rx:'1.5',fill:b.color,'fill-opacity':'0.42'}));
    }
    svg.appendChild(g);
  });
}
// AI TASK ROUTER (Screen 02)
function renderAITaskRouter(sec){
  var container=sec.querySelector('#aiLandscapeGrid');if(!container)return;
  container.innerHTML='';

  var STATIONS=[
    {id:'rules-workflow',name:'Rules and workflow',
     bestFit:'Deterministic routing, threshold checks, conditional logic',
     readiness:'TEST NOW',readinessCls:'ready-test',
     desc:'Deterministic routing and rule execution. No inference cost. Transparent and auditable.',
     poorFit:'Open-ended language tasks, edge-case variation requiring human judgement',
     controlProfile:'Rule completeness review, test coverage, exception monitoring',
     evidenceNeeded:'Rule inventory, exception rate, test pass rate',
     costDrivers:'Design and maintenance; compute cost only at runtime',
     color:'#0F8A62'},
    {id:'rpa-orchestration',name:'RPA and orchestration',
     bestFit:'Repeatable cross-system data movement and integration',
     readiness:'FOUNDATION FIRST',readinessCls:'ready-foundation',
     desc:'Repeatable cross-system data movement. Compute only.',
     poorFit:'Unstructured input, frequent UI changes, high exception rates',
     controlProfile:'Process monitoring, failure alerting, fallback paths',
     evidenceNeeded:'Error rate, throughput, downtime frequency',
     costDrivers:'Licensing, maintenance, infrastructure',
     color:'#0E7490'},
    {id:'analytics-ml',name:'Analytics and ML',
     bestFit:'Prediction, scoring, anomaly detection, pattern recognition',
     readiness:'TEST NOW',readinessCls:'ready-test',
     desc:'Prediction and scoring. Inference cost scales with volume.',
     poorFit:'Real-time natural language, novel reasoning requiring explanation',
     controlProfile:'Model validation, drift monitoring, outcome audit',
     evidenceNeeded:'Precision, recall, drift frequency, audit trail',
     costDrivers:'Training, inference at scale, monitoring',
     color:'#B46A00'},
    {id:'genai-copilot',name:'GenAI copilot',
     bestFit:'Search, summarise, draft, and explain from documents',
     readiness:'NEEDS FURTHER VALIDATION',readinessCls:'ready-validate',
     desc:'Search, summarise, draft, explain. Token cost per call.',
     poorFit:'Deterministic numerical outputs, regulated decisions without human review',
     controlProfile:'Output review before use, hallucination testing, prompt governance',
     evidenceNeeded:'Accuracy rate, review rate, user adoption, output quality',
     costDrivers:'Token cost per call, human review time',
     color:'#A100FF'},
    {id:'agents',name:'Agent',
     bestFit:'Multi-step coordination across tools, systems, or data sources',
     readiness:'NOT YET ASSESSED',readinessCls:'ready-not-assessed',
     desc:'Plan, coordinate, act across tools. Elevated cost and uncertainty.',
     poorFit:'Single-step tasks, regulated workflows without human checkpoints',
     controlProfile:'Scope boundary controls, action approval gates, audit log',
     evidenceNeeded:'Task completion rate, error rate, human intervention frequency',
     costDrivers:'Multiple model calls, tool invocations, retry loops',
     color:'#FF50C8'}
  ];

  var TASKS=[
    {id:'reconcile',label:'Reconcile a known rule',stationId:'rules-workflow'},
    {id:'detect',label:'Detect an unusual pattern',stationId:'analytics-ml'},
    {id:'draft',label:'Draft from documents',stationId:'genai-copilot'},
    {id:'coordinate',label:'Coordinate a multi-step case',stationId:'agents'}
  ];

  var activeTask=null,activeStation=null;

  // Task pills
  var pillsDiv=document.createElement('div');
  pillsDiv.className='atr-pills';
  TASKS.forEach(function(task){
    var pill=document.createElement('button');
    pill.className='atr-pill';
    pill.setAttribute('data-taskid',task.id);
    pill.textContent=task.label;
    pill.addEventListener('click',function(){
      if(activeTask===task.id){activeTask=null;activeStation=null;}
      else{activeTask=task.id;activeStation=task.stationId;}
      updateRouter();
    });
    pillsDiv.appendChild(pill);
  });
  container.appendChild(pillsDiv);

  // Stations row
  var stationsDiv=document.createElement('div');
  stationsDiv.className='atr-stations';
  STATIONS.forEach(function(station){
    var card=document.createElement('div');
    card.className='atr-station-card';
    card.setAttribute('data-stationid',station.id);
    card.style.setProperty('--sc',station.color);
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.innerHTML=
      '<div class="atr-station-name">'+station.name+'</div>'
      +'<div class="atr-station-fit">'+station.bestFit+'</div>'
      +'<div class="atr-station-badge atr-'+station.readinessCls+'">'+station.readiness+'</div>';
    card.addEventListener('click',function(){
      if(typeof store!=='undefined')store.dispatch({type:'SELECT_SOLUTION',payload:station.id});
      openATRDrawer(station);
    });
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')card.click();});
    stationsDiv.appendChild(card);
  });
  container.appendChild(stationsDiv);

  // Secondary selection badge
  var badgeDiv=document.createElement('div');
  badgeDiv.id='atr-selection-badge';
  badgeDiv.className='atr-selection-badge';
  badgeDiv.style.display='none';
  container.appendChild(badgeDiv);

  // Footer principle
  var footer=document.createElement('div');
  footer.className='ail-landscape-footer';
  footer.innerHTML='<span class="ail-footer-principle">Use the least complex technology that can own the work safely and economically.</span>';
  container.appendChild(footer);

  function updateRouter(){
    pillsDiv.querySelectorAll('.atr-pill').forEach(function(p){
      p.classList.toggle('active',p.getAttribute('data-taskid')===activeTask);
    });
    stationsDiv.querySelectorAll('.atr-station-card').forEach(function(c){
      c.classList.toggle('active',!!activeStation&&c.getAttribute('data-stationid')===activeStation);
    });
    if(activeStation){
      var found=null;
      for(var si=0;si<STATIONS.length;si++){if(STATIONS[si].id===activeStation){found=STATIONS[si];break;}}
      badgeDiv.style.display='';
      badgeDiv.innerHTML='<span class="atr-badge-label">Selected pattern: <strong>'+(found?found.name:activeStation)+'</strong></span>';
    } else {
      badgeDiv.style.display='none';
    }
  }

  function openATRDrawer(station){
    var tabs=[
      {id:'bestfit',label:'Best fit',html:'<div class="drawer-section"><div class="dr-q">'+station.name+'</div><div class="dr-h">Best fit for</div><div class="dr-body">'+station.bestFit+'</div><div class="dr-h" style="margin-top:10px">Description</div><div class="dr-body">'+station.desc+'</div></div>'},
      {id:'poorfit',label:'Poor fit',html:'<div class="drawer-section"><div class="dr-h">Poor fit for</div><div class="dr-body">'+station.poorFit+'</div></div>'},
      {id:'control',label:'Control profile',html:'<div class="drawer-section"><div class="dr-h">Control considerations</div><div class="dr-body">'+station.controlProfile+'</div></div>'},
      {id:'evidence',label:'Evidence needed',html:'<div class="drawer-section"><div class="dr-h">Evidence to track</div><div class="dr-body">'+station.evidenceNeeded+'</div></div>'},
      {id:'cost',label:'Cost drivers',html:'<div class="drawer-section"><div class="dr-h">Illustrative cost drivers</div><div class="dr-body">'+station.costDrivers+'</div><div class="dr-note">All cost figures are illustrative. Validate with actual usage data before presenting.</div></div>'}
    ];
    openDrawer(station.name,tabs,'bestfit');
  }
}

// PRESSURE-TO-PROOF BRIDGE
function renderPressureToProof(sec){
  var container=sec.querySelector('#ptp-visual');if(!container)return;
  container.innerHTML='';

  var state=(typeof store!=='undefined')?store.getState():{selectedPressures:[],selectedCapabilities:[],proofCandidateId:null};
  var selectedPressures=state.selectedPressures||[];

  var PRESSURE_LABELS={
    'reg-vol':'Regulatory volume and change',
    'cost-cap':'Cost and capacity pressure',
    'frag-data':'Fragmented risk and control data',
    'slow-dec':'Slow decisions and reporting',
    'ctrl-ev':'Control effectiveness and evidence',
    'ai-gov':'AI governance and model risk'
  };

  var PTP_STATIONS=[
    {id:'pressure',label:'Pressure',icon:'ti-alert-triangle',targetId:'setting-scene'},
    {id:'capability',label:'Capability',icon:'ti-sparkles',targetId:'capability-hotspots'},
    {id:'blocks',label:'Transformation blocks',icon:'ti-layout-grid',targetId:'transformation-system'},
    {id:'proof',label:'Proof candidate',icon:'ti-flask',targetId:'exec-shortlist'}
  ];

  var hasSelection=selectedPressures.length>0;
  var displayPressure=hasSelection?(PRESSURE_LABELS[selectedPressures[0]]||selectedPressures[0]):'Evidence burden';

  var wrap=document.createElement('div');
  wrap.className='ptp-stations';

  PTP_STATIONS.forEach(function(station,idx){
    var stDiv=document.createElement('div');
    stDiv.className='ptp-station';
    stDiv.setAttribute('role','button');
    stDiv.setAttribute('tabindex','0');

    var content='';
    if(station.id==='pressure'){
      content='<div class="ptp-station-value">'+displayPressure+'</div>'
        +(!hasSelection?'<div class="ptp-choose-hint">Illustrative example</div>':'');
    } else if(station.id==='capability'){
      var selCaps=state.selectedCapabilities||[];
      content=selCaps.length
        ?'<div class="ptp-station-value">'+selCaps.length+' capability'+(selCaps.length!==1?'s':'')+' selected</div>'
        :'<div class="ptp-station-value ptp-empty">Not yet selected</div>';
    } else if(station.id==='blocks'){
      content='<div class="ptp-station-value">Data and knowledge</div>'
        +(!hasSelection?'<div class="ptp-choose-hint">Illustrative example</div>':'');
    } else if(station.id==='proof'){
      var cid=state.proofCandidateId;
      content=cid
        ?'<div class="ptp-station-value">'+cid+'</div>'
        :'<div class="ptp-station-value ptp-empty">Not yet set</div>';
    }

    stDiv.innerHTML=
      '<div class="ptp-station-icon"><i class="ti '+station.icon+'"></i></div>'
      +'<div class="ptp-station-label">'+station.label+'</div>'
      +'<div class="ptp-station-content">'+content+'</div>';

    stDiv.addEventListener('click',function(){if(typeof goToId==='function')goToId(station.targetId);});
    stDiv.addEventListener('keydown',function(e){if(e.key==='Enter'&&typeof goToId==='function')goToId(station.targetId);});
    wrap.appendChild(stDiv);

    if(idx<PTP_STATIONS.length-1){
      var arrow=document.createElement('div');
      arrow.className='ptp-connector';
      arrow.innerHTML='<i class="ti ti-chevron-right"></i>';
      wrap.appendChild(arrow);
    }
  });

  container.appendChild(wrap);

  if(!hasSelection){
    var prompt=document.createElement('div');
    prompt.className='ptp-prompt';
    prompt.innerHTML='<i class="ti ti-info-circle"></i> Select a pressure on slide 01 to personalise this view. Currently showing an illustrative example. <span class="status-badge status-illustrative" style="margin-left:6px">ILLUSTRATIVE</span>';
    container.appendChild(prompt);
  }
}
// ── SOLUTION DRAWER ──
function openSolutionDrawer(solId){
  var s=(SOLUTIONS||[]).find(function(x){return x.id===solId;});if(!s)return;
  var cluster=(PORTFOLIO_CLUSTERS||[]).find(function(c){return c.id===s.portfolioClusterId;});
  var ev=s.evidenceFlags||{};
  var evItems=['concept','prototype','asset','demo'].map(function(k){
    var val=ev[k];
    return '<div class="dr-item"><span class="sol-ev-dot '+(val===true?'ev-confirmed':val===false?'ev-absent':'ev-unknown')+'"></span>'
      +k.charAt(0).toUpperCase()+k.slice(1)+': '+(val===true?'confirmed':val===false?'not found':'not yet inspected')+'</div>';
  }).join('');

  var prov=s.mappingProvenance||{};
  var tabs=[
    {id:'overview',label:'Overview',html:
      '<div class="drawer-section">'
      +'<div class="dr-q">'+s.displayName+'</div>'
      +'<div class="dr-h">Source reference</div>'
      +'<div class="dr-body">Source '+s.sourceNumber+': '+s.sourceName+'</div>'
      +(cluster?'<div class="dr-h">Portfolio cluster</div><div class="dr-body" style="color:'+(cluster.color||'inherit')+'">'+cluster.name+'</div>':'')
      +'<div class="dr-h">Technology pattern</div>'
      +'<div class="dr-body">'+(s.technologyPatternId||'Not yet mapped').replace(/-/g,' ')+'</div>'
      +'</div>'},
    {id:'evidence',label:'Evidence',html:
      '<div class="drawer-section">'
      +'<div class="dr-h">Evidence flags (from source inspection)</div>'
      +evItems
      +'<div class="dr-note">Flags are based on direct inspection of source slides. Null = not yet inspected.</div>'
      +'</div>'},
    {id:'sharing',label:'Sharing status',html:
      '<div class="drawer-section">'
      +'<div class="dr-h">Sharing status</div>'
      +'<div class="dr-body">'+s.sharingStatus.replace(/-/g,' ')+'</div>'
      +(s.legalReview!==null?'<div class="dr-h">Legal review</div><div class="dr-body">'+(s.legalReview?'Complete':'In progress or not started')+'</div>':'')
      +'<div class="dr-note">Sharing status to be confirmed before client distribution.</div>'
      +'</div>'},
    {id:'provenance',label:'Provenance',html:
      '<div class="drawer-section">'
      +'<div class="dr-h">Mapping provenance</div>'
      +Object.keys(prov).map(function(k){return '<div class="dr-item"><span class="dr-muted">'+k+':</span> '+prov[k].replace(/-/g,' ')+'</div>';}).join('')
      +'<div class="dr-note">working-hypothesis = not yet validated with an SME or source. expert-validated = reviewed by a practice lead.</div>'
      +'</div>'}
  ];
  openDrawer(s.displayName,tabs,'overview');
}

// ── EVIDENCE-TO-DESIGN FLOW (Screen 05) ──
function renderEvidenceFlow(sec){
  var container=sec.querySelector('#evidenceFlowDiagram');if(!container)return;
  container.innerHTML='';

  var STAGES=[
    {id:'evidence',label:'Evidence assembly',color:'#0F8A62',
     nodes:['Policies and procedures','Process maps','Control inventory','Interview transcripts','Regulatory obligations','AI-assisted ingestion']},
    {id:'diagnose',label:'Diagnostic questions',color:'#0E7490',
     nodes:['Failure mode mapping','Maturity scoring','Decision-right gaps','Control design gaps','Capability ownership gaps']},
    {id:'design',label:'Target-state design',color:'#A100FF',
     nodes:['Design principles','Decision rights','Technology pattern','Human-AI interface','Control embedding','Evidence schema']},
    {id:'intervene',label:'Intervention pathway',color:'#B46A00',
     nodes:['No-regret moves','Lighthouse use case','Industrialise','Scale across function']},
    {id:'gate',label:'Gate evidence',color:'#0F8A62',
     nodes:['Business KPIs','Operational metrics','Control effectiveness','Adoption measures','Regulatory defensibility']}
  ];

  // Connections: which stage-node pairs connect (stage index, node index pairs)
  var LINKS=[
    {from:[0,0],to:[1,0]},{from:[0,1],to:[1,0]},{from:[0,2],to:[1,1]},{from:[0,3],to:[1,2]},
    {from:[0,4],to:[1,3]},{from:[0,5],to:[1,4]},
    {from:[1,0],to:[2,0]},{from:[1,1],to:[2,1]},{from:[1,2],to:[2,2]},{from:[1,3],to:[2,3]},
    {from:[1,4],to:[2,4]},
    {from:[2,0],to:[3,0]},{from:[2,1],to:[3,0]},{from:[2,2],to:[3,1]},{from:[2,3],to:[3,1]},
    {from:[2,4],to:[3,2]},{from:[2,5],to:[3,2]},
    {from:[3,0],to:[4,0]},{from:[3,1],to:[4,1]},{from:[3,2],to:[4,2]},{from:[3,3],to:[4,3]}
  ];

  if(typeof d3==='undefined'){
    // Fallback: static HTML
    container.innerHTML='<div class="arch-stack">'+STAGES.map(function(s){
      return '<div class="arch-layer"><div class="arch-layer-name">'+s.label+'</div><div class="arch-layer-chips">'+s.nodes.map(function(n){return '<span class="arch-chip">'+n+'</span>';}).join('')+'</div></div>';
    }).join('<div class="arch-conn-v">down</div>')+'</div>';
    return;
  }

  var W=container.clientWidth||900,COL=Math.floor(W/STAGES.length),NODE_H=24,NODE_W=COL-20,STAGE_PAD=12;
  var stageHeights=STAGES.map(function(s){return s.nodes.length*(NODE_H+4)+STAGE_PAD*2+28;});
  var H=Math.max.apply(null,stageHeights);
  var svg=d3.select(container).append('svg').attr('viewBox','0 0 '+W+' '+H).attr('width','100%').attr('height',H)
    .attr('role','img').attr('aria-label','Evidence to design pipeline flow');

  // Compute node centre positions
  var nodePos=[];
  STAGES.forEach(function(s,si){
    nodePos.push([]);
    s.nodes.forEach(function(n,ni){
      var x=si*COL+10;
      var y=STAGE_PAD+28+ni*(NODE_H+4)+NODE_H/2;
      nodePos[si].push({x:x+NODE_W/2,y:y,x0:x,y0:y-NODE_H/2});
    });
  });

  // Draw links first (behind nodes)
  var linkLayer=svg.append('g').attr('class','ef-links');
  LINKS.forEach(function(lk){
    var from=nodePos[lk.from[0]][lk.from[1]];
    var to=nodePos[lk.to[0]][lk.to[1]];
    if(!from||!to)return;
    var x1=lk.from[0]*COL+10+NODE_W,y1=from.y;
    var x2=lk.to[0]*COL+10,y2=to.y;
    var mx=(x1+x2)/2;
    linkLayer.append('path')
      .attr('d','M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2)
      .attr('fill','none').attr('stroke','rgba(255,255,255,0.06)').attr('stroke-width',1.5);
  });

  // Draw stages and nodes
  STAGES.forEach(function(s,si){
    var x=si*COL;
    // Stage header
    svg.append('text')
      .attr('x',x+10).attr('y',18)
      .attr('font-size','8.5').attr('font-family','JetBrains Mono, monospace').attr('font-weight','700')
      .attr('fill',s.color).attr('letter-spacing','0.06em').attr('text-transform','uppercase')
      .text(s.label.toUpperCase());
    // Column background
    svg.append('rect').attr('x',x+4).attr('y',22).attr('width',COL-8).attr('height',H-28)
      .attr('rx',6).attr('fill',s.color).attr('fill-opacity',0.04)
      .attr('stroke',s.color).attr('stroke-opacity',0.12).attr('stroke-width',1);

    s.nodes.forEach(function(n,ni){
      var pos=nodePos[si][ni];
      var g=svg.append('g').attr('class','ef-node').style('cursor','default');
      g.append('rect')
        .attr('x',pos.x0).attr('y',pos.y0)
        .attr('width',NODE_W).attr('height',NODE_H).attr('rx',4)
        .attr('fill',s.color).attr('fill-opacity',0.12)
        .attr('stroke',s.color).attr('stroke-opacity',0.3).attr('stroke-width',1);
      // Word wrap text into 2 lines max
      var words=n.split(' '),line1=[],line2=[],limit=Math.floor(NODE_W/5.5);
      var acc='';
      words.forEach(function(w){
        if((acc+' '+w).trim().length<=limit){acc=(acc+' '+w).trim();}
        else if(!line1.length){line1.push(acc);acc=w;}
        else{line2.push(w);}
      });
      if(acc)(!line1.length?line1:line2).push(acc);
      var totalLines=line2.length?2:1;
      var textY=pos.y-(totalLines-1)*5.5;
      [line1.join(' '),line2.join(' ')].forEach(function(ln,li){
        if(!ln)return;
        g.append('text')
          .attr('x',pos.x).attr('y',textY+li*11)
          .attr('text-anchor','middle').attr('font-size','8.5').attr('font-family','Inter, sans-serif')
          .attr('fill',s.color).attr('fill-opacity',0.9)
          .text(ln);
      });
    });

    // Stage separator line
    if(si<STAGES.length-1){
      svg.append('line')
        .attr('x1',x+COL-4).attr('y1',22).attr('x2',x+COL-4).attr('y2',H-6)
        .attr('stroke','rgba(255,255,255,0.07)').attr('stroke-width',1);
    }
  });
}

// ── CAPABILITY HOTSPOTS (Screen 7) ──
function renderCapabilityHotspots(sec){
  var area=sec.querySelector('#capHotspotArea');if(!area)return;
  area.innerHTML='<div class="cap-layout"><div class="cap-main"><div class="cap-categories" id="capCatList">'+RISK_CATEGORIES.map(function(cat){
    var selCount=CLIENT_STATE.selectedCapabilityIds.filter(function(id){return cat.caps.indexOf(id)>-1;}).length;
    return '<button class="cap-cat-btn" data-catid="'+cat.id+'" onclick="toggleCatPanel(\''+cat.id+'\')" style="border-color:'+(selCount?cat.color:'var(--border-1)')+'"><i class="ti ti-'+cat.icon+'" style="color:'+cat.color+'"></i><span class="cap-cat-btn-name">'+cat.name+'</span><span class="cap-cat-btn-count">'+cat.caps.length+(selCount?' · '+selCount+' selected':'')+'</span><i class="ti ti-chevron-right cap-cat-chev" id="catChev-'+cat.id+'"></i></button>';
  }).join('')+'</div><div class="cap-cat-panel" id="capCatPanel" style="display:none"></div></div><div class="cap-sidebar" id="capSidebar"><div class="cap-sel-tray"><div class="cap-sel-tray-h"><span>Selected capabilities</span><span class="cap-sel-badge" id="capSelCount">0 / 5</span></div><div class="cap-sel-chips" id="capSelChips"><div class="cap-empty-msg">Select up to 5 capabilities to build the shortlist.</div></div></div></div></div>';
  updateCapSidebar();
}

function toggleCatPanel(catId){
  var cat=getCategoryById(catId);if(!cat)return;
  var panel=document.getElementById('capCatPanel');
  var btn=document.querySelector('.cap-cat-btn[data-catid="'+catId+'"]');
  var chev=document.getElementById('catChev-'+catId);
  var already=panel.dataset.open===catId&&panel.style.display!=='none';
  // Close
  panel.style.display='none';panel.dataset.open='';
  document.querySelectorAll('.cap-cat-btn').forEach(function(b){b.classList.remove('active');});
  if(already)return;
  // Open new
  panel.style.display='';panel.dataset.open=catId;
  if(btn)btn.classList.add('active');
  var caps=RISK_CAPABILITIES.filter(function(c){return c.cat===catId;});
  panel.innerHTML='<div class="cap-panel-hdr" style="border-color:'+cat.color+'"><i class="ti ti-'+cat.icon+'" style="color:'+cat.color+'"></i> '+cat.name+'</div><div class="cap-panel-items">'+caps.map(function(c){
    var sel=CLIENT_STATE.selectedCapabilityIds.indexOf(c.id)>-1;
    return '<div class="cap-panel-item'+(sel?' selected':'')+'\" data-capid="'+c.id+'"><div class="cap-panel-item-main"><button class="cap-item-chk" onclick="toggleSelectCap(\''+c.id+'\')" aria-label="'+(sel?'Deselect':'Select')+' '+c.name+'">'+(sel?'<i class="ti ti-check"></i>':'')+'</button><span class="cap-panel-item-name">'+c.name+'</span><button class="cap-item-detail" onclick="openCapabilityDrawer(\''+c.id+'\')" aria-label="Details for '+c.name+'"><i class="ti ti-info-circle"></i></button></div><div class="cap-panel-item-outcome">'+c.outcome+'</div></div>';
  }).join('')+'</div>';
}

function toggleSelectCap(capId){
  toggleCapability(capId);
  // Re-render the current panel item
  var items=document.querySelectorAll('.cap-panel-item');
  items.forEach(function(el){
    if(el.dataset.capid===capId){var sel=CLIENT_STATE.selectedCapabilityIds.indexOf(capId)>-1;el.classList.toggle('selected',sel);var chk=el.querySelector('.cap-item-chk');if(chk)chk.innerHTML=sel?'<i class="ti ti-check"></i>':'';}
  });
  // Re-render category button count
  updateCapCatCounts();
  updateCapSidebar();
}

function updateCapCatCounts(){
  RISK_CATEGORIES.forEach(function(cat){
    var selCount=CLIENT_STATE.selectedCapabilityIds.filter(function(id){return cat.caps.indexOf(id)>-1;}).length;
    var btn=document.querySelector('.cap-cat-btn[data-catid="'+cat.id+'"]');
    if(btn){var cntEl=btn.querySelector('.cap-cat-btn-count');if(cntEl)cntEl.textContent=cat.caps.length+(selCount?' · '+selCount+' selected':'');}
  });
}

function updateCapSidebar(){
  var chips=document.getElementById('capSelChips');
  var count=document.getElementById('capSelCount');
  var sel=CLIENT_STATE.selectedCapabilityIds;
  if(!chips)return;
  if(!sel.length){chips.innerHTML='<div class="cap-empty-msg">Select up to 5 capabilities.</div>';}
  else{chips.innerHTML=sel.map(function(id){var c=getCapabilityById(id);return c?'<div class="cap-sel-chip"><span>'+c.name+'</span><button class="cap-chip-rm" onclick="toggleSelectCap(\''+id+'\')" aria-label="Remove '+c.name+'">×</button></div>':'';}).join('');}
  if(count)count.textContent=sel.length+' / 5';
}

// ── ROLE BARS (Screen 8) ──
function renderRoleBars(sec){
  var tbl=sec.querySelector('#rolesTable');if(!tbl)return;
  var arch=CLIENT_STATE.archetype;
  tbl.innerHTML=ROLE_DATA.map(function(r,i){
    var share=arch==='A'?r.shareA:r.shareB;
    var split=arch==='A'?r.splitA:r.splitB;
    var detailHtml='';
    if(r.tasks&&r.tasks.length){
      detailHtml='<div class="role-detail">'
        +'<div class="role-detail-col"><div class="role-detail-hd">Work &amp; decisions</div>'
        +r.tasks.map(function(t){return '<div class="role-detail-item">'+t+'</div>';}).join('')
        +'</div>'
        +(r.workbench?'<div class="role-detail-col"><div class="role-detail-hd">Workbench</div><div class="role-detail-item">'+r.workbench+'</div></div>':'')
        +'</div>';
    }
    return '<div class="role-row" onclick="this.classList.toggle(\'open\')">'
      +'<span class="role-name">'+r.name+'</span>'
      +'<span class="role-share">'+share+'% of FTE</span>'
      +'<div class="role-splitbar">'
        +'<div class="rsb-seg rsb-cyan" style="width:'+split[0]+'%"></div>'
        +'<div class="rsb-seg rsb-purple" style="width:'+split[1]+'%"></div>'
        +'<div class="rsb-seg rsb-pink" style="width:'+split[2]+'%"></div>'
      +'</div>'
      +'<span class="role-expand-icon"><i class="ti ti-chevron-down"></i></span>'
      +detailHtml
    +'</div>';
  }).join('');
}

// ── OPPORTUNITY PORTFOLIO (Screen 9) ──
function renderOpportunityPortfolio(sec){
  var area=sec.querySelector('#oppPortfolioArea');if(!area)return;
  var selCaps=CLIENT_STATE.selectedCapabilityIds;
  var opps=selCaps.length?AI_OPPORTUNITIES.filter(function(o){return o.capIds&&o.capIds.some(function(c){return selCaps.indexOf(c)>-1;});}):AI_OPPORTUNITIES.slice(0,8);
  if(!opps.length){area.innerHTML='<div class="opp-empty">Select capabilities on the previous screen to populate the opportunity portfolio.</div>';return;}
  area.innerHTML='<div class="opp-cards">'+opps.map(function(o){
    var statusCls='status-'+o.status;
    return '<div class="opp-card"><div class="opp-card-top"><span class="status-badge '+statusCls+'">'+statusLabel(o.status)+'</span></div><div class="opp-card-name">'+o.name+'</div><div class="opp-card-caps">'+(o.capIds||[]).map(function(cid){var c=getCapabilityById(cid);return c?'<span class="opp-cap-pill">'+c.name+'</span>':'';}).join('')+'</div><button class="opp-card-detail" onclick="openOppDrawer(\''+o.id+'\')" aria-label="Details for '+o.name+'"><i class="ti ti-info-circle"></i></button></div>';
  }).join('')+'</div>';
}

function openOppDrawer(oppId){
  var opp=getOpportunityById(oppId);if(!opp)return;
  var ucs=USE_CASES.filter(function(u){return u.oppIds&&u.oppIds.indexOf(oppId)>-1;});
  var tabs=[
    {id:'what',label:'What it is',html:'<div class="drawer-section"><div class="dr-q">'+opp.name+'</div><div class="dr-h">Mapped capabilities</div>'+(opp.capIds||[]).map(function(c){var cap=getCapabilityById(c);return cap?'<div class="dr-item"><i class="ti ti-arrow-right dr-icon"></i>'+cap.name+'</div>':'';}).join('')+'</div>'},
    {id:'ucs',label:'Use cases',html:'<div class="drawer-section"><div class="dr-h">Accenture use cases for this opportunity</div>'+(ucs.length?ucs.map(function(u){return '<div class="dr-item"><span class="status-badge status-'+u.status+'">'+statusLabel(u.status)+'</span> '+u.name+'</div>';}).join(''):'<div class="dr-body dr-muted">No direct use case. Discuss scope in working session.</div>')+'</div>'}
  ];
  openDrawer(opp.name,tabs,'what');
}

// ── SHORTLIST (Screen 10) ──
function renderShortlist(sec){
  var grid=sec.querySelector('#shortlistGrid');if(!grid)return;
  grid.className='shortlist-grid';
  var sel=CLIENT_STATE.selectedCapabilityIds.slice(0,3);
  if(!sel.length){grid.innerHTML='<div class="shortlist-empty">Select capabilities on screen 7 to populate the shortlist.</div>';return;}
  var lens=CLIENT_STATE.lens;
  var lensLabels={cro:'CRO lens: risk and control quality',cfo:'CFO lens: cost and reporting efficiency',joint:'Joint view'};
  grid.innerHTML=sel.map(function(capId,i){
    var cap=getCapabilityById(capId);if(!cap)return '';
    var cat=getCategoryById(cap.cat);
    var isProof=CLIENT_STATE.proofCapabilityId===capId;
    var types=['Lighthouse proof','Enabling foundation','Next scale wave'];
    return '<div class="shortlist-card'+(isProof?' proof-selected':'')+'\" data-capid="'+capId+'"><div class="sl-type-label">'+types[i]||'Option '+(i+1)+'</div><div class="sl-cap-name">'+cap.name+'</div><div class="sl-cat-name">'+(cat?cat.name:'')+'</div><div class="sl-row"><div class="sl-lbl">Outcome</div><div class="sl-val">'+cap.outcome+'</div></div><div class="sl-row"><div class="sl-lbl">Evidence needed</div><div class="sl-val dr-muted">Validate with client data. Do not assume baseline.</div></div><div class="sl-row"><div class="sl-lbl">'+lensLabels[lens]+'</div><div class="sl-val dr-muted">Confirm with client before leading with this framing.</div></div><div class="sl-actions"><button class="sl-proof-btn'+(isProof?' active':'')+'\" onclick="setProofSelection(\''+capId+'\')">'+(isProof?'<i class="ti ti-check"></i> Proof candidate':'Set as proof candidate')+'</button><button class="sl-detail-btn" onclick="openCapabilityDrawer(\''+capId+'\')"><i class="ti ti-info-circle"></i></button></div></div>';
  }).join('');
}

function setProofSelection(capId){
  CLIENT_STATE.proofCapabilityId=capId;
  var sec=document.getElementById('exec-shortlist');
  if(sec)renderShortlist(sec);
  // Also update proof canvas if visible
  var pfSec=document.getElementById('proof-value-capture');
  if(pfSec&&rendered.has(getSlideIndex('proof-value-capture')))renderProofValueCapture(pfSec);
}

// ── PROOF & VALUE CAPTURE (Screen 12) ──
function renderProofValueCapture(sec){
  var capId=CLIENT_STATE.proofCapabilityId||CLIENT_STATE.selectedCapabilityIds[0];
  var cap=capId?getCapabilityById(capId):null;
  var nameEl=sec.querySelector('#proofCapName');
  if(nameEl)nameEl.textContent=cap?cap.name:'select a capability on screen 07';

  var waterfall=sec.querySelector('#valueWaterfall');
  if(!waterfall)return;

  if(typeof d3==='undefined'){
    // Fallback: simple text list
    var stages=['Baseline measurement','Configure and deploy','Run in controlled scope','Validate outputs','Measure outcomes','Gate review','Scale or pause'];
    waterfall.innerHTML=stages.map(function(s,i){return '<div class="wf-row"><div class="wf-label">'+(i+1)+'. '+s+'</div></div>';}).join('');
    return;
  }

  waterfall.innerHTML='';
  var W=waterfall.clientWidth||700,H=320;

  var LOOP=[
    {id:'baseline',label:'Baseline',sub:'Measure current state',color:'#0F8A62',lane:'data'},
    {id:'configure',label:'Configure',sub:'Design & parameter proof',color:'#0E7490',lane:'ai'},
    {id:'run',label:'Run',sub:'Execute in controlled scope',color:'#A100FF',lane:'ai'},
    {id:'validate',label:'Validate',sub:'Human review of outputs',color:'#B46A00',lane:'human'},
    {id:'measure',label:'Measure',sub:'Compare to baseline',color:'#0F8A62',lane:'data'},
    {id:'gate',label:'Gate',sub:'Go / expand / pause decision',color:'#0F8A62',lane:'human',isGate:true}
  ];

  var N=LOOP.length;
  var CX=W/2,CY=H/2,R=Math.min(CX,CY)-50;

  var svg=d3.select(waterfall).append('svg')
    .attr('viewBox','0 0 '+W+' '+H).attr('width','100%').attr('height',H)
    .attr('role','img').attr('aria-label','Proof and evidence loop');

  // Defs: arrowhead
  var defs=svg.append('defs');
  var mrk=defs.append('marker').attr('id','pf-arr').attr('markerWidth','7').attr('markerHeight','5')
    .attr('refX','6').attr('refY','2.5').attr('orient','auto');
  mrk.append('path').attr('d','M0,0 L7,2.5 L0,5 Z').attr('fill','rgba(255,255,255,0.3)');

  // Outer ring (guide track)
  svg.append('circle').attr('cx',CX).attr('cy',CY).attr('r',R)
    .attr('fill','none').attr('stroke','rgba(255,255,255,0.06)').attr('stroke-width',1.5)
    .attr('stroke-dasharray','4,4');

  // Arc connector arrows between nodes
  LOOP.forEach(function(_,i){
    var angle1=2*Math.PI*i/N-Math.PI/2;
    var angle2=2*Math.PI*((i+1)%N)/N-Math.PI/2;
    var r1=R-22;
    var x1=CX+r1*Math.cos(angle1),y1=CY+r1*Math.sin(angle1);
    var x2=CX+r1*Math.cos(angle2),y2=CY+r1*Math.sin(angle2);
    var midAngle=(angle1+angle2)/2;
    var cr=R+6;
    var mx=CX+cr*Math.cos(midAngle),my=CY+cr*Math.sin(midAngle);
    svg.append('path')
      .attr('d','M'+x1+','+y1+' Q'+mx+','+my+' '+x2+','+y2)
      .attr('fill','none').attr('stroke','rgba(255,255,255,0.22)').attr('stroke-width',1.5)
      .attr('marker-end','url(#pf-arr)');
  });

  // Centre label
  svg.append('text').attr('x',CX).attr('y',CY-8).attr('text-anchor','middle')
    .attr('font-size','9').attr('font-family','JetBrains Mono, monospace').attr('fill','rgba(255,255,255,0.35)')
    .attr('letter-spacing','0.08em').text('EVIDENCE');
  svg.append('text').attr('x',CX).attr('y',CY+6).attr('text-anchor','middle')
    .attr('font-size','9').attr('font-family','JetBrains Mono, monospace').attr('fill','rgba(255,255,255,0.35)')
    .attr('letter-spacing','0.08em').text('LOOP');

  // Nodes
  LOOP.forEach(function(node,i){
    var angle=2*Math.PI*i/N-Math.PI/2;
    var nx=CX+R*Math.cos(angle),ny=CY+R*Math.sin(angle);
    var g=svg.append('g').style('cursor','default');

    g.append('circle').attr('cx',nx).attr('cy',ny).attr('r',node.isGate?22:18)
      .attr('fill',node.isGate?'none':node.color).attr('fill-opacity',node.isGate?0:0.15)
      .attr('stroke',node.color).attr('stroke-width',node.isGate?2.5:1.5).attr('stroke-opacity',node.isGate?0.95:0.8);

    g.append('text').attr('x',nx).attr('y',ny+1).attr('text-anchor','middle')
      .attr('dominant-baseline','middle').attr('font-size','10').attr('font-weight','700')
      .attr('font-family','Space Grotesk, sans-serif').attr('fill',node.color)
      .text(node.label);

    // Sub-label outside ring
    var subR=R+38;
    var sx=CX+subR*Math.cos(angle),sy=CY+subR*Math.sin(angle);
    var words=node.sub.split(' ');
    var half=Math.ceil(words.length/2);
    g.append('text').attr('x',sx).attr('y',sy-5).attr('text-anchor','middle')
      .attr('font-size','8').attr('font-family','Inter, sans-serif').attr('fill','rgba(255,255,255,0.55)')
      .text(words.slice(0,half).join(' '));
    if(half<words.length){
      g.append('text').attr('x',sx).attr('y',sy+6).attr('text-anchor','middle')
        .attr('font-size','8').attr('font-family','Inter, sans-serif').attr('fill','rgba(255,255,255,0.55)')
        .text(words.slice(half).join(' '));
    }
  });
}

// ── USE CASES (Screen 11) ──
function renderUseCases(sec){
  var grid=sec.querySelector('#ucGrid');if(!grid)return;
  var capIds=CLIENT_STATE.selectedCapabilityIds;
  var filtered=capIds.length?USE_CASES.filter(function(u){return u.capIds&&u.capIds.some(function(c){return capIds.indexOf(c)>-1;});}):USE_CASES;
  if(!filtered.length)filtered=USE_CASES.slice(0,8);
  var typeLabel={live:'LIVE',team:'TEAM',illustrative:'ILLUSTRATIVE',nda:'NDA'};
  grid.innerHTML=filtered.map(function(u){
    var sel=CLIENT_STATE.proofUseCaseId===u.id;
    var flowHtml=u.flow.map(function(s,i){return (i?'<span class="uc-mf-arr">→</span>':'')+'<span class="uc-mf-step'+(s.indexOf('approves')>-1||s.indexOf('review')>-1?' human':'')+'">'+s+'</span>';}).join('');
    return '<div class="uc-card'+(sel?' selected':'')+'\" role="button" tabindex="0"'
      +' onclick="selectUseCase(\''+u.id+'\');openUseCaseDrawer(\''+u.id+'\')"'
      +' onkeydown="if(event.key===\'Enter\'){selectUseCase(\''+u.id+'\');openUseCaseDrawer(\''+u.id+'\');}">'
      +'<span class="status-badge status-'+u.status+'">'+typeLabel[u.status]+'</span>'
      +'<div class="uc-name">'+u.name+'</div>'
      +'<div class="uc-tool">'+u.tool+'</div>'
      +'<div class="uc-mini-flow">'+flowHtml+'</div>'
      +'<div class="uc-detail-hint"><i class="ti ti-arrow-right"></i> View process flow</div>'
    +'</div>';
  }).join('');
}

function selectUseCase(id){
  CLIENT_STATE.proofUseCaseId=CLIENT_STATE.proofUseCaseId===id?null:id;
  var sec=document.getElementById('use-case-flow');
  if(sec)renderUseCases(sec);
}

// ── USE CASE PROCESS EXPLORER (D3 swim-lane, opens in drawer) ──
function buildUseCaseSwimlane(uc){
  if(typeof d3==='undefined'||!uc||!uc.flow)return '<div class="dr-body">'+uc.flow.join(' → ')+'</div>';

  var LANES=[
    {id:'source',label:'Data sources',color:'#0F8A62'},
    {id:'ai',label:'AI processing',color:'#A100FF'},
    {id:'human',label:'Human checkpoint',color:'#B46A00'},
    {id:'evidence',label:'Evidence generated',color:'#0E7490'},
    {id:'action',label:'Action / outcome',color:'#6366F1'}
  ];

  var steps=uc.flow;
  var laneMap={};
  steps.forEach(function(s,i){
    var lane='ai';
    if(/source|feed|ingest|load|collect|pull|input|data/i.test(s))lane='source';
    else if(/review|approve|check|decides|validates|officer|analyst|human|sign/i.test(s))lane='human';
    else if(/log|evidence|record|document|report|output|dashboard/i.test(s))lane='evidence';
    else if(/action|send|notify|file|clear|escalate|submit/i.test(s))lane='action';
    if(!laneMap[lane])laneMap[lane]=[];
    laneMap[lane].push({step:s,idx:i});
  });

  var wrap=document.createElement('div');
  wrap.className='uc-swimlane-wrap';
  var W=480,LANE_H=48,PAD=10;
  var H=LANES.length*LANE_H+PAD*2;

  var svg=d3.select(wrap).append('svg').attr('viewBox','0 0 '+W+' '+H)
    .attr('width','100%').attr('height',H).attr('role','img').attr('aria-label','Use case process flow');

  LANES.forEach(function(ln,li){
    var y=PAD+li*LANE_H;
    var items=laneMap[ln.id]||[];
    // Lane background
    svg.append('rect').attr('x',80).attr('y',y+2).attr('width',W-86).attr('height',LANE_H-4).attr('rx',5)
      .attr('fill',ln.color).attr('fill-opacity',0.06).attr('stroke',ln.color).attr('stroke-opacity',0.12).attr('stroke-width',1);
    // Lane label
    svg.append('text').attr('x',72).attr('y',y+LANE_H/2+1).attr('text-anchor','end')
      .attr('dominant-baseline','middle').attr('font-size','8').attr('font-family','JetBrains Mono, monospace')
      .attr('fill',ln.color).attr('fill-opacity',0.8).text(ln.label.toUpperCase().slice(0,10));
    // Items
    var slotW=(W-90)/(steps.length||1);
    items.forEach(function(item){
      var cx=90+item.idx*slotW+slotW/2;
      var cy=y+LANE_H/2;
      svg.append('circle').attr('cx',cx).attr('cy',cy).attr('r',5).attr('fill',ln.color).attr('fill-opacity',0.35).attr('stroke',ln.color).attr('stroke-opacity',0.7).attr('stroke-width',1.5);
      var words=item.step.split(' ');
      var l1=words.slice(0,Math.ceil(words.length/2)).join(' ');
      var l2=words.slice(Math.ceil(words.length/2)).join(' ');
      svg.append('text').attr('x',cx).attr('y',cy+10).attr('text-anchor','middle').attr('font-size','7').attr('font-family','Inter, sans-serif').attr('fill',ln.color).attr('fill-opacity',0.85).text(l1);
      if(l2)svg.append('text').attr('x',cx).attr('y',cy+18).attr('text-anchor','middle').attr('font-size','7').attr('font-family','Inter, sans-serif').attr('fill',ln.color).attr('fill-opacity',0.85).text(l2);
    });
    // Connector arrows
    items.forEach(function(item,ii){
      if(ii===0&&steps.length>1){
        var nextStep=items[ii+1];
        if(nextStep){
          var x1=90+item.idx*slotW+slotW/2+5;
          var x2=90+nextStep.idx*slotW+slotW/2-5;
          var cy=y+LANE_H/2;
          svg.append('line').attr('x1',x1).attr('y1',cy).attr('x2',x2).attr('y2',cy)
            .attr('stroke',ln.color).attr('stroke-opacity',0.25).attr('stroke-width',1);
        }
      }
    });
  });

  return wrap.outerHTML;
}

function openUseCaseDrawer(ucId){
  var uc=(USE_CASES||[]).find(function(u){return u.id===ucId;});if(!uc)return;
  var TLABEL={live:'Live asset',team:'Team-built',illustrative:'Illustrative',nda:'NDA reference'};
  var flowHtml=buildUseCaseSwimlane(uc);
  var blockLinks=(uc.blockIds||[]).map(function(bid){
    var b=TRANSFORMATION_BLOCKS&&TRANSFORMATION_BLOCKS.find(function(x){return x.id===bid;});
    return b?'<div class="dr-item"><i class="ti ti-arrow-right dr-icon"></i>'+b.name+'</div>':'';
  }).join('');
  var tabs=[
    {id:'process',label:'Process flow',html:'<div class="drawer-section"><div class="dr-h">End-to-end flow</div>'+flowHtml+'<div class="dr-note">Swim-lane shows data, AI, human, evidence, and action steps. Mapping is illustrative until validated with client process documentation.</div></div>'},
    {id:'status',label:'Status',html:'<div class="drawer-section"><div class="dr-h">Delivery status</div><div class="dr-body"><span class="status-badge status-'+uc.status+'">'+TLABEL[uc.status]+'</span></div><div class="dr-h">Tool or approach</div><div class="dr-body">'+uc.tool+'</div></div>'},
    {id:'blocks',label:'Transformation blocks',html:'<div class="drawer-section"><div class="dr-h">Blocks required for this use case</div>'+(blockLinks||'<div class="dr-body dr-muted">Not yet mapped.</div>')+'</div>'}
  ];
  openDrawer(uc.name,tabs,'process');
}

// ── ACCENTURE EDGE (Screen 15) ──
function renderAccentureEdge(sec){
  var engineA=sec.querySelector('#engineA');
  var engineB=sec.querySelector('#engineB');
  if(!engineA||!engineB)return;

  var A=ACCENTURE_EDGE.filter(function(e){return e.engine==='A';});
  var B=ACCENTURE_EDGE.filter(function(e){return e.engine==='B';});
  var AB=ACCENTURE_EDGE.filter(function(e){return e.engine==='A+B';});

  if(typeof d3!=='undefined'){
    // D3 connected diagram replaces the parent .edge-dual div
    var parent=sec.querySelector('.edge-dual');
    if(parent){
      parent.style.display='none';
      var existing=sec.querySelector('.edge-d3-wrap');
      if(existing)existing.remove();
      var wrap=document.createElement('div');
      wrap.className='edge-d3-wrap';
      wrap.style.cssText='margin-top:14px;width:100%;';
      parent.parentNode.insertBefore(wrap,parent.nextSibling);
      var W=wrap.clientWidth||840,H=260;
      var svg=d3.select(wrap).append('svg').attr('viewBox','0 0 '+W+' '+H)
        .attr('width','100%').attr('height',H).attr('role','img').attr('aria-label','Accenture dual-engine model');
      var COL_A=150,COL_AB=W/2,COL_B=W-150;

      // Node positions
      var nodes=[];
      var nodeById={};
      function addNodes(items,col,color,prefix){
        var total=items.length;
        items.forEach(function(e,i){
          var ny=H/2+(i-(total-1)/2)*70;
          var n={id:e.id,label:e.name,effect:e.clientEffect,color:color,x:col,y:ny,engine:e.engine};
          nodes.push(n);nodeById[e.id]=n;
        });
      }
      addNodes(A,COL_A,'#0F8A62');
      addNodes(AB,COL_AB,'#A100FF');
      addNodes(B,COL_B,'#0E7490');

      // Edges: A -> AB, B -> AB
      var edges=[];
      A.forEach(function(a){AB.forEach(function(ab){edges.push({from:a.id,to:ab.id});});});
      B.forEach(function(b){AB.forEach(function(ab){edges.push({from:b.id,to:ab.id});});});

      // Column labels
      [{x:COL_A,label:'ENGINE A',sub:'Transform the function',c:'#0F8A62'},
       {x:COL_AB,label:'SHARED VALUE',sub:'Realized with both',c:'#A100FF'},
       {x:COL_B,label:'ENGINE B',sub:'Accelerate delivery',c:'#0E7490'}].forEach(function(col){
        svg.append('text').attr('x',col.x).attr('y',18).attr('text-anchor','middle')
          .attr('font-size','8').attr('font-family','JetBrains Mono, monospace').attr('font-weight','700')
          .attr('fill',col.c).attr('letter-spacing','0.08em').text(col.label);
        svg.append('text').attr('x',col.x).attr('y',30).attr('text-anchor','middle')
          .attr('font-size','8').attr('font-family','Inter, sans-serif').attr('fill','rgba(255,255,255,0.4)').text(col.sub);
      });

      // Edges
      edges.forEach(function(e){
        var from=nodeById[e.from],to=nodeById[e.to];if(!from||!to)return;
        var mx=(from.x+to.x)/2;
        svg.append('path').attr('d','M'+from.x+','+from.y+' C'+mx+','+from.y+' '+mx+','+to.y+' '+to.x+','+to.y)
          .attr('fill','none').attr('stroke','rgba(255,255,255,0.1)').attr('stroke-width',1.5);
      });

      // Nodes
      nodes.forEach(function(n){
        var g=svg.append('g').style('cursor','pointer').attr('role','button').attr('tabindex','0').attr('aria-label',n.label);
        g.append('rect').attr('x',n.x-80).attr('y',n.y-22).attr('width',160).attr('height',44).attr('rx',8)
          .attr('fill',n.color).attr('fill-opacity',0.12).attr('stroke',n.color).attr('stroke-opacity',0.45).attr('stroke-width',1.5);
        // Word-wrap label
        var words=n.label.split(' '),line1=words.slice(0,Math.ceil(words.length/2)).join(' '),line2=words.slice(Math.ceil(words.length/2)).join(' ');
        svg.append('text').attr('x',n.x).attr('y',n.y-5+(line2?0:5)).attr('text-anchor','middle')
          .attr('font-size','9.5').attr('font-weight','600').attr('font-family','Space Grotesk, sans-serif').attr('fill',n.color).text(line1);
        if(line2)svg.append('text').attr('x',n.x).attr('y',n.y+8).attr('text-anchor','middle')
          .attr('font-size','9.5').attr('font-weight','600').attr('font-family','Space Grotesk, sans-serif').attr('fill',n.color).text(line2);
        g.on('click',function(){openEdgeDrawer(n.id);})
         .on('mouseenter',function(){d3.select(this).select('rect').attr('fill-opacity',0.28);})
         .on('mouseleave',function(){d3.select(this).select('rect').attr('fill-opacity',0.12);})
         .on('keydown',function(event){if(event.key==='Enter')openEdgeDrawer(n.id);});
      });
      // Re-append nodes on top
      nodes.forEach(function(n){
        var g=svg.select('g[aria-label="'+n.label+'"]');g.raise();
      });
    }
  } else {
    // Fallback: text cards
    var edgeA2=ACCENTURE_EDGE.filter(function(e){return e.engine==='A'||e.engine==='A+B';});
    var edgeB2=ACCENTURE_EDGE.filter(function(e){return e.engine==='B'||e.engine==='A+B';});
    engineA.innerHTML=edgeA2.map(function(e){return '<div class="engine-item"><div class="engine-item-name">'+e.name+'</div><div class="engine-item-effect dr-muted">'+e.clientEffect+'</div><button class="inline-link" onclick="openEdgeDrawer(\''+e.id+'\')">→ How it works</button></div>';}).join('');
    engineB.innerHTML=edgeB2.map(function(e){return '<div class="engine-item"><div class="engine-item-name">'+e.name+'</div><div class="engine-item-effect dr-muted">'+e.clientEffect+'</div><button class="inline-link" onclick="openEdgeDrawer(\''+e.id+'\')">→ How it works</button></div>';}).join('');
  }
}

function openEdgeDrawer(edgeId){
  var edge=ACCENTURE_EDGE.find(function(e){return e.id===edgeId;});if(!edge)return;
  var tabs=[
    {id:'mechanism',label:'Mechanism',html:'<div class="drawer-section"><div class="dr-h">What Accenture does differently</div><div class="dr-body">'+edge.mechanism+'</div></div>'},
    {id:'effect',label:'Client effect',html:'<div class="drawer-section"><div class="dr-q">'+edge.clientEffect+'</div><div class="dr-h">Evidence metrics</div>'+(edge.evidenceMetrics||[]).map(function(m){return '<div class="dr-item"><i class="ti ti-chart-bar dr-icon"></i>'+m+'</div>';}).join('')+'</div>'},
    {id:'deps',label:'Client dependency',html:'<div class="drawer-section"><div class="dr-h">What should be available or decided</div><div class="dr-body">'+edge.clientDependency+'</div><div class="dr-note">These are client-side prerequisites. Accenture can help assess and resolve them but cannot substitute for client authority and decisions.</div></div>'}
  ];
  openDrawer(edge.name,tabs,'mechanism');
}

// ── MATURITY MATRIX (Screen 6) ──
function renderMaturityMatrix(sec){
  var table=sec.querySelector('#maturityTable');if(!table)return;

  // Persist mode across re-renders via DOM property
  if(!table._matMode)table._matMode='quick-pulse';
  var mode=table._matMode;

  // Mode toggle (created once, persists)
  var toggleWrap=table.querySelector('.mat-mode-toggle');
  if(!toggleWrap){
    toggleWrap=document.createElement('div');
    toggleWrap.className='mat-mode-toggle';
    [{id:'quick-pulse',label:'Quick Pulse'},{id:'evidence-view',label:'Evidence View'}].forEach(function(m){
      var btn=document.createElement('button');
      btn.className='mat-mode-btn';
      btn.setAttribute('data-modeid',m.id);
      btn.textContent=m.label;
      btn.addEventListener('click',function(){
        table._matMode=m.id;
        renderMaturityMatrix(sec);
      });
      toggleWrap.appendChild(btn);
    });
    table.appendChild(toggleWrap);
  }
  toggleWrap.querySelectorAll('.mat-mode-btn').forEach(function(b){
    b.classList.toggle('active',b.getAttribute('data-modeid')===mode);
  });

  // Content area (cleared on each re-render)
  var contentArea=table.querySelector('.mat-content-area');
  if(!contentArea){
    contentArea=document.createElement('div');
    contentArea.className='mat-content-area';
    table.appendChild(contentArea);
  }
  contentArea.innerHTML='';

  var blocks=TRANSFORMATION_BLOCKS.filter(function(b){return b.position!=='bridge';});

  if(mode==='quick-pulse'){
    var QP_OPTIONS=[
      {value:'not-evident',label:'Not evident'},
      {value:'partly-evident',label:'Partly evident'},
      {value:'consistently-evident',label:'Consistently evident'},
      {value:null,label:'Not sure'}
    ];
    var state=(typeof store!=='undefined')?store.getState():{maturity:{answers:{}}};
    var answers=(state.maturity&&state.maturity.answers)||{};

    var qpGrid=document.createElement('div');
    qpGrid.className='qp-grid';

    blocks.forEach(function(b){
      var criterionId=b.id+':overall';
      var currentAnswer=answers[criterionId];

      var row=document.createElement('div');
      row.className='qp-row';

      var nameDiv=document.createElement('div');
      nameDiv.className='qp-block-name';
      nameDiv.style.borderLeft='3px solid '+b.color;
      nameDiv.innerHTML='<span class="qp-block-label">'+b.name+'</span>'
        +'<button class="qp-info-btn" onclick="openBlockDrawer(\''+b.id+'\')" aria-label="Info for '+b.name+'" title="Open block details"><i class="ti ti-info-circle"></i></button>';
      row.appendChild(nameDiv);

      var optsDiv=document.createElement('div');
      optsDiv.className='qp-options';

      QP_OPTIONS.forEach(function(opt){
        var btn=document.createElement('button');
        btn.className='qp-btn'+(currentAnswer===opt.value?' active':'');
        if(opt.value===null)btn.classList.add('qp-not-sure');
        btn.textContent=opt.label;
        btn.addEventListener('click',function(){
          if(typeof store!=='undefined'){
            store.dispatch({type:'SET_MATURITY_ANSWER',payload:{criterionId:criterionId,answer:opt.value}});
          }
          optsDiv.querySelectorAll('.qp-btn').forEach(function(qb){qb.classList.toggle('active',qb===btn);});
          updateQPImpact(impactPanel);
        });
        optsDiv.appendChild(btn);
      });

      row.appendChild(optsDiv);
      qpGrid.appendChild(row);
    });

    contentArea.appendChild(qpGrid);

    // Impact panel
    var impactPanel=document.createElement('div');
    impactPanel.className='qp-impact';
    contentArea.appendChild(impactPanel);

    function updateQPImpact(panel){
      if(!panel)return;
      var st=(typeof store!=='undefined')?store.getState():{maturity:{answers:{}},selectedCapabilities:[]};
      var gaps=(typeof selectTransformationGaps!=='undefined')?selectTransformationGaps(st):[];
      var scores=(typeof selectCandidateScores!=='undefined')?selectCandidateScores(st):[];
      var topCandidates=scores.filter(function(s){return s.score>0.5;}).slice(0,2);
      var hasAnswers=Object.keys((st.maturity&&st.maturity.answers)||{}).length>0;

      panel.innerHTML=
        '<div class="qp-impact-section">'
          +'<div class="qp-impact-h">Candidates that may be testable now</div>'
          +'<div class="qp-impact-items">'
            +(topCandidates.length
              ?topCandidates.map(function(c){
                return '<a class="qp-impact-link" role="button" tabindex="0"'
                  +' onclick="if(typeof goToId===\'function\')goToId(\'exec-shortlist\')">'
                  +'<i class="ti ti-arrow-right"></i>'+c.title+'</a>';
              }).join('')
              :'<span class="qp-impact-empty">Select capabilities and complete the shortlist to see candidates.</span>')
          +'</div>'
        +'</div>'
        +'<div class="qp-impact-section">'
          +'<div class="qp-impact-h">Blocks with potential gaps</div>'
          +'<div class="qp-impact-items">'
            +(gaps.length
              ?gaps.map(function(g){
                return '<a class="qp-impact-link" role="button" tabindex="0"'
                  +' onclick="if(typeof goToId===\'function\')goToId(\'transformation-system\')">'
                  +'<i class="ti ti-alert-triangle" style="color:var(--amber)"></i>'+g.blockName+'</a>';
              }).join('')
              :(hasAnswers
                ?'<span class="qp-impact-empty">No significant gaps identified from current answers.</span>'
                :'<span class="qp-impact-empty">Answer the Quick Pulse above to see gap analysis.</span>'))
          +'</div>'
        +'</div>';
    }
    updateQPImpact(impactPanel);

  } else {
    // Evidence View: existing maturity table behaviour
    var levels=MATURITY_LEVELS;
    var header='<div class="mat-header"><div class="mat-row-label"></div>'
      +levels.map(function(l){
        return '<div class="mat-col-hdr"><div class="mat-level-num">'+l.number+'</div><div class="mat-level-name">'+l.label+'</div></div>';
      }).join('')
      +'</div>';
    var rows=blocks.map(function(b){
      var current=CLIENT_STATE.maturity[b.id];
      var target=CLIENT_STATE.targetMaturity[b.id];
      var cells=levels.map(function(l){
        var isCurrent=current===l.id;
        var isTarget=target===l.id;
        return '<div class="mat-cell'+(isCurrent?' mat-current':'')+(isTarget?' mat-target':'')
          +'\" onclick="cycleMaturity(\''+b.id+'\',\''+l.id+'\')" title="Set '+b.name+': '+l.label+'">'
          +(isCurrent?'<span class="mat-marker mat-c">Now</span>':'')
          +(isTarget?'<span class="mat-marker mat-t">Target</span>':'')
          +'</div>';
      }).join('');
      return '<div class="mat-row"><div class="mat-row-label" style="border-left:3px solid '+b.color
        +'" onclick="openBlockDrawer(\''+b.id+'\')"><span class="mat-block-name">'+b.name+'</span>'
        +'<i class="ti ti-info-circle mat-info-icon"></i></div>'+cells+'</div>';
    }).join('');
    contentArea.innerHTML=header+rows;
  }
}
function cycleMaturity(blockId,levelId){
  var current=CLIENT_STATE.maturity[blockId];
  var target=CLIENT_STATE.targetMaturity[blockId];
  if(!current){CLIENT_STATE.maturity[blockId]=levelId;}
  else if(current&&!target&&current!==levelId){CLIENT_STATE.targetMaturity[blockId]=levelId;}
  else{delete CLIENT_STATE.maturity[blockId];delete CLIENT_STATE.targetMaturity[blockId];}
  var sec=document.getElementById('maturity-matrix');
  if(sec)renderMaturityMatrix(sec);
}

// ── TAKEAWAY / DECISION (Screen 18) ──
function renderTakeaway(sec){
  function setTa(id,val){var e=sec.querySelector('#'+id);if(e)e.textContent=val||'';}
  var pLabels={'reg-vol':'Regulatory volume and change','cost-cap':'Cost and capacity pressure','frag-data':'Fragmented risk and control data','slow-dec':'Slow decisions and reporting','ctrl-ev':'Control effectiveness and evidence','ai-gov':'AI governance and model risk'};
  setTa('ta-pressures',CLIENT_STATE.pressures.map(function(p){return pLabels[p]||p;}).join(', ')||'Not yet set');
  setTa('ta-arch',CLIENT_STATE.archetype==='A'?'Universal / cantonal bank':'Private / wealth bank');
  var selCaps=CLIENT_STATE.selectedCapabilityIds.map(getCapabilityById).filter(Boolean);
  setTa('ta-caps',selCaps.map(function(c){return c.name;}).join(', ')||'Select capabilities on screen 07');
  var proofCap=CLIENT_STATE.proofCapabilityId?getCapabilityById(CLIENT_STATE.proofCapabilityId):null;
  setTa('ta-proof',proofCap?proofCap.name:'Not yet selected');
  var proofUC=CLIENT_STATE.proofUseCaseId?getUseCaseById(CLIENT_STATE.proofUseCaseId):null;
  setTa('ta-usecase',proofUC?proofUC.name:'Not yet selected');
  // Maturity gaps
  var gaps=TRANSFORMATION_BLOCKS.filter(function(b){return CLIENT_STATE.maturity[b.id]&&CLIENT_STATE.targetMaturity[b.id]&&CLIENT_STATE.maturity[b.id]!==CLIENT_STATE.targetMaturity[b.id];}).map(function(b){var cur=MATURITY_LEVELS.find(function(l){return l.id===CLIENT_STATE.maturity[b.id];});var tgt=MATURITY_LEVELS.find(function(l){return l.id===CLIENT_STATE.targetMaturity[b.id];});return b.name+': '+(cur?cur.label:'?')+' to '+(tgt?tgt.label:'?');});
  setTa('ta-gaps',gaps.join('; ')||'Set current and target state on screen 06');
  setTa('ta-decisions',CLIENT_STATE.openDecisions.map(function(d){return d.text;}).join('\n')||'None recorded');
}

// ── APPENDIX CAPABILITIES ──
function renderAppCaps(sec){
  var body=sec.querySelector('#appCapsBody');if(!body)return;
  body.innerHTML=RISK_CATEGORIES.map(function(cat){
    var caps=RISK_CAPABILITIES.filter(function(c){return c.cat===cat.id;});
    var items=caps.map(function(c){return '<tr><td>'+c.name+'</td><td style="font-size:12px;color:var(--text-2)">'+c.outcome+'</td></tr>';}).join('');
    return '<div class="app-cat-section"><div class="app-cat-head" style="border-color:'+cat.color+'"><i class="ti ti-'+cat.icon+'" style="color:'+cat.color+'"></i>'+cat.name+' ('+caps.length+')</div><table class="app-table"><thead><tr><th>Capability</th><th>Executive outcome</th></tr></thead><tbody>'+items+'</tbody></table></div>';
  }).join('');
}

// ── TEAM ──
function renderTeam(sec){
  var grid=sec.querySelector('#teamGrid');if(!grid)return;
  var visibleTeam=(EXPERTS||[]).filter(function(e){return e.clientVisible!==false;});
  grid.innerHTML='<div class="team-cards">'+visibleTeam.map(function(e){
    var initials=e.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2);
    return '<a class="expert team-card" href="'+(e.mail?'mailto:'+e.mail:'#')+'" aria-label="'+e.name+(e.mail?', '+e.mail:'')+'">'+
      '<img class="expert-photo" src="'+e.photo+'" alt="'+e.name+'" loading="lazy"'+
        ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'+
      '<div class="expert-ph-fallback" style="display:none">'+initials+'</div>'+
      '<div class="expert-name">'+e.name+'</div>'+
      (e.mail?'<div class="expert-mail" style="opacity:1">'+e.mail+'</div>':'')
    +'</a>';
  }).join('')+'</div>';
}

// ── SOLUTION PORTFOLIO (Screen 09b) ──
function renderSolutionPortfolio(sec){
  var area=sec.querySelector('#solutionPortfolioArea');if(!area)return;
  var clusters=PORTFOLIO_CLUSTERS||[];
  var solutions=SOLUTIONS||[];
  var SHARING_LABEL={live:'Live asset',team:'Team-built','to-confirm':'Status to confirm',illustrative:'Illustrative',nda:'NDA ref'};
  var TECH_LABEL={'rules-workflow':'Rules','rpa-orchestration':'RPA','analytics-ml':'ML/Analytics','genai-copilots':'GenAI','agents':'Agents'};
  var openCluster=null;
  function render(){
    area.innerHTML='<div class="sol-clusters">'+clusters.map(function(cl){
      var clSols=solutions.filter(function(s){return s.portfolioClusterId===cl.id;});
      var isOpen=openCluster===cl.id;
      var solHtml=isOpen?('<div class="sol-cards">'+clSols.map(function(s){
        var tech=TECH_LABEL[s.technologyPatternId]||'';
        var sharing=SHARING_LABEL[s.sharingStatus]||s.sharingStatus;
        var prov=s.mappingProvenance&&s.mappingProvenance.cluster||'working-hypothesis';
        var provClass='prov-'+prov.replace(/[^a-z-]/g,'');
        return '<div class="sol-card">'
          +'<div class="sol-card-num">'+s.sourceNumber+'</div>'
          +'<div class="sol-card-name">'+s.displayName+'</div>'
          +'<div class="sol-card-src">'+s.sourceName+'</div>'
          +(tech?'<span class="sol-chip sol-chip-tech">'+tech+'</span>':'')
          +'<span class="sol-chip sol-chip-share">'+sharing+'</span>'
          +'<span class="sol-chip '+provClass+'">'+prov.replace(/-/g,' ')+'</span>'
        +'</div>';
      }).join('')+'</div>'):'';
      return '<div class="sol-cluster'+(isOpen?' open':'')+'\" style="--cc:'+cl.color+'">'
        +'<button class="sol-cluster-hdr" onclick="toggleSolCluster(\''+cl.id+'\')" aria-expanded="'+(isOpen?'true':'false')+'">'
          +'<i class="ti ti-'+cl.icon+' sol-cluster-icon"></i>'
          +'<span class="sol-cluster-name">'+cl.name+'</span>'
          +'<span class="sol-cluster-count">'+clSols.length+' solution'+(clSols.length!==1?'s':'')+'</span>'
          +'<i class="ti ti-chevron-'+(isOpen?'up':'down')+' sol-cluster-chev"></i>'
        +'</button>'
        +solHtml
      +'</div>';
    }).join('')+'</div>';
  }
  window.toggleSolCluster=function(id){
    openCluster=openCluster===id?null:id;
    render();
  };
  render();
}

// ── MOTION PREFERENCE ──
function prefersReducedMotion(){
  return window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
}

// ── PROCESS TWIN (Screen 11) ──
function getProcessTemplate(){
  var tpl=null;
  // Try selected proof capability first
  var pid=CLIENT_STATE.proofCapabilityId||CLIENT_STATE.selectedCapabilityIds[0];
  if(pid){
    var cap=getCapabilityById(pid);
    if(cap){
      // Look for a template matching via solution map
      var solIds=Object.keys(SOLUTION_PROCESS_TEMPLATE_MAP||{});
      for(var i=0;i<solIds.length;i++){
        if(SOLUTION_PROCESS_TEMPLATE_MAP[solIds[i]]==='regulation-coverage'&&(cap.id===solIds[i]||cap.cat==='compliance'))break;
      }
    }
  }
  // Default: Regulation Coverage
  return (PROCESS_TWIN_TEMPLATES||[])[0]||null;
}

function renderProcessTwin(sec){
  var area=sec.querySelector('#processTwinArea');if(!area)return;
  var tpl=getProcessTemplate();
  if(!tpl){
    area.innerHTML='<div class="opp-empty">Select a capability on screen 07 to populate the process flow. Regulation Coverage is available as the default template.</div>';
    return;
  }
  // Build the executive view
  area.innerHTML='';
  var isDark=document.documentElement.getAttribute('data-theme')==='dark';

  // KPI strip
  var kpiHtml='<div class="pt-kpi-strip">'+
    '<div class="pt-state-badge">SOURCE-BACKED TOPOLOGY</div>'+
    (tpl.kpis||[]).map(function(k){
      return '<div class="pt-kpi"><div class="pt-kpi-val">'+k.value+'</div><div class="pt-kpi-lbl">'+k.label+'</div></div>';
    }).join('')+
  '</div>';

  // SVG dimensions
  var COLS=10;
  var COL_W=90;
  var LANE_H=68;
  var LEFT_PAD=110;
  var TOP_PAD=16;
  var BOTTOM_PAD=20;
  var W=LEFT_PAD+COLS*COL_W;
  var H=TOP_PAD+tpl.lanes.length*LANE_H+BOTTOM_PAD;

  function nodeX(col){return LEFT_PAD+col*COL_W+COL_W/2;}
  function nodeY(laneIdx){return TOP_PAD+laneIdx*LANE_H+LANE_H/2;}
  function laneIdx(laneId){return tpl.lanes.findIndex(function(l){return l.id===laneId;});}

  // D3 SVG build
  if(typeof d3==='undefined'){
    area.innerHTML='<div class="render-error">D3 not loaded. Process twin cannot render.</div>';
    return;
  }

  var wrap=document.createElement('div');
  wrap.className='pt-svg-wrap';

  // KPI strip before SVG
  var kpiEl=document.createElement('div');
  kpiEl.innerHTML=kpiHtml;
  area.appendChild(kpiEl.firstChild);

  var svgSel=d3.select(wrap).append('svg')
    .attr('viewBox','0 0 '+W+' '+H)
    .attr('width','100%')
    .attr('height',H)
    .attr('role','img')
    .attr('aria-label','Process flow: '+tpl.name);

  // Lane backgrounds and labels
  tpl.lanes.forEach(function(lane,li){
    var y=TOP_PAD+li*LANE_H;
    svgSel.append('rect')
      .attr('x',LEFT_PAD-4).attr('y',y+4).attr('width',COLS*COL_W).attr('height',LANE_H-8).attr('rx',6)
      .attr('fill',lane.color).attr('fill-opacity',isDark?0.06:0.04)
      .attr('stroke',lane.color).attr('stroke-opacity',0.1).attr('stroke-width',1);
    svgSel.append('text')
      .attr('x',LEFT_PAD-10).attr('y',y+LANE_H/2).attr('text-anchor','end').attr('dominant-baseline','middle')
      .attr('font-size','8').attr('font-family','JetBrains Mono,monospace')
      .attr('fill',lane.color).attr('fill-opacity',0.75)
      .text(lane.label.toUpperCase().slice(0,12));
  });

  // Edges (draw before nodes so nodes appear on top)
  tpl.edges.forEach(function(edge){
    var fromNode=tpl.nodes.find(function(n){return n.id===edge.from;});
    var toNode=tpl.nodes.find(function(n){return n.id===edge.to;});
    if(!fromNode||!toNode)return;
    var x1=nodeX(fromNode.col);
    var y1=nodeY(laneIdx(fromNode.lane));
    var x2=nodeX(toNode.col);
    var y2=nodeY(laneIdx(toNode.lane));
    // Curved path
    var mx=(x1+x2)/2;
    svgSel.append('path')
      .attr('d','M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2)
      .attr('fill','none')
      .attr('stroke',isDark?'rgba(161,0,255,0.22)':'rgba(161,0,255,0.18)')
      .attr('stroke-width',1.5)
      .attr('marker-end','url(#pt-arrow)');
  });

  // Arrow marker
  var defs=svgSel.append('defs');
  defs.append('marker').attr('id','pt-arrow').attr('viewBox','0 0 8 8')
    .attr('refX',6).attr('refY',4).attr('markerWidth',6).attr('markerHeight',6)
    .attr('orient','auto')
    .append('path').attr('d','M0,0 L8,4 L0,8 Z').attr('fill','rgba(161,0,255,0.45)');

  // Nodes
  tpl.nodes.forEach(function(node){
    var li=laneIdx(node.lane);
    var cx=nodeX(node.col);
    var cy=nodeY(li);
    var lane=tpl.lanes[li];
    var color=lane?lane.color:'#A100FF';

    var g=svgSel.append('g')
      .style('cursor','pointer')
      .attr('role','button')
      .attr('tabindex','0')
      .attr('aria-label',node.label);

    g.on('click',function(){openProcessNodeDrawer(tpl,node);})
     .on('keydown',function(evt){if(evt.key==='Enter')openProcessNodeDrawer(tpl,node);});

    if(node.type==='gate'){
      // Diamond
      var s=20;
      g.append('polygon')
        .attr('points',cx+','+(cy-s)+' '+(cx+s)+','+cy+' '+cx+','+(cy+s)+' '+(cx-s)+','+cy)
        .attr('fill','none')
        .attr('stroke',color)
        .attr('stroke-width',2)
        .attr('stroke-opacity',0.9);
      g.append('polygon')
        .attr('points',cx+','+(cy-s)+' '+(cx+s)+','+cy+' '+cx+','+(cy+s)+' '+(cx-s)+','+cy)
        .attr('fill',color).attr('fill-opacity',0.08);
    } else if(node.type==='evidence'){
      // Document shape (rect with folded corner)
      var rw=56,rh=34;
      g.append('rect')
        .attr('x',cx-rw/2).attr('y',cy-rh/2).attr('width',rw).attr('height',rh).attr('rx',4)
        .attr('fill',color).attr('fill-opacity',0.1)
        .attr('stroke',color).attr('stroke-width',1.5).attr('stroke-opacity',0.7);
      g.append('line').attr('x1',cx+rw/2-10).attr('y1',cy-rh/2).attr('x2',cx+rw/2).attr('y2',cy-rh/2+10)
        .attr('stroke',color).attr('stroke-opacity',0.5).attr('stroke-width',1);
    } else if(node.type==='ai-genai'||node.type==='ai-analytics'){
      // Hexagon
      var hr=20;
      var pts=[];
      for(var a=0;a<6;a++){var ang=(a*60-90)*Math.PI/180;pts.push((cx+hr*Math.cos(ang)).toFixed(1)+','+(cy+hr*Math.sin(ang)).toFixed(1));}
      g.append('polygon')
        .attr('points',pts.join(' '))
        .attr('fill',color).attr('fill-opacity',0.12)
        .attr('stroke',color).attr('stroke-width',1.5).attr('stroke-opacity',0.8);
      // Spark mark for genai
      if(node.type==='ai-genai'){
        g.append('text').attr('x',cx).attr('y',cy).attr('text-anchor','middle').attr('dominant-baseline','central')
          .attr('font-size','10').attr('fill',color).attr('fill-opacity',0.9).text('✦');
      }
    } else {
      // Rounded rectangle (activity)
      var rw2=64,rh2=30;
      g.append('rect')
        .attr('x',cx-rw2/2).attr('y',cy-rh2/2).attr('width',rw2).attr('height',rh2).attr('rx',6)
        .attr('fill',color).attr('fill-opacity',0.1)
        .attr('stroke',color).attr('stroke-width',1.5).attr('stroke-opacity',0.7);
    }

    // Label below node
    var words=node.label.split(' ');
    var mid=Math.ceil(words.length/2);
    var l1=words.slice(0,mid).join(' ');
    var l2=words.slice(mid).join(' ');
    var labelY=node.type==='gate'?(cy+28):(cy+22);
    g.append('text').attr('x',cx).attr('y',labelY).attr('text-anchor','middle')
      .attr('font-size','8').attr('font-family','Inter,sans-serif')
      .attr('fill',isDark?'rgba(237,232,247,0.72)':'rgba(21,24,28,0.65)').text(l1);
    if(l2)g.append('text').attr('x',cx).attr('y',labelY+10).attr('text-anchor','middle')
      .attr('font-size','8').attr('font-family','Inter,sans-serif')
      .attr('fill',isDark?'rgba(237,232,247,0.72)':'rgba(21,24,28,0.65)').text(l2);
  });

  area.appendChild(wrap);

  // Source note
  var note=document.createElement('div');
  note.className='pt-source-note';
  note.innerHTML='<i class="ti ti-info-circle"></i> Topology source-backed from <em>'+tpl.sourceDocument+', '+tpl.sourceSection+'</em>. Measured metrics not provided. Click any node to inspect inputs, controls, and source.';
  area.appendChild(note);
}

function openProcessNodeDrawer(tpl,node){
  if(!tpl||!node)return;
  var tabs=[
    {id:'step',label:'Step',html:'<div class="drawer-section"><div class="dr-q">'+node.label+'</div><div class="dr-h">Description</div><div class="dr-body">'+node.desc+'</div><div class="dr-h" style="margin-top:12px">Executor</div><div class="dr-body">'+node.executor.charAt(0).toUpperCase()+node.executor.slice(1)+'</div><div class="dr-h" style="margin-top:12px">System</div><div class="dr-body">'+node.system+'</div></div>'},
    {id:'data',label:'Data',html:'<div class="drawer-section"><div class="dr-h">Data in</div>'+(node.dataIn||[]).map(function(d){return '<div class="dr-item"><i class="ti ti-arrow-right dr-icon"></i>'+d+'</div>';}).join('')+'<div class="dr-h" style="margin-top:12px">Data out</div>'+(node.dataOut||[]).map(function(d){return '<div class="dr-item"><i class="ti ti-arrow-right dr-icon" style="color:var(--green)"></i>'+d+'</div>';}).join('')+'</div>'},
    {id:'source',label:'Source',html:'<div class="drawer-section"><div class="dr-h">Data state</div><div class="dr-body"><span class="pt-state-badge">'+tpl.dataState.toUpperCase().replace(/-/g,' ')+'</span></div><div class="dr-h" style="margin-top:12px">Source document</div><div class="dr-body">'+tpl.sourceDocument+'</div><div class="dr-h" style="margin-top:12px">Source section</div><div class="dr-body">'+tpl.sourceSection+'</div><div class="dr-note" style="margin-top:12px">Topology derived from solution diagram. Quantitative metrics require client data or validated reference data.</div></div>'}
  ];
  openDrawer(tpl.name+': '+node.label,tabs,'step');
}

// ── RENDER CONTRACTS ──
var VISUAL_CONTRACTS={
  solutionPortfolio:'solutionPortfolioArea',
  pressureToProof:'ptp-visual',
  aiLandscape:'aiLandscapeGrid',aiTaskRouter:'aiLandscapeGrid',
  trSystem:'trSysGrid',evidenceFlow:'evidenceFlowDiagram',
  maturityMatrix:'maturityTable',capHotspots:'capHotspotArea',roleBars:'rolesTable',
  oppPortfolio:'oppPortfolioArea',shortlist:'shortlistGrid',useCases:'ucGrid',
  processTwin:'processTwinArea',
  proofValueCapture:'valueWaterfall',accentureEdge:'engineA',takeaway:'ta-pressures',
  appCaps:'appCapsBody',team:'teamGrid'
};

function safeRender(fn,sec){
  try{fn(sec);}
  catch(e){
    console.error('[render]',sec&&sec.id,e);
    if(sec){var w=document.createElement('div');w.className='render-error';w.textContent='Render error in '+sec.id+': '+e.message;sec.appendChild(w);}
  }
}

// ── RENDER REGISTRY ──
var renderers={
  'solutionPortfolio':renderSolutionPortfolio,
  'pressureToProof':renderPressureToProof,
  'aiLandscape':renderAITaskRouter,
  'aiTaskRouter':renderAITaskRouter,
  'trSystem':renderTransformationSystem,
  'evidenceFlow':renderEvidenceFlow,
  'maturityMatrix':renderMaturityMatrix,
  'capHotspots':renderCapabilityHotspots,
  'roleBars':renderRoleBars,
  'oppPortfolio':renderOpportunityPortfolio,
  'shortlist':renderShortlist,
  'useCases':renderUseCases,
  'processTwin':renderProcessTwin,
  'proofValueCapture':renderProofValueCapture,
  'accentureEdge':renderAccentureEdge,
  'takeaway':renderTakeaway,
  'appCaps':renderAppCaps,
  'team':renderTeam
};

function renderSection(sec){
  var key=sec&&sec.dataset.render;
  if(key&&renderers[key])safeRender(renderers[key],sec);
}

// REACTIVE STATE LISTENERS
// Re-render sections when relevant store state changes
document.addEventListener('nfr:statechange',function(e){
  var action=e&&e.detail&&e.detail.action;
  if(!action)return;
  // Transformation system: re-render on proof candidate or maturity changes
  if(action.type==='SET_PROOF_CANDIDATE'||action.type==='SET_MATURITY_ANSWER'||action.type==='SET_MATURITY_AMBITION'){
    var trSec=document.getElementById('transformation-system');
    if(trSec&&typeof rendered!=='undefined'&&rendered.has(getSlideIndex('transformation-system'))){
      rendered.delete(getSlideIndex('transformation-system'));
      renderSection(trSec);
    }
  }
  // Pressure-to-proof bridge: re-render on pressure, capability, or proof candidate changes
  if(action.type==='TOGGLE_PRESSURE'||action.type==='TOGGLE_CAPABILITY'||action.type==='SET_PROOF_CANDIDATE'){
    var ptpSec=document.getElementById('pressure-to-proof');
    if(ptpSec&&typeof rendered!=='undefined'&&rendered.has(getSlideIndex('pressure-to-proof'))){
      rendered.delete(getSlideIndex('pressure-to-proof'));
      renderSection(ptpSec);
    }
  }
});
