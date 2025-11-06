// import React, { useState, useEffect } from "react";
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
//   const [lexicon, setLexicon] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

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
//       const url = `/data/${base}/${lower}/OldT/${book}/gen${chapter}_${lower}.json`;

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
//       .finally(() => setLoading(false));
//   }, [currentRef, versions]);

//   // === ЛЕКСИКОН ===
//   const handleWordClick = (data) => {
//     setLexicon(data);
//   };

//   useEffect(() => {
//     setLexicon(null);
//   }, [currentRef]);

//   // === КІЛЬКІСТЬ ВІРШІВ ===
//   const getVerseCount = () => {
//     if (!chapterData.LXX) return 0;
//     return chapterData.LXX.length;
//   };

//   return (
//     <div className="passage-container d-flex">
//       {/* ОСНОВНА КОЛОНКА */}
//       <div className="passage-column flex-fill d-flex flex-column">
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
//         />

//         <div className="chapter-viewer flex-fill overflow-auto p-3">
//           {loading ? (
//             <p className="text-center">{lang.loading || "Завантаження..."}</p>
//           ) : (
//             <>
//               <h4 className="text-center mb-3">{currentRef}</h4>
//               {Array.from({ length: getVerseCount() }, (_, i) => {
//                 const verseNum = i + 1;
//                 const lxxVerse = chapterData.LXX?.find((v) => v.v === verseNum);
//                 const uttVerse = chapterData.UTT?.find((v) => v.v === verseNum);

//                 if (!lxxVerse && !uttVerse) return null;

//                 return (
//                   <InterlinearVerse
//                     key={verseNum}
//                     verseNum={verseNum}
//                     lxxWords={lxxVerse?.words || []}
//                     uttWords={uttVerse?.words || []}
//                     onWordClick={handleWordClick}
//                   />
//                 );
//               })}
//             </>
//           )}
//         </div>
//       </div>

//       {/* ЛЕКСИКОН */}
//       <div className="lexicon-column">
//         {lexicon?.lang === "gr" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.original || "Оригінал"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {lexicon?.lang === "uk" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.translation || "Переклад"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {!lexicon && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default PassagePage;

// ------------------------------------------------------------------------
//PassagePage.js
// import React, { useState, useEffect } from "react";
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
//   const [lexicon, setLexicon] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

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
//       .finally(() => setLoading(false));
//   }, [currentRef, versions]);

//   // === ЛЕКСИКОН ===
//   const handleWordClick = (data) => {
//     setLexicon(data);
//   };

//   useEffect(() => {
//     setLexicon(null);
//   }, [currentRef]);

//   // === КІЛЬКІСТЬ ВІРШІВ ===
//   const getVerseCount = () => {
//     const primaryVer = versions[0]; // ← УЗАГАЛЬНЕНО: перша версія визначає кількість віршів
//     if (!chapterData[primaryVer]) return 0;
//     return chapterData[primaryVer].length;
//   };

//   return (
//     <div className="passage-container d-flex">
//       {/* ОСНОВНА КОЛОНКА */}
//       <div className="passage-column flex-fill d-flex flex-column">
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
//           coreData={coreData} // ← НОВЕ: передаємо coreData в PassageOptionsGroup
//           coreLoading={coreLoading}
//         />

//         <div className="chapter-viewer flex-fill overflow-auto p-3">
//           {loading ? (
//             <p className="text-center">{lang.loading || "Завантаження..."}</p>
//           ) : (
//             <>
//               <h4 className="text-center mb-3">{currentRef}</h4>
//               {Array.from({ length: getVerseCount() }, (_, i) => {
//                 const verseNum = i + 1;
//                 // ← НОВЕ: узагальнюємо orig/trans
//                 const origVer =
//                   versions.find((v) => ["LXX", "THOT"].includes(v)) ||
//                   versions[0];
//                 const transVer =
//                   versions.find((v) => !["LXX", "THOT"].includes(v)) ||
//                   versions[1] ||
//                   origVer;
//                 const origVerse = chapterData[origVer]?.find(
//                   (v) => v.v === verseNum
//                 );
//                 const transVerse = chapterData[transVer]?.find(
//                   (v) => v.v === verseNum
//                 );

