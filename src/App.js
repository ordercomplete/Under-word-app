// import React, { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import NavbarHeader from "./components/NavbarHeader";
// import PassageText from "./components/PassageText";
// import LexiconWindow from "./components/LexiconWindow";
// import AdminPanel from "./admin/AdminPanel";
// // import lang from "../lang.json";
// import lang from "../public/data/lang.json"; // ПРАЦЮЄ в CRA!

// const App = () => {
//   const [language, setLanguage] = useState("ua"); // Default: Ukrainian
//   useEffect(() => {
//     // Detect system language or IP-based (mock for now)
//     const systemLang = navigator.language.split("-")[0];
//     if (["ua", "en", "ru"].includes(systemLang)) {
//       setLanguage(systemLang);
//     }
//     // TODO: Add IP-based language detection for online version
//   }, []);

//   return (
//     <div className="app-container">
//       <NavbarHeader lang={lang[language]} />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content d-flex">
//               <PassageText lang={lang[language]} />
//               <LexiconWindow lang={lang[language]} />
//             </div>
//           }
//         />
//         <Route path="/admin" element={<AdminPanel lang={lang[language]} />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

// src/App.js
// import React, { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import NavbarHeader from "./components/NavbarHeader";
// import PassageText from "./components/PassageText";
// import LexiconWindow from "./components/LexiconWindow";
// import AdminPanel from "./admin/AdminPanel";

// const App = () => {
//   const [language, setLanguage] = useState("ua");
//   const [lang, setLang] = useState(null);

//   useEffect(() => {
//     // Завантаження lang.json
//     fetch("/data/lang.json")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to load lang.json");
//         return res.json();
//       })
//       .then((data) => {
//         // Автовизначення мови
//         const browserLang = navigator.language.split("-")[0].toLowerCase();
//         const validLang = ["ua", "en", "ru"].includes(browserLang)
//           ? browserLang
//           : "ua";
//         setLanguage(validLang);
//         setLang(data[validLang]);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLang({ error: "Language file not found" });
//       });
//   }, []);

//   if (!lang) return <div className="text-center p-5">Loading language...</div>;

//   return (
//     <div className="app-container">
//       <NavbarHeader lang={lang} />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="main-content d-flex">
//               <PassageText lang={lang} />
//               <LexiconWindow lang={lang} />
//             </div>
//           }
//         />
//         <Route path="/admin" element={<AdminPanel lang={lang} />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarHeader from "./components/NavbarHeader";
import ChapterViewer from "./components/ChapterViewer";
import LexiconWindow from "./components/LexiconWindow";
import AdminPanel from "./admin/AdminPanel";
import PassageOptionsGroup from "./components/PassageOptionsGroup";

const App = () => {
  const [language, setLanguage] = useState("ua");
  const [lang, setLang] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentRef, setCurrentRef] = useState("Gen.1");
  const [versions] = useState(["THOT", "LXX", "UkrOgienko"]);
  const [isScrollSynced, setIsScrollSynced] = useState(true);

  const handlePrev = () => alert("Попередня глава");
  const handleNext = () => alert("Наступна глава");
  const handleNewPanel = () => alert("Нова панель");
  const handleClose = () => alert("Закрити колонку");

  useEffect(() => {
    fetch("/data/lang.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load lang.json");
        return res.json();
      })
      .then((data) => {
        const browserLang = navigator.language.split("-")[0].toLowerCase();
        const validLang = ["ua", "en", "ru"].includes(browserLang)
          ? browserLang
          : "ua";
        setLanguage(validLang);
        setLang(data[validLang]);
      })
      .catch((err) => {
        console.error(err);
        // Fallback: мінімальний lang
        setLang({
          welcome: "Under-word-app",
          loading: "Завантаження...",
          error: "Помилка завантаження",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">{lang?.loading || "Завантаження..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavbarHeader lang={lang} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content d-flex flex-column flex-lg-row">
              {/* Ліва колонка: Переклад */}
              <div className="passage-column flex-fill d-flex flex-column">
                <PassageOptionsGroup
                  lang={lang}
                  currentRef={currentRef}
                  versions={versions}
                  isScrollSynced={isScrollSynced}
                  setIsScrollSynced={setIsScrollSynced}
                  onPrevChapter={handlePrev}
                  onNextChapter={handleNext}
                  onNewPanel={handleNewPanel}
                  onCloseColumn={handleClose}
                />

                <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
                  <h4>Gen 1:1</h4>
                  <p>
                    בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃
                  </p>
                  <p>На початку Бог створив небо і землю.</p>
                </div>
              </div>

              {/* Права колонка: Лексикон */}
              <div
                className="lexicon-column border-start"
                style={{ width: "320px" }}
              >
                <div className="p-3 bg-light border-bottom">
                  <h6>{lang.lexicon || "Лексикон"}</h6>
                </div>
                <div className="lexicon-content flex-fill overflow-auto p-3">
                  <p>
                    <strong>H7225</strong> — רֵאשִׁית (початок)
                  </p>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/admin" element={<AdminPanel lang={lang} />} />
      </Routes>
    </div>
  );
};

export default App;
