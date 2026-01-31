// import React from "react";
// import styled from "styled-components";

// const Icon = styled.span`
//   cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
//   opacity: ${(props) => (props.disabled ? 0.5 : 1)};
// `;

// const CloseIcon = ({ disabled }) => {
//   return <Icon disabled={disabled}>x</Icon>;
// };

// export default CloseIcon;
// ---------------------------------------------------------------
// CloseIcon.js
// import React from "react";
// import styled from "styled-components";

// const CloseButton = styled.button`
//   // position: absolute;
//   // left: 5px;
//   top: 5px;
//   right: 5px;
//   background: var(--clrBackground, transparent);
//   color: var(--clrText, #333);
//   border: none;
//   font-size: 24px;
//   font-weight: bold;
//   line-height: 1;
//   padding: 4px 8px;
//   cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
//   opacity: ${(props) => (props.disabled ? 0.5 : 0.9)};
//   border-radius: 4px;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: ${(props) => (props.disabled ? 0.5 : 1)};
//   }

//   &:focus {
//     outline: none;
//   }
// `;

// const CloseIcon = ({ disabled = false, onClick }) => {
//   return (
//     <CloseButton disabled={disabled} onClick={onClick}>
//       ×
//     </CloseButton>
//   );
// };

// export default CloseIcon;
// ---------------------------------------
// elements/ClosePanelButton.js
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
      <i className="bi bi-x-circle-fill text-danger fs-5"></i>
    </button>
  );
};

export default CloseIcon;
