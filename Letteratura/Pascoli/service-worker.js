const CACHE = "pascoli-libro-vivo-v1";
const SHELL = [
  "./","./index.html","./offline.html","./manifest.webmanifest",
  "./assets/styles.css","./assets/app.js",
  "./assets/icons/icon-180.png","./assets/icons/icon-192.png","./assets/icons/icon-512.png",
  "./assets/images/copertina-Pascoli.png","./assets/images/copertina-pascoli.webp",
  "./assets/images/01_mappa_generale_percorso.webp","./assets/images/02_mondo_precedente.webp",
  "./assets/images/03_fratture_e_nido.webp","./assets/images/04_immagine_del_mondo.webp",
  "./assets/images/05_poetica_del_fanciullino.webp","./assets/images/06_forma_e_sintassi.webp",
  "./assets/images/07_effetti_sonori.webp","./assets/images/08_simbolismo_rete_di_segni.webp",
  "./assets/images/09_x_agosto.webp","./assets/images/10_gelsomino_notturno.webp",
  "./assets/images/11_digitale_purpurea.webp","./assets/images/12_conclusione_grandezza_e_limite.webp"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("pascoli-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin) return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(event.request,c));return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html")||caches.match("./offline.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{if(r.ok)caches.open(CACHE).then(cache=>cache.put(event.request,r.clone()));return r;})));
});
