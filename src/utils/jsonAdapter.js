// // src/utils/jsonAdapter.js
// /**
//  * Адаптер для автоматичної роботи з повними та скороченими форматами JSON
//  */

// // ==================== ПОЛНІ МАПИ КЛЮЧІВ ====================

// const keyMappings = {
//   // Скорочення для віршів та слів
//   shortToFull: {
//     // === ОСНОВНІ СКОРОЧЕННЯ ===
//     w: "word",
//     s: "strong",
//     v: "verse",
//     ws: "words",

//     // === СТРУКТУРНІ СКОРОЧЕННЯ ===
//     c: "code",
//     n: "name",
//     ch: "chapters",
//     g: "group",
//     b: "books",
//     ot: "OldT",
//     nt: "NewT",

//     // === СЛОВНИКИ STRONG'S (НОВІ!) ===
//     t: "translit",
//     tr: "translation",
//     m: "morphology",
//     u: "usages_count",
//     mn: "meanings",
//     lsj: "lsj_definition_raw",
//     def: "definition",
//     he: "hebrew_equiv",
//     uc: "usages_count", // дубль для сумісності
//     l: "lemma",
//     pos: "position",

//     // === ДОДАТКОВІ ПОЛЯ ===
//     grammar: "grammar", // залишаємо як є
//     usages: "usages", // залишаємо як є
//   },

//   fullToShort: {},
// };

// // Автоматично генеруємо зворотну мапу
// Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
//   keyMappings.fullToShort[full] = short;
// });

// // Додаємо спеціальні випадки
// keyMappings.fullToShort["grammar"] = "g"; // граматика
// keyMappings.fullToShort["usages"] = "u"; // вживання
// keyMappings.shortToFull["g"] = "grammar"; // для зворотної сумісності
// keyMappings.shortToFull["u"] = "usages"; // для зворотної сумісності

// /**
//  * Конвертує об'єкт з скорочених ключів в повні
//  */
// export function expandJson(obj, depth = 0) {
//   // Захист від зациклення
//   if (depth > 10) return obj;

//   // Базові випадки
//   if (obj === null || obj === undefined) return obj;
//   if (typeof obj !== "object") return obj;

//   // Для масивів
//   if (Array.isArray(obj)) {
//     return obj.map((item) => expandJson(item, depth + 1));
//   }

//   // Для об'єктів
//   const result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     // Конвертуємо ключ
//     const newKey = keyMappings.shortToFull[key] || key;

//     // Спеціальна обробка для словників Strong
//     if (
//       key === "s" &&
//       typeof value === "string" &&
//       (value.startsWith("G") || value.startsWith("H"))
//     ) {
//       result[newKey] = value;
//       result["strong"] = value; // Дублюємо для зручності
//     } else {
//       // Рекурсивно конвертуємо значення
//       result[newKey] = expandJson(value, depth + 1);
//     }
//   }

//   // Додаємо зворотні посилання для часто використовуваних полів
//   if (result.word !== undefined && result.w === undefined) {
//     result.w = result.word;
//   }
//   if (result.strong !== undefined && result.s === undefined) {
//     result.s = result.strong;
//   }

//   return result;
// }

// /**
//  * Конвертує об'єкт з повних ключів в скорочені
//  */
// export function compressJson(obj, depth = 0) {
//   // Захист від зациклення
//   if (depth > 10) return obj;

//   // Базові випадки
//   if (obj === null || obj === undefined) return obj;
//   if (typeof obj !== "object") return obj;

//   // Для масивів
//   if (Array.isArray(obj)) {
//     return obj.map((item) => compressJson(item, depth + 1));
//   }

//   // Для об'єктів
//   const result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     // Конвертуємо ключ
//     const newKey = keyMappings.fullToShort[key] || key;

//     // Рекурсивно конвертуємо значення
//     result[newKey] = compressJson(value, depth + 1);
//   }

//   return result;
// }

// /**
//  * Автоматично визначає формат та конвертує в повний
//  */
// // export function jsonAdapter(data) {
// //   // Перевірка на пусті дані
// //   if (!data) return data;

// //   // Швидка перевірка: якщо це вже повний формат (має поля word або strong)
// //   const isAlreadyFull =
// //     (Array.isArray(data) &&
// //       data.length > 0 &&
// //       (data[0].word !== undefined ||
// //         data[0].strong !== undefined ||
// //         data[0].words !== undefined)) ||
// //     (!Array.isArray(data) &&
// //       (data.word !== undefined ||
// //         data.strong !== undefined ||
// //         data.words !== undefined));

// //   if (isAlreadyFull) {
// //     // Вже повний формат, але все одно нормалізуємо
// //     return normalizeStrongEntry(data);
// //   }

// //   // Перевіряємо на наявність скорочених ключів
// //   const hasShortKeys =
// //     (Array.isArray(data) &&
// //       data.length > 0 &&
// //       (data[0].w !== undefined ||
// //         data[0].s !== undefined ||
// //         data[0].ws !== undefined)) ||
// //     (!Array.isArray(data) &&
// //       (data.w !== undefined || data.s !== undefined || data.ws !== undefined));

// //   if (hasShortKeys) {
// //     const expanded = expandJson(data);
// //     return normalizeStrongEntry(expanded);
// //   }

// //   // Якщо не визначили формат, повертаємо як є
// //   return data;
// // }
// // src/utils/jsonAdapter.js - оновіть функцію jsonAdapter:
// export function jsonAdapter(data) {
//   console.log("🔄 jsonAdapter отримав:", typeof data, data);

//   if (!data) {
//     console.log("⚠️  jsonAdapter: data is null/undefined");
//     return data;
//   }

//   // Якщо це вже масив з правильним форматом
//   if (Array.isArray(data)) {
//     if (data.length === 0) {
//       console.log("⚠️  jsonAdapter: empty array");
//       return data;
//     }

//     const first = data[0];
//     const hasShortKeys =
//       first.w !== undefined || first.s !== undefined || first.ws !== undefined;
//     const hasFullKeys =
//       first.word !== undefined ||
//       first.strong !== undefined ||
//       first.words !== undefined;

//     console.log(
//       `📊 Аналіз: короткі ключі=${hasShortKeys}, повні ключі=${hasFullKeys}`
//     );

//     // Якщо вже повний формат - повертаємо як є
//     if (hasFullKeys) {
//       console.log("✅ Вже повний формат");
//       return data;
//     }

//     // Якщо короткий - розширюємо
//     if (hasShortKeys) {
//       console.log("🔄 Конвертація короткого формату в повний");
//       return expandJson(data);
//     }

//     console.log("⚠️  Невідомий формат");
//     return data;
//   }

//   // Якщо це об'єкт (можливо словник)
//   if (typeof data === "object") {
//     console.log("📦 Це обєкт, можливо словник");
//     return expandJson(data);
//   }

//   console.log("⚠️  Непідтримуваний тип даних:", typeof data);
//   return data;
// }
// /**
//  * Нормалізує запис словника Strong до стандартної структури
//  */
// export function normalizeStrongEntry(entry) {
//   if (!entry || typeof entry !== "object") {
//     return entry;
//   }

