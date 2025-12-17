#!/usr/bin/env node
// scripts/convertTranslations.js
// const fs = require("fs");
// const path = require("path");

// // Конфігурація
// const CONFIG = {
//   sourceDir: "public/data",
//   compressedDir: "public/data_compressed",

//   // Папки для перевірки
//   directoriesToCheck: [
//     "translations/utt",
//     "translations/ubt",
//     "translations/ogienko",
//     "translations/khomenko",
//     "translations/siryy",
//     "translations/synodal",
//     "translations/kjv",
//     "originals/lxx",
//     "originals/thot",
//     "originals/gnt",
//     "strongs",
//   ],

//   // Мінімальна очікувана економія (%)
//   minExpectedSavings: 20,

//   // Обов'язкові файли
//   requiredFiles: ["core.json", "translations.json"],
// };

// /**
//  * Рекурсивно отримує список всіх файлів у директорії
//  */
// function getAllFiles(dir, fileList = []) {
//   if (!fs.existsSync(dir)) {
//     return fileList;
//   }

//   const files = fs.readdirSync(dir);

//   files.forEach((file) => {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);

//     if (stat.isDirectory()) {
//       getAllFiles(filePath, fileList);
//     } else if (file.endsWith(".json")) {
//       fileList.push({
//         path: filePath,
//         relativePath: path.relative(CONFIG.sourceDir, filePath),
//         size: stat.size,
//       });
//     }
//   });

//   return fileList;
// }

// /**
//  * Порівнює дві директорії
//  */

// // (оновлена функція compareDirectories)
// function compareDirectories() {
//   console.log("🔍 ПОРІВНЯЛЬНИЙ АНАЛІЗ ПАПОК\n");

//   // Отримуємо ВСІ файли з обох папок
//   const allSourceFiles = getAllFiles(CONFIG.sourceDir);
//   const allCompressedFiles = getAllFiles(CONFIG.compressedDir);

//   console.log(`📊 ЗАГАЛЬНА СТАТИСТИКА:`);
//   console.log(`   Вихідна папка: ${allSourceFiles.length} файлів`);
//   console.log(`   Стиснута папка: ${allCompressedFiles.length} файлів`);

//   // Групуємо по типах
//   const sourceByType = groupFilesByType(allSourceFiles, CONFIG.sourceDir);
//   const compressedByType = groupFilesByType(
//     allCompressedFiles,
//     CONFIG.compressedDir
//   );

//   console.log("\n📂 РОЗПОДІЛ ПО ТИПАХ:");
//   console.log("Тип           | Вихідних | Стиснутих | Різниця | Статус");
//   console.log("--------------|----------|-----------|---------|-------");

//   Object.keys(sourceByType).forEach((type) => {
//     const sourceCount = sourceByType[type].count;
//     const compressedCount = compressedByType[type]?.count || 0;
//     const diff = sourceCount - compressedCount;

//     let status = "✅";
//     if (diff > 0) status = "❌ ВТРАЧЕНО";
//     if (diff < 0) status = "⚠️  ДОДАНО";
//     if (Math.abs(diff) > 0) status = "⚠️  РІЗНИЦЯ";

//     console.log(
//       `${type.padEnd(13)}| ${sourceCount
//         .toString()
//         .padEnd(9)}| ${compressedCount.toString().padEnd(10)}| ${diff
//         .toString()
//         .padEnd(7)}| ${status}`
//     );
//   });

//   // Перевіряємо конкретні файли
//   console.log("\n🔍 ДЕТАЛЬНА ПЕРЕВІРКА:");

//   const stats = {
//     missingInCompressed: [],
//     missingInSource: [],
//     sizeComparison: [],
//   };

//   // Перевіряємо кожен файл з вихідної папки
//   allSourceFiles.forEach((sourceFile) => {
//     const relativePath = sourceFile.relativePath;
//     const compressedFile = allCompressedFiles.find(
//       (f) => f.relativePath === relativePath
//     );

