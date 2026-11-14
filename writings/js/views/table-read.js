/* ============================================================
   Pines · views/table-read.js
   Table read: voices, background music, reader (sidebar: Table read)
   ============================================================ */
const ic=(k,p)=>{if(!P[k])P[k]=p};
ic('mic','<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8"/>');
ic('play','<path d="M7 4l13 8-13 8z"/>');
ic('pause','<path d="M8 5v14M16 5v14"/>');
ic('stop','<rect x="6" y="6" width="12" height="12" rx="1.5"/>');
ic('palette','<path d="M12 3a9 9 0 100 18c1.4 0 2-1 1.6-2.1-.4-1.1.3-2.4 1.6-2.4H17a4 4 0 004-4c0-5-4-9.5-9-9.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>');
ic('image','<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.7"/><path d="M21 16l-5-5L5 21"/>');

ic('music','<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>');
ic('next','<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>');
ic('prev','<path d="M19 4L9 12l10 8z"/><path d="M5 5v14"/>');
/* ================= TABLE READ ================= */
const RD={i:0,items:[],sid:[],cast:[],ta:false,cm:null,playing:false,paused:false,gen:0,slot:{},u:null};
const NARR='~narr';
const rdOK=()=>'speechSynthesis' in window;
const rdVoices=()=>rdOK()?speechSynthesis.getVoices():[];
const rdVL=v=>String(v.lang||'').replace('_','-').slice(0,2).toLowerCase();
const rdLang=t=>/[\u0B80-\u0BFF]/.test(t)?'ta':/[\u0D00-\u0D7F]/.test(t)?'ml':/[\u0900-\u097F]/.test(t)?'hi':'en';
const RDF_RE=/(^|[^a-z])(female|woman|girl)($|[^a-z])|zira|heera|hazel|susan|samantha|neerja|swara|kalpana|pallavi|veena|lekha|tessa|karen|moira|fiona|priya|aditi|raveena|shruti|aarti|ananya|kajal|sangeeta|kanika|vani|yamini|sapna|sobhana|aria|jenny|sonia|libby|natasha|clara|amy|joanna|salli|kendra|kimberly|ivy|nicole|olivia|serena|victoria|nora|laura|paulina|monica|zoe|emma|\bava\b|allison|(^|[^a-z])f\d($|[^a-z])/i;
const RDM_RE=/(^|[^a-z])(male|man|boy)($|[^a-z])|ravi|hemant|prabhat|valluvar|madhur|rishi|david|mark|george|james|daniel|(^|[^a-z])guy($|[^a-z])|ryan|kumar|mohan|sagar|midhun|christopher|eric|roger|brian|davis|tony|jason|andrew|brandon|steffan|thomas|oliver|matthew|liam|(^|[^a-z])m\d($|[^a-z])/i;
const rdGender=v=>{const o=(S.vgo||{})[v.voiceURI];if(o)return o;const n=String(v.name||'')+' '+String(v.voiceURI||'');if(RDF_RE.test(n))return 'F';if(RDM_RE.test(n))return 'M';return ''};
const rdCfg=(s,n)=>{const o=s.tr||{};return n===NARR?(o.narr||{}):((o.cast||{})[n]||{})};
const rdSet=(s,n,patch)=>{s.tr=s.tr||{};if(n===NARR)s.tr.narr=Object.assign(s.tr.narr||{},patch);else{s.tr.cast=s.tr.cast||{};s.tr.cast[n]=Object.assign(s.tr.cast[n]||{},patch)}};
const rdChunks=t=>{const m=String(t).match(/[^.!?\u0964\u2026\n]+[.!?\u0964\u2026]*\s*/g)||[String(t)],o=[];let c='';m.forEach(x=>{if((c+x).length>160&&c){o.push(c);c=x}else c+=x});if(c.trim())o.push(c);return o.map(x=>x.trim()).filter(Boolean)};
const rdHead=x=>/[\u0B80-\u0BFF\u0D00-\u0D7F\u0900-\u097F]/.test(x)?x.replace(/^(INT\.\/EXT\.|INT\.|EXT\.)\s*/i,'').replace(/\s+-\s+/g,'. '):x.replace(/^INT\.\/EXT\./i,'Interior exterior.').replace(/^INT\./i,'Interior.').replace(/^EXT\./i,'Exterior.').replace(/\s+-\s+/g,'. ').replace(/\s+/g,' ');
function rdItems(s){const o=s.tr||{},sc=scenes(s).length,from=Math.max(1,+o.from||1),to=Math.min(sc||1,+o.to||sc||1);let n=0,cc='';const out=[];
 s.blocks.forEach((b,bi)=>{if(b.t=='scene'){n++;cc=''}
  if(n<from||n>to||n<1)return;
  const x=String(b.x||'').trim();
  if(b.t=='char'){cc=x.replace(/\(.*?\)/g,'').trim().toUpperCase();return}
  if(!x)return;
  if(b.t=='scene'){if(o.head!==false)out.push({k:'scene',n,x:rdHead(x),raw:x,bi})}
  else if(b.t=='action'){if(o.act!==false)out.push({k:'action',x,bi})}
  else if(b.t=='dial'){if(cc)out.push({k:'dial',who:cc,x,bi})}
  else if(b.t=='paren'){if(o.par)out.push({k:'paren',x:x.replace(/^\(|\)$/g,''),bi})}
 });return out}
