// // src\elements\TranslationTabs.js
// import React from "react";

// const TranslationTabs = ({ lang, activeTab, onTabChange }) => {
//   return (
//     <ul className="nav nav-tabs bookTypeTabs type-book">
//       <div>
//         <span className="pull-left type-book-title">
//           {lang.book_type || "Тип книги"}:&nbsp;
//         </span>
//         <span className={activeTab === "bibleList" ? "active" : ""}>
//           <a
//             className="ms-2 type-book-text"
//             href="#bibleList"
//             onClick={(e) => {
//               e.preventDefault();
//               onTabChange("bibleList");
//             }}
//           >
//             {lang.bibles || "Біблії"}
//           </a>
//         </span>
//         <span className={activeTab === "commentaryList" ? "active" : ""}>
//           <a
//             className="ms-2 type-book-text"
//             href="#commentaryList"
//             onClick={(e) => {
//               e.preventDefault();
//               onTabChange("commentaryList");
//             }}
//           >
//             {lang.commentaries || "Коментарі"}
//           </a>
//         </span>
//       </div>
//     </ul>
//   );
// };

// export default TranslationTabs;

// ==============================

// src/elements/TranslationTabs.js
import React from "react";

const TranslationTabs = ({ lang, activeTab, onTabChange }) => {
  const tabs = [
    { id: "lxx", label: "LXX", title: "Септуагінта (Старозавітний оригінал)" },
    {
      id: "thot",
      label: "THOT",
      title: "Масоретський текст (Старозавітний оригінал)",
    },
    { id: "tr", label: "TR", title: "Textus Receptus (Новозавітний оригінал)" },
    { id: "gnt", label: "GNT", title: "Сучасний критичний грецький текст NT" },
  ];

  return (
    <ul className="nav nav-tabs bookTypeTabs type-book">
      <div>
        <span className="pull-left type-book-title">
          {lang.originals || "Оригінали"}:&nbsp;
        </span>
        {tabs.map((tab) => (
          <span key={tab.id} className={activeTab === tab.id ? "active" : ""}>
            <a
              className="ms-2 type-book-text"
              href={`#${tab.id}`}
              title={tab.title}
              onClick={(e) => {
                e.preventDefault();
                onTabChange(tab.id);
              }}
            >
              {tab.label}
            </a>
          </span>
        ))}
      </div>
    </ul>
  );
};

export default TranslationTabs;

// ===================== 29.01.2026
