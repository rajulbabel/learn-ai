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

export const Thinking = () => (
  <Box color={C.cyan} style={{ width: "100%" }}>
    <T color={C.cyan} bold center size={20}>
      Placeholder - implemented in later tasks
    </T>
  </Box>
);
