// // public/sw.js
// const CACHE_NAME = "bible-app-v2";
// const CACHE_URLS = [
//   "/",
//   "/index.html",
//   "/manifest.json",
//   // Критичні JSON файли
//   "/data/core.json",
//   "/data/lang.json",
//   "/data/translations.json",
//   // Популярні глави
//   "/data/originals/lxx/OldT/GEN/gen1_lxx.json",
//   "/data/translations/utt/OldT/GEN/gen1_utt.json",
//   // Популярні словники
//   "/data/strongs/G4160.json",
//   "/data/dictionaries/uk/G/G4160_uk.json",
// ];

// // Інсталяція Service Worker
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => cache.addAll(CACHE_URLS))
//       .then(() => self.skipWaiting())
//   );
// });

// // Активація
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (cacheName !== CACHE_NAME) {
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

// // Перехоплення запитів
// self.addEventListener("fetch", (event) => {
//   // Тільки GET запити
//   if (event.request.method !== "GET") return;

//   // Не кешуємо запити з параметрами (пошук, API)
//   if (event.request.url.includes("?")) return;

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Повертаємо з кешу, якщо є
//       if (response) {
//         return response;
//       }

//       // Завантажуємо з мережі
//       return fetch(event.request)
//         .then((networkResponse) => {
//           // Кешуємо тільки успішні відповіді
//           if (networkResponse.status === 200) {
//             const responseClone = networkResponse.clone();
//             caches
//               .open(CACHE_NAME)
//               .then((cache) => cache.put(event.request, responseClone));
//           }
//           return networkResponse;
//         })
//         .catch((error) => {
//           // Фолбек для даних
//           if (event.request.url.includes("/data/")) {
//             return new Response(
//               JSON.stringify({
//                 error: "Немає підключення до мережі",
//                 url: event.request.url,
//               }),
//               {
//                 headers: { "Content-Type": "application/json" },
//               }
//             );
//           }
//           throw error;
//         });
//     })
//   );
// });

// // =======================

// // // public/sw.js - виправлена версія
// // self.addEventListener("fetch", (event) => {
// //   // Тільки наші запити
// //   if (!event.request.url.startsWith(self.location.origin)) {
// //     return;
// //   }

// //   // Тільки GET
// //   if (event.request.method !== "GET") return;

// //   event.respondWith(
// //     caches.match(event.request).then((cachedResponse) => {
// //       if (cachedResponse) {
// //         return cachedResponse;
// //       }

// //       return fetch(event.request)
// //         .then((response) => {
// //           // Кешуємо тільки успішні відповіді та наші дані
// //           if (response.status === 200 && event.request.url.includes("/data/")) {
// //             const responseToCache = response.clone();
// //             caches
// //               .open(CACHE_NAME)
// //               .then((cache) => cache.put(event.request, responseToCache));
// //           }
// //           return response;
// //         })
// //         .catch(() => {
// //           // Фолбек для даних
// //           return new Response(JSON.stringify({ error: "Offline mode" }), {
// //             headers: { "Content-Type": "application/json" },
// //           });
// //         });
// //     })
// //   );
// // });

// =========================

// public/sw.js - ВИПРАВЛЕНА ВЕРСІЯ
const CACHE_NAME = "bible-app-v3";
const OFFLINE_URL = "/offline.html";

// Критичні ресурси для pre-cache
const CRITICAL_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/data/core.json",
  "/data/lang.json",
  "/data/translations.json",
  // Популярні глави
  "/data/originals/lxx/OldT/GEN/gen1_lxx.json",
  "/data/translations/utt/OldT/GEN/gen1_utt.json",
  "/data/originals/tr/NewT/MAT/mat1_tr.json",
  "/data/translations/utt/NewT/MAT/mat1_utt.json",
];

// ІНСТАЛЯЦІЯ
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching критичних ресурсів");
        return cache.addAll(CRITICAL_URLS).catch((error) => {
          console.warn("[Service Worker] Помилка pre-cache:", error);
          // Ігноруємо помилки для окремих ресурсів
        });
      })
      .then(() => {
        console.log("[Service Worker] Встановлено");
        return self.skipWaiting();
      })
  );
});

// АКТИВАЦІЯ
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Активація...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Видаляємо старий кеш:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Активовано");
        return self.clients.claim();
      })
  );
});

