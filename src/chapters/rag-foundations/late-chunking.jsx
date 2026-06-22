import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const LATE_CHUNKING_SCORES = [
  {
    method: "Chunk-Then-Embed (Baseline)",
    methodColor: "red",
    rows: [
      { chunk: "Chunk 1 (Mentions Sarah, Forgets Password)", score: 0.78, isTop: true },
      { chunk: "Chunk 2 (Token Generation, Email Send)", score: 0.65, isTop: false },
      { chunk: "Chunk 3 (Link Expiry, 'She' Re-Request)", score: 0.34, isTop: false },
    ],
    note: 'Top-1 is chunk 1. Misses the actual answer. The "she" vector in chunk 3 has no idea who "she" is.',
  },
  {
    method: "Late Chunking (Jina 2024)",
    methodColor: "green",
    rows: [
      { chunk: "Chunk 1 (Mentions Sarah, Forgets Password)", score: 0.72, isTop: false },
      { chunk: "Chunk 2 (Token Generation, Email Send)", score: 0.68, isTop: false },
      { chunk: "Chunk 3 (Link Expiry, 'She' Re-Request)", score: 0.81, isTop: true },
    ],
    note: 'Top-1 is chunk 3. Hits the answer. The chunk-3 token hidden states attended to "Sarah" in chunk 1 before pooling.',
  },
];

const LATE_CHUNKING_WINS = [
  "Preserves cross-chunk pronouns and references (anaphora resolution).",
  "Single embedding pass equals same compute as chunk-then-embed for the same doc.",
  "Significant recall gains on docs with anaphora (he, she, it, this, that, the X).",
  "Released 2024 by Jina AI for the jina-embeddings-v2 model family.",
];

const LATE_CHUNKING_LIMITS = [
  "Requires an embedding model that exposes token-level hidden states (most OpenAI / Cohere APIs return only the pooled final vector - you cannot late-chunk with them).",
  "Requires the whole doc to fit in one embedding pass (8K-32K token ceilings).",
  "Pooling strategy matters (mean-pool vs CLS vs attention-weighted - jina-embeddings-v2 uses mean-pool).",
];

