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
  // Arch toggle
  document.querySelectorAll('[data-arch]').forEach(function(btn){
    btn.addEventListener('click',function(){
      setArchetype(btn.dataset.arch);
      document.querySelectorAll('[data-arch]').forEach(function(b){b.classList.toggle('active',b.dataset.arch===btn.dataset.arch);});
      var roleSec=document.getElementById('work-workforce-workbench');
      if(roleSec&&rendered.has(getSlideIndex('work-workforce-workbench')))renderRoleBars(roleSec);
    });
  });
  // Lens buttons (delegated)
  document.addEventListener('click',function(e){
    var lensBtn=e.target.closest('[data-lens]');
    if(lensBtn){
      setLens(lensBtn.dataset.lens);
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
