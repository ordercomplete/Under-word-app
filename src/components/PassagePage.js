// // src/components/PassagePage.js - ПОВНИЙ КОД З ВСІМА ІМПОРТАМИ 07.01.2026
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// import "../styles/LexiconWindow.css";
// import "../styles/PassagePage.css";
// import { jsonAdapter } from "../utils/jsonAdapter";

// // console.log("📦 PassagePage.js: початок завантаження модуля");

// const Panel = ({
//   id,
//   onClose,
//   disableClose,
//   coreData,
//   coreLoading,
//   lang,
//   isMaster = false,
//   masterRef,
//   onWordClick,
//   onNewPanel,
// }) => {
//   // console.log(`🎬 Panel ${id}: ініціалізація`);

//   const [currentRef, setCurrentRef] = useState(masterRef || "GEN.1");
//   // const [versions, setVersions] = useState(["LXX", "UTT"]);
//   // const [versions, setVersions] = useState([]); // ← ПУСТИЙ МАСИВ, не ["LXX", "UTT"]
//   // const [versions, setVersions] = useState(() => {
//   //   // Ініціалізація на основі книги
//   //   const [book] = currentRef.split(".");
//   //   const testament = getTestament(book);
//   //   return testament === "NewT" ? ["TR", "UTT"] : ["LXX", "UTT"];
//   // });
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [translationsData, setTranslationsData] = useState(null);

//   const getTestament = useCallback((bookCode) => {
//     const newTestamentBooks = [
//       "MAT",
//       "MRK",
//       "LUK",
//       "JHN",
//       "ACT",
//       "ROM",
//       "1CO",
//       "2CO",
//       "GAL",
//       "EPH",
//       "PHP",
//       "COL",
//       "1TH",
//       "2TH",
//       "1TI",
//       "2TI",
//       "TIT",
//       "PHM",
//       "HEB",
//       "JAS",
//       "1PE",
//       "2PE",
//       "1JN",
//       "2JN",
//       "3JN",
//       "JUD",
//       "REV",
//     ];
//     return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
//   }, []);

//   const [versions, setVersions] = useState(() => {
//     // Ініціалізація на основі книги
//     const [book] = currentRef.split(".");
//     const testament = getTestament(book);
//     return testament === "NewT" ? ["TR", "UTT"] : ["LXX", "UTT", "THOT", "UBT"];
//   });
//   // Ефект для завантаження translationsData
//   useEffect(() => {
//     const loadTranslations = async () => {
//       try {
//         const response = await fetch("/data/translations.json");
//         const data = await response.json();
//         setTranslationsData(data);
//       } catch (error) {
//         console.error(
//           `❌ Panel ${id}: помилка завантаження translations.json`,
//           error
//         );
//       }
//     };
//     loadTranslations();
//   }, [id]);

//   // ОНОВИТИ useEffect для версій (ВИДАЛИТИ зациклення):
//   useEffect(() => {
//     if (!translationsData) return;

//     const [book] = currentRef.split(".");
//     const testament = getTestament(book);

//     // Перевіряємо чи всі версії валідні для цього заповіту
//     const invalidVersions = versions.filter((v) => {
//       const bible = translationsData.bibles.find((b) => b.initials === v);
//       return bible && bible.testaments && !bible.testaments.includes(testament);
//     });

//     if (invalidVersions.length > 0) {
//       console.log(
//         `🔄 Panel ${id}: виправляю невідповідні версії`,
//         invalidVersions
//       );

//       let corrected = versions.filter((v) => !invalidVersions.includes(v));

//       // Додаємо дефолтні замість невідповідних
//       invalidVersions.forEach((invalid) => {
//         if (invalid === "LXX" && testament === "NewT") {
//           corrected.push("TR");
//         } else if (invalid === "TR" && testament === "OldT") {
//           corrected.push("LXX");
//         }
//         // Для перекладів (UTT, UBT) залишаємо - вони мають обидва заповіти
//       });

//       // Видаляємо дублікати
//       corrected = [...new Set(corrected)];
//       setVersions(corrected);
//     }
//   }, [currentRef, translationsData, getTestament]); // ВИДАЛИТИ versions
//   // ==================== ФУНКЦІЇ ДОПОМОГИ ====================

//   /**
//    * ОТРИМАТИ СПИСОК НОМЕРІВ ВІРШІВ
//    * Аналізує всі завантажені версії та повертає унікальні номери
//    */
//   const getVerseNumbers = useCallback(() => {
//     // console.log(`🔍 Panel ${id}: отримання номерів віршів`);

