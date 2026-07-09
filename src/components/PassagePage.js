// src/components/PassagePage.js - 06.02.2026
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
import { useNavigation } from "../contexts/NavigationContext";
import { getDefaultVersions } from "../utils/defaultVersions";

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
  }) => {
    const { get: getCache, set: setCache } = useChapterCache();
    const { currentRef, versions, updateRef, updateVersions } = useNavigation();
    const [chapterData, setChapterData] = useState({});
    const [loading, setLoading] = useState(false);
    const [translationsData, setTranslationsData] = useState(null);
    const [localCurrentRef, setLocalCurrentRef] = useState(currentRef);

    // Завантаження translations.json (один раз)
    useEffect(() => {
      const loadTranslations = async () => {
        try {
          const response = await fetch("/data/translations.json");
          if (response.ok) {
            const data = await response.json();
            setTranslationsData(data);

            // Перевіряємо, чи є хоч один оригінал серед поточних версій
            const hasOriginal = versions.some((ver) =>
              ["LXX", "THOT", "TR", "GNT"].includes(ver.toUpperCase()),
            );

            // Встановлюємо дефолтні версії, якщо versions порожні або немає оригіналу
            if (!versions || versions.length === 0 || !hasOriginal) {
              const [book] = localCurrentRef.split(".");
              const defaultVersions = getDefaultVersions(book, data);
              if (defaultVersions.length > 0) {
                updateVersions(defaultVersions);
              }
            }
          }
        } catch (error) {
          logger.error("Помилка завантаження translations.json:", error);
        }
      };

      loadTranslations();
    }, [localCurrentRef, getCache, setCache, versions, updateVersions]);

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

    // Завантаження глави з кешем
    useEffect(() => {
      if (translationsData) {
        const [book] = localCurrentRef.split(".");
        const testament = getTestament(book);

        // Автоматично корегуємо версії при зміні книги
        const correctedVersions = versions.filter((ver) => {
          const verLower = ver.toLowerCase();

          if (verLower === "lxx" && testament === "NewT") return false;
          if (verLower === "thot" && testament === "NewT") return false;
          if (verLower === "tr" && testament === "OldT") return false;
          if (verLower === "gnt" && testament === "OldT") return false;

          return true;
        });

        // Перевіряємо, чи є хоч один оригінал серед correctedVersions
        const hasOriginal = correctedVersions.some((ver) =>
          ["LXX", "THOT", "TR", "GNT"].includes(ver.toUpperCase()),
        );

        // Якщо після корекції масив порожній або немає оригіналу - встановлюємо дефолт
        if (correctedVersions.length === 0 || !hasOriginal) {
          const defaultVersions = getDefaultVersions(book, translationsData);
          if (defaultVersions.length > 0) {
            updateVersions(defaultVersions);
          }
        } else if (correctedVersions.length !== versions.length) {
          updateVersions(correctedVersions);
        }
      }

      if (versions.length === 0) return;
      const [book, chapterStr] = localCurrentRef.split(".");
      const chapter = parseInt(chapterStr);
      if (!book || !chapter) return;
      const cacheKey = `${book}.${chapter}.${versions.join(",")}`;
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        logger.debug(`Кеш HIT: ${cacheKey}`);
        setChapterData(cachedData);
        return;
      }

      logger.debug(`Кеш MISS: ${cacheKey}`);
      setLoading(true);

      // Виправлений loadPromises в useEffect:виправив питання з посиланням
      const loadPromises = versions.map(async (ver) => {
        const testament = getTestament(book);
        const verLower = ver.toLowerCase();
        const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(verLower);
        const base = isOriginal ? "originals" : "translations";
        const bookLower = book.toLowerCase();

        // ПЕРЕВІРКА СУМІСНОСТІ ВЕРСІЇ З ЗАПОВІТОМ
        if (
          (verLower === "lxx" && testament === "NewT") ||
          (verLower === "thot" && testament === "NewT") ||
          (verLower === "tr" && testament === "OldT") ||
          (verLower === "gnt" && testament === "OldT")
        ) {
          logger.debug(`Пропускаємо ${ver} для ${book} (несумісність)`);
          return { ver, data: [] };
        }

        const url = `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return { ver, data: data.verses || [] }; // Fallback на []
        } catch (error) {
          console.log(`Помилка завантаження ${ver}: ${error}`); // Залишити console.log
          return { ver, data: [] }; // Не скидати весь chapterData
        }
      });

      Promise.all(loadPromises)
        .then((results) => {
          const newData = {};
          results.forEach(({ ver, data }) => {
            newData[ver] = data;
          });

          setCache(cacheKey, newData);
          setChapterData(newData);
        })
        .catch((error) => {
          logger.error("Помилка завантаження глави:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [
      localCurrentRef,
      versions,
      getTestament,
      getCache,
      setCache,
      translationsData,
    ]);

    // Формування пар для InterlinearVerse
    const pairs = useMemo(() => {
      if (!translationsData) return [];

      const [book] = localCurrentRef.split(".");
      const testament = getTestament(book);
      const pairs = [];

      // Групуємо оригінали та переклади
      const originals = versions.filter((v) =>
        ["LXX", "THOT", "TR", "GNT"].includes(v.toUpperCase()),
      );

      const translations = versions.filter(
        (v) => !["LXX", "THOT", "TR", "GNT"].includes(v.toUpperCase()),
      );

      if (translations.length > 0 && originals.length === 0) {
        pairs.push({ original: null, translations, testament });
      }

      originals.forEach((original) => {
        // Знаходимо переклади для цього оригіналу
        const relatedTranslations = translations.filter((trans) => {
          const transInfo = translationsData?.bibles?.find(
            (b) => b.initials === trans,
          );
          if (!transInfo?.basedOn) return false;

          if (testament === "OldT") {
            return transInfo.basedOn.old_testament === original.toLowerCase();
          } else {
            // return transInfo.basedOn.new_testament === "tr"; // Для NT всі переклади на основі TR
            return transInfo.basedOn.new_testament === original.toLowerCase(); // Виправлено на lower для сумісності
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
          original: null, // Маркер для одиночних перекладів
          translations: translations, // Всі переклади без оригіналу
          testament: testament,
        });
      }

      return pairs;
    }, [versions, translationsData, localCurrentRef, getTestament]);

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

    // Відстежуємо, чи навігація відбулася всередині панелі
    const isInternalNavigation = useRef(false);

    // Навігація для панелі - оновлює глобальний стан та локальний
    const handlePrevChapter = () => {
      isInternalNavigation.current = true;
      const [b, c] = localCurrentRef.split(".");
      const nc = Math.max(1, parseInt(c) - 1);
      const newRef = `${b}.${nc}`;
      setLocalCurrentRef(newRef);
      updateRef(newRef);
    };

    const handleNextChapter = () => {
      isInternalNavigation.current = true;
      const [b, c] = localCurrentRef.split(".");
      const nc = parseInt(c) + 1;

      const testament = getTestament(b);
      const versionKey = versions[0]?.toLowerCase();

      if (coreData[versionKey] && coreData[versionKey][testament]) {
        const books = coreData[versionKey][testament].flatMap((g) => g.books);
        const bookInfo = books.find((bk) => bk.code === b);

        if (bookInfo && nc <= bookInfo.chapters) {
          const newRef = `${b}.${nc}`;
          setLocalCurrentRef(newRef);
          updateRef(newRef);
        }
      } else {
        const newRef = `${b}.${nc}`;
        setLocalCurrentRef(newRef);
        updateRef(newRef);
      }
    };

    // Локальна функція для оновлення currentRef тільки в межах цієї панелі
    const handleSetLocalRef = useCallback(
      (newRef) => {
        setLocalCurrentRef(newRef);
        updateRef(newRef); // Оновлюємо глобально при прямому виборі
      },
      [updateRef],
    );

    // Синхронізуємо localCurrentRef при зміні global currentRef ззовні
    useEffect(() => {
      if (!isInternalNavigation.current) {
        setLocalCurrentRef(currentRef);
      }
      isInternalNavigation.current = false;
    }, [currentRef]);

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
        // Захист від некоректної події
        if (!e?.changedTouches?.[0]) return;

        const diffX = touchStartX.current - touchEndX.current;
        const diffY = Math.abs(
          touchStartY.current - e.changedTouches[0].clientY,
        );

        // Ігноруємо, якщо рух більше вертикальний (скрол)
        if (diffY > Math.abs(diffX) * 1.8) return;

        const threshold = 60; // трохи збільшив, щоб уникнути випадкових свайпів

        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            // ← свайп вліво = наступний розділ
            handleNextChapter?.();
          } else {
            // → свайп вправо = попередній розділ
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

    //  адаптація для мобільних
    const maxPanels = isMobile() ? 1 : window.innerWidth < 992 ? 2 : 4;
    const versesToRender = isMobile()
      ? verseNumbers.slice(0, 10) // Перші 10 віршів
      : verseNumbers;
    // виправлений алгоритм формування шляху - не виправляє помилку щляху
    const getFilePath = (book, chapter, version) => {
      const testament = getTestament(book);
      const verLower = version.toLowerCase();
      const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(verLower);
      const base = isOriginal ? "originals" : "translations";
      const bookLower = book.toLowerCase();

      // ПЕРЕВІРКА ДЛЯ КОЖНОЇ ВЕРСІЇ:

      // 1. LXX - тільки OldT
      if (verLower === "lxx" && testament === "NewT") {
        console.warn("LXX не має NewT файлів");
        return null; // Не завантажуємо
      }

      // 2. THOT - тільки OldT
      if (verLower === "thot" && testament === "NewT") {
        console.warn("THOT не має NewT файлів");
        return null;
      }

      // 3. TR - тільки NewT (згідно нових вимог)
      if (verLower === "tr" && testament === "OldT") {
        console.warn("TR тільки для NewT");
        return null;
      }

      // 4. GNT - тільки NewT
      if (verLower === "gnt" && testament === "OldT") {
        console.warn("GNT тільки для NewT");
        return null;
      }

      // Формуємо правильний шлях - не виправляє помилку щляху
      return `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;
    };

    return (
      <div className="panel">
        <PassageOptionsGroup
          lang={lang}
          currentRef={localCurrentRef}
          setCurrentRef={handleSetLocalRef}
          versions={versions}
          setVersions={updateVersions}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          onNewPanel={onNewPanel}
          onClosePanel={() => onClose(id)}
          disableClose={disableClose}
          coreData={coreData}
          coreLoading={coreLoading}
          localCurrentRef={localCurrentRef}
        />

        <div
          className="chapter-viewer flex-fill overflow-auto "
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
              <h6 className="text-center ">{currentRef}</h6>
              {/* Індикатор свайпу — тільки на мобілках */}
              {isNarrowScreen && (
                <div className="chapter-swipe-indicator">
                  <small>
                    {/* Тут можна додати умову, чи є попередній/наступний розділ */}
                    ‹ свайп для зміни розділу ›
                  </small>
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
  const [panels, setPanels] = useState([{ id: Date.now() }]);
  const [lexicons, setLexicons] = useState([]);
  const [coreData, setCoreData] = useState({});
  const [coreLoading, setCoreLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Тепер використовуємо один глобальний менеджер історії для всіх вікон
  const [globalHistory, setGlobalHistory] = useState({
    canGoBack: false,
    canGoForward: false,
    position: "1/1",
  });

  // Відстежуємо ширину екрану для респонсивності
  useEffect(() => {
    const handleResize = () => {
      // setWindowWidth(window.innerWidth);
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      // Закриваємо друге вікно на дуже вузьких екранах (<520px)

      if (newWidth < 520 && lexicons.length > 1) {
        setLexicons((prev) => [prev[0]]);
      }
    };

    window.addEventListener("resize", handleResize);
    // Початкова перевірка при монтуванні
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [lexicons]); // Залишаємо lexicons в залежностях, але не використовуємо для закриття - без lexicons не спрацьовує автоматичне закривання другого вікна

  // Ініціалізація глобальної історії з localStorage
  useEffect(() => {
    const manager = globalHistoryManager.getManager("global");
    setGlobalHistory(manager.getState());
  }, []);

  // Завантаження core.json з кешем
  useEffect(() => {
    const controller = new AbortController();

    const loadCoreData = async () => {
      try {
        // Перевіряємо кеш
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

        // Кешуємо на 1 годину
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

  // Додайте цей useEffect після інших useEffect:
  useEffect(() => {
    console.log("📊 Стан глобальної історії змінено:", {
      canGoBack: globalHistory.canGoBack,
      canGoForward: globalHistory.canGoForward,
      position: globalHistory.position,
      currentId: globalHistory.current?.id,
    });
  }, [globalHistory]);

  useEffect(() => {
    console.log("🪟 Стан вікон словників змінено:", {
      count: lexicons.length,
      windows: lexicons.map((l, i) => ({
        index: i,
        isOriginal: l.isOriginal,
        key: l.key,
      })),
    });
  }, [lexicons]);

  // Допоміжна функція для оновлення вікна з запису історії
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

      // ВИПРАВЛЕННЯ: Якщо мінімальний fallback - трактуємо як звичайний (без спеціальної обробки помилок)
      if (entry._type === "minimal_fallback") {
        newLexicon.isMinimal = true; // Опціонально, для рендеру
      }
      const isNarrowScreen = windowWidth < 520;

      setLexicons((prev) => {
        console.log(
          `📊 Поточні вікна: ${prev.length}, новий тип: ${entry.isOriginal ? "оригінал" : "переклад"}`,
        );

        // Якщо вузький екран — завжди тільки одне вікно, замінюємо поточне
        if (isNarrowScreen) {
          console.log(
            "📱 Вузький екран (<520px): завжди одне вікно — замінюємо",
          );
          return [newLexicon]; // просто замінюємо, незалежно від типу
        }

        // Для широких екранів - логіка з двома вікнами
        if (prev.length === 0) {
          console.log("🆕 Немає відкритих вікон - відкриваємо перше");
          return [newLexicon];
        }

        if (prev.length === 1) {
          const existingWindow = prev[0];
          console.log(
            `📊 Одне вікно: тип ${existingWindow.isOriginal ? "оригінал" : "переклад"}`,
          );

          // Якщо типи збігаються - замінюємо
          if (existingWindow.isOriginal === entry.isOriginal) {
            console.log("🔄 Замінюємо поточне вікно");
            return [newLexicon];
          } else {
            return isOriginal
              ? [newLexicon, existingWindow]
              : [existingWindow, newLexicon];
          }
        }

        if (prev.length === 2) {
          const [firstWindow, secondWindow] = prev;
          console.log(
            `📊 Два вікна: [${firstWindow.isOriginal ? "Orig" : "Trans"}, ${secondWindow.isOriginal ? "Orig" : "Trans"}]`,
          );

          // Знаходимо вікно з таким же типом
          if (firstWindow.isOriginal === entry.isOriginal) {
            console.log("🔄 Замінюємо перше вікно");
            return [newLexicon, secondWindow];
          } else if (secondWindow.isOriginal === entry.isOriginal) {
            console.log("🔄 Замінюємо друге вікно");
            return [firstWindow, newLexicon];
          } else {
            // Замінюємо відповідне за позицією
            console.log(
              `🔄 Замінюємо за позицією (${entry.isOriginal ? "перше - Orig" : "друге - Trans"})`,
            );
            return entry.isOriginal
              ? [newLexicon, secondWindow]
              : [firstWindow, newLexicon];
          }
        }

        console.warn("⚠️ Невідома кількість вікон:", prev.length);
        return prev;
      });
    },
    [windowWidth],
  );

  // ПОВНІСТЮ ПЕРЕРОБЛЯЄМО handleWordClick з новою логікою
  const handleWordClick = useCallback(
    (clickData) => {
      console.log("🖱️ Клік на слово:", {
        word: clickData.word?.word,
        strong: clickData.word?.strong,
        dict: clickData.word?.dict,
        origVer: clickData.origVer,
        timestamp: new Date().toISOString(),
      });

      const { word, origVer } = clickData;
      // if (!word?.strong) return;
      if (!word?.strong) {
        console.warn("⚠️ Немає коду Strong для слова");
        return;
      }

      const isNarrowScreen = windowWidth < 520;

      // Визначаємо чи це оригінал за допомогою окремої функції
      const getWordType = (version) => {
        if (!version) return "translation";
        const upperVersion = version.toUpperCase();
        return ["LXX", "THOT", "TR", "GNT"].includes(upperVersion)
          ? "original"
          : "translation";
      };

      const isOriginal = getWordType(origVer) === "original";

      console.log(
        `📋 Тип слова: ${isOriginal ? "оригінал" : "переклад"}, версія: ${origVer}`,
      );

      // Додаємо в ГЛОБАЛЬНУ історію (для всіх вікон)
      const historyState = globalHistoryManager.addGlobalEntry(clickData);
      if (!historyState) {
        console.error("Не вдалося додати запис в історію");
        return;
      }

      // Оновлюємо стан глобальної історії
      setGlobalHistory(historyState);

      // Створюємо новий об'єкт словника
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
        // ВИПРАВЛЕНА ЛОГІКА:
        // Якщо вузький екран — завжди тільки одне вікно, замінюємо поточне
        if (isNarrowScreen) {
          console.log(
            "📱 Вузький екран (<520px): завжди одне вікно. Попередня кількість:",
            prev.length,
          );
          return [newLexicon]; // просто замінюємо, незалежно від типу
        }
        // 1. Якщо немає відкритих вікон - відкриваємо одне вікно (незалежно від типу слова)
        if (prev.length === 0) {
          return [newLexicon];
        }

        // 2. Якщо є одне відкрите вікно:
        if (prev.length === 1) {
          const existingWindow = prev[0];

          // Якщо натиснули на слово такого ж типу - замінюємо поточне вікно
          if (existingWindow.isOriginal === isOriginal) {
            return [newLexicon];
          } else {
            // Натиснули на переклад - ставимо другим

            return isOriginal
              ? [newLexicon, existingWindow]
              : [existingWindow, newLexicon];
          }
        }

        // 3. Якщо є два відкритих вікна:
        if (prev.length === 2) {
          const [firstWindow, secondWindow] = prev;

          // Знаходимо вікно з таким же типом слова
          if (firstWindow.isOriginal === isOriginal) {
            // Замінюємо перше вікно
            return [newLexicon, secondWindow];
          } else if (secondWindow.isOriginal === isOriginal) {
            // Замінюємо друге вікно
            return [firstWindow, newLexicon];
          } else {
            // Якщо обидва вікна іншого типу - замінюємо відповідне за позицією
            // Оригінал завжди перший, переклад - другий
            return isOriginal
              ? [newLexicon, secondWindow]
              : [firstWindow, newLexicon];
          }
        }

        return prev;
      });
    },
    [windowWidth],
  );

  // Функції навігації по глобальній історії
  const handleNavigateBack = useCallback(() => {
    console.log("🔄 Виклик handleNavigateBack");

    // const result = globalHistoryManager.goBack();
    const manager = globalHistoryManager.getManager("global");
    if (!manager) {
      console.error("Глобальний менеджер історії не знайдено");
      return;
    }
    const entry = manager.goBack(); // або manager.goForward()

    console.log("📋 Результат goBack:", {
      entryFound: !!entry,
      state: manager.getState(),
    });

    if (entry) {
      // Оновлюємо відповідне вікно словника
      updateWindowWithHistoryEntry(entry);
    }

    // Оновлюємо стан глобальної історії
    setGlobalHistory(manager.getState());

    // Логуємо поточний стан

    console.log("📊 Поточний стан історії:", manager.getState());
  }, [updateWindowWithHistoryEntry]);

  const handleNavigateForward = useCallback(() => {
    console.log("🔄 Виклик handleNavigateForward");

    const manager = globalHistoryManager.getManager("global");
    if (!manager) {
      console.error("Глобальний менеджер історії не знайдено");
      return;
    }
    const entry = manager.goForward();

    console.log("📋 Результат goForward:", {
      entryFound: !!entry,
      state: manager.getState(),
    });

    if (entry) {
      // Оновлюємо відповідне вікно словника
      updateWindowWithHistoryEntry(entry);
    }

    // Оновлюємо стан глобальної історії
    setGlobalHistory(manager.getState());

    // Логуємо поточний стан

    console.log("📊 Поточний стан історії:", manager.getState());
  }, [updateWindowWithHistoryEntry]);

  // Обробники
  const addPanel = useCallback(() => {
    const maxPanels = window.innerWidth < 992 ? 2 : 4;
    if (panels.length < maxPanels) {
      setPanels([...panels, { id: Date.now() }]);
    }
  }, [panels]);

  const closePanel = useCallback(
    (id) => {
      if (panels.length > 1) {
        setPanels(panels.filter((p) => p.id !== id));
      }
    },
    [panels],
  );
  // Функція закриття вікна
  const closeLexiconWindow = useCallback((id) => {
    setLexicons((prev) => {
      const newLexicons = prev.filter((l) => l.id !== id);

      // Перевпорядковуємо, щоб залишилося максимум 2 вікна з правильним порядком
      if (newLexicons.length === 2) {
        const [first, second] = newLexicons;
        // Сортуємо: оригінал перший, переклад другий
        return first.isOriginal ? [first, second] : [second, first];
      }

      return newLexicons;
    });
  }, []);

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
              // Передаємо глобальну історію всім вікнам
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
