// // BookSelector.js 06.11.2025
// import React, { useMemo, useState } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   // onSelectBook,
//   // coreData,
//   // coreLoading,
//   coreData = {}, // ← ДЕФОЛТ
//   coreLoading = false, // ← ДЕФОЛТ
//   onSelectBookAndChapter, // Новий пропс: (bookCode, chapter) => void
//   // onSelectBook — можна залишити для сумісності, але не використовуємо
// }) => {
//   if (!isOpen) return null;

//   const [selectedBookCode, setSelectedBookCode] = useState(null);
//   const [selectedChapters, setSelectedChapters] = useState(0);

//   // Обчислюємо максимальну кількість розділів для вибраної книги з усіх версій
//   const getMaxChapters = (bookCode) => {
//     let max = 1;
//     versions.forEach((ver) => {
//       const verKey = ver.toLowerCase();
//       if (!coreData[verKey]) return;

//       const testament = bookCode.match(
//         /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
//       )
//         ? "NewT"
//         : "OldT";

//       const books = coreData[verKey][testament]?.flatMap((g) => g.books) || [];
//       const bookInfo = books.find((b) => b.code === bookCode);
//       if (bookInfo && bookInfo.chapters > max) {
//         max = bookInfo.chapters;
//       }
//     });
//     return max;
//   };

//   console.log("1-BookSelector: coreData keys:", Object.keys(coreData || {}));

//   if (coreLoading) {
//     console.log("2-BookSelector: coreData keys:", Object.keys(coreData || {}));
//     return (
//       <div className="book-selector-backdrop" onClick={onRequestClose}>
//         <div
//           className="book-selector-modal"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-4 text-center">
//             <div className="spinner-border" role="status">
//               <span className="visually-hidden">Завантаження...</span>
//             </div>
//             <p className="mt-3">{lang.loading || "Завантаження книг..."}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!coreData || Object.keys(coreData).length === 0) {
//     console.log("3-BookSelector: coreData keys:", Object.keys(coreData || {}));
//     return (
//       <div className="book-selector-backdrop" onClick={onRequestClose}>
//         <div
//           className="book-selector-modal"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-4 text-center text-danger">
//             <p>{lang.error || "Помилка: дані про книги недоступні."}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));
//   console.log("versions:", versions);

//   const groupOrder = [
//     "Torah",
//     "Historical",
//     "Poetry/Wisdom",
//     "Prophets",
//     "Gospels",
//     "Acts",
//     "Epistles",
//     "Revelation",
//   ];

//   const bookOrderInGroup = {
//     Torah: ["GEN", "EXO", "LEV", "NUM", "DEU"],
//     Historical: [
//       "JOS",
//       "JDG",
//       "RUT",
//       "1SA",
//       "2SA",
//       "1KI",
//       "2KI",
//       "1CH",
//       "2CH",
//       "EZR",
//       "NEH",
//       "EST",
//     ],
//     "Poetry/Wisdom": ["JOB", "PSA", "PRO", "ECC", "SNG"],
//     Prophets: [
//       "ISA",
//       "JER",
//       "LAM",
//       "EZE",
//       "DAN",
//       "HOS",
//       "JOL",
//       "AMO",
//       "OBA",
//       "JON",
//       "MIC",
//       "NAM",
//       "HAB",
//       "SOP",
//       "HAG",
//       "ZEC",
//       "MAL",
//     ],
//     Gospels: ["MAT", "MRK", "LUK", "JHN"],
//     Acts: ["ACT"],
//     Epistles: [
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
//     ],
//     Revelation: ["REV"],
//   };

//   const genreColors = {
//     Torah: "#d4a373",
//     Historical: "#8b8b8b",
//     "Poetry/Wisdom": "#6b8e23",
//     Prophets: "#8b0000",
//     Gospels: "#1e90ff",
//     Acts: "#32cd32",
//     Epistles: "#9932cc",
//     Revelation: "#ff4500",
//   };

//   const groupedBooks = useMemo(() => {
//     const result = {};
//     const seen = new Set();
//     // Проблема: return в середині forEach не припиняє весь цикл - він припиняє тільки поточну ітерацію. Якщо перша версія не знайдена, це не має блокувати показ книг для інших версій. Також: Логіка console.log/console.warn зайва в продакшені.
//     versions.forEach((v) => {
//       const key = v.toLowerCase();
//       const data = coreData[key];
//       console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));
//       if (!data) {
//         console.warn(`coreData[${key}] not found`); // ← Змінено на warn
//         console.log(
//           "BookSelector: coreData keys:",
//           Object.keys(coreData || {}),
//         );
//         return;
//       }

