import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Running cat-corpus used across Section 11 chapters. Vectors are 4-dim illustrative values.
// `catLike` marks the cat-related entries (docs 1, 3, 4, 5, 7); used by 11.2+ to color top-k results.
//
// SVG marker and gradient ids in this file follow the pattern: `<type><chapter>-<svg-index>`
// (e.g., arrow11-1 = first SVG arrow marker in chapter 11.1). When adding SVGs in 11.2+,
// increment the svg-index for each SVG within the chapter to avoid DOM id collisions.
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

const QUERY = { text: "information about cats", vec: [0.85, 0.14, 0.44, 0.21] };

const fmtVec = (v) => `[${v.map((x) => x.toFixed(2)).join(", ")}]`;

// 2D scatter coordinates reused across 11.5-11.9 diagrams. Cat docs (1, 3, 4, 5, 7)
// cluster in the upper-left; the query lands inside the cat cluster. Non-cat docs spread
// across other regions so k-means produces three separable clusters in the IVF chapter.
// Three tight visual clusters so the IVF illustrations clearly show
// three groups: cats in upper-left, dogs in upper-right, other in lower-right.
// Each cluster is a compact ~55-pixel blob so it reads as one cloud, not two.
const CORPUS_XY = {
  1: { x: 100, y: 100 },
  7: { x: 150, y: 100 },
  5: { x: 95, y: 135 },
  3: { x: 150, y: 140 },
  4: { x: 125, y: 155 },
  2: { x: 325, y: 80 },
  8: { x: 365, y: 115 },
  10: { x: 405, y: 215 },
  9: { x: 410, y: 265 },
  6: { x: 350, y: 240 },
};
const QUERY_XY = { x: 55, y: 55 };

export const RetrievalProblem = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            From embeddings to a retrieval problem
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Back in chapter 5.2, the transformer turned every word into an embedding - a dense vector of numbers that
            captures meaning. Now picture an entire library: 10 documents, each pre-encoded into its own vector. A user
            types a query. How do we find the documents whose meaning matches it?
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={16}>
              Query
            </T>
            <T color={C.bright} size={17} style={{ marginTop: 4 }}>
              &quot;{QUERY.text}&quot;
            </T>
            <T color={C.yellow} size={15} style={{ marginTop: 6, fontFamily: "monospace" }}>
              {fmtVec(QUERY.vec)}
            </T>
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
            <T color="#b8a9ff" bold center size={16}>
              The stored database: 10 documents, each with a 4-dim embedding
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {CAT_CORPUS.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 1fr 220px",
                    gap: 10,
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 4,
                    background: "rgba(0,0,0,0.25)",
                  }}
                >
                  <T color={C.dim} size={13} style={{ fontFamily: "monospace" }}>
                    #{d.id}
                  </T>
                  <T color={C.bright} size={15}>
                    {d.text}
                  </T>
                  <T color={C.purple} size={13} style={{ fontFamily: "monospace", textAlign: "right" }}>
                    {fmtVec(d.vec)}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Real embeddings have 768 or 1536 dimensions instead of 4, and production databases have billions of rows
            instead of 10. The shape of the problem is the same.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Find the 10 most similar documents
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            This is the core retrieval task. One query vector, N stored vectors, and we want the top-10 nearest. For our
            tiny corpus with only 10 docs, &quot;top-10&quot; would return every document. The real problem scales:
            imagine hundreds of millions of vectors and we still need the top-10 closest in milliseconds.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <svg viewBox="0 0 520 240" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Query vector on the left with an arrow pointing into a cloud of 10 document dots. The three dots closest
                to the query (docs 1, 3, and 7 - the cat-related ones) are highlighted green; the others are dim.
              </desc>
              <rect x="20" y="95" width="110" height="50" rx="8" fill="rgba(255,215,64,0.08)" stroke="#ffd740" />
              <text x="75" y="118" textAnchor="middle" fill="#ffd740" fontSize="13" fontFamily="monospace">
                query
              </text>
              <text x="75" y="135" textAnchor="middle" fill="#ffd740" fontSize="11" fontFamily="monospace">
                &quot;about cats&quot;
              </text>
              <line x1="130" y1="120" x2="190" y2="120" stroke="#ffd740" strokeWidth="2" markerEnd="url(#arrow11-1)" />
              <defs>
                <marker id="arrow11-1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ffd740" />
                </marker>
              </defs>
              {[
                { x: 260, y: 110, id: 1, close: true },
                { x: 290, y: 135, id: 3, close: true },
                { x: 275, y: 90, id: 7, close: true },
                { x: 330, y: 60, id: 5, close: false },
                { x: 360, y: 155, id: 4, close: false },
                { x: 420, y: 90, id: 2, close: false },
                { x: 450, y: 170, id: 8, close: false },
                { x: 400, y: 40, id: 9, close: false },
                { x: 480, y: 130, id: 6, close: false },
                { x: 470, y: 55, id: 10, close: false },
              ].map((p) => (
                <g key={p.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.close ? 11 : 8}
                    fill={p.close ? "#00e676" : "rgba(255,255,255,0.25)"}
                    stroke={p.close ? "#00e676" : "rgba(255,255,255,0.35)"}
                  />
                  <text
                    x={p.x}
                    y={p.y + 4}
                    textAnchor="middle"
                    fill={p.close ? "#08080d" : "rgba(255,255,255,0.7)"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {p.id}
                  </text>
                </g>
              ))}
              <text x="295" y="210" textAnchor="middle" fill="#80deea" fontSize="13">
                top-3 closest (highlighted): docs 1, 3, 7 - all cat-related
              </text>
            </svg>
            <T color={C.dim} size={13} center style={{ marginTop: 6, fontStyle: "italic" }}>
              In a 10-doc corpus, top-10 is everything, so we highlight the top-3 to make &quot;closest&quot; visible.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.8,
            }}
          >
            Given: N stored vectors <span style={{ color: C.cyan }}>V</span> = &#123;v<sub>1</sub>, v<sub>2</sub>, ...,
            v<sub>N</sub>&#125;
            <br />
            Given: one query vector <span style={{ color: C.yellow }}>q</span>
            <br />
            Return: the <span style={{ color: C.green }}>k</span> vectors in V most similar to q
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            This is the retrieval problem at the heart of every vector database. k is usually 10 or 20 - we want a
            shortlist, not the whole library.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Now make it one billion
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            With 10 docs, the naive approach - compare the query against every vector - is instant. Real systems have
            millions or billions of vectors. The cost of &quot;check every vector&quot; explodes.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                label: "Toy corpus",
                N: "10",
                context: "This chapter",
                dots: 10,
                time: "~0.01 ms",
                color: C.green,
                lighter: "#80e8a5",
              },
              {
                label: "Wikipedia-scale",
                N: "1,000,000",
                context: "All English Wikipedia articles chunked",
                dots: 60,
                time: "~500 ms",
                color: C.yellow,
                lighter: "#ffe082",
              },
              {
                label: "Internet-scale",
                N: "1,000,000,000",
                context: "Web-scale search index, 1 billion vectors",
                dots: 160,
                time: "~500,000 ms (~8 min)",
                color: C.red,
                lighter: "#ef9a9a",
              },
            ].map(({ label, N, context, dots, time, color, lighter }) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={lighter} bold center size={17}>
                  {label}
                </T>
                <T color={color} bold center size={20} style={{ marginTop: 6, fontFamily: "monospace" }}>
                  N = {N}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    height: 60,
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: 4,
                    padding: 6,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignContent: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  {Array.from({ length: dots }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                  ))}
                </div>
                <T color={C.bright} size={13} center style={{ marginTop: 8 }}>
                  {context}
                </T>
                <T color={color} bold center size={15} style={{ marginTop: 6, fontFamily: "monospace" }}>
                  scan: {time}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 1.8,
            }}
          >
            naive cost = N &middot; d multiplications per query
            <br />
            at N = <span style={{ color: C.red }}>1 billion</span>, d = 1536: ~1.5 trillion multiplies per query
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Checking every vector works for 10 docs. At 1B, it is an 8-minute wait per search. Users expect answers in
            tens of milliseconds.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Where vector search shows up
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The exact same retrieval setup - query vector, big pile of stored vectors, top-k - powers dozens of
            production systems. Once you know the shape, you see it everywhere.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              {
                title: "Semantic search",
                body: 'User types "how to fix leaky faucet". System returns pages about plumbing repair even if those words never appear verbatim.',
              },
              {
                title: "Recommendation",
                body: "Spotify embeds every song. Given your listening history vector, find songs with nearby vectors. Netflix does it for shows, Amazon for products.",
              },
              {
                title: "Image retrieval",
                body: "Upload a photo of a red sneaker. CLIP encodes it, finds catalog images with similar vectors. Reverse image search, visual shopping.",
              },
              {
                title: "Duplicate detection",
                body: "Near-identical images on social platforms, plagiarized paragraphs in documents, duplicate bug reports. Vectors collapse minor differences.",
              },
              {
                title: "Anomaly detection",
                body: "Embed every credit-card transaction. Points far from any cluster are flagged as fraud. Works for network intrusions and medical outliers too.",
              },
              {
                title: "RAG retrieval",
                body: "An LLM is asked a question. Before answering, embed the question, find the top-5 most relevant documents, paste them into context. Grounded answers.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold size={16}>
                  {title}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {body}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Different surfaces, identical plumbing. Every one of these systems runs a top-k nearest-neighbor query over
            a giant bag of vectors.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            A systems problem, not a model problem
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            This shift matters. The earlier sections were about learning - teaching a model to produce good embeddings.
            That work is already done. Now the embeddings exist. Our job is storage, indexing, and retrieval. No
            gradients, no loss functions, no backprop. Just systems design.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                Training time (done)
              </T>
              <T color="#b8a9ff" size={14} center style={{ marginTop: 6 }}>
                The model learned an embedding space.
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.25)",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                forward pass
                <br />
                loss = cross_entropy(...)
                <br />
                backward pass
                <br />
                weights -= lr &middot; grad
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
                Output: a function that maps text to vectors.
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
              <T color={C.red} bold center size={17}>
                Query time (what this section is about)
              </T>
              <T color="#ef9a9a" size={14} center style={{ marginTop: 6 }}>
                We search the space the model built.
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.25)",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                encode query -&gt; q
                <br />
                index.search(q, k=10)
                <br />
                return top-10 docs
                <br />
                &lt; 50 ms per query
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
                The embeddings are fixed inputs. The work is the index.
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
              textAlign: "center",
            }}
          >
            <T color={C.red} bold size={17}>
              This is a systems problem. Not a training problem.
            </T>
            <T color="#ef9a9a" size={15} style={{ marginTop: 6 }}>
              The rest of Section 11 is about storage layouts, index data structures, approximate algorithms, and the
              latency/recall/memory tradeoffs they force.
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
};

// Illustrative cosine similarity scores for the brute-force demonstration in 11.2.
// Values are chosen so the cat-related docs (1, 3, 7 top-3, then 4, 5) rank highest,
// matching the highlighted docs in 11.1's SVG. Real cosines of CAT_CORPUS vectors
// cluster tightly (0.98-1.00 for cat docs); these spread the numbers for visual clarity.
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

export const BruteForceKNN = (ctx) => {
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
              <T color={C.green} bold size={13}>
                Rank
              </T>
              <T color={C.green} bold size={13}>
                Document
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "right" }}>
                cosine(q, v)
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "center" }}>
                top-3?
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
            <T color={C.green} bold size={17}>
              This result is exact
            </T>
            <T color="#80e8a5" size={15} style={{ marginTop: 6 }}>
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
            ops per query = N &middot; d
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
            FLOPS means <b>FLoating-point OPerations per Second</b>. In plain words: how many math steps
            (an add, a multiply, a compare) a chip can do in one second. It is the standard way people
            brag about chip speed.
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
          <svg
            viewBox="0 0 500 170"
            style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}
          >
            <desc>
              A super-fast chef on the left (labeled chef equals chip) stands next to a cutting board with
              chopping marks, connected by a long dashed red arrow labeled slow delivery to a distant
              warehouse on the right (labeled warehouse equals memory). The illustration shows that the
              chef can chop in one second but has to wait ten minutes for each delivery, so fetching the
              ingredients is the real bottleneck, not chopping speed. This is the analogy for why memory
              bandwidth, not FLOPS, limits brute-force search at billion-vector scale.
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
              chops in 1 second
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
              slow delivery
            </text>
            <text x="270" y="92" textAnchor="middle" fontSize="12" fill={C.dim}>
              takes 10 minutes
            </text>

            <polygon points="390,46 430,22 470,46" fill={C.red} opacity="0.85" />
            <rect x="390" y="46" width="80" height="54" rx="3" fill={C.red} opacity="0.7" />
            <rect x="420" y="68" width="20" height="32" fill="#08080d" />
            <text x="430" y="125" textAnchor="middle" fontSize="14" fill={C.bright}>
              warehouse = memory
            </text>
            <text x="430" y="143" textAnchor="middle" fontSize="12" fill={C.dim}>
              holds all the vectors
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
                memory bandwidth
                <br />
                (how fast data arrives)
              </T>
            </div>
          </div>

          <T color="#80deea" size={16} style={{ marginTop: 12, fontStyle: "italic" }}>
            Chopping is lightning-fast. Fetching the next vegetable from the warehouse is the slow part.
            So when we say &quot;the real killer is not FLOPS, it is memory,&quot; we mean: the chip is
            waiting on deliveries, not on math.
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
                read from memory
                <br />
                per single user query
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
                a single DDR5 channel
                <br />
                at peak bandwidth
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
            <T color={C.red} bold size={20}>
              NOT FEASIBLE
            </T>
            <T color="#ef9a9a" size={15} style={{ marginTop: 6 }}>
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
            <T color={C.purple} bold size={17}>
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
              recall@k = <span style={{ color: C.green }}>|approx_topk &cap; true_topk|</span>
              {" / "}
              <span style={{ color: C.yellow }}>k</span>
            </div>
            <T color="#b8a9ff" size={14} style={{ marginTop: 8 }}>
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
                  recall@k:
                </T>
                <T color={C.red} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  1.00
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color="#ef9a9a" size={14}>
                  latency at 1B:
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
              <T color={C.purple} size={12} bold style={{ marginTop: 2 }}>
                production
              </T>
              <T color={C.purple} size={12} bold>
                uses this
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
                  recall@k:
                </T>
                <T color={C.purple} bold size={18} style={{ fontFamily: "monospace" }}>
                  {" "}
                  0.99
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color="#b8a9ff" size={14}>
                  latency at 1B:
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
            <T color={C.purple} bold size={17}>
              The tradeoff is wildly favorable
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
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
};

