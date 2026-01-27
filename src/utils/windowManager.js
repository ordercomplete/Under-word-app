/**
 * Менеджер для управління станом вікон словників
 */

/**
 * Визначає тип вікна на основі версії
 */
export const determineWindowType = (origVer) => {
  if (!origVer) return "translation";

  const originalVersions = ["LXX", "THOT", "TR", "GNT"];
  return originalVersions.includes(origVer.toUpperCase())
    ? "strong"
    : "dictionary";
};

/**
 * Створює запис для історії
 */
export const createHistoryEntry = (data, origVer) => {
  const word = data?.word;
  if (!word || (!word.strong && !word.dict)) {
    return null;
  }

  const isOriginal = determineWindowType(origVer) === "strong";
  const entryId = `${origVer || "unknown"}:${word.strong || word.dict || Date.now()}`;

  return {
    id: entryId,
    data: data,
    origVer: origVer,
    word: {
      word: word.word || "",
      strong: word.strong || "",
      lemma: word.lemma || "",
      morph: word.morph || "",
      dict: word.dict || "",
    },
    lang: word.strong?.startsWith("H") ? "he" : "gr",
    isOriginal: isOriginal,
    timestamp: Date.now(),
    code: word.strong || word.dict,
    isEmpty: false,
    isError: false,
  };
};

/**
 * Обробляє клік на слово
 */
export const handleWordClick = (
  data,
  origVer,
  setStrongWindow,
  setDictionaryWindow,
) => {
  if (!data?.word) {
    console.warn("Недостатньо даних для словника");
    return;
  }

  const entry = createHistoryEntry(data, origVer);
  if (!entry) {
    console.warn("Не вдалося створити запис для історії");
    return;
  }

  const windowType = determineWindowType(origVer);

  if (windowType === "strong") {
    // Оновлюємо вікно Strong
    setStrongWindow((prev) => {
      const historyManager = globalHistoryManager.getWindowManager("strong");
      const historyState = historyManager.addEntry(entry);

      return {
        ...historyState,
        windowId: "strong",
        isActive: true,
        historyManager: historyManager,
        current: entry,
      };
    });
  } else {
    // Оновлюємо вікно Dictionary
    setDictionaryWindow((prev) => {
      const historyManager =
        globalHistoryManager.getWindowManager("dictionary");
      const historyState = historyManager.addEntry(entry);

      return {
        ...historyState,
        windowId: "dictionary",
        isActive: true,
        historyManager: historyManager,
        current: entry,
      };
    });
  }
};

export default {
  determineWindowType,
  createHistoryEntry,
  handleWordClick,
};
