// src/utils/visitHistory.js
const HISTORY_KEY = "underword_visit_history";
const MAX_HISTORY = 50;

export const saveVisit = (ref, versions) => {
  if (!ref || !versions?.length) return;

  const history = getHistory();
  const newEntry = {
    ref,
    versions: [...versions],
    timestamp: Date.now(),
  };

  // Додаємо новий запис
  history.push(newEntry);

  // Обмежуємо розмір
  if (history.length > MAX_HISTORY) {
    history.shift();
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getLastVisit = () => {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1] : null;
};

export const getHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Перевіряє, чи підтримує набір версій дане місце (ref)
export const isSupportedByVersions = (ref, versions, coreData) => {
  if (!ref || !versions?.length) return false;

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

// ================================ 29.01.2026
