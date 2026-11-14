/* ============================================================
   Pines · ui/mint-fx.js
   Mint theme hover and banner effects
   ============================================================ */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const BAN='.hero,.rw-header,.schedule-heading,.pdf-studio-head,.legal-intro,.legal-subhead,.legal-editor-head,.registration-intro,.details-heading';
let raf=0;
document.addEventListener('pointermove',e=>{
 const t=e.target.closest&&e.target.closest(BAN);
 if(t){const r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px')}
 if(reduce||!fine)return;
 const c=e.target.closest&&e.target.closest('.scr-card');
 if(c){const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--rx',(x*8).toFixed(2)+'deg');c.style.setProperty('--ry',(-y*8).toFixed(2)+'deg')}
 if(!raf)raf=requestAnimationFrame(()=>{raf=0;const d=document.documentElement.style;d.setProperty('--px',(e.clientX/innerWidth-.5).toFixed(3));d.setProperty('--py',(e.clientY/innerHeight-.5).toFixed(3))});
},{passive:true});
document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.scr-card');if(c&&!c.contains(e.relatedTarget)){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}},{passive:true});
function burst(x,y){
 if(reduce)return;
 const cols=['#a8f3cf','#84e9b9','#5fd9a6','#c9f9e1','#35c28f'],f=document.createDocumentFragment();
 for(let i=0;i<28;i++){const p=document.createElement('i');p.className='cf';const a=Math.random()*Math.PI*2,d=60+Math.random()*120,w=6+Math.random()*6;
  p.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${w*(.6+Math.random()*.9)}px;background:${cols[i%cols.length]};border-radius:${Math.random()>.5?'50%':'2px'};--dx:${(Math.cos(a)*d).toFixed(0)}px;--dy:${(Math.sin(a)*d-50).toFixed(0)}px;--rot:${(Math.random()*720-360).toFixed(0)}deg;animation-delay:${(Math.random()*70).toFixed(0)}ms`;
  f.appendChild(p)}
 document.body.appendChild(f);setTimeout(()=>document.querySelectorAll('.cf').forEach(n=>n.remove()),1500)}
const OK=/saved|created|complete|received|restored|generated|imported|updated|downloaded/i;
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){
 if(n.nodeType!==1)continue;
 if(n.classList.contains('toast')&&OK.test(n.textContent))burst(innerWidth/2,innerHeight-90);
 else if(n.classList.contains('reg-success')){const r=n.getBoundingClientRect();burst(r.left+r.width/2,r.top+70)}}
}).observe(document.body,{childList:true,subtree:true});
let q=0;const stag=()=>{q=0;document.querySelectorAll('.spk').forEach(s=>s.querySelectorAll('rect:not([data-d])').forEach((r,i)=>{r.dataset.d=1;r.style.animationDelay=Math.min(i*22,900)+'ms'}))};
new MutationObserver(()=>{if(!q)q=requestAnimationFrame(stag)}).observe(document.getElementById('app'),{childList:true,subtree:true});
})();
