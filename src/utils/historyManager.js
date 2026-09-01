// // src\utils\historyManager.js
// /**
//  * Глобальний менеджер історії перегляду для словників
//  * Підтримує розділення історії для оригіналів та перекладів
//  */

// class HistoryManager {
//   constructor(type = "global", maxSize = 100) {
//     this.type = type; // 'strong' або 'dictionary' або 'global'
//     this.maxSize = maxSize;
//     this.history = this.loadFromStorage();
//     this.currentIndex = Math.max(this.history.length - 1, 0);
//     // Додаємо прапор, що показує, чи було застосовано goBack/goForward
//     this.lastAction = null; // 'back', 'forward', або null
//   }

//   /**
//    * Завантажує історію з localStorage
//    */
//   loadFromStorage() {
//     try {
//       const key = `lexicon_history_${this.type}`;
//       const stored = localStorage.getItem(key);
//       return stored ? JSON.parse(stored) : [];
//     } catch (error) {
//       console.error("Помилка завантаження історії:", error);
//       return [];
//     }
//   }

//   /**
//    * Зберігає історію в localStorage
//    */
//   saveToStorage() {
//     try {
//       const key = `lexicon_history_${this.type}`;
//       localStorage.setItem(
//         key,
//         JSON.stringify(this.history.slice(-this.maxSize)),
//       );
//     } catch (error) {
//       console.error("Помилка збереження історії:", error);
//     }
//   }

//   /**
//    * Додає запис до історії
//    */
//   addEntry(entry) {
//     if (!entry || !entry.id) {
//       console.warn("Невалідний запис для історії");
//       return this.getState();
//     }

//     // Перевіряємо, чи це вже останній запис
//     const lastEntry = this.history[this.history.length - 1];
//     if (lastEntry && lastEntry.id === entry.id) {
//       return this.getState();
//     }

//     // // Видаляємо дублікати
//     // this.history = this.history.filter((item) => item.id !== entry.id);

//     // ФІЛЬТР ДУБЛІКАТІВ: порівнюємо за strong кодом та словом
//     // (не за ID, бо ID містить timestamp)
//     const isDuplicate = this.history.some(
//       (item) =>
//         item.word?.strong === entry.word?.strong &&
//         item.word?.word === entry.word?.word &&
//         item.isOriginal === entry.isOriginal,
//     );

//     if (isDuplicate) {
//       console.log("⏩ Пропускаємо дублікат в історії:", entry.word?.strong);
//       // Переміщуємо існуючий запис в кінець (оновлюємо timestamp)
//       this.history = this.history.filter(
//         (item) =>
//           !(
//             item.word?.strong === entry.word?.strong &&
//             item.word?.word === entry.word?.word &&
//             item.isOriginal === entry.isOriginal
//           ),
//       );
//     }

//     // Додаємо новий запис
//     this.history.push({
//       ...entry,
//       timestamp: Date.now(),
//       type: this.type,
//     });

//     // Обмежуємо розмір
//     if (this.history.length > this.maxSize) {
//       this.history = this.history.slice(-this.maxSize);
//     }

//     this.currentIndex = this.history.length - 1;
//     this.saveToStorage();

//     return this.getState();
//   }

//   // У методі addGlobalEntry також додаємо фільтрацію:
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
//   }

//   /**
//    * Перехід назад в історії
//    * @returns {Object|null} - Попередній запис або null
//    */
//   // goBack() {
//   //   if (this.currentIndex > 0) {
//   //     this.currentIndex--;
//   //     this.saveToStorage();
//   //     return this.getCurrentEntry();
//   //   }
//   //   return null;
//   // }
//   goBack() {
//     console.log(
//       `goBack: currentIndex=${this.currentIndex}, history.length=${this.history.length}`,
//     );

//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//       this.lastAction = "back";
//       this.saveToStorage();

//       console.log(`✅ goBack успішно: новий currentIndex=${this.currentIndex}`);
//       return this.getCurrentEntry();
//     }

//     console.log(`❌ goBack неможливо: currentIndex=${this.currentIndex}`);
//     return null;
//   }

//   /**
//    * Перехід вперед в історії
//    */
//   // goForward() {
//   //   if (this.currentIndex < this.history.length - 1) {
//   //     this.currentIndex++;
//   //     this.saveToStorage();
//   //     return this.getCurrentEntry();
//   //   }
//   //   return null;
//   // }
//   /**
//    * Перехід вперед в історії
//    * @returns {Object|null} - Наступний запис або null
//    */
//   goForward() {
//     console.log(
//       `goForward: currentIndex=${this.currentIndex}, history.length=${this.history.length}`,
//     );

