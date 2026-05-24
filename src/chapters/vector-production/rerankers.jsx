import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Rerankers(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two-stage retrieval: ANN returns top-100, rerank returns top-10
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Accurate retrieval does not need to be accurate everywhere - only at the top. Stage 1 uses ANN to quickly
            pull 100 roughly-relevant candidates from a billion-vector index. Stage 2 is a slower but smarter model that
            re-scores those 100 candidates. Total cost: fast over the billion, slow over the hundred. The win is that
            stage-2 accuracy matters only on k=100, not on N=1B.
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
              Stage 1: ANN returns top-100 candidates (fast, approximate)
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
              Corpus: <span style={{ color: C.cyan }}>N = 1B</span> vectors
              <br />
              ANN latency: <span style={{ color: C.green }}>~5 ms</span> per query (HNSW)
              <br />
              Output: <span style={{ color: C.cyan }}>top-100 candidates</span>, may include some near-misses
              <br />
              Candidate quality is fine at k=100, not at k=10
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { stage: "Stage 1 - retrieval", cost: "5 ms", tech: "HNSW / IVF-PQ", size: "1B -> 100", color: C.cyan },
              { stage: "Stage 2 - rerank", cost: "100 ms", tech: "Cross-encoder", size: "100 -> 10", color: C.yellow },
              { stage: "Final", cost: "~105 ms", tech: "Combined", size: "10", color: C.green },
            ].map((r) => (
              <div
                key={r.stage}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={14} center>
                  {r.stage}
                </T>
                <div
                  style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: C.bright, textAlign: "center" }}
                >
                  {r.cost}
                </div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  {r.tech}
                </T>
                <div
                  style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: r.color, textAlign: "center" }}
                >
                  {r.size}
                </div>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The two-stage pattern is standard in search engines, ads systems, and RAG pipelines. The only real question
            is what the stage-2 model is.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Cross-encoder: query and doc concatenated into one transformer pass
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            A cross-encoder takes the query and the candidate doc, concatenates their tokens into one input stream
            (often &quot;[CLS] query [SEP] doc [SEP]&quot;), runs the whole thing through a transformer, and emits a
            single relevance score. Because query and doc tokens share attention inside the stack, the model can
            condition on exactly which part of the doc matches which part of the query.
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
              Cross-encoder architecture
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 200" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Cross-encoder diagram. Input row shows tokens labeled CLS, query tokens, SEP, doc tokens, SEP,
                  concatenated in a single stream. Arrows go up into a single transformer stack represented as a tall
                  rounded rectangle. The top emits a single relevance score circle. Illustrates that query and doc
                  tokens share attention inside one forward pass.
                </desc>
                <g>
                  {[
                    { label: "[CLS]", color: C.cyan },
                    { label: "Query", color: C.cyan },
                    { label: "Query", color: C.cyan },
                    { label: "[SEP]", color: C.dim },
                    { label: "Doc", color: C.yellow },
                    { label: "Doc", color: C.yellow },
                    { label: "Doc", color: C.yellow },
                    { label: "Doc", color: C.yellow },
                    { label: "[SEP]", color: C.dim },
                  ].map((t, i) => (
                    <g key={`tok-${i}`}>
                      <rect
                        x={47 + i * 48}
                        y={150}
                        width={42}
                        height={30}
                        fill={`${t.color}14`}
                        stroke={t.color}
                        strokeWidth={1}
                        rx={4}
                      />
                      <text x={47 + i * 48 + 21} y={170} fill={t.color} fontSize={10} textAnchor="middle">
                        {t.label}
                      </text>
                      <line
                        x1={47 + i * 48 + 21}
                        y1={150}
                        x2={47 + i * 48 + 21}
                        y2={120}
                        stroke={C.dim}
                        strokeWidth={1}
                      />
                    </g>
                  ))}
                </g>
                <rect
                  x={26}
                  y={50}
                  width={468}
                  height={70}
                  fill={`${C.yellow}12`}
                  stroke={C.yellow}
                  strokeWidth={2}
                  rx={6}
                />
                <text x={260} y={95} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  Transformer (full attention across all tokens)
                </text>
                <line x1={260} y1={50} x2={260} y2={30} stroke={C.green} strokeWidth={2} />
                <circle cx={260} cy={20} r={15} fill={C.green} />
                <text x={260} y={24} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                  Score
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
            Input = [CLS] query [SEP] doc [SEP]
            <br />
            One transformer pass &middot; one scalar output
            <br />
            Score = P(doc is relevant to query)
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The architecture is dead simple. The expense is running it per candidate: each doc is a full forward pass
            through the model.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Bi-encoder cosine cannot see query-doc token interactions
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Why is the cross-encoder better than just comparing two vectors? A bi-encoder produces one vector per query
            and one per doc, then measures cosine. All token-level information is collapsed into those two vectors
            before they meet. The cross-encoder keeps the tokens separate and lets full attention decide which
            interactions matter.
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
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Bi-encoder (what stage 1 does)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Query -&gt; encoder -&gt; <span style={{ color: C.red }}>q_vec</span>
                <br />
                Doc -&gt; encoder -&gt; <span style={{ color: C.red }}>d_vec</span>
                <br />
                Score = cosine(q_vec, d_vec)
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                No token-level interaction. Everything gets pooled into a single vector first.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Cross-encoder (what stage 2 does)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                Concat(query, doc) -&gt; transformer
                <br />
                Full attention across all tokens
                <br />
                Score = one scalar
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 6 }} center>
                Query tokens attend to doc tokens and vice versa. Maximally informed score.
              </T>
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
            Typical quality jump: <span style={{ color: C.green }}>+10 to +20 MRR@10</span> over bi-encoder alone
            <br />
            MS-MARCO leaderboards: cross-encoders win on almost every benchmark
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The price: you cannot pre-compute cross-encoder scores the way you pre-compute embeddings. Every (query,
            doc) pair is a fresh forward pass.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Rerank: score each candidate, sort, return top-10
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Once stage 1 has supplied the 100 candidates, run the cross-encoder once per candidate with the same query.
            Sort by score, return the top-10 to the user. The rerank does not change which candidates exist - it only
            changes their ordering. A bad stage-1 candidate set cannot be fixed at stage 2.
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
              Rerank 100 candidates to top-10
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
              For candidate d in top-100:
              <br />
              &nbsp;&nbsp;score(d) = <span style={{ color: C.orange }}>cross_encoder(query, d)</span>
              <br />
              Sort candidates by score desc
              <br />
              Return top-<span style={{ color: C.orange }}>10</span>
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
              Before rerank (stage 1) vs after rerank (stage 2)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 2fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Doc</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Text</div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                ANN rank
              </div>
              <div style={{ color: C.orange, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Rerank</div>
              {[
                { id: 1, text: "Cats are small domesticated carnivores", ann: 4, rr: 1 },
                { id: 7, text: "Kittens grow up to be cats", ann: 2, rr: 2 },
                { id: 3, text: "Lions are big cats that live in Africa", ann: 1, rr: 3 },
                { id: 4, text: "My cat sat on the mat", ann: 7, rr: 4 },
                { id: 5, text: "Tigers are striped cats", ann: 3, rr: 5 },
              ].flatMap((r) => [
                <div
                  key={`id-${r.id}`}
                  style={{ padding: "6px 8px", background: `${C.orange}08`, borderRadius: 4, color: C.orange }}
                >
                  {r.id}
                </div>,
                <div key={`text-${r.id}`} style={{ padding: "6px 8px", background: `${C.orange}08`, borderRadius: 4 }}>
                  {r.text}
                </div>,
                <div
                  key={`ann-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.orange}06`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.dim,
                  }}
                >
                  {r.ann}
                </div>,
                <div
                  key={`rr-${r.id}`}
                  style={{
                    padding: "6px 8px",
                    background: r.rr === 1 ? `${C.green}20` : `${C.orange}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.rr === 1 ? C.green : C.orange,
                    fontWeight: "bold",
                  }}
                >
                  {r.rr}
                </div>,
              ])}
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The reranker is not psychic - stage 1 has to include the right doc in its top-100 for the reranker to
            promote it. Recall at stage 1 is still the upstream bottleneck.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Latency cost: 100 rerank runs is about 100 ms on an A10 GPU
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Cross-encoders are small transformers - BERT-base or BERT-large sized. On a modern GPU, one (query, doc)
            forward pass is ~1 ms. 100 candidates = ~100 ms of latency added on top of stage 1. That is big enough to
            notice, small enough to justify for quality-critical paths.
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
              Reranker latency on production GPUs
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 0.8fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>GPU</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Per-pair</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                100 candidates
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>QPS cap</div>
              {[
                { gpu: "T4 (older)", pair: "5 ms", hundred: "500 ms", qps: "2 / sec" },
                { gpu: "A10", pair: "1 ms", hundred: "100 ms", qps: "10 / sec" },
                { gpu: "A100", pair: "0.5 ms", hundred: "50 ms", qps: "20 / sec" },
                { gpu: "H100", pair: "0.3 ms", hundred: "30 ms", qps: "33 / sec" },
              ].flatMap((r) => [
                <div
                  key={`g-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, color: C.red }}
                >
                  {r.gpu}
                </div>,
                <div
                  key={`p-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.pair}
                </div>,
                <div
                  key={`h-${r.gpu}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.hundred}
                </div>,
                <div
                  key={`q-${r.gpu}`}
                  style={{ padding: "6px 8px", background: `${C.red}06`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.qps}
                </div>,
              ])}
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
            Reranker latency = <span style={{ color: C.red }}>candidates &middot; per-pair cost</span>
            <br />
            Batch all 100 pairs on one GPU to hit the numbers above
            <br />
            Dropping to top-50 halves the latency
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            In RAG, this extra 100 ms usually trades against an LLM call that already costs 500 ms. Rerankers are
            popular because they fit comfortably in that budget.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production models: Cohere Rerank, BGE-reranker, MS-MARCO cross-encoders
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Three families dominate production. Cohere&apos;s managed API ships general-purpose rerankers with a simple
            REST call. BGE and similar open-weight models from BAAI run locally on GPU. MS-MARCO cross-encoders are the
            classic open-source baseline and still competitive. Each has different latency, quality, and operational
            stories.
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
              Production reranker models
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
                  name: "Cohere Rerank 3",
                  kind: "Managed API",
                  size: "~400M params",
                  note: "Multi-lingual, context 4K tokens, simple REST",
                },
                {
                  name: "BGE-reranker v2",
                  kind: "Open weights",
                  size: "Base 268M / large 560M",
                  note: "BAAI release, self-host on A10/A100, BGE-reranker-m3 is multilingual",
                },
                {
                  name: "MS-MARCO cross-encoder",
                  kind: "Open weights",
                  size: "MiniLM ~33M, BERT-base 110M",
                  note: "Sentence-Transformers, classic baseline, smallest latency",
                },
                {
                  name: "RankGPT / LLM-as-judge",
                  kind: "Managed LLM",
                  size: "Listwise, LLM-driven",
                  note: "Highest quality, 10x latency, expensive",
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
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: C.bright,
                      textAlign: "center",
                    }}
                  >
                    {r.kind} &middot; {r.size}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                    {r.note}
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
            Start with <span style={{ color: C.purple }}>MS-MARCO MiniLM</span> as the cheap baseline
            <br />
            Move to <span style={{ color: C.purple }}>BGE-reranker</span> or{" "}
            <span style={{ color: C.purple }}>Cohere</span> when you need quality
            <br />
            Reserve <span style={{ color: C.purple }}>LLM-as-judge</span> for offline evals
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Swap the reranker without touching stage 1. The interface is always (query, candidates) -&gt; reordered
            candidates, which makes A/B tests straightforward.
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
