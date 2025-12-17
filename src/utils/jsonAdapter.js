// src/utils/jsonAdapter.js
/**
 * Адаптер для автоматичної роботи з повними та скороченими форматами JSON
 */

// ==================== ПОЛНІ МАПИ КЛЮЧІВ ====================

const keyMappings = {
  // Скорочення для віршів та слів
  shortToFull: {
    // === ОСНОВНІ СКОРОЧЕННЯ ===
    w: "word",
    s: "strong",
    v: "verse",
    ws: "words",

    // === СТРУКТУРНІ СКОРОЧЕННЯ ===
    c: "code",
    n: "name",
    ch: "chapters",
    g: "group",
    b: "books",
    ot: "OldT",
    nt: "NewT",

    // === СЛОВНИКИ STRONG'S (НОВІ!) ===
    t: "translit",
    tr: "translation",
    m: "morphology",
    u: "usages_count",
    mn: "meanings",
    lsj: "lsj_definition_raw",
    def: "definition",
    he: "hebrew_equiv",
    uc: "usages_count", // дубль для сумісності
    l: "lemma",
    pos: "position",

    // === ДОДАТКОВІ ПОЛЯ ===
    grammar: "grammar", // залишаємо як є
    usages: "usages", // залишаємо як є
  },

  fullToShort: {},
};

// Автоматично генеруємо зворотну мапу
Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
  keyMappings.fullToShort[full] = short;
});

// Додаємо спеціальні випадки
keyMappings.fullToShort["grammar"] = "g"; // граматика
keyMappings.fullToShort["usages"] = "u"; // вживання
keyMappings.shortToFull["g"] = "grammar"; // для зворотної сумісності
keyMappings.shortToFull["u"] = "usages"; // для зворотної сумісності

/**
 * Конвертує об'єкт з скорочених ключів в повні
 */
export function expandJson(obj, depth = 0) {
  // Захист від зациклення
  if (depth > 10) return obj;

  // Базові випадки
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  // Для масивів
  if (Array.isArray(obj)) {
    return obj.map((item) => expandJson(item, depth + 1));
  }

  // Для об'єктів
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Конвертуємо ключ
    const newKey = keyMappings.shortToFull[key] || key;

    // Спеціальна обробка для словників Strong
    if (
      key === "s" &&
      typeof value === "string" &&
      (value.startsWith("G") || value.startsWith("H"))
    ) {
      result[newKey] = value;
      result["strong"] = value; // Дублюємо для зручності
    } else {
      // Рекурсивно конвертуємо значення
      result[newKey] = expandJson(value, depth + 1);
    }
  }

  // Додаємо зворотні посилання для часто використовуваних полів
  if (result.word !== undefined && result.w === undefined) {
    result.w = result.word;
  }
  if (result.strong !== undefined && result.s === undefined) {
    result.s = result.strong;
  }

  return result;
}

/**
 * Конвертує об'єкт з повних ключів в скорочені
 */
export function compressJson(obj, depth = 0) {
  // Захист від зациклення
  if (depth > 10) return obj;

  // Базові випадки
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  // Для масивів
  if (Array.isArray(obj)) {
    return obj.map((item) => compressJson(item, depth + 1));
  }

  // Для об'єктів
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Конвертуємо ключ
    const newKey = keyMappings.fullToShort[key] || key;

    // Рекурсивно конвертуємо значення
    result[newKey] = compressJson(value, depth + 1);
  }

  return result;
}

/**
 * Автоматично визначає формат та конвертує в повний
 */
// export function jsonAdapter(data) {
//   // Перевірка на пусті дані
//   if (!data) return data;

//   // Швидка перевірка: якщо це вже повний формат (має поля word або strong)
//   const isAlreadyFull =
//     (Array.isArray(data) &&
//       data.length > 0 &&
//       (data[0].word !== undefined ||
//         data[0].strong !== undefined ||
//         data[0].words !== undefined)) ||
//     (!Array.isArray(data) &&
//       (data.word !== undefined ||
//         data.strong !== undefined ||
//         data.words !== undefined));

//   if (isAlreadyFull) {
//     // Вже повний формат, але все одно нормалізуємо
//     return normalizeStrongEntry(data);
//   }

//   // Перевіряємо на наявність скорочених ключів
//   const hasShortKeys =
//     (Array.isArray(data) &&
//       data.length > 0 &&
//       (data[0].w !== undefined ||
//         data[0].s !== undefined ||
//         data[0].ws !== undefined)) ||
//     (!Array.isArray(data) &&
//       (data.w !== undefined || data.s !== undefined || data.ws !== undefined));

//   if (hasShortKeys) {
//     const expanded = expandJson(data);
//     return normalizeStrongEntry(expanded);
//   }

