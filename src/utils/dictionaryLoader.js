// src/utils/dictionaryLoader.js

/**
 * Завантажує перекладний словник
 */
export const loadDictionaryEntry = async (strongCode, language = "uk") => {
  try {
    // Перевірка вхідних даних
    if (!strongCode || !language) {
      throw new Error("Відсутній код або мова");
    }

    // Нормалізуємо код
    const normalizedCode = strongCode.toUpperCase();
    const firstLetter = normalizedCode.substring(0, 1);

    // Список можливих мов для fallback
    const fallbackLanguages = ["uk", "ru", "en"];
    const availableLanguages = [];

    // Перевіряємо всі можливі мови
    for (const lang of fallbackLanguages) {
      try {
        const path = `/data/dictionaries/${lang}/${firstLetter}/${normalizedCode}_${lang}.json`;
        const response = await fetch(path);

        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            _source: lang,
            _isFallback: lang !== language,
            _strongCode: normalizedCode,
          };
        }
      } catch (err) {
        console.log(`Словник ${normalizedCode} не знайдено для мови ${lang}`);
      }
    }

    // Якщо жодного словника не знайдено
    throw new Error(`Жодного словника не знайдено для ${normalizedCode}`);
  } catch (error) {
    console.error(`Помилка завантаження словника ${strongCode}:`, error);

    // Повертаємо заглушку
    return {
      strong: strongCode,
      word: "⚠️ Словник не знайдено",
      definition: "Даний словник відсутній у базі даних",
      _source: "error",
      _isFallback: true,
      _error: error.message,
    };
  }
};

/**
 * Отримує мовний код на основі версії перекладу
 */
export const getLanguageFromVersion = (version) => {
  if (!version) return "uk";

  const versionMap = {
    // Українські
    UTT: "uk",
    UBT: "uk",
    UKR: "uk",
    SIRYY: "uk",
    OGI: "uk",
    KHO: "uk",

    // Російські
    SYN: "ru",
    RUS: "ru",

    // Англійські
    KJV: "en",
    ENG: "en",
  };

  return versionMap[version.toUpperCase()] || "uk";
};

/**
 * Перевіряє чи версія є оригіналом
 */
export const isOriginalVersion = (version) => {
  if (!version) return false;

  const originals = ["LXX", "THOT", "TR", "GNT"];
  return originals.includes(version.toUpperCase());
};

export default {
  loadDictionaryEntry,
  getLanguageFromVersion,
  isOriginalVersion,
};