function rdMark(i){document.querySelectorAll('.trl.on').forEach(e=>e.classList.remove('on'));if(i<0)return;const e=document.getElementById('trl'+i);if(e){e.classList.add('on');try{e.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(_){}}}
function rdRefresh(){rdStop();body(cur())}
function rdSel(s,name){const V=rdVoices(),cv=rdCfg(s,name).v||'',g={};V.forEach(v=>{(g[rdVL(v)]=g[rdVL(v)]||[]).push(v)});
 let dn;try{dn=new Intl.DisplayNames(['en'],{type:'language'})}catch(_){}
 const lab=c=>({ta:'Tamil',en:'English',hi:'Hindi',ml:'Malayalam'})[c]||(dn?(()=>{try{return dn.of(c)}catch(_){return c.toUpperCase()}})():c.toUpperCase());
 const order=['ta','en','hi','ml'],keys=Object.keys(g).sort((a,b)=>{const x=order.indexOf(a),y=order.indexOf(b);return (x<0?9:x)-(y<0?9:y)||a.localeCompare(b)});
 return `<select data-rv="${esc(name)}" aria-label="Voice"><option value="">Auto (best match for each line)</option>${keys.map(k=>`<optgroup label="${esc(lab(k))}">${g[k].map(v=>`<option value="${esc(v.voiceURI)}" ${v.voiceURI===cv?'selected':''}>${esc(v.name)}${rdGender(v)=='M'?' · male':rdGender(v)=='F'?' · female':''}${v.localService?'':' · online'}</option>`).join('')}</optgroup>`).join('')}</select>`}
/* ---- Voice bank: 5 Tamil male, 5 Tamil female, 5 English (India) male, 5 English (India) female ----
   [id, name, lang, gender, description, pitch, depth(0-100), pace, expression(0-100)] */
const VP=[
['tm1','Arjun','ta','M','Warm baritone',.85,65,.98,30],
['tm2','Karthik','ta','M','Young & bright',1,35,1.05,40],
['tm3','Selvam','ta','M','Deep elder',.68,90,.9,25],
['tm4','Vetri','ta','M','Energetic hero',.92,50,1.1,50],
['tm5','Murugan','ta','M','Rustic villager',.78,75,.95,35],
['tf1','Meena','ta','F','Soft & gentle',1.15,30,.98,40],
['tf2','Kavya','ta','F','Bright & young',1.3,15,1.08,50],
['tf3','Anitha','ta','F','Calm & mature',1,55,.95,30],
['tf4','Thenmozhi','ta','F','Rich storyteller',1.1,45,.92,45],
['tf5','Priya','ta','F','Sweet & clear',1.25,20,1.03,40],
['em1','Rahul','en','M','Friendly host',.95,45,1,35],
['em2','Vikram','en','M','Deep narrator',.72,88,.92,30],
['em3','Aditya','en','M','Youthful',1.08,25,1.07,45],
['em4','Sanjay','en','M','Authoritative',.8,78,.96,25],
['em5','Rohan','en','M','Casual & easy',1,40,1.05,40],
['ef1','Ananya','en','F','Podcast host',1.1,35,.98,40],
['ef2','Divya','en','F','Warm narrator',1,55,.93,35],
['ef3','Neha','en','F','Bright & quick',1.25,18,1.1,50],
['ef4','Sneha','en','F','Gentle & soft',1.18,30,.95,40],
['ef5','Ishita','en','F','Confident',1.05,50,1,35]];
const VG=[['ta','M','Tamil · Male'],['ta','F','Tamil · Female'],['en','M','English (India) · Male'],['en','F','English (India) · Female']];
const rdP=id=>VP.find(x=>x[0]===id);
const rdClamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function rdAuto(s,n){const ta=RD.ta;
 if(n===NARR)return ta?'tm3':'ef1';
 const arr=ta?['tm1','tf1','tm2','tf2','tm4','tf3','tm5','tf4','tm3','tf5']:['em1','ef2','em2','ef3','em3','ef4','em4','ef5','em5','ef1'];
 const p=(s.cp||{})[n]||{},age=parseInt(p.age),sl=RD.slot[n]||1,g=arr[(sl-1)%arr.length][1];
 if(age>0&&age<13)return ta?'tf2':'ef3';
 if(age>=60)return ta?(g==='m'?'tm3':'tf3'):(g==='m'?'em4':'ef2');
 return arr[(sl-1)%arr.length]}
function rdEffP(p){return{p:p[5],d:p[6],r:p[7],e:p[8],vol:1,g:p[3],pre:p,force:1}}
function rdEff(s,n){const c=rdCfg(s,n),p=(c.pr&&rdP(c.pr))||rdP(rdAuto(s,n));
 return{p:c.p!=null?c.p:p[5],d:c.d!=null?c.d:p[6],r:c.r!=null?c.r:p[7],e:c.e!=null?c.e:p[8],vol:c.vol!=null?c.vol:1,g:p[3],pre:p}}

/* ================= BACKGROUND MUSIC ENGINE (Web Audio, no files needed) ================= */
const CH={m:[0,3,7],M:[0,4,7],m7:[0,3,7,10],M7:[0,4,7,11],sus:[0,5,7]};
const BGS=[
{id:'lofi',n:'Chill Lo-fi · podcast',bpm:78,root:57,prog:[[0,'m7'],[8,'M7'],[3,'M7'],[10,'M']],pad:{w:'triangle',g:.05,a:.9},bass:{g:.15},arp:{pat:[0,-1,2,-1,3,-1,2,1],w:'triangle',g:.075,len:2,sus:.02},dr:{k:[1,0,0,0,0,1,0,0],s:[0,0,1,0,0,0,1,0],h:[1,1,1,1,1,1,1,1],kv:.5,sv:.1,hv:.025},sw:.22,lp:2600},
{id:'piano',n:'Soft Piano',bpm:66,root:60,prog:[[0,'M7'],[9,'m7'],[5,'M7'],[7,'sus']],pad:{w:'sine',g:.04,a:1.6},bass:{g:.1},arp:{pat:[0,-1,1,-1,2,-1,3,2],w:'triangle',g:.11,len:3,sus:.01,r:.5},lp:3800},
{id:'ambient',n:'Warm Ambient Pad',bpm:56,root:50,prog:[[0,'m7'],[7,'sus'],[3,'M7'],[5,'M']],pad:{w:'sawtooth',g:.035,a:2.4,det:[-9,0,9]},arp:{pat:[0,-1,-1,-1,2,-1,-1,-1],w:'sine',g:.05,oct:1,len:4,sus:.01,r:1},lp:1500},
{id:'romantic',n:'Romantic Strings',bpm:70,root:55,prog:[[0,'M'],[4,'m'],[5,'M'],[7,'M']],pad:{w:'sawtooth',g:.05,a:1.1,det:[-6,6]},bass:{g:.12},arp:{pat:[0,1,2,1,3,2,1,2],w:'triangle',g:.06,oct:1,len:2,sus:.02},lp:2200},
{id:'hopeful',n:'Hopeful Morning',bpm:90,root:60,prog:[[0,'M'],[7,'M'],[9,'m'],[5,'M']],pad:{w:'triangle',g:.05,a:.8},bass:{g:.13},arp:{pat:[0,2,1,2,0,2,3,2],w:'triangle',g:.075,oct:1,len:1.5,sus:.02},dr:{k:[1,0,0,0,1,0,0,0],s:[0,0,1,0,0,0,1,0],h:[0,0,1,0,0,0,1,0],kv:.35,sv:.07,hv:.02},lp:3400},
{id:'tense',n:'Tense Suspense',bpm:92,root:45,prog:[[0,'m'],[0,'m'],[1,'M'],[0,'m']],pad:{w:'sawtooth',g:.04,a:.8,det:[-12,0,12]},bass:{g:.2,pulse:1},dr:{k:[0,0,0,0,0,0,0,0],s:[0,0,0,0,0,0,0,0],h:[1,0,1,0,1,0,1,0],kv:0,sv:0,hv:.03},lp:1100},
{id:'mystery',n:'Dark Mystery',bpm:64,root:52,prog:[[0,'m'],[8,'M'],[3,'M'],[7,'m']],pad:{w:'sine',g:.05,a:2,det:[-15,15]},arp:{pat:[0,-1,-1,2,-1,-1,3,-1],w:'sine',g:.06,oct:2,len:4,sus:.004,r:1.4},lp:1800},
{id:'indian',n:'Indian Classical Calm',bpm:72,root:50,prog:[[0,'sus']],pad:{w:'sine',g:.022,a:2},drone:1,flute:{p:.7,sc:[0,2,4,7,9]},lp:3500},
{id:'folk',n:'Village Folk',bpm:98,root:55,prog:[[0,'M'],[0,'M'],[5,'M'],[7,'M']],pad:{w:'triangle',g:.03,a:.5},bass:{g:.12},arp:{pat:[0,-1,1,2,-1,1,0,-1],w:'triangle',g:.09,len:1,sus:.01,r:.2},dr:{k:[1,0,0,0,0,0,1,0],s:[0,0,0,0,0,0,0,0],h:[1,0,1,1,1,0,1,1],kv:.4,sv:0,hv:.03},lp:3500},
{id:'playful',n:'Light & Playful',bpm:108,root:62,prog:[[0,'M'],[5,'M'],[7,'M'],[0,'M']],pad:{w:'triangle',g:.04,a:.4},bass:{g:.12},arp:{pat:[0,2,1,3,0,2,1,3],w:'triangle',g:.07,oct:1,len:1,sus:.01,r:.15},dr:{k:[1,0,0,0,1,0,0,0],s:[0,0,1,0,0,0,1,0],h:[1,1,1,1,1,1,1,1],kv:.35,sv:.08,hv:.02},lp:4200}];
/* scene mood -> music style (Director's notes mood first, then words found in the scene) */
const MM=[[/tense|chaotic|gritty/,'tense'],[/eerie/,'mystery'],[/romantic|intimate/,'romantic'],[/joyful/,'playful'],[/melancholic/,'piano'],[/dreamy/,'ambient'],[/nostalgic/,'folk'],[/hopeful/,'hopeful'],[/warm/,'lofi']];
const KW=[
[/kill|gun|blood|chase|fight|knife|police|scream|murder|bomb|attack|danger|சண்டை|கொலை|துப்பாக்கி|இரத்த|ஆபத்து/,'tense'],
[/ghost|grave|haunt|fog|mystery|secret|shadow|dark|பேய்|மர்மம்|ரகசிய/,'mystery'],
[/love|kiss|wedding|bride|groom|romance|hug|proposal|காதல்|திருமண|முத்த/,'romantic'],
[/laugh|party|joke|dance|celebrat|festival|comedy|சிரி|கொண்டாட்ட|திருவிழா/,'playful'],
[/temple|prayer|puja|ritual|river|kolam|devotion|கோவில்|கோயில்|பூஜை|ஆறு/,'indian'],
[/village|farm|field|bullock|market|tea stall|கிராம|வயல்|சந்தை|தெரு/,'folk'],
[/cry|funeral|death|goodbye|tears|hospital|miss you|loss|அழு|மரண|பிரிவு|மருத்துவமனை/,'piano'],
[/sunrise|morning|hope|new beginning|school|college|dream|விடியல்|காலை|கனவு/,'hopeful']];
function rdMood(s,sid){if(!sid)return'lofi';const d=(s.dn||{})[sid];
 if(d&&d.mood){const m=String(d.mood).toLowerCase();for(const [re,id] of MM)if(re.test(m))return id}
 let t='',on=false;for(const b of s.blocks){if(b.t=='scene'){if(on)break;on=b.sid===sid}if(on)t+=' '+(b.x||'')}
 t=t.toLowerCase();for(const [re,id] of KW)if(re.test(t))return id;
 return /night|இரவு/.test(t)?'ambient':'lofi'}

const BG={c:null,out:null,duck:null,bus:null,sg:null,sty:null,cur:null,on:false,step:0,t:0,bpm:78,ovr:0,vol:.55,da:.6,tm:null,rel:0,fi:4,noise:null};
const mf=m=>440*Math.pow(2,(m-69)/12);
function bgInit(){if(BG.c)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
 const c=BG.c=new AC();
 BG.out=c.createGain();BG.out.gain.value=BG.vol;BG.out.connect(c.destination);
 BG.duck=c.createGain();BG.duck.connect(BG.out);
 BG.bus=c.createBiquadFilter();BG.bus.type='lowpass';BG.bus.frequency.value=3000;
 const dry=c.createGain();dry.gain.value=.8;BG.bus.connect(dry);dry.connect(BG.duck);
 const len=Math.floor(c.sampleRate*2.2),buf=c.createBuffer(2,len,c.sampleRate);
 for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
 const cv=c.createConvolver();cv.buffer=buf;const wet=c.createGain();wet.gain.value=.38;BG.bus.connect(cv);cv.connect(wet);wet.connect(BG.duck);
 const nb=c.createBuffer(1,c.sampleRate,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;BG.noise=nb;
 return true}
function bgTone(t,m,dur,o){const c=BG.c,g=c.createGain(),f=mf(m),det=o.det||[0],pk=(o.g||.08)/det.length,a=o.a||.01,r=o.r||.3;
 det.forEach(dt=>{const os=c.createOscillator();os.type=o.w||'sine';os.frequency.value=f;os.detune.value=dt;os.connect(g);os.start(t);os.stop(t+dur+r+.1);
  if(o.vib){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.2;lg.gain.value=14;l.connect(lg);lg.connect(os.detune);l.start(t);l.stop(t+dur+r+.1)}});
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+a);
 if(o.dec){g.gain.exponentialRampToValueAtTime(Math.max(.0001,pk*(o.sus||.02)),t+Math.max(a+.02,dur))}else g.gain.setValueAtTime(pk,t+Math.max(a,dur));
 g.gain.linearRampToValueAtTime(0,t+Math.max(a+.03,dur)+r);g.connect(BG.sg)}
function bgKick(t,v){const c=BG.c,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.26);o.connect(g);g.connect(BG.sg);o.start(t);o.stop(t+.3)}
function bgNoise(t,dur,v,hp){const c=BG.c,s=c.createBufferSource();s.buffer=BG.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(BG.sg);s.start(t);s.stop(t+dur+.02)}
function bgStep(S,i,t,sd){const bar=Math.floor(i/8),st=i%8,ch=S.prog[bar%S.prog.length],tones=CH[ch[1]].map(x=>S.root+ch[0]+x),root=S.root+ch[0];
 if(st===0&&S.pad)tones.slice(0,4).forEach(n=>bgTone(t,n+12,sd*8,{w:S.pad.w,g:S.pad.g,a:S.pad.a||1,r:1.6,det:S.pad.det||[-7,0,7]}));
 if(S.bass&&(st===0||(S.bass.pulse?st%2===0:st===4)))bgTone(t,root-12,sd*(S.bass.pulse?1.2:3),{w:'sine',g:S.bass.g,a:.02,r:.3,dec:1,sus:.25});
 if(S.arp){const k=S.arp.pat[st];if(k>=0)bgTone(t,tones[k%tones.length]+12*(S.arp.oct||0)+(k>=tones.length?12:0),sd*(S.arp.len||2),{w:S.arp.w,g:S.arp.g,a:.006,r:S.arp.r||.3,dec:1,sus:S.arp.sus||.02})}
 if(S.dr){if(S.dr.k[st]&&S.dr.kv)bgKick(t,S.dr.kv);if(S.dr.s[st]&&S.dr.sv)bgNoise(t,.16,S.dr.sv,1400);if(S.dr.h[st]&&S.dr.hv)bgNoise(t,.04,S.dr.hv,7000)}
 if(S.drone&&st%2===0)bgTone(t,S.root+[-5,0,0,-12][st/2],sd*5,{w:'triangle',g:.06,a:.01,r:1.5,dec:1,sus:.08});
 if(S.flute&&st%4===0&&Math.random()<S.flute.p){BG.fi=rdClamp((BG.fi||4)+Math.floor(Math.random()*5)-2,0,9);const sc=S.flute.sc,n=S.root+12+sc[BG.fi%5]+12*Math.floor(BG.fi/5);bgTone(t,n,sd*(2+Math.floor(Math.random()*3)),{w:'sine',g:.07,a:.14,r:.6,vib:1})}}
