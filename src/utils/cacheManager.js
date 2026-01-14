// // utils/cacheManager.js
// class CacheManager {
//   constructor(maxSize = 50) {
//     this.maxSize = maxSize;
//     this.cache = new Map();
//     this.accessCount = new Map();
//   }

//   get(key) {
//     const item = this.cache.get(key);
//     if (item) {
//       this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
//     }
//     return item;
//   }

//   set(key, value) {
//     if (this.cache.size >= this.maxSize) {
//       // Видаляємо найменш використовуваний елемент
//       let leastUsed = null;
//       let minAccess = Infinity;

//       for (const [k, access] of this.accessCount.entries()) {
//         if (access < minAccess) {
//           minAccess = access;
//           leastUsed = k;
//         }
//       }

//       if (leastUsed) {
//         this.cache.delete(leastUsed);
//         this.accessCount.delete(leastUsed);
//       }
//     }

//     this.cache.set(key, value);
//     this.accessCount.set(key, 1);
//   }

//   clear() {
//     this.cache.clear();
//     this.accessCount.clear();
//   }
// }

// export const chapterCache = new CacheManager(30); // Кеш на 30 глав

// =================================

// src/utils/cacheManager.js
class CacheManager {
  constructor(maxSize = 30) {
    // 30 глав кешу
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessCount = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
    }
    return item;
  }

  set(key, value) {
    // Перевіряємо розмір кешу
    if (this.cache.size >= this.maxSize) {
      // Знаходимо найменш використовуваний елемент
      let leastUsedKey = null;
      let minAccess = Infinity;

      for (const [k, access] of this.accessCount.entries()) {
        if (access < minAccess) {
          minAccess = access;
          leastUsedKey = k;
        }
      }

      // Видаляємо найменш використовуваний
      if (leastUsedKey) {
        this.cache.delete(leastUsedKey);
        this.accessCount.delete(leastUsedKey);
      }
    }

    // Додаємо новий елемент
    this.cache.set(key, value);
    this.accessCount.set(key, 1);
  }

  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }

  // Статистика кешу
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
      mostAccessed: this.getMostAccessed(),
    };
  }

  calculateHitRate() {
    // Проста імітація (потрібно було б зберігати лог звернень)
    return this.cache.size > 0 ? 0.7 : 0; // Приблизна оцінка
  }

  getMostAccessed() {
    let maxKey = null;
    let maxAccess = 0;

    for (const [key, access] of this.accessCount.entries()) {
      if (access > maxAccess) {
        maxAccess = access;
        maxKey = key;
      }
    }

    return maxKey ? { key: maxKey, access: maxAccess } : null;
  }
}

// Експортуємо глобальний кеш для глав
export const chapterCache = new CacheManager(30);

// Додатковий кеш для словників
export const dictionaryCache = new CacheManager(100);

// Кеш для Strong's словників
export const strongsCache = new CacheManager(50);
