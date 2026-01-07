// // src/utils/logger.js
// /**
//  * УТІЛІТА ДЛЯ ЛОГУВАННЯ
//  *
//  * Надає структуроване логування з рівнями важливості,
//  * часом виконання та контекстом
//  */

// const LOG_LEVELS = {
//   DEBUG: 0,
//   INFO: 1,
//   WARN: 2,
//   ERROR: 3,
//   NONE: 4,
// };

// let currentLogLevel = LOG_LEVELS.DEBUG;

// /**
//  * ВСТАНОВИТИ РІВЕНЬ ЛОГУВАННЯ
//  */
// export const setLogLevel = (level) => {
//   const validLevels = Object.keys(LOG_LEVELS);
//   if (validLevels.includes(level)) {
//     currentLogLevel = LOG_LEVELS[level];
//     console.log(`📊 Logger: встановлено рівень логування ${level}`);
//   }
// };

// /**
//  * ЛОГ З ЧАСОМ ВИКОНАННЯ
//  */
// export const logWithTime = (message, data = {}, level = "INFO") => {
//   if (LOG_LEVELS[level] < currentLogLevel) return;

//   const timestamp = new Date().toISOString();
//   const perfMark = `log_${Date.now()}_${Math.random()
//     .toString(36)
//     .substr(2, 9)}`;

//   performance.mark(perfMark);

//   const logData = {
//     timestamp,
//     level,
//     message,
//     ...data,
//     _perfMark: perfMark,
//   };

//   switch (level) {
//     case "DEBUG":
//       console.debug(`🐛 ${message}`, logData);
//       break;
//     case "INFO":
//       console.info(`ℹ️ ${message}`, logData);
//       break;
//     case "WARN":
//       console.warn(`⚠️ ${message}`, logData);
//       break;
//     case "ERROR":
//       console.error(`❌ ${message}`, logData);
//       break;
//     default:
//       console.log(message, logData);
//   }

//   return () => {
//     performance.measure(`${perfMark}_duration`, perfMark);
//     const measure = performance.getEntriesByName(`${perfMark}_duration`)[0];
//     console.log(`⏱️ ${message} - виконано за ${measure.duration.toFixed(2)}мс`);
//     performance.clearMarks(perfMark);
//     performance.clearMeasures(`${perfMark}_duration`);
//   };
// };

// /**
//  * ЛОГ ПОЧАТКУ/КІНЦЯ ФУНКЦІЇ
//  */
// export const logFunction = (fnName, context = {}) => {
//   const startTime = performance.now();
//   const endLog = logWithTime(`🔄 ${fnName}: початок`, context, "DEBUG");

//   return (result, additionalData = {}) => {
//     const duration = performance.now() - startTime;
//     logWithTime(
//       `✅ ${fnName}: завершено`,
//       {
//         ...context,
//         ...additionalData,
//         duration: `${duration.toFixed(2)}мс`,
//         resultType: typeof result,
//         isArray: Array.isArray(result),
//         length: Array.isArray(result) ? result.length : "N/A",
//       },
//       "DEBUG"
//     );

//     if (endLog) endLog();

//     return result;
//   };
// };

// /**
//  * ЛОГ ПОМИЛКИ
//  */
// export const logError = (error, context = {}) => {
//   logWithTime(
//     "Помилка виконання",
//     {
//       error: error.message,
//       stack: error.stack,
//       ...context,
//     },
//     "ERROR"
//   );

//   return error;
// };

// /**
//  * ЛОГ ЖИТТЄВОГО ЦИКЛУ КОМПОНЕНТА
//  */
// export const logComponentLifecycle = (componentName) => {
//   const startTime = performance.now();

//   logWithTime(
//     `🎬 ${componentName}: монтування`,
//     {
//       timestamp: new Date().toISOString(),
//     },
//     "INFO"
//   );

//   return () => {
//     const duration = performance.now() - startTime;
//     logWithTime(
//       `🛑 ${componentName}: розмонтування`,
//       {
//         duration: `${duration.toFixed(2)}мс`,
//         timestamp: new Date().toISOString(),
//       },
//       "INFO"
//     );
//   };
// };

// export default {
//   setLogLevel,
//   logWithTime,
//   logFunction,
//   logError,
//   logComponentLifecycle,
//   LOG_LEVELS,
// };

