import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 11 Act 3: Compression (chapters 11.12-11.16).
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
            HNSW overhead per vector &approx; (M + M/2 + M/4 + ...) &middot; 8 bytes
            <br />
            &approx; 2M &middot; 8 bytes = 32M bytes &approx;{" "}
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
                  &approx; 48 ops per 768-dim pair
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
                  &approx; 12 ops per 768-dim pair
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
            Split a 768-dim vector into m = 96 subvectors
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Product quantization takes a single vector and cuts it into m equal-length chunks. At d = 768 with m = 96,
            each chunk is a subvector of 8 dimensions. We will treat each slot independently: slot 0 handles dims 0-7 of
            every document in the corpus, slot 1 handles dims 8-15, and so on across all 96 slots. Every slot gets its
            own codebook.
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
              Illustrative split (8 dims, m = 2 subvectors of dim 4)
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
                  background: `${C.cyan}10`,
                  border: `1px solid ${C.cyan}20`,
                  borderRadius: 6,
                }}
              >
                <T color={C.cyan} bold center size={14}>
                  subvector 0 (dims 0-3)
                </T>
                <div
                  style={{
                    marginTop: 6,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 4,
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  {subvec0.map((v, i) => (
                    <div
                      key={i}
                      style={{ padding: "6px 4px", textAlign: "center", color: C.bright, background: `${C.cyan}08` }}
                    >
                      {v.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.purple}10`,
                  border: `1px solid ${C.purple}20`,
                  borderRadius: 6,
                }}
              >
                <T color={C.purple} bold center size={14}>
                  subvector 1 (dims 4-7)
                </T>
                <div
                  style={{
                    marginTop: 6,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 4,
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  {subvec1.map((v, i) => (
                    <div
                      key={i}
                      style={{ padding: "6px 4px", textAlign: "center", color: C.bright, background: `${C.purple}08` }}
                    >
                      {v.toFixed(2)}
                    </div>
                  ))}
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
            at d = 768: <span style={{ color: C.cyan }}>m = 96 subvectors &middot; 8 dims each</span>
            <br />
            slot 0 = dims 0..7 &middot; slot 1 = dims 8..15 &middot; ... &middot; slot 95 = dims 760..767
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The split is the setup. Each slot is a miniature 8-dim vector database of its own.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Per-slot codebook: k-means with 256 centroids
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            For each of the 96 slots, run k-means across the entire dataset&apos;s subvectors at that slot. Pick k = 256
            centroids. These 256 centroids are the codebook for that slot - every future subvector at slot 0 will be
            approximated by whichever of the 256 centroids it is closest to. Each slot has its own independent codebook.
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
              Slot 0 codebook (32 of the 256 centroids shown as 4-dim vectors)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              {Array.from({ length: 32 }).map((_, i) => {
                const c = [
                  ((i * 31) % 100) / 100,
                  ((i * 47 + 13) % 100) / 100,
                  ((i * 23 + 7) % 100) / 100,
                  ((i * 59 + 11) % 100) / 100,
                ];
                return (
                  <div
                    key={i}
                    style={{
                      padding: "5px 6px",
                      background: `${C.yellow}10`,
                      border: `1px solid ${C.yellow}20`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: C.bright,
                    }}
                  >
                    <div style={{ color: C.yellow, fontSize: 10, fontWeight: "bold" }}>id {i}</div>
                    <div>
                      [{c[0].toFixed(2)},{c[1].toFixed(2)}]
                    </div>
                    <div>
                      [{c[2].toFixed(2)},{c[3].toFixed(2)}]
                    </div>
                  </div>
                );
              })}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
              ... 224 more centroids (256 total) ...
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
            96 slots &middot; 256 centroids each = <span style={{ color: C.yellow }}>24,576 centroids total</span>
            <br />
            codebook storage: 96 &middot; 256 &middot; 8 dims &middot; 4 bytes &approx; 786 KB (one-time, fits in L2)
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            256 codes fit in a single 8-bit byte. That is the whole reason k = 256 is the PQ default.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Encode: each subvector becomes one centroid id
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            With the codebooks in place, encoding is a simple operation. For each slot of a new document vector, find
            the centroid id (0 through 255) that is closest to the subvector and store that single byte. A whole 768-dim
            vector becomes 96 bytes - one byte per slot. The search index stores these 96-byte codes, never the original
            float32 vector.
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
              Encoding doc 1 (first 4 of 96 slots shown)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "120px 1fr 60px",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 13,
                alignItems: "center",
              }}
            >
              {[
                { slot: 0, sub: "[0.81, 0.12, 0.45, 0.22]", id: 17 },
                { slot: 1, sub: "[0.63, 0.07, 0.38, 0.91]", id: 203 },
                { slot: 2, sub: "[0.44, 0.28, 0.56, 0.19]", id: 89 },
                { slot: 3, sub: "[0.72, 0.34, 0.15, 0.48]", id: 142 },
              ].map((row) => (
                <div key={row.slot} style={{ display: "contents" }}>
                  <div style={{ color: C.green, textAlign: "right" }}>slot {row.slot}</div>
                  <div style={{ color: C.bright, textAlign: "center", padding: "4px 6px" }}>{row.sub}</div>
                  <div
                    style={{
                      color: C.bright,
                      textAlign: "center",
                      padding: "6px 8px",
                      background: `${C.green}14`,
                      border: `1px solid ${C.green}28`,
                      borderRadius: 4,
                      fontWeight: "bold",
                    }}
                  >
                    id = {row.id}
                  </div>
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 10 }}>
              ... 92 more slots, each one 1 byte ...
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
            doc 1 code = [17, 203, 89, 142, ..., 71]
            <br />
            <span style={{ color: C.green }}>96 centroid ids &middot; 1 byte each = 96 bytes total</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The vector is now a compact sequence of byte-sized pointers into 96 small codebooks.
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
              <div>96 &middot; 256 = 24,576 entries &middot; 4 bytes &approx; 96 KB (fits L2 cache)</div>
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
              <text x="392" y="46" fill={C.green} fontSize="12" fontWeight="bold">
                d=768, recall 0.95
              </text>
              <circle cx="440" cy="45" r="5" fill={C.green} />
              <text x="350" y="75" fill={C.green} fontSize="12" fontWeight="bold">
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

export const IVFPQ = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            IVF-PQ (stub)
          </T>
        </Box>
      )}
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

export const HNSWPQ = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            HNSW + PQ (stub)
          </T>
        </Box>
      )}
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