//     if (this.currentIndex < this.history.length - 1) {
//       this.currentIndex++;
//       this.lastAction = "forward";
//       this.saveToStorage();

//       console.log(
//         `✅ goForward успішно: новий currentIndex=${this.currentIndex}`,
//       );
//       return this.getCurrentEntry();
//     }

//     console.log(`❌ goForward неможливо: currentIndex=${this.currentIndex}`);
//     return null;
//   }

//   /**
//    * Отримує поточний запис - потрібен чи ні???
//    */
//   getCurrentEntry() {
//     return this.history[this.currentIndex] || null;
//   }

//   /**
//    * Перевіряє, чи можна перейти назад
//    */
//   canGoBack() {
//     return this.currentIndex > 0;
//   }

//   /**
//    * Перевіряє, чи можна перейти вперед
//    */
//   canGoForward() {
//     return this.currentIndex < this.history.length - 1;
//   }

//   /**
//    * Отримує поточний стан
//    */
//   // getState() {
//   //   return {
//   //     current: this.getCurrentEntry(),
//   //     canGoBack: this.canGoBack(),
//   //     canGoForward: this.canGoForward(),
//   //     position:
//   //       this.history.length > 0
//   //         ? `${this.currentIndex + 1}/${this.history.length}`
//   //         : "1/1",
//   //     history: [...this.history],
//   //     type: this.type,
//   //   };
//   // }
//   /**
//    * Отримує поточний стан історії
//    * @returns {Object}
//    */
//   getState() {
//     const state = {
//       current: this.getCurrentEntry(),
//       canGoBack: this.canGoBack(),
//       canGoForward: this.canGoForward(),
//       position: `${this.currentIndex + 1}/${this.history.length}`,
//       history: [...this.history],
//       currentIndex: this.currentIndex,
//       lastAction: this.lastAction,
//     };

//     console.log(`📊 getState:`, {
//       position: state.position,
//       currentIndex: state.currentIndex,
//       canGoBack: state.canGoBack,
//       canGoForward: state.canGoForward,
//       currentId: state.current?.id,
//     });

//     return state;
//   }

//   /**
//    * Очищає історію
//    */
//   // clear() {
//   //   this.history = [];
//   //   this.currentIndex = -1;
//   //   this.saveToStorage();
//   // }
//   /**
//    * Очищає кеш останньої дії (для уникнення конфліктів)
//    */
//   clearLastAction() {
//     this.lastAction = null;
//   }

//   /**
//    * Отримує всі записи
//    */
//   // getAll() {
//   //   return [...this.history];
//   // }

//   /**
//    * Отримує запис за індексом
//    */
//   // getEntry(index) {
//   //   if (index >= 0 && index < this.history.length) {
//   //     this.currentIndex = index;
//   //     this.saveToStorage();
//   //     return this.getCurrentEntry();
//   //   }
//   //   return null;
//   // }
// }

// /**
//  * Глобальний менеджер для всіх типів словників
//  */
// export const globalHistoryManager = {
//   windows: {},
//   // managers: {
//   //   strong: new HistoryManager("strong"),
//   //   dictionary: new HistoryManager("dictionary"),
//   //   global: new HistoryManager("global"), // Для вузьких екранів
//   // },

//   /**
//    * Отримує менеджер за типом
//    */
//   // getManager(type) {
//   //   if (!this.managers[type]) {
//   //     this.managers[type] = new HistoryManager(type);
//   //   }
//   //   return this.managers[type];
//   // },
//   getManager(windowId) {
//     if (!this.windows[windowId]) {
//       this.windows[windowId] = new HistoryManager(windowId);
//     }
//     return this.windows[windowId];
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
//    * Для вузьких екранів - додаємо в глобальну історію
//    */
//   // addGlobalEntry(data) {
//   //   try {
//   //     const { word, origVer } = data;
//   //     if (!word || !origVer) return null;

//   //     const entryId = `${origVer}:${word.strong}:${Date.now()}`;
//   //     const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
//   //       origVer.toUpperCase(),
//   //     );

