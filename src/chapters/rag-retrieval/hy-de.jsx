import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Sub=1 flow stages.
const HYDE_FLOW_STAGES = [
  { label: "User Query", accent: "#ffcc80", color: C.orange },
  { label: "LLM Generates", sublabel: "Hypothetical Answer", accent: "#b8a9ff", color: C.purple },
  { label: "Embed Hypothetical", sublabel: "Answer", accent: "#80deea", color: C.cyan },
  { label: "Vector Retrieval", accent: "#ffe082", color: C.yellow },
  { label: "Top-K Real Docs", accent: "#a5d6a7", color: C.green },
];

// Sub=2 worked example top-3 retrieved docs.
const HYDE_RETRIEVED_DOCS = [
  { id: "doc-22", title: "Slow Page Load Troubleshooting" },
  { id: "doc-23", title: "500 Errors" },
  { id: "doc-27", title: "Browser Compatibility Issues" },
];

// Sub=3 why-it-works cards.
const HYDE_REASONS = [
  {
    title: "Different Shapes In Vector Space",
    body: "Questions look different from answers in vector space.",
  },
  {
    title: "Borrows Doc Vocabulary",
    body: "Hypothetical answers borrow doc vocabulary even if the LLM doesn't know the actual answer.",
  },
  {
    title: "Robust To Lexical Mismatch",
    body: "Robust to lexical mismatch because the LLM does the rewriting for you.",
  },
];

// Sub=4 helps-vs-hurts table.
const HYDE_HELPS = [
  "Long descriptive queries",
  "Lexical mismatch (sign-in vs log-in)",
  "Conceptual / 'why does X happen' questions",
  "Queries that don't share vocabulary with docs",
];

const HYDE_HURTS = [
  "Short factual queries with good embeddings (e.g., 'API key')",
  "Queries where the LLM might hallucinate the wrong answer shape",
  "Latency-sensitive pipelines (HyDE adds an LLM call: +200-400 ms)",
];

