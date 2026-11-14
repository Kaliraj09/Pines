/* ============================================================
   Pines · core/boot.js
   Boot: merges action packs, seeds demo screenplays, opens Home or PIN lock
   ============================================================ */
Object.assign(A,newA());Object.assign(A,newA2());Object.assign(A,newA3());Object.assign(A,newA4());Object.assign(A,newA5());Object.assign(A,newA6());Object.assign(A,newA7());

Object.assign(A,{
 coverRemove:()=>{const s=cur();if(!s)return;delete s.cover;save();dash();toast('Thumbnail removed')},
 toggleScenes:()=>{const w=$('#writeWorkspace');if(!w)return;w.classList.toggle('scenes-collapsed');const b=$('.scene-nav-toggle');if(b){b.title=w.classList.contains('scenes-collapsed')?'Expand scenes':'Collapse scenes';b.setAttribute('aria-label',b.title);b.innerHTML=I(w.classList.contains('scenes-collapsed')?'panel-left-open':'panel-left-close',15)}},
 focusMode:()=>{const on=!document.body.classList.contains('focus-mode');document.body.classList.toggle('focus-mode',on);let x=$('#focusExit');if(on){if(!x){x=document.createElement('button');x.id='focusExit';x.dataset.a='focusMode';x.textContent='Exit focus';document.body.appendChild(x)}}else if(x)x.remove();if(on){flush();const a=ta(act);if(a)a.focus()}toast(on?'Focus writing mode on':'Focus writing mode off')},
 fullscreen:()=>{if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});return}const root=document.documentElement;if(root.requestFullscreen){root.requestFullscreen().then(()=>document.body.classList.remove('pseudo-fullscreen')).catch(()=>{document.body.classList.toggle('pseudo-fullscreen')})}else document.body.classList.toggle('pseudo-fullscreen')},
 tplsave:()=>{const s=cur();if(!s)return;modal(`<h3>Save custom template</h3><p class="mut">Save this screenplay’s scene and element structure as a reusable starting template. Existing writing will not be copied.</p><label>Template name<input id="tpl_name" maxlength="60" placeholder="e.g. My Tamil short film"></label>`,m=>{const name=m.querySelector('#tpl_name').value.trim();if(!name)return toast('Enter a template name'),false;const blocks=s.blocks.map(b=>({t:b.t,x:b.t==='scene'?`${ps(b.x).ie}  - ${ps(b.x).td}`:''}));S.templates.push({id:'tpl'+Date.now(),name,blocks,created:Date.now()});save();toast('Template saved')},'Save template')},
 tpldel:()=>{const sel=$('#f_tpl');if(!sel||!sel.value.startsWith('custom:'))return toast('Choose a custom template first');const id=sel.value.slice(7),tpl=S.templates.find(x=>x.id===id);if(!tpl)return;const parent=sel.closest('.ov');modal(`<h3>Remove template?</h3><p>“${esc(tpl.name)}” will be removed from your custom templates. Existing screenplays are not affected.</p>`,()=>{S.templates=S.templates.filter(x=>x.id!==id);save();if(parent)parent.remove();newS()},'Remove template')}
});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)document.body.classList.remove('pseudo-fullscreen')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.body.classList.contains('focus-mode'))A.focusMode();if(document.body.classList.contains('pseudo-fullscreen'))document.body.classList.remove('pseudo-fullscreen')}if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='f'&&cur()&&tab==='write'){e.preventDefault();A.focusMode()}});

const setTH=()=>{const t=document.querySelector('.top');document.documentElement.style.setProperty('--th',(t?t.offsetHeight:0)+'px')};addEventListener('resize',setTH);new MutationObserver(()=>setTimeout(setTH,0)).observe(document.getElementById('app'),{childList:true});
document.addEventListener('keydown',e=>{if(!e.altKey||!/^Digit[1-6]$/.test(e.code)||!cur()||tab!='write'||LK)return;e.preventDefault();const s=cur(),b=s.blocks[act];if(b)setType(s,b,T[+e.code.slice(5)-1],act)});
function seedDemoScreenplays(){if(S.scripts.length)return;const now=Date.now(),mk=(id,title,genre,lang,blocks,writer)=>{const s={id,title,writer,email:'',date:today(),genre,lang,v:[1,0],blocks:blocks.map(([t,x])=>({t,x})),history:[],demo:true,upd:now-(id==='demo1'?86400000*2:86400000)};s.saved=JSON.stringify(s.blocks);return s};
 S.scripts=[
 mk('demo1','The Last Monsoon','Drama','Tamil',[
 ['scene','EXT. VILLAGE ROAD - DAWN'],['action','A quiet village wakes beneath a fading monsoon sky. Water runs along the edges of the road.'],['action','ARUN, 26, walks with a camera bag over his shoulder. He stops beside a dry public tap.'],['char','ARUN'],['dial','இந்த மழை நின்னதும் ஊரே மாறிடும். ஆனா நம்ம வாழ்க்கை மட்டும் மாறுமா?'],['scene','INT. RANI’S HOUSE - MORNING'],['action','RANI folds an old letter and places it inside a steel trunk.'],['char','RANI'],['paren','(without looking up)'],['dial','நீ திரும்பி வருவேன்னு சொன்னது இந்த மழைக்காக இல்ல.'],['trans','CUT TO:'],['scene','EXT. LAKE BUND - EVENING'],['action','Arun watches the last light settle over the lake. A phone vibrates in his hand.']
 ],'K. Kaliraj'),
 mk('demo2','One More Call','Thriller','English',[
 ['scene','INT. SMALL NEWSROOM - NIGHT'],['action','The newsroom is almost empty. A desk lamp flickers beside a ringing telephone.'],['action','MEERA, 29, answers the call and listens without speaking.'],['char','MEERA'],['paren','(quietly)'],['dial','Tell me exactly what you saw. Start from the beginning.'],['scene','EXT. CLOSED BUS STAND - NIGHT'],['action','Rainwater drips from the shelter roof. A lone bus idles with its headlights on.'],['action','A man in a grey shirt watches Meera from across the road.'],['char','STRANGER'],['dial','You should not have picked up that call.'],['scene','INT. SMALL NEWSROOM - LATER'],['action','Meera looks at the caller ID. The number belongs to her own phone.'],['char','MEERA'],['dial','That is impossible.']
 ],'Pines Sample Studio')
 ];save()}
{const n0=S.scripts.length;S.scripts=S.scripts.filter(x=>!(x.demo&&x.saved===JSON.stringify(x.blocks)&&!(x.history||[]).length));if(S.scripts.length!==n0)save()}
if(!S.set.first){if(S.scripts.some(x=>!x.demo)){S.set.t1=S.set.t2=true}S.set.first=Date.now();save()}
applyUI();syncX();ckClear();if(S.set.pin)lockScreen();else{home();dailySnap()}
