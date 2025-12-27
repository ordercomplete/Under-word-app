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

// // src/components/InterlinearVerse.js
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
//                         {/* ВИДАЛЕНО: відображення леми в дужках */}
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

// ---------------------------------------

// // src/components/InterlinearVerse.js - ОНОВЛЕНА ВЕРСІЯ
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Функції для отримання значень
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

//   // Функція для отримання назви перекладу
//   const getTranslationLabel = (code) => {
//     const labels = {
//       LXX: "[LXX]",
//       TR: "[TR]",
//       GNT: "[GNT]",
//       THOT: "[THOT]",
//       UTT: "[UTT]",
//       UBT: "[UBT]",
//       KJV: "[KJV]",
//       Synodal: "[Synodal]",
//     };
//     return labels[code] || `[${code}]`;
//   };

//   // Адаптуємо дані
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);
//       if (Array.isArray(adapted)) {
//         result[key] = adapted;
//       } else if (adapted && typeof adapted === "object") {
//         const values = Object.values(adapted);
//         result[key] = values.filter((item) => item && typeof item === "object");
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   useEffect(() => {
//     console.log("=== DEBUG InterlinearVerse ===");
//     console.log("Pairs:", pairs);
//     console.log("Adapted Data keys:", Object.keys(adaptedData));

//     Object.keys(adaptedData).forEach((key) => {
//       const data = adaptedData[key];
//       console.log(`--- ${key} ---`);
//       console.log("Type:", Array.isArray(data) ? "Array" : typeof data);
//       console.log("Length:", Array.isArray(data) ? data.length : "N/A");
//       if (Array.isArray(data) && data.length > 0) {
//         console.log("First item:", data[0]);
//         console.log("Has 'ws'?", "ws" in data[0]);
//         console.log("Has 'words'?", "words" in data[0]);
//         console.log("Has 'v'?", "v" in data[0]);
//       }
//     });
//   }, [adaptedData]);

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
//           const origVerse = adaptedData[pair.origVer]?.find(
//             (v) =>
//               getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
//           );
//           const transVerse = adaptedData[pair.transVer]?.find(
//             (v) =>
//               getValue(v, "verse") === verseNum || getValue(v, "v") === verseNum
//           );

//           const origWords =
//             getValue(origVerse, "words") || getValue(origVerse, "ws") || [];
//           const transWords =
//             getValue(transVerse, "words") || getValue(transVerse, "ws") || [];

//           if (origWords.length === 0 && transWords.length === 0) {
//             return (
//               <div key={pIndex} className="pair-section">
//                 <div className="text-muted">Дані відсутні</div>
//               </div>
//             );
//           }

//           // Створюємо вирівняні пари слів
//           const alignedWords = [];
//           const strongMap = new Map();

//           // Заповнюємо мапу за Strong кодами
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

//           // Додаємо слова без Strong кодів
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

//           // Додаємо слова з Strong кодами
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

//           // Сортуємо за індексом
//           alignedWords.sort((a, b) => {
//             const idxA = a.index !== undefined ? a.index : 999;
//             const idxB = b.index !== undefined ? b.index : 999;
//             return idxA - idxB;
//           });

//           return (
//             <div key={pIndex} className="pair-section">
//               {/* НОВА СТРУКТУРА: два окремі блоки з заголовками */}
//               {pair.origVer && (
//                 <div className="interlinear-block">
//                   {/* <div className="block-header">
//                     <span className="translation-label original-label">
//                       {getTranslationLabel(pair.origVer)}
//                     </span>
//                   </div> */}
//                   <div className="words-grid vertical-alignment">
//                     <div className="block-header">
//                       <span className="translation-label original-label">
//                         {getTranslationLabel(pair.origVer)}
//                       </span>
//                     </div>
//                     {alignedWords.map((wordPair, i) => {
//                       const origStrong = getStrongCode(wordPair.orig);
//                       const origLemma = getLemma(wordPair.orig);
//                       const origMorph = getMorph(wordPair.orig);

//                       return (
//                         <div key={`orig-${i}`} className="word-cell">
//                           <span
//                             className="orig-word"
//                             style={{
//                               cursor: origStrong ? "pointer" : "default",
//                             }}
//                             onClick={() => {
//                               if (origStrong) {
//                                 onWordClick({
//                                   word: {
//                                     word: getWordText(wordPair.orig),
//                                     strong: origStrong,
//                                     lemma: origLemma,
//                                     morph: origMorph,
//                                   },
//                                   origVer: pair.origVer,
//                                   lang: origStrong.startsWith("H")
//                                     ? "he"
//                                     : "gr",
//                                   translation: getWordText(wordPair.trans),
//                                 });
//                               }
//                             }}
//                             onMouseEnter={() =>
//                               origStrong &&
//                               setHoveredWord({
//                                 wordPair,
//                                 index: i,
//                                 type: "orig",
//                               })
//                             }
//                             onMouseLeave={() => setHoveredWord(null)}
//                           >
//                             {getWordText(wordPair.orig)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {pair.transVer && (
//                 <div className="interlinear-block">
//                   {/* <div className="block-header">
//                     <span className="translation-label translation-label">
//                       {getTranslationLabel(pair.transVer)}
//                     </span>
//                   </div> */}
//                   <div className="words-grid vertical-alignment">
//                     <div className="block-header">
//                       <span className="translation-label translation-label">
//                         {getTranslationLabel(pair.transVer)}
//                       </span>
//                     </div>
//                     {alignedWords.map((wordPair, i) => {
//                       const transStrong = getStrongCode(wordPair.trans);

//                       return (
//                         <div key={`trans-${i}`} className="word-cell">
//                           <span
//                             className="trans-word"
//                             style={{
//                               cursor: transStrong ? "pointer" : "default",
//                             }}
//                             onClick={() => {
//                               if (transStrong) {
//                                 onWordClick({
//                                   word: {
//                                     word: getWordText(wordPair.trans),
//                                     strong: transStrong,
//                                     lemma: getLemma(wordPair.trans),
//                                   },
//                                   origVer: pair.origVer || pair.transVer,
//                                   lang: "uk",
//                                   translation: getWordText(wordPair.trans),
//                                 });
//                               }
//                             }}
//                             onMouseEnter={() =>
//                               transStrong &&
//                               setHoveredWord({
//                                 wordPair,
//                                 index: i,
//                                 type: "trans",
//                               })
//                             }
//                             onMouseLeave={() => setHoveredWord(null)}
//                           >
//                             {getWordText(wordPair.trans)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Підказка при наведенні */}
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

// ----------------------------------------------------26.12.25
// // src/components/InterlinearVerse.js
// import React, { useState, useRef, useMemo } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Функції для отримання значень
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

//   // Отримання вірша за номером
//   const getVerseData = (version, verseNumber) => {
//     if (!adaptedData[version]) return null;
//     return adaptedData[version].find((v) => {
//       const vNum = v.verse || v.v;
//       return vNum === verseNumber;
//     });
//   };

//   // Отримання слів з вірша
//   const getWordsFromVerse = (verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   };

//   // Адаптація даних
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);

//       if (Array.isArray(adapted)) {
//         result[key] = adapted.filter(
//           (item) => item && typeof item === "object"
//         );
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   // Вирівнювання слів за Strong кодами для групи версій
//   const alignWordsForGroup = (originalVersion, translationVersions) => {
//     const originalVerse = getVerseData(originalVersion, verseNum);
//     const originalWords = getWordsFromVerse(originalVerse);

//     // Створюємо масив для вирівняних слів
//     const alignedWords = [];

//     // Для кожного слова оригіналу створюємо об'єкт
//     originalWords.forEach((origWord, index) => {
//       const wordObj = {
//         id: `word-${index}`,
//         original: {
//           version: originalVersion,
//           word: origWord,
//           text: getWordText(origWord),
//           strong: getStrongCode(origWord),
//         },
//         translations: {},
//       };

//       // Додаємо переклади для цього слова
//       translationVersions.forEach((transVersion) => {
//         const transVerse = getVerseData(transVersion, verseNum);
//         const transWords = getWordsFromVerse(transVerse);

//         // Шукаємо відповідне слово за Strong кодом
//         if (wordObj.original.strong) {
//           const matchingWord = transWords.find(
//             (w) => getStrongCode(w) === wordObj.original.strong
//           );
//           wordObj.translations[transVersion] = matchingWord || null;
//         } else {
//           // Якщо немає Strong коду, спробуємо за індексом
//           wordObj.translations[transVersion] = transWords[index] || null;
//         }
//       });

//       alignedWords.push(wordObj);
//     });

//     return alignedWords;
//   };

//   const handleMouseMove = (e) => {
//     setMousePos({ x: e.pageX, y: e.pageY });
//   };

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="pairs-container">
//         {pairs.map((pair, pairIndex) => {
//           // Якщо немає оригіналу і немає перекладів - пропускаємо
//           if (
//             !pair.original &&
//             (!pair.translations || pair.translations.length === 0)
//           ) {
//             return null;
//           }

//           // Якщо є тільки оригінал без перекладів
//           if (
//             pair.original &&
//             (!pair.translations || pair.translations.length === 0)
//           ) {
//             const verse = getVerseData(pair.original, verseNum);
//             const words = getWordsFromVerse(verse);

//             if (words.length === 0) return null;

//             return (
//               <div key={`pair-${pairIndex}`} className="version-group">
//                 <div className="version-row original-row">
//                   <span className="version-label">[{pair.original}]</span>
//                   <div className="words-row">
//                     {words.map((word, i) => (
//                       <span
//                         key={`word-${i}`}
//                         className="word-cell original-word"
//                         onClick={() => {
//                           const strong = getStrongCode(word);
//                           if (strong) {
//                             onWordClick({
//                               word: {
//                                 word: getWordText(word),
//                                 strong: strong,
//                                 lemma: getLemma(word),
//                                 morph: getMorph(word),
//                               },
//                               origVer: pair.original,
//                               lang: strong.startsWith("H") ? "he" : "gr",
//                             });
//                           }
//                         }}
//                       >
//                         {getWordText(word)}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             );
//           }

//           // Якщо є оригінал і переклади
//           if (
//             pair.original &&
//             pair.translations &&
//             pair.translations.length > 0
//           ) {
//             const alignedWords = alignWordsForGroup(
//               pair.original,
//               pair.translations
//             );

//             return (
//               <div key={`pair-${pairIndex}`} className="version-group">
//                 {/* Рядок оригіналу */}
//                 <div className="version-row original-row">
//                   <span className="version-label">[{pair.original}]</span>
//                   <div className="words-row">
//                     {alignedWords.map((wordObj, i) => (
//                       <span
//                         key={`orig-${i}`}
//                         className="word-cell original-word"
//                         onClick={() => {
//                           if (wordObj.original.strong) {
//                             onWordClick({
//                               word: {
//                                 word: wordObj.original.text,
//                                 strong: wordObj.original.strong,
//                                 lemma: getLemma(wordObj.original.word),
//                                 morph: getMorph(wordObj.original.word),
//                               },
//                               origVer: pair.original,
//                               lang: wordObj.original.strong.startsWith("H")
//                                 ? "he"
//                                 : "gr",
//                             });
//                           }
//                         }}
//                       >
//                         {wordObj.original.text}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Рядки перекладів */}
//                 {pair.translations.map((translation, transIndex) => (
//                   <div
//                     key={`trans-${transIndex}`}
//                     className="version-row translation-row"
//                   >
//                     <span className="version-label">[{translation}]</span>
//                     <div className="words-row">
//                       {alignedWords.map((wordObj, i) => {
//                         const transWord = wordObj.translations[translation];
//                         return (
//                           <span
//                             key={`trans-${i}`}
//                             className="word-cell translation-word"
//                             onClick={() => {
//                               const strong = getStrongCode(transWord);
//                               if (strong) {
//                                 onWordClick({
//                                   word: {
//                                     word: getWordText(transWord),
//                                     strong: strong,
//                                     lemma: getLemma(transWord),
//                                   },
//                                   origVer: pair.original,
//                                   lang: "uk",
//                                 });
//                               }
//                             }}
//                           >
//                             {transWord ? getWordText(transWord) : "—"}
//                           </span>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             );
//           }

//           return null;
//         })}
//       </div>

//       {/* Tooltip */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//         >
//           {/* ... існуючий код tooltip ... */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// --------------------------- 26.12.25-version-2

// // src/components/InterlinearVerse.js - ТАБЛИЧНА ВЕРСІЯ
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [columnWidths, setColumnWidths] = useState([]);
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);
//   const tableRef = useRef(null);