//     if (!compressedFile) {
//       stats.missingInCompressed.push(relativePath);
//     } else {
//       const savings = (
//         ((sourceFile.size - compressedFile.size) / sourceFile.size) *
//         100
//       ).toFixed(1);
//       stats.sizeComparison.push({
//         file: relativePath,
//         sourceSize: sourceFile.size,
//         compressedSize: compressedFile.size,
//         savings: parseFloat(savings),
//       });
//     }
//   });

//   // Перевіряємо файли, які є тільки в стиснутій папці
//   allCompressedFiles.forEach((compressedFile) => {
//     const relativePath = compressedFile.relativePath;
//     const sourceFile = allSourceFiles.find(
//       (f) => f.relativePath === relativePath
//     );

//     if (!sourceFile) {
//       stats.missingInSource.push(relativePath);
//     }
//   });

//   // Виводимо результати
//   if (stats.missingInCompressed.length > 0) {
//     console.log(
//       `\n❌ ВІДСУТНІ В СТИСНУТІЙ ПАПЦІ (${stats.missingInCompressed.length}):`
//     );
//     stats.missingInCompressed.slice(0, 10).forEach((file) => {
//       console.log(`   - ${file}`);
//     });
//     if (stats.missingInCompressed.length > 10) {
//       console.log(
//         `   ... і ще ${stats.missingInCompressed.length - 10} файлів`
//       );
//     }
//   }

//   if (stats.missingInSource.length > 0) {
//     console.log(
//       `\n⚠️  НОВІ ФАЙЛИ В СТИСНУТІЙ ПАПЦІ (${stats.missingInSource.length}):`
//     );
//     stats.missingInSource.slice(0, 5).forEach((file) => {
//       console.log(`   + ${file}`);
//     });
//   }

//   // Статистика економії
//   if (stats.sizeComparison.length > 0) {
//     const totalSourceSize = stats.sizeComparison.reduce(
//       (sum, item) => sum + item.sourceSize,
//       0
//     );
//     const totalCompressedSize = stats.sizeComparison.reduce(
//       (sum, item) => sum + item.compressedSize,
//       0
//     );
//     const totalSavings = (
//       ((totalSourceSize - totalCompressedSize) / totalSourceSize) *
//       100
//     ).toFixed(1);

//     const avgSavings = (
//       stats.sizeComparison.reduce((sum, item) => sum + item.savings, 0) /
//       stats.sizeComparison.length
//     ).toFixed(1);

//     console.log(`\n📈 ЕКОНОМІЯ РОЗМІРУ:`);
//     console.log(
//       `   Загальна: ${(totalSourceSize / 1024 / 1024).toFixed(2)}MB → ${(
//         totalCompressedSize /
//         1024 /
//         1024
//       ).toFixed(2)}MB (${totalSavings}%)`
//     );
//     console.log(`   Середня на файл: ${avgSavings}%`);

//     // Найкраща та найгірша економія
//     const best = [...stats.sizeComparison].sort(
//       (a, b) => b.savings - a.savings
//     )[0];
//     const worst = [...stats.sizeComparison].sort(
//       (a, b) => a.savings - b.savings
//     )[0];

//     console.log(`   Найкраща: ${best.file} (${best.savings}%)`);
//     console.log(`   Найгірша: ${worst.file} (${worst.savings}%)`);
//   }

//   return {
//     totalFiles: {
//       source: allSourceFiles.length,
//       compressed: allCompressedFiles.length,
//     },
//     missingCount: stats.missingInCompressed.length,
//     newFilesCount: stats.missingInSource.length,
//     stats,
//   };
// }

// /**
//  * Групує файли по типах
//  */
// function groupFilesByType(files, baseDir) {
//   const groups = {};

//   files.forEach((file) => {
//     const relative = file.relativePath;

//     let type = "other";
//     if (relative.includes("translations/")) type = "translations";
//     else if (relative.includes("originals/")) type = "originals";
//     else if (relative.includes("strongs/")) type = "strongs";
//     else if (relative.includes("core.json")) type = "core";
//     else if (relative.includes("translations.json")) type = "metadata";

