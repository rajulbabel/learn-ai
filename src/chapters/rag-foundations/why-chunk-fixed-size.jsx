import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const CHUNK_REASONS = [
  {
    title: "Context Limits",
    desc: "Embedding models cap at 8K tokens; LLMs cap at context-window length. A 500-page manual cannot fit in either.",
  },
  {
    title: "Retrieval Granularity",
    desc: "Top-K retrieval returns chunks, not whole docs. Smaller chunks = more focused matches.",
  },
  {
    title: "Signal Dilution",
    desc: "Averaging 500 pages into one vector buries any specific fact. Smaller chunks keep semantic density.",
  },
];

const FIXED_SIZE_CHUNKS = [
  { name: "Chunk 1", range: "Tokens 0-128" },
  { name: "Chunk 2", range: "Tokens 112-240" },
  { name: "Chunk 3", range: "Tokens 224-352" },
  { name: "Chunk 4", range: "Tokens 336-464" },
];

const FIXED_SIZE_USE_IF = [
  "Docs are short (< 2K tokens each).",
  "Content is homogeneous (uniform paragraphs).",
  "You need a baseline to measure other strategies against.",
  "Budget = zero engineering time.",
];

const FIXED_SIZE_MOVE_ON_IF = [
  "Docs have clear structural markers (markdown, HTML headings).",
  "Content is heterogeneous (one doc = manual + FAQ + changelog).",
  "Cross-chunk facts hurt recall in your eval set.",
];

