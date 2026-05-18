import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { CapstoneDecisionCard } from "../../shared/rag-helpers.jsx";

// Module-private helpers used by THIS chapter:
const CAP_FRAMEWORK_ROWS = [
  { decision: "Should I Use RAG At All?", refs: "12.1 + 12.30", color: C.red, accent: "#ef9a9a" },
  { decision: "How Do I Chunk? (Chunking)", refs: "12.4 - 12.13", color: C.cyan, accent: "#80deea" },
  {
    decision: "Which Embedding + How Do I Index?",
    refs: "12.14, 12.15, 12.16, 12.17",
    color: C.purple,
    accent: "#b8a9ff",
  },
  { decision: "Do I Transform The Query?", refs: "12.18 - 12.21", color: C.orange, accent: "#ffcc80" },
  { decision: "How Do I Pack Context + Generate?", refs: "12.22, 12.23, 12.24", color: C.yellow, accent: "#fff59d" },
  { decision: "Do I Need Advanced Retrieval?", refs: "12.25 - 12.30", color: C.blue, accent: "#90caf9" },
  { decision: "How Do I Evaluate?", refs: "12.31 - 12.35", color: C.green, accent: "#80e9b1" },
  { decision: "How Do I Run Production?", refs: "12.36 - 12.39", color: C.pink, accent: "#f8bbd0" },
  { decision: "Which Framework?", refs: "12.40", color: C.purple, accent: "#b8a9ff" },
];

const CAP_USE_CASE_QUERIES = [
  "What's The Precedent For Tortious Interference In California State Court?",
  "Cases Citing Smith V Jones About Negligence In Medical Contexts",
  "How Has The Standard For Qualified Immunity Evolved 2010-2025?",
];

const CAP_USE_CASE_REQS = [
  { label: "Corpus", value: "200,000 Published Court Cases Across 50 US Jurisdictions" },
  { label: "Metadata", value: "Jurisdiction Tag, Year, Citation Tree" },
  { label: "Quality Bar", value: "Partner-Lawyer Rating >= 4 / 5 On Legal Research Rubric" },
  { label: "Latency Budget", value: "5-10 Seconds (Legal Research Is Patient)" },
  { label: "Cost Budget", value: "$0.05 / Query" },
  { label: "Audit Requirements", value: "Every Answer Cited, Jurisdiction Filter Mandatory" },
];

const CAP_STACK_LAYERS = [
  {
    name: "Ingest",
    color: C.cyan,
    accent: "#80deea",
    body: "Hierarchical + Contextual Chunking; Domain-Adapted Embedding; HNSW + BM25 Hybrid Index; Jurisdiction Metadata; Case-Citation Graph Index.",
  },
  {
    name: "Retrieve",
    color: C.purple,
    accent: "#b8a9ff",
    body: "Multi-Query Expansion; Jurisdiction Filter; Hybrid Retrieval; Cross-Encoder Rerank; GraphRAG For Citation Queries.",
  },
  {
    name: "Generate",
    color: C.yellow,
    accent: "#fff59d",
    body: "16-30k Token Budget; Sandwich Ordering; Mandatory Citations; I-Don't-Know Refusal If No Jurisdiction-Matching Cases.",
  },
  {
    name: "Eval",
    color: C.green,
    accent: "#80e9b1",
    body: "Partner-Curated Golden Set (500 Pairs); LLM-As-Judge With Legal Rubric; RAGAS Faithfulness; Online A/B.",
  },
  {
    name: "Ops",
    color: C.pink,
    accent: "#f8bbd0",
    body: "Prompt Cache (Semantic Cache Disabled); Full Tracing Per Query; Hallucination Detection With Legal-Fact-Check Post-Process; Drift Monitoring On Case-Law Updates.",
  },
];

