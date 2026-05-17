// Lighter text shades used inside tinted panels - keyed by C palette name.
// Add new entries here when introducing a new accent color in this section file.
export const SOFT = {
  cyan: "#80deea",
  blue: "#90caf9",
  purple: "#b8a9ff",
  indigo: "#b39ddb",
  teal: "#80cbc4",
  green: "#a5d6a7",
  yellow: "#ffe082",
  orange: "#ffcc80",
  pink: "#f8bbd0",
  red: "#ef9a9a",
  amber: "#ffd54f",
};

// Greyed-out / disabled-state shades. Used when a row/chip is "cut" or "below threshold".
export const DIM_BG = "#1b1b22";
export const DIM_BORDER = "#33333a";

// Standard tinted-card style. Use as `style={{ ...tintedCard(C.cyan), padding: 12 }}`.
export const tintedCard = (color) => ({
  background: `${color}06`,
  border: `1px solid ${color}12`,
  borderRadius: 8,
  textAlign: "center",
});

// Standard uppercase pill / badge style. Use as `<span style={pill(C.cyan)}>SYSTEM</span>`.
// The badge text inside should be UPPERCASE for visual rhythm with the chapter pattern.
export const pill = (color) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 4,
  background: `${color}20`,
  color,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.5,
});