//   // Функції для отримання значень
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

//   // Отримання вірша за номером
//   const getVerseData = (version, verseNumber) => {
//     if (!adaptedData[version]) return null;
//     return adaptedData[version].find((v) => {
//       const vNum = v.verse || v.v;
//       return vNum === verseNumber;
//     });
//   };

//   // Отримання слів з вірша
//   const getWordsFromVerse = (verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   };

//   // Адаптація даних
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);

//       if (Array.isArray(adapted)) {
//         result[key] = adapted.filter(
//           (item) => item && typeof item === "object"
//         );
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   // КЛЮЧОВА ФУНКЦІЯ: Створення табличної структури
//   const createTableStructure = () => {
//     const tableData = [];

//     pairs.forEach((pair, pairIndex) => {
//       if (
//         !pair.original &&
//         (!pair.translations || pair.translations.length === 0)
//       ) {
//         return;
//       }

//       // Отримуємо дані для групи
//       const groupData = {
//         original: pair.original,
//         translations: pair.translations || [],
//         rows: [],
//       };

//       // Знаходимо ВСІ Strong коди з усіх версій у цій групі
//       const allStrongs = new Set();
//       const allVersions = [pair.original, ...(pair.translations || [])].filter(
//         Boolean
//       );

//       allVersions.forEach((version) => {
//         const verse = getVerseData(version, verseNum);
//         if (verse) {
//           const words = getWordsFromVerse(verse);
//           words.forEach((word) => {
//             const strong = getStrongCode(word);
//             if (strong) allStrongs.add(strong);
//           });
//         }
//       });

