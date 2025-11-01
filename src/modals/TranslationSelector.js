// import React from "react";

// const TranslationSelector = ({ lang }) => {
//   return <div>Placeholder for translation selector</div>;
// };

// export default TranslationSelector;

// import React, { useState, useEffect, useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
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

//   // Завантаження translations.json
//   useEffect(() => {
//     fetch("/data/translations.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setTranslations(data);
//         // Початковий вибір: перший український + THOT
//         const initial = data.bibles
//           .filter((v) => v.lang === "uk" || v.initials === "THOT")
//           .slice(0, 2)
//           .map((v) => v.initials);
//         setSelectedVersions(initial);
//       })
//       .catch((err) => console.error("Failed to load translations.json", err));
//   }, []);

//   // Фільтрація
//   const filteredItems = useMemo(() => {
//     const list =
//       activeTab === "bibleList"
//         ? translations.bibles
//         : translations.commentaries;
//     return list.filter((item) => {
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         item[".lang"] === languageFilter;
//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesLang && matchesSearch;
//     });
//   }, [translations, activeTab, languageFilter, searchQuery]);

//   // Групування по мові
//   const groupedItems = useMemo(() => {
//     const groups = {};
//     filteredItems.forEach((item) => {
//       const key =
//         item.lang === "_ancient"
//           ? "_ancient"
//           : item.lang || item[".lang"] || "_other";
//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });
//     return groups;
//   }, [filteredItems]);

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

//   const languageOptions = [
//     { value: "_all", label: lang.all || "Всі" },
//     { value: "en", label: lang.english || "англійська" },
//     { value: "uk", label: lang.ukrainian || "Українська" },
//     { value: "ru", label: lang.russian || "російська" },
//     { value: "_ancient", label: lang.ancient || "Стародавня" },
//   ];

//   const featuresMap = {
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
//               {/* Tabs */}
//               <ul className="nav nav-tabs bookTypeTabs type-book">
//                 <div>
//                   <span className="pull-left type-book-title">
//                     {lang.book_type || "Тип книги"}:&nbsp;
//                   </span>
//                   <span className={activeTab === "bibleList" ? "active" : ""}>
//                     <a
//                       class="ms-2 type-book-text"
//                       href="#bibleList"
//                       onClick={() => setActiveTab("bibleList")}
//                     >
//                       {lang.bibles || "Біблії"}
//                     </a>
//                   </span>
//                   <span
//                     className={activeTab === "commentaryList" ? "active" : ""}
//                   >
//                     <a
//                       class="ms-2 type-book-text"
//                       href="#commentaryList"
//                       onClick={() => setActiveTab("commentaryList")}
//                     >
//                       {lang.commentaries || "Коментарі"}
//                     </a>
//                   </span>
//                 </div>

//                 <CloseIcon onClick={onRequestClose} />
//               </ul>

//               {/* Language Filter */}
//               <span
//                 className="pull-left"
//                 style={{ fontSize: 13, marginTop: 9, fontWeight: "bold" }}
//               >
//                 {lang.language || "Мова"}:&nbsp;
//               </span>
//               <div className="form-inline" style={{ marginTop: 8 }}>
//                 <div className="btn-group" data-toggle="buttons">
//                   {languageOptions.map((opt) => (
//                     <label
//                       key={opt.value}
//                       className={`btn btn-default btn-sm stepButton ${
//                         languageFilter === opt.value
//                           ? "stepPressedButton active"
//                           : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="languageFilter"
//                         value={opt.value}
//                         checked={languageFilter === opt.value}
//                         onChange={() => setLanguageFilter(opt.value)}
//                       />
//                       {opt.label}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Tab Content */}
//               <div className="tab-content" style={{ marginTop: 15 }}>
//                 <div
//                   className={`tab-pane ${
//                     activeTab === "bibleList" ? "active" : ""
//                   }`}
//                   id="bibleList"
//                 >
//                   {Object.entries(groupedItems).map(([langKey, items]) => {
//                     const langName =
//                       langKey === "_all"
//                         ? lang.currently_showing || "Поточні"
//                         : languageOptions.find((o) => o.value === langKey)
//                             ?.label || langKey;
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
//                               <a className="resource" href="javascript:void(0)">
//                                 {item.initials} - {item.name}
//                               </a>
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
//                 <div
//                   className={`tab-pane ${
//                     activeTab === "commentaryList" ? "active" : ""
//                   }`}
//                   id="commentaryList"
//                 >
//                   {/* Аналогічно для коментарів */}
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="modal-footer">
//               <p style={{ margin: 0, fontSize: 12 }}>
//                 {lang.features || "Фічі"}: N={lang.notes} G={lang.grammar} V=
//                 {lang.vocab} I={lang.interlinear} S={lang.septuagint}
//               </p>
//               <span className="tagLine">
//                 {lang.showing || "Показ"} {filteredItems.length}{" "}
//                 {lang.of || "із"}{" "}
//                 {
//                   translations[
//                     activeTab === "bibleList" ? "bibles" : "commentaries"
//                   ].length
//                 }
//               </span>
//               <input
//                 type="text"
//                 placeholder={lang.search || "Пошук"}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ fontSize: 14, height: 30, width: 150, marginLeft: 10 }}
//               />
//               <button
//                 className="btn btn-default btn-sm stepButton"
//                 onClick={handleApply}
//               >
//                 {lang.ok || "Гаразд"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TranslationSelector;

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

