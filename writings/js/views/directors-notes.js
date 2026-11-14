/* ============================================================
   Pines · views/directors-notes.js
   Director's notes (sidebar: Director's notes), plus the register-popup fit at the end
   ============================================================ */
/* ================= DIRECTOR'S NOTES ================= */
let dnView='scenes',DN=null;
const DNM=['Tense','Warm','Melancholic','Dreamy','Gritty','Joyful','Eerie','Romantic','Intimate','Chaotic','Nostalgic','Hopeful'];
const dnHex=c=>/^#[0-9a-f]{6}$/i.test(c)?c:'#cccccc';
const dnGet=(s,sid)=>(s.dn||{})[sid]||{};
const dnHas=d=>!!(d&&(d.intent||d.mood||d.look||(d.pal&&d.pal.length)||(d.refs&&d.refs.length)));
const dnMoods=m=>String(m||'').split(',').map(x=>x.trim()).filter(Boolean);
function dnScenes(s,sc){return `<div class="dn-g">${sc.map((c,i)=>{const d=dnGet(s,c.sid),pal=d.pal||[],refs=d.refs||[];
 return `<div class="card dn-c" data-a="dedit" data-i="${i}"><div class="dn-pal">${pal.length?pal.map(h=>`<i style="background:${dnHex(h)}"></i>`).join(''):'<i class="e"></i>'}</div>${refs.length?`<div class="dn-th n${Math.min(refs.length,3)}">${refs.slice(0,3).map(u=>`<img src="${u}" alt="">`).join('')}</div>`:''}<div class="dn-b"><div class="dn-h"><span class="chip">${c.n}</span><b>${esc(c.h)}</b></div>${d.mood?`<div class="dn-m">${dnMoods(d.mood).slice(0,4).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>`:''}<p class="dn-i">${esc(d.intent||'Tap to add notes for this scene')}</p></div></div>`}).join('')}</div>`}
function dnBoard(s,sc){const pc={},mc={},imgs=[];
 sc.forEach((c,i)=>{const d=dnGet(s,c.sid);(d.pal||[]).forEach(h=>{const k=dnHex(h).toLowerCase();pc[k]=(pc[k]||0)+1});dnMoods(d.mood).forEach(m=>{const k=m[0].toUpperCase()+m.slice(1).toLowerCase();mc[k]=(mc[k]||0)+1});(d.refs||[]).forEach(u=>imgs.push({u,n:c.n,i}))});
 const pal=Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,12),mo=Object.entries(mc).sort((a,b)=>b[1]-a[1]).slice(0,12);
 return `<div class="card sec"><h3>Film palette</h3><span class="mut">Colours used most often across your scenes</span>${pal.length?`<div class="dn-pals">${pal.map(([h,n])=>`<div><i style="background:${h}"></i>${h.toUpperCase()}<br>${n} scene${n==1?'':'s'}</div>`).join('')}</div>`:'<p class="mut">No colours yet. Add a palette to any scene.</p>'}</div>
 <div class="card sec"><h3>Moods</h3>${mo.length?`<div class="dn-m" style="margin-top:8px">${mo.map(([m,n])=>`<span class="chip">${esc(m)} · ${n}</span>`).join('')}</div>`:'<p class="mut">No moods yet.</p>'}</div>
 <div class="card"><h3>Reference wall</h3>${imgs.length?`<div class="dn-wall" style="margin-top:10px">${imgs.map(x=>`<figure data-a="dedit" data-i="${x.i}"><img src="${x.u}" alt=""><figcaption>Scene ${x.n}</figcaption></figure>`).join('')}</div>`:'<p class="mut">Reference images you add to scenes appear here as one mood board.</p>'}</div>`}
function dirUI(s){const sc=scenes(s),n=sc.filter(c=>dnHas(dnGet(s,c.sid))).length;
 const head=`<div class="tb" style="margin-top:0;flex-wrap:wrap"><h3 style="margin:0;flex:1">Director’s notes</h3><div class="seg">${[['scenes','Scenes'],['board','Mood board']].map(([k,t])=>`<button class="${dnView==k?'on':''}" data-a="dview" data-i="${k}">${t}</button>`).join('')}</div><button class="pri" data-a="dlook">${I('file',16)}Lookbook PDF</button></div><p class="mut" style="margin:0 0 12px">${n} of ${sc.length} scene${sc.length==1?'':'s'} have notes. Capture intent, mood, colour palette and reference images for each scene.</p>`;
 if(!sc.length)return head+`<div class="empty">${I('palette',34)}<b>No scenes yet</b><span>Write a scene and it will appear here.</span></div>`;
 return head+(dnView=='board'?dnBoard(s,sc):dnScenes(s,sc))}
