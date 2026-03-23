import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

// ============================================================================
// 2.1: TOKENIZATION - From Words to Numbers
// ============================================================================
export const Tokenization = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Computers only understand numbers.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Text is useless to an AI - no matter how eloquent. First step: convert <strong>"I love cats"</strong> into [0, 1, 2].</T>
        <T color="#80deea" style={{ marginTop: 8 }}>This is <strong>Tokenization</strong> - slicing text into chunks and assigning each a number from a vocabulary.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Three tokenization strategies exist:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "Character-level", ex: "'love' → ['l','o','v','e']", nums: "[108, 111, 118, 101]", pros: "Works for ANY word. New letters rare", cons: "Way too granular. Sequences become huge.", color: C.red },
          { name: "Word-level", ex: "'unhappy' → ['unhappy']", nums: "[5942]", pros: "Human intuitive", cons: "50K+ vocab needed. New words crash the model", color: C.orange },
          { name: "Sub-word (BPE)", ex: "'unhappy' → ['un','##happy']", nums: "[100, 6420]", pros: "Sweet spot. ~50K tokens covers everything", cons: "Need to learn splits first", color: C.green },
        ].map(({ name, ex, nums, pros, cons, color }) => (
          <div key={name} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={18}>{name}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>{ex}</T>
            <T color={C.mid} size={14} style={{ marginTop: 2 }}>{nums}</T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>✓ {pros}</T>
            <T color={C.dim} size={14}>✗ {cons}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Byte-Pair Encoding (BPE) - the gold standard</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>BPE learns which character pairs appear together most. It starts with characters, then merges the most common pairs repeatedly.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={16} bold>Step 0: Split into characters</T>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {["I", "\u2423", "l", "o", "v", "e", "\u2423", "c", "a", "t", "s"].map((ch, i) => (
              <div key={i} style={{ minWidth: 32, padding: "6px 8px", borderRadius: 4, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, textAlign: "center" }}>
                <T color={C.cyan} bold size={15}>{ch}</T>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={16} bold>Step 1: Count adjacent pairs</T>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {[{p: "l + o", n: 1}, {p: "o + v", n: 1}, {p: "v + e", n: 1}, {p: "a + t", n: 1}, {p: "t + s", n: 1}, {p: "c + a", n: 1}].map(({p, n}, i) => (
              <div key={i} style={{ padding: "4px 10px", borderRadius: 4, background: `${C.orange}10`, border: `1px solid ${C.orange}20` }}>
                <T color={C.orange} size={14}>{p} <strong>= {n}</strong></T>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}15` }}>
          <T color={C.yellow} size={16} bold>Step 2: Merge most common pair</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>All pairs tie at frequency 1. Pick l + o → lo</T>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {["I", "\u2423", "lo", "v", "e", "\u2423", "c", "a", "t", "s"].map((ch, i) => (
              <div key={i} style={{ minWidth: 32, padding: "6px 8px", borderRadius: 4, background: ch === "lo" ? `${C.green}25` : `${C.cyan}15`, border: `1px solid ${ch === "lo" ? C.green : C.cyan}30`, textAlign: "center" }}>
                <T color={ch === "lo" ? C.green : C.cyan} bold size={15}>{ch}</T>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={16} bold>Step 3: Repeat merging</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>Recount pairs. lo + v is highest. Merge → lov. Then lov + e → love. Then c + a + t + s → cats.</T>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {["I", "\u2423", "love", "\u2423", "cats"].map((ch, i) => (
              <div key={i} style={{ minWidth: 32, padding: "6px 10px", borderRadius: 4, background: `${C.green}20`, border: `1px solid ${C.green}35`, textAlign: "center" }}>
                <T color={C.green} bold size={15}>{ch}</T>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}15` }}>
          <T color={C.green} size={16} bold>Final tokens → IDs</T>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {[{t: "I", id: 0}, {t: "\u2423", id: 1}, {t: "love", id: 2}, {t: "\u2423", id: 1}, {t: "cats", id: 3}].map(({t, id}, i) => (
              <div key={i} style={{ minWidth: 44, padding: "6px 12px", borderRadius: 6, background: `${C.green}15`, border: `1px solid ${C.green}30`, textAlign: "center" }}>
                <T color={C.green} bold size={16}>{t}</T>
                <T color={C.dim} size={12}>{id}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={13} style={{ marginTop: 6, textAlign: "center" }}>This sequence [0, 1, 2, 1, 3] is what gets fed to the model</T>
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Real example: GPT tokenizer</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Modern tokenizers like GPT-2 use learned vocabularies of ~50,000 tokens. One sentence becomes a sequence of IDs:</T>
      <div style={{ marginTop: 12 }}>
        <T color={C.bright} size={16} center style={{ marginBottom: 10 }}>The cat sat on the mat last week</T>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { w: "The", id: "464", c: C.red },
            { w: "cat", id: "3797", c: C.orange },
            { w: "sat", id: "2906", c: C.yellow },
            { w: "on", id: "319", c: C.green },
            { w: "the", id: "262", c: C.cyan },
            { w: "mat", id: "4416", c: C.blue },
            { w: "last", id: "1297", c: C.purple },
            { w: "week", id: "1285", c: C.red },
          ].map(({ w, id, c }) => (
            <div key={w + id} style={{ minWidth: 56, padding: "10px 14px", borderRadius: 8, background: `${c}10`, border: `1px solid ${c}25`, textAlign: "center" }}>
              <T color={c} bold size={18} center>{w}</T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>{id}</T>
            </div>
          ))}
        </div>
        <T color={C.dim} size={14} center style={{ marginTop: 10 }}>Sequence: [464, 3797, 2906, 319, 262, 4416, 1297, 1285]</T>
      </div>
      <T color="#80e8a5" style={{ marginTop: 8 }}>Each token ID points to a learned embedding (a 768-dimensional vector in GPT-3). The model never sees text - only numbers.</T>
    </Box></Reveal>

    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.2: SELF-SUPERVISED LEARNING - How GPT Trains
// ============================================================================
export const SelfSupervised = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Self-Supervised Learning: the trick behind GPT</T>
        <T color="#80deea" style={{ marginTop: 6 }}>GPT learns from raw text with NO labels. It doesn't need humans to annotate. Instead, it creates its own training signal by predicting the next token.</T>
        <T color="#80deea" style={{ marginTop: 8 }}><strong>One simple rule:</strong> given all the words so far, predict what comes next.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Example: "The cat sat on the mat"</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>One sentence becomes FIVE training examples. Each one says: "given these words, the next word is..."</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { input: "The", target: "cat", target_id: "3797", loss_high: true },
          { input: "The cat", target: "sat", target_id: "2906", loss_high: true },
          { input: "The cat sat", target: "on", target_id: "319", loss_high: false },
          { input: "The cat sat on", target: "the", target_id: "262", loss_high: false },
          { input: "The cat sat on the", target: "mat", target_id: "4416", loss_high: false },
        ].map(({ input, target, target_id, loss_high }, idx) => (
          <div key={idx} style={{ padding: "10px 12px", borderRadius: 8, background: `${loss_high ? C.red : C.green}06`, border: `1px solid ${loss_high ? C.red : C.green}12` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <T color={C.dim} size={14} bold style={{ minWidth: 120 }}>INPUT:</T>
              <T color={C.mid} size={14} style={{ fontStyle: "italic" }}>"{input}"</T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <T color={C.dim} size={14} bold style={{ minWidth: 120 }}>PREDICT:</T>
              <T color={loss_high ? C.red : C.green} size={16} bold>{target}</T>
              <T color={C.dim} size={12}>[{target_id}]</T>
            </div>
          </div>
        ))}
      </div>
      <T color="#ffb74d" style={{ marginTop: 8 }}>From a tiny 8-word sentence, we get 5 (input, target) pairs. From 1 billion words, we get 1 billion training examples. For FREE.</T>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Inside the model: raw prediction</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>When we give the model "The cat sat on", it outputs probabilities for the next token. Let's say its distribution is:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { word: "the", prob: 0.35, actual: true },
          { word: "cat", prob: 0.15, actual: false },
          { word: "mat", prob: 0.12, actual: false },
          { word: "on", prob: 0.10, actual: false },
          { word: "(all others)", prob: 0.28, actual: false },
        ].map(({ word, prob, actual }) => (
          <div key={word} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: actual ? `${C.green}12` : "rgba(255,255,255,0.02)" }}>
            <span style={{ color: C.dim, fontSize: 14, minWidth: 100 }}>{word}</span>
            <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${prob * 100}%`, height: "100%", background: actual ? C.green : C.mid, borderRadius: 6 }} />
            </div>
            <T color={C.mid} bold size={14} style={{ minWidth: 40, textAlign: "right" }}>{(prob * 100).toFixed(0)}%</T>
            {actual && <span style={{ fontSize: 20, color: C.green }}>✓</span>}
          </div>
        ))}
      </div>
      <T color="#ef9a9a" style={{ marginTop: 8 }}>The model predicted "the" with 35% confidence. The correct answer is "the". Good! But not perfect - 35% is not 100%.</T>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Loss: how wrong was the prediction?</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>We use <strong>cross-entropy loss</strong> to measure the gap. For this example:</T>
      <div style={{ marginTop: 12, padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} size={16} center><strong>Loss = -log(0.35) = 1.05</strong></T>
        <T color={C.dim} size={14} style={{ marginTop: 6, textAlign: "center" }}>Higher probability → lower loss. If we predicted 1.0 (100%), loss = 0. If 0.1 (10%), loss ≈ 2.3.</T>
      </div>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { pred: 1.0, loss: 0.0, meaning: "Perfect prediction" },
          { pred: 0.5, loss: 0.69, meaning: "So-so prediction" },
          { pred: 0.35, loss: 1.05, meaning: "Our example" },
          { pred: 0.1, loss: 2.30, meaning: "Bad prediction" },
        ].map(({ pred, loss, meaning }) => (
          <div key={pred} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.yellow} bold size={15} style={{ minWidth: 50 }}>P={pred.toFixed(2)}</T>
            <T color={C.dim} size={15}>Loss={loss.toFixed(2)}</T>
            <T color={C.mid} size={14} style={{ fontStyle: "italic" }}>{meaning}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why self-supervised works</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>The model learns to predict next words by trial and error on BILLIONS of examples. Through this alone, it learns:</T>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { icon: "📖", what: "Grammar", why: "Predicting next word requires understanding subject-verb agreement, tenses" },
          { icon: "🧠", what: "Facts", why: "To predict 'The capital of France is ___', it must memorize that Paris is the answer" },
          { icon: "🎯", what: "Reasoning", why: "To predict output of a math problem, it must perform the computation internally" },
          { icon: "💬", what: "Style transfer", why: "After SFT, the model uses this learned knowledge to follow human instructions" },
        ].map(({ icon, what, why }) => (
          <div key={what} style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div>
                <T color={C.green} bold size={16}>{what}</T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>{why}</T>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>During training: gradient descent</T>
      <T color="#80deea" style={{ marginTop: 6 }}>After each batch of examples, the model computes loss, then uses backprop to adjust weights to reduce future loss.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace" }}>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Iteration 1:</strong> avg loss on batch = 4.2 → adjust weights</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Iteration 2:</strong> avg loss on batch = 3.8 → adjust weights</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Iteration 3:</strong> avg loss on batch = 3.1 → adjust weights</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.bright} size={15}><strong>...</strong></T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>After 1 trillion tokens:</strong> avg loss on batch = 0.8</T>
        </div>
      </div>
      <T color="#80deea" style={{ marginTop: 8 }}>The model gets better at predicting. This is "pretraining" - GPT-3 trained for 300+ billion tokens.</T>
    </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.3: CROSS-ENTROPY LOSS - The LLM Score
// ============================================================================
export const CrossEntropy = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>How do we grade the model?</T>
        <T color="#80deea" style={{ marginTop: 6 }}>The model predicts probabilities for every word in the vocabulary. But how do we turn that into one number that says "how good are your predictions?"</T>
        <T color="#80deea" style={{ marginTop: 8 }}>We need a <strong>loss function</strong> - a single score that tells us how wrong the model was. Lower loss = better predictions. The loss function used by every LLM is called <strong>cross-entropy loss</strong>.</T>
      </Box>
    )}

    {/* ── Sub 1: The formula (SVG) + the -log(P) graph + explanation ── */}
    <Reveal when={sub >= 1}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>The formula: Loss = -log(P)</T>

      {/* ── SVG Formula ── */}
      <div style={{ margin: "16px 0", padding: "18px 12px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.green}25`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <T color={C.dim} size={13} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>The Cross-Entropy Loss Formula</T>
        <svg viewBox="0 0 440 100" style={{ width: "100%", maxWidth: 400, height: "auto" }}>
          {/* Loss = */}
          <text x="10" y="55" fill={C.bright} fontSize="24" fontFamily="serif" fontWeight="700">Loss</text>
          <text x="80" y="55" fill={C.dim} fontSize="24" fontFamily="serif">=</text>
          {/* - */}
          <text x="108" y="55" fill={C.red} fontSize="28" fontFamily="serif" fontWeight="700">-</text>
          {/* log with subscript e */}
          <text x="128" y="55" fill={C.green} fontSize="24" fontFamily="serif" fontWeight="700">log</text>
          <text x="172" y="64" fill={C.green} fontSize="13" fontFamily="serif" fontStyle="italic">e</text>
          {/* ( */}
          <text x="185" y="55" fill={C.dim} fontSize="28" fontFamily="serif">(</text>
          {/* P_correct */}
          <text x="200" y="55" fill={C.cyan} fontSize="24" fontFamily="serif" fontStyle="italic" fontWeight="700">P</text>
          <text x="220" y="68" fill={C.purple} fontSize="13" fontFamily="serif" fontStyle="italic">correct</text>
          {/* ) */}
          <text x="275" y="55" fill={C.dim} fontSize="28" fontFamily="serif">)</text>
          {/* Annotations */}
          <text x="300" y="42" fill={C.cyan} fontSize="11" fontFamily="sans-serif">← the probability the model</text>
          <text x="308" y="56" fill={C.cyan} fontSize="11" fontFamily="sans-serif">assigned to the actual</text>
          <text x="308" y="70" fill={C.cyan} fontSize="11" fontFamily="sans-serif">next word</text>
          <text x="108" y="85" fill={C.red} fontSize="11" fontFamily="sans-serif">↑ negative sign flips it</text>
        </svg>
      </div>

      <T color="#80e8a5" style={{ marginTop: 4 }}>In plain English: <strong>take the natural log of how confident the model was in the right answer, then flip the sign.</strong></T>

      {/* ── The -log(P) Graph ── */}
      <T color="#80e8a5" bold size={16} style={{ marginTop: 16 }}>The graph of -log(P): why this shape matters</T>
      <div style={{ marginTop: 8, padding: "16px 12px", background: "rgba(0,0,0,0.35)", borderRadius: 12, border: `1px solid ${C.green}20` }}>
        <svg viewBox="0 0 400 240" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", margin: "0 auto" }}>
          {/* Axes */}
          <line x1="50" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="50" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* Y axis label */}
          <text x="15" y="115" fill={C.red} fontSize="13" fontFamily="sans-serif" transform="rotate(-90,15,115)" textAnchor="middle" fontWeight="700">Loss (-log P)</text>
          {/* X axis label */}
          <text x="215" y="232" fill={C.cyan} fontSize="13" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">probability assigned to correct word</text>
          {/* Y axis ticks */}
          {[0, 1, 2, 3, 4].map(v => {
            const y = 200 - (v / 4.6) * 180;
            return <g key={v}>
              <line x1="45" y1={y} x2="50" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <text x="40" y={y + 4} fill={C.dim} fontSize="11" fontFamily="sans-serif" textAnchor="end">{v.toFixed(1)}</text>
              <line x1="50" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </g>;
          })}
          {/* X axis ticks */}
          {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map(v => {
            const x = 50 + v * 330;
            return <g key={v}>
              <line x1={x} y1="200" x2={x} y2="205" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <text x={x} y="216" fill={C.dim} fontSize="11" fontFamily="sans-serif" textAnchor="middle">{v.toFixed(1)}</text>
            </g>;
          })}
          {/* The -log(P) curve */}
          <path d={(() => {
            const pts = [];
            for (let i = 1; i <= 100; i++) {
              const p = i / 100;
              const loss = -Math.log(p);
              const x = 50 + p * 330;
              const y = 200 - (loss / 4.6) * 180;
              pts.push(`${i === 1 ? "M" : "L"}${x.toFixed(1)},${Math.max(20, y).toFixed(1)}`);
            }
            return pts.join(" ");
          })()} fill="none" stroke={C.green} strokeWidth="2.5" />
          {/* Annotated points */}
          {[
            { p: 0.95, label: "P=0.95", sublabel: "confident & right", loss: -Math.log(0.95), color: C.green },
            { p: 0.50, label: "P=0.50", sublabel: "coin flip", loss: -Math.log(0.50), color: C.yellow },
            { p: 0.10, label: "P=0.10", sublabel: "wrong guess", loss: -Math.log(0.10), color: C.orange },
            { p: 0.01, label: "P=0.01", sublabel: "very wrong", loss: -Math.log(0.01), color: C.red },
          ].map(({ p, label, sublabel, loss, color }) => {
            const x = 50 + p * 330;
            const y = Math.max(20, 200 - (loss / 4.6) * 180);
            return <g key={p}>
              <circle cx={x} cy={y} r="5" fill={color} opacity="0.9" />
              <line x1={x} y1={y} x2={x} y2="200" stroke={color} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
              <text x={Math.min(x + 8, 350)} y={y - 8} fill={color} fontSize="10" fontFamily="sans-serif" fontWeight="700">{label}</text>
              <text x={Math.min(x + 8, 350)} y={y + 4} fill={color} fontSize="9" fontFamily="sans-serif" opacity="0.8">{sublabel}</text>
            </g>;
          })}
        </svg>
      </div>

      {/* ── Where does "correct" come from? ── */}
      <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
        <T color="#80deea" bold size={15}>But wait - how does the formula know what the right answer is?</T>
        <T color="#80deea" size={14} style={{ marginTop: 6 }}>The formula is Loss = -ln(P<sub>correct</sub>). But where does "correct" come from? It is NOT inside the formula. It comes from the <strong>training data</strong>.</T>
        <T color="#80deea" size={14} style={{ marginTop: 6 }}>During training, the model sees real text like "The cat sat on the <strong>mat</strong>". We already know the next word is "mat" because it is right there in the sentence. The model outputs 50,000 probabilities (one per word). We reach into that list, pull out the one probability the model assigned to "mat", and plug THAT number into the formula.</T>
        <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={14}>Model output: {"{"}the: 2%, cat: 5%, mat: <strong style={{ color: C.green }}>62%</strong>, dog: 1%, ...{"}"}</T>
          <T color={C.bright} size={14} style={{ marginTop: 4 }}>Correct answer (from training data): <strong style={{ color: C.green }}>"mat"</strong></T>
          <T color={C.bright} size={14} style={{ marginTop: 4 }}>So P<sub>correct</sub> = P("mat") = <strong style={{ color: C.green }}>0.62</strong></T>
          <T color={C.bright} size={14} style={{ marginTop: 4 }}>Loss = -ln(0.62) = <strong style={{ color: C.yellow }}>0.48</strong></T>
        </div>
        <T color="#80deea" size={14} style={{ marginTop: 8 }}>The "comparison" between actual and expected is implicit: we only look at the probability the model gave to the <strong>known correct word</strong>. If that probability is high, loss is low. If that probability is low, loss is high. There is no subtraction (actual - expected). The entire comparison is: "how confident were you in the right answer?"</T>
      </div>

      {/* ── Graph explanation tied to LLM context ── */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <T color="#80e8a5" bold size={15}>What does this graph mean for our model?</T>
        {[
          { scenario: "Model gives \"mat\" P=0.95 (the correct answer from training data)", loss: "0.05", reaction: "Almost zero loss. The model was confident and correct. Barely any weight adjustment needed.", color: C.green },
          { scenario: "Model gives \"mat\" P=0.50 (correct answer, but model wasn't sure)", loss: "0.69", reaction: "Medium loss. Right word, but not confident enough. Weights get nudged to be more confident next time.", color: C.yellow },
          { scenario: "Model gives \"mat\" P=0.01 (correct answer, but model almost ignored it)", loss: "4.60", reaction: "Massive loss. The model was almost certain \"mat\" was wrong - but it was right. Weights get a huge correction.", color: C.red },
        ].map(({ scenario, loss, reaction, color }) => (
          <div key={loss} style={{ padding: "10px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} size={14}>{scenario}</T>
            <T color={C.bright} bold size={14} style={{ marginTop: 4 }}>Loss = {loss}</T>
            <T color={C.dim} size={13} style={{ marginTop: 2 }}>{reaction}</T>
          </div>
        ))}
      </div>

      <T color="#80e8a5" style={{ marginTop: 10 }}>The curve is steep on the left (low probability = massive penalty) and flat on the right (high probability = tiny penalty). This is exactly what we want: the model gets <strong>punished harshly for being confidently wrong</strong>, but barely punished when it's already doing well.</T>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Why -log? The intuition</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>Imagine you're a weather forecaster. You say "70% chance of rain". If it does rain, you did well (70% ≠ 100%, but decent). If it doesn't rain, you were wrong (you said 70%!).</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>Loss measures your mistake: <strong>Loss = -log(your prediction for what actually happened)</strong></T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { you_said: "It WILL rain (P=0.95)", actual: "IT DID RAIN", loss: 0.05, grade: "A+" },
          { you_said: "Maybe rain (P=0.50)", actual: "It rained", loss: 0.69, grade: "C" },
          { you_said: "Probably dry (P=0.10)", actual: "It rained", loss: 2.30, grade: "F" },
        ].map(({ you_said, actual, loss, grade }) => (
          <div key={you_said} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.dim} size={14}><strong>You:</strong> {you_said}</T>
            <T color={C.mid} size={14} style={{ marginTop: 2 }}><strong>Reality:</strong> {actual}</T>
            <T color={C.yellow} size={14} style={{ marginTop: 4 }}><strong>Loss = {loss.toFixed(2)}</strong> ({grade})</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Cross-entropy formula in detail</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>When predicting one token from a 50K vocabulary:</T>
      <div style={{ marginTop: 12, padding: "16px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.yellow}25` }}>
        <T color={C.bright} size={18} center><strong>Loss = -log<sub>e</sub>(P<sub>correct</sub>)</strong></T>
        <T color={C.dim} size={14} style={{ marginTop: 8, textAlign: "center" }}>where P_correct is between 0 and 1 (it's a probability)</T>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { prob_correct: 0.99, loss: 0.01, bar_width: 2 },
          { prob_correct: 0.90, loss: 0.10, bar_width: 10 },
          { prob_correct: 0.50, loss: 0.69, bar_width: 69 },
          { prob_correct: 0.10, loss: 2.30, bar_width: 100 },
          { prob_correct: 0.01, loss: 4.60, bar_width: 100 },
        ].map(({ prob_correct, loss, bar_width }) => (
          <div key={prob_correct} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <T color={C.mid} size={14} style={{ minWidth: 80 }}>P = {prob_correct.toFixed(2)}</T>
            <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(bar_width, 100)}%`, height: "100%", background: C.red, borderRadius: 6 }} />
            </div>
            <T color={C.yellow} bold size={15} style={{ minWidth: 50 }}>L={loss.toFixed(2)}</T>
          </div>
        ))}
      </div>
      <T color="#ffe082" style={{ marginTop: 8 }}>As probability increases, loss approaches zero. As probability drops, loss explodes. This penalizes confident wrong answers.</T>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why cross-entropy, not MSE?</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Mean Squared Error (MSE) is common for regression. Why use cross-entropy for language models?</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          {
            method: "MSE Loss",
            formula: "(P_pred - P_true)²",
            example: "P_pred=0.1, P_true=1.0 → (0.1-1.0)² = 0.81",
            problem: "Treats small & large errors equally. Doesn't penalize confidence enough.",
            color: C.orange,
          },
          {
            method: "Cross-Entropy Loss",
            formula: "-log(P_correct)",
            example: "P_pred=0.1 when true=1.0 → -log(0.1) = 2.30",
            problem: "HEAVILY punishes confident mistakes. Correct!",
            color: C.green,
          },
        ].map(({ method, formula, example, problem, color }) => (
          <div key={method} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={17}>{method}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}><strong>Formula:</strong> {formula}</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}><strong>Example:</strong> {example}</T>
            <T color={C.mid} size={14} style={{ marginTop: 2 }}><strong>Why:</strong> {problem}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 5}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Batch loss: averaging across examples</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>During training, we compute loss on a BATCH of examples, then take the mean:</T>
      <div style={{ marginTop: 12, fontFamily: "monospace", padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            "Example 1: Predict 'sat' → model says P=0.4 → loss = 0.92",
            "Example 2: Predict 'on'  → model says P=0.8 → loss = 0.22",
            "Example 3: Predict 'mat' → model says P=0.1 → loss = 2.30",
            "",
            "Batch Loss = (0.92 + 0.22 + 2.30) / 3 = 1.15",
          ].map((line, i) => (
            <T key={i} color={line.includes("Loss") ? C.yellow : C.dim} size={14}>{line}</T>
          ))}
        </div>
      </div>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>The model updates weights to reduce this batch loss. Then the next batch is loaded and loss is recomputed.</T>
    </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.4: THE NEURAL NETWORK IN ACTION
// ============================================================================
const VOCAB = [
  "the","cat","sat","on","mat","a","dog","ran","is","was",
  "big","small","red","blue","and","in","it","my","to","with"
];
const SCORES = {
  the: 4.2, cat: 1.1, sat: 0.3, on: -0.5, mat: 3.8,
  a: 2.1, dog: 0.8, ran: -0.2, is: 0.5, was: 1.4,
  big: -1.5, small: -2.1, red: -1.8, blue: -2.3, and: 0.9,
  in: 1.6, it: 0.2, my: -3.1, to: 0.7, with: -0.9
};
const EXP_SCORES = {};
let EXP_SUM = 0;
Object.entries(SCORES).forEach(([w, s]) => { EXP_SCORES[w] = Math.exp(s); EXP_SUM += Math.exp(s); });
const SORTED_SCORES = Object.entries(SCORES).sort((a, b) => b[1] - a[1]);
const SORTED_PROBS = Object.entries(SCORES).map(([w, s]) => [w, Math.exp(s) / EXP_SUM]).sort((a, b) => b[1] - a[1]);

export const NNInAction = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* ── Sub 0: Vocabulary grid ── */}
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Our tiny world: only 20 words exist</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Forget 50,000 words. Our model only knows these 20 words. Every word gets a number (its ID). The model never sees letters - only these numbers.</T>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {VOCAB.map((w, i) => (
            <div key={w} style={{ padding: "6px 8px", borderRadius: 6, textAlign: "center", background: `${C.cyan}10`, border: `1px solid ${C.cyan}20` }}>
              <T color="#80deea" size={13} bold><span style={{ opacity: 0.5, fontSize: 11 }}>[{i}]</span> {w}</T>
            </div>
          ))}
        </div>
      </Box>
    )}

    {/* ── Sub 1: Input sentence ── */}
    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>The input: "The cat sat on" - predict what?</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>We feed in four words. The model's job: figure out what word #5 should be.</T>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
        {["The", "cat", "sat", "on"].map((w, i) => (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.orange}20`, }}>
              <T color="#ffb74d" bold size={16}>{w} <span style={{ fontSize: 11, opacity: 0.6 }}>[{i}]</span></T>
            </div>
            {i < 3 && <T color={C.dim} size={20}>→</T>}
          </div>
        ))}
        <T color={C.dim} size={20}>→</T>
        <div style={{ padding: "8px 14px", borderRadius: 8, border: `2px dashed ${C.red}`, background: `${C.red}10` }}>
          <T color={C.red} bold size={16}>???</T>
        </div>
      </div>
    </Box></Reveal>

    {/* ── Sub 2: Neural network diagram ── */}
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The neural network: what it actually looks like</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>The last input word ("on") gets converted to numbers, flows through hidden layers where every circle does: <strong>multiply inputs by weights → add up → apply activation</strong>. Then the output layer has <strong>one circle for every word in our vocabulary (all 20)</strong>.</T>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 0, overflowX: "auto", padding: "10px 0" }}>
        {[
          { label: "Input", sublabel: "(word: 'on')", nodes: [{ l: "0", active: false }, { l: "0", active: false }, { l: "0", active: false }, { l: "1", active: true }], color: "#ffb74d", bg: "rgba(255,171,64,0.15)" },
          { label: "Hidden 1", sublabel: "(8 circles)", nodes: Array(6).fill(null).map(() => ({ l: "", active: false })), color: "#b8a9ff", bg: "rgba(167,139,250,0.12)" },
          { label: "Hidden 2", sublabel: "(8 circles)", nodes: Array(6).fill(null).map(() => ({ l: "", active: false })), color: "#b8a9ff", bg: "rgba(167,139,250,0.12)" },
          { label: "Output", sublabel: "(20 words)", nodes: [{ l: "the", active: true }, { l: "cat", active: false }, { l: "sat", active: false }, { l: "on", active: false }, { l: "mat", active: true }, { l: "...", active: false }, { l: "with", active: false }], color: "#80e8a5", bg: "rgba(0,230,118,0.12)" },
        ].map((layer, li) => (
          <div key={layer.label} style={{ display: "flex", alignItems: "center" }}>
            {li > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40, padding: "0 2px" }}>
                <T color={C.dim} size={16}>→</T>
                <T color={C.dim} size={10}>weights</T>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 70 }}>
              <T color={layer.color} bold size={12}>{layer.label}</T>
              <T color={C.dim} size={10} style={{ marginTop: -4 }}>{layer.sublabel}</T>
              {layer.nodes.map((n, ni) => (
                <div key={ni} style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: n.active ? layer.bg.replace("0.12", "0.35").replace("0.15", "0.35") : layer.bg, border: `2px solid ${n.active ? layer.color : "rgba(255,255,255,0.1)"}`, fontSize: li === 3 ? 9 : 11, fontWeight: 600, color: layer.color }}>
                  {n.l}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <T color="#b8a9ff" style={{ marginTop: 10 }}><strong>Every line is a weight</strong> - a number that was learned during training. The input (4 numbers representing "on") gets multiplied by weights, transformed, multiplied by more weights, transformed again, until it reaches the 20 output circles. Each output circle produces one score for one word.</T>
    </Box></Reveal>

    {/* ── Sub 3: Output node computation ── */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Each output circle computes a score (called a "logit")</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>After the input flows through all the hidden layers, the final layer has 20 circles. Each circle collects numbers from the layer before it, multiplies each by its own weight, and adds them up. That sum is the score for that word.</T>

      <div style={{ marginTop: 12, padding: 16, borderRadius: 10, background: "rgba(0,0,0,0.3)" }}>
        <T color="#80e8a5" bold center size={15}>Example: How the "mat" circle computes its score</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4, fontFamily: "'SF Mono', Consolas, monospace", fontSize: 14 }}>
          <T color={C.mid} size={14}>Values arriving from previous layer: [2.1, -0.8, 1.5, 0.3, -1.2, 0.9, 1.7, -0.4]</T>
          <T color={C.mid} size={14}>Weights for "mat" circle: [0.6, 0.3, 0.8, 0.1, -0.5, 0.2, 0.9, 0.4]</T>
          <T color="#80e8a5" style={{ marginTop: 8 }} size={14}>Score = (2.1 x 0.6) + (-0.8 x 0.3) + (1.5 x 0.8) + (0.3 x 0.1) + (-1.2 x -0.5) + (0.9 x 0.2) + (1.7 x 0.9) + (-0.4 x 0.4)</T>
          <T color="#80e8a5" size={14}>= 1.26 + (-0.24) + 1.20 + 0.03 + 0.60 + 0.18 + 1.53 + (-0.16)</T>
          <T color={C.green} bold center size={18} style={{ marginTop: 8 }}>Score for "mat" = 4.40</T>
        </div>
      </div>

      <T color="#80e8a5" style={{ marginTop: 10 }}>The same thing happens for all 20 output circles, each with its <strong>own set of weights</strong>. So "the" circle has different weights, "cat" circle has different weights, etc. That's why they produce different scores.</T>
    </Box></Reveal>

    {/* ── Sub 4: Raw scores for all 20 words ── */}
    <Reveal when={sub >= 4}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Raw scores for all 20 words</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>Each output circle has computed its score. Here is what the model produced for input "The cat sat on":</T>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
        {SORTED_SCORES.map(([word, score]) => {
          const isHigh = score >= 3;
          const isLow = score <= -1.5;
          const color = isHigh ? C.green : isLow ? C.red : C.mid;
          const bg = isHigh ? `${C.green}08` : isLow ? `${C.red}08` : "rgba(255,255,255,0.02)";
          return (
            <div key={word} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: bg }}>
              <T color={color} bold size={14}>{word}</T>
              <T color={color} bold size={14} style={{ fontFamily: "monospace" }}>{score >= 0 ? "+" : ""}{score.toFixed(1)}</T>
            </div>
          );
        })}
      </div>
      <T color="#ef9a9a" style={{ marginTop: 10 }}>Notice: "the" and "mat" have the highest scores. "my" is deeply negative. But these are not probabilities yet - they are just raw numbers. We need to convert them.</T>
    </Box></Reveal>

    {/* ── Sub 5: Softmax conversion ── */}
    <Reveal when={sub >= 5}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Convert scores to probabilities (softmax)</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Two simple steps: raise e (2.718) to the power of each score, then divide each result by the total. This makes everything positive and add up to 100%.</T>
      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 70px 30px 80px 30px 70px", gap: 2, fontSize: 13, fontFamily: "monospace" }}>
          {["Word", "Score", "", "e^score", "", "Prob"].map((h, i) => (
            <div key={i} style={{ color: "#ffe082", fontWeight: 700, padding: "6px 4px" }}>{h}</div>
          ))}
          {[...SORTED_SCORES.slice(0, 8), null, ...SORTED_SCORES.slice(-2)].map((item, _idx) => {
            if (item === null) return <div key="sep" style={{ gridColumn: "1 / -1", textAlign: "center", color: C.dim, padding: 2 }}>...</div>;
            const [word, score] = item;
            const eScore = EXP_SCORES[word];
            const prob = eScore / EXP_SUM;
            const isHigh = score >= 3;
            const color = isHigh ? "#ffe082" : C.mid;
            return [
              <div key={`${word}-w`} style={{ color, padding: 4, fontWeight: isHigh ? 700 : 400 }}>{word}</div>,
              <div key={`${word}-s`} style={{ color, padding: 4 }}>{score >= 0 ? "+" : ""}{score.toFixed(1)}</div>,
              <div key={`${word}-a1`} style={{ color: C.dim, padding: 4, textAlign: "center" }}>→</div>,
              <div key={`${word}-e`} style={{ color, padding: 4 }}>{eScore.toFixed(2)}</div>,
              <div key={`${word}-a2`} style={{ color: C.dim, padding: 4, textAlign: "center" }}>→</div>,
              <div key={`${word}-p`} style={{ color, padding: 4, fontWeight: 700 }}>{(prob * 100).toFixed(1)}%</div>,
            ];
          })}
        </div>
        <T color={C.dim} size={13} center style={{ marginTop: 10 }}>Sum of all e^score = {EXP_SUM.toFixed(2)} → each probability = e^score / {EXP_SUM.toFixed(2)}</T>
      </div>
    </Box></Reveal>

    {/* ── Sub 6: Probability bars ── */}
    <Reveal when={sub >= 6}><Box color={C.blue} style={{ width: "100%" }}>
      <T color="#90caf9" bold center size={20}>The final answer: probability for each word</T>
      <T color="#90caf9" style={{ marginTop: 6 }}>This is what the model outputs. A probability for <strong>every single one</strong> of the 20 words. The highest probability is the model's best guess for the next word.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {SORTED_PROBS.slice(0, 10).map(([word, prob], i) => {
          const maxP = SORTED_PROBS[0][1];
          const widthPct = (prob / maxP) * 100;
          const isTop = i === 0;
          const barColor = isTop ? C.blue : i < 3 ? `${C.blue}99` : `${C.blue}4d`;
          const textColor = isTop ? "#90caf9" : C.mid;
          return (
            <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <T color={textColor} bold size={14} style={{ minWidth: 60 }}>{word}</T>
              <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: `${widthPct}%`, height: "100%", background: barColor, borderRadius: 6 }} />
              </div>
              <T color={textColor} bold size={14} style={{ minWidth: 50, textAlign: "right" }}>{(prob * 100).toFixed(1)}%</T>
            </div>
          );
        })}
        <T color={C.dim} size={13} center>...plus 10 more words with less than 1% each</T>
      </div>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}20` }}>
        <T color="#90caf9" bold center size={16}>Model's prediction: "the" (38.3%) → "The cat sat on <u>the</u>"</T>
        <T color={C.mid} size={14} center style={{ marginTop: 6 }}>The actual next word in training was "the" → loss = -log(0.383) = 0.96</T>
        <T color={C.mid} size={14} center style={{ marginTop: 2 }}>Not bad! But not 100% confident. Backprop will nudge the weights to make it more confident next time.</T>
      </div>
    </Box></Reveal>

    {/* ── Sub 7: Key insight ── */}
    <Reveal when={sub >= 7}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>The key insight: it is ALL just multiply and add</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>The entire process - from input word to 20 probabilities - is nothing but:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { step: "1. Take numbers in", detail: "the word \"on\" becomes [0, 0, 0, 1, 0, ...] or an embedding vector" },
          { step: "2. Multiply by weights, add up, apply activation", detail: "each circle in each hidden layer does this" },
          { step: "3. Repeat through every layer", detail: "GPT-2 has 12 layers, GPT-4 has ~100+ layers" },
          { step: "4. Last layer: one circle per vocabulary word", detail: "20 circles for us, 50,000 for real GPT" },
          { step: "5. Softmax to get probabilities", detail: "exponentiate and divide. Now they sum to 100%" },
        ].map(({ step, detail }) => (
          <div key={step} style={{ padding: 12, borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color="#80e8a5" bold size={15}>{step}</T>
            <T color={C.mid} size={14}> - {detail}</T>
          </div>
        ))}
      </div>
      <T color="#80e8a5" style={{ marginTop: 10 }}>That's it. No magic. <strong>The only "smart" part is the weights - the numbers on each connection line.</strong> Training (gradient descent) adjusts those weights trillions of times until the multiply-and-add chain produces good predictions.</T>
    </Box></Reveal>

    {sub < 7 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.5: SUPERVISED FINE-TUNING (SFT)
// ============================================================================
export const SFT = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* ── Sub 0: The problem ── */}
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The problem: the model just predicts internet text</T>
        <T color="#80deea" style={{ marginTop: 8 }}>After pretraining, the model has read trillions of words from the internet. It can predict the next word really well. But it has no idea that it should be <strong>helpful</strong>.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>If you type "What is photosynthesis?", the model does not think "I should answer this question." It thinks: <strong>"what text would typically follow this on the internet?"</strong></T>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          <T color={C.dim} size={14} style={{ textAlign: "center", fontStyle: "italic" }}>You type: "What is photosynthesis?"</T>
          <T color={C.dim} size={14} style={{ textAlign: "center" }}>On the internet, this could be followed by...</T>
          {[
            { text: "A Wikipedia-style answer", prob: "15%", color: C.green },
            { text: "Another question: \"What about cellular respiration?\"", prob: "12%", color: C.orange },
            { text: "A Reddit comment: \"just Google it lol\"", prob: "10%", color: C.red },
            { text: "A spam link or ad", prob: "8%", color: C.red },
            { text: "A sarcastic reply", prob: "6%", color: C.red },
          ].map(({ text, prob, color }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
              <T color={color} size={14} style={{ flex: 1 }}>{text}</T>
              <T color={C.dim} size={14} bold>{prob}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>The model gives probability to ALL of these because it saw all of them during pretraining. We need to change this.</T>
      </Box>
    )}

    {/* ── Sub 1: SFT training data ── */}
    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>The fix: show it what a good assistant says</T>
      <T color="#ffb74d" style={{ marginTop: 8 }}>Humans sit down and write ~100,000 example conversations. Each one has the exact format the model will see when deployed:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            q: "What is photosynthesis?",
            a: "Photosynthesis is the process where plants convert light energy into chemical energy. It happens in two stages: light-dependent reactions in the thylakoid, and the Calvin cycle in the stroma.",
            color: C.green,
          },
          {
            q: "Write a Python function to reverse a list.",
            a: "def reverse_list(lst):\n    return lst[::-1]",
            color: C.purple,
          },
        ].map(({ q, a, color }, idx) => (
          <div key={idx} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.03)", marginBottom: 6 }}>
              <T color={C.dim} size={13} bold>User:</T>
              <T color={C.mid} size={15} style={{ marginTop: 2 }}>{q}</T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${color}08` }}>
              <T color={C.dim} size={13} bold>Assistant:</T>
              <T color={color} size={15} style={{ marginTop: 2, whiteSpace: "pre-wrap", fontFamily: q.includes("Python") ? "monospace" : "inherit" }}>{a}</T>
            </div>
          </div>
        ))}
      </div>
      <T color="#ffb74d" style={{ marginTop: 10 }}>Each example says: "When a user asks this, <strong>this</strong> is what you should say." The model will now train on these conversations instead of random internet text.</T>
    </Box></Reveal>

    {/* ── Sub 2: Loss only on assistant tokens ── */}
    <Reveal when={sub >= 2}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>The key trick: loss only on the assistant's words</T>
      <T color="#ef9a9a" style={{ marginTop: 8 }}>The model reads the full conversation and predicts the next word at every position - same as pretraining. But the loss is <strong>only calculated on the assistant's words</strong>. The user's question is just context.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { position: "User:", next: "What", loss: false },
          { position: "User: What", next: "is", loss: false },
          { position: "User: What is", next: "photosynthesis?", loss: false },
          { position: "...photosynthesis?", next: "Assistant:", loss: false },
          { position: "Assistant:", next: "Photosynthesis", loss: true, pred: "What", predProb: "12%", correctProb: "8%" },
          { position: "...Photosynthesis", next: "is", loss: true, pred: "is", predProb: "25%", correctProb: "25%" },
          { position: "...Photosynthesis is", next: "the", loss: true, pred: "a", predProb: "18%", correctProb: "15%" },
          { position: "...is the", next: "process", loss: true, pred: "study", predProb: "11%", correctProb: "9%" },
        ].map(({ position, next, loss, pred, predProb, correctProb }) => (
          <div key={position} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: loss ? "rgba(255,107,107,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${loss ? "rgba(255,107,107,0.12)" : "rgba(255,255,255,0.04)"}` }}>
            <T color={C.dim} size={13} style={{ minWidth: 160, fontFamily: "monospace" }}>{position}</T>
            <T color={C.mid} size={13}>next: <strong style={{ color: loss ? C.green : C.dim }}>{next}</strong></T>
            {loss
              ? <T color={C.red} size={12} bold style={{ marginLeft: "auto" }}>LOSS (model guessed "{pred}" at {predProb}, correct was {correctProb})</T>
              : <T color={C.dim} size={12} style={{ marginLeft: "auto" }}>no loss - just reading</T>
            }
          </div>
        ))}
      </div>
      <T color="#ef9a9a" style={{ marginTop: 10 }}>The model is never graded on predicting the user's question. It is <strong>only graded on how well it predicts the ideal assistant response</strong>. Backpropagation then nudges the weights to make the correct response words more likely next time.</T>
    </Box></Reveal>

    {/* ── Sub 3: Before vs After probability shift ── */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Before vs After SFT: what changes in the output</T>
      <T color="#80e8a5" style={{ marginTop: 8 }}>After 100,000 training conversations, the weights have shifted. The model now strongly favors helpful assistant text after "Assistant:". Here is the same input, same model, different probabilities for the first word:</T>
      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          {
            label: "Before SFT",
            sublabel: "predicts generic internet text",
            color: C.red,
            probs: [
              { word: "What", pct: 12 },
              { word: "The", pct: 10 },
              { word: "Photosynthesis", pct: 8 },
              { word: "I", pct: 6 },
              { word: "So", pct: 5 },
              { word: "It", pct: 4 },
            ],
          },
          {
            label: "After SFT",
            sublabel: "predicts helpful assistant response",
            color: C.green,
            probs: [
              { word: "Photosynthesis", pct: 35 },
              { word: "The", pct: 8 },
              { word: "It", pct: 5 },
              { word: "What", pct: 2 },
              { word: "I", pct: 2 },
              { word: "So", pct: 1 },
            ],
          },
        ].map(({ label, sublabel, color, probs }) => (
          <div key={label} style={{ flex: 1, minWidth: 250, padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={16} center>{label}</T>
            <T color={C.dim} size={12} style={{ textAlign: "center", marginBottom: 8 }}>{sublabel}</T>
            {probs.map(({ word, pct }) => (
              <div key={word} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <T color={C.mid} size={13} style={{ width: 105, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{word}</T>
                <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct * 2.5}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.7 }} />
                </div>
                <T color={C.dim} size={12} bold style={{ minWidth: 30, textAlign: "right" }}>{pct}%</T>
              </div>
            ))}
          </div>
        ))}
      </div>
      <T color="#80e8a5" style={{ marginTop: 10 }}>"Photosynthesis" jumped from 8% to 35% because in the SFT data, answers to "What is X?" almost always start with "X is..." The weights got nudged thousands of times in that direction. "What" dropped from 12% to 2% because good assistants don't repeat the question back.</T>
    </Box></Reveal>

    {/* ── Sub 4: The hidden prompt template ── */}
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The hidden template: what you never see</T>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>When you type a message to ChatGPT or Claude, you never see the full text that goes to the model. Behind the scenes, your message gets wrapped in a template:</T>
      <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", fontFamily: "monospace" }}>
        <T color={C.dim} size={14}>What you type:</T>
        <T color={C.bright} size={15} style={{ marginTop: 4 }}>"What is photosynthesis?"</T>
        <div style={{ margin: "12px 0", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
          <T color={C.dim} size={14}>What actually goes to the model:</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
            <T color={C.purple} size={15}><strong>User:</strong> What is photosynthesis?</T>
            <T color={C.green} size={15}><strong>Assistant:</strong></T>
          </div>
        </div>
      </div>
      <T color="#b8a9ff" style={{ marginTop: 10 }}>The model then starts predicting what comes after "Assistant:" one word at a time. Because SFT trained it on thousands of examples where helpful text followed "Assistant:", it now strongly favors producing that kind of text.</T>
      <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", fontFamily: "monospace" }}>
        <T color={C.dim} size={13}>Different models use different template formats. ChatGPT uses special tokens:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          <T color={C.orange} size={14}>{"<|im_start|>"}system</T>
          <T color={C.mid} size={14}>You are a helpful assistant.</T>
          <T color={C.orange} size={14}>{"<|im_end|>"}</T>
          <T color={C.orange} size={14}>{"<|im_start|>"}user</T>
          <T color={C.mid} size={14}>What is photosynthesis?</T>
          <T color={C.orange} size={14}>{"<|im_end|>"}</T>
          <T color={C.orange} size={14}>{"<|im_start|>"}assistant</T>
          <T color={C.green} size={14} style={{ fontStyle: "italic" }}>Photosynthesis is the process by which plants...</T>
          <T color={C.orange} size={14}>{"<|im_end|>"} <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontStyle: "italic" }}>← model generates this token to signal "I am done"</span></T>
        </div>
        <T color={C.dim} size={13} style={{ marginTop: 8 }}>Everything above {"<|im_start|>"}assistant is the template - sent to the model as input. The response text and the final {"<|im_end|>"} are generated by the model. It learns during SFT that after producing a complete answer, it should output {"<|im_end|>"} to stop.</T>
      </div>
      <T color="#b8a9ff" style={{ marginTop: 10 }}>This is also why <strong>system prompts</strong> work. The "You are a helpful assistant" text sits before the user's message. The model sees all of it as context and adjusts its style accordingly. Change it to "You are a pirate" and the model changes how it speaks.</T>
    </Box></Reveal>

    {/* ── Sub 5: Why 100K is enough ── */}
    <Reveal when={sub >= 5}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Why 100K examples is enough</T>
      <T color="#ffe082" style={{ marginTop: 8 }}>Pretraining needed trillions of words. SFT needs only ~100K conversations. That feels wrong. Why is so little data enough?</T>
      <T color="#ffe082" style={{ marginTop: 8 }}>Because SFT is not teaching new knowledge. The model already knows what photosynthesis is, already knows Python, already knows grammar. All of that was learned during pretraining and is stored deep in the weights.</T>
      <T color="#ffe082" style={{ marginTop: 8 }}>SFT only changes the <strong>surface behavior</strong> - the pattern of "when you see User: followed by a question, respond with a clear, helpful answer." That is a much simpler pattern than all of human language.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { phase: "Pretraining", data: "Trillions of words", learns: "All of language: grammar, facts, code, reasoning, style", change: "Builds the entire brain from scratch", color: C.orange },
          { phase: "SFT", data: "~100K conversations", learns: "One pattern: question goes in, helpful answer comes out", change: "Nudges the surface weights slightly", color: C.green },
        ].map(({ phase, data, learns, change, color }) => (
          <div key={phase} style={{ padding: "10px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={16}>{phase}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}><strong>Data:</strong> {data}</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}><strong>What it learns:</strong> {learns}</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}><strong>What changes:</strong> {change}</T>
          </div>
        ))}
      </div>
      <T color="#ffe082" style={{ marginTop: 10 }}>SFT uses a very small learning rate (tiny nudges per step). The deep weights that store facts barely move. Only the surface-level behavior changes - the "style" of what follows "Assistant:". Same knowledge, expressed as a helpful conversation instead of random internet text.</T>
    </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.6: RLHF - Making AI Helpful & Safe
// ============================================================================
export const RLHF = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>RLHF: Reinforcement Learning from Human Feedback</T>
        <T color="#80deea" style={{ marginTop: 6 }}>After SFT, the model is better - but not perfect. It may be verbose, unsafe, or disagreeable. How do we optimize for qualities humans care about?</T>
        <T color="#80deea" style={{ marginTop: 8 }}>RLHF is a 4-step process that uses human judgments to train a reward model, then uses that to optimize the LLM.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Step 1: Generate multiple responses</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>For a given prompt, the SFT model generates MULTIPLE candidate responses. Temperature controls diversity.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <T color={C.mid} size={15} style={{ fontStyle: "italic", textAlign: "center" }}>Prompt: "What's the best programming language for beginners?"</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { resp: "Python is best - simple syntax, huge libraries, great community.", rank: 1, label: "Clear & actionable" },
            { resp: "Python or Go. Python for web, Go for systems. Depends on goals.", rank: 2, label: "Nuanced" },
            { resp: "JavaScript. Runs everywhere, but quirky syntax can confuse newcomers.", rank: 3, label: "Decent but flawed reasoning" },
            { resp: "Rust. Memory safety. Compile-time errors catch bugs early.", rank: 4, label: "Incorrect - too hard for beginners" },
            { resp: "I am an AI and cannot learn programming.", rank: 5, label: "Nonsensical" },
          ].map(({ resp, rank, label }) => (
            <div key={resp.substring(0, 20)} style={{ padding: "10px 12px", borderRadius: 8, background: `${rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red}06`, border: `1px solid ${rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red}12` }}>
              <T color={rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red} size={14}>{resp}</T>
              <T color={C.dim} size={12} style={{ marginTop: 4 }}>← Rank #{rank}: {label}</T>
            </div>
          ))}
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Step 2: Human annotators rank responses</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Humans read pairs of responses and judge: "Which is better?" This creates a dataset of pairwise comparisons.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            resp_a: "Python is best - simple syntax, huge libraries, great community.",
            resp_b: "Python or Go. Python for web, Go for systems. Depends on goals.",
            winner: "B",
            reason: "More nuanced. Acknowledges tradeoffs.",
          },
          {
            resp_a: "Python is best - simple syntax, huge libraries, great community.",
            resp_b: "Rust. Memory safety. Compile-time errors catch bugs early.",
            winner: "A",
            reason: "A is actually beginner-friendly. B is too complex.",
          },
        ].map(({ resp_a, resp_b, winner, reason }, idx) => (
          <div key={idx} style={{ padding: "12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: winner === "A" ? `${C.green}12` : "rgba(255,255,255,0.02)", border: `1px solid ${winner === "A" ? C.green : "transparent"}12` }}>
                <T color={C.dim} size={12} bold>Response A:</T>
                <T color={C.mid} size={14} style={{ marginTop: 4 }}>{resp_a}</T>
              </div>
              <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: winner === "B" ? `${C.green}12` : "rgba(255,255,255,0.02)", border: `1px solid ${winner === "B" ? C.green : "transparent"}12` }}>
                <T color={C.dim} size={12} bold>Response B:</T>
                <T color={C.mid} size={14} style={{ marginTop: 4 }}>{resp_b}</T>
              </div>
            </div>
            <T color={winner === "A" ? C.green : C.yellow} bold size={14} style={{ marginTop: 8 }}>Winner: {winner}</T>
            <T color={C.dim} size={13} style={{ marginTop: 2 }}>Reason: {reason}</T>
          </div>
        ))}
      </div>
      <T color="#ffe082" style={{ marginTop: 8 }}>From tens of thousands of such comparisons, we build training data for a reward model.</T>
    </Box></Reveal>

    {/* ── Sub 3: Reward model - what it is + how it learns ── */}
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Step 3: Train a reward model</T>
      <T color="#80e8a5" style={{ marginTop: 8 }}>The reward model is a separate neural network. Its job is simple: take a prompt and a response, and output a single number - how good is this response? Higher number = more helpful, safer, better.</T>

      {/* What it is */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Input:</strong> a prompt + a complete response (as one block of text)</T>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <T color={C.dim} size={20}>↓</T>
        </div>
        <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Output:</strong> one single number (e.g., 8.5)</T>
        </div>
      </div>

      {/* How it trains */}
      <T color="#80e8a5" bold size={16} style={{ marginTop: 14 }}>How does it learn to score?</T>
      <T color="#80e8a5" style={{ marginTop: 4 }}>From the human comparisons in Step 2. Each comparison is a training example: a winner response and a loser response for the same prompt.</T>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          {
            prompt: "Best language for beginners?",
            winner: "Python - simple syntax, huge community, tons of tutorials.",
            loser: "Rust. Memory safety. Compile-time errors catch bugs early.",
            why: "Python is actually beginner-friendly. Rust is not.",
          },
          {
            prompt: "Is the earth flat?",
            winner: "No, the Earth is roughly spherical. Here is the evidence...",
            loser: "There are many perspectives on this topic...",
            why: "Direct and accurate. Does not treat misinformation as legitimate.",
          },
        ].map(({ prompt, winner, loser, why }, idx) => (
          <div key={idx} style={{ padding: "10px 12px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}10` }}>
            <T color={C.dim} size={13} style={{ fontStyle: "italic" }}>Prompt: "{prompt}"</T>
            <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, padding: "6px 8px", borderRadius: 6, background: `${C.green}10` }}>
                <T color={C.green} size={12} bold>WINNER</T>
                <T color={C.mid} size={13} style={{ marginTop: 2 }}>{winner}</T>
              </div>
              <div style={{ flex: 1, minWidth: 180, padding: "6px 8px", borderRadius: 6, background: `${C.red}08` }}>
                <T color={C.red} size={12} bold>LOSER</T>
                <T color={C.mid} size={13} style={{ marginTop: 2 }}>{loser}</T>
              </div>
            </div>
            <T color={C.dim} size={12} style={{ marginTop: 4 }}>{why}</T>
          </div>
        ))}
      </div>

      <T color="#80e8a5" style={{ marginTop: 8 }}>The reward model is trained with one rule: <strong>the winner must get a higher score than the loser</strong>. After seeing tens of thousands of these pairs, it learns to detect what makes a response helpful, accurate, and safe.</T>
    </Box></Reveal>

    {/* ── Sub 4: Reward model - scored responses after training ── */}
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>After training: the reward model can score any response</T>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { resp: "Python - simple, huge community.", score: 8.5, color: C.green },
          { resp: "Depends... Python vs Go...", score: 7.2, color: C.green },
          { resp: "Rust is safest.", score: 2.1, color: C.red },
          { resp: "I cannot answer.", score: 1.0, color: C.red },
        ].map(({ resp, score, color }) => (
          <div key={resp.substring(0, 15)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, background: `${color}06` }}>
            <T color={C.mid} size={13} style={{ flex: 1 }}>{resp}</T>
            <div style={{ width: 80, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${score * 10}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.7 }} />
            </div>
            <T color={color} bold size={15} style={{ minWidth: 35 }}>{score.toFixed(1)}</T>
          </div>
        ))}
      </div>
      <T color="#80e8a5" style={{ marginTop: 8 }}>Now we have a machine that can grade any response automatically. This is what PPO will use in Step 4 - instead of asking a human to grade every response (too slow and expensive), we ask the reward model (instant and free).</T>
    </Box></Reveal>

    {/* ── Sub 5: PPO - The 4-step loop ── */}
    <Reveal when={sub >= 5}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Step 4: PPO - How the model actually improves</T>
      <T color="#ef9a9a" style={{ marginTop: 8 }}>PPO (Proximal Policy Optimization) is the training loop that uses the reward model to make the LLM better. Here is exactly what happens, step by step, for one training round:</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            num: "1",
            label: "Generate",
            detail: "Give the model a prompt like \"Best language for beginners?\" and let it write a full response. It produces: \"Python is great for beginners because of its simple syntax and large community.\"",
            color: C.cyan,
          },
          {
            num: "2",
            label: "Score",
            detail: "Feed the prompt + response into the reward model. It outputs a single number: 8.5 out of 10. This means the response is helpful, clear, and accurate.",
            color: C.green,
          },
          {
            num: "3",
            label: "Compare",
            detail: "The original SFT model (before PPO training started) also looks at the same prompt. We measure: how different is the PPO model's response from what the SFT model would have said? This difference is called the KL divergence. If the PPO model has drifted too far from the SFT model, we penalize it.",
            color: C.orange,
          },
          {
            num: "4",
            label: "Nudge",
            detail: "If reward was high and the model hasn't drifted too far: nudge the weights to make this kind of response MORE likely. If reward was low: nudge the weights to make this kind of response LESS likely. If the model drifted too far from SFT: pull it back, even if the reward was high.",
            color: C.purple,
          },
        ].map(({ num, label, detail, color }) => (
          <div key={num} style={{ padding: "12px 14px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <T color={color} bold size={14}>{num}</T>
              </div>
              <T color={color} bold size={17}>{label}</T>
            </div>
            <T color={C.dim} size={14} style={{ paddingLeft: 38 }}>{detail}</T>
          </div>
        ))}
      </div>

      <T color="#ef9a9a" style={{ marginTop: 10 }}>This loop repeats thousands of times. Generate, score, compare, nudge. Over time, the model learns to produce responses that get high reward scores while staying close to the well-behaved SFT model.</T>
    </Box></Reveal>

    {/* ── Sub 6: KL divergence - concrete example ── */}
    <Reveal when={sub >= 6}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold size={20} center>What is KL (Kullback-Leibler) divergence? A concrete example</T>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>KL divergence just measures: how different are the PPO model's word predictions from the original SFT model's predictions? Here is a real comparison for the first word after "Best language for beginners?":</T>
      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          {
            label: "SFT model (original)",
            probs: [{ w: "Python", p: 40 }, { w: "I", p: 15 }, { w: "The", p: 12 }, { w: "others", p: 33 }],
            color: C.cyan,
          },
          {
            label: "PPO model (after 500 rounds)",
            probs: [{ w: "Python", p: 85 }, { w: "I", p: 3 }, { w: "The", p: 2 }, { w: "others", p: 10 }],
            color: C.purple,
          },
        ].map(({ label, probs, color }) => (
          <div key={label} style={{ flex: 1, minWidth: 180, padding: "8px 10px", borderRadius: 6, background: "rgba(0,0,0,0.2)" }}>
            <T color={color} bold size={13} center>{label}</T>
            {probs.map(({ w, p }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <T color={C.dim} size={12} style={{ width: 50, flexShrink: 0 }}>{w}</T>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 3, opacity: 0.6 }} />
                </div>
                <T color={C.dim} size={11} style={{ minWidth: 28, textAlign: "right" }}>{p}%</T>
              </div>
            ))}
          </div>
        ))}
      </div>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>The SFT model was spread out (40%, 15%, 12%...). The PPO model is concentrated (85% on one word). These distributions look very different, so the KL divergence is high: <strong>1.8</strong>.</T>
    </Box></Reveal>

    {/* ── Sub 7: Formula + worked examples + why KL needed ── */}
    <Reveal when={sub >= 7}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold size={20} center>The formula: Final Score = Reward - (β x KL)</T>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${C.green}06` }}>
          <T color={C.green} bold size={14} style={{ minWidth: 70 }}>Reward</T>
          <T color={C.dim} size={14}>How good is this response? (from the reward model). Higher = better.</T>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${C.orange}06` }}>
          <T color={C.orange} bold size={14} style={{ minWidth: 70 }}>KL</T>
          <T color={C.dim} size={14}>How far has the model drifted from the SFT model? Higher = more different.</T>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${C.purple}06` }}>
          <T color={C.purple} bold size={14} style={{ minWidth: 70 }}>β (beta)</T>
          <T color={C.dim} size={14}>A dial engineers set (0.1 to 0.5). Higher β = stricter penalty for drifting.</T>
        </div>
      </div>

      {/* Worked examples */}
      <T color="#ffb74d" bold size={14} style={{ marginTop: 12 }}>Three examples with β = 0.2:</T>
      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { resp: "Python - simple syntax, huge community, tons of tutorials.", reward: 8.5, kl: 0.02, color: C.green, verdict: "Good response, barely drifted. Almost full reward kept." },
          { resp: "Just learn Python I guess, whatever works, who cares.", reward: 3.1, kl: 0.15, color: C.orange, verdict: "Lazy response. Low reward, small nudge." },
          { resp: "PYTHON PYTHON PYTHON PYTHON BEST BEST BEST!!!", reward: 9.2, kl: 24.0, color: C.red, verdict: "Reward hacking! High score but model went crazy. KL penalty wipes out the reward entirely." },
        ].map(({ resp, reward, kl, color, verdict }) => {
          const penalty = 0.2 * kl;
          const final_score = reward - penalty;
          return (
          <div key={resp.substring(0, 15)} style={{ padding: "8px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}10` }}>
            <T color={C.mid} size={13} style={{ fontStyle: "italic" }}>"{resp}"</T>
            <div style={{ marginTop: 6, padding: "6px 8px", borderRadius: 4, background: "rgba(0,0,0,0.3)", fontFamily: "monospace" }}>
              <T color={C.dim} size={13}>Final = <strong style={{ color: C.green }}>{reward.toFixed(1)}</strong> - (0.2 x <strong style={{ color: C.orange }}>{kl.toFixed(2)}</strong>) = {reward.toFixed(1)} - {penalty.toFixed(2)} = <strong style={{ color }}>{final_score.toFixed(2)}</strong></T>
            </div>
            <T color={color} size={12} style={{ marginTop: 4 }}>{verdict}</T>
          </div>
        ); })}
      </div>

      {/* Why KL is needed */}
      <div style={{ marginTop: 12, padding: "12px", borderRadius: 8, background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.10)" }}>
        <T color="#ef9a9a" bold size={15}>Why is the KL penalty necessary?</T>
        <T color="#ef9a9a" style={{ marginTop: 6 }}>Without it, the model finds shortcuts. The reward model is not perfect - it has blind spots. The PPO model can discover responses that <strong>trick</strong> the reward model into giving high scores even though a human would hate them. Repeating keywords, using an overly confident tone, or stuffing filler words that the reward model likes. The KL penalty prevents this by saying: <strong>"you can improve, but you cannot become a completely different model."</strong></T>
      </div>
    </Box></Reveal>

    {/* ── Sub 8: Why RLHF matters ── */}
    <Reveal when={sub >= 8}><Box color={C.blue} style={{ width: "100%" }}>
      <T color="#5eb3ff" bold center size={20}>Why RLHF matters: what it fixes that SFT cannot</T>
      <T color="#5eb3ff" style={{ marginTop: 8 }}>SFT teaches the model to follow instructions by showing it good examples. But it has a fundamental limit: it can only learn from the exact examples humans wrote. RLHF goes further.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          {
            problem: "SFT can only copy the style of examples it saw",
            fix: "The reward model can score any new response the model invents, even ones no human ever wrote. So the model can discover better responses than exist in the SFT training data.",
            color: C.cyan,
          },
          {
            problem: "You cannot write a formula for 'helpful'",
            fix: "Cross-entropy measures prediction accuracy. But 'helpful', 'safe', 'honest' are fuzzy human judgments. The reward model learns these from human comparisons, then PPO optimizes for them.",
            color: C.green,
          },
          {
            problem: "SFT model can still produce harmful responses",
            fix: "Humans rate unsafe responses low. The reward model learns to give low scores to harmful content. PPO then nudges the weights away from generating such content.",
            color: C.red,
          },
        ].map(({ problem, fix, color }) => (
          <div key={problem.substring(0, 20)} style={{ padding: "10px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={C.orange} size={14} bold>The problem</T>
            <T color={C.dim} size={14}>{problem}</T>
            <T color={color} size={14} bold style={{ marginTop: 6 }}>How RLHF fixes it</T>
            <T color={C.dim} size={14}>{fix}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    {sub < 8 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.7: BATCH TRAINING - Why Not One Example at a Time?
// ============================================================================
export const BatchTraining = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Why batch training? Efficiency and stability.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Imagine training on 1 trillion tokens. Do we update weights after every single token? No - that's wasteful and noisy.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Instead, we group examples into <strong>batches</strong>, compute loss for all of them, then update once. This is faster and more stable.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Online vs Batch training - a concrete example</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>Say we have 3 training examples. Each produces a loss.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            method: "Online (update after each example)",
            steps: [
              "Ex1: loss=1.2 → compute gradients → update weights",
              "Ex2: loss=0.8 → compute gradients → update weights",
              "Ex3: loss=1.5 → compute gradients → update weights",
            ],
            upd_count: "3 weight updates",
            speed: "Slow. GPU not fully utilized.",
            stability: "Noisy. One bad example can derail training.",
            color: C.red,
          },
          {
            method: "Batch (update after all examples)",
            steps: [
              "Ex1: loss=1.2",
              "Ex2: loss=0.8",
              "Ex3: loss=1.5",
              "Avg loss = (1.2+0.8+1.5)/3 = 1.17 → compute gradients ONCE → update weights",
            ],
            upd_count: "1 weight update",
            speed: "Fast. GPU fully parallelized.",
            stability: "Smooth. Noise averages out.",
            color: C.green,
          },
        ].map(({ method, steps, upd_count, speed, stability, color }) => (
          <div key={method} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={17}>{method}</T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
              {steps.map((step, i) => (
                <T key={i} color={C.dim} size={14}>• {step}</T>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              <T color={C.mid} size={13}><strong>Updates:</strong> {upd_count}</T>
              <T color={C.mid} size={13}><strong>Speed:</strong> {speed}</T>
            </div>
            <T color={C.mid} size={13} style={{ marginTop: 6 }}><strong>Stability:</strong> {stability}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Gradient averaging in batches</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Each example computes its own gradient. With batching, we average them before updating.</T>
      <div style={{ marginTop: 12, fontFamily: "monospace", padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            "Ex1: gradient w.r.t weight = [0.05, -0.02, 0.08]",
            "Ex2: gradient w.r.t weight = [0.01, 0.03, -0.01]",
            "Ex3: gradient w.r.t weight = [0.02, 0.02, 0.04]",
            "",
            "Batch avg gradient = sum / 3 = [0.027, 0.010, 0.037]",
            "",
            "Update: weight -= lr * avg_gradient",
            "         (usually lr = 0.0001 to 0.001)",
          ].map((line, i) => (
            <T key={i} color={line.includes("avg") ? C.yellow : C.dim} size={14}>{line}</T>
          ))}
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>How batch size affects training</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Batch size is a key hyperparameter. Different sizes have tradeoffs:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { batch: "Batch size = 1", speed: "Very slow", memory: "Minimal", noise: "High (noisy gradient)", quality: "Can get stuck", use: "Research only" },
          { batch: "Batch size = 32", speed: "Slow", memory: "Low", noise: "Medium", quality: "Reasonable", use: "Small GPUs" },
          { batch: "Batch size = 256", speed: "Fast", memory: "Medium", noise: "Low (smooth)", quality: "Good", use: "Standard" },
          { batch: "Batch size = 1024+", speed: "Very fast", memory: "High", noise: "Very low", quality: "Excellent", use: "Large-scale training" },
        ].map(({ batch, speed, memory, noise, quality, use }) => (
          <div key={batch} style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.green} bold size={15}>{batch}</T>
            <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: C.dim }}>Speed: {speed}</span>
              <span style={{ fontSize: 12, color: C.dim }}>Memory: {memory}</span>
              <span style={{ fontSize: 12, color: C.dim }}>Noise: {noise}</span>
              <span style={{ fontSize: 12, color: C.dim }}>Quality: {quality}</span>
              <span style={{ fontSize: 12, color: C.mid }}>({use})</span>
            </div>
          </div>
        ))}
      </div>
    </Box></Reveal>

    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.8: THE OUTPUT LAYER - From Hidden State to Words
// ============================================================================
export const OutputLayer = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* ── Sub 0: What is a hidden state? Explained from scratch ── */}
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>What is a hidden state?</T>
        <T color="#80deea" style={{ marginTop: 6 }}>We keep saying the neural network "processes" the input. But what does that actually produce? The answer is a <strong>hidden state</strong> - and understanding it is the key to understanding this entire chapter.</T>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Step 1: Input */}
          <div style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
            <T color={C.purple} bold size={16}>Step 1: Input sentence enters the model</T>
            <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["The", "cat", "sat", "on", "the"].map((w, i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 6, background: `${C.purple}15`, border: `1px solid ${C.purple}25` }}>
                  <T color={C.purple} bold size={14}>{w}</T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>Each word gets converted to a vector of 768 numbers (the embedding from chapter 2.1). So "the" becomes [-0.14, 0.62, -0.38, ...]</T>
          </div>

          {/* Step 2: Layers process it */}
          <div style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
            <T color={C.orange} bold size={16}>Step 2: Hidden layers transform these vectors, one layer at a time</T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { layer: "Layer 1", desc: "Learns basic patterns: \"the\" is an article, \"cat\" is a noun", color: "#ffcc80" },
                { layer: "Layer 2", desc: "Learns combinations: \"the cat\" is a noun phrase", color: "#ffb74d" },
                { layer: "Layer 6", desc: "Learns grammar: \"sat on the\" expects a location next", color: "#ffa726" },
                { layer: "Layer 12 (final)", desc: "Encodes the full understanding: what word should come next", color: "#ff9800" },
              ].map(({ layer, desc, color }) => (
                <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 6, background: "rgba(0,0,0,0.2)" }}>
                  <T color={color} bold size={14} style={{ minWidth: 90 }}>{layer}</T>
                  <T color={C.dim} size={13}>{desc}</T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>Each layer takes in 768 numbers and outputs 768 new numbers. The vector gets refined and enriched at every step.</T>
          </div>

          {/* Step 3: The result */}
          <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold size={16}>Step 3: The final layer's output = the hidden state</T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>After ALL layers have processed the input, the last layer outputs a vector of 768 numbers for the last token ("the"). This final vector is called the <strong style={{ color: C.green }}>hidden state</strong>.</T>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} bold size={14}>Hidden state for "the" (768 numbers):</T>
              <T color={C.green} size={14} style={{ marginTop: 4, fontFamily: "monospace" }}>[-0.14, 0.62, -0.38, 1.05, -0.72, 0.91, ..., 0.21]</T>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>It is called "hidden" because you never see it - it lives inside the model between layers. It is called a "state" because it represents the model's current understanding. These 768 numbers encode everything: the meaning of "the cat sat on the", the grammar, the context, and a prediction of what word should come next.</T>
          </div>
        </div>

        <T color="#80deea" style={{ marginTop: 10 }}>Now we have this hidden state - 768 numbers that encode the model's understanding. But we need a <strong>word</strong>, not 768 numbers. The vocabulary has 50,000 tokens. How do we go from 768 numbers to a prediction?</T>
      </Box>
    )}

    {/* ── Sub 1: What are logits? ── */}
    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>From hidden state to scores: what is a logit?</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>We have the hidden state: 768 numbers. The model needs to decide which word comes next. There are 50,000 words in the vocabulary. So the model computes a <strong>score</strong> for every single word. Higher score = "I think this word is more likely to come next".</T>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold size={15}>Example: scores for "The cat sat on the ___"</T>
        <T color={C.dim} size={13} style={{ marginTop: 4 }}>The model computes one score for each of its 50,000 vocabulary words:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { w: "mat", s: 8.2, c: C.green },
            { w: "floor", s: 7.5, c: C.green },
            { w: "sofa", s: 6.1, c: C.green },
            { w: "the", s: 0.3, c: C.yellow },
            { w: "because", s: -3.7, c: C.red },
            { w: "photosynthesis", s: -8.9, c: C.red },
          ].map(({ w, s, c }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 6, background: `${c}06` }}>
              <T color={c} bold size={14} style={{ minWidth: 110 }}>"{w}"</T>
              <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.max(0, ((s + 10) / 20) * 100)}%`, height: "100%", background: c, borderRadius: 4, opacity: 0.6 }} />
              </div>
              <T color={c} bold size={14} style={{ minWidth: 45, textAlign: "right", fontFamily: "monospace" }}>{s >= 0 ? "+" : ""}{s.toFixed(1)}</T>
            </div>
          ))}
          <T color={C.dim} size={12} center style={{ marginTop: 2 }}>...and 49,994 more words, each with a score</T>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
        <T color={C.yellow} bold size={15}>These scores are called "logits"</T>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>That is all a logit is - <strong>the raw score the model gives to a word</strong>. Nothing more. The name comes from mathematics ("log-odds"), but for our purposes: logit = score.</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: C.green }} />
            <T color={C.dim} size={14}><strong style={{ color: C.green }}>Positive logit</strong> (+8.2) = the model thinks this word is a good fit</T>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: C.yellow }} />
            <T color={C.dim} size={14}><strong style={{ color: C.yellow }}>Near-zero logit</strong> (+0.3) = the model has no strong opinion</T>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: C.red }} />
            <T color={C.dim} size={14}><strong style={{ color: C.red }}>Negative logit</strong> (-8.9) = the model thinks this word is a terrible fit</T>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
        <T color={C.purple} bold size={15}>Logits are NOT probabilities</T>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>Logits are raw numbers. They can be -100 or +100 or anything. They do not add up to 100%. They are not percentages. To turn them into actual probabilities (where everything adds to 100%), we need one more step called <strong>softmax</strong> - which we will see in a later step of this chapter.</T>
      </div>

      <T color="#ffb74d" style={{ marginTop: 12 }}>So the pipeline so far: hidden state (768 numbers) → <strong>???</strong> → 50,000 logits → softmax → probabilities. The missing piece: how does the model go from 768 numbers to 50,000 logits? That is what the <strong>unembedding layer</strong> does.</T>
    </Box></Reveal>

    {/* ── Sub 2: NN diagram - hidden layers → hidden state → unembedding → vocab ── */}
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>The Unembedding Layer: from 768 numbers to 50,000 scores</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>There is one more layer after all the hidden layers. It is called the <strong>unembedding layer</strong> (or output projection). Here is what the full pipeline looks like:</T>

      {/* NN Diagram - proper deep network: L1 neurons → L2 neurons → ... → Ln neurons (= hidden state) → W → output */}
      <div style={{ marginTop: 16, padding: "10px 0", overflowX: "auto" }}>
        {(() => {
          /* Layer x-centers: L1, L2, dots, Ln(=hidden state), W, Output */
          const XL1 = 50, XL2 = 130, XDOT = 200, XLN = 270, XW = 370, XOUT = 470;
          /* 3 neurons per layer */
          const ly = [65, 120, 175];
          /* Output column: 4 neurons */
          const ouy = [45, 95, 130, 195];
          const R = 16;
          return (
          <svg viewBox="0 0 540 260" style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>

            {/* === Edges (drawn first, behind nodes) === */}

            {/* L1 → L2: fully connected */}
            {ly.map(sy => ly.map(dy => (
              <line key={`l1${sy}l2${dy}`} x1={XL1 + R + 2} y1={sy} x2={XL2 - R - 2} y2={dy} stroke={`${C.cyan}${Math.abs(sy - dy) < 10 ? '35' : '15'}`} strokeWidth={1.5} />
            )))}

            {/* L2 → dots (fading lines) */}
            {ly.map(sy => ly.map(dy => (
              <line key={`l2${sy}dot${dy}`} x1={XL2 + R + 2} y1={sy} x2={XDOT - 8} y2={dy} stroke={`${C.cyan}${Math.abs(sy - dy) < 10 ? '20' : '08'}`} strokeWidth={1} strokeDasharray="3,4" />
            )))}

            {/* dots → Ln (fading lines) */}
            {ly.map(sy => ly.map(dy => (
              <line key={`dot${sy}ln${dy}`} x1={XDOT + 8} y1={sy} x2={XLN - R - 2} y2={dy} stroke={`${C.purple}${Math.abs(sy - dy) < 10 ? '20' : '08'}`} strokeWidth={1} strokeDasharray="3,4" />
            )))}

            {/* Ln (hidden state) → Output (through unembedding) */}
            {ly.map(sy => ouy.map(dy => (
              <line key={`ln${sy}out${dy}`} x1={XLN + R + 2} y1={sy} x2={XOUT - R - 2} y2={dy} stroke={`${C.orange}${Math.abs(sy - dy) < 20 ? '20' : '08'}`} strokeWidth={1} />
            )))}

            {/* === Column labels === */}
            <text x={XL1} y={18} fill={C.cyan} fontSize={10} textAnchor="middle" fontWeight={700}>Layer 1</text>
            <text x={XL2} y={18} fill={C.cyan} fontSize={10} textAnchor="middle" fontWeight={700}>Layer 2</text>
            <text x={XLN} y={10} fill={C.purple} fontSize={10} textAnchor="middle" fontWeight={700}>Layer N</text>
            <text x={XLN} y={22} fill={C.purple} fontSize={8} textAnchor="middle" opacity="0.7">(= Hidden State)</text>
            <text x={XW} y={18} fill="#ffb74d" fontSize={10} textAnchor="middle" fontWeight={700}>Unembedding</text>
            <text x={XOUT} y={18} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle" fontWeight={600}>Output</text>
            <text x={XOUT} y={248} fill="rgba(255,255,255,0.25)" fontSize={8} textAnchor="middle">(50K logits)</text>

            {/* === Dashed box around Ln to highlight it as hidden state === */}
            <rect x={XLN - 24} y={40} width={48} height={160} fill="none" stroke={`${C.purple}30`} strokeWidth={1.5} strokeDasharray="5,5" rx={8} />

            {/* === Unembedding W matrix box === */}
            <rect x={XW - 26} y={35} width={52} height={175} rx={10} fill="rgba(255,171,64,0.12)" stroke="#ffb74d" strokeWidth={2} />
            <text x={XW} y={133} fill="#ffb74d" fontSize={16} fontWeight="700" textAnchor="middle" dominantBaseline="central">W</text>

            {/* === Layer 1 neurons === */}
            {ly.map((y, i) => (
              <g key={`l1n${i}`}>
                <circle cx={XL1} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={XL1} y={y + 4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">{["n\u2081", "n\u2082", "n\u2083"][i]}</text>
              </g>
            ))}

            {/* === Layer 2 neurons === */}
            {ly.map((y, i) => (
              <g key={`l2n${i}`}>
                <circle cx={XL2} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={XL2} y={y + 4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">{["n\u2081", "n\u2082", "n\u2083"][i]}</text>
              </g>
            ))}

            {/* === Dots column (just 3 dots) === */}
            {ly.map((y, i) => (
              <text key={`dot${i}`} x={XDOT} y={y + 4} fill="rgba(255,255,255,0.35)" fontSize={16} fontWeight={700} textAnchor="middle">...</text>
            ))}

            {/* === Layer N neurons (= hidden state) === */}
            {ly.map((y, i) => (
              <g key={`lnn${i}`}>
                <circle cx={XLN} cy={y} r={R} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
                <text x={XLN} y={y + 4} fill="#b8a9ff" fontSize={10} fontWeight={700} textAnchor="middle">{["h\u2081", "h\u2082", "h\u2087\u2086\u2088"][i]}</text>
              </g>
            ))}

            {/* === Output neurons === */}
            {[{ y: ouy[0], l: "the", a: false }, { y: ouy[1], l: "mat", a: true }, { y: ouy[2], l: "...", a: false }, { y: ouy[3], l: "dog", a: false }].map(({ y, l, a }) => (
              <g key={`out${l}`}>
                <circle cx={XOUT} cy={y} r={R} fill={a ? `${C.green}25` : `${C.green}08`} stroke={a ? C.green : `${C.green}40`} strokeWidth={2} />
                <text x={XOUT} y={y + 4} fill={a ? C.green : "#80e8a5"} fontSize={10} fontWeight={700} textAnchor="middle">{l}</text>
              </g>
            ))}

            {/* Bottom label */}
            <text x={270} y={250} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle">each layer has 768 neurons - only 3 shown for clarity</text>
          </svg>
          );
        })()}
      </div>

      <T color="#b8a9ff" style={{ marginTop: 10 }}>The hidden state (768 numbers) gets multiplied by the <strong>unembedding matrix</strong> (768 x 50,000). The result: one logit for every word in the vocabulary.</T>
    </Box></Reveal>

    {/* ── Sub 3: How the unembedding matrix works - concrete dot product ── */}
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>How does it actually work? One dot product per word</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>The unembedding matrix has 50,000 rows. Each row is a 768-dimensional vector that represents one vocabulary word. To get the logit for a word, we take the dot product of the hidden state with that word's row.</T>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color="#ffb74d" bold center size={15}>Example: computing the logit for "mat"</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <T color={C.mid} size={14}>Hidden state (768 values): [-0.14, 0.62, -0.38, 1.05, ...]</T>
          <T color={C.mid} size={14}>Row for "mat" in unembedding matrix: [0.45, 0.82, -0.21, 0.67, ...]</T>
          <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: `${C.orange}08` }}>
            <T color="#ffb74d" size={14}>logit = dot product = (-0.14 x 0.45) + (0.62 x 0.82) + (-0.38 x -0.21) + (1.05 x 0.67) + ...</T>
            <T color="#ffb74d" size={14} style={{ marginTop: 4 }}>= -0.063 + 0.508 + 0.080 + 0.704 + ... (768 terms added up)</T>
            <T color={C.green} bold size={16} center style={{ marginTop: 6 }}>logit for "mat" = 8.2</T>
          </div>
        </div>
      </div>

      <T color="#ffb74d" style={{ marginTop: 10 }}>This happens for ALL 50,000 words in parallel. Each word has its own row, its own dot product, its own logit. Words whose rows are "similar" to the hidden state get high scores. Words whose rows point in a different direction get low scores.</T>
    </Box></Reveal>

    {/* ── Sub 4: Raw logits for sample tokens ── */}
    <Reveal when={sub >= 4}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>The result: logits for every word in the vocabulary</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>After computing all 50,000 dot products for "The cat sat on the", we get raw scores (logits):</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { token: "mat", logit: 8.2, color: C.green },
          { token: "floor", logit: 7.5, color: C.green },
          { token: "sofa", logit: 6.1, color: C.green },
          { token: "table", logit: 5.8, color: C.yellow },
          { token: "bed", logit: 5.2, color: C.yellow },
          { token: "she", logit: -1.4, color: C.red },
          { token: "because", logit: -3.7, color: C.red },
          { token: "photosynthesis", logit: -8.9, color: C.red },
        ].map(({ token, logit, color }) => (
          <div key={token} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, background: `${color}06` }}>
            <T color={color} bold size={14} style={{ minWidth: 110 }}>{token}</T>
            <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${Math.max(0, ((logit + 10) / 20) * 100)}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.6 }} />
            </div>
            <T color={color} bold size={14} style={{ minWidth: 45, textAlign: "right", fontFamily: "monospace" }}>{logit >= 0 ? "+" : ""}{logit.toFixed(1)}</T>
          </div>
        ))}
        <T color={C.dim} size={13} center style={{ marginTop: 4 }}>...plus 49,992 more tokens with their own scores</T>
      </div>

      <T color="#ef9a9a" style={{ marginTop: 10 }}>These are just raw numbers - they can be negative, large, or small. They are not probabilities yet. We need softmax to convert them.</T>
    </Box></Reveal>

    {/* ── Sub 5: Softmax conversion ── */}
    <Reveal when={sub >= 5}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Softmax: from raw logits to probability distribution</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Softmax does two things: makes every number positive (using e^score), then divides by the total so everything adds up to 100%.</T>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color="#ffe082" bold center size={15}>Worked example for the top 5 tokens:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { token: "mat", logit: 8.2, exp: 3641, prob: 62.1 },
            { token: "floor", logit: 7.5, exp: 1808, prob: 30.8 },
            { token: "sofa", logit: 6.1, exp: 446, prob: 7.6 },
            { token: "table", logit: 5.8, exp: 330, prob: 5.6 },
            { token: "bed", logit: 5.2, exp: 181, prob: 3.1 },
          ].map(({ token, logit, exp, prob }) => (
            <div key={token} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 4, background: `${C.yellow}06` }}>
              <T color="#ffe082" bold size={13} style={{ minWidth: 55 }}>{token}</T>
              <T color={C.dim} size={13}>logit={logit.toFixed(1)}</T>
              <T color={C.dim} size={13}>→ e^{logit.toFixed(1)} = {exp}</T>
              <T color={C.dim} size={13}>→</T>
              <T color="#ffe082" bold size={13}>{prob}%</T>
            </div>
          ))}
        </div>
        <T color={C.dim} size={13} style={{ marginTop: 8 }}>probability = e^logit / sum of ALL e^logits across 50,000 tokens</T>
      </div>

      <T color="#ffe082" style={{ marginTop: 10 }}>The model predicts "mat" with 62.1% confidence. This is the final output - a probability distribution over the entire vocabulary. During training, we compare this to the actual next word and compute the loss.</T>
    </Box></Reveal>

    {/* ── Sub 6: Why one linear layer works + parameter count ── */}
    <Reveal when={sub >= 6}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why does one simple layer work? The hidden layers did the hard part</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>The output layer is just a matrix multiply - no activation function, no non-linearity. It seems too simple. But the hidden layers already did all the hard work.</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { layer: "All hidden layers (many layers deep)", job: "Understand context, grammar, meaning. Encode 'what should come next' into the 768-dim hidden state.", params: "billions of parameters", color: C.cyan },
          { layer: "Output layer (1 matrix)", job: "Translate the hidden state into a logit for each vocabulary word. Just one dot product per word.", params: "768 x 50K = 38.4M parameters", color: C.orange },
        ].map(({ layer, job, params, color }) => (
          <div key={layer} style={{ padding: "10px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={15}>{layer}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>{job}</T>
            <T color={color} size={13} style={{ marginTop: 4 }}>parameter count: {params}</T>
          </div>
        ))}
      </div>

      <T color="#80e8a5" style={{ marginTop: 10 }}>The output layer has less than 0.02% of the total parameters. It is tiny. All the intelligence lives in the hidden layers.</T>
    </Box></Reveal>

    {/* ── Sub 7: Weight tying with visual similarity example ── */}
    <Reveal when={sub >= 7}><Box color={C.blue} style={{ width: "100%" }}>
      <T color="#5eb3ff" bold center size={20}>The clever trick: weight tying</T>
      <T color="#5eb3ff" style={{ marginTop: 6 }}>Remember the embedding layer from chapter 2.1? It converts tokens to vectors. The embedding matrix has shape 50,000 x 768 - one 768-dim row per word.</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "10px 12px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
          <T color="#80deea" bold size={15}>Embedding matrix (input side)</T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>Shape: 50,000 x 768. Converts word → vector.</T>
          <T color={C.mid} size={14}>Row for "mat" = [0.45, 0.82, -0.21, 0.67, ...]</T>
        </div>
        <div style={{ padding: "10px 12px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
          <T color="#ffb74d" bold size={15}>Unembedding matrix (output side)</T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>Shape: 768 x 50,000. Converts hidden state → one logit per word.</T>
          <T color={C.mid} size={14}>This is just the embedding matrix <strong>transposed</strong>!</T>
        </div>
      </div>

      <T color="#5eb3ff" style={{ marginTop: 10 }}>This is called <strong>weight tying</strong>. The same matrix is used for both embedding and unembedding (just transposed). The model only needs to learn one set of word vectors, not two.</T>

      {/* Visual: why weight tying works */}
      <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold center size={15}>Why does this work? A visual example</T>
        <T color={C.dim} size={14} style={{ marginTop: 8 }}>Imagine the hidden state encodes: "something you sit on, on the floor". During embedding, similar words were placed near each other in the 768-dim space:</T>

        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { w: "mat", v: "[0.45, 0.82, -0.21, ...]", sim: 0.92, c: C.green },
            { w: "rug", v: "[0.43, 0.79, -0.19, ...]", sim: 0.89, c: C.green },
            { w: "carpet", v: "[0.41, 0.80, -0.23, ...]", sim: 0.87, c: C.green },
            { w: "table", v: "[0.30, 0.55, 0.12, ...]", sim: 0.58, c: C.yellow },
            { w: "sky", v: "[-0.60, 0.10, 0.85, ...]", sim: 0.05, c: C.red },
          ].map(({ w, v, sim, c }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${c}06` }}>
              <T color={c} bold size={14} style={{ minWidth: 60 }}>"{w}"</T>
              <T color={C.dim} size={12} style={{ flex: 1, fontFamily: "monospace" }}>{v}</T>
              <div style={{ width: 60, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${sim * 100}%`, height: "100%", background: c, borderRadius: 4, opacity: 0.7 }} />
              </div>
              <T color={c} bold size={13} style={{ minWidth: 35 }}>{(sim * 100).toFixed(0)}%</T>
            </div>
          ))}
        </div>

        <T color={C.dim} size={14} style={{ marginTop: 10 }}>The dot product between the hidden state and each word's embedding measures similarity. "mat", "rug", and "carpet" have embeddings pointing in a similar direction to the hidden state, so their dot products (logits) are high. "sky" points in a completely different direction, so its logit is near zero.</T>
        <T color="#5eb3ff" size={14} style={{ marginTop: 6 }}>Weight tying enforces this: if "mat" and "rug" were learned as similar meanings at input, they will automatically get similar logits at output. The model only learns one definition per word, and it works in both directions.</T>
      </div>
    </Box></Reveal>

    {sub < 7 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.9: AUTOREGRESSIVE GENERATION - One Token at a Time
// ============================================================================
export const AutoregressiveGeneration = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

    {/* ── Sub 0: Training sees everything at once, but generation builds one word at a time ── */}
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Two very different modes</T>
        <T color="#80deea" style={{ marginTop: 6 }}>The model has two lives. During <strong>training</strong>, it sees entire sentences and learns to predict the next word at every position. But when you actually <strong>use</strong> it (generation), it has to build the answer one word at a time.</T>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold size={16}>Training (learning phase)</T>
            <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["The", "cat", "sat", "on", "the", "mat"].map((w, i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 6, background: `${C.green}15`, border: `1px solid ${C.green}25` }}>
                  <T color={C.green} bold size={14}>{w}</T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>The model sees ALL words at once. At each position, it predicts the next word and checks if it was right. Fast - one pass through the whole sentence.</T>
          </div>

          <div style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
            <T color={C.orange} bold size={16}>Generation (using the model)</T>
            <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
              {["The", "cat", "sat", "on"].map((w, i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 6, background: `${C.orange}15`, border: `1px solid ${C.orange}25` }}>
                  <T color={C.orange} bold size={14}>{w}</T>
                </div>
              ))}
              <div style={{ padding: "4px 10px", borderRadius: 6, background: `${C.yellow}20`, border: `2px dashed ${C.yellow}50` }}>
                <T color={C.yellow} bold size={14}>???</T>
              </div>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>The model only has the prompt. It must predict the next word, add it, then predict the next, add it... one word at a time. This is called <strong>autoregressive generation</strong>.</T>
          </div>
        </div>
      </Box>
    )}

    {/* ── Sub 1: Step-by-step generation with full pipeline visible ── */}
    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Watch it build the sentence, word by word</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>Prompt: <strong>"The cat sat on"</strong>. At each step, the full pipeline runs: tokens go in, hidden layers process them, output layer produces 50,000 probabilities via softmax, and the model picks one word.</T>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { step: 1, input: ["The", "cat", "sat", "on"], pred: "the", prob: 72, topAlt: [{ w: "a", p: 15 }, { w: "that", p: 8 }] },
          { step: 2, input: ["The", "cat", "sat", "on", "the"], pred: "mat", prob: 68, topAlt: [{ w: "floor", p: 18 }, { w: "sofa", p: 7 }] },
          { step: 3, input: ["The", "cat", "sat", "on", "the", "mat"], pred: "last", prob: 45, topAlt: [{ w: "all", p: 22 }, { w: "and", p: 15 }] },
          { step: 4, input: ["The", "cat", "sat", "on", "the", "mat", "last"], pred: "week", prob: 91, topAlt: [{ w: "night", p: 5 }, { w: "time", p: 2 }] },
        ].map(({ step, input, pred, prob, topAlt }) => (
          <div key={step} style={{ padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.orange} bold size={16}>Step {step}</T>
            <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
              {input.map((w, i) => (
                <div key={i} style={{ padding: "3px 8px", borderRadius: 5, background: `${C.cyan}12` }}>
                  <T color={C.mid} size={13}>{w}</T>
                </div>
              ))}
              <T color={C.dim} size={16} style={{ margin: "0 4px" }}>→</T>
              <T color={C.dim} size={13}>hidden layers → output layer → softmax →</T>
            </div>
            {/* Probability bars */}
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={C.green} bold size={14} style={{ minWidth: 50 }}>"{pred}"</T>
                <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${prob}%`, height: "100%", background: C.green, borderRadius: 4, opacity: 0.7 }} />
                </div>
                <T color={C.green} bold size={13} style={{ minWidth: 35 }}>{prob}%</T>
              </div>
              {topAlt.map(({ w, p }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={C.dim} size={13} style={{ minWidth: 50 }}>"{w}"</T>
                  <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${p}%`, height: "100%", background: C.dim, borderRadius: 4, opacity: 0.4 }} />
                  </div>
                  <T color={C.dim} size={12} style={{ minWidth: 35 }}>{p}%</T>
                </div>
              ))}
            </div>
            <T color={C.bright} size={14} style={{ marginTop: 6 }}>Pick <strong style={{ color: C.green }}>"{pred}"</strong> → append it to the input for the next step</T>
          </div>
        ))}

        <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.green} bold size={16}>Final result</T>
          <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["The", "cat", "sat", "on", "the", "mat", "last", "week"].map((w, i) => (
              <div key={i} style={{ padding: "4px 10px", borderRadius: 6, background: i < 4 ? `${C.cyan}12` : `${C.green}15`, border: `1px solid ${i < 4 ? C.cyan : C.green}25` }}>
                <T color={i < 4 ? C.mid : C.green} bold size={14}>{w}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>Cyan = original prompt. Green = generated by the model, one at a time.</T>
        </div>
      </div>
    </Box></Reveal>

    {/* ── Sub 2: How the model picks - greedy vs sampling vs top-k ── */}
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>How does the model pick a word?</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>The model outputs a probability for every word. But how do we choose one? There are three strategies:</T>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.green} bold size={16}>Greedy: always pick the highest probability</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[{ w: "the", p: 72 }, { w: "a", p: 15 }, { w: "that", p: 8 }, { w: "his", p: 3 }].map(({ w, p }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={w === "the" ? C.green : C.dim} bold={w === "the"} size={14} style={{ minWidth: 50 }}>"{w}"</T>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${p}%`, height: "100%", background: w === "the" ? C.green : C.dim, borderRadius: 4, opacity: w === "the" ? 0.7 : 0.3 }} />
                </div>
                <T color={w === "the" ? C.green : C.dim} size={13} style={{ minWidth: 35 }}>{p}%</T>
                {w === "the" && <T color={C.green} bold size={13}>← always this one</T>}
              </div>
            ))}
          </div>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>Same input always gives same output. Safe and consistent, but can get repetitive - the model might loop the same phrase.</T>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
          <T color={C.purple} bold size={16}>Sampling: roll the dice (weighted by probability)</T>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>Imagine spinning a wheel where "the" takes up 72% of the wheel, "a" takes 15%, and so on. Wherever the wheel lands, that is the word we pick.</T>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[{ w: "the", p: "72%", c: C.cyan }, { w: "a", p: "15%", c: C.purple }, { w: "that", p: "8%", c: C.orange }, { w: "his", p: "3%", c: C.red }, { w: "...", p: "2%", c: C.dim }].map(({ w, p, c }) => (
              <div key={w} style={{ padding: "4px 10px", borderRadius: 6, background: `${c}10`, border: `1px solid ${c}25` }}>
                <T color={c} size={13}>{w}: {p}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>More creative and diverse. But sometimes picks low-probability words that make no sense.</T>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
          <T color={C.orange} bold size={16}>Top-K: sample, but only from the best K options</T>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>Keep only the top 10 (or 40, or 100) most likely words. Throw out the rest. Then sample from those.</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[{ w: "the", p: "72%", keep: true }, { w: "a", p: "15%", keep: true }, { w: "that", p: "8%", keep: true }, { w: "photosynthesis", p: "0.001%", keep: false }].map(({ w, p, keep }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, opacity: keep ? 1 : 0.4 }}>
                <T color={keep ? C.orange : C.dim} size={14} style={{ minWidth: 120 }}>"{w}"</T>
                <T color={keep ? C.orange : C.dim} size={13}>{p}</T>
                <T color={keep ? C.green : C.red} size={13}>{keep ? "kept" : "removed"}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>The sweet spot: creative enough to surprise you, but never picks something completely absurd.</T>
        </div>
      </div>
    </Box></Reveal>

    {/* ── Sub 3: Temperature - the creativity dial ── */}
    <Reveal when={sub >= 3}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Temperature: the creativity dial</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>Before softmax, we divide each logit by a number called <strong>temperature</strong>. This controls how "spread out" the probabilities are.</T>

      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold center size={15}>Same logits, different temperatures</T>
        <T color={C.dim} size={13} center style={{ marginTop: 4 }}>Raw logits: "the"=4.2, "a"=2.8, "that"=1.5</T>
      </div>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { temp: "0.2 (cold)", label: "Nearly greedy", probs: [{ w: "the", p: 99 }, { w: "a", p: 1 }, { w: "that", p: 0 }], color: C.blue, desc: "Dividing by 0.2 makes logits huge (21, 14, 7.5). Softmax crushes everything onto the winner." },
          { temp: "1.0 (default)", label: "Balanced", probs: [{ w: "the", p: 72 }, { w: "a", p: 18 }, { w: "that", p: 10 }], color: C.green, desc: "Logits stay the same. Probabilities reflect the model's true confidence." },
          { temp: "2.0 (hot)", label: "Creative", probs: [{ w: "the", p: 45 }, { w: "a", p: 30 }, { w: "that", p: 25 }], color: C.red, desc: "Dividing by 2.0 makes logits small (2.1, 1.4, 0.75). Softmax spreads probability more evenly." },
        ].map(({ temp, label: _label, probs, color, desc }) => (
          <div key={temp} style={{ padding: 12, borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={16}>Temperature = {temp}</T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>{desc}</T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
              {probs.map(({ w, p }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={color} size={14} style={{ minWidth: 50 }}>"{w}"</T>
                  <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.6 }} />
                  </div>
                  <T color={color} bold size={13} style={{ minWidth: 30 }}>{p}%</T>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold center size={15}>The formula</T>
        <T color={C.bright} size={16} center style={{ marginTop: 6, fontFamily: "monospace" }}>softmax( logit / temperature )</T>
        <T color={C.dim} size={13} center style={{ marginTop: 6 }}>Low temperature → winner takes all. High temperature → more even distribution. Temperature = 0 would be pure greedy (but we use 0.2 in practice).</T>
      </div>
    </Box></Reveal>

    {/* ── Sub 4: Why it works + when it stops ── */}
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why does this work? And when does it stop?</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Predicting one word at a time sounds fragile. But it works because of two key facts:</T>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: 12, borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
          <T color={C.cyan} bold size={16}>Full context at every step</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>At step 4, the model does not just see "last". It sees ALL previous words: "The cat sat on the mat last". Every generated word gets the benefit of the entire history. The hidden layers process all of these words together, so the model never "forgets" what came before.</T>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["The", "cat", "sat", "on", "the", "mat", "last"].map((w, i) => (
              <div key={i} style={{ padding: "3px 8px", borderRadius: 5, background: `${C.cyan}12`, border: `1px solid ${C.cyan}20` }}>
                <T color={C.cyan} size={13}>{w}</T>
              </div>
            ))}
            <T color={C.yellow} bold size={14} style={{ alignSelf: "center" }}>→ all visible at step 4</T>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
          <T color={C.purple} bold size={16}>Training matches generation</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>The model was trained on exactly this task: given the words so far, predict the next one. So generation is not some new challenge - it is the exact thing the model practiced trillions of times during training.</T>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
          <T color={C.orange} bold size={16}>Self-correction is built in</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>Even if the model picks a slightly unexpected word at step 2, it adjusts at step 3. The full context includes the "mistake", and the model learned during training how to continue coherently from any plausible word. Errors rarely compound.</T>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
        <T color={C.yellow} bold size={16}>When does it stop?</T>
        <T color={C.dim} size={14} style={{ marginTop: 4 }}>The vocabulary includes a special stop token (like {"<END>"} or {"<|endoftext|>"}). When the model assigns the highest probability to this token, generation stops. It is a learned behavior - the model saw thousands of sentences ending during training and learned to predict the stop token at natural endpoints.</T>
        <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.mid} size={14}>Step 5 input: "The cat sat on the mat last week"</T>
          <T color={C.mid} size={14} style={{ marginTop: 2 }}>Model predicts: {"<END>"} with 85% confidence → <strong style={{ color: C.green }}>generation complete</strong></T>
        </div>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>In practice, there is also a <strong>max length limit</strong> (like 4096 tokens). If the model has not produced a stop token by then, generation is cut off.</T>
      </div>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.9: DPO - Simpler Alignment
// ============================================================================
export const DPO = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Recall RLHF - 4 moving pieces</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>In chapter 2.8 we learned the RLHF pipeline. It works, but it is <strong>complex</strong>. Let's trace the full pipeline and see where the pain points are.</T>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { step: "1. Collect preferences", desc: "Humans rank pairs of responses (A > B)", color: C.orange },
            { step: "2. Train reward model", desc: "Separate neural net learns to score responses", color: C.yellow },
            { step: "3. RL optimization (PPO)", desc: "Policy model maximizes reward while staying close to reference", color: C.red },
            { step: "4. Repeat & stabilize", desc: "Balance reward hacking vs quality - tricky to tune", color: C.pink },
          ].map(({ step, desc, color }) => (
            <div key={step} style={{ padding: "10px 14px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
              <T color={color} bold size={17}>{step}</T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>{desc}</T>
            </div>
          ))}
        </div>
        <T color="#b8a9ff" style={{ marginTop: 10 }}>That is <strong>4 models running simultaneously</strong>: the policy (the LLM being trained), a frozen reference copy, the reward model, and a value model for PPO. Unstable RL training, risk of reward hacking. Can we do better?</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>DPO insight: skip the reward model entirely</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Key paper: <strong>"Direct Preference Optimization"</strong> (Rafailov et al., 2023).</T>
      <T color="#80e8a5" style={{ marginTop: 8 }}>The insight is elegant: given human preference pairs (response A is better than response B), we can derive the optimal policy <strong>directly</strong> from those pairs - no reward model needed.</T>
      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
        <T color={C.green} bold center size={17}>The mathematical trick</T>
        <T color={C.dim} size={15} style={{ marginTop: 6 }}>The reward model and the optimal policy are mathematically linked. If you know the optimal policy, you can derive what the reward model WOULD have been. So instead of training a separate reward model and then doing RL, you can fold both steps into a single supervised loss.</T>
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "stretch" }}>
        <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
          <T color={C.red} bold center size={16}>RLHF</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>Preferences → Reward model → RL → Policy</T>
          <T color={C.dim} size={13} style={{ marginTop: 2 }}>(3 separate training stages)</T>
        </div>
        <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.green} bold center size={16}>DPO</T>
          <T color={C.dim} size={14} style={{ marginTop: 4 }}>Preferences → Policy</T>
          <T color={C.dim} size={13} style={{ marginTop: 2 }}>(1 training stage)</T>
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>The DPO loss function</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>For each preference pair where y_w is the preferred response and y_l is the rejected response, given prompt x:</T>
      <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold center size={16} style={{ fontFamily: "monospace", lineHeight: 2 }}>
          Loss = -log( sigmoid( B x ( log pi(y_w|x)/pi_ref(y_w|x) - log pi(y_l|x)/pi_ref(y_l|x) ) ) )
        </T>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { sym: "pi(y|x)", desc: "Probability the model being trained assigns to response y", color: C.cyan },
          { sym: "pi_ref(y|x)", desc: "Probability the REFERENCE model assigns (frozen copy from before DPO training)", color: C.blue },
          { sym: "B (beta)", desc: "Controls how far we can deviate from reference - higher B = stay closer to reference", color: C.orange },
          { sym: "y_w", desc: "The preferred (winning) response from human annotation", color: C.green },
          { sym: "y_l", desc: "The rejected (losing) response from human annotation", color: C.red },
        ].map(({ sym, desc, color }) => (
          <div key={sym} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
            <code style={{ color, fontWeight: 700, fontSize: 16, minWidth: 100, fontFamily: "monospace" }}>{sym}</code>
            <T color={C.dim} size={15}>{desc}</T>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
        <T color={C.green} bold center size={16}>When does loss go down?</T>
        <T color={C.dim} size={15} style={{ marginTop: 6 }}>The inner term is: log(pi(y_w|x)/pi_ref(y_w|x)) - log(pi(y_l|x)/pi_ref(y_l|x))</T>
        <T color={C.dim} size={15} style={{ marginTop: 4 }}>This is positive when the model increases the probability of the preferred response AND decreases the probability of the rejected response (relative to reference). Sigmoid maps it to (0,1), then -log makes it a loss. Bigger gap between preferred and rejected = lower loss.</T>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
      <T color="#80deea" bold center size={20}>Why simpler is better</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 8, padding: "8px 10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} bold size={15}></T>
          <T color={C.red} bold center size={15}>RLHF</T>
          <T color={C.green} bold center size={15}>DPO</T>
        </div>
        {[
          { label: "Models needed", rlhf: "4 (policy, reference, reward, value)", dpo: "2 (policy, reference)", labelColor: C.mid },
          { label: "Training type", rlhf: "RL loop (PPO) - unstable", dpo: "Supervised loss - stable", labelColor: C.mid },
          { label: "Reward hacking", rlhf: "Real risk - model exploits reward model", dpo: "No reward model to hack", labelColor: C.mid },
          { label: "Hyperparameters", rlhf: "Many (PPO clip, learning rate, KL penalty...)", dpo: "Few (mainly beta)", labelColor: C.mid },
          { label: "Memory usage", rlhf: "4 models in GPU memory", dpo: "2 models in GPU memory", labelColor: C.mid },
          { label: "Quality", rlhf: "High", dpo: "Comparable - within 1-2% on benchmarks", labelColor: C.mid },
        ].map(({ label, rlhf, dpo, labelColor }) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
            <T color={labelColor} bold size={14}>{label}</T>
            <T color={C.dim} size={14}>{rlhf}</T>
            <T color={C.dim} size={14}>{dpo}</T>
          </div>
        ))}
      </div>
      <T color="#80deea" style={{ marginTop: 10 }}>Same quality, a fraction of the complexity. This is why DPO took over so quickly.</T>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Where DPO is used today</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>DPO and its variants have largely replaced full RLHF in practice:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { model: "LLaMA 2 & 3", detail: "Meta used DPO for alignment after SFT", color: C.blue },
          { model: "Mistral / Mixtral", detail: "DPO for instruction following", color: C.green },
          { model: "Zephyr", detail: "Showed DPO can match RLHF with less compute", color: C.purple },
        ].map(({ model, detail, color }) => (
          <div key={model} style={{ padding: "8px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={17}>{model}</T>
            <T color={C.dim} size={15} style={{ marginTop: 2 }}>{detail}</T>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
        <T color={C.yellow} bold center size={16}>DPO variants</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { name: "IPO", desc: "Identity Preference Optimization - fixes overfitting issues in DPO" },
            { name: "KTO", desc: "Kahneman-Tversky Optimization - works with thumbs-up/down instead of pairs" },
            { name: "ORPO", desc: "Odds Ratio Preference Optimization - combines SFT and alignment in one step" },
          ].map(({ name, desc }) => (
            <div key={name} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
              <T color={C.yellow} bold size={16} style={{ minWidth: 50 }}>{name}</T>
              <T color={C.dim} size={14}>{desc}</T>
            </div>
          ))}
        </div>
      </div>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.10: TokenizerDeepDive - BPE, WordPiece, SentencePiece
// ============================================================================
export const TokenizerDeepDive = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.blue} style={{ width: "100%" }}>
        <T color={C.blue} bold center size={20}>Recap: BPE (Byte-Pair Encoding)</T>
        <T color={C.blue} style={{ marginTop: 6 }}>In chapter 2.1, we learned BPE: start with characters, merge the most frequent pair, repeat. Let's trace "low" through BPE from scratch:</T>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { step: 'Start', tokens: ['"l"', '"o"', '"w"'], desc: "Split into individual characters", highlight: -1 },
            { step: 'Merge 1', tokens: ['"lo"', '"w"'], desc: 'Most frequent pair: l + o → "lo"', highlight: 0 },
            { step: 'Merge 2', tokens: ['"low"'], desc: 'Next frequent pair: lo + w → "low"', highlight: 0 },
          ].map(({ step, tokens, desc, highlight }) => (
            <div key={step} style={{ padding: "10px 14px", borderRadius: 8, background: `${C.blue}06`, border: `1px solid ${C.blue}12` }}>
              <T color={C.blue} bold size={16}>{step}</T>
              <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tokens.map((t, i) => (
                  <div key={i} style={{ padding: "4px 10px", borderRadius: 5, background: i === highlight ? `${C.green}20` : `${C.blue}10`, border: `1px solid ${i === highlight ? C.green : C.blue}25` }}>
                    <code style={{ color: i === highlight ? C.green : C.blue, fontSize: 16, fontWeight: 600 }}>{t}</code>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>{desc}</T>
            </div>
          ))}
        </div>
        <T color={C.blue} style={{ marginTop: 8 }}>BPE is used by GPT-2, GPT-3, GPT-4. It picks merges by <strong>raw frequency count</strong>.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>WordPiece (used by BERT)</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>Similar to BPE, but instead of raw frequency, WordPiece merges the pair that <strong>most increases the training data likelihood</strong>.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
          <T color={C.purple} bold size={16}>BPE merge criterion</T>
          <T color={C.dim} size={15} style={{ marginTop: 4 }}>count("lo") = 847 - highest count wins</T>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.green} bold size={16}>WordPiece merge criterion</T>
          <T color={C.dim} size={15} style={{ marginTop: 4 }}>score("lo") = count("lo") / (count("l") x count("o")) - likelihood ratio wins</T>
        </div>
      </div>
      <T color="#b8a9ff" style={{ marginTop: 10 }}>Key visual marker: the <strong>##</strong> prefix marks sub-word continuations.</T>
      <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
        <T color={C.bright} bold center size={15}>Example: "playing"</T>
        <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center" }}>
          {[{ t: "play", c: C.purple }, { t: "##ing", c: C.orange }].map(({ t, c }) => (
            <div key={t} style={{ padding: "6px 12px", borderRadius: 6, background: `${c}15`, border: `1px solid ${c}30` }}>
              <code style={{ color: c, fontSize: 17, fontWeight: 700 }}>{t}</code>
            </div>
          ))}
        </div>
        <T color={C.dim} size={14} center style={{ marginTop: 6 }}>The ## means "I'm a continuation of the previous token, not a standalone word"</T>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>SentencePiece (used by LLaMA, T5)</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>SentencePiece takes a fundamentally different approach: it treats the input as <strong>raw bytes/unicode</strong>. No pre-tokenization step - no word splitting first.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
          <T color={C.red} bold size={16}>BPE / WordPiece: pre-tokenize first</T>
          <T color={C.dim} size={15} style={{ marginTop: 4 }}>"I love cats" → split on spaces → ["I", "love", "cats"] → then apply merges within each word</T>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
          <T color={C.green} bold size={16}>SentencePiece: raw stream</T>
          <T color={C.dim} size={15} style={{ marginTop: 4 }}>"I love cats" → treat as raw character stream including spaces → apply merges directly</T>
        </div>
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
        <T color={C.cyan} bold center size={16}>Why this matters: languages without spaces</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { lang: "Chinese", ex: "I love cats", note: "No spaces between characters" },
            { lang: "Japanese", ex: "I love cats", note: "Mixed scripts, no consistent word boundaries" },
            { lang: "Thai", ex: "I love cats", note: "Words run together without separators" },
          ].map(({ lang, note }) => (
            <div key={lang} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
              <T color={C.cyan} bold size={15} style={{ minWidth: 70 }}>{lang}</T>
              <T color={C.dim} size={14}>{note}</T>
            </div>
          ))}
        </div>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>Pre-tokenizers that split on spaces would fail completely. SentencePiece handles all of these naturally because it works on raw bytes.</T>
      </div>
      <T color="#80e8a5" style={{ marginTop: 8 }}>Under the hood, SentencePiece can use either BPE or a <strong>Unigram</strong> model (which starts with a large vocabulary and prunes it down, the reverse of BPE).</T>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Why tokenization matters more than you think</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>The same concept can cost wildly different numbers of tokens depending on how it is written:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
          <T color={C.orange} bold size={16}>Numbers: inconsistent splits break arithmetic</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { input: '"12345"', tokens: '["123", "45"]', count: "2 tokens" },
              { input: '"67890"', tokens: '["678", "90"]', count: "2 tokens" },
              { input: '"12345 + 67890"', tokens: '["123", "45", " +", " ", "678", "90"]', count: "6 tokens" },
            ].map(({ input, tokens, count }) => (
              <div key={input} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                <code style={{ color: C.orange, fontSize: 15, minWidth: 130 }}>{input}</code>
                <T color={C.dim} size={14}>→ {tokens}</T>
                <T color={C.mid} size={13} bold style={{ marginLeft: "auto" }}>{count}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>The digit boundary shifts depending on the number. The model never sees "12345" as a single unit, making arithmetic unreliable.</T>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
          <T color={C.purple} bold size={16}>Non-English: same meaning, 3x the cost</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { word: '"Hello"', tokens: "1 token", cost: "1x", color: C.green },
              { word: '"Bonjour"', tokens: "1-2 tokens", cost: "1-2x", color: C.yellow },
              { word: '"Namaste"', tokens: "3 tokens", cost: "3x", color: C.red },
            ].map(({ word, tokens, cost, color }) => (
              <div key={word} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                <code style={{ color, fontSize: 16, fontWeight: 600, minWidth: 90 }}>{word}</code>
                <T color={C.dim} size={14}>{tokens}</T>
                <T color={color} bold size={14} style={{ marginLeft: "auto" }}>{cost}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>English dominates the training data, so English words get single tokens. Other languages pay a token tax.</T>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
          <T color={C.cyan} bold size={16}>Code: similar words, different token counts</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { word: '"print"', tokens: '["print"]', count: "1 token" },
              { word: '"println"', tokens: '["print", "ln"]', count: "2 tokens" },
              { word: '"printf"', tokens: '["print", "f"]', count: "2 tokens" },
            ].map(({ word, tokens, count }) => (
              <div key={word} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                <code style={{ color: C.cyan, fontSize: 15, fontWeight: 600, minWidth: 90 }}>{word}</code>
                <T color={C.dim} size={14}>→ {tokens}</T>
                <T color={C.mid} size={13} bold style={{ marginLeft: "auto" }}>{count}</T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>More tokens = slower inference (each token needs a full forward pass through the model).</T>
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Vocabulary size tradeoffs</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>How many tokens should the vocabulary contain? It is a direct tradeoff:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold center size={17}>Bigger vocab (100K)</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
              <T color={C.dim} size={14}>+ Shorter sequences (fewer tokens per sentence)</T>
              <T color={C.dim} size={14}>+ Faster inference</T>
              <T color={C.dim} size={14}>- More embedding parameters</T>
              <T color={C.dim} size={14}>- 100K x 4096 dims = <strong style={{ color: C.red }}>409M</strong> just for embeddings</T>
            </div>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.blue}06`, border: `1px solid ${C.blue}12` }}>
            <T color={C.blue} bold center size={17}>Smaller vocab (32K)</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
              <T color={C.dim} size={14}>+ Fewer embedding parameters</T>
              <T color={C.dim} size={14}>+ 32K x 4096 = <strong style={{ color: C.green }}>131M</strong> for embeddings</T>
              <T color={C.dim} size={14}>- Longer sequences (more tokens per sentence)</T>
              <T color={C.dim} size={14}>- Slower inference</T>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <T color="#ffe082" bold center size={16}>Real-world vocabulary sizes</T>
        {[
          { model: "GPT-2", vocab: "50,257", dims: "768", embParams: "38.6M", note: "First widely-used BPE tokenizer" },
          { model: "LLaMA", vocab: "32,000", dims: "4,096", embParams: "131M", note: "Smaller vocab, more languages" },
          { model: "GPT-4", vocab: "~100,000", dims: "~4,096", embParams: "~409M", note: "Largest vocab, shortest sequences" },
        ].map(({ model, vocab, dims, embParams, note }) => (
          <div key={model} style={{ display: "grid", gridTemplateColumns: "70px 70px 60px 60px 1fr", gap: 6, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)", alignItems: "center" }}>
            <T color={C.yellow} bold size={14}>{model}</T>
            <T color={C.mid} size={13}>{vocab}</T>
            <T color={C.dim} size={13}>{dims}d</T>
            <T color={C.mid} size={13}>{embParams}</T>
            <T color={C.dim} size={12}>{note}</T>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
        <T color={C.orange} bold center size={16}>Why LLaMA chose 32K</T>
        <T color={C.dim} size={15} style={{ marginTop: 4 }}>Meta wanted LLaMA to handle many languages efficiently. A smaller vocab means each token is more "general" (sub-word pieces that appear across languages). The tradeoff: slightly longer sequences, but a much smaller embedding table and better multilingual coverage per parameter.</T>
      </div>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }
