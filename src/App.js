// // src/App.js
// import React, { useState, useEffect } from "react";
// import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
// import { Routes, Route } from "react-router-dom";
// import NavbarHeader from "./components/NavbarHeader";
// import PassagePage from "./components/PassagePage";
// import AdminPanel from "./admin/AdminPanel";
// import FormatTester from "./components/FormatTester"; // НОВИЙ ІМПОРТ

// // Імпорт стилів
// import "./styles/App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// const App = () => {
//   const [lang, setLang] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showTester, setShowTester] = useState(false); // НОВИЙ СТАН

//   useEffect(() => {
//     const savedLang = localStorage.getItem("appLanguage") || "ua";

//     // Перевіряємо налаштування тестувальника
//     const savedShowTester = localStorage.getItem("showFormatTester");
//     if (savedShowTester !== null) {
//       setShowTester(savedShowTester === "true");
//     }

//     const loadData = async () => {
//       try {
//         const langRes = await fetch("/data/lang.json");
//         if (!langRes.ok) throw new Error("lang.json not found");

//         const langData = await langRes.json();
//         setLang(langData[savedLang] || langData.ua);
//       } catch (err) {
//         console.error(err);
//         setLang({
//           welcome: "Under-word-app",
//           loading: "Loading...",
//           error: "Помилка завантаження",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const handleLanguageChange = (newLangData) => {
//     setLang(newLangData);
//   };

//   // Функція для перемикання тестувальника
//   const toggleTester = () => {
//     const newState = !showTester;
//     setShowTester(newState);
//     localStorage.setItem("showFormatTester", newState.toString());
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Завантаження...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       <NavbarHeader lang={lang} onLanguageChange={handleLanguageChange} />

//       {/* Кнопка перемикання тестувальника (тільки в розробці) */}
//       {process.env.NODE_ENV === "development" && (
//         <button
//           className="btn btn-sm btn-warning position-fixed d-flex justify-content-center align-items-center"
//           style={{
//             top: "10px",
//             left: "200px",
//             zIndex: 9998,
//             opacity: 0.8,
//           }}
//           onClick={toggleTester}
//           title="Перемикач тесту формату"
//         >
//           <i className={`bi bi-${showTester ? "eye-slash" : "eye"}`}>JSON</i>
//         </button>
//       )}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content d-flex flex-column">
//               <PassagePage lang={lang} />
//             </div>
//           }
//         />
//         <Route path="/admin" element={<AdminPanel lang={lang} />} />
//       </Routes>

//       {/* Тестувальник формату (тільки в розробці) */}
//       {process.env.NODE_ENV === "development" && showTester && (
//         <FormatTester lang={lang} />
//       )}
//     </div>
//   );
// };

// export default App;

// ===========================

// src/App.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarHeader from "./components/NavbarHeader";

// import PassagePage from "./components/PassagePage";
// import AdminPanel from "./admin/AdminPanel";
// import FormatTester from "./components/FormatTester";

// Імпорт стилів
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ЛІНИВЕ ЗАВАНТАЖЕННЯ КОМПОНЕНТІВ
const PassagePage = lazy(() => import("./components/PassagePage"));
const AdminPanel = lazy(() => import("./admin/AdminPanel"));
const FormatTester = lazy(() => import("./components/FormatTester"));
// Додайте в public/index.html або на початку App.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Префетч критичних ресурсів
    const criticalResources = [
      "/data/core.json",
      "/data/lang.json",
      "/data/translations.json",
      "/data/strongs/G4160.json",
      "/data/dictionaries/uk/G/G4160_uk.json",
    ];

    criticalResources.forEach((resource) => {
      fetch(resource, { priority: "low" })
        .then((response) => {
          if (response.ok) {
            // Зберігаємо в кеші
            caches.open("critical-resources").then((cache) => {
              cache.put(resource, response);
            });
          }
        })
        .catch(() => {
          /* Ігноруємо помилки префетчу */
        });
    });
  });
}
// Компонент завантажувача
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Завантаження...</p>
    </div>
  </div>
);

const App = () => {
  const [lang, setLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTester, setShowTester] = useState(false);

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

  const toggleTester = () => {
    const newState = !showTester;
    setShowTester(newState);
    localStorage.setItem("showFormatTester", newState.toString());
  };

  if (loading) {
    return <LoadingSpinner />;
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

      {/* Suspense для лінивого завантаження */}
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </div>
  );
};

export default App;