//     const allVerseNumbers = new Set();

//     // Збираємо всі номери віршів з усіх завантажених версій
//     Object.values(chapterData).forEach((data) => {
//       if (Array.isArray(data)) {
//         data.forEach((verse) => {
//           const vNum = verse.verse || verse.v;
//           if (vNum && !isNaN(vNum)) {
//             allVerseNumbers.add(parseInt(vNum));
//           }
//         });
//       }
//     });

//     // Якщо немає даних, повертаємо пустий масив
//     if (allVerseNumbers.size === 0) {
//       console.log(`📭 Panel ${id}: не знайдено віршів`);
//       return [];
//     }

//     // Створюємо масив від мінімального до максимального номера
//     const minVerse = Math.min(...allVerseNumbers);
//     const maxVerse = Math.max(...allVerseNumbers);
//     const verseArray = [];

//     for (let i = minVerse; i <= maxVerse; i++) {
//       verseArray.push(i);
//     }

//     // console.log(
//     //   `✅ Panel ${id}: знайдено вірші ${minVerse}-${maxVerse} (${verseArray.length} шт.)`
//     // );
//     return verseArray;
//   }, [chapterData, id]);

//   /**
//    * ВИЗНАЧИТИ ШЛЯХ ДО ФАЙЛУ
//    * Формує URL для завантаження даних
//    */
// const getFilePath = useCallback(
//   (version, bookCode, chapter) => {
//     const ver = version.toLowerCase();
//     const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(ver);
//     const base = isOriginal ? "originals" : "translations";
//     const testament = getTestament(bookCode);

//     return {
//       original: `/data/${base}/${ver}/${testament}/${bookCode}/${bookCode.toLowerCase()}${chapter}_${ver}.json`,
//       compressed: `/data_compressed/${base}/${ver}/${testament}/${bookCode}/${bookCode.toLowerCase()}${chapter}_${ver}.json`,
//       testament: testament,
//     };
//   },
//   [getTestament]
// );

//   // ==================== ЕФЕКТИ ====================

//   /**
//    * ЗАВАНТАЖИТИ ДАНІ ПРО ПЕРЕКЛАДИ
//    * Використовує translations.json для отримання інформації про переклади
//    */
//   useEffect(() => {
//     // console.log(`📥 Panel ${id}: завантаження translations.json`);

//     const loadTranslations = async () => {
//       try {
//         const response = await fetch("/data/translations.json");
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
//         // console.log(`✅ Panel ${id}: translations.json завантажено`, {
//         //   biblesCount: data.bibles?.length || 0,
//         //   version: data.version || "unknown",
//         // });

//         setTranslationsData(data);
//       } catch (error) {
//         console.error(
//           `❌ Panel ${id}: помилка завантаження translations.json`,
//           {
//             error: error.message,
//             stack: error.stack,
//           }
//         );
//       }
//     };

//     loadTranslations();
//   }, [id]);

//   /**
//    * ЗАВАНТАЖИТИ ГЛАВУ З УСІХ ВИБРАНИХ ВЕРСІЙ
//    * Використовує jsonAdapter для обробки різних форматів даних
//    */
//   useEffect(() => {
//     const [book, chapterStr] = currentRef.split(".");
//     const chapter = parseInt(chapterStr);

//     if (!book || !chapter) {
//       console.warn(`⚠️ Panel ${id}: некоректна посилання ${currentRef}`);
//       return;
//     }

//     // console.log(
//     //   `📥 Panel ${id}: завантаження глави ${currentRef}, версії: ${versions.join(
//     //     ", "
//     //   )}`
//     // );

//     setLoading(true);
//     setMessage(null);

//     // ЧАСТИНА 1.4: ВИПРАВЛЕННЯ loadChapter ТА ШЛЯХІВ
//     const loadChapter = async (ver) => {
//       const [book, chapterStr] = currentRef.split(".");
//       const chapter = parseInt(chapterStr);
//       const testament = getTestament(book);

//       // ПЕРЕВІРКА: чи може ця версія завантажувати цей заповіт
//       const bibleInfo = translationsData?.bibles?.find(
//         (b) => b.initials === ver
//       );

//       // Якщо версія не має цього заповіту → повертаємо пусті дані
//       if (bibleInfo?.testaments && !bibleInfo.testaments.includes(testament)) {
//         console.log(`⏭️ Пропускаємо ${ver} для ${book} (не має ${testament})`);
//         return { ver, data: [] };
//       }