//     if (!groups[type]) {
//       groups[type] = { count: 0, size: 0, files: [] };
//     }

//     groups[type].count++;
//     groups[type].size += file.size;
//     groups[type].files.push(relative);
//   });

//   return groups;
// }
// /**
//  * Перевіряє структуру файлів
//  */
// function checkFileStructures(sourceFiles, compressedFiles, dir, stats) {
//   // Групуємо файли за іменами
//   const sourceMap = new Map();
//   const compressedMap = new Map();

//   sourceFiles.forEach((file) => {
//     const name = path.basename(file.relativePath);
//     sourceMap.set(name, file);
//   });

//   compressedFiles.forEach((file) => {
//     const name = path.basename(file.relativePath);
//     compressedMap.set(name, file);
//   });

//   // Порівнюємо кожен файл
//   sourceMap.forEach((sourceFile, fileName) => {
//     const compressedFile = compressedMap.get(fileName);

//     if (!compressedFile) {
//       stats.errors.push(
//         `❌ ${dir}/${fileName}: відсутній у конвертованій версії`
//       );
//       return;
//     }

//     try {
//       // Перевіряємо JSON структуру
//       const sourceContent = fs.readFileSync(sourceFile.path, "utf8");
//       const compressedContent = fs.readFileSync(compressedFile.path, "utf8");

//       const sourceJson = JSON.parse(sourceContent);
//       const compressedJson = JSON.parse(compressedContent);

//       // Перевіряємо, чи це словник Strong або переклад
//       const isStrong = fileName.startsWith("G") || fileName.startsWith("H");
//       const isTranslation =
//         dir.includes("translations") || dir.includes("originals");

//       if (isStrong) {
//         // Для словників перевіряємо наявність обов'язкових полів
//         const entryKey = Object.keys(compressedJson)[0];
//         const entry = compressedJson[entryKey];

//         if (!entry) {
//           stats.errors.push(`❌ ${dir}/${fileName}: порожній словник`);
//           return;
//         }

//         const requiredFields = ["s", "w", "tr"];
//         const missingFields = requiredFields.filter((field) => !entry[field]);

//         if (missingFields.length > 0) {
//           stats.errors.push(
//             `❌ ${dir}/${fileName}: відсутні поля: ${missingFields.join(", ")}`
//           );
//         } else {
//           stats.successes.push(
//             `✅ ${dir}/${fileName}: правильна структура словника`
//           );
//         }
//       }

//       if (isTranslation) {
//         // Для перекладів перевіряємо, чи це масив
//         if (!Array.isArray(compressedJson)) {
//           stats.errors.push(`❌ ${dir}/${fileName}: не масив`);
//         } else if (compressedJson.length === 0) {
//           stats.warnings.push(`⚠️  ${dir}/${fileName}: порожній масив`);
//         } else {
//           // Перевіряємо структуру першого вірша
//           const firstVerse = compressedJson[0];
//           const hasShortFormat =
//             firstVerse.v !== undefined && firstVerse.ws !== undefined;
//           const hasFullFormat =
//             firstVerse.verse !== undefined && firstVerse.words !== undefined;

//           if (!hasShortFormat && !hasFullFormat) {
//             stats.errors.push(
//               `❌ ${dir}/${fileName}: невірний формат (немає v/ws або verse/words)`
//             );
//           } else {
//             stats.successes.push(
//               `✅ ${dir}/${fileName}: правильна структура (${
//                 hasShortFormat ? "short" : "full"
//               } format)`
//             );
//           }
//         }
//       }
//     } catch (error) {
//       stats.errors.push(
//         `❌ ${dir}/${fileName}: помилка парсингу JSON - ${error.message}`
//       );
//     }
//   });
// }

// /**
//  * Генерує звіт
//  */
// function generateReport(stats) {
//   console.log("\n" + "=".repeat(60));
//   console.log("📊 ЗАГАЛЬНИЙ ЗВІТ ПРО КОНВЕРТАЦІЮ");
//   console.log("=".repeat(60));

