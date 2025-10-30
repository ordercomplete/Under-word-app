// import React, { useState } from "react";
// import PassageOptionsGroup from "./components/PassageOptionsGroup";
// import lang from "../data/lang.json";

// const PassagePage = () => {
//   const [ref, setRef] = useState("Gen.1");
//   const versions = ["THOT", "LXX", "UkrOgienko"];

//   const handlePrev = () => alert("Prev chapter");
//   const handleNext = () => alert("Next chapter");

//   return (
//     <div className="passage-page">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={ref}
//         versions={versions}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onResizeToggle={() => console.log("resize")}
//         onNewPanel={() => console.log("new panel")}
//         onCloseColumn={() => console.log("close column")}
//       />

//       {/* Тут буде текст розділу */}
//       <div className="passage-content mt-3 p-3">
//         <h2>{ref}</h2>
//         <p>…текст…</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useRef } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import ParallelScrolling from "../utils/ParallelScrolling";
// import lang from "../data/lang.json";
// import "../styles/PassagePage.css";

// const PassagePage = () => {
//   const [currentRef, setCurrentRef] = useState("Gen.1");
//   const [versions] = useState(["THOT", "LXX", "UkrOgienko"]);
//   const [displayMode, setDisplayMode] = useState("INTERLEAVED"); // або 'COLUMN'
//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   const leftPanelRef = useRef(null);
//   const rightPanelRef = useRef(null);

//   const handlePrevChapter = () => {
//     alert("Попередній розділ");
//   };

//   const handleNextChapter = () => {
//     alert("Наступний розділ");
//   };

//   const handleNewPanel = () => {
//     alert("Нова панель");
//   };

//   const handleCloseColumn = () => {
//     alert("Закрити колонку");
//   };

//   return (
//     <div className="passage-page">
//       {/* Панель керування */}
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         displayMode={displayMode}
//         setDisplayMode={setDisplayMode}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrevChapter}
//         onNextChapter={handleNextChapter}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleCloseColumn}
//       />

//       {/* Синхронізація прокрутки */}
//       <ParallelScrolling
//         isSynced={isScrollSynced}
//         panels={[leftPanelRef, rightPanelRef]}
//       />

//       {/* Контент */}
//       <div className="passage-content mt-3">
//         {displayMode === "INTERLEAVED" ? (
//           <div className="interleaved-view">
//             <div ref={leftPanelRef} className="panel original">
//               <h3>THOT / LXX</h3>
//               <p>Оригінальний текст...</p>
//             </div>
//             <div ref={rightPanelRef} className="panel translation">
//               <h3>UkrOgienko</h3>
//               <p>Переклад...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="column-view d-flex">
//             <div ref={leftPanelRef} className="panel original flex-fill">
//               <h3>THOT / LXX</h3>
//               <p>Оригінал...</p>
//             </div>
//             <div ref={rightPanelRef} className="panel translation flex-fill">
//               <h3>UkrOgienko</h3>
//               <p>Переклад...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// src/components/PassagePage.js
// import React from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import "../styles/ChapterViewer.css"; // якщо є

// const PassagePage = ({ lang }) => {
//   const currentRef = "Gen.1";
//   const versions = ["THOT", "LXX", "UkrOgienko"];
//   const [isScrollSynced, setIsScrollSynced] = React.useState(true);

//   const handlePrev = () => alert("Попередня глава");
//   const handleNext = () => alert("Наступна глава");
//   const handleNewPanel = () => alert("Нова панель");
//   const handleClose = () => alert("Закрити колонку");

//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleClose}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         <h4>Gen 1:1</h4>
//         <p>בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃</p>
//         <p>На початку Бог створив небо і землю.</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

// import React, { useState, useEffect } from "react";
// import PassageOptionsGroup from "./PassageOptionsGroup";
// import "../styles/ChapterViewer.css";

// const PassagePage = ({ lang }) => {
//   const [currentRef] = useState("Gen.1");

//   // Завантажуємо з localStorage або дефолт
//   const [versions, setVersions] = useState(() => {
//     const saved = localStorage.getItem("selectedVersions");
//     return saved ? JSON.parse(saved) : ["THOT", "UkrOgienko"];
//   });

//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   // Зберігаємо при зміні
//   useEffect(() => {
//     localStorage.setItem("selectedVersions", JSON.stringify(versions));
//   }, [versions]);

//   // Українські повідомлення через lang
//   const handlePrev = () => {
//     alert(lang.prev_chapter || "Попередня глава");
//   };

//   const handleNext = () => {
//     alert(lang.next_chapter || "Наступна глава");
//   };

