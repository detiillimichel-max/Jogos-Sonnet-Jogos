const SelectionEngine = (() => {
  let G,S,onSel,id=null,start=null,cells=[];
  const dirs=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  const cellAt=(x,y)=>{const e=document.elementFromPoint(x,y)?.closest('[data-r]');return e&&G.contains(e)?{r:+e.dataset.r,c:+e.dataset.c}:null};
  const line=(a,b)=>{const dr=b.r-a.r,dc=b.c-a.c;if(!dr&&!dc)return[a];const L=Math.hypot(dr,dc)||1,nx=dc/L,ny=dr/L;let best=dirs[0],bd=-9;for(const[dR,dC]of dirs){const d=ny*dR+nx*dC;if(d>bd){bd=d;best=[dR,dC]}}const[sr,sc]=best,n=Math.max(Math.abs(dr),Math.abs(dc)),o=[];for(let i=0;i<=n;i++){const r=a.r+sr*i,c=a.c+sc*i;if(r<0||c<0||r>=S||c>=S)break;o.push({r,c})}return o};
  const paint=()=>{G.querySelectorAll('.is-selecting,.is-selecting-start').forEach(e=>e.classList.remove('is-selecting','is-selecting-start'));cells.forEach(({r,c},i)=>{const e=G.querySelector(`[data-r="${r}"][data-c="${c}"]`);if(!e)return;e.classList.add('is-selecting');if(!i)e.classList.add('is-selecting-start')})};
  const down=e=>{if(e.button!==0&&e.button!==-1)return;const c=cellAt(e.clientX,e.clientY);if(!c)return;e.preventDefault();id=e.pointerId;try{G.setPointerCapture(id)}catch{};start=c;cells=[c];paint()};
  const move=e=>{if(id!==e.pointerId||!start)return;e.preventDefault();const c=cellAt(e.clientX,e.clientY);if(!c)return;cells=line(start,c);paint()};
  const up=e=>{if(id!==e.pointerId||!start)return;e.preventDefault();try{G.releasePointerCapture(id)}catch{};const w=cells.map(({r,c})=>G.querySelector(`[data-r="${r}"][data-c="${c}"]`)?.textContent.trim()||'').join('');onSel?.(cells,w);paint();id=start=null;cells=[]};
  return {
    init(g,sz,fn){G=g;S=sz;onSel=fn;G.addEventListener('pointerdown',down,{passive:false});window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up,{passive:false});window.addEventListener('pointercancel',up,{passive:false})},
    markFound(cs,ci){cs.forEach(({r,c})=>{const e=G.querySelector(`[data-r="${r}"][data-c="${c}"]`);if(!e)return;e.classList.remove('is-selecting','is-selecting-start');e.classList.add(`found-${ci}`,'do-pop');e.addEventListener('animationend',()=>e.classList.remove('do-pop'),{once:true})})}
  };
})();
