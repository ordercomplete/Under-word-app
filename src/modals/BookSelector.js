// import React from "react";

// const BookSelector = ({ lang }) => {
//   return <div>Placeholder for book selector</div>;
// };

// export default BookSelector;

// ----------------------------------------------

// import React, { useState, useEffect, useMemo } from "react";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectRef,
// }) => {
//   const [coreData, setCoreData] = useState({});
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [chapterMode, setChapterMode] = useState(false);
//   const [passageInput, setPassageInput] = useState("");

//   // Завантаження core.json
//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((res) => res.json())
//       .then((data) => setCoreData(data))
//       .catch((err) => console.error("Failed to load core.json", err));
//   }, []);

//   // Визначаємо доступні переклади (ключі в core.json)
//   const availableVersions = useMemo(() => {
//     return versions.filter((v) => coreData[v?.toLowerCase()]);
//   }, [versions, coreData]);

//   // Об'єднуємо всі книги з доступних перекладів
//   const allBooks = useMemo(() => {
//     const booksMap = new Map();
//     availableVersions.forEach((v) => {
//       const key = v.toLowerCase();
//       if (coreData[key]?.OldT) {
//         coreData[key].OldT.forEach((group) => {
//           group.books.forEach((book) => {
//             if (!booksMap.has(book.code)) {
//               booksMap.set(book.code, { ...book, sources: [v] });
//             } else {
//               const existing = booksMap.get(book.code);
//               existing.chapters = Math.max(existing.chapters, book.chapters);
//               existing.sources.push(v);
//             }
//           });
//         });
//       }
//     });
//     return Array.from(booksMap.values()).sort((a, b) =>
//       a.code.localeCompare(b.code)
//     );
//   }, [availableVersions, coreData]);

//   // Групування книг
//   const groupedBooks = useMemo(() => {
//     const groups = {};
//     allBooks.forEach((book) => {
//       const groupName = getGroupName(book.code);
//       if (!groups[groupName]) groups[groupName] = [];
//       groups[groupName].push(book);
//     });
//     return groups;
//   }, [allBooks]);

//   const getGroupName = (code) => {
//     const otGroups = {
//       Torah: ["GEN", "EXO", "LEV", "NUM", "DEU"],
//       Historical: [
//         "JOS",
//         "JDG",
//         "RUT",
//         "1SA",
//         "2SA",
//         "1KI",
//         "2KI",
//         "1CH",
//         "2CH",
//         "EZR",
//         "NEH",
//         "EST",
//       ],
//       "Poetry/Wisdom": ["JOB", "PSA", "PRO", "ECC", "SNG"],
//       Prophets: [
//         "ISA",
//         "JER",
//         "LAM",
//         "EZE",
//         "DAN",
//         "HOS",
//         "JOL",
//         "AMO",
//         "OBA",
//         "JON",
//         "MIC",
//         "NAM",
//         "HAB",
//         "SOP",
//         "HAG",
//         "ZEC",
//         "MAL",
//       ],
//       Gospels: ["MAT", "MRK", "LUK", "JHN"],
//       Acts: ["ACT"],
//       Epistles: [
//         "ROM",
//         "1CO",
//         "2CO",
//         "GAL",
//         "EPH",
//         "PHP",
//         "COL",
//         "1TH",
//         "2TH",
//         "1TI",
//         "2TI",
//         "TIT",
//         "PHM",
//         "HEB",
//         "JAS",
//         "1PE",
//         "2PE",
//         "1JN",
//         "2JN",
//         "3JN",
//         "JUD",
//       ],
//       Revelation: ["REV"],
//     };
//     for (const [group, codes] of Object.entries(otGroups)) {
//       if (codes.includes(code)) return group;
//     }
//     return "Other";
//   };

//   const handleBookClick = (book) => {
//     setSelectedBook(book);
//     setChapterMode(true);
//   };

//   const handleChapterClick = (chapter) => {
//     const ref = `${selectedBook.code}.${chapter}`;
//     onSelectRef(ref);
//     onRequestClose();
//   };

