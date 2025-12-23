// loadChapter.js Placeholder for loading chapter JSON
// export const loadChapter = async (version, book, chapter) => {
//   try {
//     // Example: import(`../../originals/${version}/${book}/chapter${chapter}.json`)
//     return { verses: [] }; // Mock data
//   } catch (error) {
//     console.error("Error loading chapter:", error);
//     return { verses: [] };
//   }
// };

// loadChapter.js 03.12.2025
// const loadChapter = async (ver, book, chapter) => {
//   // ... fetch logic
//   const data = await res.json();
//   return data.map((verse) => ({
//     v: verse.v,
//     words: verse.w.map((w) => ({
//       word: w.w, // з "w" -> "word"
//       strong: w.s, // з "s" -> "strong"
//     })),
//   }));
// };
// export default loadChapter;

// src/utils/loadChapter.js (оновлена версія)
// import { jsonAdapter } from "./jsonAdapter";

// export const loadChapter = async (
//   book,
//   chapter,
//   version,
//   isOriginal = false
// ) => {
//   try {
//     const base = isOriginal ? "originals" : "translations";
//     const lowerVersion = version.toLowerCase();
//     const url = `/data/${base}/${lowerVersion}/OldT/${book}/${book.toLowerCase()}${chapter}_${lowerVersion}.json`;

//     console.log(`Loading: ${url}`);
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();

//     // Автоматично адаптуємо формат
//     return jsonAdapter(data);
//   } catch (error) {
//     console.error(`Failed to load ${version} ${book}:${chapter}:`, error);

//     // Фолбек: спробувати повний формат
//     try {
//       const fallbackUrl = `/data/${base}/${lowerVersion}/OldT/${book}/${book.toLowerCase()}${chapter}_${lowerVersion}_full.json`;
//       const fallbackResponse = await fetch(fallbackUrl);
//       if (fallbackResponse.ok) {
//         const fallbackData = await fallbackResponse.json();
//         return jsonAdapter(fallbackData);
//       }
//     } catch (fallbackError) {
//       console.error("Fallback also failed:", fallbackError);
//     }

//     return null;
//   }
// };

// -------------------------------------------------------

// src/utils/loadChapter.js
// import { jsonAdapter } from "./jsonAdapter";

// export const loadChapter = async (
//   book,
//   chapter,
//   version,
//   isOriginal = false
// ) => {
//   try {
//     const base = isOriginal ? "originals" : "translations";
//     const lowerVersion = version.toLowerCase();

//     // Спробуємо спочатку в data_compressed (новий формат)
//     let url = `/data_compressed/${base}/${lowerVersion}/OldT/${book}/${book.toLowerCase()}${chapter}_${lowerVersion}.json`;
//     console.log(`Loading chapter (primary): ${url}`);

//     let response = await fetch(url);

//     // Якщо не знайшли, спробуємо в оригінальній папці
//     if (!response.ok) {
//       url = `/data/${base}/${lowerVersion}/OldT/${book}/${book.toLowerCase()}${chapter}_${lowerVersion}.json`;
//       console.log(`Loading chapter (fallback): ${url}`);
//       response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     }

//     const data = await response.json();

//     // Автоматично адаптуємо формат
//     const adaptedData = jsonAdapter(data);

//     console.log(`Loaded ${version} ${book}:${chapter} successfully`);
//     console.log(`Format: ${adaptedData[0]?.w ? "short" : "full"}`);

//     return adaptedData;
//   } catch (error) {
//     console.error(`Failed to load ${version} ${book}:${chapter}:`, error);

//     // Спробуємо альтернативний шлях
//     try {
//       const altBase = isOriginal ? "originals" : "translations";
//       const altUrl = `/data/${altBase}/${version.toLowerCase()}/OldT/${book}/${book}${chapter}.json`;
//       console.log(`Trying alternative: ${altUrl}`);

//       const altResponse = await fetch(altUrl);
//       if (altResponse.ok) {
//         const altData = await altResponse.json();
//         return jsonAdapter(altData);
//       }
//     } catch (altError) {
//       console.error("Alternative path also failed:", altError);
//     }

//     return null;
//   }
// };

// /**
//  * Завантажує кілька версій одночасно
//  */
// export const loadMultipleChapters = async (book, chapter, versions) => {
//   const results = {};

//   await Promise.all(
//     versions.map(async (version) => {
//       try {
//         const isOriginal = ["lxx", "thot", "gnt"].includes(
//           version.toLowerCase()
//         );
//         results[version] = await loadChapter(
//           book,
//           chapter,
//           version,
//           isOriginal
//         );
//       } catch (error) {
//         console.error(`Failed to load ${version}:`, error);
//         results[version] = null;
//       }
//     })
//   );

//   return results;
// };

// export default {
//   loadChapter,
//   loadMultipleChapters,
// };

// --------------------------------------------------------------

// src/utils/loadChapter.js
// import { jsonAdapter } from "./jsonAdapter";

// export const loadChapter = async (
//   book,
//   chapter,
//   version,
//   isOriginal = false
// ) => {
//   try {
//     const lowerVersion = version.toLowerCase();
//     const bookLower = book.toLowerCase();

//     // Визначаємо базову папку
//     const base = isOriginal ? "originals" : "translations";

//     // Формуємо можливі шляхи (спочатку спробуємо скорочений)
//     const possiblePaths = [
//       // 1. Скорочений формат
//       `/data_compressed/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`,

//       // 2. Оригінальний шлях для скороченого
//       `/data/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`,

//       // 3. Старий формат імені файлу
//       `/data/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}.json`,

//       // 4. Альтернативне розташування
//       `/data_compressed/${base}/${lowerVersion}/${book}/${bookLower}${chapter}_${lowerVersion}.json`,
//     ];