//   const result = { ...entry };

//   // Забезпечуємо наявність основних полів
//   const ensureField = (fullName, shortName, defaultValue = "") => {
//     if (result[fullName] === undefined && result[shortName] !== undefined) {
//       result[fullName] = result[shortName];
//     } else if (result[fullName] === undefined) {
//       result[fullName] = defaultValue;
//     }

//     // Дублюємо для зручності
//     if (result[shortName] === undefined && result[fullName] !== undefined) {
//       result[shortName] = result[fullName];
//     }
//   };

//   // Обов'язкові поля
//   ensureField("strong", "s", "");
//   ensureField("word", "w", "");
//   ensureField("translit", "t", "");
//   ensureField("translation", "tr", "");
//   ensureField("morphology", "m", "");

//   // Опціональні поля
//   ensureField("meanings", "mn", []);
//   ensureField("lsj_definition_raw", "lsj", "");
//   ensureField("grammar", "g", "");
//   ensureField("usages", "u", []);
//   ensureField("usages_count", "uc", 0);
//   ensureField("definition", "def", "");
//   ensureField("hebrew_equiv", "he", "");
//   ensureField("lemma", "l", "");

//   // Спеціальні трансформації
//   // 1. Якщо є definition, але немає meanings - створюємо meanings
//   if (
//     result.definition &&
//     result.definition.trim() &&
//     (!result.meanings || result.meanings.length === 0)
//   ) {
//     result.meanings = [result.definition];
//     result.mn = [result.definition];
//   }

//   // 2. Якщо є definition та meanings, додаємо definition як перший елемент
//   if (
//     result.definition &&
//     result.definition.trim() &&
//     Array.isArray(result.meanings) &&
//     !result.meanings.includes(result.definition)
//   ) {
//     result.meanings = [result.definition, ...result.meanings];
//     result.mn = [result.definition, ...result.meanings];
//   }

//   // 3. Комбінуємо grammar з morphology
//   if (result.grammar && result.grammar.trim() && result.morphology) {
//     if (!result.morphology.includes(result.grammar)) {
//       result.morphology = `${result.morphology}\n${result.grammar}`;
//       result.m = `${result.morphology}`;
//     }
//   }

//   return result;
// }

// /**
//  * Допоміжна функція для безпечного отримання значення з обох форматів
//  */
// export function getValue(obj, fieldName) {
//   if (!obj) return undefined;

//   // Спочатку пробуємо повний ключ
//   if (obj[fieldName] !== undefined) {
//     return obj[fieldName];
//   }

//   // Потім пробуємо скорочений
//   const shortKey = keyMappings.fullToShort[fieldName];
//   if (shortKey && obj[shortKey] !== undefined) {
//     return obj[shortKey];
//   }

//   // Для зворотної сумісності
//   const alternativeNames = {
//     word: ["w", "text", "original"],
//     strong: ["s", "strongs", "code"],
//     translation: ["tr", "trans", "meaning"],
//     translit: ["t", "transliteration"],
//     morphology: ["m", "morph", "form"],
//     meanings: ["mn", "definitions", "senses"],
//     usages_count: ["uc", "u", "count", "frequency"],
//   };

//   if (alternativeNames[fieldName]) {
//     for (const alt of alternativeNames[fieldName]) {
//       if (obj[alt] !== undefined) {
//         return obj[alt];
//       }
//     }
//   }

//   return undefined;
// }

// /**
//  * Перевіряє, чи є дані в скороченому форматі
//  */
// export function isCompressedFormat(data) {
//   if (!data) return false;

//   if (Array.isArray(data)) {
//     if (data.length === 0) return false;
//     const first = data[0];
//     return (
//       first.w !== undefined || first.s !== undefined || first.v !== undefined
//     );
//   }

//   return data.w !== undefined || data.s !== undefined || data.v !== undefined;
// }

// /**
//  * Допоміжна функція для дебагінгу
//  */
// export function debugFormat(data) {
//   if (!data) return "null";

//   if (Array.isArray(data)) {
//     if (data.length === 0) return "empty array";
//     const first = data[0];
//     const keys = Object.keys(first);
//     return `array[${data.length}] with keys: ${keys.join(", ")}`;
//   }

//   if (typeof data === "object") {
//     const keys = Object.keys(data);
//     return `object with keys: ${keys.join(", ")}`;
//   }

//   return typeof data;
// }

// export default {
//   expandJson,
//   compressJson,
//   jsonAdapter,
//   getValue,
//   normalizeStrongEntry,
//   isCompressedFormat,
//   debugFormat,
//   keyMappings,
// };

// ----------------------------------------------------

// // src/utils/jsonAdapter.js - ОНОВЛЕНА ВЕРСІЯ 23.12.25
// /**
//  * Адаптер для автоматичної роботи з повними та скороченими форматами JSON
//  */

// // ==================== ПОЛНІ МАПИ КЛЮЧІВ ====================

// const keyMappings = {
//   shortToFull: {
//     // Основні
//     w: "word",
//     s: "strong",
//     v: "verse",
//     ws: "words",

//     // Додаткові для оригіналів
//     l: "lemma",
//     m: "morph",

//     // Структурні
//     c: "code",
//     n: "name",
//     ch: "chapters",
//     g: "group",
//     b: "books",
//     ot: "OldT",
//     nt: "NewT",

//     // Словники
//     t: "translit",
//     tr: "translation",
//     m: "morphology",
//     u: "usages_count",
//     mn: "meanings",
//     lsj: "lsj_definition_raw",
//     def: "definition",
//     he: "hebrew_equiv",
//     uc: "usages_count",
//     l: "lemma",
//     pos: "position",
//   },

//   fullToShort: {},
// };

// // Автоматично генеруємо зворотну мапу
// Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
//   keyMappings.fullToShort[full] = short;
// });

// /**
//  * НОВА ФУНКЦІЯ: Отримати реальні дані з нового формату
//  */
// function extractActualData(data) {
//   if (!data) return data;

//   // Новий формат: має _meta і verses
//   if (data._meta && data.verses !== undefined) {
//     return data.verses;
//   }

//   // Старий формат: або вже масив, або об'єкт
//   return data;
// }

// /**
//  * Конвертує об'єкт з скорочених ключів в повні
//  */
// export function expandJson(obj, depth = 0) {
//   if (depth > 10) return obj;
//   if (obj === null || obj === undefined) return obj;
//   if (typeof obj !== "object") return obj;

//   if (Array.isArray(obj)) {
//     return obj.map((item) => expandJson(item, depth + 1));
//   }

//   const result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = keyMappings.shortToFull[key] || key;

//     // Спеціальна обробка для словників Strong
//     if (
//       key === "s" &&
//       typeof value === "string" &&
//       (value.startsWith("G") || value.startsWith("H"))
//     ) {
//       result[newKey] = value;
//       result["strong"] = value;
//     } else {
//       result[newKey] = expandJson(value, depth + 1);
//     }
//   }

//   // Зворотні посилання
//   if (result.word !== undefined && result.w === undefined) {
//     result.w = result.word;
//   }
//   if (result.strong !== undefined && result.s === undefined) {
//     result.s = result.strong;
//   }

