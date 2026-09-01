import React from "react";

/**
 * Універсальна кнопка закриття панелі
 * Використовує стандартний стиль custom-button-nav
 */
const CloseIcon = ({
  disabled = false,
  onClick,
  title = "Закрити",
  className = "custom-button-nav",
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <i className="bi bi-x-circle-fill"></i>
    </button>
  );
};

export default CloseIcon;
