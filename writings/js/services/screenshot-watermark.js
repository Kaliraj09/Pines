/* ============================================================
   Pines · services/screenshot-watermark.js
   Screenshot watermark
   ============================================================ */
/* ---- screenshot watermark: tool name + writer name + "Contents are protected" ---- */
(function(){
  let el=null,key='',ft=0;
  const xe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const who=()=>{const s=typeof cur=='function'?cur():null;return String((s&&s.writer)||S.set.name||(S.scripts[0]&&S.scripts[0].writer)||'Writer').trim()||'Writer'};
  const tile=w=>{const svg="<svg xmlns='http://www.w3.org/2000/svg' width='360' height='230'><g transform='rotate(-24 180 115)' text-anchor='middle' fill='#6b6b6b' font-family='Inter,Noto Sans Tamil,Arial,sans-serif'><text x='180' y='88' font-size='20' font-weight='700' letter-spacing='4'>PINES</text><text x='180' y='114' font-size='15' font-weight='600'>"+xe(w)+"</text><text x='180' y='136' font-size='12'>Contents are protected</text></g></svg>";return 'url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")'};
  function sync(){
    const on=S.set.shotwm===true&&!LK;
    if(!on){if(el){el.remove();el=null;key=''}return}
    if(!el||!el.isConnected){el=document.createElement('div');el.id='shotwm';el.setAttribute('aria-hidden','true');document.body.appendChild(el);key=''}
    const w=who();if(w!==key){key=w;el.style.backgroundImage=tile(w)}
  }
  function boost(){if(!el)return;el.style.setProperty('opacity','.5','important');clearTimeout(ft);ft=setTimeout(()=>{if(el)el.style.removeProperty('opacity')},3000)}
  addEventListener('keydown',e=>{if(e.metaKey&&e.shiftKey&&['Digit3','Digit4','Digit5','KeyS'].includes(e.code))boost()},true);
  addEventListener('keyup',e=>{if(e.key==='PrintScreen'){boost();try{toast('Screenshot taken · watermark applied · contents are protected')}catch(_){}}},true);
  window.shotSync=sync;sync();setInterval(sync,800);
})();

Object.assign(A,{dual:toggleDual});
