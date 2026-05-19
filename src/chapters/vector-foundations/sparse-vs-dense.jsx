import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

const DENSE_PREVIEW = [0.21, -0.08, 0.44, 0.13, -0.27, 0.55, 0.09, -0.18];
const SPARSE_PREVIEW = [
  { idx: 17, term: "I", weight: 0.41 },
  { idx: 842, term: "love", weight: 1.62 },
  { idx: 19, term: "cats", weight: 2.18 },
];

const SPLADE_PREVIEW = [
  { term: "cats", weight: 2.18, kind: "lexical" },
  { term: "feline", weight: 1.04, kind: "expanded" },
  { term: "kitten", weight: 0.81, kind: "expanded" },
  { term: "love", weight: 1.62, kind: "lexical" },
  { term: "adore", weight: 0.47, kind: "expanded" },
  { term: "purr", weight: 0.29, kind: "expanded" },
];

export default function SparseVsDense(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two vector worlds: dense and sparse
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Every retrieval system turns text into a vector, but there are two completely different families. Dense
            vectors come from neural embeddings - short, every-slot-full, packed with meaning. Sparse vectors come from
            counting words - long as your vocabulary, almost all zeros, one slot per term. Same sentence, two very
            different number representations. Both are real vectors. Both compute similarity with a dot product. They
            fail on opposite kinds of queries, which is why production search uses both.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={17}>
                Dense
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }} center>
                ~768 floats, every slot meaningful, semantic.
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                [0.21, -0.08, 0.44, ...]
              </T>
              <T color="#80e8a5" size={13} style={{ marginTop: 8 }} center>
                Comes from a transformer encoder (SBERT, OpenAI, Cohere).
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={17}>
                Sparse
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 8 }} center>
                ~30,000 dims, almost all zeros, one dim per vocab term.
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                [0, 0, ..., 2.18, 0, 0, ..., 1.62, 0, ...]
              </T>
              <T color="#ffcc99" size={13} style={{ marginTop: 8 }} center>
                Comes from term counting (BM25, TF-IDF) or learned sparse models (SPLADE).
              </T>
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Up to now everything in this section has been dense. Before we draw the ANN family tree, we need to see what
            sparse vectors look like - because BM25 and the inverted index in the next chapter belong to a different
            world.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Dense: short, every dimension non-zero, semantic
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            A dense embedding is the hidden state of a transformer encoder. For the sentence &quot;I love cats&quot;,
            SBERT outputs 768 floats - every single one is non-zero, and every one is shaped by all three words
            together. No dimension means &quot;cat&quot; or &quot;love&quot; on its own. Meaning is distributed across
            the whole vector, the same way colour is distributed across the cells of a screen.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
            }}
          >
            <T color={C.green} bold center size={15}>
              SBERT(&quot;I love cats&quot;) - first 8 of 768 dims
            </T>
            <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {DENSE_PREVIEW.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 4,
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}22`,
                    minWidth: 60,
                  }}
                >
                  <div style={{ fontSize: 11, color: C.dim }}>d{i}</div>
                  <div style={{ fontSize: 13, color: C.green, fontWeight: "bold" }}>{v.toFixed(2)}</div>
                </div>
              ))}
              <div
                style={{
                  padding: "6px 8px",
                  borderRadius: 4,
                  color: C.dim,
                  alignSelf: "center",
                }}
              >
                ... 760 more
              </div>
            </div>
            <T color="#80e8a5" size={13} style={{ marginTop: 8 }} center>
              Total non-zero entries: 768 of 768. Sparsity = 0%.
            </T>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Strength: synonyms and paraphrase
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                Query &quot;feline care&quot; lands near &quot;I love cats&quot; even though they share no words. The
                model put cat-shaped sentences in the same neighbourhood of 768-D space.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Weakness: exact terms
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                Query &quot;error code E_AUTH_4012&quot; can drift to generic auth docs. The model never saw that exact
                token in training, so it has no special dimension for it.
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Dense vectors are packed - every dimension carries some signal. That is also why you cannot read them by
            eye. The number 0.44 in slot 2 does not mean &quot;cats&quot;; it is a coordinate in a learned space.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Sparse: long, almost all zeros, one slot per vocab term
          </T>
          <T color="#ffcc99" style={{ marginTop: 8 }}>
            A sparse vector has one dimension for every word in the vocabulary - typically 30,000 to 100,000 dims for
            English. For the sentence &quot;I love cats&quot;, only three of those dimensions are non-zero - the slots
            for &quot;I&quot;, &quot;love&quot;, and &quot;cats&quot;. Every other slot is exactly zero. The non-zero
            values are weights from BM25 or TF-IDF: term frequency times inverse document frequency. Rare terms get big
            weights, common terms get small ones.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
            }}
          >
            <T color={C.orange} bold center size={15}>
              BM25 sparse vector for &quot;I love cats&quot;
            </T>
            <div style={{ marginTop: 8, fontSize: 13, color: C.dim }}>
              vocab size = 30,000 dims - showing the only 3 non-zero slots
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {SPARSE_PREVIEW.map((s) => (
                <div
                  key={s.idx}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${C.orange}10`,
                    border: `1px solid ${C.orange}22`,
                    minWidth: 90,
                  }}
                >
                  <div style={{ fontSize: 11, color: C.dim }}>dim {s.idx}</div>
                  <div style={{ fontSize: 13, color: C.orange, fontWeight: "bold" }}>{s.term}</div>
                  <div style={{ fontSize: 13, color: C.bright, fontFamily: "monospace" }}>{s.weight.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <T color="#ffcc99" size={13} style={{ marginTop: 10 }} center>
              Total non-zero entries: 3 of 30,000. Sparsity = 99.99%.
            </T>
          </div>
          <T color="#ffcc99" style={{ marginTop: 12 }}>
            Now take a longer sentence: &quot;The cat sat on the mat last week&quot;. Eight words, but &quot;the&quot;
            appears twice and is common, so its IDF is near zero. Rare terms like &quot;mat&quot; and &quot;cat&quot;
            get larger weights.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              BM25 weights for &quot;The cat sat on the mat last week&quot;
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {[
                { term: "The", weight: 0.04, color: C.dim },
                { term: "cat", weight: 2.18, color: C.green },
                { term: "sat", weight: 1.31, color: C.yellow },
                { term: "on", weight: 0.06, color: C.dim },
                { term: "mat", weight: 2.47, color: C.green },
                { term: "last", weight: 0.82, color: C.yellow },
                { term: "week", weight: 0.91, color: C.yellow },
              ].map((row) => (
                <div
                  key={row.term}
                  style={{
                    padding: "6px 4px",
                    borderRadius: 4,
                    background: "rgba(0,0,0,0.3)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: C.bright, fontWeight: "bold" }}>{row.term}</div>
                  <div style={{ color: row.color, marginTop: 4 }}>{row.weight.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <T color="#ffcc99" size={13} style={{ marginTop: 8, fontStyle: "italic" }} center>
              &quot;Cat&quot; and &quot;mat&quot; carry the search signal. &quot;The&quot; and &quot;on&quot; are almost
              ignored.
            </T>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Strength: exact tokens
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                Query &quot;E_AUTH_4012&quot; hits the doc that contains that exact string - no embedding magic can
                forget it. Product codes, function names, error IDs.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Weakness: synonyms
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                Query &quot;feline care&quot; gets zero overlap with &quot;I love cats&quot; - no shared tokens means
                dot product = 0. Sparse cannot tell that the two sentences are about the same thing.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Storage: dense array vs inverted index
          </T>
          <T color="#ffe066" style={{ marginTop: 8 }}>
            Both representations compute the same dot product, but you do not store them the same way. A dense vector is
            a flat array of float32s - one entry per dimension, every entry written down. A sparse vector would be
            insane to store as a 30,000-slot array of mostly zeros, so it lives as a list of (index, value) pairs - and
            at corpus scale, it is flipped into an inverted index: for each term, the list of docs that contain it.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Dense storage
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "left",
                  lineHeight: 1.7,
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                }}
              >
                <div>768 dims x 4 bytes (float32)</div>
                <div style={{ color: C.green, fontWeight: "bold" }}>= 3,072 bytes per vector</div>
                <div style={{ marginTop: 6, color: C.dim }}>1M docs:</div>
                <div>1,000,000 x 3,072</div>
                <div style={{ color: C.green, fontWeight: "bold" }}>= 3.07 GB total</div>
              </div>
              <T color="#80e8a5" size={13} style={{ marginTop: 8 }} center>
                Every byte is written. RAM-friendly, GPU-friendly. ANN indexes (HNSW, IVF) are built on top.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={16}>
                Sparse storage
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "left",
                  lineHeight: 1.7,
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                }}
              >
                <div>Avg doc: ~80 unique terms</div>
                <div>Each pair: 4B index + 4B value</div>
                <div style={{ color: C.orange, fontWeight: "bold" }}>= ~640 bytes per doc</div>
                <div style={{ marginTop: 6, color: C.dim }}>1M docs:</div>
                <div style={{ color: C.orange, fontWeight: "bold" }}>= ~0.64 GB total</div>
              </div>
              <T color="#ffcc99" size={13} style={{ marginTop: 8 }} center>
                ~5x smaller. Stored as an inverted index - one posting list per term.
              </T>
            </div>
          </div>
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
              The inverted index trick
            </T>
            <T color="#ffe066" size={14} style={{ marginTop: 6 }}>
              At corpus scale you never store sparse vectors as rows. You store the column view: for each term, the list
              of (doc_id, weight) pairs. A query with three terms touches three short lists, multiplies, sums. Lucene,
              Elasticsearch, and OpenSearch have done this for two decades.
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.35)",
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
                lineHeight: 1.8,
              }}
            >
              <div>
                <span style={{ color: C.orange }}>cats</span> -&gt; [(doc_1, 2.18), (doc_7, 1.95), (doc_42, 1.10), ...]
              </div>
              <div>
                <span style={{ color: C.orange }}>mat</span> -&gt; [(doc_1, 2.47), (doc_88, 1.82), ...]
              </div>
              <div>
                <span style={{ color: C.orange }}>sat</span> -&gt; [(doc_1, 1.31), (doc_19, 0.92), ...]
              </div>
            </div>
            <T color="#ffe066" size={13} style={{ marginTop: 8, fontStyle: "italic" }}>
              Query &quot;cats sat mat&quot; touches three posting lists, not 30,000 dimensions. That is why sparse
              search is fast on CPU without any neural net.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Learned sparse: SPLADE fills the zeros with related terms
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Pure BM25 has one fatal flaw - if the query says &quot;feline&quot; and the doc says &quot;cat&quot;, the
            dot product is zero. SPLADE (SParse Lexical AnD Expansion, 2021) fixes this by running the sentence through
            a transformer that outputs a sparse vector where the model itself adds semantically related terms with
            smaller weights. You get a sparse vector that lives in the inverted-index world, but it now contains
            synonyms, morphological variants, and topically related words. Best of both worlds: indexable like BM25,
            semantic like an embedding.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={16}>
              SPLADE(&quot;I love cats&quot;) - top weighted terms
            </T>
            <T color="#b8a9ff" size={13} style={{ marginTop: 4 }} center>
              Original tokens stay (lexical), but the model also activates semantic neighbours (expanded).
            </T>
            <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {SPLADE_PREVIEW.map((s) => (
                <div
                  key={s.term}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: s.kind === "lexical" ? `${C.purple}12` : `${C.cyan}10`,
                    border: `1px solid ${s.kind === "lexical" ? C.purple : C.cyan}30`,
                    minWidth: 90,
                  }}
                >
                  <div style={{ fontSize: 11, color: C.dim }}>{s.kind}</div>
                  <div
                    style={{
                      fontSize: 14,
                      color: s.kind === "lexical" ? C.purple : C.cyan,
                      fontWeight: "bold",
                    }}
                  >
                    {s.term}
                  </div>
                  <div style={{ fontSize: 13, color: C.bright, fontFamily: "monospace" }}>{s.weight.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <T color="#b8a9ff" size={13} style={{ marginTop: 10, fontStyle: "italic" }} center>
              &quot;Feline&quot; and &quot;kitten&quot; were never in the input sentence, but SPLADE put them in the
              vector anyway. A query for &quot;feline&quot; now hits this doc.
            </T>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                Sparsity is still ~99%
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                A SPLADE vector typically has 50-150 non-zero entries out of 30,000. Still sparse enough to live in an
                inverted index.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                Trained with a sparsity regularizer
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }} center>
                The loss has an L1 penalty on the vector, pushing most entries to zero. Without it, the model would fill
                every dimension and you would just have a slow dense vector.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            SPLADE is what people mean by &quot;learned sparse&quot;. It runs on the same engines that already serve
            BM25 - Elasticsearch, OpenSearch, Pinecone sparse - so production teams can ship it without a new datastore.
            Pinecone and Qdrant both offer it as a first-class vector type.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Which to use - and why production picks both
          </T>
          <T color="#7cc4ff" style={{ marginTop: 8 }}>
            Dense and sparse fail on opposite queries. Dense handles paraphrase but misses exact tokens. Sparse handles
            exact tokens but misses synonyms. The query type tells you which is in trouble. In practice you run both and
            fuse the results - that is the hybrid retrieval setup in 17.5 and 21.3.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr",
                gap: 10,
                padding: "8px 12px",
                borderBottom: `1px solid ${C.blue}20`,
              }}
            >
              <T color={C.blue} bold size={14}>
                Query type
              </T>
              <T color={C.blue} bold center size={14}>
                Dense
              </T>
              <T color={C.blue} bold center size={14}>
                Sparse (BM25)
              </T>
            </div>
            {[
              {
                q: "Feline care tips (synonym of cats)",
                dense: "Strong",
                denseColor: C.green,
                sparse: "Misses (no shared token)",
                sparseColor: C.red,
              },
              {
                q: "How to fix bug E_AUTH_4012",
                dense: "Drifts to generic auth docs",
                denseColor: C.red,
                sparse: "Exact hit",
                sparseColor: C.green,
              },
              {
                q: "Cancel my subscription (paraphrase)",
                dense: "Strong",
                denseColor: C.green,
                sparse: "Misses if doc says 'Account Deletion'",
                sparseColor: C.red,
              },
              {
                q: "SKU 88-A-21 in stock?",
                dense: "Weak (rare token, no embedding signal)",
                denseColor: C.red,
                sparse: "Exact hit",
                sparseColor: C.green,
              },
              {
                q: "Best way to learn Python (mixed)",
                dense: "Strong on intent",
                denseColor: C.green,
                sparse: "Strong on the word 'Python'",
                sparseColor: C.green,
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 6,
                  marginTop: 6,
                  background: "rgba(0,0,0,0.3)",
                  alignItems: "center",
                }}
              >
                <T color={C.bright} size={14}>
                  {row.q}
                </T>
                <T color={row.denseColor} center size={13}>
                  {row.dense}
                </T>
                <T color={row.sparseColor} center size={13}>
                  {row.sparse}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={17}>
              Production default: run both, fuse with RRF
            </T>
            <T color="#80e8a5" size={15} style={{ marginTop: 6 }} center>
              Run a dense ANN index and a sparse inverted index in parallel. Each returns its top-k. Combine the two
              ranked lists with reciprocal rank fusion. The failures are largely uncorrelated, so recall jumps by
              roughly +10 points over either retriever alone. That is hybrid search - the setup we will build in 17.5.
            </T>
          </div>
          <T color="#7cc4ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One sentence to remember the difference: dense vectors compress meaning into 768 floats, sparse vectors
            spread meaning across 30,000 mostly-empty slots. Different geometries, different failure modes, both real
            vectors, both worth keeping.
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
