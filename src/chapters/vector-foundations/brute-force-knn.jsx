import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

const CAT_CORPUS = [
  { id: 1, text: "Cats are small domesticated carnivores", vec: [0.81, 0.12, 0.45, 0.22], catLike: true },
  { id: 2, text: "Dogs are loyal pets", vec: [0.33, 0.68, 0.29, 0.41] },
  { id: 3, text: "Lions are big cats that live in Africa", vec: [0.76, 0.18, 0.52, 0.31], catLike: true },
  { id: 4, text: "My cat sat on the mat", vec: [0.72, 0.22, 0.48, 0.26], catLike: true },
  { id: 5, text: "Tigers are striped cats", vec: [0.79, 0.15, 0.41, 0.28], catLike: true },
  { id: 6, text: "Python is a programming language", vec: [0.09, 0.88, 0.12, 0.74] },
  { id: 7, text: "Kittens grow up to be cats", vec: [0.83, 0.1, 0.47, 0.19], catLike: true },
  { id: 8, text: "The dog chased the cat", vec: [0.55, 0.44, 0.36, 0.39] },
  { id: 9, text: "Birds can fly", vec: [0.18, 0.31, 0.74, 0.62] },
  { id: 10, text: "Fish live underwater", vec: [0.21, 0.29, 0.68, 0.81] },
];

const BRUTE_FORCE_SCORES = [
  { id: 1, cos: 0.97 },
  { id: 3, cos: 0.94 },
  { id: 7, cos: 0.92 },
  { id: 5, cos: 0.89 },
  { id: 4, cos: 0.87 },
  { id: 8, cos: 0.68 },
  { id: 2, cos: 0.48 },
  { id: 6, cos: 0.35 },
  { id: 9, cos: 0.3 },
  { id: 10, cos: 0.27 },
];

