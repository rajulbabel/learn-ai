import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 11 Act 3: Compression (chapters 11.12-11.19).
// Continues the cat-corpus running thread established in 11.1-11.11.
// Canonical scale dim d = 768 (float32 = 4 bytes/dim baseline, 3 KB/vector).
// SVG marker/gradient ids follow the pattern: `<type><chapter>-<svg-index>`.

export const MemoryWall = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            A single embedding is 3 KB at d = 768
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Every document in the corpus becomes a dense vector. SBERT, OpenAI text-embedding-3-small, and most
            production encoders produce 768-dimensional float32 vectors. Each dimension is a 32-bit float - 4 bytes on
            disk and in RAM. Multiply it out: one single &quot;Cats are small domesticated carnivores&quot; vector costs
            3,072 bytes. That is 3 KB for a single sentence.
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
              doc 1: &quot;Cats are small domesticated carnivores&quot; (first 8 of 768 dims shown)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              {[0.81, 0.12, 0.45, 0.22, 0.63, 0.07, 0.38, 0.91].map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 4px",
                    background: `${C.red}10`,
                    border: `1px solid ${C.red}20`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              ... 760 more dimensions, each a 4-byte float32 value ...
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
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            bytes per vector = d &middot; sizeof(float32)
            <br />
            = 768 &middot; 4 bytes
            <br />= <span style={{ color: C.red }}>3,072 bytes = 3 KB</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            3 KB looks small until you realize this is the cost of every single document you plan to search. Now
            multiply by a billion.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            From 3 GB to 3 TB as N grows
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            The 3 KB per vector is a constant. Scale is what turns it into a problem. A startup indexing its help-center
            docs at N = 1M is already burning 3 GB of pure float32 before a single index, graph, or copy is added. A
            mid-size SaaS with N = 100M product listings needs 300 GB of RAM per replica. Google-scale search at N = 1B
            hits 3 TB. These are the raw vector numbers - nothing else.
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 14,
              }}
            >
              <div
                style={{
                  padding: "8px 10px",
                  background: `${C.orange}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: C.orange,
                }}
              >
                N (corpus size)
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  background: `${C.orange}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: C.orange,
                }}
              >
                N &middot; 3 KB
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  background: `${C.orange}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: C.orange,
                }}
              >
                what that means
              </div>
              {[
                { n: "10 (cat corpus)", bytes: "30 KB", note: "fits in L1 cache" },
                { n: "1,000,000 (1M)", bytes: "3 GB", note: "fits on a laptop" },
                { n: "100,000,000 (100M)", bytes: "300 GB", note: "needs a real server" },
                { n: "1,000,000,000 (1 billion)", bytes: "3 TB", note: "needs multi-node sharding" },
              ].map((row, i) => (
                <div key={`${i}-n`} style={{ display: "contents" }}>
                  <div style={{ padding: "8px 10px", textAlign: "center", color: C.bright }}>{row.n}</div>
                  <div
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      color: i >= 2 ? C.red : C.bright,
                      fontWeight: i >= 2 ? "bold" : "normal",
                    }}
                  >
                    {row.bytes}
                  </div>
                  <div style={{ padding: "8px 10px", textAlign: "center", color: C.dim }}>{row.note}</div>
                </div>
              ))}
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The 1 billion line is where production web search, e-commerce catalogs, and internal knowledge bases tend to
            land. 3 TB of raw vectors alone - before the search index.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Add the HNSW graph: another 100 bytes per vector
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The raw vectors are only half the story. An HNSW graph keeps M = 16 edges per node at layer 0 plus about M
            more total across the higher layers. At 8 bytes per edge (a 64-bit node id), the graph adds roughly 100
            bytes of overhead per vector, or about 3% on top of 3 KB. Small per node; meaningful at a billion.
          </T>
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
            HNSW overhead per vector &asymp; (M + M/2 + M/4 + ...) &middot; 8 bytes
            <br />
            &asymp; 2M &middot; 8 bytes = 32M bytes &asymp;{" "}
            <span style={{ color: C.yellow }}>100 bytes per vector</span>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 8,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              <div style={{ padding: "6px 8px", color: C.yellow, fontWeight: "bold", textAlign: "center" }}>N</div>
              <div style={{ padding: "6px 8px", color: C.yellow, fontWeight: "bold", textAlign: "center" }}>
                vectors
              </div>
              <div style={{ padding: "6px 8px", color: C.yellow, fontWeight: "bold", textAlign: "center" }}>
                graph overhead
              </div>
              <div style={{ padding: "6px 8px", color: C.yellow, fontWeight: "bold", textAlign: "center" }}>
                total RAM
              </div>
              {[
                { n: "1M", vec: "3 GB", graph: "100 MB", total: "3.1 GB" },
                { n: "100M", vec: "300 GB", graph: "10 GB", total: "310 GB" },
                { n: "1B", vec: "3 TB", graph: "100 GB", total: "3.1 TB" },
              ].map((row, i) => (
                <div key={`${i}-g`} style={{ display: "contents" }}>
                  <div style={{ padding: "6px 8px", color: C.bright, textAlign: "center" }}>{row.n}</div>
                  <div style={{ padding: "6px 8px", color: C.bright, textAlign: "center" }}>{row.vec}</div>
                  <div style={{ padding: "6px 8px", color: C.bright, textAlign: "center" }}>{row.graph}</div>
                  <div style={{ padding: "6px 8px", color: C.red, fontWeight: "bold", textAlign: "center" }}>
                    {row.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The graph overhead is small but real. Everything so far assumes you have not yet added a single byte of
            metadata, filter index, or replica copy.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Does the math still work on one server?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            AWS&apos;s largest memory-optimized instance for vector workloads is the r7i.24xlarge: 768 GB of DDR5 RAM
            for around $5,000 per month on-demand. That single box can hold a 100M vector index comfortably. It cannot
            hold 1 billion. At that point you need sharding across 4-8 machines, which doubles or triples the cost and
            adds a query-fan-out latency on top.
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
              <T color={C.green} bold center size={16}>
                One server fits
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                r7i.24xlarge: 768 GB RAM
                <br />
                100M vectors: 310 GB
                <br />
                <span style={{ color: C.green }}>headroom: 458 GB for cache + copies</span>
                <br />
                cost: ~$5,000 / month
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
              <T color={C.red} bold center size={16}>
                One server cannot fit
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                r7i.24xlarge: 768 GB RAM
                <br />
                1B vectors: 3.1 TB
                <br />
                <span style={{ color: C.red }}>needs 4+ shards</span>
                <br />
                cost: ~$20,000+ / month
              </div>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The economics get ugly fast. At 1B scale, raw vectors drive 80% of the bill. Shrinking them is the single
            biggest cost lever.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Four ways to shrink a vector
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Production systems use four main techniques. Each targets a different point on the accuracy-compression
            curve. They stack: a real system often uses scalar quantization plus PQ, or binary plus Matryoshka
            truncation. The framework for picking is the recall cost versus the memory win.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              {
                name: "Scalar quantization",
                color: C.cyan,
                compress: "4x",
                recall: "1-3% drop",
                how: "float32 to int8, one byte per dimension",
              },
              {
                name: "Product quantization (PQ)",
                color: C.purple,
                compress: "32x",
                recall: "3-8% drop",
                how: "split into subvectors, replace each with a 1-byte codebook id",
              },
              {
                name: "Binary quantization",
                color: C.yellow,
                compress: "32x",
                recall: "5-10% drop",
                how: "one bit per dimension, XOR and popcount for distance",
              },
              {
                name: "Matryoshka embeddings",
                color: C.pink,
                compress: "6x",
                recall: "minimal if trained for it",
                how: "truncate the vector dimension itself at query time",
              },
            ].map((card) => (
              <div
                key={card.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}20`,
                }}
              >
                <T color={card.color} bold center size={17}>
                  {card.name}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    columnGap: 10,
                    rowGap: 4,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                  }}
                >
                  <div style={{ color: card.color }}>compress:</div>
                  <div>{card.compress}</div>
                  <div style={{ color: card.color }}>recall:</div>
                  <div>{card.recall}</div>
                </div>
                <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                  {card.how}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Memory budget is almost always the forcing function in production vector search. Every sub-step below is a
            knob for turning that budget down while keeping recall acceptable.
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