//       // Створюємо масив унікальних Strong кодів
//       const strongArray = Array.from(allStrongs);

//       // Якщо немає Strong кодів, використовуємо порядковий номер
//       if (strongArray.length === 0) {
//         // Знаходимо максимальну кількість слів серед всіх версій
//         let maxWords = 0;
//         allVersions.forEach((version) => {
//           const verse = getVerseData(version, verseNum);
//           if (verse) {
//             const words = getWordsFromVerse(verse);
//             maxWords = Math.max(maxWords, words.length);
//           }
//         });

//         // Створюємо колонки за індексами
//         for (let i = 0; i < maxWords; i++) {
//           strongArray.push(`index-${i}`);
//         }
//       }

//       // Створюємо рядки для кожної версії
//       allVersions.forEach((version) => {
//         const verse = getVerseData(version, verseNum);
//         const words = verse ? getWordsFromVerse(verse) : [];

//         // Створюємо мапу Strong -> слово для цієї версії
//         const wordMap = new Map();
//         words.forEach((word) => {
//           const strong = getStrongCode(word);
//           if (strong) {
//             wordMap.set(strong, word);
//           }
//         });

//         // Якщо немає Strong кодів, використовуємо індекси
//         if (wordMap.size === 0) {
//           words.forEach((word, index) => {
//             wordMap.set(`index-${index}`, word);
//           });
//         }

//         // Створюємо рядок
//         const row = {
//           version: version,
//           isOriginal: version === pair.original,
//           cells: [],
//         };

//         // Заповнюємо клітинки
//         strongArray.forEach((strong) => {
//           const word = wordMap.get(strong);
//           row.cells.push({
//             word: word,
//             text: word ? getWordText(word) : "—",
//             strong: word ? getStrongCode(word) : null,
//           });
//         });

//         groupData.rows.push(row);
//       });

//       // Додаємо до таблиці
//       if (groupData.rows.length > 0) {
//         tableData.push(groupData);
//       }
//     });

//     return tableData;
//   };

//   // Розрахунок ширини колонок
//   useEffect(() => {
//     const calculateColumnWidths = () => {
//       if (!tableRef.current) return;

//       const table = tableRef.current;
//       const columns = table.querySelectorAll("tbody tr:first-child td");
//       const widths = [];

//       columns.forEach((col, index) => {
//         let maxWidth = 80; // Мінімальна ширина

//         // Шукаємо найширшу клітинку в цій колонці
//         const cells = table.querySelectorAll(
//           `tbody td:nth-child(${index + 1})`
//         );
//         cells.forEach((cell) => {
//           const text = cell.textContent;
//           const cellWidth = Math.min(
//             Math.max(text.length * 10 + 20, 80), // На основі довжини тексту
//             150 // Максимальна ширина
//           );
//           maxWidth = Math.max(maxWidth, cellWidth);
//         });

//         widths[index] = maxWidth;
//       });

//       setColumnWidths(widths);
//     };

//     // Затримка для того, щоб DOM оновився
//     setTimeout(calculateColumnWidths, 100);
//   }, [pairs, verseNum]);

