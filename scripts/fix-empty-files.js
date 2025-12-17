#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DATA_DIR = "public/data";

function fixEmptyFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8").trim();

  if (!content) {
    console.log(`📝 Виправляємо порожній файл: ${filePath}`);

    // Визначаємо тип файлу за шляхом
    const relativePath = path.relative(DATA_DIR, filePath);
    let fixedData = {};

    if (relativePath.includes("books.json")) {
      fixedData = { books: [] };
    } else if (relativePath.includes("chapters.json")) {
      fixedData = { chapters: {} };
    } else if (relativePath.includes("core_")) {
      const translation = relativePath.match(/core_([^.]+)\.json/)?.[1];
      fixedData = {
        name: translation || "Unknown",
        books: {},
      };
    } else {
      fixedData = { empty: true, fixed: new Date().toISOString() };
    }

    fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
    return true;
  }

  return false;
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);
  let fixedCount = 0;

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (item.endsWith(".json")) {
      if (fixEmptyFile(fullPath)) {
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

console.log("🔧 Виправлення порожніх JSON файлів...");
const fixed = processDirectory(DATA_DIR);
console.log(`✅ Виправлено ${fixed} файлів`);
