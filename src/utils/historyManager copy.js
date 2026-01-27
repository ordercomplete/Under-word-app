// src\utils\historyManager.js
/**
 * Глобальний менеджер історії перегляду для словників
 * Підтримує розділення історії для оригіналів та перекладів
 */

export class HistoryManager {
  // constructor(type = "global", maxSize = 100) {
  constructor(windowId, maxSize = 100) {
    this.windowId = windowId;
    // this.type = type; // 'strong' або 'dictionary' або 'global'
    this.maxSize = maxSize;
    this.history = this.loadFromStorage();
    this.currentIndex = Math.max(this.history.length - 1, 0);
  }

  /**
   * Завантажує історію з localStorage
   */
  loadFromStorage() {
    try {
      const key = `lexicon_history_${this.type}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Помилка завантаження історії:", error);
      return [];
    }
  }

  /**
   * Зберігає історію в localStorage
   */
  saveToStorage() {
    try {
      const key = `lexicon_history_${this.type}`;
      localStorage.setItem(
        key,
        JSON.stringify(this.history.slice(-this.maxSize)),
      );
    } catch (error) {
      console.error("Помилка збереження історії:", error);
    }
  }

  /**
   * Додає запис до історії
   */
  addEntry(entry) {
    if (!entry || !entry.id) {
      // console.warn("Невалідний запис для історії");
      // return this.getState();
      console.warn("Спроба додати невалідний запис до історії");
      return this.getCurrentState();
    }

    // Дозволяємо додавати порожні записи та записи з помилками
    // для підтримки навігації навіть коли файли відсутні
    const shouldAddEntry = entry.isEmpty || entry.isError || entry.word;

    if (!shouldAddEntry) {
      console.warn("Запис не містить обов'язкових даних для історії");
      return this.getCurrentState();
    }

    // Перевіряємо, чи це вже останній запис
    const lastEntry = this.history[this.history.length - 1];
    if (lastEntry && lastEntry.id === entry.id) {
      // return this.getState();
      return this.getCurrentState();
    }

    // // Видаляємо дублікати
    // this.history = this.history.filter((item) => item.id !== entry.id);

    // ФІЛЬТР ДУБЛІКАТІВ: порівнюємо за strong кодом та словом
    // (не за ID, бо ID містить timestamp)
    const isDuplicate = this.history.some(
      (item) =>
        item.word?.strong === entry.word?.strong &&
        item.word?.word === entry.word?.word &&
        item.isOriginal === entry.isOriginal,
    );

    if (isDuplicate) {
      console.log("⏩ Пропускаємо дублікат в історії:", entry.word?.strong);
      // Переміщуємо існуючий запис в кінець (оновлюємо timestamp)
      this.history = this.history.filter(
        (item) =>
          !(
            item.word?.strong === entry.word?.strong &&
            item.word?.word === entry.word?.word &&
            item.isOriginal === entry.isOriginal
          ),
      );
    }

    // // Додаємо новий запис
    // this.history.push({
    //   ...entry,
    //   timestamp: Date.now(),
    //   type: this.type,
    // });

    // Додаємо новий запис
    this.history.push({
      ...entry,
      timestamp: Date.now(),
      // Гарантуємо наявність основних полів
      word: entry.word || {
        word: "",
        strong: entry.code || "",
        lemma: "",
        morph: "",
        dict: entry.dictCode || "",
      },
      isEmpty: entry.isEmpty || false,
      isError: entry.isError || false,
    });

    // Обмежуємо розмір
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(-this.maxSize);
    }

    this.currentIndex = this.history.length - 1;
    this.saveToStorage();

    console.log(`📝 Додано запис в історію ${this.windowId}:`, {
      id: entry.id,
      code: entry.code || entry.word?.strong,
      type: entry.isEmpty ? "empty" : entry.isError ? "error" : "normal",
      position: this.currentIndex + 1,
    });

    return this.getState();
    // return this.getCurrentState();
  }

  /**
   * Оновлює дані в існуючому записі
   * Наприклад, коли fallback запис замінюється на повний
   */
  updateEntry(entryId, updates) {
    const index = this.history.findIndex((entry) => entry.id === entryId);
    if (index !== -1) {
      this.history[index] = {
        ...this.history[index],
        ...updates,
        timestamp: Date.now(),
      };
      this.saveToStorage();
      return this.history[index];
    }
    return null;
  }

  /**
   * Замінює fallback запис на повний
   */
  replaceFallbackWithFull(fallbackId, fullEntry) {
    const fallbackIndex = this.history.findIndex(
      (e) => e.id === fallbackId && e.isError,
    );
    if (fallbackIndex === -1) {
      // Якщо fallback не знайдено, просто додаємо новий запис
      return this.addEntry(fullEntry);
    }

    // Замінюємо fallback на повний запис
    this.history[fallbackIndex] = {
      ...fullEntry,
      id: fullEntry.id, // Зберігаємо новий ID
      replaces: fallbackId, // Позначаємо, що замінює fallback
    };

    this.saveToStorage();

    // Якщо ми замінили поточний запис, оновлюємо індекс
    if (this.currentIndex === fallbackIndex) {
      this.currentIndex = fallbackIndex;
    }

    return this.history[fallbackIndex];
  }

  /**
   * Отримує запис за кодом Strong або словника
   */
  getEntryByCode(code) {
    return this.history.find(
      (entry) =>
        entry.code === code ||
        entry.word?.strong === code ||
        entry.word?.dict === code,
    );
  }

  /**
   * Видаляє всі fallback записи для певного коду
   */
  removeFallbackEntriesForCode(code) {
    const initialLength = this.history.length;
    this.history = this.history.filter(
      (entry) =>
        !(
          entry.isError &&
          (entry.code === code ||
            entry.word?.strong === code ||
            entry.word?.dict === code)
        ),
    );

    if (this.history.length !== initialLength) {
      this.saveToStorage();
      this.currentIndex = Math.min(this.currentIndex, this.history.length - 1);
    }
  }

  // Додати метод для отримання статистики
  getStats() {
    const total = this.history.length;
    const normal = this.history.filter((e) => !e.isEmpty && !e.isError).length;
    const empty = this.history.filter((e) => e.isEmpty).length;
    const errors = this.history.filter((e) => e.isError).length;

    return { total, normal, empty, errors };
  }

  // У методі addGlobalEntry також додаємо фільтрацію:
  addGlobalEntry(data) {
    try {
      const { word, origVer } = data;
      if (!word || !origVer) return null;

      const entryId = `${origVer}:${word.strong}:${Date.now()}`;
      const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
        origVer.toUpperCase(),
      );

      const entry = {
        id: entryId,
        data: data,
        origVer: origVer,
        word: {
          word: word.word,
          strong: word.strong,
          lemma: word.lemma,
          morph: word.morph,
          dict: word.dict,
        },
        lang: word.strong?.startsWith("H") ? "he" : "gr",
        isOriginal: isOriginal,
        timestamp: Date.now(),
        type: isOriginal ? "strong" : "dictionary",
      };

      const globalManager = this.getManager("global");
      return globalManager.addEntry(entry);
    } catch (error) {
      console.error("Помилка додавання запису в глобальну історію:", error);
      return null;
    }
  }

  /**
   * Перехід назад в історії
   */
  goBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.saveToStorage();
      return this.getCurrentEntry();
    }
    return null;
  }

  /**
   * Перехід вперед в історії
   */
  goForward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.saveToStorage();
      return this.getCurrentEntry();
    }
    return null;
  }

  /**
   * Отримує поточний запис
   */
  getCurrentEntry() {
    return this.history[this.currentIndex] || null;
  }

  /**
   * Перевіряє, чи можна перейти назад
   */
  canGoBack() {
    return this.currentIndex > 0;
  }

  /**
   * Перевіряє, чи можна перейти вперед
   */
  canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Отримує поточний стан
   */
  // getState() {
  //   return {
  //     current: this.getCurrentEntry(),
  //     canGoBack: this.canGoBack(),
  //     canGoForward: this.canGoForward(),
  //     position:
  //       this.history.length > 0
  //         ? `${this.currentIndex + 1}/${this.history.length}`
  //         : "1/1",
  //     history: [...this.history],
  //     type: this.type,
  //   };
  // }
  getState() {
    return {
      current: this.getCurrentEntry(),
      canGoBack: this.canGoBack(),
      canGoForward: this.canGoForward(),
      position: `${this.currentIndex + 1}/${this.history.length}`,
      history: [...this.history],
    };
  }

  /**
   * Очищає історію
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.saveToStorage();
  }

  /**
   * Отримує всі записи
   */
  getAll() {
    return [...this.history];
  }

  /**
   * Отримує запис за індексом
   */
  getEntry(index) {
    if (index >= 0 && index < this.history.length) {
      this.currentIndex = index;
      this.saveToStorage();
      return this.getCurrentEntry();
    }
    return null;
  }
}

/**
 * Глобальний менеджер для всіх типів словників
 */
// export const globalHistoryManager = {
//   managers: {
//     strong: new HistoryManager("strong"),
//     dictionary: new HistoryManager("dictionary"),
//     global: new HistoryManager("global"), // Для вузьких екранів
//   },

//   getGlobalState: function () {
//     const manager = this.getManager("global");
//     return manager.getState();
//   },
//   /**
//    * Отримує менеджер за типом
//    */
//   getManager(type) {
//     if (!this.managers[type]) {
//       this.managers[type] = new HistoryManager(type);
//     }
//     return this.managers[type];
//   },

//   /**
//    * Додає запис до відповідного менеджера
//    */
//   addEntry(data) {
//     try {
//       const { word, origVer } = data;
//       if (!word || !origVer) return null;

//       // Визначаємо тип за версією
//       const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
//         origVer.toUpperCase(),
//       );
//       const type = isOriginal ? "strong" : "dictionary";
//       const manager = this.getManager(type);

//       // Створюємо унікальний ID
//       const entryId = `${origVer}:${word.strong}:${Date.now()}`;

//       const entry = {
//         id: entryId,
//         data: data,
//         origVer: origVer,
//         word: {
//           word: word.word,
//           strong: word.strong,
//           lemma: word.lemma,
//           morph: word.morph,
//           dict: word.dict,
//         },
//         lang: word.strong?.startsWith("H") ? "he" : "gr",
//         isOriginal: isOriginal,
//         timestamp: Date.now(),
//       };

//       return manager.addEntry(entry);
//     } catch (error) {
//       console.error("Помилка додавання запису в історію:", error);
//       return null;
//     }
//   },
//   /**
//    * Додає запис в глобальну історію та повертає її стан
//    */
//   addGlobalEntry: function (data) {
//     try {
//       const manager = this.getManager("global");

//       if (!data || !data.word) {
//         console.error("Невірні дані для історії:", data);
//         return manager.getCurrentState();
//       }

//       // Створюємо запис для історії
//       const historyEntry = {
//         id: `${data.origVer || "unknown"}:${data.word.strong || "unknown"}:${Date.now()}`,
//         data: data,
//         origVer: data.origVer,
//         word: {
//           word: data.word.word || "",
//           strong: data.word.strong || "",
//           lemma: data.word.lemma || "",
//           morph: data.word.morph || "",
//           dict: data.word.dict || "",
//         },
//         lang: data.word.strong?.startsWith("H") ? "he" : "gr",
//         isOriginal: ["LXX", "THOT", "TR", "GNT"].includes(
//           (data.origVer || "").toUpperCase(),
//         ),
//         timestamp: Date.now(),
//       };

//       const state = manager.addEntry(historyEntry);
//       console.log("Додано запис в глобальну історію:", historyEntry.id);
//       return state;
//     } catch (error) {
//       console.error("Помилка додавання в глобальну історію:", error);
//       return null;
//     }
//   },
//   /**
//    * Для вузьких екранів - додаємо в глобальну історію
//    */
//   addGlobalEntry(data) {
//     try {
//       const { word, origVer } = data;
//       if (!word || !origVer) return null;

//       const entryId = `${origVer}:${word.strong}:${Date.now()}`;
//       const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
//         origVer.toUpperCase(),
//       );

//       const entry = {
//         id: entryId,
//         data: data,
//         origVer: origVer,
//         word: {
//           word: word.word,
//           strong: word.strong,
//           lemma: word.lemma,
//           morph: word.morph,
//           dict: word.dict,
//         },
//         lang: word.strong?.startsWith("H") ? "he" : "gr",
//         isOriginal: isOriginal,
//         timestamp: Date.now(),
//         type: isOriginal ? "strong" : "dictionary",
//       };

//       const globalManager = this.getManager("global");
//       return globalManager.addEntry(entry);
//     } catch (error) {
//       console.error("Помилка додавання запису в глобальну історію:", error);
//       return null;
//     }
//   },

//   /**
//    * Очищає всі історії
//    */
//   clearAll() {
//     Object.values(this.managers).forEach((manager) => manager.clear());
//   },
// };
export const globalHistoryManager = {
  managers: {
    global: new HistoryManager("global"),
  },

  getManager(type = "global") {
    if (!this.managers[type]) {
      this.managers[type] = new HistoryManager(type);
    }
    return this.managers[type];
  },

  // ТІЛЬКИ ОДИН addGlobalEntry метод:
  addGlobalEntry(data) {
    try {
      const manager = this.getManager("global");

      if (!data || !data.word) {
        console.error("Невірні дані для історії:", data);
        return manager.getCurrentState();
      }

      const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
        (data.origVer || "").toUpperCase(),
      );

      const historyEntry = {
        id: `${data.origVer || "unknown"}:${data.word.strong || "unknown"}:${Date.now()}`,
        data: data,
        origVer: data.origVer,
        word: {
          word: data.word.word || "",
          strong: data.word.strong || "",
          lemma: data.word.lemma || "",
          morph: data.word.morph || "",
          dict: data.word.dict || "",
        },
        lang: data.word.strong?.startsWith("H") ? "he" : "gr",
        isOriginal: isOriginal,
        timestamp: Date.now(),
      };

      const state = manager.addEntry(historyEntry);
      console.log("✅ Додано в глобальну історію:", historyEntry.id);
      return state;
    } catch (error) {
      console.error("❌ Помилка додавання в глобальну історію:", error);
      return null;
    }
  },

  getGlobalState() {
    return this.getManager("global").getCurrentState();
  },

  clearAll() {
    Object.values(this.managers).forEach((manager) => manager.clear());
  },
};

export default globalHistoryManager;
