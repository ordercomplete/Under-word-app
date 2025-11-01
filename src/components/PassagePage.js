// import React, { useState } from "react";
// import PassageOptionsGroup from "./components/PassageOptionsGroup";
// import lang from "../data/lang.json";

// const PassagePage = () => {
//   const [ref, setRef] = useState("Gen.1");
//   const versions = ["THOT", "LXX", "UkrOgienko"];

//   const handlePrev = () => alert("Prev chapter");
//   const handleNext = () => alert("Next chapter");

//   return (
//     <div className="passage-page">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={ref}
//         versions={versions}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onResizeToggle={() => console.log("resize")}
//         onNewPanel={() => console.log("new panel")}
//         onCloseColumn={() => console.log("close column")}
//       />

//       {/* Тут буде текст розділу */}
//       <div className="passage-content mt-3 p-3">
//         <h2>{ref}</h2>
//         <p>…текст…</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useRef } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import ParallelScrolling from "../utils/ParallelScrolling";
// import lang from "../data/lang.json";
// import "../styles/PassagePage.css";

// const PassagePage = () => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions] = useState(["THOT", "LXX", "UkrOgienko"]);
//   const [displayMode, setDisplayMode] = useState("INTERLEAVED"); // або 'COLUMN'
//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   const leftPanelRef = useRef(null);
//   const rightPanelRef = useRef(null);

//   const handlePrevChapter = () => {
//     alert("Попередній розділ");
//   };

//   const handleNextChapter = () => {
//     alert("Наступний розділ");
//   };

//   const handleNewPanel = () => {
//     alert("Нова панель");
//   };

//   const handleCloseColumn = () => {
//     alert("Закрити колонку");
//   };

//   return (
//     <div className="passage-page">
//       {/* Панель керування */}
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         displayMode={displayMode}
//         setDisplayMode={setDisplayMode}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrevChapter}
//         onNextChapter={handleNextChapter}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleCloseColumn}
//       />

//       {/* Синхронізація прокрутки */}
//       <ParallelScrolling
//         isSynced={isScrollSynced}
//         panels={[leftPanelRef, rightPanelRef]}
//       />

//       {/* Контент */}
//       <div className="passage-content mt-3">
//         {displayMode === "INTERLEAVED" ? (
//           <div className="interleaved-view">
//             <div ref={leftPanelRef} className="panel original">
//               <h3>THOT / LXX</h3>
//               <p>Оригінальний текст...</p>
//             </div>
//             <div ref={rightPanelRef} className="panel translation">
//               <h3>UkrOgienko</h3>
//               <p>Переклад...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="column-view d-flex">
//             <div ref={leftPanelRef} className="panel original flex-fill">
//               <h3>THOT / LXX</h3>
//               <p>Оригінал...</p>
//             </div>
//             <div ref={rightPanelRef} className="panel translation flex-fill">
//               <h3>UkrOgienko</h3>
//               <p>Переклад...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// src/components/PassagePage.js
// import React from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import "../styles/ChapterViewer.css"; // якщо є

// const PassagePage = ({ lang }) => {
//   const currentRef = "Gen.1";
//   const versions = ["THOT", "LXX", "UkrOgienko"];
//   const [isScrollSynced, setIsScrollSynced] = React.useState(true);

//   const handlePrev = () => alert("Попередня глава");
//   const handleNext = () => alert("Наступна глава");
//   const handleNewPanel = () => alert("Нова панель");
//   const handleClose = () => alert("Закрити колонку");

//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleClose}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         <h4>Gen 1:1</h4>
//         <p>בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃</p>
//         <p>На початку Бог створив небо і землю.</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import "../styles/ChapterViewer.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef] = useState("Gen.1");

//   // Завантажуємо з localStorage або дефолт
//   const [versions, setVersions] = useState(() => {
//     const saved = localStorage.getItem("selectedVersions");
//     return saved ? JSON.parse(saved) : ["THOT", "UkrOgienko"];
//   });

//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   // Зберігаємо при зміні
//   useEffect(() => {
//     localStorage.setItem("selectedVersions", JSON.stringify(versions));
//   }, [versions]);

