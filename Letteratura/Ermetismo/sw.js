const CACHE = 'ermetismo-v2';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './app.js', './manifest.webmanifest',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './assets/maps/mappa-sintesi.svg', './assets/maps/01-mondo.svg',
  './assets/maps/02-fratture.svg', './assets/maps/03-visione.svg',
  './assets/maps/04-poetica.svg', './assets/maps/05-opere.svg',
  './assets/maps/06-conclusione.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
