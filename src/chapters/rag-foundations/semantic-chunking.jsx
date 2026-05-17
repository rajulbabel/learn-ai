import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const SEMANTIC_SENTENCES = [
  {
    id: "s1",
    text: "Creating an API key starts in the developer settings page.",
    cluster: "create",
    vec: [0.82, 0.14, 0.46, 0.71, 0.09, 0.55, 0.23, 0.66],
  },
  {
    id: "s2",
    text: "Click the New Key button and provide a human-readable label.",
    cluster: "create",
    vec: [0.84, 0.18, 0.49, 0.68, 0.11, 0.58, 0.21, 0.69],
  },
  {
    id: "s3",
    text: "The label appears in audit logs to identify which app created traffic.",
    cluster: "create",
    vec: [0.81, 0.15, 0.51, 0.7, 0.13, 0.56, 0.25, 0.65],
  },
  {
    id: "s4",
    text: "Choose a scope from the dropdown to restrict which endpoints the key can call.",
    cluster: "create",
    vec: [0.83, 0.12, 0.47, 0.74, 0.08, 0.6, 0.22, 0.67],
  },
  {
    id: "s5",
    text: "Optional expiry sets a date after which the key stops working.",
    cluster: "create",
    vec: [0.85, 0.16, 0.48, 0.69, 0.1, 0.54, 0.27, 0.68],
  },
  {
    id: "s6",
    text: "Click Generate and the key value is shown one time only - copy it now.",
    cluster: "create",
    vec: [0.86, 0.13, 0.5, 0.72, 0.12, 0.57, 0.24, 0.7],
  },
  {
    id: "s7",
    text: "Revoking an API key is done from the same developer settings page.",
    cluster: "revoke",
    vec: [0.21, 0.78, 0.16, 0.34, 0.74, 0.18, 0.69, 0.27],
  },
  {
    id: "s8",
    text: "Find the key by its label in the active keys list.",
    cluster: "revoke",
    vec: [0.23, 0.81, 0.14, 0.31, 0.77, 0.2, 0.71, 0.29],
  },
  {
    id: "s9",
    text: "Click the trash icon on the row to mark the key as revoked.",
    cluster: "revoke",
    vec: [0.19, 0.79, 0.17, 0.36, 0.72, 0.22, 0.68, 0.31],
  },
  {
    id: "s10",
    text: "Revocation takes effect within sixty seconds of the click.",
    cluster: "revoke",
    vec: [0.25, 0.83, 0.12, 0.33, 0.75, 0.19, 0.7, 0.28],
  },
  {
    id: "s11",
    text: "Any in-flight requests using that key will return 401 once propagation completes.",
    cluster: "revoke",
    vec: [0.22, 0.8, 0.15, 0.35, 0.76, 0.21, 0.72, 0.3],
  },
  {
    id: "s12",
    text: "Revoked keys remain in the audit log forever for compliance review.",
    cluster: "revoke",
    vec: [0.24, 0.82, 0.13, 0.32, 0.78, 0.17, 0.73, 0.26],
  },
];

// Pre-computed cosine similarity between adjacent sentences (boundary i is between sentence i and i+1).
// Within-cluster pairs sit at 0.85-0.92, the create-to-revoke shift at boundary 6-7 dips to 0.41.
const SEMANTIC_BOUNDARIES = [
  { idx: 1, label: "1-2", sim: 0.91 },
  { idx: 2, label: "2-3", sim: 0.89 },
  { idx: 3, label: "3-4", sim: 0.87 },
  { idx: 4, label: "4-5", sim: 0.9 },
  { idx: 5, label: "5-6", sim: 0.88 },
  { idx: 6, label: "6-7", sim: 0.41 },
  { idx: 7, label: "7-8", sim: 0.86 },
  { idx: 8, label: "8-9", sim: 0.85 },
  { idx: 9, label: "9-10", sim: 0.91 },
  { idx: 10, label: "10-11", sim: 0.83 },
  { idx: 11, label: "11-12", sim: 0.9 },
];