//   // Завантаження
//   useEffect(() => {
//     fetch("/data/translations.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setTranslations(data);
//         const initial = data.bibles
//           .filter((v) => v.lang === "uk" || v.initials === "THOT")
//           .slice(0, 2)
//           .map((v) => v.initials);
//         setSelectedVersions(initial);
//       })
//       .catch(console.error);
//   }, []);

//   // Фільтрація
//   const filteredItems = useMemo(() => {
//     const list =
//       activeTab === "bibleList"
//         ? translations.bibles
//         : translations.commentaries;
//     return list.filter((item) => {
//       const matchesLang =
//         languageFilter === "_all" ||
//         item.lang === languageFilter ||
//         item[".lang"] === languageFilter ||
//         (languageFilter === "_ancient" && item.features?.includes("originals"));
//       const matchesSearch =
//         !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.initials.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesLang && matchesSearch;
//     });
//   }, [translations, activeTab, languageFilter, searchQuery]);

//   // Групування
//   const groupedItems = useMemo(() => {
//     const groups = {};
//     filteredItems.forEach((item) => {
//       const key =
//         languageFilter === "_ancient" && item.features?.includes("originals")
//           ? "_ancient"
//           : item.lang || item[".lang"] || "_other";
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
//                         : langKey === "_all"
//                         ? lang.currently_showing || "Поточні"
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
//                               <a className="resource" href="javascript:void(0)">
//                                 {item.initials} - {item.name}
//                               </a>
//                               <span
//                                 className="BibleFeatures"
//                                 style={{ float: "right" }}
//                               >
//                                 {item.features?.map((f) => (
//                                   <span
//                                     key={f}
//                                     className="versionFeature"
//                                     title={f}
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

//   // === ЗАВАНТАЖЕННЯ + ТИПОВИЙ ВИБІР: LXX + UTT ===
//   // useEffect(() => {
//   //   fetch("/data/translations.json")
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setTranslations(data);

//   //       // ТИПОВИЙ ВИБІР: LXX (оригінал) + UTT (переклад з LXX)
//   //       const defaultVersions = ["LXX", "UTT"];
//   //       const validDefaults = defaultVersions.filter((v) =>
//   //         data.bibles.some((b) => b.initials === v)
//   //       );

//   //       setSelectedVersions(validDefaults);
//   //       onSelectVersions(validDefaults); // Відразу передаємо
//   //     })
//   //     .catch(console.error);
//   // }, [onSelectVersions]);

//   // useEffect(() => {
//   //   fetch("/data/translations.json") // ← ПРАВИЛЬНИЙ ШЛЯХ
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setTranslations(data);
//   //       const defaults = ["LXX", "UTT"].filter((v) =>
//   //         data.bibles.some((b) => b.initials === v)
//   //       );
//   //       setSelectedVersions(defaults);
//   //       onSelectVersions(defaults);
//   //     })
//   //     .catch(console.error);
//   // }, [onSelectVersions]);

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

//   // {
//   //   Object.keys(groupedItems).length === 0 ? (
//   //     <div className="text-center p-3 text-muted">
//   //       {lang.no_translations || "Немає доступних перекладів"}
//   //     </div>
//   //   ) : (
//   //     Object.entries(groupedItems).map()
//   //   );
//   // }

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
//                               <a className="resource" href="javascript:void(0)">
//                                 {item.initials} - {item.name}
//                               </a>
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

import React, { useState, useEffect, useMemo } from "react";
import CloseIcon from "../elements/CloseIcon";
import TranslationTabs from "../elements/TranslationTabs";
import LanguageFilter from "../elements/LanguageFilter";
import TranslationFooter from "../elements/TranslationFooter";
import "../styles/TranslationSelector.css";

