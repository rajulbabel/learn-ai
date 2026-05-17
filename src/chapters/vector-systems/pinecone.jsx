import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Pinecone(ctx) {
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
              { t: "Proprietary", d: "Closed-source core, pay-per-use pricing" },
              { t: "Opinionated defaults", d: "Index type, shard count, replication decided for you" },
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
                  tier: "P1 pod",
                  what: "CPU-tuned, cheaper, lower QPS per pod",
                  when: "Cost-sensitive, moderate QPS workloads",
                  color: C.yellow,
                },
                {
                  tier: "P2 pod",
                  what: "Memory + performance tuned, higher QPS",
                  when: "Latency-sensitive, high-QPS workloads",
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
                  <T color={r.color} bold center size={16}>
                    {r.tier}
                  </T>
                  <T color={C.bright} center size={13} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                  <T color={C.dim} center size={12} style={{ marginTop: 4, fontStyle: "italic" }}>
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
            Scale by <span style={{ color: C.yellow }}>adding pods</span> (each pod = one shard)
            <br />
            Replicas added for throughput and availability, multiplies cost
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
              { phase: "Idle", cost: "Storage only", latency: "-", note: "Cheap, no compute running" },
              { phase: "Cold start", cost: "Compute spin-up", latency: "~1 s tax", note: "First query after idle" },
              { phase: "Warm", cost: "Per query", latency: "Normal", note: "Subsequent queries, millisecond" },
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
                <T color={C.green} bold size={15} center>
                  {r.phase}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace" }} center>
                  {r.cost}
                </T>
                <T color={C.cyan} size={12} style={{ marginTop: 4 }} center>
                  {r.latency}
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4, fontStyle: "italic" }} center>
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
              Bursty workload: 1K queries in an hour, idle the rest
              <br />
              Pod-based: pay <span style={{ color: C.red }}>all 24 hours</span> of pod time
              <br />
              Serverless: pay <span style={{ color: C.green }}>1 hour compute</span> + 24 hours cheap storage
              <br />
              Savings can be 10x at low, bursty duty-cycle
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
                d: "Bitmap-backed, evaluates per query, works with JSON predicates",
                color: C.orange,
              },
              {
                t: "Hybrid search",
                d: "Sparse + dense vector combined, learned sparse available",
                color: C.yellow,
              },
              {
                t: "Namespaces",
                d: "Per-tenant partitions in one index, no extra indexes to manage",
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
            Enough feature breadth for <span style={{ color: C.orange }}>most RAG-style apps</span>
            <br />
            Not as deep as Qdrant on filtering, not as broad as Elastic on ecosystem
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
              { t: "No ops team", d: "Startups, two-engineer projects, no SRE rotation" },
              { t: "Variable workloads", d: "Bursty traffic benefits from serverless scale-to-zero" },
              { t: "Fast time-to-market", d: "Ship in hours, no infra review, no provisioning" },
              { t: "Prototype / POC", d: "Validate product-market fit before committing ops budget" },
              {
                t: "Compliance off-the-shelf",
                d: "SOC 2, GDPR pre-arranged as part of the service",
              },
              {
                t: "Multi-tenant SaaS",
                d: "Namespaces cleanly partition tenant data without extra infra",
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
                d: "Proprietary system, migration requires re-indexing, no official Postgres-style portability",
              },
              {
                t: "Cost at scale",
                d: "~$30K/month for 500M vectors x 200 QPS (chapter 11.29); 4x-6x self-host Qdrant",
              },
              {
                t: "Opinionated scaling",
                d: "You cannot reshape sharding, pick HNSW parameters, or hand-tune the graph",
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
            Watch out at: <span style={{ color: C.red }}>steady high QPS</span> +{" "}
            <span style={{ color: C.red }}>100M+ vectors</span> +{" "}
            <span style={{ color: C.red }}>custom tuning needs</span>
            <br />
            That is when the math flips toward self-host
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
}