//   return result;
// }

// /**
//  * Автоматично визначає формат та конвертує в повний
//  */
// // export function jsonAdapter(data) {
// //   console.log("🔄 jsonAdapter отримав:", data ? "object/array" : "null");

// //   if (!data) {
// //     console.log("⚠️  jsonAdapter: data is null/undefined");
// //     return data;
// //   }

// //   // НОВЕ: Обробка нового формату з метаданими
// //   if (data._meta && data.verses !== undefined) {
// //     console.log("📦 Новий формат з метаданими");

// //     // Повертаємо verses для обробки, але зберігаємо метадані для подальшого використання
// //     const result = Array.isArray(data.verses) ? data.verses : [data.verses];
// //     result._meta = data._meta; // Додаємо метадані до результату
// //     return result;
// //   }

// //   // Старий формат
// //   if (Array.isArray(data)) {
// //     if (data.length === 0) {
// //       console.log("⚠️  jsonAdapter: empty array");
// //       return data;
// //     }

// //     const first = data[0];
// //     const hasShortKeys =
// //       first.w !== undefined || first.s !== undefined || first.ws !== undefined;
// //     const hasFullKeys =
// //       first.word !== undefined ||
// //       first.strong !== undefined ||
// //       first.words !== undefined;

// //     // Якщо вже повний формат - повертаємо як є
// //     if (hasFullKeys) {
// //       console.log("✅ Вже повний формат");
// //       return data;
// //     }

// //     // Якщо короткий - розширюємо
// //     if (hasShortKeys) {
// //       console.log("🔄 Конвертація короткого формату в повний");
// //       return expandJson(data);
// //     }

// //     console.log("⚠️  Невідомий формат");
// //     return data;
// //   }

// //   // Об'єкт (можливо словник)
// //   if (typeof data === "object") {
// //     console.log("📦 Це обєкт, можливо словник");
// //     return expandJson(data);
// //   }

// //   console.log("⚠️  Непідтримуваний тип даних:", typeof data);
// //   return data;
// // }
// // -----------------------------23.12.25 export function jsonAdapter(data)
// export function jsonAdapter(data) {
//   // Якщо немає даних
//   if (!data) return [];

//   // НОВИЙ ФОРМАТ: { _meta, verses }
//   if (data._meta && data.verses !== undefined) {
//     // Повертаємо verses, але зберігаємо метадані
//     const verses = Array.isArray(data.verses) ? data.verses : [data.verses];
//     verses._meta = data._meta; // Додаємо метадані до масиву
//     return verses;
//   }

//   // СТАРИЙ ФОРМАТ: масив віршів
//   if (Array.isArray(data)) {
//     // Конвертуємо скорочені ключі назад при потребі
//     return data.map((verse) => {
//       if (!verse || typeof verse !== "object") return verse;

//       const result = {};

//       // Конвертуємо основні поля
//       if (verse.v !== undefined) result.verse = verse.v;
//       if (verse.v !== undefined) result.v = verse.v; // Залишаємо і скорочену версію

//       // Конвертуємо слова
//       if (verse.ws && Array.isArray(verse.ws)) {
//         result.words = verse.ws.map((word) => {
//           const wordObj = {};

//           if (word.w !== undefined) wordObj.word = word.w;
//           if (word.w !== undefined) wordObj.w = word.w;

//           if (word.s !== undefined) wordObj.strong = word.s;
//           if (word.s !== undefined) wordObj.s = word.s;

//           if (word.l !== undefined) wordObj.lemma = word.l;
//           if (word.m !== undefined) wordObj.morph = word.m;

//           return wordObj;
//         });
//         result.ws = verse.ws; // Залишаємо і скорочену версію
//       }

//       return result;
//     });
//   }

//   // Невідомий формат
//   console.warn("⚠️  Невідомий формат даних у jsonAdapter");
//   return [];
// }
// // -------------------------------------

// /**
//  * Отримати метадані з даних (якщо є)
//  */
// // export function getMetadata(data) {
// //   if (!data) return null;

// //   // Якщо дані мають метадані безпосередньо
// //   if (data._meta) return data._meta;

// //   // Якщо це масив з метаданими
// //   if (Array.isArray(data) && data._meta) {
// //     return data._meta;
// //   }

// //   return null;
// // }
// export function getMetadata(data) {
//   if (!data) return null;

//   // Якщо дані мають метадані
//   if (data._meta) return data._meta;

//   // Якщо це масив з метаданими
//   if (Array.isArray(data) && data._meta) {
//     return data._meta;
//   }

//   return null;
// }

// // export default {
// //   jsonAdapter,
// //   getValue,
// //   getMetadata,
// // };
// // ----------------------------------------

// /**
//  * Безпечне отримання значення з обох форматів
//  */
// // export function getValue(obj, fieldName) {
// //   if (!obj) return undefined;

// //   // Спочатку повний ключ
// //   if (obj[fieldName] !== undefined) {
// //     return obj[fieldName];
// //   }

// //   // Потім скорочений
// //   const shortKey = keyMappings.fullToShort[fieldName];
// //   if (shortKey && obj[shortKey] !== undefined) {
// //     return obj[shortKey];
// //   }

// //   // Для зворотної сумісності
// //   const alternativeNames = {
// //     word: ["w", "text", "original"],
// //     strong: ["s", "strongs", "code"],
// //     translation: ["tr", "trans", "meaning"],
// //     translit: ["t", "transliteration"],
// //     morph: ["m", "morphology", "form"],
// //     lemma: ["l"],
// //     verse: ["v"],
// //     words: ["ws"],
// //   };

// //   if (alternativeNames[fieldName]) {
// //     for (const alt of alternativeNames[fieldName]) {
// //       if (obj[alt] !== undefined) {
// //         return obj[alt];
// //       }
// //     }
// //   }

// //   return undefined;
// // }
// // -------------------------------23.12.25 export function getValue(obj, key)
// export function getValue(obj, key) {
//   if (!obj) return undefined;

//   // Спробуємо різні варіанти ключа
//   const keyVariants = {
//     word: ["word", "w", "text"],
//     strong: ["strong", "s", "strongs"],
//     verse: ["verse", "v"],
//     words: ["words", "ws"],
//     lemma: ["lemma", "l"],
//     morph: ["morph", "m", "morphology"],
//   };

//   const variants = keyVariants[key] || [key];

//   for (const variant of variants) {
//     if (obj[variant] !== undefined) {
//       return obj[variant];
//     }
//   }

//   return undefined;
// }
// // --------------------------------------------------
// /**
//  * Нормалізує запис словника Strong
//  */
// export function normalizeStrongEntry(entry) {
//   if (!entry || typeof entry !== "object") {
//     return entry;
//   }

//   const result = { ...entry };

//   // Забезпечуємо наявність основних полів
//   const ensureField = (fullName, shortName, defaultValue = "") => {
//     if (result[fullName] === undefined && result[shortName] !== undefined) {
//       result[fullName] = result[shortName];
//     } else if (result[fullName] === undefined) {
//       result[fullName] = defaultValue;
//     }