//   const handleMouseMove = (e) => {
//     setMousePos({ x: e.pageX, y: e.pageY });
//   };

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const tableData = createTableStructure();

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       {tableData.map((group, groupIndex) => (
//         <div key={`group-${groupIndex}`} className="table-group">
//           <div className="table-container">
//             <table ref={tableRef} className="interlinear-table">
//               {/* <thead>
//                 <tr>
//                   <th className="version-header">Версія</th>
//                   {columnWidths.map((width, colIndex) => (
//                     <th
//                       key={`col-${colIndex}`}
//                       style={{ width: `${width}px`, minWidth: `${width}px` }}
//                     >
//                       {colIndex + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead> */}
//               <tbody>
//                 {group.rows.map((row, rowIndex) => (
//                   <tr
//                     key={`row-${rowIndex}`}
//                     className={
//                       row.isOriginal ? "original-row" : "translation-row"
//                     }
//                   >
//                     <td className="version-cell">
//                       <span className="version-label">[{row.version}]</span>
//                     </td>
//                     {row.cells.map((cell, cellIndex) => (
//                       <td
//                         key={`cell-${cellIndex}`}
//                         className={`word-cell ${
//                           row.isOriginal ? "original-word" : "translation-word"
//                         }`}
//                         style={{
//                           width: columnWidths[cellIndex]
//                             ? `${columnWidths[cellIndex]}px`
//                             : "auto",
//                           minWidth: columnWidths[cellIndex]
//                             ? `${columnWidths[cellIndex]}px`
//                             : "auto",
//                         }}
//                         onClick={() => {
//                           if (cell.word && cell.strong) {
//                             onWordClick({
//                               word: {
//                                 word: cell.text,
//                                 strong: cell.strong,
//                                 lemma: getLemma(cell.word),
//                                 morph: getMorph(cell.word),
//                               },
//                               origVer: group.original,
//                               lang: cell.strong.startsWith("H") ? "he" : "gr",
//                             });
//                           }
//                         }}
//                         onMouseEnter={() => cell.word && setHoveredWord(cell)}
//                         onMouseLeave={() => setHoveredWord(null)}
//                       >
//                         {cell.text}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}

//       {/* Tooltip */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.strong && (
//               <div>
//                 <strong>{hoveredWord.strong}</strong>: {hoveredWord.text}
//                 {getLemma(hoveredWord.word) &&
//                   ` (${getLemma(hoveredWord.word)})`}
//                 {getMorph(hoveredWord.word) &&
//                   ` [${getMorph(hoveredWord.word)}]`}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// --------------------------- 26.12.25-version-таблична версія-2

// // src/components/InterlinearVerse.js - ОНОВЛЕНА ТАБЛИЧНА ВЕРСІЯ
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import "../styles/Interlinear.css";
// import { getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [columnWidths, setColumnWidths] = useState([]);
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);
//   const tableRef = useRef(null);

//   // Функції для отримання значень
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

//   // Отримання вірша за номером
//   const getVerseData = (version, verseNumber) => {
//     if (!chapterData[version]) return null;
//     const data = chapterData[version];

//     if (Array.isArray(data)) {
//       return data.find((v) => {
//         const vNum = getValue(v, "verse") || getValue(v, "v");
//         return vNum === verseNumber;
//       });
//     }
//     return null;
//   };

//   // Отримання слів з вірша
//   const getWordsFromVerse = (verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   };

//   // КЛЮЧОВА ФУНКЦІЯ: Створення табличної структури з правильним групуванням
//   const createTableStructure = useMemo(() => {
//     if (!pairs || pairs.length === 0 || !chapterData) return [];

//     const tableData = [];

//     pairs.forEach((pair) => {
//       const { original, translations = [] } = pair;
//       if (!original && translations.length === 0) return;

//       // Збираємо ВСІ версії для цієї групи
//       const allVersions = [original, ...translations];

//       // Створюємо спільний порядок Strong кодів на основі ОРИГІНАЛУ
//       let strongOrder = [];

//       // Спершу отримуємо порядок з оригіналу
//       const originalVerse = getVerseData(original, verseNum);
//       if (originalVerse) {
//         const words = getWordsFromVerse(originalVerse);
//         strongOrder = words.map(
//           (word) => getStrongCode(word) || `index-${words.indexOf(word)}`
//         );
//       }

//       // Якщо оригінал не має даних, шукаємо в будь-якій версії
//       if (strongOrder.length === 0) {
//         allVersions.forEach((version) => {
//           const verse = getVerseData(version, verseNum);
//           if (verse) {
//             const words = getWordsFromVerse(verse);
//             if (words.length > strongOrder.length) {
//               strongOrder = words.map(
//                 (word) => getStrongCode(word) || `index-${words.indexOf(word)}`
//               );
//             }
//           }
//         });
//       }

//       // Якщо все ще немає даних, повертаємо порожній масив
//       if (strongOrder.length === 0) {
//         return;
//       }

//       // Створюємо мапу для швидкого пошуку слова за Strong кодом для кожної версії
//       const versionWordMaps = {};
//       allVersions.forEach((version) => {
//         const verse = getVerseData(version, verseNum);
//         const words = verse ? getWordsFromVerse(verse) : [];
//         const wordMap = {};

//         words.forEach((word, index) => {
//           const strong = getStrongCode(word);
//           const key = strong || `index-${index}`;
//           wordMap[key] = word;
//         });

//         versionWordMaps[version] = wordMap;
//       });

//       // Створюємо рядки для кожної версії
//       const rows = allVersions.map((version) => {
//         const wordMap = versionWordMaps[version] || {};
//         const cells = strongOrder.map((strongKey) => {
//           const word = wordMap[strongKey];
//           return {
//             word: word,
//             text: word ? getWordText(word) : "—",
//             strong: word ? getStrongCode(word) : null,
//             isEmpty: !word,
//           };
//         });

//         return {
//           version: version,
//           isOriginal: version === original,
//           cells: cells,
//         };
//       });

//       tableData.push({
//         original: original,
//         translations: translations,
//         strongOrder: strongOrder,
//         rows: rows,
//       });
//     });

//     return tableData;
//   }, [pairs, verseNum, chapterData]);

//   // Розрахунок ширини колонок на основі найширшого вмісту
//   useEffect(() => {
//     const calculateColumnWidths = () => {
//       if (!tableRef.current || !createTableStructure.length) return;

//       const widths = [];
//       const tableGroups = tableRef.current.querySelectorAll(".table-group");

//       // Для кожної групи (оригінал + його переклади)
//       tableGroups.forEach((group, groupIndex) => {
//         const rows = group.querySelectorAll("tbody tr");

//         // Перевіряємо кожен стовпець
//         rows.forEach((row) => {
//           const cells = row.querySelectorAll("td:not(.version-cell)");
//           cells.forEach((cell, colIndex) => {
//             const text = cell.textContent || "—";
//             // Розраховуємо приблизну ширину на основі довжини тексту
//             const textWidth = Math.max(text.length * 8, 40); // Мінімум 40px
//             const currentMax = widths[colIndex] || 0;
//             widths[colIndex] = Math.max(currentMax, textWidth, 60); // Мінімальна ширина 60px
//           });
//         });
//       });

//       // Обмежуємо максимальну ширину
//       const maxColumnWidth = 200;
//       const adjustedWidths = widths.map((width) =>
//         Math.min(width, maxColumnWidth)
//       );

//       setColumnWidths(adjustedWidths);
//     };

//     // Використовуємо requestAnimationFrame для кращої продуктивності
//     requestAnimationFrame(() => {
//       setTimeout(calculateColumnWidths, 50);
//     });
//   }, [createTableStructure]);

//   const handleMouseMove = (e) => {
//     setMousePos({ x: e.pageX, y: e.pageY });
//   };

//   if (
//     !pairs ||
//     pairs.length === 0 ||
//     !chapterData ||
//     createTableStructure.length === 0
//   ) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       {createTableStructure.map((group, groupIndex) => (
//         <div
//           key={`group-${groupIndex}`}
//           className="table-group"
//           ref={groupIndex === 0 ? tableRef : null}
//         >
//           <div className="table-container">
//             <table className="interlinear-table">
//               <tbody>
//                 {group.rows.map((row, rowIndex) => (
//                   <tr
//                     key={`row-${rowIndex}`}
//                     className={
//                       row.isOriginal ? "original-row" : "translation-row"
//                     }
//                   >
//                     <td className="version-cell" style={{ width: "120px" }}>
//                       <span className="version-label">[{row.version}]</span>
//                     </td>
//                     {row.cells.map((cell, cellIndex) => (
//                       <td
//                         key={`cell-${cellIndex}`}
//                         className={`word-cell ${
//                           row.isOriginal ? "original-word" : "translation-word"
//                         } ${cell.isEmpty ? "empty-cell" : ""}`}
//                         style={{
//                           width: columnWidths[cellIndex]
//                             ? `${columnWidths[cellIndex]}px`
//                             : "80px",
//                           minWidth: columnWidths[cellIndex]
//                             ? `${columnWidths[cellIndex]}px`
//                             : "80px",
//                           maxWidth: columnWidths[cellIndex]
//                             ? `${columnWidths[cellIndex]}px`
//                             : "200px",
//                         }}
//                         onClick={() => {
//                           if (cell.word && cell.strong) {
//                             onWordClick({
//                               word: {
//                                 word: cell.text,
//                                 strong: cell.strong,
//                                 lemma: getLemma(cell.word),
//                                 morph: getMorph(cell.word),
//                               },
//                               origVer: group.original,
//                               lang: cell.strong.startsWith("H") ? "he" : "gr",
//                             });
//                           }
//                         }}
//                         onMouseEnter={() => cell.word && setHoveredWord(cell)}
//                         onMouseLeave={() => setHoveredWord(null)}
//                       >
//                         {cell.text}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}

//       {/* Tooltip */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.strong && (
//               <div>
//                 <strong>{hoveredWord.strong}</strong>: {hoveredWord.text}
//                 {getLemma(hoveredWord.word) &&
//                   ` (${getLemma(hoveredWord.word)})`}
//                 {getMorph(hoveredWord.word) &&
//                   ` [${getMorph(hoveredWord.word)}]`}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// --------------------------- 26.12.25-version-таблична версія-3 з react-table

// // src/components/InterlinearVerse.js
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import { useTable, useBlockLayout } from "react-table";
// import { FixedSizeList } from "react-window";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const containerRef = useRef(null);

//   // Функції для отримання значень
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

//   // Отримання вірша за номером
//   const getVerseData = (version, verseNumber) => {
//     if (!adaptedData[version]) return null;
//     return adaptedData[version].find((v) => {
//       const vNum = v.verse || v.v;
//       return vNum === verseNumber;
//     });
//   };

//   // Отримання слів з вірша
//   const getWordsFromVerse = (verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   };

//   // Адаптація даних
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);

//       if (Array.isArray(adapted)) {
//         result[key] = adapted.filter(
//           (item) => item && typeof item === "object"
//         );
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   // КЛЮЧОВА ФУНКЦІЯ: Створення табличної структури з вирівнюванням за Strong кодами
//   const createTableData = () => {
//     const columns = [];
//     const data = [];

//     // 1. Створюємо колонки (по одній на кожен Strong код)
//     const strongColumns = new Map(); // Map для збереження порядку стовпців
//     let columnIndex = 0;

//     // Спершу проходимо по оригіналах для отримання основної структури
//     pairs.forEach((pair) => {
//       if (pair.original) {
//         const verseData = getVerseData(pair.original, verseNum);
//         if (verseData) {
//           const words = getWordsFromVerse(verseData);
//           words.forEach((word, wordIndex) => {
//             const strong = getStrongCode(word);
//             const columnKey = strong || `index-${wordIndex}`;

//             if (!strongColumns.has(columnKey)) {
//               strongColumns.set(columnKey, {
//                 id: columnKey,
//                 Header: ``, // Пустий заголовок
//                 accessor: (row) => {
//                   if (row.version === pair.original) {
//                     return getWordText(word);
//                   }
//                   return null;
//                 },
//                 width: 100, // Початкова ширина
//                 minWidth: 80,
//                 maxWidth: 200,
//                 isOriginal: true,
//                 originalVersion: pair.original,
//                 wordIndex,
//                 strongCode: strong,
//               });
//               columnIndex++;
//             }
//           });
//         }
//       }
//     });

//     // 2. Додаємо колонки для перекладів (з тими самими Strong кодами)
//     pairs.forEach((pair) => {
//       pair.translations?.forEach((translation) => {
//         const verseData = getVerseData(translation, verseNum);
//         if (verseData) {
//           const words = getWordsFromVerse(verseData);

//           // Створюємо мапу Strong -> слово для цього перекладу
//           const translationMap = new Map();
//           words.forEach((word) => {
//             const strong = getStrongCode(word);
//             if (strong) {
//               translationMap.set(strong, word);
//             }
//           });

//           // Додаємо до існуючих колонок
//           strongColumns.forEach((col, key) => {
//             if (key.startsWith("index-")) {
//               const index = parseInt(key.split("-")[1]);
//               if (words[index]) {
//                 col[translation] = getWordText(words[index]);
//               }
//             } else if (translationMap.has(key)) {
//               col[translation] = getWordText(translationMap.get(key));
//             } else {
//               col[translation] = "—";
//             }
//           });
//         }
//       });
//     });

//     // 3. Перетворюємо Map в масив колонок
//     strongColumns.forEach((col) => {
//       // Розраховуємо ширину на основі найдовшого тексту
//       let maxTextLength = 0;

//       // Перевіряємо оригінал
//       if (col.originalVersion) {
//         const text = col.accessor?.({ version: col.originalVersion }) || "";
//         maxTextLength = Math.max(maxTextLength, text.length);
//       }

//       // Перевіряємо переклади
//       Object.values(col).forEach((value) => {
//         if (
//           typeof value === "string" &&
//           value !== col.id &&
//           value !== col.Header
//         ) {
//           maxTextLength = Math.max(maxTextLength, value.length);
//         }
//       });

//       // Встановлюємо ширину на основі найдовшого тексту
//       col.width = Math.max(80, Math.min(maxTextLength * 8 + 20, 200));

//       columns.push(col);
//     });

//     // 4. Створюємо дані для таблиці (по одному рядку на версію)
//     const allVersions = [];
//     pairs.forEach((pair) => {
//       if (pair.original) allVersions.push(pair.original);
//       if (pair.translations) allVersions.push(...pair.translations);
//     });

//     allVersions.forEach((version) => {
//       const row = {
//         version,
//         isOriginal: pairs.some((p) => p.original === version),
//       };

//       columns.forEach((column) => {
//         if (column[version] !== undefined) {
//           row[column.id] = {
//             text: column[version],
//             word: null, // Можна додати посилання на оригінальний об'єкт слова
//             strong: column.strongCode,
//             version,
//           };
//         } else if (column.accessor) {
//           const text = column.accessor(row);
//           if (text) {
//             row[column.id] = {
//               text,
//               word: null,
//               strong: column.strongCode,
//               version,
//             };
//           }
//         }
//       });

//       data.push(row);
//     });

//     return { columns, data };
//   };

//   // Отримуємо дані для таблиці
//   const { columns, data } = useMemo(
//     () => createTableData(),
//     [pairs, verseNum, adaptedData]
//   );

//   // Налаштування react-table
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     totalColumnsWidth,
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn: {
//         width: 100,
//         minWidth: 80,
//         maxWidth: 200,
//       },
//     },
//     useBlockLayout
//   );

//   const RenderRow = React.useCallback(
//     ({ index, style }) => {
//       const row = rows[index];
//       prepareRow(row);
//       return (
//         <div
//           {...row.getRowProps({
//             style,
//           })}
//           className={`table-row ${
//             row.original.isOriginal ? "original-row" : "translation-row"
//           }`}
//         >
//           {row.cells.map((cell) => {
//             const cellData = cell.value;
//             return (
//               <div
//                 {...cell.getCellProps()}
//                 className={`word-cell ${
//                   row.original.isOriginal ? "original-word" : "translation-word"
//                 }`}
//                 onClick={() => {
//                   if (cellData && cellData.strong) {
//                     onWordClick({
//                       word: {
//                         word: cellData.text,
//                         strong: cellData.strong,
//                         lemma: getLemma(cellData.word),
//                         morph: getMorph(cellData.word),
//                       },
//                       origVer: row.original.version,
//                       lang: cellData.strong.startsWith("H") ? "he" : "gr",
//                     });
//                   }
//                 }}
//                 onMouseEnter={() => cellData && setHoveredWord(cellData)}
//                 onMouseLeave={() => setHoveredWord(null)}
//                 title={cellData?.strong || ""}
//               >
//                 {cellData?.text || "—"}
//               </div>
//             );
//           })}
//         </div>
//       );
//     },
//     [prepareRow, rows, onWordClick]
//   );

//   const handleMouseMove = (e) => {
//     setMousePos({ x: e.pageX, y: e.pageY });
//   };

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="interlinear-verse"
//       ref={containerRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="table-container">
//         <div {...getTableProps()} className="interlinear-table">
//           <div className="table-header">
//             <div className="version-header-cell">Версія</div>
//             {columns.map((column) => (
//               <div
//                 key={column.id}
//                 className="word-header-cell"
//                 style={{
//                   width: column.width,
//                   minWidth: column.minWidth,
//                   maxWidth: column.maxWidth,
//                 }}
//               >
//                 {column.strongCode || column.id}
//               </div>
//             ))}
//           </div>

//           <div {...getTableBodyProps()} className="table-body">
//             {data.map((row, rowIndex) => (
//               <div
//                 key={rowIndex}
//                 className={`table-row ${
//                   row.isOriginal ? "original-row" : "translation-row"
//                 }`}
//               >
//                 <div className="version-cell">
//                   <span className="version-label">[{row.version}]</span>
//                 </div>

//                 {columns.map((column, colIndex) => {
//                   const cellData = row[column.id];
//                   return (
//                     <div
//                       key={`${rowIndex}-${colIndex}`}
//                       className={`word-cell ${
//                         row.isOriginal ? "original-word" : "translation-word"
//                       }`}
//                       style={{
//                         width: column.width,
//                         minWidth: column.minWidth,
//                         maxWidth: column.maxWidth,
//                       }}
//                       onClick={() => {
//                         if (cellData && cellData.strong) {
//                           onWordClick({
//                             word: {
//                               word: cellData.text,
//                               strong: cellData.strong,
//                               lemma: getLemma(cellData.word),
//                               morph: getMorph(cellData.word),
//                             },
//                             origVer: row.version,
//                             lang: cellData.strong.startsWith("H") ? "he" : "gr",
//                           });
//                         }
//                       }}
//                       onMouseEnter={() => cellData && setHoveredWord(cellData)}
//                       onMouseLeave={() => setHoveredWord(null)}
//                       title={cellData?.strong || ""}
//                     >
//                       {cellData?.text || "—"}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tooltip */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.strong && (
//               <div>
//                 <strong>{hoveredWord.strong}</strong>: {hoveredWord.text}
//                 {getLemma(hoveredWord.word) &&
//                   ` (${getLemma(hoveredWord.word)})`}
//                 {getMorph(hoveredWord.word) &&
//                   ` [${getMorph(hoveredWord.word)}]`}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// --------------------------- 26.12.25-version-таблична версія-4 з react-table з правильним групуванням з горизонтальним скролом

// // src/components/InterlinearVerse.js - ОНОВЛЕНА ВЕРСІЯ
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [columnWidths, setColumnWidths] = useState({});
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);
//   const tableRef = useRef(null);

//   // Функції для отримання значень
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

//   // Отримання вірша за номером
//   const getVerseData = (version, verseNumber) => {
//     if (!adaptedData[version]) return null;
//     const verse = adaptedData[version].find((v) => {
//       const vNum = v.verse || v.v;
//       return parseInt(vNum) === parseInt(verseNumber);
//     });
//     return verse;
//   };

//   // Отримання слів з вірша
//   const getWordsFromVerse = (verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   };

//   // Адаптація даних
//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     Object.keys(chapterData).forEach((key) => {
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);

