const CACHE = "pascoli-libro-vivo-v9";
const SHELL = [
  "./","./index.html","./offline.html","./manifest.webmanifest",
  "./assets/styles.css","./assets/cover-fix.css?v=9","./assets/app.js?v=9",
  "./assets/icons/icon-180.png","./assets/icons/icon-192.png","./assets/icons/icon-512.png",
  "./assets/images/copertina-Pascoli.png","./assets/images/copertina-pascoli.webp",
  "./assets/images/01_mappa_generale_percorso.jpg","./assets/images/02_mondo_precedente.jpg",
  "./assets/images/03_fratture_e_nido.jpg","./assets/images/04_immagine_del_mondo.jpg",
  "./assets/images/05_poetica_del_fanciullino.jpg","./assets/images/06_forma_e_sintassi.jpg",
  "./assets/images/07_effetti_sonori.jpg","./assets/images/08_simbolismo_rete_di_segni.jpg",
  "./assets/images/09_x_agosto.jpg","./assets/images/10_gelsomino_notturno.jpg",
  "./assets/images/11_digitale_purpurea.jpg","./assets/images/12_conclusione_grandezza_e_limite.jpg",
  "./gelsomino/gelsomino.html","./gelsomino/style.css","./gelsomino/script.js",
  "./gelsomino/assets/pascoli_video.jpg","./gelsomino/assets/strofa1-versi.jpg","./gelsomino/assets/strofa1-realta.jpg",
  "./gelsomino/assets/strofa2-versi.jpg","./gelsomino/assets/strofa2-realta.jpg","./gelsomino/assets/strofa3-versi.jpg","./gelsomino/assets/strofa3-realta.jpg",
  "./gelsomino/assets/strofa4-versi.jpg","./gelsomino/assets/strofa4-realta.jpg","./gelsomino/assets/strofa5-versi.jpg","./gelsomino/assets/strofa5-realta.jpg",
  "./gelsomino/assets/strofa6-versi.jpg","./gelsomino/assets/strofa6-realta.jpg"
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
