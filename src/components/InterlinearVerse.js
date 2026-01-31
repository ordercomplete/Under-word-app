// // src/components/InterlinearVerse.js - ОНОВЛЕНА ВЕРСІЯ 12.01.2026
// import React, {
//   useState,
//   useRef,
//   useMemo,
//   useEffect,
//   useCallback,
// } from "react";
// import "../styles/Interlinear.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";

// const InterlinearVerse = ({
//   verseNum,
//   pairs,
//   chapterData,
//   onWordClick,
//   isFirstInChapter = false,
// }) => {
//   // console.log(`[InterlinearVerse ${verseNum}] Пари:`, pairs);

//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [isAboveCursor, setIsAboveCursor] = useState(false);
//   const tooltipRef = useRef(null);
//   const containerRef = useRef(null);
//   const verseBlockRef = useRef(null);

//   // ==================== БАЗОВІ ФУНКЦІЇ ====================

//   const getWordText = useCallback((word) => {
//     if (!word) return null;
//     return getValue(word, "word") || getValue(word, "w") || null;
//   }, []);

//   const getStrongCode = useCallback((word, version = null) => {
//     if (!word) return null;

//     let strong = getValue(word, "strong") || getValue(word, "s") || null;

//     // Корекція для THOT: якщо код починається з G, змінити на H
//     if (version === "THOT" && strong && strong.startsWith("G")) {
//       strong = "H" + strong.substring(1);
//     }

//     return strong;
//   }, []);

//   const getLemma = useCallback((word) => {
//     if (!word) return null;
//     return getValue(word, "lemma") || getValue(word, "l") || null;
//   }, []);

//   const getMorph = useCallback((word) => {
//     if (!word) return null;
//     return getValue(word, "morph") || getValue(word, "m") || null;
//   }, []);

//   const getWordsFromVerse = useCallback((verseData) => {
//     if (!verseData) return [];
//     return getValue(verseData, "words") || getValue(verseData, "ws") || [];
//   }, []);

//   // ==================== ОНОВЛЕНА ФУНКЦІЯ СПІВСТАВЛЕННЯ ====================

//   const alignWordsAdvanced = useCallback(
//     (originalVerse, translationVerse, originalVersion, translationCode) => {
//       console.log(`🔍 Вирівнювання: ${originalVersion} → ${translationCode}`);

//       const aligned = [];
//       const origWords = getWordsFromVerse(originalVerse);
//       const transWords = getWordsFromVerse(translationVerse);

//       // Створюємо мапу перекладів для швидкого пошуку за Strong кодом
//       const translationMap = new Map();

//       // Групуємо переклади за Strong кодом
//       transWords.forEach((transWord, index) => {
//         const strong = getStrongCode(transWord, translationCode);
//         if (strong) {
//           if (!translationMap.has(strong)) {
//             translationMap.set(strong, []);
//           }
//           translationMap.get(strong).push({ word: transWord, index });
//         }
//       });

//       origWords.forEach((origWord, origIndex) => {
//         const origStrong = getStrongCode(origWord, originalVersion);
//         const origMorph = getMorph(origWord);

//         let matchedWord = null;
//         let matchedIndex = -1;

//         if (origStrong && translationMap.has(origStrong)) {
//           // Знайшли слова з таким самим Strong кодом
//           const candidates = translationMap.get(origStrong);

//           // Спробуємо знайти за морфологією
//           for (const candidate of candidates) {
//             if (!origMorph || getMorph(candidate.word) === origMorph) {
//               matchedWord = candidate.word;
//               matchedIndex = candidate.index;
//               break;
//             }
//           }

//           // Якщо не знайшли за морфологією, беремо перше
//           if (!matchedWord && candidates.length > 0) {
//             matchedWord = candidates[0].word;
//             matchedIndex = candidates[0].index;
//           }

//           // Видаляємо використаного кандидата з мапи
//           if (matchedIndex !== -1) {
//             const updatedCandidates = candidates.filter(
//               (c) => c.index !== matchedIndex
//             );
//             if (updatedCandidates.length > 0) {
//               translationMap.set(origStrong, updatedCandidates);
//             } else {
//               translationMap.delete(origStrong);
//             }
//           }
//         }

//         if (matchedWord) {
//           // console.log(`✅ Співставлено за Strong: ${origStrong}`, {
//           //   оригінал: getWordText(origWord),
//           //   переклад: getWordText(matchedWord),
//           // });

//           aligned.push({
//             original: origWord,
//             translation: matchedWord,
//             alignedBy: "strong",
//           });
//         } else {
//           // Якщо не знайдено за Strong - показуємо тире
//           // console.log(`❌ Немає відповідника за Strong: ${origStrong}`);
//           aligned.push({
//             original: origWord,
//             translation: null,
//             alignedBy: "none",
//           });
//         }
//       });

//       return aligned;
//     },
//     [getWordText, getStrongCode, getMorph, getWordsFromVerse]
//   );
//   // ==================== ОТРИМАННЯ ДАНИХ ====================

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

//   const getVerseData = useCallback(
//     (version, verseNumber) => {
//       if (!adaptedData[version]) return null;
//       const verse = adaptedData[version].find((v) => {
//         const vNum = v.verse || v.v;
//         return parseInt(vNum) === parseInt(verseNumber);
//       });
//       return verse;
//     },
//     [adaptedData]
//   );

//   // ==================== СТВОРЕННЯ БЛОКІВ СЛІВ ====================

//   const createVerseBlocks = useMemo(() => {
//     if (!pairs || pairs.length === 0 || !chapterData) {
//       console.log(`📭 Немає пар або даних для вірша ${verseNum}`);
//       return [];
//     }

//     console.log(`🔧 Створення блоків для вірша ${verseNum}`, {
//       пар: pairs.length,
//       дані: Object.keys(chapterData),
//     });

//     const wordBlocks = [];
//     const processedTranslations = new Set();

