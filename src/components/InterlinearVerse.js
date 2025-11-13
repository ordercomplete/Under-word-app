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
import React, { useState, useRef, useEffect } from "react";
import "../styles/Interlinear.css";

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

  return (
    <div
      className="interlinear-verse"
      ref={verseRef}
      onMouseMove={handleMouseMove}
    >
      <div className="verse-number">{verseNum}</div>

      <div className="pairs-vertical">
        {pairs.map((pair, pIndex) => {
          // console.log("Pair in InterlinearVerse:", pair); // ← Перевірте, чи є pair.origVer
          const origVerse = chapterData[pair.origVer]?.find(
            (v) => v?.v === verseNum
          );
          const transVerse = chapterData[pair.transVer]?.find(
            (v) => v?.v === verseNum
          );

          const origWords = origVerse?.words || [];
          const transWords = transVerse?.words || [];

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

          const alignedWords = [];
          const strongMap = new Map();

          origWords.forEach((w) => {
            if (w?.strong)
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

          alignedWords.sort((a, b) => {
            let idxA = origWords.findIndex((w) => w?.strong === a.strong);
            let idxB = origWords.findIndex((w) => w?.strong === b.strong);
            if (idxA === -1)
              idxA = transWords.findIndex((w) => w?.strong === a.strong);
            if (idxB === -1)
              idxB = transWords.findIndex((w) => w?.strong === b.strong);
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
                  // const hasStrong = pair.orig?.strong || pair.trans?.strong;
                  const hasStrong =
                    wordPair.orig?.strong || wordPair.trans?.strong;

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
                          cursor: wordPair.orig?.strong ? "pointer" : "default",
                        }}
                        onClick={() =>
                          wordPair.orig?.strong &&
                          onWordClick({
                            // word: pair.orig,
                            word: wordPair.orig,
                            origVer: pair.origVer, // ДОДАНО 13.11.25 в 15:59
                            // lang: pair.orig.strong.startsWith("H")
                            //   ? "he"
                            //   : "gr",
                            lang: wordPair.orig.strong.startsWith("H")
                              ? "he"
                              : "gr",
                            // translation: pair.trans?.word || pair.orig.word,
                            translation:
                              wordPair.trans?.word || wordPair.orig.word,
                          })
                        }
                      >
                        {/* {pair.orig.word} */}
                        {wordPair.orig.word}
                      </span>
                      {/* ПЕРЕКЛАД */}
                      <span
                        className="trans-word"
                        style={{
                          cursor: wordPair.trans?.strong
                            ? "pointer"
                            : "default",
                        }}
                        onClick={() =>
                          wordPair.trans?.strong &&
                          onWordClick({
                            // word: pair.trans,
                            word: wordPair.trans,
                            origVer: pair.origVer, // ДОДАНО: UTT → LXX, UBT → THOT 13.11.25 в 15:59
                            lang: "uk",
                            // translation: pair.trans.word || pair.orig?.word,
                            // translation: pair.trans.word,
                            translation: wordPair.trans.word,
                          })
                        }
                      >
                        {/* {pair.trans.word} */}
                        {wordPair.trans.word}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {/* {hoveredWord && (
        <div
          ref={tooltipRef}
          className="hover-tooltip"
          style={{
            position: "fixed",
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 80}px`,
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
                : hoveredWord.pair.orig.word || "—"}
            </div>
          </div>
        </div>
      )} */}

      {hoveredWord && hoveredWord.wordPair && (
        <div
          ref={tooltipRef}
          className="hover-tooltip"
          style={{
            position: "fixed",
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 80}px`,
          }}
          onMouseEnter={() => setHoveredWord(hoveredWord)}
          onMouseLeave={() => setHoveredWord(null)}
        >
          <div className="tooltip-content">
            {hoveredWord.wordPair.orig?.strong && (
              <div>
                <strong>{hoveredWord.wordPair.orig.strong}</strong>:{" "}
                {hoveredWord.wordPair.orig.word}
                {hoveredWord.wordPair.orig.lemma &&
                  ` (${hoveredWord.wordPair.orig.lemma})`}
              </div>
            )}
            {hoveredWord.wordPair.trans?.strong && (
              <div>
                <strong>{hoveredWord.wordPair.trans.strong}</strong>:{" "}
                {hoveredWord.wordPair.trans.word}
              </div>
            )}
            <div className="translation">
              →{" "}
              {hoveredWord.wordPair.trans?.word !== "—"
                ? hoveredWord.wordPair.trans?.word
                : hoveredWord.wordPair.orig?.word || "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearVerse;
