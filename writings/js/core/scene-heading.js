/* ============================================================
   Pines · core/scene-heading.js
   Scene heading parser, scene list, app shell (sidebar layout)
   ============================================================ */
/* ---- parse scene heading ---- */
function ps(x){const m=x.match(/^(INT\.\/EXT\.|INT\.|EXT\.)?\s*([\s\S]*)$/);let r=m[2],td='';const k=r.search(/(^|\s)-\s+[^-]*$/);if(k>=0){td=r.slice(k).replace(/^\s*-\s+/,'').trim();r=r.slice(0,k)}return{ie:m[1]||'INT.',loc:r.trim(),td:td||'DAY'}}
function scenes(s){const out=[];let c=null;s.blocks.forEach((b,i)=>{if(b.t=='scene'){if(!b.sid)b.sid='s'+Math.random().toString(36).slice(2,8);const p=ps(b.x.toUpperCase());c={n:out.length+1,sid:b.sid,i,h:`${p.ie} ${p.loc} - ${p.td}`,io:p.ie,loc:p.loc,tod:p.td,w:0,l:0,ch:new Set()};out.push(c)}if(c){c.w+=wc(b.x);c.l+=bl(b);if(b.r)(c.rv=c.rv||{})[b.r]=(c.rv[b.r]||0)+1}});return out}
