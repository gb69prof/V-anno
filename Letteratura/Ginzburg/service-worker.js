const CACHE = "ginzburg-v1.0.0";
const CORE = [
  "./", "./index.html", "./styles.css", "./hero-photo.css", "./content.js", "./app.js", "./offline.html",
  "./manifest.webmanifest", "./assets/icons/icon.svg", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/images/hero-ginzburg.png",
  "./assets/maps/01-mondo.svg", "./assets/maps/02-fratture.svg", "./assets/maps/03-immagine.svg",
  "./assets/maps/04-poetica.svg", "./assets/maps/05-opere.svg", "./assets/maps/06-conclusione.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
