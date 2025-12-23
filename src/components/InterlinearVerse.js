// -----------------------------------------------
// InterlinearVerse.js
// import React, { useState, useRef, useEffect } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({
//   verseNum,
//   origWords, // Слова оригіналу (якщо [], показуємо тільки trans з тире в trans)
//   transWords, // Слова перекладу (якщо [], показуємо тільки orig з тире в orig)
//   onWordClick,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Запобіжник: якщо обидва порожні
//   if (origWords.length === 0 && transWords.length === 0) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   // === ВИРІВНЮВАННЯ ПО STRONG'S ===
//   const alignedWords = [];
//   const strongMap = new Map();

//   origWords.forEach((w) => {
//     if (w?.strong)
//       // Запобіжник на undefined
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
//   });
//   transWords.forEach((w) => {
//     if (w?.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), trans: w });
//   });

//   strongMap.forEach((pair, strong) => {
//     alignedWords.push({
//       strong,
//       orig: pair.orig || { word: "—", strong: null },
//       trans: pair.trans || { word: "—", strong: null },
//     });
//   });

//   // Сортування за порядком в оригіналі або перекладі (якщо orig порожній)
//   alignedWords.sort((a, b) => {
//     let idxA = origWords.findIndex((w) => w?.strong === a.strong);
//     let idxB = origWords.findIndex((w) => w?.strong === b.strong);
//     if (idxA === -1) idxA = transWords.findIndex((w) => w?.strong === a.strong);
//     if (idxB === -1) idxB = transWords.findIndex((w) => w?.strong === b.strong);
//     return idxA - idxB;
//   });

//   const handleMouseMove = (e) => {
//     if (!verseRef.current) return;
//     const rect = verseRef.current.getBoundingClientRect();
//     setMousePos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="words-grid">
//         {alignedWords.map((pair, i) => {
//           const hasStrong = pair.orig?.strong || pair.trans?.strong;
//           // Розрахунок translation тут, але не потрібно — для tooltip

//           return (
//             <div
//               key={pair.strong || `empty-${i}`}
//               className="word-pair"
//               onMouseEnter={() =>
//                 hasStrong && setHoveredWord({ pair, index: i })
//               }
//               onMouseLeave={() => setHoveredWord(null)}
//             >
//               <span
//                 className="orig-word"
//                 style={{ cursor: pair.orig?.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.orig?.strong &&
//                   onWordClick({
//                     word: pair.orig,
//                     lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
//                     translation: pair.trans?.word || pair.orig.word,
//                   })
//                 }
//               >
//                 {pair.orig.word}
//               </span>

//               <span
//                 className="trans-word"
//                 style={{ cursor: pair.trans?.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.trans?.strong &&
//                   onWordClick({
//                     word: pair.trans,
//                     lang: "uk",
//                     translation: pair.trans.word || pair.orig?.word,
//                   })
//                 }
//               >
//                 {pair.trans.word}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* === МОДАЛКА === */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             position: "absolute",
//             left: `${mousePos.x + 50}px`,
//             top: `${mousePos.y + 200}px`,
//             pointerEvents: "none",
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.pair.orig?.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
//                 {hoveredWord.pair.orig.word}
//                 {hoveredWord.pair.orig.lemma &&
//                   ` (${hoveredWord.pair.orig.lemma})`}
//               </div>
//             )}
//             {hoveredWord.pair.trans?.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
//                 {hoveredWord.pair.trans.word}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {hoveredWord.pair.trans.word !== "—"
//                 ? hoveredWord.pair.trans.word
//                 : hoveredWord.pair.orig.word || "—"}{" "}
//               {/* Фікс: розрахунок тут + запобіжник */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

//-----------------------------------------

// InterlinearVerse.js
// import React, { useState, useRef, useEffect } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter } from "../utils/jsonAdapter";
// const InterlinearVerse = ({
//   verseNum,
//   pairs, // Масив пар для вертикального рендеру
//   chapterData,
//   onWordClick,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Запобіжник: якщо pairs або chapterData undefined або порожні
//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const handleMouseMove = (e) => {
//     setMousePos({
//       x: e.pageX,
//       y: e.pageY,
//     });
//   };

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="pairs-vertical">
//         {pairs.map((pair, pIndex) => {
//           // console.log("Pair in InterlinearVerse:", pair); // ← Перевірте, чи є pair.origVer
//           const origVerse = chapterData[pair.origVer]?.find(
//             (v) => v?.v === verseNum
//           );
//           const transVerse = chapterData[pair.transVer]?.find(
//             (v) => v?.v === verseNum
//           );