//     // Обробляємо кожну пару
//     pairs.forEach((pair, pairIndex) => {
//       console.log(`🔄 Обробка пари ${pairIndex}:`, {
//         оригінал: pair.original,
//         переклади: pair.translations,
//         заповіт: pair.testament,
//       });

//       if (!pair.original) {
//         console.log(`⚠️ Пара ${pairIndex} не має оригіналу`);
//         return;
//       }

//       const origVerse = getVerseData(pair.original, verseNum);
//       if (!origVerse) {
//         console.log(
//           `❌ Оригінал ${pair.original} не знайдено для вірша ${verseNum}`
//         );
//         return;
//       }

//       // Обробляємо оригінал
//       const origWords = getWordsFromVerse(origVerse);

//       // Створюємо початкові блоки з оригіналу
//       origWords.forEach((origWord, wordIndex) => {
//         const blockId = `${verseNum}-${wordIndex}`;

//         if (!wordBlocks[wordIndex]) {
//           wordBlocks[wordIndex] = {
//             id: blockId,
//             strong: getStrongCode(origWord, pair.original),
//             versions: {},
//             position: wordIndex,
//           };
//         }

//         // Зберігаємо оригінал
//         wordBlocks[wordIndex].versions[pair.original] = {
//           text: getWordText(origWord),
//           word: origWord,
//           isOriginal: true,
//           version: pair.original,
//         };
//       });

//       // Обробляємо переклади для цієї пари
//       if (pair.translations && pair.translations.length > 0) {
//         pair.translations.forEach((transCode) => {
//           // Перевіряємо, чи вже обробляли цей переклад
//           const translationKey = `${pair.original}-${transCode}`;
//           if (processedTranslations.has(translationKey)) {
//             console.log(
//               `⏭️ Переклад ${transCode} вже оброблено для ${pair.original}`
//             );
//             return;
//           }

//           const transVerse = getVerseData(transCode, verseNum);
//           if (!transVerse) {
//             console.log(`❌ Переклад ${transCode} не знайдено`);
//             return;
//           }

//           // Виконуємо розширене вирівнювання
//           const aligned = alignWordsAdvanced(
//             origVerse,
//             transVerse,
//             pair.original,
//             transCode
//           );

//           // Зберігаємо результати
//           aligned.forEach((item, idx) => {
//             if (!wordBlocks[idx]) {
//               console.warn(`⚠️ Немає блоку для індексу ${idx}`);
//               return;
//             }

//             wordBlocks[idx].versions[transCode] = {
//               text: item.translation ? getWordText(item.translation) : null,
//               word: item.translation,
//               isOriginal: false,
//               version: transCode,
//               alignedBy: item.alignedBy,
//             };
//           });

//           processedTranslations.add(translationKey);
//         });
//       }
//     });

//     // Фільтруємо порожні блоки та додаємо відсутні переклади
//     const filteredBlocks = wordBlocks.filter(
//       (block) => block && block.versions
//     );

//     console.log(
//       `✅ Створено блоків: ${filteredBlocks.length} для вірша ${verseNum}`
//     );
//     return filteredBlocks;
//   }, [
//     pairs,
//     verseNum,
//     chapterData,
//     getVerseData,
//     getWordsFromVerse,
//     getWordText,
//     getStrongCode,
//     alignWordsAdvanced,
//   ]);

//   // ==================== ОНОВЛЕННЯ ШИРИНИ ====================

//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         setContainerWidth(containerRef.current.offsetWidth);
//       }
//     };

//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   // ==================== ОБРОБНИКИ ПОДІЙ ====================

//   const handleMouseMove = useCallback((e) => {
//     setMousePos({ x: e.clientX, y: e.clientY });
//     setIsAboveCursor(e.clientY < window.innerHeight / 2);
//   }, []);

//   // В `handleWordClick` додаємо отримання словникового коду:
//   const handleWordClick = useCallback(
//     (word, version, strong, isOriginal) => {
//       if (word && onWordClick) {
//         // Отримуємо словниковий код з даних слова
//         const dictCode = getValue(word, "dict") || null;

//         onWordClick({
//           word: {
//             word: getWordText(word),
//             strong: strong,
//             lemma: getLemma(word),
//             morph: getMorph(word),
//             dict: dictCode, // ← ДОДАЄМО словниковий код
//           },
//           origVer: version,
//           lang: strong?.startsWith("H") ? "he" : "gr",
//         });
//       }
//     },
//     [onWordClick, getWordText, getLemma, getMorph]
//   );

//   // Також додамо функцію для отримання словникового коду:
//   const getDictCode = useCallback((word) => {
//     if (!word) return null;
//     return getValue(word, "dict") || null;
//   }, []);

//   // ==================== ВІДОБРАЖЕННЯ СЛІВ ====================

//   const renderWord = useCallback(
//     (wordData, version, strong, isOriginal) => {
//       if (!wordData || wordData.text === null) {
//         return (
//           <div className="empty-word">
//             <span
//               key={`empty-${version}`}
//               className="empty-word"
//               title="Відсутній відповідник"
//             >
//               —
//             </span>
//           </div>
//         );
//       }

//       // Отримуємо dict код
//       const dictCode = getDictCode(wordData.word);

//       // Визначення напрямку тексту
//       const textDirection = strong && strong.startsWith("H") ? "rtl" : "ltr";

//       // Текст для title (підказки при наведенні)
//       const titleText = dictCode
//         ? `Словник: ${dictCode} | Strong: ${strong || "немає"}`
//         : strong
//         ? `Strong: ${strong}`
//         : version;

