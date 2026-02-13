// src/components/LexiconWindow.js
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "../elements/CloseIcon";
import "../styles/LexiconWindow.css";
import { globalHistoryManager } from "../utils/historyManager";

// import { loadStrongEntry } from "../utils/loadStrong";

const LexiconWindow = memo(
  ({
    data,
    lang,
    onClose,
    coreData,
    origVer,
    windowIndex,
    totalWindows,
    isEmpty,
    // Нові пропси для навігації
    historyState,
    onNavigateBack,
    onNavigateForward,
    isNarrowScreen = false,
  }) => {
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("dictionary");
    const [isTranslationDict, setIsTranslationDict] = useState(false);

    const windowRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const strong = data?.word?.strong;
    const dictCode = data?.word?.dict;

    useEffect(() => {
      console.log("📥 LexiconWindow отримав дані:", {
        word: data?.word?.word,
        strong: data?.word?.strong,
        dict: data?.word?.dict,
        origVer: origVer,
        timestamp: new Date().toISOString(),
      });

      if (!strong && !dictCode) {
        setLoading(false);
        setError("Немає даних для завантаження словника");
        // Додаємо порожній запис в історію для навігації
        addEmptyEntryToHistory();
        return;
      }

      setLoading(true);
      setError(null);
      setEntry(null);

      const loadDictionary = async () => {
        let entryAddedToHistory = false;
        try {
          // 1. СПОЧАТКУ пробуємо завантажити словник перекладу (dictCode)
          if (dictCode) {
            console.log(
              "📚 LexiconWindow: Завантаження словника перекладу",
              dictCode,
            );

            const [strongCode, langCode] = dictCode.split("_");
            const category = strongCode.startsWith("G") ? "G" : "H"; // ← ВИПРАВЛЕНО

            // Формуємо правильний шлях до словника перекладу
            const dictPath = `/data/dictionaries/${langCode.toLowerCase()}/${category}/${dictCode}.json`;

            console.log("📂 Правильний шлях до словника:", dictPath);

            try {
              const dictRes = await fetch(dictPath);
              if (dictRes.ok) {
                const dictData = await dictRes.json();
                console.log("✅ Словник перекладу завантажено успішно");

                // Обробка даних словника перекладу
                const dictEntry = dictData[strongCode] || dictData;
                // setIsTranslationDict(true);
                const dictLanguage = langCode.toLowerCase();
                setIsTranslationDict(dictLanguage !== "en"); // Тільки якщо не англійський

                setEntry({
                  strong: strongCode,
                  word: dictEntry.w || dictEntry.word || data?.word?.word || "",
                  translit: dictEntry.t || dictEntry.translit || "",
                  translation:
                    dictEntry.tr ||
                    dictEntry.translation ||
                    dictEntry.translation_uk ||
                    "",
                  morphology:
                    dictEntry.m ||
                    dictEntry.morphology ||
                    data?.word?.morph ||
                    "",
                  meanings: dictEntry.mn || dictEntry.meanings || [],
                  definitions: dictEntry.definitions || {},
                  lxx_usage: dictEntry.lxx_usage || [],
                  hebrew_equivalents: dictEntry.hebrew_equivalents || [],
                  usage_count: dictEntry.uc || dictEntry.usage_count || 0,
                  // _type: "translation_dictionary",
                  // _lang: langCode,
                  // Додаємо в запис:
                  _type:
                    dictLanguage === "uk"
                      ? "ukrainian_dictionary"
                      : dictLanguage === "ru"
                        ? "russian_dictionary"
                        : "english_dictionary",
                  _lang: dictLanguage,
                });
                // Позначаємо, що запис додано в історію
                entryAddedToHistory = true;
                setLoading(false);
                return true;
              } else {
                console.log(
                  "⚠️ Словник перекладу не знайдено за шляхом:",
                  dictPath,
                );
              }
            } catch (dictErr) {
              console.error(
                "❌ Помилка завантаження словника перекладу:",
                dictErr,
              );
            }
          }

          // 2. ЯКЩО немає словника перекладу або не знайдено - завантажуємо Strong's
          console.log(
            "🔍 LexiconWindow: Завантаження Strong's словника",
            strong,
          );

          try {
            const strongRes = await fetch(`/data/strongs/${strong}.json`);
            if (!strongRes.ok) {
              throw new Error(
                `HTTP ${strongRes.status}: Strong's словник не знайдено`,
              );
            }

            const strongData = await strongRes.json();
            console.log("✅ Strong's словник завантажено");

            // Обробка даних Strong's
            const strongEntry = strongData[strong] || strongData;
            setIsTranslationDict(false);

            setEntry({
              strong: strong,
              word: strongEntry.w || strongEntry.word || data?.word?.word || "",
              translit: strongEntry.t || strongEntry.translit || "",
              translation: strongEntry.tr || strongEntry.translation || "",
              morphology:
                strongEntry.m ||
                strongEntry.morphology ||
                data?.word?.morph ||
                "",
              meanings: strongEntry.mn || strongEntry.meanings || [],
              definition: strongEntry.d || strongEntry.definition || "",
              lsj_definition_raw:
                strongEntry.lsj || strongEntry.lsj_definition_raw || "",
              grammar: strongEntry.g || strongEntry.grammar || "",
              usages_count: strongEntry.u || strongEntry.usages_count || 0,
              _type: "strongs_dictionary",
            });
            // Позначаємо, що запис додано в історію
            entryAddedToHistory = true;
            return;
          } catch (strongErr) {
            console.error("❌ Помилка завантаження Strong's:", strongErr);
            throw strongErr;
          }
        } catch (err) {
          console.error(
            "❌ LexiconWindow: Загальна помилка завантаження словника",
            err,
          );
          setError(`Помилка завантаження: ${err.message}`);

          // Якщо не вдалося завантажити - створюємо базовий запис
          // ВИПРАВЛЕННЯ: Створюємо мінімальний fallback як повноцінний entry (без isError, з даними з data.word)
          if (data?.word) {
            // setEntry({
            //   strong: strong,
            //   word: data.word.word || "",
            //   translation: data.word.lemma || "",
            //   morphology: data.word.morph || "",
            //   dictCode: dictCode,
            //   _type: "fallback",
            //   _error: `Не вдалося завантажити словник: ${err.message}`,
            // });
            setEntry({
              strong: strong || data.word.strong || "",
              word: data.word.word || "",
              translation: data.word.lemma || "",
              morphology: data.word.morph || "",
              dictCode: dictCode || data.word.dict || "",
              _type: "minimal_fallback", // ВИПРАВЛЕННЯ: Новий тип для мінімального
              _message: "Повні дані відсутні", // Повідомлення для рендеру
            });
            // Додаємо запис з помилкою в історію
            // Додаємо як звичайний запис (не помилковий)
            // addErrorEntryToHistory(err.message);
            addMinimalEntryToHistory(); // ВИПРАВЛЕННЯ: Нова функція для мінімального
            entryAddedToHistory = true;
          } else {
            setError(`Помилка завантаження: ${err.message}`);
          }
        } finally {
          setLoading(false);
          // Якщо не додано запис в історію (не знайдено файл) - додаємо порожній
          if (!entryAddedToHistory && strong) {
            addEmptyEntryToHistory();
          }
        }
      };

      loadDictionary();
    }, [strong, dictCode, data?.word, origVer]);

    // Додаємо нові функції для обробки історії
    const addEmptyEntryToHistory = useCallback(() => {
      if (!data?.word) return;

      // ВИПРАВЛЕННЯ: Динамічне isOriginal для порожніх
      const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
        origVer?.toUpperCase() || "",
      );

      const emptyEntry = {
        id: `empty_${Date.now()}`,
        data: data,
        origVer: origVer,
        word: {
          word: data.word.word || "",
          strong: data.word.strong || "",
          lemma: data.word.lemma || "",
          morph: data.word.morph || "",
          dict: data.word.dict || "",
        },
        lang: data.word.strong?.startsWith("H") ? "he" : "gr",
        isOriginal: false,
        timestamp: Date.now(),
        isEmpty: true,
      };

      // Оновлюємо глобальну історію
      const manager = globalHistoryManager.getManager("global");
      manager.addEntry(emptyEntry);
    }, [data, origVer]);

    // const addErrorEntryToHistory = useCallback(
    //   (errorMessage) => {
    //     if (!data?.word) return;

    //     const errorEntry = {
    //       id: `error_${Date.now()}`,
    //       data: data,
    //       origVer: origVer,
    //       word: {
    //         word: data.word.word || "",
    //         strong: data.word.strong || "",
    //         lemma: data.word.lemma || "",
    //         morph: data.word.morph || "",
    //         dict: data.word.dict || "",
    //       },
    //       lang: data.word.strong?.startsWith("H") ? "he" : "gr",
    //       isOriginal: false,
    //       timestamp: Date.now(),
    //       isError: true,
    //       error: errorMessage,
    //     };

    //     // Оновлюємо глобальну історію
    //     const manager = globalHistoryManager.getManager("global");
    //     manager.addEntry(errorEntry);
    //   },
    //   [data, origVer],
    // );

    const addMinimalEntryToHistory = useCallback(() => {
      // ВИПРАВЛЕННЯ: Нова функція для мінімального fallback
      if (!data?.word) return;

      const isOriginal = ["LXX", "THOT", "TR", "GNT"].includes(
        origVer?.toUpperCase() || "",
      );

      const minimalEntry = {
        id: `minimal_${Date.now()}`,
        data: data,
        origVer: origVer,
        word: {
          word: data.word.word || "",
          strong: data.word.strong || "",
          lemma: data.word.lemma || "",
          morph: data.word.morph || "",
          dict: data.word.dict || "",
        },
        lang: data.word.strong?.startsWith("H") ? "he" : "gr",
        isOriginal: isOriginal,
        timestamp: Date.now(),
        _type: "minimal_fallback",
      };

      const manager = globalHistoryManager.getManager("global");
      manager.addEntry(minimalEntry);
    }, [data, origVer]);
    // ... (інші функції без змін: addErrorEntryToHistory видалено, бо fallback не помилковий)

    // Ефект для свайпу ... (без змін)

    // Обробники кліків на стрілки ... (без змін)

    // Функції рендеру (parseRef, renderWithLinks тощо) ... (без змін)

    // renderHeader() ... (без змін, заголовок показує strong)

    // renderSwipeIndicator() ... (без змін)

    // Ефект для свайпу на мобільних пристроях 23.01.2026
    useEffect(() => {
      if (!isNarrowScreen || !windowRef.current) return;

      const element = windowRef.current;

      const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
      };

      const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleSwipe();
      };

      const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff < 0 && historyState?.canGoBack && onNavigateBack) {
            onNavigateBack();
          } else if (
            diff > 0 &&
            historyState?.canGoForward &&
            onNavigateForward
          ) {
            onNavigateForward();
          }
        }
      };

      element.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isNarrowScreen, historyState, onNavigateBack, onNavigateForward]);

    // Обробники кліків на стрілки навігації
    const handleBackClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (historyState?.canGoBack && onNavigateBack) {
          onNavigateBack();
        }
      },
      [historyState, onNavigateBack],
    );

    const handleForwardClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (historyState?.canGoForward && onNavigateForward) {
          onNavigateForward();
        }
      },
      [historyState, onNavigateForward],
    );
    // ============================ Ефект для свайпу на мобільних пристроях 23.01.2026 end

    // Обробка посилань у тексті
    const parseRef = (ref) => {
      const match = ref.match(/([A-Z]+)\.(\d+):(\d+)/);
      if (!match) return null;
      const [, book, ch, v] = match;

      const testament = book.match(
        /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
      )
        ? "NewT"
        : "OldT";

      let bookData = null;
      if (coreData) {
        const versions = ["lxx", "thot", "tr", "gnt"];
        for (const ver of versions) {
          if (coreData[ver] && coreData[ver][testament]) {
            bookData = coreData[ver][testament]
              .flatMap((g) => g.books)
              .find((b) => b.code === book);
            if (bookData) break;
          }
        }
      }

      if (!bookData) return null;
      return { book: bookData.code, chapter: ch, verse: v };
    };

    const renderWithLinks = (text) => {
      if (!text || typeof text !== "string") return text;

      return text
        .split(/(\[[^\]]+\]|\([^\)]+\)|\b[A-Z]+\.\d+:\d+\b)/g)
        .map((part, i) => {
          if (part.match(/^\[[^\]]+\]$/)) {
            return (
              <sup key={i} className="text-muted">
                [посилання]
              </sup>
            );
          }
          if (part.match(/^\([^\)]+\)$/)) {
            return (
              <span key={i} className="text-muted">
                {part}
              </span>
            );
          }
          const ref = parseRef(part);
          if (ref) {
            return (
              <Link
                key={i}
                to={`/?ref=${ref.book}.${ref.chapter}#v${ref.verse}`}
                className="text-primary text-decoration-underline"
                title={`Відкрити ${ref.book} ${ref.chapter}:${ref.verse}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Перехід до:", ref);
                }}
              >
                {part}
              </Link>
            );
          }
          return part;
        });
    };

    const renderLSJ = (text) => {
      if (!text || text.trim() === "") {
        return <p className="text-muted p-3">Немає даних LSJ</p>;
      }

      const sections = text.split(/__(.+?)__/).filter(Boolean);
      if (sections.length === 0) {
        return (
          <p
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
          />
        );
      }

      return sections.map((sec, i) => {
        if (i % 2 === 0) {
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: sec.replace(/\n/g, "<br>") }}
            />
          );
        } else {
          return (
            <h6 key={i} className="mt-3 text-primary">
              {sec}
            </h6>
          );
        }
      });
    };

    const renderMeanings = (meanings) => {
      if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
        return <p className="text-muted p-3">Немає значень</p>;
      }

      return (
        <ul className="list-unstyled">
          {meanings.map((meaning, i) => (
            <li key={i} className="mb-2">
              {typeof meaning === "string"
                ? renderWithLinks(meaning)
                : String(meaning)}
            </li>
          ))}
        </ul>
      );
    };

    const renderDefinitions = (definitions) => {
      if (!definitions || typeof definitions !== "object") {
        return null;
      }

      return (
        <div className="definitions-content">
          {Object.entries(definitions).map(([key, value]) => (
            <div key={key} className="mb-3">
              <h6 className="text-primary">
                {key.replace("_", " ").toUpperCase()}:
              </h6>
              {typeof value === "object" ? (
                <ul className="list-unstyled ms-3">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey} className="mb-1">
                      <strong>{subKey}:</strong> {String(subValue)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      );
    };

    const renderLXXUsage = (usage) => {
      if (!usage || !Array.isArray(usage) || usage.length === 0) {
        return null;
      }

      return (
        <div className="lxx-usage mt-3">
          <h6 className="text-primary">Використання в LXX:</h6>
          <ul className="list-unstyled">
            {usage.map((item, i) => (
              <li key={i} className="mb-2 small">
                {renderWithLinks(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    const renderHebrewEquivalents = (equivalents) => {
      if (
        !equivalents ||
        !Array.isArray(equivalents) ||
        equivalents.length === 0
      ) {
        return null;
      }

      return (
        <div className="hebrew-equivalents mt-3">
          <h6 className="text-primary">Єврейські еквіваленти:</h6>
          <ul className="list-unstyled">
            {equivalents.map((item, i) => (
              <li key={i} className="mb-1">
                {renderWithLinks(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    // Додайте функцію для отримання назви мови:
    const getLanguageName = (langCode) => {
      const languages = {
        uk: "українська",
        en: "англійська",
        ru: "російська",
        gr: "грецька",
        he: "єврейська",
      };
      return languages[langCode] || langCode;
    };

    // Заголовок з навігацією
    const renderHeader = () => {
      // Визначаємо тип вікна для заголовка
      let windowType = "";
      if (isNarrowScreen) {
        windowType = "Словник";
      } else {
        windowType = windowIndex === 0 ? "Orig" : "Trans";
      }

      // ВИПРАВЛЕННЯ: Для помилкових/порожніх станів використовуємо fallback дані з entry або data
      const headerStrong = entry?.strong || strong || dictCode || "Словник"; // Додано fallback для помилок
      const headerWord = entry?.word || data?.word?.word || "Словник"; // Додано fallback

      return (
        <div className="lexicon-header-with-nav">
          <div className="nav-controls">
            <button
              className={`nav-arrow ${!historyState?.canGoBack ? "disabled" : ""}`}
              onClick={handleBackClick}
              disabled={!historyState?.canGoBack}
              title="Назад"
            >
              ‹
            </button>

            <span className="nav-position">
              {historyState?.position || "1/1"}
            </span>

            <button
              className={`nav-arrow ${!historyState?.canGoForward ? "disabled" : ""}`}
              onClick={handleForwardClick}
              disabled={!historyState?.canGoForward}
              title="Вперед"
            >
              ›
            </button>
          </div>

          <div className="lexicon-title-content">
            {/* <div>
              <strong>{entry?.word || data?.word?.word || "Словник"}</strong>
              <small className="text-muted ms-2">
                • {entry?.strong || strong}
                <span className="window-type-badge ms-2">{windowType}</span>
              </small>
            </div> */}
            <div>
              <strong>{headerWord}</strong>{" "}
              {/* ВИПРАВЛЕННЯ: Використовуємо fallback слово */}
              {/* {entry?.translit && ` (${entry.translit})`} */}
              <small className="text-muted ms-2">
                • {headerStrong}{" "}
                {/* ВИПРАВЛЕННЯ: Використовуємо fallback код */}
                <span className="window-type-badge ms-2">{windowType}</span>
              </small>
            </div>
          </div>

          {onClose && <CloseIcon onClick={onClose} />}
        </div>
      );
    };

    // Індикатор свайпу для мобільних
    const renderSwipeIndicator = () => {
      if (!isNarrowScreen) return null;

      return (
        <div className="swipe-indicator">
          <small className="swipe-indicator-arrow p-0">
            {historyState?.canGoBack && " ← "}
            {historyState?.canGoBack && historyState?.canGoForward && " • "}
            {historyState?.canGoForward && " → "}
          </small>
        </div>
      );
    };

    if (isEmpty) {
      return (
        <div className="lexicon-window empty-window" ref={windowRef}>
          {renderHeader()}
          <div className="text-muted text-center p-3">
            <small>Оберіть слово</small>
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    if (!strong && !dictCode) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          {renderHeader()}
          <div className="text-muted text-center p-3 lexicon-content">
            Оберіть слово
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          {renderHeader()}
          <div className="p-3 text-center lexicon-content">
            <div
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            >
              <span className="visually-hidden dictionary-content">
                Завантаження...
              </span>
            </div>
            Завантаження словника...
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    if (error || !entry) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          {renderHeader()}
          <div className="p-3 text-danger text-center lexicon-content-error">
            {error || "Дані відсутні"}
            <div className="mt-2 small text-muted dictionary-content-error">
              {dictCode && <div>Словник: {dictCode}</div>}
              {strong && <div>Strong: {strong}</div>}
              {entry?._type && <div>Тип: {entry._type}</div>}
            </div>
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    return (
      <div className="lexicon-window" ref={windowRef}>
        {renderHeader()}

        {/* <div className="lexicon-tabs">
          <button
            className={activeTab === "dictionary" ? "active" : ""}
            onClick={() => setActiveTab("dictionary")}
          >
            {isTranslationDict ? "Словник uk" : "Словник"}
          </button>

          {entry.meanings && entry.meanings.length > 0 && (
            <button
              className={activeTab === "meanings" ? "active" : ""}
              onClick={() => setActiveTab("meanings")}
            >
              Значення ({entry.meanings.length})
            </button>
          )}

          {entry.definitions && Object.keys(entry.definitions).length > 0 && (
            <button
              className={activeTab === "definitions" ? "active" : ""}
              onClick={() => setActiveTab("definitions")}
            >
              Визначення
            </button>
          )}

          {entry.lxx_usage && entry.lxx_usage.length > 0 && (
            <button
              className={activeTab === "lxx" ? "active" : ""}
              onClick={() => setActiveTab("lxx")}
            >
              LXX ({entry.lxx_usage.length})
            </button>
          )}

          {entry.lsj_definition_raw && entry.lsj_definition_raw.trim() && (
            <button
              className={activeTab === "lsj" ? "active" : ""}
              onClick={() => setActiveTab("lsj")}
            >
              LSJ
            </button>
          )}

          {(entry.grammar || entry.morphology) && (
            <button
              className={activeTab === "grammar" ? "active" : ""}
              onClick={() => setActiveTab("grammar")}
            >
              Граматика
            </button>
          )}
        </div> */}
        <div className="lexicon-tabs">
          <button
            className={activeTab === "dictionary" ? "active" : ""}
            onClick={() => setActiveTab("dictionary")}
          >
            {isTranslationDict
              ? entry?._lang === "uk"
                ? "Словник uk"
                : lang.dictionary_tab || "Словник"
              : lang.strongs_dict || "Strong's Dict"}
          </button>

          {entry.meanings && entry.meanings.length > 0 && (
            <button
              className={activeTab === "meanings" ? "active" : ""}
              onClick={() => setActiveTab("meanings")}
            >
              {lang.meanings_tab || "Значення"} ({entry.meanings.length})
            </button>
          )}

          {entry.definitions && Object.keys(entry.definitions).length > 0 && (
            <button
              className={activeTab === "definitions" ? "active" : ""}
              onClick={() => setActiveTab("definitions")}
            >
              {lang.definitions_tab || "Визначення"}
            </button>
          )}

          {entry.lxx_usage && entry.lxx_usage.length > 0 && (
            <button
              className={activeTab === "lxx" ? "active" : ""}
              onClick={() => setActiveTab("lxx")}
            >
              {lang.lxx_usage_tab || "LXX Usage"} ({entry.lxx_usage.length})
            </button>
          )}

          {entry.lsj_definition_raw && entry.lsj_definition_raw.trim() && (
            <button
              className={activeTab === "lsj" ? "active" : ""}
              onClick={() => setActiveTab("lsj")}
            >
              {lang.lsj_tab || "LSJ"}
            </button>
          )}

          {(entry.grammar || entry.morphology) && (
            <button
              className={activeTab === "grammar" ? "active" : ""}
              onClick={() => setActiveTab("grammar")}
            >
              {lang.grammar_tab || "Граматика"}
            </button>
          )}
        </div>

        <div className="lexicon-content">
          {activeTab === "dictionary" && (
            <div className="dictionary-content">
              {/* ВИПРАВЛЕННЯ: Для _type: "minimal_fallback" - показуємо мінімальні дані + повідомлення */}
              {entry._type === "minimal_fallback" && (
                <div className="alert alert-warning mb-3">
                  Повні дані відсутні
                </div>
              )}
              {/* {entry.word && (
                <div className="lex-item">
                  <span className="label">Слово:</span>
                  <span
                    className={`value ${
                      entry.strong?.startsWith("H") ? "he" : "gr"
                    }`}
                  >
                    {entry.word}
                  </span>
                </div>
              )}

              {entry.translit && (
                <div className="lex-item">
                  <span className="label">Трансліт:</span>
                  <span className="value">{entry.translit}</span>
                </div>
              )}

              {entry.translation && (
                <div className="lex-item">
                  <span className="label">Переклад:</span>
                  <span className="value uk">{entry.translation}</span>
                </div>
              )}

              {entry.morphology && (
                <div className="lex-item">
                  <span className="label">Морфологія:</span>
                  <span className="value">{entry.morphology}</span>
                </div>
              )}

              {entry.usage_count > 0 && (
                <div className="lex-item">
                  <span className="label">Вживань:</span>
                  <span className="value">{entry.usage_count}</span>
                </div>
              )} */}
              {entry.word && (
                <div className="lex-item">
                  <span className="label">{lang.word || "Слово"}:</span>
                  <span
                    className={`value ${entry.strong?.startsWith("H") ? "he" : "gr"}`}
                  >
                    {entry.word}
                  </span>
                </div>
              )}

              {entry.translit && (
                <div className="lex-item">
                  <span className="label">{lang.translit || "Трансліт"}:</span>
                  <span className="value">{entry.translit}</span>
                </div>
              )}

              {entry.translation && (
                <div className="lex-item">
                  <span className="label">
                    {lang.translation || "Переклад"}:
                  </span>
                  <span className="value uk">{entry.translation}</span>
                </div>
              )}

              {entry.morphology && (
                <div className="lex-item">
                  <span className="label">
                    {lang.morphology || "Морфологія"}:
                  </span>
                  <span className="value">{entry.morphology}</span>
                </div>
              )}

              {entry.usage_count > 0 && (
                <div className="lex-item">
                  <span className="label">
                    {lang.usage_count || "Вживань"}:
                  </span>
                  <span className="value">{entry.usage_count}</span>
                </div>
              )}

              {/* Додаткова інформація для словників перекладів */}
              {isTranslationDict && (
                <>
                  {renderHebrewEquivalents(entry.hebrew_equivalents)}
                  {renderLXXUsage(entry.lxx_usage)}
                </>
              )}
            </div>
          )}

          {activeTab === "meanings" && (
            <div className="meanings-content">
              {renderMeanings(entry.meanings)}
            </div>
          )}

          {activeTab === "definitions" && entry.definitions && (
            <div className="definitions-content">
              {renderDefinitions(entry.definitions)}
            </div>
          )}

          {activeTab === "lxx" && entry.lxx_usage && (
            <div className="lxx-content">{renderLXXUsage(entry.lxx_usage)}</div>
          )}

          {activeTab === "lsj" && (
            <div className="lsj-content">
              {renderLSJ(entry.lsj_definition_raw)}
            </div>
          )}

          {activeTab === "grammar" && (
            <div className="grammar-content">
              {entry.morphology && (
                <div className="mb-3">
                  <h6>Морфологія:</h6>
                  <pre className="bg-light rounded p-2 small">
                    {entry.morphology}
                  </pre>
                </div>
              )}
              {entry.grammar && (
                <div>
                  <h6>Граматика:</h6>
                  <pre className="bg-light rounded p-2 small">
                    {entry.grammar}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lexicon-footer  border-top small ps-1 pe-2 ">
          {entry._type === "strongs_dictionary" ? (
            <div className="d-flex justify-content-between align-items-center ">
              <span className="text-primary "> • Strong's Dict •</span>
              <span>{renderSwipeIndicator()}</span>
              <span className="badge mr-5px bg-primary">uk</span>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-success">• Словник •</span>
              <span>{renderSwipeIndicator()}</span>
              <span
                className={`badge bg-${
                  entry._lang === "uk" ? "success" : "info"
                }`}
              >
                {entry._lang.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default LexiconWindow;

// ========================= 29.01.2026
