// src/utils/ParallelScrolling.js
// import React, { useRef, useEffect } from 'react';

// interface Props {
//   isSynced: boolean;
//   panels: React.RefObject<HTMLDivElement>[];
// }

// const ParallelScrolling: React.FC<Props> = ({ isSynced, panels }) => {
//   const isScrolling = useRef(false);

//   useEffect(() => {
//     if (!isSynced) return;

//     const handleScroll = (e: Event) => {
//       if (isScrolling.current) return;
//       isScrolling.current = true;

//       const scrolled = e.target as HTMLDivElement;
//       const scrollRatio = scrolled.scrollTop / (scrolled.scrollHeight - scrolled.clientHeight);

//       panels.forEach((panel) => {
//         if (panel.current && panel.current !== scrolled) {
//           panel.current.scrollTop = scrollRatio * (panel.current.scrollHeight - panel.current.clientHeight);
//         }
//       });

//       requestAnimationFrame(() => {
//         isScrolling.current = false;
//       });
//     };

//     panels.forEach((panel) => {
//       panel.current?.addEventListener('scroll', handleScroll);
//     });

//     return () => {
//       panels.forEach((panel) => {
//         panel.current?.removeEventListener('scroll', handleScroll);
//       });
//     };
//   }, [isSynced, panels]);

//   return null;
// };

// export default ParallelScrolling;

import { useEffect } from "react";

const ParallelScrolling = ({ isSynced, panels }) => {
  useEffect(() => {
    if (!isSynced) return;

    let isScrolling = false;

    const handleScroll = (e) => {
      if (isScrolling) return;
      isScrolling = true;

      const scrolled = e.target;
      const ratio =
        scrolled.scrollTop / (scrolled.scrollHeight - scrolled.clientHeight);

      panels.forEach((panel) => {
        if (panel.current && panel.current !== scrolled) {
          panel.current.scrollTop =
            ratio * (panel.current.scrollHeight - panel.current.clientHeight);
        }
      });

      requestAnimationFrame(() => {
        isScrolling = false;
      });
    };

    panels.forEach((panel) => {
      panel.current?.addEventListener("scroll", handleScroll);
    });

    return () => {
      panels.forEach((panel) => {
        panel.current?.removeEventListener("scroll", handleScroll);
      });
    };
  }, [isSynced, panels]);

  return null;
};

export default ParallelScrolling;
