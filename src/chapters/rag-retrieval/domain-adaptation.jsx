import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Medical-domain semantic gap pairs used in sub=0.
const DOMAIN_GAP_PAIRS = [
  {
    a: "MI",
    b: "Myocardial infarction",
    offShelf: 0.42,
    fineTuned: 0.95,
  },
  {
    a: "tPA contraindicated",
    b: "Tissue plasminogen activator should not be given",
    offShelf: 0.51,
    fineTuned: 0.9,
  },
];

// Recall on a held-out medical query set. Used in sub=0.
const RECALL_BARS = [
  { label: "Off-The-Shelf Embedder", recall: 0.62, color: C.red, accent: "#ef9a9a" },
  { label: "Fine-Tuned On Medical Corpus", recall: 0.88, color: C.green, accent: "#a5d6a7" },
];

// Three training triples drawn from the running support corpus. Used in sub=2.
const TRAINING_TRIPLES = [
  {
    anchor: "How do I reset my password?",
    positive: "[doc-1, chunk 1] - To reset your password, visit the account settings page and click Forgot Password.",
    negative: "[doc-3, chunk 1] - Refunds are processed within 5-7 business days of approval.",
  },
  {
    anchor: "I can't sign in",
    positive: "[doc-25] - Login Troubleshooting: clear cookies, verify caps lock, and check for typos in your email.",
    negative: "[doc-7] - Dashboard tour: the home screen shows your usage metrics and recent activity.",
  },
  {
    anchor: "Cancel my subscription",
    positive: "[doc-15] - Account Deletion Flow: go to billing settings and click Cancel Plan to stop renewal.",
    negative: "[doc-2] - Email Change: update your contact email from the profile settings page.",
  },
];

// Two-column decision card for sub=3.
const FINE_TUNE_DECISION = {
  fineTune: [
    "Highly Specialized Vocabulary (Medical, Legal, Code)",
    "Off-The-Shelf Recall Below 80% On Your Golden Set",
    "You Have 5k+ Query-Positive Pairs Labeled",
    "Budget For Periodic Re-Training As Embeddings Drift",
  ],
  skip: [
    "General English Domain",
    "Common Domain (E-Commerce, Support, News)",
    "Less Than 5k Labeled Pairs Available",
    "Recall Already Above 80% On The Golden Set",
  ],
};

// Before vs after metrics on the support corpus. Used in sub=4.
const BEFORE_AFTER_METRICS = [
  { metric: "Recall@5", before: 0.78, after: 0.91, fmt: (v) => v.toFixed(2), unit: "" },
  { metric: "MRR", before: 0.62, after: 0.84, fmt: (v) => v.toFixed(2), unit: "" },
  { metric: "Latency", before: 30, after: 30, fmt: (v) => v.toString(), unit: " ms" },
];

// Loss curve points (epoch -> training loss). Used in sub=4.
const LOSS_CURVE = [
  { epoch: 0, loss: 0.5 },
  { epoch: 1, loss: 0.22 },
  { epoch: 2, loss: 0.1 },
  { epoch: 3, loss: 0.05 },
];

// Helper: render one row of the 3-column training triple table in sub=2.
function TripleRowCells({ triple }) {
  const cellBase = {
    padding: 10,
    borderRadius: 6,
    textAlign: "center",
  };
  return (
    <>
      <div
        style={{
          ...cellBase,
          background: `${C.blue}06`,
          border: `1px solid ${C.blue}18`,
        }}
      >
        <T color="#90caf9" bold center size={13}>
          {triple.anchor}
        </T>
      </div>
      <div
        style={{
          ...cellBase,
          background: `${C.green}06`,
          border: `1px solid ${C.green}18`,
        }}
      >
        <T color="#a5d6a7" center size={13}>
          {triple.positive}
        </T>
      </div>
      <div
        style={{
          ...cellBase,
          background: `${C.red}06`,
          border: `1px solid ${C.red}18`,
        }}
      >
        <T color="#ef9a9a" center size={13}>
          {triple.negative}
        </T>
      </div>
    </>
  );
}

