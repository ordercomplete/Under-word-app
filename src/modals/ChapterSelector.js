// import React from "react";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/ChapterSelector.css";

// const ChapterSelector = ({
//   isOpen,
//   onRequestClose,
//   lang,
//   bookCode,
//   chapters,
//   onSelectChapter,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="book-selector-backdrop" onClick={onRequestClose}>
//       <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="book-selector-content">
//           <div className="book-selector-header">
//             <h5>
//               {bookCode} — {lang.select_chapter}
//             </h5>
//             <CloseIcon onClick={onRequestClose} />
//           </div>
//           <div className="book-selector-body p-3">
//             <div className="chapter-grid">
//               {Array.from({ length: chapters }, (_, i) => i + 1).map((ch) => (
//                 <button
//                   key={ch}
//                   className="btn btn-outline-primary btn-sm chapter-btn"
//                   onClick={() => {
//                     onSelectChapter(ch);
//                     onRequestClose();
//                   }}
//                 >
//                   {ch}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChapterSelector;

import React, { useMemo } from "react";
import CloseIcon from "../elements/CloseIcon";
import "../styles/ChapterSelector.css";

const ChapterSelector = ({
  isOpen,
  onRequestClose,
  lang,
  bookCode,
  chapters,
  onSelectChapter,
}) => {
  const genreColor = useMemo(() => {
    const genreMap = {
      Torah: "#d4a373", // Золотисто-коричневий
      Historical: "#8b8b8b", // Сірий
      "Poetry/Wisdom": "#6b8e23", // Оливковий
      Prophets: "#8b0000", // Темно-червоний
      Gospels: "#1e90ff", // Синій
      Acts: "#32cd32", // Лайм
      Epistles: "#9932cc", // Фіолетовий
      Revelation: "#ff4500", // Помаранчевий
    };

    // Знаходимо жанр з core.json (можна передати як пропс або хардкод)
    const genres = {
      GEN: "Torah",
      EXO: "Torah",
      LEV: "Torah",
      NUM: "Torah",
      DEU: "Torah",
      JOS: "Historical",
      JDG: "Historical",
      RUT: "Historical",
      "1SA": "Historical",
      "2SA": "Historical",
      "1KI": "Historical",
      "2KI": "Historical",
      "1CH": "Historical",
      "2CH": "Historical",
      EZR: "Historical",
      NEH: "Historical",
      EST: "Historical",
      JOB: "Poetry/Wisdom",
      PSA: "Poetry/Wisdom",
      PRO: "Poetry/Wisdom",
      ECC: "Poetry/Wisdom",
      SNG: "Poetry/Wisdom",
      ISA: "Prophets",
      JER: "Prophets",
      LAM: "Prophets",
      EZE: "Prophets",
      DAN: "Prophets",
      HOS: "Prophets",
      JOL: "Prophets",
      AMO: "Prophets",
      OBA: "Prophets",
      JON: "Prophets",
      MIC: "Prophets",
      NAM: "Prophets",
      HAB: "Prophets",
      SOP: "Prophets",
      HAG: "Prophets",
      ZEC: "Prophets",
      MAL: "Prophets",
      MAT: "Gospels",
      MRK: "Gospels",
      LUK: "Gospels",
      JHN: "Gospels",
      ACT: "Acts",
      ROM: "Epistles",
      "1CO": "Epistles",
      "2CO": "Epistles",
      GAL: "Epistles",
      EPH: "Epistles",
      PHP: "Epistles",
      COL: "Epistles",
      "1TH": "Epistles",
      "2TH": "Epistles",
      "1TI": "Epistles",
      "2TI": "Epistles",
      TIT: "Epistles",
      PHM: "Epistles",
      HEB: "Epistles",
      JAS: "Epistles",
      "1PE": "Epistles",
      "2PE": "Epistles",
      "1JN": "Epistles",
      "2JN": "Epistles",
      "3JN": "Epistles",
      JUD: "Epistles",
      REV: "Revelation",
    };

    return genreMap[genres[bookCode]] || "#6c757d";
  }, [bookCode]);

  if (!isOpen) return null;

  return (
    <div className="chapter-selector-backdrop" onClick={onRequestClose}>
      <div
        className="chapter-selector-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chapter-selector-content">
          <div className="chapter-selector-header">
            <h5>
              <span
                className="genre-indicator"
                style={{ backgroundColor: genreColor }}
              ></span>
              {bookCode} — {lang.select_chapter}
            </h5>
            <CloseIcon onClick={onRequestClose} />
          </div>
          <div className="chapter-selector-body">
            <div className="chapter-grid">
              {Array.from({ length: chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  className="chapter-btn"
                  onClick={() => {
                    onSelectChapter(ch);
                    onRequestClose();
                  }}
                  style={{
                    borderColor: genreColor,
                    color: genreColor,
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelector;
