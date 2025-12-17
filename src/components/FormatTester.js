// src/components/FormatTester.js
// import React, { useState, useEffect } from "react";
// import { jsonAdapter, debugFormat } from "../utils/jsonAdapter";
// import { loadStrongEntry } from "../utils/loadStrong";
// import { loadChapter } from "../utils/loadChapter";
// import JSON_CONFIG from "../config/jsonConfig";

// const FormatTester = () => {
//   const [testResults, setTestResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const runTests = async () => {
//     setLoading(true);
//     setTestResults([]);

//     const results = [];

//     try {
//       // Тест 1: Завантаження словника
//       results.push({ test: "Тест словника G746", status: "running" });
//       const strongResult = await loadStrongEntry("G746");
//       results.push({
//         test: "Тест словника G746",
//         status: "success",
//         details: `Завантажено: ${strongResult.word}, формат: ${strongResult._format}`,
//       });

//       // Тест 2: Завантаження глави
//       results.push({ test: "Тест глави Буття 1 (UTT)", status: "running" });
//       const chapterResult = await loadChapter("GEN", 1, "UTT");
//       results.push({
//         test: "Тест глави Буття 1 (UTT)",
//         status: "success",
//         details: `Завантажено віршів: ${chapterResult?.length || 0}`,
//       });

//       // Тест 3: Перевірка формату
//       results.push({ test: "Перевірка адаптера JSON", status: "running" });

//       const testData = {
//         v: 1,
//         ws: [{ w: "Тест", s: "G0001" }],
//       };

//       const adapted = jsonAdapter([testData]);
//       results.push({
//         test: "Перевірка адаптера JSON",
//         status: "success",
//         details: `Адаптовано: ${debugFormat(adapted)}`,
//       });
//     } catch (error) {
//       results.push({
//         test: "Тест завершено з помилкою",
//         status: "error",
//         details: error.message,
//       });
//     }

//     setTestResults(results);
//     setLoading(false);
//   };

//   const toggleFormat = () => {
//     JSON_CONFIG.toggleFormat();
//   };

//   return (
//     <div className="format-tester p-3 border rounded">
//       <h5>Тестування JSON форматів</h5>

//       <div className="mb-3">
//         <button
//           className="btn btn-primary me-2"
//           onClick={runTests}
//           disabled={loading}
//         >
//           {loading ? "Тестування..." : "Запустити тести"}
//         </button>

//         <button className="btn btn-secondary" onClick={toggleFormat}>
//           Перемкнути на{" "}
//           {JSON_CONFIG.useCompressedFormat ? "повний" : "скорочений"} формат
//         </button>
//       </div>

//       <div className="current-config mb-3">
//         <strong>Поточна конфігурація:</strong>
//         <ul className="list-unstyled">
//           <li>
//             Формат: {JSON_CONFIG.useCompressedFormat ? "скорочений" : "повний"}
//           </li>
//           <li>Шлях: {JSON_CONFIG.dataPath}</li>
//         </ul>
//       </div>

//       {testResults.length > 0 && (
//         <div className="test-results">
//           <h6>Результати тестування:</h6>
//           <ul className="list-unstyled">
//             {testResults.map((result, i) => (
//               <li
//                 key={i}
//                 className={`mb-2 p-2 rounded ${
//                   result.status === "error"
//                     ? "bg-danger text-white"
//                     : result.status === "success"
//                     ? "bg-success text-white"
//                     : "bg-warning"
//                 }`}
//               >
//                 <strong>{result.test}</strong>: {result.status}
//                 {result.details && (
//                   <div className="small">{result.details}</div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FormatTester;

// -------------------------------------------------------------

// src/components/FormatTester.js
import React, { useState, useEffect } from "react";
import {
  jsonAdapter,
  debugFormat,
  isCompressedFormat,
} from "../utils/jsonAdapter";
import { loadStrongEntry } from "../utils/loadStrong";
import { loadChapter } from "../utils/loadChapter";
import "../styles/FormatTester.css";