function bgTick(){if(!BG.on||!BG.c)return;const S=BG.sty,sd=60/BG.bpm/2;
 while(BG.t<BG.c.currentTime+.4){const sw=(S.sw&&BG.step%2===1)?sd*S.sw:0;bgStep(S,BG.step,BG.t+sw,sd);BG.t+=sd;BG.step++}}
function bgPlay(id){if(!bgInit())return false;const S=BGS.find(x=>x.id===id);if(!S)return false;
 const c=BG.c,now=c.currentTime;c.resume&&c.resume();
 if(BG.on&&BG.cur===id)return true;
 if(BG.sg){const old=BG.sg;old.gain.cancelScheduledValues(now);old.gain.setValueAtTime(old.gain.value,now);old.gain.linearRampToValueAtTime(0,now+2);setTimeout(()=>{try{old.disconnect()}catch(_){}},2600)}
 const sg=c.createGain();sg.gain.setValueAtTime(0,now);sg.gain.linearRampToValueAtTime(1,now+2.2);sg.connect(BG.bus);BG.sg=sg;
 BG.bus.frequency.setTargetAtTime(S.lp||3000,now,.4);
 BG.duck.gain.cancelScheduledValues(now);BG.duck.gain.setValueAtTime(1,now);
 BG.out.gain.cancelScheduledValues(now);BG.out.gain.setTargetAtTime(BG.vol,now,.3);
 BG.sty=S;BG.cur=id;BG.step=0;BG.t=now+.08;BG.bpm=BG.ovr||S.bpm;BG.fi=4;BG.on=true;
 clearInterval(BG.tm);BG.tm=setInterval(bgTick,100);bgTick();return true}
