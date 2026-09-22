// ── NAVIGATION ──
var sections=[],current=0,rendered=new Set(),chapterMap=[];

function buildNav(){
  sections=Array.from(document.querySelectorAll('section[data-slide]'));
  if(!sections.length)return;
  // Build chapter map from DOM
  var chapters={},chapterOrder=[];
  sections.forEach(function(sec,i){
    sec._slideIdx=i;
    var cid=sec.dataset.chapterId||'unknown';
    if(!chapters[cid]){chapters[cid]={id:cid,title:sec.dataset.chapterTitle||cid,firstIdx:i,slides:[]};chapterOrder.push(cid);}
    chapters[cid].slides.push({idx:i,title:sec.dataset.navTitle||'Slide '+(i+1),id:sec.id,routes:(sec.dataset.routes||'').split(' ').filter(Boolean)});
  });
  chapterMap=chapterOrder.map(function(cid){return chapters[cid];});
  buildChapterTabs();
  buildAgendaDrawer();
  setupRouteMode();
  // V12 continuity
  setTimeout(function(){buildHandoffCues();updateCandidateToken();},0);
}

function buildChapterTabs(){
  var navCh=document.getElementById('navChapters');if(!navCh)return;
  var coreChapters=chapterMap.filter(function(c){return c.id!=='reference';});
  navCh.innerHTML=coreChapters.map(function(c){
    return '<button class="nav-ch-btn" data-chid="'+c.id+'" onclick="goToIndex('+c.firstIdx+')" title="'+c.title+'">'+c.title+'</button>';
  }).join('')+'<button class="nav-ch-btn" data-chid="reference" onclick="goToId(\'app-caps\')" title="Reference">Ref</button>';
}

function buildAgendaDrawer(){
  var agendaEl=document.getElementById('agendaStory');if(!agendaEl)return;
  agendaEl.innerHTML=chapterMap.map(function(c){
    var method=sections[c.firstIdx]&&sections[c.firstIdx].dataset.methodLabel||'';
    var slides=c.slides.map(function(s){
      return '<a class="agenda-slide-link" data-sidx="'+s.idx+'" href="#'+s.id+'" onclick="goToIndex('+s.idx+');closeAgenda();return false;"><div class="agenda-slide-dot"></div>'+s.title+'</a>';
    }).join('');
    return '<div class="agenda-chapter"><div class="agenda-ch-head"><div class="agenda-ch-name">'+c.title+'</div><div class="agenda-ch-method">'+method+'</div></div><div class="agenda-slides">'+slides+'</div></div>';
  }).join('');
  // Questions tab
  var qs=document.getElementById('agendaQuestions');
  if(qs){
    var quickJumps=[
      {label:'WHY NOW? Three pressures are converging.',id:'setting-scene'},
      {label:'WHY NOW? Match technology to the task.',id:'ai-landscape'},
      {label:'WHERE TO START? Find the decisions under pressure.',id:'capability-hotspots'},
      {label:'WHERE TO START? Choose one proof.',id:'exec-shortlist'},
      {label:'WHAT CHANGES? See the work move.',id:'process-twin'},
      {label:'WHAT CHANGES? The use case depends on the system.',id:'transformation-system'},
      {label:'HOW TO PROVE? Define the proof.',id:'proof-value-capture'},
      {label:'HOW TO SCALE? Control cost per successful case.',id:'run-economics'},
      {label:'WHAT NEXT? Agree the next move.',id:'decision-next-step'}
    ];
    qs.innerHTML=quickJumps.map(function(q){
      return '<a class="agenda-qjump" href="#'+q.id+'" onclick="goToId(\''+q.id+'\');closeAgenda();return false;"><i class="ti ti-arrow-right" style="font-size:11px"></i>'+q.label+'</a>';
    }).join('');
  }
}

function setupRouteMode(){
  // Route filtering
  var routeKeys={executive:[0,1,2,3,4,7,9,11,12,15,16,17,18],working:'all',technology:[0,2,3,4,5,11,13,14,15,16,17,18]};
  // Default: show all in executive mode
  // Route mode can be toggled from agenda drawer
}

function setRouteMode(mode){
  CLIENT_STATE.route=mode;
  document.querySelectorAll('.route-mode-btn').forEach(function(b){b.classList.toggle('active',b.dataset.route===mode);});
  // Visual-only for now; filter can be applied to agenda
}

