import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function GroupedQueryAttention(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Recall: Multi-Head Attention
          </T>
          <T color={C.blue} style={{ marginTop: 6 }}>
            In chapters <ChapterLink to="11.1">11.1</ChapterLink>-<ChapterLink to="11.6">11.6</ChapterLink>, we learned
            standard MHA. With 8 heads, the model maintains 8 independent sets of Q,
            K, V weight matrices:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
              }}
            >
              <T color={C.blue} bold size={16}>
                Queries
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.blue}15`,
                      border: `1px solid ${C.blue}25`,
                    }}
                  >
                    <T color={C.blue} size={13} bold>
                      W_Q{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Keys
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.orange}15`,
                      border: `1px solid ${C.orange}25`,
                    }}
                  >
                    <T color={C.orange} size={13} bold>
                      W_K{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                Values
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.green}15`,
                      border: `1px solid ${C.green}25`,
                    }}
                  >
                    <T color={C.green} size={13} bold>
                      W_V{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>
            That is 8 W_Q + 8 W_K + 8 W_V = <strong>24 weight matrices</strong> per attention layer. Each head has its
            own complete set. This works great for quality, but there is a hidden cost during inference.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The inference problem: KV cache memory
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            During generation, we cache the K and V vectors for all previous tokens. This avoids recomputing them at
            every step. But this <strong>KV cache</strong> grows fast.
          </T>
          <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              KV cache memory per layer
            </T>
            <T color={C.bright} center size={16} style={{ marginTop: 8, fontFamily: "monospace" }}>
              2 x num_heads x seq_length x d_head x bytes_per_param
            </T>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <T color="#ef9a9a" bold size={16}>
              Concrete example: LLaMA 2 70B
            </T>
            {[
              { param: "num_heads", val: "64", note: "64 attention heads" },
              { param: "d_head", val: "128", note: "128 dims per head (8192 / 64)" },
              { param: "seq_length", val: "4096", note: "4096 token context window" },
              { param: "layers", val: "80", note: "80 transformer layers" },
              { param: "bytes", val: "2", note: "2 bytes per param (float16)" },
            ].map(({ param, val, note }) => (
              <div
                key={param}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 50px 1fr",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: `${C.red}06`,
                }}
              >
                <code style={{ color: C.red, fontSize: 14, fontWeight: 600 }}>{param}</code>
                <T color={C.mid} bold size={14}>
                  {val}
                </T>
                <T color={C.dim} size={13}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Total KV cache per batch item
            </T>
            <T color={C.dim} size={15} center style={{ marginTop: 4, fontFamily: "monospace" }}>
              2 x 64 x 4096 x 128 x 2 bytes = 134,217,728 bytes per layer
            </T>
            <T color={C.dim} size={15} center style={{ fontFamily: "monospace" }}>
              134,217,728 x 80 layers = 10,737,418,240 bytes
            </T>
            <T color={C.yellow} bold center size={18} style={{ marginTop: 6 }}>
              ~10 GB per batch item!
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              Serving 8 users simultaneously = 80 GB just for KV caches. That is an entire A100 GPU of memory - before
              the model weights themselves.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            GQA solution: share K and V across query groups
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Instead of giving every head its own K and V, we <strong>share</strong> K and V across groups of query
            heads. Each head still has its own unique Q - queries stay personal.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Example: 8 query heads, 2 KV groups
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    Group 1: Heads 1-4 share K_1, V_1
                  </T>
                  <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["Q_1", "Q_2", "Q_3", "Q_4"].map((q) => (
                      <div
                        key={q}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: `${C.blue}15`,
                          border: `1px solid ${C.blue}25`,
                        }}
                      >
                        <T color={C.blue} size={13} bold>
                          {q}
                        </T>
                      </div>
                    ))}
                    <T color={C.dim} size={14} style={{ alignSelf: "center" }}>
                      all use
                    </T>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}15`,
                        border: `1px solid ${C.orange}25`,
                      }}
                    >
                      <T color={C.orange} size={13} bold>
                        K_1
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      <T color={C.green} size={13} bold>
                        V_1
                      </T>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${C.yellow}06`,
                    border: `1px solid ${C.yellow}12`,
                  }}
                >
                  <T color={C.yellow} bold size={15}>
                    Group 2: Heads 5-8 share K_2, V_2
                  </T>
                  <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["Q_5", "Q_6", "Q_7", "Q_8"].map((q) => (
                      <div
                        key={q}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: `${C.blue}15`,
                          border: `1px solid ${C.blue}25`,
                        }}
                      >
                        <T color={C.blue} size={13} bold>
                          {q}
                        </T>
                      </div>
                    ))}
                    <T color={C.dim} size={14} style={{ alignSelf: "center" }}>
                      all use
                    </T>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}15`,
                        border: `1px solid ${C.orange}25`,
                      }}
                    >
                      <T color={C.orange} size={13} bold>
                        K_2
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      <T color={C.green} size={13} bold>
                        V_2
                      </T>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <T color="#80e8a5" style={{ marginTop: 4 }}>
              Weight matrices needed: 8 W_Q + 2 W_K + 2 W_V = <strong>12 projections</strong> (down from 24). The K and
              V computations (and their caches) shrink by 4x.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Visual comparison: MHA vs GQA vs MQA
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                name: "MHA (Multi-Head Attention)",
                qHeads: 8,
                kHeads: 8,
                vHeads: 8,
                projections: 24,
                kvCacheNote: "8 K + 8 V cached per layer",
                color: C.red,
              },
              {
                name: "GQA (Grouped-Query Attention, 4 heads per group)",
                qHeads: 8,
                kHeads: 2,
                vHeads: 2,
                projections: 12,
                kvCacheNote: "2 K + 2 V cached per layer (4x less)",
                color: C.green,
              },
              {
                name: "MQA (Multi-Query Attention)",
                qHeads: 8,
                kHeads: 1,
                vHeads: 1,
                projections: 10,
                kvCacheNote: "1 K + 1 V cached per layer (8x less)",
                color: C.blue,
              },
            ].map(({ name, qHeads, kHeads, vHeads, projections, kvCacheNote, color }) => (
              <div
                key={name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold center size={17}>
                  {name}
                </T>
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.blue} bold size={20} center>
                      {qHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      Q heads
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.orange} bold size={20} center>
                      {kHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      K heads
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.green} bold size={20} center>
                      {vHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      V heads
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={14} center style={{ marginTop: 6 }}>
                  {projections} projections total
                </T>
                <T color={C.mid} size={14} center style={{ marginTop: 2 }}>
                  {kvCacheNote}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              KV cache savings (LLaMA 2 70B, 4096 context)
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { type: "MHA (64 KV heads)", mem: "~10 GB", bar: 100, color: C.red },
                { type: "GQA-8 (8 KV groups)", mem: "~1.25 GB", bar: 12.5, color: C.green },
                { type: "MQA (1 KV shared)", mem: "~160 MB", bar: 1.6, color: C.blue },
              ].map(({ type, mem, bar, color }) => (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={color} size={13} style={{ minWidth: 150 }}>
                    {type}
                  </T>
                  <div
                    style={{
                      flex: 1,
                      height: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${bar}%`, height: "100%", background: color, borderRadius: 4 }} />
                  </div>
                  <T color={color} bold size={13} style={{ minWidth: 70, textAlign: "right" }}>
                    {mem}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why does sharing K and V work?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            The query is the "question" each head asks. Each head needs its own unique question to capture different
            patterns (syntax, semantics, coreference, etc.).
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            But keys and values are the "answers" - and it turns out adjacent heads often attend to{" "}
            <strong>similar positions</strong> anyway. The K and V vectors across heads are highly correlated. Sharing
            them loses very little information.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Research result
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                GQA matches standard MHA quality within 1% on most benchmarks while using 4x less KV cache memory. The
                quality-to-efficiency tradeoff is exceptionally favorable.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Models using GQA
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { model: "LLaMA 2 70B", detail: "8 KV groups" },
                  { model: "LLaMA 3", detail: "8 KV groups" },
                  { model: "Mistral 7B", detail: "8 KV groups" },
                  { model: "Gemma", detail: "varies by size" },
                ].map(({ model, detail }) => (
                  <div
                    key={model}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 5,
                      background: `${C.orange}12`,
                      border: `1px solid ${C.orange}25`,
                    }}
                  >
                    <T color={C.orange} bold size={14}>
                      {model}
                    </T>
                    <T color={C.dim} size={11}>
                      {detail}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Why not always use MQA (1 shared KV)?
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                MQA saves the most memory but does lose quality - about 2-5% on harder tasks. GQA is the sweet spot:
                most of the memory savings with almost no quality loss. That is why most modern large models use GQA
                with 8 groups, not full MQA.
              </T>
            </div>
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
