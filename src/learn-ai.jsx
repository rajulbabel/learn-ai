import { useState, useEffect, useRef, useCallback } from "react";
import { chapters, sectionNames, sectionColors, C } from "./config.js";
import { T, ErrorBoundary } from "./components.jsx";

// Section imports
import { TOC } from "./sections/toc.jsx";
import * as NeuralFoundations from "./sections/neural-foundations.jsx";
import * as LLMTraining from "./sections/llm-training.jsx";
import * as Scaling from "./sections/scaling.jsx";
import * as RoadToTransformers from "./sections/road-to-transformers.jsx";
import * as TransformerInput from "./sections/transformer-input.jsx";
import * as AttentionQKV from "./sections/attention-qkv.jsx";
import * as AttentionComputation from "./sections/attention-computation.jsx";

// Lookup: component name -> function (derived from config, not manually maintained)
const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
};

// Validate lookup matches config (dev only)
if (import.meta.env.DEV) {
  chapters.forEach(c => {
    if (c.component && !lookup[c.component]) {
      console.error(`[lookup] Chapter "${c.id}" references component "${c.component}" which is not exported by any section file.`);
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
      onKeyDown={(e) => { if (e.key === "Enter") onClick(e); }}
      tabIndex={0}
      style={{
        position: "fixed", top: 0, [isLeft ? "left" : "right"]: 0, bottom: 0, width: "7%",
        cursor: "pointer", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: isLeft ? "flex-start" : "flex-end",
        transition: "background 0.3s ease", outline: "none",
      }}
    >
      <div style={{
        position: "absolute", top: "-10%", bottom: "-10%",
        [isLeft ? "left" : "left"]: isLeft ? "-300%" : "10%",
        [isLeft ? "right" : "right"]: isLeft ? "10%" : "-300%",
        borderRadius: "50%",
        background: hint === side
          ? `linear-gradient(to ${isLeft ? "right" : "left"}, transparent 94%, rgba(167,139,250,0.08) 100%)`
          : `linear-gradient(to ${isLeft ? "right" : "left"}, transparent 94%, rgba(167,139,250,0.03) 100%)`,
        transition: "background 0.3s ease", pointerEvents: "none",
      }} />
      {ripple && ripple.side === side && <div key={ripple.id} style={{
        position: "absolute", [isLeft ? "left" : "right"]: -200, top: "50%",
        width: 400, height: 400, marginTop: -200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
        animation: "navRipple 0.6s ease-out forwards", pointerEvents: "none",
      }} />}
      <div style={{
        position: "relative", zIndex: 1,
        opacity: hint === side ? 1 : 0.5,
        transition: "opacity 0.2s ease",
        padding: "16px 6px",
        display: "flex", flexDirection: "column", alignItems: isLeft ? "flex-start" : "flex-end", gap: 4,
      }}>
        <span style={{ fontSize: 18, color: "rgba(167,139,250,0.7)" }} aria-hidden="true">{isLeft ? "\u2190" : "\u2192"}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, textTransform: "uppercase" }}>{isLeft ? "Previous" : "Next"}</span>
        <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(167,139,250,0.7)", lineHeight: 1.3, textAlign: isLeft ? "left" : "right", wordBreak: "break-word" }}>{chapter?.title}</span>
      </div>
    </nav>
  );
}

