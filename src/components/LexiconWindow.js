import React from "react";
import "../styles/LexiconWindow.css";

const LexiconWindow = ({ lang }) => {
  return (
    <div className="lexicon-window">
      <div className="lexicon-panel">Original Lexicon</div>
      <div className="lexicon-panel">Translation Lexicon</div>
    </div>
  );
};

export default LexiconWindow;
