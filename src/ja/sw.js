var CACHE_NAME = "2022-07-24 00:46";
var urlsToCache = [
  "/emoji-concentration/",
  "/emoji-concentration/index.js",
  "/emoji-concentration/ja/",
  "/emoji-concentration/ja/index.yomi",
  "/emoji-concentration/data/ja.csv",
  "/emoji-concentration/mp3/incorrect1.mp3",
  "/emoji-concentration/mp3/correct1.mp3",
  "/emoji-concentration/mp3/correct3.mp3",
  "/emoji-concentration/favicon/favicon.svg",
  "https://marmooo.github.io/yomico/yomico.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
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