export default function SemanticChunking(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            What If The Doc Has No Structural Markers?
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            doc-12 is an API keys reference - but this version is pure flowing prose. No headings, no bullet lists, no
            blank-line separators. Six paragraphs of plain narrative. Recursive structural chunking falls all the way
            through paragraph break, line break, sentence break, and lands on word splits - essentially fixed-size.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                doc-12 (Flat Narrative, No Markers)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.cyan}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#80deea",
                  lineHeight: 1.7,
                  textAlign: "left",
                }}
              >
                Creating an API key starts in the developer settings page. Click the New Key button and provide a
                human-readable label. The label appears in audit logs to identify which app created traffic. Choose a
                scope from the dropdown to restrict which endpoints the key can call. Optional expiry sets a date after
                which the key stops working. Click Generate and the key value is shown one time only - copy it now.
                Revoking an API key is done from the same developer settings page. Find the key by its label in the
                active keys list. Click the trash icon on the row to mark the key as revoked. Revocation takes effect
                within sixty seconds of the click. Any in-flight requests using that key will return 401 once
                propagation completes. Revoked keys remain in the audit log forever for compliance review.
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
                Twelve sentences. First six are about creating a key. Last six are about revoking a key. The topic shift
                lives in the middle - and nothing in the markup tells the splitter where.
              </T>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                The Structural Gap
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    No Headings
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    No ##, no #, no markdown structure to anchor on.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    No Blank Lines
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    No double newline. Recursive splitter sees one long paragraph.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    Topic Shift Is Invisible
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    The creating-to-revoking switch is a semantic boundary with no surface marker. Structural splitter
                    cuts mid-topic at the 128-token mark.
                  </T>
                </div>
              </div>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 12 }}>
                Need a chunker that reads meaning, not markup.
              </T>
            </div>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step 1: Embed Every Sentence Independently
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Split doc-12 into individual sentences using a sentence tokenizer (period-plus-space heuristic, or a real
            NLP library). Twelve sentences come out. Send each sentence through the embedding model and get back a
            vector. Now we have 12 vectors that capture the meaning of each sentence.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#a5d6a7",
            }}
          >
            embed(sentence_i) -&gt; v_i &nbsp;&nbsp;|&nbsp;&nbsp; 12 sentences → 12 vectors
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              columnGap: 12,
              rowGap: 6,
              alignItems: "center",
            }}
          >
            {SEMANTIC_SENTENCES.map((s) => {
              const isCreate = s.cluster === "create";
              const labelColor = isCreate ? C.cyan : C.orange;
              const labelText = isCreate ? "#80deea" : "#ffcc80";
              return (
                <div key={s.id} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${labelColor}12`,
                      border: `1px solid ${labelColor}30`,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: labelColor, fontWeight: 700, fontSize: 12, minWidth: 28 }}>{s.id}:</span>
                    <T color={labelText} size={13}>
                      {s.text}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${labelColor}30`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      color: labelText,
                      whiteSpace: "nowrap",
                    }}
                  >
                    [{s.vec.map((v) => v.toFixed(2)).join(", ")}]
                  </div>
                </div>
              );
            })}
          </div>

          <T color="rgba(255,255,255,0.55)" center size={13} style={{ marginTop: 12 }}>
            Sentences s1-s6 (cyan) all talk about creating - their vectors point in similar directions. Sentences s7-s12
            (orange) all talk about revoking - their vectors point in a different direction. The 8-dim vectors above are
            illustrative; production models use 768 or 1536 dims.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Step 2: Plot Cosine Similarity Between Adjacent Sentences
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            For each pair of adjacent sentences, compute cosine similarity between their vectors. Plot it along the doc.
            Inside a topic cluster the similarity stays high (0.85-0.92). At the topic shift between sentence 6
            (creating) and sentence 7 (revoking), it drops to 0.41. Set a threshold like 0.7 - any boundary below the
            threshold is a chunk break.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Cosine Similarity Across The Doc
            </T>
            {/*
              SVG geometry: viewBox 0 0 640 320.
              Chart area: x from 80 to 600 (width 520), y from 30 to 240 (height 210).
              11 boundary points at x = 80 + (i-1) * (520/10) for i in 1..11.
            */}
            <svg viewBox="0 0 640 320" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Line chart of cosine similarity between adjacent sentences along a 12-sentence document. Similarity
                stays around 0.85-0.92 within the creating cluster (boundaries 1-2 through 5-6) then drops sharply to
                0.41 at boundary 6-7 (the shift to revoking) before climbing back to 0.83-0.91 for the revoking cluster
                (boundaries 7-8 through 11-12). A red dashed horizontal threshold line at 0.7 marks the chunk-break
                cutoff.
              </desc>
              {/* Y axis grid + ticks at 0.0, 0.25, 0.5, 0.75, 1.0 */}
              {[0, 0.25, 0.5, 0.75, 1].map((v) => {
                const y = 240 - v * 210;
                return (
                  <g key={`y-${v}`}>
                    <line x1="80" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <text x="72" y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.55)" fontSize="11">
                      {v.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {/* X axis tick labels */}
              {SEMANTIC_BOUNDARIES.map((b, i) => {
                const x = 80 + i * (520 / 10);
                return (
                  <text
                    key={`x-${b.label}`}
                    x={x}
                    y={262}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.55)"
                    fontSize="11"
                  >
                    {b.label}
                  </text>
                );
              })}
              {/* Axis lines */}
              <line x1="80" y1="240" x2="600" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <line x1="80" y1="30" x2="80" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              {/* Threshold line at 0.7 */}
              <line
                x1="80"
                y1={240 - 0.7 * 210}
                x2="600"
                y2={240 - 0.7 * 210}
                stroke={C.red}
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text x={596} y={240 - 0.7 * 210 - 6} textAnchor="end" fill="#ef9a9a" fontSize="12" fontWeight="bold">
                Threshold = 0.7
              </text>
              {/* Polyline through the boundary points */}
              <polyline
                fill="none"
                stroke={C.purple}
                strokeWidth="2"
                points={SEMANTIC_BOUNDARIES.map((b, i) => {
                  const x = 80 + i * (520 / 10);
                  const y = 240 - b.sim * 210;
                  return `${x},${y}`;
                }).join(" ")}
              />
              {/* Data points + per-point similarity labels */}
              {SEMANTIC_BOUNDARIES.map((b, i) => {
                const x = 80 + i * (520 / 10);
                const y = 240 - b.sim * 210;
                const isBreak = b.sim < 0.7;
                const fill = isBreak ? C.red : C.purple;
                return (
                  <g key={`pt-${b.label}`}>
                    <circle cx={x} cy={y} r={isBreak ? 6 : 4} fill={fill} stroke="#08080d" strokeWidth="1" />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill={isBreak ? "#ef9a9a" : "#b8a9ff"}
                      fontSize={isBreak ? 12 : 10}
                      fontWeight={isBreak ? "bold" : "normal"}
                    >
                      {b.sim.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {/* Axis labels */}
              <text x={340} y={290} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontWeight="bold">
                Sentence Boundary
              </text>
              <text
                x={24}
                y={135}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="13"
                fontWeight="bold"
                transform="rotate(-90 24 135)"
              >
                Cosine Similarity
              </text>
              {/* Callout arrow over the drop */}
              <text
                x={80 + 5 * (520 / 10)}
                y={240 - 0.41 * 210 + 28}
                textAnchor="middle"
                fill="#ef9a9a"
                fontSize="12"
                fontWeight="bold"
              >
                Dip below threshold → chunk break
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            For i in 1..11: sim_i = cosine(v_i, v_i+1). If sim_i &lt; 0.7 → emit chunk break at boundary i.
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 3: Each Cluster Of High-Similarity Sentences = One Chunk
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            One boundary fell below the threshold (boundary 6-7 at sim 0.41). That single break splits the doc into
            exactly 2 chunks. Sentences 1-6 form the creating chunk; sentences 7-12 form the revoking chunk. The chunker
            found the topic shift even though no heading, no blank line, and no markup hinted at it.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={16}>
                Two Chunks From The Cosine Dip
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}40`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold center size={14}>
                    Chunk 1 - Creating Cluster (Sentences 1-6)
                  </T>
                  <T color="#a5d6a7" center size={12} style={{ marginTop: 6 }}>
                    Creating an API key starts in the developer settings page. Click the New Key button and provide a
                    label. The label appears in audit logs. Choose a scope. Optional expiry sets a date. Click Generate
                    and the key value is shown one time only.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px dashed ${C.red}40`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" bold size={12}>
                    Chunk Break (Boundary 6-7, sim = 0.41)
                  </T>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}40`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={14}>
                    Chunk 2 - Revoking Cluster (Sentences 7-12)
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                    Revoking an API key is done from the same developer settings page. Find the key by its label. Click
                    the trash icon. Revocation takes effect within sixty seconds. In-flight requests return 401 after
                    propagation. Revoked keys remain in the audit log for compliance.
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={16}>
                The Win
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 10 }}>
                Semantic chunking found the topic shift that structural chunking would miss - even though there are no
                headings, no double newlines, no markers of any kind.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.orange}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={13}>
                  Retrieval Behavior
                </T>
                <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                  A query for &quot;how do I revoke a key&quot; matches chunk 2 cleanly. A query for &quot;creating a
                  scoped key&quot; matches chunk 1. Neither chunk mixes the two sub-topics.
                </T>
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
                Structural chunkers would have cut at the 128-token mark - somewhere inside sentence 5 or 6 - and
                emitted a chunk that mixes &quot;optional expiry&quot; with &quot;revoking the key&quot;.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            The Cost: Embed-Before-Chunk Is 10-50x More Expensive
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Semantic chunking has to embed every sentence before it can decide where to chunk. That makes it an order of
            magnitude (or more) slower and costlier than structural chunking, where chunk-time work is just string
            splitting. Then you still re-embed the final chunks for the index.
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
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Structural / Fixed-Size
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 10 }}>
                Per doc: 1 pass of string-splitting. About 0.1 ms. Embedding cost at chunk time is $0 - embedding
                happens later, once, on the final chunks.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Cost At Chunk Time
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                  $0 - pure CPU string ops.
                </T>
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Semantic
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 10 }}>
                Per doc: split into sentences (about 0.5 ms) + embed each sentence (about 5 ms per sentence times 12 =
                about 60 ms) + cosine math (about 0.1 ms). At $0.10 per million tokens, a 30-doc corpus chunked
                semantically costs about $0.04.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Cost At Production Scale
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
                  At 10M docs, that&apos;s about $13,000 just to chunk. Then you re-embed the final chunks for the
                  index.
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Use semantic chunking when retrieval quality matters more than indexing budget, and when structural
              markers are absent.
            </T>
          </div>
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
}