//   const handlePassageSubmit = () => {
//     if (passageInput.trim()) {
//       onSelectRef(passageInput.trim());
//       onRequestClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div
//             className="modal-content stepModalFgBg"
//             style={{ width: "95%", maxWidth: "100%" }}
//           >
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="close"
//                 onClick={onRequestClose}
//                 style={{
//                   background: "var(--clrBackground)",
//                   color: "var(--clrText)",
//                   opacity: 0.9,
//                 }}
//               >
//                 X
//               </button>

//               <div
//                 className="form-group"
//                 style={{ float: "right", fontSize: 16 }}
//               >
//                 <label>{lang.display_in || "Показати в:"}</label>
//                 <select
//                   className="form-control stepFgBg"
//                   style={{ width: "auto", display: "inline-block" }}
//                 >
//                   <option value="replace">
//                     {lang.current_panel || "Поточна панель"}
//                   </option>
//                   <option value="new">{lang.new_panel || "Нова панель"}</option>
//                   <option value="append">
//                     {lang.append || "Додати до поточної"}
//                   </option>
//                 </select>
//               </div>
//               <br />
//             </div>

//             <textarea
//               className="form-control stepFgBg"
//               rows="1"
//               style={{
//                 fontSize: 13,
//                 width: "95%",
//                 margin: "10px auto",
//                 resize: "none",
//                 height: 34,
//               }}
//               placeholder={
//                 lang.enter_passage || "Введіть уривок, напр.: 'Йоана 3:16'"
//               }
//               value={passageInput}
//               onChange={(e) => setPassageInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handlePassageSubmit()}
//             />

//             <div className="modal-body">
//               {chapterMode ? (
//                 <>
//                   <button
//                     className="btn btn-link"
//                     onClick={() => setChapterMode(false)}
//                     style={{ fontSize: 16 }}
//                   >
//                     ← {lang.back_to_books || "Назад до книг"}
//                   </button>
//                   <h4>
//                     {selectedBook.name} —{" "}
//                     {lang.select_chapter || "Оберіть розділ"}
//                   </h4>
//                   <div className="chapter-grid">
//                     {Array.from(
//                       { length: selectedBook.chapters },
//                       (_, i) => i + 1
//                     ).map((ch) => (
//                       <button
//                         key={ch}
//                         className="btn btn-outline-primary btn-sm chapter-btn"
//                         onClick={() => handleChapterClick(ch)}
//                       >
//                         {ch}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="header">
//                     <h4>{lang.select_book || "Оберіть книгу"}</h4>
//                   </div>

//                   <div>
//                     <h5 className="mt-3">
//                       {lang.old_testament || "Старий Заповіт"}
//                     </h5>
//                     {Object.entries(groupedBooks).map(([group, books]) => (
//                       <div key={group} className="book-group mb-4">
//                         {/* <h6 className="text-muted">
//                           {lang[group.toLowerCase()] || group}
//                         </h6> */}
//                         <h6 className="text-muted">
//                           {lang[group.toLowerCase().replace("/", "_")] || group}
//                         </h6>
//                         <table className="table table-sm table-borderless">
//                           <tbody>
//                             {chunkArray(books, 7).map((row, i) => (
//                               <tr key={i}>
//                                 {row.map((book) => (
//                                   <td key={book.code} style={{ width: "14%" }}>
//                                     <a
//                                       href="javascript:void(0)"
//                                       onClick={() => handleBookClick(book)}
//                                       title={book.name}
//                                     >
//                                       {book.name.length > 8
//                                         ? book.name.slice(0, 7) + "…"
//                                         : book.name}
//                                     </a>
//                                   </td>
//                                 ))}
//                                 {row.length < 7 &&
//                                   Array.from({ length: 7 - row.length }).map(
//                                     (_, j) => <td key={`empty-${j}`}></td>
//                                   )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Допоміжна функція
// const chunkArray = (arr, size) => {
//   const result = [];
//   for (let i = 0; i < arr.length; i += size) {
//     result.push(arr.slice(i, i + size));
//   }
//   return result;
// };

// export default BookSelector;

// import React, { useState, useEffect, useMemo } from "react";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectRef,
// }) => {
//   const [coreData, setCoreData] = useState({});
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [chapterMode, setChapterMode] = useState(false);
//   const [passageInput, setPassageInput] = useState("");

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((res) => res.json())
//       .then((data) => setCoreData(data))
//       .catch((err) => console.error("Failed to load core.json", err));
//   }, []);

