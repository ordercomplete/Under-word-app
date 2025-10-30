import React from "react";
import "../styles/ChapterSelector.css";

const ChapterSelector = ({
  isOpen,
  onRequestClose,
  lang,
  bookCode,
  chapters,
  onSelectChapter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="book-selector-backdrop" onClick={onRequestClose}>
      <div className="book-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-selector-content">
          <div className="book-selector-header">
            <h5>
              {bookCode} — {lang.select_chapter}
            </h5>
            <button className="book-selector-close" onClick={onRequestClose}>
              ×
            </button>
          </div>
          <div className="book-selector-body p-3">
            <div className="chapter-grid">
              {Array.from({ length: chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  className="btn btn-outline-primary btn-sm chapter-btn"
                  onClick={() => {
                    onSelectChapter(ch);
                    onRequestClose();
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelector;