//   // Українські повідомлення через lang
//   const handlePrev = () => {
//     alert(lang.prev_chapter || "Попередня глава");
//   };

//   const handleNext = () => {
//     alert(lang.next_chapter || "Наступна глава");
//   };

//   const handleNewPanel = () => {
//     alert(lang.new_panel || "Нова панель");
//   };

//   const handleClose = () => {
//     alert(lang.close_column || "Закрити колонку");
//   };

//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         setVersions={setVersions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleClose}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         <h4>{currentRef}</h4>
//         <p>בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃</p>
//         <p>{lang.gen_1_1 || "На початку Бог створив небо і землю."}</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "./BookSelector";
// import "../styles/ChapterViewer.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions, setVersions] = useState(() => {
//     const saved = localStorage.getItem("selectedVersions");
//     return saved ? JSON.parse(saved) : ["THOT", "UkrOgienko"];
//   });
//   const [isScrollSynced, setIsScrollSynced] = useState(true);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Завантаження глави
//   useEffect(() => {
//     const [book, chapter] = currentRef.split(".");
//     setLoading(true);
//     fetch(`/data/${book.toLowerCase()}${chapter}.json`)
//       .then((res) => res.json())
//       .then((data) => {
//         setChapterData(data);
//         setLoading(false);
//       })
//       .catch(() => {
//         console.error("Failed to load chapter");
//         setLoading(false);
//       });
//   }, [currentRef]);

//   // Interleaved View
//   const interleavedVerses = () => {
//     const maxVerse = Math.max(
//       ...versions.map((v) => (chapterData[v] || []).length).filter(Boolean)
//     );
//     const result = [];
//     for (let v = 1; v <= maxVerse; v++) {
//       versions.forEach((ver) => {
//         const verse = (chapterData[ver] || []).find((x) => x.v === v);
//         if (verse)
//           result.push({
//             ver,
//             verse: v,
//             text: verse.text,
//             strongs: verse.strongs,
//           });
//       });
//     }
//     return result;
//   };

//   const handlePrev = () => {
//     const [book, ch] = currentRef.split(".");
//     const newCh = parseInt(ch) - 1;
//     if (newCh > 0) setCurrentRef(`${book}.${newCh}`);
//   };

//   const handleNext = () => {
//     const [book, ch] = parseInt(currentRef.split(".")[1]) + 1;
//     setCurrentRef(`${book}.${ch}`);
//   };

//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef} // ДОДАНО
//         versions={versions}
//         setVersions={setVersions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={() => alert(lang.new_panel)}
//         onCloseColumn={() => alert(lang.close_column)}
//         onOpenBookSelector={() => setShowBookModal(true)}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         {loading ? (
//           <p>{lang.loading || "Завантаження..."}</p>
//         ) : (
//           <>
//             <h4>{currentRef}</h4>
//             {interleavedVerses().map((item, i) => (
//               <div
//                 key={i}
//                 className="verse-line d-flex align-items-start gap-2 mb-2"
//               >
//                 <span className="verse-num text-muted">{item.verse}</span>
//                 <span className="version-badge badge bg-secondary">
//                   {item.ver}
//                 </span>
//                 <span className="verse-text">
//                   {item.strongs
//                     ? item.text.split(" ").map((word, j) => {
//                         const strong = item.strongs[j];
//                         return strong ? (
//                           <span key={j} className="strong-word" title={strong}>
//                             {word}{" "}
//                           </span>
//                         ) : (
//                           word + " "
//                         );
//                       })
//                     : item.text}
//                 </span>
//               </div>
//             ))}
//           </>
//         )}
//       </div>

//       <BookSelector
//         isOpen={showBookModal}
//         onRequestClose={() => setShowBookModal(false)}
//         lang={lang}
//         versions={versions}
//         onSelectRef={setCurrentRef}
//       />
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "./BookSelector";
// import LexiconWindow from "./LexiconWindow"; // ДОДАНО
// import "../styles/ChapterViewer.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions, setVersions] = useState(() => {
//     const saved = localStorage.getItem("selectedVersions");
//     return saved ? JSON.parse(saved) : ["THOT", "UkrOgienko"];
//   });
//   const [isScrollSynced, setIsScrollSynced] = useState(true);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [hoveredStrong, setHoveredStrong] = useState(null); // ДОДАНО