// Triangle SVG reused in sub=0 (plain) and sub=5 (with directional labels).
// vertices: Recall (top), Latency (bottom-left), Memory (bottom-right).
const Triangle = ({ annotations = [] }) => (
  <svg viewBox="0 0 420 280" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block" }}>
    <desc>
      Equilateral tradeoff triangle with Recall at the top vertex, Latency at the bottom-left vertex, and Memory at the
      bottom-right vertex. Every vector-database decision moves along an edge of this triangle - improving one corner
      trades against another.
    </desc>
    <polygon points="210,30 50,240 370,240" fill="rgba(167,139,250,0.06)" stroke={C.purple} strokeWidth="2" />
    {/* Recall vertex (top) */}
    <circle cx="210" cy="30" r="8" fill={C.cyan} />
    <text x="210" y="20" textAnchor="middle" fill={C.cyan} fontSize="15" fontWeight="bold">
      Recall
    </text>
    {/* Latency vertex (bottom-left) */}
    <circle cx="50" cy="240" r="8" fill={C.orange} />
    <text x="50" y="262" textAnchor="middle" fill={C.orange} fontSize="15" fontWeight="bold">
      Latency
    </text>
    {/* Memory vertex (bottom-right) */}
    <circle cx="370" cy="240" r="8" fill={C.yellow} />
    <text x="370" y="262" textAnchor="middle" fill={C.yellow} fontSize="15" fontWeight="bold">
      Memory
    </text>
    {annotations.map((a, i) => (
      <g key={i}>
        <text x={a.x} y={a.y} textAnchor="middle" fill={a.color} fontSize="12" fontWeight="bold">
          {a.label}
        </text>
      </g>
    ))}
  </svg>
);

export const ThreeWayTradeoff = (ctx) => {
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
            recall@k = <span style={{ color: C.green }}>|ANN_results &cap; true_top_k|</span>
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
                        doc {id}
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
                        doc {row.id}
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
              recall@10 = <span style={{ color: C.green }}>9</span> / <span style={{ color: C.yellow }}>10</span> ={" "}
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
                { p: "P99", val: "80 ms", note: "the tail" },
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
                  <T color={C.orange} bold size={16} style={{ fontFamily: "monospace" }}>
                    {p}
                  </T>
                  <T color={C.bright} bold size={18} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {val}
                  </T>
                  <T color={C.dim} size={13} style={{ marginTop: 2, fontStyle: "italic" }}>
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
              <T color={C.yellow} bold size={13}>
                N
              </T>
              <T color={C.yellow} bold size={13}>
                vectors (3 KB each)
              </T>
              <T color={C.yellow} bold size={13}>
                + HNSW graph (100 B/vec)
              </T>
              <T color={C.yellow} bold size={13}>
                total
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
                srcLabel: "recall up",
                dstArrow: "up",
                dstLabel: "latency up",
                dstColor: C.orange,
                body: "HNSW (a graph-based index we build later in this section) has a knob called ef_search that controls how many candidate nodes to explore per query. Bigger number = more exploration = higher recall, but linearly more work, so latency rises. Typical tuning: ef_search = 200 gives 0.99 recall, ef_search = 50 gives 0.95 recall at 4x the speed.",
              },
              {
                title: "Add PQ compression to shrink memory",
                src: "PQ compression",
                srcColor: C.yellow,
                srcLighter: "#ffe082",
                srcArrow: "down",
                srcLabel: "memory down",
                dstArrow: "down",
                dstLabel: "recall down",
                dstColor: C.cyan,
                body: "Product Quantization replaces each 3 KB vector with ~96 bytes of codebook indices (small integer codes that look up an approximate version of the real vector) - a 32x memory win. But the stored vectors are approximate, so distances are approximate, so recall drops. Typical cost: 0.98 recall becomes 0.94.",
              },
              {
                title: "Add replicas to cut tail latency",
                src: "more replicas / cache",
                srcColor: C.purple,
                srcLighter: "#b8a9ff",
                srcArrow: "down",
                srcLabel: "latency down",
                dstArrow: "up",
                dstLabel: "memory cost up",
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
                    <T color={tr.srcLighter} size={13}>
                      lever
                    </T>
                    <T color={tr.srcColor} bold size={15} style={{ marginTop: 2, fontFamily: "monospace" }}>
                      {tr.src}
                    </T>
                    <T color={tr.srcColor} bold size={14} style={{ marginTop: 4 }}>
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
                    <T color={tr.dstColor} size={13}>
                      cost
                    </T>
                    <T color={tr.dstColor} bold size={15} style={{ marginTop: 2, fontFamily: "monospace" }}>
                      {tr.dstArrow === "up" ? "↑" : "↓"} {tr.dstLabel}
                    </T>
                  </div>
                </div>
                <T color={C.bright} size={14} style={{ marginTop: 10 }}>
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
            <T color={C.green} bold size={17}>
              The triangle is the whole architecture
            </T>
            <T color="#80e8a5" size={15} style={{ marginTop: 6 }}>
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
};

export const DistanceMetrics = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Three ways to measure similarity
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            So far everything has used cosine similarity. In production, three metrics dominate: cosine, L2 (Euclidean
            distance), and inner product (dot product). Each measures a different thing, and picking the right one is
            the first decision a vector database forces on you.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={17}>
                Cosine
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }}>
                (q &middot; d) / (||q|| ||d||)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }}>
                Angle between the vectors. Ignores magnitude.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                textAlign: "center",
              }}
            >
              <T color={C.blue} bold center size={17}>
                L2 (Euclidean)
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }}>
                √(Σ (q<sub>i</sub> - d<sub>i</sub>)²)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }}>
                Straight-line distance. Smaller is closer.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={17}>
                Inner product
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }}>
                q &middot; d = Σ q<sub>i</sub> &middot; d<sub>i</sub>
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }}>
                Raw dot product. No normalization, no sqrt.
              </T>
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Same corpus, same query - different metrics can rank the documents differently. Which metric you pick is a
            statement about what &quot;similar&quot; means for your embeddings.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Cosine: the angle between vectors
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Cosine similarity measures the angle between two vectors, ignoring how long they are. Two vectors that point
            the same direction score 1.0 no matter their magnitudes. Vectors at 90 degrees score 0. Pointing opposite
            directions scores -1.
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
            }}
          >
            cos(q, d) = <span style={{ color: C.green }}>(q &middot; d) / (||q|| &middot; ||d||)</span>
            <div style={{ marginTop: 6, fontSize: 15, color: C.dim }}>range: [-1, 1]</div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Angle picture
              </T>
              <svg
                viewBox="0 0 260 220"
                style={{ width: "100%", maxWidth: 260, height: "auto", display: "block", margin: "8px auto 0" }}
              >
                <desc>
                  Two vectors drawn from the origin - a cyan query vector and a green document vector - with a small
                  angle theta between them labeled. The tight angle illustrates that cosine similarity near 1.0 means
                  the vectors point almost the same way.
                </desc>
                <defs>
                  <marker
                    id="arrow11-4"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.bright} />
                  </marker>
                </defs>
                <line x1="30" y1="190" x2="220" y2="40" stroke={C.cyan} strokeWidth="2.5" markerEnd="url(#arrow11-4)" />
                <line
                  x1="30"
                  y1="190"
                  x2="230"
                  y2="80"
                  stroke={C.green}
                  strokeWidth="2.5"
                  markerEnd="url(#arrow11-4)"
                />
                <path d="M 80 160 A 55 55 0 0 1 90 145" stroke={C.yellow} strokeWidth="2" fill="none" />
                <text x="100" y="165" fill={C.yellow} fontSize="14">
                  θ
                </text>
                <text x="225" y="35" fill={C.cyan} fontSize="13" fontWeight="bold">
                  q
                </text>
                <text x="235" y="85" fill={C.green} fontSize="13" fontWeight="bold">
                  d
                </text>
                <circle cx="30" cy="190" r="3" fill={C.bright} />
                <text x="10" y="208" fill={C.dim} fontSize="11">
                  origin
                </text>
              </svg>
              <T color="#80e8a5" size={13} style={{ marginTop: 6 }}>
                Small angle θ means cos(θ) is close to 1.0.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Concrete values on our corpus
              </T>
              <T color="#80e8a5" size={13} center style={{ marginTop: 4 }}>
                Query q = {fmtVec(QUERY.vec)}
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { doc: "doc 1 (Cats are small...)", cos: "0.9993", color: C.green },
                  { doc: "doc 7 (Kittens grow up to be cats)", cos: "0.9984", color: C.green },
                  { doc: "doc 10 (Fish live underwater)", cos: "0.6229", color: C.yellow },
                  { doc: "doc 6 (Python is a prog. lang)", cos: "0.3554", color: C.red },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px",
                      gap: 8,
                      padding: "5px 8px",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.3)",
                      alignItems: "center",
                    }}
                  >
                    <T color={C.bright} size={13}>
                      {row.doc}
                    </T>
                    <T color={row.color} size={13} bold style={{ fontFamily: "monospace", textAlign: "right" }}>
                      {row.cos}
                    </T>
                  </div>
                ))}
              </div>
              <T color="#80e8a5" size={12} style={{ marginTop: 8, fontStyle: "italic" }}>
                Cat docs hug 1.0, random docs slide toward 0.
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            For text embeddings - SBERT, OpenAI, Cohere - cosine is the default. These models are trained so that
            semantic similarity shows up in the angle, not the length.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            L2: straight-line distance
          </T>
          <T color="#7cc4ff" style={{ marginTop: 8 }}>
            L2 distance (also called Euclidean) is the straight-line distance between two points. Pythagoras, but in d
            dimensions. Unlike cosine, L2 cares about magnitude - two vectors with the same direction but different
            lengths are far apart.
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
            }}
          >
            L2(q, d) ={" "}
            <span style={{ color: C.blue }}>
              √( Σ<sub>i</sub> (q<sub>i</sub> - d<sub>i</sub>)² )
            </span>
            <div style={{ marginTop: 6, fontSize: 15, color: C.dim }}>
              smaller is closer (it is a distance, not a similarity)
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                textAlign: "center",
              }}
            >
              <T color={C.blue} bold center size={15}>
                Pythagoras in 2D
              </T>
              <svg
                viewBox="0 0 260 220"
                style={{ width: "100%", maxWidth: 260, height: "auto", display: "block", margin: "8px auto 0" }}
              >
                <desc>
                  Right triangle with two points q and d in 2D, a horizontal leg labeled as the x-axis difference, a
                  vertical leg labeled as the y-axis difference, and the hypotenuse highlighted as the L2 distance equal
                  to the square root of the sum of squared differences.
                </desc>
                <line x1="40" y1="170" x2="200" y2="170" stroke={C.yellow} strokeWidth="2" strokeDasharray="5,3" />
                <line x1="200" y1="170" x2="200" y2="50" stroke={C.yellow} strokeWidth="2" strokeDasharray="5,3" />
                <line x1="40" y1="170" x2="200" y2="50" stroke={C.blue} strokeWidth="3" />
                <circle cx="40" cy="170" r="5" fill={C.cyan} />
                <circle cx="200" cy="50" r="5" fill={C.green} />
                <text x="22" y="185" fill={C.cyan} fontSize="14" fontWeight="bold">
                  q
                </text>
                <text x="206" y="45" fill={C.green} fontSize="14" fontWeight="bold">
                  d
                </text>
                <text x="120" y="188" fill={C.yellow} fontSize="12">
                  (q₁ - d₁)
                </text>
                <text x="205" y="112" fill={C.yellow} fontSize="12">
                  (q₂ - d₂)
                </text>
                <text x="80" y="100" fill={C.blue} fontSize="13" fontWeight="bold">
                  L2
                </text>
              </svg>
              <T color="#7cc4ff" size={13} style={{ marginTop: 6 }}>
                Two legs squared, sum, take sqrt. Same trick scales to d=768.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
              }}
            >
              <T color={C.blue} bold center size={15}>
                Concrete values on our corpus
              </T>
              <T color="#7cc4ff" size={13} center style={{ marginTop: 4 }}>
                Query q = {fmtVec(QUERY.vec)}
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { doc: "doc 1 (Cats are small...)", l2: "0.047", color: C.green },
                  { doc: "doc 7 (Kittens grow up to be cats)", l2: "0.057", color: C.green },
                  { doc: "doc 10 (Fish live underwater)", l2: "0.922", color: C.yellow },
                  { doc: "doc 6 (Python is a prog. lang)", l2: "1.228", color: C.red },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px",
                      gap: 8,
                      padding: "5px 8px",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.3)",
                      alignItems: "center",
                    }}
                  >
                    <T color={C.bright} size={13}>
                      {row.doc}
                    </T>
                    <T color={row.color} size={13} bold style={{ fontFamily: "monospace", textAlign: "right" }}>
                      {row.l2}
                    </T>
                  </div>
                ))}
              </div>
              <T color="#7cc4ff" size={12} style={{ marginTop: 8, fontStyle: "italic" }}>
                Cat docs are closest (smallest L2), random docs are far.
              </T>
            </div>
          </div>
          <T color="#7cc4ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Magnitude matters. Some vision embeddings encode confidence or saliency in the vector&apos;s length, and L2
            keeps that signal. Face embeddings and image retrieval systems often live in L2 land.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Inner product: the fastest of all
          </T>
          <T color="#ffcc99" style={{ marginTop: 8 }}>
            Inner product is the raw dot product - just multiply component-wise and add. No normalization, no sqrt, no
            division. A CPU can do hundreds of dot products per microsecond using SIMD instructions that fuse
            multiply-and-add into a single op. This is the fastest similarity you can compute.
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
            }}
          >
            q &middot; d ={" "}
            <span style={{ color: C.orange }}>
              Σ<sub>i</sub> q<sub>i</sub> &middot; d<sub>i</sub>
            </span>
            <div style={{ marginTop: 6, fontSize: 15, color: C.dim }}>range: unbounded (depends on magnitudes)</div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
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
              <T color={C.green} bold center size={15}>
                Inner product (d = 768)
              </T>
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 14, color: C.bright, lineHeight: 1.8 }}>
                <div>768 multiplies</div>
                <div>767 adds</div>
                <div style={{ color: C.dim }}>----------</div>
                <div style={{ color: C.green, fontWeight: "bold" }}>~1535 FLOPs</div>
              </div>
              <T color={C.green} size={13} style={{ marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
                One fused multiply-add per pair. SIMD does 8 at a time.
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
                Cosine (d = 768)
              </T>
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 14, color: C.bright, lineHeight: 1.8 }}>
                <div>768 multiplies (q &middot; d)</div>
                <div>1536 mults (||q||, ||d||)</div>
                <div>2 sqrt calls</div>
                <div>1 divide</div>
                <div style={{ color: C.dim }}>----------</div>
                <div style={{ color: C.red, fontWeight: "bold" }}>~4600 FLOPs + 2 sqrt + 1 div</div>
              </div>
              <T color={C.red} size={13} style={{ marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
                3x more math, plus expensive sqrt and divide.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold size={15}>
              At billions of vectors, that 3x difference is the difference between 100 ms and 300 ms per query.
            </T>
            <T color="#ffcc99" size={14} style={{ marginTop: 6 }}>
              Inner product wins by being stripped to the bone. No sqrt, no divide, no branch - just a tight loop of
              multiply-add that GPU and CPU SIMD units love.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            When vectors are L2-normalized, all three are equivalent
          </T>
          <T color="#ffe066" style={{ marginTop: 8 }}>
            Here is the identity that production systems exploit every day. If you divide every vector by its own length
            so that ||q|| = ||d|| = 1, then cosine, inner product, and L2 all rank documents in the same order.
            Normalize once at ingest, then use the fastest metric - inner product - forever after.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Cosine
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }}>
                (q &middot; d) / (||q|| ||d||)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                with ||q|| = ||d|| = 1
              </T>
              <T color={C.green} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }}>
                = q &middot; d
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                Inner product
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }}>
                q &middot; d
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                already bounded in [-1, 1]
              </T>
              <T color={C.orange} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }}>
                = q &middot; d
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                textAlign: "center",
              }}
            >
              <T color={C.blue} bold center size={15}>
                L2 squared
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }}>
                ||q||² + ||d||² - 2(q &middot; d)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                = 1 + 1 - 2(q &middot; d)
              </T>
              <T color={C.blue} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }}>
                = 2 - 2(q &middot; d)
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={17}>
              All three collapse to the same ranking
            </T>
            <T color="#ffe066" size={15} style={{ marginTop: 6, fontFamily: "monospace" }}>
              max cos(q, d) = max (q &middot; d) = min L2(q, d)
            </T>
            <T color="#ffe066" size={14} style={{ marginTop: 8, fontStyle: "italic" }}>
              Larger inner product = closer in L2 = higher cosine. The sort order is identical.
            </T>
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
              Concrete check: our query and doc 1
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                lineHeight: 1.7,
              }}
            >
              <div>
                <T color={C.dim} size={13}>
                  before normalization
                </T>
                <div>q = [0.85, 0.14, 0.44, 0.21]</div>
                <div>d = [0.81, 0.12, 0.45, 0.22]</div>
                <div>||q|| = 0.9898</div>
                <div>||d|| = 0.9599</div>
                <div>q &middot; d = 0.9495</div>
                <div>cos = 0.9993</div>
              </div>
              <div>
                <T color={C.dim} size={13}>
                  after normalization
                </T>
                <div>q&apos; = [0.8587, 0.1414, 0.4445, 0.2122]</div>
                <div>d&apos; = [0.8438, 0.1250, 0.4688, 0.2292]</div>
                <div>||q&apos;|| = 1.0000</div>
                <div>||d&apos;|| = 1.0000</div>
                <div style={{ color: C.yellow }}>q&apos; &middot; d&apos; = 0.9993</div>
                <div style={{ color: C.yellow }}>= cosine</div>
              </div>
            </div>
          </div>
          <T color="#ffe066" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Normalize once at ingest. Store unit vectors. Use inner product forever. Every major vector database -
            FAISS, Pinecone, Weaviate - lets you do exactly this, and it is the hot path on modern hardware.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Which metric for which workload
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Pick the metric to match how the embedding model was trained. Text models are trained with cosine loss; some
            vision models encode magnitude deliberately; and for any model whose outputs live on a unit sphere, inner
            product is a free speedup.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr 2fr",
                gap: 10,
                padding: "8px 12px",
                borderBottom: `1px solid ${C.purple}20`,
              }}
            >
              <T color={C.purple} bold size={14}>
                Embedding family
              </T>
              <T color={C.purple} bold center size={14}>
                Metric
              </T>
              <T color={C.purple} bold size={14}>
                Why
              </T>
            </div>
            {[
              {
                family: "Text embeddings",
                models: "SBERT, OpenAI text-embedding-3, Cohere",
                metric: "cosine",
                metricColor: C.green,
                why: "Trained with cosine-similarity loss. Magnitude carries no signal - only the direction does.",
              },
              {
                family: "Vision / face embeddings",
                models: "FaceNet, some CNN retrieval heads",
                metric: "L2",
                metricColor: C.blue,
                why: "Length can encode confidence, saliency, or image quality. L2 preserves those magnitude differences.",
              },
              {
                family: "Pre-normalized anything",
                models: "any model after ||v|| = 1 at ingest",
                metric: "inner product",
                metricColor: C.orange,
                why: "Fastest possible similarity. Same ranking as cosine, no sqrt or divide in the hot loop.",
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 1fr 2fr",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 6,
                  marginTop: 6,
                  background: "rgba(0,0,0,0.3)",
                  alignItems: "center",
                }}
              >
                <div>
                  <T color={C.bright} bold size={14}>
                    {row.family}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 2 }}>
                    {row.models}
                  </T>
                </div>
                <T color={row.metricColor} bold center size={15} style={{ fontFamily: "monospace" }}>
                  {row.metric}
                </T>
                <T color={C.bright} size={13}>
                  {row.why}
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
            <T color={C.green} bold size={16}>
              The production default
            </T>
            <T color="#80e8a5" size={15} style={{ marginTop: 6 }}>
              For text embeddings from SBERT, OpenAI, or Cohere - normalize at ingest, store unit vectors, use inner
              product at query time. Same recall as cosine, but the ranking loop is the fastest code your hardware can
              run.
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
};

