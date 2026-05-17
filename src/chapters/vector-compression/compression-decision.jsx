import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function CompressionDecision(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Five techniques, which one? Four inputs decide.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The last seven chapters introduced scalar quantization, product quantization, binary quantization,
            Matryoshka truncation, IVF-PQ, and HNSW+PQ. Each one works. None is universally the right pick. The choice
            depends on four inputs - corpus size, embedding dimensionality, the database&apos;s capability surface, and
            how much recall loss the product can absorb.
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
              The four decision axes
            </T>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  axis: "Corpus size (N)",
                  role: "Primary driver",
                  detail: "Under 1M, nothing helps. At 100M+, compression is not optional.",
                },
                {
                  axis: "Embedding dim (d)",
                  role: "Gates binary quantization",
                  detail: "Binary quantization needs d >= 768 to stay production-safe (from 11.15's recall table).",
                },
                {
                  axis: "Database capability",
                  role: "Constrains the menu",
                  detail:
                    "pgvector: halfvec only. Pinecone: abstracted. Qdrant/Weaviate: full suite + rescore.",
                },
                {
                  axis: "Recall tolerance",
                  role: "Override knob",
                  detail: "High-stakes retrieval (medical, legal) downgrades one step from the default.",
                },
              ].map((r) => (
                <div
                  key={r.axis}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}22`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    {r.axis}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {r.role}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                    {r.detail}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The next sub-step folds these four inputs into a single decision tree. The one after walks four real-world
            scenarios through it, numbers and all.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The decision tree: N drives the branch; d and DB gate binary quantization
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            One pre-step is orthogonal and always worth trying: if the embedding model is Matryoshka-trained (OpenAI
            text-embedding-3 series, BGE-M3, some Cohere variants), request a smaller dim at the API call itself -
            truncating 3072 to 1536 or 1024 costs about 1% quality and halves every downstream memory number. Then walk
            the main tree below.
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
              The compression decision flowchart
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <svg viewBox="0 0 640 510" style={{ width: "100%", maxWidth: 640, height: "auto" }}>
                <desc>
                  Compression-technique decision flowchart. The optional MRL pre-step sits centered at the top: when the
                  embedding model is Matryoshka-trained the dimension can be truncated at the API call before anything
                  else runs. A dashed arrow flows down into the main Inputs box (corpus size N, embedding dimension d,
                  database capability, recall tolerance). The main flow then branches on N: under 1M skips quantization;
                  1M to 10M uses scalar quantization; 10M to 100M uses binary quantization plus rescore when d is at
                  least 768 and the DB supports it, otherwise falls back to scalar; 100M and above uses HNSW plus
                  product quantization as the production default at scale.
                </desc>
                {/* MRL pre-step centered above Inputs */}
                <rect
                  x={200}
                  y={10}
                  width={240}
                  height={50}
                  rx={8}
                  fill={`${C.yellow}18`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <text x={320} y={32} fill={C.yellow} fontSize={14} fontWeight="bold" textAnchor="middle">
                  MRL pre-step (optional)
                </text>
                <text x={320} y={50} fill={C.bright} fontSize={11} textAnchor="middle">
                  Truncate d at embed time
                </text>
                {/* dashed arrow MRL -> Inputs */}
                <line x1={320} y1={60} x2={320} y2={80} stroke={C.dim} strokeWidth={1} strokeDasharray="4 3" />
                {/* Inputs */}
                <rect
                  x={180}
                  y={80}
                  width={280}
                  height={50}
                  rx={8}
                  fill={`${C.cyan}22`}
                  stroke={C.cyan}
                  strokeWidth={2}
                />
                <text x={320} y={102} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Inputs: N, d, DB, recall tolerance
                </text>
                <text x={320} y={120} fill={C.bright} fontSize={11} textAnchor="middle">
                  Start here
                </text>
                {/* connector down to backbone, then 4 drops */}
                <line x1={320} y1={130} x2={320} y2={200} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={200} x2={560} y2={200} stroke={C.dim} strokeWidth={1} />
                <line x1={80} y1={200} x2={80} y2={240} stroke={C.dim} strokeWidth={1} />
                <line x1={240} y1={200} x2={240} y2={240} stroke={C.dim} strokeWidth={1} />
                <line x1={400} y1={200} x2={400} y2={240} stroke={C.dim} strokeWidth={1} />
                <line x1={560} y1={200} x2={560} y2={240} stroke={C.dim} strokeWidth={1} />
                <text x={320} y={220} fill={C.dim} fontSize={12} textAnchor="middle">
                  Branch on N
                </text>
                {[
                  {
                    x: 10,
                    label: "N < 1M",
                    color: C.green,
                    pick: "Skip",
                    sub: "HNSW + fp32",
                  },
                  {
                    x: 170,
                    label: "1M - 10M",
                    color: C.yellow,
                    pick: "Scalar Q",
                    sub: "Int8, 4x",
                  },
                  {
                    x: 330,
                    label: "10M - 100M",
                    color: C.orange,
                    pick: "BQ + rescore",
                    sub: "(d>=768, DB ok)",
                  },
                  {
                    x: 490,
                    label: "N >= 100M",
                    color: C.red,
                    pick: "HNSW + PQ",
                    sub: "The scale default",
                  },
                ].map((r) => (
                  <g key={r.label}>
                    <rect
                      x={r.x}
                      y={240}
                      width={140}
                      height={50}
                      rx={6}
                      fill={`${r.color}18`}
                      stroke={r.color}
                      strokeWidth={2}
                    />
                    <text x={r.x + 70} y={260} fill={r.color} fontSize={13} fontWeight="bold" textAnchor="middle">
                      {r.label}
                    </text>
                    <text x={r.x + 70} y={278} fill={C.bright} fontSize={11} textAnchor="middle">
                      -&gt; {r.pick}
                    </text>
                    <line x1={r.x + 70} y1={290} x2={r.x + 70} y2={316} stroke={C.dim} strokeWidth={1} />
                    <text x={r.x + 70} y={330} fill={C.dim} fontSize={11} textAnchor="middle">
                      {r.sub}
                    </text>
                  </g>
                ))}
                <text x={320} y={370} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  Fallback rule for the BQ branch
                </text>
                <text x={320} y={390} fill={C.dim} fontSize={11} textAnchor="middle">
                  If d &lt; 768 OR DB lacks BQ+rescore: downgrade to Scalar Q
                </text>
                <text x={320} y={425} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  Recall-tolerance override
                </text>
                <text x={320} y={445} fill={C.dim} fontSize={11} textAnchor="middle">
                  If recall must exceed 99%: downgrade one step (BQ -&gt; SQ; SQ -&gt; skip; PQ -&gt; raise m)
                </text>
                <text x={320} y={480} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  Fold inputs -&gt; one compression stack
                </text>
              </svg>
            </div>
          </div>
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
              Database capability gate
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr",
                gap: 6,
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>DB</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>SQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>PQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>BQ + rescore</div>
              {[
                ["Qdrant, Weaviate", "yes", "yes", "yes"],
                ["Milvus", "yes", "yes", "partial"],
                ["pgvector", "halfvec", "no", "no"],
                ["Pinecone", "managed", "managed", "managed"],
              ].map((row) => (
                <div key={row[0]} style={{ display: "contents" }}>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[0]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[1]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[2]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[3]}</div>
                </div>
              ))}
            </div>
            <T color={C.bright} size={13} style={{ marginTop: 10, fontStyle: "italic", textAlign: "center" }}>
              For pgvector the tree collapses to halfvec or nothing regardless of N. For Pinecone, compression is
              abstracted - the only knob is MRL at embed time.
            </T>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The tree is deliberately conservative. Start with the default branch for your N, confirm the gate for the BQ
            path, and downgrade by one step if recall must hold above 99%.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Four worked scenarios: the tree with real numbers
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Same tree, four corpora. Each scenario fixes the four inputs, walks the branches, and prints the memory
            number that lands on the procurement doc.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Startup - the skip path",
                color: C.green,
                stack: "Qdrant + OpenAI-3-large (d=3072) + N=500K",
                path: "N < 1M gate hits immediately; MRL optional at this scale",
                result: "Skip quantization. HNSW + fp32.",
                math: "500K x 12 KB = 6 GB RAM. Fits on any dev box.",
              },
              {
                title: "Mid-scale - the SQ default",
                color: C.cyan,
                stack: "Qdrant + BGE-large-en-v1.5 (d=1024, not MRL) + N=5M",
                path: "No MRL on this model; N in 1M-10M -> SQ default; below BQ's 10M band so rescore not needed",
                result: "HNSW + SQ (int8).",
                math: "Fp32 = 5M x 1024 x 4 B = ~20 GB. Final = 5M x 1024 B = ~5 GB. 4x smaller, ~1% recall loss.",
              },
              {
                title: "Growing product - the high-leverage path",
                color: C.yellow,
                stack: "Qdrant + OpenAI-3-large (d: 3072 -> 1536 via MRL) + N=50M",
                path: "MRL halves d up front; N in 10M-100M; d>=768; Qdrant supports BQ+rescore",
                result: "HNSW + MRL + BQ + rescore.",
                math: "Fp32 baseline = 300 GB. Final = 50M x 192 B = ~10 GB. ~30x smaller, <2% recall loss.",
              },
              {
                title: "Massive scale - the HNSW+PQ default",
                color: C.red,
                stack: "Qdrant + OpenAI-3-small (d: 1536 -> 1024 via MRL) + N=200M",
                path: "MRL reduces d; N >= 100M gate hits immediately",
                result: "HNSW + PQ (m=96).",
                math: "Fp32 = 820 GB. Final = 200M x 96 B = ~19 GB. ~40x smaller. The scale default per 11.18.",
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  padding: "12px 14px",
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}22`,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <T color={s.color} bold center size={15}>
                  {s.title}
                </T>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Stack
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2, fontFamily: "monospace" }}>
                    {s.stack}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Tree walk
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2 }}>
                    {s.path}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.35)",
                    textAlign: "center",
                  }}
                >
                  <T color={s.color} bold size={14} center>
                    {s.result}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4, fontFamily: "monospace" }} center>
                    {s.math}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scenario 1 is the &quot;do nothing&quot; case that engineers talk themselves out of. It is the right answer
            more often than the literature suggests. Quantization buys memory savings you do not yet need; it costs
            tuning and recall risk you cannot yet afford.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Heuristics to keep and traps to avoid
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Five rules of thumb compress this whole chapter into a design-review checklist. The four traps are the
            failure modes that reliably surface when teams skip the checklist.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold center size={16}>
                Five rules of thumb
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    rule: "Don't quantize until memory bites",
                    why: "Under 1M vectors, complexity isn't worth the tradeoff - run fp32 and move on.",
                  },
                  {
                    rule: "MRL is free; always apply it first",
                    why: "If the model supports it, truncate at embed time. Halves downstream memory before the DB sees anything.",
                  },
                  {
                    rule: "DB first, compression second",
                    why: "Pick the DB for ops/filter/SLA reasons, then pick compression from whatever menu that DB offers. pgvector shortens the menu to one option.",
                  },
                  {
                    rule: "Rescoring is nearly free; turn it on by default",
                    why: "BQ without rescore loses 5-10% recall; with rescore loses <1%. Cost is one extra disk read per top-k candidate.",
                  },
                  {
                    rule: "Measure recall on your own data before committing",
                    why: "Generic benchmark numbers assume generic data distributions. A 5-minute recall test on your corpus beats any published table.",
                  },
                ].map((h, idx) => (
                  <div
                    key={h.rule}
                    style={{
                      padding: "8px 10px",
                      background: `${C.green}10`,
                      border: `1px solid ${C.green}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.green} bold size={14}>
                      {idx + 1}. {h.rule}
                    </T>
                    <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                      {h.why}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.red} bold center size={16}>
                Four traps to avoid
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    trap: "BQ at d <= 256",
                    why: "Recall collapses to ~0.82 or worse per 11.15's measured table. The binary code loses too much information at low dimensions.",
                  },
                  {
                    trap: "Skipping MRL when available",
                    why: "Leaves free compression on the table. An OpenAI-3 embedding at d=3072 with no MRL truncation wastes half the memory budget.",
                  },
                  {
                    trap: "Stacking SQ+PQ+BQ without measuring",
                    why: "Each layer adds tuning surface. Benchmark before committing to a stacked scheme; the recall multiplier compounds.",
                  },
                  {
                    trap: "Trusting recall numbers that silently disable rescoring",
                    why: "BQ without rescore is a different product than BQ with rescore. Published comparisons that omit rescore settings mislead.",
                  },
                ].map((t, idx) => (
                  <div
                    key={t.trap}
                    style={{
                      padding: "8px 10px",
                      background: `${C.red}10`,
                      border: `1px solid ${C.red}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.red} bold size={14}>
                      {idx + 1}. {t.trap}
                    </T>
                    <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                      {t.why}
                    </T>
                  </div>
                ))}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.green }}>five rules</span> on the left,{" "}
            <span style={{ color: C.red }}>four traps</span> on the right
            <br />
            Together they compress the five compression techniques into a working decision framework
          </div>
        </Box>
      </Reveal>
      {sub < 3 && (
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
