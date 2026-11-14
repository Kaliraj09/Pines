/* ============================================================
   Pines · views/library-shelf.js
   Library shelf + reader (sidebar: Library), part 2
   ============================================================ */
let libOpen=-1;
const LIBSPAL=['#1f4e79','#1f3d2e','#5b2a3c','#3a2f5b','#4a3b1f','#2f4858'];
const libPer=()=>innerWidth<600?5:10;
function libShelf(){
 const per=libPer(),rows=Math.max(2,Math.ceil(LIBSCR.length/per));let h='';
 for(let r=0;r<rows;r++){
  const sl=LIBSCR.slice(r*per,(r+1)*per);
  h+=`<div class="lsh-row"><div class="lsh-books">${sl.map((b,k)=>{const i=r*per+k,t=Math.max(30,Math.min(62,Math.round(b.pages*.42))),sc=b.blocks.filter(x=>x[0]==='scene').length;
   return `<div class="bk" role="button" tabindex="0" data-a="libbook" data-i="${i}" style="--t:${t}px;--c:${LIBSPAL[i%LIBSPAL.length]}" aria-label="Open ${esc(b.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><div class="bk-3d"><div class="bk-f bk-cover"><img src="${b.cover}" alt="${esc(b.title)} cover" draggable="false"></div><div class="bk-f bk-back"></div><div class="bk-f bk-spine"><span>${esc(b.title)}</span><i>${esc(b.writer)}</i></div><div class="bk-f bk-pages"></div><div class="bk-f bk-top"></div><div class="bk-f bk-bot"></div></div><div class="bk-tip"><b>${esc(b.title)}</b><span>${esc(b.writer)} · ${b.pages} pages · ${sc} scenes</span><em>Click to read</em></div></div>`}).join('')}</div><div class="lsh-plank"></div></div>`}
 return h}
function libReader(){const b=LIBSCR[libOpen];if(!b){libOpen=-1;return libShelf()}let n=0,jump='';
 const body=b.blocks.map(([t,x])=>{if(t==='scene'){n++;jump+=`<option value="${n}">${n}. ${esc(x)}</option>`;return `<div class="lsr-scene" id="lsr-${n}">${esc(x)}</div>`}return `<div class="lsr-${t}">${esc(x)}</div>`}).join('');
 return `<div class="card sec lsr-bar"><button data-a="libshelf">${I('back',15)}Shelf</button><div class="lsr-tt"><b>${esc(b.title)}</b><span class="mut">Written by ${esc(b.writer)} · ${b.pages} pages · ${n} scenes</span></div><select onchange="var e=document.getElementById('lsr-'+this.value);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})" aria-label="Jump to scene"><option value="">Jump to scene…</option>${jump}</select></div><div class="lsr-paper"><div class="lsr-title">${esc(b.title)}</div><div class="lsr-by">Written by<br>${esc(b.writer)}</div>${body}<div class="lsr-end">— End of screenplay —</div></div>`}
function libSL(){return `${libOpen<0?`<div class="card sec"><h3>Script library</h3><span class="mut">${LIBSCR.length} screenplay${LIBSCR.length==1?'':'s'} on the shelf. Hover a book to see its cover, then click it to read.</span></div>`:''}${libOpen<0?`<div class="lsh">${libShelf()}</div>`:libReader()}<style>
.lsh{padding:6px 0 0}.lsh-row{position:relative;margin:0 0 26px;padding:74px 18px 0;background:linear-gradient(180deg,var(--tint),transparent 85%);border-radius:14px 14px 0 0;box-shadow:inset 0 14px 22px -18px #0f3d2a55}
.lsh-books{display:flex;align-items:flex-end;gap:7px;min-height:262px;padding:0 6px 0 96px}
.lsh-plank{height:18px;margin:0 -8px;border-radius:4px;background:linear-gradient(180deg,#d8b88c 0,#b78d60 55%,#9a7249 100%);box-shadow:0 12px 20px -10px #0007,inset 0 1px 0 #ffffff66}
.bk{--w:170px;--h:242px;position:relative;flex:none;width:var(--t);height:var(--h);cursor:pointer;perspective:1000px;outline:none;-webkit-tap-highlight-color:transparent}
.bk:hover,.bk:focus-visible,.bk.peek{z-index:20}
.bk::after{content:"";position:absolute;left:-4px;right:-4px;bottom:-5px;height:10px;background:radial-gradient(closest-side,#0006,transparent);filter:blur(2px);transition:opacity .4s}
.bk-3d{position:absolute;left:50%;top:0;width:var(--w);height:var(--h);margin-left:calc(var(--w) / -2);transform-style:preserve-3d;transform:rotateY(90deg);transition:transform .75s cubic-bezier(.2,.85,.25,1)}
.bk:hover .bk-3d,.bk:focus-visible .bk-3d,.bk.peek .bk-3d{transform:translateZ(120px) translateY(-12px) rotateY(16deg)}
.bk:hover::after,.bk:focus-visible::after,.bk.peek::after{opacity:.35}
.bk-f{position:absolute;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
.bk-cover{left:0;top:0;width:var(--w);height:var(--h);transform:translateZ(calc(var(--t) / 2));border-radius:2px 5px 5px 2px;box-shadow:inset 4px 0 6px -3px #0006,inset -1px 0 0 #fff4}
.bk-cover img{width:100%;height:100%;object-fit:cover;display:block}
.bk-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0004 0,#fff3 3%,#0000 7%,#0000 100%);pointer-events:none}
.bk-back{left:0;top:0;width:var(--w);height:var(--h);transform:rotateY(180deg) translateZ(calc(var(--t) / 2));background:var(--c)}
.bk-spine{left:50%;top:0;width:var(--t);height:var(--h);margin-left:calc(var(--t) / -2);transform:rotateY(-90deg) translateZ(calc(var(--w) / 2));background:linear-gradient(90deg,#0000002e,#ffffff22 18%,#0000 60%,#00000040),var(--c);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:14px 0;border-radius:2px 0 0 2px}
.bk-spine span{writing-mode:vertical-rl;font:700 13px/1.1 Georgia,serif;letter-spacing:0;max-height:76%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bk-spine i{writing-mode:vertical-rl;font:11px/1 Georgia,serif;opacity:.8;font-style:normal;white-space:nowrap;max-height:26%;overflow:hidden}
.bk-spine::before,.bk-spine::after{content:"";position:absolute;left:0;right:0;height:3px;background:#ffffff66}.bk-spine::before{top:8px}.bk-spine::after{bottom:8px}
.bk-pages{left:50%;top:3px;width:var(--t);height:calc(var(--h) - 6px);margin-left:calc(var(--t) / -2);transform:rotateY(90deg) translateZ(calc(var(--w) / 2 - 3px));background:repeating-linear-gradient(90deg,#f8f4e8 0 2px,#ddd5bc 2px 3px)}
.bk-top,.bk-bot{left:3px;width:calc(var(--w) - 6px);top:50%;height:var(--t);margin-top:calc(var(--t) / -2);background:repeating-linear-gradient(0deg,#f8f4e8 0 2px,#ddd5bc 2px 3px)}
.bk-top{transform:rotateX(90deg) translateZ(calc(var(--h) / 2 - 3px))}.bk-bot{transform:rotateX(-90deg) translateZ(calc(var(--h) / 2 - 3px))}
.bk-tip{position:absolute;left:50%;bottom:calc(100% + 22px);transform:translate(-50%,8px);opacity:0;pointer-events:none;transition:opacity .3s .15s,transform .3s .15s;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:9px 14px;box-shadow:0 14px 28px -12px #0f3d2a66;display:flex;flex-direction:column;gap:2px;text-align:center;white-space:nowrap;color:var(--fg)}
.bk-tip b{font-size:14px}.bk-tip span{font-size:12px;color:var(--mut)}.bk-tip em{font-size:11px;font-style:normal;color:var(--ac);font-weight:600}
.bk:hover .bk-tip,.bk:focus-visible .bk-tip,.bk.peek .bk-tip{opacity:1;transform:translate(-50%,0)}
.lsr-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;position:sticky;top:calc(var(--th,60px) + 4px);z-index:6}.lsr-tt{display:flex;flex-direction:column;min-width:0;flex:1}.lsr-bar select{max-width:260px;width:auto}
.lsr-paper{max-width:680px;margin:14px auto 40px;background:#fff;color:#111;border:1px solid var(--bd);border-radius:6px;box-shadow:var(--sh);padding:44px 54px 56px;font:14px/1.55 "Courier Prime","Courier New",monospace}
.lsr-title{text-align:center;font-weight:700;text-transform:uppercase;font-size:20px;margin:60px 0 26px}.lsr-by{text-align:center;margin-bottom:70px}
.lsr-scene{font-weight:700;text-transform:uppercase;margin-top:22px;scroll-margin-top:calc(var(--th,60px) + 70px)}.lsr-action{margin-top:10px}.lsr-char{margin:14px 0 0 37%;text-transform:uppercase}.lsr-paren{margin-left:27%;margin-right:25%}.lsr-dial{margin:0 14% 0 18%}.lsr-trans{text-align:right;text-transform:uppercase;margin-top:14px}.lsr-end{text-align:center;margin-top:48px;color:#777}
@media(max-width:700px){
.lsr-paper{padding:26px 18px 36px;font-size:12.5px}.lsr-char{margin-left:30%}.lsr-dial{margin:0 4% 0 10%}.lsr-paren{margin-left:20%;margin-right:10%}
.lsh{width:100%;min-width:0}.lsh-row{padding:22px 10px 0;margin-bottom:20px;overflow:visible}
.lsh-books{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));align-items:end;justify-items:center;gap:24px 12px;min-height:0;padding:12px 4px 0}
.bk{--w:126px;--h:179px;width:126px;height:179px;max-width:100%;margin:0 auto}
.bk-3d{transform:rotateY(0deg)}.bk:hover .bk-3d,.bk:focus-visible .bk-3d,.bk.peek .bk-3d{transform:translateY(-5px) rotateY(8deg)}
.bk-tip{white-space:normal;width:min(180px,calc(100vw - 48px));bottom:calc(100% + 12px);z-index:30}
.lsh-plank{margin:0 -2px;height:12px}
.lsr-bar{align-items:stretch}.lsr-bar select{max-width:none;width:100%}
}
@media(max-width:390px){.lsh-books{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 6px}.bk{--w:116px;--h:165px;width:116px;height:165px}.bk-3d{width:var(--w);height:var(--h)}.bk-cover,.bk-back{width:var(--w);height:var(--h)}.bk-spine{height:var(--h)}.bk-pages{height:calc(var(--h) - 6px)}.bk-top,.bk-bot{width:calc(var(--w) - 6px)}}
@media(prefers-reduced-motion:reduce){.bk-3d{transition:none}}
</style>`}
function libBody(){const tb=[['scripts','Script library'],['samples','Sample scripts'],['guide','Formatting guide']];
 const g=`<div class="card sec"><h3>The six building blocks</h3><span class="mut">Read-only reference. Every example is original and sits in the same layout Pines uses.</span></div>${LIBG.map(([h,r,ex])=>`<div class="card sec"><h3>${h}</h3><p class="mut">${r}</p>${libView(ex)}</div>`).join('')}<div class="card sec"><h3>Page and layout basics</h3>${LIBP.map(([a,b])=>rw(a,b,'')).join('')}</div>`;
 const sm=LIBS.map((x,i)=>`<div class="card sec"><h3>${esc(x.t)}</h3><span class="mut">${x.tag}</span>${libView(x.b)}${x.g?`<p class="mut" style="margin-top:10px"><b>English meaning, line by line:</b><br>${x.g.map((l,j)=>(j+1)+'. '+esc(l)).join('<br>')}</p>`:''}<div class="rwb" style="margin-top:12px;flex-wrap:wrap"><button class="pri" data-a="libuse" data-i="${i}">${I('plus',15)}Open as my own copy</button><button data-a="libcopy" data-i="${i}">Copy text</button></div></div>`).join('');
 return `<div class="tabs">${tb.map(([k,n])=>`<button class="${libTab==k?'on':''}" data-a="libtab" data-i="${k}">${n}</button>`).join('')}</div>${libTab=='guide'?g:libTab=='scripts'?libSL():sm}`}
function lib(){id=null;view='lib';shell(nv('home','','dash','Dashboard',0)+nv('new','','plus','New screenplay',0)+nv('lib','','lib','Library',1)+nv('settings','','gear','Settings',0),`<div class="top"><h1>Library</h1><span class="sp"></span><span class="mut">Read-only reference</span></div>`,libBody())}
