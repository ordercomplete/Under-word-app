// src/utils/testUtils.js
/**
 * Утиліти для тестування JSON формату
 */

/**
 * Перевіряє, чи файл існує
 */
export const checkFileExists = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return {
      exists: response.ok,
      status: response.status,
      url,
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
      url,
    };
  }
};

/**
 * Перевіряє формат JSON файлу
 */
export const checkJsonFormat = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
        url,
      };
    }

    const text = await response.text();
    const data = JSON.parse(text);

    // Аналізуємо формат
    let format = "unknown";
    let sampleKeys = [];

    if (Array.isArray(data)) {
      if (data.length > 0) {
        const firstItem = data[0];
        sampleKeys = Object.keys(firstItem);

        if (firstItem.w !== undefined || firstItem.s !== undefined) {
          format = "short";
        } else if (
          firstItem.word !== undefined ||
          firstItem.strong !== undefined
        ) {
          format = "full";
        }
      }
    } else if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      if (firstKey && data[firstKey]) {
        const firstItem = data[firstKey];
        sampleKeys = Object.keys(firstItem);

        if (firstItem.w !== undefined || firstItem.s !== undefined) {
          format = "short";
        } else if (
          firstItem.word !== undefined ||
          firstItem.strong !== undefined
        ) {
          format = "full";
        }
      }
    }

    return {
      success: true,
      format,
      sampleKeys,
      size: text.length,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url,
    };
  }
};

/**
 * Порівнює розміри файлів у різних форматах
 */
export const compareFileSizes = async (filePath) => {
  const paths = [`/data/${filePath}`, `/data_compressed/${filePath}`];

  const results = [];

  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        results.push({
          path,
          exists: true,
          size: text.length,
          format: path.includes("_compressed") ? "short" : "full",
        });
      } else {
        results.push({
          path,
          exists: false,
          error: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      results.push({
        path,
        exists: false,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Генерує звіт про формат
 */
export const generateFormatReport = async () => {
  const testFiles = [
    "strongs/G746.json",
    "strongs/H9002.json",
    "translations/utt/OldT/GEN/gen1_utt.json",
    "translations/ubt/OldT/GEN/gen1_ubt.json",
    "core.json",
  ];

  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    baseUrl: window.location.origin,
    files: [],
  };

  for (const file of testFiles) {
    const compressedResult = await checkJsonFormat(`/data_compressed/${file}`);
    const fullResult = await checkJsonFormat(`/data/${file}`);

    report.files.push({
      file,
      compressed: compressedResult,
      full: fullResult,
    });
  }

  return report;
};

/**
 * Зберігає звіт у localStorage
 */
export const saveReportToStorage = (report) => {
  try {
    const reports = JSON.parse(localStorage.getItem("formatReports") || "[]");
    reports.unshift({
      ...report,
      id: Date.now(),
    });

    // Зберігаємо тільки останні 10 звітів
    if (reports.length > 10) {
      reports.pop();
    }

    localStorage.setItem("formatReports", JSON.stringify(reports));
    return true;
  } catch (error) {
    console.error("Помилка збереження звіту:", error);
    return false;
  }
};

export default {
  checkFileExists,
  checkJsonFormat,
  compareFileSizes,
  generateFormatReport,
  saveReportToStorage,
};
