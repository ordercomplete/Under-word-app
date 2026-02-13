// src/utils/jsonAdapter.js

/**
 * АДАПТЕР ДЛЯ АВТОМАТИЧНОЇ РОБОТИ З ПОВНИМИ ТА СКОРОЧЕНИМИ ФОРМАТАМИ JSON
 *
 * Відповідає за:
 * 1. Конвертацію скорочених ключів в повні
 * 2. Автоматичне визначення типу даних
 * 3. Нормалізацію структур для подальшої обробки
 */

// ==================== КОНСТАНТИ ТА МАПІНГИ ====================

const keyMappings = {
  shortToFull: {
    // Основні поля
    w: "word",
    s: "strong",
    v: "verse",
    ws: "words",

    // Додаткові для оригіналів
    l: "lemma",
    m: "morphology",
    t: "translit",
    tr: "translation",

    // Для словників Strong
    mn: "meanings",
    lsj: "lsj_definition_raw",
    def: "definition",
    he: "hebrew_equiv",
    uc: "usages_count",
    gr: "greek_equiv",
    pos: "position",
    g: "grammar",
    u: "usages",
  },

  fullToShort: {},
};

// Автоматично генеруємо зворотну мапу
Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
  keyMappings.fullToShort[full] = short;
});

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

function extractActualData(data) {
  if (!data) {
    console.warn("jsonAdapter: data is null/undefined");
    return data;
  }

  // Новий формат перекладів/оригіналів: має _meta і verses
  if (data._meta && data.verses !== undefined) {
    return data.verses;
  }

  // Старий формат: або вже масив, або об'єкт
  return data;
}

function detectDataType(data) {
  if (!data) return "unknown";

  // 1. Словник Strong (об'єкт з ключами Gxxx або Hxxx)
  if (typeof data === "object" && !Array.isArray(data)) {
    const firstKey = Object.keys(data)[0];

    if (firstKey && (firstKey.startsWith("G") || firstKey.startsWith("H"))) {
      const entry = data[firstKey];

      if (entry && typeof entry === "object") {
        // Перевіряємо, чи це словник Strong (має s, w, tr тощо)
        const hasStrongFields =
          entry.s !== undefined ||
          entry.strong !== undefined ||
          entry.w !== undefined ||
          entry.word !== undefined ||
          entry.tr !== undefined ||
          entry.translation !== undefined;

        if (hasStrongFields) {
          return "strongs";
        }
      }
    }
  }

  // 2. Переклад/оригінал з метаданими
  if (data._meta && data.verses !== undefined) {
    return "translation_with_meta";
  }

  // 3. Масив віршів (старий формат)
  if (Array.isArray(data)) {
    if (data.length === 0) return "empty_array";

    const first = data[0];
    // Перевіряємо, чи це вірш (має v/verse та words/ws)
    const isVerse =
      (first.v !== undefined || first.verse !== undefined) &&
      (first.ws !== undefined || first.words !== undefined);

    if (isVerse) {
      return "verses_array";
    }
  }

  // 4. Інше
  return "unknown";
}

function expandJson(obj, depth = 0) {
  if (depth > 10) return obj;
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => expandJson(item, depth + 1));
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = keyMappings.shortToFull[key] || key;

    // Спеціальна обробка для словників Strong
    if (
      key === "s" &&
      typeof value === "string" &&
      (value.startsWith("G") || value.startsWith("H"))
    ) {
      result[newKey] = value;
      result["strong"] = value;
    } else {
      result[newKey] = expandJson(value, depth + 1);
    }
  }

  // Зворотні посилання для зворотної сумісності
  if (result.word !== undefined && result.w === undefined) {
    result.w = result.word;
  }
  if (result.strong !== undefined && result.s === undefined) {
    result.s = result.strong;
  }

  return result;
}

// ==================== ЕКСПОРТОВАНІ ФУНКЦІЇ ====================

