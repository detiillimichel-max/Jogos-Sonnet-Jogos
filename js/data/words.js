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
const WordData = {
  themes: [
    {
      id:    'animais',
      name:  'Animais',
      icon:  '🐾',
      color: '#39f587',
      levels: [
        { words: ['GATO','LEAO','URSO','LOBO','PATO'], size: 8, time: 90, maxErrors: 5 },
        { words: ['COBRA','TIGRE','GIRAFA','MACACO','ONCA'], size: 10, time: 110, maxErrors: 4 },
        { words: ['CACHORRO','ELEFANTE','PAPAGAIO','JACARE','TARTARUGA'], size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'frutas',
      name:  'Frutas',
      icon:  '🍎',
      color: '#ff4d6d',
      levels: [
        { words: ['MACA','PERA','UVA','KIWI','FIGO'], size: 8, time: 90, maxErrors: 5 },
        { words: ['BANANA','MANGA','MELAO','MORANGO','LIMAO'], size: 10, time: 110, maxErrors: 4 },
        { words: ['ABACAXI','MARACUJA','FRAMBOESA','GOIABA','LARANJA'], size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'esportes',
      name:  'Esportes',
      icon:  '⚽',
      color: '#ffe033',
      levels: [
        { words: ['SURF','BOXE','POLO','GOLF','LUTA'], size: 8, time: 90, maxErrors: 5 },
        { words: ['TENIS','VOLEI','FUTEBOL','NATACAO','CICLISMO'], size: 10, time: 110, maxErrors: 4 },
        { words: ['BASQUETE','GINASTICA','ATLETISMO','HANDEBOL','BADMINTON'], size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'paises',
      name:  'Países',
      icon:  '🌍',
      color: '#00e5ff',
      levels: [
        { words: ['CHILE','CHINA','CUBA','PERU','IRAQ'], size: 8, time: 90, maxErrors: 5 },
        { words: ['BRASIL','JAPAO','ITALIA','RUSSIA','CANADA'], size: 10, time: 110, maxErrors: 4 },
        { words: ['AUSTRALIA','ALEMANHA','PORTUGAL','ARGENTINA','COLOMBIA'], size: 12, time: 150, maxErrors: 3 },
      ]
    },
    {
      id:    'cores',
      name:  'Cores',
      icon:  '🎨',
      color: '#b44dff',
      levels: [
        { words: ['AZUL','ROSA','ROXO','PRETO','VERDE'], size: 8, time: 90, maxErrors: 5 },
        { words: ['LARANJA','AMARELO','VERMELHO','BRANCO','CINZA'], size: 10, time: 110, maxErrors: 4 },
        { words: ['TURQUESA','MAGENTA','DOURADO','PRATA','MARROM'], size: 12, time: 150, maxErrors: 3 },
      ]
    },
  ]
};
const WordData = {
  themes: [
    {
      id: 'animais',
      name: 'Animais',
      icon: '🐾',
      color: '#39f587',
      levels: [
        { words: ['GATO','LEAO','URSO','LOBO','PATO'], size: 8, time: 90, maxErrors: 5 },
        { words: ['COBRA','TIGRE','GIRAFA','MACACO','ONCA'], size: 9, time: 100, maxErrors: 5 },
        { words: ['CACHORRO','ELEFANTE','PAPAGAIO','JACARE','TARTARUGA'], size: 10, time: 110, maxErrors: 4 },
        { words: ['CAVALO','GOLFINHO','PINGUIM','RINOCERONTE','MORCEGO'], size: 11, time: 120, maxErrors: 4 },
        { words: ['CAMALEAO','FLAMINGO','HIPOPOTAMO','TAMANDUA','ARARA'], size: 12, time: 135, maxErrors: 4 },
        { words: ['ESQUILO','GUEPARDO','PANTERA','SURICATE','CAPIVARA'], size: 13, time: 150, maxErrors: 3 },
        { words: ['BALEIA','CORUJA','GORILA','IGUANA','COELHO'], size: 14, time: 165, maxErrors: 3 },
        { words: ['ABELHA','FORMIGA','GAFANHOTO','LIBELULA','BORBOLETA'], size: 15, time: 180, maxErrors: 3 },
      ]
    },
    {
      id: 'frutas',
      name: 'Frutas',
      icon: '🍎',
      color: '#ff4d6d',
      levels: [
        { words: ['MACA','PERA','UVA','KIWI','FIGO'], size: 8, time: 90, maxErrors: 5 },
        { words: ['BANANA','MANGA','MELAO','MORANGO','LIMAO'], size: 9, time: 100, maxErrors: 5 },
        { words: ['ABACAXI','MARACUJA','FRAMBOESA','GOIABA','LARANJA'], size: 10, time: 110, maxErrors: 4 },
        { words: ['CEREJA','AMEIXA','PITANGA','CAJU','ACEROLA'], size: 11, time: 120, maxErrors: 4 },
        { words: ['JABUTICABA','CARAMBOLA','GRAVIOLA','TAMARINDO','CUPUACU'], size: 12, time: 135, maxErrors: 4 },
        { words: ['MELANCIA','PESSEGO','DAMASCO','MAMAO','COCO'], size: 13, time: 150, maxErrors: 3 },
        { words: ['ABACATE','AMORA','PITAYA','JACA','MANGABA'], size: 14, time: 165, maxErrors: 3 },
        { words: ['FRUTA PAO','JENIPAPO','CAMBUCI','BACURI','UMBU'], size: 15, time: 180, maxErrors: 3 },
      ]
    },
    {
      id: 'esportes',
      name: 'Esportes',
      icon: '⚽',
      color: '#ffe033',
      levels: [
        { words: ['SURF','BOXE','POLO','GOLF','LUTA'], size: 8, time: 90, maxErrors: 5 },
        { words: ['TENIS','VOLEI','FUTEBOL','NATACAO','CICLISMO'], size: 9, time: 100, maxErrors: 5 },
        { words: ['BASQUETE','GINASTICA','ATLETISMO','HANDEBOL','BADMINTON'], size: 10, time: 110, maxErrors: 4 },
        { words: ['ESGRIMA','JUDO','KARATE','RUGBY','SKATE'], size: 11, time: 120, maxErrors: 4 },
        { words: ['MARATONA','TRIATLO','CANOAGEM','ESCALADA','PATINACAO'], size: 12, time: 135, maxErrors: 4 },
        { words: ['BICICROSS','PARAQUEDISMO','WINDSURF','KITESURF','SNOWBOARD'], size: 13, time: 150, maxErrors: 3 },
        { words: ['FUTSAL','BEISEBOL','CRIQUETE','POLO AQUATICO','TIRO COM ARCO'], size: 14, time: 165, maxErrors: 3 },
        { words: ['CURLING','BIATLO','ESQUI','HOCKEY','LEVANTAMENTO'], size: 15, time: 180, maxErrors: 3 },
      ]
    },
    {
      id: 'paises',
      name: 'Países',
      icon: '🌍',
      color: '#00e5ff',
      levels: [
        { words: ['CHILE','CHINA','CUBA','PERU','IRAQ'], size: 8, time: 90, maxErrors: 5 },
        { words: ['BRASIL','JAPAO','ITALIA','RUSSIA','CANADA'], size: 9, time: 100, maxErrors: 5 },
        { words: ['ALEMANHA','PORTUGAL','ARGENTINA','COLOMBIA','MEXICO'], size: 10, time: 110, maxErrors: 4 },
        { words: ['AUSTRALIA','ESPANHA','FRANCA','INGLATERRA','NORUEGA'], size: 11, time: 120, maxErrors: 4 },
        { words: ['SUICA','SUECIA','FINLANDIA','DINAMARCA','HOLANDA'], size: 12, time: 135, maxErrors: 4 },
        { words: ['BELGICA','GRECIA','TURQUIA','EGITO','MARROCOS'], size: 13, time: 150, maxErrors: 3 },
        { words: ['POLONIA','UCRANIA','ROMENIA','HUNGRIA','CROACIA'], size: 14, time: 165, maxErrors: 3 },
        { words: ['TAILANDIA','VIETNA','INDONESIA','FILIPINAS','MALASIA'], size: 15, time: 180, maxErrors: 3 },
      ]
    },
    {
      id: 'cores',
      name: 'Cores',
      icon: '🎨',
      color: '#b44dff',
      levels: [
        { words: ['AZUL','ROSA','ROXO','PRETO','VERDE'], size: 8, time: 90, maxErrors: 5 },
        { words: ['LARANJA','AMARELO','VERMELHO','BRANCO','CINZA'], size: 9, time: 100, maxErrors: 5 },
        { words: ['TURQUESA','MAGENTA','DOURADO','PRATA','MARROM'], size: 10, time: 110, maxErrors: 4 },
        { words: ['BEGE','CREME','VINHO','SALMAO','CORAL'], size: 11, time: 120, maxErrors: 4 },
        { words: ['LILAS','ANIL','CIANO','OCRE','INDIGO'], size: 12, time: 135, maxErrors: 4 },
        { words: ['ESMERALDA','JADE','RUBI','SAFIRA','AMETISTA'], size: 13, time: 150, maxErrors: 3 },
        { words: ['CARMIN','BORDO','OLIVA','MOSTARDA','PETROLEO'], size: 14, time: 165, maxErrors: 3 },
        { words: ['FERRUGEM','GRAFITE','MARFIM','PESSEGO','TURMALINA'], size: 15, time: 180, maxErrors: 3 },
      ]
    },
    {
      id: 'profissoes',
      name: 'Profissões',
      icon: '💼',
      color: '#ff9f1c',
      levels: [
        { words: ['MEDICO','ADVOGADO','PROFESSOR','ENGENHEIRO','CHEF'], size: 9, time: 100, maxErrors: 5 },
        { words: ['BOMBEIRO','POLICIAL','DENTISTA','ARQUITETO','PILOTO'], size: 10, time: 110, maxErrors: 4 },
        { words: ['JORNALISTA','VETERINARIO','FARMACEUTICO','PROGRAMADOR','DESIGNER'], size: 12, time: 130, maxErrors: 4 },
        { words: ['ELETRICISTA','MECANICO','CARPINTEIRO','ENCANADOR','PEDREIRO'], size: 13, time: 150, maxErrors: 3 },
      ]
    },
  ]
};
