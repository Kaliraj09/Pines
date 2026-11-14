/* ============================================================
   Pines · core/actions-settings.js
   Settings & backup actions (theme, import, backup, erase)
   ============================================================ */
Object.assign(A,{
uitheme:i=>{S.set.uiTheme=i==='classy'?'classy':'cool';applyUI();save();settings();toast((i==='classy'?'Classy':'Cool')+' Theme applied')},
settings:()=>settings(),
st:i=>{stab=i;settings()},
theme:i=>{S.set.theme=i;applyUI();save();settings()},
xsend,
xrecv,
imp:()=>$('#imf').click(),
bk:()=>{dl('Pines_backup_'+today()+'.json','application/json',JSON.stringify(S,null,1));S.set.lastBackup=Date.now();S.set.snooze=0;save();view=='set'?settings():home();toast('Backup downloaded')},
wipe:()=>{modal(`<h3>Erase all data?</h3><p>This permanently deletes every screenplay on this device. Type <b>DELETE</b> to confirm.</p><input id="wc" placeholder="DELETE">`,m=>{if(m.querySelector('#wc').value.trim()!='DELETE')return toast('Type DELETE to confirm'),false;S=blank();save();applyUI();home();toast('All data erased')},'Erase everything')},
fresh:()=>{S=blank();save();applyUI();home()}
});
