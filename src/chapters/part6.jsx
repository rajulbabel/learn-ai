import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

export const Ch6_1 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center size={20}>Computers only understand numbers.</T><T color="#80deea">Text is useless to an AI - no matter how eloquent. First step: convert "Hello world" into [1, 2, 3, 4, 5].</T></Box>}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center>Three tokenization approaches:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "Character-level", ex: "'hi' → ['h', 'i']", pros: "Works for any word", cons: "Way too granular, sequences too long", color: C.red },
            { name: "Word-level", ex: "'unhappy' → ['unhappy']", pros: "Natural", cons: "50K+ tokens needed. New words = failure", color: C.orange },
            { name: "Sub-word (Byte-Pair Encoding)", ex: "'unhappy' → ['un', 'hap', 'py']", pros: "Sweet spot. ~50K tokens covers everything", cons: "Need to learn the splits first", color: C.green },
          ].map(({ name, ex, pros, cons, color }) => (
            <div key={name} style={{ padding: "8px 12px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}12` }}>
              <T color={color} bold size={16}>{name}</T>
              <T color={C.dim} size={14}>{ex}</T>
              <T color={C.dim} size={13}>✓ {pros}</T>
              <T color={C.dim} size={13}>✗ {cons}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={19}>BPE - Counting real pairs from real text</T>
        <T color={C.dim} size={13} center style={{ marginTop: 2 }}>Training text: "the cat sat on the mat the cat ate"</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { step: "1. Split into characters", desc: "t|h|e c|a|t s|a|t o|n t|h|e m|a|t t|h|e c|a|t a|t|e" },
            { step: "2. Count every pair", desc: "a+t → 5× (cat, sat, mat, cat, ate) | t+h → 3× | h+e → 3× | c+a → 2×" },
            { step: "3. Merge the winner", desc: "a+t wins (5×) → merge into 'at'. Text: th|e c|at s|at o|n th|e m|at ..." },
            { step: "4. Count again on new text", desc: "t+h → 3× | h+e → 3× | c+at → 2× → merge t+h → 'th'" },
            { step: "5. Keep going", desc: "th+e→'the' (3×) → c+at→'cat' (2×) → at+e→'ate' → s+at→'sat' → ..." },
          ].map(({ step, desc }) => (
            <div key={step} style={{ padding: "5px 10px", borderRadius: 6, background: `${C.purple}08`, border: `1px solid ${C.purple}12` }}>
              <T color={C.purple} bold size={14}>{step}:</T>
              <T color={C.dim} size={13}>{desc}</T>
            </div>
          ))}
        </div>
        <T color="#b8a9ff" size={13} style={{ marginTop: 6 }}>Above, "5×" means we counted a+t appearing 5 times in our 9-word sentence. GPT does the same thing - but on billions of words, so counts become millions. Same process, bigger numbers.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>Real example:</T>
        <T color="#80deea" size={16} style={{ marginTop: 6 }}>Word: "unhappiness"</T>
        <T color="#80deea" size={14}>Tokenizes to: ['un', 'hap', 'pi', 'ness']</T>
        <T color="#80deea" size={14}>Token IDs: [782, 14553, 3920, 2494]</T>
        <T color="#80deea" style={{ marginTop: 8 }}>The model NEVER saw "unhappiness" in training, but it knows each piece. Combine them → understands the word.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={19}>The complete pipeline:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "stretch", gap: 3 }}>
          {[
            { text: "Raw Text", color: C.red },
            { text: "↓ Tokenizer ↓", color: C.dim },
            { text: "Token IDs: [782, 14553, 2494, ...]", color: C.yellow },
            { text: "↓ Embedding Layer ↓", color: C.dim },
            { text: "Embedding Vectors: [[-0.2, 0.5, 0.1], [0.3, -0.4, 0.7], ...]", color: C.cyan },
            { text: "↓ Into Transformer ↓", color: C.dim },
            { text: "Attention, prediction, generation", color: C.green },
          ].map(({ text, color }, i) => (
            <T key={i} color={color} size={15} center bold={text.includes("↓") ? false : true}>{text}</T>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.yellow}><T color="#ffe082" bold center>GPT has ~50,000 tokens. Some are common ('the', 'is'), some are rare. 'cryptocurrency' = 3 tokens. 'the' = 1 token.</T><T color="#ffe082" style={{ marginTop: 6 }}>This is why token limits matter: 1 paragraph ≈ 100 tokens. Your 4K context window ≈ 40 paragraphs.</T></Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 2.2 Self-Supervised Learning ═══════
export const Ch6_2 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>The Labeling Problem:</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Supervised learning needs millions of labeled examples: <strong>input → label</strong>. For language, that means billions of humans writing ideal responses. Impossible.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The Genius Trick: Use the text itself as the label.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Given: "The capital of France is"</T>
        <T color="#80deea" style={{ marginTop: 4, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>Model predicts the next token: <strong>"Paris"</strong></T>
        <T color="#80deea" style={{ marginTop: 6 }}>Correct answer is RIGHT THERE in the original text. No humans needed.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>Scaling without limit:</T>
        <T color="#ffe082" style={{ marginTop: 8 }}>Every sentence in:</T>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12 }}>
          {[
            "Wikipedia (6 million articles)",
            "All books ever digitized (millions)",
            "Internet text (trillions of pages)",
            "Scientific papers, code, forums, tweets",
          ].map((item, i) => (
            <T key={i} color="#ffe082" size={15}>→ {item}</T>
          ))}
        </div>
        <T color="#ffe082" style={{ marginTop: 8 }}>= <strong>Billions of examples</strong> (GPT-3: trained on ~300 billion tokens)</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>What does next-token prediction actually teach?</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { task: "Grammar", example: "Given 'I is', predict errors" },
            { task: "Facts", example: "Given 'The capital of France', predict 'Paris'" },
            { task: "Reasoning", example: "Given '2 + 2 =', predict '4'" },
            { task: "World knowledge", example: "Given 'Einstein discovered', predict 'relativity'" },
            { task: "Style & tone", example: "Given 'Dear Sir', predict formal language ahead" },
          ].map(({ task, example }) => (
            <div key={task} style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={15}>{task}:</T>
              <T color={C.dim} size={14}>{example}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={19}>Three training paradigms:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "Supervised", data: "Humans: Q&A pairs, labeled examples", icon: "👤👤👤" },
            { name: "Unsupervised", data: "Raw data, no labels", icon: "📄📄📄" },
            { name: "Self-Supervised", data: "Data labels itself. Predict next word", icon: "📄→📄" },
          ].map(({ name, data, icon }) => (
            <div key={name} style={{ padding: "8px 10px", borderRadius: 6, background: `${C.purple}08`, border: `1px solid ${C.purple}12` }}>
              <T color={C.purple} bold size={15}>{icon} {name}: {data}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={19}>The training loop:</T>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 6 }}>
          {["Pick sentence", "Mask last word", "Predict", "Check", "Update weights"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}25`, padding: "5px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.cyan, fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                <span style={{ color: C.mid, fontSize: 14 }}>{step}</span>
              </div>
              {i < 4 && <span style={{ color: C.dim, fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
        <T color={C.cyan} bold center size={15} style={{ marginTop: 6 }}>↻ Repeat this 10 trillion times</T>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 2.3 Cross-Entropy Loss ═══════
export const Ch6_3 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>First - what does an LLM actually output?</T>
        <T color={C.dim} size={15} style={{ marginTop: 8 }}>Input: "The capital of France is ___"</T>
        <T color={C.dim} size={15} style={{ marginTop: 4 }}>The model does NOT output "Paris". It outputs a <strong style={{ color: "#ff8a80" }}>confidence score for every word it knows</strong>:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { token: "Paris", pct: 85, w: "85%", color: C.green },
            { token: "London", pct: 5, w: "5%", color: C.yellow },
            { token: "Berlin", pct: 3, w: "3%", color: C.orange },
            { token: "pizza", pct: 0.001, w: "0.001%", color: C.red },
          ].map(({ token, pct, w, color }) => (
            <div key={token} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <T color={C.dim} size={14} style={{ width: 55, textAlign: "right" }}>{token}</T>
              <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${Math.max(pct, 1)}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.6 }}></div>
              </div>
              <T color={C.dim} size={13} style={{ width: 45 }}>{w}</T>
            </div>
          ))}
          <T color={C.dim} size={12} style={{ marginTop: 2 }}>...and 49,996 more tokens, all with tiny percentages. All add up to 100%.</T>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>So how do we score this?</T>
        <T color={C.dim} size={15} style={{ marginTop: 8 }}>The correct answer is "Paris". The model gave Paris 85% confidence.</T>
        <T color={C.dim} size={15} style={{ marginTop: 6 }}>Cross-entropy says: <strong style={{ color: "#80deea" }}>just look at the confidence on the correct answer.</strong></T>
        <T color={C.dim} size={15} style={{ marginTop: 6 }}>Ignore all 49,999 wrong tokens. Only one number matters:</T>
        <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 8, textAlign: "center" }}>
          <T color="#80deea" bold size={22}>How confident were you on the RIGHT answer?</T>
        </div>
        <T color={C.dim} size={14} style={{ marginTop: 8 }}>High confidence on correct answer = low loss = good. Low confidence on correct answer = high loss = bad. That's the whole idea.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>The formula (simpler than it looks)</T>
        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8, textAlign: "center" }}>
          <T color="#ffe082" bold size={24}>Loss = −log( confidence on correct answer )</T>
        </div>
        <T color={C.dim} size={15} style={{ marginTop: 10 }}>Why −log? Because it converts confidence into a "penalty score" with two perfect properties:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={14}>100% confident + correct → −log(1.0) = 0 loss</T>
            <T color={C.dim} size={13}>Perfect prediction, zero penalty. Makes sense.</T>
          </div>
          <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.red}08`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} bold size={14}>0% confident on correct → −log(0.0) = infinity loss</T>
            <T color={C.dim} size={13}>You were completely sure it WASN'T the right answer. Infinite penalty.</T>
          </div>
        </div>
        <T color={C.dim} size={14} style={{ marginTop: 6 }}>Everything in between falls on a smooth curve from 0 to infinity. The −log function does all this naturally.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={19}>Let's calculate real examples:</T>
        <T color={C.dim} size={14} center style={{ marginTop: 4 }}>Input: "The capital of France is ___" (correct: Paris)</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={16}>Scenario A: Model gives Paris 90% confidence</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}>Loss = −log(0.90) = <strong style={{ color: C.green }}>0.1</strong></T>
            <T color={C.dim} size={13}>Almost certain and correct. Tiny penalty. The model is doing great.</T>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
            <T color={C.yellow} bold size={16}>Scenario B: Model gives Paris 40% confidence</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}>Loss = −log(0.40) = <strong style={{ color: C.yellow }}>0.9</strong></T>
            <T color={C.dim} size={13}>It thinks Paris is the best guess but isn't sure. Medium penalty - needs improvement.</T>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.red}08`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} bold size={16}>Scenario C: Model gives Paris 1% confidence</T>
            <T color={C.dim} size={14} style={{ marginTop: 2 }}>Loss = −log(0.01) = <strong style={{ color: C.red }}>4.6</strong></T>
            <T color={C.dim} size={13}>The model was almost certain Paris was WRONG. Huge penalty - confidently wrong is the worst.</T>
          </div>
        </div>
        <T color="#ffb74d" size={13} style={{ marginTop: 6 }}>Notice: 90% → 0.1 loss, 40% → 0.9 loss, 1% → 4.6 loss. Being confidently wrong is punished 46× more than being right.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Why not just use (predicted − actual)² like Part 1?</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={15}>Part 1: Predicting a single number</T>
            <T color={C.dim} size={14}>"Predict house price" → model says 300K, actual is 350K</T>
            <T color={C.dim} size={14}>Loss = (300K − 350K)² → one number minus another. Simple.</T>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}>
            <T color={C.cyan} bold size={15}>LLMs: Predicting a word from 50,000 options</T>
            <T color={C.dim} size={14}>"Predict next word" → model outputs 50,000 confidence scores</T>
            <T color={C.dim} size={14}>Can't subtract "Paris" from "London". They're words, not numbers.</T>
            <T color={C.dim} size={14}>So instead: "how confident were you on the right one?" → cross-entropy.</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.blue} style={{ width: "100%" }}>
        <T color="#42a5f5" bold center size={20}>Perplexity - a multiple choice test</T>
        <T color={C.dim} size={15} style={{ marginTop: 8 }}>Think of every prediction as a multiple choice question with 50,000 options. Perplexity = <strong style={{ color: "#42a5f5" }}>how many options the model was torn between.</strong></T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={15}>Q: "What is 2+2?" → You know it's 4</T>
            <T color={C.dim} size={14}>Not confused at all. Only 1 real option. Perplexity ≈ 1</T>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
            <T color={C.yellow} bold size={15}>Q: "Name a fruit" → apple? banana? mango?</T>
            <T color={C.dim} size={14}>Torn between ~5 good answers. Perplexity ≈ 5</T>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.red}08`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} bold size={15}>Q: "Say any random word" → ??? anything ???</T>
            <T color={C.dim} size={14}>All 50,000 words equally likely. Perplexity = 50,000</T>
          </div>
        </div>
        <T color={C.dim} size={14} style={{ marginTop: 8 }}>GPT-4's perplexity ≈ 5. For most predictions, it narrows 50,000 options down to ~5 plausible words. Lower = smarter.</T>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 2.4 Supervised Fine-Tuning (SFT) ═══════
export const Ch6_4 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Imagine you hired someone brilliant...</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>They've read every book ever written. Every Wikipedia article. Every website.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>But they've never had a conversation in their life.</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.bright} size={15} bold>You: "What is 2+2?"</T>
          <T color={C.red} size={15} style={{ marginTop: 6 }}>Them: "2+2 is a common arithmetic expression. In 1847, George Boole proposed that mathematical logic could be..."</T>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>They didn't answer your question. They just... kept writing. Like autocomplete.</T>
        <T color="#b8a9ff" style={{ marginTop: 4 }}>This is exactly what a pretrained LLM does. It has all the knowledge, but doesn't know HOW to have a conversation.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The fix: Show it examples</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Just like you'd train a new employee - show them examples of good work.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Humans write thousands of perfect question-answer pairs:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { q: "What is 2+2?", a: "4", color: C.green },
            { q: "Explain gravity simply", a: "Objects with mass attract each other. The bigger the object, the stronger the pull.", color: C.yellow },
            { q: "Write me a poem about rain", a: "Drops like silver from the sky, painting puddles where they lie...", color: C.pink },
          ].map(({ q, a, color }, i) => (
            <div key={i} style={{ padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.bright} size={14}>Q: {q}</T>
              <T color={color} size={14} style={{ marginTop: 3 }}>A: {a}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>Feed these to the model. It learns: "Oh! When someone asks a question, I should give a direct, helpful answer."</T>
        <T color="#80deea" style={{ marginTop: 4 }}>This is <strong>Supervised Fine-Tuning (SFT)</strong> - supervised because humans wrote the correct answers.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>Before vs After - same model, same knowledge</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.red}10`, border: `1px solid ${C.red}20` }}>
            <T color={C.red} bold size={16}>BEFORE SFT</T>
            <div style={{ marginTop: 6, padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.bright} size={14}>You: "How do I boil an egg?"</T>
              <T color={C.red} size={14} style={{ marginTop: 4 }}>Model: "Boiling eggs is a culinary technique dating back to ancient Rome. The process involves the denaturation of proteins at approximately 100°C. In Julia Child's seminal 1961 work, Mastering the Art of French Cooking, she notes that..."</T>
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>It wrote an essay. You just wanted to cook breakfast.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
            <T color={C.green} bold size={16}>AFTER SFT</T>
            <div style={{ marginTop: 6, padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.bright} size={14}>You: "How do I boil an egg?"</T>
              <T color={C.green} size={14} style={{ marginTop: 4 }}>Model: "Put the egg in a pot of water. Bring to a boil. For soft-boiled: 6 min. For hard-boiled: 12 min. Run under cold water after."</T>
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>Same knowledge inside. Just learned HOW to answer.</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>How much does SFT cost?</T>
        <T color="#ffb74d" style={{ marginTop: 8 }}>Surprisingly little - compared to pretraining:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.red}12`, textAlign: "center" }}>
              <T color={C.red} bold size={14}>Pretraining</T>
              <T color={C.red} size={13}>Trillions of words</T>
              <T color={C.red} size={13}>Months on 1000s of GPUs</T>
              <T color={C.red} size={13}>$10-100 million</T>
            </div>
            <T color={C.dim} size={20}>vs</T>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.green}12`, textAlign: "center" }}>
              <T color={C.green} bold size={14}>SFT</T>
              <T color={C.green} size={13}>10,000-100,000 examples</T>
              <T color={C.green} size={13}>Hours to days</T>
              <T color={C.green} size={13}>$1,000-10,000</T>
            </div>
          </div>
        </div>
        <T color="#ffb74d" style={{ marginTop: 10 }}>Think of it this way: pretraining is like getting a university degree (years, expensive). SFT is like a one-day job orientation - quick, cheap, but makes all the difference.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>The big insight</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>SFT doesn't teach new facts. The model already knows everything from pretraining.</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>SFT teaches BEHAVIOR:</T>
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {["When asked a question → answer it", "Be concise, not rambling", "Be helpful, not vague", "Follow instructions", "Match the right tone"].map((b, i) => (
            <div key={i} style={{ padding: "6px 12px", borderRadius: 20, background: `${C.green}15`, border: `1px solid ${C.green}25` }}>
              <T color={C.green} size={13}>{b}</T>
            </div>
          ))}
        </div>
        <T color="#80e8a5" style={{ marginTop: 10 }}>But there's a problem... SFT makes the model follow instructions, but it doesn't guarantee the answers are GOOD. The model might still be rude, wrong, or harmful. That's where the next chapter comes in.</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 2.5 RLHF - Making AI Helpful & Safe ═══════
export const Ch6_5 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>SFT taught the model to answer. But...</T>
        <T color="#ce93d8" style={{ marginTop: 8 }}>Imagine you trained a new customer service employee with example scripts. They follow the format perfectly. But sometimes they say things like:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { resp: '"Sure, here\'s how to hack someone\'s account..."', issue: "Harmful", color: C.red },
            { resp: '"I don\'t know and I don\'t care."', issue: "Rude", color: C.orange },
            { resp: '"The earth is flat because..."', issue: "Confidently wrong", color: C.yellow },
          ].map(({ resp, issue, color }, i) => (
            <div key={i} style={{ padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6, borderLeft: `3px solid ${color}` }}>
              <T color={color} size={14}>{resp}</T>
              <T color={C.dim} size={12} style={{ marginTop: 2 }}>{issue}</T>
            </div>
          ))}
        </div>
        <T color="#ce93d8" style={{ marginTop: 8 }}>The model follows the Q&A format, but nobody taught it WHAT MAKES a good answer vs a bad answer. That's the RLHF problem.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Step 1: Ask humans "which is better?"</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Give the model a question. It generates two different answers. A human picks the better one.</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color={C.bright} bold size={15}>Question: "How do I learn to code?"</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "8px", borderRadius: 6, background: `${C.green}10`, border: `1px solid ${C.green}25` }}>
              <T color={C.green} bold size={14}>Answer A:</T>
              <T color={C.green} size={14}>"Start with Python - it's beginner-friendly. Try free courses on freeCodeCamp. Build small projects like a calculator, then a to-do app."</T>
            </div>
            <div style={{ padding: "8px", borderRadius: 6, background: `${C.red}10`, border: `1px solid ${C.red}25` }}>
              <T color={C.red} bold size={14}>Answer B:</T>
              <T color={C.red} size={14}>"Coding is very difficult. Most people give up. You probably won't succeed unless you have a math background."</T>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: "8px", borderRadius: 6, background: `${C.cyan}10` }}>
            <T color={C.cyan} bold size={15}>Human picks: A is better</T>
            <T color={C.dim} size={13}>More helpful, encouraging, gives concrete steps</T>
          </div>
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>Do this thousands of times for different questions. Now you have a huge dataset of "humans prefer THIS over THAT."</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>Step 2: Train a "judge" model</T>
        <T color="#ffe082" style={{ marginTop: 8 }}>You can't have humans rate every single response forever - too slow, too expensive.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>So you train a separate AI to be the judge. This is the <strong>Reward Model</strong>.</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color="#ffe082" size={14}>Feed it all the human preferences from Step 1. It learns patterns like:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { text: "Helpful + specific + encouraging", score: "8.5 / 10", color: C.green },
              { text: "Correct but rude", score: "4.0 / 10", color: C.orange },
              { text: "Harmful or misleading", score: "1.2 / 10", color: C.red },
            ].map(({ text, score, color }, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${color}10` }}>
                <T color={color} size={14}>{text}</T>
                <T color={color} bold size={14}>{score}</T>
              </div>
            ))}
          </div>
        </div>
        <T color="#ffe082" style={{ marginTop: 8 }}>Now this judge can score ANY response instantly - no human needed. It learned what humans value.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Step 3: Improve the model using the judge</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>Now the loop:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { step: "1", text: "Model generates an answer", color: C.cyan },
            { step: "2", text: "Judge scores it (e.g., 6.3 / 10)", color: C.yellow },
            { step: "3", text: "Model adjusts to get higher scores next time", color: C.green },
            { step: "4", text: "Repeat millions of times", color: C.purple },
          ].map(({ step, text, color }) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, background: `${color}08` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <T color={color} bold size={14}>{step}</T>
              </div>
              <T color={color} size={14}>{text}</T>
            </div>
          ))}
        </div>
        <T color="#b8a9ff" style={{ marginTop: 10 }}>This is called <strong>RLHF</strong> - Reinforcement Learning from Human Feedback. The model learns to write answers that humans would prefer.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>But there's a danger...</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>What if the model finds a "cheat code" to get high scores?</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color={C.red} bold size={15}>Example of reward hacking:</T>
          <T color={C.red} size={14} style={{ marginTop: 4 }}>The model discovers: "If I start every answer with 'Great question!' and add lots of exclamation marks, the judge gives higher scores!"</T>
          <T color={C.red} size={14} style={{ marginTop: 4 }}>Result: "Great question! Absolutely! The answer is definitely yes! I'm so happy to help!!!"</T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>High score from judge... but useless answer.</T>
        </div>
        <T color="#80e8a5" style={{ marginTop: 10 }}>The fix: a <strong>leash</strong>. Tell the model: "Improve your answers, but don't change TOO much from who you were after SFT."</T>
        <T color="#80e8a5" style={{ marginTop: 4 }}>This leash is called the <strong>KL penalty</strong> - it measures how far the model has drifted from its original self. Too far = pull it back.</T>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.red}10`, textAlign: "center" }}>
            <T color={C.red} bold size={14}>No leash</T>
            <T color={C.red} size={13}>Model goes wild</T>
            <T color={C.red} size={13}>Hacks the reward</T>
            <T color={C.red} size={13}>Becomes useless</T>
          </div>
          <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
            <T color={C.green} bold size={14}>With leash</T>
            <T color={C.green} size={13}>Gradual improvement</T>
            <T color={C.green} size={13}>Stays sensible</T>
            <T color={C.green} size={13}>Gets genuinely better</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>The full journey - how ChatGPT/Claude are made</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.red}10`, border: `1px solid ${C.red}20` }}>
            <T color={C.red} bold size={16}>Stage 1: Pretraining</T>
            <T color={C.dim} size={14}>Read trillions of words. Learn language, facts, patterns.</T>
            <T color={C.dim} size={13}>Like getting a university education.</T>
          </div>
          <T color={C.dim} size={18} center>↓</T>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.yellow}10`, border: `1px solid ${C.yellow}20` }}>
            <T color={C.yellow} bold size={16}>Stage 2: SFT</T>
            <T color={C.dim} size={14}>Learn to answer questions properly using human examples.</T>
            <T color={C.dim} size={13}>Like a one-day job orientation.</T>
          </div>
          <T color={C.dim} size={18} center>↓</T>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
            <T color={C.green} bold size={16}>Stage 3: RLHF</T>
            <T color={C.dim} size={14}>Learn what makes answers GOOD - helpful, safe, honest.</T>
            <T color={C.dim} size={13}>Like ongoing feedback from a manager.</T>
          </div>
          <T color={C.dim} size={18} center>↓</T>
          <div style={{ padding: "12px 14px", borderRadius: 8, background: `${C.purple}12`, border: `2px solid ${C.purple}30` }}>
            <T color={C.purple} bold size={18} center>ChatGPT / Claude / Gemini</T>
            <T color={C.dim} size={13} center>Ready to chat with you</T>
          </div>
        </div>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 2.6 Batch Training ═══════
