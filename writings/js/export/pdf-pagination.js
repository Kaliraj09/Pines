/* ============================================================
   Pines · export/pdf-pagination.js
   PDF with real page breaks
   ============================================================ */
/* ---- PDF with real page breaks: (MORE) at the bottom, NAME (CONT'D) at the top of the next page ---- */
function pdfPaginate(d,limit){
 const src=d.getElementById('src');if(!src)throw new Error('no src');
 const q=[...src.children],host=d.createElement('div');src.replaceWith(host);
 let pg;const newPg=()=>{pg=d.createElement('div');pg.className='pg';host.appendChild(pg)};newPg();
 const H=()=>pg.getBoundingClientRect().height,cl=(e,c)=>e&&e.classList&&e.classList.contains(c);
 const keepNext=e=>cl(e,'scene')||cl(e,'char')||cl(e,'paren');
 const moveNext=el=>{const mv=[el];let p=el.previousElementSibling;while(p&&keepNext(p)){mv.unshift(p);p=p.previousElementSibling}
  if(cl(el,'trans')&&p){mv.unshift(p);p=p.previousElementSibling}
  if(!p&&mv.length===pg.children.length)return false;mv.forEach(x=>x.remove());newPg();mv.forEach(x=>pg.appendChild(x));return true};
 const splitMore=el=>{let c=el.previousElementSibling;while(c&&!cl(c,'char')){if(!(cl(c,'paren')||cl(c,'dial')))return false;c=c.previousElementSibling}
  if(!c)return false;const orig=el.textContent,tk=orig.trim().split(/(\s+)/),N=(tk.length+1)/2;if(N<4)return false;
  const more=d.createElement('p');more.className='more';more.textContent='(MORE)';
  const first=n=>tk.slice(0,2*n-1).join(''),rest=n=>tk.slice(2*n).join('');
  const lh=parseFloat(d.defaultView.getComputedStyle(el).lineHeight)||16,lines=t=>{el.textContent=t;return Math.round(el.getBoundingClientRect().height/lh)};
  const fits=n=>{el.textContent=first(n);el.after(more);const ok=H()<=limit;more.remove();return ok};
  let lo=1,hi=N-1,best=0;while(lo<=hi){const mid=(lo+hi)>>1;if(fits(mid)){best=mid;lo=mid+1}else hi=mid-1}
  while(best>0&&lines(rest(best))<2)best--;
  if(best<1||lines(first(best))<2){el.textContent=orig;return false}
  el.textContent=first(best);el.after(more);
  const cue=c.cloneNode(true),ct=cue.textContent.trim();cue.textContent=cdHas(ct)?ct:ct+' (CONT’D)';
  const re=el.cloneNode(false);re.textContent=rest(best);newPg();q.unshift(cue,re);return true};
 while(q.length){const el=q.shift();pg.appendChild(el);if(H()<=limit)continue;
  if(S.set.autoCD!==false&&cl(el,'dial')&&splitMore(el))continue;moveNext(el)}
 host.querySelectorAll('.pg').forEach(p=>{if(!p.children.length)p.remove()})}
async function printPaged(s){
 const A4=X.size==='A4',pw=A4?8.2677:8.5,ph=A4?11.6929:11,my=X.margin==='Narrow'?.55:X.margin==='Wide'?1.25:1,mx=X.margin==='Wide'?1.35:1,cw=Math.floor((pw-2*mx)*96),limit=Math.floor((ph-2*my)*96)-16;
 const f=document.createElement('iframe');f.style.cssText=`position:fixed;left:-99999px;top:0;width:${cw}px;height:900px;border:0`;document.body.appendChild(f);
 try{await new Promise((res,rej)=>{f.onload=res;f.onerror=rej;f.srcdoc=sHTML(s,true)});
  const d=f.contentDocument;try{await d.fonts.ready}catch(e){}
  pdfPaginate(d,limit);f.contentWindow.focus();f.contentWindow.print();setTimeout(()=>f.remove(),60000)}
 catch(e){f.remove();printHTML(sHTML(s))}}

function showSg(){const s=cur(),b=s.blocks[act],a=ta(act);if(!b||!a)return;const pd=pend(s,a);SG=pd?pd.c.map(w=>({l:w,f:()=>commit(a,w,'')})):sugg(s,b,a);
 const chips=SG.map((x,i)=>`<button class="${x.k||''}" data-a="sg" data-i="${i}">${pd?`<small>${i+1}</small>`:''}${esc(x.l)}</button>`).join('');
 $('#sg').innerHTML=(pd?`<span class="pv">தமிழ் · ${esc(pd.w)}</span>`:'')+(chips||'<span class="mut">Smart suggestions appear here — locations, characters, transitions, day/night</span>');
 let p=$('#pop');if(pd){if(!p){p=document.createElement('div');p.id='pop'}p.innerHTML=`<div class="pi"><span class="pv">${esc(pd.w)}</span>${chips}</div>`;a.closest('.r').after(p)}else if(p)p.remove();
 T.forEach((t,i)=>{const e=$('#ty'+i);if(e)e.classList.toggle('on',t==b.t)})}
let dirty=false;
 const invalidateScriptCertificates=(sc)=>{if(!sc||!Array.isArray(sc.reg))return;sc.reg.forEach(r=>{if(r.status!=='expired'){r.status='expired';r.reason='The screenplay was edited after this certificate was issued.';r.invalidatedAt=Date.now()}})};
 const persist=()=>{const s=cur();if(s){s.upd=Date.now();invalidateScriptCertificates(s)}dirty=true;clearTimeout(tm);tm=setTimeout(()=>{dirty=false;save()},250)};
