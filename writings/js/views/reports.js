/* ============================================================
   Pines · views/reports.js
   Reports
   ============================================================ */
/* ---- Reports ---- */
function reps(s){const sc=scenes(s),ch={},dl=[];let cc=null,sn=0;
 s.blocks.forEach(b=>{if(b.t=='scene')sn++;if(b.t=='char'){cc=b.x.replace(/\(.*?\)/g,'').trim().toUpperCase();if(cc){ch[cc]=ch[cc]||{n:cc,sc:new Set(),d:0,w:0};ch[cc].sc.add(sn);if(sc[sn-1])sc[sn-1].ch.add(cc)}}
  else if(b.t=='dial'&&cc){ch[cc].d++;ch[cc].w+=wc(b.x);dl.push([cc,sn,b.x])}else if(['scene','action','trans'].includes(b.t))cc=null});
 const L={};sc.forEach(c=>(L[c.loc]=L[c.loc]||[]).push(c));const cnt=f=>sc.filter(f).length,locs=Object.entries(L).sort((a,b)=>b[1].length-a[1].length),u=(a,f)=>[...new Set(a.map(f).filter(Boolean))].join(', ');
 return{'Scene list':{head:['#','Scene heading','I/E','Location','Time','Characters','Est. duration'],rows:sc.map(c=>[c.n,c.h,c.io,c.loc,c.tod,[...c.ch].join(', '),dur(c.l/55)])},
 'Characters':{head:['Character','Scenes','Dialogues','Words','Scene nos.'],rows:Object.values(ch).sort((a,b)=>b.w-a.w).map(c=>[c.n,c.sc.size,c.d,c.w,[...c.sc].join(', ')])},
 'Dialogues':{head:['Character','Scene','Dialogue'],rows:dl.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]-b[1])},
 'Locations':{head:['Location','I/E','Scenes','Scene nos.','Times'],rows:locs.map(([l,a])=>[l,u(a,c=>c.io),a.length,a.map(c=>c.n).join(', '),u(a,c=>c.tod)])},
 'Shoot plan':{head:['Day','Location','I/E','Time','Scenes','Cast','Est. duration'],rows:locs.map(([l,a],i)=>['Day '+(i+1),l,u(a,c=>c.io),u(a,c=>c.tod),a.map(c=>c.n).join(', '),u(a.flatMap(c=>[...c.ch]),x=>x),dur(a.reduce((x,c)=>x+c.l,0)/55)])},
 'Schedule':schRep(s),'Budget':budRep(s),'Budget by scene':budScene(s),'My budget':budManRep(s),'Revisions':revRep(s),'Summary':{head:['Item','Value'],rows:[['Scenes',sc.length],['Characters',Object.keys(ch).length],['Dialogue lines',dl.length],['Words',wc(s.blocks.map(b=>b.x).join(' '))],['Est. pages',pages(s.blocks).toFixed(1)],['Est. runtime',dur(pages(s.blocks))],['Locations',locs.length],['INT scenes',cnt(c=>c.io.startsWith('INT'))],['EXT scenes',cnt(c=>c.io=='EXT.')],['Day scenes',cnt(c=>c.tod=='DAY')],['Night scenes',cnt(c=>c.tod=='NIGHT')],['Evening scenes',cnt(c=>c.tod=='EVENING')]]}}}
const tbl=r=>r.rows.length?`<table><tr>${r.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${r.rows.map(x=>`<tr>${x.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`:'<div class="card mut">Nothing yet. Write scenes, characters and dialogue first.</div>';
const csv=r=>[r.head,...r.rows].map(x=>x.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
