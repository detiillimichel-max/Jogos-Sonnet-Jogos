/* ════════════════════════════════════════
   grid.js — Gerador de Grid com palavras
   Garante a inserção correta antes do preenchimento
════════════════════════════════════════ */

const GridEngine = (() => {

  function generate(words, size) {
    let grid = Array.from({ length: size }, () => Array(size).fill(''));
    let placed = [];

    // Tenta colocar cada palavra
    words.forEach((word, idx) => {
      let placedWord = _tryPlaceWord(grid, word, size, idx);
      if (placedWord) placed.push(placedWord);
    });

    // Preenche espaços vazios com letras aleatórias
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { grid, placed };
  }

  function _tryPlaceWord(grid, word, size, colorIdx) {
    const dirs = [
      [0, 1], [1, 0], [1, 1], [1, -1],
      [0, -1], [-1, 0], [-1, -1], [-1, 1]
    ];
    
    // Tenta 100 vezes por palavra para achar uma posição válida
    for (let attempt = 0; attempt < 100; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);

      if (_canPlace(grid, word, r, c, dir, size)) {
        let cells = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dir[0] * i;
          const nc = c + dir[1] * i;
          grid[nr][nc] = word[i];
          cells.push([nr, nc]);
        }
        return { word, cells, color: colorIdx % 5, found: false };
      }
    }
    return null; // Não conseguiu colocar a palavra
  }

  function _canPlace(grid, word, r, c, dir, size) {
    for (let i = 0; i < word.length; i++) {
      const nr = r + dir[0] * i;
      const nc = c + dir[1] * i;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
      if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
    }
    return true;
  }

  return { generate };
})();
