/* ============================================================
   Pines · write/dual-dialogue.js
   Dual dialogue
   ============================================================ */
/* ---- dual dialogue: char block flag dd=1 (left) / dd=2 (right), groups must be back to back ---- */
const DDL=['paren','dial'];
function ddGroupAt(B,i){let a=i;while(a>=0&&B[a].t!=='char'){if(!DDL.includes(B[a].t))return null;a--}if(a<0)return null;let e=a+1;while(e<B.length&&DDL.includes(B[e].t))e++;return{a,e}}
function ddPair(B,a){if(!B[a]||B[a].t!=='char'||B[a].dd!==1)return null;let m=a+1;while(m<B.length&&DDL.includes(B[m].t))m++;if(!B[m]||B[m].t!=='char'||B[m].dd!==2)return null;let e=m+1;while(e<B.length&&DDL.includes(B[e].t))e++;return{a,m,e}}
function ddClean(B){const keep=new Set();for(let i=0;i<B.length;i++){const p=ddPair(B,i);if(p){keep.add(p.a);keep.add(p.m)}}B.forEach((b,i)=>{if(b.dd&&!keep.has(i))delete b.dd})}
function rbHTML(s){const B=s.blocks,out=[],col=(x,y)=>{let h='';for(let k=x;k<y;k++)h+=blk(s,B[k],k);return h};
 for(let i=0;i<B.length;){const p=ddPair(B,i);if(p){out.push(`<div class="dd"><div class="ddc">${col(p.a,p.m)}</div><div class="ddc">${col(p.m,p.e)}</div></div>`);i=p.e}else{out.push(blk(s,B[i],i));i++}}return out.join('')}
function toggleDual(){const s=cur();if(!s||tab!='write')return;const B=s.blocks;ddClean(B);const g=ddGroupAt(B,act);
 if(!g)return toast('Put the cursor inside a character’s dialogue first');
 const prev=g.a>0?ddGroupAt(B,g.a-1):null,next=g.e<B.length&&B[g.e].t=='char'?ddGroupAt(B,g.e):null;
 const pair=ddPair(B,g.a)||(prev&&ddPair(B,prev.a));
 if(pair){delete B[pair.a].dd;delete B[pair.m].dd;toast('Dual dialogue removed')}
 else if(prev&&prev.e===g.a&&!B[prev.a].dd){B[prev.a].dd=1;B[g.a].dd=2;toast('Dual dialogue on · two speakers side by side')}
 else if(next&&next.a===g.e&&!B[next.a].dd){B[g.a].dd=1;B[next.a].dd=2;toast('Dual dialogue on · two speakers side by side')}
 else return toast('Dual dialogue needs two speakers back to back. Write the second speaker right after the first.');
 persist();const keep=act;rebuild(s);focus(keep)}
function exUnits(L){const out=[];for(let i=0;i<L.length;){const b=L[i];
 if(b.t==='char'&&b.dd===1){let m=i+1;while(m<L.length&&DDL.includes(L[m].t))m++;
  if(L[m]&&L[m].t==='char'&&L[m].dd===2){let e=m+1;while(e<L.length&&DDL.includes(L[e].t))e++;out.push({d:1,a:L.slice(i,m),b:L.slice(m,e)});i=e;continue}}
 out.push({d:0,a:[b]});i++}return out}
function bodyHTML(s){let n=0;const one=b=>b.t=='scene'?`<p class="scene"${rvx(b)}>${X.nums?++n+'. ':''}${esc(b.x)}</p>`:`<p class="${b.t}"${rvx(b)}>${esc(b.x)}</p>`;
 return exUnits(pdfBlocks(s)).map(u=>u.d?`<table class="dd"><tr><td class="ddc">${u.a.map(one).join('')}</td><td class="ddc">${u.b.map(one).join('')}</td></tr></table>`:one(u.a[0])).join('')}