function goToIndex(i){
  if(i<0)i=0;if(i>=sections.length)i=sections.length-1;
  sections[i].scrollIntoView({behavior:'smooth'});
}
function goToId(id){
  var sec=document.getElementById(id);
  if(sec)sec.scrollIntoView({behavior:'smooth'});
}
function getSlideIndex(id){
  for(var i=0;i<sections.length;i++){if(sections[i].id===id)return i;}
  return -1;
}

function updateNav(idx){
  current=idx;
  var sec=sections[idx];
  var isRef=sec&&(sec.dataset.chapterId==='reference'||sec.dataset.route==='reference');
  var coreSections=sections.filter(function(s){return s.dataset.route==='core';});
  var coreIdx=coreSections.indexOf(sec);
  var coreTotal=coreSections.length;
  // Counter
  var ctr=document.getElementById('counter');
  if(ctr){if(isRef){ctr.textContent='Ref';}else{ctr.textContent=(coreIdx+1)+' / '+coreTotal;}}
  // Chapter label
  var chl=document.getElementById('chapterLabel');if(chl&&sec)chl.textContent=sec.dataset.chapterTitle||'';
  // Progress (core only)
  var pf=document.getElementById('progressFill');
  if(pf){if(isRef){pf.style.width='100%';}else if(coreTotal>1){pf.style.width=((coreIdx/(coreTotal-1))*100)+'%';}else{pf.style.width='0%';}}
  // Chapter tab active
  var curCid=sec&&sec.dataset.chapterId;
  document.querySelectorAll('.nav-ch-btn').forEach(function(b){b.classList.toggle('active',b.dataset.chid===curCid);});
  // Agenda links
  document.querySelectorAll('.agenda-slide-link').forEach(function(a){a.classList.toggle('active',parseInt(a.dataset.sidx)===idx);});
  // Hash update
  if(sec&&sec.id)history.replaceState(null,null,'#'+sec.id);
  // Left-edge rail highlight
  if(typeof window.edgeRailHighlight==='function'&&sec&&sec.id)window.edgeRailHighlight(sec.id);
  // Render
  if(!rendered.has(idx)){rendered.add(idx);renderSection(sec);}
}

function setupObservers(){
  var slideObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){var idx=sections.indexOf(e.target);if(idx>-1)updateNav(idx);}});
  },{threshold:0.5});
  sections.forEach(function(s){slideObs.observe(s);});
  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});
  },{threshold:0.12});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el){revObs.observe(el);});
}

// ── AGENDA DRAWER ──
function openAgenda(){
  var ov=document.getElementById('agendaOverlay');if(!ov)return;
  ov.classList.add('open');ov.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  var panel=document.getElementById('agendaPanel');if(panel)panel.focus();
}
function closeAgenda(){
  var ov=document.getElementById('agendaOverlay');if(!ov)return;
  ov.classList.remove('open');ov.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
function handleAgendaOverlay(e){if(e.target===document.getElementById('agendaOverlay'))closeAgenda();}
function switchAgendaTab(id){
  document.querySelectorAll('.agenda-tab-btn').forEach(function(b){b.classList.toggle('active',b.dataset.atab===id);});
  document.querySelectorAll('.agenda-tab-panel').forEach(function(p){p.style.display=p.dataset.panel===id?'':'none';});
}

// ── THEME ──
function toggleTheme(){
  var t=document.documentElement.getAttribute('data-theme');
  var next=t==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('nfr-pitch-theme',next);
  var icon=document.querySelector('#themeBtn i');
  if(icon)icon.className='ti ti-'+(next==='dark'?'moon':'sun');
  document.dispatchEvent(new CustomEvent('nfr:themechange',{detail:{theme:next}}));
}

// ── KEYBOARD + SWIPE ──
document.addEventListener('keydown',function(e){
  if(['INPUT','TEXTAREA'].indexOf(e.target.tagName)>-1)return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goToIndex(current+1);}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goToIndex(current-1);}
  else if((e.key==='g'||e.key==='G')&&!e.metaKey&&!e.ctrlKey){e.preventDefault();openAgenda();}
  else if(e.key==='Escape'){closeAgenda();closeDrawer();}
});
(function(){var sx=0;
  document.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  document.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>52)goToIndex(dx<0?current+1:current-1);},{passive:true});
}());

