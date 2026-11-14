/* ============================================================
   Pines · services/device-transfer.js
   Device transfer (encrypted, one-time code)
   ============================================================ */
/* ---- device transfer (encrypted, one-time code, 5 min) ---- */
let DB=null,DBN='',DBP=null;
const enc=new TextEncoder(),b64=u=>{let t='';for(let i=0;i<u.length;i+=8192)t+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(t)},ub=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function gz(u,d){const c=new(d?DecompressionStream:CompressionStream)('gzip'),w=c.writable.getWriter();w.write(u);w.close();return new Uint8Array(await new Response(c.readable).arrayBuffer())}
async function sha(t){return[...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(t)))].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,32)}
async function ck(code,salt){const k=await crypto.subtle.importKey('raw',enc.encode(code),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function seal(code,o){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),raw=await gz(enc.encode(JSON.stringify(o))),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await ck(code,salt),raw));return[b64(salt),b64(iv),b64(ct)].join('.')}
async function unseal(code,t){const[a,b,c]=t.split('.'),raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(b)},await ck(code,ub(a)),ub(c));return JSON.parse(new TextDecoder().decode(await gz(new Uint8Array(raw),1)))}
const genCode=()=>{const al='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return[...crypto.getRandomValues(new Uint8Array(8))].map(x=>al[x%32]).join('')};
async function delX(x,n){for(let i=0;i<n;i++)await DB.doc(`xfer/${x}/c/${i}`).delete().catch(()=>{});await DB.doc('xfer/'+x).delete().catch(()=>{})}
function loggedOut(){try{localStorage.removeItem('pines');localStorage.removeItem('pines.xfer')}catch(e){}S=blank();id=null;clearTimeout(tm);$('#app').innerHTML=`<div class="lock"><div class="lk">${I('lock',34)}</div><h2 style="margin:6px 0 0">You’ve been signed out</h2><p>This account was transferred to another device and its data has been removed from this browser.</p><button class="pri" data-a="fresh">Start a new workspace</button></div>`}
async function xsend(){if(!DB)await Promise.race([DBP,new Promise(r=>setTimeout(r,3500))]);if(!DB)return xsendFile();
 const code=genCode(),exp=Date.now()+3e5;let xid=null,n=0,un=null,iv=null,done=false;
 const m=modal(`<h3>Send account</h3><p class="mut">On the other device open Settings → Transfer → Receive and enter this code.</p><div class="code" id="xc">········</div><div class="bar2"><i id="xb" style="width:100%"></i></div><div class="mut" id="xs" style="margin-top:8px">Encrypting your account…</div><p class="mut">Works once. After the other device receives it, this device is signed out automatically.</p>`);
 const kill=async()=>{done=true;clearInterval(iv);un&&un();if(xid){await delX(xid,n);try{localStorage.removeItem('pines.xfer')}catch(e){}}};
 m.querySelector('.x').addEventListener('click',kill);
 try{xid=await sha('pines-xfer:'+code);const sealed=await seal(code,{v:1,S});n=Math.ceil(sealed.length/18e4);
  for(let i=0;i<n&&!done;i++)await DB.doc(`xfer/${xid}/c/${i}`).set({d:sealed.slice(i*18e4,(i+1)*18e4)});
  if(done){await delX(xid,n);return}
  await DB.doc('xfer/'+xid).set({exp,n,st:'open'});try{localStorage.setItem('pines.xfer',JSON.stringify({id:xid,exp,n}))}catch(e){}
 }catch(e){const t=m.querySelector('#xs');if(t)t.textContent='Could not start the transfer ('+(e.code||'error')+'). You may need edit access to this page.';return kill()}
 if(done)return;m.querySelector('#xc').textContent=code.slice(0,4)+'-'+code.slice(4);
 un=DB.doc('xfer/'+xid).onSnapshot(sn=>{if(sn.exists&&sn.data().st=='received'){done=true;clearInterval(iv);un&&un();m.remove();DB.doc('xfer/'+xid).delete().catch(()=>{});loggedOut()}},()=>{});
 iv=setInterval(()=>{const left=exp-Date.now(),st=m.querySelector('#xs');if(!st){clearInterval(iv);return}if(left<=0){kill();st.textContent='Code expired. Close this and generate a new one.';m.querySelector('#xc').style.opacity=.35;m.querySelector('#xb').style.width='0';return}st.textContent=`Waiting for the other device… ${Math.floor(left/6e4)}:${String(Math.floor(left/1e3)%60).padStart(2,'0')} left`;m.querySelector('#xb').style.width=left/3e3+'%'},500)}
function xrecv(){const m=modal(`<h3>Receive account</h3><p class="mut">Enter the 8-character code shown on the sending device. Existing data on this device will be replaced (a safety copy is kept).</p><input id="rc" class="codein" maxlength="9" placeholder="XXXX-XXXX" autocapitalize="characters" autocomplete="off" spellcheck="false"><label>Or choose a transfer file<input type="file" id="rf" accept=".pinestransfer,.txt"></label><div class="mut" id="rs" style="margin-top:10px;min-height:18px"></div>`,()=>{go();return false},'Receive');
 const st=t=>{m.querySelector('#rs').textContent=t};
 async function goFile(fl,code){try{st('Reading file…');const o=await unseal(code,(await fl.text()).trim());if(!o||!o.S||!Array.isArray(o.S.scripts))return st('Transfer file is invalid.');if(o.exp&&Date.now()>o.exp+15000)return st('This transfer has expired. Create a new one.');try{localStorage.setItem('pines.prev',JSON.stringify(S))}catch(e){}const mine=S.set;S=o.S;S.set=Object.assign({},DEF,S.set||{},keepLocal(mine));save();m.remove();applyUI();syncX();home();toast('Account received')}catch(e){st('Wrong code or damaged file.')}}
 async function go(){const code=m.querySelector('#rc').value.toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!=8)return st('Enter all 8 characters.');const fl=m.querySelector('#rf').files[0];if(fl)return goFile(fl,code);if(!DB)return st((DBN||NODB)+' Choose a transfer file below instead.');
  try{st('Checking code…');const x=await sha('pines-xfer:'+code),ref=DB.doc('xfer/'+x),sn=await ref.get();if(!sn.exists)return st('Invalid or expired code.');const d=sn.data();if(d.st!='open')return st('This code was already used.');if(Date.now()>d.exp+15000){delX(x,d.n);return st('This code has expired.')}
   st('Downloading…');let t='';for(let i=0;i<d.n;i++){const c=await DB.doc(`xfer/${x}/c/${i}`).get();if(!c.exists)return st('Transfer data incomplete. Ask the sender for a new code.');t+=c.data().d}
   st('Decrypting…');let o;try{o=await unseal(code,t)}catch(e){return st('Could not decrypt this transfer.')}if(!o||!o.S||!Array.isArray(o.S.scripts))return st('Transfer data is invalid.');
   try{localStorage.setItem('pines.prev',JSON.stringify(S))}catch(e){}
   const mine=S.set;S=o.S;S.set=Object.assign({},DEF,S.set||{},keepLocal(mine));save();
   await ref.update({st:'received',at:Date.now()});for(let i=0;i<d.n;i++)DB.doc(`xfer/${x}/c/${i}`).delete().catch(()=>{});
   m.remove();applyUI();syncX();home();toast('Account received')}catch(e){st('Transfer failed ('+(e.code||'error')+').')}}}
