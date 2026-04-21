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
      <Reveal when={sub >= 4}>
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
                body: "HNSW has a knob called ef_search that controls how many candidate nodes to explore per query. Bigger number = more exploration = higher recall, but linearly more work, so latency rises. Typical tuning: ef_search = 200 gives 0.99 recall, ef_search = 50 gives 0.95 recall at 4x the speed.",
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
                body: "Product Quantization replaces each 3 KB vector with ~96 bytes of codebook indices - a 32x memory win. But the stored vectors are approximate, so distances are approximate, so recall drops. Typical cost: 0.98 recall becomes 0.94.",
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
                body: "Run three copies of the index on three machines and route each query to the least-loaded one. P99 drops because no single node gets a long queue. But you are paying for 3x the RAM. Caching the most frequent queries is a variant - memory for speed.",
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
                  { doc: "doc 3 (Lions are big cats...)", cos: "0.9867", color: C.green },
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
                  { doc: "doc 3 (Lions are big cats...)", l2: "0.162", color: C.green },
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