const FormatTester = ({ lang }) => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formatInfo, setFormatInfo] = useState({
    currentFormat: "auto",
    dataPath: "/data",
    strongsFormat: "unknown",
  });
  // const [converting, setConverting] = useState(false);
  // const [conversionResult, setConversionResult] = useState(null);

  // Завантажуємо поточну конфігурацію
  useEffect(() => {
    const savedFormat = localStorage.getItem("jsonFormat");
    const currentFormat = savedFormat || "compressed";
    const dataPath =
      currentFormat === "compressed" ? "/data_compressed" : "/data";

    setFormatInfo({
      currentFormat,
      dataPath,
      strongsFormat: "not tested",
    });
  }, []);

  // Тест 1: Перевірка формату словника
  // const testStrongsFormat = async () => {
  //   try {
  //     const strongCode = "G746"; // Тестове слово
  //     console.log(`Testing Strong's format for ${strongCode}`);

  //     const entry = await loadStrongEntry(strongCode);

  //     return {
  //       success: true,
  //       format: entry._format || "unknown",
  //       word: entry.word,
  //       hasShortKeys: entry.w !== undefined,
  //       hasFullKeys: entry.word !== undefined,
  //       details: `Завантажено: "${entry.word}", формат: ${entry._format}`,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // };
  // В src/components/FormatTester.js замініть testStrongsFormat:
  const testStrongsFormat = async () => {
    try {
      console.log("🧪 Тест словника Strong...");

      const url = "/data_compressed/strongs/G746.json";
      console.log(`📥 Завантаження з: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
      }

      const rawData = await response.json();
      console.log("📦 Сирі дані отримані:", rawData);

      // Словники мають формат: { "G746": { ... } }
      const strongCode = "G746";
      let entry = rawData[strongCode];

      if (!entry && typeof rawData === "object") {
        // Можливо дані вже адаптовані або інший формат
        entry = rawData;
      }

      if (!entry) {
        throw new Error("Запис G746 не знайдено");
      }

      console.log("📝 Запис знайдено:", entry);
      console.log("🔑 Ключі запису:", Object.keys(entry));

      // Аналізуємо формат
      const hasShortKeys = entry.s !== undefined || entry.w !== undefined;
      const hasFullKeys =
        entry.strong !== undefined || entry.word !== undefined;

      const format = hasShortKeys ? "short" : hasFullKeys ? "full" : "unknown";
      const word = entry.word || entry.w || "немає";
      const strong = entry.strong || entry.s || "G746";

      return {
        success: true,
        format,
        word,
        strong,
        hasShortKeys,
        hasFullKeys,
        keys: Object.keys(entry),
        details: `✅ Завантажено: "${word}" (${strong}), формат: ${format}, ключі: ${Object.keys(
          entry
        ).join(", ")}`,
      };
    } catch (error) {
      console.error("❌ Помилка тесту словника:", error);
      return {
        success: false,
        error: error.message,
        details: `❌ Помилка: ${error.message}`,
      };
    }
  };

  // Тест 2: Перевірка формату перекладу
  //   const testTranslationFormat = async () => {
  //     try {
  //       const data = await loadChapter("GEN", 1, "UTT");

  //       if (!data || !Array.isArray(data)) {
  //         throw new Error("Невірні дані");
  //       }

  //       const firstVerse = data[0];
  //       const isShort = firstVerse.ws !== undefined || firstVerse.v !== undefined;
  //       const isFull =
  //         firstVerse.words !== undefined || firstVerse.verse !== undefined;

  //       return {
  //         success: true,
  //         format: isShort ? "short" : isFull ? "full" : "unknown",
  //         verses: data.length,
  //         hasWords: firstVerse.words || firstVerse.ws ? "так" : "ні",
  //         details: `Завантажено ${data.length} віршів, формат: ${
  //           isShort ? "скорочений" : "повний"
  //         }`,
  //       };
  //     } catch (error) {
  //       return {
  //         success: false,
  //         error: error.message,
  //       };
  //     }
  //   };

  // В src/components/FormatTester.js додайте цю функцію:
  const testLoadChapterImport = async () => {
    try {
      console.log("🔧 Тестування імпорту loadChapter...");

      // Спосіб 1: Спробуємо імпортувати
      const loadChapterModule = await import("../utils/loadChapter");
      console.log("✅ Модуль завантажений:", loadChapterModule);

      // Спосіб 2: Викличемо функцію
      const data = await loadChapterModule.loadChapter("GEN", 1, "UTT");
      console.log("✅ loadChapter повернув:", data);

      return {
        success: true,
        isArray: Array.isArray(data),
        length: data?.length || 0,
        details: `✅ Імпорт працює! Повернуто ${data?.length || 0} елементів`,
      };
    } catch (error) {
      console.error("❌ Помилка імпорту:", error);
      return {
        success: false,
        error: error.message,
        details: `❌ Помилка імпорту: ${error.message}`,
      };
    }
  };

  // У файлі src/components/FormatTester.js оновіть функцію testTranslationFormat:
  // const testTranslationFormat = async () => {
  //   try {
  //     console.log("=== Starting translation format test ===");

  //     // Спробуємо завантажити різними способами
  //     let data;

  //     // Спосіб 1: Використовуємо loadChapter
  //     try {
  //       console.log("Method 1: Using loadChapter");
  //       data = await loadChapter("GEN", 1, "UTT");
  //     } catch (err1) {
  //       console.log("Method 1 failed:", err1.message);

  //       // Спосіб 2: Прямий fetch
  //       try {
  //         console.log("Method 2: Direct fetch");
  //         const response = await fetch(
  //           "/data_compressed/translations/utt/OldT/GEN/gen1_utt.json"
  //         );
  //         if (response.ok) {
  //           const json = await response.json();
  //           data = jsonAdapter(json);
  //         } else {
  //           // Спосіб 3: Альтернативний шлях
  //           console.log("Method 3: Alternative path");
  //           const altResponse = await fetch(
  //             "/data/translations/utt/OldT/GEN/gen1_utt.json"
  //           );
  //           if (altResponse.ok) {
  //             const altJson = await altResponse.json();
  //             data = jsonAdapter(altJson);
  //           } else {
  //             throw new Error("Both paths failed");
  //           }
  //         }
  //       } catch (err2) {
  //         console.log("Method 2 & 3 failed:", err2.message);
  //         throw new Error(
  //           `Всі методи невдалі: ${err1.message}, ${err2.message}`
  //         );
  //       }
  //     }

  //     console.log("Data loaded:", data);

  //     if (!data || !Array.isArray(data)) {
  //       console.log("Invalid data format:", typeof data);
  //       throw new Error("Невірні дані: не масив");
  //     }

  //     const firstVerse = data[0];
  //     console.log("First verse:", firstVerse);

  //     if (!firstVerse) {
  //       throw new Error("Немає першого вірша");
  //     }

  //     // Аналізуємо формат
  //     const hasShortKeys =
  //       firstVerse.ws !== undefined || firstVerse.v !== undefined;
  //     const hasFullKeys =
  //       firstVerse.words !== undefined || firstVerse.verse !== undefined;

  //     // Перевіряємо вміст
  //     let wordCount = 0;
  //     if (hasShortKeys && firstVerse.ws) {
  //       wordCount = firstVerse.ws.length;
  //     } else if (hasFullKeys && firstVerse.words) {
  //       wordCount = firstVerse.words.length;
  //     }

  //     const format = hasShortKeys ? "short" : hasFullKeys ? "full" : "unknown";

  //     return {
  //       success: true,
  //       format,
  //       verses: data.length,
  //       wordCount,
  //       hasShortKeys,
  //       hasFullKeys,
  //       firstVerseKeys: Object.keys(firstVerse),
  //       details: `Завантажено ${data.length} віршів, ${wordCount} слів у першому вірші, формат: ${format}`,
  //     };
  //   } catch (error) {
  //     console.error("Translation format test error:", error);
  //     return {
  //       success: false,
  //       error: error.message,
  //       details: `Помилка: ${error.message}`,
  //     };
  //   }
  // };
  const testTranslationFormat = async () => {
    try {
      console.log("🧪 ТЕСТ ПЕРЕКЛАДУ ЗАПУЩЕНО");

      // 1. Пряме завантаження без loadChapter
      const url = "/data_compressed/translations/utt/OldT/GEN/gen1_utt.json";
      console.log(`📥 Завантаження з: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
      }

      const rawData = await response.json();
      console.log("📦 Сирі дані отримані:", rawData);

      // 2. Перевіряємо структуру
      if (!Array.isArray(rawData)) {
        console.warn("⚠️  Дані не масив! Тип:", typeof rawData);

        // Якщо це об'єкт, спробуємо обробити
        if (typeof rawData === "object") {
          console.log("🔑 Ключі обєкта:", Object.keys(rawData));

          // Можливо це { "1": [...], "2": [...] }
          const values = Object.values(rawData);
          if (values.length > 0 && Array.isArray(values[0])) {
            console.log("🔄 Конвертація обєкта в масив");
            const flattened = values.flat();
            return analyzeData(flattened, url);
          }

          // Спробуємо адаптер
          const adapted = jsonAdapter(rawData);
          return analyzeData(adapted, url);
        }

        throw new Error(`Очікувався масив, отримано: ${typeof rawData}`);
      }

      return analyzeData(rawData, url);
    } catch (error) {
      console.error("❌ КРИТИЧНА ПОМИЛКА:", error);
      return {
        success: false,
        error: error.message,
        stack: error.stack,
        details: `❌ ${error.message}`,
      };
    }
  };

  // Допоміжна функція для аналізу даних
  function analyzeData(data, url) {
    console.log("📊 Аналіз даних...");
    console.log("Тип:", typeof data);
    console.log("Чи це масив?", Array.isArray(data));
    console.log("Довжина:", data?.length);

    if (!Array.isArray(data)) {
      throw new Error(`Після обробки все ще не масив: ${typeof data}`);
    }

    if (data.length === 0) {
      throw new Error("Масив порожній");
    }

    const first = data[0];
    console.log("Перший елемент:", first);
    console.log("Ключі першого:", Object.keys(first));

    const hasShortKeys = first.ws !== undefined || first.v !== undefined;
    const hasFullKeys = first.words !== undefined || first.verse !== undefined;

    const format = hasShortKeys ? "short" : hasFullKeys ? "full" : "unknown";
    const verseCount = data.length;
    const wordCount = first.ws?.length || first.words?.length || 0;

    console.log(
      `📋 Результат: ${verseCount} віршів, ${wordCount} слів, формат: ${format}`
    );

    return {
      success: true,
      format,
      verses: verseCount,
      wordCount,
      url,
      firstVerseKeys: Object.keys(first),
      sample: JSON.stringify(first).substring(0, 150) + "...",
      details: `✅ УСПІХ! ${verseCount} віршів, формат: ${format}, ключі: ${Object.keys(
        first
      ).join(", ")}`,
    };
  }
  // Тест 3: Перевірка адаптера JSON
  const testJsonAdapter = async () => {
    try {
      // Тестові дані в різних форматах
      const testDataShort = {
        v: 1,
        ws: [
          { w: "На", s: "G1722" },
          { w: "початку", s: "G746" },
        ],
      };

      const testDataFull = {
        verse: 1,
        words: [
          { word: "На", strong: "G1722" },
          { word: "початку", strong: "G746" },
        ],
      };

      const adaptedShort = jsonAdapter([testDataShort]);
      const adaptedFull = jsonAdapter([testDataFull]);

      const isShortAdapted = !isCompressedFormat(adaptedShort);
      const isFullAdapted = !isCompressedFormat(adaptedFull);

      return {
        success: true,
        shortTest: isShortAdapted ? "passed" : "failed",
        fullTest: isFullAdapted ? "passed" : "failed",
        details: `Адаптер: короткий → ${
          isShortAdapted ? "OK" : "FAIL"
        }, повний → ${isFullAdapted ? "OK" : "FAIL"}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Тест 4: Перевірка доступності файлів
  const testFileAvailability = async () => {
    const testFiles = [
      "/data_compressed/strongs/G746.json",
      "/data/strongs/G746.json",
      "/data_compressed/translations/utt/OldT/GEN/gen1_utt.json",
      "/data/translations/utt/OldT/GEN/gen1_utt.json",
    ];

    const results = [];

    for (const file of testFiles) {
      try {
        const response = await fetch(file);
        results.push({
          file,
          exists: response.ok,
          size: response.headers.get("content-length") || "unknown",
        });
      } catch (error) {
        results.push({
          file,
          exists: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      files: results,
      details: `Перевірено ${results.length} файлів, знайдено: ${
        results.filter((r) => r.exists).length
      }`,
    };
  };

  // Запуск всіх тестів
  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      { name: "Формат словника Strong", testFn: testStrongsFormat },
      { name: "Формат перекладу", testFn: testTranslationFormat },
      { name: "Адаптер JSON", testFn: testJsonAdapter },
      { name: "Доступність файлів", testFn: testFileAvailability },
    ];

    const results = [];

    for (const test of tests) {
      results.push({
        name: test.name,
        status: "running",
        message: "Виконується...",
      });
      setTestResults([...results]);

      try {
        const testResult = await test.testFn();

        const resultIndex = results.findIndex((r) => r.name === test.name);
        if (resultIndex !== -1) {
          results[resultIndex] = {
            name: test.name,
            status: testResult.success ? "success" : "error",
            message: testResult.success
              ? testResult.details || "Успішно"
              : `Помилка: ${testResult.error}`,
            data: testResult,
          };
        }

        setTestResults([...results]);

        // Затримка між тестами для наочності
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        const resultIndex = results.findIndex((r) => r.name === test.name);
        if (resultIndex !== -1) {
          results[resultIndex] = {
            name: test.name,
            status: "error",
            message: `Помилка: ${error.message}`,
          };
        }
        setTestResults([...results]);
      }
    }

    setLoading(false);

    // Оновлюємо інформацію про формат
    const strongsTest = results.find(
      (r) => r.name === "Формат словника Strong"
    );
    if (strongsTest && strongsTest.data) {
      setFormatInfo((prev) => ({
        ...prev,
        strongsFormat: strongsTest.data.format || "unknown",
      }));
    }
  };

  // Перемикання формату
  const toggleFormat = () => {
    const current = formatInfo.currentFormat;
    const newFormat = current === "compressed" ? "full" : "compressed";

    localStorage.setItem("jsonFormat", newFormat);

    setFormatInfo((prev) => ({
      ...prev,
      currentFormat: newFormat,
      dataPath: newFormat === "compressed" ? "/data_compressed" : "/data",
    }));

    // Показуємо повідомлення
    alert(
      `Формат змінено на: ${
        newFormat === "compressed" ? "скорочений" : "повний"
      }. Перезавантажте сторінку.`
    );
  };

  // Перезавантаження сторінки
  const reloadPage = () => {
    window.location.reload();
  };

  // кнопка конвертації до тестувальника початок
  // const [converting, setConverting] = useState(false);
  // const [conversionResult, setConversionResult] = useState(null);

  // const runConversion = async () => {
  //   setConverting(true);
  //   setConversionResult(null);

  //   try {
  //     // Викликаємо серверний endpoint для конвертації
  //     const response = await fetch("/api/convert-files", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         directories: ["translations", "originals", "strongs"],
  //         preserveOriginals: true,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP ${response.status}`);
  //     }

  //     const result = await response.json();
  //     setConversionResult(result);

  //     alert("✅ Конвертацію завершено! Перезавантажте сторінку.");
  //   } catch (error) {
  //     console.error("Помилка конвертації:", error);
  //     setConversionResult({ error: error.message });
  //     alert(`❌ Помилка конвертації: ${error.message}`);
  //   } finally {
  //     setConverting(false);
  //   }
  // };
  // Додайте цю функцію ПЕРЕД return() або в тому ж рівні, де інші функції:

  const checkFilesManually = async () => {
    const filesToCheck = [
      { name: "Словник G746", path: "/data_compressed/strongs/G746.json" },
      { name: "Словник G746 (ориг.)", path: "/data/strongs/G746.json" },
      {
        name: "UTT Буття 1",
        path: "/data_compressed/translations/utt/OldT/GEN/gen1_utt.json",
      },
      {
        name: "UTT Буття 1 (ориг.)",
        path: "/data/translations/utt/OldT/GEN/gen1_utt.json",
      },
      {
        name: "LXX Буття 1",
        path: "/data_compressed/originals/lxx/OldT/GEN/gen1_lxx.json",
      },
      {
        name: "LXX Буття 1 (ориг.)",
        path: "/data/originals/lxx/OldT/GEN/gen1_lxx.json",
      },
    ];

    const results = [];

    for (const file of filesToCheck) {
      try {
        const response = await fetch(file.path);
        if (response.ok) {
          const data = await response.json();
          const isArray = Array.isArray(data);
          const size = JSON.stringify(data).length;
          results.push(
            `✅ ${file.name}: Знайдено (${size} байт, ${
              isArray ? "масив" : "обєкт"
            })`
          );
        } else {
          results.push(
            `❌ ${file.name}: Не знайдено (HTTP ${response.status})`
          );
        }
      } catch (error) {
        results.push(`❌ ${file.name}: Помилка - ${error.message}`);
      }
    }

    alert(results.join("\n"));
  };
  // src/components/FormatTester.js - ДОДАЙТЕ ЦЕ В КІНЕЦЬ КОМПОНЕНТА (в межах функції FormatTester)

  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);

  // Ця функція має бути ВСЕРЕДИНІ компонента FormatTester
  const runConversion = async () => {
    setConverting(true);
    setConversionResult(null);

    try {
      // Показуємо повідомлення
      if (
        !window.confirm(
          "Конвертувати файли в скорочений формат?\nЦе може зайняти кілька хвилин."
        )
      ) {
        setConverting(false);
        return;
      }

      // Використовуємо простий fetch до нашого сервера
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "convert-files",
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setConversionResult(result);

      alert(
        `✅ Конвертацію завершено!\n\nФайлів оброблено: ${
          result.filesProcessed || 0
        }\nЕкономія: ${result.savings || 0}%`
      );
    } catch (error) {
      console.error("❌ Помилка конвертації:", error);

      // Якщо API не працює, пропонуємо альтернативу
      if (
        error.message.includes("404") ||
        error.message.includes("Failed to fetch")
      ) {
        const userChoice = window.confirm(
          "API конвертації недоступне.\n\nБажаєте побачити інструкцію для ручної конвертації?"
        );

        if (userChoice) {
          setConversionResult({
            manualInstructions: `
  ІНСТРУКЦІЯ ДЛЯ РУЧНОЇ КОНВЕРТАЦІІ:

  1. Відкрийте термінал/командний рядок
  2. Перейдіть до папки проекту:
   cd шлях/до/вашого/project

  3. Запустіть скрипт конвертації:
   node scripts/convertTranslations.js

  4. Після завершення перевірте результат:
   node scripts/verifyConversion.js

  АЛЬТЕРНАТИВНО:
  - Скопіюйте файли з data_compressed/ в data/
  - Або налаштуйте додаток на використання data_compressed/
          `,
          });
        }
      } else {
        setConversionResult({ error: error.message });
        alert(`❌ Помилка: ${error.message}`);
      }
    } finally {
      setConverting(false);
    }
  };

  // Потім в JSX (в return) додайте:
  // return (
  //   <div className="format-tester">
  //     {/* ... інший код ... */}

  //     {/* ДОДАЙТЕ ЦЕ В КІНЕЦЬ tester-body */}
  //     <div className="conversion-section mt-3 pt-3 border-top">
  //       <h6>Конвертація файлів:</h6>

  //       <button
  //         className="btn btn-sm btn-warning me-2 mb-2"
  //         onClick={runConversion}
  //         disabled={converting}
  //         title="Конвертує JSON файли в скорочений формат"
  //       >
  //         {converting ? (
  //           <>
  //             <span className="spinner-border spinner-border-sm me-2"></span>
  //             Конвертація...
  //           </>
  //         ) : (
  //           <>
  //             <i className="bi bi-arrow-repeat me-2"></i>
  //             Конвертувати файли
  //           </>
  //         )}
  //       </button>

  //       <button
  //         className="btn btn-sm btn-info me-2 mb-2"
  //         onClick={checkFilesManually}
  //         title="Перевірити наявність файлів"
  //       >
  //         <i className="bi bi-search me-2"></i>
  //         Перевірити файли
  //       </button>

  //       <button
  //         className="btn btn-sm btn-secondary mb-2"
  //         onClick={() => window.location.reload()}
  //         title="Перезавантажити сторінку після конвертації"
  //       >
  //         <i className="bi bi-arrow-clockwise me-2"></i>
  //         Перезавантажити
  //       </button>

  //       {conversionResult && (
  //         <div className="conversion-result mt-2 p-2 bg-dark rounded small">
  //           <h6>Результат:</h6>
  //           <pre
  //             className="mb-0 text-light"
  //             style={{ maxHeight: "200px", overflow: "auto" }}
  //           >
  //             {conversionResult.manualInstructions
  //               ? conversionResult.manualInstructions
  //               : JSON.stringify(conversionResult, null, 2)}
  //           </pre>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  // кнопка конвертації до тестувальника кінець

  return (
    <div className="format-tester">
      <div className="tester-header">
        <h6>Тестування JSON форматів</h6>
        <button
          className="btn-close btn-close-white"
          onClick={() =>
            document.querySelector(".format-tester").classList.add("collapsed")
          }
          title="Згорнути"
        ></button>
      </div>

      <div className="tester-body">
        {/* Поточна конфігурація */}
        <div className="current-config mb-3">
          <h6>Поточна конфігурація:</h6>
          <ul className="list-unstyled small">
            <li>
              Формат:{" "}
              <strong>
                {formatInfo.currentFormat === "compressed"
                  ? "скорочений"
                  : "повний"}
              </strong>
            </li>
            <li>
              Шлях до даних: <code>{formatInfo.dataPath}</code>
            </li>
            <li>Формат словників: {formatInfo.strongsFormat}</li>
            <li>
              Збережено в localStorage:{" "}
              {localStorage.getItem("jsonFormat") || "немає"}
            </li>
          </ul>
        </div>

        {/* Кнопки управління */}
        <div className="tester-controls mb-3">
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={runAllTests}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Тестування...
              </>
            ) : (
              "Запустити тести"
            )}
          </button>

          <button
            className="btn btn-sm btn-warning me-2"
            onClick={toggleFormat}
          >
            Перемкнути формат
          </button>

          <button className="btn btn-sm btn-secondary" onClick={reloadPage}>
            Перезавантажити
          </button>
        </div>

        {/* Результати тестування */}
        {testResults.length > 0 && (
          <div className="test-results">
            <h6>Результати:</h6>
            <div className="results-list">
              {testResults.map((result, i) => (
                <div key={i} className={`result-item ${result.status}`}>
                  <div className="result-header">
                    <span className="result-name">{result.name}</span>
                    <span
                      className={`badge bg-${
                        result.status === "success"
                          ? "success"
                          : result.status === "error"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {result.status === "success"
                        ? "✓"
                        : result.status === "error"
                        ? "✗"
                        : "..."}
                    </span>
                  </div>
                  <div className="result-message">{result.message}</div>

                  {/* Детальна інформація */}
                  {result.data && result.status === "success" && (
                    <details className="result-details">
                      <summary>Деталі</summary>
                      <pre className="small mt-2">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Швидкі дії */}
        <div className="quick-actions mt-3">
          <h6>Швидкі перевірки:</h6>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-info"
              onClick={async () => {
                const result = await testStrongsFormat();
                alert(
                  result.success
                    ? `Словник: ${result.word}\nФормат: ${result.format}`
                    : `Помилка: ${result.error}`
                );
              }}
            >
              Перевірити словник
            </button>
            <button
              className="btn btn-outline-info"
              onClick={async () => {
                const result = await testTranslationFormat();
                alert(
                  result.success
                    ? `Переклад: ${result.details}`
                    : `Помилка: ${result.error}`
                );
              }}
            >
              Перевірити переклад
            </button>
          </div>
        </div>

        {/* Статистика */}
        {testResults.length > 0 && (
          <div className="test-stats mt-3 pt-3 border-top">
            <div className="stats-summary">
              <strong>Підсумок:</strong>
              <span className="ms-2 text-success">
                ✓ {testResults.filter((r) => r.status === "success").length}{" "}
                успішних
              </span>
              <span className="ms-2 text-danger">
                ✗ {testResults.filter((r) => r.status === "error").length}{" "}
                помилок
              </span>
              <span className="ms-2 text-warning">
                … {testResults.filter((r) => r.status === "running").length}{" "}
                виконуються
              </span>
            </div>
          </div>
        )}
      </div>
      {/* ДОДАЙТЕ ЦЕ В КІНЕЦЬ tester-body */}
      <div className="conversion-section mt-3 pt-3 border-top">
        <h6>Конвертація файлів:</h6>

        <button
          className="btn btn-sm btn-warning me-2 mb-2"
          onClick={runConversion}
          disabled={converting}
          title="Конвертує JSON файли в скорочений формат"
        >
          {converting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Конвертація...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-repeat me-2"></i>
              Конвертувати файли
            </>
          )}
        </button>

        <button
          className="btn btn-sm btn-info me-2 mb-2"
          onClick={checkFilesManually}
          title="Перевірити наявність файлів"
        >
          <i className="bi bi-search me-2"></i>
          Перевірити файли
        </button>

        <button
          className="btn btn-sm btn-secondary mb-2"
          onClick={() => window.location.reload()}
          title="Перезавантажити сторінку після конвертації"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Перезавантажити
        </button>

        {conversionResult && (
          <div className="conversion-result mt-2 p-2 bg-dark rounded small">
            <h6>Результат:</h6>
            <pre
              className="mb-0 text-light"
              style={{ maxHeight: "200px", overflow: "auto" }}
            >
              {conversionResult.manualInstructions
                ? conversionResult.manualInstructions
                : JSON.stringify(conversionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormatTester;
