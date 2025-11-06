// InterlinearVerse.js

// import React, { useState, useRef, useEffect } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({
//   verseNum,
//   version1,
//   version2,
//   onWordClick,
//   lxxWords,
//   uttWords,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   //   const [origWords, setOrigWords] = useState([]); // version1 (оригінал)
//   //   const [transWords, setTransWords] = useState([]); // version2 (переклад)

//   // НЕ завантажуємо дані — вони вже є в пропсах
//   const [origWords, setOrigWords] = useState(lxxWords);
//   const [transWords, setTransWords] = useState(uttWords);

//   // === ВИЗНАЧЕННЯ ШЛЯХУ ===
//   const getPath = (version, isOriginal) => {
//     const base = isOriginal ? "originals" : "translations";
//     const lower = version.toLowerCase();
//     return `/data/${base}/${lower}/OldT/GEN/gen1_${lower}.json`;
//   };

//   // ← Використовуємо пропси
//   useEffect(() => {
//     setOrigWords(lxxWords);
//     setTransWords(uttWords);
//   }, [lxxWords, uttWords]);

//   // === ВИРІВНЮВАННЯ ПО STRONG'S ===
//   const alignedWords = [];
//   const strongMap = new Map();

//   origWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
//   });
//   transWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), trans: w });
//   });

//   strongMap.forEach((pair, strong) => {
//     alignedWords.push({
//       strong,
//       orig: pair.orig || { word: "—", strong: null },
//       trans: pair.trans || { word: "—", strong: null },
//     });
//   });

//   // Сортування за порядком в оригіналі
//   alignedWords.sort((a, b) => {
//     const idxA = origWords.findIndex((w) => w.strong === a.strong);
//     const idxB = origWords.findIndex((w) => w.strong === b.strong);
//     return idxA !== -1 ? idxA - idxB : 1;
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
//           const hasStrong = pair.orig.strong || pair.trans.strong;
//           const translation = pair.trans.strong
//             ? pair.trans.word
//             : pair.orig.word;

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
//                 style={{ cursor: pair.orig.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.orig.strong &&
//                   onWordClick({
//                     word: pair.orig,
//                     lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
//                     translation,
//                   })
//                 }
//               >
//                 {pair.orig.word}
//               </span>

//               <span
//                 className="trans-word"
//                 style={{ cursor: pair.trans.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.trans.strong &&
//                   onWordClick({
//                     word: pair.trans,
//                     lang: "uk",
//                     translation,
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
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             pointerEvents: "none",
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.pair.orig.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
//                 {hoveredWord.pair.orig.word}
//                 {hoveredWord.pair.orig.lemma &&
//                   ` (${hoveredWord.pair.orig.lemma})`}
//               </div>
//             )}
//             {hoveredWord.pair.trans.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
//                 {hoveredWord.pair.trans.word}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {hoveredWord.pair.trans.strong
//                 ? hoveredWord.pair.trans.word
//                 : hoveredWord.pair.orig.word}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// //work version
// export default InterlinearVerse;

// InterlinearVerse.js 06.11.2025

// import React, { useState, useRef, useEffect } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({
//   verseNum,
//   version1, // Оригінал (якщо null, використовуємо version2)
//   version2, // Переклад (якщо null, показуємо тільки orig)
//   onWordClick,
//   // Видалив lxxWords, uttWords — тепер лоадимо динамічно
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   const [origWords, setOrigWords] = useState([]);
//   const [transWords, setTransWords] = useState([]);
//   const [isOrig1, setIsOrig1] = useState(false);
//   const [isOrig2, setIsOrig2] = useState(false);

//   // === ВИЗНАЧЕННЯ ШЛЯХУ ===
//   const getPath = (version, book = "GEN", chapter = 1) => {
//     // Додано book/chapter для гнучкості, припустимо GEN1
//     const lower = version.toLowerCase();
//     const base = ["THOT", "LXX"].includes(version)
//       ? "originals"
//       : "translations"; // ← Узагальнено без features (якщо є translations.json в пропсах, але поки хардкод)
//     return `/data/${base}/${lower}/OldT/${book}/${book.toLowerCase()}${chapter}_${lower}.json`;
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsOrig1(version1 && ["THOT", "LXX"].includes(version1)); // ← Перевірка на оригінал
//         setIsOrig2(version2 && ["THOT", "LXX"].includes(version2));

//         // ← НОВЕ: якщо тільки одна версія
//         if (!version1 && !version2) {
//           console.error("No versions selected");
//           return;
//         }

//         let data1 = [],
//           data2 = [];
//         if (version1) {
//           const res1 = await fetch(getPath(version1));
//           data1 = await res1.json();
//         }
//         if (version2) {
//           const res2 = await fetch(getPath(version2));
//           data2 = await res2.json();
//         }

//         // Знаходимо вірш
//         const verse1 = data1.find((v) => v.v === verseNum)?.words || [];
//         const verse2 = data2.find((v) => v.v === verseNum)?.words || [];