export function jsonAdapter(data) {
  if (!data) {
    console.warn("jsonAdapter: data is null/undefined");
    return data;
  }

  const dataType = detectDataType(data);

  let result;

  switch (dataType) {
    case "strongs":
      result = {};
      Object.keys(data).forEach((key) => {
        result[key] = expandJson(data[key]);
      });
      break;

    case "translation_with_meta":
      const verses = Array.isArray(data.verses) ? data.verses : [data.verses];
      const expandedVerses = verses.map((verse) => expandJson(verse));

      // Повертаємо verses, але зберігаємо метадані
      if (Array.isArray(expandedVerses)) {
        expandedVerses._meta = data._meta;
        expandedVerses._originalStructure = "translation_with_meta";
      }

      result = expandedVerses;
      break;

    case "verses_array":
      result = data.map((verse) => expandJson(verse));
      break;

    case "empty_array":
      result = data;
      break;

    case "unknown":
    default:
      if (typeof data === "object") {
        const firstKey = Object.keys(data)[0];

        if (firstKey) {
          // Перевіримо, чи це словник Strong
          if (firstKey.startsWith("G") || firstKey.startsWith("H")) {
            return jsonAdapter(data); // Рекурсивно спробуємо ще раз
          }
        }

        result = data;
      } else {
        console.warn("jsonAdapter: невідомий формат даних, повертаємо як є");
        result = data;
      }
  }

  return result;
}

export function getMetadata(data) {
  if (!data) return null;

  // Якщо дані мають метадані безпосередньо
  if (data._meta) {
    return data._meta;
  }

  // Якщо це масив з метаданими
  if (Array.isArray(data) && data._meta) {
    return data._meta;
  }

  return null;
}

export function getValue(obj, fieldName) {
  if (!obj) return undefined;

  // Спочатку повний ключ
  if (obj[fieldName] !== undefined) {
    return obj[fieldName];
  }

  // Потім скорочений
  const shortKey = keyMappings.fullToShort[fieldName];
  if (shortKey && obj[shortKey] !== undefined) {
    return obj[shortKey];
  }

  // Для зворотної сумісності
  const alternativeNames = {
    word: ["w", "text", "original"],
    strong: ["s", "strongs", "code"],
    translation: ["tr", "trans", "meaning"],
    translit: ["t", "transliteration"],
    morph: ["m", "morphology", "form"],
    morphology: ["m", "morph", "form"],
    lemma: ["l"],
    verse: ["v"],
    words: ["ws"],
    definition: ["def"],
    meanings: ["mn"],
    usages: ["u"],
    grammar: ["g"],
    hebrew_equiv: ["he"],
    greek_equiv: ["gr"],
  };

  if (alternativeNames[fieldName]) {
    for (const alt of alternativeNames[fieldName]) {
      if (obj[alt] !== undefined) {
        return obj[alt];
      }
    }
  }

  return undefined;
}

export function normalizeStrongEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }

  const result = { ...entry };

  const ensureField = (fullName, shortName, defaultValue = "") => {
    if (result[fullName] === undefined && result[shortName] !== undefined) {
      result[fullName] = result[shortName];
    } else if (result[fullName] === undefined) {
      result[fullName] = defaultValue;
    }

    if (result[shortName] === undefined && result[fullName] !== undefined) {
      result[shortName] = result[fullName];
    }
  };

  // Обов'язкові поля
  ensureField("strong", "s", "");
  ensureField("word", "w", "");
  ensureField("translit", "t", "");
  ensureField("translation", "tr", "");
  ensureField("morphology", "m", "");

  // Опціональні
  ensureField("meanings", "mn", []);
  ensureField("lsj_definition_raw", "lsj", "");
  ensureField("grammar", "g", "");
  ensureField("usages", "u", []);
  ensureField("usages_count", "uc", 0);
  ensureField("definition", "def", "");
  ensureField("hebrew_equiv", "he", "");
  ensureField("lemma", "l", "");
  ensureField("greek_equiv", "gr", "");

  return result;
}

export function isCompressedFormat(data) {
  if (!data) return false;

  const dataType = detectDataType(data);

  if (dataType === "translation_with_meta") {
    const verses = data.verses;
    if (Array.isArray(verses) && verses.length > 0) {
      const first = verses[0];
      return (
        first.w !== undefined || first.s !== undefined || first.v !== undefined
      );
    }
  } else if (dataType === "verses_array") {
    if (data.length === 0) return false;

    const first = data[0];
    return (
      first.w !== undefined || first.s !== undefined || first.v !== undefined
    );
  }

  return false;
}

export function getStrongCode(obj) {
  if (!obj) return null;

  // Спробуємо різні варіанти
  if (obj.strong !== undefined) return obj.strong;
  if (obj.s !== undefined) return obj.s;

  // Можливо це сам код
  if (typeof obj === "string" && (obj.startsWith("G") || obj.startsWith("H"))) {
    return obj;
  }

  return null;
}

// ==================== ЕКСПОРТ ====================

export default {
  expandJson,
  jsonAdapter,
  getValue,
  normalizeStrongEntry,
  isCompressedFormat,
  getMetadata,
  getStrongCode,
  keyMappings,
  detectDataType,
  extractActualData,
};
