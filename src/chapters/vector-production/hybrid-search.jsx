import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function HybridSearch(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Embeddings blur exact terms - SKUs, proper nouns, rare tokens
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Semantic embeddings are trained to reward meaning. Two docs saying the same thing with different words end
            up close in the embedding space. The flip side is that a doc with a unique identifier (SKU-A4291, &quot;Dr.
            Whiskers&quot;, &quot;kernel panic 0x7B&quot;) gets no special treatment - the exact token is smoothed into
            its neighborhood. Semantic search silently misses lookups where the word itself is the signal.
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
              What vectors lose
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
                { name: "SKUs and IDs", ex: "SKU-A4291, ORD-88213", loss: "Exact match required" },
                { name: "Proper nouns", ex: "Rajul, Mumbai, AlphaFold", loss: "Rare in training" },
                { name: "Rare terms", ex: "Tabby, kernel panic, RoPE", loss: "Blurred into neighbors" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}08`,
                    border: `1px solid ${C.cyan}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={14} center>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright }}>{r.ex}</div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                    {r.loss}
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
            Vector search excels at <span style={{ color: C.cyan }}>meaning</span>
            <br />
            Vector search misses <span style={{ color: C.red }}>literal tokens</span>
            <br />
            Hybrid search combines vectors with keyword search to recover both
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The rescue is classic BM25 lexical search running alongside the vector index. Merge the two ranked lists and
            you keep the best of each.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            BM25: term frequency x inverse document frequency
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            BM25 is the lexical-search workhorse, shipped in every production search engine since Lucene. For a query of
            terms t, a document d scores by summing the IDF of each term (rare terms count more) times a saturating
            term-frequency contribution from d (more appearances help, but with diminishing returns).
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
              BM25 score formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              BM25(q, d) = <span style={{ color: C.yellow }}>&Sigma;</span>
              <sub>t &isin; q</sub> IDF(t) &middot; TF<sub>norm</sub>(t, d)
              <br />
              IDF(t) = log(<span style={{ color: C.yellow }}>N / df(t)</span>) &nbsp;-&nbsp; term frequency in corpus
              <br />
              TF<sub>norm</sub>(t, d) = tf(t, d) &middot; (k<sub>1</sub> + 1) / (tf(t, d) + k<sub>1</sub> &middot;
              length-adjustment)
              <br />k<sub>1</sub> &asymp; 1.2 &middot; b &asymp; 0.75 (standard Lucene defaults)
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
              Worked example: query &quot;cats domesticated&quot; against the cat corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 3fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>ID</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Text</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>BM25</div>
              <div style={{ color: C.yellow, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Rank</div>
              {[
                { id: 1, text: "Cats are small domesticated carnivores", bm25: "4.82", rank: 1 },
                { id: 5, text: "Tigers are striped cats", bm25: "2.30", rank: 2 },
                { id: 3, text: "Lions are big cats that live in Africa", bm25: "2.10", rank: 3 },
                { id: 8, text: "The dog chased the cat", bm25: "1.90", rank: 4 },
                { id: 7, text: "Kittens grow up to be cats", bm25: "1.70", rank: 5 },
              ].flatMap((r) => [
                <div
                  key={`id-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.yellow}08`, borderRadius: 4, color: C.yellow }}
                >
                  {r.id}
                </div>,
                <div key={`text-${r.id}`} style={{ padding: "6px 8px", background: `${C.yellow}08`, borderRadius: 4 }}>
                  {r.text}
                </div>,
                <div
                  key={`score-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.yellow}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.yellow,
                    fontWeight: "bold",
                  }}
                >
                  {r.bm25}
                </div>,
                <div
                  key={`rank-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.yellow}08`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {r.rank}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Doc 1 scores highest because it contains both query terms and is the shortest match. BM25&apos;s
            length-normalization keeps it fair across docs of different sizes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Run vector ANN and BM25 in parallel, keep both ranked lists
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Given the query, fire both systems simultaneously. The vector index returns its top-N by embedding
            similarity; the BM25 index returns its top-N by lexical score. Neither list needs to know the other exists
            at this stage - they each do what they are good at. Merging is a separate step.
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
              Two independent rankers run in parallel
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Flow diagram showing a query icon on the left splitting into two parallel lanes. The upper lane flows
                  to a vector ANN box that emits a ranked list of top-N docs. The lower lane flows to a BM25 box that
                  emits another ranked list. Both lists arrive at a merge node on the right labeled RRF. Illustrates the
                  hybrid-search parallel-ranker architecture.
                </desc>
                <circle cx={40} cy={110} r={16} fill={C.green} />
                <text x={40} y={115} fill={C.bg} fontSize={12} fontWeight="bold" textAnchor="middle">
                  q
                </text>
                <line x1={56} y1={110} x2={160} y2={60} stroke={C.cyan} strokeWidth={2} />
                <line x1={56} y1={110} x2={160} y2={160} stroke={C.yellow} strokeWidth={2} />
                <rect
                  x={160}
                  y={40}
                  width={130}
                  height={50}
                  fill={`${C.cyan}14`}
                  stroke={C.cyan}
                  strokeWidth={1.5}
                  rx={6}
                />
                <text x={225} y={70} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Vector ANN
                </text>
                <rect
                  x={160}
                  y={140}
                  width={130}
                  height={50}
                  fill={`${C.yellow}14`}
                  stroke={C.yellow}
                  strokeWidth={1.5}
                  rx={6}
                />
                <text x={225} y={170} fill={C.yellow} fontSize={14} fontWeight="bold" textAnchor="middle">
                  BM25
                </text>
                <rect
                  x={320}
                  y={40}
                  width={120}
                  height={50}
                  fill={`${C.cyan}08`}
                  stroke={C.cyan}
                  strokeWidth={1}
                  rx={6}
                />
                <text x={380} y={70} fill={C.cyan} fontSize={12} textAnchor="middle">
                  Top-N ranked list
                </text>
                <rect
                  x={320}
                  y={140}
                  width={120}
                  height={50}
                  fill={`${C.yellow}08`}
                  stroke={C.yellow}
                  strokeWidth={1}
                  rx={6}
                />
                <text x={380} y={170} fill={C.yellow} fontSize={12} textAnchor="middle">
                  Top-N ranked list
                </text>
                <line x1={440} y1={65} x2={470} y2={110} stroke={C.green} strokeWidth={2} />
                <line x1={440} y1={165} x2={470} y2={110} stroke={C.green} strokeWidth={2} />
                <circle cx={485} cy={110} r={18} fill={`${C.green}20`} stroke={C.green} strokeWidth={2} />
                <text x={485} y={115} fill={C.green} fontSize={13} fontWeight="bold" textAnchor="middle">
                  RRF
                </text>
              </svg>
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
            Vector returns top-<span style={{ color: C.cyan }}>N</span> by similarity
            <br />
            BM25 returns top-<span style={{ color: C.yellow }}>N</span> by lexical score
            <br />
            Merge them in the next step
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The two systems can even live on different nodes. The only shared state is the query itself and the final
            merge point.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Reciprocal Rank Fusion - RRF
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Combine two ranked lists without needing their raw scores (BM25 and cosine live on different scales). For
            each doc, compute 1 / (k + rank) on every ranker that returned it, then sum. The constant k dampens the
            contribution of low-ranking docs; the Lucene-standard value is k = 60.
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
              RRF formula with standard k = 60
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
              RRF(d) = <span style={{ color: C.orange }}>&Sigma;</span>
              <sub>r &isin; rankers</sub> 1 / (k + rank<sub>r</sub>(d))
              <br />k = <span style={{ color: C.orange }}>60</span> &middot; standard since the 2009 TREC paper
            </div>
          </div>
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
              RRF on the cat corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.6fr 1fr 1fr 1.2fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Doc</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Vec rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                BM25 rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                1 / (60 + rank)
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>RRF</div>
              {[
                { id: 1, vr: 2, br: 1, calc: "1/62 + 1/61", rrf: "0.0326" },
                { id: 3, vr: 1, br: 3, calc: "1/61 + 1/63", rrf: "0.0323" },
                { id: 5, vr: 4, br: 2, calc: "1/64 + 1/62", rrf: "0.0317" },
                { id: 7, vr: 3, br: 5, calc: "1/63 + 1/65", rrf: "0.0313" },
                { id: 8, vr: 5, br: 4, calc: "1/65 + 1/64", rrf: "0.0310" },
              ].flatMap((r, i) => [
                <div
                  key={`id-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: i === 0 ? `${C.green}20` : `${C.orange}08`,
                    borderRadius: 4,
                    color: i === 0 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  Doc {r.id}
                </div>,
                <div
                  key={`vr-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.vr}
                </div>,
                <div
                  key={`br-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.br}
                </div>,
                <div
                  key={`calc-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.orange}06`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.calc}
                </div>,
                <div
                  key={`rrf-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: i === 0 ? `${C.green}20` : `${C.orange}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: i === 0 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {r.rrf}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Doc 1 wins because it ranked well on both. RRF rewards doc consensus; docs that only one ranker likes fall
            below the consensus winners.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            &quot;tabby cat genetics&quot; - vector vs BM25 vs hybrid
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Concrete side-by-side. Query: &quot;tabby cat genetics&quot;. Pure vector finds semantically cat-ish docs
            and misses &quot;tabby&quot;. Pure BM25 finds the exact &quot;tabby&quot; hit but ranks unrelated fluff with
            the word in it. Hybrid RRF merges: real tabby-cat doc at the top.
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
              Top-5 per strategy for &quot;tabby cat genetics&quot;
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
                {
                  name: "Pure vector",
                  color: C.cyan,
                  results: [
                    "Lions are big cats (near miss)",
                    "Tigers are striped cats (near miss)",
                    "Cats are small carnivores",
                    "Kittens grow up to be cats",
                    "My cat sat on the mat",
                  ],
                  note: "No hit on tabby - the actual topic",
                },
                {
                  name: "Pure BM25",
                  color: C.yellow,
                  results: [
                    "Tabby cat coat color genetics",
                    "Abyssinian cat tabby pattern",
                    "Genetics 101 textbook (unrelated)",
                    "Random tabby mention in a tweet",
                    "Tabby bar and grill menu",
                  ],
                  note: "Off-topic exact matches rank high",
                },
                {
                  name: "Hybrid (RRF)",
                  color: C.green,
                  results: [
                    "Tabby cat coat color genetics",
                    "Abyssinian cat tabby pattern",
                    "Tigers are striped cats",
                    "Cats are small carnivores",
                    "Kittens grow up to be cats",
                  ],
                  note: "Tabby + genetics concentrated at the top",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  style={{
                    padding: "10px 12px",
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={s.color} bold center size={14}>
                    {s.name}
                  </T>
                  <ol style={{ marginTop: 6, paddingLeft: 18, fontSize: 12, color: C.bright, lineHeight: 1.6 }}>
                    {s.results.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                  <T color={C.dim} size={11} style={{ marginTop: 6 }}>
                    {s.note}
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
            Hybrid wins when the query has <span style={{ color: C.red }}>both</span> exact and semantic intent
            <br />
            Pure vector loses <span style={{ color: C.red }}>tabby</span> - pure BM25 loses{" "}
            <span style={{ color: C.red }}>cat genetics</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            If product queries ever include a specific term that must match exactly, hybrid is almost always worth
            enabling.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Weighted RRF and when hybrid is worth it
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Production deployments often weight the two rankers. The standard form is score(d) = alpha &middot; RRF_vec
            + beta &middot; RRF_bm25. Typical values: alpha = 0.7, beta = 0.3 when the corpus is mostly natural
            language; flip to 0.3/0.7 for code or catalog data where literal tokens dominate. Run A/B tests to find the
            right weights on your data.
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
              Weighted RRF formula
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
              score(d) = <span style={{ color: C.purple }}>alpha</span> &middot; RRF<sub>vec</sub>(d) +{" "}
              <span style={{ color: C.purple }}>beta</span> &middot; RRF<sub>bm25</sub>(d)
              <br />
              Typical defaults: <span style={{ color: C.purple }}>alpha = 0.7, beta = 0.3</span>
              <br />
              Tune via held-out recall on your own data
            </div>
          </div>
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
              When hybrid is worth the cost
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
                  name: "Hybrid wins",
                  color: C.green,
                  items: [
                    "Mixed natural-language + SKU queries",
                    "Multi-lingual or technical corpora",
                    "Long-tail identifier lookups",
                    "Retrieval-augmented generation (RAG)",
                  ],
                },
                {
                  name: "Hybrid not worth it",
                  color: C.red,
                  items: [
                    "Pure chat or FAQ (vectors already great)",
                    "Very short queries with no identifiers",
                    "Strict latency budgets (< 10 ms)",
                    "BM25 index is itself unmaintained",
                  ],
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={r.color} bold center size={14}>
                    {r.name}
                  </T>
                  <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13, color: C.bright, lineHeight: 1.7 }}>
                    {r.items.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Weighted hybrid adds operational complexity - two indexes, two query paths, one merge. Turn it on only after
            you measure a specific quality gap vectors alone cannot close.
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
