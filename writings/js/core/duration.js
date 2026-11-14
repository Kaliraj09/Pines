/* ============================================================
   Pines · core/duration.js
   Page and duration maths
   ============================================================ */
/* ---- duration (1 page ≈ 1 minute) ---- */
const bl=b=>({scene:2,action:Math.ceil(b.x.length/60)+1,char:1,dial:Math.ceil(b.x.length/34),paren:1,trans:2}[b.t]);
const lines=a=>a.reduce((n,b)=>n+bl(b),0),pages=a=>lines(a)/55;
const dur=m=>{m=Math.round(m*60);const h=Math.floor(m/3600),mm=Math.floor(m%3600/60);return h?`${h}h ${mm}m`:mm?`${mm}m ${m%60}s`:`${m}s`};
