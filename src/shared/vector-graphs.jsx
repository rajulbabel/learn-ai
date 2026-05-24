import { C } from "../config.js";

// Shared vector-database graph helpers used across multiple chapters in Section 11
// (vector-foundations). Extracted so per-chapter files (T24) can import only the
// helpers they need without dragging the entire section file.

export const fmtVec = (v) => `[${v.map((x) => x.toFixed(2)).join(", ")}]`;

// 2D scatter coordinates reused across 11.5-11.9 diagrams. Cat docs (1, 3, 4, 5, 7)
// cluster in the upper-left; the query lands inside the cat cluster. Non-cat docs spread
// across other regions so k-means produces three separable clusters in the IVF chapter.
// Three tight visual clusters so the IVF illustrations clearly show
// three groups: cats in upper-left, dogs in upper-right, other in lower-right.
// Each cluster is a compact ~55-pixel blob so it reads as one cloud, not two.
export const CORPUS_XY = {
  1: { x: 80, y: 100 },
  7: { x: 150, y: 100 },
  5: { x: 95, y: 135 },
  3: { x: 150, y: 140 },
  4: { x: 125, y: 155 },
  2: { x: 325, y: 80 },
  8: { x: 365, y: 115 },
  10: { x: 405, y: 215 },
  9: { x: 410, y: 265 },
  6: { x: 350, y: 240 },
};
export const QUERY_XY = { x: 55, y: 55 };

// Triangle SVG reused in sub=0 (plain) and sub=5 (with directional labels).
// vertices: Recall (top), Latency (bottom-left), Memory (bottom-right).
export const Triangle = ({ annotations = [] }) => (
  <svg viewBox="0 0 420 280" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block" }}>
    <desc>
      Equilateral tradeoff triangle with Recall at the top vertex, Latency at the bottom-left vertex, and Memory at the
      bottom-right vertex. Every vector-database decision moves along an edge of this triangle - improving one corner
      trades against another.
    </desc>
    <polygon points="210,30 50,240 370,240" fill="rgba(167,139,250,0.06)" stroke={C.purple} strokeWidth="2" />
    {/* Recall vertex (top) */}
    <circle cx="210" cy="30" r="8" fill={C.cyan} />
    <text x="210" y="20" textAnchor="middle" fill={C.cyan} fontSize="15" fontWeight="bold">
      Recall
    </text>
    {/* Latency vertex (bottom-left) */}
    <circle cx="50" cy="240" r="8" fill={C.orange} />
    <text x="50" y="262" textAnchor="middle" fill={C.orange} fontSize="15" fontWeight="bold">
      Latency
    </text>
    {/* Memory vertex (bottom-right) */}
    <circle cx="370" cy="240" r="8" fill={C.yellow} />
    <text x="370" y="262" textAnchor="middle" fill={C.yellow} fontSize="15" fontWeight="bold">
      Memory
    </text>
    {annotations.map((a, i) => (
      <g key={i}>
        <text x={a.x} y={a.y} textAnchor="middle" fill={a.color} fontSize="12" fontWeight="bold">
          {a.label}
        </text>
      </g>
    ))}
  </svg>
);

// Three k-means clusters used across 11.5 IVF visuals.
// Cluster A holds the 5 cat-related docs; B holds the two dog docs; C holds birds/fish/python.
export const IVF_CLUSTERS = [
  { id: "A", color: C.purple, light: "#b8a9ff", centroid: { x: 125, y: 125 }, docs: [1, 3, 4, 5, 7], label: "cats" },
  { id: "B", color: C.yellow, light: "#ffe082", centroid: { x: 345, y: 97 }, docs: [2, 8], label: "dogs" },
  { id: "C", color: C.cyan, light: "#80deea", centroid: { x: 390, y: 240 }, docs: [6, 9, 10], label: "other" },
];

export const docCluster = (docId) => IVF_CLUSTERS.find((c) => c.docs.includes(docId));

// Small scatter SVG used in sub=0 through sub=3 of 11.5 and reused in 11.6/11.8/11.9.
// Variant controls what's drawn (clusters, cells, probe arrows). Kept local to this file
// because the rendering concerns are IVF-specific and we do not want to expand components.jsx.
export const IVFScatter = ({
  variant, // "bare" | "clustered" | "cells" | "probe"
  nprobe = 1,
  desc,
  showQuery = true,
}) => {
  const probedClusters = IVF_CLUSTERS.slice(0, nprobe).map((c) => c.id);
  return (
    <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      {/* Cell polygons (approximate Voronoi) */}
      {(variant === "cells" || variant === "probe") &&
        IVF_CLUSTERS.map((cl) => {
          const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
          const fill = isProbed ? `${cl.color}12` : `${cl.color}04`;
          const stroke = isProbed ? `${cl.color}55` : `${cl.color}22`;
          const rectBounds = {
            A: { x: 25, y: 25, w: 210, h: 145 },
            B: { x: 235, y: 25, w: 145, h: 145 },
            C: { x: 235, y: 170, w: 245, h: 140 },
          }[cl.id];
          const leftover = cl.id === "A" ? { x: 25, y: 170, w: 210, h: 140 } : null;
          return (
            <g key={cl.id}>
              <rect {...rectBounds} fill={fill} stroke={stroke} strokeDasharray="4 4" />
              {leftover && <rect {...leftover} fill={fill} stroke={stroke} strokeDasharray="4 4" />}
            </g>
          );
        })}
      {/* Arrows from query to every dot for bare brute-force view.
          Both endpoints inset past the circle radii so the line stops visibly short
          of the node edge. Doc circles are opaque, so any portion of a line that
          would cross another node is hidden behind the node's fill. */}
      {variant === "bare" &&
        Object.entries(CORPUS_XY).map(([id, p]) => {
          const dx = p.x - QUERY_XY.x;
          const dy = p.y - QUERY_XY.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const qr = 11; // query radius (8) + 3 visible gap
          const pr = 13; // doc radius (10) + 3 visible gap
          return (
            <line
              key={id}
              x1={QUERY_XY.x + ux * qr}
              y1={QUERY_XY.y + uy * qr}
              x2={p.x - ux * pr}
              y2={p.y - uy * pr}
              stroke={C.red}
              strokeWidth="1"
              strokeOpacity="0.55"
            />
          );
        })}
      {/* Arrow from query to nearest centroid for probe view.
          Endpoints inset past the query circle and the centroid square so the arrow
          is entirely between them and clearly visible as a standalone element. */}
      {variant === "probe" &&
        (() => {
          const cx = IVF_CLUSTERS[0].centroid.x;
          const cy = IVF_CLUSTERS[0].centroid.y;
          const dx = cx - QUERY_XY.x;
          const dy = cy - QUERY_XY.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const qr = 11; // query circle radius + gap
          const sr = 14; // centroid square half + gap
          return (
            <>
              <defs>
                <marker
                  id="ivfProbeArrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 8 4, 0 8" fill={C.orange} />
                </marker>
              </defs>
              <line
                x1={QUERY_XY.x + ux * qr}
                y1={QUERY_XY.y + uy * qr}
                x2={cx - ux * sr}
                y2={cy - uy * sr}
                stroke={C.orange}
                strokeWidth="1.8"
                markerEnd="url(#ivfProbeArrow)"
              />
            </>
          );
        })()}
      {/* Doc dots, colored per variant. Bare-variant uses an OPAQUE dark fill so
          the brute-force lines cannot visually pass through any node. */}
      {Object.entries(CORPUS_XY).map(([id, p]) => {
        const cl = docCluster(Number(id));
        const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
        let fill = "#12121a"; // opaque, slightly lighter than page bg
        let stroke = "rgba(255,255,255,0.65)";
        let isBare = variant === "bare";
        if (variant === "clustered" || variant === "cells" || variant === "probe") {
          fill = isProbed ? cl.color : `${cl.color}33`;
          stroke = isProbed ? cl.color : `${cl.color}55`;
        }
        return (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r={10} fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill={isBare ? "rgba(255,255,255,0.95)" : "#08080d"}
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        );
      })}
      {/* Centroid squares for clustered and later */}
      {(variant === "clustered" || variant === "cells" || variant === "probe") &&
        IVF_CLUSTERS.map((cl) => {
          const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
          const fill = isProbed ? cl.color : `${cl.color}55`;
          return (
            <g key={cl.id}>
              <rect
                x={cl.centroid.x - 10}
                y={cl.centroid.y - 10}
                width="20"
                height="20"
                fill={fill}
                stroke="#08080d"
                strokeWidth="2"
              />
              <text
                x={cl.centroid.x}
                y={cl.centroid.y + 4}
                textAnchor="middle"
                fill="#08080d"
                fontSize="11"
                fontWeight="bold"
              >
                {cl.id}
              </text>
            </g>
          );
        })}
      {/* Query dot */}
      {showQuery && (
        <g>
          <circle cx={QUERY_XY.x} cy={QUERY_XY.y} r={8} fill={C.yellow} stroke={C.yellow} />
          <text
            x={QUERY_XY.x}
            y={QUERY_XY.y - 12}
            textAnchor="middle"
            fill={C.yellow}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Query
          </text>
        </g>
      )}
    </svg>
  );
};

// Dedicated layout for HNSW diagrams (11.7-11.9). Chosen so the 3-NN proximity
// graph draws with zero edge crossings in 2D. Separate from CORPUS_XY because
// those visuals don't draw edges while HNSW diagrams do.
export const HNSW_CORPUS_XY = {
  1: { x: 68, y: 58 },
  7: { x: 230, y: 60 },
  3: { x: 150, y: 130 },
  4: { x: 230, y: 200 },
  5: { x: 70, y: 200 },
  2: { x: 370, y: 70 },
  8: { x: 420, y: 170 },
  10: { x: 430, y: 240 },
  6: { x: 370, y: 240 },
  9: { x: 480, y: 320 },
};

// Edges of the flat proximity graph derived from HNSW_CORPUS_XY as the symmetric
// union of each node's 3 nearest neighbors by squared distance. Because the graph
// is undirected, some nodes end up with 4 edges (a neighbor chose them reciprocally)
// - this matches real HNSW behavior where M is the per-insert bound, not a hard
// per-node cap. Reused in 11.7 sub=0/1 (flat) and 11.8/11.9 (layered).
export const computeFlatEdges = (xy) => {
  const ids = Object.keys(xy).map(Number);
  const edges = new Set();
  for (const a of ids) {
    const ranked = ids
      .filter((b) => b !== a)
      .map((b) => {
        const dx = xy[a].x - xy[b].x;
        const dy = xy[a].y - xy[b].y;
        return { b, d2: dx * dx + dy * dy };
      })
      .sort((x, y) => x.d2 - y.d2)
      .slice(0, 3);
    for (const { b } of ranked) {
      const [lo, hi] = a < b ? [a, b] : [b, a];
      edges.add(`${lo}-${hi}`);
    }
  }
  return [...edges].map((k) => k.split("-").map(Number));
};
export const FLAT_GRAPH_EDGES = computeFlatEdges(HNSW_CORPUS_XY);

// Upper-layer hubs for 11.7 sub=2/3 diagrams.
// Layer 1 (yellow) = a few nodes that bridge the scatter with long edges.
// Layer 2 (red) = top hub(s) for global entry.
export const HNSW_LAYER_1 = [1, 6, 10];
export const HNSW_LAYER_2 = [1];

