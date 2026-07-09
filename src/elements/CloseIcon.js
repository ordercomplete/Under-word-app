import React from "react";

/**
 * Універсальна кнопка закриття панелі (як +)
 * Використовує Bootstrap-іконку та стилі
 */
const CloseIcon = ({
  disabled = false,
  onClick,
  title = "Закрити",
  className = "closeIcon btn btn-link p-0 d-sm-inline-block",
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 0.9,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = 1)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.opacity = 0.9)}
    >
      <i className="bi bi-x-circle-fill fs-5"></i>
    </button>
  );
};

export default CloseIcon;