//   //     const entry = {
//   //       id: entryId,
//   //       data: data,
//   //       origVer: origVer,
//   //       word: {
//   //         word: word.word,
//   //         strong: word.strong,
//   //         lemma: word.lemma,
//   //         morph: word.morph,
//   //         dict: word.dict,
//   //       },
//   //       lang: word.strong?.startsWith("H") ? "he" : "gr",
//   //       isOriginal: isOriginal,
//   //       timestamp: Date.now(),
//   //       type: isOriginal ? "strong" : "dictionary",
//   //     };

//   //     const globalManager = this.getManager("global");
//   //     return globalManager.addEntry(entry);
//   //   } catch (error) {
//   //     console.error("Помилка додавання запису в глобальну історію:", error);
//   //     return null;
//   //   }
//   // },
//   /**
//    * Додає запис в глобальну історію та повертає її стан
//    */
//   addGlobalEntry: function (data) {
//     try {
//       const manager = this.getManager("global");

//       if (!data || !data.word) {
//         console.error("Невірні дані для історії:", data);
//         return manager.getState();
//       }

//       // Визначаємо чи це оригінал
//       const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
//         (data.origVer || "").toUpperCase(),
//       );

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
//         isOriginal: isOriginal,
//         timestamp: Date.now(),
//         // Додаємо інформацію для дебагу
//         _debug: {
//           wordText: data.word.word,
//           strongCode: data.word.strong,
//           dictCode: data.word.dict,
//           version: data.origVer,
//         },
//       };

//       const state = manager.addEntry(historyEntry);
//       console.log("✅ Додано запис в глобальну історію:", {
//         id: historyEntry.id,
//         code: data.word.strong || data.word.dict,
//         position: state.position,
//       });

//       return state;
//     } catch (error) {
//       console.error("❌ Помилка додавання в глобальну історію:", error);
//       return null;
//     }
//   },

//   /**
//    * Очищає всі історії
//    */
//   // clearAll() {
//   //   Object.values(this.managers).forEach((manager) => manager.clear());
//   // },
//   getGlobalState: function () {
//     const manager = this.getManager("global");
//     return manager.getState();
//   },

//   goBack: function () {
//     const manager = this.getManager("global");
//     const entry = manager.goBack();
//     return { entry, state: manager.getState() };
//   },

//   goForward: function () {
//     const manager = this.getManager("global");
//     const entry = manager.goForward();
//     return { entry, state: manager.getState() };
//   },

//   clearAll: function () {
//     Object.keys(this.windows).forEach((key) => {
//       this.windows[key].clear();
//     });
//     this.windows = {};
//   },
// };

// export default globalHistoryManager;

// ===================

/**
 * Глобальний менеджер історії перегляду для словників
 * Підтримує розділення історії для оригіналів та перекладів
 */

class HistoryManager {
  constructor(type = "global", maxSize = 100) {
    this.type = type; // 'strong' або 'dictionary' або 'global'
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
      console.warn("Невалідний запис для історії");
      return this.getState();
    }

    // ВИПРАВЛЕННЯ: Чистимо старі порожні entry (без strong/dict) перед додаванням нового
    this.history = this.history.filter(
      (item) => item.word?.strong || item.word?.dict,
    );

    // ВИПРАВЛЕННЯ: Новий ключ фільтрації: (strong || dict) + isOriginal (мінімально, без origVer/word для зменшення ризику дублів)
    const entryKey = `${entry.word?.strong || entry.word?.dict || ""}_${entry.isOriginal ? "true" : "false"}`;

    // Перевіряємо, чи це вже останній запис
    const lastEntry = this.history[this.history.length - 1];
    if (lastEntry && lastEntry.id === entry.id) {
      return this.getState();
    }

    // ФІЛЬТР ДУБЛІКАТІВ: порівнюємо за новим ключем
    const duplicateIndex = this.history.findIndex((item) => {
      const itemKey = `${item.word?.strong || item.word?.dict || ""}_${item.isOriginal ? "true" : "false"}`;
      return itemKey === entryKey;
    });

    if (duplicateIndex !== -1) {
      console.log("⏩ Пропускаємо дублікат в історії:", entryKey);
      // Оновлюємо існуючий запис (з новим timestamp/error, якщо є)
      this.history[duplicateIndex] = {
        ...this.history[duplicateIndex],
        ...entry,
        timestamp: Date.now(),
      };
      this.currentIndex = duplicateIndex;
    } else {
      // Додаємо новий запис
      this.history.push({
        ...entry,
        timestamp: Date.now(),
        type: this.type,
      });

      // Обмежуємо розмір
      if (this.history.length > this.maxSize) {
        this.history = this.history.slice(-this.maxSize);
      }

      this.currentIndex = this.history.length - 1;
    }

