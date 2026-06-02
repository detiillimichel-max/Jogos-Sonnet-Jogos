/* ════════════════════════════════════════
   selection.js — Arrastar e selecionar
   Versão Estabilizada
════════════════════════════════════════ */

const SelectionEngine = (() => {

  let _gridEl   = null;
  let _gridSize = 10;
  let _onSelect = null;

  let _startCell = null;
  let _curCells  = [];
  let _lastValidCell = null;

  function init(gridEl, gridSize, onSelect) {
    _gridEl   = gridEl;
    _gridSize = gridSize;
    _onSelect = onSelect;

    gridEl.addEventListener('mousedown',  _start);
    gridEl.addEventListener('mousemove',  _move);
    window.addEventListener('mouseup',    _end);
    gridEl.addEventListener('touchstart', _start, { passive: false });
    gridEl.addEventListener('touchmove',  _move,  { passive: false });
    window.addEventListener('touchend',   _end);
  }

  function _start(e) {
    e.preventDefault();
    const cell = _cellFromEvent(e);
    if (!cell) return;
    _startCell = cell;
    _curCells  = [cell];
    _paint();
  }

  function _move(e) {
    e.preventDefault();
    if (!_startCell) return;
    const cell = _cellFromEvent(e);
    if (!cell) return;
    _curCells = _lineFromTo(_startCell, cell);
    _paint();
  }

  function _end(e) {
    if (!_startCell) return;
    const word = _curCells.map(({ r, c }) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      return el ? el.textContent.trim() : '';
    }).join('');

    _onSelect?.([..._curCells], word.trim());

    _gridEl.querySelectorAll('.is-selecting, .is-selecting-start')
      .forEach(el => el.classList.remove('is-selecting', 'is-selecting-start'));
    _startCell = null; _curCells = []; _lastValidCell = null;
  }

  function _cellFromEvent(e) {
    const pt  = e.touches?.[0] ?? e;
    const el  = document.elementFromPoint(pt.clientX, pt.clientY);
    const cell = el?.closest('[data-r]');
    if (cell) {
        _lastValidCell = { r: +cell.dataset.r, c: +cell.dataset.c };
        return _lastValidCell;
    }
    return _lastValidCell;
  }

  function _lineFromTo(start, end) {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    if (dr === 0 && dc === 0) return [start];
    const angle = Math.atan2(dr, dc);
    const PI = Math.PI;
    const SNAPS = [
      { dir: [0, 1], a: 0 }, { dir: [1, 1], a: PI/4 }, { dir: [1, 0], a: PI/2 },
      { dir: [1, -1], a: 3*PI/4 }, { dir: [0, -1], a: PI }, { dir: [-1, -1], a: -3*PI/4 },
      { dir: [-1, 0], a: -PI/2 }, { dir: [-1, 1], a: -PI/4 }
    ];
    let best = SNAPS[0], minDiff = Infinity;
    for (const s of SNAPS) {
      let diff = Math.abs(angle - s.a);
      if (diff > PI) diff = 2 * PI - diff;
      if (diff < minDiff) { minDiff = diff; best = s; }
    }
    const [sdr, sdc] = best.dir;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      const r = start.r + sdr * i;
      const c = start.c + sdc * i;
      if (r >= 0 && r < _gridSize && c >= 0 && c < _gridSize) cells.push({ r, c });
    }
    return cells;
  }

  function _paint() {
    _gridEl.querySelectorAll('.is-selecting, .is-selecting-start')
      .forEach(el => el.classList.remove('is-selecting', 'is-selecting-start'));
    _curCells.forEach(({ r, c }, i) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (!el) return;
      el.classList.add('is-selecting');
      if (i === 0) el.classList.add('is-selecting-start');
    });
  }

  function markFound(cells, colorIdx) {
    cells.forEach(({ r, c }) => {
      const el = _gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (!el) return;
      el.classList.remove('is-selecting', 'is-selecting-start');
      el.classList.add(`found-${colorIdx}`, 'do-pop');
    });
  }

  return { init, markFound };
})();
