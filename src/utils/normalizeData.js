// src/utils/normalizeData.js
export const normalizeVerse = (verse) => {
  if (!verse) return verse;
  // вже нормалізовано — просто повертаємо
  if (verse.w || (verse.words && verse.words[0]?.t !== undefined)) {
    return verse;
  }

  return {
    v: verse.v ?? verse.verse,
    w: (verse.words ?? verse.w ?? []).map((word) => ({
      t: word.t ?? word.word ?? word.text ?? "",
      s: word.s ?? word.strong ?? word.strongs ?? null,
      // якщо будуть інші поля (наприклад lemma, morph) — додаємо тут
    })),
  };
};

export const normalizeChapter = (chapterArray) => {
  if (!Array.isArray(chapterArray)) return [];
  return chapterArray.map(normalizeVerse);
};

export const normalizeStrongEntry = (raw) => {
  if (!raw) return null;
  const key = Object.keys(raw)[0];
  const e = raw[key];

  return {
    s: e.s ?? e.strong ?? key,
    w: e.w ?? e.word ?? e.lemma ?? "",
    l: e.l ?? e.translit ?? "",
    r: e.r ?? e.translation ?? e.tr ?? "",
    p: e.p ?? e.morphology ?? e.m ?? "",
    u: e.u ?? e.usages_count ?? e.usages ?? 0,
    m: Array.isArray(e.m) ? e.m : Array.isArray(e.meanings) ? e.meanings : [],
    j: e.j ?? e.lsj_definition_raw ?? e.lsj ?? "",
    g: e.g ?? e.grammar ?? "",
  };
};

export const normalizeCore = (core) => {
  if (!core) return {};
  const result = {};

  Object.keys(core).forEach((ver) => {
    const data = core[ver];
    result[ver.toLowerCase()] = {
      O: (data.O ?? data.OldT ?? []).map((group) => ({
        g: group.g ?? group.group ?? "",
        b: (group.b ?? group.books ?? []).map((book) => ({
          c: book.c ?? book.code ?? "",
          n: book.n ?? book.name ?? "",
          h: book.h ?? book.chapters ?? 1,
        })),
      })),
      N: (data.N ?? data.NewT ?? []).map((group) => ({
        g: group.g ?? group.group ?? "",
        b: (group.b ?? group.books ?? []).map((book) => ({
          c: book.c ?? book.code ?? "",
          n: book.n ?? book.name ?? "",
          h: book.h ?? book.chapters ?? 1,
        })),
      })),
    };
  });
  return result;
};
