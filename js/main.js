/* Theme, reveal, count-up, scrollspy, copy-email, GitHub stars */
(function(){
'use strict';

/* ---------- Theme (dark-first) ---------- */
const root = document.documentElement;
const saved = localStorage.getItem('theme');
setTheme(saved || 'dark');
function setTheme(t){
  root.dataset.theme = t;
  const sun = document.getElementById('iconSun'), moon = document.getElementById('iconMoon');
  if(sun && moon){ sun.style.display = t==='dark' ? 'block' : 'none'; moon.style.display = t==='dark' ? 'none' : 'block'; }
}
window.__setTheme = setTheme;
window.__toggleTheme = function(){
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', t); setTheme(t);
};
const tBtn = document.getElementById('themeToggle');
if(tBtn) tBtn.addEventListener('click', window.__toggleTheme);

/* ---------- Toast ---------- */
window.__toast = function(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(()=>t.classList.remove('show'), 2200);
};

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Metric count-up ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cio = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.count),
          dec = parseInt(el.dataset.decimals||'0');
    cio.unobserve(el);
    if(reduce){ el.textContent = target.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1200;
    (function tick(now){
      const p = Math.min((now-t0)/dur, 1), eased = 1-Math.pow(1-p,3);
      el.textContent = (target*eased).toFixed(dec);
      if(p<1) requestAnimationFrame(tick);
    })(t0);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* ---------- Scrollspy ---------- */
const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const secs = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if(secs.length){
  const sio = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id));
      }
    });
  },{rootMargin:'-30% 0px -60% 0px'});
  secs.forEach(s=>sio.observe(s));
}

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById('copyEmail');
if(copyBtn) copyBtn.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('smhrizvi281@gmail.com');
    window.__toast('Email copied to clipboard');
  }catch(_){ location.href='mailto:smhrizvi281@gmail.com'; }
});

/* ---------- GitHub stars (graceful) ---------- */
document.querySelectorAll('.gh-stars[data-repo]').forEach(el=>{
  fetch('https://api.github.com/repos/'+el.dataset.repo)
    .then(r=>r.ok ? r.json() : null)
    .then(d=>{ if(d && typeof d.stargazers_count==='number' && d.stargazers_count>0) el.textContent = '★ '+d.stargazers_count; })
    .catch(()=>{});
});

/* ---------- Year ---------- */
const y = document.getElementById('year');
if(y) y.textContent = new Date().getFullYear();
})();
