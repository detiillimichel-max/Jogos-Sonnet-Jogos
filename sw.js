const CACHE = 'elo-palavras-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/global.css',
  '/css/ui.css',
  '/css/game.css',
  '/js/data/words.js',
  '/js/services/storage.js',
  '/js/engine/grid.js',
  '/js/engine/selection.js',
  '/js/engine/game.js',
  '/js/components/hud.js',
  '/js/components/screens.js',
  '/js/app.js',
  '/icon-192-2.png',
  '/icon-512-4.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url =>
        cache.add(url).catch(() => console.warn('[SW] falhou:', url))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
