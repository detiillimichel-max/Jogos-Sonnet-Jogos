const Screens = (() => {
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('is-active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('is-active');
      target.style.zIndex = 10;
    }
  }

  function renderThemes(onSelect) {
    const container = document.getElementById('themeGrid');
    if (!container) return;
    container.innerHTML = '';
    WordData.themes.forEach(theme => {
      const card = document.createElement('div');
      card.className = 'theme-card';
      card.style.setProperty('--theme-color', theme.color);
      card.style.borderColor = theme.color + '55';
      card.style.boxShadow = `0 0 16px ${theme.color}22`;
      card.innerHTML = `
        <div class="theme-icon">${theme.icon}</div>
        <div class="theme-name">${theme.name}</div>
        <div class="theme-levels">${theme.levels.length} níveis</div>
      `;
      card.querySelector('.theme-icon').style.filter = `drop-shadow(0 0 8px ${theme.color})`;
      card.addEventListener('click', () => onSelect(theme.id, 0));
      container.appendChild(card);
    });
  }

  function showVictory(stats) {
    ['s1','s2','s3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('is-lit', i < stats.stars);
      if (i < stats.stars) {
        el.style.animationDelay = `${i * 0.15}s`;
      }
    });
    const statsEl = document.getElementById('resultStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-row"><span>Moedas ganhas</span><span>🪙 ${stats.coinsEarned}</span></div>
        <div class="stat-row"><span>Tempo restante</span><span>⏱ ${stats.timeLeft}s</span></div>
        <div class="stat-row"><span>Erros</span><span>❌ ${stats.errors}</span></div>
      `;
    }
    show('screenVictory');
  }

  function showDefeat(reason) {
    const el = document.getElementById('defeatMsg');
    if (el) el.textContent = reason;
    show('screenDefeat');
  }

  function openPause() {
    const el = document.getElementById('overlayPause');
    if (el) { el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); }
  }

  function closePause() {
    const el = document.getElementById('overlayPause');
    if (el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); }
  }

  return { show, renderThemes, showVictory, showDefeat, openPause, closePause };
})();
