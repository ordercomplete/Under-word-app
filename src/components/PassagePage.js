// ---------------------------------------------------

// src/components/PassagePage.js
// import React, { useState, useEffect, useRef } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "../modals/BookSelector";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// import "../styles/LexiconWindow.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("GEN.1");
//   const [versions, setVersions] = useState(["LXX", "UTT"]);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [lexicons, setLexicons] = useState([]); // Масив для лексиконів (до 2, за мовами)
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);
//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   // === CORE.JSON ===
//   const [coreData, setCoreData] = useState({});
//   const [coreLoading, setCoreLoading] = useState(true);

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((r) => {
//         if (!r.ok) throw new Error(`HTTP ${r.status}`);
//         return r.json();
//       })
//       .then((data) => {
//         console.log("coreData loaded:", data);
//         setCoreData(data);
//       })
//       .catch((err) => {
//         console.error("core.json error:", err);
//       })
//       .finally(() => setCoreLoading(false));
//   }, []);

//   // === ВИПРАВЛЕНО: НЕ ВІДКРИВАЙ ДО ЗАВАНТАЖЕННЯ ===
//   const openBookModal = () => {
//     if (coreLoading) {
//       alert(lang.loading || "Завантаження книг...");
//       return;
//     }
//     if (!coreData || Object.keys(coreData).length === 0) {
//       alert(lang.error || "Помилка завантаження core.json");
//       return;
//     }
//     setShowBookModal(true);
//   };

//   // === ЗАВАНТАЖЕННЯ РОЗДІЛУ ===
//   useEffect(() => {
//     const [book, chapterStr] = currentRef.split(".");
//     const chapter = parseInt(chapterStr);
//     if (!book || !chapter) return;

//     setLoading(true);

//     const loadChapter = async (ver) => {
//       const lower = ver.toLowerCase();
//       const isOriginal = ["lxx", "thot"].includes(lower);
//       const base = isOriginal ? "originals" : "translations";
//       const url = `/data/${base}/${lower}/OldT/${book}/${book.toLowerCase()}${chapter}_${lower}.json`;

//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         return { ver, data };
//       } catch (err) {
//         console.error(`Failed to load ${ver} ${book}:${chapter}`, err);
//         return { ver, data: [] }; // Запобіжник: порожні дані
//       }
//     };

//     Promise.all(versions.map(loadChapter))
//       .then((results) => {
//         const newData = {};
//         results.forEach(({ ver, data }) => {
//           newData[ver] = data;
//         });
//         setChapterData(newData);
//       })
//       .finally(() => setLoading(false));
//   }, [currentRef, versions]);

//   // === ЛЕКСИКОН ===
//   const handleWordClick = (data) => {
//     const wordLang = data.lang; // 'gr', 'he', 'uk'
//     const existingIndex = lexicons.findIndex((l) => l.lang === wordLang);

//     if (existingIndex !== -1) {
//       // Оновити існуюче вікно для тієї ж мови
//       const newLex = [...lexicons];
//       newLex[existingIndex].data = data;
//       setLexicons(newLex);
//     } else if (lexicons.length < 2) {
//       // Додати нове вікно для нової мови
//       setLexicons([...lexicons, { id: Date.now(), data, lang: wordLang }]);
//     } else {
//       // Якщо 2 вже є, оновити перше вікно (або останнє, для не в парі)
//       const newLex = [...lexicons];
//       newLex[0].data = data;
//       newLex[0].lang = wordLang;
//       setLexicons(newLex);
//     }
//   };

//   const closeLexicon = (id) => {
//     setLexicons(lexicons.filter((l) => l.id !== id));
//   };

//   // === КІЛЬКІСТЬ ВІРШІВ ===
//   const getVerseCount = () => {
//     const primaryVer = versions[0];
//     if (!chapterData[primaryVer] || chapterData[primaryVer].length === 0)
//       return 0;
//     return chapterData[primaryVer].length;
//   };

//   // === ГРУПУВАННЯ В ПАРИ ДЛЯ КОЛОНОК ===
//   const getPairs = () => {
//     const pairs = [];
//     if (versions.includes("THOT") || versions.includes("UBT")) {
//       pairs.push({ origVer: "THOT", transVer: "UBT" });
//     }
//     if (versions.includes("LXX") || versions.includes("UTT")) {
//       pairs.push({ origVer: "LXX", transVer: "UTT" });
//     }
//     versions.forEach((v) => {
//       if (!["THOT", "LXX", "UBT", "UTT"].includes(v)) {
//         pairs.push({ origVer: null, transVer: v });
//       }
//     });
//     return pairs;
//   };

//   const pairs = getPairs();
//   const columnRefs = useRef([]);

//   // === СИНХРОН СКРОЛУ ===
//   useEffect(() => {
//     if (!isScrollSynced) return;

//     const syncScroll = (index) => (e) => {
//       const scrollTop = e.target.scrollTop;
//       columnRefs.current.forEach((ref, i) => {
//         if (i !== index && ref) {
//           ref.scrollTop = scrollTop;
//         }
//       });
//     };

//     columnRefs.current.forEach((ref, index) => {
//       if (ref) {
//         ref.addEventListener("scroll", syncScroll(index));
//       }
//     });

//     return () => {
//       columnRefs.current.forEach((ref, index) => {
//         if (ref) {
//           ref.removeEventListener("scroll", syncScroll(index));
//         }
//       });
//     };
//   }, [pairs.length, isScrollSynced]);

//   return (
//     <div className="passage-container d-flex  vh-100">
//       {/* vh-100 для повної висоти */}
//       {/* ЛІВИЙ БЛОК: МЕНЮ + КОЛОНКИ ПЕРЕКЛАДІВ */}
//       <div className="passage-columns d-flex flex-column flex-fill">
//         <PassageOptionsGroup
//           lang={lang}
//           currentRef={currentRef}
//           setCurrentRef={setCurrentRef}
//           versions={versions}
//           setVersions={setVersions}
//           onOpenBookSelector={openBookModal}
//           onPrevChapter={() => {
//             const [b, c] = currentRef.split(".");
//             const nc = Math.max(1, parseInt(c) - 1);
//             setCurrentRef(`${b}.${nc}`);
//           }}
//           onNextChapter={() => {
//             const [b, c] = currentRef.split(".");
//             const nc = parseInt(c) + 1;
//             const chapters =
//               coreData[versions[0]?.toLowerCase()]?.OldT.flatMap(
//                 (g) => g.books
//               ).find((bk) => bk.code === b)?.chapters || 1;
//             if (nc <= chapters) {
//               setCurrentRef(`${b}.${nc}`);
//             }
//           }}
//           coreData={coreData}
//           coreLoading={coreLoading}
//           isScrollSynced={isScrollSynced}
//           setIsScrollSynced={setIsScrollSynced}
//         />

//         <div className="columns-row d-flex flex-fill">
//           {loading ? (
//             <p className="text-center w-100">
//               {lang.loading || "Завантаження..."}
//             </p>
//           ) : pairs.length === 0 ? (
//             <p className="text-center w-100 text-danger">
//               {lang.no_versions || "Оберіть версії"}
//             </p>
//           ) : (
//             pairs.map((pair, colIndex) => (
//               <div
//                 key={colIndex}
//                 className="passage-column flex-fill d-flex flex-column"
//                 ref={(el) => (columnRefs.current[colIndex] = el)}
//                 style={{ overflowY: "auto" }}
//               >
//                 <div className="chapter-viewer flex-fill p-3">
//                   {chapterData[pair.origVer || pair.transVer]?.length === 0 ? (
//                     <p className="text-center text-muted">
//                       {lang.no_data || "Дані для версії недоступні"}
//                     </p>
//                   ) : (
//                     <>
//                       <h4 className="text-center mb-3">
//                         {currentRef} (
//                         {pair.origVer
//                           ? `${pair.origVer}/${pair.transVer || ""}`
//                           : pair.transVer}
//                         )
//                       </h4>
//                       {Array.from({ length: getVerseCount() }, (_, i) => {
//                         const verseNum = i + 1;
//                         const origVerse = chapterData[pair.origVer]?.find(
//                           (v) => v.v === verseNum
//                         );
//                         const transVerse = chapterData[pair.transVer]?.find(
//                           (v) => v.v === verseNum
//                         );

//                         return (
//                           <InterlinearVerse
//                             key={verseNum}
//                             verseNum={verseNum}
//                             origWords={origVerse?.words || []}
//                             transWords={transVerse?.words || []}
//                             onWordClick={handleWordClick}
//                           />
//                         );
//                       })}
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       {/* ПРАВИЙ БЛОК: ЛЕКСИКОНИ, тільки якщо є */}
//       {lexicons.length > 0 && (
//         <div className="lexicon-column d-flex ">
//           {lexicons.map((lex) => (
//             <LexiconWindow
//               key={lex.id}
//               data={lex.data}
//               lang={lang}
//               onClose={() => closeLexicon(lex.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PassagePage;

//PassagePage.js 07.11.2026 додавання незаледних вікон перекладів

// import React, { useState, useEffect, useRef } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "../modals/BookSelector";
// import TranslationSelector from "../modals/TranslationSelector";
// import ChapterSelector from "../modals/ChapterSelector";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// import "../styles/LexiconWindow.css";
// ChapterSelector;
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
// }) => {
//   const [currentRef, setCurrentRef] = useState("GEN.1");
//   const [versions, setVersions] = useState(["LXX", "UTT"]);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [isScrollSynced, setIsScrollSynced] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);
//   const [showBook, setShowBook] = useState(false);
//   const [showChapter, setShowChapter] = useState(false);
//   const [selectedBook, setSelectedBook] = useState("GEN");
//   const [selectedChapters, setSelectedChapters] = useState(50);

//   useEffect(() => {
//     if (isScrollSynced && !isMaster && masterRef) {
//       const [book, chapter] = masterRef.split(".");
//       // Перевірити чи книга підтримується в версіях панелі
//       const supported = coreData[versions[0]?.toLowerCase()]?.OldT?.flatMap(
//         (g) => g.books
//       ).some((b) => b.code === book);
//       if (supported) {
//         setCurrentRef(masterRef);
//         setMessage(null);
//       } else {
//         setMessage("Книга не підтримується в обраних версіях");
//       }
//     }
//   }, [isScrollSynced, masterRef, isMaster, versions, coreData]);

//   useEffect(() => {
//     const [book, chapterStr] = currentRef.split(".");
//     const chapter = parseInt(chapterStr);
//     if (!book || !chapter) return;

//     setLoading(true);
//     setMessage(null);

//     const loadChapter = async (ver) => {
//       const lower = ver.toLowerCase();
//       const isOriginal = ["lxx", "thot"].includes(lower);
//       const base = isOriginal ? "originals" : "translations";
//       const url = `/data/${base}/${lower}/OldT/${book}/${book.toLowerCase()}${chapter}_${lower}.json`;

//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         return { ver, data };
//       } catch (err) {
//         console.error(`Failed to load ${ver} ${book}:${chapter}`, err);
//         return { ver, data: [] };
//       }
//     };

//     Promise.all(versions.map(loadChapter))
//       .then((results) => {
//         const newData = {};
//         results.forEach(({ ver, data }) => {
//           newData[ver] = data;
//         });
//         setChapterData(newData);
//       })
//       .catch(() => setMessage("Помилка завантаження"))
//       .finally(() => setLoading(false));
//   }, [currentRef, versions]);

//   const getVerseCount = () => {
//     const primaryVer = versions[0];
//     if (!chapterData[primaryVer] || chapterData[primaryVer].length === 0)
//       return 0;
//     return chapterData[primaryVer].length;
//   };

//   const getPairs = () => {
//     const pairs = [];
//     if (versions.includes("THOT") || versions.includes("UBT")) {
//       pairs.push({ origVer: "THOT", transVer: "UBT" });
//     }
//     if (versions.includes("LXX") || versions.includes("UTT")) {
//       pairs.push({ origVer: "LXX", transVer: "UTT" });
//     }
//     versions.forEach((v) => {
//       if (!["THOT", "LXX", "UBT", "UTT"].includes(v)) {
//         pairs.push({ origVer: null, transVer: v });
//       }
//     });
//     return pairs;
//   };

//   const [book, chapter] = currentRef.split(".");

//   return (
//     <div className="panel flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef}
//         versions={versions}
//         setVersions={setVersions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={() => {
//           const [b, c] = currentRef.split(".");
//           const nc = Math.max(1, parseInt(c) - 1);
//           setCurrentRef(`${b}.${nc}`);
//         }}
//         onNextChapter={() => {
//           const [b, c] = currentRef.split(".");
//           const nc = parseInt(c) + 1;
//           const chapters =
//             coreData[versions[0]?.toLowerCase()]?.OldT.flatMap(
//               (g) => g.books
//             ).find((bk) => bk.code === b)?.chapters || 1;
//           if (nc <= chapters) {
//             setCurrentRef(`${b}.${nc}`);
//           }
//         }}
//         onNewPanel={() => {}} // Не передаємо, бо global в PassagePage
//         onClosePanel={onClose}
//         disableClose={disableClose}
//         coreData={coreData}
//         coreLoading={coreLoading}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3">
//         {loading ? (
//           <p className="text-center">{lang.loading || "Завантаження..."}</p>
//         ) : message ? (
//           <p className="text-center text-danger">{message}</p>
//         ) : (
//           <>
//             <h4 className="text-center mb-3">{currentRef}</h4>
//             {Array.from({ length: getVerseCount() }, (_, i) => {
//               const verseNum = i + 1;
//               return (
//                 <InterlinearVerse
//                   key={verseNum}
//                   verseNum={verseNum}
//                   pairs={getPairs()}
//                   chapterData={chapterData}
//                   onWordClick={onWordClick} // Використовуйте пропс
//                 />
//               );
//             })}
//           </>
//         )}
//       </div>

//       {/* Модалки per-panel */}
//       <TranslationSelector
//         isOpen={showTranslationModal}
//         onRequestClose={() => setShowTranslationModal(false)}
//         lang={lang}
//         onSelectVersions={setVersions}
//       />
//       <BookSelector
//         isOpen={showBook}
//         onRequestClose={() => setShowBook(false)}
//         lang={lang}
//         versions={versions}
//         onSelectBook={(code) => {
//           setSelectedBook(code);
//           const bookData = coreData[versions[0].toLowerCase()]?.OldT?.flatMap(
//             (g) => g.books
//           ).find((b) => b.code === code);
//           setSelectedChapters(bookData?.chapters || 1);
//           setCurrentRef(`${code}.1`);
//         }}
//       />
//       <ChapterSelector
//         isOpen={showChapter}
//         onRequestClose={() => setShowChapter(false)}
//         lang={lang}
//         bookCode={book}
//         chapters={selectedChapters}
//         onSelectChapter={(ch) => {
//           setCurrentRef(`${book}.${ch}`);
//         }}
//       />
//     </div>
//   );
// };

// const PassagePage = ({ lang }) => {
//   const [panels, setPanels] = useState([{ id: Date.now() }]);
//   const [lexicons, setLexicons] = useState([]);
//   const [coreData, setCoreData] = useState({});
//   const [coreLoading, setCoreLoading] = useState(true);

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((r) => {
//         if (!r.ok) throw new Error(`HTTP ${r.status}`);
//         return r.json();
//       })
//       .then((data) => {
//         setCoreData(data);
//       })
//       .catch((err) => {
//         console.error("core.json error:", err);
//       })
//       .finally(() => setCoreLoading(false));
//   }, []);

//   const addPanel = () => {
//     const maxPanels = window.innerWidth < 992 ? 2 : 4;
//     if (panels.length < maxPanels) {
//       setPanels([...panels, { id: Date.now() }]);
//     } else {
//       alert(`Максимум ${maxPanels} вікон`);
//     }
//   };

//   const closePanel = (id) => {
//     if (panels.length > 1) {
//       setPanels(panels.filter((p) => p.id !== id));
//     }
//   };

//   const handleWordClick = (data) => {
//     const wordLang = data.lang;
//     const existingIndex = lexicons.findIndex((l) => l.lang === wordLang);

//     if (existingIndex !== -1) {
//       const newLex = [...lexicons];
//       newLex[existingIndex].data = data;
//       setLexicons(newLex);
//     } else if (lexicons.length < 2) {
//       setLexicons([...lexicons, { id: Date.now(), data, lang: wordLang }]);
//     } else {
//       const newLex = [...lexicons];
//       newLex[newLex.length - 1].data = data;
//       newLex[newLex.length - 1].lang = wordLang;
//       setLexicons(newLex);
//     }
//   };

//   const closeLexicon = (id) => {
//     setLexicons(lexicons.filter((l) => l.id !== id));
//   };

//   const masterRef = panels[0]?.currentRef || "GEN.1"; // Для синхрону

//   return (
//     <div className="passage-container d-flex flex-column vh-100">
//       <div className="passage-panels d-flex flex-fill overflow-auto">
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
//             masterRef={masterRef}
//             onWordClick={handleWordClick} // Додайте це
//           />
//         ))}
//       </div>

//       {lexicons.length > 0 && (
//         <div className="lexicon-column d-flex flex-column">
//           {lexicons.map((lex) => (
//             <LexiconWindow
//               key={lex.id}
//               data={lex.data}
//               lang={lang}
//               onClose={() => closeLexicon(lex.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PassagePage;

//----------------------------------------------------

// PassagePage.js
import React, { useState, useEffect, useRef } from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import InterlinearVerse from "./InterlinearVerse";
import LexiconWindow from "./LexiconWindow";
import "../styles/LexiconWindow.css";
import "../styles/PassagePage.css";

const Panel = ({
  id,
  onClose,
  disableClose,
  coreData,
  coreLoading,
  lang,
  isMaster = false,
  masterRef,
  onWordClick,
  onNewPanel, // Додано для передачі addPanel
}) => {
  const [currentRef, setCurrentRef] = useState("GEN.1");
  const [versions, setVersions] = useState(["LXX", "UTT"]);
  const [chapterData, setChapterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  console.log(
    `Panel ${id} initialized with currentRef: ${currentRef}, versions: ${versions.join(
      ", "
    )}`
  );
  console.log(
    "Panel: 1-PassagePage coreData keys:",
    Object.keys(coreData || {})
  ); // Лог ініціалізації панелі

  useEffect(() => {
    const [book, chapterStr] = currentRef.split(".");
    const chapter = parseInt(chapterStr);
    if (!book || !chapter) return;

    console.log(
      `Panel ${id}: Loading chapter for ${currentRef}, versions: ${versions.join(
        ", "
      )}`
    ); // Лог завантаження
    console.log("Panel: 2-coreData keys:", Object.keys(coreData || {}));
    setLoading(true);
    setMessage(null);

    const loadChapter = async (ver) => {
      const lower = ver.toLowerCase();
      const isOriginal = ["lxx", "thot"].includes(lower);
      const base = isOriginal ? "originals" : "translations";
      const url = `/data/${base}/${lower}/OldT/${book}/${book.toLowerCase()}${chapter}_${lower}.json`;

      try {
        console.log(`Panel ${id}: Fetching ${url}`); // Лог URL
        console.log("Panel: 3-coreData keys:", Object.keys(coreData || {}));
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { ver, data };
      } catch (err) {
        console.error(
          `Panel ${id}: Failed to load ${ver} ${book}:${chapter}`,
          err
        );
        return { ver, data: [] };
      }
    };

    Promise.all(versions.map(loadChapter))
      .then((results) => {
        const newData = {};
        results.forEach(({ ver, data }) => {
          newData[ver] = data;
        });
        console.log(`Panel ${id}: Chapter loaded successfully`);
        console.log("Panel: 4-coreData keys:", Object.keys(coreData || {}));
        setChapterData(newData);
      })
      .catch(() => {
        console.error(`Panel ${id}: Error loading chapter`);
        console.log("Panel: 5-coreData keys:", Object.keys(coreData || {}));
        setMessage("Помилка завантаження");
      })
      .finally(() => setLoading(false));
  }, [currentRef, versions]);

  const getVerseCount = () => {
    const primaryVer = versions[0];
    if (!chapterData[primaryVer] || chapterData[primaryVer].length === 0)
      return 0;
    return chapterData[primaryVer].length;
  };

  const getPairs = () => {
    const pairs = [];
    if (versions.includes("THOT") || versions.includes("UBT")) {
      pairs.push({ origVer: "THOT", transVer: "UBT" });
    }
    if (versions.includes("LXX") || versions.includes("UTT")) {
      pairs.push({ origVer: "LXX", transVer: "UTT" });
    }
    versions.forEach((v) => {
      if (!["THOT", "LXX", "UBT", "UTT"].includes(v)) {
        pairs.push({ origVer: null, transVer: v });
      }
    });
    return pairs;
  };

  const [book, chapter] = currentRef.split(".");

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
          const chapters =
            coreData[versions[0]?.toLowerCase()]?.OldT.flatMap(
              (g) => g.books
            ).find((bk) => bk.code === b)?.chapters || 1;
          if (nc <= chapters) {
            setCurrentRef(`${b}.${nc}`);
          }
        }}
        onNewPanel={onNewPanel} // Додано передачу
        onClosePanel={() => onClose(id)} // Передаємо id
        disableClose={disableClose}
        coreData={coreData}
        coreLoading={coreLoading}
      />

      <div className="chapter-viewer flex-fill overflow-auto p-3">
        {loading ? (
          <p className="text-center">{lang.loading || "Завантаження..."}</p>
        ) : message ? (
          <p className="text-center text-danger">{message}</p>
        ) : (
          <>
            <h4 className="text-center mb-3">{currentRef}</h4>
            {Array.from({ length: getVerseCount() }, (_, i) => {
              const verseNum = i + 1;
              return (
                <InterlinearVerse
                  key={verseNum}
                  verseNum={verseNum}
                  pairs={getPairs()}
                  chapterData={chapterData}
                  onWordClick={onWordClick}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const PassagePage = ({ lang }) => {
  const [panels, setPanels] = useState([{ id: Date.now() }]);
  const [lexicons, setLexicons] = useState([]);
  const [coreData, setCoreData] = useState({});
  const [coreLoading, setCoreLoading] = useState(true);

  // const [strongsCache, setStrongsCache] = useState({});

  console.log("PassagePage rendered, panels count:", panels.length); // Лог рендеру

  useEffect(() => {
    let isMounted = true;
    const loadCoreData = async () => {
      try {
        const [coreRes, strongsRes] = await Promise.all([
          fetch("/data/core.json"),
        ]);

        if (!coreRes.ok) throw new Error(`HTTP ${coreRes.status}`);

        const core = await coreRes.json();

        setCoreData(core); // ← ТІЛЬКИ core.json
        if (isMounted) setCoreData(core);
        console.log("2-Core data loaded:", Object.keys(core)); //тут перший раз починає грузитись
      } catch (err) {
        console.error("Failed to load core data:", err);

        if (isMounted) setCoreData({});
      } finally {
        if (isMounted) setCoreLoading(false);
      }
      return () => {
        isMounted = false;
      };
    };

    loadCoreData();
  }, []);

  const addPanel = () => {
    const maxPanels = window.innerWidth < 992 ? 2 : 4;
    console.log(
      "Adding panel, current count:",
      panels.length,
      "max:",
      maxPanels
    ); // Лог додавання
    if (panels.length < maxPanels) {
      setPanels([...panels, { id: Date.now() }]);
    } else {
      alert(`Максимум ${maxPanels} вікон`);
    }
  };

  const closePanel = (id) => {
    console.log("Closing panel:", id, "current count:", panels.length); // Лог закриття
    if (panels.length > 1) {
      setPanels(panels.filter((p) => p.id !== id));
    }
  };

  const handleWordClick = (data) => {
    console.log("Word clicked in panel:", data); // Лог кліку

    const { word, origVer } = data; // ← ДОДАНО origVer
    if (!word?.strong || !origVer) {
      console.warn("Missing strong or origVer:", data);
      return;
    }

    const key = `${origVer}:${word.strong}`; // Унікальний ключ: LXX:G1722
    const existingIndex = lexicons.findIndex((l) => l.key === key);

    console.log(`Looking for lexicon: ${key}, found: ${existingIndex !== -1}`);

    if (existingIndex !== -1) {
      // Оновлюємо існуюче
      const newLex = [...lexicons];
      newLex[existingIndex].data = data;
      setLexicons(newLex);
    } else if (lexicons.length < 2) {
      // Додаємо нове
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
      // Замінюємо останнє
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
  };

  const closeLexicon = (id) => {
    console.log("Closing lexicon:", id); // Лог закриття лексикону
    setLexicons(lexicons.filter((l) => l.id !== id));
  };

  const masterRef = panels[0]?.currentRef || "GEN.1"; // Для синхрону

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
            isMaster={index === 0}
            masterRef={masterRef}
            onWordClick={handleWordClick}
            onNewPanel={addPanel} // Додано передачу
          />
        ))}
      </div>

      {lexicons.length > 0 && (
        <div className="lexicon-column  ">
          {lexicons.map((lex) => (
            <LexiconWindow
              key={lex.id}
              data={lex.data}
              lang={lang}
              onClose={() => closeLexicon(lex.id)}
              coreData={coreData} // ← ДОДАНО
              origVer={lex.origVer} // ← ДОДАНО
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassagePage;
