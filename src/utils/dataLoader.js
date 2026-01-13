// src/utils/dataLoader.js 23.12.25
import { jsonAdapter, getMetadata } from "./jsonAdapter";
import { normalizeStrongEntry } from "./normalizeData";

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

  return null;
};

export const loadTranslation = async (book, chapter, version) => {
  const verLower = version.toLowerCase();
  const bookLower = book.toLowerCase();

  // Спробуємо спочатку скорочений формат
  const relativePath = `translations/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`;
  const result = await findFile(relativePath);

  if (!result) {
    throw new Error(`Файл не знайдено: ${relativePath}`);
  }

  // Адаптуємо дані
  const adapted = jsonAdapter(result.data);

  // Додаємо метадані про джерело
  if (Array.isArray(adapted)) {
    adapted._source = result.url;
    adapted._type = "translation";
    adapted._version = version;

    // Зберігаємо оригінальні метадані
    const meta = getMetadata(result.data);
    if (meta) {
      adapted._meta = meta;
    }
  }

  return adapted;
};

export const loadOriginal = async (book, chapter, version) => {
  const verLower = version.toLowerCase();
  const bookLower = book.toLowerCase();

  const relativePath = `originals/${verLower}/OldT/${book}/${bookLower}${chapter}_${verLower}.json`;
  const result = await findFile(relativePath);

  if (!result) {
    throw new Error(`Файл не знайдено: ${relativePath}`);
  }

  const adapted = jsonAdapter(result.data);

  // Додаємо метадані
  if (Array.isArray(adapted)) {
    adapted._source = result.url;
    adapted._type = "original";
    adapted._version = version;

    const meta = getMetadata(result.data);
    if (meta) {
      adapted._meta = meta;
    }
  }

  return adapted;
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
      const result = await findFile(relativePath);
      if (result) {
        const adapted = jsonAdapter(result.data);
        const normalized = normalizeStrongEntry(adapted);

        // Додаємо метадані
        normalized._source = result.url;
        normalized._strongCode = strongCode;

        const meta = getMetadata(result.data);
        if (meta) {
          normalized._meta = meta;
        }

        return normalized;
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error(`Словник ${strongCode} не знайдено`);
};

/**
 * Завантажує метадані файлу
 */
export const loadFileMetadata = async (relativePath) => {
  const result = await findFile(relativePath);

  if (!result) {
    return null;
  }

  return getMetadata(result.data);
};