function bgStop(){clearInterval(BG.tm);BG.on=false;BG.cur=null;clearTimeout(BG.rel);if(!BG.c||!BG.sg)return;
 const n=BG.c.currentTime,o=BG.sg;BG.sg=null;o.gain.cancelScheduledValues(n);o.gain.setValueAtTime(o.gain.value,n);o.gain.linearRampToValueAtTime(0,n+1.4);setTimeout(()=>{try{o.disconnect()}catch(_){}},1900)}
function bgDuck(on){if(!BG.c||!BG.on)return;clearTimeout(BG.rel);const g=BG.duck.gain;
 if(on){const t=BG.c.currentTime;g.cancelScheduledValues(t);g.setTargetAtTime(1-BG.da,t,.15)}
 else BG.rel=setTimeout(()=>{if(BG.c){const n=BG.c.currentTime;g.cancelScheduledValues(n);g.setTargetAtTime(1,n,.5)}},500)}
function rdMus(s,force){const o=s.tr||{},m=o.mus||'auto';
 if(m==='off'){bgStop();RD.cm=null;rdMusSync();return}
 const sid=RD.sid[RD.i]||RD.sid[0]||null,id=m==='auto'?rdMood(s,sid):m;
 BG.ovr=o.bpm||0;BG.vol=o.mv!=null?o.mv:.55;BG.da=o.duck!=null?o.duck:.6;
 if(!force&&BG.on&&RD.cm===id){return}
 if(bgPlay(id))RD.cm=id;else toast('Audio is not supported in this browser');
 if(BG.on)BG.bpm=BG.ovr||BG.sty.bpm;rdMusSync()}
