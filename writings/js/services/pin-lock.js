/* ============================================================
   Pines · services/pin-lock.js
   PIN lock
   ============================================================ */
/* ---- PIN lock ---- */
let LK=false,LKS=null,pin_='',fails=0,until=0,lastAct=Date.now(),hidAt=0;
const pinH=(p,salt)=>sha256('pines-pin:'+salt+':'+p);
function lockNow(){if(!S.set.pin||LK)return;LKS={view,id,tab};const t=$('#tour');if(t)t.remove();TU=null;document.querySelectorAll('.ov').forEach(x=>x.remove());lockScreen()}
const touchDev=()=>matchMedia('(pointer:coarse)').matches;
function lockScreen(){LK=true;pin_='';const L=S.set.pin.len,tc=touchDev();$('#app').innerHTML=`<div class="lock lk2"><div class="lkc"><div class="lk">${I('lock',34)}</div><h2>Welcome back</h2><p id="lkm" class="mut">Enter your ${L}-digit PIN to unlock Pines</p><div class="pinrow"><input id="pi" type="password" inputmode="${tc?'none':'numeric'}" ${tc?'readonly':''} maxlength="${L}" autocomplete="off" placeholder="${'•'.repeat(L)}" aria-label="PIN"><button class="ib" data-a="pshow" title="Show / hide PIN">${I('eye',18)}</button></div><div class="dots" id="pd">${'<i></i>'.repeat(L)}</div><button class="pri" data-a="punlock">Unlock</button><div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'↵'].map(k=>`<button data-a="pk" data-i="${k}">${k}</button>`).join('')}</div><button class="lnk" data-a="forgot">Forgot PIN?</button></div></div>`;if(!tc)setTimeout(()=>{const i=$('#pi');if(i)i.focus()},60)}
function pinSync(){const L=S.set.pin.len,pd=$('#pd'),i=$('#pi');if(i&&i.value!==pin_)i.value=pin_;pd&&[...pd.children].forEach((d,k)=>d.classList.toggle('on',k<pin_.length))}
async function tryPin(){if(!LK||pin_.length<4)return;const m=$('#lkm'),pd=$('#pd');if(Date.now()<until){m.textContent=`Too many attempts. Try again in ${Math.ceil((until-Date.now())/1e3)}s`;pin_='';pinSync();return}
 if(await pinH(pin_,S.set.pin.salt)==S.set.pin.hash){LK=false;fails=0;lastAct=Date.now();const k2=LKS;if(k2&&k2.id){id=k2.id;tab=k2.tab;dash()}else if(k2&&k2.view=='set')settings();else home();dailySnap()}
 else{fails++;pin_='';const b=document.querySelector('.pinrow');b&&(b.style.animation='shake .4s');pd&&pd.classList.add('bad');setTimeout(()=>{b&&(b.style.animation='');pd&&pd.classList.remove('bad');pinSync();const i=$('#pi');if(i&&!touchDev())i.focus()},400);m.textContent=fails>=5?'Too many attempts. Wait 30 seconds.':'Wrong PIN, try again';if(fails>=5){until=Date.now()+3e4;fails=0}}}
function pkey(k){if(!LK)return;const L=S.set.pin.len;if(k=='⌫')pin_=pin_.slice(0,-1);else if(k=='↵'){tryPin();return}else if(pin_.length<L)pin_+=k;pinSync();if(pin_.length==L)tryPin()}
document.addEventListener('input',e=>{if(!LK||e.target.id!='pi')return;pin_=e.target.value.replace(/\D/g,'').slice(0,S.set.pin.len);pinSync();if(pin_.length==S.set.pin.len)tryPin()});
document.addEventListener('keydown',e=>{if(LK&&e.target.id=='pi'&&e.key=='Enter')tryPin()});
['click','keydown','touchstart','input'].forEach(ev=>addEventListener(ev,()=>{lastAct=Date.now()},{passive:true}));
setInterval(()=>{const m=+S.set.autolock;if(S.set.pin&&!LK&&m>0&&Date.now()-lastAct>m*6e4)lockNow()},5000);
addEventListener('pageshow',e=>{if(e.persisted&&S.set.pin&&!LK)lockNow()});
document.addEventListener('visibilitychange',()=>{if(!S.set.pin)return;const m=+S.set.autolock;if(document.hidden)hidAt=Date.now();else if(!LK&&m>=0&&Date.now()-hidAt>=m*6e4)lockNow()});
function pinModal(title,cur_){const m=modal(`<h3>${title}</h3>${cur_?'<label>Current PIN<input id="p0" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label>':''}<label>New PIN (4–6 digits)<input id="p1" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label><label>Repeat new PIN<input id="p2" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label><div class="mut" id="pm" style="min-height:18px;margin-top:8px"></div>`,()=>{go();return false},'Save PIN');
 async function go(){const q=k=>(m.querySelector(k)||{}).value||'',msg=t=>{m.querySelector('#pm').textContent=t};if(cur_&&await pinH(q('#p0'),S.set.pin.salt)!=S.set.pin.hash)return msg('Current PIN is wrong.');const a=q('#p1');if(!/^\d{4,6}$/.test(a))return msg('Use 4 to 6 digits.');if(a!=q('#p2'))return msg('The two PINs do not match.');const salt=b64(crypto.getRandomValues(new Uint8Array(12)));S.set.pin={salt,hash:await pinH(a,salt),len:a.length};save();m.remove();settings();toast('PIN saved')}}