export const ScalarQuantization = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // 8-dim illustrative slice of the d=768 canonical vector, standing in for a full real vector.
  const floatVec = [0.81, 0.12, 0.45, 0.22, 0.63, 0.07, 0.38, 0.91];
  // Per-dimension min/max calibrated across the cat corpus.
  const perDimMin = [0.09, 0.1, 0.12, 0.19, 0.11, 0.05, 0.1, 0.62];
  const perDimMax = [0.83, 0.88, 0.74, 0.81, 0.95, 0.72, 0.7, 0.93];
  // Quantize each value into [0, 255] using the linear map q = round((v - min) / (max - min) * 255).
  const int8Vec = floatVec.map((v, i) => {
    const min = perDimMin[i];
    const max = perDimMax[i];
    return Math.round(((v - min) / (max - min)) * 255);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A float32 vector: 4 bytes per dimension
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before compression, every dimension is a 32-bit float. A full 768-dim vector is 3 KB. The insight behind
            scalar quantization is simple: most embedding coordinates sit in a narrow range like [0.05, 0.95]. Spending
            a full float32 on that is wasteful - an 8-bit integer can carry enough precision for search.
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
              doc 1: first 8 dims of the float32 vector
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {floatVec.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 4px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              each cell = 4 bytes (float32) &middot; total for this row = 32 bytes
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
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            1 dim = 4 bytes (float32)
            <br />
            768 dims &middot; 4 bytes = <span style={{ color: C.cyan }}>3,072 bytes</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The question is what we lose if we replace each 4-byte float with a single byte.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Scan the dataset for per-dimension min and max
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The calibration pass is a one-time cost at index build. Walk the entire corpus, and for each of the 768
            dimensions find the smallest and largest value seen. That range is what an 8-bit integer will cover for that
            dimension. Different dimensions have different ranges - dim 0 might live in [0.09, 0.83], dim 5 in [0.05,
            0.72] - so one global range would waste precision. Per-dimension calibration is the norm.
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
              Calibration table (first 8 dims of the cat corpus)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>dim</div>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div key={`dh-${d}`} style={{ color: C.yellow, padding: "4px 6px", textAlign: "center" }}>
                  {d}
                </div>
              ))}
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>min</div>
              {perDimMin.map((v, i) => (
                <div
                  key={`min-${i}`}
                  style={{
                    color: C.bright,
                    padding: "4px 6px",
                    background: `${C.yellow}08`,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>max</div>
              {perDimMax.map((v, i) => (
                <div
                  key={`max-${i}`}
                  style={{
                    color: C.bright,
                    padding: "4px 6px",
                    background: `${C.yellow}08`,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One scan, one pair of numbers per dimension. Tiny metadata cost; foundational for every subsequent
            quantize/dequantize operation.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Linear map: [min, max] to [0, 255]
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Each dimension&apos;s float range is stretched linearly onto the integer range 0 to 255. An 8-bit unsigned
            integer gives 256 discrete buckets; the linear scale makes the smallest value land at 0, the largest at 255,
            and everything else interpolated in between. The bucket size for dimension i is (max_i - min_i) / 255.
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
            <span style={{ color: C.green }}>quantize</span>(v, min, max) = round((v - min) / (max - min) &middot; 255)
            <br />
            <span style={{ color: C.green }}>dequantize</span>(q, min, max) = min + (q / 255) &middot; (max - min)
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
              Worked example on dim 0
            </T>
            <div
              style={{
                marginTop: 8,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              v = 0.81, min = 0.09, max = 0.83
              <br />
              q = round((0.81 - 0.09) / (0.83 - 0.09) &middot; 255)
              <br />= round(0.9730 &middot; 255) = round(248.1) ={" "}
              <span style={{ color: C.green, fontWeight: "bold" }}>248</span>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Round-to-nearest is the most common; some implementations use floor or stochastic rounding. 248 out of 255
            buckets = we lose about 0.2% of the representable precision of this dim.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Before and after: the same vector, quantized
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Apply the linear map to every dimension of the cat vector. The float32 array becomes an int8 byte array of
            the same length. From 32 bytes down to 8 for our 8-dim slice - or from 3,072 down to 768 for the full
            dimension 768 vector.
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
              Before: float32 (4 bytes per cell)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {floatVec.map((v, i) => (
                <div
                  key={`bf-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              total: 8 &middot; 4 = 32 bytes
            </T>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 22, color: C.orange }}>&darr;</div>
            <T color={C.orange} bold center size={16} style={{ marginTop: 4 }}>
              After: int8 (1 byte per cell)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {int8Vec.map((q, i) => (
                <div
                  key={`af-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.orange}14`,
                    border: `1px solid ${C.orange}28`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {q}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              total: 8 &middot; 1 = 8 bytes (4x smaller)
            </T>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            At d = 768, the row above becomes 768 bytes instead of 3,072. Same semantic content; a quarter of the
            footprint.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            int8 distances are SIMD-friendly and often faster
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Modern CPUs have dedicated int8 dot-product instructions. On AVX-512, VPDPBUSD processes 64 int8 multiplies
            and accumulates in one op. Equivalent float32 code with AVX-512 F processes 16 floats per op. Net result:
            int8 distance is 3-4x faster than float32 per vector, on top of the 4x memory win.
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}18`,
                  borderRadius: 6,
                }}
              >
                <T color={C.cyan} bold center size={16}>
                  float32 path
                </T>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  AVX-512 F: vfmadd132ps
                  <br />
                  16 floats per op
                  <br />
                  &asymp; 48 ops per 768-dim pair
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.purple}08`,
                  border: `1px solid ${C.purple}18`,
                  borderRadius: 6,
                }}
              >
                <T color={C.purple} bold center size={16}>
                  int8 path
                </T>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  AVX-512 VNNI: VPDPBUSD
                  <br />
                  64 int8 per op
                  <br />
                  &asymp; 12 ops per 768-dim pair
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
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            int8 SIMD speedup: <span style={{ color: C.purple }}>~3-4x faster</span>
            <br />
            stacked on 4x memory win = same hardware can serve 3-4x more QPS
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            FAISS, Qdrant, pgvector, and Milvus all use int8 SIMD kernels when the index is scalar-quantized. This is
            one of the reasons scalar quantization is the first compression step everyone reaches for.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            4x memory win for a 1-3% recall loss
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The tradeoff is lopsided: memory shrinks by a hard 4x, the graph index speeds up because distances are
            cheaper, and recall degrades by about 1-3% on typical embedding benchmarks. That is essentially free across
            every production workload, which is why virtually every vector DB turns it on by default or offers it as a
            one-line toggle.
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
            d = 768 vector
            <br />
            before: <span style={{ color: C.cyan }}>3,072 bytes</span> (float32)
            <br />
            after: <span style={{ color: C.red }}>768 bytes</span> (int8) &middot; bytes per vector = d
            <br />
            <span style={{ color: C.green }}>compression: 4x</span> &middot;{" "}
            <span style={{ color: C.yellow }}>recall loss: 1-3%</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                What you get
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                4x less RAM. 3-4x faster distance. Simple to implement, one bound-range per dim.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={16}>
                What you pay
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                1-3% recall loss on BERT-style embeddings. Requires a calibration pass at build time.
              </T>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scalar quantization is the easy win: tiny recall cost, simple to implement, hardware-native speed. It is
            almost always the first compression step a production system turns on.
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

export const ProductQuantization = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // 8-dim illustrative slice split into m=2 subvectors of dim 4.
  const pqFloatVec = [0.81, 0.12, 0.45, 0.22, 0.63, 0.07, 0.38, 0.91];
  const subvec0 = pqFloatVec.slice(0, 4);
  const subvec1 = pqFloatVec.slice(4, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cut one fat vector into 96 small ones
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
              One 768-dim vector, banded into 96 slots
            </T>
            <svg
              viewBox="0 0 720 280"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                A 768-dim vector drawn as a long horizontal bar split into 96 colored segments (slots), with three
                stacked document rows below sharing the same slot boundaries to show that slot 0 covers the same dim
                range across every document.
              </desc>
              {/* Top vector with slot bands. 96 cells across the bar from x=20 to x=700. */}
              {Array.from({ length: 96 }).map((_, i) => {
                const cellW = 680 / 96;
                const x = 20 + i * cellW;
                let fill = `${C.cyan}22`;
                if (i < 4) fill = C.cyan;
                else if (i === 95) fill = `${C.cyan}cc`;
                return <rect key={i} x={x} y="40" width={cellW - 0.5} height="36" fill={fill} />;
              })}
              <text x="360" y="28" textAnchor="middle" fill={C.cyan} fontSize="13" fontWeight="bold">
                vector v &middot; 768 dims
              </text>
              {/* Slot labels for the first 4 + last */}
              <text x={20 + (680 / 96) * 0.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 0
              </text>
              <text x={20 + (680 / 96) * 1.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 1
              </text>
              <text x={20 + (680 / 96) * 2.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 2
              </text>
              <text x={20 + (680 / 96) * 3.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 3
              </text>
              <text x="360" y="92" textAnchor="middle" fill={C.dim} fontSize="11">
                . . .
              </text>
              <text x={20 + 680 - (680 / 96) * 0.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 95
              </text>
              {/* Annotation pointing to slot 0 with "8 dims (dims 0-7)" */}
              <line
                x1={20 + (680 / 96) * 0.5}
                y1="105"
                x2={20 + (680 / 96) * 0.5}
                y2="125"
                stroke={C.cyan}
                strokeWidth="1"
              />
              <text x={20 + (680 / 96) * 0.5 + 70} y="120" textAnchor="middle" fill={C.cyan} fontSize="11">
                8 dims (dims 0-7)
              </text>
              {/* Three document rows stacked */}
              {[0, 1, 2].map((row) => {
                const y = 145 + row * 38;
                const label = `doc ${row + 1}`;
                return (
                  <g key={row}>
                    <text x="10" y={y + 17} textAnchor="start" fill={C.dim} fontSize="11">
                      {label}
                    </text>
                    {Array.from({ length: 96 }).map((_, i) => {
                      const cellW = 620 / 96;
                      const x = 60 + i * cellW;
                      let fill = `${C.cyan}18`;
                      if (i < 4) fill = `${C.cyan}aa`;
                      else if (i === 95) fill = `${C.cyan}66`;
                      return <rect key={i} x={x} y={y} width={cellW - 0.5} height="22" fill={fill} />;
                    })}
                  </g>
                );
              })}
              {/* Bracket on the right covering slot 0 column across all 3 doc rows */}
              <line x1={60 + (620 / 96) * 1} y1="142" x2={60 + (620 / 96) * 1} y2="262" stroke={C.cyan} strokeWidth="1" />
              <text x={60 + (620 / 96) * 1 + 12} y="208" textAnchor="start" fill={C.cyan} fontSize="11">
                slot 0 of every doc
              </text>
            </svg>
          </div>
          <T color="#80deea" style={{ marginTop: 12 }}>
            A 768-dim embedding is too fat to compress as a single thing. PQ&apos;s first move is to chop it into 96
            small pieces, 8 dims each. We call each piece a <strong>slot</strong>.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Why slots matter: every slot gets its own dictionary. Slot 0&apos;s dictionary only has to describe the
            patterns that appear in dims 0-7 across the whole corpus. That is a much easier job than describing all 768
            dims at once.
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
            d = 768 &middot; m = 96 &middot; <span style={{ color: C.cyan }}>d / m = 8 dims per slot</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One vector becomes 96 mini-problems. Each one is small enough to compress hard.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Each slot learns its own 256-word dictionary
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
              Slot 0 sub-vectors clustered by k-means (codebook = 256 centroids)
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              slot 0 is 8-D &middot; drawn here as 2-D for clarity
            </T>
            <svg
              viewBox="0 0 720 360"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 6 }}
            >
              <desc>
                A 2-D scatter projection of slot-0 sub-vectors with 16 highlighted k-means centroid markers labeled c0
                to c255 representing the 256 codebook entries that snap each sub-vector to its nearest prototype.
              </desc>
              {/* Background panel */}
              <rect x="20" y="20" width="460" height="320" fill={`${C.yellow}05`} stroke={`${C.yellow}22`} />
              {/* Random-looking dots representing slot-0 sub-vectors. Use a deterministic set. */}
              {[
                [60, 90], [80, 110], [120, 80], [150, 70], [180, 100], [210, 130], [90, 160], [130, 175], [170, 200],
                [200, 230], [240, 90], [275, 120], [310, 100], [340, 70], [370, 110], [400, 95], [410, 140], [380, 175],
                [350, 200], [310, 230], [255, 215], [225, 260], [185, 280], [140, 250], [110, 230], [70, 250], [60, 290],
                [115, 305], [165, 315], [220, 305], [270, 295], [320, 280], [365, 270], [410, 255], [440, 220], [445, 175],
                [430, 100], [395, 65], [330, 50], [275, 65], [225, 55], [165, 50], [110, 65], [85, 195], [105, 145],
                [195, 165], [235, 145], [285, 175], [330, 165], [375, 200], [305, 130], [255, 100], [195, 95], [145, 110],
                [135, 220], [185, 230], [235, 195], [290, 220], [355, 230], [395, 215], [400, 290], [350, 305], [285, 320],
                [240, 320], [195, 320], [150, 320], [100, 320], [70, 220], [55, 170], [50, 130], [70, 60], [120, 50],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.yellow}88`} />
              ))}
              {/* Centroid markers (16 representing 256). Larger filled circles with id labels. */}
              {[
                { x: 95, y: 95, id: "c0" },
                { x: 175, y: 100, id: "c1" },
                { x: 260, y: 95, id: "c5" },
                { x: 355, y: 80, id: "c17" },
                { x: 415, y: 130, id: "c42" },
                { x: 90, y: 175, id: "c89" },
                { x: 195, y: 200, id: "c97" },
                { x: 290, y: 195, id: "c103" },
                { x: 370, y: 215, id: "c142" },
                { x: 130, y: 260, id: "c170" },
                { x: 230, y: 270, id: "c188" },
                { x: 320, y: 260, id: "c201" },
                { x: 405, y: 280, id: "c220" },
                { x: 60, y: 300, id: "c238" },
                { x: 175, y: 305, id: "c247" },
                { x: 270, y: 310, id: "c255" },
              ].map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="9" fill={C.yellow} stroke="#08080d" strokeWidth="1.5" />
                  <text x={c.x} y={c.y + 22} textAnchor="middle" fill={C.yellow} fontSize="10" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              ))}
              <text x="250" y="14" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                slot 0 sub-vector cloud (corpus-wide)
              </text>
              {/* Side panel */}
              <rect x="510" y="40" width="190" height="280" fill={`${C.yellow}10`} stroke={`${C.yellow}22`} rx="6" />
              <text x="605" y="70" textAnchor="middle" fill={C.yellow} fontSize="13" fontWeight="bold">
                k-means on slot 0
              </text>
              <text x="605" y="100" textAnchor="middle" fill={C.bright} fontSize="11">
                input: billions of 8-D points
              </text>
              <text x="605" y="120" textAnchor="middle" fill={C.bright} fontSize="11">
                output: 256 centroids
              </text>
              <text x="605" y="155" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                = slot 0 codebook
              </text>
              <line x1="540" y1="180" x2="670" y2="180" stroke={`${C.yellow}44`} strokeWidth="1" />
              <text x="605" y="205" textAnchor="middle" fill={C.bright} fontSize="11">
                why exactly 256?
              </text>
              <text x="605" y="225" textAnchor="middle" fill={C.bright} fontSize="11">
                2^8 = 256
              </text>
              <text x="605" y="245" textAnchor="middle" fill={C.bright} fontSize="11">
                fits in a single byte
              </text>
              <text x="605" y="285" textAnchor="middle" fill={C.dim} fontSize="10">
                repeat for slots 1..95
              </text>
              <text x="605" y="305" textAnchor="middle" fill={C.dim} fontSize="10">
                = 96 codebooks total
              </text>
            </svg>
          </div>
          <T color="#ffe082" style={{ marginTop: 12 }}>
            Pick one slot - say slot 0. Look at slot 0&apos;s sub-vector across every document in the corpus. That is
            billions of 8-D points. Run k-means on them with k = 256.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            k-means finds 256 prototype points - call them <strong>centroids</strong> - that summarize this cloud. These
            256 centroids are slot 0&apos;s <strong>codebook</strong>. Every future slot-0 sub-vector will be replaced
            by whichever of these 256 it is closest to.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Why exactly 256? Because 2^8 = 256, and that fits in a single byte. The whole PQ design is built around
            squeezing one slot into one byte.
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
            96 slots &middot; 256 centroids &middot; 8 dims &middot; 4 bytes ={" "}
            <span style={{ color: C.yellow }}>786 KB total codebook</span>
            <br />
            <span style={{ color: C.dim }}>(one-time cost &middot; fits in L2 cache)</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            256 prototypes per slot. 96 codebooks. The whole dictionary is L2-resident.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Encode = snap each slice to its nearest prototype
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
              One sub-vector snaps to one centroid id (1 byte)
            </T>
            <svg
              viewBox="0 0 720 380"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Top half: a small scatter showing one query sub-vector as a green diamond with a thick arrow to its
                nearest centroid c17. Bottom half: a row of four input sub-vector bars snapping into a row of four byte
                boxes labeled with their assigned centroid ids, then a final assembled 96-byte code.
              </desc>
              <defs>
                <marker
                  id="snap-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L5,3 Z" fill={C.green} />
                </marker>
              </defs>
              {/* Top: small scatter */}
              <rect x="20" y="10" width="320" height="170" fill={`${C.green}05`} stroke={`${C.green}22`} />
              <text x="180" y="25" textAnchor="middle" fill={C.green} fontSize="11" fontWeight="bold">
                slot 0 cloud
              </text>
              {/* dim points */}
              {[
                [60, 60], [90, 80], [130, 50], [165, 90], [210, 70], [255, 110], [300, 60], [275, 145], [220, 145],
                [165, 145], [100, 130], [60, 110], [240, 90], [195, 105], [110, 95], [90, 155], [310, 130], [285, 90],
                [180, 60], [240, 160], [125, 110], [70, 145], [305, 100],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2" fill={`${C.yellow}66`} />
              ))}
              {/* centroids */}
              {[
                { x: 95, y: 70, id: "c5" },
                { x: 230, y: 90, id: "c17" },
                { x: 290, y: 140, id: "c89" },
                { x: 110, y: 145, id: "c142" },
              ].map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="7" fill={C.yellow} stroke="#08080d" strokeWidth="1" />
                  <text x={c.x} y={c.y + 18} textAnchor="middle" fill={C.yellow} fontSize="9" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              ))}
              {/* query sub-vector as green diamond */}
              <polygon points="200,80 215,95 200,110 185,95" fill={C.green} stroke="#08080d" strokeWidth="1" />
              <text x="170" y="78" textAnchor="end" fill={C.green} fontSize="10" fontWeight="bold">
                q sub
              </text>
              {/* arrow to nearest centroid (c17) */}
              <line x1="208" y1="90" x2="225" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
              <text x="225" y="78" textAnchor="middle" fill={C.green} fontSize="10">
                snap
              </text>
              {/* annotation: distances drawn dimly to other centroids */}
              <line x1="200" y1="95" x2="95" y2="70" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="95" x2="290" y2="140" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="95" x2="110" y2="145" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <text x="180" y="170" textAnchor="middle" fill={C.dim} fontSize="10">
                closest of all 256 centroids = c17
              </text>
              {/* Right side: arrow + result */}
              <line x1="345" y1="90" x2="395" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
              <rect x="400" y="68" width="80" height="46" fill={`${C.green}22`} stroke={C.green} strokeWidth="1.5" rx="4" />
              <text x="440" y="85" textAnchor="middle" fill={C.bright} fontSize="11">
                store
              </text>
              <text x="440" y="102" textAnchor="middle" fill={C.green} fontSize="14" fontWeight="bold">
                id 17
              </text>
              <text x="440" y="128" textAnchor="middle" fill={C.dim} fontSize="10">
                1 byte
              </text>
              {/* Bottom: row of 4 sub-vectors snapping to 4 bytes */}
              <text x="20" y="215" textAnchor="start" fill={C.green} fontSize="12" fontWeight="bold">
                doc 1: 4 of 96 slots
              </text>
              {[
                { slot: 0, vals: [0.81, 0.12, 0.45, 0.22], id: 17 },
                { slot: 1, vals: [0.63, 0.07, 0.38, 0.91], id: 203 },
                { slot: 2, vals: [0.44, 0.28, 0.56, 0.19], id: 89 },
                { slot: 3, vals: [0.72, 0.34, 0.15, 0.48], id: 142 },
              ].map((row, ri) => {
                const y = 240 + ri * 32;
                return (
                  <g key={ri}>
                    <text x="60" y={y + 14} textAnchor="end" fill={C.dim} fontSize="11">
                      slot {row.slot}
                    </text>
                    {/* sub-vector visualized as 4 small cells */}
                    {row.vals.map((v, ci) => (
                      <g key={ci}>
                        <rect
                          x={75 + ci * 28}
                          y={y}
                          width="26"
                          height="22"
                          fill={`${C.green}${Math.floor(v * 99)
                            .toString(16)
                            .padStart(2, "0")}`}
                          stroke={`${C.green}55`}
                        />
                        <text
                          x={75 + ci * 28 + 13}
                          y={y + 14}
                          textAnchor="middle"
                          fill={C.bright}
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {v.toFixed(2)}
                        </text>
                      </g>
                    ))}
                    {/* arrow */}
                    <line
                      x1="195"
                      y1={y + 11}
                      x2="240"
                      y2={y + 11}
                      stroke={C.green}
                      strokeWidth="1.5"
                      markerEnd="url(#snap-arrow)"
                    />
                    <text x="218" y={y + 7} textAnchor="middle" fill={C.dim} fontSize="9">
                      snap
                    </text>
                    {/* byte box */}
                    <rect
                      x="245"
                      y={y - 1}
                      width="60"
                      height="24"
                      fill={`${C.green}22`}
                      stroke={C.green}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    <text
                      x="275"
                      y={y + 16}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      id {row.id}
                    </text>
                  </g>
                );
              })}
              <text x="345" y="280" textAnchor="start" fill={C.dim} fontSize="11">
                ... 92 more slots ...
              </text>
              {/* Assembled byte string */}
              <rect x="20" y="330" width="680" height="40" fill={`${C.green}10`} stroke={C.green} strokeWidth="1.5" rx="4" />
              <text x="360" y="355" textAnchor="middle" fill={C.bright} fontSize="14" fontFamily="monospace">
                doc 1 PQ code = [17, 203, 89, 142, 88, 17, 250, 61, ..., 71]
                <tspan fill={C.green} fontWeight="bold">
                  {"   "}96 bytes
                </tspan>
              </text>
            </svg>
          </div>
          <T color="#80e8a5" style={{ marginTop: 12 }}>
            Now we have all 96 codebooks. Encoding a new document vector is just lookup.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            For each of its 96 slots, find the closest centroid in that slot&apos;s codebook. Write down that
            centroid&apos;s index - a number 0 to 255. That index fits in one byte.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Repeat 96 times. The whole 768-dim vector is now 96 bytes. The original floats are thrown away. The index
            stores only the byte codes.
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
            doc 1 code = [17, 203, 89, 142, ..., 71]
            <br />
            <span style={{ color: C.green }}>96 centroid ids &middot; 1 byte each = 96 bytes total</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A vector becomes 96 byte-pointers into 96 tiny codebooks.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            96 bytes instead of 3,072: 32x compression
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            The full vector replaced by a 96-byte code is the headline number for product quantization. That is 32x
            smaller than the float32 original. A corpus of 1 billion 768-dim vectors drops from 3 TB down to 96 GB - it
            now fits on a single reasonably-specced server, with room for the graph index and a cache.
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
            float32: 768 &middot; 4 = <span style={{ color: C.cyan }}>3,072 bytes</span>
            <br />
            PQ (m=96): 96 &middot; 1 = <span style={{ color: C.orange }}>96 bytes</span>
            <br />
            <span style={{ color: C.green, fontWeight: "bold" }}>compression ratio = 32x</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { n: "1M", float: "3 GB", pq: "96 MB" },
              { n: "100M", float: "300 GB", pq: "9.6 GB" },
              { n: "1B", float: "3 TB", pq: "96 GB" },
            ].map((row) => (
              <div
                key={row.n}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold size={16}>
                  N = {row.n}
                </T>
                <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 14, color: C.dim, lineHeight: 1.7 }}>
                  float32: {row.float}
                  <br />
                  <span style={{ color: C.green, fontWeight: "bold" }}>PQ: {row.pq}</span>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A billion vectors in 96 GB is what made vector databases economically viable at web scale.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Asymmetric distance: keep query float, look up doc codes
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Storing docs as codes is half the story. Distance computation has to work too. The trick is asymmetric: the
            query stays in its full float32 form, and only the documents are encoded. For each query, precompute one
            small table per slot that gives the squared distance from the query&apos;s subvector to every centroid.
            Then, looking up a document&apos;s distance is m table lookups summed together - no multiplies, just adds.
          </T>
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
            <span style={{ color: C.red }}>once per query (precompute step):</span>
            <br />
            for slot s in 0..96: for c in 0..256: table[s][c] = || q_s - centroid_s_c ||&sup2;
            <br />
            <span style={{ color: C.red }}>per document d (search-time cost):</span>
            <br />
            dist(q, d) = &Sigma;&nbsp;table[s][d.code[s]] for s in 0..96
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
              Precomputed lookup table (96 slots &times; 256 centroids)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: 12,
                rowGap: 6,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, textAlign: "right" }}>size:</div>
              <div>96 &middot; 256 = 24,576 entries &middot; 4 bytes &asymp; 96 KB (fits L2 cache)</div>
              <div style={{ color: C.red, textAlign: "right" }}>cost per doc:</div>
              <div>96 cache-resident lookups + 96 adds (no multiplies)</div>
              <div style={{ color: C.red, textAlign: "right" }}>vs float32:</div>
              <div>768 multiplies + 768 adds per doc (about 10x slower)</div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A 10x speedup stacked on a 32x memory win is why PQ dominated large-scale vector search for a decade before
            graph indexes arrived.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            OPQ: rotate the data first so PQ works better
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            PQ treats each slot as independent, but real embedding dimensions are correlated - what happens at dim 0 is
            linked to what happens at dim 200. Correlated dimensions spread data across slots in an awkward way, leaving
            the per-slot k-means with loose clusters and bad approximations. Optimized Product Quantization (OPQ) solves
            this with a learned orthonormal rotation matrix R applied before the split. The rotation decorrelates the
            dimensions so each slot sees tighter clusters, and the per-slot codebooks fit the data better.
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
              PQ pipeline with and without OPQ
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}18`,
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 2,
                }}
              >
                <T color={C.red} bold center size={15}>
                  plain PQ
                </T>
                <div style={{ marginTop: 8 }}>
                  v &rarr; split &rarr; encode
                  <br />
                  correlated dims hurt k-means
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}18`,
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 2,
                }}
              >
                <T color={C.green} bold center size={15}>
                  OPQ + PQ
                </T>
                <div style={{ marginTop: 8 }}>
                  v &rarr; <span style={{ color: C.purple }}>Rv (rotate)</span> &rarr; split &rarr; encode
                  <br />
                  decorrelated dims &rarr; tighter clusters
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
            recall@10 at m = 96 (typical)
            <br />
            plain PQ: <span style={{ color: C.red }}>0.89</span> &middot; OPQ + PQ:{" "}
            <span style={{ color: C.green }}>0.94</span>
            <br />
            <span style={{ color: C.dim }}>
              R is a 768 &times; 768 orthonormal matrix learned alongside the codebooks
            </span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            FAISS, ScaNN, and most production PQ implementations use OPQ by default. It is a free recall bump for a
            one-time training cost.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Pick m to hit your target recall
          </T>
          <T color="#f8aee0" style={{ marginTop: 8 }}>
            The only real PQ tuning knob is m (the number of subvectors). Higher m means smaller subvectors, which means
            the per-slot k-means sees simpler data and the approximation is tighter. Higher m also means more bytes per
            encoded vector - the compression ratio drops. The typical production sweep:
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {["m", "bytes/vec", "compression", "recall@10 (OPQ)", "typical use"].map((h, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    padding: "8px 6px",
                    background: `${C.pink}14`,
                    color: C.pink,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 4,
                  }}
                >
                  {h}
                </div>
              ))}
              {[
                { m: "8", bytes: "8", ratio: "384x", recall: "0.81", use: "extreme scale" },
                { m: "48", bytes: "48", ratio: "64x", recall: "0.91", use: "web-scale search" },
                { m: "96", bytes: "96", ratio: "32x", recall: "0.96", use: "the production sweet spot" },
                { m: "192", bytes: "192", ratio: "16x", recall: "0.98", use: "recall-sensitive workloads" },
              ].map((row, i) => (
                <div key={`r-${i}`} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      color: C.bright,
                      background: i === 2 ? `${C.pink}08` : "transparent",
                      fontWeight: i === 2 ? "bold" : "normal",
                    }}
                  >
                    {row.m}
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      color: C.bright,
                      background: i === 2 ? `${C.pink}08` : "transparent",
                    }}
                  >
                    {row.bytes}
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      color: C.bright,
                      background: i === 2 ? `${C.pink}08` : "transparent",
                    }}
                  >
                    {row.ratio}
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      color: C.bright,
                      background: i === 2 ? `${C.pink}08` : "transparent",
                      fontWeight: i === 2 ? "bold" : "normal",
                    }}
                  >
                    {row.recall}
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      color: C.dim,
                      background: i === 2 ? `${C.pink}08` : "transparent",
                    }}
                  >
                    {row.use}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <T color="#f8aee0" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            m = 96 (32x compression, 0.96 recall) is the canonical production setting. It is what FAISS ships with and
            what Qdrant&apos;s PQ mode defaults to.
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
};

