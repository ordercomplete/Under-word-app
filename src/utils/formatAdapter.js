// src/utils/formatAdapter.js
/**
 * Утиліти для роботи з новим форматом даних
 */

import { getValue } from "./jsonAdapter";

/**
 * Отримати реальні дані з файлу (версії)
 */
export function getDataFromFile(fileData) {
  if (!fileData) return [];

  // Новий формат: { _meta, verses }
  if (fileData._meta && fileData.verses !== undefined) {
    return Array.isArray(fileData.verses) ? fileData.verses : [fileData.verses];
  }

  // Старий формат: масив
  if (Array.isArray(fileData)) {
    return fileData;
  }

  // Неочікуваний формат
  console.warn("Неочікуваний формат даних:", fileData);
  return [];
}

/**
 * Отримати метадані з файлу
 */
export function getFileMetadata(fileData) {
  if (!fileData) return null;

  // Новий формат
  if (fileData._meta) {
    return fileData._meta;
  }

  // Старий формат: немає метаданих
  return null;
}

/**
 * Отримати версію перекладу з метаданих або з назви файлу
 */
export function getTranslationVersion(fileData, fileName = "") {
  const meta = getFileMetadata(fileData);

  if (meta && meta.info && meta.info.translation) {
    return meta.info.translation.toUpperCase();
  }

  // Спробуємо витягнути з назви файлу
  if (fileName) {
    const match = fileName.match(/_([a-z]+)\.json$/i);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  return "UNKNOWN";
}

/**
 * Перевірити, чи є файл оригінальним текстом
 */
export function isOriginalText(fileData) {
  const meta = getFileMetadata(fileData);

  if (meta && meta.info && meta.info.type) {
    return meta.info.type === "original";
  }

  // Спробуємо визначити за шляхом або іншими ознаками
  if (fileData._source && fileData._source.includes("/originals/")) {
    return true;
  }

  return false;
}

/**
 * Отримати мову тексту
 */
export function getTextLanguage(fileData) {
  const meta = getFileMetadata(fileData);

  if (meta && meta.info && meta.info.language) {
    return meta.info.language;
  }

  // Спробуємо визначити за strong кодами
  const data = getDataFromFile(fileData);
  if (data.length > 0 && data[0].ws) {
    const firstWord = data[0].ws[0];
    const strong = getValue(firstWord, "strong");
    if (strong && strong.startsWith("G")) return "greek";
    if (strong && strong.startsWith("H")) return "hebrew";
  }

  return "unknown";
}

/**
 * Отримати список унікальних strong кодів з глави
 */
export function getUniqueStrongsFromChapter(chapterData) {
  const data = getDataFromFile(chapterData);
  const strongs = new Set();

  data.forEach((verse) => {
    const words = getValue(verse, "words") || getValue(verse, "ws") || [];
    words.forEach((word) => {
      const strong = getValue(word, "strong");
      if (strong) {
        strongs.add(strong);
      }
    });
  });

  return Array.from(strongs);
}

export default {
  getDataFromFile,
  getFileMetadata,
  getTranslationVersion,
  isOriginalText,
  getTextLanguage,
  getUniqueStrongsFromChapter,
};
