import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { chapters, sectionNames, sectionColors, sections, superSections, C } from "./config.js";
import { T, ErrorBoundary, NavContext } from "./components.jsx";
import { saveNav, loadNav } from "./nav-persistence.js";
import { resolveInitialState } from "./url-routing.js";
import { useUrlSync, usePopStateNav } from "./url-sync.js";
import TOC from "./chapters/table-of-contents/toc.jsx";

// ── Lazy-loaded search: not loaded until search is opened ──
const SearchOverlay = lazy(() => import("./search-overlay.jsx"));

// Home (ch=0) is bundled with the shell so the first paint is the TOC -
// no flash of an empty <main> waiting for a lazy chunk.
const TOC_FILE = "table-of-contents/toc";

// WCAG AA color-contrast (4.5:1) on the #08080d background needs >= 0.50 white
// alpha. C.dim (0.35) fails on the initial page. These constants override only
// the six initial-page spots Lighthouse flags; the rest of the app keeps C.dim.
const DIM_AA = "rgba(255,255,255,0.6)";
const SEARCH_PLACEHOLDER_AA = "rgba(224,212,255,0.75)";

// Per-chapter glob: each chapter file becomes a separate Vite chunk.
const chapterLoaders = import.meta.glob("./chapters/**/*.jsx");

