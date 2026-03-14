import { C } from "./config.js";

// Reusable components
export const Box = ({ children, color = C.cyan, style = {} }) => (
  <div style={{ background: `${color}09`, border: `1px solid ${color}22`, borderRadius: 10, padding: "16px 22px", width: "100%", ...style }}>{children}</div>
);
export const T = ({ children, color = C.mid, size = 19, bold = false, center = false, style = {} }) => (
  <div style={{ color, fontSize: size, fontWeight: bold ? 700 : 400, textAlign: center ? "center" : "left", lineHeight: 1.75, ...style }}>{children}</div>
);
export const Reveal = ({ when, children }) => {
  if (!when) return null;
  return <div data-reveal="true" style={{ width: "100%", animation: "fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>{children}</div>;
};

export const SubBtn = ({ onClick, rippleKey }) => (
  <button data-subbtn="true" onClick={onClick} style={{
    alignSelf: "center", padding: "10px 28px", borderRadius: 8, border: "none",
    background: "rgba(167,139,250,0.15)", color: C.purple,
    cursor: "pointer", fontSize: 18, fontWeight: 600, marginTop: 4,
    position: "relative", overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1, letterSpacing: 0.5,
    animation: "fadeSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
  }}>
    {rippleKey > 0 && <span key={rippleKey} style={{
      position: "absolute", left: "50%", top: "50%",
      width: 180, height: 180, marginLeft: -90, marginTop: -90, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 70%)",
      animation: "navRipple 0.5s ease-out forwards", pointerEvents: "none",
    }} />}
    Continue
  </button>
);


export const Tag = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 5, background: `${color}15`, border: `1px solid ${color}30`, color, fontSize: 16, fontWeight: 600, margin: "1px" }}>{children}</span>
);
