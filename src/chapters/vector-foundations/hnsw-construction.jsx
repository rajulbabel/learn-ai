import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { HNSW_CORPUS_XY, FLAT_GRAPH_EDGES } from "../../shared/vector-graphs.jsx";

const CAT_CORPUS = [
  { id: 1, text: "Cats are small domesticated carnivores", vec: [0.81, 0.12, 0.45, 0.22], catLike: true },
  { id: 2, text: "Dogs are loyal pets", vec: [0.33, 0.68, 0.29, 0.41] },
  { id: 3, text: "Lions are big cats that live in Africa", vec: [0.76, 0.18, 0.52, 0.31], catLike: true },
  { id: 4, text: "My cat sat on the mat", vec: [0.72, 0.22, 0.48, 0.26], catLike: true },
  { id: 5, text: "Tigers are striped cats", vec: [0.79, 0.15, 0.41, 0.28], catLike: true },
  { id: 6, text: "Python is a programming language", vec: [0.09, 0.88, 0.12, 0.74] },
  { id: 7, text: "Kittens grow up to be cats", vec: [0.83, 0.1, 0.47, 0.19], catLike: true },
  { id: 8, text: "The dog chased the cat", vec: [0.55, 0.44, 0.36, 0.39] },
  { id: 9, text: "Birds can fly", vec: [0.18, 0.31, 0.74, 0.62] },
  { id: 10, text: "Fish live underwater", vec: [0.21, 0.29, 0.68, 0.81] },
];

// 2D position of the hypothetical new doc being inserted in the sub=3 storyboard.
const HNSW_INSERT_NEW_XY = { x: 260, y: 110 };

// Pre-computed Euclidean distances from HNSW_INSERT_NEW_XY to each existing doc.
const HNSW_INSERT_DISTS = {
  7: 58.3,
  4: 94.9,
  3: 111.8,
  2: 117.0,
  6: 170.6,
  8: 171.0,
  1: 199.0,
  5: 210.2,
  10: 213.6,
  9: 304.0,
};

// Deterministic per-doc layer assignments for the walkthrough.
const HNSW_INSERT_ORDER = [
  { id: 1, L: 2, u: 0.01, neighbors: [] },
  { id: 6, L: 1, u: 0.07, neighbors: [1] },
  { id: 7, L: 0, u: 0.45, neighbors: [1] },
  { id: 3, L: 0, u: 0.31, neighbors: [1, 7] },
  { id: 5, L: 0, u: 0.55, neighbors: [1, 7, 3] },
  { id: 4, L: 0, u: 0.78, neighbors: [5, 3] },
  { id: 2, L: 0, u: 0.63, neighbors: [1, 7] },
  { id: 8, L: 0, u: 0.82, neighbors: [2, 4] },
  { id: 10, L: 0, u: 0.68, neighbors: [6] },
  { id: 9, L: 0, u: 0.92, neighbors: [10, 6] },
];