//       if (Array.isArray(adapted)) {
//         result[key] = adapted.filter(
//           (item) => item && typeof item === "object"
//         );
//       } else {
//         result[key] = [];
//       }
//     });

//     return result;
//   }, [chapterData]);

//   // ФУНКЦІЯ ДЛЯ ОТРИМАННЯ ОРИГІНАЛУ ДЛЯ ВЕРСІЇ
//   const getOriginalForVersion = (version, testament) => {
//     // Мапінг версій до оригіналів (з translations.json)
//     const versionToOriginal = {
//       // Українські переклади
//       UBT: { OT: "THOT", NT: "TR" },
//       UTT: { OT: "LXX", NT: "TR" },
//       OGIENKO: { OT: "THOT", NT: "TR" },
//       KHOMENKO: { OT: "THOT", NT: "TR" },
//       SIRYY: { OT: "THOT", NT: "TR" },
//       // Інші переклади
//       SYNODAL: { OT: "THOT", NT: "TR" },
//       KJV: { OT: "THOT", NT: "TR" },
//     };

//     const mapping = versionToOriginal[version.toUpperCase()];
//     if (!mapping) return version; // Якщо не знайдено мапінг, це вже оригінал

//     return testament === "OldT" ? mapping.OT : mapping.NT;
//   };

