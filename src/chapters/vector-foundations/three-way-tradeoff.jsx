import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { Triangle } from "../../shared/vector-graphs.jsx";

export default function ThreeWayTradeoff(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Every decision trades recall, latency, or memory
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Every choice a vector database makes - which index, which similarity function, how aggressively to compress,
            how many machines - bends on three axes. Pick any corner and the other two push back. Learn to see the
            triangle and the rest of this section becomes a catalogue of moves on it.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Triangle />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={17}>
                Recall
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Of the true nearest neighbors, how many did we actually return? 1.00 means perfect, 0.80 means we missed
                a fifth of them.
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
              <T color={C.orange} bold center size={17}>
                Latency
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Wall-clock time to answer one query. Users feel the difference between 10 ms and 500 ms as snappy versus
                laggy.
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
              <T color={C.yellow} bold center size={17}>
                Memory
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Bytes needed to hold the index. More vectors or higher dimensions means more RAM, and RAM is the single
                biggest cost in a vector DB bill.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Recall, latency, memory. Three corners. Every tradeoff in this section is a move along one edge.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Recall@k: how many of the true top-k did we find?
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Recall is the formal score for how good an approximate search is. Run brute force to get the ground truth:
            the k documents that are actually closest to the query. Then run the fast method and ask: of the k it
            returned, how many matched the true set?
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 17,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Recall@k = <span style={{ color: C.green }}>|ANN_results &cap; true_top_k|</span>
            {" / "}
            <span style={{ color: C.yellow }}>k</span>
          </div>
          <T color="#80deea" size={15} style={{ marginTop: 8, textAlign: "center", fontStyle: "italic" }}>
            Size of the intersection, divided by k. 1.0 means the ANN result is identical to brute force.
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
            <T color={C.cyan} bold center size={17}>
              Concrete example: query &quot;information about cats&quot;, k = 10
            </T>
            <T color="#80deea" size={15} center style={{ marginTop: 6 }}>
              Suppose the true top-10 are docs 1, 3, 7, 5, 4, 2, 8, 9, 6, 10. An ANN index returns docs 1, 3, 7, 5, 4,
              2, 8, 9, 6, and one impostor (doc 11). Nine of its ten slots match the true list.
            </T>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <T color={C.green} bold center size={14}>
                  True top-10 (brute force)
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {[1, 3, 7, 5, 4, 2, 8, 9, 6, 10].map((id, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "24px 1fr",
                        gap: 8,
                        padding: "3px 8px",
                        borderRadius: 3,
                        background: `${C.green}12`,
                      }}
                    >
                      <T color={C.green} bold size={13} style={{ fontFamily: "monospace" }}>
                        #{i + 1}
                      </T>
                      <T color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                        Doc {id}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <T color={C.cyan} bold center size={14}>
                  ANN top-10 returned
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    { id: 1, match: true },
                    { id: 3, match: true },
                    { id: 7, match: true },
                    { id: 5, match: true },
                    { id: 4, match: true },
                    { id: 2, match: true },
                    { id: 8, match: true },
                    { id: 9, match: true },
                    { id: 6, match: true },
                    { id: 11, match: false },
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "24px 1fr 28px",
                        gap: 8,
                        padding: "3px 8px",
                        borderRadius: 3,
                        background: row.match ? `${C.green}12` : `${C.red}18`,
                      }}
                    >
                      <T color={row.match ? C.green : C.red} bold size={13} style={{ fontFamily: "monospace" }}>
                        #{i + 1}
                      </T>
                      <T color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                        Doc {row.id}
                      </T>
                      <T
                        color={row.match ? C.green : C.red}
                        bold
                        size={13}
                        style={{ fontFamily: "monospace", textAlign: "right" }}
                      >
                        {row.match ? "ok" : "miss"}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                padding: "10px 14px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                lineHeight: 1.9,
              }}
            >
              Recall@10 = <span style={{ color: C.green }}>9</span> / <span style={{ color: C.yellow }}>10</span> ={" "}
              <span style={{ color: C.green, fontSize: 19 }}>0.9</span> <span style={{ color: C.dim }}>(90%)</span>
            </div>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 10, fontStyle: "italic" }}>
            Production targets are usually 0.95 to 0.99. A recall of 0.90 means one neighbor in ten is wrong - often
            still acceptable for search, rarely acceptable for fraud detection.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            How long does one query take?
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Latency is the wall-clock time from query in to top-k out. On 1 million vectors, brute force takes about 100
            ms - slow enough to feel. A tuned HNSW index on the same data answers in about 1 ms. Two orders of
            magnitude, for the cost of a recall sliver.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              Query latency at N = 1,000,000 (log scale)
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "HNSW (tuned ANN)", time: "1 ms", width: 8, color: C.green, lighter: "#80e8a5" },
                { label: "Brute force", time: "100 ms", width: 60, color: C.orange, lighter: "#ffcc80" },
                { label: "Disk-backed scan", time: "1000 ms (1 sec)", width: 100, color: C.red, lighter: "#ef9a9a" },
              ].map(({ label, time, width, color, lighter }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <T color={lighter} bold size={15}>
                      {label}
                    </T>
                    <T color={color} bold size={15} style={{ fontFamily: "monospace" }}>
                      {time}
                    </T>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      height: 14,
                      background: "rgba(0,0,0,0.4)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${width}%`, height: "100%", background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
                padding: "8px 10px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
              }}
            >
              {["1 ms", "10 ms", "100 ms", "1 sec"].map((tick) => (
                <T key={tick} color={C.dim} size={13} center>
                  |{tick}
                </T>
              ))}
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
            <T color={C.orange} bold center size={17}>
              Production cares about the tail, not the mean
            </T>
            <T color={C.bright} size={15} style={{ marginTop: 6 }}>
              Engineers rarely say &quot;average latency&quot;. They say P50, P95, P99 - the 50th, 95th, and 99th
              percentiles. P50 is the typical query. P99 is the slowest 1% of queries. For a search API handling
              thousands of queries per second, P99 is what users notice when the page stalls.
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {[
                { p: "P50", val: "8 ms", note: "typical" },
                { p: "P95", val: "25 ms", note: "5% are slower" },
                { p: "P99", val: "80 ms", note: "The tail" },
              ].map(({ p, val, note }) => (
                <div
                  key={p}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold size={16} style={{ fontFamily: "monospace" }} center>
                    {p}
                  </T>
                  <T color={C.bright} bold size={18} style={{ marginTop: 4, fontFamily: "monospace" }} center>
                    {val}
                  </T>
                  <T color={C.dim} size={13} style={{ marginTop: 2, fontStyle: "italic" }} center>
                    {note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A good median with a bad P99 still feels broken. Every algorithm in this section will be judged on both.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            How many bytes per vector?
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Memory is the cost that scales brutally. A single embedding at d = 768 stored as float32 is 768 times 4 =
            3,072 bytes, or 3 KB. Multiply that by N and the index can be bigger than the dataset it came from.
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
              lineHeight: 1.9,
            }}
          >
            bytes per vector = d &middot; sizeof(float32)
            <br />= <span style={{ color: C.yellow }}>768</span> &middot; <span style={{ color: C.yellow }}>4</span>
            <br />= <span style={{ color: C.yellow, fontSize: 20 }}>3072 bytes = 3 KB per vector</span>
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
            <T color={C.yellow} bold center size={17}>
              Memory grows linearly with N
            </T>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 6,
                padding: "8px 10px",
                borderBottom: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={13} center>
                N
              </T>
              <T color={C.yellow} bold size={13} center>
                Vectors (3 KB each)
              </T>
              <T color={C.yellow} bold size={13} center>
                + HNSW graph (100 B/vec)
              </T>
              <T color={C.yellow} bold size={13} center>
                Total
              </T>
            </div>
            {[
              { N: "10", vec: "30 KB", graph: "1 KB", total: "31 KB" },
              { N: "1,000,000", vec: "3 GB", graph: "100 MB", total: "3.1 GB" },
              { N: "100,000,000", vec: "300 GB", graph: "10 GB", total: "310 GB" },
              { N: "1,000,000,000", vec: "3 TB", graph: "100 GB", total: "3.1 TB" },
            ].map((r) => (
              <div
                key={r.N}
                style={{
                  marginTop: 4,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.25)",
                  fontFamily: "monospace",
                }}
              >
                <T color={C.bright} size={14}>
                  {r.N}
                </T>
                <T color={C.yellow} size={14}>
                  {r.vec}
                </T>
                <T color={C.orange} size={14}>
                  {r.graph}
                </T>
                <T color={C.bright} bold size={14}>
                  {r.total}
                </T>
              </div>
            ))}
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
              Why the HNSW overhead column matters
            </T>
            <T color={C.bright} size={14} style={{ marginTop: 6 }}>
              A vector is not the only thing the index stores. HNSW keeps a graph of edges between vectors - roughly 32
              neighbor pointers per node, so about 100 bytes of graph overhead per vector. At 1 billion, that overhead
              alone is 100 GB. Indexing algorithms and compression schemes live or die on this number.
            </T>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            3 KB sounds tiny until you multiply by a billion. Memory is the axis that turns a research demo into a
            server bill.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Pushing one corner costs another
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The three axes are linked. Every knob we tighten on one corner loosens something on another. Three concrete
            examples, each from a real production lever.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                title: "Raise ef_search to chase recall",
                src: "ef_search",
                srcColor: C.cyan,
                srcLighter: "#80deea",
                srcArrow: "up",
                srcLabel: "Recall up",
                dstArrow: "up",
                dstLabel: "Latency up",
                dstColor: C.orange,
                body: "HNSW (a graph-based index we build later in this section) has a knob called ef_search that controls how many candidate nodes to explore per query. Bigger number = more exploration = higher recall, but linearly more work, so latency rises. Typical tuning: ef_search = 200 gives 0.99 recall, ef_search = 50 gives 0.95 recall at 4x the speed.",
              },
              {
                title: "Add PQ compression to shrink memory",
                src: "PQ compression",
                srcColor: C.yellow,
                srcLighter: "#ffe082",
                srcArrow: "down",
                srcLabel: "Memory down",
                dstArrow: "down",
                dstLabel: "Recall down",
                dstColor: C.cyan,
                body: "Product Quantization replaces each 3 KB vector with ~96 bytes of codebook indices (small integer codes that look up an approximate version of the real vector) - a 32x memory win. But the stored vectors are approximate, so distances are approximate, so recall drops. Typical cost: 0.98 recall becomes 0.94.",
              },
              {
                title: "Add replicas to cut tail latency",
                src: "more replicas / cache",
                srcColor: C.purple,
                srcLighter: "#b8a9ff",
                srcArrow: "down",
                srcLabel: "Latency down",
                dstArrow: "up",
                dstLabel: "Memory cost up",
                dstColor: C.yellow,
                body: "Run three copies of the index on three machines and route each query to the least-loaded one. P99 (the 99th-percentile latency, i.e. the worst 1% of queries) drops because no single node gets a long queue. But you are paying for 3x the RAM. Caching the most frequent queries is a variant - memory for speed.",
              },
            ].map((tr, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                }}
              >
                <T color={C.red} bold size={17}>
                  {tr.title}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 1fr",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: `${tr.srcColor}12`,
                      textAlign: "center",
                    }}
                  >
                    <T color={tr.srcLighter} size={13} center>
                      Lever
                    </T>
                    <T color={tr.srcColor} bold size={15} style={{ marginTop: 2, fontFamily: "monospace" }} center>
                      {tr.src}
                    </T>
                    <T color={tr.srcColor} bold size={14} style={{ marginTop: 4 }} center>
                      {tr.srcArrow === "up" ? "↑" : "↓"} {tr.srcLabel}
                    </T>
                  </div>
                  <T color={C.red} bold center size={24}>
                    →
                  </T>
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: `${tr.dstColor}12`,
                      textAlign: "center",
                    }}
                  >
                    <T color={tr.dstColor} size={13} center>
                      Cost
                    </T>
                    <T color={tr.dstColor} bold size={15} style={{ marginTop: 2, fontFamily: "monospace" }} center>
                      {tr.dstArrow === "up" ? "↑" : "↓"} {tr.dstLabel}
                    </T>
                  </div>
                </div>
                <T color={C.bright} size={14} style={{ marginTop: 10 }} center>
                  {tr.body}
                </T>
              </div>
            ))}
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Three different knobs, three different axes, same shape of answer. Nothing is free.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Every decision is a move on this triangle
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Every technique in a vector database - and every technique in the rest of this section - is a labeled arrow
            on the triangle. Indexing algorithms trade latency for memory. Quantization and compression trade memory for
            recall. Production concerns like filtering and sharding push on all three. Knowing which corner is being
            pushed is how any technique is reasoned about.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Triangle
              annotations={[
                { x: 210, y: 150, label: "Indexing: latency down, memory up", color: C.orange },
                { x: 210, y: 170, label: "Quantization: memory down, recall down", color: C.yellow },
                { x: 210, y: 190, label: "Filtering and sharding: all three", color: C.purple },
              ]}
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              {
                title: "Indexing algorithms",
                body: "Flat / IVF / HNSW. Each is a different shape of graph or partition. They buy latency at the cost of memory (the graph edges) and a small recall discount.",
                color: C.orange,
                lighter: "#ffcc80",
              },
              {
                title: "Quantization",
                body: "Scalar / Product / Binary. Shrink bytes per vector by 4x to 32x. Buys memory at the cost of recall.",
                color: C.yellow,
                lighter: "#ffe082",
              },
              {
                title: "Production concerns",
                body: "Filtering, sharding, replicas, cache. Push on memory or latency depending on how they are stacked, sometimes at the cost of recall when filters hide neighbors.",
                color: C.purple,
                lighter: "#b8a9ff",
              },
            ].map((c) => (
              <div
                key={c.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${c.color}06`,
                  border: `1px solid ${c.color}12`,
                }}
              >
                <T color={c.lighter} bold center size={16}>
                  {c.title}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  {c.body}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={17}>
              The triangle is the whole architecture
            </T>
            <T color="#80e8a5" center size={15} style={{ marginTop: 6 }}>
              Every algorithm, every knob, every deployment choice is a move along one edge. When an engineer says
              &quot;HNSW with PQ32 behind two replicas&quot;, they are naming three specific moves on this triangle -
              one on each axis.
            </T>
          </div>
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