// console.log("📦 logger.js: модуль логування завантажено");

// --------------------

// // src/utils/logger.js
// /**
//  * ЛОГЕР З РІВНЯМИ ВАЖЛИВОСТІ
//  *
//  * Контролює кількість виводу в консоль залежно від налаштувань
//  * В продакшені автоматично вимикає детальні логи
//  */

// const LOG_LEVELS = {
//   NONE: 0, // Нічого не логуємо
//   ERROR: 1, // Тільки помилки
//   WARN: 2, // Попередження та помилки
//   INFO: 3, // Основна інформація
//   DEBUG: 4, // Всі логи (для розробки)
// };

// // Рівень за замовчуванням
// let currentLevel =
//   process.env.NODE_ENV === "production"
//     ? LOG_LEVELS.WARN // В продакшені тільки помилки та попередження
//     : LOG_LEVELS.INFO; // В розробці основна інформація

// /**
//  * ВСТАНОВИТИ РІВЕНЬ ЛОГУВАННЯ
//  */
// export const setLogLevel = (level) => {
//   if (LOG_LEVELS[level] !== undefined) {
//     currentLevel = LOG_LEVELS[level];
//     console.log(`📊 Логер: встановлено рівень "${level}"`);
//   } else {
//     console.warn(
//       `⚠️ Невідомий рівень логування: "${level}", використовую "INFO"`
//     );
//     currentLevel = LOG_LEVELS.INFO;
//   }
// };

// /**
//  * ПЕРЕВІРИТИ ЧИ ПОТРІБНО ЛОГУВАТИ
//  */
// const shouldLog = (level) => {
//   return currentLevel >= level;
// };

// /**
//  * ОСНОВНИЙ ОБ'ЄКТ ЛОГЕРА
//  */
// export const log = {
//   /**
//    * ПОМИЛКИ (критичні проблеми)
//    */
//   error: (message, data = {}) => {
//     if (shouldLog(LOG_LEVELS.ERROR)) {
//       console.error(`❌ ${message}`, data);
//     }
//   },

//   /**
//    * ПОПЕРЕДЖЕННЯ (потенційні проблеми)
//    */
//   warn: (message, data = {}) => {
//     if (shouldLog(LOG_LEVELS.WARN)) {
//       console.warn(`⚠️ ${message}`, data);
//     }
//   },

//   /**
//    * ІНФОРМАЦІЯ (основні події)
//    */
//   info: (message, data = {}) => {
//     if (shouldLog(LOG_LEVELS.INFO)) {
//       console.info(`ℹ️ ${message}`, data);
//     }
//   },

//   /**
//    * ДЕБАГ (детальна інформація для розробки)
//    */
//   debug: (message, data = {}) => {
//     if (shouldLog(LOG_LEVELS.DEBUG)) {
//       console.log(`🔍 ${message}`, data);
//     }
//   },

//   /**
//    * ПРОДУКТИВНІСТЬ (час виконання)
//    */
//   perf: (name, startTime) => {
//     if (shouldLog(LOG_LEVELS.DEBUG)) {
//       const duration = performance.now() - startTime;
//       console.log(`⏱️ ${name}: ${duration.toFixed(2)}мс`);
//     }
//   },

//   /**
//    * КОМПОНЕНТИ (життєвий цикл)
//    */
//   component: (name, action, data = {}) => {
//     if (shouldLog(LOG_LEVELS.INFO)) {
//       const icons = {
//         mount: "🎬",
//         update: "🔄",
//         unmount: "🛑",
//         render: "🎨",
//       };
//       console.log(`${icons[action] || "📦"} ${name}: ${action}`, data);
//     }
//   },
// };

// // Експорт рівнів для використання
// export { LOG_LEVELS };

// // Автоматично встановлюємо рівень при імпорті
// console.log(`📦 logger.js: модуль завантажено (рівень: ${currentLevel})`);

// export default log;

// ----------------

// src/utils/logger.js - СПРОЩЕНА ВЕРСІЯ (або взагалі видалити)
export const log = {
  error: (msg, data) => console.error(`❌ ${msg}`, data),
  warn: (msg, data) => console.warn(`⚠️ ${msg}`, data),
  info: (msg, data) => console.info(`ℹ️ ${msg}`, data),
  // debug: () => {} // ВИМКНЕНО в продакшені
};
