// // src/components/LexiconWindow.js - ОНОВЛЕНА ВЕРСІЯ
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import CloseIcon from "../elements/CloseIcon";
// import { loadStrongEntry } from "../utils/loadStrong";
// import "../styles/LexiconWindow.css";

// const LexiconWindow = ({ data, lang, onClose, coreData, origVer }) => {
//   const [entry, setEntry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("dictionary");
//   const [isTranslationDict, setIsTranslationDict] = useState(false);

//   const strong = data?.word?.strong;
//   const dictCode = data?.word?.dict; // Словниковий код (наприклад: G4160_uk)

//   useEffect(() => {
//     console.log("LexiconWindow: Дані отримані", {
//       strong,
//       dictCode,
//       origVer,
//       word: data?.word?.word,
//     });
//     // На початку useEffect додайте:
//     console.log("📥 LexiconWindow отримав дані:", {
//       word: data?.word?.word,
//       strong: data?.word?.strong,
//       dict: data?.word?.dict,
//       origVer: origVer,
//       timestamp: new Date().toISOString(),
//     });
//     if (!strong && !dictCode) {
//       setLoading(false);
//       setError("Немає даних для завантаження словника");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setEntry(null);

//     // ВИЗНАЧАЄМО, ЯКИЙ СЛОВНИК ЗАВАНТАЖУВАТИ:
//     const loadDictionary = async () => {
//       try {
//         // 1. СПОЧАТКУ пробуємо завантажити словник перекладу (dictCode)
//         if (dictCode) {
//           console.log(
//             "📚 LexiconWindow: Завантаження словника перекладу",
//             dictCode
//           );

//           const [strongCode, langCode] = dictCode.split("_");
//           // const dictType = strongCode.startsWith("G") ? "greek" : "hebrew";
//           const category = strongCode.startsWith("G") ? "G" : "H"; // ← ТУТ "G" для G4160
//           const letter = strongCode.substring(1, 2);

//           // Формуємо шлях до словника перекладу
//           // const dictPath = `/data/dictionaries/${langCode.toUpperCase()}/${letter}/${dictCode}.json`;
//           const dictPath = `/data/dictionaries/${langCode.toLowerCase()}/${category}/${dictCode}.json`;

//           console.log("📂 Шлях до словника перекладу:", dictPath);

//           const dictRes = await fetch(dictPath);
//           if (dictRes.ok) {
//             const dictData = await dictRes.json();
//             console.log("✅ Словник перекладу завантажено", dictData);

//             // Обробка даних словника перекладу
//             const dictEntry = dictData[strongCode] || dictData;
//             setIsTranslationDict(true);

//             setEntry({
//               strong: strongCode,
//               word: dictEntry.w || dictEntry.word || data?.word?.word || "",
//               translit: dictEntry.t || dictEntry.translit || "",
//               translation:
//                 dictEntry.tr ||
//                 dictEntry.translation ||
//                 dictEntry.translation_uk ||
//                 "",
//               morphology:
//                 dictEntry.m || dictEntry.morphology || data?.word?.morph || "",
//               meanings: dictEntry.mn || dictEntry.meanings || [],
//               definitions: dictEntry.definitions || {},
//               lxx_usage: dictEntry.lxx_usage || [],
//               hebrew_equivalents: dictEntry.hebrew_equivalents || [],
//               usage_count: dictEntry.uc || dictEntry.usage_count || 0,
//               _type: "translation_dictionary",
//               _lang: langCode,
//             });
//             setLoading(false);
//             return;
//           } else {
//             console.log("⚠️ Словник перекладу не знайдено, пробуємо Strong's");
//           }
//         }

//         // 2. ЯКЩО немає словника перекладу або не знайдено - завантажуємо Strong's
//         console.log("🔍 LexiconWindow: Завантаження Strong's словника", strong);

//         const strongRes = await fetch(`/data/strongs/${strong}.json`);
//         if (!strongRes.ok) {
//           throw new Error(
//             `HTTP ${strongRes.status}: Strong's словник не знайдено`
//           );
//         }

//         const strongData = await strongRes.json();
//         console.log("✅ Strong's словник завантажено");

//         // Обробка даних Strong's
//         const strongEntry = strongData[strong] || strongData;
//         setIsTranslationDict(false);

//         setEntry({
//           strong: strong,
//           word: strongEntry.w || strongEntry.word || data?.word?.word || "",
//           translit: strongEntry.t || strongEntry.translit || "",
//           translation: strongEntry.tr || strongEntry.translation || "",
//           morphology:
//             strongEntry.m || strongEntry.morphology || data?.word?.morph || "",
//           meanings: strongEntry.mn || strongEntry.meanings || [],
//           definition: strongEntry.d || strongEntry.definition || "",
//           lsj_definition_raw:
//             strongEntry.lsj || strongEntry.lsj_definition_raw || "",
//           grammar: strongEntry.g || strongEntry.grammar || "",
//           usages_count: strongEntry.u || strongEntry.usages_count || 0,
//           _type: "strongs_dictionary",
//         });
//       } catch (err) {
//         console.error("❌ LexiconWindow: Помилка завантаження словника", err);
//         setError(`Помилка завантаження: ${err.message}`);

//         // Якщо не вдалося завантажити - створюємо базовий запис з доступних даних
//         if (data?.word) {
//           setEntry({
//             strong: strong,
//             word: data.word.word || "",
//             translation: data.word.lemma || "",
//             morphology: data.word.morph || "",
//             _type: "fallback",
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDictionary();
//   }, [strong, dictCode, data?.word]);

//   // Обробка посилань у тексті
//   const parseRef = (ref) => {
//     const match = ref.match(/([A-Z]+)\.(\d+):(\d+)/);
//     if (!match) return null;
//     const [, book, ch, v] = match;

//     // Шукаємо книгу в coreData
//     const testament = book.match(
//       /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/
//     )
//       ? "NewT"
//       : "OldT";

//     let bookData = null;
//     if (coreData) {
//       // Шукаємо в різних версіях
//       const versions = ["lxx", "thot", "tr", "gnt"];
//       for (const ver of versions) {
//         if (coreData[ver] && coreData[ver][testament]) {
//           bookData = coreData[ver][testament]
//             .flatMap((g) => g.books)
//             .find((b) => b.code === book);
//           if (bookData) break;
//         }
//       }
//     }

//     if (!bookData) return null;
//     return { book: bookData.code, chapter: ch, verse: v };
//   };

