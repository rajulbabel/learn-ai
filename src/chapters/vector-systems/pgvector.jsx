import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";

export default function Pgvector(ctx) {
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
              Your existing Postgres instance now speaks vectors
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
              { t: "Same database", d: "One Postgres for rows + vectors, same connection, same user" },
              { t: "Same operational model", d: "Backups, replication, monitoring you already run" },
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
                <T color={C.cyan} bold size={15} center>
                  {r.t}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
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
              { op: "<=>", name: "Cosine", color: C.yellow, when: "Default for text embeddings" },
              { op: "<->", name: "L2 Euclidean", color: C.green, when: "Some vision embeddings" },
              { op: "<#>", name: "Negative inner product", color: C.purple, when: "Normalized + fast" },
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
                <T color={r.color} bold size={18} style={{ fontFamily: "monospace" }} center>
                  {r.op}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                  {r.name}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 4, fontStyle: "italic" }} center>
                  {r.when}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Cosine is the default because SBERT-family embeddings are direction-carriers, not magnitude-carriers. See{" "}
            <ChapterLink to="15.4">chapter 15.4</ChapterLink> for the cosine / L2 / inner-product discussion.
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
                note: "Better recall + latency, slower to build",
                color: C.green,
              },
              {
                name: "IVFFlat",
                params: ["lists = sqrt(N)", "probes = sqrt(lists)", "Fast to build"],
                note: "Smaller memory, needs tuning per size",
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
              { t: "Transactions + ACID", d: "Insert a row and its vector in one atomic write" },
              { t: "SQL joins", d: "Join docs to users to permissions to embeddings, same query" },
              { t: "Rich metadata queries", d: "GIN indexes on JSONB, partial indexes, window functions" },
              { t: "Existing ops", d: "Backups, WAL replication, monitoring, PITR already in place" },
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
              { t: "Under 10M vectors", d: "Fits comfortably on one Postgres instance with HNSW" },
              { t: "Metadata-heavy queries", d: "Complex SQL filters and joins across related tables" },
              { t: "Existing Postgres team", d: "No new ops paging rotation, no extra vendor contract" },
              { t: "Moderate QPS (under 1K)", d: "Postgres handles the load without horizontal scale" },
              { t: "Strict consistency", d: "ACID transactions span rows and vectors together" },
              { t: "Fast prototyping", d: "No new infra: enable the extension and ship today" },
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
            The right answer <span style={{ color: C.green }}>more often than people think</span>
            <br />
            Especially when you already have a Postgres team
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
              { t: "Over 100M vectors", d: "Single-node Postgres RAM stops being realistic" },
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
            Time to look at Qdrant, Pinecone, or Milvus
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
}
