// src/components/PanelSettingsModal.js - 10.07.2026
// Модальне вікно налаштувань панелі chapter-viewer
import React from "react";
import ReactModal from "react-modal";
import "../styles/PanelSettingsModal.css";

const PanelSettingsModal = ({
  isOpen,
  onRequestClose,
  settings,
  onSettingsChange,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="panel-settings-modal-content"
      overlayClassName="panel-settings-modal-overlay"
      ariaHideApp={false}
    >
      <div className="panel-settings-modal-header">
        <h5 className="panel-settings-modal-title">Налаштування панелі</h5>
        <button
          className="panel-settings-close-btn"
          onClick={onRequestClose}
          title="Закрити"
        >
          ✕
        </button>
      </div>

      <div className="panel-settings-modal-body">
        <label className="panel-settings-checkbox-label">
          <input
            type="checkbox"
            checked={!!settings?.inlineFlow}
            onChange={(e) =>
              onSettingsChange?.({ ...settings, inlineFlow: e.target.checked })
            }
          />
          <span>Суцільний потік віршів (inline)</span>
        </label>
      </div>
    </ReactModal>
  );
};

export default PanelSettingsModal;
