import React, { useState, useEffect } from "react";
import { getHistory, clearHistory } from "../utils/visitHistory";
import { useNavigation } from "../contexts/NavigationContext";
import "../styles/HistoryModal.css";

const HistoryModal = ({ isOpen, onRequestClose, lang }) => {
  const { navigateToRef } = useNavigation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const visitHistory = getHistory();
    setHistory(visitHistory.reverse()); // Найновіші спочатку
  };

  const handleClearHistory = () => {
    if (window.confirm(lang.clear_history_confirm || "Очистити всю історію?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleItemClick = (entry) => {
    navigateToRef(entry.ref, entry.versions);
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

  const renderHistoryItem = (entry) => (
    <div
      key={`${entry.ref}-${entry.timestamp}`}
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
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={onRequestClose}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {history.length === 0 ? (
                <div className="empty-history">
                  <p>{lang.no_history || "Історія порожня"}</p>
                </div>
              ) : (
                <div className="history-list">
                  {history.map(renderHistoryItem)}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleClearHistory}>
                  {lang.clear_history || "Очистити історію"}
                </button>
                <button className="btn btn-secondary" onClick={onRequestClose}>
                  {lang.close || "Закрити"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryModal;
