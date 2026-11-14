/* ============================================================
   Pines · views/find-replace.js
   Find & replace
   ============================================================ */
/* ---- Find & replace ---- */
let FR={q:'',r:'',cs:false,sc:'all',k:-1};
const esr=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),inSc=b=>!(FR.sc=='char'&&b.t!='char'||FR.sc=='dial'&&b.t!='dial'||FR.sc=='scene'&&b.t!='scene');
function frM(s){if(!FR.q)return[];const re=new RegExp(esr(FR.q),FR.cs?'g':'gi'),M=[];s.blocks.forEach((b,i)=>{if(!inSc(b))return;let m;re.lastIndex=0;while((m=re.exec(b.x))){M.push({i,p:m.index});if(!m[0].length)re.lastIndex++}});return M}
function frCount(){const e=$('#frc');if(e){const M=frM(cur());e.textContent=FR.q?(M.length?`${Math.max(FR.k,0)+1} of ${M.length}`:'No matches'):''}}
function frGo(d){const s=cur(),M=frM(s);if(!M.length){FR.k=-1;return frCount()}FR.k=((FR.k+d)%M.length+M.length)%M.length;const t=M[FR.k];act=t.i;const a=ta(t.i);if(a){a.scrollIntoView({block:'center',behavior:'smooth'});a.focus();if(s.blocks[t.i].t!='scene')a.setSelectionRange(t.p,t.p+FR.q.length)}frCount()}
function frRep(){const s=cur(),M=frM(s);if(!M.length)return;if(FR.k<0)FR.k=0;const t=M[FR.k],b=s.blocks[t.i];b.x=b.x.slice(0,t.p)+FR.r+b.x.slice(t.p+FR.q.length);if(s.rm&&s.rev>0)b.r=s.rev;persist();rebuild(s);FR.k--;frGo(1)}
function frAll(){const s=cur();if(!FR.q)return;const re=new RegExp(esr(FR.q),FR.cs?'g':'gi');let n=0;s.blocks.forEach(b=>{if(!inSc(b))return;const x=b.x.replace(re,()=>{n++;return FR.r});if(x!==b.x){b.x=x;if(s.rm&&s.rev>0)b.r=s.rev}});persist();rebuild(s);frCount();toast(`Replaced ${n} match${n==1?'':'es'}`)}
const frUI=()=>`<div class="card frp"><div class="frr"><input data-fr="q" placeholder="Find" value="${esc(FR.q)}"><input data-fr="r" placeholder="Replace with" value="${esc(FR.r)}"></div><div class="frr"><select data-fr="sc">${[['all','Everywhere'],['char','Character names'],['dial','Dialogue'],['scene','Scene headings']].map(([k,n])=>`<option value="${k}" ${FR.sc==k?'selected':''}>${n}</option>`).join('')}</select><label><input type="checkbox" data-fr="cs" ${FR.cs?'checked':''}>Match case</label><span class="mut" id="frc"></span></div><div class="frr"><button data-a="frp1">Prev</button><button data-a="frn">Next</button><button data-a="frr">Replace</button><button class="pri" data-a="fra">Replace all</button><button data-a="fr">Close</button></div></div>`;
document.addEventListener('input',e=>{const a=e.target,k=a.dataset.fr;if(!k)return;FR[k]=a.type=='checkbox'?a.checked:a.value;FR.k=-1;frCount()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=='f'&&cur()&&tab=='write'){e.preventDefault();A.fr()}});