export default function LearnAI() {
  const [ch, setCh] = useState(0);
  const [fade, setFade] = useState(true);
  const [sub, setSub] = useState(0);
  const [maxSubs, setMaxSubs] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  // Lifted state from chapters (so chapter functions have no hooks - can be called as plain functions)
  const [bankIdx, setBankIdx] = useState(0);
  const [hovered, setHovered] = useState(4);
  const [expanded, setExpanded] = useState(null);
  const [navHint, setNavHint] = useState(null);
  const [ripple, setRipple] = useState(null);
  const [subBtnRipple, setSubBtnRipple] = useState(0);

  // Ref to track whether a SubBtn is currently rendered (avoids DOM queries)
  const subBtnRef = useRef(false);
  const registerSubBtn = useCallback((present) => { subBtnRef.current = present; }, []);

  const prevChRef = useRef(ch);
  useEffect(() => {
    if (prevChRef.current !== ch) {
      setBankIdx(0);
      setHovered(4);
      setExpanded(null);
      prevChRef.current = ch;
    }
  }, [ch]);

  // Auto-scroll to latest reveal or SubBtn
  useEffect(() => {
    if (sub > 0) {
      setTimeout(() => {
        const btn = document.querySelector("[data-subbtn]");
        const target = btn || document.querySelector("[data-reveal]:last-child");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [sub]);

  // Track max sub for back-navigation restoration
  useEffect(() => {
    if (!subBtnRef.current && sub > 0) {
      setMaxSubs(prev => ({ ...prev, [ch]: sub }));
    }
  }, [sub, ch]);

  const goTo = useCallback((n, startSub = 0) => {
    if (n < 0 || n >= chapters.length || transitioning) return;
    setTransitioning(true);
    setFade(false);
    setTimeout(() => { window.scrollTo({ top: 0 }); setCh(n); setSub(startSub); setFade(true); setTransitioning(false); }, 60);
  }, [transitioning]);

  // Unified navigation: handles both sub-steps and chapter changes
  const navigate = useCallback((direction) => {
    if (transitioning) return;
    if (direction === "forward") {
      if (subBtnRef.current) {
        setSub(s => s + 1);
      } else if (ch < chapters.length - 1) {
        goTo(ch + 1);
      }
    } else {
      if (sub > 0) {
        setSub(s => s - 1);
      } else if (ch > 0) {
        const prevMax = maxSubs[ch - 1];
        goTo(ch - 1, prevMax != null ? prevMax : 0);
      }
    }
  }, [transitioning, ch, sub, maxSubs, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        if (subBtnRef.current) {
          setSubBtnRipple(Date.now());
        } else if (ch < chapters.length - 1) {
          setNavHint("right");
          setRipple({ side: "right", id: Date.now() });
          setTimeout(() => { setNavHint(null); }, 150);
          setTimeout(() => setRipple(null), 500);
        }
        navigate("forward");
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (sub === 0 && ch > 0) {
          setNavHint("left");
          setRipple({ side: "left", id: Date.now() });
          setTimeout(() => { setNavHint(null); }, 150);
          setTimeout(() => setRipple(null), 500);
        }
        navigate("back");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, ch, sub]);

  // Context object passed to all chapter functions
  const ctx = { sub, setSub, subBtnRipple, setSubBtnRipple, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded, registerSubBtn };

  // Resolve the current chapter's render function from the lookup
  const renderChapter = lookup[chapters[ch].component];

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
    `}</style>
    <div style={{
      minHeight: "100vh", background: C.bg, color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "14px 8% 30px",
    }}>
      <header style={{ textAlign: "center", width: "100%", maxWidth: 840 }}>
        <h1 style={{
          fontSize: 29, fontWeight: 800, margin: "0 0 2px",
          background: "linear-gradient(135deg, #ff6b6b, #a78bfa, #00e676, #00b8d4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Learn AI</h1>
        <T color={C.dim} size={14} center>The complete visual guide to understanding AI - from scratch</T>
      </header>

      {/* Per-section progress */}
      {ch > 0 && (() => {
        const curSection = chapters[ch].section;
        const sectionChs = chapters.filter(c => c.section === curSection);
        const idxInSection = sectionChs.findIndex(c => c.id === chapters[ch].id);
        const pct = Math.round(((idxInSection + 1) / sectionChs.length) * 100);
        const pc = sectionColors[curSection] || C.purple;
        return (
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Section ${curSection} progress: ${pct}%`} style={{ width: "100%", maxWidth: 800, margin: "14px 0 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span onClick={() => goTo(0)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") goTo(0); }} style={{ fontSize: 12, color: C.dim, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>Table of Contents</span>
              <T color={pc} size={12} bold center>Section {curSection}: {sectionNames[curSection]}</T>
              <span style={{ fontSize: 12, color: `${pc}99`, flexShrink: 0 }}>{idxInSection + 1}/{sectionChs.length} - {pct}%</span>
            </div>
            <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: pc, transition: "width 0.4s ease", opacity: 0.7 }} />
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
        <T color={C.dim} size={14} center style={{ margin: "6px 0 10px" }}>{Object.keys(sectionNames).length - 1} Sections · {chapters.length - 1} Chapters</T>
      )}

      <main style={{
        width: "100%", maxWidth: 840,
        opacity: fade ? 1 : 0,
        transform: fade ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.05s ease-out, transform 0.06s ease-out",
      }}>
        <ErrorBoundary resetKey={ch}>
          {renderChapter(ctx)}
        </ErrorBoundary>
      </main>

      {/* Tap-to-navigate zones */}
      {ch > 0 && (
        <NavZone side="left" hint={navHint} ripple={ripple} chapter={chapters[ch - 1]}
          onClick={(e) => handleNavClick(e, "left")} onHover={(s) => setNavHint(s ? "left" : null)} />
      )}
      {ch < chapters.length - 1 && (
        <NavZone side="right" hint={navHint} ripple={ripple} chapter={chapters[ch + 1]}
          onClick={(e) => handleNavClick(e, "right")} onHover={(s) => setNavHint(s ? "right" : null)} />
      )}
    </div>
    </>
  );
}
