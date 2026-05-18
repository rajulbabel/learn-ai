import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
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
    body: "Section 11.21 filtering uses fields like updated_at > 2026-01-01 to exclude stale docs at query time.",
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

export default function ParsingExtraction(ctx) {
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
}
