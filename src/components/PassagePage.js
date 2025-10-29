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

import React, { useState, useRef } from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import ParallelScrolling from "../utils/ParallelScrolling";
import lang from "../data/lang.json";
import "../styles/PassagePage.css";

const PassagePage = () => {
  const [currentRef, setCurrentRef] = useState("Gen.1");
  const [versions] = useState(["THOT", "LXX", "UkrOgienko"]);
  const [displayMode, setDisplayMode] = useState("INTERLEAVED"); // або 'COLUMN'
  const [isScrollSynced, setIsScrollSynced] = useState(true);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const handlePrevChapter = () => {
    alert("Попередній розділ");
  };

  const handleNextChapter = () => {
    alert("Наступний розділ");
  };

  const handleNewPanel = () => {
    alert("Нова панель");
  };

  const handleCloseColumn = () => {
    alert("Закрити колонку");
  };

  return (
    <div className="passage-page">
      {/* Панель керування */}
      <PassageOptionsGroup
        lang={lang}
        currentRef={currentRef}
        versions={versions}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        isScrollSynced={isScrollSynced}
        setIsScrollSynced={setIsScrollSynced}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onNewPanel={handleNewPanel}
        onCloseColumn={handleCloseColumn}
      />

      {/* Синхронізація прокрутки */}
      <ParallelScrolling
        isSynced={isScrollSynced}
        panels={[leftPanelRef, rightPanelRef]}
      />

      {/* Контент */}
      <div className="passage-content mt-3">
        {displayMode === "INTERLEAVED" ? (
          <div className="interleaved-view">
            <div ref={leftPanelRef} className="panel original">
              <h3>THOT / LXX</h3>
              <p>Оригінальний текст...</p>
            </div>
            <div ref={rightPanelRef} className="panel translation">
              <h3>UkrOgienko</h3>
              <p>Переклад...</p>
            </div>
          </div>
        ) : (
          <div className="column-view d-flex">
            <div ref={leftPanelRef} className="panel original flex-fill">
              <h3>THOT / LXX</h3>
              <p>Оригінал...</p>
            </div>
            <div ref={rightPanelRef} className="panel translation flex-fill">
              <h3>UkrOgienko</h3>
              <p>Переклад...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassagePage;
