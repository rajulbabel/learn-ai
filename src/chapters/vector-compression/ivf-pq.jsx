import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// 2D scatter positions for the 10-doc cat corpus, re-declared locally so 11.17 stays
// self-contained (vector-foundations.jsx is a sibling module, not an import here).
// Inverted-triangle layout: A (cats) top-left, B (dogs) top-right,
// C (other) bottom-center. Each cluster sits inside a 60-radius halo, with
// halos far enough apart that no two halos touch.
const IVFPQ_CORPUS_XY = {
  1: { x: 105, y: 75, cluster: "A", label: "cats domesticated" },
  7: { x: 155, y: 75, cluster: "A", label: "kittens" },
  5: { x: 95, y: 110, cluster: "A", label: "tigers striped" },
  3: { x: 155, y: 115, cluster: "A", label: "lions big cats" },
  4: { x: 130, y: 135, cluster: "A", label: "cat on mat" },
  2: { x: 350, y: 80, cluster: "B", label: "dogs loyal" },
  8: { x: 390, y: 115, cluster: "B", label: "dog chased cat" },
  10: { x: 280, y: 245, cluster: "C", label: "fish underwater" },
  9: { x: 260, y: 290, cluster: "C", label: "birds fly" },
  6: { x: 220, y: 250, cluster: "C", label: "python language" },
};
const IVFPQ_QUERY_XY = { x: 55, y: 55 };
const IVFPQ_HALO_R = 60;
// labelDy positions each centroid label well above its topmost doc circle so
// the label never collides with a doc number.
const IVFPQ_CENTROIDS = {
  A: { x: 130, y: 100, color: C.purple, label: "C_A (cats)", labelDy: -50 },
  B: { x: 370, y: 100, color: C.yellow, label: "C_B (dogs)", labelDy: -50 },
  C: { x: 250, y: 260, color: C.cyan, label: "C_C (other)", labelDy: -50 },
};

// 4-dim vectors for the three docs used in the residual table (sub=2).
// The cluster-A centroid is the coordinate-wise average of docs 1, 3, 4, 5, 7 rounded to 2 decimals.
const IVFPQ_CLUSTER_A_ROWS = [
  { id: 1, text: '"Cats are small domesticated carnivores"', v: [0.81, 0.12, 0.45, 0.22] },
  { id: 3, text: '"Lions are big cats that live in Africa"', v: [0.76, 0.18, 0.52, 0.31] },
  { id: 4, text: '"My cat sat on the mat"', v: [0.72, 0.22, 0.48, 0.26] },
];
const IVFPQ_CENTROID_A_VEC = [0.78, 0.15, 0.47, 0.25];

