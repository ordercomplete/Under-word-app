// Якщо використовуєте Express, додайте в server.js:
app.post("/api/convert-files", async (req, res) => {
  try {
    const { exec } = require("child_process");

    exec("node scripts/convertTranslations.js", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
          stderr,
          stdout,
        });
      }

      res.json({
        success: true,
        message: "Конвертацію завершено",
        output: stdout,
        warnings: stderr,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
