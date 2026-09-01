// TranslationSelector.js

// import React, { useState, useEffect, useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import TranslationTabs from "../elements/TranslationTabs";
// import LanguageFilter from "../elements/LanguageFilter";
// import TranslationFooter from "../elements/TranslationFooter";
// import "../styles/TranslationSelector.css";

// const TranslationSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   onSelectVersions,
// }) => {
//   const [translations, setTranslations] = useState({
//     bibles: [],
//     commentaries: [],
//   });
//   const [selectedVersions, setSelectedVersions] = useState([]);
//   const [activeTab, setActiveTab] = useState("bibleList");
//   const [languageFilter, setLanguageFilter] = useState("_all");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const loadTranslations = async () => {
//       try {
//         const res = await fetch("/data/translations.json");
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();

//         if (!isMounted) return;

//         setTranslations(data);

//         // ТИПОВИЙ ВИБІР
//         const defaults = ["LXX", "UTT"].filter((v) =>
//           data.bibles.some((b) => b.initials === v)
//         );
//         setSelectedVersions(defaults);
//         onSelectVersions(defaults);
//       } catch (err) {
//         console.error("Failed to load translations.json", err);
//         if (isMounted) {
//           // ← ЗАХИСТ: мінімальний список
//           const fallback = {
//             bibles: [
//               {
//                 initials: "LXX",
//                 name: "Septuagint",
//                 lang: "grc",
//                 features: ["originals"],
//               },
//               {
//                 initials: "UTT",
//                 name: "Український переклад",
//                 lang: "uk",
//                 features: ["R"],
//               },
//               {
//                 initials: "THOT",
//                 name: "Translators Hebrew Old Testament",
//                 lang: "he",
//                 features: ["originals", "N", "G", "V", "I"],
//               },
//               {
//                 initials: "UBT",
//                 name: "Українська Біблія (класичний, масоретський)",
//                 lang: "uk",
//                 features: ["R"],
//               },
//             ],
//             commentaries: [],
//           };
//           setTranslations(fallback);
//           setSelectedVersions(["LXX", "UTT"]);
//           onSelectVersions(["LXX", "UTT"]);
//         }
//       }
//     };

//     loadTranslations();

//     return () => {
//       isMounted = false;
//     };
//   }, [onSelectVersions]);

//   // === ФІЛЬТРАЦІЯ ===
//   const filteredItems = useMemo(() => {
//     const list =
//       activeTab === "bibleList"
//         ? translations.bibles
//         : translations.commentaries;

//     return list.filter((item) => {
//       const isOriginal = item.features?.includes("originals");
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         (languageFilter === "_ancient" && isOriginal);

//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchesLang && matchesSearch;
//     });
//   }, [translations, activeTab, languageFilter, searchQuery]);

//   // === ГРУПУВАННЯ ===
//   const groupedItems = useMemo(() => {
//     const groups = {};
//     filteredItems.forEach((item) => {
//       const isOriginal = item.features?.includes("originals");
//       const key =
//         languageFilter === "_ancient" && isOriginal
//           ? "_ancient"
//           : item.lang || "_other";

//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });
//     return groups;
//   }, [filteredItems, languageFilter]);

//   const handleCheckboxChange = (initials) => {
//     setSelectedVersions((prev) =>
//       prev.includes(initials)
//         ? prev.filter((v) => v !== initials)
//         : [...prev, initials]
//     );
//   };

//   const handleApply = () => {
//     onSelectVersions(selectedVersions);
//     onRequestClose();
//   };

//   if (!isOpen) return null;

//   const totalCount =
//     activeTab === "bibleList"
//       ? translations.bibles.length
//       : translations.commentaries.length;

//   const featuresMap = {
//     originals: lang.originals || "Оригінал",
//     N: lang.notes || "Примітки",
//     G: lang.grammar || "Граматика",
//     V: lang.vocab || "Словник",
//     I: lang.interlinear || "Міжрядковий",
//     S: lang.septuagint || "Септуагінта",
//     R: lang.red_letter || "Червоні слова",
//   };

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content stepModalFgBg">
//             <div className="modal-body">
//               <TranslationTabs
//                 lang={lang}
//                 activeTab={activeTab}
//                 onTabChange={setActiveTab}
//               />
//               <CloseIcon onClick={onRequestClose} />

//               <LanguageFilter
//                 lang={lang}
//                 languageFilter={languageFilter}
//                 onFilterChange={setLanguageFilter}
//               />

//               <div className="tab-content" style={{ marginTop: 15 }}>
//                 <div
//                   className={`tab-pane ${
//                     activeTab === "bibleList" ? "active" : ""
//                   }`}
//                   id="bibleList"
//                 >
//                   {Object.entries(groupedItems).map(([langKey, items]) => {
//                     const langName =
//                       langKey === "_ancient"
//                         ? lang.ancient || "Стародавня"
//                         : langKey === "uk"
//                         ? lang.ukrainian || "Українська"
//                         : langKey === "en"
//                         ? lang.english || "English"
//                         : langKey === "ru"
//                         ? lang.russian || "Русский"
//                         : langKey;

//                     return (
//                       <div key={langKey} className="lang-group">
//                         <button className="langBtn stepButton stepPressedButton">
//                           {langName}&nbsp;
//                           <span className="langPlusMinus">-</span>
//                         </button>
//                         <ul className="list-group langUL">
//                           {items.map((item) => (
//                             <li
//                               key={item.initials}
//                               className="list-group-item stepModalFgBg"
//                               data-initials={item.initials}
//                             >
//                               <input
//                                 type="checkbox"
//                                 className="list-group-checkbox"
//                                 checked={selectedVersions.includes(
//                                   item.initials
//                                 )}
//                                 onChange={() =>
//                                   handleCheckboxChange(item.initials)
//                                 }
//                               />
//                               &nbsp;
//                               <span
//                                 className="resource"
//                                 role="button"
//                                 onClick={() => {}}
//                                 style={{ cursor: "default" }}
//                               >
//                                 {item.initials} - {item.name}
//                               </span>
//                               <span
//                                 className="BibleFeatures"
//                                 style={{ float: "right" }}
//                               >
//                                 {item.features?.map((f) => (
//                                   <span
//                                     key={f}
//                                     className="versionFeature"
//                                     title={featuresMap[f] || f}
//                                   >
//                                     {f}
//                                   </span>
//                                 ))}
//                                 &nbsp;
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <TranslationFooter
//               lang={lang}
//               filteredCount={filteredItems.length}
//               totalCount={totalCount}
//               searchQuery={searchQuery}
//               onSearchChange={setSearchQuery}
//               onApply={handleApply}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TranslationSelector;

// // TranslationSelector.js 29.12.2025
// import React, { useState, useEffect, useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import TranslationTabs from "../elements/TranslationTabs";
// import LanguageFilter from "../elements/LanguageFilter";
// import TranslationFooter from "../elements/TranslationFooter";
// import "../styles/TranslationSelector.css";

// const TranslationSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   onSelectVersions,
// }) => {
//   const [translations, setTranslations] = useState({
//     bibles: [],
//     commentaries: [],
//   });
//   const [selectedVersions, setSelectedVersions] = useState([]);
//   const [activeTab, setActiveTab] = useState("bibleList");
//   const [languageFilter, setLanguageFilter] = useState("_all");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const loadTranslations = async () => {
//       try {
//         const res = await fetch("/data/translations.json");
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();

//         if (!isMounted) return;

//         setTranslations(data);

//         // ТИПОВИЙ ВИБІР
//         const defaults = ["LXX", "UTT"].filter((v) =>
//           data.bibles.some((b) => b.initials === v)
//         );
//         setSelectedVersions(defaults);
//         onSelectVersions(defaults);
//       } catch (err) {
//         console.error("Failed to load translations.json", err);
//         if (isMounted) {
//           // ← ЗАХИСТ: мінімальний список
//           const fallback = {
//             bibles: [
//               {
//                 initials: "LXX",
//                 name: "Septuagint",
//                 lang: "grc",
//                 features: ["originals"],
//               },
//               {
//                 initials: "UTT",
//                 name: "Український переклад",
//                 lang: "uk",
//                 features: ["R"],
//               },
//               {
//                 initials: "THOT",
//                 name: "Translators Hebrew Old Testament",
//                 lang: "he",
//                 features: ["originals", "N", "G", "V", "I"],
//               },
//               {
//                 initials: "UBT",
//                 name: "Українська Біблія (класичний, масоретський)",
//                 lang: "uk",
//                 features: ["R"],
//               },
//             ],
//             commentaries: [],
//           };
//           setTranslations(fallback);
//           setSelectedVersions(["LXX", "UTT"]);
//           onSelectVersions(["LXX", "UTT"]);
//         }
//       }
//     };

//     loadTranslations();

//     return () => {
//       isMounted = false;
//     };
//   }, [onSelectVersions]);

//   // === ФІЛЬТРАЦІЯ ===
//   const filteredItems = useMemo(() => {
//     const list =
//       activeTab === "bibleList"
//         ? translations.bibles
//         : translations.commentaries;

//     return list.filter((item) => {
//       const isOriginal = item.features?.includes("originals");
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         (languageFilter === "_ancient" && isOriginal);

//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchesLang && matchesSearch;
//     });
//   }, [translations, activeTab, languageFilter, searchQuery]);

//   // === ГРУПУВАННЯ ===
//   const groupedItems = useMemo(() => {
//     const groups = {};
//     filteredItems.forEach((item) => {
//       const isOriginal = item.features?.includes("originals");
//       const key =
//         languageFilter === "_ancient" && isOriginal
//           ? "_ancient"
//           : item.lang || "_other";

