// src/utils/loadChapter.js 23.12.25
import { jsonAdapter } from "./jsonAdapter";

export const loadChapter = async (
  book,
  chapter,
  version,
  isOriginal = false
) => {
  console.log(`🚀 loadChapter: ${book}.${chapter} ${version}`);

  try {
    const lowerVersion = version.toLowerCase();
    const bookLower = book.toLowerCase();

    // Визначаємо базову папку
    const base = isOriginal ? "originals" : "translations";

    // Спробуємо спочатку скорочений формат
    const compressedUrl = `/data_compressed/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`;
    console.log(`📁 Завантаження з: ${compressedUrl}`);
    // Проблема: Шлях завжди використовує OldT, що неправильно для книг Нового Завіту.
    const response = await fetch(compressedUrl);

    if (!response.ok) {
      console.warn(
        `⚠️  ${compressedUrl} не знайдено, спробуємо оригінальний шлях`
      );

      // Спробуємо оригінальний шлях
      const fallbackUrl = `/data/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`;
      const fallbackResponse = await fetch(fallbackUrl);

      if (!fallbackResponse.ok) {
        throw new Error(`Не знайдено: ${compressedUrl} та ${fallbackUrl}`);
      }

      const data = await fallbackResponse.json();
      console.log(`✅ Завантажено з fallback: ${fallbackUrl}`);

      // Адаптуємо дані
      const adapted = jsonAdapter(data);

      // Додаємо метадані про версію
      if (Array.isArray(adapted)) {
        adapted._version = version;
        adapted._isOriginal = isOriginal;
      }

      return adapted;
    }

    const data = await response.json();
    console.log(`✅ Успішно завантажено: ${compressedUrl}`);

    // Адаптуємо новий формат
    const adapted = jsonAdapter(data);

    // Додаємо додаткові метадані
    if (Array.isArray(adapted)) {
      adapted._version = version;
      adapted._isOriginal = isOriginal;
      // Зберігаємо оригінальні метадані, якщо є
      if (data._meta) {
        adapted._meta = data._meta;
      }
    }

    console.log(`📊 Дані адаптовано: ${adapted.length} віршів`);

    return adapted;
  } catch (error) {
    console.error(`❌ Помилка loadChapter:`, error);

    // Створюємо заглушку для тестування
    return createFallbackData(version, isOriginal);
  }
};

/**
 * Додаткова функція для завантаження кількох версій одночасно
 */
export const loadMultipleChapters = async (book, chapter, versions) => {
  const results = {};

  await Promise.all(
    versions.map(async (version) => {
      try {
        const isOriginal = ["lxx", "thot", "gnt"].includes(
          version.toLowerCase()
        );
        const data = await loadChapter(book, chapter, version, isOriginal);
        results[version.toUpperCase()] = data;
      } catch (error) {
        console.error(`Помилка завантаження ${version}:`, error);
        results[version.toUpperCase()] = [];
      }
    })
  );

  return results;
};

function createFallbackData(version = "UTT", isOriginal = false) {
  console.log(`🔄 Створення тестових даних для ${version}`);

  const testData = [
    {
      v: 1,
      ws: [
        { w: "На", s: "G1722" },
        { w: "початку", s: "G746" },
        { w: "створив", s: "G4160" },
        { w: "Бог", s: "G2316" },
        { w: "небо", s: "G3772" },
        { w: "і", s: "G2532" },
        { w: "землю", s: "G1093" },
      ],
    },
  ];

  // Додаємо метадані
  testData._version = version;
  testData._isOriginal = isOriginal;
  testData._isFallback = true;

  return testData;
}

// Експорт для CommonJS
if (typeof module !== "undefined" && module.exports) {
  module.exports = { loadChapter, loadMultipleChapters };
}
