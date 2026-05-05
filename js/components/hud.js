/* ════════════════════════════════════════
   hud.js — Atualiza HUD e chips de palavras
════════════════════════════════════════ */

const HUD = (() => {

  /* ── Timer ──────────────────────────── */
  function setTimer(seconds) {
    const el = document.getElementById('timerVal');
    if (!el) return;
    el.textContent = seconds;

    el.classList.toggle('is-urgent', seconds <= 15);

    /* Barra de fundo muda de cor conforme urgência */
    const hud = document.querySelector('.hud-timer');
    if (hud) {
      hud.style.color = seconds <= 15 ? 'var(--pink)'
                      : seconds <= 30 ? 'var(--yellow)'
                      : '';
    }
  }

  /* ── Combo ──────────────────────────── */
  function setCombo(combo) {
    const el = document.getElementById('comboVal');
    if (!el) return;
    el.textContent = `×${combo}`;

    /* Bump animation */
    el.classList.remove('bump');
    void el.offsetWidth; /* reflow */
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  /* ── Moedas ─────────────────────────── */
  function setCoins(total) {
    const gameEl = document.getElementById('gameCoins');
    const homeEl = document.getElementById('homeCoins');
    if (gameEl) gameEl.textContent = total;
    if (homeEl) homeEl.textContent = total;
  }

  /* ── Chips de palavras ──────────────── */
  function renderWords(words) {
    const bar = document.getElementById('wordsBar');
    if (!bar) return;

    bar.innerHTML = '';
    words.forEach(w => {
      const chip = document.createElement('span');
      chip.className = 'word-chip';
      chip.dataset.word = w.word;
      chip.textContent  = w.word;

      if (w.found) {
        chip.classList.add('is-found');
        chip.style.background = `var(--f${w.color})`;
      }

      bar.appendChild(chip);
    });
  }

  /** Marca um chip como encontrado com a cor correta */
  function markWordFound(word, colorIdx) {
    const chip = document.querySelector(`.word-chip[data-word="${word}"]`);
    if (!chip) return;
    chip.classList.add('is-found');
    chip.style.background = `var(--f${colorIdx})`;
  }

  /* ── Toast de feedback ──────────────── */
  let _toastTimeout;
  function showToast(msg, isError = false) {
    const el = document.getElementById('feedbackToast');
    if (!el) return;

    clearTimeout(_toastTimeout);
    el.textContent = msg;
    el.classList.toggle('is-error', isError);
    el.classList.add('is-show');

    _toastTimeout = setTimeout(() => el.classList.remove('is-show'), 1000);
  }

  /* ── Shake de erro ──────────────────── */
  function shakeGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.classList.remove('do-shake');
    void grid.offsetWidth;
    grid.classList.add('do-shake');
    grid.addEventListener('animationend',
      () => grid.classList.remove('do-shake'), { once: true });
  }

  return { setTimer, setCombo, setCoins, renderWords, markWordFound, showToast, shakeGrid };

})();
