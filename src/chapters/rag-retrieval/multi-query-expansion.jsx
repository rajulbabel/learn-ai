import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";

// Sub=1 pipeline stages.
const MQE_PIPELINE_STAGES = [
  {
    label: "LLM Generates",
    sublabel: "3-5 Query Variants",
    accent: "#ffcc80",
    color: C.orange,
  },
  {
    label: "Run Vector Retrieval",
    sublabel: "For Each Variant",
    accent: "#ffe082",
    color: C.yellow,
  },
  { label: "Fuse Rankings", sublabel: "With RRF", accent: "#a5d6a7", color: C.green },
];

// Sub=2 worked example variants.
const MQE_VARIANTS = [
  { label: "Variant 1", text: "How to cancel my subscription" },
  { label: "Variant 2", text: "How to get a refund after cancellation" },
  { label: "Variant 3", text: "Stop billing immediately" },
];

// Sub=2 per-variant top-3 retrieved docs.
const MQE_VARIANT_RANKINGS = [
  { variant: "Variant 1", docs: ["doc-15", "doc-7", "doc-3"] },
  { variant: "Variant 2", docs: ["doc-4", "doc-15", "doc-3"] },
  { variant: "Variant 3", docs: ["doc-5", "doc-15", "doc-21"] },
];

// Sub=2 final fused top-3.
const MQE_FUSED_TOP3 = [
  { id: "doc-15", note: "Covers Cancellation" },
  { id: "doc-4", note: "Covers Refund" },
  { id: "doc-3", note: "Subscription Tiers" },
];

// Sub=5 helps-vs-skip cards.
const MQE_HELPS = [
  "Ambiguous queries with multiple plausible intents",
  "Complex multi-clause queries",
  "Recall is the priority over latency",
  "Reranker can absorb the wider candidate set",
];

const MQE_SKIP = [
  "Short factual lookups ('What is my account ID?')",
  "Latency-critical paths (adds 1 LLM call + N parallel retrievals)",
  "When HyDE already solves the same failure",
];

