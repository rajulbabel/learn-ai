import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

const BARE_LLM_FAILURES = [
  {
    title: "Knowledge Cutoff",
    desc: "Trained on data through 2023; can't answer about 2025 events.",
  },
  {
    title: "Hallucination",
    desc: "Will confidently invent plausible-sounding facts.",
  },
  {
    title: "No Citations",
    desc: "Cannot point to sources for verification.",
  },
  {
    title: "Private Data Unknown",
    desc: "Knows nothing about your internal docs.",
  },
  {
    title: "Stale Facts",
    desc: "Public info from years ago, not last week.",
  },
];

const FINE_TUNING_VS_RAG_ROWS = [
  {
    property: "Cost",
    finetune: "Tens of thousands of dollars per refresh",
    rag: "Cents per query",
  },
  {
    property: "Freshness",
    finetune: "Frozen at training time",
    rag: "Reflects index updates instantly",
  },
  {
    property: "Traceability",
    finetune: "No source attribution",
    rag: "Cite the chunk used",
  },
];

const RAG_FLOW_STEPS = ["User Question", "Retrieve Relevant Docs", "LLM Reads Docs + Answers"];

const PRODUCTION_REASONS = [
  {
    problem: "Knowledge Cutoff",
    win: "Solved",
    detail: "Index is fresh; re-embed when docs change.",
  },
  {
    problem: "Hallucination",
    win: "Reduced",
    detail: "Model is anchored to retrieved text.",
  },
  {
    problem: "No Citation",
    win: "Solved",
    detail: "Cite the exact chunk used.",
  },
  {
    problem: "Private Data",
    win: "Solved",
    detail: "Index your own docs; no fine-tune needed.",
  },
  {
    problem: "Cheap To Refresh",
    win: "Re-embed Only Changed Docs",
    detail: "Update individual chunks; no full retrain.",
  },
];

export const WhyLLMsNeedRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Bare LLMs Have Hard Limits
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Drop a frontier model into a production app and the cracks appear fast. It does not know about events after
            its cutoff, makes up facts, can't show its work, and has never seen your private data. These failure modes
            are inherent to the model alone.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {BARE_LLM_FAILURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {f.title}
                </T>
                <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                  {f.desc}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Fine-Tuning Doesn't Solve The Problem
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The obvious first answer is &quot;just fine-tune the model on our data.&quot; In practice, fine-tuning is
            slow, expensive, and untraceable. RAG flips every property.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1.5fr",
              gap: 8,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                Property
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                Fine-Tuning
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                RAG
              </T>
            </div>
            {FINE_TUNING_VS_RAG_ROWS.map((r) => (
              <div key={r.property} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.orange}06`,
                    border: `1px solid ${C.orange}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={14}>
                    {r.property}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.red}06`,
                    border: `1px solid ${C.red}12`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" center size={14}>
                    {r.finetune}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.green}06`,
                    border: `1px solid ${C.green}12`,
                    textAlign: "center",
                  }}
                >
                  <T color="#a5d6a7" center size={14}>
                    {r.rag}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 12 }}>
            Fine-tuning bakes knowledge INTO the weights (expensive to update, no audit trail). RAG keeps knowledge
            OUTSIDE the model in a retrievable index (cheap, fresh, traceable).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            RAG: Ground The Answer In Retrieved Documents
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The fix is a tiny architectural change: before the model answers, fetch the relevant documents and stuff
            them into the prompt. The model now reads first, answers second.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {RAG_FLOW_STEPS.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                    textAlign: "center",
                    minWidth: 140,
                  }}
                >
                  <T color={C.cyan} bold center size={15}>
                    {step}
                  </T>
                </div>
                {i < RAG_FLOW_STEPS.length - 1 && (
                  <span style={{ color: C.cyan, fontSize: 24, fontWeight: 700 }}>&rarr;</span>
                )}
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>
            Instead of asking the model from memory, we ground its answer in retrieved documents. The model reads the
            docs, then answers, anchored to what the docs say.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Same Question, Two Answers
          </T>
          <T color={C.purple} center size={15} style={{ marginTop: 8 }}>
            Question: &quot;What is our refund policy?&quot;
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Bare LLM
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  marginTop: 6,
                  borderRadius: 4,
                  background: `${C.red}20`,
                  color: C.red,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                MADE UP
              </div>
              <T color="#ef9a9a" center size={15} style={{ marginTop: 10 }}>
                Our standard refund policy offers a 30-day money-back guarantee on all subscriptions. You can request a
                refund through your account dashboard.
              </T>
            </div>
            <div
              style={{
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                RAG
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  marginTop: 6,
                  borderRadius: 4,
                  background: `${C.green}20`,
                  color: C.green,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                CITED
              </div>
              <T color="#a5d6a7" center size={15} style={{ marginTop: 10 }}>
                Per [doc-4] (refunds.md): Refunds are issued for cancellations within 14 days of payment, prorated for
                annual plans.
              </T>
              <div
                style={{
                  marginTop: 10,
                  background: "#00e67606",
                  border: "1px solid #00e67612",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#a5d6a7",
                  textAlign: "center",
                }}
              >
                [doc-4] Refunds are issued for cancellations within 14 days. Annual plans prorated.
              </div>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 12 }}>
            Both answers sound confident. Only one is checkable. The bare model invented numbers that look reasonable;
            the RAG answer is pinned to a real chunk we can show the user.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            5 Reasons Production Systems Use RAG
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Every failure mode from sub-step 1 gets a clean answer, plus refresh becomes nearly free.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {PRODUCTION_REASONS.map((r) => (
              <div
                key={r.problem}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={15}>
                  {r.problem}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                  &rarr; {r.win}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                  {r.detail}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

export const NaiveRAGPipeline = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Naive RAG Pipeline (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const WhereNaiveRAGBreaks = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Where Naive RAG Breaks (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
