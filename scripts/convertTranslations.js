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
    "synodal",
    "kjv",
  ],

  // Які оригінали конвертувати
  originalsToConvert: ["lxx", "thot", "gnt", "tr"],

  // Шляхи
  sourceDir: "public/data",
  outputDir: "public/data_compressed",

  // Налаштування
  createBackup: true,
  backupDir: "public/data_backup",
  minifyJson: true,
  preserveOriginals: true,
  processStrongs: true,

  // Виключити тимчасові папки
  excludePatterns: [/_old/, /_new/, /backup/, /compressed/, /reports/],
};

// ==================== МАПИ ДЛЯ КОНВЕРТАЦІЇ ====================

const baseKeyMappings = {
  fullToShort: {
    // Основні
    word: "w",
    strong: "s",
    verse: "v",
    words: "ws",
    lemma: "l",
    morph: "m",

    // Додаткові для словників
    translit: "t",
    translation: "tr",
    morphology: "m",
    definition: "def",
    hebrew_equiv: "he",
    usages: "u",
    grammar: "g",
    meanings: "mn",
    greek_equiv: "gr",
    lsj_definition_raw: "lsj",
  },
};

// Спеціальні мапи для словників Strong
const strongsKeyMappings = {
  fullToShort: {
    // Основні обов'язкові поля
    strong: "s",
    word: "w",
    translit: "t",
    translation: "tr",
    morphology: "m",

    // Опціональні поля
    definition: "def",
    hebrew_equiv: "he",
    usages: "u",
    usages_count: "uc",
    meanings: "mn",
    lsj_definition_raw: "lsj",
    grammar: "g",
    lemma: "l",
    greek_equiv: "gr",
  },
};

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

/**
 * Перевіряє, чи потрібно обробляти файл
 */
function shouldProcessFile(filePath) {
  const normalized = filePath.replace(/\\/g, "/");

  // Виключити файли з excludePatterns
  for (const pattern of CONFIG.excludePatterns) {
    if (pattern.test(normalized)) {
      return false;
    }
  }

  return true;
}

/**
 * Читає JSON файл
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    if (!content.trim()) {
      console.log(`⚠️  Файл порожній: ${filePath}`);
      return { empty: true };
    }

    const data = JSON.parse(content);
    return { data, success: true };
  } catch (error) {
    console.error(`❌ Помилка читання ${filePath}:`, error.message);
    return { error: error.message, success: false };
  }
}

/**
 * Визначає тип файлу
 */
function getFileType(filePath) {
  const relativePath = path.relative(CONFIG.sourceDir, filePath);

  if (relativePath.includes("strongs/")) {
    return "strongs";
  } else if (relativePath.includes("originals/")) {
    return "originals";
  } else if (relativePath.includes("translations/")) {
    return "translation";
  } else if (
    relativePath.includes("core.json") ||
    relativePath.includes("core_")
  ) {
    return "core";
  } else {
    return "other";
  }
}

/**
 * Визначає інформацію про файл
 */