    this.saveToStorage();

    return this.getState();
  }

  // У методі addGlobalEntry також додаємо фільтрацію:
  addGlobalEntry(data) {
    try {
      const { word, origVer } = data;
      if (!word || !origVer) return null;

      const entryId = `${origVer}:${word.strong || word.dict}:${Date.now()}`;
      const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
      const bible = bibles.find((b) => b.initials === origVer.toUpperCase());
      const isOriginal = bible?.type === "original" || false;

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
      let newIndex = this.currentIndex - 1;
      // ВИПРАВЛЕННЯ: Пропуск "близнюків" (того ж ключа) для уникнення циклів
      while (newIndex >= 0) {
        const currentKey = this.getEntryKey(this.history[this.currentIndex]);
        const prevKey = this.getEntryKey(this.history[newIndex]);
        if (currentKey !== prevKey) {
          break; // Знайшли різний - зупиняємося
        }
        newIndex--;
      }
      if (newIndex >= 0) {
        this.currentIndex = newIndex;
        this.saveToStorage();
        return this.getCurrentEntry();
      }
    }
    return null;
  }

  /**
   * Перехід вперед в історії
   */
  goForward() {
    if (this.currentIndex < this.history.length - 1) {
      let newIndex = this.currentIndex + 1;
      // ВИПРАВЛЕННЯ: Пропуск "близнюків" (того ж ключа) для уникнення стрибків/циклів
      while (newIndex < this.history.length) {
        const currentKey = this.getEntryKey(this.history[this.currentIndex]);
        const nextKey = this.getEntryKey(this.history[newIndex]);
        if (currentKey !== nextKey) {
          break; // Знайшли різний - зупиняємося
        }
        newIndex++;
      }
      if (newIndex < this.history.length) {
        this.currentIndex = newIndex;
        this.saveToStorage();
        return this.getCurrentEntry();
      }
    }
    return null;
  }

  // ВИПРАВЛЕННЯ: Допоміжна функція для отримання ключа ентрі (для пропуску близнюків)
  getEntryKey(entry) {
    return `${entry.word?.strong || entry.word?.dict || ""}_${entry.isOriginal ? "true" : "false"}`;
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
  getState() {
    return {
      current: this.getCurrentEntry(),
      canGoBack: this.canGoBack(),
      canGoForward: this.canGoForward(),
      position:
        this.history.length > 0
          ? `${this.currentIndex + 1}/${this.history.length}`
          : "1/1",
      history: [...this.history],
      type: this.type,
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
export const globalHistoryManager = {
  managers: {
    strong: new HistoryManager("strong"),
    dictionary: new HistoryManager("dictionary"),
    global: new HistoryManager("global"), // Для вузьких екранів
  },

  /**
   * Отримує менеджер за типом
   */
  getManager(type) {
    if (!this.managers[type]) {
      this.managers[type] = new HistoryManager(type);
    }
    return this.managers[type];
  },

  /**
   * Додає запис до відповідного менеджера
   */
  addEntry(data) {
    try {
      const { word, origVer } = data;
      if (!word || !origVer) return null;

      // Визначаємо тип за версією
      const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
      const bible = bibles.find((b) => b.initials === origVer.toUpperCase());
      const isOriginal = bible?.type === "original" || false;
      const type = isOriginal ? "strong" : "dictionary";
      const manager = this.getManager(type);

      // Створюємо унікальний ID
      const entryId = `${origVer}:${word.strong || word.dict}:${Date.now()}`;

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
      };

      return manager.addEntry(entry);
    } catch (error) {
      console.error("Помилка додавання запису в історію:", error);
      return null;
    }
  },

  /**
   * Для вузьких екранів - додаємо в глобальну історію
   */
  addGlobalEntry(data) {
    try {
      const { word, origVer } = data;
      if (!word || !origVer) return null;

      const entryId = `${origVer}:${word.strong || word.dict}:${Date.now()}`;
      const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
      const bible = bibles.find((b) => b.initials === origVer.toUpperCase());
      const isOriginal = bible?.type === "original" || false;

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
  },

  /**
   * Очищає всі історії
   */
  clearAll() {
    Object.values(this.managers).forEach((manager) => manager.clear());
  },
};

export default globalHistoryManager;
