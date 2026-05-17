import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Observability(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Latency tails matter most - P50, P95, P99
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Mean latency tells you almost nothing in production vector search. Queries are cheap most of the time; it is
            the slow tail that ruins a user&apos;s day. Observability starts with percentile-based latency tracking: P50
            for the median, P95 for &quot;what most users see at the worst&quot;, P99 for the worst 1% of queries. Alert
            budgets are written against the tail, not the average.
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
              Typical production percentile targets for HNSW search
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { name: "P50", target: "10 ms", color: C.green, note: "Median query" },
                { name: "P95", target: "30 ms", color: C.yellow, note: "95% of queries faster" },
                { name: "P99", target: "80 ms", color: C.orange, note: "99% of queries faster" },
                { name: "P99.9", target: "200 ms", color: C.red, note: "Tail blows up here" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={16} center>
                    {r.name}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color, textAlign: "center" }}
                  >
                    {r.target}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Mean masks the <span style={{ color: C.cyan }}>tail</span>
            <br />
            Alert on P99, watch P99.9, write the SLA against the tail
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The P99 is usually 5-10x the P50. Investments in caching, SIMD, and index tuning show up in the tail, not
            the mean.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Recall@k: periodic ground-truth sampling vs brute force
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ANN indexes are approximate. Without active monitoring, a regression in recall can go unnoticed for months.
            The cure is a periodic evaluation: sample K queries, compute the exact top-k via brute force on the full
            corpus, compare against what the ANN index returned. Recall@10 is the most common single number to track.
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
              Recall@10 sampling protocol
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
              Step 1: sample <span style={{ color: C.yellow }}>1,000 queries</span> from production traffic
              <br />
              Step 2: for each, compute exact top-10 via <span style={{ color: C.yellow }}>brute force</span>
              <br />
              Step 3: compare against ANN top-10 (intersection / 10)
              <br />
              Step 4: average over the 1,000 queries = recall@10
              <br />
              Step 5: repeat weekly, plot the trend
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The sample is cheap compared to the damage of not knowing. Even a slow brute-force run at 1K queries is
            minutes, not hours.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Per-query cost telemetry: cache hits, memory pages, CPU
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Beyond top-level latency, modern vector DBs emit per-query cost signals: how many memory pages were read,
            what fraction of the working set was already in the L3 cache, how many distance computations were performed,
            how much CPU each query consumed. These numbers are what you watch when latency regressions appear without
            any code change.
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
              Per-query cost signals
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
                { name: "L3 cache hit rate", what: "Fraction of hot graph pages served from CPU cache" },
                { name: "Memory pages read", what: "How many 4 KB pages touched per query" },
                { name: "Distance computations", what: "How many candidate comparisons" },
                { name: "CPU cycles per query", what: "Wall-clock profile of a typical query" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.green}08`,
                    border: `1px solid ${C.green}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold size={14} center>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                    {r.what}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A sudden dip in cache hit rate is the most common early warning. It usually means the working set grew or
            the graph layout changed after a rebuild.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            ANN-Benchmarks methodology - standard for comparing index configs
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            The open-source ANN-Benchmarks (github.com/erikbern/ann-benchmarks) is the standard way to compare index
            configurations. It plots queries per second (QPS) on the horizontal axis and recall on the vertical. Every
            point is a parameter combination; the Pareto frontier tells you what tradeoffs are even possible. Running it
            on your own data is the quickest way to pick HNSW or IVF parameters.
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
              ANN-Benchmarks QPS vs recall chart
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
              X-axis: <span style={{ color: C.orange }}>recall</span> (0.90 to 1.00)
              <br />
              Y-axis: <span style={{ color: C.orange }}>QPS</span> (log scale, queries per second)
              <br />
              Each curve = one index family (HNSW, IVF-PQ, Vamana)
              <br />
              Each point = one parameter combination
              <br />
              Winners sit on the Pareto frontier (upper-right)
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
            Methodology: same dataset, same hardware, same recall target
            <br />
            Fair comparison forces every system to trade QPS for recall
            <br />
            Run it on <span style={{ color: C.orange }}>your data</span>, not just the public datasets
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ANN-Benchmarks shows up in almost every paper, blog, and vendor comparison. Knowing how to read it is a
            baseline skill for evaluating vector DBs.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Dashboard layout: alert lines vs watch lines
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            A good production dashboard is the difference between catching a regression in 5 minutes and catching it via
            a customer email 3 days later. The core panel set for a vector search service: P99 latency (alert above
            SLA), recall@10 (alert below floor), cache hit rate (watch trend), index memory usage (watch growth).
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
              Core Grafana-style dashboard panels
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
                  name: "P99 latency",
                  kind: "ALERT",
                  threshold: "100 ms",
                  color: C.red,
                  why: "SLA violation if it stays above for 5 minutes",
                },
                {
                  name: "Recall@10",
                  kind: "ALERT",
                  threshold: "< 0.95",
                  color: C.red,
                  why: "Quality regression, investigate model or index",
                },
                {
                  name: "Cache hit rate",
                  kind: "WATCH",
                  threshold: "~0.85",
                  color: C.yellow,
                  why: "Degrades before latency shows symptoms",
                },
                {
                  name: "Index memory usage",
                  kind: "WATCH",
                  threshold: "60-70% RAM",
                  color: C.yellow,
                  why: "Growth predicts scale-up or shard",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <T color={r.color} bold size={14}>
                      {r.name}
                    </T>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: r.color,
                        fontWeight: "bold",
                      }}
                    >
                      {r.kind}
                    </div>
                  </div>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: C.bright }}>
                    {r.threshold}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {r.why}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Keep the number of alerts small. Alerts on everything train the team to ignore them. Two alerts you trust
            beats ten you mute.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The metric you did not measure is the one that hurts you
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Latency and recall are the headline metrics. The quiet ones that trip production: per-tenant distribution,
            filtered-query recall, cold-start latency on freshly scaled replicas, fan-out tail on multi-shard
            deployments. Every production incident has a postmortem that ends in &quot;we were not capturing X&quot;.
            Build the checklist before you need it.
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
              Observability checklist - questions a dashboard should answer
            </T>
            <ul style={{ marginTop: 8, paddingLeft: 22, fontSize: 14, color: C.bright, lineHeight: 1.8 }}>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>per-tenant latency</span>: is one customer
                degrading the P99 for everyone?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>filtered-query recall</span>: does recall tank
                when a predicate is tight?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>cold-start latency</span>: first query after a new
                replica is up - how long?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>fan-out tail</span>: slowest shard on a
                multi-shard query?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>write-to-read lag</span>: time from upsert to
                queryable?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>index build time</span>: duration of the last full
                rebuild?
              </li>
              <li>
                <span style={{ color: C.purple, fontWeight: "bold" }}>tombstone percent</span>: delete pressure on the
                current graph?
              </li>
            </ul>
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
            Every production incident: <span style={{ color: C.purple }}>&quot;we did not measure X&quot;</span>
            <br />
            Capture everything now so you can triage fast later
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Rule of thumb: for every new feature (filtering, sharding, replication), add a monitor before you ship. The
            feature is cheap; the blind spot it creates is not.
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
