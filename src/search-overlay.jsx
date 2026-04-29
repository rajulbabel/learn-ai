import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { chapters, sectionColors, C } from "./config.js";
import { T } from "./components.jsx";
import { initSearch, search, searchText, getSearchStatus, prefetchSearch } from "./search.js";

/** Minimum relevance (as fraction of top score) to show a result. */
const RELEVANCE_THRESHOLD = 0.15;

/**
 * Filter results by relative score and compute a normalized 0-10 score.
 * Top result = 10.0, others scaled proportionally.
 * Results below RELEVANCE_THRESHOLD (as fraction of 10) are filtered out.
 * Always returns at least 1 result if input is non-empty.
 */
function filterByRelevance(results) {
  if (results.length === 0) return [];
  const maxScore = results[0].score || 0;
  if (maxScore <= 0) {
    return results.map((r) => ({ ...r, searchScore: null }));
  }
  const withScore = results.map((r) => ({
    ...r,
    searchScore: Math.round(((r.score || 0) / maxScore) * 100) / 10,
  }));
  const threshold = RELEVANCE_THRESHOLD * 10;
  const filtered = withScore.filter((r) => r.searchScore >= threshold);
  return filtered.length > 0 ? filtered : [withScore[0]];
}

/**
 * Highlight query terms in a snippet by wrapping matches in bold spans.
 * Returns an array of React elements (text nodes + bold spans).
 */
