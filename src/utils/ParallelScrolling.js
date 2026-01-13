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
