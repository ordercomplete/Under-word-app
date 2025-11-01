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

import React from "react";
import styled from "styled-components";

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: var(--clrBackground, transparent);
  color: var(--clrText, #333);
  border: none;
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  padding: 4px 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 0.9)};
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  }

  &:focus {
    outline: none;
  }
`;

const CloseIcon = ({ disabled = false, onClick }) => {
  return (
    <CloseButton disabled={disabled} onClick={onClick}>
      ×
    </CloseButton>
  );
};

export default CloseIcon;