//     console.log(`Loading ${version} ${book}:${chapter}`);
//     console.log("Possible paths:", possiblePaths);

//     let response = null;
//     let usedPath = "";

//     // Перебираємо всі можливі шляхи
//     for (const path of possiblePaths) {
//       try {
//         console.log(`Trying: ${path}`);
//         response = await fetch(path);

//         if (response.ok) {
//           usedPath = path;
//           console.log(`Found at: ${path}`);
//           break;
//         }
//       } catch (err) {
//         console.log(`Path ${path} failed:`, err.message);
//       }
//     }

//     if (!response || !response.ok) {
//       throw new Error(`File not found for ${version} ${book}:${chapter}`);
//     }

//     const data = await response.json();

//     // Автоматично адаптуємо формат
//     const adaptedData = jsonAdapter(data);

//     // Дебаг інформація
//     console.log(`✅ Loaded ${version} ${book}:${chapter} from: ${usedPath}`);
//     console.log(
//       `   Format detected: ${
//         adaptedData[0]?.w ? "short" : adaptedData[0]?.word ? "full" : "unknown"
//       }`
//     );
//     console.log(`   Verses: ${adaptedData.length || 0}`);

//     return adaptedData;
//   } catch (error) {
//     console.error(`❌ Failed to load ${version} ${book}:${chapter}:`, error);

//     // Повертаємо заглушку для тестування
//     return createFallbackChapter(book, chapter, version);
//   }
// };

// /**
//  * Створює заглушку для тестування
//  */
// function createFallbackChapter(book, chapter, version) {
//   console.log(`Creating fallback for ${version} ${book}:${chapter}`);

//   return [
//     {
//       verse: 1,
//       words: [
//         { word: "На", strong: "G1722" },
//         { word: "початку", strong: "G746" },
//         { word: "створив", strong: "G4160" },
//         { word: "Бог", strong: "G2316" },
//         { word: "небо", strong: "G3772" },
//         { word: "і", strong: "G2532" },
//         { word: "землю", strong: "G1093" },
//       ],
//     },
//   ];
// }

// /**
//  * Завантажує кілька версій одночасно
//  */
// export const loadMultipleChapters = async (book, chapter, versions) => {
//   const results = {};

//   const promises = versions.map(async (version) => {
//     try {
//       const isOriginal = ["lxx", "thot", "gnt"].includes(version.toLowerCase());
//       results[version] = await loadChapter(book, chapter, version, isOriginal);
//     } catch (error) {
//       console.error(`Failed to load ${version}:`, error);
//       results[version] = createFallbackChapter(book, chapter, version);
//     }
//   });

//   await Promise.all(promises);
//   return results;
// };

// export default {
//   loadChapter,
//   loadMultipleChapters,
// };

// ----------------------------------------------------------------

// src/utils/loadChapter.js
// import { jsonAdapter } from "./jsonAdapter";

// export const loadChapter = async (
//   book,
//   chapter,
//   version,
//   isOriginal = false
// ) => {
//   console.log(`🚀 loadChapter: ${book}.${chapter} ${version}`);

//   try {
//     const lowerVersion = version.toLowerCase();
//     const bookLower = book.toLowerCase();

//     // Визначаємо базову папку
//     const base = isOriginal ? "originals" : "translations";

//     // Формуємо URL - використовуємо скорочений формат
//     const url = `/data_compressed/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`;

//     console.log(`📁 Завантаження з: ${url}`);

//     const response = await fetch(url);

//     if (!response.ok) {
//       console.warn(`⚠️  ${url} не знайдено, спробуємо оригінальний шлях`);

//       // Спробуємо оригінальний шлях
//       const fallbackUrl = `/data/${base}/${lowerVersion}/OldT/${book}/${bookLower}${chapter}_${lowerVersion}.json`;
//       const fallbackResponse = await fetch(fallbackUrl);

//       if (!fallbackResponse.ok) {
//         throw new Error(`Не знайдено: ${url} та ${fallbackUrl}`);
//       }

//       const data = await fallbackResponse.json();
//       console.log(`✅ Завантажено з fallback: ${fallbackUrl}`);
//       return jsonAdapter(data);
//     }

//     const data = await response.json();
//     console.log(`✅ Успішно завантажено: ${url}`);
//     console.log(`📊 Дані:`, data);

//     // Переконуємося, що це масив
//     if (!Array.isArray(data)) {
//       console.warn(`⚠️  Дані не є масивом, тип: ${typeof data}`);

//       // Спробуємо конвертувати
//       if (typeof data === "object") {
//         const asArray = Object.values(data);
//         console.log(`🔄 Конвертовано в масив з ${asArray.length} елементів`);
//         return jsonAdapter(asArray);
//       }

//       throw new Error(`Очікувався масив, отримано: ${typeof data}`);
//     }

//     return jsonAdapter(data);
//   } catch (error) {
//     console.error(`❌ Помилка loadChapter:`, error);

//     // Створюємо заглушку для тестування
//     return createFallbackData();
//   }
// };

// function createFallbackData() {
//   console.log("🔄 Створення тестових даних");
//   return [
//     {
//       verse: 1,
//       words: [
//         { word: "На", strong: "G1722" },
//         { word: "початку", strong: "G746" },
//         { word: "створив", strong: "G4160" },
//         { word: "Бог", strong: "G2316" },
//         { word: "небо", strong: "G3772" },
//         { word: "і", strong: "G2532" },
//         { word: "землю", strong: "G1093" },
//       ],
//     },
//   ];
// }

// // export default { loadChapter };

// // Або для CommonJS сумісності:
// if (typeof module !== "undefined" && module.exports) {
//   module.exports = { loadChapter, loadMultipleChapters };
// }

// ---------------------------------------------------

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
