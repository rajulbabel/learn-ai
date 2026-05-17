import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Sub=1 lexical-mismatch table.
const LEXICAL_MISMATCH_ROWS = [
  {
    user: '"I can\'t sign in"',
    doc: '"Login Troubleshooting"',
    mismatch: "Sign in vs log in",
  },
  {
    user: '"How do I cancel?"',
    doc: '"Account Deletion Flow"',
    mismatch: "Cancel vs delete",
  },
  {
    user: '"My screen is frozen"',
    doc: '"Browser Performance Issues"',
    mismatch: "Screen frozen vs browser performance",
  },
];

// Sub=2 ambiguity branches.
const AMBIGUITY_BRANCHES = [
  {
    intent: "Export data to CSV",
    doc: "doc-9 (Export Formats)",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    intent: "Export user list for admin",
    doc: "doc-26 (Bulk Operations)",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    intent: "Cancel an export job that failed",
    doc: "doc-29 (Export Failures)",
    color: C.pink,
    accent: "#f5b7f8",
  },
];

// Sub=3 multi-intent split.
const MULTI_INTENT_SUBS = [
  {
    intent: "How to cancel subscription",
    doc: "doc-15 (Account Deletion Flow)",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    intent: "How to get a refund",
    doc: "doc-4 (Refunds)",
    color: C.green,
    accent: "#a5d6a7",
  },
];

// Sub=4 strategy preview grid.
const TRANSFORM_STRATEGIES = [
  {
    name: "HyDE (12.19)",
    fixes: "Fixes Lexical Mismatch",
    detail: "Ask an LLM to draft a hypothetical answer, then embed the answer instead of the question.",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    name: "Multi-Query Expansion (12.20)",
    fixes: "Fixes Ambiguity",
    detail: "Generate N paraphrases of the query, retrieve for each, then merge results.",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    name: "Query Decomposition (12.21)",
    fixes: "Fixes Multi-Intent",
    detail: "Split a compound query into independent sub-queries, retrieve for each, then combine.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Query Routing (12.21)",
    fixes: "Picks The Right Index",
    detail: "Classify the query and send it to the index, tool, or filter that best matches.",
    color: C.blue,
    accent: "#90caf9",
  },
];

// Helper: render one row of the 3-column lexical-mismatch table in sub=1.
function LexicalMismatchRowCells({ row }) {
  const cell = {
    padding: 10,
    borderRadius: 6,
    background: `${C.red}06`,
    border: `1px solid ${C.red}18`,
    textAlign: "center",
  };
  return (
    <>
      <div style={cell}>
        <T color="#ef9a9a" center size={13}>
          {row.user}
        </T>
      </div>
      <div style={cell}>
        <T color="#ef9a9a" center size={13}>
          {row.doc}
        </T>
      </div>
      <div style={cell}>
        <T color="#ef9a9a" bold center size={13}>
          {row.mismatch}
        </T>
      </div>
    </>
  );
}