//   // === ЗАВАНТАЖЕННЯ ГЛАВИ ===
//   useEffect(() => {
//     const [book, chapter] = currentRef.split(".");
//     const fileBase = `${book.toLowerCase()}${chapter}`;

//     setLoading(true);
//     setChapterData({});

//     const promises = versions.map((ver) => {
//       let filename;
//       if (ver === "LXX") filename = `${fileBase}_lxx.json`;
//       else if (ver === "UTT") filename = `${fileBase}_utt.json`;
//       else if (ver === "THOT") filename = `${fileBase}_thot.json`;
//       else if (ver === "UBT") filename = `${fileBase}_ubt.json`;
//       else filename = `${fileBase}.json`;

//       return fetch(`/data/${filename}`)
//         .then((r) => {
//           if (!r.ok) throw new Error(`404: ${filename}`);
//           return r.json();
//         })
//         .then((data) => ({ ver, data }))
//         .catch((err) => {
//           console.warn(`Failed to load ${filename}`, err);
//           return { ver, data: [] };
//         });
//     });

//     Promise.all(promises).then((results) => {
//       const newData = {};
//       results.forEach(({ ver, data }) => {
//         newData[ver] = data;
//       });
//       setChapterData(newData);
//       setLoading(false);
//     });
//   }, [currentRef, versions]);

//   // === INTERLEAVED ВІРШІ ===
//   const interleavedVerses = () => {
//     const result = [];
//     const maxVerse = Math.max(
//       ...versions.flatMap((v) =>
//         (chapterData[v] || []).map((x) => x.v || x.verse || 0)
//       )
//     );

//     for (let v = 1; v <= maxVerse; v++) {
//       versions.forEach((ver) => {
//         const verseData = (chapterData[ver] || []).find(
//           (x) => (x.v || x.verse) === v
//         );
//         if (verseData) {
//           result.push({
//             ver,
//             verse: v,
//             text: verseData.text || verseData.greek || "",
//             strongs: verseData.strongs || verseData.strong || [],
//           });
//         }
//       });
//     }
//     return result;
//   };

//   // === НАВІГАЦІЯ ===
//   const handlePrev = () => {
//     const [book, ch] = currentRef.split(".");
//     const newCh = parseInt(ch) - 1;
//     if (newCh > 0) setCurrentRef(`${book}.${newCh}`);
//   };

//   const handleNext = () => {
//     const [book, ch] = currentRef.split(".");
//     const newCh = parseInt(ch) + 1;
//     setCurrentRef(`${book}.${newCh}`);
//   };

//   // === РЕНДЕР ===
//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef}
//         versions={versions}
//         setVersions={setVersions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={() => alert(lang.new_panel)}
//         onCloseColumn={() => alert(lang.close_column)}
//         onOpenBookSelector={() => setShowBookModal(true)}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         {loading ? (
//           <p className="text-center">{lang.loading || "Завантаження..."}</p>
//         ) : (
//           <>
//             <h4 className="text-center mb-3">{currentRef}</h4>
//             {interleavedVerses().map((item, i) => (
//               <div
//                 key={i}
//                 className="verse-line d-flex align-items-start gap-2 mb-2"
//               >
//                 <span className="verse-num text-muted fw-bold">
//                   {item.verse}
//                 </span>
//                 <span className="version-badge badge bg-secondary text-white">
//                   {item.ver}
//                 </span>
//                 <span className="verse-text">
//                   {item.strongs.length > 0
//                     ? item.text.split(" ").map((word, j) => {
//                         const strong = item.strongs[j];
//                         if (!strong) return <span key={j}>{word} </span>;
//                         return (
//                           <span
//                             key={j}
//                             className="strong-word"
//                             title={strong}
//                             onMouseEnter={() => setHoveredStrong(strong)}
//                             onMouseLeave={() => setHoveredStrong(null)}
//                             style={{
//                               cursor: "pointer",
//                               borderBottom: "1px dotted #007bff",
//                               color: strong.startsWith("G")
//                                 ? "#d35400"
//                                 : "#8e44ad",
//                             }}
//                           >
//                             {word}{" "}
//                           </span>
//                         );
//                       })
//                     : item.text}
//                 </span>
//               </div>
//             ))}
//           </>
//         )}
//       </div>

