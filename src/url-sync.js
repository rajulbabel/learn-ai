import { useEffect } from "react";
import { chapters, sections, superSections } from "./config.js";
import { buildPath } from "./url-routing.js";

export function useUrlSync({ ch, sub, expanded }) {
  useEffect(() => {
    const cfg = { chapters, sections, superSections };
    let target;
    if (ch === 0) {
      // TOC view - URL reflects expanded state
      target = buildPath(
        { kind: "toc", super: expanded?.super ?? null, section: expanded?.section ?? null },
        cfg,
      );
    } else {
      target = buildPath({ kind: "chapter", ch, sub }, cfg);
    }
    if (window.location.pathname !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [ch, sub, expanded]);
}
