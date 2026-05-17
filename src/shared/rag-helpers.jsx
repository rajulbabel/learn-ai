// Shared cross-chapter helpers for Section 12 (Retrieval-Augmented Generation).
// Extracted from src/sections/rag-*.jsx so they can be imported by both the
// current monolithic section files and the future per-chapter files.

import { T } from "../components.jsx";

// === from rag-production.jsx (also used in rag-evaluation.jsx) ===
// Shared helper: a centered, tinted, monospace standalone formula box.
// Used across multiple chapters in Acts 8-10 where standalone formulas appear
// (RAGAS metrics in 12.33 and Caching / CostModels / Observability / Hallucination
// chapters in Acts 9-10).
export const FormulaBox = ({ color, children }) => (
  <div
    style={{
      marginTop: 14,
      padding: 16,
      borderRadius: 8,
      background: `${color}06`,
      border: `1px solid ${color}12`,
      fontFamily: "ui-monospace, SFMono-Regular, monospace",
      fontSize: 16,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

// === from rag-production.jsx ===
// Capstone three-column decision card: Choice / Why / Tradeoff. Used by the
// Section 12 capstone chapter (12.41) to render every framework or stack
// recommendation as a uniform three-up card.
export const CapstoneDecisionCard = ({ color, accent, choice, why, tradeoff }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
    {[
      { title: "Choice", body: choice },
      { title: "Why", body: why },
      { title: "Tradeoff", body: tradeoff },
    ].map((col) => (
      <div
        key={col.title}
        style={{
          padding: 14,
          borderRadius: 8,
          background: `${color}06`,
          border: `1px solid ${color}12`,
          textAlign: "center",
        }}
      >
        <T color={color} bold center size={15}>
          {col.title}
        </T>
        <T color={accent} center size={13} style={{ marginTop: 8 }}>
          {col.body}
        </T>
      </div>
    ))}
  </div>
);
