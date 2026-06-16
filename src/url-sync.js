import { useEffect, useRef } from "react";
import { chapters, sections, superSections } from "./config.js";
import { buildPath, parsePath } from "./url-routing.js";

export function useUrlSync({ ch, sub, expanded }) {
  const firstSync = useRef(true);
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
      if (firstSync.current) {
        // Replace on the first sync so a bare-URL -> savedNav redirect on load
        // does not leave a junk entry to navigate "back" to.
        window.history.replaceState(null, "", target);
      } else {
        // Every later navigation gets its own history entry.
        window.history.pushState(null, "", target);
      }
    }
    firstSync.current = false;
  }, [ch, sub, expanded?.super, expanded?.section]);
}

export function usePopStateNav(apply) {
  useEffect(() => {
    const onPop = () => {
      const cfg = { chapters, sections, superSections };
      apply(parsePath(window.location.pathname, cfg));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [apply]);
}
