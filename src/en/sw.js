const CACHE_NAME = "2024-02-25 09:42";
const urlsToCache = [
  "/emoji-concentration/",
  "/emoji-concentration/index.js",
  "/emoji-concentration/en/",
  "/emoji-concentration/data/en.csv",
  "/emoji-concentration/mp3/incorrect1.mp3",
  "/emoji-concentration/mp3/correct1.mp3",
  "/emoji-concentration/mp3/correct3.mp3",
  "/emoji-concentration/favicon/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
