/**
 * Утиліта для форматування кодів Strong та словників
 */

/**
 * Визначає тип коду
 * @param {string} code - Код (наприклад: H1254, G746, G4160_uk, H0430_ru)
 * @returns {Object} - Інформація про тип коду
 */
export const parseCode = (code) => {
  if (!code) return null;

  // Прибираємо суфікс мови якщо він є
  const cleanCode = code.split("_")[0];

  const isStrong = cleanCode.startsWith("G") || cleanCode.startsWith("H");
  const isDict = code.includes("_");

  let type = "unknown";
  let language = null;
  let clean = cleanCode;

  if (isDict) {
    type = "dictionary";
    language = code.split("_")[1] || "uk";
  } else if (isStrong) {
    type = "strong";
  }

  // Визначаємо основну мову
  const langMap = {
    uk: "українська",
    en: "англійська",
    ru: "російська",
    gr: "грецька",
    he: "єврейська",
  };

  return {
    original: code,
    clean: clean,
    type: type,
    language: language,
    languageName: langMap[language] || language,
    isStrong: isStrong,
    isDict: isDict,
    letter: clean.charAt(0).toUpperCase(),
    number: parseInt(clean.substring(1)) || 0,
  };
};

/**
 * Генерує шлях до файлу словника
 * @param {string} dictCode - Код словника (наприклад: G4160_uk)
 * @returns {string} - Шлях до файлу
 */
export const getDictionaryPath = (dictCode) => {
  const info = parseCode(dictCode);
  if (!info || !info.isDict) return null;

  const category = info.letter;
  return `/data/dictionaries/${info.language}/${category}/${dictCode}.json`;
};

/**
 * Генерує шлях до файлу Strong
 * @param {string} strongCode - Код Strong (наприклад: G4160)
 * @returns {string} - Шлях до файлу
 */
export const getStrongPath = (strongCode) => {
  return `/data/strongs/${strongCode}.json`;
};

/**
 * Визначає тип вікна за версією оригіналу
 * @param {string} origVer - Версія оригіналу (LXX, THOT, TR, GNT)
 * @returns {string} - 'original' або 'translation'
 */
export const getWindowTypeByVersion = (origVer) => {
  if (!origVer) return "unknown";

  const originalVersions = ["LXX", "THOT", "TR", "GNT"];
  return originalVersions.includes(origVer.toUpperCase())
    ? "original"
    : "translation";
};

/**
 * Форматує заголовок вікна
 * @param {Object} entry - Дані запису
 * @param {boolean} isOriginal - Чи це оригінал
 * @param {number} windowIndex - Індекс вікна
 * @returns {Object} - Об'єкт з інформацією для заголовка
 */
export const formatWindowTitle = (entry, isOriginal, windowIndex) => {
  const title = {
    main: entry?.word || entry?.strong || "Словник",
    typeBadge: isOriginal ? "Оригінал" : "Переклад",
    code: entry?.strong || entry?.dictCode || "",
    language: entry?._lang || "uk",
    isTranslationDict: entry?._type?.includes("dictionary") || false,
  };

  // Якщо це словник перекладу, змінюємо typeBadge
  if (title.isTranslationDict && !isOriginal) {
    const langNames = {
      uk: "uk",
      ru: "RU",
      en: "EN",
    };
    title.typeBadge = langNames[title.language] || "Trans";
  }

  return title;
};

export default {
  parseCode,
  getDictionaryPath,
  getStrongPath,
  getWindowTypeByVersion,
  formatWindowTitle,
};
