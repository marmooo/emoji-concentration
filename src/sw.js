var CACHE_NAME = '2022-02-13 17:05';
var urlsToCache = [
  "/emoji-concentration/",
  "/emoji-concentration/index.js",
  "/emoji-concentration/en/",
  "/emoji-concentration/ja/",
  "/emoji-concentration/data/en.csv",
  "/emoji-concentration/data/ja.csv",
  "/emoji-concentration/mp3/incorrect1.mp3",
  "/emoji-concentration/mp3/correct1.mp3",
  "/emoji-concentration/mp3/correct3.mp3",
  "/emoij-concentration/favicon/favicon-48x48.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
