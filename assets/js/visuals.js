// ── SCREEN RENDERERS ──
// Each renderer takes the section element and populates it

// ── TRANSFORMATION SYSTEM (Screen 4) ──
function renderTransformationSystem(sec){
  var grid=sec.querySelector('#trSysGrid');if(!grid)return;
  var blocks=TRANSFORMATION_BLOCKS;
  // Position map: each block maps to a CSS class for grid placement
  var posMap={top:'trsys-top','middle-left':'trsys-ml','middle-right':'trsys-mr','foundation-left':'trsys-fl','foundation-right':'trsys-fr','rail-left':'trsys-rl','rail-right':'trsys-rr',bridge:'trsys-bridge'};
  grid.innerHTML=blocks.map(function(b){
    var cls='trsys-block '+( posMap[b.position]||'' );
    var isBridge=b.position==='bridge';
    return '<button class="'+cls+'" data-block-id="'+b.id+'" onclick="openBlockDrawer(\''+b.id+'\')" style="--block-color:'+b.color+'" aria-label="'+b.name+': '+b.executiveQuestion+'">'+(isBridge?'<span class="trsys-bridge-label">'+b.name+'</span>':'<div class="trsys-block-icon"><i class="ti ti-'+b.icon+'"></i></div><div class="trsys-block-name">'+b.name+'</div><div class="trsys-block-q">'+b.executiveQuestion+'</div>')+'</button>';
  }).join('');
}

// ── AI LANDSCAPE GRID (Screen 2) ──
function renderAILandscape(sec){
  var container=sec.querySelector('#aiLandscapeGrid');if(!container)return;
  var techs=[
    {id:'rules',name:'Rules & workflow',icon:'git-branch',desc:'Deterministic routing, thresholds, conditional logic',tasks:'Approval flows, limit checks, routing',human:'Design rules and handle exceptions',control:'Are rules complete, current, and tested?',cost:'Lowest unit cost — no model calls',examples:['regulatory-compliance','control-monitoring']},
    {id:'rpa',name:'RPA & orchestration',icon:'refresh',desc:'Repeatable cross-system execution, data movement',tasks:'Reconciliation, data extraction, report generation',human:'Monitor failures and edge cases',control:'What happens when the process breaks?',cost:'Low — compute only, no inference',examples:['regulatory-reporting','data-quality']},
    {id:'ml',name:'Analytics & ML',icon:'chart-line',desc:'Prediction, scoring, anomaly detection',tasks:'Credit scoring, fraud detection, KRI monitoring',human:'Review model output; approve consequential actions',control:'Is the model validated and monitored for drift?',cost:'Medium — inference scales with volume',examples:['consumer-credit','aml']},
    {id:'genai',name:'GenAI copilots',icon:'message-bolt',desc:'Search, summarise, draft, explain',tasks:'Report drafting, obligation mapping, document analysis',human:'Review every output before use or distribution',control:'Is output reviewed before leaving the team?',cost:'Medium-high — input/output tokens per call',examples:['regulatory-change-mgmt','board-reporting']},
    {id:'agents',name:'Agents',icon:'robot',desc:'Plan, coordinate, and act across tools and systems',tasks:'Multi-step assessments, end-to-end workflows',human:'Define scope; approve consequential actions',control:'What can the agent do without approval?',cost:'Highest — orchestration overhead plus model calls',examples:['rcsa','operational-risk']}
  ];
  var maturity=MATURITY_LEVELS;
  // Render tech bands
  container.innerHTML='<div class="ail-tech-bands">'+techs.map(function(t,i){
    return '<button class="ail-band'+(i===0?' active':'')+'\" data-tech="'+t.id+'" onclick="focusAIBand(this,\''+t.id+'\')"><div class="ail-band-icon"><i class="ti ti-'+t.icon+'"></i></div><div class="ail-band-name">'+t.name+'</div><div class="ail-band-detail"><div class="ail-label">Best for</div><div class="ail-val">'+t.desc+'</div><div class="ail-label">Human role</div><div class="ail-val">'+t.human+'</div><div class="ail-label">Control question</div><div class="ail-val">'+t.control+'</div><div class="ail-label">Unit cost</div><div class="ail-val">'+t.cost+'</div></div></button>';
  }).join('')+'</div><div class="ail-foundation"><span class="ail-foundation-label">Shared foundations</span><span class="ail-foundation-item">Trusted data & context</span><span class="ail-foundation-item">Identity & access</span><span class="ail-foundation-item">Human accountability</span><span class="ail-foundation-item">Testing & monitoring</span><span class="ail-foundation-item">Logging & evidence</span><span class="ail-foundation-item">Cost governance</span></div><div class="ail-principle">"Use the least complex technology that can own the work safely and economically."</div>';
}