function getFileInfo(filePath) {
  const relativePath = path.relative(CONFIG.sourceDir, filePath);
  const fileName = path.basename(filePath);

  // Визначаємо тип
  let type = "translation";
  let translation = "";

  if (relativePath.includes("originals/")) {
    type = "original";
    const match = relativePath.match(/originals\/([^\/]+)/);
    translation = match ? match[1] : "unknown";
  } else if (relativePath.includes("translations/")) {
    type = "translation";
    const match = relativePath.match(/translations\/([^\/]+)/);
    translation = match ? match[1] : "unknown";
  } else if (relativePath.includes("strongs/")) {
    type = "strongs";
  }

  // Визначаємо книгу та главу
  let book = "";
  let chapter = "";

  const bookMatch = relativePath.match(/\/([A-Z]{3})\//);
  if (bookMatch) {
    book = bookMatch[1];
    const chapMatch = fileName.match(/(\d+)/);
    if (chapMatch) {
      chapter = chapMatch[1];
    }
  }

  // Мова
  const languageMap = {
    lxx: "greek",
    thot: "hebrew",
    gnt: "greek",
    utt: "ukrainian",
    ubt: "ukrainian",
    ogienko: "ukrainian",
    khomenko: "ukrainian",
    synodal: "russian",
    kjv: "english",
  };

  return {
    translation,
    type,
    book,
    chapter,
    language: languageMap[translation] || "unknown",
    fileName,
    relativePath,
  };
}

/**
 * Конвертує запис словника Strong
 */
function convertStrongEntry(originalEntry) {
  if (!originalEntry || typeof originalEntry !== "object") {
    return originalEntry;
  }

  const result = {};
  const mapping = strongsKeyMappings.fullToShort;

  // Конвертуємо всі поля за мапою
  for (const [fullKey, shortKey] of Object.entries(mapping)) {
    if (originalEntry[fullKey] !== undefined) {
      result[shortKey] = originalEntry[fullKey];
    }
  }

  // Зберігаємо поля, яких немає в мапі
  Object.keys(originalEntry).forEach((key) => {
    if (!mapping[key] && !result[mapping[key]]) {
      const isAlreadyShort = Object.values(mapping).includes(key);
      if (!isAlreadyShort) {
        result[key] = originalEntry[key];
      }
    }
  });

  // Спеціальна обробка для деяких полів

  // Якщо є definition, але немає meanings - додаємо definition до meanings
  if (result.def && !result.mn) {
    result.mn = [result.def];
  } else if (
    result.def &&
    Array.isArray(result.mn) &&
    !result.mn.includes(result.def)
  ) {
    result.mn = [result.def, ...result.mn];
  }

  // Якщо є grammar та morphology - об'єднуємо
  if (result.g && result.m && !result.m.includes(result.g)) {
    result.m = `${result.m}\n${result.g}`;
  }

  // Забезпечуємо наявність strong коду
  if (!result.s && originalEntry.strong) {
    result.s = originalEntry.strong;
  }

  return result;
}

/**
 * Конвертує файл словника Strong
 */
function convertStrongsFile(filePath, originalData) {
  try {
    const result = {};

    // Якщо це об'єкт з декількома записами (G746, G1722, тощо)
    if (typeof originalData === "object" && !Array.isArray(originalData)) {
      Object.keys(originalData).forEach((key) => {
        const entry = originalData[key];
        const converted = convertStrongEntry(entry);

        // Якщо в записі немає strong коду, додаємо його з ключа
        if (!converted.s && (key.startsWith("G") || key.startsWith("H"))) {
          converted.s = key;
        }

        result[key] = converted;
      });
    }
    // Якщо це масив або інший формат
    else if (Array.isArray(originalData)) {
      originalData.forEach((entry, index) => {
        const converted = convertStrongEntry(entry);
        const key = converted.s || `entry_${index}`;
        result[key] = converted;
      });
    }
    // Якщо це один запис
    else if (typeof originalData === "object") {
      const converted = convertStrongEntry(originalData);
      const fileName = path.basename(filePath, ".json");
      const key = converted.s || fileName;
      result[key] = converted;
    }

    return result;
  } catch (error) {
    console.error(
      `❌ Помилка конвертації Strong файлу ${filePath}:`,
      error.message
    );
    return originalData;
  }
}

/**
 * Конвертує вірш перекладу або оригіналу
 */
function convertVerse(verse) {
  if (!verse || typeof verse !== "object") return verse;

  const converted = {
    v: verse.v || verse.verse || 1,
  };

  // Конвертуємо слова
  const words = verse.words || verse.ws || [];
  if (Array.isArray(words) && words.length > 0) {
    converted.ws = words.map((word) => {
      const convertedWord = {};

      // Конвертуємо основні поля
      if (word.word !== undefined) convertedWord.w = word.word;
      if (word.w !== undefined) convertedWord.w = word.w;

      if (word.strong !== undefined) convertedWord.s = word.strong;
      if (word.s !== undefined) convertedWord.s = word.s;

      // Додаткові поля для оригіналів
      if (word.lemma !== undefined) convertedWord.l = word.lemma;
      if (word.l !== undefined) convertedWord.l = word.l;

      if (word.morph !== undefined) convertedWord.m = word.morph;
      if (word.m !== undefined) convertedWord.m = word.m;

      return convertedWord;
    });
  }

  return converted;
}

/**
 * Конвертує файл перекладу або оригіналу
 */
function convertTranslationOrOriginal(filePath, fileData, fileInfo) {
  try {
    let verses = [];

    // Якщо це масив (старий формат)
    if (Array.isArray(fileData)) {
      verses = fileData.map(convertVerse);
    }
    // Якщо це об'єкт з метаданими (можливо вже конвертований)
    else if (fileData._meta && fileData.verses) {
      // Вже конвертований, переконвертуємо verses
      verses = Array.isArray(fileData.verses)
        ? fileData.verses.map(convertVerse)
        : [convertVerse(fileData.verses)];
    }
    // Якщо це порожній об'єкт або інший формат
    else if (typeof fileData === "object") {
      console.log(`⚠️  Невідомий формат у ${filePath}, спробуємо обробити`);
      // Спробуємо знайти вірші
      const values = Object.values(fileData);
      if (values.length > 0 && Array.isArray(values[0])) {
        verses = values[0].map(convertVerse);
      }
    }

    return verses;
  } catch (error) {
    console.error(`❌ Помилка конвертації ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Додає метадані до даних перекладів/оригіналів
 */
function addMetadata(verses, fileInfo, originalPath) {
  if (!Array.isArray(verses)) return verses;

  const metadata = {
    converter: "under-word-converter-v2",
    version: 2,
    converted: new Date().toISOString(),
    info: {
      translation: fileInfo.translation,
      type: fileInfo.type,
      book: fileInfo.book,
      chapter: fileInfo.chapter,
      language: fileInfo.language,
      name: fileInfo.translation.toUpperCase(),
      hasStrongs:
        fileInfo.type === "original" ||
        ["utt", "ubt", "kjv"].includes(fileInfo.translation),
      hasMorphology: ["lxx", "gnt"].includes(fileInfo.translation),
      hasLemma: ["lxx", "gnt"].includes(fileInfo.translation),
      originalPath: fileInfo.relativePath,
    },
  };

  return {
    _meta: metadata,
    verses: verses,
  };
}

/**
 * Конвертує один файл
 */
function convertFile(filePath) {
  // Перевіряємо, чи потрібно обробляти цей файл
  if (!shouldProcessFile(filePath)) {
    console.log(
      `⏭️  Пропускаємо: ${path.relative(CONFIG.sourceDir, filePath)}`
    );
    return { skipped: true };
  }

  const relativePath = path.relative(CONFIG.sourceDir, filePath);
  console.log(`📖 Читаємо: ${relativePath}`);

  // Читаємо файл
  const readResult = readJsonFile(filePath);
  if (!readResult.success) {
    return { success: false, error: readResult.error };
  }

  if (readResult.empty) {
    console.log(`⚠️  Файл порожній: ${relativePath}`);

    const fileInfo = getFileInfo(filePath);
    const fileType = getFileType(filePath);

    // Для порожніх файлів створюємо відповідну структуру
    let emptyData;

    if (fileType === "strongs") {
      // Для словників - порожній об'єкт
      emptyData = {};
    } else {
      // Для перекладів/оригіналів - структура з метаданими
      emptyData = {
        _meta: {
          converter: "under-word-converter-v2",
          version: 2,
          converted: new Date().toISOString(),
          info: {
            ...fileInfo,
            isEmpty: true,
          },
        },
        verses: [],
      };
    }

    const outputPath = path.join(CONFIG.outputDir, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(
      outputPath,
      CONFIG.minifyJson
        ? JSON.stringify(emptyData)
        : JSON.stringify(emptyData, null, 2)
    );

    return { success: true, isEmpty: true };
  }

  const fileData = readResult.data;
  const fileInfo = getFileInfo(filePath);
  const fileType = getFileType(filePath);

  // Конвертуємо залежно від типу
  let convertedData;

  switch (fileType) {
    case "strongs":
      // Strong файли - конвертуємо, але БЕЗ метаданих
      convertedData = convertStrongsFile(filePath, fileData);
      break;

    case "originals":
    case "translation":
      // Переклади та оригінали - конвертуємо з метаданими
      const verses = convertTranslationOrOriginal(filePath, fileData, fileInfo);
      convertedData = addMetadata(verses, fileInfo, filePath);
      break;

    case "core":
      // Core файли - просто конвертуємо ключі
      convertedData = compressObject(fileData, baseKeyMappings.fullToShort);
      break;

    default:
      // Інші файли - конвертуємо ключі
      convertedData = compressObject(fileData, baseKeyMappings.fullToShort);
  }

  // Записуємо результат
  const outputPath = path.join(CONFIG.outputDir, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const outputContent = CONFIG.minifyJson
    ? JSON.stringify(convertedData)
    : JSON.stringify(convertedData, null, 2);

  fs.writeFileSync(outputPath, outputContent);

  // Статистика
  const originalSize = Buffer.byteLength(JSON.stringify(fileData), "utf8");
  const compressedSize = Buffer.byteLength(outputContent, "utf8");
  const savings =
    originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : "0.0";

  console.log(`   ✅ Конвертовано`);
  console.log(
    `      📊 ${(originalSize / 1024).toFixed(1)}KB → ${(
      compressedSize / 1024
    ).toFixed(1)}KB (економія ${savings}%)`
  );

  // Додаткова інформація про файл
  if (fileType === "strongs" && convertedData) {
    const firstKey = Object.keys(convertedData)[0];
    if (firstKey) {
      const entry = convertedData[firstKey];
      const fields = Object.keys(entry).join(", ");
      console.log(`      🏷️  Структура: ${fields}`);
    }
  } else if (
    (fileType === "originals" || fileType === "translation") &&
    convertedData.verses
  ) {
    const verseCount = convertedData.verses.length;
    const wordCount = convertedData.verses.reduce(
      (sum, verse) => sum + (verse.ws ? verse.ws.length : 0),
      0
    );
    console.log(`      📖 ${verseCount} віршів, ${wordCount} слів`);
  }

  return {
    success: true,
    originalSize,
    compressedSize,
    fileType,
  };
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
 * Обробляє директорію
 */
function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Директорія не існує: ${dirPath}`);
    return { processed: 0, errors: 0 };
  }

  const stats = {
    processed: 0,
    errors: 0,
    totalSize: 0,
    totalCompressed: 0,
    strongsFiles: 0,
    originalsFiles: 0,
    translationFiles: 0,
  };

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);

    try {
      if (fs.statSync(fullPath).isDirectory()) {
        // Рекурсивно обробляємо піддиректорію
        const subStats = processDirectory(fullPath);
        stats.processed += subStats.processed;
        stats.errors += subStats.errors;
        stats.totalSize += subStats.totalSize;
        stats.totalCompressed += subStats.totalCompressed;
        stats.strongsFiles += subStats.strongsFiles;
        stats.originalsFiles += subStats.originalsFiles;
        stats.translationFiles += subStats.translationFiles;
      } else if (item.endsWith(".json")) {
        // Обробляємо JSON файл
        const result = convertFile(fullPath);

        if (!result.skipped) {
          if (result.success) {
            stats.processed++;
            stats.totalSize += result.originalSize || 0;
            stats.totalCompressed += result.compressedSize || 0;

            // Лічильники за типами
            if (result.fileType === "strongs") stats.strongsFiles++;
            else if (result.fileType === "originals") stats.originalsFiles++;
            else if (result.fileType === "translation")
              stats.translationFiles++;
          } else {
            stats.errors++;
            console.error(`❌ Помилка: ${fullPath}`, result.error);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Помилка обробки ${fullPath}:`, error.message);
      stats.errors++;
    }
  }

  return stats;
}

/**
 * Створює резервну копію
 */
function createBackup() {
  if (!CONFIG.createBackup) return true;

  try {
    console.log("💾 Створюємо резервну копію...");

    if (fs.existsSync(CONFIG.backupDir)) {
      console.log("   ⚠️  Видаляємо стару резервну копію...");
      fs.rmSync(CONFIG.backupDir, { recursive: true, force: true });
    }

    fs.cpSync(CONFIG.sourceDir, CONFIG.backupDir, { recursive: true });
    console.log("   ✅ Резервна копія створена");
    return true;
  } catch (error) {
    console.error("❌ Помилка створення резервної копії:", error.message);
    return false;
  }
}

/**
 * Створює README файл
 */
function createReadme(stats) {
  const readmePath = path.join(CONFIG.outputDir, "README.md");

  const totalSavings =
    stats.totalSize > 0
      ? (
          ((stats.totalSize - stats.totalCompressed) / stats.totalSize) *
          100
        ).toFixed(1)
      : "0.0";

  const readmeContent = `# Конвертовані JSON файли

## Статистика конвертації
- Загальна кількість файлів: ${stats.processed}
- Файлів словників Strong: ${stats.strongsFiles}
- Файлів оригіналів: ${stats.originalsFiles}
- Файлів перекладів: ${stats.translationFiles}
- Файлів з помилками: ${stats.errors}
- Загальний розмір до: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB
- Загальний розмір після: ${(stats.totalCompressed / 1024 / 1024).toFixed(2)} MB
- Економія: ${totalSavings}%

## Формати файлів

### 1. Переклади та оригінали
\`\`\`json
{
  "_meta": {
    "converter": "under-word-converter-v2",
    "version": 2,
    "converted": "2024-01-01T12:00:00.000Z",
    "info": {
      "translation": "lxx",
      "type": "original",
      "book": "GEN",
      "chapter": "1",
      "language": "greek",
      "name": "LXX",
      "hasStrongs": true,
      "hasMorphology": true,
      "hasLemma": true,
      "originalPath": "originals/lxx/OldT/GEN/gen1_lxx.json"
    }
  },
  "verses": [
    {
      "v": 1,
      "ws": [
        { "w": "Ἐν", "s": "G1722", "l": "ἐν", "m": "PREP" }
      ]
    }
  ]
}
\`\`\`

### 2. Словники Strong (БЕЗ метаданих)
\`\`\`json
{
  "G746": {
    "s": "G746",
    "w": "ἀρχή",
    "t": "archē",
    "tr": "початок, принцип",
    "m": "іменник, жіночий рід, однина",
    "mn": ["початок, принцип"]
  }
}
\`\`\`

### 3. Core файли
\`\`\`json
{
  "lxx": {
    "ot": [
      {
        "g": "П'ятикнижжя",
        "b": [
          { "c": "GEN", "n": "Буття", "ch": 50 }
        ]
      }
    ]
  }
}
\`\`\`

## Використані скорочення
| Повний ключ | Скорочений | Приклад |
|-------------|------------|---------|
| word | w | "Ἐν" |
| strong | s | "G1722" |
| verse | v | 1 |
| words | ws | масив слів |
| lemma | l | "ἐν" |
| morph | m | "PREP" |
| translit | t | "archē" |
| translation | tr | "початок" |
| morphology | m | "іменник..." |
| definition | def | "початок, принцип" |
| meanings | mn | ["початок", "принцип"] |
| hebrew_equiv | he | "H7225" |
| usages | u | ["Бут. 1:1"] |
| grammar | g | "іменник..." |

## Примітки
- Оригінальні файли збережено в: \`${CONFIG.backupDir}\`
- Словники Strong НЕ містять метадані
- Для перевірки: \`node scripts/verifyConversion.js\`

## Дата конвертації
${new Date().toISOString()}
`;

  fs.writeFileSync(readmePath, readmeContent, "utf8");
  console.log("📝 README.md створено");
}

/**
 * Основна функція
 */
async function main() {
  console.log("🚀 ЗАПУСК КОНВЕРТАЦІЇ JSON ФАЙЛІВ");
  console.log("=".repeat(50));
  console.log(`Джерело: ${CONFIG.sourceDir}`);
  console.log(`Результат: ${CONFIG.outputDir}`);
  console.log(`Переклади: ${CONFIG.translationsToConvert.join(", ")}`);
  console.log(`Оригінали: ${CONFIG.originalsToConvert.join(", ")}`);
  console.log(`Обробляти Strong: ${CONFIG.processStrongs ? "Так" : "Ні"}`);
  console.log("=".repeat(50));

  // Перевірка директорій
  if (!fs.existsSync(CONFIG.sourceDir)) {
    console.error(`❌ Джерельна директорія не існує: ${CONFIG.sourceDir}`);
    process.exit(1);
  }

  // Резервна копія
  if (CONFIG.createBackup) {
    createBackup();
  }

  // Створюємо вихідну директорію
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Статистика
  const allStats = {
    processed: 0,
    errors: 0,
    totalSize: 0,
    totalCompressed: 0,
    strongsFiles: 0,
    originalsFiles: 0,
    translationFiles: 0,
  };

  // Обробляємо переклади
  for (const translation of CONFIG.translationsToConvert) {
    const transPath = path.join(CONFIG.sourceDir, "translations", translation);

    if (fs.existsSync(transPath)) {
      console.log(`\n🎯 Конвертуємо переклад: ${translation.toUpperCase()}`);
      const stats = processDirectory(transPath);

      allStats.processed += stats.processed;
      allStats.errors += stats.errors;
      allStats.totalSize += stats.totalSize;
      allStats.totalCompressed += stats.totalCompressed;
      allStats.translationFiles += stats.translationFiles;
    } else {
      console.log(`⏭️  Переклад ${translation} не знайдено`);
    }
  }

  // Обробляємо оригінали
  for (const original of CONFIG.originalsToConvert) {
    const origPath = path.join(CONFIG.sourceDir, "originals", original);

    if (fs.existsSync(origPath)) {
      console.log(`\n🎯 Конвертуємо оригінал: ${original.toUpperCase()}`);
      const stats = processDirectory(origPath);

      allStats.processed += stats.processed;
      allStats.errors += stats.errors;
      allStats.totalSize += stats.totalSize;
      allStats.totalCompressed += stats.totalCompressed;
      allStats.originalsFiles += stats.originalsFiles;
    } else {
      console.log(`⏭️  Оригінал ${original} не знайдено`);
    }
  }

  // Обробляємо словники Strong
  if (CONFIG.processStrongs) {
    const strongsPath = path.join(CONFIG.sourceDir, "strongs");

    if (fs.existsSync(strongsPath)) {
      console.log("\n📚 Конвертуємо словники Strong...");
      const stats = processDirectory(strongsPath);

      allStats.processed += stats.processed;
      allStats.errors += stats.errors;
      allStats.totalSize += stats.totalSize;
      allStats.totalCompressed += stats.totalCompressed;
      allStats.strongsFiles += stats.strongsFiles;
    } else {
      console.log("⏭️  Папка словників Strong не знайдена");
    }
  }

  // Обробляємо кореневі файли
  console.log("\n🏗️  Конвертуємо core файли та інші...");
  const rootFiles = fs
    .readdirSync(CONFIG.sourceDir)
    .filter(
      (file) =>
        file.endsWith(".json") &&
        shouldProcessFile(path.join(CONFIG.sourceDir, file))
    );

  for (const file of rootFiles) {
    const filePath = path.join(CONFIG.sourceDir, file);
    const result = convertFile(filePath);

    if (!result.skipped) {
      if (result.success) {
        allStats.processed++;
        allStats.totalSize += result.originalSize || 0;
        allStats.totalCompressed += result.compressedSize || 0;
      } else {
        allStats.errors++;
      }
    }
  }

  // Створюємо README
  createReadme(allStats);

  // Підсумки
  console.log("\n" + "=".repeat(50));
  console.log("✅ КОНВЕРТАЦІЮ ЗАВЕРШЕНО");
  console.log("=".repeat(50));
  console.log(`📊 Статистика:`);
  console.log(`   Файлів: ${allStats.processed}`);
  console.log(`   Словників Strong: ${allStats.strongsFiles}`);
  console.log(`   Оригіналів: ${allStats.originalsFiles}`);
  console.log(`   Перекладів: ${allStats.translationFiles}`);
  console.log(`   Помилок: ${allStats.errors}`);

  if (allStats.totalSize > 0) {
    const savings = (
      ((allStats.totalSize - allStats.totalCompressed) / allStats.totalSize) *
      100
    ).toFixed(1);
    console.log(`   Економія: ${savings}%`);
    console.log(
      `   Розмір: ${(allStats.totalSize / 1024 / 1024).toFixed(2)}MB → ${(
        allStats.totalCompressed /
        1024 /
        1024
      ).toFixed(2)}MB`
    );
  }

  console.log(`\n📁 Результат: ${CONFIG.outputDir}`);
  console.log(`📝 README: ${path.join(CONFIG.outputDir, "README.md")}`);

  if (CONFIG.preserveOriginals) {
    console.log(`\n💾 Оригінали: ${CONFIG.sourceDir}`);
    console.log(`💾 Резерв: ${CONFIG.backupDir}`);
  }
}

// Запуск
main().catch((error) => {
  console.error("❌ Критична помилка:", error);
  process.exit(1);
});