export default function DomainAdaptation(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // SVG geometry for the triplet-loss diagram in sub=1.
  const TRIPLET_VIEW_W = 520;
  const TRIPLET_VIEW_H = 280;
  const ANCHOR_X = TRIPLET_VIEW_W / 2;
  const ANCHOR_Y = TRIPLET_VIEW_H / 2;
  const POS_DX = 90;
  const POS_DY = -50;
  const NEG_DX = 180;
  const NEG_DY = 70;
  const POS_X = ANCHOR_X - POS_DX;
  const POS_Y = ANCHOR_Y + POS_DY;
  const NEG_X = ANCHOR_X + NEG_DX;
  const NEG_Y = ANCHOR_Y + NEG_DY;
  const TRIPLET_NODE_R = 14;
  const POS_LEN = Math.hypot(POS_X - ANCHOR_X, POS_Y - ANCHOR_Y);
  const NEG_LEN = Math.hypot(NEG_X - ANCHOR_X, NEG_Y - ANCHOR_Y);
  const PULL_START_X = ANCHOR_X + (TRIPLET_NODE_R * (POS_X - ANCHOR_X)) / POS_LEN;
  const PULL_START_Y = ANCHOR_Y + (TRIPLET_NODE_R * (POS_Y - ANCHOR_Y)) / POS_LEN;
  const PULL_END_X = POS_X - (TRIPLET_NODE_R * (POS_X - ANCHOR_X)) / POS_LEN;
  const PULL_END_Y = POS_Y - (TRIPLET_NODE_R * (POS_Y - ANCHOR_Y)) / POS_LEN;
  const PUSH_START_X = ANCHOR_X + (TRIPLET_NODE_R * (NEG_X - ANCHOR_X)) / NEG_LEN;
  const PUSH_START_Y = ANCHOR_Y + (TRIPLET_NODE_R * (NEG_Y - ANCHOR_Y)) / NEG_LEN;
  const PUSH_END_X = NEG_X - (TRIPLET_NODE_R * (NEG_X - ANCHOR_X)) / NEG_LEN;
  const PUSH_END_Y = NEG_Y - (TRIPLET_NODE_R * (NEG_Y - ANCHOR_Y)) / NEG_LEN;

  // SVG geometry for the before/after bar chart in sub=4.
  const BAR_VIEW_W = 600;
  const BAR_VIEW_H = 220;
  const BAR_GROUP_W = 140;
  const BAR_GAP = 40;
  const BAR_W = 50;
  const BAR_INNER_GAP = 10;
  const BAR_BASELINE_Y = 180;
  const BAR_MAX_H = 130;
  const BARS_SPAN = BEFORE_AFTER_METRICS.length * BAR_GROUP_W + (BEFORE_AFTER_METRICS.length - 1) * BAR_GAP;
  const BARS_X_START = (BAR_VIEW_W - BARS_SPAN) / 2;

  // SVG geometry for the loss curve in sub=4.
  const LOSS_VIEW_W = 520;
  const LOSS_VIEW_H = 200;
  const LOSS_PAD_L = 70;
  const LOSS_PAD_R = 40;
  const LOSS_PAD_T = 30;
  const LOSS_PAD_B = 40;
  const LOSS_PLOT_W = LOSS_VIEW_W - LOSS_PAD_L - LOSS_PAD_R;
  const LOSS_PLOT_H = LOSS_VIEW_H - LOSS_PAD_T - LOSS_PAD_B;
  const LOSS_MAX = 0.5;
  const lossX = (e) => LOSS_PAD_L + (e / (LOSS_CURVE.length - 1)) * LOSS_PLOT_W;
  const lossY = (v) => LOSS_PAD_T + (1 - v / LOSS_MAX) * LOSS_PLOT_H;
  const lossPath = LOSS_CURVE.map((p, i) => `${i === 0 ? "M" : "L"} ${lossX(p.epoch)} ${lossY(p.loss)}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Off-the-shelf gap on a specialized domain */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Off-The-Shelf Embeddings Sometimes Miss Domain Semantics
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            General-purpose embedding models are trained on web text. They know "cat" and "dog" are similar but they
            have barely seen MI (myocardial infarction) or tPA (tissue plasminogen activator). On a medical corpus, this
            shows up as low similarity between an abbreviation and its full term - and that wrecks retrieval.
          </T>

          {/* Two domain-pair examples with before/after cosine */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Cosine Similarity On A Medical Corpus
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {DOMAIN_GAP_PAIRS.map((p) => (
                <div
                  key={p.a}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${C.cyan}18`,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold center size={14}>
                    &quot;{p.a}&quot; Vs &quot;{p.b}&quot;
                  </T>
                  <div
                    style={{
                      marginTop: 8,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: 6,
                        borderRadius: 4,
                        background: `${C.red}06`,
                        border: `1px solid ${C.red}24`,
                      }}
                    >
                      <T color="#ef9a9a" center size={12}>
                        Off-The-Shelf
                      </T>
                      <T color="#ef9a9a" bold center size={16}>
                        {p.offShelf.toFixed(2)}
                      </T>
                    </div>
                    <div
                      style={{
                        padding: 6,
                        borderRadius: 4,
                        background: `${C.green}06`,
                        border: `1px solid ${C.green}24`,
                      }}
                    >
                      <T color="#a5d6a7" center size={12}>
                        Fine-Tuned (Target)
                      </T>
                      <T color="#a5d6a7" bold center size={16}>
                        {p.fineTuned.toFixed(2)}
                      </T>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recall bar chart */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Recall@10 On A Held-Out Medical Query Set
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {RECALL_BARS.map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr 70px",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <T color={r.accent} size={14}>
                    {r.label}
                  </T>
                  <div
                    style={{
                      height: 18,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.recall * 100}%`,
                        height: "100%",
                        background: r.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <T color={r.accent} bold size={14} style={{ textAlign: "right" }}>
                    {r.recall.toFixed(2)}
                  </T>
                </div>
              ))}
            </div>
            <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
              26-point recall lift. That is the value of teaching the embedder your domain.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Contrastive learning + triplet loss */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Contrastive Fine-Tuning: Pull Positives Close, Push Negatives Away
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            We do not retrain the embedder from scratch. We take the existing model and nudge its vector space using
            triples: an anchor query, a positive document that should match it, and a negative document that should not.
            Each training step pulls the anchor closer to the positive and pushes it farther from the negative.
          </T>

          {/* Triplet diagram SVG */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg
              viewBox={`0 0 ${TRIPLET_VIEW_W} ${TRIPLET_VIEW_H}`}
              width="100%"
              style={{ maxWidth: 520, height: "auto" }}
            >
              <desc>
                Triplet-loss diagram showing an anchor point in the center with arrows pulling a positive sample close
                and pushing a negative sample away.
              </desc>

              {/* Pull arrow (anchor -> positive) */}
              <defs>
                <marker
                  id="arrow-pull"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5d6a7" />
                </marker>
                <marker
                  id="arrow-push"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef9a9a" />
                </marker>
              </defs>

              {/* Pull (anchor -> positive): green */}
              <line
                x1={PULL_START_X}
                y1={PULL_START_Y}
                x2={PULL_END_X}
                y2={PULL_END_Y}
                stroke="#a5d6a7"
                strokeWidth="2"
                markerEnd="url(#arrow-pull)"
              />
              <text
                x={(ANCHOR_X + POS_X) / 2 - 30}
                y={(ANCHOR_Y + POS_Y) / 2 + 25}
                fill="#a5d6a7"
                fontSize="13"
                textAnchor="middle"
              >
                Pull Close
              </text>

              {/* Push (anchor -> negative): red */}
              <line
                x1={PUSH_START_X}
                y1={PUSH_START_Y}
                x2={PUSH_END_X}
                y2={PUSH_END_Y}
                stroke="#ef9a9a"
                strokeWidth="2"
                markerEnd="url(#arrow-push)"
              />
              <text
                x={(ANCHOR_X + NEG_X) / 2 + 8}
                y={(ANCHOR_Y + NEG_Y) / 2 - 35}
                fill="#ef9a9a"
                fontSize="13"
                textAnchor="middle"
              >
                Push Away
              </text>

              {/* Anchor point */}
              <circle cx={ANCHOR_X} cy={ANCHOR_Y} r="14" fill={`${C.purple}40`} stroke={C.purple} strokeWidth="2" />
              <text x={ANCHOR_X} y={ANCHOR_Y + 5} fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                A
              </text>
              <text x={ANCHOR_X} y={ANCHOR_Y + 50} fill="#b8a9ff" fontSize="13" textAnchor="middle">
                Anchor (Query)
              </text>

              {/* Positive point */}
              <circle cx={POS_X} cy={POS_Y} r="14" fill={`${C.green}40`} stroke={C.green} strokeWidth="2" />
              <text x={POS_X} y={POS_Y + 5} fill="#a5d6a7" fontSize="14" fontWeight="700" textAnchor="middle">
                P
              </text>
              <text x={POS_X} y={POS_Y - 22} fill="#a5d6a7" fontSize="13" textAnchor="middle">
                Positive (Match)
              </text>

              {/* Negative point */}
              <circle cx={NEG_X} cy={NEG_Y} r="14" fill={`${C.red}40`} stroke={C.red} strokeWidth="2" />
              <text x={NEG_X} y={NEG_Y + 5} fill="#ef9a9a" fontSize="14" fontWeight="700" textAnchor="middle">
                N
              </text>
              <text x={NEG_X} y={NEG_Y + 34} fill="#ef9a9a" fontSize="13" textAnchor="middle">
                Negative (Wrong)
              </text>
            </svg>
          </div>

          {/* Triplet loss formula */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.purple} bold center size={14}>
              Triplet Loss Formula
            </T>
            <T color="#b8a9ff" center size={18} style={{ marginTop: 8 }}>
              L_triplet = max(0, d(A, P) - d(A, N) + margin)
            </T>
            <T color="rgba(255,255,255,0.6)" center size={13} style={{ marginTop: 8 }}>
              d = distance, A = anchor, P = positive, N = negative, margin = 0.2 typical.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              The loss is zero only when the negative is at least &quot;margin&quot; farther from the anchor than the
              positive. If the negative is too close, the gradient pushes it away. The margin prevents the loss from
              going to zero just because positives are slightly closer than negatives.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Training data construction */}
      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Pair Construction Decides Quality
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The training data IS the model. Each row is one triple: an anchor (real user query), a positive (the chunk
            that should match), and a negative (a chunk that should not). For our support corpus that means turning real
            tickets and FAQs into thousands of these rows.
          </T>

          {/* Training triples table */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr 1.4fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {/* Header row */}
            {["Anchor (Query)", "Positive (Match)", "Negative (Wrong)"].map((h, i) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: i === 0 ? `${C.blue}12` : i === 1 ? `${C.green}12` : `${C.red}12`,
                  border: `1px solid ${i === 0 ? C.blue : i === 1 ? C.green : C.red}30`,
                }}
              >
                <T color={i === 0 ? C.blue : i === 1 ? C.green : C.red} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {/* Data rows */}
            {TRAINING_TRIPLES.map((t) => (
              <TripleRowCells key={t.anchor} triple={t} />
            ))}
          </div>

          {/* Hard negatives callout */}
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
            <T color={C.yellow} bold center size={15}>
              Hard Negatives Teach The Most
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 8 }}>
              A &quot;hard negative&quot; is a doc that sits NEAR the positive in vector space but is irrelevant - same
              vocabulary, wrong topic. Mining hard negatives (top-20 retrieval results minus the true positive) teaches
              the model the actual semantic boundary. Easy negatives (random docs from unrelated topics) waste compute
              because the gap is already obvious to the base model.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── When to fine-tune */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            When Is Fine-Tuning Worth The Cost?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Fine-tuning takes labeled data, compute time, and a recurring re-training budget as your corpus drifts.
            Spend it when off-the-shelf is clearly failing on your domain. Skip it when general-purpose embedders
            already clear the bar.
          </T>

          {/* Decision card: two columns */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            {/* Fine-tune column */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Fine-Tune
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {FINE_TUNE_DECISION.fineTune.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.25)",
                      border: `1px solid ${C.green}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {row}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Skip column */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}24`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Skip - Use Off-The-Shelf
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {FINE_TUNE_DECISION.skip.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.25)",
                      border: `1px solid ${C.red}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {row}
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
              The cleanest signal: build a small golden set (200-500 query-positive pairs) and measure recall with the
              off-the-shelf model. Below 80%, fine-tuning is usually worth it. Above 80%, the marginal gain rarely pays
              for the recurring training cost.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Before vs after on the support corpus */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Before Vs After On The Support Corpus
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            Here is what fine-tuning on 50k support-ticket triples does to the support corpus. Recall and MRR jump.
            Latency does not - fine-tuning changes the vector geometry, not the index or the query path.
          </T>

          {/* Before/after bar chart */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${BAR_VIEW_W} ${BAR_VIEW_H}`} width="100%" style={{ maxWidth: 600, height: "auto" }}>
              <desc>
                Before-versus-after bar chart comparing recall, MRR, and latency for off-the-shelf vs fine-tuned
                embeddings on the support corpus.
              </desc>

              {/* Baseline */}
              <line
                x1={BARS_X_START - 10}
                y1={BAR_BASELINE_Y}
                x2={BARS_X_START + BARS_SPAN + 10}
                y2={BAR_BASELINE_Y}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />

              {BEFORE_AFTER_METRICS.map((m, i) => {
                const groupX = BARS_X_START + i * (BAR_GROUP_W + BAR_GAP);
                const denom = m.metric === "Latency" ? 60 : 1;
                const beforeH = Math.max(2, (m.before / denom) * BAR_MAX_H);
                const afterH = Math.max(2, (m.after / denom) * BAR_MAX_H);
                const beforeX = groupX + (BAR_GROUP_W - 2 * BAR_W - BAR_INNER_GAP) / 2;
                const afterX = beforeX + BAR_W + BAR_INNER_GAP;
                return (
                  <g key={m.metric}>
                    {/* Before bar */}
                    <rect
                      x={beforeX}
                      y={BAR_BASELINE_Y - beforeH}
                      width={BAR_W}
                      height={beforeH}
                      fill={C.red}
                      opacity="0.75"
                    />
                    <text
                      x={beforeX + BAR_W / 2}
                      y={BAR_BASELINE_Y - beforeH - 6}
                      fill="#ef9a9a"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.fmt(m.before)}
                      {m.unit}
                    </text>
                    <text
                      x={beforeX + BAR_W / 2}
                      y={BAR_BASELINE_Y + 14}
                      fill="#ef9a9a"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      Before
                    </text>

                    {/* After bar */}
                    <rect
                      x={afterX}
                      y={BAR_BASELINE_Y - afterH}
                      width={BAR_W}
                      height={afterH}
                      fill={C.green}
                      opacity="0.75"
                    />
                    <text
                      x={afterX + BAR_W / 2}
                      y={BAR_BASELINE_Y - afterH - 6}
                      fill="#a5d6a7"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.fmt(m.after)}
                      {m.unit}
                    </text>
                    <text
                      x={afterX + BAR_W / 2}
                      y={BAR_BASELINE_Y + 14}
                      fill="#a5d6a7"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      After
                    </text>

                    {/* Group label */}
                    <text
                      x={groupX + BAR_GROUP_W / 2}
                      y={BAR_BASELINE_Y + 32}
                      fill={C.pink}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.metric}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Loss curve */}
          <T color={C.pink} bold center size={16} style={{ marginTop: 16 }}>
            Training Loss Over 3 Epochs (50k Triples)
          </T>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOSS_VIEW_W} ${LOSS_VIEW_H}`} width="100%" style={{ maxWidth: 520, height: "auto" }}>
              <desc>
                Training loss curve showing triplet loss dropping from 0.5 at epoch 0 to 0.05 at epoch 3 over a
                fine-tuning run on 50k support-corpus triples.
              </desc>

              {/* Axes */}
              <line
                x1={LOSS_PAD_L}
                y1={LOSS_PAD_T}
                x2={LOSS_PAD_L}
                y2={LOSS_PAD_T + LOSS_PLOT_H}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              />
              <line
                x1={LOSS_PAD_L}
                y1={LOSS_PAD_T + LOSS_PLOT_H}
                x2={LOSS_PAD_L + LOSS_PLOT_W}
                y2={LOSS_PAD_T + LOSS_PLOT_H}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x={LOSS_PAD_L - 8} y={LOSS_PAD_T + 4} fill="rgba(255,255,255,0.6)" fontSize="11" textAnchor="end">
                0.50
              </text>
              <text
                x={LOSS_PAD_L - 8}
                y={LOSS_PAD_T + LOSS_PLOT_H + 4}
                fill="rgba(255,255,255,0.6)"
                fontSize="11"
                textAnchor="end"
              >
                0.00
              </text>
              <text
                x={LOSS_PAD_L - 30}
                y={LOSS_PAD_T + LOSS_PLOT_H / 2}
                fill="#f5b7f8"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                transform={`rotate(-90, ${LOSS_PAD_L - 30}, ${LOSS_PAD_T + LOSS_PLOT_H / 2})`}
              >
                Loss
              </text>

              {/* X-axis labels */}
              {LOSS_CURVE.map((p) => (
                <text
                  key={p.epoch}
                  x={lossX(p.epoch)}
                  y={LOSS_PAD_T + LOSS_PLOT_H + 16}
                  fill="rgba(255,255,255,0.6)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  Epoch {p.epoch}
                </text>
              ))}

              {/* Loss line */}
              <path d={lossPath} stroke={C.pink} strokeWidth="2.5" fill="none" />
              {LOSS_CURVE.map((p) => (
                <g key={`pt-${p.epoch}`}>
                  <circle cx={lossX(p.epoch)} cy={lossY(p.loss)} r="4" fill={C.pink} />
                  <text
                    x={lossX(p.epoch) + 8}
                    y={lossY(p.loss) - 6}
                    fill="#f5b7f8"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    {p.loss.toFixed(2)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Cost note */}
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
              Cost: ~$200 for a 50k-pair fine-tune on BGE-large via a managed service. Quality delta: usually 10-20
              points on recall. Re-evaluate every 3-6 months as your corpus drifts and new query patterns appear.
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
