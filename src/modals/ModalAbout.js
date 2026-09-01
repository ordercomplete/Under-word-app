import React, { useState, useEffect } from "react";

const ModalAbout = ({ isOpen, onRequestClose, lang }) => {
  const [appInfo, setAppInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !appInfo) {
      setLoading(true);
      fetch("/data/appInfo.json")
        .then((response) => response.json())
        .then((data) => setAppInfo(data))
        .catch(() => {
          setAppInfo({
            techStack: [
              "React ^18.3.1 - Основна бібліотека UI",
              "React Router ^6.30.4 - Маршрутизація",
              "React Bootstrap ^2.10.0 - UI компоненти",
              "Bootstrap ^5.3.2 - CSS фреймворк",
              "Bootstrap Icons ^1.13.1 - Іконки",
            ],
            modules: [
              {
                name: "PassagePage",
                description: "Мультивіконний перегляд (до 4 панелей)",
              },
              {
                name: "InterlinearVerse",
                description: "Вірівнювання слів оригіналу та перекладу",
              },
              {
                name: "LexiconWindow",
                description: "Словниковий пошук (Strong's, LSJ, LXX)",
              },
            ],
            originals: [
              "LXX (Септуагінта)",
              "THOT (Єврейський)",
              "TR (Textus Receptus)",
              "GNT (Modern Critical)",
            ],
            translations: [
              "UTT",
              "UBT",
              "Synodal",
              "KJV",
              "Ogienko",
              "Khomenko",
              "Siry",
            ],
            features: [
              "AbortController - скасування запитів при навігації",
              "Debounce - оптимізація збереження стану",
              "Кешування в sessionStorage (1 година)",
              "Адаптивний дизайн для мобільних пристроїв",
              "Service Worker для офлайн-режиму",
            ],
            commands: [
              "npm start # Dev сервер",
              "npm run build # Збірка",
              "npm run deploy # Деплой",
            ],
            lastUpdate: "09.07.2026",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, appInfo]);

  if (!isOpen) return null;

  const renderContent = () => (
    <div className="modal-body">
      <div className="mb-4">
        <h6 className="text-primary">Технічний стек</h6>
        <ul className="list-unstyled ms-3">
          {appInfo.techStack.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
        <p className="text-muted ms-3">
          <small>
            Node.js {">="} 24.0.0, npm {">="} 10.0.0
          </small>
        </p>
      </div>

      <div className="mb-4">
        <h6 className="text-primary">Ключові модули</h6>
        <ul className="list-unstyled ms-3">
          {appInfo.modules.map((m, i) => (
            <li key={i}>
              <strong>{m.name}</strong> - {m.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h6 className="text-primary">Біблійні версії</h6>
        <p className="ms-3 mb-1">
          <strong>Оригінали:</strong> {appInfo.originals.join(", ")}
        </p>
        <p className="ms-3">
          <strong>Переклади:</strong> {appInfo.translations.join(", ")}
        </p>
      </div>

      <div className="mb-4">
        <h6 className="text-primary">Особливості</h6>
        <ul className="list-unstyled ms-3">
          {appInfo.features.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h6 className="text-primary">Команди</h6>
        <pre
          className="bg-light p-2 rounded ms-3"
          style={{ fontSize: "0.85rem" }}
        >
          {appInfo.commands.join("\n")}
        </pre>
      </div>

      <div className="text-center text-muted">
        <small>Дата оновлення: {appInfo.lastUpdate}</small>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onRequestClose}
        style={{ cursor: "pointer" }}
      />

      <div
        className="modal in"
        tabIndex="-1"
        style={{ display: "block" }}
        onClick={onRequestClose}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content stepModalFgBg">
            {loading || !appInfo ? (
              <div className="modal-body">
                <p className="text-center py-4">Завантаження...</p>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAbout;
