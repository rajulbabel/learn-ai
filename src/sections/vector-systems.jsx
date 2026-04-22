import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 11 Act 6: System Selection (chapters 11.29-11.35).
// Continues the cat-corpus + production-scale numbers from 11.1-11.28.
// Capacity-planning anchor (11.28): 500M vectors x d=768 x 200 QPS x 6 nodes x 3 TB RAM.
// Monthly ratios Pinecone ~$30K / Qdrant ~$8K / pgvector ~$5K.

// ───────────────────────────────────────────────────────────────────────────
// 11.29 FAISS
// ───────────────────────────────────────────────────────────────────────────

export const FAISS = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            FAISS: Meta&apos;s reference library for ANN
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before talking about any database, it helps to name the thing that sits underneath most of them. FAISS
            (Facebook AI Similarity Search) is the library Meta open-sourced in 2017. It is not a database - it is a
            collection of C++ implementations of the core ANN algorithms: IVF, PQ, HNSW, IVF-PQ. When you use Milvus or
            OpenSearch or half the commercial systems on the market, FAISS code is somewhere down the stack actually
            computing distances.
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
              Timeline - FAISS from research to everywhere
            </T>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              {[
                { year: "2017", what: "Meta (Facebook) open-sources FAISS on GitHub" },
                { year: "2018", what: "Python bindings mature, used across ML teams" },
                { year: "2020+", what: "Embedded inside Milvus, OpenSearch, Vespa cores" },
                { year: "today", what: "Still the ANN reference implementation" },
              ].map((r) => (
                <div
                  key={r.year}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={16}>
                    {r.year}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            FAISS = <span style={{ color: C.cyan }}>library</span>, not a database
            <br />
            gives you <span style={{ color: C.cyan }}>algorithms</span>; everything else is on you
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            That distinction is the spine of this whole act. A library hands you the index; a database hands you the
            index plus persistence, filtering, replication, an API, and someone to page.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Inside FAISS: IVF, PQ, HNSW, IVF-PQ
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            FAISS does not pick one algorithm - it ships every major production-worthy index in a single library. You
            instantiate the one you want. Most FAISS indices run on CPU; the heavier ones (IVF-PQ on huge corpora) also
            have CUDA implementations for GPU acceleration.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                name: "IVF",
                blurb: "cluster space with k-means, probe nprobe cells",
                use: "medium-scale static corpora",
                color: C.yellow,
              },
              {
                name: "PQ",
                blurb: "compress each vector to m bytes via per-slot codebooks",
                use: "memory-bound workloads",
                color: C.green,
              },
              {
                name: "HNSW",
                blurb: "layered small-world graph, log-N navigation",
                use: "recall-sensitive, dynamic workloads",
                color: C.purple,
              },
              {
                name: "IVF-PQ",
                blurb: "combine: cluster then PQ-encode residuals",
                use: "1B+ static vectors on a node",
                color: C.orange,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={17}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {r.blurb}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {r.use}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            backends: <span style={{ color: C.yellow }}>CPU (default)</span> +{" "}
            <span style={{ color: C.yellow }}>CUDA / GPU</span> for IVF, PQ, IVF-PQ
            <br />
            GPU gives 10x to 100x throughput on high-QPS indexing
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every algorithm from Section 11 Acts 2-4 has a FAISS implementation. That is why FAISS is the benchmark -
            when a paper claims something beats HNSW, the comparison usually runs against the FAISS HNSW.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Python bindings over a C++ core
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            FAISS is written in C++ for speed and exposes Python bindings so data scientists can call it directly from
            Jupyter or a training pipeline. That ergonomic shape - fast kernel underneath, thin Python wrapper on top -
            is why it ended up embedded inside so many ML workflows.
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
              Typical FAISS usage in a training pipeline
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              import <span style={{ color: C.green }}>faiss</span>
              <br />
              index = faiss.IndexHNSWFlat(d=<span style={{ color: C.green }}>768</span>, M=16)
              <br />
              index.add(corpus_vectors) <span style={{ color: C.dim }}># N x 768 numpy array</span>
              <br />
              D, I = index.search(query_vectors, k=<span style={{ color: C.green }}>10</span>)
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { layer: "C++ core", what: "dense kernels, SIMD, CUDA", color: C.green },
              { layer: "Python bindings", what: "numpy-native API, scripting, notebooks", color: C.cyan },
            ].map((r) => (
              <div
                key={r.layer}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={16}>
                  {r.layer}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.what}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The embed-in-your-pipeline ergonomics are why FAISS shows up inside training loops and evaluation scripts,
            not just at serving time.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            No persistence, no API, no filters, no replication
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            FAISS gives you indices and distance computations. What it does not give you is every other thing a
            production system needs. Each one of the missing features below is a whole-team responsibility to build on
            top.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                name: "Persistence",
                blurb: "no WAL, no durable snapshots out of the box",
                pain: "if process dies, index is gone",
              },
              {
                name: "REST API",
                blurb: "no HTTP server, no auth, no rate limits",
                pain: "you write the serving layer",
              },
              {
                name: "Filtering",
                blurb: "no metadata index, no predicate support",
                pain: "tenant_id queries must be post-filtered",
              },
              {
                name: "ACID / replication",
                blurb: "no transactions, no leader-follower, no HA",
                pain: "single-node only; crashes lose writes",
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 12px",
                  background: `${C.orange}08`,
                  border: `1px solid ${C.orange}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.orange} bold center size={15}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {r.blurb}
                </T>
                <T color="#ef9a9a" size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {r.pain}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            FAISS provides the <span style={{ color: C.orange }}>algorithm</span>, not the{" "}
            <span style={{ color: C.orange }}>system</span>
            <br />
            everything above is a vector database&apos;s job
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Seen this way, the real vector databases (Qdrant, Pinecone, Milvus, pgvector) are all answers to the
            question &quot;what do we build on top of FAISS-style algorithms?&quot;
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            FAISS powers Milvus, OpenSearch, and many commercial systems
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            When people say a new vector database is &quot;fast,&quot; the speed is very often FAISS speed. Milvus and
            OpenSearch embed FAISS directly; Vespa and several commercial offerings reimplement the same algorithms with
            FAISS as the correctness reference. The database wraps FAISS with persistence, API, and ops.
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
              Systems with FAISS (or its algorithms) inside
            </T>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>system</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>relationship</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>what the wrapper adds</div>
              {[
                { name: "Milvus", rel: "FAISS inside", add: "distributed cluster, API, metadata, lifecycle" },
                { name: "OpenSearch", rel: "FAISS engine", add: "Lucene index, REST, auth, hybrid with BM25" },
                { name: "Vespa", rel: "same algorithms", add: "tensor compute, multi-vector, ranking pipelines" },
                { name: "Azure AI Search", rel: "FAISS / DiskANN variant", add: "managed service, filtering, auth" },
              ].flatMap((r) => [
                <div
                  key={`n-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}10`,
                    borderRadius: 4,
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div key={`r-${r.name}`} style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4 }}>
                  {r.rel}
                </div>,
                <div key={`a-${r.name}`} style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4 }}>
                  {r.add}
                </div>,
              ])}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            FAISS lives <span style={{ color: C.red }}>underneath</span> most vector DBs
            <br />
            the DB is the wrapper that turns &quot;library&quot; into &quot;product&quot;
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is why learning FAISS first was the right order - understanding its algorithms transfers directly to
            every system that embeds them.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The rule: FAISS to build a system, a DB to use one
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The decision reduces to one line. If you are building a system - researching a new index, embedding ANN in a
            training loop, or writing a custom service where you control persistence, API, and ops - use FAISS. If you
            want a system - a running database with an API, persistence, filters, backups, and replication handled - use
            a database, which wraps these algorithms behind a product.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                side: "Use FAISS if",
                items: [
                  "you are building a new system or research prototype",
                  "you control persistence, API, and ops yourself",
                  "you need custom index composition FAISS exposes",
                  "you want to embed ANN in a training loop",
                ],
                color: C.cyan,
              },
              {
                side: "Use a DB if",
                items: [
                  "you want to use one, not write one",
                  "you need filters, metadata, HA out of the box",
                  "you want a running service with API and auth",
                  "operational story is someone else&apos;s problem",
                ],
                color: C.purple,
              },
            ].map((r) => (
              <div
                key={r.side}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={16}>
                  {r.side}
                </T>
                <ul style={{ margin: "10px 0 0 20px", padding: 0, color: C.bright, fontSize: 14, lineHeight: 1.7 }}>
                  {r.items.map((it) => (
                    <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </ul>
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
            FAISS to <span style={{ color: C.purple }}>build</span> a system
            <br />a DB to <span style={{ color: C.purple }}>use one</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            With the library-vs-database distinction clear, the remaining chapters compare the databases themselves -
            what each one wraps FAISS-shaped algorithms with, and when that wrapping is worth picking.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.30 pgvector
// ───────────────────────────────────────────────────────────────────────────

export const Pgvector = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            pgvector is a Postgres extension
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            pgvector is not a separate database - it is a Postgres extension that adds a `vector` column type and
            distance operators. You install it with a one-line `CREATE EXTENSION vector` on your existing Postgres, and
            embeddings become just another column. Everything else that makes Postgres good (transactions, joins, ACID,
            backup tooling) applies automatically.
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
              Installing pgvector takes one line
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              CREATE EXTENSION <span style={{ color: C.cyan }}>vector</span>;
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 8, fontStyle: "italic" }}>
              your existing Postgres instance now speaks vectors
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { t: "Same database", d: "one Postgres for rows + vectors, same connection, same user" },
              { t: "Same operational model", d: "backups, replication, monitoring you already run" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The win is operational: you add similarity search to an existing Postgres you already know how to run.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            SQL syntax: ALTER TABLE, vector(768), and the cosine operator
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Embeddings live in a typed column. The column declares its dimension ahead of time (`vector(768)` for SBERT,
            3072 for text-embedding-3-large). Similarity queries use one of three distance operators. Cosine distance is
            the middle dot operator, written as `&lt;=&gt;` in SQL.
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
              Adding an embedding column and querying it
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: C.yellow }}>ALTER TABLE</span> docs{" "}
              <span style={{ color: C.yellow }}>ADD COLUMN</span> embedding vector(
              <span style={{ color: C.yellow }}>768</span>);
              <br />
              <br />
              <span style={{ color: C.yellow }}>SELECT</span> id, text
              <br />
              <span style={{ color: C.yellow }}>FROM</span> docs
              <br />
              <span style={{ color: C.yellow }}>ORDER BY</span> embedding{" "}
              <span style={{ color: C.yellow }}>&lt;=&gt;</span> query_embedding
              <br />
              <span style={{ color: C.yellow }}>LIMIT</span> 10;
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { op: "<=>", name: "cosine", color: C.yellow, when: "default for text embeddings" },
              { op: "<->", name: "L2 Euclidean", color: C.green, when: "some vision embeddings" },
              { op: "<#>", name: "negative inner product", color: C.purple, when: "normalized + fast" },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={18} style={{ fontFamily: "monospace" }}>
                  {r.op}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.name}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 4, fontStyle: "italic" }}>
                  {r.when}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Cosine is the default because SBERT-family embeddings are direction-carriers, not magnitude-carriers. See
            chapter 11.4 for the cosine / L2 / inner-product discussion.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Index types: HNSW or IVFFlat, tuned via SQL
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Without an index, `ORDER BY ... &lt;=&gt; ...` does brute-force search over every row. For production you
            create an index: either HNSW (graph, better recall, slower build) or IVFFlat (cluster probe, faster build,
            lower memory). Both are tunable via SQL parameters exactly the same way any Postgres index is.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                name: "HNSW",
                params: ["m = 16", "ef_construction = 64", "ef_search = 40"],
                note: "better recall + latency, slower to build",
                color: C.green,
              },
              {
                name: "IVFFlat",
                params: ["lists = sqrt(N)", "probes = sqrt(lists)", "fast to build"],
                note: "smaller memory, needs tuning per size",
                color: C.orange,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={17}>
                  {r.name}
                </T>
                <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                  {r.params.map((p) => (
                    <div key={p}>{p}</div>
                  ))}
                </div>
                <T color={C.dim} size={12} center style={{ marginTop: 8, fontStyle: "italic" }}>
                  {r.note}
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
            }}
          >
            <T color={C.green} bold center size={16}>
              Creating an index with SQL-level parameters
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: C.green }}>CREATE INDEX</span> ON docs
              <br />
              <span style={{ color: C.green }}>USING hnsw</span> (embedding{" "}
              <span style={{ color: C.green }}>vector_cosine_ops</span>)
              <br />
              <span style={{ color: C.green }}>WITH</span> (m = 16, ef_construction = 64);
              <br />
              <br />
              <span style={{ color: C.dim }}>-- then per-session tuning</span>
              <br />
              <span style={{ color: C.green }}>SET</span> hnsw.ef_search = 40;
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tuning is SQL. Logging, query planning, and EXPLAIN ANALYZE work the same way they do for any other Postgres
            index.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Inherited features: transactions, SQL joins, ACID, metadata queries
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            The hidden payoff of pgvector is everything you get for free. Vectors live next to your existing rows, so
            you can join, filter, transact, and query metadata using SQL you already write. The other vector databases
            add filtering and joins bolted on; Postgres has always had them.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Transactions + ACID", d: "insert a row and its vector in one atomic write" },
              { t: "SQL joins", d: "join docs to users to permissions to embeddings, same query" },
              { t: "Rich metadata queries", d: "GIN indexes on JSONB, partial indexes, window functions" },
              { t: "Existing ops", d: "backups, WAL replication, monitoring, PITR already in place" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.orange}08`,
                  border: `1px solid ${C.orange}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.orange} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
                </T>
              </div>
            ))}
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
            <T color={C.orange} bold center size={16}>
              Compound SQL + vector query on the cat corpus
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: C.orange }}>SELECT</span> d.id, d.text, u.name
              <br />
              <span style={{ color: C.orange }}>FROM</span> docs d <span style={{ color: C.orange }}>JOIN</span> users u{" "}
              <span style={{ color: C.orange }}>ON</span> u.id = d.owner_id
              <br />
              <span style={{ color: C.orange }}>WHERE</span> u.tenant_id = 42
              <br />
              <span style={{ color: C.orange }}>ORDER BY</span> d.embedding &lt;=&gt; query_embedding
              <br />
              <span style={{ color: C.orange }}>LIMIT</span> 10;
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One query covers similarity search, metadata filtering (tenant_id), and a join to the users table. Other
            vector DBs need multiple systems or extra services to do this.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Good fit: under 10M vectors, metadata-heavy, existing Postgres team
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            pgvector is the right answer more often than people assume. If you already run Postgres and your corpus fits
            on one node with room to grow, adding pgvector beats introducing a whole new database.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Under 10M vectors", d: "fits comfortably on one Postgres instance with HNSW" },
              { t: "Metadata-heavy queries", d: "complex SQL filters and joins across related tables" },
              { t: "Existing Postgres team", d: "no new ops paging rotation, no extra vendor contract" },
              { t: "Moderate QPS (under 1K)", d: "Postgres handles the load without horizontal scale" },
              { t: "Strict consistency", d: "ACID transactions span rows and vectors together" },
              { t: "Fast prototyping", d: "no new infra: enable the extension and ship today" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.green} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
            the right answer <span style={{ color: C.green }}>more often than people think</span>
            <br />
            especially when you already have a Postgres team
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            &quot;We should use a vector DB&quot; often just means &quot;we should add pgvector.&quot; Most workloads
            fit.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Bad fit: over 100M vectors, over 10K QPS, multi-region
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Past certain scales, pgvector stops being the right tool. The same properties that make it convenient
            (single-node, transactional, SQL-driven) become constraints. At these thresholds, a purpose-built vector
            database is the better answer.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Over 100M vectors", d: "single-node Postgres RAM stops being realistic" },
              { t: "Over 10K QPS", d: "Postgres contention limits vector-search throughput" },
              { t: "Multi-region active-active", d: "PG replication is leader-follower, not active-active" },
              { t: "Heavy filtered-HNSW", d: "pgvector lacks Qdrant-style inline filter pruning" },
              { t: "Binary / PQ quantization", d: "pgvector does not yet ship compression-as-a-flag" },
              { t: "Massive delete churn", d: "HNSW delete story on pgvector is still maturing" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.red} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            pgvector at 100M+ / 10K+ QPS / multi-region = <span style={{ color: C.red }}>out of its lane</span>
            <br />
            time to look at Qdrant, Pinecone, or Milvus
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Good product choices have clear boundaries. pgvector&apos;s boundary is at large scale; the next chapters
            cover what lives beyond it.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.31 Qdrant
// ───────────────────────────────────────────────────────────────────────────

export const Qdrant = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Qdrant: Rust-based vector DB, open-source, self-hostable
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Qdrant is a vector database written from scratch in Rust. It is open-source (Apache 2.0) and ships as a
            single self-contained binary; there is no mandatory managed tier. Qdrant Cloud exists as an optional hosted
            offering, but the same code runs in Docker, on Kubernetes, or straight on a VM. This self-host-first posture
            is the core reason teams pick it.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Language", d: "Rust - memory-safe, no GC stalls on query path" },
              { t: "License", d: "Apache 2.0 - free for commercial self-host" },
              { t: "Deploy", d: "single binary, Docker image, K8s operator" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Qdrant = <span style={{ color: C.cyan }}>open-source</span> +{" "}
            <span style={{ color: C.cyan }}>self-host</span> + <span style={{ color: C.cyan }}>HNSW-first</span>
            <br />
            Rust core + REST/gRPC API
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The Rust choice shows up in latency tails: no garbage-collection pauses, predictable allocation behavior.
            This is why Qdrant benchmarks well on P99.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            HNSW graph + inline filter during traversal
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Qdrant&apos;s core index is HNSW, same as chapter 11.9. What makes it distinctive is the filter story.
            Recall from 11.19: the three strategies are pre-filter, post-filter, and inline. Qdrant implements inline
            filtered-HNSW natively - predicates evaluate as the graph traversal visits each candidate, so tight filters
            never degenerate into brute-force or return empty results.
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
              Qdrant inline filtered-HNSW vs the alternatives
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
                {
                  name: "Pre-filter",
                  what: "filter first, brute-force survivors",
                  pain: "slow for loose filters",
                  color: C.red,
                },
                {
                  name: "Post-filter",
                  what: "ANN then drop misses",
                  pain: "empty / short results at 0.1%",
                  color: C.orange,
                },
                {
                  name: "Qdrant inline",
                  what: "check predicate during hop",
                  pain: "best across all selectivities",
                  color: C.green,
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={15}>
                    {r.name}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                  <T color={C.dim} size={11} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {r.pain}
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
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Payload index turns filters into a graph constraint
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              HNSW traversal visits node i
              <br />
              -&gt; check <span style={{ color: C.yellow }}>payload[i].tenant_id == 42</span> via payload index
              <br />
              -&gt; if false, skip edge; if true, proceed
              <br />
              predicate cost is ~1 pointer dereference per hop
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Qdrant built a dedicated payload index (inverted index over metadata) so filter evaluation is essentially
            free during traversal. This is why Qdrant wins chapter 11.19&apos;s filter-heavy scenarios.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Collections with per-vector payload metadata
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Qdrant groups vectors into collections. A collection declares its vector dimension and distance metric; each
            point in it carries an opaque JSON payload and, optionally, multiple named vectors. The collection is the
            unit of sharding, replication, and schema.
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
              One point in a Qdrant collection
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              {"{"}
              <br />
              &nbsp;&nbsp;id: <span style={{ color: C.green }}>42</span>,
              <br />
              &nbsp;&nbsp;vectors: {"{"} <span style={{ color: C.green }}>text</span>: [0.2, 0.8, ... (768)],{" "}
              <span style={{ color: C.green }}>title</span>: [...] {"}"},
              <br />
              &nbsp;&nbsp;payload: {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;tenant_id: <span style={{ color: C.green }}>42</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;text: &quot;Cats are small domesticated carnivores&quot;,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;published_year: <span style={{ color: C.green }}>2024</span>
              <br />
              &nbsp;&nbsp;{"}"}
              <br />
              {"}"}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                t: "Multi-vector support",
                d: "one point can store several named vectors (title, body, image) in the same record - native support since v1.10 (chapter 11.25)",
                color: C.green,
              },
              {
                t: "Payload is just JSON",
                d: "arbitrary nested metadata, indexed types: keyword, int, float, geo, datetime",
                color: C.cyan,
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Collection + payload = one record type covering vector, metadata, and multi-vector use cases. The shape is
            the same whether you are doing simple search or ColBERT-style max-sim.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Built-in: hybrid search, SQ / PQ / BQ quantization
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Qdrant ships most Act 3 compression schemes as configurable flags on a collection. You turn on scalar
            quantization (SQ), product quantization (PQ), or binary quantization (BQ) at collection create time; the
            HNSW index below it adapts. Hybrid search (BM25 + vector, RRF fusion from 11.23) is also first-class.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                name: "Scalar (SQ)",
                win: "4x memory, ~1-3% recall loss",
                note: "float32 -> int8 per dim",
                color: C.orange,
              },
              {
                name: "Product (PQ)",
                win: "~32x memory, recall tuning",
                note: "m=96 subvectors, 256 codes",
                color: C.yellow,
              },
              {
                name: "Binary (BQ)",
                win: "~32x memory, d-dependent",
                note: "1 bit/dim, XOR + popcount",
                color: C.red,
              },
              {
                name: "Hybrid search",
                win: "BM25 + vector with RRF",
                note: "k = 60 reciprocal rank",
                color: C.purple,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={15}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {r.win}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {r.note}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            SQ / PQ / BQ = memory knobs, <span style={{ color: C.orange }}>one YAML flag each</span>
            <br />
            hybrid + multi-vector are first-class, not bolt-ons
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Qdrant exposes more tuning than most competitors; this is a double-edged win - more control, more knobs
            someone has to understand and turn correctly.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Self-host story: single binary, Docker, Kubernetes operator
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Deployment tracks the expected lifecycle of a self-hosted service. Start with the single binary for a
            laptop, move to Docker for staging, graduate to the Kubernetes operator for production. Each step is a
            well-worn path with documented ops runbooks.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                name: "Single binary",
                what: "download, `./qdrant`, ready in seconds",
                when: "laptop prototyping, tests, CI",
                color: C.cyan,
              },
              {
                name: "Docker image",
                what: "`docker run qdrant/qdrant`",
                when: "staging, small production, ops familiarity",
                color: C.yellow,
              },
              {
                name: "K8s operator",
                what: "declarative cluster, HA, upgrades",
                when: "production: multi-node, rolling upgrades",
                color: C.green,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={15}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6, fontFamily: "monospace" }}>
                  {r.what}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {r.when}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            you control: <span style={{ color: C.red }}>persistence, backups, upgrades, replication</span>
            <br />
            Qdrant Cloud is optional - everything also runs on your own infra
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Self-host means you keep the data on your infra, use your own monitoring stack, and integrate with your own
            identity + secrets. For many compliance-sensitive teams, this is a decisive feature.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Tradeoffs: ops burden, newer multi-region, smaller ecosystem than Elastic
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The self-host story cuts both ways. Everything that makes Qdrant attractive (control, cost, flexibility)
            also means someone on your team carries the pager. And because the product is younger than Elasticsearch or
            Postgres, there are still edges around multi-region deployment and operational tooling.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                t: "Ops burden",
                d: "you page for incidents, handle upgrades, run backups, design HA - operational cost is real",
              },
              {
                t: "Multi-region story is newer",
                d: "active-active replication and regional failover are more mature in Pinecone and Elastic",
              },
              {
                t: "Smaller ecosystem than Elastic",
                d: "fewer third-party tools, dashboards, plugins; the community is growing but still smaller",
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.purple}08`,
                  border: `1px solid ${C.purple}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.purple} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            great fit when: <span style={{ color: C.purple }}>ops capacity exists</span> +{" "}
            <span style={{ color: C.purple }}>filtering matters</span> +{" "}
            <span style={{ color: C.purple }}>cost-sensitive at scale</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            If your team already runs Postgres and a queue and a cache, running Qdrant is just another self-hosted
            service. If your team is two people and Pinecone is $30K a month, that is different arithmetic.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.32 Pinecone
// ───────────────────────────────────────────────────────────────────────────

export const Pinecone = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Pinecone: managed SaaS with opinionated defaults
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Pinecone is the opposite posture from Qdrant. It is a proprietary, managed SaaS - you sign up, get an API
            key, upsert vectors, and query. You never run a server. You never see a node. The tradeoff is that Pinecone
            makes most scaling decisions for you, often opinionated in ways that cannot be reconfigured.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Managed SaaS", d: "Pinecone runs the infrastructure, not you" },
              { t: "Proprietary", d: "closed-source core, pay-per-use pricing" },
              { t: "Opinionated defaults", d: "index type, shard count, replication decided for you" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
                </T>
              </div>
            ))}
          </div>
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
              Calling Pinecone from Python - no servers involved
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              pc = <span style={{ color: C.cyan }}>Pinecone</span>(api_key=...)
              <br />
              index = pc.Index(&quot;cats&quot;)
              <br />
              index.upsert(vectors=[(id, embedding, metadata), ...])
              <br />
              index.query(vector=query_embedding, top_k=<span style={{ color: C.cyan }}>10</span>)
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Zero infrastructure to provision means a team can ship vector search in an afternoon. That is the real
            Pinecone selling point.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Pod architecture: each pod is one shard; scale by adding pods
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The original Pinecone model is pod-based. Each pod is one shard of an index, running on a dedicated VM tier.
            p1 pods are CPU-only and cheaper; p2 pods are higher-memory and faster for dense workloads. You pick a pod
            type at index creation and scale horizontally by adding more pods.
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
              Pod tiers and what each one buys you
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
                  tier: "p1 pod",
                  what: "CPU-tuned, cheaper, lower QPS per pod",
                  when: "cost-sensitive, moderate QPS workloads",
                  color: C.yellow,
                },
                {
                  tier: "p2 pod",
                  what: "memory + performance tuned, higher QPS",
                  when: "latency-sensitive, high-QPS workloads",
                  color: C.orange,
                },
              ].map((r) => (
                <div
                  key={r.tier}
                  style={{
                    padding: "12px 14px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={16}>
                    {r.tier}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {r.when}
                  </T>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            scale by <span style={{ color: C.yellow }}>adding pods</span> (each pod = one shard)
            <br />
            replicas added for throughput and availability, multiplies cost
            <br />
            N_total = pods &middot; replicas
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Pod-based pricing is predictable and easy to model. The tradeoff is fixed capacity: pods keep running (and
            charging) even at low traffic.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Serverless tier: scale to zero between queries, cold-start tax
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The newer Pinecone Serverless tier breaks the pod model: no fixed capacity, no always-on pods. Storage is on
            object storage; compute spins up on query. When idle, costs drop to storage-only. The catch: the first query
            after an idle period pays a cold-start tax (~1 second for index materialization) before it returns.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { phase: "Idle", cost: "storage only", latency: "-", note: "cheap, no compute running" },
              { phase: "Cold start", cost: "compute spin-up", latency: "~1 s tax", note: "first query after idle" },
              { phase: "Warm", cost: "per query", latency: "normal", note: "subsequent queries, millisecond" },
            ].map((r) => (
              <div
                key={r.phase}
                style={{
                  padding: "12px 12px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={15}>
                  {r.phase}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {r.cost}
                </T>
                <T color={C.cyan} size={12} style={{ marginTop: 4 }}>
                  {r.latency}
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4, fontStyle: "italic" }}>
                  {r.note}
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
            }}
          >
            <T color={C.green} bold center size={16}>
              Scale-to-zero cost profile across a day
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              bursty workload: 1K queries in an hour, idle the rest
              <br />
              pod-based: pay <span style={{ color: C.red }}>all 24 hours</span> of pod time
              <br />
              serverless: pay <span style={{ color: C.green }}>1 hour compute</span> + 24 hours cheap storage
              <br />
              savings can be 10x at low, bursty duty-cycle
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Serverless is a straight win for bursty workloads. The cold-start tax matters for latency-sensitive UX -
            that 1 s first query hits end-user pages.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Built-in features: filtering, hybrid search, namespaces for multi-tenancy
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Pinecone does ship many of the features you need out of the box. Metadata filtering works as a post-filter
            with a bitmap metadata index; hybrid search (sparse + dense vectors) is a first-class mode. For SaaS
            applications serving many customers, namespaces partition one index into tenant-scoped subsets without extra
            infrastructure.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                t: "Metadata filtering",
                d: "bitmap-backed, evaluates per query, works with JSON predicates",
                color: C.orange,
              },
              {
                t: "Hybrid search",
                d: "sparse + dense vector combined, learned sparse available",
                color: C.yellow,
              },
              {
                t: "Namespaces",
                d: "per-tenant partitions in one index, no extra indexes to manage",
                color: C.cyan,
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            enough feature breadth for <span style={{ color: C.orange }}>most RAG-style apps</span>
            <br />
            not as deep as Qdrant on filtering, not as broad as Elastic on ecosystem
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            For the typical chatbot-on-documents use case, what Pinecone ships is more than enough. For complex compound
            filtering or heavy analytics-style queries, it is lighter than Qdrant.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Good fit: no ops team, variable workloads, fast time-to-market
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Pinecone is the right answer when your team does not have the capacity, the desire, or the skill to run
            infrastructure. The constant trade - higher per-query cost in exchange for zero operational burden - is
            wonderful for small teams and bad for large-scale steady workloads.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "No ops team", d: "startups, two-engineer projects, no SRE rotation" },
              { t: "Variable workloads", d: "bursty traffic benefits from serverless scale-to-zero" },
              { t: "Fast time-to-market", d: "ship in hours, no infra review, no provisioning" },
              { t: "Prototype / POC", d: "validate product-market fit before committing ops budget" },
              {
                t: "Compliance off-the-shelf",
                d: "SOC 2, GDPR pre-arranged as part of the service",
              },
              {
                t: "Multi-tenant SaaS",
                d: "namespaces cleanly partition tenant data without extra infra",
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.green} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Pinecone shines when: <span style={{ color: C.green }}>no ops</span> +{" "}
            <span style={{ color: C.green }}>variable traffic</span> +{" "}
            <span style={{ color: C.green }}>ship-today mandate</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The hidden decision is an ops-dollars vs ops-hours tradeoff. Pinecone buys hours back; self-host buys
            dollars back. Pick the currency your team has less of.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Tradeoffs: vendor lock-in, cost at scale, opinionated scaling
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Pinecone is proprietary; your vectors and indexes live in their system. Leaving means re-embedding or
            exporting via their API and rebuilding elsewhere. Cost at billion-scale steady QPS is typically 4x-6x what a
            self-hosted Qdrant or Milvus would cost. The scaling model is opinionated and not user-configurable.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              {
                t: "Vendor lock-in",
                d: "proprietary system, migration requires re-indexing, no official Postgres-style portability",
              },
              {
                t: "Cost at scale",
                d: "~$30K/month for 500M vectors x 200 QPS (chapter 11.28); 4x-6x self-host Qdrant",
              },
              {
                t: "Opinionated scaling",
                d: "you cannot reshape sharding, pick HNSW parameters, or hand-tune the graph",
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.red} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            watch out at: <span style={{ color: C.red }}>steady high QPS</span> +{" "}
            <span style={{ color: C.red }}>100M+ vectors</span> +{" "}
            <span style={{ color: C.red }}>custom tuning needs</span>
            <br />
            that is when the math flips toward self-host
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The Pinecone premium is real. It is worth paying when operational capacity is the bottleneck; it is not
            worth paying when you already run infrastructure and the workload is steady.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.33 Qdrant vs Pinecone
// ───────────────────────────────────────────────────────────────────────────

export const QdrantVsPinecone = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Decision axes: ops, filters, scale-to-zero, cost, features, ecosystem
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            This is the most common vector-DB decision teams actually face in 2026. Qdrant and Pinecone represent two
            poles - self-host open-source vs managed SaaS. The decision never reduces to one winner because the axes are
            real tradeoffs. Six axes cover most of the discussion.
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
              The six decision axes
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>axis</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Qdrant</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Pinecone</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>comment</div>
              {[
                { axis: "Ops preference", q: "self-host", p: "managed", n: "who runs it" },
                { axis: "Filter complexity", q: "inline HNSW", p: "post-filter", n: "Qdrant deeper" },
                { axis: "Scale-to-zero", q: "no", p: "serverless", n: "Pinecone unique" },
                { axis: "Cost at steady 1B", q: "cheaper", p: "premium", n: "ops capacity needed" },
                { axis: "Feature depth", q: "more knobs", p: "fewer, opinionated", n: "pick your poison" },
                { axis: "Ecosystem maturity", q: "growing", p: "battle-tested", n: "both solid today" },
              ].flatMap((r) => [
                <div
                  key={`a-${r.axis}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.cyan}10`,
                    borderRadius: 4,
                    color: C.cyan,
                    fontWeight: "bold",
                  }}
                >
                  {r.axis}
                </div>,
                <div
                  key={`q-${r.axis}`}
                  style={{ padding: "6px 8px", background: `${C.green}08`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.q}
                </div>,
                <div
                  key={`p-${r.axis}`}
                  style={{ padding: "6px 8px", background: `${C.orange}08`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.p}
                </div>,
                <div
                  key={`n-${r.axis}`}
                  style={{ padding: "6px 8px", background: `${C.cyan}04`, borderRadius: 4, color: C.bright }}
                >
                  {r.n}
                </div>,
              ])}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            No axis dominates; each scenario weights them differently. The rest of this chapter walks through four
            realistic teams and picks an answer for each.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Scenario A: early prototype, no ops team -&gt; Pinecone Serverless wins
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Two engineers. Shipping a RAG feature in a week. No infrastructure team. Traffic is unknown - might be 10
            queries a day, might be 10K. The value-at-risk of picking the wrong infrastructure is much higher than the
            premium Pinecone charges. Pinecone Serverless is the right call here.
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
              Scenario A profile
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
                { t: "Size", v: "<1M vectors" },
                { t: "Traffic", v: "unknown / bursty" },
                { t: "Ops capacity", v: "none" },
              ].map((r) => (
                <div
                  key={r.t}
                  style={{
                    padding: "10px 12px",
                    background: `${C.yellow}08`,
                    border: `1px solid ${C.yellow}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.yellow} bold size={14}>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.v}
                  </T>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            answer: <span style={{ color: C.yellow }}>Pinecone Serverless</span>
            <br />
            zero infrastructure, scale-to-zero when idle, pay per query
            <br />
            revisit at 100K/day sustained traffic
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The dangerous mistake here is premature self-host - spending two weeks standing up Qdrant on Kubernetes
            before product-market fit. Pinecone Serverless removes that distraction.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Scenario B: 10M vectors + complex compound filters -&gt; Qdrant self-host wins
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            SaaS platform with 10M documents across 5,000 tenants. Queries always include tenant_id, often plus
            category, region, published_after, has_access=true. Selectivity varies from 0.1% (one small tenant) to 30%
            (large enterprise tenants). Post-filter breaks at the tight end; pre-filter breaks at the loose end.
            Qdrant&apos;s inline filtered-HNSW handles both edges.
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
              Scenario B profile
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
                { t: "Size", v: "10M vectors" },
                { t: "Filters", v: "complex compound predicates" },
                { t: "Ops capacity", v: "one Postgres DBA + SRE on-call" },
              ].map((r) => (
                <div
                  key={r.t}
                  style={{
                    padding: "10px 12px",
                    background: `${C.green}08`,
                    border: `1px solid ${C.green}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold size={14}>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.v}
                  </T>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            answer: <span style={{ color: C.green }}>Qdrant self-host</span>
            <br />
            inline filtered-HNSW wins across the full selectivity range
            <br />
            saves ~$22K/month vs managed Pinecone at 10M scale
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Here the filter complexity and the available ops capacity point the same way. When those line up, the
            decision is cleaner than most teams realize.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Scenario C: 1B vectors at steady 10K QPS -&gt; Qdrant multi-node or Milvus
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Large-scale search, 1 billion documents, steady 10K QPS. Pinecone would work but the bill runs into six
            figures a month. This is where self-host pays back hard. Qdrant multi-node clusters handle this with care;
            Milvus is purpose-built for the scale and is also the right call.
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
              Scenario C profile and cost math
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
                { t: "Size", v: "1B vectors" },
                { t: "Traffic", v: "10K QPS steady" },
                { t: "Ops capacity", v: "dedicated platform team" },
              ].map((r) => (
                <div
                  key={r.t}
                  style={{
                    padding: "10px 12px",
                    background: `${C.orange}08`,
                    border: `1px solid ${C.orange}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold size={14}>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.v}
                  </T>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 12,
                padding: "12px 14px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Pinecone at this scale: <span style={{ color: C.red }}>~$100K+ / month</span>
              <br />
              Qdrant multi-node self-host: <span style={{ color: C.green }}>~$25K / month</span>
              <br />
              Milvus on K8s: similar to Qdrant at this scale
              <br />
              annual savings <span style={{ color: C.orange }}>pay a whole platform engineer</span>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            answer: <span style={{ color: C.orange }}>Qdrant multi-node</span> or{" "}
            <span style={{ color: C.orange }}>Milvus</span>
            <br />
            the cost delta funds the ops headcount
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            At billion-scale, Pinecone is almost always the wrong answer unless the team truly cannot run
            infrastructure. The arithmetic is too stark.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Scenario D: spiky traffic with EU data residency -&gt; Pinecone region or Qdrant Cloud EU
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            European SaaS with GDPR obligations. Vectors must stay in EU. Traffic is spiky - workday peaks then evening
            silence. Two options: Pinecone Serverless in an EU region (simplest), or Qdrant Cloud in Frankfurt
            (self-host in EU data center). Both satisfy residency; spiky traffic slightly favors serverless.
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
              Scenario D profile
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
                { t: "Traffic", v: "spiky (10:1 daily range)" },
                { t: "Residency", v: "EU only - GDPR" },
                { t: "Ops capacity", v: "some SRE but limited" },
              ].map((r) => (
                <div
                  key={r.t}
                  style={{
                    padding: "10px 12px",
                    background: `${C.red}08`,
                    border: `1px solid ${C.red}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold size={14}>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.v}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                name: "Pinecone EU region",
                pro: "scale-to-zero, pre-approved GDPR, minimal ops",
                con: "higher $/query, Pinecone holds keys",
                color: C.orange,
              },
              {
                name: "Qdrant Cloud EU",
                pro: "self-host in your VPC, lower $/query at scale",
                con: "ops for the VPC side, region is eu-central-1",
                color: C.green,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  <strong>Pro:</strong> {r.pro}
                </T>
                <T color="#ef9a9a" size={13} style={{ marginTop: 4 }}>
                  <strong>Con:</strong> {r.con}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            answer: spiky + no ops <span style={{ color: C.red }}>-&gt; Pinecone EU</span>
            <br />
            spiky + some ops + cost focus <span style={{ color: C.red }}>-&gt; Qdrant Cloud EU</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The residency question is rarely the hard part anymore - both vendors support EU. The tiebreaker is back to
            ops capacity and cost sensitivity.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decision flowchart tying it all together
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Fold the four scenarios back into axes and you get a compact decision flowchart. Most real teams can read
            off their own answer in under a minute by walking the three forks in order: ops capacity first, then scale,
            then filter complexity.
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
              The decision flowchart
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: C.purple }}>Q1:</span> can your team run infrastructure?
              <br />
              &nbsp;&nbsp;no -&gt; <span style={{ color: C.orange }}>Pinecone</span> (serverless if spiky, pods if
              steady)
              <br />
              &nbsp;&nbsp;yes -&gt; proceed to Q2
              <br />
              <br />
              <span style={{ color: C.purple }}>Q2:</span> scale and filter complexity?
              <br />
              &nbsp;&nbsp;&lt; 10M + simple filters -&gt; <span style={{ color: C.green }}>either</span> works; pgvector
              if Postgres
              <br />
              &nbsp;&nbsp;10M-100M + complex filters -&gt; <span style={{ color: C.green }}>Qdrant</span> self-host
              <br />
              &nbsp;&nbsp;100M-1B+ steady high QPS -&gt; <span style={{ color: C.green }}>
                Qdrant multi-node
              </span> or <span style={{ color: C.green }}>Milvus</span>
              <br />
              <br />
              <span style={{ color: C.purple }}>Q3:</span> residency or compliance constraints?
              <br />
              &nbsp;&nbsp;apply region constraint on top; both vendors offer EU / regional options
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                t: "Pinecone shines",
                items: [
                  "team has no ops capacity",
                  "workload is spiky / low duty-cycle",
                  "speed to market matters most",
                  "compliance pre-certified is a requirement",
                ],
                color: C.orange,
              },
              {
                t: "Qdrant shines",
                items: [
                  "team has ops capacity",
                  "filters are complex or compound",
                  "steady traffic + cost sensitivity",
                  "data must stay in your own infra",
                ],
                color: C.green,
              },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.t}
                </T>
                <ul style={{ margin: "10px 0 0 20px", padding: 0, color: C.bright, fontSize: 14, lineHeight: 1.7 }}>
                  {r.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every real decision has edge cases, but starting from the flowchart makes the discussion concrete. The next
            chapters sweep up the remaining systems and feed back into the capstone framework.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.34 Weaviate / Milvus / Chroma
// ───────────────────────────────────────────────────────────────────────────

export const WeaviateMilvusChroma = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Weaviate: Go, self-host, built-in modules
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Weaviate is a Go-based vector database with open-source core and an optional managed cloud. Its defining
            feature is the module system: pre-wired integrations for transformer embeddings (text2vec-openai,
            text2vec-cohere, text2vec-huggingface), generative steps (generative-openai), and Q&amp;A - the vector DB
            becomes a RAG pipeline rather than just a store.
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
              Weaviate at a glance
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
                { t: "Language", d: "Go - self-hostable, Docker-friendly", color: C.cyan },
                { t: "Modules", d: "transformers, generative, Q&A, reranker", color: C.purple },
                { t: "API", d: "GraphQL + REST + gRPC", color: C.yellow },
              ].map((r) => (
                <div
                  key={r.t}
                  style={{
                    padding: "12px 14px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}22`,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={15}>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                    {r.d}
                  </T>
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            pick if: you want <span style={{ color: C.cyan }}>modular RAG pipelines</span>
            <br />
            out-of-the-box integrations for embedding and generation
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Weaviate is popular with teams building RAG where the embedding + retrieval + generation stack lives in one
            product. If you want less glue code, Weaviate covers more of the flow.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Milvus: Go + C++, distributed-native, billions of vectors
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Milvus is the answer when you need to scale to billions of vectors as the baseline. Written in Go + C++, it
            embeds FAISS-style algorithms inside a distributed cluster architecture from day one. The separation of
            storage, index, and query nodes lets each scale independently. Azure AI Search uses Milvus&apos; core
            algorithms under the hood.
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
              Milvus architecture
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              separated <span style={{ color: C.yellow }}>storage</span>, <span style={{ color: C.yellow }}>index</span>
              , <span style={{ color: C.yellow }}>query</span> tiers
              <br />
              scale each independently based on the bottleneck
              <br />
              storage tier -&gt; object store / S3
              <br />
              query tier -&gt; in-memory index replicas
              <br />
              handles <span style={{ color: C.yellow }}>billions of vectors</span> in a single cluster
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { t: "Distributed-native", d: "built for multi-node from the start, not bolted on" },
              { t: "Azure AI Search core", d: "Milvus algorithms power Azure&apos;s managed vector search" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.yellow} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }} dangerouslySetInnerHTML={{ __html: r.d }} />
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Milvus shines when the first production number is 500M or more. Below that, the distributed machinery is
            overhead; above it, nothing else self-hosted is quite as ready for the scale.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Chroma: Python-first, local / embedded, prototyping
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Chroma is the prototyping-friendly one. Python-first API, runs locally or embedded in your process, no
            server required for small workloads. Store it on disk, ship your app with the vector DB inside. Many
            LangChain and LlamaIndex tutorials use Chroma because it works in a notebook without any setup.
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
              Chroma from Python in four lines
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              import <span style={{ color: C.green }}>chromadb</span>
              <br />
              client = chromadb.PersistentClient(path=&quot;./cats-db&quot;)
              <br />
              col = client.create_collection(&quot;cats&quot;)
              <br />
              col.add(ids=[...], embeddings=[...], metadatas=[...])
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "Python-first", d: "the API is pure Python, not a wrapper over a client" },
              { t: "Embedded / local", d: "runs in-process, persists to a single directory on disk" },
              { t: "Prototype + small-scale", d: "perfect for notebooks and small production workloads" },
            ].map((r) => (
              <div
                key={r.t}
                style={{
                  padding: "12px 14px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.green} bold size={15}>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.d}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Chroma is the right first stop for tutorials, prototypes, and local dev. At production scale (&gt; 10M
            vectors, high QPS), graduate to one of the other systems.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Elastic / OpenSearch: if you already run Elastic, dense_vector is compelling
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            If your team already runs an Elasticsearch or OpenSearch cluster for log search and full-text queries,
            adding vector search is a one-field change. Both products now support a `dense_vector` field with HNSW
            indexes; hybrid search with BM25 is native because Elastic was always a BM25 engine. The bar to add vectors
            is lower than introducing a new database.
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
              Adding a dense_vector field to an existing Elastic index
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              {"{"} &quot;mappings&quot;: {"{"} &quot;properties&quot;: {"{"}
              <br />
              &nbsp;&nbsp;&quot;embedding&quot;: {"{"} &quot;type&quot;:{" "}
              <span style={{ color: C.orange }}>&quot;dense_vector&quot;</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;dims&quot;: <span style={{ color: C.orange }}>768</span>,
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;index&quot;: true, &quot;similarity&quot;: &quot;cosine&quot; {"}"}
              <br />
              {"}"} {"}"} {"}"}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            pick if: your team <span style={{ color: C.orange }}>already runs Elastic / OpenSearch</span>
            <br />
            unified search across logs, text, and vectors
            <br />
            hybrid BM25 + dense is native, not bolted on
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The argument for Elastic+vector is almost entirely operational: zero new infrastructure, one query language.
            If vector is incidental to a larger search product, this often wins.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            When each is the right pick - context-dependent summary
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Four products, four different sweet spots. None is strictly better than the others - the right fit depends
            on the existing stack, the team&apos;s skill set, and whether vector search is the main product or a feature
            of a larger one.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                name: "Weaviate",
                pick: "modular RAG pipelines where embedding + generation should live with the DB",
                color: C.cyan,
              },
              {
                name: "Milvus",
                pick: "baseline scale is billions, distributed from day one, often via Azure AI Search",
                color: C.yellow,
              },
              {
                name: "Chroma",
                pick: "notebooks, prototypes, local dev, tutorial flows, small-scale production",
                color: C.green,
              },
              {
                name: "Elastic / OpenSearch",
                pick: "already runs Elastic; vector is an addition, not the main feature",
                color: C.orange,
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={16}>
                  {r.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {r.pick}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            no single winner - <span style={{ color: C.purple }}>context picks the product</span>
            <br />
            the decision framework in 11.35 pulls all seven systems together
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One chapter can only skim each of these. Each has enough nuance for a deep dive of its own; the goal here
            was to place them on the map next to Qdrant and Pinecone.
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

// ───────────────────────────────────────────────────────────────────────────
// 11.35 The Decision Framework
// ───────────────────────────────────────────────────────────────────────────

export const DecisionFramework = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Decision Framework (stub)
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
