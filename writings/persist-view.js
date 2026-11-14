/* ============================================================
   Pines · core/persist-view.js
   Stay on the same page after refresh
   ============================================================ */
/* Stay on the same page after a refresh: remember the screen, tab, open book and scroll position. */
(()=>{
const KEY='pines_nav';
const scrollers=()=>[document.scrollingElement,document.querySelector('.ct'),document.querySelector('main'),document.getElementById('app')].filter(Boolean);
const getY=()=>Math.max(0,...scrollers().map(e=>e.scrollTop||0));
const state=()=>({id:id,view:view,tab:tab,rtab:rtab,ltab:ltab,stab:stab,libTab:libTab,libOpen:libOpen,act:act,y:getY()});
let last='';
function save(){try{if(LK)return;const st=JSON.stringify(state());if(st!==last){last=st;localStorage.setItem(KEY,st)}}catch(e){}}
function restore(){let n=null;try{n=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!n)return;
 const ok=n.id&&S.scripts.find(x=>x.id===n.id);
 if(ok){id=n.id;view=n.view||'home';tab=n.tab||'write';rtab=n.rtab||'';ltab=n.ltab||'home';act=n.act||0}
 else if(n.view==='set'){id=null;view='set';stab=n.stab||'general'}
 else if(n.view==='lib'){id=null;view='lib';libTab=n.libTab||'scripts';libOpen=(typeof n.libOpen==='number'&&n.libOpen>=0&&typeof LIBSCR!=='undefined'&&LIBSCR[n.libOpen])?n.libOpen:-1}
 else return;
 if(LK){LKS={view:view,id:ok?id:null,tab:tab};return}
 if(ok)dash();else if(view==='set')settings();else lib();
 if(!ok||tab!=='write'){const y=n.y||0;if(y>0)[60,350,900].forEach(t=>setTimeout(()=>scrollers().forEach(e=>{e.scrollTop=y}),t))}
}
restore();
setInterval(save,300);
addEventListener('pagehide',save);
document.addEventListener('visibilitychange',save);
})();
