const CACHE="saba-gbprof-v2";
const ASSETS=["./","./index.html","./styles.css","./hero-photo.css","./content.js","./app.js","./manifest.webmanifest","./icons/icon.svg","./assets/images/hero-saba.png","./maps/01-mondo.svg","./maps/02-fratture.svg","./maps/03-mondo-interiore.svg","./maps/04-poetica.svg","./maps/05-opere.svg","./maps/06-sintesi.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match("./index.html"))))});
