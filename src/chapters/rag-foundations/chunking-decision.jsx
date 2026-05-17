import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const CHUNKING_STRATEGIES = [
  {
    name: "Fixed-Size",
    chapter: "12.7",
    summary: "Sliding window, no structure awareness.",
    quality: 1,
    cost: 1,
    difficulty: 1,
  },
  {
    name: "Recursive Structural",
    chapter: "12.8",
    summary: "Tries paragraph then line then sentence then word.",
    quality: 2,
    cost: 1,
    difficulty: 1,
  },
  {
    name: "Semantic",
    chapter: "12.9",
    summary: "Embed sentences, split where cosine dips.",
    quality: 3,
    cost: 2,
    difficulty: 2,
  },
  {
    name: "Late",
    chapter: "12.10",
    summary: "One whole-doc attention pass, then pool per chunk.",
    quality: 3,
    cost: 2,
    difficulty: 3,
  },
  {
    name: "Hierarchical",
    chapter: "12.11",
    summary: "Small chunks retrieve; parents go to LLM.",
    quality: 3,
    cost: 2,
    difficulty: 2,
  },
  {
    name: "Contextual Retrieval",
    chapter: "12.12",
    summary: "LLM-generated context prefixed to each chunk.",
    quality: 4,
    cost: 3,
    difficulty: 2,
  },
];

const DOC_STRUCTURE_ROWS = [
  {
    type: "Markdown / HTML",
    recommendation: "Recursive Structural (uses heading and paragraph markers natively).",
  },
  {
    type: "PDF (Scanned Or Extracted)",
    recommendation: "Recursive Structural after extraction, or Semantic if extraction quality is bad.",
  },
  {
    type: "Code",
    recommendation: "Recursive Structural with language-aware separators (function defs, class declarations).",
  },
  {
    type: "Flat-Text Narrative (No Headings, No Markdown)",
    recommendation: "Semantic Chunking (the only way to find topic boundaries).",
  },
  {
    type: "Mixed / Heterogeneous Corpus",
    recommendation: "Apply different strategies per doc-type. Don't force one strategy.",
  },
];

const QUERY_TYPE_ROWS = [
  {
    query: "Factual",
    example: "What is X?",
    advice:
      "Small chunks are fine. Recursive Structural plus Contextual if FAQ-style overlap. Hierarchical optional for context-heavy answers.",
  },
  {
    query: "Relational",
    example: "How does X relate to Y?",
    advice:
      "Hierarchical helps (LLM needs the whole relationship section). Late Chunking helps when entities are referenced across chunks.",
  },
  {
    query: "Comparative",
    example: "Compare X and Y.",
    advice:
      "Multi-hop retrieval (covered in chapter 12.28) on top of any chunking. Bigger chunks help. Hierarchical preferred.",
  },
];

const COST_VIEW_W = 720;
const COST_VIEW_H = 180;
const COST_TIERS = [
  {
    name: "Lab / Prototype",
    cost: "Free",
    color: C.green,
    accent: "#a5d6a7",
    recipe: "Recursive Structural only. Zero embedding cost at chunk time. Iterate fast.",
  },
  {
    name: "Startup",
    cost: "~$100 One-Time",
    color: C.cyan,
    accent: "#80deea",
    recipe:
      "Recursive Structural plus Hierarchical for long-form docs. Skip semantic and contextual until you see recall problems in your eval.",
  },
  {
    name: "Enterprise",
    cost: "$100 - $10K One-Time",
    color: C.orange,
    accent: "#ffcc80",
    recipe:
      "Recursive Structural baseline plus Hierarchical plus Contextual Retrieval plus (Semantic where prose dominates). Stack with hybrid plus rerankers. Budget for the one-time $100 - $10K augmentation cost.",
  },
];

const SUPPORT_WALKTHROUGH = [
  {
    category: "Account & Billing",
    profile: "10 docs, FAQ-style, lots of repeated phrases like 'click Save'",
    recommendation:
      "Recursive Structural plus Contextual Retrieval. Contextual disambiguates the duplicate phrases across email, role, and notifications docs.",
  },
  {
    category: "Product Features",
    profile: "10 docs, longer technical pages with sections and code samples",
    recommendation:
      "Recursive Structural plus Hierarchical. Sections give clean splits; parent-swap gives the LLM context for technical answers.",
  },
  {
    category: "Troubleshooting",
    profile: "10 docs, free-form runbooks, narrative paragraphs",
    recommendation:
      "Recursive Structural plus Semantic for the longer narratives. Semantic catches topic shifts within a runbook.",
  },
];