function dnChips(){const inp=$('#d_m');if(!inp)return;const a=dnMoods(inp.value).map(x=>x.toLowerCase());document.querySelectorAll('.dn-chips .chip').forEach(c=>c.classList.toggle('on',a.includes(c.dataset.i.toLowerCase())))}
function dnPal(){const e=$('#dpal');if(!e||!DN)return;e.innerHTML=DN.pal.length?DN.pal.map((c,i)=>`<span class="dn-sw"><input type="color" value="${dnHex(c)}" data-dc="${i}" aria-label="Colour ${i+1}"><code>${dnHex(c).toUpperCase()}</code><button type="button" data-a="dpdel" data-i="${i}" aria-label="Remove colour">×</button></span>`).join(''):'<span class="mut">No colours yet. Add one, or pull them from your reference images.</span>'}
function dnRefs(){const e=$('#dimg');if(!e||!DN)return;e.innerHTML=DN.refs.length?`<div class="dn-rg">${DN.refs.map((u,i)=>`<div><img src="${u}" alt=""><button type="button" data-a="drdel" data-i="${i}" aria-label="Remove image">×</button></div>`).join('')}</div>`:'<span class="mut">Frames, paintings, stills, locations: anything that sets the look.</span>'}
function dnExtract(urls,n){return Promise.all(urls.map(u=>new Promise(r=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');x.drawImage(im,0,0,48,48);try{r(x.getImageData(0,0,48,48).data)}catch(_){r(null)}};im.onerror=()=>r(null);im.src=u}))).then(all=>{const m={};all.forEach(d=>{if(!d)return;for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const k=(d[i]>>5)<<6|(d[i+1]>>5)<<3|(d[i+2]>>5),e=m[k]||(m[k]={n:0,r:0,g:0,b:0});e.n++;e.r+=d[i];e.g+=d[i+1];e.b+=d[i+2]}});
 const L=Object.values(m).map(e=>({n:e.n,c:[e.r/e.n,e.g/e.n,e.b/e.n]})).sort((a,b)=>b.n-a.n),out=[];
 for(const e of L){if(out.length>=n)break;if(out.every(o=>Math.hypot(o.c[0]-e.c[0],o.c[1]-e.c[1],o.c[2]-e.c[2])>70))out.push(e)}
 return out.map(e=>'#'+e.c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''))})}
document.addEventListener('input',e=>{const a=e.target;if(a.dataset.dc===undefined||!DN)return;DN.pal[+a.dataset.dc]=a.value.toLowerCase();const c=a.parentNode.querySelector('code');if(c)c.textContent=a.value.toUpperCase()});
document.addEventListener('change',e=>{const a=e.target;if(a.id!=='dref'||!DN)return;const files=[...a.files];a.value='';
 if(DN.refs.length>=6)return toast('Up to 6 images per scene');
 files.slice(0,6-DN.refs.length).forEach(f=>{if(!f.type.startsWith('image/'))return toast('Choose an image file');if(f.size>12*1024*1024)return toast('Choose an image under 12 MB');
  const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);if(DN&&DN.refs.length<6){DN.refs.push(c.toDataURL('image/jpeg',.72));dnRefs()}};im.src=fr.result};fr.readAsDataURL(f)})});
