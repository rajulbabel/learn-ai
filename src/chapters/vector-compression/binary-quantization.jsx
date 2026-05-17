import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function BinaryQuantization(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // Illustrative 16-dim slice (standing in for d = 1024). Centered around 0 so sign-based binarization works.
  const bqFloatVec = [
    0.81, -0.12, 0.45, -0.22, 0.63, -0.07, 0.38, 0.91, -0.44, 0.28, -0.56, 0.19, 0.72, -0.34, 0.15, -0.48,
  ];
  const bqBits = bqFloatVec.map((v) => (v >= 0 ? 1 : 0));
  const bqBitsB = [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1];
  const xorResult = bqBits.map((b, i) => b ^ bqBitsB[i]);
  const popcount = xorResult.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A 1024-dim float32 vector is 4 KB
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Binary quantization pushes compression harder than anything else. Start with a float32 vector at d = 1024,
            which is roughly what you get from a strong encoder like E5-large or BGE-large. That is 1024 dimensions
            multiplied by 4 bytes per float, totaling 4,096 bytes (4 KB) for a single vector. For 1 billion such
            vectors, that is 4 TB before any index structure. The binary trick is the most extreme compression you can
            practically use.
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
              Float32 vector at d = 1024 (first 16 dims shown)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(16, 1fr)",
                gap: 3,
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              {bqFloatVec.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "5px 2px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: v >= 0 ? C.bright : C.red,
                  }}
                >
                  {v.toFixed(2)}
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
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            d = 1024 &middot; 4 bytes = <span style={{ color: C.cyan }}>4,096 bytes = 4 KB</span>
            <br />
            At N = 1B: <span style={{ color: C.red }}>4 TB of raw vectors</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scalar quantization brought this down to 1 KB. Binary quantization pushes it to 128 bytes.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            1 bit per dimension: keep only the sign
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The rule is as simple as it gets: if the dimension value is positive or zero, store a 1; if negative, store
            a 0. Everything else about the vector is thrown away. One bit per dimension means a 1024-dim vector becomes
            1024 bits, or 128 bytes (1024 divided by 8). That is a 32x reduction versus float32, and the encoding step
            is a single sign comparison per dimension.
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
              Sign-based binarization (first 16 dims)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 8,
                fontFamily: "monospace",
                fontSize: 12,
                alignItems: "center",
              }}
            >
              <div style={{ color: C.yellow, textAlign: "right" }}>Float32:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
                {bqFloatVec.map((v, i) => (
                  <div
                    key={`f-${i}`}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      color: v >= 0 ? C.bright : C.red,
                      background: `${C.yellow}08`,
                      borderRadius: 3,
                      fontSize: 11,
                    }}
                  >
                    {v.toFixed(2)}
                  </div>
                ))}
              </div>
              <div style={{ color: C.yellow, textAlign: "right" }}>bit:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
                {bqBits.map((b, i) => (
                  <div
                    key={`b-${i}`}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      color: C.bright,
                      background: b === 1 ? `${C.yellow}28` : "rgba(0,0,0,0.3)",
                      borderRadius: 3,
                      fontWeight: "bold",
                    }}
                  >
                    {b}
                  </div>
                ))}
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
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            Bit_i = 1 if v_i &ge; 0 else 0
            <br />d = 1024 &rarr; 1024 bits = <span style={{ color: C.yellow }}>128 bytes per vector</span>
            <br />
            <span style={{ color: C.green, fontWeight: "bold" }}>32x compression vs float32</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Almost all of the magnitude information is gone. What remains is direction-of-sign only - and for
            high-dimensional embeddings, that turns out to be enough.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance = XOR + popcount
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Once vectors are binary, the distance between two of them is Hamming distance - the number of positions
            where their bits differ. In one CPU instruction that is XOR (sets bits to 1 where the two vectors disagree)
            followed by popcount (counts the number of 1 bits). Modern CPUs have POPCNT as a hardware instruction; on
            AVX-512 VPOPCNTQ processes 512 bits per op. A 1024-dim comparison is two of these ops. It is blazingly fast.
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
              Hamming distance walkthrough (16-bit example)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 8,
                fontFamily: "monospace",
                fontSize: 12,
                alignItems: "center",
              }}
            >
              <div style={{ color: C.green, textAlign: "right" }}>Doc A:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
                {bqBits.map((b, i) => (
                  <div
                    key={`a-${i}`}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      color: C.bright,
                      background: b === 1 ? `${C.green}28` : "rgba(0,0,0,0.3)",
                      borderRadius: 3,
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
              <div style={{ color: C.green, textAlign: "right" }}>Doc B:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
                {bqBitsB.map((b, i) => (
                  <div
                    key={`bb-${i}`}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      color: C.bright,
                      background: b === 1 ? `${C.green}28` : "rgba(0,0,0,0.3)",
                      borderRadius: 3,
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
              <div style={{ color: C.yellow, textAlign: "right" }}>A XOR B:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
                {xorResult.map((b, i) => (
                  <div
                    key={`x-${i}`}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      color: C.bright,
                      background: b === 1 ? `${C.red}28` : `${C.green}28`,
                      borderRadius: 3,
                      fontWeight: "bold",
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <T color={C.bright} center size={14} style={{ marginTop: 10 }}>
              popcount(A XOR B) = <span style={{ color: C.green, fontWeight: "bold" }}>{popcount}</span> &middot;{" "}
              {popcount} of 16 bits differ
            </T>
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
            hamming(a, b) = popcount(a XOR b)
            <br />
            1024-bit comparison: 2 AVX-512 ops &middot; about 1 ns per pair
            <br />
            <span style={{ color: C.green }}>~100x faster than float32 dot product</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One XOR plus one popcount is about as close to free as distance computation gets in modern hardware.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            At high d, binary recall stays surprisingly good
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Binary looks catastrophic on paper - we threw away 31 bits out of every 32. But BERT-style embeddings have a
            redundancy property: any single dimension carries only a little bit of information, and the signal is spread
            across hundreds of them. At d = 768 or d = 1024, the sign pattern alone is enough to recover about 95% of
            the true nearest-neighbor ordering. At d = 1536 (OpenAI text-embedding-3-small) it does even better.
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
              Recall@10 vs embedding dimension (BERT-style models)
            </T>
            <svg viewBox="0 0 500 220" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}>
              <desc>
                Curve showing binary quantization recall rising sharply with embedding dimension. Nearly 0 at d=64,
                rising past 0.9 around d=512, plateauing around 0.96 at d=1024 and higher.
              </desc>
              <line x1="60" y1="180" x2="480" y2="180" stroke={C.dim} strokeWidth="1" />
              <line x1="60" y1="30" x2="60" y2="180" stroke={C.dim} strokeWidth="1" />
              <text x="270" y="205" textAnchor="middle" fill={C.dim} fontSize="12">
                Embedding dimension d
              </text>
              <text x="30" y="105" textAnchor="middle" fill={C.dim} fontSize="12" transform="rotate(-90 30 105)">
                Recall@10
              </text>
              {[
                { d: "64", x: 80 },
                { d: "128", x: 150 },
                { d: "256", x: 220 },
                { d: "512", x: 320 },
                { d: "768", x: 380 },
                { d: "1024", x: 440 },
              ].map((tick) => (
                <g key={tick.d}>
                  <line x1={tick.x} y1="180" x2={tick.x} y2="184" stroke={C.dim} strokeWidth="1" />
                  <text x={tick.x} y="196" textAnchor="middle" fill={C.dim} fontSize="11">
                    {tick.d}
                  </text>
                </g>
              ))}
              {[
                { r: "0.5", y: 150 },
                { r: "0.8", y: 90 },
                { r: "0.95", y: 45 },
                { r: "1.0", y: 30 },
              ].map((tick) => (
                <g key={tick.r}>
                  <line x1="56" y1={tick.y} x2="60" y2={tick.y} stroke={C.dim} strokeWidth="1" />
                  <text x="52" y={tick.y + 4} textAnchor="end" fill={C.dim} fontSize="11">
                    {tick.r}
                  </text>
                </g>
              ))}
              <path
                d="M 80 178 Q 120 170 150 155 Q 180 130 220 100 Q 280 65 320 55 Q 380 48 440 45"
                fill="none"
                stroke={C.purple}
                strokeWidth="2.5"
              />
              <circle cx="380" cy="50" r="5" fill={C.green} />
              <text x="380" y="30" textAnchor="middle" fill={C.green} fontSize="12" fontWeight="bold">
                d=768, recall 0.95
              </text>
              <circle cx="440" cy="45" r="5" fill={C.green} />
              <text x="440" y="80" textAnchor="middle" fill={C.green} fontSize="12" fontWeight="bold">
                d=1024, recall 0.96
              </text>
            </svg>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The sign pattern of a 1024-dim embedding carries most of the useful semantic information. Magnitude data is
            mostly redundant.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Below d = 256, recall collapses
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The redundancy property that makes binary work at high d disappears at low d. With only 128 or 256
            dimensions, each dimension is carrying meaningful information, and reducing it to a single bit throws away
            signal you actually need. At d = 128 the binary recall drops to around 0.60. At d = 64 it is barely better
            than random. Binary quantization should never be used on small embeddings.
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", color: C.red, fontWeight: "bold", textAlign: "center" }}>
                Dimension
              </div>
              <div style={{ padding: "8px 10px", color: C.red, fontWeight: "bold", textAlign: "center" }}>
                Recall@10
              </div>
              <div style={{ padding: "8px 10px", color: C.red, fontWeight: "bold", textAlign: "center" }}>Status</div>
              {[
                { d: "64", recall: "0.18", ok: false, note: "near-random" },
                { d: "128", recall: "0.60", ok: false, note: "unusable" },
                { d: "256", recall: "0.82", ok: false, note: "borderline" },
                { d: "512", recall: "0.93", ok: true, note: "OK with rerank" },
                { d: "768", recall: "0.95", ok: true, note: "Production OK" },
                { d: "1024+", recall: "0.96+", ok: true, note: "excellent" },
              ].map((row, i) => (
                <div key={`bc-${i}`} style={{ display: "contents" }}>
                  <div style={{ padding: "6px 10px", textAlign: "center", color: C.bright }}>d = {row.d}</div>
                  <div
                    style={{
                      padding: "6px 10px",
                      textAlign: "center",
                      color: row.ok ? C.green : C.red,
                      fontWeight: "bold",
                    }}
                  >
                    {row.recall}
                  </div>
                  <div style={{ padding: "6px 10px", textAlign: "center", color: C.dim }}>{row.note}</div>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The informal rule of thumb: use binary at d &ge; 768, never at d &le; 256. In between, measure on your data.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Production use: binary + rerank stage
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Production systems rarely use binary alone - the 5% recall loss is too much for most workloads. The standard
            pattern is a two-stage retrieval: run the binary index for stage 1 to pull back a generous candidate set
            (say, top 100), then re-score those 100 with the original float32 vectors for stage 2. The binary index does
            the expensive linear scan; the rerank is cheap because it only runs on 100 docs.
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
              Two-stage retrieval with binary + float32 rerank
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
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}18`,
                  borderRadius: 6,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                <T color={C.yellow} bold center size={15}>
                  Stage 1: binary index
                </T>
                <div style={{ marginTop: 6 }}>
                  N = 1B docs
                  <br />
                  Scan with XOR + popcount
                  <br />
                  Return top 100 candidates
                </div>
              </div>
              <div style={{ fontSize: 26, color: C.orange }}>&rarr;</div>
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
                  Stage 2: float32 rerank
                </T>
                <div style={{ marginTop: 6 }}>
                  100 candidates
                  <br />
                  Full float32 dot products
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
            Qdrant ships binary quantization + rerank natively.
            <br />
            Pinecone uses the same pattern in its serverless tier.
            <br />
            Recall recovery after rerank: back to ~99% of the float32 baseline
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Binary is the right compression when memory is the bottleneck AND you have room for a short rerank pass.
            Those two together are a common production setup.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the sign threshold
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "New dim 5 batch mean = 0.4, bits collapse 78/22" },
              { tag: "UPDATE", caption: "Re-binarized with stale threshold; same collapse" },
              { tag: "DELETE", caption: "Bit-balance stats decay; old codes linger" },
            ].map((op) => (
              <div
                key={op.tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {op.tag}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {op.caption}
                </T>
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 720 320"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Two side-by-side histograms for dim 5: the left training distribution is centered at 0 with split 51/49
              labeled in green, the right drifted distribution is centered at 0.4 with split 78/22 labeled in red, and a
              vertical sign-threshold line at x = 0 cuts both. Below sit two 8-cell bit-grid rows showing training
              mostly mixed 0/1 vs drifted mostly 1s, with a small tombstone cell.
            </desc>
            <text x="190" y="20" fontSize="13" fill={C.green} textAnchor="middle" fontWeight="bold">
              Training (dim 5)
            </text>
            <line x1="70" y1="180" x2="310" y2="180" stroke="#666" />
            <line x1="190" y1="40" x2="190" y2="180" stroke="#888" strokeDasharray="3 3" />
            <text x="190" y="200" fontSize="11" fill="#888" textAnchor="middle">
              Sign = 0
            </text>
            {[20, 40, 70, 95, 80, 50, 30, 15, 8].map((h, i) => (
              <rect key={i} x={80 + i * 25} y={180 - h} width="22" height={h} fill={`${C.green}aa`} />
            ))}
            <text x="190" y="225" fontSize="12" fill={C.green} textAnchor="middle" fontWeight="bold">
              Split 51/49
            </text>
            <text x="530" y="20" fontSize="13" fill={C.red} textAnchor="middle" fontWeight="bold">
              Drifted (dim 5, mean 0.4)
            </text>
            <line x1="410" y1="180" x2="650" y2="180" stroke="#666" />
            <line x1="530" y1="40" x2="530" y2="180" stroke="#888" strokeDasharray="3 3" />
            <text x="530" y="200" fontSize="11" fill="#888" textAnchor="middle">
              Sign = 0
            </text>
            {[5, 8, 12, 25, 50, 80, 95, 75, 40].map((h, i) => (
              <rect key={i} x={420 + i * 25} y={180 - h} width="22" height={h} fill={`${C.red}aa`} />
            ))}
            <text x="530" y="225" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">
              Split 78/22
            </text>
            <text x="240" y="265" fontSize="11" fill={C.green} textAnchor="end">
              Training:
            </text>
            {["0", "1", "0", "1", "1", "0", "1", "0"].map((b, i) => (
              <g key={i}>
                <rect x={250 + i * 24} y="252" width="20" height="20" fill={`${C.green}30`} stroke={`${C.green}80`} />
                <text x={260 + i * 24} y="266" fontSize="11" fill={C.bright} textAnchor="middle">
                  {b}
                </text>
              </g>
            ))}
            <text x="240" y="300" fontSize="11" fill={C.red} textAnchor="end">
              Drifted:
            </text>
            {["1", "1", "1", "0", "1", "1", "1", "1"].map((b, i) => (
              <g key={i}>
                <rect x={250 + i * 24} y="287" width="20" height="20" fill={`${C.red}30`} stroke={`${C.red}80`} />
                <text x={260 + i * 24} y="301" fontSize="11" fill={C.bright} textAnchor="middle">
                  {b}
                </text>
              </g>
            ))}
            <rect x="446" y="287" width="20" height="20" fill="none" stroke="#888" strokeDasharray="2 2" />
            <line x1="446" y1="287" x2="466" y2="307" stroke="#888" strokeWidth="1" />
            <text x="476" y="301" fontSize="10" fill="#888">
              Tombstone
            </text>
          </svg>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: zero-centered models + bit-balance alert + compaction
          </T>
          <svg
            viewBox="0 0 720 220"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Bit-balance bar grid: 64 thin vertical bars sample the per-dim deviation from a 50/50 bit split (a
              representative subset of the 1024 dims). Most bars are short and green; a handful are tall and red,
              flagged with small alert badges above for dims with greater than 70 percent imbalance. A horizontal yellow
              dashed line marks the 70% imbalance alert.
            </desc>
            <text x="60" y="22" fontSize="11" fill="#aaa">
              |Bit_balance - 50%| per dim
            </text>
            <line x1="60" y1="180" x2="700" y2="180" stroke="#666" />
            <line x1="60" y1="40" x2="60" y2="180" stroke="#666" />
            {Array.from({ length: 64 }).map((_, i) => {
              const isDriftDim = i % 11 === 7 || i === 23 || i === 51;
              const h = isDriftDim ? 110 : 8 + ((i * 17) % 28);
              return (
                <g key={i}>
                  <rect x={64 + i * 9.7} y={180 - h} width="6" height={h} fill={isDriftDim ? C.red : C.green} />
                  {isDriftDim && (
                    <text x={67 + i * 9.7} y={180 - h - 4} fontSize="11" fill={C.red} textAnchor="middle">
                      !
                    </text>
                  )}
                </g>
              );
            })}
            <line x1="60" y1="110" x2="700" y2="110" stroke={C.yellow} strokeDasharray="3 3" />
            <text x="700" y="105" fontSize="11" fill={C.yellow} textAnchor="end">
              70% imbalance alert
            </text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              {
                op: "INSERT / UPDATE",
                text: "Sign(x) on a zero-centered model needs no calibration; per-dim mean threshold updated incrementally if not centered",
              },
              {
                op: "DELETE",
                text: "Tombstone bit; compaction job rewrites the bit table and re-counts balances",
              },
              {
                op: "DRIFT",
                text: "Any dim with > 70% same value -> re-binarize that dim or alert",
              },
            ].map((row) => (
              <div
                key={row.op}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.green} bold size={14} style={{ minWidth: 130 }}>
                  {row.op}
                </T>
                <T color={C.bright} size={14}>
                  {row.text}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {[
              { name: "Cohere Embed v3", line: "Sign-based binary, no calibration" },
              { name: "Mixedbread mxbai-embed-large-v1", line: "Zero-centered, sign threshold" },
              { name: "OpenAI text-embedding-3", line: "Client-side sign() on float output" },
              {
                name: "Milvus / Qdrant",
                line: "Custom per-dim threshold + drift monitor + segment compaction",
              },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {s.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace", textAlign: "center" }}>
                  {s.line}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            HNSW + BQ: graph navigates binary codes, float32 reranks
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The previous step showed binary plus a flat linear scan for stage 1. That works at 1B docs, but the linear
            scan still touches every vector. The standard production upgrade is to put an HNSW graph in front of the
            binary codes: stage 1 becomes a logarithmic-hop graph walk over Hamming distance, stage 2 keeps the float32
            rerank. Same two-stage pattern, but stage 1 is now sub-linear.
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
              HNSW over binary codes, then float32 rerank
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
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}18`,
                  borderRadius: 6,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                <T color={C.yellow} bold center size={15}>
                  Stage 1: HNSW over binary
                </T>
                <div style={{ marginTop: 6 }}>
                  N = 1B docs, 128 B each
                  <br />
                  Graph edges + Hamming distance
                  <br />
                  ef_search = 200, return top 200
                </div>
              </div>
              <div style={{ fontSize: 26, color: C.purple }}>&rarr;</div>
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
                  Stage 2: float32 rerank
                </T>
                <div style={{ marginTop: 6 }}>
                  200 candidates
                  <br />
                  Full float32 dot products
                  <br />
                  Return final top 10
                </div>
              </div>
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
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                What changes vs flat + BQ
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Stage 1: O(log N) hops, not O(N) scan</div>
                <div>&bull; Rerank pool: 200 (vs 100) - graph misses</div>
                <div>&bull; Need rerank pool 2x bigger to recover recall</div>
                <div>&bull; Full vectors stored separately for rerank</div>
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
              <T color={C.orange} bold center size={16}>
                Memory cost
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Binary codes: 128 B per doc</div>
                <div>&bull; HNSW edges: ~150 B per doc (M = 16)</div>
                <div>&bull; Float32 rerank shards: 4 KB on cold tier</div>
                <div>&bull; Hot RAM: ~280 B per doc total</div>
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
            Qdrant: <span style={{ color: C.cyan }}>HNSW + binary quantization + rescore</span> as one config block
            <br />
            Weaviate: <span style={{ color: C.cyan }}>HNSW + BQ + rerank flag</span>
            <br />
            FAISS: <span style={{ color: C.cyan }}>IndexBinaryHNSW</span> + manual float rerank pass
            <br />
            Recall after rerank: back to ~98-99% of the float32 baseline
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Why no dedicated combo chapter? The mechanism is the same two-stage pattern from the previous step. Only
            stage 1 swaps a linear scan for an HNSW walk. PQ has its own combo chapters because its asymmetric lookup
            table changes how distance is computed inside the graph. BQ does not.
          </T>
        </Box>
      </Reveal>
      {sub < 8 && (
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
