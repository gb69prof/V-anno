const CACHE='montale-v1.0.1';
const ASSETS=[
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../../privacy.html",
  "../../accessibilita.html",'./','./index.html','./styles.css','./hero-photo.css','./content.js','./app.js','./manifest.webmanifest','./icons/icon-192.svg','./icons/icon-512.svg','./assets/images/hero-montale.png','./maps/01-mondo.svg','./maps/02-fratture.svg','./maps/03-visione.svg','./maps/04-poetica.svg','./maps/05-opere.svg','./maps/06-conclusione.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k => k !== CACHE && k.startsWith(String(CACHE).includes("-v") ? String(CACHE).replace(/-v.*$/i, "-") : String(CACHE))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match('./index.html'))));});
