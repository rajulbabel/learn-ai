import { C } from "../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../components.jsx";

// ── 8.1 Add & Norm - The Stabilizer ──
export const AddNorm = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* Sub 0: Where does Add & Norm sit? - Block overview diagram */}
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color="#90caf9" bold center size={20}>Inside one Transformer block, there are 4 steps:</T>
        <T color="#90caf9" size={16} center style={{ marginTop: 4 }}>Now let's zoom out and see what happens after attention inside a single Transformer block.</T>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {[
            { label: "Input Embeddings", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
            { label: "arrow" },
            { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
            { label: "arrow" },
            { label: "Add & Norm", color: C.blue, bg: `${C.blue}18`, highlight: true },
            { label: "arrow" },
            { label: "FFN (Feed-Forward Network)", color: C.orange, bg: `${C.orange}10`, highlight: false },
            { label: "arrow" },
            { label: "Add & Norm", color: C.blue, bg: `${C.blue}18`, highlight: true },
            { label: "arrow" },
            { label: "Output", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
          ].map((item, i) =>
            item.label === "arrow" ? (
              <div key={i} style={{ fontSize: 18, color: C.dim, lineHeight: 1 }}>↓</div>
            ) : (
              <div key={i} style={{
                padding: "8px 24px", borderRadius: 8, width: "80%", textAlign: "center",
                background: item.bg,
                border: item.highlight ? `2px solid ${item.color}55` : `1px solid ${item.color}20`,
                boxShadow: item.highlight ? `0 0 12px ${item.color}20` : "none",
              }}>
                <T color={item.color} bold={item.highlight} center size={item.highlight ? 17 : 15}>{item.label}</T>
              </div>
            )
          )}
        </div>
        <T color="#90caf9" size={15} center style={{ marginTop: 12 }}>Notice: Add & Norm appears <strong>twice</strong> in every block - once after Attention, once after FFN. It's the stabilizer that keeps everything in check.</T>
      </Box>
    )}
    {sub === 0 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 1: The Problem - Why we need residual connections */}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>The Problem: Values Drift in Deep Networks</T>
      <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>GPT-3 has 96 layers. Each layer multiplies values by weights (we learned this in chapters 1.4-1.6). The result depends on the weights - if they're slightly below 1.0, values shrink. If slightly above, values explode. Keeping them perfectly balanced across 96 layers is nearly impossible.</T>

      <T color="#ef9a9a" bold center size={16} style={{ marginTop: 14 }}>Take 0.7 from "cats" embedding. Two scenarios:</T>
      <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <T color={C.red} bold center size={14}>If weights average 0.9 (shrink)</T>
          {[
            { layer: "Start", val: "0.7", pct: 70, clr: C.green },
            { layer: "Layer 10", val: "0.24", pct: 24, clr: C.yellow },
            { layer: "Layer 50", val: "0.004", pct: 2, clr: C.red },
            { layer: "Layer 96", val: "0.00003", pct: 0.5, clr: C.red },
          ].map(({ layer, val, pct, clr }) => (
            <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.dim, fontSize: 12, minWidth: 55, textAlign: "right" }}>{layer}</span>
              <div style={{ flex: 1, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ width: `${Math.max(pct, 1)}%`, height: "100%", borderRadius: 3, background: clr, opacity: 0.7 }} />
              </div>
              <code style={{ color: clr, fontSize: 12, minWidth: 50, textAlign: "right" }}>{val}</code>
            </div>
          ))}
          <T color={C.dim} center size={12} style={{ marginTop: 2 }}>Value vanishes to nearly zero</T>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <T color={C.orange} bold center size={14}>If weights average 1.1 (grow)</T>
          {[
            { layer: "Start", val: "0.7", pct: 7, clr: C.green },
            { layer: "Layer 10", val: "1.8", pct: 18, clr: C.yellow },
            { layer: "Layer 50", val: "82", pct: 82, clr: C.orange },
            { layer: "Layer 96", val: "4,838", pct: 100, clr: C.red },
          ].map(({ layer, val, pct, clr }) => (
            <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.dim, fontSize: 12, minWidth: 55, textAlign: "right" }}>{layer}</span>
              <div style={{ flex: 1, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ width: `${Math.max(pct, 1)}%`, height: "100%", borderRadius: 3, background: clr, opacity: 0.7 }} />
              </div>
              <code style={{ color: clr, fontSize: 12, minWidth: 50, textAlign: "right" }}>{val}</code>
            </div>
          ))}
          <T color={C.dim} center size={12} style={{ marginTop: 2 }}>Value explodes to thousands</T>
        </div>
      </div>

      <T color="#ef9a9a" bold center size={16} style={{ marginTop: 12 }}>Both are <Tag color={C.red}>broken</Tag>. Whether the value goes to 0.00003 or 4,838 - it's no longer a useful embedding. And gradients during backpropagation (chapter 1.9) drift the same way, so the model can't learn either.</T>
    </Box></Reveal>
    {sub === 1 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 2: The Add - Residual Connection */}
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#a5d6a7" bold center size={20}>The "Add" - Keep the Original</T>
      <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>The fix is beautifully simple: <strong>add the original input back to the output.</strong> That's it. The fancy name for this is "residual connection" - "residual" just means "leftover." You're keeping the leftover original so it never gets lost.</T>

      <div data-residual="true" style={{ marginTop: 14, padding: 16, borderRadius: 10, background: "rgba(0,230,118,0.04)", border: `1px solid ${C.green}20` }}>
        <T color="#a5d6a7" bold center size={16}>How it works for "cats" (embedding = [-0.5, 0.3, 0.7, 0.6]):</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Step 1: Input goes through attention */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag color={C.cyan}>original input</Tag>
            <code style={{ color: C.cyan, fontSize: 15 }}>[-0.5, 0.3, 0.7, 0.6]</code>
          </div>
          <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↓ goes through Multi-Head Attention ↓</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag color={C.pink}>attention output</Tag>
            <code style={{ color: C.pink, fontSize: 15 }}>[0.3, -0.1, 0.2, 0.4]</code>
          </div>
          <div style={{ marginTop: 6, padding: 10, borderRadius: 8, background: `${C.green}10`, border: `1px dashed ${C.green}30` }}>
            <T color="#a5d6a7" bold center size={16}>The Add Step: original + attention output</T>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <code style={{ color: C.cyan, fontSize: 15 }}>[-0.5, 0.3, 0.7, 0.6]</code>
              <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>+</span>
              <code style={{ color: C.pink, fontSize: 15 }}>[0.3, -0.1, 0.2, 0.4]</code>
              <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>=</span>
              <code style={{ color: C.green, fontSize: 15, fontWeight: 700 }}>[-0.2, 0.2, 0.9, 1.0]</code>
            </div>
          </div>
        </div>
      </div>

      <T color="#a5d6a7" size={16} style={{ marginTop: 12 }}>Think of it as a <strong>highway</strong>: even if the attention layer learns nothing useful, the original embedding still passes through untouched. During backpropagation (chapter 1.9), the error can travel backward along this highway without shrinking to zero.</T>

      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, background: `${C.red}08`, border: `1px solid ${C.red}20` }}>
          <T color={C.red} bold center size={14}>Without the Add</T>
          <T color={C.dim} center size={13} style={{ marginTop: 4 }}>Input → Attention → Output</T>
          <T color={C.dim} center size={13}>If attention messes up, values are lost</T>
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
          <T color={C.green} bold center size={14}>With the Add</T>
          <T color={C.dim} center size={13} style={{ marginTop: 4 }}>Input → Attention → Output + Input</T>
          <T color={C.dim} center size={13}>Original values always survive</T>
        </div>
      </div>
    </Box></Reveal>
    {sub === 2 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 3: The Norm - Layer Normalization step by step with full formula */}
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The "Norm" - Layer Normalization</T>
      <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>After adding, values can drift to unpredictable ranges. Layer Norm rescales them to a stable range. Here is the actual formula used in every Transformer:</T>

      {/* The real formula - styled like attention formula (7.8) */}
      <div style={{ margin: "12px 0", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.purple}25`, width: "100%", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", textAlign: "center" }}>
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>The Layer Normalization Formula</T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ color: C.purple, fontWeight: 800, fontSize: 20 }}>LayerNorm(x<sub style={{ fontSize: 14 }}>i</sub>) =</span>
            <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>&gamma;</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
              <span style={{ color: C.cyan, fontWeight: 700, fontSize: 17, borderBottom: `2px solid ${C.dim}`, paddingBottom: 3 }}>x<sub>i</sub> - <span style={{ color: C.blue }}>&mu;</span></span>
              <span style={{ color: C.orange, fontWeight: 700, fontSize: 17, paddingTop: 3 }}>&radic;(<span style={{ color: C.orange }}>&sigma;</span><sup>2</sup> + <span style={{ color: C.red }}>&epsilon;</span>)</span>
            </span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
            <span style={{ color: C.yellow, fontWeight: 800, fontSize: 20 }}>&beta;</span>
          </div>
        </div>
        <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { sym: <span>x<sub>i</sub></span>, desc: "each value in the vector", why: "the raw input we want to normalize", color: C.cyan },
              { sym: "\u03BC (mu)", desc: "average of all values", why: "centers the data around zero", color: C.blue },
              { sym: "\u03C3\u00B2 (sigma squared)", desc: "variance of all values", why: "measures how spread out values are", color: C.orange },
              { sym: "\u03B5 (epsilon)", desc: "tiny number (1e-5)", why: "prevents division by zero if all values are identical", color: C.red },
              { sym: "\u03B3 (gamma)", desc: "learnable scale (starts at 1.0)", why: "lets the model stretch or shrink the range", color: C.green },
              { sym: "\u03B2 (beta)", desc: "learnable shift (starts at 0.0)", why: "lets the model move the center up or down", color: C.yellow },
            ].map((p, i) => (
              <div key={i} style={{ background: `${p.color}08`, borderRadius: 6, padding: "6px 10px", border: `1px solid ${p.color}15` }}>
                <T color={p.color} bold size={13}>{p.sym}</T>
                <T color={C.dim} size={12}> = {p.desc}</T>
                <div><T color={p.color} size={11} style={{ opacity: 0.7 }}>{p.why}</T></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <T color="#b8a9ff" size={15} style={{ marginTop: 4 }}>gamma and beta are <strong>learned during training</strong> - they let the model undo the normalization if needed. Let's compute it step by step with real numbers:</T>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "rgba(167,139,250,0.04)", border: `1px solid ${C.purple}20` }}>
        <T color="#b8a9ff" bold center size={16}>Normalizing [-0.2, 0.2, 0.9, 1.0] (the result from Add)</T>

        {/* Step 1: Mean */}
        <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: `${C.blue}08` }}>
          <T color={C.blue} bold size={15}>Step 1: Compute the mean (mu)</T>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <T color={C.dim} size={14}>mu = (-0.2 + 0.2 + 0.9 + 1.0) / 4 =</T>
            <Tag color={C.blue}>0.475</Tag>
          </div>
        </div>

        {/* Step 2: Subtract mean */}
        <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.orange}08` }}>
          <T color={C.orange} bold size={15}>Step 2: subtract the mean from each value (x<sub>i</sub> - mu)</T>
          <pre style={{ marginTop: 6, fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, textAlign: "center", margin: "6px 0 0 0", padding: 0, background: "none", border: "none", overflow: "visible" }}>{
[
  ["-0.2 - 0.475", "-0.675"],
  [" 0.2 - 0.475", "-0.275"],
  [" 0.9 - 0.475", " 0.425"],
  [" 1.0 - 0.475", " 0.525"],
].map(([l, r]) => <span key={l}><span style={{ color: C.dim }}>{l}</span><span style={{ color: C.dim }}> = </span><span style={{ color: C.orange, fontWeight: 600 }}>{r}</span>{"\n"}</span>)
          }</pre>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>Centered: [-0.675, -0.275, 0.425, 0.525]</T>
        </div>

        {/* Step 3: Variance and divide by sqrt(variance + epsilon) */}
        <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.green}08` }}>
          <T color={C.green} bold size={15}>Step 3: Compute variance, then divide by sqrt({"\u03C3\u00B2"} + {"\u03B5"})</T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>variance = mean of squared deviations: (0.675 squared + 0.275 squared + 0.425 squared + 0.525 squared) / 4 = 0.2856</T>
          <T color={C.dim} size={13}>sqrt(0.2856 + 0.00001) = 0.5344 (epsilon = 1e-5 prevents division by zero if all values were identical)</T>
          <pre style={{ marginTop: 6, fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, textAlign: "center", margin: "6px 0 0 0", padding: 0, background: "none", border: "none", overflow: "visible" }}>{
[
  ["-0.675 / 0.5344", "-1.26"],
  ["-0.275 / 0.5344", "-0.51"],
  [" 0.425 / 0.5344", " 0.80"],
  [" 0.525 / 0.5344", " 0.98"],
].map(([l, r]) => <span key={l}><span style={{ color: C.dim }}>{l}</span><span style={{ color: C.dim }}> = </span><span style={{ color: C.green, fontWeight: 600 }}>{r}</span>{"\n"}</span>)
          }</pre>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>After this step: [-1.26, -0.51, 0.80, 0.98] - centered at 0, unit variance.</T>
        </div>

        {/* Step 4: Scale by gamma + shift by beta */}
        <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.yellow}08` }}>
          <T color={C.yellow} bold size={15}>Step 4: Scale by gamma, shift by beta</T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>gamma and beta are <strong>per-dimension learnable parameters</strong>. Initially gamma=1.0 and beta=0.0, so at first this step does nothing. During training, the model learns optimal values.</T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>With initial gamma=1.0, beta=0.0:</T>
          <pre style={{ marginTop: 4, fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, textAlign: "center", margin: "4px 0 0 0", padding: 0, background: "none", border: "none", overflow: "visible" }}>{
[
  ["1.0", "-1.26", "0.0", "-1.26"],
  ["1.0", "-0.51", "0.0", "-0.51"],
  ["1.0", " 0.80", "0.0", " 0.80"],
  ["1.0", " 0.98", "0.0", " 0.98"],
].map(([g, n, b, f]) => <span key={n}><span style={{ color: C.dim }}>{g} x {n} + {b}</span><span style={{ color: C.dim }}> = </span><span style={{ color: C.yellow, fontWeight: 600 }}>{f}</span>{"\n"}</span>)
          }</pre>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>Why have gamma and beta if they start as identity? Because during training, the model may learn that some dimensions need more spread (gamma {'>'} 1) or a non-zero center (beta != 0). Without them, normalization would be too rigid.</T>
        </div>

        <div style={{ marginTop: 8, padding: 8, borderRadius: 6, background: `${C.purple}10`, border: `1px dashed ${C.purple}30` }}>
          <T color="#b8a9ff" bold center size={15}>Final output: [-1.26, -0.51, 0.80, 0.98]</T>
          <T color={C.dim} center size={13} style={{ marginTop: 2 }}>Values centered around 0 with controlled spread. Gamma and beta will adjust these during training to whatever the model needs.</T>
        </div>
      </div>
    </Box></Reveal>
    {sub === 3 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 4: Full pipeline visualization with numbers flowing through */}
    <Reveal when={sub >= 4}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>The Complete Add & Norm Pipeline</T>
      <T color="#80deea" size={16} center style={{ marginTop: 4 }}>Watch "cats" flow through the entire Add & Norm after Attention:</T>

      <div data-pipeline="true" style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {[
          { step: "Input (cats embedding)", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.cyan, tag: "Input" },
          { step: "arrow", label: "goes into Attention" },
          { step: "Attention Output", val: "[0.3, -0.1, 0.2, 0.4]", color: C.pink, tag: "Attention" },
          { step: "arrow", label: "Add: input + output" },
          { step: "After Add", val: "[-0.2, 0.2, 0.9, 1.0]", color: C.green, tag: "Add" },
          { step: "arrow", label: "Normalize" },
          { step: "After Norm", val: "[-1.26, -0.52, 0.80, 0.98]", color: C.purple, tag: "Norm" },
          { step: "arrow", label: "ready for FFN" },
          { step: "To FFN", val: "[-1.26, -0.52, 0.80, 0.98]", color: C.orange, tag: "Next" },
        ].map((item, i) =>
          item.step === "arrow" ? (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
              <span style={{ fontSize: 14, color: C.dim }}>{item.label}</span>
              <span style={{ fontSize: 16, color: C.dim }}>↓</span>
            </div>
          ) : (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
              borderRadius: 8, width: "90%", background: `${item.color}08`, border: `1px solid ${item.color}20`,
            }}>
              <Tag color={item.color}>{item.tag}</Tag>
              <T color={item.color} size={14} bold>{item.step}</T>
              <code style={{ color: `${item.color}bb`, fontSize: 14, marginLeft: "auto" }}>{item.val}</code>
            </div>
          )
        )}
      </div>

      <T color="#80deea" size={15} center style={{ marginTop: 12 }}>This exact same Add & Norm happens again after FFN. Every Transformer block does this twice - once after Attention, once after FFN.</T>
    </Box></Reveal>
    {sub === 4 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 5: Why it matters - with vs without */}
    <Reveal when={sub >= 5}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#fff176" bold center size={20}>Why It Matters - The Big Picture</T>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: 14, borderRadius: 10, background: `${C.red}08`, border: `1px solid ${C.red}25` }}>
          <T color={C.red} bold center size={16}>Without Add & Norm</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { l: "Layer 1", v: "0.7", w: 70 },
              { l: "Layer 10", v: "0.24", w: 24 },
              { l: "Layer 50", v: "0.004", w: 2 },
              { l: "Layer 96", v: "~0", w: 0.5 },
            ].map(({ l, v, w }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 12, minWidth: 60 }}>{l}</span>
                <div style={{ flex: 1, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ width: `${Math.max(w, 1)}%`, height: "100%", borderRadius: 3, background: C.red, opacity: 0.6 }} />
                </div>
                <code style={{ color: C.red, fontSize: 11, minWidth: 30 }}>{v}</code>
              </div>
            ))}
          </div>
          <T color={C.dim} center size={13} style={{ marginTop: 8 }}>Values drift to extremes. Model stops learning.</T>
        </div>

        <div style={{ flex: 1, padding: 14, borderRadius: 10, background: `${C.green}08`, border: `1px solid ${C.green}25` }}>
          <T color={C.green} bold center size={16}>With Add & Norm</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { l: "Layer 1", v: 0.7, w: 100 },
              { l: "Layer 10", v: 0.67, w: 95 },
              { l: "Layer 50", v: 0.62, w: 88 },
              { l: "Layer 96", v: 0.57, w: 82 },
            ].map(({ l, v, w }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 12, minWidth: 60 }}>{l}</span>
                <div style={{ flex: 1, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ width: `${Math.max(w, 1)}%`, height: "100%", borderRadius: 3, background: C.green, opacity: 0.6 }} />
                </div>
                <code style={{ color: C.green, fontSize: 11, minWidth: 30 }}>{v}</code>
              </div>
            ))}
          </div>
          <T color={C.dim} center size={13} style={{ marginTop: 8 }}>Values stay <strong style={{ color: C.green }}>stable</strong>. Gradients flow. Training works even at 96 layers deep.</T>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color="#fff176" bold center size={16}>In one sentence:</T>
        <T color="#fff176" center size={16} style={{ marginTop: 4 }}>Add & Norm is the reason Transformers can be 96 layers deep without losing information. The "Add" preserves the original values, and the "Norm" keeps them in a stable range for the next layer.</T>
      </div>
    </Box></Reveal>
  </div>
); };