// Three k-means clusters used across 11.5 IVF visuals.
// Cluster A holds the 5 cat-related docs; B holds the two dog docs; C holds birds/fish/python.
const IVF_CLUSTERS = [
  { id: "A", color: C.purple, light: "#b8a9ff", centroid: { x: 125, y: 125 }, docs: [1, 3, 4, 5, 7], label: "cats" },
  { id: "B", color: C.yellow, light: "#ffe082", centroid: { x: 345, y: 97 }, docs: [2, 8], label: "dogs" },
  { id: "C", color: C.cyan, light: "#80deea", centroid: { x: 390, y: 240 }, docs: [6, 9, 10], label: "other" },
];

const docCluster = (docId) => IVF_CLUSTERS.find((c) => c.docs.includes(docId));

// Small scatter SVG used in sub=0 through sub=3 of 11.5 and reused in 11.6/11.8/11.9.
// Variant controls what's drawn (clusters, cells, probe arrows). Kept local to this file
// because the rendering concerns are IVF-specific and we do not want to expand components.jsx.
const IVFScatter = ({
  variant, // "bare" | "clustered" | "cells" | "probe"
  nprobe = 1,
  desc,
  showQuery = true,
  highlightTopK = false,
}) => {
  const probedClusters = IVF_CLUSTERS.slice(0, nprobe).map((c) => c.id);
  return (
    <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      {/* Cell polygons (approximate Voronoi) */}
      {(variant === "cells" || variant === "probe") &&
        IVF_CLUSTERS.map((cl) => {
          const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
          const fill = isProbed ? `${cl.color}12` : `${cl.color}04`;
          const stroke = isProbed ? `${cl.color}55` : `${cl.color}22`;
          const rectBounds = {
            A: { x: 25, y: 25, w: 210, h: 145 },
            B: { x: 235, y: 25, w: 145, h: 145 },
            C: { x: 235, y: 170, w: 245, h: 140 },
          }[cl.id];
          const leftover = cl.id === "A" ? { x: 25, y: 170, w: 210, h: 140 } : null;
          return (
            <g key={cl.id}>
              <rect {...rectBounds} fill={fill} stroke={stroke} strokeDasharray="4 4" />
              {leftover && <rect {...leftover} fill={fill} stroke={stroke} strokeDasharray="4 4" />}
            </g>
          );
        })}
      {/* Arrows from query to every dot for bare brute-force view.
          Both endpoints inset past the circle radii so the line stops visibly short
          of the node edge. Doc circles are opaque, so any portion of a line that
          would cross another node is hidden behind the node's fill. */}
      {variant === "bare" &&
        Object.entries(CORPUS_XY).map(([id, p]) => {
          const dx = p.x - QUERY_XY.x;
          const dy = p.y - QUERY_XY.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const qr = 11; // query radius (8) + 3 visible gap
          const pr = 13; // doc radius (10) + 3 visible gap
          return (
            <line
              key={id}
              x1={QUERY_XY.x + ux * qr}
              y1={QUERY_XY.y + uy * qr}
              x2={p.x - ux * pr}
              y2={p.y - uy * pr}
              stroke={C.red}
              strokeWidth="1"
              strokeOpacity="0.55"
            />
          );
        })}
      {/* Arrow from query to nearest centroid for probe view.
          Endpoints inset past the query circle and the centroid square so the arrow
          is entirely between them and clearly visible as a standalone element. */}
      {variant === "probe" &&
        (() => {
          const cx = IVF_CLUSTERS[0].centroid.x;
          const cy = IVF_CLUSTERS[0].centroid.y;
          const dx = cx - QUERY_XY.x;
          const dy = cy - QUERY_XY.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const qr = 11; // query circle radius + gap
          const sr = 14; // centroid square half + gap
          return (
            <>
              <defs>
                <marker
                  id="ivfProbeArrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 8 4, 0 8" fill={C.orange} />
                </marker>
              </defs>
              <line
                x1={QUERY_XY.x + ux * qr}
                y1={QUERY_XY.y + uy * qr}
                x2={cx - ux * sr}
                y2={cy - uy * sr}
                stroke={C.orange}
                strokeWidth="1.8"
                markerEnd="url(#ivfProbeArrow)"
              />
            </>
          );
        })()}
      {/* Doc dots, colored per variant. Bare-variant uses an OPAQUE dark fill so
          the brute-force lines cannot visually pass through any node. */}
      {Object.entries(CORPUS_XY).map(([id, p]) => {
        const cl = docCluster(Number(id));
        const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
        let fill = "#12121a"; // opaque, slightly lighter than page bg
        let stroke = "rgba(255,255,255,0.65)";
        let isBare = variant === "bare";
        if (variant === "clustered" || variant === "cells" || variant === "probe") {
          fill = isProbed ? cl.color : `${cl.color}33`;
          stroke = isProbed ? cl.color : `${cl.color}55`;
        }
        if (highlightTopK && [1, 3, 7].includes(Number(id)) && variant === "probe") {
          fill = C.green;
          stroke = C.green;
        }
        return (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r={10} fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill={isBare ? "rgba(255,255,255,0.95)" : "#08080d"}
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        );
      })}
      {/* Centroid squares for clustered and later */}
      {(variant === "clustered" || variant === "cells" || variant === "probe") &&
        IVF_CLUSTERS.map((cl) => {
          const isProbed = variant !== "probe" || probedClusters.includes(cl.id);
          const fill = isProbed ? cl.color : `${cl.color}55`;
          return (
            <g key={cl.id}>
              <rect
                x={cl.centroid.x - 10}
                y={cl.centroid.y - 10}
                width="20"
                height="20"
                fill={fill}
                stroke="#08080d"
                strokeWidth="2"
              />
              <text
                x={cl.centroid.x}
                y={cl.centroid.y + 4}
                textAnchor="middle"
                fill="#08080d"
                fontSize="11"
                fontWeight="bold"
              >
                {cl.id}
              </text>
            </g>
          );
        })}
      {/* Query dot */}
      {showQuery && (
        <g>
          <circle cx={QUERY_XY.x} cy={QUERY_XY.y} r={8} fill={C.yellow} stroke={C.yellow} />
          <text
            x={QUERY_XY.x}
            y={QUERY_XY.y - 12}
            textAnchor="middle"
            fill={C.yellow}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            query
          </text>
        </g>
      )}
    </svg>
  );
};

