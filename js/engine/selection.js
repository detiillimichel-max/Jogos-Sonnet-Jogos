const SelectionEngine = (() => {
  let G, S, onSel, active = false, start = null, cells = [];

  const dirs = [[0,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];

  function init(gridEl, gridSize, onSelect){
    G = gridEl; S = gridSize; onSel = onSelect;
    G.style.touchAction = 'none';
    G.addEventListener('pointerdown', onDown, {passive:false});
    window.addEventListener('pointermove', onMove, {passive:false});
    window.addEventListener('pointerup', onUp, {passive:false});
    window.addEventListener('pointercancel', onUp, {passive:false});
    // fallback touch
    G.addEventListener('touchstart', onTouchStart, {passive:false});
    window.addEventListener('touchmove', onTouchMove, {passive:false});
    window.addEventListener('touchend', onTouchEnd, {passive:false});
    window.addEventListener('touchcancel', onTouchEnd, {passive:false});
  }

  const cellAt = (x,y) => {
    const el = document.elementFromPoint(x,y)?.closest('[data-r]');
    return el && G.contains(el)? {r:+el.dataset.r,c:+el.dataset.c} : null;
  };

  const line = (a,b) => {
    const dr=b.r-a.r, dc=b.c-a.c;
    if(!dr &&!dc) return [a];
    const L=Math.hypot(dr,dc)||1, nx=dc/L, ny=dr/L;
    let best=dirs[0], bd=-Infinity;
    for(const [dR,dC] of dirs){ const d=ny*dR+nx*dC; if(d>bd){bd=d;best=[dR,dC]} }
    const [sr,sc]=best, n=Math.max(Math.abs(dr),Math.abs(dc)), out=[];
    for(let i=0;i<=n;i++){const r=a.r+sr*i,c=a.c+sc*i;if(r<0||c<0||r>=S||c>=S)break;out.push({r,c})}
    return out;
  };

  const paint = () => {
    G.querySelectorAll('.is-selecting,.is-selecting-start').forEach(e=>e.classList.remove('is-selecting','is-selecting-start'));
    cells.forEach(({r,c},i)=>{const e=G.querySelector(`[data-r="${r}"][data-c="${c}"]`);if(!e)return;e.classList.add('is-selecting');if(!i)e.classList.add('is-selecting-start')});
  };

  const clear = () => { paint(); active=false; start=null; cells=[]; };

  const finish = () => {
    const w=cells.map(({r,c})=>G.querySelector(`[data-r="${r}"][data-c="${c}"]`)?.textContent.trim()||'').join('');
    onSel?.(cells,w);
    clear();
  };

  function onDown(e){
    if(e.button!==0 && e.button!==-1) return;
    const c=cellAt(e.clientX,e.clientY); if(!c) return;
    e.preventDefault(); active=true; start=c; cells=[c]; paint();
    try{G.setPointerCapture(e.pointerId)}catch{}
  }
  function onMove(e){
    if(!active||!start) return; e.preventDefault();
    const c=cellAt(e.clientX,e.clientY); if(!c) return;
    cells=line(start,c); paint();
  }
  function onUp(e){
    if(!active) return; e.preventDefault(); finish();
  }

  function onTouchStart(e){
    if(!e.touches.length) return;
    const t=e.touches[0]; const c=cellAt(t.clientX,t.clientY); if(!c) return;
    e.preventDefault(); active=true; start=c; cells=[c]; paint();
  }
  function onTouchMove(e){
    if(!active||!start||!e.touches.length) return;
    e.preventDefault();
    const t=e.touches[0]; const c=cellAt(t.clientX,t.clientY); if(!c) return;
    cells=line(start,c); paint();
  }
  function onTouchEnd(e){
    if(!active) return; e.preventDefault(); finish();
  }

  return {
    init,
    markFound(cs,ci){
      cs.forEach(({r,c})=>{
        const e=G.querySelector(`[data-r="${r}"][data-c="${c}"]`); if(!e) return;
        e.classList.remove('is-selecting','is-selecting-start');
        e.classList.add(`found-${ci}`,'do-pop');
        e.addEventListener('animationend',()=>e.classList.remove('do-pop'),{once:true});
      });
    }
  };
})();
