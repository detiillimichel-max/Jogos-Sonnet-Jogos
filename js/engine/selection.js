const SelectionEngine = (() => {
  let _gridEl = null;
  let _gridSize = 10;
  let _onSelect = null;
  let _activePointerId = null;
  let _startCell = null;
  let _curCells = [];
  let _handlers = {};

  function init(gridEl, gridSize, onSelect) {
    _cleanup();
    _gridEl = gridEl;
    _gridSize = gridSize;
    _onSelect = onSelect;
    _activePointerId = null;
    _startCell = null;
    _curCells = [];
    _handlers.down = _onPointerDown.bind(this);
    _handlers.move = _onPointerMove.bind(this);
    _handlers.up = _onPointerUp.bind(this);
    gridEl.addEventListener('pointerdown', _handlers.down);
    window.addEventListener('pointermove', _handlers.move);
    window.addEventListener('pointerup', _handlers.up);
    window.addEventListener('pointercancel', _handlers.up);
  }

  function _cleanup() {
    if (_gridEl && _handlers.down) {
      _gridEl.removeEventListener('pointerdown', _handlers.down);
      window.removeEventListener('pointermove', _handlers.move);
      window.removeEventListener('pointerup', _handlers.up);
      window.removeEventListener('pointercancel', _handlers.up);
    }
    _handlers = {};
  }

  function _cellFromTarget(target) {
    const cell = target?.closest?.('[data-r]');
    if (!cell ||!_gridEl.contains(cell)) return null;
    return { r: +cell.dataset.r, c: +cell.dataset.c, el: cell };
  }

  function _onPointerDown(e) {
    if (e.button!== 0) return;
    const cell = _cellFromTarget(e.target);
    if (!cell) return;
    e.preventDefault();
    _activePointerId = e.pointerId;
    _gridEl.setPointerCapture(e.pointerId);
    _startCell = cell;
    _curCells = [cell];
    _paint();
  }

  function _onPointerMove(e) {
    if (_activePointerId!== e.pointerId ||!_startCell) return;
    const cell = _cellFromTarget(e.target);
    if (!cell) return;
    const last = _curCells[_curCells.length - 1];
    if (last.r === cell.r && last.c === cell.c) return;
    _curCells = _lineFromTo(_startCell, cell);
    _paint();
  }

  function _onPointerUp(e) {
    if (_activePointerId!== e.pointerId ||!_startCell) return;
    e.preventDefault();
    try { _gridEl.releasePointerCapture(e.pointerId); } catch {}
    const word = _curCells.map(({r,c}) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      return el? el.textContent.trim() : '';
    }).join('');
    _onSelect?.([..._curCells], word);
    _clearPaint();
    _activePointerId = null;
    _startCell = null;
    _curCells = [];
  }

  function _lineFromTo(start, end) {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    if (dr === 0 && dc === 0) return [start];
    const dirs = [[0,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
    let best = dirs[0], bestDot = -Infinity;
    const len = Math.hypot(dr, dc) || 1;
    const ndx = dc / len, ndy = dr / len;
    for (const [dR,dC] of dirs) {
      const dot = ndy * dR + ndx * dC;
      if (dot > bestDot) { bestDot = dot; best = [dR,dC]; }
    }
    const [sdr, sdc] = best;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      const r = start.r + sdr * i;
      const c = start.c + sdc * i;
      if (r < 0 || r >= _gridSize || c < 0 || c >= _gridSize) break;
      cells.push({ r, c });
    }
    return cells;
  }

  function _paint() {
    _clearPaint();
    _curCells.forEach(({r,c}, i) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (!el) return;
      el.classList.add('is-selecting');
      if (i === 0) el.classList.add('is-selecting-start');
    });
  }

  function _clearPaint() {
    _gridEl.querySelectorAll('.is-selecting,.is-selecting-start')
     .forEach(el => el.classList.remove('is-selecting','is-selecting-start'));
  }

  function markFound(cells, colorIdx) {
    cells.forEach(({r,c}) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (!el) return;
      el.classList.remove('is-selecting','is-selecting-start');
      el.classList.add(`found-${colorIdx}`,'do-pop');
      el.addEventListener('animationend', () => el.classList.remove('do-pop'), {once:true});
    });
  }

  return { init, markFound };
})();
