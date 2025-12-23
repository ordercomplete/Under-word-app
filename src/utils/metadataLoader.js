// src/utils/metadataLoader.js
/**
 * Завантаження та кешування метаданих
 */

const METADATA_CACHE = {};

/**
 * Завантажити метадані для всіх перекладів
 */
export async function loadAllTranslationsMetadata() {
  try {
    const response = await fetch("/data/translations.json");
    if (!response.ok)
      throw new Error("Не вдалося завантажити translations.json");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Помилка завантаження метаданих перекладів:", error);
    return {};
  }
}

/**
 * Завантажити метадані для конкретної книги
 */
export async function loadBookMetadata(bookCode, version) {
  const cacheKey = `${version}:${bookCode}`;

  if (METADATA_CACHE[cacheKey]) {
    return METADATA_CACHE[cacheKey];
  }

  try {
    const versionLower = version.toLowerCase();
    const bookLower = bookCode.toLowerCase();

    // Спробуємо отримати метадані з файлу
    const response = await fetch(
      `/data/translations/${versionLower}/OldT/${bookCode}/metadata.json`
    );

    if (response.ok) {
      const metadata = await response.json();
      METADATA_CACHE[cacheKey] = metadata;
      return metadata;
    }

    // Якщо файл не знайдено, створимо базові метадані
    const fallbackMetadata = {
      book: bookCode,
      version: version,
      chapters: 50, // За замовчуванням
      language:
        version.includes("LXX") || version.includes("GNT")
          ? "greek"
          : version.includes("THOT")
          ? "hebrew"
          : "ukrainian",
      hasStrongs: true,
      hasMorphology: version.includes("LXX") || version.includes("GNT"),
      updated: new Date().toISOString(),
    };

    METADATA_CACHE[cacheKey] = fallbackMetadata;
    return fallbackMetadata;
  } catch (error) {
    console.error(
      `Помилка завантаження метаданих для ${bookCode} ${version}:`,
      error
    );
    return null;
  }
}

/**
 * Отримати всі доступні версії для книги
 */
export async function getAvailableVersionsForBook(bookCode) {
  try {
    const translations = await loadAllTranslationsMetadata();
    const availableVersions = [];

    // Перевіримо наявність файлів для кожної версії
    for (const [version, info] of Object.entries(translations)) {
      const testUrl = `/data/translations/${version.toLowerCase()}/OldT/${bookCode}/gen1_${version.toLowerCase()}.json`;

      try {
        const response = await fetch(testUrl);
        if (response.ok) {
          availableVersions.push({
            code: version,
            name: info.name || version,
            language: info.lang || "uk",
          });
        }
      } catch (error) {
        // Пропускаємо цю версію
      }
    }

    return availableVersions;
  } catch (error) {
    console.error("Помилка отримання доступних версій:", error);
    return [];
  }
}

export default {
  loadAllTranslationsMetadata,
  loadBookMetadata,
  getAvailableVersionsForBook,
};
