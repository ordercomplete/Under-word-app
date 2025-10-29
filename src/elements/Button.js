import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 5px 10px;
  background-color: #f5f5d5;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const Button = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;
