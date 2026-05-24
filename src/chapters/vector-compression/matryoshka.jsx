import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Matryoshka(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            You indexed 500M docs; now you want smaller vectors
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            A year ago the team indexed 500 million documents at d = 3072 using OpenAI&apos;s text-embedding-3-large.
            Latency and memory bills are getting painful. A smaller embedding would help, but re-embedding 500 million
            docs is an expensive proposition: you need the original source text (not always available), API calls add up
            to a significant dollar cost, and the full re-encoding + re-indexing job takes days. What if you could just
            cut the existing vectors shorter?
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
              The cost of re-embedding 500 million documents
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
                { metric: "OpenAI API cost", value: "~$30,000", note: "At $0.13 per 1M tokens, ~2B tokens" },
                { metric: "Wall-clock time", value: "~3-5 days", note: "Even with high concurrency + batching" },
                { metric: "Source-text requirement", value: "Must retain", note: "Many pipelines drop it" },
                { metric: "Index rebuild", value: "On top of that", note: "Extra days of HNSW re-construction" },
              ].map((row, i) => (
                <div
                  key={`cost-${i}`}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.cyan} bold size={14}>
                    {row.metric}
                  </T>
                  <T color={C.bright} bold size={17} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {row.value}
                  </T>
                  <T color={C.dim} size={13} style={{ marginTop: 2 }}>
                    {row.note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Re-embedding is feasible for 1 million docs. At 500 million it is an expensive migration. Matryoshka avoids
            it entirely.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Matryoshka: the first K dimensions are also a valid embedding
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Matryoshka Representation Learning (MRL) is a training-time trick. Instead of training the encoder to
            produce one useful vector at d = 3072, it is trained to produce a vector where the first 256 dims are useful
            on their own, AND the first 512 are useful (and better), AND the first 1024, AND the full 3072. Every prefix
            of the vector is itself a valid embedding. Simply truncating to the first K dims at query time gives a
            working smaller vector, no re-encoding needed.
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
              One vector, several usable truncations
            </T>
            <svg viewBox="0 0 600 150" style={{ width: "100%", maxWidth: 620, height: "auto", display: "block" }}>
              <desc>
                Long horizontal vector bar divided into colored prefix regions at 256, 512, 1024, and 3072 dimensions;
                each prefix is labeled as a valid truncation.
              </desc>
              <rect x="20" y="60" width="80" height="40" fill={C.red} stroke="#08080d" strokeWidth="1" />
              <rect x="100" y="60" width="80" height="40" fill={C.orange} stroke="#08080d" strokeWidth="1" />
              <rect x="180" y="60" width="160" height="40" fill={C.yellow} stroke="#08080d" strokeWidth="1" />
              <rect x="340" y="60" width="240" height="40" fill={C.green} stroke="#08080d" strokeWidth="1" />
              <text x="60" y="85" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                256
              </text>
              <text x="140" y="85" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                512
              </text>
              <text x="260" y="85" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                1024
              </text>
              <text x="460" y="85" textAnchor="middle" fill="#08080d" fontSize="13" fontWeight="bold">
                3072 (full)
              </text>
              <line x1="20" y1="20" x2="340" y2="20" stroke={C.yellow} strokeWidth="1" />
              <text x="180" y="14" textAnchor="middle" fill={C.yellow} fontSize="11">
                First 1024
              </text>
              <line x1="20" y1="50" x2="100" y2="50" stroke={C.red} strokeWidth="1" />
              <text x="60" y="42" textAnchor="middle" fill={C.red} fontSize="11">
                First 256
              </text>
              <line x1="20" y1="118" x2="180" y2="118" stroke={C.orange} strokeWidth="1" />
              <text x="100" y="132" textAnchor="middle" fill={C.orange} fontSize="11">
                First 512
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
            Training loss = &Sigma; over K in {"{"}256, 512, 1024, 2048, 3072{"}"}: L(embed[0..K])
            <br />
            <span style={{ color: C.purple }}>each prefix K is trained to be a usable embedding on its own</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The insight: by penalizing every truncation during training, the model is forced to pack the most important
            information into the early dimensions.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Like Russian dolls: nested valid representations
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Matryoshka dolls nest inside each other - the small one fits inside the medium one, which fits inside the
            large one, and each one is a complete doll on its own. That is exactly the structure of a Matryoshka
            embedding. The 256-dim prefix sits inside the 512-dim prefix sits inside the 1024-dim prefix sits inside the
            full 3072-dim vector. Each prefix is a complete, usable embedding at its own resolution.
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
              Nested concentric spheres: each ring is a valid embedding
            </T>
            <svg viewBox="0 0 400 300" style={{ width: "100%", maxWidth: 440, height: "auto", display: "block" }}>
              <desc>
                Four concentric circles representing Matryoshka embedding prefixes: innermost 256 dims, then 512, 1024,
                and full 3072, resembling nested Russian dolls.
              </desc>
              <circle cx="200" cy="150" r="140" fill={`${C.green}10`} stroke={C.green} strokeWidth="2" />
              <circle cx="200" cy="150" r="105" fill={`${C.yellow}10`} stroke={C.yellow} strokeWidth="2" />
              <circle cx="200" cy="150" r="70" fill={`${C.orange}10`} stroke={C.orange} strokeWidth="2" />
              <circle cx="200" cy="150" r="38" fill={`${C.red}20`} stroke={C.red} strokeWidth="2" />
              <text x="200" y="153" textAnchor="middle" fill={C.bright} fontSize="13" fontWeight="bold">
                256
              </text>
              <text x="200" y="95" textAnchor="middle" fill={C.orange} fontSize="12" fontWeight="bold">
                512
              </text>
              <text x="200" y="60" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                1024
              </text>
              <text x="200" y="25" textAnchor="middle" fill={C.green} fontSize="12" fontWeight="bold">
                3072 (full)
              </text>
            </svg>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Nested. Concentric. Each prefix is complete. The Russian doll analogy is not metaphor; it is structural.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Truncate to 512 dims for 6x memory savings
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Here is the payoff. Keep shipping the full 3072-dim embedding (it is the richest version and useful for
            reranking), but only load the first 512 dimensions into the vector index. The index is 6x smaller (3072 /
            512), HNSW graph distances are 6x cheaper to compute, RAM footprint drops 6x. On typical long-context
            retrieval workloads the recall hit is about 2-4% - a much smaller cost than re-embedding from scratch.
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
              Memory at N = 500M, Matryoshka truncation to 512
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}18`,
                  borderRadius: 6,
                  textAlign: "center",
                  color: C.bright,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  Full d = 3072
                </T>
                <div style={{ marginTop: 6 }}>
                  3,072 &middot; 4 = 12,288 bytes per vector
                  <br />
                  500M &middot; 12 KB = <span style={{ color: C.red }}>6 TB index</span>
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.orange}10`,
                  border: `1px solid ${C.orange}28`,
                  borderRadius: 6,
                  textAlign: "center",
                  color: C.bright,
                }}
              >
                <T color={C.orange} bold center size={15}>
                  Truncated to 512
                </T>
                <div style={{ marginTop: 6 }}>
                  512 &middot; 4 = 2,048 bytes per vector
                  <br />
                  500M &middot; 2 KB = <span style={{ color: C.green }}>1 TB index</span>
                </div>
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
              lineHeight: 2,
            }}
          >
            <span style={{ color: C.green, fontWeight: "bold" }}>6x savings: 6 TB &rarr; 1 TB</span>
            <br />
            Recall@10: 0.97 at 3072 &rarr; 0.94 at 512 (about 3% drop)
            <br />
            Full 3072-dim kept on cold storage for reranking stage
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The vectors already exist in their full form. Truncation is a metadata change. Zero re-encoding cost.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Adaptive precision: coarse to fine, same embedding
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Matryoshka enables a smarter two-stage retrieval than binary + float rerank. Stage 1 uses the 256-dim prefix
            to scan a large candidate pool cheaply - every document gets a coarse comparison. Stage 2 reruns just the
            top 100 candidates with the full 3072-dim vector for the fine-grained ranking. Both stages use the same
            source embedding; no separate models, no separate index. Adaptive precision with zero retraining cost.
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
              Coarse-to-fine retrieval with a single embedding
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}18`,
                  borderRadius: 6,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                <T color={C.red} bold center size={15}>
                  Stage 1: coarse (256-dim)
                </T>
                <div style={{ marginTop: 6 }}>
                  Scan 500M docs fast
                  <br />
                  6x smaller index vs truncate=512
                  <br />
                  12x smaller index vs full
                  <br />
                  Return top 100
                </div>
              </div>
              <div style={{ fontSize: 26, color: C.yellow }}>&rarr;</div>
              <div
                style={{
                  padding: "12px 14px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}18`,
                  borderRadius: 6,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                <T color={C.green} bold center size={15}>
                  Stage 2: fine (3072-dim)
                </T>
                <div style={{ marginTop: 6 }}>
                  Rerank 100 candidates
                  <br />
                  Full 3072-dim precision
                  <br />
                  Cheap: only 100 dot products
                  <br />
                  Return final top 10
                </div>
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
              lineHeight: 2,
            }}
          >
            End-to-end recall: ~0.98 &middot; end-to-end latency: ~5 ms
            <br />
            <span style={{ color: C.yellow }}>one embedding, two resolutions, adaptive precision</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The 256-dim prefix wears the cheap-filter hat; the 3072-dim full vector wears the accurate-rerank hat. One
            encoder pass at index time; both roles served thereafter.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Where Matryoshka is available today
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Matryoshka went from research paper (ICML 2022) to production in about a year. OpenAI shipped
            text-embedding-3-small (d = 1536) and text-embedding-3-large (d = 3072) with Matryoshka training in January
            2024; both expose a dimensions parameter in their API that does the truncation on-server before returning
            the vector. Cohere Embed v3 and Jina AI v3 followed. Custom Matryoshka training is also available for
            self-hosted models via the sentence-transformers library.
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
              Production Matryoshka embedding models
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
                  name: "OpenAI text-embedding-3-large",
                  full: "d = 3072",
                  trunc: "Any K <= 3072",
                  note: "Dimensions parameter in API",
                },
                {
                  name: "OpenAI text-embedding-3-small",
                  full: "d = 1536",
                  trunc: "Any K <= 1536",
                  note: "Cheaper, same technique",
                },
                {
                  name: "Cohere Embed v3 (English)",
                  full: "d = 1024",
                  trunc: "256, 384, 512, 1024",
                  note: "Int8 + binary too",
                },
                {
                  name: "Jina Embeddings v3",
                  full: "d = 1024",
                  trunc: "K <= 1024",
                  note: "Open weights + Matryoshka",
                },
              ].map((model) => (
                <div
                  key={model.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.red}08`,
                    border: `1px solid ${C.red}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.red} bold size={14}>
                    {model.name}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: C.bright, lineHeight: 1.7 }}
                  >
                    Full: {model.full}
                    <br />
                    Truncation: {model.trunc}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {model.note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Matryoshka is the compression lever production teams can turn on the same day the model provider ships it. A
            smaller, faster index with zero re-embedding, available out of the box from the major providers.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Stack MRL with SQ, PQ, or BQ - both cuts apply, bytes multiply down
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A vector takes up bytes for two reasons: it has many numbers, and each number takes many bits. MRL cuts the
            count of numbers (chop the row shorter). SQ, PQ, and BQ cut the bits per number (squish each cell flatter).
            They are different scissors on different parts of the vector, so the compression ratios multiply: a 3x cut
            from MRL plus a 4x cut from SQ gives 12x total, not 7x.
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
              Total bytes = dim count &times; bits per dim. Cut either side independently.
            </T>
            <svg
              viewBox="0 0 720 380"
              style={{ width: "100%", maxWidth: 720, height: "auto", display: "block", marginTop: 10 }}
            >
              <desc>
                Two-axis area chart with x-axis showing dimension count from 0 to 3072 and y-axis showing bits per
                dimension from 0 to 32. Total vector bytes equals the area of each rectangle. Four nested rectangles
                show progressive compression: full float32 baseline at 3072 by 32 equals 12,288 bytes (large outer cyan
                rectangle), MRL truncated at 1024 by 32 equals 4,096 bytes (purple), MRL plus SQ at 1024 by 8 equals
                1,024 bytes (green), and MRL plus BQ at 1024 by 1 equals 128 bytes (orange sliver). The diagram shows
                how MRL shrinks width while quantization shrinks height, and the two effects multiply geometrically.
              </desc>
              {/* Plot area background */}
              <rect x={80} y={20} width={600} height={300} fill="rgba(0,0,0,0.25)" />
              {/* Full float32 baseline rectangle (cyan, dashed outline) */}
              <rect
                x={80}
                y={20}
                width={600}
                height={300}
                fill={`${C.cyan}10`}
                stroke={C.cyan}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <text x={500} y={50} textAnchor="middle" fill={C.cyan} fontSize={13} fontWeight="bold">
                Full float32: 3072 dims &times; 32 bits = 12,288 B
              </text>
              {/* After MRL only (purple solid) - 1024 dims at 32 bits */}
              <rect x={80} y={20} width={200} height={300} fill={`${C.purple}25`} stroke={C.purple} strokeWidth={2} />
              <text x={180} y={140} textAnchor="middle" fill={C.purple} fontSize={13} fontWeight="bold">
                After MRL only
              </text>
              <text x={180} y={158} textAnchor="middle" fill={C.bright} fontSize={11}>
                1024 dims &times; 32 bits = 4,096 B
              </text>
              <text x={180} y={174} textAnchor="middle" fill={C.purple} fontSize={11} fontStyle="italic">
                3x smaller (width cut)
              </text>
              {/* After MRL + SQ (green) - 1024 dims at 8 bits */}
              <rect x={80} y={245} width={200} height={75} fill={`${C.green}50`} stroke={C.green} strokeWidth={2} />
              <text x={180} y={275} textAnchor="middle" fill={C.green} fontSize={13} fontWeight="bold">
                + SQ (int8)
              </text>
              <text x={180} y={290} textAnchor="middle" fill={C.bright} fontSize={11}>
                1024 &times; 8 = 1,024 B
              </text>
              <text x={180} y={305} textAnchor="middle" fill={C.green} fontSize={10} fontStyle="italic">
                12x vs baseline
              </text>
              {/* After MRL + BQ (orange) - 1024 dims at 1 bit (tiny sliver) */}
              <rect x={80} y={310.6} width={200} height={9.4} fill={C.orange} stroke={C.orange} strokeWidth={1.5} />
              {/* Leader line for the tiny BQ sliver - routed to right side inside plot area */}
              <line x1={280} y1={315} x2={420} y2={285} stroke={C.orange} strokeWidth={1} />
              <text x={425} y={282} textAnchor="start" fill={C.orange} fontSize={12} fontWeight="bold">
                + BQ: 1024 &times; 1 = 128 B
              </text>
              <text x={425} y={298} textAnchor="start" fill={C.orange} fontSize={11} fontStyle="italic">
                96x vs baseline (sliver)
              </text>
              {/* Y-axis line */}
              <line x1={80} y1={20} x2={80} y2={320} stroke={C.bright} strokeWidth={1.5} />
              {/* X-axis line */}
              <line x1={80} y1={320} x2={680} y2={320} stroke={C.bright} strokeWidth={1.5} />
              {/* Y-axis ticks: 1, 8, 32 (skip 0 - implied at corner, would overlap with 1 tick) */}
              <line x1={76} y1={310.6} x2={80} y2={310.6} stroke={C.orange} strokeWidth={1.5} />
              <text x={72} y={314} textAnchor="end" fill={C.orange} fontSize={11}>
                1
              </text>
              <line x1={76} y1={245} x2={80} y2={245} stroke={C.green} strokeWidth={1.5} />
              <text x={72} y={249} textAnchor="end" fill={C.green} fontSize={11}>
                8
              </text>
              <line x1={76} y1={20} x2={80} y2={20} stroke={C.cyan} strokeWidth={1.5} />
              <text x={72} y={24} textAnchor="end" fill={C.cyan} fontSize={11}>
                32
              </text>
              {/* X-axis ticks: 0, 1024, 3072 */}
              <line x1={80} y1={320} x2={80} y2={324} stroke={C.bright} strokeWidth={1.5} />
              <text x={80} y={338} textAnchor="middle" fill={C.bright} fontSize={11}>
                0
              </text>
              <line x1={280} y1={320} x2={280} y2={324} stroke={C.purple} strokeWidth={1.5} />
              <text x={280} y={338} textAnchor="middle" fill={C.purple} fontSize={11}>
                1024
              </text>
              <line x1={680} y1={320} x2={680} y2={324} stroke={C.cyan} strokeWidth={1.5} />
              <text x={680} y={338} textAnchor="middle" fill={C.cyan} fontSize={11}>
                3072
              </text>
              {/* Axis labels */}
              <text x={380} y={372} textAnchor="middle" fill={C.bright} fontSize={13} fontWeight="bold">
                dimensions (d) &rarr; MRL chops here
              </text>
              <text
                x={28}
                y={170}
                textAnchor="middle"
                fill={C.bright}
                fontSize={13}
                fontWeight="bold"
                transform="rotate(-90, 28, 170)"
              >
                Bits per dim &rarr; SQ/PQ/BQ chop here
              </text>
              {/* MRL arrow at top showing the cut */}
              <line x1={280} y1={10} x2={680} y2={10} stroke={C.purple} strokeWidth={1.5} strokeDasharray="3 3" />
              <polygon points="280,10 286,7 286,13" fill={C.purple} />
              <polygon points="680,10 674,7 674,13" fill={C.purple} />
              <text x={480} y={8} textAnchor="middle" fill={C.purple} fontSize={11} fontWeight="bold">
                MRL: cut these 2048 dims
              </text>
              {/* Quantization arrow on the right showing the cut */}
              <line x1={700} y1={20} x2={700} y2={245} stroke={C.green} strokeWidth={1.5} strokeDasharray="3 3" />
              <polygon points="700,20 697,26 703,26" fill={C.green} />
              <polygon points="700,245 697,239 703,239" fill={C.green} />
              <text
                x={715}
                y={130}
                textAnchor="middle"
                fill={C.green}
                fontSize={11}
                fontWeight="bold"
                transform="rotate(90, 715, 130)"
              >
                SQ cuts: 32 bits &rarr; 8
              </text>
            </svg>
            <T color="#b8a9ff" size={14} center style={{ marginTop: 8, fontStyle: "italic" }}>
              Each rectangle&apos;s area = its byte size. The full baseline (dashed cyan, 12,288 B) is the whole plot.
              MRL alone shrinks the width to 1/3. SQ alone would shrink the height to 1/4. Stack both and you get the
              tiny green box at 1/12 the area. Stack MRL with BQ and you get a barely-visible orange sliver at 1/96.
            </T>
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
              Cell-level view: same vector through each stage
            </T>
            <svg
              viewBox="0 0 720 320"
              style={{ width: "100%", maxWidth: 720, height: "auto", display: "block", marginTop: 10 }}
            >
              <desc>
                Four horizontal cell-rows showing the same embedding vector progressing through compression. Row 1 shows
                24 tall float32 cells representing 3072 dimensions at 32 bits each, totaling 12,288 bytes. Row 2 shows
                the first 8 cells kept at full height (the MRL-truncated 1024 dims) with the remaining 16 cells faded to
                indicate they were chopped, totaling 4,096 bytes. Row 3 shows the same 8 cells but three-quarters
                shorter (8 bits each, SQ int8), totaling 1,024 bytes. Row 4 shows the same 8 cells as tiny slivers (1
                bit each, BQ binary), totaling 128 bytes. Demonstrates that MRL throws away cells from the right while
                quantization shrinks the height of every remaining cell.
              </desc>
              {/* Stage 1: full float32 row of 24 cells, tall */}
              <text x={10} y={36} textAnchor="start" fill={C.cyan} fontSize={12} fontWeight="bold">
                Full
              </text>
              <text x={10} y={52} textAnchor="start" fill={C.dim} fontSize={10}>
                Float32
              </text>
              {Array.from({ length: 24 }).map((_, i) => (
                <rect
                  key={`s1-${i}`}
                  x={70 + i * 25}
                  y={20}
                  width={22}
                  height={50}
                  fill={`${C.cyan}66`}
                  stroke={C.cyan}
                  strokeWidth={1}
                />
              ))}
              <text x={690} y={50} textAnchor="end" fill={C.cyan} fontSize={12} fontWeight="bold">
                12,288 B
              </text>
              <text x={380} y={84} textAnchor="middle" fill={C.dim} fontSize={11}>
                3072 dims (24 cells shown) &middot; each cell = 32 bits tall
              </text>
              {/* Stage 2: MRL keeps first 8 cells at full height, fades the rest */}
              <text x={10} y={116} textAnchor="start" fill={C.purple} fontSize={12} fontWeight="bold">
                + MRL
              </text>
              <text x={10} y={132} textAnchor="start" fill={C.dim} fontSize={10}>
                Truncate
              </text>
              {Array.from({ length: 24 }).map((_, i) => {
                const kept = i < 8;
                return (
                  <rect
                    key={`s2-${i}`}
                    x={70 + i * 25}
                    y={100}
                    width={22}
                    height={50}
                    fill={kept ? `${C.purple}66` : "rgba(255,255,255,0.04)"}
                    stroke={kept ? C.purple : C.dim}
                    strokeWidth={1}
                    strokeDasharray={kept ? "0" : "2 3"}
                  />
                );
              })}
              <text x={690} y={130} textAnchor="end" fill={C.purple} fontSize={12} fontWeight="bold">
                4,096 B
              </text>
              <text x={380} y={164} textAnchor="middle" fill={C.dim} fontSize={11}>
                First 1024 dims kept (8 cells solid) &middot; last 2048 chopped (16 cells dashed)
              </text>
              {/* Stage 3: MRL+SQ - same 8 cells, but 1/4 height */}
              <text x={10} y={196} textAnchor="start" fill={C.green} fontSize={12} fontWeight="bold">
                + SQ
              </text>
              <text x={10} y={212} textAnchor="start" fill={C.dim} fontSize={10}>
                Int8
              </text>
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={`s3-${i}`}
                  x={70 + i * 25}
                  y={195}
                  width={22}
                  height={12}
                  fill={`${C.green}80`}
                  stroke={C.green}
                  strokeWidth={1}
                />
              ))}
              <text x={690} y={210} textAnchor="end" fill={C.green} fontSize={12} fontWeight="bold">
                1,024 B
              </text>
              <text x={380} y={228} textAnchor="middle" fill={C.dim} fontSize={11}>
                Same 1024 dims &middot; each cell now 8 bits tall (1/4 of float32)
              </text>
              {/* Stage 4: MRL+BQ - same 8 cells, 1 bit (tiny sliver) */}
              <text x={10} y={262} textAnchor="start" fill={C.orange} fontSize={12} fontWeight="bold">
                + BQ
              </text>
              <text x={10} y={278} textAnchor="start" fill={C.dim} fontSize={10}>
                1 bit
              </text>
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={`s4-${i}`}
                  x={70 + i * 25}
                  y={258}
                  width={22}
                  height={3}
                  fill={C.orange}
                  stroke={C.orange}
                  strokeWidth={1}
                />
              ))}
              <text x={690} y={266} textAnchor="end" fill={C.orange} fontSize={12} fontWeight="bold">
                128 B
              </text>
              <text x={380} y={290} textAnchor="middle" fill={C.dim} fontSize={11}>
                Same 1024 dims &middot; each cell now 1 bit tall (1/32 of float32)
              </text>
              <text x={380} y={310} textAnchor="middle" fill={C.bright} fontSize={12} fontStyle="italic">
                MRL chops cells from the right. Quantization shrinks the cells that remain.
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
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
              <T color={C.green} bold center size={16}>
                MRL + SQ
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              >
                <div>12,288 B float32</div>
                <div>&darr; MRL: 3072 &rarr; 1024</div>
                <div>4,096 B float32 (3x)</div>
                <div>&darr; SQ: 32 &rarr; 8 bits</div>
                <div>1,024 B int8 (4x more)</div>
              </div>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                3 &times; 4 = 12x total
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                Recall ~96-97%
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                MRL + PQ
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              >
                <div>12,288 B float32</div>
                <div>&darr; MRL: 3072 &rarr; 1024</div>
                <div>4,096 B float32 (3x)</div>
                <div>&darr; PQ: m=128 codes</div>
                <div>128 B (32x more)</div>
              </div>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                3 &times; 32 = 96x total
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                Recall ~93-95%
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                MRL + BQ
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              >
                <div>12,288 B float32</div>
                <div>&darr; MRL: 3072 &rarr; 1024</div>
                <div>4,096 B float32 (3x)</div>
                <div>&darr; BQ: 32 &rarr; 1 bit</div>
                <div>128 B binary (32x more)</div>
              </div>
              <T color={C.orange} bold center size={15} style={{ marginTop: 8 }}>
                3 &times; 32 = 96x total
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                ~94% &rarr; ~98% with rerank
              </T>
            </div>
          </div>

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
              Two rules that govern the stack
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}22`,
                  borderRadius: 6,
                }}
              >
                <T color={C.red} bold size={15}>
                  Order: MRL first, quantize after
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  Truncate at embed time, quantize at index time. Reverse breaks: quantized codes have no semantic
                  prefix structure to truncate. PQ codebook must be trained on already-truncated vectors so centroids
                  match the truncated dim count.
                </T>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}22`,
                  borderRadius: 6,
                }}
              >
                <T color={C.red} bold size={15}>
                  Floor: BQ needs d &ge; 768 post-MRL
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  Binary quantization recall collapses below d = 768 (per the previous chapter&apos;s recall table). MRL
                  must keep at least 768 dimensions in the truncation if the next stage is BQ. SQ and PQ have no such
                  floor - they degrade gracefully at low d.
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
              lineHeight: 2,
            }}
          >
            Real-world stack at N = 1B docs
            <br />
            OpenAI text-embedding-3-large &rarr; <span style={{ color: C.cyan }}>MRL to 1024</span> &rarr;{" "}
            <span style={{ color: C.cyan }}>SQ int8</span> &rarr; <span style={{ color: C.cyan }}>HNSW</span>
            <br />
            Hot RAM: 1B &middot; 1024 B = <span style={{ color: C.green }}>1 TB</span>
            <br />
            vs baseline: 1B &middot; 12,288 B = <span style={{ color: C.red }}>12 TB</span>
            <br />
            <span style={{ color: C.green }}>12x compression, ~96% recall, single beefy server territory</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            MRL is the cheap pre-step that makes every later compression cheaper. Production stacks routinely combine
            MRL with one quantizer plus an HNSW or IVF index. The decision framework chapter walks the choice in detail.
          </T>
        </Box>
      </Reveal>
      {sub < 6 && (
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
