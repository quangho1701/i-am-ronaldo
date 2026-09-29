const CACHE='ronaldo-static-v2';
const FILES=['/favicon.svg','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/fonts/nunito-400.ttf','/fonts/nunito-500.ttf','/fonts/nunito-600.ttf','/fonts/nunito-700.ttf','/fonts/nunito-800.ttf','/fonts/nunito-900.ttf','/mascot/ready.png','/mascot/training.png','/mascot/celebration.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ronaldo-static-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method==='GET'&&u.origin===self.location.origin&&FILES.includes(u.pathname))e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));});