// ── COPY TAKEAWAY ──
function copyTakeaway(){
  var fields=['ta-pressures','ta-arch','ta-caps','ta-proof','ta-usecase','ta-gaps','ta-decisions'];
  var labels=['Pressures','Archetype','Capabilities','Proof candidate','Proof use case','Maturity gaps','Open decisions'];
  var lines=['NFR AI Executive Conversation: Session Summary',''];
  fields.forEach(function(id,i){var e=document.getElementById(id);if(e)lines.push(labels[i]+': '+(e.textContent||''));});
  if(navigator.clipboard){navigator.clipboard.writeText(lines.join('\n')).then(function(){showToast('Summary copied');});}
}

// ── RESET ──
function resetSession(){if(confirm('Reset all session selections?')){resetState();location.reload();}}

// ── V12 CANDIDATE TOKEN ──
// Screens that should carry the proof-candidate identity badge
var CANDIDATE_SCREENS=['process-twin','transformation-system','work-workforce-workbench',
  'proof-value-capture','industrialization-arch','run-economics','accenture-edge',
  'lean-transition','decision-next-step'];

function updateCandidateToken(){
  var candidateId=typeof store!=='undefined'?store.getState().proofCandidateId:null;
  var candidateName=null;
  if(candidateId&&typeof USE_CASES!=='undefined'){
    var uc=USE_CASES.find(function(u){return u.id===candidateId;});
    if(uc)candidateName=uc.name;
  }
  CANDIDATE_SCREENS.forEach(function(secId){
    var sec=document.getElementById(secId);if(!sec)return;
    var tok=sec.querySelector('.v12-candidate-token');
    if(!tok){
      tok=document.createElement('div');tok.className='v12-candidate-token';
      var inner=sec.querySelector('.inner');if(inner)inner.insertBefore(tok,inner.firstChild);
    }
    if(candidateName){
      tok.innerHTML='<span class="v12-ct-label">Proof candidate</span><span class="v12-ct-name">'+candidateName+'</span>';
      tok.classList.add('v12-ct-active');
    } else {
      tok.innerHTML='<span class="v12-ct-label">Proof candidate</span><span class="v12-ct-pending">Select one on screen 04</span>';
      tok.classList.remove('v12-ct-active');
    }
  });
}

// ── V12 HANDOFF CUES ──
var HANDOFF_MAP={
  'setting-scene':'WHERE TO START?','ai-landscape':'WHERE TO START?',
  'capability-hotspots':'WHERE TO START?','exec-shortlist':'WHAT CHANGES?',
  'process-twin':'WHAT CHANGES?','transformation-system':'WHAT CHANGES?',
  'work-workforce-workbench':'HOW TO PROVE?','proof-value-capture':'HOW TO SCALE?',
  'industrialization-arch':'HOW TO SCALE?','run-economics':'HOW TO SCALE?',
  'accenture-edge':'WHAT NEXT?','lean-transition':'WHAT NEXT?'
};

function buildHandoffCues(){
  Object.keys(HANDOFF_MAP).forEach(function(secId){
    var sec=document.getElementById(secId);if(!sec)return;
    if(sec.querySelector('.v12-handoff'))return;
    var cue=document.createElement('div');
    cue.className='v12-handoff';
    cue.innerHTML='<span class="v12-hf-label">Next question</span><button class="v12-hf-btn" onclick="goToId(\''+nextSectionId(secId)+'\')">'
      +HANDOFF_MAP[secId]+'<i class="ti ti-arrow-down" style="margin-left:5px;font-size:11px"></i></button>';
    sec.appendChild(cue);
  });
}

function nextSectionId(fromId){
  var coreSecs=sections.filter(function(s){return s.dataset.route==='core';});
  for(var i=0;i<coreSecs.length-1;i++){if(coreSecs[i].id===fromId)return coreSecs[i+1].id;}
  return fromId;
}

// Listen for candidate changes
document.addEventListener('nfr:statechange',function(e){
  if(e.detail&&e.detail.action&&e.detail.action.type==='SET_PROOF_CANDIDATE'){
    updateCandidateToken();
  }
});