export const BinaryQuantization = (ctx) => {
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
              float32 vector at d = 1024 (first 16 dims shown)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 12,
              }}
            >
              {bqFloatVec.slice(0, 8).map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 4px",
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
            at N = 1B: <span style={{ color: C.red }}>4 TB of raw vectors</span>
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
              <div style={{ color: C.yellow, textAlign: "right" }}>float32:</div>
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
            bit_i = 1 if v_i &ge; 0 else 0
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
              <div style={{ color: C.green, textAlign: "right" }}>doc A:</div>
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
              <div style={{ color: C.green, textAlign: "right" }}>doc B:</div>
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
              recall@10 vs embedding dimension (BERT-style models)
            </T>
            <svg viewBox="0 0 500 220" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}>
              <desc>
                Curve showing binary quantization recall rising sharply with embedding dimension. Nearly 0 at d=64,
                rising past 0.9 around d=512, plateauing around 0.96 at d=1024 and higher.
              </desc>
              <line x1="60" y1="180" x2="480" y2="180" stroke={C.dim} strokeWidth="1" />
              <line x1="60" y1="30" x2="60" y2="180" stroke={C.dim} strokeWidth="1" />
              <text x="270" y="205" textAnchor="middle" fill={C.dim} fontSize="12">
                embedding dimension d
              </text>
              <text x="30" y="105" textAnchor="middle" fill={C.dim} fontSize="12" transform="rotate(-90 30 105)">
                recall@10
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
                dimension
              </div>
              <div style={{ padding: "8px 10px", color: C.red, fontWeight: "bold", textAlign: "center" }}>
                recall@10
              </div>
              <div style={{ padding: "8px 10px", color: C.red, fontWeight: "bold", textAlign: "center" }}>status</div>
              {[
                { d: "64", recall: "0.18", ok: false, note: "near-random" },
                { d: "128", recall: "0.60", ok: false, note: "unusable" },
                { d: "256", recall: "0.82", ok: false, note: "borderline" },
                { d: "512", recall: "0.93", ok: true, note: "OK with rerank" },
                { d: "768", recall: "0.95", ok: true, note: "production OK" },
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
                <T color={C.yellow} bold size={15}>
                  stage 1: binary index
                </T>
                <div style={{ marginTop: 6 }}>
                  N = 1B docs
                  <br />
                  scan with XOR + popcount
                  <br />
                  return top 100 candidates
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
                <T color={C.green} bold size={15}>
                  stage 2: float32 rerank
                </T>
                <div style={{ marginTop: 6 }}>
                  100 candidates
                  <br />
                  full float32 dot products
                  <br />
                  return final top 10
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
            recall recovery after rerank: back to ~99% of the float32 baseline
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Binary is the right compression when memory is the bottleneck AND you have room for a short rerank pass.
            Those two together are a common production setup.
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

export const Matryoshka = (ctx) => {
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
                { metric: "OpenAI API cost", value: "~$30,000", note: "at $0.13 per 1M tokens, ~2B tokens" },
                { metric: "wall-clock time", value: "~3-5 days", note: "even with high concurrency + batching" },
                { metric: "source-text requirement", value: "must retain", note: "many pipelines drop it" },
                { metric: "index rebuild", value: "on top of that", note: "extra days of HNSW re-construction" },
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
            <svg viewBox="0 0 600 140" style={{ width: "100%", maxWidth: 620, height: "auto", display: "block" }}>
              <desc>
                Long horizontal vector bar divided into colored prefix regions at 256, 512, 1024, and 3072 dimensions;
                each prefix is labeled as a valid truncation.
              </desc>
              <rect x="20" y="50" width="80" height="40" fill={C.red} stroke="#08080d" strokeWidth="1" />
              <rect x="100" y="50" width="80" height="40" fill={C.orange} stroke="#08080d" strokeWidth="1" />
              <rect x="180" y="50" width="160" height="40" fill={C.yellow} stroke="#08080d" strokeWidth="1" />
              <rect x="340" y="50" width="240" height="40" fill={C.green} stroke="#08080d" strokeWidth="1" />
              <text x="60" y="75" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                256
              </text>
              <text x="140" y="75" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                512
              </text>
              <text x="260" y="75" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                1024
              </text>
              <text x="460" y="75" textAnchor="middle" fill="#08080d" fontSize="13" fontWeight="bold">
                3072 (full)
              </text>
              <line x1="20" y1="40" x2="100" y2="40" stroke={C.red} strokeWidth="1" />
              <text x="60" y="32" textAnchor="middle" fill={C.red} fontSize="11">
                first 256
              </text>
              <line x1="20" y1="110" x2="180" y2="110" stroke={C.orange} strokeWidth="1" />
              <text x="100" y="122" textAnchor="middle" fill={C.orange} fontSize="11">
                first 512
              </text>
              <line x1="20" y1="25" x2="340" y2="25" stroke={C.yellow} strokeWidth="1" />
              <text x="180" y="17" textAnchor="middle" fill={C.yellow} fontSize="11">
                first 1024
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
            training loss = &Sigma; over K in {"{"}256, 512, 1024, 2048, 3072{"}"}: L(embed[0..K])
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
                <T color={C.cyan} bold size={15}>
                  full d = 3072
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
                <T color={C.orange} bold size={15}>
                  truncated to 512
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
            recall@10: 0.97 at 3072 &rarr; 0.94 at 512 (about 3% drop)
            <br />
            full 3072-dim kept on cold storage for reranking stage
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
                <T color={C.red} bold size={15}>
                  stage 1: coarse (256-dim)
                </T>
                <div style={{ marginTop: 6 }}>
                  scan 500M docs fast
                  <br />
                  6x smaller index vs truncate=512
                  <br />
                  12x smaller index vs full
                  <br />
                  return top 100
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
                <T color={C.green} bold size={15}>
                  stage 2: fine (3072-dim)
                </T>
                <div style={{ marginTop: 6 }}>
                  rerank 100 candidates
                  <br />
                  full 3072-dim precision
                  <br />
                  cheap: only 100 dot products
                  <br />
                  return final top 10
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
            end-to-end recall: ~0.98 &middot; end-to-end latency: ~5 ms
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
                  trunc: "any K <= 3072",
                  note: "dimensions parameter in API",
                },
                {
                  name: "OpenAI text-embedding-3-small",
                  full: "d = 1536",
                  trunc: "any K <= 1536",
                  note: "cheaper, same technique",
                },
                {
                  name: "Cohere Embed v3 (English)",
                  full: "d = 1024",
                  trunc: "256, 384, 512, 1024",
                  note: "int8 + binary too",
                },
                {
                  name: "Jina Embeddings v3",
                  full: "d = 1024",
                  trunc: "K <= 1024",
                  note: "open weights + Matryoshka",
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
                    full: {model.full}
                    <br />
                    truncation: {model.trunc}
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

// 2D scatter positions for the 10-doc cat corpus, re-declared locally so 11.17 stays
// self-contained (vector-foundations.jsx is a sibling module, not an import here).
// Cluster A (cats): 1, 3, 4, 5, 7 - upper left. Cluster B (dogs): 2, 8 - upper right.
// Cluster C (other): 6, 9, 10 - lower right. Query lands inside cluster A.
const IVFPQ_CORPUS_XY = {
  1: { x: 100, y: 100, cluster: "A", label: "cats domesticated" },
  7: { x: 150, y: 100, cluster: "A", label: "kittens" },
  5: { x: 95, y: 135, cluster: "A", label: "tigers striped" },
  3: { x: 150, y: 140, cluster: "A", label: "lions big cats" },
  4: { x: 125, y: 155, cluster: "A", label: "cat on mat" },
  2: { x: 325, y: 80, cluster: "B", label: "dogs loyal" },
  8: { x: 365, y: 115, cluster: "B", label: "dog chased cat" },
  10: { x: 405, y: 215, cluster: "C", label: "fish underwater" },
  9: { x: 410, y: 265, cluster: "C", label: "birds fly" },
  6: { x: 350, y: 240, cluster: "C", label: "python language" },
};
const IVFPQ_QUERY_XY = { x: 55, y: 55 };
const IVFPQ_CENTROIDS = {
  A: { x: 125, y: 125, color: C.purple, label: "C_A (cats)" },
  B: { x: 345, y: 97, color: C.yellow, label: "C_B (dogs)" },
  C: { x: 390, y: 240, color: C.cyan, label: "C_C (other)" },
};

// 4-dim vectors for the three docs used in the residual table (sub=2).
// The cluster-A centroid is the coordinate-wise average of docs 1, 3, 4, 5, 7 rounded to 2 decimals.
const IVFPQ_CLUSTER_A_ROWS = [
  { id: 1, text: '"Cats are small domesticated carnivores"', v: [0.81, 0.12, 0.45, 0.22] },
  { id: 3, text: '"Lions are big cats that live in Africa"', v: [0.76, 0.18, 0.52, 0.31] },
  { id: 4, text: '"My cat sat on the mat"', v: [0.72, 0.22, 0.48, 0.26] },
];
const IVFPQ_CENTROID_A_VEC = [0.78, 0.15, 0.47, 0.25];

export const IVFPQ = (ctx) => {
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
                <div>&bull; k-means partitions the corpus into nlist cells</div>
                <div>&bull; typical nlist &asymp; sqrt(N): 4,096 at N = 1M</div>
                <div>&bull; at query time, probe the nprobe closest cells</div>
                <div>&bull; nprobe = 8 visits 8 / 4,096 &asymp; 0.2% of the data</div>
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
                cost per query &asymp; nlist + nprobe &middot; (N / nlist)
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
                <div>&bull; split a 768-dim vector into m = 96 subvectors</div>
                <div>&bull; k-means per slot gives 256 centroid codebooks</div>
                <div>&bull; each subvector becomes a 1-byte code id</div>
                <div>&bull; whole vector: 96 bytes (32x smaller than float32)</div>
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
            <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 540, height: "auto", display: "block" }}>
              <desc>
                Scatter of the 10 cat-corpus documents after k-means clustering with nlist = 3: five cat docs form
                cluster A around the purple centroid C_A in the upper left, two dog docs form cluster B around the
                yellow centroid C_B in the upper right, and three other docs form cluster C around the cyan centroid C_C
                in the lower region. The centroids are drawn as colored squares.
              </desc>
              {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => (
                <circle
                  key={`halo-${id}`}
                  cx={c.x}
                  cy={c.y}
                  r={70}
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
                  <text x={c.x} y={c.y - 22} fill={c.color} fontSize={13} fontWeight="bold" textAnchor="middle">
                    {c.label}
                  </text>
                </g>
              ))}
              <text x={250} y={300} fill={C.dim} fontSize={13} textAnchor="middle">
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
              at production scale: N = 1M, nlist = 4,096; N = 100M, nlist = 32,768
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
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "left", padding: "6px 8px" }}>doc</div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                v (original)
              </div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>C_A</div>
              <div style={{ color: C.green, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                residual
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
                    doc {row.id}: {row.text}
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
                <div>&bull; encode v directly with m = 96, 256 codes</div>
                <div>&bull; codebook must cover wide spread: 0 to 1</div>
                <div>&bull; per-slot clusters are loose, error accumulates</div>
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
                recall@10 &asymp; <span style={{ fontSize: 20 }}>0.89</span>
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
                <div>&bull; encode (v &minus; C_cluster) with m = 96, 256 codes</div>
                <div>&bull; codebook only covers the residual ball</div>
                <div>&bull; tighter per-slot k-means, lower error per code</div>
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
                recall@10 &asymp; <span style={{ fontSize: 20 }}>0.94</span>
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
            each stored vector = cluster id (4 bytes) + residual PQ codebook index (96 bytes)
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
              <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 500, height: "auto", display: "block" }}>
                <desc>
                  IVF-PQ search trajectory on the 10-doc cat corpus: the query vector sits inside cluster A, the orange
                  arrow points to the closest centroid C_A, the two nearest cells A (purple) and B (yellow) are
                  highlighted while cluster C (cyan) is dimmed. Inside each highlighted cell every doc is scanned by its
                  PQ code.
                </desc>
                {Object.entries(IVFPQ_CENTROIDS).map(([id, c]) => {
                  const highlighted = id === "A" || id === "B";
                  return (
                    <circle
                      key={`halo-${id}`}
                      cx={c.x}
                      cy={c.y}
                      r={70}
                      fill={highlighted ? `${c.color}18` : `${c.color}06`}
                      stroke={highlighted ? `${c.color}60` : `${c.color}20`}
                      strokeWidth={highlighted ? 2 : 1}
                      strokeDasharray={highlighted ? "0" : "3 3"}
                    />
                  );
                })}
                <line
                  x1={IVFPQ_QUERY_XY.x}
                  y1={IVFPQ_QUERY_XY.y}
                  x2={IVFPQ_CENTROIDS.A.x - 14}
                  y2={IVFPQ_CENTROIDS.A.y - 10}
                  stroke={C.orange}
                  strokeWidth={2}
                  markerEnd="url(#ivfpq-arrow)"
                />
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
                  query
                </text>
                <text x={250} y={300} fill={C.dim} fontSize={12} textAnchor="middle">
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
                step 1: scan <span style={{ color: C.red }}>4,096</span> centroids
                <br />
                step 2: build a <span style={{ color: C.red }}>m &middot; 256 = 24,576</span> entry
                <br />
                asymmetric lookup table once per query
                <br />
                step 3: scan <span style={{ color: C.red }}>nprobe &middot; (N / nlist)</span>
                <br />= 8 &middot; 244 &asymp; <span style={{ color: C.red }}>2,000</span> codes
                <br />
                each code is <span style={{ color: C.red }}>m = 96</span> table lookups + adds
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; brute force over 1M: 1,000,000 distances</div>
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
              cluster id (4 bytes) + residual PQ code (m = 16 &middot; 1 byte)
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
                { label: "float32 baseline", size: "3 TB", color: C.red, note: "d &middot; 4 &middot; N" },
                { label: "raw PQ (m = 96)", size: "96 GB", color: C.yellow, note: "no cluster structure" },
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
                  <T color={row.color} bold size={14}>
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
                { name: "Milvus IVF_PQ", note: "distributed billion-scale" },
                { name: "Weaviate PQ + IVF", note: "toggleable on top of HNSW or flat" },
                { name: "Vespa hnsw + PQ", note: "same residual recipe on a graph" },
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
};

