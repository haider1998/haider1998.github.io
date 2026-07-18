/* ⌘K command palette */
(function(){
'use strict';
const veil = document.getElementById('paletteVeil');
const input = document.getElementById('paletteInput');
const list = document.getElementById('paletteList');
if(!veil || !input || !list) return;

const IC = {
  sec: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  act: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m13 2-9 13h7l-1 7 9-13h-7z"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>'
};

// case-study pages live one level down from index; prefix-aware
const depth = location.pathname.includes('/case-studies/') ? '../' : '';
const CMDS = [
  {t:'Go to Work', h:'section', i:IC.sec, run:()=>go(depth+'index.html#work')},
  {t:'Go to Experience', h:'section', i:IC.sec, run:()=>go(depth+'index.html#experience')},
  {t:'Go to Skills', h:'section', i:IC.sec, run:()=>go(depth+'index.html#skills')},
  {t:'Go to About / Quick facts', h:'section', i:IC.sec, run:()=>go(depth+'index.html#about')},
  {t:'Go to Contact', h:'section', i:IC.sec, run:()=>go(depth+'index.html#contact')},
  {t:'Case study: Agentic BigQuery Optimizer', h:'$2.4M · Ford', i:IC.doc, run:()=>go(depth+'case-studies/agentic-optimizer.html')},
  {t:'Case study: 25PB Cross-Cloud Platform', h:'Ford', i:IC.doc, run:()=>go(depth+'case-studies/petabyte-platform.html')},
  {t:'Case study: NL→SQL Copilot', h:'HSBC', i:IC.doc, run:()=>go(depth+'case-studies/nl2sql-copilot.html')},
  {t:'Copy email address', h:'smhrizvi281@gmail.com', i:IC.act, run:copyEmail},
  {t:'Download résumé', h:'PDF', i:IC.doc, run:()=>open_(depth+'Syed_Mohd_Haider_Rizvi_Resume.pdf')},
  {t:'Toggle theme', h:'dark / light', i:IC.act, run:()=>{ if(window.__toggleTheme) window.__toggleTheme(); }},
  {t:'Open terminal', h:'~$', i:IC.act, run:()=>{ close(); if(window.__openTerm) window.__openTerm(); }},
  {t:'Open GitHub profile', h:'github.com', i:IC.ext, run:()=>open_('https://github.com/haider1998')},
  {t:'Open LinkedIn', h:'linkedin.com', i:IC.ext, run:()=>open_('https://www.linkedin.com/in/s-m-h-rizvi-0a40441ab/')},
  {t:'View page source', h:'repo', i:IC.ext, run:()=>open_('https://github.com/haider1998/haider1998.github.io')}
];

let filtered = CMDS, sel = 0, isOpen = false;

function go(url){ close(); location.href = url; }
function open_(url){ close(); window.open(url, '_blank', 'noopener'); }
async function copyEmail(){
  close();
  try{ await navigator.clipboard.writeText('smhrizvi281@gmail.com'); if(window.__toast) window.__toast('Email copied to clipboard'); }
  catch(_){ location.href = 'mailto:smhrizvi281@gmail.com'; }
}

function render(){
  list.innerHTML = '';
  if(!filtered.length){
    list.innerHTML = '<div class="palette-empty">No matches. Try “contact” or “resume”.</div>';
    return;
  }
  filtered.forEach((c, i)=>{
    const b = document.createElement('button');
    b.className = 'palette-item'+(i===sel?' sel':'');
    b.setAttribute('role','option');
    b.innerHTML = c.i+'<span>'+c.t+'</span><span class="hint">'+c.h+'</span>';
    b.addEventListener('click', c.run);
    b.addEventListener('pointerenter', ()=>{ sel=i; markSel(); });
    list.appendChild(b);
  });
}
function markSel(){
  [...list.children].forEach((el,i)=>el.classList.toggle('sel', i===sel));
  const el = list.children[sel];
  if(el && el.scrollIntoView) el.scrollIntoView({block:'nearest'});
}
function fold(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
function filter(){
  const q = fold(input.value.trim());
  filtered = !q ? CMDS : CMDS.filter(c=>fold(c.t+' '+c.h).includes(q));
  sel = 0; render();
}

function open(){ isOpen=true; veil.classList.add('open'); input.value=''; filter(); setTimeout(()=>input.focus(), 0); }
function close(){ isOpen=false; veil.classList.remove('open'); }
window.__openPalette = open;

document.addEventListener('keydown', e=>{
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); isOpen ? close() : open(); return; }
  if(!isOpen) return;
  if(e.key==='Escape'){ close(); }
  else if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1, filtered.length-1); markSel(); }
  else if(e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(sel-1, 0); markSel(); }
  else if(e.key==='Enter'){ e.preventDefault(); if(filtered[sel]) filtered[sel].run(); }
});
input.addEventListener('input', filter);
veil.addEventListener('click', e=>{ if(e.target===veil) close(); });
const btn = document.getElementById('paletteBtn');
if(btn) btn.addEventListener('click', open);
})();
