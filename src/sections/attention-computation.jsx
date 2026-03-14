import { C } from "../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../components.jsx";
export const ComputeQKV = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Now let's do a FULL end-to-end computation.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>We traced "The cat sat" earlier to understand the concepts. Now we'll compute <strong>every single number</strong> for "I love cats" - the sentence we've been building toward since Chapter 1.</T>
        <T color="#80deea" bold center style={{ marginTop: 10 }}>"I love cats" - embeddings (4 dims for simplicity):</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[{ w: '"I"', v: "[1.0, 0.5, -0.3, 0.8]", c: C.red }, { w: '"love"', v: "[0.2, 0.9, 0.4, -0.1]", c: C.purple }, { w: '"cats"', v: "[-0.5, 0.3, 0.7, 0.6]", c: C.cyan }].map(({ w, v, c }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 4, background: `${c}06` }}>
              <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 42 }}>{w}</span>
              <code style={{ color: `${c}aa`, fontSize: 16 }}>{v}</code>
            </div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>After multiplying by W_Q, W_K, W_V:</T>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr", gap: 6 }}>
            <div></div>
            <T color={C.blue} bold size={16} center>Query</T>
            <T color={C.orange} bold size={16} center>Key</T>
            <T color={C.green} bold size={16} center>Value</T>
            {[
              { w: "\"I\"", q: "[0.8, 0.2]", k: "[0.3, 0.7]", v: "[1.0, -0.5]", c: C.red },
              { w: "\"love\"", q: "[0.1, 0.9]", k: "[0.6, 0.4]", v: "[0.3, 0.8]", c: C.purple },
              { w: "\"cats\"", q: "[0.5, 0.6]", k: "[0.8, 0.5]", v: "[-0.2, 0.9]", c: C.cyan },
            ].map(({ w, q, k, v, c }) => (
              <div key={w} style={{ display: "contents" }}>
                <span style={{ color: c, fontWeight: 700, fontSize: 16 }}>{w}</span>
                <div style={{ background: `${C.blue}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}><code style={{ color: C.blue, fontSize: 16 }}>{q}</code></div>
                <div style={{ background: `${C.orange}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}><code style={{ color: C.orange, fontSize: 16 }}>{k}</code></div>
                <div style={{ background: `${C.green}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}><code style={{ color: C.green, fontSize: 16 }}>{v}</code></div>
              </div>
            ))}
          </div>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 6 }}>Q and K are 2D (compressed from 4D). In real models: 64D from 512D.</T>
      </Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const AttentionScores = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color={C.blue} bold center size={20}>Step 2: Compute attention scores</T>
        <T color={C.dim} size={18} style={{ marginTop: 4 }}>Each word's Query asks every Key: "how relevant are you to me?"</T>

        {/* Q_I as inline text, centered */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <T color={C.blue} bold center size={19}>"I"'s Query: Q_I = [0.8, 0.2]</T>
        </div>
        <T color={C.dim} size={16} center style={{ marginTop: 2 }}>Dot product this with every word's Key:</T>

        {/* Score cards with ranked coloring */}
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { t: "I", k: "[0.3, 0.7]", calc: "(0.8×0.3) + (0.2×0.7) = 0.24 + 0.14", r: 0.38, rank: 3 },
            { t: "love", k: "[0.6, 0.4]", calc: "(0.8×0.6) + (0.2×0.4) = 0.48 + 0.08", r: 0.56, rank: 2 },
            { t: "cats", k: "[0.8, 0.5]", calc: "(0.8×0.8) + (0.2×0.5) = 0.64 + 0.10", r: 0.74, rank: 1 },
          ].map(({ t, k, calc, r, rank }) => {
            const cfg = {
              1: { color: C.yellow, label: "HIGHEST", bg: "0a", border: "25", barBg: `linear-gradient(90deg, ${C.orange}, ${C.yellow})` },
              2: { color: C.orange, label: "medium", bg: "06", border: "15", barBg: `linear-gradient(90deg, ${C.cyan}80, ${C.orange})` },
              3: { color: C.cyan, label: "lowest", bg: "04", border: "10", barBg: `${C.cyan}40` },
            }[rank];
            return (
              <div key={t} style={{ padding: "10px 12px", borderRadius: 8, background: `${cfg.color}${cfg.bg}`, border: `1px solid ${cfg.color}${cfg.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: C.blue, fontSize: 16, fontWeight: 600 }}>Q_I</span>
                  <span style={{ color: C.dim, fontSize: 19 }}>·</span>
                  <span style={{ color: C.orange, fontSize: 16, fontWeight: 600 }}>K_{t} = {k}</span>
                </div>
                <T color={C.dim} size={16}>{calc}</T>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${(r / 0.74) * 100}%`, height: "100%", borderRadius: 5, background: cfg.barBg, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: cfg.color, minWidth: 36, textAlign: "right" }}>{r.toFixed(2)}</span>
                  <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600, minWidth: 48 }}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <T color={C.dim} size={18} style={{ marginTop: 8 }}>From "I"'s perspective: <strong style={{ color: C.yellow }}>"cats"</strong> is most relevant, <strong style={{ color: C.orange }}>"love"</strong> is medium, <strong style={{ color: C.cyan }}>"I" itself</strong> is lowest.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center>Full score matrix (every word asks every word):</T>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "55px repeat(3, 1fr)", gap: 4 }}>
            <div></div>
            {["K_I", "K_love", "K_cats"].map(h => <T key={h} color={C.orange} size={14} bold center>{h}</T>)}
            {[
              { q: "Q_I", s: [0.38, 0.56, 0.74], mx: 2 },
              { q: "Q_love", s: [0.69, 0.54, 0.53], mx: 0 },
              { q: "Q_cats", s: [0.57, 0.54, 0.70], mx: 2 },
            ].map(({ q, s: sc, mx }) => (
              <div key={q} style={{ display: "contents" }}>
                <T color={C.blue} size={16} bold center>{q}</T>
                {sc.map((v, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "6px", borderRadius: 5, background: i === mx ? `${C.yellow}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === mx ? `${C.yellow}25` : "transparent"}` }}>
                    <span style={{ fontFamily: "monospace", fontSize: 19, color: i === mx ? C.yellow : C.mid, fontWeight: i === mx ? 700 : 400 }}>{v.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 6 }}>Each row = one word asking "how relevant is each word to me?" Yellow = highest in that row.</T>
      </Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const KTranspose = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* Sub 0: The question - what does T mean? */}
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color={C.blue} bold center size={20}>In the attention formula, you'll see this:</T>
        <div style={{ margin: "14px 0", padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.yellow}25`, textAlign: "center" }}>
          <T color={C.yellow} bold size={24} center>score = Q · K<sup style={{ fontSize: 16 }}>T</sup></T>
        </div>
        <T color={C.blue} size={19}>That little <strong style={{ color: C.yellow }}>T</strong> is not "to the power of T". It stands for <strong style={{ color: C.yellow }}>Transpose</strong> - flipping a matrix on its side.</T>
        <T color={C.dim} size={18} style={{ marginTop: 8 }}>But why do we need to flip K? Let's build up to it step by step.</T>
      </Box>
    )}

    {/* Sub 1: What is a transpose - visual flip */}
    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
      <T color={C.purple} bold center size={20}>What does "transpose" mean?</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>It means: <strong>rows become columns, columns become rows.</strong> That's it. No math changes - just a flip.</T>

      <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        {/* Before */}
        <div style={{ textAlign: "center" }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Original K</T>
          <div style={{ display: "inline-block", padding: "10px", borderRadius: 10, background: `${C.orange}08`, border: `1px solid ${C.orange}20` }}>
            <div style={{ display: "grid", gridTemplateColumns: "50px 50px", gap: 4 }}>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}><T color={C.orange} bold center size={17}>0.3</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}><T color={C.orange} bold center size={17}>0.7</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}><T color={C.cyan} bold center size={17}>0.6</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}><T color={C.cyan} bold center size={17}>0.4</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}><T color={C.yellow} bold center size={17}>0.8</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}><T color={C.yellow} bold center size={17}>0.5</T></div>
            </div>
            <T color={C.dim} size={12} center style={{ marginTop: 4 }}>3 rows × 2 cols</T>
          </div>
          <div style={{ marginTop: 4 }}>
            <T color={C.dim} size={12} center>row 1 = K<sub>I</sub></T>
            <T color={C.dim} size={12} center>row 2 = K<sub>love</sub></T>
            <T color={C.dim} size={12} center>row 3 = K<sub>cats</sub></T>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <T color={C.yellow} bold center size={28}>→</T>
          <T color={C.yellow} size={12} bold center>transpose</T>
        </div>

        {/* After */}
        <div style={{ textAlign: "center" }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>K<sup>T</sup></T>
          <div style={{ display: "inline-block", padding: "10px", borderRadius: 10, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
            <div style={{ display: "grid", gridTemplateColumns: "50px 50px 50px", gap: 4 }}>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}><T color={C.orange} bold center size={17}>0.3</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}><T color={C.cyan} bold center size={17}>0.6</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}><T color={C.yellow} bold center size={17}>0.8</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}><T color={C.orange} bold center size={17}>0.7</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}><T color={C.cyan} bold center size={17}>0.4</T></div>
              <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}><T color={C.yellow} bold center size={17}>0.5</T></div>
            </div>
            <T color={C.dim} size={12} center style={{ marginTop: 4 }}>2 rows × 3 cols</T>
          </div>
          <div style={{ marginTop: 4 }}>
            <T color={C.dim} size={12} center>col 1 = K<sub>I</sub></T>
            <T color={C.dim} size={12} center>col 2 = K<sub>love</sub></T>
            <T color={C.dim} size={12} center>col 3 = K<sub>cats</sub></T>
          </div>
        </div>
      </div>

      <T color="#b8a9ff" size={18} style={{ marginTop: 12 }}>Same numbers. Same order within each word's vector. Just <strong>rotated</strong> - rows became columns.</T>
    </Box></Reveal>

    {/* Sub 2: Why - shapes must align for matrix multiplication */}
    <Reveal when={sub >= 2}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ff8a80" bold center size={20}>The problem: shapes don't match.</T>
      <T color="#ff8a80" style={{ marginTop: 6 }}>We want every Query to compute a dot product with every Key. Let's try Q · K directly:</T>

      <div style={{ marginTop: 12, padding: "14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.red}25` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <T color={C.blue} bold center size={16}>Q</T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.blue}12`, border: `1px solid ${C.blue}25` }}>
              <T color={C.blue} bold center size={20}>3 × 2</T>
            </div>
            <T color={C.dim} size={12} center>3 words, 2 dims</T>
          </div>
          <T color={C.dim} size={24}>×</T>
          <div style={{ textAlign: "center" }}>
            <T color={C.orange} bold center size={16}>K</T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.orange}12`, border: `1px solid ${C.orange}25` }}>
              <T color={C.orange} bold center size={20}>3 × 2</T>
            </div>
            <T color={C.dim} size={12} center>3 words, 2 dims</T>
          </div>
          <T color={C.dim} size={24}>=</T>
          <div style={{ textAlign: "center" }}>
            <T color={C.red} bold center size={16}>&nbsp;</T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.red}12`, border: `1px solid ${C.red}25` }}>
              <T color={C.red} bold center size={20}>❌</T>
            </div>
            <T color={C.red} size={12} center>Can't multiply!</T>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.red}08` }}>
          <T color="#ff8a80" size={16} center>Matrix multiplication rule: the <strong>inner dimensions</strong> must match.</T>
          <T color="#ff8a80" size={16} center style={{ marginTop: 2 }}>(3×<strong style={{ color: C.red }}>2</strong>) × (<strong style={{ color: C.red }}>3</strong>×2) → 2 ≠ 3. <strong>Broken.</strong></T>
        </div>
      </div>
    </Box></Reveal>

    {/* Sub 3: The fix - transpose makes it work */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>The fix: transpose K, then multiply.</T>
      <div style={{ marginTop: 12, padding: "14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.green}25` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <T color={C.blue} bold center size={16}>Q</T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.blue}12`, border: `1px solid ${C.blue}25` }}>
              <T color={C.blue} bold center size={20}>3 × 2</T>
            </div>
            <T color={C.dim} size={12} center>3 words, 2 dims</T>
          </div>
          <T color={C.dim} size={24}>×</T>
          <div style={{ textAlign: "center" }}>
            <T color={C.green} bold center size={16}>K<sup style={{ fontSize: 12 }}>T</sup></T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.green}12`, border: `1px solid ${C.green}25` }}>
              <T color={C.green} bold center size={20}>2 × 3</T>
            </div>
            <T color={C.dim} size={12} center>2 dims, 3 words</T>
          </div>
          <T color={C.dim} size={24}>=</T>
          <div style={{ textAlign: "center" }}>
            <T color={C.yellow} bold center size={16}>Scores</T>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.yellow}12`, border: `1px solid ${C.yellow}25` }}>
              <T color={C.yellow} bold center size={20}>3 × 3</T>
            </div>
            <T color={C.dim} size={12} center>every word → every word</T>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.green}08` }}>
          <T color="#80e8a5" size={16} center>(3×<strong style={{ color: C.green }}>2</strong>) × (<strong style={{ color: C.green }}>2</strong>×3) → inner dims both 2. <strong>Works!</strong></T>
        </div>
      </div>
      <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>The result is a <strong style={{ color: C.yellow }}>3×3 score matrix</strong> - one score for every pair of words. Exactly what we need.</T>
    </Box></Reveal>

    {/* Sub 4: What each cell means - visual score matrix */}
    <Reveal when={sub >= 4}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color={C.yellow} bold center size={20}>What does Q · K<sup style={{ fontSize: 14 }}>T</sup> actually compute?</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Each cell in the 3×3 result = the dot product of one Query with one Key. That's the "relevance score".</T>
      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto repeat(3, 1fr)", gap: 4, minWidth: 300 }}>
          <div style={{ padding: "4px 8px" }}></div>
          {["K_I", "K_love", "K_cats"].map(h => (
            <div key={h} style={{ padding: "4px", borderRadius: 4, background: `${C.orange}08` }}>
              <T color={C.orange} size={13} bold center>{h}</T>
            </div>
          ))}
          {[
            { q: "Q_I", scores: [0.38, 0.56, 0.74], best: 2 },
            { q: "Q_love", scores: [0.69, 0.54, 0.53], best: 0 },
            { q: "Q_cats", scores: [0.57, 0.54, 0.70], best: 2 },
          ].map(({ q, scores, best }) => (
            <div key={q} style={{ display: "contents" }}>
              <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}08` }}>
                <T color={C.blue} size={13} bold center>{q}</T>
              </div>
              {scores.map((s, i) => (
                <div key={i} style={{ padding: "8px 4px", borderRadius: 6, textAlign: "center", background: i === best ? `${C.yellow}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === best ? `${C.yellow}25` : "transparent"}` }}>
                  <span style={{ fontFamily: "monospace", fontSize: 18, color: i === best ? C.yellow : C.mid, fontWeight: i === best ? 700 : 400 }}>{s.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <T color={C.dim} size={16} style={{ marginTop: 8 }}>Row = one word asking. Column = one word answering. Cell = how relevant the answer-word is to the asker.</T>
    </Box></Reveal>

    {/* Sub 5: Analogy - the classroom seating chart */}
    <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>Analogy: the classroom seating chart</T>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.blue}06`, border: `1px solid ${C.blue}15` }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
          <div>
            <T color={C.blue} bold size={17}>Q (Queries) = each student's question list</T>
            <T color={C.dim} size={15}>3 students, each with a question that has 2 traits (topic, urgency)</T>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}15` }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🔑</span>
          <div>
            <T color={C.orange} bold size={17}>K (Keys) = each student's expertise card</T>
            <T color={C.dim} size={15}>Same 3 students, each has expertise described by 2 traits</T>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}15` }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
          <div>
            <T color={C.yellow} bold size={17}>Q · K<sup style={{ fontSize: 12 }}>T</sup> = the compatibility chart</T>
            <T color={C.dim} size={15}>Every student's question matched against every student's expertise → a 3×3 grid of "how well can you help me?"</T>
          </div>
        </div>
      </div>
      <T color="#80deea" size={18} style={{ marginTop: 10 }}>The transpose just makes this matching possible. Without it, you can't compare every question to every expertise - the shapes won't fit.</T>
    </Box></Reveal>

    {/* Sub 6: Summary */}
    <Reveal when={sub >= 6}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>K<sup style={{ fontSize: 14 }}>T</sup> in one sentence</T>
      <div style={{ margin: "12px 0", padding: "14px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.green}25` }}>
        <T color={C.bright} size={19} center><strong style={{ color: C.yellow }}>K<sup style={{ fontSize: 13 }}>T</sup></strong> is just K with its rows and columns swapped - so that Q · K<sup style={{ fontSize: 13 }}>T</sup> produces a score for <strong>every word pair</strong>.</T>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {[
          { q: "What is T?", a: "Transpose - flip rows ↔ columns", c: C.purple },
          { q: "Why do it?", a: "So the matrix shapes align for multiplication", c: C.blue },
          { q: "Does K change?", a: "No - same numbers, just rearranged", c: C.orange },
          { q: "What's the result?", a: "A word×word score matrix (every pair gets a score)", c: C.yellow },
        ].map(({ q, a, c }) => (
          <div key={q} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}>
            <T color={c} bold size={16} style={{ minWidth: 120, flexShrink: 0 }}>{q}</T>
            <T color={C.dim} size={16}>{a}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    {sub < 6 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const WhySoftmax = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {/* Sub 0: We have raw scores, need to fill in ???s */}
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>After dot products, we have raw scores:</T>
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
          {[{ w: "I", s: "0.38" }, { w: "love", s: "0.56" }, { w: "cats", s: "0.74" }].map(({ w, s }) => (
            <div key={w} style={{ textAlign: "center", padding: "6px 12px", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)` }}>
              <T color={C.dim} size={14}>I → {w}</T>
              <T color={C.bright} bold center size={20}>{s}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>Now we need to <strong>use these scores to blend the Values</strong>:</T>
        <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 8, textAlign: "center" }}>
          <T color={C.bright} size={19} center>output = <strong style={{ color: C.yellow }}>???</strong> × V_I + <strong style={{ color: C.yellow }}>???</strong> × V_love + <strong style={{ color: C.yellow }}>???</strong> × V_cats</T>
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>What should those <strong style={{ color: C.yellow }}>???</strong> be? Can we just plug in the raw scores?</T>
      </Box>
    )}

    {/* Sub 1: Budget analogy */}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={20}>Think of it like a budget.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>You have <strong>₹100</strong> to distribute among three friends based on how helpful they were.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Helpfulness scores: Riya=38, Aman=56, Priya=74</T>
        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.red} bold center size={18}>❌ Can't give ₹38 + ₹56 + ₹74 = ₹168 total. You only have ₹100.</T>
          <T color={C.dim} size={18} style={{ marginTop: 8 }}>You need to convert scores into <strong>shares of ₹100</strong> - percentages that add up to 100%.</T>
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
            <T color={C.dim} size={18}>Total = 38 + 56 + 74 = 168</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {[{ name: "Riya", score: 38, pct: 23, color: C.cyan }, { name: "Aman", score: 56, pct: 33, color: C.orange }, { name: "Priya", score: 74, pct: 44, color: C.yellow }].map(({ name, score, pct, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.dim, fontSize: 16, minWidth: 36 }}>{name}</span>
                  <span style={{ color: C.dim, fontSize: 16, minWidth: 50 }}>{score}/168</span>
                  <span style={{ color: C.dim, fontSize: 16 }}>=</span>
                  <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: color, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 18, minWidth: 30 }}>{pct}%</span>
                  <span style={{ color: C.dim, fontSize: 16 }}>→ ₹{pct}</span>
                </div>
              ))}
            </div>
            <T color={C.green} bold center size={18} style={{ marginTop: 6 }}>✅ Total: ₹100. This works!</T>
          </div>
        </div>
        <T color="#ffe082" size={18} style={{ marginTop: 8 }}>That's basically what softmax does - convert raw scores into shares that add up to 100%. But with one extra trick...</T>
      </Box></Reveal>

    {/* Sub 2: The problem - negative scores */}
    <Reveal when={sub >= 2}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>The problem: dot products CAN be negative.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Our example had positive scores. But what if they were:</T>
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
          {[{ w: "word_A", s: "-3" }, { w: "word_B", s: "1" }, { w: "word_C", s: "5" }].map(({ w, s }) => (
            <div key={w} style={{ textAlign: "center", padding: "6px 10px", borderRadius: 6, background: `${parseFloat(s) < 0 ? C.red : C.green}08`, border: `1px solid ${parseFloat(s) < 0 ? C.red : C.green}15` }}>
              <T color={C.dim} size={12}>{w}</T>
              <T color={parseFloat(s) < 0 ? C.red : C.mid} bold center size={20}>{s}</T>
            </div>
          ))}
        </div>
        <T color="#ff8a80" style={{ marginTop: 10 }}>Simple division: total = -3 + 1 + 5 = 3</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { w: "A", calc: "-3/3 = -100%", problem: "NEGATIVE? Can't pay minus attention!", color: C.red },
            { w: "B", calc: "1/3 = 33%", problem: "", color: C.mid },
            { w: "C", calc: "5/3 = 167%", problem: "MORE THAN 100%? Nonsense!", color: C.red },
          ].map(({ w, calc, problem, color }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: problem ? `${C.red}06` : "rgba(255,255,255,0.02)" }}>
              <span style={{ color: C.dim, fontSize: 16, minWidth: 14 }}>{w}:</span>
              <T color={color} size={18} bold center>{calc}</T>
              {problem && <T color={C.red} size={14}>← {problem}</T>}
            </div>
          ))}
        </div>
        <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>Simple division is broken. We need something better.</T>
      </Box></Reveal>

    {/* Sub 3: The Softmax Formula - e^x trick */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>The Solution: Softmax</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>Before dividing, put each score through <strong>e^score</strong> (e ≈ 2.718). This magical function makes ANY number positive.</T>
        {/* ── Formula SVG ── */}
        <div style={{ margin: "16px 0", padding: "18px 12px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.green}25`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <T color={C.dim} size={13} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>The Softmax Formula</T>
          <svg viewBox="0 0 420 120" style={{ width: "100%", maxWidth: 380, height: "auto" }}>
            {/* σ(z)_i = */}
            <text x="10" y="62" fill={C.bright} fontSize="22" fontFamily="serif" fontStyle="italic">σ</text>
            <text x="26" y="62" fill={C.dim} fontSize="18" fontFamily="serif">(</text>
            <text x="34" y="62" fill={C.cyan} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">z</text>
            <text x="50" y="62" fill={C.dim} fontSize="18" fontFamily="serif">)</text>
            <text x="60" y="72" fill={C.purple} fontSize="14" fontFamily="serif" fontStyle="italic">i</text>
            <text x="82" y="62" fill={C.dim} fontSize="22" fontFamily="serif">=</text>
            {/* Fraction line */}
            <line x1="115" y1="55" x2="300" y2="55" stroke={C.bright} strokeWidth="1.5" />
            {/* Numerator: e^z_i */}
            <text x="185" y="40" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" textAnchor="middle" fontWeight="700">e</text>
            <text x="202" y="26" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">z</text>
            <text x="214" y="32" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">i</text>
            {/* Denominator: Σ e^z_j */}
            <text x="155" y="90" fill={C.yellow} fontSize="22" fontFamily="serif">Σ</text>
            {/* j=1 below sigma */}
            <text x="157" y="108" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">j=1</text>
            {/* K above sigma */}
            <text x="158" y="76" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">K</text>
            <text x="185" y="90" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">e</text>
            <text x="202" y="78" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">z</text>
            <text x="214" y="84" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">j</text>
            {/* Labels */}
            <text x="320" y="34" fill={C.green} fontSize="11" fontFamily="sans-serif">← this word's e^score</text>
            <text x="320" y="90" fill={C.yellow} fontSize="11" fontFamily="sans-serif">← sum of ALL e^scores</text>
          </svg>
        </div>
        <T color="#80e8a5" size={18}>In plain English: <strong>take e to the power of this score, then divide by the sum of e to the power of every score.</strong></T>
      </Box></Reveal>

    {/* Sub 4: Why e^x - the magic property */}
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Why e^x? It's ALWAYS positive.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>No matter what you feed it - negative, zero, huge - the output is always a positive number.</T>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { input: -3, output: 0.05, note: "negative → small positive" },
            { input: 0, output: 1.00, note: "zero → exactly 1" },
            { input: 1, output: 2.72, note: "positive → bigger positive" },
            { input: 5, output: 148.4, note: "large → much larger" },
          ].map(({ input, output, note }) => (
            <div key={input} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <div style={{ minWidth: 60, textAlign: "right" }}>
                <span style={{ fontFamily: "monospace", color: input < 0 ? C.red : C.mid, fontSize: 19 }}>{input}</span>
              </div>
              <span style={{ color: C.dim, fontSize: 20 }}>→</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 15 }}>e^({input}) =</span>
                <span style={{ fontFamily: "monospace", color: C.green, fontWeight: 700, fontSize: 20, minWidth: 50 }}>{output}</span>
              </div>
              {/* Mini bar */}
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden", minWidth: 40 }}>
                <div style={{ width: `${Math.min(output / 148.4 * 100, 100)}%`, height: "100%", borderRadius: 4, background: C.green, minWidth: output > 0 ? 2 : 0 }} />
              </div>
              <T color={C.dim} size={13}>{note}</T>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
          <T color="#b8a9ff" size={18} center>Notice the pattern: <strong>higher input → exponentially bigger output</strong>. This means softmax naturally amplifies the winner.</T>
        </div>
      </Box></Reveal>

    {/* Sub 5: Full walkthrough with negative scores */}
    <Reveal when={sub >= 5}><Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Full Walkthrough: scores [-3, 1, 5]</T>
        {/* Step 1 */}
        <div style={{ marginTop: 12, padding: "12px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.purple}20` }}>
          <T color={C.purple} bold size={16}>Step 1: Apply e^score to each</T>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "10px 0" }}>
            {[{ s: -3, e: "0.05", c: C.red }, { s: 1, e: "2.72", c: C.mid }, { s: 5, e: "148.4", c: C.green }].map(({ s, e, c }) => (
              <div key={s} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ padding: "4px 6px", borderRadius: 4, background: `${c}08`, marginBottom: 4 }}>
                  <T color={c} bold center size={18}>{s}</T>
                </div>
                <T color={C.dim} size={12} center>↓ e^({s})</T>
                <div style={{ padding: "4px 6px", borderRadius: 4, background: `${C.green}08`, marginTop: 4 }}>
                  <T color={C.green} bold center size={18}>{e}</T>
                </div>
              </div>
            ))}
          </div>
          <T color={C.dim} size={15} center>All negative numbers became positive!</T>
        </div>
        {/* Step 2 */}
        <div style={{ marginTop: 8, padding: "12px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.yellow}20` }}>
          <T color={C.yellow} bold size={16}>Step 2: Sum them all up (the denominator)</T>
          <div style={{ marginTop: 6, textAlign: "center" }}>
            <T color={C.dim} size={18} center>0.05 + 2.72 + 148.4 = <strong style={{ color: C.yellow, fontSize: 22 }}>151.17</strong></T>
          </div>
        </div>
        {/* Step 3 */}
        <div style={{ marginTop: 8, padding: "12px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.green}20` }}>
          <T color={C.green} bold size={16}>Step 3: Divide each e^score by the sum</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { w: "A", score: -3, eVal: "0.05", pct: 0.03, color: C.cyan },
              { w: "B", score: 1, eVal: "2.72", pct: 1.8, color: C.orange },
              { w: "C", score: 5, eVal: "148.4", pct: 98.2, color: C.yellow },
            ].map(({ w, score, eVal, pct, color }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 14, minWidth: 52 }}>{w} ({score})</span>
                <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 14, minWidth: 80 }}>{eVal}/151.17</span>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(pct, 0.5)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${color}80, ${color})`, transition: "width 0.4s" }} />
                </div>
                <span style={{ color, fontWeight: 700, fontSize: 17, minWidth: 44, textAlign: "right" }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={15} bold center>All positive ✓</T></div>
          <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={15} bold center>Sum = 100% ✓</T></div>
          <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={15} bold center>Ranking preserved ✓</T></div>
        </div>
      </Box></Reveal>

    {/* Sub 6: Amplification + why scale first */}
    <Reveal when={sub >= 6}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={20}>Softmax amplifies differences - by design.</T>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
            <T color={C.dim} size={13}>Raw scores</T>
            <T color={C.mid} bold size={20} center>-3, 1, 5</T>
            <T color={C.dim} size={12} center>Gap: 1 to 5 = just 4</T>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}><T color={C.dim} size={24}>→</T></div>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.yellow}08`, textAlign: "center" }}>
            <T color={C.dim} size={13}>After e^x</T>
            <T color={C.yellow} bold size={20} center>0.05, 2.72, 148.4</T>
            <T color={C.dim} size={12} center>Gap: 2.72 to 148 = 145!</T>
          </div>
        </div>
        <T color="#ffe082" size={18} style={{ marginTop: 10 }}>The highest score doesn't just win - it <strong>dominates</strong>. This is good: the most relevant word SHOULD stand out.</T>
        <T color="#ffe082" size={18} style={{ marginTop: 8 }}><strong>But</strong> - if scores are too huge (like 12, 18, 25), softmax amplifies TOO aggressively → 99.99% on one word. That's why we <strong>scale first</strong> (next chapter) to keep scores in a useful range.</T>
      </Box></Reveal>

    {/* Sub 7: Formula recap with visual summary */}
    <Reveal when={sub >= 7}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Softmax: the complete picture</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
            <span style={{ background: `${C.purple}20`, color: C.purple, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, flexShrink: 0 }}>1</span>
            <div style={{ flex: 1 }}>
              <T color={C.purple} bold size={18}>e^score for each score</T>
              <T color={C.dim} size={15}>Makes everything positive - even e^(-1000) is positive</T>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
            <span style={{ background: `${C.yellow}20`, color: C.yellow, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, flexShrink: 0 }}>2</span>
            <div style={{ flex: 1 }}>
              <T color={C.yellow} bold size={18}>Divide each by the total sum</T>
              <T color={C.dim} size={15}>Now everything adds up to exactly 1.0 (100%)</T>
            </div>
          </div>
        </div>
        {/* Mini formula reminder */}
        <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,0,0,0.4)", borderRadius: 8, textAlign: "center" }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1 }}>FORMULA</T>
          <T color={C.bright} bold center size={20} style={{ fontFamily: "serif", marginTop: 4 }}>softmax(z<sub style={{ fontSize: 14 }}>i</sub>) = e<sup style={{ fontSize: 14 }}>z<sub style={{ fontSize: 10 }}>i</sub></sup> / Σ e<sup style={{ fontSize: 14 }}>z<sub style={{ fontSize: 10 }}>j</sub></sup></T>
        </div>
        <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>Output: valid percentages (all positive, sum to 100%) that respect the original ranking. But raw scores can be too big for softmax - that's the next problem to solve →</T>
      </Box></Reveal>

    {sub < 7 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const ScaleByRootDk = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {/* Sub 0: The core problem */}
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>The problem: dot products grow with dimensions.</T>
        <T color={C.orange} style={{ marginTop: 6 }}>Remember, the dot product = multiply each pair, then <strong>sum all of them</strong>. More dimensions means more pairs being added up:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* 2 dims */}
          <div style={{ padding: "8px 10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold center size={18}>2 dimensions → sum 2 terms</T>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
              {["0.24", "0.14"].map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 4, background: `${C.green}15`, color: C.green, fontSize: 18, fontFamily: "monospace", fontWeight: 600 }}>{v}</span>
                  {i < 1 && <span style={{ color: C.dim, fontSize: 18 }}>+</span>}
                </div>
              ))}
              <span style={{ color: C.dim, fontSize: 18 }}>=</span>
              <span style={{ color: C.green, fontWeight: 700, fontSize: 20 }}>0.38</span>
            </div>
          </div>
          {/* 64 dims */}
          <div style={{ padding: "8px 10px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
            <T color={C.orange} bold center size={18}>64 dimensions → sum 64 terms</T>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
              {["term₁", "term₂", "term₃"].map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "3px 6px", borderRadius: 4, background: `${C.orange}12`, color: C.orange, fontSize: 14, fontFamily: "monospace" }}>{v}</span>
                  <span style={{ color: C.dim, fontSize: 18 }}>+</span>
                </div>
              ))}
              <span style={{ color: C.dim, fontSize: 14 }}>... + term₆₄</span>
              <span style={{ color: C.dim, fontSize: 18 }}>=</span>
              <span style={{ color: C.orange, fontWeight: 700, fontSize: 20 }}>~25</span>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}>64 small numbers added up → much bigger total</T>
          </div>
          {/* 512 dims */}
          <div style={{ padding: "8px 10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
            <T color={C.red} bold center size={18}>512 dimensions → sum 512 terms</T>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
              {["term₁", "term₂", "term₃"].map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "3px 6px", borderRadius: 4, background: `${C.red}12`, color: C.red, fontSize: 14, fontFamily: "monospace" }}>{v}</span>
                  <span style={{ color: C.dim, fontSize: 18 }}>+</span>
                </div>
              ))}
              <span style={{ color: C.dim, fontSize: 14 }}>... + term₅₁₂</span>
              <span style={{ color: C.dim, fontSize: 18 }}>=</span>
              <span style={{ color: C.red, fontWeight: 700, fontSize: 20 }}>~180</span>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}>512 small numbers added up → huge total</T>
          </div>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 8 }}>Each individual term might be small (like 0.3 or 0.5). But when you add up 64 or 512 of them, the total becomes very large. The score grows just because of more dimensions - not because the words are more related.</T>
      </Box>
    )}

    {/* Sub 1: Why big scores are bad - softmax comparison */}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>Why are big scores a problem?</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Remember: softmax uses e^score. When scores are big, e^big_number becomes <strong>astronomically</strong> huge, and one word gets 99.99% of the attention - the model becomes blind to everything else.</T>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={16} center>Small scores (2-dim)</T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>[0.38, 0.56, 0.74]</T>
            <div style={{ marginTop: 6 }}>
              {[{ w: "I", pct: 28, c: C.cyan }, { w: "love", pct: 33, c: C.orange }, { w: "cats", pct: 39, c: C.yellow }].map(({ w, pct, c }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: C.dim, minWidth: 28 }}>{w}</span>
                  <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: c, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 14, color: c, fontWeight: 600, minWidth: 26 }}>{pct}%</span>
                </div>
              ))}
            </div>
            <T color={C.green} size={12} center style={{ marginTop: 4 }}>✅ Looks at ALL words. Can blend info from multiple sources.</T>
          </div>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} bold size={16} center>Huge scores (64-dim)</T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>[12.1, 17.8, 25.6]</T>
            <div style={{ marginTop: 6 }}>
              {[{ w: "I", pct: 0.1, c: C.dim }, { w: "love", pct: 0.4, c: C.dim }, { w: "cats", pct: 99.6, c: C.red }].map(({ w, pct, c }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: C.dim, minWidth: 28 }}>{w}</span>
                  <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(pct, 1)}%`, height: "100%", borderRadius: 4, background: c, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 14, color: c, fontWeight: 600, minWidth: 32 }}>{pct < 1 ? `${pct}%` : `${pct}%`}</span>
                </div>
              ))}
            </div>
            <T color={C.red} size={12} center style={{ marginTop: 4 }}>❌ 99.6% on ONE word. Others invisible. Can't blend info.</T>
          </div>
        </div>
      </Box></Reveal>

    {/* Sub 2: The fix */}
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>The fix: divide by √d_k</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>If d_k = 64, then √64 = 8. Dividing brings scores back to a manageable range:</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.dim} size={18}>Before scaling: <strong style={{ color: C.red }}>[12.1, 17.8, 25.6]</strong></T>
          <T color={C.dim} size={18} style={{ marginTop: 4 }}>Divide by √64 = 8:</T>
          <T color={C.green} bold center size={19} style={{ marginTop: 4 }}>After scaling: <strong>[1.51, 2.23, 3.20]</strong></T>
        </div>
        <div style={{ marginTop: 8 }}>
          <T color={C.dim} size={16}>Softmax of [1.51, 2.23, 3.20]:</T>
          <div style={{ marginTop: 4 }}>
            {[{ w: "I", pct: 14, c: C.cyan }, { w: "love", pct: 28, c: C.orange }, { w: "cats", pct: 58, c: C.yellow }].map(({ w, pct, c }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                <span style={{ fontSize: 14, color: C.dim, minWidth: 32 }}>{w}</span>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${c}80, ${c})`, transition: "width 0.4s" }} />
                </div>
                <span style={{ fontSize: 16, color: c, fontWeight: 700, minWidth: 30 }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <T color="#80e8a5" size={18} style={{ marginTop: 6 }}>✅ <strong>Focuses on the most relevant word (58%)</strong> but still gathers info from others (14%, 28%). That's exactly what you want.</T>
      </Box></Reveal>

    {/* Sub 3: Why sqrt specifically */}
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center>Why √d_k specifically? Why not ÷2 or ÷100?</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>There's a mathematical reason. When Q and K have random values, the dot product's <strong>variance grows proportionally to d_k</strong>. The standard deviation = √d_k. So dividing by √d_k brings the variance back to 1 - normalizing scores to a consistent range no matter the dimension.</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>In simple terms: √d_k is the <strong>exact right amount</strong> to undo the growth caused by summing d_k terms. Not too much (all scores become equal), not too little (problem remains).</T>
      </Box></Reveal>

    {/* Sub 4: Our example scaled */}
    <Reveal when={sub >= 4}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Back to our example (d_k = 2, √2 ≈ 1.41):</T>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "55px repeat(3, 1fr)", gap: 4 }}>
            <div></div>
            {["K_I", "K_love", "K_cats"].map(h => <T key={h} color={C.orange} size={14} bold center>{h}</T>)}
            {[{ q: "Q_I", s: [0.27, 0.40, 0.52] }, { q: "Q_love", s: [0.49, 0.38, 0.38] }, { q: "Q_cats", s: [0.40, 0.38, 0.50] }].map(({ q, s: sc }) => (
              <div key={q} style={{ display: "contents" }}>
                <T color={C.blue} size={16} bold center>{q}</T>
                {sc.map((v, i) => (<div key={i} style={{ textAlign: "center", padding: "6px", borderRadius: 5, background: "rgba(255,255,255,0.02)" }}><span style={{ fontFamily: "monospace", fontSize: 19, color: C.mid }}>{v.toFixed(2)}</span></div>))}
              </div>
            ))}
          </div>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 6 }}>Our scores were already small (2-dim), so scaling barely changes them. In a real 64-dim model, scaling is the difference between a useful model and a broken one.</T>
        <T color={C.yellow} size={18} bold center style={{ marginTop: 6 }}>Now let's apply softmax to these scaled scores →</T>
      </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH: Why Do We Need Softmax? ═══════