//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });
//     return groups;
//   }, [filteredItems, languageFilter]);

//   const handleCheckboxChange = (initials) => {
//     setSelectedVersions((prev) => {
//       let newSelected = prev.includes(initials)
//         ? prev.filter((v) => v !== initials)
//         : [...prev, initials];
//       // ← НОВЕ: не дозволяємо 0 вибраних
//       if (newSelected.length === 0) {
//         newSelected = prev; // Або дефолт, але поки зберігаємо попереднє
//         alert(lang.select_at_least_one || "Оберіть хоча б одну версію!");
//       }
//       return newSelected;
//     });
//   };

//   const handleApply = () => {
//     onSelectVersions(selectedVersions);
//     onRequestClose();
//   };

//   if (!isOpen) return null;

//   const totalCount =
//     activeTab === "bibleList"
//       ? translations.bibles.length
//       : translations.commentaries.length;

//   const featuresMap = {
//     originals: lang.originals || "Оригінал",
//     N: lang.notes || "Примітки",
//     G: lang.grammar || "Граматика",
//     V: lang.vocab || "Словник",
//     I: lang.interlinear || "Міжрядковий",
//     S: lang.septuagint || "Септуагінта",
//     R: lang.red_letter || "Червоні слова",
//   };

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content stepModalFgBg">
//             <div className="modal-body">
//               <div className="modal-body-close">
//                 <TranslationTabs
//                   lang={lang}
//                   activeTab={activeTab}
//                   onTabChange={setActiveTab}
//                 />
//                 <CloseIcon onClick={onRequestClose} />
//               </div>

//               <LanguageFilter
//                 lang={lang}
//                 languageFilter={languageFilter}
//                 onFilterChange={setLanguageFilter}
//               />

//               <div className="tab-content" style={{ marginTop: 15 }}>
//                 <div
//                   className={`tab-pane ${
//                     activeTab === "bibleList" ? "active" : ""
//                   }`}
//                   id="bibleList"
//                 >
//                   {Object.entries(groupedItems).map(([langKey, items]) => {
//                     const langName =
//                       langKey === "_ancient"
//                         ? lang.ancient || "Стародавня"
//                         : langKey === "uk"
//                         ? lang.ukrainian || "Українська"
//                         : langKey === "en"
//                         ? lang.english || "English"
//                         : langKey === "ru"
//                         ? lang.russian || "Русский"
//                         : langKey;

//                     return (
//                       <div key={langKey} className="lang-group">
//                         <button className="langBtn stepButton stepPressedButton">
//                           {langName}&nbsp;
//                           <span className="langPlusMinus">-</span>
//                         </button>
//                         <ul className="list-group langUL">
//                           {items.map((item) => (
//                             <li
//                               key={item.initials}
//                               className="list-group-item stepModalFgBg"
//                               data-initials={item.initials}
//                             >
//                               <input
//                                 type="checkbox"
//                                 className="list-group-checkbox"
//                                 checked={selectedVersions.includes(
//                                   item.initials
//                                 )}
//                                 onChange={() =>
//                                   handleCheckboxChange(item.initials)
//                                 }
//                               />
//                               &nbsp;
//                               <span
//                                 className="resource"
//                                 role="button"
//                                 onClick={() => {}}
//                                 style={{ cursor: "default" }}
//                               >
//                                 {item.initials} - {item.name}
//                               </span>
//                               <span
//                                 className="BibleFeatures"
//                                 style={{ float: "right" }}
//                               >
//                                 {item.features?.map((f) => (
//                                   <span
//                                     key={f}
//                                     className="versionFeature"
//                                     title={featuresMap[f] || f}
//                                   >
//                                     {f}
//                                   </span>
//                                 ))}
//                                 &nbsp;
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <TranslationFooter
//               lang={lang}
//               filteredCount={filteredItems.length}
//               totalCount={totalCount}
//               searchQuery={searchQuery}
//               onSearchChange={setSearchQuery}
//               onApply={handleApply}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TranslationSelector;

// ---------------------- 30.12.2025 global change, add more function

// // src/modals/TranslationSelector.js
// import React, { useState, useEffect, useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import TranslationTabs from "../elements/TranslationTabs";
// import LanguageFilter from "../elements/LanguageFilter";
// import TranslationFooter from "../elements/TranslationFooter";
// import "../styles/TranslationSelector.css";

// /**
//  * МОДАЛЬНЕ ВІКНО ВИБОРУ ПЕРЕКЛАДІВ
//  *
//  * Відповідає за:
//  * 1. Вибір перекладів та оригіналів
//  * 2. Управління обов'язковими парами (LXX+TR+UTT, THOT+TR+UBT)
//  * 3. Перемикання між режимами (інтерлінеарний / читання)
//  * 4. Групування за мовами
//  *
//  * Взаємодіє з:
//  * - PassagePage.js (через onSelectVersions)
//  * - src/utils/dataLoader.js (завантаження даних)
//  * - public/data/translations.json (структура перекладів)
//  */
// const TranslationSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   onSelectVersions,
// }) => {
//   // console.log("🔄 TranslationSelector: компонент ініціалізовано", { isOpen, lang });

//   // ==================== STATE ====================
//   const [translations, setTranslations] = useState({ bibles: [] });
//   const [selectedVersions, setSelectedVersions] = useState([]);
//   const [readingMode, setReadingMode] = useState(false);
//   const [languageFilter, setLanguageFilter] = useState("_all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ==================== ФУНКЦІЇ ДОПОМОГИ ====================
//   // Переміщую сюди

//   const getBibleInfo = useCallback(
//     (initials) => {
//       return translations.bibles?.find((b) => b.initials === initials);
//     },
//     [translations]
//   );

//   const isOriginalVersion = useCallback(
//     (initials) => {
//       const bible = getBibleInfo(initials);
//       return bible?.features?.includes("originals") || false;
//     },
//     [getBibleInfo]
//   );

//   const getLanguageName = useCallback(
//     (code) => {
//       const langMap = {
//         _all: lang.all_languages || "Всі мови",
//         _ancient: lang.ancient || "Стародавні",
//         grc: lang.greek || "Грецька",
//         he: lang.hebrew || "Єврейська",
//         uk: lang.ukrainian || "Українська",
//         ru: lang.russian || "Російська",
//         en: lang.english || "Англійська",
//       };

//       return langMap[code] || code;
//     },
//     [lang]
//   );
//   // ==================== ОСНОВНІ КОНСТАНТИ ====================
//   /**
//    * ОСНОВНІ ПАРИ ОРИГІНАЛІВ
//    * Визначають обов'язкові комбінації версій
//    */
//   const MAIN_PAIRS = [
//     {
//       key: "lxx-tr-utt",
//       originals: ["LXX", "TR"],
//       translations: ["UTT"],
//       name: "LXX + TR + UTT",
//       description: "Септуагінта з українським перекладом",
//       isDefault: true, // Увімкнено за замовчуванням
//       removable: true, // Можна вимкнути якщо є інші пари
//       minSelection: 2, // Мінімум 2 пари мають бути обрані
//       requiredTogether: true, // Всі три разом
//     },
//     {
//       key: "thot-tr-ubt",
//       originals: ["THOT", "TR"],
//       translations: ["UBT"],
//       name: "THOT + TR + UBT",
//       description: "Масоретський текст з українським перекладом",
//       removable: true,
//       requiredTogether: true,
//       autoSelect: false, // Не вибирається автоматично
//     },
//   ];

//   // ==================== ЕФЕКТИ ====================

//   /**
//    * ЗАВАНТАЖЕННЯ ДАНИХ ПРО ПЕРЕКЛАДИ
//    * Викликається при монтажі компонента
//    * Завантажує translations.json та встановлює дефолтний вибір
//    */
//   useEffect(() => {
//     let isMounted = true;

//     const loadTranslations = async () => {
//       console.log(
//         "📥 TranslationSelector: початок завантаження translations.json"
//       );

//       try {
//         setIsLoading(true);
//         setError(null);

//         const startTime = performance.now();
//         const res = await fetch("/data/translations.json");

//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         }

//         const data = await res.json();
//         const loadTime = performance.now() - startTime;

//         console.log(
//           `✅ TranslationSelector: дані завантажено за ${loadTime.toFixed(
//             0
//           )}мс`,
//           {
//             biblesCount: data.bibles?.length || 0,
//             version: data.version || "unknown",
//           }
//         );

//         if (!isMounted) {
//           console.log(
//             "⚠️ TranslationSelector: компонент розмонтовано, ігноруємо дані"
//           );
//           return;
//         }

//         setTranslations(data);

//         // ВСТАНОВЛЕННЯ ДЕФОЛТНОГО ВИБОРУ
//         const defaultSelection = ["LXX", "TR", "UTT"];
//         console.log(
//           "⚙️ TranslationSelector: встановлюю дефолтний вибір",
//           defaultSelection
//         );

//         setSelectedVersions(defaultSelection);
//         onSelectVersions(defaultSelection);
//       } catch (err) {
//         console.error(
//           "❌ TranslationSelector: помилка завантаження translations.json",
//           {
//             error: err.message,
//             stack: err.stack,
//           }
//         );