// Graph node positions for the 3-layer HNSW illustration in 11.18 sub=1. Eight bottom
// nodes with space for PQ-code labels, a middle hub layer with 3 nodes, and a single
// top hub. Positions are tuned so the code labels never overlap adjacent nodes.
const HNSWPQ_LAYERS = {
  L0: [
    { id: "a", x: 60, y: 260, code: "[c17,...]" },
    { id: "b", x: 130, y: 260, code: "[c22,...]" },
    { id: "c", x: 200, y: 260, code: "[c41,...]" },
    { id: "d", x: 270, y: 260, code: "[c38,...]" },
    { id: "e", x: 340, y: 260, code: "[c55,...]" },
    { id: "f", x: 410, y: 260, code: "[c62,...]" },
    { id: "g", x: 480, y: 260, code: "[c71,...]" },
    { id: "h", x: 550, y: 260, code: "[c85,...]" },
  ],
  L1: [
    { id: "h1", x: 130, y: 160, code: "[c22, c199, ...]" },
    { id: "h2", x: 300, y: 160, code: "[c38, c175, ...]" },
    { id: "h3", x: 470, y: 160, code: "[c71, c144, ...]" },
  ],
  L2: [{ id: "top", x: 300, y: 60, code: "[c38, c175, ...]" }],
};
const HNSWPQ_EDGES = {
  L0: [
    ["a", "b"],
    ["b", "c"],
    ["c", "d"],
    ["d", "e"],
    ["e", "f"],
    ["f", "g"],
    ["g", "h"],
    ["a", "c"],
    ["c", "e"],
    ["e", "g"],
    ["b", "d"],
    ["d", "f"],
    ["f", "h"],
  ],
  L1: [
    ["h1", "h2"],
    ["h2", "h3"],
  ],
  V: [
    ["L1:h1", "L0:b"],
    ["L1:h2", "L0:d"],
    ["L1:h3", "L0:g"],
    ["L2:top", "L1:h2"],
  ],
};