//       // Спеціальні випадки:
//       // 1. LXX тільки для OT
//       if (ver === "LXX" && testament === "NewT") {
//         console.log(`⏭️ LXX не має NewT`);
//         return { ver, data: [] };
//       }

//       // 2. THOT тільки для OT
//       if (ver === "THOT" && testament === "NewT") {
//         console.log(`⏭️ THOT не має NewT`);
//         return { ver, data: [] };
//       }

//       // 3. TR тільки для NT (згідно нових вимог)
//       if (ver === "TR" && testament === "OldT") {
//         console.log(`⏭️ TR тільки для NT`);
//         return { ver, data: [] };
//       }

//       // Формуємо шлях
//       const verLower = ver.toLowerCase();
//       const bookLower = book.toLowerCase();
//       const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(verLower);
//       const base = isOriginal ? "originals" : "translations";

//       // СПОЧАТКУ /data/ (повний формат)
//       const originalUrl = `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;

//       try {
//         const res1 = await fetch(originalUrl);
//         if (res1.ok) {
//           const data = await res1.json();
//           return { ver, data };
//         }

//         // ЯКЩО НЕ ЗНАЙДЕНО → /data_compressed/ (скорочений формат)
//         const compressedUrl = `/data_compressed/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;
//         const res2 = await fetch(compressedUrl);

//         if (res2.ok) {
//           const data = await res2.json();
//           return { ver, data };
//         }

//         // Якщо обидва не знайдено
//         console.warn(`⚠️ Файл не знайдено для ${ver} ${book}.${chapter}`);
//         return { ver, data: [] };
//       } catch (err) {
//         console.error(`❌ Помилка завантаження ${ver}:`, err);
//         return { ver, data: { error: err.message } };
//       }
//     };
//     Promise.all(versions.map(loadChapter))
//       .then((results) => {
//         const newData = {};
//         results.forEach(({ ver, data }) => {
//           newData[ver] = jsonAdapter(data);
//         });

//         // console.log(`✅ Panel ${id}: глава завантажена успішно`, {
//         //   версії: Object.keys(newData),
//         //   віршів: newData[versions[0]]?.length || 0,
//         // });

//         setChapterData(newData);
//         // console.log("chapterData:", chapterData);
//       })
//       .catch((error) => {
//         console.error(`❌ Panel ${id}: помилка завантаження глави`, {
//           error: error.message,
//           stack: error.stack,
//         });

//         setMessage("Помилка завантаження: " + error.message);
//       })
//       .finally(() => {
//         setLoading(false);
//         // console.log(`⏱️ Panel ${id}: завантаження завершено`);
//       });
//   }, [currentRef, versions, id, coreData]);

//   /**
//    * ФОРМУВАННЯ ПАР ПЕРЕКЛАДІВ
//    * Групує оригінали з відповідними перекладами
//    */

//   // Оновлена функція getPairs з врахуванням заповітів ЧАСТИНА 1.2: ОНОВЛЕНА getPairs() ДЛЯ ВРАХУВАННЯ ЗАПОВІТІВ
//   const getPairs = useCallback(() => {
//     const [book] = currentRef.split(".");
//     const testament = getTestament(book);
//     const pairs = [];

//     // Групуємо версії за типами
//     const originalVersions = versions.filter((v) =>
//       ["TR", "GNT", "LXX", "THOT"].includes(v.toUpperCase())
//     );

//     const translationVersions = versions.filter(
//       (v) => !["TR", "GNT", "LXX", "THOT"].includes(v.toUpperCase())
//     );

//     // Для OT: тільки LXX/THOT
//     if (testament === "OldT") {
//       const otOriginals = originalVersions.filter((v) =>
//         ["LXX", "THOT"].includes(v.toUpperCase())
//       );

//       otOriginals.forEach((original) => {
//         // Знаходимо переклади для цього оригіналу
//         const translationsForOriginal = translationVersions.filter((trans) => {
//           // Отримуємо інфо про переклад
//           const transInfo = translationsData?.bibles?.find(
//             (b) => b.initials === trans
//           );

//           if (!transInfo?.basedOn) return false;

//           // Перевіряємо, чи переклад базується на цьому оригіналі для OT
//           return transInfo.basedOn.old_testament === original.toLowerCase();
//           // Проблема: Не враховує, що UTT має basedOn: { old_testament: "lxx", new_testament: "tr" }.
//         });

