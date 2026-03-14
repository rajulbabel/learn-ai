import { useState, useEffect, useRef } from "react";
import { chapters, partNames, C } from "./config.js";
import { T } from "./components.jsx";

// Chapter imports
import { ChTOC } from "./chapters/toc.jsx";
import { Ch1_1, Ch1_2, Ch1_3, Ch1_4, Ch1_ReLU, Ch1_5, Ch1_6, Ch1_7, Ch1_8, Ch1_9, Ch1_10, Ch1_11, Ch1_12, Ch1_13 } from "./chapters/part1.jsx";
import { Ch2_1, Ch2_2, Ch2_3, Ch2_4, Ch2_5, Ch2_6, Ch2_7 } from "./chapters/part2.jsx";
import { Ch3_1, Ch3_2, Ch3_3, Ch3_4, Ch3_5, Ch3_6, Ch3_7, Ch3_8, Ch3_9, Ch3_10, Ch3_11, Ch3_12, Ch3_13, Ch3_14, Ch3_15, Ch3_16, Ch3_17, Ch3_18, Ch3_19, Ch3_20, Ch3_21, Ch3_22, Ch3_23, Ch3_24, Ch3_25, Ch3_26, Ch3_27 } from "./chapters/part3.jsx";
import { Ch6_1, Ch6_2, Ch6_3, Ch6_4, Ch6_5, Ch6_6 } from "./chapters/part6.jsx";
import { Ch7_1, Ch7_2, Ch7_3, Ch7_4, Ch7_5 } from "./chapters/part7.jsx";

