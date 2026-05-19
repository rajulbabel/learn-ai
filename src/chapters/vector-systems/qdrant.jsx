import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Qdrant(ctx) {
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
              { t: "Deploy", d: "Single binary, Docker image, K8s operator" },
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
            Qdrant&apos;s core index is HNSW, same as chapter 15.10. What makes it distinctive is the filter story.
            Recall from 17.1: the three strategies are pre-filter, post-filter, and inline. Qdrant implements inline
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
                  what: "Filter first, brute-force survivors",
                  pain: "Slow for loose filters",
                  color: C.red,
                },
                {
                  name: "Post-filter",
                  what: "ANN then drop misses",
                  pain: "Empty / short results at 0.1%",
                  color: C.orange,
                },
                {
                  name: "Qdrant inline",
                  what: "Check predicate during hop",
                  pain: "Best across all selectivities",
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
                  <T color={r.color} bold center size={15}>
                    {r.name}
                  </T>
                  <T color={C.bright} center size={12} style={{ marginTop: 4 }}>
                    {r.what}
                  </T>
                  <T color={C.dim} center size={11} style={{ marginTop: 4, fontStyle: "italic" }}>
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
              Predicate cost is ~1 pointer dereference per hop
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Qdrant built a dedicated payload index (inverted index over metadata) so filter evaluation is essentially
            free during traversal. This is why Qdrant wins chapter 17.1&apos;s filter-heavy scenarios.
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
                d: "One point can store several named vectors (title, body, image) in the same record - native support since v1.10 (chapter 17.7)",
                color: C.green,
              },
              {
                t: "Payload is just JSON",
                d: "Arbitrary nested metadata, indexed types: keyword, int, float, geo, datetime",
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
            Qdrant ships the main compression schemes as configurable flags on a collection. You turn on scalar
            quantization (SQ), product quantization (PQ), or binary quantization (BQ) at collection create time; the
            HNSW index below it adapts. Hybrid search (BM25 + vector, RRF fusion from 17.5) is also first-class.
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
                note: "Float32 -> int8 per dim",
                color: C.orange,
              },
              {
                name: "Product (PQ)",
                win: "~32x memory, recall tuning",
                note: "M=96 subvectors, 256 codes",
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
                <T color={r.color} bold center size={15}>
                  {r.name}
                </T>
                <T color={C.bright} center size={13} style={{ marginTop: 6 }}>
                  {r.win}
                </T>
                <T color={C.dim} center size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
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
            Hybrid + multi-vector are first-class, not bolt-ons
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
                what: "Download, `./qdrant`, ready in seconds",
                when: "Laptop prototyping, tests, CI",
                color: C.cyan,
              },
              {
                name: "Docker image",
                what: "`docker run qdrant/qdrant`",
                when: "Staging, small production, ops familiarity",
                color: C.yellow,
              },
              {
                name: "K8s operator",
                what: "Declarative cluster, HA, upgrades",
                when: "Production: multi-node, rolling upgrades",
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
                <T color={r.color} bold center size={15}>
                  {r.name}
                </T>
                <T color={C.bright} center size={13} style={{ marginTop: 6, fontFamily: "monospace" }}>
                  {r.what}
                </T>
                <T color={C.dim} center size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
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
            You control: <span style={{ color: C.red }}>persistence, backups, upgrades, replication</span>
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
                d: "You page for incidents, handle upgrades, run backups, design HA - operational cost is real",
              },
              {
                t: "Multi-region story is newer",
                d: "Active-active replication and regional failover are more mature in Pinecone and Elastic",
              },
              {
                t: "Smaller ecosystem than Elastic",
                d: "Fewer third-party tools, dashboards, plugins; the community is growing but still smaller",
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
            Great fit when: <span style={{ color: C.purple }}>ops capacity exists</span> +{" "}
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
}