export const SoftmaxProbs = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>Let's apply softmax step-by-step</T>
        <T color="#ce93d8" style={{ marginTop: 6 }}>We have scaled scores for "I" looking at each word: <strong>[0.27, 0.40, 0.52]</strong></T>
        {/* Visual: the formula applied */}
        <div style={{ margin: "12px 0", padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.pink}20` }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Step 1: e^score for each</T>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[{ w: "I", s: 0.27, e: 1.31 }, { w: "love", s: 0.40, e: 1.49 }, { w: "cats", s: 0.52, e: 1.68 }].map(({ w, s, e }) => (
              <div key={w} style={{ textAlign: "center", flex: 1 }}>
                <T color={C.dim} size={12}>{w}</T>
                <div style={{ padding: "4px", borderRadius: 4, background: `${C.pink}08`, margin: "4px 0" }}>
                  <T color={C.mid} size={15} center>e^{s}</T>
                </div>
                <T color={C.dim} size={14} center>↓</T>
                <div style={{ padding: "6px", borderRadius: 6, background: `${C.pink}12` }}>
                  <T color={C.pink} bold center size={20}>{e}</T>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}20` }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Step 2: Sum all e^scores</T>
          <T color={C.yellow} bold center size={20}>1.31 + 1.49 + 1.68 = 4.48</T>
        </div>
        <div style={{ marginTop: 8, padding: "12px 14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.green}20` }}>
          <T color={C.dim} size={13} center style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Step 3: Divide each by sum</T>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[{ w: "I", e: 1.31, p: "0.29" }, { w: "love", e: 1.49, p: "0.33" }, { w: "cats", e: 1.68, p: "0.37" }].map(({ w, e, p }) => (
              <div key={w} style={{ textAlign: "center", flex: 1, padding: "8px 4px", borderRadius: 8, background: `${C.green}06` }}>
                <T color={C.dim} size={12}>{w}</T>
                <T color={C.dim} size={14} center>{e} / 4.48</T>
                <T color={C.green} bold center size={22}>{p}</T>
              </div>
            ))}
          </div>
          <T color={C.green} bold center size={16} style={{ marginTop: 6 }}>0.29 + 0.33 + 0.37 = 1.0 ✓</T>
        </div>
      </Box>
    )}

    {/* Sub 1: Meaning - what the numbers tell us */}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>What do these numbers mean?</T>
        <T color="#80deea" style={{ marginTop: 6 }}>When the word "I" looks at the sentence "I love cats":</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { w: "I → I", pct: 29, c: C.cyan, note: "29% attention to itself" },
            { w: "I → love", pct: 33, c: C.orange, note: "33% attention to \"love\"" },
            { w: "I → cats", pct: 37, c: C.yellow, note: "37% attention to \"cats\" (most relevant!)" },
          ].map(({ w, pct, c, note }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.dim, fontSize: 14, minWidth: 60 }}>{w}</span>
              <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.04)", borderRadius: 7, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 7, background: `linear-gradient(90deg, ${c}80, ${c})`, transition: "width 0.4s" }} />
              </div>
              <span style={{ color: c, fontWeight: 700, fontSize: 17, minWidth: 32 }}>{pct}%</span>
              <T color={C.dim} size={13}>{note}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" size={18} style={{ marginTop: 8 }}>These scores are close because our 2-dim example is tiny. In a real 512-dim model, the differences would be much sharper.</T>
      </Box></Reveal>

    {/* Sub 2: Full attention weight matrix */}
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Full attention weight matrix (all rows softmax'd)</T>
        <T color={C.dim} size={16} style={{ marginTop: 4 }}>Every word does the same process - softmax its own row of scores:</T>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px repeat(3, 1fr)", gap: 4 }}>
            <div></div>
            {["I", "love", "cats"].map(h => <T key={h} color={C.mid} size={16} bold center>{h}</T>)}
            {[
              { w: "\"I\":", s: [0.29, 0.33, 0.37], mx: 2 },
              { w: "\"love\":", s: [0.37, 0.32, 0.31], mx: 0 },
              { w: "\"cats\":", s: [0.32, 0.32, 0.36], mx: 2 },
            ].map(({ w, s: sc, mx }) => (
              <div key={w} style={{ display: "contents" }}>
                <T color={C.mid} size={14} bold center>{w}</T>
                {sc.map((v, i) => (<div key={i} style={{ textAlign: "center", padding: "6px", borderRadius: 5, background: i === mx ? `${C.yellow}12` : "rgba(255,255,255,0.02)" }}><span style={{ fontFamily: "monospace", fontSize: 19, color: i === mx ? C.yellow : C.mid, fontWeight: i === mx ? 700 : 400 }}>{v.toFixed(2)}</span></div>))}
              </div>
            ))}
          </div>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 6 }}>Each row sums to 1.0. These are the "attention weights" - they tell each word how much to borrow from every other word. Next: we'll use them to actually blend the Values →</T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const WeightedSum = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Use attention weights to blend Values.</T>
        <T color="#80e8a5" style={{ marginTop: 4 }}>For "I" (weights: 0.29, 0.33, 0.37):</T>
        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          {[
            { w: "0.29", vl: "V_I = [1.0, -0.5]", r: "[0.290, -0.145]", c: C.red },
            { w: "0.33", vl: "V_love = [0.3, 0.8]", r: "[0.099, 0.264]", c: C.purple },
            { w: "0.37", vl: "V_cats = [-0.2, 0.9]", r: "[-0.074, 0.333]", c: C.cyan },
          ].map(({ w, vl, r, c }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ color: C.yellow, fontSize: 18, fontWeight: 700 }}>{w}</span>
              <span style={{ color: C.dim, fontSize: 18 }}>×</span>
              <code style={{ color: `${c}aa`, fontSize: 16 }}>{vl}</code>
              <span style={{ color: C.dim, fontSize: 18 }}>=</span>
              <code style={{ color: c, fontSize: 16, fontWeight: 600 }}>{r}</code>
            </div>
          ))}
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
            <T color={C.dim} size={18}>Sum:</T>
            <T color={C.yellow} bold center size={20}>[0.29, -0.145] + [0.099, 0.264] + [-0.074, 0.333] = <span style={{ color: C.green }}>[0.315, 0.452]</span></T>
          </div>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow}><T color={C.yellow} bold center>This [0.315, 0.452] is the NEW vector for "I".</T><T color="#ffe082" style={{ marginTop: 4 }}>It's no longer just about "I". It has absorbed context from "love" (33%) and "cats" (37%). It's now a <strong>context-aware representation</strong>. Same happens for every word.</T></Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

