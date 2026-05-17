import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const DUPLICATE_SOURCES = [
  { name: "Zendesk", subtitle: "Help center article #4821", body: "Reset Your Password" },
  { name: "Confluence", subtitle: "IT runbook page", body: "Reset Your Password" },
  { name: "Notion", subtitle: "Onboarding doc section", body: "Reset Your Password" },
];

const EXACT_HASH_DOCS = [
  { source: "Zendesk", hash: "a3f2b9...", verdict: "Kept (first)" },
  { source: "Confluence", hash: "a3f2b9...", verdict: "Dropped" },
  { source: "Notion", hash: "a3f2b9...", verdict: "Dropped" },
];

const COSINE_BANDS = [
  {
    range: "Cosine >= 0.97",
    action: "Definite duplicate. Drop one, keep the other.",
    color: "#a5d6a7",
    accent: "#00e676",
  },
  {
    range: "0.90 <= Cosine < 0.97",
    action: "Near-duplicate. Send to human review queue.",
    color: "#ffe082",
    accent: "#ffd740",
  },
  {
    range: "0.85 <= Cosine < 0.90",
    action: "Topically similar. Keep both.",
    color: "#80deea",
    accent: "#00b8d4",
  },
  {
    range: "Cosine < 0.85",
    action: "Distinct documents. Keep all.",
    color: "rgba(255,255,255,0.7)",
    accent: "rgba(255,255,255,0.3)",
  },
];

const CLEANING_STEPS = [
  {
    title: "Unicode Normalization (NFC)",
    desc: "Two strings that look identical can have different byte sequences.",
    before: "café (composed, 5 bytes) vs café (decomposed, 6 bytes)",
    after: "NFC pass collapses both to the same 5-byte form. Hash dedup and embedding lookup now agree.",
  },
  {
    title: "Encoding Fix-Up",
    desc: "Mojibake from latin-1 / UTF-8 mismatches breaks tokenization.",
    before: "Raw bytes rendered wrong: 'naïve résumé' shown as 'naïve résumé'.",
    after: "ftfy or chardet detects the encoding mismatch and restores 'naïve résumé'.",
  },
  {
    title: "Strip Headers, Footers, Page Numbers, Watermarks",
    desc: "Boilerplate repeated on every page bloats chunks with noise.",
    before: "Every chunk starts with: 'CONFIDENTIAL - DRAFT 2026 - Page 3 of 47'.",
    after: "Layout-aware parser strips the repeating per-page header, footer, and watermark band.",
  },
  {
    title: "PII Scrubbing",
    desc: "Emails, SSNs, phone numbers, and credit cards leak into the index unless redacted.",
    before: "Contact john@acme.com or call 555-1234 with SSN 123-45-6789.",
    after:
      "Contact [EMAIL_REDACTED] or call [PHONE_REDACTED] with SSN [SSN_REDACTED]. Tool: regex + LLM NER (Presidio).",
  },
];