export default function HyDE(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=1 flow diagram geometry.
  const FLOW_VB_W = 720;
  const FLOW_VB_H = 130;
  const FLOW_BOX_W = 120;
  const FLOW_BOX_H = 70;
  const FLOW_GAP = 18;
  const FLOW_SPAN = 5 * FLOW_BOX_W + 4 * FLOW_GAP; // 5*120 + 4*18 = 672
  const FLOW_X_START = (FLOW_VB_W - FLOW_SPAN) / 2; // (720-672)/2 = 24
  const FLOW_Y = (FLOW_VB_H - FLOW_BOX_H) / 2; // 30

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── HyDE insight: embed the answer, not the question */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Don&apos;t Embed The Question - Embed The Hypothetical Answer
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            A user&apos;s question and the doc that answers it often live far apart in vector space. They use different
            words and have different shapes. HyDE flips the order: have an LLM draft a plausible answer first, then
            embed THAT, then retrieve.
          </T>

          {/* Normal RAG line */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.yellow}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <T color={C.yellow} bold center size={13}>
              Normal RAG
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              Embed(&quot;Why is my dashboard slow?&quot;) -&gt; retrieve.
            </T>
          </div>

          {/* HyDE line */}
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.yellow}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <T color={C.yellow} bold center size={13}>
              HyDE
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              LLM(&quot;Why is my dashboard slow?&quot;) = &quot;The dashboard may be slow due to large data volumes,
              browser extensions, or network latency.&quot; -&gt; Embed that ANSWER -&gt; retrieve.
            </T>
          </div>

          {/* Insight callout */}
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
              The hypothetical answer is text-shape-closer to actual docs than the question is. Cosine similarity wins.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── The five-stage HyDE flow */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            The HyDE Flow: Query -&gt; LLM -&gt; Hypothetical Answer -&gt; Embed -&gt; Retrieve
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            HyDE adds one extra step before retrieval: an LLM call that writes a hypothetical answer. That answer is
            what gets embedded and sent to the vector index. The user never sees it directly.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FLOW_VB_W} ${FLOW_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Five-box horizontal flow diagram showing the HyDE pipeline: user query, LLM generates hypothetical
                answer, embed hypothetical answer, vector retrieval, top-K real docs.
              </desc>

              {HYDE_FLOW_STAGES.map((stage, i) => {
                const x = FLOW_X_START + i * (FLOW_BOX_W + FLOW_GAP);
                const cx = x + FLOW_BOX_W / 2;
                return (
                  <g key={stage.label}>
                    {/* Stage box */}
                    <rect
                      x={x}
                      y={FLOW_Y}
                      width={FLOW_BOX_W}
                      height={FLOW_BOX_H}
                      rx="8"
                      fill={stage.color}
                      fillOpacity="0.18"
                      stroke={stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    {/* Stage label (two-line if sublabel) */}
                    {stage.sublabel ? (
                      <>
                        <text
                          x={cx}
                          y={FLOW_Y + FLOW_BOX_H / 2 - 4}
                          fill={stage.accent}
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {stage.label}
                        </text>
                        <text
                          x={cx}
                          y={FLOW_Y + FLOW_BOX_H / 2 + 12}
                          fill={stage.accent}
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {stage.sublabel}
                        </text>
                      </>
                    ) : (
                      <text
                        x={cx}
                        y={FLOW_Y + FLOW_BOX_H / 2 + 4}
                        fill={stage.accent}
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {stage.label}
                      </text>
                    )}

                    {/* Arrow to next stage */}
                    {i < HYDE_FLOW_STAGES.length - 1 && (
                      <g>
                        <line
                          x1={x + FLOW_BOX_W + 2}
                          y1={FLOW_Y + FLOW_BOX_H / 2}
                          x2={x + FLOW_BOX_W + FLOW_GAP - 4}
                          y2={FLOW_Y + FLOW_BOX_H / 2}
                          stroke={C.orange}
                          strokeOpacity="0.65"
                          strokeWidth="1.6"
                        />
                        <polygon
                          points={`${x + FLOW_BOX_W + FLOW_GAP - 4},${FLOW_Y + FLOW_BOX_H / 2 - 4} ${x + FLOW_BOX_W + FLOW_GAP - 4},${FLOW_Y + FLOW_BOX_H / 2 + 4} ${x + FLOW_BOX_W + FLOW_GAP},${FLOW_Y + FLOW_BOX_H / 2}`}
                          fill={C.orange}
                          fillOpacity="0.65"
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
              The hypothetical answer is throwaway. Only its embedding goes to the index. The user gets the real top-K
              docs back, never the LLM&apos;s draft.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Worked example on the dashboard-slow query */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Worked Example: &apos;Why Is My Dashboard Slow?&apos;
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Three panels: what the user typed, what the LLM drafted, and what the retriever returned. The LLM&apos;s
            draft pulled in vocabulary like &quot;page load&quot;, &quot;browser extensions&quot;, and &quot;network
            latency&quot; - exactly the words that appear in the docs that actually help.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {/* Panel A - User query */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                User Query
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                &quot;Why is my dashboard slow?&quot;
              </T>
            </div>

            {/* Panel B - LLM hypothetical answer */}
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
                LLM Hypothetical Answer
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;The dashboard may be slow due to large data volumes, browser extensions interfering with
                rendering, network latency, or background sync jobs consuming resources. Try refreshing, disabling
                extensions, or checking the network panel.&quot;
              </T>
            </div>

            {/* Panel C - Top-3 retrieved docs */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Top-3 Retrieved Docs
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HYDE_RETRIEVED_DOCS.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" bold center size={12}>
                      {doc.id}
                    </T>
                    <T color="#a5d6a7" center size={12} style={{ marginTop: 2 }}>
                      {doc.title}
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
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              Without HyDE, retrieval returned doc-7 (Dashboard Tour) - a generic doc that doesn&apos;t help. The
              question &quot;why slow&quot; embedded poorly; the answer embedded well.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Why HyDE works */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Why HyDE Works
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Three reasons the hypothetical-answer trick beats embedding the raw question. Even if the LLM&apos;s draft
            is factually wrong, the SHAPE of the answer matches the SHAPE of real docs - and that is what cosine
            similarity scores.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {HYDE_REASONS.map((reason) => (
              <div
                key={reason.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} bold center size={14}>
                  {reason.title}
                </T>
                <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                  {reason.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When HyDE helps vs hurts */}
      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            When HyDE Helps Vs When It Hurts
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            HyDE is not free and is not universal. It earns its keep when the user&apos;s words are far from the
            doc&apos;s words. It hurts when the query is already short, factual, and embeds well.
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
                {HYDE_HELPS.map((item) => (
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

            {/* Hurts column - red tint */}
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
                Hurts
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {HYDE_HURTS.map((item) => (
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
              If recall on your golden set is already above 0.85, HyDE likely won&apos;t help and will add latency.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── The HyDE prompt template */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The HyDE Prompt Template
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            The exact prompt you fire at the LLM. The placeholder in pink gets filled with the user&apos;s question. The
            LLM&apos;s response is the hypothetical answer that gets embedded.
          </T>

          <T color={C.pink} bold center size={14} style={{ marginTop: 14 }}>
            Prompt Template
          </T>

          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#f5b7f8",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              lineHeight: 1.55,
            }}
          >
            <div>You are a helpful assistant. Write a single concise paragraph that</div>
            <div>answers the user&apos;s question as if you knew the answer. The paragraph</div>
            <div>will be used to search a documentation index, so include domain terms</div>
            <div>and likely doc vocabulary. Do not say &quot;I don&apos;t know&quot; - guess plausibly.</div>
            <div style={{ marginTop: 10 }}>
              Question: <span style={{ color: C.pink, fontWeight: 600 }}>{"{query}"}</span>
            </div>
            <div style={{ marginTop: 10 }}>Hypothetical Answer:</div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f5b7f8" center size={14}>
              +1 LLM call per user query (~$0.0005 + ~250ms). Cache the hypothetical answer by query hash to amortize.
            </T>
            <T color="#f5b7f8" center size={13} style={{ marginTop: 6 }}>
              Caching - covered in chapter 12.36.
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