//       return (
//         <span
//           key={`word-${version}`}
//           className={`word ${
//             isOriginal ? "original-word" : "translation-word"
//           } ${wordData.word ? "clickable" : ""}`}
//           onClick={() =>
//             handleWordClick(wordData.word, version, strong, isOriginal)
//           }
//           onMouseEnter={() =>
//             wordData.word &&
//             setHoveredWord({
//               ...wordData,
//               strong,
//               version,
//               isOriginal,
//               dictCode, // ← ДОДАЄМО dictCode
//             })
//           }
//           onMouseLeave={() => setHoveredWord(null)}
//           // title={strong ? `Strong: ${strong}` : version}
//           // style={{ direction: textDirection, unicodeBidi: "embed" }}
//           title={titleText} // ← ОНОВЛЮЄМО title
//           style={{ direction: textDirection, unicodeBidi: "embed" }}
//           data-dict={dictCode} // ← Додаємо атрибут для дебагу
//         >
//           {wordData.text}
//         </span>
//       );
//     },
//     [handleWordClick, getDictCode]
//   );

//   // ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

//   const getDisplayVersions = useCallback(() => {
//     const versions = [];

//     pairs.forEach((pair) => {
//       // Додаємо оригінал
//       if (pair.original && !versions.includes(pair.original)) {
//         versions.push(pair.original);
//       }

//       // Додаємо переклади
//       if (pair.translations && pair.translations.length > 0) {
//         pair.translations.forEach((trans) => {
//           if (!versions.includes(trans)) {
//             versions.push(trans);
//           }
//         });
//       }
//     });

//     // console.log(`📋 Версії для відображення:`, versions);
//     return versions;
//   }, [pairs]);

//   const isOriginalVersion = useCallback((version) => {
//     return ["LXX", "THOT", "TR", "GNT"].includes(version.toUpperCase());
//   }, []);

//   // ==================== РЕНДЕРИНГ ====================

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="words-grid text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   const displayVersions = getDisplayVersions();
//   const wordBlocks = createVerseBlocks;

//   // console.log(`🎨 Рендеринг вірша ${verseNum}:`, {
//   //   блоків: wordBlocks.length,
//   //   версій: displayVersions.length,
//   //   пари: pairs.length,
//   // });

//   return (
//     <div
//       className="interlinear-verse flex-layout"
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-content" data-verse={verseNum}>
//         <div className="verse-number">{verseNum}</div>

//         {/* ЗАГОЛОВКИ ТІЛЬКИ ДЛЯ ПЕРШОГО ВІРША РОЗДІЛУ */}
//         {isFirstInChapter && (
//           <div className="verse-headers verse-row">
//             {displayVersions.map((version, index) => (
//               <div
//                 key={`header-${version}-${index}`}
//                 className={`verse-header ${
//                   isOriginalVersion(version)
//                     ? "original-header"
//                     : "translation-header"
//                 }`}
//                 style={{
//                   direction: version === "THOT" ? "rtl" : "ltr",
//                   unicodeBidi: version === "THOT" ? "embed" : "normal",
//                 }}
//               >
//                 <span className="word">[{version}]</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* БЛОКИ СЛІВ */}
//         {wordBlocks.map((block, blockIndex) => (
//           <div key={block.id} className="word-block">
//             <div className="version-row">
//               {displayVersions.map((version, versionIndex) => {
//                 const wordData = block.versions[version];
//                 const strongCode = wordData?.word
//                   ? getStrongCode(wordData.word, version)
//                   : block.strong;

//                 return (
//                   <div
//                     key={`${block.id}-${version}-${versionIndex}`}
//                     className={`word-version ${
//                       isOriginalVersion(version)
//                         ? "original-version"
//                         : "translation-version"
//                     }`}
//                   >
//                     {renderWord(
//                       wordData,
//                       version,
//                       strongCode,
//                       isOriginalVersion(version)
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ПЛАВАЮЧА ПІДКАЗКА */}
//       {hoveredWord && hoveredWord.word && (
//         <div
//           ref={tooltipRef}
//           className="floating-tooltip"
//           style={{
//             left: `${mousePos.x + 10}px`,
//             top: isAboveCursor
//               ? `${mousePos.y + 20}px`
//               : `${mousePos.y - 120}px`,
//             transform: "translateX(-50%)",
//           }}
//         >
//           <div className="tooltip-header">
//             {hoveredWord.dictCode ? (
//               <>
//                 <strong className="dict-code">{hoveredWord.dictCode}</strong>
//                 <span className="version-badge">[{hoveredWord.version}]</span>
//                 <span className="badge bg-success ms-2">uk</span>
//               </>
//             ) : (
//               <>
//                 <strong className="strong-code">{hoveredWord.strong}</strong>
//                 <span className="version-badge">[{hoveredWord.version}]</span>
//                 {hoveredWord.isOriginal && (
//                   <span className="badge bg-primary ms-2">Оригінал</span>
//                 )}
//               </>
//             )}
//           </div>
//           <div className="tooltip-body">
//             <div className="word-text">{hoveredWord.text}</div>
//             {hoveredWord.dictCode ? (
//               <div className="word-dict">
//                 <small>Словник: {hoveredWord.dictCode}</small>
//               </div>
//             ) : null}
//             {getLemma(hoveredWord.word) && (
//               <div className="word-lemma">
//                 Лема: {getLemma(hoveredWord.word)}
//               </div>
//             )}
//             {getMorph(hoveredWord.word) && (
//               <div className="word-morph">
//                 Морф: {getMorph(hoveredWord.word)}
//               </div>
//             )}
//           </div>
//           <div className="tooltip-footer">
//             <small>Клік для відкриття словника</small>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterlinearVerse;

// ========================

// // src/components/InterlinearVerse.js - ОПТИМІЗОВАНИЙ 14.01.2026-1
// import React, {
//   useState,
//   useRef,
//   useMemo,
//   useEffect,
//   useCallback,
//   memo,
// } from "react";
// import "../styles/Interlinear.css";
// // import "../styles/PassagePage.css";
// import { jsonAdapter, getValue } from "../utils/jsonAdapter";
// import { logger } from "../utils/logger"; // Додати цей імпорт