//   // ОСНОВНА ФУНКЦІЯ: Створення табличної структури
//   const createTableStructure = () => {
//     if (!pairs || pairs.length === 0 || !chapterData) {
//       return { columns: [], tableData: [] };
//     }

//     // 1. Визначаємо головний оригінал для цієї глави
//     let mainOriginal = null;

//     // Шукаємо серед пар оригінал
//     for (const pair of pairs) {
//       if (pair.original) {
//         // Перевіряємо, чи це оригінал (TR, GNT, LXX, THOT)
//         const origUpper = pair.original.toUpperCase();
//         if (["TR", "GNT", "LXX", "THOT"].includes(origUpper)) {
//           mainOriginal = pair.original;
//           break;
//         }
//       }
//     }

//     // Якщо оригіналу не знайдено, беремо перший доступний
//     if (!mainOriginal) {
//       for (const pair of pairs) {
//         if (pair.original) {
//           mainOriginal = pair.original;
//           break;
//         }
//       }
//     }

//     if (!mainOriginal) {
//       console.warn("No main original found for verse", verseNum);
//       return { columns: [], tableData: [] };
//     }

//     // 2. Отримуємо дані головного оригіналу
//     const mainVerse = getVerseData(mainOriginal, verseNum);
//     if (!mainVerse) {
//       console.warn(
//         `No data for main original ${mainOriginal} in verse ${verseNum}`
//       );
//       return { columns: [], tableData: [] };
//     }

//     const mainWords = getWordsFromVerse(mainVerse);

//     // 3. Створюємо колонки на основі головного оригіналу
//     const columns = [];
//     mainWords.forEach((word, index) => {
//       const strong = getStrongCode(word);
//       if (strong) {
//         columns.push({
//           id: strong,
//           index: index,
//           strong: strong,
//           mainWord: word,
//         });
//       } else {
//         // Якщо немає Strong коду, використовуємо індекс
//         columns.push({
//           id: `index-${index}`,
//           index: index,
//           strong: null,
//           mainWord: word,
//         });
//       }
//     });

//     // 4. Створюємо табличні дані
//     const tableData = [];

//     // Для кожної групи (пари) створюємо рядки
//     pairs.forEach((pair, pairIndex) => {
//       const groupData = {
//         pairIndex: pairIndex,
//         original: pair.original,
//         translations: pair.translations || [],
//         rows: [],
//       };

//       // Додаємо оригінал першим
//       if (pair.original) {
//         const verse = getVerseData(pair.original, verseNum);
//         if (verse) {
//           const words = getWordsFromVerse(verse);
//           const row = createRow(pair.original, words, columns, true);
//           groupData.rows.push(row);
//         }
//       }

//       // Додаємо переклади
//       if (pair.translations) {
//         pair.translations.forEach((translation) => {
//           const verse = getVerseData(translation, verseNum);
//           if (verse) {
//             const words = getWordsFromVerse(verse);
//             const row = createRow(translation, words, columns, false);
//             groupData.rows.push(row);
//           }
//         });
//       }

//       if (groupData.rows.length > 0) {
//         tableData.push(groupData);
//       }
//     });