export const IVF = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Brute force touches every vector
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Brute force is correct but slow because it reads every single stored vector for every query. Here are our
            10 cat-corpus docs in a 2D view, with the query in the middle and an arrow from the query to every vector.
            Nothing is skipped.
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
            <IVFScatter
              variant="bare"
              desc="Scatter plot of the 10 cat-corpus documents with the query vector at the center. Faint red lines fan out from the query to every document, showing that brute-force kNN compares the query to every vector."
            />
            <T color={C.dim} size={14} center style={{ marginTop: 6, fontStyle: "italic" }}>
              Every line is a distance computation. At N = 10 this is nothing; at N = 1 billion it balloons to the
              3 TB of scans per query that brute force cannot afford.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            brute force: read every vector, every query
            <br />
            cost = N &middot; d per query
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The IVF trick is simple in hindsight: group the vectors ahead of time so at query time we only look inside
            the group the query landed in.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cluster the corpus with k-means
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before we accept any queries, run k-means on the stored vectors. Pick the number of clusters nlist = 3 and
            let the algorithm find three centroids that minimize the average distance from each doc to its closest
            centroid. Each doc gets assigned to exactly one cluster.
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
            <IVFScatter
              variant="clustered"
              desc="The same 10 docs colored by cluster after k-means with nlist = 3. Purple centroid A sits in the cat-doc cluster, yellow centroid B in the dog-doc group, and cyan centroid C in the birds and fish group. Each doc inherits its cluster color."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {IVF_CLUSTERS.map((cl) => (
              <div
                key={cl.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${cl.color}06`,
                  border: `1px solid ${cl.color}12`,
                }}
              >
                <T color={cl.light} bold center size={15}>
                  Cluster {cl.id} - {cl.label}
                </T>
                <T color={C.bright} size={13} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  docs {cl.docs.join(", ")}
                </T>
                <T color={cl.color} size={12} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  centroid ({cl.centroid.x}, {cl.centroid.y})
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            nlist is a tuning knob. Small nlist means few large clusters; large nlist means many tiny clusters. 3 is
            drawable; production picks roughly sqrt(N).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Voronoi cells: every doc belongs to exactly one cell
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Draw the region of space closer to centroid A than to any other centroid. That is centroid A&apos;s Voronoi
            cell. Repeat for B and C and the whole plane is divided into three cells. Every stored doc sits in exactly
            one cell, and the cell it sits in is its cluster assignment.
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
            <IVFScatter
              variant="cells"
              desc="Voronoi cells drawn as dashed colored rectangles behind the 10 docs, showing the region of space that each centroid owns. Every doc belongs to exactly one cell."
            />
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
            <T color={C.green} bold center size={17}>
              Heads up: four names, one thing
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
              IVF papers and code swap these words as if they are interchangeable, because they are. All four describe
              the same group of docs from a different angle:
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
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>cluster</div>
                The k-means view. &quot;These docs landed near the same centroid.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>cell (Voronoi cell)</div>
                The geometric view. &quot;The region of space closer to centroid A than any other.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>partition</div>
                The set-theory view. &quot;The dataset split into nlist disjoint groups, every doc in exactly one.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>posting list (inverted list)</div>
                The storage view. &quot;The on-disk array of doc IDs assigned to centroid A.&quot; This is why it is
                called an Inverted File index.
              </div>
            </div>
            <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
              One centroid owns one cell owns one cluster owns one posting list. Centroid = representative. Cell =
              territory. Cluster = group. Posting list = the stored IDs.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The cell formula and what IVF stores
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            One short formula decides which cell a point falls into, and one tiny pair of tables is everything IVF keeps
            on disk.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 15, color: C.bright }}>
              cell(p) = argmin over i of &#124;&#124;p &minus; centroid<sub>i</sub>&#124;&#124;
            </div>
            <div style={{ fontSize: 14, color: "#80e8a5", marginTop: 4 }}>
              In words: cell of point p is the index of the closest centroid. ||p &minus; centroid<sub>i</sub>|| is the
              distance from p to centroid i; argmin picks the i that makes that distance smallest.
            </div>
            <div style={{ height: 10 }} />
            <div style={{ fontFamily: "monospace", fontSize: 15, color: C.bright }}>
              every doc: cluster assignment fixed after training
            </div>
            <div style={{ fontSize: 14, color: "#80e8a5", marginTop: 4 }}>
              &quot;Training&quot; here is the k-means step that picked the centroids. Once it ends, every doc gets its
              cell label written down once and that label is frozen. New queries do not move docs around; they only
              choose which cell to scan. Assignments only change if you retrain the centroids later.
            </div>
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
            <T color={C.green} bold center size={17}>
              What IVF actually stores on disk
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
              The dashed cell polygons in the previous step are just for teaching - they help you picture the partition.
              Real IVF code never builds those shapes. It stores only two tiny things:
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
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: "#80e8a5", marginBottom: 4 }}>1. centroid list</div>
                A: [1.3, 1.1]
                <br />
                B: [3.1, 1.0]
                <br />
                C: [3.5, 2.3]
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: "#80e8a5", marginBottom: 4 }}>2. inverted file (posting lists)</div>
                A → [1, 3, 4, 5, 7]
                <br />
                B → [2, 8]
                <br />
                C → [6, 9, 10]
              </div>
            </div>
            <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
              That is it - no polygons, no boundary geometry. The boundaries are implicit: any time you need to know
              which cell a point falls into, run the argmin formula above on the fly. The centroids alone fully define
              the partition.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            nprobe = 1: probe only the nearest cell
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            A query arrives. Compute the distance from the query to each of the nlist centroids - just 3 distances, not
            10. Pick the nearest centroid and scan only the docs inside its cell. The other 2 cells are skipped
            entirely. This is how IVF buys its speedup.
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
            <IVFScatter
              variant="probe"
              nprobe={1}
              desc="Query vector with an orange arrow pointing at centroid A, the nearest centroid. Cluster A's docs are highlighted while clusters B and C are dimmed, showing that only cluster A's docs are scanned when nprobe = 1."
              highlightTopK
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold size={15}>
                Work with nprobe = 1
              </T>
              <T color="#ffcc80" bold size={22} style={{ marginTop: 6, fontFamily: "monospace" }}>
                3 + 5 = 8 dot products
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                3 to pick the nearest centroid, 5 to scan cluster A
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={15}>
                Brute force
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 6, fontFamily: "monospace" }}>
                10 dot products
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                scan every doc every query
              </T>
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            At N = 10, 8 vs 10 looks tiny. At N = 1M with nlist = 1000, IVF at nprobe = 1 scans about N/1000 = 1000 docs
            instead of a million. That is a thousand-times speedup, and it is where IVF earns its keep.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            nprobe is the recall-latency knob
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            nprobe = 1 is fastest but fragile: if the true neighbor sits just across a cell boundary, the probe misses
            it. Raising nprobe tells IVF to scan the top-nprobe closest cells, not just the closest one. More cells
            scanned means higher recall and higher latency - a direct move on the tradeoff triangle.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { nprobe: 1, label: "probe 1 cell", ratio: "1/3 of corpus" },
              { nprobe: 2, label: "probe 2 cells", ratio: "2/3 of corpus" },
              { nprobe: 3, label: "probe all cells", ratio: "full corpus" },
            ].map((v) => (
              <div
                key={v.nprobe}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.yellow} bold center size={15} style={{ fontFamily: "monospace" }}>
                  nprobe = {v.nprobe}
                </T>
                <div style={{ marginTop: 6 }}>
                  <IVFScatter
                    variant="probe"
                    nprobe={v.nprobe}
                    showQuery
                    desc={`IVF scatter with nprobe = ${v.nprobe}; ${v.label}.`}
                  />
                </div>
                <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                  {v.ratio}
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
              Measured recall and cost at a realistic scale (N = 1M, nlist = 1000)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.yellow} bold size={13}>
                nprobe
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                recall@10
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                docs scanned
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                latency vs brute
              </T>
              {[
                { n: 1, recall: "0.80", scanned: "1,000", speed: "1000x" },
                { n: 4, recall: "0.93", scanned: "4,000", speed: "250x" },
                { n: 8, recall: "0.97", scanned: "8,000", speed: "125x" },
                { n: 32, recall: "0.995", scanned: "32,000", speed: "31x" },
              ].flatMap((row) => [
                <T key={`n-${row.n}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                  {row.n}
                </T>,
                <T
                  key={`r-${row.n}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`s-${row.n}`}
                  color={C.bright}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.scanned}
                </T>,
                <T
                  key={`v-${row.n}`}
                  color={C.yellow}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.speed}
                </T>,
              ])}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            nprobe is the single most important IVF knob. Pick it to hit your recall target, then accept the latency
            that comes with it.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Sizing IVF in production
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Two rules of thumb cover 90 percent of IVF deployments. Pick nlist to keep each cell small enough that
            scanning it is fast, and pick nprobe from a recall curve measured on your own data.
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
            nlist &asymp; &radic;N <span style={{ color: C.dim }}>(FAISS default rule)</span>
            <br />N = 1,000,000 &rarr; sqrt(N) &asymp; 1000 &rarr; FAISS rounds up to{" "}
            <span style={{ color: C.purple }}>4096</span>
            <br />N = 100,000,000 &rarr; sqrt(N) &asymp; 10,000 &rarr; <span style={{ color: C.purple }}>32,768</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                nprobe = 8
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                A sensible starting point that typically reaches 97% recall on text embeddings. Raise to 16 or 32 for
                recall-critical workloads, drop to 4 or less when latency is tight.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                Memory overhead
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Each centroid is d=768 float32 numbers = 3 KB, so nlist centroids cost nlist &middot; 3 KB. At
                nlist=4096 that is 12 MB total, negligible next to the vector dataset itself.
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
            <T color={C.purple} bold size={17}>
              The tradeoff IVF makes
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              IVF trades a tiny bit of recall (docs near cell boundaries can be missed) and a fixed one-time clustering
              cost for a massive per-query speedup. Memory overhead is trivial. This is why IVF is the FAISS default for
              million-scale static corpora.
            </T>
          </div>
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

export const ANNFamilyTree = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            We need sub-linear search at scale
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Brute force at 1 billion vectors melts down because it touches every single stored vector for every query -
            a linear cost in N. To make queries fast at billion scale, the algorithm has to skip most of the corpus. The
            target is sub-linear: growing with something much slower than N, like log N or sqrt(N).
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
            <span style={{ color: C.red }}>brute force</span>: cost &prop; N &middot; d{"  "}
            <span style={{ color: C.dim }}>(linear)</span>
            <br />
            <span style={{ color: C.green }}>goal</span>: cost &prop; log(N) &middot; d{"  "}
            <span style={{ color: C.dim }}>(sub-linear, often O(log N))</span>
            <br />
            at N = 1,000,000,000: linear is a billion ops, log N is about 30 ops
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Four families of algorithms have tried to deliver this. Three of them had their moment and lost. One family
            won. The rest of this chapter is the family tree.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Trees: beautiful at d = 2, broken at d = 768
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            The KD-tree partitions space by alternating axis splits - split on x at the median, then y at the median of
            each half, then x again, recursively. At d = 2 with 10 docs, it gives a clean log N search. At high
            dimensions it collapses: the curse of dimensionality erases the partitioning&apos;s advantage.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                d = 2 (drawable): KD-tree shines
              </T>
              <svg viewBox="0 0 200 160" style={{ width: "100%", height: "auto", display: "block", marginTop: 6 }}>
                <desc>
                  KD-tree recursive partition of a 2D point cloud: vertical split down the middle, horizontal splits in
                  each half, one more vertical split in a quadrant. Illustrates clean log N partitioning at low
                  dimensions.
                </desc>
                <rect x="8" y="8" width="184" height="144" fill="none" stroke={C.orange} strokeWidth="1" />
                <line x1="100" y1="8" x2="100" y2="152" stroke={C.orange} strokeWidth="1.5" />
                <line x1="8" y1="80" x2="100" y2="80" stroke={C.orange} strokeWidth="1.5" />
                <line x1="100" y1="60" x2="192" y2="60" stroke={C.orange} strokeWidth="1.5" />
                <line x1="150" y1="60" x2="150" y2="152" stroke={C.orange} strokeWidth="1.5" />
                {[
                  [35, 40],
                  [60, 110],
                  [25, 130],
                  [120, 30],
                  [170, 90],
                  [130, 120],
                  [180, 140],
                  [80, 20],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill={C.orange} />
                ))}
              </svg>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                Each split halves the search region. log(10) steps to find the neighbor.
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
                d = 768 (real): the curse of dimensionality
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.9,
                  textAlign: "center",
                }}
              >
                <span style={{ color: C.red }}>high dim</span>: almost every pair
                <br />
                sits at a similar distance
                <br />
                &rarr; partitions lose meaning
                <br />
                &rarr; KD-tree scans almost all nodes
              </div>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                At d = 768 typical for BERT/OpenAI embeddings, KD-trees degrade to brute force.
              </T>
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Ball trees, M-trees, cover trees, VP-trees all share the same fate. Space-partitioning trees are the wrong
            tool for high-dimensional dense vectors.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            LSH: hash similar vectors to the same bucket
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Locality-Sensitive Hashing (LSH) picks a few random hyperplanes through the embedding space. Each vector
            gets a bit for each hyperplane: 1 if it falls on the positive side, 0 if on the negative. The resulting bit
            string is a hash code, and vectors close in space tend to share most bits.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                Three random hyperplanes cut the space
              </T>
              <svg viewBox="0 0 220 180" style={{ width: "100%", height: "auto", display: "block", marginTop: 6 }}>
                <desc>
                  Two-dimensional space with three random hyperplane lines slicing across it. Vectors sitting in the
                  same intersection of half-planes receive the same 3-bit LSH hash code.
                </desc>
                <rect x="8" y="8" width="204" height="164" fill="none" stroke={C.yellow} strokeWidth="1" />
                <line x1="20" y1="40" x2="210" y2="140" stroke={C.yellow} strokeWidth="1.5" />
                <line x1="30" y1="160" x2="200" y2="30" stroke={C.yellow} strokeWidth="1.5" />
                <line x1="60" y1="10" x2="170" y2="170" stroke={C.yellow} strokeWidth="1.5" />
                {[
                  [85, 55, "011"],
                  [105, 80, "011"],
                  [150, 110, "100"],
                  [50, 140, "001"],
                ].map(([x, y, code], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill={C.yellow} />
                    <text x={x + 7} y={y + 3} fill={C.bright} fontSize="10" fontFamily="monospace">
                      {code}
                    </text>
                  </g>
                ))}
              </svg>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                Each region is one hash bucket; similar vectors land in the same bucket.
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
                The catch: recall sags at high d
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                To hit 95% recall on 768-dim data, LSH needs many hash tables (often 50-100) and each table holds long
                hash codes. That pushes memory back up and erodes the speed advantage. Graph indexes beat LSH on the
                same recall target with much less memory.
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            LSH had its moment in the 2000s. Modern production systems rarely reach for it - the follow-up work on
            graphs turned out to be simpler and more accurate.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Clustering (IVF): partition the space, probe the nearest cell
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            IVF (Inverted File Index) does partition-and-probe: cluster the corpus into nlist Voronoi
            cells ahead of time, and at query time scan only the nprobe nearest cells. Cheap to build, easy to update,
            decent recall at nprobe = 8 to 32. Its weakness is neighbors that sit just across a cell boundary - the
            partition hides them from the probe.
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
            <IVFScatter
              variant="probe"
              nprobe={1}
              desc="Small IVF recap: three Voronoi cells; query probes the nearest one. Recap visual for the ANN family-tree chapter."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Strengths
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                Low memory overhead, fast to rebuild, trivial to add or remove docs. Production default for huge static
                corpora when paired with PQ compression.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Weaknesses
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                Recall cliffs at cell boundaries, needs nprobe tuning per workload, struggles with mixed distributions
                where k-means produces unbalanced cells.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Graphs: navigate the metric space directly
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            A graph index stores the corpus as a proximity graph: every vector is a node, every edge connects a vector
            to one of its nearest neighbors. At query time, we start somewhere in the graph and greedily hop to
            whichever neighbor is closer to the query. Each hop drops the distance. A well-built graph reaches the true
            top-k in roughly log N hops.
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
            <svg viewBox="0 0 500 310" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
              <desc>
                Proximity graph of the 10 cat-corpus documents with edges connecting each node to its two or three
                nearest neighbors. A highlighted green path traces a search from a starting node in the lower-right
                across several hops to the cat cluster in the upper-left.
              </desc>
              {[
                [1, 5],
                [1, 7],
                [1, 3],
                [3, 4],
                [4, 5],
                [7, 5],
                [7, 3],
                [2, 8],
                [8, 4],
                [6, 10],
                [9, 10],
                [6, 9],
                [2, 1],
                [6, 8],
                [8, 10],
              ].map(([a, b], i) => {
                const pa = CORPUS_XY[a];
                const pb = CORPUS_XY[b];
                return (
                  <line
                    key={i}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={C.green}
                    strokeOpacity="0.3"
                    strokeWidth="1.5"
                  />
                );
              })}
              {[
                [10, 8],
                [8, 4],
                [4, 1],
              ].map(([a, b], i) => {
                const pa = CORPUS_XY[a];
                const pb = CORPUS_XY[b];
                return <line key={`p${i}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={C.green} strokeWidth="3" />;
              })}
              {Object.entries(CORPUS_XY).map(([id, p]) => {
                const onPath = [10, 8, 4, 1].includes(Number(id));
                return (
                  <g key={id}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={10}
                      fill={onPath ? C.green : "rgba(255,255,255,0.28)"}
                      stroke={C.green}
                    />
                    <text
                      x={p.x}
                      y={p.y + 4}
                      textAnchor="middle"
                      fill={onPath ? "#08080d" : "rgba(255,255,255,0.85)"}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {id}
                    </text>
                  </g>
                );
              })}
              <circle cx={QUERY_XY.x} cy={QUERY_XY.y} r={7} fill={C.yellow} />
              <text
                x={QUERY_XY.x}
                y={QUERY_XY.y - 12}
                textAnchor="middle"
                fill={C.yellow}
                fontSize="11"
                fontFamily="monospace"
              >
                query
              </text>
            </svg>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                HNSW (2016)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                Hierarchical Navigable Small World. In-memory graph with a multi-layer hierarchy. Production default for
                FAISS, Qdrant, Weaviate, Milvus, Elasticsearch, pgvector, Pinecone.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Vamana (2019, DiskANN)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                Microsoft Research. Single-layer graph with alpha-pruning, designed so the graph can live on SSD and
                still answer queries in milliseconds. Used by Azure AI Search and Milvus disk mode.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Why graphs won in production
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Every year a volunteer benchmark called ann-benchmarks.com measures the best ANN algorithms on standard
            datasets, plotting recall against queries-per-second. HNSW and Vamana sit on the Pareto frontier: at every
            recall target they run faster than trees, LSH, and pure IVF. Graph indexes are now the default in every
            major vector database.
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
              Empirical Pareto: recall vs throughput (ann-benchmarks, SIFT-1M)
            </T>
            <svg
              viewBox="0 0 500 180"
              style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", marginTop: 10 }}
            >
              <desc>
                Illustrative recall vs queries-per-second scatter inspired by ann-benchmarks. HNSW and Vamana points sit
                on the upper-right Pareto frontier (high recall and high QPS); IVF, LSH, and KD-tree points fall below
                and to the left of the frontier.
              </desc>
              <line x1="50" y1="30" x2="50" y2="150" stroke={C.dim} strokeWidth="1" />
              <line x1="50" y1="150" x2="470" y2="150" stroke={C.dim} strokeWidth="1" />
              <text x="8" y="24" fill={C.dim} fontSize="11">
                QPS (log)
              </text>
              <text x="250" y="172" textAnchor="middle" fill={C.dim} fontSize="11">
                recall@10
              </text>
              {[
                { name: "HNSW", x: 440, y: 45, color: C.green },
                { name: "Vamana", x: 355, y: 72, color: C.green },
                { name: "IVF+PQ", x: 305, y: 100, color: C.cyan },
                { name: "LSH", x: 235, y: 125, color: C.yellow },
                { name: "KD-tree", x: 160, y: 140, color: C.orange },
              ].map((p) => (
                <g key={p.name}>
                  <circle cx={p.x} cy={p.y} r="7" fill={p.color} />
                  <text x={p.x + 11} y={p.y + 4} fill={p.color} fontSize="12" fontWeight="bold">
                    {p.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Where you see HNSW
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                FAISS (Meta), Qdrant, Weaviate, Milvus, Elasticsearch, OpenSearch, pgvector, Pinecone, Chroma,
                Redis-Search. Effectively every vector DB ships an HNSW index.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Where you see Vamana
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                Azure AI Search, Milvus disk mode, some self-hosted DiskANN deployments. The go-to when the graph cannot
                fit in RAM.
              </T>
            </div>
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
};

// Edges of a flat proximity graph over the 10-doc corpus, computed as the symmetric
// union of each node's 3 nearest neighbors by CORPUS_XY squared distance. Because
// the graph is undirected, some nodes end up with 4 edges (a neighbor chose them
// reciprocally) - this matches real HNSW behavior where M is the per-insert bound,
// not a hard per-node cap. Reused in 11.7 sub=0/1 (flat) and 11.8/11.9 (layered).
const FLAT_GRAPH_EDGES = [
  [1, 4],
  [1, 5],
  [1, 7],
  [2, 7],
  [2, 8],
  [2, 10],
  [3, 4],
  [3, 5],
  [3, 7],
  [4, 5],
  [4, 7],
  [6, 8],
  [6, 9],
  [6, 10],
  [8, 9],
  [8, 10],
  [9, 10],
];

// Upper-layer hubs for 11.7 sub=2/3 diagrams.
// Layer 1 (yellow) = a few nodes that bridge the scatter with long edges.
// Layer 2 (red) = top hub(s) for global entry.
const HNSW_LAYER_1 = [1, 6, 10];
const HNSW_LAYER_2 = [1];

const HNSWLayeredGraph = ({
  mode, // "flat" | "slowGreedy" | "hubLayer" | "twoLayers"
  desc,
  highlightPath = [],
}) => {
  // For mode "slowGreedy", trace a long flat-graph path from doc 10 to doc 1
  const slowPath =
    mode === "slowGreedy"
      ? [
          [10, 6],
          [6, 9],
          [9, 10],
          [10, 8],
          [8, 2],
          [2, 7],
          [7, 1],
        ]
      : [];
  const hubEdges =
    mode === "hubLayer" || mode === "twoLayers"
      ? [
          [1, 6],
          [6, 10],
          [1, 10],
        ]
      : [];
  // Per-mode vertical layout so hub rows never touch their flat-layer copies and
  // doc 6 at the bottom of CORPUS_XY is not clipped by the viewBox.
  const layered = mode === "hubLayer" || mode === "twoLayers";
  const flatOffsetY = mode === "twoLayers" ? 100 : mode === "hubLayer" ? 80 : 0;
  const hubY = mode === "twoLayers" ? 110 : 90;
  const layer2Y = 40;
  const maxFlatY = 280 + flatOffsetY + 20; // doc 6 bottom edge + padding
  const vbH = layered ? Math.max(360, maxFlatY + 20) : 340;
  return (
    <svg
      viewBox={`0 0 500 ${vbH}`}
      style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}
    >
      <desc>{desc}</desc>
      {mode === "twoLayers" && (
        <>
          <line
            x1="10"
            y1={layer2Y - 10}
            x2="490"
            y2={layer2Y - 10}
            stroke={C.red}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <line
            x1="10"
            y1={hubY - 20}
            x2="490"
            y2={hubY - 20}
            stroke={C.yellow}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text x="20" y={layer2Y - 18} fill={C.red} fontSize="11" fontWeight="bold">
            layer 2 (hubs of hubs)
          </text>
          <text x="20" y={hubY - 28} fill={C.yellow} fontSize="11" fontWeight="bold">
            layer 1 (hubs)
          </text>
          <text x="20" y={vbH - 10} fill={C.cyan} fontSize="11" fontWeight="bold">
            layer 0 (everything)
          </text>
        </>
      )}
      {mode === "hubLayer" && (
        <>
          <line
            x1="10"
            y1={hubY - 30}
            x2="490"
            y2={hubY - 30}
            stroke={C.yellow}
            strokeDasharray="2 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text x="20" y={hubY - 38} fill={C.yellow} fontSize="11" fontWeight="bold">
            layer 1 (hubs)
          </text>
          <text x="20" y={vbH - 10} fill={C.cyan} fontSize="11" fontWeight="bold">
            layer 0 (everything)
          </text>
        </>
      )}
      {/* Baseline flat edges - shifted down by flatOffsetY in layered modes */}
      {FLAT_GRAPH_EDGES.map(([a, b], i) => {
        const pa = CORPUS_XY[a];
        const pb = CORPUS_XY[b];
        return (
          <line
            key={`e${i}`}
            x1={pa.x}
            y1={pa.y + flatOffsetY}
            x2={pb.x}
            y2={pb.y + flatOffsetY}
            stroke={C.cyan}
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Slow-greedy path (only in non-layered modes) */}
      {slowPath.map(([a, b], i) => (
        <line
          key={`sp${i}`}
          x1={CORPUS_XY[a].x}
          y1={CORPUS_XY[a].y}
          x2={CORPUS_XY[b].x}
          y2={CORPUS_XY[b].y}
          stroke={C.red}
          strokeWidth="2.5"
          strokeDasharray={i < 3 ? "4 4" : ""}
        />
      ))}
      {/* Hub layer long-range edges - drawn between hub-row copies */}
      {hubEdges.map(([a, b], i) => {
        const pa = CORPUS_XY[a];
        const pb = CORPUS_XY[b];
        return (
          <line
            key={`h${i}`}
            x1={pa.x}
            y1={hubY}
            x2={pb.x}
            y2={hubY}
            stroke={C.yellow}
            strokeWidth="2.5"
          />
        );
      })}
      {/* Layer 2 top hub */}
      {mode === "twoLayers" &&
        HNSW_LAYER_2.map((id) => (
          <g key={`l2${id}`}>
            <circle cx={CORPUS_XY[id].x} cy={layer2Y} r={10} fill={C.red} stroke={C.red} />
            <text
              x={CORPUS_XY[id].x}
              y={layer2Y + 4}
              textAnchor="middle"
              fill="#08080d"
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        ))}
      {/* Flat-layer dots (layer 0) */}
      {Object.entries(CORPUS_XY).map(([id, p]) => {
        const isHub = HNSW_LAYER_1.includes(Number(id));
        const onPath = highlightPath.includes(Number(id));
        const color = onPath ? C.green : isHub && layered ? C.yellow : C.cyan;
        return (
          <g key={`n${id}`}>
            <circle cx={p.x} cy={p.y + flatOffsetY} r={10} fill={color} stroke={color} />
            <text
              x={p.x}
              y={p.y + flatOffsetY + 4}
              textAnchor="middle"
              fill="#08080d"
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        );
      })}
      {/* Hub-layer copies of the three hub docs */}
      {layered &&
        HNSW_LAYER_1.map((id) => (
          <g key={`l1${id}`}>
            <circle cx={CORPUS_XY[id].x} cy={hubY} r={10} fill={C.yellow} stroke={C.yellow} />
            <text
              x={CORPUS_XY[id].x}
              y={hubY + 4}
              textAnchor="middle"
              fill="#08080d"
              fontSize="12"
              fontWeight="bold"
            >
              {id}
            </text>
          </g>
        ))}
    </svg>
  );
};

export const HNSWIntuition = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A flat proximity graph: every node linked to its M nearest
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            HNSW starts with one simple idea. Build a graph over the 10 docs where each node links to its M nearest
            neighbors. M is a tuning knob; for this visual we use M = 3 so the picture stays readable. In production
            M = 16 is standard.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            One nuance: because the graph is undirected, a node ends up with <i>at least</i> M edges, not exactly M.
            If another node picks this one among its M nearest, the link is added both ways - so some nodes in the
            picture below have 4 edges instead of 3. Real HNSW caps this at a hard upper bound called M_max (usually
            2M), pruning older neighbors if a node gets too crowded.
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
            <HNSWLayeredGraph
              mode="flat"
              desc="Flat proximity graph of the 10 cat-corpus documents with each node connected by cyan edges to its two or three nearest neighbors."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            for each doc d:
            <br />
            &nbsp;&nbsp;neighbors(d) = M nearest docs by distance
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every doc is reachable from every other doc by hopping along edges. The question is how fast we can reach
            the right one.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Greedy from a random start: too many hops
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Greedy search starts somewhere and moves to whichever neighbor is closer to the query. Simple and correct -
            but if the starting node is far from the query, the walk across the flat graph takes many short hops. On N =
            1,000,000 with a random start, greedy-on-flat averages about 1,000 hops. Slow.
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
            <HNSWLayeredGraph
              mode="slowGreedy"
              desc="Flat proximity graph with a dashed red path that meanders through many nodes before converging on the cat cluster near doc 1. Illustrates that random-start greedy search on a flat graph is slow."
              highlightPath={[10, 8, 6, 9, 10, 8, 2, 3, 1]}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            start: doc 10 (birds/fish)
            <br />
            target: doc 1 (cats)
            <br />
            hops on this flat graph: <span style={{ color: C.red }}>~8 hops</span> for 10 docs
            <br />
            extrapolated to N = 1,000,000: <span style={{ color: C.red }}>many hundreds of hops</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Many hops because the flat graph has only local edges. There is no way to jump across the space in one step
            - we have to trudge through every intermediate doc.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Lift a few nodes to a hub layer with long-range edges
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Now add a sparse second layer above the flat graph. Only a handful of nodes exist on it - we call them hubs.
            Hubs are connected to each other by long-range edges that span the whole dataset. A query enters the graph
            at the hub layer, jumps across the space in one or two long hops, then drops down to the flat layer for the
            final fine-grained search.
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
            <HNSWLayeredGraph
              mode="hubLayer"
              desc="Two-layer HNSW illustration: bottom cyan layer is the flat proximity graph of all 10 docs; top yellow layer holds three hub nodes (docs 1, 6, 10) with yellow long-range edges between them spanning the space."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Long-range edges
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                Hub-to-hub edges reach across the dataset in one hop. Enter at a hub, pay one long-haul, and we are
                already near the target&apos;s neighborhood.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Drop down once close
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                When no hub is closer to the query, drop to layer 0 and do the last mile on the flat graph&apos;s short
                edges.
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One sparse hub layer already drops search from N-scale hops to a handful. Stacking one more layer on top
            takes it to log N.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Stack layers exponentially: O(log N) hops total
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Stack a third layer on top, holding only a hub-of-hubs node or two. Searches enter at the top layer, descend
            through each tier with a constant number of hops per layer, and land at layer 0 already right next to the
            target. Because each layer holds roughly 1/M of the nodes beneath it, the number of layers grows with log(N)
            and so does the total hop count.
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
            <HNSWLayeredGraph
              mode="twoLayers"
              desc="Three-layer HNSW illustration: bottom cyan layer is the flat graph of all 10 docs; middle yellow layer has three hub nodes with long-range edges; top red layer has a single hub-of-hubs node providing the global entry point."
            />
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
            layers = &lceil;log<sub>M</sub>(N)&rceil;
            <br />
            at M = 16, N = 1,000,000:{"  "}
            <span style={{ color: C.green }}>log&#8321;&#8326;(1,000,000) &asymp; 5 layers</span>
            <br />
            hops per layer &asymp; constant (~6 with ef_search = 50)
            <br />
            total hops &asymp; <span style={{ color: C.green }}>30</span> to find the top-k{"  "}
            <span style={{ color: C.dim }}>vs. ~1000 on flat</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            That is the whole HNSW payoff. Flat graph: O(N) hops. Hierarchical graph: O(log N) hops. Exponential speedup
            for a small memory bump from the upper layers.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The airport analogy makes it concrete
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Getting from a small town in India to a small town in Portugal is not one direct flight. You take a local
            cab to the regional airport, a regional flight to an international hub, a long-haul flight across continents
            to another international hub, a regional flight down, and a local cab in. HNSW search does the same thing
            for vectors - the long-haul tier lets us cover enormous distance in one hop.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Local (layer 0)",
                color: C.cyan,
                light: "#80deea",
                body: "Every city has an airstrip. Many connections to nearby towns. On a flat graph you are stuck using only these.",
                qty: "100% of nodes",
              },
              {
                title: "Regional (layer 1)",
                color: C.yellow,
                light: "#ffe082",
                body: "A handful of regional airports. Reachable from any local airstrip, and connected to each other by medium-range flights.",
                qty: "~6% of nodes (1/M = 1/16)",
              },
              {
                title: "International (layer 2+)",
                color: C.red,
                light: "#ef9a9a",
                body: "A few global hubs. Long-haul flights between continents. Search enters here and drops down as it gets closer to the target.",
                qty: "<1% of nodes",
              },
            ].map((tier) => (
              <div
                key={tier.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${tier.color}06`,
                  border: `1px solid ${tier.color}12`,
                }}
              >
                <T color={tier.light} bold center size={16}>
                  {tier.title}
                </T>
                <T color={tier.color} size={13} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {tier.qty}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {tier.body}
                </T>
              </div>
            ))}
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
            <T color={C.purple} bold size={17}>
              The route a query takes
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              long-haul at international layer &rarr; regional hops once you are over the right continent &rarr; short
              local hops to the final neighbor. Same strategy planes use. Same strategy HNSW uses.
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
};

// Deterministic per-doc layer assignments for the 11.8 walkthrough.
// Values chosen so ~94% (8/10) land at L=0, one at L=1, one at L=2, matching the exponential decay.
const HNSW_INSERT_ORDER = [
  { id: 1, L: 2, u: 0.01, neighbors: [] },
  { id: 6, L: 1, u: 0.07, neighbors: [1] },
  { id: 7, L: 0, u: 0.45, neighbors: [1] },
  { id: 3, L: 0, u: 0.31, neighbors: [1, 7] },
  { id: 5, L: 0, u: 0.55, neighbors: [1, 7, 3] },
  { id: 4, L: 0, u: 0.78, neighbors: [5, 3] },
  { id: 2, L: 0, u: 0.63, neighbors: [1, 7] },
  { id: 8, L: 0, u: 0.82, neighbors: [2, 4] },
  { id: 10, L: 0, u: 0.68, neighbors: [6] },
  { id: 9, L: 0, u: 0.92, neighbors: [10, 6] },
];

export const HNSWConstruction = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Start empty; insert one vector at a time
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before any queries, we build the graph. Insertion is incremental - one vector at a time. The very first doc
            has no one to connect to, so it becomes the graph&apos;s entry point at whatever layer the layer formula
            assigns it.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <svg viewBox="0 0 400 180" style={{ width: "100%", maxWidth: 400, height: "auto", display: "block" }}>
              <desc>
                First vector inserted into an empty HNSW graph: a single cyan dot labeled doc 1, marked as the
                graph&apos;s entry point. No edges, no neighbors yet.
              </desc>
              <line x1="10" y1="40" x2="390" y2="40" stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
              <line x1="10" y1="90" x2="390" y2="90" stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
              <line x1="10" y1="150" x2="390" y2="150" stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
              <text x="16" y="32" fill={C.red} fontSize="11">
                layer 2
              </text>
              <text x="16" y="82" fill={C.yellow} fontSize="11">
                layer 1
              </text>
              <text x="16" y="168" fill={C.cyan} fontSize="11">
                layer 0
              </text>
              <circle cx="200" cy="150" r="12" fill={C.cyan} />
              <text x="200" y="154" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                1
              </text>
              <text x="200" y="130" textAnchor="middle" fill={C.cyan} fontSize="11" fontFamily="monospace">
                entry point (L = 0 in this example)
              </text>
            </svg>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The entry point is important: every future query starts from whichever doc currently sits in the top layer.
            As more docs are inserted, upper-layer residents can get replaced.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Layer assignment: one sample from an exponential distribution
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Every inserted vector is placed at a random layer L. The assignment is not uniform - it is drawn from an
            exponential distribution so that the upper layers stay sparse. HNSW uses this exact formula in the original
            paper:
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 18,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            <span style={{ color: C.purple }}>L</span> = <span style={{ color: C.yellow }}>floor</span>(&minus;
            <span style={{ color: C.yellow }}>ln</span>(<span style={{ color: C.green }}>uniform(0, 1)</span>) &middot;{" "}
            <span style={{ color: C.cyan }}>mL</span>)
            <br />
            <span style={{ color: C.dim, fontSize: 14 }}>mL = 1 / ln(M) &asymp; 1 / ln(16) &asymp; 0.36</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Example: u = 0.7
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.9,
                  textAlign: "center",
                }}
              >
                &minus;ln(0.7) = 0.357
                <br />
                0.357 &middot; 0.36 = 0.128
                <br />
                floor(0.128) = <span style={{ color: C.green }}>L = 0</span>
              </div>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                Nearly any random u lands at layer 0.
              </T>
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
                Example: u = 0.01
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.9,
                  textAlign: "center",
                }}
              >
                &minus;ln(0.01) = 4.605
                <br />
                4.605 &middot; 0.36 = 1.658
                <br />
                floor(1.658) = <span style={{ color: C.yellow }}>L = 1</span>
              </div>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                Only rare, extreme u values get promoted to layer 1 or higher.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This asymmetric distribution is the whole reason upper layers stay small. No tuning needed beyond M.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Most nodes end up at layer 0
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Simulate the formula a million times at M = 16. About 94% of samples land at layer 0, 5.7% at layer 1, and
            the tail decays exponentially by a factor of 1/M per layer. This is what keeps the upper tiers cheap.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Expected node counts per layer (N = 1,000,000, M = 16)
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { layer: 0, pct: 93.75, count: "937,500" },
                { layer: 1, pct: 5.86, count: "58,600" },
                { layer: 2, pct: 0.37, count: "3,700" },
                { layer: 3, pct: 0.023, count: "230" },
                { layer: 4, pct: 0.001, count: "14" },
              ].map((row) => (
                <div
                  key={row.layer}
                  style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px", gap: 10, alignItems: "center" }}
                >
                  <T color={C.yellow} bold size={14} style={{ fontFamily: "monospace" }}>
                    L = {row.layer}
                  </T>
                  <div style={{ height: 16, background: "rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.min(row.pct * 1.05, 100)}%`,
                        height: "100%",
                        background: C.yellow,
                      }}
                    />
                  </div>
                  <T color={C.bright} size={13} style={{ fontFamily: "monospace", textAlign: "right" }}>
                    {row.pct}% ({row.count})
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.yellow }}>exponential decay</span>: P(L &ge; k+1) / P(L &ge; k) = 1/M
            <br />
            at M = 16: each layer is 1/16 the size of the one below it
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Upper layers hold a handful of hub nodes - cheap in storage, expensive in importance. Every query enters
            through them.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Greedy insert: take the M nearest from the candidate pool
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Given the rolled L, insert the new node on layers L, L-1, ..., 0. On each layer, start at the current entry
            point, greedy-descend to the closest existing node, expand a candidate pool of size ef_construction (default
            200), and connect the new node to its M nearest among the pool by adding edges.
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
              Insertion pseudo-code (HNSW paper, Algorithm 1)
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                lineHeight: 1.9,
              }}
            >
              insert(q, M, ef_construction):
              <br />
              &nbsp;&nbsp;L = floor(&minus;ln(uniform()) &middot; mL)
              <br />
              &nbsp;&nbsp;ep = entry_point
              <br />
              &nbsp;&nbsp;for layer in top_level ... L+1:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;ep = greedy_descend(q, ep, layer){"  "}
              <span style={{ color: C.dim }}>// 1 candidate only</span>
              <br />
              &nbsp;&nbsp;for layer in L ... 0:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;candidates = beam_search(q, ep, layer,{" "}
              <span style={{ color: C.yellow }}>ef_construction</span>)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;neighbors = select_<span style={{ color: C.green }}>M</span>_nearest(candidates)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;add_edges(q, neighbors){"  "}
              <span style={{ color: C.dim }}>// bidirectional, capped at M per node</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;ep = neighbors[0]
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ef_construction is the candidate pool size. Larger means better neighbor choice at insert time (and
            therefore better recall later) but slower builds.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Insert all 10 cat-corpus docs
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Roll the layer formula for every doc (deterministic values shown below for the walkthrough), then run the
            insertion algorithm. Doc 1 &quot;Cats are small domesticated carnivores&quot; gets lucky with u = 0.01 and
            lands at L = 2, making it the top entry point. Doc 6 &quot;Python is a programming language&quot; lands at L
            = 1. The other 8 docs stay at layer 0 - the expected 80% in this tiny sample, 94% in the limit.
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
                gridTemplateColumns: "48px 2fr 80px 80px 1fr",
                gap: 10,
                padding: "6px 10px",
                borderBottom: `1px solid ${C.orange}22`,
              }}
            >
              <T color={C.orange} bold size={13}>
                doc
              </T>
              <T color={C.orange} bold size={13}>
                text
              </T>
              <T color={C.orange} bold size={13} style={{ textAlign: "center" }}>
                u
              </T>
              <T color={C.orange} bold size={13} style={{ textAlign: "center" }}>
                L
              </T>
              <T color={C.orange} bold size={13}>
                edges added
              </T>
            </div>
            {HNSW_INSERT_ORDER.map((row) => {
              const doc = CAT_CORPUS.find((d) => d.id === row.id);
              const layerBg = row.L === 2 ? `${C.red}18` : row.L === 1 ? `${C.yellow}18` : `${C.cyan}18`;
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 2fr 80px 80px 1fr",
                    gap: 10,
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 4,
                    background: layerBg,
                    marginTop: 4,
                  }}
                >
                  <T color={C.bright} bold size={14} style={{ fontFamily: "monospace" }}>
                    #{row.id}
                  </T>
                  <T color={C.bright} size={13}>
                    {doc.text}
                  </T>
                  <T color={C.dim} size={13} style={{ fontFamily: "monospace", textAlign: "center" }}>
                    {row.u}
                  </T>
                  <T color={C.orange} bold size={14} style={{ fontFamily: "monospace", textAlign: "center" }}>
                    L = {row.L}
                  </T>
                  <T color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                    {row.neighbors.length === 0 ? "- (entry point)" : `to ${row.neighbors.join(", ")}`}
                  </T>
                </div>
              );
            })}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            In practice the layer rolls are truly random, but the distribution always looks like this: one or two docs
            at the top, a handful in the middle, everyone else at the bottom.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            M = 16 sets quality, cost, and memory all at once
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            M is the single most important construction parameter. Larger M means every node has more edges, which makes
            the graph navigable from more starting points (better recall) but also burns more memory and slightly slower
            queries per hop.
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
            <span style={{ color: C.red }}>M = 16</span> <span style={{ color: C.dim }}>(the production default)</span>
            <br />
            edges per node at layer 0 &le; M = 16{"  "}
            <span style={{ color: C.dim }}>bidirectional</span>
            <br />
            edges per node at upper layers &le; M/2 = 8
            <br />
            memory per vector &asymp; M &middot; 4 bytes (neighbor ids) + upper layers &asymp;{" "}
            <span style={{ color: C.red }}>70 bytes per vector</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={16}>
                Graph overhead at N = 1,000,000
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 8, fontFamily: "monospace" }}>
                70 MB
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                tiny next to the vectors themselves (3 GB)
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={16}>
                Graph overhead at N = 100,000,000
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 8, fontFamily: "monospace" }}>
                7 GB
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                still cheap compared to 300 GB of vectors
              </T>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            M is the one knob you usually set up front and leave alone. 8 for memory-tight deployments, 16 for typical,
            32 or 48 for recall-critical workloads.
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

