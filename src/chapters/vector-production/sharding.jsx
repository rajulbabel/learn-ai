import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Sharding(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            About 100M vectors fit on one node
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before thinking about shards, know the single-node ceiling. At d = 768, one float32 vector is 3 KB. An AWS
            r7i.24xlarge has 768 GB of RAM. With HNSW overhead (~100 bytes/vector) and working headroom for caches and
            fragmentation, roughly 100M vectors is the comfortable ceiling on one server. Beyond that, the index has to
            split.
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
              Single-node fit math on an r7i.24xlarge (768 GB RAM)
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
              Vectors: 100M &middot; 3 KB = <span style={{ color: C.cyan }}>300 GB</span>
              <br />
              HNSW graph: 100M &middot; 100 B = <span style={{ color: C.cyan }}>10 GB</span>
              <br />
              Cache + fragmentation headroom: <span style={{ color: C.cyan }}>~60 GB</span>
              <br />
              Total: <span style={{ color: C.green }}>~370 GB of 768 GB RAM</span> - comfortable
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { size: "10M", fit: "Trivial on a laptop", color: C.green },
              { size: "100M", fit: "One r7i.24xlarge", color: C.yellow },
              { size: "1B+", fit: "Must shard", color: C.red },
            ].map((r) => (
              <div
                key={r.size}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={16}>
                  {r.size}
                </T>
                <T color={C.bright} center size={13} style={{ marginTop: 4 }}>
                  {r.fit}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The single-node ceiling is not a wall; it is the point where the operational cost of one big box flips to
            the operational cost of coordinating many smaller boxes.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Random sharding: round-robin by vector id
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The simplest split. Hash each vector id into one of S shards; shard i holds every vector whose id hashes to
            i. Writes distribute evenly; memory per shard is predictable. The catch: every query must fan out to every
            shard because any shard can contain the nearest neighbor.
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
              Random sharding across 4 shards
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Centered diagram: query icon q sits at the top, with four shard rectangles arranged in a horizontal
                  row below it. Each shard holds a random scatter of colored dots representing docs and is labeled Shard
                  0 through Shard 3 underneath. Yellow lines fan out from q straight down to every shard, illustrating
                  that random sharding forces every query to hit every shard.
                </desc>
                <g>
                  <circle cx={260} cy={30} r={14} fill={C.yellow} />
                  <text x={260} y={34} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[0, 1, 2, 3].map((i) => {
                  const x = 70 + i * 100;
                  const boxY = 80;
                  const cx = x + 40;
                  return (
                    <g key={`shard-${i}`}>
                      <line x1={260} y1={44} x2={cx} y2={boxY} stroke={C.yellow} strokeWidth={1.5} opacity={0.8} />
                      <rect
                        x={x}
                        y={boxY}
                        width={80}
                        height={80}
                        fill={`${C.yellow}08`}
                        stroke={C.yellow}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      {Array.from({ length: 12 }, (_, k) => (
                        <circle
                          key={`dot-${i}-${k}`}
                          cx={x + 13 + (k % 4) * 18}
                          cy={boxY + 22 + Math.floor(k / 4) * 18}
                          r={4}
                          fill={[C.cyan, C.green, C.orange, C.red, C.purple, C.pink][(i + k) % 6]}
                        />
                      ))}
                      <text
                        x={cx}
                        y={boxY + 80 + 18}
                        fill={C.yellow}
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Shard {i}
                      </text>
                    </g>
                  );
                })}
              </svg>
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
            Shard placement: <span style={{ color: C.yellow }}>shard(id) = hash(id) mod S</span>
            <br />
            Query cost = <span style={{ color: C.yellow }}>S</span> &middot; single-shard query
            <br />
            Every shard must fan out to reach every query
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Random sharding gives the best possible load balance and the worst possible query fan-out. For
            throughput-bound workloads the fan-out is fine; for latency-critical workloads it can blow the P99 budget.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Semantic sharding: one IVF cluster per shard
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Cluster the entire corpus with IVF first; each cluster becomes a shard. Now each shard holds vectors from
            one region of the embedding space. A query arrives, computes distance to each centroid (there are only S of
            them), and routes to the nearest nprobe shards. Dramatically fewer shards touched per query.
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
              Semantic sharding: query routes to 2 of 4 shards (nprobe = 2)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Centered diagram: query icon q sits at the top, with four shard rectangles arranged in a horizontal
                  row below it. Each shard is labeled with a region of the embedding space underneath: cats, animals,
                  dogs, and misc. Green lines drop straight down from q to only the two nearest shards (cats and
                  animals); the other two shards are dimmed. Illustrates semantic sharding where IVF clustering decides
                  which shards answer a given query.
                </desc>
                <g>
                  <circle cx={260} cy={30} r={14} fill={C.green} />
                  <text x={260} y={34} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[
                  { label: "cats", active: true, color: C.green, cluster: "A" },
                  { label: "animals", active: true, color: C.green, cluster: "B" },
                  { label: "dogs", active: false, color: C.dim, cluster: "C" },
                  { label: "misc", active: false, color: C.dim, cluster: "D" },
                ].map((s, i) => {
                  const x = 70 + i * 100;
                  const boxY = 80;
                  const cx = x + 40;
                  return (
                    <g key={`ss-${i}`}>
                      {s.active && <line x1={260} y1={44} x2={cx} y2={boxY} stroke={C.green} strokeWidth={2} />}
                      <rect
                        x={x}
                        y={boxY}
                        width={80}
                        height={80}
                        fill={s.active ? `${C.green}14` : `${C.dim}06`}
                        stroke={s.active ? C.green : C.dim}
                        strokeWidth={1.5}
                        rx={6}
                        opacity={s.active ? 1 : 0.4}
                      />
                      <text
                        x={cx}
                        y={boxY + 46}
                        fill={s.color}
                        fontSize={14}
                        fontWeight="bold"
                        textAnchor="middle"
                        opacity={s.active ? 1 : 0.4}
                      >
                        Cluster {s.cluster}
                      </text>
                      <text
                        x={cx}
                        y={boxY + 80 + 18}
                        fill={s.color}
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {s.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
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
            Shard placement: <span style={{ color: C.green }}>shard(v) = argmin dist(v, centroid_i)</span>
            <br />
            Query cost = <span style={{ color: C.green }}>nprobe</span> shards scanned, not S
            <br />
            The corpus is partitioned by semantic region, not by id
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Load balance is worse than random sharding (popular clusters get hotter), but the per-query cost is much
            lower. Most production deployments accept the hotspot risk for the latency gain.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Every shard returns top-k; coordinator merges
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Regardless of placement strategy, the actual query-time protocol is the same: the coordinator sends the
            query to the chosen shards in parallel, each shard runs its local ANN search and returns its top-k, and the
            coordinator merges the lists into the final top-k. Total latency is bound by the slowest shard (fan-out
            tail), not the sum.
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
              Fan-out: 8 shards, each returns top-10, coordinator merges to top-10
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
              Step 1: coordinator broadcasts query to 8 shards in parallel
              <br />
              Step 2: each shard runs local ANN, returns <span style={{ color: C.orange }}>top-10</span>
              <br />
              Step 3: coordinator receives 80 candidates, merges by score, keeps{" "}
              <span style={{ color: C.orange }}>top-10</span>
              <br />
              Total latency = fan-out tail + merge cost (~ fast)
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 6,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`fanout-${i}`}
                style={{
                  padding: "8px 6px",
                  background: `${C.orange}14`,
                  border: `1px solid ${C.orange}30`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold size={12} center>
                  Shard {i}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 11, color: C.bright }}>Top-10</div>
              </div>
            ))}
          </div>
          <T color={C.orange} center size={14} style={{ marginTop: 8 }}>
            ↓ coordinator merges 8 &times; 10 = 80 candidates ↓
          </T>
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              background: `${C.green}20`,
              border: `1px solid ${C.green}40`,
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={16} center>
              Final top-10 returned to client
            </T>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tail-latency amplification means P99 gets worse with more shards - if each shard has a 1% chance of being
            slow, 8 shards have roughly an 8% chance the query waits.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Merged top-k is not single-node top-k
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The coordinator can only merge what each shard sends it. If the true top-10 are spread across shards, each
            shard&apos;s local top-10 may miss a true top-10 that sits at local position 11. Result: merged recall is
            lower than a hypothetical single-node top-10 would be. The fix is simple: ask each shard for a buffer -
            top-20 or top-50 - so the merge has more candidates to pick from.
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
              Recall of merged top-10 vs per-shard buffer size
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Per-shard limit
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Merged recall@10
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Note</div>
              {[
                { k: "top-10", recall: "0.88", note: "Buffer too small, misses spread hits" },
                { k: "top-20", recall: "0.94", note: "Typical production buffer" },
                { k: "top-50", recall: "0.97", note: "Matches single-node within 0.1%" },
                { k: "top-100", recall: "0.98", note: "Diminishing returns, higher network cost" },
              ].flatMap((r) => [
                <div
                  key={`pk-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.k}
                </div>,
                <div
                  key={`rec-${r.k}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.recall}
                </div>,
                <div
                  key={`note-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, color: C.dim, fontSize: 12 }}
                >
                  {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Rule of thumb: per-shard buffer = <span style={{ color: C.red }}>k &middot; 2</span> to{" "}
            <span style={{ color: C.red }}>k &middot; 5</span> depending on how clustered your data is
            <br />
            Merged recall &ne; single-node recall unless the buffer is large enough
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the bug that ships first and gets fixed later. &quot;Sharded recall is lower than benchmarks&quot;
            is almost always a buffer issue.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Prune shards by filter predicate when possible
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Sharding and filtering interact. When the shard key aligns with a common filter field - for example
            tenant_id is the shard key and the query filters by tenant_id - the coordinator can skip the irrelevant
            shards entirely. When the filter is orthogonal to the shard key, every shard still has to be scanned.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Aligned filter (skip most shards)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Shard key: tenant_id
                <br />
                Filter: tenant_id = 42
                <br />
                <span style={{ color: C.green }}>fan-out to 1 of 8 shards</span>
                <br />
                Coordinator prunes the other 7
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Orthogonal filter (scan all shards)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Shard key: vector_id (random)
                <br />
                Filter: tenant_id = 42
                <br />
                <span style={{ color: C.red }}>fan-out to all 8 shards</span>
                <br />
                Cannot prune - tenant spans shards
              </div>
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
            Pick the shard key to match the <span style={{ color: C.purple }}>hottest filter field</span>
            <br />
            Multi-tenant apps almost always shard by tenant_id
            <br />
            Multi-region apps almost always shard by region
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Shard key choice is a one-way door. Change it later and every vector has to move. Get it right on day one by
            picking the filter that dominates production query traffic.
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
