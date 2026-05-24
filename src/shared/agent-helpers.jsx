// Shared cross-chapter helpers for Section 13 (AI Agents).
// Extracted from the agent chapter files so they can be imported across chapters.
//
// Pure data constants used by exactly one chapter intentionally stay local
// in their origin file. Only component-style helpers and cross-chapter symbols
// live here.

import { DIM_BG, DIM_BORDER, tintedCard } from "./agent-styles.jsx";

// === from agent-tools.jsx (used in ToolCallLifecycle / 13.9) ===
// Component-style helper: renders a JSON snippet with per-field line coloring.
// Walks the string line-by-line; when a line contains `"<field.key>"`, the line
// is colored with that field's soft accent. Otherwise the default `soft` color
// applies. Lives here because it's a self-contained component-style helper
// (form follows the same rule used for FormulaBox / CapstoneDecisionCard).
export const HighlightedJson = ({ json, fields, soft }) => {
  // Build segments: walk the string, when we hit a field name in quotes, color the line.
  const lines = json.split("\n");
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 6,
        background: DIM_BG,
        border: `1px solid ${DIM_BORDER}`,
        fontFamily: "monospace",
        fontSize: 14,
        color: soft,
        whiteSpace: "pre",
        textAlign: "left",
        overflowX: "auto",
      }}
    >
      {lines.map((line, i) => {
        const match = fields.find((f) => line.includes(`"${f.key}"`));
        if (match) {
          return (
            <div key={i} style={{ color: match.soft }}>
              {line}
            </div>
          );
        }
        return (
          <div key={i} style={{ color: soft }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

// === from agent-loops.jsx (used in ReActPattern / 13.21) ===
// Style helper: a centered, monospaced, tinted card style. Sibling to
// `tintedCard` / `pill` in agent-styles.jsx - kept here (not there) because
// it composes tintedCard rather than being a base palette primitive.
// Use as `style={{ ...monoArtifact(C.yellow), marginTop: 12 }}`.
export const monoArtifact = (color, extra = {}) => ({
  ...tintedCard(color),
  padding: 14,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  textAlign: "center",
  ...extra,
});