//                 if (!origVerse && !transVerse) return null;

//                 return (
//                   <InterlinearVerse
//                     key={verseNum}
//                     verseNum={verseNum}
//                     origWords={origVerse?.words || []} // ← Змінили на origWords/transWords
//                     transWords={transVerse?.words || []}
//                     onWordClick={handleWordClick}
//                   />
//                 );
//               })}
//             </>
//           )}
//         </div>
//       </div>

//       {/* ЛЕКСИКОН */}
//       <div className="lexicon-column">
//         {lexicon?.lang === "gr" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.original || "Оригінал"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {lexicon?.lang === "uk" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.translation || "Переклад"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {!lexicon && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// --------------------------------------------

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
//   const [lexicon, setLexicon] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

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
//     setLexicon(data);
//   };

//   useEffect(() => {
//     setLexicon(null);
//   }, [currentRef]);

//   // === КІЛЬКІСТЬ ВІРШІВ ===
//   const getVerseCount = () => {
//     const primaryVer = versions[0]; // Перша версія визначає кількість віршів
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
//     // Для інших версій (Synodal, KJV) — як trans only
//     versions.forEach((v) => {
//       if (!["THOT", "LXX", "UBT", "UTT"].includes(v)) {
//         pairs.push({ origVer: null, transVer: v });
//       }
//     });
//     return pairs;
//   };

//   const pairs = getPairs();
//   const columnRefs = useRef([]);

//   // === СИНХРОН СКРОЛУ (базовий, без ParallelScrolling.js) ===
//   useEffect(() => {
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
//   }, [pairs.length]); // Оновити при зміні кількості колонок

//   return (
//     <div className="passage-container d-flex">
//       {/* ОСНОВНА КОЛОНКА(И) */}
//       <div className="passage-columns d-flex flex-fill">
//         {loading ? (
//           <p className="text-center w-100">
//             {lang.loading || "Завантаження..."}
//           </p>
//         ) : pairs.length === 0 ? (
//           <p className="text-center w-100 text-danger">
//             {lang.no_versions || "Оберіть версії"}
//           </p>
//         ) : (
//           pairs.map((pair, colIndex) => (
//             <div
//               key={colIndex}
//               className="passage-column flex-fill d-flex flex-column"
//               ref={(el) => (columnRefs.current[colIndex] = el)}
//               style={{ overflowY: "auto" }} // Для скролу
//             >
//               <div className="chapter-viewer flex-fill p-3">
//                 {chapterData[pair.origVer || pair.transVer]?.length === 0 ? (
//                   <p className="text-center text-muted">
//                     {lang.no_data || "Дані для версії недоступні"}
//                   </p>
//                 ) : (
//                   <>
//                     <h4 className="text-center mb-3">
//                       {currentRef} (
//                       {pair.origVer
//                         ? `${pair.origVer}/${pair.transVer || ""}`
//                         : pair.transVer}
//                       )
//                     </h4>
//                     {Array.from({ length: getVerseCount() }, (_, i) => {
//                       const verseNum = i + 1;
//                       const origVerse = chapterData[pair.origVer]?.find(
//                         (v) => v.v === verseNum
//                       );
//                       const transVerse = chapterData[pair.transVer]?.find(
//                         (v) => v.v === verseNum
//                       );

//                       return (
//                         <InterlinearVerse
//                           key={verseNum}
//                           verseNum={verseNum}
//                           origWords={origVerse?.words || []}
//                           transWords={transVerse?.words || []}
//                           onWordClick={handleWordClick}
//                         />
//                       );
//                     })}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ЛЕКСИКОН */}
//       <div className="lexicon-column">
//         {lexicon?.lang === "gr" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.original || "Оригінал"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {lexicon?.lang === "uk" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.translation || "Переклад"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {!lexicon && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// --------------------------------------------------------

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
//   const [lexicon, setLexicon] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

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
//     setLexicon(data);
//   };