async function loadChapterByFile(file) {
  if (!file) return null;
  if (file === TOC_FILE) return TOC;
  const key = `./chapters/${file}.jsx`;
  const loader = chapterLoaders[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default || null;
}

// ── Search module: lazy-loaded, cached ──
let searchModule = null;
async function getSearchModule() {
  if (!searchModule) {
    searchModule = await import("./search.js");
  }
  return searchModule;
}

// Validate chapter/component mapping in dev mode
if (import.meta.env.DEV) {
  chapters.forEach((c) => {
    const key = `./chapters/${c.file}.jsx`;
    if (!chapterLoaders[key]) {
      console.error(`[lookup] Chapter "${c.id}" file "${c.file}" not found in chapter glob.`);
    }
  });
}

// ── Nav zone (extracted to reduce main component size) ──
function NavZone({ side, hint, ripple, chapter, onClick, onHover }) {
  const isLeft = side === "left";
  return (
    <nav
      role="navigation"
      aria-label={isLeft ? "Previous chapter" : "Next chapter"}
      onMouseEnter={() => onHover(side)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(e);
      }}
      tabIndex={0}
      style={{
        position: "fixed",
        top: 0,
        [isLeft ? "left" : "right"]: 0,
        bottom: 0,
        width: "7%",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        transition: "background 0.3s ease",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [isLeft ? "left" : "left"]: isLeft ? "-100%" : "10%",
          [isLeft ? "right" : "right"]: isLeft ? "10%" : "-100%",
          borderRadius: "50%",
          background:
            hint === side
              ? `linear-gradient(to ${isLeft ? "right" : "left"}, transparent 94%, rgba(167,139,250,0.08) 100%)`
              : `linear-gradient(to ${isLeft ? "right" : "left"}, transparent 94%, rgba(167,139,250,0.03) 100%)`,
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />
      {ripple && ripple.side === side && (
        <div
          key={ripple.id}
          style={{
            position: "absolute",
            [isLeft ? "left" : "right"]: -200,
            top: "50%",
            width: 400,
            height: 400,
            marginTop: -200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
            animation: "navRipple 0.6s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          opacity: hint === side ? 1 : 0.5,
          transition: "opacity 0.2s ease",
          padding: "16px 6px",
          display: "flex",
          flexDirection: "column",
          alignItems: isLeft ? "flex-start" : "flex-end",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 18, color: "rgba(167,139,250,0.7)" }} aria-hidden="true">
          {isLeft ? "\u2190" : "\u2192"}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {isLeft ? "Previous" : "Next"}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "rgba(167,139,250,0.7)",
            lineHeight: 1.3,
            textAlign: isLeft ? "left" : "right",
            wordBreak: "break-word",
          }}
        >
          {chapter?.title}
        </span>
      </div>
    </nav>
  );
}

export default function LearnAI() {
  const [initial] = useState(() => {
    if (typeof window === "undefined") return { ch: 0, sub: 0, expanded: null };
    return resolveInitialState(window.location.pathname, loadNav(chapters), { chapters, sections, superSections });
  });

  const [ch, setCh] = useState(initial.ch);
  const [fade, setFade] = useState(true);
  const [sub, setSub] = useState(initial.sub);
  const [maxSubs, setMaxSubs] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  // Lifted state from chapters (so chapter functions have no hooks - can be called as plain functions)
  const [bankIdx, setBankIdx] = useState(0);
  const [hovered, setHovered] = useState(4);
  const [expanded, setExpanded] = useState(initial.expanded);
  const [navHint, setNavHint] = useState(null);
  const [ripple, setRipple] = useState(null);
  const [subBtnRipple, setSubBtnRipple] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [_semanticProgress, setSemanticProgress] = useState(0);
  const [semanticMode, setSemanticMode] = useState("off");

  // Keep the URL in sync with navigation state.
  useUrlSync({ ch, sub, expanded });

  // Lazy-loaded chapter render function. TOC is eager-imported, so the home
  // view paints in the same tick as the shell instead of after a chunk fetch.
  const [renderChapter, setRenderChapter] = useState(() => (initial.ch === 0 ? TOC : null));

  // Ref to track whether a SubBtn is currently rendered (avoids DOM queries)
  const subBtnRef = useRef(false);
  const registerSubBtn = useCallback((present) => {
    subBtnRef.current = present;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    const docEl = document.documentElement;
    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFs) {
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
      if (req) {
        const p = req.call(docEl);
        const lockEsc = () => {
          try {
            navigator.keyboard?.lock?.(["Escape"]);
          } catch {
            /* unsupported */
          }
        };
        if (p && p.then) p.then(lockEsc).catch(() => {});
        else lockEsc();
      }
    } else {
      try {
        navigator.keyboard?.unlock?.();
      } catch {
        /* unsupported */
      }
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }, []);

  // Ref to the <main> element so the click-to-navigate handler can skip
  // clicks that land inside the content column.
  const mainRef = useRef(null);

  // Poll for semantic search progress
  const pollRef = useRef(null);
  const startSemanticPoll = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      const mod = await getSearchModule();
      const status = mod.getSearchStatus();
      setSemanticMode(status.mode);
      setSemanticProgress(status.progress);
      if (status.mode === "semantic") {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 500);
  }, []);
  useEffect(
    () => () => {
      if (pollRef.current) clearInterval(pollRef.current);
    },
    [],
  );

  // Load the chapter component when ch changes
  const firstLoadDone = useRef(false);
  useEffect(() => {
    const entry = chapters[ch];
    if (!entry) return;
    let cancelled = false;
    setRenderChapter(null);
    loadChapterByFile(entry.file).then((fn) => {
      if (cancelled) return;
      if (fn) {
        setRenderChapter(() => fn);
      } else if (import.meta.env.DEV) {
        console.error(`[lookup] Failed to resolve chapter "${entry.id}" file "${entry.file}".`);
      }
      // After the first chapter loads, kick off semantic search prewarm. The
      // remote embed endpoint (or text-only fallback) is cheap to warm now -
      // no 99 MB model fetch, no main-thread parse - so we fire on `load`
      // inside requestIdleCallback instead of gating on user interaction.
      if (!firstLoadDone.current) {
        firstLoadDone.current = true;
        const prewarm = () => {
          const idle = (cb) =>
            typeof requestIdleCallback === "function"
              ? requestIdleCallback(cb, { timeout: 3000 })
              : setTimeout(cb, 1000);
          idle(() => {
            getSearchModule().then((mod) => {
              mod.initSearch().catch(() => {});
              mod.prefetchSearch?.().catch(() => {});
              startSemanticPoll();
            });
          });
        };
        if (document.readyState === "complete") prewarm();
        else window.addEventListener("load", prewarm, { once: true });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ch, startSemanticPoll]);

  // Persist navigation to localStorage on every change
  useEffect(() => {
    saveNav(ch, sub, chapters);
  }, [ch, sub]);

  const prevChRef = useRef(ch);
  useEffect(() => {
    if (prevChRef.current !== ch) {
      setBankIdx(0);
      setHovered(4);
      setExpanded(null);
      prevChRef.current = ch;
    }
  }, [ch]);

  // Back/Forward: re-parse the URL into React state. Set prevChRef.current first so
  // the chapter-change reset effect above no-ops and restored TOC expansion survives.
  const applyHistoryState = useCallback((parsed) => {
    if (parsed.kind === "chapter") {
      prevChRef.current = parsed.ch;
      setCh(parsed.ch);
      setSub(parsed.sub);
      setExpanded(null);
      window.scrollTo({ top: 0 });
    } else {
      prevChRef.current = 0;
      setCh(0);
      setSub(0);
      setExpanded(
        parsed.kind === "toc" && parsed.super
          ? { super: parsed.super, section: parsed.section }
          : null,
      );
    }
  }, []);
  usePopStateNav(applyHistoryState);

  // Auto-scroll so the learner lands just above the newly revealed box.
  // We aim for the midpoint between the previous box's bottom and the new box's top to sit at
  // the top of the viewport. This leaves some breathing room above the new box instead of
  // pinning its top edge flush against the screen edge. For the first reveal (no previous box),
  // fall back to a small fixed offset above it.
  useEffect(() => {
    if (sub > 0) {
      setTimeout(() => {
        const reveals = document.querySelectorAll("[data-reveal]");
        const newest = reveals[reveals.length - 1];
        if (!newest) return;
        const newTop = newest.getBoundingClientRect().top;
        const prev = reveals[reveals.length - 2];
        const targetY = prev
          ? window.scrollY + (prev.getBoundingClientRect().bottom + newTop) / 2
          : window.scrollY + newTop - 40;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 200);
    }
  }, [sub]);

  // Track max sub for back-navigation restoration
  useEffect(() => {
    if (!subBtnRef.current && sub > 0) {
      setMaxSubs((prev) => ({ ...prev, [ch]: sub }));
    }
  }, [sub, ch]);

  const goTo = useCallback(
    (n, startSub = 0) => {
      if (n < 0 || n >= chapters.length || transitioning) return;
      setTransitioning(true);
      setFade(false);
      setTimeout(() => {
        window.scrollTo({ top: 0 });
        setCh(n);
        setSub(startSub);
        setFade(true);
        setTransitioning(false);
      }, 60);
    },
    [transitioning],
  );

  // Unified navigation: handles both sub-steps and chapter changes
  const navigate = useCallback(
    (direction) => {
      if (transitioning) return;
      if (direction === "forward") {
        if (subBtnRef.current) {
          setSub((s) => s + 1);
        } else if (ch < chapters.length - 1) {
          goTo(ch + 1);
        }
      } else {
        if (sub > 0) {
          setSub((s) => s - 1);
        } else if (ch > 0) {
          const prevMax = maxSubs[ch - 1];
          goTo(ch - 1, prevMax != null ? prevMax : 0);
        }
      }
    },
    [transitioning, ch, sub, maxSubs, goTo],
  );

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handleSearchKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", handleSearchKey);
    return () => window.removeEventListener("keydown", handleSearchKey);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (searchOpen) return; // Don't navigate while search is open
      if (e.key === "Escape") {
        const isFs = document.fullscreenElement || document.webkitFullscreenElement;
        if (isFs) {
          e.preventDefault();
          toggleFullscreen();
        }
        return;
      }
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        if (subBtnRef.current) {
          setSubBtnRipple(Date.now());
        } else if (ch < chapters.length - 1) {
          setNavHint("right");
          setRipple({ side: "right", id: Date.now() });
          setTimeout(() => {
            setNavHint(null);
          }, 150);
          setTimeout(() => setRipple(null), 500);
        }
        navigate("forward");
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (sub === 0 && ch > 0) {
          setNavHint("left");
          setRipple({ side: "left", id: Date.now() });
          setTimeout(() => {
            setNavHint(null);
          }, 150);
          setTimeout(() => setRipple(null), 500);
        }
        navigate("back");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, ch, sub, searchOpen, toggleFullscreen]);

  // Tap-to-navigate: a click in the side band to the left of <main> mirrors
  // ArrowLeft/Up, and a click to the right of <main> mirrors ArrowRight/Down/
  // Space. Clicks that land inside the main content column do nothing, so the
  // learner can interact with text and visuals without triggering navigation.
  // Also skipped when: search is open, user is selecting text, click is on an
  // interactive element (button/link/input/summary/cursor:pointer), or the
  // user is double-clicking to select text.
  //
  // The first click of a double-click has detail===1 and cannot be distinguished
  // from a single click at the moment it fires. To avoid navigating on every
  // double-click, navigation is deferred by the browser's double-click window
  // (~300ms). A follow-up click with detail>1 cancels the pending navigation.
  useEffect(() => {
    let pendingTimer = null;
    const DOUBLE_CLICK_DELAY = 280;

    // Walk composedPath() instead of parentElement so that React onClicks which
    // re-render and unmount the click target (e.g. TOC's `{!isOpen && <desc/>}`)
    // still expose their cursor:pointer ancestor at the time of dispatch.
    const isInteractive = (event) => {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      for (const el of path) {
        if (!el || el.nodeType !== 1 || el === document.body || el === document.documentElement) continue;
        const tag = el.tagName;
        if (
          tag === "BUTTON" ||
          tag === "A" ||
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          tag === "SUMMARY" ||
          tag === "LABEL"
        ) {
          return true;
        }
        try {
          const cs = window.getComputedStyle(el);
          if (cs.cursor === "pointer") return true;
        } catch {
          // getComputedStyle can throw on detached nodes; ignore
        }
      }
      return false;
    };

    const handleClick = (e) => {
      if (searchOpen) return;
      if (e.button !== 0) return;

      // Second (or later) click of a multi-click gesture: cancel any pending nav.
      if (e.detail > 1) {
        if (pendingTimer) {
          clearTimeout(pendingTimer);
          pendingTimer = null;
        }
        return;
      }

      const selection = window.getSelection && window.getSelection();
      if (selection && selection.toString().length > 0) return;
      if (isInteractive(e)) return;

      // Skip clicks that land inside the main content column - only the side
      // bands flanking <main> trigger navigation.
      const mainEl = mainRef.current;
      if (mainEl) {
        const rect = mainEl.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) return;
      }

      const direction = e.clientX < window.innerWidth / 2 ? "back" : "forward";

      // Defer so a quick follow-up double-click (for text selection) can cancel.
      if (pendingTimer) clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => {
        pendingTimer = null;
        // Re-check selection: double-click populates selection during the defer window.
        const selNow = window.getSelection && window.getSelection();
        if (selNow && selNow.toString().length > 0) return;

        if (direction === "forward") {
          if (subBtnRef.current) {
            setSubBtnRipple(Date.now());
          } else if (ch < chapters.length - 1) {
            setNavHint("right");
            setRipple({ side: "right", id: Date.now() });
            setTimeout(() => setNavHint(null), 150);
            setTimeout(() => setRipple(null), 500);
          }
          navigate("forward");
        } else {
          if (sub === 0 && ch > 0) {
            setNavHint("left");
            setRipple({ side: "left", id: Date.now() });
            setTimeout(() => setNavHint(null), 150);
            setTimeout(() => setRipple(null), 500);
          }
          navigate("back");
        }
      }, DOUBLE_CLICK_DELAY);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      if (pendingTimer) clearTimeout(pendingTimer);
    };
  }, [navigate, ch, sub, searchOpen]);

  // Handle search open: just open the overlay (search init already started after first chapter load)
  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
    // In case search hasn't initialized yet (e.g., opened very fast), ensure it starts
    getSearchModule().then((mod) => {
      mod.initSearch().catch(() => {});
      mod.prefetchSearch?.().catch(() => {});
    });
  }, []);

  // Context object passed to all chapter functions
  const ctx = {
    sub,
    setSub,
    subBtnRipple,
    setSubBtnRipple,
    navigate,
    goTo,
    bankIdx,
    setBankIdx,
    hovered,
    setHovered,
    expanded,
    setExpanded,
    currentChapter: chapters[ch] || null,
    registerSubBtn,
  };

  const handleNavClick = (e, side) => {
    setRipple({ side, id: Date.now() });
    setTimeout(() => setRipple(null), 500);
    goTo(side === "left" ? ch - 1 : ch + 1);
  };


  return (
    <>
      <style>{`
      @keyframes navRipple { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(1); opacity: 0; } }
      @keyframes fadeSlideIn { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes searchRainbowFade {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes skeletonPulse {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 0.95; }
      }
    `}</style>
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: "#fff",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px 8% 30px",
        }}
      >
        <header style={{ textAlign: "center", width: "100%", maxWidth: 840 }}>
          <h1
            style={{
              fontSize: 29,
              fontWeight: 800,
              margin: "0 0 2px",
              background: "linear-gradient(135deg, #ff6b6b, #a78bfa, #00e676, #00b8d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learn AI
          </h1>
          <T color={DIM_AA} size={14} center style={{ lineHeight: 1.3 }}>
            The complete visual guide to understanding AI - from scratch
          </T>
          {/* Search bar - rainbow fades in when semantic ready, stays permanently */}
          {(() => {
            const isReady = semanticMode === "semantic";
            const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent) && !isMobile;
            const shortcutLabel = isMobile ? null : isMac ? "\u2318K" : "Ctrl+K";
            const rainbow =
              "linear-gradient(90deg, #ff6b6b, #ffa726, #ffee58, #66bb6a, #00b8d4, #a78bfa, #e040fb, #ff6b6b)";
            return (
              <div style={{ marginTop: 12, width: "100%" }}>
                {/* Outer = gradient border via padding trick */}
                <div
                  onClick={handleSearchOpen}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchOpen();
                  }}
                  aria-label="Search chapters, concepts, formulas"
                  data-search-outer="true"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 9,
                    cursor: "pointer",
                    padding: 1.5,
                    background: "rgba(167, 139, 250, 0.25)",
                  }}
                >
                  {/* Rainbow overlay - fades in and stays */}
                  {isReady && (
                    <div
                      data-search-rainbow="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: rainbow,
                        animation: "searchRainbowFade 1.2s ease-out forwards",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {/* Inner = dark content */}
                  <div
                    data-search-inner="true"
                    style={{
                      position: "relative",
                      borderRadius: 7.5,
                      backgroundColor: "#0d0b14",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isReady ? "#e0d4ff" : "rgba(167, 139, 250, 0.8)"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ flexShrink: 0, transition: "stroke 0.6s ease" }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: isReady ? SEARCH_PLACEHOLDER_AA : "rgba(255,255,255,0.6)",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        transition: "color 0.6s ease",
                      }}
                    >
                      Search chapters, concepts, formulas...
                    </span>
                    {shortcutLabel && (
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'Segoe UI', system-ui, sans-serif",
                          color: isReady ? "#e0d4ff" : "#a78bfa",
                          opacity: isReady ? 0.9 : 1,
                          transition: "color 0.6s ease, opacity 0.6s ease",
                        }}
                      >
                        {shortcutLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </header>

        {/* Search overlay - lazy loaded, only fetched when opened */}
        {searchOpen && (
          <Suspense fallback={null}>
            <SearchOverlay
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              onGoTo={(idx, startSub) => goTo(idx, startSub)}
            />
          </Suspense>
        )}

        {/* Per-section progress */}
        {ch > 0 &&
          (() => {
            const curSection = chapters[ch].section;
            const sectionChs = chapters.filter((c) => c.section === curSection);
            const idxInSection = sectionChs.findIndex((c) => c.id === chapters[ch].id);
            const pct = Math.round(((idxInSection + 1) / sectionChs.length) * 100);
            const pc = sectionColors[curSection] || C.purple;
            return (
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Section ${curSection} progress: ${pct}%`}
                style={{ width: "100%", maxWidth: 800, margin: "14px 0 6px" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}
                >
                  <span
                    onClick={() => goTo(0)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") goTo(0);
                    }}
                    style={{ fontSize: 12, color: C.dim, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}
                  >
                    Table of Contents
                  </span>
                  <T color={pc} size={12} bold center>
                    Section {curSection}: {sectionNames[curSection]}
                  </T>
                  <span style={{ fontSize: 12, color: `${pc}99`, flexShrink: 0 }}>
                    {idxInSection + 1}/{sectionChs.length} - {pct}%
                  </span>
                </div>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 2,
                      background: pc,
                      transition: "width 0.4s ease",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })()}
        {ch > 0 ? (
          <>
            <T color={C.dim} size={12} center>
              Chapter {chapters[ch].id}
            </T>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 14px", color: C.bright, textAlign: "center" }}>
              {chapters[ch].title}
            </h2>
          </>
        ) : (
          <T color={DIM_AA} size={14} center style={{ margin: "12px 0 12px", lineHeight: 1.3 }}>
            {Object.keys(sectionNames).length - 1} Sections · {chapters.length - 1} Chapters
          </T>
        )}

        <main
          ref={mainRef}
          style={{
            width: "100%",
            maxWidth: 840,
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.05s ease-out, transform 0.06s ease-out",
          }}
        >
          <NavContext.Provider value={{ goTo, chapters }}>
            <ErrorBoundary resetKey={ch}>
              {renderChapter ? (
                renderChapter(ctx)
              ) : (
                <div
                  data-chapter-skeleton="true"
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    padding: "8px 0",
                    animation: "skeletonPulse 1.1s ease-in-out infinite",
                  }}
                >
                  <div style={{ height: 18, width: "70%", background: "rgba(255,255,255,0.05)", borderRadius: 6 }} />
                  <div style={{ height: 14, width: "90%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
                  <div style={{ height: 14, width: "85%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
                  <div style={{ height: 120, width: "100%", background: "rgba(167,139,250,0.04)", borderRadius: 10, marginTop: 6 }} />
                  <div style={{ height: 14, width: "80%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
                  <div style={{ height: 14, width: "75%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
                </div>
              )}
            </ErrorBoundary>
          </NavContext.Provider>
        </main>

        {/* Tap-to-navigate zones */}
        {ch > 0 && (
          <NavZone
            side="left"
            hint={navHint}
            ripple={ripple}
            chapter={chapters[ch - 1]}
            onClick={(e) => handleNavClick(e, "left")}
            onHover={(s) => setNavHint(s ? "left" : null)}
          />
        )}
        {ch < chapters.length - 1 && (
          <NavZone
            side="right"
            hint={navHint}
            ripple={ripple}
            chapter={chapters[ch + 1]}
            onClick={(e) => handleNavClick(e, "right")}
            onHover={(s) => setNavHint(s ? "right" : null)}
          />
        )}

        <div data-footer-spacer="true" aria-hidden="true" style={{ flex: 1, minHeight: 16, alignSelf: "stretch" }} />

        <footer
          style={{
            alignSelf: "stretch",
            marginLeft: "-8%",
            marginRight: "-8%",
            marginBottom: -30,
            minHeight: 50,
            paddingLeft: "8%",
            paddingRight: "8%",
            borderTop: "1px solid transparent",
            borderImageSource:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0) 100%)",
            borderImageSlice: 1,
            textAlign: "center",
            fontSize: 12,
            color: DIM_AA,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div data-footer-line="author" style={{ marginBottom: 3 }}>
            Built by{" "}
            <a
              href="https://github.com/rajulbabel"
              rel="author noopener noreferrer"
              target="_blank"
              style={{ color: C.bright, textDecoration: "none", fontWeight: 600 }}
            >
              Rajul Babel
            </a>
          </div>
          <div data-footer-line="links">
            <a
              href="https://www.linkedin.com/in/rajulbabel"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: DIM_AA, textDecoration: "none" }}
            >
              LinkedIn
            </a>
            {" · "}
            <a
              href="https://github.com/rajulbabel/learn-ai"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: DIM_AA, textDecoration: "none" }}
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
