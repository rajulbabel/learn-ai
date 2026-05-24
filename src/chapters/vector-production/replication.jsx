import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Replication(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Read replicas: N copies, reads load-balanced
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Vector search is read-heavy. Most production workloads ship 10-100 queries for every write. The natural
            response: run several identical copies of the index (read replicas), put a load balancer in front, and let
            queries spread out. Each replica holds the full index in RAM and answers independently. Throughput scales
            linearly with replica count up to the write rate that the leader can distribute.
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
              Load balancer + 4 read replicas (N copies of the index)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 270" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Diagram showing a yellow load-balancer box on the left labeled LB with four arrows fanning out to four
                  cyan replica boxes on the right labeled R1 through R4. Each replica icon has a small index symbol
                  inside. Arrows from clients on the far left enter the load balancer. Illustrates read-replica
                  scale-out where each replica holds a full copy of the index and requests are distributed.
                </desc>
                <g>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <circle key={`client-${i}`} cx={30} cy={30 + i * 45} r={10} fill={C.green} />
                  ))}
                </g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`cl-line-${i}`}
                    x1={40}
                    y1={30 + i * 45}
                    x2={130}
                    y2={120}
                    stroke={C.dim}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                ))}
                <rect
                  x={130}
                  y={95}
                  width={80}
                  height={50}
                  fill={`${C.yellow}14`}
                  stroke={C.yellow}
                  strokeWidth={2}
                  rx={6}
                />
                <text x={170} y={125} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  LB
                </text>
                {[0, 1, 2, 3].map((i) => {
                  const y = 40 + i * 55;
                  return (
                    <g key={`rep-${i}`}>
                      <line x1={210} y1={120} x2={350} y2={y + 20} stroke={C.cyan} strokeWidth={1.5} />
                      <rect
                        x={350}
                        y={y}
                        width={130}
                        height={40}
                        fill={`${C.cyan}14`}
                        stroke={C.cyan}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      <text x={415} y={y + 25} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                        Replica R{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x={260} y={260} fill={C.dim} fontSize={11} textAnchor="middle">
                  Every replica is an identical copy of the index
                </text>
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
            QPS capacity &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica QPS</span>
            <br />
            Memory cost &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica RAM</span>
            <br />
            Scale reads cheaply; pay in memory instead of latency
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every managed vector DB sells replicas as a knob. The question is how they stay in sync with writes - the
            next sub-step.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Leader-follower writes with replication lag
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Writes have to go somewhere. The standard pattern is leader-follower: one node (the leader, or primary)
            accepts writes, then ships them asynchronously to the followers. Followers apply the write and become
            eventually consistent with the leader. The time window between &quot;leader applied the write&quot; and
            &quot;follower applied the write&quot; is replication lag.
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
              Typical replication lag in production
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
                { label: "Steady state", value: "50 ms", color: C.green, note: "P50 under normal load" },
                { label: "Moderate spike", value: "200 ms", color: C.yellow, note: "Write burst, healthy pipeline" },
                { label: "Heavy spike / rebuild", value: "2 s", color: C.red, note: "Followers fall behind" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.label}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 20, color: r.color, textAlign: "center" }}
                  >
                    {r.value}
                  </div>
                  <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
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
            Leader accepts write at <span style={{ color: C.yellow }}>t = 0</span>
            <br />
            Followers apply it at <span style={{ color: C.yellow }}>t = 50 ms to 2 s</span>
            <br />
            Queries in the lag window see <span style={{ color: C.red }}>stale results</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            &quot;I just added a document but the search does not find it&quot; is almost always lag, not a bug. Either
            wait out the window, or route the read-after-write to the leader.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Leader dies, follower promotes
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            If the leader fails, one follower is promoted to primary via a consensus algorithm (Raft in most modern
            vector DBs). Any writes that reached the leader but had not replicated are lost - this is the lag-window
            data-loss risk. Writers that fsync to a synchronous replica pay latency for every write but can survive a
            leader loss with zero data loss.
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
              Failover timeline
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
              t = 0 ms: leader processes write W<sub>n+1</sub>
              <br />t = 10 ms: leader crashes -{" "}
              <span style={{ color: C.red }}>
                W<sub>n+1</sub> never replicated
              </span>
              <br />
              t = 50 ms: followers notice, Raft election starts
              <br />
              t = 500 ms: new leader promoted, cluster accepts writes again
              <br />
              <span style={{ color: C.red }}>Lost window: writes in-flight at t=0 to t=10 ms</span>
            </div>
          </div>
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
                Async replication (default)
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Fast writes: ack at leader</div>
                <div>&bull; At-most-50-ms lag typical</div>
                <div>
                  &bull; <span style={{ color: C.red }}>Possible data loss on failover</span>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Sync replication
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Slower writes: ack after 1 follower applies</div>
                <div>&bull; Zero data loss on failover</div>
                <div>
                  &bull; <span style={{ color: C.red }}>Write latency &asymp; 2x async</span>
                </div>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most vector DBs default to async. Pick sync only when a few lost writes in a rare failover would cost more
            than the steady-state latency hit.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Durability: if the RAM dies, is the index gone?
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Vector indexes live in RAM for speed. RAM is volatile. What happens if every node restarts at once? The
            answer depends on the persistence model. Three common patterns: WAL (write-ahead log) on disk, periodic
            snapshots, and source-of-truth rehydration. Most production systems layer all three.
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
              Durability mechanisms compared
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
                  name: "WAL on disk",
                  color: C.green,
                  how: "Every write appended to a log before ack",
                  rpo: "RPO = 0 (synchronous) or 1 batch",
                },
                {
                  name: "Periodic snapshots",
                  color: C.yellow,
                  how: "Dump the index to disk every N minutes",
                  rpo: "RPO = interval, faster startup",
                },
                {
                  name: "Rehydrate from source",
                  color: C.red,
                  how: "Re-read every doc from the app DB, re-embed",
                  rpo: "RPO = 0 but slow",
                },
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
                  <T color={r.color} bold size={14} center>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }} center>
                    {r.how}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                    {r.rpo}
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
            If every RAM copy dies, the index is only as durable as its{" "}
            <span style={{ color: C.orange }}>WAL + snapshot</span>
            <br />
            The source-of-truth DB is the ultimate recovery path
            <br />
            Test it before the outage, not during
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Many teams never test &quot;full cluster loss&quot;. The first time it happens, they discover the snapshot
            cadence is 24 hours and the WAL retention is 1 hour, and they are stuck re-embedding for days.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recovery time: WAL vs re-embed from source
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Worst case: the entire cluster dies. Recovery time depends entirely on what is cached. A fresh snapshot plus
            WAL replay takes minutes to hours; a full re-embed from the source documents takes days to weeks and costs
            real money.
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
              Recovery time for a 100M-vector corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Strategy</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Time</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Why</div>
              {[
                {
                  name: "Snapshot + WAL replay",
                  time: "10 min - 2 hours",
                  why: "Disk I/O bound, graph pages stream in",
                  color: C.green,
                },
                {
                  name: "WAL-only replay (no snapshot)",
                  time: "~12 hours",
                  why: "Every insert replayed from scratch",
                  color: C.yellow,
                },
                {
                  name: "Re-embed from source DB",
                  time: "1 - 14 days",
                  why: "Embedding API throughput + $ billed per token",
                  color: C.red,
                },
              ].flatMap((r) => [
                <div
                  key={`name-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}10`,
                    borderRadius: 4,
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`time-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.time}
                </div>,
                <div
                  key={`why-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}08`,
                    borderRadius: 4,
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.why}
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
            RTO budget = <span style={{ color: C.red }}>snapshot cadence + WAL replay rate</span>
            <br />
            Pick snapshot interval that matches your RTO target
            <br />
            Re-embed is the fallback of last resort, measured in days
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Put this math into the runbook before a real outage. The cost of a one-day outage at 10K QPS usually dwarfs
            the cost of snapshots every 30 minutes.
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