//         if (isMounted) {
//           setError(err.message);
//           // Створюємо резервні дані для розробки
//           const fallbackData = {
//             bibles: MAIN_PAIRS.flatMap((pair) => [
//               ...pair.originals.map((initials) => ({
//                 initials,
//                 name:
//                   initials === "LXX"
//                     ? "Septuagint"
//                     : initials === "THOT"
//                     ? "Hebrew OT"
//                     : initials === "TR"
//                     ? "Textus Receptus"
//                     : initials,
//                 lang: initials === "LXX" || initials === "TR" ? "grc" : "he",
//                 features: ["originals"],
//                 testaments: initials === "TR" ? ["NewT"] : ["OldT"],
//               })),
//               ...pair.translations.map((initials) => ({
//                 initials,
//                 name:
//                   initials === "UTT"
//                     ? "Український переклад з LXX"
//                     : "Українська Біблія",
//                 lang: "uk",
//                 features: ["R"],
//                 testaments: ["OldT", "NewT"],
//               })),
//             ]),
//           };

//           setTranslations(fallbackData);
//           setSelectedVersions(["LXX", "TR", "UTT"]);
//           onSelectVersions(["LXX", "TR", "UTT"]);
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     if (isOpen) {
//       loadTranslations();
//     }

//     return () => {
//       isMounted = false;
//       console.log("🧹 TranslationSelector: cleanup при розмонтуванні");
//     };
//   }, [isOpen, onSelectVersions]);

//   // ==================== ФУНКЦІЇ ДОПОМОГИ ====================

//   // /**
//   //  * ОТРИМАТИ ІНФОРМАЦІЮ ПРО ПЕРЕКЛАД ЗА ІНІЦІАЛАМИ
//   //  * Використовує translations.bibles
//   //  */
//   // const getBibleInfo = (initials) => {
//   //   return translations.bibles?.find((b) => b.initials === initials);
//   // };

//   // /**
//   //  * ПЕРЕВІРКА ЧИ ВЕРСІЯ Є ОРИГІНАЛОМ
//   //  * Використовує поле features
//   //  */
//   // const isOriginalVersion = (initials) => {
//   //   const bible = getBibleInfo(initials);
//   //   return bible?.features?.includes("originals") || false;
//   // };

//   // /**
//   //  * ОТРИМАТИ НАЗВУ МОВИ ЗА КОДОМ
//   //  * Використовує lang об'єкт з props
//   //  */
//   // const getLanguageName = (code) => {
//   //   const langMap = {
//   //     _all: lang.all_languages || "Всі мови",
//   //     _ancient: lang.ancient || "Стародавні",
//   //     grc: lang.greek || "Грецька",
//   //     he: lang.hebrew || "Єврейська",
//   //     uk: lang.ukrainian || "Українська",
//   //     ru: lang.russian || "Російська",
//   //     en: lang.english || "Англійська",
//   //   };

//   //   return langMap[code] || code;
//   // };

//   // ==================== ФІЛЬТРАЦІЯ ТА ГРУПУВАННЯ ====================

//   /**
//    * ФІЛЬТРОВАНІ ЕЛЕМЕНТИ ЗА МОВОЮ ТА ПОШУКОМ
//    * Мемоізовано для продуктивності
//    */
//   const filteredItems = useMemo(() => {
//     console.log("🔍 TranslationSelector: фільтрація елементів", {
//       languageFilter,
//       searchQuery,
//       totalItems: translations.bibles?.length || 0,
//     });

//     const list = translations.bibles || [];

//     return list.filter((item) => {
//       // Фільтр за мовою
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         (languageFilter === "_ancient" && isOriginalVersion(item.initials));

//       // Фільтр за пошуком
//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());

//       const isInMainPair = MAIN_PAIRS.some(
//         (pair) =>
//           pair.originals.includes(item.initials) ||
//           pair.translations.includes(item.initials)
//       );

//       // Для основних пар завжди показуємо
//       if (isInMainPair) {
//         return matchesLang && matchesSearch;
//       }

//       return matchesLang && matchesSearch;
//     });
//   }, [translations, languageFilter, searchQuery]);

//   /**
//    * ГРУПУВАННЯ ЕЛЕМЕНТІВ ЗА МОВОЮ
//    * Використовується для відображення в UI
//    */
//   const groupedByLanguage = useMemo(() => {
//     const groups = {};

//     filteredItems.forEach((item) => {
//       const isOriginal = isOriginalVersion(item.initials);
//       const key =
//         languageFilter === "_ancient" && isOriginal
//           ? "_ancient"
//           : languageFilter !== "_all"
//           ? languageFilter
//           : item.lang || "_other";

//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });

//     console.log("📊 TranslationSelector: згруповано за мовами", {
//       groupsCount: Object.keys(groups).length,
//       groups: Object.keys(groups),
//     });

//     return groups;
//   }, [filteredItems, languageFilter]);

//   // ==================== ОБРОБНИКИ ПОДІЙ ====================

//   /**
//    * ОБРОБКА ВИБОРУ ПАРИ
//    * Логіка для основних пар (LXX+TR+UTT, THOT+TR+UBT)
//    */
//   const handlePairSelection = (pairKey, isSelected) => {
//     console.log("🔄 TranslationSelector: обробка вибору пари", {
//       pairKey,
//       isSelected,
//       currentSelection: selectedVersions,
//     });

//     const pair = MAIN_PAIRS.find((p) => p.key === pairKey);
//     if (!pair) {
//       console.error("❌ TranslationSelector: пара не знайдена", pairKey);
//       return;
//     }

//     let newSelected = [...selectedVersions];

//     if (isSelected) {
//       // ДОДАЄМО ВСЮ ПАРУ
//       const allItems = [...pair.originals, ...pair.translations];
//       newSelected = [...new Set([...newSelected, ...allItems])];

//       console.log("➕ TranslationSelector: додано пару", {
//         pair: pair.name,
//         addedItems: allItems,
//         newSelection: newSelected,
//       });
//     } else {
//       // ПЕРЕВІРКА ЧИ МОЖНА ВИДАЛИТИ
//       if (!pair.removable) {
//         console.warn("⚠️ TranslationSelector: пару не можна видалити", pairKey);
//         alert(lang.cannot_remove_pair || "Цю пару не можна вимкнути");
//         return;
//       }

//       // ПЕРЕВІРКА МІНІМАЛЬНОЇ КІЛЬКОСТІ ПАР
//       const remainingPairs = MAIN_PAIRS.filter(
//         (p) =>
//           p.key !== pairKey && p.originals.some((o) => newSelected.includes(o))
//       );

//       if (remainingPairs.length === 0 && MAIN_PAIRS.length > 1) {
//         console.warn("⚠️ TranslationSelector: спроба видалити останню пару");
//         alert(
//           lang.need_at_least_one_pair || "Потрібно залишити хоча б одну пару"
//         );
//         return;
//       }

//       // ВИДАЛЯЄМО ЕЛЕМЕНТИ ПАРИ
//       const itemsToRemove = [...pair.originals, ...pair.translations];
//       newSelected = newSelected.filter((v) => !itemsToRemove.includes(v));

//       console.log("➖ TranslationSelector: видалено пару", {
//         pair: pair.name,
//         removedItems: itemsToRemove,
//         newSelection: newSelected,
//       });
//     }

//     setSelectedVersions(newSelected);
//   };

//   /**
//    * ОБРОБКА ОКРЕМОГО ЧЕКБОКСУ
//    * Для перекладів, що не входять в основні пари
//    */
//   const handleSingleCheckbox = (initials, isSelected) => {
//     console.log("🔄 TranslationSelector: обробка окремого чекбоксу", {
//       initials,
//       isSelected,
//       currentSelection: selectedVersions,
//     });

//     const bible = getBibleInfo(initials);
//     if (!bible) {
//       console.error("❌ TranslationSelector: переклад не знайдено", initials);
//       return;
//     }

//     let newSelected = [...selectedVersions];

//     if (isSelected) {
//       // ДОДАЄМО ПЕРЕКЛАД
//       newSelected.push(initials);

//       // ПЕРЕВІРЯЄМО ОБОВ'ЯЗКОВІ СУПУТНИКИ
//       if (bible.requiredWith && bible.requiredWith.length > 0) {
//         const missingRequired = bible.requiredWith.filter(
//           (r) => !newSelected.includes(r)
//         );
//         if (missingRequired.length > 0) {
//           console.log(
//             "🔗 TranslationSelector: додаю обов'язкові супутники",
//             missingRequired
//           );
//           newSelected = [...new Set([...newSelected, ...missingRequired])];
//         }
//       }

//       // ОСОБЛИВА ОБРОБКА ДЛЯ GNT
//       if (initials === "GNT") {
//         console.log(
//           "🇬🇷 TranslationSelector: обробка GNT - шукаю відповідний переклад"
//         );

//         // Шукаємо переклад, що використовується з TR
//         const trTranslation = newSelected.find((v) => {
//           if (v === "TR" || v === "GNT") return false;
//           const b = getBibleInfo(v);
//           return b?.basedOn?.new_testament === "tr";
//         });

//         if (trTranslation) {
//           console.log(
//             "🔗 TranslationSelector: знайдено переклад для GNT",
//             trTranslation
//           );
//           newSelected.push(trTranslation); // Додаємо той самий переклад
//         } else {
//           console.log("ℹ️ TranslationSelector: для GNT не знайдено переклад");
//         }
//       }

//       newSelected = [...new Set(newSelected)];
//     } else {
//       // ВИДАЛЯЄМО ПЕРЕКЛАД
//       newSelected = newSelected.filter((v) => v !== initials);

//       // ЯКЩО ВИДАЛЯЄМО ОРИГІНАЛ - ВИДАЛЯЄМО ЙОГО ОБОВ'ЯЗКОВІ СУПУТНИКИ
//       if (bible.requiredWith) {
//         const toRemove = bible.requiredWith.filter(
//           (r) =>
//             !newSelected.some((v) => {
//               const b = getBibleInfo(v);
//               return b?.requiredWith?.includes(r);
//             })
//         );

//         if (toRemove.length > 0) {
//           console.log(
//             "🗑️ TranslationSelector: видаляю супутники оригіналу",
//             toRemove
//           );
//           newSelected = newSelected.filter((v) => !toRemove.includes(v));
//         }
//       }
//     }

//     console.log("📝 TranslationSelector: оновлений вибір", newSelected);
//     setSelectedVersions(newSelected);
//   };

//   /**
//    * ПЕРЕМИКАЧ РЕЖИМУ ЧИТАННЯ
//    * Змінює між інтерлінеарним режимом та режимом читання
//    */
//   const toggleReadingMode = () => {
//     const newMode = !readingMode;
//     console.log("🔄 TranslationSelector: перемикання режиму", {
//       from: readingMode ? "reading" : "interlinear",
//       to: newMode ? "reading" : "interlinear",
//     });

//     setReadingMode(newMode);

//     if (newMode) {
//       // РЕЖИМ ЧИТАННЯ: залишаємо тільки один вибраний
//       if (selectedVersions.length > 0) {
//         const singleVersion = selectedVersions[0];
//         setSelectedVersions([singleVersion]);
//         console.log(
//           "📖 TranslationSelector: увімкнено режим читання",
//           singleVersion
//         );
//       }
//     } else {
//       // РЕЖИМ ІНТЕРЛІНЕАР: повертаємо дефолт
//       const defaultSelection = ["LXX", "TR", "UTT"];
//       setSelectedVersions(defaultSelection);
//       console.log(
//         "🔤 TranslationSelector: увімкнено інтерлінеарний режим",
//         defaultSelection
//       );
//     }
//   };

//   /**
//    * ЗАСТОСУВАТИ ВИБІР
//    * Передає вибрані версії в батьківський компонент
//    */
//   const handleApply = () => {
//     console.log("✅ TranslationSelector: застосування вибору", {
//       selectedVersions,
//       readingMode,
//       count: selectedVersions.length,
//     });

//     if (selectedVersions.length === 0) {
//       console.warn("⚠️ TranslationSelector: немає вибраних версій");
//       alert(lang.select_at_least_one || "Оберіть хоча б одну версію");
//       return;
//     }

//     onSelectVersions(selectedVersions);
//     onRequestClose();
//   };

//   // ==================== ДОДАТКОВІ ПЕРЕВІРКИ ====================

//   /**
//    * ПЕРЕВІРКА ВАЛІДНОСТІ ВИБОРУ
//    * Викликається перед застосуванням
//    */
//   const validateSelection = () => {
//     console.log("🔍 TranslationSelector: перевірка валідності вибору");

//     // 1. Перевірка основних пар
//     for (const pair of MAIN_PAIRS) {
//       const hasSomeOriginals = pair.originals.some((o) =>
//         selectedVersions.includes(o)
//       );
//       const hasAllOriginals = pair.originals.every((o) =>
//         selectedVersions.includes(o)
//       );

//       if (hasSomeOriginals && !hasAllOriginals && pair.requiredTogether) {
//         console.error("❌ TranslationSelector: неповна пара", pair.key);
//         return {
//           valid: false,
//           message: `Пара ${pair.name} повинна бути обрана повністю`,
//         };
//       }
//     }

//     // 2. Перевірка обов'язкових супутників
//     for (const version of selectedVersions) {
//       const bible = getBibleInfo(version);
//       if (bible?.requiredWith) {
//         const missing = bible.requiredWith.filter(
//           (r) => !selectedVersions.includes(r)
//         );
//         if (missing.length > 0) {
//           console.error(
//             "❌ TranslationSelector: відсутні обов'язкові супутники",
//             {
//               version,
//               missing,
//             }
//           );
//           return {
//             valid: false,
//             message: `Для ${version} потрібно також обрати: ${missing.join(
//               ", "
//             )}`,
//           };
//         }
//       }
//     }

//     console.log("✅ TranslationSelector: вибір валідний");
//     return { valid: true };
//   };

//   // ==================== РЕНДЕРИНГ ====================

//   if (!isOpen) {
//     console.log("🚫 TranslationSelector: модальне вікно закрите");
//     return null;
//   }

//   console.log("🎨 TranslationSelector: початок рендерингу", {
//     isLoading,
//     error,
//     selectedCount: selectedVersions.length,
//     readingMode,
//   });

//   if (isLoading) {
//     return (
//       <div className="translation-selector-loading">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Завантаження...</span>
//         </div>
//         <p>{lang.loading || "Завантаження перекладів..."}</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="translation-selector-error">
//         <div className="alert alert-danger">
//           <h5>Помилка завантаження</h5>
//           <p>{error}</p>
//           <button className="btn btn-secondary" onClick={onRequestClose}>
//             {lang.close || "Закрити"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const validationResult = validateSelection();

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content stepModalFgBg">
//             {/* ЗАГОЛОВОК З ПЕРЕМИКАЧЕМ РЕЖИМУ */}
//             <div className="modal-header">
//               <h5>{lang.select_translations || "Оберіть переклади"}</h5>

//               <div className="reading-mode-toggle">
//                 <label className="form-check form-switch">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     checked={readingMode}
//                     onChange={toggleReadingMode}
//                   />
//                   <span className="form-check-label">
//                     {lang.reading_mode || "Режим читання"}
//                   </span>
//                 </label>
//                 {readingMode && (
//                   <span className="badge bg-info ms-2">
//                     {lang.single_selection || "Один вибір"}
//                   </span>
//                 )}
//               </div>

//               <CloseIcon onClick={onRequestClose} />
//             </div>

//             <div className="modal-body">
//               {readingMode ? (
//                 /* ========== РЕЖИМ ЧИТАННЯ (РАДІО-КНОПКИ) ========== */
//                 <div className="reading-mode-selection">
//                   <div className="alert alert-info mb-3">
//                     <i className="bi bi-info-circle"></i>
//                     {lang.reading_mode_description ||
//                       "Режим читання: оберіть одну версію для читання без інтерлінеарного відображення"}
//                   </div>

//                   {translations.bibles.map((bible) => (
//                     <div key={bible.initials} className="radio-option">
//                       <input
//                         type="radio"
//                         id={`radio-${bible.initials}`}
//                         name="reading-translation"
//                         checked={selectedVersions.includes(bible.initials)}
//                         onChange={() => setSelectedVersions([bible.initials])}
//                         disabled={bible.testaments?.length === 0}
//                       />
//                       <label htmlFor={`radio-${bible.initials}`}>
//                         <strong className="version-initials">
//                           [{bible.initials}]
//                         </strong>
//                         <span className="version-name"> - {bible.name}</span>

//                         {bible.features?.includes("originals") && (
//                           <span className="badge bg-primary ms-2">
//                             {lang.original || "Оригінал"}
//                           </span>
//                         )}

//                         {bible.testaments?.length === 1 && (
//                           <span className="badge bg-secondary ms-1">
//                             {bible.testaments[0] === "OldT"
//                               ? lang.old_testament || "СТ"
//                               : lang.new_testament || "НЗ"}
//                           </span>
//                         )}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 /* ========== РЕЖИМ ІНТЕРЛІНЕАР ========== */
//                 <>
//                   {/* ПОМИЛКА ВАЛІДАЦІЇ */}
//                   {!validationResult.valid && (
//                     <div className="alert alert-warning">
//                       <i className="bi bi-exclamation-triangle"></i>
//                       {validationResult.message}
//                     </div>
//                   )}

//                   {/* ОСНОВНІ ПАРИ */}
//                   <div className="main-pairs-section">
//                     <h6 className="section-title">
//                       {lang.main_pairs || "Основні пари"}
//                       <small className="text-muted ms-2">
//                         ({lang.obligatory || "обов'язкові комбінації"})
//                       </small>
//                     </h6>

//                     {MAIN_PAIRS.map((pair) => {
//                       const isSelected = [
//                         ...pair.originals,
//                         ...pair.translations,
//                       ].every((v) => selectedVersions.includes(v));
//                       const isDisabled =
//                         pair.isDefault &&
//                         selectedVersions.length <= 3 &&
//                         MAIN_PAIRS.filter((p) =>
//                           p.originals.some((o) => selectedVersions.includes(o))
//                         ).length <= 1;

//                       return (
//                         <div
//                           key={pair.key}
//                           className={`pair-option ${
//                             isSelected ? "selected" : ""
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             id={`pair-${pair.key}`}
//                             checked={isSelected}
//                             onChange={(e) =>
//                               handlePairSelection(pair.key, e.target.checked)
//                             }
//                             disabled={isDisabled && !isSelected}
//                           />
//                           <label htmlFor={`pair-${pair.key}`}>
//                             <div className="pair-name">
//                               <strong>{pair.name}</strong>
//                               {pair.isDefault && (
//                                 <span className="badge bg-success ms-2">
//                                   {lang.default || "За замовчуванням"}
//                                 </span>
//                               )}
//                             </div>
//                             <small className="pair-description">
//                               {pair.description}
//                             </small>
//                           </label>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* ІНШІ ПЕРЕКЛАДИ (ГРУПОВАНІ ЗА МОВОЮ) */}
//                   <div className="other-translations-section">
//                     <h6 className="section-title">
//                       {lang.other_translations || "Інші переклади"}
//                       <small className="text-muted ms-2">
//                         ({lang.optional || "опціонально"})
//                       </small>
//                     </h6>

//                     {/* ФІЛЬТРИ ТА ПОШУК */}
//                     <div className="filter-controls mb-3">
//                       <LanguageFilter
//                         lang={lang}
//                         languageFilter={languageFilter}
//                         onFilterChange={setLanguageFilter}
//                       />

//                       <div className="search-box">
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder={lang.search || "Пошук..."}
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     {/* ГРУПИ ЗА МОВОЮ */}
//                     {Object.entries(groupedByLanguage).map(
//                       ([langCode, items]) => {
//                         // Фільтруємо тільки ті, що не входять в основні пари
//                         // Але GNT - це оригінал, тому його треба завжди показувати
//                         const filteredItems = items.filter(
//                           (item) =>
//                             !MAIN_PAIRS.some(
//                               (pair) =>
//                                 pair.originals.includes(item.initials) ||
//                                 pair.translations.includes(item.initials)
//                             ) || item.initials === "GNT"
//                         );

//                         if (filteredItems.length === 0) return null;

//                         return (
//                           <div key={langCode} className="language-group">
//                             <div className="language-header">
//                               <span className="language-name">
//                                 {getLanguageName(langCode)}
//                               </span>
//                               <span className="language-count">
//                                 ({filteredItems.length})
//                               </span>
//                             </div>

//                             <div className="translations-list">
//                               {filteredItems.map((item) => (
//                                 <div
//                                   key={item.initials}
//                                   className="translation-option"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     id={`trans-${item.initials}`}
//                                     checked={selectedVersions.includes(
//                                       item.initials
//                                     )}
//                                     onChange={(e) =>
//                                       handleSingleCheckbox(
//                                         item.initials,
//                                         e.target.checked
//                                       )
//                                     }
//                                   />
//                                   <label htmlFor={`trans-${item.initials}`}>
//                                     <span className="translation-initials">
//                                       [{item.initials}]
//                                     </span>
//                                     <span className="translation-name">
//                                       {item.name}
//                                     </span>

//                                     {item.testaments?.length === 1 && (
//                                       <span className="badge bg-secondary ms-2">
//                                         {item.testaments[0] === "OldT"
//                                           ? lang.old_testament_short || "СТ"
//                                           : lang.new_testament_short || "НЗ"}
//                                       </span>
//                                     )}

//                                     {item.note && (
//                                       <small className="translation-note d-block text-muted">
//                                         {item.note}
//                                       </small>
//                                     )}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* ФУТЕР З ІНФОРМАЦІЄЮ ТА КНОПКАМИ */}
//             <div className="modal-footer">
//               <div className="selection-info">
//                 <span className="badge bg-primary">
//                   {selectedVersions.length} {lang.selected || "обрано"}
//                 </span>
//                 {readingMode && (
//                   <span className="badge bg-info ms-2">
//                     {lang.reading_mode || "Режим читання"}
//                   </span>
//                 )}
//               </div>

//               <div className="footer-buttons">
//                 <button className="btn btn-secondary" onClick={onRequestClose}>
//                   {lang.cancel || "Скасувати"}
//                 </button>

//                 <button
//                   className="btn btn-primary"
//                   onClick={handleApply}
//                   disabled={
//                     !validationResult.valid || selectedVersions.length === 0
//                   }
//                 >
//                   {lang.apply || "Застосувати"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TranslationSelector;

// console.log("📦 TranslationSelector.js: модуль завантажено та експортовано");

// /**
//  * ЕКСПОРТ ДОДАТКОВИХ ФУНКЦІЙ ДЛЯ ТЕСТУВАННЯ
//  * Ці функції можуть бути імпортовані для юніт-тестів
//  */
// export const TranslationSelectorUtils = {
//   isOriginalVersion,
//   getLanguageName,
//   validateSelection,
//   getBibleInfo,
// };
// //----- aafter the last changes the following errors appeared:

// // Uncaught ReferenceError: isOriginalVersion is not defined
// // at ./src/modals/TranslationSelector.js (TranslationSelector.js:1454:1)
// // at options.factory (react refresh:37:1)
// // at __webpack_require__ (bootstrap:22:1)
// // at fn (hot module replacement:61:1)
// // at hotRequire (react refresh:20:1)
// // at ./src/components/PassageOptionsGroup.js (NavbarHeader.js:882:1)
// // at options.factory (react refresh:37:1)
// // at __webpack_require__ (bootstrap:22:1)
// // at fn (hot module replacement:61:1)
// // at hotRequire (react refresh:20:1)

// --------------друга версія
// Проблема в тому, що isOriginalVersion визначена всередині компонента як useCallback, але намагається експортуватися за межами компонента. Потрібно виправити експорт.

// // src/modals/TranslationSelector.js -
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import TranslationTabs from "../elements/TranslationTabs";
// import LanguageFilter from "../elements/LanguageFilter";
// import TranslationFooter from "../elements/TranslationFooter";
// import "../styles/TranslationSelector.css";

// // ==================== УТІЛІТИ ДЛЯ ЕКСПОРТУ ====================
// // Виношу їх за межі компонента, бо вони не залежать від стану

// /**
//  * ПЕРЕВІРКА ЧИ ВЕРСІЯ Є ОРИГІНАЛОМ
//  * Використовується зовні для тестування
//  */
// export const isOriginalVersionUtil = (initials, translationsData) => {
//   if (!translationsData || !translationsData.bibles) return false;
//   const bible = translationsData.bibles.find((b) => b.initials === initials);
//   return bible?.features?.includes("originals") || false;
// };

// /**
//  * ОТРИМАТИ НАЗВУ МОВИ ЗА КОДОМ
//  */
// export const getLanguageNameUtil = (code, langDict = {}) => {
//   const langMap = {
//     _all: langDict.all_languages || "Всі мови",
//     _ancient: langDict.ancient || "Стародавні",
//     grc: langDict.greek || "Грецька",
//     he: langDict.hebrew || "Єврейська",
//     uk: langDict.ukrainian || "Українська",
//     ru: langDict.russian || "Російська",
//     en: langDict.english || "Англійська",
//   };

//   return langMap[code] || code;
// };

// // ==================== КОМПОНЕНТ ====================

// const TranslationSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   onSelectVersions,
//   initialVersions = [], // ← НОВИЙ ПРОП: поточні версії з панелі
//   currentBook = "GEN", // ← НОВИЙ ПРОП: поточна книга для інтелектуального дефолту
// }) => {
//   // console.log("🔄 TranslationSelector: компонент ініціалізовано");

//   // ==================== STATE ====================
//   const [translations, setTranslations] = useState({ bibles: [] });
//   const [selectedVersions, setSelectedVersions] = useState([]);
//   const [readingMode, setReadingMode] = useState(false);
//   const [languageFilter, setLanguageFilter] = useState("_all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ==================== КОНСТАНТИ ====================
//   const getTestament = (bookCode) => {
//     const newTestamentBooks = [
//       "MAT",
//       "MRK",
//       "LUK",
//       "JHN",
//       "ACT",
//       "ROM",
//       "1CO",
//       "2CO",
//       "GAL",
//       "EPH",
//       "PHP",
//       "COL",
//       "1TH",
//       "2TH",
//       "1TI",
//       "2TI",
//       "TIT",
//       "PHM",
//       "HEB",
//       "JAS",
//       "1PE",
//       "2PE",
//       "1JN",
//       "2JN",
//       "3JN",
//       "JUD",
//       "REV",
//     ];
//     return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
//   };
//   /**
//    * ОСНОВНІ ПАРИ ОРИГІНАЛІВ
//    * Визначають обов'язкові комбінації версій
//    */
//   const MAIN_PAIRS = [
//     {
//       key: "lxx-utt",
//       originals: ["LXX"],
//       translations: ["UTT"],
//       name: "LXX + UTT",
//       description: "Септуагінта з українським перекладом",
//       isDefault: true,
//       removable: true,
//       // minSelection: 2,
//       // requiredTogether: true,
//       testament: "OldT", // ← Додаємо заповіт
//     },
//     {
//       key: "thot-ubt",
//       originals: ["THOT"],
//       translations: ["UBT"],
//       name: "THOT + UBT",
//       description: "Масоретський текст з українським перекладом",
//       removable: true,
//       // requiredTogether: true,
//       // autoSelect: false,
//       testament: "OldT", // ← Додаємо заповіт
//     },
//     {
//       key: "tr-utt",
//       originals: ["TR"],
//       translations: ["UTT"],
//       name: "TR + UTT",
//       description: "Textus Receptus з українським перекладом",
//       removable: true,
//       testament: "NewT", // ← Додаємо заповіт
//     },
//     {
//       key: "gnt-translations",
//       originals: ["GNT"],
//       translations: [], // ← Порожній, користувач обирає
//       name: "GNT + переклади",
//       description: "Сучасний грецький текст з перекладами",
//       removable: true,
//       testament: "NewT", // ← Додаємо заповіт
//     },
//   ];

//   // ==================== ФУНКЦІЇ ДОПОМОГИ (всередині компонента) ====================

//   const getBibleInfo = useCallback(
//     (initials) => {
//       return translations.bibles?.find((b) => b.initials === initials);
//     },
//     [translations]
//   );

//   const isOriginalVersion = useCallback(
//     (initials) => {
//       const bible = getBibleInfo(initials);
//       return bible?.features?.includes("originals") || false;
//     },
//     [getBibleInfo]
//   );

//   const getLanguageName = useCallback(
//     (code) => {
//       return getLanguageNameUtil(code, lang);
//     },
//     [lang]
//   );

//   // ==================== ЕФЕКТИ ====================

//   /**
//    * ЗАВАНТАЖЕННЯ ДАНИХ ПРО ПЕРЕКЛАДИ
//    */

//   useEffect(() => {
//     let isMounted = true;

//     const loadTranslations = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const res = await fetch("/data/translations.json");
//         if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

//         const data = await res.json();

//         if (!isMounted) return;
//         setTranslations(data);

//         // === ВИПРАВЛЕНА ЛОГІКА: ===

//         // 1. Якщо є initialVersions - використовуємо їх
//         if (initialVersions && initialVersions.length > 0) {
//           console.log(
//             "🔄 TranslationSelector: використовую initialVersions",
//             initialVersions
//           );
//           setSelectedVersions(initialVersions);
//           // Не викликаємо onSelectVersions - бо це вже встановлено
//         }
//         // 2. Інакше - інтелектуальний дефолт на основі книги
//         else {
//           const testament = getTestament(currentBook);
//           let defaultSelection;

//           if (testament === "NewT") {
//             defaultSelection = ["TR", "UTT"]; // NT дефолт
//           } else {
//             defaultSelection = ["LXX", "UTT"]; // OT дефолт
//           }

//           console.log("⚙️ TranslationSelector: інтелектуальний дефолт", {
//             book: currentBook,
//             testament,
//             defaultSelection,
//           });

//           setSelectedVersions(defaultSelection);
//           onSelectVersions(defaultSelection);
//         }
//       } catch (err) {
//         // ... обробка помилок
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     if (isOpen) loadTranslations();

//     return () => {
//       isMounted = false;
//     };
//   }, [isOpen, onSelectVersions, initialVersions, currentBook]); // ← Додаємо залежності

//   // ==================== ФІЛЬТРАЦІЯ ТА ГРУПУВАННЯ ====================
//   const filteredMainPairs = MAIN_PAIRS.filter((pair) => {
//     const pairTestament = pair.testament;
//     const currentTestament = getTestament(currentBook);
//     return !pairTestament || pairTestament === currentTestament;
//   });
//   const filteredItems = useMemo(() => {
//     // console.log("🔍 TranslationSelector: фільтрація елементів", {
//     //   languageFilter,
//     //   searchQuery,
//     //   totalItems: translations.bibles?.length || 0,
//     // });

//     const list = translations.bibles || [];

//     return list.filter((item) => {
//       // Фільтр за мовою
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         (languageFilter === "_ancient" && isOriginalVersion(item.initials));

//       // Фільтр за пошуком
//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchesLang && matchesSearch;
//     });
//   }, [translations, languageFilter, searchQuery, isOriginalVersion]);

//   const groupedByLanguage = useMemo(() => {
//     const groups = {};

//     filteredItems.forEach((item) => {
//       const isOriginal = isOriginalVersion(item.initials);
//       const key =
//         languageFilter === "_ancient" && isOriginal
//           ? "_ancient"
//           : languageFilter !== "_all"
//           ? languageFilter
//           : item.lang || "_other";

//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });

//     // console.log("📊 TranslationSelector: згруповано за мовами", {
//     //   groupsCount: Object.keys(groups).length,
//     //   groups: Object.keys(groups),
//     // });

//     return groups;
//   }, [filteredItems, languageFilter, isOriginalVersion]);

//   // ==================== ОБРОБНИКИ ПОДІЙ ====================

//   const handlePairSelection = (pairKey, isSelected) => {
//     console.log("🔄 TranslationSelector: обробка вибору пари", {
//       pairKey,
//       isSelected,
//       currentSelection: selectedVersions,
//     });

//     const pair = MAIN_PAIRS.find((p) => p.key === pairKey);
//     if (!pair) {
//       console.error("❌ TranslationSelector: пара не знайдена", pairKey);
//       return;
//     }

//     let newSelected = [...selectedVersions];

//     if (isSelected) {
//       // ДОДАЄМО ВСЮ ПАРУ
//       const allItems = [...pair.originals, ...pair.translations];
//       newSelected = [...new Set([...newSelected, ...allItems])];

//       console.log("➕ TranslationSelector: додано пару", {
//         pair: pair.name,
//         addedItems: allItems,
//         newSelection: newSelected,
//       });
//     } else {
//       // ПЕРЕВІРКА ЧИ МОЖНА ВИДАЛИТИ
//       if (!pair.removable) {
//         console.warn("⚠️ TranslationSelector: пару не можна видалити", pairKey);
//         alert(lang.cannot_remove_pair || "Цю пару не можна вимкнути");
//         return;
//       }

//       // ПЕРЕВІРКА МІНІМАЛЬНОЇ КІЛЬКОСТІ ПАР
//       const remainingPairs = MAIN_PAIRS.filter(
//         (p) =>
//           p.key !== pairKey && p.originals.some((o) => newSelected.includes(o))
//       );

//       if (remainingPairs.length === 0 && MAIN_PAIRS.length > 1) {
//         console.warn("⚠️ TranslationSelector: спроба видалити останню пару");
//         alert(
//           lang.need_at_least_one_pair || "Потрібно залишити хоча б одну пару"
//         );
//         return;
//       }

//       // ВИДАЛЯЄМО ЕЛЕМЕНТИ ПАРИ
//       const itemsToRemove = [...pair.originals, ...pair.translations];
//       newSelected = newSelected.filter((v) => !itemsToRemove.includes(v));

//       console.log("➖ TranslationSelector: видалено пару", {
//         pair: pair.name,
//         removedItems: itemsToRemove,
//         newSelection: newSelected,
//       });
//     }

//     setSelectedVersions(newSelected);
//   };

//   const handleSingleCheckbox = (initials, isSelected) => {
//     console.log("🔄 TranslationSelector: обробка окремого чекбоксу", {
//       initials,
//       isSelected,
//       currentSelection: selectedVersions,
//     });

//     const bible = getBibleInfo(initials);
//     if (!bible) {
//       console.error("❌ TranslationSelector: переклад не знайдено", initials);
//       return;
//     }

//     let newSelected = [...selectedVersions];

//     if (isSelected) {
//       // ДОДАЄМО ПЕРЕКЛАД
//       newSelected.push(initials);

//       // ПЕРЕВІРЯЄМО ОБОВ'ЯЗКОВІ СУПУТНИКИ
//       if (bible.requiredWith && bible.requiredWith.length > 0) {
//         const missingRequired = bible.requiredWith.filter(
//           (r) => !newSelected.includes(r)
//         );
//         if (missingRequired.length > 0) {
//           console.log(
//             "🔗 TranslationSelector: додаю обов'язкові супутники",
//             missingRequired
//           );
//           newSelected = [...new Set([...newSelected, ...missingRequired])];
//         }
//       }

//       // ОСОБЛИВА ОБРОБКА ДЛЯ GNT
//       if (initials === "GNT") {
//         console.log(
//           "🇬🇷 TranslationSelector: обробка GNT - шукаю відповідний переклад"
//         );

//         // Шукаємо переклад, що використовується з TR
//         const trTranslation = newSelected.find((v) => {
//           if (v === "TR" || v === "GNT") return false;
//           const b = getBibleInfo(v);
//           return b?.basedOn?.new_testament === "tr";
//         });

//         if (trTranslation) {
//           console.log(
//             "🔗 TranslationSelector: знайдено переклад для GNT",
//             trTranslation
//           );
//           newSelected.push(trTranslation); // Додаємо той самий переклад
//         } else {
//           console.log("ℹ️ TranslationSelector: для GNT не знайдено переклад");
//         }
//       }

//       newSelected = [...new Set(newSelected)];
//     } else {
//       // ВИДАЛЯЄМО ПЕРЕКЛАД
//       newSelected = newSelected.filter((v) => v !== initials);

//       // ЯКЩО ВИДАЛЯЄМО ОРИГІНАЛ - ВИДАЛЯЄМО ЙОГО ОБОВ'ЯЗКОВІ СУПУТНИКИ
//       if (bible.requiredWith) {
//         const toRemove = bible.requiredWith.filter(
//           (r) =>
//             !newSelected.some((v) => {
//               const b = getBibleInfo(v);
//               return b?.requiredWith?.includes(r);
//             })
//         );

//         if (toRemove.length > 0) {
//           console.log(
//             "🗑️ TranslationSelector: видаляю супутники оригіналу",
//             toRemove
//           );
//           newSelected = newSelected.filter((v) => !toRemove.includes(v));
//         }
//       }
//     }

//     console.log("📝 TranslationSelector: оновлений вибір", newSelected);
//     setSelectedVersions(newSelected);
//   };

//   const toggleReadingMode = () => {
//     const newMode = !readingMode;
//     console.log("🔄 TranslationSelector: перемикання режиму", {
//       from: readingMode ? "reading" : "interlinear",
//       to: newMode ? "reading" : "interlinear",
//     });

//     setReadingMode(newMode);

//     if (newMode) {
//       // РЕЖИМ ЧИТАННЯ: залишаємо тільки один вибраний
//       if (selectedVersions.length > 0) {
//         const singleVersion = selectedVersions[0];
//         setSelectedVersions([singleVersion]);
//         console.log(
//           "📖 TranslationSelector: увімкнено режим читання",
//           singleVersion
//         );
//       }
//     } else {
//       // РЕЖИМ ІНТЕРЛІНЕАР: повертаємо дефолт
//       const defaultSelection = ["LXX", "TR", "UTT"];
//       setSelectedVersions(defaultSelection);
//       console.log(
//         "🔤 TranslationSelector: увімкнено інтерлінеарний режим",
//         defaultSelection
//       );
//     }
//   };

//   const handleApply = () => {
//     console.log("✅ TranslationSelector: застосування вибору", {
//       selectedVersions,
//       readingMode,
//       count: selectedVersions.length,
//     });

//     if (selectedVersions.length === 0) {
//       console.warn("⚠️ TranslationSelector: немає вибраних версій");
//       alert(lang.select_at_least_one || "Оберіть хоча б одну версію");
//       return;
//     }

//     onSelectVersions(selectedVersions);
//     onRequestClose();
//   };

//   const validateSelection = () => {
//     console.log("🔍 TranslationSelector: перевірка валідності вибору");

//     // Перевіряємо тільки ті пари, які користувач ЧАСТКОВО обрав
//     for (const pair of MAIN_PAIRS) {
//       // Якщо хоч один елемент пари вибраний
//       const hasSomeOriginals = pair.originals.some((o) =>
//         selectedVersions.includes(o)
//       );
//       // ... але НЕ всі обов'язкові елементи (originals + translations)
//       const hasAllRequired = [...pair.originals, ...pair.translations].every(
//         (v) => selectedVersions.includes(v)
//       );

//       if (hasSomeOriginals && !hasAllRequired && pair.requiredTogether) {
//         // Тільки ТОДИ показуємо помилку
//         return {
//           valid: false,
//           message: `Пара ${pair.name} повинна бути обрана повністю.`,
//         };
//       }
//     }
//     // ------------------

//     // 2. Перевірка обов'язкових супутників
//     for (const version of selectedVersions) {
//       const bible = getBibleInfo(version);
//       if (bible?.requiredWith) {
//         const missing = bible.requiredWith.filter(
//           (r) => !selectedVersions.includes(r)
//         );
//         if (missing.length > 0) {
//           console.error(
//             "❌ TranslationSelector: відсутні обов'язкові супутники",
//             {
//               version,
//               missing,
//             }
//           );
//           return {
//             valid: false,
//             message: `Для ${version} потрібно також обрати: ${missing.join(
//               ", "
//             )}`,
//           };
//         }
//       }
//     }

//     console.log("✅ TranslationSelector: вибір валідний");
//     return { valid: true };
//   };

//   // ==================== РЕНДЕРИНГ ====================

//   if (!isOpen) {
//     console.log("🚫 TranslationSelector: модальне вікно закрите");
//     return null;
//   }

//   // console.log("🎨 TranslationSelector: початок рендерингу", {
//   //   isLoading,
//   //   error,
//   //   selectedCount: selectedVersions.length,
//   //   readingMode,
//   // });

//   if (isLoading) {
//     return (
//       <div className="translation-selector-loading">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Завантаження...</span>
//         </div>
//         <p>{lang.loading || "Завантаження перекладів..."}</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="translation-selector-error">
//         <div className="alert alert-danger">
//           <h5>Помилка завантаження</h5>
//           <p>{error}</p>
//           <button className="btn btn-secondary" onClick={onRequestClose}>
//             {lang.close || "Закрити"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const validationResult = validateSelection();

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content stepModalFgBg">
//             {/* ЗАГОЛОВОК З ПЕРЕМИКАЧЕМ РЕЖИМУ */}
//             <div className="modal-header">
//               <h5>{lang.select_translations || "Оберіть переклади"}</h5>

//               <div className="reading-mode-toggle">
//                 <label className="form-check form-switch">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     checked={readingMode}
//                     onChange={toggleReadingMode}
//                   />
//                   <span className="form-check-label">
//                     {lang.reading_mode || "Режим читання"}
//                   </span>
//                 </label>
//                 {readingMode && (
//                   <span className="badge bg-info ms-2">
//                     {lang.single_selection || "Один вибір"}
//                   </span>
//                 )}
//               </div>

//               <CloseIcon onClick={onRequestClose} />
//             </div>

//             <div className="modal-body">
//               {readingMode ? (
//                 /* ========== РЕЖИМ ЧИТАННЯ ========== */
//                 <div className="reading-mode-selection">
//                   <div className="alert alert-info mb-3">
//                     <i className="bi bi-info-circle"></i>
//                     {lang.reading_mode_description ||
//                       "Режим читання: оберіть одну версію для читання"}
//                   </div>

//                   {translations.bibles.map((bible) => (
//                     <div key={bible.initials} className="radio-option">
//                       <input
//                         type="radio"
//                         id={`radio-${bible.initials}`}
//                         name="reading-translation"
//                         checked={selectedVersions.includes(bible.initials)}
//                         onChange={() => setSelectedVersions([bible.initials])}
//                       />
//                       <label htmlFor={`radio-${bible.initials}`}>
//                         <strong className="version-initials">
//                           [{bible.initials}]
//                         </strong>
//                         <span className="version-name"> - {bible.name}</span>

//                         {bible.features?.includes("originals") && (
//                           <span className="badge bg-primary ms-2">
//                             {lang.original || "Оригінал"}
//                           </span>
//                         )}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 /* ========== РЕЖИМ ІНТЕРЛІНЕАР ========== */
//                 <>
//                   {/* ПОМИЛКА ВАЛІДАЦІЇ */}
//                   {!validationResult.valid && (
//                     <div className="alert alert-warning">
//                       <i className="bi bi-exclamation-triangle"></i>
//                       {validationResult.message}
//                     </div>
//                   )}

//                   {/* ОСНОВНІ ПАРИ */}
//                   <div className="main-pairs-section">
//                     <h6 className="section-title">
//                       {lang.main_pairs || "Основні пари"}
//                     </h6>

//                     {MAIN_PAIRS.map((pair) => {
//                       const isSelected = [
//                         ...pair.originals,
//                         ...pair.translations,
//                       ].every((v) => selectedVersions.includes(v));
//                       const isDisabled =
//                         pair.isDefault && selectedVersions.length <= 3;

//                       return (
//                         <div
//                           key={pair.key}
//                           className={`pair-option ${
//                             isSelected ? "selected" : ""
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             id={`pair-${pair.key}`}
//                             checked={isSelected}
//                             onChange={(e) =>
//                               handlePairSelection(pair.key, e.target.checked)
//                             }
//                             disabled={isDisabled && !isSelected}
//                           />
//                           <label htmlFor={`pair-${pair.key}`}>
//                             <div className="pair-name">
//                               <strong>{pair.name}</strong>
//                               {pair.isDefault && (
//                                 <span className="badge bg-success ms-2">
//                                   {lang.default || "За замовчуванням"}
//                                 </span>
//                               )}
//                             </div>
//                             <small className="pair-description">
//                               {pair.description}
//                             </small>
//                           </label>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* ІНШІ ПЕРЕКЛАДИ */}
//                   <div className="other-translations-section">
//                     <h6 className="section-title">
//                       {lang.other_translations || "Інші переклади"}
//                     </h6>

//                     {/* ГРУПИ ЗА МОВОЮ */}
//                     {Object.entries(groupedByLanguage).map(
//                       ([langCode, items]) => {
//                         const filteredItems = items.filter(
//                           (item) =>
//                             !MAIN_PAIRS.some(
//                               (pair) =>
//                                 pair.originals.includes(item.initials) ||
//                                 pair.translations.includes(item.initials)
//                             )
//                         );

//                         if (filteredItems.length === 0) return null;

//                         return (
//                           <div key={langCode} className="language-group">
//                             <div className="language-header">
//                               <span className="language-name">
//                                 {getLanguageName(langCode)}
//                               </span>
//                               <span className="language-count">
//                                 ({filteredItems.length})
//                               </span>
//                             </div>

//                             <div className="translations-list">
//                               {filteredItems.map((item) => (
//                                 <div
//                                   key={item.initials}
//                                   className="translation-option"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     id={`trans-${item.initials}`}
//                                     checked={selectedVersions.includes(
//                                       item.initials
//                                     )}
//                                     onChange={(e) =>
//                                       handleSingleCheckbox(
//                                         item.initials,
//                                         e.target.checked
//                                       )
//                                     }
//                                   />
//                                   <label htmlFor={`trans-${item.initials}`}>
//                                     <span className="translation-initials">
//                                       [{item.initials}]
//                                     </span>
//                                     <span className="translation-name">
//                                       {item.name}
//                                     </span>
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* ФУТЕР */}
//             <div className="modal-footer">
//               <div className="selection-info">
//                 <span className="badge bg-primary">
//                   {selectedVersions.length} {lang.selected || "обрано"}
//                 </span>
//                 {readingMode && (
//                   <span className="badge bg-info ms-2">
//                     {lang.reading_mode || "Режим читання"}
//                   </span>
//                 )}
//               </div>

