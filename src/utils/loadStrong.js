// src/utils/loadStrong.js

// export const loadStrongEntry = async (strongCode) => {
//   try {
//     const url = `/data/strongs/${strongCode}.json`;
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}`);
//     }

//     const data = await response.json();
//     const key = Object.keys(data)[0];
//     const entry = data[key];

//     // Конвертуємо скорочену структуру в повну для зручності
//     return {
//       strong: entry.s || strongCode,
//       word: entry.w || "",
//       translit: entry.t || "",
//       translation: entry.tr || "",
//       morphology: entry.m || "",
//       usages_count: entry.u || 0,
//       meanings: Array.isArray(entry.mn) ? entry.mn : [],
//       lsj_definition_raw: entry.lsj || "",
//       grammar: entry.g || "",
//       // Зберігаємо оригінальні скорочені дані для ефективності
//       _compressed: entry,
//     };
//   } catch (error) {
//     console.error(`Failed to load Strong's entry ${strongCode}:`, error);
//     return null;
//   }
// };

// ----------------------------------------------

// src/utils/loadStrong.js
// import { jsonAdapter, getValue } from "./jsonAdapter";

// export const loadStrongEntry = async (strongCode) => {
//   try {
//     const url = `/data/strongs/${strongCode}.json`;
//     console.log(`Loading Strong's entry: ${url}`);

//     const response = await fetch(url);

//     if (!response.ok) {
//       // Спробуємо в іншій папці
//       const altUrl = `/data_compressed/strongs/${strongCode}.json`;
//       console.log(`Trying alternative: ${altUrl}`);
//       const altResponse = await fetch(altUrl);

//       if (!altResponse.ok) {
//         throw new Error(`HTTP ${response.status} (and ${altResponse.status})`);
//       }

//       const altData = await altResponse.json();
//       const processed = processStrongData(altData, strongCode);
//       console.log(`Loaded ${strongCode} from alternative path`);
//       return processed;
//     }

//     const data = await response.json();
//     const processed = processStrongData(data, strongCode);
//     console.log(`Loaded ${strongCode} successfully`);
//     return processed;
//   } catch (error) {
//     console.error(`Failed to load Strong's entry ${strongCode}:`, error);

//     // Повертаємо заглушку
//     return createFallbackEntry(strongCode);
//   }
// };

// /**
//  * Обробляє дані словника незалежно від формату
//  */
// function processStrongData(data, strongCode) {
//   // Адаптуємо дані до стандартного формату
//   const adapted = jsonAdapter(data);

//   // Знаходимо конкретний запис
//   let entry;

//   if (adapted[strongCode]) {
//     // Формат: { "G746": { ... } }
//     entry = adapted[strongCode];
//   } else if (adapted.strong === strongCode || adapted.s === strongCode) {
//     // Формат: { "strong": "G746", ... }
//     entry = adapted;
//   } else if (Array.isArray(adapted)) {
//     // Формат: [{ "strong": "G746", ... }]
//     entry = adapted.find(
//       (item) => item.strong === strongCode || item.s === strongCode
//     );
//   } else {
//     // Не знайшли - створюємо базовий запис
//     entry = adapted;
//   }

//   // Забезпечуємо наявність всіх полів
//   return ensureStrongEntryFields(entry, strongCode);
// }

// /**
//  * Забезпечує наявність всіх необхідних полів у записі
//  */
// function ensureStrongEntryFields(entry, strongCode) {
//   if (!entry) {
//     return createFallbackEntry(strongCode);
//   }

//   // Використовуємо getValue для безпечного отримання полів
//   const safeEntry = {
//     // Основні поля
//     strong: getValue(entry, "strong") || strongCode,
//     word: getValue(entry, "word") || "—",
//     translit: getValue(entry, "translit") || "",
//     translation: getValue(entry, "translation") || "—",
//     morphology: getValue(entry, "morphology") || "",

//     // Додаткові поля
//     usages_count: getValue(entry, "usages_count") || 0,
//     meanings: Array.isArray(getValue(entry, "meanings"))
//       ? getValue(entry, "meanings")
//       : [],
//     lsj_definition_raw: getValue(entry, "lsj_definition_raw") || "",
//     grammar: getValue(entry, "grammar") || "",
//     definition: getValue(entry, "definition") || "",
//     hebrew_equiv: getValue(entry, "hebrew_equiv") || "",
//     usages: Array.isArray(getValue(entry, "usages"))
//       ? getValue(entry, "usages")
//       : [],