// Miniature 3-tier diagram used throughout 11.9 to animate the search path by stage.
const SearchPathDiagram = ({ stage, desc }) => {
  const Y2 = 40;
  const Y1 = 130;
  const Y0 = 230;
  const layer2 = [{ id: 1, x: 250 }];
  const layer1 = [
    { id: 1, x: 130 },
    { id: 6, x: 260 },
    { id: 10, x: 390 },
  ];
  // Evenly spaced across the width so adjacent circles (r=10) never visually touch.
  const layer0 = [
    { id: 5, x: 75 },
    { id: 1, x: 115 },
    { id: 7, x: 155 },
    { id: 3, x: 195 },
    { id: 4, x: 235 },
    { id: 8, x: 275 },
    { id: 2, x: 315 },
    { id: 6, x: 355 },
    { id: 10, x: 410 },
    { id: 9, x: 450 },
  ];
  // activeL2 always holds the single layer-2 hub once search has entered the graph.
  // stage never goes negative in practice, so no conditional here.
  const activeL2 = [1];
  const activeL1 = stage >= 1 ? [1] : [];
  const activeL0 = stage >= 3 ? [1, 3, 7] : [];
  const beamPairs =
    stage >= 4
      ? [
          [1, 7],
          [7, 3],
          [3, 4],
          [1, 3],
        ]
      : [];
  return (
    <svg viewBox="0 0 500 300" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <desc>{desc}</desc>
      <defs>
        <marker
          id="searchArrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 8 4, 0 8" fill={C.green} />
        </marker>
      </defs>
      <line x1="10" y1={Y2} x2="490" y2={Y2} stroke={C.red} strokeDasharray="2 4" strokeOpacity="0.4" />
      <line x1="10" y1={Y1} x2="490" y2={Y1} stroke={C.yellow} strokeDasharray="2 4" strokeOpacity="0.4" />
      <line x1="10" y1={Y0} x2="490" y2={Y0} stroke={C.cyan} strokeDasharray="2 4" strokeOpacity="0.4" />
      <text x="16" y={Y2 - 8} fill={C.red} fontSize="11">
        layer 2
      </text>
      <text x="16" y={Y1 - 8} fill={C.yellow} fontSize="11">
        layer 1
      </text>
      <text x="16" y={Y0 + 16} fill={C.cyan} fontSize="11">
        layer 0
      </text>
      {[
        [1, 6],
        [6, 10],
      ].map(([a, b], i) => {
        const pa = layer1.find((n) => n.id === a);
        const pb = layer1.find((n) => n.id === b);
        return <line key={`l1e${i}`} x1={pa.x} y1={Y1} x2={pb.x} y2={Y1} stroke={C.yellow} strokeWidth="1.5" />;
      })}
      {[
        [1, 5],
        [1, 7],
        [1, 3],
        [3, 4],
        [3, 7],
        [4, 5],
        [7, 5],
        [2, 8],
        [8, 4],
        [6, 10],
        [8, 6],
        [9, 10],
      ].map(([a, b], i) => {
        const pa = layer0.find((n) => n.id === a);
        const pb = layer0.find((n) => n.id === b);
        return (
          <line
            key={`l0e${i}`}
            x1={pa.x}
            y1={Y0}
            x2={pb.x}
            y2={Y0}
            stroke={C.cyan}
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        );
      })}
      {beamPairs.map(([a, b], i) => {
        const pa = layer0.find((n) => n.id === a);
        const pb = layer0.find((n) => n.id === b);
        return <line key={`bp${i}`} x1={pa.x} y1={Y0} x2={pb.x} y2={Y0} stroke={C.purple} strokeWidth="3" />;
      })}
      {stage >= 1 && (
        <line x1={layer2[0].x} y1={Y2} x2={layer1.find((n) => n.id === 1).x} y2={Y1} stroke={C.green} strokeWidth="3" />
      )}
      {stage >= 2 && (
        <line
          x1={layer1.find((n) => n.id === 1).x}
          y1={Y1}
          x2={layer0.find((n) => n.id === 1).x}
          y2={Y0}
          stroke={C.green}
          strokeWidth="3"
        />
      )}
      <line
        x1="450"
        y1="20"
        x2={layer2[0].x + 10}
        y2={Y2 - 8}
        stroke={C.yellow}
        strokeWidth="2"
        markerEnd="url(#searchArrow)"
      />
      {layer2.map((n) => (
        <g key={`l2n${n.id}`}>
          <circle cx={n.x} cy={Y2} r={12} fill={C.green} stroke={C.red} />
          <text x={n.x} y={Y2 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
      {layer1.map((n) => (
        <g key={`l1n${n.id}`}>
          <circle cx={n.x} cy={Y1} r={12} fill={activeL1.includes(n.id) ? C.green : C.yellow} stroke={C.yellow} />
          <text x={n.x} y={Y1 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
      {layer0.map((n) => (
        <g key={`l0n${n.id}`}>
          <circle cx={n.x} cy={Y0} r={12} fill={activeL0.includes(n.id) ? C.green : C.cyan} stroke={C.cyan} />
          <text x={n.x} y={Y0 + 4} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
            {n.id}
          </text>
        </g>
      ))}
      <text x="470" y="15" textAnchor="end" fill={C.yellow} fontSize="11" fontFamily="monospace">
        query
      </text>
    </svg>
  );
};

export const HNSWSearch = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Start at the top-layer entry point
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Every HNSW search begins at the graph&apos;s current entry point, which lives in the top layer. The entry
            point is one specific node - whichever doc won the layer roll during construction. For our cat-corpus graph
            that is doc 1 at layer 2.
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
            <SearchPathDiagram
              stage={0}
              desc="Three-tier HNSW diagram. Query vector enters at the top layer's entry-point node (doc 1). Below it, the graph's full layer structure is visible; the yellow query arrow points into the top hub."
            />
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            No matter where in the embedding space the query lands, it starts from this exact node. The upper-tier
            long-range edges do the initial heavy lifting of getting close.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Greedy descent: move to any neighbor closer to the query
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            At the current layer, look at every neighbor of the current node. Measure the distance from each neighbor to
            the query. If any neighbor is closer than where we are now, move there and repeat. When no neighbor is
            closer, we have hit a local minimum on this layer.
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
            <SearchPathDiagram
              stage={1}
              desc="Greedy descent at layer 2 picks the closest hub neighbor to the query and hops there. The green path highlights the hop; remaining layer 1 and 0 are still untouched."
            />
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
            <span style={{ color: C.dim }}># greedy step, one layer at a time</span>
            <br />
            while any neighbor n of current:
            <br />
            &nbsp;&nbsp;if dist(n, q) &lt; dist(current, q): current = n
            <br />
            &nbsp;&nbsp;else: stop
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the same local-search move as IVF&apos;s cluster probe, but over graph edges instead of cluster
            centroids. Each hop shrinks the distance to the query.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Stuck on this layer? Drop down to the next one
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            When greedy descent hits a local minimum at layer L, drop down to the next layer (L &minus; 1) using the
            same node. The node also exists down there by construction, and its neighbors on the lower layer are
            different - more of them, and finer-grained. Resume greedy descent there.
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
            <SearchPathDiagram
              stage={2}
              desc="Search drops from layer 2 to layer 1 to layer 0 along green vertical edges. Each drop happens when no neighbor on the current layer is closer to the query."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.yellow }}>drop</span>: current node persists, we now see its denser neighborhood on
            layer 0
            <br />
            total layer drops = top_level &minus; 0
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Drops are free. The node is already in memory, we just switch which adjacency list we follow. The expensive
            part is the distance computations themselves.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            At layer 0, switch to beam search with ef_search candidates
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Layer 0 is where greedy breaks: the proximity graph has too many dead-ends, and a pure greedy walk can get
            stuck in a suboptimal local minimum. Instead of greedy, we keep a priority queue of the top ef_search
            candidates seen so far. ef_search defaults to 50. Think of it as how wide a net the search casts.
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
            <SearchPathDiagram
              stage={3}
              desc="At layer 0, three candidate nodes (docs 1, 3, 7) are highlighted green inside the beam. The search is about to expand their neighbors."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            beam = priority queue, size = <span style={{ color: C.orange }}>ef_search = 50</span> candidates
            <br />
            initial beam = {"{"}current node, its neighbors, sorted by distance to q{"}"}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ef_search = 50 is the starting default. Raise to 200 for high-recall workloads, drop to 10 when latency is
            critical.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Expand the beam until the top stops changing
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Repeat: pop the unexplored candidate with the smallest distance, look at its neighbors, insert them into the
            queue if they are closer than the current worst-in-queue, evict the worst. Stop when a full expansion fails
            to update the top of the queue. That is the signal we have converged.
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
            <SearchPathDiagram
              stage={4}
              desc="Beam expansion at layer 0 shown as purple edges between candidate doc nodes. The priority queue is updated as neighbors are explored; when the best candidate stops changing, the beam has converged."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: C.dim }}># layer-0 beam expansion</span>
            <br />
            while beam has unexplored candidates:
            <br />
            &nbsp;&nbsp;pick the closest unexplored node c
            <br />
            &nbsp;&nbsp;for neighbor n of c:
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;if dist(n, q) &lt; dist(worst-in-beam, q):
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;beam = push(beam, n); beam = keep_ef_search_closest(beam)
            <br />
            &nbsp;&nbsp;if beam top unchanged for one full sweep: stop
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Beam search is why HNSW beats greedy-only graph indexes. The priority queue lets the algorithm back out of
            dead-ends.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Return the top-k and trace the full end-to-end path
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            When the beam has converged, take its top k entries. For our running example with the query
            &quot;information about cats&quot; and k = 3, the returned docs are 1, 3, 7 - exactly the cat docs. Here is
            the full path from the entry point all the way down to the returned neighbors.
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
            <SearchPathDiagram
              stage={4}
              desc="Complete HNSW search path for the cat-corpus query. Green edges trace the descent from the layer-2 entry through layer 1 down to the layer-0 beam, which converges on docs 1, 3, and 7."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
              textAlign: "center",
            }}
          >
            path: <span style={{ color: C.red }}>entry(L2, doc 1)</span> &rarr;{" "}
            <span style={{ color: C.yellow }}>L1 hub doc 1</span> &rarr; <span style={{ color: C.green }}>L0 beam</span>{" "}
            &rarr; top-3: <span style={{ color: C.green }}>docs 1, 3, 7</span>{" "}
            <span style={{ color: C.dim }}>(cat docs)</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Same algorithm scales from 10 docs to 1 billion docs. The only things that change are the number of layers
            (log N of them) and the size of ef_search.
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

export const HNSWParameters = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Three knobs, three defaults
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            HNSW exposes exactly three parameters. M controls the graph shape (build-time structural choice).
            ef_construction controls how hard we work to pick good neighbors during insert (build-time effort).
            ef_search controls how wide a net we cast at query time (query-time recall dial). The defaults below work
            for most text-embedding workloads out of the box.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                name: "M",
                value: "16",
                color: C.cyan,
                light: "#80deea",
                when: "build time (fixed)",
                trades: "recall vs memory",
              },
              {
                name: "ef_construction",
                value: "200",
                color: C.yellow,
                light: "#ffe082",
                when: "build time (one-off)",
                trades: "recall vs build time",
              },
              {
                name: "ef_search",
                value: "50",
                color: C.green,
                light: "#80e8a5",
                when: "query time (per query)",
                trades: "recall vs latency",
              },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${p.color}06`,
                  border: `1px solid ${p.color}12`,
                }}
              >
                <T color={p.light} bold center size={16} style={{ fontFamily: "monospace" }}>
                  {p.name}
                </T>
                <T color={p.color} bold center size={28} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {p.value}
                </T>
                <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                  {p.when}
                </T>
                <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                  trades: {p.trades}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Change one knob at a time and measure. Changing two at once makes it impossible to tell which mattered.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            M: more edges means better recall, more memory
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            M is the cap on neighbors per node at layer 0. Doubling M roughly doubles the per-vector graph memory and
            gives a small but measurable recall bump. The relationship is nearly linear; at some point the returns
            flatten and you are just burning memory.
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
              Measured at ef_search = 50, N = 1M, d = 768
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.cyan} bold size={13}>
                M
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                recall@10
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                graph bytes/vec
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                memory at N = 1M
              </T>
              {[
                { m: 8, recall: "0.93", bpv: "~35", total: "35 MB" },
                { m: 16, recall: "0.97", bpv: "~70", total: "70 MB" },
                { m: 32, recall: "0.99", bpv: "~140", total: "140 MB" },
                { m: 48, recall: "0.995", bpv: "~210", total: "210 MB" },
              ].flatMap((row) => [
                <T key={`m-${row.m}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                  {row.m}
                </T>,
                <T
                  key={`mr-${row.m}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`mb-${row.m}`}
                  color={C.bright}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.bpv}
                </T>,
                <T
                  key={`mt-${row.m}`}
                  color={C.yellow}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.total}
                </T>,
              ])}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            M = 16 is the sweet spot for text. Drop to 8 when RAM is tight; go to 32 or 48 when recall is critical and
            memory is available.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            ef_construction: how hard to work while building
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ef_construction is the candidate pool size during insertion. A larger pool finds better neighbors for every
            new node, which yields a better graph and therefore better recall at query time. The cost is longer build
            times. Once the index is built, ef_construction no longer matters - it is a one-time cost paid up front.
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
              Build-time tradeoff at N = 1M, d = 768, M = 16
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "130px 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.yellow} bold size={13}>
                ef_construction
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                build time
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                recall@10 ceiling
              </T>
              {[
                { ef: 100, time: "~5 min", recall: "0.95" },
                { ef: 200, time: "~9 min", recall: "0.97" },
                { ef: 500, time: "~20 min", recall: "0.98" },
                { ef: 1000, time: "~35 min", recall: "0.985" },
              ].flatMap((row) => [
                <T key={`e-${row.ef}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                  {row.ef}
                </T>,
                <T
                  key={`et-${row.ef}`}
                  color={C.orange}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.time}
                </T>,
                <T
                  key={`er-${row.ef}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
              ])}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            ef_construction = 200 is the recommended starting point.
            <br />
            Returns diminish sharply past 500 on most text datasets.
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            ef_search: the one knob you tune per workload
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            ef_search is the only knob you change after deployment. Raising it expands the beam at layer 0 - more
            candidate nodes explored per query, higher recall, higher latency. Lowering it does the opposite. This is
            the knob production teams reach for when they need a quick recall bump.
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
              Query-time sweep (M = 16, N = 1M, d = 768, single CPU core)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.green} bold size={13}>
                ef_search
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "center" }}>
                recall@10
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "center" }}>
                latency
              </T>
              {[
                { ef: 10, recall: "0.85", ms: "0.5 ms" },
                { ef: 50, recall: "0.97", ms: "1.2 ms" },
                { ef: 200, recall: "0.995", ms: "3.0 ms" },
                { ef: 500, recall: "0.999", ms: "6.0 ms" },
              ].flatMap((row) => [
                <T key={`s-${row.ef}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }}>
                  {row.ef}
                </T>,
                <T
                  key={`sr-${row.ef}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`sm-${row.ef}`}
                  color={C.orange}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.ms}
                </T>,
              ])}
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Start at ef_search = 50. Bump to 100 or 200 if recall is low. Drop to 10-20 only when sub-millisecond
            latency matters more than a 1-2% recall drop.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Pick M first, then tune ef_search
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Each M value traces its own recall curve as ef_search varies. Higher M lets the curve flatten closer to 1.0
            before latency gets painful. These numbers are empirical, measured on a laptop with SIFT-1M - not exact for
            every dataset, but illustrative of the shape.
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
              recall@10 curves vs ef_search
            </T>
            <svg
              viewBox="0 0 570 280"
              style={{ width: "100%", maxWidth: 590, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Line chart plotting recall@10 on the vertical axis against ef_search on a log horizontal axis, with
                three curves for M = 8, M = 16, and M = 32. Higher M curves converge closer to 1.0 but require more
                memory; M = 16 is the standard compromise.
              </desc>
              <line x1="60" y1="30" x2="60" y2="230" stroke={C.dim} strokeWidth="1" />
              <line x1="60" y1="230" x2="500" y2="230" stroke={C.dim} strokeWidth="1" />
              <text x="40" y="40" fill={C.dim} fontSize="11">
                1.0
              </text>
              <text x="40" y="230" fill={C.dim} fontSize="11">
                0.80
              </text>
              <text x="60" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                10
              </text>
              <text x="180" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                50
              </text>
              <text x="330" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                200
              </text>
              <text x="480" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                500
              </text>
              <text x="280" y="275" fill={C.dim} fontSize="12" textAnchor="middle">
                ef_search (log scale)
              </text>
              {/* M=8 curve (cyan) */}
              <polyline points="60,180 180,90 330,60 480,45" fill="none" stroke={C.cyan} strokeWidth="2.5" />
              <text x="490" y="49" fill={C.cyan} fontSize="12" fontWeight="bold">
                M = 8
              </text>
              {/* M=16 curve (yellow) */}
              <polyline points="60,160 180,70 330,38 480,30" fill="none" stroke={C.yellow} strokeWidth="2.5" />
              <text x="490" y="32" fill={C.yellow} fontSize="12" fontWeight="bold">
                M = 16
              </text>
              {/* M=32 curve (green) */}
              <polyline points="60,150 180,55 330,33 480,28" fill="none" stroke={C.green} strokeWidth="2.5" />
              <text x="490" y="18" fill={C.green} fontSize="12" fontWeight="bold">
                M = 32
              </text>
            </svg>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Moving along one curve is cheap (change ef_search). Switching curves is expensive (rebuild the graph with
            new M). That asymmetry is why M is a fixed architectural choice.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory math and a playbook of which knob to raise
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            At production scale (N = 100M, d = 768, M = 16), the total memory is dominated by vectors, with a small but
            real graph overhead on top. Compression (Acts 3 and 4) knocks the vector portion way down. The playbook
            below tells you which knob to raise when a specific metric goes wrong.
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
            memory &asymp; N &middot; (d &middot; 4 + M &middot; 8) bytes
            <br />
            at N = 100M, d = 768, M = 16:
            <br />
            100M &middot; (3072 + 128) &asymp; <span style={{ color: C.red }}>320 GB</span>{" "}
            <span style={{ color: C.dim }}>(300 GB vectors + 20 GB graph)</span>
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
            <T color={C.red} bold center size={17}>
              The playbook: which knob to raise or lower
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  symptom: "Recall is too low",
                  action: "raise ef_search first, then raise M (rebuild required)",
                  color: C.green,
                },
                {
                  symptom: "Memory is too high",
                  action: "lower M (rebuild), then apply PQ compression (Act 3)",
                  color: C.yellow,
                },
                {
                  symptom: "Build time is too slow",
                  action: "lower ef_construction first, then lower M",
                  color: C.cyan,
                },
                {
                  symptom: "Query latency is too high",
                  action: "lower ef_search - recall drops, queries get faster",
                  color: C.orange,
                },
              ].map((row) => (
                <div
                  key={row.symptom}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${row.color}08`,
                  }}
                >
                  <T color={row.color} bold size={14}>
                    {row.symptom}
                  </T>
                  <T color={C.bright} size={14}>
                    {row.action}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ef_search is the only knob you can change without a rebuild. That makes it the default tool for any incident
            response. Everything else requires planning ahead.
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

