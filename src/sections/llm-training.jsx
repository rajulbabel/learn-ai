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
      <T color="#ef9a9a" style={{ marginTop: 8 }}>The model predicted "the" with 35% confidence. The correct answer IS "the". Good! But not perfect - 35% is not 100%.</T>
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
        <T color="#80deea" bold center size={20}>Cross-Entropy Loss: The LLM Score</T>
        <T color="#80deea" style={{ marginTop: 6 }}>We need one number to grade the model: "How good are your predictions?" This is cross-entropy loss.</T>
        <T color="#80deea" style={{ marginTop: 8 }}><strong>The formula:</strong> Loss = -log(P_correct)</T>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>where P_correct is the probability the model assigned to the actual next token.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
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

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
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

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
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

    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
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

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.4: SUPERVISED FINE-TUNING (SFT)
// ============================================================================
export const SFT = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>SFT: Teaching the model to follow instructions</T>
        <T color="#80deea" style={{ marginTop: 6 }}>After pretraining on raw text, the model is a prediction machine - not a helpful assistant. It might output toxic, unhelpful, or rambling text.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Supervised Fine-Tuning (SFT) teaches the model to behave by showing it examples of good responses.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>SFT data format: (instruction, response)</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>Humans write high-quality (question, answer) pairs. The model learns to match this pattern.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            q: "What is photosynthesis?",
            a: "Photosynthesis is the process where plants convert light energy into chemical energy. It happens in two stages: light-dependent reactions in the thylakoid, and the Calvin cycle in the stroma. Chlorophyll absorbs photons, exciting electrons that travel through the electron transport chain.",
            color: C.green,
          },
          {
            q: "The cat sat on the mat. Rewrite in past perfect.",
            a: "The cat had sat on the mat.",
            color: C.blue,
          },
          {
            q: "Code a function to reverse a list in Python.",
            a: "def reverse_list(lst):\n    return lst[::-1]\n\n# Or manually:\ndef reverse_manual(lst):\n    for i in range(len(lst)//2):\n        lst[i], lst[-i-1] = lst[-i-1], lst[i]\n    return lst",
            color: C.purple,
          },
        ].map(({ q, a, color }, idx) => (
          <div key={idx} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>❓</span>
              <div style={{ flex: 1 }}>
                <T color={C.dim} size={13} bold style={{ textTransform: "uppercase" }}>User input</T>
                <T color={color} size={16} style={{ marginTop: 4 }}>{q}</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
              <div style={{ flex: 1 }}>
                <T color={C.dim} size={13} bold style={{ textTransform: "uppercase" }}>Ideal assistant response</T>
                <T color={color} size={15} style={{ marginTop: 4, fontFamily: q.includes("Code") ? "monospace" : "inherit", whiteSpace: "pre-wrap" }}>{a}</T>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>How SFT differs from pretraining</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>The loss computation is identical (cross-entropy), but the training data changes.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            phase: "Pretraining",
            data: "1 trillion random tokens from the internet",
            task: "Predict next token given previous tokens",
            loss: "Loss = -log(P_next_token)",
            goal: "Learn language statistics, facts, reasoning",
            color: C.orange,
          },
          {
            phase: "SFT",
            data: "~100K human-curated (question, answer) pairs",
            task: "Continue from instruction, predict assistant's ideal response",
            loss: "Loss = -log(P_correct_response_token)",
            goal: "Learn to follow instructions & be helpful",
            color: C.green,
          },
        ].map(({ phase, data, task, loss, goal, color }) => (
          <div key={phase} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={18}>{phase}</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              <div><T color={C.dim} size={14}><strong>Data:</strong> {data}</T></div>
              <div><T color={C.dim} size={14}><strong>Task:</strong> {task}</T></div>
              <div><T color={C.dim} size={14}><strong>Loss formula:</strong> {loss}</T></div>
              <div><T color={C.mid} size={14}><strong>Goal:</strong> {goal}</T></div>
            </div>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Real example: Before vs After SFT</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>Same model, same input. Different behavior after SFT:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            label: "BEFORE SFT (pretrained model)",
            prompt: "User: What is photosynthesis?\nAssistant:",
            output: "What is photosynthesis? photosynthesis is the process of converting light energy into chemical energy in the form of glucose. In plants, photosynthesis occurs in the leaves. The rate of photosynthesis is affected by many factors. Some of these factors are light intensity, temperature, the concentration of carbon dioxide, and the amount of chlorophyll present.",
            problem: "Rambles. Doesn't structure answer. Incomplete. Not conversational.",
            color: C.red,
          },
          {
            label: "AFTER SFT (instruction-following)",
            prompt: "User: What is photosynthesis?\nAssistant:",
            output: "Photosynthesis is the biological process by which plants and some microorganisms convert light energy (usually from the sun) into chemical energy stored in glucose. It occurs primarily in leaves through two stages: (1) Light-dependent reactions in the thylakoid membranes, where light energy excites electrons and produces ATP and NADPH, and (2) the Calvin cycle in the stroma, where ATP and NADPH drive the synthesis of glucose from CO2.",
            problem: "Clear. Structured. Accurate. Conversational. Well-paced.",
            color: C.green,
          },
        ].map(({ label, prompt, output, problem, color }) => (
          <div key={label} style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
            <T color={color} bold size={16}>{label}</T>
            <T color={C.dim} size={13} style={{ marginTop: 6, fontStyle: "italic" }}>Input: {prompt}</T>
            <div style={{ marginTop: 8, padding: "10px", borderRadius: 6, background: `${color}12`, border: `1px solid ${color}15` }}>
              <T color={color} size={14}>{output}</T>
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>← {problem}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Why SFT works despite small datasets</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>Pretraining teaches the model language. SFT just teaches it HOW to apply that knowledge - like muscle memory.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { icon: "🧠", what: "Model already knows:", details: "What photosynthesis IS (from pretraining on Wikipedia, textbooks, etc.)" },
          { icon: "📚", what: "SFT teaches:", details: "How to STRUCTURE an answer to a question in a helpful, clear way" },
          { icon: "⚡", what: "Result:", details: "With just ~100K examples, the model learns the instruction-following pattern" },
        ].map(({ icon, what, details }) => (
          <div key={what} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.dim} size={14}><span style={{ fontSize: 20, marginRight: 8 }}>{icon}</span>{what} {details}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.5: RLHF - Making AI Helpful & Safe
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

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Step 3: Train a reward model</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>A reward model is a neural network trained to predict: "Given a prompt and response, how good is this response?"</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Reward Model Input:</strong> prompt + response</T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>e.g., "What's best for beginners?" + "Python is simple..."</T>
        </div>
        <div style={{ padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Reward Model Output:</strong> single score</T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>e.g., 8.3/10 (good response), or 2.1/10 (bad response)</T>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { prompt: "Best for beginners?", resp: "Python - simple, huge community.", score: 8.5 },
          { prompt: "Best for beginners?", resp: "Depends... Python vs Go...", score: 7.2 },
          { prompt: "Best for beginners?", resp: "Rust is safest.", score: 2.1 },
          { prompt: "Best for beginners?", resp: "I cannot answer.", score: 1.0 },
        ].map(({ prompt, resp, score }) => (
          <div key={resp.substring(0, 15)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, background: score > 7 ? `${C.green}06` : score > 4 ? "rgba(255,255,255,0.02)" : `${C.red}06` }}>
            <div style={{ flex: 1 }}>
              <T color={C.dim} size={13}>{resp}</T>
            </div>
            <div style={{ width: 60, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${score * 10}%`, height: "100%", background: score > 7 ? C.green : score > 4 ? C.mid : C.red }} />
            </div>
            <T color={C.mid} bold size={15} style={{ minWidth: 35 }}>{score.toFixed(1)}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.red} style={{ width: "100%" }}>
      <T color="#ef9a9a" bold center size={20}>Step 4: PPO - Optimize using the reward</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>Now we have a reward function. We use Proximal Policy Optimization (PPO) to fine-tune the LLM to maximize this reward.</T>
      <T color="#ef9a9a" style={{ marginTop: 6 }}>But there's a catch: if we optimize TOO hard, the LLM will diverge from the original SFT model and start gibberish.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>PPO Loss = Reward - β · KL_Divergence</strong></T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>β controls the tradeoff. Usually β ≈ 0.1 - 0.5</T>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { comp: "Maximize Reward", desc: "Update weights toward high-scoring responses", benefit: "Model becomes helpful", danger: "Might collapse into junk" },
          { comp: "KL Divergence penalty", desc: "Measure: how far is new model from SFT model?", benefit: "Prevents crazy divergence", danger: "Slows optimization if β too high" },
        ].map(({ comp, desc, benefit, danger }) => (
          <div key={comp} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.red} bold size={16}>{comp}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>{desc}</T>
            <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
              <T color={C.green} size={13}>✓ {benefit}</T>
              <T color={C.orange} size={13}>⚠ {danger}</T>
            </div>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 5}><Box color={C.blue} style={{ width: "100%" }}>
      <T color="#5eb3ff" bold center size={20}>Why RLHF is hard but powerful</T>
      <T color="#5eb3ff" style={{ marginTop: 6 }}>RLHF involves 4 different neural networks and multiple training loops. Here's why it matters:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { problem: "SFT learns from small datasets", sol: "RLHF leverages human preference at scale through a learned reward model - one model judges 1000s of comparisons" },
          { problem: "Can't write loss for 'helpful' directly", sol: "Reward model learns it from examples, then PPO optimizes for it" },
          { problem: "Helps against harmful outputs", sol: "Humans rate responses as unsafe/safe, reward model penalizes unsafe ones" },
        ].map(({ problem, sol }) => (
          <div key={problem} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.orange} size={14}><strong>Problem:</strong> {problem}</T>
            <T color={C.cyan} size={14} style={{ marginTop: 4 }}><strong>RLHF Solution:</strong> {sol}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.6: BATCH TRAINING - Why Not One Example at a Time?
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
// 2.7: THE OUTPUT LAYER - From Hidden State to Words
// ============================================================================
export const OutputLayer = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>From hidden state to probabilities</T>
        <T color="#80deea" style={{ marginTop: 6 }}>After the transformer processes "The cat sat", the last token produces a <strong>hidden state</strong> - a 768-dimensional vector.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>But we need probabilities over 50,000 vocabulary tokens. How do we get from one vector to 50K numbers?</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>The output layer: a single linear transformation</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}>The output layer is just ONE matrix: W_output, shape 768 × 50000.</T>
      <div style={{ marginTop: 12, padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)", textAlign: "center" }}>
        <T color={C.bright} size={16}><strong>logits = hidden_state · W_output</strong></T>
        <T color={C.dim} size={13} style={{ marginTop: 4 }}>768-dim vector times 768×50000 matrix = 50000-dim output vector</T>
      </div>
      <T color="#ffb74d" style={{ marginTop: 8 }}>Each output dimension corresponds to one vocabulary token. Higher value = model thinks that token is more likely.</T>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>Example: "The cat sat" step-by-step</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Token "sat" at position 3. Transformer processes it and outputs a hidden state:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>hidden_state (after token 'sat')</strong></T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>[-0.14, 0.62, -0.38, ..., 0.21] (768 values, all learned)</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>Multiply by W_output</strong></T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>hidden_state · W_output → 50000-dim logits vector</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.bright} size={15}><strong>First few logits (sampled)</strong></T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>logits[262] (token "the") = 8.5</T>
          <T color={C.mid} size={14}>logits[464] (token "The") = 7.2</T>
          <T color={C.mid} size={14}>logits[319] (token "on") = 0.3</T>
          <T color={C.mid} size={14}>logits[3797] (token "cat") = -1.2</T>
        </div>
        <div style={{ padding: "10px", borderRadius: 6, background: `${C.yellow}12`, border: `1px solid ${C.yellow}25` }}>
          <T color={C.yellow} size={15}><strong>Apply softmax to get probabilities</strong></T>
          <T color={C.mid} size={14} style={{ marginTop: 4 }}>prob[262] ("the") = 0.72 (highest - makes sense!)</T>
          <T color={C.mid} size={14}>prob[464] ("The") = 0.18</T>
          <T color={C.mid} size={14}>prob[319] ("on") = 0.07</T>
          <T color={C.mid} size={14}>prob[3797] ("cat") = 0.03</T>
        </div>
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why one linear layer works</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>The transformer already did all the hard work - understanding context. The output layer just needs to map that understanding to vocab.</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { layer: "Transformer blocks (90% of parameters)", job: "Extract meaning from context", ex: "Understand that 'sat' needs a location following it" },
          { layer: "Output layer (tiny!)", job: "Convert to vocab probabilities", ex: "Map meaning to words like 'on', 'in', 'at'" },
        ].map(({ layer, job, ex }) => (
          <div key={layer} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.green} bold size={15}>{layer}</T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>Task: {job}</T>
            <T color={C.mid} size={13} style={{ marginTop: 2 }}>Example: {ex}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Parameter count: output layer is surprisingly small</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>You'd think a matrix from 768 → 50K requires huge computation. But:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace" }}>
        {[
          { name: "Transformer parameters (GPT-2)", params: "124M", pct: "~99.4%" },
          { name: "Output layer W_output", params: "768 × 50K = 38.4M", pct: "~0.6%" },
        ].map(({ name, params, pct }) => (
          <div key={name} style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 10 }}>
            <T color={C.mid} size={14} style={{ flex: 1 }}>{name}</T>
            <T color={C.purple} bold size={14} style={{ minWidth: 120 }}>{params}</T>
            <T color={C.dim} size={13}>{pct}</T>
          </div>
        ))}
      </div>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>The output layer is <strong>not the bottleneck</strong>. The transformer is where all the computation happens.</T>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ============================================================================
// 2.8: AUTOREGRESSIVE GENERATION - One Token at a Time
// ============================================================================
export const AutoregressiveGeneration = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Autoregressive generation: predict one word, feed it back</T>
        <T color="#80deea" style={{ marginTop: 6 }}>During training, we see all tokens at once and predict the next. But during inference (using the model), we generate token by token.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Each generated token becomes input for the next prediction. "Autoregressive" = using output as input.</T>
      </Box>
    )}

    <Reveal when={sub >= 1}><Box color={C.orange} style={{ width: "100%" }}>
      <T color="#ffb74d" bold center size={20}>Example: complete the sentence</T>
      <T color="#ffb74d" style={{ marginTop: 6 }}><strong>Prompt:</strong> "The cat sat on"</T>
      <T color="#ffb74d" style={{ marginTop: 8 }}>Model generates the next word one at a time:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          {
            step: "Step 1",
            input: ["The", "cat", "sat", "on"],
            pred: "the",
            prob: 0.72,
            output: ["The", "cat", "sat", "on", "the"],
          },
          {
            step: "Step 2",
            input: ["The", "cat", "sat", "on", "the"],
            pred: "mat",
            prob: 0.68,
            output: ["The", "cat", "sat", "on", "the", "mat"],
          },
          {
            step: "Step 3",
            input: ["The", "cat", "sat", "on", "the", "mat"],
            pred: "last",
            prob: 0.45,
            output: ["The", "cat", "sat", "on", "the", "mat", "last"],
          },
          {
            step: "Step 4",
            input: ["The", "cat", "sat", "on", "the", "mat", "last"],
            pred: "week",
            prob: 0.91,
            output: ["The", "cat", "sat", "on", "the", "mat", "last", "week"],
          },
          {
            step: "Step 5",
            input: ["The", "cat", "sat", "on", "the", "mat", "last", "week"],
            pred: "<END>",
            prob: 0.85,
            output: "DONE",
          },
        ].map(({ step, input, pred, prob, output }) => (
          <div key={step} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.orange} bold size={15}>{step}</T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>Input tokens: {input.join(" ")}</T>
            <T color={C.yellow} size={15} style={{ marginTop: 4 }}><strong>Predict:</strong> "{pred}" (P={prob.toFixed(2)})</T>
            <T color={C.mid} size={13} style={{ marginTop: 4 }}>→ Sequence becomes: {Array.isArray(output) ? output.join(" ") : output}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color="#ffe082" bold center size={20}>How probabilities guide choices</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>At each step, the model outputs probabilities. We can sample or take the highest (greedy).</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          {
            method: "Greedy (always pick highest)",
            desc: "Take the word with max probability.",
            ex: "If P(the)=0.72, P(a)=0.15, P(that)=0.08 → pick 'the'",
            pro: "Deterministic, fast",
            con: "Sometimes boring (repeats)",
          },
          {
            method: "Sampling (pick randomly by probability)",
            desc: "Roll a die weighted by probabilities.",
            ex: "72% chance pick 'the', 15% pick 'a', 8% pick 'that'",
            pro: "Diverse, creative",
            con: "Can be incoherent (low prob words)",
          },
          {
            method: "Top-K sampling (sample from top-K words)",
            desc: "Only consider the K most likely words.",
            ex: "Take top 10 words, ignore the rest, sample from those",
            pro: "Balanced: diverse but coherent",
            con: "Requires tuning K",
          },
        ].map(({ method, desc, ex, pro, con }) => (
          <div key={method} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.yellow} bold size={15}>{method}</T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>{desc}</T>
            <T color={C.mid} size={12} style={{ marginTop: 3 }}>Example: {ex}</T>
            <T color={C.green} size={12} style={{ marginTop: 3 }}>Pro: {pro}</T>
            <T color={C.orange} size={12}>Con: {con}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
      <T color="#80e8a5" bold center size={20}>Why autoregressive works despite one-at-a-time prediction</T>
      <T color="#80e8a5" style={{ marginTop: 6 }}>You might think: "Predict each word separately? Errors will compound!" But in practice:</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { factor: "Context window", why: "Each new token sees ALL previous tokens (full context from start), not just the last word. Errors don't cascade." },
          { factor: "Self-attention", why: "The model can pay attention to distant tokens, not just recent ones. Long-range dependencies preserved." },
          { factor: "Training matches inference", why: "Model trained on next-token prediction (like it does at inference), so it's learned to handle this" },
          { factor: "Probability collapse", why: "Even if model assigns 60% to the wrong word, 40% to right word, it usually recovers in the next step" },
        ].map(({ factor, why }) => (
          <div key={factor} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.green} bold size={15}>{factor}</T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>{why}</T>
          </div>
        ))}
      </div>
    </Box></Reveal>

    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
      <T color="#b8a9ff" bold center size={20}>Speed: why longer sequences are slower</T>
      <T color="#b8a9ff" style={{ marginTop: 6 }}>Generating 100 tokens takes ~100x longer than a single token (quadratic with sequence length):</T>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { step: "Step 1", seq_len: 5, attn_pairs: 25, time: "1x" },
          { step: "Step 2", seq_len: 6, attn_pairs: 36, time: "1.4x" },
          { step: "Step 3", seq_len: 7, attn_pairs: 49, time: "2x" },
          { step: "...", seq_len: "...", attn_pairs: "...", time: "..." },
          { step: "Step 100", seq_len: 104, attn_pairs: 10816, time: "~432x" },
        ].map(({ step, seq_len, attn_pairs, time }) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
            <T color={C.dim} size={14} style={{ minWidth: 70 }}>{step}</T>
            <T color={C.mid} size={13} style={{ minWidth: 60 }}>Seq len: {seq_len}</T>
            <T color={C.mid} size={13} style={{ minWidth: 100 }}>Attn pairs: {attn_pairs}</T>
            <T color={C.purple} bold size={14} style={{ minWidth: 40 }}>{time}</T>
          </div>
        ))}
      </div>
      <T color="#b8a9ff" style={{ marginTop: 8 }}>This is why <strong>caching</strong> helps: store previous hidden states so you don't recompute attention for old tokens.</T>
    </Box></Reveal>

    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }
