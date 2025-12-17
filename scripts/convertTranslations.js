#!/usr/bin/env node

// scripts/convertTranslations.js
// const fs = require("fs");
// const path = require("path");

// // ==================== КОНФІГУРАЦІЯ ====================
// const CONFIG = {
//   // Які переклади конвертувати
//   translationsToConvert: [
//     "utt",
//     "ubt",
//     "ogienko",
//     "khomenko",
//     "siryy",
//     "synodal",
//     "kjv",
//     "lxx",
//     "thot",
//     "gnt",
//   ],

//   // Шляхи
//   sourceDir: "public/data", // Коренева папка з даними
//   outputDir: "public/data_compressed", // Папка для результату

//   // Налаштування
//   createBackup: true,
//   backupDir: "public/data_backup",
//   minifyJson: true,
//   preserveOriginals: true,

//   // Спеціальні налаштування для словників Strong
//   processStrongs: true,
//   strongsOutputFormat: "unified", // 'unified' або 'legacy'

//   // Налаштування формату
//   formatSettings: {
//     compressAllFields: true,
//     preserveSpecialFields: ["hebrew_equiv", "usages", "definition"],
//   },
// };

// // ==================== МАПИ ДЛЯ КОНВЕРТАЦІЇ ====================

// /**
//  * Основні мапи для перекладів та структури
//  */
// const baseKeyMappings = {
//   fullToShort: {
//     // Основні
//     word: "w",
//     strong: "s",
//     verse: "v",
//     words: "ws",

//     // Структурні
//     code: "c",
//     name: "n",
//     chapters: "ch",
//     group: "g",
//     books: "b",
//     OldT: "ot",
//     NewT: "nt",

//     // Скорочення для перекладів
//     translation: "tr",
//   },
// };

// /**
//  * Спеціальні мапи для словників Strong
//  * Адаптовано до універсальної структури грецького слова
//  */
// const strongsKeyMappings = {
//   fullToShort: {
//     // Основні обов'язкові поля
//     strong: "s",
//     word: "w",
//     translit: "t",
//     translation: "tr",
//     morphology: "m",

//     // Опційні поля (можуть бути в оригіналі)
//     definition: "def",
//     hebrew_equiv: "he",
//     usages: "u",
//     usages_count: "uc",
//     meanings: "mn",
//     lsj_definition_raw: "lsj",
//     grammar: "g",

//     // Додаткові поля
//     lemma: "l",
//     position: "pos",
//     usage_count: "uc",
//     frequency: "freq",
//   },

//   // Спеціальні правила трансформації для універсальної структури
//   transformations: {
//     // Якщо є 'definition', копіюємо його в 'meanings' як перший елемент
//     copyDefinitionToMeanings: true,

//     // Якщо є 'grammar', додаємо його до 'morphology'
//     combineGrammarWithMorphology: true,

//     // Нормалізуємо структуру для універсального використання
//     normalizeStructure: true,
//   },
// };

// /**
//  * Універсальна структура словника Strong
//  */
// const universalStrongStructure = {
//   required: ["s", "w", "t", "tr", "m"], // strong, word, translit, translation, morphology
//   optional: ["mn", "lsj", "g", "u", "uc", "he", "def", "l", "pos"],
//   defaults: {
//     mn: [], // meanings - масив
//     u: [], // usages - масив
//     uc: 0, // usages_count - число
//     g: "", // grammar - текст
//     lsj: "", // lsj_definition_raw - текст
//     def: "", // definition - текст
//     he: "", // hebrew_equiv - текст
//     l: "", // lemma - текст
//     pos: 0, // position - число
//   },
// };

// // ==================== ФУНКЦІЇ ДЛЯ КОНВЕРТАЦІЇ ====================

// /**
//  * Визначає тип файлу за шляхом
//  */
// function getFileType(filePath) {
//   const normalizedPath = filePath.replace(/\\/g, "/");

//   if (normalizedPath.includes("/strongs/")) {
//     return "strongs";
//   } else if (
//     normalizedPath.includes("/translations/") ||
//     normalizedPath.includes("/originals/")
//   ) {
//     return "translation";
//   } else if (normalizedPath.includes("/core.json")) {
//     return "core";
//   } else {
//     return "other";
//   }
// }

// /**
//  * Конвертує об'єкт словника Strong в універсальну структуру
//  */
// function normalizeStrongEntry(original) {
//   if (!original || typeof original !== "object") {
//     return original;
//   }

//   const result = {};
//   const mapping = strongsKeyMappings.fullToShort;

//   // 1. Конвертуємо всі поля за мапою
//   for (const [fullKey, shortKey] of Object.entries(mapping)) {
//     if (original[fullKey] !== undefined) {
//       result[shortKey] = original[fullKey];
//     }
//   }

//   // 2. Додаємо поля, яких немає в мапі
//   Object.keys(original).forEach((key) => {
//     if (!mapping[key] && !result[mapping[key]]) {
//       // Перевіряємо, чи це не вже скорочена версія
//       const isAlreadyShort = Object.values(mapping).includes(key);
//       if (!isAlreadyShort) {
//         result[key] = original[key];
//       }
//     }
//   });

//   // 3. Застосовуємо трансформації
//   if (strongsKeyMappings.transformations.normalizeStructure) {
//     // Якщо є definition, але немає meanings - створюємо meanings
//     if (result.def && !result.mn) {
//       result.mn = [result.def];
//     }

//     // Якщо є definition та meanings, додаємо definition як перший елемент
//     if (
//       strongsKeyMappings.transformations.copyDefinitionToMeanings &&
//       result.def &&
//       result.mn
//     ) {
//       if (!result.mn.includes(result.def)) {
//         result.mn = [result.def, ...result.mn];
//       }
//     }

//     // Комбінуємо grammar з morphology
//     if (
//       strongsKeyMappings.transformations.combineGrammarWithMorphology &&
//       result.g &&
//       result.m
//     ) {
//       if (!result.m.includes(result.g)) {
//         result.m = `${result.m}\n${result.g}`;
//       }
//     }

//     // Забезпечуємо наявність обов'язкових полів
//     universalStrongStructure.required.forEach((requiredKey) => {
//       if (result[requiredKey] === undefined) {
//         // Визначаємо повний ключ для логування
//         const fullKey =
//           Object.entries(mapping).find(
//             ([_, short]) => short === requiredKey
//           )?.[0] || requiredKey;

//         // Встановлюємо дефолтне значення
//         if (requiredKey === "s" && original.strong) {
//           result.s = original.strong;
//         } else if (requiredKey === "w" && original.word) {
//           result.w = original.word;
//         } else if (requiredKey === "t" && original.translit) {
//           result.t = original.translit;
//         } else if (requiredKey === "tr" && original.translation) {
//           result.tr = original.translation;
//         } else if (requiredKey === "m" && original.morphology) {
//           result.m = original.morphology;
//         } else {
//           console.warn(
//             `   ⚠️  Відсутнє обов'язкове поле: ${fullKey} (${requiredKey})`
//           );
//         }
//       }
//     });
//   }

//   return result;
// }

// /**
//  * Конвертує файл словника Strong
//  */
// function convertStrongsFile(filePath, originalData) {
//   try {
//     const result = {};

//     // Обробляємо кожен запис у файлі
//     Object.keys(originalData).forEach((key) => {
//       const entry = originalData[key];

//       if (entry && typeof entry === "object") {
//         // Нормалізуємо запис
//         result[key] = normalizeStrongEntry(entry);
//       } else {
//         // Якщо це не об'єкт, залишаємо як є
//         result[key] = entry;
//       }
//     });

//     return result;
//   } catch (error) {
//     console.error(`   ❌ Помилка при конвертації Strong файлу:`, error);
//     return null;
//   }
// }

// /**
//  * Конвертує файл перекладу або інші JSON
//  */
// function convertTranslationFile(filePath, originalData) {
//   try {
//     return compressObject(originalData, baseKeyMappings.fullToShort);
//   } catch (error) {
//     console.error(`   ❌ Помилка при конвертації файлу перекладу:`, error);
//     return null;
//   }
// }

// /**
//  * Рекурсивно конвертує об'єкт використовуючи мапу
//  */
// function compressObject(obj, mapping) {
//   // Базові випадки
//   if (obj === null || obj === undefined) return obj;
//   if (typeof obj !== "object") return obj;

//   // Масиви
//   if (Array.isArray(obj)) {
//     return obj.map((item) => compressObject(item, mapping));
//   }

//   // Об'єкти
//   const result = {};

//   for (const [key, value] of Object.entries(obj)) {
//     // Конвертуємо ключ
//     const newKey = mapping[key] || key;

//     // Конвертуємо значення
//     result[newKey] = compressObject(value, mapping);
//   }

//   return result;
// }

// /**
//  * Конвертує один файл
//  */
// function convertFile(filePath) {
//   try {
//     const relativePath = path.relative(CONFIG.sourceDir, filePath);
//     console.log(`📖 Читаємо: ${relativePath}`);

//     // Читаємо оригінальний файл
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     const originalData = JSON.parse(fileContent);

//     // Визначаємо тип файлу
//     const fileType = getFileType(filePath);
//     let compressedData;

//     // Вибираємо стратегію конвертації залежно від типу файлу
//     switch (fileType) {
//       case "strongs":
//         compressedData = convertStrongsFile(filePath, originalData);
//         break;

//       case "translation":
//       case "core":
//       case "other":
//         compressedData = convertTranslationFile(filePath, originalData);
//         break;

//       default:
//         compressedData = compressObject(
//           originalData,
//           baseKeyMappings.fullToShort
//         );
//     }

//     if (!compressedData) {
//       throw new Error("Конвертація повернула null");
//     }

//     // Форматуємо результат
//     const outputContent = CONFIG.minifyJson
//       ? JSON.stringify(compressedData)
//       : JSON.stringify(compressedData, null, 2);

//     // Створюємо вихідний шлях
//     const outputPath = path.join(CONFIG.outputDir, relativePath);

//     // Створюємо папки якщо потрібно
//     fs.mkdirSync(path.dirname(outputPath), { recursive: true });

//     // Записуємо результат
//     fs.writeFileSync(outputPath, outputContent);

//     // Статистика
//     const originalSize = Buffer.byteLength(fileContent, "utf8");
//     const compressedSize = Buffer.byteLength(outputContent, "utf8");
//     const savings = (
//       ((originalSize - compressedSize) / originalSize) *
//       100
//     ).toFixed(1);

//     console.log(`   ✅ Конвертовано: ${relativePath}`);
//     console.log(
//       `      📊 Розмір: ${(originalSize / 1024).toFixed(1)}KB → ${(
//         compressedSize / 1024
//       ).toFixed(1)}KB (економія ${savings}%)`
//     );

//     // Для словників додатково показуємо структуру
//     if (fileType === "strongs") {
//       const firstKey = Object.keys(compressedData)[0];
//       if (firstKey) {
//         console.log(
//           `      🏷️  Структура: ${Object.keys(compressedData[firstKey]).join(
//             ", "
//           )}`
//         );
//       }
//     }

//     return {
//       success: true,
//       originalSize,
//       compressedSize,
//       fileType,
//     };
//   } catch (error) {
//     console.error(`   ❌ Помилка при конвертації ${filePath}:`, error.message);
//     return { success: false, error: error.message };
//   }
// }

// /**
//  * Рекурсивно обходить директорію та обробляє JSON файли
//  */
// function processDirectory(dirPath) {
//   console.log(
//     `\n📂 Обробляємо директорію: ${path.relative(CONFIG.sourceDir, dirPath)}`
//   );

//   const stats = {
//     filesProcessed: 0,
//     filesSkipped: 0,
//     totalOriginalSize: 0,
//     totalCompressedSize: 0,
//     strongsFiles: 0,
//     translationFiles: 0,
//     errors: [],
//   };

//   try {
//     const items = fs.readdirSync(dirPath);

//     for (const item of items) {
//       const fullPath = path.join(dirPath, item);
//       const stat = fs.statSync(fullPath);

//       if (stat.isDirectory()) {
//         // Рекурсивно обробляємо піддиректорію
//         const subStats = processDirectory(fullPath);

//         // Додаємо статистику
//         stats.filesProcessed += subStats.filesProcessed;
//         stats.filesSkipped += subStats.filesSkipped;
//         stats.totalOriginalSize += subStats.totalOriginalSize;
//         stats.totalCompressedSize += subStats.totalCompressedSize;
//         stats.strongsFiles += subStats.strongsFiles;
//         stats.translationFiles += subStats.translationFiles;
//         stats.errors.push(...subStats.errors);
//       } else if (item.endsWith(".json")) {
//         // Обробляємо JSON файл
//         stats.filesProcessed++;

//         const result = convertFile(fullPath);
//         if (result.success) {
//           stats.totalOriginalSize += result.originalSize;
//           stats.totalCompressedSize += result.compressedSize;

//           // Лічильники за типами файлів
//           if (result.fileType === "strongs") {
//             stats.strongsFiles++;
//           } else if (result.fileType === "translation") {
//             stats.translationFiles++;
//           }
//         } else {
//           stats.filesSkipped++;
//           stats.errors.push({ file: fullPath, error: result.error });
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`Помилка при обробці ${dirPath}:`, error.message);
//     stats.errors.push({ directory: dirPath, error: error.message });
//   }

//   return stats;
// }

// /**
//  * Створює резервну копію
//  */
// function createBackup() {
//   if (!CONFIG.createBackup) {
//     console.log("⏭️  Резервне копіювання вимкнено");
//     return true;
//   }

//   try {
//     console.log("💾 Створюємо резервну копію...");

//     if (fs.existsSync(CONFIG.backupDir)) {
//       console.log("   ⚠️  Резервна копія вже існує, видаляємо...");
//       fs.rmSync(CONFIG.backupDir, { recursive: true, force: true });
//     }

//     // Копіюємо всю папку data
//     fs.cpSync(CONFIG.sourceDir, CONFIG.backupDir, { recursive: true });

//     console.log("   ✅ Резервна копія створена успішно");
//     return true;
//   } catch (error) {
//     console.error(
//       "   ❌ Помилка при створенні резервної копії:",
//       error.message
//     );
//     return false;
//   }
// }

// /**
//  * Створює README файл з інформацією про конвертацію
//  */
// function createReadme(stats) {
//   const readmePath = path.join(CONFIG.outputDir, "README.md");
//   const totalSavings = (
//     ((stats.totalOriginalSize - stats.totalCompressedSize) /
//       stats.totalOriginalSize) *
//     100
//   ).toFixed(1);

//   const readmeContent = `# Конвертовані JSON файли

// ## Статистика конвертації
// - Загальна кількість файлів: ${stats.filesProcessed}
// - Файлів словників Strong: ${stats.strongsFiles}
// - Файлів перекладів: ${stats.translationFiles}
// - Файлів з помилками: ${stats.errors.length}
// - Загальний розмір до: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB
// - Загальний розмір після: ${(stats.totalCompressedSize / 1024 / 1024).toFixed(
//     2
//   )} MB
// - Економія: ${totalSavings}%

// ## Використані скорочення для перекладів
// | Повний ключ | Скорочений |
// |-------------|------------|
// ${Object.entries(baseKeyMappings.fullToShort)
//   .map(([full, short]) => `| ${full} | ${short} |`)
//   .join("\n")}

// ## Використані скорочення для словників Strong
// | Повний ключ | Скорочений | Опис |
// |-------------|------------|------|
// | strong | s | Код Strong |
// | word | w | Оригінальне слово |
// | translit | t | Транслітерація |
// | translation | tr | Переклад |
// | morphology | m | Морфологія |
// | meanings | mn | Значення (масив) |
// | lsj_definition_raw | lsj | LSJ визначення |
// | grammar | g | Граматика |
// | usages | u | Вживання (масив) |
// | usages_count | uc | Кількість вживань |
// | definition | def | Визначення |
// | hebrew_equiv | he | Відповідник івриту |
// | lemma | l | Лема |
// | position | pos | Позиція |

// ## Універсальна структура словників Strong
// Після конвертації всі словники мають однакову структуру:
// \`\`\`json
// {
//   "G746": {
//     "s": "G746",
//     "w": "ἀρχή",
//     "t": "archē",
//     "tr": "початок, принцип",
//     "m": "іменник, жіночий рід, однина",
//     "mn": ["початок, принцип"],
//     "lsj": "...",
//     "g": "Іменник, жіночий рід, однина",
//     "u": ["Бут. 1:1 (LXX)", "Мат. 1:1 (NT)"],
//     "uc": 10,
//     "he": "H7225 (רֵאשִׁית)"
//   }
// }
// \`\`\`

// ## Особливості конвертації
// 1. Поле \`definition\` автоматично додається до \`mn\` (meanings)
// 2. Поле \`grammar\` комбінується з \`morphology\`
// 3. Всі обов'язкові поля гарантовано присутні
// 4. Зберігаються всі оригінальні дані

// ## Як використовувати у коді
// Для роботи з конвертованими файлами використовуйте \`jsonAdapter.js\`:

// \`\`\`javascript
// import { jsonAdapter, getValue } from '../utils/jsonAdapter';

// // Автоматична адаптація
// const data = jsonAdapter(loadedJson);

// // Безпечне отримання значень
// const word = getValue(data, 'word'); // Працює з обома форматами
// const strong = getValue(data, 'strong');
// \`\`\`

// ## Перевірка конвертації
// Для перевірки правильної роботи створено тестовий файл:
// \`\`\`bash
// node scripts/verifyConversion.js
// \`\`\`

// ## Дата конвертації
// ${new Date().toISOString()}

// ## Примітки
// - Оригінальні файли збережено в \`${CONFIG.backupDir}\`
// - Для відкочення виконайте: \`cp -r ${CONFIG.backupDir}/* ${CONFIG.sourceDir}/\`
// `;

//   fs.writeFileSync(readmePath, readmeContent, "utf8");
//   console.log("📝 README.md створено");
// }

// /**
//  * Створює тестовий скрипт для перевірки конвертації
//  */
// function createVerificationScript() {
//   const verifyScript = `#!/usr/bin/env node
// // scripts/verifyConversion.js
// const fs = require('fs');
// const path = require('path');

// const testFiles = [
//   'strongs/G746.json',
//   'strongs/G1722.json',
//   'translations/utt/OldT/GEN/gen1_utt.json',
//   'core.json'
// ];

// console.log('🔍 Перевірка конвертації JSON файлів\\n');

// let allPassed = true;

// testFiles.forEach(testFile => {
//   const filePath = path.join(__dirname, '..', 'public', 'data_compressed', testFile);

//   try {
//     if (!fs.existsSync(filePath)) {
//       console.log(\`❌ \${testFile}: Файл не знайдено\`);
//       allPassed = false;
//       return;
//     }

//     const content = fs.readFileSync(filePath, 'utf8');
//     const data = JSON.parse(content);

//     // Перевірка структури залежно від типу файлу
//     if (testFile.includes('strongs/')) {
//       const firstKey = Object.keys(data)[0];
//       const entry = data[firstKey];

//       // Обов'язкові поля для словників
//       const required = ['s', 'w', 't', 'tr', 'm'];
//       const missing = required.filter(field => !entry[field]);

//       if (missing.length > 0) {
//         console.log(\`❌ \${testFile}: Відсутні поля: \${missing.join(', ')}\`);
//         allPassed = false;
//       } else {
//         console.log(\`✅ \${testFile}: OK (структура: \${Object.keys(entry).join(', ')})\`);
//       }

//     } else if (testFile.includes('translations/')) {
//       // Перевірка перекладів
//       if (!Array.isArray(data)) {
//         console.log(\`❌ \${testFile}: Не масив\`);
//         allPassed = false;
//       } else if (data.length === 0) {
//         console.log(\`⚠️  \${testFile}: Порожній масив\`);
//       } else {
//         const firstVerse = data[0];
//         const hasShortKeys = firstVerse.ws || (firstVerse.v && firstVerse.ws);
//         console.log(\`✅ \${testFile}: OK (формат: \${hasShortKeys ? 'скорочений' : 'повний'})\`);
//       }

//     } else if (testFile.includes('core.json')) {
//       // Перевірка core.json
//       const hasShortKeys = data.lxx && data.lxx.ot;
//       console.log(\`✅ \${testFile}: OK (формат: \${hasShortKeys ? 'скорочений' : 'повний'})\`);
//     }

//   } catch (error) {
//     console.log(\`❌ \${testFile}: Помилка: \${error.message}\`);
//     allPassed = false;
//   }
// });

// console.log('\\n' + '='.repeat(50));
// if (allPassed) {
//   console.log('🎉 Всі перевірки пройдено успішно!');
// } else {
//   console.log('⚠️  Знайдено проблеми з конвертацією');
//   process.exit(1);
// }
// `;

//   const verifyPath = path.join(
//     CONFIG.outputDir,
//     "..",
//     "scripts",
//     "verifyConversion.js"
//   );
//   fs.mkdirSync(path.dirname(verifyPath), { recursive: true });
//   fs.writeFileSync(verifyPath, verifyScript, "utf8");
//   fs.chmodSync(verifyPath, "755"); // Дозволи на виконання

//   console.log("✅ Тестовий скрипт створено: scripts/verifyConversion.js");
// }

// /**
//  * Створює приклад конфігураційного файлу для майбутніх конвертацій
//  */
// function createConfigTemplate() {
//   const configTemplate = `// scripts/config-template.js
// module.exports = {
//   // Які переклади конвертувати
//   translationsToConvert: ['utt', 'ubt', 'ogienko', 'khomenko', 'siryy'],

//   // Шляхи
//   sourceDir: 'public/data',
//   outputDir: 'public/data_compressed',

//   // Налаштування
//   createBackup: true,
//   backupDir: 'public/data_backup',
//   minifyJson: true,
//   preserveOriginals: true,

//   // Налаштування словників
//   processStrongs: true,

//   // Додаткові мапи (опційно)
//   customMappings: {
//     // Додайте власні мапи тут
//   }
// };
// `;

//   const configPath = path.join(
//     CONFIG.outputDir,
//     "..",
//     "scripts",
//     "config-template.js"
//   );
//   fs.writeFileSync(configPath, configTemplate, "utf8");
//   console.log("✅ Шаблон конфігурації створено");
// }

// // ==================== ГОЛОВНА ФУНКЦІЯ ====================
// async function main() {
//   console.log("🚀 Запуск конвертації JSON файлів\n");
//   console.log("=".repeat(50));
//   console.log("Налаштування:");
//   console.log(`- Джерело: ${CONFIG.sourceDir}`);
//   console.log(`- Результат: ${CONFIG.outputDir}`);
//   console.log(
//     `- Переклади для обробки: ${CONFIG.translationsToConvert.join(", ")}`
//   );
//   console.log(
//     `- Обробляти словники Strong: ${CONFIG.processStrongs ? "Так" : "Ні"}`
//   );
//   console.log("=".repeat(50));

//   // Перевіряємо існування source директорії
//   if (!fs.existsSync(CONFIG.sourceDir)) {
//     console.error(`❌ Source директорія не існує: ${CONFIG.sourceDir}`);
//     process.exit(1);
//   }

//   // Створюємо резервну копію
//   if (!createBackup()) {
//     console.log("⏭️  Продовжуємо без резервної копії...");
//   }

//   // Створюємо output директорію
//   if (!fs.existsSync(CONFIG.outputDir)) {
//     fs.mkdirSync(CONFIG.outputDir, { recursive: true });
//   }

//   const allStats = {
//     filesProcessed: 0,
//     filesSkipped: 0,
//     totalOriginalSize: 0,
//     totalCompressedSize: 0,
//     strongsFiles: 0,
//     translationFiles: 0,
//     errors: [],
//   };

//   // Обробляємо кожну директорію перекладів
//   for (const translation of CONFIG.translationsToConvert) {
//     const transPath = path.join(CONFIG.sourceDir, "translations", translation);

//     if (fs.existsSync(transPath)) {
//       console.log(`\n🎯 Конвертуємо переклад: ${translation.toUpperCase()}`);
//       const stats = processDirectory(transPath);

//       // Акумулюємо статистику
//       allStats.filesProcessed += stats.filesProcessed;
//       allStats.filesSkipped += stats.filesSkipped;
//       allStats.totalOriginalSize += stats.totalOriginalSize;
//       allStats.totalCompressedSize += stats.totalCompressedSize;
//       allStats.strongsFiles += stats.strongsFiles;
//       allStats.translationFiles += stats.translationFiles;
//       allStats.errors.push(...stats.errors);
//     } else {
//       console.log(`⏭️  Переклад ${translation} не знайдено, пропускаємо`);
//     }
//   }

//   // Обробляємо словники Strong
//   if (CONFIG.processStrongs) {
//     console.log("\n📚 Конвертуємо словники Strong...");
//     const strongsPath = path.join(CONFIG.sourceDir, "strongs");
//     if (fs.existsSync(strongsPath)) {
//       const stats = processDirectory(strongsPath);
//       allStats.filesProcessed += stats.filesProcessed;
//       allStats.filesSkipped += stats.filesSkipped;
//       allStats.totalOriginalSize += stats.totalOriginalSize;
//       allStats.totalCompressedSize += stats.totalCompressedSize;
//       allStats.strongsFiles += stats.strongsFiles;
//       allStats.errors.push(...stats.errors);
//     } else {
//       console.log("⏭️  Папка словників Strong не знайдена");
//     }
//   }

//   // Обробляємо core.json та інші файли в корені
//   console.log("\n🏗️  Конвертуємо core.json та інші файли...");
//   const rootFiles = fs
//     .readdirSync(CONFIG.sourceDir)
//     .filter((file) => file.endsWith(".json"));

//   for (const file of rootFiles) {
//     const filePath = path.join(CONFIG.sourceDir, file);
//     const stat = fs.statSync(filePath);

//     if (stat.isFile()) {
//       const result = convertFile(filePath);
//       if (result.success) {
//         allStats.filesProcessed++;
//         allStats.totalOriginalSize += result.originalSize;
//         allStats.totalCompressedSize += result.compressedSize;
//       } else {
//         allStats.filesSkipped++;
//         allStats.errors.push({ file: filePath, error: result.error });
//       }
//     }
//   }

//   // Створюємо README
//   createReadme(allStats);

//   // Створюємо тестовий скрипт
//   createVerificationScript();

//   // Створюємо шаблон конфігурації
//   createConfigTemplate();

//   // Виводимо підсумкову статистику
//   console.log("\n" + "=".repeat(50));
//   console.log("✅ КОНВЕРТАЦІЮ ЗАВЕРШЕНО");
//   console.log("=".repeat(50));
//   console.log(`📊 Загальна статистика:`);
//   console.log(`   Файлів успішно конвертовано: ${allStats.filesProcessed}`);
//   console.log(`   Файлів словників Strong: ${allStats.strongsFiles}`);
//   console.log(`   Файлів перекладів: ${allStats.translationFiles}`);
//   console.log(`   Файлів з помилками: ${allStats.errors.length}`);
//   console.log(
//     `   Загальна економія: ${(
//       ((allStats.totalOriginalSize - allStats.totalCompressedSize) /
//         allStats.totalOriginalSize) *
//       100
//     ).toFixed(1)}%`
//   );
//   console.log(
//     `   Початковий розмір: ${(allStats.totalOriginalSize / 1024 / 1024).toFixed(
//       2
//     )} MB`
//   );
//   console.log(
//     `   Кінцевий розмір: ${(allStats.totalCompressedSize / 1024 / 1024).toFixed(
//       2
//     )} MB`
//   );

//   if (allStats.errors.length > 0) {
//     console.log("\n⚠️  Помилки:");
//     allStats.errors.forEach((err, i) => {
//       if (i < 10) {
//         // Показуємо тільки перші 10 помилок
//         console.log(`   ${i + 1}. ${err.file || err.directory}: ${err.error}`);
//       }
//     });
//     if (allStats.errors.length > 10) {
//       console.log(`   ... і ще ${allStats.errors.length - 10} помилок`);
//     }
//   }

//   console.log(`\n📁 Результат збережено в: ${CONFIG.outputDir}`);
//   console.log(
//     `📝 Деталі конвертації: ${path.join(CONFIG.outputDir, "README.md")}`
//   );
//   console.log(`🔍 Для перевірки виконайте: node scripts/verifyConversion.js`);

//   if (CONFIG.preserveOriginals) {
//     console.log(`\n💾 Оригінальні файли збережено в: ${CONFIG.sourceDir}`);
//     console.log(`💾 Резервна копія: ${CONFIG.backupDir}`);
//   }

//   // Пропонуємо наступні кроки
//   console.log("\n🎯 Наступні кроки:");
//   console.log("1. Перевірте конвертацію: node scripts/verifyConversion.js");
//   console.log("2. Оновіть шляхи в додатку для використання data_compressed");
//   console.log("3. Протестуйте додаток з новими файлами");
//   console.log(
//     "4. Якщо все працює, замініть оригінали: cp -r public/data_compressed/* public/data/"
//   );
// }

// // Запускаємо головну функцію
// main().catch(console.error);

// --------------------------------------------------

const fs = require("fs");
const path = require("path");

// ==================== КОНФІГУРАЦІЯ ====================
const CONFIG = {
  // Які переклади конвертувати
  translationsToConvert: [
    "utt",
    "ubt",
    "ogienko",
    "khomenko",
    "siryy",
    "synodal",
    "kjv",
  ],

  // Які оригінали конвертувати
  originalsToConvert: ["lxx", "thot", "gnt"],

  // Шляхи
  sourceDir: "public/data",
  outputDir: "public/data_compressed",

  // Налаштування
  createBackup: true,
  backupDir: "public/data_backup",
  minifyJson: true,
  preserveOriginals: true,

  // Спеціальні налаштування для словників Strong
  processStrongs: true,
  strongsOutputFormat: "unified", // 'unified' або 'legacy'

  // Налаштування формату
  formatSettings: {
    compressAllFields: true,
    preserveSpecialFields: ["hebrew_equiv", "usages", "definition"],
  },

  // Метадані для додавання до файлів
  metadata: {
    version: 2,
    converter: "under-word-converter",
  },
};

// ==================== МАПИ ДЛЯ КОНВЕРТАЦІЇ ====================

/**
 * Основні мапи для перекладів та структури
 */
const baseKeyMappings = {
  fullToShort: {
    // Основні
    word: "w",
    strong: "s",
    verse: "v",
    words: "ws",

    // Додаткові поля для оригіналів
    lemma: "l",
    morph: "m",

    // Структурні
    code: "c",
    name: "n",
    chapters: "ch",
    group: "g",
    books: "b",
    OldT: "ot",
    NewT: "nt",

    // Скорочення для перекладів
    translation: "tr",
  },
};

/**
 * Спеціальні мапи для словників Strong
 */
const strongsKeyMappings = {
  fullToShort: {
    // Основні обов'язкові поля
    strong: "s",
    word: "w",
    translit: "t",
    translation: "tr",
    morphology: "m",

    // Опційні поля
    definition: "def",
    hebrew_equiv: "he",
    usages: "u",
    usages_count: "uc",
    meanings: "mn",
    lsj_definition_raw: "lsj",
    grammar: "g",
    lemma: "l",
    position: "pos",
    usage_count: "uc",
    frequency: "freq",
  },
};

/**
 * Універсальна структура словника Strong
 */
const universalStrongStructure = {
  required: ["s", "w", "t", "tr", "m"],
  optional: ["mn", "lsj", "g", "u", "uc", "he", "def", "l", "pos"],
  defaults: {
    mn: [],
    u: [],
    uc: 0,
    g: "",
    lsj: "",
    def: "",
    he: "",
    l: "",
    pos: 0,
  },
};

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

/**
 * Логування з форматуванням
 */
function log(message, type = "info") {
  const icons = {
    info: "📝",
    success: "✅",
    warning: "⚠️",
    error: "❌",
    process: "🔄",
    file: "📁",
  };
  console.log(`${icons[type] || "📝"} ${message}`);
}

/**
 * Читає JSON файл з обробкою помилок
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    if (!content.trim()) {
      log(
        `Файл порожній: ${path.relative(CONFIG.sourceDir, filePath)}`,
        "warning"
      );
      return { empty: true };
    }

    return JSON.parse(content);
  } catch (error) {
    if (error.message.includes("Unexpected end of JSON input")) {
      log(
        `Помилка парсингу JSON (неправильний формат): ${path.relative(
          CONFIG.sourceDir,
          filePath
        )}`,
        "error"
      );
      return { error: "Invalid JSON format", details: error.message };
    }
    log(
      `Помилка читання файлу: ${path.relative(CONFIG.sourceDir, filePath)} - ${
        error.message
      }`,
      "error"
    );
    return { error: error.message };
  }
}

/**
 * Визначає тип файлу за шляхом
 */
function getFileType(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (normalizedPath.includes("/strongs/")) {
    return "strongs";
  } else if (normalizedPath.includes("/originals/")) {
    return "originals";
  } else if (normalizedPath.includes("/translations/")) {
    return "translation";
  } else if (
    normalizedPath.includes("core.json") ||
    normalizedPath.includes("core_")
  ) {
    return "core";
  } else if (
    normalizedPath.includes("books.json") ||
    normalizedPath.includes("chapters.json")
  ) {
    return "metadata";
  } else {
    return "other";
  }
}

/**
 * Визначає мову/переклад за шляхом
 */
function getTranslationInfo(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Визначаємо переклад з шляху
  let translation = "";
  let type = "";

  if (normalizedPath.includes("/originals/")) {
    type = "original";
    const match = normalizedPath.match(/originals\/([^\/]+)/);
    translation = match ? match[1] : "unknown";
  } else if (normalizedPath.includes("/translations/")) {
    type = "translation";
    const match = normalizedPath.match(/translations\/([^\/]+)/);
    translation = match ? match[1] : "unknown";
  }

  // Визначаємо книгу та розділ
  let book = "";
  let chapter = "";

  // Шукаємо структуру /BOOK/CHAP/ або /BOOK/bookX_translation.json
  const bookMatch = normalizedPath.match(/\/([A-Z]{3})\//);
  if (bookMatch) {
    book = bookMatch[1];
    const chapMatch = normalizedPath.match(/(\d+)\.json$/);
    if (chapMatch) {
      chapter = chapMatch[1];
    }
  } else {
    // Альтернативний формат: gen1_utt.json
    const fileName = path.basename(filePath);
    const fileMatch = fileName.match(/^([a-z]+)(\d+)_/);
    if (fileMatch) {
      book = fileMatch[1].toUpperCase();
      chapter = fileMatch[2];
    }
  }

  // Визначаємо мову на основі перекладу
  const languageMap = {
    lxx: { language: "greek", name: "Septuagint (LXX)" },
    thot: { language: "hebrew", name: "Hebrew OT" },
    gnt: { language: "greek", name: "Greek NT" },
    utt: { language: "ukrainian", name: "Ukrainian Translation" },
    ubt: { language: "ukrainian", name: "Ukrainian Bible" },
    ogienko: { language: "ukrainian", name: "Ogienko Translation" },
    khomenko: { language: "ukrainian", name: "Khomenko Translation" },
    siryy: { language: "ukrainian", name: "Siryy Translation" },
    synodal: { language: "russian", name: "Synodal Translation" },
    kjv: { language: "english", name: "King James Version" },
  };

  const langInfo = languageMap[translation] || {
    language: "unknown",
    name: translation,
  };

  return {
    translation,
    type,
    book,
    chapter,
    language: langInfo.language,
    name: langInfo.name,
    hasStrongs: ["lxx", "thot", "gnt", "utt", "ubt", "kjv"].includes(
      translation
    ),
    hasMorphology: ["lxx", "gnt"].includes(translation),
    hasLemma: ["lxx", "gnt"].includes(translation),
  };
}

/**
 * Додає метадані до конвертованих даних
 */
function addMetadata(data, fileInfo, originalPath) {
  if (!data || typeof data !== "object") return data;

  const metadata = {
    converter: CONFIG.metadata.converter,
    version: CONFIG.metadata.version,
    converted: new Date().toISOString(),
    info: {
      ...fileInfo,
      originalPath: path.relative(CONFIG.sourceDir, originalPath),
    },
  };

  // Для масивів (вірші)
  if (Array.isArray(data)) {
    return {
      _meta: metadata,
      verses: data,
    };
  }

  // Для об'єктів (словники тощо)
  return {
    _meta: metadata,
    ...data,
  };
}

// ==================== ФУНКЦІЇ КОНВЕРТАЦІЇ ====================

/**
 * Конвертує запис словника Strong в універсальну структуру
 */
function normalizeStrongEntry(original) {
  if (!original || typeof original !== "object") {
    return original;
  }

  const result = {};
  const mapping = strongsKeyMappings.fullToShort;

  // 1. Конвертуємо всі поля за мапою
  for (const [fullKey, shortKey] of Object.entries(mapping)) {
    if (original[fullKey] !== undefined) {
      result[shortKey] = original[fullKey];
    }
  }

  // 2. Додаємо поля, яких немає в мапі
  Object.keys(original).forEach((key) => {
    if (!mapping[key] && !result[mapping[key]]) {
      const isAlreadyShort = Object.values(mapping).includes(key);
      if (!isAlreadyShort) {
        result[key] = original[key];
      }
    }
  });

  // 3. Забезпечуємо наявність обов'язкових полів
  universalStrongStructure.required.forEach((requiredKey) => {
    if (result[requiredKey] === undefined) {
      const fullKey =
        Object.entries(mapping).find(
          ([_, short]) => short === requiredKey
        )?.[0] || requiredKey;

      if (requiredKey === "s" && original.strong) {
        result.s = original.strong;
      } else if (requiredKey === "w" && original.word) {
        result.w = original.word;
      } else if (requiredKey === "t" && original.translit) {
        result.t = original.translit;
      } else if (requiredKey === "tr" && original.translation) {
        result.tr = original.translation;
      } else if (requiredKey === "m" && original.morphology) {
        result.m = original.morphology;
      } else {
        result[requiredKey] =
          universalStrongStructure.defaults[requiredKey] || "";
      }
    }
  });

  // 4. Додаємо опціональні поля з дефолтами
  universalStrongStructure.optional.forEach((optionalKey) => {
    if (result[optionalKey] === undefined) {
      result[optionalKey] = universalStrongStructure.defaults[optionalKey];
    }
  });

  return result;
}

/**
 * Конвертує файл словника Strong
 */
function convertStrongsFile(filePath, originalData) {
  try {
    const result = {};

    Object.keys(originalData).forEach((key) => {
      const entry = originalData[key];
      result[key] = normalizeStrongEntry(entry);
    });

    return result;
  } catch (error) {
    log(`Помилка при конвертації Strong файлу: ${error.message}`, "error");
    return null;
  }
}

/**
 * Конвертує оригінальний файл (lxx, thot, gnt)
 */
function convertOriginalFile(filePath, originalData, fileInfo) {
  try {
    // Перевіряємо, чи це масив віршів
    if (!Array.isArray(originalData)) {
      log("Оригінальний файл не має очікуваної структури масиву", "warning");
      return compressObject(originalData, baseKeyMappings.fullToShort);
    }

    // Конвертуємо кожен вірш
    const convertedVerses = originalData.map((verse) => {
      if (!verse || typeof verse !== "object") return verse;

      const convertedVerse = {
        v: verse.v || verse.verse,
      };

      // Конвертуємо слова
      if (verse.words && Array.isArray(verse.words)) {
        convertedVerse.ws = verse.words.map((word) => {
          const convertedWord = {
            w: word.word,
            s: word.strong,
          };

          // Додаємо додаткові поля для грецьких текстів
          if (word.lemma) convertedWord.l = word.lemma;
          if (word.morph) convertedWord.m = word.morph;

          return convertedWord;
        });
      }

      return convertedVerse;
    });

    return convertedVerses;
  } catch (error) {
    log(
      `Помилка при конвертації оригінального файлу: ${error.message}`,
      "error"
    );
    return null;
  }
}

/**
 * Конвертує файл перекладу
 */
function convertTranslationFile(filePath, originalData, fileInfo) {
  try {
    // Перевіряємо, чи це масив віршів
    if (!Array.isArray(originalData)) {
      log("Файл перекладу не має очікуваної структури масиву", "warning");
      return compressObject(originalData, baseKeyMappings.fullToShort);
    }

    // Конвертуємо кожен вірш
    const convertedVerses = originalData.map((verse) => {
      if (!verse || typeof verse !== "object") return verse;

      const convertedVerse = {
        v: verse.v || verse.verse,
      };

      // Конвертуємо слова
      if (verse.words && Array.isArray(verse.words)) {
        convertedVerse.ws = verse.words.map((word) => ({
          w: word.word,
          s: word.strong,
        }));
      }

      return convertedVerse;
    });

    return convertedVerses;
  } catch (error) {
    log(`Помилка при конвертації файлу перекладу: ${error.message}`, "error");
    return null;
  }
}

/**
 * Рекурсивно конвертує об'єкт використовуючи мапу
 */
function compressObject(obj, mapping) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => compressObject(item, mapping));
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = mapping[key] || key;
    result[newKey] = compressObject(value, mapping);
  }

  return result;
}

/**
 * Конвертує один файл
 */
function convertFile(filePath) {
  try {
    const relativePath = path.relative(CONFIG.sourceDir, filePath);
    log(`Читаємо: ${relativePath}`, "file");

    // Читаємо оригінальний файл
    const fileData = readJsonFile(filePath);

    // Обробка порожніх файлів
    if (fileData.empty) {
      log(`Файл порожній: ${relativePath}`, "warning");

      // Створюємо порожню структуру з метаданими
      const fileInfo = getTranslationInfo(filePath);
      const emptyResult = {
        _meta: {
          converter: CONFIG.metadata.converter,
          version: CONFIG.metadata.version,
          converted: new Date().toISOString(),
          info: {
            ...fileInfo,
            originalPath: relativePath,
            isEmpty: true,
          },
        },
        verses: [],
      };

      const outputPath = path.join(CONFIG.outputDir, relativePath);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(
        outputPath,
        CONFIG.minifyJson
          ? JSON.stringify(emptyResult)
          : JSON.stringify(emptyResult, null, 2)
      );

      return {
        success: true,
        originalSize: 0,
        compressedSize: Buffer.byteLength(JSON.stringify(emptyResult), "utf8"),
        fileType: getFileType(filePath),
        isEmpty: true,
      };
    }

    // Обробка помилок парсингу
    if (fileData.error) {
      log(
        `Помилка: ${relativePath} - ${fileData.details || fileData.error}`,
        "error"
      );
      return { success: false, error: fileData.error };
    }

    const fileInfo = getTranslationInfo(filePath);
    const fileType = getFileType(filePath);
    let compressedData;

    // Вибираємо стратегію конвертації
    switch (fileType) {
      case "strongs":
        compressedData = convertStrongsFile(filePath, fileData);
        break;
      case "originals":
        compressedData = convertOriginalFile(filePath, fileData, fileInfo);
        break;
      case "translation":
        compressedData = convertTranslationFile(filePath, fileData, fileInfo);
        break;
      default:
        compressedData = compressObject(fileData, baseKeyMappings.fullToShort);
    }

    if (!compressedData) {
      throw new Error("Конвертація повернула null");
    }

    // Додаємо метадані (крім словників Strong)
    let finalData = compressedData;
    if (fileType !== "strongs") {
      finalData = addMetadata(compressedData, fileInfo, filePath);
    }

    // Форматуємо результат
    const outputContent = CONFIG.minifyJson
      ? JSON.stringify(finalData)
      : JSON.stringify(finalData, null, 2);

    // Створюємо вихідний шлях
    const outputPath = path.join(CONFIG.outputDir, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Записуємо результат
    fs.writeFileSync(outputPath, outputContent);

    // Статистика
    const originalSize = Buffer.byteLength(JSON.stringify(fileData), "utf8");
    const compressedSize = Buffer.byteLength(outputContent, "utf8");
    const savings =
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
        : "0.0";

    log(`Конвертовано: ${relativePath}`, "success");
    log(
      `Розмір: ${(originalSize / 1024).toFixed(1)}KB → ${(
        compressedSize / 1024
      ).toFixed(1)}KB (економія ${savings}%)`,
      "info"
    );

    // Показуємо структуру для словників
    if (fileType === "strongs") {
      const firstKey = Object.keys(compressedData)[0];
      if (firstKey && compressedData[firstKey]) {
        const structure = Object.keys(compressedData[firstKey]).join(", ");
        log(`Структура: ${structure}`, "info");
      }
    }

    return {
      success: true,
      originalSize,
      compressedSize,
      fileType,
      isEmpty: false,
    };
  } catch (error) {
    log(`Помилка при конвертації ${filePath}: ${error.message}`, "error");
    return { success: false, error: error.message };
  }
}

/**
 * Рекурсивно обходить директорію та обробляє JSON файли
 */
function processDirectory(dirPath) {
  log(
    `Обробляємо директорію: ${path.relative(CONFIG.sourceDir, dirPath)}`,
    "process"
  );

  const stats = {
    filesProcessed: 0,
    filesSkipped: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    strongsFiles: 0,
    originalsFiles: 0,
    translationFiles: 0,
    emptyFiles: 0,
    errors: [],
  };

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subStats = processDirectory(fullPath);

        // Акумулюємо статистику
        stats.filesProcessed += subStats.filesProcessed;
        stats.filesSkipped += subStats.filesSkipped;
        stats.totalOriginalSize += subStats.totalOriginalSize;
        stats.totalCompressedSize += subStats.totalCompressedSize;
        stats.strongsFiles += subStats.strongsFiles;
        stats.originalsFiles += subStats.originalsFiles;
        stats.translationFiles += subStats.translationFiles;
        stats.emptyFiles += subStats.emptyFiles;
        stats.errors.push(...subStats.errors);
      } else if (item.endsWith(".json")) {
        stats.filesProcessed++;

        const result = convertFile(fullPath);
        if (result.success) {
          stats.totalOriginalSize += result.originalSize;
          stats.totalCompressedSize += result.compressedSize;

          // Лічильники за типами файлів
          if (result.fileType === "strongs") {
            stats.strongsFiles++;
          } else if (result.fileType === "originals") {
            stats.originalsFiles++;
          } else if (result.fileType === "translation") {
            stats.translationFiles++;
          }

          if (result.isEmpty) {
            stats.emptyFiles++;
          }
        } else {
          stats.filesSkipped++;
          stats.errors.push({ file: fullPath, error: result.error });
        }
      }
    }
  } catch (error) {
    log(`Помилка при обробці ${dirPath}: ${error.message}`, "error");
    stats.errors.push({ directory: dirPath, error: error.message });
  }

  return stats;
}

/**
 * Створює резервну копію
 */
function createBackup() {
  if (!CONFIG.createBackup) {
    log("Резервне копіювання вимкнено", "warning");
    return true;
  }

  try {
    log("Створюємо резервну копію...", "process");

    if (fs.existsSync(CONFIG.backupDir)) {
      log("Резервна копія вже існує, видаляємо...", "warning");
      fs.rmSync(CONFIG.backupDir, { recursive: true, force: true });
    }

    fs.cpSync(CONFIG.sourceDir, CONFIG.backupDir, { recursive: true });
    log("Резервна копія створена успішно", "success");
    return true;
  } catch (error) {
    log(`Помилка при створенні резервної копії: ${error.message}`, "error");
    return false;
  }
}

// ==================== ФУНКЦІЇ ДЛЯ ЗВІТІВ ====================

/**
 * Створює README файл
 */
function createReadme(stats) {
  const readmePath = path.join(CONFIG.outputDir, "README.md");
  const totalSavings =
    stats.totalOriginalSize > 0
      ? (
          ((stats.totalOriginalSize - stats.totalCompressedSize) /
            stats.totalOriginalSize) *
          100
        ).toFixed(1)
      : "0.0";

  const readmeContent = `# Конвертовані JSON файли

## Статистика конвертації
- Загальна кількість файлів: ${stats.filesProcessed}
- Файлів словників Strong: ${stats.strongsFiles}
- Файлів оригіналів: ${stats.originalsFiles}
- Файлів перекладів: ${stats.translationFiles}
- Порожніх файлів: ${stats.emptyFiles}
- Файлів з помилками: ${stats.errors.length}
- Загальний розмір до: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB
- Загальний розмір після: ${(stats.totalCompressedSize / 1024 / 1024).toFixed(
    2
  )} MB
- Економія: ${totalSavings}%

## Метадані в файлах
Кожен конвертований файл містить метадані в полі \`_meta\`:
\`\`\`json
{
  "_meta": {
    "converter": "under-word-converter",
    "version": 2,
    "converted": "2024-01-01T12:00:00.000Z",
    "info": {
      "translation": "lxx",
      "type": "original",
      "book": "GEN",
      "chapter": "1",
      "language": "greek",
      "name": "Septuagint (LXX)",
      "hasStrongs": true,
      "hasMorphology": true,
      "hasLemma": true,
      "originalPath": "originals/lxx/OldT/GEN/gen1_lxx.json"
    }
  },
  "verses": [...]
}
\`\`\`

## Формат віршів після конвертації
\`\`\`json
[
  {
    "v": 1,
    "ws": [
      { "w": "Ἐν", "s": "G1722", "l": "ἐν", "m": "PREP" },
      { "w": "ἀρχῇ", "s": "G746", "l": "ἀρχή", "m": "N-DSF" }
    ]
  }
]
\`\`\`

## Використані скорочення
| Повний ключ | Скорочений |
|-------------|------------|
${Object.entries(baseKeyMappings.fullToShort)
  .map(([full, short]) => `| ${full} | ${short} |`)
  .join("\n")}

## Дата конвертації
${new Date().toISOString()}

## Примітки
- Оригінальні файли збережено в \`${CONFIG.backupDir}\`
- Порожні файли помічаються \`"isEmpty": true\` в метаданих
- Для перевірки: \`node scripts/verifyConversion.js\`
`;

  fs.writeFileSync(readmePath, readmeContent, "utf8");
  log("README.md створено", "success");
}

/**
 * Створює скрипт для перевірки
 */
function createVerificationScript() {
  const verifyScript = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const testFiles = [
  'originals/lxx/OldT/GEN/gen1_lxx.json',
  'originals/thot/OldT/GEN/gen1_thot.json',
  'translations/utt/OldT/GEN/gen1_utt.json',
  'strongs/G746.json',
  'core.json'
];

console.log('🔍 Перевірка конвертації JSON файлів\\n');

let allPassed = true;
const results = [];

testFiles.forEach(testFile => {
  const filePath = path.join(__dirname, '..', 'public', 'data_compressed', testFile);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(\`❌ \${testFile}: Файл не знайдено\`);
      results.push({ file: testFile, status: 'missing' });
      allPassed = false;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Загальна перевірка
    if (!data) {
      console.log(\`❌ \${testFile}: Порожні дані\`);
      results.push({ file: testFile, status: 'empty' });
      allPassed = false;
      return;
    }
    
    // Перевірка метаданих (якщо не словник)
    if (!testFile.includes('strongs/') && !data._meta) {
      console.log(\`⚠️  \${testFile}: Відсутні метадані\`);
      results.push({ file: testFile, status: 'no-meta' });
    } else if (data._meta) {
      console.log(\`✅ \${testFile}: Метадані: \${data._meta.info?.translation || 'N/A'}\`);
      results.push({ file: testFile, status: 'ok', meta: data._meta.info });
    }
    
    // Перевірка структури
    if (testFile.includes('originals/') || testFile.includes('translations/')) {
      const verses = data.verses || data;
      if (!Array.isArray(verses)) {
        console.log(\`❌ \${testFile}: Не масив віршів\`);
        allPassed = false;
      } else if (verses.length > 0) {
        const firstVerse = verses[0];
        if (!firstVerse.v || !firstVerse.ws) {
          console.log(\`❌ \${testFile}: Неправильна структура вірша\`);
          allPassed = false;
        } else {
          console.log(\`   ↳ Віршів: \${verses.length}, слів у першому: \${firstVerse.ws?.length || 0}\`);
        }
      }
    }
    
  } catch (error) {
    console.log(\`❌ \${testFile}: Помилка: \${error.message}\`);
    results.push({ file: testFile, status: 'error', error: error.message });
    allPassed = false;
  }
});

console.log('\\n📊 Підсумок:');
results.forEach(result => {
  const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';
  console.log(\`\${icon} \${result.file}: \${result.status}\`);
});

console.log('\\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 Всі перевірки пройдено успішно!');
} else {
  console.log('⚠️  Знайдено проблеми з конвертацією');
  process.exit(1);
}
`;

  const verifyPath = path.join(
    CONFIG.outputDir,
    "..",
    "scripts",
    "verifyConversion.js"
  );
  fs.mkdirSync(path.dirname(verifyPath), { recursive: true });
  fs.writeFileSync(verifyPath, verifyScript, "utf8");
  fs.chmodSync(verifyPath, "755");
  log("Тестовий скрипт створено: scripts/verifyConversion.js", "success");
}

// ==================== ГОЛОВНА ФУНКЦІЯ ====================
async function main() {
  console.log("\n" + "=".repeat(50));
  log("🚀 Запуск конвертації JSON файлів", "info");
  console.log("=".repeat(50));
  console.log("Налаштування:");
  console.log(`- Джерело: ${CONFIG.sourceDir}`);
  console.log(`- Результат: ${CONFIG.outputDir}`);
  console.log(`- Переклади: ${CONFIG.translationsToConvert.join(", ")}`);
  console.log(`- Оригінали: ${CONFIG.originalsToConvert.join(", ")}`);
  console.log(
    `- Обробляти словники Strong: ${CONFIG.processStrongs ? "Так" : "Ні"}`
  );
  console.log("=".repeat(50));

  // Перевірка source директорії
  if (!fs.existsSync(CONFIG.sourceDir)) {
    log(`Source директорія не існує: ${CONFIG.sourceDir}`, "error");
    process.exit(1);
  }

  // Резервна копія
  if (!createBackup()) {
    log("Продовжуємо без резервної копії...", "warning");
  }

  // Створення output директорії
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const allStats = {
    filesProcessed: 0,
    filesSkipped: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    strongsFiles: 0,
    originalsFiles: 0,
    translationFiles: 0,
    emptyFiles: 0,
    errors: [],
  };

  // Обробляємо переклади
  for (const translation of CONFIG.translationsToConvert) {
    const transPath = path.join(CONFIG.sourceDir, "translations", translation);

    if (fs.existsSync(transPath)) {
      log(`Конвертуємо переклад: ${translation.toUpperCase()}`, "process");
      const stats = processDirectory(transPath);

      allStats.filesProcessed += stats.filesProcessed;
      allStats.filesSkipped += stats.filesSkipped;
      allStats.totalOriginalSize += stats.totalOriginalSize;
      allStats.totalCompressedSize += stats.totalCompressedSize;
      allStats.translationFiles += stats.translationFiles;
      allStats.emptyFiles += stats.emptyFiles;
      allStats.errors.push(...stats.errors);
    } else {
      log(`Переклад ${translation} не знайдено, пропускаємо`, "warning");
    }
  }

  // Обробляємо оригінали
  for (const original of CONFIG.originalsToConvert) {
    const origPath = path.join(CONFIG.sourceDir, "originals", original);

    if (fs.existsSync(origPath)) {
      log(`Конвертуємо оригінал: ${original.toUpperCase()}`, "process");
      const stats = processDirectory(origPath);

      allStats.filesProcessed += stats.filesProcessed;
      allStats.filesSkipped += stats.filesSkipped;
      allStats.totalOriginalSize += stats.totalOriginalSize;
      allStats.totalCompressedSize += stats.totalCompressedSize;
      allStats.originalsFiles += stats.originalsFiles;
      allStats.emptyFiles += stats.emptyFiles;
      allStats.errors.push(...stats.errors);
    } else {
      log(`Оригінал ${original} не знайдено, пропускаємо`, "warning");
    }
  }

  // Обробляємо словники Strong
  if (CONFIG.processStrongs) {
    log("Конвертуємо словники Strong...", "process");
    const strongsPath = path.join(CONFIG.sourceDir, "strongs");
    if (fs.existsSync(strongsPath)) {
      const stats = processDirectory(strongsPath);
      allStats.filesProcessed += stats.filesProcessed;
      allStats.filesSkipped += stats.filesSkipped;
      allStats.totalOriginalSize += stats.totalOriginalSize;
      allStats.totalCompressedSize += stats.totalCompressedSize;
      allStats.strongsFiles += stats.strongsFiles;
      allStats.emptyFiles += stats.emptyFiles;
      allStats.errors.push(...stats.errors);
    } else {
      log("Папка словників Strong не знайдена", "warning");
    }
  }

  // Обробляємо кореневі файли
  log("Конвертуємо core.json та інші файли...", "process");
  const rootFiles = fs
    .readdirSync(CONFIG.sourceDir)
    .filter((file) => file.endsWith(".json"));

  for (const file of rootFiles) {
    const filePath = path.join(CONFIG.sourceDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const result = convertFile(filePath);
      if (result.success) {
        allStats.filesProcessed++;
        allStats.totalOriginalSize += result.originalSize;
        allStats.totalCompressedSize += result.compressedSize;
        if (result.isEmpty) allStats.emptyFiles++;
      } else {
        allStats.filesSkipped++;
        allStats.errors.push({ file: filePath, error: result.error });
      }
    }
  }

  // Створюємо звітні файли
  createReadme(allStats);
  createVerificationScript();

  // Виводимо статистику
  console.log("\n" + "=".repeat(50));
  log("КОНВЕРТАЦІЮ ЗАВЕРШЕНО", "success");
  console.log("=".repeat(50));
  console.log(`📊 Статистика:`);
  console.log(`   Файлів оброблено: ${allStats.filesProcessed}`);
  console.log(`   Словників Strong: ${allStats.strongsFiles}`);
  console.log(`   Оригіналів: ${allStats.originalsFiles}`);
  console.log(`   Перекладів: ${allStats.translationFiles}`);
  console.log(`   Порожніх файлів: ${allStats.emptyFiles}`);
  console.log(`   Помилок: ${allStats.errors.length}`);

  if (allStats.totalOriginalSize > 0) {
    const savings = (
      ((allStats.totalOriginalSize - allStats.totalCompressedSize) /
        allStats.totalOriginalSize) *
      100
    ).toFixed(1);

    console.log(`   Економія: ${savings}%`);
    console.log(
      `   Розмір: ${(allStats.totalOriginalSize / 1024 / 1024).toFixed(
        2
      )}MB → ${(allStats.totalCompressedSize / 1024 / 1024).toFixed(2)}MB`
    );
  }

  if (allStats.errors.length > 0) {
    console.log(`\n⚠️  Помилки (перші 5):`);
    allStats.errors.slice(0, 5).forEach((err, i) => {
      const file = err.file || err.directory;
      const relative = path.relative(CONFIG.sourceDir, file);
      console.log(`   ${i + 1}. ${relative}: ${err.error}`);
    });
    if (allStats.errors.length > 5) {
      console.log(`   ... і ще ${allStats.errors.length - 5} помилок`);
    }
  }

  console.log(`\n📁 Результат: ${CONFIG.outputDir}`);
  console.log(`📝 README: ${path.join(CONFIG.outputDir, "README.md")}`);
  console.log(`🔍 Перевірка: node scripts/verifyConversion.js`);

  if (CONFIG.preserveOriginals) {
    console.log(`\n💾 Оригінали: ${CONFIG.sourceDir}`);
    console.log(`💾 Резерв: ${CONFIG.backupDir}`);
  }

  console.log("\n🎯 Наступні кроки:");
  console.log("1. node scripts/verifyConversion.js");
  console.log("2. Перевірте шляхи в додатку");
  console.log("3. Протестуйте з data_compressed");
  console.log("4. Замініть: cp -r public/data_compressed/* public/data/");
}

// Запуск
main().catch((error) => {
  log(`Критична помилка: ${error.message}`, "error");
  console.error(error);
  process.exit(1);
});