//     if (result[shortName] === undefined && result[fullName] !== undefined) {
//       result[shortName] = result[fullName];
//     }
//   };

//   // Обов'язкові поля
//   ensureField("strong", "s", "");
//   ensureField("word", "w", "");
//   ensureField("translit", "t", "");
//   ensureField("translation", "tr", "");
//   ensureField("morphology", "m", "");

//   // Опціональні
//   ensureField("meanings", "mn", []);
//   ensureField("lsj_definition_raw", "lsj", "");
//   ensureField("grammar", "g", "");
//   ensureField("usages", "u", []);
//   ensureField("usages_count", "uc", 0);
//   ensureField("definition", "def", "");
//   ensureField("hebrew_equiv", "he", "");
//   ensureField("lemma", "l", "");

//   return result;
// }

// /**
//  * Перевіряє, чи є дані в скороченому форматі
//  */
// export function isCompressedFormat(data) {
//   if (!data) return false;

//   // Новий формат з метаданими
//   if (data._meta && data.verses) {
//     const verses = data.verses;
//     if (Array.isArray(verses) && verses.length > 0) {
//       const first = verses[0];
//       return (
//         first.w !== undefined || first.s !== undefined || first.v !== undefined
//       );
//     }
//   }

//   // Старий формат
//   if (Array.isArray(data)) {
//     if (data.length === 0) return false;
//     const first = data[0];
//     return (
//       first.w !== undefined || first.s !== undefined || first.v !== undefined
//     );
//   }

//   return data.w !== undefined || data.s !== undefined || data.v !== undefined;
// }

// export default {
//   expandJson,
//   jsonAdapter,
//   getValue,
//   normalizeStrongEntry,
//   isCompressedFormat,
//   getMetadata,
//   keyMappings,
// };

// -----------------------------------------

// // src/utils/jsonAdapter.js - 29.12.25
// /**
//  * Адаптер для автоматичної роботи з повними та скороченими форматами JSON
//  */

// // ==================== ПОЛНІ МАПИ КЛЮЧІВ ====================

// // Проблема: Два однакових ключі 'm' - другий перезапише перший.
// const keyMappings = {
//   shortToFull: {
//     // Основні
//     w: "word",
//     s: "strong",
//     v: "verse",
//     ws: "words",

//     // Додаткові для оригіналів
//     l: "lemma",
//     m: "morph",

//     // Словники Strong
//     t: "translit",
//     tr: "translation",
//     m: "morphology",
//     u: "usages_count",
//     mn: "meanings",
//     lsj: "lsj_definition_raw",
//     def: "definition",
//     he: "hebrew_equiv",
//     uc: "usages_count",
//     l: "lemma",
//     pos: "position",
//     gr: "greek_equiv",
//   },

//   fullToShort: {},
// };

// // Автоматично генеруємо зворотну мапу
// Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
//   keyMappings.fullToShort[full] = short;
// });

// /**
//  * НОВА ФУНКЦІЯ: Отримати реальні дані з нового формату
//  */
// function extractActualData(data) {
//   if (!data) return data;

//   // Новий формат перекладів/оригіналів: має _meta і verses
//   if (data._meta && data.verses !== undefined) {
//     return data.verses;
//   }

//   // Старий формат: або вже масив, або об'єкт
//   return data;
// }

// /**
//  * Розпізнає тип даних
//  */
// function detectDataType(data) {
//   if (!data) return "unknown";

//   // 1. Словник Strong (об'єкт з ключами Gxxx або Hxxx)
//   if (typeof data === "object" && !Array.isArray(data)) {
//     const firstKey = Object.keys(data)[0];
//     if (firstKey && (firstKey.startsWith("G") || firstKey.startsWith("H"))) {
//       const entry = data[firstKey];
//       if (entry && typeof entry === "object") {
//         // Перевіряємо, чи це словник Strong (має s, w, tr тощо)
//         if (
//           entry.s !== undefined ||
//           entry.strong !== undefined ||
//           entry.w !== undefined ||
//           entry.word !== undefined ||
//           entry.tr !== undefined ||
//           entry.translation !== undefined
//         ) {
//           return "strongs";
//         }
//       }
//     }
//   }

//   // 2. Переклад/оригінал з метаданими
//   if (data._meta && data.verses !== undefined) {
//     return "translation_with_meta";
//   }

//   // 3. Масив віршів (старий формат)
//   if (Array.isArray(data)) {
//     if (data.length === 0) return "empty_array";

//     const first = data[0];
//     // Перевіряємо, чи це вірш (має v/verse та words/ws)
//     if (
//       (first.v !== undefined || first.verse !== undefined) &&
//       (first.ws !== undefined || first.words !== undefined)
//     ) {
//       return "verses_array";
//     }
//   }

//   // 4. Інше
//   return "unknown";
// }

// /**
//  * Конвертує об'єкт з скорочених ключів в повні
//  */
// export function expandJson(obj, depth = 0) {
//   if (depth > 10) return obj;
//   if (obj === null || obj === undefined) return obj;
//   if (typeof obj !== "object") return obj;

//   if (Array.isArray(obj)) {
//     return obj.map((item) => expandJson(item, depth + 1));
//   }

//   const result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = keyMappings.shortToFull[key] || key;

//     // Спеціальна обробка для словників Strong
//     if (
//       key === "s" &&
//       typeof value === "string" &&
//       (value.startsWith("G") || value.startsWith("H"))
//     ) {
//       result[newKey] = value;
//       result["strong"] = value;
//     } else {
//       result[newKey] = expandJson(value, depth + 1);
//     }
//   }

//   // Зворотні посилання
//   if (result.word !== undefined && result.w === undefined) {
//     result.w = result.word;
//   }
//   if (result.strong !== undefined && result.s === undefined) {
//     result.s = result.strong;
//   }

//   return result;
// }

// /**
//  * Автоматично визначає формат та конвертує в повний
//  */
// export function jsonAdapter(data) {
//   if (!data) {
//     console.log("⚠️  jsonAdapter: data is null/undefined");
//     return data;
//   }

//   const dataType = detectDataType(data);
//   console.log(`🔄 jsonAdapter: тип даних = ${dataType}`);

//   switch (dataType) {
//     case "strongs":
//       // Словники Strong - просто розширюємо ключі, але зберігаємо структуру
//       console.log("📚 Це словник Strong");
//       // const result = {};
//       // Проблема: Для словників Strong повертається об'єкт, але в PassagePage.js очікується масив віршів. Це може спричинити помилки.
//       const result = [];
//       Object.keys(data).forEach((key) => {
//         result[key] = expandJson(data[key]);
//       });
//       return result;

//     case "translation_with_meta":
//       // Новий формат з метаданими
//       console.log("📦 Новий формат з метаданими");
//       const verses = Array.isArray(data.verses) ? data.verses : [data.verses];
//       const expandedVerses = verses.map((verse) => expandJson(verse));

//       // Повертаємо verses, але зберігаємо метадані
//       expandedVerses._meta = data._meta;
//       return expandedVerses;