function rdMusSync(){const s=cur(),e=$('#rdmusnow'),b=$('#rdmusb'),S=BG.on&&BG.sty;
 if(e)e.textContent=S?`♪ ${S.n} · ${Math.round(BG.bpm)} BPM`:'♪ Music is off right now';
 if(b)b.innerHTML=BG.on?I('stop',14):I('play',14);
 const r=$('#rdbpm'),sl=document.querySelector('[data-rm=bpm]');
 if(S&&s&&!(s.tr||{}).bpm){if(r)r.textContent=Math.round(BG.bpm)+' BPM';if(sl)sl.value=BG.bpm}}

/* ================= SPEECH ================= */
function rdVoice(s,name,text,E){const V=rdVoices();if(!V.length)return null;const L=rdLang(text),cfg=rdCfg(s,name),as=!E.force&&V.find(v=>v.voiceURI===cfg.v);
 if(as&&rdVL(as)===L)return as;
 const all=V.filter(v=>rdVL(v)===L);let pool=all;
 if(L==='en'){const ind=all.filter(v=>/en[-_]IN/i.test(v.lang));if(ind.length)pool=ind}
 let gp=pool.filter(v=>rdGender(v)===E.g);if(!gp.length&&pool!==all)gp=all.filter(v=>rdGender(v)===E.g);
 if(gp.length)pool=gp;else{const un=pool.filter(v=>!rdGender(v));if(un.length)pool=un}
 pool.sort((x,y)=>x.name.localeCompare(y.name));
 const k=(+String(E.pre[0]).slice(-1)||1)-1;
 return pool.length?pool[k%pool.length]:(as||null)}
function rdSay(s,who,text,done,force){const o=s.tr||{},nm=who||NARR,L=rdLang(text),E=force?rdEffP(force):rdEff(s,nm),u=new SpeechSynthesisUtterance(text),v=rdVoice(s,nm,text,E);
 if(v){u.voice=v;u.lang=v.lang}else if(L!=='en')u.lang=({ta:'ta-IN',ml:'ml-IN',hi:'hi-IN'})[L];
 const dp=(E.d-50)/100,ex=E.e/100;let pit=E.p*(1-dp*.5),rt=(o.rate||1)*E.r*(1-dp*.12);
 const vg=v?rdGender(v):'';if(E.g){if(vg&&vg!==E.g)pit*=E.g==='M'?.72:1.38;else if(!vg){if(E.g==='F')pit=Math.max(pit,1.18);else pit=Math.min(pit,.88)}}
 if(/\?\s*$/.test(text))pit*=1+.07*ex;
 if(/!\s*$/.test(text)){rt*=1+.05*ex;pit*=1+.04*ex}
 pit*=1+(Math.random()-.5)*.12*ex;
 u.pitch=rdClamp(pit,.1,2);u.rate=rdClamp(rt,.3,2);u.volume=rdClamp(E.vol,0,1);
 u.onstart=()=>bgDuck(true);
 u.onend=()=>{bgDuck(false);if(done)done()};
 u.onerror=e=>{bgDuck(false);if(done)done(e&&e.error||'error')};
 RD.u=u;speechSynthesis.speak(u);return u}
function rdSync(){const b=$('#rdplay');if(b)b.innerHTML=RD.playing?`${I('pause',18)}<span>Pause</span>`:`${I('play',18)}<span>${RD.paused?'Resume':'Play'}</span>`;
 const p=$('#rdpos');if(p)p.textContent=RD.items.length?`Line ${Math.min(RD.i+1,RD.items.length)} of ${RD.items.length}`:'No lines to read';
 const f=$('#rdpf');if(f)f.style.width=(RD.items.length?Math.min(100,RD.i/RD.items.length*100):0)+'%';
 const q=$('#rdeq');if(q)q.classList.toggle('on',!!RD.playing)}
function rdNow(it){const e=$('#rdnow');if(!e)return;const w=it.k=='dial'?it.who:it.k=='scene'?'Scene':'Narrator';e.innerHTML=`<span class="trw">${esc(w)}</span><span class="x-nt">${esc(it.k=='scene'?it.raw:it.x)}</span>`}
function rdStop(){RD.playing=false;RD.paused=false;RD.gen++;RD.i=0;RD.cm=null;try{if(rdOK())speechSynthesis.cancel()}catch(_){}bgStop();rdSync();rdMark(-1);rdMusSync();
 const n=$('#rdnow');if(n)n.innerHTML='<span class="mut">Press Play to begin the table read.</span>'}
function rdGap(s,it,nx){const o=s.tr||{},pod=o.pod!==false;let b=pod?({scene:1100,action:520,dial:340,paren:160})[it.k]||300:90;
 if(pod){if(it.k==='dial'&&nx&&nx.k==='dial'&&nx.who!==it.who)b+=120;if(nx&&nx.k==='scene')b+=500}
 const f=rdClamp(80/(BG.on?BG.bpm:80),.7,1.4);return Math.round(b*f/Math.max(.6,o.rate||1))}
function rdDone(s){RD.playing=false;RD.paused=false;RD.i=0;rdSync();rdMark(-1);toast('Table read finished');
 if((s.tr||{}).pod!==false)setTimeout(()=>{if(!RD.playing){bgStop();rdMusSync()}},2800);else{bgStop();rdMusSync()}}
function rdSpeak(){if(!RD.playing)return;const s=cur();if(!s)return;const it=RD.items[RD.i];
 if(!it){rdDone(s);return}
 const gen=++RD.gen,ch=rdChunks(it.x);let k=0;rdMark(RD.i);rdSync();rdNow(it);rdMus(s);
 const nxt=err=>{if(gen!==RD.gen)return;
  if(err){if(/interrupted|cancell?ed/i.test(err))return;rdStop();toast('Speech stopped: '+err);return}
  if(k>=ch.length){RD.i++;const g=rdGap(s,it,RD.items[RD.i]);if(g>0)setTimeout(()=>{if(gen===RD.gen&&RD.playing)rdSpeak()},g);else rdSpeak();return}
  rdSay(s,it.k=='dial'?it.who:null,ch[k++],nxt)};
 nxt()}
