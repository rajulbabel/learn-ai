import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const CONTEXTUAL_ORPHAN_CHUNKS = [
  {
    id: "Chunk A",
    doc: "Doc-2 Email Change Guide",
    text: "...verify your new email address, then click Save to confirm.",
    vec: [0.31, 0.42, 0.18, 0.55, 0.27, 0.39, 0.46, 0.22],
    score: 0.71,
  },
  {
    id: "Chunk B",
    doc: "Doc-15 Role Permissions Guide",
    text: "...assign the new role to the user, then click Save to confirm.",
    vec: [0.3, 0.41, 0.19, 0.54, 0.29, 0.38, 0.45, 0.23],
    score: 0.71,
  },
  {
    id: "Chunk C",
    doc: "Doc-18 Notifications Settings",
    text: "...select the channels you want notifications on, then click Save to confirm.",
    vec: [0.32, 0.4, 0.18, 0.55, 0.28, 0.39, 0.47, 0.21],
    score: 0.71,
  },
];

const CONTEXTUAL_AUGMENTED_SCORES = [
  {
    id: "Chunk A",
    label: "Doc-2 Email Change Guide",
    score: 0.93,
    isTop: true,
    note: "Augmentation explicitly mentions email change - direct hit.",
  },
  {
    id: "Chunk B",
    label: "Doc-15 Role Permissions Guide",
    score: 0.42,
    isTop: false,
    note: "Augmentation pulls vector toward roles, away from email.",
  },
  {
    id: "Chunk C",
    label: "Doc-18 Notifications Settings",
    score: 0.39,
    isTop: false,
    note: "Augmentation pulls vector toward notifications, away from email.",
  },
];

const CONTEXTUAL_BENCHMARK_BARS = [
  {
    label: "Naive Embedding Only",
    rate: 5.7,
    reduction: "Baseline",
    color: "#9aa0a6",
  },
  {
    label: "+ Contextual Embedding",
    rate: 3.7,
    reduction: "35% Reduction",
    color: "#80deea",
  },
  {
    label: "+ Contextual BM25",
    rate: 2.9,
    reduction: "49% Reduction",
    color: "#a5d6a7",
  },
  {
    label: "+ Reranking",
    rate: 1.9,
    reduction: "67% Reduction",
    color: "#ffcc80",
  },
];

const CONTEXTUAL_SKIP_IF = [
  "Corpus is fully homogeneous (one product manual; no risk of cross-doc duplicate phrases).",
  "Index size is small (under 1K chunks; recall problems can be solved by hand-tuning).",
  "Index budget is hard (the one-time $100-$1,000 augmentation cost is too high for a prototype).",
];

const CONTEXTUAL_USE_IF = [
  "Corpus has many docs with similar surface phrases (FAQ + support + product = lots of click Save to confirm overlap).",
  "Recall is the bottleneck in your eval metrics.",
  "Hybrid and reranking are already in place and you want one more lever.",
];

const CONTEXTUAL_STACK_STEPS = [
  {
    color: C.green,
    title: "Step 1: Contextual Augmentation (Index Time)",
    body: "Run an LLM over each chunk once. Prepend a 1-2 sentence context line that says what doc and section the chunk lives in. Embed and index the augmented chunk.",
    accent: "#a5d6a7",
  },
  {
    color: C.cyan,
    title: "Step 2: Hybrid Retrieval (Query Time)",
    body: "Dense embedding search and BM25 lexical search run in parallel over the augmented chunks. Their top-20 results are merged into a single candidate list.",
    accent: "#80deea",
    recap: "Hybrid - covered in Section 11.24 - merges semantic and lexical recall.",
  },
  {
    color: C.orange,
    title: "Step 3: Reranker (Top-20 To Top-3)",
    body: "A cross-encoder scores each query-chunk pair jointly and reorders the candidates. The top 3 go into the LLM prompt.",
    accent: "#ffcc80",
    recap: "Rerankers - covered in Section 11.25 - cross-encoder scores each query-chunk pair.",
  },
];

// Bar-chart geometry for the Anthropic benchmark in sub=4.
const BENCH_VIEW_W = 640;
const BENCH_LABEL_W = 230;
const BENCH_PAD_RIGHT = 30;
const BENCH_AXIS_Y = 220;
const BENCH_PX_PER_PERCENT = (BENCH_VIEW_W - BENCH_LABEL_W - BENCH_PAD_RIGHT) / 6;
const BENCH_BAR_X = BENCH_LABEL_W;
const BENCH_BAR_H = 28;
const BENCH_BAR_GAP = 14;
const BENCH_BAR_Y_START = 32;