//     // Зберігаємо оригінальні дані для дебагінгу
//     _original: entry,
//     _format: entry.w ? "short" : entry.word ? "full" : "unknown",
//   };

//   // Заповнюємо meanings з definition якщо потрібно
//   if (
//     safeEntry.definition &&
//     safeEntry.definition.trim() &&
//     (!safeEntry.meanings || safeEntry.meanings.length === 0)
//   ) {
//     safeEntry.meanings = [safeEntry.definition];
//   }

//   // Комбінуємо grammar з morphology
//   if (safeEntry.grammar && safeEntry.grammar.trim() && safeEntry.morphology) {
//     if (!safeEntry.morphology.includes(safeEntry.grammar)) {
//       safeEntry.morphology = `${safeEntry.morphology}\n${safeEntry.grammar}`;
//     }
//   }

//   return safeEntry;
// }

// /**
//  * Створює заглушку для відсутніх записів
//  */
// function createFallbackEntry(strongCode) {
//   return {
//     strong: strongCode,
//     word: "Дані відсутні",
//     translit: "",
//     translation: "—",
//     morphology: "",
//     usages_count: 0,
//     meanings: ["Дані словника відсутні або ще не завантажені"],
//     lsj_definition_raw: "",
//     grammar: "",
//     definition: "",
//     hebrew_equiv: "",
//     usages: [],
//     _isFallback: true,
//   };
// }

// /**
//  * Завантажує кілька записів одночасно
//  */
// export const loadMultipleStrongEntries = async (strongCodes) => {
//   const entries = {};

//   await Promise.all(
//     strongCodes.map(async (code) => {
//       try {
//         entries[code] = await loadStrongEntry(code);
//       } catch (error) {
//         entries[code] = createFallbackEntry(code);
//       }
//     })
//   );

//   return entries;
// };

// export default {
//   loadStrongEntry,
//   loadMultipleStrongEntries,
// };

// ----------------------------------------------

// src/utils/loadStrong.js

import { jsonAdapter, getValue } from "./jsonAdapter";

export const loadStrongEntry = async (strongCode) => {
  try {
    // Формуємо можливі шляхи
    const possiblePaths = [
      `/data_compressed/strongs/${strongCode}.json`,
      `/data/strongs/${strongCode}.json`,
      `/data_compressed/strongs/${strongCode.toLowerCase()}.json`,
      `/data/strongs/${strongCode.toLowerCase()}.json`,
    ];

    console.log(`Loading Strong's entry: ${strongCode}`);
    console.log("Possible paths:", possiblePaths);

    let response = null;
    let usedPath = "";

    // Перебираємо всі шляхи
    for (const path of possiblePaths) {
      try {
        console.log(`Trying: ${path}`);
        response = await fetch(path);

        if (response.ok) {
          usedPath = path;
          console.log(`Found at: ${path}`);
          break;
        }
      } catch (err) {
        console.log(`Path ${path} failed:`, err.message);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Strong's entry ${strongCode} not found in any location`);
    }

    const data = await response.json();
    const processed = processStrongData(data, strongCode);

    console.log(`✅ Loaded ${strongCode} from: ${usedPath}`);
    console.log(`   Format: ${processed._format}`);
    console.log(`   Word: ${processed.word}`);

    return processed;
  } catch (error) {
    console.error(`❌ Failed to load Strong's entry ${strongCode}:`, error);

    // Повертаємо заглушку з детальною інформацією
    return createDetailedFallbackEntry(strongCode, error);
  }
};

/**
 * Створює детальну заглушку
 */
function createDetailedFallbackEntry(strongCode, error) {
  return {
    strong: strongCode,
    word: "⚠️ Дані відсутні",
    translit: "",
    translation: "—",
    morphology: "",
    usages_count: 0,
    meanings: [`Файл не знайдено: ${error.message}`],
    lsj_definition_raw: "",
    grammar: "",
    _isFallback: true,
    _error: error.message,
    _timestamp: new Date().toISOString(),
  };
}

// Решта функцій залишаються як було раніше...
/**
 * Завантажує кілька записів одночасно
 */
export const loadMultipleStrongEntries = async (strongCodes) => {
  const entries = {};

  await Promise.all(
    strongCodes.map(async (code) => {
      try {
        entries[code] = await loadStrongEntry(code);
      } catch (error) {
        entries[code] = createFallbackEntry(code);
      }
    })
  );

  return entries;
};

export default {
  loadStrongEntry,
  loadMultipleStrongEntries,
};
