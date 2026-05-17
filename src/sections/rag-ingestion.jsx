import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

const SOURCE_FORMATS = [
  {
    name: "PDFs",
    desc: "Manuals, contracts, research papers.",
    tool: "PyMuPDF / Unstructured / Docling",
  },
  {
    name: "HTML",
    desc: "Web pages, wikis, public docs.",
    tool: "Readability / Trafilatura",
  },
  {
    name: "DOCX / PPTX",
    desc: "Internal docs, slide decks.",
    tool: "python-docx / Unstructured",
  },
  {
    name: "Markdown",
    desc: "Engineering docs, READMEs, knowledge bases.",
    tool: "Native parsers (mistletoe, marko)",
  },
  {
    name: "Structured APIs",
    desc: "Confluence, Notion, Salesforce, Zendesk, Jira.",
    tool: "Vendor SDK or REST connector",
  },
];

const PDF_FAILURE_ROWS = [
  {
    title: "Two-Column PDF Layout",
    before:
      '"...gravitational lensing distorts || ...the Higgs boson decays into ... light from a quasar across two W bosons..."',
    after: '"Gravitational lensing distorts light from a quasar across galaxy clusters."',
    fix: "Layout-aware parser (Unstructured, Docling) reads columns in reading order.",
  },
  {
    title: "Tables Flattened To Prose",
    before: '"Q1, Q2, Q3, Revenue, 100, 110, 105, Costs, 80, 75, 78"',
    after:
      "Structured rows: { Q1: { Revenue: 100, Costs: 80 }, Q2: { Revenue: 110, Costs: 75 }, Q3: { Revenue: 105, Costs: 78 } }",
    fix: "Table-extracting parser (LlamaParse, Unstructured.partition_table) keeps row/column relationships.",
  },
  {
    title: "Scanned PDF / OCR Errors",
    before: '"Pgssword resel: cIick the link. Arnount due: $14O.00"',
    after: '"Password reset: click the link. Amount due: $140.00"',
    fix: "Modern OCR (Tesseract 5, AWS Textract, Azure Document Intelligence) fixes rn-to-m, l-to-1, O-to-0 confusions.",
  },
];

const HTML_BAD_CHUNK =
  '"Home Products Pricing Subscribe to our newsletter | How do I reset my password? Click the link in your email... © 2026 Acme Inc."';
const HTML_GOOD_CHUNK =
  '"How do I reset my password? Click the link in your email within 24 hours to set a new password..."';

const METADATA_LINES = [
  { type: "open", text: "{" },
  { type: "kv", key: '"source_url"', value: '"https://docs.example.com/account/password-reset",' },
  { type: "kv", key: '"title"', value: '"Reset Your Password",' },
  { type: "kv", key: '"doc_type"', value: '"kb_article",' },
  { type: "kv", key: '"section_path"', value: '"Account > Security > Password",' },
  { type: "kv", key: '"updated_at"', value: '"2026-04-12T14:22:00Z",' },
  { type: "kv", key: '"author"', value: '"support-team",' },
  { type: "kv", key: '"permissions"', value: '["public", "logged-in"],' },
  { type: "kv", key: '"language"', value: '"en",' },
  { type: "kv", key: '"version"', value: '"v3.1"' },
  { type: "close", text: "}" },
];

const METADATA_HIGHLIGHTED = new Set(['"source_url"', '"updated_at"', '"permissions"']);

const METADATA_USE_CASES = [
  {
    label: "Filtering",
    body: "Section 11.20 filtering uses fields like updated_at > 2026-01-01 to exclude stale docs at query time.",
  },
  {
    label: "Citations",
    body: "Chapter 12.24 uses the source_url so the LLM can cite where the answer came from.",
  },
  {
    label: "Permission Gating",
    body: "Never retrieve docs whose permissions (ACL list) don't include the current user's role.",
  },
  {
    label: "Multilingual Routing",
    body: "Detect language at ingest time, route to per-language indexes for higher recall.",
  },
];