//   const renderWithLinks = (text) => {
//     if (!text || typeof text !== "string") return text;

//     return text
//       .split(/(\[[^\]]+\]|\([^\)]+\)|\b[A-Z]+\.\d+:\d+\b)/g)
//       .map((part, i) => {
//         if (part.match(/^\[[^\]]+\]$/)) {
//           return (
//             <sup key={i} className="text-muted">
//               [посилання]
//             </sup>
//           );
//         }
//         if (part.match(/^\([^\)]+\)$/)) {
//           return (
//             <span key={i} className="text-muted">
//               {part}
//             </span>
//           );
//         }
//         const ref = parseRef(part);
//         if (ref) {
//           return (
//             <Link
//               key={i}
//               to={`/?ref=${ref.book}.${ref.chapter}#v${ref.verse}`}
//               className="text-primary text-decoration-underline"
//               title={`Відкрити ${ref.book} ${ref.chapter}:${ref.verse}`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 // Тут можна додати навігацію
//                 console.log("Перехід до:", ref);
//               }}
//             >
//               {part}
//             </Link>
//           );
//         }
//         return part;
//       });
//   };

//   const renderLSJ = (text) => {
//     if (!text || text.trim() === "") {
//       return <p className="text-muted p-3">Немає даних LSJ</p>;
//     }

//     const sections = text.split(/__(.+?)__/).filter(Boolean);
//     if (sections.length === 0) {
//       return (
//         <p dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }} />
//       );
//     }

//     return sections.map((sec, i) => {
//       if (i % 2 === 0) {
//         return (
//           <p
//             key={i}
//             dangerouslySetInnerHTML={{ __html: sec.replace(/\n/g, "<br>") }}
//           />
//         );
//       } else {
//         return (
//           <h6 key={i} className="mt-3 text-primary">
//             {sec}
//           </h6>
//         );
//       }
//     });
//   };

//   // Обробка meanings
//   const renderMeanings = (meanings) => {
//     if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
//       return <p className="text-muted p-3">Немає значень</p>;
//     }

//     return (
//       <ul className="list-unstyled">
//         {meanings.map((meaning, i) => (
//           <li key={i} className="mb-2">
//             {typeof meaning === "string"
//               ? renderWithLinks(meaning)
//               : String(meaning)}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   // Відображення визначень з словника перекладу
//   const renderDefinitions = (definitions) => {
//     if (!definitions || typeof definitions !== "object") {
//       return null;
//     }

//     return (
//       <div className="definitions-content">
//         {Object.entries(definitions).map(([key, value]) => (
//           <div key={key} className="mb-3">
//             <h6 className="text-primary">
//               {key.replace("_", " ").toUpperCase()}:
//             </h6>
//             {typeof value === "object" ? (
//               <ul className="list-unstyled ms-3">
//                 {Object.entries(value).map(([subKey, subValue]) => (
//                   <li key={subKey} className="mb-1">
//                     <strong>{subKey}:</strong> {String(subValue)}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>{String(value)}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Відображення LXX використання
//   const renderLXXUsage = (usage) => {
//     if (!usage || !Array.isArray(usage) || usage.length === 0) {
//       return null;
//     }

//     return (
//       <div className="lxx-usage mt-3">
//         <h6 className="text-primary">Використання в LXX:</h6>
//         <ul className="list-unstyled">
//           {usage.map((item, i) => (
//             <li key={i} className="mb-2 small">
//               {renderWithLinks(item)}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Відображення єврейських еквівалентів
//   const renderHebrewEquivalents = (equivalents) => {
//     if (
//       !equivalents ||
//       !Array.isArray(equivalents) ||
//       equivalents.length === 0
//     ) {
//       return null;
//     }

//     return (
//       <div className="hebrew-equivalents mt-3">
//         <h6 className="text-primary">Єврейські еквіваленти:</h6>
//         <ul className="list-unstyled">
//           {equivalents.map((item, i) => (
//             <li key={i} className="mb-1">
//               {renderWithLinks(item)}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   if (!strong && !dictCode) {
//     return (
//       <div className="lexicon-window">
//         <h5 className="lexicon-title">
//           {lang.lexicon || "Лексикон"}
//           {onClose && <CloseIcon onClick={onClose} />}
//         </h5>
//         <div className="text-muted text-center p-3">Оберіть слово</div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="lexicon-window">
//         <h5 className="lexicon-title">
//           {strong || dictCode}
//           {onClose && <CloseIcon onClick={onClose} />}
//         </h5>
//         <div className="p-3 text-center">
//           <div
//             className="spinner-border spinner-border-sm text-primary me-2"
//             role="status"
//           >
//             <span className="visually-hidden">Завантаження...</span>
//           </div>
//           Завантаження{" "}
//           {isTranslationDict ? "словника перекладу" : "словника Strong's"}...
//         </div>
//       </div>
//     );
//   }

//   if (error || !entry) {
//     return (
//       <div className="lexicon-window">
//         <h5 className="lexicon-title">
//           {strong || dictCode}
//           {onClose && <CloseIcon onClick={onClose} />}
//         </h5>
//         <div className="p-3 text-danger text-center">
//           {error || "Дані відсутні"}
//           <div className="mt-2 small text-muted">
//             Strong: {strong}
//             {dictCode && (
//               <>
//                 <br />
//                 Словник: {dictCode}
//               </>
//             )}
//             <br />
//             {entry?._type && `Тип: ${entry._type}`}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="lexicon-window">
//       <h5 className="lexicon-title">
//         <div>
//           <strong>{entry.word}</strong>
//           {entry.translit && ` (${entry.translit})`}
//           <small className="text-muted ms-2">
//             • {entry.strong}
//             {isTranslationDict && <span className="text-success"> • UA</span>}
//           </small>
//         </div>
//         {onClose && <CloseIcon onClick={onClose} />}
//       </h5>

//       <div className="lexicon-tabs">
//         <button
//           className={activeTab === "dictionary" ? "active" : ""}
//           onClick={() => setActiveTab("dictionary")}
//         >
//           {isTranslationDict ? "Словник UA" : "Словник"}
//         </button>

//         {entry.meanings && entry.meanings.length > 0 && (
//           <button
//             className={activeTab === "meanings" ? "active" : ""}
//             onClick={() => setActiveTab("meanings")}
//           >
//             Значення ({entry.meanings.length})
//           </button>
//         )}

//         {entry.definitions && (
//           <button
//             className={activeTab === "definitions" ? "active" : ""}
//             onClick={() => setActiveTab("definitions")}
//           >
//             Визначення
//           </button>
//         )}

