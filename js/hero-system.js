/* Living system diagram — canvas hero background.
   Nodes form a loose left→right pipeline; particles flow along edges.
   Decorative only: hidden from AT, static render under reduced motion. */
(function(){
'use strict';
const canvas = document.getElementById('systemCanvas');
if(!canvas) return;
const ctx = canvas.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let W=0, H=0, dpr=1, nodes=[], edges=[], particles=[], raf=0;
let pointer = {x:-1e4, y:-1e4};

function themeColors(){
  const dark = document.documentElement.dataset.theme !== 'light';
  return dark
    ? { node:'rgba(255,180,84,', edge:'rgba(154,163,181,', part:'rgba(95,211,154,', glow:'rgba(255,180,84,' }
    : { node:'rgba(176,106,16,', edge:'rgba(78,85,99,',   part:'rgba(28,143,92,',  glow:'rgba(176,106,16,' };
}

function build(){
  const rect = canvas.parentElement.getBoundingClientRect();
  dpr = Math.min(devicePixelRatio||1, 2);
  W = rect.width; H = rect.height;
  canvas.width = W*dpr; canvas.height = H*dpr;
  canvas.style.width = W+'px'; canvas.style.height = H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  // seeded pseudo-random for a stable layout
  let s = 42;
  const rnd = ()=> (s = (s*16807)%2147483647)/2147483647;

  nodes=[]; edges=[]; particles=[];
  const narrow = W < 800;
  // nodes live in the right ~55% on wide screens, spread everywhere (faint) on narrow
  const x0 = narrow ? .05 : .48, x1 = .97;
  const COLS = 5, ROWS = 4;
  for(let c=0;c<COLS;c++){
    for(let r=0;r<ROWS;r++){
      if(rnd() < .22) continue; // sparse
      nodes.push({
        x: (x0 + (c/(COLS-1))*(x1-x0) + (rnd()-.5)*.06) * W,
        y: (.12 + (r/(ROWS-1))*.76 + (rnd()-.5)*.1) * H,
        r: 2.2 + rnd()*2.4,
        ph: rnd()*Math.PI*2
      });
    }
  }
  // connect each node to 1-2 nearest rightward neighbours
  nodes.forEach((n,i)=>{
    const cands = nodes
      .map((m,j)=>({j, d:Math.hypot(m.x-n.x,m.y-n.y), dx:m.x-n.x}))
      .filter(c=>c.j!==i && c.dx>10 && c.d<W*.22)
      .sort((a,b)=>a.d-b.d)
      .slice(0,2);
    cands.forEach(c=>edges.push({a:i,b:c.j}));
  });
  const np = reduce ? 0 : Math.min(edges.length, 26);
  for(let i=0;i<np;i++){
    particles.push({e:(Math.random()*edges.length)|0, t:Math.random(), v:.0016+Math.random()*.0026});
  }
  if(reduce){ draw(0); }
}

function draw(t){
  const c = themeColors();
  ctx.clearRect(0,0,W,H);

  // edges
  edges.forEach(e=>{
    const a=nodes[e.a], b=nodes[e.b];
    ctx.strokeStyle = c.edge+'0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  });

  // particles
  particles.forEach(p=>{
    const e=edges[p.e]; if(!e) return;
    const a=nodes[e.a], b=nodes[e.b];
    const x=a.x+(b.x-a.x)*p.t, y=a.y+(b.y-a.y)*p.t;
    ctx.fillStyle = c.part+'0.75)';
    ctx.beginPath(); ctx.arc(x,y,1.6,0,7); ctx.fill();
    p.t += p.v;
    if(p.t>=1){ p.t=0; p.e=(Math.random()*edges.length)|0; }
  });

  // nodes (pulse + pointer proximity glow)
  nodes.forEach(n=>{
    const pulse = reduce ? .5 : (Math.sin(t*.0012+n.ph)+1)/2;
    const pd = Math.hypot(pointer.x-n.x, pointer.y-n.y);
    const near = Math.max(0, 1 - pd/180);
    const alpha = .25 + pulse*.3 + near*.4;
    ctx.fillStyle = c.node+alpha.toFixed(3)+')';
    ctx.beginPath(); ctx.arc(n.x,n.y,n.r+near*1.6,0,7); ctx.fill();
    if(near>0){
      ctx.strokeStyle = c.glow+(near*.35).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r+6,0,7); ctx.stroke();
    }
  });
}

function loop(t){ draw(t); raf = requestAnimationFrame(loop); }

const hero = canvas.parentElement;
hero.addEventListener('pointermove', e=>{
  const r = canvas.getBoundingClientRect();
  pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
});
hero.addEventListener('pointerleave', ()=>{ pointer.x=-1e4; pointer.y=-1e4; });

let rt;
addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(build, 150); });
new MutationObserver(()=>{ if(reduce) draw(0); })
  .observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});

build();
if(!reduce) raf = requestAnimationFrame(loop);
document.addEventListener('visibilitychange', ()=>{
  if(reduce) return;
  if(document.hidden){ cancelAnimationFrame(raf); }
  else { raf = requestAnimationFrame(loop); }
});
})();