Object.assign(A,{
 dview:k=>{dnView=k;dash()},
 dedit:i=>{const s=cur(),sc=scenes(s)[i];if(!sc)return;const d=dnGet(s,sc.sid);DN={sid:sc.sid,pal:(d.pal||[]).map(dnHex),refs:(d.refs||[]).slice()};
  const m=modal(`<h3>Scene ${sc.n} · ${esc(sc.h)}</h3>
  <label>Director’s intent<textarea class="tx" id="d_i" rows="3" placeholder="What should the audience feel, and what is this scene really about?">${esc(d.intent||'')}</textarea></label>
  <label>Mood<input id="d_m" value="${esc(d.mood||'')}" placeholder="Tense, claustrophobic"></label>
  <div class="dn-chips">${DNM.map(x=>`<button type="button" class="chip" data-a="dmood" data-i="${x}">${x}</button>`).join('')}</div>
  <label>Look &amp; sound<textarea class="tx" id="d_l" rows="2" placeholder="Lighting, lens, camera movement, music or sound design">${esc(d.look||'')}</textarea></label>
  <div class="dn-sec"><div class="dn-sh"><b>Colour palette</b><span><button type="button" data-a="dpadd">${I('plus',14)}Add colour</button><button type="button" data-a="dpext">${I('palette',14)}From images</button></span></div><div id="dpal"></div></div>
  <div class="dn-sec"><div class="dn-sh"><b>Reference images</b><span class="mut">Up to 6</span></div><input type="file" id="dref" accept="image/*" multiple><div id="dimg"></div></div>`,mm=>{
   const q=k=>mm.querySelector(k).value.trim(),n={intent:q('#d_i'),mood:q('#d_m'),look:q('#d_l'),pal:DN.pal.slice(),refs:DN.refs.slice()};
   s.dn=s.dn||{};if(dnHas(n))s.dn[DN.sid]=n;else delete s.dn[DN.sid];s.upd=Date.now();save();DN=null;dash()},'Save');
  m.querySelector('.md').classList.add('dn-md');dnPal();dnRefs();dnChips();const mi=$('#d_m');if(mi)mi.addEventListener('input',dnChips)},
 dmood:w=>{const inp=$('#d_m');if(!inp)return;const a=dnMoods(inp.value),k=a.findIndex(x=>x.toLowerCase()==w.toLowerCase());if(k>=0)a.splice(k,1);else a.push(w);inp.value=a.join(', ');dnChips()},
 dpadd:()=>{if(!DN)return;if(DN.pal.length>=6)return toast('Up to 6 colours');DN.pal.push('#35c28f');dnPal()},
 dpdel:i=>{if(!DN)return;DN.pal.splice(+i,1);dnPal()},
 drdel:i=>{if(!DN)return;DN.refs.splice(+i,1);dnRefs()},
 dpext:async()=>{if(!DN)return;if(!DN.refs.length)return toast('Add a reference image first');const c=await dnExtract(DN.refs,5);if(!DN)return;if(!c.length)return toast('Could not read colours from the images');DN.pal=c;dnPal();toast('Palette taken from your images')},
 dlook:()=>{const s=cur(),sc=scenes(s).filter(c=>dnHas(dnGet(s,c.sid)));if(!sc.length)return toast('Add notes to at least one scene first');
  const fld=(l,v)=>v?`<p style="margin:4pt 0"><b>${l}</b> ${esc(v).replace(/\n/g,'<br>')}</p>`:'';
  printHTML(callDoc(`<style>*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.lb{page-break-inside:avoid;margin:0 0 20pt;padding-bottom:14pt;border-bottom:1pt solid #ddd}.pl{display:inline-block;text-align:center;font-size:7pt;margin:6pt 8pt 0 0}.pl i{display:block;width:40pt;height:40pt;border-radius:6pt;border:.5pt solid #ccc;margin-bottom:2pt}.im{display:grid;grid-template-columns:repeat(3,1fr);gap:6pt;margin-top:8pt}.im img{width:100%;height:110pt;object-fit:cover;border-radius:6pt}
/* Register popup: keep loading + success popup inside the phone screen */
html:has(.pay-stage),html:has(.pay-ok),html:has(.cert-view),html:has(.pay-stage) body,html:has(.pay-ok) body,html:has(.cert-view) body{overflow-x:hidden!important}
.md:has(.pay-stage),.md:has(.pay-ok){max-width:min(440px,100%);box-sizing:border-box;overflow-x:hidden}
.pay-stage,.pay-ok{min-width:0;max-width:100%;box-sizing:border-box}
.pay-ok *{min-width:0}.pay-meta b{overflow-wrap:anywhere}
@media(max-width:600px){.md:has(.pay-stage),.md:has(.pay-ok){max-width:100%;width:100%}.pay-ok h2{font-size:20px}.pay-actions button{flex:1 1 100%}}
</style><h1>${esc(s.title)}: Lookbook</h1><p style="color:#555">Director’s notes by scene</p>`+sc.map(c=>{const d=dnGet(s,c.sid);return `<div class="lb"><h3 style="margin:0 0 4pt">${c.n}. ${esc(c.h)}</h3>${d.mood?`<p style="margin:2pt 0;color:#14835c"><b>${esc(dnMoods(d.mood).join(' · '))}</b></p>`:''}${fld('Intent',d.intent)}${fld('Look &amp; sound',d.look)}${(d.pal||[]).length?`<div>${d.pal.map(h=>`<span class="pl"><i style="background:${dnHex(h)}"></i>${dnHex(h).toUpperCase()}</span>`).join('')}</div>`:''}${(d.refs||[]).length?`<div class="im">${d.refs.map(u=>`<img src="${u}" alt="">`).join('')}</div>`:''}</div>`}).join('')))}
});
Object.assign(A,{
 rdtab:k=>{RD.tab=k;document.querySelectorAll('#trx .x-tabs button').forEach(b=>{const on=b.dataset.i===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});document.querySelectorAll('#trx .x-pn').forEach(p=>p.classList.toggle('on',p.dataset.p===k))},
 rdvg:arg=>{const i=String(arg).indexOf('|'),g=arg.slice(0,i),k=arg.slice(i+1),s=cur();if(!s)return;
  const E=rdEff(s,k),v=rdVoice(s,k,rdSample(k),E);if(!v)return toast('No voice found to mark');
  S.vgo=S.vgo||{};S.vgo[v.voiceURI]=g;save();
  document.querySelectorAll('#trx .trc').forEach(el=>{el.outerHTML=rdCard(s,el.dataset.c)});
  toast(`Marked ${v.name} as ${g==='M'?'male':'female'}`);setTimeout(()=>A.rdprev(k),80)}
});
window.rdUI=rdUI;window.dirUI=dirUI;window.rdStop=rdStop;
