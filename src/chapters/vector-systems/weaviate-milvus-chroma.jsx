import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function WeaviateMilvusChroma(ctx) {
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
                { t: "Modules", d: "Transformers, generative, Q&A, reranker", color: C.purple },
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
                  <T color={r.color} bold center size={15}>
                    {r.t}
                  </T>
                  <T color={C.bright} center size={13} style={{ marginTop: 4 }}>
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
            Pick if: you want <span style={{ color: C.cyan }}>modular RAG pipelines</span>
            <br />
            Out-of-the-box integrations for embedding and generation
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
              Separated <span style={{ color: C.yellow }}>storage</span>, <span style={{ color: C.yellow }}>index</span>
              , <span style={{ color: C.yellow }}>query</span> tiers
              <br />
              Scale each independently based on the bottleneck
              <br />
              Storage tier -&gt; object store / S3
              <br />
              Query tier -&gt; in-memory index replicas
              <br />
              Handles <span style={{ color: C.yellow }}>billions of vectors</span> in a single cluster
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
              { t: "Distributed-native", d: "Built for multi-node from the start, not bolted on" },
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
              { t: "Python-first", d: "The API is pure Python, not a wrapper over a client" },
              { t: "Embedded / local", d: "Runs in-process, persists to a single directory on disk" },
              { t: "Prototype + small-scale", d: "Perfect for notebooks and small production workloads" },
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
            Pick if: your team <span style={{ color: C.orange }}>already runs Elastic / OpenSearch</span>
            <br />
            Unified search across logs, text, and vectors
            <br />
            Hybrid BM25 + dense is native, not bolted on
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
                pick: "Modular RAG pipelines where embedding + generation should live with the DB",
                color: C.cyan,
              },
              {
                name: "Milvus",
                pick: "Baseline scale is billions, distributed from day one, often via Azure AI Search",
                color: C.yellow,
              },
              {
                name: "Chroma",
                pick: "Notebooks, prototypes, local dev, tutorial flows, small-scale production",
                color: C.green,
              },
              {
                name: "Elastic / OpenSearch",
                pick: "Already runs Elastic; vector is an addition, not the main feature",
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
            No single winner - <span style={{ color: C.purple }}>context picks the product</span>
            <br />
            The decision framework in 11.37 pulls all seven systems together
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
}