//               <div className="footer-buttons">
//                 <button className="btn btn-secondary" onClick={onRequestClose}>
//                   {lang.cancel || "Скасувати"}
//                 </button>

//                 <button
//                   className="btn btn-primary"
//                   onClick={handleApply}
//                   disabled={!validationResult.valid}
//                 >
//                   {lang.apply || "Застосувати"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TranslationSelector;

// // console.log("📦 TranslationSelector.js: модуль завантажено");

// /**
//  * ЕКСПОРТ УТІЛІТ ДЛЯ ТЕСТУВАННЯ
//  */
// export const TranslationSelectorUtils = {
//   isOriginalVersion: isOriginalVersionUtil,
//   getLanguageName: getLanguageNameUtil,
//   MAIN_PAIRS: [
//     {
//       key: "lxx-utt",
//       originals: ["LXX"],
//       translations: ["UTT"],
//       name: "LXX + UTT",
//     },
//     {
//       kkey: "thot-ubt",
//       originals: ["THOT"],
//       translations: ["UBT"],
//       name: "THOT + UBT",
//     },
//     {
//       key: "tr-utt",
//       originals: ["TR"],
//       translations: ["UTT"],
//       name: "TR + UTT",
//     },
//     {
//       key: "gnt-translations",
//       originals: ["GNT"],
//       translations: [], // ← Порожній, користувач обирає
//       name: "GNT + переклади",
//     },
//   ],
// };

