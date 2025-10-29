import React from "react";
import styled from "styled-components";

const Icon = styled.span`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CloseIcon = ({ disabled }) => {
  return <Icon disabled={disabled}>x</Icon>;
};

export default CloseIcon;
