/* ════════════════════════════════════════
   words.js — Temas e palavras por nível
════════════════════════════════════════ */

const WordData = {
  themes: [
    {
      id:    'animais',
      name:  'Animais',
      icon:  '🐾',
      color: '#39f587',
      levels: [
        { words: ['GATO','LEAO','URSO','LOBO','PATO'],                          size: 8,  time: 90,  maxErrors: 5 },
        { words: ['COBRA','TIGRE','GIRAFA','MACACO','ONCA'],                     size: 10, time: 110, maxErrors: 4 },
        { words: ['CACHORRO','ELEFANTE','PAPAGAIO','JACARE','TARTARUGA'],        size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'frutas',
      name:  'Frutas',
      icon:  '🍎',
      color: '#ff4d6d',
      levels: [
        { words: ['MACA','PERA','UVA','KIWI','FIGO'],                           size: 8,  time: 90,  maxErrors: 5 },
        { words: ['BANANA','MANGA','MELAO','MORANGO','LIMAO'],                   size: 10, time: 110, maxErrors: 4 },
        { words: ['ABACAXI','MARACUJA','FRAMBOESA','GOIABA','LARANJA'],          size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'esportes',
      name:  'Esportes',
      icon:  '⚽',
      color: '#ffe033',
      levels: [
        { words: ['SURF','BOXE','POLO','GOLF','LUTA'],                           size: 8,  time: 90,  maxErrors: 5 },
        { words: ['TENIS','VOLEI','FUTEBOL','NATACAO','CICLISMO'],               size: 10, time: 110, maxErrors: 4 },
        { words: ['BASQUETE','GINASTICA','ATLETISMO','HANDEBOL','BADMINTON'],    size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'paises',
      name:  'Países',
      icon:  '🌍',
      color: '#00e5ff',
      levels: [
        { words: ['CHILE','CHINA','CUBA','PERU','IRAQ'],                          size: 8,  time: 90,  maxErrors: 5 },
        { words: ['BRASIL','JAPAO','ITALIA','RUSSIA','CANADA'],                   size: 10, time: 110, maxErrors: 4 },
        { words: ['AUSTRALIA','ALEMANHA','PORTUGAL','ARGENTINA','COLOMBIA'],     size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'cores',
      name:  'Cores',
      icon:  '🎨',
      color: '#b44dff',
      levels: [
        { words: ['AZUL','ROSA','ROXO','PRETO','VERDE'],                         size: 8,  time: 90,  maxErrors: 5 },
        { words: ['LARANJA','AMARELO','VERMELHO','BRANCO','CINZA'],              size: 10, time: 110, maxErrors: 4 },
        { words: ['TURQUESA','MAGENTA','DOURADO','PRATA','MARROM'],              size: 12, time: 150, maxErrors: 3 },
      ]
    },
  ]
};