export default function WhyChunkFixedSize(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Why not embed the whole document?
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The intuitive first idea: take the full 500-page product manual, embed it as one vector, and search. That
            instantly fails for two hard reasons - the document is too long to even fit through the embedding model, and
            even if it did, one vector for 500 pages would mean nothing specific.
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
            <T color={C.red} bold center size={16}>
              Token Budget vs. Embedding Model Ceiling
            </T>
            <svg viewBox="0 0 720 220" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Horizontal token-count bar showing a 500-page document at 250,000 tokens overflowing the 8,192-token
                embedding model ceiling, with the overflow region marked in red and the ceiling marked by a yellow
                dashed line.
              </desc>
              {/* Long doc bar (250,000 tokens) - spans full usable width */}
              <text x="360" y="22" textAnchor="middle" fill="#ef9a9a" fontSize="13" fontWeight="bold">
                500-Page Product Manual = 250,000 Tokens
              </text>
              {/* Bar starts at x=40, ends at x=680, width=640 */}
              <rect x="40" y="36" width="640" height="36" rx="4" fill={`${C.red}30`} stroke={C.red} strokeWidth="1.5" />
              {/* Green portion = first 8,192 tokens (fits) */}
              <rect
                x="40"
                y="36"
                width={(8192 / 250000) * 640}
                height="36"
                rx="4"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.5"
              />
              <text x={40 + (8192 / 250000) * 640 + 12} y="58" fill={C.red} fontSize="12" fontWeight="bold">
                Overflow zone - 241,808 tokens exceed the ceiling
              </text>
              <text x="40" y="90" fill={C.green} fontSize="11">
                Fits (8,192)
              </text>

              {/* Ceiling bar (8,192 tokens) */}
              <text x="360" y="120" textAnchor="middle" fill="#ffe082" fontSize="13" fontWeight="bold">
                Embedding Model Ceiling = 8,192 Tokens (OpenAI ada-3)
              </text>
              <rect
                x="40"
                y="134"
                width="640"
                height="14"
                rx="4"
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              <rect
                x="40"
                y="134"
                width={(8192 / 250000) * 640}
                height="14"
                rx="4"
                fill={`${C.yellow}40`}
                stroke={C.yellow}
                strokeWidth="1.5"
              />
              <text x={40 + (8192 / 250000) * 640 + 8} y="146" fill={C.yellow} fontSize="11">
                Ceiling = 8,192
              </text>

              {/* "One vector for 500 pages?" callout */}
              <text x="360" y="180" textAnchor="middle" fill="#ef9a9a" fontSize="13">
                Even if it fit: one vector
              </text>
              <text
                x="360"
                y="196"
                textAnchor="middle"
                fill="#ef9a9a"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="13"
              >
                [0.21, 0.84, 0.12, ...]
              </text>
              <text x="360" y="212" textAnchor="middle" fill="#ef9a9a" fontSize="13">
                for 500 pages would mean nothing specific.
              </text>
            </svg>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Three Reasons Production RAG Always Chunks
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chunking is not a workaround - it is the fundamental design choice. Three forces make it unavoidable.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {CHUNK_REASONS.map((r) => (
              <div
                key={r.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={16}>
                  {r.title}
                </T>
                <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                  {r.desc}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Bottom line: chunking is the highest-leverage decision in RAG. Get the chunk strategy wrong and every
            downstream stage compounds the error.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Fixed-Size Chunking: A Sliding Window With Overlap
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The simplest possible strategy: slide a fixed token window across the document. Each window becomes one
            chunk. Adjacent chunks overlap by a few tokens so a sentence cut in half still appears whole somewhere.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#a5d6a7",
              lineHeight: 1.6,
            }}
          >
            doc-1 (Password Reset Article, ~480 tokens): &quot;To reset your password, visit account.example.com and
            click forgot password. Enter the email tied to your account. You will receive a reset link valid for 24
            hours. Click the reset link in the email within 24 hours to set a new password. The link expires after that
            and you must request a new one. Once you click the link you will see a form asking for a new password.
            Choose something strong - at least twelve characters with a mix of letters, numbers, and symbols. Confirm
            the password and click save. Your password is updated and you can log in with the new credentials
            immediately. If you do not receive the email, check your spam folder. If you still cannot find it, the email
            tied to your account may be wrong - contact support.&quot;
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
              fontSize: 15,
              color: "#a5d6a7",
            }}
          >
            chunks = slide(doc, size=128, overlap=16)
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              Sliding Window Across doc-1 (Size = 128, Overlap = 16)
            </T>
            <svg viewBox="0 0 720 240" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Sliding window chunk diagram showing four colored 128-token chunks of the doc-1 password reset article
                with 16-token overlap zones shaded darker between adjacent chunks. Each chunk is labeled with its token
                range.
              </desc>
              {/* Token axis: 0 to 464 mapped to x=40..680 (width=640) */}
              <text x="360" y="22" textAnchor="middle" fill="#a5d6a7" fontSize="13" fontWeight="bold">
                Token Position
              </text>
              {/* Axis line */}
              <line x1="40" y1="40" x2="680" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Tick marks */}
              {[0, 128, 240, 352, 464].map((t) => {
                const x = 40 + (t / 464) * 640;
                return (
                  <g key={t}>
                    <line x1={x} y1="36" x2={x} y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x={x} y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                      {t}
                    </text>
                  </g>
                );
              })}

              {/* Chunk bars */}
              {FIXED_SIZE_CHUNKS.map((c, i) => {
                const starts = [0, 112, 224, 336];
                const ends = [128, 240, 352, 464];
                const start = starts[i];
                const end = ends[i];
                const x = 40 + (start / 464) * 640;
                const w = ((end - start) / 464) * 640;
                const y = 78 + i * 36;
                return (
                  <g key={c.name}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height="24"
                      rx="4"
                      fill={`${C.green}30`}
                      stroke={C.green}
                      strokeWidth="1.5"
                    />
                    <text x={x + w / 2} y={y + 16} textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                      {c.name} ({c.range})
                    </text>
                  </g>
                );
              })}

              {/* Overlap shaded bands (darker green between adjacent chunks) */}
              {[112, 224, 336].map((overlapStart, i) => {
                const overlapEnd = overlapStart + 16;
                const x = 40 + (overlapStart / 464) * 640;
                const w = ((overlapEnd - overlapStart) / 464) * 640;
                const y = 78 + i * 36;
                return (
                  <rect
                    key={`overlap-${overlapStart}`}
                    x={x}
                    y={y}
                    width={w}
                    height="60"
                    fill={`${C.green}50`}
                    stroke="none"
                  />
                );
              })}

              {/* Legend */}
              <rect x="60" y="220" width="16" height="10" fill={`${C.green}30`} stroke={C.green} strokeWidth="1" />
              <text x="84" y="230" fill="#a5d6a7" fontSize="12">
                Chunk
              </text>
              <rect x="180" y="220" width="16" height="10" fill={`${C.green}50`} stroke="none" />
              <text x="204" y="230" fill="#a5d6a7" fontSize="12">
                Overlap (16 tokens)
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Fixed-Size Cuts Land Anywhere - Including Mid-Sentence
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The token window does not care about grammar. The 128th token is wherever the 128th token is. Zoom into the
            boundary between chunk 1 and chunk 2 in doc-1 and you see exactly that.
          </T>

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
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 1 Ends Mid-Phrase
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  color: "#ffcc80",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                &quot;...click the reset link in the email within 24 hours to{" "}
                <span style={{ background: `${C.red}40`, padding: "1px 4px", borderRadius: 3, color: "#ef9a9a" }}>
                  set a new
                </span>
                &quot;
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 Starts Mid-Phrase
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  color: "#ffcc80",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                &quot;
                <span style={{ background: `${C.red}40`, padding: "1px 4px", borderRadius: 3, color: "#ef9a9a" }}>
                  password.
                </span>{" "}
                The link expires after that and you must request a new one...&quot;
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}12`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              The Boundary Cut Breaks Retrieval
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
              The chunk that ends with &quot;set a new&quot; has no idea what the user is setting. The chunk that starts
              with &quot;password.&quot; has no idea what action was being taken. Retrieval cannot match the query
              &quot;password reset expiry&quot; to either piece alone - both lose the cross-boundary fact.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Overlap Helps - But Only Partially
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            The standard fix is overlap: duplicate the last N tokens of each chunk into the start of the next. A
            sentence cut at the boundary now appears whole in one of the two adjacent chunks. The cost: storage and
            redundant compute.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Left panel: overlap = 0 */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Overlap = 0 (Naive)
              </T>
              <svg viewBox="0 0 300 80" style={{ width: "100%", height: "auto", display: "block", marginTop: 8 }}>
                <desc>
                  Two clean rectangle chunks side by side with no overlap, showing a red vertical line at the boundary
                  marking the mid-sentence break point.
                </desc>
                <rect
                  x="20"
                  y="20"
                  width="125"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <rect
                  x="155"
                  y="20"
                  width="125"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <line x1="150" y1="12" x2="150" y2="60" stroke={C.red} strokeWidth="2" strokeDasharray="3 2" />
                <text x="82.5" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 1
                </text>
                <text x="217.5" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 2
                </text>
                <text x="150" y="74" textAnchor="middle" fill={C.red} fontSize="11">
                  Hard Cut
                </text>
              </svg>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    Cuts can lose context entirely
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    Recall drops on cross-chunk facts
                  </T>
                </div>
              </div>
            </div>

            {/* Right panel: overlap = 16 */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Overlap = 16 Tokens
              </T>
              <svg viewBox="0 0 300 80" style={{ width: "100%", height: "auto", display: "block", marginTop: 8 }}>
                <desc>
                  Two chunk rectangles with an overlapping band tinted darker between them showing the shared 16-token
                  region where the sentence appears whole in both adjacent chunks.
                </desc>
                <rect
                  x="20"
                  y="20"
                  width="140"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <rect
                  x="140"
                  y="20"
                  width="140"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                {/* Overlap band */}
                <rect x="140" y="20" width="20" height="32" fill={`${C.yellow}60`} stroke="none" />
                <text x="90" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 1
                </text>
                <text x="220" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 2
                </text>
                <text x="150" y="74" textAnchor="middle" fill={C.green} fontSize="11">
                  Shared 16 Tokens
                </text>
              </svg>
              <div
                style={{
                  marginTop: 10,
                  padding: 8,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.yellow}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#ffe082",
                  textAlign: "left",
                  lineHeight: 1.5,
                }}
              >
                Shared text in both adjacent chunks: &quot;set a new password. The link expires&quot;
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Overlap = duplicate storage cost
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Overlap = ~12% more vectors at 128/16
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Still breaks long-range references (entity earlier in doc, pronoun later)
                  </T>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffe082" center size={14}>
              Overlap fixes the easy case (sentence-level cuts) but not the hard case (a definition on page 3 referenced
              by &quot;it&quot; on page 17).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Fixed-Size: The Baseline To Beat
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Fixed-size chunking is the right default in a narrow band of cases. Outside that band, every other strategy
            beats it. Use this table to decide.
          </T>

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
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Use Fixed-Size If
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                {FIXED_SIZE_USE_IF.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>OK</span>
                    <T color="#a5d6a7" size={13}>
                      {row}
                    </T>
                  </div>
                ))}
              </div>
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
              <T color={C.purple} bold center size={16}>
                Move To Structural / Semantic If
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                {FIXED_SIZE_MOVE_ON_IF.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.purple}12`,
                      border: `1px solid ${C.purple}24`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.purple, fontWeight: 700, fontSize: 14 }}>{"->"}</span>
                    <T color="#b8a9ff" size={13}>
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
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Fixed-size is the baseline. Every chunking strategy in production is measured against it. Chapters
              12.8-12.12 each fix one weakness of fixed-size.
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