export default function RAGDecisionFrameworkCapstone(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Complete Decision Framework ─── */}
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Complete RAG Decision Framework
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Nine decisions cover every act of Section 12. Each row maps back to the chapters that taught it. We will
            walk this whole map for one new use case the learner has not seen.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 540" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Nine-row decision tree spanning every act of Section 12: should I use RAG, how to chunk, embedding and
                index, query transformation, context and generation, advanced patterns, evaluation, production
                operations, and framework choice. Each row maps to the chapters that taught it.
              </desc>
              {CAP_FRAMEWORK_ROWS.map((row, i) => {
                const y = 20 + i * 56;
                return (
                  <g key={row.decision}>
                    <rect
                      x="40"
                      y={y}
                      width="640"
                      height="40"
                      rx="8"
                      fill={`${row.color}1a`}
                      stroke={row.color}
                      strokeWidth="1.5"
                    />
                    <text x="60" y={y + 26} fill={row.accent} fontSize="14" fontWeight="700">
                      {i + 1}. {row.decision}
                    </text>
                    <text x="660" y={y + 26} textAnchor="end" fill={row.accent} fontSize="12">
                      Chapters {row.refs}
                    </text>
                    {i < CAP_FRAMEWORK_ROWS.length - 1 && (
                      <line
                        x1="360"
                        y1={y + 40}
                        x2="360"
                        y2={y + 56}
                        stroke={C.purple}
                        strokeWidth="2"
                        markerEnd="url(#cap-arrow)"
                      />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker id="cap-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.purple} />
                </marker>
              </defs>
            </svg>
          </div>
          <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
            Every production RAG decision lives on this map. We will walk it from top to bottom for one new use case.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Capstone Use Case ─── */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Capstone Use Case: Q&amp;A Over Case Law
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Customer: a legal research firm. They need a RAG system for searching across published court cases. A
            fully-different domain from our customer support corpus.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={14}>
              Design Brief
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 8,
              }}
            >
              {CAP_USE_CASE_REQS.flatMap((req) => [
                <T key={`${req.label}-l`} color="#ef9a9a" bold size={13} style={{ textAlign: "right" }}>
                  {req.label}:
                </T>,
                <T key={`${req.label}-v`} color="#ef9a9a" size={13}>
                  {req.value}
                </T>,
              ])}
            </div>
            <T color="#ef9a9a" bold center size={13} style={{ marginTop: 12 }}>
              Example Queries
            </T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {CAP_USE_CASE_QUERIES.map((q) => (
                <T key={q} color="#ef9a9a" center size={12}>
                  - {q}
                </T>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" center size={14} style={{ marginTop: 10 }}>
            We will walk every decision in the framework. Each choice points back to the chapter that taught it.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Decision 1: Chunking ─── */}
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Decision 1: Chunking Strategy (Chapters 12.8, 12.9)
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Case opinions have natural hierarchy. Hierarchical + contextual chunking preserves the structure and the
            cross-document context.
          </T>
          <CapstoneDecisionCard
            color={C.cyan}
            accent="#80deea"
            choice="Hierarchical Chunking (12.8) + Contextual Retrieval (12.9) - Per-Paragraph Chunks With Parent (Case-Level) Metadata And LLM-Injected 'This Paragraph Is From Case X About Y' Preamble."
            why="Case Opinions Have Natural Hierarchy (Intro, Facts, Reasoning, Holding). Hierarchical Preserves Parent-Child Relationships. Contextual Retrieval Injects The Per-Chunk Preamble That Disambiguates Citation-Level Retrieval. Plain Fixed-Size Chunking Would Mid-Sentence-Split A Court's Analysis."
            tradeoff="More Storage (Each Chunk Now Has Parent Metadata). Higher Index Build Cost (Contextual Augmentation Is An LLM Call Per Chunk). Worth It Because Case-Law Precision Demands Citation-Level Retrieval."
          />
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Decision 2: Embedding + Index ─── */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decision 2: Embedding + Index (Chapters 12.15, 12.16, 12.17)
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Legal language needs domain adaptation. Hybrid retrieval catches both citation lookups and semantic queries.
            Jurisdiction filter eliminates most irrelevant cases before reranking.
          </T>
          <CapstoneDecisionCard
            color={C.purple}
            accent="#b8a9ff"
            choice="Domain-Adapted Embedding (12.15) On Top Of A Base Legal-BERT Or Cohere Embed Multilingual. HNSW Index With Hybrid (BM25 + Dense, 12.16). Jurisdiction Stored As Filter Metadata. Cross-Encoder Cascade Rerank (12.17)."
            why="General-Purpose Embeddings Underweight Legal Jargon ('Tortious', 'Qualified Immunity'). Hybrid Catches Both Exact-Citation Lookups ('Smith V Jones') And Semantic Queries ('Medical Negligence Cases'). Jurisdiction Filter Eliminates 96% Of Irrelevant Cases Before Reranking. Cross-Encoder Lifts Precision On Legal-Language Matching."
            tradeoff="Domain-Adapt Requires Labeled Training Pairs (Expensive But One-Time). Cross-Encoder Adds 50-100ms Per Query. Latency Budget Allows It."
          />
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Decision 3: Query Transformation ─── */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Decision 3: Query Transformation (Chapters 12.18, 12.19, 12.20, 12.21)
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Multi-query expansion improves recall on lexically narrow legal language. Decomposition splits complex
            citing queries. HyDE is skipped - case law is precise, fake documents hurt more than help.
          </T>
          <CapstoneDecisionCard
            color={C.orange}
            accent="#ffcc80"
            choice="Multi-Query Expansion (12.20) + Decomposition For Complex Multi-Hop Queries (12.21). HyDE (12.19) SKIPPED."
            why="A Query Like 'Cases Citing X About Y' Naturally Decomposes Into 'Find X' -> 'Find Cases Citing X' -> 'Filter For Cases About Y'. Multi-Query Rewriting (Legal Synonyms: 'Negligence' / 'Duty Of Care' / 'Breach Of Duty') Improves Recall On Lexically-Narrow Legal Language."
            tradeoff="More Retrievals Per Query (3-5x). Cost Goes Up Linearly. Mitigated By Aggressive Deduplication After RRF Merge."
          />
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Decision 4: Context + Generation ─── */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Decision 4: Context Packing And Generation (Chapters 12.22, 12.23, 12.24)
          </T>
          <T color="#fff59d" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            High token budget. Sandwich packing fights lost-in-middle. Mandatory citations for audit. Refusal preferred
            over fabrication.
          </T>
          <CapstoneDecisionCard
            color={C.yellow}
            accent="#fff59d"
            choice="High Token Budget (16-30k Tokens Of Retrieved Context Per Query). Relevance-First Ordering With Sandwich Pattern (12.22) To Fight Lost-In-Middle (12.23). Mandatory Inline Citations Via Prompt Template (12.24). I-Don't-Know Clause If No Jurisdiction-Matching Cases."
            why="Legal Work Needs Many Cases To Reason Across. Token Budget High Because Cost Budget Is High. Sandwich (Place Top Hits At Start AND End) Anchors Model Attention. Citation Mandatory For Audit. Refusal Preferable To Fabrication."
            tradeoff="Higher Per-Query LLM Cost. Accepted Given $0.05 Budget."
          />
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={14}>
              Capstone Prompt Template
            </T>
            <div
              style={{
                marginTop: 10,
                padding: 12,
                borderRadius: 6,
                background: `${C.yellow}10`,
                border: `1px dashed ${C.yellow}33`,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 13,
                color: "#fff59d",
                textAlign: "left",
                whiteSpace: "pre-wrap",
              }}
            >
              {`System: You Are A Legal Research Assistant. Cite Every Case You Reference
Using [Case Name, Year] Format. Only Use The Provided Cases. If No
Provided Case Answers, Say "I Don't Have Case Law For This Question In
The Provided Jurisdiction".

Provided Cases:
[Case A] {Summary + Key Holdings}
...
[Case J] {Summary + Key Holdings}

Question: {User Question}
Jurisdiction: {Jurisdiction}
Answer:`}
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── Decision 5: Advanced Retrieval ─── */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Decision 5: Advanced Retrieval Patterns (Chapters 12.25, 12.27, 12.28, 12.30)
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Case citation is a graph; GraphRAG indexes the relationships. Multi-hop chains the steps for complex
            precedent queries. Long-context is skipped - 200k cases &gt; any context window so RAG is mandatory.
          </T>
          <CapstoneDecisionCard
            color={C.blue}
            accent="#90caf9"
            choice="GraphRAG (12.28) For The Case-Citation Graph (Cases Citing X / Cases Cited By X). Multi-Hop Retrieval (12.25) For 'Cases Citing X About Y' Decomposition. Long-Context (12.30) SKIPPED."
            why="Legal Citation Is A Graph; GraphRAG Indexes The Relationships. Without It, 'Cases Citing X' Requires Querying Every Case In The Corpus. With It, Follow The Citation Edges. Multi-Hop Chains The Steps For Complex Precedent Queries."
            tradeoff="GraphRAG Indexing Is 10x Slower Than Vector-Only. Re-Indexing The Citation Graph On Corpus Update Is A Nightly Batch. Multi-Hop Is Slower Per Query But Precision Gain On Multi-Hop Queries Is Large."
          />
        </Box>
      </Reveal>

      {/* ─── sub=7 ─── Decision 6: Evaluation ─── */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Decision 6: Evaluation (Chapters 12.32, 12.33, 12.34, 12.35)
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Partner-curated golden set is the ground truth. LLM-as-judge with legal rubric. RAGAS faithfulness +
            citation precision. Online A/B on partner-rated 4/5 score.
          </T>
          <CapstoneDecisionCard
            color={C.green}
            accent="#80e9b1"
            choice="LLM-As-Judge (12.32) With A Legal-Specific Rubric. Golden Dataset (12.34) Of 500 Partner-Curated Query/Expected-Answer Pairs. RAGAS Metrics (12.33): Faithfulness, Citation Precision, Jurisdiction Match. Online A/B (12.35) On Partner-Rated 4/5 Score."
            why="General-Purpose RAG Eval Misses Legal Correctness. Partner-Curated Golden Set Is The Ground Truth Because No Automated Metric Reaches Partner-Quality. RAGAS Faithfulness Catches Hallucinations. Citation Precision (% Of Cited Cases That Are Real And On-Point) Is Critical."
            tradeoff="Golden Dataset Is Expensive To Build (Partner Hours). 500 Examples Covers ~80% Of Query Distribution; Remaining 20% Caught By Online Feedback. Rerun Golden Eval Weekly On Prod."
          />
        </Box>
      </Reveal>

      {/* ─── sub=8 ─── Decision 7: Production Ops ─── */}
      <Reveal when={sub >= 8}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Decision 7: Production Operations (Chapters 12.36, 12.38, 12.39)
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10, marginBottom: 14 }}>
            Semantic cache DISABLED (legal queries too unique; false-hit risk too high). Prompt cache ENABLED for stable
            system + few-shot. Tracing per query. Custom legal-fact-check post-process.
          </T>
          <CapstoneDecisionCard
            color={C.pink}
            accent="#f8bbd0"
            choice="Semantic Cache DISABLED. Prompt Cache ENABLED For System Prompt + Few-Shot Examples (12.36). Full Tracing Per Query (12.38). Hallucination Detection With Legal-Fact-Check Post-Process (12.39). Drift Monitoring On Case-Law Updates."
            why="Semantic Cache Fails When 'Negligence In CA' And 'Negligence In NY' Cosine To 0.96 - The Answers Differ Entirely. Prompt Cache Safe Because System + Few-Shot Are Constant. Tracing Every Query Is Non-Negotiable For Audit."
            tradeoff="No Semantic Cache = Higher Per-Query Cost. Mitigated By Prompt Cache. Drift Monitoring Catches When Judicial Reasoning Shifts (Rare But High-Impact)."
          />
        </Box>
      </Reveal>

      {/* ─── sub=9 ─── The Full Stack ─── */}
      <Reveal when={sub >= 9}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Putting It All Together: The Capstone Stack
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Five layers in the stack. Framework choice: No Framework + LlamaIndex retriever for the RAG core (12.40);
            raw Anthropic SDK for generation. Cost: ~$0.04 / query. Latency: ~6s. Audit: every answer carries [Case
            Name, Year] citations.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {CAP_STACK_LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${layer.color}06`,
                  border: `1px solid ${layer.color}12`,
                  display: "grid",
                  gridTemplateColumns: "40px 140px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    background: `${layer.color}33`,
                    color: layer.color,
                    textAlign: "center",
                    lineHeight: "30px",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <T color={layer.color} bold size={15}>
                  {layer.name}
                </T>
                <T color={layer.accent} size={13}>
                  {layer.body}
                </T>
              </div>
            ))}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}10`,
                border: `1px solid ${C.purple}33`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Framework Choice (12.40): No Framework + LlamaIndex Retriever For RAG Core + Raw Anthropic SDK
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                Cost ~$0.04 / Query (Under Budget). Latency ~6 Seconds. Every Answer Carries [Case Name, Year]
                Citations.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" center size={14} style={{ marginTop: 14 }}>
            You now have everything to design production-grade RAG for any new domain. Every choice on this stack maps
            to a chapter you have worked through. Apply this framework. Adjust per use case. Build.
          </T>
        </Box>
      </Reveal>
      {sub < 9 && (
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