// const InterlinearVerse = ({
//   verseNum,
//   pairs,
//   chapterData,
//   onWordClick,
//   isFirstInChapter = false,
// }) => {
//   const [hoveredWord, setHoveredWord] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [isAboveCursor, setIsAboveCursor] = useState(false);
//   const tooltipRef = useRef(null);
//   const containerRef = useRef(null);

//   // ==================== ОПТИМІЗОВАНІ ФУНКЦІЇ ====================

//   const getWordText = useCallback((word) => {
//     return word ? getValue(word, "word") || getValue(word, "w") || null : null;
//   }, []);

//   const getStrongCode = useCallback((word, version = null) => {
//     if (!word) return null;
//     let strong = getValue(word, "strong") || getValue(word, "s") || null;
//     if (version === "THOT" && strong && strong.startsWith("G")) {
//       strong = "H" + strong.substring(1);
//     }
//     return strong;
//   }, []);

//   const getLemma = useCallback((word) => {
//     return word ? getValue(word, "lemma") || getValue(word, "l") || null : null;
//   }, []);

//   const getMorph = useCallback((word) => {
//     return word ? getValue(word, "morph") || getValue(word, "m") || null : null;
//   }, []);

//   const getDictCode = useCallback((word) => {
//     return word ? getValue(word, "dict") || null : null;
//   }, []);

//   const getWordsFromVerse = useCallback((verseData) => {
//     return verseData
//       ? getValue(verseData, "words") || getValue(verseData, "ws") || []
//       : [];
//   }, []);

//   // ==================== ОПТИМІЗОВАНА ФУНКЦІЯ СПІВСТАВЛЕННЯ ====================

//   const alignWordsAdvanced = useCallback(
//     (originalVerse, translationVerse, originalVersion, translationCode) => {
//       logger.debug(`Вирівнювання: ${originalVersion} → ${translationCode}`);

//       const aligned = [];
//       const origWords = getWordsFromVerse(originalVerse);
//       const transWords = getWordsFromVerse(translationVerse);

//       if (origWords.length === 0 || transWords.length === 0) {
//         return aligned;
//       }

//       // ШВИДКА МАПА ДЛЯ ПОШУКУ
//       const translationMap = new Map();
//       transWords.forEach((transWord, index) => {
//         const strong = getStrongCode(transWord, translationCode);
//         if (strong) {
//           if (!translationMap.has(strong)) {
//             translationMap.set(strong, []);
//           }
//           translationMap.get(strong).push({ word: transWord, index });
//         }
//       });

//       // ОПТИМІЗОВАНИЙ ПРОХІД
//       for (let i = 0; i < origWords.length; i++) {
//         const origWord = origWords[i];
//         const origStrong = getStrongCode(origWord, originalVersion);
//         const origMorph = getMorph(origWord);

//         let matchedWord = null;
//         let matchedIndex = -1;

//         if (origStrong && translationMap.has(origStrong)) {
//           const candidates = translationMap.get(origStrong);

//           // Швидкий пошук кандидата
//           for (let j = 0; j < candidates.length; j++) {
//             const candidate = candidates[j];
//             if (!origMorph || getMorph(candidate.word) === origMorph) {
//               matchedWord = candidate.word;
//               matchedIndex = candidate.index;

//               // Видаляємо знайденого кандидата
//               candidates.splice(j, 1);
//               if (candidates.length === 0) {
//                 translationMap.delete(origStrong);
//               }
//               break;
//             }
//           }

//           // Якщо не знайшли за морфологією - беремо перше
//           if (!matchedWord && candidates.length > 0) {
//             matchedWord = candidates[0].word;
//             matchedIndex = candidates[0].index;
//             candidates.shift();
//             if (candidates.length === 0) {
//               translationMap.delete(origStrong);
//             }
//           }
//         }

//         aligned.push({
//           original: origWord,
//           translation: matchedWord,
//           alignedBy: matchedWord ? "strong" : "none",
//         });
//       }

//       return aligned;
//     },
//     [getStrongCode, getMorph, getWordsFromVerse]
//   );

//   // ==================== ОПТИМІЗОВАНЕ ОТРИМАННЯ ДАНИХ ====================

//   const adaptedData = useMemo(() => {
//     const result = {};
//     if (!chapterData) return result;

//     const keys = Object.keys(chapterData);
//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];
//       const data = chapterData[key];
//       const adapted = jsonAdapter(data);
//       result[key] = Array.isArray(adapted)
//         ? adapted.filter((item) => item && typeof item === "object")
//         : [];
//     }

//     return result;
//   }, [chapterData]);

//   const getVerseData = useCallback(
//     (version, verseNumber) => {
//       if (!adaptedData[version]) return null;
//       const verseNumInt = parseInt(verseNumber);
//       const data = adaptedData[version];

//       // БІНАРНИЙ ПОШУК (якщо вірші відсортовані)
//       if (data.length > 10) {
//         let left = 0;
//         let right = data.length - 1;

//         while (left <= right) {
//           const mid = Math.floor((left + right) / 2);
//           const v = data[mid];
//           const vNum = parseInt(v.verse || v.v);

//           if (vNum === verseNumInt) return v;
//           if (vNum < verseNumInt) left = mid + 1;
//           else right = mid - 1;
//         }
//       } else {
//         // ЛІНІЙНИЙ ПОШУК для невеликих масивів
//         for (let i = 0; i < data.length; i++) {
//           const v = data[i];
//           const vNum = parseInt(v.verse || v.v);
//           if (vNum === verseNumInt) return v;
//         }
//       }

//       return null;
//     },
//     [adaptedData]
//   );

//   // ==================== ОПТИМІЗОВАНЕ СТВОРЕННЯ БЛОКІВ ====================

//   const wordBlocks = useMemo(() => {
//     if (!pairs || pairs.length === 0 || !chapterData) {
//       return [];
//     }

