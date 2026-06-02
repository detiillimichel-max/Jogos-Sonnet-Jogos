const Shop = (() => {
  const ITEMS = [
    { id:'hint', name:'Dica', desc:'Revela 1 letra de uma palavra', price:50, type:'consumable' },
    { id:'time', name:'+15s', desc:'Adiciona 15 segundos', price:80, type:'consumable' },
    { id:'neon', name:'Tema Neon', desc:'Desbloqueia tema visual', price:200, type:'unlock' },
  ];

  function open(){
    document.getElementById('shopCoins').textContent = GameStorage.getCoins();
    render();
    Screens.show('screenShop');
  }

  function render(){
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = '';
    const owned = JSON.parse(localStorage.getItem('elo_shop_owned')||'[]');
    ITEMS.forEach(it => {
      const isOwned = owned.includes(it.id) && it.type==='unlock';
      const card = document.createElement('div');
      card.className = 'shop-item' + (isOwned? ' is-owned' : '');
      card.innerHTML = `
        <h3>${it.name}</h3>
        <p>${it.desc}</p>
        <div class="price">🪙 ${it.price}</div>
        <button class="btn-primary">${isOwned? 'Adquirido' : 'Comprar'}</button>
      `;
      card.querySelector('button').addEventListener('click', () => buy(it, isOwned));
      grid.appendChild(card);
    });
  }

  function buy(item, isOwned){
    if(isOwned) return;
    if(!GameStorage.spendCoins(item.price)){
      HUD.showToast('Moedas insuficientes!', true);
      AudioFX.error();
      return;
    }
    if(item.type==='unlock'){
      const owned = JSON.parse(localStorage.getItem('elo_shop_owned')||'[]');
      owned.push(item.id);
      localStorage.setItem('elo_shop_owned', JSON.stringify(owned));
    }
    if(item.id==='hint'){
      const state = GameEngine.getState();
      const target = state.words.find(w=>!w.found);
      if(target){
        const cell = state.placed.find(p=>p.word===target.word)?.cells[0];
        if(cell){
          const el = document.querySelector(`[data-r="${cell.r}"][data-c="${cell.c}"]`);
          el?.classList.add('do-pop');
          setTimeout(()=>el?.classList.remove('do-pop'),300);
        }
      }
    }
    if(item.id==='time'){
      const st = GameEngine.getState();
      if(st.timer>0){
        st.timer += 15;
        HUD.setTimer(st.timer);
      }
    }
    AudioFX.success();
    HUD.setCoins(GameStorage.getCoins());
    document.getElementById('shopCoins').textContent = GameStorage.getCoins();
    render();
  }

  return { open };
})();