export default function MultiQueryExpansion(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=0 fan-out diagram geometry.
  const FAN_VB_W = 720;
  const FAN_VB_H = 260;
  const FAN_QUERY_X = 30;
  const FAN_VARIANT_X = 230;
  const FAN_SET_X = 420;
  const FAN_FUSED_X = 600;
  const FAN_NODE_W = 100;
  const FAN_NODE_H = 44;
  const FAN_VARIANT_YS = [40, 110, 180];
  const FAN_CENTER_Y = FAN_VB_H / 2 - FAN_NODE_H / 2;

  // Sub=1 pipeline geometry.
  const PIPE_VB_W = 720;
  const PIPE_VB_H = 130;
  const PIPE_BOX_W = 200;
  const PIPE_BOX_H = 70;
  const PIPE_GAP = 30;
  const PIPE_SPAN = 3 * PIPE_BOX_W + 2 * PIPE_GAP; // 660
  const PIPE_X_START = (PIPE_VB_W - PIPE_SPAN) / 2; // 30
  const PIPE_Y = (PIPE_VB_H - PIPE_BOX_H) / 2; // 30

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Insight: one query becomes many, fuse the result */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            One Query Becomes Many; Fuse The Results
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            If the user&apos;s exact wording missed the right doc, one of the variant wordings might catch it. Ask an
            LLM to rewrite the query into 3-5 variants, retrieve top-K for each, then fuse the rankings into one.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FAN_VB_W} ${FAN_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Fan-out diagram showing a single user query expanding into 3 LLM-generated variants, each retrieving its
                own top-K, then converging into a single fused ranking via RRF.
              </desc>

              {/* User query node (left, centered vertically) */}
              <rect
                x={FAN_QUERY_X}
                y={FAN_CENTER_Y}
                width={FAN_NODE_W}
                height={FAN_NODE_H}
                rx="8"
                fill={C.red}
                fillOpacity="0.18"
                stroke={C.red}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={FAN_QUERY_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 + 4}
                fill="#ef9a9a"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>

              {/* Three variant nodes (middle column) */}
              {FAN_VARIANT_YS.map((vy, i) => (
                <g key={`variant-${i}`}>
                  {/* Edge from user query to variant */}
                  <line
                    x1={FAN_QUERY_X + FAN_NODE_W}
                    y1={FAN_CENTER_Y + FAN_NODE_H / 2}
                    x2={FAN_VARIANT_X}
                    y2={vy + FAN_NODE_H / 2}
                    stroke={C.orange}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                  {/* Variant box */}
                  <rect
                    x={FAN_VARIANT_X}
                    y={vy}
                    width={FAN_NODE_W}
                    height={FAN_NODE_H}
                    rx="8"
                    fill={C.orange}
                    fillOpacity="0.18"
                    stroke={C.orange}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />
                  <text
                    x={FAN_VARIANT_X + FAN_NODE_W / 2}
                    y={vy + FAN_NODE_H / 2 + 4}
                    fill="#ffcc80"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {`Variant ${i + 1}`}
                  </text>

                  {/* Edge from variant to retrieved set */}
                  <line
                    x1={FAN_VARIANT_X + FAN_NODE_W}
                    y1={vy + FAN_NODE_H / 2}
                    x2={FAN_SET_X}
                    y2={vy + FAN_NODE_H / 2}
                    stroke={C.yellow}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                  {/* Retrieved set box */}
                  <rect
                    x={FAN_SET_X}
                    y={vy}
                    width={FAN_NODE_W}
                    height={FAN_NODE_H}
                    rx="8"
                    fill={C.yellow}
                    fillOpacity="0.18"
                    stroke={C.yellow}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />
                  <text
                    x={FAN_SET_X + FAN_NODE_W / 2}
                    y={vy + FAN_NODE_H / 2 + 4}
                    fill="#ffe082"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    Top-K Docs
                  </text>

                  {/* Edge from each retrieved set into fused ranking */}
                  <line
                    x1={FAN_SET_X + FAN_NODE_W}
                    y1={vy + FAN_NODE_H / 2}
                    x2={FAN_FUSED_X}
                    y2={FAN_CENTER_Y + FAN_NODE_H / 2}
                    stroke={C.green}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                </g>
              ))}

              {/* Fused ranking node (right, centered vertically) */}
              <rect
                x={FAN_FUSED_X}
                y={FAN_CENTER_Y}
                width={FAN_NODE_W}
                height={FAN_NODE_H}
                rx="8"
                fill={C.green}
                fillOpacity="0.18"
                stroke={C.green}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={FAN_FUSED_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 - 2}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Fused Ranking
              </text>
              <text
                x={FAN_FUSED_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 + 14}
                fill="#a5d6a7"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                (Via RRF)
              </text>
            </svg>
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
              RAG-Fusion is the same idea under a different name. This chapter absorbs it.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── 3-step pipeline: generate -> retrieve -> fuse */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three Steps: Generate Variants -&gt; Retrieve Each -&gt; Fuse
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The whole pipeline fits in three stages. The LLM rewrites; the vector index runs N independent retrievals;
            RRF combines the N rankings into one final list.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${PIPE_VB_W} ${PIPE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Three-box horizontal pipeline diagram for multi-query expansion: an LLM generates 3-5 query variants,
                vector retrieval runs for each variant, and the rankings are fused with RRF into one final list.
              </desc>

              {MQE_PIPELINE_STAGES.map((stage, i) => {
                const x = PIPE_X_START + i * (PIPE_BOX_W + PIPE_GAP);
                const cx = x + PIPE_BOX_W / 2;
                return (
                  <g key={stage.label}>
                    <rect
                      x={x}
                      y={PIPE_Y}
                      width={PIPE_BOX_W}
                      height={PIPE_BOX_H}
                      rx="8"
                      fill={stage.color}
                      fillOpacity="0.18"
                      stroke={stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    <text
                      x={cx}
                      y={PIPE_Y + PIPE_BOX_H / 2 - 4}
                      fill={stage.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {stage.label}
                    </text>
                    <text
                      x={cx}
                      y={PIPE_Y + PIPE_BOX_H / 2 + 14}
                      fill={stage.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {stage.sublabel}
                    </text>

                    {i < MQE_PIPELINE_STAGES.length - 1 && (
                      <g>
                        <line
                          x1={x + PIPE_BOX_W + 2}
                          y1={PIPE_Y + PIPE_BOX_H / 2}
                          x2={x + PIPE_BOX_W + PIPE_GAP - 8}
                          y2={PIPE_Y + PIPE_BOX_H / 2}
                          stroke={C.orange}
                          strokeOpacity="0.9"
                          strokeWidth="2"
                        />
                        <polygon
                          points={`${x + PIPE_BOX_W + PIPE_GAP - 8},${PIPE_Y + PIPE_BOX_H / 2 - 6} ${x + PIPE_BOX_W + PIPE_GAP - 8},${PIPE_Y + PIPE_BOX_H / 2 + 6} ${x + PIPE_BOX_W + PIPE_GAP},${PIPE_Y + PIPE_BOX_H / 2}`}
                          fill={C.orange}
                          fillOpacity="0.9"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
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
              Stage 2 runs in parallel - N retrievals fire at once, not in sequence. Latency is dominated by stage 1
              (the LLM call), not stage 2.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Worked example: cancel + refund */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Worked Example: &apos;Cancel My Subscription And Get A Refund&apos;
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            One query, two intents. A single vector lookup is forced to compromise. With multi-query expansion, the LLM
            splits the wording, each intent gets its own retrieval, and RRF merges them into one ranking.
          </T>

          {/* Top: user query panel */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}12`,
              border: `1px solid ${C.yellow}30`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              User Query
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              &quot;Cancel my subscription and get a refund&quot;
            </T>
          </div>

          {/* Middle: 3 LLM-generated variants */}
          <T color={C.yellow} bold center size={14} style={{ marginTop: 14 }}>
            LLM-Generated Variants
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_VARIANTS.map((v) => (
              <div
                key={v.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={13}>
                  {v.label}
                </T>
                <T color="#ffe082" center size={13} style={{ marginTop: 6 }}>
                  &quot;{v.text}&quot;
                </T>
              </div>
            ))}
          </div>

          {/* Bottom: 3-column rank table - top-3 per variant */}
          <T color={C.yellow} bold center size={14} style={{ marginTop: 14 }}>
            Top-3 Retrieved Docs Per Variant
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_VARIANT_RANKINGS.map((row) => (
              <div
                key={row.variant}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}18`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={13}>
                  {row.variant}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {row.docs.map((doc, idx) => (
                    <div
                      key={`${row.variant}-${doc}`}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        background: `${C.yellow}12`,
                        border: `1px solid ${C.yellow}24`,
                        textAlign: "center",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      <T color="#ffe082" center size={12}>
                        Rank {idx + 1}: {doc}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final fused ranking - tinted green to highlight the result */}
          <T color={C.green} bold center size={14} style={{ marginTop: 14 }}>
            Final Fused Top-3 (After RRF)
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_FUSED_TOP3.map((doc, idx) => (
              <div
                key={doc.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Rank {idx + 1}
                </T>
                <T color="#a5d6a7" bold center size={14} style={{ marginTop: 6 }}>
                  {doc.id}
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  {doc.note}
                </T>
              </div>
            ))}
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
            <T color="#ffe082" center size={14}>
              Each variant brings a different doc to the top. Fusion captures both intents - doc-15 for cancellation,
              doc-4 for refund.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── RRF formula */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Fuse With RRF (Same Formula As <ChapterLink to="21.3">Chapter 21.3</ChapterLink>)
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Reciprocal Rank Fusion takes N rankings and produces one. Each doc&apos;s score is the sum of 1 / (k + its
            rank) across every ranking it appears in. The constant k = 60 dampens the influence of any single list so
            agreement across variants matters more than a top-1 appearance.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 15,
              color: "#b8a9ff",
              lineHeight: 1.6,
            }}
          >
            <div>RRF(d) = sum over variants v of: 1 / (k + rank_v(d))</div>
            <div style={{ marginTop: 10 }}>where k = 60 (standard)</div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Same fusion math as hybrid search (covered in <ChapterLink to="21.3">chapter 21.3</ChapterLink>).
              Different inputs - here the rankings come from N variants of the same query rather than from BM25 + dense.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Step-back prompting variant */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step-Back Prompting: Add A More General Variant
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Step-back is a specific variant style: ask a broader, less specific version of the question. The intuition:
            a doc might not match the user&apos;s exact narrow wording, but it almost certainly matches a more general
            phrasing of the same problem.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Original query (specific) */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Original (Very Specific)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;Why is the user role page failing on Chrome v124 with error E_PERM?&quot;
              </T>
            </div>

            {/* Step-back query (general) */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Step-Back (More General)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;Why does the user role page fail?&quot;
              </T>
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
              The original is too specific - the doc might not mention Chrome v124. The step-back catches more general
              docs. Reasoning models reduce the need for explicit step-back; include it when your queries are unusually
              specific.
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
              This is one of many possible variant prompts. The chapter&apos;s main approach covers the common case;
              step-back is a niche addition.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── When to use it */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            When Multi-Query Helps
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Multi-query expansion is not a default - it earns its keep on hard, ambiguous, or multi-intent queries. On
            short factual lookups it just burns budget.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Helps column - green tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Helps
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {MQE_HELPS.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}06`,
                      border: `1px solid ${C.green}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Skip column - red tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Skip
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {MQE_SKIP.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}06`,
                      border: `1px solid ${C.red}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {item}
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              Adds ~300 ms (1 LLM call) + N parallel retrievals (cheap). Often pairs well with HyDE for hard cases.
            </T>
          </div>
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
