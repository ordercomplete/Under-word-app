// App.js 06.11.2025
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarHeader from "./components/NavbarHeader";
import PassagePage from "./components/PassagePage";
// import LexiconWindow from "./components/LexiconWindow";
import AdminPanel from "./admin/AdminPanel";

const App = () => {
  const [lang, setLang] = useState(null);
  // const [coreData, setCoreData] = useState(null); // ← НОВЕ: стан для core.json
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage") || "ua";

    const loadData = async () => {
      try {
        const [langRes, coreRes] = await Promise.all([
          fetch("/data/lang.json"),
          // fetch("/data/core.json"), // ← Завантажуємо core.json
        ]);

        if (!langRes.ok) throw new Error("lang.json not found");
        // if (!coreRes.ok) throw new Error("core.json not found");

        const [langData, core] = await Promise.all([
          langRes.json(),
          // coreRes.json(),
        ]);

        setLang(langData[savedLang] || langData.ua);
        // setCoreData(core);
      } catch (err) {
        console.error(err);
        setLang({
          welcome: "Under-word-app",
          loading: "Loading...",
          error: "Помилка завантаження",
        });
        // setCoreData({}); // Фолбек порожній об'єкт
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLanguageChange = (newLangData) => {
    setLang(newLangData);
  };

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
      <NavbarHeader lang={lang} onLanguageChange={handleLanguageChange} />

      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content d-flex flex-column ">
              {/* <PassagePage lang={lang} coreData={coreData} />{" "} */}
              <PassagePage lang={lang} /> {/* ← Передаємо coreData */}
              {/* <LexiconWindow lang={lang} /> */}
            </div>
          }
        />
        <Route path="/admin" element={<AdminPanel lang={lang} />} />
      </Routes>
    </div>
  );
};

export default App;