export const Ch6_6 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>How does the model actually learn?</T>
        <T color="#ffb74d" style={{ marginTop: 8 }}>Let's say you're training the model. The simplest approach:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { step: "Show it ONE example", detail: '"What is 2+2?" → "4"' },
            { step: "Check how wrong it was", detail: "Compute the loss (chapter 2.3)" },
            { step: "Nudge the weights", detail: "Adjust slightly to do better" },
            { step: "Next example", detail: "Repeat with a new question" },
          ].map(({ step, detail }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(0,0,0,0.15)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${C.orange}20`, border: `1px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <T color={C.orange} bold size={12}>{i + 1}</T>
              </div>
              <div>
                <T color={C.orange} bold size={14}>{step}</T>
                <T color={C.dim} size={12}>{detail}</T>
              </div>
            </div>
          ))}
        </div>
        <T color="#ffb74d" style={{ marginTop: 8 }}>Sounds reasonable, right? But there's a big problem...</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>The problem: one example = bad advice</T>
        <T color="#ff8a80" style={{ marginTop: 8 }}>Imagine you're lost in a new city. You ask ONE stranger for directions.</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.bright} size={14}>Person 1: "Go LEFT" → you go left</T>
            <T color={C.red} size={14} style={{ marginTop: 4 }}>Person 2 (a tourist, also lost): "Go RIGHT" → you go right</T>
            <T color={C.bright} size={14} style={{ marginTop: 4 }}>Person 3: "Go LEFT" → you go left again</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}10` }}>
            <T color={C.red} bold size={14}>Result: you zigzag back and forth. Barely make progress.</T>
          </div>
        </div>
        <T color="#ff8a80" style={{ marginTop: 8 }}>Same thing happens to the model. One weird training example makes the weights jump in the wrong direction. Then the next example pulls them back. Zigzag, zigzag, zigzag.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>The fix: ask 32 people at once</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>Instead of asking 1 stranger, ask 32 people: "Which way to the train station?"</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color={C.green} size={14}>28 people say: "Go LEFT"</T>
          <T color={C.red} size={14}>3 people say: "Go RIGHT"</T>
          <T color={C.orange} size={14}>1 person says: "Go STRAIGHT"</T>
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: `${C.green}15` }}>
            <T color={C.green} bold size={15}>Consensus: LEFT. You walk left confidently.</T>
          </div>
        </div>
        <T color="#80e8a5" style={{ marginTop: 8 }}>This is <strong>batch training</strong>. Instead of updating weights after 1 example, you:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          <T color="#80e8a5" size={14}>• Show the model 32 examples at once</T>
          <T color="#80e8a5" size={14}>• Compute 32 separate "which direction to adjust"</T>
          <T color="#80e8a5" size={14}>• Average them all together</T>
          <T color="#80e8a5" size={14}>• Make ONE smooth update</T>
        </div>
        <T color="#80e8a5" style={{ marginTop: 6 }}>The 32 is called the <strong>batch size</strong>.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Bigger batch = smoother, but slower</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>What batch size should you pick? It's a tradeoff:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${C.red}10`, border: `1px solid ${C.red}20`, textAlign: "center" }}>
              <T color={C.red} bold size={18}>1</T>
              <T color={C.red} size={12}>example</T>
              <T color={C.dim} size={12} style={{ marginTop: 4 }}>Very fast updates</T>
              <T color={C.dim} size={12}>Very noisy/zigzaggy</T>
              <T color={C.dim} size={12}>Tiny memory needed</T>
            </div>
            <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${C.yellow}10`, border: `1px solid ${C.yellow}20`, textAlign: "center" }}>
              <T color={C.yellow} bold size={18}>32</T>
              <T color={C.yellow} size={12}>examples</T>
              <T color={C.dim} size={12} style={{ marginTop: 4 }}>Fast updates</T>
              <T color={C.dim} size={12}>Smooth path</T>
              <T color={C.dim} size={12}>Moderate memory</T>
            </div>
            <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: `${C.green}10`, border: `1px solid ${C.green}20`, textAlign: "center" }}>
              <T color={C.green} bold size={18}>512</T>
              <T color={C.green} size={12}>examples</T>
              <T color={C.dim} size={12} style={{ marginTop: 4 }}>Slow updates</T>
              <T color={C.dim} size={12}>Very smooth path</T>
              <T color={C.dim} size={12}>Lots of memory</T>
            </div>
          </div>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 10 }}>Think of it like a survey. Asking 1 person is fast but unreliable. Asking 1,000 people is very reliable but takes forever to collect. The sweet spot is usually somewhere in between (32-256 for most models).</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Why this matters for GPT/Claude</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Training GPT-4 means processing trillions of tokens. Even with batch size 32, that's billions of updates. This is why:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { fact: "Training takes months", why: "Even with thousands of GPUs running in parallel" },
            { fact: "It costs $10-100 million", why: "Electricity + hardware rental for all those batches" },
            { fact: "Batch size is carefully tuned", why: "Too small = noisy. Too big = diminishing returns + memory limits" },
          ].map(({ fact, why }, i) => (
            <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}>
              <T color={C.cyan} bold size={14}>{fact}</T>
              <T color={C.dim} size={13}>{why}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>The key insight: after a certain batch size (often 32-64), making batches bigger barely helps - you get slightly smoother updates but training takes much longer per step. Finding the sweet spot is an art.</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 3.1 Scaling Laws ═══════
