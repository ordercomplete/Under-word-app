import React, { useState } from "react";
import styled from "styled-components";

const Icon = styled.span`
  cursor: pointer;
  text-decoration: ${(props) => (props.active ? "none" : "line-through")};
`;

const SyncIcon = () => {
  const [active, setActive] = useState(true);
  return (
    <Icon active={active} onClick={() => setActive(!active)}>
      =
    </Icon>
  );
};

export default SyncIcon;
