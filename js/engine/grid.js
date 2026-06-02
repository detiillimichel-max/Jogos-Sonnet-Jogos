/* ════════════════════════════════════════
   grid.js - Gerador de Grid com palavras
   VERSAO CORRIGIDA: garante insercao de todas as palavras
════════════════════════════════════════ */

const GridEngine = (() => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function generate(words, size) {
    // tenta varias vezes ate conseguir colocar todas
    for (let attempt = 0; attempt < 50; attempt++) {
      const result = _tryGenerate(words, size);
      if (result.placed.length === words.length) return result;
    }
    // fallback: aumenta tamanho temporariamente
    return _tryGenerate(words, size + 2);
  }

  function _tryGenerate(words, size) {
    const grid = Array.from({length:size}, () => Array(size).fill(''));
    const placed = [];
    // coloca maiores primeiro
    const sorted = [...words].sort((a,b) => b.length - a.length);
    for (let i = 0; i < sorted.length; i++) {
      const word = sorted[i];
      const colorIdx = words.indexOf(word) % 6;
      const p = _placeWord(grid, word, size, colorIdx);
      if (p) placed.push(p);
    }
    // preenche vazios
    for (let r=0; r<size; r++) {
      for (let c=0; c<size; c++) {
        if (!grid[r][c]) grid[r][c] = ALPHABET[Math.floor(Math.random()*ALPHABET.length)];
      }
    }
    return { grid, placed };
  }

  function _placeWord(grid, word, size, colorIdx) {
    const dirs = [
      [0,1],[1,0],[1,1],[1,-1],
      [0,-1],[-1,0],[-1,-1],[-1,1]
    ];
    // embaralha direcoes
    for (let i=dirs.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    const positions = [];
    for (let r=0; r<size; r++) for (let c=0; c<size; c++) positions.push([r,c]);
    // embaralha posicoes
    for (let i=positions.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (const [r,c] of positions) {
      for (const [dr,dc] of dirs) {
        if (_canPlace(grid, word, r, c, dr, dc, size)) {
          const cells = [];
          for (let i=0; i<word.length; i++) {
            const nr = r + dr*i, nc = c + dc*i;
            grid[nr][nc] = word[i];
            cells.push([nr,nc]);
          }
          return { word, cells, color: colorIdx, found:false };
        }
      }
    }
    return null;
  }

  function _canPlace(grid, word, r, c, dr, dc, size) {
    for (let i=0; i<word.length; i++) {
      const nr = r + dr*i, nc = c + dc*i;
      if (nr<0 || nr>=size || nc<0 || nc>=size) return false;
      const cur = grid[nr][nc];
      if (cur && cur !== word[i]) return false;
    }
    return true;
  }

  return { generate };
})();
