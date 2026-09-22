// ── CONTEXT DRAWER ──
var _drawerTrigger=null;

function openDrawer(title,tabs,activeTab){
  var overlay=document.getElementById('drawerOverlay');
  var panel=document.getElementById('drawerPanel');
  var titleEl=document.getElementById('drawerTitle');
  var tabsEl=document.getElementById('drawerTabs');
  var bodyEl=document.getElementById('drawerBody');
  if(!overlay||!panel)return;
  _drawerTrigger=document.activeElement;
  titleEl.textContent=title||'';
  // Build tabs
  tabsEl.innerHTML=tabs.map(function(t,i){
    return '<button class="drawer-tab'+(i===0||t.id===activeTab?' active':'')+'\" data-dtab="'+t.id+'" onclick="switchDrawerTab(\''+t.id+'\')">'+t.label+'</button>';
  }).join('');
  // Render first tab
  if(tabs.length){renderDrawerTab(tabs,(activeTab||tabs[0].id),bodyEl);}
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  // Focus trap setup
  panel.focus();
  overlay.addEventListener('keydown',drawerKeyHandler);
}

function switchDrawerTab(id){
  var bodyEl=document.getElementById('drawerBody');
  document.querySelectorAll('.drawer-tab').forEach(function(b){b.classList.toggle('active',b.dataset.dtab===id);});
  var tabs=_currentDrawerTabs;
  if(tabs)renderDrawerTab(tabs,id,bodyEl);
}
var _currentDrawerTabs=null;
var _openDrawer=openDrawer;
openDrawer=function(title,tabs,activeTab){_currentDrawerTabs=tabs;_openDrawer(title,tabs,activeTab);};

function renderDrawerTab(tabs,id,bodyEl){
  var tab=tabs.find(function(t){return t.id===id;});
  if(tab&&tab.render){bodyEl.innerHTML='';tab.render(bodyEl);}
  else if(tab&&tab.html){bodyEl.innerHTML=tab.html;}
}

function closeDrawer(){
  var overlay=document.getElementById('drawerOverlay');
  if(!overlay)return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  overlay.removeEventListener('keydown',drawerKeyHandler);
  if(_drawerTrigger){_drawerTrigger.focus();_drawerTrigger=null;}
}

function handleDrawerOverlay(e){if(e.target===document.getElementById('drawerOverlay'))closeDrawer();}