//     const startTime = performance.now();
//     const blocks = [];
//     const processedTranslations = new Set();
//     const pairCount = pairs.length;

//     // ОБРОБКА ВСІХ ПАР
//     for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
//       const pair = pairs[pairIndex];
//       if (!pair.original) continue;

//       const origVerse = getVerseData(pair.original, verseNum);
//       if (!origVerse) continue;

//       const origWords = getWordsFromVerse(origVerse);
//       const wordCount = origWords.length;

//       // СТВОРЕННЯ ПОЧАТКОВИХ БЛОКІВ
//       for (let wordIndex = 0; wordIndex < wordCount; wordIndex++) {
//         const origWord = origWords[wordIndex];
//         if (!blocks[wordIndex]) {
//           blocks[wordIndex] = {
//             id: `${verseNum}-${wordIndex}`,
//             strong: getStrongCode(origWord, pair.original),
//             versions: {},
//             position: wordIndex,
//           };
//         }

//         blocks[wordIndex].versions[pair.original] = {
//           text: getWordText(origWord),
//           word: origWord,
//           isOriginal: true,
//           version: pair.original,
//         };
//       }

//       // ОБРОБКА ПЕРЕКЛАДІВ
//       if (pair.translations && pair.translations.length > 0) {
//         const transCount = pair.translations.length;
//         for (let transIndex = 0; transIndex < transCount; transIndex++) {
//           const transCode = pair.translations[transIndex];
//           const translationKey = `${pair.original}-${transCode}`;

//           if (processedTranslations.has(translationKey)) continue;

//           const transVerse = getVerseData(transCode, verseNum);
//           if (!transVerse) continue;

//           const aligned = alignWordsAdvanced(
//             origVerse,
//             transVerse,
//             pair.original,
//             transCode
//           );

//           for (let i = 0; i < aligned.length; i++) {
//             if (!blocks[i]) continue;

//             const item = aligned[i];
//             blocks[i].versions[transCode] = {
//               text: item.translation ? getWordText(item.translation) : null,
//               word: item.translation,
//               isOriginal: false,
//               version: transCode,
//               alignedBy: item.alignedBy,
//             };
//           }

//           processedTranslations.add(translationKey);
//         }
//       }
//     }

//     const endTime = performance.now();
//     logger.debug(`Створення блоків за ${(endTime - startTime).toFixed(2)}мс`);

//     return blocks.filter((block) => block && block.versions);
//   }, [
//     pairs,
//     verseNum,
//     chapterData,
//     getVerseData,
//     getWordsFromVerse,
//     getWordText,
//     getStrongCode,
//     alignWordsAdvanced,
//   ]);

//   // ==================== ОПТИМІЗОВАНІ ОБРОБНИКИ ====================

//   const handleMouseMove = useCallback((e) => {
//     setMousePos({ x: e.clientX, y: e.clientY });
//     setIsAboveCursor(e.clientY < window.innerHeight / 2);
//   }, []);

//   const handleWordClick = useCallback(
//     (word, version, strong, isOriginal) => {
//       if (word && onWordClick) {
//         onWordClick({
//           word: {
//             word: getWordText(word),
//             strong: strong,
//             lemma: getLemma(word),
//             morph: getMorph(word),
//             dict: getDictCode(word),
//           },
//           origVer: version,
//           lang: strong?.startsWith("H") ? "he" : "gr",
//         });
//       }
//     },
//     [onWordClick, getWordText, getLemma, getMorph, getDictCode]
//   );

//   const renderWord = useCallback(
//     (wordData, version, strong, isOriginal) => {
//       if (!wordData || wordData.text === null) {
//         return (
//           <span className="word empty-word" title="Відсутній відповідник">
//             ~~~
//           </span>
//         );
//       }

//       const dictCode = getDictCode(wordData.word);
//       const textDirection = strong && strong.startsWith("H") ? "rtl" : "ltr";

//       return (
//         <span
//           className={`word ${
//             isOriginal ? "original-word" : "translation-word"
//           } ${wordData.word ? "clickable" : ""}`}
//           onClick={() =>
//             handleWordClick(wordData.word, version, strong, isOriginal)
//           }
//           onMouseEnter={() =>
//             wordData.word &&
//             setHoveredWord({
//               ...wordData,
//               strong,
//               version,
//               isOriginal,
//               dictCode,
//             })
//           }
//           onMouseLeave={() => setHoveredWord(null)}
//           title={
//             dictCode
//               ? `Словник: ${dictCode}`
//               : strong
//               ? `Strong: ${strong}`
//               : version
//           }
//           style={{ direction: textDirection, unicodeBidi: "embed" }}
//         >
//           {wordData.text}
//         </span>
//       );
//     },
//     [handleWordClick, getDictCode]
//   );

//   // ==================== ОПТИМІЗОВАНІ ХЕЛПЕРИ ====================

//   const displayVersions = useMemo(() => {
//     const versions = [];
//     const seen = new Set();

//     for (let i = 0; i < pairs.length; i++) {
//       const pair = pairs[i];
//       if (pair.original && !seen.has(pair.original)) {
//         seen.add(pair.original);
//         versions.push(pair.original);
//       }

//       if (pair.translations) {
//         for (let j = 0; j < pair.translations.length; j++) {
//           const trans = pair.translations[j];
//           if (!seen.has(trans)) {
//             seen.add(trans);
//             versions.push(trans);
//           }
//         }
//       }
//     }

//     return versions;
//   }, [pairs]);

//   const isOriginalVersion = useCallback((version) => {
//     const upper = version.toUpperCase();
//     return (
//       upper === "LXX" || upper === "THOT" || upper === "TR" || upper === "GNT"
//     );
//   }, []);

//   // ==================== ОПТИМІЗОВАНИЙ РЕНДЕРИНГ ====================