//       {/* Модалка вибору книги */}
//       <BookSelector
//         isOpen={showBookModal}
//         onRequestClose={() => setShowBookModal(false)}
//         lang={lang}
//         versions={versions}
//         onSelectRef={setCurrentRef}
//       />

//       {/* Словникове вікно */}
//       <LexiconWindow strong={hoveredStrong} lang={lang} />
//     </div>
//   );
// };

// export default PassagePage;

// src/components/PassagePage.js
// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "./BookSelector";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// import "../styles/Interlinear.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions, setVersions] = useState(["LXX", "UTT"]);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   // const [lexicon, setLexicon] = useState({ word: null, lang: null });
//   const [lexicon, setLexicon] = useState(null);
//   const [hovered, setHovered] = useState(null);

//   useEffect(() => {
//     const [book, ch] = currentRef.split(".");
//     const file = `${book.toLowerCase()}${ch}`;

//     setLoading(true);
//     const promises = versions.map((v) =>
//       fetch(`/data/${file}_${v.toLowerCase()}.json`)
//         .then((r) => r.json())
//         .then((data) => ({ v, data: data[0] }))
//         .catch(() => ({ v, data: null }))
//     );

//     Promise.all(promises).then((results) => {
//       const data = {};
//       results.forEach((r) => {
//         if (r.data) data[r.v] = r.data;
//       });
//       setChapterData(data);
//       setLoading(false);
//     });
//   }, [currentRef, versions]);

//   const handleWordClick = (data) => {
//     setLexicon(data);
//   };

//   const handleWordHover = (data) => {
//     setHovered(data);
//   };

//   // Скидаємо при зміні глави
//   useEffect(() => {
//     setLexicon(null);
//     setHovered(null);
//   }, [currentRef]);

//   return (
//     <div className="passage-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         setCurrentRef={setCurrentRef}
//         versions={versions}
//         setVersions={setVersions}
//         onOpenBookSelector={() => {}}
//         onPrevChapter={() => {}}
//         onNextChapter={() => {}}
//       />

//       <div className="chapter-viewer">
//         {loading ? (
//           <p>{lang.loading}</p>
//         ) : (
//           <>
//             <h4>{currentRef}</h4>
//             {(chapterData.LXX?.words || []).map((_, i) => (
//               <InterlinearVerse
//                 key={i}
//                 verseNum={i + 1}
//                 lxxWords={chapterData.LXX?.words || []}
//                 uttWords={chapterData.UTT?.words || []}
//                 onWordClick={handleWordClick}
//                 onWordHover={handleWordHover}
//               />
//             ))}
//           </>
//         )}
//       </div>

//       <LexiconWindow data={lexicon} lang={lang} />
//     </div>
//   );
// };

// export default PassagePage;

// src/components/PassagePage.js
// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "../modals/BookSelector";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// // import "../styles/Interlinear.css";
// import "../styles/LexiconWindow.css"; // ДОДАНО

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions, setVersions] = useState(["LXX", "UTT"]);
//   const [chapterData, setChapterData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [lexicon, setLexicon] = useState(null);
//   // const [hovered, setHovered] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);

//   // --------------------------------------------------
//   useEffect(() => {
//     const [book, chapter] = currentRef.split(".");
//     const fileBase = `${book.toLowerCase()}${chapter}`;

//     setLoading(true);
//     setChapterData({});

//     const promises = versions.map((ver) => {
//       let filename;
//       if (ver === "LXX") filename = `${fileBase}_lxx.json`;
//       else if (ver === "UTT") filename = `${fileBase}_utt.json`;
//       else filename = `${fileBase}.json`;

//       return fetch(`/data/${filename}`)
//         .then((r) => r.json())
//         .then((data) => ({ ver, data: data[0] || [] }))
//         .catch(() => ({ ver, data: [] }));
//     });

//     Promise.all(promises).then((results) => {
//       const newData = {};
//       results.forEach(({ ver, data }) => {
//         newData[ver] = data;
//       });
//       setChapterData(newData);
//       setLoading(false);
//     });
//   }, [currentRef, versions]);

//   // Приклад: де завантажуються дані
//   const [selectedVersions, setSelectedVersions] = useState([]);
//   useEffect(() => {
//     const loadVersions = async () => {
//       const results = {};
//       for (const version of selectedVersions) {
//         const isOriginal = ["LXX", "THOT"].includes(version);
//         const base = isOriginal ? "originals" : "translations";
//         const lower = version.toLowerCase();

//         // ← ВИПРАВЛЕНО: НОВИЙ ШЛЯХ
//         const url = `/data/${base}/${lower}/OldT/GEN/gen1_${lower}.json`;

//         try {
//           const res = await fetch(url);
//           const data = await res.json();
//           const verse = data.find((v) => v.v === chapter)?.words || [];
//           results[version] = verse;
//         } catch (err) {
//           console.error(`Failed to load ${version}:`, err);
//         }
//       }
//       setLoadedData(results);
//     };

//     if (selectedVersions.length > 0 && chapter) {
//       loadVersions();
//     }
//   }, [selectedVersions, chapter]);

//   // У PassagePage.js — завантажуємо core.json один раз
//   const [coreData, setCoreData] = useState({});

//   useEffect(() => {
//     fetch("/data/core.json") // ← ЄДИНИЙ ЗАПИТ
//       .then((r) => r.json())
//       .then(setCoreData)
//       .catch(console.error);
//   }, []);

//   const handleWordClick = (data) => {
//     setLexicon(data);
//   };

//   useEffect(() => {
//     setLexicon(null);
//   }, [currentRef]);

//   return (
//     <div className="passage-container d-flex">
//       {/* Основна колонка */}
//       <div className="passage-column flex-fill d-flex flex-column">
//         <PassageOptionsGroup
//           lang={lang}
//           currentRef={currentRef}
//           setCurrentRef={setCurrentRef}
//           versions={versions}
//           setVersions={setVersions}
//           onOpenBookSelector={() => setShowBookModal(true)}
//           // onPrevChapter={() => {}}
//           // onNextChapter={() => {}}
//           onPrevChapter={() => {
//             const [b, c] = currentRef.split(".");
//             const nc = Math.max(1, parseInt(c) - 1);
//             setCurrentRef(`${b}.${nc}`);
//           }}
//           onNextChapter={() => {
//             const [b, c] = currentRef.split(".");
//             setCurrentRef(`${b}.${parseInt(c) + 1}`);
//           }}
//         />

//         <div className="chapter-viewer flex-fill overflow-auto p-3">
//           {loading ? (
//             <p className="text-center">{lang.loading}</p>
//           ) : (
//             <>
//               <h4 className="text-center mb-3">{currentRef}</h4>
//               {(chapterData.LXX?.words || []).map((_, i) => (
//                 <InterlinearVerse
//                   key={i}
//                   verseNum={i + 1}
//                   lxxWords={chapterData.LXX?.words || []}
//                   uttWords={chapterData.UTT?.words || []}
//                   onWordClick={handleWordClick}
//                   // onWordHover={handleWordHover}
//                 />
//               ))}
//             </>
//           )}
//         </div>
//       </div>

//       {/* БОКОВА КОЛОНКА ЛЕКСИКОНУ */}
//       {/* <div className="lexicon-column">
//         <div className="lexicon-window">
//           <h5 className="lexicon-title">
//             {lexicon
//               ? lexicon.word.strong || lexicon.word.word
//               : lang.lexicon || "Лексикон"}
//           </h5>
//           <div className="lexicon-panel">
//             <LexiconWindow data={lexicon} lang={lang} />
//           </div>
//         </div>
//       </div> */}