//         pairs.push({
//           original: original,
//           translations: translationsForOriginal,
//           testament: "OldT",
//           isGNT: false,
//         });
//       });
//     }

//     // Для NT: тільки TR/GNT
//     if (testament === "NewT") {
//       const ntOriginals = originalVersions.filter((v) =>
//         ["TR", "GNT"].includes(v.toUpperCase())
//       );

//       ntOriginals.forEach((original) => {
//         // Для NT використовуємо всі переклади, які базуються на TR
//         // (оскільки GNT використовує ті самі переклади)
//         const translationsForOriginal = translationVersions.filter((trans) => {
//           const transInfo = translationsData?.bibles?.find(
//             (b) => b.initials === trans
//           );

//           if (!transInfo?.basedOn) return false;

//           // Для NT: перевіряємо new_testament основу
//           return transInfo.basedOn.new_testament === "tr";
//         });

//         pairs.push({
//           original: original,
//           translations: translationsForOriginal,
//           testament: "NewT",
//           isGNT: original.toUpperCase() === "GNT",
//         });
//       });
//     }

//     // Сортуємо: спочатку основні оригінали
//     pairs.sort((a, b) => {
//       const order = ["LXX", "THOT", "TR", "GNT"];
//       const aIndex = order.indexOf(a.original.toUpperCase());
//       const bIndex = order.indexOf(b.original.toUpperCase());
//       return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
//     });

//     return pairs;
//   }, [currentRef, versions, translationsData, getTestament]);

//   // ==================== РЕНДЕРИНГ ====================

//   const [book, chapter] = currentRef.split(".");

//   const renderChapterContent = () => {
//     // const verseNumbers = getVerseNumbers();

//     // if (verseNumbers.length === 0) {
//     //   return (
//     //     <p className="text-center text-muted">Немає даних для відображення</p>
//     //   );
//     // }

//     // Перевірити чи є дані
//     const hasChapterData = Object.keys(chapterData).some((key) => {
//       const data = chapterData[key];
//       return Array.isArray(data) && data.length > 0;
//     });

//     if (!hasChapterData) {
//       return <p className="text-center text-muted">Завантаження даних...</p>;
//     }

//     const verseNumbers = getVerseNumbers();

//     if (verseNumbers.length === 0) {
//       return (
//         <p className="text-center text-muted">Немає даних для відображення</p>
//       );
//     }
//     return verseNumbers.map((verseNum, index) => {
//       const isFirstInChapter = index === 0; // Перший вірш розділу
//       // Перевіряємо, чи є дані для цього вірша в будь-якій версії
//       const hasData = Object.keys(chapterData).some((version) => {
//         const data = chapterData[version];
//         if (!Array.isArray(data)) return false;
//         const verse = data.find((v) => (v.verse || v.v) === verseNum);
//         return verse && (verse.words || verse.ws)?.length > 0;
//       });

//       if (!hasData) {
//         return (
//           <div key={`missing-${verseNum}`} className="missing-verse">
//             <div className="verse-number">{verseNum}</div>
//             <div className="verse-content text-muted">
//               Вірш {verseNum} поки що відсутній
//             </div>
//           </div>
//         );
//       }

//       return (
//         <InterlinearVerse
//           key={verseNum}
//           verseNum={verseNum}
//           pairs={getPairs()}
//           chapterData={chapterData}
//           onWordClick={onWordClick}
//           isFirstInChapter={isFirstInChapter} // Передаємо проп
//         />
//       );
//     });
//   };

//   // console.log(`🎨 Panel ${id}: початок рендерингу`, {
//   //   currentRef,
//   //   versionsCount: versions.length,
//   //   chapterDataKeys: Object.keys(chapterData),
//   //   loading,
//   // });

//   return (
//     <div className="panel">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef}
//         versions={versions}
//         setVersions={setVersions}
//         onPrevChapter={() => {
//           const [b, c] = currentRef.split(".");
//           const nc = Math.max(1, parseInt(c) - 1);
//           setCurrentRef(`${b}.${nc}`);
//         }}
//         onNextChapter={() => {
//           const [b, c] = currentRef.split(".");
//           const nc = parseInt(c) + 1;

//           // Визначаємо Заповіт для отримання кількості глав
//           const testament = getTestament(b);
//           const versionKey = versions[0]?.toLowerCase();

