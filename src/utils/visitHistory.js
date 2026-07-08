// src/utils/visitHistory.js
const HISTORY_KEY = "underword_visit_history";
const MAX_HISTORY = 50;

/**
 * Зберігає нове відвідування. Якщо ref збігається з останнім записом в історії,
 * оновлює його versions та timestamp (не створює новий запис).
 * Якщо ref інший — додає новий запис.
 */
export const saveVisit = (ref, versions) => {
  if (!ref || !versions?.length) return;

  const history = getHistory();
  const currentTimestamp = Date.now();

  // Перевіряємо, чи останній запис має той самий ref
  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  if (lastEntry && lastEntry.ref === ref) {
    // Оновлюємо versions та timestamp останнього запису
    lastEntry.versions = [...versions];
    lastEntry.timestamp = currentTimestamp;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return;
  }

  // Шукаємо запис з таким самим ref в історії (крім останнього)
  const duplicateIndex = history.findIndex(
    (entry, idx) => idx < history.length - 1 && entry.ref === ref,
  );

  if (duplicateIndex !== -1) {
    // Видаляємо старий запис
    history.splice(duplicateIndex, 1);
  }

  // Додаємо новий запис в кінець
  const newEntry = {
    ref,
    versions: [...versions],
    timestamp: currentTimestamp,
  };
  history.push(newEntry);

  // Обмежуємо розмір
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

/**
 * Повертає останнє відвідування або null
 */
export const getLastVisit = () => {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1] : null;
};

/**
 * Повертає всю історію (від найстарішої до найновішої)
 */
export const getHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Очищає всю історію
 */
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

/**
 * Перевіряє, чи підтримує набір версій дане місце (ref)
 */
export const isSupportedByVersions = (ref, versions, coreData) => {
  if (!ref || !versions?.length || !coreData) return false;

  const [book] = ref.split(".");
  const testament = book.match(
    /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
  )
    ? "NewT"
    : "OldT";

  return versions.some((ver) => {
    const verKey = ver.toLowerCase();
    if (!coreData[verKey]?.[testament]) return false;

    const books = coreData[verKey][testament].flatMap((g) => g.books || []);
    return books.some((b) => b.code === book);
  });
};

/**
 * Порівнює два масиви на рівність (порядок елементів має значення)
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
