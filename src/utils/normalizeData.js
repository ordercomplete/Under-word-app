// // src/utils/normalizeData.js
// export const normalizeVerse = (verse) => {
//   if (!verse) return verse;
//   // вже нормалізовано — просто повертаємо
//   if (verse.w || (verse.words && verse.words[0]?.t !== undefined)) {
//     return verse;
//   }

//   return {
//     v: verse.v ?? verse.verse,
//     w: (verse.words ?? verse.w ?? []).map((word) => ({
//       t: word.t ?? word.word ?? word.text ?? "",
//       s: word.s ?? word.strong ?? word.strongs ?? null,
//       // якщо будуть інші поля (наприклад lemma, morph) — додаємо тут
//     })),
//   };
// };

// export const normalizeChapter = (chapterArray) => {
//   if (!Array.isArray(chapterArray)) return [];
//   return chapterArray.map(normalizeVerse);
// };

// export const normalizeStrongEntry = (raw) => {
//   if (!raw) return null;
//   const key = Object.keys(raw)[0];
//   const e = raw[key];

//   return {
//     s: e.s ?? e.strong ?? key,
//     w: e.w ?? e.word ?? e.lemma ?? "",
//     l: e.l ?? e.translit ?? "",
//     r: e.r ?? e.translation ?? e.tr ?? "",
//     p: e.p ?? e.morphology ?? e.m ?? "",
//     u: e.u ?? e.usages_count ?? e.usages ?? 0,
//     m: Array.isArray(e.m) ? e.m : Array.isArray(e.meanings) ? e.meanings : [],
//     j: e.j ?? e.lsj_definition_raw ?? e.lsj ?? "",
//     g: e.g ?? e.grammar ?? "",
//   };
// };

// export const normalizeCore = (core) => {
//   if (!core) return {};
//   const result = {};

//   Object.keys(core).forEach((ver) => {
//     const data = core[ver];
//     result[ver.toLowerCase()] = {
//       O: (data.O ?? data.OldT ?? []).map((group) => ({
//         g: group.g ?? group.group ?? "",
//         b: (group.b ?? group.books ?? []).map((book) => ({
//           c: book.c ?? book.code ?? "",
//           n: book.n ?? book.name ?? "",
//           h: book.h ?? book.chapters ?? 1,
//         })),
//       })),
//       N: (data.N ?? data.NewT ?? []).map((group) => ({
//         g: group.g ?? group.group ?? "",
//         b: (group.b ?? group.books ?? []).map((book) => ({
//           c: book.c ?? book.code ?? "",
//           n: book.n ?? book.name ?? "",
//           h: book.h ?? book.chapters ?? 1,
//         })),
//       })),
//     };
//   });
//   return result;
// };

// ---------------------------------------------------

// src/utils/normalizeData.js 23.12.25
import { getValue } from "./jsonAdapter";

/**
 * Нормалізує вірш для уніфікованого формату
 */
export const normalizeVerse = (verse) => {
  if (!verse) return verse;

  // Перевіряємо, чи вже нормалізований формат
  const isAlreadyNormalized =
    verse.ws !== undefined ||
    (verse.words &&
      Array.isArray(verse.words) &&
      (verse.words[0]?.w !== undefined || verse.words[0]?.word !== undefined));

  if (isAlreadyNormalized) {
    return verse;
  }

  // Конвертуємо старий формат в новий
  return {
    v: getValue(verse, "verse") || getValue(verse, "v") || 1,
    ws: (getValue(verse, "words") || getValue(verse, "ws") || []).map(
      (word) => ({
        w: getValue(word, "word") || getValue(word, "w") || "",
        s: getValue(word, "strong") || getValue(word, "s") || null,
        l: getValue(word, "lemma") || getValue(word, "l") || null,
        m: getValue(word, "morph") || getValue(word, "m") || null,
      })
    ),
  };
};

/**
 * Нормалізує главу (масив віршів)
 */
export const normalizeChapter = (chapterData) => {
  if (!chapterData) return [];

  // Якщо це об'єкт з метаданими
  if (chapterData._meta && chapterData.verses !== undefined) {
    return normalizeChapter(chapterData.verses);
  }

  // Якщо це масив
  if (Array.isArray(chapterData)) {
    return chapterData.map(normalizeVerse);
  }

  // Якщо це об'єкт (можливо словник)
  if (typeof chapterData === "object") {
    const values = Object.values(chapterData);
    if (Array.isArray(values[0])) {
      return values[0].map(normalizeVerse);
    }
  }

  return [];
};

/**
 * Нормалізує запис словника Strong
 */
export const normalizeStrongEntry = (raw) => {
  if (!raw) return null;

  // Якщо це об'єкт з метаданими
  if (raw._meta && raw.verses) {
    // Це не словник, а глава
    return null;
  }

  // Знаходимо перший ключ (для словників Strong)
  const key = Object.keys(raw)[0];
  const entry = raw[key] || raw;

  return {
    s: getValue(entry, "strong") || getValue(entry, "s") || key,
    w: getValue(entry, "word") || getValue(entry, "w") || "",
    t: getValue(entry, "translit") || getValue(entry, "t") || "",
    tr: getValue(entry, "translation") || getValue(entry, "tr") || "",
    m: getValue(entry, "morphology") || getValue(entry, "m") || "",
    l: getValue(entry, "lemma") || getValue(entry, "l") || "",
    mn: Array.isArray(getValue(entry, "meanings"))
      ? getValue(entry, "meanings")
      : Array.isArray(getValue(entry, "mn"))
      ? getValue(entry, "mn")
      : [],
    lsj: getValue(entry, "lsj_definition_raw") || getValue(entry, "lsj") || "",
    g: getValue(entry, "grammar") || getValue(entry, "g") || "",
    u: getValue(entry, "usages_count") || getValue(entry, "u") || 0,
  };
};

/**
 * Нормалізує core.json дані
 */
export const normalizeCore = (core) => {
  if (!core) return {};
  const result = {};

  Object.keys(core).forEach((ver) => {
    const data = core[ver];
    const verLower = ver.toLowerCase();

    result[verLower] = {
      ot: (getValue(data, "OldT") || getValue(data, "ot") || []).map(
        (group) => ({
          g: getValue(group, "group") || getValue(group, "g") || "",
          b: (getValue(group, "books") || getValue(group, "b") || []).map(
            (book) => ({
              c: getValue(book, "code") || getValue(book, "c") || "",
              n: getValue(book, "name") || getValue(book, "n") || "",
              ch: getValue(book, "chapters") || getValue(book, "ch") || 1,
            })
          ),
        })
      ),
      nt: (getValue(data, "NewT") || getValue(data, "nt") || []).map(
        (group) => ({
          g: getValue(group, "group") || getValue(group, "g") || "",
          b: (getValue(group, "books") || getValue(group, "b") || []).map(
            (book) => ({
              c: getValue(book, "code") || getValue(book, "c") || "",
              n: getValue(book, "name") || getValue(book, "n") || "",
              ch: getValue(book, "chapters") || getValue(book, "ch") || 1,
            })
          ),
        })
      ),
    };
  });

  return result;
};

/**
 * Допоміжна функція для отримання метаданих з даних
 */
export const getChapterMetadata = (chapterData) => {
  if (!chapterData) return null;

  // Якщо дані мають метадані
  if (chapterData._meta) {
    return chapterData._meta;
  }

  // Якщо це масив з метаданими
  if (Array.isArray(chapterData) && chapterData._meta) {
    return chapterData._meta;
  }

  return null;
};
