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

// TranslationSelector.js 06.11.2025
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
              {
                initials: "THOT",
                name: "Translators Hebrew Old Testament",
                lang: "he",
                features: ["originals", "N", "G", "V", "I"],
              },
              {
                initials: "UBT",
                name: "Українська Біблія (класичний, масоретський)",
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
    setSelectedVersions((prev) => {
      let newSelected = prev.includes(initials)
        ? prev.filter((v) => v !== initials)
        : [...prev, initials];
      // ← НОВЕ: не дозволяємо 0 вибраних
      if (newSelected.length === 0) {
        newSelected = prev; // Або дефолт, але поки зберігаємо попереднє
        alert(lang.select_at_least_one || "Оберіть хоча б одну версію!");
      }
      return newSelected;
    });
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
