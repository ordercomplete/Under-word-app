import React from "react";
import PassageOptionsGroup from "./PassageOptionsGroup";
import ChapterViewer from "./ChapterViewer";
import "../styles/PassageText.css";

const PassageText = ({ lang }) => {
  return (
    <div className="passage-text flex-grow-1">
      <PassageOptionsGroup lang={lang} />
      <ChapterViewer lang={lang} />
    </div>
  );
};

export default PassageText;