//   useEffect(() => {
//     setLexicon(null);
//   }, [currentRef]);

//   // === КІЛЬКІСТЬ ВІРШІВ ===
//   const getVerseCount = () => {
//     const primaryVer = versions[0]; // Перша версія визначає кількість віршів
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
//     // Для інших версій (Synodal, KJV) — як trans only
//     versions.forEach((v) => {
//       if (!["THOT", "LXX", "UBT", "UTT"].includes(v)) {
//         pairs.push({ origVer: null, transVer: v });
//       }
//     });
//     return pairs;
//   };

//   const pairs = getPairs();
//   const columnRefs = useRef([]);

//   // === СИНХРОН СКРОЛУ (базовий, без ParallelScrolling.js) ===
//   useEffect(() => {
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
//   }, [pairs.length]); // Оновити при зміні кількості колонок

//   return (
//     <div className="passage-container d-flex flex-column">
//       {/* Змінив на flex-column для вертикального розміщення меню + колонок */}
//       {/* МЕНЮ НАГОРІ */}
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef}
//         versions={versions}
//         setVersions={setVersions}
//         onOpenBookSelector={openBookModal}
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
//         coreData={coreData}
//         coreLoading={coreLoading}
//       />
//       {/* КОЛОНКИ ПІД МЕНЮ */}
//       <div className="passage-columns d-flex flex-fill">
//         {loading ? (
//           <p className="text-center w-100">
//             {lang.loading || "Завантаження..."}
//           </p>
//         ) : pairs.length === 0 ? (
//           <p className="text-center w-100 text-danger">
//             {lang.no_versions || "Оберіть версії"}
//           </p>
//         ) : (
//           pairs.map((pair, colIndex) => (
//             <div
//               key={colIndex}
//               className="passage-column flex-fill d-flex flex-column"
//               ref={(el) => (columnRefs.current[colIndex] = el)}
//               style={{ overflowY: "auto" }} // Для скролу
//             >
//               <div className="chapter-viewer flex-fill p-3">
//                 {chapterData[pair.origVer || pair.transVer]?.length === 0 ? (
//                   <p className="text-center text-muted">
//                     {lang.no_data || "Дані для версії недоступні"}
//                   </p>
//                 ) : (
//                   <>
//                     <h4 className="text-center mb-3">
//                       {currentRef} (
//                       {pair.origVer
//                         ? `${pair.origVer}/${pair.transVer || ""}`
//                         : pair.transVer}
//                       )
//                     </h4>
//                     {Array.from({ length: getVerseCount() }, (_, i) => {
//                       const verseNum = i + 1;
//                       const origVerse = chapterData[pair.origVer]?.find(
//                         (v) => v.v === verseNum
//                       );
//                       const transVerse = chapterData[pair.transVer]?.find(
//                         (v) => v.v === verseNum
//                       );

//                       return (
//                         <InterlinearVerse
//                           key={verseNum}
//                           verseNum={verseNum}
//                           origWords={origVerse?.words || []}
//                           transWords={transVerse?.words || []}
//                           onWordClick={handleWordClick}
//                         />
//                       );
//                     })}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       {/* ЛЕКСИКОН */}
//       <div className="lexicon-column">
//         {lexicon?.lang === "gr" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.original || "Оригінал"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {lexicon?.lang === "uk" && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">
//               {lexicon.word.strong} — {lang.translation || "Переклад"}
//             </h5>
//             <div className="lexicon-panel">
//               <LexiconWindow data={lexicon} lang={lang} />
//             </div>
//           </div>
//         )}

//         {!lexicon && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// ----------------------------------------------

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
//   const [lexicons, setLexicons] = useState([]); // Масив для кількох лексиконів (до 2)
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [showTranslationModal, setShowTranslationModal] = useState(false);
//   const [isScrollSynced, setIsScrollSynced] = useState(true); // Стан синхрону

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
//     if (lexicons.length < 2) {
//       setLexicons([...lexicons, { id: Date.now(), data }]);
//     } else {
//       alert(lang.max_lexicons || "Максимум 2 вікна лексикону");
//     }
//   };

