// src/modals/TranslationSelector.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import CloseIcon from "../elements/CloseIcon";
import TranslationTabs from "../elements/TranslationTabs";
import TranslationFooter from "../elements/TranslationFooter";
import "../styles/TranslationSelector.css";
import { getDefaultVersions } from "../utils/defaultVersions";
import translationUtils from "../utils/translationUtils";

// ==================== УТІЛІТИ ====================
export const isOriginalVersionUtil = (initials, translationsData) => {
  if (!translationsData || !translationsData.bibles) return false;
  const bible = translationsData.bibles.find((b) => b.initials === initials);
  return bible?.features?.includes("originals") || false;
};

export const getLanguageNameUtil = (code, langDict = {}) => {
  const langMap = {
    _all: langDict.all_languages || "Всі мови",
    _ancient: langDict.ancient || "Стародавні",
    grc: langDict.greek || "Грецька",
    he: langDict.hebrew || "Єврейська",
    uk: langDict.ukrainian || "Українська",
    ru: langDict.russian || "Російська",
    en: langDict.english || "Англійська",
  };
  return langMap[code] || code;
};

// ==================== КОМПОНЕНТ ====================
const TranslationSelector = ({
  isOpen,
  onRequestClose,
  lang,
  onSelectVersions,
  initialVersions = [],
  currentBook = "GEN",
}) => {
  const [translations, setTranslations] = useState({ bibles: [] });
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [activeOriginalTab, setActiveOriginalTab] = useState("lxx");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== КОНСТАНТИ ====================
  const getTestament = (bookCode) => {
    const ntBooks = [
      "MAT",
      "MRK",
      "LUK",
      "JHN",
      "ACT",
      "ROM",
      "1CO",
      "2CO",
      "GAL",
      "EPH",
      "PHP",
      "COL",
      "1TH",
      "2TH",
      "1TI",
      "2TI",
      "TIT",
      "PHM",
      "HEB",
      "JAS",
      "1PE",
      "2PE",
      "1JN",
      "2JN",
      "3JN",
      "JUD",
      "REV",
    ];
    return ntBooks.includes(bookCode) ? "NewT" : "OldT";
  };

  const originalOrder = translationUtils.getOriginalsList();

  // ==================== ЕФЕКТИ ====================
  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/data/translations.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!isMounted) return;
        setTranslations(data);

        // Встановлення дефолту
        let defaultVersions = [];
        const testament = getTestament(currentBook);

        if (initialVersions.length > 0) {
          const hasIncompatible = initialVersions.some((ver) => {
            return !translationUtils.supportsTestament(ver, testament);
          });

          if (hasIncompatible) {
            const [book] = currentBook.split(".");
            defaultVersions = getDefaultVersions(book, data);
          } else {
            defaultVersions = initialVersions;
          }
        } else {
          const [book] = currentBook.split(".");
          defaultVersions = getDefaultVersions(book, data);
        }

        setSelectedVersions(defaultVersions);
        setActiveOriginalTab(testament === "NewT" ? "tr" : "lxx");
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isOpen) loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialVersions, currentBook]);

  // ==================== ГРУПУВАННЯ ЗА ОРИГІНАЛАМИ ====================
  const groupedByOriginal = useMemo(() => {
    const originals =
      translations.bibles?.filter((b) => b.features?.includes("originals")) ||
      [];

    const result = {};

    originals.forEach((orig) => {
      const origKey = orig.initials.toLowerCase();
      result[origKey] = {
        original: orig,
        translations: [],
      };

      // Знаходимо переклади, що базуються на цьому оригіналі
      translations.bibles.forEach((item) => {
        if (!item.basedOn) return;

        const basedOn = item.basedOn;
        // Перевіряємо чи переклад базується на цьому оригіналі в будь-якому заповіті
        const isMatch =
          basedOn.old_testament === origKey ||
          basedOn.new_testament === origKey;

        if (isMatch) {
          result[origKey].translations.push(item);
        }
      });
    });

    return result;
  }, [translations]);

  // ==================== ОБРОБНИКИ ====================
  // const handleCheckbox = (initials, checked) => {
  //   setSelectedVersions((prev) => {
  //     if (checked) {
  //       return [...new Set([...prev, initials])];
  //     } else {
  //       return prev.filter((v) => v !== initials);
  //     }
  //   });
  // };
  const handleCheckbox = (initials, checked) => {
    setSelectedVersions((prev) => {
      if (checked) {
        // Просто додаємо обрану версію, без жодних автоматичних супутників
        return [...new Set([...prev, initials])];
      } else {
        // Просто видаляємо
        return prev.filter((v) => v !== initials);
      }
    });
  };

  const handleApply = () => {
    if (selectedVersions.length === 0) {
      alert(lang.select_at_least_one || "Оберіть хоча б одну версію");
      return;
    }

    // Перевіряємо, чи є хоч один оригінал серед вибраних
    const hasOriginal = selectedVersions.some((ver) =>
      translationUtils.isOriginalInitials(ver),
    );

    if (!hasOriginal) {
      alert(lang.need_original || "Потрібно обрати хоча б один оригінал");
      return;
    }

    onSelectVersions(selectedVersions);
    onRequestClose();
  };

  // ==================== РЕНДЕРИНГ ====================
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="translation-selector-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
        <p>{lang.loading || "Завантаження перекладів..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="translation-selector-error">
        <div className="alert alert-danger">
          <h5>Помилка завантаження</h5>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={onRequestClose}>
            {lang.close || "Закрити"}
          </button>
        </div>
      </div>
    );
  }

  const currentGroup = groupedByOriginal[activeOriginalTab] || {
    original: null,
    translations: [],
  };

  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content stepModalFgBg">
            {/* Заголовок */}
            <div className="modal-header">
              <h5>{lang.select_translations || "Оберіть переклади"}</h5>
              <CloseIcon onClick={onRequestClose} />
            </div>

            {/* Таби за оригіналами */}
            <TranslationTabs
              lang={lang}
              activeTab={activeOriginalTab}
              onTabChange={setActiveOriginalTab}
            />

            <div className="modal-body">
              {/* Оригінал */}
              {currentGroup.original && (
                <div className="original-item mb-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id={`orig-${currentGroup.original.initials}`}
                      checked={selectedVersions.includes(
                        currentGroup.original.initials,
                      )}
                      onChange={(e) =>
                        handleCheckbox(
                          currentGroup.original.initials,
                          e.target.checked,
                        )
                      }
                    />
                    <label
                      htmlFor={`orig-${currentGroup.original.initials}`}
                      className="ms-2"
                    >
                      <strong>
                        [{currentGroup.original.initials}]{" "}
                        {currentGroup.original.name}
                      </strong>
                    </label>
                  </div>
                  {currentGroup.original.note && (
                    <small className="text-muted d-block mt-1 ms-4">
                      {currentGroup.original.note}
                    </small>
                  )}
                </div>
              )}

              {/* Переклади */}
              <div className="translations-list mt-3">
                {/* {currentGroup.translations.map((item) => (
                  <div key={item.initials} className="translation-item mb-2">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={`trans-${item.initials}`}
                        checked={selectedVersions.includes(item.initials)}
                        onChange={(e) =>
                          handleCheckbox(item.initials, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`trans-${item.initials}`}
                        className="ms-2"
                      >
                        <span className="fw-bold">
                          [{item.initials}] {item.name}
                        </span>
                      </label>
                    </div>
                    {item.note && (
                      <small className="text-muted d-block ms-4">
                        {item.note}
                      </small>
                    )}
                  </div>
                ))} */}
                {currentGroup.translations.map((item) => (
                  <div key={item.initials} className="translation-item mb-2">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={`trans-${item.initials}`}
                        checked={selectedVersions.includes(item.initials)}
                        onChange={(e) =>
                          handleCheckbox(item.initials, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`trans-${item.initials}`}
                        className="ms-2"
                      >
                        <span className="fw-bold">
                          [{item.initials}] {item.name}
                        </span>
                      </label>
                    </div>
                    {item.note && (
                      <small className="text-muted d-block ms-4">
                        {item.note}
                      </small>
                    )}
                  </div>
                ))}
              </div>

              {currentGroup.translations.length === 0 && (
                <div className="alert alert-info mt-3">
                  Для цього оригіналу поки немає відповідних перекладів.
                </div>
              )}
            </div>

            {/* Футер */}
            <TranslationFooter
              selectedCount={selectedVersions.length}
              onApply={handleApply}
              onCancel={onRequestClose}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationSelector;

// ==================================================== 29.01.2026
