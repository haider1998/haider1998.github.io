/* Interactive terminal easter egg — haider@portfolio:~$ */
(function(){
'use strict';
const veil = document.getElementById('termVeil');
const body = document.getElementById('termBody');
const input = document.getElementById('termInput');
if(!veil || !body || !input) return;

const PS1 = '<span class="ps1">haider@portfolio:~$</span> ';
let history = [], hIdx = -1;

const FILES = {
  'resume.pdf': ()=>{ window.open(rel('Syed_Mohd_Haider_Rizvi_Resume.pdf'), '_blank', 'noopener'); return 'opening resume.pdf …'; },
  'contact.txt': ()=> 'email:    <a href="mailto:smhrizvi281@gmail.com">smhrizvi281@gmail.com</a>\nphone:    +91 933 523 1073\ngithub:   <a href="https://github.com/haider1998" target="_blank" rel="noopener">github.com/haider1998</a>\nlinkedin: <a href="https://www.linkedin.com/in/s-m-h-rizvi-0a40441ab/" target="_blank" rel="noopener">linkedin.com/in/s-m-h-rizvi-0a40441ab</a>'
};

function rel(p){ return (location.pathname.includes('/case-studies/') ? '../' : '') + p; }

const CMDS = {
  help(){ return [
    '<span class="acc">available commands</span>',
    '  whoami        who is this person',
    '  projects      selected work',
    '  skills        technical capabilities',
    '  resume        open the résumé (PDF)',
    '  contact       how to reach me',
    '  ls            list files',
    '  cat &lt;file&gt;    print a file',
    '  sudo hire-me  (try it)',
    '  clear         clear screen',
    '  exit          close terminal'
  ].join('\n'); },
  whoami(){ return [
    '<span class="acc">Syed Mohd Haider Rizvi</span> — AI Platform Engineer',
    '',
    'Consultant Specialist (AI Products) @ HSBC · ex-Ford',
    'Builds agentic AI systems, LLM eval frameworks, and',
    'petabyte-scale data platforms. 4.5+ yrs, Fortune-100 scale.',
    '',
    '<span class="dim">scale:</span>  25PB+ platforms · 500K+ users · $2.4M projected savings',
    '<span class="dim">base:</span>   Pune, IN — open to remote &amp; US/UK/EU relocation'
  ].join('\n'); },
  projects(){ return [
    '<span class="acc">TrueArch</span>           MCP server + eval harness   <span class="dim">+26% code quality (A/B)</span>',
    '<span class="acc">agentic-optimizer</span>  LLM agents on 25PB BigQuery <span class="dim">$2.4M/yr projected</span>',
    '<span class="acc">nl2sql-copilot</span>     GPT → production SQL @ HSBC <span class="dim">-80% dev time</span>',
    '<span class="acc">PyVisualizer</span>       Python AST → arch diagrams  <span class="dim">100+ devs</span>',
    '<span class="acc">PipelineIQ</span>         BigQuery cost prediction    <span class="dim">84% accuracy</span>',
    '',
    '<span class="dim">→ case studies: ' +
      '<a href="'+rel('case-studies/agentic-optimizer.html')+'">optimizer</a> · ' +
      '<a href="'+rel('case-studies/petabyte-platform.html')+'">25PB platform</a> · ' +
      '<a href="'+rel('case-studies/nl2sql-copilot.html')+'">nl2sql</a></span>'
  ].join('\n'); },
  skills(){ return [
    '<span class="dim">agentic-ai</span>   agents · LLM evals · MCP · RAG · LangChain · ADK',
    '<span class="dim">languages</span>    Python · Java · SQL · Go',
    '<span class="dim">cloud</span>        GCP · AWS · Kubernetes · Docker · CI/CD',
    '<span class="dim">data</span>         BigQuery · PostgreSQL · distributed systems'
  ].join('\n'); },
  resume(){ return FILES['resume.pdf'](); },
  contact(){ return FILES['contact.txt'](); },
  ls(){ return Object.keys(FILES).join('   '); },
  clear(){ body.innerHTML=''; return null; },
  exit(){ close(); return null; },
  sudo(args){
    if(args.trim()==='hire-me'){
      return [
        '[sudo] password for recruiter: <span class="dim">********</span>',
        '',
        '<span class="ps1">✓ access granted.</span> excellent decision.',
        '',
        'initiating hire sequence …',
        '  → email:  <a href="mailto:smhrizvi281@gmail.com?subject=Let%27s%20talk">smhrizvi281@gmail.com</a>',
        '  → resume: <a href="'+rel('Syed_Mohd_Haider_Rizvi_Resume.pdf')+'" target="_blank" rel="noopener">resume.pdf</a>',
        '',
        '<span class="dim">warning: candidate may significantly improve your systems.</span>'
      ].join('\n');
    }
    return 'sudo: only <span class="acc">sudo hire-me</span> is permitted on this host';
  },
  cat(args){
    const f = args.trim();
    if(!f) return 'cat: missing file operand';
    if(FILES[f]){ const v = FILES[f]; return typeof v==='function' ? v() : v; }
    return 'cat: '+esc(f)+': no such file';
  }
};

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function print(html){
  const pre = document.createElement('pre');
  pre.innerHTML = html;
  body.appendChild(pre);
  body.scrollTop = body.scrollHeight;
}

function run(line){
  print(PS1+'<span class="cmd">'+esc(line)+'</span>');
  const trimmed = line.trim();
  if(!trimmed) return;
  history.push(trimmed); hIdx = history.length;
  const sp = trimmed.indexOf(' ');
  const cmd = (sp<0 ? trimmed : trimmed.slice(0,sp)).toLowerCase();
  const args = sp<0 ? '' : trimmed.slice(sp+1);
  const fn = CMDS[cmd];
  const out = fn ? fn(args) : 'command not found: '+esc(cmd)+' — try <span class="acc">help</span>';
  if(out) print(out);
}

function open(){
  veil.classList.add('open');
  if(!body.childElementCount){
    print('<span class="dim">TrueOS 1.0 (portfolio) — last login: from a recruiter\'s laptop</span>');
    print('<span class="dim">type</span> <span class="acc">help</span> <span class="dim">to get started, or</span> <span class="acc">sudo hire-me</span> <span class="dim">to skip ahead.</span>');
  }
  setTimeout(()=>input.focus(), 0);
}
function close(){ veil.classList.remove('open'); }
window.__openTerm = open;

input.addEventListener('keydown', e=>{
  if(e.key==='Enter'){ run(input.value); input.value=''; }
  else if(e.key==='ArrowUp'){ e.preventDefault(); if(hIdx>0){ hIdx--; input.value=history[hIdx]||''; } }
  else if(e.key==='ArrowDown'){ e.preventDefault(); if(hIdx<history.length){ hIdx++; input.value=history[hIdx]||''; } }
  else if(e.key==='Escape'){ close(); }
});
veil.addEventListener('click', e=>{ if(e.target===veil) close(); });
const xBtn = document.getElementById('termClose');
if(xBtn) xBtn.addEventListener('click', close);
['termHintBtn','termFootBtn'].forEach(id=>{
  const b = document.getElementById(id);
  if(b) b.addEventListener('click', open);
});
document.addEventListener('keydown', e=>{
  if(e.key==='`' && !e.metaKey && !e.ctrlKey && !e.altKey){
    const tag = (document.activeElement||{}).tagName;
    if(tag!=='INPUT' && tag!=='TEXTAREA'){ e.preventDefault(); veil.classList.contains('open') ? close() : open(); }
  }
});
})();
