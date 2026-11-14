/* ============================================================
   Pines · views/roadmap.js
   Roadmap overlay (opened from Dashboard top-right)
   ============================================================ */
/* ---- Roadmap (read-only overlay, opened from the Dashboard top-right) ---- */
(function(){
const D='done',N='next',L='later';
const PH=[
{k:'01',t:'Write',s:'The craft',d:'Everything you need to put a story on the page.',i:[
['Industry-format editor','Scene headings, action, character, dialogue, parentheticals and transitions',D],
['Smart suggestions','Autocomplete for characters, locations and times as you type',D],
['Dual dialogue','Two characters speaking side by side, in standard format',D],
['Auto (CONT’D) & (MORE)','Added for you when dialogue continues or breaks across a page',D],
['Writing language','Choose the language you write each screenplay in',D],
['Version history','Save and restore earlier drafts of your script',D]]},
{k:'02',t:'Plan',s:'Pre-production',d:'Turn the script into a shoot you can actually run.',i:[
['Reports hub','Scene list, characters, dialogues, locations, shoot plan, revisions and summary',D],
['Day-by-day schedule','Call times and shooting days built from your scenes',D],
['Budget','Automatic estimate by shoot day, plus your own estimated vs actual lines',D],
['Character breakdown','Scenes, lines and words for every character',D],
['Director’s notes','A dedicated space for vision, tone and shot thinking',D],
['Table read','Hear your script read aloud, voice by voice',D]]},
{k:'03',t:'Pitch & Protect',s:'Show it, share it, secure it',d:'Get the script in front of people, with proof it’s yours.',i:[
['Pitch deck','Build a presentation of your project from the script',D],
['Legal templates','Ready-made agreements and release forms',D],
['Script certificates','SHA-256 fingerprint registration that expires if the script is edited',D],
['Advanced PDF export','Paper size, margins, scene range, numbering and watermark',D],
['13 export formats','Final Draft (.fdx), Fountain, Word, RTF, HTML, Markdown, CSV, Excel and more',D],
['Script library','Seven landmark screenplays built into Pines, ready to read and study beside your own work',D,[
['The Godfather','Mario Puzo & Francis Ford Coppola',124],
['Titanic','James Cameron',182],
['Interstellar','Jonathan Nolan & Christopher Nolan',151],
['The Dark Knight Rises','Jonathan Nolan & Christopher Nolan',162],
['Joker','Todd Phillips & Scott Silver',104],
['12 Angry Men','Reginald Rose',149],
['(500) Days of Summer','Brent Dunham',112]]]]},
{k:'04',t:'Safe & Sound',s:'Your work, protected',d:'Private by default, with backups you control.',i:[
['Daily snapshots','An automatic backup of everything, once a day',D],
['Folder & Google Drive backup','Scheduled backups to a folder or to Drive',D],
['PIN lock & auto-lock','Lock the app after a time you choose',D],
['Privacy & cookie manager','See what is stored on this device and erase it',D],
['Device transfer','Send your workspace to another device with a one-time code',D],
['Themes & dark mode','Cool and Classy looks, light and dark',D],
['Guided tour','A 30-second walkthrough you can replay any time',D]]},
{k:'05',t:'Next Horizon',s:'Coming soon',d:'The next things we’re building for your writing.',i:[
['Cloud backup','Back up your screenplays to the cloud automatically and restore them on any device',N],
['Visualize','Pick characters and a location, set the time of day and plan the camera shot for each scene',N],
['Director’s notes palettes','Choose colour palettes and gradient looks for your notes page',N],
['Beat board','Drag index cards to shape your story before and after drafting',L],
['Script coach','Pacing, dialogue balance and scene-length insights',L]]},
{k:'06',t:'Together',s:'Write with others',d:'Bring partners, readers and teachers into the story.',i:[
['Simultaneous writing','Two people working in the same script at the same time, seeing each other’s changes live',L],
['Script sharing','Send a script to anyone with a private link and choose what they can do',L],
['Script commenting','Leave notes on any line or scene and reply in threads',L],
['Screenwriting courses','Learn the craft with lessons and exercises inside Pines',L]]},
{k:'07',t:'Everywhere',s:'Your studio, on every screen',d:'More languages and a native app for every device you own.',i:[
['10 more languages','Write and use Pines in ten additional languages',L],
['Windows app','An exclusive native desktop app for Windows',L],
['Android app','Pines in your pocket on Android phones and tablets',L],
['iOS app','Pines for iPhone and iPad',L]]}
];
const ST={done:'Live now',next:'Up next',later:'Later'};
const css=`
.rm-ov{--r-bg:#f3fdf8;--r-card:#fff;--r-fg:#0f2a20;--r-mut:#5a7569;--r-bd:#d2eee0;--r-ac:#14835c;--r-dk:#0b4a35;--r-tint:#e8fcf2;--r-mint:#a8f3cf;position:fixed;inset:0;z-index:60;overflow:auto;background:var(--r-bg);color:var(--r-fg);padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);animation:rmIn .35s cubic-bezier(.2,.8,.2,1);-webkit-overflow-scrolling:touch}
[data-theme=dark] .rm-ov{--r-bg:#0a1511;--r-card:#10201a;--r-fg:#e6f6ee;--r-mut:#8fb0a2;--r-bd:#1f3a2f;--r-ac:#3ddc97;--r-dk:#0b4a35;--r-tint:#12291f;--r-mint:#1d5d43}
@keyframes rmIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes rmUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes rmPulse{0%{box-shadow:0 0 0 0 #3ddc9788}100%{box-shadow:0 0 0 16px #3ddc9700}}
.rm-wrap{max-width:1020px;margin:0 auto;padding:18px 18px 70px}
.rm-bar{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.rm-bar b{font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--r-mut)}
.rm-bar .rm-sp{flex:1}
.rm-x{border:1px solid var(--r-bd);background:var(--r-card);color:var(--r-fg);border-radius:12px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer}
.rm-x:hover{border-color:var(--r-ac)}
.rm-hero{position:relative;overflow:hidden;border-radius:26px;padding:30px 28px;background:linear-gradient(125deg,#0b4a35 0%,#14835c 55%,#3ddc97 120%);color:#fff;display:flex;align-items:center;gap:26px;flex-wrap:wrap;box-shadow:0 22px 50px -26px #0b4a35}
.rm-hero::after{content:"";position:absolute;right:-60px;top:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,#ffffff2e,transparent 70%)}
.rm-hero h1{margin:0 0 6px;font-family:var(--disp,Georgia,serif);font-size:clamp(28px,5vw,42px);line-height:1.05;letter-spacing:-.01em;color:#fff}
.rm-hero p{margin:0;max-width:430px;opacity:.9;line-height:1.5}
.rm-hero>div{position:relative;z-index:1}
.rm-ring{position:relative;width:118px;height:118px;flex:none}
.rm-ring svg{transform:rotate(-90deg)}
.rm-ring circle{fill:none;stroke-width:9;stroke-linecap:round}
.rm-ring .a{stroke:#ffffff30}.rm-ring .b{stroke:#fff;stroke-dasharray:289;stroke-dashoffset:289;transition:stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) .25s}
.rm-ring span{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-weight:800;font-size:26px;line-height:1}
.rm-ring small{display:block;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.8;margin-top:3px}
.rm-st{display:flex;gap:10px;flex-wrap:wrap;margin-left:auto}
.rm-st div{background:#ffffff1f;border:1px solid #ffffff2e;border-radius:16px;padding:10px 16px;min-width:92px;backdrop-filter:blur(4px)}
.rm-st b{display:block;font-size:24px}.rm-st span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.85}
.rm-fl{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0 26px}
.rm-fl button{border:1px solid var(--r-bd);background:var(--r-card);color:var(--r-fg);border-radius:999px;padding:8px 16px;font:inherit;font-weight:600;cursor:pointer;transition:.2s}
.rm-fl button.on{background:var(--r-dk);border-color:var(--r-dk);color:#fff}
[data-theme=dark] .rm-fl button.on{background:var(--r-ac);border-color:var(--r-ac);color:#06130d}
.rm-tl{position:relative;padding-left:62px}
.rm-tl::before{content:"";position:absolute;left:21px;top:6px;bottom:6px;width:3px;border-radius:3px;background:repeating-linear-gradient(to bottom,var(--r-bd) 0 7px,transparent 7px 14px)}
.rm-fill{position:absolute;left:21px;top:6px;width:3px;border-radius:3px;height:0;background:linear-gradient(to bottom,#0b4a35,#3ddc97);transition:height 1.6s cubic-bezier(.2,.8,.2,1) .3s}
.rm-ph{position:relative;margin-bottom:34px;animation:rmUp .6s cubic-bezier(.2,.8,.2,1) backwards}
.rm-node{position:absolute;left:-62px;top:0;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:14px;border:3px solid var(--r-bg);background:var(--r-card);color:var(--r-mut);box-shadow:0 0 0 2px var(--r-bd)}
.rm-ph.done .rm-node{background:linear-gradient(135deg,#0b4a35,#14835c);color:#fff;box-shadow:0 0 0 2px #14835c}
.rm-ph.todo .rm-node{box-shadow:0 0 0 2px var(--r-ac);color:var(--r-ac);border-style:solid}
.rm-ph h2{margin:0;font-family:var(--disp,Georgia,serif);font-size:25px;line-height:1.1}
.rm-ph .sub{display:flex;align-items:center;gap:8px;margin:5px 0 4px;flex-wrap:wrap}
.rm-ph .sub em{font-style:normal;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--r-ac);font-weight:700}
.rm-ph .sub i{font-style:normal;font-size:12px;color:var(--r-mut)}
.rm-ph>p{margin:0 0 14px;color:var(--r-mut)}
.rm-gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:12px}
.rm-it{position:relative;border:1px solid var(--r-bd);background:var(--r-card);border-radius:16px;padding:14px 14px 14px 14px;transition:transform .25s,box-shadow .25s,border-color .25s;animation:rmUp .5s cubic-bezier(.2,.8,.2,1) backwards}
.rm-it:hover{transform:translateY(-3px);box-shadow:0 14px 28px -18px #0f3d2a66;border-color:var(--r-ac)}
.rm-it.done{background:linear-gradient(160deg,var(--r-tint),var(--r-card) 70%)}
.rm-it.next{border:1.5px dashed var(--r-ac)}
.rm-it.later{border:1.5px dashed var(--r-bd);opacity:.9}
.rm-pill{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:3px 9px;border-radius:999px;margin-bottom:8px}
.done .rm-pill{background:#14835c;color:#fff}
.next .rm-pill{background:var(--r-tint);color:var(--r-ac);border:1px solid var(--r-ac)}
.later .rm-pill{background:transparent;color:var(--r-mut);border:1px solid var(--r-bd)}
.rm-it b{display:block;font-size:15px;margin-bottom:4px}
.rm-it span.d{display:block;font-size:13px;line-height:1.45;color:var(--r-mut)}
.rm-here{position:relative;margin:2px 0 34px;display:flex;align-items:center;gap:12px}
.rm-here .pin{position:absolute;left:-52px;width:26px;height:26px;border-radius:50%;background:#3ddc97;border:4px solid var(--r-bg);animation:rmPulse 1.8s infinite}
.rm-here span{background:var(--r-dk);color:#fff;padding:7px 16px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
[data-theme=dark] .rm-here span{background:var(--r-ac);color:#06130d}
.rm-here hr{flex:1;border:0;border-top:2px dashed var(--r-bd);margin:0}
.rm-empty{color:var(--r-mut);padding:20px 0}
.rm-it.wide{grid-column:1/-1}
.rm-shelf{display:flex;gap:12px;overflow-x:auto;padding:14px 2px 6px;margin-top:6px;scroll-snap-type:x proximity}
.rm-bk{position:relative;flex:0 0 132px;height:182px;border-radius:6px 12px 12px 6px;padding:12px 11px 11px 17px;color:#fff;display:flex;flex-direction:column;box-shadow:0 14px 22px -14px #000a,inset 0 0 0 1px #ffffff1f;scroll-snap-align:start;transition:transform .3s cubic-bezier(.2,.8,.2,1);animation:rmUp .5s cubic-bezier(.2,.8,.2,1) backwards;overflow:hidden}
.rm-bk::before{content:"";position:absolute;left:0;top:0;bottom:0;width:9px;background:#00000038;box-shadow:inset -1px 0 0 #ffffff26}
.rm-bk:hover{transform:translateY(-8px) rotate(-1.5deg)}
.rm-bk em{font-style:normal;font-size:10px;font-weight:800;letter-spacing:.14em;opacity:.7}
.rm-bk strong{display:block;margin-top:auto;font-family:var(--disp,Georgia,serif);font-size:17px;line-height:1.1;color:#fff}
.rm-bk small{display:block;margin-top:6px;font-size:10.5px;line-height:1.3;opacity:.82}
.rm-bk u{text-decoration:none;margin-top:7px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.9}
@media(max-width:640px){.rm-tl{padding-left:50px}.rm-node{left:-50px;width:40px;height:40px}.rm-tl::before,.rm-fill{left:18px}.rm-here .pin{left:-42px}.rm-st{margin-left:0}.rm-hero{padding:24px 20px}}
@media(prefers-reduced-motion:reduce){.rm-ov,.rm-ph,.rm-it,.rm-here .pin{animation:none}.rm-fill,.rm-ring .b{transition:none}}
`;
let ov=null,flt='all';
const cnt=()=>{let d=0,t=0;PH.forEach(p=>p.i.forEach(x=>{t++;if(x[2]==D)d++}));return{d,t,n:t-d}};
const BK=['#0b4a35,#14835c','#12365a,#2a78b5','#3b2a5c,#7a56c2','#2b2f33,#5b646b','#6b2b1c,#c4602f','#4a3a0e,#b8932a','#0e4a4a,#2fb3a7'];
function shelf(a){return '<div class="rm-shelf">'+a.map((b,i)=>`<div class="rm-bk" style="background:linear-gradient(150deg,${BK[i%BK.length]});animation-delay:${i*70}ms"><em>${i+1}</em><strong>${b[0]}</strong><small>${b[1]}</small><u>${b[2]} pages</u></div>`).join('')+'</div>'}
function body(){
 const c=cnt(),pc=Math.round(c.d/c.t*100);
 let delay=0,hereDone=0,h='';
 PH.forEach((p,pi)=>{
  const its=p.i.filter(x=>flt=='all'||x[2]==flt);
  if(!its.length)return;
  const pd=p.i.filter(x=>x[2]==D).length,all=pd==p.i.length;
  if(!all&&!hereDone&&flt=='all'){hereDone=1;h+=`<div class="rm-here" id="rmHere"><i class="pin"></i><span>We are here</span><hr></div>`}
  h+=`<section class="rm-ph ${all?'done':'todo'}" style="animation-delay:${pi*90}ms"><div class="rm-node">${all?'✓':p.k}</div><h2>${p.t}</h2><div class="sub"><em>${p.s}</em><i>${pd} of ${p.i.length} live</i></div><p>${p.d}</p><div class="rm-gr">`+
  its.map(x=>`<div class="rm-it ${x[2]}${x[3]?' wide':''}" style="animation-delay:${(pi*90+(delay++%6)*55+120)}ms"><div class="rm-pill">${x[2]==D?'✓ ':''}${ST[x[2]]}</div><b>${x[0]}</b><span class="d">${x[1]}</span>${x[3]?shelf(x[3]):''}</div>`).join('')+`</div></section>`;
 });
 return{pc,c,h:h||'<div class="rm-empty">Nothing here yet.</div>'};
}
function paint(first){
 const r=body(),w=ov.querySelector('.rm-wrap');
 w.innerHTML=`<div class="rm-bar"><b>Pines</b><span class="rm-sp"></span><button class="rm-x" type="button">Close ✕</button></div>
 <div class="rm-hero"><div class="rm-ring"><svg width="118" height="118" viewBox="0 0 118 118"><circle class="a" cx="59" cy="59" r="46"/><circle class="b" cx="59" cy="59" r="46"/></svg><span><div>${r.pc}%<small>built</small></div></span></div>
 <div><h1>Roadmap</h1><p>Everything Pines can do today, and the road ahead. Items marked <b>Live now</b> are finished and ready to use.</p></div>
 <div class="rm-st"><div><b>${r.c.d}</b><span>Live now</span></div><div><b>${r.c.n}</b><span>Coming</span></div></div></div>
 <div class="rm-fl">${[['all','Everything'],['done','Live now'],['next','Up next'],['later','Later']].map(f=>`<button type="button" data-f="${f[0]}" class="${flt==f[0]?'on':''}">${f[1]}</button>`).join('')}</div>
 <div class="rm-tl"><div class="rm-fill"></div>${r.h}</div>`;
 w.querySelector('.rm-x').onclick=close;
 w.querySelectorAll('.rm-fl button').forEach(b=>b.onclick=()=>{flt=b.dataset.f;paint()});
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const ring=w.querySelector('.rm-ring .b');if(ring)ring.style.strokeDashoffset=289*(1-r.pc/100);
  const f=w.querySelector('.rm-fill'),tl=w.querySelector('.rm-tl'),here=w.querySelector('#rmHere');
  if(f&&tl)f.style.height=(here?here.offsetTop+13:tl.scrollHeight-12)+'px';
 }));
}
function onKey(e){if(e.key=='Escape')close()}
function close(){if(!ov)return;document.removeEventListener('keydown',onKey);ov.remove();ov=null;document.documentElement.style.overflow=''}
function open(){
 if(ov)return;
 if(!document.getElementById('rm-css')){const s=document.createElement('style');s.id='rm-css';s.textContent=css;document.head.appendChild(s)}
 flt='all';ov=document.createElement('div');ov.className='rm-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Roadmap');ov.innerHTML='<div class="rm-wrap"></div>';
 document.body.appendChild(ov);document.documentElement.style.overflow='hidden';document.addEventListener('keydown',onKey);paint(1);
}
A.roadmap=open;
})();
