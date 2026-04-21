import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Running cat-corpus used across Section 11. Vectors are 4-dim illustrative values.
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
                body: "User types &quot;how to fix leaky faucet&quot;. System returns pages about plumbing repair even if those words never appear verbatim.",
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
                  {body.replace(/&quot;/g, '"')}
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

export const BruteForceKNN = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Brute-Force kNN (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ThreeWayTradeoff = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three-Way Tradeoff (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const DistanceMetrics = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance Metrics (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