export default function HNSWConstruction(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Start empty; insert one vector at a time
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before any queries, we build the graph. Insertion is incremental - one vector at a time. The very first doc
            has no one to connect to, so it becomes the graph&apos;s entry point at whatever layer the layer formula
            assigns it.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <svg viewBox="0 0 400 180" style={{ width: "100%", maxWidth: 400, height: "auto", display: "block" }}>
              <desc>
                First vector inserted into an empty HNSW graph: a single cyan dot labeled doc 1, marked as the
                graph&apos;s entry point. No edges, no neighbors yet.
              </desc>
              <line x1="10" y1="40" x2="390" y2="40" stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
              <line x1="10" y1="90" x2="390" y2="90" stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
              <line x1="10" y1="150" x2="390" y2="150" stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
              <text x="16" y="32" fill={C.red} fontSize="11">
                Layer 2
              </text>
              <text x="16" y="82" fill={C.yellow} fontSize="11">
                Layer 1
              </text>
              <text x="16" y="168" fill={C.cyan} fontSize="11">
                Layer 0
              </text>
              <circle cx="200" cy="150" r="12" fill={C.cyan} />
              <text x="200" y="154" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                1
              </text>
              <text x="200" y="130" textAnchor="middle" fill={C.cyan} fontSize="11" fontFamily="monospace">
                Entry point (L = 0 in this example)
              </text>
            </svg>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The entry point is important: every future query starts from whichever doc currently sits in the top layer.
            As more docs are inserted, upper-layer residents can get replaced.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Layer assignment: one sample from an exponential distribution
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Every inserted vector is placed at a random layer L. The assignment is not uniform - it is drawn from an
            exponential distribution so that the upper layers stay sparse. HNSW uses this exact formula in the original
            paper:
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 18,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            <span style={{ color: C.green }}>u</span> = <span style={{ color: C.green }}>uniform(0, 1)</span>{" "}
            <span style={{ color: C.dim, fontSize: 14 }}>&larr; random number between 0 and 1</span>
            <br />
            <span style={{ color: C.purple }}>L</span> = <span style={{ color: C.yellow }}>floor</span>(&minus;
            <span style={{ color: C.yellow }}>ln</span>(<span style={{ color: C.green }}>u</span>) &middot;{" "}
            <span style={{ color: C.cyan }}>mL</span>)
            <br />
            <span style={{ color: C.dim, fontSize: 14 }}>
              ML = 1 / ln(M) &asymp; 0.36 &larr; level multiplier (thins upper layers)
            </span>
            <br />
            <span style={{ color: C.dim, fontSize: 14 }}>M = max neighbors per node (16)</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Example: u = 0.7
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.9,
                  textAlign: "center",
                }}
              >
                &minus;ln(0.7) = 0.357
                <br />
                0.357 &middot; 0.36 = 0.128
                <br />
                floor(0.128) = <span style={{ color: C.green }}>L = 0</span>
              </div>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                Nearly any random u lands at layer 0.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Example: u = 0.01
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.9,
                  textAlign: "center",
                }}
              >
                &minus;ln(0.01) = 4.605
                <br />
                4.605 &middot; 0.36 = 1.658
                <br />
                floor(1.658) = <span style={{ color: C.yellow }}>L = 1</span>
              </div>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                Only rare, extreme u values get promoted to layer 1 or higher.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This asymmetric distribution is the whole reason upper layers stay small. No tuning needed beyond M.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Most nodes end up at layer 0
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Simulate the formula a million times at M = 16. About 94% of samples land at layer 0, 5.7% at layer 1, and
            the tail decays exponentially by a factor of 1/M per layer. This is what keeps the upper tiers cheap.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Expected node counts per layer (N = 1,000,000, M = 16)
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { layer: 0, pct: 93.75, count: "937,500" },
                { layer: 1, pct: 5.86, count: "58,600" },
                { layer: 2, pct: 0.37, count: "3,700" },
                { layer: 3, pct: 0.023, count: "230" },
                { layer: 4, pct: 0.001, count: "14" },
              ].map((row) => (
                <div
                  key={row.layer}
                  style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px", gap: 10, alignItems: "center" }}
                >
                  <T color={C.yellow} bold size={14} style={{ fontFamily: "monospace" }}>
                    L = {row.layer}
                  </T>
                  <div style={{ height: 16, background: "rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.min(row.pct * 1.05, 100)}%`,
                        height: "100%",
                        background: C.yellow,
                      }}
                    />
                  </div>
                  <T color={C.bright} size={13} style={{ fontFamily: "monospace", textAlign: "right" }}>
                    {row.pct}% ({row.count})
                  </T>
                </div>
              ))}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.yellow }}>exponential decay</span>: P(L &ge; k+1) / P(L &ge; k) = 1/M
            <br />
            At M = 16: each layer is 1/16 the size of the one below it
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Upper layers hold a handful of hub nodes - cheap in storage, expensive in importance. Every query enters
            through them.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Greedy insert: 4-step storyboard for one new doc
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
            Insert one new doc into a graph that already holds docs 1-10. Use M = 3 and ef_construction = 4 for the
            visualization. Each frame below is one step of HNSW Algorithm 1 from the paper.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Frame 1 - roll layer L from the exponential formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                lineHeight: 1.8,
              }}
            >
              U = 0.45 &nbsp;&rarr;&nbsp; L = floor(&minus;ln(0.45) &middot; 0.36) = floor(0.288) ={" "}
              <span style={{ color: C.green, fontSize: 18 }}>L = 0</span>
            </div>
            <T color="#80e8a5" size={13} center style={{ marginTop: 6 }}>
              Most rolls land at L = 0. Insert this new doc on layer 0 only.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Frame 2 - greedy descend from top entry down to layer L + 1
            </T>
            <div style={{ marginTop: 10 }}>
              <svg viewBox="0 0 500 230" style={{ width: "100%", maxWidth: 540, height: "auto", display: "block" }}>
                <desc>
                  Greedy descent during insertion: starting at the top entry doc 1 at L2, drop along green edges to L1
                  doc 1, then drop to L0 doc 1. Above the target layer L = 0, every layer keeps just one candidate.
                </desc>
                <line x1="10" y1="40" x2="490" y2="40" stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
                <line x1="10" y1="115" x2="490" y2="115" stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
                <line x1="10" y1="190" x2="490" y2="190" stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
                <text x="16" y="32" fill={C.red} fontSize="11">
                  Layer 2 (top entry)
                </text>
                <text x="16" y="107" fill={C.yellow} fontSize="11">
                  Layer 1
                </text>
                <text x="16" y="208" fill={C.cyan} fontSize="11">
                  Layer 0 (target = L)
                </text>
                <line x1="250" y1="40" x2="250" y2="115" stroke={C.green} strokeWidth="3" />
                <line x1="250" y1="115" x2="250" y2="190" stroke={C.green} strokeWidth="3" />
                <g>
                  <circle cx="250" cy="40" r="11" fill={C.green} stroke={C.red} strokeWidth="1.5" />
                  <text x="250" y="44" textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
                    1
                  </text>
                </g>
                <g>
                  <circle cx="250" cy="115" r="11" fill={C.green} stroke={C.yellow} strokeWidth="1.5" />
                  <text x="250" y="119" textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
                    1
                  </text>
                </g>
                <g>
                  <circle cx="250" cy="190" r="11" fill={C.green} stroke={C.cyan} strokeWidth="1.5" />
                  <text x="250" y="194" textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
                    1
                  </text>
                </g>
                <text x="270" y="44" fill={C.bright} fontSize="11" fontFamily="monospace">
                  ep = doc 1
                </text>
                <text x="270" y="119" fill={C.bright} fontSize="11" fontFamily="monospace">
                  Ep = doc 1 (no closer L1 neighbor)
                </text>
                <text x="270" y="194" fill={C.bright} fontSize="11" fontFamily="monospace">
                  Ep = doc 1 (start of L0 beam)
                </text>
              </svg>
            </div>
            <T color="#80e8a5" size={13} center style={{ marginTop: 6, fontFamily: "monospace" }}>
              Above L: 1 candidate per layer (cheap). Stop when we hit layer L.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Frame 3 - beam search at layer L grows a candidate pool of size ef_construction = 4
            </T>
            <div style={{ marginTop: 10 }}>
              <svg viewBox="0 0 540 360" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}>
                <desc>
                  Layer-0 beam search during insertion. The orange star is the new doc at (260, 110). Dashed orange
                  lines connect it to its top-4 candidates docs 7, 4, 3, 2 - the ef_construction = 4 pool.
                </desc>
                {FLAT_GRAPH_EDGES.map(([a, b], i) => (
                  <line
                    key={`e${i}`}
                    x1={HNSW_CORPUS_XY[a].x}
                    y1={HNSW_CORPUS_XY[a].y}
                    x2={HNSW_CORPUS_XY[b].x}
                    y2={HNSW_CORPUS_XY[b].y}
                    stroke={C.cyan}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                ))}
                {[7, 4, 3, 2].map((id) => {
                  const p = HNSW_CORPUS_XY[id];
                  return (
                    <g key={`pool${id}`}>
                      <line
                        x1={HNSW_INSERT_NEW_XY.x}
                        y1={HNSW_INSERT_NEW_XY.y}
                        x2={p.x}
                        y2={p.y}
                        stroke={C.orange}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        strokeOpacity="0.85"
                      />
                      <text
                        x={(HNSW_INSERT_NEW_XY.x + p.x) / 2 + 8}
                        y={(HNSW_INSERT_NEW_XY.y + p.y) / 2 - 4}
                        fill={C.orange}
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {HNSW_INSERT_DISTS[id].toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                {Object.entries(HNSW_CORPUS_XY).map(([id, p]) => {
                  const idN = Number(id);
                  const inPool = [7, 4, 3, 2].includes(idN);
                  return (
                    <g key={`n${id}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={inPool ? 12 : 10}
                        fill={inPool ? C.orange : C.cyan}
                        stroke={inPool ? C.orange : C.cyan}
                        strokeWidth="1.5"
                      />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
                        {id}
                      </text>
                    </g>
                  );
                })}
                <g>
                  <circle
                    cx={HNSW_INSERT_NEW_XY.x}
                    cy={HNSW_INSERT_NEW_XY.y}
                    r="11"
                    fill={C.green}
                    stroke={C.bright}
                    strokeWidth="2"
                  />
                  <text
                    x={HNSW_INSERT_NEW_XY.x}
                    y={HNSW_INSERT_NEW_XY.y + 4}
                    textAnchor="middle"
                    fill="#08080d"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                  <text
                    x={HNSW_INSERT_NEW_XY.x}
                    y={HNSW_INSERT_NEW_XY.y - 16}
                    textAnchor="middle"
                    fill={C.green}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    New doc
                  </text>
                </g>
              </svg>
            </div>
            <T color="#80e8a5" size={13} center style={{ marginTop: 6, fontFamily: "monospace" }}>
              ef_construction = 4 candidate pool: doc 7 (58.3), 4 (94.9), 3 (111.8), 2 (117.0)
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Frame 4 - pick M = 3 nearest from the pool, add bidirectional edges
            </T>
            <div style={{ marginTop: 10 }}>
              <svg viewBox="0 0 540 360" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}>
                <desc>
                  Final insertion frame. From the ef_construction = 4 candidate pool, the M = 3 nearest docs (7, 4, 3)
                  are chosen and connected to the new node by solid green bidirectional edges. Doc 2 - in the pool but
                  not the top M - is left without an edge.
                </desc>
                {FLAT_GRAPH_EDGES.map(([a, b], i) => (
                  <line
                    key={`e${i}`}
                    x1={HNSW_CORPUS_XY[a].x}
                    y1={HNSW_CORPUS_XY[a].y}
                    x2={HNSW_CORPUS_XY[b].x}
                    y2={HNSW_CORPUS_XY[b].y}
                    stroke={C.cyan}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                ))}
                {[7, 4, 3].map((id) => {
                  const p = HNSW_CORPUS_XY[id];
                  return (
                    <line
                      key={`add${id}`}
                      x1={HNSW_INSERT_NEW_XY.x}
                      y1={HNSW_INSERT_NEW_XY.y}
                      x2={p.x}
                      y2={p.y}
                      stroke={C.green}
                      strokeWidth="3"
                    />
                  );
                })}
                {Object.entries(HNSW_CORPUS_XY).map(([id, p]) => {
                  const idN = Number(id);
                  const isPicked = [7, 4, 3].includes(idN);
                  const isPoolReject = idN === 2;
                  let fill = C.cyan;
                  if (isPicked) fill = C.green;
                  if (isPoolReject) fill = C.dim;
                  return (
                    <g key={`n${id}`}>
                      <circle cx={p.x} cy={p.y} r="11" fill={fill} stroke={fill} strokeWidth="1.5" />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#08080d" fontSize="11" fontWeight="bold">
                        {id}
                      </text>
                    </g>
                  );
                })}
                <g>
                  <circle
                    cx={HNSW_INSERT_NEW_XY.x}
                    cy={HNSW_INSERT_NEW_XY.y}
                    r="12"
                    fill={C.green}
                    stroke={C.bright}
                    strokeWidth="2"
                  />
                  <text
                    x={HNSW_INSERT_NEW_XY.x}
                    y={HNSW_INSERT_NEW_XY.y + 4}
                    textAnchor="middle"
                    fill="#08080d"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    N
                  </text>
                  <text
                    x={HNSW_INSERT_NEW_XY.x}
                    y={HNSW_INSERT_NEW_XY.y - 18}
                    textAnchor="middle"
                    fill={C.green}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    New doc N
                  </text>
                </g>
              </svg>
            </div>
            <T color="#80e8a5" size={13} center style={{ marginTop: 6, fontFamily: "monospace" }}>
              Edges added: N&harr;7, N&harr;4, N&harr;3 (M = 3). Doc 2 stays out of the picked set.
            </T>
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
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: C.dim }}>HNSW Algorithm 1 (paper):</span>
            <br />
            Roll <span style={{ color: C.green }}>L</span> &rarr; greedy descend top to L + 1 &rarr; beam search at L..0
            with <span style={{ color: C.yellow }}>ef_construction</span> &rarr; connect{" "}
            <span style={{ color: C.green }}>M</span> nearest
          </div>
          <T color="#80e8a5" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            ef_construction = 200 in production: bigger pool gives better neighbor choice and better recall later, at
            the cost of slower builds.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Insert all 10 cat-corpus docs - watch the graph grow
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 8 }}>
            Three snapshots. Each one runs the insert algorithm on the next batch of docs. Doc 1 lands at L = 2 and
            becomes the top entry. Doc 6 lands at L = 1 and adds a second-tier hub. Everyone else lands at L = 0.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                title: "After doc 1",
                desc: "HNSW graph state after doc 1 has been inserted. A single red node at the top layer L2 - no edges yet, no L1 or L0 nodes - because doc 1 is the very first vector and rolled L = 2.",
                nodes: { 2: [1] },
                l1Edges: [],
                l0Edges: [],
                l0Nodes: [],
              },
              {
                title: "After docs 1, 6",
                desc: "HNSW graph state after docs 1 and 6 have been inserted. Top layer L2 holds doc 1; the L1 hub layer adds doc 6 connected to doc 1; L0 is starting to form with both docs 1 and 6 sitting on the bottom row.",
                nodes: { 2: [1], 1: [1, 6] },
                l1Edges: [[1, 6]],
                l0Edges: [],
                l0Nodes: [1, 6],
              },
              {
                title: "After all 10 docs",
                desc: "Final HNSW graph state after all 10 docs have been inserted. L2 holds doc 1 alone; L1 holds the small hub layer of docs 1, 6, 10; L0 holds every doc connected through the dense flat-graph proximity edges.",
                nodes: { 2: [1], 1: [1, 6, 10] },
                l1Edges: [
                  [1, 6],
                  [6, 10],
                ],
                l0Edges: FLAT_GRAPH_EDGES,
                l0Nodes: [1, 7, 3, 4, 5, 2, 8, 10, 6, 9],
              },
            ].map((snap, idx) => {
              const Y2 = 30,
                Y1 = 95,
                Y0 = 165;
              const layer1Pos = { 1: 80, 6: 165, 10: 250 };
              const layer0Pos = {
                5: 30,
                1: 60,
                7: 90,
                3: 120,
                4: 150,
                8: 180,
                2: 210,
                10: 240,
                6: 270,
                9: 300,
              };
              return (
                <div
                  key={idx}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 8,
                    background: `${C.orange}06`,
                    border: `1px solid ${C.orange}12`,
                  }}
                >
                  <T color={C.orange} bold center size={14}>
                    {snap.title}
                  </T>
                  <svg
                    viewBox="0 0 320 200"
                    style={{ width: "100%", maxWidth: 320, height: "auto", display: "block", marginTop: 8 }}
                  >
                    <desc>{snap.desc}</desc>
                    <line x1="5" y1={Y2} x2="315" y2={Y2} stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
                    <line x1="5" y1={Y1} x2="315" y2={Y1} stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
                    <line x1="5" y1={Y0} x2="315" y2={Y0} stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
                    <text x="8" y={Y2 - 6} fill={C.red} fontSize="10">
                      L2
                    </text>
                    <text x="8" y={Y1 - 6} fill={C.yellow} fontSize="10">
                      L1
                    </text>
                    <text x="8" y={Y0 + 14} fill={C.cyan} fontSize="10">
                      L0
                    </text>
                    {snap.l1Edges.map(([a, b], i) => (
                      <line
                        key={`l1${i}`}
                        x1={layer1Pos[a]}
                        y1={Y1}
                        x2={layer1Pos[b]}
                        y2={Y1}
                        stroke={C.yellow}
                        strokeWidth="1.5"
                      />
                    ))}
                    {snap.l0Edges.map(([a, b], i) => (
                      <line
                        key={`l0${i}`}
                        x1={layer0Pos[a]}
                        y1={Y0}
                        x2={layer0Pos[b]}
                        y2={Y0}
                        stroke={C.cyan}
                        strokeOpacity="0.55"
                        strokeWidth="1.2"
                      />
                    ))}
                    {(snap.nodes[2] || []).map((id) => (
                      <g key={`l2${id}`}>
                        <circle cx="160" cy={Y2} r="9" fill={C.red} stroke={C.red} />
                        <text x="160" y={Y2 + 3} textAnchor="middle" fill="#08080d" fontSize="10" fontWeight="bold">
                          {id}
                        </text>
                      </g>
                    ))}
                    {(snap.nodes[1] || []).map((id) => (
                      <g key={`l1n${id}`}>
                        <circle cx={layer1Pos[id]} cy={Y1} r="9" fill={C.yellow} stroke={C.yellow} />
                        <text
                          x={layer1Pos[id]}
                          y={Y1 + 3}
                          textAnchor="middle"
                          fill="#08080d"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {id}
                        </text>
                      </g>
                    ))}
                    {snap.l0Nodes.map((id) => (
                      <g key={`l0n${id}`}>
                        <circle cx={layer0Pos[id]} cy={Y0} r="8" fill={C.cyan} stroke={C.cyan} />
                        <text
                          x={layer0Pos[id]}
                          y={Y0 + 3}
                          textAnchor="middle"
                          fill="#08080d"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={14}>
              Insertion log (deterministic walkthrough values)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "48px 2fr 80px 80px 1fr",
                gap: 10,
                padding: "6px 10px",
                borderBottom: `1px solid ${C.orange}22`,
              }}
            >
              <T color={C.orange} bold size={12}>
                Doc
              </T>
              <T color={C.orange} bold size={12}>
                Text
              </T>
              <T color={C.orange} bold size={12} style={{ textAlign: "center" }}>
                U
              </T>
              <T color={C.orange} bold size={12} style={{ textAlign: "center" }}>
                L
              </T>
              <T color={C.orange} bold size={12} center>
                Edges
              </T>
            </div>
            {HNSW_INSERT_ORDER.map((row) => {
              const doc = CAT_CORPUS.find((d) => d.id === row.id);
              const layerBg = row.L === 2 ? `${C.red}18` : row.L === 1 ? `${C.yellow}18` : `${C.cyan}18`;
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 2fr 80px 80px 1fr",
                    gap: 10,
                    alignItems: "center",
                    padding: "5px 10px",
                    borderRadius: 4,
                    background: layerBg,
                    marginTop: 3,
                  }}
                >
                  <T color={C.bright} bold size={13} style={{ fontFamily: "monospace" }}>
                    #{row.id}
                  </T>
                  <T color={C.bright} size={12}>
                    {doc.text}
                  </T>
                  <T color={C.dim} size={12} style={{ fontFamily: "monospace", textAlign: "center" }}>
                    {row.u}
                  </T>
                  <T color={C.orange} bold size={13} style={{ fontFamily: "monospace", textAlign: "center" }}>
                    L = {row.L}
                  </T>
                  <T color={C.bright} size={12} style={{ fontFamily: "monospace" }} center>
                    {row.neighbors.length === 0 ? "- (entry)" : `to ${row.neighbors.join(", ")}`}
                  </T>
                </div>
              );
            })}
          </div>
          <T color="#ffcc80" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            Real layer rolls are random; the distribution still looks like this. One or two top, a handful in the
            middle, everyone else at the bottom.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            M sets edge density: see it visually at M = 4, 8, 16
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            M is the most important construction parameter. Larger M = more edges per node = more starting points for
            search = better recall, but more memory and slightly slower queries per hop. Below: 8 nodes on a ring, each
            connected to its M nearest along the ring. Watch the density grow.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { M: 4, color: C.green, label: "M = 4 (sparse)", note: "Memory-tight; degree = 4 per node" },
              { M: 8, color: C.yellow, label: "M = 8 (mid)", note: "Balanced; degree = 8 per node" },
              {
                M: 16,
                color: C.red,
                label: "M = 16 (production)",
                note: "Default; degree = 10 per node (capped at N - 1 = 11)",
              },
            ].map((cfg) => {
              const N = 12;
              const cx = 100;
              const cy = 100;
              const r = 75;
              const positions = Array.from({ length: N }, (_, i) => {
                const theta = (2 * Math.PI * i) / N - Math.PI / 2;
                return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta), id: i + 1 };
              });
              const halfM = Math.min(Math.floor(cfg.M / 2), Math.floor((N - 1) / 2));
              const edges = [];
              for (let i = 0; i < N; i++) {
                for (let k = 1; k <= halfM; k++) {
                  const j = (i + k) % N;
                  edges.push([i, j]);
                }
              }
              return (
                <div
                  key={cfg.M}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 8,
                    background: `${cfg.color}06`,
                    border: `1px solid ${cfg.color}33`,
                    textAlign: "center",
                  }}
                >
                  <T color={cfg.color} bold size={15} center>
                    {cfg.label}
                  </T>
                  <svg
                    viewBox="0 0 200 200"
                    style={{ width: "100%", maxWidth: 200, height: "auto", display: "block", marginTop: 8 }}
                  >
                    <desc>
                      {`A ring of 12 nodes with each node connected to its M = ${cfg.M} nearest neighbors along the ring; ${edges.length} edges total visualize HNSW edge density.`}
                    </desc>
                    {edges.map(([a, b], i) => (
                      <line
                        key={`e${i}`}
                        x1={positions[a].x}
                        y1={positions[a].y}
                        x2={positions[b].x}
                        y2={positions[b].y}
                        stroke={cfg.color}
                        strokeWidth="1.2"
                        strokeOpacity="0.65"
                      />
                    ))}
                    {positions.map((p) => (
                      <g key={`n${p.id}`}>
                        <circle cx={p.x} cy={p.y} r="7" fill={cfg.color} stroke={cfg.color} />
                      </g>
                    ))}
                  </svg>
                  <T color={C.bright} size={12} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                    {cfg.note}
                  </T>
                  <T color={C.dim} size={11} style={{ marginTop: 2, fontFamily: "monospace" }} center>
                    {edges.length} undirected edges shown
                  </T>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.red }}>M = 16</span> <span style={{ color: C.dim }}>(the production default)</span>
            <br />
            Edges per node at layer 0 &le; M = 16 &nbsp;<span style={{ color: C.dim }}>bidirectional</span>
            <br />
            Edges per node at upper layers &le; M / 2 = 8
            <br />
            Memory per vector &asymp; M &middot; 4 bytes + upper layers &asymp;{" "}
            <span style={{ color: C.red }}>70 bytes per vector</span>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={16} center>
                Graph overhead at N = 1,000,000
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 8, fontFamily: "monospace" }} center>
                70 MB
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                Tiny next to the vectors themselves (3 GB)
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={16} center>
                Graph overhead at N = 100,000,000
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 8, fontFamily: "monospace" }} center>
                7 GB
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                Still cheap compared to 300 GB of vectors
              </T>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { M: 8, label: "Memory-tight", color: C.green },
              { M: 16, label: "Typical (default)", color: C.yellow },
              { M: 48, label: "Recall-critical", color: C.red },
            ].map((row) => (
              <div
                key={row.M}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${row.color}10`,
                  border: `1px solid ${row.color}33`,
                  textAlign: "center",
                }}
              >
                <T color={row.color} bold center size={18} style={{ fontFamily: "monospace" }}>
                  M = {row.M}
                </T>
                <T color={C.bright} center size={13} style={{ marginTop: 2 }}>
                  {row.label}
                </T>
              </div>
            ))}
          </div>
          <T color="#ef9a9a" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            M is the one knob you usually set up front and leave alone. The graph is rebuilt to change it.
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
