import { Box, T, Reveal } from "../components.jsx";
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
  { type: "kv", key: '"source_url"', value: '"https://docs.habuild.com/account/password-reset",' },
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
  const { sub } = ctx;

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
  const { sub } = ctx;

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
    </div>
  );
};

// Stub exports - full content added in subsequent tasks.

export const RefreshSync = (_ctx) => <></>;
