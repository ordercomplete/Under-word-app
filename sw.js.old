// public\sw.js - не розумію для чого файл і де він повинен бути
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("bible-cache").then((cache) => {
      return cache.addAll([
        "/data/strongs.json",
        "/data/core.json",
        // додайте всі JSON глав
      ]);
    })
  );
});
