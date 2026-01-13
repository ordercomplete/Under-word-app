const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();

// Збільшуємо ліміти для конкретного маршруту
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ limit: "50mb", extended: true }));

router.post("/convert", (req, res) => {
  console.log("🚀 Запуск конвертації через API...");

  // Додаємо обробку великих запитів
  res.setTimeout(300000, () => {
    // 5 хвилин таймаут
    console.log("⏰ Таймаут конвертації");
  });

  const scriptPath = path.join(__dirname, "../scripts/convertTranslations.js");

  exec(
    `node "${scriptPath}"`,
    { maxBuffer: 1024 * 1024 * 10 },
    (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Помилка конвертації:", error);
        return res.status(500).json({
          success: false,
          error: error.message,
          stderr: stderr.toString(),
        });
      }

      console.log("✅ Конвертацію завершено");

      // Парсимо результат
      const lines = stdout.toString().split("\n");
      const stats = {
        filesProcessed: 0,
        savings: 0,
        errors: [],
      };

      lines.forEach((line) => {
        if (line.includes("Файлів оброблено:")) {
          const match = line.match(/\d+/);
          if (match) stats.filesProcessed = parseInt(match[0]);
        }
        if (line.includes("Економія:")) {
          const match = line.match(/[\d.]+/);
          if (match) stats.savings = parseFloat(match[0]);
        }
        if (line.includes("Помилок:")) {
          const match = line.match(/\d+/);
          if (match) stats.errorCount = parseInt(match[0]);
        }
      });

      res.json({
        success: true,
        message: "Конвертацію завершено",
        ...stats,
        output: stdout.toString().substring(0, 2000), // Обмежуємо вивід
        timestamp: new Date().toISOString(),
      });
    }
  );
});

module.exports = router;
