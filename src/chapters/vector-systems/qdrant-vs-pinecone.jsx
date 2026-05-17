import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function QdrantVsPinecone(ctx) {
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
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Axis</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Qdrant</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Pinecone</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Comment</div>
              {[
                { axis: "Ops preference", q: "Self-host", p: "Managed", n: "Who runs it" },
                { axis: "Filter complexity", q: "Inline HNSW", p: "Post-filter", n: "Qdrant deeper" },
                { axis: "Scale-to-zero", q: "No", p: "Serverless", n: "Pinecone unique" },
                { axis: "Cost at steady 1B", q: "Cheaper", p: "Premium", n: "Ops capacity needed" },
                { axis: "Feature depth", q: "More knobs", p: "Fewer, opinionated", n: "Pick your poison" },
                { axis: "Ecosystem maturity", q: "Growing", p: "Battle-tested", n: "Both solid today" },
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
                { t: "Traffic", v: "Unknown / bursty" },
                { t: "Ops capacity", v: "None" },
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
                  <T color={C.yellow} bold size={14} center>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
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
            Answer: <span style={{ color: C.yellow }}>Pinecone Serverless</span>
            <br />
            Zero infrastructure, scale-to-zero when idle, pay per query
            <br />
            Revisit at 100K/day sustained traffic
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
                { t: "Filters", v: "Complex compound predicates" },
                { t: "Ops capacity", v: "One Postgres DBA + SRE on-call" },
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
                  <T color={C.green} bold size={14} center>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
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
            Answer: <span style={{ color: C.green }}>Qdrant self-host</span>
            <br />
            Inline filtered-HNSW wins across the full selectivity range
            <br />
            Saves ~$22K/month vs managed Pinecone at 10M scale
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
                { t: "Ops capacity", v: "Dedicated platform team" },
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
                  <T color={C.orange} bold size={14} center>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
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
              Annual savings <span style={{ color: C.orange }}>pay a whole platform engineer</span>
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
            Answer: <span style={{ color: C.orange }}>Qdrant multi-node</span> or{" "}
            <span style={{ color: C.orange }}>Milvus</span>
            <br />
            The cost delta funds the ops headcount
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
                { t: "Traffic", v: "Spiky (10:1 daily range)" },
                { t: "Residency", v: "EU only - GDPR" },
                { t: "Ops capacity", v: "Some SRE but limited" },
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
                  <T color={C.red} bold size={14} center>
                    {r.t}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
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
                pro: "Scale-to-zero, pre-approved GDPR, minimal ops",
                con: "Higher $/query, Pinecone holds keys",
                color: C.orange,
              },
              {
                name: "Qdrant Cloud EU",
                pro: "Self-host in your VPC, lower $/query at scale",
                con: "Ops for the VPC side, region is eu-central-1",
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
            Answer: spiky + no ops <span style={{ color: C.red }}>-&gt; Pinecone EU</span>
            <br />
            Spiky + some ops + cost focus <span style={{ color: C.red }}>-&gt; Qdrant Cloud EU</span>
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
              <span style={{ color: C.purple }}>Q1:</span> Can your team run infrastructure?
              <br />
              &nbsp;&nbsp;No -&gt; <span style={{ color: C.orange }}>Pinecone</span> (serverless if spiky, pods if
              steady)
              <br />
              &nbsp;&nbsp;Yes -&gt; proceed to Q2
              <br />
              <br />
              <span style={{ color: C.purple }}>Q2:</span> Scale and filter complexity?
              <br />
              &nbsp;&nbsp;&lt; 10M + simple filters -&gt; <span style={{ color: C.green }}>Either</span> works; pgvector
              if Postgres
              <br />
              &nbsp;&nbsp;10M-100M + complex filters -&gt; <span style={{ color: C.green }}>Qdrant</span> self-host
              <br />
              &nbsp;&nbsp;100M-1B+ steady high QPS -&gt; <span style={{ color: C.green }}>
                Qdrant multi-node
              </span> or <span style={{ color: C.green }}>Milvus</span>
              <br />
              <br />
              <span style={{ color: C.purple }}>Q3:</span> Residency or compliance constraints?
              <br />
              &nbsp;&nbsp;Apply region constraint on top; both vendors offer EU / regional options
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
                  "Team has no ops capacity",
                  "Workload is spiky / low duty-cycle",
                  "Speed to market matters most",
                  "Compliance pre-certified is a requirement",
                ],
                color: C.orange,
              },
              {
                t: "Qdrant shines",
                items: [
                  "Team has ops capacity",
                  "Filters are complex or compound",
                  "Steady traffic + cost sensitivity",
                  "Data must stay in your own infra",
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
}
