const CACHE = "vittorini-v1";
const ASSETS = [
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../../privacy.html",
  "../../accessibilita.html",
  "./", "./index.html", "./styles.css", "./hero-photo.css", "./content.js", "./app.js",
  "./manifest.webmanifest", "./assets/icon.svg", "./assets/icon-192.png",
  "./assets/icon-512.png", "./assets/images/hero-vittorini.png", "./assets/maps/01-mondo.svg",
  "./assets/maps/02-fratture.svg", "./assets/maps/03-immagine.svg",
  "./assets/maps/04-poetica.svg", "./assets/maps/05-opere.svg",
  "./assets/maps/06-conclusione.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE && key.startsWith(String(CACHE).includes("-v") ? String(CACHE).replace(/-v.*$/i, "-") : String(CACHE))).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