//       const sections = [...(data.OldT || []), ...(data.NewT || [])];
//       // const sections = [...(data.O || []), ...(data.N || [])];

//       sections.forEach((group) => {
//         if (!group?.group || !Array.isArray(group.books)) return;
//         const groupName = group.group;
//         if (!result[groupName]) result[groupName] = [];

//         group.books.forEach((book) => {
//           if (!seen.has(book.code)) {
//             seen.add(book.code);
//             result[groupName].push(book);
//           }
//         });
//       });
//     });

//     // Сортування
//     Object.keys(result).forEach((group) => {
//       result[group].sort((a, b) => {
//         const order = bookOrderInGroup[group] || [];
//         const ia = order.indexOf(a.code);
//         const ib = order.indexOf(b.code);
//         return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
//       });
//     });

//     console.log("groupedBooks:", result);
//     return result;
//   }, [versions, coreData]);

//   console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));

//   // Якщо вибрана книга — показуємо розділи
//   if (selectedBookCode) {
//     // const chaptersCount = selectedChapters || getMaxChapters(selectedBookCode);
//     const chaptersCount = getMaxChapters(selectedBookCode); // або з useMemo

//     return (
//       <div className="book-selector-backdrop" onClick={onRequestClose}>
//         <div
//           className="book-selector-modal"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="book-selector-content">
//             <div className="book-selector-header">
//               <h5>
//                 {selectedBookCode} — {lang.select_chapter || "Оберіть розділ"}
//               </h5>
//               <CloseIcon onClick={onRequestClose} />
//             </div>

//             <div className="book-selector-body">
//               <div className="chapter-grid">
//                 {Array.from({ length: chaptersCount }, (_, i) => i + 1).map(
//                   (ch) => (
//                     <button
//                       key={ch}
//                       className="chapter-btn"
//                       onClick={() => {
//                         onSelectBookAndChapter(selectedBookCode, ch);
//                         onRequestClose();
//                       }}
//                       style={{
//                         borderColor: genreColors,
//                         color: genreColors,
//                       }}
//                       // style={{ borderColor: genreColors, color }}
//                     >
//                       {ch}
//                     </button>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Початковий стан — вибір книги
//   return (
//     <div className="book-selector-backdrop" onClick={onRequestClose}>
//       <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <h5>{lang.select_book || "Оберіть книгу"}</h5>
//             <CloseIcon onClick={onRequestClose} />
//           </div>

//           <div className="book-selector-body">
//             <div className="all-books-grid">
//               {groupOrder.map((groupName) => {
//                 const books = groupedBooks[groupName] || [];
//                 if (books.length === 0) return null;

//                 const color = genreColors[groupName] || "#6c757d";

//                 return books.map((book) => (
//                   <button
//                     key={book.code}
//                     className="book-btn"
//                     onClick={() => {
//                       setSelectedBookCode(book.code);
//                       setSelectedChapters(getMaxChapters(book.code));
//                     }}
//                     style={{ borderColor: genreColors, color }}
//                     title={`${book.code} (${groupName})`}
//                   >
//                     {book.code}
//                   </button>
//                 ));
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookSelector;

// ================================

// BookSelector.js 06.11.2025
import React, { useMemo, useState } from "react";
import CloseIcon from "../elements/CloseIcon";
import "../styles/BookSelector.css";
import { genreColors, getGenreColor } from "../config/bookGenres";