//           const origWords = origVerse?.words || [];
//           const transWords = transVerse?.words || [];

//           if (origWords.length === 0 && transWords.length === 0) {
//             return (
//               <div key={pIndex} className="pair-section">
//                 <h5>
//                   {pair.origVer
//                     ? `${pair.origVer}/${pair.transVer || ""}`
//                     : pair.transVer}
//                 </h5>
//                 <div className="text-muted">
//                   Дані відсутні interlinear-verse
//                 </div>
//               </div>
//             );
//           }

//           const alignedWords = [];
//           const strongMap = new Map();

//           origWords.forEach((w) => {
//             if (w?.strong)
//               strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
//           });
//           transWords.forEach((w) => {
//             if (w?.strong)
//               strongMap.set(w.strong, { ...strongMap.get(w.strong), trans: w });
//           });

//           strongMap.forEach((pair, strong) => {
//             alignedWords.push({
//               strong,
//               orig: pair.orig || { word: "—", strong: null },
//               trans: pair.trans || { word: "—", strong: null },
//             });
//           });

//           alignedWords.sort((a, b) => {
//             let idxA = origWords.findIndex((w) => w?.strong === a.strong);
//             let idxB = origWords.findIndex((w) => w?.strong === b.strong);
//             if (idxA === -1)
//               idxA = transWords.findIndex((w) => w?.strong === a.strong);
//             if (idxB === -1)
//               idxB = transWords.findIndex((w) => w?.strong === b.strong);
//             return idxA - idxB;
//           });

//           return (
//             <div key={pIndex} className="pair-section">
//               <h5 className="pair-title">
//                 {pair.origVer
//                   ? `${pair.origVer}/${pair.transVer || ""}`
//                   : pair.transVer}
//               </h5>
//               <div className="words-grid">
//                 {alignedWords.map((wordPair, i) => {
//                   // const hasStrong = pair.orig?.strong || pair.trans?.strong;
//                   const hasStrong =
//                     wordPair.orig?.strong || wordPair.trans?.strong;

