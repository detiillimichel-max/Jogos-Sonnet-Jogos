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
/* === AUDIO FX === */
const AudioFX = (() => {
  let ctx = null;
  function ensure(){ if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)(); }
  function beep(f,d,t='sine',v=0.2){ ensure(); const o=ctx.createOscillator(), g=ctx.createGain(); o.type=t; o.frequency.value=f; g.gain.value=v; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+d); }
  return {
    success(){ beep(880,0.12); setTimeout(()=>beep(1320,0.15),100); if(navigator.vibrate) navigator.vibrate(30); },
    error(){ beep(200,0.25,'sawtooth',0.15); if(navigator.vibrate) navigator.vibrate([50,30,50]); }
  };
})();

/* === SHOP CSS INJETADO === */
(function injectShopCSS(){
  const css = `.shop-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #2a2a40}
.shop-header h2{margin:0;font-size:20px}
.shop-grid{padding:16px;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
.shop-item{background:var(--panel-2);border:1px solid #2a2a40;border-radius:14px;padding:14px;text-align:center;display:flex;flex-direction:column;gap:8px}
.shop-item h3{margin:0;font-size:16px}
.shop-item p{margin:0;color:var(--muted);font-size:13px;min-height:32px}
.shop-item.price{font-weight:700;color:var(--yellow)}
.shop-item button{margin-top:auto}
.shop-item.is-owned{opacity:.6}
.shop-item.is-owned button{pointer-events:none;background:#333}`;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* === SHOP === */
const Shop = (() => {
  const ITEMS = [
    {id:'hint',name:'Dica',desc:'Revela 1 letra',price:50,type:'consumable'},
    {id:'time',name:'+15s',desc:'Adiciona 15 segundos',price:80,type:'consumable'},
    {id:'neon',name:'Tema Neon',desc:'Desbloqueia tema',price:200,type:'unlock'},
  ];
  function ensureDOM(){
    const home = document.getElementById('screenHome');
    if(home &&!document.getElementById('btnShop')){
      const actions = home.querySelector('.home-actions') || home.querySelector('.home-header') || home;
      const btn = document.createElement('button');
      btn.id='btnShop'; btn.className='btn-icon'; btn.textContent='🛒';
      actions.appendChild(btn);
      btn.addEventListener('click', open);
    }
    if(!document.getElementById('screenShop')){
      const sec = document.createElement('section');
      sec.id='screenShop'; sec.className='screen';
      sec.innerHTML=`<div class="shop-header"><h2>Loja</h2><div class="coins">🪙 <span id="shopCoins">0</span></div><button id="btnShopClose" class="btn-icon">✕</button></div><div id="shopGrid" class="shop-grid"></div>`;
      document.body.appendChild(sec);
      document.getElementById('btnShopClose').addEventListener('click',()=>Screens.show('screenHome'));
    }
  }
  function open(){
    ensureDOM();
    document.getElementById('shopCoins').textContent = GameStorage.getCoins();
    render();
    Screens.show('screenShop');
  }
  function render(){
    const grid=document.getElementById('shopGrid'); if(!grid) return;
    grid.innerHTML='';
    const owned=JSON.parse(localStorage.getItem('elo_shop_owned')||'[]');
    ITEMS.forEach(it=>{
      const isOwned=owned.includes(it.id)&&it.type==='unlock';
      const card=document.createElement('div');
      card.className='shop-item'+(isOwned?' is-owned':'');
      card.innerHTML=`<h3>${it.name}</h3><p>${it.desc}</p><div class="price">🪙 ${it.price}</div><button class="btn-primary">${isOwned?'Adquirido':'Comprar'}</button>`;
      card.querySelector('button').addEventListener('click',()=>buy(it,isOwned));
      grid.appendChild(card);
    });
  }
  function buy(item,isOwned){
    if(isOwned) return;
    if(!GameStorage.spendCoins(item.price)){ HUD.showToast('Moedas insuficientes!',true); AudioFX.error(); return; }
    if(item.type==='unlock'){ const o=JSON.parse(localStorage.getItem('elo_shop_owned')||'[]'); o.push(item.id); localStorage.setItem('elo_shop_owned',JSON.stringify(o)); }
    if(item.id==='hint'){ const st=GameEngine.getState(); const t=st.words.find(w=>!w.found); if(t){ const c=st.placed.find(p=>p.word===t.word)?.cells[0]; if(c){ const el=document.querySelector(`[data-r="${c.r}"][data-c="${c.c}"]`); el?.classList.add('do-pop'); setTimeout(()=>el?.classList.remove('do-pop'),300); } } }
    if(item.id==='time'){ const st=GameEngine.getState(); if(st.timer>0){ st.timer+=15; HUD.setTimer(st.timer); } }
    AudioFX.success(); HUD.setCoins(GameStorage.getCoins()); document.getElementById('shopCoins').textContent=GameStorage.getCoins(); render();
  }
  document.addEventListener('DOMContentLoaded',ensureDOM);
  return {open};
})();

/* === HOOK SOM NOS EVENTOS === */
GameEngine.on('Found',()=>AudioFX.success());
GameEngine.on('Error',()=>AudioFX.error());
