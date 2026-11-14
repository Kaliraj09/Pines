/* ============================================================
   Pines · core/actions.js
   The A object: every data-a="..." click action. Filled in by the actions-*.js files after this one.
   ============================================================ */
const A={};
document.addEventListener('click',e=>{if(e.target.closest('.ov')&&!e.target.closest('[data-a]'))return;const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a=='open'&&e.target.closest('[data-a=del]'))return;e.preventDefault();A[a.dataset.a](a.dataset.i,a.dataset.script)});
