var CACHE_NAME="2023-06-17 13:00",urlsToCache=["/emoji-concentration/","/emoji-concentration/index.js","/emoji-concentration/en/","/emoji-concentration/data/en.csv","/emoji-concentration/mp3/incorrect1.mp3","/emoji-concentration/mp3/correct1.mp3","/emoji-concentration/mp3/correct3.mp3","/emoji-concentration/favicon/favicon.svg"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})