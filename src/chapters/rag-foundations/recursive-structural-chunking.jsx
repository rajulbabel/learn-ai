import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const RECURSIVE_SEPARATORS = [
  {
    label: "Try Paragraph Break First",
    sep: "\\n\\n",
    note: "Most structural - one blank line between blocks.",
  },
  {
    label: "Fall Back To Line Break",
    sep: "\\n",
    note: "Newline inside a paragraph still respects layout.",
  },
  {
    label: "Fall Back To Sentence Break",
    sep: ". ",
    note: "Period followed by space - smallest grammar unit.",
  },
  {
    label: "Last Resort: Word Break",
    sep: " ",
    note: "Plain space - never cuts mid-word.",
  },
];

const RECURSIVE_PROS = [
  "Preserves sentence + paragraph boundaries.",
  "Respects markdown / HTML structure for free.",
  "Zero embedding cost at chunk time (just string ops).",
  "Implemented by every major RAG framework (LangChain RecursiveCharacterTextSplitter, LlamaIndex SentenceSplitter).",
];

const RECURSIVE_CONS = [
  "Doesn't understand semantic boundaries (a topic spanning 4 paragraphs gets split).",
  "Heading-aware but not heading-equivalent (two ## sections on the same theme are split into two chunks).",
  "Plain-text docs without structural markers fall through to sentence/word splits (closer to fixed-size).",
];

