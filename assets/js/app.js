// ── LAYOUT DEBUG MODE (?layoutDebug=1) ──
(function(){
  if(new URLSearchParams(location.search).get('layoutDebug')!=='1')return;
  var style=document.createElement('style');
  style.textContent=[
    'section[data-slide]{outline:1px solid rgba(0,120,255,.25)!important;}',
    'section[data-slide]::before{content:attr(id)" ["+attr(data-route)+"] h="+attr(data-density,"standard");position:absolute;top:60px;left:6px;font:9px/1 monospace;color:rgba(0,120,255,.7);z-index:500;white-space:nowrap;}',
    '[data-slide] *{overflow:visible!important;}',
    /* mark horizontally overflowing elements */
    ''
  ].join('');
  document.head.appendChild(style);
  // Overlay: viewport info
  var dbg=document.createElement('div');
  dbg.id='layout-dbg';
  dbg.style.cssText='position:fixed;bottom:8px;left:8px;z-index:9999;background:rgba(0,0,0,.82);color:#0f0;font:10px/1.5 monospace;padding:6px 10px;border-radius:6px;pointer-events:none;';
  document.body.appendChild(dbg);
  function updateDbg(){
    var s=document.querySelector('section[data-slide].active-slide')||document.querySelector('section[data-slide]');
    dbg.innerHTML=
      window.innerWidth+'x'+window.innerHeight+'px'
      +(s?' | slide:'+s.id+' scrollH:'+s.scrollHeight+'/'+s.clientHeight:'')
      +' | bp:'+(window.innerWidth<=520?'xs':window.innerWidth<=768?'sm':window.innerWidth<=1024?'md':'lg');
  }
  window.addEventListener('resize',updateDbg);
  setInterval(updateDbg,600);
  updateDbg();
}());

// ── APP INITIALIZATION ──
window.addEventListener('DOMContentLoaded',function(){
  // Apply saved theme
  var savedTheme=localStorage.getItem('nfr-pitch-theme');
  if(savedTheme){
    document.documentElement.setAttribute('data-theme',savedTheme);
    var icon=document.querySelector('#themeBtn i');
    if(icon)icon.className='ti ti-'+(savedTheme==='dark'?'moon':'sun');
  }
  // Build navigation
  buildNav();
  setupObservers();
  // Hash navigation
  if(location.hash){
    var el=document.getElementById(location.hash.slice(1));
    if(el)setTimeout(function(){el.scrollIntoView();},150);
  }
  // Dynamic year
  document.querySelectorAll('.yr').forEach(function(el){el.textContent=new Date().getFullYear();});
  // Agenda tab default
  switchAgendaTab('story');
  // Route start buttons
  document.querySelectorAll('[data-start-route]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var route=btn.dataset.startRoute;
      setRouteMode(route);
      goToIndex(1); // Go to first content screen
    });
  });
  // Arch toggle (dispatch through store)
  document.querySelectorAll('[data-arch]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var archVal=btn.dataset.arch==='A'?'universal-cantonal':'private-wealth';
      setArchetype(btn.dataset.arch); // keep legacy compat
      if(typeof store!=='undefined')store.dispatch({type:'SET_ARCHETYPE',payload:archVal});
      document.querySelectorAll('[data-arch]').forEach(function(b){b.classList.toggle('active',b.dataset.arch===btn.dataset.arch);});
      var roleSec=document.getElementById('work-workforce-workbench');
      if(roleSec&&rendered.has(getSlideIndex('work-workforce-workbench')))renderRoleBars(roleSec);
    });
  });
  // Lens buttons (dispatch through store)
  document.addEventListener('click',function(e){
    var lensBtn=e.target.closest('[data-lens]');
    if(lensBtn){
      setLens(lensBtn.dataset.lens); // keep legacy compat
      if(typeof store!=='undefined')store.dispatch({type:'SET_LENS',payload:lensBtn.dataset.lens});
      document.querySelectorAll('[data-lens]').forEach(function(b){b.classList.toggle('active',b.dataset.lens===lensBtn.dataset.lens);});
      // Re-render shortlist if visible
      var sl=document.getElementById('exec-shortlist');
      if(sl&&rendered.has(getSlideIndex('exec-shortlist')))renderShortlist(sl);
    }
  });
  // Pressure cards (delegated)
  document.addEventListener('click',function(e){
    var pCard=e.target.closest('[data-pid]');
    if(pCard){
      togglePressure(pCard.dataset.pid);
      document.querySelectorAll('[data-pid]').forEach(function(c){
        var p=c.dataset.pid;
        c.classList.toggle('selected',CLIENT_STATE.pressures.indexOf(p)>-1);
        c.style.opacity=(CLIENT_STATE.pressures.length>=3&&CLIENT_STATE.pressures.indexOf(p)<0)?'0.5':'';
      });
      var cnt=document.getElementById('prsCount');if(cnt)cnt.textContent=CLIENT_STATE.pressures.length+' / 3 selected';
    }
  });
});

