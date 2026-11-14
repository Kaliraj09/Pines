/* ============================================================
   Pines · core/history-nav.js
   In-app Back / Forward history
   ============================================================ */
/* In-app history: the browser Back/Forward buttons move between Pines screens only. */
(()=>{
const sig=()=>JSON.stringify([typeof id!=='undefined'?id:null,view,tab,rtab,ltab,stab,libTab,libOpen]);
const snap=()=>({pines:1,id:id,view:view,tab:tab,rtab:rtab,ltab:ltab,stab:stab,libTab:libTab,libOpen:libOpen});
let last='',busy=false;
const safe=f=>{try{f()}catch(e){}};
function stamp(){
  if(typeof LK!=='undefined'&&LK)return;
  const s=sig();if(s===last)return;last=s;
  if(!busy)safe(()=>history.pushState(snap(),'',location.href));
}
function render(){
  document.querySelectorAll('.ov').forEach(x=>x.remove());
  if(id&&S.scripts.find(x=>x.id===id))dash();
  else if(view==='set')settings();
  else if(view==='lib')lib();
  else home();
}
addEventListener('popstate',e=>{
  if(typeof LK!=='undefined'&&LK){safe(()=>history.pushState(snap(),'',location.href));return}
  const st=e.state;
  if(!st||!st.pines||st.root){
    /* reached the guard entry: stay inside the tool */
    busy=true;id=null;view='home';tab='write';rtab='';ltab='home';
    safe(()=>history.pushState(snap(),'',location.href));
    render();last=sig();busy=false;return;
  }
  busy=true;
  id=st.id;view=st.view;tab=st.tab;rtab=st.rtab||'';ltab=st.ltab||'home';stab=st.stab||'general';libTab=st.libTab||'scripts';libOpen=(typeof st.libOpen==='number')?st.libOpen:-1;
  render();last=sig();busy=false;
});
/* guard entry underneath the first screen so Back never leaves the tool */
safe(()=>{history.replaceState({pines:1,root:1},'',location.href);history.pushState(snap(),'',location.href)});
last=sig();
setInterval(stamp,200);
document.addEventListener('click',()=>setTimeout(stamp,30),true);
})();