function flush(){if(dirty){clearTimeout(tm);dirty=false;save()}}
addEventListener('pagehide',flush);addEventListener('beforeunload',flush);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
document.addEventListener('input',e=>{const a=e.target;if(a.dataset.f){cur()[a.dataset.f]=a.value;persist();return}
 if(a.dataset.x){X[a.dataset.x]=a.type=='checkbox'?a.checked:a.value;return}
 if(!a.classList.contains('b'))return;const s=cur();
 if(tam(s)&&e.data&&/^[ 1-7]$/.test(e.data)&&s.blocks[+a.dataset.k].t!='trans'){const p=a.selectionStart,m=a.value.slice(0,p-1).match(/[A-Za-z]+$/);if(m){const c=cands(m[0]),w=e.data==' '?c[0]:c[+e.data-1];if(w){const pre=a.value.slice(0,p-1-m[0].length),ins=w+(e.data==' '?' ':''),post=a.value.slice(p);a.value=pre+ins+post;a.setSelectionRange((pre+ins).length,(pre+ins).length)}}}
 syncBlock(a);act=+a.dataset.k;grow();persist();showSg();updStats();if(s.blocks[act].t=='scene')navUpd()});
document.addEventListener('change',e=>{const a=e.target;if(a.dataset.cover!==undefined){const file=a.files&&a.files[0];if(!file)return;if(!file.type.startsWith('image/'))return toast('Choose an image file');if(file.size>12*1024*1024)return toast('Choose an image under 12 MB');const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const max=1200,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const s=cur();s.cover=canvas.toDataURL('image/jpeg',.82);save();dash();toast('Screenplay thumbnail updated')};img.onerror=()=>toast('Could not read this image');img.src=reader.result};reader.readAsDataURL(file);return}if(a.dataset.f==='lang'){const s=cur();s.lang=a.value;save();dash();return}if(a.dataset.p){const t=a.closest('.r').querySelector('.b');syncBlock(t);persist();navUpd();showSg()}});
document.addEventListener('mousedown',e=>{if(e.target.closest('[data-a=sg],[data-a=kE],[data-a=kT],.tools button'))e.preventDefault()});
document.addEventListener('focusin',e=>{if(e.target.classList.contains('b')){act=+e.target.dataset.k;showSg()}});
document.addEventListener('keydown',e=>{const a=e.target;if(!a.classList||!a.classList.contains('b'))return;const s=cur(),i=+a.dataset.k,b=s.blocks[i],pd=pend(s,a);
 if(pd){const k=e.key;if(k=='Tab'){e.preventDefault();return commit(a,pd.c[0],'')}if(/^[.,?!;:]$/.test(k))commit(a,pd.c[0],'');if(k=='Enter'&&!e.shiftKey)commit(a,pd.c[0],'')}
 if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();if(canonScene(s,i))toast('Location matched to its existing spelling');autoFormatBlock(s,i);s.blocks.splice(i+1,0,nb(NXT[s.blocks[i].t]));act=i+1;rebuild(s);focus(i+1);showSg();persist()}
 else if(e.key=='Tab'){const pk=b.t=='scene'?SG.find(x=>!x.k||x.tab):SG[0];if(b.t=='scene'&&!e.shiftKey&&!pk)return;e.preventDefault();if(pk&&!e.shiftKey)pk.f();else{setType(s,b,T[(T.indexOf(b.t)+(e.shiftKey?5:1))%6],i)}}
 else if(e.key=='Backspace'&&(b.t=='scene'?ps(b.x).loc==='':b.x==='')&&i>0&&a.value===''){e.preventDefault();s.blocks.splice(i,1);act=i-1;rebuild(s);focus(i-1);showSg();persist()}
 else if(e.key=='ArrowUp'&&a.selectionStart==0&&i>0){e.preventDefault();focus(i-1)}
 else if(e.key=='ArrowDown'&&a.selectionStart==a.value.length&&i<s.blocks.length-1){e.preventDefault();focus(i+1)}});
function autoFormatBlock(s,i){const b=s.blocks[i];if(!b||!S.set.autoFormat)return false;const v=(b.x||'').trim(),u=v.toUpperCase();if(!v)return false;if(b.t==='action'){if(/^(INT\.|EXT\.|INT\.\s*\/\s*EXT\.|I\/E\b)/i.test(v)){b.t='scene';b.x=u;return true}const tr=TR.find(x=>x.toUpperCase()===u)||(/^(CUT TO|FADE IN|FADE OUT|DISSOLVE TO|SMASH CUT TO|MATCH CUT TO|JUMP CUT TO)\s*:?$/i.test(v)?u.replace(/\s*:?$/,':'):null);if(tr){b.t='trans';b.x=tr;return true}const known=new Set(s.blocks.filter(x=>x.t==='char').map(x=>x.x.replace(/\(.*?\)/g,'').trim().toUpperCase()).filter(Boolean));if(known.has(u)){b.t='char';b.x=u;return true}}if(b.t==='char'&&S.set.caps&&!tam(s)){b.x=u;return true}return false}
function setType(s,b,t,i){b.t=t;if(t=='scene'){const p=ps(b.x);b.x=`${p.ie} ${p.loc} - ${p.td}`}if(['char','trans'].includes(t)&&!tam(s)&&S.set.caps)b.x=b.x.toUpperCase();rebuild(s);focus(i);showSg();persist()}