//     return { columns, tableData };
//   };

//   // Функція для створення рядка
//   const createRow = (version, words, columns, isOriginal) => {
//     const row = {
//       version: version,
//       isOriginal: isOriginal,
//       cells: [],
//     };

//     // Створюємо мапу Strong -> слово для цієї версії
//     const wordMap = new Map();
//     words.forEach((word) => {
//       const strong = getStrongCode(word);
//       if (strong) {
//         wordMap.set(strong, word);
//       }
//     });

//     // Заповнюємо клітинки відповідно до колонок
//     columns.forEach((column) => {
//       let word = null;
//       let text = "—";
//       let strong = null;

//       if (column.strong && wordMap.has(column.strong)) {
//         // Знайшли за Strong кодом
//         word = wordMap.get(column.strong);
//         text = getWordText(word);
//         strong = column.strong;
//       } else if (words[column.index]) {
//         // Знайшли за індексом
//         word = words[column.index];
//         text = getWordText(word);
//         strong = getStrongCode(word);
//       }

//       row.cells.push({
//         word: word,
//         text: text,
//         strong: strong,
//         columnIndex: column.index,
//         columnStrong: column.strong,
//       });
//     });

//     return row;
//   };

//   // РОЗРАХУНОК ШИРИНИ КОЛОНОК
//   const calculateColumnWidths = useMemo(() => {
//     const widths = {};

//     // Отримуємо табличну структуру
//     const { columns, tableData } = createTableStructure();

//     // Ініціалізуємо ширини для кожної колонки
//     columns.forEach((col, colIndex) => {
//       widths[colIndex] = 80; // Мінімальна ширина
//     });

//     // Знаходимо максимальну ширину для кожної колонки
//     tableData.forEach((group) => {
//       group.rows.forEach((row) => {
//         row.cells.forEach((cell, colIndex) => {
//           if (cell.text && cell.text !== "—") {
//             // Розраховуємо ширину на основі довжини тексту
//             const textLength = cell.text.length;
//             const charWidth = cell.text.match(/[a-zA-Z]/) ? 7 : 8; // Латиниця вужча
//             const textWidth = textLength * charWidth + 20; // + padding

//             const cellWidth = Math.min(Math.max(textWidth, 80), 250);

//             if (cellWidth > widths[colIndex]) {
//               widths[colIndex] = cellWidth;
//             }
//           }
//         });
//       });
//     });

//     return widths;
//   }, [pairs, verseNum, chapterData]);

//   useEffect(() => {
//     setColumnWidths(calculateColumnWidths);
//   }, [calculateColumnWidths]);

//   const handleMouseMove = (e) => {
//     setMousePos({ x: e.pageX, y: e.pageY });
//   };

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const { columns, tableData } = createTableStructure();

//   // Якщо немає даних для відображення
//   if (tableData.length === 0 || columns.length === 0) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="text-muted">Немає даних для відображення</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="table-group">
//         <div className="table-container">
//           <table ref={tableRef} className="interlinear-table">
//             <tbody>
//               {tableData.map((group, groupIndex) => (
//                 <React.Fragment key={`group-${groupIndex}`}>
//                   {group.rows.map((row, rowIndex) => (
//                     <tr
//                       key={`row-${rowIndex}`}
//                       className={`table-row ${
//                         row.isOriginal ? "original-row" : "translation-row"
//                       }`}
//                     >
//                       <td className="version-cell">
//                         <span className="version-label">[{row.version}]</span>
//                       </td>
//                       {row.cells.map((cell, cellIndex) => (
//                         <td
//                           key={`cell-${cellIndex}`}
//                           className={`word-cell ${
//                             row.isOriginal
//                               ? "original-word"
//                               : "translation-word"
//                           }`}
//                           style={{
//                             width: `${columnWidths[cellIndex] || 80}px`,
//                             minWidth: `${columnWidths[cellIndex] || 80}px`,
//                             maxWidth: "250px",
//                           }}
//                           onClick={() => {
//                             if (cell.word && cell.strong) {
//                               onWordClick({
//                                 word: {
//                                   word: cell.text,
//                                   strong: cell.strong,
//                                   lemma: getLemma(cell.word),
//                                   morph: getMorph(cell.word),
//                                 },
//                                 origVer: row.version,
//                                 lang: cell.strong.startsWith("H") ? "he" : "gr",
//                               });
//                             }
//                           }}
//                           onMouseEnter={() => cell.word && setHoveredWord(cell)}
//                           onMouseLeave={() => setHoveredWord(null)}
//                           title={cell.strong ? `Strong: ${cell.strong}` : ""}
//                         >
//                           {cell.text}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Tooltip */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.strong && (
//               <div>
//                 <strong>{hoveredWord.strong}</strong>: {hoveredWord.text}
//                 {getLemma(hoveredWord.word) &&
//                   ` (${getLemma(hoveredWord.word)})`}
//                 {getMorph(hoveredWord.word) &&
//                   ` [${getMorph(hoveredWord.word)}]`}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// --------------------------- 27.12.25-version-Флекс-версія замість таблиці

// src/components/InterlinearVerse.js - НОВА ФЛЕКС ВЕРСІЯ
import React, { useState, useRef, useMemo, useEffect } from "react";
import "../styles/Interlinear.css";
import { jsonAdapter, getValue } from "../utils/jsonAdapter";

