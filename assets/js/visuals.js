// ── SCREEN RENDERERS ──
// Each renderer takes the section element and populates it

// ── TRANSFORMATION SYSTEM (Screen 4): deterministic SVG layout ──
function renderTransformationSystem(sec){
  var container=sec.querySelector('#trSysGrid');if(!container)return;
  container.innerHTML='';
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
  var svg=mk('svg',{viewBox:'0 0 '+W+' '+H,width:'100%',height:'100%',xmlns:NS,role:'img','aria-label':'AI Risk Transformation System map'});
  container.appendChild(svg);
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
    var g=mk('g',{cursor:'pointer','aria-label':b.name});
    g.addEventListener('click',function(){openBlockDrawer(b.id);});
    g.addEventListener('mouseenter',function(){g.querySelector('rect').setAttribute('stroke-opacity','0.85');});
    g.addEventListener('mouseleave',function(){g.querySelector('rect').setAttribute('stroke-opacity','0.5');});
    var rect=mk('rect',{x:L.x,y:L.y,width:L.w,height:L.h,rx:'8',fill:blockBg,stroke:b.color,'stroke-width':L.rail?'1':'1.5','stroke-opacity':'0.5'});
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

// ── AI LANDSCAPE: 5-band Provability Frontier ──
function renderAILandscape(sec){
  var container=sec.querySelector('#aiLandscapeGrid');if(!container)return;
  var techs=[
    {id:'rules',  name:'Rules & workflow',  icon:'git-branch',   pct:85,color:'#0F8A62',
     desc:'Deterministic routing, thresholds, conditional logic. No inference cost.',
     human:'Design rules and handle exceptions',
     control:'Are rules complete, current, and tested?'},
    {id:'rpa',    name:'RPA & orchestration',icon:'refresh',      pct:80,color:'#0E7490',
     desc:'Repeatable cross-system execution and data movement. Compute only.',
     human:'Monitor failures and edge cases',
     control:'What happens when the process breaks?'},
    {id:'ml',     name:'Analytics & ML',    icon:'chart-line',   pct:65,color:'#B46A00',
     desc:'Prediction, scoring, and anomaly detection. Inference scales with volume.',
     human:'Review model output; approve consequential decisions',
     control:'Is the model validated and monitored for drift?'},
    {id:'genai',  name:'GenAI copilots',    icon:'message-bolt', pct:55,color:'#A100FF',
     desc:'Search, summarise, draft, and explain. Token cost per call.',
     human:'Review every output before use or distribution',
     control:'Is output reviewed before leaving the team?'},
    {id:'agents', name:'AI Agents',         icon:'robot',        pct:30,color:'#FF50C8',
     desc:'Plan, coordinate, and act across tools and systems. Highest cost and risk.',
     human:'Define scope; approve consequential actions; set guardrails',
     control:'What can the agent do without human approval?'}
  ];
  var TECHMAP={
    rules:['kri-monitoring'],
    rpa:['control-test-automation','regulatory-report-ai','kyc-automation-ai'],
    ml:['model-validation-ai','data-quality-ai','credit-portfolio-ai','aml-detection-ai','sanctions-screening-ai','fraud-detection-ai','third-party-risk-ai','oprisk-event-triage'],
    genai:['rcsa-ai-workflow','regulatory-signal-extraction','reg-change-impact-ai','model-doc-automation','board-report-ai','credit-assessment-ai','stress-scenario-ai'],
    agents:['horizon-scanning-ai']
  };
  var STATUS_COLOR={live:'#10B981',team:'#A100FF',illustrative:'#B46A00',nda:'#6366F1'};
  var cols=techs.map(function(t){
    var chips=(TECHMAP[t.id]||[]).map(function(id){
      var o=AI_OPPORTUNITIES&&AI_OPPORTUNITIES.find(function(x){return x.id===id;});
      if(!o)return '';
      var sc=STATUS_COLOR[o.status]||'var(--text-2)';
      return '<div class="ail-chip" style="border-color:'+sc+';color:'+sc+'">'+o.name+'</div>';
    }).join('');
    return '<div class="ail-col" style="--bc:'+t.color+'" data-band="'+t.id+'">'
      +'<div class="ail-col-hdr">'
        +'<i class="ti ti-'+t.icon+' ail-col-icon"></i>'
        +'<span class="ail-col-name">'+t.name+'</span>'
        +'<span class="ail-col-pct">'+t.pct+'%</span>'
      +'</div>'
      +'<div class="ail-col-bar"><div class="ail-col-bar-fill" style="width:'+t.pct+'%"></div></div>'
      +'<div class="ail-col-body">'
        +'<div class="ail-col-desc">'+t.desc+'</div>'
        +'<div class="ail-col-lbl">Human role</div><div class="ail-col-val">'+t.human+'</div>'
        +'<div class="ail-col-lbl">Control question</div><div class="ail-col-val ail-ctrl">'+t.control+'</div>'
      +'</div>'
      +(chips?'<div class="ail-col-opps">'+chips+'</div>':'')
    +'</div>';
  }).join('');
  container.innerHTML=
    '<div class="ail-landscape-grid">'+cols+'</div>'
    +'<div class="ail-landscape-footer">'
      +'<span class="ail-footer-principle">Use the least complex technology that can own the work safely and economically.</span>'
      +'<div class="ail-foundations">'
        +'<span>Trusted data</span><span>Identity and access</span>'
        +'<span>Human accountability</span><span>Testing and monitoring</span>'
        +'<span>Logging</span><span>Cost governance</span>'
      +'</div>'
    +'</div>';
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
    {id:'ucs',label:'Use cases',html:'<div class="drawer-section"><div class="dr-h">Accenture use cases for this opportunity</div>'+(ucs.length?ucs.map(function(u){return '<div class="dr-item"><span class="status-badge status-'+u.status+'">'+statusLabel(u.status)+'</span> '+u.name+'</div>';}).join(''):'<div class="dr-body dr-muted">No direct use case. Discuss scope in working session.</div>')+'</div>'}
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
  grid.innerHTML=visibleTeam.map(function(e){
    var initials=e.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2);
    var focusHtml=(e.approvedFocus&&e.approvedFocus.length)?
      '<div class="team-focus">'+e.approvedFocus.map(function(f){return '<span class="etag">'+f+'</span>';}).join('')+'</div>':'';
    var titleHtml=e.approvedTitle?'<div class="expert-title">'+e.approvedTitle+'</div>':'';
    return '<a class="expert" href="'+(e.mail?'mailto:'+e.mail:'#')+'" aria-label="'+e.name+(e.mail?' ('+e.mail+')':'')+'">'+
      '<img class="expert-photo" src="'+e.photo+'" alt="'+e.name+'" loading="lazy"'+
        ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'+
      '<div class="expert-ph-fallback" style="display:none">'+initials+'</div>'+
      '<div class="expert-name">'+e.name+'</div>'+
      titleHtml+
      focusHtml+
      (e.mail?'<div class="expert-mail">'+e.mail+'</div>':'')
    +'</a>';
  }).join('');
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

// ── RENDER CONTRACTS ──
var VISUAL_CONTRACTS={
  solutionPortfolio:'solutionPortfolioArea',
  aiLandscape:'aiLandscapeGrid',trSystem:'trSysGrid',maturityMatrix:'maturityTable',
  capHotspots:'capHotspotArea',roleBars:'rolesTable',oppPortfolio:'oppPortfolioArea',
  shortlist:'shortlistGrid',useCases:'ucGrid',proofValueCapture:'valueWaterfall',
  accentureEdge:'engineA',takeaway:'ta-pressures',appCaps:'appCapsBody',team:'teamRow'
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
  if(key&&renderers[key])safeRender(renderers[key],sec);
}