//     case "verses_array":
//       // Старий формат масиву віршів
//       console.log("📄 Старий формат масиву віршів");
//       return data.map((verse) => expandJson(verse));

//     case "empty_array":
//       console.log("📭 Порожній масив");
//       return data;

//     case "unknown":
//     default:
//       console.log("❓ Невідомий формат, спробуємо обробити");

//       // Спробуємо визначити, що це
//       if (typeof data === "object") {
//         // Можливо це вже розширений формат
//         const firstKey = Object.keys(data)[0];
//         if (firstKey) {
//           // Перевіримо, чи це словник Strong
//           if (firstKey.startsWith("G") || firstKey.startsWith("H")) {
//             console.log("🤔 Можливо це словник Strong (unknown формат)");
//             return jsonAdapter(data); // Рекурсивно спробуємо ще раз
//           }
//         }

//         // Можливо це вже розширений об'єкт
//         return data;
//       }

//       console.warn("⚠️  Невідомий формат даних у jsonAdapter, повертаємо як є");
//       return data;
//   }
// }

// /**
//  * Отримати метадані з даних (якщо є)
//  */
// export function getMetadata(data) {
//   if (!data) return null;

//   // Якщо дані мають метадані безпосередньо
//   if (data._meta) return data._meta;

//   // Якщо це масив з метаданими
//   if (Array.isArray(data) && data._meta) {
//     return data._meta;
//   }

//   return null;
// }

// /**
//  * Безпечне отримання значення з обох форматів
//  */
// export function getValue(obj, fieldName) {
//   if (!obj) return undefined;

//   // Спочатку повний ключ
//   if (obj[fieldName] !== undefined) {
//     return obj[fieldName];
//   }

//   // Потім скорочений
//   const shortKey = keyMappings.fullToShort[fieldName];
//   if (shortKey && obj[shortKey] !== undefined) {
//     return obj[shortKey];
//   }

//   // Для зворотної сумісності
//   const alternativeNames = {
//     word: ["w", "text", "original"],
//     strong: ["s", "strongs", "code"],
//     translation: ["tr", "trans", "meaning"],
//     translit: ["t", "transliteration"],
//     morph: ["m", "morphology", "form"],
//     lemma: ["l"],
//     verse: ["v"],
//     words: ["ws"],
//     definition: ["def"],
//     meanings: ["mn"],
//     usages: ["u"],
//     grammar: ["g"],
//     hebrew_equiv: ["he"],
//     greek_equiv: ["gr"],
//   };

//   if (alternativeNames[fieldName]) {
//     for (const alt of alternativeNames[fieldName]) {
//       if (obj[alt] !== undefined) {
//         return obj[alt];
//       }
//     }
//   }

//   return undefined;
// }

// /**
//  * Нормалізує запис словника Strong
//  */
// export function normalizeStrongEntry(entry) {
//   if (!entry || typeof entry !== "object") {
//     return entry;
//   }

//   const result = { ...entry };

//   // Забезпечуємо наявність основних полів
//   const ensureField = (fullName, shortName, defaultValue = "") => {
//     if (result[fullName] === undefined && result[shortName] !== undefined) {
//       result[fullName] = result[shortName];
//     } else if (result[fullName] === undefined) {
//       result[fullName] = defaultValue;
//     }

//     if (result[shortName] === undefined && result[fullName] !== undefined) {
//       result[shortName] = result[fullName];
//     }
//   };

//   // Обов'язкові поля
//   ensureField("strong", "s", "");
//   ensureField("word", "w", "");
//   ensureField("translit", "t", "");
//   ensureField("translation", "tr", "");
//   ensureField("morphology", "m", "");

//   // Опціональні
//   ensureField("meanings", "mn", []);
//   ensureField("lsj_definition_raw", "lsj", "");
//   ensureField("grammar", "g", "");
//   ensureField("usages", "u", []);
//   ensureField("usages_count", "uc", 0);
//   ensureField("definition", "def", "");
//   ensureField("hebrew_equiv", "he", "");
//   ensureField("lemma", "l", "");
//   ensureField("greek_equiv", "gr", "");

//   return result;
// }

// /**
//  * Перевіряє, чи є дані в скороченому форматі
//  */
// export function isCompressedFormat(data) {
//   if (!data) return false;

//   const dataType = detectDataType(data);

//   if (dataType === "translation_with_meta") {
//     const verses = data.verses;
//     if (Array.isArray(verses) && verses.length > 0) {
//       const first = verses[0];
//       return (
//         first.w !== undefined || first.s !== undefined || first.v !== undefined
//       );
//     }
//   } else if (dataType === "verses_array") {
//     if (data.length === 0) return false;
//     const first = data[0];
//     return (
//       first.w !== undefined || first.s !== undefined || first.v !== undefined
//     );
//   }

//   return false;
// }

// /**
//  * Отримати сильний код з об'єкта (працює з будь-яким форматом)
//  */
// export function getStrongCode(obj) {
//   if (!obj) return null;

//   // Спробуємо різні варіанти
//   if (obj.strong !== undefined) return obj.strong;
//   if (obj.s !== undefined) return obj.s;

//   // Можливо це сам код
//   if (typeof obj === "string" && (obj.startsWith("G") || obj.startsWith("H"))) {
//     return obj;
//   }

//   return null;
// }

// export default {
//   expandJson,
//   jsonAdapter,
//   getValue,
//   normalizeStrongEntry,
//   isCompressedFormat,
//   getMetadata,
//   getStrongCode,
//   keyMappings,
// };

// закінчення версії 29.12.25

// --------------------------------

// // src/utils/jsonAdapter.js - ПОВНИЙ КОД З ЛОГАМИ ТА КОМЕНТАРЯМИ
// /**
//  * АДАПТЕР ДЛЯ АВТОМАТИЧНОЇ РОБОТИ З ПОВНИМИ ТА СКОРОЧЕНИМИ ФОРМАТАМИ JSON
//  *
//  * Відповідає за:
//  * 1. Конвертацію скорочених ключів в повні
//  * 2. Автоматичне визначення типу даних
//  * 3. Нормалізацію структур для подальшої обробки
//  *
//  * Взаємодіє з:
//  * - PassagePage.js (завантаження глав)
//  * - loadChapter.js (адаптація даних)
//  * - LexiconWindow.js (словники Strong)
//  * - src/utils/normalizeData.js (нормалізація)
//  * - src/utils/formatAdapter.js (робота з форматами)
//  */

// // ==================== КОНСТАНТИ ТА МАПІНГИ ====================

// /**
//  * МАПІНГИ КЛЮЧІВ: короткі → повні
//  * Використовується для конвертації скорочених форматів
//  */
// const keyMappings = {
//   shortToFull: {
//     // Основні поля
//     w: "word",
//     s: "strong",
//     v: "verse",
//     ws: "words",

//     // Додаткові для оригіналів
//     l: "lemma",
//     m: "morphology", // ВИПРАВЛЕНО: замість дублювання 'm'
//     t: "translit",
//     tr: "translation",