function rdBegin(){const s=cur();if(!s)return;const o=s.tr||{};RD.playing=true;RD.paused=false;RD.gen++;
 try{speechSynthesis.cancel()}catch(_){}
 if(BG.c&&BG.c.state==='suspended')BG.c.resume();
 const intro=o.pod!==false&&(o.mus||'auto')!=='off'&&!BG.on&&RD.i===0,g=RD.gen;
 rdSync();rdMus(s);
 setTimeout(()=>{if(g===RD.gen&&RD.playing)rdSpeak()},intro?2600:60)}

const RDF={p:v=>(+v).toFixed(2)+'×',d:v=>Math.round(v)+'%',r:v=>(+v).toFixed(2)+'×',e:v=>Math.round(v)+'%',vol:v=>Math.round(v*100)+'%'};
function rdPSel(k,cur){return `<select data-rpr="${esc(k)}" aria-label="Voice">${VG.map(([l,g,t])=>`<optgroup label="${t}">${VP.filter(x=>x[2]==l&&x[3]==g).map(x=>`<option value="${x[0]}" ${x[0]===cur?'selected':''}>${x[1]} · ${x[4]}</option>`).join('')}</optgroup>`).join('')}</select>`}
const rdSample=k=>{const it=k===NARR?RD.items.find(x=>x.k!='dial'):RD.items.find(x=>x.who===k);return String(it?it.x:(RD.ta?'வணக்கம்':'Hello'))};
function rdDev(s,k){const E=rdEff(s,k),v=rdVoice(s,k,rdSample(k),E),want=E.g==='M'?'male':'female';
 if(!v)return{c:'warn',t:'No matching voice is installed. Your browser’s default voice will be used.',fix:0};
 const g=rdGender(v),nm=esc(v.name),net=v.localService?'':' Some online voices ignore pitch changes.';
 if(g===E.g)return{c:'ok',t:`Playing through ${nm}, a ${want} voice.`,fix:1};
 if(!g)return{c:'warn',t:`Playing through ${nm}. This voice does not report its gender, so pitch is set to sound ${want}.${net}`,fix:1};
 return{c:'warn',t:`${nm} is a ${g==='M'?'male':'female'} voice. Pitch is shifted to sound ${want}. For a natural result, choose another voice under “Use an exact device voice”.`,fix:1}}
function rdCard(s,k){const c=RD.cast.find(x=>x[0]===k);if(!c)return'';const n=c[1],sub=c[2],col=c[3],E=rdEff(s,k),p=E.pre,dv=rdDev(s,k);
 const so=(f,lab,min,max,st,val)=>`<div class="trs"><span>${lab}</span><input type="range" min="${min}" max="${max}" step="${st}" value="${val}" data-rs="${f}" data-k="${esc(k)}" aria-label="${lab}"><output>${RDF[f](val)}</output></div>`;
 return `<div class="trc" data-c="${esc(k)}"><div class="trc-h"><span class="tra" style="background:${col}">${k===NARR?I('mic',16):esc(n.charAt(0))}</span><div class="trc-t"><b>${esc(n)}</b><span class="mut">${esc(sub)}</span></div><span class="x-gen ${p[3]=='M'?'m':'f'}">${p[3]=='M'?'Male':'Female'}</span><button class="ib x-pv" data-a="rdprev" data-i="${esc(k)}" title="Preview voice" aria-label="Preview voice">${I('play',14)}</button></div>
 ${rdPSel(k,p[0])}<div class="trc-tags"><span class="chip">${p[2]=='ta'?'Tamil':'English (India)'}</span><span class="chip">${esc(p[4])}</span></div>
 <div class="x-dev ${dv.c}">${I(dv.c=='ok'?'check':'info',14)}<span>${dv.t}</span></div>${dv.fix?`<div class="x-fix"><span>Does it sound wrong?</span><button data-a="rdvg" data-i="M|${esc(k)}">It sounds male</button><button data-a="rdvg" data-i="F|${esc(k)}">It sounds female</button></div>`:''}
 ${so('p','Pitch',.5,1.6,.01,E.p)}${so('d','Deepness',0,100,1,E.d)}${so('r','Voice pace',.6,1.5,.01,E.r)}${so('e','Expression',0,100,1,E.e)}${so('vol','Volume',.2,1,.05,E.vol)}
 <details class="trc-adv"><summary>Use an exact device voice</summary>${rdSel(s,k)}</details></div>`}
