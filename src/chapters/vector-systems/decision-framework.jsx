import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";

export default function DecisionFramework(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The decision flowchart: data size -&gt; ops team -&gt; filter complexity -&gt; cost band
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Section 11 started with the retrieval problem and walked through brute-force, ANN algorithms, compression,
            production realities, and the system landscape. This final chapter folds it all into an actionable
            flowchart. The four decisive axes, in the order a real team should walk them: data size, ops capacity,
            filter complexity, cost band.
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
              The four-branch decision flowchart
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <svg viewBox="0 0 640 380" style={{ width: "100%", maxWidth: 640, height: "auto" }}>
                <desc>
                  Four-branch decision flowchart for picking a vector database. Starting from a root node &quot;new
                  vector-search feature&quot;, the first branch is data size with four buckets (under 1M, 1M-100M,
                  100M-1B, over 1B). Each bucket routes to a recommended system: pgvector or Chroma at the small end,
                  Qdrant or Pinecone in the middle, Qdrant multi-node or Milvus at large scale, Milvus or Vespa at
                  billion-plus scale. The chart visualizes how scale alone narrows the shortlist.
                </desc>
                <rect
                  x={230}
                  y={10}
                  width={180}
                  height={48}
                  rx={8}
                  fill={`${C.cyan}22`}
                  stroke={C.cyan}
                  strokeWidth={2}
                />
                <text x={320} y={33} fill={C.cyan} fontSize={15} fontWeight="bold" textAnchor="middle">
                  New vector-search feature
                </text>
                <text x={320} y={50} fill={C.bright} fontSize={11} textAnchor="middle">
                  Start here
                </text>
                <text x={320} y={75} fill={C.dim} fontSize={12} textAnchor="middle">
                  Axis 1: data size
                </text>
                <line x1={320} y1={58} x2={320} y2={85} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={110} x2={560} y2={110} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={110} x2={80} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={240} y1={110} x2={240} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={400} y1={110} x2={400} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={560} y1={110} x2={560} y2={130} stroke={C.dim} strokeWidth={1} />
                <line x1={320} y1={85} x2={320} y2={110} stroke={C.dim} strokeWidth={1} />
                {[
                  { x: 10, label: "< 1M", color: C.green, pick: "pgvector\nChroma" },
                  { x: 170, label: "1M - 100M", color: C.yellow, pick: "Qdrant\nPinecone\npgvector" },
                  { x: 330, label: "100M - 1B", color: C.orange, pick: "Qdrant\nmulti-node\nMilvus" },
                  { x: 490, label: "> 1B", color: C.red, pick: "Milvus\nVespa" },
                ].map((r) => (
                  <g key={r.label}>
                    <rect
                      x={r.x}
                      y={130}
                      width={140}
                      height={44}
                      rx={6}
                      fill={`${r.color}18`}
                      stroke={r.color}
                      strokeWidth={2}
                    />
                    <text x={r.x + 70} y={158} fill={r.color} fontSize={14} fontWeight="bold" textAnchor="middle">
                      {r.label}
                    </text>
                    <line x1={r.x + 70} y1={174} x2={r.x + 70} y2={200} stroke={C.dim} strokeWidth={1} />
                    {r.pick.split("\n").map((line, i) => (
                      <text key={line} x={r.x + 70} y={220 + i * 16} fill={C.bright} fontSize={12} textAnchor="middle">
                        {line}
                      </text>
                    ))}
                  </g>
                ))}
                <text x={320} y={300} fill={C.dim} fontSize={12} textAnchor="middle">
                  Axis 2: ops capacity -&gt; narrow further
                </text>
                <text x={320} y={322} fill={C.dim} fontSize={12} textAnchor="middle">
                  Axis 3: filter complexity -&gt; favor Qdrant when compound
                </text>
                <text x={320} y={344} fill={C.dim} fontSize={12} textAnchor="middle">
                  Axis 4: cost band -&gt; per-million-vector and per-million-query ratios
                </text>
                <text x={320} y={370} fill={C.cyan} fontSize={12} fontWeight="bold" textAnchor="middle">
                  Fold all four -&gt; single vendor shortlist
                </text>
              </svg>
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Each branch below is one axis of this flowchart in more detail. By the end, you can pull up this chapter in
            a design review and walk a team through the decision live.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Axis 1: size buckets - under 1M / 1M-100M / 100M-1B / over 1B
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Data size is the first filter because it rules out entire categories fast. A 500K-vector corpus has a
            different shortlist than a 2B-vector corpus. The buckets are rough - the breakpoints are where the
            operational math starts to shift, not hard thresholds.
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
                bucket: "< 1M",
                defaults: ["pgvector", "Chroma", "any really"],
                note: "Almost anything works, pick by convenience",
                color: C.green,
              },
              {
                bucket: "1M - 100M",
                defaults: ["Qdrant", "Pinecone", "pgvector"],
                note: "Real decision space; axes 2-4 matter",
                color: C.yellow,
              },
              {
                bucket: "100M - 1B",
                defaults: ["Qdrant multi-node", "Milvus"],
                note: "Self-host starts to dominate on cost",
                color: C.orange,
              },
              {
                bucket: "> 1B",
                defaults: ["Milvus", "Vespa", "Qdrant at limit"],
                note: "Distributed-native is no longer optional",
                color: C.red,
              },
            ].map((r) => (
              <div
                key={r.bucket}
                style={{
                  padding: "12px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.bucket}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                    lineHeight: 1.6,
                  }}
                >
                  {r.defaults.join(" / ")}
                </div>
                <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }} center>
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
            Rule of thumb: <span style={{ color: C.yellow }}>N vectors &middot; 3 KB</span> per vector at d=768
            <br />
            1M = 3 GB, 100M = 300 GB, 1B = 3 TB
            <br />
            When the memory number gets scary, time to shift buckets
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Size alone rarely decides the product, but it reliably narrows the shortlist from seven to two or three.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Axis 2: ops preference - none / self-host / Postgres-native
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Ops capacity is the second filter because it changes which products are even acceptable. A team with no SRE
            rotation cannot run Milvus at scale no matter how much cheaper it is. A team that already runs Postgres can
            add pgvector without adding vendor risk.
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
              Three postures, three product families
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
                  posture: "None (managed)",
                  picks: ["Pinecone", "Pinecone Serverless", "Weaviate Cloud"],
                  note: "Zero ops; higher $/query",
                  color: C.orange,
                },
                {
                  posture: "Self-host",
                  picks: ["Qdrant", "Milvus", "Weaviate OSS"],
                  note: "You run it; lower $/query",
                  color: C.green,
                },
                {
                  posture: "Postgres-native",
                  picks: ["pgvector"],
                  note: "Reuses existing DB; fits up to 10M-100M",
                  color: C.cyan,
                },
              ].map((r) => (
                <div
                  key={r.posture}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}10`,
                    border: `1px solid ${r.color}22`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold center size={15}>
                    {r.posture}
                  </T>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: C.bright,
                      lineHeight: 1.6,
                    }}
                  >
                    {r.picks.join(" / ")}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }} center>
                    {r.note}
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
            Ops capacity is <span style={{ color: C.green }}>not a preference</span>, it is a constraint
            <br />
            Even a cheap product is expensive if your team cannot run it
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The honest conversation in design reviews is usually about ops capacity. Teams that want Qdrant but do not
            yet run infrastructure should pick Pinecone until that changes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Axis 3: filter complexity - simple / complex / analytical joins
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Filtering is where products separate most. Simple filters (tenant_id = 42) work on everything. Complex
            compound filters (tenant + geo + date + ACL) exercise the vendor; Qdrant&apos;s inline filtered-HNSW (
            <ChapterLink to="17.1">chapter 17.1</ChapterLink>) wins. When the query involves SQL-shaped joins to rows
            in other tables, pgvector is the right answer because Postgres has always been good at that.
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
              {
                kind: "Simple filter",
                example: "tenant_id = 42",
                winner: "All products fine; pick by other axes",
                color: C.green,
              },
              {
                kind: "Complex compound",
                example: "Tenant AND region AND role AND published_after",
                winner: "Qdrant inline filtered-HNSW shines",
                color: C.yellow,
              },
              {
                kind: "Analytical / joins",
                example: "JOIN users ON permissions, window functions",
                winner: "pgvector is the right answer",
                color: C.cyan,
              },
            ].map((r) => (
              <div
                key={r.kind}
                style={{
                  padding: "12px 14px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: 8,
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.kind}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 8, fontFamily: "monospace" }}>
                  {r.example}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {r.winner}
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
            Mismatched filter complexity is <span style={{ color: C.orange }}>the #1 post-launch surprise</span>
            <br />
            Read 17.1 carefully before committing
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Teams often underestimate filter complexity until the product is in flight. The first selectivity-edge-case
            bug surfaces at 2am and the wrong product choice is expensive to undo.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Design-review checklist: questions to ask about every proposed system
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Before signing off on a vector-DB pick, a design review should cover these eight questions. Any one left
            unanswered is a future incident. This checklist is the practical output of Section 11 - if the team can
            answer these for their workload, they have the knowledge to defend the decision.
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
                q: "Data size",
                ref: (
                  <>
                    chapters <ChapterLink to="15.2">15.2</ChapterLink>, <ChapterLink to="16.1">16.1</ChapterLink>,{" "}
                    <ChapterLink to="17.10">17.10</ChapterLink>
                  </>
                ),
                what: "N now, N in 18 months; d of the embedding model",
              },
              {
                q: "Update frequency",
                ref: <ChapterLink to="17.2">chapter 17.2</ChapterLink>,
                what: "Inserts/sec, deletes/sec; tombstone tolerance; rebuild cadence",
              },
              {
                q: "Filter selectivity",
                ref: <ChapterLink to="17.1">chapter 17.1</ChapterLink>,
                what: "Tight (0.1%) vs loose (50%); compound predicates",
              },
              {
                q: "QPS budget",
                ref: <ChapterLink to="17.10">chapter 17.10</ChapterLink>,
                what: "Peak QPS, sustained QPS, ratio, seasonal spikes",
              },
              {
                q: "P99 target",
                ref: <ChapterLink to="17.9">chapter 17.9</ChapterLink>,
                what: "Latency budget, tail behavior, cold-start tolerance",
              },
              {
                q: "Availability target",
                ref: (
                  <>
                    chapters <ChapterLink to="17.4">17.4</ChapterLink>, <ChapterLink to="17.9">17.9</ChapterLink>
                  </>
                ),
                what: "SLA (99.9% vs 99.99%); failover story; multi-region",
              },
              {
                q: "Embedding model stability",
                ref: <ChapterLink to="17.8">chapter 17.8</ChapterLink>,
                what: "Drift plan; re-embedding cost; migration path",
              },
              {
                q: "Ops capacity",
                ref: (
                  <>
                    chapters <ChapterLink to="18.2">18.2</ChapterLink> - <ChapterLink to="18.6">18.6</ChapterLink>
                  </>
                ),
                what: "SRE hours, on-call rotation, K8s familiarity",
              },
            ].map((r) => (
              <div
                key={r.q}
                style={{
                  padding: "12px 14px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}22`,
                  borderRadius: 8,
                }}
              >
                <T color={C.red} bold size={15}>
                  {r.q}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.what}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 4, fontStyle: "italic" }}>
                  See: {r.ref}
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
            Eight questions, <span style={{ color: C.red }}>one per axis</span>
            <br />
            If you can answer all eight, the vendor choice defends itself
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Keep this checklist in the design-review template. Unanswered questions reliably become post-launch
            incidents.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Recap: Section 11 master class - Qdrant vs Pinecone from first principles
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Section 11 has covered the full vector database landscape. From the retrieval problem (15.1) through
            brute-force kNN (15.2), the ANN family (15.5-15.11), compression (15.12-16.4), combined indexes (16.5-16.6),
            the compression decision (16.7), production realities (16.8-17.9), and the system comparison (17.10-18.5).
            You can now answer Qdrant vs Pinecone - and every related question - from first principles.
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
              What the learner can now do
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
                  t: "Master HNSW parameters",
                  d: "Tune M, ef_construction, ef_search per workload with confidence",
                },
                {
                  t: "Reason about compression",
                  d: "Pick scalar, PQ, binary, or Matryoshka for the recall/memory budget at hand",
                },
                {
                  t: "Predict filtered-search behavior",
                  d: "Explain why pre-filter, post-filter, or inline wins at each selectivity band",
                },
                {
                  t: "Size a real deployment",
                  d: "Compute RAM, CPU, nodes, cost from N, d, QPS, and filter assumptions",
                },
                {
                  t: "Answer vendor questions from first principles",
                  d: "Not just Qdrant vs Pinecone; any new system fits into the same framework",
                },
                {
                  t: "Lead a design review",
                  d: "Walk the checklist, defend a pick, and catch future incidents in advance",
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
            Section 11 <span style={{ color: C.purple }}>master class complete</span>
            <br />
            From retrieval problem to vendor decision, first principles end-to-end
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            That is the goal: not memorized product matrices that age, but the framework to re-derive the right pick as
            vendors, models, and hardware change.
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
