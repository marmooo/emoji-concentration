var CACHE_NAME="2022-06-15 00:10",urlsToCache=["/emoji-concentration/","/emoji-concentration/index.js","/emoji-concentration/en/","/emoji-concentration/data/en.csv","/emoji-concentration/mp3/incorrect1.mp3","/emoji-concentration/mp3/correct1.mp3","/emoji-concentration/mp3/correct3.mp3","/emoji-concentration/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"];self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(e){return e.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(t){return t||fetch(e.request)}))}),self.addEventListener("activate",function(e){var t=[CACHE_NAME];e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){if(t.indexOf(e)===-1)return caches.delete(e)}))}))})