export const HNSWLayeredGraph = ({
  mode, // "flat" | "slowGreedy" | "hubLayer" | "twoLayers"
  desc,
  highlightPath = [],
}) => {
  // For mode "slowGreedy", trace a long flat-graph path from doc 10 to doc 1
  const slowPath =
    mode === "slowGreedy"
      ? [
          [10, 9],
          [9, 6],
          [6, 10],
          [10, 8],
          [8, 2],
          [2, 7],
          [7, 1],
        ]
      : [];
  const hubEdges =
    mode === "hubLayer" || mode === "twoLayers"
      ? [
          [1, 6],
          [6, 10],
          [1, 10],
        ]
      : [];
  // Per-mode vertical layout so hub rows never touch their flat-layer copies and
  // the lowest doc in HNSW_CORPUS_XY is not clipped by the viewBox.
  const layered = mode === "hubLayer" || mode === "twoLayers";
  const flatOffsetY = mode === "twoLayers" ? 100 : mode === "hubLayer" ? 80 : 0;
  const hubY = mode === "twoLayers" ? 110 : 90;
  const layer2Y = 40;
  const maxHnswY = Math.max(...Object.values(HNSW_CORPUS_XY).map((p) => p.y));
  const maxFlatY = maxHnswY + flatOffsetY + 20;
  const vbH = layered ? Math.max(360, maxFlatY + 20) : Math.max(360, maxFlatY + 20);
  return (
    <svg viewBox={`0 0 500 ${vbH}`} style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      {mode === "twoLayers" && (
        <>
          <line
            x1="10"
            y1={layer2Y - 10}
            x2="490"
            y2={layer2Y - 10}
            stroke={C.red}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <line
            x1="10"
            y1={hubY - 20}
            x2="490"
            y2={hubY - 20}
            stroke={C.yellow}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text x="20" y={layer2Y - 18} fill={C.red} fontSize="11" fontWeight="bold">
            Layer 2 (hubs of hubs)
          </text>
          <text x="20" y={hubY - 28} fill={C.yellow} fontSize="11" fontWeight="bold">
            Layer 1 (hubs)
          </text>
          <text x="20" y={vbH - 10} fill={C.cyan} fontSize="11" fontWeight="bold">
            Layer 0 (everything)
          </text>
        </>
      )}
      {mode === "hubLayer" && (
        <>
          <line
            x1="10"
            y1={hubY - 30}
            x2="490"
            y2={hubY - 30}
            stroke={C.yellow}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text x="20" y={hubY - 38} fill={C.yellow} fontSize="11" fontWeight="bold">
            Layer 1 (hubs)
          </text>
          <text x="20" y={vbH - 10} fill={C.cyan} fontSize="11" fontWeight="bold">
            Layer 0 (everything)
          </text>
        </>
      )}
      {/* Baseline flat edges - shifted down by flatOffsetY in layered modes */}
      {FLAT_GRAPH_EDGES.map(([a, b], i) => {
        const pa = HNSW_CORPUS_XY[a];
        const pb = HNSW_CORPUS_XY[b];
        return (
          <line
            key={`e${i}`}
            x1={pa.x}
            y1={pa.y + flatOffsetY}
            x2={pb.x}
            y2={pb.y + flatOffsetY}
            stroke={C.cyan}
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Slow-greedy path (only in non-layered modes) */}
      {slowPath.map(([a, b], i) => (
        <line
          key={`sp${i}`}
          x1={HNSW_CORPUS_XY[a].x}
          y1={HNSW_CORPUS_XY[a].y}
          x2={HNSW_CORPUS_XY[b].x}
          y2={HNSW_CORPUS_XY[b].y}
          stroke={C.red}
          strokeWidth="2.5"
          strokeDasharray={i < 3 ? "4 4" : ""}
        />
      ))}
      {/* Hub layer long-range edges - drawn between hub-row copies */}
      {hubEdges.map(([a, b], i) => {
        const pa = HNSW_CORPUS_XY[a];
        const pb = HNSW_CORPUS_XY[b];
        return <line key={`h${i}`} x1={pa.x} y1={hubY} x2={pb.x} y2={hubY} stroke={C.yellow} strokeWidth="2.5" />;
      })}
      {/* Layer 2 top hub */}
      {mode === "twoLayers" &&
        HNSW_LAYER_2.map((id) => (
          <g key={`l2${id}`}>
            <circle cx={HNSW_CORPUS_XY[id].x} cy={layer2Y} r={10} fill={C.red} stroke={C.red} />
            <text
              x={HNSW_CORPUS_XY[id].x}
              y={layer2Y + 4}
              textAnchor="middle"
              fill="#08080d"
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        ))}
      {/* Flat-layer dots (layer 0) */}
      {Object.entries(HNSW_CORPUS_XY).map(([id, p]) => {
        const isHub = HNSW_LAYER_1.includes(Number(id));
        const onPath = highlightPath.includes(Number(id));
        const color = onPath ? C.green : isHub && layered ? C.yellow : C.cyan;
        return (
          <g key={`n${id}`}>
            <circle cx={p.x} cy={p.y + flatOffsetY} r={10} fill={color} stroke={color} />
            <text x={p.x} y={p.y + flatOffsetY + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
              {id}
            </text>
          </g>
        );
      })}
      {/* Hub-layer copies of the three hub docs */}
      {layered &&
        HNSW_LAYER_1.map((id) => (
          <g key={`l1${id}`}>
            <circle cx={HNSW_CORPUS_XY[id].x} cy={hubY} r={10} fill={C.yellow} stroke={C.yellow} />
            <text
              x={HNSW_CORPUS_XY[id].x}
              y={hubY + 4}
              textAnchor="middle"
              fill="#08080d"
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        ))}
    </svg>
  );
};