async function pendCheck(){let p=null;try{p=JSON.parse(localStorage.getItem('pines.xfer')||'null')}catch(e){}if(!p||!DB)return;try{const sn=await DB.doc('xfer/'+p.id).get();if(sn.exists&&sn.data().st=='received'){await delX(p.id,p.n);loggedOut();return}if(!sn.exists||Date.now()>p.exp+20000){await delX(p.id,p.n);localStorage.removeItem('pines.xfer')}}catch(e){}}
function dbInit(){DBP=(async()=>{DBN='Live code transfer is not available in this build. Send creates an encrypted transfer file instead.'})();return DBP}
dbInit();
async function xsendFile(){const code=genCode(),exp=Date.now()+3e5;let iv=null;const m=modal(`<h3>Send account (file)</h3><p class="mut">Live codes aren’t available here, so Pines made an encrypted transfer file. Move it to the other device (email, WhatsApp, USB), then choose it there and enter this code.</p><div class="code" id="xc">${code.slice(0,4)}-${code.slice(4)}</div><div class="bar2"><i id="xb" style="width:100%"></i></div><div class="mut" id="xs" style="margin-top:8px">Preparing file…</div><div class="acts" style="margin-top:10px"><button class="dng" id="xo">Sign out this device now</button></div>`);
 m.querySelector('.x').addEventListener('click',()=>clearInterval(iv));m.querySelector('#xo').onclick=()=>{clearInterval(iv);m.remove();loggedOut()};
 try{const sealed=await seal(code,{v:1,S,exp});dl('Pines_transfer_'+today()+'.pinestransfer','text/plain',sealed);m.querySelector('#xs').textContent='File downloaded. Waiting…'}catch(e){m.querySelector('#xs').textContent='Could not create the file.';return}
 iv=setInterval(()=>{const left=exp-Date.now(),st=m.querySelector('#xs');if(!st){clearInterval(iv);return}if(left<=0){clearInterval(iv);st.textContent='Code expired. Close this and start again.';m.querySelector('#xc').style.opacity=.35;m.querySelector('#xb').style.width='0';return}st.textContent=`File ready. Code valid for ${Math.floor(left/6e4)}:${String(Math.floor(left/1e3)%60).padStart(2,'0')}`;m.querySelector('#xb').style.width=left/3e3+'%'},500)}