export default function BruteForceKNN(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const ranked = BRUTE_FORCE_SCORES.map((r, i) => {
    const doc = CAT_CORPUS.find((d) => d.id === r.id);
    return { ...doc, cos: r.cos, rank: i + 1 };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The naive approach: compare to everything
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before we get clever, start with the baseline algorithm. If we have N stored vectors and one query, the
            dumbest thing that works is to compare the query against each stored vector, rank them, and return the best
            k. This is called brute-force k-nearest-neighbors, or brute-force kNN.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                step: "1",
                title: "Compute similarity",
                body: "For every stored vector v_i, compute sim(q, v_i). With cosine similarity that is one dot product plus two norms per doc.",
              },
              {
                step: "2",
                title: "Sort",
                body: "Arrange all N scores from highest to lowest. Every document gets a rank from 1 (most similar) to N (least similar).",
              },
              {
                step: "3",
                title: "Return top-k",
                body: "Slice off the first k entries of the sorted list. These are the k documents the model thinks are closest in meaning to the query.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={26} style={{ fontFamily: "monospace" }}>
                  {step}
                </T>
                <T color="#80deea" bold center size={16} style={{ marginTop: 4 }}>
                  {title}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  {body}
                </T>
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
            <span style={{ color: C.dim }}># brute-force kNN, pseudo-code</span>
            <br />
            scores = [<span style={{ color: C.cyan }}>cosine</span>(q, v<sub>i</sub>) for v<sub>i</sub> in V]
            <br />
            ranked = <span style={{ color: C.yellow }}>sort</span>(scores, descending=True)
            <br />
            return ranked[:<span style={{ color: C.green }}>k</span>]{"  "}
            <span style={{ color: C.dim }}># the top-k nearest neighbors</span>
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10, fontStyle: "italic" }}>
            No shortcuts, no index, no approximation. We literally touch every vector in the corpus. That is where the
            word &quot;brute-force&quot; comes from - it is the correctness-at-any-cost baseline.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            On 10 docs, this is instant
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Run the algorithm on our cat corpus. For each doc, compute cosine similarity against the query
            &quot;information about cats&quot;, sort, and take the top-3. The cat-related docs float to the top, the
            off-topic ones sink to the bottom. Total work: 10 dot products.
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 140px 90px",
                gap: 10,
                padding: "6px 10px",
                borderBottom: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={13} center>
                Rank
              </T>
              <T color={C.green} bold size={13} center>
                Document
              </T>
              <T color={C.green} bold size={13} center>
                cosine(q, v)
              </T>
              <T color={C.green} bold size={13} center>
                Top-3?
              </T>
            </div>
            {ranked.map((d) => {
              const isTop3 = d.rank <= 3;
              return (
                <div
                  key={d.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 140px 90px",
                    gap: 10,
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 4,
                    background: isTop3 ? `${C.green}18` : "rgba(0,0,0,0.25)",
                    marginTop: 4,
                  }}
                >
                  <T color={isTop3 ? C.green : C.dim} bold size={14} style={{ fontFamily: "monospace" }}>
                    #{d.rank}
                  </T>
                  <T color={C.bright} size={14}>
                    {d.text}
                  </T>
                  <T color={isTop3 ? C.green : C.dim} size={14} style={{ fontFamily: "monospace", textAlign: "right" }}>
                    {d.cos.toFixed(2)}
                  </T>
                  <T color={isTop3 ? C.green : C.dim} bold size={14} style={{ textAlign: "center" }}>
                    {isTop3 ? "YES" : "-"}
                  </T>
                </div>
              );
            })}
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
              This result is exact
            </T>
            <T color="#80e8a5" center size={15} style={{ marginTop: 6 }}>
              We compared the query to every single doc in the corpus. No doc was skipped, no shortcut was taken. The
              top-3 returned (docs 1, 3, 7) are guaranteed to be the true three most similar. That is the promise of
              brute force: perfect answers.
            </T>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 10, fontStyle: "italic" }}>
            Wall-clock time for this search on a laptop: well under one millisecond. At N = 10, brute force is the right
            answer.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            At N = 1,000,000 it is slow but possible
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Crank N up to one million vectors. The algorithm does not change - we still compare the query to every
            vector. But each comparison is no longer trivial because real embeddings are 768-dimensional, not 4-dim.
            Every dot product is 768 multiplies plus 768 adds.
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
            Ops per query = N &middot; d
            <br />= <span style={{ color: C.yellow }}>1,000,000</span> &middot;{" "}
            <span style={{ color: C.yellow }}>768</span>
            <br />= <span style={{ color: C.yellow }}>~770 million</span> multiply-add operations
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "N = 10 (toy corpus)", width: 1, time: "~0.01 ms", color: C.green, lighter: "#80e8a5" },
              {
                label: "N = 1,000,000 (Wikipedia-scale)",
                width: 60,
                time: "~500 ms",
                color: C.yellow,
                lighter: "#ffe082",
              },
            ].map(({ label, width, time, color, lighter }) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
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
                    marginTop: 6,
                    height: 14,
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(width, 100)}%`,
                      height: "100%",
                      background: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Half a second is slow for an interactive search but still technically possible. You could run this brute
            force on a single modern CPU and ship it for low-traffic workloads. The algorithm starts to creak, but does
            not break.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%", marginBottom: 14 }}>
          <T color={C.cyan} bold center size={22}>
            First, what is FLOPS?
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            FLOPS means <b>FLoating-point OPerations per Second</b>. In plain words: how many math steps (an add, a
            multiply, a compare) a chip can do in one second. It is the standard way people brag about chip speed.
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
            <span style={{ color: C.dim }}># 1 FLOP = one floating-point math step</span>
            <br />
            <span style={{ color: C.cyan }}>a &middot; b + c</span> counts as 2 FLOPs (one multiply, one add)
            <br />A modern GPU does about <span style={{ color: C.cyan, fontSize: 20 }}>10^12 FLOPS/sec</span>{" "}
            <span style={{ color: C.dim }}>(a trillion math steps a second)</span>
          </div>

          <T color={C.cyan} bold center size={17} style={{ marginTop: 16 }}>
            The chef and the warehouse
          </T>
          <svg viewBox="0 0 500 170" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
            <desc>
              A super-fast chef on the left (labeled chef equals chip) stands next to a cutting board with chopping
              marks, connected by a long dashed red arrow labeled slow delivery to a distant warehouse on the right
              (labeled warehouse equals memory). The illustration shows that the chef can chop in one second but has to
              wait ten minutes for each delivery, so fetching the ingredients is the real bottleneck, not chopping
              speed. This is the analogy for why memory bandwidth, not FLOPS, limits brute-force search at
              billion-vector scale.
            </desc>
            <defs>
              <marker id="flops-arrow-11-2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill={C.red} />
              </marker>
            </defs>

            <circle cx="80" cy="70" r="22" fill={C.cyan} opacity="0.85" />
            <rect x="66" y="36" width="28" height="14" rx="4" fill={C.cyan} />
            <rect x="60" y="48" width="40" height="4" fill={C.cyan} opacity="0.7" />
            <line x1="112" y1="58" x2="142" y2="48" stroke={C.cyan} strokeWidth="2" />
            <line x1="112" y1="70" x2="145" y2="70" stroke={C.cyan} strokeWidth="2" />
            <line x1="112" y1="82" x2="142" y2="92" stroke={C.cyan} strokeWidth="2" />
            <text x="80" y="125" textAnchor="middle" fontSize="14" fill={C.bright}>
              chef = chip
            </text>
            <text x="80" y="143" textAnchor="middle" fontSize="12" fill={C.dim}>
              Chops in 1 second
            </text>

            <line
              x1="170"
              y1="70"
              x2="370"
              y2="70"
              stroke={C.red}
              strokeWidth="3"
              strokeDasharray="6,6"
              markerEnd="url(#flops-arrow-11-2)"
            />
            <text x="270" y="56" textAnchor="middle" fontSize="14" fill={C.red}>
              Slow delivery
            </text>
            <text x="270" y="92" textAnchor="middle" fontSize="12" fill={C.dim}>
              Takes 10 minutes
            </text>

            <polygon points="390,46 430,22 470,46" fill={C.red} opacity="0.85" />
            <rect x="390" y="46" width="80" height="54" rx="3" fill={C.red} opacity="0.7" />
            <rect x="420" y="68" width="20" height="32" fill="#08080d" />
            <text x="430" y="125" textAnchor="middle" fontSize="14" fill={C.bright}>
              warehouse = memory
            </text>
            <text x="430" y="143" textAnchor="middle" fontSize="12" fill={C.dim}>
              Holds all the vectors
            </text>
          </svg>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={15}>
                Chop speed
              </T>
              <T color="#80deea" bold center size={20} style={{ marginTop: 6, fontFamily: "monospace" }}>
                ~10^12 /sec
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                FLOPS
                <br />
                (how fast math happens)
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
              <T color={C.red} bold center size={15}>
                Delivery speed
              </T>
              <T color="#ef9a9a" bold center size={20} style={{ marginTop: 6, fontFamily: "monospace" }}>
                ~50 GB/sec
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                Memory bandwidth
                <br />
                (how fast data arrives)
              </T>
            </div>
          </div>

          <T color="#80deea" size={16} style={{ marginTop: 12, fontStyle: "italic" }}>
            Chopping is lightning-fast. Fetching the next vegetable from the warehouse is the slow part. So when we say
            &quot;the real killer is not FLOPS, it is memory,&quot; we mean: the chip is waiting on deliveries, not on
            math.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            At N = 1 billion it is hopeless
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Now push N to one billion. The compute cost scales linearly - a thousand times more work than a million. But
            the real killer is not FLOPS, it is memory. To touch every vector, we have to READ every vector from RAM.
            Every. Single. Query.
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
            <span style={{ color: C.dim }}># bytes of vector data to read per query</span>
            <br />
            bytes = N &middot; d &middot; sizeof(float32)
            <br />= <span style={{ color: C.red }}>1,000,000,000</span> &middot;{" "}
            <span style={{ color: C.red }}>768</span> &middot; <span style={{ color: C.red }}>4</span>
            <br />= <span style={{ color: C.red }}>3,072,000,000,000 bytes</span>
            <br />= <span style={{ color: C.red, fontSize: 20 }}>3.072 TB per query</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={16}>
                What we need
              </T>
              <T color="#ef9a9a" bold center size={22} style={{ marginTop: 8, fontFamily: "monospace" }}>
                3.072 TB
              </T>
              <T color={C.bright} size={14} center style={{ marginTop: 6 }}>
                Read from memory
                <br />
                Per single user query
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
                What RAM can deliver
              </T>
              <T color="#ef9a9a" bold center size={22} style={{ marginTop: 8, fontFamily: "monospace" }}>
                ~50 GB/sec
              </T>
              <T color={C.bright} size={14} center style={{ marginTop: 6 }}>
                A single DDR5 channel
                <br />
                At peak bandwidth
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}18`,
              border: `2px solid ${C.red}`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={20}>
              NOT FEASIBLE
            </T>
            <T color="#ef9a9a" center size={15} style={{ marginTop: 6 }}>
              3.072 TB / 50 GB/sec = ~60 seconds per query, just to stream the data past the CPU. Memory bandwidth is
              the bottleneck, not FLOPS. Even with infinite compute, brute force at 1 billion is hopeless for
              interactive search.
            </T>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The data does not even fit in a single machine. Google, Meta, and OpenAI all run indexes at billions of
            vectors. Brute force is off the table. Something has to give.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Give up exactness for speed
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The way out is to stop insisting on the EXACT top-k. Instead, return an approximate top-k: a list that is
            mostly the true neighbors, with the occasional miss. This is the family of algorithms called Approximate
            Nearest Neighbor, or ANN.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={17}>
              How do we measure what we give up?
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                lineHeight: 1.8,
              }}
            >
              Recall@k = <span style={{ color: C.green }}>|approx_topk &cap; true_topk|</span>
              {" / "}
              <span style={{ color: C.yellow }}>k</span>
            </div>
            <T color="#b8a9ff" size={14} style={{ marginTop: 8 }} center>
              Of the k neighbors the approximate method returned, what fraction were in the true top-k? 1.0 means
              perfect (same as brute force). 0.0 means completely wrong.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 80px 1fr",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                Exact (brute force)
              </T>
              <div style={{ marginTop: 10 }}>
                <T color="#ef9a9a" size={14}>
                  Recall@k:
                </T>
                <T color={C.red} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  1.00
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color="#ef9a9a" size={14}>
                  Latency at 1B:
                </T>
                <T color={C.red} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  ~60 sec
                </T>
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 8, fontStyle: "italic" }}>
                Perfect answers, unusable latency.
              </T>
            </div>
            <div style={{ textAlign: "center" }}>
              <svg viewBox="0 0 80 50" style={{ width: "100%", height: "auto", display: "block" }}>
                <desc>
                  Rightward purple arrow labeled &quot;this is what production uses&quot; pointing from the Exact
                  brute-force card on the left to the ANN card on the right.
                </desc>
                <defs>
                  <marker id="arrow11-2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill={C.purple} />
                  </marker>
                </defs>
                <line x1="5" y1="25" x2="70" y2="25" stroke={C.purple} strokeWidth="3" markerEnd="url(#arrow11-2)" />
              </svg>
              <T color={C.purple} size={12} bold style={{ marginTop: 2 }} center>
                Production
              </T>
              <T color={C.purple} size={12} bold center>
                Uses this
              </T>
            </div>
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                ANN (approximate)
              </T>
              <div style={{ marginTop: 10 }}>
                <T color="#b8a9ff" size={14}>
                  Recall@k:
                </T>
                <T color={C.purple} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  0.99
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color="#b8a9ff" size={14}>
                  Latency at 1B:
                </T>
                <T color={C.purple} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  ~10 ms
                </T>
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 8, fontStyle: "italic" }}>
                Misses 1 neighbor in 100, runs ~6000x faster.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={17}>
              The tradeoff is wildly favorable
            </T>
            <T color="#b8a9ff" center size={15} style={{ marginTop: 6 }}>
              Production ANN algorithms hit 99%+ recall while running 100 to 1000 times faster than brute force. You
              give up one neighbor in a hundred and gain orders of magnitude of speed. For search, recommendations, and
              RAG, that is an obvious win - the user never notices the missed result, but they notice the wait.
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