function focusAIBand(btn,id){
  document.querySelectorAll('.ail-band').forEach(function(b){b.classList.toggle('active',b.dataset.tech===id);});
}

// ── CAPABILITY HOTSPOTS (Screen 7) ──
function renderCapabilityHotspots(sec){
  var area=sec.querySelector('#capHotspotArea');if(!area)return;
  // Render category list
  area.innerHTML='<div class="cap-categories" id="capCatList">'+RISK_CATEGORIES.map(function(cat){
    var selCount=CLIENT_STATE.selectedCapabilityIds.filter(function(id){return cat.caps.indexOf(id)>-1;}).length;
    return '<button class="cap-cat-btn" data-catid="'+cat.id+'" onclick="toggleCatPanel(\''+cat.id+'\')" style="border-color:'+(selCount?cat.color:'var(--border-1)')+'"><i class="ti ti-'+cat.icon+'" style="color:'+cat.color+'"></i><span class="cap-cat-btn-name">'+cat.name+'</span><span class="cap-cat-btn-count">'+cat.caps.length+(selCount?' · '+selCount+' selected':'')+'</span><i class="ti ti-chevron-right cap-cat-chev" id="catChev-'+cat.id+'"></i></button>';
  }).join('')+'</div><div class="cap-cat-panel" id="capCatPanel" style="display:none"></div><div class="cap-sidebar" id="capSidebar"><div class="cap-sel-tray"><div class="cap-sel-tray-h"><span>Selected capabilities</span><span class="cap-sel-badge" id="capSelCount">0 / 5</span></div><div class="cap-sel-chips" id="capSelChips"><div class="cap-empty-msg">Select up to 5 capabilities.</div></div></div></div>';
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
  tbl.innerHTML=ROLE_DATA.map(function(r){
    var share=arch==='A'?r.shareA:r.shareB;
    var split=arch==='A'?r.splitA:r.splitB;
    return '<div class="role-row"><span class="role-name">'+r.name+'</span><span class="role-share">'+share+'% of FTE</span><div class="role-splitbar"><div class="rsb-seg rsb-cyan" style="width:'+split[0]+'%"></div><div class="rsb-seg rsb-purple" style="width:'+split[1]+'%"></div><div class="rsb-seg rsb-pink" style="width:'+split[2]+'%"></div></div></div>';
  }).join('');
}

// ── OPPORTUNITY PORTFOLIO (Screen 9) ──
function renderOpportunityPortfolio(sec){
  var area=sec.querySelector('#oppPortfolioArea');if(!area)return;
  var selCaps=CLIENT_STATE.selectedCapabilityIds;
  var opps=selCaps.length?AI_OPPORTUNITIES.filter(function(o){return o.capIds&&o.capIds.some(function(c){return selCaps.indexOf(c)>-1;});}):AI_OPPORTUNITIES.slice(0,8);
  if(!opps.length){area.innerHTML='<div class="opp-empty">Select capabilities on the previous screen to populate the opportunity portfolio.</div>';return;}
  area.innerHTML=opps.map(function(o){
    var statusCls='status-'+o.status;
    return '<div class="opp-card"><div class="opp-card-top"><span class="status-badge '+statusCls+'">'+statusLabel(o.status)+'</span></div><div class="opp-card-name">'+o.name+'</div><div class="opp-card-caps">'+(o.capIds||[]).map(function(cid){var c=getCapabilityById(cid);return c?'<span class="opp-cap-pill">'+c.name+'</span>':'';}).join('')+'</div><button class="opp-card-detail" onclick="openOppDrawer(\''+o.id+'\')" aria-label="Details"><i class="ti ti-info-circle"></i></button></div>';
  }).join('');
}

