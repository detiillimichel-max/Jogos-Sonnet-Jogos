/* ════════════════════════════════════════
   app.js — O maestro: liga tudo
════════════════════════════════════════ */

(function initApp() {
  document.addEventListener('DOMContentLoaded', () => {

    /* ── Moedas iniciais ──────────────── */
    HUD.setCoins(GameStorage.getCoins());
    document.getElementById('homeCoins').textContent = GameStorage.getCoins();

    /* ── Renderiza home ───────────────── */
    Screens.renderThemes(_startGame);
    Screens.show('screenHome');

    /* ── Eventos do GameEngine ────────── */
    GameEngine.on('Tick', (t) => {
      HUD.setTimer(t);
    });

    GameEngine.on('Combo', (c) => {
      HUD.setCombo(c);
    });

    GameEngine.on('Found', (wordData, earned) => {
      HUD.markWordFound(wordData.word, wordData.color);
      HUD.showToast(`+${earned} 🪙 ×${GameEngine.getState().combo}`);
      AudioFX.success();
    });

    GameEngine.on('Error', () => {
      HUD.shakeGrid();
      HUD.showToast('Errado! ✕', true);
      AudioFX.error();
    });

    GameEngine.on('Coins', (total) => {
      HUD.setCoins(total);
      document.getElementById('homeCoins').textContent = total;
    });

    GameEngine.on('Victory', (stats) => {
      setTimeout(() => Screens.showVictory(stats), 300);
    });

    GameEngine.on('Defeat', (reason) => {
      setTimeout(() => Screens.showDefeat(reason), 300);
    });

    /* ── Botões de controle ───────────── */

    // Pausa
    document.getElementById('btnPause').addEventListener('click', () => {
      GameEngine.pause();
      Screens.openPause();
    });
    document.getElementById('btnResume').addEventListener('click', () => {
      Screens.closePause();
      GameEngine.resume();
    });
    document.getElementById('btnQuit').addEventListener('click', () => {
      Screens.closePause();
      GameEngine.pause();
      HUD.setCoins(GameStorage.getCoins());
      Screens.show('screenHome');
    });

    // Vitória
    document.getElementById('btnVHome').addEventListener('click', () => {
      HUD.setCoins(GameStorage.getCoins());
      Screens.show('screenHome');
    });
    document.getElementById('btnNext').addEventListener('click', () => {
      const result = GameEngine.nextLevel();
      if (result) {
        _onGameStarted(result);
        Screens.show('screenGame');
      } else {
        HUD.setCoins(GameStorage.getCoins());
        Screens.show('screenHome');
      }
    });

    // Derrota
    document.getElementById('btnDHome').addEventListener('click', () => {
      HUD.setCoins(GameStorage.getCoins());
      Screens.show('screenHome');
    });
    document.getElementById('btnRetry').addEventListener('click', () => {
      const result = GameEngine.restart();
      _onGameStarted(result);
      Screens.show('screenGame');
    });

    // Loja
    document.getElementById('btnShop').addEventListener('click', () => Shop.open());
    document.getElementById('btnShopClose').addEventListener('click', () => Screens.show('screenHome'));
  });

  /* ── Iniciar uma partida ──────────────── */
  function _startGame(themeId, levelIndex) {
    const result = GameEngine.start(themeId, levelIndex);
    _onGameStarted(result);
    Screens.show('screenGame');
  }

  /** Atualiza HUD após gerar o jogo */
  function _onGameStarted({ words, size }) {
    HUD.renderWords(words);
    HUD.setTimer(GameEngine.getState().timer);
    HUD.setCombo(1);
    HUD.setCoins(GameStorage.getCoins());
  }
})();
