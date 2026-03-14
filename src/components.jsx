import { Component, useEffect } from "react";
import { C } from "./config.js";

// Error boundary - catches chapter render crashes
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey) this.setState({ error: null });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.red, marginBottom: 12 }}>Something went wrong</div>
          <div style={{ fontSize: 15, color: C.dim, marginBottom: 16 }}>{this.state.error.message}</div>
          <button onClick={() => this.setState({ error: null })} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: "rgba(167,139,250,0.15)", color: C.purple,
            cursor: "pointer", fontSize: 15, fontWeight: 600,
          }}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

export const SubBtn = ({ onClick, rippleKey, registerSubBtn }) => {
  // Notify parent that a SubBtn is mounted (used for keyboard nav instead of DOM queries)
  useEffect(() => {
    if (registerSubBtn) registerSubBtn(true);
    return () => { if (registerSubBtn) registerSubBtn(false); };
  }, [registerSubBtn]);
  return (
  <button data-subbtn="true" onClick={onClick} aria-label="Continue to next step" style={{
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
};


export const Tag = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 5, background: `${color}15`, border: `1px solid ${color}30`, color, fontSize: 16, fontWeight: 600, margin: "1px" }}>{children}</span>
);