export const Vamana = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            HNSW hits a RAM wall around 100M vectors
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            HNSW assumes the entire graph plus every vector lives in RAM. That assumption breaks at production scale. A
            single machine with 384 GB of RAM can just barely hold 100 million 768-dim float32 vectors plus their HNSW
            graph. Beyond that we need either sharding across many machines or a different algorithm.
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
            at N = 100M, d = 768, M = 16:
            <br />
            vectors: 300 GB
            <br />
            HNSW graph: 20 GB
            <br />
            total RAM needed: <span style={{ color: C.red }}>320 GB</span>{" "}
            <span style={{ color: C.dim }}>(barely fits on one server)</span>
            <br />
            at N = 1,000,000,000: <span style={{ color: C.red }}>3.2 TB</span>{" "}
            <span style={{ color: C.dim }}>(needs multi-node sharding)</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Microsoft hit this wall on Bing. Their answer, published in 2019, is Vamana - a graph index designed from
            the ground up to work when the graph lives on SSD and only a cache slice lives in RAM.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            One flat layer, carefully chosen edges
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            HNSW uses a layered hierarchy because in-RAM random access is free - jumping from hub to hub costs nothing.
            On SSD, random access is expensive, so the hierarchy gains less. Vamana drops the hierarchy entirely and
            keeps a single flat layer with the right edges. Each node has up to R neighbors (R = 64 in the default
            DiskANN configuration), chosen to keep the graph navigable from any starting point.
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
            <svg viewBox="0 0 500 220" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
              <desc>
                Single-layer Vamana graph over the 10 cat-corpus documents. Each node has a handful of edges chosen for
                diversity, no hierarchical layers above it.
              </desc>
              {[
                [1, 3],
                [1, 7],
                [1, 5],
                [1, 10],
                [3, 4],
                [3, 7],
                [5, 7],
                [4, 5],
                [2, 8],
                [2, 1],
                [2, 9],
                [8, 4],
                [8, 6],
                [6, 10],
                [6, 9],
                [9, 10],
                [10, 4],
              ].map(([a, b], i) => {
                const pa = CORPUS_XY[a];
                const pb = CORPUS_XY[b];
                return (
                  <line
                    key={i}
                    x1={pa.x}
                    y1={pa.y - 40}
                    x2={pb.x}
                    y2={pb.y - 40}
                    stroke={C.cyan}
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                  />
                );
              })}
              {Object.entries(CORPUS_XY).map(([id, p]) => (
                <g key={id}>
                  <circle cx={p.x} cy={p.y - 40} r={10} fill={C.cyan} stroke={C.cyan} />
                  <text x={p.x} y={p.y - 36} textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                    {id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            R = 64 <span style={{ color: C.dim }}>(default max neighbors)</span>
            <br />
            no hierarchy, no layer stack
            <br />
            navigable from any starting node
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The trade is fewer long-range jumps in exchange for being drastically easier to store on disk and cache
            selectively in RAM.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Alpha-pruning: only keep diverse edges
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Building the graph greedily would give every node its R nearest neighbors. That sounds good but leaves a
            fatal gap: the graph has only short-range edges, so search has to trudge through many intermediate nodes to
            cross the space. Vamana fixes this with the alpha-pruning rule, which trims redundant short edges and keeps
            only diverse ones.
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
            <span style={{ color: C.purple }}>alpha-pruning rule</span>
            <br />
            keep edge (p, q) only if no existing neighbor q&apos; of p satisfies:
            <br />
            dist(q&apos;, q) &middot; <span style={{ color: C.yellow }}>&alpha;</span> &le; dist(p, q)
            <br />
            <span style={{ color: C.dim }}>default &alpha; = 1.2</span>
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
                Before pruning (redundant edges)
              </T>
              <svg viewBox="0 0 200 160" style={{ width: "100%", height: "auto", display: "block", marginTop: 6 }}>
                <desc>
                  Graph node with too many redundant short edges clustered in one direction; all neighbors are close to
                  each other.
                </desc>
                <circle cx="100" cy="80" r="10" fill={C.red} />
                {[
                  [140, 70],
                  [145, 85],
                  [150, 95],
                  [130, 100],
                  [155, 70],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <line x1="100" y1="80" x2={x} y2={y} stroke={C.red} strokeWidth="1.5" />
                    <circle cx={x} cy={y} r="5" fill={C.red} />
                  </g>
                ))}
              </svg>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                5 neighbors, all clumped together - searches get stuck.
              </T>
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
                After alpha-pruning (diverse edges)
              </T>
              <svg viewBox="0 0 200 160" style={{ width: "100%", height: "auto", display: "block", marginTop: 6 }}>
                <desc>
                  Graph node after alpha-pruning: fewer neighbors, spread in different directions across the 2D space so
                  the graph is navigable from anywhere.
                </desc>
                <circle cx="100" cy="80" r="10" fill={C.green} />
                {[
                  [160, 50],
                  [150, 130],
                  [40, 60],
                  [60, 140],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <line x1="100" y1="80" x2={x} y2={y} stroke={C.green} strokeWidth="1.5" />
                    <circle cx={x} cy={y} r="5" fill={C.green} />
                  </g>
                ))}
              </svg>
              <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                4 neighbors, each in a different direction - search can escape.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            alpha = 1.2 is a sweet spot; alpha closer to 1 keeps many redundant short edges, alpha higher than 1.5 may
            drop edges that were actually useful. 1.2 is what DiskANN ships with.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Graph lives on SSD; a cache slice lives in RAM
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Adjacency lists are stored on disk as 4 KB blocks aligned to the NVMe page size. Every block holds one
            node&apos;s neighbor list and the vector itself, so a single 4 KB SSD read delivers both the edges and the
            data needed to compute distance. A small subset of the graph - typically the central high-degree entry-layer
            nodes - is kept in RAM.
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
            <svg viewBox="0 0 500 180" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
              <desc>
                Storage hierarchy diagram: top layer shows a RAM cache holding a small subset of high-degree entry
                nodes; bottom layer shows the SSD storing every graph node as 4 KB blocks aligned to NVMe pages.
              </desc>
              <rect
                x="20"
                y="20"
                width="460"
                height="60"
                fill={`${C.green}10`}
                stroke={C.green}
                strokeWidth="2"
                rx="6"
              />
              <text x="30" y="40" fill={C.green} fontSize="13" fontWeight="bold">
                RAM cache (entry layer)
              </text>
              <text x="30" y="60" fill={C.bright} fontSize="12" fontFamily="monospace">
                ~1-5% of nodes, kept hot for every query
              </text>
              {[1, 2, 3, 4, 5].map((i) => (
                <circle key={i} cx={280 + i * 30} cy={50} r={10} fill={C.green} />
              ))}
              <rect
                x="20"
                y="100"
                width="460"
                height="70"
                fill={`${C.orange}10`}
                stroke={C.orange}
                strokeWidth="2"
                rx="6"
              />
              <text x="30" y="122" fill={C.orange} fontSize="13" fontWeight="bold">
                SSD (NVMe)
              </text>
              <text x="30" y="140" fill={C.bright} fontSize="12" fontFamily="monospace">
                4 KB blocks, one per node (vector + adjacency list)
              </text>
              {Array.from({ length: 18 }).map((_, i) => (
                <rect
                  key={i}
                  x={175 + i * 15}
                  y={145}
                  width={11}
                  height={18}
                  fill={C.orange}
                  stroke="#08080d"
                  strokeWidth="0.5"
                />
              ))}
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            disk block = 4 KB = 1 vector + neighbor ids
            <br />
            NVMe random read latency: ~10 &micro;s per block
            <br />
            memory cache: entry-layer nodes (most-traversed)
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The 4 KB choice is deliberate - it matches NVMe page granularity so we pay for one IO per hop, no more.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Search: greedy in RAM, a few SSD fetches, done
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            A Vamana search starts in the RAM cache and greedy-descends there for free (no disk IO). When the greedy
            walk drops off the cached subgraph, every hop costs one SSD read. With a good graph and a well-chosen cache,
            total SSD reads per query stay under 80 - about 800 microseconds of IO plus compute.
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
              Per-query budget at N = 100M, d = 768
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
                { label: "RAM hops", value: "~20", detail: "free (nanoseconds each)", color: C.green },
                { label: "SSD reads", value: "40-80", detail: "10 us each on NVMe", color: C.orange },
                { label: "Distance ops", value: "~80", detail: "about 60 ns each", color: C.yellow },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${row.color}08`,
                    border: `1px solid ${row.color}18`,
                  }}
                >
                  <T color={row.color} bold center size={14}>
                    {row.label}
                  </T>
                  <T color={row.color} bold center size={24} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {row.value}
                  </T>
                  <T color={C.bright} size={12} center style={{ marginTop: 4 }}>
                    {row.detail}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            total latency &asymp; 80 &middot; 10 &micro;s + compute &asymp;{" "}
            <span style={{ color: C.green }}>~1 ms per query</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A single-digit-millisecond vector search over a graph that never fits in RAM. That is the whole point of
            DiskANN.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            100 billion vectors on one machine
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            With R = 64, d = 768, and 1.2 alpha-pruning, a single server with about 128 GB of RAM and 10 TB of NVMe
            holds 100 billion vectors and still answers queries in a few milliseconds. That is more vectors than Google
            indexes for web search. Azure AI Search and Milvus disk mode both ship DiskANN implementations; self-hosted
            OpenSearch-vector and several Milvus deployments use it too.
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
            1 server: 128 GB RAM + 10 TB NVMe
            <br />
            holds: <span style={{ color: C.yellow }}>100,000,000,000 vectors</span>
            <br />
            query latency: ~5 ms at recall@10 = 0.95
            <br />
            cost: ~1/10 of HNSW multi-node cluster at the same scale
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                Where DiskANN is deployed
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Azure AI Search (core engine for Bing), Milvus disk mode, Weaviate with Vamana backend, self-hosted
                DiskANN deployments at Microsoft, Snowflake, Databricks.
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
                FreshDiskANN for updates and deletes
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                The 2021 follow-up paper adds incremental inserts and deletes on top of Vamana, handling the one thing
                the original couldn&apos;t. Production systems use it to avoid periodic full rebuilds.
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Vamana is the answer when the graph does not fit in RAM. HNSW is still the production default under 100M
            vectors, but above that, Vamana / DiskANN is the algorithm the large-scale systems reach for.
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
