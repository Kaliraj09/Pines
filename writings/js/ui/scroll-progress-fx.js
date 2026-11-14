/* ============================================================
   Pines · ui/scroll-progress-fx.js
   Scroll sparkle / progress effect
   ============================================================ */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,app=document.getElementById('app');
const sp=document.createElement('div');sp.id='sp';document.body.appendChild(sp);
addEventListener('scroll',()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;sp.style.transform='scaleX('+(m>0?Math.min(1,h.scrollTop/m):0)+')'},{passive:true});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.stc,.scr-card,.fc,.rcd,.pr,.cpc,.schedule-day,.pdf-option-card,.legal-choice,.legal-template-card,.rw-report,.rw-stat,.rw-analysis-card,.rw-group,.legal-fields,.schedule-summary>div,.details-snapshot>div,.details-grid>.card');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
document.addEventListener('pointerdown',e=>{if(reduce)return;const b=e.target.closest&&e.target.closest('button:not(.nv):not(.lnk):not(.b)');if(!b||b.disabled)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');s.className='rp';s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';b.appendChild(s);setTimeout(()=>s.remove(),700)},{passive:true});
const calm=e=>{if(/^(sq|skind|ssort)$/.test(e.target.id)){const p=document.getElementById('pl');if(p)p.classList.add('na')}};
document.addEventListener('input',calm);document.addEventListener('change',calm);
function count(el){if(el.dataset.cu)return;el.dataset.cu='1';if(reduce||el.children.length)return;const t=el.textContent.trim(),m=t.match(/^(\D*)(\d[\d,]*)(\D*)$/);if(!m)return;const end=+m[2].replace(/,/g,'');if(!(end>1&&end<1e9))return;const c=m[2].includes(','),t0=performance.now();
 (function f(n){const p=Math.min(1,(n-t0)/1000),v=Math.round(end*(1-Math.pow(1-p,4)));if(p<1){el.textContent=m[1]+(c?v.toLocaleString('en-IN'):v)+m[3];requestAnimationFrame(f)}else el.textContent=t})(t0)}
let q=0;const scan=()=>{q=0;app.querySelectorAll('.stc b:not([data-cu]),.rw-stat strong:not([data-cu]),.rw-budget-value:not([data-cu]),.schedule-summary b:not([data-cu]),.details-snapshot b:not([data-cu])').forEach(count)};
new MutationObserver(ms=>{if(ms.every(m=>m.target.dataset&&m.target.dataset.cu))return;if(!q)q=requestAnimationFrame(scan)}).observe(app,{childList:true,subtree:true});
scan();
})();
