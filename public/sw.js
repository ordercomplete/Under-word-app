// public/sw.js
const CACHE_NAME = "bible-app-v2";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  // Критичні JSON файли
  "/data/core.json",
  "/data/lang.json",
  "/data/translations.json",
  // Популярні глави
  "/data/originals/lxx/OldT/GEN/gen1_lxx.json",
  "/data/translations/utt/OldT/GEN/gen1_utt.json",
  // Популярні словники
  "/data/strongs/G4160.json",
  "/data/dictionaries/uk/G/G4160_uk.json",
];

// Інсталяція Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Активація
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Перехоплення запитів
self.addEventListener("fetch", (event) => {
  // Тільки GET запити
  if (event.request.method !== "GET") return;

  // Не кешуємо запити з параметрами (пошук, API)
  if (event.request.url.includes("?")) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Повертаємо з кешу, якщо є
      if (response) {
        return response;
      }

      // Завантажуємо з мережі
      return fetch(event.request)
        .then((networkResponse) => {
          // Кешуємо тільки успішні відповіді
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch((error) => {
          // Фолбек для даних
          if (event.request.url.includes("/data/")) {
            return new Response(
              JSON.stringify({
                error: "Немає підключення до мережі",
                url: event.request.url,
              }),
              {
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          throw error;
        });
    })
  );
});

// =======================

// // public/sw.js - виправлена версія
// self.addEventListener("fetch", (event) => {
//   // Тільки наші запити
//   if (!event.request.url.startsWith(self.location.origin)) {
//     return;
//   }

//   // Тільки GET
//   if (event.request.method !== "GET") return;

//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return fetch(event.request)
//         .then((response) => {
//           // Кешуємо тільки успішні відповіді та наші дані
//           if (response.status === 200 && event.request.url.includes("/data/")) {
//             const responseToCache = response.clone();
//             caches
//               .open(CACHE_NAME)
//               .then((cache) => cache.put(event.request, responseToCache));
//           }
//           return response;
//         })
//         .catch(() => {
//           // Фолбек для даних
//           return new Response(JSON.stringify({ error: "Offline mode" }), {
//             headers: { "Content-Type": "application/json" },
//           });
//         });
//     })
//   );
// });