//       {/* ДВА ВІКНА ЛЕКСИКОНУ */}
//       <div className="lexicon-column">
//         {/* ВЕРХНЄ — ОРИГІНАЛ (грецький/іврит) */}
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

//         {/* НИЖНЄ — ПЕРЕКЛАД (український) */}
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

//         {/* ПУСТЕ СТАН — "Оберіть..." */}
//         {!lexicon && (
//           <div className="lexicon-window">
//             <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
//             <div className="lexicon-panel text-center text-muted">
//               {lang.select_word || "Оберіть слово для перегляду"}
//             </div>
//           </div>
//         )}
//       </div>

//       <BookSelector
//         coreData={coreData}
//         isOpen={showBookModal}
//         onRequestClose={() => setShowBookModal(false)}
//         lang={lang}
//         versions={versions}
//         onSelectBook={(code) => {
//           setCurrentRef(`${code}.1`);
//           setShowBookModal(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import BookSelector from "../modals/BookSelector";
// import InterlinearVerse from "./InterlinearVerse";
// import LexiconWindow from "./LexiconWindow";
// import "../styles/LexiconWindow.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef, setCurrentRef] = useState("GEN.1"); // ← ВИПРАВЛЕНО: GEN, не Gen
//   const [versions, setVersions] = useState(["LXX", "UTT"]); // ← ЄДИНИЙ СТАН
//   const [chapterData, setChapterData] = useState({}); // { LXX: [{v:1, words:...}, ...], UTT: [...] }
//   // const [loading, setLoading] = useState(false);
//   const [loading, setLoading] = useState(true); // ← Завжди true спочатку
//   const [lexicon, setLexicon] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   // const memoizedVersions = useMemo(() => versions, [versions]);

//   // === CORE.JSON ===
//   const [coreData, setCoreData] = useState({});
//   const [coreLoading, setCoreLoading] = useState(true); // ← ДОДАНО

//   // === ВІДКРИТТЯ МОДАЛКИ ТІЛЬКИ ПІСЛЯ ЗАВАНТАЖЕННЯ ===
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

//   // === ЗАВАНТАЖЕННЯ ТИПОВОГО УРИВКА ПРИ СТАРТІ ===
//   useEffect(() => {
//     const loadInitialChapter = async () => {
//       const [book, chapterStr] = currentRef.split(".");
//       const chapter = parseInt(chapterStr);
//       if (!book || !chapter) return;

//       setLoading(true);

//       const loadVersion = async (ver) => {
//         const lower = ver.toLowerCase();
//         const isOriginal = ["lxx", "thot"].includes(lower);
//         const base = isOriginal ? "originals" : "translations";
//         const url = `/data/${base}/${lower}/OldT/${book}/gen${chapter}_${lower}.json`;

//         try {
//           const res = await fetch(url);
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           return { ver, data };
//         } catch (err) {
//           console.error(`Failed to load ${ver} ${book}:${chapter}`, err);
//           return { ver, data: [] };
//         }
//       };

//       Promise.all(versions.map(loadChapter))
//         .then((results) => {
//           const newData = {};
//           results.forEach(({ ver, data }) => {
//             newData[ver] = data;
//           });
//           setChapterData(newData);
//         })
//         .finally(() => setLoading(false));
//     };

//     loadInitialChapter(); // ← ЗАВАНТАЖУЄ ТИПОВИЙ УРИВК ПРИ СТАРТІ
//   }, []); // ← ПУСТИЙ МАСИВ — ТІЛЬКИ ПРИ СТАРТІ

//   // === ЗАВАНТАЖЕННЯ ПРИ ЗМІНІ ===
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

//   // === ОТРИМАННЯ КІЛЬКОСТІ ВІРШІВ ===
//   const getVerseCount = () => {
//     if (!chapterData.LXX) return 0;
//     return chapterData.LXX.length;
//   };

