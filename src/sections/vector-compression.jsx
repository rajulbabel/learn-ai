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
            The rest of this act covers the four production techniques. Each targets a different point on the
            accuracy-compression curve. They stack: a real system often uses scalar quantization plus PQ, or binary plus
            Matryoshka truncation. The framework for picking is the recall cost versus the memory win.
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
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Scalar Quantization (stub)
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