// ДОПОМІЖНА ФУНКЦІЯ: чи це наш запит?
const isOurRequest = (request) => {
  const url = new URL(request.url);

  // Ігноруємо:
  // 1. Chrome розширення
  // 2. Внешні домени
  // 3. Запити з параметрами (API)
  if (
    url.protocol === "chrome-extension:" ||
    url.protocol === "chrome:" ||
    !url.origin.startsWith(self.location.origin)
  ) {
    return false;
  }

  // Кешуємо тільки статичні ресурси та дані
  const path = url.pathname;
  return (
    path === "/" ||
    path.includes("/data/") ||
    path.includes(".css") ||
    path.includes(".js") ||
    path.includes(".json") ||
    path.includes(".html")
  );
};

// ДОПОМІЖНА ФУНКЦІЯ: кешування відповіді
const cacheResponse = (request, response) => {
  if (!response || response.status !== 200 || response.type !== "basic") {
    return;
  }

  // Не кешуємо великі файли
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
    // 5MB
    console.log(
      "[Service Worker] Файл занадто великий для кешування:",
      request.url
    );
    return;
  }

  // Кешуємо
  const responseToCache = response.clone();
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, responseToCache).catch((error) => {
      console.warn("[Service Worker] Помилка кешування:", error);
    });
  });
};

// ПЕРЕХОПЛЕННЯ ЗАПИТІВ
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ігноруємо:
  // 1. Не наші запити
  // 2. Не GET запити
  // 3. Запити з параметрами (пошук, API)
  if (
    !isOurRequest(request) ||
    request.method !== "GET" ||
    request.url.includes("?") ||
    (request.cache === "only-if-cached" && request.mode !== "same-origin")
  ) {
    return;
  }

  // Для навігаційних запитів - особлива обробка
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Для HTML - спеціальна логіка
          if (response.headers.get("content-type")?.includes("text/html")) {
            cacheResponse(request, response);
          }
          return response;
        })
        .catch(() => {
          // Офлайн режим для навігації
          return (
            caches.match("/index.html") ||
            caches.match(OFFLINE_URL) ||
            new Response("<h1>Offline</h1>", {
              headers: { "Content-Type": "text/html" },
            })
          );
        })
    );
    return;
  }

  // Для статичних ресурсів
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // 1. Повертаємо з кешу, якщо є
      if (cachedResponse) {
        console.log("[Service Worker] Cache hit:", request.url);
        return cachedResponse;
      }

      // 2. Завантажуємо з мережі
      console.log("[Service Worker] Cache miss, завантаження:", request.url);
      return fetch(request)
        .then((response) => {
          // Кешуємо успішні відповіді
          cacheResponse(request, response);
          return response;
        })
        .catch((error) => {
          console.log(
            "[Service Worker] Помилка завантаження:",
            request.url,
            error
          );

          // Для даних JSON - повертаємо заглушку
          if (request.url.includes(".json")) {
            return new Response(
              JSON.stringify({
                error: "Offline mode",
                url: request.url,
                timestamp: new Date().toISOString(),
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Offline": "true",
                },
              }
            );
          }

          throw error;
        });
    })
  );
});

// СИНХРОНІЗАЦІЯ ПРИ ВІДНОВЛЕННІ ЗВ'ЯЗКУ
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    console.log("[Service Worker] Синхронізація даних...");
    event.waitUntil(syncData());
  }
});

const syncData = async () => {
  // Тут може бути логіка синхронізації
  console.log("[Service Worker] Дані синхронізовано");
};

// ПОВІДОМЛЕННЯ
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    console.log("[Service Worker] Очистка кешу за запитом");
    caches.delete(CACHE_NAME);
  }

  if (event.data && event.data.type === "GET_CACHE_INFO") {
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.keys())
      .then((keys) => {
        event.ports[0].postMessage({
          type: "CACHE_INFO",
          count: keys.length,
          urls: keys.map((req) => req.url),
        });
      });
  }
});

// ВИДАЛЕННЯ ЗАЙВОГО КЕШУ ПРИ НЕДОСТАТІ МІСЦЯ
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "cleanup-cache") {
    event.waitUntil(cleanupCache());
  }
});

const cleanupCache = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    if (keys.length > 100) {
      // Максимум 100 записів
      // Видаляємо найстаріші
      keys.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });

      const toDelete = keys.slice(0, keys.length - 100);
      await Promise.all(toDelete.map((key) => cache.delete(key)));
      console.log(
        "[Service Worker] Видалено",
        toDelete.length,
        "зайвих записів"
      );
    }
  } catch (error) {
    console.error("[Service Worker] Помилка очистки кешу:", error);
  }
};

console.log("[Service Worker] Завантажено");
