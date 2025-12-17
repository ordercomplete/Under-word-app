// scripts/config-template.js
module.exports = {
  // Які переклади конвертувати
  translationsToConvert: ['utt', 'ubt', 'ogienko', 'khomenko', 'siryy'],
  
  // Шляхи
  sourceDir: 'public/data',
  outputDir: 'public/data_compressed',
  
  // Налаштування
  createBackup: true,
  backupDir: 'public/data_backup',
  minifyJson: true,
  preserveOriginals: true,
  
  // Налаштування словників
  processStrongs: true,
  
  // Додаткові мапи (опційно)
  customMappings: {
    // Додайте власні мапи тут
  }
};