export default function ContextualRetrieval(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Chunks Out Of Context Look Identical To The Embedding Model
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Three chunks from three completely unrelated docs all end with the exact same sentence: &quot;click Save to
            confirm.&quot; The embedding model sees only the token sequence. With nearly identical tokens the three
            chunks produce nearly identical vectors, so a query about email lands on all three at the same similarity.
            Retrieval picks one effectively at random.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#80deea",
            }}
          >
            Query: &quot;How do I change my email?&quot; &rarr; q_vec
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            {CONTEXTUAL_ORPHAN_CHUNKS.map((ch) => (
              <div
                key={ch.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {ch.id}
                </T>
                <T color="rgba(255,255,255,0.7)" center size={11}>
                  {ch.doc}
                </T>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.35)",
                    border: `1px solid ${C.cyan}24`,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" center size={12}>
                    {ch.text}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${C.cyan}12`,
                    border: `1px solid ${C.cyan}24`,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    color: "#80deea",
                    textAlign: "center",
                  }}
                >
                  [{ch.vec.map((v) => v.toFixed(2)).join(", ")}]
                </div>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" center size={13} bold>
                    Similarity: {ch.score.toFixed(2)}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              All three vectors are nearly identical because the chunks are nearly identical token sequences. The
              embedding is indistinguishable on the part of the chunk the query cares about. Recall@1 collapses to
              guessing - the wrong chunk is returned roughly two times out of three.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Solution: Prepend An LLM-Generated Context Line
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Before each chunk is embedded, run a cheap LLM call once at index time to write a short 1-2 sentence
            context: what doc the chunk is from, what section, and what it is about. Prepend that context line to the
            chunk text. The augmented chunk - prefix plus original body - is what the embedder sees. Now the vector
            carries enough signal to disambiguate even when chunks share surface phrasing.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={16}>
              Chunk A After Augmentation
            </T>

            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}10`,
                border: `1px solid ${C.green}40`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={12} style={{ letterSpacing: 0.4 }}>
                LLM-Generated Context (1-2 Sentences) - Prepended Prefix
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Document: Email Change Guide. Section: Step 4 - Verify New Address. This chunk is about confirming the
                new email after verification.
              </T>
            </div>

            <div
              style={{
                marginTop: 8,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color="rgba(255,255,255,0.65)" center size={12} style={{ letterSpacing: 0.4 }}>
                Original Chunk Body (Unchanged)
              </T>
              <T color="rgba(255,255,255,0.85)" center size={14} style={{ marginTop: 6 }}>
                ...verify your new email address, then click Save to confirm.
              </T>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: 8,
                borderRadius: 6,
                background: "rgba(0,0,0,0.35)",
                border: `1px solid ${C.green}24`,
                textAlign: "center",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                color: "#a5d6a7",
              }}
            >
              Full Augmented Chunk = [Prefix] + [Body] &nbsp;&rarr;&nbsp; This Is What Gets Embedded And Indexed
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              The body of the chunk never changes - the LLM generation only writes a short prefix that situates the
              chunk inside its source. The original tokens are still there for the LLM to read at generation time. Only
              the index-side representation gets richer.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Augmentation Prompt Template (Run Once Per Chunk)
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The template below is the exact prompt fired at index time for every chunk in the corpus. The placeholders
            in orange get filled in with the document title, the section heading, and the raw chunk text. The model
            returns the 1-2 sentence context that gets prepended.
          </T>

          <T color={C.purple} bold center size={14} style={{ marginTop: 14 }}>
            Augmentation Prompt Template
          </T>

          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#b8a9ff",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              lineHeight: 1.55,
            }}
          >
            <div>Here is a chunk from a documentation page.</div>
            <div style={{ marginTop: 8 }}>
              &lt;document_title&gt;<span style={{ color: C.orange, fontWeight: 600 }}>{"{document_title}"}</span>
              &lt;/document_title&gt;
            </div>
            <div>
              &lt;section_heading&gt;<span style={{ color: C.orange, fontWeight: 600 }}>{"{section_heading}"}</span>
              &lt;/section_heading&gt;
            </div>
            <div>&lt;chunk&gt;</div>
            <div>
              <span style={{ color: C.orange, fontWeight: 600 }}>{"{chunk}"}</span>
            </div>
            <div>&lt;/chunk&gt;</div>
            <div style={{ marginTop: 10 }}>Write a short (1-2 sentence) context that situates this chunk within</div>
            <div>the document and section so retrieval models can find it. Output</div>
            <div>only the context, no preamble.</div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Model Choice
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6 }}>
                Anthropic recommends Claude Haiku - a cheap model is enough; the task is short and structured.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Cost At Index Time
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6 }}>
                Roughly $0.001 per chunk. For 100K chunks that is about $100 one-time. With prompt caching the document
                prefix is paid once across all its chunks.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Before Vs. After: Recall On The Email-Change Query
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Same query, same three chunks, same embedding model. The only difference is whether the chunks were
            augmented with a context prefix at index time. Without augmentation the three vectors tie and recall is a
            coin flip. With augmentation, chunk A pulls clearly ahead and recall@1 jumps from 33% to 100%.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Row 1: Without Augmentation
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTEXTUAL_ORPHAN_CHUNKS.map((ch) => (
                <div
                  key={`bf-${ch.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px minmax(0, 1fr) 100px",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                  }}
                >
                  <T color={C.red} bold size={14}>
                    {ch.id}
                  </T>
                  <T color="#ef9a9a" size={13}>
                    {ch.doc}
                  </T>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.red}18`,
                      border: `1px solid ${C.red}30`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      textAlign: "center",
                    }}
                  >
                    <T color={C.red} size={13} bold>
                      {ch.score.toFixed(2)}
                    </T>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.red}12`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color="#ef9a9a" center size={13} bold>
                All Three Tied At 0.71. Top-1 Is Effectively Random. Recall@1 = 33%.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}30`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={15}>
              Row 2: With Augmentation
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTEXTUAL_AUGMENTED_SCORES.map((ch) => (
                <div
                  key={`af-${ch.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: 10,
                    borderRadius: 8,
                    background: ch.isTop ? `${C.green}18` : "rgba(0,0,0,0.3)",
                    border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}24`,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px minmax(0, 1fr) 100px 90px",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <T color={ch.isTop ? C.green : "#a5d6a7"} bold size={14}>
                      {ch.id}
                    </T>
                    <T color="#a5d6a7" size={13}>
                      {ch.label}
                    </T>
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: ch.isTop ? `${C.green}24` : `${C.green}10`,
                        border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}24`,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        textAlign: "center",
                      }}
                    >
                      <T color={ch.isTop ? C.green : "#a5d6a7"} size={13} bold={ch.isTop}>
                        {ch.score.toFixed(2)}
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: ch.isTop ? `${C.green}24` : "rgba(0,0,0,0.3)",
                        border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}20`,
                        textAlign: "center",
                      }}
                    >
                      <T color={ch.isTop ? C.green : "#a5d6a7"} size={13} bold={ch.isTop}>
                        {ch.isTop ? "Top-1" : "-"}
                      </T>
                    </div>
                  </div>
                  <T color={ch.isTop ? "#a5d6a7" : "rgba(255,255,255,0.6)"} center size={12}>
                    {ch.note}
                  </T>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}12`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color="#a5d6a7" center size={13} bold>
                Chunk A Wins At 0.93. Top-1 Is Stable. Recall@1 = 100%.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              The augmented vectors are no longer near-duplicates. Chunk A&apos;s prefix mentions email change
              explicitly, pulling its vector toward the query. Chunks B and C drift away because their prefixes are
              about roles and notifications. The retriever now has signal to separate them.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Anthropic&apos;s 2024 Benchmark: 49% Recall Improvement
          </T>
          <T color="#fff59d" center size={16} style={{ marginTop: 10 }}>
            Anthropic published a paper-length blog post in September 2024 measuring contextual retrieval over multiple
            corpora. The chart below shows top-20 retrieval failure rate - lower is better. Contextual embedding alone
            cuts failures by 35%. Add contextual BM25 hybrid and it is 49%. Stack a reranker on top and the combined
            stack hits 67% fewer failures than naive embedding retrieval.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Top-20 Retrieval Failure Rate (Lower Is Better)
            </T>
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Horizontal bar chart showing four bars of retrieval failure rate from Anthropic&apos;s September 2024
                Contextual Retrieval benchmark: naive embedding only 5.7 percent, plus contextual embedding 3.7 percent,
                plus contextual BM25 2.9 percent, plus reranking 1.9 percent, with title-case axis labels.
              </desc>
              {/* X-axis baseline */}
              <line
                x1={BENCH_BAR_X}
                y1={BENCH_AXIS_Y}
                x2={BENCH_VIEW_W - BENCH_PAD_RIGHT}
                y2={BENCH_AXIS_Y}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              {/* X-axis ticks at 0, 2, 4, 6 percent */}
              {[0, 2, 4, 6].map((tick) => {
                const x = BENCH_BAR_X + tick * BENCH_PX_PER_PERCENT;
                return (
                  <g key={`tick-${tick}`}>
                    <line x1={x} y1={BENCH_AXIS_Y} x2={x} y2={BENCH_AXIS_Y + 6} stroke="rgba(255,255,255,0.5)" />
                    <text x={x} y={BENCH_AXIS_Y + 20} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11">
                      {tick}%
                    </text>
                  </g>
                );
              })}
              {/* X-axis title */}
              <text
                x={BENCH_BAR_X + (BENCH_VIEW_W - BENCH_BAR_X - BENCH_PAD_RIGHT) / 2}
                y={BENCH_AXIS_Y + 40}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Failure Rate (%)
              </text>
              {/* Bars + labels */}
              {CONTEXTUAL_BENCHMARK_BARS.map((bar, i) => {
                const y = BENCH_BAR_Y_START + i * (BENCH_BAR_H + BENCH_BAR_GAP);
                const w = bar.rate * BENCH_PX_PER_PERCENT;
                return (
                  <g key={`bar-${i}`}>
                    {/* Category label (left of bar) */}
                    <text
                      x={BENCH_LABEL_W - 10}
                      y={y + BENCH_BAR_H / 2 + 4}
                      textAnchor="end"
                      fill={bar.color}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {bar.label}
                    </text>
                    {/* Bar */}
                    <rect
                      x={BENCH_BAR_X}
                      y={y}
                      width={w}
                      height={BENCH_BAR_H}
                      fill={`${bar.color}40`}
                      stroke={bar.color}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    {/* Value at end of bar */}
                    <text
                      x={BENCH_BAR_X + w + 8}
                      y={y + BENCH_BAR_H / 2 + 4}
                      textAnchor="start"
                      fill={bar.color}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {bar.rate.toFixed(1)}% &middot; {bar.reduction}
                    </text>
                  </g>
                );
              })}
              {/* Chart title at top */}
              <text
                x={BENCH_VIEW_W / 2}
                y={16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Method &middot; Failure Rate
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#fff59d" center size={14}>
              From the Anthropic Contextual Retrieval blog post, September 2024. The 49% headline number is the failure
              rate reduction from naive embedding (5.7%) to contextual embedding plus contextual BM25 hybrid (2.9%).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            When Contextual Retrieval Is Overkill
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Contextual retrieval pays for itself when many docs share surface phrases and recall is a real bottleneck.
            On a small homogeneous corpus the one-time augmentation cost is hard to justify - the recall problem can be
            solved more cheaply by hand-tuning chunks or by adding a reranker first.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Skip If
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {CONTEXTUAL_SKIP_IF.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Use If
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {CONTEXTUAL_USE_IF.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Rule of thumb: if recall is not your bottleneck, do not add the augmentation pass. The 49% headline number
              is a ceiling, not a guarantee - it only shows up when chunks would otherwise collide on surface tokens.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Stacks With Hybrid Search And Rerankers For The Full 67%
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Contextual retrieval is not a replacement for hybrid search or for rerankers - it composes with them.
            Augment at index time, then run hybrid retrieval and rerank as usual. Each layer attacks a different failure
            mode, so the wins stack.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {CONTEXTUAL_STACK_STEPS.map((step) => (
              <div
                key={step.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${step.color}06`,
                  border: `1px solid ${step.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={step.color} bold center size={16}>
                  {step.title}
                </T>
                <T color={step.accent} center size={14} style={{ marginTop: 6 }}>
                  {step.body}
                </T>
                {step.recap && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 6,
                      background: `${step.color}10`,
                      border: `1px solid ${step.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={step.accent} center size={12}>
                      {step.recap}
                    </T>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.pink}10`,
              border: `1px solid ${C.pink}40`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold center size={16}>
              Combined: 67% Failure-Rate Reduction Over Naive (Anthropic 2024)
            </T>
            <T color="#f8bbd0" center size={13} style={{ marginTop: 6 }}>
              Augmentation lifts dense and BM25 recall in parallel. The reranker fixes ordering on whatever the hybrid
              stack surfaces. Each component is independently useful, but the full stack is where the 67% number lives.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub < 6 && (
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