function openOppDrawer(oppId){
  var opp=getOpportunityById(oppId);if(!opp)return;
  var ucs=USE_CASES.filter(function(u){return u.oppIds&&u.oppIds.indexOf(oppId)>-1;});
  var tabs=[
    {id:'what',label:'What it is',html:'<div class="drawer-section"><div class="dr-q">'+opp.name+'</div><div class="dr-h">Mapped capabilities</div>'+(opp.capIds||[]).map(function(c){var cap=getCapabilityById(c);return cap?'<div class="dr-item"><i class="ti ti-arrow-right dr-icon"></i>'+cap.name+'</div>':'';}).join('')+'</div>'},
    {id:'ucs',label:'Use cases',html:'<div class="drawer-section"><div class="dr-h">Accenture use cases for this opportunity</div>'+(ucs.length?ucs.map(function(u){return '<div class="dr-item"><span class="status-badge status-'+u.status+'">'+statusLabel(u.status)+'</span> '+u.name+'</div>';}).join(''):'<div class="dr-body dr-muted">No direct use case — discuss scope in working session.</div>')+'</div>'}
  ];
  openDrawer(opp.name,tabs,'what');
}

// ── SHORTLIST (Screen 10) ──
function renderShortlist(sec){
  var grid=sec.querySelector('#shortlistGrid');if(!grid)return;
  var sel=CLIENT_STATE.selectedCapabilityIds.slice(0,3);
  if(!sel.length){grid.innerHTML='<div class="shortlist-empty">Select capabilities on screen 7 to populate the shortlist.</div>';return;}
  var lens=CLIENT_STATE.lens;
  var lensLabels={cro:'CRO lens: risk and control quality',cfo:'CFO lens: cost and reporting efficiency',joint:'Joint view'};
  grid.innerHTML=sel.map(function(capId,i){
    var cap=getCapabilityById(capId);if(!cap)return '';
    var cat=getCategoryById(cap.cat);
    var isProof=CLIENT_STATE.proofCapabilityId===capId;
    var types=['Lighthouse proof','Enabling foundation','Next scale wave'];
    return '<div class="shortlist-card'+(isProof?' proof-selected':'')+'\" data-capid="'+capId+'"><div class="sl-type-label">'+types[i]||'Option '+(i+1)+'</div><div class="sl-cap-name">'+cap.name+'</div><div class="sl-cat-name">'+(cat?cat.name:'')+'</div><div class="sl-row"><div class="sl-lbl">Outcome</div><div class="sl-val">'+cap.outcome+'</div></div><div class="sl-row"><div class="sl-lbl">Evidence needed</div><div class="sl-val dr-muted">Validate with client data — do not assume baseline.</div></div><div class="sl-row"><div class="sl-lbl">'+lensLabels[lens]+'</div><div class="sl-val dr-muted">Confirm with client before leading with this framing.</div></div><div class="sl-actions"><button class="sl-proof-btn'+(isProof?' active':'')+'\" onclick="setProofSelection(\''+capId+'\')">'+(isProof?'<i class="ti ti-check"></i> Proof candidate':'Set as proof candidate')+'</button><button class="sl-detail-btn" onclick="openCapabilityDrawer(\''+capId+'\')"><i class="ti ti-info-circle"></i></button></div></div>';
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
  if(nameEl)nameEl.textContent=cap?cap.name:'your chosen capability';
  // Waterfall build (animated via class)
  var waterfall=sec.querySelector('#valueWaterfall');
  if(waterfall){
    var stages=['Theoretical potential','Technically feasible','Proven in workflow','Adopted by users','Capacity captured','Less run cost','Realised value'];
    var widths=[100,82,70,58,48,38,30];
    waterfall.innerHTML=stages.map(function(s,i){
      var isPositive=i===6;
      return '<div class="wf-row"><div class="wf-label">'+s+'</div><div class="wf-bar-wrap"><div class="wf-bar'+(isPositive?' wf-bar-positive':'')+'\" style="width:'+widths[i]+'%" data-wf-width="'+widths[i]+'"><span class="wf-bar-label">'+(i<6?'Leakage: '+(100-widths[i+1<6?i+1:i])+'%':'Target')+'</span></div></div></div>';
    }).join('');
  }
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
    return '<div class="uc-card'+(sel?' selected':'')+'\" onclick="selectUseCase(\''+u.id+'\')" role="button" tabindex="0"><span class="status-badge status-'+u.status+'">'+typeLabel[u.status]+'</span><div class="uc-name">'+u.name+'</div><div class="uc-tool">'+u.tool+'</div><div class="uc-mini-flow">'+flowHtml+'</div></div>';
  }).join('');
}