// ── 8.2 FFN - The Feed-Forward Network ──
export const FeedForwardNetwork = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* Sub 0: Where FFN sits in the block */}
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffcc80" bold center size={20}>Where Does the Feed-Forward Network Sit?</T>
        <T color="#ffcc80" size={16} center style={{ marginTop: 4 }}>In chapter 8.1 we covered Add & Norm after Attention. Now let's zoom into the next step.</T>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {[
            { label: "Input Embeddings", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
            { label: "arrow" },
            { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
            { label: "arrow" },
            { label: "Add & Norm", color: C.blue, bg: `${C.blue}10`, highlight: false },
            { label: "arrow" },
            { label: "FFN (Feed-Forward Network)", color: C.orange, bg: `${C.orange}18`, highlight: true },
            { label: "arrow" },
            { label: "Add & Norm", color: C.blue, bg: `${C.blue}10`, highlight: false },
            { label: "arrow" },
            { label: "Output", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
          ].map((item, i) =>
            item.label === "arrow" ? (
              <div key={i} style={{ fontSize: 18, color: C.dim, lineHeight: 1 }}>↓</div>
            ) : (
              <div key={i} style={{
                padding: "8px 24px", borderRadius: 8, width: "80%", textAlign: "center",
                background: item.bg,
                border: item.highlight ? `2px solid ${item.color}55` : `1px solid ${item.color}20`,
                boxShadow: item.highlight ? `0 0 12px ${item.color}20` : "none",
              }}>
                <T color={item.color} bold={item.highlight} center size={item.highlight ? 17 : 15}>{item.label}</T>
              </div>
            )
          )}
        </div>
        <T color="#ffcc80" size={15} center style={{ marginTop: 12 }}>The FFN sits between the two Add & Norm layers. It processes each token <strong>independently</strong> - no communication between words here. That's what makes it different from Attention.</T>
      </Box>
    )}
    {sub === 0 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 1: What FFN actually is - a 2-layer NN */}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>FFN = Two Linear Layers with Activation</T>
      <T color="#80deea" size={16} style={{ marginTop: 6 }}>You already know what a layer does (chapter 1.19): multiply by a weight matrix W, add bias b. The FFN is just <strong>two</strong> of those layers stacked, with an activation function in between.</T>

      {/* The formula */}
      <div style={{ margin: "14px 0", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.cyan}25`, width: "100%", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", textAlign: "center" }}>
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>The FFN Formula</T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ color: C.orange, fontWeight: 800, fontSize: 20 }}>FFN(x)</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>=</span>
            <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>W<sub>2</sub></span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
            <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18 }}>GELU(</span>
            <span style={{ color: C.pink, fontWeight: 800, fontSize: 18 }}>W<sub>1</sub></span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
            <span style={{ color: C.cyan, fontWeight: 800, fontSize: 18 }}>x</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
            <span style={{ color: C.pink, fontWeight: 800, fontSize: 18 }}>b<sub>1</sub></span>
            <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18 }}>)</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
            <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>b<sub>2</sub></span>
          </div>
        </div>
        <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { sym: "x", desc: "input from Add & Norm", color: C.cyan },
              { sym: <span>W<sub>1</sub>, b<sub>1</sub></span>, desc: "first layer weights & bias", color: C.pink },
              { sym: "GELU", desc: "activation function", color: C.yellow },
              { sym: <span>W<sub>2</sub>, b<sub>2</sub></span>, desc: "second layer weights & bias", color: C.green },
            ].map((p, i) => (
              <div key={i} style={{ background: `${p.color}08`, borderRadius: 6, padding: "6px 10px", border: `1px solid ${p.color}15` }}>
                <T color={p.color} bold size={13}>{p.sym}</T>
                <T color={C.dim} size={12}> = {p.desc}</T>
              </div>
            ))}
          </div>
        </div>
      </div>

      <T color="#80deea" size={15} style={{ marginTop: 4 }}>That's it. No attention, no softmax, no multi-head anything. Just two matrix multiplies with an activation in between - the same building blocks from Section 1.</T>
    </Box></Reveal>
    {sub === 1 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 2: The expand-then-compress shape */}
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The Expand-Then-Compress Shape</T>
      <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>Here's the interesting part: the first layer <strong>expands</strong> the dimension, and the second layer <strong>compresses</strong> it back. In GPT-2 (d_model = 512):</T>

      {/* NN Diagram - same pattern as Chapter 2.8
           Layout math (all verified, no collisions):
           - viewBox: 500 wide, 240 tall
           - Top labels: y=15 (title), y=27 (subtitle)
           - Node zone: y=55 to y=195 (140px)
           - 3 input nodes at y=55,125,195 (70px apart, R=15, diameter=30, gap=40px - safe)
           - 4 hidden nodes at y=55,100,150,195 (not uniform - shows "more" with gap)
           - 3 output nodes at y=55,125,195
           - Bottom label: y=225 (30px below last node)
           - W boxes: centered vertically at y=100, well between node connections */}
      <div style={{ marginTop: 16, padding: "10px 0", overflowX: "auto" }}>
        {(() => {
          const XI = 70, XH = 250, XO = 430, R = 15;
          const iY = [55, 125, 195];
          const hY = [55, 102, 148, 195];
          const oY = [55, 125, 195];
          return (
          <svg viewBox="0 0 500 240" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>

            {/* === Edges first (behind everything) === */}
            {iY.map(a => hY.map(b => <line key={`ih${a}${b}`} x1={XI+R+2} y1={a} x2={XH-R-2} y2={b} stroke={`${C.pink}12`} strokeWidth={1} />))}
            {hY.map(a => oY.map(b => <line key={`ho${a}${b}`} x1={XH+R+2} y1={a} x2={XO-R-2} y2={b} stroke={`${C.green}12`} strokeWidth={1} />))}

            {/* === Column labels (top, 30px above first node) === */}
            <text x={XI} y={18} fill={C.cyan} fontSize={11} textAnchor="middle" fontWeight={700}>Input (512)</text>
            <text x={XH} y={18} fill={C.yellow} fontSize={11} textAnchor="middle" fontWeight={700}>Hidden (2048)</text>
            <text x={XO} y={18} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>Output (512)</text>

            {/* === W1 box (centered between Input and Hidden columns, vertically at midpoint) === */}
            <rect x={(XI+XH)/2-28} y={105} width={56} height={36} rx={8} fill={`${C.pink}12`} stroke={C.pink} strokeWidth={1.5} />
            <text x={(XI+XH)/2} y={121} fill={C.pink} fontSize={10} fontWeight={700} textAnchor="middle">W&#x2081;</text>
            <text x={(XI+XH)/2} y={134} fill={C.dim} fontSize={8} textAnchor="middle">512 x 2048</text>

            {/* === W2 box (centered between Hidden and Output columns) === */}
            <rect x={(XH+XO)/2-28} y={105} width={56} height={36} rx={8} fill={`${C.green}12`} stroke={C.green} strokeWidth={1.5} />
            <text x={(XH+XO)/2} y={121} fill={C.green} fontSize={10} fontWeight={700} textAnchor="middle">W&#x2082;</text>
            <text x={(XH+XO)/2} y={134} fill={C.dim} fontSize={8} textAnchor="middle">2048 x 512</text>

            {/* === Input neurons === */}
            {iY.map((y,i) => <g key={`i${i}`}><circle cx={XI} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} /><text x={XI} y={y+4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">{["x\u2081","x\u2082","x\u2083"][i]}</text></g>)}

            {/* === Hidden neurons (4 shown: h1, h2, h3, h2048) === */}
            {hY.map((y,i) => <g key={`h${i}`}><circle cx={XH} cy={y} r={R} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} /><text x={XH} y={y+4} fill={C.yellow} fontSize={i===3?7:10} fontWeight={700} textAnchor="middle">{["h\u2081","h\u2082","h\u2083","h\u2082\u2080\u2084\u2088"][i]}</text></g>)}

            {/* === Output neurons === */}
            {oY.map((y,i) => <g key={`o${i}`}><circle cx={XO} cy={y} r={R} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} /><text x={XO} y={y+4} fill={C.orange} fontSize={10} fontWeight={700} textAnchor="middle">{["y\u2081","y\u2082","y\u2083"][i]}</text></g>)}

            {/* === GELU + bottom note (well below last node at y=195) === */}
            <text x={XH} y={222} fill={C.green} fontSize={10} fontWeight={700} textAnchor="middle">+ GELU</text>
            <text x={250} y={236} fill="rgba(255,255,255,0.2)" fontSize={8} textAnchor="middle">3 of 512 input, 4 of 2048 hidden, 3 of 512 output shown</text>
          </svg>
          );
        })()}
      </div>

      <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>The hidden layer has <strong>4x more neurons</strong> than the input or output. Every input neuron connects to every hidden neuron (W<sub>1</sub>), GELU activates each hidden neuron, then every hidden neuron connects to every output neuron (W<sub>2</sub>). The data expands into a wider "thinking space" (512 → 2048), then compresses back (2048 → 512).</T>

      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}20` }}>
        <T color="#b8a9ff" bold center size={16}>Why 4x?</T>
        <T color="#b8a9ff" size={15} style={{ marginTop: 4 }}>Imagine solving a complex problem: you spread your notes across a big desk (expand to 2048), work things out, then summarize your answer on a small card (compress back to 512). The 4x ratio was found in the original "Attention is All You Need" paper and has become standard across GPT-2, GPT-3, and most Transformers.</T>
      </div>
    </Box></Reveal>
    {sub === 2 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 3: Step-by-step computation with real numbers */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#a5d6a7" bold center size={20}>Step-by-Step: FFN on "cats"</T>
      <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>Let's trace "cats" through the FFN. In chapter 8.1, Add & Norm output [-1.26, -0.51, 0.80, 0.98] for "cats". We'll use a tiny 4-dim version to show the real math (real models use 512 dims but the process is identical).</T>

      {/* Step 1: First linear layer */}
      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: `${C.pink}08`, border: `1px solid ${C.pink}20` }}>
        <T color={C.pink} bold size={16}>Step 1: Multiply by W<sub>1</sub> + b<sub>1</sub> (expand 4 → 8 dims)</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <code style={{ color: C.cyan, fontSize: 14 }}>[-1.26, -0.51, 0.80, 0.98]</code>
            <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>&middot;</span>
            <span style={{ color: C.pink, fontSize: 14 }}>W<sub>1</sub></span>
            <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>+</span>
            <span style={{ color: C.pink, fontSize: 14 }}>b<sub>1</sub></span>
          </div>
          <T color={C.dim} size={13}>Each of the 8 output values is a dot product of the input with one column of W<sub>1</sub>, plus a bias - exactly like chapter 1.19.</T>
          <div style={{ marginTop: 4, padding: 8, borderRadius: 6, background: `${C.pink}06`, width: "100%" }}>
            <T color={C.pink} bold center size={14}>Result (8 dims):</T>
            <code style={{ display: "block", textAlign: "center", color: C.pink, fontSize: 14, marginTop: 4 }}>[0.42, -1.80, 0.95, 2.10, -0.33, 1.47, -0.88, 0.61]</code>
          </div>
        </div>
      </div>

      {/* Step 2: GELU activation */}
      <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color={C.yellow} bold size={16}>Step 2: Apply GELU activation</T>
        <T color={C.dim} size={13} style={{ marginTop: 4 }}>GELU applies to each value independently - similar to ReLU (chapter 1.6) but smoother.</T>
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {[
            { inp: "0.42", out: "0.28", clr: C.green },
            { inp: "-1.80", out: "-0.04", clr: C.red },
            { inp: "0.95", out: "0.77", clr: C.green },
            { inp: "2.10", out: "2.07", clr: C.green },
            { inp: "-0.33", out: "-0.12", clr: C.red },
            { inp: "1.47", out: "1.37", clr: C.green },
            { inp: "-0.88", out: "-0.17", clr: C.red },
            { inp: "0.61", out: "0.44", clr: C.green },
          ].map(({ inp, out, clr }) => (
            <div key={inp} style={{ padding: "4px 8px", borderRadius: 4, background: `${clr}08`, border: `1px solid ${clr}15`, textAlign: "center" }}>
              <T color={C.dim} size={11}>{inp} →</T>
              <T color={clr} bold size={12}> {out}</T>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 6, padding: 6, borderRadius: 6, background: `${C.yellow}06` }}>
          <code style={{ display: "block", textAlign: "center", color: C.yellow, fontSize: 14 }}>[0.28, -0.04, 0.77, 2.07, -0.12, 1.37, -0.17, 0.44]</code>
        </div>
      </div>

      {/* Step 3: Second linear layer */}
      <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
        <T color={C.green} bold size={16}>Step 3: Multiply by W<sub>2</sub> + b<sub>2</sub> (compress 8 → 4 dims)</T>
        <T color={C.dim} size={13} style={{ marginTop: 4 }}>The 8-dim expanded vector gets compressed back to the original 4 dims.</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <code style={{ color: C.yellow, fontSize: 14 }}>[0.28, -0.04, ..., 0.44]</code>
            <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>&middot;</span>
            <span style={{ color: C.green, fontSize: 14 }}>W<sub>2</sub></span>
            <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>+</span>
            <span style={{ color: C.green, fontSize: 14 }}>b<sub>2</sub></span>
          </div>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.green}06`, width: "100%" }}>
            <T color={C.green} bold center size={14}>FFN output for "cats" (4 dims):</T>
            <code style={{ display: "block", textAlign: "center", color: C.green, fontSize: 15, fontWeight: 700, marginTop: 4 }}>[0.51, -0.73, 1.14, 0.22]</code>
          </div>
        </div>
      </div>

      <T color="#a5d6a7" size={15} center style={{ marginTop: 10 }}>Same size in, same size out - but the values have been transformed through a "thinking space" 4x wider. This output now goes to the second Add & Norm.</T>
    </Box></Reveal>
    {sub === 3 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 4: GELU - the real formula, then vs ReLU */}
    <Reveal when={sub >= 4}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#fff176" bold center size={20}>GELU - The Activation Function</T>
      <T color="#fff176" size={16} style={{ marginTop: 6 }}>In chapter 1.6 we learned ReLU. Modern Transformers use a smoother alternative called GELU (Gaussian Error Linear Unit). Here is the real formula:</T>

      {/* The GELU formula - styled like the attention formula in 7.8 */}
      <div style={{ margin: "14px 0", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.yellow}25`, width: "100%", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", textAlign: "center" }}>
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>The GELU Formula</T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ color: C.yellow, fontWeight: 800, fontSize: 20 }}>GELU(x)</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>=</span>
            <span style={{ color: C.cyan, fontWeight: 800, fontSize: 20 }}>x</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
            <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>&Phi;(x)</span>
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 8 }}>where &Phi;(x) is the cumulative distribution function of the standard normal distribution:</T>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>&Phi;(x)</span>
            <span style={{ color: C.dim, fontWeight: 800, fontSize: 18 }}>=</span>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
              <span style={{ color: C.dim, fontWeight: 700, fontSize: 16, borderBottom: `2px solid ${C.dim}`, paddingBottom: 3 }}>1</span>
              <span style={{ color: C.dim, fontWeight: 700, fontSize: 16, paddingTop: 3 }}>2</span>
            </span>
            <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>[</span>
            <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>1 + erf(</span>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
              <span style={{ color: C.cyan, fontWeight: 700, fontSize: 16, borderBottom: `2px solid ${C.dim}`, paddingBottom: 3 }}>x</span>
              <span style={{ color: C.dim, fontWeight: 700, fontSize: 16, paddingTop: 3 }}>&radic;2</span>
            </span>
            <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>)</span>
            <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>]</span>
          </div>
        </div>
        <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { sym: "x", desc: "the input value", why: "the raw number coming from the linear layer", color: C.cyan },
              { sym: "\u03A6(x)", desc: "probability x is \"kept\"", why: "ranges from 0 (fully blocked) to 1 (fully passed)", color: C.green },
              { sym: "erf", desc: "Gauss error function", why: "a smooth S-curve that maps any number to [-1, 1]", color: C.orange },
            ].map((p, i) => (
              <div key={i} style={{ background: `${p.color}08`, borderRadius: 6, padding: "6px 10px", border: `1px solid ${p.color}15` }}>
                <T color={p.color} bold size={13}>{p.sym}</T>
                <T color={C.dim} size={12}> = {p.desc}</T>
                <div><T color={p.color} size={11} style={{ opacity: 0.7 }}>{p.why}</T></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <T color="#fff176" size={15} style={{ marginTop: 4 }}>In plain English: GELU multiplies x by the <strong>probability</strong> that x would be considered "large" under a standard normal bell curve. Large positive numbers get through almost fully (&Phi; near 1). Large negative numbers get almost fully blocked (&Phi; near 0). Values near zero get <strong>partially</strong> passed - that's the smooth part.</T>

      {/* Worked example */}
      <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color="#fff176" bold center size={16}>Worked Examples</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { x: "2.0", phi: "0.977", result: "1.95", note: "Large positive: almost fully passed", clr: C.green },
            { x: "0.5", phi: "0.691", result: "0.35", note: "Small positive: 69% passed through", clr: C.green },
            { x: "0.0", phi: "0.500", result: "0.00", note: "Zero: exactly half of zero is zero", clr: C.dim },
            { x: "-0.5", phi: "0.309", result: "-0.15", note: "Small negative: 31% leaked through", clr: C.orange },
            { x: "-2.0", phi: "0.023", result: "-0.05", note: "Large negative: almost fully blocked", clr: C.red },
          ].map(({ x, phi, result, note, clr }) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6, background: `${clr}06`, border: `1px solid ${clr}12` }}>
              <code style={{ color: C.cyan, fontSize: 14, minWidth: 35, textAlign: "right" }}>{x}</code>
              <span style={{ color: C.dim, fontSize: 13 }}>&middot;</span>
              <code style={{ color: C.green, fontSize: 14, minWidth: 40 }}>{phi}</code>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <code style={{ color: clr, fontSize: 14, fontWeight: 700, minWidth: 40 }}>{result}</code>
              <T color={C.dim} size={12} style={{ marginLeft: 4 }}>{note}</T>
            </div>
          ))}
        </div>
      </div>

      {/* ReLU vs GELU comparison */}
      <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: 12, borderRadius: 10, background: `${C.red}08`, border: `1px solid ${C.red}25` }}>
          <T color={C.red} bold center size={15}>ReLU (chapter 1.6)</T>
          <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
            <div style={{ color: C.dim }}>if x {'<'} 0: output = <span style={{ color: C.red, fontWeight: 700 }}>0</span></div>
            <div style={{ color: C.dim }}>if x {'>'} 0: output = <span style={{ color: C.green, fontWeight: 700 }}>x</span></div>
          </div>
          <T color={C.dim} center size={12} style={{ marginTop: 6 }}>Hard cutoff. Negative = dead. Gradient = 0 forever.</T>
        </div>
        <div style={{ flex: 1, padding: 12, borderRadius: 10, background: `${C.green}08`, border: `1px solid ${C.green}25` }}>
          <T color={C.green} bold center size={15}>GELU (smooth)</T>
          <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
            <div style={{ color: C.dim }}>if x {'<'} 0: output = <span style={{ color: C.orange, fontWeight: 700 }}>small leak</span></div>
            <div style={{ color: C.dim }}>if x {'>'} 0: output = <span style={{ color: C.green, fontWeight: 700 }}>~x</span></div>
          </div>
          <T color={C.dim} center size={12} style={{ marginTop: 6 }}>Smooth transition. Small negatives leak through. Gradient never fully dies.</T>
        </div>
      </div>

      <T color="#fff176" size={14} style={{ marginTop: 10 }}>Why does the smooth curve matter? During backpropagation (chapter 1.15), ReLU's gradient is exactly 0 for all negative inputs - the neuron is "dead" and can never recover. GELU's smooth curve means even slightly negative values get a small gradient, so neurons can recover. GPT-2 and GPT-3 both use GELU.</T>
    </Box></Reveal>
    {sub === 4 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 5: Knowledge vs Routing intro + Example 1 */}
    <Reveal when={sub >= 5}><Box color={C.blue} style={{ width: "100%" }}>
      <T color="#90caf9" bold center size={20}>What FFN Stores - Knowledge vs Routing</T>
      <T color="#90caf9" size={16} style={{ marginTop: 6 }}>Attention and FFN play completely different roles. Think of it this way: attention decides <strong>which words to listen to</strong>, FFN decides <strong>what to do with what it heard</strong>.</T>

      <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}15` }}>
        <T color={C.yellow} bold center size={13}>Remember: inside every block, Attention runs first, then FFN</T>
        <T color={C.dim} center size={12}>FFN never sees the raw input - it always receives attention's output. Attention gathers context from other words. Then FFN transforms that context-enriched vector.</T>
      </div>

      {/* Example 1: Area/Length/Breadth - implicit knowledge */}
      <T color="#90caf9" bold center size={16} style={{ marginTop: 14 }}>Example 1: "The area of this rectangle depends on its length"</T>
      <T color={C.dim} center size={12} style={{ marginTop: 2 }}>Notice: "breadth" is never mentioned - but the model knows it matters</T>
      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: `${C.pink}06`, border: `1px solid ${C.pink}20` }}>
          <T color={C.pink} bold center size={15}>Attention Runs First</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Q &middot; K scores for "area"</T>
              <T color={C.dim} size={12}>"area"'s Query asks "what determines me?" "length"'s Key scores high (0.55 after softmax) - they're clearly related. "rectangle"'s Key also matches (0.30) - it tells area what shape we're talking about.</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Weighted sum of Values</T>
              <T color={C.dim} size={12}>Output = 0.55 &middot; V<sub>length</sub> + 0.30 &middot; V<sub>rectangle</sub> + ... The "area" vector now carries: "I'm the area of a rectangle and length is involved."</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Result: context assembled, but incomplete</T>
              <T color={C.dim} size={12}>Attention found real connections between words <strong>that exist in the input</strong>. But "breadth" is not in the sentence. Attention can only mix what's there - it cannot add knowledge that's missing from the text.</T>
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}>
          <T color={C.orange} bold center size={15}>Then FFN Adds Stored Knowledge</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>W<sub>1</sub>: "rectangle-area" detector fires</T>
              <T color={C.dim} size={12}>FFN receives the attention-enriched "area" vector (which already encodes "rectangle + length"). Row 1203 of W<sub>1</sub> was trained on millions of math texts - it detects "area of a rectangle with length mentioned." Dot product: <code style={{ color: C.orange }}>W<sub>1</sub>[1203] &middot; x = 3.9</code></T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>GELU activates the right knowledge</T>
              <T color={C.dim} size={12}>GELU(3.9) = 3.89 → neuron 1203 fires strongly. Meanwhile, neuron 502 ("circle-area-pi") got -0.8 → GELU suppresses it. The network knows this is a rectangle, not a circle.</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>W<sub>2</sub>: pushes "area" toward breadth-aware region</T>
              <T color={C.dim} size={12}>Column 1203 of W<sub>2</sub> shifts the vector into a region of embedding space that encodes "area = length x breadth, breadth is the missing factor." The model now <strong>implicitly knows breadth matters</strong> - even though the word never appeared in the input.</T>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: `${C.orange}10` }}>
            <T color={C.orange} bold size={12}>This is what "stored knowledge" means</T>
            <T color={C.dim} size={11}>During training, the FFN saw "area = length x breadth" thousands of times. That relationship got baked into W<sub>1</sub> row 1203 (detector) and W<sub>2</sub> column 1203 (output). Attention found the words in the sentence. FFN added what it knows from training.</T>
          </div>
        </div>
      </div>

    </Box></Reveal>
    {sub === 5 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 6: Example 2 - factual recall */}
    <Reveal when={sub >= 6}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Example 2: "The capital of France is ___"</T>
      <T color={C.dim} center size={13} style={{ marginTop: 2 }}>Attention gathers context, FFN recalls the fact</T>
      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: `${C.pink}06`, border: `1px solid ${C.pink}20` }}>
          <T color={C.pink} bold center size={15}>Attention Runs First</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Q &middot; K scores for "___" position</T>
              <T color={C.dim} size={12}>"___"'s Query asks "what country am I about?" "France"'s Key scores highest (0.72 after softmax), "capital" gets 0.18, rest get scraps.</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Weighted sum of Values</T>
              <T color={C.dim} size={12}>Output = 0.72 &middot; V<sub>France</sub> + 0.18 &middot; V<sub>capital</sub> + ... This is a <strong>blend</strong> - a weighted average. It mixes "France" info into the "___" position.</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
              <T color={C.pink} bold size={13}>Result: context assembled, but no answer yet</T>
              <T color={C.dim} size={12}>The "___" vector now encodes "I need the capital of France." But attention can only average existing vectors - it cannot look up a fact. It assembled the question, not the answer.</T>
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}>
          <T color={C.orange} bold center size={15}>Then FFN Recalls the Fact</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>W<sub>1</sub>: "capital-of-France" detector fires</T>
              <T color={C.dim} size={12}>Row 847 of W<sub>1</sub> was trained on millions of geography texts. It detects the "capital-of-France" pattern in the vector that attention assembled. Dot product: <code style={{ color: C.orange }}>W<sub>1</sub>[847] &middot; x = 4.2</code></T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>GELU: only relevant knowledge survives</T>
              <T color={C.dim} size={12}>GELU(4.2) = 4.19 → neuron 847 fires. GELU(-1.3) = -0.05 → neuron 200 ("capital-of-Germany") is suppressed. Of 2048 neurons, maybe 100-300 fire meaningfully for any given input.</T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={13}>W<sub>2</sub>: writes "Paris" into the vector</T>
              <T color={C.dim} size={12}>Column 847 of W<sub>2</sub> was trained to shift vectors toward "Paris." Since neuron 847 fired at 4.19, its column dominates the output: <code style={{ color: C.orange }}>output += 4.19 &middot; W<sub>2</sub>[:,847]</code>. The answer is now in the vector.</T>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: `${C.orange}10` }}>
            <T color={C.orange} bold size={12}>Key insight: W<sub>1</sub> rows = "what to detect", W<sub>2</sub> columns = "what to output"</T>
            <T color={C.dim} size={11}>This is the key-value memory interpretation from research. The FFN is a lookup table: 2048 entries, each asking "does this pattern match?" and outputting the corresponding knowledge.</T>
          </div>
        </div>
      </div>
    </Box></Reveal>
    {sub === 6 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 7: Example 3 - multi-block collaboration */}
    <Reveal when={sub >= 7}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Attention + FFN Across Multiple Blocks</T>
      <T color="#b8a9ff" bold center size={16} style={{ marginTop: 6 }}>Example 3: "She sat by the river bank"</T>
      <T color={C.dim} center size={13} style={{ marginTop: 2 }}>Does "bank" mean money or riverbed? Watch attention and FFN collaborate across blocks to resolve the ambiguity.</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: 12, borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}20` }}>
          <T color={C.green} bold size={14}>Block 1: Basic context gathering</T>
          <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.pink}06` }}>
              <T color={C.pink} bold size={12}>Attention</T>
              <T color={C.dim} size={11}>"bank"'s Query matches "river"'s Key (adjacent words, high positional score). After softmax, "bank" absorbs ~40% of "river"'s Value vector. "sat" gets ~20% (nearby verb). Result: "bank" now carries "I'm next to the word river and someone sat."</T>
            </div>
            <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.orange}06` }}>
              <T color={C.orange} bold size={12}>FFN (receives attention's output)</T>
              <T color={C.dim} size={11}>Sees "bank + some river context." W<sub>1</sub> row 310 ("river-location" detector) fires weakly: <code style={{ color: C.orange }}>1.2</code>. W<sub>1</sub> row 744 ("financial-institution" detector) also fires weakly: <code style={{ color: C.orange }}>0.8</code>. GELU passes both through. W<sub>2</sub> nudges the vector slightly toward both meanings. <strong>Ambiguity not yet resolved.</strong></T>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 10, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20` }}>
          <T color={C.yellow} bold size={14}>Block 5: Deeper semantic understanding</T>
          <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.pink}06` }}>
              <T color={C.pink} bold size={12}>Attention</T>
              <T color={C.dim} size={11}>"bank" now attends to "sat" (physical action, not financial), "by" (location preposition), and "river" with much higher scores than Block 1. Why higher? Because Blocks 1-4 FFNs already strengthened the "nature/location" features in "sat" and "river." Their Value vectors are now richer, so the weighted sum gives "bank" a much stronger location signal.</T>
            </div>
            <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.orange}06` }}>
              <T color={C.orange} bold size={12}>FFN (receives attention's output)</T>
              <T color={C.dim} size={11}>Now row 310 ("river-location") fires at <code style={{ color: C.orange }}>3.8</code> (strong match). Row 744 ("financial") fires at <code style={{ color: C.orange }}>-1.1</code> → GELU(-1.1) = -0.03, effectively dead. W<sub>2</sub> column 310 shifts the vector hard toward geography/nature features, column 744 contributes almost nothing. <strong>"Bank" now means "riverbank" - ambiguity resolved.</strong></T>
            </div>
          </div>
        </div>

        <div style={{ padding: 10, borderRadius: 6, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
          <T color="#b8a9ff" bold center size={13}>Why this takes multiple blocks</T>
          <T color={C.dim} size={12} style={{ marginTop: 4 }}>Each round, attention provides <strong>better context</strong> because FFN improved the vectors, and FFN makes <strong>better decisions</strong> because attention gathered more context. They bootstrap each other. Block 1 FFN nudges slightly, Block 2 attention uses that nudge to focus better, Block 2 FFN nudges harder, and so on across all 96 blocks.</T>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color="#fff176" bold center size={15}>Three examples, three types of FFN knowledge:</T>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
          <T color="#fff176" size={13}><strong>1. Implicit knowledge</strong> (area/breadth) - FFN adds concepts that aren't in the input but are related by training data</T>
          <T color="#fff176" size={13}><strong>2. Factual recall</strong> (France/Paris) - FFN looks up a stored fact and writes the answer into the vector</T>
          <T color="#fff176" size={13}><strong>3. Disambiguation</strong> (bank/river) - FFN resolves ambiguity by suppressing wrong meanings and boosting the right one</T>
        </div>
      </div>
    </Box></Reveal>
    {sub === 7 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 8: Deep Q&A */}
    <Reveal when={sub >= 8}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>Deep Questions You Should Be Able to Answer</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { q: "Why can't attention replace FFN?", a: "Attention computes weighted averages of Value vectors - a linear operation. It can mix information from different tokens, but it can never create new features. \"If river AND bank are both present, output riverbank\" requires non-linearity (GELU). Only FFN has that.", color: C.pink },
          { q: "Why can't FFN replace attention?", a: "FFN processes each token in complete isolation. It never sees any other word. Without attention first injecting \"river\" into \"bank\"'s vector, FFN would process \"bank\" identically in \"river bank\" and \"investment bank\" - same input, same output, unable to disambiguate.", color: C.orange },
          { q: "What exactly does \"FFN stores knowledge\" mean?", a: "Each row of W\u2081 is a pattern detector trained during pre-training. Row 847 learned to fire when the input looks like \"capital-of-France.\" The corresponding column of W\u2082 learned to output a vector that shifts toward \"Paris.\" This row-column pair is literally one stored fact. GPT-3 has 2048-49152 such detectors per block across 96 blocks.", color: C.green },
          { q: "How do researchers prove this isn't just a metaphor?", a: "Ablation studies: zero out specific FFN neurons and watch \"The capital of France is\" stop producing \"Paris\" while grammar stays intact. Activate those same neurons artificially and watch \"Paris\" appear in unrelated contexts. The knowledge is localized to specific neurons - not distributed across the whole network.", color: C.blue },
        ].map(({ q, a, color }, i) => (
          <div key={i} style={{ padding: "8px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}15` }}>
            <T color={color} bold size={13}>{q}</T>
            <T color={C.dim} size={12} style={{ marginTop: 3 }}>{a}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>
    {sub === 8 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 9: Where do the parameters live? */}
    <Reveal when={sub >= 9}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Where Do the Parameters Live?</T>
      <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>Parameters are all the learnable numbers in the model - every weight and bias that got tuned during training (chapter 1.4). They are the model's "memory." More parameters = more capacity to store knowledge.</T>

      <T color="#b8a9ff" size={15} style={{ marginTop: 10 }}>Here's how they split between Attention and FFN in one Transformer block:</T>

      {/* Visual: stacked bar */}
      <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.25)" }}>
        <T color={C.dim} bold center size={13} style={{ marginBottom: 8 }}>One Transformer Block (~3.15M parameters total)</T>
        <div style={{ height: 32, borderRadius: 6, overflow: "hidden", display: "flex" }}>
          <div style={{ width: "33%", background: `${C.pink}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <T color="white" bold size={12}>Attention (1/3)</T>
          </div>
          <div style={{ width: "67%", background: `${C.orange}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <T color="white" bold size={12}>FFN (2/3)</T>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <div style={{ flex: 1, padding: 8, borderRadius: 6, background: `${C.pink}06`, border: `1px solid ${C.pink}15` }}>
            <T color={C.pink} bold center size={12}>Attention: ~1.05M</T>
            <T color={C.dim} size={11} style={{ marginTop: 4 }}>W_Q, W_K, W_V = 3 matrices that create the Queries, Keys, and Values (chapter 6.9)</T>
            <T color={C.dim} size={11} style={{ marginTop: 2 }}>W_O = the matrix that blends multi-head outputs (chapter 7.12)</T>
            <T color={C.pink} size={11} style={{ marginTop: 4 }}>These learn <strong>how to find relationships</strong> between words</T>
          </div>
          <div style={{ flex: 1, padding: 8, borderRadius: 6, background: `${C.orange}06`, border: `1px solid ${C.orange}15` }}>
            <T color={C.orange} bold center size={12}>FFN: ~2.1M</T>
            <T color={C.dim} size={11} style={{ marginTop: 4 }}>W<sub>1</sub> (512 x 2048) = expands to thinking space</T>
            <T color={C.dim} size={11} style={{ marginTop: 2 }}>W<sub>2</sub> (2048 x 512) = compresses back to model size</T>
            <T color={C.orange} size={11} style={{ marginTop: 4 }}>These learn <strong>facts and transformations</strong> - the actual knowledge</T>
          </div>
        </div>
      </div>

      <T color={C.dim} size={13} style={{ marginTop: 8 }}>GPT-3 has 96 blocks. That's 96 copies of this structure = 96 x 3.15M = ~302M parameters just in one layer type - and GPT-3's total is 175 <strong>billion</strong> because d_model is 12,288 (not 512), making each matrix vastly larger.</T>
    </Box></Reveal>
  </div>
); };

