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
