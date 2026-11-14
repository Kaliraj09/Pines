/* ============================================================
   Pines · services/scheduled-backup.js
   Scheduled backup to a folder or Google Drive
   ============================================================ */
/* ---- Scheduled backup to a folder or Google Drive ---- */
const SBD=()=>new Promise((res,rej)=>{const r=indexedDB.open('pines-sb',1);r.onupgradeneeded=()=>r.result.createObjectStore('h');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const sbGet=async k=>{const d=await SBD();return new Promise(r=>{const q=d.transaction('h').objectStore('h').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r()})};
const sbPut=async(k,v)=>{const d=await SBD();return new Promise(r=>{const t=d.transaction('h','readwrite');t.objectStore('h').put(v,k);t.oncomplete=()=>r(1);t.onerror=()=>r(0)})};
const sbData=()=>{const o=JSON.parse(JSON.stringify(S));delete o.set.pin;return JSON.stringify(o)};
const sbName=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return 'Pines_auto_'+today()+'_'+p(d.getHours())+p(d.getMinutes())+'.json'};
const sbMs={Daily:864e5,Weekly:6048e5,'Every 2 weeks':12096e5,Monthly:2592e6};
const sbDue=()=>S.set.sbDest&&S.set.sbDest!='off'&&S.scripts.length&&Date.now()-(S.set.sbLast||0)>=(sbMs[S.set.sbEvery]||6048e5)-36e5;
async function sbDir(ask){const h=await sbGet('dir');if(!h)return null;let p=await h.queryPermission({mode:'readwrite'});if(p!='granted'&&ask)p=await h.requestPermission({mode:'readwrite'});return p=='granted'?h:null}
async function sbFolderWrite(h){const fh=await h.getFileHandle(sbName(),{create:true}),w=await fh.createWritable();await w.write(sbData());await w.close();const L=[];for await(const [n] of h.entries())if(/^Pines_auto_.*\.json$/.test(n))L.push(n);L.sort().reverse();for(const n of L.slice(+S.set.sbKeep||10))await h.removeEntry(n).catch(()=>{})}
let GT=null,GTx=0;
const gLoad=()=>window.google&&google.accounts?Promise.resolve():new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=res;s.onerror=()=>rej(new Error('Could not load Google sign-in'));document.head.appendChild(s)});
async function gTok(){if(GT&&Date.now()<GTx)return GT;const id=(S.set.gdCid||'').trim();if(!id)throw new Error('Add your Google Client ID first');await gLoad();return new Promise((res,rej)=>{const c=google.accounts.oauth2.initTokenClient({client_id:id,scope:'https://www.googleapis.com/auth/drive.file',callback:r=>{if(r.error)return rej(new Error(r.error));GT=r.access_token;GTx=Date.now()+(r.expires_in-60)*1e3;S.set.gdOk=true;res(GT)},error_callback:e=>rej(new Error(e.type||'Sign-in cancelled'))});c.requestAccessToken({prompt:S.set.gdOk?'':'consent'})})}
const gF=async(u,o={})=>{const t=await gTok(),r=await fetch('https://www.googleapis.com/'+u,Object.assign({},o,{headers:Object.assign({Authorization:'Bearer '+t},o.headers||{})}));if(!r.ok)throw new Error('Drive error '+r.status);return r};
async function gFolder(){let id=S.set.gdFolder;if(id){try{if(!(await(await gF('drive/v3/files/'+id+'?fields=id,trashed')).json()).trashed)return id}catch(e){}}
 const q=encodeURIComponent("name='Pines Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false"),j=await(await gF('drive/v3/files?q='+q+'&fields=files(id)')).json();
 id=j.files&&j.files[0]?j.files[0].id:(await(await gF('drive/v3/files',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Pines Backups',mimeType:'application/vnd.google-apps.folder'})})).json()).id;S.set.gdFolder=id;return id}
async function gList(){const f=await gFolder(),q=encodeURIComponent("'"+f+"' in parents and trashed=false and name contains 'Pines_auto_'");return(await(await gF('drive/v3/files?q='+q+'&orderBy=createdTime%20desc&pageSize=50&fields=files(id,name)')).json()).files||[]}
async function sbDriveWrite(){const f=await gFolder(),b='pnsb'+Date.now(),body='--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify({name:sbName(),parents:[f]})+'\r\n--'+b+'\r\nContent-Type: application/json\r\n\r\n'+sbData()+'\r\n--'+b+'--';await gF('upload/drive/v3/files?uploadType=multipart',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body});for(const x of(await gList()).slice(+S.set.sbKeep||10))await gF('drive/v3/files/'+x.id,{method:'DELETE'}).catch(()=>{})}
let sbBusy=0;
async function sbRun(manual){if(sbBusy)return;const d=S.set.sbDest;if(!d||d=='off')return manual&&toast('Choose where to save first');sbBusy=1;
 try{if(d=='folder'){const h=await sbDir(true);if(!h)throw new Error('Folder access needed. Choose the folder again.');await sbFolderWrite(h)}else await sbDriveWrite();
  S.set.sbLast=S.set.lastBackup=Date.now();S.set.snooze=0;S.set.sbErr='';save();manual&&toast('Backup saved to '+(d=='folder'?'your folder':'Google Drive'))}
 catch(e){S.set.sbErr=String(e.message||e);save();manual&&toast(S.set.sbErr)}
 finally{sbBusy=0;if(view=='set'&&stab=='backup')settings()}}
function sbArm(){if(sbArm.on)return;sbArm.on=1;toast('Scheduled backup is due. Tap anywhere to run it.');document.addEventListener('click',()=>{sbArm.on=0;sbRun()},{once:true,capture:true})}
async function sbTick(){try{if(LK||sbBusy||!sbDue())return;if(S.set.sbDest=='folder'){if(await sbDir(false))sbRun();else sbArm()}else if(GT&&Date.now()<GTx)sbRun();else sbArm()}catch(e){}}
setTimeout(sbTick,4000);setInterval(sbTick,18e5);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sbTick()});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.s=='sbDest')setTimeout(settings,0)});
function sbRestore(txt,label){let o;try{o=JSON.parse(txt)}catch(e){return toast('Not a valid backup file')}if(!Array.isArray(o.scripts))return toast('Not a Pines backup');
 modal(`<h3>Restore ${esc(label)}?</h3><p>${o.scripts.length} screenplay${o.scripts.length==1?'':'s'}. This replaces everything on this device. A safety copy of your current data is kept.</p>`,()=>{try{localStorage.setItem('pines.prev',JSON.stringify(S))}catch(e){}const mine=S.set;S=o;S.set=Object.assign({},DEF,o.set||{},keepLocal(mine));save();applyUI();syncX();home();toast('Backup restored')},'Restore')}