export const FullFormula = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 14, padding: "20px", border: `1px solid ${C.yellow}25`, width: "100%" }}>
        <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Everything above in one line</T>
        <T color={C.yellow} bold size={24} center>Attention(Q, K, V) = softmax( Q·K<sup>T</sup> / √d<sub>k</sub> ) · V</T>
      </div>
    )}
    <Reveal when={sub >= 1}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%" }}>
        {[
          { f: "Q · Kᵀ", m: "Dot product of every query with every key", r: "score matrix", c: C.blue },
          { f: "/ √d_k", m: "Scale down to prevent extreme softmax", r: "manageable scores", c: C.orange },
          { f: "softmax", m: "Convert to probabilities (rows sum to 1)", r: "attention weights", c: C.pink },
          { f: "· V", m: "Weighted sum of values", r: "context-aware output", c: C.green },
        ].map(({ f, m, r, c }, idx) => (
          <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {idx > 0 && <div style={{ width: 2, height: 16, background: "rgba(255,255,255,0.1)" }} />}
            <div style={{ padding: "10px 14px", borderRadius: 10, background: `${c}08`, border: `1px solid ${c}18`, width: "100%", display: "flex", alignItems: "center", gap: 12 }}>
              <code style={{ color: c, fontWeight: 800, fontSize: 20, minWidth: 100, textAlign: "center", padding: "12px 10px", background: `${c}12`, borderRadius: 6, flexShrink: 0 }}>{f}</code>
              <div>
                <T color={C.mid} size={16}>{m}</T>
                <T color={c} size={14} bold>→ {r}</T>
              </div>
            </div>
          </div>
        ))}
      </div></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 18: Why Multi-Head - The Compromise Problem ═══════

