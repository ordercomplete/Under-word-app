import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarHeader from "./components/NavbarHeader";
import PassageText from "./components/PassageText";
import LexiconWindow from "./components/LexiconWindow";
import AdminPanel from "./admin/AdminPanel";
import lang from "./lang.json";

const App = () => {
  const [language, setLanguage] = useState("ua"); // Default: Ukrainian
  useEffect(() => {
    // Detect system language or IP-based (mock for now)
    const systemLang = navigator.language.split("-")[0];
    if (["ua", "en", "ru"].includes(systemLang)) {
      setLanguage(systemLang);
    }
    // TODO: Add IP-based language detection for online version
  }, []);

  return (
    <div className="app-container">
      <NavbarHeader lang={lang[language]} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content d-flex">
              <PassageText lang={lang[language]} />
              <LexiconWindow lang={lang[language]} />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPanel lang={lang[language]} />} />
      </Routes>
    </div>
  );
};

export default App;