//                   return (
//                     <div
//                       key={i}
//                       className="word-pair"
//                       onMouseEnter={() =>
//                         hasStrong && setHoveredWord({ wordPair, index: i })
//                       }
//                       onMouseLeave={() => setHoveredWord(null)}
//                     >
//                       {/* ОРИГІНАЛ */}
//                       <span
//                         className="orig-word"
//                         style={{
//                           cursor: wordPair.orig?.strong ? "pointer" : "default",
//                         }}
//                         onClick={() =>
//                           wordPair.orig?.strong &&
//                           onWordClick({
//                             // word: pair.orig,
//                             word: wordPair.orig,
//                             origVer: pair.origVer, // ДОДАНО 13.11.25 в 15:59
//                             // lang: pair.orig.strong.startsWith("H")
//                             //   ? "he"
//                             //   : "gr",
//                             lang: wordPair.orig.strong.startsWith("H")
//                               ? "he"
//                               : "gr",
//                             // translation: pair.trans?.word || pair.orig.word,
//                             translation:
//                               wordPair.trans?.word || wordPair.orig.word,
//                           })
//                         }
//                       >
//                         {/* {pair.orig.word} */}
//                         {wordPair.orig.word}
//                       </span>
//                       {/* ПЕРЕКЛАД */}
//                       <span
//                         className="trans-word"
//                         style={{
//                           cursor: wordPair.trans?.strong
//                             ? "pointer"
//                             : "default",
//                         }}
//                         onClick={() =>
//                           wordPair.trans?.strong &&
//                           onWordClick({
//                             // word: pair.trans,
//                             word: wordPair.trans,
//                             origVer: pair.origVer, // ДОДАНО: UTT → LXX, UBT → THOT 13.11.25 в 15:59
//                             lang: "uk",
//                             // translation: pair.trans.word || pair.orig?.word,
//                             // translation: pair.trans.word,
//                             translation: wordPair.trans.word,
//                           })
//                         }
//                       >
//                         {/* {pair.trans.word} */}
//                         {wordPair.trans.word}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {hoveredWord && hoveredWord.wordPair && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             position: "fixed",
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.wordPair.orig?.strong && (
//               <div>
//                 <strong>{hoveredWord.wordPair.orig.strong}</strong>:{" "}
//                 {hoveredWord.wordPair.orig.word}
//                 {hoveredWord.wordPair.orig.lemma &&
//                   ` (${hoveredWord.wordPair.orig.lemma})`}
//               </div>
//             )}
//             {hoveredWord.wordPair.trans?.strong && (
//               <div>
//                 <strong>{hoveredWord.wordPair.trans.strong}</strong>:{" "}
//                 {hoveredWord.wordPair.trans.word}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {hoveredWord.wordPair.trans?.word !== "—"
//                 ? hoveredWord.wordPair.trans?.word
//                 : hoveredWord.wordPair.orig?.word || "—"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// ---------------------------------------------------------------------------

// // src/components/InterlinearVerse.js
// import React, { useState, useRef, useEffect, useMemo } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter } from "../utils/jsonAdapter";

// const InterlinearVerse = ({
//   verseNum,
//   pairs, // Масив пар для вертикального рендеру
//   chapterData,
//   onWordClick,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Адаптуємо chapterData до повного формату для внутрішньої роботи
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       if (Array.isArray(data)) {
//         // Адаптуємо кожен вірш в масиві
//         result[key] = data.map((item) => jsonAdapter(item));
//       } else {
//         result[key] = jsonAdapter(data);
//       }
//     });
//     return result;
//   }, [chapterData]);

//   // Запобіжник: якщо pairs або chapterData undefined або порожні
//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const handleMouseMove = (e) => {
//     setMousePos({
//       x: e.pageX,
//       y: e.pageY,
//     });
//   };

//   // Функція для безпечного отримання слова з обох форматів
//   const getWordText = (word) => {
//     if (!word) return "—";
//     return word.word || word.w || "—";
//   };

//   const getStrongCode = (word) => {
//     if (!word) return null;
//     return word.strong || word.s || null;
//   };

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>
//       <div className="pairs-vertical">
//         {pairs.map((pair, pIndex) => {
//           const origVerse = adaptedData[pair.origVer]?.find(
//             (v) => v?.verse === verseNum || v?.v === verseNum
//           );
//           const transVerse = adaptedData[pair.transVer]?.find(
//             (v) => v?.verse === verseNum || v?.v === verseNum
//           );

//           // Отримуємо слова з адаптованих даних
//           const origWords = origVerse?.words || origVerse?.ws || [];
//           const transWords = transVerse?.words || transVerse?.ws || [];

//           if (origWords.length === 0 && transWords.length === 0) {
//             return (
//               <div key={pIndex} className="pair-section">
//                 <h5>
//                   {pair.origVer
//                     ? `${pair.origVer}/${pair.transVer || ""}`
//                     : pair.transVer}
//                 </h5>
//                 <div className="text-muted">
//                   Дані відсутні interlinear-verse
//                 </div>
//               </div>
//             );
//           }

//           // Створюємо масив слів для вирівнювання
//           const alignedWords = [];
//           const strongMap = new Map();

//           // Заповнюємо мапу для вирівнювання за strong кодами
//           origWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (strong) {
//               strongMap.set(strong, {
//                 ...strongMap.get(strong),
//                 orig: w,
//                 origIndex: index,
//               });
//             }
//           });

//           transWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (strong) {
//               strongMap.set(strong, {
//                 ...strongMap.get(strong),
//                 trans: w,
//                 transIndex: index,
//               });
//             }
//           });

//           // Додаємо слова без strong кодів за індексом
//           origWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (!strong) {
//               alignedWords.push({
//                 id: `orig-${index}`,
//                 orig: w,
//                 trans: { word: "—" },
//                 index,
//               });
//             }
//           });

//           transWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (!strong) {
//               const existing = alignedWords.find(
//                 (a) => a.id === `trans-${index}`
//               );
//               if (!existing) {
//                 alignedWords.push({
//                   id: `trans-${index}`,
//                   orig: { word: "—" },
//                   trans: w,
//                   index,
//                 });
//               }
//             }
//           });

//           // Додаємо слова з strong кодами
//           strongMap.forEach((pair, strong) => {
//             alignedWords.push({
//               id: `strong-${strong}`,
//               strong,
//               orig: pair.orig || { word: "—" },
//               trans: pair.trans || { word: "—" },
//               index:
//                 pair.origIndex !== undefined ? pair.origIndex : pair.transIndex,
//             });
//           });

//           // Сортуємо за індексом для збереження порядку
//           alignedWords.sort((a, b) => {
//             const idxA = a.index !== undefined ? a.index : 999;
//             const idxB = b.index !== undefined ? b.index : 999;
//             return idxA - idxB;
//           });

//           return (
//             <div key={pIndex} className="pair-section">
//               <h5 className="pair-title">
//                 {pair.origVer
//                   ? `${pair.origVer}/${pair.transVer || ""}`
//                   : pair.transVer}
//               </h5>
//               <div className="words-grid">
//                 {alignedWords.map((wordPair, i) => {
//                   const hasStrong =
//                     getStrongCode(wordPair.orig) ||
//                     getStrongCode(wordPair.trans);

//                   return (
//                     <div
//                       key={i}
//                       className="word-pair"
//                       onMouseEnter={() =>
//                         hasStrong && setHoveredWord({ wordPair, index: i })
//                       }
//                       onMouseLeave={() => setHoveredWord(null)}
//                     >
//                       {/* ОРИГІНАЛ */}
//                       <span
//                         className="orig-word"
//                         style={{
//                           cursor: getStrongCode(wordPair.orig)
//                             ? "pointer"
//                             : "default",
//                         }}
//                         onClick={() => {
//                           const strong = getStrongCode(wordPair.orig);
//                           if (strong) {
//                             onWordClick({
//                               word: {
//                                 word: getWordText(wordPair.orig),
//                                 strong: strong,
//                                 lemma: wordPair.orig.lemma || wordPair.orig.l,
//                               },
//                               origVer: pair.origVer,
//                               lang: strong.startsWith("H") ? "he" : "gr",
//                               translation: getWordText(wordPair.trans),
//                             });
//                           }
//                         }}
//                       >
//                         {getWordText(wordPair.orig)}
//                       </span>

//                       {/* ПЕРЕКЛАД */}
//                       <span
//                         className="trans-word"
//                         style={{
//                           cursor: getStrongCode(wordPair.trans)
//                             ? "pointer"
//                             : "default",
//                         }}
//                         onClick={() => {
//                           const strong = getStrongCode(wordPair.trans);
//                           if (strong) {
//                             onWordClick({
//                               word: {
//                                 word: getWordText(wordPair.trans),
//                                 strong: strong,
//                                 lemma: wordPair.trans.lemma || wordPair.trans.l,
//                               },
//                               origVer: pair.origVer, // UTT → LXX, UBT → THOT
//                               lang: "uk",
//                               translation: getWordText(wordPair.trans),
//                             });
//                           }
//                         }}
//                       >
//                         {getWordText(wordPair.trans)}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {hoveredWord && hoveredWord.wordPair && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             position: "fixed",
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {getStrongCode(hoveredWord.wordPair.orig) && (
//               <div>
//                 <strong>{getStrongCode(hoveredWord.wordPair.orig)}</strong>:{" "}
//                 {getWordText(hoveredWord.wordPair.orig)}
//                 {(hoveredWord.wordPair.orig.lemma ||
//                   hoveredWord.wordPair.orig.l) &&
//                   ` (${
//                     hoveredWord.wordPair.orig.lemma ||
//                     hoveredWord.wordPair.orig.l
//                   })`}
//               </div>
//             )}
//             {getStrongCode(hoveredWord.wordPair.trans) && (
//               <div>
//                 <strong>{getStrongCode(hoveredWord.wordPair.trans)}</strong>:{" "}
//                 {getWordText(hoveredWord.wordPair.trans)}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {getWordText(hoveredWord.wordPair.trans) !== "—"
//                 ? getWordText(hoveredWord.wordPair.trans)
//                 : getWordText(hoveredWord.wordPair.orig) || "—"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// -----------------------------------------------------------

// // src/components/InterlinearVerse.js 23.12.25
// import React, { useState, useRef, useEffect, useMemo } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({
//   verseNum,
//   pairs, // Масив пар для вертикального рендеру
//   chapterData,
//   onWordClick,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Адаптуємо chapterData до уніфікованого формату
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];

//       // Адаптуємо дані
//       const adapted = jsonAdapter(data);

//       // Переконуємося, що це масив
//       if (Array.isArray(adapted)) {
//         result[key] = adapted;
//       } else if (adapted && typeof adapted === "object") {
//         // Якщо це об'єкт, спробуємо перетворити на масив
//         const values = Object.values(adapted);
//         result[key] = values.filter((item) => item && typeof item === "object");
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   // Запобіжник: якщо pairs або chapterData undefined або порожні
//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const handleMouseMove = (e) => {
//     setMousePos({
//       x: e.pageX,
//       y: e.pageY,
//     });
//   };

//   // Функції для безпечного отримання значень
//   const getWordText = (word) => {
//     if (!word) return "—";
//     return getValue(word, "word") || getValue(word, "w") || "—";
//   };

//   const getStrongCode = (word) => {
//     if (!word) return null;
//     return getValue(word, "strong") || getValue(word, "s") || null;
//   };

//   const getLemma = (word) => {
//     if (!word) return null;
//     return getValue(word, "lemma") || getValue(word, "l") || null;
//   };

//   const getMorph = (word) => {
//     if (!word) return null;
//     return getValue(word, "morph") || getValue(word, "m") || null;
//   };

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>
//       <div className="pairs-vertical">
//         {pairs.map((pair, pIndex) => {
//           const origVerse = adaptedData[pair.origVer]?.find(
//             (v) =>
//               getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
//           );
//           const transVerse = adaptedData[pair.transVer]?.find(
//             (v) =>
//               getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
//           );

//           // Отримуємо слова з адаптованих даних
//           const origWords =
//             getValue(origVerse, "words") || getValue(origVerse, "ws") || [];
//           const transWords =
//             getValue(transVerse, "words") || getValue(transVerse, "ws") || [];

//           if (origWords.length === 0 && transWords.length === 0) {
//             return (
//               <div key={pIndex} className="pair-section">
//                 <h5>
//                   {pair.origVer
//                     ? `${pair.origVer}/${pair.transVer || ""}`
//                     : pair.transVer}
//                 </h5>
//                 <div className="text-muted">Дані відсутні</div>
//               </div>
//             );
//           }

//           // Створюємо масив слів для вирівнювання
//           const alignedWords = [];
//           const strongMap = new Map();

//           // Заповнюємо мапу для вирівнювання за strong кодами
//           origWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (strong) {
//               strongMap.set(strong, {
//                 ...strongMap.get(strong),
//                 orig: w,
//                 origIndex: index,
//               });
//             }
//           });

//           transWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (strong) {
//               strongMap.set(strong, {
//                 ...strongMap.get(strong),
//                 trans: w,
//                 transIndex: index,
//               });
//             }
//           });

//           // Додаємо слова без strong кодів за індексом
//           origWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (!strong) {
//               alignedWords.push({
//                 id: `orig-${index}`,
//                 orig: w,
//                 trans: { w: "—" },
//                 index,
//               });
//             }
//           });

//           transWords.forEach((w, index) => {
//             const strong = getStrongCode(w);
//             if (!strong) {
//               const existing = alignedWords.find(
//                 (a) => a.id === `trans-${index}`
//               );
//               if (!existing) {
//                 alignedWords.push({
//                   id: `trans-${index}`,
//                   orig: { w: "—" },
//                   trans: w,
//                   index,
//                 });
//               }
//             }
//           });

//           // Додаємо слова з strong кодами
//           strongMap.forEach((pair, strong) => {
//             alignedWords.push({
//               id: `strong-${strong}`,
//               strong,
//               orig: pair.orig || { w: "—" },
//               trans: pair.trans || { w: "—" },
//               index:
//                 pair.origIndex !== undefined ? pair.origIndex : pair.transIndex,
//             });
//           });

//           // Сортуємо за індексом для збереження порядку
//           alignedWords.sort((a, b) => {
//             const idxA = a.index !== undefined ? a.index : 999;
//             const idxB = b.index !== undefined ? b.index : 999;
//             return idxA - idxB;
//           });

//           return (
//             <div key={pIndex} className="pair-section">
//               <h5 className="pair-title">
//                 {pair.origVer
//                   ? `${pair.origVer}/${pair.transVer || ""}`
//                   : pair.transVer}
//               </h5>
//               <div className="words-grid">
//                 {alignedWords.map((wordPair, i) => {
//                   const hasStrong =
//                     getStrongCode(wordPair.orig) ||
//                     getStrongCode(wordPair.trans);

//                   const origStrong = getStrongCode(wordPair.orig);
//                   const transStrong = getStrongCode(wordPair.trans);
//                   const origLemma = getLemma(wordPair.orig);
//                   const origMorph = getMorph(wordPair.orig);

//                   return (
//                     <div
//                       key={i}
//                       className="word-pair"
//                       onMouseEnter={() =>
//                         hasStrong && setHoveredWord({ wordPair, index: i })
//                       }
//                       onMouseLeave={() => setHoveredWord(null)}
//                     >
//                       {/* ОРИГІНАЛ */}
//                       <span
//                         className="orig-word"
//                         style={{
//                           cursor: origStrong ? "pointer" : "default",
//                         }}
//                         onClick={() => {
//                           if (origStrong) {
//                             onWordClick({
//                               word: {
//                                 word: getWordText(wordPair.orig),
//                                 strong: origStrong,
//                                 lemma: origLemma,
//                                 morph: origMorph,
//                               },
//                               origVer: pair.origVer,
//                               lang: origStrong.startsWith("H") ? "he" : "gr",
//                               translation: getWordText(wordPair.trans),
//                             });
//                           }
//                         }}
//                       >
//                         {getWordText(wordPair.orig)}
//                         {origLemma && (
//                           <small className="text-muted ms-1">
//                             ({origLemma})
//                           </small>
//                         )}
//                       </span>

//                       {/* ПЕРЕКЛАД */}
//                       <span
//                         className="trans-word"
//                         style={{
//                           cursor: transStrong ? "pointer" : "default",
//                         }}
//                         onClick={() => {
//                           if (transStrong) {
//                             onWordClick({
//                               word: {
//                                 word: getWordText(wordPair.trans),
//                                 strong: transStrong,
//                                 lemma: getLemma(wordPair.trans),
//                               },
//                               origVer: pair.origVer || pair.transVer,
//                               lang: "uk",
//                               translation: getWordText(wordPair.trans),
//                             });
//                           }
//                         }}
//                       >
//                         {getWordText(wordPair.trans)}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {hoveredWord && hoveredWord.wordPair && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             position: "fixed",
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {getStrongCode(hoveredWord.wordPair.orig) && (
//               <div>
//                 <strong>{getStrongCode(hoveredWord.wordPair.orig)}</strong>:{" "}
//                 {getWordText(hoveredWord.wordPair.orig)}
//                 {getLemma(hoveredWord.wordPair.orig) &&
//                   ` (${getLemma(hoveredWord.wordPair.orig)})`}
//                 {getMorph(hoveredWord.wordPair.orig) &&
//                   ` [${getMorph(hoveredWord.wordPair.orig)}]`}
//               </div>
//             )}
//             {getStrongCode(hoveredWord.wordPair.trans) && (
//               <div>
//                 <strong>{getStrongCode(hoveredWord.wordPair.trans)}</strong>:{" "}
//                 {getWordText(hoveredWord.wordPair.trans)}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {getWordText(hoveredWord.wordPair.trans) !== "—"
//                 ? getWordText(hoveredWord.wordPair.trans)
//                 : getWordText(hoveredWord.wordPair.orig) || "—"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// -------------------------------------------------

// src/components/InterlinearVerse.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import "../styles/Interlinear.css";
import { jsonAdapter, getValue } from "../utils/jsonAdapter";

const InterlinearVerse = ({
  verseNum,
  pairs, // Масив пар для вертикального рендеру
  chapterData,
  onWordClick,
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const verseRef = useRef(null);

  // Адаптуємо chapterData до уніфікованого формату
  const adaptedData = useMemo(() => {
    const result = {};
    if (!chapterData) return result;

    Object.keys(chapterData).forEach((key) => {
      const data = chapterData[key];

      // Адаптуємо дані
      const adapted = jsonAdapter(data);

      // Переконуємося, що це масив
      if (Array.isArray(adapted)) {
        result[key] = adapted;
      } else if (adapted && typeof adapted === "object") {
        // Якщо це об'єкт, спробуємо перетворити на масив
        const values = Object.values(adapted);
        result[key] = values.filter((item) => item && typeof item === "object");
      } else {
        result[key] = [];
      }
    });

    return result;
  }, [chapterData]);

  // Запобіжник: якщо pairs або chapterData undefined або порожні
  if (!pairs || pairs.length === 0 || !chapterData) {
    return (
      <div className="interlinear-verse">
        <div className="verse-number">{verseNum}</div>
        <div className="words-grid text-muted">Дані для вірша відсутні</div>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    setMousePos({
      x: e.pageX,
      y: e.pageY,
    });
  };

  // Функції для безпечного отримання значень
  const getWordText = (word) => {
    if (!word) return "—";
    return getValue(word, "word") || getValue(word, "w") || "—";
  };

  const getStrongCode = (word) => {
    if (!word) return null;
    return getValue(word, "strong") || getValue(word, "s") || null;
  };

  const getLemma = (word) => {
    if (!word) return null;
    return getValue(word, "lemma") || getValue(word, "l") || null;
  };

  const getMorph = (word) => {
    if (!word) return null;
    return getValue(word, "morph") || getValue(word, "m") || null;
  };

  return (
    <div
      className="interlinear-verse"
      ref={verseRef}
      onMouseMove={handleMouseMove}
    >
      <div className="verse-number">{verseNum}</div>
      <div className="pairs-vertical">
        {pairs.map((pair, pIndex) => {
          const origVerse = adaptedData[pair.origVer]?.find(
            (v) =>
              getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
          );
          const transVerse = adaptedData[pair.transVer]?.find(
            (v) =>
              getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
          );

          // Отримуємо слова з адаптованих даних
          const origWords =
            getValue(origVerse, "words") || getValue(origVerse, "ws") || [];
          const transWords =
            getValue(transVerse, "words") || getValue(transVerse, "ws") || [];

          if (origWords.length === 0 && transWords.length === 0) {
            return (
              <div key={pIndex} className="pair-section">
                <h5>
                  {pair.origVer
                    ? `${pair.origVer}/${pair.transVer || ""}`
                    : pair.transVer}
                </h5>
                <div className="text-muted">Дані відсутні</div>
              </div>
            );
          }

          // Створюємо масив слів для вирівнювання
          const alignedWords = [];
          const strongMap = new Map();

          // Заповнюємо мапу для вирівнювання за strong кодами
          origWords.forEach((w, index) => {
            const strong = getStrongCode(w);
            if (strong) {
              strongMap.set(strong, {
                ...strongMap.get(strong),
                orig: w,
                origIndex: index,
              });
            }
          });

          transWords.forEach((w, index) => {
            const strong = getStrongCode(w);
            if (strong) {
              strongMap.set(strong, {
                ...strongMap.get(strong),
                trans: w,
                transIndex: index,
              });
            }
          });

          // Додаємо слова без strong кодів за індексом
          origWords.forEach((w, index) => {
            const strong = getStrongCode(w);
            if (!strong) {
              alignedWords.push({
                id: `orig-${index}`,
                orig: w,
                trans: { w: "—" },
                index,
              });
            }
          });

          transWords.forEach((w, index) => {
            const strong = getStrongCode(w);
            if (!strong) {
              const existing = alignedWords.find(
                (a) => a.id === `trans-${index}`
              );
              if (!existing) {
                alignedWords.push({
                  id: `trans-${index}`,
                  orig: { w: "—" },
                  trans: w,
                  index,
                });
              }
            }
          });

          // Додаємо слова з strong кодами
          strongMap.forEach((pair, strong) => {
            alignedWords.push({
              id: `strong-${strong}`,
              strong,
              orig: pair.orig || { w: "—" },
              trans: pair.trans || { w: "—" },
              index:
                pair.origIndex !== undefined ? pair.origIndex : pair.transIndex,
            });
          });

          // Сортуємо за індексом для збереження порядку
          alignedWords.sort((a, b) => {
            const idxA = a.index !== undefined ? a.index : 999;
            const idxB = b.index !== undefined ? b.index : 999;
            return idxA - idxB;
          });

          return (
            <div key={pIndex} className="pair-section">
              <h5 className="pair-title">
                {pair.origVer
                  ? `${pair.origVer}/${pair.transVer || ""}`
                  : pair.transVer}
              </h5>
              <div className="words-grid">
                {alignedWords.map((wordPair, i) => {
                  const hasStrong =
                    getStrongCode(wordPair.orig) ||
                    getStrongCode(wordPair.trans);

                  const origStrong = getStrongCode(wordPair.orig);
                  const transStrong = getStrongCode(wordPair.trans);
                  const origLemma = getLemma(wordPair.orig);
                  const origMorph = getMorph(wordPair.orig);

                  return (
                    <div
                      key={i}
                      className="word-pair"
                      onMouseEnter={() =>
                        hasStrong && setHoveredWord({ wordPair, index: i })
                      }
                      onMouseLeave={() => setHoveredWord(null)}
                    >
                      {/* ОРИГІНАЛ */}
                      <span
                        className="orig-word"
                        style={{
                          cursor: origStrong ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (origStrong) {
                            onWordClick({
                              word: {
                                word: getWordText(wordPair.orig),
                                strong: origStrong,
                                lemma: origLemma,
                                morph: origMorph,
                              },
                              origVer: pair.origVer,
                              lang: origStrong.startsWith("H") ? "he" : "gr",
                              translation: getWordText(wordPair.trans),
                            });
                          }
                        }}
                      >
                        {getWordText(wordPair.orig)}
                        {/* ВИДАЛЕНО: відображення леми в дужках */}
                      </span>

                      {/* ПЕРЕКЛАД */}
                      <span
                        className="trans-word"
                        style={{
                          cursor: transStrong ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (transStrong) {
                            onWordClick({
                              word: {
                                word: getWordText(wordPair.trans),
                                strong: transStrong,
                                lemma: getLemma(wordPair.trans),
                              },
                              origVer: pair.origVer || pair.transVer,
                              lang: "uk",
                              translation: getWordText(wordPair.trans),
                            });
                          }
                        }}
                      >
                        {getWordText(wordPair.trans)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {hoveredWord && hoveredWord.wordPair && (
        <div
          ref={tooltipRef}
          className="hover-tooltip"
          style={{
            position: "fixed",
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 80}px`,
            zIndex: 1000,
          }}
          onMouseEnter={() => setHoveredWord(hoveredWord)}
          onMouseLeave={() => setHoveredWord(null)}
        >
          <div className="tooltip-content">
            {getStrongCode(hoveredWord.wordPair.orig) && (
              <div>
                <strong>{getStrongCode(hoveredWord.wordPair.orig)}</strong>:{" "}
                {getWordText(hoveredWord.wordPair.orig)}
                {getLemma(hoveredWord.wordPair.orig) &&
                  ` (${getLemma(hoveredWord.wordPair.orig)})`}
                {getMorph(hoveredWord.wordPair.orig) &&
                  ` [${getMorph(hoveredWord.wordPair.orig)}]`}
              </div>
            )}
            {getStrongCode(hoveredWord.wordPair.trans) && (
              <div>
                <strong>{getStrongCode(hoveredWord.wordPair.trans)}</strong>:{" "}
                {getWordText(hoveredWord.wordPair.trans)}
              </div>
            )}
            <div className="translation">
              →{" "}
              {getWordText(hoveredWord.wordPair.trans) !== "—"
                ? getWordText(hoveredWord.wordPair.trans)
                : getWordText(hoveredWord.wordPair.orig) || "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;