export const WhyMultiHead = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>Single-head attention has a problem.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Our "I love cats" example has only 3 words with 2 main relationships (who loves? what's loved?). To really see why one head isn't enough, we need a longer sentence with MORE relationships.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Consider: "The cat that I adopted last week <strong>sat</strong> on the mat."</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>"sat" needs answers to MULTIPLE questions at once:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { q: "Who sat?", answer: "cat", rel: "subject ↔ verb", color: C.cyan },
            { q: "Sat where?", answer: "mat", rel: "verb ↔ location", color: C.orange },
            { q: "Sat when?", answer: "last week", rel: "verb ↔ time", color: C.purple },
          ].map(({ q, answer, rel, color }) => (
            <div key={q} style={{ display: "grid", gridTemplateColumns: "80px auto 1fr", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
              <T color={color} bold center size={18}>{q}</T>
              <div style={{ display: "flex", justifyContent: "center" }}><Tag color={color}>{answer}</Tag></div>
              <T color={C.dim} size={14}>{rel}</T>
            </div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>But one head produces ONE set of weights - forced to compromise:</T>
        <div style={{ marginTop: 8 }}>
          {[
            { w: "cat", pct: 40, c: C.cyan, note: "got some" },
            { w: "mat", pct: 30, c: C.orange, note: "got some" },
            { w: "last week", pct: 5, c: C.purple, note: "almost NOTHING!" },
            { w: "others", pct: 25, c: C.dim, note: "scattered" },
          ].map(({ w, pct, c, note }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 16, color: C.dim, minWidth: 70, textAlign: "right" }}>{w}</span>
              <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: c }} />
              </div>
              <span style={{ fontSize: 16, color: c, fontWeight: 600, minWidth: 28 }}>{pct}%</span>
              <span style={{ fontSize: 12, color: pct <= 5 ? C.red : C.dim }}>{note}</span>
            </div>
          ))}
        </div>
        <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>Temporal info ("last week") got only 5% - almost lost! One head can't focus on all relationships.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Solution: give it MULTIPLE heads - like multiple ears.</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>Each head has its OWN W_Q, W_K, W_V, so each asks a DIFFERENT question:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { head: 1, label: "subject-verb", q: "\"who is my subject?\"", finds: "cat (70%)", color: C.cyan },
            { head: 2, label: "verb-location", q: "\"where am I happening?\"", finds: "mat (65%)", color: C.orange },
            { head: 3, label: "temporal", q: "\"when am I happening?\"", finds: "week (55%)", color: C.purple },
          ].map(({ head, label, q, finds, color }) => (
            <div key={head} style={{ display: "grid", gridTemplateColumns: "84px 1fr 74px", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
              <div><T color={color} bold center size={16}>Head {head}</T><T color={C.dim} center size={12}>{label}</T></div>
              <T color={C.dim} size={16}>sat asks: {q}</T>
              <T color={color} bold center size={16} style={{ textAlign: "right" }}>→ {finds}</T>
            </div>
          ))}
        </div>
        <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>Now NO info is lost. Each head specializes in one relationship and captures it fully.</T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 19: The Split ═══════

export const HeadSplit = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>One set of three grids can only ask ONE type of question.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>"love"'s Query can point in only one direction. So we create 8 sets of three grids. Each set starts with different random numbers → gets nudged differently during training → ends up asking a different type of question.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>We DON'T run the full thing 8 times - that would be 8× the computation. Instead, we <strong>split the dimensions</strong>:</T>
        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[{ l: "Total dimensions:", v: "512" }, { l: "Number of heads:", v: "8" }, { l: "Dims per head:", v: "512 ÷ 8 = 64" }].map(({ l, v }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={C.mid} size={18}>{l}</T><T color={C.yellow} bold center size={20}>{v}</T>
              </div>
            ))}
          </div>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>We create 8 sets of three grids.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Each set has its own W_Q, W_K, W_V - all starting with different random numbers, all trained independently:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          {[1, 2, 3].map(n => {
            const c = [C.cyan, C.purple, C.orange][n - 1];
            const learns = ["who does the action?", "action done to what?", "what kind of action?"][n - 1];
            return (
              <div key={n} style={{ padding: "8px 10px", borderRadius: 6, background: `${c}06`, border: `1px solid ${c}12` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={c} bold center size={19} style={{ whiteSpace: "nowrap" }}>Set {n}</T>
                  <T color={c} size={16}>→ learns "{learns}"</T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>W_Q{n} [512×64], W_K{n} [512×64], W_V{n} [512×64]</T>
              </div>
            );
          })}
          <T color={C.dim} size={16} center>... same for sets 4, 5, 6, 7, 8</T>
        </div>
        <T color="#80deea" size={18} style={{ marginTop: 8 }}>Same input embedding goes into ALL 8 sets. Each set's different grids extract different aspects - 8 different Q, K, V outputs, 8 different attention patterns. Each head produces its own output - a list of numbers per word.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Think of 8 different X-ray machines.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Same patient (embedding) goes into all 8. Each tuned to see something different:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { h: 1, sees: "bones (subject-verb structures)", c: C.cyan },
            { h: 2, sees: "muscles (location relationships)", c: C.orange },
            { h: 3, sees: "blood flow (temporal patterns)", c: C.purple },
            { h: 4, sees: "nerves (nearby word connections)", c: C.yellow },
          ].map(({ h, sees, c }) => (
            <div key={h} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 5, background: `${c}06` }}>
              <T color={c} bold center size={16}>Head {h}</T>
              <T color={C.dim} size={16}>→ sees {sees}</T>
            </div>
          ))}
          <T color={C.dim} size={14} center>...and 4 more, each with a different "tuning"</T>
        </div>
        <T color="#ffe082" size={18} style={{ marginTop: 8 }}>Same input, 8 perspectives. The W matrices create these "tunings" - learned during training.</T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 20: Inside Each Head ═══════

