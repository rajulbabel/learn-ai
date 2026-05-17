import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

const FILTER_CORPUS = [
  { id: 1, text: "Cats are small domesticated carnivores", tenant: 42, year: 2024 },
  { id: 2, text: "Dogs are loyal pets", tenant: 7, year: 2023 },
  { id: 3, text: "Lions are big cats that live in Africa", tenant: 42, year: 2024 },
  { id: 4, text: "My cat sat on the mat", tenant: 7, year: 2024 },
  { id: 5, text: "Tigers are striped cats", tenant: 42, year: 2022 },
  { id: 6, text: "Python is a programming language", tenant: 7, year: 2024 },
  { id: 7, text: "Kittens grow up to be cats", tenant: 42, year: 2024 },
  { id: 8, text: "The dog chased the cat", tenant: 7, year: 2021 },
  { id: 9, text: "Birds can fly", tenant: 42, year: 2020 },
  { id: 10, text: "Fish live underwater", tenant: 7, year: 2024 },
];

const FILTERED_HNSW_NODES = [
  { id: 1, x: 90, y: 70, pass: true },
  { id: 2, x: 200, y: 90, pass: false },
  { id: 3, x: 310, y: 70, pass: true },
  { id: 4, x: 140, y: 150, pass: false },
  { id: 5, x: 260, y: 150, pass: true },
  { id: 6, x: 400, y: 130, pass: false },
  { id: 7, x: 90, y: 230, pass: true },
  { id: 8, x: 200, y: 250, pass: false },
  { id: 9, x: 330, y: 220, pass: false },
  { id: 10, x: 440, y: 220, pass: false },
];
const FILTERED_HNSW_EDGES = [
  [1, 2],
  [1, 4],
  [2, 3],
  [2, 5],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 7],
  [5, 8],
  [5, 9],
  [6, 9],
  [6, 10],
  [7, 8],
  [8, 9],
  [9, 10],
  [1, 3],
  [5, 7],
];
const FILTERED_HNSW_PATH = [1, 3, 5, 7];