function rdUI(s){
 if(!rdOK())return `<div class="empty">${I('mic',34)}<b>Text-to-speech is not available</b><span>This browser has no speech engine. Try Chrome, Edge or Safari.</span></div>`;
 rdStop();
 const o=s.tr||{},C=chars(s),sc=scenes(s),V=rdVoices();
 RD.slot={};C.forEach((c,i)=>RD.slot[c.n]=i+1);RD.items=rdItems(s);
 RD.sid=RD.items.map(it=>{let r=null;sc.forEach(c=>{if(c.i<=it.bi)r=c.sid});return r});
 const hasTa=s.lang=='Tamil'||s.blocks.some(b=>/[\u0B80-\u0BFF]/.test(b.x)),noTa=V.length>0&&!V.some(v=>rdVL(v)==='ta');
 RD.ta=hasTa;RD.tab=RD.tab||'cast';
 RD.cast=[[NARR,'Narrator','Scene headings & action lines','#6b7f78'],...C.map((c,i)=>[c.n,c.n,`${c.d} line${c.d==1?'':'s'}`,`hsl(${(i*47+150)%360} 55% 45%)`])];
 const note=!V.length?`<div class="tr-note">${I('info',18)}<div><b>Loading voices…</b><br>If nothing appears, your device has no speech voices installed.</div></div>`:(hasTa&&noTa?`<div class="tr-note">${I('info',18)}<div><b>No Tamil voice found on this device.</b><br>Install one to hear Tamil dialogue: on Android, Settings → System → Languages → Text-to-speech → Google; on Windows, Settings → Time &amp; language → Speech → Add voices. Then reload this page.</div></div>`:'');
 const range=(k,d)=>`<label>${k=='from'?'From scene':'To scene'}<select data-rf="${k}">${sc.map(c=>`<option value="${c.n}" ${(+o[k]||d)==c.n?'selected':''}>${c.n}. ${esc(c.h.length>30?c.h.slice(0,30)+'…':c.h)}</option>`).join('')}</select></label>`;
 const col=n=>{const i=C.findIndex(c=>c.n===n);return `hsl(${(i*47+150)%360} 55% 45%)`};
 const rows=RD.items.map((it,i)=>{if(it.k=='scene')return `<div class="trl scene" id="trl${i}" data-a="rdgo" data-i="${i}"><span class="x-sn">${it.n}</span><span>${esc(it.raw)}</span></div>`;
  if(it.k=='dial')return `<div class="trl dial" id="trl${i}" data-a="rdgo" data-i="${i}"><span class="trw" style="color:${col(it.who)}">${esc(it.who)}</span><span class="x-t">${esc(it.x)}</span></div>`;
  return `<div class="trl ${it.k}" id="trl${i}" data-a="rdgo" data-i="${i}">${it.k=='paren'?'('+esc(it.x)+')':esc(it.x)}</div>`}).join('');
 const tg=(k,lab,tip)=>`<label class="x-tg" title="${tip}"><input type="checkbox" data-rk="${k}" ${(k=='par'?!!o.par:o[k]!==false)?'checked':''}><span>${lab}</span></label>`;
 const ms=o.mus||'auto',defBpm=(BGS.find(x=>x.id===ms)||BGS[0]).bpm,bpm=o.bpm||defBpm;
 const mrow=(m,lab,min,max,val,txt)=>`<div class="trs"><span>${lab}</span><input type="range" min="${min}" max="${max}" step="1" value="${val}" data-rm="${m}" aria-label="${lab}"><output ${m=='bpm'?'id="rdbpm"':''}>${txt}</output></div>`;
 const musSel=`<select data-rm="mus" aria-label="Background music"><option value="auto" ${ms=='auto'?'selected':''}>Auto · matches each scene's mood</option><option value="off" ${ms=='off'?'selected':''}>No music</option>${BGS.map(x=>`<option value="${x.id}" ${ms==x.id?'selected':''}>${x.n}</option>`).join('')}</select>`;
 const lib=VG.map(([l,g,t])=>`<div class="vl-h">${t}</div><div class="vl-r">${VP.filter(x=>x[2]==l&&x[3]==g).map(x=>`<button class="vl" data-a="rdlib" data-i="${x[0]}"><b>${I('play',11)} ${x[1]}</b><span>${esc(x[4])}</span></button>`).join('')}</div>`).join('');
 const bars=Array.from({length:26},(_,i)=>`<i style="--d:-${(((i*37)%100)/100*1.1).toFixed(2)}s"></i>`).join('');
 const tab=(k,t)=>`<button class="${RD.tab==k?'on':''}" data-a="rdtab" data-i="${k}" role="tab" aria-selected="${RD.tab==k}">${t}</button>`,pn=k=>`class="x-pn ${RD.tab==k?'on':''}" data-p="${k}"`;
 return `<div id="trx"><div class="x-head"><div><h3>Table read studio</h3><p>Cast a voice for every character, tune it, add background music, and hear your script like a podcast. Tap any line to start from there.</p></div><button data-a="rdreset">${I('refresh',16)}Reset voices</button></div>${note}
 <section class="x-con" aria-label="Playback controls"><div class="x-tr"><button class="x-play" id="rdplay" data-a="rdplay">${I('play',18)}<span>Play</span></button><div class="x-skip"><button data-a="rdpl" title="Previous line" aria-label="Previous line">${I('prev',16)}</button><button data-a="rdnl" title="Next line" aria-label="Next line">${I('next',16)}</button><button data-a="rdstop" title="Stop" aria-label="Stop">${I('stop',16)}</button></div>
  <div class="x-now"><div class="x-eq" id="rdeq">${bars}</div><div class="x-nl" id="rdnow"><span class="mut">Press Play to begin the table read.</span></div></div><span class="x-pos" id="rdpos">${RD.items.length?`Line 1 of ${RD.items.length}`:'No lines to read'}</span></div>
  <div class="x-prog"><i id="rdpf"></i></div>
  <div class="x-set">${range('from',1)}${range('to',sc.length)}<label>Speed <b id="rdsv">${(o.rate||1).toFixed(2)}×</b><input type="range" min=".6" max="1.5" step=".05" data-rg="rate" value="${o.rate||1}" aria-label="Speed"></label></div></section>
 <div class="x-grid"><section class="x-card"><div class="x-sh"><b>Script</b><div class="x-tgs">${tg('head','Scene headings','Spoken by the narrator')}${tg('act','Action lines','Descriptions, spoken by the narrator')}${tg('par','Parentheticals','Such as (whispering)')}</div></div>
  <div class="x-sheet" id="rdscript">${rows||'<p>Nothing to read yet. Write some scenes with dialogue first.</p>'}</div></section>
 <aside class="x-card"><div class="x-tabs" role="tablist">${tab('cast','Cast &amp; voices')}${tab('music','Music')}${tab('lib','Voice library')}</div>
  <div ${pn('cast')}><h4>Cast &amp; voices</h4><p class="x-hint">Pick a voice, then fine-tune pitch, deepness and pace for each character.</p>${RD.cast.map(c=>rdCard(s,c[0])).join('')}</div>
  <div ${pn('music')}><div class="x-mus"><div class="x-mhd"><div><h4>Background music</h4><span class="mut" id="rdmusnow">♪ Music is off right now</span></div><button class="ib x-pv" id="rdmusb" data-a="rdmus" title="Preview music" aria-label="Preview music">${I('play',14)}</button></div>
   ${musSel}${mrow('mv','Music volume',0,100,Math.round((o.mv!=null?o.mv:.55)*100),Math.round((o.mv!=null?o.mv:.55)*100)+'%')}${mrow('bpm','Tempo',50,130,bpm,bpm+' BPM')}${mrow('duck','Voice ducking',0,90,Math.round((o.duck!=null?o.duck:.6)*100),Math.round((o.duck!=null?o.duck:.6)*100)+'%')}
   <div class="x-row"><div><b>Podcast feel</b><span class="mut">Natural pauses, music intro and outro, music dips under voices</span></div><label class="sw"><input type="checkbox" data-rm="pod" ${o.pod!==false?'checked':''}><i></i></label></div>
   <div><button data-a="rdbpmauto">Use each style’s own tempo</button></div></div></div>
  <div ${pn('lib')}><h4>Voice library · 20 voices</h4><p class="x-hint">Tap to audition. Each voice shapes the closest voice installed on your device with its own pitch, deepness and pace.</p>${lib}</div></aside></div></div>`}

