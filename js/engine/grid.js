/* ════════════════════════════════════════
   grid.js — Geração do grid e palavras
════════════════════════════════════════ */

const GridEngine = (() => {

  /* 8 direções: [deltaRow, deltaCol] */
  const DIRS = [
    [0,  1], [0, -1],  /* → ←  horizontal */
    [1,  0], [-1, 0],  /* ↓ ↑  vertical   */
    [1,  1], [1, -1],  /* ↘ ↙  diagonal   */
    [-1, 1], [-1,-1],  /* ↗ ↖  diagonal   */
  ];

  /* Letras ponderadas (vogais e comuns em PT-BR aparecem mais) */
  const FILL = 'AAAEEEIIOOUURRSSLMNCBDFTGPVHJKQWXYZ';

  /**
   * Gera o grid com palavras posicionadas.
   * @param {string[]} words - palavras em MAIÚSCULO sem acento
   * @param {number} size    - tamanho N do grid NxN
   * @returns {{ grid: string[][], placed: PlacedWord[] }}
   */
  function generate(words, size) {
    /* Inicializa grid vazio */
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];

    /* Ordena por tamanho (maiores primeiro, mais fácil posicionar) */
    const sorted = [...words].sort((a, b) => b.length - a.length);

    sorted.forEach((word, idx) => {
      const result = _placeWord(grid, word.toUpperCase(), size);
      if (result) {
        placed.push({
          word:  word.toUpperCase(),
          cells: result.cells,
          found: false,
          color: idx % 6,
        });
      }
    });

    /* Preenche células vazias */
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) {
          grid[r][c] = FILL[Math.floor(Math.random() * FILL.length)];
        }
      }
    }

    return { grid, placed };
  }

  /* ── Posiciona uma palavra ──────────── */
  function _placeWord(grid, word, size) {
    const dirs = _shuffle([...DIRS]);

    for (const [dr, dc] of dirs) {
      const positions = _shuffle(_validStarts(word.length, dr, dc, size));

      for (const [sr, sc] of positions) {
        const cells = [];
        let ok = true;

        for (let i = 0; i < word.length; i++) {
          const r = sr + dr * i;
          const c = sc + dc * i;
          const existing = grid[r][c];

          if (existing !== '' && existing !== word[i]) { ok = false; break; }
          cells.push([r, c]);
        }

        if (ok) {
          cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
          return { cells };
        }
      }
    }

    return null; /* Não conseguiu posicionar */
  }

  /* ── Gera posições iniciais válidas ─── */
  function _validStarts(len, dr, dc, size) {
    const result = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const er = r + dr * (len - 1);
        const ec = c + dc * (len - 1);
        if (er >= 0 && er < size && ec >= 0 && ec < size) {
          result.push([r, c]);
        }
      }
    }
    return result;
  }

  /* ── Fisher-Yates shuffle ──────────── */
  function _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { generate };

})();
