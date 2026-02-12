// src\utils\historyManager.js 11.02.2026 спроба створити історію переглядів з навігацією
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
   * Нормалізує версії для коректного порівняння
   * Видаляє несумісні версії для конкретного заповіту
   */
  normalizeVersions(versions, book) {
    const testament = this.getTestament(book);
    const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];

    return versions.filter((v) => {
      const bible = bibles.find((b) => b.initials === v.toUpperCase());
      return bible?.testaments?.includes(testament);
    });
  }

  /**
   * Порівнює два набори версій з урахуванням заповіту
   */
  areVersionsEqual(versions1, versions2, book) {
    if (!versions1 || !versions2) return false;

    // Нормалізуємо обидва масиви
    const norm1 = this.normalizeVersions(versions1, book);
    const norm2 = this.normalizeVersions(versions2, book);

    // Сортуємо для порівняння
    const sorted1 = [...norm1].sort();
    const sorted2 = [...norm2].sort();

    return JSON.stringify(sorted1) === JSON.stringify(sorted2);
  }

  /**
   * Додає запис до історії
   */
  // addEntry(entry) {
  //   if (!entry || !entry.id) {
  //     console.warn("Невалідний запис для історії");
  //     return this.getState();
  //   }

  //   // Для passage не застосовуємо фільтр дублів по strong/dict
  //   if (this.type === "passage") {
  //     // Перевіряємо дублікат ПОТОЧНОГО запису
  //     const lastEntry = this.getCurrentEntry();
  //     if (
  //       lastEntry &&
  //       lastEntry.ref === entry.ref &&
  //       JSON.stringify(lastEntry.versions?.sort()) ===
  //         JSON.stringify([...entry.versions].sort())
  //     ) {
  //       console.log("Дублікат запису, пропускаємо");
  //       return this.getState();
  //     }
  //     // 🎯 ВАЖЛИВО: Видаляємо ВСІ записи ПІСЛЯ поточної позиції
  //     // Це стандартна поведінка історії (як в браузері)
  //     if (this.currentIndex < this.history.length - 1) {
  //       console.log(
  //         `✂️ Видаляємо ${this.history.length - this.currentIndex - 1} майбутніх записів`,
  //       );
  //       this.history = this.history.slice(0, this.currentIndex + 1);
  //     }

  //     // Просто додаємо новий запис
  //     this.history.push({
  //       ...entry,
  //       timestamp: Date.now(),
  //       type: this.type,
  //     });

  //     if (this.history.length > this.maxSize) {
  //       this.history = this.history.slice(-this.maxSize);
  //     }

  //     this.currentIndex = this.history.length - 1;
  //     this.saveToStorage();
  //     return this.getState();
  //   }

  //   // ФІЛЬТР ДУБЛІКАТІВ: порівнюємо за новим ключем
  //   const duplicateIndex = this.history.findIndex((item) => {
  //     const itemKey = `${item.word?.strong || item.word?.dict || ""}_${item.isOriginal ? "true" : "false"}`;
  //     return itemKey === entryKey;
  //   });

  //   this.saveToStorage();

  //   return this.getState();
  // }
  addEntry(entry) {
    if (!entry || !entry.id) {
      console.warn("Невалідний запис для історії");
      return this.getState();
    }

    if (this.type === "passage") {
      // // Нормалізуємо версії в записі
      // const normalizedVersions = this.normalizeVersions(
      //   entry.versions,
      //   entry.book,
      // );
      // Нормалізуємо версії тільки якщо вони є
      const normalizedVersions = entry.versions?.length
        ? this.normalizeVersions(entry.versions, entry.book)
        : [];

      const normalizedEntry = {
        ...entry,
        versions: normalizedVersions,
        rawVersions: entry.versions, // зберігаємо оригінал для довідки
      };

      // // Перевіряємо дублікат з нормалізованими версіями
      // const lastEntry = this.getCurrentEntry();
      // if (
      //   lastEntry &&
      //   lastEntry.ref === entry.ref &&
      //   this.areVersionsEqual(lastEntry.versions, entry.versions, entry.book)
      // ) {
      //   console.log("⏩ Дублікат запису, пропускаємо");
      //   return this.getState();
      // }
      // Перевіряємо дублікат
      const lastEntry = this.getCurrentEntry();
      if (lastEntry) {
        const isDuplicate =
          lastEntry.ref === entry.ref &&
          this.areVersionsEqual(
            lastEntry.versions,
            normalizedVersions,
            entry.book,
          );

        if (isDuplicate) {
          console.log("⏩ Дублікат запису, пропускаємо");
          return this.getState();
        }
      }

      // Видаляємо майбутні записи
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }

      this.history.push({
        ...normalizedEntry,
        timestamp: Date.now(),
        type: this.type,
      });

      if (this.history.length > this.maxSize) {
        this.history = this.history.slice(-this.maxSize);
      }

      this.currentIndex = this.history.length - 1;
      this.saveToStorage();
      return this.getState();
    }

    // ... код для інших типів
    // ФІЛЬТР ДУБЛІКАТІВ: порівнюємо за новим ключем
    const duplicateIndex = this.history.findIndex((item) => {
      const itemKey = `${item.word?.strong || item.word?.dict || ""}_${item.isOriginal ? "true" : "false"}`;
      return itemKey === entryKey;
    });

    this.saveToStorage();

    return this.getState();
  }

  getTestament(book) {
    const newTestamentBooks = [
      "MAT",
      "MRK",
      "LUK",
      "JHN",
      "ACT",
      "ROM",
      "1CO",
      "2CO",
      "GAL",
      "EPH",
      "PHP",
      "COL",
      "1TH",
      "2TH",
      "1TI",
      "2TI",
      "TIT",
      "PHM",
      "HEB",
      "JAS",
      "1PE",
      "2PE",
      "1JN",
      "2JN",
      "3JN",
      "JUD",
      "REV",
    ];
    return newTestamentBooks.includes(book) ? "NewT" : "OldT";
  }
  // У методі addGlobalEntry також додаємо фільтрацію:
  addGlobalEntry(data) {
    try {
      const { word, origVer } = data;
      if (!word || !origVer) return null;

      const entryId = `${origVer}:${word.strong || word.dict}:${Date.now()}`;
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
      // Для passage - простий перехід без фільтрації
      if (this.type === "passage") {
        this.currentIndex--;
        this.saveToStorage();
        // return this.getCurrentEntry();
        const entry = this.getCurrentEntry();
        console.log(`goBack: новий індекс ${this.currentIndex}, запис:`, entry);
        return entry;
      }

      // Для strong/dictionary - з фільтрацією
      let newIndex = this.currentIndex - 1;
      while (newIndex >= 0) {
        const currentKey = this.getEntryKey(this.history[this.currentIndex]);
        const prevKey = this.getEntryKey(this.history[newIndex]);
        if (currentKey !== prevKey) break;
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
      // Для passage - простий перехід без фільтрації
      if (this.type === "passage") {
        this.currentIndex++;
        this.saveToStorage();
        // return this.getCurrentEntry();
        const entry = this.getCurrentEntry();
        console.log(
          `goForward: новий індекс ${this.currentIndex}, запис:`,
          entry,
        );
        return entry;
      }

      // Для strong/dictionary - з фільтрацією
      let newIndex = this.currentIndex + 1;
      while (newIndex < this.history.length) {
        const currentKey = this.getEntryKey(this.history[this.currentIndex]);
        const nextKey = this.getEntryKey(this.history[newIndex]);
        if (currentKey !== nextKey) break;
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
  // getEntryKey(entry) {
  //   return `${entry.word?.strong || entry.word?.dict || ""}_${entry.isOriginal ? "true" : "false"}`;
  // }
  // У class HistoryManager, метод getEntryKey (замінити):
  getEntryKey(entry) {
    if (this.type === "passage") {
      return `${entry.ref}_${entry.versions?.sort().join(",")}`;
    }
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
      const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
        origVer.toUpperCase(),
      );
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
  },

  /**
   * Очищає всі історії
   */
  clearAll() {
    Object.values(this.managers).forEach((manager) => manager.clear());
  },

  // ────────────────────────────────────────────────────────────────
  // Додаємо менеджер для історії переглядів глав / книг / версій
  // ────────────────────────────────────────────────────────────────

  passage: new HistoryManager("passage", 50),

  addPassageEntry(data) {
    const manager = this.getManager("passage");

    // Перевіряємо, чи це не дублікат останнього запису
    const lastEntry = manager.getCurrentEntry();
    if (
      lastEntry &&
      lastEntry.ref === data.ref &&
      JSON.stringify(lastEntry.versions.sort()) ===
        JSON.stringify([...data.versions].sort())
    ) {
      return manager.getState(); // Пропускаємо дублікат
    }

    const entryId = `passage:${data.ref}-${data.versions.join(",")}-${Date.now()}`;

    const entry = {
      id: entryId,
      ref: data.ref,
      versions: [...data.versions],
      book: data.book,
      chapter: data.chapter,
      timestamp: Date.now(),
    };

    return manager.addEntry(entry);
  },

  getPassageState() {
    return this.getManager("passage").getState();
  },

  goBackPassage() {
    const manager = this.getManager("passage");
    console.log("Поточний індекс перед goBack:", manager.currentIndex);
    const entry = manager.goBack();
    console.log("Після goBack:", { entry, currentIndex: manager.currentIndex });
    return entry ? { ...entry, state: manager.getState() } : null;
  },

  goForwardPassage() {
    const manager = this.getManager("passage");
    const entry = manager.goForward();
    return entry ? { ...entry, state: manager.getState() } : null;
  },
};

export default globalHistoryManager;
