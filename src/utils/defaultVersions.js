/**
 * Утиліта для визначення дефолтних версій на основі translations.json
 * Замінює жорстку прив'язку на динамічний розрахунок
 */
import translationUtils from "./translationUtils";

/**
 * Визначає заповіт за кодом книги
 * @param {string} bookCode - код книги (наприклад, "GEN", "MAT")
 * @returns {string} "OldT" або "NewT"
 */
export const getTestament = (bookCode) => {
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
  return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
};

/**
 * Перевіряє чи оригінал підходить для конкретної книги (OT/NT)
 * Використовує translationUtils.supportsTestament замість хардкоду
 */
const isOriginalCompatibleWithBook = (originalInitials, bookCode) => {
  const testament = getTestament(bookCode);
  return translationUtils.supportsTestament(originalInitials, testament);
};

/**
 * Отримує дефолтні версії для книги
 * @param {string} bookCode - код книги (наприклад, "GEN", "MAT")
 * @param {Object} translationsData - дані з translations.json
 * @returns {Array} масив версій [оригінал, переклад]
 */
export const getDefaultVersions = (bookCode, translationsData) => {
  if (!bookCode || !translationsData?.bibles?.length) {
    return [];
  }

  const testament = getTestament(bookCode);

  // Знаходимо дефолтний оригінал для цього заповіту
  const defaultOriginal = translationsData.bibles.find((b) => {
    if (b.type !== "original" || b.isDefault !== true) return false;
    if (!b.testaments?.includes(testament)) return false;
    return true;
  });

  if (!defaultOriginal) {
    return [];
  }

  // Знаходимо дефолтний переклад, що базується на цьому оригіналі
  const defaultTranslation = translationsData.bibles.find((b) => {
    if (b.type !== "translation" || b.isDefault !== true) return false;
    if (!b.testaments?.includes(testament)) return false;

    // Перевіряємо basedOn
    if (!b.basedOn) return false;
    const basedOnKey = testament === "OldT" ? "old_testament" : "new_testament";

    return b.basedOn[basedOnKey] === defaultOriginal.initials.toLowerCase();
  });

  // Формуємо результат: спочатку оригінал, потім переклад
  const versions = [defaultOriginal.initials];
  if (defaultTranslation) {
    versions.push(defaultTranslation.initials);
  }

  return versions;
};
