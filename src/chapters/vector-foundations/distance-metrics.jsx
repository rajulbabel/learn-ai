import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { fmtVec } from "../../shared/vector-graphs.jsx";

const QUERY = { text: "Information about cats", vec: [0.85, 0.14, 0.44, 0.21] };

export default function DistanceMetrics(ctx) {
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
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }} center>
                (q &middot; d) / (||q|| ||d||)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }} center>
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
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }} center>
                √(Σ (q<sub>i</sub> - d<sub>i</sub>)²)
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }} center>
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
              <T color={C.bright} size={15} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.4 }} center>
                q &middot; d = Σ q<sub>i</sub> &middot; d<sub>i</sub>
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }} center>
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
            <div style={{ marginTop: 6, fontSize: 15, color: C.dim }}>Range: [-1, 1]</div>
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
                  Origin
                </text>
              </svg>
              <T color="#80e8a5" size={13} style={{ marginTop: 6 }} center>
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
                  { doc: "Doc 1 (Cats are small...)", cos: "0.9993", color: C.green },
                  { doc: "Doc 7 (Kittens grow up to be cats)", cos: "0.9984", color: C.green },
                  { doc: "Doc 10 (Fish live underwater)", cos: "0.6229", color: C.yellow },
                  { doc: "Doc 6 (Python is a prog. lang)", cos: "0.3554", color: C.red },
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
              Smaller is closer (it is a distance, not a similarity)
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
              <T color="#7cc4ff" size={13} style={{ marginTop: 6 }} center>
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
                  { doc: "Doc 1 (Cats are small...)", l2: "0.047", color: C.green },
                  { doc: "Doc 7 (Kittens grow up to be cats)", l2: "0.057", color: C.green },
                  { doc: "Doc 10 (Fish live underwater)", l2: "0.922", color: C.yellow },
                  { doc: "Doc 6 (Python is a prog. lang)", l2: "1.228", color: C.red },
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
            <div style={{ marginTop: 6, fontSize: 15, color: C.dim }}>Range: unbounded (depends on magnitudes)</div>
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
            <T color={C.orange} bold center size={15}>
              At billions of vectors, that 3x difference is the difference between 100 ms and 300 ms per query.
            </T>
            <T color="#ffcc99" center size={14} style={{ marginTop: 6 }}>
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
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }} center>
                (q &middot; d) / (||q|| ||d||)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }} center>
                With ||q|| = ||d|| = 1
              </T>
              <T color={C.green} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }} center>
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
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }} center>
                q &middot; d
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }} center>
                Already bounded in [-1, 1]
              </T>
              <T color={C.orange} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }} center>
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
              <T color={C.bright} size={14} style={{ marginTop: 8, fontFamily: "monospace", lineHeight: 1.6 }} center>
                ||q||² + ||d||² - 2(q &middot; d)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }} center>
                = 1 + 1 - 2(q &middot; d)
              </T>
              <T color={C.blue} bold size={15} style={{ marginTop: 8, fontFamily: "monospace" }} center>
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
            <T color={C.yellow} bold center size={17}>
              All three collapse to the same ranking
            </T>
            <T color="#ffe066" center size={15} style={{ marginTop: 6, fontFamily: "monospace" }}>
              max cos(q, d) = max (q &middot; d) = min L2(q, d)
            </T>
            <T color="#ffe066" center size={14} style={{ marginTop: 8, fontStyle: "italic" }}>
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
                  Before normalization
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
                  After normalization
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
                models: "Any model after ||v|| = 1 at ingest",
                metric: "Inner product",
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
            <T color={C.green} bold center size={16}>
              The production default
            </T>
            <T color="#80e8a5" center size={15} style={{ marginTop: 6 }}>
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
}
