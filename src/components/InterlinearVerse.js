// import React, { useState } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({ verse, showUtt, onWordClick }) => {
//   if (!verse) return null;

//   return (
//     <div className="interlinear-verse">
//       {/* Грецький рядок */}
//       <div className="gr-line">
//         {verse.map((pair, i) => (
//           <span
//             key={`gr-${i}`}
//             className="gr-word"
//             onClick={() => pair.gr.strong && onWordClick(pair.gr, "gr")}
//             style={{ opacity: pair.gr.word === "—" ? 0.3 : 1 }}
//           >
//             {pair.gr.word}
//           </span>
//         ))}
//       </div>

//       {/* Український рядок */}
//       {showUtt && (
//         <div className="uk-line">
//           {verse.map((pair, i) => (
//             <span
//               key={`uk-${i}`}
//               className="uk-word"
//               onClick={() => pair.uk.strong && onWordClick(pair.uk, "uk")}
//               style={{ opacity: pair.uk.word === "—" ? 0.3 : 1 }}
//             >
//               {pair.uk.word}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// import React, { useState } from "react";
// import "../styles/Interlinear.css";
// const InterlinearVerse = ({ verseNum, lxxWords, uttWords, onWordClick }) => {
//   const maxWords = Math.max(lxxWords.length, uttWords.length);
//   const aligned = [];

//   for (let i = 0; i < maxWords; i++) {
//     const lxx = lxxWords[i] || { word: "—", strong: null };
//     const utt = uttWords[i] || { word: "—", strong: null };

//     aligned.push({ lxx, utt });
//   }

//   return (
//     <div className="interlinear-verse">
//       <div className="verse-number">{verseNum}</div>
//       <div className="words-grid">
//         {aligned.map((pair, i) => (
//           <div key={i} className="word-pair">
//             <span
//               className="gr-word"
//               onClick={() => pair.lxx.strong && onWordClick(pair.lxx, "gr")}
//               title={pair.lxx.strong || ""}
//             >
//               {pair.lxx.word}
//             </span>
//             <span
//               className="uk-word"
//               onClick={() => pair.utt.strong && onWordClick(pair.utt, "uk")}
//               title={pair.utt.strong || ""}
//             >
//               {pair.utt.word}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InterlinearVerse;

// import React, { useState } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({
//   verseNum,
//   lxxWords,
//   uttWords,
//   onWordClick,
//   onWordHover,
// }) => {
//   const [hoveredPair, setHoveredPair] = useState(null);

//   const maxWords = Math.max(lxxWords.length, uttWords.length);
//   const aligned = [];

//   for (let i = 0; i < maxWords; i++) {
//     const lxx = lxxWords[i] || { word: "—", strong: null };
//     const utt = uttWords[i] || { word: "—", strong: null };

//     let translation = null;
//     if (lxx.strong && utt.strong === lxx.strong) {
//       translation = utt.word;
//     } else if (utt.strong && lxx.strong === utt.strong) {
//       translation = lxx.word;
//     }

