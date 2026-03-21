import { useState, useEffect, useRef, useCallback } from "react";
import { chapters, sectionColors, C } from "./config.js";
import { T } from "./components.jsx";
import { initSearch, search, searchText, getSearchStatus } from "./search.js";

/**
 * Full-screen search overlay.
 *
 * Props:
 *   open      - boolean, whether overlay is visible
 *   onClose   - function, called when user dismisses
 *   onGoTo    - function(chapterIndex), called when user picks a result
 */
export default function SearchOverlay({ open, onClose, onGoTo }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hybrid, setHybrid] = useState(false);
  const [searchMode, setSearchMode] = useState("off");
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const pollRef = useRef(null);

  // Initialize search on first open + poll for semantic readiness
  useEffect(() => {
    if (open) {
      initSearch().catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 100);
      // Poll for status changes (semantic model loads async in background)
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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Debounced search - instant text, then silently upgrades if semantic is ready
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      setHybrid(false);
      return;
    }

    // Instant text search (always works)
    const textResults = searchText(q);
    setResults(textResults);
    setHybrid(false);

    // Then try hybrid - if semantic model loaded in background, results upgrade
    // If not loaded yet, this just returns the same text results. No lag either way.
    try {
      const hybridResults = await search(q, { limit: 10 });
      setResults(hybridResults);
      // Check if any result came from hybrid source
      const isHybrid = hybridResults.some((r) => r.source === "hybrid");
      setHybrid(isHybrid);
    } catch {
      // Text results already displayed - nothing to do
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setLoading(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 200);
  };

  const handleSelect = (chapterId, sub) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx >= 0) {
      onGoTo(idx, sub || 0);
      onClose();
      setQuery("");
      setResults([]);
      setHybrid(false);
    }
  };

  if (!open) return null;

  // Subtle border color shift: purple when text-only, warm purple-gold when hybrid
  const borderIdle = hybrid ? "rgba(200, 160, 255, 0.35)" : "rgba(167, 139, 250, 0.3)";
  const borderFocus = hybrid ? "rgba(200, 160, 255, 0.7)" : "rgba(167, 139, 250, 0.6)";
  const glowShadow = hybrid ? "0 0 20px rgba(200, 160, 255, 0.12)" : "none";

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
        padding: "60px 16px 30px",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Search input */}
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          position: "relative",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search chapters, concepts, formulas..."
          style={{
            width: "100%",
            padding: "14px 48px 14px 18px",
            fontSize: 18,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${borderIdle}`,
            borderRadius: 12,
            color: "#fff",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: glowShadow,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = borderFocus;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = borderIdle;
          }}
        />
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            color: C.dim,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          ESC
        </button>
      </div>

      {/* Status */}
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
        <T color={C.dim} size={12}>
          {query.trim()
            ? loading
              ? "Searching..."
              : `${results.length} result${results.length !== 1 ? "s" : ""}`
            : "Type to search across all chapters"}
        </T>
        {/* Search mode indicator */}
        {(() => {
          const isSemantic = searchMode === "semantic";
          const isLoading = searchMode === "loading";
          const dotColor = isSemantic ? "#00e676" : isLoading ? "#ffab40" : "rgba(255,255,255,0.25)";
          const label = isSemantic ? "Semantic search active" : isLoading ? "Loading semantic model..." : "Text search";
          const labelColor = isSemantic ? "rgba(0, 230, 118, 0.7)" : isLoading ? "rgba(255, 171, 64, 0.7)" : "rgba(255,255,255,0.3)";
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: dotColor,
                boxShadow: isSemantic ? "0 0 6px rgba(0, 230, 118, 0.4)" : isLoading ? "0 0 6px rgba(255, 171, 64, 0.3)" : "none",
                transition: "background 0.4s ease, box-shadow 0.4s ease",
              }} />
              <span style={{ fontSize: 11, color: labelColor, transition: "color 0.4s ease" }}>
                {label}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Results */}
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {results.map((r, i) => {
          const secColor = sectionColors[r.section] || C.purple;
          // Extract a snippet from the text (first 180 chars)
          const snippet =
            r.text.length > 180 ? r.text.slice(0, 180) + "..." : r.text;

          return (
            <button
              key={`${r.chapterId}-${i}`}
              onClick={() => handleSelect(r.chapterId, r.sub)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 14px",
                borderRadius: 10,
                background: `${secColor}08`,
                border: `1px solid ${secColor}20`,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s ease, border-color 0.15s ease",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${secColor}15`;
                e.currentTarget.style.borderColor = `${secColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${secColor}08`;
                e.currentTarget.style.borderColor = `${secColor}20`;
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
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
                    color: "#fff",
                  }}
                >
                  {r.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: C.dim,
                  lineHeight: 1.4,
                }}
              >
                {r.sectionName}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.4,
                }}
              >
                {snippet}
              </span>
            </button>
          );
        })}

        {/* Empty state */}
        {query.trim() && !loading && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <T color={C.dim} size={16}>
              No results found for "{query}"
            </T>
          </div>
        )}

        {/* Keyboard hint */}
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
