// src\utils\historyManager.js
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

    // Перевіряємо, чи це вже останній запис
    const lastEntry = this.history[this.history.length - 1];
    if (lastEntry && lastEntry.id === entry.id) {
      return this.getState();
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
    this.saveToStorage();

    return this.getState();
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
      const entryId = `${origVer}:${word.strong}:${Date.now()}`;

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
  },

  /**
   * Очищає всі історії
   */
  clearAll() {
    Object.values(this.managers).forEach((manager) => manager.clear());
  },
};

export default globalHistoryManager;