//         {entry.lxx_usage && entry.lxx_usage.length > 0 && (
//           <button
//             className={activeTab === "lxx" ? "active" : ""}
//             onClick={() => setActiveTab("lxx")}
//           >
//             LXX ({entry.lxx_usage.length})
//           </button>
//         )}

//         {entry.lsj_definition_raw && (
//           <button
//             className={activeTab === "lsj" ? "active" : ""}
//             onClick={() => setActiveTab("lsj")}
//           >
//             LSJ
//           </button>
//         )}

//         {(entry.grammar || entry.morphology) && (
//           <button
//             className={activeTab === "grammar" ? "active" : ""}
//             onClick={() => setActiveTab("grammar")}
//           >
//             Граматика
//           </button>
//         )}
//       </div>

//       <div className="lexicon-content">
//         {activeTab === "dictionary" && (
//           <div className="dictionary-content">
//             {entry.word && (
//               <div className="lex-item">
//                 <span className="label">Слово:</span>
//                 <span
//                   className={`value ${
//                     entry.strong?.startsWith("H") ? "he" : "gr"
//                   }`}
//                 >
//                   {entry.word}
//                 </span>
//               </div>
//             )}

//             {entry.translit && (
//               <div className="lex-item">
//                 <span className="label">Трансліт:</span>
//                 <span className="value">{entry.translit}</span>
//               </div>
//             )}

//             {entry.translation && (
//               <div className="lex-item">
//                 <span className="label">Переклад:</span>
//                 <span className="value uk">{entry.translation}</span>
//               </div>
//             )}

//             {entry.morphology && (
//               <div className="lex-item">
//                 <span className="label">Морфологія:</span>
//                 <span className="value">{entry.morphology}</span>
//               </div>
//             )}

//             {entry.usage_count > 0 && (
//               <div className="lex-item">
//                 <span className="label">Вживань:</span>
//                 <span className="value">{entry.usage_count}</span>
//               </div>
//             )}

//             {/* Додаткова інформація для словників перекладів */}
//             {isTranslationDict && (
//               <>
//                 {renderHebrewEquivalents(entry.hebrew_equivalents)}
//                 {renderLXXUsage(entry.lxx_usage)}
//               </>
//             )}
//           </div>
//         )}

//         {activeTab === "meanings" && (
//           <div className="meanings-content">
//             {renderMeanings(entry.meanings)}
//           </div>
//         )}

//         {activeTab === "definitions" && entry.definitions && (
//           <div className="definitions-content">
//             {renderDefinitions(entry.definitions)}
//           </div>
//         )}

//         {activeTab === "lxx" && entry.lxx_usage && (
//           <div className="lxx-content">{renderLXXUsage(entry.lxx_usage)}</div>
//         )}

//         {activeTab === "lsj" && (
//           <div className="lsj-content">
//             {renderLSJ(entry.lsj_definition_raw)}
//           </div>
//         )}

//         {activeTab === "grammar" && (
//           <div className="grammar-content">
//             {entry.morphology && (
//               <div className="mb-3">
//                 <h6>Морфологія:</h6>
//                 <pre className="bg-light rounded p-2 small">
//                   {entry.morphology}
//                 </pre>
//               </div>
//             )}
//             {entry.grammar && (
//               <div>
//                 <h6>Граматика:</h6>
//                 <pre className="bg-light rounded p-2 small">
//                   {entry.grammar}
//                 </pre>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Інформація про тип словника  - не зрозуміло виглядає!!!*/}
//       <div className="lexicon-footer mt-2 pt-2 border-top small text-muted">
//         {isTranslationDict ? (
//           <div className="d-flex justify-content-between align-items-center">
//             <span>Словник українського перекладу</span>
//             <span className="badge bg-success">UA</span>
//           </div>
//         ) : (
//           <div className="d-flex justify-content-between align-items-center">
//             <span>Strong's Dictionary</span>
//             <span className="badge bg-primary">EN</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LexiconWindow;

// ================

// src/components/LexiconWindow.js
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "../elements/CloseIcon";
import "../styles/LexiconWindow.css";
import { globalHistoryManager } from "../utils/historyManager";

import {
  formatWindowTitle,
  getWindowTypeByVersion,
} from "../utils/codeFormatter";