//   console.log(`\n📈 СТАТИСТИКА:`);
//   console.log(
//     `   Всього файлів: ${stats.total.sourceFiles} → ${stats.total.compressedFiles}`
//   );
//   console.log(
//     `   Загальний розмір: ${(stats.total.sourceSize / 1024 / 1024).toFixed(
//       2
//     )}MB → ${(stats.total.compressedSize / 1024 / 1024).toFixed(2)}MB`
//   );
//   console.log(`   Загальна економія: ${stats.total.savings}%`);

//   if (stats.successes.length > 0) {
//     console.log(`\n✅ УСПІХИ (${stats.successes.length}):`);
//     stats.successes
//       .slice(0, 10)
//       .forEach((success) => console.log(`   ${success}`));
//     if (stats.successes.length > 10) {
//       console.log(`   ... і ще ${stats.successes.length - 10} успіхів`);
//     }
//   }

//   if (stats.warnings.length > 0) {
//     console.log(`\n⚠️  ПОПЕРЕДЖЕННЯ (${stats.warnings.length}):`);
//     stats.warnings
//       .slice(0, 10)
//       .forEach((warning) => console.log(`   ${warning}`));
//     if (stats.warnings.length > 10) {
//       console.log(`   ... і ще ${stats.warnings.length - 10} попереджень`);
//     }
//   }

//   if (stats.errors.length > 0) {
//     console.log(`\n❌ ПОМИЛКИ (${stats.errors.length}):`);
//     stats.errors.slice(0, 10).forEach((error) => console.log(`   ${error}`));
//     if (stats.errors.length > 10) {
//       console.log(`   ... і ще ${stats.errors.length - 10} помилок`);
//     }
//   }

//   console.log("\n" + "=".repeat(60));

//   // Підсумковий вердикт
//   if (stats.errors.length === 0) {
//     console.log("🎉 ВСІ ПЕРЕВІРКИ ПРОЙДЕНО УСПІШНО!");
//     console.log("✅ Конвертація виконана коректно.");

//     if (parseFloat(stats.total.savings) >= CONFIG.minExpectedSavings) {
//       console.log(
//         `✅ Економія ${stats.total.savings}% відповідає очікуванням (мінімум ${CONFIG.minExpectedSavings}%)`
//       );
//     } else {
//       console.log(
//         `⚠️  Економія ${stats.total.savings}% менша за очікувану (мінімум ${CONFIG.minExpectedSavings}%)`
//       );
//     }

//     return true;
//   } else {
//     console.log(`❌ ЗНАЙДЕНО ${stats.errors.length} ПОМИЛОК!`);
//     console.log("⚠️  Конвертація потребує виправлень.");
//     return false;
//   }
// }

// /**
//  * Додаткова перевірка: порівняння файлів за типами
//  */
// function checkFileTypes() {
//   console.log("\n🔬 АНАЛІЗ ТИПІВ ФАЙЛІВ:");

//   const typeStats = {
//     translations: { source: 0, compressed: 0 },
//     originals: { source: 0, compressed: 0 },
//     strongs: { source: 0, compressed: 0 },
//     other: { source: 0, compressed: 0 },
//   };

//   function countFilesByType(dir, typeMap) {
//     const files = getAllFiles(dir);

//     files.forEach((file) => {
//       if (file.relativePath.includes("translations/")) {
//         typeMap.translations.source++;
//       } else if (file.relativePath.includes("originals/")) {
//         typeMap.originals.source++;
//       } else if (file.relativePath.includes("strongs/")) {
//         typeMap.strongs.source++;
//       } else {
//         typeMap.other.source++;
//       }
//     });
//   }

//   // Рахуємо для обох директорій
//   const sourceTypes = JSON.parse(JSON.stringify(typeStats));
//   const compressedTypes = JSON.parse(JSON.stringify(typeStats));

//   countFilesByType(CONFIG.sourceDir, sourceTypes);
//   countFilesByType(CONFIG.compressedDir, compressedTypes);

