// src/utils/dataLoader.js
// import { jsonAdapter } from "./jsonAdapter";

// export const loadData = async (path, useCompressed = true) => {
//   // Автоматично вибираємо шлях
//   const basePath = useCompressed ? "/data_compressed" : "/data";
//   const url = `${basePath}/${path}`;

//   console.log(`📥 Loading: ${url}`);

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       // Якщо не знайшли, спробуємо інший формат
//       const altPath = useCompressed ? "/data" : "/data_compressed";
//       const altUrl = `${altPath}/${path}`;
//       console.log(`⚠️  Trying alternative: ${altUrl}`);

//       const altResponse = await fetch(altUrl);
//       if (!altResponse.ok) {
//         throw new Error(`Failed to load from both paths`);
//       }

//       const altData = await altResponse.json();
//       return jsonAdapter(altData);
//     }

//     const data = await response.json();
//     return jsonAdapter(data);
//   } catch (error) {
//     console.error(`❌ Failed to load ${path}:`, error);
//     throw error;
//   }
// };

// // Спеціалізовані функції
// export const loadTranslation = async (book, chapter, version) => {
//   const path = `translations/${version.toLowerCase()}/OldT/${book}/${book.toLowerCase()}${chapter}_${version.toLowerCase()}.json`;
//   return loadData(path);
// };

// export const loadStrongsDict = async (strongCode) => {
//   const path = `strongs/${strongCode}.json`;
//   return loadData(path);
// };

// export const loadOriginal = async (book, chapter, version) => {
//   const path = `originals/${version.toLowerCase()}/OldT/${book}/${book.toLowerCase()}${chapter}_${version.toLowerCase()}.json`;
//   return loadData(path);
// };

// ---------------------------------------------

// src/utils/dataLoader.js
import { jsonAdapter } from "./jsonAdapter";
import { normalizeChapter, normalizeStrongEntry } from "./normalizeData";

/**
 * Знаходить файл серед можливих шляхів
 */
// export const findFile = async (relativePath) => {
//   const possiblePaths = [
//     `/data_compressed/${relativePath}`,
//     `/data/${relativePath}`,
//     `/${relativePath}`,
//     `/data_compressed/${relativePath.replace(/\.json$/, "")}.json`,
//     `/data/${relativePath.replace(/\.json$/, "")}.json`,
//   ];

//   console.log(`🔍 Пошук: ${relativePath}`);

//   for (const url of possiblePaths) {
//     try {
//       console.log(`   ➡️  Спробуємо: ${url}`);
//       const response = await fetch(url);

//       if (response.ok) {
//         const data = await response.json();
//         console.log(`   ✅ Знайдено: ${url}`);
//         return { url, data };
//       }

//       console.log(`   ❌ Не знайдено (HTTP ${response.status})`);
//     } catch (error) {
//       console.log(`   ❌ Помилка: ${error.message}`);
//     }
//   }

//   throw new Error(`Файл не знайдено: ${relativePath}`);
// };

export const findFile = async (relativePath) => {
  const possiblePaths = [
    `/data_compressed/${relativePath}`,
    `/data/${relativePath}`,
  ];

  for (const url of possiblePaths) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return { url, data };
      }
    } catch (error) {
      continue;
    }
  }

  return null; // Не кидаємо помилку, повертаємо null
};

/**
 * Завантажує переклад
 */
// export const loadTranslation = async (book, chapter, version) => {
//   const verLower = version.toLowerCase();
//   const bookLower = book.toLowerCase();

//   // Різні можливі відносні шляхи
//   const possibleRelativePaths = [
//     `translations/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`,
//     `translations/${verLower}/OldT/${book}/${bookLower}${chapter}.json`,
//     `translations/${verLower}/${book}/${bookLower}${chapter}.json`,
//     `translations/${verLower}/${book}/${chapter}.json`,
//   ];

//   for (const relativePath of possibleRelativePaths) {
//     try {
//       const { data } = await findFile(relativePath);
//       const adapted = jsonAdapter(data);
//       return normalizeChapter(adapted);
//     } catch (error) {
//       continue; // Спробуємо наступний шлях
//     }
//   }

//   throw new Error(`Переклад ${version} ${book}:${chapter} не знайдено`);
// };

export const loadTranslation = async (book, chapter, version) => {
  const verLower = version.toLowerCase();
  const bookLower = book.toLowerCase();

  const relativePath = `translations/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`;
  const result = await findFile(relativePath);

  if (!result) {
    throw new Error(`Файл не знайдено: ${relativePath}`);
  }

  return jsonAdapter(result.data);
};

/**
 * Завантажує оригінал (LXX/THOT)
 */
// export const loadOriginal = async (book, chapter, version) => {
//   const verLower = version.toLowerCase();
//   const bookLower = book.toLowerCase();

//   const possibleRelativePaths = [
//     `originals/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`,
//     `originals/${verLower}/OldT/${book}/${bookLower}${chapter}.json`,
//     `originals/${verLower}/${book}/${bookLower}${chapter}.json`,
//     `originals/${verLower}/${book}/${chapter}.json`,
//   ];

//   for (const relativePath of possibleRelativePaths) {
//     try {
//       const { data } = await findFile(relativePath);
//       const adapted = jsonAdapter(data);
//       return normalizeChapter(adapted);
//     } catch (error) {
//       continue;
//     }
//   }

//   throw new Error(`Оригінал ${version} ${book}:${chapter} не знайдено`);
// };

export const loadOriginal = async (book, chapter, version) => {
  const verLower = version.toLowerCase();
  const bookLower = book.toLowerCase();

  const relativePath = `originals/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`;
  const result = await findFile(relativePath);

  if (!result) {
    throw new Error(`Файл не знайдено: ${relativePath}`);
  }

  return jsonAdapter(result.data);
};

/**
 * Завантажує словник Strong
 */
export const loadStrong = async (strongCode) => {
  const possibleRelativePaths = [
    `strongs/${strongCode}.json`,
    `strongs/${strongCode.toLowerCase()}.json`,
    `strongs/${strongCode.toUpperCase()}.json`,
  ];

  for (const relativePath of possibleRelativePaths) {
    try {
      const { data } = await findFile(relativePath);
      return normalizeStrongEntry(data);
    } catch (error) {
      continue;
    }
  }

  throw new Error(`Словник ${strongCode} не знайдено`);
};

/**
 * Сканує папку на наявність файлів
 */
export const scanDirectory = async (directory) => {
  try {
    // Це працює тільки з папками, які мають index.json або можна отримати список
    const response = await fetch(directory);

    if (!response.ok) {
      return { exists: false, files: [] };
    }

    // Спрощений підхід - перевіряємо конкретні файли
    const testFiles = [
      `${directory}/test.json`,
      `${directory}/index.json`,
      `${directory}/data.json`,
    ];

    const files = [];

    for (const testFile of testFiles) {
      try {
        const testResponse = await fetch(testFile);
        if (testResponse.ok) {
          files.push(testFile);
        }
      } catch (error) {
        // Ігноруємо помилки окремих файлів
      }
    }

    return { exists: true, files };
  } catch (error) {
    return { exists: false, files: [], error: error.message };
  }
};