const LexiconWindow = memo(
  ({
    data,
    lang,
    onClose,
    coreData,
    origVer,
    windowIndex,
    totalWindows,
    isEmpty,
    // Нові пропси для навігації
    historyState,
    onNavigateBack,
    onNavigateForward,
    isNarrowScreen = false,
  }) => {
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("dictionary");
    const [isTranslationDict, setIsTranslationDict] = useState(false);
    const [entryId, setEntryId] = useState(null);

    const windowRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const strong = data?.word?.strong;
    const dictCode = data?.word?.dict;

    // Визначаємо тип вікна
    const isOriginal = getWindowTypeByVersion(origVer) === "original";

    useEffect(() => {
      console.log("📥 LexiconWindow отримав дані:", {
        word: data?.word?.word,
        strong: data?.word?.strong,
        dict: data?.word?.dict,
        origVer: origVer,
        isOriginal: isOriginal,
        timestamp: new Date().toISOString(),
      });

      if (!strong && !dictCode) {
        setLoading(false);
        setError("Немає даних для завантаження словника");
        // // Додаємо порожній запис в історію для навігації
        // addEmptyEntryToHistory();

        // return;

        // Створюємо ID для порожнього запису
        const emptyId = `empty_${Date.now()}_${strong || dictCode || "unknown"}`;
        setEntryId(emptyId);

        // Створюємо базовий запис для порожнього вікна
        const fallbackEntry = {
          strong: strong || "",
          word: data?.word?.word || "",
          translation: data?.word?.lemma || "",
          morphology: data?.word?.morph || "",
          dictCode: dictCode,
          _type: "fallback",
          _lang: dictCode ? dictCode.split("_")[1] || "uk" : "en",
          _isError: true,
          _errorMessage: "Немає даних для завантаження словника",
        };
        setEntry(fallbackEntry);

        addEmptyEntryToHistory(emptyId);

        return;
      }

      setLoading(true);
      setError(null);
      setEntry(null);

      // Генеруємо ID запису
      const currentEntryId = `${origVer || "unknown"}:${strong || dictCode}_${Date.now()}`;
      setEntryId(currentEntryId);

      const loadDictionary = async () => {
        let entryAddedToHistory = false;
        try {
          // 1. СПОЧАТКУ пробуємо завантажити словник перекладу (dictCode)
          if (dictCode) {
            console.log(
              "📚 LexiconWindow: Завантаження словника перекладу",
              dictCode,
            );

            const [strongCode, langCode] = dictCode.split("_");
            const category = strongCode.startsWith("G") ? "G" : "H"; // ← ВИПРАВЛЕНО

            // Формуємо правильний шлях до словника перекладу
            const dictPath = `/data/dictionaries/${langCode.toLowerCase()}/${category}/${dictCode}.json`;

            console.log("📂 Шлях до словника:", dictPath);

            try {
              const dictRes = await fetch(dictPath);
              if (dictRes.ok) {
                const dictData = await dictRes.json();
                console.log("✅ Словник перекладу завантажено");

                // Обробка даних словника перекладу
                const dictEntry = dictData[strongCode] || dictData;
                // setIsTranslationDict(true);
                const dictLanguage = langCode.toLowerCase();
                setIsTranslationDict(dictLanguage !== "en"); // Тільки якщо не англійський

                // setEntry({
                const loadedEntry = {
                  strong: strongCode,
                  word: dictEntry.w || dictEntry.word || data?.word?.word || "",
                  translit: dictEntry.t || dictEntry.translit || "",
                  translation:
                    dictEntry.tr ||
                    dictEntry.translation ||
                    dictEntry.translation_uk ||
                    "",
                  morphology:
                    dictEntry.m ||
                    dictEntry.morphology ||
                    data?.word?.morph ||
                    "",
                  meanings: dictEntry.mn || dictEntry.meanings || [],
                  definitions: dictEntry.definitions || {},
                  lxx_usage: dictEntry.lxx_usage || [],
                  hebrew_equivalents: dictEntry.hebrew_equivalents || [],
                  usage_count: dictEntry.uc || dictEntry.usage_count || 0,
                  // _type: "translation_dictionary",
                  // _lang: langCode,
                  // Додаємо в запис:
                  _type:
                    dictLanguage === "uk"
                      ? "ukrainian_dictionary"
                      : dictLanguage === "ru"
                        ? "russian_dictionary"
                        : "english_dictionary",
                  _lang: dictLanguage,
                  _dictCode: dictCode,
                  _id: currentEntryId,
                };
                // Позначаємо, що запис додано в історію
                //   entryAddedToHistory = true;
                //   setLoading(false);
                //   return true;
                // } else {
                //   console.log(
                //     "⚠️ Словник перекладу не знайдено за шляхом:",
                //     dictPath,
                //   );
                // }
                setEntry(loadedEntry);
                entryAddedToHistory = true;
                addSuccessEntryToHistory(loadedEntry);
                setLoading(false);
                return true;
              }
            } catch (dictErr) {
              console.error(
                "❌ Помилка завантаження словника перекладу:",
                dictErr,
              );
            }
          }

          // 2. ЯКЩО немає словника перекладу або не знайдено - завантажуємо Strong's
          console.log(
            "🔍 LexiconWindow: Завантаження Strong's словника",
            strong,
          );

          try {
            const strongRes = await fetch(`/data/strongs/${strong}.json`);
            if (!strongRes.ok) {
              throw new Error(
                `HTTP ${strongRes.status}: Strong's словник не знайдено`,
              );
            }

            const strongData = await strongRes.json();
            console.log("✅ Strong's словник завантажено");

            // Обробка даних Strong's
            const strongEntry = strongData[strong] || strongData;
            setIsTranslationDict(false);

            const loadedEntry = {
              strong: strong,
              word: strongEntry.w || strongEntry.word || data?.word?.word || "",
              translit: strongEntry.t || strongEntry.translit || "",
              translation: strongEntry.tr || strongEntry.translation || "",
              morphology:
                strongEntry.m ||
                strongEntry.morphology ||
                data?.word?.morph ||
                "",
              meanings: strongEntry.mn || strongEntry.meanings || [],
              definition: strongEntry.d || strongEntry.definition || "",
              lsj_definition_raw:
                strongEntry.lsj || strongEntry.lsj_definition_raw || "",
              grammar: strongEntry.g || strongEntry.grammar || "",
              usages_count: strongEntry.u || strongEntry.usages_count || 0,
              _type: "strongs_dictionary",
              _lang: "ua",
              _id: currentEntryId,
            };
            // Позначаємо, що запис додано в історію
            setEntry(loadedEntry);
            entryAddedToHistory = true;
            addSuccessEntryToHistory(loadedEntry);
            return;
          } catch (strongErr) {
            console.error("❌ Помилка завантаження Strong's:", strongErr);
            throw strongErr;
          }
        } catch (err) {
          console.error(
            "❌ LexiconWindow: Загальна помилка завантаження словника",
            err,
          );
          setError(`Помилка завантаження: ${err.message}`);

          // // Якщо не вдалося завантажити - створюємо базовий запис
          // if (data?.word) {
          //   const fallbackEntry = {
          //     strong: strong,
          //     word: data.word.word || "",
          //     translation: data.word.lemma || "",
          //     morphology: data.word.morph || "",
          //     dictCode: dictCode,
          //     _type: "fallback",
          //     _error: `Не вдалося завантажити словник: ${err.message}`,
          //     _lang: dictCode ? dictCode.split("_")[1] || "uk" : "en",
          //   };
          //   // Додаємо запис з помилкою в історію
          //   setEntry(fallbackEntry);
          //   addErrorEntryToHistory(err.message);
          //   entryAddedToHistory = true;
          // } else {
          //   setError(`Помилка завантаження: ${err.message}`);
          // }
          // Створюємо fallback запис навіть при помилці
          const fallbackEntry = {
            strong: strong,
            word: data?.word?.word || "",
            translation: data?.word?.lemma || "",
            morphology: data?.word?.morph || "",
            dictCode: dictCode,
            _type: "fallback",
            _error: err.message,
            _lang: dictCode ? dictCode.split("_")[1] || "uk" : "en",
            _id: currentEntryId,
            _isFallback: true,
          };

          setEntry(fallbackEntry);
          addErrorEntryToHistory(fallbackEntry, err.message);
          entryAddedToHistory = true;
        } finally {
          setLoading(false);
          // Якщо не додано запис в історію (не знайдено файл) - додаємо порожній
          // if (!entryAddedToHistory && strong) {
          //   addEmptyEntryToHistory();
          // }
          // if (!entryAddedToHistory && (strong || dictCode)) {
          //   addEmptyEntryToHistory();
          // }
          // Якщо запис ще не додано в історію - додаємо fallback
          if (!entryAddedToHistory && (strong || dictCode)) {
            const fallbackEntry = {
              strong: strong,
              word: data?.word?.word || "",
              translation: data?.word?.lemma || "",
              morphology: data?.word?.morph || "",
              dictCode: dictCode,
              _type: "fallback",
              _error: "Не вдалося завантажити словник",
              _lang: dictCode ? dictCode.split("_")[1] || "uk" : "en",
              _id: currentEntryId,
              _isFallback: true,
            };
            setEntry(fallbackEntry);
            addErrorEntryToHistory(
              fallbackEntry,
              "Не вдалося завантажити словник",
            );
          }
        }
      };

      loadDictionary();
    }, [strong, dictCode, data?.word, origVer, isOriginal]);

    // Додаємо нові функції для обробки історії
    const addSuccessEntryToHistory = useCallback(
      (entryData) => {
        if (!data?.word) return;

        const entryId = `empty_${Date.now()}_${strong || dictCode || "unknown"}`;

        // const emptyEntry = {
        const successEntry = {
          // id: `empty_${Date.now()}`,
          id: entryId,
          data: data,
          origVer: origVer,
          // word: {
          //   word: data.word.word || "",
          //   strong: data.word.strong || "",
          //   lemma: data.word.lemma || "",
          //   morph: data.word.morph || "",
          //   dict: data.word.dict || "",
          // },
          word: {
            word: data.word.word || entryData.word || "",
            strong: data.word.strong || entryData.strong || "",
            lemma: data.word.lemma || "",
            morph: data.word.morph || entryData.morphology || "",
            dict: data.word.dict || entryData._dictCode || "",
          },
          lang: data.word.strong?.startsWith("H") ? "he" : "gr",
          // isOriginal: false,
          isOriginal: isOriginal,
          timestamp: Date.now(),
          // isEmpty: true,
          isEmpty: false,
          // hasError: false,
          isError: false,
          hasData: true,
          code: strong || dictCode,
          entryData: entryData, // Зберігаємо оригінальні дані
        };

        // Оновлюємо глобальну історію
        const manager = globalHistoryManager.getManager("global");
        manager.addEntry(successEntry);

        console.log("📝 Додано порожній запис в історію:", {
          id: entryId,
          // code: emptyEntry.code,
          code: successEntry.code,
          // isOriginal: isOriginal,
          hasData: true,
        });
      },
      [data, origVer, strong, dictCode, isOriginal],
    );

    const addEmptyEntryToHistory = useCallback(
      (entryId) => {
        if (!data?.word) return;

        // const entryId = `empty_${Date.now()}_${strong || dictCode || "unknown"}`;

        const emptyEntry = {
          // id: `error_${Date.now()}`,
          id: entryId,
          data: data,
          origVer: origVer,
          word: {
            word: data.word.word || "",
            strong: data.word.strong || "",
            lemma: data.word.lemma || "",
            morph: data.word.morph || "",
            dict: data.word.dict || "",
          },
          lang: data.word.strong?.startsWith("H") ? "he" : "gr",
          // isOriginal: false,
          isOriginal: isOriginal,
          timestamp: Date.now(),
          // isError: true,
          // error: errorMessage,
          isEmpty: true,
          // hasError: false,
          isError: false,
          hasData: false,
          code: strong || dictCode,
        };

        // Оновлюємо глобальну історію
        const manager = globalHistoryManager.getManager("global");
        manager.addEntry(emptyEntry);

        console.log("📝 Додано порожній запис в історію:", {
          id: entryId,
          code: emptyEntry.code,
          isEmpty: true,
          // isOriginal: isOriginal,
        });
      },
      [data, origVer, strong, dictCode, isOriginal],
    );

    // const addErrorEntryToHistory = useCallback(
    //   (errorMessage) => {
    //     if (!data?.word) return;

    //     const entryId = `error_${Date.now()}_${strong || dictCode || "unknown"}`;

    //     const errorEntry = {
    //       id: entryId,
    //       data: data,
    //       origVer: origVer,
    //       word: {
    //         word: data.word.word || "",
    //         strong: data.word.strong || "",
    //         lemma: data.word.lemma || "",
    //         morph: data.word.morph || "",
    //         dict: data.word.dict || "",
    //       },
    //       lang: data.word.strong?.startsWith("H") ? "he" : "gr",
    //       isOriginal: isOriginal,
    //       timestamp: Date.now(),
    //       isError: true,
    //       error: errorMessage,
    //       code: strong || dictCode,
    //     };

    //     const manager = globalHistoryManager.getManager("global");
    //     manager.addEntry(errorEntry);

    //     console.log("📝 Додано запис з помилкою в історію:", {
    //       id: entryId,
    //       code: errorEntry.code,
    //       error: errorMessage,
    //     });
    //   },
    //   [data, origVer, strong, dictCode, isOriginal],
    // );
    const addErrorEntryToHistory = useCallback(
      (entryData, errorMessage) => {
        const errorEntry = {
          id:
            entryData._id ||
            `error_${Date.now()}_${strong || dictCode || "unknown"}`,
          data: data,
          origVer: origVer,
          word: {
            word: data?.word?.word || entryData.word || "",
            strong: data?.word?.strong || entryData.strong || "",
            lemma: data?.word?.lemma || "",
            morph: data?.word?.morph || entryData.morphology || "",
            dict: data?.word?.dict || entryData.dictCode || "",
          },
          lang: data?.word?.strong?.startsWith("H") ? "he" : "gr",
          isOriginal: isOriginal,
          timestamp: Date.now(),
          isEmpty: false,
          isError: true,
          hasData: true,
          code: strong || dictCode,
          error: errorMessage,
          entryData: entryData, // Зберігаємо fallback дані
        };

        const manager = globalHistoryManager.getManager("global");
        manager.addEntry(errorEntry);

        console.log("📝 Додано запис з помилкою в історію:", {
          id: errorEntry.id,
          code: errorEntry.code,
          error: errorMessage,
        });
      },
      [data, origVer, strong, dictCode, isOriginal],
    );

    // Ефект для свайпу на мобільних пристроях 23.01.2026
    useEffect(() => {
      if (!isNarrowScreen || !windowRef.current) return;

      const element = windowRef.current;

      const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
      };

      const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleSwipe();
      };

      const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0 && historyState?.canGoForward && onNavigateForward) {
            onNavigateForward();
          } else if (diff < 0 && historyState?.canGoBack && onNavigateBack) {
            onNavigateBack();
          }
        }
      };

      element.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isNarrowScreen, historyState, onNavigateBack, onNavigateForward]);

    // Обробники кліків на стрілки навігації
    const handleBackClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (historyState?.canGoBack && onNavigateBack) {
          onNavigateBack();
        }
      },
      [historyState, onNavigateBack],
    );

    const handleForwardClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (historyState?.canGoForward && onNavigateForward) {
          onNavigateForward();
        }
      },
      [historyState, onNavigateForward],
    );
    // ============================ Ефект для свайпу на мобільних пристроях 23.01.2026 end

    // Обробка посилань у тексті
    const parseRef = (ref) => {
      const match = ref.match(/([A-Z]+)\.(\d+):(\d+)/);
      if (!match) return null;
      const [, book, ch, v] = match;

      const testament = book.match(
        /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
      )
        ? "NewT"
        : "OldT";

      let bookData = null;
      if (coreData) {
        const versions = ["lxx", "thot", "tr", "gnt"];
        for (const ver of versions) {
          if (coreData[ver] && coreData[ver][testament]) {
            bookData = coreData[ver][testament]
              .flatMap((g) => g.books)
              .find((b) => b.code === book);
            if (bookData) break;
          }
        }
      }

      if (!bookData) return null;
      return { book: bookData.code, chapter: ch, verse: v };
    };

    const renderWithLinks = (text) => {
      if (!text || typeof text !== "string") return text;

      return text
        .split(/(\[[^\]]+\]|\([^\)]+\)|\b[A-Z]+\.\d+:\d+\b)/g)
        .map((part, i) => {
          if (part.match(/^\[[^\]]+\]$/)) {
            return (
              <sup key={i} className="text-muted">
                [посилання]
              </sup>
            );
          }
          if (part.match(/^\([^\)]+\)$/)) {
            return (
              <span key={i} className="text-muted">
                {part}
              </span>
            );
          }
          const ref = parseRef(part);
          if (ref) {
            return (
              <Link
                key={i}
                to={`/?ref=${ref.book}.${ref.chapter}#v${ref.verse}`}
                className="text-primary text-decoration-underline"
                title={`Відкрити ${ref.book} ${ref.chapter}:${ref.verse}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Перехід до:", ref);
                }}
              >
                {part}
              </Link>
            );
          }
          return part;
        });
    };

    const renderLSJ = (text) => {
      if (!text || text.trim() === "") {
        return <p className="text-muted p-3">Немає даних LSJ</p>;
      }

      const sections = text.split(/__(.+?)__/).filter(Boolean);
      if (sections.length === 0) {
        return (
          <p
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
          />
        );
      }

      return sections.map((sec, i) => {
        if (i % 2 === 0) {
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: sec.replace(/\n/g, "<br>") }}
            />
          );
        } else {
          return (
            <h6 key={i} className="mt-3 text-primary">
              {sec}
            </h6>
          );
        }
      });
    };

    const renderMeanings = (meanings) => {
      if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
        return <p className="text-muted p-3">Немає значень</p>;
      }

      return (
        <ul className="list-unstyled">
          {meanings.map((meaning, i) => (
            <li key={i} className="mb-2">
              {typeof meaning === "string"
                ? renderWithLinks(meaning)
                : String(meaning)}
            </li>
          ))}
        </ul>
      );
    };

    const renderDefinitions = (definitions) => {
      if (!definitions || typeof definitions !== "object") {
        return null;
      }

      return (
        <div className="definitions-content">
          {Object.entries(definitions).map(([key, value]) => (
            <div key={key} className="mb-3">
              <h6 className="text-primary">
                {key.replace("_", " ").toUpperCase()}:
              </h6>
              {typeof value === "object" ? (
                <ul className="list-unstyled ms-3">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey} className="mb-1">
                      <strong>{subKey}:</strong> {String(subValue)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      );
    };

    const renderLXXUsage = (usage) => {
      if (!usage || !Array.isArray(usage) || usage.length === 0) {
        return null;
      }

      return (
        <div className="lxx-usage mt-3">
          <h6 className="text-primary">Використання в LXX:</h6>
          <ul className="list-unstyled">
            {usage.map((item, i) => (
              <li key={i} className="mb-2 small">
                {renderWithLinks(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    const renderHebrewEquivalents = (equivalents) => {
      if (
        !equivalents ||
        !Array.isArray(equivalents) ||
        equivalents.length === 0
      ) {
        return null;
      }

      return (
        <div className="hebrew-equivalents mt-3">
          <h6 className="text-primary">Єврейські еквіваленти:</h6>
          <ul className="list-unstyled">
            {equivalents.map((item, i) => (
              <li key={i} className="mb-1">
                {renderWithLinks(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    if (!strong && !dictCode) {
      return (
        <div className="lexicon-window">
          <h5 className="lexicon-title">
            {lang.lexicon || "Лексикон"}
            {onClose && <CloseIcon onClick={onClose} />}
          </h5>
          <div className="text-muted text-center p-3">Оберіть слово</div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="lexicon-window">
          <h5 className="lexicon-title">
            {dictCode || strong}
            {onClose && <CloseIcon onClick={onClose} />}
          </h5>
          <div className="p-3 text-center">
            <div
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            >
              <span className="visually-hidden">Завантаження...</span>
            </div>
            Завантаження словника...
          </div>
        </div>
      );
    }

    if (error || !entry) {
      return (
        <div className="lexicon-window">
          <h5 className="lexicon-title">
            {dictCode || strong}
            {onClose && <CloseIcon onClick={onClose} />}
          </h5>
          <div className="p-3 text-danger text-center">
            {error || "Дані відсутні"}
            <div className="mt-2 small text-muted">
              {dictCode && <div>Словник: {dictCode}</div>}
              {strong && <div>Strong: {strong}</div>}
              {entry?._type && <div>Тип: {entry._type}</div>}
            </div>
          </div>
        </div>
      );
    }
    // Додайте функцію для отримання назви мови:
    const getLanguageName = (langCode) => {
      const languages = {
        uk: "українська",
        en: "англійська",
        ru: "російська",
        gr: "грецька",
        he: "єврейська",
      };
      return languages[langCode] || langCode;
    };

    // // Заголовок з навігацією
    // const renderHeader = () => {
    //   // Визначаємо тип вікна для заголовка
    //   let windowType = "";
    //   if (isNarrowScreen) {
    //     windowType = "Словник";
    //   } else {
    //     windowType = windowIndex === 0 ? "Orig" : "Trans";
    //   }

    //   return (
    //     <div className="lexicon-header-with-nav">
    //       <div className="nav-controls">
    //         <button
    //           className={`nav-arrow ${!historyState?.canGoBack ? "disabled" : ""}`}
    //           onClick={handleBackClick}
    //           disabled={!historyState?.canGoBack}
    //           title="Назад"
    //         >
    //           ‹
    //         </button>

    //         <span className="nav-position">
    //           {historyState?.position || "1/1"}
    //         </span>

    //         <button
    //           className={`nav-arrow ${!historyState?.canGoForward ? "disabled" : ""}`}
    //           onClick={handleForwardClick}
    //           disabled={!historyState?.canGoForward}
    //           title="Вперед"
    //         >
    //           ›
    //         </button>
    //       </div>

    //       <div className="lexicon-title-content">
    //         <div>
    //           <strong>{entry?.word || data?.word?.word || "Словник"}</strong>
    //           {/* {entry?.translit && ` (${entry.translit})`} */}
    //           <small className="text-muted ms-2">
    //             • {entry?.strong || strong}
    //             <span className="window-type-badge ms-2">{windowType}</span>
    //           </small>
    //         </div>
    //       </div>

    //       {onClose && <CloseIcon onClick={onClose} />}
    //     </div>
    //   );
    // };
    // Заголовок з навігацією
    const renderHeader = () => {
      // Форматуємо заголовок вікна
      // const titleInfo = formatWindowTitle(entry, isOriginal, windowIndex);
      const titleInfo = formatWindowTitle(entry || {}, isOriginal, windowIndex);

      // Визначаємо тип вікна для бейджа
      let windowTypeBadge = "";
      let badgeClass = "text-primary";

      if (isNarrowScreen) {
        windowTypeBadge = "Словник";
      } else {
        windowTypeBadge = isOriginal ? "Orig" : titleInfo.typeBadge;
      }

      // // Визначаємо колір бейджа
      // const badgeClass = entry?._type?.includes("dictionary")
      //   ? entry._lang === "uk"
      //     ? "text-success"
      //     : "text-info"
      //   : "text-primary";
      // Визначаємо колір бейджа
      if (entry?._type?.includes("dictionary")) {
        badgeClass = entry._lang === "uk" ? "text-success" : "text-info";
      } else if (entry?._type === "fallback" || entry?._isFallback) {
        badgeClass = "text-danger";
      } else if (entry?._type === "strongs_dictionary") {
        badgeClass = "text-primary";
      }

      // Код для відображення
      const displayCode =
        strong || dictCode || entry?.strong || entry?._dictCode || "";

      return (
        <div className="lexicon-header-with-nav">
          <div className="nav-controls">
            <button
              className={`nav-arrow ${!historyState?.canGoBack ? "disabled" : ""}`}
              onClick={handleBackClick}
              disabled={!historyState?.canGoBack}
              title="Назад"
            >
              ‹
            </button>

            <span className="nav-position">
              {historyState?.position || "1/1"}
            </span>

            <button
              className={`nav-arrow ${!historyState?.canGoForward ? "disabled" : ""}`}
              onClick={handleForwardClick}
              disabled={!historyState?.canGoForward}
              title="Вперед"
            >
              ›
            </button>
          </div>

          {/* <div className="lexicon-title-content">
            <div>
              <strong>{titleInfo.main}</strong>
              <small className="text-muted ms-2">
                • {titleInfo.code}
                <span className={`window-type-badge ms-2 ${badgeClass}`}>
                  {windowTypeBadge}
                </span>
              </small>
            </div>
          </div> */}
          <div className="lexicon-title-content">
            <div>
              <strong>{titleInfo.main || displayCode}</strong>
              {displayCode && (
                <small className="text-muted ms-2">
                  • {displayCode}
                  <span className={`window-type-badge ms-2 ${badgeClass}`}>
                    {windowTypeBadge}
                  </span>
                </small>
              )}
            </div>
          </div>

          {onClose && <CloseIcon onClick={onClose} />}
        </div>
      );
    };
    // Індикатор свайпу для мобільних
    const renderSwipeIndicator = () => {
      if (!isNarrowScreen) return null;

      return (
        <div className="swipe-indicator">
          <small>
            {historyState?.canGoBack && "← Свайп вліво для попереднього "}
            {historyState?.canGoBack && historyState?.canGoForward && " • "}
            {historyState?.canGoForward && "Свайп вправо для наступного →"}
          </small>
        </div>
      );
    };
    // Решта компонента залишається без змін (рендер вмісту)
    // ... (parseRef, renderWithLinks, renderLSJ, renderMeanings тощо залишаються як були)
    // ВИПРАВЛЕНО: Функція для відображення fallback вмісту
    const renderFallbackContent = () => {
      if (!entry || entry._type !== "fallback") return null;

      return (
        <div className="fallback-content p-3">
          <div className="alert alert-warning">
            <h6 className="alert-heading">Словник не знайдено</h6>
            <p className="mb-2">
              Для коду: <strong>{entry.strong || entry.dictCode}</strong>
            </p>
            {entry._error && (
              <p className="small mb-2">
                <strong>Помилка:</strong> {entry._error}
              </p>
            )}
            <hr />
            <div className="small text-muted">
              <p className="mb-1">Це може бути через:</p>
              <ul className="mb-0">
                <li>Файл словника відсутній на сервері</li>
                <li>Неправильний шлях до файлу</li>
                <li>Проблеми з мережевим з'єднанням</li>
              </ul>
            </div>
          </div>
        </div>
      );
    };

    if (isEmpty) {
      return (
        <div className="lexicon-window empty-window" ref={windowRef}>
          {/* <h5 className="lexicon-title">
            {windowIndex === 0 ? "Оригінал" : "Переклад"}
            {onClose && <CloseIcon onClick={onClose} />}
          </h5> */}
          {renderHeader()}
          <div className="text-muted text-center p-3">
            <small>Оберіть слово для відображення словника</small>
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    if (!strong && !dictCode) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          <h5 className="lexicon-title">
            {lang.lexicon || "Лексикон"}
            {onClose && <CloseIcon onClick={onClose} />}
          </h5>
          <div className="text-muted text-center p-3">Оберіть слово</div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          {renderHeader()}
          <div className="p-3 text-center">
            <div
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            >
              <span className="visually-hidden">Завантаження...</span>
            </div>
            Завантаження словника...
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }
    // ВИПРАВЛЕНО: Рендер для fallback запису
    if (entry?._type === "fallback" || entry?._isFallback) {
      return (
        <div className="lexicon-window fallback-window" ref={windowRef}>
          {renderHeader()}
          {renderFallbackContent()}
          {renderSwipeIndicator()}
        </div>
      );
    }
    if (error || !entry) {
      return (
        <div className="lexicon-window" ref={windowRef}>
          {renderHeader()}
          <div className="p-3 text-danger text-center">
            {error || "Дані відсутні"}
            <div className="mt-2 small text-muted">
              {dictCode && <div>Словник: {dictCode}</div>}
              {strong && <div>Strong: {strong}</div>}
              {entry?._type && <div>Тип: {entry._type}</div>}
            </div>
          </div>
          {renderSwipeIndicator()}
        </div>
      );
    }

    // Футер з інформацією про тип словника
    const renderFooter = () => {
      if (entry._type === "strongs_dictionary") {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-primary">• Strong's Dictionary •</span>
            <span className="badge bg-primary">UA</span>
          </div>
        );
      } else if (entry._type.includes("dictionary")) {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-success">
              • Словник • {getLanguageName(entry._lang)} •
            </span>
            <span
              className={`badge bg-${entry._lang === "uk" ? "success" : "info"}`}
            >
              {entry._lang.toUpperCase()}
            </span>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="lexicon-window" ref={windowRef}>
        {renderHeader()}
        {/* <h5 className="lexicon-title">
          <div>
            <strong>{entry.word}</strong>
            {entry.translit && ` (${entry.translit})`}
            <small className="text-muted ms-2">
              • {entry.strong || strong} */}
        {/* {isTranslationDict && (
              <span className="badge bg-success ms-2">UA</span>
            )} */}
        {/* </small>
          </div>
          {onClose && <CloseIcon onClick={onClose} />}
        </h5> */}

        <div className="lexicon-tabs">
          <button
            className={activeTab === "dictionary" ? "active" : ""}
            onClick={() => setActiveTab("dictionary")}
          >
            {/* {isTranslationDict ? "Словник UA" : "Словник"} */}
            {entry._type === "strongs_dictionary" ? "Strong" : "Словник"}
          </button>

          {entry.meanings && entry.meanings.length > 0 && (
            <button
              className={activeTab === "meanings" ? "active" : ""}
              onClick={() => setActiveTab("meanings")}
            >
              Значення
            </button>
          )}

          {entry.definitions && Object.keys(entry.definitions).length > 0 && (
            <button
              className={activeTab === "definitions" ? "active" : ""}
              onClick={() => setActiveTab("definitions")}
            >
              Визначення
            </button>
          )}

          {entry.lxx_usage && entry.lxx_usage.length > 0 && (
            <button
              className={activeTab === "lxx" ? "active" : ""}
              onClick={() => setActiveTab("lxx")}
            >
              LXX
            </button>
          )}

          {entry.lsj_definition_raw && entry.lsj_definition_raw.trim() && (
            <button
              className={activeTab === "lsj" ? "active" : ""}
              onClick={() => setActiveTab("lsj")}
            >
              LSJ
            </button>
          )}

          {(entry.grammar || entry.morphology) && (
            <button
              className={activeTab === "grammar" ? "active" : ""}
              onClick={() => setActiveTab("grammar")}
            >
              Граматика
            </button>
          )}
        </div>

        <div className="lexicon-content">
          {activeTab === "dictionary" && (
            <div className="dictionary-content">
              {entry.word && (
                <div className="lex-item">
                  <span className="label">Слово:</span>
                  <span
                    className={`value ${
                      entry.strong?.startsWith("H") ? "he" : "gr"
                    }`}
                  >
                    {entry.word}
                  </span>
                </div>
              )}

              {entry.translit && (
                <div className="lex-item">
                  <span className="label">Трансліт:</span>
                  <span className="value">{entry.translit}</span>
                </div>
              )}

              {entry.translation && (
                <div className="lex-item">
                  <span className="label">Переклад:</span>
                  <span className="value uk">{entry.translation}</span>
                </div>
              )}

              {entry.morphology && (
                <div className="lex-item">
                  <span className="label">Морфологія:</span>
                  <span className="value">{entry.morphology}</span>
                </div>
              )}

              {entry.usage_count > 0 && (
                <div className="lex-item">
                  <span className="label">Вживань:</span>
                  <span className="value">{entry.usage_count}</span>
                </div>
              )}

              {/* Додаткова інформація для словників перекладів */}
              {isTranslationDict && (
                <>
                  {renderHebrewEquivalents(entry.hebrew_equivalents)}
                  {renderLXXUsage(entry.lxx_usage)}
                </>
              )}
            </div>
          )}

          {activeTab === "meanings" && (
            <div className="meanings-content">
              {renderMeanings(entry.meanings)}
            </div>
          )}

          {activeTab === "definitions" && entry.definitions && (
            <div className="definitions-content">
              {renderDefinitions(entry.definitions)}
            </div>
          )}

          {activeTab === "lxx" && entry.lxx_usage && (
            <div className="lxx-content">{renderLXXUsage(entry.lxx_usage)}</div>
          )}

          {activeTab === "lsj" && (
            <div className="lsj-content">
              {renderLSJ(entry.lsj_definition_raw)}
            </div>
          )}

          {activeTab === "grammar" && (
            <div className="grammar-content">
              {entry.morphology && (
                <div className="mb-3">
                  <h6>Морфологія:</h6>
                  <pre className="bg-light rounded p-2 small">
                    {entry.morphology}
                  </pre>
                </div>
              )}
              {entry.grammar && (
                <div>
                  <h6>Граматика:</h6>
                  <pre className="bg-light rounded p-2 small">
                    {entry.grammar}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lexicon-footer mt-2 pt-2 border-top small">
          {renderFooter()}
          {/* {entry._type === "strongs_dictionary" ? (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-primary">• Strong's Dictionary •</span>
              <span className="badge bg-primary">ua</span>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-success">
                • Словник ({getLanguageName(entry._lang)})
              </span>
              <span
                className={`badge bg-${
                  entry._lang === "uk" ? "success" : "info"
                }`}
              >
                {entry._lang.toUpperCase()}
              </span>
            </div>
          )} */}
        </div>
        {renderSwipeIndicator()}
      </div>
    );
  },
);

export default LexiconWindow;
