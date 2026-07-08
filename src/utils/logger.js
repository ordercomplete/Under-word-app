// utils/logger.js -
const isDevelopment =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";

// Функція для перевірки, чи відкрита консоль
const isConsoleOpen = () => {
  // Спосіб 1: Перевірка розміру window.innerHeight
  const threshold = 100;
  const outerHeight = window.outerHeight;
  const innerHeight = window.innerHeight;
  const heightDifference = outerHeight - innerHeight;

  // Якщо різниця висоти > порога, консоль відкрита
  return heightDifference > threshold;
};

// Оптимізований logger
export const logger = {
  // Ці методи працюють лише якщо консоль ЗАКРИТА
  log: (...args) => {
    if (isDevelopment && !isConsoleOpen()) {
      console.log(...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment && !isConsoleOpen()) {
      console.debug("[DEBUG]", ...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment && !isConsoleOpen()) {
      console.warn(...args);
    }
  },

  // Помилки завжди показуємо
  error: (...args) => console.error(...args),

  // Вимірювання продуктивності
  measure: (label, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (isDevelopment && !isConsoleOpen() && end - start > 16) {
      console.warn(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    }
    return result;
  },

  // Пакетне логування
  batch: (label, ...items) => {
    if (isDevelopment && !isConsoleOpen()) {
      console.groupCollapsed(`📦 ${label} (${items.length} items)`);
      items.forEach((item, i) => console.log(`[${i}]`, item));
      console.groupEnd();
    }
  },
};

export default logger;
