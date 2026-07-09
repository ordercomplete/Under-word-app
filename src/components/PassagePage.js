// src/components/PassagePage.js - 09.07.2026 (модифіковано для незалежних панелей)
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import InterlinearVerse from "./InterlinearVerse";
import LexiconWindow from "./LexiconWindow";
import { logger } from "../utils/logger";
import { chapterCache } from "../utils/cacheManager";
import "../styles/PassagePage.css";
import { isMobile } from "../utils/deviceDetector";

import { globalHistoryManager } from "../utils/historyManager";
import { getHistory, saveVisit, saveAllVisits } from "../utils/visitHistory";
import { getDefaultVersions } from "../utils/defaultVersions";
import translationUtils from "../utils/translationUtils";

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================
const getTestamentStatic = (bookCode) => {
  const newTestamentBooks = [
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
  return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
};

// ==================== КЕШ МЕНЕДЖЕР ====================
const useChapterCache = () => {
  const cache = useRef(chapterCache);

  const get = useCallback((key) => {
    return cache.current.get(key);
  }, []);

  const set = useCallback((key, data) => {
    cache.current.set(key, data);
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return { get, set, clear };
};

// ==================== ПАНЕЛЬ ====================
const Panel = memo(
  ({
    id,
    onClose,
    disableClose,
    coreData,
    coreLoading,
    lang,
    onWordClick,
    onNewPanel,
    isNarrowScreen,
    initialRef,
    initialVersions,
    onNavigateToRef,
    onPanelChange, // НОВИЙ ПРОПС для оновлення стану в PassagePage
  }) => {
    const { get: getCache, set: setCache } = useChapterCache();
    // Локальне стан кожної панелі
    const [panelRef, setPanelRef] = useState(initialRef || "GEN.1");
    const [panelVersions, setPanelVersions] = useState(initialVersions || []);

    // Оновлення стану панелей в PassagePage при зміні локального стану
    // Використовуємо ref для відстеження попередніх значень і уникнути циклів
    const prevPanelRef = useRef(panelRef);
    const prevPanelVersions = useRef(panelVersions);
    useEffect(() => {
      // Викликаємо тільки якщо значення справді змінилися (не синхронізація з initialRef)
      if (
        onPanelChange &&
        (prevPanelRef.current !== panelRef ||
          prevPanelVersions.current !== panelVersions)
      ) {
        onPanelChange(id, panelRef, panelVersions);
        prevPanelRef.current = panelRef;
        prevPanelVersions.current = panelVersions;
      }
    }, [panelRef, panelVersions, id, onPanelChange]);
    const [chapterData, setChapterData] = useState({});
    const [loading, setLoading] = useState(false);
    const [translationsData, setTranslationsData] = useState(null);

    // Ref для скасування поточного fetch-запиту при швидкій навігації
    const fetchControllerRef = useRef(null);
    // Лічильник для визначення найсвіжішого запиту (запобігає race conditions)
    const latestFetchIdRef = useRef(0);

    // Синхронізація з initialRef/initialVersions при зміні з зовні
    // ВИПРАВЛЕННЯ: Реагуємо тільки при зміні через key (якщо initialRef відрізняється від поточного)
    // Це запобігає циклу: setPanelRef -> onPanelChange -> setPanels -> initialRef змінюється
    const isSyncingRef = useRef(false);
    useEffect(() => {
      // Синхронізуємо тільки якщо це не відбувається вже (запобігаємо рекурсії)
      if (!isSyncingRef.current && initialRef && initialRef !== panelRef) {
        isSyncingRef.current = true;
        setPanelRef(initialRef);
        // Скидаємо флаг через мікроподібну
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 0);
      }
    }, [initialRef]);

    useEffect(() => {
      if (
        !isSyncingRef.current &&
        initialVersions &&
        JSON.stringify(initialVersions.sort()) !==
          JSON.stringify(panelVersions.sort())
      ) {
        isSyncingRef.current = true;
        setPanelVersions(initialVersions);
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 0);
      }
    }, [initialVersions]);

    // Флаг для відзначення, що версії вже були встановлені з закладки
    // Використовуємо для запобігання заміни версій після відкриття закладки
    const isFromBookmark = useRef(false);
    useEffect(() => {
      // Перевіряємо чи ця панель була встановлена з закладки
      // (перевіряємо по _fromBookmark в panel об'єкті)
      // Це робиться в useEffect нижче
    }, []);

    // Завантаження translations.json
    useEffect(() => {
      const loadTranslations = async () => {
        try {
          const response = await fetch("/data/translations.json");
          if (response.ok) {
            const data = await response.json();
            setTranslationsData(data);

            // НЕ викликаємо getDefaultVersions якщо версії вже були встановлені з закладки
            // Перевіряємо чи ці версії мають оригінал (закладка не може передати порожні версії)
            const hasOriginal = panelVersions.some((ver) =>
              translationUtils.isOriginalInitials(ver),
            );

            // Якщо вже є оригінал - не змінюємо версії
            if (hasOriginal) {
              return;
            }

            const [book] = panelRef.split(".");
            if (!panelVersions || panelVersions.length === 0) {
              const defaultVersions = getDefaultVersions(book, data);
              if (defaultVersions.length > 0) {
                setPanelVersions(defaultVersions);
              }
            }
          }
        } catch (error) {
          logger.error("Помилка завантаження translations.json:", error);
        }
      };

      loadTranslations();
    }, [panelRef, panelVersions]);

    const getTestament = useCallback((bookCode) => {
      const newTestamentBooks = [
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
      return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
    }, []);

    // Завантаження глави з кешем (з AbortController для запобігання race conditions)
    useEffect(() => {
      if (panelVersions.length === 0) return;

      const [book, chapterStr] = panelRef.split(".");
      const chapter = parseInt(chapterStr);
      if (!book || !chapter) return;
      const cacheKey = `${book}.${chapter}.${panelVersions.join(",")}`;
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        logger.debug(`Кеш HIT: ${cacheKey}`);
        setChapterData(cachedData);
        return;
      }

      // Корекція версій при зміні книги
      if (translationsData) {
        const testament = getTestament(book);
        const correctedVersions = panelVersions.filter((ver) => {
          return translationUtils.supportsTestament(ver, testament);
        });

        const hasOriginal = correctedVersions.some((ver) =>
          translationUtils.isOriginalInitials(ver),
        );

        if (correctedVersions.length === 0 || !hasOriginal) {
          const defaultVersions = getDefaultVersions(book, translationsData);
          if (defaultVersions.length > 0) {
            setPanelVersions(defaultVersions);
            return; // Перезапустимо ефект з новими версіями
          }
        }
      }

      // Скасовуємо попередній запит, якщо він ще виконується
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }

      // Створюємо новий AbortController для поточного запиту
      const controller = new AbortController();
      fetchControllerRef.current = controller;
      const fetchId = ++latestFetchIdRef.current;

      logger.debug(`Кеш MISS: ${cacheKey} (fetchId: ${fetchId})`);
      setLoading(true);

      const loadPromises = panelVersions.map(async (ver) => {
        // Якщо запит вже скасовано — не виконуємо
        if (controller.signal.aborted) return { ver, data: [] };

        const testament = getTestament(book);
        const isOriginal = translationUtils.isOriginal(ver);
        const base = isOriginal ? "originals" : "translations";
        const verLower = ver.toLowerCase();
        const bookLower = book.toLowerCase();

        if (!translationUtils.supportsTestament(ver, testament)) {
          logger.debug(`Пропускаємо ${ver} для ${book} (несумісність)`);
          return { ver, data: [] };
        }

        const url = `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;

        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return { ver, data: data.verses || [] };
        } catch (error) {
          // AbortError — це нормально, просто ігноруємо
          if (error.name === "AbortError") {
            logger.debug(`Запит ${ver} скасовано (fetchId: ${fetchId})`);
            return { ver, data: [] };
          }
          // Інші помилки — повертаємо порожні дані без блокування
          logger.debug(`Помилка завантаження ${ver}: ${error.message}`);
          return { ver, data: [] };
        }
      });

      Promise.all(loadPromises)
        .then((results) => {
          // Якщо з'явився новіший запит — ігноруємо результати
          if (fetchId !== latestFetchIdRef.current) {
            logger.debug(
              `Пропускаємо застарілий результат (fetchId: ${fetchId})`,
            );
            return;
          }

          const newData = {};
          results.forEach(({ ver, data }) => {
            newData[ver] = data;
          });

          setCache(cacheKey, newData);
          setChapterData(newData);
        })
        .catch((error) => {
          // Помилка Promise.all (наприклад, якщо всі fetch були скасовані)
          if (error.name === "AbortError") return;
          logger.error("Помилка завантаження глави:", error);
        })
        .finally(() => {
          // Оновлюємо loading тільки якщо це все ще актуальний запит
          if (fetchId === latestFetchIdRef.current) {
            setLoading(false);
          }
        });

      // Cleanup: скасовуємо запит при демонтажі компонента або повторному запуску ефекту
      return () => {
        controller.abort();
      };
    }, [
      panelRef,
      panelVersions,
      getTestament,
      getCache,
      setCache,
      translationsData,
    ]);

    // Формування пар для InterlinearVerse
    const pairs = useMemo(() => {
      if (!translationsData) return [];

      const [book] = panelRef.split(".");
      const testament = getTestament(book);
      const pairs = [];

      const originals = panelVersions.filter((v) =>
        translationUtils.isOriginalInitials(v),
      );

      const translations = panelVersions.filter(
        (v) => !translationUtils.isOriginalInitials(v),
      );

      if (translations.length > 0 && originals.length === 0) {
        pairs.push({ original: null, translations, testament });
      }

      originals.forEach((original) => {
        const relatedTranslations = translations.filter((trans) => {
          const transInfo = translationsData?.bibles?.find(
            (b) => b.initials === trans,
          );
          if (!transInfo?.basedOn) return false;

          if (testament === "OldT") {
            return transInfo.basedOn.old_testament === original.toLowerCase();
          } else {
            return transInfo.basedOn.new_testament === original.toLowerCase();
          }
        });

        pairs.push({
          original: original,
          translations: relatedTranslations,
          testament: testament,
        });
      });

      if (originals.length === 0 && translations.length > 0) {
        pairs.push({
          original: null,
          translations: translations,
          testament: testament,
        });
      }

      return pairs;
    }, [panelVersions, translationsData, panelRef, getTestament]);

    // Номери віршів
    const verseNumbers = useMemo(() => {
      const verseSet = new Set();

      Object.values(chapterData).forEach((data) => {
        if (Array.isArray(data)) {
          data.forEach((verse) => {
            const vNum = verse.verse || verse.v || verse.vid;
            if (vNum && !isNaN(vNum)) {
              verseSet.add(parseInt(vNum));
            }
          });
        }
      });

      if (verseSet.size === 0) return [];

      const sorted = Array.from(verseSet).sort((a, b) => a - b);
      return sorted;
    }, [chapterData]);

    // Навігація для панелі
    const handlePrevChapter = useCallback(() => {
      const [b, c] = panelRef.split(".");
      const nc = Math.max(1, parseInt(c) - 1);
      const newRef = `${b}.${nc}`;
      setPanelRef(newRef);
    }, [panelRef]);

    const handleNextChapter = useCallback(() => {
      const [b, c] = panelRef.split(".");
      const nc = parseInt(c) + 1;

      const testament = getTestament(b);
      const versionKey = panelVersions[0]?.toLowerCase();

      if (coreData[versionKey] && coreData[versionKey][testament]) {
        const books = coreData[versionKey][testament].flatMap((g) => g.books);
        const bookInfo = books.find((bk) => bk.code === b);

        if (bookInfo && nc <= bookInfo.chapters) {
          const newRef = `${b}.${nc}`;
          setPanelRef(newRef);
        }
      } else {
        const newRef = `${b}.${nc}`;
        setPanelRef(newRef);
      }
    }, [panelRef, panelVersions, coreData, getTestament]);

    // Встановлення ref в цій панелі
    const handleSetRef = useCallback((newRef) => {
      setPanelRef(newRef);
    }, []);

    // Свайп для перемикання розділів (тільки мобільний режим)
    const chapterViewerRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
      if (!isNarrowScreen || !chapterViewerRef.current) return;

      const element = chapterViewerRef.current;

      const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      };

      const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleChapterSwipe(e);
      };

      const handleChapterSwipe = (e) => {
        if (!e?.changedTouches?.[0]) return;

        const diffX = touchStartX.current - touchEndX.current;
        const diffY = Math.abs(
          touchStartY.current - e.changedTouches[0].clientY,
        );

        if (diffY > Math.abs(diffX) * 1.8) return;

        const threshold = 60;

        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            handleNextChapter?.();
          } else {
            handlePrevChapter?.();
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
    }, [isNarrowScreen, handlePrevChapter, handleNextChapter]);

    return (
      <div className="panel">
        <PassageOptionsGroup
          lang={lang}
          currentRef={panelRef}
          setCurrentRef={handleSetRef}
          versions={panelVersions}
          setVersions={setPanelVersions}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          onNewPanel={onNewPanel}
          onClosePanel={() => onClose(id)}
          disableClose={disableClose}
          coreData={coreData}
          coreLoading={coreLoading}
        />

        <div
          className="chapter-viewer flex-fill overflow-auto"
          ref={chapterViewerRef}
        >
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">{lang?.loading || "Завантаження..."}</p>
            </div>
          ) : verseNumbers.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <p>Дані глави відсутні</p>
              <small>Спробуйте іншу книгу або переклад</small>
            </div>
          ) : (
            <>
              <h6 className="text-center">{panelRef}</h6>
              {isNarrowScreen && (
                <div className="chapter-swipe-indicator">
                  <small>‹ свайп для зміни розділу ›</small>
                </div>
              )}
              {verseNumbers.map((verseNum, index) => (
                <InterlinearVerse
                  key={verseNum}
                  verseNum={verseNum}
                  pairs={pairs}
                  chapterData={chapterData}
                  onWordClick={onWordClick}
                  isFirstInChapter={index === 0}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  },
);

// ==================== ОСНОВНИЙ КОМПОНЕНТ ====================
const PassagePage = memo(({ lang }) => {
  const [translationsData, setTranslationsData] = useState(null);

  // Кожна панель має власний стан: { id, ref, versions }
  const [panels, setPanels] = useState([
    { id: Date.now(), ref: "GEN.1", versions: [] },
  ]);
  const initializedRef = useRef(false);

  // Завантаження translations.json для дефолтних версій
  useEffect(() => {
    fetch("/data/translations.json")
      .then((res) => res.json())
      .then((data) => setTranslationsData(data))
      .catch((err) => {
        console.error("Помилка завантаження translations.json:", err);
        setTranslationsData({ bibles: [] });
      });
  }, []);

  // Відновлення стану панелей з localStorage (після першого рендеру)
  useEffect(() => {
    if (initializedRef.current) return;
    if (!translationsData) return; // Чекаємо на translationsData

    initializedRef.current = true;

    try {
      const saved = localStorage.getItem("last_panel_state");
      const getDefaultVersionsForBook = (bookCode) => {
        const testament = getTestamentStatic(bookCode);
        const defaultOriginal = translationsData.bibles.find(
          (b) =>
            b.type === "original" &&
            b.isDefault === true &&
            b.testaments?.includes(testament),
        );
        if (!defaultOriginal) return [];

        const defaultTranslation = translationsData.bibles.find((b) => {
          if (b.type !== "translation" || b.isDefault !== true) return false;
          if (!b.testaments?.includes(testament)) return false;
          const basedOnKey =
            testament === "OldT" ? "old_testament" : "new_testament";
          return (
            b.basedOn?.[basedOnKey] === defaultOriginal.initials.toLowerCase()
          );
        });

        return defaultTranslation
          ? [defaultOriginal.initials, defaultTranslation.initials]
          : [defaultOriginal.initials];
      };

      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("Відновлення стану панелей з localStorage:", parsed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPanels(
            parsed.map((p, idx) => {
              // Зберігаємо id якщо він є, інакше генеруємо новий
              const restoredPanel = {
                id: p.id || Date.now() + idx,
                ref: p.ref || "GEN.1",
                versions:
                  Array.isArray(p.versions) && p.versions.length > 0
                    ? p.versions
                    : getDefaultVersionsForBook(
                        (p.ref || "GEN.1").split(".")[0],
                      ),
              };
              console.log(`Панель ${idx}:`, restoredPanel);
              return restoredPanel;
            }),
          );
        }
      } else {
        // Якщо немає збереженого стану - встановлюємо дефолтні версії
        const defaultVersions = getDefaultVersionsForBook("GEN");
        console.log("Встановлення дефолтних версій:", defaultVersions);
        setPanels([
          { id: Date.now(), ref: "GEN.1", versions: defaultVersions },
        ]);
      }
    } catch (e) {
      console.error("Помилка відновлення статусу панелей:", e);
    }
  }, [translationsData]);

  const [lexicons, setLexicons] = useState([]);
  const [coreData, setCoreData] = useState({});
  const [coreLoading, setCoreLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Глобальна історія для LexiconWindow
  const [globalHistory, setGlobalHistory] = useState({
    canGoBack: false,
    canGoForward: false,
    position: "1/1",
  });

  // Відстежуємо ширину екрану
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      if (newWidth < 520 && lexicons.length > 1) {
        setLexicons((prev) => [prev[0]]);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [lexicons]);

  // Функція для навігації до ref в конкретній панелі (поверхова реакція)
  const navigateToPanelRef = useRef(null);

  const handleNavigateToPanel = useCallback(
    (targetRef, targetVersions, panelIndex = 0) => {
      setPanels((prev) => {
        const newPanels = [...prev];

        // Якщо потрібно відкрити в другій панелі, а її немає - створюємо
        if (panelIndex >= newPanels.length) {
          const maxPanels = window.innerWidth < 992 ? 2 : 4;
          if (newPanels.length < maxPanels) {
            newPanels.push({
              id: Date.now(),
              ref: targetRef,
              versions: targetVersions || [],
            });
          }
        } else {
          // Оновлюємо існуючу панель
          newPanels[panelIndex] = {
            ...newPanels[panelIndex],
            ref: targetRef,
            versions: targetVersions || [],
          };
        }

        return newPanels;
      });
    },
    [],
  );

  // Оновлюємо ref для події
  useEffect(() => {
    navigateToPanelRef.current = handleNavigateToPanel;
  }, [handleNavigateToPanel]);

  // Збереження стану панелей в localStorage (debounce)
  const saveStateTimeoutRef = useRef(null);
  useEffect(() => {
    // Очищаємо попередній таймер
    if (saveStateTimeoutRef.current) {
      clearTimeout(saveStateTimeoutRef.current);
    }

    // Встановлюємо новий таймер
    saveStateTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("last_panel_state", JSON.stringify(panels));
      localStorage.setItem("panel_count", String(panels.length));
    }, 500);

    return () => {
      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
    };
  }, [panels]);

  // Обробка кастомного події від HistoryModal для навігації до закладки
  useEffect(() => {
    const handleNavigateToBookmark = (event) => {
      const { ref, versions } = event.detail;
      // Визначаємо панель: якщо одна панель - в першу, якщо 2+ - другу
      setPanels((prev) => {
        const newPanels = [...prev];

        if (newPanels.length === 1) {
          // Якщо одна панель - оновлюємо її з новим id (форс ререндер)
          // Додаємо _fromBookmark для ігнору зміни версій в Panel
          newPanels[0] = {
            ...newPanels[0],
            id: Date.now(), // Новий id форсує ререндер
            ref: ref,
            versions: versions || [],
            _fromBookmark: true, // Позначка: не змінювати версії
          };
        } else if (newPanels.length >= 2) {
          // Якщо вже є 2+ панелей - оновлюємо другу панель
          newPanels[1] = {
            ...newPanels[1],
            id: Date.now(), // Новий id форсує ререндер
            ref: ref,
            versions: versions || [],
            _fromBookmark: true,
          };
        } else {
          // Додаємо другу панель (якщо її немає)
          newPanels.push({
            id: Date.now(),
            ref: ref,
            versions: versions || [],
            _fromBookmark: true,
          });
        }

        return newPanels;
      });
    };

    window.addEventListener("navigateToBookmark", handleNavigateToBookmark);
    return () => {
      window.removeEventListener(
        "navigateToBookmark",
        handleNavigateToBookmark,
      );
    };
  }, []);

  // Ініціалізація глобальної історії
  useEffect(() => {
    const manager = globalHistoryManager.getManager("global");
    setGlobalHistory(manager.getState());
  }, []);

  // Завантаження core.json
  useEffect(() => {
    const controller = new AbortController();

    const loadCoreData = async () => {
      try {
        const cached = sessionStorage.getItem("core_data_v2");
        if (cached) {
          setCoreData(JSON.parse(cached));
          setCoreLoading(false);
          return;
        }

        const response = await fetch("/data/core.json", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        sessionStorage.setItem("core_data_v2", JSON.stringify(data));
        setTimeout(
          () => {
            sessionStorage.removeItem("core_data_v2");
          },
          60 * 60 * 1000,
        );

        setCoreData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          logger.error("Помилка завантаження core.json:", error);
        }
      } finally {
        setCoreLoading(false);
      }
    };

    loadCoreData();

    return () => controller.abort();
  }, []);

  // Допоміжна функція
  const updateWindowWithHistoryEntry = useCallback(
    (entry) => {
      if (!entry) return;

      const newLexicon = {
        id: Date.now(),
        key: `${entry.origVer}:${entry.word.strong || entry.word.dict}:${Date.now()}`,
        data: entry.data,
        origVer: entry.origVer,
        lang: entry.lang,
        isOriginal: entry.isOriginal,
        timestamp: Date.now(),
      };

      const isNarrowScreen = windowWidth < 520;

      setLexicons((prev) => {
        if (isNarrowScreen) {
          return [newLexicon];
        }

        if (prev.length === 0) {
          return [newLexicon];
        }

        if (prev.length === 1) {
          const existingWindow = prev[0];
          if (existingWindow.isOriginal === entry.isOriginal) {
            return [newLexicon];
          } else {
            return entry.isOriginal
              ? [newLexicon, existingWindow]
              : [existingWindow, newLexicon];
          }
        }

        if (prev.length === 2) {
          const [firstWindow, secondWindow] = prev;
          if (firstWindow.isOriginal === entry.isOriginal) {
            return [newLexicon, secondWindow];
          } else if (secondWindow.isOriginal === entry.isOriginal) {
            return [firstWindow, newLexicon];
          } else {
            return entry.isOriginal
              ? [newLexicon, secondWindow]
              : [firstWindow, newLexicon];
          }
        }

        return prev;
      });
    },
    [windowWidth],
  );

  const handleWordClick = useCallback(
    (clickData) => {
      const { word, origVer } = clickData;
      if (!word?.strong) {
        console.warn("⚠️ Немає коду Strong для слова");
        return;
      }

      const isNarrowScreen = windowWidth < 520;
      const getWordType = (version) => {
        if (!version) return "translation";
        return translationUtils.isOriginal(version)
          ? "original"
          : "translation";
      };

      const isOriginal = getWordType(origVer) === "original";
      const historyState = globalHistoryManager.addGlobalEntry(clickData);

      if (!historyState) {
        console.error("Не вдалося додати запис в історію");
        return;
      }

      setGlobalHistory(historyState);

      const newLexicon = {
        id: Date.now(),
        key: `${origVer}:${word.strong}:${Date.now()}`,
        data: clickData,
        origVer,
        lang: word.strong.startsWith("H") ? "he" : "gr",
        isOriginal,
        timestamp: Date.now(),
      };

      setLexicons((prev) => {
        if (isNarrowScreen) {
          return [newLexicon];
        }
        if (prev.length === 0) {
          return [newLexicon];
        }
        if (prev.length === 1) {
          const existingWindow = prev[0];
          if (existingWindow.isOriginal === isOriginal) {
            return [newLexicon];
          } else {
            return isOriginal
              ? [newLexicon, existingWindow]
              : [existingWindow, newLexicon];
          }
        }
        if (prev.length === 2) {
          const [firstWindow, secondWindow] = prev;
          if (firstWindow.isOriginal === isOriginal) {
            return [newLexicon, secondWindow];
          } else if (secondWindow.isOriginal === isOriginal) {
            return [firstWindow, newLexicon];
          }
        }
        return prev;
      });
    },
    [windowWidth],
  );

  const handleNavigateBack = useCallback(() => {
    const manager = globalHistoryManager.getManager("global");
    if (!manager) return;

    const entry = manager.goBack();
    if (entry) {
      updateWindowWithHistoryEntry(entry);
    }
    setGlobalHistory(manager.getState());
  }, [updateWindowWithHistoryEntry]);

  const handleNavigateForward = useCallback(() => {
    const manager = globalHistoryManager.getManager("global");
    if (!manager) return;

    const entry = manager.goForward();
    if (entry) {
      updateWindowWithHistoryEntry(entry);
    }
    setGlobalHistory(manager.getState());
  }, [updateWindowWithHistoryEntry]);

  // Додати нову панель
  const addPanel = useCallback(() => {
    setPanels((prev) => {
      const maxPanels = window.innerWidth < 992 ? 2 : 4;
      if (prev.length >= maxPanels) return prev;

      // Нова панель копіює стан першої панелі
      const firstPanel = prev[0];
      return [
        ...prev,
        {
          id: Date.now(),
          ref: firstPanel?.ref || "GEN.1",
          versions: [...(firstPanel?.versions || [])],
        },
      ];
    });
  }, []);

  const closePanel = useCallback((id) => {
    setPanels((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const closeLexiconWindow = useCallback((id) => {
    setLexicons((prev) => {
      const newLexicons = prev.filter((l) => l.id !== id);
      if (newLexicons.length === 2) {
        const [first, second] = newLexicons;
        return first.isOriginal ? [first, second] : [second, first];
      }
      return newLexicons;
    });
  }, []);

  // Callback для оновлення стану панелей в PassagePage коли змінюється стан панелі
  const handlePanelChange = useCallback((panelId, newRef, newVersions) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId ? { ...p, ref: newRef, versions: newVersions } : p,
      ),
    );
  }, []);

  // Обробка відвідувань - зберігає в історію (debounce для уникнення багатьох записів)
  // Працює тільки коли є реальні версії
  const prevPanelsForHistoryRef = useRef([]);
  useEffect(() => {
    // Перевіряємо, чи хоча б одна панель має версії
    const hasAnyVersions = panels.some(
      (p) => p.versions && p.versions.length > 0,
    );
    if (!hasAnyVersions) return; // Не зберігаємо історію поки немає версій

    const currentPanelsStr = JSON.stringify(
      panels.map((p) => ({ ref: p.ref, versions: p.versions })),
    );
    const prevPanelsStr = JSON.stringify(
      prevPanelsForHistoryRef.current.map((p) => ({
        ref: p.ref,
        versions: p.versions,
      })),
    );

    if (currentPanelsStr !== prevPanelsStr) {
      // Перевірка сумісності версій з ref для кожної панелі
      // Якщо хоч одна панель має несумісні версії (наприклад, LXX/THOT для NewT або TR/GNT для OldT)
      // пропускаємо збереження — версії ще не скориговані і будуть виправлені наступним ефектом
      const hasIncompatibleVersions = (panel) => {
        const [book] = (panel.ref || "").split(".");
        if (!book) return false;
        const testament = getTestamentStatic(book);
        return (panel.versions || []).some((ver) => {
          return !translationUtils.supportsTestament(ver, testament);
        });
      };

      const skipSave = panels.some(hasIncompatibleVersions);
      if (!skipSave) {
        // Зберігаємо всі панелі разом як окремі записи з унікальними ідентифікаторами
        console.log("Зберігаємо історію панелей:", panels);
        saveAllVisits(panels);
      }

      prevPanelsForHistoryRef.current = panels;
    }
  }, [panels]);

  return (
    <div className="passage-container">
      <div className="passage-panels">
        {panels.map((panel, index) => (
          <Panel
            key={panel.id}
            id={panel.id}
            onClose={closePanel}
            disableClose={panels.length === 1}
            coreData={coreData}
            coreLoading={coreLoading}
            lang={lang}
            onWordClick={handleWordClick}
            onNewPanel={addPanel}
            isNarrowScreen={windowWidth < 520}
            initialRef={panel.ref}
            initialVersions={panel.versions}
            onNavigateToRef={handleNavigateToPanel}
            onPanelChange={handlePanelChange}
          />
        ))}
      </div>

      {lexicons.length > 0 && (
        <div className="lexicon-column">
          {lexicons.map((lex, index) => (
            <LexiconWindow
              key={lex.id}
              data={lex.data}
              lang={lang}
              onClose={() => closeLexiconWindow(lex.id)}
              coreData={coreData}
              origVer={lex.origVer}
              isOriginal={lex.isOriginal}
              windowIndex={index}
              totalWindows={lexicons.length}
              historyState={globalHistory}
              onNavigateBack={handleNavigateBack}
              onNavigateForward={handleNavigateForward}
              isNarrowScreen={windowWidth < 520}
            />
          ))}
        </div>
      )}
    </div>
  );
});

PassagePage.displayName = "PassagePage";
export default PassagePage;