export default function RecursiveStructuralChunking(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Split By Structure, Not By Token Count
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Fixed-size cut the password reset doc mid-phrase. Recursive structural chunking instead tries the most
            structural separator first - a paragraph break - and only falls back to smaller separators when the
            resulting chunk still exceeds the size limit. The cut lands at a boundary the writer already chose.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Recursive Separator Priority Tree
              </T>
              <svg viewBox="0 0 520 360" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Vertical priority tree of structural separators starting with paragraph break, falling back through
                  line break, sentence break, to word break, with each arrow labeled If chunk too big to mark the
                  fallback condition.
                </desc>
                {/* Node geometry: viewBox width 520, node width 320, x = (520-320)/2 = 100 */}
                {RECURSIVE_SEPARATORS.map((node, i) => {
                  const x = 100;
                  const y = 16 + i * 84;
                  const w = 320;
                  const h = 64;
                  return (
                    <g key={node.label}>
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx="8"
                        fill={`${C.cyan}18`}
                        stroke={C.cyan}
                        strokeWidth="1.5"
                      />
                      <text x={x + w / 2} y={y + 22} textAnchor="middle" fill="#80deea" fontSize="14" fontWeight="bold">
                        {node.label}
                      </text>
                      <text
                        x={x + w / 2}
                        y={y + 40}
                        textAnchor="middle"
                        fill="#80deea"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        fontSize="13"
                      >
                        Separator = &quot;{node.sep}&quot;
                      </text>
                      <text x={x + w / 2} y={y + 56} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                        {node.note}
                      </text>
                    </g>
                  );
                })}
                {/* Arrows between nodes - between bottom of node i (y_i + 64) and top of node i+1 (y_{i+1} = 16 + (i+1)*84) */}
                {[0, 1, 2].map((i) => {
                  const yStart = 16 + i * 84 + 64;
                  const yEnd = 16 + (i + 1) * 84;
                  const xMid = 260;
                  return (
                    <g key={`arrow-${i}`}>
                      <line
                        x1={xMid}
                        y1={yStart}
                        x2={xMid}
                        y2={yEnd - 6}
                        stroke={C.cyan}
                        strokeWidth="1.5"
                        markerEnd="url(#recurseArrow)"
                      />
                      <text x={xMid + 12} y={yStart + (yEnd - yStart) / 2 + 4} fill="#80deea" fontSize="11">
                        If chunk too big
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <marker
                    id="recurseArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,8 L8,4 z" fill={C.cyan} />
                  </marker>
                </defs>
              </svg>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                The Recursive Rule
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 10 }}>
                Recursive = try the most structural separator first; only fall back if the resulting chunk still exceeds
                the size limit.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.cyan}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#80deea",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Separators = [&quot;\n\n&quot;, &quot;\n&quot;, &quot;. &quot;, &quot; &quot;]
              </div>
              <T color="rgba(255,255,255,0.5)" center size={12} style={{ marginTop: 10 }}>
                The newline character &quot;\n&quot; is what the writer typed to end a line. Two newlines mark a
                paragraph boundary.
              </T>
            </div>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Fixed-Size Breaks Doc-7 In The Wrong Places
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            doc-7 is a login troubleshooting article with three distinct topic sections. Apply fixed-size chunking with
            size=128 and overlap=0 and the cuts ignore the section structure entirely. One chunk ends up mixing
            unrelated topics across the topic boundary.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              color: "#a5d6a7",
              lineHeight: 1.7,
              textAlign: "left",
            }}
          >
            doc-7 (Login Troubleshooting, markdown, ~380 tokens):
            <br />
            <br />
            ## Common Login Errors
            <br />
            Wrong password is the most common cause - the form returns &quot;invalid credentials&quot; without saying
            which field failed. Account locked appears after five failed attempts in fifteen minutes. Session expired
            shows up when an idle tab is reopened after the cookie TTL.
            <br />
            <br />
            ## Browser Compatibility
            <br />
            Safari blocks third-party cookies by default which breaks the SSO redirect. Chrome with strict tracking
            protection has the same effect. The fix is to add the auth domain to the site exceptions list.
            <br />
            <br />
            ## Resetting Account Lockout
            <br />
            Open the account-admin panel and search by user email. Click reset lockout and confirm. The user can log in
            immediately - no email round-trip required. Audit log captures the admin action with a timestamp.
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}12`,
              border: `1px solid ${C.red}30`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Fixed-Size Chunks On doc-7 (Size = 128, Overlap = 0)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Chunk 1 (tokens 0-128): All of &quot;Common Login Errors&quot;
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  Wrong password, account locked, session expired - one clean topic.
                </T>
              </div>
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}24`,
                  border: `1px solid ${C.red}60`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Chunk 2 (tokens 128-256): Tail of &quot;Browser Compatibility&quot; + head of &quot;Account
                  Lockout&quot;
                </T>
                <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                  Spans two unrelated topics. A retrieval query for &quot;Safari cookie SSO&quot; matches this chunk,
                  but the answer is half-Safari, half-lockout-admin. Neither topic is retrievable cleanly.
                </T>
              </div>
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Chunk 3 (tokens 256-380): Tail of &quot;Resetting Account Lockout&quot;
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  Missing the heading, missing the first sentence - the topic context is gone.
                </T>
              </div>
            </div>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
              Chunk 2 mixes browser compatibility with account lockout - retrieval cannot answer either cleanly.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Recursive Structural Splits The Same Doc Cleanly
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Same doc-7. Recursive structural chunking sees three top-level headings and uses the heading break first.
            Each resulting chunk fits under 128 tokens and contains exactly one topic. No section spans a chunk
            boundary.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#b8a9ff",
            }}
          >
            chunks = recursive_structural(doc-7, separators=[&quot;\n## &quot;, &quot;\n\n&quot;, &quot;\n&quot;,
            &quot;. &quot;, &quot; &quot;], size=128)
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}12`,
                border: `1px solid ${C.cyan}40`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 1 (~120 tokens) - Common Login Errors
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                ## Common Login Errors. Wrong password is the most common cause... Account locked appears after five
                failed attempts... Session expired shows up when an idle tab is reopened.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}40`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 (~95 tokens) - Browser Compatibility
              </T>
              <T color="#ffcc80" center size={13} style={{ marginTop: 6 }}>
                ## Browser Compatibility. Safari blocks third-party cookies... Chrome with strict tracking protection
                has the same effect. The fix is to add the auth domain to the site exceptions list.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}12`,
                border: `1px solid ${C.green}40`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Chunk 3 (~115 tokens) - Resetting Account Lockout
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                ## Resetting Account Lockout. Open the account-admin panel... click reset lockout and confirm... Audit
                log captures the admin action with a timestamp.
              </T>
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
              3 chunks, each is exactly one topic. Retrieval matches the topic cleanly: a Safari cookie query goes to
              chunk 2 and nowhere else.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            If A Section Is Too Big, Recurse Into Paragraphs
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Sometimes a single section blows past the size limit. doc-12 (API keys reference) has an
            &quot;Authentication Header Format&quot; section that runs 300 tokens - more than double the 128-token
            target. Recursion handles it cleanly: heading split first, see the chunk is still too big, then fall back to
            paragraph break.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Recursion Trace On doc-12 Section
              </T>
              <svg viewBox="0 0 520 320" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Recursion trace tree showing doc-12 API keys section at 300 tokens being split by paragraph break into
                  three sub-chunks of 100, 110, and 90 tokens that each fit the 128-token target.
                </desc>
                {/* Step 1: heading-level node at top */}
                <rect
                  x="100"
                  y="16"
                  width="320"
                  height="56"
                  rx="8"
                  fill={`${C.red}18`}
                  stroke={C.red}
                  strokeWidth="1.5"
                />
                <text x="260" y="38" textAnchor="middle" fill="#ef9a9a" fontSize="13" fontWeight="bold">
                  doc-12 # &quot;Authentication Header Format&quot;
                </text>
                <text x="260" y="58" textAnchor="middle" fill="#ef9a9a" fontSize="12">
                  300 tokens - too big (limit 128)
                </text>
                {/* Arrow down with label "Recurse: try \n\n" */}
                <line
                  x1="260"
                  y1="72"
                  x2="260"
                  y2="116"
                  stroke={C.orange}
                  strokeWidth="1.5"
                  markerEnd="url(#recurseArrow2)"
                />
                <text x="276" y="98" fill="#ffcc80" fontSize="11">
                  Recurse: try &quot;\n\n&quot;
                </text>
                {/* Step 2: three paragraph sub-chunks */}
                {[
                  { x: 40, label: "Para 1", tokens: 100 },
                  { x: 200, label: "Para 2", tokens: 110 },
                  { x: 360, label: "Para 3", tokens: 90 },
                ].map((p) => (
                  <g key={p.label}>
                    <rect
                      x={p.x}
                      y="124"
                      width="120"
                      height="56"
                      rx="8"
                      fill={`${C.green}18`}
                      stroke={C.green}
                      strokeWidth="1.5"
                    />
                    <text x={p.x + 60} y="146" textAnchor="middle" fill="#a5d6a7" fontSize="13" fontWeight="bold">
                      {p.label}
                    </text>
                    <text x={p.x + 60} y="166" textAnchor="middle" fill="#a5d6a7" fontSize="12">
                      {p.tokens} tokens - fits
                    </text>
                  </g>
                ))}
                {/* Connector lines from heading node to each paragraph */}
                {[100, 260, 420].map((cx, i) => (
                  <line
                    key={`conn-${i}`}
                    x1="260"
                    y1="116"
                    x2={cx}
                    y2="124"
                    stroke={C.orange}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                ))}
                {/* Decision row */}
                <text x="260" y="208" textAnchor="middle" fill="#ffcc80" fontSize="12" fontWeight="bold">
                  Each sub-chunk &le; 128 - stop recursing.
                </text>
                <text x="260" y="228" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  If a paragraph were still &gt; 128, recursion would try &quot;. &quot; (sentence) next, then &quot;
                  &quot; (word).
                </text>
                {/* Three final emitted chunks */}
                {[
                  { x: 40, label: "Chunk A", tokens: 100 },
                  { x: 200, label: "Chunk B", tokens: 110 },
                  { x: 360, label: "Chunk C", tokens: 90 },
                ].map((p) => (
                  <g key={`out-${p.label}`}>
                    <rect
                      x={p.x}
                      y="248"
                      width="120"
                      height="56"
                      rx="8"
                      fill={`${C.cyan}18`}
                      stroke={C.cyan}
                      strokeWidth="1.5"
                    />
                    <text x={p.x + 60} y="270" textAnchor="middle" fill="#80deea" fontSize="13" fontWeight="bold">
                      {p.label}
                    </text>
                    <text x={p.x + 60} y="290" textAnchor="middle" fill="#80deea" fontSize="12">
                      Emit ({p.tokens} tok)
                    </text>
                  </g>
                ))}
                <defs>
                  <marker
                    id="recurseArrow2"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,8 L8,4 z" fill={C.orange} />
                  </marker>
                </defs>
              </svg>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Step-By-Step Trace
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 1: Try heading split
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    The &quot;Authentication Header Format&quot; section comes out at 300 tokens. Limit is 128. Too big.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 2: Fall back to paragraph break &quot;\n\n&quot;
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    The section has three paragraphs of 100, 110, and 90 tokens. Each fits under 128.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 3: Emit three chunks
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    Recursion stops as soon as every produced chunk fits. No need to drop to sentence or word splits.
                  </T>
                </div>
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 12 }}>
                The recursion goes deeper only when needed. Most chunks stop at the paragraph level.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recursive Structural: The 80% Baseline
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Recursive structural is the default chunker in every major RAG framework. It covers around 80% of production
            cases out of the box. Knowing where it wins - and where it does not - frames every later chunking strategy.
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
                Pros
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
                {RECURSIVE_PROS.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>+</span>
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
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Cons
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
                {RECURSIVE_CONS.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}12`,
                      border: `1px solid ${C.red}24`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.red, fontWeight: 700, fontSize: 14 }}>-</span>
                    <T color="#ef9a9a" size={13}>
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
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              <ChapterLink to="20.6">Chapter 20.6</ChapterLink> fixes the semantic-boundary gap.{" "}
              <ChapterLink to="20.8">Chapter 20.8</ChapterLink> fixes the parent-child gap.
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