//   // Виводимо результати
//   console.log("Тип файлів | Вихідних | Конвертованих | Різниця");
//   console.log("-----------|----------|---------------|---------");

//   Object.keys(typeStats).forEach((type) => {
//     const source = sourceTypes[type].source;
//     const compressed = compressedTypes[type].source;
//     const diff = source - compressed;

//     const status = diff === 0 ? "✅" : diff > 0 ? "❌" : "⚠️";
//     console.log(
//       `${type.padEnd(11)}| ${source.toString().padEnd(9)}| ${compressed
//         .toString()
//         .padEnd(14)}| ${diff} ${status}`
//     );
//   });
// }

// // Головна функція
// async function main() {
//   try {
//     console.log("🔍 ЗАПУСК РЕАЛЬНОЇ ПЕРЕВІРКИ КОНВЕРТАЦІЇ\n");

//     // Перевіряємо існування директорій
//     if (!fs.existsSync(CONFIG.sourceDir)) {
//       console.error(`❌ Вихідна директорія не існує: ${CONFIG.sourceDir}`);
//       process.exit(1);
//     }

//     if (!fs.existsSync(CONFIG.compressedDir)) {
//       console.error(
//         `❌ Конвертована директорія не існує: ${CONFIG.compressedDir}`
//       );
//       process.exit(1);
//     }

//     // Порівнюємо директорії
//     const stats = compareDirectories();

//     // Аналіз типів файлів
//     checkFileTypes();

//     // Генеруємо звіт
//     const success = generateReport(stats);

//     // Зберігаємо звіт у файл
//     saveReportToFile(stats);

//     // Завершуємо з відповідним кодом
//     process.exit(success ? 0 : 1);
//   } catch (error) {
//     console.error("❌ КРИТИЧНА ПОМИЛКА:", error);
//     process.exit(1);
//   }
// }

// /**
//  * Зберігає звіт у файл
//  */
// function saveReportToFile(stats) {
//   const report = {
//     timestamp: new Date().toISOString(),
//     config: CONFIG,
//     stats: stats,
//     summary: {
//       totalFiles: stats.total.compressedFiles,
//       totalSize: stats.total.compressedSize,
//       totalSavings: stats.total.savings,
//       errorCount: stats.errors.length,
//       warningCount: stats.warnings.length,
//       successCount: stats.successes.length,
//     },
//   };

//   const reportDir = path.join(CONFIG.compressedDir, "..", "reports");
//   fs.mkdirSync(reportDir, { recursive: true });

//   const reportPath = path.join(
//     reportDir,
//     `conversion_report_${Date.now()}.json`
//   );
//   fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

//   console.log(`\n📄 Звіт збережено: ${reportPath}`);
// }

// // Запускаємо перевірку
// main();

// ---------------------------------------------

// #!/usr/bin/env node
// scripts/verifyConversion.js
const fs = require("fs");
const path = require("path");

const CONFIG = {
  sourceDir: "public/data",
  compressedDir: "public/data_compressed",
};

/**
 * Рекурсивно отримує список всіх файлів у директорії
 */
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith(".json")) {
      fileList.push({
        path: filePath,
        relativePath: path.relative(CONFIG.sourceDir, filePath),
        size: stat.size,
      });
    }
  });

  return fileList;
}

/**
 * Групує файли по типах
 */
function groupFilesByType(files, baseDir) {
  const groups = {};

  files.forEach((file) => {
    const relative = file.relativePath;

    let type = "other";
    if (relative.includes("translations/")) type = "translations";
    else if (relative.includes("originals/")) type = "originals";
    else if (relative.includes("strongs/")) type = "strongs";
    else if (relative.includes("core.json")) type = "core";
    else if (relative.includes("translations.json")) type = "metadata";
    else if (
      relative.includes("books.json") ||
      relative.includes("chapters.json")
    )
      type = "metadata";

    if (!groups[type]) {
      groups[type] = { count: 0, size: 0, files: [] };
    }

    groups[type].count++;
    groups[type].size += file.size;
    groups[type].files.push(relative);
  });

  return groups;
}

