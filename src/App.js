// App.js 06.11.2025
// import React, { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import NavbarHeader from "./components/NavbarHeader";
// import PassagePage from "./components/PassagePage";
// // import LexiconWindow from "./components/LexiconWindow";
// import AdminPanel from "./admin/AdminPanel";

// const App = () => {
//   const [lang, setLang] = useState(null);
//   // const [coreData, setCoreData] = useState(null); // ← НОВЕ: стан для core.json
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedLang = localStorage.getItem("appLanguage") || "ua";

//     const loadData = async () => {
//       try {
//         const [langRes, coreRes] = await Promise.all([
//           fetch("/data/lang.json"),
//           // fetch("/data/core.json"), // ← Завантажуємо core.json
//         ]);

//         if (!langRes.ok) throw new Error("lang.json not found");
//         // if (!coreRes.ok) throw new Error("core.json not found");

//         const [langData, core] = await Promise.all([
//           langRes.json(),
//           // coreRes.json(),
//         ]);

//         setLang(langData[savedLang] || langData.ua);
//         // setCoreData(core);
//       } catch (err) {
//         console.error(err);
//         setLang({
//           welcome: "Under-word-app",
//           loading: "Loading...",
//           error: "Помилка завантаження",
//         });
//         // setCoreData({}); // Фолбек порожній об'єкт
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const handleLanguageChange = (newLangData) => {
//     setLang(newLangData);
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">{lang?.loading || "Завантаження..."}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       <NavbarHeader lang={lang} onLanguageChange={handleLanguageChange} />

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content d-flex flex-column ">
//               {/* <PassagePage lang={lang} coreData={coreData} />{" "} */}
//               <PassagePage lang={lang} /> {/* ← Передаємо coreData */}
//               {/* <LexiconWindow lang={lang} /> */}
//             </div>
//           }
//         />
//         <Route path="/admin" element={<AdminPanel lang={lang} />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

// ------------------------------------------------------------

// src/App.js (оновлена версія)
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarHeader from "./components/NavbarHeader";
import PassagePage from "./components/PassagePage";
import AdminPanel from "./admin/AdminPanel";
import FormatTester from "./components/FormatTester"; // НОВИЙ ІМПОРТ

// Імпорт стилів
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  const [lang, setLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTester, setShowTester] = useState(false); // НОВИЙ СТАН

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage") || "ua";

    // Перевіряємо налаштування тестувальника
    const savedShowTester = localStorage.getItem("showFormatTester");
    if (savedShowTester !== null) {
      setShowTester(savedShowTester === "true");
    }

    const loadData = async () => {
      try {
        const langRes = await fetch("/data/lang.json");
        if (!langRes.ok) throw new Error("lang.json not found");

        const langData = await langRes.json();
        setLang(langData[savedLang] || langData.ua);
      } catch (err) {
        console.error(err);
        setLang({
          welcome: "Under-word-app",
          loading: "Loading...",
          error: "Помилка завантаження",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLanguageChange = (newLangData) => {
    setLang(newLangData);
  };

  // Функція для перемикання тестувальника
  const toggleTester = () => {
    const newState = !showTester;
    setShowTester(newState);
    localStorage.setItem("showFormatTester", newState.toString());
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavbarHeader lang={lang} onLanguageChange={handleLanguageChange} />

      {/* Кнопка перемикання тестувальника (тільки в розробці) */}
      {process.env.NODE_ENV === "development" && (
        <button
          className="btn btn-sm btn-warning position-fixed d-flex justify-content-center align-items-center"
          style={{
            top: "10px",
            left: "200px",
            zIndex: 9998,
            opacity: 0.8,
          }}
          onClick={toggleTester}
          title="Перемикач тесту формату"
        >
          <i className={`bi bi-${showTester ? "eye-slash" : "eye"}`}>JSON</i>
        </button>
      )}
      {/* кнопка конвертації */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="conversion-section mt-3 pt-3 border-top">
          <h6>Конвертація файлів:</h6>
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={runConversion}
            disabled={converting}
          >
            {converting ? "Конвертація..." : "Конвертувати файли"}
          </button>

          {conversionResult && (
            <div className="mt-2 small">
              <pre>{JSON.stringify(conversionResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )} */}

      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content d-flex flex-column">
              <PassagePage lang={lang} />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPanel lang={lang} />} />
      </Routes>

      {/* Тестувальник формату (тільки в розробці) */}
      {process.env.NODE_ENV === "development" && showTester && (
        <FormatTester lang={lang} />
      )}
    </div>
  );
};

export default App;
