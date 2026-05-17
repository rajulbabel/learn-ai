import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { HNSW_CORPUS_XY, FLAT_GRAPH_EDGES } from "../../shared/vector-graphs.jsx";

// Query position chosen so the top-3 nearest docs in HNSW_CORPUS_XY are {3, 7, 1}.
const HNSW_QUERY_XY = { x: 149, y: 90 };

// Pre-computed Euclidean distances from HNSW_QUERY_XY to each doc (rounded to 1 decimal).
const HNSW_DISTS = {
  1: 87.1,
  7: 86.4,
  3: 40.0,
  4: 136.6,
  5: 135.4,
  2: 221.9,
  8: 282.6,
  10: 318.5,
  6: 267.1,
  9: 403.0,
};

// 3-tier hierarchy view.
const HnswHierarchy = ({ desc, activeL2 = null, activeL1 = null, activeL0 = null, pathDrops = [] }) => {
  const Y2 = 40;
  const Y1 = 130;
  const Y0 = 230;
  const layer2 = [{ id: 1, x: 250 }];
  const layer1 = [
    { id: 1, x: 130 },
    { id: 6, x: 260 },
    { id: 10, x: 390 },
  ];
  const layer0 = [
    { id: 5, x: 75 },
    { id: 1, x: 115 },
    { id: 7, x: 155 },
    { id: 3, x: 195 },
    { id: 4, x: 235 },
    { id: 8, x: 275 },
    { id: 2, x: 315 },
    { id: 6, x: 355 },
    { id: 10, x: 410 },
    { id: 9, x: 450 },
  ];
  const l1Edges = [
    [1, 6],
    [6, 10],
  ];
  const l0Edges = [
    [1, 3],
    [1, 5],
    [1, 7],
    [3, 4],
    [3, 5],
    [3, 7],
    [4, 5],
    [4, 7],
    [7, 2],
    [2, 6],
    [2, 8],
    [6, 8],
    [6, 10],
    [8, 10],
    [6, 9],
    [9, 10],
  ];
  const find = (arr, id) => arr.find((n) => n.id === id);
  return (
    <svg viewBox="0 0 500 280" style={{ width: "100%", maxWidth: 540, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      <defs>
        <marker
          id="hsArrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 8 4, 0 8" fill={C.yellow} />
        </marker>
      </defs>
      <line x1="10" y1={Y2} x2="490" y2={Y2} stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
      <line x1="10" y1={Y1} x2="490" y2={Y1} stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
      <line x1="10" y1={Y0} x2="490" y2={Y0} stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
      <text x="16" y={Y2 - 8} fill={C.red} fontSize="11">
        Layer 2
      </text>
      <text x="16" y={Y1 - 8} fill={C.yellow} fontSize="11">
        Layer 1
      </text>
      <text x="16" y={Y0 + 16} fill={C.cyan} fontSize="11">
        Layer 0
      </text>
      {l1Edges.map(([a, b], i) => {
        const pa = find(layer1, a);
        const pb = find(layer1, b);
        return <line key={`l1e${i}`} x1={pa.x} y1={Y1} x2={pb.x} y2={Y1} stroke={C.yellow} strokeWidth="1.5" />;
      })}
      {l0Edges.map(([a, b], i) => {
        const pa = find(layer0, a);
        const pb = find(layer0, b);
        return (
          <line
            key={`l0e${i}`}
            x1={pa.x}
            y1={Y0}
            x2={pb.x}
            y2={Y0}
            stroke={C.cyan}
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        );
      })}
      {pathDrops.includes("L2L1") && (
        <line x1={layer2[0].x} y1={Y2} x2={find(layer1, activeL1).x} y2={Y1} stroke={C.green} strokeWidth="3" />
      )}
      {pathDrops.includes("L1L0") && (
        <line
          x1={find(layer1, activeL1).x}
          y1={Y1}
          x2={find(layer0, activeL0).x}
          y2={Y0}
          stroke={C.green}
          strokeWidth="3"
        />
      )}
      <line
        x1="450"
        y1="15"
        x2={layer2[0].x + 10}
        y2={Y2 - 8}
        stroke={C.yellow}
        strokeWidth="2"
        markerEnd="url(#hsArrow)"
      />
      <text x="475" y="12" textAnchor="end" fill={C.yellow} fontSize="11" fontFamily="monospace">
        Query
      </text>
      {layer2.map((n) => (
        <g key={`l2n${n.id}`}>
          <circle cx={n.x} cy={Y2} r={12} fill={activeL2 === n.id ? C.green : C.red} stroke={C.red} strokeWidth="1.5" />
          <text x={n.x} y={Y2 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
      {layer1.map((n) => (
        <g key={`l1n${n.id}`}>
          <circle
            cx={n.x}
            cy={Y1}
            r={12}
            fill={activeL1 === n.id ? C.green : C.yellow}
            stroke={C.yellow}
            strokeWidth="1.5"
          />
          <text x={n.x} y={Y1 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
      {layer0.map((n) => (
        <g key={`l0n${n.id}`}>
          <circle
            cx={n.x}
            cy={Y0}
            r={12}
            fill={activeL0 === n.id ? C.green : C.cyan}
            stroke={C.cyan}
            strokeWidth="1.5"
          />
          <text x={n.x} y={Y0 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

// 2D scatter at layer 0 used in search visualization.
const HnswSpatial = ({
  desc,
  distLines = [],
  highlightNodes = [],
  activeNode = null,
  poppedNode = null,
  expansionTo = [],
  width = 540,
}) => {
  const xy = HNSW_CORPUS_XY;
  const q = HNSW_QUERY_XY;
  return (
    <svg viewBox="0 0 540 360" style={{ width: "100%", maxWidth: width, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      {FLAT_GRAPH_EDGES.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={xy[a].x}
          y1={xy[a].y}
          x2={xy[b].x}
          y2={xy[b].y}
          stroke={C.cyan}
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      ))}
      {distLines.map((id) => {
        const p = xy[id];
        return (
          <g key={`dl${id}`}>
            <line
              x1={q.x}
              y1={q.y}
              x2={p.x}
              y2={p.y}
              stroke={C.orange}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.75"
            />
            <text x={(q.x + p.x) / 2 + 8} y={(q.y + p.y) / 2 - 4} fill={C.orange} fontSize="11" fontFamily="monospace">
              {HNSW_DISTS[id].toFixed(1)}
            </text>
          </g>
        );
      })}
      {poppedNode != null &&
        expansionTo.map((id) => {
          const a = xy[poppedNode];
          const b = xy[id];
          return (
            <line
              key={`exp${id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={C.purple}
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
          );
        })}
      {Object.entries(xy).map(([id, p]) => {
        const idN = Number(id);
        const isHi = highlightNodes.includes(idN);
        const isActive = activeNode === idN;
        const isPopped = poppedNode === idN;
        let fill = C.cyan;
        let stroke = C.cyan;
        let r = 11;
        if (isHi) {
          fill = C.green;
          stroke = C.green;
        }
        if (isActive) {
          fill = C.green;
          stroke = C.bright;
          r = 13;
        }
        if (isPopped) {
          fill = C.purple;
          stroke = C.bright;
          r = 13;
        }
        return (
          <g key={`n${id}`}>
            <circle cx={p.x} cy={p.y} r={r} fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
              {id}
            </text>
          </g>
        );
      })}
      <g>
        <circle cx={q.x} cy={q.y} r="9" fill={C.yellow} stroke={C.yellow} />
        <text
          x={q.x}
          y={q.y - 14}
          textAnchor="middle"
          fill={C.yellow}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Query
        </text>
      </g>
    </svg>
  );
};

// Horizontal distance bars
const DISTANCE_BAR_COLORS = { current: C.bright, closer: C.green, farther: C.red, unchanged: C.dim };
const DistanceBars = ({ items, max }) => {
  const colorFor = (role) => DISTANCE_BAR_COLORS[role];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((it) => {
        const col = colorFor(it.role);
        const pct = Math.min(100, (it.dist / max) * 100);
        return (
          <div
            key={`${it.id}-${it.role}`}
            style={{ display: "grid", gridTemplateColumns: "70px 1fr 70px", gap: 8, alignItems: "center" }}
          >
            <T color={col} bold size={13} style={{ fontFamily: "monospace" }}>
              Doc {it.id}
            </T>
            <div style={{ height: 12, background: "rgba(0,0,0,0.4)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: col,
                  opacity: it.role === "current" ? 1 : 0.85,
                }}
              />
            </div>
            <T color={col} size={12} style={{ fontFamily: "monospace", textAlign: "right" }}>
              {it.dist.toFixed(1)}
            </T>
          </div>
        );
      })}
    </div>
  );
};

// Priority-queue UI for the layer-0 beam.
const BeamSlots = ({ items, ef, justInserted = [], popped = null }) => {
  const sorted = [...items].sort((a, b) => a.dist - b.dist);
  const slots = [...sorted];
  while (slots.length < ef) slots.push(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {slots.map((s, i) => {
        const empty = s == null;
        const isInserted = !empty && justInserted.includes(s.id);
        const isPopped = !empty && popped === s.id;
        const col = empty ? C.dim : isPopped ? C.orange : isInserted ? C.green : C.bright;
        const bg = isPopped ? `${C.orange}18` : isInserted ? `${C.green}18` : "rgba(0,0,0,0.3)";
        const status = empty ? "" : isPopped ? "POPPED" : isInserted ? "INSERTED" : "";
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 80px 1fr 70px",
              gap: 8,
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: 6,
              background: bg,
              border: `1px solid ${col}33`,
            }}
          >
            <T color={C.dim} bold size={12} style={{ fontFamily: "monospace" }}>
              #{i + 1}
            </T>
            <T color={col} bold size={14} style={{ fontFamily: "monospace" }}>
              {empty ? "(empty)" : `doc ${s.id}`}
            </T>
            <T color={col} size={11} style={{ fontFamily: "monospace" }}>
              {status}
            </T>
            <T color={col} size={12} style={{ fontFamily: "monospace", textAlign: "right" }}>
              {empty ? "" : `d=${s.dist.toFixed(1)}`}
            </T>
          </div>
        );
      })}
    </div>
  );
};

export default function HNSWSearch(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Step 0: query lands; enter at the top-layer entry point
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            Yellow star is where the query lands in 2D. Brute force would compute 10 distances. HNSW skips that and
            starts at one fixed node: doc 1 in the top layer.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Where the query sits in 2D space
              </T>
              <div style={{ marginTop: 8 }}>
                <HnswSpatial desc="Layer-0 scatter of 10 docs with cyan flat-graph edges drawn faintly. The yellow query star sits in the cat cluster near docs 1, 3, 7." />
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Where HNSW starts the search
              </T>
              <div style={{ marginTop: 8 }}>
                <HnswHierarchy
                  activeL2={1}
                  desc="Three-tier HNSW hierarchy. The yellow query arrow lands at the top layer's entry node (doc 1 at L2), drawn in green. Lower layers are still untouched."
                />
              </div>
            </div>
          </div>
          <T color="#80deea" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            Entry point is fixed: every query starts here. Upper-tier long-range edges close the gap fast.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step 1: greedy descent at L2 - no neighbors, drop
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
            At each layer, look at every neighbor of the current node. If any neighbor is closer to the query, hop
            there. Otherwise drop one layer down. L2 has only doc 1 - zero neighbors at this layer - so we drop.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <HnswHierarchy
                activeL2={1}
                activeL1={1}
                pathDrops={["L2L1"]}
                desc="Greedy descent at L2 has no neighbors to compare; the current node drops vertically along a green edge from L2 doc 1 to L1 doc 1."
              />
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <T color={C.green} bold center size={14}>
                L2 decision
              </T>
              <DistanceBars items={[{ id: 1, dist: HNSW_DISTS[1], role: "current" }]} max={400} />
              <T color={C.dim} size={13} center style={{ fontFamily: "monospace" }}>
                L2 neighbors of doc 1: none
              </T>
              <T color={C.green} bold size={14} center style={{ fontFamily: "monospace" }}>
                No closer neighbor &rarr; drop to L1
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
            }}
          >
            <span style={{ color: C.dim }}>greedy step:</span> while any neighbor n has dist(n, q) &lt; dist(current,
            q): current = n
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Step 2: greedy descent at L1 - neighbors farther, drop again
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 8 }}>
            At L1, doc 1 has one neighbor: doc 6. Compare distances to the query. Doc 6 is far. We stay at doc 1 and
            drop to L0 (the next layer down).
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <HnswHierarchy
                activeL1={1}
                activeL0={1}
                pathDrops={["L2L1", "L1L0"]}
                desc="Descent continues from L1 to L0 along the green vertical edge at doc 1. The L1 neighbor (doc 6) is farther from the query, so the search does not hop sideways."
              />
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <T color={C.yellow} bold center size={14}>
                L1 decision
              </T>
              <DistanceBars
                max={400}
                items={[
                  { id: 1, dist: HNSW_DISTS[1], role: "current" },
                  { id: 6, dist: HNSW_DISTS[6], role: "farther" },
                ]}
              />
              <T color={C.yellow} bold size={14} center style={{ fontFamily: "monospace", marginTop: 6 }}>
                Doc 6 farther &rarr; stay at doc 1 &rarr; drop to L0
              </T>
            </div>
          </div>
          <T color="#ffe082" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            Drops are free. The same node id sits in every layer it was assigned to; only the adjacency list changes.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 3: at L0, switch to beam search (priority queue)
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 8 }}>
            Layer 0 is dense - pure greedy gets stuck. Instead, keep a priority queue of the closest ef_search
            candidates seen so far. ef_search defaults to 50 in production. Visualizing with ef_search = 3 below so the
            queue fits on screen.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={14}>
                Layer 0 - start at doc 1
              </T>
              <div style={{ marginTop: 8 }}>
                <HnswSpatial
                  activeNode={1}
                  desc="Layer-0 scatter with all flat edges visible; doc 1 is highlighted as the entry into the L0 beam search."
                />
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={14}>
                Beam (ef_search = 3 candidates)
              </T>
              <div style={{ marginTop: 10 }}>
                <BeamSlots ef={3} items={[{ id: 1, dist: HNSW_DISTS[1] }]} />
              </div>
              <T color={C.bright} size={12} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                Production default: ef_search = 50
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Step 4: expand the beam - pop, evaluate neighbors, update queue
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            Repeat: pop the unexplored candidate with the smallest distance, look at every neighbor, insert any neighbor
            closer than the worst-in-queue, evict the worst. Stop when a full pass fails to update the top of the queue.
            The best candidate has stopped changing.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Frame A - pop doc 1, expand its neighbors {"{3, 5, 7}"}
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
              <div>
                <HnswSpatial
                  poppedNode={1}
                  expansionTo={[3, 5, 7]}
                  highlightNodes={[3, 7]}
                  distLines={[3, 5, 7]}
                  desc="Frame A of beam expansion. Doc 1 is popped (purple), purple lines connect it to its three layer-0 neighbors 3, 5, 7. Distance dashes show 3 and 7 are close to the query while 5 is far."
                />
              </div>
              <div>
                <BeamSlots
                  ef={3}
                  items={[
                    { id: 3, dist: HNSW_DISTS[3] },
                    { id: 7, dist: HNSW_DISTS[7] },
                    { id: 1, dist: HNSW_DISTS[1] },
                  ]}
                  justInserted={[3, 7]}
                  popped={1}
                />
                <T color="#b8a9ff" size={12} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                  Doc 5 (135.4) rejected: farther than worst-in-queue (87.1)
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Frame B - pop doc 3 (smallest), expand {"{1, 4, 5, 7}"}
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
              <div>
                <HnswSpatial
                  poppedNode={3}
                  expansionTo={[1, 4, 5, 7]}
                  highlightNodes={[3, 7, 1]}
                  distLines={[4]}
                  desc="Frame B of beam expansion. Doc 3 is popped; its neighbors are doc 1, 4, 5, 7. Doc 4's distance dash shows 136.6, farther than worst-in-queue, so 4 is rejected."
                />
              </div>
              <div>
                <BeamSlots
                  ef={3}
                  items={[
                    { id: 3, dist: HNSW_DISTS[3] },
                    { id: 7, dist: HNSW_DISTS[7] },
                    { id: 1, dist: HNSW_DISTS[1] },
                  ]}
                  popped={3}
                />
                <T color="#b8a9ff" size={12} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                  Doc 4 (136.6) rejected; doc 1, 7 already in queue
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Frame C - pop doc 7, expand {"{1, 2, 3, 4}"} - no improvement, converged
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
              <div>
                <HnswSpatial
                  poppedNode={7}
                  expansionTo={[1, 2, 3, 4]}
                  highlightNodes={[3, 7, 1]}
                  distLines={[2]}
                  desc="Frame C of beam expansion. Doc 7 is popped; its neighbors are docs 1, 2, 3, 4. None beat the current worst-in-queue, so the beam top is unchanged. The search converges."
                />
              </div>
              <div>
                <BeamSlots
                  ef={3}
                  items={[
                    { id: 3, dist: HNSW_DISTS[3] },
                    { id: 7, dist: HNSW_DISTS[7] },
                    { id: 1, dist: HNSW_DISTS[1] },
                  ]}
                  popped={7}
                />
                <T color={C.green} bold size={13} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                  Beam top unchanged: best top-3 are now stable, converged
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
            }}
          >
            Beam = priority queue, capacity = <span style={{ color: C.orange }}>ef_search</span>; expand until best in
            queue stops changing
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Step 5: return top-k - trace the full path back to the doc text
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            Take the top k entries of the converged beam. For our query &quot;information about cats&quot; with k = 3,
            the returned docs are 3, 7, 1 - exactly the cat docs.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={14}>
                Final result on the L0 scatter
              </T>
              <div style={{ marginTop: 8 }}>
                <HnswSpatial
                  highlightNodes={[1, 3, 7]}
                  distLines={[1, 3, 7]}
                  desc="Final HNSW search result on the layer-0 scatter. Docs 1, 3, 7 are highlighted in green with their distance dashes from the query, marking the converged top-3."
                />
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <T color={C.red} bold center size={14}>
                End-to-end path &amp; top-3 trace
              </T>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.8,
                }}
              >
                <span style={{ color: C.red }}>L2 doc 1</span> &rarr; <span style={{ color: C.yellow }}>L1 doc 1</span>{" "}
                &rarr; <span style={{ color: C.green }}>L0 beam</span> &rarr; top-3
              </div>
              {[
                { id: 3, dist: HNSW_DISTS[3], text: "Lions are big cats that live in Africa" },
                { id: 7, dist: HNSW_DISTS[7], text: "Kittens grow up to be cats" },
                { id: 1, dist: HNSW_DISTS[1], text: "Cats are small domesticated carnivores" },
              ].map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 60px 1fr",
                    gap: 8,
                    alignItems: "center",
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}33`,
                  }}
                >
                  <T color={C.green} bold size={13} style={{ fontFamily: "monospace" }}>
                    #{i + 1}
                  </T>
                  <T color={C.green} bold size={13} style={{ fontFamily: "monospace" }}>
                    Doc {r.id}
                  </T>
                  <T color={C.bright} size={13}>
                    {r.text} <span style={{ color: C.dim, fontFamily: "monospace" }}>(d={r.dist.toFixed(1)})</span>
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            Same algorithm scales to a billion docs. Only the layer count (about log N) and ef_search change.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn
          key={sub}
          onClick={() => {
            setSubBtnRipple(Date.now());
            navigate("forward");
          }}
          rippleKey={subBtnRipple}
          registerSubBtn={registerSubBtn}
        />
      )}
    </div>
  );
}
