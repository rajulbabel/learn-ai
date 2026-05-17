import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by this chapter (copied verbatim from section file):
const REINDEX_DECISION_USE = [
  "Corpus is small (<10K docs).",
  "Changes are infrequent (weekly batch updates).",
  "Simplicity beats freshness.",
];

const REINDEX_DECISION_AVOID = ["Real-time updates needed.", "Corpus large enough for re-embed to dominate budget."];

const WEBHOOK_TIMELINE = [
  {
    t: "T=0:00",
    label: "User Edits Doc",
    body: 'Support author updates "Reset Your Password" article in Confluence to add the MFA-preservation note.',
  },
  {
    t: "T=0:01",
    label: "Webhook Fires",
    body: 'Confluence POSTs {event: "page.updated", page_id: "doc-1", revision: 42} to the ingestion service.',
  },
  {
    t: "T=0:02",
    label: "Fetch Latest",
    body: "Ingestion service calls Confluence API to pull doc-1 revision 42 in full.",
  },
  {
    t: "T=0:05",
    label: "Re-Parse + Re-Chunk + Re-Embed",
    body: "Parser, chunker, and embedder run end-to-end. 3 chunks produced in ~150ms.",
  },
  {
    t: "T=0:08",
    label: "Upsert In Vector DB",
    body: "Same doc_id, new chunks. Old chunks dropped, new chunks inserted (Section 11.21 deletes-updates pattern).",
  },
  {
    t: "T=0:10",
    label: "Queryable",
    body: "Fresh chunks ready for retrieval. End-to-end propagation lag: ~10 seconds.",
  },
];

const POLL_BATCH = [
  {
    field: "last_synced_at",
    value: "2026-05-10T14:00:00Z",
    note: "Service tracks per-source watermark.",
  },
  {
    field: "interval",
    value: "Every 15 minutes",
    note: "Tune to your freshness budget. Throttle to source's rate limits.",
  },
  {
    field: "query",
    value: "WHERE updated_at > 2026-05-10T14:00:00Z LIMIT 1000",
    note: "REST or SQL filter that the source API exposes.",
  },
  {
    field: "result",
    value: "7 changed docs since last poll",
    note: "Process them, then advance last_synced_at to max(updated_at) in batch.",
  },
];

const VERSIONING_ROWS = [
  {
    color: "#a5d6a7",
    accent: C.green,
    label: "Row 1 - t=0",
    state: "doc-1 v1 Indexed",
    chunks: "[c1_v1, c2_v1, c3_v1]",
    status: "status=active",
    note: "Queries hit v1 chunks. Source-of-truth and index agree.",
  },
  {
    color: "#ffe082",
    accent: C.yellow,
    label: "Row 2 - t=+1min",
    state: "v2 Ingested, v1 Deprecated",
    chunks: "[c1_v2, c2_v2, c3_v2] active + [c1_v1, c2_v1, c3_v1] deprecated",
    status: "status=active OR status=deprecated",
    note: "Both versions live during re-embed window. No retrieval gap.",
  },
  {
    color: "#80deea",
    accent: C.cyan,
    label: "Row 3 - t=+15min",
    state: "v1 Dropped After Grace Period",
    chunks: "[c1_v2, c2_v2, c3_v2]",
    status: "status=active",
    note: "Only v2 active. Old chunks tombstoned and removed.",
  },
];

