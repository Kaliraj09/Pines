/* ============================================================
   Pines · services/daily-snapshots.js
   Automatic daily snapshots (IndexedDB)
   ============================================================ */
/* ---- Automatic daily snapshots (IndexedDB) ---- */
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('pines-bk',1);r.onupgradeneeded=()=>r.result.createObjectStore('s',{keyPath:'day'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const snapAll=async()=>{const d=await idb();return new Promise(r=>{const q=d.transaction('s').objectStore('s').getAll();q.onsuccess=()=>r(q.result.sort((a,b)=>b.at-a.at));q.onerror=()=>r([])})};
const snapPut=async o=>{const d=await idb();return new Promise(r=>{const t=d.transaction('s','readwrite');t.objectStore('s').put(o);t.oncomplete=()=>r(1);t.onerror=()=>r(0)})};
const snapDel=async k=>{const d=await idb();return new Promise(r=>{const t=d.transaction('s','readwrite');t.objectStore('s').delete(k);t.oncomplete=()=>r(1);t.onerror=()=>r(0)})};
async function dailySnap(force){if(LK||!S.set.autoBk||!S.scripts.length)return;try{const day=today(),all=await snapAll();if(force||!all.find(x=>x.day==day))await snapPut({day,at:Date.now(),n:S.scripts.length,data:JSON.stringify(S)});const L=await snapAll();for(const x of L.slice(+S.set.keepDays||14))await snapDel(x.day)}catch(e){}}
async function snapUI(){const e=$('#snl');if(!e)return;try{const L=await snapAll();e.innerHTML=L.length?L.map(x=>`<div class="rw"><div><b>${new Date(x.at).toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</b><span class="mut">${x.n} screenplay${x.n==1?'':'s'} · ${Math.round(x.data.length/1024)} KB · saved ${new Date(x.at).toLocaleTimeString()}</span></div><div class="rwb"><button data-a="snrest" data-i="${x.day}">Restore</button><button data-a="sndl" data-i="${x.day}" title="Download">${I('download',15)}</button><button class="dng ib" data-a="sndel" data-i="${x.day}" title="Delete">${I('trash',15)}</button></div></div>`).join(''):'<p class="mut">No automatic backups yet. The first one is created today when you open Pines with at least one screenplay.</p>'}catch(err){e.innerHTML='<p class="mut">Automatic backups are unavailable in this browser.</p>'}}
setInterval(()=>dailySnap(),18e5);document.addEventListener('visibilitychange',()=>{if(!document.hidden)dailySnap()});