export default function LearnAI() {
  const [ch, setCh] = useState(0);
  const [fade, setFade] = useState(true);
  const [sub, setSub] = useState(0);
  const [maxSubs, setMaxSubs] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  // Lifted state from chapters (so chapter functions have no hooks → can be called as plain functions)
  const [bankIdx, setBankIdx] = useState(0);
  const [hovered, setHovered] = useState(4);
  const [expanded, setExpanded] = useState(null);
  const [navHint, setNavHint] = useState(null); // "left" | "right" | null
  const [ripple, setRipple] = useState(null); // { side, id }
  const [subBtnRipple, setSubBtnRipple] = useState(0);
  const prevChRef = useRef(ch);
  useEffect(() => {
    if (prevChRef.current !== ch) {
      setBankIdx(0);
      setHovered(4);
      setExpanded(null);
      prevChRef.current = ch;
    }
  }, [ch]);

  useEffect(() => {
    if (sub > 0) {
      setTimeout(() => {
        const btn = document.querySelector("[data-subbtn]");
        const target = btn || document.querySelector("[data-reveal]:last-child");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [sub]);

  // Track the actual max sub for each chapter
  useEffect(() => {
    const hasSubBtn = document.querySelector("[data-subbtn]");
    if (!hasSubBtn && sub > 0) {
      setMaxSubs(prev => ({ ...prev, [ch]: sub }));
    }
  }, [sub, ch]);

  // Unified navigation: handles both sub-steps and chapter changes
  const navigate = (direction) => {
    if (transitioning) return;
    if (direction === "forward") {
      const hasSubBtn = document.querySelector("[data-subbtn]");
      if (hasSubBtn) {
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
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        const hasSubBtn = document.querySelector("[data-subbtn]");
        if (hasSubBtn) {
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
  });

  const goTo = (n, startSub = 0) => {
    if (n < 0 || n >= chapters.length || transitioning) return;
    setTransitioning(true);
    setFade(false);
    setTimeout(() => { window.scrollTo({ top: 0 }); setCh(n); setSub(startSub); setFade(true); setTransitioning(false); }, 60);
  };

  // Context object passed to all chapter functions
  const ctx = { sub, setSub, subBtnRipple, setSubBtnRipple, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded };

  const allCh = [ChTOC, Ch1_1, Ch1_2, Ch1_3, Ch1_4, Ch1_ReLU, Ch1_5, Ch1_6, Ch1_7, Ch1_8, Ch1_9, Ch6_1, Ch6_2, Ch6_3, Ch6_4, Ch6_5, Ch6_6, Ch7_1, Ch7_2, Ch7_3, Ch7_4, Ch7_5, Ch1_10, Ch1_11, Ch1_12, Ch1_13, Ch2_1, Ch2_2, Ch2_3, Ch2_4, Ch2_5, Ch2_6, Ch2_7, Ch3_1, Ch3_2, Ch3_3, Ch3_4, Ch3_5, Ch3_6, Ch3_7, Ch3_8, Ch3_12, Ch3_9, Ch3_10, Ch3_11, Ch3_13, Ch3_14, Ch3_27, Ch3_15, Ch3_16, Ch3_17, Ch3_18, Ch3_19, Ch3_20, Ch3_21, Ch3_22, Ch3_23, Ch3_24, Ch3_25, Ch3_26];

  const handleNavClick = (e, side) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, side, id: Date.now() });
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
      <h1 style={{
        fontSize: 29, fontWeight: 800, margin: "0 0 2px", textAlign: "center",
        background: "linear-gradient(135deg, #ff6b6b, #a78bfa, #00e676, #00b8d4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Learn AI</h1>
      <T color={C.dim} size={14} center>The complete visual guide to understanding AI - from scratch</T>

      {/* Per-part progress */}
      {ch > 0 && (() => {
        const partColors = { 1: C.red, 2: C.cyan, 3: C.yellow, 4: C.purple, 5: C.orange, 6: C.green, 7: C.pink };
        const curPart = chapters[ch].part;
        const partChs = chapters.filter(c => c.part === curPart);
        const idxInPart = partChs.findIndex(c => c.id === chapters[ch].id);
        const pct = Math.round(((idxInPart + 1) / partChs.length) * 100);
        const pc = partColors[curPart] || C.purple;
        return (
          <div style={{ width: "100%", maxWidth: 800, margin: "14px 0 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span onClick={() => goTo(0)} style={{ fontSize: 12, color: C.dim, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>Table of Contents</span>
              <T color={pc} size={12} bold center>Part {curPart}: {partNames[curPart]}</T>
              <span style={{ fontSize: 12, color: `${pc}99`, flexShrink: 0 }}>{idxInPart + 1}/{partChs.length} - {pct}%</span>
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
        <T color={C.dim} size={14} center style={{ margin: "6px 0 10px" }}>{Object.keys(partNames).length - 1} Parts · {chapters.length - 1} Chapters</T>
      )}

      <div style={{
        width: "100%", maxWidth: 840,
        opacity: fade ? 1 : 0,
        transform: fade ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.05s ease-out, transform 0.06s ease-out",
      }}>
        {allCh[ch](ctx)}
      </div>

      {/* Tap-to-navigate zones - left = prev, right = next */}
      {ch > 0 && <div
        onMouseEnter={() => setNavHint("left")}
        onMouseLeave={() => setNavHint(n => n === "left" ? null : n)}
        onClick={(e) => handleNavClick(e, "left")}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "7%",
          cursor: "pointer", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "flex-start",
          transition: "background 0.3s ease",
        }}
      >
        <div style={{
          position: "absolute", top: "-10%", bottom: "-10%", left: "-300%", right: "10%",
          borderRadius: "50%",
          background: navHint === "left"
            ? "linear-gradient(to right, transparent 94%, rgba(167,139,250,0.08) 100%)"
            : "linear-gradient(to right, transparent 94%, rgba(167,139,250,0.03) 100%)",
          transition: "background 0.3s ease", pointerEvents: "none",
        }} />
        {ripple && ripple.side === "left" && <div key={ripple.id} style={{
          position: "absolute", left: -200, top: "50%",
          width: 400, height: 400, marginTop: -200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
          animation: "navRipple 0.6s ease-out forwards", pointerEvents: "none",
        }} />}
        <div style={{
          position: "relative", zIndex: 1,
          opacity: navHint === "left" ? 1 : 0.5,
          transition: "opacity 0.2s ease",
          padding: "16px 6px 16px 6px",
          display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
        }}>
          <span style={{ fontSize: 18, color: "rgba(167,139,250,0.7)" }}>{"\u2190"}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, textTransform: "uppercase" }}>Previous</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(167,139,250,0.7)", lineHeight: 1.3, wordBreak: "break-word" }}>{chapters[ch - 1]?.title}</span>
        </div>
      </div>}
      {ch < chapters.length - 1 && <div
        onMouseEnter={() => setNavHint("right")}
        onMouseLeave={() => setNavHint(n => n === "right" ? null : n)}
        onClick={(e) => handleNavClick(e, "right")}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "7%",
          cursor: "pointer", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          transition: "background 0.3s ease",
        }}
      >
        <div style={{
          position: "absolute", top: "-10%", bottom: "-10%", left: "10%", right: "-300%",
          borderRadius: "50%",
          background: navHint === "right"
            ? "linear-gradient(to left, transparent 94%, rgba(167,139,250,0.08) 100%)"
            : "linear-gradient(to left, transparent 94%, rgba(167,139,250,0.03) 100%)",
          transition: "background 0.3s ease", pointerEvents: "none",
        }} />
        {ripple && ripple.side === "right" && <div key={ripple.id} style={{
          position: "absolute", right: -200, top: "50%",
          width: 400, height: 400, marginTop: -200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
          animation: "navRipple 0.6s ease-out forwards", pointerEvents: "none",
        }} />}
        <div style={{
          position: "relative", zIndex: 1,
          opacity: navHint === "right" ? 1 : 0.5,
          transition: "opacity 0.2s ease",
          padding: "16px 6px 16px 6px",
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4,
        }}>
          <span style={{ fontSize: 18, color: "rgba(167,139,250,0.7)" }}>{"\u2192"}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, textTransform: "uppercase" }}>Next</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(167,139,250,0.7)", lineHeight: 1.3, textAlign: "right", wordBreak: "break-word" }}>{chapters[ch + 1]?.title}</span>
        </div>
      </div>}
    </div>
    </>
  );
}
