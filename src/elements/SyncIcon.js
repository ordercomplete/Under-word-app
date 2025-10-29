// import React, { useState } from "react";
// import styled from "styled-components";

// const Icon = styled.span`
//   cursor: pointer;
//   text-decoration: ${(props) => (props.active ? "none" : "line-through")};
// `;

// const SyncIcon = () => {
//   const [active, setActive] = useState(true);
//   return (
//     <Icon active={active} onClick={() => setActive(!active)}>
//       =
//     </Icon>
//   );
// };

// export default SyncIcon;

// import React from "react";

// interface Props {
//   isSynced: boolean;
//   onToggle: () => void;
//   title: string;
// }

// const SyncIcon: React.FC<Props> = ({ isSynced, onToggle, title }) => {
//   return (
//     <button
//       className="btn btn-link p-0 d-none d-sm-inline-block"
//       onClick={onToggle}
//       title={title}
//       style={{ position: "relative" }}
//     >
//       {isSynced ? (
//         <i
//           className="bi bi-link-45deg text-primary"
//           style={{ fontSize: "1.2rem" }}
//         ></i>
//       ) : (
//         <span style={{ position: "relative", display: "inline-block" }}>
//           <i
//             className="bi bi-link-45deg text-muted"
//             style={{ fontSize: "1.2rem" }}
//           ></i>
//           <span
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: 0,
//               right: 0,
//               height: "2px",
//               background: "#dc3545",
//               transform: "translateY(-50%) rotate(-45deg)",
//             }}
//           ></span>
//         </span>
//       )}
//     </button>
//   );
// };

// export default SyncIcon;

import React from "react";

const SyncIcon = ({ isSynced, onToggle, title }) => {
  return (
    <button
      className="btn btn-link p-0 d-none d-sm-inline-block"
      onClick={onToggle}
      title={title}
      style={{ position: "relative" }}
    >
      {isSynced ? (
        <i
          className="bi bi-link-45deg text-primary"
          style={{ fontSize: "1.2rem" }}
        ></i>
      ) : (
        <span style={{ position: "relative", display: "inline-block" }}>
          <i
            className="bi bi-link-45deg text-muted"
            style={{ fontSize: "1.2rem" }}
          ></i>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "2px",
              background: "#dc3545",
              transform: "translateY(-50%) rotate(-45deg)",
            }}
          ></span>
        </span>
      )}
    </button>
  );
};

export default SyncIcon;