//           let chapters = 1;
//           if (coreData[versionKey] && coreData[versionKey][testament]) {
//             coreData[versionKey][testament].forEach((group) => {
//               const bookInfo = group.books.find((bk) => bk.code === b);
//               if (bookInfo) chapters = bookInfo.chapters;
//             });
//           }

//           if (nc <= chapters) {
//             setCurrentRef(`${b}.${nc}`);
//           }
//         }}
//         onNewPanel={onNewPanel}
//         onClosePanel={() => onClose(id)}
//         disableClose={disableClose}
//         coreData={coreData}
//         coreLoading={coreLoading}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3">
//         {loading ? (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Завантаження...</span>
//             </div>
//             <p className="mt-2">{lang.loading || "Завантаження глави..."}</p>
//           </div>
//         ) : message ? (
//           <p className="text-center text-danger">{message}</p>
//         ) : (
//           <>
//             <h4 className="text-center mb-3">{currentRef}</h4>
//             {renderChapterContent()}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const PassagePage = ({ lang }) => {
//   // console.log(
//   //   "🔄 PassagePage: компонент ініціалізовано з lang:",
//   //   lang?.code || "uk"
//   // );

//   const [panels, setPanels] = useState([{ id: Date.now() }]);
//   const [lexicons, setLexicons] = useState([]);
//   const [coreData, setCoreData] = useState({});
//   const [coreLoading, setCoreLoading] = useState(true);

//   // ==================== ЕФЕКТИ ====================

//   /**
//    * ЗАВАНТАЖИТИ CORE ДАНІ
//    * Використовує core.json для інформації про книги та глави
//    */
//   useEffect(() => {
//     // console.log("📥 PassagePage: початок завантаження core.json");

//     let isMounted = true;

//     const loadCoreData = async () => {
//       try {
//         const startTime = performance.now();
//         const coreRes = await fetch("/data/core.json");

//         if (!coreRes.ok) {
//           throw new Error(`HTTP ${coreRes.status}: ${coreRes.statusText}`);
//         }

//         const core = await coreRes.json();
//         const loadTime = performance.now() - startTime;

//         console.log(
//           `✅ PassagePage: core.json завантажено за ${loadTime.toFixed(0)}мс`,
//           {
//             версії: Object.keys(core),
//             структура: Object.keys(core).map((v) => ({
//               версія: v,
//               маєСТ: !!core[v].OldT,
//               маєНЗ: !!core[v].NewT,
//             })),
//           }
//         );

//         if (isMounted) {
//           setCoreData(core);
//         }
//       } catch (err) {
//         console.error("❌ PassagePage: помилка завантаження core.json", {
//           помилка: err.message,
//           стек: err.stack,
//         });

//         if (isMounted) {
//           setCoreData({});
//         }
//       } finally {
//         if (isMounted) {
//           setCoreLoading(false);
//         }
//       }
//     };

//     loadCoreData();

//     return () => {
//       isMounted = false;
//       // console.log("🧹 PassagePage: cleanup при розмонтуванні");
//     };
//   }, []);

//   /**
//    * ДОДАТИ НОВУ ПАНЕЛЬ
//    * Обмежує кількість панелей залежно від ширини екрану
//    */
//   const addPanel = useCallback(() => {
//     const maxPanels = window.innerWidth < 992 ? 2 : 4;

//     if (panels.length < maxPanels) {
//       const newPanelId = Date.now();
//       // console.log("➕ PassagePage: додавання нової панелі", { newPanelId });
//       setPanels([...panels, { id: newPanelId }]);
//     } else {
//       console.warn("⚠️ PassagePage: досягнуто максимум панелей", { maxPanels });
//       alert(`Максимум ${maxPanels} вікон`);
//     }
//   }, [panels]);

//   /**
//    * ЗАКРИТИ ПАНЕЛЬ
//    * Не дозволяє закрити останню панель
//    */
//   const closePanel = useCallback(
//     (id) => {
//       // console.log("❌ PassagePage: закриття панелі", { id });

//       if (panels.length > 1) {
//         setPanels(panels.filter((p) => p.id !== id));
//       }
//     },
//     [panels]
//   );

//   /**
//    * ЗАКРИТИ ЛЕКСИКОН
//    */
//   const closeLexicon = useCallback(
//     (id) => {
//       // console.log("❌ PassagePage: закриття лексикону", { id });
//       setLexicons(lexicons.filter((l) => l.id !== id));
//     },
//     [lexicons]
//   );