//         // ← НОВЕ: адаптація ролей
//         if (!version1) {
//           // Тільки version2: трактуємо як trans
//           setOrigWords([]);
//           setTransWords(verse2);
//         } else if (!version2) {
//           // Тільки version1: трактуємо як orig
//           setOrigWords(verse1);
//           setTransWords([]);
//         } else {
//           // Обидва
//           setOrigWords(verse1);
//           setTransWords(verse2);
//         }
//       } catch (err) {
//         console.error("Failed to load interlinear data:", err);
//         // ← Фолбек: показуємо тире
//         setOrigWords([]);
//         setTransWords([]);
//       }
//     };

//     loadData();
//   }, [verseNum, version1, version2]);

//   // === ВИРІВНЮВАННЯ ПО STRONG'S ===
//   const alignedWords = [];
//   const strongMap = new Map();

//   // Додаємо з orig
//   origWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, {
//         orig: w,
//         trans: strongMap.get(w.strong)?.trans,
//       });
//   });
//   // Додаємо з trans (якщо немає в orig)
//   transWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, {
//         trans: w,
//         orig: strongMap.get(w.strong)?.orig || { word: "—", strong: null },
//       });
//   });

//   strongMap.forEach((pair, strong) => {
//     alignedWords.push({
//       strong,
//       orig: pair.orig || { word: "—", strong: null },
//       trans: pair.trans || { word: "—", strong: null },
//     });
//   });

//   // Сортування за порядком в оригіналі або перекладі
//   alignedWords.sort((a, b) => {
//     let idxA = origWords.findIndex((w) => w.strong === a.strong);
//     let idxB = origWords.findIndex((w) => w.strong === b.strong);
//     if (idxA === -1) idxA = transWords.findIndex((w) => w.strong === a.strong);
//     if (idxB === -1) idxB = transWords.findIndex((w) => w.strong === b.strong);
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
//           const hasStrong = pair.orig.strong || pair.trans.strong;
//           const translation =
//             pair.trans.word !== "—" ? pair.trans.word : pair.orig.word;

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
//                 style={{
//                   cursor: pair.orig.strong ? "pointer" : "default",
//                   display: pair.orig.word === "—" ? "none" : "inline",
//                 }} // ← НОВЕ: ховаємо тире якщо відсутнє
//                 onClick={() =>
//                   pair.orig.strong &&
//                   onWordClick({
//                     word: pair.orig,
//                     lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
//                     translation,
//                   })
//                 }
//               >
//                 {pair.orig.word}
//               </span>

//               <span
//                 className="trans-word"
//                 style={{
//                   cursor: pair.trans.strong ? "pointer" : "default",
//                   display: pair.trans.word === "—" ? "none" : "inline",
//                 }} // ← НОВЕ: ховаємо тире
//                 onClick={() =>
//                   pair.trans.strong &&
//                   onWordClick({
//                     word: pair.trans,
//                     lang: "uk",
//                     translation,
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
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             pointerEvents: "none",
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.pair.orig.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
//                 {hoveredWord.pair.orig.word}
//                 {hoveredWord.pair.orig.lemma &&
//                   ` (${hoveredWord.pair.orig.lemma})`}
//               </div>
//             )}
//             {hoveredWord.pair.trans.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
//                 {hoveredWord.pair.trans.word}
//               </div>
//             )}
//             <div className="translation">
//               →{" "}
//               {hoveredWord.pair.trans.word !== "—"
//                 ? hoveredWord.pair.trans.word
//                 : hoveredWord.pair.orig.word}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// InterlinearVerse.js 06.11.2025
// import React, { useState, useRef, useEffect } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({
//   verseNum,
//   origWords, // Слова оригіналу (якщо [], показуємо тільки trans з тире в orig)
//   transWords, // Слова перекладу (якщо [], показуємо тільки orig з тире в trans)
//   onWordClick,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // === ВИРІВНЮВАННЯ ПО STRONG'S ===
//   const alignedWords = [];
//   const strongMap = new Map();

//   origWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
//   });
//   transWords.forEach((w) => {
//     if (w.strong)
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
//     let idxA = origWords.findIndex((w) => w.strong === a.strong);
//     let idxB = origWords.findIndex((w) => w.strong === b.strong);
//     if (idxA === -1) idxA = transWords.findIndex((w) => w.strong === a.strong);
//     if (idxB === -1) idxB = transWords.findIndex((w) => w.strong === b.strong);
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
//           const hasStrong = pair.orig.strong || pair.trans.strong;
//           const translation =
//             pair.trans.word !== "—" ? pair.trans.word : pair.orig.word;

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
//                 style={{ cursor: pair.orig.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.orig.strong &&
//                   onWordClick({
//                     word: pair.orig,
//                     lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
//                     translation,
//                   })
//                 }
//               >
//                 {pair.orig.word}
//               </span>