export default function WhyTransformQueries(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=2 ambiguity diagram geometry.
  const AMB_W = 560;
  const AMB_H = 260;
  const SRC_W = 200;
  const SRC_H = 52;
  const SRC_X = 24;
  const SRC_Y = (AMB_H - SRC_H) / 2;
  const DEST_W = 260;
  const DEST_H = 54;
  const DEST_X = AMB_W - DEST_W - 24;
  const destYs = [24, (AMB_H - DEST_H) / 2, AMB_H - DEST_H - 24];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Framing: user query rarely best retrieval query */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            User Queries Are Rarely Optimal For Retrieval
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The user types a sentence in their own words. The retriever embeds it and finds the nearest chunks. But the
            user's wording is rarely the wording that lives in the index. The right doc is in the corpus and the
            retriever still misses it.
          </T>

          {/* Concrete miss: user words vs doc words, with cosine score */}
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
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                User Query
              </T>
              <T color="#ffcc80" center size={16} style={{ marginTop: 8 }}>
                &quot;I can&apos;t sign in&quot;
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Best Doc In Corpus
              </T>
              <T color="#ffcc80" center size={16} style={{ marginTop: 8 }}>
                &quot;Login Troubleshooting&quot;
              </T>
            </div>
          </div>

          {/* Cosine score + rank */}
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.orange}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Cosine(user, best_doc) = 0.61
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 4 }}>
              Top-3 misses it. Correct doc lands at rank 7.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Three failure shapes ruin naive retrieval. Four query-transformation strategies fix them.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Failure 1: lexical mismatch */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Lexical Mismatch: The User And The Doc Use Different Words
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Users and docs share an idea but not vocabulary. The retriever sees two strings of tokens that look
            unrelated and the right chunk falls out of the top-k.
          </T>

          {/* Header row */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.2fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {["User Query", "Doc Title", "Word Mismatch"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.red}12`,
                  border: `1px solid ${C.red}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {LEXICAL_MISMATCH_ROWS.map((row) => (
              <LexicalMismatchRowCells key={row.user} row={row} />
            ))}
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
              Dense embeddings help a bit (sign-in and log-in sit close in vector space) but only partially. HyDE
              (12.19) and multi-query (12.20) close the gap by rewriting the user query into wording that matches the
              doc.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Failure 2: ambiguity */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Ambiguity: The Query Has Multiple Plausible Intents
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            One short question, three different things the user might want. A naive retriever picks one direction and
            quietly drops the other two.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${AMB_W} ${AMB_H}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Three-branch interpretation diagram showing the ambiguous query &quot;How do I export?&quot; fanning out
                to three doc destinations: export formats, bulk operations, and export failures.
              </desc>

              {/* Source query box */}
              <rect
                x={SRC_X}
                y={SRC_Y}
                width={SRC_W}
                height={SRC_H}
                rx="8"
                fill={C.yellow}
                fillOpacity="0.18"
                stroke={C.yellow}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={SRC_X + SRC_W / 2}
                y={SRC_Y + SRC_H / 2 - 4}
                fill="#ffe082"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>
              <text x={SRC_X + SRC_W / 2} y={SRC_Y + SRC_H / 2 + 14} fill="#ffe082" fontSize="13" textAnchor="middle">
                &quot;How do I export?&quot;
              </text>

              {/* Three branches */}
              {AMBIGUITY_BRANCHES.map((branch, i) => {
                const destCenterY = destYs[i] + DEST_H / 2;
                const srcRightX = SRC_X + SRC_W;
                const srcCenterY = SRC_Y + SRC_H / 2;
                return (
                  <g key={branch.intent}>
                    {/* Connector */}
                    <path
                      d={`M ${srcRightX} ${srcCenterY} C ${(srcRightX + DEST_X) / 2} ${srcCenterY}, ${(srcRightX + DEST_X) / 2} ${destCenterY}, ${DEST_X} ${destCenterY}`}
                      fill="none"
                      stroke={branch.color}
                      strokeOpacity="0.65"
                      strokeWidth="1.6"
                    />
                    {/* Destination box */}
                    <rect
                      x={DEST_X}
                      y={destYs[i]}
                      width={DEST_W}
                      height={DEST_H}
                      rx="8"
                      fill={branch.color}
                      fillOpacity="0.18"
                      stroke={branch.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    <text
                      x={DEST_X + DEST_W / 2}
                      y={destYs[i] + DEST_H / 2 - 4}
                      fill={branch.accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {branch.intent}
                    </text>
                    <text
                      x={DEST_X + DEST_W / 2}
                      y={destYs[i] + DEST_H / 2 + 14}
                      fill={branch.accent}
                      fontSize="11"
                      textAnchor="middle"
                    >
                      -&gt; {branch.doc}
                    </text>
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
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffe082" center size={14}>
              A naive retriever picks one and misses the other two. Multi-query (12.20) generates paraphrases that cover
              each branch, and routing (12.21) sends each branch to the index that fits best.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Failure 3: multi-intent */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Multi-Intent: One Query Asks Two Or More Questions
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The user packs two asks into one sentence. The retriever embeds the whole thing and lands on docs that cover
            one ask, missing the other entirely.
          </T>

          {/* Source query */}
          <div
            style={{
              marginTop: 14,
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
            <T color="#a5d6a7" center size={16} style={{ marginTop: 6 }}>
              &quot;Cancel my subscription and get a refund&quot;
            </T>
          </div>

          {/* Two sub-intent cards */}
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MULTI_INTENT_SUBS.map((s, i) => (
              <div
                key={s.intent}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.accent} bold center size={13}>
                  Sub-Intent {i + 1}
                </T>
                <T color={s.accent} center size={14} style={{ marginTop: 6 }}>
                  {s.intent}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  -&gt; {s.doc}
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
              Naive retrieval finds docs for one intent and misses the other. Decomposition (12.21) splits the query
              into two sub-queries, retrieves for each, then combines the results.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Four strategies preview */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Four Strategies Map To Three Failures
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Each transformation tackles a different failure shape. The next three chapters (12.19, 12.20, 12.21) unpack
            them one by one.
          </T>

          {/* 2x2 strategy grid */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {TRANSFORM_STRATEGIES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.accent} bold center size={14}>
                  {s.name}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  {s.fixes}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  {s.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color="#90caf9" center size={14}>
              Picking the right transformation is itself a routing decision. In production, a small classifier or LLM
              call inspects the query and chooses which strategy (or combination) to run.
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
