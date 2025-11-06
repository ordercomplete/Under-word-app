// BookSelector.js 06.11.2025

// import React, { useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectBook,
//   coreData,
//   coreLoading,
// }) => {
//   if (!isOpen) return null;

//   if (coreLoading) {
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
//     return (
//       <div className="book-selector-backdrop" onClick={onRequestClose}>
//         <div
//           className="book-selector-modal"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-4 text-center text-danger">
//             <p>{lang.error || "Помилка: core.json не завантажено"}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   console.log("versions:", versions);
//   console.log("coreData keys:", Object.keys(coreData));

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

//     versions.forEach((v) => {
//       const key = v.toLowerCase();
//       const data = coreData[key];
//       if (!data) {
//         console.log(`coreData[${key}] not found`);
//         return;
//       }

//       const ot = data.OldT || [];
//       const nt = data.NewT || [];

//       [...ot, ...nt].forEach((group) => {
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

//   return (
//     <div className="book-selector-backdrop" onClick={onRequestClose}>
//       <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <h5>{lang.select_book || "Оберіть книгу"}</h5>
//             <CloseIcon onClick={onRequestClose} />
//           </div>

//           <div className="book-selector-body">
//             {groupOrder.map((groupName) => {
//               const books = groupedBooks[groupName] || [];
//               if (books.length === 0) return null;

//               const color = genreColors[groupName] || "#6c757d";

//               return (
//                 <div key={groupName} className="book-group">
//                   <h6 className="group-title" style={{ color }}>
//                     {lang[groupName.toLowerCase().replace("/", "_")] ||
//                       groupName}
//                   </h6>
//                   <div className="book-grid">
//                     {books.map((book) => (
//                       <button
//                         key={book.code}
//                         className="book-btn"
//                         onClick={() => {
//                           onSelectBook(book.code);
//                           onRequestClose();
//                         }}
//                         style={{ borderColor: color, color }}
//                       >
//                         {book.code}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookSelector;

// BookSelector.js 06.11.2025
import React, { useMemo } from "react";
import CloseIcon from "../elements/CloseIcon";
import "../styles/BookSelector.css";

const BookSelector = ({
  isOpen,
  onRequestClose,
  lang,
  versions,
  onSelectBook,
  coreData,
  coreLoading,
}) => {
  if (!isOpen) return null;

  if (coreLoading) {
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

  // ← НОВЕ: фолбек якщо coreData null або порожнє
  if (!coreData || Object.keys(coreData).length === 0) {
    return (
      <div className="book-selector-backdrop" onClick={onRequestClose}>
        <div
          className="book-selector-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 text-center text-danger">
            <p>
              {lang.error ||
                "Помилка: дані про книги недоступні. Спробуйте пізніше."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log("versions:", versions);
  console.log("coreData keys:", Object.keys(coreData));

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

  const genreColors = {
    Torah: "#d4a373",
    Historical: "#8b8b8b",
    "Poetry/Wisdom": "#6b8e23",
    Prophets: "#8b0000",
    Gospels: "#1e90ff",
    Acts: "#32cd32",
    Epistles: "#9932cc",
    Revelation: "#ff4500",
  };

  const groupedBooks = useMemo(() => {
    const result = {};
    const seen = new Set();

    versions.forEach((v) => {
      const key = v.toLowerCase();
      const data = coreData[key];
      if (!data) {
        console.warn(`coreData[${key}] not found`); // ← Змінено на warn
        return;
      }

      const ot = data.OldT || [];
      const nt = data.NewT || [];

      [...ot, ...nt].forEach((group) => {
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

  return (
    <div className="book-selector-backdrop" onClick={onRequestClose}>
      <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-selector-content">
          <div className="book-selector-header">
            <h5>{lang.select_book || "Оберіть книгу"}</h5>
            <CloseIcon onClick={onRequestClose} />
          </div>

          <div className="book-selector-body">
            {groupOrder.map((groupName) => {
              const books = groupedBooks[groupName] || [];
              if (books.length === 0) return null;

              const color = genreColors[groupName] || "#6c757d";

              return (
                <div key={groupName} className="book-group">
                  <h6 className="group-title" style={{ color }}>
                    {lang[groupName.toLowerCase().replace("/", "_")] ||
                      groupName}
                  </h6>
                  <div className="book-grid">
                    {books.map((book) => (
                      <button
                        key={book.code}
                        className="book-btn"
                        onClick={() => {
                          onSelectBook(book.code);
                          onRequestClose();
                        }}
                        style={{ borderColor: color, color }}
                      >
                        {book.code}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSelector;
