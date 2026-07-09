import React, { useState, useEffect } from "react";
import { getBookmarks, clearHistory } from "../utils/visitHistory";
import "../styles/HistoryModal.css";
import CloseIcon from "../elements/CloseIcon";

const HistoryModal = ({ isOpen, onRequestClose, lang }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadBookmarks();
    }
  }, [isOpen]);

  const loadBookmarks = () => {
    const bookmarksList = getBookmarks();
    setBookmarks(bookmarksList.reverse()); // Найновіші спочатку
  };

  const handleClearHistory = () => {
    if (window.confirm(lang.clear_history_confirm || "Очистити всю історію?")) {
      clearHistory();
      setBookmarks([]);
    }
  };

  const handleItemClick = (entry) => {
    // НЕ використовуємо panelIndex з запису - він буде визначений в PassagePage
    // Вікно відкривається в першій панелі (якщо одна) або другій (якщо декілька)

    // Використовуємо кастомне подію для сповіщення PassagePage
    const event = new CustomEvent("navigateToBookmark", {
      detail: {
        ref: entry.ref,
        versions: entry.versions,
        // panelIndex прибираємо - буде визначено в PassagePage
      },
    });
    window.dispatchEvent(event);

    onRequestClose();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderBookmarkItem = (entry, index) => (
    <div
      key={`${entry.ref}-${entry.key || entry.timestamp}`}
      className="history-item"
      onClick={() => handleItemClick(entry)}
    >
      <div className="history-item-header">
        <strong className="history-ref">{entry.ref}</strong>
        <span className="history-date">{formatDate(entry.timestamp)}</span>
      </div>
      <div className="history-versions">
        {entry.versions.map((ver) => (
          <span key={ver} className="version-badge">
            {ver}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="modal-backdrop fade in"
        onClick={onRequestClose}
        style={{ display: isOpen ? "flex" : "none" }}
      ></div>

      <div
        className="modal in"
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content history-modal-content">
            <div className="modal-header">
              <h5>{lang.bookmarks || "Історія відвідувань"}</h5>
              {bookmarks.length > 0 && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleClearHistory}
                >
                  {lang.clear_history || "Очистити історію"}
                </button>
              )}
              <CloseIcon onClick={onRequestClose} />
            </div>

            <div className="modal-body">
              {bookmarks.length === 0 ? (
                <div className="empty-history">
                  <p>{lang.no_history || "Історія порожня"}</p>
                </div>
              ) : (
                <div className="history-list">
                  {bookmarks.map(renderBookmarkItem)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryModal;
