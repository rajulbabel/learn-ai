import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

export const MixtureOfExperts = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The problem - more brain, same effort per token
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Training a bigger model means more knowledge, but every token pays the full compute cost. What if most of
            the brain could nap while the relevant part does the work?
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={18}>
                Dense 47B model
              </T>
              <T color="#ef9a9a" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.red} bold center size={22} style={{ marginTop: 2 }}>
                47B (all of it)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Every FFN, every attention head, every layer fires for every token.
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
              <T color={C.green} bold center size={18}>
                MoE model (Mixtral 8x7B)
              </T>
              <T color="#80e8a5" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.green} bold center size={22} style={{ marginTop: 2 }}>
                ~13B (only 2 of 8 experts)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Same 47B total capacity loaded in memory, but only a slice runs per token.
              </T>
            </div>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Replace one FFN with a router + N expert FFNs
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.dim}06`,
                border: `1px solid ${C.dim}12`,
              }}
            >
              <T color={C.mid} bold center size={17}>
                Before: standard transformer block
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                LayerNorm -&gt; Attention -&gt; Add
                <br />
                LayerNorm -&gt; <strong style={{ color: C.bright }}>FFN</strong> -&gt; Add
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={17}>
                After: MoE block
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                LayerNorm -&gt; Attention -&gt; Add
                <br />
                LayerNorm -&gt; <strong style={{ color: C.cyan }}>[Router -&gt; top-k experts -&gt; weighted sum]</strong> -&gt; Add
              </T>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Each "expert" is just a copy of the FFN architecture (two matrices, an activation). 8 experts means 8
            independent sets of FFN weights. The router is a tiny linear layer that decides which experts to invoke.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Each token picks its top 2 experts
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The router is a tiny linear layer. For each token, it produces one score per expert, applies softmax, and
            picks the top-2 highest.
          </T>
          <div
            style={{
              marginTop: 12,
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
            Token = "cat" (from "I love cats")
            <br />
            router_scores = softmax(cat . W_router)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;= [0.03, 0.02, <strong style={{ color: C.green }}>0.80</strong>, 0.01, 0.04,{" "}
            <strong style={{ color: C.green }}>0.05</strong>, 0.02, 0.03]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E1&nbsp;&nbsp;&nbsp;E2&nbsp;&nbsp;&nbsp;
            <strong style={{ color: C.green }}>E3</strong>&nbsp;&nbsp;&nbsp;E4&nbsp;&nbsp;&nbsp;E5&nbsp;&nbsp;&nbsp;
            <strong style={{ color: C.green }}>E6</strong>&nbsp;&nbsp;&nbsp;E7&nbsp;&nbsp;&nbsp;E8
            <br />
            <br />
            top-2 picks: <strong style={{ color: C.green }}>E3 (0.80)</strong> and{" "}
            <strong style={{ color: C.green }}>E6 (0.05)</strong>
            <br />
            normalize: E3 = 0.80 / 0.85 = 0.94
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E6 = 0.05 / 0.85 = 0.06
            <br />
            <br />
            output = 0.94 . E3("cat") + 0.06 . E6("cat")
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            The router matrix <code>W_router</code> has shape d_model x num_experts (e.g., 4096 x 8 = 32K params).
            Negligible cost compared to an expert's ~650M params.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Without a fix, one expert hogs everything
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Early in training the router has no reason to spread load. It often collapses to sending almost every token
            to one "lucky" expert - the others never get gradient updates and go unused.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Without load balancing",
                color: C.red,
                lighter: "#ef9a9a",
                bars: [
                  { label: "E1", pct: 2 },
                  { label: "E2", pct: 1 },
                  { label: "E3", pct: 92 },
                  { label: "E4", pct: 1 },
                  { label: "E5", pct: 1 },
                  { label: "E6", pct: 1 },
                  { label: "E7", pct: 1 },
                  { label: "E8", pct: 1 },
                ],
              },
              {
                title: "With auxiliary loss",
                color: C.green,
                lighter: "#80e8a5",
                bars: [
                  { label: "E1", pct: 12 },
                  { label: "E2", pct: 13 },
                  { label: "E3", pct: 13 },
                  { label: "E4", pct: 12 },
                  { label: "E5", pct: 12 },
                  { label: "E6", pct: 13 },
                  { label: "E7", pct: 13 },
                  { label: "E8", pct: 12 },
                ],
              },
            ].map(({ title, color, lighter, bars }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={lighter} bold center size={16}>
                  {title}
                </T>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {bars.map((b) => (
                    <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <T color={C.dim} size={13} style={{ minWidth: 26 }}>
                        {b.label}
                      </T>
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div style={{ width: `${b.pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                      <T color={C.dim} size={13} style={{ minWidth: 34, textAlign: "right" }}>
                        {b.pct}%
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 18,
              color: C.bright,
            }}
          >
            L_aux = &alpha; . N . &Sigma; (f_i . P_i)
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 8 }}>
            f_i = fraction of tokens routed to expert i; P_i = total router probability mass sent to expert i. Product
            is minimized when routing is balanced.  The auxiliary loss is added to the main training loss.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Why it is called 8x7B but totals 47B, not 56B
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Attention is shared (not duplicated per expert). Only the FFN is replaced by experts. So 8 experts of ~7B
            FFN-size each do not multiply to 56B - most of each "7B" is the shared attention.
          </T>
          <div
            style={{
              marginTop: 12,
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
            Per layer:
            <br />
            &nbsp;&nbsp;Attention block:&nbsp;&nbsp;&nbsp;~350M
            <br />
            &nbsp;&nbsp;8 experts x ~650M:&nbsp;~5.2B
            <br />
            &nbsp;&nbsp;Router + norms:&nbsp;&nbsp;&nbsp;~50K (negligible)
            <br />
            &nbsp;&nbsp;-----------------------
            <br />
            &nbsp;&nbsp;Per layer total:&nbsp;&nbsp;&nbsp;~5.6B
            <br />
            <br />
            x 32 layers + shared embeddings = <strong style={{ color: C.orange }}>46.7B total</strong>
            <br />
            <br />
            <strong style={{ color: C.green }}>Active per token:</strong>
            <br />
            &nbsp;&nbsp;Attention:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;350M
            <br />
            &nbsp;&nbsp;2 of 8 experts:&nbsp;&nbsp;1.3B per layer
            <br />
            &nbsp;&nbsp;x 32 layers + embeddings = <strong style={{ color: C.green }}>~13B active</strong>
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            The "8x7B" name is marketing-ish. It hints at "8 experts, 7B-class model." The literal total is 47B because
            attention is shared across all experts (not replicated eight times).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory holds all experts. Compute only runs two.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            This is the core tradeoff. MoE does NOT reduce memory - every expert has to be loaded so the router can
            pick any of them. What it reduces is compute per token.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "GPU memory (fp16)",
                value: "94 GB",
                formula: "47B x 2 bytes per param",
                note: "All 8 experts must be loaded - the router could pick any.",
                color: C.red,
                lighter: "#ef9a9a",
              },
              {
                label: "Compute per token",
                value: "26 GFLOPs",
                formula: "13B x 2 (fwd-pass cost per param)",
                note: "Only 2 of 8 experts actually multiply anything for this token.",
                color: C.green,
                lighter: "#80e8a5",
              },
            ].map(({ label, value, formula, note, color, lighter }) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <T color={lighter} bold size={17}>
                    {label}
                  </T>
                  <T color={color} bold size={20}>
                    {value}
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {formula}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            Takeaway: MoE is great for data-center serving where memory is abundant but compute is precious. It
            struggles on edge devices where memory is the bottleneck.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            MoE models in production
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { model: "Mixtral 8x7B", total: "47B", active: "13B", experts: "8", routing: "top-2" },
              { model: "Mixtral 8x22B", total: "141B", active: "39B", experts: "8", routing: "top-2" },
              { model: "DeepSeek-V3", total: "671B", active: "37B", experts: "256 + 1 shared", routing: "top-8" },
              { model: "Qwen3-Next", total: "80B", active: "3B", experts: "512", routing: "top-10" },
            ].map(({ model, total, active, experts, routing }) => (
              <div
                key={model}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr 0.8fr",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                  alignItems: "center",
                }}
              >
                <T color={C.blue} bold size={16}>
                  {model}
                </T>
                <div>
                  <T color={C.dim} size={12}>
                    total
                  </T>
                  <T color={C.bright} bold size={16}>
                    {total}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    active
                  </T>
                  <T color={C.green} bold size={16}>
                    {active}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    experts
                  </T>
                  <T color={C.bright} size={15}>
                    {experts}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    routing
                  </T>
                  <T color={C.bright} size={15}>
                    {routing}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#80c8ff" style={{ marginTop: 10 }}>
            DeepSeek-V3 is the extreme case - only 5.5% of its 671B params activate per token. That is why it is
            cheap to serve despite being enormous on disk.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            MoE is not free lunch
          </T>
          <T color="#f0a0ff" style={{ marginTop: 8 }}>
            Different deployments have different bottlenecks. MoE trades memory for compute - that wins in some
            contexts and loses in others.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                Wins
              </T>
              <ul style={{ color: "#80e8a5", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Large-scale data-center training</li>
                <li>High-throughput serving (many users at once)</li>
                <li>Compute-constrained + memory-rich settings</li>
                <li>When model capacity matters more than latency</li>
              </ul>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                Struggles
              </T>
              <ul style={{ color: "#ef9a9a", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Edge and on-device deployment</li>
                <li>Small-batch single-user inference</li>
                <li>Memory-constrained environments</li>
                <li>Latency-critical apps (the router adds hops)</li>
              </ul>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold size={17}>
              If you can afford the memory to hold a huge model but not the compute to run it, MoE is the answer.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub < 7 && (
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

export const Thinking = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A regular LLM vs a reasoning LLM on the same problem
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 6 }}>
            Prompt: "What is 23 x 47?"
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                Regular LLM
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: C.bright,
                  textAlign: "center",
                }}
              >
                1081
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                ~3 tokens. Fast. No guarantee it is right.
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
              <T color={C.green} bold center size={17}>
                Reasoning LLM
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                &lt;think&gt;
                <br />
                &nbsp;Let me compute. 23 x 47 = 23 x (50 - 3)
                <br />
                &nbsp;= 1150 - 69 = 1081.
                <br />
                &nbsp;Verify: 20 x 47 + 3 x 47 = 940 + 141 = 1081 OK
                <br />
                &lt;/think&gt;
                <br />
                <strong style={{ color: C.green }}>1081</strong>
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                ~120 tokens. Slower. Shows its work.
              </T>
            </div>
          </div>
          <T color="#80deea" center size={17} style={{ marginTop: 10, fontStyle: "italic" }}>
            The answer is the same. The process is what changed.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Every piece you learned in Sections 1-9 is unchanged
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A reasoning model is the exact same transformer. Nothing new is added to the architecture. The punchline is
            simple: a regular LLM and a reasoning LLM could share the same code file.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            {[
              "Tokenizer",
              "Multi-head Attention",
              "Embeddings",
              "FFN",
              "Positional encoding (RoPE)",
              "Layer norms",
              "Causal mask",
              "Residual connections",
              "KV cache",
              "Output head",
              "Softmax",
              "Autoregressive loop",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={C.green} bold size={16}>
                  OK
                </T>
                <T color={C.bright} size={15}>
                  {item}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A reasoning model and a regular LLM could share the same code file.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Not a new loop. The same loop, running longer.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Autoregressive generation always loops - the transformer can only produce one token per forward pass.
            Regular LLMs loop a few times. Reasoning LLMs loop thousands of times. Same mechanism either way.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Regular LLM",
                color: C.red,
                lighter: "#ef9a9a",
                steps: ["FWD -> 10", "FWD -> 81", "FWD -> <EOS>"],
                total: "~3 loop iterations",
              },
              {
                title: "Reasoning LLM",
                color: C.green,
                lighter: "#80e8a5",
                steps: ["FWD -> <think>", "FWD -> Let", "FWD -> me", "...", "FWD -> </think>", "FWD -> 1081"],
                total: "~120 loop iterations",
              },
            ].map(({ title, color, lighter, steps, total }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={lighter} bold center size={16}>
                  {title}
                </T>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {steps.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 4,
                        background: "rgba(0,0,0,0.25)",
                        fontFamily: "monospace",
                        fontSize: 14,
                        color: C.bright,
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <T color={lighter} bold size={15} center style={{ marginTop: 10 }}>
                  {total}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            How the model switches between thinking and answering
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            There is no "thinking mode switch" in the code. The vocabulary has two special tokens: &lt;think&gt; and
            &lt;/think&gt;. The model learned to emit them at the right moments, same way it learned any other word.
            The softmax output is a probability distribution over all tokens, and the special tokens simply win at the
            right moments.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                caption: "After 'User: What is 23 x 47? Assistant:'",
                rows: [
                  { token: "<think>", prob: 0.87, winner: true },
                  { token: "1081", prob: 0.03 },
                  { token: "The", prob: 0.02 },
                ],
              },
              {
                caption: "Inside thinking, after '... = 1081 OK'",
                rows: [
                  { token: "</think>", prob: 0.62, winner: true },
                  { token: "Let", prob: 0.09 },
                  { token: "Also", prob: 0.07 },
                ],
              },
            ].map(({ caption, rows }, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  {caption}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {rows.map((r) => (
                    <div
                      key={r.token}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr 60px",
                        gap: 10,
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: 4,
                        background: r.winner ? `${C.green}06` : "rgba(0,0,0,0.2)",
                      }}
                    >
                      <T color={r.winner ? C.green : C.bright} bold={r.winner} size={15} style={{ fontFamily: "monospace" }}>
                        {r.token}
                      </T>
                      <div style={{ height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${r.prob * 100}%`,
                            height: "100%",
                            background: r.winner ? C.green : C.mid,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <T color={C.dim} size={14} style={{ textAlign: "right" }}>
                        {r.prob.toFixed(2)}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The model learned to emit &lt;think&gt; and &lt;/think&gt; at the right moments. That is the entire
            "mode" mechanism.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            More thinking tokens = better answers on hard problems
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            This is the new scaling axis. Instead of training a bigger model, you let the same model think longer.
            More thinking tokens means more forward passes, which means more compute spent on the problem.
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
            <T color={C.dim} size={14} center>
              Representative accuracy on hard math vs thinking budget
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { budget: "100 tokens", pct: 30 },
                { budget: "1,000 tokens", pct: 55 },
                { budget: "10,000 tokens", pct: 78 },
                { budget: "100,000 tokens", pct: 89 },
              ].map(({ budget, pct }) => (
                <div key={budget} style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", gap: 10, alignItems: "center" }}>
                  <T color={C.bright} size={15} style={{ fontFamily: "monospace" }}>
                    {budget}
                  </T>
                  <div style={{ height: 16, background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: C.orange, borderRadius: 4 }} />
                  </div>
                  <T color={C.orange} bold size={16} style={{ textAlign: "right" }}>
                    {pct}%
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ffcc80" style={{ marginTop: 10 }}>
            For decades, better AI meant a bigger model. Reasoning models added a second knob: spend more compute at
            inference time instead. This is called <strong>test-time compute</strong> scaling.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            (Numbers above are representative of trends across o1/o3/DeepSeek-R1 benchmarks, not a single published
            result.)
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            What is actually different is the training, not the model
          </T>
          <T color="#f0a0ff" style={{ marginTop: 8 }}>
            Reasoning models go through three training stages. Stage 1 is the same run that every LLM gets. Stages 2
            and 3 are where reasoning emerges.
          </T>
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "stretch" }}>
            {[
              {
                stage: "1. Pre-training",
                body: "Predict the next token on trillions of internet tokens.",
                scale: "trillions of tokens",
                color: C.dim,
                highlight: false,
              },
              {
                stage: "2. SFT",
                body: "Fine-tune on curated reasoning traces with <think> tags.",
                scale: "~50K curated examples",
                color: C.orange,
                highlight: false,
              },
              {
                stage: "3. RL with verifier",
                body: "Generate rollouts, reward correct final answers, PPO/GRPO update.",
                scale: "millions of rollouts",
                color: C.pink,
                highlight: true,
              },
            ].map(({ stage, body, scale, color, highlight }, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: highlight ? `${color}10` : `${color}06`,
                  border: `1px solid ${color}${highlight ? "25" : "12"}`,
                }}
              >
                <T color={color} bold center size={17}>
                  {stage}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 8 }}>
                  {body}
                </T>
                <T color={C.dim} size={13} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                  {scale}
                </T>
              </div>
            ))}
          </div>
          <T color="#f0a0ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Stage 1 is identical to a regular LLM. The magic is entirely in stages 2 and 3.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            How reasoning improves, one reward at a time
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The model generates many rollouts per problem. A verifier checks each final answer. PPO or GRPO nudges
            weights: tokens in winning rollouts become more likely, tokens in losing rollouts less likely.
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
            <T color={C.bright} bold size={15} center>
              Problem: "23 x 47 = ?" (ground truth 1081). Generate 64 rollouts.
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { n: 1, chain: "... 23 x 50 - 23 x 3 = 1081", answer: "1081", ok: true },
                { n: 2, chain: "... (20 + 3) x 47 = 940 + 141 = 1081", answer: "1081", ok: true },
                { n: 3, chain: "... estimate: roughly 1000", answer: "1000", ok: false },
                { n: 4, chain: "... 23 x 47 = 1081", answer: "1081", ok: true },
                { n: 5, chain: "... quick mental math: 1104?", answer: "1104", ok: false },
              ].map(({ n, chain, answer, ok }) => (
                <div
                  key={n}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 80px 70px",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 4,
                    background: ok ? `${C.green}08` : `${C.red}08`,
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  <T color={C.dim} size={13}>
                    #{n}
                  </T>
                  <T color={C.bright} size={13}>
                    &lt;think&gt;{chain}&lt;/think&gt;
                  </T>
                  <T color={ok ? C.green : C.red} bold size={13}>
                    {answer} {ok ? "OK" : "X"}
                  </T>
                  <T color={ok ? C.green : C.red} bold size={13}>
                    r = {ok ? "+1" : "-1"}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.bright} size={14} center style={{ marginTop: 10, fontFamily: "monospace" }}>
              PPO / GRPO update:
              <br />
              winning rollouts -&gt; token probabilities UP
              <br />
              losing rollouts&nbsp; -&gt; token probabilities DOWN
            </T>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The reward only checks the FINAL answer. The model figures out on its own what kinds of reasoning lead to
            correct answers. Nobody hand-labels reasoning steps.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            You do not need humans to write millions of reasoning traces
          </T>
          <T color="#80c8ff" style={{ marginTop: 8 }}>
            The only thing you need is <strong>problems with checkable answers</strong>. Three data sources take care
            of the rest.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                title: "1. Existing chain-of-thought",
                body: "Already in the pre-training data: math textbooks, Stack Overflow answers, competitive programming editorials, tutorial posts.",
              },
              {
                title: "2. Synthetic generation",
                body: "A big LLM generates 64 reasoning attempts per problem. A verifier checks each final answer. Keep the ones that got it right; those become training data.",
              },
              {
                title: "3. Rejection sampling",
                body: "Have the base model itself try each problem 64 times. Keep the attempts that got the right answer. The model learns from its own best work.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                }}
              >
                <T color={C.blue} bold size={16}>
                  {title}
                </T>
                <T color={C.bright} size={15} style={{ marginTop: 4 }}>
                  {body}
                </T>
              </div>
            ))}
          </div>
          <T color="#80c8ff" style={{ marginTop: 10 }}>
            Domains with checkable answers are abundant: GSM8K, MATH, AIME, olympiad problems, LeetCode, Codeforces,
            scientific multiple-choice. Millions of problems, no humans writing reasoning required.
          </T>
        </Box>
      </Reveal>
      {sub < 9 && (
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
