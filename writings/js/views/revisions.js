/* ============================================================
   Pines · views/revisions.js
   Revisions
   ============================================================ */
/* ---- Revisions ---- */
const RC=[['White','#ffffff'],['Blue','#cfe3ff'],['Pink','#ffd3e0'],['Yellow','#fff3b0'],['Green','#d3f5d0'],['Goldenrod','#f3d88a'],['Buff','#f0dcb4'],['Salmon','#ffc9b5'],['Cherry','#f4a6a6']];
const rva=b=>b.r?` data-rv="1" style="--rc:${RC[b.r][1]}"`:'',rvx=b=>b.r?` style="background:${RC[b.r][1]};-webkit-print-color-adjust:exact;print-color-adjust:exact"`:'';
function revMark(a){const s=cur(),b=s.blocks[+a.dataset.k];if(!s.rm||!s.rev||!b||b.r===s.rev)return;b.r=s.rev;const r=a.closest('.r');r.dataset.rv=1;r.style.setProperty('--rc',RC[s.rev][1])}
const revRep=s=>({head:['Scene','Heading','Revision marks'],rows:scenes(s).filter(c=>c.rv).map(c=>[c.n,c.h,Object.entries(c.rv).map(([i,n])=>RC[i][0]+' ×'+n).join(', ')])});
