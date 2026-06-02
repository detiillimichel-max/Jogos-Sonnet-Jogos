const GameStorage = (() => {
  const KEYS = { coins: 'elo_coins_v1', progress: 'elo_progress_v1' };

  function getCoins() {
    return parseInt(localStorage.getItem(KEYS.coins) || '0', 10);
  }

  function addCoins(amount) {
    const current = getCoins();
    const next = current + amount;
    localStorage.setItem(KEYS.coins, next);
    return next;
  }

  function spendCoins(amount) {
    const current = getCoins();
    if (current < amount) return false;
    localStorage.setItem(KEYS.coins, current - amount);
    return true;
  }

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEYS.progress) || '{}'); } catch { return {}; }
  }

  function saveProgress(themeId, levelIndex, stars) {
    const prog = getProgress();
    if (!prog[themeId]) prog[themeId] = {};
    const current = prog[themeId][levelIndex] ?? 0;
    if (stars > current) prog[themeId][levelIndex] = stars;
    localStorage.setItem(KEYS.progress, JSON.stringify(prog));
  }

  function getLevelStars(themeId, levelIndex) {
    const prog = getProgress();
    return prog[themeId]?.[levelIndex] ?? 0;
  }

  return { getCoins, addCoins, spendCoins, saveProgress, getLevelStars };
})();