// Renders the 3-bar mini-meter for a given level (1=low .. 4=very high).
function MiniMeter({ label, level, axisColor }) {
  const fills = [];
  for (let i = 0; i < 3; i++) {
    const filled = i < Math.min(level, 3);
    fills.push(
      <div
        key={i}
        style={{
          width: 14,
          height: 7,
          background: filled ? axisColor : "rgba(255,255,255,0.08)",
          border: filled ? `1px solid ${axisColor}` : `1px solid rgba(255,255,255,0.18)`,
          borderRadius: 2,
        }}
      />,
    );
  }
  if (level >= 4) {
    fills.push(
      <div
        key="vh"
        style={{
          width: 14,
          height: 7,
          background: axisColor,
          border: `1px solid ${axisColor}`,
          borderRadius: 2,
          boxShadow: `0 0 6px ${axisColor}`,
        }}
      />,
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <T color="rgba(255,255,255,0.65)" center size={11}>
        {label}
      </T>
      <div style={{ display: "flex", gap: 3 }}>{fills}</div>
    </div>
  );
}

export default function ChunkingDecision(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Six Strategies, One Page
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chapters 12.7 to 12.12 each introduced one chunking strategy. Lined up side by side, each one has its own
            quality, cost, and implementation profile. The first meter is retrieval quality (higher is better), the
            second is embedding cost at chunk time, the third is implementation difficulty.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {CHUNKING_STRATEGIES.map((s) => (
              <div
                key={s.name}
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
                <T color={C.cyan} bold center size={16}>
                  {s.name}
                </T>
                <T color="rgba(255,255,255,0.55)" center size={11}>
                  Chapter {s.chapter}
                </T>
                <T color="#80deea" center size={13}>
                  {s.summary}
                </T>
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    justifyContent: "space-around",
                    gap: 8,
                    padding: 8,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.cyan}24`,
                  }}
                >
                  <MiniMeter label="Quality" level={s.quality} axisColor={C.green} />
                  <MiniMeter label="Cost" level={s.cost} axisColor={C.orange} />
                  <MiniMeter label="Implementation" level={s.difficulty} axisColor={C.red} />
                </div>
              </div>
            ))}
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
              No strategy wins on all three axes. Fixed-Size is cheapest but loses quality; Contextual gives the highest
              retrieval quality but adds index-time LLM cost. The next three sub-steps pick the right one along three
              axes: doc structure, query type, and budget.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Axis 1: What Structure Do Your Docs Have?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Structure constrains the chunker more than the content does. Markdown and HTML come with built-in split
            points; PDFs and code have predictable shapes; flat narrative prose has none of these and forces a
            content-aware strategy.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {DOC_STRUCTURE_ROWS.map((row) => (
              <div
                key={row.type}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  borderLeft: `4px solid ${C.green}`,
                  textAlign: "left",
                }}
              >
                <T color={C.green} bold size={15}>
                  {row.type}
                </T>
                <T color="#a5d6a7" size={14} style={{ marginTop: 4 }}>
                  {row.recommendation}
                </T>
              </div>
            ))}
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
              The single biggest signal is whether your corpus has explicit split points. If yes, Recursive Structural
              is almost always the right starting baseline. Only flat narrative forces you up the cost ladder to
              Semantic on day one.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Axis 2: What Kinds Of Queries Will You Get?
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Query shape changes which chunk size and which retrieval pattern wins. Factual lookups want small,
            high-precision chunks; relational and comparative questions want enough surrounding context to reason across
            entities.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "180px 200px 1fr",
              gap: 1,
              background: `${C.purple}24`,
              border: `1px solid ${C.purple}30`,
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Query Type
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Example
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Recommendation
              </T>
            </div>
            {QUERY_TYPE_ROWS.map((row) => (
              <div key={row.query} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.purple} bold center size={14}>
                    {row.query}
                  </T>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "center",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  <T color="#b8a9ff" center size={13}>
                    &ldquo;{row.example}&rdquo;
                  </T>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "left",
                  }}
                >
                  <T color="#b8a9ff" size={13}>
                    {row.advice}
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
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Hierarchical is the safest middle bet: it serves factual queries through its leaves and relational queries
              through its parents. Comparative queries on top of any chunking still need multi-hop retrieval (chapter
              12.28).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Axis 3: What's Your Indexing Budget?
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Chunking cost is a one-time index-time spend, but it scales with corpus size. Lab corpora are free to chunk;
            startup corpora can absorb a Hierarchical pass; enterprise corpora pay for the full augmented stack because
            the recall gains justify it.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <svg
              viewBox={`0 0 ${COST_VIEW_W} ${COST_VIEW_H}`}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <desc>
                Horizontal cost-budget scale with three tier markers labeled lab, startup, and enterprise, each with a
                recommended chunking stack listed underneath.
              </desc>
              {/* Spine line */}
              <line
                x1={80}
                y1={90}
                x2={COST_VIEW_W - 80}
                y2={90}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={2}
                strokeDasharray="4 6"
              />
              {/* Arrow head on right */}
              <polygon
                points={`${COST_VIEW_W - 80},82 ${COST_VIEW_W - 64},90 ${COST_VIEW_W - 80},98`}
                fill="rgba(255,255,255,0.45)"
              />
              {/* Three tier markers - equally spaced */}
              {COST_TIERS.map((tier, i) => {
                const x = 120 + i * 240;
                return (
                  <g key={tier.name}>
                    <circle cx={x} cy={90} r={14} fill={tier.color} stroke={tier.color} strokeWidth={2} />
                    <text
                      x={x}
                      y={56}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={700}
                      fill={tier.color}
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {tier.name}
                    </text>
                    <text
                      x={x}
                      y={130}
                      textAnchor="middle"
                      fontSize={13}
                      fill={tier.accent}
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {tier.cost}
                    </text>
                  </g>
                );
              })}
              {/* Axis label */}
              <text
                x={COST_VIEW_W / 2}
                y={168}
                textAnchor="middle"
                fontSize={11}
                fill="rgba(255,255,255,0.55)"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                Indexing Budget Grows Left To Right
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {COST_TIERS.map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${tier.color}06`,
                  border: `1px solid ${tier.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tier.color} bold center size={15}>
                  {tier.name}
                </T>
                <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 4 }}>
                  {tier.cost}
                </T>
                <T color={tier.accent} center size={13} style={{ marginTop: 8 }}>
                  {tier.recipe}
                </T>
              </div>
            ))}
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
              Cost climbs with augmentation, not with chunking itself. Recursive Structural is free to run; Contextual
              Retrieval is the big spike because it fires an LLM call per chunk. Treat the spike as a one-time index
              cost amortized across every future query.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Walkthrough: Picking Strategies For The Customer Support Corpus
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The customer support corpus we have used throughout the section splits into three doc-types with three
            different profiles. The right answer is not one strategy: it is a mix. Each row below picks the strategy
            using the three axes from sub-steps 1 to 3.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "180px 260px 1fr",
              gap: 1,
              background: `${C.red}24`,
              border: `1px solid ${C.red}30`,
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Doc-Type
              </T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Profile
              </T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Recommended Strategy
              </T>
            </div>
            {SUPPORT_WALKTHROUGH.map((row) => (
              <div key={row.category} style={{ display: "contents" }}>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "center" }}>
                  <T color={C.red} bold center size={14}>
                    {row.category}
                  </T>
                </div>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "left" }}>
                  <T color="#ef9a9a" size={13}>
                    {row.profile}
                  </T>
                </div>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "left" }}>
                  <T color="#ef9a9a" size={13}>
                    {row.recommendation}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}10`,
              border: `1px solid ${C.red}40`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={16}>
              Production Chunking Is Rarely One Strategy
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
              Mix per doc-type, measure recall, iterate. The 30-doc support corpus uses three different chunking recipes
              - Contextual for FAQ-style billing docs, Hierarchical for technical product features, and Semantic for
              free-form troubleshooting runbooks.
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}30`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              Chapters 12.14 - 12.17 move to embedding model choice and how chunking interacts with embedding quality.
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
