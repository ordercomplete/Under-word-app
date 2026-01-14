// // src/utils/logger.js
// const isDevelopment = process.env.NODE_ENV === "development";

// export const logger = {
//   log: (...args) => isDevelopment && console.log(...args),
//   warn: (...args) => isDevelopment && console.warn(...args),
//   error: (...args) => console.error(...args),
//   info: (...args) => isDevelopment && console.info(...args),
//   debug: (...args) => isDevelopment && console.debug("[DEBUG]", ...args),
//   time: (label) => isDevelopment && console.time(label),
//   timeEnd: (label) => isDevelopment && console.timeEnd(label),

//   // Додаткові утіліти
//   measure: (label, fn) => {
//     if (isDevelopment) {
//       console.time(label);
//       const result = fn();
//       console.timeEnd(label);
//       return result;
//     }
//     return fn();
//   },

//   // Для профілювання рендерингу
//   renderStart: (componentName) => {
//     if (isDevelopment && window.performance) {
//       window.performance.mark(`${componentName}_start`);
//     }
//   },

//   renderEnd: (componentName) => {
//     if (isDevelopment && window.performance) {
//       window.performance.mark(`${componentName}_end`);
//       window.performance.measure(
//         `${componentName}_render`,
//         `${componentName}_start`,
//         `${componentName}_end`
//       );
//     }
//   },
// };

// export default logger;

// ========================

// utils/logger.js - ПОЛІПШЕНА ВЕРСІЯ
const isDevelopment = process.env.NODE_ENV === "development";

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
