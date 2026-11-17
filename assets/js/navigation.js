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
  buildCaseThreads();
  buildAtlasLinks();
  loadStoryManifest();
  var ctr=document.getElementById('counter');
  if(ctr)ctr.textContent='1 / '+sections.filter(function(s){return s.dataset.route==='core';}).length;
}

// ── CASE THREAD ──
// Header chip on case screens. Text comes from window.TPRM_CASE, never from the HTML.
function buildCaseThreads(){
  var c=window.TPRM_CASE;if(!c)return;
  var states={};c.states.forEach(function(s){states[s.id]=s.label;});
  document.querySelectorAll('.case-thread[data-case-state]').forEach(function(el){
    var st=el.dataset.caseState;
    el.innerHTML='<span class="case-thread-dot"></span><span class="case-thread-tag">'+c.label+'</span>'
      +'<span class="case-thread-text">'+c.id+'</span><span class="case-thread-sep"></span>'
      +'<span class="case-thread-status s-'+st+'">'+(states[st]||st)+'</span>';
    el.setAttribute('aria-label',c.label+' '+c.id+': '+(states[st]||st));
  });
}

// ── EVIDENCE ATLAS LINKS ──
// Core screens link to one atlas view. The atlas remembers which screen to return to.
function buildAtlasLinks(){
  document.querySelectorAll('[data-atlas-view]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var sec=a.closest('section');
      openAtlasView(a.dataset.atlasView,sec&&sec.id);
    });
  });
}

function openAtlasView(view,fromId){
  try{if(fromId)sessionStorage.setItem('nfr_atlas_return',fromId);}catch(e){}
  window.NFR_ATLAS_PENDING_VIEW=view;
  if(window.EvidenceAtlas&&window.EvidenceAtlas.isReady&&window.EvidenceAtlas.isReady()){
    window.EvidenceAtlas.switchView(view);
    window.NFR_ATLAS_PENDING_VIEW=null;
  }
  goToId('ref-room');
}

function buildChapterTabs(){
  var navCh=document.getElementById('navChapters');if(!navCh)return;
  var coreChapters=chapterMap.filter(function(c){return c.id!=='reference';});
  navCh.innerHTML=coreChapters.map(function(c){
    return '<button class="nav-ch-btn" data-chid="'+c.id+'" onclick="goToIndex('+c.firstIdx+')" title="'+c.title+'">'+c.title+'</button>';
  }).join('')+'<button class="nav-ch-btn" data-chid="reference" onclick="goToId(\'appendix\')" title="Appendix">Appendix</button>';
}

function buildAgendaDrawer(){
  var agendaEl=document.getElementById('agendaStory');if(!agendaEl)return;
  agendaEl.innerHTML=chapterMap.map(function(c){
    var method=sections[c.firstIdx]&&sections[c.firstIdx].dataset.methodLabel||'';
    var slides=c.slides.map(function(s){
      return '<a class="agenda-slide-link" data-sidx="'+s.idx+'" href="#'+s.id+'" onclick="goToIndex('+s.idx+');closeAgenda();return false;"><div class="agenda-slide-dot"></div>'+s.title+'</a>';
    }).join('');
    return '<div class="agenda-chapter"><div class="agenda-ch-head"><div class="agenda-ch-name">'+c.title+'</div><div class="agenda-ch-method">'+method+'</div></div><div class="agenda-slides">'+slides+'</div></div>';
  }).join('')
  // Quick jump: straight to the business-case assumptions drawer
  +'<div class="agenda-chapter"><div class="agenda-ch-head"><div class="agenda-ch-name">QUICK JUMP</div></div><div class="agenda-slides">'
  +'<a class="agenda-slide-link" id="agendaRoiJump" href="#business-case" onclick="closeAgenda();openRoiAssumptions();return false;"><div class="agenda-slide-dot"></div>Business-case assumptions</a>'
  +'</div></div>';
}

// Opens the ROI assumptions drawer from anywhere: scrolls to the business case first.
function openRoiAssumptions(){
  goToId('business-case');
  setTimeout(function(){
    if(window.BusinessCaseScene&&typeof window.BusinessCaseScene.openAssumptions==='function')window.BusinessCaseScene.openAssumptions();
  },450);
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
  if(ctr){if(isRef){ctr.textContent='Appendix';}else{ctr.textContent=(coreIdx+1)+' / '+coreTotal;}}
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
  // V13: fire scene director for the incoming screen
  if(typeof SceneDirector!=='undefined'&&sec&&sec.dataset.scene){
    var manifestEntry=getManifestEntry(sec.id);
    SceneDirector.enter(sec,manifestEntry||{scene:sec.dataset.scene,id:sec.id});
  } else if(typeof SceneDirector!=='undefined'){
    SceneDirector.cancel();
  }
  // Reset pause button icon
  var pb=document.getElementById('scenePauseBtn');
  if(pb){var pi=pb.querySelector('i');if(pi)pi.className='ti ti-player-pause';}
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

// ── MANIFEST LOOKUP ──
// The DOM is the source of truth for which scene a screen plays (data-scene).
// story-manifest.json enriches entries with duration, handoff token and case state.
var _storyManifest=null;
function getManifestEntry(screenId){
  if(!_storyManifest)_storyManifest={};
  if(!_storyManifest[screenId]){
    var sec=document.getElementById(screenId);
    if(!sec||!sec.dataset.scene)return null;
    _storyManifest[screenId]={id:screenId,scene:sec.dataset.scene};
  }
  return _storyManifest[screenId];
}

function loadStoryManifest(){
  if(!window.fetch)return;
  fetch('assets/data/story-manifest.json').then(function(r){return r.ok?r.json():null;}).then(function(m){
    if(!m||!m.screens)return;
    if(!_storyManifest)_storyManifest={};
    m.screens.forEach(function(s){
      var sec=document.getElementById(s.id);
      // A manifest entry never overrides the scene the DOM declares
      if(sec&&sec.dataset.scene)s.scene=sec.dataset.scene;
      _storyManifest[s.id]=s;
    });
  }).catch(function(){});
}

// ── KEYBOARD + SWIPE ──
document.addEventListener('keydown',function(e){
  var tag=e.target&&e.target.tagName;
  if(['INPUT','TEXTAREA','SELECT'].indexOf(tag)>-1)return;
  // Let focused buttons and links activate with Space and Enter
  if((tag==='BUTTON'||tag==='A')&&(e.key===' '||e.key==='Enter'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goToIndex(current+1);}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goToIndex(current-1);}
  else if((e.key==='g'||e.key==='G')&&!e.metaKey&&!e.ctrlKey){e.preventDefault();openAgenda();}
  else if(e.key==='Escape'){closeAgenda();closeDrawer();}
  else if((e.key==='r'||e.key==='R')&&!e.metaKey&&!e.ctrlKey){
    e.preventDefault();
    if(typeof SceneDirector!=='undefined')SceneDirector.replay();
  }
  else if(e.key===' '&&!e.metaKey&&!e.ctrlKey){
    // Space pauses/resumes current scene, but not if a scroll would happen
    if(typeof SceneDirector!=='undefined'){
      e.preventDefault();
      var paused=SceneDirector.togglePause();
      var pb=document.getElementById('scenePauseBtn');
      if(pb){var pi=pb.querySelector('i');if(pi)pi.className=paused?'ti ti-player-play':'ti ti-player-pause';}
    }
  }
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
