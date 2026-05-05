/* ════════════════════════════════════════
   game.js — Estado e lógica do jogo
════════════════════════════════════════ */

const GameEngine = (() => {

  /* ── Estado ─────────────────────────── */
  let S = _initialState();

  function _initialState() {
    return {
      phase:      'idle',   /* idle | playing | paused | victory | defeat */
      themeId:    null,
      levelIndex: null,
      levelData:  null,

      grid:       [],       /* string[][] */
      words:      [],       /* PlacedWord[] */

      timer:      0,
      _timerRef:  null,

      combo:      1,
      _comboRef:  null,

      errors:     0,
      coinsEarned:0,
    };
  }

  /* Callbacks registrados pelo app.js */
  const _cb = {
    onTick:    null,  /* (timeLeft) */
    onCombo:   null,  /* (combo) */
    onFound:   null,  /* (wordData, coinsEarned) */
    onError:   null,  /* () */
    onVictory: null,  /* (stats) */
    onDefeat:  null,  /* (reason) */
    onCoins:   null,  /* (total) */
  };

  function on(event, fn) { _cb[`on${event}`] = fn; }

  /* ── Iniciar jogo ───────────────────── */
  function start(themeId, levelIndex) {
    _clearTimers();
    S = _initialState();

    const theme = WordData.themes.find(t => t.id === themeId);
    if (!theme) return;

    S.themeId    = themeId;
    S.levelIndex = levelIndex;
    S.levelData  = theme.levels[levelIndex];
    S.phase      = 'playing';
    S.timer      = S.levelData.time;
    S.coinsEarned = 0;

    /* Gera o grid */
    const { grid, placed } = GridEngine.generate(S.levelData.words, S.levelData.size);
    S.grid  = grid;
    S.words = placed;

    /* Renderiza o grid no DOM */
    _renderGrid(grid, S.levelData.size);

    /* Inicia seleção */
    const gridEl = document.getElementById('grid');
    SelectionEngine.init(gridEl, S.levelData.size, _handleSelection);

    /* Inicia timer */
    _startTimer();

    return { grid, words: S.words, size: S.levelData.size };
  }

  /* ── Timer ──────────────────────────── */
  function _startTimer() {
    _cb.onTick?.(S.timer);
    S._timerRef = setInterval(() => {
      if (S.phase !== 'playing') return;
      S.timer--;
      _cb.onTick?.(S.timer);
      if (S.timer <= 0) _triggerDefeat('O tempo acabou!');
    }, 1000);
  }

  /* ── Seleção de palavra ─────────────── */
  function _handleSelection(cells, word) {
    if (S.phase !== 'playing') return;

    /* Tenta match direto e reverso */
    const reversed  = word.split('').reverse().join('');
    const matchWord = word;
    const matchRev  = reversed;

    const found = S.words.find(w =>
      !w.found && (w.word === matchWord || w.word === matchRev)
    );

    if (found) {
      _wordFound(found);
    } else {
      _wordMissed();
    }
  }

  function _wordFound(wordData) {
    wordData.found = true;

    /* Combo */
    S.combo = Math.min(S.combo + 1, 8);
    clearTimeout(S._comboRef);
    S._comboRef = setTimeout(() => {
      S.combo = 1;
      _cb.onCombo?.(S.combo);
    }, 6000);

    /* Moedas */
    const base   = 10 + wordData.word.length * 2;
    const earned = Math.round(base * S.combo);
    S.coinsEarned += earned;
    GameStorage.addCoins(earned);

    /* Marca células no grid */
    const cellObjs = wordData.cells.map(([r, c]) => ({ r, c }));
    SelectionEngine.markFound(cellObjs, wordData.color);

    _cb.onCombo?.(S.combo);
    _cb.onFound?.(wordData, earned);
    _cb.onCoins?.(GameStorage.getCoins());

    /* Verifica vitória */
    if (S.words.every(w => w.found)) {
      setTimeout(() => _triggerVictory(), 400);
    }
  }

  function _wordMissed() {
    S.errors++;
    S.combo = 1;
    clearTimeout(S._comboRef);
    _cb.onCombo?.(S.combo);
    _cb.onError?.();

    if (S.errors >= S.levelData.maxErrors) {
      setTimeout(() => _triggerDefeat(`Muitos erros (${S.errors})!`), 400);
    }
  }

  /* ── Fim de jogo ────────────────────── */
  function _triggerVictory() {
    S.phase = 'victory';
    _clearTimers();

    const stars = S.errors === 0 ? 3
                : S.errors <= 2  ? 2 : 1;

    GameStorage.saveProgress(S.themeId, S.levelIndex, stars);

    /* Bônus de tempo */
    const timeBonus = Math.round((S.timer / S.levelData.time) * 20);
    if (timeBonus > 0) GameStorage.addCoins(timeBonus);

    _cb.onVictory?.({
      stars,
      errors:     S.errors,
      coinsEarned: S.coinsEarned + timeBonus,
      timeLeft:   S.timer,
    });
  }

  function _triggerDefeat(reason) {
    S.phase = 'defeat';
    _clearTimers();
    _cb.onDefeat?.(reason);
  }

  /* ── Pausa ──────────────────────────── */
  function pause() {
    if (S.phase !== 'playing') return;
    S.phase = 'paused';
    _clearTimers();
  }

  function resume() {
    if (S.phase !== 'paused') return;
    S.phase = 'playing';
    _startTimer();
  }

  /* ── Reiniciar ──────────────────────── */
  function restart() {
    return start(S.themeId, S.levelIndex);
  }

  /* ── Próximo nível ──────────────────── */
  function nextLevel() {
    const theme  = WordData.themes.find(t => t.id === S.themeId);
    const nextIdx = S.levelIndex + 1;
    if (!theme || nextIdx >= theme.levels.length) return null;
    return start(S.themeId, nextIdx);
  }

  /* ── Renderiza grid no DOM ──────────── */
  function _renderGrid(grid, size) {
    const el = document.getElementById('grid');
    el.innerHTML = '';
    el.style.setProperty('--gs', size);
    el.classList.remove('do-shake');

    grid.forEach((row, r) => {
      row.forEach((letter, c) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = letter;
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.style.setProperty('--ci', r * size + c);
        el.appendChild(cell);
      });
    });
  }

  /* ── Getters ────────────────────────── */
  function getWords()   { return S.words; }
  function getState()   { return S; }
  function getThemeId() { return S.themeId; }
  function getLevelIndex() { return S.levelIndex; }

  function _clearTimers() {
    clearInterval(S._timerRef);
    clearTimeout(S._comboRef);
  }

  return { start, restart, nextLevel, pause, resume, on, getWords, getState, getThemeId, getLevelIndex };

})();
