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
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            pgvector (stub)
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

// ───────────────────────────────────────────────────────────────────────────
// 11.31 Qdrant
// ───────────────────────────────────────────────────────────────────────────

export const Qdrant = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Qdrant (stub)
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

// ───────────────────────────────────────────────────────────────────────────
// 11.32 Pinecone
// ───────────────────────────────────────────────────────────────────────────

export const Pinecone = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Pinecone (stub)
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

// ───────────────────────────────────────────────────────────────────────────
// 11.33 Qdrant vs Pinecone
// ───────────────────────────────────────────────────────────────────────────

export const QdrantVsPinecone = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Qdrant vs Pinecone (stub)
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

// ───────────────────────────────────────────────────────────────────────────
// 11.34 Weaviate / Milvus / Chroma
// ───────────────────────────────────────────────────────────────────────────

export const WeaviateMilvusChroma = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Weaviate / Milvus / Chroma (stub)
          </T>
        </Box>
      )}
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