const PARSING_FAILURE_TABLE = [
  {
    mode: "Two-Column PDF Layout",
    symptom: "Sentences jumbled across columns.",
    fix: "Layout-aware parser (Unstructured, Docling).",
  },
  {
    mode: "Tables Flattened To Prose",
    symptom: "Lost row/column structure.",
    fix: "Table-extracting parser (LlamaParse, Unstructured.partition_table).",
  },
  {
    mode: "Scanned PDF / OCR Errors",
    symptom: "Garbled tokens (rn becomes m, missing diacritics).",
    fix: "Modern OCR (Tesseract 5, AWS Textract).",
  },
  {
    mode: "HTML Boilerplate Not Stripped",
    symptom: "Chunks polluted with nav, ads, footers.",
    fix: "Readability / Trafilatura main-content extraction.",
  },
  {
    mode: "Missing Or Sparse Metadata",
    symptom: "No filtering, citations, or permission gating possible.",
    fix: "Mandatory metadata schema at ingest.",
  },
];

export const ParsingExtraction = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Bad Parsing Is Unrecoverable - The Garbage-In Problem
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The cleanest chunker, the strongest reranker, and the smartest LLM cannot recover what the parser already
            corrupted. If the text coming out of your parser is garbage, the recall is gone before chunking even starts.
          </T>
          <T color={C.red} bold center size={16} style={{ marginTop: 14 }}>
            Worked Example: A Scanned Password-Reset PDF
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Step 1: Scanned PDF (Image)
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Password reset: click the link in your email within 24 hours."
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 6 }}>
                Source page is a low-resolution scan, not selectable text.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Step 2: Naive OCR Output
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                "Pgssword resel: cIick the Iink in your ernail within 24 hours."
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 6 }}>
                Broken text: rn becomes m, l becomes I, vowels swap. Tokens no longer match.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Step 3: Embedding Lookup
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                Query: "How do I reset my password?"
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 6 }}>
                Embedding misses the broken "Pgssword" tokens. Cosine similarity drops below threshold. Doc is never
                retrieved.
              </T>
            </div>
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
              No chunker, reranker, or LLM fixes this. The recall is gone before chunking starts.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Production RAG Ingests From 5+ Format Families
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Before any chunking, embedding, or indexing, raw sources must be turned into clean text plus metadata. Every
            production RAG handles five or more format families, each with its own parser and its own failure modes.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {SOURCE_FORMATS.map((f) => (
              <div
                key={f.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {f.name}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  {f.desc}
                </T>
                <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 8, fontStyle: "italic" }}>
                  Tool: {f.tool}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" center size={15} style={{ marginTop: 14 }}>
            One parser per family is the minimum. A single shared "pdf2text" connector across all formats is the most
            common silent killer of RAG recall in production.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            PDF: Three Failure Modes That Silently Wreck Recall
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            PDFs are the format where parsers go to die. The same file looks fine to a human and turns into nonsense
            when read naively. Here are the three failures every production RAG must handle.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {PDF_FAILURE_ROWS.map((row) => (
              <div
                key={row.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} bold center size={16}>
                  {row.title}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}06`,
                      border: `1px solid ${C.red}12`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.red} bold center size={13}>
                      Naive Parser Output
                    </T>
                    <T color="#ef9a9a" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                      {row.before}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}06`,
                      border: `1px solid ${C.green}12`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.green} bold center size={13}>
                      Layout-Aware Output
                    </T>
                    <T color="#a5d6a7" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                      {row.after}
                    </T>
                  </div>
                </div>
                <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
                  Fix: {row.fix}
                </T>
              </div>
            ))}
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
              Tool choice matters. Production RAG uses layout-aware + table-aware + OCR-aware parsers, not pdf2text.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            HTML: Strip The Boilerplate Or Dilute Your Chunks
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Every HTML web page wraps its main content in nav bars, sidebars, ads, cookie banners, and footers. If your
            parser ingests the whole DOM, every chunk gets polluted with boilerplate the user did not ask about.
          </T>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Web Page Zone Map
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <svg viewBox="0 0 520 300" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Stylized web page mockup with four labeled zones. A top nav bar tinted red is labeled DROP, a left
                sidebar tinted red is labeled DROP, a central main article zone tinted green is labeled KEEP, and a
                bottom footer tinted red is labeled DROP. Together they show which DOM regions a boilerplate-stripping
                parser keeps versus discards.
              </desc>
              {/* Outer page border */}
              <rect
                x="20"
                y="20"
                width="480"
                height="260"
                rx="6"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {/* Top nav bar (DROP) */}
              <rect x="20" y="20" width="480" height="34" rx="4" fill={`${C.red}20`} stroke={C.red} strokeWidth="1.2" />
              <text x="260" y="42" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Top Nav Bar - DROP
              </text>
              {/* Left sidebar (DROP) */}
              <rect
                x="20"
                y="58"
                width="120"
                height="180"
                rx="4"
                fill={`${C.red}20`}
                stroke={C.red}
                strokeWidth="1.2"
              />
              <text x="80" y="142" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Sidebar Ads
              </text>
              <text x="80" y="160" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                DROP
              </text>
              {/* Main content (KEEP) */}
              <rect
                x="144"
                y="58"
                width="356"
                height="180"
                rx="4"
                fill={`${C.green}20`}
                stroke={C.green}
                strokeWidth="1.5"
              />
              <text x="322" y="140" textAnchor="middle" fill={C.green} fontSize="15" fontWeight="bold">
                Main Article Content
              </text>
              <text x="322" y="162" textAnchor="middle" fill={C.green} fontSize="13" fontWeight="bold">
                KEEP
              </text>
              {/* Footer (DROP) */}
              <rect
                x="20"
                y="242"
                width="480"
                height="38"
                rx="4"
                fill={`${C.red}20`}
                stroke={C.red}
                strokeWidth="1.2"
              />
              <text x="260" y="266" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Footer + Newsletter Signup - DROP
              </text>
            </svg>
          </div>
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
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Bad Chunk (No Boilerplate Strip)
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                {HTML_BAD_CHUNK}
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 6 }}>
                Retrieval matches "Subscribe" instead of the real answer. The chunk is diluted with junk.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Good Chunk (Readability Extract)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                {HTML_GOOD_CHUNK}
              </T>
              <T color="#a5d6a7" center size={12} style={{ marginTop: 6 }}>
                Only the main content survives. The embedding now matches the user's intent cleanly.
              </T>
            </div>
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
              Tools: Readability, Trafilatura, BoilerNet. They detect main-content zones via DOM heuristics and ML.
              Without them, retrieval matches the boilerplate (nav, sidebar, footer) and pollutes every chunk.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Metadata Extraction: The Required Sidecar
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Parsing is not just text. Every chunk also needs a structured sidecar of metadata: where the doc came from,
            when it was updated, who is allowed to see it, what language it is in. Skip this and you lose filtering,
            citations, and permission boundaries for the whole index.
          </T>
          <T color={C.yellow} bold center size={16} style={{ marginTop: 14 }}>
            Metadata Schema
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#ffe082",
            }}
          >
            {METADATA_LINES.map((line, i) => {
              if (line.type !== "kv") {
                return (
                  <div key={i} style={{ textAlign: "left", paddingLeft: 12 }}>
                    {line.text}
                  </div>
                );
              }
              const isHighlighted = METADATA_HIGHLIGHTED.has(line.key);
              return (
                <div key={i} style={{ textAlign: "left", paddingLeft: 28 }}>
                  <span style={{ color: isHighlighted ? C.cyan : "#ffe082", fontWeight: isHighlighted ? 700 : 400 }}>
                    {line.key}
                  </span>
                  <span style={{ color: "#ffe082" }}>: {line.value}</span>
                </div>
              );
            })}
          </div>
          <T color="#ffe082" center size={14} style={{ marginTop: 8, fontStyle: "italic" }}>
            Highlighted fields (source_url, updated_at, permissions) are the three that production RAG cannot skip.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {METADATA_USE_CASES.map((uc) => (
              <div
                key={uc.label}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={15}>
                  {uc.label}
                </T>
                <T color="#ffe082" center size={14} style={{ marginTop: 4 }}>
                  {uc.body}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}10`,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={15}>
              Metadata is parsed at ingest, attached to every chunk vector, and queried at retrieval time. Skip it
              equals no filtering, no citations, no permission boundaries.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Five Parsing Failures Every Production RAG Must Handle
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Five named failure modes turn clean source documents into garbage text. This is the checklist every team
            owns before they touch chunking, embedding, or retrieval. Skip one row and you have a silent recall killer.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.4fr 1.6fr",
                gap: 10,
                padding: "8px 10px",
                borderBottom: `1px solid ${C.green}25`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Failure Mode
              </T>
              <T color={C.green} bold center size={14}>
                Symptom
              </T>
              <T color={C.green} bold center size={14}>
                Fix
              </T>
            </div>
            {PARSING_FAILURE_TABLE.map((row, i) => (
              <div
                key={row.mode}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.4fr 1.6fr",
                  gap: 10,
                  padding: "10px 10px",
                  borderBottom: i === PARSING_FAILURE_TABLE.length - 1 ? "none" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <T color="#a5d6a7" bold center size={14}>
                  {row.mode}
                </T>
                <T color="#a5d6a7" center size={14}>
                  {row.symptom}
                </T>
                <T color="#a5d6a7" center size={14}>
                  {row.fix}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.green}10`,
              border: `1px solid ${C.green}25`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={17}>
              Every production RAG has this checklist. Skip one row equals a silent recall killer. Bad parsing is the
              gap a reranker cannot fix.
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
};

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

export const DeduplicationCleaning = (ctx) => {
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
};

const REINDEX_DECISION_USE = [
  "Corpus is small (<10K docs).",
  "Changes are infrequent (weekly batch updates).",
  "Simplicity beats freshness.",
];

const REINDEX_DECISION_AVOID = ["Real-time updates needed.", "Corpus large enough for re-embed to dominate budget."];

const WEBHOOK_TIMELINE = [
  {
    t: "T=0:00",
    label: "User Edits Doc",
    body: 'Support author updates "Reset Your Password" article in Confluence to add the MFA-preservation note.',
  },
  {
    t: "T=0:01",
    label: "Webhook Fires",
    body: 'Confluence POSTs {event: "page.updated", page_id: "doc-1", revision: 42} to the ingestion service.',
  },
  {
    t: "T=0:02",
    label: "Fetch Latest",
    body: "Ingestion service calls Confluence API to pull doc-1 revision 42 in full.",
  },
  {
    t: "T=0:05",
    label: "Re-Parse + Re-Chunk + Re-Embed",
    body: "Parser, chunker, and embedder run end-to-end. 3 chunks produced in ~150ms.",
  },
  {
    t: "T=0:08",
    label: "Upsert In Vector DB",
    body: "Same doc_id, new chunks. Old chunks dropped, new chunks inserted (Section 11.21 deletes-updates pattern).",
  },
  {
    t: "T=0:10",
    label: "Queryable",
    body: "Fresh chunks ready for retrieval. End-to-end propagation lag: ~10 seconds.",
  },
];

const POLL_BATCH = [
  {
    field: "last_synced_at",
    value: "2026-05-10T14:00:00Z",
    note: "Service tracks per-source watermark.",
  },
  {
    field: "interval",
    value: "Every 15 minutes",
    note: "Tune to your freshness budget. Throttle to source's rate limits.",
  },
  {
    field: "query",
    value: "WHERE updated_at > 2026-05-10T14:00:00Z LIMIT 1000",
    note: "REST or SQL filter that the source API exposes.",
  },
  {
    field: "result",
    value: "7 changed docs since last poll",
    note: "Process them, then advance last_synced_at to max(updated_at) in batch.",
  },
];

const VERSIONING_ROWS = [
  {
    color: "#a5d6a7",
    accent: C.green,
    label: "Row 1 - t=0",
    state: "doc-1 v1 Indexed",
    chunks: "[c1_v1, c2_v1, c3_v1]",
    status: "status=active",
    note: "Queries hit v1 chunks. Source-of-truth and index agree.",
  },
  {
    color: "#ffe082",
    accent: C.yellow,
    label: "Row 2 - t=+1min",
    state: "v2 Ingested, v1 Deprecated",
    chunks: "[c1_v2, c2_v2, c3_v2] active + [c1_v1, c2_v1, c3_v1] deprecated",
    status: "status=active OR status=deprecated",
    note: "Both versions live during re-embed window. No retrieval gap.",
  },
  {
    color: "#80deea",
    accent: C.cyan,
    label: "Row 3 - t=+15min",
    state: "v1 Dropped After Grace Period",
    chunks: "[c1_v2, c2_v2, c3_v2]",
    status: "status=active",
    note: "Only v2 active. Old chunks tombstoned and removed.",
  },
];

export const RefreshSync = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Stale RAG Hallucinates With Confidence
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Docs change. The index does not. When the source is updated but the chunks in the vector DB still reflect
            the old version, RAG retrieves stale content and the LLM answers with confidence. The user sees a fluent,
            wrong answer. There is no automatic stale signal - the only way to know is to compare against the live
            source, which RAG never does at query time.
          </T>
          <T color={C.red} bold center size={16} style={{ marginTop: 14 }}>
            Three-Time-Marker Timeline
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <svg viewBox="0 0 520 320" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Timeline showing a password-reset article v1 published on 2026-04-12, edited to v2 on 2026-05-01 adding
                an MFA-preservation note, and a stale-index v1 chunk being retrieved on 2026-05-10 causing the LLM to
                give the wrong answer because the index never re-ingested v2.
              </desc>
              {/* Main timeline axis */}
              <line x1={40} y1={150} x2={480} y2={150} stroke="rgba(255,255,255,0.4)" strokeWidth={1.6} />
              <polygon points="476,146 484,150 476,154" fill="rgba(255,255,255,0.4)" />
              {/* Three time markers at 100, 260, 420 (symmetric around viewBox center 260) */}
              {[
                { x: 100, label: "2026-04-12", title: "v1 Published", color: C.green },
                { x: 260, label: "2026-05-01", title: "v2 Edited (Adds MFA)", color: C.green },
                { x: 420, label: "2026-05-10", title: "Stale Query Hits v1", color: C.red },
              ].map((m, i) => (
                <g key={i}>
                  <line x1={m.x} y1={144} x2={m.x} y2={156} stroke={m.color} strokeWidth={1.8} />
                  <circle cx={m.x} cy={150} r={6} fill={m.color} stroke="#08080d" strokeWidth={1.4} />
                  <text x={m.x} y={134} textAnchor="middle" fill={m.color} fontSize={12} fontWeight="bold">
                    {m.label}
                  </text>
                  <text x={m.x} y={172} textAnchor="middle" fill={m.color} fontSize={12} fontWeight="bold">
                    {m.title}
                  </text>
                </g>
              ))}
              {/* Source-of-truth band (top): v1 and v2 boxes width 210, gap 20 */}
              <text x={260} y={32} textAnchor="middle" fill={C.green} fontSize={13} fontWeight="bold">
                Source Of Truth (Confluence)
              </text>
              <rect
                x={40}
                y={42}
                width={210}
                height={36}
                rx={6}
                fill={`${C.green}18`}
                stroke={C.green}
                strokeWidth={1.2}
              />
              <text x={145} y={58} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="bold">
                v1 - No MFA Mention
              </text>
              <text x={145} y={72} textAnchor="middle" fill="#a5d6a7" fontSize={11}>
                Active 2026-04-12 → 2026-05-01
              </text>
              <rect
                x={270}
                y={42}
                width={210}
                height={36}
                rx={6}
                fill={`${C.green}28`}
                stroke={C.green}
                strokeWidth={1.4}
              />
              <text x={375} y={58} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="bold">
                v2 - MFA Setup Note Added
              </text>
              <text x={375} y={72} textAnchor="middle" fill="#a5d6a7" fontSize={11}>
                Active 2026-05-01 →
              </text>
              {/* Index band (bottom): single wide rect with 3 stacked text lines */}
              <text x={260} y={204} textAnchor="middle" fill={C.red} fontSize={13} fontWeight="bold">
                Vector Index (Never Re-Ingested)
              </text>
              <rect
                x={40}
                y={214}
                width={440}
                height={60}
                rx={6}
                fill={`${C.red}25`}
                stroke={C.red}
                strokeWidth={1.4}
              />
              <text x={260} y={232} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="bold">
                Only v1 Chunks Indexed - Stale From 2026-05-01
              </text>
              <text x={260} y={250} textAnchor="middle" fill="#ef9a9a" fontSize={11}>
                Query: "Do I Lose My MFA After Password Reset?"
              </text>
              <text x={260} y={266} textAnchor="middle" fill="#ef9a9a" fontSize={11}>
                Returns v1 Chunk → LLM Says "MFA May Need Re-Setup" (Wrong)
              </text>
              {/* Result line */}
              <text x={260} y={300} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="bold">
                Hallucinated Answer Looks Confident - No Stale Signal.
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
              Every doc has an expiry date. Stale answers feel correct because the LLM is confident. There is no
              automatic stale signal - retrieval and generation both proceed as if the index were fresh.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Strategy 1: Full Re-Index On A Schedule
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The simplest sync strategy is the heavy hammer. Every night, rebuild the entire index from scratch. No
            change detection, no event plumbing - just a cron job that re-ingests everything. It works, it scales down,
            and it is the most common starting point for in-house RAG.
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
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Mechanism
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Nightly cron at 2 AM fires. The job fetches all 10,000 docs from the source, re-parses, re-chunks, and
                re-embeds them. Output is written into a SHADOW index (parallel collection). At 6 AM, an atomic pointer
                swap promotes shadow to primary. Retrieval traffic flips instantly with zero gap.
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Without the shadow-index pattern, retrieval is degraded for the full 4-hour rebuild window. The shadow
                pattern is the difference between a clean swap and a service incident.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Cost Math
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}10`,
                  border: `1px solid ${C.cyan}25`,
                  textAlign: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  color: "#80deea",
                }}
              >
                10K docs x 1K tokens/doc x $0.10/1M tokens = $1/night
              </div>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Roughly $30 per month for a 10K-doc corpus. Trivial.
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}25`,
                  textAlign: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  color: "#ef9a9a",
                }}
              >
                At 1M docs: $3,000/month just for re-embedding
              </div>
              <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                Re-embedding dominates the budget once the corpus crosses 100K docs. Above that, full re-index is the
                wrong default.
              </T>
            </div>
          </div>
          <T color={C.cyan} bold center size={16} style={{ marginTop: 14 }}>
            Decision Card
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}25`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={15}>
              Use Full Re-Index If
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {REINDEX_DECISION_USE.map((line) => (
                <T color="#80deea" center size={14} key={line}>
                  {line}
                </T>
              ))}
            </div>
            <T color={C.cyan} bold center size={15} style={{ marginTop: 14 }}>
              Avoid If
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {REINDEX_DECISION_AVOID.map((line) => (
                <T color="#80deea" center size={14} key={line}>
                  {line}
                </T>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Strategy 2: Webhook-Driven Incremental Sync
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            When the source supports webhooks (Confluence, Notion, GitHub, Slack), the index can stay fresh in seconds
            instead of overnight. Each edit fires an event; the ingestion service handles only the docs that actually
            changed. No wasted re-embedding on the 99.99% of docs that did not change.
          </T>
          <T color={C.purple} bold center size={16} style={{ marginTop: 14 }}>
            Sequence Diagram - 10-Second Propagation
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
            <svg viewBox="0 0 520 360" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Webhook-driven incremental sync sequence diagram with time markers T=0:00 through T=0:10 showing user
                edit, Confluence webhook fire, ingestion service fetch, re-parse and re-chunk and re-embed, upsert into
                vector DB referencing Section 11.21 deletes-updates, and final queryable state with about ten-second
                propagation lag.
              </desc>
              {/* Vertical timeline */}
              <line x1={260} y1={20} x2={260} y2={340} stroke="rgba(255,255,255,0.25)" strokeWidth={1.4} />
              {WEBHOOK_TIMELINE.map((step, i) => {
                const y = 30 + i * 54;
                return (
                  <g key={step.t}>
                    <circle cx={260} cy={y + 18} r={6} fill={C.purple} stroke="#08080d" strokeWidth={1.4} />
                    <rect
                      x={40}
                      y={y}
                      width={170}
                      height={42}
                      rx={6}
                      fill={`${C.purple}20`}
                      stroke={C.purple}
                      strokeWidth={1.2}
                    />
                    <text x={125} y={y + 18} textAnchor="middle" fill={C.purple} fontSize={12} fontWeight="bold">
                      {step.t}
                    </text>
                    <text x={125} y={y + 34} textAnchor="middle" fill="#b8a9ff" fontSize={11} fontWeight="bold">
                      {step.label}
                    </text>
                    <rect
                      x={310}
                      y={y}
                      width={170}
                      height={42}
                      rx={6}
                      fill={`${C.purple}10`}
                      stroke={`${C.purple}40`}
                      strokeWidth={1}
                    />
                    <foreignObject x={314} y={y + 2} width={162} height={38}>
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          fontFamily: "ui-sans-serif, system-ui, sans-serif",
                          fontSize: 10,
                          color: "#b8a9ff",
                          textAlign: "center",
                          lineHeight: 1.3,
                          padding: "2px 4px",
                        }}
                      >
                        {step.body}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>
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
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Pros
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Real-time freshness (~10 seconds). No wasted re-embedding on unchanged docs. Upsert pattern lines up
                with Section 11.21 deletes-and-updates so the vector DB stays consistent. Linear cost scales with edit
                volume, not corpus size.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Cons
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                Requires webhook support in the source (Confluence yes, raw S3 no). Webhook failures need retry / DLQ
                handling. Upserts must be idempotent to avoid duplicate writes on retries. Out-of-order events need
                revision-number guards.
              </T>
            </div>
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
              Webhook incremental sync is the default for SaaS sources with event hooks. Build idempotent upserts and a
              retry queue from day one.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Strategy 3: Polling - The Fallback For Webhook-Less Sources
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Many sources (REST APIs without event hooks, SQL databases, internal services) cannot push events. The
            ingestion service must pull. The pattern is simple: track a per-source watermark, ask the source on a timer
            what has changed since the watermark, advance the watermark, repeat.
          </T>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Polling Pipeline (Worked Example)
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {POLL_BATCH.map((row) => (
              <div
                key={row.field}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}12`,
                  display: "grid",
                  gridTemplateColumns: "0.6fr 1.4fr 1.4fr",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={14}>
                  {row.field}
                </T>
                <T
                  color="#ffcc80"
                  center
                  size={14}
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {row.value}
                </T>
                <T color="#ffcc80" center size={13}>
                  {row.note}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Freshness Lag (Edge Case)
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              doc-12 is edited at t=2 min (just after a poll fires at t=0). The change is picked up at t=15 min (next
              poll). Freshness lag = 13 minutes on average for that doc, 15 minutes worst case across the corpus.
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 8 }}>
              Tighter interval = lower lag, higher API cost. Looser interval = higher lag, lower API cost. Tune the poll
              interval to match your freshness budget.
            </T>
          </div>
          <T color={C.orange} bold center size={16} style={{ marginTop: 14 }}>
            Decision Card
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.orange}10`,
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              Use polling when: the source has no webhooks but exposes a queryable updated_at field (most REST APIs, SQL
              databases, internal services). Cost: API calls every interval whether or not anything changed. Throttle
              the poller to the source's rate limits. Lag is bounded by the poll interval.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Delete Propagation And Versioning: Where 90% Of In-House RAG Breaks
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Sync is not just "add new docs." The hard parts are propagating deletes (when the source removes a doc) and
            versioning chunks (so retrieval never sees a gap during a re-embed). Both are silent failures - eval sets
            catch them when chunks reference ghost content or queries miss during a swap, but customers do not see a
            stack trace. They just get the wrong answer.
          </T>
          <T color={C.yellow} bold center size={16} style={{ marginTop: 14 }}>
            Three-Row Versioning Timeline
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <svg viewBox="0 0 520 340" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Three-row versioning timeline showing doc-1 v1 chunks active at t=0, both v1 deprecated and v2 active
                during the t=+1min re-embed window so retrieval has no gap, and only v2 active at t=+15min after the
                grace period drops the v1 chunks.
              </desc>
              {/* Three row bands - rect frame plus foreignObject for centered HTML */}
              {VERSIONING_ROWS.map((row, i) => {
                const y = 20 + i * 108;
                return (
                  <g key={row.label}>
                    <rect
                      x={20}
                      y={y}
                      width={480}
                      height={96}
                      rx={8}
                      fill={`${row.accent}18`}
                      stroke={row.accent}
                      strokeWidth={1.4}
                    />
                    <foreignObject x={20} y={y} width={480} height={96}>
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          boxSizing: "border-box",
                          width: "100%",
                          height: "100%",
                          padding: "8px 14px",
                          textAlign: "center",
                          color: row.color,
                          fontFamily: "ui-sans-serif, system-ui, sans-serif",
                          lineHeight: 1.3,
                        }}
                      >
                        <div style={{ color: row.accent, fontSize: 13, fontWeight: 700 }}>{row.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{row.state}</div>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            marginTop: 4,
                          }}
                        >
                          Chunks: {row.chunks}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            marginTop: 2,
                          }}
                        >
                          {row.status}
                        </div>
                        <div style={{ fontSize: 11, fontStyle: "italic", marginTop: 4, opacity: 0.9 }}>{row.note}</div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>
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
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Delete Propagation
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Source removes doc-1. Webhook fires event: "page.deleted". Ingestion service writes a tombstone in the
                vector DB. Tombstone propagates to all replicas. All chunks for doc-1 are removed. Section 11.21 covers
                the multi-replica deletes-and-updates pattern in depth.
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Without delete propagation: deleted docs are still served. They become ghost chunks - retrievable, but
                pointing to content that no longer exists in the source.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Versioning + Grace Period
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                New chunks land as status=active. Old chunks flip to status=deprecated. Both are queryable during the
                grace period (typically 5-15 minutes). After the grace period, deprecated chunks are dropped.
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                Without versioning: old chunks are dropped before new ones land. Retrieval gap. Queries during the
                re-embed window return empty results or stale results from other docs.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Silent Failures
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
              Without delete propagation: ghost chunks served as fact. Without versioning: retrieval gap during the
              re-embed window. Both are invisible to the user - eval catches them, customers do not.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}10`,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Build delete propagation + versioning from day one. Retro-fitting them after launch costs 10x the dev
              time, because every downstream component (retrieval, eval, monitoring) already assumes chunks are
              immutable.
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
};