const BookSelector = ({
  isOpen,
  onRequestClose,
  lang,
  versions,
  coreData = {}, // ← ДЕФОЛТ
  coreLoading = false, // ← ДЕФОЛТ
  onSelectBookAndChapter, // Новий пропс: (bookCode, chapter) => void
  // onSelectBook — можна залишити для сумісності, але не використовуємо
}) => {
  if (!isOpen) return null;

  const [selectedBookCode, setSelectedBookCode] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState(0);

  // Обчислюємо максимальну кількість розділів для вибраної книги з усіх версій
  // const getMaxChapters = (bookCode) => {
  //   let max = 1;
  //   versions.forEach((ver) => {
  //     const verKey = ver.toLowerCase();
  //     if (!coreData[verKey]) return;

  //     const testament = bookCode.match(
  //       /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
  //     )
  //       ? "NewT"
  //       : "OldT";

  //     const books = coreData[verKey][testament]?.flatMap((g) => g.books) || [];
  //     const bookInfo = books.find((b) => b.code === bookCode);
  //     if (bookInfo && bookInfo.chapters > max) {
  //       max = bookInfo.chapters;
  //     }
  //   });
  //   return max;
  // };
  // const getMaxChapters = (bookCode) => {
  //   let max = 1;

  //   const isNewTestament = bookCode.match(
  //     /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
  //   );

  //   versions.forEach((ver) => {
  //     const verKey = ver.toLowerCase();
  //     if (!coreData[verKey]) return;

  //     // Визначаємо потрібний заповіт
  //     const requiredTestament = isNewTestament ? "NewT" : "OldT";

  //     // Перевіряємо, чи має ця версія потрібний заповіт
  //     if (!coreData[verKey][requiredTestament]) {
  //       // console.debug(`Версія ${ver} не має ${requiredTestament} — пропускаємо`);
  //       return;
  //     }

  //     const books =
  //       coreData[verKey][requiredTestament].flatMap((g) => g.books) || [];
  //     const bookInfo = books.find((b) => b.code === bookCode);

  //     if (bookInfo && bookInfo.chapters > max) {
  //       max = bookInfo.chapters;
  //     }
  //   });

  //   return max;
  // };
  const getMaxChapters = (bookCode) => {
    let max = 1;

    // Визначаємо, чи це книга Нового Заповіту
    const isNewTestament = bookCode.match(
      /^(MAT|MRK|LUK|JHN|ACT|ROM|1CO|2CO|GAL|EPH|PHP|COL|1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|1PE|2PE|1JN|2JN|3JN|JUD|REV)$/,
    );

    // Потрібний заповіт
    const requiredTestament = isNewTestament ? "NewT" : "OldT";

    versions.forEach((ver) => {
      const verKey = ver.toLowerCase();
      if (!coreData[verKey]) return;

      // Ключовий момент: якщо версія НЕ МАЄ потрібного заповіту — тихо пропускаємо, БЕЗ логів
      if (!coreData[verKey][requiredTestament]) {
        return; // ← жодного console.warn або log
      }

      const books = coreData[verKey][requiredTestament]
        .flatMap((g) => g.books || []) // захист від undefined
        .filter(Boolean); // прибираємо можливі null/undefined

      const bookInfo = books.find((b) => b.code === bookCode);

      if (bookInfo?.chapters && bookInfo.chapters > max) {
        max = bookInfo.chapters;
      }
    });

    return max;
  };

  const genreColorForBook = getGenreColor(selectedBookCode);
  // ... (існуючі константи groupOrder, bookOrderInGroup, genreColors — без змін)

  if (coreLoading) {
    console.log("2-BookSelector: coreData keys:", Object.keys(coreData || {}));
    return (
      <div className="book-selector-backdrop" onClick={onRequestClose}>
        <div
          className="book-selector-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </div>
            <p className="mt-3">{lang.loading || "Завантаження книг..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!coreData || Object.keys(coreData).length === 0) {
    console.log("3-BookSelector: coreData keys:", Object.keys(coreData || {}));
    return (
      <div className="book-selector-backdrop" onClick={onRequestClose}>
        <div
          className="book-selector-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 text-center text-danger">
            <p>{lang.error || "Помилка: дані про книги недоступні."}</p>
          </div>
        </div>
      </div>
    );
  }
  console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));
  console.log("versions:", versions);

  const groupOrder = [
    "Torah",
    "Historical",
    "Poetry/Wisdom",
    "Prophets",
    "Gospels",
    "Acts",
    "Epistles",
    "Revelation",
  ];

  const bookOrderInGroup = {
    Torah: ["GEN", "EXO", "LEV", "NUM", "DEU"],
    Historical: [
      "JOS",
      "JDG",
      "RUT",
      "1SA",
      "2SA",
      "1KI",
      "2KI",
      "1CH",
      "2CH",
      "EZR",
      "NEH",
      "EST",
    ],
    "Poetry/Wisdom": ["JOB", "PSA", "PRO", "ECC", "SNG"],
    Prophets: [
      "ISA",
      "JER",
      "LAM",
      "EZE",
      "DAN",
      "HOS",
      "JOL",
      "AMO",
      "OBA",
      "JON",
      "MIC",
      "NAM",
      "HAB",
      "SOP",
      "HAG",
      "ZEC",
      "MAL",
    ],
    Gospels: ["MAT", "MRK", "LUK", "JHN"],
    Acts: ["ACT"],
    Epistles: [
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
    ],
    Revelation: ["REV"],
  };

  const groupedBooks = useMemo(() => {
    const result = {};
    const seen = new Set();

    // Проблема: return в середині forEach не припиняє весь цикл - він припиняє тільки поточну ітерацію. Якщо перша версія не знайдена, це не має блокувати показ книг для інших версій. Також: Логіка console.log/console.warn зайва в продакшені.
    versions.forEach((v) => {
      const key = v.toLowerCase();
      // const data = coreData[key];
      const normalizedCoreData = Object.fromEntries(
        Object.entries(coreData).map(([k, v]) => [k.toLowerCase(), v]),
      );
      const data = normalizedCoreData[key];
      console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));

      if (!data) {
        console.warn(`coreData[${key}] not found`); // ← Змінено на warn
        console.log(
          "BookSelector: coreData keys:",
          Object.keys(coreData || {}),
        );
        return;
      }

      const sections = [...(data.OldT || []), ...(data.NewT || [])];
      // const sections = [...(data.O || []), ...(data.N || [])];

      sections.forEach((group) => {
        if (!group?.group || !Array.isArray(group.books)) return;
        const groupName = group.group;
        if (!result[groupName]) result[groupName] = [];

        group.books.forEach((book) => {
          if (!seen.has(book.code)) {
            seen.add(book.code);
            result[groupName].push(book);
          }
        });
      });
    });

    // Сортування
    Object.keys(result).forEach((group) => {
      result[group].sort((a, b) => {
        const order = bookOrderInGroup[group] || [];
        const ia = order.indexOf(a.code);
        const ib = order.indexOf(b.code);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
    });

    console.log("groupedBooks:", result);
    return result;
  }, [versions, coreData]);

  console.log("BookSelector: coreData keys:", Object.keys(coreData || {}));

  // Якщо вибрана книга — показуємо розділи
  if (selectedBookCode) {
    // const chaptersCount = selectedChapters || getMaxChapters(selectedBookCode);
    const chaptersCount = getMaxChapters(selectedBookCode); // або з useMemo

    return (
      <div className="book-selector-backdrop" onClick={onRequestClose}>
        <div
          className="book-selector-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="book-selector-content">
            <div className="book-selector-header">
              <h5>
                {selectedBookCode} — {lang.select_chapter || "Оберіть розділ"}
              </h5>
              <CloseIcon onClick={onRequestClose} />
            </div>

            <div className="book-selector-body">
              <div className="chapter-grid">
                {Array.from({ length: chaptersCount }, (_, i) => i + 1).map(
                  (ch) => (
                    <button
                      key={ch}
                      className="chapter-btn"
                      onClick={() => {
                        onSelectBookAndChapter(selectedBookCode, ch);
                        onRequestClose();
                      }}
                      style={{
                        borderColor: genreColorForBook,
                        color: genreColorForBook,
                      }}
                    >
                      {ch}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Початковий стан — вибір книги
  return (
    <div className="book-selector-backdrop" onClick={onRequestClose}>
      <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-selector-content">
          <div className="book-selector-header">
            <h5>{lang.select_book || "Оберіть книгу"}</h5>
            <CloseIcon onClick={onRequestClose} />
          </div>

          <div className="book-selector-body">
            <div className="all-books-grid">
              {groupOrder.map((groupName) => {
                const books = groupedBooks[groupName] || [];
                if (books.length === 0) return null;

                const color = genreColors[groupName] || "#6c757d";

                return books.map((book) => (
                  <button
                    key={book.code}
                    className="book-btn"
                    onClick={() => {
                      setSelectedBookCode(book.code);
                      setSelectedChapters(getMaxChapters(book.code));
                    }}
                    // style={{ borderColor: genreColors, color }}
                    style={{ borderColor: color, color }}
                    title={`${book.code} (${groupName})`}
                  >
                    {book.code}
                  </button>
                ));
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSelector;
