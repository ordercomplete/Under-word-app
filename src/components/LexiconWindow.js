import React from "react";
import "../styles/LexiconWindow.css";

// const LexiconWindow = ({ lang }) => {
//   return (
//     <div className="lexicon-window">
//       <div className="lexicon-panel">Original Lexicon</div>
//       <div className="lexicon-panel">Translation Lexicon</div>
//     </div>
//   );
// };

const LexiconWindow = ({ lang }) => {
  return (
    <div
      className="lexicon-window p-4 border-start"
      style={{ width: "300px", background: "#f9f9f9" }}
    >
      <h5>{lang?.lexicon || "Лексикон"}</h5>
      <p className="text-muted">H7225 — רֵאשִׁית (початок)</p>
    </div>
  );
};

export default LexiconWindow;