function selectUseCase(id){
  CLIENT_STATE.proofUseCaseId=CLIENT_STATE.proofUseCaseId===id?null:id;
  var sec=document.getElementById('use-case-flow');
  if(sec)renderUseCases(sec);
}

// ── ACCENTURE EDGE (Screen 15) ──
function renderAccentureEdge(sec){
  var engineA=sec.querySelector('#engineA');
  var engineB=sec.querySelector('#engineB');
  var outcomes=sec.querySelector('#edgeOutcomes');
  if(!engineA||!engineB)return;
  var edgeA=ACCENTURE_EDGE.filter(function(e){return e.engine==='A'||e.engine==='A+B';});
  var edgeB=ACCENTURE_EDGE.filter(function(e){return e.engine==='B'||e.engine==='A+B';});
  engineA.innerHTML=edgeA.map(function(e){return '<div class="engine-item"><div class="engine-item-name">'+e.name+'</div><div class="engine-item-effect dr-muted">'+e.clientEffect+'</div><button class="inline-link" onclick="openEdgeDrawer(\''+e.id+'\')">→ How it works</button></div>';}).join('');
  engineB.innerHTML=edgeB.map(function(e){return '<div class="engine-item"><div class="engine-item-name">'+e.name+'</div><div class="engine-item-effect dr-muted">'+e.clientEffect+'</div><button class="inline-link" onclick="openEdgeDrawer(\''+e.id+'\')">→ How it works</button></div>';}).join('');
}

function openEdgeDrawer(edgeId){
  var edge=ACCENTURE_EDGE.find(function(e){return e.id===edgeId;});if(!edge)return;
  var tabs=[
    {id:'mechanism',label:'Mechanism',html:'<div class="drawer-section"><div class="dr-h">What Accenture does differently</div><div class="dr-body">'+edge.mechanism+'</div></div>'},
    {id:'effect',label:'Client effect',html:'<div class="drawer-section"><div class="dr-q">'+edge.clientEffect+'</div><div class="dr-h">Evidence metrics</div>'+(edge.evidenceMetrics||[]).map(function(m){return '<div class="dr-item"><i class="ti ti-chart-bar dr-icon"></i>'+m+'</div>';}).join('')+'</div>'},
    {id:'deps',label:'Client dependency',html:'<div class="drawer-section"><div class="dr-h">What must be available or decided</div><div class="dr-body">'+edge.clientDependency+'</div><div class="dr-note">These are client-side prerequisites. Accenture can help assess and resolve them but cannot substitute for client authority and decisions.</div></div>'}
  ];
  openDrawer(edge.name,tabs,'mechanism');
}

