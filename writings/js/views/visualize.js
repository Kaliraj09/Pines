/* ============================================================
   Pines · views/visualize.js
   Visualize tab: 3D scene previs (needs three.js from cdnjs)
   ============================================================ */
/* ===== Pines Visualize: 3D scene previs (added module; no existing code is edited) ===== */
(()=>{
const TH='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',D=Math.PI/180,ease=x=>x*x*(3-2*x),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let T,R,SC,CAM,ENV,sunL,amb,roomL,raf,root,W,SID,OWN,dirty=false,play=null,tw=null,guides=false,RC,PL,SKY,skyMat,STARS,CLOUDS,ENVRT,PMG,EI=1,DRGON=0,LIBK='doc',sr=1;
const CH={},WIN=[],LAMP=[];
if(!P.viz)P.viz='<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M3 7l9 5 9-5"/>';
const TD={day:['Day','#9fd4ff','#fff3d6',1.1,[8,14,6],.65],night:['Night','#070d24','#7f9bff',.4,[-6,12,-4],.2],evening:['Evening','#f0a560','#ff9a4d',.8,[-12,5,6],.45],dawn:['Dawn','#f6c1cf','#ffc9a0',.65,[12,5,-4],.42],dusk:['Dusk','#5b4b8f','#b07bd8',.45,[-10,4,-6],.3]};
const TM={DAY:'day',NIGHT:'night',MORNING:'dawn',EVENING:'evening',DAWN:'dawn',DUSK:'dusk'};
const ST=[['est','Establishing'],['wide','Wide shot'],['full','Full shot'],['med','Medium shot'],['mcu','Medium close-up'],['cu','Close-up'],['ecu','Extreme close-up'],['ots','Over-the-shoulder'],['two','Two-shot'],['low','Low angle'],['high','High angle'],['bird','Bird’s-eye'],['dutch','Dutch angle'],['pov','POV']];
const sn=k=>(ST.find(x=>x[0]==k)||[0,'Shot'])[1];
/* prop parts: ['b',w,h,d,col,x,y,z] box · ['c',radius,height,0,col,x,y,z] cylinder · ['s',radius,0,0,col,x,y,z] sphere · col '*win' = window glass, '*#hex' = glowing */
const K={
bed:[['b',2,.4,1.6,'#7a5230',0,.2,0],['b',1.9,.25,1.5,'#e9eef5',0,.52,0],['b',.4,.14,.7,'#fff',-.7,.72,-.4],['b',.4,.14,.7,'#fff',-.7,.72,.4]],
sofa:[['b',2.2,.4,.9,'#4a6fa5',0,.2,0],['b',2.2,.5,.2,'#4a6fa5',0,.65,-.4],['b',.2,.3,.9,'#3f5f90',-1.1,.5,0],['b',.2,.3,.9,'#3f5f90',1.1,.5,0]],
chair:[['b',.5,.08,.5,'#8a5a35',0,.45,0],['b',.5,.5,.06,'#8a5a35',0,.72,-.22],['b',.46,.45,.04,'#6b4426',0,.22,.2],['b',.46,.45,.04,'#6b4426',0,.22,-.2]],
table:[['b',1.4,.06,.8,'#9a6b3f',0,.75,0],['b',.08,.72,.08,'#7b5230',-.6,.36,-.32],['b',.08,.72,.08,'#7b5230',.6,.36,-.32],['b',.08,.72,.08,'#7b5230',-.6,.36,.32],['b',.08,.72,.08,'#7b5230',.6,.36,.32]],
desk:[['b',1.5,.05,.7,'#b08455',0,.75,0],['b',.06,.72,.66,'#8d6a42',-.7,.36,0],['b',.06,.72,.66,'#8d6a42',.7,.36,0],['b',.5,.3,.04,'#111',0,1,-.2],['b',.12,.2,.1,'#333',0,.88,-.2]],
tv:[['b',1.3,.75,.06,'#0c0c10',0,1.1,0],['b',1.6,.5,.45,'#6b5a4a',0,.25,0]],
shelf:[['b',1.2,2,.35,'#6b4a2b',0,1,0],['b',1,.28,.3,'#9b3d3d',0,.75,.02],['b',1,.28,.3,'#3d6b9b',0,1.25,.02],['b',1,.28,.3,'#3d9b5f',0,1.7,.02]],
wardrobe:[['b',1.4,2.1,.6,'#8a6a4a',0,1.05,0],['b',.03,1.9,.02,'#443',0,1.05,.31]],
counter:[['b',3,.9,.65,'#d9d2c5',0,.45,0],['b',3.05,.05,.7,'#555a60',0,.92,0],['b',.5,.04,.4,'#222',-.6,.95,0]],
fridge:[['b',.75,1.8,.7,'#d6dde3',0,.9,0],['b',.03,.7,.04,'#888',.3,1.2,.36]],
tub:[['b',1.7,.55,.8,'#f2f5f7',0,.28,0],['b',1.5,.05,.6,'#bfe3f5',0,.55,0]],
toilet:[['b',.4,.4,.55,'#f4f6f8',0,.2,0],['b',.4,.7,.2,'#f4f6f8',0,.55,-.28]],
sink:[['b',.6,.85,.45,'#e8eaee',0,.42,0],['b',.5,.04,.36,'#cfd8e0',0,.87,0]],
plant:[['c',.18,.35,0,'#8a4b2d',0,.17,0],['s',.35,0,0,'#2f8f46',0,.75,0]],
bench:[['b',2,.08,.5,'#8a5a35',0,.45,0],['b',2,.5,.06,'#8a5a35',0,.75,-.25],['b',.08,.45,.45,'#5e3d22',-.9,.22,0],['b',.08,.45,.45,'#5e3d22',.9,.22,0]],
bar:[['b',4,1.05,.7,'#4a2f1d',0,.52,0],['b',4.1,.06,.8,'#b8864f',0,1.08,0]],
board:[['b',3,1.3,.05,'#1f3d2e',0,1.7,0],['b',3.1,.08,.07,'#8a6a4a',0,1.02,0]],
bedh:[['b',1,.5,2.1,'#cfd6dc',0,.5,0],['b',.95,.15,2,'#fff',0,.82,0],['b',.04,1.6,.04,'#aaa',.7,.8,-.6]],
rack:[['b',2,2.4,.6,'#37506b',0,1.2,0],['b',1.8,.4,.5,'#b98d4e',0,.4,0],['b',1.8,.4,.5,'#a8794a',0,1.2,0],['b',1.8,.4,.5,'#c19a5b',0,2,0]],
crate:[['b',.7,.7,.7,'#a67c4e',0,.35,0]],
car:[['b',4.2,.7,1.8,'#c0392b',0,.55,0],['b',2.2,.6,1.6,'#8fc3e8',-.2,1.1,0],['b',.7,.7,.2,'#111',1.3,.35,.95],['b',.7,.7,.2,'#111',-1.3,.35,.95],['b',.7,.7,.2,'#111',1.3,.35,-.95],['b',.7,.7,.2,'#111',-1.3,.35,-.95]],
tree:[['c',.18,2,0,'#6b4a2b',0,1,0],['s',1.1,0,0,'#2f7f3f',0,2.8,0]],
lamp:[['c',.07,4,0,'#333',0,2,0],['s',.25,0,0,'*#ffe9a8',0,4.1,0]],
flamp:[['c',.03,1.5,0,'#222',0,.75,0],['s',.22,0,0,'*#ffe9b0',0,1.6,0]],
house:[['b',5,3,4,'#e8d5b5',0,1.5,0],['b',5.4,.5,4.4,'#a0522d',0,3.2,0],['b',1,2,.05,'#6b4a2b',0,1,2.03],['b',.9,.9,.05,'*win',1.5,1.7,2.03]],
build:[['b',6,12,6,'#7d8793',0,6,0],['b',4.6,.5,.05,'*win',0,3,3.02],['b',4.6,.5,.05,'*win',0,5,3.02],['b',4.6,.5,.05,'*win',0,8,3.02],['b',4.6,.5,.05,'*win',0,11,3.02]],
bush:[['s',.6,0,0,'#3a8f4d',0,.5,0]],
rock:[['s',.8,0,0,'#7b7f85',0,.4,0]],
fence:[['b',4,.9,.08,'#b99a6b',0,.45,0]],
window:[['b',1.4,1.1,.06,'*win',0,1.7,0],['b',1.5,.08,.08,'#e8e8e8',0,1.15,0]],
door:[['b',1,2.1,.06,'#6b4a2b',0,1.05,0]],
rug:[['b',2.6,.02,1.8,'#a23b3b',0,.01,0]],
stage:[['b',5,.5,3,'#5a4637',0,.25,0]],
pillar:[['c',.3,3,0,'#cfc8b8',0,1.5,0]],
road:[['b',40,.02,5,'#2d2f33',0,.01,0],['b',40,.03,.12,'#e8d44d',0,.02,0]],
water:[['b',60,.02,14,'#2f78a6',0,.01,0]],
mount:[['s',9,0,0,'#6d7f6a',0,-3,0]],
bus:[['b',7,2.4,2.3,'#e0a21a',0,1.4,0],['b',6.6,.7,.05,'*win',0,1.9,1.16]],
track:[['b',40,.04,.12,'#777',0,.03,-.7],['b',40,.04,.12,'#777',0,.03,.7],['b',40,.03,3,'#5b4b3a',0,.01,0]],
tomb:[['b',.8,.9,.2,'#9aa0a6',0,.45,0]]};
/* location presets: key, name, exterior?, width, depth, floor/ground, wall, props "kind x z rot scale;…" */
const LC=[
['living','Living room',0,7,6,'#b08a62','#efe6d8','sofa 0 1.3 180;rug 0 .2;table 0 .2 0 .6;tv 0 -2.8;shelf -3.2 -1 90;flamp 3 -2.4;plant -3 2.5;window 3.47 -1 -90;window 3.47 1.2 -90'],
['bedroom','Bedroom',0,5,5,'#a08060','#e5dfe8','bed 0 -1.4 -90;wardrobe 1.8 -2.2;flamp -1.8 -2;door -2.47 1.2 90;window 2.47 0 -90;desk -1.6 2.1 180;chair -1.6 1.4'],
['kitchen','Kitchen',0,5,4.5,'#c9c2b4','#f4efe4','counter 0 -1.9;fridge 2 -1.9;counter -2.2 0 90;table 0 1 0;chair -.7 1 -90;chair .7 1 90;window 2.47 .5 -90'],
['bath','Bathroom',0,3.5,3.5,'#cfd8de','#e9f1f4','tub 0 -1.3;toilet 1.2 1.2 180;sink -1.2 1.3 180;window -1.72 0 90;door 1.72 -.5 -90'],
['office','Office',0,6,5,'#7a7f86','#e9eaee','desk 0 -1.8;chair 0 -1 180;shelf -2.8 -1 90;shelf 2.8 -1 -90;plant 2.5 2;table 1.8 1.6;chair -1.6 1.6 180'],
['hospital','Hospital room',0,5.5,5,'#cfe0e0','#f2fafa','bedh -1 -.3;bedh 1.6 -.3;window 2.72 1.5 -90;door -2.72 1.5 90;sink -2 -2.2;chair 0 2'],
['class','Classroom',0,8,7,'#b9a27a','#eef0e6','board 0 -3.45;table 0 -2.4 0 .9;table -2.5 0 0 .6;table 0 0 0 .6;table 2.5 0 0 .6;table -2.5 1.8 0 .6;table 0 1.8 0 .6;table 2.5 1.8 0 .6;window 3.97 0 -90'],
['restaurant','Restaurant',0,9,7,'#8a6a4a','#f0e2c8','bar 0 -3.1;table -3 -.5;chair -3 .2 180;chair -3 -1.2;table 0 -.5;chair 0 .2 180;chair 0 -1.2;table 3 -.5;chair 3 .2 180;chair 3 -1.2;table -3 2.3;table 3 2.3;window 4.47 0 -90'],
['cafe','Café',0,7,6,'#a9825c','#f1e4cf','bar 0 -2.5;table -2 1;chair -2 1.6 180;chair -2 .4;table 2 1;chair 2 1.6 180;chair 2 .4;plant 3 -2.5;window -3.47 0 90'],
['pub','Bar / pub',0,8,6,'#3a2a22','#4b3328','bar 0 -2.4;shelf 0 -2.8;table 3 1;chair 3 1.6 180;chair 3 .4;table -3 1;chair -3 1.6 180;chair -3 .4;flamp -3.5 -2.5'],
['police','Police station',0,8,6,'#9a9fa6','#dfe3e6','desk -2 -1.5;desk 2 -1.5;chair -2 -.8 180;chair 2 -.8 180;shelf 0 -2.8;door 3.97 1 -90;bench -3.5 2 90'],
['court','Courtroom',0,9,7,'#8a6a4a','#d8cdb8','stage 0 -2.8;desk 0 -2.2 0 1.6;bench -2 1.2;bench 2 1.2;bench -2 2.6;bench 2 2.6;pillar -4 -3;pillar 4 -3'],
['cell','Jail cell',0,3,4,'#6c6c6c','#9a9a9a','bed -.6 -1.4 -90;toilet 1 1.6 180;window 0 -1.97'],
['hotel','Hotel room',0,5.5,5,'#8a6d4d','#ece3d0','bed 0 -1.4 -90;table -2 -1.4 0 .4;flamp 2 -2;desk 2 1.8 180;chair 2 1.1;rug 0 .8;window 2.72 -.5 -90'],
['corridor','Corridor',0,3,14,'#8d949b','#e8ecee','door -1.47 -4 90;door -1.47 0 90;door 1.47 -2 -90;door 1.47 3 -90;door 1.47 -6 -90;door -1.47 4 90;plant 1.2 6.5;flamp -1.2 6'],
['temple','Temple / church hall',0,8,12,'#a8957b','#e6d9c0','pillar -3 -4;pillar 3 -4;pillar -3 0;pillar 3 0;pillar -3 4;pillar 3 4;stage 0 -5.2;bench -1.8 2;bench 1.8 2;bench -1.8 4;bench 1.8 4'],
['library','Library',0,9,7,'#7a5b3f','#eae0cc','shelf -4.3 -2 90;shelf -4.3 0 90;shelf -4.3 2 90;shelf 4.3 -2 -90;shelf 4.3 0 -90;shelf 4.3 2 -90;table 0 0 0 1.3;chair -.5 .8 180;chair .5 -.8'],
['warehouse','Warehouse',0,14,10,'#6d6f73','#8e9195','rack -4 -3;rack 0 -3;rack 4 -3;rack -4 1;rack 0 1;rack 4 1;crate 5 3.5;crate 5.8 3.5;crate 5.4 4.2'],
['garage','Garage / workshop',0,7,6,'#55585c','#b9bcc0','car 0 0;rack -3.2 -2.3;crate 3 2;crate 3.8 2.2;shelf 3.4 -2.6'],
['shop','Shop / store',0,8,6,'#b9ad98','#f0ece2','shelf -2 -1;shelf 0 -1;shelf 2 -1;counter 2.5 2.2;fridge -3.5 -2.5;plant -3.5 2.5'],
['gym','Gym',0,9,7,'#2f3135','#c2c7cc','rack -3 -2.5;rack -1 -2.5;crate 2 -1;crate 3 1;bench 0 1.5;window 0 -3.47'],
['cinema','Cinema / theatre',0,10,8,'#3a2230','#4a2c3c','board 0 -3.9 0 2;stage 0 -3.2;bench -2 -.5;bench 2 -.5;bench -2 1.5;bench 2 1.5;bench -2 3;bench 2 3'],
['vhouse','Village house',0,5,4.5,'#a8845c','#d9bf93','bench -1.5 -1.8;table 0 0 0 .5;rug 0 .4;plant 2 -1.8;window 2.47 0 -90;door 0 2.22 180'],
['empty','Empty room',0,6,6,'#9a9a9a','#d8d8d8',''],
['street','City street',1,24,24,'#3a3d42','','road 0 0;build -10 -8;build 3 -9 0 1.3;build 12 -8;build -8 9 180;build 6 10 180;lamp 3.5 -3;lamp -3.5 3;car -2 -1'],
['village','Village street',1,24,24,'#a9835a','','house -7 -6;house 7 -7;house -6 7 180;house 8 6 180;tree 0 -9;tree -2 9;bush 4 4;bush -4 -3'],
['park','Park',1,24,24,'#4c9a52','','tree -8 -6;tree 6 -9;tree 9 5;tree -6 8;bench 2 -2;bench -3 3 180;lamp 0 -5;bush 4 5;bush -5 -2'],
['beach','Beach',1,24,24,'#e8d6a6','','water 0 -14;rock 6 4;rock -7 2;rock 8 -3;bush -9 7'],
['forest','Forest',1,24,24,'#2f6a3a','','tree -4 -5;tree 5 -7;tree -9 -2;tree 8 1;tree -6 6;tree 3 8;tree 11 -6;tree -12 7;tree 0 -10;bush 2 -3;bush -3 2;rock 4 3'],
['highway','Highway',1,24,24,'#6b8f4e','','road 0 -3;road 0 3;car 5 -3;car -6 3 180;lamp 0 0;tree -8 -9;tree 9 9'],
['roof','Rooftop',1,24,24,'#8b8f94','','fence 0 -6;fence 0 6;fence -6 0 90;fence 6 0 90;crate 3 3;build -18 -16 0 2;build 16 -18 0 2;build 20 8 0 2'],
['parking','Parking lot',1,24,24,'#4a4c50','','car -5 -2;car 0 -2;car 5 -2;car -5 3 180;car 3 3 180;lamp 8 -6;build -4 -12;build 8 -12'],
['rail','Railway platform',1,24,24,'#7a7266','','track 0 -1.5;bench -4 3 180;bench 4 3 180;lamp 2 4;pillar -6 3;pillar 6 3;build 0 -14'],
['bus','Bus stand',1,24,24,'#6b6e72','','bus -4 -3;bus 5 -4;bench 0 3;lamp 6 2;build -6 -12;tree 9 6'],
['market','Market',1,24,24,'#a98e68','','table -5 -3 0 1.6;table 0 -3 0 1.6;table 5 -3 0 1.6;table -5 3 180 1.6;table 0 3 180 1.6;table 5 3 180 1.6;crate -8 0;crate 8 0;build 0 -14'],
['paddy','Paddy field',1,24,24,'#7cb342','','tree -10 -6;tree 9 -8;house -12 -10;rock 5 5;bush -4 4;bush 3 -4;bush 7 0'],
['hill','Hill top',1,24,24,'#6f8f5c','','mount -6 -12;mount 10 -10 0 1.4;tree 4 3;rock -3 4;rock 6 6;bench 0 5'],
['river','Riverbank',1,24,24,'#6e9a58','','water 0 -6;rock 6 5;tree -8 8;tree 9 7;bush -3 4'],
['bridge','Bridge',1,24,24,'#2f78a6','','road 0 0;fence 0 2.8;fence 0 -2.8;fence 4 2.8;fence 4 -2.8;lamp 8 3;lamp -8 -3'],
['cemetery','Cemetery',1,24,24,'#4d6b45','','tomb -4 -2;tomb 0 -2;tomb 4 -2;tomb -4 2 180;tomb 0 2 180;tomb 4 2 180;tree -9 -6;tree 8 7'],
['desert','Desert',1,24,24,'#d9b46c','','rock -6 -3;rock 7 4;mount -10 -12 0 1.2;bush 3 2'],
['constr','Construction site',1,24,24,'#8a7f6a','','build -9 -8;crate 3 2;crate 4 2.8;rack -4 3;car 8 -3'],
['ground','School ground',1,24,24,'#5aa05a','','build 0 -12;fence 0 8;fence 4 8;fence -4 8;tree -9 5;bench 6 5'],
['tcourt','Temple courtyard',1,24,24,'#b9a58a','','pillar -4 -4;pillar 4 -4;pillar -4 4;pillar 4 4;stage 0 -7;tree -9 6;lamp 7 3'],
['garden','Backyard / garden',1,24,24,'#58a05a','','house 0 -8;fence -8 4 90;tree 7 -2;bush -5 2;bush 5 4;bench -2 3 180']
].map(([k,n,e,w,d,f,c,p])=>({k,n,e,w,d,f,c,p}));
const KW=[['hospital|ward|icu','hospital'],['bed','bedroom'],['kitchen','kitchen'],['bath|toilet|washroom','bath'],['office|cabin','office'],['playground|stadium|ground','ground'],['class|school','class'],['restaurant|mess|canteen','restaurant'],['cafe|coffee|tea','cafe'],['bar|pub|wine','pub'],['police','police'],['court','court'],['jail|cell|prison','cell'],['hotel|lodge|resort','hotel'],['corridor|passage|lobby|hall','corridor'],['courtyard|prakaram','tcourt'],['temple|church|mosque|prayer','temple'],['library','library'],['warehouse|godown|factory','warehouse'],['garage|workshop','garage'],['shop|store|mall|supermarket','shop'],['gym','gym'],['theatre|theater|cinema','cinema'],['hut|village house','vhouse'],['living|house|home|flat|apartment','living'],['village','village'],['highway','highway'],['street|road|lane|signal','street'],['park','park'],['garden|backyard','garden'],['beach|sea|shore','beach'],['forest|jungle|woods','forest'],['roof|terrace','roof'],['parking','parking'],['railway|train|platform','rail'],['bus','bus'],['market|bazaar','market'],['field|farm|paddy','paddy'],['hill|mountain','hill'],['river|lake|pond','river'],['bridge','bridge'],['cemetery|graveyard','cemetery'],['desert','desert'],['construction','constr']];
/* ---- added props (b box · c cylinder · s sphere · k cone · w wheel/z-axis · v x-axis; prefixes: @tex#hex textured, ~ metal, % glossy) ---- */
Object.assign(K,{
car:[['b',4.2,.7,1.8,'%#c0392b',0,.55,0],['b',2.2,.6,1.6,'%#8fc3e8',-.2,1.1,0],['w',.36,.22,0,'#111',1.3,.36,.9],['w',.36,.22,0,'#111',-1.3,.36,.9],['w',.36,.22,0,'#111',1.3,.36,-.9],['w',.36,.22,0,'#111',-1.3,.36,-.9],['b',.1,.2,.3,'*#fff2c0',2.1,.6,.6],['b',.1,.2,.3,'*#fff2c0',2.1,.6,-.6]],
road:[['b',40,.02,5,'@asph#3a3d42',0,.01,0],['b',40,.03,.12,'#e8d44d',0,.02,0]],water:[['b',60,.02,14,'%#2f78a6',0,.01,0]],
sofa:[['b',2.2,.4,.9,'@fab#4a6fa5',0,.2,0],['b',2.2,.5,.2,'@fab#4a6fa5',0,.65,-.4],['b',.2,.3,.9,'@fab#3f5f90',-1.1,.5,0],['b',.2,.3,.9,'@fab#3f5f90',1.1,.5,0],['b',.9,.14,.8,'@fab#5a80b5',-.5,.47,0],['b',.9,.14,.8,'@fab#5a80b5',.5,.47,0]],
rug:[['b',2.6,.02,1.8,'@fab#a23b3b',0,.01,0]],
tent:[['k',1.7,2.2,0,'#c8562b',0,1.1,0]],palm:[['c',.12,4.2,0,'#8a6a4a',0,2.1,0],['k',1.5,.7,0,'#2f9b4a',0,4.4,0],['k',1.1,.6,0,'#3aa95a',0,4.9,0]],
pine:[['c',.15,.8,0,'#5a3d22',0,.4,0],['k',1.3,2,0,'#1f5f35',0,1.8,0],['k',1,1.8,0,'#25703c',0,3,0],['k',.7,1.5,0,'#2b8044',0,4,0]],
cactus:[['c',.22,1.6,0,'#4f8f4a',0,.8,0],['c',.12,.6,0,'#4f8f4a',.35,.9,0],['c',.12,.5,0,'#4f8f4a',-.35,1.1,0]],
hay:[['c',.7,.9,0,'#d6b25a',0,.45,0],['s',.7,0,0,'#d6b25a',0,.9,0]],
well:[['c',.8,.8,0,'#8b8f94',0,.4,0],['b',.1,1.6,.1,'#6b4a2b',-.7,1.5,0],['b',.1,1.6,.1,'#6b4a2b',.7,1.5,0],['k',1.1,.6,0,'#a0522d',0,2.6,0]],
hut:[['c',1.8,2,0,'#d2b48c',0,1,0],['k',2.4,1.6,0,'#b58a3c',0,2.8,0],['b',.7,1.3,.05,'#4a3320',0,.65,1.75]],
gopuram:[['b',5,1.5,3.5,'@brick#d9c7a3',0,.75,0],['b',4.2,1.3,3,'#e8d5b5',0,2.15,0],['b',3.4,1.2,2.5,'#d9c7a3',0,3.4,0],['b',2.6,1.1,2,'#e8d5b5',0,4.55,0],['b',1.8,1,1.5,'#d9c7a3',0,5.6,0],['k',.9,1.2,0,'~#c9a227',0,6.7,0],['b',1.2,1.8,.08,'#3b2a1a',0,.9,1.76]],
statue:[['b',1,.9,1,'#9aa0a6',0,.45,0],['c',.25,1.6,0,'#b0b5ba',0,1.7,0],['s',.22,0,0,'#b0b5ba',0,2.65,0]],
fountain:[['c',1.4,.5,0,'#a9aeb4',0,.25,0],['c',1.2,.1,0,'%#4a8fb8',0,.52,0],['c',.15,1.2,0,'#a9aeb4',0,.9,0],['c',.6,.12,0,'#a9aeb4',0,1.4,0]],
stall:[['b',2.4,.9,1,'#8a6a4a',0,.45,0],['b',2.6,.08,1.4,'#c0392b',0,2.4,-.05],['b',.08,2.4,.08,'#6b4a2b',-1.2,1.2,.55],['b',.08,2.4,.08,'#6b4a2b',1.2,1.2,.55],['b',.5,.15,.4,'#e67e22',-.6,1,0],['b',.5,.15,.4,'#27ae60',.2,1,0],['b',.5,.15,.4,'#f1c40f',.8,1,0]],
cart:[['b',1.6,.12,.9,'#9a6b3f',0,.8,0],['w',.4,.08,0,'#222',-.5,.4,.5],['w',.4,.08,0,'#222',-.5,.4,-.5],['b',.12,.5,.9,'#9a6b3f',.8,1.05,0],['b',.12,.5,.9,'#9a6b3f',-.8,1.05,0]],
auto:[['b',2.4,.9,1.3,'#f1c40f',0,.7,0],['b',2.2,.1,1.4,'#222',0,1.95,0],['b',.06,.9,.06,'#222',-1,1.45,.6],['b',.06,.9,.06,'#222',1,1.45,.6],['b',.06,.9,.06,'#222',1,1.45,-.6],['w',.28,.15,0,'#111',-.8,.28,.6],['w',.28,.15,0,'#111',-.8,.28,-.6],['w',.28,.15,0,'#111',1,.28,0]],
truck:[['b',5,2.6,2.4,'#e8e8e8',-1.5,1.9,0],['b',1.8,1.8,2.3,'%#2f6fb5',2.1,1.4,0],['b',.1,.7,2,'*win',3.02,1.8,0],['w',.5,.3,0,'#111',-3,.5,1.2],['w',.5,.3,0,'#111',-3,.5,-1.2],['w',.5,.3,0,'#111',2,.5,1.2],['w',.5,.3,0,'#111',2,.5,-1.2]],
ambulance:[['b',4,1.8,1.8,'%#f2f2f2',0,1.2,0],['b',4.05,.2,1.85,'#c0392b',0,1.1,0],['b',.1,.6,1.5,'*win',2.03,1.5,0],['w',.4,.2,0,'#111',-1.3,.4,.9],['w',.4,.2,0,'#111',1.3,.4,.9],['w',.4,.2,0,'#111',-1.3,.4,-.9],['w',.4,.2,0,'#111',1.3,.4,-.9],['b',.3,.1,.3,'*#ff3030',0,2.15,0]],
tractor:[['b',1.8,1,1,'%#2f8f3a',0,1.2,0],['w',.6,.3,0,'#111',-.7,.6,.65],['w',.6,.3,0,'#111',-.7,.6,-.65],['w',.35,.2,0,'#111',.9,.35,.6],['w',.35,.2,0,'#111',.9,.35,-.6],['b',.1,1.2,.1,'#222',.5,2.2,.3]],
container:[['b',6,2.6,2.4,'@wood#b5412c',0,1.3,0]],
signal:[['c',.08,4,0,'#333',0,2,0],['b',.4,1.1,.3,'#222',0,4,0],['s',.1,0,0,'*#ff3030',0,4.3,.17],['s',.1,0,0,'*#555555',0,4,.17],['s',.1,0,0,'*#555555',0,3.7,.17]],
sign:[['c',.04,2.4,0,'~#888888',0,1.2,0],['b',.9,.6,.04,'#2f6fb5',0,2.4,0]],
billboard:[['b',.2,4,.2,'#555555',-2,2,0],['b',.2,4,.2,'#555555',2,2,0],['b',5.5,2.6,.15,'#e8e8e8',0,4.5,0],['b',5,2.1,.04,'#3a6fb5',0,4.5,.1]],
boat:[['b',4,.5,1.4,'#8a5a35',0,.3,0],['b',.1,2.6,.1,'#6b4a2b',0,1.7,0],['b',.04,1.8,1.2,'#f2f2f2',0,2,.2]],
dock:[['b',8,.2,2,'#7a5b3f',0,.5,0],['b',.2,1,.2,'#5e3d22',-3.8,.2,.8],['b',.2,1,.2,'#5e3d22',3.8,.2,.8],['b',.2,1,.2,'#5e3d22',-3.8,.2,-.8],['b',.2,1,.2,'#5e3d22',3.8,.2,-.8]],
bonfire:[['c',.5,.2,0,'#444444',0,.1,0],['k',.35,.9,0,'*#ff8a1f',0,.55,0],['k',.2,.6,0,'*#ffd24a',0,.5,0]],
swing:[['b',.08,2.4,.08,'#c0392b',-1,1.2,0],['b',.08,2.4,.08,'#c0392b',1,1.2,0],['b',2.2,.08,.08,'#c0392b',0,2.4,0],['b',.5,.06,.25,'#333333',-.3,.6,0],['b',.5,.06,.25,'#333333',.5,.6,0]],
slide:[['b',.9,1.8,.9,'#2f6fb5',0,.9,-1.1],['b',.9,.06,1.6,'#e8c42a',0,.8,.4]],
goal:[['b',.08,2.2,.08,'#f2f2f2',-1.8,1.1,0],['b',.08,2.2,.08,'#f2f2f2',1.8,1.1,0],['b',3.7,.08,.08,'#f2f2f2',0,2.2,0]],
hoop:[['c',.06,3,0,'#444444',0,1.5,0],['b',1.5,1,.05,'#f2f2f2',0,3.2,.1],['c',.25,.03,0,'*#ff6a00',0,2.9,.4]],
piano:[['b',1.6,.9,.7,'%#101014',0,.45,0],['b',1.5,.04,.35,'#f2f2f2',0,.92,.3],['b',1.6,.7,.1,'%#101014',0,1.2,-.3]],
mic:[['c',.02,1.5,0,'#222222',0,.75,0],['s',.05,0,0,'~#555555',0,1.55,0]],
speaker:[['b',.5,1,.4,'#1a1a1a',0,.5,0],['w',.15,.03,0,'#444444',0,.35,.2],['w',.08,.03,0,'#444444',0,.8,.2]],
altar:[['b',1.6,1,.8,'#c9b9a0',0,.5,0],['k',.15,.3,0,'*#ffb347',-.5,1.15,0],['k',.15,.3,0,'*#ffb347',.5,1.15,0]],
mirror:[['b',.9,1.6,.04,'~#cfe3f0',0,1.2,0]],
stove:[['b',.8,.9,.6,'~#bfc3c8',0,.45,0],['c',.12,.02,0,'#111111',-.2,.92,0],['c',.12,.02,0,'#111111',.2,.92,0]],
washer:[['b',.6,.85,.6,'#f4f6f8',0,.42,0],['w',.22,.04,0,'#222222',0,.45,.31]],
locker:[['b',.8,1.9,.45,'~#5d7a99',0,.95,0],['b',.03,1.5,.02,'#222222',0,.95,.23]],
atm:[['b',.9,1.8,.7,'#2b3f8f',0,.9,0],['b',.6,.4,.04,'*#7fd1ff',0,1.4,.36]],
vending:[['b',1,1.9,.8,'%#c0392b',0,.95,0],['b',.7,1.2,.04,'*#bfe8ff',0,1.2,.41]],
mannequin:[['c',.07,1.1,0,'#dddddd',0,.9,0],['s',.1,0,0,'#dddddd',0,1.6,0],['b',.4,.6,.2,'#c9c3b8',0,1.2,0]],
laptop:[['b',.35,.02,.25,'~#888888',0,.01,0],['b',.35,.22,.02,'*#7fb8e8',0,.12,-.12]],
chand:[['c',.02,.6,0,'#444444',0,2.7,0],['s',.3,0,0,'*#ffe2a8',0,2.35,0]],
hedge:[['b',3,1,.8,'#2f6f3a',0,.5,0]],bin:[['c',.25,.8,0,'#3b6b4a',0,.4,0]],
barrier:[['b',2,.5,.1,'#e8e8e8',0,.6,0],['b',2,.12,.11,'#c0392b',0,.6,0],['b',.1,.6,.1,'#555555',-.9,.3,0],['b',.1,.6,.1,'#555555',.9,.3,0]],
curtain:[['b',.1,2.2,.8,'@fab#8e3b46',0,1.2,0]],painting:[['b',1,.7,.04,'#7a5a3a',0,1.6,0],['b',.88,.58,.045,'#6fa3b5',0,1.6,.005]],
stool:[['c',.2,.5,0,'#6b4a2b',0,.25,0]],crib:[['b',1,.6,.6,'#e8d5b5',0,.5,0],['b',.9,.1,.5,'#f6e3ea',0,.4,0]],
stairs:[['b',1.8,.2,.6,'#9a9a9a',0,.1,0]],tower:[['b',5,22,5,'~#7f93a8',0,11,0],...Array.from({length:9},(_,i)=>['b',4.6,.6,.05,'*win',0,2+i*2.2,2.52])],
cow:[['b',1.6,.8,.6,'#f2f2f2',0,1,0],['b',.3,.5,.3,'#f2f2f2',.9,1.3,0],['b',.14,.7,.14,'#444444',-.6,.35,.2],['b',.14,.7,.14,'#444444',-.6,.35,-.2],['b',.14,.7,.14,'#444444',.6,.35,.2],['b',.14,.7,.14,'#444444',.6,.35,-.2],['b',.5,.3,.4,'#3a3a3a',-.2,1.1,0]]});
const NL=[
['dining','Dining room',0,6,5,'#a5784a','#efe3cf','table 0 0 0 1.5;chair 0 .9 180;chair 0 -.9;chair -1.3 0 90;chair 1.3 0 -90;chand 0 0;shelf -2.8 -1.5 90;painting 0 -2.47;curtain 2.9 1'],
['nursery','Kids room',0,4.5,4.5,'#c9a97a','#f6e3ea','crib -1.3 -1.6;rug 0 .5 0 .9;shelf 2.1 -1 -90;plant 1.8 1.8;window 2.22 1 -90;curtain 2.1 1'],
['studio','Studio apartment',0,7,5,'#b49066','#ece7df','bed -2.4 -1.5 -90;sofa 1.2 1.6 180;counter 2.2 -2 0 .8;table 1.5 0 0 .8;desk -2.6 1.5 90;plant -3 -2.2;window 0 -2.47;laptop -2.6 1.5 90 1 .75'],
['attic','Attic',0,6,5,'#8a6a45','#cdb592','crate -2 -1.5;crate -1.3 -1.6;rack 2 -2;rug 0 .3;window 0 -2.47;painting -2.97 0 90;chair 1 1;plant -2 2'],
['basement','Basement',0,7,6,'#575a5e','#8d9094','rack -3 -2.5;rack -1 -2.5;locker 2 -2.7;crate 3 1.5;crate 3.7 1.6;crate 3.3 2.3;washer -3 2;flamp 1 2'],
['lab','Laboratory',0,8,6,'#cfd6dc','#f1f4f6','counter -2 -2.4 0 .9;counter 2 -2.4 0 .9;counter 0 0;counter 0 1.8;locker 3.6 1 -90;board 0 -2.97 0 .9;sink -3.5 1.5 90;stool -.8 .9;stool .8 2.7'],
['surgery','Operating theatre',0,6,6,'#9fc3c7','#e4f1f2','bedh 0 0 90;locker 2.7 2 -90;counter -2.7 -1.5 90 .8;sink 2.6 -2.4;chand 0 0;stool -1 1.5'],
['ward','Hospital ward',0,10,6,'#d6e4e4','#f4fafa','bedh -3.5 -1.8;bedh -1.2 -1.8;bedh 1.2 -1.8;bedh 3.5 -1.8;bedh -3.5 1.6;bedh 3.5 1.6;locker -4.6 -2.2;window 4.97 0 -90;curtain 0 0;counter 0 2.7 0 .8'],
['lobby','Hotel lobby',0,12,9,'#c9c2b4','#f1ece0','counter 0 -3.6 0 1.3;sofa -4 1 90;sofa 4 1 -90;table -3 1 0 .6;table 3 1 0 .6;plant -5.5 -3.5;plant 5.5 -3.5;plant -5.5 3.5;chand 0 0;chand 3.5 0;chand -3.5 0;pillar -3 -3;pillar 3 -3;painting 0 -4.47 0 2'],
['bank','Bank',0,10,7,'#b5b8bb','#e9ecee','counter -3 -2.5 0 1.2;counter 0 -2.5 0 1.2;counter 3 -2.5 0 1.2;chair -3 -1.7 180;chair 0 -1.7 180;chair 3 -1.7 180;atm 4.6 1;atm 4.6 2.5;sofa -3 2 180 .8;plant -4.5 2.8;chand 0 0'],
['airport','Airport terminal',0,18,12,'#c8ccd0','#e8edf2','bench -6 2 0 1.6;bench -3 2 0 1.6;bench 0 2 0 1.6;bench 3 2 0 1.6;bench 6 2 0 1.6;counter -6 -4.5 0 1.3;counter -2 -4.5 0 1.3;counter 2 -4.5 0 1.3;counter 6 -4.5 0 1.3;pillar -8 -2;pillar 8 -2;pillar -8 4;pillar 8 4;sign 0 -5.5 0 2;vending 8.5 -3;plant 7 4.5;chand -4 0;chand 4 0'],
['metro','Metro station',0,16,8,'#8f969c','#d4d9dd','pillar -6 -2;pillar -2 -2;pillar 2 -2;pillar 6 -2;bench -5 3 0 1.5;bench -1 3 0 1.5;bench 3 3 0 1.5;vending 7.6 -3;atm 7.6 -1;track 0 -3.3;chand -4 0;chand 4 0'],
['mall','Shopping mall',0,16,12,'#d9d3c6','#f2eee6','shelf -6 -5.4;shelf -3 -5.4;shelf 3 -5.4;shelf 6 -5.4;mannequin -5 -4;mannequin -4 -4;mannequin 5 -4;fountain 0 0;bench -4 3 0 1.5;bench 4 3 0 1.5;plant -7 -5;plant 7 -5;plant -7 5;plant 7 5;pillar -6 0;pillar 6 0;chand 0 -3;chand 0 3;vending 7.4 2'],
['bakery','Bakery',0,6,5,'#c8b595','#f6ead6','counter 0 -1.9 0 1.3;shelf -2.8 -.5 90;stove 2.4 -2;table -1.2 1.3 0 .6;chair -1.2 1.9 180;chair -1.2 .8;table 1.2 1.3 0 .6;chair 1.2 1.9 180;chair 1.2 .8;plant 2.6 2.1;window 0 -2.47 0 1.4'],
['salon','Beauty salon',0,6,5,'#dccfd6','#f7eef2','mirror -1.8 -2.45;mirror 0 -2.45;mirror 1.8 -2.45;chair -1.8 -1.7 180;chair 0 -1.7 180;chair 1.8 -1.7 180;counter 2.2 1.8 0 .8;sofa -1.8 1.9 180 .8;plant -2.6 2.1;chand 0 0'],
['newsroom','TV studio',0,10,8,'#2a2d33','#3a3f4a','desk 0 -1 0 1.8;chair -.5 -.3 180;chair .5 -.3 180;mic -.5 -.9;mic .5 -.9;board 0 -3.97 0 1.2;speaker -4 -3.5;speaker 4 -3.5;stage 0 2.5 0 .8;chand -3 0;chand 3 0;chand 0 2'],
['concert','Concert stage',0,16,12,'#1f1f26','#2b2b36','stage 0 -3.5 0 3;piano -3 -3.5 0 1;mic 0 -2.2;mic 2 -2.2;speaker -6 -4;speaker 6 -4;speaker -6.5 -2;speaker 6.5 -2;chand -4 -1;chand 4 -1;chand 0 -1'],
['sanctum','Temple sanctum',0,6,7,'#b8a58a','#d8c9a7','altar 0 -2.6 0 1.4;statue 0 -3.1 0 .6;pillar -2 -1;pillar 2 -1;pillar -2 1.5;pillar 2 1.5;flamp -.8 -2;flamp .8 -2'],
['wedding','Wedding hall',0,16,12,'#b99466','#f0dfbf','stage 0 -4.5 0 3;bench -3.5 0 0 1.4;bench 3.5 0 0 1.4;bench -3.5 2 0 1.4;bench 3.5 2 0 1.4;bench -3.5 4 0 1.4;bench 3.5 4 0 1.4;pillar -6 -2;pillar 6 -2;pillar -6 3;pillar 6 3;chand -3 0;chand 3 0;chand 0 3;plant -2 -3.8;plant 2 -3.8'],
['interrogation','Interrogation room',0,4,4,'#555a5f','#6f757a','table 0 0 0 .8;chair 0 .8 180;chair 0 -.8;mirror 0 -1.97 0 1.5;flamp -1.5 -1.5'],
['lift','Elevator',0,2.2,2.2,'#7e8387','#c4c9cd','mirror 0 -1.07;mirror -1.07 0 90'],
['stairwell','Stairwell',0,4,6,'#8d949b','#cfd4d8','stairs 0 -2.6;stairs 0 -2 0 1 .2;stairs 0 -1.4 0 1 .4;stairs 0 -.8 0 1 .6;stairs 0 -.2 0 1 .8;door 1.97 1.8 -90;flamp -1.6 2'],
['traincoach','Train compartment',0,3,10,'#6b4a35','#c8b79a','bench -1.1 -3 90;bench 1.1 -3 -90;bench -1.1 0 90;bench 1.1 0 -90;bench -1.1 3 90;bench 1.1 3 -90;window -1.47 -1.5 90;window -1.47 1.5 90;window 1.47 -1.5 -90;window 1.47 1.5 -90;door 0 -4.97'],
['buscoach','Inside a bus',0,2.6,10,'#6d6f73','#c9ced3','chair -.8 -3;chair .8 -3;chair -.8 -1.5;chair .8 -1.5;chair -.8 0;chair .8 0;chair -.8 1.5;chair .8 1.5;chair -.8 3;chair .8 3;window -1.27 -2 90;window -1.27 1 90;window 1.27 -2 -90;window 1.27 1 -90'],
['cabin','Airplane cabin',0,3.6,14,'#6f7a85','#dfe6ee','bench -1.1 -5;bench 1.1 -5;bench -1.1 -3.5;bench 1.1 -3.5;bench -1.1 -2;bench 1.1 -2;bench -1.1 -.5;bench 1.1 -.5;bench -1.1 1;bench 1.1 1;window -1.77 -4 90;window -1.77 -1 90;window 1.77 -4 -90;window 1.77 -1 -90'],
['barn','Barn',0,10,8,'#8a6b3f','#7d5a35','hay -3.5 -2.5;hay -2 -3;hay -3 -1.2;cow 2 -2;cow 3.5 1 180;cart 0 2;crate 4.3 -3;rack -4.3 2.5 90'],
['restkitchen','Commercial kitchen',0,8,6,'#b3b7bb','#e9ecee','counter -3 -2.5 0 1;counter 0 -2.5 0 1;counter 3 -2.5 0 1;stove -2 2.4 180;stove 0 2.4 180;stove 2 2.4 180;counter 0 0 0 1;fridge 3.6 .5;rack -3.6 0 90;sink 3.5 2.4 180'],
['artroom','Art studio',0,7,6,'#c7b79d','#f2ede4','painting 0 -2.97 0 1.8;painting -2.2 -2.97;painting 2.2 -2.97;table 0 .3 0 1.2;stool -.9 1.3;stool .9 1.3;rug 0 .3;plant 3 2.5;window 3.47 0 -90'],
['junction','Busy junction',1,30,30,'#3a3d42','','road 0 0;road 0 0 90;signal 3.2 3.2;signal -3.2 -3.2 180;car -6 -1.3;car 7 1.3 180;car 1.3 8 90;bus -9 1.3 180;build -12 -12 0 1.3;build 12 -12;build -12 12 180;build 12 12 180;sign 4 -3.5;bin -3.5 3.5;lamp 3.6 -3.6'],
['alley','Narrow alley',1,10,30,'#4b4b4f','','build -4.5 -10 90 1.1;build -4.5 0 90 1.1;build -4.5 10 90 1.1;build 4.5 -10 -90 1.1;build 4.5 0 -90 1.1;build 4.5 10 -90 1.1;bin 1.8 -3;crate -.9 4;crate -.4 4.6;lamp 1 6'],
['palace','Palace courtyard',1,30,30,'#c9b79a','','pillar -6 -6;pillar 6 -6;pillar -6 6;pillar 6 6;pillar -10 -6;pillar 10 -6;gopuram 0 -13 0 1.6;fountain 0 0 0 1.2;statue -9 3;statue 9 3;tree -12 8;tree 12 8;lamp -4 4;lamp 4 4'],
['gate','Temple gateway',1,30,30,'#b9a58a','','gopuram 0 -9 0 1.8;pillar -5 -3;pillar 5 -3;pillar -5 3;pillar 5 3;stall -9 4 90;stall 9 4 -90;tree -11 -8;tree 11 -8;lamp -3 5;lamp 3 5'],
['ghat','River ghat',1,30,30,'#c4b295','','water 0 -12 0 1.3;stairs -6 -3 0 3;stairs 0 -3 0 3;stairs 6 -3 0 3;boat -4 -8;boat 5 -9 10;palm -11 2;palm 11 4;rock 9 -3;pillar -9 -1;pillar 9 -1'],
['harbour','Harbour',1,36,30,'#8a8f94','','water 0 -13 0 1.6;dock 0 -2;boat -8 -9;boat 6 -8;container -10 5;container -4 7.5 90;container 8 6;crate 2 4;crate 2.8 4.6;lamp -3 1;lamp 6 1;sign 12 2 180;truck 12 8 90'],
['camp','Campsite',1,28,28,'#4f8a4b','','tent -4 -2 20;tent 4 -4 -30;bonfire 0 1.5;bench -2 3 180;bench 2.4 3 150;pine*14;rock 6 3;rock -6 4;bush*6'],
['snow','Snowfield',1,30,30,'#e9f0f5','','pine*14;rock*5;hut 9 -8;pine 4 3;bonfire -3 2'],
['orchard','Orchard',1,30,30,'#6fa24d','','tree*16;hay -6 5;cart 5 3;well 8 -6;bush*6;fence -10 8 90;fence -10 4 90'],
['farm','Farmyard',1,30,30,'#9a8a5a','','hut -8 -9;hay -3 -7;hay -1 -7.6;hay 2 -6.8;cow 3 3 40;cow -4 4 -20;cow 6 5 100;tractor 9 -4 120;well -9 4;fence*6;tree -12 7;tree 11 8;bush*4'],
['coconut','Coconut grove',1,30,30,'#c9b57a','','palm*14;hut 8 -8;hut -9 -7 20;bush*8;rock*3;cart -4 5'],
['tea','Tea plantation',1,30,30,'#4f9a4a','','hedge*14;mount -12 -16 0 1.6;mount 10 -18;tree 6 5;tree -8 7;bench 2 5;hut 11 -7'],
['backwater','Backwaters',1,36,30,'#5f9a5a','','water 0 -12 0 1.3;palm -10 4;palm 10 5;palm -6 6;palm 6 7;palm*6;boat -3 -6;boat 7 -7 -8;dock 0 -2;hut 9 8;bush*5'],
['playground','Kids playground',1,26,26,'#6fae5d','','swing -4 -3;swing 2 -4.5;slide 6 -2 180;bench -7 4 90;bench 8 5 -90;tree -9 -7;tree 9 -8;tree 0 9;bush*6'],
['stadium','Sports ground',1,40,30,'#58a65a','','goal -15 0 90;goal 15 0 -90;fence -8 13;fence -4 13;fence 0 13;fence 4 13;fence 8 13;bench -6 11.5;bench 6 11.5;hoop 18 8 -90;build 0 -20 0 3'],
['petrol','Petrol pump',1,28,28,'#4a4c50','','build 0 -11 0 1.1;lamp -6 -3;lamp 6 -3;sign 11 -6;car -4 2 90;car 5 4 -90;truck 0 9;bin 8 1'],
['toll','Toll plaza',1,34,30,'#44474c','','road 0 0;road 0 6;road 0 -6;barrier -2 -3 90;barrier -2 3 90;barrier -2 9 90;build 0 -12 0 1.2;sign 8 -3;truck -9 0;car 10 6 180;car -11 6;lamp 3 -3;lamp 3 3'],
['college','College campus',1,32,32,'#5fa05a','','build -8 -12 0 1.8;build 8 -12 0 1.8;fountain 0 -3;statue 0 5;tree*10;bench -7 3 90;bench 7 3 -90;bench -7 9 90;bench 7 9 -90;lamp -4 5;lamp 4 5;bush*5'],
['hospext','Hospital entrance',1,30,30,'#8b8f94','','tower -6 -12 0 1.5;build 6 -11 0 1.6;ambulance 8 4 30;ambulance -9 6 -20;bench -4 3;bench 3 6;tree -12 8;tree 12 9;lamp -2 4;lamp 4 -2;sign 9 -3;bin 6 2'],
['policeext','Police station exterior',1,28,28,'#595c61','','build 0 -11 0 1.2;car -5 0 90;car 5 1 -90;sign -8 3;fence -9 -4;fence -9 -8;fence 9 -4;fence 9 -8;tree 11 7;tree -11 6;lamp 6 -4;lamp -6 -4'],
['lakeside','Lakeside',1,32,28,'#6c9a5a','','water 0 -14 0 1.7;dock 0 -3;boat 5 -9;rock*5;tree*10;bench -5 4 180;bench 5 4 180;lamp 0 2;bush*5'],
['festival','Temple festival',1,34,30,'#b49a7a','','gopuram 0 -13 0 1.8;stall -8 -2 90;stall -8 3 90;stall 8 -2 -90;stall 8 3 -90;tent -11 8;tent 11 8;lamp*6;pillar -4 -6;pillar 4 -6;bonfire 0 4;cart 6 7;cart -6 7;tree -13 -9;tree 13 -9'],
['downtown','Downtown skyline',1,36,36,'#303338','','road 0 0;road 0 0 90;tower -14 -14 0 1.3;tower 14 -15 0 1.6;tower -16 14 180 1.4;tower 15 14 180;tower 0 -18 0 1.8;billboard 8 -6;signal 3.2 3.2;signal -3.2 -3.2 180;car -6 -1.3;car 4 1.3 180;car 1.3 -7 90;lamp -3.6 3.6;lamp 3.6 -3.6;lamp -3.6 -8;lamp 8 3.6;bin 3.5 4'],
['suburb','Suburban street',1,34,28,'#444750','','road 0 0;house -9 -7;house 0 -8;house 9 -7;house -9 8 180;house 0 9 180;house 9 8 180;tree -5 -4;tree 5 -4;tree -5 4;tree 5 4;lamp -3 3.5;lamp 4 -3.5;bin -2 -3.5'],
['courtyard','Old house courtyard',1,22,22,'#b9a58a','','house 0 -8 0 1.4;well 5 0;palm -6 2;palm 7 5;plant -3 4;plant 3 6;bench -4 -2;hay -8 4;cart 8 -4 20;fence -9 -3 90;fence 9 -3 90'],
['junkyard','Junkyard',1,28,28,'#6d6454','','container -8 -8;container -2 -9;car -6 2 20;car 4 4 -30;car 8 -2 80;crate*12;rack 9 -7;rack -10 6 90;bin*3;rock*3'],
['quarry','Quarry',1,34,34,'#a69880','','mount -10 -14 0 1.6;mount 10 -16 0 1.8;mount 0 -22 0 2;rock*14;truck -6 5 30;crate 4 3;crate 4.8 3.4;container 10 8'],
['ruins','Ancient ruins',1,32,32,'#a89c80','','pillar -5 -5;pillar 5 -5;pillar -5 5;pillar 5 5;pillar -9 -2;pillar 9 -2;stage 0 -8 0 2;statue 0 0;rock*8;tree -12 8;tree 12 9;palm 10 -10;bush*6'],
['ghatroad','Ghat road',1,36,30,'#6f8f5c','','road 0 0 8;mount -12 -14 0 1.8;mount 10 -17 0 1.6;mount 20 -10;fence -6 3;fence -2 3;fence 2 3;fence 6 3;car 6 -.8;truck -8 1.2 180;rock*8;pine*6;sign 12 4 180'],
['pond','Village pond',1,28,28,'#7aa35a','','water 0 -9 0 1;palm -10 3;palm 9 4;hut -9 -9;hut 8 -9;bench 0 4;bush*8;rock 5 -2;cart -5 7']];
LC.push(...NL.map(([k,n,e,w,d,f,c,p])=>({k,n,e,w,d,f,c,p})));
KW.unshift(['dining','dining'],['nursery|kids room|baby','nursery'],['studio apartment|studio flat','studio'],['attic|loft','attic'],['basement|cellar','basement'],['lab|laboratory','lab'],['operation|surgery','surgery'],['ward','ward'],['lobby|reception','lobby'],['bank','bank'],['airport|terminal','airport'],['metro|subway|underground','metro'],['mall','mall'],['bakery','bakery'],['salon|parlou?r','salon'],['studio|newsroom','newsroom'],['concert|auditorium','concert'],['sanctum|garbhagriha','sanctum'],['wedding|marriage hall|mandapam','wedding'],['interrogation','interrogation'],['lift|elevator','lift'],['stair','stairwell'],['train|compartment|coach','traincoach'],['inside bus|bus interior','buscoach'],['plane|cabin|flight','cabin'],['barn|cowshed','barn'],['art room|painting','artroom'],
['junction|intersection|crossing','junction'],['alley|lane','alley'],['palace|fort','palace'],['gopuram|gateway','gate'],['ghat road|hairpin','ghatroad'],['ghat','ghat'],['harbou?r|port|dock|jetty','harbour'],['college|campus|university','college'],['camp','camp'],['snow|ice','snow'],['orchard','orchard'],['farm','farm'],['coconut|grove','coconut'],['tea estate|plantation','tea'],['backwater','backwater'],['playground','playground'],['stadium|cricket|sports','stadium'],['petrol|fuel|gas station','petrol'],['toll','toll'],['hospital entrance|ambulance','hospext'],['police station','policeext'],['lake','lakeside'],['festival|jatra|fair','festival'],['downtown|skyline|city center','downtown'],['suburb|colony','suburb'],['courtyard|veranda','courtyard'],['junkyard|scrap','junkyard'],['quarry|mine','quarry'],['ruins|ancient','ruins'],['pond','pond']);
const LK=k=>LC.find(x=>x.k==k)||LC[0];
function guess(c){const t=(c.loc||'').toLowerCase();for(const[r,k]of KW){if(new RegExp('\\b(?:'+r+')').test(t)){const L=LK(k);if(c.io=='INT./EXT.'||(c.io=='EXT.')==!!L.e)return k}}return c.io=='EXT.'?'street':'living'}
const mk=(p,t,fov,roll)=>{const dx=p[0]-t[0],dy=p[1]-t[1],dz=p[2]-t[2],d=Math.hypot(dx,dy,dz)||.05;return{tx:t[0],ty:t[1],tz:t[2],yaw:Math.atan2(dx,dz),pitch:Math.asin(dy/d),dist:d,fov,roll:roll||0}};
function preset(t){const L=LK(W.loc),cs=W.chars,a=cs.find(c=>c.id==W.sel)||cs[0],b=cs.find(c=>c!==a),X=a?a.x:0,Z=a?a.z:0,r=a?a.r*D:0,fx=Math.sin(r),fz=Math.cos(r),M=Math.max(L.w,L.d),at=(d,h,y,f,ro)=>mk([X+fx*d,h,Z+fz*d],[X,y,Z],f,ro);let ux=fx,uz=fz;if(b){const l=Math.hypot(b.x-X,b.z-Z)||1;ux=(b.x-X)/l;uz=(b.z-Z)/l}
switch(t){case'est':return mk([M*.55,L.e?7:2.8,M*.6],[0,1,0],60);case'wide':return mk([0,1.7,L.e?M*.5:L.d*.45],[0,1,0],55);case'full':return at(4.5,1.3,.9,40);case'med':return at(2.6,1.45,1.25,35);case'mcu':return at(1.8,1.5,1.4,32);case'cu':return at(1.15,1.58,1.55,28);case'ecu':return at(.55,1.62,1.62,24);case'low':return at(3,.25,1.2,50);case'high':return at(2.4,3.6,.9,45);case'dutch':return at(2.6,1.45,1.25,35,.26);case'bird':return mk([X+.01,10,Z+.6],[X,0,Z],50);case'pov':return mk([X,1.62,Z],[X+fx*.05,1.62,Z+fz*.05],60);case'ots':return mk([X-ux*1.1-uz*.3,1.65,Z-uz*1.1+ux*.3],[b?b.x:X+ux*2,1.5,b?b.z:Z+uz*2],38);case'two':{const mx=b?(X+b.x)/2:X,mz=b?(Z+b.z)/2:Z;return mk([mx-uz*4,1.5,mz+ux*4],[mx,1.3,mz],40)}}
return mk([0,1.7,4],[0,1,0],50)}
const lerpP=(a,b,t)=>{const o={};for(const k in b){if(k=='yaw'){const d=((b.yaw-a.yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;o.yaw=a.yaw+d*t}else o[k]=(a[k]||0)+(b[k]-(a[k]||0))*t}return o};
/* ---- 3D building ---- */
/* ===== realism upgrade: PBR materials, procedural textures, sky/env lighting, rounded geometry ===== */
const TX={},GEO={},ph=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h},rnd=()=>(sr=sr*16807%2147483647)/2147483647;
const TOPC={day:'#3f86d8',night:'#01030c',evening:'#41568f',dawn:'#6a8bd0',dusk:'#241c55'};
function tex(k,rx,ry){const id=k+(rx||1)+'x'+(ry||1);if(TX[id])return TX[id];let c=TX[k];if(!c){const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d'),sp=(n,s,o)=>{for(let i=0;i<n;i++){x.globalAlpha=Math.random()*o;x.fillStyle=Math.random()<.5?'#000':'#fff';x.fillRect(Math.random()*256,Math.random()*256,s*(.5+Math.random()),s*(.5+Math.random()))}x.globalAlpha=1},ln=(a,b,w,h,o)=>{x.globalAlpha=o;x.fillStyle='#000';x.fillRect(a,b,w,h);x.globalAlpha=1};
x.fillStyle='#e6e6e6';x.fillRect(0,0,256,256);
if(k=='wood'){for(let i=0;i<256;i+=3)ln(0,i,256,1+Math.random()*2,.08+Math.random()*.15);sp(200,4,.1)}
else if(k=='plank'){for(let i=0;i<256;i+=3)ln(0,i,256,1,.06+Math.random()*.1);for(let i=0;i<256;i+=64){ln(0,i,256,2,.55);ln(Math.random()*256,i,2,64,.5)}}
else if(k=='tile'){for(let i=0;i<256;i+=128){ln(0,i,256,2,.5);ln(i,0,2,256,.5)}sp(300,10,.05)}
else if(k=='brick'){for(let r=0;r<8;r++){ln(0,r*32,256,2,.6);for(let b=0;b<4;b++)ln((b*64+(r%2)*32)%256,r*32,2,32,.6)}sp(900,4,.14)}
else if(k=='grass')sp(1800,3,.22);else if(k=='asph')sp(4000,2,.3);else if(k=='sand')sp(2500,2,.12);
else if(k=='fab'){for(let i=0;i<256;i+=2){ln(0,i,256,1,.07);ln(i,0,1,256,.07)}}else sp(1200,5,.06);
c=TX[k]=new T.CanvasTexture(cv)}
const t=c.clone();t.needsUpdate=true;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx||1,ry||1);if(R)t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());return TX[id]=t}
function mat(c,pt){if(c=='*win')return new T.MeshBasicMaterial({color:'#9fd4ff'});if(c[0]=='*')return new T.MeshBasicMaterial({color:c.slice(1)});
let tx=0,mt=0;if(c[0]=='@'){const i=c.indexOf('#');tx=c.slice(1,i);c=c.slice(i)}else if(c[0]=='~'){mt=1;c=c.slice(1)}else if(c[0]=='%'){mt=2;c=c.slice(1)}
const h={};new T.Color(c).getHSL(h);if(!tx&&!mt){if(h.s>.22&&h.l<.55&&h.h>.2&&h.h<.45&&pt!='b')tx='grass';else if(h.s>.25&&h.l<.5&&h.h>.03&&h.h<.12)tx='wood'}
return new T.MeshStandardMaterial({color:c,roughness:mt==1?.32:mt==2?.2:tx=='grass'?.95:.7,metalness:mt==1?.85:0,map:tx?tex(tx):null,envMapIntensity:EI})}
function rb(w,h,d){const r=Math.min(.035,Math.min(w,h,d)*.3),g=new T.BoxGeometry(w,h,d,2,2,2),p=g.attributes.position,nm=g.attributes.normal,v=new T.Vector3(),q=new T.Vector3(),hx=w/2-r,hy=h/2-r,hz=d/2-r;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);q.set(cl(v.x,-hx,hx),cl(v.y,-hy,hy),cl(v.z,-hz,hz));v.sub(q);if(v.lengthSq()>1e-9){v.normalize();nm.setXYZ(i,v.x,v.y,v.z);q.addScaledVector(v,r)}p.setXYZ(i,q.x,q.y,q.z)}return g}
function geo(t,a,b,c){const key=t+a+'|'+b+'|'+c;return GEO[key]||(GEO[key]=t=='b'?rb(a,b,c):t=='c'?new T.CylinderGeometry(a,a,b,20):t=='k'?new T.ConeGeometry(a,b,20):t=='w'||t=='v'?new T.CylinderGeometry(a,a,b,24):new T.SphereGeometry(a,24,16))}
const LT={lamp:[4.1,14,0xffe2a8],flamp:[1.6,7,0xffe2a8],chand:[2.4,9,0xffe2a8],bonfire:[.8,10,0xff9a3c]};
function prop(kind,x,z,rot,s,y){const g=new T.Group();(K[kind]||[]).forEach(([t,a,b,c,col,px,py,pz])=>{const m=new T.Mesh(geo(t,a,b,c),mat(col,t));if(col=='*win')WIN.push(m);if(t=='w')m.rotation.x=Math.PI/2;if(t=='v')m.rotation.z=Math.PI/2;m.position.set(px,py,pz);m.castShadow=m.receiveShadow=col[0]!='*';g.add(m)});g.position.set(x,y||0,z);g.rotation.y=rot*D;g.scale.setScalar(s);ENV.add(g);
if(LT[kind]&&LAMP.length<7){const[h,d,c]=LT[kind],l=new T.PointLight(c,0,d);l.position.set(x,(y||0)+h*s,z);l.userData.on=kind=='chand'||kind=='bonfire';ENV.add(l);LAMP.push(l)}}
const fx=(col,e)=>{const h={};new T.Color(col).getHSL(h);return h.s>.2&&h.h>.2&&h.h<.45?'grass':h.s>.12&&h.h>.04&&h.h<.14?(e?'sand':'plank'):h.l<.4?(e?'asph':'conc'):(h.l>.62&&!e?'tile':'conc')};
function build(){if(ENV)SC.remove(ENV);WIN.length=LAMP.length=0;ENV=new T.Group();const k=LK(W.loc);EI=k.e?1:.35;sr=ph(W.loc)%2147483646+1;
if(k.e){const g=new T.Mesh(new T.PlaneGeometry(800,800),new T.MeshStandardMaterial({color:k.f,roughness:1,map:tex(fx(k.f,1),160,160),envMapIntensity:.6}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;ENV.add(g);
if(W.loc!='beach')for(let i=0;i<12;i++){const a=i/12*6.283+rnd()*.3,h=new T.Mesh(new T.SphereGeometry(28+rnd()*30,20,12),mat('#'+new T.Color(k.f).lerp(new T.Color('#6f8fa8'),.55).getHexString(),'s'));h.position.set(Math.cos(a)*150,-8,Math.sin(a)*150);h.scale.y=.45+rnd()*.3;ENV.add(h)}}
else{const m=(c,rx,ry,tx)=>new T.MeshStandardMaterial({color:c,side:T.BackSide,roughness:.9,map:tx?tex(tx,rx,ry):null,envMapIntensity:EI}),w1=m(k.c,k.d/3,1,'wall'),w2=m(k.c,k.w/3,1,'wall'),s=new T.Mesh(new T.BoxGeometry(k.w,3,k.d),[w1,w1,m('#f4f4f4'),m(k.f,k.w/2,k.d/2,fx(k.f,0)),w2,w2]);s.position.y=1.5;s.receiveShadow=true;ENV.add(s);
[[k.w,k.d,0,-k.d/2+.015],[k.w,.03,0,k.d/2-.015],[.03,k.d,-k.w/2+.015,0],[.03,k.d,k.w/2-.015,0]].forEach(([a,b,x,z],i)=>{const t=new T.Mesh(new T.BoxGeometry(a,.12,i==0?.03:b),mat('#f3f1ec','b'));t.position.set(x,.06,z);ENV.add(t)})}
k.p.split(';').filter(Boolean).forEach(t=>{const q=t.split(' '),m=q[0].split('*');if(m[1]){for(let i=0;i<+m[1];i++){let x,z,n=0;do{x=(rnd()-.5)*(k.w-3);z=(rnd()-.5)*(k.d-3)}while(k.e&&Math.abs(x)<3.5&&Math.abs(z)<3.5&&n++<9);prop(m[0],x,z,rnd()*360,.8+rnd()*.5,0)}}else prop(q[0],+q[1],+q[2],+(q[3]||0),+(q[4]||1),+(q[5]||0))});SC.add(ENV);tod()}
function initSky(){skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new T.Color()},hor:{value:new T.Color()},sc:{value:new T.Color()},sun:{value:new T.Vector3(0,1,0)}},vertexShader:'varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 v;uniform vec3 top,hor,sc,sun;void main(){vec3 d=normalize(v);float h=clamp(d.y,0.,1.);vec3 c=mix(hor,top,pow(h,.5));float s=max(dot(d,normalize(sun)),0.);c+=sc*(pow(s,700.)*4.+pow(s,10.)*.3);gl_FragColor=vec4(c,1.);}'});
SKY=new T.Mesh(new T.SphereGeometry(450,24,16),skyMat);SKY.frustumCulled=false;SKY.renderOrder=-1;SC.add(SKY);SKY.userData.h=new T.HemisphereLight(0xffffff,0x666666,.5);SC.add(SKY.userData.h);
const sp=new Float32Array(1500);for(let i=0;i<500;i++){const a=Math.random()*6.283,b=Math.acos(Math.random()*.9+.1);sp[i*3]=430*Math.sin(b)*Math.cos(a);sp[i*3+1]=430*Math.cos(b);sp[i*3+2]=430*Math.sin(b)*Math.sin(a)}
const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp,3));STARS=new T.Points(sg,new T.PointsMaterial({color:'#ffffff',size:1.6,sizeAttenuation:false,fog:false,transparent:true,opacity:.85,depthWrite:false}));SKY.add(STARS);
const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d'),gr=x.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);const ct=new T.CanvasTexture(cv);CLOUDS=new T.Group();
for(let i=0;i<16;i++){const s=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,depthWrite:false,fog:false,opacity:.5})),a=Math.random()*6.283,r=250+Math.random()*80;s.position.set(Math.cos(a)*r,70+Math.random()*60,Math.sin(a)*r);s.scale.set(120+Math.random()*80,50+Math.random()*30,1);CLOUDS.add(s)}SKY.add(CLOUDS)}
function envMap(){const h=SKY.userData.h,k=LK(W.loc),n=W.tod=='night',c=new T.Color(TOPC[W.tod]).lerp(new T.Color(TD[W.tod][1]),.55);h.color.copy(c);h.groundColor.set(n?'#10131f':'#6a6458');h.intensity=({day:.7,dawn:.5,evening:.42,dusk:.34,night:.22})[W.tod]*(k.e?1:.55)}
function tod(){const t=TD[W.tod],k=LK(W.loc),n=W.tod=='night',dk=n||W.tod=='dusk'||W.tod=='evening';R.setClearColor(t[1]);SC.fog=new T.Fog(t[1],k.e?60:90,k.e?260:220);sunL.color.set(t[2]);sunL.intensity=t[3]*1.25;sunL.position.set(...t[4]);amb.intensity=t[5]*(k.e?.3:.7);amb.color.set(n?'#8fa3ff':'#ffffff');roomL.visible=!k.e;roomL.intensity={day:.3,dawn:.5,evening:.7,dusk:.9,night:1.1}[W.tod];
LAMP.forEach(l=>l.intensity=l.userData.on?(n?1.4:.8):n?1.6:dk?1:0);WIN.forEach(m=>m.material.color.set(n?'#2a4278':t[1]));
const u=skyMat.uniforms;u.top.value.set(TOPC[W.tod]);u.hor.value.set(t[1]);u.sc.value.set(t[2]);u.sun.value.set(...t[4]);SKY.visible=!!k.e;STARS.visible=n||W.tod=='dusk';CLOUDS.visible=!n;CLOUDS.children.forEach(s=>s.material.color.set(dk?'#d9a58a':'#ffffff'));envMap()}
/* ===== characters: rigged, shaped, many looks ===== */
const MK=['m','bizm','vilm','hood','tchm','drv'],FK=['f','bizf','vilf','tour','fash','tchr'];
/* name, gender, top, bottom, skin, hair style, hair colour, outfit, accessories (g glasses, b beard, s moustache, p bindi), scale */
const ARC={m:['Man','m','#2f6fb5','#2c3550','#c68642','short','#1d1d1d','shirt',''],f:['Woman','f','#d6455d','#2c3550','#c68642','long','#1a100c','dress',''],
doc:['Doctor','m','#f4f6f8','#3b4a6b','#c68642','side','#1d1d1d','coat','g'],nurse:['Nurse','f','#7fc8c0','#7fc8c0','#a16a3f','bun','#1a100c','dress',''],
cop:['Police officer','m','#8a7a4f','#6e6240','#a16a3f','cap','#1d1d1d','unif','s'],cope:['Policewoman','f','#8a7a4f','#6e6240','#c68642','pony','#1a100c','unif',''],
tchr:['Teacher (saree)','f','#8c4a7a','#8c4a7a','#c68642','bun','#1a100c','saree','p'],tchm:['Teacher (man)','m','#e8e2d0','#3a3a44','#c68642','side','#2a2a2a','shirt','g'],
stm:['Student boy','m','#e8eef7','#2b3f8f','#a16a3f','short','#111111','shirt',''],stf:['Student girl','f','#e8eef7','#2b3f8f','#c68642','pony','#111111','unif',''],
kidb:['Boy','m','#e6a23c','#3b5c8f','#a16a3f','crop','#111111','tee','','.6'],kidg:['Girl','f','#e75a8f','#e75a8f','#c68642','pony','#111111','dress','','.6'],
bizm:['Businessman','m','#23262e','#23262e','#c68642','side','#111111','suit',''],bizf:['Businesswoman','f','#3b4a6b','#3b4a6b','#a16a3f','bob','#111111','suit',''],
oldm:['Old man','m','#e9e4d2','#f2f2f2','#8d5524','bald','#cfcfcf','kurta','gb','.96'],oldf:['Old woman','f','#7b3f6e','#7b3f6e','#8d5524','bun','#d8d8d8','saree','p','.93'],
farm:['Farmer','m','#e8e4dc','#f2f2f2','#8d5524','turban','#c0392b','dhoti','s'],vilm:['Villager','m','#6b8f9a','#f2f2f2','#a16a3f','short','#111111','dhoti','s'],
vilf:['Villager (woman)','f','#2f8f46','#2f8f46','#8d5524','bun','#111111','saree','p'],shop:['Shopkeeper','m','#c9b037','#f2f2f2','#a16a3f','side','#111111','kurta','s'],
chef:['Chef','m','#f6f6f6','#2a2a2a','#c68642','toque','#111111','coat','s'],wait:['Waiter','m','#f0f0f0','#1d1d1d','#a16a3f','side','#111111','shirt',''],
lawy:['Lawyer','m','#1a1a1a','#1a1a1a','#a16a3f','side','#111111','suit','g'],judge:['Judge','m','#111111','#111111','#6b4226','bald','#cfcfcf','robe','g'],
prst:['Priest','m','#f08a24','#f08a24','#8d5524','bald','#111111','robe','bp'],sold:['Soldier','m','#5b6b3a','#4b5a30','#a16a3f','crop','#111111','unif',''],
thug:['Thug','m','#2a2a2a','#1c1c1c','#8d5524','crop','#111111','hoodie','s'],det:['Detective','m','#7a6a55','#3a3a3a','#c68642','fedora','#222222','coat','s'],
drv:['Driver','m','#6b7f9a','#2c3550','#a16a3f','short','#111111','tee',''],wrk:['Worker','m','#e0902a','#2c3550','#8d5524','helmet','#111111','tee',''],
athl:['Athlete','f','#d6455d','#222222','#a16a3f','pony','#111111','tee',''],mus:['Musician','m','#6b3fa0','#222222','#c68642','long','#111111','shirt','b'],
tour:['Tourist','f','#ffd166','#3b6fb5','#f1c7a0','long','#8a5a2b','tee','g'],hood:['Teen (hoodie)','m','#555555','#222222','#e0ac82','short','#3a2a1a','hoodie',''],
fash:['Fashion woman','f','#8e44ad','#8e44ad','#f1c7a0','long','#d4a017','dress',''],bride:['Bride','f','#c0392b','#c0392b','#a16a3f','bun','#111111','saree','p'],groom:['Groom','m','#f3e3c3','#f3e3c3','#a16a3f','short','#111111','kurta','s']};
const POSES=[['stand','Standing'],['talk','Talking'],['walk','Walking'],['run','Running'],['sit','Sitting'],['wave','Waving'],['point','Pointing'],['phone','On phone'],['cross','Arms crossed']];
const PO=s=>POSES.map(([k,n])=>`<option value="${k}" ${k==s?'selected':''}>${n}</option>`).join(''),AO=s=>Object.keys(ARC).map(k=>`<option value="${k}" ${k==s?'selected':''}>${ARC[k][0]}</option>`).join('');
const LOOK=c=>{const a=ARC[c.k]||ARC[c.g=='f'?'f':'m'];return{g:c.g,sh:c.c||a[2],bt:a[3],sk:a[4],hs:a[5],hc:a[6],o:a[7],ac:a[8],sc:+(a[9]||1)}};
function mkChar(c){const L=LOOK(c),f=L.g=='f',o=L.o,g=new T.Group(),rt=new T.Group(),J={hp:[],kn:[],sh:[],el:[],eyes:[]};g.add(rt);g.userData.id=c.id;
const MT=(col,r,m)=>new T.MeshStandardMaterial({color:col,roughness:r==null?.8:r,metalness:m||0,envMapIntensity:.6}),DM=col=>{const m=MT(col,.9);m.side=T.DoubleSide;return m},sk=MT(L.sk,.6),shm=MT(L.sh,.88),btm=MT(L.bt,.85),hr=MT(L.hc,.9),
M=(ge,m,x,y,z,p,sx,sy,sz)=>{const e=new T.Mesh(ge,m);e.position.set(x,y,z);if(sx)e.scale.set(sx,sy,sz);e.castShadow=true;(p||rt).add(e);return e},
S=(r,a,b)=>new T.SphereGeometry(r,a||16,b||12),jn=(p,x,y,z)=>{const j=new T.Group();j.position.set(x,y,z);p.add(j);return j},lt=pts=>new T.LatheGeometry(pts.map(q=>new T.Vector2(q[0],q[1])),24),
limb=(p,r1,r2,len,m)=>{const ge=new T.CylinderGeometry(r1,r2,len,14);ge.translate(0,-len/2,0);M(ge,m,0,0,0,p);M(S(r1,14,10),m,0,0,0,p)};
const lng=o=='saree'||o=='dhoti'||o=='robe',SL=o!='dress',LS=['shirt','coat','suit','hoodie','unif','robe','kurta'].includes(o),skirtLeg=o=='dress'||(o=='suit'&&f)||lng,lm=skirtLeg?sk:btm;g.userData.lng=lng;
J.pv=jn(rt,0,.93,0);J.sp=jn(J.pv,0,.05,0);
M(S(.17,18,12),skirtLeg?shm:btm,0,-.03,0,J.sp,1,.72,.78);
M(lt(f?[[0,.04],[.15,.05],[.17,.12],[.135,.24],[.15,.4],[.16,.48],[.1,.54],[.05,.57],[0,.58]]:[[0,.04],[.165,.05],[.18,.1],[.16,.24],[.185,.38],[.2,.46],[.13,.53],[.055,.56],[0,.58]]),shm,0,0,0,J.sp,1,1,.64);
const skirt=(hem,rh,m)=>M(lt([[0,.02],[.17,.02],[.2,-.1],[rh,hem]]),m,0,0,0,J.sp);
if(o=='dress')skirt(-.5,.3,DM(L.sh));else if(o=='saree')skirt(-.93,.27,DM(L.sh));else if(o=='dhoti')skirt(-.93,.27,DM(L.bt));else if(o=='coat')skirt(-.62,.25,DM(L.sh));else if(o=='robe')skirt(-.9,.3,DM(L.sh));else if(o=='kurta')skirt(-.55,.22,DM(L.sh));else if(o=='suit'&&f)skirt(-.45,.22,DM(L.bt));
if(o=='suit'||o=='coat'){M(new T.BoxGeometry(.09,.3,.01),MT('#f4f4f4'),0,.36,.128,J.sp)}if(o=='suit'&&!f)M(new T.BoxGeometry(.04,.22,.012),MT('#8b1d2c'),0,.34,.134,J.sp);
if(o=='saree'){const p=M(new T.BoxGeometry(.1,.58,.012),MT('#e8b04a'),.02,.3,.13,J.sp);p.rotation.z=.5}if(o=='hoodie')M(S(.1),shm,0,.58,-.1,J.sp,1.3,.8,.8);if(o=='unif'&&L.sh=='#8a7a4f')M(new T.BoxGeometry(.05,.05,.01),MT('#d4af37'),.08,.38,.13,J.sp);
const shoe=MT(lng?'#6b4a2b':'#1b1b1b',.5);
[-1,1].forEach((sx,i)=>{const hp=J.hp[i]=jn(J.pv,sx*.09,0,0);limb(hp,.082,.06,.46,lm);const kn=J.kn[i]=jn(hp,0,-.46,0);limb(kn,.058,.042,.43,lm);M(S(.06,12,10),shoe,0,-.44,.05,kn,.9,.6,2);
const sh=J.sh[i]=jn(J.sp,sx*(f?.2:.25),.47,0);limb(sh,.052,.042,.3,SL?shm:sk);const el=J.el[i]=jn(sh,0,-.3,0);limb(el,.042,.033,.27,LS?shm:sk);M(S(.04,12,10),sk,0,-.29,0,el,1,1.2,.8)});
J.nk=jn(J.sp,0,.56,0);M(new T.CylinderGeometry(.048,.055,.1,12),sk,0,.04,0,J.nk);const hd=J.hd=jn(J.nk,0,.07,0);
M(S(.112,26,20),sk,0,.1,0,hd,.92,1.12,1.02);M(S(.08,18,14),sk,0,.045,.025,hd,1,.85,1);M(S(.02,10,8),sk,0,.088,.112,hd,1,1.3,1.4);
[-1,1].forEach(sx=>{M(S(.02,8,8),sk,sx*.103,.1,-.005,hd,.5,1.2,.9);const w=M(S(.016,10,8),MT('#f4f4f4',.3),sx*.04,.115,.098,hd,1,.85,.6);J.eyes.push(w);M(S(.01,8,8),MT('#2a1a10',.3),0,0,.016,w,1,1,.5);const b=M(new T.BoxGeometry(.05,.009,.01),hr,sx*.042,.145,.103,hd);b.rotation.z=-sx*.1});
M(new T.BoxGeometry(.04,.008,.01),MT(f?'#c0504d':'#8f4a43',.4),0,.04,.106,hd);
const dome=(r,a,m,y)=>M(new T.SphereGeometry(r,24,16,0,Math.PI*2,0,Math.PI*a),m||hr,0,y||.108,-.006,hd,.93,1.12,1.06),back=()=>M(S(.112,16,12),hr,0,.085,-.03,hd,.95,1.02,.95),hs=L.hs;
if(hs=='short'||hs=='side'||hs=='crop'){dome(.118,.42);back()}else if(hs=='long'){dome(.118,.42);back();M(new T.BoxGeometry(.22,.4,.07),hr,0,-.05,-.1,hd);[-1,1].forEach(sx=>M(new T.BoxGeometry(.04,.3,.1),hr,sx*.105,.0,-.03,hd))}
else if(hs=='bun'){dome(.118,.42);back();M(S(.055),hr,0,.23,-.07,hd)}else if(hs=='pony'){dome(.118,.42);back();const t=M(new T.CylinderGeometry(.028,.012,.3,8),hr,0,.1,-.15,hd);t.rotation.x=.5}
else if(hs=='bob'){dome(.12,.45);back();M(S(.13),hr,0,.04,-.03,hd,1,.85,.9)}else if(hs=='afro')M(S(.16),hr,0,.12,-.01,hd,1,1,1.05);
else if(hs=='cap'){dome(.124,.5,MT(L.sh),.115);M(new T.BoxGeometry(.14,.01,.1),MT(L.sh),0,.15,.13,hd)}else if(hs=='turban')M(S(.135),MT(L.hc),0,.15,0,hd,1,.8,1.05);
else if(hs=='fedora'){M(new T.CylinderGeometry(.2,.2,.01,24),MT('#4a3a2a'),0,.19,0,hd);M(new T.CylinderGeometry(.1,.11,.09,20),MT('#4a3a2a'),0,.24,0,hd);back()}
else if(hs=='helmet')dome(.13,.5,MT('#f2c200',.4),.115);else if(hs=='toque'){M(new T.CylinderGeometry(.09,.1,.16,18),MT('#fafafa'),0,.28,0,hd);M(S(.1),MT('#fafafa'),0,.36,0,hd,1,.7,1)}
const ac=L.ac;if(ac.includes('b'))M(S(.075,16,12),hr,0,.025,.045,hd,1.1,.85,.9);if(ac.includes('s'))M(new T.BoxGeometry(.07,.014,.02),hr,0,.068,.112,hd);
if(ac.includes('g')){[-1,1].forEach(sx=>M(new T.TorusGeometry(.027,.0025,6,18),MT('#222222',.4,.5),sx*.04,.115,.112,hd));M(new T.BoxGeometry(.02,.003,.003),MT('#222222'),0,.118,.112,hd)}
if(ac.includes('p'))M(S(.008,8,8),MT('#c0392b'),0,.15,.114,hd);
const ring=new T.Mesh(new T.RingGeometry(.4,.47,32),new T.MeshBasicMaterial({color:'#14c98a',side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.02;ring.name='ring';g.add(ring);g.scale.setScalar(L.sc*(f?.93:.96));g.userData.J=J;return g}
function sync(){const ids=new Set(W.chars.map(c=>c.id));for(const id in CH)if(!ids.has(id)){SC.remove(CH[id]);delete CH[id]}
W.chars.forEach(c=>{const sg=JSON.stringify(LOOK(c));let g=CH[c.id];if(g&&g.userData.sig!=sg){SC.remove(g);g=null}if(!g){g=CH[c.id]=mkChar(c);g.userData.sig=sg;SC.add(g)}g.position.set(c.x,0,c.z);g.rotation.y=c.r*D})}
function animate(now){const t=now/1e3;W.chars.forEach(c=>{const g=CH[c.id];if(!g)return;const J=g.userData.J,p=c.p||'stand',q=ph(c.id)%628/100,w=t+q,lg=g.userData.lng?.5:1,mv=(p=='walk'||p=='run')&&!(DRGON&&W.sel==c.id);
const H=[0,0],KN=[0,0],S=[[0,-.1],[0,.1]],E=[[-.15,0],[-.15,0]];let py=.93,lean=0,tz=0,nodY=Math.sin(w*.5)*.12,nodX=0;const br=Math.sin(w*1.7)*.012;
if(p=='walk'||p=='run'){const rn=p=='run',om=rn?10:6.5,s=Math.sin(w*om),co=Math.cos(w*om),a=(rn?.95:.55)*lg,sw=rn?.9:.5;H[0]=-s*a;H[1]=s*a;KN[0]=Math.max(0,co)*(rn?1.5:.9)*lg;KN[1]=Math.max(0,-co)*(rn?1.5:.9)*lg;S[0]=[s*sw,-.08];S[1]=[-s*sw,.08];E[0]=E[1]=[rn?-1.5:-.4,0];py=.91+Math.abs(co)*(rn?.05:.03);lean=rn?.2:.04;nodY=0}
else if(p=='sit'){H[0]=H[1]=-1.5;KN[0]=KN[1]=1.5;py=.52;S[0]=[-.45,-.1];S[1]=[-.45,.1];E[0]=E[1]=[-.9,0]}
else if(p=='talk'){S[1]=[-.7+Math.sin(w*2.5)*.25,.3];E[1]=[-1.2+Math.sin(w*3.1)*.3,0];S[0]=[-.3+Math.sin(w*2)*.15,-.15];E[0]=[-.9,0];nodX=Math.sin(w*3)*.05}
else if(p=='wave'){S[1]=[0,2.5];E[1]=[0,Math.sin(w*9)*.5]}
else if(p=='cross'){S[0]=[-.6,.35];S[1]=[-.6,-.35];E[0]=[-2.2,.4];E[1]=[-2.2,-.4]}
else if(p=='phone'){S[1]=[-.6,.5];E[1]=[-2.3,-.2];tz=.12}
else if(p=='point'){S[1]=[-1.5,.15];E[1]=[-.1,0]}
else{S[0][0]=br*3;S[1][0]=-br*3}
let X=c.x,Z=c.z,ry=c.r;
if(mv){const rn=p=='run',A=rn?3.5:2,v=rn?3.2:1.2,u=((t+q)*v)%(4*A),fw=u<2*A,d=fw?u-A:3*A-u,r=c.r*D;X+=Math.sin(r)*d;Z+=Math.cos(r)*d;const tg=c.r+(fw?0:180),cur=g.userData.hd==null?tg:g.userData.hd,df=((tg-cur+540)%360)-180;g.userData.hd=cur+df*.18;ry=g.userData.hd}else g.userData.hd=null;
g.position.set(X,0,Z);g.rotation.y=ry*D;J.pv.position.y=py;J.sp.rotation.x=lean+br;
for(let i=0;i<2;i++){J.hp[i].rotation.x=H[i];J.kn[i].rotation.x=KN[i];J.sh[i].rotation.set(S[i][0],0,S[i][1]);J.el[i].rotation.set(E[i][0],0,E[i][1])}
J.nk.rotation.set(nodX-lean*.5,nodY,tz);const bl=((t*.8+q)%4)<.1?.1:1;J.eyes.forEach(e=>e.scale.y=.85*bl)})}
const MCAST=(s,sid)=>{const sc=scenes(s),i=sc.find(x=>x.sid==sid).i,l=[];for(let j=i+1;j<s.blocks.length;j++){const b=s.blocks[j];if(b.t=='scene')break;if(b.t=='char'){const n=b.x.replace(/\(.*?\)/g,'').trim();if(n&&!l.includes(n))l.push(n)}}return l};
const CR={hospital:'doc nurse nurse oldm vilf',ward:'doc nurse nurse oldm vilf',class:'stm stf stf stm tchr',restaurant:'wait wait bizm bizf vilm vilf',cafe:'wait vilm bizf tour stm',court:'lawy lawy judge cop',police:'cop cop cope thug',market:'shop vilm vilf vilf farm kidg',temple:'prst vilm vilf oldf oldm',tcourt:'prst vilm vilf oldf kidb',gate:'prst vilm vilf oldf kidb',festival:'prst vilm vilf kidb kidg tour',paddy:'farm farm vilf',farm:'farm farm vilf kidb',village:'vilm vilf oldm kidb kidg farm',street:'m f bizm bizf stm hood tour',junction:'m f bizm bizf stm hood drv',park:'f m kidb kidg oldm tour athl',rail:'m f vilm vilf tour drv',bus:'m f vilm vilf stm stf',college:'stm stf stf stm tchm tchr',playground:'kidb kidg kidb kidg f',wedding:'bride groom oldf oldm vilf vilm kidg',mall:'f m tour fash hood bizf',airport:'tour bizm bizf m f drv',bank:'bizm bizf oldm vilf',lobby:'bizm bizf tour wait',concert:'mus mus fash hood f m',harbour:'wrk wrk drv m',constr:'wrk wrk wrk drv'},CRD='m f bizm bizf vilm vilf stm stf hood tour';
let UID=0;const mkc=(k,n,x,z,r,p,bg)=>{const a=ARC[k];return{id:'c'+Date.now()+'_'+(UID++),g:a[1],n:n||a[0],c:a[2],k,x,z,r,p:p||'stand',bg:bg?1:0}};
const freeSpot=(L,pad)=>{const hw=L.w/2-pad,hd=L.d/2-pad;let x,z,n=0;do{x=(rnd()*2-1)*hw;z=(rnd()*2-1)*hd}while(n++<40&&W.chars.some(c=>Math.hypot(c.x-x,c.z-z)<1.1));return[x,z]};
function addExtras(n,bg){const L=LK(W.loc),pool=(CR[W.loc]||CRD).split(' '),pz=L.e?['stand','walk','talk','walk','phone','stand']:['stand','talk','phone','cross','stand'];sr=(sr+W.chars.length*97+Date.now()%1000)%2147483646+1;for(let i=0;i<n;i++){const k=pool[Math.floor(rnd()*pool.length)],[x,z]=freeSpot(L,.9),c=mkc(k,0,x,z,Math.floor(rnd()*360),pz[Math.floor(rnd()*pz.length)],bg);c.n+=' '+(W.chars.length+1);if(rnd()<.6){const h=new T.Color(c.c);h.offsetHSL(rnd()-.5,0,0);c.c='#'+h.getHexString()}W.chars.push(c)}}
function populate(c){const L=LK(W.loc),names=MCAST(OWN,SID).slice(0,6);sr=ph(SID)%2147483646+1;names.forEach((n,i)=>{const h=ph(n),k=(h&1?MK:FK)[(h>>1)%6];W.chars.push(mkc(k,n,(i-(names.length-1)/2)*1.3,.4,0))});
if(!names.length){W.chars.push(mkc('m','Male 1',-.7,.4,0));W.chars.push(mkc('f','Female 1',.7,.4,0))}addExtras(L.e?10:Math.min(5,Math.round(L.w*L.d/14)),1);W.sel=(W.chars[0]||{}).id}
function aim(p){const cp=Math.cos(p.pitch);CAM.fov=p.fov;CAM.updateProjectionMatrix();CAM.up.set(Math.sin(p.roll||0),Math.cos(p.roll||0),0);CAM.position.set(p.tx+p.dist*Math.sin(p.yaw)*cp,p.ty+p.dist*Math.sin(p.pitch),p.tz+p.dist*Math.cos(p.yaw)*cp);CAM.lookAt(p.tx,p.ty,p.tz)}
function loop(now){if(!root||!root.isConnected||!R){stop();return}raf=requestAnimationFrame(loop);
if(tw){const u=Math.min(1,(now-tw.t0)/tw.d);W.cam=lerpP(tw.a,tw.b,ease(u));if(u>=1)tw=null}
let z=W.cam;
if(play){const s=W.shots[play.i],el=(now-play.t0)/1e3,mv=1.2,hold=2.4;if(el<mv)z=lerpP(play.from,s.cam,ease(el/mv));else{z={...s.cam};z.dist*=1-.05*Math.min(1,(el-mv)/hold)}
cap(`▶ ${play.i+1}/${W.shots.length} · ${s.n||sn(s.t)}`);if(el>mv+hold){play.from=s.cam;play.t0=now;if(++play.i>=W.shots.length)stopPlay()}}
for(const id in CH)CH[id].getObjectByName('ring').visible=!play&&id==W.sel;
animate(now);aim(z);SKY.position.copy(CAM.position);R.render(SC,CAM)}
function stop(){cancelAnimationFrame(raf);if(dirty&&OWN&&W)commit(true);if(R){R.dispose();try{R.forceContextLoss()}catch(e){}}R=null;for(const id in CH)delete CH[id];play=null}
const cap=t=>{const e=$('#vzcap');if(e)e.textContent=t};
function startPlay(){if(!W.shots.length)return toast('Add at least one shot first');play={i:0,t0:performance.now(),from:W.shots[0].cam};tw=null;$('#vzs').classList.add('vz-play');upd()}
function stopPlay(){play=null;cap('');$('#vzs')&&$('#vzs').classList.remove('vz-play');upd()}
function commit(q){if(!OWN||!W)return;(OWN.viz=OWN.viz||{})[SID]=JSON.parse(JSON.stringify({loc:W.loc,tod:W.tod,chars:W.chars,shots:W.shots,cam:W.cam,sel:W.sel,selS:W.selS}));dirty=false;save();upd();if(!q)toast('Visualization saved')}
const dd=()=>{dirty=true;upd()};
function load(){const s=OWN,c=scenes(s).find(x=>x.sid==SID),v=(s.viz||{})[SID];
W=v?JSON.parse(JSON.stringify(v)):{loc:guess(c),tod:TM[c.tod]||'day',chars:[],shots:[],sel:null,selS:null};if(!v){populate(c);W.cam=null}if(!LC.some(x=>x.k==W.loc))W.loc='living';
if(!W.cam)W.cam=preset('wide');dirty=false;play=null;tw=null;build();sync();draw();upd()}
function upd(){const t=$('#vzt');if(!t||!W)return;t.innerHTML=Object.keys(TD).map(k=>`<button data-v="tod" data-k="${k}" class="${W.tod==k?'on':''}">${TD[k][0]}</button>`).join('');const d=$('#vzd');if(d)d.hidden=!dirty;const p=$('#vzpl');if(p)p.textContent=play?'■ Stop':'▶ Preview'}
function draw(){const s=OWN,sc=scenes(s),k=LK(W.loc),sel=W.chars.find(c=>c.id==W.sel),names=[...new Set(s.blocks.slice(sc.find(x=>x.sid==SID).i+1).reduce((a,b)=>a.done||b.t=='scene'?{...a,done:1}:(b.t=='char'?{...a,l:[...a.l,b.x.replace(/\(.*?\)/g,'').trim()]}:a),{l:[]}).l)].filter(Boolean);
const opt=e=>LC.filter(x=>!!x.e==e).map(x=>`<option value="${x.k}" ${x.k==W.loc?'selected':''}>${x.n}</option>`).join('');
$('#vzp').innerHTML=`<div class="card vz-c"><label style="margin:0">Scene</label><select data-vi="scene">${sc.map(x=>`<option value="${x.sid}" ${x.sid==SID?'selected':''}>${x.n}. ${esc(x.loc||'Untitled')} · ${x.tod}${(s.viz||{})[x.sid]?' ✓':''}</option>`).join('')}</select><label>Location · ${LC.length} presets</label><select data-vi="loc"><optgroup label="Interior">${opt(0)}</optgroup><optgroup label="Exterior">${opt(1)}</optgroup></select></div>
<div class="card vz-c"><div class="vz-h"><b>Characters · ${W.chars.length}</b><span><select data-vi="lib">${AO(LIBK)}</select> <button data-v="addc">+ Add</button></span></div><div class="vz-h" style="margin-top:6px"><span class="mut" style="font-size:12px">${Object.keys(ARC).length} looks</span><span><button data-v="crowd">+ Crowd (6)</button> <button data-v="clrx">Clear extras</button></span></div><datalist id="vzn">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist><div class="vz-cl">${W.chars.map(c=>`<div class="vz-r ${c.id==W.sel?'on':''}" data-v="selc" data-id="${c.id}"><input type="color" value="${c.c}" data-vi="cc" data-id="${c.id}" title="Clothes colour"><input type="text" list="vzn" value="${esc(c.n)}" data-vi="cn" data-id="${c.id}"><span></span><div class="vz-x"><select data-vi="cp" data-id="${c.id}">${PO(c.p)}</select><button class="dng ib" data-v="delc" data-id="${c.id}" title="Remove">✕</button></div>${c.id==W.sel?`<span></span><label class="vz-f">Look<select data-vi="ck" data-id="${c.id}">${AO(c.k||(c.g=='f'?'f':'m'))}</select></label><span></span><label class="vz-f">Facing<input type="range" min="0" max="360" value="${c.r}" data-vi="cr" data-id="${c.id}"></label>`:''}</div>`).join('')||'<p class="mut" style="margin:6px 0 0">Add a male or female character, then drag it in the 3D view.</p>'}</div></div>`;
$('#vzh').innerHTML=`<div class="card vz-c"><div class="vz-h"><b>Planned shots for this scene</b><span><select id="vzst">${ST.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select> <button class="pri" data-v="adds">+ Add shot</button></span></div>${W.shots.map((x,i)=>`<div class="vz-r vz-s ${x.id==W.selS?'on':''}" data-v="sels" data-id="${x.id}"><b>${i+1}</b><div><b>${x.n?esc(x.n):sn(x.t)}</b> <span class="mut">${sn(x.t)} · ${Math.round(x.cam.fov)}°</span></div><span></span><input type="text" data-vi="sn" data-id="${x.id}" value="${esc(x.n||'')}" placeholder="Name or note, e.g. Ravi enters"><span></span><div class="vz-x"><button data-v="ups" data-id="${x.id}" title="Save the current camera into this shot">Update camera</button><button class="dng ib" data-v="dels" data-id="${x.id}" title="Delete">✕</button></div></div>`).join('')||'<p class="mut" style="margin:6px 0 0">Pick a shot type and add it. Then drag the camera and press Update camera to fine-tune it.</p>'}<p class="mut" style="margin:10px 0 0">Drag empty space to orbit · Right-drag or Shift-drag to pan · Scroll or pinch to zoom · Drag a character to move it.</p></div>`}
const V={
addc(b){const L=LK(W.loc),[x,z]=freeSpot(L,.9),c=mkc(LIBK,0,x,z,0,'stand');c.n+=' '+(W.chars.length+1);W.chars.push(c);W.sel=c.id;sync();draw();dd()},
crowd(){addExtras(6,1);sync();draw();dd()},
clrx(){W.chars=W.chars.filter(c=>!c.bg);if(!W.chars.some(c=>c.id==W.sel))W.sel=(W.chars[0]||{}).id;sync();draw();dd()},
selc(b){W.sel=b.dataset.id;draw()},
delc(b){W.chars=W.chars.filter(c=>c.id!=b.dataset.id);if(W.sel==b.dataset.id)W.sel=(W.chars[0]||{}).id;sync();draw();dd()},
tod(b){W.tod=b.dataset.k;tod();dd()},
adds(){const t=$('#vzst').value,s={id:'k'+Date.now(),t,n:'',cam:preset(t)};W.shots.push(s);W.selS=s.id;tw={a:{...W.cam},b:s.cam,t0:performance.now(),d:900};draw();dd()},
sels(b){const s=W.shots.find(x=>x.id==b.dataset.id);W.selS=s.id;tw={a:{...W.cam},b:s.cam,t0:performance.now(),d:900};draw()},
ups(b){W.shots.find(x=>x.id==b.dataset.id).cam={...W.cam};dd();toast('Shot camera updated')},
dels(b){W.shots=W.shots.filter(x=>x.id!=b.dataset.id);draw();dd()},
play(){play?stopPlay():startPlay()},
reset(){tw={a:{...W.cam},b:preset('wide'),t0:performance.now(),d:700}},
guides(){guides=!guides;$('#vzs').classList.toggle('vz-grid',guides)},
save(){commit()}};
const CI={lib(e){LIBK=e.value},ck(e){const c=W.chars.find(x=>x.id==e.dataset.id),a=ARC[e.value];c.k=e.value;c.g=a[1];c.c=a[2];sync();draw();dd()},scene(e){if(dirty)commit(true);SID=e.value;load()},loc(e){W.loc=e.value;build();dd()},
cc(e){W.chars.find(c=>c.id==e.dataset.id).c=e.value;sync();dd()},cn(e){W.chars.find(c=>c.id==e.dataset.id).n=e.value;dd()},cp(e){W.chars.find(c=>c.id==e.dataset.id).p=e.value;sync();dd()},cr(e){W.chars.find(c=>c.id==e.dataset.id).r=+e.value;sync();dd()},sn(e){W.shots.find(x=>x.id==e.dataset.id).n=e.value.trim();draw();dd()}};
function ndc(e){const r=RC.getBoundingClientRect();return new T.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1)}
function init(){const stage=$('#vzs'),cv=RC=$('#vzc');T=THREE;R=new T.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.2;SC=new T.Scene();initSky();CAM=new T.PerspectiveCamera(50,16/9,.05,500);
sunL=new T.DirectionalLight(0xffffff,1);sunL.castShadow=true;sunL.shadow.mapSize.set(2048,2048);sunL.shadow.bias=-.0004;sunL.shadow.normalBias=.03;Object.assign(sunL.shadow.camera,{left:-20,right:20,top:20,bottom:-20,far:80});SC.add(sunL);amb=new T.AmbientLight(0xffffff,.6);SC.add(amb);roomL=new T.PointLight(0xfff0d0,.6,16);roomL.position.set(0,2.6,0);SC.add(roomL);PL=new T.Plane(new T.Vector3(0,1,0),0);
$('#vzb').innerHTML='<button data-v="play" id="vzpl" class="pri">▶ Preview</button><button data-v="reset">Reset view</button><button data-v="guides">Grid</button><span class="sp"></span><span class="chip" id="vzd" hidden>Unsaved changes</span><button data-v="save" class="pri">Save</button>';
new ResizeObserver(()=>{if(!R)return;const r=stage.getBoundingClientRect();if(!r.width)return;R.setSize(r.width,r.height,false);CAM.aspect=r.width/r.height;CAM.updateProjectionMatrix()}).observe(stage);
const ray=new T.Raycaster(),ptr=new Map();let mode=null,drag=null,moved=false;
const pick=e=>{ray.setFromCamera(ndc(e),CAM);const h=ray.intersectObjects(Object.values(CH),true)[0];if(!h)return null;let o=h.object;while(o&&!o.userData.id)o=o.parent;return o?W.chars.find(c=>c.id==o.userData.id):null};
const ground=(e,c)=>{ray.setFromCamera(ndc(e),CAM);const p=new T.Vector3();if(ray.ray.intersectPlane(PL,p)){c.x=cl(p.x,-40,40);c.z=cl(p.z,-40,40);CH[c.id].position.set(c.x,0,c.z)}};
cv.addEventListener('pointerdown',e=>{if(play)return;cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);moved=false;if(ptr.size>1){drag=null;mode='pinch';return}const h=e.button==0&&!e.shiftKey&&pick(e);if(h){drag=h;DRGON=1;mode='char';if(W.sel!=h.id){W.sel=h.id;draw()}}else mode=(e.button==2||e.button==1||e.shiftKey)?'pan':'orbit'});
cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p||play)return;const dx=e.clientX-p[0],dy=e.clientY-p[1],z=W.cam;tw=null;
if(mode=='pinch'&&ptr.size==2){const o=[...ptr.values()],a=Math.hypot(o[0][0]-o[1][0],o[0][1]-o[1][1]);ptr.set(e.pointerId,[e.clientX,e.clientY]);const n=[...ptr.values()],b=Math.hypot(n[0][0]-n[1][0],n[0][1]-n[1][1]);z.dist=cl(z.dist*a/(b||1),.05,60);moved=true;return}
ptr.set(e.pointerId,[e.clientX,e.clientY]);moved=true;
if(mode=='char')ground(e,drag);else if(mode=='pan'){const k=z.dist*.0016;z.tx-=Math.cos(z.yaw)*dx*k;z.tz+=Math.sin(z.yaw)*dx*k;z.ty=cl(z.ty+dy*k,-2,30)}else{z.yaw-=dx*.005;z.pitch=cl(z.pitch+dy*.005,-1.5,1.5)}});
const up=e=>{ptr.delete(e.pointerId);if(!ptr.size){mode=null;drag=null;DRGON=0}if(moved){moved=false;dd()}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();if(play)return;W.cam.dist=cl(W.cam.dist*Math.exp(e.deltaY*.0012),.05,60);dd()},{passive:false});cv.addEventListener('contextmenu',e=>e.preventDefault());
load();raf=requestAnimationFrame(loop)}
function mount(s){stop();const t=$('#tb'),sc=scenes(s);OWN=s;
if(!sc.length){t.innerHTML='<div class="empty">'+I('viz',34)+'<b>No scenes yet</b><span>Write a scene and it will appear in Visualize.</span></div>';return}
if(!sc.some(x=>x.sid==SID))SID=sc[Math.min(typeof act=='number'?scenes(s).findIndex(x=>x.i>=act)>=0?scenes(s).findIndex(x=>x.i>=act):0:0,sc.length-1)].sid;
t.innerHTML='<div class="vz" id="vz"><div class="vz-l" id="vzp"></div><div class="vz-m"><div class="vz-st" id="vzs"><canvas id="vzc"></canvas><div class="vz-vg"></div><span class="vz-cap" id="vzcap"></span><div class="vz-tod" id="vzt"></div><div class="vz-bar" id="vzb"></div></div><div id="vzh" style="margin-top:12px"></div></div></div>';root=$('#vz');
root.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b||!W)return;if(!b.matches('button')&&e.target.closest('input,select,textarea'))return;V[b.dataset.v]&&V[b.dataset.v](b)});
['input','change'].forEach(ev=>root.addEventListener(ev,e=>{const k=e.target.dataset&&e.target.dataset.vi;if(!k||!W)return;const live=k=='cc'||k=='cr';if(live!=(ev=='input'))return;CI[k](e.target)}));
$('#vzs').insertAdjacentHTML('beforeend','<div class="vz-load mut" id="vzl">Loading 3D engine…</div>');
(window.THREE?Promise.resolve():new Promise((ok,no)=>{const x=document.createElement('script');x.src=TH;x.onload=ok;x.onerror=no;document.head.appendChild(x)})).then(()=>{if(!root||!root.isConnected)return;$('#vzl').remove();init()}).catch(()=>{const l=$('#vzl');if(l)l.innerHTML='Could not load the 3D engine (needs an internet connection the first time).'})}
const css=document.createElement('style');css.textContent=`.vz-cl{max-height:430px;overflow:auto;padding-right:2px}.vz-vg{position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 58%,rgba(0,0,0,.35))}.vz{display:grid;grid-template-columns:310px minmax(0,1fr);gap:16px;align-items:start}.vz-l{display:flex;flex-direction:column;gap:12px}.vz-c{padding:14px}.vz-c select,.vz-c input[type=text]{margin-top:4px}.vz-h{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.vz-h button,.vz-h select{padding:5px 10px;font-size:12px;width:auto;margin:0}
.vz-r{display:grid;grid-template-columns:34px 1fr;gap:6px 8px;align-items:center;padding:8px;border:1px solid var(--bd);border-radius:12px;margin-top:8px;cursor:pointer}.vz-r.on{border-color:var(--ac);background:var(--tint)}.vz-r input[type=color]{width:30px;height:30px;padding:0;border:0;background:none}.vz-r input[type=text]{margin:0}.vz-x{display:flex;gap:6px;justify-content:flex-end}.vz-x select{margin:0;padding:5px 8px;font-size:12px}.vz-x button{padding:5px 10px;font-size:12px}.vz-f{margin:0;display:flex;gap:8px;align-items:center}.vz-f input{padding:0}.vz-s>b{text-align:center}
.vz-st{position:relative;aspect-ratio:16/9;background:#0b1220;border-radius:16px;overflow:hidden;border:1px solid var(--bd)}#vzc{width:100%;height:100%;display:block;touch-action:none;cursor:grab}.vz-load{position:absolute;inset:0;display:grid;place-items:center;color:#cfe}
.vz-tod{position:absolute;top:10px;right:10px;display:flex;gap:2px;background:#0b1220b8;backdrop-filter:blur(6px);padding:4px;border-radius:12px;z-index:3}.vz-tod button{background:none;border:0;color:#fff;padding:5px 10px;font-size:12px;border-radius:8px}.vz-tod button:hover{background:#ffffff22}.vz-tod button.on{background:var(--mint);color:var(--on)}
.vz-bar{position:absolute;left:10px;right:10px;bottom:10px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;z-index:3}.vz-bar button{font-size:12px;padding:6px 12px}.vz-bar .sp{flex:1}.vz-cap{position:absolute;top:12px;left:12px;z-index:3;background:#0b1220b8;color:#fff;padding:4px 10px;border-radius:8px;font-size:12px}.vz-cap:empty{display:none}
.vz-grid::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;background-image:linear-gradient(#ffffff40 1px,transparent 1px),linear-gradient(90deg,#ffffff40 1px,transparent 1px);background-size:33.333% 33.333%}
.vz-play .vz-bar,.vz-play .vz-tod{opacity:0;pointer-events:none}.vz-play::before,.vz-play::after{content:"";position:absolute;left:0;right:0;height:11%;background:#000;z-index:2}.vz-play::before{top:0}.vz-play::after{bottom:0}.vz-play .vz-cap{top:12.5%}
@media(max-width:900px){.vz{grid-template-columns:1fr}.vz-tod button{padding:4px 6px}}`;document.head.appendChild(css);
/* ---- hooks: sidebar item + tab renderer (wrap, never edit, existing functions) ---- */
const dash0=window.dash,body0=window.body;
window.dash=function(){const r=dash0.apply(this,arguments);try{const sb=document.querySelector('.sb'),d=sb&&sb.querySelector('.nv[data-i="dir"]');if(d&&!sb.querySelector('.nv[data-i="viz"]'))d.insertAdjacentHTML('afterend',nv('tab','viz','viz','Visualize',tab==='viz'))}catch(e){}return r};
window.body=function(s){if(tab==='viz'){try{if(typeof rdStop=='function')rdStop()}catch(e){}mount(s);return}stop();return body0.apply(this,arguments)};
})();