//   /**
//    * ОБРОБКА КЛІКУ НА СЛОВО
//    * Відкриває лексикон для вибраного слова
//    */
//   const handleWordClick = useCallback(
//     (data) => {
//       // console.log("🖱️ PassagePage: клік на слово", {
//       //   слово: data.word?.word,
//       //   strong: data.word?.strong,
//       //   оригінал: data.origVer,
//       // });

//       const { word, origVer } = data;
//       if (!word?.strong || !origVer) {
//         console.warn("⚠️ PassagePage: некоректні дані слова");
//         return;
//       }

//       const key = `${origVer}:${word.strong}`;
//       const existingIndex = lexicons.findIndex((l) => l.key === key);

//       if (existingIndex !== -1) {
//         // Оновити існуючий лексикон
//         // console.log("🔄 PassagePage: оновлення існуючого лексикону", { key });
//         const newLex = [...lexicons];
//         newLex[existingIndex].data = data;
//         setLexicons(newLex);
//       } else if (lexicons.length < 2) {
//         // Додати новий лексикон
//         const newLexicon = {
//           id: Date.now(),
//           key,
//           data,
//           origVer,
//           lang: word.strong.startsWith("H") ? "he" : "gr",
//         };

//         // console.log("➕ PassagePage: додавання нового лексикону", newLexicon);
//         setLexicons([...lexicons, newLexicon]);
//       } else {
//         // Замінити останній лексикон
//         // console.log("🔄 PassagePage: заміна останнього лексикону");
//         const newLex = [...lexicons];
//         newLex[1] = {
//           id: Date.now(),
//           key,
//           data,
//           origVer,
//           lang: word.strong.startsWith("H") ? "he" : "gr",
//         };
//         setLexicons(newLex);
//       }
//     },
//     [lexicons]
//   );

//   // ==================== РЕНДЕРИНГ ====================

//   // console.log("🎨 PassagePage: початок рендерингу", {
//   //   panelsCount: panels.length,
//   //   lexiconsCount: lexicons.length,
//   //   coreLoading,
//   //   coreDataKeys: Object.keys(coreData),
//   // });

//   return (
//     <div className="passage-container">
//       <div className="passage-panels">
//         {panels.map((panel, index) => (
//           <Panel
//             key={panel.id}
//             id={panel.id}
//             onClose={closePanel}
//             disableClose={panels.length === 1}
//             coreData={coreData}
//             coreLoading={coreLoading}
//             lang={lang}
//             isMaster={index === 0}
//             masterRef={panels[0]?.currentRef || "GEN.1"}
//             onWordClick={handleWordClick}
//             onNewPanel={addPanel}
//           />
//         ))}
//       </div>

//       {lexicons.length > 0 && (
//         <div className="lexicon-column">
//           {lexicons.map((lex) => (
//             <LexiconWindow
//               key={lex.id}
//               data={lex.data}
//               lang={lang}
//               onClose={() => closeLexicon(lex.id)}
//               coreData={coreData}
//               origVer={lex.origVer}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PassagePage;

// // console.log("📦 PassagePage.js: модуль завантажено та експортовано");

// =============================

