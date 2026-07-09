// src/utils/visitHistory.js
const HISTORY_KEY = "underword_visit_history";
const WINDOW_STATE_KEY = "underword_window_state_history";
const BOOKMARKS_KEY = "underword_bookmarks";
const MAX_HISTORY = 50;

// Debounce для збереження історії
let saveTimeout = null;

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
 * Зберігає стан вікон окремо з урахуванням нумерації
 * Кожна панель зберігається окремо з унікальним id
 * Використовується для відновлення стану при оновленні сторінки
 */
export const saveWindowStates = (panels) => {
  if (!panels || !panels.length) return;

  const history = getWindowStateHistory();
  const currentTimestamp = Date.now();

  // Для кожної панелі додаємо окремий запис з нумерацією
  panels.forEach((panel, index) => {
    if (!panel.ref || !panel.versions?.length) return;

    // Використовуємо panelIndex як унікальний ідентифікатор
    const uniqueRef = `panel_${index}_${panel.ref}_${panel.versions.join(",")}`;

    const newEntry = {
      ref: panel.ref,
      versions: [...panel.versions],
      timestamp: currentTimestamp,
      panelIndex: index, // Зберігаємо нумерацію для відновлення стану вікон
      panelId: panel.id,
      uniqueRef: uniqueRef,
    };

    // Перевіряємо, чи вже є запис з таким uniqueRef
    const existingIndex = history.findIndex((e) => e.uniqueRef === uniqueRef);
    if (existingIndex !== -1) {
      history[existingIndex] = newEntry;
    } else {
      history.push(newEntry);
    }
  });

  // Обмежуємо розмір
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  localStorage.setItem(WINDOW_STATE_KEY, JSON.stringify(history));
};

/**
 * Зберігає закладки (тільки місце + версії) БЕЗ прив'язки до нумерації вікон
 * Групує за ref+versions, уникає дублікатів
 */
export const saveBookmarks = (panels) => {
  if (!panels || !panels.length) return;

  const bookmarks = getBookmarks();
  const currentTimestamp = Date.now();

  panels.forEach((panel) => {
    if (!panel.ref || !panel.versions?.length) return;

    // Ключ без panelIndex - тільки ref + versions
    const key = `${panel.ref}_${panel.versions.join(",")}`;

    // Перевіряємо, чи вже є запис з таким key
    const existingIndex = bookmarks.findIndex((b) => b.key === key);

    if (existingIndex !== -1) {
      // Оновлюємо timestamp існуючого запису
      bookmarks[existingIndex].timestamp = currentTimestamp;
    } else {
      // Додаємо новий запис
      bookmarks.push({
        ref: panel.ref,
        versions: [...panel.versions],
        timestamp: currentTimestamp,
        key: key,
      });
    }
  });

  // Обмежуємо розмір
  if (bookmarks.length > MAX_HISTORY) {
    bookmarks.splice(0, bookmarks.length - MAX_HISTORY);
  }

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
};

/**
 * Зберігає масив панелей як окремі записи в історію (стара функція, залишаємо для сумісності)
 * Кожна панель зберігається окремо з унікальним id
 */
export const saveAllVisits = (panels) => {
  // Викликаємо обидві функції
  saveWindowStates(panels);
  saveBookmarks(panels);
};

/**
 * Негайно зберігає масив панелей в історію (без debounce)
 */
export const saveAllVisitsImmediate = (panels) => {
  if (!panels || !panels.length) return;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  saveWindowStates(panels);
  saveBookmarks(panels);
};

/**
 * Повертає останнє відвідування або null
 */
export const getLastVisit = () => {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1] : null;
};

/**
 * Повертає всю історію вікон (від найстарішої до найновішої)
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
 * Повертає історію стану вікон
 */
export const getWindowStateHistory = () => {
  try {
    const stored = localStorage.getItem(WINDOW_STATE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Повертає закладки (тільки місця без прив'язки до панелей)
 */
export const getBookmarks = () => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
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
  localStorage.removeItem(WINDOW_STATE_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
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