function drawerKeyHandler(e){
  if(e.key==='Escape'){e.preventDefault();closeDrawer();return;}
  // Focus trap
  var panel=document.getElementById('drawerPanel');
  var focusable=panel.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,select,textarea');
  var first=focusable[0],last=focusable[focusable.length-1];
  if(e.key==='Tab'){
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
}

// ── BLOCK DRAWER (5-TAB STANDARD) ──
function openBlockDrawer(blockId){
  var block=getBlockById(blockId);
  if(!block)return;
  // Track selection
  var sel=CLIENT_STATE.selectedBlockIds;
  if(sel.indexOf(blockId)<0)sel.push(blockId);
  var tabs=[
    {id:'why',label:'Why it exists',html:renderBlockWhy(block)},
    {id:'diagnose',label:'Diagnose',html:renderBlockDiagnose(block)},
    {id:'target',label:'What good looks like',html:renderBlockTarget(block)},
    {id:'change',label:'How we change it',html:renderBlockChange(block)},
    {id:'metrics',label:'Metrics',html:renderBlockMetrics(block)}
  ];
  openDrawer(block.name,tabs,'why');
}

function renderBlockWhy(b){
  return '<div class="drawer-section"><div class="dr-q">'+b.executiveQuestion+'</div><p class="dr-body">'+b.why+'</p><div class="dr-h">What goes wrong when this block is missing</div>'+(b.failureModes||[]).map(function(f){return '<div class="dr-item"><i class="ti ti-alert-triangle dr-icon-warn"></i>'+f+'</div>';}).join('')+'</div>';
}
function renderBlockDiagnose(b){
  return '<div class="drawer-section"><div class="dr-h">Diagnostic questions</div>'+(b.diagnosticQuestions||[]).map(function(q){return '<div class="dr-item"><i class="ti ti-question-mark dr-icon"></i>'+q+'</div>';}).join('')+'<div class="dr-h" style="margin-top:14px">Minimum evidence needed</div><div class="dr-body dr-muted">AI-assisted analysis available: Accenture can ingest and map existing policies, processes, controls, and inventory data to accelerate this evidence assembly.</div></div>';
}
function renderBlockTarget(b){
  return '<div class="drawer-section"><div class="dr-h">Target-state principles</div>'+(b.targetPrinciples||[]).map(function(p){return '<div class="dr-item"><i class="ti ti-check dr-icon-good"></i>'+p+'</div>';}).join('')+'<div class="dr-h" style="margin-top:14px">Maturity to aim for</div><div class="dr-body dr-muted">Appropriate target maturity depends on use-case risk tier, data quality, and control environment. Not the highest level by default.</div></div>';
}
function renderBlockChange(b){
  if(!b.interventions)return '<div class="drawer-section"><div class="dr-body dr-muted">Interventions to be scoped with client team.</div></div>';
  var i=b.interventions;
  function section(label,items){if(!items||!items.length)return '';return '<div class="dr-h">'+label+'</div>'+items.map(function(x){return '<div class="dr-item"><i class="ti ti-arrow-right dr-icon"></i>'+x+'</div>';}).join('');}
  return '<div class="drawer-section">'+section('No-regret moves',i.noRegret)+section('Lighthouse activities',i.lighthouse)+section('Industrialise',i.industrialize)+section('Scale',i.scale)+'</div>';
}
function renderBlockMetrics(b){
  return '<div class="drawer-section"><div class="dr-h">Business and operational KPIs</div>'+(b.kpis||[]).map(function(k){return '<div class="dr-item"><i class="ti ti-chart-bar dr-icon"></i>'+k+'</div>';}).join('')+'<div class="dr-note">Baselines must be validated with client data. Do not present hypothesis figures as measured outcomes.</div></div>';
}

// ── CAPABILITY DRAWER ──
function openCapabilityDrawer(capId){
  var cap=getCapabilityById(capId);
  if(!cap)return;
  var cat=getCategoryById(cap.cat);
  var opps=AI_OPPORTUNITIES.filter(function(o){return o.capIds&&o.capIds.indexOf(capId)>-1;});
  var ucs=USE_CASES.filter(function(u){return u.capIds&&u.capIds.indexOf(capId)>-1;});
  var blocks=getBlocksForCapabilities([capId]);
  var tabs=[
    {id:'overview',label:'Overview',html:'<div class="drawer-section"><div class="dr-q">'+cap.outcome+'</div><div class="dr-h">Typical processes and decisions</div><div class="dr-body">'+cap.process+'</div></div>'},
    {id:'opps',label:'AI opportunities',html:'<div class="drawer-section"><div class="dr-h">Opportunity patterns</div>'+(opps.length?opps.map(function(o){return '<div class="dr-item"><span class="status-badge status-'+o.status+'">'+statusLabel(o.status)+'</span> '+o.name+'</div>';}).join(''):'<div class="dr-body dr-muted">No mapped opportunities yet. Scope in working session.</div>')+'</div>'},
    {id:'ucs',label:'Use cases',html:'<div class="drawer-section"><div class="dr-h">Accenture use cases</div>'+(ucs.length?ucs.map(function(u){return '<div class="dr-item"><span class="status-badge status-'+u.status+'">'+statusLabel(u.status)+'</span> '+u.name+'</div>';}).join(''):'<div class="dr-body dr-muted">No direct use-case mapping. Use for discovery in working session.</div>')+'</div>'},
    {id:'blocks',label:'Transformation blocks',html:'<div class="drawer-section"><div class="dr-h">Required transformation blocks</div>'+(blocks.length?blocks.map(function(b){return '<div class="dr-item"><span style="color:'+b.color+';font-size:12px">●</span> '+b.name+' <button class="inline-link" onclick="openBlockDrawer(\''+b.id+'\')">→ Details</button></div>';}).join(''):'<div class="dr-body dr-muted">Block mapping to be confirmed in working session.</div>')+'</div>'}
  ];
  openDrawer((cat?cat.name+': ':'')+cap.name,tabs,'overview');
}

// ── STATUS LABELS ──
function statusLabel(s){var m={live:'LIVE',team:'TEAM',illustrative:'ILLUSTRATIVE',nda:'NDA'};return m[s]||s.toUpperCase();}

// ── STATUS BADGE HTML ──
function badgeHtml(status,label){
  return '<span class="status-badge status-'+status+'">'+(label||statusLabel(status))+'</span>';
}

// ── TOAST ──
function showToast(msg,duration){
  var t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('visible');
  clearTimeout(t._tid);t._tid=setTimeout(function(){t.classList.remove('visible');},duration||2400);
}

// ── INLINE LINK ──
document.addEventListener('click',function(e){
  var btn=e.target.closest('.inline-link');if(btn&&btn.onclick)return;
  // nothing else here for now
});
