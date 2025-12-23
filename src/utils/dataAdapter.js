// src/utils/dataAdapter.js
import { jsonAdapter, getValue, normalizeWord } from "./jsonAdapter";

/**
 * Адаптер для нової структури даних
 */
export class DataAdapter {
  constructor(data) {
    this.originalData = data;
    this.adaptedData = null;
    this.metadata = null;
    this.verses = [];

    this.init(data);
  }

  init(data) {
    if (!data) return;

    // Адаптуємо до повного формату
    this.adaptedData = jsonAdapter(data);

    // Витягуємо метадані
    if (data._meta) {
      this.metadata = data._meta;
    }

    // Отримуємо вірші
    this.verses = this.getVerses();
  }

  getVerses() {
    if (!this.originalData) return [];

    // Нова структура
    if (this.originalData._meta && this.originalData.verses !== undefined) {
      return this.originalData.verses || [];
    }

    // Стара структура
    if (Array.isArray(this.originalData)) {
      return this.originalData;
    }

    return [];
  }

  getVerseByNumber(verseNum) {
    return this.verses.find(
      (v) => getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
    );
  }

  getWordsForVerse(verseNum) {
    const verse = this.getVerseByNumber(verseNum);
    if (!verse) return [];

    const words = getValue(verse, "words") || getValue(verse, "ws") || [];
    return words.map(normalizeWord);
  }

  getMetadata() {
    return this.metadata;
  }

  getTranslationInfo() {
    return this.metadata?.info || {};
  }

  hasStrongs() {
    return this.metadata?.info?.hasStrongs || false;
  }

  hasMorphology() {
    return this.metadata?.info?.hasMorphology || false;
  }

  getLanguage() {
    return this.metadata?.info?.language || "unknown";
  }

  // Статичний метод для швидкого використання
  static adapt(data) {
    return new DataAdapter(data);
  }
}

/**
 * Функція для роботи з главами (сумісна з loadChapter.js)
 */
export function adaptChapterData(chapterData) {
  if (!chapterData) return {};

  const result = {};

  Object.keys(chapterData).forEach((key) => {
    result[key] = DataAdapter.adapt(chapterData[key]);
  });

  return result;
}

/**
 * Отримати слова для відображення в інтерлінеарі
 */
export function getWordsForDisplay(chapterData, translationKey, verseNum) {
  if (!chapterData || !chapterData[translationKey]) return [];

  const adapter = chapterData[translationKey];
  const words = adapter.getWordsForVerse(verseNum);

  return words.map((word) => ({
    ...word,
    // Додаємо додаткові дані для відображення
    displayText: word.word,
    hasStrong: !!word.strong,
    isOriginal: ["lxx", "thot", "gnt"].includes(translationKey),
  }));
}

export default {
  DataAdapter,
  adaptChapterData,
  getWordsForDisplay,
};
