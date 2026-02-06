#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const testFiles = [
  'originals/lxx/OldT/GEN/gen1_lxx.json',
  'originals/thot/OldT/GEN/gen1_thot.json',
  'translations/utt/OldT/GEN/gen1_utt.json',
  'strongs/G746.json',
  'core.json'
];

console.log('🔍 Перевірка конвертації JSON файлів\n');

let allPassed = true;
const results = [];

testFiles.forEach(testFile => {
  const filePath = path.join(__dirname, '..', 'public', 'data_compressed', testFile);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${testFile}: Файл не знайдено`);
      results.push({ file: testFile, status: 'missing' });
      allPassed = false;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Загальна перевірка
    if (!data) {
      console.log(`❌ ${testFile}: Порожні дані`);
      results.push({ file: testFile, status: 'empty' });
      allPassed = false;
      return;
    }
    
    // Перевірка метаданих (якщо не словник)
    if (!testFile.includes('strongs/') && !data._meta) {
      console.log(`⚠️  ${testFile}: Відсутні метадані`);
      results.push({ file: testFile, status: 'no-meta' });
    } else if (data._meta) {
      console.log(`✅ ${testFile}: Метадані: ${data._meta.info?.translation || 'N/A'}`);
      results.push({ file: testFile, status: 'ok', meta: data._meta.info });
    }
    
    // Перевірка структури
    if (testFile.includes('originals/') || testFile.includes('translations/')) {
      const verses = data.verses || data;
      if (!Array.isArray(verses)) {
        console.log(`❌ ${testFile}: Не масив віршів`);
        allPassed = false;
      } else if (verses.length > 0) {
        const firstVerse = verses[0];
        if (!firstVerse.v || !firstVerse.ws) {
          console.log(`❌ ${testFile}: Неправильна структура вірша`);
          allPassed = false;
        } else {
          console.log(`   ↳ Віршів: ${verses.length}, слів у першому: ${firstVerse.ws?.length || 0}`);
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ ${testFile}: Помилка: ${error.message}`);
    results.push({ file: testFile, status: 'error', error: error.message });
    allPassed = false;
  }
});

console.log('\n📊 Підсумок:');
results.forEach(result => {
  const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';
  console.log(`${icon} ${result.file}: ${result.status}`);
});

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 Всі перевірки пройдено успішно!');
} else {
  console.log('⚠️  Знайдено проблеми з конвертацією');
  process.exit(1);
}