//   const availableVersions = useMemo(() => {
//     return versions.filter((v) => coreData[v.toLowerCase()]);
//   }, [versions, coreData]);

//   const allBooks = useMemo(() => {
//     const booksMap = new Map();
//     availableVersions.forEach((v) => {
//       const key = v.toLowerCase();
//       if (coreData[key]?.OldT) {
//         coreData[key].OldT.forEach((group) => {
//           group.books.forEach((book) => {
//             if (!booksMap.has(book.code)) {
//               booksMap.set(book.code, { ...book, sources: [v] });
//             } else {
//               const existing = booksMap.get(book.code);
//               existing.chapters = Math.max(existing.chapters, book.chapters);
//               existing.sources.push(v);
//             }
//           });
//         });
//       }
//     });
//     return Array.from(booksMap.values()).sort((a, b) =>
//       a.code.localeCompare(b.code)
//     );
//   }, [availableVersions, coreData]);

//   const groupedBooks = useMemo(() => {
//     const groups = {};
//     allBooks.forEach((book) => {
//       const groupName = getGroupName(book.code);
//       if (!groups[groupName]) groups[groupName] = [];
//       groups[groupName].push(book);
//     });
//     return groups;
//   }, [allBooks]);

//   const getGroupName = (code) => {
//     const otGroups = {
//       Torah: ["GEN", "EXO", "LEV", "NUM", "DEU"],
//       Historical: [
//         "JOS",
//         "JDG",
//         "RUT",
//         "1SA",
//         "2SA",
//         "1KI",
//         "2KI",
//         "1CH",
//         "2CH",
//         "EZR",
//         "NEH",
//         "EST",
//       ],
//       "Poetry/Wisdom": ["JOB", "PSA", "PRO", "ECC", "SNG"],
//       Prophets: [
//         "ISA",
//         "JER",
//         "LAM",
//         "EZE",
//         "DAN",
//         "HOS",
//         "JOL",
//         "AMO",
//         "OBA",
//         "JON",
//         "MIC",
//         "NAM",
//         "HAB",
//         "SOP",
//         "HAG",
//         "ZEC",
//         "MAL",
//       ],
//       Gospels: ["MAT", "MRK", "LUK", "JHN"],
//       Acts: ["ACT"],
//       Epistles: [
//         "ROM",
//         "1CO",
//         "2CO",
//         "GAL",
//         "EPH",
//         "PHP",
//         "COL",
//         "1TH",
//         "2TH",
//         "1TI",
//         "2TI",
//         "TIT",
//         "PHM",
//         "HEB",
//         "JAS",
//         "1PE",
//         "2PE",
//         "1JN",
//         "2JN",
//         "3JN",
//         "JUD",
//       ],
//       Revelation: ["REV"],
//     };
//     for (const [group, codes] of Object.entries(otGroups)) {
//       if (codes.includes(code)) return group;
//     }
//     return "Other";
//   };

//   const handleBookClick = (book) => {
//     setSelectedBook(book);
//     setChapterMode(true);
//   };

//   const handleChapterClick = (chapter) => {
//     const ref = `${selectedBook.code}.${chapter}`;
//     onSelectRef(ref);
//     onRequestClose();
//   };

//   const handlePassageSubmit = () => {
//     if (passageInput.trim()) {
//       onSelectRef(passageInput.trim());
//       onRequestClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="modal-backdrop fade in" onClick={onRequestClose}></div>

//       <div className="modal in" style={{ display: "block" }} tabIndex="-1">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content stepModalFgBg">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="close"
//                 onClick={onRequestClose}
//                 style={{
//                   background: "var(--clrBackground)",
//                   color: "var(--clrText)",
//                   opacity: 0.9,
//                 }}
//               >
//                 X
//               </button>
//               <div
//                 className="form-group"
//                 style={{ float: "right", fontSize: 16 }}
//               >
//                 <label>{lang.display_in || "Показати в:"}</label>
//                 <select
//                   className="form-control stepFgBg"
//                   style={{ width: "auto", display: "inline-block" }}
//                 >
//                   <option value="replace">
//                     {lang.current_panel || "Поточна панель"}
//                   </option>
//                   <option value="new">{lang.new_panel || "Нова панель"}</option>
//                   <option value="append">
//                     {lang.append || "Додати до поточної"}
//                   </option>
//                 </select>
//               </div>
//               <br />
//             </div>

