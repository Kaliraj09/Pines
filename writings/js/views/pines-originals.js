/* ============================================================
   Pines · views/pines-originals.js
   Library → "Pines Original" tab: animated showcase + shelves + reader.
   Books come from data/pines-originals.js (PINES_ORIG).
   Uses the library's own libTab / libOpen state, so Back, refresh and
   the tab bar keep working as they do for the other tabs.
   ============================================================ */
(function(){
 /* ---------- styles (injected once) ---------- */
 if(!document.getElementById('po-css')){
  const st=document.createElement('style');st.id='po-css';
  st.textContent=`
/* tab highlight */
.tabs button[data-i="originals"]{font-weight:700;white-space:nowrap}
.tabs button[data-i="originals"]::before{content:"✦";display:inline-block;margin-right:6px;color:#e0a22a;animation:poTwinkle 2.2s ease-in-out infinite}
.tabs button[data-i="originals"]:not(.on){box-shadow:0 0 0 1px #e0a22a66;background-image:linear-gradient(100deg,transparent 30%,#f2c35b3d 50%,transparent 70%);background-size:260% 100%;animation:poTabShine 3.6s linear infinite}
@keyframes poTwinkle{0%,100%{transform:scale(1) rotate(0);opacity:1}50%{transform:scale(1.35) rotate(25deg);opacity:.6}}
@keyframes poTabShine{from{background-position:130% 0}to{background-position:-130% 0}}

/* page */
.po{display:flex;flex-direction:column;gap:22px;animation:poIn .6s both}
@keyframes poIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

/* hero */
.po-hero{position:relative;overflow:hidden;isolation:isolate;border-radius:22px;padding:56px 34px 50px;color:#fff;text-align:center;background:radial-gradient(120% 140% at 15% 0,#0f5a3f 0,#07281c 46%,#030f0a 100%);box-shadow:0 30px 60px -30px #03150d,inset 0 0 0 1px #ffffff14}
.po-aurora{position:absolute;inset:0;z-index:-1;overflow:hidden}
.po-aurora i{position:absolute;width:340px;height:340px;border-radius:50%;filter:blur(70px);opacity:.55;animation:poDrift 14s ease-in-out infinite alternate}
.po-aurora i:nth-child(1){left:-80px;top:-100px;background:#1fbf84}
.po-aurora i:nth-child(2){right:-60px;top:20px;background:#d9a42c;opacity:.32;animation-duration:18s;animation-delay:-4s}
.po-aurora i:nth-child(3){left:35%;bottom:-180px;background:#2f8f9c;opacity:.4;animation-duration:16s;animation-delay:-8s}
@keyframes poDrift{from{transform:translate(0,0) scale(1)}to{transform:translate(70px,40px) scale(1.2)}}
.po-film{position:absolute;left:0;right:0;height:16px;opacity:.9;background:repeating-linear-gradient(90deg,transparent 0 9px,#ffffff26 9px 21px,transparent 21px 30px);animation:poFilm 5s linear infinite}
.po-film.t{top:10px}.po-film.b{bottom:10px;animation-direction:reverse}
@keyframes poFilm{to{background-position-x:30px}}
.po-ember{position:absolute;bottom:-10px;left:var(--l);width:var(--s);height:var(--s);border-radius:50%;background:#ffd98a;box-shadow:0 0 10px 2px #f6cf72aa;opacity:0;animation:poRise var(--t) linear infinite;animation-delay:var(--d)}
@keyframes poRise{0%{transform:translate(0,0);opacity:0}12%{opacity:.9}100%{transform:translate(var(--x),-340px);opacity:0}}
.po-kick{display:inline-block;font-weight:700;font-size:11px;line-height:1;letter-spacing:.22em;color:#f6cf72;padding:7px 14px;border:1px solid #f6cf7255;border-radius:99px;background:#00000033;animation:poFade .9s .1s both}
.po-h{margin:16px 0 8px;font:700 clamp(34px,6vw,60px)/1.05 var(--disp,Georgia,serif);letter-spacing:-.025em;animation:poFade .9s .25s both}
.po-h em{font-style:normal;background:linear-gradient(100deg,#f6cf72 20%,#fff6d6 42%,#f6cf72 62%) 0 0/260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:poShimmer 4.5s linear infinite}
@keyframes poShimmer{to{background-position:-260% 0}}
.po-sub{max-width:560px;margin:0 auto;font-size:14px;line-height:1.7;color:#d6efe3;animation:poFade .9s .4s both}
.po-stats{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:22px;animation:poFade .9s .55s both}
.po-stats span{padding:8px 14px;border-radius:99px;background:#ffffff12;border:1px solid #ffffff1f;font-size:12px;color:#d6efe3}
.po-stats b{color:#ffe9a8;font-size:14px;margin-right:4px}
@keyframes poFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* featured */
.po-feat{position:relative;overflow:hidden;isolation:isolate;border-radius:22px;padding:36px;color:#fff;background:#06140e;border:1px solid #f2c35b55;box-shadow:0 30px 60px -30px #000}
.po-feat-bg{position:absolute;inset:-40px;z-index:-1;background:var(--cv) center/cover;filter:blur(40px) saturate(1.4) brightness(.42);transform:scale(1.15);animation:poBg 18s ease-in-out infinite alternate}
@keyframes poBg{from{transform:scale(1.15) translate(0,0)}to{transform:scale(1.3) translate(-24px,14px)}}
.po-feat-in{display:grid;grid-template-columns:minmax(210px,290px) 1fr;gap:40px;align-items:center}
.po-poster{position:relative;isolation:isolate;width:100%;max-width:290px;margin:0 auto;cursor:pointer;perspective:900px;outline:none;animation:poFloat 6s ease-in-out infinite;-webkit-tap-highlight-color:transparent}
@keyframes poFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.po-glow{position:absolute;inset:-18px;z-index:-1;border-radius:24px;background:radial-gradient(closest-side,#f6cf7266,transparent);filter:blur(16px);animation:poPulse 3.2s ease-in-out infinite}
@keyframes poPulse{0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:1;transform:scale(1.06)}}
.po-face{position:relative;overflow:hidden;border-radius:10px;aspect-ratio:934/1280;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .25s ease-out;box-shadow:0 34px 50px -20px #000d,0 0 0 1px #ffffff2e}
.po-face img{display:block;width:100%;height:100%;object-fit:cover}
.po-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 36%,#ffffff45 49%,transparent 62%);transform:translateX(-130%);animation:poSweep 5s ease-in-out 1.2s infinite}
@keyframes poSweep{0%{transform:translateX(-130%)}35%,100%{transform:translateX(130%)}}
.po-new{position:absolute;top:12px;left:-34px;transform:rotate(-38deg);padding:4px 40px;font-weight:800;font-size:10px;line-height:1.4;letter-spacing:.2em;color:#1b1203;background:linear-gradient(90deg,#f6cf72,#ffe9a8);box-shadow:0 4px 10px #0008}
.po-chip{display:inline-block;font-weight:800;font-size:10.5px;line-height:1;letter-spacing:.18em;color:#1b1203;background:linear-gradient(90deg,#f6cf72,#ffe9a8);padding:7px 12px;border-radius:99px}
.po-title{margin:14px 0 6px;font:700 clamp(28px,4.6vw,46px)/1.2 "Noto Sans Tamil",var(--disp,Georgia),serif;background:linear-gradient(100deg,#fff 30%,#ffe9a8 60%,#fff);-webkit-background-clip:text;background-clip:text;color:transparent}
.po-by{font-size:14px;color:#cfe9dc}.po-by b{color:#ffe9a8}
.po-tag{margin:14px 0 0;max-width:460px;font-size:14px;line-height:1.7;color:#e6f5ec;font-style:italic}
.po-meta{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 24px}
.po-meta span{padding:6px 12px;border-radius:99px;background:#ffffff14;border:1px solid #ffffff22;font-size:12px;color:#e6f5ec}
.po-read{display:inline-flex;align-items:center;gap:10px;padding:14px 26px;border-radius:99px;cursor:pointer;font-weight:800;font-size:14px;color:#1b1203;background:linear-gradient(90deg,#f6cf72,#ffe9a8);box-shadow:0 12px 28px -10px #f6cf72bb;transition:transform .2s,box-shadow .2s;outline:none}
.po-read:hover,.po-read:focus-visible{transform:translateY(-3px);box-shadow:0 18px 34px -10px #f6cf72dd}
.po-read i{font-style:normal;display:inline-block;animation:poNudge 1.4s ease-in-out infinite}
@keyframes poNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}

/* shelves */
.po-shelf{position:relative;overflow:hidden;border-radius:22px;padding:28px 22px 6px;color:#fff;background:linear-gradient(180deg,#0b2d20,#06140e);border:1px solid #f2c35b44;box-shadow:0 30px 60px -34px #000}
.po-sh-head{position:relative;text-align:center;margin-bottom:6px}
.po-sh-head h3{margin:0;font:700 22px/1.2 var(--disp,Georgia,serif);color:#ffe9a8;letter-spacing:-.01em}
.po-sh-head span{display:block;margin-top:4px;font-size:12px;color:#b9d8c8}
.po-spot{position:absolute;top:-50px;left:50%;width:78%;height:300px;transform:translateX(-50%);pointer-events:none;background:radial-gradient(ellipse at top,#ffe9a838,transparent 70%);animation:poSpot 7s ease-in-out infinite alternate}
@keyframes poSpot{from{opacity:.5;transform:translateX(-56%)}to{opacity:1;transform:translateX(-44%)}}
.po-row{position:relative;display:flex;justify-content:center;align-items:flex-end;gap:30px;padding:100px 10px 0}
.po-plank{position:relative;height:17px;margin:0 -8px 34px;border-radius:4px;background:linear-gradient(180deg,#e4c28f 0,#b78d60 55%,#8a6641 100%);box-shadow:0 14px 22px -10px #000b,inset 0 1px 0 #fff6}
.po-bk{position:relative;flex:none;width:min(150px,28vw);cursor:pointer;perspective:800px;outline:none;animation:poBob 5s ease-in-out infinite;animation-delay:var(--d,0s);-webkit-tap-highlight-color:transparent}
@keyframes poBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.po-bk:hover,.po-bk:focus-visible{z-index:20;animation-play-state:paused}
.po-bk-in{position:relative;overflow:hidden;aspect-ratio:934/1280;border-radius:3px 7px 7px 3px;transform-origin:left center;transition:transform .5s cubic-bezier(.2,.85,.25,1),box-shadow .5s;box-shadow:0 18px 22px -12px #000c,-3px 0 0 #0006}
.po-bk-in img{display:block;width:100%;height:100%;object-fit:cover}
.po-bk-in::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,#0007 0,#fff3 3.5%,#0000 9%)}
.po-bk-in::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(115deg,transparent 38%,#ffffff40 50%,transparent 62%);transform:translateX(-130%);animation:poSweep 6s ease-in-out 2s infinite}
.po-bk:hover .po-bk-in,.po-bk:focus-visible .po-bk-in{transform:translateY(-16px) rotateY(-18deg) scale(1.05);box-shadow:0 30px 34px -14px #000d,0 0 44px -6px #f6cf72aa}
.po-ribbon{position:absolute;top:8px;right:-4px;z-index:2;padding:4px 9px 4px 11px;font-weight:800;font-size:8.5px;line-height:1;letter-spacing:.16em;color:#1b1203;background:linear-gradient(90deg,#f6cf72,#ffe9a8);border-radius:3px 0 0 3px;box-shadow:0 3px 8px #0008}
.po-tip{position:absolute;left:50%;bottom:calc(100% + 26px);transform:translate(-50%,8px);opacity:0;pointer-events:none;transition:opacity .3s .1s,transform .3s .1s;white-space:nowrap;display:flex;flex-direction:column;gap:2px;text-align:center;padding:9px 14px;border-radius:12px;color:#fff;background:#0a1f16f2;border:1px solid #f2c35b66;box-shadow:0 14px 28px -12px #000}
.po-tip b{font-size:14px;color:#ffe9a8}.po-tip span{font-size:12px;color:#c4e0d1}.po-tip em{font-size:11px;font-style:normal;font-weight:700;color:#f6cf72}
.po-bk:hover .po-tip,.po-bk:focus-visible .po-tip{opacity:1;transform:translate(-50%,0)}
.po-soon{cursor:default;animation:none}
.po-soon .po-bk-in{display:grid;place-items:center;text-align:center;box-shadow:none;background:repeating-linear-gradient(45deg,#ffffff0a 0 8px,#ffffff03 8px 16px);border:2px dashed #f6cf7266;border-radius:7px;animation:poSoon 3.4s ease-in-out infinite;animation-delay:var(--d,0s)}
.po-soon .po-bk-in::before,.po-soon .po-bk-in::after{display:none}
.po-soon div div{padding:10px;color:#f6cf72;font-size:11px;letter-spacing:.14em;line-height:1.6}
.po-soon div div b{display:block;font-size:22px;margin-bottom:6px;animation:poTwinkle 2.2s ease-in-out infinite}
@keyframes poSoon{0%,100%{border-color:#f6cf7255;box-shadow:0 0 0 0 #f6cf7200}50%{border-color:#f6cf72cc;box-shadow:0 0 26px -4px #f6cf7255}}

/* reader */
.po-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;position:sticky;top:calc(var(--th,60px) + 4px);z-index:6}
.po-bar img{width:34px;height:46px;object-fit:cover;border-radius:3px;box-shadow:0 0 0 1.5px #e0a22a;flex:none}
.po-tt{display:flex;flex-direction:column;min-width:0;flex:1}.po-bar select{max-width:260px;width:auto}
.po-paper{max-width:680px;margin:14px auto 40px;background:#fff;color:#111;border:1px solid var(--bd);border-radius:6px;box-shadow:var(--sh);padding:44px 54px 56px;font:14px/1.75 "Courier Prime","Courier New","Noto Sans Tamil",monospace;animation:poPaper .6s both}
@keyframes poPaper{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
.po-ptitle{text-align:center;font-weight:700;font-size:24px;line-height:1.4;margin:60px 0 24px}
.po-pby{text-align:center;margin-bottom:12px}.po-pmeta{text-align:center;color:#777;font-size:12px;margin-bottom:70px}
.po-scene{font-weight:700;text-transform:uppercase;margin-top:22px;scroll-margin-top:calc(var(--th,60px) + 70px)}
.po-action{margin-top:10px}.po-char{margin:14px 0 0 37%;text-transform:uppercase}.po-paren{margin-left:27%;margin-right:25%}.po-dial{margin:0 14% 0 18%}.po-trans{text-align:right;text-transform:uppercase;margin-top:14px}
.po-end{text-align:center;margin-top:48px;color:#777}

@media(max-width:700px){
 .po-hero{padding:48px 18px 40px}.po-feat{padding:22px 18px}.po-feat-in{grid-template-columns:1fr;gap:26px;text-align:center}
 .po-poster{max-width:230px}.po-tag{margin-left:auto;margin-right:auto}.po-meta{justify-content:center}
 .po-shelf{padding:24px 12px 4px}.po-row{gap:20px 14px;padding-top:30px;flex-wrap:wrap}.po-bk{width:min(150px,38vw)}.po-tip{display:none}
 .po-paper{padding:26px 18px 36px;font-size:12.5px}.po-char{margin-left:30%}.po-dial{margin:0 4% 0 10%}.po-paren{margin-left:20%;margin-right:10%}
 .po-bar{align-items:stretch}.po-bar select{max-width:none;width:100%}
}
@media(prefers-reduced-motion:reduce){.po *,.po,.tabs button[data-i="originals"],.tabs button[data-i="originals"]::before{animation:none!important}.po-face,.po-bk-in{transition:none}}
`;
  document.head.appendChild(st);
 }

 /* ---------- helpers ---------- */
 const key='onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();this.click()}"';
 const per=()=>innerWidth<600?2:4;
 const sceneCount=b=>b.blocks.filter(x=>x[0]==='scene').length;
 const metaLine=b=>[b.genre,b.lang,b.runtime,sceneCount(b)+' scene'+(sceneCount(b)===1?'':'s')].filter(Boolean);

 /* ---------- showcase ---------- */
 function showcase(){
  const n=PINES_ORIG.length,fi=n-1,f=PINES_ORIG[fi],
        langs=[...new Set(PINES_ORIG.map(b=>b.lang).filter(Boolean))];
  const embers=Array.from({length:16},(_,i)=>`<span class="po-ember" style="--l:${(i*37+8)%96}%;--s:${3+(i%3)*2}px;--t:${7+(i%5)*1.6}s;--d:${-(i*0.9)}s;--x:${(i%2?1:-1)*(14+(i%4)*12)}px"></span>`).join('');
  const hero=`<section class="po-hero"><div class="po-aurora"><i></i><i></i><i></i></div><div class="po-film t"></div><div class="po-film b"></div>${embers}
   <span class="po-kick">✦ PINES STUDIOS PRESENTS</span>
   <h2 class="po-h">Pines <em>Originals</em></h2>
   <p class="po-sub">Screenplays written and published by Pines Studios. Original stories, made to be read here first.</p>
   <div class="po-stats"><span><b>${n}</b>original${n===1?'':'s'}</span>${langs.length?`<span><b>${esc(langs.join(' · '))}</b>${langs.length===1?'language':'languages'}</span>`:''}<span><b>New</b>stories on the way</span></div></section>`;
  const feat=f?`<section class="po-feat" style="--cv:url('${esc(f.cover)}')"><div class="po-feat-bg"></div><div class="po-feat-in">
   <div class="po-poster" role="button" tabindex="0" data-a="poopen" data-i="${fi}" aria-label="Read ${esc(f.title)}" ${key}><span class="po-glow"></span><div class="po-face"><img src="${esc(f.cover)}" alt="${esc(f.title)} poster" draggable="false"><span class="po-shine"></span><span class="po-new">NEW</span></div></div>
   <div><span class="po-chip">✦ FEATURED ORIGINAL</span><h3 class="po-title">${esc(f.title)}</h3><div class="po-by">Written by <b>${esc(f.writer)}</b></div>${f.tagline?`<p class="po-tag">${esc(f.tagline)}</p>`:''}
   <div class="po-meta">${metaLine(f).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
   <div class="po-read" role="button" tabindex="0" data-a="poopen" data-i="${fi}" ${key}>Read screenplay <i>→</i></div></div></div></section>`:'';
  /* shelves: originals first, then "coming soon" slots that fill the last row */
  const P=per(),fill=n%P?P-(n%P):0,
        items=PINES_ORIG.map((b,i)=>({b,i})).concat(Array.from({length:fill},(_,k)=>({soon:k?'COMING SOON':'NEXT ORIGINAL'})));
  let rows='';
  for(let r=0;r<items.length;r+=P){
   rows+=`<div class="po-row">${items.slice(r,r+P).map((it,k)=>{
    const d=`--d:${(-k*0.8).toFixed(1)}s`;
    if(it.soon)return `<div class="po-bk po-soon" style="${d}" aria-hidden="true"><div class="po-bk-in"><div><b>✦</b>${it.soon}</div></div></div>`;
    const b=it.b;
    return `<div class="po-bk" role="button" tabindex="0" data-a="poopen" data-i="${it.i}" style="${d}" aria-label="Read ${esc(b.title)}" ${key}><div class="po-bk-in"><img src="${esc(b.cover)}" alt="${esc(b.title)} cover" draggable="false"><span class="po-ribbon">ORIGINAL</span></div><div class="po-tip"><b>${esc(b.title)}</b><span>${esc(b.writer)} · ${esc(metaLine(b).slice(0,3).join(' · '))}</span><em>Click to read</em></div></div>`}).join('')}</div><div class="po-plank"></div>`;
  }
  const shelf=`<section class="po-shelf"><div class="po-spot"></div><div class="po-sh-head"><h3>The Pines Shelf</h3><span>Only screenplays created by Pines Studios live here. Hover a book, then click to read.</span></div>${rows}</section>`;
  return `<div class="po">${hero}${feat}${shelf}</div>`;
 }

 /* ---------- reader ---------- */
 function reader(b){
  let n=0,jump='';
  const body=b.blocks.map(([t,x])=>{
   if(t==='scene'){n++;jump+=`<option value="${n}">${esc(x)}</option>`;return `<div class="po-scene" id="po-s${n}">${esc(x)}</div>`}
   return `<div class="po-${t}">${esc(x)}</div>`}).join('');
  return `<div class="card sec po-bar"><button data-a="libshelf">${I('back',15)}Pines Original</button><img src="${esc(b.cover)}" alt=""><div class="po-tt"><b>${esc(b.title)}</b><span class="mut">Written by ${esc(b.writer)} · ${esc(metaLine(b).join(' · '))}</span></div>${n>1?`<select onchange="var e=document.getElementById('po-s'+this.value);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})" aria-label="Jump to scene"><option value="">Jump to scene…</option>${jump}</select>`:''}</div>
  <div class="po-paper"><div class="po-ptitle">${esc(b.title)}</div><div class="po-pby">Written by<br>${esc(b.writer)}</div><div class="po-pmeta">${[b.version?'Version '+b.version:'',b.date,b.genre].filter(Boolean).map(esc).join(' · ')}<br>A Pines Studios Original</div>${body}<div class="po-end">— End of screenplay —</div></div>`;
 }

 /* ---------- entry point used by the Library tab ---------- */
 window.poBody=function(){
  if(typeof libOpen==='number'&&libOpen>=0&&PINES_ORIG[libOpen])return reader(PINES_ORIG[libOpen]);
  libOpen=-1;return showcase();
 };

 /* ---------- open action + poster tilt (works wherever this file is loaded) ---------- */
 document.addEventListener('click',e=>{
  const b=e.target&&e.target.closest&&e.target.closest('[data-a="poopen"]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();
  libOpen=+b.dataset.i;lib();scrollTo(0,0);
 },true);
 document.addEventListener('pointermove',e=>{
  const p=e.target&&e.target.closest&&e.target.closest('.po-poster');if(!p)return;
  const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  p.style.setProperty('--ry',(x*16).toFixed(1)+'deg');p.style.setProperty('--rx',(-y*16).toFixed(1)+'deg');
 });
 document.addEventListener('pointerout',e=>{
  const p=e.target&&e.target.closest&&e.target.closest('.po-poster');
  if(p&&!p.contains(e.relatedTarget)){p.style.setProperty('--rx','0deg');p.style.setProperty('--ry','0deg')}
 });
})();
