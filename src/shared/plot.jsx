import { C } from "../config.js";

// Graph helper - extracted for testability
export const Graph = ({
  points,
  color,
  width = 300,
  height = 140,
  xLabel = "",
  yLabel = "",
  title = "",
  desc = "",
  annotations = [],
}) => {
  const pad = { l: 36, r: 12, t: 24, b: 32 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const scaleX = (x) => pad.l + ((x - minX) / (maxX - minX || 1)) * w;
  const scaleY = (y) => pad.t + h - ((y - minY) / (maxY - minY || 1)) * h;
  const polyline = points.map((p) => `${scaleX(p[0])},${scaleY(p[1])}`).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {desc && <desc>{desc}</desc>}
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1={pad.l} y1={pad.t + h} x2={pad.l + w} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {minY < 0 && maxY > 0 && (
        <line
          x1={pad.l}
          y1={scaleY(0)}
          x2={pad.l + w}
          y2={scaleY(0)}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      )}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={scaleX(p[0])} cy={scaleY(p[1])} r="3.5" fill={color} />
      ))}
      {xLabel && (
        <text x={pad.l + w / 2} y={height - 2} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={4}
          y={pad.t + h / 2}
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          textAnchor="middle"
          transform={`rotate(-90, 4, ${pad.t + h / 2})`}
        >
          {yLabel}
        </text>
      )}
      {title && (
        <text x={pad.l + w / 2} y={18} fill={color} fontSize="11" textAnchor="middle" fontWeight="700">
          {title}
        </text>
      )}
      {points
        .filter((_, i) => i % (points.length > 10 ? 2 : 1) === 0)
        .map((p, i) => (
          <text
            key={`x${i}`}
            x={scaleX(p[0])}
            y={pad.t + h + 16}
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            textAnchor="middle"
          >
            {p[0]}
          </text>
        ))}
      {annotations.map(({ x, y, text: t, color: ac }, i) => (
        <g key={`a${i}`}>
          <circle cx={scaleX(x)} cy={scaleY(y)} r="6" fill="none" stroke={ac || C.yellow} strokeWidth="1.5" />
          <text x={scaleX(x) + 10} y={scaleY(y) - 8} fill={ac || C.yellow} fontSize="9" fontWeight="600">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
};