// ── 8.3 Add & Norm (Again) - The Second Stabilizer ──
export const AddNormTwo = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* Sub 0: Where we are - just after FFN */}
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color="#90caf9" bold center size={20}>The Second Add & Norm</T>
        <T color="#90caf9" size={16} center style={{ marginTop: 4 }}>The FFN just transformed each token's representation. But remember the problem from chapter 8.1 - values drift in deep networks. We need to stabilize again.</T>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {[
            { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
            { label: "arrow" },
            { label: "Add & Norm (first)", color: C.blue, bg: `${C.blue}10`, highlight: false },
            { label: "arrow" },
            { label: "FFN", color: C.orange, bg: `${C.orange}10`, highlight: false },
            { label: "arrow" },
            { label: "Add & Norm (second)", color: C.blue, bg: `${C.blue}18`, highlight: true },
            { label: "arrow" },
            { label: "Block Output", color: C.green, bg: `${C.green}10`, highlight: false },
          ].map((item, i) =>
            item.label === "arrow" ? (
              <div key={i} style={{ fontSize: 18, color: C.dim, lineHeight: 1 }}>↓</div>
            ) : (
              <div key={i} style={{
                padding: "8px 24px", borderRadius: 8, width: "80%", textAlign: "center",
                background: item.bg,
                border: item.highlight ? `2px solid ${item.color}55` : `1px solid ${item.color}20`,
                boxShadow: item.highlight ? `0 0 12px ${item.color}20` : "none",
              }}>
                <T color={item.color} bold={item.highlight} center size={item.highlight ? 17 : 15}>{item.label}</T>
              </div>
            )
          )}
        </div>
        <T color="#90caf9" size={15} center style={{ marginTop: 12 }}>This second Add & Norm works exactly the same way as the first - but its input is the FFN output instead of the Attention output.</T>
      </Box>
    )}
    {sub === 0 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 1: The Add step - FFN input + FFN output */}
    <Reveal when={sub >= 1}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#a5d6a7" bold center size={20}>The Add - Residual Around FFN</T>
      <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>Same idea as chapter 8.1: keep the original input by adding it back. The input to FFN was the first Add & Norm's output.</T>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "rgba(0,230,118,0.04)", border: `1px solid ${C.green}20` }}>
        <T color="#a5d6a7" bold center size={16}>Continuing with "cats":</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag color={C.purple}>FFN input</Tag>
            <code style={{ color: C.purple, fontSize: 15 }}>[-1.26, -0.51, 0.80, 0.98]</code>
          </div>
          <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↓ goes through FFN (chapter 8.2) ↓</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag color={C.orange}>FFN output</Tag>
            <code style={{ color: C.orange, fontSize: 15 }}>[0.51, -0.73, 1.14, 0.22]</code>
          </div>
          <div style={{ marginTop: 6, padding: 10, borderRadius: 8, background: `${C.green}10`, border: `1px dashed ${C.green}30` }}>
            <T color="#a5d6a7" bold center size={16}>The Add Step: FFN input + FFN output</T>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <code style={{ color: C.purple, fontSize: 15 }}>[-1.26, -0.51, 0.80, 0.98]</code>
              <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>+</span>
              <code style={{ color: C.orange, fontSize: 15 }}>[0.51, -0.73, 1.14, 0.22]</code>
              <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>=</span>
              <code style={{ color: C.green, fontSize: 15, fontWeight: 700 }}>[-0.75, -1.24, 1.94, 1.20]</code>
            </div>
          </div>
        </div>
      </div>

      <T color="#a5d6a7" size={15} style={{ marginTop: 10 }}>The residual connection ensures that even if the FFN distorts values, the original signal from Add & Norm #1 survives by being added back.</T>
    </Box></Reveal>
    {sub === 1 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 2: The Norm step with concrete numbers */}
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The Norm - Stabilize Again</T>
      <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>Same Layer Normalization formula from chapter 8.1 - compute mean, subtract, divide by standard deviation, scale by gamma, shift by beta.</T>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: "rgba(167,139,250,0.04)", border: `1px solid ${C.purple}20` }}>
        <T color="#b8a9ff" bold center size={16}>Normalizing [-0.75, -1.24, 1.94, 1.20]</T>

        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.blue}08` }}>
            <T color={C.blue} bold size={14}>mu = (-0.75 + -1.24 + 1.94 + 1.20) / 4 = <strong>0.2875</strong></T>
          </div>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.orange}08` }}>
            <T color={C.orange} bold size={14}>variance = 1.5252, sqrt(variance + epsilon) = <strong>1.235</strong></T>
          </div>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.green}08` }}>
            <T color={C.green} bold size={14}>Normalize each: (x - mu) / 1.235</T>
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {[
                { from: "-0.75", to: "-0.84" },
                { from: "-1.24", to: "-1.24" },
                { from: "1.94", to: "1.34" },
                { from: "1.20", to: "0.74" },
              ].map(({ from, to }) => (
                <div key={from} style={{ padding: "4px 10px", borderRadius: 4, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
                  <code style={{ color: C.dim, fontSize: 13 }}>{from}</code>
                  <span style={{ color: C.dim }}> → </span>
                  <code style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>{to}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, padding: 8, borderRadius: 6, background: `${C.purple}10`, border: `1px dashed ${C.purple}30` }}>
          <T color="#b8a9ff" bold center size={15}>Block output for "cats": [-0.84, -1.24, 1.34, 0.74]</T>
          <T color={C.dim} center size={13} style={{ marginTop: 2 }}>With gamma=1.0 and beta=0.0 (initial values). The model will learn optimal gamma and beta during training.</T>
        </div>
      </div>
    </Box></Reveal>
    {sub === 2 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 3: Complete single-block pipeline */}
    <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>The Complete Single Block - All 4 Steps</T>
      <T color="#80deea" size={16} center style={{ marginTop: 4 }}>Here's "cats" flowing through one entire Transformer block, start to finish:</T>

      <div data-full-block="true" style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {[
          { step: "Input (cats)", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.dim, tag: "Input" },
          { step: "arrow", label: "Multi-Head Attention" },
          { step: "Attention Output", val: "[0.3, -0.1, 0.2, 0.4]", color: C.pink, tag: "Attn" },
          { step: "arrow", label: "Add & Norm #1" },
          { step: "After 1st Add & Norm", val: "[-1.26, -0.51, 0.80, 0.98]", color: C.blue, tag: "A&N 1" },
          { step: "arrow", label: "Feed-Forward Network" },
          { step: "FFN Output", val: "[0.51, -0.73, 1.14, 0.22]", color: C.orange, tag: "FFN" },
          { step: "arrow", label: "Add & Norm #2" },
          { step: "Block Output", val: "[-0.84, -1.24, 1.34, 0.74]", color: C.green, tag: "A&N 2" },
        ].map((item, i) =>
          item.step === "arrow" ? (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
              <span style={{ fontSize: 14, color: C.dim }}>{item.label}</span>
              <span style={{ fontSize: 16, color: C.dim }}>↓</span>
            </div>
          ) : (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 8, width: "95%", background: `${item.color}08`, border: `1px solid ${item.color}20`,
            }}>
              <Tag color={item.color}>{item.tag}</Tag>
              <T color={item.color} size={13} bold>{item.step}</T>
              <code style={{ color: `${item.color}bb`, fontSize: 13, marginLeft: "auto" }}>{item.val}</code>
            </div>
          )
        )}
      </div>

      <T color="#80deea" size={15} center style={{ marginTop: 12 }}>One block: Attention moves information between tokens, Add & Norm stabilizes, FFN processes each token's knowledge, Add & Norm stabilizes again. This is the heartbeat of every Transformer.</T>
    </Box></Reveal>
    {sub === 3 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 4: Why Add & Norm appears twice */}
    <Reveal when={sub >= 4}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#fff176" bold center size={20}>Why Twice? - One Per Sub-Layer</T>
      <T color="#fff176" size={16} style={{ marginTop: 6 }}>Add & Norm appears <strong>twice</strong> because each Transformer block has two sub-layers: Attention and FFN. Each sub-layer gets its own Add & Norm because each one can independently cause value drift.</T>

      <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: 12, borderRadius: 10, background: `${C.pink}08`, border: `1px solid ${C.pink}25` }}>
          <T color={C.pink} bold center size={15}>Sub-layer 1: Attention</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            <T color={C.dim} size={12}>Input x</T>
            <T color={C.dim} size={12}>↓</T>
            <T color={C.pink} size={12}>Attention(x)</T>
            <T color={C.dim} size={12}>↓</T>
            <T color={C.blue} bold size={12}>Add & Norm #1</T>
            <T color={C.dim} size={11} style={{ marginTop: 4 }}>Stabilizes after attention changes</T>
          </div>
        </div>

        <div style={{ flex: 1, padding: 12, borderRadius: 10, background: `${C.orange}08`, border: `1px solid ${C.orange}25` }}>
          <T color={C.orange} bold center size={15}>Sub-layer 2: FFN</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            <T color={C.dim} size={12}>From A&N #1</T>
            <T color={C.dim} size={12}>↓</T>
            <T color={C.orange} size={12}>FFN(x)</T>
            <T color={C.dim} size={12}>↓</T>
            <T color={C.blue} bold size={12}>Add & Norm #2</T>
            <T color={C.dim} size={11} style={{ marginTop: 4 }}>Stabilizes after FFN changes</T>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color="#fff176" bold center size={15}>The Rule</T>
        <T color="#fff176" size={15} style={{ marginTop: 4 }}>In Transformers, every sub-layer that transforms values gets wrapped with its own residual connection and layer norm. This is what makes it possible to stack 96 blocks deep without the signal degrading. If you only normalized once at the end of the block, the FFN's output could already be in a bad range before it gets stabilized.</T>
      </div>
    </Box></Reveal>
  </div>
); };

// ── 8.4 Nx - The Transformer Block Repeats ──
export const TransformerBlockRepeats = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* Sub 0: One block isn't enough */}
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffcc80" bold center size={20}>One Block Does Not Repeat Enough</T>
        <T color="#ffcc80" size={16} style={{ marginTop: 6 }}>We've now seen all 4 steps inside one Transformer block: Attention, Add & Norm, FFN, Add & Norm. But one block can only learn simple patterns. To understand language, the model needs to <strong>repeat</strong> this entire block many times.</T>

        <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: `${C.orange}08`, border: `1px solid ${C.orange}20` }}>
          <T color="#ffcc80" bold center size={16}>Think of it like this:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { block: "1 block", learns: "basic word associations (\"cat\" relates to \"sat\")", color: C.dim },
              { block: "4 blocks", learns: "grammar structure (subject-verb agreement)", color: C.yellow },
              { block: "12 blocks", learns: "context and nuance (sarcasm, tone)", color: C.orange },
              { block: "96 blocks", learns: "deep reasoning, world knowledge, complex inference", color: C.red },
            ].map(({ block, learns, color }) => (
              <div key={block} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 10px", borderRadius: 6, background: `${color}08`, border: `1px solid ${color}15` }}>
                <Tag color={color}>{block}</Tag>
                <T color={C.dim} size={14}>{learns}</T>
              </div>
            ))}
          </div>
        </div>

        <T color="#ffcc80" size={15} center style={{ marginTop: 12 }}>Each repeat of the block refines the token representations further. The output of block 1 becomes the input of block 2, and so on.</T>
      </Box>
    )}
    {sub === 0 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 1: The stack with real model sizes */}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>The Stack - How Many Blocks?</T>
      <T color="#80deea" size={16} style={{ marginTop: 6 }}>Different models use different numbers of blocks. In the original paper and in practice, this number is called N (hence "Nx" in architecture diagrams).</T>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { model: "GPT-2 Small", blocks: 12, dModel: 768, color: C.green, pct: 12.5 },
          { model: "GPT-2 Medium", blocks: 24, dModel: 1024, color: C.yellow, pct: 25 },
          { model: "GPT-2 Large", blocks: 36, dModel: 1280, color: C.orange, pct: 37.5 },
          { model: "GPT-3", blocks: 96, dModel: 12288, color: C.red, pct: 100 },
        ].map(({ model, blocks, dModel, color, pct }) => (
          <div key={model} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color, fontSize: 13, fontWeight: 700, minWidth: 110 }}>{model}</span>
            <div style={{ flex: 1, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color, opacity: 0.4 }} />
              <span style={{ position: "absolute", left: 8, top: 2, fontSize: 12, color: "white", fontWeight: 600 }}>{blocks} blocks</span>
            </div>
            <code style={{ color: C.dim, fontSize: 12, minWidth: 80 }}>d={dModel}</code>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20` }}>
        <T color="#80deea" bold center size={15}>What This Means</T>
        <T color="#80deea" size={14} style={{ marginTop: 4 }}>In GPT-3, every single token in your prompt passes through 96 identical blocks in sequence. Each block runs the full Attention → Add & Norm → FFN → Add & Norm pipeline. That's 96 rounds of attention, 96 rounds of FFN, and 192 Add & Norm operations per token.</T>
      </div>
    </Box></Reveal>
    {sub === 1 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 2: Same structure, different weights */}
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Same Structure, Different Weights</T>
      <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>Every block has the same structure: Attention → Add & Norm → FFN → Add & Norm. But every learnable weight inside each block is unique - learned separately during training. Here's every weight and where it lives:</T>

      {/* Weight map: which step owns which weights */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Attention weights */}
        <div style={{ padding: 12, borderRadius: 10, background: `${C.pink}06`, border: `1px solid ${C.pink}20` }}>
          <T color={C.pink} bold size={15}>Multi-Head Attention</T>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { name: "W_Q", role: "Creates Queries - \"what am I looking for?\"", ref: "ch 6.9" },
              { name: "W_K", role: "Creates Keys - \"what do I contain?\"", ref: "ch 6.9" },
              { name: "W_V", role: "Creates Values - \"what info do I pass along?\"", ref: "ch 6.9" },
              { name: "W_O", role: "Blends all 8 heads back together", ref: "ch 7.12" },
            ].map(({ name, role, ref }) => (
              <div key={name} style={{ flex: "1 1 45%", padding: "6px 10px", borderRadius: 6, background: `${C.pink}08`, border: `1px solid ${C.pink}15` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <code style={{ color: C.pink, fontSize: 14, fontWeight: 700 }}>{name}</code>
                  <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                </div>
                <T color={C.dim} size={12}>{role}</T>
              </div>
            ))}
          </div>
        </div>

        {/* Add & Norm #1 weights */}
        <div style={{ padding: 12, borderRadius: 10, background: `${C.blue}06`, border: `1px solid ${C.blue}20` }}>
          <T color={C.blue} bold size={15}>Add & Norm #1 (after Attention)</T>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { name: "\u03B3\u2081 (gamma)", role: "Learnable scale per dimension - stretches or shrinks normalized values", ref: "ch 8.1" },
              { name: "\u03B2\u2081 (beta)", role: "Learnable shift per dimension - moves the center up or down", ref: "ch 8.1" },
            ].map(({ name, role, ref }) => (
              <div key={name} style={{ flex: "1 1 45%", padding: "6px 10px", borderRadius: 6, background: `${C.blue}08`, border: `1px solid ${C.blue}15` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <code style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>{name}</code>
                  <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                </div>
                <T color={C.dim} size={12}>{role}</T>
              </div>
            ))}
          </div>
        </div>

        {/* FFN weights */}
        <div style={{ padding: 12, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}>
          <T color={C.orange} bold size={15}>Feed-Forward Network</T>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { name: "W\u2081, b\u2081", role: "First layer - expands from 512 to 2048 dims (the thinking space)", ref: "ch 8.2" },
              { name: "W\u2082, b\u2082", role: "Second layer - compresses from 2048 back to 512 dims", ref: "ch 8.2" },
            ].map(({ name, role, ref }) => (
              <div key={name} style={{ flex: "1 1 45%", padding: "6px 10px", borderRadius: 6, background: `${C.orange}08`, border: `1px solid ${C.orange}15` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <code style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>{name}</code>
                  <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                </div>
                <T color={C.dim} size={12}>{role}</T>
              </div>
            ))}
          </div>
        </div>

        {/* Add & Norm #2 weights */}
        <div style={{ padding: 12, borderRadius: 10, background: `${C.blue}06`, border: `1px solid ${C.blue}20` }}>
          <T color={C.blue} bold size={15}>Add & Norm #2 (after FFN)</T>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              { name: "\u03B3\u2082 (gamma)", role: "Same role as gamma above, but a separate copy learned independently", ref: "ch 8.3" },
              { name: "\u03B2\u2082 (beta)", role: "Same role as beta above, but a separate copy learned independently", ref: "ch 8.3" },
            ].map(({ name, role, ref }) => (
              <div key={name} style={{ flex: "1 1 45%", padding: "6px 10px", borderRadius: 6, background: `${C.blue}08`, border: `1px solid ${C.blue}15` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <code style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>{name}</code>
                  <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                </div>
                <T color={C.dim} size={12}>{role}</T>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The key point */}
      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20` }}>
        <T color="#fff176" bold center size={15}>Every block has its own copy of ALL these weights</T>
        <T color="#fff176" size={14} style={{ marginTop: 4 }}>Block 1 has its own W_Q, W_K, W_V, W_O, W<sub>1</sub>, W<sub>2</sub>, gammas, and betas. Block 2 has completely different weights. Block 96 has yet another set. If they shared the same weights, stacking 96 blocks would be no better than having one - you'd just repeat the same transformation. Each block's unique weights let it specialize: Block 1 learns different patterns than Block 50.</T>
      </div>
    </Box></Reveal>
    {sub === 2 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 3: What each layer learns */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#a5d6a7" bold center size={20}>What Each Layer Learns - Shallow to Deep</T>
      <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>Research on Transformer internals has revealed a clear pattern: early blocks learn simple things, deep blocks learn abstract things.</T>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { range: "Blocks 1-4", title: "Surface Patterns", items: ["Part-of-speech (noun, verb, adjective)", "Basic grammar and word order", "Simple co-occurrence (\"New\" near \"York\")"], color: C.green, barW: 20 },
          { range: "Blocks 5-12", title: "Syntax & Structure", items: ["Subject-verb agreement across distance", "Clause boundaries and nesting", "Pronoun resolution (\"she\" refers to \"Alice\")"], color: C.yellow, barW: 50 },
          { range: "Blocks 13-24", title: "Semantics & Meaning", items: ["Word sense disambiguation (\"bank\" = river vs money)", "Sentiment and tone detection", "Entity relationships and facts"], color: C.orange, barW: 75 },
          { range: "Blocks 25-96", title: "Abstract Reasoning", items: ["Multi-step inference and logic", "World knowledge and common sense", "Task-specific meaning and generation"], color: C.red, barW: 100 },
        ].map(({ range, title, items, color, barW }, idx) => (
          <div key={range}>
            <div style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}15` }}>
              <div style={{ minWidth: 80 }}>
                <T color={color} bold size={13}>{range}</T>
                <div style={{ marginTop: 4, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", width: 80 }}>
                  <div style={{ width: `${barW}%`, height: "100%", borderRadius: 3, background: color, opacity: 0.5 }} />
                </div>
              </div>
              <div>
                <T color={color} bold size={14}>{title}</T>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 4, alignItems: "flex-start", marginTop: 2 }}>
                    <span style={{ color, fontSize: 10, marginTop: 3 }}>&#9679;</span>
                    <T color={C.dim} size={12}>{item}</T>
                  </div>
                ))}
              </div>
            </div>
            {idx < 3 && <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↓</div>}
          </div>
        ))}
      </div>

      <T color="#a5d6a7" size={14} center style={{ marginTop: 10 }}>This is why depth matters - you need many blocks to build from grammar all the way up to meaning and reasoning. It's the same principle as "deep" networks from chapter 1.21, but now each block has both attention (for context) and FFN (for knowledge).</T>
    </Box></Reveal>
    {sub === 3 && <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}

    {/* Sub 4: Complete picture - clean SVG pipeline */}
    <Reveal when={sub >= 4}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>The Complete Picture - Token to Output Through N Blocks</T>
      <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>Here's the full journey of a single token from input to output:</T>

      {/* SVG pipeline diagram
           Layout (all y positions verified):
           embedTop=10  h=40  → bottom=50
           arrow 50→68
           b1Top=70     h=50  → bottom=120
           arrow 120→138
           b2Top=140    h=50  → bottom=190
           arrow 190→210
           dotsY=220 (text centered here)
           arrow 230→248
           bNTop=250    h=50  → bottom=300
           arrow 300→318
           outTop=320   h=40  → bottom=360
           svgH=370
      */}
      {(() => {
        const w = 580, cx = w / 2, boxW = 420;
        const stepW = 88, stepH = 20;
        const embedTop = 10, embedH = 44;
        const b1Top = 76, blockH = 56;
        const b2Top = 154;
        const dotsY = 238;
        const bNTop = 268;
        const outTop = 346, outH = 44;
        const svgH = 400;
        const stepClr = [C.pink, C.blue, C.orange, C.blue];
        const stepLbl = ["Attention", "Add & Norm", "FFN", "Add & Norm"];
        const bracketX = cx + boxW / 2 + 18;
        const renderBlock = (top, label, color) => {
          const bx = cx - boxW / 2;
          const totalSW = 4 * stepW + 3 * 8;
          return (
            <g>
              <rect x={bx} y={top} width={boxW} height={blockH} rx={10} fill={`${color}08`} stroke={`${color}40`} strokeWidth={1.5} />
              <text x={cx} y={top + 18} fill={color} fontSize={14} fontWeight={700} textAnchor="middle">{label}</text>
              {stepLbl.map((sl, si) => {
                const sx = cx - totalSW / 2 + si * (stepW + 8);
                return (
                  <g key={si}>
                    <rect x={sx} y={top + 28} width={stepW} height={stepH} rx={5} fill={`${stepClr[si]}15`} stroke={`${stepClr[si]}30`} strokeWidth={1} />
                    <text x={sx + stepW / 2} y={top + 28 + stepH / 2 + 4} fill={stepClr[si]} fontSize={10} fontWeight={600} textAnchor="middle">{sl}</text>
                  </g>
                );
              })}
            </g>
          );
        };
        const arrow = (fromY, toY) =>
          <line x1={cx} y1={fromY + 2} x2={cx} y2={toY - 3} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} markerEnd="url(#arr2)" />;
        return (
        <svg viewBox={`0 0 ${w} ${svgH}`} style={{ display: "block", width: "100%", maxWidth: 650, margin: "14px auto 0" }}>
          <defs><marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" /></marker></defs>

          {/* Token Embedding box */}
          <rect x={cx - boxW / 2} y={embedTop} width={boxW} height={embedH} rx={10} fill={`${C.cyan}08`} stroke={`${C.cyan}40`} strokeWidth={1.5} />
          <text x={cx} y={embedTop + 22} fill={C.cyan} fontSize={14} fontWeight={700} textAnchor="middle">Token Embedding + Positional Encoding</text>
          <text x={cx} y={embedTop + 37} fill={C.dim} fontSize={10} textAnchor="middle">(Sections 5.2-5.7)</text>

          {/* Arrows: each starts 2px below box bottom, ends 3px above next box top */}
          {arrow(embedTop + embedH, b1Top)}
          {arrow(b1Top + blockH, b2Top)}
          {arrow(b2Top + blockH, dotsY - 10)}
          {arrow(dotsY + 10, bNTop)}
          {arrow(bNTop + blockH, outTop)}

          {/* Blocks */}
          {renderBlock(b1Top, "Block 1", C.green)}
          {renderBlock(b2Top, "Block 2", C.yellow)}
          {renderBlock(bNTop, "Block N", C.red)}

          {/* Dots - centered between Block 2 bottom and Block N top */}
          <text x={cx} y={dotsY + 5} fill={C.dim} fontSize={20} textAnchor="middle" letterSpacing={10}>...</text>

          {/* Output Layer box */}
          <rect x={cx - boxW / 2} y={outTop} width={boxW} height={outH} rx={10} fill={`${C.orange}08`} stroke={`${C.orange}40`} strokeWidth={1.5} />
          <text x={cx} y={outTop + 22} fill={C.orange} fontSize={14} fontWeight={700} textAnchor="middle">Output Layer</text>
          <text x={cx} y={outTop + 37} fill={C.dim} fontSize={10} textAnchor="middle">logits → softmax → next token</text>

          {/* N x bracket - right side, spanning Block 1 top to Block N bottom */}
          <line x1={bracketX} y1={b1Top} x2={bracketX} y2={bNTop + blockH} stroke={C.dim} strokeWidth={1.5} />
          <line x1={bracketX - 7} y1={b1Top} x2={bracketX + 7} y2={b1Top} stroke={C.dim} strokeWidth={1.5} />
          <line x1={bracketX - 7} y1={bNTop + blockH} x2={bracketX + 7} y2={bNTop + blockH} stroke={C.dim} strokeWidth={1.5} />
          <text x={bracketX + 14} y={(b1Top + bNTop + blockH) / 2 + 5} fill={C.dim} fontSize={16} fontWeight={700} textAnchor="start">Nx</text>
        </svg>
        );
      })()}

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, background: `${C.blue}08`, border: `1px solid ${C.blue}20` }}>
          <T color={C.blue} bold center size={14}>GPT-2 Small</T>
          <T color={C.dim} center size={12}>N = 12 blocks, 117M parameters</T>
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}20` }}>
          <T color={C.purple} bold center size={14}>GPT-3</T>
          <T color={C.dim} center size={12}>N = 96 blocks, 175B parameters</T>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: `${C.red}08`, border: `1px solid ${C.red}20` }}>
        <T color="#ef9a9a" bold center size={15}>The full recipe of a Transformer decoder:</T>
        <T color="#ef9a9a" center size={14} style={{ marginTop: 4 }}>Tokenize → Embed → Add positions → Pass through N blocks (each: Attention → Add & Norm → FFN → Add & Norm) → Output layer → Next token probability. Everything we've covered from Section 5 through Section 8 happens inside each of those N blocks.</T>
      </div>
    </Box></Reveal>
  </div>
); };
