/* ============================================================
   Pines · write/autocomplete.js
   Smart autocomplete, (CONT'D) / (MORE)
   ============================================================ */
/* ---- Smart autocomplete, dual dialogue, auto (CONT'D) / (MORE) ---- */
function nrm(t){return String(t||'').toUpperCase().replace(/\s+/g,' ').trim()}
function cdBase(x){return String(x||'').replace(/\(.*?\)/g,'').trim().toUpperCase()}
function cdHas(x){return /\(\s*CONT['’`´]?D\s*\)/i.test(x||'')}
function acFreq(arr){const m=new Map();arr.forEach(x=>{if(x)m.set(x,(m.get(x)||0)+1)});return [...m.entries()].sort((a,b)=>b[1]-a[1]).map(e=>e[0])}
function acRank(list,q,strict){if(!q)return list.slice();const p=[],w=[],c=[];list.forEach(x=>{const u=nrm(x);if(!u||u===q)return;if(u.startsWith(q))p.push(x);else if(!strict&&u.split(' ').some(t=>t.startsWith(q)))w.push(x);else if(!strict&&q.length>=2&&u.includes(q))c.push(x)});return p.concat(w,c)}
function repWord(a,w){const p=a.selectionStart,pre=a.value.slice(0,p).replace(/[A-Za-z]+$/,''),post=a.value.slice(p);a.value=pre+w+post;const q=(pre+w).length;a.setSelectionRange(q,q);syncBlock(a);grow();persist();a.focus();showSg();updStats()}
function canonScene(s,i){const b=s.blocks[i];if(!b||b.t!=='scene')return false;const p=ps(b.x),n=nrm(p.loc);if(!n)return false;for(let j=0;j<s.blocks.length;j++){const x=s.blocks[j];if(j===i||x.t!=='scene')continue;const l=ps(x.x).loc.trim();if(l&&l!==p.loc.trim()&&nrm(l)===n){b.x=`${p.ie} ${l} - ${p.td}`;return true}}return false}
function sugg(s,b,a){
 const raw=a.value,t=raw.toUpperCase().trim(),O=[],k=+a.dataset.k,B=s.blocks;
 if(b.t=='scene'){
  const sel=a.closest('.r').querySelector('[data-p=td]');
  const dm=raw.match(/^(.*?)\s+-\s*([A-Za-z]*)$/);
  if(dm){const L=dm[1].trim(),P=dm[2].toUpperCase();
   TOD.filter(d=>d.startsWith(P)).forEach(d=>O.push({l:d,k:'t',tab:1,f:()=>{a.value=L;if(sel)sel.value=d;syncBlock(a);grow();persist();a.focus();a.setSelectionRange(L.length,L.length);showSg();navUpd();updStats()}}));
   return O.slice(0,16)}
  const own=new Map();B.forEach((x,j)=>{if(j===k||x.t!=='scene')return;const p=ps(x.x),l=p.loc.trim();if(!l)return;const key=nrm(l),e=own.get(key)||{l,c:0,td:[]};e.c++;e.td.push(p.td);own.set(key,e)});
  const known=[...own.values()].sort((x,y)=>y.c-x.c);
  if(!t){let lk='';for(let j=k-1;j>=0;j--)if(B[j].t=='scene'){lk=nrm(ps(B[j].x).loc);break}const li=known.findIndex(e=>nrm(e.l)===lk);if(li>0)known.unshift(known.splice(li,1)[0])}
  acRank(known.map(e=>e.l),t).slice(0,6).forEach(l=>O.push({l,f:()=>setText(a,l)}));
  const hit=own.get(nrm(raw)),pref=hit?acFreq(hit.td):[];
  [...new Set([...pref,...TOD])].forEach(d=>O.push({l:d,k:'t',f:()=>{if(sel)sel.value=d;syncBlock(a);navUpd();persist();showSg()}}))}
 else if(b.t=='char'){
  const base=t.replace(/\(.*$/,'').trim(),seq=[];
  for(let j=k-1;j>=0;j--){const x=B[j];if(x.t=='scene')break;if(x.t=='char'){const n=cdBase(x.x);if(n&&!seq.includes(n))seq.push(n)}}
  const all=acFreq(B.filter((x,j)=>x.t=='char'&&j!==k).map(x=>cdBase(x.x)));
  let order=[];if(!base)order=[...(seq.length>1?[seq[1]]:[]),...seq.slice(0,1),...seq.slice(2)];
  order=[...new Set([...order,...all])];
  acRank(order,base).slice(0,8).forEach(n=>O.push({l:n,f:()=>setText(a,n)}));
  if((all.includes(base)||seq.includes(base))&&!t.includes('('))["(V.O.)","(O.S.)","(O.C.)"].forEach(e=>O.push({l:e,f:()=>setText(a,base+' '+e)}))}
 else if(b.t=='trans')TR.filter(x=>x.startsWith(t)&&x!==t).forEach(x=>O.push({l:x,f:()=>setText(a,x)}));
 else if(b.t=='paren')PA.filter(x=>x.startsWith(a.value.toLowerCase())&&x!==a.value).forEach(x=>O.push({l:x,f:()=>setText(a,x)}));
 else if(b.t=='action'){
  const m=a.value.slice(0,a.selectionStart).match(/([A-Za-z]{2,})$/);
  if(m&&(m[1]===m[1].toUpperCase()||(m[1].length>=3&&/^[A-Z]/.test(m[1])))){
   const names=acFreq(B.filter(x=>x.t=='char').map(x=>cdBase(x.x)));
   acRank(names,m[1].toUpperCase(),true).slice(0,6).forEach(n=>O.push({l:n,f:()=>repWord(a,n)}))}}
 return O.slice(0,16)}

/* (CONT'D): same speaker continues after action, or speaks again straight away */
function cdFlags(list){const out=new Array(list.length).fill(false);let last=null;
 list.forEach((b,i)=>{if(b.t==='scene'||b.t==='trans'){last=null;return}if(b.t!=='char')return;if(b.dd){last=null;return}const n=cdBase(b.x);if(!n)return;if(n===last&&!cdHas(b.x))out[i]=true;last=n});return out}
function addCD(list){if(S.set.autoCD===false)return list;const f=cdFlags(list);return list.map((b,i)=>f[i]?{...b,x:String(b.x).trim()+' (CONT’D)'}:b)}
function txtW(a){const cs=getComputedStyle(a),m=document.createElement('span');['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform'].forEach(k=>m.style[k]=cs[k]);m.style.cssText+=';position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0';m.textContent=a.value||'M';document.body.appendChild(m);const w=m.getBoundingClientRect().width;m.remove();return Math.ceil(w)}
function cdRefresh(){const s=cur(),pg=$('#pg');if(!s||!pg)return;const f=S.set.autoCD===false?[]:cdFlags(s.blocks);
 pg.querySelectorAll('.r.char').forEach(r=>{const i=+r.dataset.r,e=r.querySelector('.cd'),t=r.querySelector('.b');if(!e||!t)return;const on=!!f[i];e.hidden=!on;
  if(on){e.style.font=getComputedStyle(t).font;t.style.flex='none';t.style.width=Math.min(r.clientWidth*.9,txtW(t)+14)+'px'}else{t.style.removeProperty('flex');t.style.removeProperty('width')}})}
