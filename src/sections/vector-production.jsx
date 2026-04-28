import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 11 Act 5: Production Realities (chapters 11.20-11.29).
// Continues the cat-corpus + production-scale numbers established in 11.1-11.18.
// Canonical scale dim d = 768. SVG marker/gradient ids follow `<type><chapter>-<svg-index>`.

// ───────────────────────────────────────────────────────────────────────────
// 11.20 Filtering
// ───────────────────────────────────────────────────────────────────────────

// Cat corpus snapshot with synthetic metadata so filter predicates have something
// to hit. tenant_id and published_year are invented for illustration; the text
// matches the canonical 10-doc corpus used across Section 11.
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

// Graph used in sub=3 to show inline filtered-HNSW: 10 nodes placed on a
// rectangular grid, edges connect near neighbors. `pass` marks which satisfy
// the predicate in the running example.
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

export const Filtering = (ctx) => {
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
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>ID</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>Text</div>
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
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>Strategy</div>
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.21 Updates & Deletes
// ───────────────────────────────────────────────────────────────────────────

// Small HNSW-like graph used in sub=1 and sub=2 to show how deletion
// breaks paths. Node D is central - many routes depend on it.
const UD_NODES = [
  { id: "A", x: 80, y: 90 },
  { id: "B", x: 200, y: 60 },
  { id: "C", x: 320, y: 90 },
  { id: "D", x: 200, y: 160 },
  { id: "E", x: 80, y: 230 },
  { id: "F", x: 200, y: 260 },
  { id: "G", x: 320, y: 230 },
  { id: "H", x: 420, y: 160 },
];
const UD_EDGES = [
  ["A", "B"],
  ["B", "C"],
  ["A", "D"],
  ["B", "D"],
  ["C", "D"],
  ["D", "E"],
  ["D", "F"],
  ["D", "G"],
  ["D", "H"],
  ["E", "F"],
  ["F", "G"],
  ["G", "H"],
];

// Recall-vs-delete-rate curve for sub=3.
const UD_DELETE_RECALL = [
  { rate: 0, recall: 0.97 },
  { rate: 10, recall: 0.965 },
  { rate: 20, recall: 0.95 },
  { rate: 30, recall: 0.92 },
  { rate: 40, recall: 0.88 },
  { rate: 50, recall: 0.85 },
];

export const UpdatesDeletes = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const nodeById = Object.fromEntries(UD_NODES.map((n) => [n.id, n]));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Inserts: append the node, connect to its M nearest
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Adding a new vector to an HNSW index is cheap. The new node is assigned a layer by the usual layer formula,
            its M = 16 nearest existing neighbors are found with a standard search, and edges are drawn. The graph grows
            incrementally and continues to work well for as long as you only insert. This is the happy path every demo
            shows.
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
              Insert flow for a new cat-corpus doc
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
              1. Embed the new doc &rarr; vector v
              <br />
              2. Assign layer <span style={{ color: C.cyan }}>L = floor(&minus;ln(uniform) &middot; mL)</span>
              <br />
              3. Search existing graph for <span style={{ color: C.cyan }}>M = 16</span> nearest neighbors
              <br />
              4. Append node, add M edges, done
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { label: "Work per insert", value: "O(log N)", color: C.cyan },
              { label: "Edges added", value: "M = 16", color: C.cyan },
              { label: "Memory growth", value: "Linear in N", color: C.cyan },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "10px 12px",
                  background: `${m.color}08`,
                  border: `1px solid ${m.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={m.color} bold center size={14}>
                  {m.label}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 16, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Append-only systems love this. The index stays coherent forever. The pain starts the moment someone asks to
            delete something.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Delete: paths that routed through this node break
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Remove a node and every edge incident to it goes with it. If the removed node was a hub - the only short
            route between two regions - queries that used to cross it now have to take a longer detour or fail to reach
            their target. Worse, the greedy search has no idea the shortcut is gone; it just silently lands on
            suboptimal neighbors.
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
              Removing hub node D shatters five routing paths
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 320" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Small graph with 8 nodes where central hub node D has edges to A, B, C, E, F, G, and H. The node D is
                  struck through in red to indicate deletion. Every edge touching D is drawn with a dashed red line to
                  indicate that the route is broken. The remaining edges between the outer ring nodes are drawn in dim
                  gray - they still exist but detour around the missing hub.
                </desc>
                {UD_EDGES.map(([a, b], i) => {
                  const na = nodeById[a];
                  const nb = nodeById[b];
                  const broken = a === "D" || b === "D";
                  return (
                    <line
                      key={`ud-edge-${i}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke={broken ? C.red : C.dim}
                      strokeWidth={broken ? 2 : 1}
                      strokeDasharray={broken ? "6 4" : "0"}
                      opacity={broken ? 0.9 : 0.5}
                    />
                  );
                })}
                {UD_NODES.map((n) => {
                  const deleted = n.id === "D";
                  return (
                    <g key={`ud-node-${n.id}`}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={16}
                        fill={deleted ? `${C.red}20` : C.yellow}
                        stroke={deleted ? C.red : C.bg}
                        strokeWidth={2}
                      />
                      <text
                        x={n.x}
                        y={n.y + 4}
                        fill={deleted ? C.red : C.bg}
                        fontSize={13}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {n.id}
                      </text>
                      {deleted && (
                        <line x1={n.x - 18} y1={n.y - 18} x2={n.x + 18} y2={n.y + 18} stroke={C.red} strokeWidth={3} />
                      )}
                    </g>
                  );
                })}
                <text x={260} y={305} fill={C.red} fontSize={13} fontWeight="bold" textAnchor="middle">
                  5 shortest-path routes lost when D disappears
                </text>
              </svg>
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
            <span style={{ color: C.red }}>hub nodes</span> are high-betweenness - many queries route through them
            <br />
            Remove one and those queries land on suboptimal hops
            <br />
            The index is <span style={{ color: C.red }}>broken</span> even though no query errors are thrown
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most production retrievers do not see this until recall regresses in aggregate - a silent quality drop that
            looks like &quot;the model got worse&quot;.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Tombstone: mark deleted, filter at query time
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The standard workaround is the tombstone. Instead of physically removing the node, mark a bit that says
            &quot;deleted&quot; and leave the vector and edges in place. At query time, any tombstoned node is traversed
            (so routing still works) but never returned as a result. This preserves the graph shape while hiding the
            removed document.
          </T>
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
                Delete pipeline (soft)
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Set node.tombstone = true</div>
                <div>&bull; Node stays in graph, edges untouched</div>
                <div>&bull; Append &quot;deleted&quot; entry to WAL</div>
                <div>&bull; O(1) per delete</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Query pipeline
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Greedy descent still hops through tombstoned nodes</div>
                <div>&bull; Tombstoned candidates dropped before the top-k heap</div>
                <div>&bull; Query time filter is a one-bit check per node</div>
              </div>
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
            Node lives in the graph forever (until rebuild)
            <br />
            Query time filter = <span style={{ color: C.green }}>1 bit per node check</span>
            <br />
            No path breakage today, gradual cost that accumulates
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tombstones trade the immediate path-break problem for slow bloat. Recall stays fine for the first few
            deletes, then the graph starts wasting work on dead nodes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            30% deletes: graph holes, wasted hops, recall drops
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Tombstones are fine until they are not. As the tombstone fraction climbs past ~20%, the graph has more and
            more dead nodes that queries must traverse without benefit. Hub nodes that used to provide shortcuts are
            still there, but half the candidates they point to are tombstoned. Recall starts to degrade and query
            latency creeps up.
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
              Recall@10 vs delete percentage (M = 16, ef_search = 50)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Line chart plotting recall at 10 on the vertical axis (0.80 to 1.00) against delete percentage on the
                  horizontal axis (0 to 50 percent). The orange curve starts at 0.97 at 0 deletes, dips gently to 0.965
                  at 10%, then drops faster through 0.92 at 30% deletes and falls to 0.85 at 50% deletes. Grid lines
                  mark the 20% and 30% thresholds where rebuild is usually triggered.
                </desc>
                <line x1={60} y1={40} x2={60} y2={230} stroke={C.dim} strokeWidth={1} />
                <line x1={60} y1={230} x2={490} y2={230} stroke={C.dim} strokeWidth={1} />
                {[0.8, 0.85, 0.9, 0.95, 1.0].map((y) => {
                  const yPx = 230 - ((y - 0.8) / 0.2) * 190;
                  return (
                    <g key={`y-${y}`}>
                      <line x1={55} y1={yPx} x2={60} y2={yPx} stroke={C.dim} strokeWidth={1} />
                      <text x={50} y={yPx + 3} fill={C.dim} fontSize={11} textAnchor="end">
                        {y.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                {[0, 10, 20, 30, 40, 50].map((x) => {
                  const xPx = 60 + (x / 50) * 430;
                  return (
                    <g key={`x-${x}`}>
                      <line x1={xPx} y1={230} x2={xPx} y2={235} stroke={C.dim} strokeWidth={1} />
                      <text x={xPx} y={250} fill={C.dim} fontSize={11} textAnchor="middle">
                        {x}%
                      </text>
                    </g>
                  );
                })}
                {/* 30% marker */}
                <line
                  x1={60 + (30 / 50) * 430}
                  y1={40}
                  x2={60 + (30 / 50) * 430}
                  y2={230}
                  stroke={C.red}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
                <text x={60 + (30 / 50) * 430} y={35} fill={C.red} fontSize={11} textAnchor="middle">
                  Rebuild trigger
                </text>
                <polyline
                  points={UD_DELETE_RECALL.map((p) => {
                    const xPx = 60 + (p.rate / 50) * 430;
                    const yPx = 230 - ((p.recall - 0.8) / 0.2) * 190;
                    return `${xPx},${yPx}`;
                  }).join(" ")}
                  fill="none"
                  stroke={C.orange}
                  strokeWidth={3}
                />
                {UD_DELETE_RECALL.map((p) => {
                  const xPx = 60 + (p.rate / 50) * 430;
                  const yPx = 230 - ((p.recall - 0.8) / 0.2) * 190;
                  return (
                    <g key={`pt-${p.rate}`}>
                      <circle cx={xPx} cy={yPx} r={4} fill={C.orange} stroke={C.bg} strokeWidth={1.5} />
                      <text x={xPx + 6} y={yPx - 6} fill={C.orange} fontSize={10} fontFamily="monospace">
                        {p.recall.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                <text x={275} y={272} fill={C.dim} fontSize={12} textAnchor="middle">
                  Delete percentage of corpus
                </text>
                <text x={20} y={140} fill={C.dim} fontSize={12} textAnchor="middle" transform="rotate(-90 20 140)">
                  Recall@10
                </text>
              </svg>
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
            0 deletes: <span style={{ color: C.green }}>recall 0.97</span> &middot; 30% deletes:{" "}
            <span style={{ color: C.orange }}>0.92</span> &middot; 50% deletes:{" "}
            <span style={{ color: C.red }}>0.85</span>
            <br />
            Graph degrades smoothly but the drop accelerates past ~20% deletes
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most systems set rebuild alarms at 20-30% tombstoned. Past that the recall loss becomes user-visible and the
            wasted traversal cost shows up in P99 latency.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Rebuild: full, segmented, or incremental
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Once tombstones hurt, the tombstoned nodes have to go. Three standard strategies trade off operational
            complexity against recall restoration speed.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                name: "Full rebuild",
                color: C.yellow,
                pros: ["simplest code path", "recall back to 0.97"],
                cons: ["downtime while rebuilding", "full CPU burn"],
                when: "Small indexes, scheduled windows",
              },
              {
                name: "Segment rotation",
                color: C.green,
                pros: ["no downtime", "new segment swaps in atomically"],
                cons: ["memory overhead during swap", "operational complexity"],
                when: "Large indexes, 24/7 uptime",
              },
              {
                name: "Incremental repair",
                color: C.orange,
                pros: ["continuous", "no downtime"],
                cons: ["code is subtle", "partial recall recovery"],
                when: "Streaming workloads with steady delete pressure",
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.name}
                </T>
                <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.6 }}>
                  <div style={{ color: C.green, fontWeight: "bold" }}>Pros</div>
                  {r.pros.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.red, fontWeight: "bold", marginTop: 6 }}>Cons</div>
                  {r.cons.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.dim, fontWeight: "bold", marginTop: 6 }}>When</div>
                  <div>{r.when}</div>
                </div>
              </div>
            ))}
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
            Every approach trades <span style={{ color: C.red }}>downtime</span> against{" "}
            <span style={{ color: C.red }}>operational</span> complexity
            <br />
            Production systems mix all three across tiers
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The segment-rotation pattern is the industry default for anything above 100M vectors - build the next
            segment in the background, atomically swap, free the old.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Index type affects how painful deletes are
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Not every index suffers equally. IVF-based indexes quantize the space into cells; deleting a doc only
            affects one cell and that cell can be rebuilt independently. Graph-based indexes pay more because the
            removed node participates in traversal. Layered indexes (HNSW + PQ) get the worst of both: graph holes plus
            stale codebooks.
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
              Delete pain by index family
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr 1.3fr 1.3fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>Index family</div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Delete cost
              </div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>Rebuild trigger</div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>Example</div>
              {[
                {
                  name: "IVF / IVF-PQ",
                  cost: "easy",
                  costColor: C.green,
                  trigger: "Cell-level rebuild at ~50% dead",
                  example: "FAISS IVF_PQ, Milvus IVF",
                },
                {
                  name: "HNSW",
                  cost: "moderate",
                  costColor: C.yellow,
                  trigger: "Full-graph rebuild at ~30% dead",
                  example: "Qdrant HNSW, Weaviate",
                },
                {
                  name: "HNSW + PQ",
                  cost: "hardest",
                  costColor: C.red,
                  trigger: "Graph + codebook retrain",
                  example: "Qdrant HNSW+PQ, Milvus HNSW_PQ",
                },
                {
                  name: "pgvector HNSW",
                  cost: "Historically hard",
                  costColor: C.orange,
                  trigger: "VACUUM + REINDEX",
                  example: "pgvector (issue tracked since 0.5)",
                },
              ].flatMap((r) => [
                <div
                  key={`label-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}08`,
                    borderRadius: 4,
                    color: C.purple,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`cost-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.costColor}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.costColor,
                    fontWeight: "bold",
                  }}
                >
                  {r.cost}
                </div>,
                <div
                  key={`trigger-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}06`,
                    borderRadius: 4,
                  }}
                >
                  {r.trigger}
                </div>,
                <div
                  key={`ex-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}06`,
                    borderRadius: 4,
                    color: C.dim,
                  }}
                >
                  {r.example}
                </div>,
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
            Pick the index family <span style={{ color: C.purple }}>after</span> you know your write/delete pattern
            <br />
            Static corpora: IVF-PQ - churn-heavy: HNSW or segment-rotated pgvector
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The biggest lesson: capacity plans must include delete pressure, not just insert rate. A system that ships
            fine with 10% monthly churn will grind at 40%.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.22 Sharding & Partitioning
// ───────────────────────────────────────────────────────────────────────────

export const Sharding = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            About 100M vectors fit on one node
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before thinking about shards, know the single-node ceiling. At d = 768, one float32 vector is 3 KB. An AWS
            r7i.24xlarge has 768 GB of RAM. With HNSW overhead (~100 bytes/vector) and working headroom for caches and
            fragmentation, roughly 100M vectors is the comfortable ceiling on one server. Beyond that, the index has to
            split.
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
              Single-node fit math on an r7i.24xlarge (768 GB RAM)
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
              Vectors: 100M &middot; 3 KB = <span style={{ color: C.cyan }}>300 GB</span>
              <br />
              HNSW graph: 100M &middot; 100 B = <span style={{ color: C.cyan }}>10 GB</span>
              <br />
              Cache + fragmentation headroom: <span style={{ color: C.cyan }}>~60 GB</span>
              <br />
              Total: <span style={{ color: C.green }}>~370 GB of 768 GB RAM</span> - comfortable
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { size: "10M", fit: "Trivial on a laptop", color: C.green },
              { size: "100M", fit: "One r7i.24xlarge", color: C.yellow },
              { size: "1B+", fit: "Must shard", color: C.red },
            ].map((r) => (
              <div
                key={r.size}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={16}>
                  {r.size}
                </T>
                <T color={C.bright} center size={13} style={{ marginTop: 4 }}>
                  {r.fit}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The single-node ceiling is not a wall; it is the point where the operational cost of one big box flips to
            the operational cost of coordinating many smaller boxes.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Random sharding: round-robin by vector id
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The simplest split. Hash each vector id into one of S shards; shard i holds every vector whose id hashes to
            i. Writes distribute evenly; memory per shard is predictable. The catch: every query must fan out to every
            shard because any shard can contain the nearest neighbor.
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
              Random sharding across 4 shards
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 240" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Four shard rectangles labeled shard 0 through shard 3, each holding a random scatter of colored dots
                  representing docs. A query icon at the left sends fan-out arrows to all four shards simultaneously,
                  illustrating that random sharding forces every query to hit every shard.
                </desc>
                <g>
                  <circle cx={40} cy={120} r={14} fill={C.yellow} />
                  <text x={40} y={124} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[0, 1, 2, 3].map((i) => {
                  const x = 120 + i * 95;
                  return (
                    <g key={`shard-${i}`}>
                      <line
                        x1={54}
                        y1={120}
                        x2={x + 30}
                        y2={60 + i * 30}
                        stroke={C.yellow}
                        strokeWidth={1.5}
                        opacity={0.8}
                      />
                      <rect
                        x={x}
                        y={40 + i * 30}
                        width={80}
                        height={80}
                        fill={`${C.yellow}08`}
                        stroke={C.yellow}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      <text
                        x={x + 40}
                        y={35 + i * 30}
                        fill={C.yellow}
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Shard {i}
                      </text>
                      {Array.from({ length: 12 }, (_, k) => (
                        <circle
                          key={`dot-${i}-${k}`}
                          cx={x + 10 + (k % 4) * 18}
                          cy={50 + i * 30 + Math.floor(k / 4) * 18}
                          r={4}
                          fill={[C.cyan, C.green, C.orange, C.red, C.purple, C.pink][(i + k) % 6]}
                        />
                      ))}
                    </g>
                  );
                })}
              </svg>
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
            Shard placement: <span style={{ color: C.yellow }}>shard(id) = hash(id) mod S</span>
            <br />
            Query cost = <span style={{ color: C.yellow }}>S</span> &middot; single-shard query
            <br />
            Every shard must fan out to reach every query
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Random sharding gives the best possible load balance and the worst possible query fan-out. For
            throughput-bound workloads the fan-out is fine; for latency-critical workloads it can blow the P99 budget.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Semantic sharding: one IVF cluster per shard
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Cluster the entire corpus with IVF first; each cluster becomes a shard. Now each shard holds vectors from
            one region of the embedding space. A query arrives, computes distance to each centroid (there are only S of
            them), and routes to the nearest nprobe shards. Dramatically fewer shards touched per query.
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
              Semantic sharding: query routes to 2 of 4 shards (nprobe = 2)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 240" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Four shard rectangles each labeled with a region of the embedding space: cats, dogs, animals, and
                  misc. A query icon on the left sends routing arrows to only the two nearest shards (cats and animals);
                  the other two shards are dimmed. Illustrates semantic sharding where IVF clustering decides which
                  shards answer a given query.
                </desc>
                <g>
                  <circle cx={40} cy={120} r={14} fill={C.green} />
                  <text x={40} y={124} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[
                  { label: "cats", active: true, color: C.green, cluster: "A" },
                  { label: "animals", active: true, color: C.green, cluster: "B" },
                  { label: "dogs", active: false, color: C.dim, cluster: "C" },
                  { label: "misc", active: false, color: C.dim, cluster: "D" },
                ].map((s, i) => {
                  const x = 120 + i * 95;
                  return (
                    <g key={`ss-${i}`}>
                      {s.active && (
                        <line x1={54} y1={120} x2={x + 30} y2={60 + i * 30} stroke={C.green} strokeWidth={2} />
                      )}
                      <rect
                        x={x}
                        y={40 + i * 30}
                        width={80}
                        height={80}
                        fill={s.active ? `${C.green}14` : `${C.dim}06`}
                        stroke={s.active ? C.green : C.dim}
                        strokeWidth={1.5}
                        rx={6}
                        opacity={s.active ? 1 : 0.4}
                      />
                      <text
                        x={x + 40}
                        y={35 + i * 30}
                        fill={s.color}
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {s.label}
                      </text>
                      <text
                        x={x + 40}
                        y={80 + i * 30 + 20}
                        fill={s.color}
                        fontSize={14}
                        fontWeight="bold"
                        textAnchor="middle"
                        opacity={s.active ? 1 : 0.4}
                      >
                        Cluster {s.cluster}
                      </text>
                    </g>
                  );
                })}
              </svg>
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
            Shard placement: <span style={{ color: C.green }}>shard(v) = argmin dist(v, centroid_i)</span>
            <br />
            Query cost = <span style={{ color: C.green }}>nprobe</span> shards scanned, not S
            <br />
            The corpus is partitioned by semantic region, not by id
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Load balance is worse than random sharding (popular clusters get hotter), but the per-query cost is much
            lower. Most production deployments accept the hotspot risk for the latency gain.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Every shard returns top-k; coordinator merges
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Regardless of placement strategy, the actual query-time protocol is the same: the coordinator sends the
            query to the chosen shards in parallel, each shard runs its local ANN search and returns its top-k, and the
            coordinator merges the lists into the final top-k. Total latency is bound by the slowest shard (fan-out
            tail), not the sum.
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
              Fan-out: 8 shards, each returns top-10, coordinator merges to top-10
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
              Step 1: coordinator broadcasts query to 8 shards in parallel
              <br />
              Step 2: each shard runs local ANN, returns <span style={{ color: C.orange }}>top-10</span>
              <br />
              Step 3: coordinator receives 80 candidates, merges by score, keeps{" "}
              <span style={{ color: C.orange }}>top-10</span>
              <br />
              Total latency = fan-out tail + merge cost (~ fast)
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 6,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`fanout-${i}`}
                style={{
                  padding: "8px 6px",
                  background: `${C.orange}14`,
                  border: `1px solid ${C.orange}30`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold size={12} center>
                  Shard {i}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 11, color: C.bright }}>Top-10</div>
              </div>
            ))}
          </div>
          <T color={C.orange} center size={14} style={{ marginTop: 8 }}>
            ↓ coordinator merges 8 &times; 10 = 80 candidates ↓
          </T>
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              background: `${C.green}20`,
              border: `1px solid ${C.green}40`,
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={16} center>
              Final top-10 returned to client
            </T>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tail-latency amplification means P99 gets worse with more shards - if each shard has a 1% chance of being
            slow, 8 shards have roughly an 8% chance the query waits.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Merged top-k is not single-node top-k
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The coordinator can only merge what each shard sends it. If the true top-10 are spread across shards, each
            shard&apos;s local top-10 may miss a true top-10 that sits at local position 11. Result: merged recall is
            lower than a hypothetical single-node top-10 would be. The fix is simple: ask each shard for a buffer -
            top-20 or top-50 - so the merge has more candidates to pick from.
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
              Recall of merged top-10 vs per-shard buffer size
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Per-shard limit
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Merged recall@10
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Note</div>
              {[
                { k: "top-10", recall: "0.88", note: "Buffer too small, misses spread hits" },
                { k: "top-20", recall: "0.94", note: "Typical production buffer" },
                { k: "top-50", recall: "0.97", note: "Matches single-node within 0.1%" },
                { k: "top-100", recall: "0.98", note: "Diminishing returns, higher network cost" },
              ].flatMap((r) => [
                <div
                  key={`pk-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.k}
                </div>,
                <div
                  key={`rec-${r.k}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.recall}
                </div>,
                <div
                  key={`note-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, color: C.dim, fontSize: 12 }}
                >
                  {r.note}
                </div>,
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
            Rule of thumb: per-shard buffer = <span style={{ color: C.red }}>k &middot; 2</span> to{" "}
            <span style={{ color: C.red }}>k &middot; 5</span> depending on how clustered your data is
            <br />
            Merged recall &ne; single-node recall unless the buffer is large enough
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the bug that ships first and gets fixed later. &quot;Sharded recall is lower than benchmarks&quot;
            is almost always a buffer issue.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Prune shards by filter predicate when possible
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Sharding and filtering interact. When the shard key aligns with a common filter field - for example
            tenant_id is the shard key and the query filters by tenant_id - the coordinator can skip the irrelevant
            shards entirely. When the filter is orthogonal to the shard key, every shard still has to be scanned.
          </T>
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
                Aligned filter (skip most shards)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Shard key: tenant_id
                <br />
                Filter: tenant_id = 42
                <br />
                <span style={{ color: C.green }}>fan-out to 1 of 8 shards</span>
                <br />
                Coordinator prunes the other 7
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
                Orthogonal filter (scan all shards)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Shard key: vector_id (random)
                <br />
                Filter: tenant_id = 42
                <br />
                <span style={{ color: C.red }}>fan-out to all 8 shards</span>
                <br />
                Cannot prune - tenant spans shards
              </div>
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
            Pick the shard key to match the <span style={{ color: C.purple }}>hottest filter field</span>
            <br />
            Multi-tenant apps almost always shard by tenant_id
            <br />
            Multi-region apps almost always shard by region
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Shard key choice is a one-way door. Change it later and every vector has to move. Get it right on day one by
            picking the filter that dominates production query traffic.
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
};
// ───────────────────────────────────────────────────────────────────────────
// 11.23 Replication & High Availability
// ───────────────────────────────────────────────────────────────────────────

export const Replication = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Read replicas: N copies, reads load-balanced
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Vector search is read-heavy. Most production workloads ship 10-100 queries for every write. The natural
            response: run several identical copies of the index (read replicas), put a load balancer in front, and let
            queries spread out. Each replica holds the full index in RAM and answers independently. Throughput scales
            linearly with replica count up to the write rate that the leader can distribute.
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
              Load balancer + 4 read replicas (N copies of the index)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 270" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Diagram showing a yellow load-balancer box on the left labeled LB with four arrows fanning out to four
                  cyan replica boxes on the right labeled R1 through R4. Each replica icon has a small index symbol
                  inside. Arrows from clients on the far left enter the load balancer. Illustrates read-replica
                  scale-out where each replica holds a full copy of the index and requests are distributed.
                </desc>
                <g>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <circle key={`client-${i}`} cx={30} cy={30 + i * 45} r={10} fill={C.green} />
                  ))}
                </g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`cl-line-${i}`}
                    x1={40}
                    y1={30 + i * 45}
                    x2={130}
                    y2={120}
                    stroke={C.dim}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                ))}
                <rect
                  x={130}
                  y={95}
                  width={80}
                  height={50}
                  fill={`${C.yellow}14`}
                  stroke={C.yellow}
                  strokeWidth={2}
                  rx={6}
                />
                <text x={170} y={125} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  LB
                </text>
                {[0, 1, 2, 3].map((i) => {
                  const y = 40 + i * 55;
                  return (
                    <g key={`rep-${i}`}>
                      <line x1={210} y1={120} x2={350} y2={y + 20} stroke={C.cyan} strokeWidth={1.5} />
                      <rect
                        x={350}
                        y={y}
                        width={130}
                        height={40}
                        fill={`${C.cyan}14`}
                        stroke={C.cyan}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      <text x={415} y={y + 25} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                        Replica R{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x={260} y={260} fill={C.dim} fontSize={11} textAnchor="middle">
                  Every replica is an identical copy of the index
                </text>
              </svg>
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
            QPS capacity &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica QPS</span>
            <br />
            Memory cost &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica RAM</span>
            <br />
            Scale reads cheaply; pay in memory instead of latency
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every managed vector DB sells replicas as a knob. The question is how they stay in sync with writes - the
            next sub-step.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Leader-follower writes with replication lag
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Writes have to go somewhere. The standard pattern is leader-follower: one node (the leader, or primary)
            accepts writes, then ships them asynchronously to the followers. Followers apply the write and become
            eventually consistent with the leader. The time window between &quot;leader applied the write&quot; and
            &quot;follower applied the write&quot; is replication lag.
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
              Typical replication lag in production
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { label: "Steady state", value: "50 ms", color: C.green, note: "P50 under normal load" },
                { label: "Moderate spike", value: "200 ms", color: C.yellow, note: "Write burst, healthy pipeline" },
                { label: "Heavy spike / rebuild", value: "2 s", color: C.red, note: "Followers fall behind" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.label}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 20, color: r.color }}>{r.value}</div>
                  <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                    {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Leader accepts write at <span style={{ color: C.yellow }}>t = 0</span>
            <br />
            Followers apply it at <span style={{ color: C.yellow }}>t = 50 ms to 2 s</span>
            <br />
            Queries in the lag window see <span style={{ color: C.red }}>stale results</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            &quot;I just added a document but the search does not find it&quot; is almost always lag, not a bug. Either
            wait out the window, or route the read-after-write to the leader.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Leader dies, follower promotes
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            If the leader fails, one follower is promoted to primary via a consensus algorithm (Raft in most modern
            vector DBs). Any writes that reached the leader but had not replicated are lost - this is the lag-window
            data-loss risk. Writers that fsync to a synchronous replica pay latency for every write but can survive a
            leader loss with zero data loss.
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
              Failover timeline
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
              t = 0 ms: leader processes write W<sub>n+1</sub>
              <br />t = 10 ms: leader crashes -{" "}
              <span style={{ color: C.red }}>
                W<sub>n+1</sub> never replicated
              </span>
              <br />
              t = 50 ms: followers notice, Raft election starts
              <br />
              t = 500 ms: new leader promoted, cluster accepts writes again
              <br />
              <span style={{ color: C.red }}>Lost window: writes in-flight at t=0 to t=10 ms</span>
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
                Async replication (default)
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Fast writes: ack at leader</div>
                <div>&bull; At-most-50-ms lag typical</div>
                <div>
                  &bull; <span style={{ color: C.red }}>Possible data loss on failover</span>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Sync replication
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Slower writes: ack after 1 follower applies</div>
                <div>&bull; Zero data loss on failover</div>
                <div>
                  &bull; <span style={{ color: C.red }}>Write latency &asymp; 2x async</span>
                </div>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most vector DBs default to async. Pick sync only when a few lost writes in a rare failover would cost more
            than the steady-state latency hit.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Durability: if the RAM dies, is the index gone?
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Vector indexes live in RAM for speed. RAM is volatile. What happens if every node restarts at once? The
            answer depends on the persistence model. Three common patterns: WAL (write-ahead log) on disk, periodic
            snapshots, and source-of-truth rehydration. Most production systems layer all three.
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
              Durability mechanisms compared
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  name: "WAL on disk",
                  color: C.green,
                  how: "Every write appended to a log before ack",
                  rpo: "RPO = 0 (synchronous) or 1 batch",
                },
                {
                  name: "Periodic snapshots",
                  color: C.yellow,
                  how: "Dump the index to disk every N minutes",
                  rpo: "RPO = interval, faster startup",
                },
                {
                  name: "Rehydrate from source",
                  color: C.red,
                  how: "Re-read every doc from the app DB, re-embed",
                  rpo: "RPO = 0 but slow",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={14} center>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }} center>
                    {r.how}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                    {r.rpo}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            If every RAM copy dies, the index is only as durable as its{" "}
            <span style={{ color: C.orange }}>WAL + snapshot</span>
            <br />
            The source-of-truth DB is the ultimate recovery path
            <br />
            Test it before the outage, not during
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Many teams never test &quot;full cluster loss&quot;. The first time it happens, they discover the snapshot
            cadence is 24 hours and the WAL retention is 1 hour, and they are stuck re-embedding for days.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recovery time: WAL vs re-embed from source
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Worst case: the entire cluster dies. Recovery time depends entirely on what is cached. A fresh snapshot plus
            WAL replay takes minutes to hours; a full re-embed from the source documents takes days to weeks and costs
            real money.
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
              Recovery time for a 100M-vector corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>Strategy</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Time</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>Why</div>
              {[
                {
                  name: "Snapshot + WAL replay",
                  time: "10 min - 2 hours",
                  why: "Disk I/O bound, graph pages stream in",
                  color: C.green,
                },
                {
                  name: "WAL-only replay (no snapshot)",
                  time: "~12 hours",
                  why: "Every insert replayed from scratch",
                  color: C.yellow,
                },
                {
                  name: "Re-embed from source DB",
                  time: "1 - 14 days",
                  why: "Embedding API throughput + $ billed per token",
                  color: C.red,
                },
              ].flatMap((r) => [
                <div
                  key={`name-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}10`,
                    borderRadius: 4,
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`time-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.time}
                </div>,
                <div
                  key={`why-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}08`,
                    borderRadius: 4,
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.why}
                </div>,
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
            RTO budget = <span style={{ color: C.red }}>snapshot cadence + WAL replay rate</span>
            <br />
            Pick snapshot interval that matches your RTO target
            <br />
            Re-embed is the fallback of last resort, measured in days
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Put this math into the runbook before a real outage. The cost of a one-day outage at 10K QPS usually dwarfs
            the cost of snapshots every 30 minutes.
          </T>
        </Box>
      </Reveal>
      {sub < 4 && (
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.24 Hybrid Search
// ───────────────────────────────────────────────────────────────────────────

export const HybridSearch = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Embeddings blur exact terms - SKUs, proper nouns, rare tokens
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Semantic embeddings are trained to reward meaning. Two docs saying the same thing with different words end
            up close in the embedding space. The flip side is that a doc with a unique identifier (SKU-A4291, &quot;Dr.
            Whiskers&quot;, &quot;kernel panic 0x7B&quot;) gets no special treatment - the exact token is smoothed into
            its neighborhood. Semantic search silently misses lookups where the word itself is the signal.
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
              What vectors lose
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { name: "SKUs and IDs", ex: "SKU-A4291, ORD-88213", loss: "Exact match required" },
                { name: "Proper nouns", ex: "Rajul, Mumbai, AlphaFold", loss: "Rare in training" },
                { name: "Rare terms", ex: "Tabby, kernel panic, RoPE", loss: "Blurred into neighbors" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}08`,
                    border: `1px solid ${C.cyan}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={14} center>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright }}>{r.ex}</div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                    {r.loss}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Vector search excels at <span style={{ color: C.cyan }}>meaning</span>
            <br />
            Vector search misses <span style={{ color: C.red }}>literal tokens</span>
            <br />
            Hybrid search combines vectors with keyword search to recover both
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The rescue is classic BM25 lexical search running alongside the vector index. Merge the two ranked lists and
            you keep the best of each.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            BM25: term frequency x inverse document frequency
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            BM25 is the lexical-search workhorse, shipped in every production search engine since Lucene. For a query of
            terms t, a document d scores by summing the IDF of each term (rare terms count more) times a saturating
            term-frequency contribution from d (more appearances help, but with diminishing returns).
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
              BM25 score formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              BM25(q, d) = <span style={{ color: C.yellow }}>&Sigma;</span>
              <sub>t &isin; q</sub> IDF(t) &middot; TF<sub>norm</sub>(t, d)
              <br />
              IDF(t) = log(<span style={{ color: C.yellow }}>N / df(t)</span>) &nbsp;-&nbsp; term frequency in corpus
              <br />
              TF<sub>norm</sub>(t, d) = tf(t, d) &middot; (k<sub>1</sub> + 1) / (tf(t, d) + k<sub>1</sub> &middot;
              length-adjustment)
              <br />k<sub>1</sub> &asymp; 1.2 &middot; b &asymp; 0.75 (standard Lucene defaults)
            </div>
          </div>
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
              Worked example: query &quot;cats domesticated&quot; against the cat corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 3fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px" }}>ID</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px" }}>Text</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>BM25</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Rank</div>
              {[
                { id: 1, text: "Cats are small domesticated carnivores", bm25: "4.82", rank: 1 },
                { id: 5, text: "Tigers are striped cats", bm25: "2.30", rank: 2 },
                { id: 3, text: "Lions are big cats that live in Africa", bm25: "2.10", rank: 3 },
                { id: 8, text: "The dog chased the cat", bm25: "1.90", rank: 4 },
                { id: 7, text: "Kittens grow up to be cats", bm25: "1.70", rank: 5 },
              ].flatMap((r) => [
                <div
                  key={`id-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.yellow}08`, borderRadius: 4, color: C.yellow }}
                >
                  {r.id}
                </div>,
                <div key={`text-${r.id}`} style={{ padding: "6px 8px", background: `${C.yellow}08`, borderRadius: 4 }}>
                  {r.text}
                </div>,
                <div
                  key={`score-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.yellow}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.yellow,
                    fontWeight: "bold",
                  }}
                >
                  {r.bm25}
                </div>,
                <div
                  key={`rank-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.yellow}08`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {r.rank}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Doc 1 scores highest because it contains both query terms and is the shortest match. BM25&apos;s
            length-normalization keeps it fair across docs of different sizes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Run vector ANN and BM25 in parallel, keep both ranked lists
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Given the query, fire both systems simultaneously. The vector index returns its top-N by embedding
            similarity; the BM25 index returns its top-N by lexical score. Neither list needs to know the other exists
            at this stage - they each do what they are good at. Merging is a separate step.
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
              Two independent rankers run in parallel
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Flow diagram showing a query icon on the left splitting into two parallel lanes. The upper lane flows
                  to a vector ANN box that emits a ranked list of top-N docs. The lower lane flows to a BM25 box that
                  emits another ranked list. Both lists arrive at a merge node on the right labeled RRF. Illustrates the
                  hybrid-search parallel-ranker architecture.
                </desc>
                <circle cx={40} cy={110} r={16} fill={C.green} />
                <text x={40} y={115} fill={C.bg} fontSize={12} fontWeight="bold" textAnchor="middle">
                  q
                </text>
                <line x1={56} y1={110} x2={160} y2={60} stroke={C.cyan} strokeWidth={2} />
                <line x1={56} y1={110} x2={160} y2={160} stroke={C.yellow} strokeWidth={2} />
                <rect
                  x={160}
                  y={40}
                  width={130}
                  height={50}
                  fill={`${C.cyan}14`}
                  stroke={C.cyan}
                  strokeWidth={1.5}
                  rx={6}
                />
                <text x={225} y={70} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Vector ANN
                </text>
                <rect
                  x={160}
                  y={140}
                  width={130}
                  height={50}
                  fill={`${C.yellow}14`}
                  stroke={C.yellow}
                  strokeWidth={1.5}
                  rx={6}
                />
                <text x={225} y={170} fill={C.yellow} fontSize={14} fontWeight="bold" textAnchor="middle">
                  BM25
                </text>
                <rect
                  x={320}
                  y={40}
                  width={120}
                  height={50}
                  fill={`${C.cyan}08`}
                  stroke={C.cyan}
                  strokeWidth={1}
                  rx={6}
                />
                <text x={380} y={70} fill={C.cyan} fontSize={12} textAnchor="middle">
                  Top-N ranked list
                </text>
                <rect
                  x={320}
                  y={140}
                  width={120}
                  height={50}
                  fill={`${C.yellow}08`}
                  stroke={C.yellow}
                  strokeWidth={1}
                  rx={6}
                />
                <text x={380} y={170} fill={C.yellow} fontSize={12} textAnchor="middle">
                  Top-N ranked list
                </text>
                <line x1={440} y1={65} x2={470} y2={110} stroke={C.green} strokeWidth={2} />
                <line x1={440} y1={165} x2={470} y2={110} stroke={C.green} strokeWidth={2} />
                <circle cx={485} cy={110} r={18} fill={`${C.green}20`} stroke={C.green} strokeWidth={2} />
                <text x={485} y={115} fill={C.green} fontSize={13} fontWeight="bold" textAnchor="middle">
                  RRF
                </text>
              </svg>
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
            Vector returns top-<span style={{ color: C.cyan }}>N</span> by similarity
            <br />
            BM25 returns top-<span style={{ color: C.yellow }}>N</span> by lexical score
            <br />
            Merge them in the next step
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The two systems can even live on different nodes. The only shared state is the query itself and the final
            merge point.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Reciprocal Rank Fusion - RRF
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Combine two ranked lists without needing their raw scores (BM25 and cosine live on different scales). For
            each doc, compute 1 / (k + rank) on every ranker that returned it, then sum. The constant k dampens the
            contribution of low-ranking docs; the Lucene-standard value is k = 60.
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
              RRF formula with standard k = 60
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              RRF(d) = <span style={{ color: C.orange }}>&Sigma;</span>
              <sub>r &isin; rankers</sub> 1 / (k + rank<sub>r</sub>(d))
              <br />k = <span style={{ color: C.orange }}>60</span> &middot; standard since the 2009 TREC paper
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
            <T color={C.orange} bold center size={16}>
              RRF on the cat corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.6fr 1fr 1fr 1.2fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px" }}>Doc</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Vec rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                BM25 rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                1 / (60 + rank)
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>RRF</div>
              {[
                { id: 1, vr: 2, br: 1, calc: "1/62 + 1/61", rrf: "0.0326" },
                { id: 3, vr: 1, br: 3, calc: "1/61 + 1/63", rrf: "0.0323" },
                { id: 5, vr: 4, br: 2, calc: "1/64 + 1/62", rrf: "0.0317" },
                { id: 7, vr: 3, br: 5, calc: "1/63 + 1/65", rrf: "0.0313" },
                { id: 8, vr: 5, br: 4, calc: "1/65 + 1/64", rrf: "0.0310" },
              ].flatMap((r, i) => [
                <div
                  key={`id-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: i === 0 ? `${C.green}20` : `${C.orange}08`,
                    borderRadius: 4,
                    color: i === 0 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  Doc {r.id}
                </div>,
                <div
                  key={`vr-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.vr}
                </div>,
                <div
                  key={`br-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.br}
                </div>,
                <div
                  key={`calc-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.orange}06`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.calc}
                </div>,
                <div
                  key={`rrf-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: i === 0 ? `${C.green}20` : `${C.orange}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: i === 0 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {r.rrf}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Doc 1 wins because it ranked well on both. RRF rewards doc consensus; docs that only one ranker likes fall
            below the consensus winners.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            &quot;tabby cat genetics&quot; - vector vs BM25 vs hybrid
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Concrete side-by-side. Query: &quot;tabby cat genetics&quot;. Pure vector finds semantically cat-ish docs
            and misses &quot;tabby&quot;. Pure BM25 finds the exact &quot;tabby&quot; hit but ranks unrelated fluff with
            the word in it. Hybrid RRF merges: real tabby-cat doc at the top.
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
              Top-5 per strategy for &quot;tabby cat genetics&quot;
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  name: "Pure vector",
                  color: C.cyan,
                  results: [
                    "Lions are big cats (near miss)",
                    "Tigers are striped cats (near miss)",
                    "Cats are small carnivores",
                    "Kittens grow up to be cats",
                    "My cat sat on the mat",
                  ],
                  note: "No hit on tabby - the actual topic",
                },
                {
                  name: "Pure BM25",
                  color: C.yellow,
                  results: [
                    "Tabby cat coat color genetics",
                    "Abyssinian cat tabby pattern",
                    "Genetics 101 textbook (unrelated)",
                    "Random tabby mention in a tweet",
                    "Tabby bar and grill menu",
                  ],
                  note: "Off-topic exact matches rank high",
                },
                {
                  name: "Hybrid (RRF)",
                  color: C.green,
                  results: [
                    "Tabby cat coat color genetics",
                    "Abyssinian cat tabby pattern",
                    "Tigers are striped cats",
                    "Cats are small carnivores",
                    "Kittens grow up to be cats",
                  ],
                  note: "Tabby + genetics concentrated at the top",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  style={{
                    padding: "10px 12px",
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={s.color} bold center size={14}>
                    {s.name}
                  </T>
                  <ol style={{ marginTop: 6, paddingLeft: 18, fontSize: 12, color: C.bright, lineHeight: 1.6 }}>
                    {s.results.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                  <T color={C.dim} size={11} style={{ marginTop: 6 }}>
                    {s.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Hybrid wins when the query has <span style={{ color: C.red }}>both</span> exact and semantic intent
            <br />
            Pure vector loses <span style={{ color: C.red }}>tabby</span> - pure BM25 loses{" "}
            <span style={{ color: C.red }}>cat genetics</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            If product queries ever include a specific term that must match exactly, hybrid is almost always worth
            enabling.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Weighted RRF and when hybrid is worth it
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Production deployments often weight the two rankers. The standard form is score(d) = alpha &middot; RRF_vec
            + beta &middot; RRF_bm25. Typical values: alpha = 0.7, beta = 0.3 when the corpus is mostly natural
            language; flip to 0.3/0.7 for code or catalog data where literal tokens dominate. Run A/B tests to find the
            right weights on your data.
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
              Weighted RRF formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              score(d) = <span style={{ color: C.purple }}>alpha</span> &middot; RRF<sub>vec</sub>(d) +{" "}
              <span style={{ color: C.purple }}>beta</span> &middot; RRF<sub>bm25</sub>(d)
              <br />
              Typical defaults: <span style={{ color: C.purple }}>alpha = 0.7, beta = 0.3</span>
              <br />
              Tune via held-out recall on your own data
            </div>
          </div>
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
              When hybrid is worth the cost
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
                  name: "Hybrid wins",
                  color: C.green,
                  items: [
                    "Mixed natural-language + SKU queries",
                    "Multi-lingual or technical corpora",
                    "Long-tail identifier lookups",
                    "Retrieval-augmented generation (RAG)",
                  ],
                },
                {
                  name: "Hybrid not worth it",
                  color: C.red,
                  items: [
                    "Pure chat or FAQ (vectors already great)",
                    "Very short queries with no identifiers",
                    "Strict latency budgets (< 10 ms)",
                    "BM25 index is itself unmaintained",
                  ],
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.name}
                  </T>
                  <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                    {r.items.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Weighted hybrid adds operational complexity - two indexes, two query paths, one merge. Turn it on only after
            you measure a specific quality gap vectors alone cannot close.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.25 Rerankers
// ───────────────────────────────────────────────────────────────────────────

export const Rerankers = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two-stage retrieval: ANN returns top-100, rerank returns top-10
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Accurate retrieval does not need to be accurate everywhere - only at the top. Stage 1 uses ANN to quickly
            pull 100 roughly-relevant candidates from a billion-vector index. Stage 2 is a slower but smarter model that
            re-scores those 100 candidates. Total cost: fast over the billion, slow over the hundred. The win is that
            stage-2 accuracy matters only on k=100, not on N=1B.
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
              Stage 1: ANN returns top-100 candidates (fast, approximate)
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
              Corpus: <span style={{ color: C.cyan }}>N = 1B</span> vectors
              <br />
              ANN latency: <span style={{ color: C.green }}>~5 ms</span> per query (HNSW)
              <br />
              Output: <span style={{ color: C.cyan }}>top-100 candidates</span>, may include some near-misses
              <br />
              Candidate quality is fine at k=100, not at k=10
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { stage: "Stage 1 - retrieval", cost: "5 ms", tech: "HNSW / IVF-PQ", size: "1B -> 100", color: C.cyan },
              { stage: "Stage 2 - rerank", cost: "100 ms", tech: "cross-encoder", size: "100 -> 10", color: C.yellow },
              { stage: "Final", cost: "~105 ms", tech: "combined", size: "10", color: C.green },
            ].map((r) => (
              <div
                key={r.stage}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={14} center>
                  {r.stage}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: C.bright }}>{r.cost}</div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  {r.tech}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: r.color }}>{r.size}</div>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The two-stage pattern is standard in search engines, ads systems, and RAG pipelines. The only real question
            is what the stage-2 model is.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Cross-encoder: query and doc concatenated into one transformer pass
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            A cross-encoder takes the query and the candidate doc, concatenates their tokens into one input stream
            (often &quot;[CLS] query [SEP] doc [SEP]&quot;), runs the whole thing through a transformer, and emits a
            single relevance score. Because query and doc tokens share attention inside the stack, the model can
            condition on exactly which part of the doc matches which part of the query.
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
              Cross-encoder architecture
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 200" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Cross-encoder diagram. Input row shows tokens labeled CLS, query tokens, SEP, doc tokens, SEP,
                  concatenated in a single stream. Arrows go up into a single transformer stack represented as a tall
                  rounded rectangle. The top emits a single relevance score circle. Illustrates that query and doc
                  tokens share attention inside one forward pass.
                </desc>
                <g>
                  {[
                    { label: "[CLS]", color: C.cyan },
                    { label: "query", color: C.cyan },
                    { label: "query", color: C.cyan },
                    { label: "[SEP]", color: C.dim },
                    { label: "doc", color: C.yellow },
                    { label: "doc", color: C.yellow },
                    { label: "doc", color: C.yellow },
                    { label: "doc", color: C.yellow },
                    { label: "[SEP]", color: C.dim },
                  ].map((t, i) => (
                    <g key={`tok-${i}`}>
                      <rect
                        x={40 + i * 48}
                        y={150}
                        width={42}
                        height={30}
                        fill={`${t.color}14`}
                        stroke={t.color}
                        strokeWidth={1}
                        rx={4}
                      />
                      <text x={40 + i * 48 + 21} y={170} fill={t.color} fontSize={10} textAnchor="middle">
                        {t.label}
                      </text>
                      <line
                        x1={40 + i * 48 + 21}
                        y1={150}
                        x2={40 + i * 48 + 21}
                        y2={120}
                        stroke={C.dim}
                        strokeWidth={1}
                      />
                    </g>
                  ))}
                </g>
                <rect
                  x={40}
                  y={50}
                  width={468}
                  height={70}
                  fill={`${C.yellow}12`}
                  stroke={C.yellow}
                  strokeWidth={2}
                  rx={6}
                />
                <text x={274} y={95} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  Transformer (full attention across all tokens)
                </text>
                <line x1={274} y1={50} x2={274} y2={30} stroke={C.green} strokeWidth={2} />
                <circle cx={274} cy={20} r={15} fill={C.green} />
                <text x={274} y={24} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                  Score
                </text>
              </svg>
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
            Input = [CLS] query [SEP] doc [SEP]
            <br />
            One transformer pass &middot; one scalar output
            <br />
            Score = P(doc is relevant to query)
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The architecture is dead simple. The expense is running it per candidate: each doc is a full forward pass
            through the model.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Bi-encoder cosine cannot see query-doc token interactions
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Why is the cross-encoder better than just comparing two vectors? A bi-encoder produces one vector per query
            and one per doc, then measures cosine. All token-level information is collapsed into those two vectors
            before they meet. The cross-encoder keeps the tokens separate and lets full attention decide which
            interactions matter.
          </T>
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
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Bi-encoder (what stage 1 does)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Query -&gt; encoder -&gt; <span style={{ color: C.red }}>q_vec</span>
                <br />
                Doc -&gt; encoder -&gt; <span style={{ color: C.red }}>d_vec</span>
                <br />
                Score = cosine(q_vec, d_vec)
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                No token-level interaction. Everything gets pooled into a single vector first.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Cross-encoder (what stage 2 does)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                concat(query, doc) -&gt; transformer
                <br />
                Full attention across all tokens
                <br />
                Score = one scalar
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                Query tokens attend to doc tokens and vice versa. Maximally informed score.
              </T>
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
            Typical quality jump: <span style={{ color: C.green }}>+10 to +20 MRR@10</span> over bi-encoder alone
            <br />
            MS-MARCO leaderboards: cross-encoders win on almost every benchmark
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The price: you cannot pre-compute cross-encoder scores the way you pre-compute embeddings. Every (query,
            doc) pair is a fresh forward pass.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Rerank: score each candidate, sort, return top-10
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Once stage 1 has supplied the 100 candidates, run the cross-encoder once per candidate with the same query.
            Sort by score, return the top-10 to the user. The rerank does not change which candidates exist - it only
            changes their ordering. A bad stage-1 candidate set cannot be fixed at stage 2.
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
              Rerank 100 candidates to top-10
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
              For candidate d in top-100:
              <br />
              &nbsp;&nbsp;score(d) = <span style={{ color: C.orange }}>cross_encoder(query, d)</span>
              <br />
              Sort candidates by score desc
              <br />
              Return top-<span style={{ color: C.orange }}>10</span>
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
            <T color={C.orange} bold center size={16}>
              Before rerank (stage 1) vs after rerank (stage 2)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 2fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px" }}>Doc</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px" }}>Text</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                ANN rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Rerank</div>
              {[
                { id: 1, text: "Cats are small domesticated carnivores", ann: 4, rr: 1 },
                { id: 7, text: "Kittens grow up to be cats", ann: 2, rr: 2 },
                { id: 3, text: "Lions are big cats that live in Africa", ann: 1, rr: 3 },
                { id: 4, text: "My cat sat on the mat", ann: 7, rr: 4 },
                { id: 5, text: "Tigers are striped cats", ann: 3, rr: 5 },
              ].flatMap((r) => [
                <div
                  key={`id-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}08`, borderRadius: 4, color: C.orange }}
                >
                  {r.id}
                </div>,
                <div key={`text-${r.id}`} style={{ padding: "6px 8px", background: `${C.orange}08`, borderRadius: 4 }}>
                  {r.text}
                </div>,
                <div
                  key={`ann-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.orange}06`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.dim,
                  }}
                >
                  {r.ann}
                </div>,
                <div
                  key={`rr-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: r.rr === 1 ? `${C.green}20` : `${C.orange}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.rr === 1 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {r.rr}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The reranker is not psychic - stage 1 has to include the right doc in its top-100 for the reranker to
            promote it. Recall at stage 1 is still the upstream bottleneck.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Latency cost: 100 rerank runs is about 100 ms on an A10 GPU
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Cross-encoders are small transformers - BERT-base or BERT-large sized. On a modern GPU, one (query, doc)
            forward pass is ~1 ms. 100 candidates = ~100 ms of latency added on top of stage 1. That is big enough to
            notice, small enough to justify for quality-critical paths.
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
              Reranker latency on production GPUs
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 0.8fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>GPU</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Per-pair</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                100 candidates
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>QPS cap</div>
              {[
                { gpu: "T4 (older)", pair: "5 ms", hundred: "500 ms", qps: "2 / sec" },
                { gpu: "A10", pair: "1 ms", hundred: "100 ms", qps: "10 / sec" },
                { gpu: "A100", pair: "0.5 ms", hundred: "50 ms", qps: "20 / sec" },
                { gpu: "H100", pair: "0.3 ms", hundred: "30 ms", qps: "33 / sec" },
              ].flatMap((r) => [
                <div
                  key={`g-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, color: C.red }}
                >
                  {r.gpu}
                </div>,
                <div
                  key={`p-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.pair}
                </div>,
                <div
                  key={`h-${r.gpu}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.hundred}
                </div>,
                <div
                  key={`q-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.qps}
                </div>,
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
            Reranker latency = <span style={{ color: C.red }}>candidates &middot; per-pair cost</span>
            <br />
            Batch all 100 pairs on one GPU to hit the numbers above
            <br />
            Dropping to top-50 halves the latency
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            In RAG, this extra 100 ms usually trades against an LLM call that already costs 500 ms. Rerankers are
            popular because they fit comfortably in that budget.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production models: Cohere Rerank, BGE-reranker, MS-MARCO cross-encoders
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Three families dominate production. Cohere&apos;s managed API ships general-purpose rerankers with a simple
            REST call. BGE and similar open-weight models from BAAI run locally on GPU. MS-MARCO cross-encoders are the
            classic open-source baseline and still competitive. Each has different latency, quality, and operational
            stories.
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
              Production reranker models
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
                  name: "Cohere Rerank 3",
                  kind: "Managed API",
                  size: "~400M params",
                  note: "Multi-lingual, context 4K tokens, simple REST",
                },
                {
                  name: "BGE-reranker v2",
                  kind: "Open weights",
                  size: "base 268M / large 560M",
                  note: "BAAI release, self-host on A10/A100, BGE-reranker-m3 is multilingual",
                },
                {
                  name: "MS-MARCO cross-encoder",
                  kind: "Open weights",
                  size: "MiniLM ~33M, BERT-base 110M",
                  note: "Sentence-Transformers, classic baseline, smallest latency",
                },
                {
                  name: "RankGPT / LLM-as-judge",
                  kind: "Managed LLM",
                  size: "listwise, LLM-driven",
                  note: "Highest quality, 10x latency, expensive",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={15}>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright }}>
                    {r.kind} &middot; {r.size}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Start with <span style={{ color: C.purple }}>MS-MARCO MiniLM</span> as the cheap baseline
            <br />
            Move to <span style={{ color: C.purple }}>BGE-reranker</span> or{" "}
            <span style={{ color: C.purple }}>Cohere</span> when you need quality
            <br />
            Reserve <span style={{ color: C.purple }}>LLM-as-judge</span> for offline evals
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Swap the reranker without touching stage 1. The interface is always (query, candidates) -&gt; reordered
            candidates, which makes A/B tests straightforward.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.26 Multi-vector Retrieval (ColBERT-style)
// ───────────────────────────────────────────────────────────────────────────

// Token-level similarity grid used in sub=3. Query tokens on one axis, doc
// tokens on the other. Cell value is the cosine similarity; highlighted cell
// per row is the max-match for that query token.
const COLBERT_Q_TOKENS = ["cats", "live", "outside"];
const COLBERT_D_TOKENS = ["cats", "are", "small", "carnivores", "that"];
const COLBERT_SIM = [
  [0.94, 0.22, 0.18, 0.35, 0.21],
  [0.11, 0.17, 0.15, 0.25, 0.28],
  [0.19, 0.14, 0.21, 0.17, 0.26],
];
const COLBERT_MAX_PER_Q = COLBERT_SIM.map((row) => Math.max(...row));

export const MultiVectorRetrieval = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            One vector per doc blurs token-level signal
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            A single dense embedding per document is the workhorse of vector search. It is compact, fast to compare, and
            great on short text. For long documents - paragraphs, articles, chapters - the single-vector representation
            loses fidelity: every token is averaged into one 768-dim summary. Rare terms and specific phrasing get
            blurred into the bulk meaning.
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
              One paragraph, one vector, lossy averaging
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
              &quot;Cats are small domesticated carnivores that originated in the fertile crescent...&quot;
              <br />
              &darr; encode &darr;
              <br />
              <span style={{ color: C.cyan }}>[0.81, 0.12, 0.45, ..., 0.22]</span> (768 dims, one per doc)
              <br />
              Every token&apos;s contribution is <span style={{ color: C.red }}>averaged</span> into that one vector
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
            Long doc + single vector = <span style={{ color: C.red }}>lossy compression</span>
            <br />
            Rare terms and specific phrasing blur into the average
            <br />
            Multi-vector retrieval keeps one vector per token instead
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the motivation for ColBERT and the whole multi-vector family. Keep more information, rank better,
            pay in storage.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            ColBERT idea: one vector per token
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ColBERT (Contextualized Late Interaction over BERT, Stanford 2020) keeps every token&apos;s contextual
            embedding instead of pooling to a single doc vector. A 200-token document becomes 200 vectors. Queries are
            also expanded to per-token embeddings. Scoring happens at token granularity - the &quot;late
            interaction&quot; - rather than after pooling.
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
              ColBERT token expansion
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
              Doc &quot;Cats are small domesticated carnivores ...&quot;
              <br />
              &darr; BERT-style encode, keep every token &darr;
              <br />
              <span style={{ color: C.yellow }}>~200 vectors per document</span> (one per token)
              <br />
              Query &quot;where do cats live&quot; &rarr; <span style={{ color: C.yellow }}>~5 query tokens</span>
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
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Single-vector retrieval
              </T>
              <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 1 vector per doc</div>
                <div>&bull; Cosine similarity, scalar output</div>
                <div>&bull; Fast and compact</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Multi-vector (ColBERT)
              </T>
              <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; ~200 vectors per doc (per token)</div>
                <div>&bull; Max-sim aggregation across tokens</div>
                <div>&bull; More accurate on long text</div>
              </div>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ColBERT is still a dense-embedding model; only the pooling step is dropped. Otherwise the pipeline looks
            like any other BERT encoder.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Max-sim: for each query token, find the best matching doc token, sum
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Given Q query vectors and D doc vectors, compute pairwise cosine (or dot) similarities - a Q x D matrix. For
            each query token, take the maximum similarity across all doc tokens. Sum those maxes over the query tokens.
            This is &quot;max-sim over late interaction&quot;. It rewards a doc that matches each query token somewhere,
            even if no single doc token is a perfect match for everything.
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
              Max-sim formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              score(q, d) = <span style={{ color: C.green }}>&Sigma;</span>
              <sub>i &isin; query tokens</sub> max<sub>j &isin; doc tokens</sub> q<sub>i</sub> &middot; d<sub>j</sub>
              <br />
              Sum of per-query-token max similarities against all doc tokens
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Max-sim keeps the best signal per query token. A doc that matches &quot;cats&quot; perfectly but does not
            mention &quot;genetics&quot; at all scores lower than one that hits both, even if neither match is perfect.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Max-sim walkthrough on the cat corpus
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Concrete run. Query is &quot;cats live outside&quot; (3 tokens). Doc is &quot;Cats are small carnivores
            that&quot; (5 tokens). Compute the 3 x 5 similarity matrix, highlight the max in each row, sum them. The
            total is the score for this (query, doc) pair.
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
              3 x 5 similarity grid (query rows, doc columns)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: `0.9fr repeat(${COLBERT_D_TOKENS.length}, 1fr) 0.8fr`,
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div></div>
              {COLBERT_D_TOKENS.map((t, i) => (
                <div
                  key={`d-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.orange}08`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {t}
                </div>
              ))}
              <div
                style={{
                  padding: "6px 4px",
                  background: `${C.green}14`,
                  borderRadius: 4,
                  textAlign: "center",
                  color: C.green,
                  fontWeight: "bold",
                }}
              >
                max
              </div>
              {COLBERT_Q_TOKENS.map((qTok, i) => (
                <div key={`row-${i}`} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: `${C.orange}14`,
                      borderRadius: 4,
                      color: C.orange,
                      fontWeight: "bold",
                    }}
                  >
                    {qTok}
                  </div>
                  {COLBERT_SIM[i].map((s, j) => {
                    const isMax = s === COLBERT_MAX_PER_Q[i];
                    return (
                      <div
                        key={`c-${i}-${j}`}
                        style={{
                          padding: "6px 4px",
                          background: isMax ? `${C.green}30` : `${C.orange}06`,
                          borderRadius: 4,
                          textAlign: "center",
                          color: isMax ? C.green : C.bright,
                          fontWeight: isMax ? "bold" : "normal",
                        }}
                      >
                        {s.toFixed(2)}
                      </div>
                    );
                  })}
                  <div
                    style={{
                      padding: "6px 4px",
                      background: `${C.green}14`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: C.green,
                      fontWeight: "bold",
                    }}
                  >
                    {COLBERT_MAX_PER_Q[i].toFixed(2)}
                  </div>
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Score = 0.94 + 0.28 + 0.26 = <span style={{ color: C.green }}>1.48</span>
            <br />
            Strong pick on &quot;cats&quot; drags the overall score up
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Notice that no doc token is perfect for &quot;live&quot; or &quot;outside&quot;, but each query token is
            still scored against its nearest neighbor. This robustness is what single-vector cosine throws away.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Storage cost: N x tokens x d bytes (20 to 100x larger)
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The tradeoff is memory. Single-vector retrieval stores one 768-dim vector per doc. Multi-vector stores one
            per token. At ~200 tokens/doc, that is 200x more vectors. Compression (PQ on the token vectors) and shorter
            vector widths reduce the overhead to 20-50x in practice, but ColBERT-style indexes are always much bigger
            than single-vector ones.
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
              Memory at N = 1M, d = 768, 200 tokens/doc
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { label: "Single-vector (float32)", size: "3 GB", ratio: "1x baseline", color: C.green },
                { label: "ColBERT raw (float32)", size: "600 GB", ratio: "~200x larger", color: C.red },
                { label: "ColBERT compressed (PQ)", size: "~60 GB", ratio: "~20x larger", color: C.yellow },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.label}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color }}>{r.size}</div>
                  <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                    {r.ratio}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Multi-vector storage = <span style={{ color: C.red }}>N &middot; tokens &middot; d</span> bytes
            <br />
            Typical 20-100x the single-vector footprint
            <br />
            PQ and ColBERTv2&apos;s residual compression take it down to 20x at good quality
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Multi-vector is a great pick when retrieval quality matters more than cost. For 1B-scale workloads, expect
            to pay for extra nodes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production support: Vespa, Qdrant native multi-vector, Elasticsearch
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A few production systems handle multi-vector natively. Vespa treats each document as a tensor; Qdrant ships
            native multi-vector since 1.10; Elasticsearch supports nested dense_vector fields. Each has different
            ergonomics for ColBERT-style workloads.
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
              Multi-vector production support
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
                  name: "Vespa",
                  how: "Native tensor fields with max-sim as a built-in ranking expression",
                  since: "Since v7, Yahoo production",
                },
                {
                  name: "Qdrant multi-vector",
                  how: "Multi-vector collections since v1.10, per-vector payload",
                  since: "V1.10 (Jul 2024)",
                },
                {
                  name: "Elasticsearch nested",
                  how: "Nested dense_vector fields with script-score max-sim",
                  since: "8.13+",
                },
                {
                  name: "Weaviate",
                  how: "Multi-vector preview via RAG module experiments",
                  since: "Preview since 1.25",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={15}>
                    {r.name}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4 }}>
                    {r.how}
                  </T>
                  <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                    {r.since}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Multi-vector is table stakes in most production systems now
            <br />
            Vespa and Qdrant are the common production picks
            <br />
            Pinecone and pgvector currently do not support it natively
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Worth it for RAG on long documents, search over dense technical corpora, and any case where single-vector
            retrieval has been quality-limited.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.27 Embedding Lifecycle & Re-embedding
// ───────────────────────────────────────────────────────────────────────────

export const EmbeddingLifecycle = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            You indexed 500M vectors two years ago. The model has moved on.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Two years ago the team shipped a retrieval system with 500M documents indexed via OpenAI&apos;s
            text-embedding-ada-002 (d = 1536). Today that model is deprecated and text-embedding-3-large (d = 3072) is
            the new default. Every vector in the existing index is &quot;wrong&quot; in the sense that it was produced
            by an encoder that is no longer the state of the art. How do you move forward?
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
              Timeline of an indexed-years-ago corpus
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
              2024: <span style={{ color: C.cyan }}>500M docs</span> embedded with ada-002 (d = 1536)
              <br />
              2025: OpenAI <span style={{ color: C.cyan }}>upgrades</span> to text-embedding-3-large (d = 3072)
              <br />
              2026: ada-002 announced deprecated
              <br />
              Production system runs on two-year-old encoders
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
            This is the most common silent pain in production vector search. Models change, and what used to be a
            state-of-the-art embedding decays into yesterday&apos;s encoder.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Dimension mismatch is a hard migration
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }} center>
            The new model outputs a different vector dimension. ada-002 emits 1536 dims; text-embedding-3-large emits
            3072. Vector DBs pin the collection to one dimension at creation time - you cannot mix 1536-dim vectors with
            3072-dim vectors in the same index. Every migration path has to deal with this up front.
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
              Dimension mismatch
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold size={14} center>
                  Old index
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: C.red }}>1536 dims</div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  Ada-002
                </T>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={14} center>
                  New index
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: C.green }}>3072 dims</div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  Text-embedding-3-large
                </T>
              </div>
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
            Vector DB collections are <span style={{ color: C.yellow }}>dimension-pinned</span>
            <br />
            No mixing 1536-dim and 3072-dim in the same index
            <br />
            Any migration starts with creating a new collection
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Matryoshka embeddings (chapter 11.16) partly ease this: truncating a 3072-dim Matryoshka to 1536 is still a
            sensible embedding, though not from the older model.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Option 1: re-embed everything, swap indexes
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The conceptually clean option. Keep the source text around (if you still have it), run every doc through the
            new model, build a fresh index, atomically swap. You pay the full re-embed cost one time.
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
              Re-embed cost estimate at 500M docs, 500 tokens each
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
              Tokens: 500M &middot; 500 = <span style={{ color: C.green }}>250 billion</span>
              <br />
              Price: <span style={{ color: C.green }}>$0.00013</span> per 1K tokens (text-embedding-3-large)
              <br />
              Total: <span style={{ color: C.green }}>~$32,500</span> one-time bill
              <br />
              Time: ~<span style={{ color: C.green }}>1 week</span> at API rate limits, parallelized
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
            Requires <span style={{ color: C.green }}>retained source text</span> (huge gotcha if you dropped it)
            <br />
            Cost scales linearly with N and token budget
            <br />
            Clean cut-over, no two versions to maintain
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Re-embedding is often the cheapest option measured over a year. The upfront bill is what blocks it -
            engineering teams are reluctant to spend five figures on something that looks like cleanup.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Option 2: parallel indexes during migration, serve from old, populate new
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Stand up the new index alongside the old. Dual-write every new or updated doc to both. Backfill the old
            corpus to the new index in the background. Compare quality on real traffic by shadow-querying. When the new
            index is caught up and its quality is verified, flip traffic. Then deprecate the old one.
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
              Parallel migration timeline
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
              Week 0: create new collection, start dual-write on new docs
              <br />
              Week 1-3: backfill old corpus into new index in background
              <br />
              Week 4: shadow-query both, measure recall delta
              <br />
              Week 5: <span style={{ color: C.orange }}>cutover</span> traffic to new index
              <br />
              Week 6: retire old index
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
            Traffic stays on the old index the whole time
            <br />
            Double storage cost during the overlap window
            <br />
            Quality can be <span style={{ color: C.orange }}>flipped back</span> if the new index underperforms
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the standard low-risk path. It costs more - you run two indexes for weeks - but regressions never
            reach production traffic.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Option 3: pin the old model forever (pin and pray)
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The do-nothing option. Pin the embedding model version, keep using it, never migrate. Works until the
            provider deprecates the model or drift quietly erodes quality. Many teams end up here because upgrading
            feels optional; a year later they discover retrieval quality has decayed and they now face a forced
            migration under deadline pressure.
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
              The failure modes of pinning
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  name: "Provider deprecation",
                  text: "Vendor sunsets the old model, forced migration under a deadline",
                },
                {
                  name: "Silent drift",
                  text: "Model did not change but the domain did - recall decays over time",
                },
                {
                  name: "New language / domain",
                  text: "Content types the old model never saw are served poorly",
                },
                {
                  name: "Missed capability",
                  text: "Competitors ship features (longer context, better multilingual) that the pinned model cannot match",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.red}08`,
                    border: `1px solid ${C.red}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.red} bold size={14}>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.text}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Pinning is <span style={{ color: C.red }}>short-term cheap, long-term expensive</span>
            <br />
            Works fine for 6-12 months, pain compounds after
            <br />
            Drift is invisible unless you monitor it
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Pinning is a valid choice as long as you plan the exit. Shipping without a re-embedding story is the failure
            mode.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Drift monitoring: periodic ground-truth evals
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The cure for silent quality decay is explicit monitoring. Keep a held-out set of (query, relevant-doc)
            pairs. Every week or month, run the current index against the eval set and record recall@k. Any sudden drop
            signals either a model change, a content change, or an index regression - each demands a different response.
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
              Drift monitoring stack
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
                  name: "Ground-truth eval set",
                  note: "1K to 10K (query, relevant-doc) pairs, refreshed quarterly",
                },
                {
                  name: "Weekly recall@10 run",
                  note: "Run the eval, record the curve, alert on regression",
                },
                {
                  name: "Content-change monitor",
                  note: "Track the embedding distribution (mean, variance) per ingest batch",
                },
                {
                  name: "Model-change signal",
                  note: "Lock embedding model version, surface drift when you bump it",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={14}>
                    {r.name}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Monitor <span style={{ color: C.purple }}>recall &middot; drift &middot; eval</span> or discover regression
            after users notice
            <br />
            Ground-truth sampling is cheap; a quality regression is not
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Whatever migration option you pick, drift monitoring is the common prerequisite. Without it, none of the
            other three can be operated safely.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.28 Observability
// ───────────────────────────────────────────────────────────────────────────

export const Observability = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Latency tails matter most - P50, P95, P99
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Mean latency tells you almost nothing in production vector search. Queries are cheap most of the time; it is
            the slow tail that ruins a user&apos;s day. Observability starts with percentile-based latency tracking: P50
            for the median, P95 for &quot;what most users see at the worst&quot;, P99 for the worst 1% of queries. Alert
            budgets are written against the tail, not the average.
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
              Typical production percentile targets for HNSW search
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { name: "P50", target: "10 ms", color: C.green, note: "Median query" },
                { name: "P95", target: "30 ms", color: C.yellow, note: "95% of queries faster" },
                { name: "P99", target: "80 ms", color: C.orange, note: "99% of queries faster" },
                { name: "P99.9", target: "200 ms", color: C.red, note: "Tail blows up here" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={16} center>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color }}>{r.target}</div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                    {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Mean masks the <span style={{ color: C.cyan }}>tail</span>
            <br />
            Alert on P99, watch P99.9, write the SLA against the tail
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The P99 is usually 5-10x the P50. Investments in caching, SIMD, and index tuning show up in the tail, not
            the mean.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Recall@k: periodic ground-truth sampling vs brute force
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ANN indexes are approximate. Without active monitoring, a regression in recall can go unnoticed for months.
            The cure is a periodic evaluation: sample K queries, compute the exact top-k via brute force on the full
            corpus, compare against what the ANN index returned. Recall@10 is the most common single number to track.
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
              Recall@10 sampling protocol
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
              Step 1: sample <span style={{ color: C.yellow }}>1,000 queries</span> from production traffic
              <br />
              Step 2: for each, compute exact top-10 via <span style={{ color: C.yellow }}>brute force</span>
              <br />
              Step 3: compare against ANN top-10 (intersection / 10)
              <br />
              Step 4: average over the 1,000 queries = recall@10
              <br />
              Step 5: repeat weekly, plot the trend
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The sample is cheap compared to the damage of not knowing. Even a slow brute-force run at 1K queries is
            minutes, not hours.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Per-query cost telemetry: cache hits, memory pages, CPU
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Beyond top-level latency, modern vector DBs emit per-query cost signals: how many memory pages were read,
            what fraction of the working set was already in the L3 cache, how many distance computations were performed,
            how much CPU each query consumed. These numbers are what you watch when latency regressions appear without
            any code change.
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
              Per-query cost signals
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
                { name: "L3 cache hit rate", what: "Fraction of hot graph pages served from CPU cache" },
                { name: "Memory pages read", what: "How many 4 KB pages touched per query" },
                { name: "Distance computations", what: "How many candidate comparisons" },
                { name: "CPU cycles per query", what: "Wall-clock profile of a typical query" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.green}08`,
                    border: `1px solid ${C.green}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.green} bold size={14}>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A sudden dip in cache hit rate is the most common early warning. It usually means the working set grew or
            the graph layout changed after a rebuild.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            ANN-Benchmarks methodology - standard for comparing index configs
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            The open-source ANN-Benchmarks (github.com/erikbern/ann-benchmarks) is the standard way to compare index
            configurations. It plots queries per second (QPS) on the horizontal axis and recall on the vertical. Every
            point is a parameter combination; the Pareto frontier tells you what tradeoffs are even possible. Running it
            on your own data is the quickest way to pick HNSW or IVF parameters.
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
              ANN-Benchmarks QPS vs recall chart
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
              X-axis: <span style={{ color: C.orange }}>recall</span> (0.90 to 1.00)
              <br />
              Y-axis: <span style={{ color: C.orange }}>QPS</span> (log scale, queries per second)
              <br />
              Each curve = one index family (HNSW, IVF-PQ, Vamana)
              <br />
              Each point = one parameter combination
              <br />
              Winners sit on the Pareto frontier (upper-right)
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
            Methodology: same dataset, same hardware, same recall target
            <br />
            Fair comparison forces every system to trade QPS for recall
            <br />
            Run it on <span style={{ color: C.orange }}>your data</span>, not just the public datasets
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ANN-Benchmarks shows up in almost every paper, blog, and vendor comparison. Knowing how to read it is a
            baseline skill for evaluating vector DBs.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Dashboard layout: alert lines vs watch lines
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            A good production dashboard is the difference between catching a regression in 5 minutes and catching it via
            a customer email 3 days later. The core panel set for a vector search service: P99 latency (alert above
            SLA), recall@10 (alert below floor), cache hit rate (watch trend), index memory usage (watch growth).
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
              Core Grafana-style dashboard panels
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
                  name: "P99 latency",
                  kind: "ALERT",
                  threshold: "100 ms",
                  color: C.red,
                  why: "SLA violation if it stays above for 5 minutes",
                },
                {
                  name: "recall@10",
                  kind: "ALERT",
                  threshold: "< 0.95",
                  color: C.red,
                  why: "Quality regression, investigate model or index",
                },
                {
                  name: "Cache hit rate",
                  kind: "WATCH",
                  threshold: "~0.85",
                  color: C.yellow,
                  why: "Degrades before latency shows symptoms",
                },
                {
                  name: "Index memory usage",
                  kind: "WATCH",
                  threshold: "60-70% RAM",
                  color: C.yellow,
                  why: "Growth predicts scale-up or shard",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <T color={r.color} bold size={14}>
                      {r.name}
                    </T>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: r.color,
                        fontWeight: "bold",
                      }}
                    >
                      {r.kind}
                    </div>
                  </div>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: C.bright }}>
                    {r.threshold}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {r.why}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Keep the number of alerts small. Alerts on everything train the team to ignore them. Two alerts you trust
            beats ten you mute.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The metric you did not measure is the one that hurts you
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Latency and recall are the headline metrics. The quiet ones that trip production: per-tenant distribution,
            filtered-query recall, cold-start latency on freshly scaled replicas, fan-out tail on multi-shard
            deployments. Every production incident has a postmortem that ends in &quot;we were not capturing X&quot;.
            Build the checklist before you need it.
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
              Observability checklist - questions a dashboard should answer
            </T>
            <ul style={{ marginTop: 8, paddingLeft: 22, fontSize: 14, color: C.bright, lineHeight: 1.8 }}>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>per-tenant latency</span>: is one customer
                degrading the P99 for everyone?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>filtered-query recall</span>: does recall tank
                when a predicate is tight?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>cold-start latency</span>: first query after a new
                replica is up - how long?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>fan-out tail</span>: slowest shard on a
                multi-shard query?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>write-to-read lag</span>: time from upsert to
                queryable?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>index build time</span>: duration of the last full
                rebuild?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>tombstone percent</span>: delete pressure on the
                current graph?
              </li>
            </ul>
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
            Every production incident: <span style={{ color: C.purple }}>&quot;we did not measure X&quot;</span>
            <br />
            Capture everything now so you can triage fast later
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Rule of thumb: for every new feature (filtering, sharding, replication), add a monitor before you ship. The
            feature is cheap; the blind spot it creates is not.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.29 Capacity Planning & Cost Models
// ───────────────────────────────────────────────────────────────────────────

export const CapacityPlanning = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Inputs to size a vector search system
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Good capacity planning starts with the inputs the workload gives you: how many vectors, how big each one is,
            how many queries per second, what latency budget, how selective the filters are, what availability the
            business needs. Six numbers determine almost everything about the provisioning decision.
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
              The six sizing inputs
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { name: "N vectors", value: "1M - 10B", example: "500M" },
                { name: "d dimensions", value: "128 - 3072", example: "768" },
                { name: "QPS target", value: "10 - 10K", example: "200" },
                { name: "P99 target", value: "30 - 300 ms", example: "100 ms" },
                { name: "Filter selectivity", value: "0.1% - 100%", example: "5%" },
                { name: "Availability", value: "99% - 99.99%", example: "99.9%" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}08`,
                    border: `1px solid ${C.cyan}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={14} center>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright }}>{r.value}</div>
                  <T color={C.dim} size={11} style={{ marginTop: 4 }} center>
                    example: {r.example}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Everything that follows - memory, CPU, node count, cost - is derived from these six numbers plus the index
            choice.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Memory formula: vectors + graph + cache + fragmentation
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            RAM is usually the gating resource. The total is the vector storage plus graph overhead plus working-set
            cache headroom plus an allocator-fragmentation fudge factor. Each multiplier accumulates; undersize any one
            and P99 latency explodes.
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
              Memory formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              RAM = N &middot; (<span style={{ color: C.yellow }}>vec_bytes</span> +{" "}
              <span style={{ color: C.yellow }}>graph_bytes</span>) &middot;{" "}
              <span style={{ color: C.yellow }}>cache_factor</span> &middot;{" "}
              <span style={{ color: C.yellow }}>frag_factor</span>
              <br />
              Cache_factor &asymp; 1.2 (20% headroom) &middot; frag_factor &asymp; 1.3 (allocator)
              <br />
              Vec_bytes = d &middot; 4 for float32, d for int8, m for PQ m-bytes
              <br />
              Graph_bytes &asymp; 100 for HNSW, ~20 for IVF-PQ
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
            Each multiplier matters - undersizing <span style={{ color: C.red }}>cache</span> or{" "}
            <span style={{ color: C.red }}>fragmentation</span> blows P99
            <br />
            Plan for 1.5x the naive &quot;N times vec_bytes&quot;
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every production team eventually learns this the hard way. The cache and fragmentation factors are easy to
            forget and expensive to discover.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            CPU sizing: per-query ops x QPS x headroom
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            CPU capacity sizing is simpler: estimate per-query work, multiply by target QPS, add headroom for spikes and
            replication overhead. For HNSW at typical parameters, each query touches about 30 graph hops averaging 10
            microseconds each - 300 microseconds of compute per query.
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
              CPU formula for HNSW
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Per-query CPU = <span style={{ color: C.green }}>hops &middot; us/hop</span>
              <br />
              Typical: 30 hops &middot; 10 us = 300 us
              <br />
              cores = <span style={{ color: C.green }}>per-query-cost &middot; QPS &middot; headroom</span>
              <br />
              Worked: 300 us &middot; 200 QPS &middot; 2x headroom = 120,000 us = 0.12 core-seconds/sec
              <br />
              Round up to <span style={{ color: C.green }}>8-16 cores</span> per replica with write and merge overhead
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            CPU is rarely the bottleneck when memory is sized correctly. Most production systems have plenty of CPU
            headroom and end up memory-bound first.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Worked example: 500M vectors x d=768 x 200 QPS
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Concrete run. 500M docs, d = 768, HNSW index, 200 QPS, P99 target 100 ms, 99.9% availability. Compute the
            memory, CPU, and node count explicitly. This is the shape of every real sizing exercise.
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
              500M vector sizing walkthrough
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
              Vectors: 500M &middot; 3 KB = <span style={{ color: C.orange }}>1.5 TB</span>
              <br />
              HNSW graph: 500M &middot; 100 B = <span style={{ color: C.orange }}>50 GB</span>
              <br />
              Cache + fragmentation (1.2 &middot; 1.3 = 1.56): &asymp; 2.4 TB total
              <br />
              Spread across <span style={{ color: C.orange }}>6 nodes</span> (r7i.24xlarge with 768 GB each)
              <br />
              Each node holds ~100M vectors = <span style={{ color: C.orange }}>400 GB</span> of the working set
              <br />
              Replicate 2x for availability: <span style={{ color: C.orange }}>12 nodes total, 3 TB RAM</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                label: "Memory",
                value: "3 TB",
                note: "Across replicas, 1.5 TB primary + replication",
                color: C.orange,
              },
              { label: "Nodes", value: "6 + 6", note: "Primary shards + 1 replica each", color: C.orange },
              { label: "CPU", value: "~96 cores", note: "16 per node times 6 nodes", color: C.orange },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={14}>
                  {r.label}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color }}>{r.value}</div>
                <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                  {r.note}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the shape of every well-sized deployment. Start from raw numbers, apply the cache and fragmentation
            factors, decide on shard count from single-node ceiling, multiply by replication.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Cost comparison: Pinecone pods vs self-host Qdrant vs pgvector
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Cost depends entirely on who runs the infrastructure. Pinecone&apos;s managed pods include the ops team, at
            a premium. Self-hosted Qdrant on AWS is cheaper in compute but you run it yourself. pgvector on a big
            Postgres box is the cheapest, but the operational model has its own caveats. Rough order-of-magnitude
            estimates for our 500M workload follow.
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
              Monthly cost estimates for 500M x d=768 x 200 QPS (illustrative)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 0.9fr 2fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>System</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Est. monthly cost
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>Trade</div>
              {[
                {
                  name: "Pinecone (pod-based)",
                  cost: "~$30K",
                  trade: "Managed, opinionated scaling, no ops team needed",
                  color: C.red,
                },
                {
                  name: "Self-host Qdrant on AWS",
                  cost: "~$8K",
                  trade: "You run it, ops load but great cost/feature ratio",
                  color: C.yellow,
                },
                {
                  name: "pgvector on big Postgres",
                  cost: "~$5K",
                  trade: "SQL transactions, cheapest, ops burden + feature limits",
                  color: C.green,
                },
              ].flatMap((r) => [
                <div
                  key={`n-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}10`,
                    borderRadius: 4,
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`c-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.cost}
                </div>,
                <div
                  key={`t-${r.name}`}
                  style={{ padding: "6px 8px", background: `${r.color}06`, borderRadius: 4, color: C.bright }}
                >
                  {r.trade}
                </div>,
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Numbers are order-of-magnitude illustrations, not authoritative
            <br />
            Ratios are durable: Pinecone ~4x-6x self-host, pgvector cheapest but operationally limited
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The real decision is ops capacity: a two-engineer team may rationally pay Pinecone&apos;s premium to skip
            the infrastructure grind.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decision lens: cost per million vectors, cost per million queries
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Normalize the cost comparison to two numbers: dollars per million vectors per month (storage cost) and
            dollars per million queries (compute cost). These ratios stay roughly constant as the workload changes,
            which makes them the cleanest metric for vendor comparisons and scale-up planning.
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
              Cost ratios as the decision lens
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
                  metric: "$ per million vectors per month",
                  what: "Storage side of the cost - scales with N",
                  example: "Pinecone ~$60 / Qdrant ~$16 / pgvector ~$10",
                },
                {
                  metric: "$ per million queries",
                  what: "Compute side - scales with QPS",
                  example: "Pinecone ~$6 / Qdrant ~$1.5 / pgvector ~$1",
                },
              ].map((r) => (
                <div
                  key={r.metric}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={14}>
                    {r.metric}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {r.example}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            The right decision framework = <span style={{ color: C.purple }}>per-million cost ratios</span>
            <br />
            Adjusted for ops capacity + feature needs
            <br />
            Numbers change over time; the shape of the decision does not
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            With per-million ratios + ops capacity in hand, the team can reach a defensible vendor decision from first
            principles rather than marketing copy.
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
};