/* events */
document.addEventListener('change',e=>{const a=e.target,s=cur();if(!s)return;
 if(a.dataset.rv!==undefined){rdSet(s,a.dataset.rv,{v:a.value});save();return}
 if(a.dataset.rpr!==undefined){const k=a.dataset.rpr;rdSet(s,k,{pr:a.value,p:undefined,d:undefined,r:undefined,e:undefined});save();
  const el=[...document.querySelectorAll('.trc')].find(x=>x.dataset.c===k);if(el)el.outerHTML=rdCard(s,k);setTimeout(()=>A.rdprev(k),60);return}
 if(a.dataset.rf){s.tr=s.tr||{};s.tr[a.dataset.rf]=+a.value;const o=s.tr,n=scenes(s).length;if((+o.from||1)>(+o.to||n)){if(a.dataset.rf=='from')o.to=o.from;else o.from=o.to}save();rdRefresh();return}
 if(a.dataset.rk){s.tr=s.tr||{};s.tr[a.dataset.rk]=a.checked;save();rdRefresh();return}
 if(a.dataset.rm){s.tr=s.tr||{};const m=a.dataset.rm;
  if(m==='mus'){s.tr.mus=a.value;save();RD.cm=null;if(RD.playing||BG.on)rdMus(s,true);else rdMusSync();return}
  if(m==='pod'){s.tr.pod=a.checked;save()}}});
document.addEventListener('input',e=>{const a=e.target,s=cur();if(!s)return;
 if(a.dataset.rs!==undefined){const f=a.dataset.rs;rdSet(s,a.dataset.k,{[f]:+a.value});const out=a.parentNode.querySelector('output');if(out)out.textContent=RDF[f](+a.value);save();return}
 if(a.dataset.rg=='rate'){s.tr=s.tr||{};s.tr.rate=+a.value;const l=$('#rdsv');if(l)l.textContent=(+a.value).toFixed(2)+'×';save();return}
 if(a.dataset.rm&&a.type==='range'){const m=a.dataset.rm,v=+a.value;s.tr=s.tr||{};const out=a.parentNode.querySelector('output');
  if(m==='mv'){s.tr.mv=v/100;BG.vol=v/100;if(BG.c&&BG.on)BG.out.gain.setTargetAtTime(BG.vol,BG.c.currentTime,.1);if(out)out.textContent=v+'%'}
  if(m==='duck'){s.tr.duck=v/100;BG.da=v/100;if(out)out.textContent=v+'%'}
  if(m==='bpm'){s.tr.bpm=v;BG.ovr=v;if(BG.on)BG.bpm=v;if(out)out.textContent=v+' BPM';const n=$('#rdmusnow');if(n&&BG.on&&BG.sty)n.textContent=`♪ ${BG.sty.n} · ${v} BPM`}
  save()}});

Object.assign(A,{
 rdplay:()=>{if(RD.playing){RD.playing=false;RD.paused=true;RD.gen++;speechSynthesis.cancel();if(BG.c&&BG.on)BG.c.suspend();rdSync();return}
  if(!RD.items.length)return toast('Nothing to read yet');
  if(RD.i>=RD.items.length)RD.i=0;
  rdBegin()},
 rdstop:()=>rdStop(),
 rdgo:i=>{RD.i=+i;rdMark(RD.i);rdBegin()},
 rdpl:()=>{if(!RD.items.length)return;RD.i=Math.max(0,RD.i-1);rdMark(RD.i);rdBegin()},
 rdnl:()=>{if(!RD.items.length)return;RD.i=Math.min(RD.items.length-1,RD.i+1);rdMark(RD.i);rdBegin()},
 rdprev:name=>{const s=cur();RD.playing=false;RD.paused=false;RD.gen++;speechSynthesis.cancel();rdSync();
  const it=name===NARR?RD.items.find(x=>x.k!='dial'):RD.items.find(x=>x.who===name),text=String(it?it.x:(name===NARR?'This is the narrator.':name)).slice(0,140);
  setTimeout(()=>rdSay(s,name===NARR?null:name,text),70)},
 rdlib:id=>{const s=cur(),p=rdP(id);if(!p)return;RD.playing=false;RD.paused=false;RD.gen++;speechSynthesis.cancel();rdSync();
  let text=p[2]=='ta'?`வணக்கம், நான் ${p[1]}. இது என் குரல்.`:`Hello, I'm ${p[1]}. This is how I sound in your table read.`;
  if(p[2]=='ta'&&!rdVoices().some(v=>rdVL(v)==='ta')){text=`Hello, I'm ${p[1]}. This is my voice style.`;toast('No Tamil voice on this device. Previewing in English.')}
  setTimeout(()=>rdSay(s,null,text,null,p),70)},
 rdmus:()=>{const s=cur();if(BG.on&&!RD.playing){bgStop();RD.cm=null;rdMusSync();return}
  if((s.tr||{}).mus==='off')return toast('Choose a music style first');
  rdMus(s,true)},
 rdbpmauto:()=>{const s=cur();if(s.tr)delete s.tr.bpm;BG.ovr=0;if(BG.on&&BG.sty)BG.bpm=BG.sty.bpm;save();const sl=document.querySelector('[data-rm=bpm]'),r=$('#rdbpm'),st=BG.sty||BGS.find(x=>x.id===((s.tr||{}).mus))||BGS[0];if(sl)sl.value=st.bpm;if(r)r.textContent=st.bpm+' BPM';rdMusSync();toast('Tempo follows each style')},
 rdreset:()=>{const s=cur();if(s.tr){delete s.tr.cast;delete s.tr.narr}save();rdRefresh();toast('Voices reset to automatic casting')}
});
if(rdOK()){speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',()=>{if(tab==='tread'&&!RD.playing&&!RD.paused&&!BG.on&&cur()&&$('#rdplay'))body(cur())})}
addEventListener('pagehide',()=>{try{rdOK()&&speechSynthesis.cancel()}catch(_){}bgStop()});
setInterval(()=>{if((RD.playing||RD.paused||BG.on)&&!document.getElementById('rdplay'))rdStop()},500);
