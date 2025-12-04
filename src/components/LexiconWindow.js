// LexiconWindow.js

// import React from "react";
// import "../styles/LexiconWindow.css";

// import CloseIcon from "../elements/CloseIcon";

// const LexiconWindow = ({ data, lang, onClose }) => {
//   if (!data || !data.word) {
//     return (
//       <div className="lexicon-window">
//         <h5 className="lexicon-title">
//           {lang.lexicon || "Лексикон"}
//           {onClose && <CloseIcon onClick={onClose} />}{" "}
//           {/* Якщо onClose є, показати */}
//         </h5>
//         <div className="text-muted text-center">
//           {lang.select_word || "Оберіть слово для перегляду"}
//         </div>
//       </div>
//     );
//   }

//   const { word, lang: wordLang, translation } = data;

//   return (
//     <div className="lexicon-window">
//       <h5 className="lexicon-title">
//         <div>
//           {word.strong} —{" "}
//           {wordLang === "gr"
//             ? lang.original || "Оригінал"
//             : lang.translation || "Переклад"}
//         </div>
//         <div>{onClose && <CloseIcon onClick={onClose} />}</div>
//         {/* Додано CloseIcon */}
//       </h5>
//       <div className="lexicon-content">
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

// src/components/LexiconWindow.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "../elements/CloseIcon";
import "../styles/LexiconWindow.css";
// origVer та інше в 13.11.25 в 15:59
const LexiconWindow = ({ data, lang, onClose, coreData, origVer }) => {
  const [entry, setEntry] = useState(null); //додано в 13.11.25 в 15:59
  const [loading, setLoading] = useState(true); //додано в 13.11.25 в 15:59
  const [activeTab, setActiveTab] = useState("dictionary");

  const strong = data?.word?.strong;
  const filePath = `/data/strongs/${strong}.json`;

  useEffect(() => {
    if (!strong) {
      setLoading(false);
      return;
    }

    console.log(`LexiconWindow: Loading ${filePath}`); // Лог завантаження

    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const key = Object.keys(json)[0];
        const rawEntry = json[key];

        // ЗАГЛУШКИ: заповнюємо відсутні поля
        const safeEntry = {
          strong: rawEntry.strong || strong,
          word: rawEntry.word || "Дані відсутні",
          translit: rawEntry.translit || "Дані відсутні",
          translation: rawEntry.translation || "Дані відсутні",
          morphology: rawEntry.morphology || "Дані відсутні",
          usages_count: rawEntry.usages_count ?? 0,
          meanings: Array.isArray(rawEntry.meanings) ? rawEntry.meanings : [],
          lsj_definition_raw:
            typeof rawEntry.lsj_definition_raw === "string"
              ? rawEntry.lsj_definition_raw
              : "",
          grammar:
            typeof rawEntry.grammar === "string" ? rawEntry.grammar : "—",
        };
        //розкоментувати для скорочених назв в json файлах
        // const safeEntry = {
        //   strong: rawEntry.s || strong,
        //   word: rawEntry.w || "Дані відсутні",
        //   translit: rawEntry.t || "Дані відсутні",
        //   translation: rawEntry.tr || "Дані відсутні",
        //   morphology: rawEntry.m || "Дані відсутні",
        //   usages_count: rawEntry.u ?? 0,
        //   meanings: Array.isArray(rawEntry.mn) ? rawEntry.mn : [],
        //   lsj_definition_raw:
        //     typeof rawEntry.lsj === "string" ? rawEntry.lsj : "",
        //   grammar: typeof rawEntry.g === "string" ? rawEntry.g : "—",
        // };

        setEntry(safeEntry);
        console.log(`LexiconWindow: Loaded ${strong}`, safeEntry);
        // setEntry(json[key]);
        // console.log(`LexiconWindow: Loaded ${strong}`, json[key]);
      })
      .catch((err) => {
        console.error(`Failed to load ${filePath}:`, err);
        setEntry(null);
      })
      .finally(() => setLoading(false));
  }, [strong]);

  if (!strong) {
    return (
      <div className="lexicon-window">
        <h5 className="lexicon-title">
          {lang.lexicon || "Лексикон"}
          {onBroadcasting && <CloseIcon onClick={onClose} />}
        </h5>
        <div className="text-muted text-center p-3">Оберіть слово</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lexicon-window">
        <h5 className="lexicon-title">
          {strong}
          {<CloseIcon onClick={onClose} />}
        </h5>
        <div className="p-3 text-center">Завантаження...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="lexicon-window">
        <h5 className="lexicon-title">
          {strong}
          {<CloseIcon onClick={onClose} />}
        </h5>
        <div className="p-3 text-danger">Дані відсутні lexicon-window</div>
      </div>
    );
  }

  const parseRef = (ref) => {
    const match = ref.match(/([A-Z]+)\.(\d+):(\d+)/);
    if (!match) return null;
    const [, book, ch, v] = match;
    const bookData =
      coreData?.lxx?.OldT?.flatMap((g) => g.books).find(
        (b) => b.code === book
      ) ||
      coreData?.mt?.OldT?.flatMap((g) => g.books).find((b) => b.code === book);
    if (!bookData) return null;
    return { book: bookData.code, chapter: ch, verse: v };
  };

  const renderWithLinks = (text) => {
    return text
      .split(/(\[[^\]]+\]|\([^\)]+\)|\b[A-Z]+\.\d+:\d+\b)/g)
      .map((part, i) => {
        if (part.match(/^\[[^\]]+\]$/)) {
          return (
            <sup key={i} className="text-muted">
              [посилання]
            </sup>
          );
        }
        if (part.match(/^\([^\)]+\)$/)) {
          return (
            <span key={i} className="text-muted">
              {part}
            </span>
          );
        }
        const ref = parseRef(part);
        if (ref) {
          return (
            <Link
              key={i}
              to={`/original/${strong.startsWith("H") ? "mt" : "lxx"}/${
                ref.book
              }.${ref.chapter}#v${ref.verse}`}
              className="text-primary text-decoration-underline"
              title={`Відкрити ${ref.book} ${ref.chapter}:${ref.verse}`}
            >
              {part}
            </Link>
          );
        }
        return part;
      });
  };

  const renderLSJ = (text) => {
    if (!text || text.trim() === "") {
      return <p className="text-muted p-3">Немає даних</p>; // ЗАГЛУШКА
    }
    const sections = text.split(/__(.+?)__/).filter(Boolean);
    return sections.map((sec, i) => {
      if (i % 2 === 0) {
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: sec.replace(/\n/g, "<br>") }}
          />
        );
      } else {
        return (
          <h6 key={i} className="mt-3 text-primary">
            {sec}
          </h6>
        );
      }
    });
  };

  return (
    <div className="lexicon-window">
      <h5 className="lexicon-title">
        <div>
          <strong>{entry.word}</strong> ({entry.translit})
          <small className="text-muted"> • {strong}</small>
        </div>
        {onClose && <CloseIcon onClick={onClose} />}
      </h5>

      <div className="lexicon-tabs">
        <button
          className={activeTab === "dictionary" ? "active" : ""}
          onClick={() => setActiveTab("dictionary")}
        >
          Словник
        </button>
        <button
          className={activeTab === "meanings" ? "active" : ""}
          onClick={() => setActiveTab("meanings")}
        >
          Значення
        </button>
        <button
          className={activeTab === "lsj" ? "active" : ""}
          onClick={() => setActiveTab("lsj")}
        >
          LSJ
        </button>
        <button
          className={activeTab === "grammar" ? "active" : ""}
          onClick={() => setActiveTab("grammar")}
        >
          Граматика
        </button>
      </div>

      <div className="lexicon-content">
        {activeTab === "dictionary" && (
          <div className="dictionary-content ">
            <div className="lex-item">
              <span className="label">Оригінал:</span>
              <span className="value gr">{entry.word}</span>
            </div>
            <div className="lex-item">
              <span className="label">Трансліт:</span>
              <span className="value">{entry.translit}</span>
            </div>
            <div className="lex-item">
              <span className="label">Переклад:</span>
              <span className="value uk">{entry.translation}</span>
            </div>
            <div className="lex-item">
              <span className="label">Вживань:</span>
              <span className="value">{entry.usages_count}</span>
            </div>
          </div>
        )}

        {activeTab === "meanings" && (
          <div className="meanings-content ">
            {entry.meanings && entry.meanings.length > 0 ? (
              <ul className="list-unstyled ">
                {entry.meanings.map((m, i) => (
                  <li
                    key={i}
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: renderWithLinks(m) }}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted p-3">Немає даних</p> // ← ЗАГЛУШКА
            )}
          </div>
        )}

        {activeTab === "lsj" && (
          <div className=" lsj-content">
            {renderLSJ(entry.lsj_definition_raw)}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="grammar-content">
            <pre className="bg-light rounded">{entry.grammar}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LexiconWindow;