export const HNSWPQ = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const layerLookup = {
    L0: Object.fromEntries(HNSWPQ_LAYERS.L0.map((n) => [n.id, n])),
    L1: Object.fromEntries(HNSWPQ_LAYERS.L1.map((n) => [n.id, n])),
    L2: Object.fromEntries(HNSWPQ_LAYERS.L2.map((n) => [n.id, n])),
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            HNSW gives fast search; PQ gives small vectors
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            IVF-PQ shines on static billion-scale corpora, but many production systems want graph-navigation speed AND
            compressed vectors. HNSW (chapters 11.7-11.10) gives logarithmic-hop search over a multi-layer small-world
            graph. PQ (chapter 11.14) gives 32x compression per vector. HNSW + PQ keeps the HNSW graph structure
            unchanged and swaps out the float32 payload at each node for a PQ code - small memory, fast graph, one index
            to tune.
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
                HNSW - graph navigation
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; multi-layer small-world graph over all N vectors</div>
                <div>&bull; O(log N) hops from entry point to the beam</div>
                <div>&bull; M = 16 edges per node at layer 0 (default)</div>
                <div>&bull; ef_search = 50 candidates at query time</div>
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
                PQ - byte-coded vectors
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; m = 96 subvectors, 256 centroids per slot</div>
                <div>&bull; each vector encoded as m bytes (96 bytes at m = 96)</div>
                <div>&bull; 32x smaller than the float32 baseline</div>
                <div>&bull; distances via the asymmetric lookup table</div>
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
            HNSW graph structure (edges, layers, M, ef_search) = <span style={{ color: C.yellow }}>unchanged</span>
            <br />
            node payload: float32 vector &rarr; <span style={{ color: C.purple }}>PQ code</span> (96 bytes instead of
            3,072)
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The search algorithm is byte-for-byte the same - enter at the top hub, greedy-descend, beam-search at layer
            zero. Only the distance function changes: it consults PQ codes instead of float32 vectors.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Every node stores a PQ code instead of a float32 vector
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Picture the 3-layer HNSW graph from chapter 11.7. In HNSW + PQ, every node label changes from a float32
            vector to a 96-byte PQ code. Edges, layer assignments, entry points - all untouched. The memory math shifts
            dramatically: the graph costs stay near 100 bytes per vector (M = 16 edges at layer 0 plus sparse upper
            layers), and the payload drops from 3,072 to 96 bytes. Total per-vector footprint: about 196 bytes.
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
              Three-layer HNSW graph with PQ codes at every node
            </T>
            <svg viewBox="0 0 620 320" style={{ width: "100%", maxWidth: 640, height: "auto", display: "block" }}>
              <desc>
                Three-layer HNSW graph where each node is labeled as a compact PQ code like [c17, c203, c89, ...]
                instead of a float vector. The bottom layer (cyan) holds all eight docs with dense edges, the middle
                layer (yellow) holds three hub nodes with long-range edges, and the top layer (red) has a single global
                entry-point node. Vertical green dashed lines are layer-to-layer links. Illustrates that HNSW + PQ keeps
                the graph structure and replaces only the node payload.
              </desc>
              <rect x={20} y={30} width={580} height={60} fill={`${C.red}08`} stroke={`${C.red}20`} strokeWidth={1} />
              <rect
                x={20}
                y={130}
                width={580}
                height={60}
                fill={`${C.yellow}08`}
                stroke={`${C.yellow}20`}
                strokeWidth={1}
              />
              <rect
                x={20}
                y={230}
                width={580}
                height={60}
                fill={`${C.cyan}08`}
                stroke={`${C.cyan}20`}
                strokeWidth={1}
              />
              <text x={30} y={50} fill={C.red} fontSize={12} fontWeight="bold">
                layer 2 (top hub)
              </text>
              <text x={30} y={150} fill={C.yellow} fontSize={12} fontWeight="bold">
                layer 1 (hubs)
              </text>
              <text x={30} y={250} fill={C.cyan} fontSize={12} fontWeight="bold">
                layer 0 (all docs)
              </text>
              {HNSWPQ_EDGES.V.map(([from, to], i) => {
                const [fL, fId] = from.split(":");
                const [tL, tId] = to.split(":");
                const f = layerLookup[fL][fId];
                const t = layerLookup[tL][tId];
                return (
                  <line
                    key={`v-${i}`}
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={C.green}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    opacity={0.7}
                  />
                );
              })}
              {HNSWPQ_EDGES.L0.map(([a, b], i) => {
                const na = layerLookup.L0[a];
                const nb = layerLookup.L0[b];
                return (
                  <line
                    key={`l0-${i}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={C.cyan}
                    strokeWidth={1}
                    opacity={0.55}
                  />
                );
              })}
              {HNSWPQ_EDGES.L1.map(([a, b], i) => {
                const na = layerLookup.L1[a];
                const nb = layerLookup.L1[b];
                return (
                  <line
                    key={`l1-${i}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={C.yellow}
                    strokeWidth={1.5}
                    opacity={0.7}
                  />
                );
              })}
              {HNSWPQ_LAYERS.L0.map((n) => (
                <g key={`l0-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={9} fill={C.cyan} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={9} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 22} fill={C.cyan} fontSize={8} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
              {HNSWPQ_LAYERS.L1.map((n) => (
                <g key={`l1-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={11} fill={C.yellow} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 26} fill={C.yellow} fontSize={9} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
              {HNSWPQ_LAYERS.L2.map((n) => (
                <g key={`l2-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={13} fill={C.red} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y - 20} fill={C.red} fontSize={10} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
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
              lineHeight: 1.9,
            }}
          >
            per-vector memory = graph edges (&asymp; 100 bytes) + PQ code (96 bytes) ={" "}
            <span style={{ color: C.yellow }}>196 bytes</span>
            <br />
            at N = <span style={{ color: C.yellow }}>100M</span>: 196 &middot; 10^8 bytes ={" "}
            <span style={{ color: C.yellow }}>19.6 GB</span> - fits on a single server
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Compare with float32 HNSW at 100M: 300 GB for vectors + 10 GB for graph = 310 GB, unworkable on one machine.
            HNSW + PQ drops the bill to 19.6 GB without touching the search algorithm.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance = asymmetric PQ lookup
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            HNSW walks the graph exactly as before. At every step it has to score a candidate against the query - that
            distance call is the only piece that changes. Instead of a float32 dot product or L2 over d dimensions, it
            looks up m values in the per-query asymmetric-distance table (built once per query in chapter 11.14) and
            sums them. At d = 768, m = 96 that is 96 table reads + 96 adds per distance, about ten times cheaper than
            the float32 equivalent. Graph hop count is identical, per-hop cost drops.
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
                Float32 distance (baseline)
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
                  lineHeight: 1.9,
                }}
              >
                dot(q, v) = <span style={{ color: C.red }}>Sum</span> q[i] &middot; v[i]
                <br />
                d = 768 multiplies + 768 adds
                <br />
                AVX-512: &asymp; 48 fused-multiply-adds
                <br />
                <span style={{ color: C.red }}>baseline cost per distance</span>
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
                Asymmetric PQ distance
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
                  lineHeight: 1.9,
                }}
              >
                dist(q, code) = <span style={{ color: C.green }}>Sum</span> LUT<sub>slot</sub>[code[slot]]
                <br />
                m = 96 table lookups + 96 adds
                <br />
                table built once per query (m &middot; 256 entries)
                <br />
                <span style={{ color: C.green }}>~10x faster per distance</span>
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
            HNSW hop count &asymp; log<sub>M</sub>(N) &middot; ef_search
            <br />
            per-hop cost: <span style={{ color: C.red }}>float32</span> &rarr;{" "}
            <span style={{ color: C.green }}>~10x cheaper PQ lookup</span>
            <br />
            net: end-to-end query latency drops by a factor near 10x at common settings
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The lookup table holds the query-to-centroid distances for every slot. Once it is built, every doc in the
            graph is just m table reads and m adds away from a full estimated distance.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            PQ adds distance error; bigger ef_search recovers recall
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            PQ distances are approximations. Most of the time the ranking is right, but a small fraction of pairs get
            re-ordered - the error is typically 1 to 4 percent at m = 96, more at smaller m. On a graph, a ranking slip
            means HNSW&apos;s greedy descent occasionally takes a slightly wrong hop. At a fixed ef_search = 50 the
            recall drop is noticeable but modest. Raising ef_search widens the candidate beam at layer zero and most of
            the lost recall comes back.
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
              Recall@10 vs ef_search at M = 16 (typical workload)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.7fr 1fr 1fr 1.4fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>ef_search</div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                HNSW float32
              </div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>HNSW + PQ</div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>note</div>
              {[
                { ef: 50, fp: "0.97", pq: "0.92", note: "baseline, PQ drops 5%" },
                { ef: 100, fp: "0.98", pq: "0.94", note: "raising ef starts helping" },
                { ef: 150, fp: "0.99", pq: "0.96", note: "nearly recovered" },
                { ef: 200, fp: "0.99", pq: "0.97", note: "matches float within 2%" },
              ].flatMap((r) => [
                <div
                  key={`ef-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {r.ef}
                </div>,
                <div
                  key={`fp-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {r.fp}
                </div>,
                <div
                  key={`pq-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.pq}
                </div>,
                <div
                  key={`note-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    color: C.dim,
                    fontSize: 12,
                  }}
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
            recall<sub>HNSW+PQ</sub> &asymp; recall<sub>HNSW</sub> &minus;{" "}
            <span style={{ color: C.red }}>1% to 5%</span> (varies with PQ m)
            <br />
            dial: raise <span style={{ color: C.red }}>ef_search</span> from 50 to 150 to recover most of the gap
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The recall hit is predictable and small; the fix is a one-knob change at query time. Smaller m (more
            aggressive compression) widens the gap - tune m and ef_search together against your recall target.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production deployments of HNSW + PQ
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            HNSW + PQ is now the default answer for 100M - 1B scale production search when filtering, updates, and
            low-latency matter. Every major self-hostable vector database exposes it as a configuration flag on top of a
            vanilla HNSW index - same graph code, same search, a toggle for compression.
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
              Where HNSW + PQ ships today
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
                  name: "Qdrant",
                  config: "quantization_config.product",
                  note: "scalar, product, and binary on top of HNSW",
                },
                {
                  name: "Weaviate",
                  config: "vectorIndexConfig.pq.enabled: true",
                  note: "PQ or BQ layered on HNSW, trainable centroids",
                },
                {
                  name: "Milvus",
                  config: "HNSW_PQ / HNSW_SQ index types",
                  note: "both scalar and product quantization flavors",
                },
                {
                  name: "pgvector",
                  config: "scalar quantization + HNSW",
                  note: "SQ is live today; PQ on the roadmap",
                },
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
                  <T color={C.purple} bold size={15}>
                    {sys.name}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright, lineHeight: 1.5 }}
                  >
                    {sys.config}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {sys.note}
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
            <span style={{ color: C.purple }}>HNSW + PQ is the modern production default</span>
            <br />
            for 100M - 1B scale similarity search
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One graph engine, one compression switch. Start with plain HNSW for quick prototyping, flip on PQ when
            memory bites. The API surface barely changes; the memory footprint drops an order of magnitude.
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

export const CompressionDecision = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Five techniques, which one? Four inputs decide.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The last seven chapters introduced scalar quantization, product quantization, binary quantization,
            Matryoshka truncation, IVF-PQ, and HNSW+PQ. Each one works. None is universally the right pick. The choice
            depends on four inputs - corpus size, embedding dimensionality, the database&apos;s capability surface, and
            how much recall loss the product can absorb.
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
              The four decision axes
            </T>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  axis: "Corpus size (N)",
                  role: "Primary driver",
                  detail: "Under 1M, nothing helps. At 100M+, compression is not optional.",
                },
                {
                  axis: "Embedding dim (d)",
                  role: "Gates binary quantization",
                  detail: "Binary quantization needs d >= 768 to stay production-safe (from 11.15's recall table).",
                },
                {
                  axis: "Database capability",
                  role: "Constrains the menu",
                  detail:
                    "pgvector mainline: halfvec only. Pinecone: abstracted. Qdrant/Weaviate: full suite + rescore.",
                },
                {
                  axis: "Recall tolerance",
                  role: "Override knob",
                  detail: "High-stakes retrieval (medical, legal) downgrades one step from the default.",
                },
              ].map((r) => (
                <div
                  key={r.axis}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}22`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    {r.axis}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {r.role}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                    {r.detail}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The next sub-step folds these four inputs into a single decision tree. The one after walks four real-world
            scenarios through it, numbers and all.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The decision tree: N drives the branch; d and DB gate binary quantization
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            One pre-step is orthogonal and always worth trying: if the embedding model is Matryoshka-trained (OpenAI
            text-embedding-3 series, BGE-M3, some Cohere variants), request a smaller dim at the API call itself -
            truncating 3072 to 1536 or 1024 costs about 1% quality and halves every downstream memory number. Then walk
            the main tree below.
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
              The compression decision flowchart
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <svg viewBox="0 0 640 440" style={{ width: "100%", maxWidth: 640, height: "auto" }}>
                <desc>
                  Compression-technique decision flowchart. Top box shows the four inputs (corpus size N, embedding
                  dimension d, database capability, recall tolerance). An orthogonal pre-step on the left notes that
                  Matryoshka-trained embedding models can be truncated at the API call. The main flow branches on N:
                  under 1M skips quantization; 1M to 10M uses scalar quantization; 10M to 100M uses binary quantization
                  plus rescore when d is at least 768 and the DB supports it, otherwise falls back to scalar; 100M and
                  above uses HNSW plus product quantization as the production default at scale.
                </desc>
                <rect
                  x={180}
                  y={10}
                  width={280}
                  height={50}
                  rx={8}
                  fill={`${C.cyan}22`}
                  stroke={C.cyan}
                  strokeWidth={2}
                />
                <text x={320} y={32} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Inputs: N, d, DB, recall tolerance
                </text>
                <text x={320} y={50} fill={C.bright} fontSize={11} textAnchor="middle">
                  start here
                </text>
                <rect
                  x={10}
                  y={80}
                  width={150}
                  height={48}
                  rx={8}
                  fill={`${C.yellow}18`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <text x={85} y={100} fill={C.yellow} fontSize={12} fontWeight="bold" textAnchor="middle">
                  MRL pre-step
                </text>
                <text x={85} y={118} fill={C.bright} fontSize={10} textAnchor="middle">
                  truncate d at embed time
                </text>
                <line x1={160} y1={104} x2={180} y2={35} stroke={C.dim} strokeWidth={1} strokeDasharray="4 3" />
                <line x1={320} y1={60} x2={320} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={130} x2={560} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={130} x2={80} y2={170} stroke={C.dim} strokeWidth={1} />
                <line x1={240} y1={130} x2={240} y2={170} stroke={C.dim} strokeWidth={1} />
                <line x1={400} y1={130} x2={400} y2={170} stroke={C.dim} strokeWidth={1} />
                <line x1={560} y1={130} x2={560} y2={170} stroke={C.dim} strokeWidth={1} />
                <text x={320} y={148} fill={C.dim} fontSize={12} textAnchor="middle">
                  branch on N
                </text>
                {[
                  {
                    x: 10,
                    label: "N < 1M",
                    color: C.green,
                    pick: "Skip",
                    sub: "HNSW + fp32",
                  },
                  {
                    x: 170,
                    label: "1M - 10M",
                    color: C.yellow,
                    pick: "Scalar Q",
                    sub: "int8, 4x",
                  },
                  {
                    x: 330,
                    label: "10M - 100M",
                    color: C.orange,
                    pick: "BQ + rescore",
                    sub: "(d>=768, DB ok)",
                  },
                  {
                    x: 490,
                    label: "N >= 100M",
                    color: C.red,
                    pick: "HNSW + PQ",
                    sub: "the scale default",
                  },
                ].map((r) => (
                  <g key={r.label}>
                    <rect
                      x={r.x}
                      y={170}
                      width={140}
                      height={50}
                      rx={6}
                      fill={`${r.color}18`}
                      stroke={r.color}
                      strokeWidth={2}
                    />
                    <text x={r.x + 70} y={190} fill={r.color} fontSize={13} fontWeight="bold" textAnchor="middle">
                      {r.label}
                    </text>
                    <text x={r.x + 70} y={208} fill={C.bright} fontSize={11} textAnchor="middle">
                      -&gt; {r.pick}
                    </text>
                    <line x1={r.x + 70} y1={220} x2={r.x + 70} y2={246} stroke={C.dim} strokeWidth={1} />
                    <text x={r.x + 70} y={260} fill={C.dim} fontSize={11} textAnchor="middle">
                      {r.sub}
                    </text>
                  </g>
                ))}
                <text x={320} y={300} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  fallback rule for the BQ branch
                </text>
                <text x={320} y={320} fill={C.dim} fontSize={11} textAnchor="middle">
                  if d &lt; 768 OR DB lacks BQ+rescore: downgrade to Scalar Q
                </text>
                <text x={320} y={355} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  recall-tolerance override
                </text>
                <text x={320} y={375} fill={C.dim} fontSize={11} textAnchor="middle">
                  if recall must exceed 99%: downgrade one step (BQ -&gt; SQ; SQ -&gt; skip; PQ -&gt; raise m)
                </text>
                <text x={320} y={410} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  fold inputs -&gt; one compression stack
                </text>
              </svg>
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
              Database capability gate
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr",
                gap: 6,
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>DB</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>SQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>PQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>BQ + rescore</div>
              {[
                ["Qdrant, Weaviate", "yes", "yes", "yes"],
                ["Milvus", "yes", "yes", "partial"],
                ["pgvector (mainline)", "halfvec", "no", "no"],
                ["Pinecone", "managed", "managed", "managed"],
              ].map((row) => (
                <div key={row[0]} style={{ display: "contents" }}>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[0]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[1]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[2]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[3]}</div>
                </div>
              ))}
            </div>
            <T color={C.bright} size={13} style={{ marginTop: 10, fontStyle: "italic", textAlign: "center" }}>
              For pgvector the tree collapses to halfvec or nothing regardless of N. For Pinecone, compression is
              abstracted - the only knob is MRL at embed time.
            </T>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The tree is deliberately conservative. Start with the default branch for your N, confirm the gate for the BQ
            path, and downgrade by one step if recall must hold above 99%.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Four worked scenarios: the tree with real numbers
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Same tree, four corpora. Each scenario fixes the four inputs, walks the branches, and prints the memory
            number that lands on the procurement doc.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Startup - the skip path",
                color: C.green,
                stack: "Qdrant + OpenAI-3-large (d=3072) + N=500K",
                path: "N < 1M gate hits immediately; MRL optional at this scale",
                result: "Skip quantization. HNSW + fp32.",
                math: "500K x 12 KB = 6 GB RAM. Fits on any dev box.",
              },
              {
                title: "Growing product - the high-leverage path",
                color: C.yellow,
                stack: "Qdrant + OpenAI-3-large (d: 3072 -> 1536 via MRL) + N=50M",
                path: "MRL halves d up front; N in 10M-100M; d>=768; Qdrant supports BQ+rescore",
                result: "MRL + BQ + rescore.",
                math: "fp32 baseline = 300 GB. Final = 50M x 192 B = ~10 GB. ~30x smaller, <2% recall loss.",
              },
              {
                title: "pgvector constrained - the menu-is-short path",
                color: C.cyan,
                stack: "pgvector + BGE-small (d=384, not MRL) + N=5M",
                path: "No MRL; N in 1M-10M so default would be SQ; pgvector supports halfvec, not BQ or PQ",
                result: "halfvec (fp16).",
                math: "fp32 = 7.7 GB. Final = 3.8 GB. 2x smaller. BQ off-limits anyway since d=384 is below the 768 threshold.",
              },
              {
                title: "Massive scale - the HNSW+PQ default",
                color: C.red,
                stack: "Qdrant + OpenAI-3-small (d: 1536 -> 1024 via MRL) + N=200M",
                path: "MRL reduces d; N >= 100M gate hits immediately",
                result: "HNSW + PQ (m=96).",
                math: "fp32 = 820 GB. Final = 200M x 96 B = ~19 GB. ~40x smaller. The scale default per 11.18.",
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  padding: "12px 14px",
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}22`,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <T color={s.color} bold center size={15}>
                  {s.title}
                </T>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    stack
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2, fontFamily: "monospace" }}>
                    {s.stack}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    tree walk
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2 }}>
                    {s.path}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.35)",
                    textAlign: "center",
                  }}
                >
                  <T color={s.color} bold size={14}>
                    {s.result}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {s.math}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scenario 1 is the &quot;do nothing&quot; case that engineers talk themselves out of. It is the right answer
            more often than the literature suggests. Quantization buys memory savings you do not yet need; it costs
            tuning and recall risk you cannot yet afford.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Heuristics to keep and traps to avoid
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Five rules of thumb compress this whole chapter into a design-review checklist. The four traps are the
            failure modes that reliably surface when teams skip the checklist.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold center size={16}>
                Five rules of thumb
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    rule: "Don't quantize until memory bites",
                    why: "Under 1M vectors, complexity isn't worth the tradeoff - run fp32 and move on.",
                  },
                  {
                    rule: "MRL is free; always apply it first",
                    why: "If the model supports it, truncate at embed time. Halves downstream memory before the DB sees anything.",
                  },
                  {
                    rule: "DB first, compression second",
                    why: "Pick the DB for ops/filter/SLA reasons, then pick compression from whatever menu that DB offers. pgvector shortens the menu to one option.",
                  },
                  {
                    rule: "Rescoring is nearly free; turn it on by default",
                    why: "BQ without rescore loses 5-10% recall; with rescore loses <1%. Cost is one extra disk read per top-k candidate.",
                  },
                  {
                    rule: "Measure recall on your own data before committing",
                    why: "Generic benchmark numbers assume generic data distributions. A 5-minute recall test on your corpus beats any published table.",
                  },
                ].map((h, idx) => (
                  <div
                    key={h.rule}
                    style={{
                      padding: "8px 10px",
                      background: `${C.green}10`,
                      border: `1px solid ${C.green}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.green} bold size={14}>
                      {idx + 1}. {h.rule}
                    </T>
                    <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                      {h.why}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.red} bold center size={16}>
                Four traps to avoid
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    trap: "BQ at d <= 256",
                    why: "Recall collapses to ~0.82 or worse per 11.15's measured table. The binary code loses too much information at low dimensions.",
                  },
                  {
                    trap: "Skipping MRL when available",
                    why: "Leaves free compression on the table. An OpenAI-3 embedding at d=3072 with no MRL truncation wastes half the memory budget.",
                  },
                  {
                    trap: "Stacking SQ+PQ+BQ without measuring",
                    why: "Each layer adds tuning surface. Benchmark before committing to a stacked scheme; the recall multiplier compounds.",
                  },
                  {
                    trap: "Trusting recall numbers that silently disable rescoring",
                    why: "BQ without rescore is a different product than BQ with rescore. Published comparisons that omit rescore settings mislead.",
                  },
                ].map((t, idx) => (
                  <div
                    key={t.trap}
                    style={{
                      padding: "8px 10px",
                      background: `${C.red}10`,
                      border: `1px solid ${C.red}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.red} bold size={14}>
                      {idx + 1}. {t.trap}
                    </T>
                    <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                      {t.why}
                    </T>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.green }}>five rules</span> on the left,{" "}
            <span style={{ color: C.red }}>four traps</span> on the right
            <br />
            together they compress the five compression techniques into a working decision framework
          </div>
        </Box>
      </Reveal>
      {sub < 3 && (
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