//     // Для словників Strong
//     mn: "meanings",
//     lsj: "lsj_definition_raw",
//     def: "definition",
//     he: "hebrew_equiv",
//     uc: "usages_count",
//     gr: "greek_equiv",
//     pos: "position",
//     g: "grammar",
//     u: "usages",
//   },

//   fullToShort: {},
// };

// // Автоматично генеруємо зворотну мапу
// Object.entries(keyMappings.shortToFull).forEach(([short, full]) => {
//   keyMappings.fullToShort[full] = short;
// });

// console.log("🔧 jsonAdapter: ініціалізовано keyMappings", {
//   shortCount: Object.keys(keyMappings.shortToFull).length,
//   fullCount: Object.keys(keyMappings.fullToShort).length,
//   sampleMappings: Object.entries(keyMappings.shortToFull).slice(0, 5),
// });

// // ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

// /**
//  * НОВА ФУНКЦІЯ: Отримати реальні дані з нового формату
//  * Використовується для отримання віршів з об'єкта метаданих
//  */
// function extractActualData(data) {
//   console.log("🔍 jsonAdapter.extractActualData: початок", {
//     hasMeta: !!(data && data._meta),
//     hasVerses: !!(data && data.verses !== undefined),
//   });

//   if (!data) {
//     console.warn("⚠️ jsonAdapter.extractActualData: data is null/undefined");
//     return data;
//   }

//   // Новий формат перекладів/оригіналів: має _meta і verses
//   if (data._meta && data.verses !== undefined) {
//     console.log(
//       "📦 jsonAdapter.extractActualData: виявлено новий формат з метаданими"
//     );
//     return data.verses;
//   }

//   // Старий формат: або вже масив, або об'єкт
//   console.log("📄 jsonAdapter.extractActualData: старий формат або вже масив");
//   return data;
// }

// /**
//  * РОЗПІЗНАЄ ТИП ДАНИХ З ДЕТАЛЬНИМ ЛОГУВАННЯМ
//  * Використовується для автоматичного визначення структури даних
//  */
// function detectDataType(data) {
//   console.log("🔍 jsonAdapter.detectDataType: аналіз даних", {
//     type: typeof data,
//     isArray: Array.isArray(data),
//     dataSample: data ? JSON.stringify(data).substring(0, 200) + "..." : "null",
//     keys: data && typeof data === "object" ? Object.keys(data).slice(0, 5) : [],
//   });

//   if (!data) {
//     console.warn("⚠️ jsonAdapter.detectDataType: data is null/undefined");
//     return "unknown";
//   }

//   // 1. Словник Strong (об'єкт з ключами Gxxx або Hxxx)
//   if (typeof data === "object" && !Array.isArray(data)) {
//     const firstKey = Object.keys(data)[0];

//     if (firstKey && (firstKey.startsWith("G") || firstKey.startsWith("H"))) {
//       const entry = data[firstKey];

//       if (entry && typeof entry === "object") {
//         // Перевіряємо, чи це словник Strong (має s, w, tr тощо)
//         const hasStrongFields =
//           entry.s !== undefined ||
//           entry.strong !== undefined ||
//           entry.w !== undefined ||
//           entry.word !== undefined ||
//           entry.tr !== undefined ||
//           entry.translation !== undefined;

//         if (hasStrongFields) {
//           console.log(
//             "📚 jsonAdapter.detectDataType: визначено як словник Strong",
//             { firstKey }
//           );
//           return "strongs";
//         }
//       }
//     }
//   }

//   // 2. Переклад/оригінал з метаданими
//   if (data._meta && data.verses !== undefined) {
//     console.log(
//       "📊 jsonAdapter.detectDataType: визначено як переклад з метаданими",
//       {
//         meta: data._meta?.info?.translation || "unknown",
//         versesType: typeof data.verses,
//         isVersesArray: Array.isArray(data.verses),
//       }
//     );
//     return "translation_with_meta";
//   }

//   // 3. Масив віршів (старий формат)
//   if (Array.isArray(data)) {
//     if (data.length === 0) {
//       console.log("📭 jsonAdapter.detectDataType: порожній масив");
//       return "empty_array";
//     }

//     const first = data[0];
//     // Перевіряємо, чи це вірш (має v/verse та words/ws)
//     const isVerse =
//       (first.v !== undefined || first.verse !== undefined) &&
//       (first.ws !== undefined || first.words !== undefined);

//     if (isVerse) {
//       console.log("📄 jsonAdapter.detectDataType: визначено як масив віршів", {
//         length: data.length,
//         firstVerse: first.v || first.verse,
//       });
//       return "verses_array";
//     }
//   }

//   // 4. Інше
//   console.log("❓ jsonAdapter.detectDataType: невідомий формат");
//   return "unknown";
// }

// /**
//  * КОНВЕРТУЄ ОБ'ЄКТ З СКОРОЧЕНИХ КЛЮЧІВ В ПОВНІ (рекурсивно)
//  * Використовується для розширення скорочених формату
//  */
// function expandJson(obj, depth = 0, path = "") {
//   console.log("🔄 jsonAdapter.expandJson: розширення об'єкта", {
//     depth,
//     path,
//     type: typeof obj,
//     isArray: Array.isArray(obj),
//     keys: obj && typeof obj === "object" ? Object.keys(obj).slice(0, 3) : [],
//   });

//   if (depth > 10) {
//     console.error("❌ jsonAdapter.expandJson: перевищена глибина рекурсії", {
//       path,
//     });
//     return obj;
//   }

//   if (obj === null || obj === undefined) {
//     console.log("➖ jsonAdapter.expandJson: null/undefined значення");
//     return obj;
//   }