//   const handleNewPanel = () => {
//     alert(lang.new_panel || "Нова панель");
//   };

//   const handleClose = () => {
//     alert(lang.close_column || "Закрити колонку");
//   };

//   return (
//     <div className="passage-column flex-fill d-flex flex-column">
//       <PassageOptionsGroup
//         lang={lang}
//         currentRef={currentRef}
//         versions={versions}
//         setVersions={setVersions}
//         isScrollSynced={isScrollSynced}
//         setIsScrollSynced={setIsScrollSynced}
//         onPrevChapter={handlePrev}
//         onNextChapter={handleNext}
//         onNewPanel={handleNewPanel}
//         onCloseColumn={handleClose}
//       />

//       <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
//         <h4>{currentRef}</h4>
//         <p>בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃</p>
//         <p>{lang.gen_1_1 || "На початку Бог створив небо і землю."}</p>
//       </div>
//     </div>
//   );
// };

// export default PassagePage;

import React, { useState, useEffect } from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import BookSelector from "./BookSelector";
import "../styles/ChapterViewer.css";

const PassagePage = ({ lang }) => {
  const [currentRef, setCurrentRef] = useState("Gen.1");
  const [versions, setVersions] = useState(() => {
    const saved = localStorage.getItem("selectedVersions");
    return saved ? JSON.parse(saved) : ["THOT", "UkrOgienko"];
  });
  const [isScrollSynced, setIsScrollSynced] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [chapterData, setChapterData] = useState({});
  const [loading, setLoading] = useState(false);

  // Завантаження глави
  useEffect(() => {
    const [book, chapter] = currentRef.split(".");
    setLoading(true);
    fetch(`/data/${book.toLowerCase()}${chapter}.json`)
      .then((res) => res.json())
      .then((data) => {
        setChapterData(data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to load chapter");
        setLoading(false);
      });
  }, [currentRef]);

  // Interleaved View
  const interleavedVerses = () => {
    const maxVerse = Math.max(
      ...versions.map((v) => (chapterData[v] || []).length).filter(Boolean)
    );
    const result = [];
    for (let v = 1; v <= maxVerse; v++) {
      versions.forEach((ver) => {
        const verse = (chapterData[ver] || []).find((x) => x.v === v);
        if (verse)
          result.push({
            ver,
            verse: v,
            text: verse.text,
            strongs: verse.strongs,
          });
      });
    }
    return result;
  };

  const handlePrev = () => {
    const [book, ch] = currentRef.split(".");
    const newCh = parseInt(ch) - 1;
    if (newCh > 0) setCurrentRef(`${book}.${newCh}`);
  };

  const handleNext = () => {
    const [book, ch] = parseInt(currentRef.split(".")[1]) + 1;
    setCurrentRef(`${book}.${ch}`);
  };

  return (
    <div className="passage-column flex-fill d-flex flex-column">
      <PassageOptionsGroup
        lang={lang}
        currentRef={currentRef}
        setCurrentRef={setCurrentRef} // ДОДАНО
        versions={versions}
        setVersions={setVersions}
        isScrollSynced={isScrollSynced}
        setIsScrollSynced={setIsScrollSynced}
        onPrevChapter={handlePrev}
        onNextChapter={handleNext}
        onNewPanel={() => alert(lang.new_panel)}
        onCloseColumn={() => alert(lang.close_column)}
        onOpenBookSelector={() => setShowBookModal(true)}
      />

      <div className="chapter-viewer flex-fill overflow-auto p-3 bg-white">
        {loading ? (
          <p>{lang.loading || "Завантаження..."}</p>
        ) : (
          <>
            <h4>{currentRef}</h4>
            {interleavedVerses().map((item, i) => (
              <div
                key={i}
                className="verse-line d-flex align-items-start gap-2 mb-2"
              >
                <span className="verse-num text-muted">{item.verse}</span>
                <span className="version-badge badge bg-secondary">
                  {item.ver}
                </span>
                <span className="verse-text">
                  {item.strongs
                    ? item.text.split(" ").map((word, j) => {
                        const strong = item.strongs[j];
                        return strong ? (
                          <span key={j} className="strong-word" title={strong}>
                            {word}{" "}
                          </span>
                        ) : (
                          word + " "
                        );
                      })
                    : item.text}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <BookSelector
        isOpen={showBookModal}
        onRequestClose={() => setShowBookModal(false)}
        lang={lang}
        versions={versions}
        onSelectRef={setCurrentRef}
      />
    </div>
  );
};

export default PassagePage;