//   useEffect(() => {
//     console.log("coreData loaded:", coreData);
//   }, [coreData]);

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
//           // onOpenBookSelector={() => setShowBookModal(true)}
//           onOpenBookSelector={openBookModal} // ← ПРАВИЛЬНО
//           onPrevChapter={() => {
//             const [b, c] = currentRef.split(".");
//             const nc = Math.max(1, parseInt(c) - 1);
//             setCurrentRef(`${b}.${nc}`);
//           }}
//           onNextChapter={() => {
//             const [b, c] = currentRef.split(".");
//             const nc = parseInt(c) + 1;
//             // Перевірка: чи є такий розділ?
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

//       {/* BOOK SELECTOR */}
//       <BookSelector
//         coreData={coreData}
//         coreLoading={coreLoading} // ← ДОДАНО
//         isOpen={showBookModal}
//         onRequestClose={() => setShowBookModal(false)}
//         lang={lang}
//         versions={versions}
//         onSelectBook={(code) => {
//           setCurrentRef(`${code}.1`);
//           setShowBookModal(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PassagePage;
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";
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
  const [lexicon, setLexicon] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);

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
      const url = `/data/${base}/${lower}/OldT/${book}/gen${chapter}_${lower}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { ver, data };
      } catch (err) {
        console.error(`Failed to load ${ver} ${book}:${chapter}`, err);
        return { ver, data: [] };
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
    setLexicon(data);
  };

  useEffect(() => {
    setLexicon(null);
  }, [currentRef]);

  // === КІЛЬКІСТЬ ВІРШІВ ===
  const getVerseCount = () => {
    if (!chapterData.LXX) return 0;
    return chapterData.LXX.length;
  };

  return (
    <div className="passage-container d-flex">
      {/* ОСНОВНА КОЛОНКА */}
      <div className="passage-column flex-fill d-flex flex-column">
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
        />

        <div className="chapter-viewer flex-fill overflow-auto p-3">
          {loading ? (
            <p className="text-center">{lang.loading || "Завантаження..."}</p>
          ) : (
            <>
              <h4 className="text-center mb-3">{currentRef}</h4>
              {Array.from({ length: getVerseCount() }, (_, i) => {
                const verseNum = i + 1;
                const lxxVerse = chapterData.LXX?.find((v) => v.v === verseNum);
                const uttVerse = chapterData.UTT?.find((v) => v.v === verseNum);

                if (!lxxVerse && !uttVerse) return null;

                return (
                  <InterlinearVerse
                    key={verseNum}
                    verseNum={verseNum}
                    lxxWords={lxxVerse?.words || []}
                    uttWords={uttVerse?.words || []}
                    onWordClick={handleWordClick}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ЛЕКСИКОН */}
      <div className="lexicon-column">
        {lexicon?.lang === "gr" && (
          <div className="lexicon-window">
            <h5 className="lexicon-title">
              {lexicon.word.strong} — {lang.original || "Оригінал"}
            </h5>
            <div className="lexicon-panel">
              <LexiconWindow data={lexicon} lang={lang} />
            </div>
          </div>
        )}

        {lexicon?.lang === "uk" && (
          <div className="lexicon-window">
            <h5 className="lexicon-title">
              {lexicon.word.strong} — {lang.translation || "Переклад"}
            </h5>
            <div className="lexicon-panel">
              <LexiconWindow data={lexicon} lang={lang} />
            </div>
          </div>
        )}

        {!lexicon && (
          <div className="lexicon-window">
            <h5 className="lexicon-title">{lang.lexicon || "Лексикон"}</h5>
            <div className="lexicon-panel text-center text-muted">
              {lang.select_word || "Оберіть слово для перегляду"}
            </div>
          </div>
        )}
      </div>

      {/* МОДАЛКИ */}
      <BookSelector
        coreData={coreData}
        coreLoading={coreLoading}
        isOpen={showBookModal}
        onRequestClose={() => setShowBookModal(false)}
        lang={lang}
        versions={versions}
        onSelectBook={(code) => {
          setCurrentRef(`${code}.1`);
          setShowBookModal(false);
        }}
      />

      {/* <TranslationSelector
        isOpen={showTranslationModal}
        onRequestClose={() => setShowTranslationModal(false)}
        lang={lang}
        onSelectVersions={setVersions}
      /> */}
    </div>
  );
};

export default PassagePage;

// ------------------------------------------------------------------------
