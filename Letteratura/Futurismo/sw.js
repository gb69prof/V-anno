"use strict";
const CACHE="futurismo-gbprof-v1.0.1";
const ASSETS=[
  "./","./index.html","./style.css","./app.js","./manifest.webmanifest","./icon.svg",
  "./maps/01-mondo.svg","./maps/02-fratture.svg","./maps/03-immagine.svg",
  "./maps/04-poetica.svg","./maps/05-opere.svg","./maps/06-conclusione.svg"
];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    if(response&&response.ok&&new URL(event.request.url).origin===location.origin){const clone=response.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}
    return response;
  }).catch(()=>caches.match("./index.html"))));
});