export default function Filtering(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const nodeById = Object.fromEntries(FILTERED_HNSW_NODES.map((n) => [n.id, n]));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Similarity search with a WHERE clause
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            In production, retrieval is almost never pure vector similarity. Callers attach metadata predicates:
            &quot;find docs similar to this one AND tenant_id = 42 AND published_after = 2024-01-01&quot;. An ANN index
            built over the raw embeddings has no idea what tenant_id or published_year even mean - it ranks by geometry.
            Without help, the top-k can come back with docs that are semantically close but violate the predicate. This
            is the number-one production gotcha with vector search.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              The query the app actually sends
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              SELECT id FROM docs
              <br />
              WHERE <span style={{ color: C.cyan }}>tenant_id = 42</span> AND{" "}
              <span style={{ color: C.cyan }}>published_year &ge; 2024</span>
              <br />
              ORDER BY embedding &lt;=&gt; <span style={{ color: C.cyan }}>query_embedding</span>
              <br />
              LIMIT 3;
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              10-doc cat corpus with metadata
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 3fr 1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>ID</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Text</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Tenant</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Year</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Passes?</div>
              {FILTER_CORPUS.map((d) => {
                const passes = d.tenant === 42 && d.year >= 2024;
                return (
                  <div key={`row-${d.id}`} style={{ display: "contents" }}>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.id}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        color: passes ? C.bright : C.dim,
                      }}
                    >
                      {d.text}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.tenant}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.year}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.green}20` : `${C.red}14`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.green : C.red,
                        fontWeight: "bold",
                      }}
                    >
                      {passes ? "yes" : "no"}
                    </div>
                  </div>
                );
              })}
            </div>
            <T color={C.cyan} size={14} center style={{ marginTop: 10 }}>
              Only docs <span style={{ fontFamily: "monospace", color: C.green, fontWeight: "bold" }}>1, 3, 7</span>{" "}
              pass the predicate. A naive ANN lookup over this corpus returns nearest-by-geometry - it has no way to
              know those filters exist.
            </T>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Three strategies divide this problem up differently. Each has a failure mode. The rest of the chapter walks
            through them in order of increasing sophistication.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Pre-filter: shrink the set, then search
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The simplest strategy: evaluate the predicate first against every document, keep only the survivors, and
            brute-force the similarity over that smaller set. Works beautifully when the filter is tight (few survivors)
            and falls apart when the filter is loose (most docs survive, so you pay full brute-force cost).
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Filter funnel at N = 1M with 0.1% selectivity
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Three-stage filter funnel for the pre-filter strategy. Wide left trapezoid represents 1 million
                  vectors in the corpus. Middle narrowing trapezoid represents the ~1,000 docs that pass the tenant and
                  year predicates. Right-most narrow trapezoid represents the final top-3 returned after brute-force
                  similarity search over the survivors.
                </desc>
                <polygon
                  points="30,30 180,30 180,190 30,190"
                  fill={`${C.yellow}22`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <polygon
                  points="180,30 180,190 320,150 320,70"
                  fill={`${C.yellow}36`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <polygon
                  points="320,70 320,150 470,130 470,90"
                  fill={`${C.green}40`}
                  stroke={C.green}
                  strokeWidth={2}
                />
                <text x={105} y={110} fill={C.yellow} fontSize={18} fontWeight="bold" textAnchor="middle">
                  1M docs
                </text>
                <text x={105} y={132} fill={C.bright} fontSize={12} textAnchor="middle">
                  Full corpus
                </text>
                <text x={250} y={110} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  1,000
                </text>
                <text x={250} y={128} fill={C.bright} fontSize={11} textAnchor="middle">
                  Pass predicate
                </text>
                <text x={395} y={110} fill={C.green} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Top-3
                </text>
                <text x={395} y={128} fill={C.bright} fontSize={11} textAnchor="middle">
                  Brute-force
                </text>
                <text x={260} y={22} fill={C.dim} fontSize={11} textAnchor="middle">
                  1. Filter
                </text>
                <text x={395} y={60} fill={C.dim} fontSize={11} textAnchor="middle">
                  2. Rank
                </text>
                <line x1={180} y1={205} x2={320} y2={205} stroke={C.dim} strokeWidth={1} />
                <text x={250} y={216} fill={C.dim} fontSize={10} textAnchor="middle">
                  Metadata index read
                </text>
              </svg>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Tight filter - wins
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 0.1% selectivity on 1M = 1,000 survivors</div>
                <div>&bull; Brute-force over 1k is cheap (~1 ms)</div>
                <div>&bull; Recall = 100% - it is exact search</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Loose filter - loses
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 50% selectivity on 1M = 500k survivors</div>
                <div>&bull; Brute-force over 500k is slow (~500 ms)</div>
                <div>&bull; ANN speed is abandoned entirely</div>
              </div>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Pre-filter swaps approximate-fast for exact-slow. The strategy only pays off when the predicate shrinks the
            corpus to a few hundred or thousand survivors.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Post-filter: search first, drop non-matches
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Flip the order. Run the ANN index normally, take the top-100 candidates, then apply the predicate. This
            keeps the ANN speed on any workload, but when the predicate is tight it silently returns fewer than k
            results - sometimes zero - because the survivors you wanted may all sit at position 500 in the ANN ranking.
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
            <T color={C.green} bold center size={16}>
              Post-filter on a tight 0.1% predicate, k = 10
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              <div>
                Step 1: ANN returns top-100 nearest by geometry (<span style={{ color: C.green }}>fast</span>)
              </div>
              <div>
                Step 2: evaluate predicate on each - 1 of 100 passes (<span style={{ color: C.red }}>insufficient</span>
                )
              </div>
              <div>
                Step 3: return 1 result instead of 10 - <span style={{ color: C.red }}>fewer than k</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(10, 32px)",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const isSurvivor = i === 47;
              return (
                <div
                  key={`post-${i}`}
                  title={isSurvivor ? "passes predicate" : "dropped"}
                  style={{
                    width: 32,
                    height: 32,
                    background: isSurvivor ? C.green : `${C.green}08`,
                    border: `1px solid ${isSurvivor ? C.green : `${C.green}14`}`,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </div>
          <T color={C.green} size={14} center style={{ marginTop: 8 }}>
            100-candidate grid - only one square (position 48) passes the predicate. The response is{" "}
            <span style={{ color: C.red, fontWeight: "bold" }}>empty</span> for everyone who queried with a tight
            filter.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              The post-filter trap
            </T>
            <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
              <div>&bull; App asks for 10 results, gets 1 (or 0) back - the UI suddenly looks broken</div>
              <div>&bull; Raise the ANN top-k to 1000 to compensate, latency climbs proportionally</div>
              <div>&bull; Still no guarantee with very selective filters</div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Post-filter is easy to implement and fast on loose filters. The silent failure mode at high selectivity is
            why this approach is a long-running source of bug reports.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Inline: evaluate the filter during graph traversal
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Both pre- and post-filter separate the two steps. Inline filtering fuses them: at every HNSW graph hop,
            evaluate the predicate before expanding a node. The traversal still explores the graph, but it only counts
            passing nodes as candidates. This is how Qdrant&apos;s payload index works and it is the best-in-class
            performance across almost every selectivity level.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              HNSW graph with passing (bright) and failing (dim) nodes
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 300" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Small HNSW-style graph with 10 nodes on a rectangular layout. Nodes 1, 3, 5, 7 that pass the tenant
                  and year predicate are filled in orange, while failing nodes are dimmed. Gray edges connect near
                  neighbors. An orange traversal path with arrows visits only the passing nodes 1 to 3 to 5 to 7,
                  illustrating the Qdrant inline filtered-HNSW approach that evaluates the predicate during graph
                  traversal instead of pre- or post-filtering.
                </desc>
                <defs>
                  <marker
                    id="filt19-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill={C.orange} />
                  </marker>
                </defs>
                {FILTERED_HNSW_EDGES.map(([a, b], i) => {
                  const na = nodeById[a];
                  const nb = nodeById[b];
                  return (
                    <line
                      key={`edge-${i}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke={C.dim}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                  );
                })}
                {FILTERED_HNSW_PATH.slice(0, -1).map((from, i) => {
                  const to = FILTERED_HNSW_PATH[i + 1];
                  const nf = nodeById[from];
                  const nt = nodeById[to];
                  const dx = nt.x - nf.x;
                  const dy = nt.y - nf.y;
                  const d = Math.sqrt(dx * dx + dy * dy) || 1;
                  const ux = dx / d;
                  const uy = dy / d;
                  const r = 15;
                  const tipPad = 4;
                  return (
                    <line
                      key={`path-${i}`}
                      x1={nf.x + ux * r}
                      y1={nf.y + uy * r}
                      x2={nt.x - ux * (r + tipPad)}
                      y2={nt.y - uy * (r + tipPad)}
                      stroke={C.orange}
                      strokeWidth={3}
                      markerEnd="url(#filt19-arrow)"
                    />
                  );
                })}
                {FILTERED_HNSW_NODES.map((n) => (
                  <g key={`node-${n.id}`}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={15}
                      fill={n.pass ? C.orange : `${C.dim}30`}
                      stroke={n.pass ? C.bg : C.dim}
                      strokeWidth={2}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      fill={n.pass ? C.bg : C.dim}
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {n.id}
                    </text>
                  </g>
                ))}
                <text x={260} y={285} fill={C.orange} fontSize={13} fontWeight="bold" textAnchor="middle">
                  Traversal only counts bright nodes as candidates
                </text>
              </svg>
            </div>
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
            <T color={C.orange} bold center size={15}>
              How Qdrant does it - the payload index
            </T>
            <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
              <div>
                &bull; Every payload field (tenant, year, tags) has its own structured index (inverted, range tree)
              </div>
              <div>&bull; At each graph hop the predicate is evaluated via a bitset lookup - O(1) per node</div>
              <div>&bull; Non-passing nodes still get traversed (you may have to cross them to reach passing ones)</div>
              <div>&bull; Only passing nodes are added to the top-k candidate heap</div>
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Inline filtering keeps the O(log N) graph navigation and pays only a per-hop bitset lookup. Selectivity
            barely matters - the traversal reaches passing nodes either way.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Where each strategy wins and loses
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Selectivity changes the winner. Pre-filter dominates at extreme tightness (a few survivors), post-filter
            dominates at extreme looseness (almost nothing filtered), and inline filtering wins everywhere in between -
            where most real production workloads sit.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Strategy by filter selectivity (at N = 1M, k = 10)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr 0.9fr 0.9fr 0.9fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Strategy</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Tight 0.1%
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Medium 5%</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Loose 50%</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Universal 100%
              </div>
              {[
                {
                  name: "Pre-filter",
                  cells: [
                    { text: "Fast + exact", win: true },
                    { text: "Acceptable", win: false },
                    { text: "500 ms", win: false },
                    { text: "1 s, brute force", win: false },
                  ],
                },
                {
                  name: "Post-filter",
                  cells: [
                    { text: "Empty results", win: false, bad: true },
                    { text: "Missing some", win: false, bad: true },
                    { text: "Good", win: false },
                    { text: "Best - ANN speed", win: true },
                  ],
                },
                {
                  name: "Inline (Qdrant)",
                  cells: [
                    { text: "Great", win: true },
                    { text: "Great", win: true },
                    { text: "Great", win: true },
                    { text: "Matches post-filter", win: false },
                  ],
                },
              ].flatMap((row) => [
                <div
                  key={`label-${row.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {row.name}
                </div>,
                ...row.cells.map((cell, i) => (
                  <div
                    key={`cell-${row.name}-${i}`}
                    style={{
                      padding: "6px 8px",
                      background: cell.win ? `${C.green}22` : cell.bad ? `${C.red}14` : `${C.red}08`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: cell.win ? C.green : cell.bad ? C.red : C.bright,
                      fontWeight: cell.win || cell.bad ? "bold" : "normal",
                    }}
                  >
                    {cell.text}
                  </div>
                )),
              ])}
            </div>
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
            Inline filtering is the rare &ldquo;no edge case&rdquo; answer
            <br />
            Every production system that cares about filters converges on it
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Post-filter is the production footgun: it looks fine in tests on uniform data, then ships and quietly
            returns empty top-ks to the tenant with the tightest filter.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Filters need their own index
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Any of these strategies needs a way to evaluate the predicate quickly. A full table scan defeats the
            purpose. Every production vector DB ships a side index for metadata, and the choice of structure shapes what
            queries are cheap. The four main families below appear in every major system with slightly different
            tradeoffs.
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
            <T color={C.purple} bold center size={16}>
              Metadata-index strategies across systems
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  system: "Qdrant",
                  index: "Inverted index + bitmap on payload",
                  note: "Integrates tightly with HNSW traversal, per-field tunable",
                },
                {
                  system: "Pinecone",
                  index: "Namespaces + metadata index",
                  note: "Namespaces partition physically, metadata via filter DSL",
                },
                {
                  system: "Weaviate",
                  index: "Column-store inverted index",
                  note: "Learned from Lucene, BM25 and filter share the column layout",
                },
                {
                  system: "pgvector",
                  index: "JSONB GIN or btree on columns",
                  note: "Plain Postgres indexing - familiar to any SQL team",
                },
              ].map((row) => (
                <div
                  key={row.system}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={15}>
                    {row.system}
                  </T>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: C.bright,
                    }}
                  >
                    {row.index}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {row.note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Bitmap: <span style={{ color: C.purple }}>O(1)</span> set membership, tiny memory
            <br />
            Inverted index: <span style={{ color: C.purple }}>O(log N)</span> lookup per term, great for
            high-cardinality fields
            <br />
            Column store: fastest for range predicates, bigger on disk
            <br />
            JSONB GIN: most flexible schema, slowest at scale
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The filter index is the hidden cost behind every filtered vector query. Benchmarks that leave it out always
            look good; production always finds it.
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