//     aligned.push({
//       lxx,
//       utt,
//       translation: translation || (lxx.strong ? utt.word : lxx.word),
//     });
//   }
//   // додано початок Замість фіксованого left — використовуємо ref + getBoundingClientRect
//   const verseRef = useRef(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e) => {
//     if (!verseRef.current) return;
//     const rect = verseRef.current.getBoundingClientRect();
//     setMousePos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };
//   //   додано кінець

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>
//       <div className="words-grid">
//         {aligned.map((pair, i) => (
//           <div
//             key={i}
//             className="word-pair"
//             onMouseEnter={() => {
//               if (pair.lxx.strong || pair.utt.strong) {
//                 setHoveredPair({ pair, index: i });
//                 onWordHover?.({ pair, index: i });
//               }
//             }}
//             onMouseLeave={() => {
//               setHoveredPair(null);
//               onWordHover?.(null);
//             }}
//           >
//             <span
//               className="gr-word"
//               onClick={() =>
//                 pair.lxx.strong &&
//                 onWordClick({
//                   word: pair.lxx,
//                   lang: "gr",
//                   translation: pair.translation,
//                 })
//               }
//             >
//               {pair.lxx.word}
//             </span>
//             <span
//               className="uk-word"
//               onClick={() =>
//                 pair.utt.strong &&
//                 onWordClick({
//                   word: pair.utt,
//                   lang: "uk",
//                   translation: pair.translation,
//                 })
//               }
//             >
//               {pair.utt.word}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Модалка при наведенні */}
//       {hoveredPair && (
//         <div
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 60}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredPair.pair.lxx.strong && (
//               <div>
//                 <strong>{hoveredPair.pair.lxx.strong}</strong>{" "}
//                 {hoveredPair.pair.lxx.word}
//               </div>
//             )}
//             {hoveredPair.pair.utt.strong && (
//               <div>
//                 <strong>{hoveredPair.pair.utt.strong}</strong>{" "}
//                 {hoveredPair.pair.utt.word}
//               </div>
//             )}
//             {hoveredPair.pair.translation && (
//               <div className="translation">
//                 → {hoveredPair.pair.translation}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// src/components/InterlinearVerse.js
// import React, { useState, useRef } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({ verseNum, lxxWords, uttWords, onWordClick }) => {
//   const [hoveredPair, setHoveredPair] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const verseRef = useRef(null);

//   const handleMouseMove = (e) => {
//     if (!verseRef.current) return;
//     const rect = verseRef.current.getBoundingClientRect();
//     setMousePos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };

//   const maxWords = Math.max(lxxWords.length, uttWords.length);
//   const aligned = [];

//   for (let i = 0; i < maxWords; i++) {
//     const lxx = lxxWords[i] || { word: "—", strong: null };
//     const utt = uttWords[i] || { word: "—", strong: null };

//     let translation = null;
//     if (lxx.strong && utt.strong === lxx.strong) {
//       translation = utt.word;
//     } else if (utt.strong && lxx.strong === utt.strong) {
//       translation = lxx.word;
//     }

//     aligned.push({ lxx, utt, translation });
//   }

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>
//       <div className="words-grid">
//         {aligned.map((pair, i) => (
//           <div
//             key={i}
//             className="word-pair"
//             onMouseEnter={() => {
//               if (pair.lxx.strong || pair.utt.strong) {
//                 setHoveredPair({ pair, index: i });
//               }
//             }}
//             onMouseLeave={() => setHoveredPair(null)}
//           >
//             <span
//               className="gr-word"
//               onClick={() =>
//                 pair.lxx.strong &&
//                 onWordClick({
//                   word: pair.lxx,
//                   lang: "gr",
//                   translation: pair.translation,
//                 })
//               }
//             >
//               {pair.lxx.word}
//             </span>
//             <span
//               className="uk-word"
//               onClick={() =>
//                 pair.utt.strong &&
//                 onWordClick({
//                   word: pair.utt,
//                   lang: "uk",
//                   translation: pair.translation,
//                 })
//               }
//             >
//               {pair.utt.word}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Модалка при наведенні */}
//       {hoveredPair && (
//         <div
//           className="hover-tooltip"
//           style={{
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 60}px`,
//           }}
//         >
//           <div className="tooltip-content">
//             {hoveredPair.pair.lxx.strong && (
//               <div>
//                 <strong>{hoveredPair.pair.lxx.strong}</strong>{" "}
//                 {hoveredPair.pair.lxx.word}
//               </div>
//             )}
//             {hoveredPair.pair.utt.strong && (
//               <div>
//                 <strong>{hoveredPair.pair.utt.strong}</strong>{" "}
//                 {hoveredPair.pair.utt.word}
//               </div>
//             )}
//             {hoveredPair.pair.translation && (
//               <div className="translation">
//                 → {hoveredPair.pair.translation}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// import React, { useState, useRef } from "react";
// import "../styles/Interlinear.css";

// const InterlinearVerse = ({ verseNum, lxxWords, uttWords, onWordClick }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);
//   const verseRef = useRef(null);

//   // Оновлення позиції курсору
//   const handleMouseMove = (e) => {
//     if (!verseRef.current) return;
//     const rect = verseRef.current.getBoundingClientRect();
//     setMousePos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };

//   // === ВИРІВНЮВАННЯ ПО STRONG'S ===
//   const alignedWords = [];
//   const strongMap = new Map(); // strong -> { lxx, utt }

//   // Заповнюємо мапу
//   lxxWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), lxx: w });
//   });
//   uttWords.forEach((w) => {
//     if (w.strong)
//       strongMap.set(w.strong, { ...strongMap.get(w.strong), utt: w });
//   });

//   // Додаємо всі Strong's, навіть без пари
//   strongMap.forEach((pair, strong) => {
//     alignedWords.push({
//       strong,
//       lxx: pair.lxx || { word: "—", strong: null },
//       utt: pair.utt || { word: "—", strong: null },
//     });
//   });

//   // Сортуємо за порядком у LXX (або можна за UT)
//   alignedWords.sort((a, b) => {
//     const idxA = lxxWords.findIndex((w) => w.strong === a.strong);
//     const idxB = lxxWords.findIndex((w) => w.strong === b.strong);
//     return idxA - idxB;
//   });

//   return (
//     <div
//       className="interlinear-verse"
//       ref={verseRef}
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-number">{verseNum}</div>

//       <div className="words-grid">
//         {alignedWords.map((pair, i) => {
//           const hasStrong = pair.lxx.strong || pair.utt.strong;
//           const translation = pair.utt.strong ? pair.utt.word : pair.lxx.word;

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
//                 className="gr-word"
//                 style={{ cursor: pair.lxx.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.lxx.strong &&
//                   onWordClick({
//                     word: pair.lxx,
//                     lang: "gr",
//                     translation,
//                   })
//                 }
//               >
//                 {pair.lxx.word}
//               </span>

//               <span
//                 className="uk-word"
//                 style={{ cursor: pair.utt.strong ? "pointer" : "default" }}
//                 onClick={() =>
//                   pair.utt.strong &&
//                   onWordClick({
//                     word: pair.utt,
//                     lang: "uk",
//                     translation,
//                   })
//                 }
//               >
//                 {pair.utt.word}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* === СТАБІЛЬНА МОДАЛКА === */}
//       {hoveredWord && (
//         <div
//           ref={tooltipRef}
//           className="hover-tooltip"
//           style={{
//             position: "absolute",
//             left: `${mousePos.x + 15}px`,
//             top: `${mousePos.y - 80}px`,
//             pointerEvents: "none", // Важливо! Не блокує mouseleave
//             zIndex: 1000,
//           }}
//           onMouseEnter={() => setHoveredWord(hoveredWord)} // Утримуємо
//           onMouseLeave={() => setHoveredWord(null)}
//         >
//           <div className="tooltip-content">
//             {hoveredWord.pair.lxx.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.lxx.strong}</strong>:{" "}
//                 {hoveredWord.pair.lxx.word}
//               </div>
//             )}
//             {hoveredWord.pair.utt.strong && (
//               <div>
//                 <strong>{hoveredWord.pair.utt.strong}</strong>:{" "}
//                 {hoveredWord.pair.utt.word}
//               </div>
//             )}
//             {(hoveredWord.pair.lxx.strong || hoveredWord.pair.utt.strong) && (
//               <div className="translation">
//                 →{" "}
//                 {hoveredWord.pair.utt.strong
//                   ? hoveredWord.pair.utt.word
//                   : hoveredWord.pair.lxx.word}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

import React, { useState, useRef, useEffect } from "react";
import "../styles/Interlinear.css";

const InterlinearVerse = ({
  verseNum,
  version1,
  version2,
  onWordClick,
  lxxWords,
  uttWords,
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const verseRef = useRef(null);

  //   const [origWords, setOrigWords] = useState([]); // version1 (оригінал)
  //   const [transWords, setTransWords] = useState([]); // version2 (переклад)

  // НЕ завантажуємо дані — вони вже є в пропсах
  const [origWords, setOrigWords] = useState(lxxWords);
  const [transWords, setTransWords] = useState(uttWords);

  // === ВИЗНАЧЕННЯ ШЛЯХУ ===
  const getPath = (version, isOriginal) => {
    const base = isOriginal ? "originals" : "translations";
    const lower = version.toLowerCase();
    return `/data/${base}/${lower}/OldT/GEN/gen1_${lower}.json`;
  };

  //   useEffect(() => {
  //     const loadData = async () => {
  //       try {
  //         const isOrig1 = ["THOT", "LXX"].includes(version1);
  //         const isOrig2 = ["THOT", "LXX"].includes(version2);

  //         const [res1, res2] = await Promise.all([
  //           fetch(getPath(version1, isOrig1)),
  //           fetch(getPath(version2, isOrig2)),
  //         ]);

  //         const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

  //         const verse1 = data1.find((v) => v.v === verseNum)?.words || [];
  //         const verse2 = data2.find((v) => v.v === verseNum)?.words || [];

  //         setOrigWords(verse1);
  //         setTransWords(verse2);
  //       } catch (err) {
  //         console.error("Failed to load interlinear data:", err);
  //       }
  //     };

  //     loadData();
  //   }, [verseNum, version1, version2]);

  // ← Використовуємо пропси
  useEffect(() => {
    setOrigWords(lxxWords);
    setTransWords(uttWords);
  }, [lxxWords, uttWords]);

  // === ВИРІВНЮВАННЯ ПО STRONG'S ===
  const alignedWords = [];
  const strongMap = new Map();

  origWords.forEach((w) => {
    if (w.strong)
      strongMap.set(w.strong, { ...strongMap.get(w.strong), orig: w });
  });
  transWords.forEach((w) => {
    if (w.strong)
      strongMap.set(w.strong, { ...strongMap.get(w.strong), trans: w });
  });

  strongMap.forEach((pair, strong) => {
    alignedWords.push({
      strong,
      orig: pair.orig || { word: "—", strong: null },
      trans: pair.trans || { word: "—", strong: null },
    });
  });

  // Сортування за порядком в оригіналі
  alignedWords.sort((a, b) => {
    const idxA = origWords.findIndex((w) => w.strong === a.strong);
    const idxB = origWords.findIndex((w) => w.strong === b.strong);
    return idxA !== -1 ? idxA - idxB : 1;
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
          const hasStrong = pair.orig.strong || pair.trans.strong;
          const translation = pair.trans.strong
            ? pair.trans.word
            : pair.orig.word;

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
                style={{ cursor: pair.orig.strong ? "pointer" : "default" }}
                onClick={() =>
                  pair.orig.strong &&
                  onWordClick({
                    word: pair.orig,
                    lang: pair.orig.strong.startsWith("H") ? "he" : "gr",
                    translation,
                  })
                }
              >
                {pair.orig.word}
              </span>

              <span
                className="trans-word"
                style={{ cursor: pair.trans.strong ? "pointer" : "default" }}
                onClick={() =>
                  pair.trans.strong &&
                  onWordClick({
                    word: pair.trans,
                    lang: "uk",
                    translation,
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
            {hoveredWord.pair.orig.strong && (
              <div>
                <strong>{hoveredWord.pair.orig.strong}</strong>:{" "}
                {hoveredWord.pair.orig.word}
                {hoveredWord.pair.orig.lemma &&
                  ` (${hoveredWord.pair.orig.lemma})`}
              </div>
            )}
            {hoveredWord.pair.trans.strong && (
              <div>
                <strong>{hoveredWord.pair.trans.strong}</strong>:{" "}
                {hoveredWord.pair.trans.word}
              </div>
            )}
            <div className="translation">
              →{" "}
              {hoveredWord.pair.trans.strong
                ? hoveredWord.pair.trans.word
                : hoveredWord.pair.orig.word}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;
