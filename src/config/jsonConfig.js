// src/config/jsonConfig.js
/**
 * Конфігурація для роботи з JSON форматами
 */

export const JSON_CONFIG = {
  // Використовувати скорочений формат?
  useCompressedFormat: true,

  // Шлях до даних (можна змінювати динамічно)
  dataPath:
    window.location.hostname === "localhost" ? "/data_compressed" : "/data",

  // Формати, які підтримуються
  supportedFormats: ["short", "full", "auto"],

  // Налаштування для словників
  strongs: {
    requiredFields: ["strong", "word", "translation"],
    optionalFields: ["translit", "morphology", "meanings", "grammar"],
  },
};

/**
 * Отримати шлях до файлу з урахуванням конфігурації
 */
export function getDataPath(relativePath) {
  const basePath = JSON_CONFIG.useCompressedFormat
    ? "/data_compressed"
    : "/data";
  return `${basePath}/${relativePath}`;
}

/**
 * Перемикач між форматами (для розробки)
 */
export function toggleFormat() {
  JSON_CONFIG.useCompressedFormat = !JSON_CONFIG.useCompressedFormat;
  console.log(
    `Switched to ${
      JSON_CONFIG.useCompressedFormat ? "compressed" : "full"
    } format`
  );

  // Зберігаємо в localStorage
  localStorage.setItem(
    "jsonFormat",
    JSON_CONFIG.useCompressedFormat ? "compressed" : "full"
  );

  // Перезавантажуємо сторінку
  window.location.reload();
  return JSON_CONFIG.useCompressedFormat;
}

// Відновлюємо формат з localStorage
if (typeof window !== "undefined") {
  const savedFormat = localStorage.getItem("jsonFormat");
  if (savedFormat) {
    JSON_CONFIG.useCompressedFormat = savedFormat === "compressed";
  }
}

export default JSON_CONFIG;