// ── NEURAL CANVAS ──
(function(){
  var canvas=document.getElementById('bgCanvas');
  if(!canvas||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var ctx=canvas.getContext('2d'),W,H,pts,sparks,rings,scanY,mx=-9999,my=-9999,paused=false;
  function rnd(a,b){return a+Math.random()*(b-a);}
  function build(){
    var n=Math.min(Math.max(Math.floor(W*H/9000),30),60);
    pts=Array.from({length:n},function(){var hub=Math.random()<.09;return{x:rnd(0,W),y:rnd(0,H),vx:rnd(-.12,.12),vy:rnd(-.08,.08),r:hub?rnd(3,4.5):rnd(1,2.2),hub:hub,hue:Math.random()<.6?274:Math.random()<.55?316:248,ph:rnd(0,Math.PI*2)};});
    sparks=[];rings=[];scanY=0;
  }
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;build();}
  setInterval(function(){if(!pts||sparks.length>12)return;var a=Math.floor(Math.random()*pts.length),b=Math.floor(Math.random()*pts.length);if(a===b)return;var dx=pts[a].x-pts[b].x,dy=pts[a].y-pts[b].y;if(Math.sqrt(dx*dx+dy*dy)<130)sparks.push({a:a,b:b,t:0});},350);
  setInterval(function(){if(!pts||rings.length>3)return;var hubs=pts.filter(function(p){return p.hub;});if(!hubs.length)return;var h=hubs[Math.floor(Math.random()*hubs.length)];rings.push({x:h.x,y:h.y,r:h.r+2,alpha:.5,hue:h.hue});},2800);
  document.addEventListener('visibilitychange',function(){paused=document.hidden;});
  function draw(ts){
    requestAnimationFrame(draw);
    if(paused)return;
    ctx.clearRect(0,0,W,H);
    scanY=(scanY||0)+.18;if(scanY>H+16)scanY=-16;
    var sg=ctx.createLinearGradient(0,scanY-12,0,scanY+12);sg.addColorStop(0,'rgba(161,0,255,0)');sg.addColorStop(.5,'rgba(161,0,255,.04)');sg.addColorStop(1,'rgba(161,0,255,0)');ctx.fillStyle=sg;ctx.fillRect(0,scanY-12,W,24);
    pts.forEach(function(p){var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<90&&d>0){var f=(90-d)/90*.5;p.x+=dx/d*f;p.y+=dy/d*f;}p.x+=p.vx;p.y+=p.vy;if(p.x<-32)p.x=W+32;if(p.x>W+32)p.x=-32;if(p.y<-32)p.y=H+32;if(p.y>H+32)p.y=-32;});
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(161,0,255,'+(Math.pow(1-d/130,2)*.35)+')';ctx.lineWidth=.7;ctx.stroke();}}
    rings=rings.filter(function(r){r.r+=.65;r.alpha-=.006;if(r.alpha<=0)return false;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle='hsla('+r.hue+',100%,68%,'+r.alpha+')';ctx.lineWidth=1.2;ctx.stroke();return true;});
    sparks=sparks.filter(function(s){s.t+=.007;if(s.t>=1)return false;var a=pts[s.a],b=pts[s.b];if(!a||!b||Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2))>182)return false;var sx=a.x+(b.x-a.x)*s.t,sy=a.y+(b.y-a.y)*s.t,g=ctx.createRadialGradient(sx,sy,0,sx,sy,8);g.addColorStop(0,'rgba(255,80,200,1)');g.addColorStop(.4,'rgba(255,80,200,.3)');g.addColorStop(1,'rgba(255,80,200,0)');ctx.beginPath();ctx.arc(sx,sy,8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();return true;});
    var t=ts*.001;pts.forEach(function(p){var pulse=Math.sin(t+p.ph)*.5+.5;if(p.hub){var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*10);g.addColorStop(0,'hsla('+p.hue+',100%,68%,'+(0.28+pulse*.18)+')');g.addColorStop(1,'hsla('+p.hue+',100%,68%,0)');ctx.beginPath();ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.hub?'hsla('+p.hue+',100%,80%,'+(0.8+pulse*.15)+')':'rgba(210,175,255,'+(0.18+pulse*.12)+')';ctx.fill();});
  }
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  window.addEventListener('resize',resize);
  resize();requestAnimationFrame(draw);
}());

