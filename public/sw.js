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