// ==================================

// src/modals/TranslationSelector.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import CloseIcon from "../elements/CloseIcon";
import TranslationTabs from "../elements/TranslationTabs";
import TranslationFooter from "../elements/TranslationFooter";
import "../styles/TranslationSelector.css";

// ==================== УТІЛІТИ ====================
export const isOriginalVersionUtil = (initials, translationsData) => {
  if (!translationsData || !translationsData.bibles) return false;
  const bible = translationsData.bibles.find((b) => b.initials === initials);
  return bible?.features?.includes("originals") || false;
};

export const getLanguageNameUtil = (code, langDict = {}) => {
  const langMap = {
    _all: langDict.all_languages || "Всі мови",
    _ancient: langDict.ancient || "Стародавні",
    grc: langDict.greek || "Грецька",
    he: langDict.hebrew || "Єврейська",
    uk: langDict.ukrainian || "Українська",
    ru: langDict.russian || "Російська",
    en: langDict.english || "Англійська",
  };
  return langMap[code] || code;
};

// ==================== КОМПОНЕНТ ====================
const TranslationSelector = ({
  isOpen,
  onRequestClose,
  lang,
  onSelectVersions,
  initialVersions = [],
  currentBook = "GEN",
}) => {
  const [translations, setTranslations] = useState({ bibles: [] });
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [activeOriginalTab, setActiveOriginalTab] = useState("lxx");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== КОНСТАНТИ ====================
  const getTestament = (bookCode) => {
    const ntBooks = [
      "MAT",
      "MRK",
      "LUK",
      "JHN",
      "ACT",
      "ROM",
      "1CO",
      "2CO",
      "GAL",
      "EPH",
      "PHP",
      "COL",
      "1TH",
      "2TH",
      "1TI",
      "2TI",
      "TIT",
      "PHM",
      "HEB",
      "JAS",
      "1PE",
      "2PE",
      "1JN",
      "2JN",
      "3JN",
      "JUD",
      "REV",
    ];
    return ntBooks.includes(bookCode) ? "NewT" : "OldT";
  };

  const originalOrder = ["LXX", "THOT", "TR", "GNT"];

  // ==================== ЕФЕКТИ ====================
  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/data/translations.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!isMounted) return;
        setTranslations(data);

        // Встановлення дефолту
        let defaultVersions = [];
        const testament = getTestament(currentBook);

        if (initialVersions.length > 0) {
          defaultVersions = initialVersions;
        } else if (testament === "NewT") {
          defaultVersions = ["TR", "UTT"];
        } else {
          defaultVersions = ["LXX", "UTT"];
        }

        setSelectedVersions(defaultVersions);
        setActiveOriginalTab(testament === "NewT" ? "tr" : "lxx");
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isOpen) loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialVersions, currentBook]);

  // ==================== ГРУПУВАННЯ ЗА ОРИГІНАЛАМИ ====================
  const groupedByOriginal = useMemo(() => {
    const originals =
      translations.bibles?.filter((b) => 
        b.features?.includes("originals") && b.initials !== "GNT"
      ) || [];

    const result = {};

    originals.forEach((orig) => {
      const origKey = orig.initials.toLowerCase();
      result[origKey] = {
        original: orig,
        translations: [],
      };

      // Знаходимо переклади, що базуються на цьому оригіналі
      translations.bibles.forEach((item) => {
        if (!item.basedOn) return;

        const basedOn = item.basedOn;
        const isMatch =
          (origKey === "lxx" && basedOn.old_testament === "lxx") ||
          (origKey === "thot" && basedOn.old_testament === "thot") ||
          (origKey === "tr" && basedOn.new_testament === "tr");

        if (isMatch) {
          result[origKey].translations.push(item);
        }
      });
    });

    // Додаємо GNT як окремий незалежний переклад
    const gntBible = translations.bibles?.find((b) => b.initials === "GNT");
    if (gntBible) {
      result["gnt"] = {
        original: null,
        translations: [gntBible],
        isIndependent: true,
      };
    }

    return result;
  }, [translations]);

  // ==================== ОБРОБНИКИ ====================
  // const handleCheckbox = (initials, checked) => {
  //   setSelectedVersions((prev) => {
  //     if (checked) {
  //       return [...new Set([...prev, initials])];
  //     } else {
  //       return prev.filter((v) => v !== initials);
  //     }
  //   });
  // };
  const handleCheckbox = (initials, checked) => {
    setSelectedVersions((prev) => {
      if (checked) {
        // Просто додаємо обрану версію, без жодних автоматичних супутників
        return [...new Set([...prev, initials])];
      } else {
        // Просто видаляємо
        return prev.filter((v) => v !== initials);
      }
    });
  };

  const handleApply = () => {
    if (selectedVersions.length === 0) {
      alert(lang.select_at_least_one || "Оберіть хоча б одну версію");
      return;
    }
    onSelectVersions(selectedVersions);
    onRequestClose();
  };

  // ==================== РЕНДЕРИНГ ====================
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="translation-selector-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
        <p>{lang.loading || "Завантаження перекладів..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="translation-selector-error">
        <div className="alert alert-danger">
          <h5>Помилка завантаження</h5>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={onRequestClose}>
            {lang.close || "Закрити"}
          </button>
        </div>
      </div>
    );
  }

  const currentGroup = groupedByOriginal[activeOriginalTab] || {
    original: null,
    translations: [],
  };

  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content stepModalFgBg">
            {/* Заголовок */}
            <div className="modal-header">
              <h5>{lang.select_translations || "Оберіть переклади"}</h5>
              <CloseIcon onClick={onRequestClose} />
            </div>

            {/* Таби за оригіналами */}
            <TranslationTabs
              lang={lang}
              activeTab={activeOriginalTab}
              onTabChange={setActiveOriginalTab}
            />

            <div className="modal-body">
              {/* Оригінал */}
              {currentGroup.original && (
                <div className="original-item mb-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id={`orig-${currentGroup.original.initials}`}
                      checked={selectedVersions.includes(
                        currentGroup.original.initials,
                      )}
                      onChange={(e) =>
                        handleCheckbox(
                          currentGroup.original.initials,
                          e.target.checked,
                        )
                      }
                    />
                    <label
                      htmlFor={`orig-${currentGroup.original.initials}`}
                      className="ms-2"
                    >
                      <strong>
                        [{currentGroup.original.initials}]{" "}
                        {currentGroup.original.name}
                      </strong>
                    </label>
                  </div>
                  {currentGroup.original.note && (
                    <small className="text-muted d-block mt-1 ms-4">
                      {currentGroup.original.note}
                    </small>
                  )}
                </div>
              )}

              {/* Переклади */}
              <div className="translations-list mt-3">
                {/* {currentGroup.translations.map((item) => (
                  <div key={item.initials} className="translation-item mb-2">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={`trans-${item.initials}`}
                        checked={selectedVersions.includes(item.initials)}
                        onChange={(e) =>
                          handleCheckbox(item.initials, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`trans-${item.initials}`}
                        className="ms-2"
                      >
                        <span className="fw-bold">
                          [{item.initials}] {item.name}
                        </span>
                      </label>
                    </div>
                    {item.note && (
                      <small className="text-muted d-block ms-4">
                        {item.note}
                      </small>
                    )}
                  </div>
                ))} */}
                {currentGroup.translations.map((item) => (
                  <div key={item.initials} className="translation-item mb-2">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={`trans-${item.initials}`}
                        checked={selectedVersions.includes(item.initials)}
                        onChange={(e) =>
                          handleCheckbox(item.initials, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`trans-${item.initials}`}
                        className="ms-2"
                      >
                        <span className="fw-bold">
                          [{item.initials}] {item.name}
                        </span>
                      </label>
                    </div>
                    {item.note && (
                      <small className="text-muted d-block ms-4">
                        {item.note}
                      </small>
                    )}
                  </div>
                ))}
              </div>

              {/* GNT як окремий незалежний переклад */}
              {currentGroup.isIndependent && currentGroup.translations.map((item) => (
                <div key={item.initials} className="translation-item mb-2 mt-4 border-top pt-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id={`trans-${item.initials}`}
                      checked={selectedVersions.includes(item.initials)}
                      onChange={(e) =>
                        handleCheckbox(item.initials, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`trans-${item.initials}`}
                      className="ms-2"
                    >
                      <span className="fw-bold text-primary">
                        [{item.initials}] {item.name}
                      </span>
                      <small className="text-muted ms-2">(незалежний переклад)</small>
                    </label>
                  </div>
                  {item.note && (
                    <small className="text-muted d-block ms-4 mt-1">
                      {item.note}
                    </small>
                  )}
                </div>
              ))}

              {currentGroup.translations.length === 0 && !currentGroup.isIndependent && (
                <div className="alert alert-info mt-3">
                  Для цього оригіналу поки немає відповідних перекладів.
                </div>
              )}
            </div>

            {/* Футер */}
            <TranslationFooter
              selectedCount={selectedVersions.length}
              onApply={handleApply}
              onCancel={onRequestClose}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationSelector;

// ==================================================== 29.01.2026