//   if (!pairs || pairs.length === 0 || !chapterData) {
//     return (
//       <div className="interlinear-verse">
//         <div className="verse-number">{verseNum}</div>
//         <div className="text-muted">Дані для вірша відсутні</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="interlinear-verse flex-layout"
//       onMouseMove={handleMouseMove}
//     >
//       <div className="verse-content" data-verse={verseNum}>
//         <div className="verse-number">{verseNum}</div>

//         {isFirstInChapter && (
//           <div className="verse-headers verse-row">
//             {displayVersions.map((version, index) => (
//               <div
//                 key={`header-${version}-${index}`}
//                 className={`verse-header ${
//                   isOriginalVersion(version)
//                     ? "original-header"
//                     : "translation-header"
//                 }`}
//                 style={{
//                   // direction: version === "THOT" ? "rtl" : "ltr",
//                   unicodeBidi: version === "THOT" ? "embed" : "normal",
//                 }}
//               >
//                 <span className="word-span">[{version}]</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {wordBlocks.map((block) => (
//           <div key={block.id} className="word-block">
//             <div className="version-row">
//               {displayVersions.map((version) => {
//                 const wordData = block.versions[version];
//                 const strongCode = wordData?.word
//                   ? getStrongCode(wordData.word, version)
//                   : block.strong;