export default function DeduplicationCleaning(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            The Same Article In Three Systems Eats Your Context Budget
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The same knowledge-base article often lives in Zendesk, Confluence, and Notion at the same time. Ingest all
            three blindly and the same answer is now three vectors in your index. A top-5 retrieval for "How do I reset
            my password?" returns 3 copies of the same chunk plus 2 unrelated docs - no diversity, and most of the
            context-window budget is wasted on duplicates.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <svg viewBox="0 0 520 320" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Three source systems (Zendesk, Confluence, Notion) each holding the same Reset-Your-Password article,
                flowing through a single ingestion pipeline into three nearly-identical chunks in the vector database.
                Below them, a context-window bar of 4,096 tokens shows the first 1,536 tokens consumed by three
                duplicate chunks and only 2,560 tokens left for distinct answers.
              </desc>
              {/* Three source system boxes - top row */}
              {[0, 1, 2].map((i) => {
                const x = 30 + i * 160;
                const labels = ["Zendesk", "Confluence", "Notion"];
                return (
                  <g key={`src-${i}`}>
                    <rect
                      x={x}
                      y={20}
                      width={140}
                      height={56}
                      rx={6}
                      fill={`${C.red}20`}
                      stroke={C.red}
                      strokeWidth={1.2}
                    />
                    <text x={x + 70} y={40} textAnchor="middle" fill={C.red} fontSize={13} fontWeight="bold">
                      {labels[i]}
                    </text>
                    <text x={x + 70} y={60} textAnchor="middle" fill="#ef9a9a" fontSize={11} fontStyle="italic">
                      "Reset Your Password"
                    </text>
                  </g>
                );
              })}
              {/* Arrows down from sources */}
              {[0, 1, 2].map((i) => {
                const x = 100 + i * 160;
                return (
                  <g key={`arrow-${i}`}>
                    <line x1={x} y1={76} x2={x} y2={114} stroke="rgba(255,255,255,0.4)" strokeWidth={1.4} />
                    <polygon points={`${x - 4},110 ${x + 4},110 ${x},118`} fill="rgba(255,255,255,0.4)" />
                  </g>
                );
              })}
              {/* Ingestion pipeline bar */}
              <rect
                x={30}
                y={120}
                width={460}
                height={36}
                rx={6}
                fill={`${C.yellow}20`}
                stroke={C.yellow}
                strokeWidth={1.4}
              />
              <text x={260} y={143} textAnchor="middle" fill={C.yellow} fontSize={14} fontWeight="bold">
                Ingestion Pipeline (No Dedup)
              </text>
              {/* Arrows down to chunks */}
              {[0, 1, 2].map((i) => {
                const x = 100 + i * 160;
                return (
                  <g key={`arrow2-${i}`}>
                    <line x1={x} y1={156} x2={x} y2={194} stroke="rgba(255,255,255,0.4)" strokeWidth={1.4} />
                    <polygon points={`${x - 4},190 ${x + 4},190 ${x},198`} fill="rgba(255,255,255,0.4)" />
                  </g>
                );
              })}
              {/* Three duplicate chunks */}
              {[0, 1, 2].map((i) => {
                const x = 30 + i * 160;
                return (
                  <g key={`chunk-${i}`}>
                    <rect
                      x={x}
                      y={200}
                      width={140}
                      height={50}
                      rx={6}
                      fill={`${C.red}25`}
                      stroke={C.red}
                      strokeWidth={1.4}
                    />
                    <text x={x + 70} y={222} textAnchor="middle" fill={C.red} fontSize={13} fontWeight="bold">
                      Duplicate Chunk
                    </text>
                    <text x={x + 70} y={239} textAnchor="middle" fill="#ef9a9a" fontSize={11}>
                      ~512 tokens each
                    </text>
                  </g>
                );
              })}
              {/* Context window bar label */}
              <text x={260} y={278} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={12} fontWeight="bold">
                Context Window (4,096 tokens)
              </text>
              {/* Context bar - wasted vs available */}
              <rect
                x={30}
                y={286}
                width={172}
                height={22}
                rx={4}
                fill={`${C.red}35`}
                stroke={C.red}
                strokeWidth={1.2}
              />
              <text x={116} y={302} textAnchor="middle" fill={C.red} fontSize={11} fontWeight="bold">
                1,536 Wasted On Dupes
              </text>
              <rect
                x={202}
                y={286}
                width={288}
                height={22}
                rx={4}
                fill={`${C.green}25`}
                stroke={C.green}
                strokeWidth={1.2}
              />
              <text x={346} y={302} textAnchor="middle" fill={C.green} fontSize={11} fontWeight="bold">
                2,560 Left For Distinct Answers
              </text>
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.red}10`,
              border: `1px solid ${C.red}25`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={16}>
              3 copies of the same answer equals wasted tokens, zero diversity, and the LLM has nothing distinct to
              triangulate against.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {DUPLICATE_SOURCES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={14}>
                  {s.name}
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 6 }}>
                  {s.subtitle}
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                  "{s.body}"
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Exact-Hash Dedup: Cheap And Catches The Easy 80%
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The first line of defense is a cryptographic hash. Normalize the text (strip whitespace, lowercase, remove
            punctuation), run SHA-256, then keep a hash table of every hash already seen. New doc hash matches an
            existing hash equals byte-identical content, so drop it.
          </T>
          <T color={C.cyan} bold center size={16} style={{ marginTop: 14 }}>
            Three-Step Flow
          </T>
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Step 1: Normalize
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Reset Your Password. Click The Link."
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                Becomes
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "reset your password click the link"
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Step 2: Hash (SHA-256)
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                sha256(normalized)
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                Produces hex digest
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                a3f2b9...
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Step 3: Dedup Lookup
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                Hash table check
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                Match equals drop
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                Miss equals keep + store
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}25`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 16,
              color: "#80deea",
            }}
          >
            hash = sha256(normalize(doc.content))
          </div>
          <T color={C.cyan} bold center size={16} style={{ marginTop: 14 }}>
            Worked Example: Three Sources, One Hash
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                padding: "8px 10px",
                borderBottom: `1px solid ${C.cyan}25`,
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Source
              </T>
              <T color={C.cyan} bold center size={14}>
                SHA-256 Digest
              </T>
              <T color={C.cyan} bold center size={14}>
                Verdict
              </T>
            </div>
            {EXACT_HASH_DOCS.map((row, i) => (
              <div
                key={row.source}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  padding: "10px 10px",
                  borderBottom: i === EXACT_HASH_DOCS.length - 1 ? "none" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <T color="#80deea" bold center size={14}>
                  {row.source}
                </T>
                <T
                  color="#80deea"
                  center
                  size={14}
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {row.hash}
                </T>
                <T color="#80deea" center size={14}>
                  {row.verdict}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}25`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={15}>
              Cost: O(N) hash compute + O(1) hash-table lookup. Misses: "Same article with one typo fixed" produces a
              different hash, so byte-identical only catches the easy 80%.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            MinHash + LSH: Catching Near-Duplicates
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            One typo fix, one re-worded sentence, one renamed term and the SHA-256 digest changes completely. MinHash
            estimates Jaccard set overlap between shingle sets cheaply, and locality-sensitive hashing (LSH) groups
            near-duplicates into the same bucket without an O(N^2) pairwise scan.
          </T>
          <T color={C.purple} bold center size={16} style={{ marginTop: 14 }}>
            Two Near-Duplicates That Exact Hash Misses
          </T>
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Doc A (Zendesk)
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Reset your password by clicking the link in your email within 24 hours."
              </T>
              <T color="#b8a9ff" center size={12} style={{ marginTop: 6 }}>
                SHA-256: a3f2b9...
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Doc B (Confluence)
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Reset the password by clicking the link in your email within 24 hours."
              </T>
              <T color="#b8a9ff" center size={12} style={{ marginTop: 6 }}>
                SHA-256: 9e1cd4... (different)
              </T>
            </div>
          </div>
          <T color="#b8a9ff" center size={14} style={{ marginTop: 8, fontStyle: "italic" }}>
            One word change ("your" to "the") flips the hash. Exact dedup misses. MinHash + LSH catches both.
          </T>
          <T color={C.purple} bold center size={16} style={{ marginTop: 14 }}>
            MinHash + LSH Pipeline
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <svg viewBox="0 0 520 280" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                MinHash plus LSH flow showing two near-duplicate docs being tokenized into 3-gram shingle sets,
                processed through a 128-hash MinHash signature so the Jaccard estimate lands around 0.97, and bucketed
                by LSH banding with 16 bands of 8 rows so both signatures land in the same candidate-pair bucket.
              </desc>
              {/* Step 1: Shingling */}
              <rect
                x={20}
                y={20}
                width={480}
                height={60}
                rx={6}
                fill={`${C.purple}20`}
                stroke={C.purple}
                strokeWidth={1.2}
              />
              <text x={260} y={42} textAnchor="middle" fill={C.purple} fontSize={14} fontWeight="bold">
                Step 1: 3-Gram Shingles
              </text>
              <text x={260} y={62} textAnchor="middle" fill="#b8a9ff" fontSize={12} fontStyle="italic">
                {"{reset your password, your password by, password by clicking, ...}"}
              </text>
              <text x={260} y={76} textAnchor="middle" fill="#b8a9ff" fontSize={11}>
                Doc A and Doc B share most 3-gram shingles. One differs.
              </text>
              {/* Arrow down */}
              <line x1={260} y1={84} x2={260} y2={102} stroke="rgba(255,255,255,0.4)" strokeWidth={1.4} />
              <polygon points="256,98 264,98 260,106" fill="rgba(255,255,255,0.4)" />
              {/* Step 2: MinHash signature */}
              <rect
                x={20}
                y={110}
                width={480}
                height={60}
                rx={6}
                fill={`${C.purple}20`}
                stroke={C.purple}
                strokeWidth={1.2}
              />
              <text x={260} y={132} textAnchor="middle" fill={C.purple} fontSize={14} fontWeight="bold">
                Step 2: MinHash Signature (K = 128 Hash Functions)
              </text>
              <text x={260} y={152} textAnchor="middle" fill="#b8a9ff" fontSize={12}>
                125 of 128 positions match equals Jaccard estimate around 0.97
              </text>
              <text x={260} y={166} textAnchor="middle" fill="#b8a9ff" fontSize={11}>
                Cheap fixed-size signature replaces full shingle-set comparison.
              </text>
              {/* Arrow down */}
              <line x1={260} y1={174} x2={260} y2={192} stroke="rgba(255,255,255,0.4)" strokeWidth={1.4} />
              <polygon points="256,188 264,188 260,196" fill="rgba(255,255,255,0.4)" />
              {/* Step 3: LSH banding */}
              <rect
                x={20}
                y={200}
                width={480}
                height={60}
                rx={6}
                fill={`${C.green}20`}
                stroke={C.green}
                strokeWidth={1.2}
              />
              <text x={260} y={222} textAnchor="middle" fill={C.green} fontSize={14} fontWeight="bold">
                Step 3: LSH Banding (16 Bands x 8 Rows)
              </text>
              <text x={260} y={242} textAnchor="middle" fill="#a5d6a7" fontSize={12}>
                Doc A and Doc B hash into the SAME bucket - candidate near-duplicate pair found
              </text>
              <text x={260} y={256} textAnchor="middle" fill="#a5d6a7" fontSize={11}>
                Sub-linear scan: no O(N^2) all-pairs check needed.
              </text>
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}10`,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={15}>
              MinHash + LSH equals sub-linear near-duplicate detection at scale (1B docs feasible). Jaccard threshold is
              tunable (typically 0.85). Catches typo-fixes, re-words, and copy-paste edits that exact hashing cannot.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Embedding Dedup: The Only Way To Catch Paraphrases
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Two docs can say the same thing with almost no shared words. MinHash misses these because no shingles
            overlap. Only embedding cosine catches paraphrases - the same meaning in different words.
          </T>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Paraphrase Pair MinHash Misses
          </T>
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                KB Article (Formal)
              </T>
              <T color="#ffcc80" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "To reset your password, click the password reset link delivered to your registered email address."
              </T>
              <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                Shingles: formal, dense, registered-email-address style.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Forum Post (Casual)
              </T>
              <T color="#ffcc80" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Yo if you forgot your password just hit the reset thing they sent to your email."
              </T>
              <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                Shingles: casual, almost zero overlap with the formal version.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.orange}10`,
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={16}>
              MinHash Jaccard: 0.08 (miss). Embedding cosine: 0.94 (flagged as semantic duplicate).
            </T>
          </div>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Cosine Similarity Ladder
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {COSINE_BANDS.map((band) => (
              <div
                key={band.range}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${band.accent}12`,
                  border: `1px solid ${band.accent}30`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1.6fr",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <T color={band.color} bold center size={15}>
                  {band.range}
                </T>
                <T color={band.color} center size={15}>
                  {band.action}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              Cost Reality
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 6 }}>
              Embedding a full corpus to dedup adds $0.10 per 1M tokens times corpus size. For 10M docs at 512 tokens
              each that is 5B tokens equals about $500 just to dedup. Cheaper than re-embedding twice, but a real line
              item.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}10`,
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              Use embedding dedup when the corpus has paraphrases (KB + forum posts, multi-author docs, translations).
              Skip it when content is byte-stable (PDFs from authoritative sources) and exact hashing + MinHash already
              cover the threshold.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Cleaning: The Unsexy 30% That Decides Whether Eval Stabilizes
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Dedup catches duplicates. Cleaning fixes the bytes themselves. Four steps - Unicode normalization, encoding
            fix-up, boilerplate stripping, and PII scrubbing - turn raw extracted text into something the embedder and
            tokenizer can read consistently.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {CLEANING_STEPS.map((step) => (
              <div
                key={step.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={16}>
                  {step.title}
                </T>
                <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                  {step.desc}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${C.red}06`,
                    border: `1px solid ${C.red}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    Before
                  </T>
                  <T color="#ef9a9a" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {step.before}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${C.green}06`,
                    border: `1px solid ${C.green}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold center size={13}>
                    After
                  </T>
                  <T color="#a5d6a7" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {step.after}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}10`,
              border: `1px solid ${C.green}25`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={16}>
              Cleaning is invisible when it works and catastrophic when skipped. It stabilizes eval scores by removing
              irrelevant tokens that fool similarity metrics, and it keeps PII out of the index entirely.
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
