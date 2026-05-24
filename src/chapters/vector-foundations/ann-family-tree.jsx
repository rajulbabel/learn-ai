import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { IVFScatter, HNSW_CORPUS_XY, FLAT_GRAPH_EDGES } from "../../shared/vector-graphs.jsx";

export default function ANNFamilyTree(ctx) {
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
            At N = 1,000,000,000: linear is a billion ops, log N is about 30 ops
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
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
          <T color="#ffcc80" style={{ marginTop: 8 }} center>
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
                Sits at a similar distance
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
            IVF (Inverted File Index) does partition-and-probe: cluster the corpus into nlist Voronoi cells ahead of
            time, and at query time scan only the nprobe nearest cells. Cheap to build, easy to update, decent recall at
            nprobe = 8 to 32. Its weakness is neighbors that sit just across a cell boundary - the partition hides them
            from the probe.
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
            <svg viewBox="0 0 500 360" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
              <desc>
                Proximity graph of the 10 cat-corpus documents with edges connecting each node to its three nearest
                neighbors. A highlighted green path traces a search from a starting node in the lower-right across
                several hops to the cat cluster in the upper-left.
              </desc>
              {FLAT_GRAPH_EDGES.map(([a, b], i) => {
                const pa = HNSW_CORPUS_XY[a];
                const pb = HNSW_CORPUS_XY[b];
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
                [8, 2],
                [2, 7],
                [7, 1],
              ].map(([a, b], i) => {
                const pa = HNSW_CORPUS_XY[a];
                const pb = HNSW_CORPUS_XY[b];
                return <line key={`p${i}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={C.green} strokeWidth="3" />;
              })}
              {Object.entries(HNSW_CORPUS_XY).map(([id, p]) => {
                const onPath = [10, 8, 2, 7, 1].includes(Number(id));
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
              <circle cx={40} cy={30} r={7} fill={C.yellow} />
              <text x={40} y={18} textAnchor="middle" fill={C.yellow} fontSize="11" fontFamily="monospace">
                Query
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
                Recall@10
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
}