//   const closeLexicon = (id) => {
//     setLexicons(lexicons.filter((l) => l.id !== id));
//   };

//   useEffect(() => {
//     if (lexicons.length === 0) {
//       // Якщо всі закриті, показати плейсхолдер
//     }
//   }, [lexicons]);

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
//     <div className="passage-container d-flex">
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

//       {/* ПРАВИЙ БЛОК: ЛЕКСИКОНИ ВЕРТИКАЛЬНО */}
//       <div className="lexicon-column d-flex flex-column">
//         {lexicons.length === 0 ? (
//           <div className="lexicon-window flex-fill">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         ) : (
//           lexicons.map((lex) => (
//             <LexiconWindow
//               key={lex.id}
//               data={lex.data}
//               lang={lang}
//               onClose={() => closeLexicon(lex.id)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// ---------------------------------------------------

// src/components/PassagePage.js
import React, { useState, useEffect, useRef } from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import BookSelector from "../modals/BookSelector";
import InterlinearVerse from "./InterlinearVerse";
import LexiconWindow from "./LexiconWindow";
import "../styles/LexiconWindow.css";

const PassagePage = ({ lang }) => {
  const [currentRef, setCurrentRef] = useState("GEN.1");
  const [versions, setVersions] = useState(["LXX", "UTT"]);
  const [chapterData, setChapterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lexicons, setLexicons] = useState([]); // Масив для лексиконів (до 2, за мовами)
  const [showBookModal, setShowBookModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [isScrollSynced, setIsScrollSynced] = useState(true);

  // === CORE.JSON ===
  const [coreData, setCoreData] = useState({});
  const [coreLoading, setCoreLoading] = useState(true);

  useEffect(() => {
    fetch("/data/core.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log("coreData loaded:", data);
        setCoreData(data);
      })
      .catch((err) => {
        console.error("core.json error:", err);
      })
      .finally(() => setCoreLoading(false));
  }, []);

  // === ВИПРАВЛЕНО: НЕ ВІДКРИВАЙ ДО ЗАВАНТАЖЕННЯ ===
  const openBookModal = () => {
    if (coreLoading) {
      alert(lang.loading || "Завантаження книг...");
      return;
    }
    if (!coreData || Object.keys(coreData).length === 0) {
      alert(lang.error || "Помилка завантаження core.json");
      return;
    }
    setShowBookModal(true);
  };

  // === ЗАВАНТАЖЕННЯ РОЗДІЛУ ===
  useEffect(() => {
    const [book, chapterStr] = currentRef.split(".");
    const chapter = parseInt(chapterStr);
    if (!book || !chapter) return;

    setLoading(true);

    const loadChapter = async (ver) => {
      const lower = ver.toLowerCase();
      const isOriginal = ["lxx", "thot"].includes(lower);
      const base = isOriginal ? "originals" : "translations";
      const url = `/data/${base}/${lower}/OldT/${book}/${book.toLowerCase()}${chapter}_${lower}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { ver, data };
      } catch (err) {
        console.error(`Failed to load ${ver} ${book}:${chapter}`, err);
        return { ver, data: [] }; // Запобіжник: порожні дані
      }
    };

    Promise.all(versions.map(loadChapter))
      .then((results) => {
        const newData = {};
        results.forEach(({ ver, data }) => {
          newData[ver] = data;
        });
        setChapterData(newData);
      })
      .finally(() => setLoading(false));
  }, [currentRef, versions]);

  // === ЛЕКСИКОН ===
  const handleWordClick = (data) => {
    const wordLang = data.lang; // 'gr', 'he', 'uk'
    const existingIndex = lexicons.findIndex((l) => l.lang === wordLang);

    if (existingIndex !== -1) {
      // Оновити існуюче вікно для тієї ж мови
      const newLex = [...lexicons];
      newLex[existingIndex].data = data;
      setLexicons(newLex);
    } else if (lexicons.length < 2) {
      // Додати нове вікно для нової мови
      setLexicons([...lexicons, { id: Date.now(), data, lang: wordLang }]);
    } else {
      // Якщо 2 вже є, оновити перше вікно (або останнє, для не в парі)
      const newLex = [...lexicons];
      newLex[0].data = data;
      newLex[0].lang = wordLang;
      setLexicons(newLex);
    }
  };

  const closeLexicon = (id) => {
    setLexicons(lexicons.filter((l) => l.id !== id));
  };

  // === КІЛЬКІСТЬ ВІРШІВ ===
  const getVerseCount = () => {
    const primaryVer = versions[0];
    if (!chapterData[primaryVer] || chapterData[primaryVer].length === 0)
      return 0;
    return chapterData[primaryVer].length;
  };

  // === ГРУПУВАННЯ В ПАРИ ДЛЯ КОЛОНОК ===
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

  const pairs = getPairs();
  const columnRefs = useRef([]);

  // === СИНХРОН СКРОЛУ ===
  useEffect(() => {
    if (!isScrollSynced) return;

    const syncScroll = (index) => (e) => {
      const scrollTop = e.target.scrollTop;
      columnRefs.current.forEach((ref, i) => {
        if (i !== index && ref) {
          ref.scrollTop = scrollTop;
        }
      });
    };

    columnRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener("scroll", syncScroll(index));
      }
    });

    return () => {
      columnRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener("scroll", syncScroll(index));
        }
      });
    };
  }, [pairs.length, isScrollSynced]);

  return (
    <div className="passage-container d-flex  vh-100">
      {/* vh-100 для повної висоти */}
      {/* ЛІВИЙ БЛОК: МЕНЮ + КОЛОНКИ ПЕРЕКЛАДІВ */}
      <div className="passage-columns d-flex flex-column flex-fill">
        <PassageOptionsGroup
          lang={lang}
          currentRef={currentRef}
          setCurrentRef={setCurrentRef}
          versions={versions}
          setVersions={setVersions}
          onOpenBookSelector={openBookModal}
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
          coreData={coreData}
          coreLoading={coreLoading}
          isScrollSynced={isScrollSynced}
          setIsScrollSynced={setIsScrollSynced}
        />

        <div className="columns-row d-flex flex-fill">
          {loading ? (
            <p className="text-center w-100">
              {lang.loading || "Завантаження..."}
            </p>
          ) : pairs.length === 0 ? (
            <p className="text-center w-100 text-danger">
              {lang.no_versions || "Оберіть версії"}
            </p>
          ) : (
            pairs.map((pair, colIndex) => (
              <div
                key={colIndex}
                className="passage-column flex-fill d-flex flex-column"
                ref={(el) => (columnRefs.current[colIndex] = el)}
                style={{ overflowY: "auto" }}
              >
                <div className="chapter-viewer flex-fill p-3">
                  {chapterData[pair.origVer || pair.transVer]?.length === 0 ? (
                    <p className="text-center text-muted">
                      {lang.no_data || "Дані для версії недоступні"}
                    </p>
                  ) : (
                    <>
                      <h4 className="text-center mb-3">
                        {currentRef} (
                        {pair.origVer
                          ? `${pair.origVer}/${pair.transVer || ""}`
                          : pair.transVer}
                        )
                      </h4>
                      {Array.from({ length: getVerseCount() }, (_, i) => {
                        const verseNum = i + 1;
                        const origVerse = chapterData[pair.origVer]?.find(
                          (v) => v.v === verseNum
                        );
                        const transVerse = chapterData[pair.transVer]?.find(
                          (v) => v.v === verseNum
                        );

                        return (
                          <InterlinearVerse
                            key={verseNum}
                            verseNum={verseNum}
                            origWords={origVerse?.words || []}
                            transWords={transVerse?.words || []}
                            onWordClick={handleWordClick}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* ПРАВИЙ БЛОК: ЛЕКСИКОНИ, тільки якщо є */}
      {lexicons.length > 0 && (
        <div className="lexicon-column d-flex ">
          {lexicons.map((lex) => (
            <LexiconWindow
              key={lex.id}
              data={lex.data}
              lang={lang}
              onClose={() => closeLexicon(lex.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassagePage;