export default function LateChunking(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Chunk-Then-Embed Loses Cross-Chunk Context
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            doc-1 is the password-reset article. Split it into 3 chunks. Chunk 1 names &quot;Sarah&quot; and sets up the
            reset flow. Chunk 3 uses the pronoun &quot;she&quot; with no antecedent. When you embed each chunk on its
            own, the chunk-3 vector has zero knowledge that &quot;she&quot; refers to Sarah from chunk 1. The cross-
            chunk reference is lost the moment the chunker scissored the doc apart.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 1 (Tokens 0-128)
              </T>
              <T color="#80deea" center size={12} style={{ marginTop: 8 }}>
                When a user named <span style={{ color: C.green, fontWeight: 700 }}>Sarah</span> forgets her password,
                the system generates a one-time token. The reset flow begins on the login page when she clicks the
                Forgot Password link.
              </T>
              <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 8 }}>
                Antecedent lives here: &quot;Sarah&quot;.
              </T>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 2 (Tokens 128-256)
              </T>
              <T color="#80deea" center size={12} style={{ marginTop: 8 }}>
                The token is hashed, stored in the password_reset_tokens table, and emailed as a single-use link. The
                email subject reads &quot;Reset Your Password&quot; and arrives within thirty seconds.
              </T>
              <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 8 }}>
                No mention of who requested it.
              </T>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Chunk 3 (Tokens 256-384)
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 8 }}>
                The link expires after 24 hours; <span style={{ color: C.red, fontWeight: 700 }}>she</span> must request
                a new one if <span style={{ color: C.red, fontWeight: 700 }}>she</span> misses the window. The old token
                is invalidated immediately on reuse.
              </T>
              <T color="#ef9a9a" center size={11} style={{ marginTop: 8 }}>
                Pronoun &quot;she&quot; has no antecedent in this chunk. The vector matches she/her queries weakly.
              </T>
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
              Cross-chunk references are not just a corner case. Any doc with pronouns, &quot;the system&quot;, &quot;
              this approach&quot;, &quot;that field&quot; - which is basically every prose doc - bleeds context the
              moment you slice it.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Chunk-Then-Embed Vs. Embed-Then-Chunk
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Two orderings of the same operations. The first chunks the doc, then runs the embedding model on each chunk
            in isolation. The second runs the embedding model on the whole doc first - so attention links every token to
            every other token - then pools the token hidden states into chunk vectors at the chunk boundaries. Same
            compute, vastly different vectors.
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
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Chunk-Then-Embed (Baseline)
              </T>
              <svg viewBox="0 0 320 260" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Chunk-then-embed flow: a horizontal doc bar is sliced into three colored chunk segments, each chunk
                  feeding its own arrow into a separate embedding-model box, producing three chunk vectors v1, v2, v3
                  where each pass sees only its own tokens.
                </desc>
                {/* Doc bar at top, viewBox width 320, bar width 280, x_start = (320-280)/2 = 20 */}
                <rect
                  x="20"
                  y="14"
                  width="280"
                  height="22"
                  fill="rgba(255,255,255,0.06)"
                  stroke={C.red}
                  strokeWidth="1"
                  rx="3"
                />
                <text x="160" y="29" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                  doc-1 (384 tokens)
                </text>
                {/* 3 chunk segments below */}
                {[0, 1, 2].map((i) => {
                  const x = 20 + i * (280 / 3) + 6;
                  const w = 280 / 3 - 12;
                  return (
                    <g key={`chunk-${i}`}>
                      <rect
                        x={x}
                        y="50"
                        width={w}
                        height="26"
                        fill={`${C.red}24`}
                        stroke={C.red}
                        strokeWidth="1.2"
                        rx="4"
                      />
                      <text x={x + w / 2} y="67" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="bold">
                        Chunk {i + 1}
                      </text>
                      {/* Down arrow to embedding box */}
                      <line
                        x1={x + w / 2}
                        y1="80"
                        x2={x + w / 2}
                        y2="108"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${x + w / 2 - 4.5},104 ${x + w / 2 + 4.5},104 ${x + w / 2},112`}
                        fill="rgba(255,255,255,0.7)"
                      />
                      {/* Embedding model box (separate per chunk) */}
                      <rect
                        x={x}
                        y="112"
                        width={w}
                        height="34"
                        fill={`${C.red}12`}
                        stroke={C.red}
                        strokeWidth="1"
                        rx="4"
                      />
                      <text x={x + w / 2} y="128" textAnchor="middle" fill="#ef9a9a" fontSize="10" fontWeight="bold">
                        Embed
                      </text>
                      <text x={x + w / 2} y="140" textAnchor="middle" fill="#ef9a9a" fontSize="9">
                        (Chunk Only)
                      </text>
                      {/* Down arrow to vector */}
                      <line
                        x1={x + w / 2}
                        y1="150"
                        x2={x + w / 2}
                        y2="178"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${x + w / 2 - 4.5},174 ${x + w / 2 + 4.5},174 ${x + w / 2},182`}
                        fill="rgba(255,255,255,0.7)"
                      />
                      {/* Chunk vector */}
                      <rect
                        x={x}
                        y="182"
                        width={w}
                        height="22"
                        fill={`${C.red}30`}
                        stroke={C.red}
                        strokeWidth="1"
                        rx="3"
                      />
                      <text x={x + w / 2} y="197" textAnchor="middle" fill="#ef9a9a" fontSize="10" fontWeight="bold">
                        v{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x="160" y="232" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  3 Separate Passes
                </text>
                <text x="160" y="248" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="bold">
                  Each Vector Sees Only Its Own Chunk
                </text>
              </svg>
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
                Late Chunking (Embed-Then-Chunk)
              </T>
              <svg viewBox="0 0 320 260" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Late chunking flow: a horizontal doc bar feeds a single embedding-model box that runs whole-doc
                  attention across all tokens, producing a token-hidden-state row, which is then mean-pooled at chunk
                  boundaries to produce three chunk vectors v_chunk1, v_chunk2, v_chunk3.
                </desc>
                {/* Doc bar */}
                <rect
                  x="20"
                  y="14"
                  width="280"
                  height="22"
                  fill="rgba(255,255,255,0.06)"
                  stroke={C.green}
                  strokeWidth="1"
                  rx="3"
                />
                <text x="160" y="29" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                  doc-1 (384 tokens)
                </text>
                {/* Arrow to single embedding pass */}
                <line x1="160" y1="40" x2="160" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <polygon points="155.5,54 164.5,54 160,62" fill="rgba(255,255,255,0.7)" />
                {/* Single embedding model box */}
                <rect
                  x="20"
                  y="62"
                  width="280"
                  height="38"
                  fill={`${C.green}12`}
                  stroke={C.green}
                  strokeWidth="1.4"
                  rx="5"
                />
                <text x="160" y="79" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                  Single Embedding Pass
                </text>
                <text x="160" y="93" textAnchor="middle" fill="#a5d6a7" fontSize="10">
                  Attention Over All 384 Tokens
                </text>
                {/* Arrow down to token-hidden-state strip */}
                <line x1="160" y1="104" x2="160" y2="122" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <polygon points="155.5,118 164.5,118 160,126" fill="rgba(255,255,255,0.7)" />
                {/* Token hidden-state strip - 12 small cells */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const w = 280 / 12;
                  const x = 20 + i * w;
                  return (
                    <rect
                      key={`tok-${i}`}
                      x={x + 1}
                      y="126"
                      width={w - 2}
                      height="18"
                      fill={`${C.green}30`}
                      stroke={C.green}
                      strokeWidth="0.8"
                      rx="2"
                    />
                  );
                })}
                <text x="160" y="159" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">
                  Token Hidden States (N x Hidden_Dim)
                </text>
                {/* Mean-pool boundaries: 3 segments */}
                <line
                  x1={20 + 280 / 3}
                  y1="124"
                  x2={20 + 280 / 3}
                  y2="146"
                  stroke={C.yellow}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <line
                  x1={20 + (2 * 280) / 3}
                  y1="124"
                  x2={20 + (2 * 280) / 3}
                  y2="146"
                  stroke={C.yellow}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                {/* Mean-pool label sits between the token strip and the arrow */}
                <text x="160" y="170" textAnchor="middle" fill="#fff59d" fontSize="9" fontWeight="bold">
                  Mean-Pool At Boundaries
                </text>
                {/* Arrow down to chunk vectors */}
                <line x1="160" y1="176" x2="160" y2="186" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <polygon points="155.5,182 164.5,182 160,190" fill="rgba(255,255,255,0.7)" />
                {/* 3 chunk vectors */}
                {[0, 1, 2].map((i) => {
                  const x = 20 + i * (280 / 3) + 6;
                  const w = 280 / 3 - 12;
                  return (
                    <g key={`v-${i}`}>
                      <rect
                        x={x}
                        y="190"
                        width={w}
                        height="22"
                        fill={`${C.green}30`}
                        stroke={C.green}
                        strokeWidth="1"
                        rx="3"
                      />
                      <text x={x + w / 2} y="205" textAnchor="middle" fill="#a5d6a7" fontSize="10" fontWeight="bold">
                        v_chunk{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x="160" y="232" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  1 Pass + Pool
                </text>
                <text x="160" y="248" textAnchor="middle" fill="#a5d6a7" fontSize="11" fontWeight="bold">
                  Every Chunk Vector Sees The Whole Doc
                </text>
              </svg>
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
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#a5d6a7",
            }}
          >
            Baseline: v_i = embed(chunk_i) &nbsp;&nbsp;|&nbsp;&nbsp; Late: H = embed_tokens(doc); v_chunk_i =
            mean-pool(H[chunk_i.start : chunk_i.end])
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Late Chunking On Doc-1: Chunk 3&apos;s Vector Now Encodes Sarah
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Trace the same 3-chunk doc-1 through the late-chunking pipeline. The embedding model runs once over all 384
            tokens. Attention links every token to every other token. The hidden state for the pronoun &quot;she&quot;
            in chunk 3 has attended to &quot;Sarah&quot; in chunk 1. When we mean-pool the chunk-3 token hidden states,
            the resulting v_chunk3 still carries the Sarah signal.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Single Attention Pass Over The Full Doc
            </T>
            {/*
              SVG geometry: viewBox 0 0 640 280.
              Token row width 600, x_start = (640-600)/2 = 20.
              12 tokens, each 50 wide. Pool boundaries at token 4 (x=220) and token 8 (x=420).
            */}
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Token-attention sweep diagram over doc-1 password reset showing a single attention arc covering all
                tokens, with mean-pool boundaries at token positions 128 and 256 producing three chunk vectors, with
                annotation that chunk 3&apos;s vector still encodes &apos;Sarah&apos; from chunk 1.
              </desc>
              {/* Sweeping attention arc from token 1 to token N */}
              <path d="M 45 80 Q 320 10 595 80" fill="none" stroke={C.purple} strokeWidth="2" strokeDasharray="6 3" />
              <text x="320" y="22" textAnchor="middle" fill={C.purple} fontSize="13" fontWeight="bold">
                Single Attention Pass (Token 1 To Token N)
              </text>
              {/* Down arrows from the arc onto tokens 1 and N */}
              <line x1="45" y1="80" x2="45" y2="88" stroke={C.purple} strokeWidth="2" />
              <polygon points="40.5,86 49.5,86 45,94" fill={C.purple} />
              <line x1="595" y1="80" x2="595" y2="88" stroke={C.purple} strokeWidth="2" />
              <polygon points="590.5,86 599.5,86 595,94" fill={C.purple} />
              {/* 12 token cells, x_start=20, w=50 each, total 600 */}
              {Array.from({ length: 12 }).map((_, i) => {
                const x = 20 + i * 50;
                const isSarah = i === 0;
                const isShe = i === 9;
                const chunk = i < 4 ? 1 : i < 8 ? 2 : 3;
                const baseColor = chunk === 1 ? C.cyan : chunk === 2 ? C.blue : C.orange;
                return (
                  <g key={`token-${i}`}>
                    <rect
                      x={x + 2}
                      y="94"
                      width="46"
                      height="32"
                      fill={isSarah || isShe ? `${baseColor}40` : `${baseColor}18`}
                      stroke={baseColor}
                      strokeWidth={isSarah || isShe ? "1.5" : "1"}
                      rx="3"
                    />
                    <text x={x + 25} y="114" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                      {isSarah ? "Sarah" : isShe ? "she" : `t${i + 1}`}
                    </text>
                    {/* Hidden state cell below each token */}
                    <rect
                      x={x + 6}
                      y="134"
                      width="38"
                      height="14"
                      fill={`${baseColor}25`}
                      stroke={baseColor}
                      strokeWidth="0.8"
                      rx="2"
                    />
                    <text x={x + 25} y="145" textAnchor="middle" fill="#fff" fontSize="9">
                      h{i + 1}
                    </text>
                  </g>
                );
              })}
              {/* Pool boundary lines at token 128 and 256 (= positions 4 and 8 in our 12-token strip) */}
              <line
                x1={20 + 4 * 50}
                y1="90"
                x2={20 + 4 * 50}
                y2="160"
                stroke={C.yellow}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <line
                x1={20 + 8 * 50}
                y1="90"
                x2={20 + 8 * 50}
                y2="160"
                stroke={C.yellow}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <text x={20 + 4 * 50} y="86" textAnchor="middle" fill="#fff59d" fontSize="10" fontWeight="bold">
                Pool At Token 128
              </text>
              <text x={20 + 8 * 50} y="86" textAnchor="middle" fill="#fff59d" fontSize="10" fontWeight="bold">
                Pool At Token 256
              </text>
              {/* Chunk vector row */}
              {[0, 1, 2].map((c) => {
                const x = 20 + c * (600 / 3);
                const w = 600 / 3 - 8;
                const color = c === 0 ? C.cyan : c === 1 ? C.blue : C.orange;
                return (
                  <g key={`vc-${c}`}>
                    <rect
                      x={x + 4}
                      y="174"
                      width={w}
                      height="28"
                      fill={`${color}30`}
                      stroke={color}
                      strokeWidth="1.2"
                      rx="4"
                    />
                    <text x={x + w / 2 + 4} y="192" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
                      v_chunk{c + 1}
                    </text>
                  </g>
                );
              })}
              <text x="320" y="220" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                v_chunk_i = Mean-Pool(h_start...h_end)
              </text>
              {/* Annotation for v_chunk3 referencing Sarah */}
              <text x="320" y="248" textAnchor="middle" fill="#ffcc80" fontSize="12" fontWeight="bold">
                v_chunk3 Pools h9 To h12 - And h10 (&quot;she&quot;) Attended To h1 (&quot;Sarah&quot;).
              </text>
              <text x="320" y="266" textAnchor="middle" fill="#ffcc80" fontSize="11">
                So v_chunk3 Still Encodes &quot;Sarah&quot; Even Though The Word Lives In Chunk 1.
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            H = embed_tokens(doc-1) &nbsp;|&nbsp; H.shape = [384, 768] &nbsp;|&nbsp; v_chunk3 = mean(H[256:384])
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Query &quot;Did Sarah Get Her Reset Email?&quot; Now Matches Chunk 3
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Same query, same 3 chunks, same embedding model. The only thing that changes is whether we embedded each
            chunk in isolation or pooled token states from a whole-doc pass. The retrieval scores flip - chunk 3 goes
            from a 0.34 miss to a 0.81 hit because its vector now carries the Sarah signal.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {LATE_CHUNKING_SCORES.map((pass) => {
              const baseColor = pass.methodColor === "red" ? C.red : C.green;
              const lightText = pass.methodColor === "red" ? "#ef9a9a" : "#a5d6a7";
              return (
                <div
                  key={pass.method}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: `${baseColor}06`,
                    border: `1px solid ${baseColor}30`,
                    textAlign: "center",
                  }}
                >
                  <T color={baseColor} bold center size={16}>
                    {pass.method}
                  </T>
                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 2fr) 90px 90px",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <T color={baseColor} bold size={12}>
                      Chunk
                    </T>
                    <T color={baseColor} bold center size={12}>
                      Score
                    </T>
                    <T color={baseColor} bold center size={12}>
                      Rank
                    </T>
                    {pass.rows.map((row) => (
                      <div key={row.chunk} style={{ display: "contents" }}>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "left",
                          }}
                        >
                          <T color={lightText} size={12}>
                            {row.chunk}
                          </T>
                        </div>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "center",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          <T color={lightText} size={13} bold={row.isTop}>
                            {row.score.toFixed(2)}
                          </T>
                        </div>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "center",
                          }}
                        >
                          <T color={lightText} size={12} bold={row.isTop}>
                            {row.isTop ? "Top-1" : "-"}
                          </T>
                        </div>
                      </div>
                    ))}
                  </div>
                  <T color={lightText} center size={13} style={{ marginTop: 10 }}>
                    {pass.note}
                  </T>
                </div>
              );
            })}
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
              The retriever ranks chunk 3 first because its vector now encodes the antecedent &quot;Sarah&quot; from
              chunk 1. Same chunks. Same query. Only the embedding order changed.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Late Chunking: Pros, Cons, When To Use
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Late chunking is a free recall boost on docs with anaphora, but only if you control the embedding stack.
            Same compute as chunk-then-embed for the same doc. The hard constraints are model access and context window.
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
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Wins
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {LATE_CHUNKING_WINS.map((win) => (
                  <div
                    key={win}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {win}
                    </T>
                  </div>
                ))}
              </div>
            </div>

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
                Limits
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {LATE_CHUNKING_LIMITS.map((limit) => (
                  <div
                    key={limit}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {limit}
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
              Reach for late chunking when your corpus has heavy anaphora (support docs, legal text, narrative
              articles), the docs fit in one embedding pass, and you can run an open-weights model like jina-
              embeddings-v2 that exposes token-level hidden states. Otherwise keep chunk-then-embed and lean on
              reranking or hybrid search to recover cross-chunk recall.
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