// ── MATURITY MATRIX (Screen 6) ──
function renderMaturityMatrix(sec){
  var table=sec.querySelector('#maturityTable');if(!table)return;
  var levels=MATURITY_LEVELS;
  var blocks=TRANSFORMATION_BLOCKS.filter(function(b){return b.position!=='bridge';});
  var header='<div class="mat-header"><div class="mat-row-label"></div>'+levels.map(function(l){return '<div class="mat-col-hdr"><div class="mat-level-num">'+l.number+'</div><div class="mat-level-name">'+l.label+'</div></div>';}).join('')+'</div>';
  var rows=blocks.map(function(b){
    var current=CLIENT_STATE.maturity[b.id];
    var target=CLIENT_STATE.targetMaturity[b.id];
    var cells=levels.map(function(l){
      var isCurrent=current===l.id;
      var isTarget=target===l.id;
      return '<div class="mat-cell'+(isCurrent?' mat-current':'')+(isTarget?' mat-target':'')+'\" onclick="cycleMaturity(\''+b.id+'\',\''+l.id+'\')" title="Set '+b.name+': '+l.label+'">'+(isCurrent?'<span class="mat-marker mat-c">Now</span>':'')+(isTarget?'<span class="mat-marker mat-t">Target</span>':'')+'</div>';
    }).join('');
    return '<div class="mat-row"><div class="mat-row-label" style="border-left:3px solid '+b.color+'" onclick="openBlockDrawer(\''+b.id+'\')"><span class="mat-block-name">'+b.name+'</span><i class="ti ti-info-circle mat-info-icon"></i></div>'+cells+'</div>';
  }).join('');
  table.innerHTML=header+rows;
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
  function setTa(id,val){var e=sec.querySelector('#'+id);if(e)e.textContent=val||'—';}
  var pLabels={'reg-vol':'Regulatory volume and change','cost-cap':'Cost and capacity pressure','frag-data':'Fragmented risk and control data','slow-dec':'Slow decisions and reporting','ctrl-ev':'Control effectiveness and evidence','ai-gov':'AI governance and model risk'};
  setTa('ta-pressures',CLIENT_STATE.pressures.map(function(p){return pLabels[p]||p;}).join(', ')||'—');
  setTa('ta-arch',CLIENT_STATE.archetype==='A'?'Universal / cantonal bank':'Private / wealth bank');
  var selCaps=CLIENT_STATE.selectedCapabilityIds.map(getCapabilityById).filter(Boolean);
  setTa('ta-caps',selCaps.map(function(c){return c.name;}).join(', ')||'—');
  var proofCap=CLIENT_STATE.proofCapabilityId?getCapabilityById(CLIENT_STATE.proofCapabilityId):null;
  setTa('ta-proof',proofCap?proofCap.name:'—');
  var proofUC=CLIENT_STATE.proofUseCaseId?getUseCaseById(CLIENT_STATE.proofUseCaseId):null;
  setTa('ta-usecase',proofUC?proofUC.name:'—');
  // Maturity gaps
  var gaps=TRANSFORMATION_BLOCKS.filter(function(b){return CLIENT_STATE.maturity[b.id]&&CLIENT_STATE.targetMaturity[b.id]&&CLIENT_STATE.maturity[b.id]!==CLIENT_STATE.targetMaturity[b.id];}).map(function(b){var cur=MATURITY_LEVELS.find(function(l){return l.id===CLIENT_STATE.maturity[b.id];});var tgt=MATURITY_LEVELS.find(function(l){return l.id===CLIENT_STATE.targetMaturity[b.id];});return b.name+': '+(cur?cur.label:'?')+' → '+(tgt?tgt.label:'?');});
  setTa('ta-gaps',gaps.join('; ')||'—');
  setTa('ta-decisions',CLIENT_STATE.openDecisions.map(function(d){return d.text;}).join('\n')||'—');
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
  var row=sec.querySelector('#teamRow');if(!row)return;
  row.innerHTML=EXPERTS.map(function(e){
    var initials=e.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2);
    var tags=e.tags.map(function(t){return '<span class="etag">'+t+'</span>';}).join('');
    return '<a class="expert" href="'+(e.mail?'mailto:'+e.mail:'#')+'"><img class="expert-photo" src="'+PHOTO_BASE+e.photo+'.jpg" alt="'+e.name+'" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="expert-ph-fallback" style="display:none">'+initials+'</div><div class="expert-name">'+e.name+'</div><div class="expert-title">'+e.title+'</div><div class="expert-tags">'+tags+'</div>'+(e.mail?'<div class="expert-mail">'+e.mail+'</div>':'')+'</a>';
  }).join('');
}

// ── RENDER REGISTRY ──
var renderers={
  'aiLandscape':renderAILandscape,
  'trSystem':renderTransformationSystem,
  'maturityMatrix':renderMaturityMatrix,
  'capHotspots':renderCapabilityHotspots,
  'roleBars':renderRoleBars,
  'oppPortfolio':renderOpportunityPortfolio,
  'shortlist':renderShortlist,
  'useCases':renderUseCases,
  'proofValueCapture':renderProofValueCapture,
  'accentureEdge':renderAccentureEdge,
  'takeaway':renderTakeaway,
  'appCaps':renderAppCaps,
  'team':renderTeam
};

function renderSection(sec){
  var key=sec&&sec.dataset.render;
  if(key&&renderers[key])renderers[key](sec);
}
