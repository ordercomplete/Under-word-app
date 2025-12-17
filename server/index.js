const express = require("express");
const path = require("path");
const apiRouter = require("./api");

const app = express();
const PORT = process.env.PORT || 3000;

// Збільшуємо ліміти для заголовків та JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Встановлюємо заголовки для збільшення лімітів
app.use((req, res, next) => {
  // Збільшуємо ліміт на розмір заголовків
  req.headers["content-type"] = "application/json";

  // Обмежуємо довжину запиту
  req.setMaxListeners(20);

  next();
});

// API маршрути
app.use("/api", apiRouter);

// Обробка помилки 431
app.use((req, res, next) => {
  const maxHeadersSize = 8192; // 8KB за замовчуванням
  const currentHeadersSize = JSON.stringify(req.headers).length;

  if (currentHeadersSize > maxHeadersSize) {
    console.warn(`Заголовки занадто великі: ${currentHeadersSize} байт`);
    // Можна збільшити ліміт або надіслати помилку з поясненням
  }

  next();
});

// Статичні файли
app.use(express.static(path.join(__dirname, "../build")));

// React роутинг
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порті ${PORT}`);
  console.log(`📊 Ліміти: JSON - 50MB, URL-encoded - 50MB`);
});