export default function RefreshSync(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Stale RAG Hallucinates With Confidence
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Docs change. The index does not. When the source is updated but the chunks in the vector DB still reflect
            the old version, RAG retrieves stale content and the LLM answers with confidence. The user sees a fluent,
            wrong answer. There is no automatic stale signal - the only way to know is to compare against the live
            source, which RAG never does at query time.
          </T>
          <T color={C.red} bold center size={16} style={{ marginTop: 14 }}>
            Three-Time-Marker Timeline
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <svg viewBox="0 0 520 320" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Timeline showing a password-reset article v1 published on 2026-04-12, edited to v2 on 2026-05-01 adding
                an MFA-preservation note, and a stale-index v1 chunk being retrieved on 2026-05-10 causing the LLM to
                give the wrong answer because the index never re-ingested v2.
              </desc>
              {/* Main timeline axis */}
              <line x1={40} y1={150} x2={480} y2={150} stroke="rgba(255,255,255,0.4)" strokeWidth={1.6} />
              <polygon points="476,146 484,150 476,154" fill="rgba(255,255,255,0.4)" />
              {/* Three time markers at 100, 260, 420 (symmetric around viewBox center 260) */}
              {[
                { x: 100, label: "2026-04-12", title: "v1 Published", color: C.green },
                { x: 260, label: "2026-05-01", title: "v2 Edited (Adds MFA)", color: C.green },
                { x: 420, label: "2026-05-10", title: "Stale Query Hits v1", color: C.red },
              ].map((m, i) => (
                <g key={i}>
                  <line x1={m.x} y1={144} x2={m.x} y2={156} stroke={m.color} strokeWidth={1.8} />
                  <circle cx={m.x} cy={150} r={6} fill={m.color} stroke="#08080d" strokeWidth={1.4} />
                  <text x={m.x} y={134} textAnchor="middle" fill={m.color} fontSize={12} fontWeight="bold">
                    {m.label}
                  </text>
                  <text x={m.x} y={172} textAnchor="middle" fill={m.color} fontSize={12} fontWeight="bold">
                    {m.title}
                  </text>
                </g>
              ))}
              {/* Source-of-truth band (top): v1 and v2 boxes width 210, gap 20 */}
              <text x={260} y={32} textAnchor="middle" fill={C.green} fontSize={13} fontWeight="bold">
                Source Of Truth (Confluence)
              </text>
              <rect
                x={40}
                y={42}
                width={210}
                height={36}
                rx={6}
                fill={`${C.green}18`}
                stroke={C.green}
                strokeWidth={1.2}
              />
              <text x={145} y={58} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="bold">
                v1 - No MFA Mention
              </text>
              <text x={145} y={72} textAnchor="middle" fill="#a5d6a7" fontSize={11}>
                Active 2026-04-12 → 2026-05-01
              </text>
              <rect
                x={270}
                y={42}
                width={210}
                height={36}
                rx={6}
                fill={`${C.green}28`}
                stroke={C.green}
                strokeWidth={1.4}
              />
              <text x={375} y={58} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="bold">
                v2 - MFA Setup Note Added
              </text>
              <text x={375} y={72} textAnchor="middle" fill="#a5d6a7" fontSize={11}>
                Active 2026-05-01 →
              </text>
              {/* Index band (bottom): single wide rect with 3 stacked text lines */}
              <text x={260} y={204} textAnchor="middle" fill={C.red} fontSize={13} fontWeight="bold">
                Vector Index (Never Re-Ingested)
              </text>
              <rect
                x={40}
                y={214}
                width={440}
                height={60}
                rx={6}
                fill={`${C.red}25`}
                stroke={C.red}
                strokeWidth={1.4}
              />
              <text x={260} y={232} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="bold">
                Only v1 Chunks Indexed - Stale From 2026-05-01
              </text>
              <text x={260} y={250} textAnchor="middle" fill="#ef9a9a" fontSize={11}>
                Query: "Do I Lose My MFA After Password Reset?"
              </text>
              <text x={260} y={266} textAnchor="middle" fill="#ef9a9a" fontSize={11}>
                Returns v1 Chunk → LLM Says "MFA May Need Re-Setup" (Wrong)
              </text>
              {/* Result line */}
              <text x={260} y={300} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="bold">
                Hallucinated Answer Looks Confident - No Stale Signal.
              </text>
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.red}10`,
              border: `1px solid ${C.red}25`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={16}>
              Every doc has an expiry date. Stale answers feel correct because the LLM is confident. There is no
              automatic stale signal - retrieval and generation both proceed as if the index were fresh.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Strategy 1: Full Re-Index On A Schedule
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The simplest sync strategy is the heavy hammer. Every night, rebuild the entire index from scratch. No
            change detection, no event plumbing - just a cron job that re-ingests everything. It works, it scales down,
            and it is the most common starting point for in-house RAG.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Mechanism
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Nightly cron at 2 AM fires. The job fetches all 10,000 docs from the source, re-parses, re-chunks, and
                re-embeds them. Output is written into a SHADOW index (parallel collection). At 6 AM, an atomic pointer
                swap promotes shadow to primary. Retrieval traffic flips instantly with zero gap.
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Without the shadow-index pattern, retrieval is degraded for the full 4-hour rebuild window. The shadow
                pattern is the difference between a clean swap and a service incident.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Cost Math
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}10`,
                  border: `1px solid ${C.cyan}25`,
                  textAlign: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  color: "#80deea",
                }}
              >
                10K docs x 1K tokens/doc x $0.10/1M tokens = $1/night
              </div>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Roughly $30 per month for a 10K-doc corpus. Trivial.
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}25`,
                  textAlign: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  color: "#ef9a9a",
                }}
              >
                At 1M docs: $3,000/month just for re-embedding
              </div>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Re-embedding dominates the budget once the corpus crosses 100K docs. Above that, full re-index is the
                wrong default.
              </T>
            </div>
          </div>
          <T color={C.cyan} bold center size={16} style={{ marginTop: 14 }}>
            Decision Card
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}25`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={15}>
              Use Full Re-Index If
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {REINDEX_DECISION_USE.map((line) => (
                <T color="#80deea" center size={14} key={line}>
                  {line}
                </T>
              ))}
            </div>
            <T color={C.cyan} bold center size={15} style={{ marginTop: 14 }}>
              Avoid If
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {REINDEX_DECISION_AVOID.map((line) => (
                <T color="#80deea" center size={14} key={line}>
                  {line}
                </T>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Strategy 2: Webhook-Driven Incremental Sync
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            When the source supports webhooks (Confluence, Notion, GitHub, Slack), the index can stay fresh in seconds
            instead of overnight. Each edit fires an event; the ingestion service handles only the docs that actually
            changed. No wasted re-embedding on the 99.99% of docs that did not change.
          </T>
          <T color={C.purple} bold center size={16} style={{ marginTop: 14 }}>
            Sequence Diagram - 10-Second Propagation
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <svg viewBox="0 0 520 360" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Webhook-driven incremental sync sequence diagram with time markers T=0:00 through T=0:10 showing user
                edit, Confluence webhook fire, ingestion service fetch, re-parse and re-chunk and re-embed, upsert into
                vector DB referencing Section 11.21 deletes-updates, and final queryable state with about ten-second
                propagation lag.
              </desc>
              {/* Vertical timeline */}
              <line x1={260} y1={20} x2={260} y2={340} stroke="rgba(255,255,255,0.25)" strokeWidth={1.4} />
              {WEBHOOK_TIMELINE.map((step, i) => {
                const y = 30 + i * 54;
                return (
                  <g key={step.t}>
                    <circle cx={260} cy={y + 18} r={6} fill={C.purple} stroke="#08080d" strokeWidth={1.4} />
                    <rect
                      x={40}
                      y={y}
                      width={170}
                      height={42}
                      rx={6}
                      fill={`${C.purple}20`}
                      stroke={C.purple}
                      strokeWidth={1.2}
                    />
                    <text x={125} y={y + 18} textAnchor="middle" fill={C.purple} fontSize={12} fontWeight="bold">
                      {step.t}
                    </text>
                    <text x={125} y={y + 34} textAnchor="middle" fill="#b8a9ff" fontSize={11} fontWeight="bold">
                      {step.label}
                    </text>
                    <rect
                      x={310}
                      y={y}
                      width={170}
                      height={42}
                      rx={6}
                      fill={`${C.purple}10`}
                      stroke={`${C.purple}40`}
                      strokeWidth={1}
                    />
                    <foreignObject x={314} y={y + 2} width={162} height={38}>
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          fontFamily: "ui-sans-serif, system-ui, sans-serif",
                          fontSize: 10,
                          color: "#b8a9ff",
                          textAlign: "center",
                          lineHeight: 1.3,
                          padding: "2px 4px",
                        }}
                      >
                        {step.body}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
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
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Pros
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Real-time freshness (~10 seconds). No wasted re-embedding on unchanged docs. Upsert pattern lines up
                with Section 11.21 deletes-and-updates so the vector DB stays consistent. Linear cost scales with edit
                volume, not corpus size.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Cons
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                Requires webhook support in the source (Confluence yes, raw S3 no). Webhook failures need retry / DLQ
                handling. Upserts must be idempotent to avoid duplicate writes on retries. Out-of-order events need
                revision-number guards.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}10`,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={15}>
              Webhook incremental sync is the default for SaaS sources with event hooks. Build idempotent upserts and a
              retry queue from day one.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Strategy 3: Polling - The Fallback For Webhook-Less Sources
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Many sources (REST APIs without event hooks, SQL databases, internal services) cannot push events. The
            ingestion service must pull. The pattern is simple: track a per-source watermark, ask the source on a timer
            what has changed since the watermark, advance the watermark, repeat.
          </T>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Polling Pipeline (Worked Example)
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {POLL_BATCH.map((row) => (
              <div
                key={row.field}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}12`,
                  display: "grid",
                  gridTemplateColumns: "0.6fr 1.4fr 1.4fr",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={14}>
                  {row.field}
                </T>
                <T
                  color="#ffcc80"
                  center
                  size={14}
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {row.value}
                </T>
                <T color="#ffcc80" center size={13}>
                  {row.note}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Freshness Lag (Edge Case)
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              doc-12 is edited at t=2 min (just after a poll fires at t=0). The change is picked up at t=15 min (next
              poll). Freshness lag = 13 minutes on average for that doc, 15 minutes worst case across the corpus.
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 8 }}>
              Tighter interval = lower lag, higher API cost. Looser interval = higher lag, lower API cost. Tune the poll
              interval to match your freshness budget.
            </T>
          </div>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Decision Card
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.orange}10`,
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              Use polling when: the source has no webhooks but exposes a queryable updated_at field (most REST APIs, SQL
              databases, internal services). Cost: API calls every interval whether or not anything changed. Throttle
              the poller to the source's rate limits. Lag is bounded by the poll interval.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Delete Propagation And Versioning: Where 90% Of In-House RAG Breaks
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Sync is not just "add new docs." The hard parts are propagating deletes (when the source removes a doc) and
            versioning chunks (so retrieval never sees a gap during a re-embed). Both are silent failures - eval sets
            catch them when chunks reference ghost content or queries miss during a swap, but customers do not see a
            stack trace. They just get the wrong answer.
          </T>
          <T color={C.yellow} bold center size={16} style={{ marginTop: 14 }}>
            Three-Row Versioning Timeline
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <svg viewBox="0 0 520 340" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Three-row versioning timeline showing doc-1 v1 chunks active at t=0, both v1 deprecated and v2 active
                during the t=+1min re-embed window so retrieval has no gap, and only v2 active at t=+15min after the
                grace period drops the v1 chunks.
              </desc>
              {/* Three row bands - rect frame plus foreignObject for centered HTML */}
              {VERSIONING_ROWS.map((row, i) => {
                const y = 20 + i * 108;
                return (
                  <g key={row.label}>
                    <rect
                      x={20}
                      y={y}
                      width={480}
                      height={96}
                      rx={8}
                      fill={`${row.accent}18`}
                      stroke={row.accent}
                      strokeWidth={1.4}
                    />
                    <foreignObject x={20} y={y} width={480} height={96}>
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          boxSizing: "border-box",
                          width: "100%",
                          height: "100%",
                          padding: "8px 14px",
                          textAlign: "center",
                          color: row.color,
                          fontFamily: "ui-sans-serif, system-ui, sans-serif",
                          lineHeight: 1.3,
                        }}
                      >
                        <div style={{ color: row.accent, fontSize: 13, fontWeight: 700 }}>{row.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{row.state}</div>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            marginTop: 4,
                          }}
                        >
                          Chunks: {row.chunks}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            marginTop: 2,
                          }}
                        >
                          {row.status}
                        </div>
                        <div style={{ fontSize: 11, fontStyle: "italic", marginTop: 4, opacity: 0.9 }}>{row.note}</div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
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
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Delete Propagation
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Source removes doc-1. Webhook fires event: "page.deleted". Ingestion service writes a tombstone in the
                vector DB. Tombstone propagates to all replicas. All chunks for doc-1 are removed. Section 11.21 covers
                the multi-replica deletes-and-updates pattern in depth.
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Without delete propagation: deleted docs are still served. They become ghost chunks - retrievable, but
                pointing to content that no longer exists in the source.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Versioning + Grace Period
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                New chunks land as status=active. Old chunks flip to status=deprecated. Both are queryable during the
                grace period (typically 5-15 minutes). After the grace period, deprecated chunks are dropped.
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Without versioning: old chunks are dropped before new ones land. Retrieval gap. Queries during the
                re-embed window return empty results or stale results from other docs.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Silent Failures
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
              Without delete propagation: ghost chunks served as fact. Without versioning: retrieval gap during the
              re-embed window. Both are invisible to the user - eval catches them, customers do not.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}10`,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Build delete propagation + versioning from day one. Retro-fitting them after launch costs 10x the dev
              time, because every downstream component (retrieval, eval, monitoring) already assumes chunks are
              immutable.
            </T>
          </div>
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
