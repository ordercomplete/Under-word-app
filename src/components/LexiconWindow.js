import React from "react";
import "../styles/LexiconWindow.css";
import "../elements/CloseIcon.js";

const LexiconWindow = ({ lang }) => {
  return (
    <div className="lexicon-window">
      <h6 className="lexicon-title">{lang?.lexicon || "Лексикон"}</h6>
      <p className="text-muted">H7225 — רֵאשִׁית (початок)</p>
    </div>
  );
};

export default LexiconWindow;
