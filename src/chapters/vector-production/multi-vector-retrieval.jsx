import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

const COLBERT_Q_TOKENS = ["Cats", "Live", "Outside"];
const COLBERT_D_TOKENS = ["Cats", "Are", "Small", "Carnivores", "That"];
const COLBERT_SIM = [
  [0.94, 0.22, 0.18, 0.35, 0.21],
  [0.11, 0.17, 0.15, 0.25, 0.28],
  [0.19, 0.14, 0.21, 0.17, 0.26],
];
const COLBERT_MAX_PER_Q = COLBERT_SIM.map((row) => Math.max(...row));

export default function MultiVectorRetrieval(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            One vector per doc blurs token-level signal
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            A single dense embedding per document is the workhorse of vector search. It is compact, fast to compare, and
            great on short text. For long documents - paragraphs, articles, chapters - the single-vector representation
            loses fidelity: every token is averaged into one 768-dim summary. Rare terms and specific phrasing get
            blurred into the bulk meaning.
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
              One paragraph, one vector, lossy averaging
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              &quot;Cats are small domesticated carnivores that originated in the fertile crescent...&quot;
              <br />
              &darr; encode &darr;
              <br />
              <span style={{ color: C.cyan }}>[0.81, 0.12, 0.45, ..., 0.22]</span> (768 dims, one per doc)
              <br />
              Every token&apos;s contribution is <span style={{ color: C.red }}>averaged</span> into that one vector
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Long doc + single vector = <span style={{ color: C.red }}>lossy compression</span>
            <br />
            Rare terms and specific phrasing blur into the average
            <br />
            Multi-vector retrieval keeps one vector per token instead
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the motivation for ColBERT and the whole multi-vector family. Keep more information, rank better,
            pay in storage.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            ColBERT idea: one vector per token
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ColBERT (Contextualized Late Interaction over BERT, Stanford 2020) keeps every token&apos;s contextual
            embedding instead of pooling to a single doc vector. A 200-token document becomes 200 vectors. Queries are
            also expanded to per-token embeddings. Scoring happens at token granularity - the &quot;late
            interaction&quot; - rather than after pooling.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              ColBERT token expansion
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Doc &quot;Cats are small domesticated carnivores ...&quot;
              <br />
              &darr; BERT-style encode, keep every token &darr;
              <br />
              <span style={{ color: C.yellow }}>~200 vectors per document</span> (one per token)
              <br />
              Query &quot;where do cats live&quot; &rarr; <span style={{ color: C.yellow }}>~5 query tokens</span>
            </div>
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
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Single-vector retrieval
              </T>
              <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 1 vector per doc</div>
                <div>&bull; Cosine similarity, scalar output</div>
                <div>&bull; Fast and compact</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Multi-vector (ColBERT)
              </T>
              <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; ~200 vectors per doc (per token)</div>
                <div>&bull; Max-sim aggregation across tokens</div>
                <div>&bull; More accurate on long text</div>
              </div>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ColBERT is still a dense-embedding model; only the pooling step is dropped. Otherwise the pipeline looks
            like any other BERT encoder.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Max-sim: for each query token, find the best matching doc token, sum
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Given Q query vectors and D doc vectors, compute pairwise cosine (or dot) similarities - a Q x D matrix. For
            each query token, take the maximum similarity across all doc tokens. Sum those maxes over the query tokens.
            This is &quot;max-sim over late interaction&quot;. It rewards a doc that matches each query token somewhere,
            even if no single doc token is a perfect match for everything.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              Max-sim formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 16,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              score(q, d) = <span style={{ color: C.green }}>&Sigma;</span>
              <sub>i &isin; query tokens</sub> max<sub>j &isin; doc tokens</sub> q<sub>i</sub> &middot; d<sub>j</sub>
              <br />
              Sum of per-query-token max similarities against all doc tokens
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Max-sim keeps the best signal per query token. A doc that matches &quot;cats&quot; perfectly but does not
            mention &quot;genetics&quot; at all scores lower than one that hits both, even if neither match is perfect.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Max-sim walkthrough on the cat corpus
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Concrete run. Query is &quot;cats live outside&quot; (3 tokens). Doc is &quot;Cats are small carnivores
            that&quot; (5 tokens). Compute the 3 x 5 similarity matrix, highlight the max in each row, sum them. The
            total is the score for this (query, doc) pair.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              3 x 5 similarity grid (query rows, doc columns)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: `0.9fr repeat(${COLBERT_D_TOKENS.length}, 1fr) 0.8fr`,
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div></div>
              {COLBERT_D_TOKENS.map((t, i) => (
                <div
                  key={`d-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.orange}08`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {t}
                </div>
              ))}
              <div
                style={{
                  padding: "6px 4px",
                  background: `${C.green}14`,
                  borderRadius: 4,
                  textAlign: "center",
                  color: C.green,
                  fontWeight: "bold",
                }}
              >
                Max
              </div>
              {COLBERT_Q_TOKENS.map((qTok, i) => (
                <div key={`row-${i}`} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "6px 8px",
                      background: `${C.orange}14`,
                      borderRadius: 4,
                      color: C.orange,
                      fontWeight: "bold",
                    }}
                  >
                    {qTok}
                  </div>
                  {COLBERT_SIM[i].map((s, j) => {
                    const isMax = s === COLBERT_MAX_PER_Q[i];
                    return (
                      <div
                        key={`c-${i}-${j}`}
                        style={{
                          padding: "6px 4px",
                          background: isMax ? `${C.green}30` : `${C.orange}06`,
                          borderRadius: 4,
                          textAlign: "center",
                          color: isMax ? C.green : C.bright,
                          fontWeight: isMax ? "bold" : "normal",
                        }}
                      >
                        {s.toFixed(2)}
                      </div>
                    );
                  })}
                  <div
                    style={{
                      padding: "6px 4px",
                      background: `${C.green}14`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: C.green,
                      fontWeight: "bold",
                    }}
                  >
                    {COLBERT_MAX_PER_Q[i].toFixed(2)}
                  </div>
                </div>
              ))}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Score = 0.94 + 0.28 + 0.26 = <span style={{ color: C.green }}>1.48</span>
            <br />
            Strong pick on &quot;cats&quot; drags the overall score up
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Notice that no doc token is perfect for &quot;live&quot; or &quot;outside&quot;, but each query token is
            still scored against its nearest neighbor. This robustness is what single-vector cosine throws away.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Storage cost: N x tokens x d bytes (20 to 100x larger)
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The tradeoff is memory. Single-vector retrieval stores one 768-dim vector per doc. Multi-vector stores one
            per token. At ~200 tokens/doc, that is 200x more vectors. Compression (PQ on the token vectors) and shorter
            vector widths reduce the overhead to 20-50x in practice, but ColBERT-style indexes are always much bigger
            than single-vector ones.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Storage at 1M docs, 200 tokens/doc, d = 768
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { label: "Single-vector (float32)", size: "3 GB", ratio: "1x baseline", color: C.green },
                { label: "ColBERT raw (float32)", size: "600 GB", ratio: "~200x larger", color: C.red },
                { label: "ColBERT compressed (PQ)", size: "~60 GB", ratio: "~20x larger", color: C.yellow },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.label}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color, textAlign: "center" }}
                  >
                    {r.size}
                  </div>
                  <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                    {r.ratio}
                  </T>
                </div>
              ))}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Multi-vector storage = <span style={{ color: C.red }}>N &middot; tokens &middot; d</span> bytes
            <br />
            Typical 20-100x the single-vector footprint
            <br />
            PQ and ColBERTv2&apos;s residual compression take it down to 20x at good quality
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Multi-vector is a great pick when retrieval quality matters more than cost. For 1B-scale workloads, expect
            to pay for extra nodes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production support: Vespa, Qdrant native multi-vector, Elasticsearch
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A few production systems handle multi-vector natively. Vespa treats each document as a tensor; Qdrant ships
            native multi-vector since 1.10; Elasticsearch supports nested dense_vector fields. Each has different
            ergonomics for ColBERT-style workloads.
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
              Multi-vector production support
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  name: "Vespa",
                  how: "Native tensor fields with max-sim as a built-in ranking expression",
                  since: "Since v7, Yahoo production",
                },
                {
                  name: "Qdrant multi-vector",
                  how: "Multi-vector collections since v1.10, per-vector payload",
                  since: "V1.10 (Jul 2024)",
                },
                {
                  name: "Elasticsearch nested",
                  how: "Nested dense_vector fields with script-score max-sim",
                  since: "8.13+",
                },
                {
                  name: "Weaviate",
                  how: "Multi-vector preview via RAG module experiments",
                  since: "Preview since 1.25",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.purple} bold size={15} center>
                    {r.name}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4 }} center>
                    {r.how}
                  </T>
                  <T color={C.dim} size={11} style={{ marginTop: 4 }} center>
                    {r.since}
                  </T>
                </div>
              ))}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Multi-vector is table stakes in most production systems now
            <br />
            Vespa and Qdrant are the common production picks
            <br />
            Pinecone and pgvector currently do not support it natively
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Worth it for RAG on long documents, search over dense technical corpora, and any case where single-vector
            retrieval has been quality-limited.
          </T>
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