//                 return (
//                   <div
//                     key={`${block.id}-${version}`}
//                     className={`word-version ${
//                       isOriginalVersion(version)
//                         ? "original-version"
//                         : "translation-version"
//                     }`}
//                   >
//                     {renderWord(
//                       wordData,
//                       version,
//                       strongCode,
//                       isOriginalVersion(version)
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {hoveredWord && hoveredWord.word && (
//         <div
//           ref={tooltipRef}
//           className="floating-tooltip"
//           style={{
//             left: `${mousePos.x + 10}px`,
//             top: isAboveCursor
//               ? `${mousePos.y + 20}px`
//               : `${mousePos.y - 120}px`,
//           }}
//         >
//           <div className="tooltip-header">
//             {hoveredWord.dictCode ? (
//               <>
//                 <strong className="dict-code">{hoveredWord.dictCode}</strong>
//                 <span className="version-badge">[{hoveredWord.version}]</span>
//                 <span className="badge bg-success ms-2">uk</span>
//               </>
//             ) : (
//               <>
//                 <strong className="strong-code">{hoveredWord.strong}</strong>
//                 <span className="version-badge">[{hoveredWord.version}]</span>
//                 {hoveredWord.isOriginal && (
//                   <span className="badge bg-primary ms-2">Оригінал</span>
//                 )}
//               </>
//             )}
//           </div>
//           <div className="tooltip-body">
//             <div className="word-text">{hoveredWord.text}</div>
//             {hoveredWord.dictCode && (
//               <div className="word-dict">
//                 <small>Словник: {hoveredWord.dictCode}</small>
//               </div>
//             )}
//             {getLemma(hoveredWord.word) && (
//               <div className="word-lemma">
//                 Лема: {getLemma(hoveredWord.word)}
//               </div>
//             )}
//             {getMorph(hoveredWord.word) && (
//               <div className="word-morph">
//                 Морф: {getMorph(hoveredWord.word)}
//               </div>
//             )}
//           </div>
//           <div className="tooltip-footer">
//             <small>Клік для словника</small>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default React.memo(InterlinearVerse);

// ===============================

// src/components/InterlinearVerse.js - ОПТИМІЗОВАНИЙ 14.01.2026-1 - копія
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  memo,
} from "react";
import "../styles/Interlinear.css";
// import "../styles/PassagePage.css";
import { jsonAdapter, getValue } from "../utils/jsonAdapter";
import { logger } from "../utils/logger"; // Додати цей імпорт

const InterlinearVerse = ({
  verseNum,
  pairs,
  chapterData,
  onWordClick,
  isFirstInChapter = false,
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAboveCursor, setIsAboveCursor] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  // ==================== ОПТИМІЗОВАНІ ФУНКЦІЇ ====================

  const getWordText = useCallback((word) => {
    return word ? getValue(word, "word") || getValue(word, "w") || null : null;
  }, []);

  const getStrongCode = useCallback((word, version = null) => {
    if (!word) return null;
    let strong = getValue(word, "strong") || getValue(word, "s") || null;
    if (version === "THOT" && strong && strong.startsWith("G")) {
      strong = "H" + strong.substring(1);
    }
    return strong;
  }, []);

  const getLemma = useCallback((word) => {
    return word ? getValue(word, "lemma") || getValue(word, "l") || null : null;
  }, []);

  const getMorph = useCallback((word) => {
    return word ? getValue(word, "morph") || getValue(word, "m") || null : null;
  }, []);

  const getDictCode = useCallback((word) => {
    return word ? getValue(word, "dict") || null : null;
  }, []);

  const getWordsFromVerse = useCallback((verseData) => {
    return verseData
      ? getValue(verseData, "words") || getValue(verseData, "ws") || []
      : [];
  }, []);

  // ==================== ОПТИМІЗОВАНА ФУНКЦІЯ СПІВСТАВЛЕННЯ ====================

  const alignWordsAdvanced = useCallback(
    (originalVerse, translationVerse, originalVersion, translationCode) => {
      logger.debug(`Вирівнювання: ${originalVersion} → ${translationCode}`);

      const aligned = [];
      const origWords = getWordsFromVerse(originalVerse);
      const transWords = getWordsFromVerse(translationVerse);

      if (origWords.length === 0 || transWords.length === 0) {
        return aligned;
      }

      // ШВИДКА МАПА ДЛЯ ПОШУКУ
      const translationMap = new Map();
      transWords.forEach((transWord, index) => {
        const strong = getStrongCode(transWord, translationCode);
        if (strong) {
          if (!translationMap.has(strong)) {
            translationMap.set(strong, []);
          }
          translationMap.get(strong).push({ word: transWord, index });
        }
      });

      // ОПТИМІЗОВАНИЙ ПРОХІД
      for (let i = 0; i < origWords.length; i++) {
        const origWord = origWords[i];
        const origStrong = getStrongCode(origWord, originalVersion);
        const origMorph = getMorph(origWord);

        let matchedWord = null;
        let matchedIndex = -1;

        if (origStrong && translationMap.has(origStrong)) {
          const candidates = translationMap.get(origStrong);

          // Швидкий пошук кандидата
          for (let j = 0; j < candidates.length; j++) {
            const candidate = candidates[j];
            if (!origMorph || getMorph(candidate.word) === origMorph) {
              matchedWord = candidate.word;
              matchedIndex = candidate.index;

              // Видаляємо знайденого кандидата
              candidates.splice(j, 1);
              if (candidates.length === 0) {
                translationMap.delete(origStrong);
              }
              break;
            }
          }

          // Якщо не знайшли за морфологією - беремо перше
          if (!matchedWord && candidates.length > 0) {
            matchedWord = candidates[0].word;
            matchedIndex = candidates[0].index;
            candidates.shift();
            if (candidates.length === 0) {
              translationMap.delete(origStrong);
            }
          }
        }

        aligned.push({
          original: origWord,
          translation: matchedWord,
          alignedBy: matchedWord ? "strong" : "none",
        });
      }

      return aligned;
    },
    [getStrongCode, getMorph, getWordsFromVerse],
  );

  // ==================== ОПТИМІЗОВАНЕ ОТРИМАННЯ ДАНИХ ====================

  const adaptedData = useMemo(() => {
    const result = {};
    if (!chapterData) return result;

    const keys = Object.keys(chapterData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const data = chapterData[key];
      const adapted = jsonAdapter(data);
      result[key] = Array.isArray(adapted)
        ? adapted.filter((item) => item && typeof item === "object")
        : [];
    }

    return result;
  }, [chapterData]);

  const getVerseData = useCallback(
    (version, verseNumber) => {
      if (!adaptedData[version]) return null;
      const verseNumInt = parseInt(verseNumber);
      const data = adaptedData[version];

      // БІНАРНИЙ ПОШУК (якщо вірші відсортовані)
      if (data.length > 10) {
        let left = 0;
        let right = data.length - 1;

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const v = data[mid];
          const vNum = parseInt(v.verse || v.v);

          if (vNum === verseNumInt) return v;
          if (vNum < verseNumInt) left = mid + 1;
          else right = mid - 1;
        }
      } else {
        // ЛІНІЙНИЙ ПОШУК для невеликих масивів
        for (let i = 0; i < data.length; i++) {
          const v = data[i];
          const vNum = parseInt(v.verse || v.v);
          if (vNum === verseNumInt) return v;
        }
      }

      return null;
    },
    [adaptedData],
  );

  // ==================== ОПТИМІЗОВАНЕ СТВОРЕННЯ БЛОКІВ ====================

  const wordBlocks = useMemo(() => {
    if (!pairs || pairs.length === 0 || !chapterData) {
      return [];
    }

    const startTime = performance.now();
    const blocks = [];
    const processedTranslations = new Set();
    const pairCount = pairs.length;

    // ОБРОБКА ВСІХ ПАР
    for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
      const pair = pairs[pairIndex];
      if (!pair.original) continue;

      const origVerse = getVerseData(pair.original, verseNum);
      if (!origVerse) continue;

      const origWords = getWordsFromVerse(origVerse);
      const wordCount = origWords.length;

      // СТВОРЕННЯ ПОЧАТКОВИХ БЛОКІВ
      for (let wordIndex = 0; wordIndex < wordCount; wordIndex++) {
        const origWord = origWords[wordIndex];
        if (!blocks[wordIndex]) {
          blocks[wordIndex] = {
            id: `${verseNum}-${wordIndex}`,
            strong: getStrongCode(origWord, pair.original),
            versions: {},
            position: wordIndex,
          };
        }

        blocks[wordIndex].versions[pair.original] = {
          text: getWordText(origWord),
          word: origWord,
          isOriginal: true,
          version: pair.original,
        };
      }

      // ОБРОБКА ПЕРЕКЛАДІВ
      if (pair.translations && pair.translations.length > 0) {
        const transCount = pair.translations.length;
        for (let transIndex = 0; transIndex < transCount; transIndex++) {
          const transCode = pair.translations[transIndex];
          const translationKey = `${pair.original}-${transCode}`;

          if (processedTranslations.has(translationKey)) continue;

          const transVerse = getVerseData(transCode, verseNum);
          if (!transVerse) continue;

          const aligned = alignWordsAdvanced(
            origVerse,
            transVerse,
            pair.original,
            transCode,
          );

          for (let i = 0; i < aligned.length; i++) {
            if (!blocks[i]) continue;

            const item = aligned[i];
            blocks[i].versions[transCode] = {
              text: item.translation ? getWordText(item.translation) : null,
              word: item.translation,
              isOriginal: false,
              version: transCode,
              alignedBy: item.alignedBy,
            };
          }

          processedTranslations.add(translationKey);
        }
      }
    }

    const endTime = performance.now();
    logger.debug(`Створення блоків за ${(endTime - startTime).toFixed(2)}мс`);

    return blocks.filter((block) => block && block.versions);
  }, [
    pairs,
    verseNum,
    chapterData,
    getVerseData,
    getWordsFromVerse,
    getWordText,
    getStrongCode,
    alignWordsAdvanced,
  ]);

  // ==================== ОПТИМІЗОВАНІ ОБРОБНИКИ ====================

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsAboveCursor(e.clientY < window.innerHeight / 2);
  }, []);

  const handleWordClick = useCallback(
    (word, version, strong, isOriginal) => {
      if (word && onWordClick) {
        onWordClick({
          word: {
            word: getWordText(word),
            strong: strong,
            lemma: getLemma(word),
            morph: getMorph(word),
            dict: getDictCode(word),
          },
          origVer: version,
          lang: strong?.startsWith("H") ? "he" : "gr",
          isOriginal: isOriginal, // ДОДАЄМО ЦЕЙ ПАРАМЕТР
        });
      }
    },
    [onWordClick, getWordText, getLemma, getMorph, getDictCode],
  );

  const renderWord = useCallback(
    (wordData, version, strong, isOriginal) => {
      if (!wordData || wordData.text === null) {
        return (
          <span className="word empty-word" title="Відсутній відповідник">
            ~~~
          </span>
        );
      }

      const dictCode = getDictCode(wordData.word);
      const textDirection = strong && strong.startsWith("H") ? "rtl" : "ltr";

      return (
        <span
          className={`word ${
            isOriginal ? "original-word" : "translation-word"
          } ${wordData.word ? "clickable" : ""}`}
          onClick={() =>
            handleWordClick(wordData.word, version, strong, isOriginal)
          }
          onMouseEnter={() =>
            wordData.word &&
            setHoveredWord({
              ...wordData,
              strong,
              version,
              isOriginal,
              dictCode,
            })
          }
          onMouseLeave={() => setHoveredWord(null)}
          title={
            dictCode
              ? `Словник: ${dictCode}`
              : strong
                ? `Strong: ${strong}`
                : version
          }
          style={{ direction: textDirection, unicodeBidi: "embed" }}
        >
          {wordData.text}
        </span>
      );
    },
    [handleWordClick, getDictCode],
  );

  // ==================== ОПТИМІЗОВАНІ ХЕЛПЕРИ ====================

  const displayVersions = useMemo(() => {
    const versions = [];
    const seen = new Set();

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      if (pair.original && !seen.has(pair.original)) {
        seen.add(pair.original);
        versions.push(pair.original);
      }
      if (pair.original === null) {
        // Рендерити тільки переклади як рядок без вирівнювання
        const transVerse = getVerseData(pair.translations[0], verseNum); // Беремо перший переклад
        const words = getWordsFromVerse(transVerse);
        // Рендерити як для оригіналу: ітерація по words з renderWord(isOriginal: false)
      }
      if (pair.translations) {
        for (let j = 0; j < pair.translations.length; j++) {
          const trans = pair.translations[j];
          if (!seen.has(trans)) {
            seen.add(trans);
            versions.push(trans);
          }
        }
      }
    }

    return versions;
  }, [pairs]);

  const isOriginalVersion = useCallback((version) => {
    const upper = version.toUpperCase();
    return (
      upper === "LXX" || upper === "THOT" || upper === "TR" || upper === "GNT"
    );
  }, []);

  // ==================== ОПТИМІЗОВАНИЙ РЕНДЕРИНГ ====================

  if (!pairs || pairs.length === 0 || !chapterData) {
    return (
      <div className="interlinear-verse">
        <div className="verse-number">{verseNum}</div>
        <div className="text-muted">Дані для вірша відсутні</div>
      </div>
    );
  }

  return (
    <div
      className="interlinear-verse flex-layout"
      onMouseMove={handleMouseMove}
    >
      <div className="verse-content" data-verse={verseNum}>
        <div className="verse-number">{verseNum}</div>

        {isFirstInChapter && (
          <div className="verse-headers verse-row">
            {displayVersions.map((version, index) => (
              <div
                key={`header-${version}-${index}`}
                className={`verse-header ${
                  isOriginalVersion(version)
                    ? "original-header"
                    : "translation-header"
                }`}
                style={{
                  // direction: version === "THOT" ? "rtl" : "ltr",
                  unicodeBidi: version === "THOT" ? "embed" : "normal",
                }}
              >
                <span className="word-span">[{version}]</span>
              </div>
            ))}
          </div>
        )}

        {wordBlocks.map((block) => (
          <div key={block.id} className="word-block">
            <div className="version-row">
              {displayVersions.map((version) => {
                const wordData = block.versions[version];
                const strongCode = wordData?.word
                  ? getStrongCode(wordData.word, version)
                  : block.strong;

                // ВИЗНАЧАЄМО ТИП СЛОВА
                const isOriginal = isOriginalVersion(version);

                return (
                  <div
                    key={`${block.id}-${version}`}
                    className={`word-version ${
                      isOriginalVersion(version)
                        ? "original-version"
                        : "translation-version"
                    }`}
                  >
                    {renderWord(
                      wordData,
                      version,
                      strongCode,
                      // isOriginalVersion(version),
                      isOriginal,
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hoveredWord && hoveredWord.word && (
        <div
          ref={tooltipRef}
          className="floating-tooltip"
          style={{
            left: `${mousePos.x + 10}px`,
            top: isAboveCursor
              ? `${mousePos.y + 20}px`
              : `${mousePos.y - 120}px`,
          }}
        >
          <div className="tooltip-header">
            {hoveredWord.dictCode ? (
              <>
                <strong className="dict-code">{hoveredWord.dictCode}</strong>
                <span className="version-badge">[{hoveredWord.version}]</span>
                <span className="badge bg-success ms-2">uk</span>
              </>
            ) : (
              <>
                <strong className="strong-code">{hoveredWord.strong}</strong>
                <span className="version-badge">[{hoveredWord.version}]</span>
                {hoveredWord.isOriginal && (
                  <span className="badge bg-primary ms-2">Оригінал</span>
                )}
              </>
            )}
          </div>
          <div className="tooltip-body">
            <div className="word-text">{hoveredWord.text}</div>
            {hoveredWord.dictCode && (
              <div className="word-dict">
                <small>Словник: {hoveredWord.dictCode}</small>
              </div>
            )}
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
            <small>Клік для словника</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(InterlinearVerse);

// ===============================
