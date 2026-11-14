/* ============================================================
   Pines · ui/cool-fx.js
   Cool theme effects
   ============================================================ */
(()=>{
const cool=()=>document.documentElement.dataset.ui!=='classy',reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const sparkle=()=>{if(!cool()||reduce)return;document.querySelectorAll('.hero:not([data-sp]),.rw-header:not([data-sp]),.schedule-heading:not([data-sp]),.pdf-studio-head:not([data-sp]),.details-heading:not([data-sp])').forEach(h=>{h.dataset.sp=1;for(let i=0;i<7;i++){const e=document.createElement('i');e.className='sp2';e.style.cssText=`left:${6+Math.random()*88}%;top:${8+Math.random()*78}%;animation-delay:${(Math.random()*3).toFixed(2)}s;animation-duration:${(2.4+Math.random()*2).toFixed(1)}s;transform-origin:center`;h.appendChild(e)}})};
let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;sparkle()})}).observe(document.getElementById('app'),{childList:true,subtree:true});sparkle();
if(fine&&!reduce){let t=0;document.addEventListener('pointermove',e=>{if(!cool())return;const n=performance.now();if(n-t<45)return;t=n;if(e.target.closest&&e.target.closest('textarea,input,select,.page'))return;const d=document.createElement('i');d.className='trail';d.style.left=e.clientX+'px';d.style.top=e.clientY+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),720)},{passive:true})}
})();
