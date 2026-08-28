const CACHE = 'dannunzio-ambiente-studio-v6';
const CORE = [
  './', './index.html', './offline.html', './manifest.webmanifest',
  './assets/styles.css?v=6', './assets/lessons-data.js?v=6', './assets/quiz-data.js?v=6', './assets/app.js?v=6',
  './assets/icons/favicon-32.png', './assets/icons/icon-180.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/images/copertina-dannunzio.png', './assets/images/copertina-dannunzio.webp',
  './assets/images/section-conclusione.svg', './assets/images/section-fratture.svg',
  './assets/images/section-immagine.svg', './assets/images/section-mondo.svg',
  './assets/images/section-opere.svg', './assets/images/section-poetica.svg',
  './assets/images/maps/allitterazione.png', './assets/images/maps/amore.png',
  './assets/images/maps/andrea-maria.png', './assets/images/maps/d-annunzio-nietzsche.png',
  './assets/images/maps/misticismo.png', './assets/images/maps/nascita-esteta.png',
  './assets/images/maps/onomatopea.png', './assets/images/maps/pandeismo-panismo.png',
  './assets/images/maps/piacere.png', './assets/images/maps/poetica.png',
  './assets/images/maps/primo-momento-panico.png', './assets/images/maps/scandali.png',
  './assets/images/maps/secondo-momento-panico.png', './assets/images/maps/similitudine.png',
  './assets/images/maps/superuomo.png', './assets/images/maps/tre-giorni.png',
  './assets/images/thumbs/allitterazione.webp', './assets/images/thumbs/amore.webp',
  './assets/images/thumbs/andrea-maria.webp', './assets/images/thumbs/d-annunzio-nietzsche.webp',
  './assets/images/thumbs/misticismo.webp', './assets/images/thumbs/nascita-esteta.webp',
  './assets/images/thumbs/onomatopea.webp', './assets/images/thumbs/pandeismo-panismo.webp',
  './assets/images/thumbs/piacere.webp', './assets/images/thumbs/poetica.webp',
  './assets/images/thumbs/primo-momento-panico.webp', './assets/images/thumbs/scandali.webp',
  './assets/images/thumbs/secondo-momento-panico.webp', './assets/images/thumbs/similitudine.webp',
  './assets/images/thumbs/superuomo.webp', './assets/images/thumbs/tre-giorni.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('dannunzio-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html') || caches.match('./offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