//               <span
//                 className="trans-word"
//                 style={{ cursor: pair.trans.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.trans.strong &&
//                   onWordClick({
//                     word: pair.trans,
//                     lang: "uk",
//                     translation,
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
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             pointerEvents: "none",
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)}
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.pair.orig.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
//                 {hoveredWord.pair.orig.word}
//                 {hoveredWord.pair.orig.lemma &&
//                   ` (${hoveredWord.pair.orig.lemma})`}
//               </div>
//             )}
//             {hoveredWord.pair.trans.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
//                 {hoveredWord.pair.trans.word}
//               </div>
//             )}
//             <div className="translation">→ {translation}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// // працює, але видає помилку при наведенні курсором на будь-яке слово тексту
// export default InterlinearVerse;

// -----------------------------------------------

import React, { useState, useRef, useEffect } from "react";
import "../styles/Interlinear.css";

const InterlinearVerse = ({
  verseNum,
  origWords, // Слова оригіналу (якщо [], показуємо тільки trans з тире в trans)
  transWords, // Слова перекладу (якщо [], показуємо тільки orig з тире в orig)
  onWordClick,
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const verseRef = useRef(null);

  // Запобіжник: якщо обидва порожні
  if (origWords.length === 0 && transWords.length === 0) {
    return (
      <div className="interlinear-verse">
        <div className="verse-number">{verseNum}</div>
        <div className="words-grid text-muted">Дані для вірша відсутні</div>
      </div>
    );
  }

  // === ВИРІВНЮВАННЯ ПО STRONG'S ===
  const alignedWords = [];
  const strongMap = new Map();

  origWords.forEach((w) => {
    if (w?.strong)
      // Запобіжник на undefined
      strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
  });
  transWords.forEach((w) => {
    if (w?.strong)
      strongMap.set(w.strong, { ...strongMap.get(w.strong), trans: w });
  });

  strongMap.forEach((pair, strong) => {
    alignedWords.push({
      strong,
      orig: pair.orig || { word: "—", strong: null },
      trans: pair.trans || { word: "—", strong: null },
    });
  });

  // Сортування за порядком в оригіналі або перекладі (якщо orig порожній)
  alignedWords.sort((a, b) => {
    let idxA = origWords.findIndex((w) => w?.strong === a.strong);
    let idxB = origWords.findIndex((w) => w?.strong === b.strong);
    if (idxA === -1) idxA = transWords.findIndex((w) => w?.strong === a.strong);
    if (idxB === -1) idxB = transWords.findIndex((w) => w?.strong === b.strong);
    return idxA - idxB;
  });

  const handleMouseMove = (e) => {
    if (!verseRef.current) return;
    const rect = verseRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="interlinear-verse"
      ref={verseRef}
      onMouseMove={handleMouseMove}
    >
      <div className="verse-number">{verseNum}</div>

      <div className="words-grid">
        {alignedWords.map((pair, i) => {
          const hasStrong = pair.orig?.strong || pair.trans?.strong;
          // Розрахунок translation тут, але не потрібно — для tooltip

          return (
            <div
              key={pair.strong || `empty-${i}`}
              className="word-pair"
              onMouseEnter={() =>
                hasStrong && setHoveredWord({ pair, index: i })
              }
              onMouseLeave={() => setHoveredWord(null)}
            >
              <span
                className="orig-word"
                style={{ cursor: pair.orig?.strong ? "pointer" : "default" }}
                onClick={() =>
                  pair.orig?.strong &&
                  onWordClick({
                    word: pair.orig,
                    lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
                    translation: pair.trans?.word || pair.orig.word,
                  })
                }
              >
                {pair.orig.word}
              </span>

              <span
                className="trans-word"
                style={{ cursor: pair.trans?.strong ? "pointer" : "default" }}
                onClick={() =>
                  pair.trans?.strong &&
                  onWordClick({
                    word: pair.trans,
                    lang: "uk",
                    translation: pair.trans.word || pair.orig?.word,
                  })
                }
              >
                {pair.trans.word}
              </span>
            </div>
          );
        })}
      </div>

      {/* === МОДАЛКА === */}
      {hoveredWord && (
        <div
          ref={tooltipRef}
          className="hover-tooltip"
          style={{
            position: "absolute",
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 80}px`,
            pointerEvents: "none",
            zIndex: 1000,
          }}
          onMouseEnter={() => setHoveredWord(hoveredWord)}
          onMouseLeave={() => setHoveredWord(null)}
        >
          <div className="tooltip-content">
            {hoveredWord.pair.orig?.strong && (
              <div>
                <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
                {hoveredWord.pair.orig.word}
                {hoveredWord.pair.orig.lemma &&
                  ` (${hoveredWord.pair.orig.lemma})`}
              </div>
            )}
            {hoveredWord.pair.trans?.strong && (
              <div>
                <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
                {hoveredWord.pair.trans.word}
              </div>
            )}
            <div className="translation">
              →{" "}
              {hoveredWord.pair.trans.word !== "—"
                ? hoveredWord.pair.trans.word
                : hoveredWord.pair.orig.word || "—"}{" "}
              {/* Фікс: розрахунок тут + запобіжник */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;