//             <textarea
//               className="form-control stepFgBg"
//               rows="1"
//               style={{
//                 fontSize: 13,
//                 width: "95%",
//                 margin: "10px auto",
//                 resize: "none",
//                 height: 34,
//               }}
//               placeholder={
//                 lang.enter_passage || "Введіть уривок, напр.: 'Йоана 3:16'"
//               }
//               value={passageInput}
//               onChange={(e) => setPassageInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handlePassageSubmit()}
//             />

//             <div className="modal-body">
//               {chapterMode ? (
//                 <>
//                   <button
//                     className="btn btn-link"
//                     onClick={() => setChapterMode(false)}
//                   >
//                     ← {lang.back_to_books || "Назад до книг"}
//                   </button>
//                   <h4>
//                     {selectedBook.name} —{" "}
//                     {lang.select_chapter || "Оберіть розділ"}
//                   </h4>
//                   <div className="chapter-grid">
//                     {Array.from(
//                       { length: selectedBook.chapters },
//                       (_, i) => i + 1
//                     ).map((ch) => (
//                       <button
//                         key={ch}
//                         className="btn btn-outline-primary btn-sm chapter-btn"
//                         onClick={() => handleChapterClick(ch)}
//                       >
//                         {ch}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="header">
//                     <h4>{lang.select_book || "Оберіть книгу"}</h4>
//                   </div>

//                   <div>
//                     <h5 className="mt-3">
//                       {lang.old_testament || "Старий Заповіт"}
//                     </h5>
//                     {Object.entries(groupedBooks).map(([group, books]) => (
//                       <div key={group} className="book-group mb-4">
//                         <h6 className="text-muted">
//                           {lang[group.toLowerCase().replace("/", "_")] || group}
//                         </h6>
//                         <table className="table table-sm table-borderless">
//                           <tbody>
//                             {chunkArray(books, 7).map((row, i) => (
//                               <tr key={i}>
//                                 {row.map((book) => (
//                                   <td key={book.code} style={{ width: "14%" }}>
//                                     <a
//                                       href="javascript:void(0)"
//                                       onClick={() => handleBookClick(book)}
//                                       title={book.name}
//                                     >
//                                       {book.name.length > 8
//                                         ? book.name.slice(0, 7) + "…"
//                                         : book.name}
//                                     </a>
//                                   </td>
//                                 ))}
//                                 {row.length < 7 &&
//                                   Array.from({ length: 7 - row.length }).map(
//                                     (_, j) => <td key={`empty-${j}`}></td>
//                                   )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const chunkArray = (arr, size) => {
//   const result = [];
//   for (let i = 0; i < arr.length; i += size) {
//     result.push(arr.slice(i, i + size));
//   }
//   return result;
// };

// export default BookSelector;

// ----------------------------------------------------

// import React, { useState, useEffect, useMemo } from "react";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectRef,
// }) => {
//   const [coreData, setCoreData] = useState({});
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [chapterMode, setChapterMode] = useState(false);
//   const [passageInput, setPassageInput] = useState("");

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((res) => res.json())
//       .then(setCoreData)
//       .catch(console.error);
//   }, []);

//   const availableVersions = useMemo(() => {
//     return versions.filter((v) => coreData[v.toLowerCase()]);
//   }, [versions, coreData]);

//   const allBooks = useMemo(() => {
//     const map = new Map();
//     availableVersions.forEach((v) => {
//       const key = v.toLowerCase();
//       coreData[key]?.OldT?.forEach((group) => {
//         group.books.forEach((book) => {
//           if (!map.has(book.code)) {
//             map.set(book.code, { ...book, sources: [v] });
//           } else {
//             const existing = map.get(book.code);
//             existing.chapters = Math.max(existing.chapters, book.chapters);
//             existing.sources.push(v);
//           }
//         });
//       });
//     });
//     return Array.from(map.values()).sort((a, b) =>
//       a.code.localeCompare(b.code)
//     );
//   }, [availableVersions, coreData]);

