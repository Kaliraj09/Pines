/* ============================================================
   Pines · views/reports-hub.js
   Reports hub (sidebar: Reports)
   ============================================================ */
/* ---- Reports hub ---- */
let rq='',rs={c:-1,d:1};
const REPM={'Scene list':['list','Every scene with time, location, cast and duration'],'Characters':['user','Scenes, lines and words per character'],'Dialogues':['write','All dialogue grouped by character'],'Locations':['globe','Where you shoot and how often'],'Shoot plan':['cal','Locations grouped into shooting days'],'Schedule':['cal','Day-by-day schedule with call times'],'Budget':['coin','Automatic estimate by shoot day'],'My budget':['coin','Your own lines: estimated vs actual'],'Budget by scene':['coin','Estimated cost per scene'],'Revisions':['layers','Scenes changed in each revision colour'],'Summary':['rep','Key numbers at a glance']};
function donut(D){const T=D.reduce((a,x)=>a+x.v,0);if(!T)return'<p class="mut">No scenes yet</p>';let o=0;const r=15.9155;return `<div class="dn"><svg viewBox="0 0 42 42" class="dsv"><circle cx="21" cy="21" r="${r}" fill="none" stroke="var(--bd)" stroke-width="5"/>${D.map(x=>{const p=x.v/T*100,e=p?`<circle cx="21" cy="21" r="${r}" fill="none" stroke="${x.c}" stroke-width="5" stroke-dasharray="${p} ${100-p}" stroke-dashoffset="${25-o}"/>`:'';o+=p;return e}).join('')}</svg><ul>${D.map(x=>`<li><i style="background:${x.c}"></i>${esc(x.l)}<b>${x.v}</b></li>`).join('')}</ul></div>`}
const hbar=(D,f=x=>x)=>{const m=Math.max(1,...D.map(x=>x.v));return D.length?D.map(x=>`<div class="hb"><span title="${esc(x.l)}">${esc(x.l)}</span><div><i style="width:${x.v/m*100}%"></i></div><b>${f(x.v)}</b></div>`).join(''):'<p class="mut">No data yet</p>'};
const spark=V=>{if(!V.length)return'<p class="mut">No scenes yet</p>';const m=Math.max(...V,1);return `<svg class="spk" viewBox="0 0 ${V.length*8} 50" preserveAspectRatio="none">${V.map((v,i)=>`<rect x="${i*8+1}" y="${50-v/m*48}" width="6" height="${Math.max(1,v/m*48)}" rx="1.5"><title>Scene ${i+1}: ${Math.round(v)}s</title></rect>`).join('')}</svg><div class="mut" style="display:flex;justify-content:space-between;gap:8px"><span>Scene 1</span><span>Longest ${Math.round(m)}s · average ${Math.round(V.reduce((a,x)=>a+x,0)/V.length)}s</span><span>Scene ${V.length}</span></div>`};
function repHub(s){
 const R=reps(s),sc=scenes(s),cs=chars(s),g=groups(s),pg=pages(s.blocks),manualBudget=bsum(s);
 const n=f=>sc.filter(f).length,Lc={};
 sc.forEach(c=>{const k=c.loc||'Not specified';Lc[k]=(Lc[k]||0)+1});
 const words=wc(s.blocks.map(x=>x.x).join(' ')),locCount=Object.keys(Lc).length;
 const missing=sc.filter(c=>!c.loc||!c.loc.trim()).length;
 const totalBudget=bfm(s,manualBudget.cap||manualBudget.e),runtime=dur(pg),empty=sc.length===0;
 const intN=n(c=>c.io==='INT.'),extN=n(c=>c.io==='EXT.'),otherN=sc.length-intN-extN;
 const dayN=n(c=>c.tod==='DAY'),nightN=n(c=>c.tod==='NIGHT'),eveningN=n(c=>c.tod==='EVENING');
 const topLoc=Object.entries(Lc).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([l,v])=>({l,v}));
 const topChar=[...cs].sort((x,y)=>y.w-x.w).slice(0,4).map(c=>({l:c.n,v:c.w}));
 const reportGroups=[
  {id:'story',name:'Story & writing',sub:'The screenplay itself',items:['Summary','Scene list','Characters','Dialogues']},
  {id:'production',name:'Production planning',sub:'What the crew needs to prepare',items:['Locations','Shoot plan','Schedule']},
  {id:'finance',name:'Manual budget',sub:'Your own estimates, actual costs and remaining budget',items:['My budget']},
  {id:'history',name:'Draft history',sub:'Track what has changed',items:['Revisions']}
 ];
 const descriptions={
  'Summary':'A quick overview of the screenplay',
  'Scene list':'All scenes, in the order they happen',
  'Characters':'Character appearances and dialogue totals',
  'Dialogues':'Dialogue lines, with scene references',
  'Locations':'Every location used in the screenplay',
  'Shoot plan':'Group scenes into practical shooting days',
  'Schedule':'Shooting dates, call times and assignments',
  'Budget':'The current estimated production cost',
  'My budget':'Your manually entered budget, estimates and actual costs',
  'Budget by scene':'Estimated cost attached to each scene',
  'Revisions':'Saved changes and revision marks'
 };
 const icons={'Summary':'rep','Scene list':'list','Characters':'user','Dialogues':'write','Locations':'globe','Shoot plan':'cal','Schedule':'cal','Budget':'coin','My budget':'coin','Budget by scene':'coin','Revisions':'layers'};
 const reportLabels={'My budget':'Manual budget'};
 const reportLink=k=>`<button class="rw-report" data-a="rt" data-i="${k}"><span class="rw-report-icon">${I(icons[k]||'file',19)}</span><span class="rw-report-copy"><b>${reportLabels[k]||k}</b><small>${descriptions[k]}</small></span><span class="rw-report-meta">${R[k].rows.length}</span><span class="rw-report-arrow">›</span></button>`;
 const stat=(label,value,sub,icon)=>`<div class="rw-stat"><div class="rw-stat-label"><span>${I(icon,16)}</span>${label}</div><strong>${value}</strong><small>${sub}</small></div>`;
 const inside=[{l:'Interior',v:intN},{l:'Exterior',v:extN},{l:'Other',v:otherN}].filter(x=>x.v>0);
 const time=[{l:'Day',v:dayN},{l:'Night',v:nightN},{l:'Evening',v:eveningN},{l:'Not set',v:sc.length-dayN-nightN-eveningN}].filter(x=>x.v>0);
 return `<div class="rw-page">
  <header class="rw-header">
   <div><div class="rw-eyebrow">PINES STUDIO <span>/</span> PROJECT INSIGHTS</div><h1>Reports</h1><p>Understand your screenplay and prepare your production, all in one place.</p></div>
   <div class="rw-project"><span class="rw-project-label">CURRENT PROJECT</span><b>${esc(s.title)}</b><small>Version ${V(s)} · ${esc(s.date||'')}</small></div>
  </header>
  ${empty?`<section class="rw-empty"><div class="rw-empty-art">${I('file',30)}</div><div><h2>Your reports will build as you write.</h2><p>Start by adding a scene heading. Pines will create scene, character, dialogue and production reports automatically.</p><button class="pri" data-a="tab" data-i="write">Go to screenplay editor →</button></div></section>`:`
  <section class="rw-overview">
   <div class="rw-overview-main"><div class="rw-section-tag">SCREENPLAY SNAPSHOT</div><h2>Your story at a glance</h2><p>These figures are calculated from your current draft.</p>
    <div class="rw-stats">${stat('Scenes',sc.length,'In this screenplay','film')}${stat('Estimated runtime',runtime,'Approximate screen time','hist')}${stat('Characters',cs.length,'With dialogue','user')}${stat('Locations',locCount,'Different places','globe')}${stat('Words',words.toLocaleString(),'Across all screenplay text','write')}${stat('Shoot days',g.D.length,'Grouped by location','cal')}</div>
   </div>
   <aside class="rw-budget-panel"><div class="rw-section-tag">MANUAL PRODUCTION BUDGET</div><div class="rw-budget-value">${totalBudget}</div><p>${manualBudget.cap?'Total budget cap':'Estimated total'} · ${bfm(s,manualBudget.a)} actual spent</p><div class="rw-budget-breakdown"><span><small>Estimated</small><b>${bfm(s,manualBudget.e)}</b></span><span><small>Remaining</small><b>${bfm(s,(manualBudget.cap||manualBudget.e)-manualBudget.a)}</b></span></div><button data-a="rt" data-i="My budget">Open manual budget <span>→</span></button></aside>
  </section>
  <section class="rw-analysis">
   <div class="rw-section-heading"><div><div class="rw-section-tag">QUICK ANALYSIS</div><h2>Explore your screenplay</h2></div><span class="rw-live">UPDATED FROM CURRENT DRAFT</span></div>
   <div class="rw-analysis-grid">
    <article class="rw-analysis-card"><div><h3>Where do scenes happen?</h3><p>Interior and exterior locations</p></div>${donut(inside.map((x,i)=>({...x,c:['#a8f3cf','#0d4230','#5fd9a6'][i]})))}</article>
    <article class="rw-analysis-card"><div><h3>When do scenes happen?</h3><p>Time of day across the story</p></div>${donut(time.map((x,i)=>({...x,c:['#a8f3cf','#0d4230','#5fd9a6','#d5ebe1'][i]})))}</article>
    <article class="rw-analysis-card"><div><h3>Most-used locations</h3><p>Places appearing in the most scenes</p></div>${hbar(topLoc)}</article>
    <article class="rw-analysis-card"><div><h3>Dialogue by character</h3><p>Who has the most dialogue words?</p></div>${hbar(topChar,x=>x.toLocaleString())}</article>
   </div>
  </section>
  <section class="rw-library">
   <div class="rw-section-heading"><div><div class="rw-section-tag">REPORT LIBRARY</div><h2>Choose what you want to explore</h2><p>Open any report to see its full details, search entries and export the results.</p></div><span class="rw-total">${reportGroups.reduce((n,g)=>n+g.items.length,0)} REPORTS</span></div>
   <div class="rw-library-grid">${reportGroups.map((group,i)=>`<article class="rw-group rw-group-${group.id}"><div class="rw-group-head"><span>0${i+1}</span><div><h3>${group.name}</h3><p>${group.sub}</p></div></div><div class="rw-group-list">${group.items.map(reportLink).join('')}</div></article>`).join('')}</div>
  </section>
  <section class="rw-attention"><div class="rw-attention-icon">${I(missing?'file':'check',20)}</div><div><b>${missing?`${missing} scene${missing===1?'':'s'} still need a location`:'Your scene locations are filled in'}</b><p>${missing?'Add locations to improve your shoot plan and location report.':'Your screenplay has location details for every scene.'}</p></div><button data-a="rt" data-i="Scene list">Review scenes →</button></section>
  `}
  <footer class="rw-footer"><span>PINES SCREENPLAY STUDIO</span><span>Figures are estimates and update when your screenplay changes.</span></footer>
 </div>`;
}
function rtblHTML(r){
 let rows=r.rows.filter(x=>!rq||x.join(' ').toLowerCase().includes(rq.toLowerCase()));
 if(rs.c>=0)rows=[...rows].sort((a,b)=>{const x=a[rs.c],y=b[rs.c],nx=parseFloat(x),ny=parseFloat(y);return(isNaN(nx)||isNaN(ny)?String(x).localeCompare(String(y)):nx-ny)*rs.d});
 if(!rows.length)return `<div class="edr-empty"><span>${I('file-search',28)}</span><h3>${rq?'No matching entries':'Nothing to report yet'}</h3><p>${rq?'Try a different search term.':'Add screenplay content and this report will fill automatically.'}</p></div>`;
 const isDialogue=rtab==='Dialogues';
 const cards=rows.map((row,ri)=>{
  if(isDialogue)return `<article class="edr-dialogue"><div class="edr-dialogue-meta"><b>${esc(row[0]||'Unknown character')}</b><span>SCENE ${esc(row[1]||'—')}</span></div><blockquote>${esc(row[2]||'')}</blockquote></article>`;
  return `<article class="edr-entry"><div class="edr-entry-no">${String(ri+1).padStart(2,'0')}</div><div class="edr-entry-content"><h3>${esc(row[0]||'Untitled entry')}</h3><dl>${row.slice(1).map((v,i)=>v===''||v===undefined?'' : `<div><dt>${esc(r.head[i+1]||'Details')}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div></article>`;
 }).join('');
 const table=`<div class="edr-table-wrap"><table class="edr-table"><thead><tr><th class="edr-rowno">NO.</th>${r.head.map((h,i)=>`<th class="sr" data-a="rsort" data-i="${i}">${esc(h)}${rs.c==i?(rs.d>0?' ↑':' ↓'):''}</th>`).join('')}</tr></thead><tbody>${rows.map((x,i)=>`<tr><td class="edr-rowno">${String(i+1).padStart(2,'0')}</td>${x.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 return `${isDialogue?`<div class="edr-dialogue-list">${cards}</div>`:`<div class="edr-entry-list">${cards}</div>`}${table}`;
}
function repDetail(s,k){
 const r=reps(s)[k];
 const descriptions={
 'Scene list':'A scene-by-scene view of your screenplay, in story order.',
 'Characters':'Who appears in the story, how often they speak and where they appear.',
 'Dialogues':'Every dialogue line, grouped with its character and scene reference.',
 'Locations':'A breakdown of the places used across your scenes.',
 'Shoot plan':'A suggested grouping of scenes by location to help plan production.',
 'Schedule':'Your current shooting dates, call times and planned scene assignments.',
 'Budget':'A consolidated view of the estimated production costs.',
 'Budget by scene':'Estimated costs associated with individual scenes.',
 'My budget':'Your manually entered budget items and amounts.',
 'Revisions':'A record of saved screenplay versions and marked changes.',
 'Summary':'A compact reference of the key figures in this screenplay.'
 };
 const desc=descriptions[k]||'A detailed view of the information recorded in this screenplay.';
 return `<div class="rpt-detail edr-detail">
  <div class="edr-topline"><button class="edr-back" data-a="rhub">${I('arrow-left',16)} <span>REPORT LIBRARY</span></button><div class="edr-export-actions"><button data-a="rcopy">${I('copy',15)} Copy</button><button data-a="rcsv">${I('download',15)} CSV</button><button class="pri" data-a="rprint">${I('printer',15)} Print / PDF</button></div></div>
  <header class="edr-heading"><div class="edr-kicker">PINES / ${esc(s.title)} / REPORT ${String(Object.keys(reps(s)).indexOf(k)+1).padStart(2,'0')}</div><h1>${esc(k)}</h1><p>${esc(desc)}</p><div class="edr-meta"><span>${r.rows.length} ${r.rows.length===1?'ENTRY':'ENTRIES'}</span><span>SCREENPLAY VERSION ${V(s)}</span><span>UPDATED ${esc(s.date||'—')}</span></div></header>
  <section class="edr-data"><div class="edr-data-head"><div><span class="edr-section-label">REPORT CONTENTS</span><h2>${esc(k)} <small> / ${rowsLabel(r.rows.length)}</small></h2></div><div class="edr-result-count"><b id="edr-visible">${r.rows.length}</b><span>shown</span></div></div>
   <div class="edr-tools"><label class="edr-search">${I('search',17)}<input data-rq="1" placeholder="Search within ${esc(k.toLowerCase())}…" value="${esc(rq)}" aria-label="Search this report"></label><span class="edr-sort-note">Select a column heading to sort the table</span></div>
   <div id="rtbl">${rtblHTML(r)}</div>
  </section><footer class="edr-footer"><span>END OF REPORT</span><span>${esc(s.title)} · PINES SCREENPLAY STUDIO</span></footer>
 </div>`;
}
function rowsLabel(n){return n===1?'record':'records';}
document.addEventListener('input',e=>{if(e.target.dataset.rq===undefined)return;rq=e.target.value;const t=$('#rtbl');if(t){t.innerHTML=rtblHTML(reps(cur())[rtab]);const c=$('#edr-visible');if(c)c.textContent=t.querySelectorAll('.edr-entry,.edr-dialogue').length||t.querySelectorAll('tbody tr').length}});
