import React from "react";
import "../styles/LexiconWindow.css";
// import "../elements/CloseIcon.js";

// const LexiconWindow = ({ lang }) => {
//   return (
//     <div className="lexicon-window">
//       <h6 className="lexicon-title">{lang?.lexicon || "Лексикон"}</h6>
//       <p className="text-muted">H7225 — רֵאשִׁית (початок)</p>
//     </div>
//   );
// };

// const LexiconWindow = ({ lexicon, lang }) => {
//   if (!lexicon.gr && !lexicon.uk) return null;

//   return (
//     <div className="lexicon-container">
//       {lexicon.gr && (
//         <div className="lex-gr">
//           <strong>{lexicon.gr.strong}</strong> {lexicon.gr.lemma}
//           <br />
//           <small>{lexicon.gr.morph}</small>
//         </div>
//       )}
//       {lexicon.uk && (
//         <div className="lex-uk">
//           <strong>{lexicon.uk.word}</strong>
//           <br />
//           <small>→ {lexicon.uk.strong}</small>
//         </div>
//       )}
//     </div>
//   );
// };

// const LexiconWindow = ({ strong, lang }) => {
//   if (!strong) return null;

//   const isGreek = strong.startsWith("G");
//   const num = strong.slice(1);

//   return (
//     <div className="lexicon-popup">
//       <strong>{strong}</strong> —{" "}
//       {isGreek ? `Грецьке слово #${num}` : `Івритське слово #${num}`}
//       <br />
//       <small>Клікни для детального словника</small>
//     </div>
//   );
// };
// export default LexiconWindow;

// const LexiconWindow = ({ strong, lang }) => {
//   if (!strong) return null;

//   const isGreek = strong.startsWith("G");
//   const num = strong.slice(1);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 20,
//         right: 20,
//         background: "#fff",
//         border: "1px solid #ddd",
//         borderRadius: 6,
//         padding: 10,
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         zIndex: 10000,
//         fontSize: 14,
//         maxWidth: 300,
//       }}
//     >
//       <strong style={{ color: isGreek ? "#d35400" : "#8e44ad" }}>
//         {strong}
//       </strong>
//       <br />
//       <small>
//         {isGreek
//           ? `${lang.greek_word || "Грецьке слово"} #${num}`
//           : `${lang.hebrew_word || "Івритське слово"} #${num}`}
//       </small>
//     </div>
//   );
// };

// const LexiconWindow = ({ data, lang }) => {
//   if (!data.word) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 20,
//         right: 20,
//         background: "white",
//         border: "1px solid #ddd",
//         padding: 12,
//         borderRadius: 8,
//         boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//         zIndex: 10000,
//         fontSize: 14,
//         maxWidth: 280,
//       }}
//     >
//       <strong style={{ color: data.lang === "gr" ? "#d35400" : "#8e44ad" }}>
//         {data.word.strong || data.word.word}
//       </strong>
//       <br />
//       <small>
//         {data.lang === "gr" ? data.word.lemma : data.word.word}
//         {data.word.morph && ` (${data.word.morph})`}
//       </small>
//     </div>
//   );
// };

// export default LexiconWindow;

// const LexiconWindow = ({ data, lang }) => {
//   // ЗАХИСТ: якщо data або data.word — undefined/null
//   if (!data || !data.word || !data.word.word) return null;

//   const { word, lang: wordLang } = data;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 20,
//         right: 20,
//         background: "white",
//         border: "1px solid #ddd",
//         padding: 12,
//         borderRadius: 8,
//         boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//         zIndex: 10000,
//         fontSize: 14,
//         maxWidth: 280,
//         fontFamily: "system-ui, sans-serif",
//       }}
//     >
//       <strong
//         style={{
//           color: wordLang === "gr" ? "#d35400" : "#8e44ad",
//           fontSize: 16,
//         }}
//       >
//         {word.strong || word.word}
//       </strong>
//       <br />
//       <small style={{ color: "#555" }}>
//         {wordLang === "gr"
//           ? `${word.lemma || word.word} (${word.morph || ""})`
//           : word.word}
//       </small>
//       {word.helper && (
//         <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
//           {lang.helper_word || "Допоміжне слово"}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LexiconWindow;

// const LexiconWindow = ({ data, lang }) => {
//   if (!data || !data.word) return null;

//   const { word, lang: wordLang, translation } = data;

