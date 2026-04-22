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
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Product Quantization (stub)
          </T>
        </Box>
      )}
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
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Binary Quantization (stub)
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

export const Matryoshka = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Matryoshka (stub)
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
