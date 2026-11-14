/* ============================================================
   Pines · core/actions-project.js
   Project & editor actions (open, delete, tabs, scenes, versions)
   ============================================================ */
Object.assign(A,{
tt:()=>{const s=cur();s.ta=!tam(s);save();dash()},
new:newS,
home,
tab:i=>{tab=i;dash()},
rt:i=>{rtab=i;rq='';rs={c:-1,d:1};dash()},
rhub:()=>{rtab='';dash()},
open:i=>{id=i;tab='write';act=0;dash()},
del:i=>{const s=S.scripts.find(x=>x.id==i);modal(`<h3>Delete “${esc(s.title)}”?</h3><p>This removes it from this browser permanently.</p>`,()=>{S.scripts=S.scripts.filter(x=>x.id!=i);save();home()},'Delete')},
ty:i=>{const s=cur();setType(s,s.blocks[act],T[i],act)},
go:i=>focus(+i),
sg:i=>SG[i].f(),
ns:()=>{const s=cur();s.blocks.splice(act+1,0,nb('scene'));act++;rebuild(s);focus(act);showSg();persist()},
ver:()=>{const s=cur();if(JSON.stringify(s.blocks)===s.saved&&!window._vf)return modal(`<h3>No changes yet</h3><p>Nothing has changed since v${V(s)}. Save a new version anyway?</p>`,()=>{window._vf=1;A.ver();window._vf=0},'Save anyway');modal(`<h3>Update version?</h3><p>Current: v${V(s)}. This saves a snapshot you can restore later.</p><label><input type="radio" name="vt" value="min" checked style="width:auto"> Minor → v${s.v[0]}.${s.v[1]+1}</label><label><input type="radio" name="vt" value="maj" style="width:auto"> Major → v${s.v[0]+1}.0</label>`,m=>{const maj=m.querySelector('[value=maj]').checked;s.v=maj?[s.v[0]+1,0]:[s.v[0],s.v[1]+1];s.history.push({v:V(s),at:Date.now(),blocks:JSON.parse(JSON.stringify(s.blocks))});s.saved=JSON.stringify(s.blocks);save();ledStamp(s,'version').catch(()=>{}).then(()=>{toast('Saved as v'+V(s));dash()})},'Confirm & update')},
restore:i=>{const s=cur(),h=s.history[i];modal(`<h3>Restore v${h.v}?</h3><p>It replaces the current draft. Save a new version afterwards if you wish.</p>`,()=>{s.blocks=JSON.parse(JSON.stringify(h.blocks));save();tab='write';act=0;dash()},'Restore')},
ex:i=>EX[i](cur())
});