//   return (
//     <div className="lexicon-sidebar">
//       <div className="lexicon-header">
//         <strong>{word.strong || "—"}</strong>
//       </div>
//       <div className="lexicon-body">
//         {wordLang === "gr" ? (
//           <>
//             <div className="lex-item">
//               <span className="label">{lang.original || "Оригінал"}:</span>
//               <span className="value gr">{word.word}</span>
//             </div>
//             <div className="lex-item">
//               <span className="label">{lang.lemma || "Лема"}:</span>
//               <span className="value">{word.lemma}</span>
//             </div>
//             {word.morph && (
//               <div className="lex-item">
//                 <span className="label">
//                   {lang.morphology || "Морфологія"}:
//                 </span>
//                 <span className="value">{word.morph}</span>
//               </div>
//             )}
//             <div className="lex-item">
//               <span className="label">{lang.translation || "Переклад"}:</span>
//               <span className="value uk">{translation}</span>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="lex-item">
//               <span className="label">{lang.translation || "Переклад"}:</span>
//               <span className="value uk">{word.word}</span>
//             </div>
//             <div className="lex-item">
//               <span className="label">{lang.original || "Оригінал"}:</span>
//               <span className="value gr">{translation}</span>
//             </div>
//             <div className="lex-item">
//               <span className="label">{lang.strong || "Strong's"}:</span>
//               <span className="value">{word.strong}</span>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LexiconWindow;

// -----------------------------------------------------
// const LexiconWindow = ({ data, lang }) => {
//   if (!data || !data.word) {
//     return (
//       <div className="text-muted text-center">
//         {lang.select_word || "Оберіть слово для перегляду"}
//       </div>
//     );
//   }

//   const { word, lang: wordLang, translation } = data;

//   return (
//     <div className="lexicon-content">
//       {wordLang === "gr" ? (
//         <>
//           <div className="lex-item">
//             <span className="label">{lang.original || "Оригінал"}:</span>
//             <span className="value gr">{word.word}</span>
//           </div>
//           <div className="lex-item">
//             <span className="label">{lang.lemma || "Лема"}:</span>
//             <span className="value">{word.lemma}</span>
//           </div>
//           {word.morph && (
//             <div className="lex-item">
//               <span className="label">{lang.morphology || "Морфологія"}:</span>
//               <span className="value">{word.morph}</span>
//             </div>
//           )}
//           <div className="lex-item">
//             <span className="label">{lang.translation || "Переклад"}:</span>
//             <span className="value uk">{translation}</span>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="lex-item">
//             <span className="label">{lang.translation || "Переклад"}:</span>
//             <span className="value uk">{word.word}</span>
//           </div>
//           <div className="lex-item">
//             <span className="label">{lang.original || "Оригінал"}:</span>
//             <span className="value gr">{translation}</span>
//           </div>
//           <div className="lex-item">
//             <span className="label">{lang.strong || "Strong's"}:</span>
//             <span className="value">{word.strong}</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default LexiconWindow;

// ----------------------------------------

// import React from "react";
import CloseIcon from "../elements/CloseIcon"; // Шлях до вашого CloseIcon

const LexiconWindow = ({ data, lang, onClose }) => {
  if (!data || !data.word) {
    return (
      <div className="lexicon-window">
        <h5 className="lexicon-title">
          {lang.lexicon || "Лексикон"}
          {onClose && <CloseIcon onClick={onClose} />}{" "}
          {/* Якщо onClose є, показати */}
        </h5>
        <div className="text-muted text-center">
          {lang.select_word || "Оберіть слово для перегляду"}
        </div>
      </div>
    );
  }

  const { word, lang: wordLang, translation } = data;

  return (
    <div className="lexicon-window">
      <h5 className="lexicon-title">
        {word.strong} —{" "}
        {wordLang === "gr"
          ? lang.original || "Оригінал"
          : lang.translation || "Переклад"}
        {onClose && <CloseIcon onClick={onClose} />} {/* Додано CloseIcon */}
      </h5>
      <div className="lexicon-content">
        {wordLang === "gr" ? (
          <>
            <div className="lex-item">
              <span className="label">{lang.original || "Оригінал"}:</span>
              <span className="value gr">{word.word}</span>
            </div>
            <div className="lex-item">
              <span className="label">{lang.lemma || "Лема"}:</span>
              <span className="value">{word.lemma}</span>
            </div>
            {word.morph && (
              <div className="lex-item">
                <span className="label">
                  {lang.morphology || "Морфологія"}:
                </span>
                <span className="value">{word.morph}</span>
              </div>
            )}
            <div className="lex-item">
              <span className="label">{lang.translation || "Переклад"}:</span>
              <span className="value uk">{translation}</span>
            </div>
          </>
        ) : (
          <>
            <div className="lex-item">
              <span className="label">{lang.translation || "Переклад"}:</span>
              <span className="value uk">{word.word}</span>
            </div>
            <div className="lex-item">
              <span className="label">{lang.original || "Оригінал"}:</span>
              <span className="value gr">{translation}</span>
            </div>
            <div className="lex-item">
              <span className="label">{lang.strong || "Strong's"}:</span>
              <span className="value">{word.strong}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LexiconWindow;