function highlightSnippet(text, queryStr) {
  if (!queryStr || !queryStr.trim()) return [text];
  // Split query into individual words, escape regex special chars
  const words = queryStr
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return [text];

  const pattern = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <strong key={i} style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Full-screen search overlay.
 */
export default function SearchOverlay({ open, onClose, onGoTo }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_hybrid, setHybrid] = useState(false);
  const [searchMode, setSearchMode] = useState("off");
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const pollRef = useRef(null);
  const resultRefs = useRef([]);
  const pendingScrollRef = useRef(-1);

  const filteredResults = useMemo(() => filterByRelevance(results), [results]);

  useEffect(() => {
    if (pendingScrollRef.current >= 0) {
      resultRefs.current[pendingScrollRef.current]?.scrollIntoView({
        block: "nearest",
      });
      pendingScrollRef.current = -1;
    }
  }, [activeIdx]);

  useEffect(() => {
    if (open) {
      initSearch().catch(() => {});
      prefetchSearch?.().catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 100);
      const s = getSearchStatus();
      setSearchMode(s.mode);
      pollRef.current = setInterval(() => {
        const status = getSearchStatus();
        setSearchMode(status.mode);
        if (status.mode === "semantic") clearInterval(pollRef.current);
      }, 1000);
    }
    return () => clearInterval(pollRef.current);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      setHybrid(false);
      return;
    }
    const textResults = searchText(q);
    setResults(textResults);
    setHybrid(false);
    try {
      const hybridResults = await search(q, { limit: 10 });
      setResults(hybridResults);
      const isHybrid = hybridResults.some((r) => r.source === "hybrid");
      setHybrid(isHybrid);
    } catch {
      // Text results already displayed
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setLoading(true);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 200);
  };

  const handleSelect = (chapterId, sub) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx >= 0) {
      onGoTo(idx, sub > 0 ? sub : 0);
      onClose();
      setQuery("");
      setResults([]);
      setHybrid(false);
      setActiveIdx(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (filteredResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => {
        const next = prev < filteredResults.length - 1 ? prev + 1 : 0;
        pendingScrollRef.current = next;
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => {
        const next = prev <= 0 ? filteredResults.length - 1 : prev - 1;
        pendingScrollRef.current = next;
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < filteredResults.length) {
        const r = filteredResults[activeIdx];
        handleSelect(r.chapterId, r.sub);
      }
    }
  };

  if (!open) return null;

  const isReady = searchMode === "semantic";
  const isSearchLoading = searchMode === "loading";
  const rainbow = "linear-gradient(90deg, #ff6b6b, #ffa726, #ffee58, #66bb6a, #00b8d4, #a78bfa, #e040fb, #ff6b6b)";

  // Status label + color
  const dotColor = isReady ? "#00e676" : isSearchLoading ? "#ffab40" : "rgba(255,255,255,0.25)";
  const statusLabel = isReady
    ? "Semantic Search Active"
    : isSearchLoading
      ? "Loading semantic model..."
      : "Text search";
  const statusColor = isReady
    ? "rgba(0, 230, 118, 0.7)"
    : isSearchLoading
      ? "rgba(255, 171, 64, 0.7)"
      : "rgba(255,255,255,0.3)";

  // Result count text
  const countText = query.trim()
    ? loading
      ? "Searching..."
      : `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}`
    : "Type to search";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(8, 8, 13, 0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Sticky search header ── */}
      <div
        data-search-header="true"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 16px 12px",
          background: "linear-gradient(to bottom, rgba(8,8,13,1) 75%, rgba(8,8,13,0.97) 90%, rgba(8,8,13,0))",
        }}
      >
        {/* Search input - gradient border wrapper */}
        <div style={{ width: "100%", maxWidth: 600 }}>
          <div
            data-search-bar="true"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 12,
              padding: 1.5,
              background: "rgba(167, 139, 250, 0.25)",
            }}
          >
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
            <div
              data-search-inner="true"
              style={{
                position: "relative",
                borderRadius: 10.5,
                backgroundColor: "#0d0b14",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
              }}
            >
              <svg
                width={18}
                height={18}
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
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search chapters, concepts, formulas..."
                style={{
                  flex: 1,
                  padding: 0,
                  fontSize: 17,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  outline: "none",
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  color: C.dim,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  flexShrink: 0,
                }}
              >
                ESC
              </button>
            </div>
          </div>
        </div>

        {/* ── Single status line: count (left) | shortcuts (center) | mode (right) ── */}
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: search mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: dotColor,
                boxShadow: isReady
                  ? "0 0 6px rgba(0, 230, 118, 0.4)"
                  : isSearchLoading
                    ? "0 0 6px rgba(255, 171, 64, 0.3)"
                    : "none",
                transition: "background 0.4s ease, box-shadow 0.4s ease",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: statusColor,
                transition: "color 0.4s ease",
              }}
            >
              {statusLabel}
            </span>
          </div>

          {/* Center: keyboard shortcuts */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {[
              { keys: ["\u2191", "\u2193"], label: "navigate" },
              { keys: ["\u21B5"], label: "select" },
              { keys: ["esc"], label: "close" },
            ].map(({ keys, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {keys.map((k) => (
                  <span
                    key={k}
                    style={{
                      fontSize: 9,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      padding: "1px 4px",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {k}
                  </span>
                ))}
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right: result count */}
          <T color={C.dim} size={11} style={{ flexShrink: 0 }}>
            {countText}
          </T>
        </div>
      </div>

      {/* ── Scrollable results ── */}
      <div
        data-search-results="true"
        style={{
          maxWidth: 600,
          width: "100%",
          padding: "2px 0 30px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {filteredResults.map((r, i) => {
          const secColor = sectionColors[r.section] || C.purple;
          const isActive = i === activeIdx;
          const rawSnippet = r.text.length > 180 ? r.text.slice(0, 180) + "..." : r.text;
          const snippetContent = highlightSnippet(rawSnippet, query);

          const sc = r.searchScore;
          const scoreColor =
            sc == null
              ? null
              : sc >= 7
                ? "rgba(0, 230, 118, 0.7)"
                : sc >= 4
                  ? "rgba(255, 171, 64, 0.7)"
                  : "rgba(255, 255, 255, 0.35)";

          return (
            <button
              key={`${r.chapterId}-${i}`}
              ref={(el) => {
                resultRefs.current[i] = el;
              }}
              data-result={i}
              data-active={isActive ? "true" : "false"}
              onClick={() => handleSelect(r.chapterId, r.sub)}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 14px",
                borderRadius: 10,
                background: isActive ? `${secColor}18` : `${secColor}08`,
                border: `1px solid ${isActive ? `${secColor}50` : `${secColor}20`}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.12s ease, border-color 0.12s ease",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: secColor,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: `${secColor}18`,
                    flexShrink: 0,
                  }}
                >
                  {r.chapterId}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                  }}
                >
                  {r.title}
                </span>
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {sc != null && (
                    <span
                      data-score="true"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: scoreColor,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background:
                          sc >= 7
                            ? "rgba(0, 230, 118, 0.08)"
                            : sc >= 4
                              ? "rgba(255, 171, 64, 0.08)"
                              : "rgba(255, 255, 255, 0.04)",
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                    >
                      Search Score: {sc.toFixed(1)}
                    </span>
                  )}
                  {isActive && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{"\u21B5"}</span>}
                </span>
              </div>
              <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.4 }}>{r.sectionName}</span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.4,
                }}
              >
                {snippetContent}
              </span>
            </button>
          );
        })}

        {query.trim() && !loading && filteredResults.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <T color={C.dim} size={16}>
              No results found for "{query}"
            </T>
          </div>
        )}

        {!query.trim() && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <T color={C.dim} size={14}>
              Search by keywords like "softmax", "backpropagation", or "attention"
            </T>
          </div>
        )}
      </div>
    </div>
  );
}
