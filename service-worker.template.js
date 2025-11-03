// キャッシュ名にバージョンを埋め込むためのプレースホルダー
const CACHE_NAME = "srt-perview-cache-__CACHE_VERSION__";

// キャッシュするファイルのリスト
const urlsToCache = [
  "./",
  "./index.html",
  "./viewer.html",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js",
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
];

// installイベント: ファイルをキャッシュする
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// activateイベント: 古いキャッシュを削除する
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetchイベント: リクエストに応じてキャッシュから返す
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュにあればそれを返す
      if (response) {
        return response;
      }
      //なければネットワークから取得
      return fetch(event.request);
    })
  );
});