export const InsideEachHead = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color={C.blue} bold center size={20}>Each head runs the FULL attention algorithm.</T>
        <T color={C.dim} size={18} style={{ marginTop: 4 }}>Exactly Steps 1–5 we learned, but in 64 dims instead of 512:</T>
        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.dim} size={16} style={{ fontFamily: "monospace", lineHeight: 2.2 }}>
            <strong style={{ color: C.blue }}>For Head 1:</strong><br />
            &nbsp;&nbsp;Q₁ = embedding × W_Q₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span><br />
            &nbsp;&nbsp;K₁ = embedding × W_K₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span><br />
            &nbsp;&nbsp;V₁ = embedding × W_V₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span><br /><br />
            &nbsp;&nbsp;scores₁ = Q₁ · K₁ᵀ / √64 <span style={{ color: C.dim }}>[3×3 score matrix]</span><br />
            &nbsp;&nbsp;weights₁ = softmax(scores₁) <span style={{ color: C.dim }}>[3×3 attention weights]</span><br />
            &nbsp;&nbsp;output₁ = weights₁ × V₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
          </T>
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 6 }}>Same runs for all 8 heads. Each produces [3 words × 64 dims].</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center>The KEY: each head's attention weights are DIFFERENT.</T>
        <T color={C.dim} size={18} style={{ marginTop: 4 }}>Because their W_Q, W_K, W_V are different. Here's what "sat" sees in each head:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { head: 1, label: "subject-verb", c: C.cyan, bars: [{ w: "cat", p: 70 }, { w: "mat", p: 8 }, { w: "week", p: 5 }, { w: "others", p: 17 }] },
            { head: 2, label: "verb-location", c: C.orange, bars: [{ w: "cat", p: 10 }, { w: "mat", p: 65 }, { w: "week", p: 8 }, { w: "others", p: 17 }] },
            { head: 3, label: "temporal", c: C.purple, bars: [{ w: "cat", p: 8 }, { w: "mat", p: 7 }, { w: "week", p: 55 }, { w: "others", p: 30 }] },
          ].map(({ head, label, c, bars }) => (
            <div key={head} style={{ padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}>
              <T color={c} bold center size={16}>Head {head} - "sat" attends to: ({label})</T>
              <div style={{ marginTop: 6 }}>
                {bars.map(({ w, p }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, color: C.dim, minWidth: 40 }}>{w}</span>
                    <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${p}%`, height: "100%", borderRadius: 4, background: p > 30 ? c : `${c}40` }} />
                    </div>
                    <span style={{ fontSize: 12, color: p > 30 ? c : C.dim, fontWeight: p > 30 ? 700 : 400, minWidth: 24 }}>{p}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 8 }}>Each head found what the single head missed. Head 3 got "last week" at 55% - single head only gave it 5%.</T>
      </Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 21: Concat + W_O ═══════

export const ConcatWO = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {/* Sub 0: Step 7 - outputs are separate */}
    {sub >= 0 && (
      <Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={20}>The outputs are separate - we need to combine them.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>After the 8 heads finish, each word has 8 separate results. For "love":</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { head: "Head 1 gave:", v: "[0.3, 0.5]", info: "figured out \"I\" is the one who loves", c: C.blue },
            { head: "Head 2 gave:", v: "[-0.2, 0.8]", info: "figured out \"cats\" is what's loved", c: C.purple },
            { head: "Head 3 gave:", v: "[0.7, -0.1]", info: "figured out the sentiment is positive", c: C.orange },
          ].map(({ head, v, info, c }) => (
            <div key={head} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 5, background: `${c}06` }}>
              <T color={c} bold center size={16}>{head}</T>
              <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
              <T color={C.dim} size={14}>← {info}</T>
            </div>
          ))}
          <T color={C.dim} size={14} center>... 8 results total</T>
        </div>
        <T color="#ffe082" bold center style={{ marginTop: 8 }}>We stick them end-to-end (concatenate):</T>
        <div style={{ marginTop: 4, padding: "8px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.mid} size={16} mono>[0.3, 0.5, -0.2, 0.8, 0.7, -0.1, ..., 0.1, 0.4]</T>
        </div>
        <T color="#ffe082" style={{ marginTop: 6 }}>One long list - 512 numbers. But there's a problem.</T>
      </Box>
    )}

    {/* Sub 1: Step 8 - Sealed envelopes */}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>The problem - these results are like 8 sealed envelopes.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Imagine 8 detectives investigated the same crime. Each wrote their findings on a piece of paper and sealed it in an envelope.</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { env: "✉️ Envelope 1:", finding: "\"The suspect is male, 30s\"", c: C.cyan },
            { env: "✉️ Envelope 2:", finding: "\"It happened at the park\"", c: C.orange },
            { env: "✉️ Envelope 3:", finding: "\"It was Tuesday evening\"", c: C.purple },
            { env: "✉️ Envelope 4:", finding: "\"The weapon was a knife\"", c: C.yellow },
          ].map(({ env, finding, c }) => (
            <div key={env} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 5, background: `${c}06` }}>
              <T color={c} bold center size={16} style={{ whiteSpace: "nowrap" }}>{env}</T>
              <T color={C.mid} size={16}>{finding}</T>
            </div>
          ))}
          <T color={C.dim} size={14} center>...</T>
        </div>
        <T color="#ff8a80" style={{ marginTop: 8 }}>Now someone tapes all 8 envelopes together in a row. That's concatenation - they're physically together, but each envelope is still <strong>sealed</strong>. The information inside Envelope 1 has NO idea what Envelope 2 says.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>If your boss asks: "Give me a one-line summary of this case" - you can't answer from any single envelope. Envelope 1 only knows about the suspect. Envelope 2 only knows about the location. Nobody has the full picture.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>That's exactly the problem with just concatenating. The numbers in positions 1-2 (from Head 1) only know about subject-verb. The numbers in positions 3-4 (from Head 2) only know about verb-object. They're taped together but not talking.</T>
        <T color="#ff8a80" bold center size={18} style={{ marginTop: 6 }}>We need someone to open ALL the envelopes, read everything, and write one combined summary.</T>
      </Box></Reveal>

    {/* Sub 2: Step 9 - W_O */}
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>W_O - the person who opens all the envelopes.</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>W_O is one more grid of numbers. Just like W_Q, W_K, W_V - it's a table of numbers. Nothing new or special about what it IS. It works the same way: multiply input by a grid → get an output.</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>But what it <strong>DOES</strong> is special. When you multiply the concatenated list by W_O, every number in the output is computed by reading ALL numbers in the input.</T>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
            <T color="#ff8a80" bold size={16} center>Before W_O</T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>Position 1 = 0.3</T>
            <T color={C.dim} size={12} center>(only knows Head 1's finding)</T>
          </div>
          <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color="#80e8a5" bold size={16} center>After W_O</T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>Position 1 = blend of 0.3 + (-0.2) + 0.7 + ... all positions</T>
            <T color={C.dim} size={12} center>= knows Head 1 + Head 2 + Head 3 + ... everything</T>
          </div>
        </div>
        <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>It's like the combined summary: <em>"A male suspect in his 30s used a knife at the park on Tuesday evening."</em> One sentence that contains information from ALL envelopes.</T>
        <T color="#80e8a5" size={18} style={{ marginTop: 6 }}>After W_O, every single position in the output carries a mix of what all 8 heads found. The envelopes have been opened, read, and combined.</T>
      </Box></Reveal>

    {/* Sub 3: Step 10 - W_O training */}
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Where did W_O's numbers come from?</T>
        <T color={C.orange} style={{ marginTop: 6 }}>Same exact process as all other grids:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { n: 1, text: "Start with random numbers", c: C.red },
            { n: 2, text: "Model tries to predict next word, gets it wrong", c: C.orange },
            { n: 3, text: "Error flows backward, nudges each number in W_O", c: C.yellow },
            { n: 4, text: "\"If this number were 0.31 instead of 0.30, the blending would have been better → change to 0.31\"", c: C.purple },
            { n: 5, text: "Repeat billions of times", c: C.blue },
            { n: 6, text: "W_O settles into numbers that produce good blends", c: C.green },
          ].map(({ n, text, c }) => (
            <div key={n} style={{ display: "flex", gap: 6, alignItems: "center", padding: "5px 8px", borderRadius: 5, background: `${c}06` }}>
              <span style={{ color: c, fontWeight: 800, fontSize: 16, minWidth: 16 }}>{n}.</span>
              <T color={C.mid} size={16}>{text}</T>
            </div>
          ))}
        </div>
        <T color={C.orange} style={{ marginTop: 8 }}>The training discovers the best way to combine the 8 heads' findings into one useful output. Nobody programs this - it emerges from training.</T>
      </Box></Reveal>

    {/* Sub 4: Connect back to I love cats */}
    <Reveal when={sub >= 4}><Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Back to "I love cats" - what W_O does for "love":</T>
        <T color={C.orange} style={{ marginTop: 6 }}>After 8 heads run, "love"'s concatenated vector has:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { range: "Dims 1–64", info: "Head 1 found: \"I\" is the subject who loves", c: C.cyan },
            { range: "Dims 65–128", info: "Head 2 found: \"cats\" is the object being loved", c: C.orange },
            { range: "Dims 129–192", info: "Head 3 found: this is a positive sentiment", c: C.purple },
          ].map(({ range, info, c }) => (
            <div key={range} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 5, background: `${c}06` }}>
              <T color={c} bold center size={14} style={{ minWidth: 68 }}>{range}</T>
              <T color={C.dim} size={14}>{info}</T>
            </div>
          ))}
        </div>
        <T color={C.orange} style={{ marginTop: 8 }}>Without W_O: each section is isolated. Dim 1 has no idea "cats" is involved.</T>
        <T color={C.orange} style={{ marginTop: 6 }}>After W_O: <strong>every dimension</strong> of "love"'s output encodes the combined meaning: "affection from 'I' directed at 'cats', with positive sentiment." One rich, integrated vector.</T>
        <T color={C.orange} size={18} style={{ marginTop: 6 }}>This is what we set out to do in Chapter 1 - transform "love" from an isolated word into a context-aware representation.</T>
      </Box></Reveal>

    {/* Sub 5: Why W_O is learned, not hardcoded */}
    <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>W_O is LEARNED - not hardcoded.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>The model discovers during training which combinations of head outputs are useful. Different layers learn different W_O matrices:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { layer: "Layer 1's W_O", learns: "might focus on combining basic syntax patterns", c: C.cyan },
            { layer: "Layer 3's W_O", learns: "might focus on combining semantic relationships", c: C.orange },
            { layer: "Layer 6's W_O", learns: "might focus on combining abstract reasoning", c: C.purple },
          ].map(({ layer, learns, c }) => (
            <div key={layer} style={{ padding: "6px 10px", borderRadius: 5, background: `${c}06` }}>
              <T color={C.dim} size={16}><strong style={{ color: c }}>{layer}</strong> {learns}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" size={18} style={{ marginTop: 8 }}>Nobody programs what to combine. W_O's 512×512 = 262,144 weights are all learned through backpropagation - the same process from chapters 1.3–1.9.</T>
      </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 22: Why 8 + Params + Big Picture ═══════

export const WhyEightHeads = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Why 8 heads? Why not 4 or 16?</T>
        <T color={C.orange} style={{ marginTop: 6 }}>There's a tradeoff - the total dims (512) get divided equally:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: "10px", borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
              <T color={C.purple} bold size={18} center>16 heads</T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>512 ÷ 16 = <strong>32 dims each</strong></T>
              <T color={C.green} size={14} center>✅ More pattern types</T>
              <T color={C.red} size={14} center>❌ Each head weaker</T>
            </div>
            <div style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
              <T color={C.cyan} bold size={18} center>4 heads</T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>512 ÷ 4 = <strong>128 dims each</strong></T>
              <T color={C.green} size={14} center>✅ Each head powerful</T>
              <T color={C.red} size={14} center>❌ Fewer patterns</T>
            </div>
          </div>
          <Box color={C.yellow} style={{ textAlign: "center" }}>
            <T color={C.yellow} bold size={18} center>8 heads × 64 dims = sweet spot</T>
            <T color={C.dim} size={14} center>Enough capacity per head (64 dims) + enough perspectives (8 types)</T>
          </Box>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Parameter count:</T>
        <T color={C.dim} size={16} style={{ marginTop: 4 }}>Per head: W_Q (512×64) + W_K (512×64) + W_V (512×64) = 3 × 32,768 = <strong style={{ color: C.mid }}>98,304</strong></T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { n: "W_Q", calc: "32,768 × 8 heads", t: "262,144", co: C.blue },
            { n: "W_K", calc: "32,768 × 8 heads", t: "262,144", co: C.orange },
            { n: "W_V", calc: "32,768 × 8 heads", t: "262,144", co: C.green },
            { n: "W_O", calc: "512 × 512", t: "262,144", co: C.yellow },
          ].map(({ n, calc, t, co }) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "36px 1fr 68px", gap: 8, padding: "4px 10px", borderRadius: 4, background: `${co}06`, alignItems: "center" }}>
              <code style={{ color: co, fontWeight: 700, fontSize: 18 }}>{n}</code>
              <T color={C.dim} size={16}>{calc}</T>
              <T color={co} size={16} bold center style={{ textAlign: "right" }}>{t}</T>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, padding: "8px 12px", background: `${C.yellow}10`, borderRadius: 8, border: `1px solid ${C.yellow}20` }}>
          <T color={C.yellow} bold center size={20}>Total: 1,048,576 ≈ 1 million per layer</T>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center>Surprising: same count as single-head!</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Single-head with 512-dim Q, K, V needs 512×512 per matrix = same total. Multi-head doesn't add parameters - it <strong>reorganizes them into 8 independent groups</strong>. Same budget, much better results.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>How does this scale in a full model?</T>
        <T color="#80deea" style={{ marginTop: 6 }}>We learned that one attention layer has ~1 million parameters. A Transformer stacks <strong>multiple layers</strong> on top of each other - each layer refines the context further:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { model: "Original Transformer (2017)", layers: "6 layers", params: "~6M attention params", c: C.cyan },
            { model: "GPT-2 (2019)", layers: "48 layers", params: "~48M attention params", c: C.orange },
            { model: "GPT-3 (2020)", layers: "96 layers", params: "175 BILLION total params", c: C.purple },
          ].map(({ model, layers, params, c }) => (
            <div key={model} style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 8, padding: "6px 10px", borderRadius: 5, background: `${c}06`, alignItems: "center" }}>
              <T color={c} size={16} bold center>{model}</T>
              <T color={C.dim} size={14}>{layers}</T>
              <T color={c} size={16} bold center style={{ textAlign: "right" }}>{params}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" size={18} style={{ marginTop: 8 }}>More layers = deeper understanding. Each layer's attention asks different questions about the same words, building increasingly rich representations. Same mechanism we learned - just stacked.</T>
      </Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 23: Is W_O constant? ═══════

export const IsWOConstant = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={21}>Is W_O constant? Does it change?</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>There are two phases in a model's life: <strong>training</strong> and <strong>usage</strong>. The answer depends on which phase you're asking about.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
        <Box color={C.orange} style={{ flex: 1 }}>
          <T color={C.orange} bold center size={18}>During training: W_O changes.</T>
          <T color={C.orange} size={16} style={{ marginTop: 6 }}>Every time the model sees a new batch of sentences and makes prediction errors, every number in W_O gets nudged slightly. Over billions of examples, W_O gradually improves. It changes millions of times during training - getting better and better at blending heads.</T>
        </Box>
        <Box color={C.green} style={{ flex: 1 }}>
          <T color="#80e8a5" bold center size={18}>After training is done: W_O is FROZEN. Completely constant.</T>
          <T color="#80e8a5" size={16} style={{ marginTop: 6 }}>Once training is complete, the model is saved to a file. W_O's numbers are written to disk and they NEVER change again. When you use the model (send it a sentence), W_O is loaded from disk and used as-is.</T>
        </Box>
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <div style={{ padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.mid} size={18} style={{ lineHeight: 2.2 }}>
            You type "I love cats" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
            You type "dogs are great" &nbsp;&nbsp;&nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
            You type "the weather is nice" → model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
            Someone else types anything &nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O
          </T>
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>The SAME grid of numbers. Every input. Every user. Every sentence. Forever (until someone retrains the model).</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>This is true for ALL grids, not just W_O:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold center size={18}>CONSTANT after training (stored on disk, never changes):</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
              {["Embedding dictionary", "W_Q₁ through W_Q₈ ← same grid for every input", "W_K₁ through W_K₈ ← same grid for every input", "W_V₁ through W_V₈ ← same grid for every input", "W_O ← same grid for every input", "All other layer weights"].map(item => (
                <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.green}06` }}>
                  <T color={C.mid} size={14}>├── {item}</T>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
            <T color={C.yellow} bold center size={18}>DIFFERENT for every input (computed live, then thrown away):</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
              {["Q, K, V vectors ← different because the words are different", "Attention scores ← different because Q, K are different", "Softmax weights ← different because scores are different", "Blended outputs ← different because weights and V are different", "Final output ← different because everything above is different"].map(item => (
                <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.yellow}06` }}>
                  <T color={C.mid} size={14}>├── {item}</T>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.blue} style={{ width: "100%" }}>
        <T color={C.blue} bold center size={20}>Why do different sentences get different results if the grids are constant?</T>
        <T color={C.blue} style={{ marginTop: 6 }}>Because the grids are like a <strong>coffee machine</strong>. The machine (W_O) is always the same. But the coffee beans you put in (your sentence) are different each time. Same machine + different beans = different coffee.</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.red}06` }}><T color={C.mid} size={16}>Same W_O × "I love cats" embeddings <strong style={{ color: C.red }}>= one output</strong></T></div>
          <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.purple}06` }}><T color={C.mid} size={16}>Same W_O × "dogs are great" embeddings <strong style={{ color: C.purple }}>= completely different output</strong></T></div>
        </div>
        <T color={C.blue} style={{ marginTop: 8 }}>The grids don't need to change. They've already learned the GENERAL SKILL of "how to blend heads" or "how to extract queries." That skill works on ANY input. Just like a coffee machine doesn't need to be rebuilt for each type of bean - it already knows how to grind and brew.</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 24: The Complete Picture ═══════

export const CompletePicture = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={21}>The complete picture in plain English:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { n: "1", step: "Words become numbers", desc: "(embedding lookup)", c: C.blue, icon: "📖" },
            { n: "2", step: "Those numbers × three grids", desc: "(W_Q, W_K, W_V → Query, Key, Value)", c: C.purple, icon: "🔧" },
            { n: "3", step: "Queries dot-product with Keys", desc: "(find \"who is relevant to whom\")", c: C.orange, icon: "🔍" },
            { n: "4", step: "Scores get normalized", desc: "(scale + softmax → percentages)", c: C.pink, icon: "📊" },
            { n: "5", step: "Percentages blend the Values", desc: "(weighted sum → context-aware output)", c: C.green, icon: "🎯" },
            { n: "6", step: "Steps 2-5 happen 8 times with different grids", desc: "(multi-head → 8 separate results)", c: C.cyan, icon: "🔀" },
            { n: "7", step: "Stick the 8 results end-to-end", desc: "(concatenate → 8 sealed envelopes taped together)", c: C.yellow, icon: "📎" },
            { n: "8", step: "That list × one more grid", desc: "(W_O → open all envelopes, write combined summary)", c: C.red, icon: "✉️" },
            { n: "9", step: "Output: one blended vector per word", desc: "(ready for the next layer)", c: C.green, icon: "✅" },
          ].map(({ n, step, desc, c, icon }) => (
            <div key={n} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <T color={c} bold center size={18}>{n}. {step}</T>
                <T color={C.dim} size={14}>{desc}</T>
              </div>
            </div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff">Every single "grid" in this process (W_Q, W_K, W_V, W_O) is just a table of numbers that started random, got nudged into useful values during training, and then <strong>stays frozen forever after</strong>. They all work the same way - multiply input by grid, get output. The only difference is WHAT each grid was trained to do:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { grid: "W_Q grids", learned: "learned to extract \"what a word is looking for\"", c: C.blue },
            { grid: "W_K grids", learned: "learned to extract \"what a word can be found for\"", c: C.orange },
            { grid: "W_V grids", learned: "learned to extract \"what actual info a word carries\"", c: C.green },
            { grid: "W_O grid", learned: "learned to blend all heads' findings into one combined summary", c: C.yellow },
          ].map(({ grid, learned, c }) => (
            <div key={grid} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${c}06` }}>
              <T color={c} bold center size={18} style={{ minWidth: 66 }}>{grid}</T>
              <T color={C.mid} size={16}>{learned}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold size={21} center>The grids are the machine. Your sentence is the raw material.</T>
        <T color="#80deea" center style={{ marginTop: 6 }}>Same machine, different raw material, different product - every single time.</T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH: Why K Transpose? - Making the Shapes Fit ═══════
