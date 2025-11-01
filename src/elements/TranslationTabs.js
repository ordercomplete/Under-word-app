import React from "react";

const TranslationTabs = ({ lang, activeTab, onTabChange }) => {
  return (
    <ul className="nav nav-tabs bookTypeTabs type-book">
      <div>
        <span className="pull-left type-book-title">
          {lang.book_type || "Тип книги"}:&nbsp;
        </span>
        <span className={activeTab === "bibleList" ? "active" : ""}>
          <a
            className="ms-2 type-book-text"
            href="#bibleList"
            onClick={(e) => {
              e.preventDefault();
              onTabChange("bibleList");
            }}
          >
            {lang.bibles || "Біблії"}
          </a>
        </span>
        <span className={activeTab === "commentaryList" ? "active" : ""}>
          <a
            className="ms-2 type-book-text"
            href="#commentaryList"
            onClick={(e) => {
              e.preventDefault();
              onTabChange("commentaryList");
            }}
          >
            {lang.commentaries || "Коментарі"}
          </a>
        </span>
      </div>
    </ul>
  );
};

export default TranslationTabs;