//   if (typeof obj !== "object") {
//     console.log("✏️ jsonAdapter.expandJson: примітивне значення", {
//       value: obj,
//     });
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     console.log("📋 jsonAdapter.expandJson: обробка масиву", {
//       length: obj.length,
//     });
//     return obj.map((item, index) =>
//       expandJson(item, depth + 1, `${path}[${index}]`)
//     );
//   }

//   const result = {};
//   const keys = Object.keys(obj);

//   console.log("🔑 jsonAdapter.expandJson: обробка ключів", {
//     keyCount: keys.length,
//     sampleKeys: keys.slice(0, 3),
//   });

//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = keyMappings.shortToFull[key] || key;
//     const newPath = path ? `${path}.${newKey}` : newKey;

//     console.log("   → обробка ключа", {
//       original: key,
//       mapped: newKey,
//       valueType: typeof value,
//       isObject: typeof value === "object" && value !== null,
//     });

//     // Спеціальна обробка для словників Strong
//     if (
//       key === "s" &&
//       typeof value === "string" &&
//       (value.startsWith("G") || value.startsWith("H"))
//     ) {
//       console.log("   🔤 Special: Strong code detected", { value });
//       result[newKey] = value;
//       result["strong"] = value; // Додаємо повний ключ теж
//     } else {
//       result[newKey] = expandJson(value, depth + 1, newPath);
//     }
//   }

//   // Зворотні посилання для зворотної сумісності
//   if (result.word !== undefined && result.w === undefined) {
//     result.w = result.word;
//   }
//   if (result.strong !== undefined && result.s === undefined) {
//     result.s = result.strong;
//   }

//   console.log("✅ jsonAdapter.expandJson: завершено", {
//     originalKeys: keys.length,
//     resultKeys: Object.keys(result).length,
//     path,
//   });

//   return result;
// }

// // ==================== ЕКСПОРТОВАНІ ФУНКЦІЇ ====================

// /**
//  * АВТОМАТИЧНО ВИЗНАЧАЄ ФОРМАТ ТА КОНВЕРТУЄ В ПОВНИЙ
//  * Головна функція адаптера - використовується скрізь для обробки даних
//  */
// export function jsonAdapter(data) {
//   const startTime = performance.now();
//   console.log("🔄 jsonAdapter: початок адаптації даних");

//   if (!data) {
//     console.warn("⚠️ jsonAdapter: data is null/undefined");
//     return data;
//   }

//   const dataType = detectDataType(data);
//   console.log(`📊 jsonAdapter: тип даних = ${dataType}`);

//   let result;

//   switch (dataType) {
//     case "strongs":
//       console.log("📚 jsonAdapter: обробка словника Strong");
//       result = {};
//       Object.keys(data).forEach((key, index) => {
//         console.log(
//           `   📖 Strong запис ${index + 1}/${Object.keys(data).length}: ${key}`
//         );
//         result[key] = expandJson(data[key]);
//       });
//       break;

//     case "translation_with_meta":
//       console.log("📦 jsonAdapter: новий формат з метаданими", {
//         translation: data._meta?.info?.translation || "unknown",
//         book: data._meta?.info?.book || "unknown",
//         language: data._meta?.info?.language || "unknown",
//       });

//       const verses = Array.isArray(data.verses) ? data.verses : [data.verses];
//       console.log(`   📄 Кількість віршів: ${verses.length}`);

//       const expandedVerses = verses.map((verse, index) => {
//         console.log(
//           `   ✨ Обробка вірша ${index + 1}/${verses.length}: v${
//             verse.v || verse.verse || index
//           }`
//         );
//         return expandJson(verse);
//       });

//       // Повертаємо verses, але зберігаємо метадані
//       if (Array.isArray(expandedVerses)) {
//         expandedVerses._meta = data._meta;
//         expandedVerses._originalStructure = "translation_with_meta";
//       }

//       result = expandedVerses;
//       break;

//     case "verses_array":
//       console.log("📄 jsonAdapter: старий формат масиву віршів", {
//         versesCount: data.length,
//         sampleVerse: data[0]?.v || data[0]?.verse || "unknown",
//       });

//       result = data.map((verse, index) => {
//         console.log(`   ✨ Обробка вірша ${index + 1}/${data.length}`);
//         return expandJson(verse);
//       });
//       break;

//     case "empty_array":
//       console.log("📭 jsonAdapter: порожній масив");
//       result = data;
//       break;

//     case "unknown":
//     default:
//       console.log("❓ jsonAdapter: невідомий формат, спробуємо обробити");

//       // Спробуємо визначити, що це
//       if (typeof data === "object") {
//         // Можливо це вже розширений формат
//         const firstKey = Object.keys(data)[0];

//         if (firstKey) {
//           // Перевіримо, чи це словник Strong
//           if (firstKey.startsWith("G") || firstKey.startsWith("H")) {
//             console.log(
//               "🤔 jsonAdapter: можливо це словник Strong (unknown формат)"
//             );
//             return jsonAdapter(data); // Рекурсивно спробуємо ще раз
//           }
//         }

//         // Можливо це вже розширений об'єкт
//         console.log("🔄 jsonAdapter: повертаємо як є (можливо вже розширений)");
//         result = data;
//       } else {
//         console.warn("⚠️ jsonAdapter: невідомий формат даних, повертаємо як є");
//         result = data;
//       }
//   }

//   const duration = performance.now() - startTime;
//   console.log("✅ jsonAdapter: адаптація завершена", {
//     duration: `${duration.toFixed(2)}мс`,
//     resultType: typeof result,
//     isArray: Array.isArray(result),
//     length: Array.isArray(result) ? result.length : "N/A",
//     hasMeta: !!(result && result._meta),
//   });

//   return result;
// }

// /**
//  * ОТРИМАТИ МЕТАДАНІ З ДАНИХ (якщо є)
//  * Використовується для отримання додаткової інформації про дані
//  */
// export function getMetadata(data) {
//   console.log("🔍 jsonAdapter.getMetadata: пошук метаданих");

//   if (!data) {
//     console.warn("⚠️ jsonAdapter.getMetadata: data is null/undefined");
//     return null;
//   }

//   // Якщо дані мають метадані безпосередньо
//   if (data._meta) {
//     console.log("📦 jsonAdapter.getMetadata: знайдено метадані безпосередньо");
//     return data._meta;
//   }

//   // Якщо це масив з метаданими
//   if (Array.isArray(data) && data._meta) {
//     console.log("📦 jsonAdapter.getMetadata: знайдено метадані в масиві");
//     return data._meta;
//   }

//   console.log("➖ jsonAdapter.getMetadata: метадані не знайдено");
//   return null;
// }

// /**
//  * БЕЗПЕЧНЕ ОТРИМАННЯ ЗНАЧЕННЯ З ОБОХ ФОРМАТІВ
//  * Використовується для роботи як з повними, так і з короткими ключами
//  */
// export function getValue(obj, fieldName) {
//   console.log("🔍 jsonAdapter.getValue: пошук значення", {
//     fieldName,
//     objType: typeof obj,
//     objKeys: obj ? Object.keys(obj).slice(0, 5) : [],
//   });

//   if (!obj) {
//     console.warn("⚠️ jsonAdapter.getValue: obj is null/undefined");
//     return undefined;
//   }

//   // Спочатку повний ключ
//   if (obj[fieldName] !== undefined) {
//     console.log("✅ jsonAdapter.getValue: знайдено за повним ключем", {
//       fieldName,
//     });
//     return obj[fieldName];
//   }

//   // Потім скорочений
//   const shortKey = keyMappings.fullToShort[fieldName];
//   if (shortKey && obj[shortKey] !== undefined) {
//     console.log("✅ jsonAdapter.getValue: знайдено за скороченим ключем", {
//       fieldName,
//       shortKey,
//       value: obj[shortKey],
//     });
//     return obj[shortKey];
//   }

//   // Для зворотної сумісності
//   console.log("🔎 jsonAdapter.getValue: пошук альтернативних назв", {
//     fieldName,
//   });

//   const alternativeNames = {
//     word: ["w", "text", "original"],
//     strong: ["s", "strongs", "code"],
//     translation: ["tr", "trans", "meaning"],
//     translit: ["t", "transliteration"],
//     morph: ["m", "morphology", "form"],
//     morphology: ["m", "morph", "form"],
//     lemma: ["l"],
//     verse: ["v"],
//     words: ["ws"],
//     definition: ["def"],
//     meanings: ["mn"],
//     usages: ["u"],
//     grammar: ["g"],
//     hebrew_equiv: ["he"],
//     greek_equiv: ["gr"],
//   };

//   if (alternativeNames[fieldName]) {
//     for (const alt of alternativeNames[fieldName]) {
//       if (obj[alt] !== undefined) {
//         console.log(
//           "✅ jsonAdapter.getValue: знайдено за альтернативним ключем",
//           {
//             fieldName,
//             altKey: alt,
//             value: obj[alt],
//           }
//         );
//         return obj[alt];
//       }
//     }
//   }

//   console.log("❌ jsonAdapter.getValue: значення не знайдено", { fieldName });
//   return undefined;
// }

// /**
//  * НОРМАЛІЗУЄ ЗАПИС СЛОВНИКА STRONG
//  * Використовується для створення уніфікованої структури
//  */
// export function normalizeStrongEntry(entry) {
//   console.log(
//     "🔄 jsonAdapter.normalizeStrongEntry: нормалізація запису Strong",
//     {
//       entryType: typeof entry,
//       entryKeys: entry ? Object.keys(entry).slice(0, 5) : [],
//     }
//   );

//   if (!entry || typeof entry !== "object") {
//     console.warn("⚠️ jsonAdapter.normalizeStrongEntry: некоректний запис");
//     return entry;
//   }

//   const result = { ...entry };

//   /**
//    * ДОПОМІЖНА ФУНКЦІЯ: Забезпечити наявність поля
//    */
//   const ensureField = (fullName, shortName, defaultValue = "") => {
//     // console.log(`   🔧 ensureField: ${fullName}/${shortName}`);

//     if (result[fullName] === undefined && result[shortName] !== undefined) {
//       result[fullName] = result[shortName];
//     } else if (result[fullName] === undefined) {
//       result[fullName] = defaultValue;
//     }

//     if (result[shortName] === undefined && result[fullName] !== undefined) {
//       result[shortName] = result[fullName];
//     }
//   };

//   // Обов'язкові поля
//   console.log(
//     "   📝 jsonAdapter.normalizeStrongEntry: обробка обов'язкових полів"
//   );
//   ensureField("strong", "s", "");
//   ensureField("word", "w", "");
//   ensureField("translit", "t", "");
//   ensureField("translation", "tr", "");
//   ensureField("morphology", "m", "");

//   // Опціональні поля
//   console.log(
//     "   📝 jsonAdapter.normalizeStrongEntry: обробка опціональних полів"
//   );
//   ensureField("meanings", "mn", []);
//   ensureField("lsj_definition_raw", "lsj", "");
//   ensureField("grammar", "g", "");
//   ensureField("usages", "u", []);
//   ensureField("usages_count", "uc", 0);
//   ensureField("definition", "def", "");
//   ensureField("hebrew_equiv", "he", "");
//   ensureField("lemma", "l", "");
//   ensureField("greek_equiv", "gr", "");

//   console.log("✅ jsonAdapter.normalizeStrongEntry: нормалізація завершена", {
//     fieldsCount: Object.keys(result).length,
//     hasStrong: !!result.strong,
//     hasWord: !!result.word,
//   });

//   return result;
// }

// /**
//  * ПЕРЕВІРЯЄ, ЧИ Є ДАНІ В СКОРОЧЕНОМУ ФОРМАТІ
//  * Використовується для визначення формату даних
//  */
// export function isCompressedFormat(data) {
//   console.log("🔍 jsonAdapter.isCompressedFormat: перевірка формату");

//   if (!data) {
//     console.warn("⚠️ jsonAdapter.isCompressedFormat: data is null/undefined");
//     return false;
//   }

//   const dataType = detectDataType(data);

//   if (dataType === "translation_with_meta") {
//     const verses = data.verses;
//     if (Array.isArray(verses) && verses.length > 0) {
//       const first = verses[0];
//       const isCompressed =
//         first.w !== undefined || first.s !== undefined || first.v !== undefined;

//       console.log("📊 jsonAdapter.isCompressedFormat: перевірка verses", {
//         isCompressed,
//         hasW: first.w !== undefined,
//         hasS: first.s !== undefined,
//         hasV: first.v !== undefined,
//       });

//       return isCompressed;
//     }
//   } else if (dataType === "verses_array") {
//     if (data.length === 0) {
//       console.log("📭 jsonAdapter.isCompressedFormat: порожній масив");
//       return false;
//     }

//     const first = data[0];
//     const isCompressed =
//       first.w !== undefined || first.s !== undefined || first.v !== undefined;

//     console.log("📊 jsonAdapter.isCompressedFormat: перевірка масиву", {
//       isCompressed,
//       hasW: first.w !== undefined,
//       hasS: first.s !== undefined,
//       hasV: first.v !== undefined,
//     });

//     return isCompressed;
//   }

//   console.log(
//     "➖ jsonAdapter.isCompressedFormat: не визначено як скорочений формат"
//   );
//   return false;
// }

// /**
//  * ОТРИМАТИ СИЛЬНИЙ КОД З ОБ'ЄКТА (працює з будь-яким форматом)
//  * Використовується для отримання коду Strong з різних структур
//  */
// export function getStrongCode(obj) {
//   console.log("🔍 jsonAdapter.getStrongCode: пошук коду Strong", {
//     objType: typeof obj,
//     isObject: obj && typeof obj === "object",
//     sampleKeys: obj ? Object.keys(obj).slice(0, 3) : [],
//   });

//   if (!obj) {
//     console.warn("⚠️ jsonAdapter.getStrongCode: obj is null/undefined");
//     return null;
//   }

//   // Спробуємо різні варіанти
//   if (obj.strong !== undefined) {
//     console.log(
//       "✅ jsonAdapter.getStrongCode: знайдено за 'strong'",
//       obj.strong
//     );
//     return obj.strong;
//   }

//   if (obj.s !== undefined) {
//     console.log("✅ jsonAdapter.getStrongCode: знайдено за 's'", obj.s);
//     return obj.s;
//   }

//   // Можливо це сам код
//   if (typeof obj === "string" && (obj.startsWith("G") || obj.startsWith("H"))) {
//     console.log("✅ jsonAdapter.getStrongCode: це вже код", obj);
//     return obj;
//   }

//   console.log("❌ jsonAdapter.getStrongCode: код Strong не знайдено");
//   return null;
// }

// // ==================== ЕКСПОРТ ====================

// console.log("📦 jsonAdapter.js: модуль завантажено та експортовано");

// export default {
//   expandJson,
//   jsonAdapter,
//   getValue,
//   normalizeStrongEntry,
//   isCompressedFormat,
//   getMetadata,
//   getStrongCode,
//   keyMappings,
//   detectDataType,
//   extractActualData,
// };

// /**
//  * ДОДАТКОВІ ЕКСПОРТИ ДЛЯ ТЕСТУВАННЯ
//  * Можуть бути імпортовані для юніт-тестів
//  */
// export const JsonAdapterInternals = {
//   keyMappings,
//   detectDataType,
//   extractActualData,
//   expandJson,
// };

// --------------

// src/utils/jsonAdapter.js - СПРОЩЕНА ВЕРСІЯ З МІНІМАЛЬНИМИ ЛОГАМИ

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