//   const groupedBooks = useMemo(() => {
//     const groups = {};
//     allBooks.forEach((book) => {
//       const group = getGroupName(book.code);
//       if (!groups[group]) groups[group] = [];
//       groups[group].push(book);
//     });
//     return groups;
//   }, [allBooks]);

//   const getGroupName = (code) => {
//     const groups = {
//       Torah: ["GEN", "EXO", "LEV", "NUM", "DEU"],
//       Historical: [
//         "JOS",
//         "JDG",
//         "RUT",
//         "1SA",
//         "2SA",
//         "1KI",
//         "2KI",
//         "1CH",
//         "2CH",
//         "EZR",
//         "NEH",
//         "EST",
//       ],
//       "Poetry/Wisdom": ["JOB", "PSA", "PRO", "ECC", "SNG"],
//       Prophets: [
//         "ISA",
//         "JER",
//         "LAM",
//         "EZE",
//         "DAN",
//         "HOS",
//         "JOL",
//         "AMO",
//         "OBA",
//         "JON",
//         "MIC",
//         "NAM",
//         "HAB",
//         "SOP",
//         "HAG",
//         "ZEC",
//         "MAL",
//       ],
//       Gospels: ["MAT", "MRK", "LUK", "JHN"],
//       Acts: ["ACT"],
//       Epistles: [
//         "ROM",
//         "1CO",
//         "2CO",
//         "GAL",
//         "EPH",
//         "PHP",
//         "COL",
//         "1TH",
//         "2TH",
//         "1TI",
//         "2TI",
//         "TIT",
//         "PHM",
//         "HEB",
//         "JAS",
//         "1PE",
//         "2PE",
//         "1JN",
//         "2JN",
//         "3JN",
//         "JUD",
//       ],
//       Revelation: ["REV"],
//     };
//     for (const [g, codes] of Object.entries(groups)) {
//       if (codes.includes(code)) return g;
//     }
//     return "Other";
//   };

//   const handleBook = (book) => {
//     setSelectedBook(book);
//     setChapterMode(true);
//   };

//   const handleChapter = (ch) => {
//     onSelectRef(`${selectedBook.code}.${ch}`);
//     onRequestClose();
//   };

//   const handleSubmit = () => {
//     if (passageInput.trim()) {
//       onSelectRef(passageInput.trim());
//       onRequestClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="book-selector-backdrop" onClick={onRequestClose} />
//       <div className="book-selector-modal">
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <button className="book-selector-close" onClick={onRequestClose}>
//               ×
//             </button>
//             <div className="book-selector-display">
//               <label>{lang.display_in}</label>
//               <select className="form-control form-control-sm d-inline-block ms-2">
//                 <option value="replace">{lang.current_panel}</option>
//                 <option value="new">{lang.new_panel}</option>
//                 <option value="append">{lang.append}</option>
//               </select>
//             </div>
//           </div>

//           <textarea
//             className="form-control book-selector-passage-input"
//             placeholder={lang.enter_passage}
//             value={passageInput}
//             onChange={(e) => setPassageInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//           />

//           <div className="book-selector-body">
//             {chapterMode ? (
//               <>
//                 <button
//                   className="back-btn"
//                   onClick={() => setChapterMode(false)}
//                 >
//                   ← {lang.back_to_books}
//                 </button>
//                 <h5>
//                   {selectedBook.name} — {lang.select_chapter}
//                 </h5>
//                 <div className="chapter-grid">
//                   {Array.from(
//                     { length: selectedBook.chapters },
//                     (_, i) => i + 1
//                   ).map((ch) => (
//                     <button
//                       key={ch}
//                       className="btn btn-outline-primary btn-sm chapter-btn"
//                       onClick={() => handleChapter(ch)}
//                     >
//                       {ch}
//                     </button>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h5>{lang.select_book}</h5>
//                 <h6 className="mt-3 text-muted">{lang.old_testament}</h6>
//                 {Object.entries(groupedBooks).map(([group, books]) => (
//                   <div key={group} className="book-group">
//                     <h6>
//                       {lang[group.toLowerCase().replace("/", "_")] || group}
//                     </h6>
//                     <table>
//                       <tbody>
//                         {chunk(books, 7).map((row, i) => (
//                           <tr key={i}>
//                             {row.map((book) => (
//                               <td key={book.code}>
//                                 <a
//                                   href="#"
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     handleBook(book);
//                                   }}
//                                   title={book.name}
//                                 >
//                                   {book.name.length > 8
//                                     ? book.name.slice(0, 7) + "…"
//                                     : book.name}
//                                 </a>
//                               </td>
//                             ))}
//                             {row.length < 7 &&
//                               [...Array(7 - row.length)].map((_, j) => (
//                                 <td key={j} />
//                               ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const chunk = (arr, size) => {
//   const res = [];
//   for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
//   return res;
// };

