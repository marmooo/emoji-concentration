const CACHE_NAME="2024-02-25 09:42",urlsToCache=["/emoji-concentration/","/emoji-concentration/index.js","/emoji-concentration/en/","/emoji-concentration/data/en.csv","/emoji-concentration/mp3/incorrect1.mp3","/emoji-concentration/mp3/correct1.mp3","/emoji-concentration/mp3/correct3.mp3","/emoji-concentration/favicon/favicon.svg"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})