/**
 * Порівнює дві директорії
 */
function compareDirectories() {
  console.log("🔍 ПОРІВНЯЛЬНИЙ АНАЛІЗ ПАПОК\n");

  // Отримуємо ВСІ файли з обох папок
  const allSourceFiles = getAllFiles(CONFIG.sourceDir);
  const allCompressedFiles = getAllFiles(CONFIG.compressedDir);

  console.log(`📊 ЗАГАЛЬНА СТАТИСТИКА:`);
  console.log(`   Вихідна папка: ${allSourceFiles.length} файлів`);
  console.log(`   Стиснута папка: ${allCompressedFiles.length} файлів`);

  // Групуємо по типах
  const sourceByType = groupFilesByType(allSourceFiles, CONFIG.sourceDir);
  const compressedByType = groupFilesByType(
    allCompressedFiles,
    CONFIG.compressedDir
  );

  console.log("\n📂 РОЗПОДІЛ ПО ТИПАХ:");
  console.log("Тип           | Вихідних | Стиснутих | Різниця | Статус");
  console.log("--------------|----------|-----------|---------|-------");

  Object.keys(sourceByType).forEach((type) => {
    const sourceCount = sourceByType[type].count;
    const compressedCount = compressedByType[type]?.count || 0;
    const diff = sourceCount - compressedCount;

    let status = "✅";
    if (diff > 0) status = "❌ ВТРАЧЕНО";
    if (diff < 0) status = "⚠️  ДОДАНО";
    if (Math.abs(diff) > 0) status = "⚠️  РІЗНИЦЯ";

    console.log(
      `${type.padEnd(13)}| ${sourceCount
        .toString()
        .padEnd(9)}| ${compressedCount.toString().padEnd(10)}| ${diff
        .toString()
        .padEnd(7)}| ${status}`
    );
  });

  // Перевіряємо конкретні файли
  console.log("\n🔍 ДЕТАЛЬНА ПЕРЕВІРКА:");

  const stats = {
    total: {
      sourceFiles: allSourceFiles.length,
      compressedFiles: allCompressedFiles.length,
      sourceSize: allSourceFiles.reduce((sum, file) => sum + file.size, 0),
      compressedSize: allCompressedFiles.reduce(
        (sum, file) => sum + file.size,
        0
      ),
    },
    missingInCompressed: [],
    missingInSource: [],
    sizeComparison: [],
    errors: [],
    warnings: [],
    successes: [],
  };

  // Розраховуємо загальну економію
  if (stats.total.sourceSize > 0) {
    stats.total.savings = (
      ((stats.total.sourceSize - stats.total.compressedSize) /
        stats.total.sourceSize) *
      100
    ).toFixed(1);
  } else {
    stats.total.savings = "0.0";
  }

  // Перевіряємо кожен файл з вихідної папки
  allSourceFiles.forEach((sourceFile) => {
    const relativePath = sourceFile.relativePath;
    const compressedFile = allCompressedFiles.find(
      (f) => f.relativePath === relativePath
    );

    if (!compressedFile) {
      stats.missingInCompressed.push(relativePath);
    } else {
      const savings =
        sourceFile.size > 0
          ? (
              ((sourceFile.size - compressedFile.size) / sourceFile.size) *
              100
            ).toFixed(1)
          : "0.0";
      stats.sizeComparison.push({
        file: relativePath,
        sourceSize: sourceFile.size,
        compressedSize: compressedFile.size,
        savings: parseFloat(savings),
      });
    }
  });

  // Перевіряємо файли, які є тільки в стиснутій папці
  allCompressedFiles.forEach((compressedFile) => {
    const relativePath = compressedFile.relativePath;
    const sourceFile = allSourceFiles.find(
      (f) => f.relativePath === relativePath
    );

    if (!sourceFile) {
      stats.missingInSource.push(relativePath);
    }
  });

  // Перевіряємо структуру ключових файлів
  const keyFiles = [
    "originals/lxx/OldT/GEN/gen1_lxx.json",
    "originals/thot/OldT/GEN/gen1_thot.json",
    "translations/utt/OldT/GEN/gen1_utt.json",
    "strongs/G746.json",
    "core.json",
  ];

  console.log("\n🔬 ПЕРЕВІРКА СТРУКТУРИ КЛЮЧОВИХ ФАЙЛІВ:");

  keyFiles.forEach((testFile) => {
    const filePath = path.join(CONFIG.compressedDir, testFile);

    try {
      if (!fs.existsSync(filePath)) {
        stats.errors.push(`❌ ${testFile}: Файл не знайдено в стиснутій папці`);
        return;
      }

      const content = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(content);

      // Загальна перевірка
      if (!data) {
        stats.errors.push(`❌ ${testFile}: Порожні дані`);
        return;
      }

      // Перевірка метаданих
      if (
        testFile.includes("originals/") ||
        testFile.includes("translations/")
      ) {
        const verses = data.verses || data;

        if (!Array.isArray(verses)) {
          stats.errors.push(`❌ ${testFile}: Не масив віршів`);
        } else if (verses.length > 0) {
          const firstVerse = verses[0];
          if (!firstVerse.v) {
            stats.errors.push(`❌ ${testFile}: Відсутній номер вірша (v)`);
          }

          // Для originals перевіряємо додаткові поля
          if (testFile.includes("lxx") && firstVerse.ws && firstVerse.ws[0]) {
            const firstWord = firstVerse.ws[0];
            if (!firstWord.l || !firstWord.m) {
              stats.warnings.push(
                `⚠️  ${testFile}: Можливо відсутні lemma або morph`
              );
            }
          }

          stats.successes.push(`✅ ${testFile}: OK (${verses.length} віршів)`);
        }
      } else if (testFile.includes("strongs/")) {
        // Перевірка словників
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const entry = data[firstKey];
          if (!entry.s || !entry.w || !entry.tr) {
            stats.warnings.push(`⚠️  ${testFile}: Відсутні обов'язкові поля`);
          } else {
            stats.successes.push(
              `✅ ${testFile}: OK (структура: ${Object.keys(entry).join(", ")})`
            );
          }
        }
      }
    } catch (error) {
      stats.errors.push(`❌ ${testFile}: Помилка: ${error.message}`);
    }
  });

  return stats;
}