// src/components/PassagePage.js - ФІНАЛЬНА ОПТИМІЗОВАНА ВЕРСІЯ
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
  }) => {
    const { get: getCache, set: setCache } = useChapterCache();
    const [currentRef, setCurrentRef] = useState("GEN.1");
    const [versions, setVersions] = useState([]);
    const [chapterData, setChapterData] = useState({});
    const [loading, setLoading] = useState(false);
    const [translationsData, setTranslationsData] = useState(null);

    // Завантаження translations.json (один раз)
    useEffect(() => {
      const loadTranslations = async () => {
        try {
          const response = await fetch("/data/translations.json");
          if (response.ok) {
            const data = await response.json();
            setTranslationsData(data);

            // Встановлюємо дефолтні версії
            const [book] = currentRef.split(".");
            const testament = getTestament(book);
            const defaultVersions =
              testament === "NewT" ? ["TR", "UTT"] : ["LXX", "UTT"];
            setVersions(defaultVersions);
          }
        } catch (error) {
          logger.error("Помилка завантаження translations.json:", error);
        }
      };

      loadTranslations();
    }, [currentRef]);

    // const getTestament = useCallback((bookCode) => {
    //   return [
    //     "MAT",
    //     "MRK",
    //     "LUK",
    //     "JHN",
    //     "ACT",
    //     "ROM",
    //     "1CO",
    //     "2CO",
    //     "GAL",
    //     "EPH",
    //     "PHP",
    //     "COL",
    //     "1TH",
    //     "2TH",
    //     "1TI",
    //     "2TI",
    //     "TIT",
    //     "PHM",
    //     "HEB",
    //     "JAS",
    //     "1PE",
    //     "2PE",
    //     "1JN",
    //     "2JN",
    //     "3JN",
    //     "JUD",
    //     "REV",
    //   ].includes(bookCode)
    //     ? "NewT"
    //     : "OldT";
    // }, []);
    // Виправлена функція getTestament в PassagePage.js
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
      // if (versions.length === 0) return;
      // const [book, chapterStr] = currentRef.split(".");
      // const chapter = parseInt(chapterStr);
      // if (!book || !chapter) return;
      if (versions.length === 0 && translationsData) {
        const [book] = currentRef.split(".");
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

        // Якщо після корекції масив порожній - встановлюємо дефолт
        if (correctedVersions.length === 0) {
          const defaultVersions =
            testament === "NewT" ? ["TR", "UTT"] : ["LXX", "UTT"];
          setVersions(defaultVersions);
        } else if (correctedVersions.length !== versions.length) {
          setVersions(correctedVersions);
        }
      }

      if (versions.length === 0) return;
      const [book, chapterStr] = currentRef.split(".");
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

      // const loadPromises = versions.map(async (ver) => {
      //   const testament = getTestament(book);
      //   const verLower = ver.toLowerCase();
      //   const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(verLower);
      //   const base = isOriginal ? "originals" : "translations";
      //   const bookLower = book.toLowerCase();

      //   // Тільки основні URL (без fallback для простоти)
      //   const url = `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;

      //   try {
      //     const start = performance.now();
      //     const response = await fetch(url);
      //     const data = await response.json();
      //     const end = performance.now();

      //     logger.debug(`Завантажено ${ver} за ${(end - start).toFixed(1)}мс`);
      //     return { ver, data: data.verses || [] };
      //   } catch (error) {
      //     logger.warn(`Не вдалося завантажити ${ver}:`, error);
      //     return { ver, data: [] };
      //   }
      // });
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
          if (response.ok) {
            const data = await response.json();
            return { ver, data: data.verses || [] };
          }
        } catch (error) {
          logger.warn(`Не вдалося завантажити ${ver}:`, error);
        }

        return { ver, data: [] };
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
      currentRef,
      versions,
      getTestament,
      getCache,
      setCache,
      translationsData,
      versions,
      getTestament,
    ]);

    // Формування пар для InterlinearVerse
    const pairs = useMemo(() => {
      if (!translationsData) return [];

      const [book] = currentRef.split(".");
      const testament = getTestament(book);
      const pairs = [];

      // Групуємо оригінали та переклади
      const originals = versions.filter((v) =>
        ["LXX", "THOT", "TR", "GNT"].includes(v.toUpperCase())
      );

      const translations = versions.filter(
        (v) => !["LXX", "THOT", "TR", "GNT"].includes(v.toUpperCase())
      );

      originals.forEach((original) => {
        // Знаходимо переклади для цього оригіналу
        const relatedTranslations = translations.filter((trans) => {
          const transInfo = translationsData?.bibles?.find(
            (b) => b.initials === trans
          );
          if (!transInfo?.basedOn) return false;

          if (testament === "OldT") {
            return transInfo.basedOn.old_testament === original.toLowerCase();
          } else {
            return transInfo.basedOn.new_testament === "tr"; // Для NT всі переклади на основі TR
          }
        });

        pairs.push({
          original: original,
          translations: relatedTranslations,
          testament: testament,
        });
      });

      return pairs;
    }, [versions, translationsData, currentRef, getTestament]);

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

    // src/components/PassagePage.js - адаптація для мобільних
    const maxPanels = isMobile() ? 1 : window.innerWidth < 992 ? 2 : 4;
    const versesToRender = isMobile()
      ? verseNumbers.slice(0, 10) // Перші 10 віршів
      : verseNumbers;
    // У PassagePage.js - виправлений алгоритм формування шляху - не виправляє помилку щляху
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
        console.warn("TR тільки для NT");
        return null;
      }

      // 4. GNT - тільки NewT
      if (verLower === "gnt" && testament === "OldT") {
        console.warn("GNT тільки для NT");
        return null;
      }

      // Формуємо правильний шлях - не виправляє помилку щляху
      return `/data/${base}/${verLower}/${testament}/${book}/${bookLower}${chapter}_${verLower}.json`;
    };
    // const getFilePath = useCallback(
    //   (version, bookCode, chapter) => {
    //     const ver = version.toLowerCase();
    //     const isOriginal = ["lxx", "thot", "tr", "gnt"].includes(ver);
    //     const base = isOriginal ? "originals" : "translations";
    //     const testament = getTestament(bookCode);

    //     return {
    //       original: `/data/${base}/${ver}/${testament}/${bookCode}/${bookCode.toLowerCase()}${chapter}_${ver}.json`,
    //       compressed: `/data_compressed/${base}/${ver}/${testament}/${bookCode}/${bookCode.toLowerCase()}${chapter}_${ver}.json`,
    //       testament: testament,
    //     };
    //   },
    //   [getTestament]
    // );
    // const [book, chapter] = currentRef.split(".");

    return (
      <div className="panel">
        <PassageOptionsGroup
          lang={lang}
          currentRef={currentRef}
          setCurrentRef={setCurrentRef}
          versions={versions}
          setVersions={setVersions}
          onPrevChapter={() => {
            const [b, c] = currentRef.split(".");
            const nc = Math.max(1, parseInt(c) - 1);
            setCurrentRef(`${b}.${nc}`);
          }}
          onNextChapter={() => {
            const [b, c] = currentRef.split(".");
            const nc = parseInt(c) + 1;

            // Перевіряємо максимальну кількість глав
            const testament = getTestament(b);
            const versionKey = versions[0]?.toLowerCase();

            if (coreData[versionKey] && coreData[versionKey][testament]) {
              const books = coreData[versionKey][testament].flatMap(
                (g) => g.books
              );
              const bookInfo = books.find((bk) => bk.code === b);

              if (bookInfo && nc <= bookInfo.chapters) {
                setCurrentRef(`${b}.${nc}`);
              }
            }
          }}
          onNewPanel={onNewPanel}
          onClosePanel={() => onClose(id)}
          disableClose={disableClose}
          coreData={coreData}
          coreLoading={coreLoading}
        />

        <div className="chapter-viewer flex-fill overflow-auto p-3">
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
              <h4 className="text-center mb-4">{currentRef}</h4>
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
  }
);