// ── RUN ECONOMICS SCENARIO CALCULATOR ──
// All assumptions are illustrative. Replace defaults with client data.
function calcEco(){
  var vol=parseFloat(document.getElementById('eco-vol')&&document.getElementById('eco-vol').value)||5000;
  var review=parseFloat(document.getElementById('eco-review')&&document.getElementById('eco-review').value)||30;
  var ctx=parseFloat(document.getElementById('eco-ctx')&&document.getElementById('eco-ctx').value)||20;
  var reuse=parseFloat(document.getElementById('eco-reuse')&&document.getElementById('eco-reuse').value)||3;

  // Simplified unit economics model (all figures illustrative)
  // Token cost: ~$0.002 per 1k tokens (mid-tier model assumption)
  var tokenCostPer1k=0.002;
  var inferCostPerCase=ctx*tokenCostPer1k;
  // Retrieval: ~$0.0004 per case (illustrative)
  var retrievalCostPerCase=0.0004*ctx;
  // Human review: 15 min at $0.50/min illustrative cost rate
  var reviewMinutes=15;
  var reviewCostRate=0.50;
  var humanCostPerCase=(review/100)*reviewMinutes*reviewCostRate;
  // Platform/infra: amortised over volume, divided by reuse factor
  var platformMonthly=4000;
  var infraCostPerCase=platformMonthly/(vol*reuse);
  // Total per case
  var totalPerCase=inferCostPerCase+retrievalCostPerCase+humanCostPerCase+infraCostPerCase;
  // Cost per governed decision (10% escalation to senior review)
  var escalation=0.10;
  var seniorReviewCost=30*reviewCostRate;
  var costPerDecision=totalPerCase+escalation*seniorReviewCost;
  // Human effort %
  var humanEffortPct=Math.min(Math.round((humanCostPerCase/Math.max(totalPerCase,0.001))*100),99);

  var out=document.getElementById('eco-outputs');
  if(!out)return;
  out.innerHTML=
    '<div class="eco-output"><div class="eco-out-val">'+formatEco(totalPerCase)+'</div><div class="eco-out-lbl">Cost per case</div></div>'
    +'<div class="eco-output"><div class="eco-out-val">'+formatEco(costPerDecision)+'</div><div class="eco-out-lbl">Cost per governed decision</div></div>'
    +'<div class="eco-output"><div class="eco-out-val">'+humanEffortPct+'%</div><div class="eco-out-lbl">Human effort share</div></div>'
    +'<div class="eco-output"><div class="eco-out-val">'+formatEco(totalPerCase*vol)+'</div><div class="eco-out-lbl">Est. monthly total</div></div>';
}

function formatEco(n){
  if(n<0.01)return '<$0.01';
  if(n<1)return '$'+n.toFixed(3);
  if(n<1000)return '$'+n.toFixed(2);
  return '$'+Math.round(n).toLocaleString();
}

// Run initial calculation when run-economics screen is first visible
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(function(){calcEco();if(typeof renderEcoStations==='function')renderEcoStations();},200);
});