const TranslationSelector = ({
  isOpen,
  onRequestClose,
  lang,
  onSelectVersions,
}) => {
  const [translations, setTranslations] = useState({
    bibles: [],
    commentaries: [],
  });
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [activeTab, setActiveTab] = useState("bibleList");
  const [languageFilter, setLanguageFilter] = useState("_all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      try {
        const res = await fetch("/data/translations.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!isMounted) return;

        setTranslations(data);

        // ТИПОВИЙ ВИБІР
        const defaults = ["LXX", "UTT"].filter((v) =>
          data.bibles.some((b) => b.initials === v)
        );
        setSelectedVersions(defaults);
        onSelectVersions(defaults);
      } catch (err) {
        console.error("Failed to load translations.json", err);
        if (isMounted) {
          // ← ЗАХИСТ: мінімальний список
          const fallback = {
            bibles: [
              {
                initials: "LXX",
                name: "Septuagint",
                lang: "grc",
                features: ["originals"],
              },
              {
                initials: "UTT",
                name: "Український переклад",
                lang: "uk",
                features: ["R"],
              },
            ],
            commentaries: [],
          };
          setTranslations(fallback);
          setSelectedVersions(["LXX", "UTT"]);
          onSelectVersions(["LXX", "UTT"]);
        }
      }
    };

    loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [onSelectVersions]);

  // === ФІЛЬТРАЦІЯ ===
  const filteredItems = useMemo(() => {
    const list =
      activeTab === "bibleList"
        ? translations.bibles
        : translations.commentaries;

    return list.filter((item) => {
      const isOriginal = item.features?.includes("originals");
      const matchesLang =
        languageFilter === "_all" ||
        item.lang === languageFilter ||
        (languageFilter === "_ancient" && isOriginal);

      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.initials.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesLang && matchesSearch;
    });
  }, [translations, activeTab, languageFilter, searchQuery]);

  // === ГРУПУВАННЯ ===
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const isOriginal = item.features?.includes("originals");
      const key =
        languageFilter === "_ancient" && isOriginal
          ? "_ancient"
          : item.lang || "_other";

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [filteredItems, languageFilter]);

  const handleCheckboxChange = (initials) => {
    setSelectedVersions((prev) =>
      prev.includes(initials)
        ? prev.filter((v) => v !== initials)
        : [...prev, initials]
    );
  };

  const handleApply = () => {
    onSelectVersions(selectedVersions);
    onRequestClose();
  };

  if (!isOpen) return null;

  const totalCount =
    activeTab === "bibleList"
      ? translations.bibles.length
      : translations.commentaries.length;

  const featuresMap = {
    originals: lang.originals || "Оригінал",
    N: lang.notes || "Примітки",
    G: lang.grammar || "Граматика",
    V: lang.vocab || "Словник",
    I: lang.interlinear || "Міжрядковий",
    S: lang.septuagint || "Септуагінта",
    R: lang.red_letter || "Червоні слова",
  };

  return (
    <>
      <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

      <div className="modal in" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content stepModalFgBg">
            <div className="modal-body">
              <TranslationTabs
                lang={lang}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <CloseIcon onClick={onRequestClose} />

              <LanguageFilter
                lang={lang}
                languageFilter={languageFilter}
                onFilterChange={setLanguageFilter}
              />

              <div className="tab-content" style={{ marginTop: 15 }}>
                <div
                  className={`tab-pane ${
                    activeTab === "bibleList" ? "active" : ""
                  }`}
                  id="bibleList"
                >
                  {Object.entries(groupedItems).map(([langKey, items]) => {
                    const langName =
                      langKey === "_ancient"
                        ? lang.ancient || "Стародавня"
                        : langKey === "uk"
                        ? lang.ukrainian || "Українська"
                        : langKey === "en"
                        ? lang.english || "English"
                        : langKey === "ru"
                        ? lang.russian || "Русский"
                        : langKey;

                    return (
                      <div key={langKey} className="lang-group">
                        <button className="langBtn stepButton stepPressedButton">
                          {langName}&nbsp;
                          <span className="langPlusMinus">-</span>
                        </button>
                        <ul className="list-group langUL">
                          {items.map((item) => (
                            <li
                              key={item.initials}
                              className="list-group-item stepModalFgBg"
                              data-initials={item.initials}
                            >
                              <input
                                type="checkbox"
                                className="list-group-checkbox"
                                checked={selectedVersions.includes(
                                  item.initials
                                )}
                                onChange={() =>
                                  handleCheckboxChange(item.initials)
                                }
                              />
                              &nbsp;
                              <span
                                className="resource"
                                role="button"
                                onClick={() => {}}
                                style={{ cursor: "default" }}
                              >
                                {item.initials} - {item.name}
                              </span>
                              <span
                                className="BibleFeatures"
                                style={{ float: "right" }}
                              >
                                {item.features?.map((f) => (
                                  <span
                                    key={f}
                                    className="versionFeature"
                                    title={featuresMap[f] || f}
                                  >
                                    {f}
                                  </span>
                                ))}
                                &nbsp;
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <TranslationFooter
              lang={lang}
              filteredCount={filteredItems.length}
              totalCount={totalCount}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onApply={handleApply}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationSelector;