// ==================== ОСНОВНИЙ КОМПОНЕНТ ====================
const PassagePage = memo(({ lang }) => {
  const [panels, setPanels] = useState([{ id: Date.now() }]);
  const [lexicons, setLexicons] = useState([]);
  const [coreData, setCoreData] = useState({});
  const [coreLoading, setCoreLoading] = useState(true);

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
        setTimeout(() => {
          sessionStorage.removeItem("core_data_v2");
        }, 60 * 60 * 1000);

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
    [panels]
  );

  const handleWordClick = useCallback(
    (data) => {
      const { word, origVer } = data;
      if (!word?.strong || !origVer) return;

      const key = `${origVer}:${word.strong}`;

      // Перевіряємо, чи вже відкритий цей словник
      const existingIndex = lexicons.findIndex((l) => l.key === key);

      if (existingIndex !== -1) {
        // Оновлюємо існуючий
        const newLex = [...lexicons];
        newLex[existingIndex].data = data;
        setLexicons(newLex);
      } else if (lexicons.length < 2) {
        // Додаємо новий
        setLexicons([
          ...lexicons,
          {
            id: Date.now(),
            key,
            data,
            origVer,
            lang: word.strong.startsWith("H") ? "he" : "gr",
          },
        ]);
      } else {
        // Замінюємо останній
        const newLex = [...lexicons];
        newLex[1] = {
          id: Date.now(),
          key,
          data,
          origVer,
          lang: word.strong.startsWith("H") ? "he" : "gr",
        };
        setLexicons(newLex);
      }
    },
    [lexicons]
  );

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
          />
        ))}
      </div>

      {lexicons.length > 0 && (
        <div className="lexicon-column">
          {lexicons.map((lex) => (
            <LexiconWindow
              key={lex.id}
              data={lex.data}
              lang={lang}
              onClose={() =>
                setLexicons(lexicons.filter((l) => l.id !== lex.id))
              }
              coreData={coreData}
              origVer={lex.origVer}
            />
          ))}
        </div>
      )}
    </div>
  );
});

PassagePage.displayName = "PassagePage";
export default PassagePage;