const InterlinearVerse = ({ verseNum, pairs, chapterData, onWordClick }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAboveCursor, setIsAboveCursor] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const verseBlockRef = useRef(null);

  // Функції для отримання значень
  const getWordText = (word) => {
    if (!word) return null;
    return getValue(word, "word") || getValue(word, "w") || null;
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

  // Отримання вірша за номером
  const getVerseData = (version, verseNumber) => {
    if (!adaptedData[version]) return null;
    const verse = adaptedData[version].find((v) => {
      const vNum = v.verse || v.v;
      return parseInt(vNum) === parseInt(verseNumber);
    });
    return verse;
  };

  // Отримання слів з вірша
  const getWordsFromVerse = (verseData) => {
    if (!verseData) return [];
    return getValue(verseData, "words") || getValue(verseData, "ws") || [];
  };

  // Адаптація даних
  const adaptedData = useMemo(() => {
    const result = {};
    if (!chapterData) return result;

    Object.keys(chapterData).forEach((key) => {
      const data = chapterData[key];
      const adapted = jsonAdapter(data);

      if (Array.isArray(adapted)) {
        result[key] = adapted.filter(
          (item) => item && typeof item === "object"
        );
      } else {
        result[key] = [];
      }
    });

    return result;
  }, [chapterData]);

  // Оновлення ширини контейнера
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Визначення головного оригіналу
  // Проблема: Ця логіка не враховує який оригінал є основним для поточної книги (NT/OT).
  // Наприклад, для OT потрібен THOT або LXX, але логіка може повернути TR якщо він є в pairs. Треба доопрацювати логіку!
  const mainOriginal = useMemo(() => {
    // Шукаємо серед пар оригінал
    for (const pair of pairs) {
      if (pair.original) {
        const origUpper = pair.original.toUpperCase();
        if (["TR", "GNT", "LXX", "THOT"].includes(origUpper)) {
          return pair.original;
        }
      }
    }
    return pairs[0]?.original || null;
  }, [pairs]);

  // Створення блоків слів для кожного вірша
  const createVerseBlocks = useMemo(() => {
    if (!pairs || pairs.length === 0 || !chapterData || !mainOriginal) {
      return [];
    }

    const blocks = [];
    let currentVerse = null;
    let currentPosition = 0;

    // Для кожного вірша в головному оригіналі
    // Проблема: Якщо обрано тільки переклади (наприклад, UBT без TR), то mainOriginal буде null і поверне порожній масив.
    const mainVerse = getVerseData(mainOriginal, verseNum);
    if (!mainVerse) return [];

    const mainWords = getWordsFromVerse(mainVerse);

    // Створюємо блоки для кожного слова
    mainWords.forEach((mainWord, wordIndex) => {
      const mainStrong = getStrongCode(mainWord);

      // Блок для цього слова
      const wordBlock = {
        id: `${verseNum}-${wordIndex}`,
        strong: mainStrong,
        position: currentPosition,
        versions: {},
      };

      // Додаємо головний оригінал
      wordBlock.versions[mainOriginal] = {
        text: getWordText(mainWord),
        word: mainWord,
        isOriginal: true,
      };

      // Додаємо інші версії
      pairs.forEach((pair) => {
        // Оригінали цієї групи
        if (pair.original && pair.original !== mainOriginal) {
          const verse = getVerseData(pair.original, verseNum);
          if (verse) {
            const words = getWordsFromVerse(verse);
            // Шукаємо слово за Strong кодом або індексом
            // Проблема: Цей підхід не враховує що переклади можуть мати іншу кількість слів або іншу структуру.
            // Співставлення тільки за Strong кодом або індексом недостатньо.
            let word = null;
            if (mainStrong) {
              word = words.find((w) => getStrongCode(w) === mainStrong);
            }
            if (!word && words[wordIndex]) {
              word = words[wordIndex];
            }
            if (word) {
              wordBlock.versions[pair.original] = {
                text: getWordText(word),
                word: word,
                isOriginal: true,
              };
            }
          }
        }

        // Переклади
        if (pair.translations) {
          pair.translations.forEach((translation) => {
            const verse = getVerseData(translation, verseNum);
            if (verse) {
              const words = getWordsFromVerse(verse);
              // Шукаємо слово за Strong кодом або індексом
              // Проблема: Цей підхід не враховує що переклади можуть мати іншу кількість слів або іншу структуру.
              // Співставлення тільки за Strong кодом або індексом недостатньо.
              let word = null;
              if (mainStrong) {
                word = words.find((w) => getStrongCode(w) === mainStrong);
              }
              if (!word && words[wordIndex]) {
                word = words[wordIndex];
              }
              if (word) {
                wordBlock.versions[translation] = {
                  text: getWordText(word),
                  word: word,
                  isOriginal: false,
                };
              }
            }
          });
        }
      });

      blocks.push(wordBlock);
      currentPosition++;
    });

    return blocks;
  }, [pairs, verseNum, chapterData, mainOriginal, adaptedData]);

  // Подія для курсора
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    // Визначаємо, чи курсор у верхній половині екрану
    setIsAboveCursor(e.clientY < window.innerHeight / 2);
  };

  // Клік на слово
  const handleWordClick = (word, version, strong, isOriginal) => {
    if (word && strong && onWordClick) {
      onWordClick({
        word: {
          word: getWordText(word),
          strong: strong,
          lemma: getLemma(word),
          morph: getMorph(word),
        },
        origVer: version,
        lang: strong.startsWith("H") ? "he" : "gr",
      });
    }
  };

  // Відображення слова з інтервалом
  const renderWord = (wordData, version, strong, isOriginal) => {
    if (!wordData || !wordData.text) {
      return (
        <span
          key={`empty-${version}`}
          className="empty-word"
          title="Відсутній відповідник"
        >
          —
        </span>
      );
    }

    return (
      <span
        key={`word-${version}`}
        className={`word ${isOriginal ? "original-word" : "translation-word"} ${
          wordData.word ? "clickable" : ""
        }`}
        onClick={() =>
          handleWordClick(wordData.word, version, strong, isOriginal)
        }
        onMouseEnter={() =>
          wordData.word &&
          setHoveredWord({ ...wordData, strong, version, isOriginal })
        }
        onMouseLeave={() => setHoveredWord(null)}
        title={strong ? `Strong: ${strong}` : ""}
      >
        {wordData.text}
      </span>
    );
  };

  if (!pairs || pairs.length === 0 || !chapterData) {
    return (
      <div className="interlinear-verse">
        <div className="verse-number">{verseNum}</div>
        <div className="words-grid text-muted">Дані для вірша відсутні</div>
      </div>
    );
  }

  return (
    <div
      className="interlinear-verse flex-layout"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      // data-verse={verseNum}
    >
      {/* <div className="verse-number">{verseNum}</div> */}

      <div className="verse-content" ref={verseBlockRef} data-verse={verseNum}>
        <div className="verse-number">{verseNum}</div>
        {createVerseBlocks.map((block, blockIndex) => (
          <div
            key={block.id}
            className="word-block"
            data-strong={block.strong}
            data-position={block.position}
          >
            {/* Рядок з версіями для цього слова */}
            <div className="version-row">
              {/* Версії відображаються вертикально під словом */}
              {Object.entries(block.versions).map(([version, wordData]) => (
                <div
                  key={`${block.id}-${version}`}
                  className={`word-version ${
                    wordData.isOriginal
                      ? "original-version"
                      : "translation-version"
                  }`}
                >
                  {/* <span className="version-label">[{version}]</span> */}
                  {renderWord(
                    wordData,
                    version,
                    block.strong,
                    wordData.isOriginal
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Плаваюча підказка */}
      {hoveredWord && hoveredWord.word && (
        <div
          ref={tooltipRef}
          className="floating-tooltip"
          style={{
            left: `${mousePos.x + 10}px`,
            top: isAboveCursor
              ? `${mousePos.y + 20}px`
              : `${mousePos.y - 120}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="tooltip-header">
            <strong className="strong-code">{hoveredWord.strong}</strong>
            <span className="version-badge">[{hoveredWord.version}]</span>
          </div>
          <div className="tooltip-body">
            <div className="word-text">{hoveredWord.text}</div>
            {getLemma(hoveredWord.word) && (
              <div className="word-lemma">
                Лема: {getLemma(hoveredWord.word)}
              </div>
            )}
            {getMorph(hoveredWord.word) && (
              <div className="word-morph">
                Морф: {getMorph(hoveredWord.word)}
              </div>
            )}
          </div>
          <div className="tooltip-footer">
            <small>Клік для відкриття словника</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;

// --------------------------- 27.12.25-version - потокова версія замість Флекс-версія