/**
 * Аналіз типів файлів
 */
function checkFileTypes(allSourceFiles, allCompressedFiles) {
  console.log("\n🔬 АНАЛІЗ ТИПІВ ФАЙЛІВ:");

  const typeStats = {
    translations: { source: 0, compressed: 0 },
    originals: { source: 0, compressed: 0 },
    strongs: { source: 0, compressed: 0 },
    other: { source: 0, compressed: 0 },
  };

  function countFilesByType(files, typeMap) {
    files.forEach((file) => {
      if (file.relativePath.includes("translations/")) {
        typeMap.translations.source++;
      } else if (file.relativePath.includes("originals/")) {
        typeMap.originals.source++;
      } else if (file.relativePath.includes("strongs/")) {
        typeMap.strongs.source++;
      } else {
        typeMap.other.source++;
      }
    });
  }

  const sourceTypes = JSON.parse(JSON.stringify(typeStats));
  const compressedTypes = JSON.parse(JSON.stringify(typeStats));

  countFilesByType(allSourceFiles, sourceTypes);
  countFilesByType(allCompressedFiles, compressedTypes);

  console.log("Тип файлів | Вихідних | Конвертованих | Різниця");
  console.log("-----------|----------|---------------|---------");

  Object.keys(typeStats).forEach((type) => {
    const source = sourceTypes[type].source;
    const compressed = compressedTypes[type].source;
    const diff = source - compressed;

    const status = diff === 0 ? "✅" : diff > 0 ? "❌" : "⚠️";
    console.log(
      `${type.padEnd(11)}| ${source.toString().padEnd(9)}| ${compressed
        .toString()
        .padEnd(14)}| ${diff} ${status}`
    );
  });
}

