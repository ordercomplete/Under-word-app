// src/config/dataConfig.js
export const DATA_CONFIG = {
  // Автоматично визначаємо, чи використовувати скорочений формат
  useCompressed: () => {
    // У розробці - завжди використовуємо скорочений
    if (process.env.NODE_ENV === "development") return true;

    // У продакшені - перевіряємо, чи існує папка data_compressed
    // Можна зробити асинхронну перевірку
    return true; // За замовчуванням - так
  },

  // Шляхи
  paths: {
    compressed: "/data_compressed",
    original: "/data",
  },

  // Налаштування кешування
  cache: {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 години
  },
};