function sbCard(){const s=S.set,d=s.sbDest||'off',op=(v,t)=>`<option value="${v}" ${d==v?'selected':''}>${t}</option>`;
 return `<div class="card sec"><h3>Scheduled backup to a file or Drive</h3><span class="mut">Saves a copy outside this browser, so clearing browser data can’t take your scripts with it. Your PIN is left out of the file.</span>`
 +rw('Save to','',`<select data-s="sbDest">${op('off','Off')}${op('folder','Folder on this device')}${op('drive','Google Drive')}</select>`)
 +(d=='off'?'':rw('How often','',sl('sbEvery',['Daily','Weekly','Every 2 weeks','Monthly']))+rw('Keep last','Older scheduled copies are deleted',sl('sbKeep',[5,10,20,40])))
 +(d=='folder'?rw('Folder',s.sbDirName?esc(s.sbDirName):'Pick any folder, or one synced by Google Drive for desktop',`<button data-a="sbfolder">${I('exp',15)}${s.sbDirName?'Change':'Choose folder'}</button>`):'')
 +(d=='drive'?rw('Client ID','OAuth web client ID from Google Cloud Console',`<input data-s="gdCid" value="${esc(s.gdCid||'')}" placeholder="…apps.googleusercontent.com">`)+rw('Account',s.gdOk?'Connected':'Not connected',`<button data-a="sbdrive">${s.gdOk?'Reconnect':'Connect Drive'}</button>`):'')
 +(d=='off'?'':rw('Status',s.sbErr?esc(s.sbErr):s.sbLast?'Last copy '+new Date(s.sbLast).toLocaleString():'No scheduled copy yet',`<button class="pri" data-a="sbnow">Back up now</button>`)+rw('Restore','Bring back a saved copy',`<button data-a="${d=='folder'?'sbrf':'sbrd'}">Restore…</button>`))+`</div>`}
const sbList=(L,a)=>modal(`<h3>Restore a backup</h3>${L.length?L.slice(0,30).map(n=>`<div class="rw"><div><b>${esc(n.name)}</b></div><div class="rwb"><button data-a="${a}" data-i="${esc(n.id)}">Restore</button></div></div>`).join(''):'<p class="mut">No backup copies found.</p>'}`);
const sbClose=()=>document.querySelectorAll('.ov').forEach(x=>x.remove());
