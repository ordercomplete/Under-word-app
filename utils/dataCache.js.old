// utils/dataCache.js
const chapterCache = new Map();

export const getCachedChapter = (key) => chapterCache.get(key);
export const setCachedChapter = (key, data) => chapterCache.set(key, data);
export const clearCache = () => chapterCache.clear();

// Використання:
const cacheKey = `${book}.${chapter}.${versions.join(",")}`;
const cached = getCachedChapter(cacheKey);
if (cached) {
  // Використовуємо кеш
}
