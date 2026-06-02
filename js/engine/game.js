/* ════════════════════════════════════════
   game.js — Versão completa e funcional
════════════════════════════════════════ */

const GameEngine = (() => {

  let S = _initialState();

  function _initialState() {
    return {
      phase:      'idle',
      themeId:    null,
      levelIndex: null,
      levelData:  null,
      grid:       [],
      words:      [],
      timer:      0,
      _timerRef:  null,
      combo:      1,
      _comboRef:  null,
      errors:     0,
      coinsEarned:0,
    };
  }

  const _cb = {
    onTick: null, onCombo: null, onFound: null, onError: null,
    onVictory: null, onDefeat: null, onCoins: null,
  };

  function on(event, fn) { _cb[`on${event}`] = fn; }

  function start(themeId, levelIndex) {
    _clearTimers();
    S = _initialState();
    const theme = WordData.themes.find(t => t.id === themeId);
    if (!theme) return;
    S.themeId = themeId; S.levelIndex = levelIndex;
    S.levelData = theme.levels[levelIndex];
    S.phase = 'playing'; S.timer = S.levelData.time;
    S.coinsEarned = 0;
    const { grid, placed } = GridEngine.generate(S.levelData.words, S.levelData.size);
    S.grid = grid; S.words = placed;
    _renderGrid(grid, S.levelData.size);
    const gridEl = document.getElementById('grid');
    SelectionEngine.init(gridEl, S.levelData.size, _handleSelection);
    _startTimer();
    return { grid, words: S.words, size: S.levelData.size };
  }

  function _startTimer() {
    _cb.onTick?.(S.timer);
    S._timerRef = setInterval(() => {
      if (S.phase !== 'playing') return;
      S.timer--;
      _cb.onTick?.(S.timer);
      if (S.timer <= 0) _triggerDefeat('O tempo acabou!');
    }, 1000);
  }

  function _handleSelection(cells, word) {
    if (S.phase !== 'playing') return;

    // Normalização correta para garantir a validação
    const cleanedInput = word.trim().toUpperCase();
    const reversed = cleanedInput.split('').reverse().join('');

    const found = S.words.find(w =>
      !w.found && (w.word === cleanedInput || w.word === reversed)
    );

    if (found) {
      _wordFound(found);
    } else if (cleanedInput.length > 1) {
      _wordMissed();
    }
  }

  function _wordFound(wordData) {
    wordData.found = true;
    S.combo = Math.min(S.combo + 1, 8);
    clearTimeout(S._comboRef);
    S._comboRef = setTimeout(() => {
      S.combo = 1;
      _cb.onCombo?.(S.combo);
    }, 6000);
    const base = 10 + wordData.word.length * 2;
    const earned = Math.round(base * S.combo);
    S.coinsEarned += earned;
    GameStorage.addCoins(earned);
    const cellObjs = wordData.cells.map(([r, c]) => ({ r, c }));
    SelectionEngine.markFound(cellObjs, wordData.color);
    _cb.onCombo?.(S.combo);
    _cb.onFound?.(wordData, earned);
    _cb.onCoins?.(GameStorage.getCoins());
    if (S.words.every(w => w.found)) {
      setTimeout(() => _triggerVictory(), 400);
    }
  }

  function _wordMissed() {
    S.errors++; S.combo = 1;
    clearTimeout(S._comboRef);
    _cb.onCombo?.(S.combo);
    _cb.onError?.();
    if (S.errors >= S.levelData.maxErrors) {
      setTimeout(() => _triggerDefeat(`Muitos erros (${S.errors})!`), 400);
    }
  }

  function _triggerVictory() {
    S.phase = 'victory'; _clearTimers();
    const stars = S.errors === 0 ? 3 : S.errors <= 2 ? 2 : 1;
    GameStorage.saveProgress(S.themeId, S.levelIndex, stars);
    const timeBonus = Math.round((S.timer / S.levelData.time) * 20);
    if (timeBonus > 0) GameStorage.addCoins(timeBonus);
    _cb.onVictory?.({
      stars, errors: S.errors, coinsEarned: S.coinsEarned + timeBonus, timeLeft: S.timer,
    });
  }

  function _triggerDefeat(reason) {
    S.phase = 'defeat'; _clearTimers();
    _cb.onDefeat?.(reason);
  }

  function pause() {
    if (S.phase !== 'playing') return;
    S.phase = 'paused'; _clearTimers();
  }

  function resume() {
    if (S.phase !== 'paused') return;
    S.phase = 'playing'; _startTimer();
  }

  function restart() { return start(S.themeId, S.levelIndex); }

  function nextLevel() {
    const theme = WordData.themes.find(t => t.id === S.themeId);
    const nextIdx = S.levelIndex + 1;
    if (!theme || nextIdx >= theme.levels.length) return null;
    return start(S.themeId, nextIdx);
  }

  function _renderGrid(grid, size) {
    const el = document.getElementById('grid');
    el.innerHTML = ''; el.style.setProperty('--gs', size);
    el.classList.remove('do-shake');
    grid.forEach((row, r) => {
      row.forEach((letter, c) => {
        const cell = document.createElement('div');
        cell.className = 'cell'; cell.textContent = letter;
        cell.dataset.r = r; cell.dataset.c = c;
        cell.style.setProperty('--ci', r * size + c);
        el.appendChild(cell);
      });
    });
  }

  function getWords() { return S.words; }
  function getState() { return S; }
  function getThemeId() { return S.themeId; }
  function getLevelIndex() { return S.levelIndex; }

  function _clearTimers() {
    clearInterval(S._timerRef);
    clearTimeout(S._comboRef);
  }

  return { start, restart, nextLevel, pause, resume, on, getWords, getState, getThemeId, getLevelIndex };
})();