// export default BookSelector;

// import React, { useState, useEffect, useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectBook,
// }) => {
//   const [coreData, setCoreData] = useState({});

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((r) => r.json())
//       .then(setCoreData)
//       .catch(console.error);
//   }, []);

//   const availableBooks = useMemo(() => {
//     const set = new Set();
//     versions.forEach((v) => {
//       const key = v.toLowerCase();
//       if (coreData[key]?.OldT) {
//         coreData[key].OldT.forEach((g) =>
//           g.books.forEach((b) => set.add(b.code))
//         );
//       }
//       if (coreData[key]?.NewT) {
//         coreData[key].NewT.forEach((g) =>
//           g.books.forEach((b) => set.add(b.code))
//         );
//       }
//     });
//     return Array.from(set).sort();
//   }, [versions, coreData]);

//   if (!isOpen) return null;

//   return (
//     <div className="book-selector-backdrop" onClick={onRequestClose}>
//       <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <h5>{lang.select_book}</h5>
//             <div>
//               <CloseIcon onClick={onRequestClose} />
//             </div>
//           </div>

//           <div className="book-selector-body p-3">
//             <div className="row">
//               {availableBooks.map((code) => (
//                 <div key={code} className="col-4 mb-2">
//                   <button
//                     className="btn btn-outline-primary w-100 btn-sm"
//                     onClick={() => {
//                       onSelectBook(code);
//                       onRequestClose();
//                     }}
//                   >
//                     {code}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookSelector;

// import React, { useEffect, useMemo, useState } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectBook,
// }) => {
//   const [coreData, setCoreData] = useState({});

//   useEffect(() => {
//     fetch("/data/core.json")
//       .then((r) => r.json())
//       .then(setCoreData)
//       .catch(console.error);
//   }, []);

//   // Порядок груп та кодів книг
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

//     // Проходимо по версіям
//     versions.forEach((v) => {
//       const key = v.toLowerCase();
//       const ot = coreData[key]?.OldT || [];
//       const nt = coreData[key]?.NewT || [];

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

//     // Сортуємо всередині груп
//     Object.keys(result).forEach((group) => {
//       result[group].sort((a, b) => {
//         const order = bookOrderInGroup[group] || [];
//         const ia = order.indexOf(a.code);
//         const ib = order.indexOf(b.code);
//         return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
//       });
//     });

//     return result;
//   }, [versions, coreData]);

//   if (!isOpen) return null;

//   return (
//     <div className="book-selector-backdrop" onClick={onRequestClose}>
//       <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <h5>{lang.select_book}</h5>
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
//                         style={{
//                           borderColor: color,
//                           color,
//                         }}
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
// -----------------------------------------------
// import React, { useMemo } from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/BookSelector.css";

// const BookSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   versions,
//   onSelectBook,
//   coreData, // ← ДОДАНО: передаємо з PassagePage
//   coreLoading, // ← ДОДАНО
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

//   console.log("versions:", versions); // Має бути ["LXX", "UTT"]
//   console.log("coreData keys:", Object.keys(coreData)); // Має бути ["lxx", "utt"]

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
//       const key = v.toLowerCase(); // "lxx", "utt"
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
//                           onSelectBook(book.code); // ← ПРАВИЛЬНО
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

  if (!coreData || Object.keys(coreData).length === 0) {
    return (
      <div className="book-selector-backdrop" onClick={onRequestClose}>
        <div
          className="book-selector-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 text-center text-danger">
            <p>{lang.error || "Помилка: core.json не завантажено"}</p>
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
        console.log(`coreData[${key}] not found`);
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