/**
 * Генерує звіт
 */
function generateReport(stats) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 ЗАГАЛЬНИЙ ЗВІТ ПРО КОНВЕРТАЦІЮ");
  console.log("=".repeat(60));

  console.log(`\n📈 СТАТИСТИКА:`);
  console.log(
    `   Всього файлів: ${stats.total.sourceFiles} → ${stats.total.compressedFiles}`
  );
  console.log(
    `   Загальний розмір: ${(stats.total.sourceSize / 1024 / 1024).toFixed(
      2
    )}MB → ${(stats.total.compressedSize / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(`   Загальна економія: ${stats.total.savings}%`);

  if (stats.successes.length > 0) {
    console.log(`\n✅ УСПІХИ (${stats.successes.length}):`);
    stats.successes
      .slice(0, 10)
      .forEach((success) => console.log(`   ${success}`));
    if (stats.successes.length > 10) {
      console.log(`   ... і ще ${stats.successes.length - 10} успіхів`);
    }
  }

  if (stats.warnings.length > 0) {
    console.log(`\n⚠️  ПОПЕРЕДЖЕННЯ (${stats.warnings.length}):`);
    stats.warnings
      .slice(0, 10)
      .forEach((warning) => console.log(`   ${warning}`));
    if (stats.warnings.length > 10) {
      console.log(`   ... і ще ${stats.warnings.length - 10} попереджень`);
    }
  }

  if (stats.errors.length > 0) {
    console.log(`\n❌ ПОМИЛКИ (${stats.errors.length}):`);
    stats.errors.slice(0, 10).forEach((error) => console.log(`   ${error}`));
    if (stats.errors.length > 10) {
      console.log(`   ... і ще ${stats.errors.length - 10} помилок`);
    }
  }

  console.log("\n" + "=".repeat(60));

  // Підсумковий вердикт
  if (stats.errors.length === 0) {
    console.log("🎉 ВСІ ПЕРЕВІРКИ ПРОЙДЕНО УСПІШНО!");
    console.log("✅ Конвертація виконана коректно.");
    return true;
  } else {
    console.log(`❌ ЗНАЙДЕНО ${stats.errors.length} ПОМИЛОК!`);
    console.log("⚠️  Конвертація потребує виправлень.");
    return false;
  }
}

/**
 * Зберігає звіт у файл
 */
function saveReportToFile(stats) {
  const report = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    stats: stats,
    summary: {
      totalFiles: stats.total.compressedFiles,
      totalSize: stats.total.compressedSize,
      totalSavings: stats.total.savings,
      errorCount: stats.errors.length,
      warningCount: stats.warnings.length,
      successCount: stats.successes.length,
    },
  };

  const reportDir = path.join(CONFIG.compressedDir, "..", "reports");
  fs.mkdirSync(reportDir, { recursive: true });

  const reportPath = path.join(
    reportDir,
    `conversion_report_${Date.now()}.json`
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Звіт збережено: ${reportPath}`);
}

// Головна функція
async function main() {
  try {
    console.log("🔍 ЗАПУСК РЕАЛЬНОЇ ПЕРЕВІРКИ КОНВЕРТАЦІЇ\n");

    // Перевіряємо існування директорій
    if (!fs.existsSync(CONFIG.sourceDir)) {
      console.error(`❌ Вихідна директорія не існує: ${CONFIG.sourceDir}`);
      process.exit(1);
    }

    if (!fs.existsSync(CONFIG.compressedDir)) {
      console.error(
        `❌ Конвертована директорія не існує: ${CONFIG.compressedDir}`
      );
      process.exit(1);
    }

    // Порівнюємо директорії
    const stats = compareDirectories();

    // Генеруємо звіт
    const success = generateReport(stats);

    // Зберігаємо звіт у файл
    saveReportToFile(stats);

    // Завершуємо з відповідним кодом
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error("❌ КРИТИЧНА ПОМИЛКА:", error);
    process.exit(1);
  }
}

// Запускаємо перевірку
main();