export default function IVFPQ(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            IVF splits space, PQ shrinks each vector
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            IVF (chapter 11.5) and PQ (chapter 11.14) are the two workhorse compression tools of production vector
            search. IVF partitions the corpus into clusters so a query only scans a handful of cells instead of all N
            vectors. PQ replaces each float32 vector with a short byte-code, shrinking memory by 32x. Individually each
            tool is useful; combined as IVF-PQ they become the dominant index for static billion-scale corpora - the
            recipe FAISS, Milvus, and many others ship as a default.
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
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                IVF - cluster the space
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; K-means partitions the corpus into nlist cells</div>
                <div>&bull; Typical nlist &asymp; sqrt(N): 4,096 at N = 1M</div>
                <div>&bull; At query time, probe the nprobe closest cells</div>
                <div>&bull; Nprobe = 8 visits 8 / 4,096 &asymp; 0.2% of the data</div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.yellow,
                  textAlign: "center",
                }}
              >
                Cost per query &asymp; nlist + nprobe &middot; (N / nlist)
              </div>
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
                PQ - compress each vector
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Split a 768-dim vector into m = 96 subvectors</div>
                <div>&bull; K-means per slot gives 256 centroid codebooks</div>
                <div>&bull; Each subvector becomes a 1-byte code id</div>
                <div>&bull; Whole vector: 96 bytes (32x smaller than float32)</div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.purple,
                  textAlign: "center",
                }}
              >
                m bytes per vector (vs d &middot; 4 bytes for float32)
              </div>
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            IVF cuts the number of vectors scanned. PQ cuts the bytes per vector. Multiply the savings and you land on
            an index that answers a billion-vector query in single-digit milliseconds while fitting in 20 GB of RAM.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Step 1: run IVF k-means on the corpus
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The first layer of IVF-PQ is plain IVF: before any queries arrive, run k-means on all N vectors to produce
            nlist centroids and assign each vector to its nearest centroid. For the 10-doc cat corpus we pick nlist = 3.
            The five cat docs collapse into cluster A, the two dog docs form cluster B, and the three other docs form
            cluster C. Each centroid C_A, C_B, C_C is a 768-dim float vector stored once in memory.
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
              Cat corpus after k-means, nlist = 3
            </T>
            <svg
              viewBox="0 0 500 370"
              style={{ width: "100%", maxWidth: 540, height: "auto", display: "block", margin: "0 auto" }}
            >
              <desc>
                Scatter of the 10 cat-corpus documents after k-means clustering with nlist = 3, arranged as a balanced
                inverted triangle: five cat docs form cluster A around the purple centroid C_A in the upper-left, two
                dog docs form cluster B around the yellow centroid C_B in the upper-right, and three other docs form
                cluster C around the cyan centroid C_C in the lower-center. The centroids are drawn as colored squares.
              </desc>
              {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => (
                <circle
                  key={`halo-${id}`}
                  cx={c.x}
                  cy={c.y}
                  r={IVFPQ_HALO_R}
                  fill={`${c.color}10`}
                  stroke={`${c.color}30`}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ))}
              {Object.entries(IVFPQ_CORPUS_XY).map(([id, p]) => {
                const c = IVFPQ_CENTROIDS[p.cluster];
                return (
                  <g key={id}>
                    <circle cx={p.x} cy={p.y} r={8} fill={c.color} stroke={C.bg} strokeWidth={1.5} />
                    <text x={p.x} y={p.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                      {id}
                    </text>
                  </g>
                );
              })}
              {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => (
                <g key={`c-${id}`}>
                  <rect
                    x={c.x - 12}
                    y={c.y - 12}
                    width={24}
                    height={24}
                    fill={c.color}
                    stroke={C.bg}
                    strokeWidth={2}
                    transform={`rotate(45 ${c.x} ${c.y})`}
                  />
                  <text
                    x={c.x}
                    y={c.y + (c.labelDy ?? -22)}
                    fill={c.color}
                    fontSize={13}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {c.label}
                  </text>
                </g>
              ))}
              <text x={250} y={350} fill={C.dim} fontSize={13} textAnchor="middle">
                nlist = 3 centroids &middot; each doc assigned to its nearest centroid
              </text>
            </svg>
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
              lineHeight: 2,
            }}
          >
            cluster(v) = argmin<sub>j</sub> &nbsp;||&nbsp; v &minus; C<sub>j</sub> &nbsp;||
            <br />
            <span style={{ color: C.yellow }}>
              At production scale: N = 1M, nlist = 4,096; N = 100M, nlist = 32,768
            </span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Each vector now has an address: a single cluster id (4 bytes) that tells the index which cell it lives in.
            The centroid itself is a reusable reference point - it is about to become the anchor for how we store every
            vector in the cell.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step 2: residual = vector &minus; centroid
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Instead of storing each vector as-is, IVF-PQ subtracts off the cluster centroid first. The leftover piece -
            the residual - captures how the document differs from its neighborhood. Because every doc in cluster A is
            already near C_A, its residual has much smaller magnitude than the original vector. The residuals across the
            whole cluster concentrate in a tight ball around zero, which is exactly the kind of distribution PQ
            compresses well.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            residual<sub>i</sub> = v<sub>i</sub> &minus; centroid<sub>cluster(i)</sub>
          </div>
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
              Three cluster-A docs: original &minus; centroid = residual
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "left", padding: "6px 8px" }}>Doc</div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                v (original)
              </div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>C_A</div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                Residual
              </div>
              {IVFPQ_CLUSTER_A_ROWS.flatMap((row) => {
                const residual = row.v.map((x, i) => x - IVFPQ_CENTROID_A_VEC[i]);
                return [
                  <div
                    key={`doc-${row.id}`}
                    style={{
                      padding: "6px 8px",
                      background: `${C.green}08`,
                      borderRadius: 4,
                      color: C.bright,
                      fontSize: 12,
                    }}
                  >
                    Doc {row.id}: {row.text}
                  </div>,
                  <div
                    key={`orig-${row.id}`}
                    style={{
                      padding: "6px 8px",
                      background: `${C.green}08`,
                      borderRadius: 4,
                      textAlign: "center",
                    }}
                  >
                    [{row.v.map((x) => x.toFixed(2)).join(", ")}]
                  </div>,
                  <div
                    key={`cent-${row.id}`}
                    style={{
                      padding: "6px 8px",
                      background: `${C.green}08`,
                      borderRadius: 4,
                      textAlign: "center",
                    }}
                  >
                    [{IVFPQ_CENTROID_A_VEC.map((x) => x.toFixed(2)).join(", ")}]
                  </div>,
                  <div
                    key={`res-${row.id}`}
                    style={{
                      padding: "6px 8px",
                      background: `${C.green}14`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: C.green,
                      fontWeight: "bold",
                    }}
                  >
                    [{residual.map((x) => (x >= 0 ? "+" : "") + x.toFixed(2)).join(", ")}]
                  </div>,
                ];
              })}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 10 }}>
              Originals span 0.12 to 0.83. Residuals span only -0.07 to +0.07 - about 10x tighter.
            </T>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the whole trick: residuals cluster tighter than raw vectors, so the PQ codebooks in step 3 can pack
            the same accuracy into fewer bits. Less spread means smaller k-means cells means lower quantization error.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 3: run PQ on the residuals
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Now apply product quantization, but to the residuals - not the raw vectors. Same PQ recipe from chapter
            11.14 (m = 96 subvectors, 256 centroids per slot, 8-bit codes), just fit to the narrower residual
            distribution. Because every residual lives in a tiny ball around zero, the per-slot k-means clusters are
            smaller and quantization error drops. The recall lift over plain PQ is modest on paper but decisive in
            practice: more of the true nearest neighbors survive the compression.
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
              <T color={C.red} bold center size={16}>
                Raw PQ (no residuals)
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Encode v directly with m = 96, 256 codes</div>
                <div>&bull; Codebook must cover wide spread: 0 to 1</div>
                <div>&bull; Per-slot clusters are loose, error accumulates</div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 15,
                  color: C.red,
                  textAlign: "center",
                }}
              >
                Recall@10 &asymp; <span style={{ fontSize: 20 }}>0.89</span>
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
              <T color={C.green} bold center size={16}>
                Residual PQ (IVF-PQ)
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Encode (v &minus; C_cluster) with m = 96, 256 codes</div>
                <div>&bull; Codebook only covers the residual ball</div>
                <div>&bull; Tighter per-slot k-means, lower error per code</div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 15,
                  color: C.green,
                  textAlign: "center",
                }}
              >
                Recall@10 &asymp; <span style={{ fontSize: 20 }}>0.94</span>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            Each stored vector = cluster id (4 bytes) + residual PQ codebook index (96 bytes)
            <br />
            <span style={{ color: C.orange }}>
              reconstruct(code) = C_cluster + decode_PQ(code) &nbsp;&rarr;&nbsp; approximate original
            </span>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Residual PQ is why FAISS, Milvus, and Weaviate default to this flavor of PQ when they build an IVF index.
            Same byte budget, meaningfully higher recall, identical query path.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Search: probe nprobe clusters, scan PQ codes
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            At query time the index does two passes. First it compares the query to every centroid (nlist dot products)
            and keeps the nprobe closest cells. Then for each probed cell it walks the PQ codes: build an
            asymmetric-distance lookup table from the query, then for every code sum m table lookups to estimate the
            distance. The bulk of the work is the second pass, but the scan is cache-friendly and the code footprint is
            tiny.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr",
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
                Query walks two cells (nprobe = 2)
              </T>
              <svg
                viewBox="0 0 500 370"
                style={{ width: "100%", maxWidth: 500, height: "auto", display: "block", margin: "0 auto" }}
              >
                <desc>
                  IVF-PQ search trajectory on the 10-doc cat corpus arranged as an inverted triangle: the query vector
                  sits in the upper-left, the orange arrow points toward the closest centroid C_A, the two nearest cells
                  A (purple) and B (yellow) are highlighted while cluster C (cyan) at the bottom is dimmed. Inside each
                  highlighted cell every doc is scanned by its PQ code.
                </desc>
                {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => {
                  const highlighted = id === "A" || id === "B";
                  return (
                    <circle
                      key={`halo-${id}`}
                      cx={c.x}
                      cy={c.y}
                      r={IVFPQ_HALO_R}
                      fill={highlighted ? `${c.color}18` : `${c.color}06`}
                      stroke={highlighted ? `${c.color}60` : `${c.color}20`}
                      strokeWidth={highlighted ? 2 : 1}
                      strokeDasharray={highlighted ? "0" : "3 3"}
                    />
                  );
                })}
                {(() => {
                  // End the arrow just outside cluster A's halo so it never
                  // crosses any interior doc circle.
                  const dx = IVFPQ_CENTROIDS.A.x - IVFPQ_QUERY_XY.x;
                  const dy = IVFPQ_CENTROIDS.A.y - IVFPQ_QUERY_XY.y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const stopOutsideHalo = IVFPQ_HALO_R + 5;
                  const tipX = IVFPQ_QUERY_XY.x + ((len - stopOutsideHalo) * dx) / len;
                  const tipY = IVFPQ_QUERY_XY.y + ((len - stopOutsideHalo) * dy) / len;
                  return (
                    <line
                      x1={IVFPQ_QUERY_XY.x}
                      y1={IVFPQ_QUERY_XY.y}
                      x2={tipX}
                      y2={tipY}
                      stroke={C.orange}
                      strokeWidth={2}
                      markerEnd="url(#ivfpq-arrow)"
                    />
                  );
                })()}
                <defs>
                  <marker
                    id="ivfpq-arrow"
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
                {Object.entries(IVFPQ_CORPUS_XY).map(([id, p]) => {
                  const c = IVFPQ_CENTROIDS[p.cluster];
                  const dimmed = p.cluster === "C";
                  return (
                    <g key={id} opacity={dimmed ? 0.35 : 1}>
                      <circle cx={p.x} cy={p.y} r={8} fill={c.color} stroke={C.bg} strokeWidth={1.5} />
                      <text x={p.x} y={p.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                        {id}
                      </text>
                    </g>
                  );
                })}
                {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => (
                  <g key={`c-${id}`}>
                    <rect
                      x={c.x - 12}
                      y={c.y - 12}
                      width={24}
                      height={24}
                      fill={c.color}
                      stroke={C.bg}
                      strokeWidth={2}
                      transform={`rotate(45 ${c.x} ${c.y})`}
                    />
                  </g>
                ))}
                <circle
                  cx={IVFPQ_QUERY_XY.x}
                  cy={IVFPQ_QUERY_XY.y}
                  r={10}
                  fill={C.orange}
                  stroke={C.bg}
                  strokeWidth={2}
                />
                <text
                  x={IVFPQ_QUERY_XY.x}
                  y={IVFPQ_QUERY_XY.y - 16}
                  fill={C.orange}
                  fontSize={13}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Query
                </text>
                <text x={250} y={350} fill={C.dim} fontSize={12} textAnchor="middle">
                  A + B are probed &middot; C is skipped
                </text>
              </svg>
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
                Per-query cost at N = 1M, nlist = 4,096, nprobe = 8
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                Step 1: scan <span style={{ color: C.red }}>4,096</span> centroids
                <br />
                Step 2: build a <span style={{ color: C.red }}>m &middot; 256 = 24,576</span> entry
                <br />
                Asymmetric lookup table once per query
                <br />
                Step 3: scan <span style={{ color: C.red }}>nprobe &middot; (N / nlist)</span>
                <br />= 8 &middot; 244 &asymp; <span style={{ color: C.red }}>2,000</span> codes
                <br />
                Each code is <span style={{ color: C.red }}>m = 96</span> table lookups + adds
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Brute force over 1M: 1,000,000 distances</div>
                <div>&bull; IVF-PQ: ~6,000 cheap code ops</div>
                <div>
                  &bull; <span style={{ color: C.red, fontWeight: "bold" }}>~150x faster</span>, tuneable via nprobe
                </div>
              </div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Raising nprobe from 8 to 32 scans 4x more codes but lifts recall a few points. The whole index rides on this
            one knob - nprobe is the latency-vs-recall dial at query time.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            20 bytes per vector at N = 1B
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            At billion-vector scale, production IVF-PQ drops the residual PQ subvector count to m = 16 (residuals are
            easier to quantize than raw vectors, so fewer subvectors still hit the recall target). Add the 4-byte
            cluster id every vector needs and the per-vector footprint settles at 20 bytes. A billion vectors occupy 20
            GB - comfortably one server - compared with 3 TB for float32 or 96 GB for raw PQ at m = 96. This is the
            memory math that turns IVF-PQ into the default of FAISS, Milvus, and Weaviate.
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
              Bytes per vector breakdown
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 16px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              Cluster id (4 bytes) + residual PQ code (m = 16 &middot; 1 byte)
              <br />= <span style={{ color: C.purple, fontSize: 20 }}>20 bytes per vector</span>
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
              Memory at N = 1 billion vectors (d = 768)
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
                { label: "Float32 baseline", size: "3 TB", color: C.red, note: "d &middot; 4 &middot; N" },
                { label: "Raw PQ (m = 96)", size: "96 GB", color: C.yellow, note: "No cluster structure" },
                {
                  label: "IVF-PQ (m = 16 residual)",
                  size: "20 GB",
                  color: C.purple,
                  note: "20 &middot; 10^9 bytes = 20 GB",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    padding: "10px 12px",
                    background: `${row.color}08`,
                    border: `1px solid ${row.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={row.color} bold center size={14}>
                    {row.label}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 20, color: row.color }}>
                    {row.size}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.dim }}>{row.note}</div>
                </div>
              ))}
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
              Where IVF-PQ ships as a default
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
                { name: "FAISS IndexIVFPQ", note: "Meta's library, the original" },
                { name: "Milvus IVF_PQ", note: "Distributed billion-scale" },
                { name: "Weaviate PQ + IVF", note: "Toggleable on top of HNSW or flat" },
                { name: "Vespa HNSW + PQ", note: "Same residual recipe on a graph" },
              ].map((sys) => (
                <div
                  key={sys.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={14}>
                    {sys.name}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {sys.note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            IVF for the cluster structure. PQ for the per-vector byte budget. Residuals for the recall boost. Together
            they hit the sweet spot for static, read-heavy, billion-scale search on a single machine.
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