//   // Якщо не визначили формат, повертаємо як є
//   return data;
// }
// src/utils/jsonAdapter.js - оновіть функцію jsonAdapter:
export function jsonAdapter(data) {
  console.log("🔄 jsonAdapter отримав:", typeof data, data);

  if (!data) {
    console.log("⚠️  jsonAdapter: data is null/undefined");
    return data;
  }

  // Якщо це вже масив з правильним форматом
  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log("⚠️  jsonAdapter: empty array");
      return data;
    }

    const first = data[0];
    const hasShortKeys =
      first.w !== undefined || first.s !== undefined || first.ws !== undefined;
    const hasFullKeys =
      first.word !== undefined ||
      first.strong !== undefined ||
      first.words !== undefined;

    console.log(
      `📊 Аналіз: короткі ключі=${hasShortKeys}, повні ключі=${hasFullKeys}`
    );

    // Якщо вже повний формат - повертаємо як є
    if (hasFullKeys) {
      console.log("✅ Вже повний формат");
      return data;
    }

    // Якщо короткий - розширюємо
    if (hasShortKeys) {
      console.log("🔄 Конвертація короткого формату в повний");
      return expandJson(data);
    }

    console.log("⚠️  Невідомий формат");
    return data;
  }

  // Якщо це об'єкт (можливо словник)
  if (typeof data === "object") {
    console.log("📦 Це обєкт, можливо словник");
    return expandJson(data);
  }

  console.log("⚠️  Непідтримуваний тип даних:", typeof data);
  return data;
}
/**
 * Нормалізує запис словника Strong до стандартної структури
 */
export function normalizeStrongEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }

  const result = { ...entry };

  // Забезпечуємо наявність основних полів
  const ensureField = (fullName, shortName, defaultValue = "") => {
    if (result[fullName] === undefined && result[shortName] !== undefined) {
      result[fullName] = result[shortName];
    } else if (result[fullName] === undefined) {
      result[fullName] = defaultValue;
    }

    // Дублюємо для зручності
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

  // Опціональні поля
  ensureField("meanings", "mn", []);
  ensureField("lsj_definition_raw", "lsj", "");
  ensureField("grammar", "g", "");
  ensureField("usages", "u", []);
  ensureField("usages_count", "uc", 0);
  ensureField("definition", "def", "");
  ensureField("hebrew_equiv", "he", "");
  ensureField("lemma", "l", "");

  // Спеціальні трансформації
  // 1. Якщо є definition, але немає meanings - створюємо meanings
  if (
    result.definition &&
    result.definition.trim() &&
    (!result.meanings || result.meanings.length === 0)
  ) {
    result.meanings = [result.definition];
    result.mn = [result.definition];
  }

  // 2. Якщо є definition та meanings, додаємо definition як перший елемент
  if (
    result.definition &&
    result.definition.trim() &&
    Array.isArray(result.meanings) &&
    !result.meanings.includes(result.definition)
  ) {
    result.meanings = [result.definition, ...result.meanings];
    result.mn = [result.definition, ...result.meanings];
  }

  // 3. Комбінуємо grammar з morphology
  if (result.grammar && result.grammar.trim() && result.morphology) {
    if (!result.morphology.includes(result.grammar)) {
      result.morphology = `${result.morphology}\n${result.grammar}`;
      result.m = `${result.morphology}`;
    }
  }

  return result;
}

/**
 * Допоміжна функція для безпечного отримання значення з обох форматів
 */
export function getValue(obj, fieldName) {
  if (!obj) return undefined;

  // Спочатку пробуємо повний ключ
  if (obj[fieldName] !== undefined) {
    return obj[fieldName];
  }

  // Потім пробуємо скорочений
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
    morphology: ["m", "morph", "form"],
    meanings: ["mn", "definitions", "senses"],
    usages_count: ["uc", "u", "count", "frequency"],
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

/**
 * Перевіряє, чи є дані в скороченому форматі
 */
export function isCompressedFormat(data) {
  if (!data) return false;

  if (Array.isArray(data)) {
    if (data.length === 0) return false;
    const first = data[0];
    return (
      first.w !== undefined || first.s !== undefined || first.v !== undefined
    );
  }

  return data.w !== undefined || data.s !== undefined || data.v !== undefined;
}

/**
 * Допоміжна функція для дебагінгу
 */
export function debugFormat(data) {
  if (!data) return "null";

  if (Array.isArray(data)) {
    if (data.length === 0) return "empty array";
    const first = data[0];
    const keys = Object.keys(first);
    return `array[${data.length}] with keys: ${keys.join(", ")}`;
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    return `object with keys: ${keys.join(", ")}`;
  }

  return typeof data;
}

export default {
  expandJson,
  compressJson,
  jsonAdapter,
  getValue,
  normalizeStrongEntry,
  isCompressedFormat,
  debugFormat,
  keyMappings,
};
