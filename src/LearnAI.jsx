import { useState, useEffect } from "react";

const chapters = [
  { id: "0", title: "Table of Contents", part: 0 },
  // Part 1: Neural Network Foundations
  { id: "1.1", title: "What is a Neural Network?", part: 1 },
  { id: "1.2", title: "Feed-Forward Neural Network", part: 1 },
  { id: "1.3", title: "Learning — What Does it Mean?", part: 1 },
  { id: "1.4", title: "Weights & Biases — The Knobs", part: 1 },
  { id: "1.5", title: "Activation (ReLU) — Why Layers Need a Bend", part: 1 },
  { id: "1.6", title: "Forward Pass — Making a Prediction", part: 1 },
  { id: "1.7", title: "Loss — How Wrong Were We?", part: 1 },
  { id: "1.8", title: "Derivatives — The Core Intuition", part: 1 },
  { id: "1.9", title: "Backward Pass — The Chain Rule", part: 1 },
  { id: "1.10", title: "Gradient Descent — Fixing the Weights", part: 1 },
  // Part 2: The Road to Transformers
  { id: "2.1", title: "CNN", part: 2 },
  { id: "2.2", title: "RNN", part: 2 },
  { id: "2.3", title: "RNN's Fatal Flaws", part: 2 },
  { id: "2.4", title: "The Transformer Arrives", part: 2 },
  // Part 3: Transformer Input Pipeline
  { id: "3.1", title: "The Full Architecture", part: 3 },
  { id: "3.2", title: "Zoom: Embeddings", part: 3 },
  { id: "3.3", title: "Positional Encoding — The Problem", part: 3 },
  { id: "3.4", title: "Positional Encoding — The Formula", part: 3 },
  { id: "3.5", title: "Positional Encoding — Computing Positions", part: 3 },
  { id: "3.6", title: "Positional Encoding — Fast vs Slow", part: 3 },
  { id: "3.7", title: "Positional Encoding — Final Addition", part: 3 },
  { id: "3.8", title: "What is a Transformer Actually Doing?", part: 3 },
  // Part 4: Attention — Understanding Q, K, V
  { id: "4.1", title: "The Problem — Context is Everything", part: 4 },
  { id: "4.2", title: "How Does a Word Look At Others?", part: 4 },
  { id: "4.3", title: "The Dot Product — Measuring Similarity", part: 4 },
  { id: "4.4", title: "Why Not Dot Product Embeddings Directly?", part: 4 },
  { id: "4.5", title: "Q, K, V — The Classroom Analogy", part: 4 },
  { id: "4.6", title: "Every Word is BOTH Asker and Answerer", part: 4 },
  { id: "4.7", title: "Why Can\'t Key and Value Be the Same?", part: 4 },
  { id: "4.8", title: "The Google Search Analogy", part: 4 },
  { id: "4.9", title: "How Are Q, K, V Created?", part: 4 },
  { id: "4.10", title: "W Matrices — Learned During Training", part: 4 },
  { id: "4.11", title: "Tracing a Complete Example", part: 4 },
  // Part 5: Attention — The Full Computation
  { id: "5.1", title: "Step 1 — Compute Q, K, V for Every Word", part: 5 },
  { id: "5.2", title: "Step 2 — Attention Scores (Dot Products)", part: 5 },
  { id: "5.3", title: "Why Do We Need Softmax?", part: 5 },
  { id: "5.4", title: "Step 3 — Scale by √d_k", part: 5 },
  { id: "5.5", title: "Step 4 — Softmax → Probabilities", part: 5 },
  { id: "5.6", title: "Step 5 — Weighted Sum of Values", part: 5 },
  { id: "5.7", title: "The Full Formula", part: 5 },
  { id: "5.8", title: "Why Multi-Head? — The Compromise Problem", part: 5 },
  { id: "5.9", title: "The Split — How 8 Heads Work", part: 5 },
  { id: "5.10", title: "Inside Each Head — Full Attention in 64 Dims", part: 5 },
  { id: "5.11", title: "Concat + W_O — Blending All Heads", part: 5 },
  { id: "5.12", title: "Why 8 Heads? Parameter Count & Big Picture", part: 5 },
  { id: "5.13", title: "Is W_O Constant? Does It Change?", part: 5 },
  { id: "5.14", title: "The Complete Picture — In Plain English", part: 5 },
];

const partNames = { 0: "Overview", 1: "Neural Network Foundations", 2: "The Road to Transformers", 3: "Transformer Input Pipeline", 4: "Attention — Understanding Q, K, V", 5: "Attention — The Full Computation" };

// Colors
const C = {
  bg: "#08080d", card: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.07)",
  dim: "rgba(255,255,255,0.35)", mid: "rgba(255,255,255,0.55)", bright: "rgba(255,255,255,0.85)",
  red: "#ff6b6b", purple: "#a78bfa", green: "#00e676", cyan: "#00b8d4",
  yellow: "#ffd740", pink: "#e040fb", orange: "#ffab40", blue: "#42a5f5",
};

// Reusable components
const Box = ({ children, color = C.cyan, style = {} }) => (
  <div style={{ background: `${color}09`, border: `1px solid ${color}22`, borderRadius: 10, padding: "16px 22px", width: "100%", ...style }}>{children}</div>
);
const T = ({ children, color = C.mid, size = 19, bold = false, center = false, style = {} }) => (
  <div style={{ color, fontSize: size, fontWeight: bold ? 700 : 400, textAlign: center ? "center" : "left", lineHeight: 1.75, ...style }}>{children}</div>
);
const SubBtn = ({ onClick }) => (
  <button data-subbtn="true" onClick={onClick} style={{
    alignSelf: "center", padding: "8px 20px", borderRadius: 8, border: "none",
    background: "rgba(167,139,250,0.15)", color: C.purple,
    cursor: "pointer", fontSize: 18, fontWeight: 600, marginTop: 4,
  }}>Continue ↓</button>
);

const Tag = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 5, background: `${color}15`, border: `1px solid ${color}30`, color, fontSize: 16, fontWeight: 600, margin: "1px" }}>{children}</span>
);

export default function LearnAI() {
  const [ch, setCh] = useState(0);
  const [fade, setFade] = useState(true);
  const [sub, setSub] = useState(0);
  const [subFade, setSubFade] = useState(true);
  const [maxSubs, setMaxSubs] = useState({});

  const animateSub = (newSubFn) => {
    setSubFade(false);
    setTimeout(() => { newSubFn(); setSubFade(true); }, 250);
  };

  useEffect(() => {
    if (sub > 0) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 50);
    }
  }, [sub]);

  // Track the actual max sub for each chapter
  useEffect(() => {
    const hasSubBtn = document.querySelector("[data-subbtn]");
    if (!hasSubBtn && sub > 0) {
      setMaxSubs(prev => ({ ...prev, [ch]: sub }));
    }
  }, [sub, ch]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        const hasSubBtn = document.querySelector("[data-subbtn]");
        if (hasSubBtn) {
          animateSub(() => setSub(s => s + 1));
        } else if (ch < chapters.length - 1) {
          goTo(ch + 1);
        }
      }
      if (e.key === "ArrowLeft") {
        if (sub > 0) {
          animateSub(() => setSub(s => s - 1));
        } else if (ch > 0) {
          const prevMax = maxSubs[ch - 1];
          goTo(ch - 1, prevMax != null ? prevMax : 0);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const goTo = (n, startSub = 0) => {
    if (n < 0 || n >= chapters.length) return;
    setFade(false);
    setTimeout(() => { setCh(n); setSub(startSub); setFade(true); window.scrollTo({ top: 0, behavior: "smooth" }); }, 350);
  };

  // ═══════ 1.1 What is a NN ═══════
  const Ch1_1 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.red}><T color={C.red} bold center>Think of it like a factory assembly line:</T><T>Raw material (input) → processing stations (layers) → finished product (output).</T></Box>}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 14, padding: "18px 12px", border: `1px solid ${C.border}`, width: "100%", display: "flex", justifyContent: "center" }}>
          <svg width="380" height="200" viewBox="0 0 380 200" style={{ maxWidth: "100%", overflow: "visible" }}>

            {/* Positions — input: x=55, hidden: x=190, output: x=325 */}
            {/* input y: [40, 90, 140], hidden y: [40, 90, 140], output y: [65, 115] */}

            {/* ── Connection lines: input → hidden ── */}
            {[40, 90, 140].map((iy) =>
              [40, 90, 140].map((hy) => (
                <line key={`i${iy}-h${hy}`} x1="70" y1={iy} x2="176" y2={hy}
                  stroke={`${C.yellow}0c`} strokeWidth="1" />
              ))
            )}
            {/* ── Connection lines: hidden → output ── */}
            {[40, 90, 140].map((hy) =>
              [65, 115].map((oy) => (
                <line key={`h${hy}-o${oy}`} x1="204" y1={hy} x2="311" y2={oy}
                  stroke={`${C.green}0c`} strokeWidth="1" />
              ))
            )}

            {/* ── Input neurons (3) ── */}
            {[40, 90, 140].map((y, i) => (
              <g key={`in${i}`}>
                <circle cx="55" cy={y} r="14" fill={`${C.red}15`} stroke={C.red} strokeWidth="1.5" />
                <text x="55" y={y + 1} fill={C.red} fontSize="11" textAnchor="middle" dominantBaseline="middle" fontWeight="700">x{i + 1}</text>
              </g>
            ))}

            {/* ── Hidden neurons (3) ── */}
            {[40, 90, 140].map((y, i) => (
              <g key={`hid${i}`}>
                <circle cx="190" cy={y} r="14" fill={`${C.yellow}0a`} stroke={`${C.yellow}90`} strokeWidth="1.5" />
                <text x="190" y={y + 1} fill={C.yellow} fontSize="8" textAnchor="middle" dominantBaseline="middle" fontWeight="600">fn()</text>
              </g>
            ))}

            {/* ── Output neurons (2) ── */}
            {[65, 115].map((y, i) => (
              <g key={`out${i}`}>
                <circle cx="325" cy={y} r="14" fill={`${C.green}12`} stroke={C.green} strokeWidth="1.5" />
                <text x="325" y={y + 1} fill={C.green} fontSize="11" textAnchor="middle" dominantBaseline="middle" fontWeight="700">y{i + 1}</text>
              </g>
            ))}

            {/* ── Flow arrows ── */}
            <text x="125" y="95" fill="rgba(255,255,255,0.12)" fontSize="18" textAnchor="middle">→</text>
            <text x="260" y="95" fill="rgba(255,255,255,0.12)" fontSize="18" textAnchor="middle">→</text>

            {/* ── Column labels at bottom ── */}
            <text x="55" y="185" fill={C.red} fontSize="10" textAnchor="middle" fontWeight="600">Input</text>
            <text x="190" y="185" fill={C.yellow} fontSize="10" textAnchor="middle" fontWeight="600">Hidden Layer</text>
            <text x="325" y="185" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="600">Output</text>
          </svg>
        </div>
      )}
      {sub >= 2 && <Box color={C.yellow}><T color={C.yellow} bold center>Each connection has a "weight" (a number).</T><T>Training = finding the right weights so predictions become accurate. That's ALL learning is.</T></Box>}
      {sub >= 3 && <Box color={C.purple}><T color={C.purple} bold center>At each neuron:</T><T><code style={{ background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3, fontSize: 18 }}>output = activation( Σ(input × weight) + bias )</code><br /><br /><span style={{ display: "block", paddingLeft: 8, marginTop: 4 }}>1. Multiply each input by its weight<br />2. Sum them all up<br />3. Add a bias (a shift)<br />4. Pass through activation function (e.g. ReLU: if negative → 0, if positive → keep)</span></T></Box>}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.2 FFNN ═══════
  const Ch1_2 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.yellow}><T color={C.yellow} bold center>The simplest neural network — data flows in ONE direction.</T><T>Input → Hidden layers → Output. No loops, no memory.</T></Box>}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <T color={C.dim} size={16} center style={{ marginBottom: 10 }}>EXAMPLE: Is this email spam?</T>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ l: "word count", v: "152" }, { l: "has 'free'?", v: "1" }, { l: "# links", v: "12" }].map(({ l, v }, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 6, padding: "5px 10px", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", height: 36 }}><T color={C.red} size={18} bold center>{v}</T></div>
                <T color={C.dim} size={12} center>{l}</T>
              </div>
            ))}
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 36 }}><span style={{ fontSize: 29, color: C.dim, lineHeight: 1 }}>→</span></div>
              <T color={C.dim} size={12} center>&nbsp;</T>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ background: `${C.yellow}12`, border: `1px solid ${C.yellow}25`, borderRadius: 6, padding: "5px 16px", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", height: 36 }}><T color={C.yellow} size={18} bold center>Math</T></div>
              <T color={C.dim} size={12} center>&nbsp;</T>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 36 }}><span style={{ fontSize: 29, color: C.dim, lineHeight: 1 }}>→</span></div>
              <T color={C.dim} size={12} center>&nbsp;</T>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}30`, borderRadius: 6, padding: "5px 16px", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", height: 36 }}><T color={C.green} size={20} bold center>92% Spam</T></div>
              <T color={C.dim} size={12} center>&nbsp;</T>
            </div>
          </div>
        </div>
      )}
      {sub >= 2 && <><Box color={C.green}><T color="#80cbc4" bold center>✅ Good for:</T><T color="#80cbc4">Simple classification — spam/not spam, cat/dog, approve/reject.</T></Box><Box color={C.red}><T color="#ff8a80" bold center>❌ Fatal limitations:</T><T color="#ff8a80"><strong>Fixed input size</strong> — sentences have variable length. Can't handle that.<br /><strong>No order</strong> — "dog bites man" = "man bites dog" to this network.</T></Box></>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.3 What is Learning ═══════
  const Ch1_3 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.purple}><T color={C.purple} bold center size={20}>A neural network starts DUMB.</T><T>When you first create a network, all its internal numbers (called <strong>weights</strong> and <strong>biases</strong>) are set to <strong>random values</strong>. It knows nothing. It makes garbage predictions.</T></Box>}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>"Learning" = adjusting weights & biases until predictions get good.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>This happens in a loop that repeats <strong>thousands to millions</strong> of times:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: "1", label: "Forward Pass", desc: "Feed input through the network → get a prediction", color: C.cyan },
              { n: "2", label: "Calculate Loss", desc: "Compare prediction with the correct answer → how wrong were we?", color: C.red },
              { n: "3", label: "Backward Pass", desc: "Trace back through the network → which weights caused the error?", color: C.pink },
              { n: "4", label: "Update Weights", desc: "Nudge each weight & bias a tiny bit to reduce the error", color: C.green },
            ].map(({ n, label, desc, color }) => (
              <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}12` }}>
                <span style={{ background: `${color}20`, color, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, flexShrink: 0 }}>{n}</span>
                <div style={{ flex: 1 }}><T color={color} bold center size={19}>{label}</T><T color={C.dim} size={16} center>{desc}</T></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <div style={{ padding: "6px 16px", borderRadius: 20, background: `${C.yellow}10`, border: `1px solid ${C.yellow}20` }}>
              <T color={C.yellow} size={16} bold center>↻ Repeat until loss is small enough</T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 2 && <Box color={C.green}><T color="#80e8a5" bold center>This whole process is called "Backpropagation + Gradient Descent".</T><T color="#80e8a5">But what are weights and biases? Let's understand them first →</T></Box>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.4 Weights & Biases ═══════
  const Ch1_4 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>Weight = how important is this input?</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Think of a doctor diagnosing flu. They look at symptoms:<br />
            • Fever → <strong>very important</strong> (high weight)<br />
            • Headache → <strong>somewhat important</strong> (medium weight)<br />
            • Shoe color → <strong>irrelevant</strong> (weight ≈ 0)
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>A weight is a number that says <strong>"how much should I care about this input?"</strong> The network learns the right weights during training.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Bias = a baseline shift</T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Imagine you're predicting house price from square footage.<br /><br />
            Without bias: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 3 }}>price = sqft × weight</code><br />
            This forces price = 0 when sqft = 0. But even a tiny house has land value!<br /><br />
            With bias: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 3 }}>price = sqft × weight + bias</code><br />
            The bias adds a <strong>base amount</strong> (like land value) regardless of input.
          </T>
        </Box>
      )}
      {sub >= 2 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <T color={C.dim} size={14} center style={{ marginBottom: 10, width: "100%" }}>INSIDE A SINGLE NEURON</T>
          <svg width="420" height="170" viewBox="0 0 420 170" style={{ maxWidth: "100%", overflow: "visible" }}>
            {/* Inputs */}
            {[{ y: 35, label: "x₁ = 1500", sublabel: "(sqft)" }, { y: 95, label: "x₂ = 3", sublabel: "(bedrooms)" }].map(({ y, label, sublabel }, i) => (
              <g key={i}>
                <circle cx="50" cy={y} r="24" fill={`${C.cyan}15`} stroke={C.cyan} strokeWidth="1.2" />
                <text x="50" y={y - 4} fill={C.cyan} fontSize="8" textAnchor="middle" fontWeight="700">{label}</text>
                <text x="50" y={y + 8} fill={C.dim} fontSize="7" textAnchor="middle">{sublabel}</text>
                <line x1={y < 60 ? 73 : 74} y1={y < 60 ? 41 : 92} x2={y < 60 ? 165 : 164} y2={y < 60 ? 66 : 80} stroke={C.yellow} strokeWidth="1.5" />
                <text x={119} y={y < 60 ? 43 : 98} fill={C.yellow} fontSize="9" textAnchor="middle">×w{i + 1}={i === 0 ? "0.5" : "50"}</text>
              </g>
            ))}
            {/* Neuron */}
            <circle cx="200" cy="75" r="36" fill={`${C.purple}12`} stroke={C.purple} strokeWidth="1.5" />
            <text x="200" y="65" fill={C.purple} fontSize="8" textAnchor="middle">Σ + bias</text>
            <text x="200" y="78" fill={C.purple} fontSize="9" textAnchor="middle" fontWeight="700">then</text>
            <text x="200" y="91" fill={C.purple} fontSize="8" textAnchor="middle">activate</text>
            {/* Bias arrow */}
            <line x1="200" y1="126" x2="200" y2="111" stroke={C.orange} strokeWidth="1.5" />
            <text x="200" y="140" fill={C.orange} fontSize="9" textAnchor="middle" fontWeight="700">bias = 50</text>
            <text x="200" y="153" fill={C.dim} fontSize="8" textAnchor="middle">(base land value)</text>
            {/* Output */}
            <line x1="236" y1="75" x2="301" y2="75" stroke={C.green} strokeWidth="1.5" />
            <circle cx="325" cy="75" r="24" fill={`${C.green}12`} stroke={C.green} strokeWidth="1.2" />
            <text x="325" y="72" fill={C.green} fontSize="8" textAnchor="middle">output</text>
            <text x="325" y="84" fill={C.green} fontSize="9" textAnchor="middle" fontWeight="700">950</text>
          </svg>
        </div>
      )}
      {sub >= 3 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>The math at this neuron, step by step:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>① <strong style={{ color: C.yellow }}>Multiply</strong> each input by its weight:</T>
            <T color={C.yellow} size={18} style={{ paddingLeft: 18 }}>1500 × 0.5 = 750 &nbsp;&nbsp;|&nbsp;&nbsp; 3 × 50 = 150</T>
            <T color={C.dim} size={18} style={{ marginTop: 4 }}>② <strong style={{ color: C.purple }}>Sum</strong> them up:</T>
            <T color={C.purple} size={18} style={{ paddingLeft: 18 }}>750 + 150 = 900</T>
            <T color={C.dim} size={18} style={{ marginTop: 4 }}>③ <strong style={{ color: C.orange }}>Add bias</strong>:</T>
            <T color={C.orange} size={18} style={{ paddingLeft: 18 }}>900 + 50 = 950</T>
            <T color={C.dim} size={18} style={{ marginTop: 4 }}>④ <strong style={{ color: C.green }}>Activation</strong> (ReLU: if negative→0, if positive→keep):</T>
            <T color={C.green} size={18} style={{ paddingLeft: 18 }}>ReLU(950) = <strong>950</strong> → this is the output ($950k)</T>
          </div>
        </Box>
      )}
      {sub >= 4 && <Box color={C.green}><T color="#80e8a5" bold center>So a neuron is just: multiply, sum, add bias, activate.</T><T color="#80e8a5" center size={18}>The <strong>weights</strong> and <strong>bias</strong> are what the network LEARNS. Everything else is fixed math. Now let's see the forward pass →</T></Box>}
      {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.5 ReLU — Activation Functions ═══════
  const Ch1_ReLU = () => {
    // Graph helper: plots points as SVG polyline
    const Graph = ({ points, color, width = 280, height = 120, xLabel = "", yLabel = "", title = "", annotations = [] }) => {
      const pad = { l: 32, r: 12, t: 20, b: 28 };
      const w = width - pad.l - pad.r;
      const h = height - pad.t - pad.b;
      const xs = points.map(p => p[0]);
      const ys = points.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const scaleX = (x) => pad.l + ((x - minX) / (maxX - minX || 1)) * w;
      const scaleY = (y) => pad.t + h - ((y - minY) / (maxY - minY || 1)) * h;
      const polyline = points.map(p => `${scaleX(p[0])},${scaleY(p[1])}`).join(" ");
      return (
        <svg width={width} height={height} style={{ overflow: "visible" }}>
          {/* Axes */}
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={pad.l} y1={pad.t + h} x2={pad.l + w} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* Zero line if visible */}
          {minY < 0 && maxY > 0 && <line x1={pad.l} y1={scaleY(0)} x2={pad.l + w} y2={scaleY(0)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />}
          {/* Data line */}
          <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          {/* Data dots */}
          {points.map((p, i) => <circle key={i} cx={scaleX(p[0])} cy={scaleY(p[1])} r="3" fill={color} />)}
          {/* Labels */}
          {xLabel && <text x={pad.l + w / 2} y={height - 2} fill={C.dim} fontSize="9" textAnchor="middle">{xLabel}</text>}
          {yLabel && <text x={4} y={pad.t + h / 2} fill={C.dim} fontSize="9" textAnchor="middle" transform={`rotate(-90, 4, ${pad.t + h / 2})`}>{yLabel}</text>}
          {title && <text x={pad.l + w / 2} y={12} fill={color} fontSize="10" textAnchor="middle" fontWeight="700">{title}</text>}
          {/* X tick labels */}
          {points.filter((_, i) => i % (points.length > 10 ? 2 : 1) === 0).map((p, i) => (
            <text key={`x${i}`} x={scaleX(p[0])} y={pad.t + h + 14} fill={C.dim} fontSize="8" textAnchor="middle">{p[0]}</text>
          ))}
          {/* Annotations */}
          {annotations.map(({ x, y, text: t, color: ac }, i) => (
            <g key={`a${i}`}>
              <circle cx={scaleX(x)} cy={scaleY(y)} r="5" fill="none" stroke={ac || C.yellow} strokeWidth="1.5" />
              <text x={scaleX(x) + 8} y={scaleY(y) - 6} fill={ac || C.yellow} fontSize="8" fontWeight="600">{t}</text>
            </g>
          ))}
        </svg>
      );
    };

    // Data
    const straightLine = Array.from({ length: 8 }, (_, i) => [i, i * 6 + 7]);
    const neuron1 = [[0,0],[1,0],[2,0],[3,0],[4,1],[5,2],[6,3],[7,4]];
    const neuron2 = [[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[6,0],[7,0]];
    const combined = neuron1.map((p, i) => [p[0], p[1] + neuron2[i][1]]);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Step 0: The problem */}
        {sub >= 0 && (
          <Box color={C.red} style={{ width: "100%" }}>
            <T color="#ff8a80" bold center size={20}>Without activation, layers are useless.</T>
            <T color="#ff8a80" style={{ marginTop: 6 }}>Each neuron does <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>output = input × weight + bias</code>. That's a straight line: y = mx + b.</T>
            <T color="#ff8a80" style={{ marginTop: 6 }}>Stack two layers WITHOUT activation:</T>
            <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <T color={C.dim} size={18}>Layer 1: output₁ = input × 3 + 1</T>
              <T color={C.dim} size={18}>Layer 2: output₂ = output₁ × 2 + 5</T>
              <T color={C.dim} size={18} style={{ marginTop: 6 }}>Substitute:</T>
              <T color={C.red} size={18}>output₂ = (input × 3 + 1) × 2 + 5 = input × <strong>6</strong> + <strong>7</strong></T>
              <T color="#ff8a80" size={18} bold center style={{ marginTop: 4 }}>Collapsed back into y = 6x + 7. Still a straight line!</T>
            </div>
          </Box>
        )}

        {sub >= 1 && (
          <div style={{ background: C.card, borderRadius: 10, padding: "10px", border: `1px solid ${C.border}`, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Graph points={straightLine} color={C.red} title="100 layers without activation = still one straight line" xLabel="input" yLabel="output" />
            </div>
            <T color="#ff8a80" size={16} center style={{ marginTop: 4 }}>No matter how many layers you stack, it always simplifies to y = mx + b. A straight line cannot learn curves. <strong>100 layers = 1 layer.</strong></T>
          </div>
        )}

        {/* Step 2: ReLU rule */}
        {sub >= 2 && (
          <Box color={C.green} style={{ width: "100%" }}>
            <T color="#80e8a5" bold center size={20}>ReLU: the simplest possible fix.</T>
            <T color="#80e8a5" style={{ marginTop: 6 }}>After each neuron's math, apply ONE rule:</T>
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "14px 24px", border: `1px solid ${C.green}30` }}>
                <T color={C.green} bold size={22} center>If negative → 0 &nbsp;&nbsp;|&nbsp;&nbsp; If positive → keep</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[[-5,0],[-100,0],[0,0],[3,3],[950,950]].map(([inp, out], i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 6, background: out === 0 ? `${C.red}10` : `${C.green}10`, border: `1px solid ${out === 0 ? `${C.red}20` : `${C.green}20`}` }}>
                  <T color={out === 0 ? C.red : C.green} size={16} center>ReLU({inp}) = <strong>{out}</strong></T>
                </div>
              ))}
            </div>
            <T color="#80e8a5" size={16} center style={{ marginTop: 6 }}>That's the entire thing. No complex math.</T>
          </Box>
        )}

        {/* Step 3: One neuron with ReLU — bent line */}
        {sub >= 3 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color="#80deea" bold center>Neuron 1: output = ReLU(input × 1 − 3)</T>
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
              <Graph points={neuron1} color={C.cyan} title="Neuron 1: flat, then rises (bend at input=3)" xLabel="input" yLabel="output"
                annotations={[{ x: 3, y: 0, text: "bend!", color: C.yellow }]} />
            </div>
            <T color="#80deea" size={16}>Flat at 0 from input 0→3 (ReLU kills the negatives), then rises. That's a <strong>bent line</strong> — NOT straight anymore! The bend happens where the neuron's math crosses zero.</T>
          </Box>
        )}

        {/* Step 4: Second neuron — different bend */}
        {sub >= 4 && (
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color="#b8a9ff" bold center>Neuron 2: output = ReLU(input × (−1) + 5)</T>
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
              <Graph points={neuron2} color={C.purple} title="Neuron 2: slopes down, then flat (bend at input=5)" xLabel="input" yLabel="output"
                annotations={[{ x: 5, y: 0, text: "bend!", color: C.yellow }]} />
            </div>
            <T color="#b8a9ff" size={16}>Different weight and bias = different bend point. This one slopes downward and goes flat. Each neuron's weight & bias control <strong>where</strong> and <strong>how</strong> it bends.</T>
          </Box>
        )}

        {/* Step 5: ADD them — curve appears! */}
        {sub >= 5 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20}>Now ADD both neurons' outputs together:</T>
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
              <Graph points={combined} color={C.yellow} title="Combined: a VALLEY shape — a curve!" xLabel="input" yLabel="output"
                annotations={[
                  { x: 3, y: 2, text: "1st bend", color: C.cyan },
                  { x: 5, y: 2, text: "2nd bend", color: C.purple },
                ]} />
            </div>
            <div style={{ padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8, marginTop: 4 }}>
              <T color={C.dim} size={16}>
                input=0 → 0+5 = <strong style={{ color: C.yellow }}>5</strong> &nbsp;
                input=3 → 0+2 = <strong style={{ color: C.yellow }}>2</strong> &nbsp;
                input=4 → 1+1 = <strong style={{ color: C.yellow }}>2</strong> (flat!) &nbsp;
                input=5 → 2+0 = <strong style={{ color: C.yellow }}>2</strong> &nbsp;
                input=7 → 4+0 = <strong style={{ color: C.yellow }}>4</strong>
              </T>
            </div>
            <T color="#ffe082" size={18} style={{ marginTop: 6 }}>Down, then flat, then up. A <strong>valley shape</strong> — a curve — made from just two bent lines added together. <strong>No single straight line can do this.</strong></T>
          </Box>
        )}

        {/* Step 6: Scale up — the big picture */}
        {sub >= 6 && (
          <Box color={C.green} style={{ width: "100%" }}>
            <T color="#80e8a5" bold center size={20}>Scale this up:</T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { n: "2 neurons", bends: "2 bends", shape: "valley / hill", color: C.yellow },
                { n: "10 neurons", bends: "10 bends", shape: "waves, zigzags", color: C.orange },
                { n: "1000 neurons", bends: "1000 bends", shape: "any curve you want", color: C.green },
                { n: "millions", bends: "millions of bends", shape: "language, images, anything", color: C.cyan },
              ].map(({ n, bends, shape, color }) => (
                <div key={n} style={{ display: "grid", gridTemplateColumns: "80px 90px 1fr", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
                  <T color={color} bold center size={18}>{n}</T>
                  <T color={C.dim} size={16}>{bends}</T>
                  <T color={color} size={16}>→ {shape}</T>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,230,118,0.06)", borderRadius: 8, border: `1px solid ${C.green}20` }}>
              <T color="#80e8a5" bold center>Without ReLU: 100 layers = 1 layer (straight line)</T>
              <T color="#80e8a5" center size={18}>With ReLU: each neuron adds a bend → millions of bends → can learn ANY pattern</T>
            </div>
          </Box>
        )}

        {sub < 6 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 1.5 Forward Pass ═══════
  const Ch1_5 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center size={20}>Forward Pass = feeding input through the network to get a prediction.</T><T color="#80deea">Let's use a super simple network: 1 input → 1 neuron → 1 output. We're predicting house price from square footage.</T></Box>}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <T color={C.dim} size={14} center style={{ marginBottom: 8, width: "100%" }}>OUR SIMPLE NETWORK</T>
          <svg width="360" height="90" viewBox="0 0 360 90" style={{ maxWidth: "100%", overflow: "visible" }}>
            {/* Input */}
            <circle cx="50" cy="45" r="24" fill={`${C.cyan}15`} stroke={C.cyan} strokeWidth="1.5" />
            <text x="50" y="40" fill={C.cyan} fontSize="8" textAnchor="middle">sqft</text>
            <text x="50" y="53" fill={C.cyan} fontSize="12" textAnchor="middle" fontWeight="700">1500</text>
            {/* Weight line */}
            <line x1="76" y1="45" x2="164" y2="45" stroke={C.yellow} strokeWidth="2" />
            <text x="120" y="36" fill={C.yellow} fontSize="9" textAnchor="middle" fontWeight="700">× w = 0.5</text>
            {/* Neuron */}
            <circle cx="190" cy="45" r="24" fill={`${C.purple}12`} stroke={C.purple} strokeWidth="1.5" />
            <text x="190" y="38" fill={C.purple} fontSize="8" textAnchor="middle">sum</text>
            <text x="190" y="50" fill={C.purple} fontSize="8" textAnchor="middle">+ b=50</text>
            {/* Arrow out */}
            <line x1="216" y1="45" x2="274" y2="45" stroke={C.green} strokeWidth="2" />
            <text x="245" y="36" fill={C.dim} fontSize="8" textAnchor="middle">ReLU</text>
            {/* Output */}
            <circle cx="300" cy="45" r="24" fill={`${C.green}12`} stroke={C.green} strokeWidth="1.5" />
            <text x="300" y="40" fill={C.green} fontSize="8" textAnchor="middle">pred</text>
            <text x="300" y="53" fill={C.green} fontSize="12" textAnchor="middle" fontWeight="700">800</text>
          </svg>
        </div>
      )}
      {sub >= 2 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>The computation:</T>
          <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>① Multiply: 1500 × 0.5 = <strong style={{ color: C.yellow }}>750</strong></T>
            <T color={C.dim} size={18}>② Add bias: 750 + 50 = <strong style={{ color: C.orange }}>800</strong></T>
            <T color={C.dim} size={18}>③ ReLU(800) = <strong style={{ color: C.green }}>800</strong> (positive, so unchanged)</T>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 6 }}>Our network predicts the house costs <strong>$800k</strong>.</T>
        </Box>
      )}
      {sub >= 3 && <Box color={C.red}><T color="#ff8a80" bold center>But the actual price was $900k.</T><T color="#ff8a80">We're off by $100k. How do we measure this error precisely? That's what the <strong>loss function</strong> does →</T></Box>}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.6 Loss ═══════
  const Ch1_6 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>Loss = a single number that measures how wrong we were.</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>The most common loss function is <strong>Mean Squared Error (MSE)</strong>:</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "14px 20px", border: `1px solid ${C.red}25` }}>
              <T color={C.red} bold size={22} center>Loss = ( actual − predicted )²</T>
            </div>
          </div>
          <T color="#ff8a80" size={18}>Why squared? Two reasons: it makes all errors positive (so they don't cancel out), and it punishes big errors much more than small ones.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Our example:</T>
          <div style={{ marginTop: 8, padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ padding: "6px 12px", borderRadius: 6, background: `${C.green}12`, border: `1px solid ${C.green}25` }}>
                <T color={C.green} size={16}>Predicted: <strong>800</strong></T>
              </div>
              <div style={{ padding: "6px 12px", borderRadius: 6, background: `${C.cyan}12`, border: `1px solid ${C.cyan}25` }}>
                <T color={C.cyan} size={16}>Actual: <strong>900</strong></T>
              </div>
            </div>
            <T color={C.yellow} size={19}>
              Loss = (900 − 800)²<br />
              Loss = (100)²<br />
              Loss = <strong style={{ fontSize: 26 }}>10,000</strong>
            </T>
          </div>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>The KEY insight:</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            The loss depends on the prediction. The prediction depends on <strong>weight</strong> and <strong>bias</strong>. So:<br /><br />
            <strong>If we change the weight → the prediction changes → the loss changes.</strong><br /><br />
            There exists some perfect value of weight and bias that makes the loss as small as possible. Our job: <strong>find those values</strong>.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>But how do we know which direction to change them? We need to understand <strong>derivatives</strong> first →</T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.7 Derivatives ═══════
  const Ch1_7 = () => {
    // SVG fraction helper
    const Frac = ({ top, bottom, color = C.pink, size = 14 }) => (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 4px", lineHeight: 1.2 }}>
        <span style={{ fontSize: size, color, fontWeight: 700, fontStyle: "italic" }}>{top}</span>
        <span style={{ width: "100%", height: 1.5, background: color, margin: "2px 0", borderRadius: 1 }}></span>
        <span style={{ fontSize: size, color, fontWeight: 700, fontStyle: "italic" }}>{bottom}</span>
      </span>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.pink} style={{ width: "100%" }}>
            <T color="#ce93d8" bold center size={20}>Forget calculus. Here's the intuition.</T>
            <T color="#ce93d8" style={{ marginTop: 6 }}>
              A <strong>derivative</strong> answers one simple question:<br /><br />
              <em>"If I nudge the input a tiny bit, how much does the output change?"</em>
            </T>
          </Box>
        )}
        {sub >= 1 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center>Concrete example with our network:</T>
            <T color="#ffe082" style={{ marginTop: 6 }}>Currently: weight = 0.5, prediction = 800, loss = 10,000.</T>
            <T color="#ffe082" style={{ marginTop: 6 }}>What if we nudge weight from 0.5 to <strong>0.6</strong>?</T>
            <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <T color={C.dim} size={18}>New prediction = 1500 × 0.6 + 50 = <strong style={{ color: C.green }}>950</strong></T>
              <T color={C.dim} size={18}>New loss = (900 − 950)² = <strong style={{ color: C.red }}>2,500</strong></T>
            </div>
            <T color="#ffe082" style={{ marginTop: 8 }}>
              Weight changed by <strong>+0.1</strong> → Loss changed by <strong>−7,500</strong><br />
              Increasing the weight made the loss go <strong>down</strong>. Good direction!
            </T>
          </Box>
        )}
        {sub >= 2 && (
          <Box color={C.pink} style={{ width: "100%" }}>
            <T color="#ce93d8" bold center>The derivative is this ratio, written as a fraction:</T>
            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "16px 22px", border: `1px solid ${C.pink}30` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
                    <span style={{ fontSize: 26, color: C.pink, fontWeight: 700, fontStyle: "italic" }}>∂ Loss</span>
                    <div style={{ width: "100%", height: 2, background: C.pink, margin: "4px 0", borderRadius: 1 }}></div>
                    <span style={{ fontSize: 26, color: C.pink, fontWeight: 700, fontStyle: "italic" }}>∂ weight</span>
                  </div>
                </div>
              </div>
              <T color={C.dim} size={20}>=</T>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.yellow}30` }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 21, color: C.yellow, fontWeight: 700 }}>how much loss changed</span>
                  <div style={{ width: "100%", height: 2, background: C.yellow, margin: "4px 0", borderRadius: 1 }}></div>
                  <span style={{ fontSize: 21, color: C.yellow, fontWeight: 700 }}>how much weight changed</span>
                </div>
              </div>
            </div>
            <T color="#ce93d8" size={18}>
              The ∂ symbol (partial derivative) just means "tiny change in". Read it as: "the tiny change in loss caused by a tiny change in weight."
            </T>
          </Box>
        )}
        {sub >= 3 && (
          <Box color={C.green} style={{ width: "100%" }}>
            <T color="#80e8a5" bold center>What the derivative TELLS us:</T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { sign: "Negative (−)", meaning: "Increasing weight → loss goes DOWN", action: "→ increase the weight!", color: C.green, icon: "📉" },
                { sign: "Positive (+)", meaning: "Increasing weight → loss goes UP", action: "→ decrease the weight!", color: C.red, icon: "📈" },
                { sign: "Large number", meaning: "Loss is VERY sensitive to this weight", action: "→ this weight matters a lot", color: C.yellow, icon: "⚡" },
                { sign: "Small number", meaning: "Loss barely changes when weight changes", action: "→ this weight matters little", color: C.dim, icon: "😴" },
              ].map(({ sign, meaning, action, color, icon }) => (
                <div key={sign} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 10px", borderRadius: 6, background: `${color}08` }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <T color={color} bold center size={18}>{sign}</T>
                    <T color={C.dim} size={16}>{meaning} {action}</T>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        )}
        {sub >= 4 && <Box color={C.purple}><T color="#b8a9ff" bold center>The derivative is our COMPASS — it tells us which direction to adjust each weight.</T><T color="#b8a9ff" center size={18} style={{ marginTop: 4 }}>But in a network with many steps, how do we compute this derivative? That's the <strong>chain rule</strong> →</T></Box>}
        {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 1.8 Backward Pass ═══════
  const Ch1_8 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>The problem: there are MULTIPLE steps between weight and loss.</T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>In our network, changing the weight doesn't directly change the loss. It goes through a chain:</T>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "weight", sub: "w = 0.5", c: C.yellow },
              { label: "× input + bias", sub: "→ pred = 800", c: C.purple },
              { label: "− actual", sub: "→ error = −100", c: C.orange },
              { label: "square it", sub: "→ loss = 10,000", c: C.red },
            ].map(({ label, sub: s2, c }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ padding: "6px 8px", borderRadius: 6, background: `${c}12`, border: `1px solid ${c}25`, textAlign: "center" }}>
                  <T color={c} size={14} bold center>{label}</T>
                  <T color={C.dim} size={12} center>{s2}</T>
                </div>
                {i < 3 && <T color={C.dim} size={20}>→</T>}
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>The Chain Rule: work backwards, one step at a time.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Start from the loss and trace back. At each step, ask: "how does this step's input affect its output?"</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            {/* Step 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ background: `${C.red}20`, color: C.red, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>1</span>
                <T color={C.red} bold center size={18}>Loss with respect to error:</T>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <T color={C.dim} size={16}>loss = error² → derivative = 2 × error = 2 × (−100) = <strong style={{ color: C.red }}>−200</strong></T>
              </div>
            </div>
            {/* Step 2 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ background: `${C.orange}20`, color: C.orange, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>2</span>
                <T color={C.orange} bold center size={18}>Error with respect to prediction:</T>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <T color={C.dim} size={16}>error = pred − 900 → derivative = <strong style={{ color: C.orange }}>1</strong> (direct relationship)</T>
              </div>
            </div>
            {/* Step 3 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ background: `${C.yellow}20`, color: C.yellow, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>3</span>
                <T color={C.yellow} bold center size={18}>Prediction with respect to weight:</T>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <T color={C.dim} size={16}>pred = input × w + bias = 1500w + 50 → derivative = <strong style={{ color: C.yellow }}>1500</strong></T>
              </div>
            </div>
          </div>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center>Now MULTIPLY them all together (that's the chain rule!):</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "14px 0" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.pink}30` }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: 21, color: C.pink, fontWeight: 700, fontStyle: "italic" }}>∂ Loss</span>
                    <div style={{ width: "100%", height: 2, background: C.pink, margin: "3px 0" }}></div>
                    <span style={{ fontSize: 21, color: C.pink, fontWeight: 700, fontStyle: "italic" }}>∂ weight</span>
                  </div>
                  <T color={C.dim} size={20}>=</T>
                  <span style={{ color: C.red, fontWeight: 700, fontSize: 20 }}>−200</span>
                  <T color={C.dim} size={20}>×</T>
                  <span style={{ color: C.orange, fontWeight: 700, fontSize: 20 }}>1</span>
                  <T color={C.dim} size={20}>×</T>
                  <span style={{ color: C.yellow, fontWeight: 700, fontSize: 20 }}>1500</span>
                </div>
                <T color={C.pink} bold center size={26}> = −300,000</T>
              </div>
            </div>
          </div>
          <T color="#ce93d8" size={18}>This is negative → increasing weight will <strong>decrease</strong> loss. Good! The magnitude (300,000) tells us the loss is very sensitive to this weight.</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>Same thing for bias:</T>
          <div style={{ marginTop: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 19, color: C.cyan, fontWeight: 700, fontStyle: "italic" }}>∂ Loss</span>
                <div style={{ width: "100%", height: 2, background: C.cyan, margin: "2px 0" }}></div>
                <span style={{ fontSize: 19, color: C.cyan, fontWeight: 700, fontStyle: "italic" }}>∂ bias</span>
              </div>
              <T color={C.dim} size={19}>=</T>
              <span style={{ color: C.red, fontWeight: 700, fontSize: 19 }}>−200</span>
              <T color={C.dim} size={19}>×</T>
              <span style={{ color: C.orange, fontWeight: 700, fontSize: 19 }}>1</span>
              <T color={C.dim} size={19}>×</T>
              <span style={{ color: C.cyan, fontWeight: 700, fontSize: 19 }}>1</span>
              <T color={C.dim} size={19}>=</T>
              <T color={C.cyan} bold center size={21}>−200</T>
            </div>
            <T color={C.dim} size={16} style={{ marginTop: 4 }}>pred = 1500w + bias → derivative of pred w.r.t. bias = 1 (bias is directly added)</T>
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 6 }}>Now we have a gradient for <strong>every learnable parameter</strong>: weight and bias. Time to update them →</T>
        </Box>
      )}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.9 Gradient Descent ═══════
  const Ch1_9 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>Gradient Descent = use the gradient to fix the weights.</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>The update rule is simple:</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.green}30` }}>
              <T color={C.green} bold size={20} center>new = old − learning_rate × gradient</T>
            </div>
          </div>
          <T color="#80e8a5" size={18}>We move in the <strong>opposite</strong> direction of the gradient (that's the minus sign). If gradient says "loss increases when you go right," we go left.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={19}>Learning Rate (α) — How Big a Step?</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Our gradient is −300,000. If we applied it directly: new_w = 0.5 − (−300,000) = 300,000.5. That's insane! The weight would jump wildly.</T>
          <T color="#ffe082" style={{ marginTop: 8 }}>The <strong>learning rate</strong> is a tiny number (like 0.0000001) that scales the step down:</T>
          <div style={{ marginTop: 8, padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}><strong style={{ color: C.yellow }}>Weight update:</strong></T>
            <T color={C.yellow} size={18}>new_w = 0.5 − (0.0000001 × −300,000)</T>
            <T color={C.yellow} size={18}>new_w = 0.5 − (−0.03) = <strong style={{ color: C.green, fontSize: 22 }}>0.53</strong></T>
            <div style={{ marginTop: 8, borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 8 }}>
              <T color={C.dim} size={18}><strong style={{ color: C.cyan }}>Bias update:</strong></T>
              <T color={C.cyan} size={18}>new_b = 50 − (0.0000001 × −200)</T>
              <T color={C.cyan} size={18}>new_b = 50 − (−0.00002) = <strong style={{ color: C.green, fontSize: 22 }}>50.00002</strong></T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center>Let's verify — did we improve?</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}><strong>Before:</strong> w=0.5, b=50 → pred = 1500×0.5+50 = <strong style={{ color: C.red }}>800</strong> → loss = <strong style={{ color: C.red }}>10,000</strong></T>
            <T color={C.dim} size={18}><strong>After:</strong> w=0.53, b≈50 → pred = 1500×0.53+50 = <strong style={{ color: C.green }}>845</strong> → loss = <strong style={{ color: C.green }}>3,025</strong></T>
          </div>
          <T color={C.orange} size={18} style={{ marginTop: 6 }}>Loss dropped from 10,000 → 3,025! We're getting closer to the actual price of $900k. Repeat this loop thousands of times and the loss approaches zero.</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>The Landscape Analogy</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>Imagine you're blindfolded on a hilly landscape. Height = loss. You want to find the lowest valley.</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
            <svg width="300" height="110" viewBox="0 0 300 110" style={{ maxWidth: "100%", overflow: "visible" }}>
              <path d="M10,30 Q50,75 90,60 Q130,45 160,65 Q200,85 240,40 Q270,15 290,25" fill="none" stroke={C.purple} strokeWidth="2.5" />
              <text x="40" y="18" fill={C.dim} fontSize="8">← loss value (height) →</text>
              <text x="150" y="105" fill={C.dim} fontSize="8">← weight value →</text>
              {/* You */}
              <circle cx="90" cy="60" r="7" fill={C.red} />
              <text x="90" y="80" fill={C.red} fontSize="8" textAnchor="middle" fontWeight="600">start (w=0.5)</text>
              {/* Step 1 */}
              <circle cx="130" cy="47" r="5" fill={C.orange} />
              <line x1="95" y1="58" x2="126" y2="49" stroke={C.yellow} strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="130" y="41" fill={C.orange} fontSize="7" textAnchor="middle">step 1</text>
              {/* Step 2 */}
              <circle cx="170" cy="55" r="4" fill={C.yellow} />
              {/* Goal */}
              <circle cx="260" cy="22" r="7" fill={C.green} />
              <text x="260" y="14" fill={C.green} fontSize="8" textAnchor="middle" fontWeight="600">goal (min loss)</text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Gradient", desc: "tells you which direction is downhill", color: C.pink },
              { label: "Learning rate too big", desc: "you jump over the valley", color: C.red },
              { label: "Learning rate too small", desc: "takes forever to get there", color: C.dim },
              { label: "Just right", desc: "steady descent to the minimum", color: C.green },
            ].map(({ label, desc, color }) => (
              <div key={label} style={{ flex: "1 1 45%", padding: "4px 8px", borderRadius: 5, background: `${color}08` }}>
                <T color={color} bold center size={14}>{label}</T>
                <T color={C.dim} size={12}>{desc}</T>
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 4 && (
        <Box color={C.green}>
          <T color="#80e8a5" bold center size={20}>✅ That's backpropagation + gradient descent!</T>
          <T color="#80e8a5" center size={18} style={{ marginTop: 6 }}>
            In real networks with <strong>millions of weights and biases</strong>, the exact same process happens — just with longer chains and more derivatives. The math scales, the idea stays identical.<br /><br />
            Forward → Loss → Backward (chain rule) → Update → Repeat.
          </T>
        </Box>
      )}
      {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.10 CNN ═══════
  const Ch1_10 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center>Built for images. A small "filter" slides across the image detecting patterns.</T></Box>}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="320" height="120">
            {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 5 }).map((_, c2) => (<rect key={`${r}${c2}`} x={10 + c2 * 20} y={8 + r * 20} width={18} height={18} rx={2} fill={`${C.cyan}${Math.random() > 0.5 ? '22' : '10'}`} stroke={`${C.cyan}25`} strokeWidth={0.5} />)))}
            <rect x="12" y="10" width="56" height="56" rx={3} fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="5,3" />
            <text x="40" y="4" fill={C.red} fontSize="8" textAnchor="middle" fontWeight="700">filter slides →</text>
            <text x="140" y="55" fill={C.dim} fontSize="16">→</text>
            {Array.from({ length: 3 }).map((_, r) => Array.from({ length: 3 }).map((_, c2) => (<rect key={`f${r}${c2}`} x={170 + c2 * 22} y={15 + r * 22} width={20} height={20} rx={3} fill={`${C.green}${Math.random() > 0.3 ? '22' : '10'}`} stroke={`${C.green}25`} strokeWidth={0.5} />)))}
            <text x="230" y="55" fill={C.dim} fontSize="16">→</text>
            <text x="270" y="38" fill={C.green} fontSize="12" fontWeight="700">🐱 Cat</text>
            <text x="270" y="55" fill={C.dim} fontSize="11">🐶 Dog</text>
            <text x="55" y="115" fill={C.dim} fontSize="9" textAnchor="middle">image</text>
            <text x="192" y="95" fill={C.dim} fontSize="9" textAnchor="middle">features</text>
          </svg>
        </div>
      )}
      {sub >= 2 && <Box color={C.purple}><T color="#b8a9ff" bold center>Layers build on each other:</T><T color="#b8a9ff">Layer 1: <strong>edges</strong> → Layer 2: <strong>shapes</strong> → Layer 3: <strong>parts</strong> (eyes) → Layer 4: <strong>objects</strong> (face)</T></Box>}
      {sub >= 3 && <Box color={C.red}><T color="#ff8a80" bold center>❌ Not great for language:</T><T color="#ff8a80">Related words can be far apart: "The cat <em>that I saw yesterday</em> <strong>was</strong> sleeping." — "cat" and "was" are 6 words apart but grammatically linked. CNN only looks at local windows.</T></Box>}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.11 RNN ═══════
  const Ch1_11 = () => {
    const words = ["The", "cat", "sat", "on", "mat"];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <Box color={C.pink}><T color="#ce93d8" bold center>Built for sequences. Reads one word at a time, passing "memory" forward.</T><T>Like reading a book left-to-right, remembering what you read.</T></Box>}
        {sub >= 1 && (
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}>
            <svg width="370" height="110">
              {words.map((w, i) => {
                const x = 15 + i * 72;
                const op = Math.max(0.15, 0.7 - i * 0.14);
                return (<g key={i}><text x={x + 20} y="100" fill={C.pink} fontSize="12" textAnchor="middle" fontWeight="600">{w}</text><line x1={x + 20} y1="88" x2={x + 20} y2="65" stroke={`${C.pink}40`} strokeWidth="1.5" /><rect x={x} y="32" width="40" height="30" rx="7" fill={`${C.pink}12`} stroke={`${C.pink}45`} strokeWidth="1.5" /><text x={x + 20} y="51" fill={C.pink} fontSize="9" textAnchor="middle" fontWeight="700">RNN</text>{i < 4 && <><line x1={x + 42} y1="47" x2={x + 68} y2="47" stroke={`rgba(224,64,251,${op})`} strokeWidth="2" /><polygon points={`${x + 66},43 ${x + 72},47 ${x + 66},51`} fill={`rgba(224,64,251,${op})`} /></>}<text x={x + 20} y="26" fill={`rgba(224,64,251,${op})`} fontSize="7" textAnchor="middle">{i === 0 ? "memory" : i >= 3 ? "fading..." : "memory"}</text></g>);
              })}
              <text x="185" y="14" fill={C.dim} fontSize="9" textAnchor="middle">→ must finish word 1 before starting word 2 →</text>
            </svg>
          </div>
        )}
        {sub >= 2 && <Box color={C.green}><T color="#80cbc4" bold center>✅ Understands order!</T><T color="#80cbc4">"Dog bites man" ≠ "Man bites dog" because the memory builds differently.</T></Box>}
        {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 1.12 RNN Flaws ═══════
  const Ch1_12 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={21}>Flaw #1: It's SLOW</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>Must process word 1, then word 2, then word 3... sequentially. On a GPU with thousands of cores, only ONE core works at a time.</T>
          <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["The", "cat", "sat", "on", "the", "mat"].map((w, i) => (
              <div key={i} style={{ padding: "3px 7px", borderRadius: 4, fontSize: 14, background: i === 0 ? `${C.green}18` : `${C.red}08`, border: `1px solid ${i === 0 ? `${C.green}35` : `${C.red}12`}`, color: i === 0 ? C.green : C.dim }}>{w} {i === 0 ? "⬅ processing" : "⏳"}</div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={21}>Flaw #2: It FORGETS</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Memory passes through every step. By word 100, word 1's information is essentially lost.</T>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 8, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            {[1, 0.8, 0.6, 0.4, 0.2, 0.08, 0.02].map((op, i) => (
              <div key={i} style={{ width: 30, height: 22, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(255,215,64,${op * 0.3})`, border: `1px solid rgba(255,215,64,${op * 0.3})` }}>
                <span style={{ fontSize: 10, color: `rgba(255,215,64,${op})` }}>w{i + 1}</span>
              </div>
            ))}
            <T color={C.dim} size={12} style={{ marginLeft: 4 }}>← memory fading</T>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 6 }}>This is the <strong>"vanishing gradient"</strong> problem.</T>
        </Box>
      )}
      {sub >= 2 && <Box color={C.green}><T color="#80e8a5" bold center>We need: ⚡ parallel processing + 🧠 perfect memory + 📍 order awareness</T><T color={C.yellow} center bold size={21} style={{ marginTop: 6 }}>Enter: The Transformer →</T></Box>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 1.13 Transformer Arrives ═══════
  const Ch1_13 = () => {
    const words = ["The", "cat", "sat", "on", "mat"];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <Box color={C.green}><T color="#80e8a5" bold center size={20}>2017 — "Attention Is All You Need"</T><T color="#80e8a5">The key idea: let every word look at every other word <strong>simultaneously</strong>.</T></Box>}
        {sub >= 1 && (
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, width: "100%", display: "flex", justifyContent: "center" }}>
            <svg width="360" height="130">
              {words.map((w, i) => {
                const x = 20 + i * 68;
                return (<g key={i}><rect x={x} y="72" width="48" height="26" rx="6" fill={`${C.green}10`} stroke={`${C.green}35`} strokeWidth="1.5" /><text x={x + 24} y="89" fill={C.green} fontSize="11" textAnchor="middle" fontWeight="700">{w}</text>
                  {words.map((_, j) => { if (i === j) return null; const x2 = 20 + j * 68; const op = (i === 1 && (j === 0 || j === 2)) ? 0.45 : 0.08; const mid = Math.min(72, 72 - Math.abs(i - j) * 10); return <path key={j} d={`M${x + 24},72 Q${(x + 24 + x2 + 24) / 2},${mid} ${x2 + 24},72`} fill="none" stroke={`rgba(0,230,118,${op})`} strokeWidth={op > 0.2 ? 2 : 0.7} />; })}
                </g>);
              })}
              <text x="180" y="120" fill={C.dim} fontSize="9" textAnchor="middle">"cat" attends most to "The" and "sat" (bright lines)</text>
              <text x="180" y="15" fill={`${C.green}60`} fontSize="10" textAnchor="middle">⚡ ALL processed in parallel</text>
            </svg>
          </div>
        )}
        {sub >= 2 && (
          <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
            <Box color={C.red} style={{ flex: 1 }}><T color="#ff8a80" bold center size={16}>RNN</T><T color={C.dim} size={14} center>Sequential, slow<br />Forgets distant words</T></Box>
            <Box color={C.green} style={{ flex: 1 }}><T color="#80e8a5" bold center size={16}>Transformer</T><T color={C.mid} size={14} center>Parallel, blazing fast<br />Every word sees every word</T></Box>
          </div>
        )}
        {sub >= 3 && <Box color={C.yellow}><T color={C.yellow} bold center>Powers GPT, Claude, LLaMA, Gemini — ALL modern AI.</T><T center size={18} style={{ marginTop: 4 }}>Now let's see the full architecture →</T></Box>}
        {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 2.1 Full Architecture (faithful SVG diagram) ═══════
  const Ch2_1 = () => {
    const ArchDiagram = () => (
      <svg width="420" height="580" viewBox="0 0 420 580" style={{ maxWidth: "100%", overflow: "visible" }}>
        <defs>
          <marker id="arrowW" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="rgba(255,255,255,0.45)" /></marker>
          <marker id="arrowG" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={`${C.green}90`} /></marker>
        </defs>

        {/* ═══ ENCODER (left) ═══ */}
        <text x="107" y="16" fill={C.cyan} fontSize="12" textAnchor="middle" fontWeight="700">ENCODER</text>

        {/* Encoder outer stack box */}
        <rect x="22" y="188" width="170" height="240" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="180" y="420" fill={C.dim} fontSize="9" textAnchor="end">×N</text>

        {/* --- Encoder boxes (bottom to top) --- */}
        {/* E: Multi-Head Attention */}
        <rect x="45" y="350" width="125" height="44" rx="8" fill="rgba(0,184,212,0.15)" stroke={C.cyan} strokeWidth="1.5" />
        <text x="107" y="368" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Multi-Head</text>
        <text x="107" y="382" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Attention</text>

        {/* E: Add & Norm 1 (above attention) */}
        <rect x="45" y="306" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
        <text x="107" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

        {/* E: FFN */}
        <rect x="45" y="256" width="125" height="36" rx="8" fill="rgba(100,149,237,0.12)" stroke="cornflowerblue" strokeWidth="1.2" />
        <text x="107" y="271" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">Point-wise</text>
        <text x="107" y="284" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">FFN</text>

        {/* E: Add & Norm 2 (above FFN) */}
        <rect x="45" y="212" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
        <text x="107" y="229" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

        {/* --- Encoder MAIN flow arrows (bottom to top, center) --- */}
        {/* Input area → Attention */}
        <line x1="107" y1="430" x2="107" y2="396" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Attention → Add&Norm1 */}
        <line x1="107" y1="350" x2="107" y2="334" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Add&Norm1 → FFN */}
        <line x1="107" y1="306" x2="107" y2="294" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* FFN → Add&Norm2 */}
        <line x1="107" y1="256" x2="107" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Add&Norm2 → out of stack */}
        <line x1="107" y1="212" x2="107" y2="185" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

        {/* --- Encoder RESIDUAL skip connections --- */}
        {/* Skip around Attention: from below attention, go left, up to Add&Norm1 */}
        <path d="M45,396 L30,396 L30,319 L43,319" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Skip around FFN: from below FFN (=Add&Norm1 out), go left, up to Add&Norm2 */}
        <path d="M45,294 L30,294 L30,225 L43,225" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

        {/* --- Encoder bottom: Positional Encoding + Embedding --- */}
        <circle cx="107" cy="448" r="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
        <text x="107" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">⊕</text>
        <text x="27" y="448" fill={C.dim} fontSize="8" textAnchor="middle">Positional</text>
        <text x="27" y="459" fill={C.dim} fontSize="8" textAnchor="middle">Encoding</text>
        <line x1="50" y1="448" x2="91" y2="448" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

        <rect x="57" y="480" width="100" height="34" rx="8" fill="rgba(0,230,118,0.12)" stroke={C.green} strokeWidth="1.5" />
        <text x="107" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Encoder</text>
        <text x="107" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Embedding</text>

        {/* Embedding → ⊕ */}
        <line x1="107" y1="480" x2="107" y2="464" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Inputs label */}
        <text x="107" y="540" fill={C.dim} fontSize="11" textAnchor="middle">Inputs</text>
        <line x1="107" y1="530" x2="107" y2="516" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />


        {/* ═══ DECODER (right) ═══ */}
        <text x="312" y="16" fill={C.red} fontSize="12" textAnchor="middle" fontWeight="700">DECODER</text>

        {/* Output head: Linear & SoftMax */}
        <rect x="252" y="34" width="120" height="36" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <text x="312" y="49" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">Linear &</text>
        <text x="312" y="62" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">SoftMax</text>
        <text x="312" y="26" fill={C.dim} fontSize="9" textAnchor="middle">Output Probabilities</text>
        <line x1="312" y1="26" x2="312" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

        {/* Decoder outer stack box */}
        <rect x="228" y="86" width="170" height="340" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="386" y="420" fill={C.dim} fontSize="9" textAnchor="end">×N</text>

        {/* --- Decoder boxes (bottom to top) --- */}
        {/* D: Masked Multi-Head Attention */}
        <rect x="252" y="348" width="125" height="44" rx="8" fill="rgba(255,152,0,0.12)" stroke="#ff9800" strokeWidth="1.5" />
        <text x="314" y="364" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">Masked</text>
        <text x="314" y="377" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">Multi-Head Attn</text>

        {/* D: Add & Norm 1 (above masked attn) */}
        <rect x="252" y="306" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
        <text x="314" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

        {/* D: Cross-Attention (Multi-Head Attention) */}
        <rect x="252" y="250" width="125" height="44" rx="8" fill="rgba(0,184,212,0.15)" stroke={C.cyan} strokeWidth="1.5" />
        <text x="314" y="268" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Multi-Head</text>
        <text x="314" y="282" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Attention</text>

        {/* D: Add & Norm 2 (above cross-attn) */}
        <rect x="252" y="210" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
        <text x="314" y="227" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

        {/* D: FFN */}
        <rect x="252" y="160" width="125" height="36" rx="8" fill="rgba(100,149,237,0.12)" stroke="cornflowerblue" strokeWidth="1.2" />
        <text x="314" y="175" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">Point-wise</text>
        <text x="314" y="188" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">FFN</text>

        {/* D: Add & Norm 3 (above FFN) */}
        <rect x="252" y="118" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
        <text x="314" y="135" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

        {/* --- Decoder MAIN flow arrows (bottom to top, center) --- */}
        {/* Input area → Masked Attn */}
        <line x1="314" y1="430" x2="314" y2="394" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Masked Attn → Add&Norm1 */}
        <line x1="314" y1="348" x2="314" y2="334" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Add&Norm1 → Cross-Attn */}
        <line x1="314" y1="306" x2="314" y2="296" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Cross-Attn → Add&Norm2 */}
        <line x1="314" y1="250" x2="314" y2="238" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Add&Norm2 → FFN */}
        <line x1="314" y1="210" x2="314" y2="198" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* FFN → Add&Norm3 */}
        <line x1="314" y1="160" x2="314" y2="146" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Add&Norm3 → out of stack → Linear */}
        <line x1="314" y1="118" x2="314" y2="86" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <line x1="314" y1="86" x2="314" y2="72" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

        {/* --- Decoder RESIDUAL skip connections --- */}
        {/* Skip around Masked Attn: left side, from below masked attn up to Add&Norm1 */}
        <path d="M252,394 L236,394 L236,319 L250,319" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Skip around Cross-Attn: left side, from below cross-attn up to Add&Norm2 */}
        <path d="M252,296 L236,296 L236,223 L250,223" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Skip around FFN: left side, from below FFN up to Add&Norm3 */}
        <path d="M252,198 L236,198 L236,131 L250,131" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

        {/* --- CROSS-ATTENTION: Encoder output → Decoder cross-attention --- */}
        {/* Encoder top output goes right to decoder cross-attention */}
        <path d="M107,185 L107,172 L210,172 L210,272 L250,272" fill="none" stroke={`${C.green}55`} strokeWidth="2" markerEnd="url(#arrowG)" />
        <text x="210" y="166" fill={`${C.green}70`} fontSize="8" textAnchor="middle">K, V from encoder</text>

        {/* --- Decoder bottom: Positional Encoding + Embedding --- */}
        <circle cx="314" cy="448" r="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
        <text x="314" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">⊕</text>
        <text x="393" y="448" fill={C.dim} fontSize="8" textAnchor="middle">Positional</text>
        <text x="393" y="459" fill={C.dim} fontSize="8" textAnchor="middle">Encoding</text>
        <line x1="374" y1="448" x2="330" y2="448" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

        <rect x="264" y="480" width="100" height="34" rx="8" fill="rgba(0,230,118,0.12)" stroke={C.green} strokeWidth="1.5" />
        <text x="314" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Decoder</text>
        <text x="314" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Embedding</text>

        {/* Embedding → ⊕ */}
        <line x1="314" y1="480" x2="314" y2="464" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        {/* Outputs label */}
        <text x="314" y="540" fill={C.dim} fontSize="10" textAnchor="middle">Outputs</text>
        <text x="314" y="553" fill={C.dim} fontSize="10" textAnchor="middle">(shifted right)</text>
        <line x1="314" y1="530" x2="314" y2="516" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />
      </svg>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <T center color={C.mid} size={19}>The complete Transformer — matching your original diagram:</T>}
        {sub >= 0 && (
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: "10px 4px", border: `1px solid ${C.border}`, overflowX: "auto", display: "flex", justifyContent: "center" }}>
            <ArchDiagram />
          </div>
        )}
        {sub >= 1 && <Box color={C.green}><T color="#80e8a5" bold center>🔍 Let's zoom into the bottom first — the green "Embedding" boxes.</T><T color="#80e8a5">This is where words enter the Transformer as numbers.</T></Box>}
        {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 2.2 Embeddings ═══════
  const Ch2_2 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.red}><T color="#ff8a80" bold center>Problem: Neural networks only do math on numbers, not words.</T><T color="#ff8a80">We need 3 stages to convert words → numbers the network can use:</T></Box>}
      {sub >= 1 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center>Stage 1: Tokenization</T>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ padding: "5px 12px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}25` }}><T color={C.red} size={19} bold center>"I love cats"</T></div>
            <T color={C.dim} size={26}>→</T>
            {["I", "love", "cats"].map((t, i) => (<div key={i} style={{ padding: "5px 10px", borderRadius: 6, background: `${C.purple}12`, border: `1px solid ${C.purple}25` }}><T color={C.purple} size={18} bold center>"{t}"</T></div>))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>Real LLMs: "unbelievable" → ["un", "believ", "able"]</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>Stage 2: Token → ID (vocabulary lookup)</T>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            {[{ t: '"I"', id: 4 }, { t: '"love"', id: 6 }, { t: '"cats"', id: 2 }].map(({ t, id }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.purple, fontSize: 18 }}>{t}</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 20, background: `${C.green}12`, padding: "2px 8px", borderRadius: 4 }}>{id}</span>
              </div>
            ))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>These IDs are arbitrary — the number 6 doesn't "mean" love yet.</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Stage 3: ID → Embedding (the KEY step)</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Each ID looks up a row in a learned matrix. Each row = 512 numbers representing that word's meaning.</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[{ w: '"I"', c: C.red, v: "[ 0.12, -0.34, 0.78, ..., 0.91]" }, { w: '"love"', c: C.purple, v: "[ 0.56,  0.23, -0.11, ..., 0.53]" }, { w: '"cats"', c: C.cyan, v: "[-0.45,  0.89,  0.33, ..., 0.67]" }].map(({ w, c, v }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 4, background: `${c}06` }}>
                <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 40 }}>{w}</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <code style={{ color: `${c}aa`, fontSize: 14 }}>{v}</code>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 6 }}>Similar words (cat/dog) get similar vectors. Learned during training.</T>
        </Box>
      )}
      {sub >= 4 && <Box color={C.green}><T color="#80e8a5" bold center>✅ Words are now 512-number vectors!</T><T color="#80e8a5" center size={18}>But still no position info. "I love cats" = "cats love I". Next: Positional Encoding →</T></Box>}
      {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 2.3 Pos Enc — Problem ═══════
  const Ch2_3 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>The Transformer sees all words at the SAME TIME.</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>It receives three embedding vectors simultaneously. Nothing tells it which is first, second, or third.</T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>"I love cats" → [vec_I, vec_love, vec_cats]</T>
            <T color={C.dim} size={18}>"cats love I" → [vec_cats, vec_love, vec_I]</T>
            <T color={C.red} size={18} bold center style={{ marginTop: 4 }}>Same vectors, different order — but model CAN'T SEE ORDER!</T>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Why simple solutions fail:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>❌ Use [1,1,...], [2,2,...], [3,3,...]?</T>
              <T color={C.dim} size={16}>Values grow forever. At position 1000, you add 1000 to every dimension — drowns out the word meaning.</T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>❌ Use pos/max_length (0.0, 0.01, 0.02...)?</T>
              <T color={C.dim} size={16}>Step size depends on sentence length. Model can't learn consistent patterns.</T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>❌ Use random vectors?</T>
              <T color={C.dim} size={16}>No relationship between positions. Can't learn "pos 5 is near pos 6".</T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 2 && <Box color={C.green}><T color="#80e8a5" bold center>We need: bounded values, unique per position, relative distances learnable.</T><T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>Solution: Sine & Cosine waves →</T></Box>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 2.4 Pos Enc — Formula ═══════
  const Ch2_4 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.cyan}20`, borderRadius: 10, padding: "16px", width: "100%" }}>
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>The Formula</T>
          <div style={{ fontFamily: "monospace", fontSize: 19, color: "#80cbc4", textAlign: "center", lineHeight: 2.2 }}>
            <div>Even dims (0,2,4...): <strong>sin</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )</div>
            <div>Odd dims (1,3,5...): <strong>cos</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )</div>
          </div>
        </div>
      )}
      {sub >= 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {[
            { term: "pos", desc: "Position of word in sentence (0, 1, 2...)", c: C.red },
            { term: "i", desc: "Which of the 512 dimensions we're computing", c: C.purple },
            { term: "d_model", desc: "Size of embedding (512)", c: C.cyan },
            { term: "10000^(i/d)", desc: "Controls wave speed. Small i = fast. Large i = slow.", c: C.yellow },
            { term: "sin/cos", desc: "Output always between -1 and +1. Never explodes!", c: C.green },
          ].map(({ term, desc, c }) => (
            <div key={term} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${c}06` }}>
              <code style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 72, background: `${c}10`, padding: "2px 6px", borderRadius: 4 }}>{term}</code>
              <T color={C.mid} size={16}>{desc}</T>
            </div>
          ))}
        </div>
      )}
      {sub >= 2 && <Box color={C.yellow}><T color={C.yellow} bold center>The KEY insight: 10000^(i/d_model)</T><T color="#ffe082">When i=0, divisor=1 → pos/1 = pos → wave oscillates FAST.<br />When i=510, divisor≈10000 → pos/10000 ≈ tiny → wave changes BARELY.<br /><br />Like a clock: <strong style={{ color: C.cyan }}>seconds hand</strong> (fast) + <strong style={{ color: C.purple }}>hours hand</strong> (slow) = exact time.</T></Box>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ 2.5 Pos Enc — Computing ═══════
  const Ch2_5 = () => {
    const d = 8;
    const computeRow = (pos) => {
      const vals = [];
      for (let i = 0; i < d; i++) {
        const di = Math.floor(i / 2) * 2;
        const div = Math.pow(10000, di / d);
        const angle = pos / div;
        vals.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
      }
      return vals;
    };
    const rows = [
      { pos: 0, word: "I", c: C.red, vals: computeRow(0) },
      { pos: 1, word: "love", c: C.purple, vals: computeRow(1) },
      { pos: 2, word: "cats", c: C.cyan, vals: computeRow(2) },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <T center color={C.mid} size={18}>Using 8 dimensions (real model uses 512, same idea). Actual computed values:</T>}
        {sub >= 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 8px", width: "100%", overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 2, marginBottom: 6 }}>
              <span></span>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} style={{ fontSize: 11, color: i < 2 ? C.yellow : i < 4 ? C.orange : i < 6 ? C.cyan : C.purple, textAlign: "center", fontFamily: "monospace" }}>d{i} {i % 2 === 0 ? "sin" : "cos"}</span>
              ))}
            </div>
            {rows.map(({ pos, word, c, vals }, ri) => (
              <div key={pos} style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 2, padding: "4px 0", borderRadius: 4, background: `${c}06`, marginBottom: 2 }}>
                <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>Pos {pos} ({word})</span>
                {vals.map((v, i) => {
                  const prev = ri > 0 ? rows[ri - 1].vals[i] : null;
                  const change = prev !== null ? Math.abs(v - prev) : 0;
                  return <span key={i} style={{ fontFamily: "monospace", fontSize: 14, textAlign: "center", color: change > 0.2 ? C.yellow : `${c}bb`, fontWeight: change > 0.2 ? 700 : 400 }}>{v.toFixed(3)}</span>;
                })}
              </div>
            ))}
          </div>
        )}
        {sub >= 1 && <Box color={C.yellow}><T color={C.yellow} bold center>Yellow values = big change between positions.</T><T color="#ffe082">Left columns (d0, d1) change dramatically. Right columns (d6, d7) barely move. Each position has a unique fingerprint.</T></Box>}
        {sub >= 2 && (
          <Box color={C.green}>
            <T color="#80e8a5" bold center>Position 0: all sin(0)=0, cos(0)=1 → clean [0, 1, 0, 1, 0, 1, 0, 1]</T>
            <T color="#80e8a5" style={{ marginTop: 4 }}>Position 1: d0 jumps 0→0.841 (fast!), d6 barely moves 0→0.001 (slow!)</T>
            <T color="#80e8a5" style={{ marginTop: 4 }}>Position 2: d0 goes 0.841→0.909, d6 goes 0.001→0.002</T>
          </Box>
        )}
        {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 2.6 Fast vs Slow ═══════
  const Ch2_6 = () => {
    // Counting grid data
    const countingRows = [
      { pos: 0, digits: [0, 0, 0] }, { pos: 1, digits: [0, 0, 1] }, { pos: 2, digits: [0, 0, 2] },
      { pos: 9, digits: [0, 0, 9] }, { pos: 10, digits: [0, 1, 0] }, { pos: 11, digits: [0, 1, 1] },
      { pos: 99, digits: [0, 9, 9] }, { pos: 100, digits: [1, 0, 0] }, { pos: 101, digits: [1, 0, 1] },
    ];
    const digitColors = [C.purple, C.orange, C.yellow];
    const digitLabels = ["Hundreds (slow)", "Tens (medium)", "Ones (fast)"];

    const Digit = ({ value, colIdx, highlight = false }) => (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: 6, fontFamily: "monospace", fontSize: 22, fontWeight: 800,
        color: digitColors[colIdx], background: `${digitColors[colIdx]}${highlight ? '25' : '10'}`,
        border: `1.5px solid ${digitColors[colIdx]}${highlight ? '60' : '20'}`,
        transition: "all 0.2s",
      }}>{value}</span>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Step 0: How you count */}
        {sub >= 0 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color="#80deea" bold center size={20}>Think about how you count: ones, tens, hundreds.</T>
            <T color="#80deea" style={{ marginTop: 4 }}>Each column changes at a different speed:</T>
          </Box>
        )}

        {sub >= 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", width: "100%" }}>
            {/* Column labels */}
            <div style={{ display: "grid", gridTemplateColumns: "52px repeat(3, 1fr)", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <span></span>
              {digitLabels.map((lbl, i) => (
                <T key={i} color={digitColors[i]} bold size={14} center>{lbl}</T>
              ))}
            </div>
            {/* Rows */}
            {countingRows.map(({ pos, digits }, ri) => {
              const prevDigits = ri > 0 ? countingRows[ri - 1].digits : null;
              const showGap = ri === 3 || ri === 6;
              return (
                <div key={ri}>
                  {showGap && <div style={{ textAlign: "center", padding: "4px 0" }}><T color={C.dim} size={14} center>···</T></div>}
                  <div style={{ display: "grid", gridTemplateColumns: "52px repeat(3, 1fr)", gap: 6, marginBottom: 4, alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>pos {pos}</span>
                    {digits.map((d, ci) => {
                      const changed = prevDigits && prevDigits[ci] !== d;
                      return (
                        <div key={ci} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                          <Digit value={d} colIdx={ci} highlight={changed} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sub >= 0 && (
          <div style={{ display: "flex", gap: 6, width: "100%" }}>
            {[
              { label: "Ones", color: C.yellow, desc: "Changes EVERY step" },
              { label: "Tens", color: C.orange, desc: "Changes every 10 steps" },
              { label: "Hundreds", color: C.purple, desc: "Changes every 100 steps" },
            ].map(({ label, color, desc }) => (
              <div key={label} style={{ flex: 1, background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                <T color={color} bold size={16} center>{label}</T>
                <T color={C.dim} size={12} center>{desc}</T>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: What if ONLY ones? */}
        {sub >= 1 && (
          <Box color={C.red} style={{ width: "100%" }}>
            <T color="#ff8a80" bold center>❌ What if you ONLY had the ones column?</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              {[
                { pos: 0, d: 0 }, { pos: 1, d: 1 }, { pos: 2, d: 2 },
                { pos: "...", d: "..." },
                { pos: 9, d: 9 },
                { pos: 10, d: 0, dup: "SAME as pos 0!" },
                { pos: 11, d: 1, dup: "SAME as pos 1!" },
              ].map(({ pos, d, dup }, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                    {pos === "..." ? "" : `pos ${pos}`}
                  </span>
                  {d === "..." ? (
                    <T color={C.dim} size={14}>···</T>
                  ) : (
                    <>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 26, height: 26, borderRadius: 5, fontFamily: "monospace", fontSize: 20, fontWeight: 800,
                        color: dup ? C.red : C.yellow,
                        background: dup ? `${C.red}20` : `${C.yellow}10`,
                        border: `1.5px solid ${dup ? C.red : C.yellow}${dup ? '50' : '20'}`,
                      }}>{d}</span>
                      {dup && <span style={{ fontSize: 16, color: C.red, fontWeight: 700 }}>← {dup}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
              After 10 positions, the ones column <strong>repeats</strong>. Position 0 and position 10 look identical. You can only count to 9. <strong>Stuck.</strong>
            </T>
          </Box>
        )}

        {/* Step 2: What if ONLY hundreds? */}
        {sub >= 2 && (
          <Box color={C.red} style={{ width: "100%" }}>
            <T color="#ff8a80" bold center>❌ What if you ONLY had the hundreds column?</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              {[
                { pos: 0, d: 0, dup: null },
                { pos: 1, d: 0, dup: "SAME!" },
                { pos: 2, d: 0, dup: "SAME!" },
                { pos: "...", d: "..." },
                { pos: 99, d: 0, dup: "still SAME!" },
                { pos: 100, d: 1, dup: "finally changes" },
              ].map(({ pos, d, dup }, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                    {pos === "..." ? "" : `pos ${pos}`}
                  </span>
                  {d === "..." ? (
                    <T color={C.dim} size={14}>···</T>
                  ) : (
                    <>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 26, height: 26, borderRadius: 5, fontFamily: "monospace", fontSize: 20, fontWeight: 800,
                        color: dup === "finally changes" ? C.green : (dup ? C.red : C.purple),
                        background: dup === "finally changes" ? `${C.green}20` : (dup ? `${C.red}15` : `${C.purple}10`),
                        border: `1.5px solid ${dup === "finally changes" ? C.green : (dup ? C.red : C.purple)}40`,
                      }}>{d}</span>
                      {dup && <span style={{ fontSize: 16, color: dup === "finally changes" ? C.green : C.red, fontWeight: 700 }}>← {dup}</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
              Positions 0 through 99 <strong>all look identical</strong> — the hundreds column just shows 0 for all of them. You can't tell neighboring words apart at all.
            </T>
          </Box>
        )}

        {/* Step 3: Combine = magic */}
        {sub >= 3 && (
          <Box color={C.green} style={{ width: "100%" }}>
            <T color="#80e8a5" bold center size={20}>✅ But COMBINE all three columns?</T>
            <T color="#80e8a5" style={{ marginTop: 6 }}>
              Every position from <strong>000 to 999</strong> has a unique combination.
              That's <strong>1000 unique positions</strong> using just 3 digits!
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              {[
                { pos: 0, d: [0, 0, 0] }, { pos: 1, d: [0, 0, 1] },
                { pos: 10, d: [0, 1, 0] }, { pos: 11, d: [0, 1, 1] },
                { pos: 100, d: [1, 0, 0] }, { pos: 101, d: [1, 0, 1] },
              ].map(({ pos, d }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, minWidth: 44, textAlign: "right" }}>pos {pos}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {d.map((v, ci) => <Digit key={ci} value={v} colIdx={ci} />)}
                  </div>
                  <span style={{ fontSize: 14, color: C.green }}>✓ unique</span>
                </div>
              ))}
            </div>
            <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
              The fast column (ones) tells close positions apart (0 vs 1).<br />
              The slow column (hundreds) tells distant positions apart (0 vs 100).<br />
              <strong>Together, every position is unique.</strong>
            </T>
          </Box>
        )}

        {/* Step 4: Connect back to positional encoding */}
        {sub >= 4 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color="#80deea" bold center size={20}>This is EXACTLY what positional encoding does.</T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { left: "Ones column", leftSub: "changes every step, repeats after 10", right: "Fast dimensions (dim 0, 1)", rightSub: "sine wave changes fast, repeats quickly", color: C.yellow },
                { left: "Tens column", leftSub: "changes every 10 steps", right: "Medium dimensions", rightSub: "sine wave at medium speed", color: C.orange },
                { left: "Hundreds column", leftSub: "changes every 100 steps", right: "Slow dimensions (dim 510, 511)", rightSub: "sine wave barely changes", color: C.purple },
              ].map(({ left, leftSub, right, rightSub, color }) => (
                <div key={left} style={{
                  display: "grid", gridTemplateColumns: "1fr 30px 1fr", alignItems: "center",
                  padding: "10px 12px", borderRadius: 8,
                  background: `${color}06`, border: `1px solid ${color}12`,
                }}>
                  <div style={{ textAlign: "right", paddingRight: 8 }}>
                    <div style={{ color, fontWeight: 700, fontSize: 19 }}>{left}</div>
                    <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: "50%",
                    background: `${color}15`, border: `1px solid ${color}30`,
                  }}>
                    <span style={{ color, fontSize: 20, fontWeight: 800 }}>=</span>
                  </div>
                  <div style={{ paddingLeft: 8 }}>
                    <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                    <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,230,118,0.06)", borderRadius: 8, border: `1px solid ${C.green}20` }}>
              <T color="#80e8a5" bold center>Instead of 3 digits (0-9) → 1,000 unique positions</T>
              <T color="#80e8a5" center size={18}>Positional encoding uses 512 dimensions (sine waves -1 to +1)</T>
              <T color="#80e8a5" center size={18}>→ practically <strong>unlimited</strong> unique positions</T>
            </div>
          </Box>
        )}

        {sub >= 5 && (
          <Box color={C.green}>
            <T color="#80e8a5" bold center>
              That's the entire point of fast vs slow. Nothing more, nothing less.<br />
              Different speeds exist so the combination is always unique, no matter how long the sentence is.
            </T>
          </Box>
        )}

        {sub < 5 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ 2.7 Final Addition ═══════
  const Ch2_7 = () => {
    const emb = [0.56, 0.23, -0.11, 0.42, 0.88, -0.33, 0.71, 0.53];
    const pe = [0.841, 0.540, 0.100, 0.995, 0.010, 1.000, 0.001, 1.000];
    const final_ = emb.map((e, i) => (e + pe[i]).toFixed(2));

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center>The addition for "love" at position 1:</T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Embedding", color: C.purple, vals: emb.map(v => v.toFixed(3)) },
                null,
                { label: "Pos Enc (1)", color: C.green, vals: pe.map(v => v.toFixed(3)) },
              ].map((row, i) => row === null ? (
                <T key={i} color={C.green} bold center size={26}>+</T>
              ) : (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: row.color, fontSize: 12, fontWeight: 600, minWidth: 62 }}>{row.label}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {row.vals.map((v, j) => <span key={j} style={{ fontFamily: "monospace", fontSize: 14, color: `${row.color}bb`, width: 40, textAlign: "center" }}>{v}</span>)}
                  </div>
                </div>
              ))}
              <T color={C.yellow} bold center size={26}>=</T>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.yellow, fontSize: 12, fontWeight: 700, minWidth: 62 }}>Final</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {final_.map((v, j) => <span key={j} style={{ fontFamily: "monospace", fontSize: 14, color: C.yellow, fontWeight: 700, width: 40, textAlign: "center", background: `${C.yellow}10`, borderRadius: 3, padding: "2px 0" }}>{v}</span>)}
                </div>
              </div>
            </div>
          </Box>
        )}
        {sub >= 1 && <Box color={C.green}><T color="#80e8a5" bold center>This vector now carries BOTH:</T><T color="#80e8a5">✅ <strong style={{ color: C.purple }}>Meaning</strong> — it mostly represents "love" (embedding dominates)<br />✅ <strong style={{ color: C.green }}>Position</strong> — nudged slightly to encode "I'm at position 1"</T></Box>}
        {sub >= 2 && (
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color="#b8a9ff" bold center>4 reasons this design is genius:</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { n: "1", t: "Bounded", d: "sin/cos always between -1 and +1. Never explodes." },
                { n: "2", t: "Unique", d: "Every position gets a unique pattern across 512 dims." },
                { n: "3", t: "Relative distances", d: "sin(a+b) = linear combo of sin(a),cos(a). Model can learn relative positions." },
                { n: "4", t: "Generalizes", d: "Works for longer sequences than seen in training — sin/cos are smooth and continuous." },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 8px" }}>
                  <span style={{ color: C.purple, fontWeight: 800, fontSize: 18 }}>{n}.</span>
                  <T color={C.mid} size={16}><strong style={{ color: C.purple }}>{t}</strong> — {d}</T>
                </div>
              ))}
            </div>
          </Box>
        )}
        {sub >= 3 && <Box color={C.green}><T color="#80e8a5" bold center>✅ This is what enters the Transformer layers.</T><T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>Next up: <strong>Part 3 — Attention</strong>, the heart of the Transformer!</T></Box>}
        {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ CHAPTER ROUTER ═══════

  // ═══════════════════════════════════════
  // PART 3: ATTENTION — THE HEART
  // ═══════════════════════════════════════

  const Ch3_1 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>What is a Transformer actually doing?</T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>You give it a sentence: <strong>"I love cats"</strong></T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>It needs to understand what each word means <strong>in context</strong>. The word "love" alone could mean many things. But "love" in "I love cats" specifically means "I have affection for cats." The Transformer needs to figure this out.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Step 1: Each word starts as a list of numbers.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>The model has a big dictionary (learned during training) that maps every word to a fixed list of numbers. These numbers capture the word's meaning in isolation.</T>
        </Box>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 1: The Problem ═══════
  const Ch3_2 = () => {
    const [bankIdx, setBankIdx] = useState(0);
    const sentences = [
      { words: ["I", "sat", "by", "the", "river", "bank"], highlight: 5, context: [1, 2, 4], meaning: "edge of a river", color: C.cyan },
      { words: ["I", "deposited", "money", "in", "the", "bank"], highlight: 5, context: [1, 2], meaning: "financial institution", color: C.yellow },
    ];
    const s = sentences[bankIdx];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <Box color={C.red} style={{ width: "100%" }}><T color="#ff8a80" bold center size={20}>Words alone are meaningless. Context is everything.</T><T color="#ff8a80" style={{ marginTop: 6 }}>After embedding, every instance of the same word gets the <strong>exact same vector</strong>. But the same word can mean completely different things depending on surrounding words.</T></Box>}
        {sub >= 1 && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
              {[0, 1].map(i => (<button key={i} onClick={() => setBankIdx(i)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${sentences[i].color}${bankIdx === i ? '60' : '20'}`, background: bankIdx === i ? `${sentences[i].color}15` : "transparent", color: sentences[i].color, fontSize: 18, fontWeight: 600, cursor: "pointer" }}>Sentence {i + 1}</button>))}
            </div>
            <div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
                {s.words.map((w, i) => {
                  const hl = i === s.highlight;
                  const ctx = s.context.includes(i);
                  return (<span key={i} style={{ padding: "6px 10px", borderRadius: 6, fontSize: 21, fontWeight: hl ? 800 : 500, background: hl ? `${s.color}20` : ctx ? `${C.green}10` : "rgba(255,255,255,0.03)", border: `1px solid ${hl ? `${s.color}50` : ctx ? `${C.green}25` : "rgba(255,255,255,0.05)"}`, color: hl ? s.color : ctx ? C.green : C.mid, transition: "all 0.3s" }}>{w}</span>);
                })}
              </div>
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                {s.context.map((ci, i) => (<span key={i} style={{ color: C.green, fontSize: 16 }}>{s.words[ci]} </span>))}
                <span style={{ color: C.dim, fontSize: 16 }}> → tells us "bank" means:</span>
              </div>
              <div style={{ textAlign: "center", padding: "8px", background: `${s.color}10`, borderRadius: 8, border: `1px solid ${s.color}25` }}>
                <T color={s.color} bold center size={21}>"{s.meaning}"</T>
              </div>
            </div>
          </div>
        )}
        {sub >= 2 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center>This isn't just about "bank" — it's about EVERY word.</T>
            <T color="#ffe082" style={{ marginTop: 6 }}>The model has a big dictionary (learned during training) that maps every word to a fixed list of numbers. Take "love": after embedding, "love" always gets the same numbers, no matter what sentence it's in. But "love" in "I love cats" is different from "love" in "love is blind."</T>
            <T color="#ffe082" style={{ marginTop: 6 }}>These numbers capture the word's meaning <strong>in isolation</strong>. It has no idea what words are around it. That's a problem — because we need context.</T>
            <T color="#ffe082" style={{ marginTop: 6 }}>The <strong>goal</strong>: take "love" = [0.2, 0.9, 0.4, -0.1] and transform it into a <strong>NEW</strong> list of numbers that represents "love in the context of I and cats."</T>
          </Box>
        )}
        {sub >= 3 && <Box color={C.green} style={{ width: "100%" }}><T color="#80e8a5" bold center>This is what Attention solves.</T><T color="#80e8a5" style={{ marginTop: 6 }}>It lets each word <strong>look around</strong> at the other words and ask <strong>"which other words are relevant to me?"</strong> and then absorb context — absorbing information from the relevant ones. After attention: "love" in "I love cats" absorbs info from "I" and "cats" → now represents <strong>"affection from me toward cats"</strong>. Same input vector, different output vector depending on context.</T></Box>}
        {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ CH 2: How does a word look at others ═══════
  const Ch3_3 = () => {
    const words = ["The", "cat", "sat", "because", "it", "was", "tired"];
    const [hovered, setHovered] = useState(4);
    const scores = {
      0: [0.1, 0.3, 0.2, 0.1, 0.05, 0.15, 0.1],
      1: [0.15, 0.1, 0.35, 0.05, 0.1, 0.15, 0.1],
      2: [0.05, 0.4, 0.05, 0.1, 0.1, 0.2, 0.1],
      3: [0.05, 0.1, 0.15, 0.05, 0.25, 0.15, 0.25],
      4: [0.05, 0.55, 0.1, 0.05, 0.05, 0.1, 0.1],
      5: [0.05, 0.2, 0.1, 0.05, 0.3, 0.05, 0.25],
      6: [0.05, 0.35, 0.05, 0.1, 0.15, 0.2, 0.1],
    };
    const curScores = scores[hovered] || [];
    const maxScore = Math.max(...curScores);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && <Box color={C.purple} style={{ width: "100%" }}><T color="#b8a9ff" bold center>Think about how YOU read.</T><T color="#b8a9ff" style={{ marginTop: 6 }}>When you see "it" in a sentence, your brain scans for what "it" refers to. You focus on <strong>nouns</strong>, not every word equally. Attention does the same thing — computes a <strong>relevance score</strong> for every other word.</T></Box>}
        {sub >= 1 && (
          <div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
            <T color={C.dim} size={14} center style={{ marginBottom: 8 }}>Click any word to see what it attends to:</T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
              {words.map((w, i) => (<span key={i} onClick={() => setHovered(i)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", background: i === hovered ? `${C.purple}20` : "rgba(255,255,255,0.03)", border: `1.5px solid ${i === hovered ? C.purple : "rgba(255,255,255,0.06)"}`, color: i === hovered ? C.purple : C.mid, fontSize: 21, fontWeight: i === hovered ? 700 : 500 }}>{w}</span>))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {words.map((w, i) => {
                const score = curScores[i] || 0;
                const isMax = score === maxScore;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ minWidth: 70, fontSize: 18, color: isMax ? C.yellow : C.dim, fontWeight: isMax ? 700 : 400, textAlign: "right" }}>{w}</span>
                    <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${score * 100}%`, height: "100%", borderRadius: 4, background: isMax ? `linear-gradient(90deg, ${C.yellow}, ${C.orange})` : `${C.purple}40`, transition: "width 0.4s ease" }} />
                    </div>
                    <span style={{ fontSize: 16, color: isMax ? C.yellow : C.dim, fontWeight: isMax ? 700 : 400, minWidth: 30 }}>{(score * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
            <T color={C.dim} size={14} center style={{ marginTop: 8 }}>When "it" is selected → "cat" gets 55%. The model figures out "it" = "cat".</T>
          </div>
        )}
        {sub >= 2 && <Box color={C.cyan}><T color="#80deea" bold center>But how do we compute these scores mathematically?</T><T color="#80deea">We need a tool for measuring "relevance" between two vectors. Enter: the <strong>dot product</strong> →</T></Box>}
        {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
      </div>
    );
  };

  // ═══════ CH 3: Dot Product ═══════
  const Ch3_4 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Here's the problem.</T>
          <T color={C.orange} style={{ marginTop: 6 }}>We have three lists of numbers (one per word). We need some mathematical operation that computes "how relevant is word A to word B?"</T>
          <T color={C.orange} style={{ marginTop: 6 }}>The tool is the <strong>dot product</strong> — multiply pairs, add them up. Big result = related. Small result = unrelated.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>Given two vectors, multiply pairs and sum:</T>
          <div style={{ margin: "12px 0", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <Tag color={C.cyan}>A = [1, 2, 3]</Tag>
              <Tag color={C.purple}>B = [4, 5, 6]</Tag>
            </div>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <T color={C.dim} size={18} center>Multiply each pair:</T>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "10px 0" }}>
                {[[1,4,4],[2,5,10],[3,6,18]].map(([a, b, r], i) => (
                  <div key={i} style={{ textAlign: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
                    <div><span style={{ color: C.cyan, fontSize: 20 }}>{a}</span><span style={{ color: C.dim, fontSize: 20 }}> × </span><span style={{ color: C.purple, fontSize: 20 }}>{b}</span></div>
                    <div style={{ marginTop: 4, color: C.yellow, fontWeight: 700, fontSize: 22 }}>{r}</div>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={18} center>Sum them up:</T>
              <T color={C.yellow} bold size={29} center>4 + 10 + 18 = 32</T>
            </div>
          </div>
          <T color="#ffe082" size={18}>That's it. Multiply pairs, add them up, get one number.</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center>What does this number mean?</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>It measures <strong>how similar two vectors are in direction</strong>. Think of you and a friend both pointing somewhere:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { dir: "→  →", label: "Both point same way", val: "Large positive", desc: "\"These are similar!\"", color: C.green },
              { dir: "→  ←", label: "Opposite directions", val: "Large negative", desc: "\"These are opposites!\"", color: C.red },
              { dir: "→  ↑", label: "Perpendicular (unrelated)", val: "Close to zero", desc: "\"Nothing in common\"", color: C.dim },
            ].map(({ dir, label, val, desc, color }) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}15` }}>
                <span style={{ fontSize: 22, textAlign: "center", fontFamily: "monospace" }}>{dir}</span>
                <div>
                  <T color={color} bold center size={18}>{label} → {val}</T>
                  <T color={C.dim} size={16}>{desc}</T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 3 && <Box color={C.purple}><T color="#b8a9ff" bold center>But we can't just dot product the raw word numbers directly.</T><T color="#b8a9ff">"I" = pronoun, "love" = verb — their raw meanings aren't similar, but they ARE related (I is the one who loves). We need to compare them on a different basis.</T></Box>}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 4: Why not embeddings directly ═══════
  const Ch3_5 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>We can't just dot product the raw word numbers.</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>In "I love cats": "I" = pronoun, "love" = verb, "cats" = noun. Their raw meanings aren't similar at all — the dot product of "I" and "love" would be low.</T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Tag color={C.red}>"I" = pronoun, self-reference</Tag>
            <Tag color={C.purple}>"love" = verb, emotion</Tag>
          </div>
          <T color="#ff8a80" style={{ marginTop: 10 }}>But they ARE related — "I" is the one who loves! Their <strong>meanings</strong> are different, but their <strong>relationship</strong> is strong. Raw dot product can't capture this.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>We need to compare on a DIFFERENT basis:</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Instead of comparing what words mean, compare what one is <strong>looking for</strong> vs what the other <strong>offers</strong>:</T>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", alignItems: "center", gap: 6 }}>
              <div style={{ textAlign: "right", padding: "10px", borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}20` }}>
                <T color={C.blue} bold center size={18} style={{ textAlign: "right" }}>"love" is LOOKING FOR</T>
                <T color={C.dim} size={16} style={{ textAlign: "right" }}>"who is doing the loving?"</T>
                <T color={C.dim} size={14} style={{ textAlign: "right" }}>(a subject, a person)</T>
              </div>
              <T color={C.yellow} size={26} center>↔</T>
              <div style={{ padding: "10px", borderRadius: 8, background: `${C.orange}10`, border: `1px solid ${C.orange}20` }}>
                <T color={C.orange} bold center size={18}>"I" OFFERS</T>
                <T color={C.dim} size={16}>"I am a subject, a person"</T>
                <T color={C.green} size={14} bold center>→ HIGH MATCH!</T>
              </div>
            </div>
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>Not "what do these words mean?" but "what is one <strong>looking for</strong> vs what does the other <strong>offer</strong>?"</T>
        </Box>
      )}
      {sub >= 2 && <Box color={C.green}><T color="#80e8a5" bold center>That's why we need three separate views of each word →</T></Box>}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 5: Classroom Analogy ═══════
  const Ch3_6 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>Imagine a classroom. 30 students.</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>Student <strong>Riya</strong> has a question: "who has yesterday's notes?"<br />She looks around at everyone.</T>
        </Box>
      )}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Riya */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}25` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.blue}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>👩‍🎓</div>
              <div style={{ flex: 1 }}>
                <T color={C.blue} bold center size={19}>Riya's Question <Tag color={C.blue}>= Query</Tag></T>
                <T color={C.dim} size={16}>"Who has yesterday's notes?"</T>
              </div>
            </div>
            {/* Other students */}
            {[
              { name: "Priya", label: "I know the homework", match: false },
              { name: "Aman", label: "I have yesterday's notes", match: true },
              { name: "Rahul", label: "I know the canteen menu", match: false },
            ].map(({ name, label, match }) => (
              <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: match ? `${C.green}08` : "rgba(255,255,255,0.02)", border: `1px solid ${match ? `${C.green}25` : "rgba(255,255,255,0.05)"}` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: match ? `${C.orange}20` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🧑‍🎓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <T color={match ? C.orange : C.dim} bold center size={18}>{name}'s label <Tag color={C.orange}>= Key</Tag></T>
                  </div>
                  <T color={C.dim} size={16}>"{label}"</T>
                </div>
                <span style={{ fontSize: 18, color: match ? C.green : C.red, fontWeight: 700 }}>{match ? "✓ MATCH" : "✗"}</span>
              </div>
            ))}
            {/* Aman hands over notes */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}25` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.green}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>📦</div>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold center size={19}>Aman hands over the actual notes <Tag color={C.green}>= Value</Tag></T>
                <T color={C.dim} size={16}>Physics equations, dates, diagrams — the real content</T>
              </div>
            </div>
          </div>
        </div>
      )}
      {sub >= 2 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Mapping to attention:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { left: "Riya's question", leftSub: "who has the notes?", right: "Query", rightSub: "\"what am I looking for?\"", color: C.blue, icon: "🔍" },
              { left: "Each student's label", leftSub: "what they can help with", right: "Key", rightSub: "\"what can I be found for?\"", color: C.orange, icon: "🏷️" },
              { left: "Notes handed over", leftSub: "the actual content", right: "Value", rightSub: "\"here's my actual info\"", color: C.green, icon: "📦" },
            ].map(({ left, leftSub, right, rightSub, color, icon }) => (
              <div key={left} style={{
                display: "grid", gridTemplateColumns: "1fr 36px 1fr", alignItems: "center",
                padding: "10px 12px", borderRadius: 8,
                background: `${color}06`, border: `1px solid ${color}12`,
              }}>
                <div style={{ textAlign: "right", paddingRight: 8 }}>
                  <div style={{ color: C.mid, fontWeight: 600, fontSize: 18 }}>{left}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 30, height: 30, borderRadius: "50%",
                  background: `${color}15`, border: `1px solid ${color}30`,
                  fontSize: 20,
                }}>{icon}</div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 6: Every word is both ═══════
  const Ch3_7 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>Here's what confuses people:</T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>In our classroom, every student is BOTH an asker AND an answerer, <strong>simultaneously</strong>.</T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>Riya has a Query (her question), but she ALSO has a Key (what she can offer others) and a Value (her actual info). Aman has a Key and Value, but ALSO has his own Query (maybe he's looking for homework help).</T>
        </Box>
      )}
      {sub >= 1 && (
        <div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
          <T color={C.dim} size={14} center style={{ marginBottom: 6 }}>EVERY student produces ALL THREE:</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { name: "Riya", q: "\"who has notes?\"", k: "\"I know Hindi grammar\"", v: "her Hindi grammar knowledge" },
              { name: "Aman", q: "\"who can help with homework?\"", k: "\"I have yesterday's notes\"", v: "his actual notes content" },
              { name: "Priya", q: "\"who knows the schedule?\"", k: "\"I know the homework\"", v: "her homework answers" },
            ].map(({ name, q, k, v }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 1fr", gap: 6, alignItems: "center" }}>
                <Tag color={C.bright}>{name}</Tag>
                <div style={{ padding: "6px", borderRadius: 6, background: `${C.blue}08`, border: `1px solid ${C.blue}15`, textAlign: "center" }}>
                  <T color={C.blue} size={12} bold center>Query</T>
                  <T color={C.dim} size={11} center>{q}</T>
                </div>
                <div style={{ padding: "6px", borderRadius: 6, background: `${C.orange}08`, border: `1px solid ${C.orange}15`, textAlign: "center" }}>
                  <T color={C.orange} size={12} bold center>Key</T>
                  <T color={C.dim} size={11} center>{k}</T>
                </div>
                <div style={{ padding: "6px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}15`, textAlign: "center" }}>
                  <T color={C.green} size={12} bold center>Value</T>
                  <T color={C.dim} size={11} center>{v}</T>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {sub >= 2 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Same thing happens with words in a Transformer.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>In the sentence "The cat sat because it was tired", every word simultaneously produces a Query, Key, and Value. "cat" asks its own question while also advertising itself and carrying its own information.</T>
        </Box>
      )}
      {sub >= 3 && <Box color={C.green}><T color="#80e8a5" bold center>Each student — and each word — simultaneously asks a question AND advertises itself AND carries information.</T><T color="#80e8a5" size={18}>But why do we need Key and Value to be <strong>separate</strong>? Why can't they be the same thing?</T></Box>}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 7: Why K ≠ V (Restaurant analogy) ═══════
  const Ch3_8 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Think about ordering food at a restaurant.</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.orange}08`, border: `1px solid ${C.orange}18` }}>
              <span style={{ fontSize: 34, flexShrink: 0 }}>📋</span>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold center size={19}>The menu description <Tag color={C.orange}>= Key</Tag></T>
                <T color={C.dim} size={18} style={{ marginTop: 4 }}>"Paneer Tikka Masala — rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"</T>
                <T color={C.orange} size={16} style={{ marginTop: 4 }}>This helped you <strong>decide</strong> — yes, this matches what I'm craving. It's optimized for <strong>matching</strong> your preference (your Query) to the right dish.</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}18` }}>
              <span style={{ fontSize: 34, flexShrink: 0 }}>🍛</span>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold center size={19}>The actual food on your plate <Tag color={C.green}>= Value</Tag></T>
                <T color={C.dim} size={18} style={{ marginTop: 4 }}>The smoky charred paneer cubes, the creamy gravy, the aroma, the nourishment</T>
                <T color={C.green} size={16} style={{ marginTop: 4 }}>This is the <strong>actual content</strong> you receive. What you actually consume.</T>
              </div>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>If Key and Value were the same thing:</T>
          <div style={{ marginTop: 8, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 34 }}>🍽️</span>
            <T color="#ff8a80" style={{ marginTop: 6 }}>The waiter brings a plate with the words:<br /><em style={{ color: C.dim }}>"rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"</em><br />printed on it.</T>
            <T color={C.red} bold center style={{ marginTop: 6 }}>That's useless! You wanted the ACTUAL FOOD, not the description.</T>
          </div>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>Now let's connect this back to the Transformer.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>Take the sentence: "The cat sat because <strong>it</strong> was tired." The word "it" needs to find what it refers to. It finds "cat". Now:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>📋</span>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold center size={18}>"cat"'s Key <span style={{ color: C.dim, fontWeight: 400 }}>(the menu description)</span></T>
                <T color={C.dim} size={16} style={{ marginTop: 2 }}>Encodes: "I'm a noun, I'm a subject, I'm animate" — this is what helped "it" <strong>find</strong> "cat" in the first place. Optimized for matching.</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>🍛</span>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold center size={18}>"cat"'s Value <span style={{ color: C.dim, fontWeight: 400 }}>(the actual food)</span></T>
                <T color={C.dim} size={16} style={{ marginTop: 2 }}>Carries: rich semantic content — small, furry, four-legged, alive, domesticated — this is the <strong>actual information</strong> that "it" absorbs after finding the match.</T>
              </div>
            </div>
          </div>
          <T color="#80deea" size={18} bold center style={{ marginTop: 10 }}>Key helped "it" FIND "cat" (menu description). Value is what "it" actually GOT from "cat" (the actual food).</T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 8: How QKV are created ═══════
  const Ch3_9 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>So far, Q, K, V are just concepts in our head.</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>We know each word needs:</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            <T color={C.blue} size={18}>🔍 Query — "what am I looking for?"</T>
            <T color={C.orange} size={18}>🏷️ Key — "what do I offer?"</T>
            <T color={C.green} size={18}>📦 Value — "what info do I carry?"</T>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>But each word starts as just <strong>one</strong> list of numbers — its embedding. For example:</T>
          <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.mid} size={18} mono>"love" = [0.2, 0.9, 0.4, -0.1]</T>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>That's ONE list. We need THREE different lists from it (Query, Key, Value). How do you get three different things from one thing?</T>
          <T color="#b8a9ff" bold center style={{ marginTop: 6 }}>You <strong>transform</strong> it three different ways. And the tool for each transformation is: a <strong>grid of numbers</strong>.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>What IS this "grid of numbers"?</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>It's called a <strong>W matrix</strong> (W = "weights"). But don't let the name scare you. It's just a <strong>table of numbers</strong>. Like a spreadsheet. Rows and columns filled with numbers:</T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8, overflowX: "auto" }}>
            <T color={C.dim} size={14} center style={{ marginBottom: 4 }}>Example: a W grid might look like this (tiny version):</T>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, maxWidth: 300, margin: "0 auto" }}>
              {[0.02, -0.15, 0.31, 0.08, 0.41, 0.07, -0.22, -0.19, -0.09, 0.33, 0.14, 0.27, 0.18, -0.05, 0.42, 0.11].map((v, i) => (
                <div key={i} style={{ textAlign: "center", padding: "4px", borderRadius: 3, background: `${v > 0 ? C.blue : C.red}08`, fontFamily: "monospace", fontSize: 14, color: C.mid }}>{v.toFixed(2)}</div>
              ))}
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>That's it. Just numbers in a grid. When you multiply a word's embedding by this grid, you get a new, smaller list of numbers — the Query (or Key, or Value, depending on which grid).</T>
          <T color="#ffe082" size={18} style={{ marginTop: 6 }}><strong>Multiply input by a table → get an output.</strong> Nothing more complicated than that.</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Think of it like a photo with three filters.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>You have a photo of a person. You want three different views:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { view: "View 1", highlight: "highlight only the eyes", what: "→ captures where the person is looking", c: C.blue },
              { view: "View 2", highlight: "highlight only the nose", what: "→ captures the nose shape", c: C.orange },
              { view: "View 3", highlight: "highlight only the mouth", what: "→ captures the expression", c: C.green },
            ].map(({ view, highlight, what, c }) => (
              <div key={view} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${c}08`, border: `1px solid ${c}15` }}>
                <T color={c} bold center size={18}>{view}:</T>
                <T color={C.mid} size={16}>{highlight}</T>
                <T color={C.dim} size={14}>{what}</T>
              </div>
            ))}
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>How do you create these views? You apply three different <strong>filters</strong>. Each filter is a grid of numbers that, when multiplied with the photo, produces a different view.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>That's EXACTLY what W_Q, W_K, W_V are. They're three grids of numbers (filters).</T>
          <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.mid} size={18} mono>Word embedding: [1.0, 0.5, -0.3, 0.8] &nbsp; ← the "photo"</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                { g: "Grid 1 (W_Q):", d: "a 4×2 grid of numbers", f: "filter for \"what am I looking for?\"", c: C.blue },
                { g: "Grid 2 (W_K):", d: "a 4×2 grid of numbers", f: "filter for \"what do I offer?\"", c: C.orange },
                { g: "Grid 3 (W_V):", d: "a 4×2 grid of numbers", f: "filter for \"what info do I carry?\"", c: C.green },
              ].map(({ g, d, f, c }) => (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 4, background: `${c}06` }}>
                  <T color={c} bold center size={14}>{g}</T>
                  <T color={C.dim} size={12}>{d}</T>
                  <T color={C.dim} size={12}>← {f}</T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>When you multiply the embedding by Grid 1, you get the <strong>Query</strong> — a 2-number list representing "what this word is looking for."</T>
          <T color="#80deea" style={{ marginTop: 4 }}>When you multiply the SAME embedding by Grid 2, you get the <strong>Key</strong> — a 2-number list representing "what this word can be found for."</T>
          <T color="#80deea" style={{ marginTop: 4 }}>When you multiply the SAME embedding by Grid 3, you get the <strong>Value</strong> — a 2-number list representing "what actual info this word carries."</T>
          <T color="#80deea" style={{ marginTop: 6 }}><strong>The grids are just tables of numbers. Nothing magical.</strong> Multiply input by a table → get an output.</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>Now let's see the actual three grids in action:</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>Same word embedding goes through three different grids — each produces a different output:</T>
        </Box>
      )}
      {sub >= 4 && (
        <div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <Tag color={C.bright}>"love" embedding = [0.2, 0.9, 0.4, -0.1, ..., 0.3]</Tag>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>512 numbers representing "love" (we'll use this exact word in our full computation later)</T>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <T color={C.dim} size={26}>↓ multiply by 3 different grids ↓</T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { filter: "Grid 1: W_Q", role: "Query", emphasis: "\"what this word NEEDS from others\"", result: "64 numbers", color: C.blue, icon: "🔍" },
              { filter: "Grid 2: W_K", role: "Key", emphasis: "\"what this word can be MATCHED on\"", result: "64 numbers", color: C.orange, icon: "🏷️" },
              { filter: "Grid 3: W_V", role: "Value", emphasis: "\"what useful INFO this word carries\"", result: "64 numbers", color: C.green, icon: "📦" },
            ].map(({ filter, role, emphasis, result, color, icon }) => (
              <div key={role} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}18` }}>
                <span style={{ fontSize: 29, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <T color={color} bold center size={18}>{filter}</T>
                    <T color={C.dim} size={14}>→ produces</T>
                    <Tag color={color}>{role}</Tag>
                  </div>
                  <T color={C.dim} size={16} style={{ marginTop: 2 }}>Emphasizes: {emphasis}</T>
                  <T color={C.dim} size={14}>Output: {result}</T>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {sub >= 5 && <Box color={C.yellow}><T color="#ffe082" bold center>Same input (embedding), three different outputs depending on which grid you use.</T><T color="#ffe082" size={18}>Each grid is 512×64 = 32,768 numbers. But where do these numbers come from?</T></Box>}
      {sub < 5 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 9: Learned during training ═══════
  const Ch3_10 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Where did those numbers in the grids come from?</T>
          <T color={C.orange} style={{ marginTop: 6 }}>This is training.</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>Day 1:</T>
          <T color="#ff8a80" style={{ marginTop: 4 }}>The grids are filled with <strong>random numbers</strong>. The model is terrible. It computes garbage Q, K, V → garbage attention → garbage predictions.</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082">The model tries to predict the next word in millions of sentences. Every time it gets it wrong, the error signal flows backward and nudges every number in every grid slightly.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>"If this number were 0.3 instead of 0.2, the prediction would have been a little better. OK, change it to 0.3."</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5">After seeing billions of words, the numbers in Grid 1 (W_Q) have been nudged millions of times and have settled into values that produce useful "what am I looking for?" vectors. Grid 2 (W_K) has settled into values that produce useful "what do I offer?" vectors.</T>
          <T color="#80e8a5" bold center style={{ marginTop: 8 }}>Nobody programmed these numbers. They emerged from the nudging process (backpropagation) over billions of examples.</T>
        </Box>
      )}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 10: Trace complete example ═══════
  const Ch3_11 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Sentence: "The cat sat" — let's trace "sat" attending to "cat"</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[{ w: '"The"', v: "[0.1, 0.8, -0.2, 0.5]", c: C.dim }, { w: '"cat"', v: "[0.7, -0.3, 0.6, 0.1]", c: C.purple }, { w: '"sat"', v: "[-0.4, 0.5, 0.2, 0.9]", c: C.cyan }].map(({ w, v, c }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 4, background: `${c}06` }}>
                <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 36 }}>{w}</span>
                <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>Creating Q, K, V for "cat" (via matrix multiplication):</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
              <T color={C.blue} bold center size={18}>Q_cat = embedding × W_Q = [0.4, 0.8]</T>
              <T color={C.dim} size={16}>"cat is looking for words related to actions/verbs"</T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.orange}06` }}>
              <T color={C.orange} bold center size={18}>K_cat = embedding × W_K = [0.9, 0.3]</T>
              <T color={C.dim} size={16}>"I can be found as: a noun, a subject, an animal"</T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}06` }}>
              <T color={C.green} bold center size={18}>V_cat = embedding × W_V = [0.6, -0.2]</T>
              <T color={C.dim} size={16}>Rich semantic content about "cat" — the actual information</T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>"sat" makes its Query:</T>
          <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
            <T color={C.blue} bold center size={18}>Q_sat = embedding × W_Q = [0.2, 0.7]</T>
            <T color={C.dim} size={16}>"Who is performing this action? I'm looking for a subject."</T>
          </div>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>Score = dot product: Q_sat · K_cat</T>
            <T color={C.yellow} size={19} style={{ marginTop: 4 }}>(0.2 × 0.9) + (0.7 × 0.3) = 0.18 + 0.21 = <strong style={{ fontSize: 22 }}>0.39</strong> → HIGH MATCH!</T>
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>"sat"'s question (<em>"who is my subject?"</em>) matched with "cat"'s ad (<em>"I'm a subject noun"</em>). So "sat" pays high attention to "cat" and absorbs cat's <strong>Value</strong> — the actual semantic content.</T>
          <T color="#80deea" size={18} style={{ marginTop: 6 }}>After this, "sat" knows: <strong>"I'm an action being performed by a cat."</strong></T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 11: Google Analogy ═══════
  const Ch3_12 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Another way to see it — Google Search:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "1", label: "Your search query", desc: "\"best pizza near me\"", role: "= Query", color: C.blue, icon: "🔍" },
              { step: "2", label: "Each page's keywords/tags", desc: "\"pizza delivery NYC\", \"pizza recipes\"...", role: "= Key", color: C.orange, icon: "🏷️" },
              { step: "3", label: "Google matches query ↔ keywords", desc: "finds the best-matching pages", role: "= Dot Product", color: C.yellow, icon: "⚡" },
              { step: "4", label: "Matched page's CONTENT", desc: "the actual text you read", role: "= Value", color: C.green, icon: "📦" },
            ].map(({ step, label, desc, role, color, icon }) => (
              <div key={step} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <div style={{ flex: 1 }}><T color={color} bold center size={18}>{label}</T><T color={C.dim} size={16}>{desc}</T></div>
                <Tag color={color}>{role}</Tag>
              </div>
            ))}
          </div>
        </Box>
      )}
      {sub >= 1 && <Box color={C.green}><T color="#80e8a5" bold center>Three analogies, same concept:</T><T color="#80e8a5" style={{ marginTop: 4 }}>🎓 Classroom: question / label / notes<br />🍛 Restaurant: craving / menu description / actual food<br />🔍 Google: search query / page keywords / page content<br /><br />Now let's compute the full attention step by step with real numbers →</T></Box>}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 12–19: Computation steps (same as before but renumbered) ═══════
  const Ch3_13 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Now let's do a FULL end-to-end computation.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>We traced "The cat sat" earlier to understand the concepts. Now we'll compute <strong>every single number</strong> for "I love cats" — the sentence we've been building toward since Chapter 1.</T>
          <T color="#80deea" bold center style={{ marginTop: 10 }}>"I love cats" — embeddings (4 dims for simplicity):</T>
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
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
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
        </Box>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  const Ch3_14 = () => (
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
      {sub >= 1 && (
        <Box color={C.purple} style={{ width: "100%" }}>
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
        </Box>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  const Ch3_16 = () => (
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
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>Each individual term might be small (like 0.3 or 0.5). But when you add up 64 or 512 of them, the total becomes very large. The score grows just because of more dimensions — not because the words are more related.</T>
        </Box>
      )}

      {/* Sub 1: Why big scores are bad — softmax comparison */}
      {sub >= 1 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>Why are big scores a problem?</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>Remember from the last chapter: softmax converts scores to probabilities using e^score. When scores are big, e^big_number becomes ASTRONOMICALLY big. Watch:</T>
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
        </Box>
      )}

      {/* Sub 2: The fix */}
      {sub >= 2 && (
        <Box color={C.green} style={{ width: "100%" }}>
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
        </Box>
      )}

      {/* Sub 3: Why sqrt specifically */}
      {sub >= 3 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>Why √d_k specifically? Why not ÷2 or ÷100?</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>There's a mathematical reason. When Q and K have random values, the dot product's <strong>variance grows proportionally to d_k</strong>. The standard deviation = √d_k. So dividing by √d_k brings the variance back to 1 — normalizing scores to a consistent range no matter the dimension.</T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>In simple terms: √d_k is the <strong>exact right amount</strong> to undo the growth caused by summing d_k terms. Not too much (all scores become equal), not too little (problem remains).</T>
        </Box>
      )}

      {/* Sub 4: Our example scaled */}
      {sub >= 4 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
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
        </Box>
      )}

      {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH: Why Do We Need Softmax? ═══════
  const Ch3_15 = () => (
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
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>Think of it like a budget.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>You have <strong>₹100</strong> to distribute among three friends based on how helpful they were.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>Helpfulness scores: Riya=38, Aman=56, Priya=74</T>
          <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.red} bold center size={18}>❌ Can't give ₹38 + ₹56 + ₹74 = ₹168 total. You only have ₹100.</T>
            <T color={C.dim} size={18} style={{ marginTop: 8 }}>You need to convert scores into <strong>shares of ₹100</strong> — percentages that add up to 100%.</T>
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
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>That's basically what softmax does — convert raw scores into shares that add up to 100%. But with one extra trick...</T>
        </Box>
      )}

      {/* Sub 2: The problem — negative scores */}
      {sub >= 2 && (
        <Box color={C.red} style={{ width: "100%" }}>
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
        </Box>
      )}

      {/* Sub 3: Softmax trick — e^x */}
      {sub >= 3 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>Softmax's trick: make everything positive FIRST.</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>Before dividing, put each score through <strong>e^score</strong> (e ≈ 2.718).</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>The magic property: <strong>no matter what the input is, e^x is ALWAYS positive.</strong></T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { input: "-3", output: "0.05", note: "negative → small POSITIVE", color: C.green },
              { input: "1", output: "2.72", note: "positive → stays positive", color: C.green },
              { input: "5", output: "148.4", note: "large → large positive", color: C.green },
              { input: "-1000", output: "0.0000...tiny", note: "super negative → still positive!", color: C.green },
            ].map(({ input, output, note, color }) => (
              <div key={input} style={{ display: "grid", gridTemplateColumns: "56px 16px 70px 1fr", gap: 6, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${color}06` }}>
                <span style={{ fontFamily: "monospace", color: parseFloat(input) < 0 ? C.red : C.mid, fontSize: 18, textAlign: "right" }}>e^({input})</span>
                <span style={{ color: C.dim, fontSize: 18 }}>=</span>
                <span style={{ fontFamily: "monospace", color: C.green, fontWeight: 700, fontSize: 19 }}>{output}</span>
                <T color={C.dim} size={14}>{note}</T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>Even e^(-1000) is positive. Never negative. Never zero. <strong>Problem solved.</strong></T>
        </Box>
      )}

      {/* Sub 4: Full softmax with negative scores */}
      {sub >= 4 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>Now apply this to our problematic scores [-3, 1, 5]:</T>
          <div style={{ marginTop: 10 }}>
            <T color={C.dim} size={16}>Step 1: e^score for each:</T>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0" }}>
              {[{ s: -3, e: "0.05" }, { s: 1, e: "2.72" }, { s: 5, e: "148.4" }].map(({ s, e }) => (
                <div key={s} style={{ textAlign: "center", padding: "6px 10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
                  <T color={C.dim} size={12}>e^({s})</T>
                  <T color={C.purple} bold center size={20}>{e}</T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={16}>Step 2: sum = 0.05 + 2.72 + 148.4 = <strong style={{ color: C.purple }}>151.17</strong></T>
            <T color={C.dim} size={16} style={{ marginTop: 6 }}>Step 3: divide each by sum:</T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { w: "A (was -3)", val: "0.05/151.17", pct: 0.03, color: C.cyan },
                { w: "B (was 1)", val: "2.72/151.17", pct: 1.8, color: C.orange },
                { w: "C (was 5)", val: "148.4/151.17", pct: 98.2, color: C.yellow },
              ].map(({ w, val, pct, color }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 14, minWidth: 66 }}>{w}</span>
                  <span style={{ color: C.dim, fontSize: 14, minWidth: 76 }}>{val}</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(pct, 0.5)}%`, height: "100%", borderRadius: 5, background: color, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 16, minWidth: 38 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={16} bold center>All positive ✓</T></div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={16} bold center>Sum to 100% ✓</T></div>
            <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08` }}><T color={C.green} size={16} bold center>Ranking preserved ✓</T></div>
          </div>
        </Box>
      )}

      {/* Sub 5: Bonus — amplification, connect to scaling */}
      {sub >= 5 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Bonus: softmax naturally amplifies differences.</T>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
              <T color={C.dim} size={14} center>Original scores</T>
              <T color={C.mid} bold size={19} center>-3, 1, 5</T>
              <T color={C.dim} size={12} center>gap between 1 and 5 = just 4</T>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}><T color={C.dim} size={20}>→</T></div>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.yellow}06` }}>
              <T color={C.dim} size={14} center>After e^x</T>
              <T color={C.yellow} bold size={19} center>0.05, 2.72, 148.4</T>
              <T color={C.dim} size={12} center>gap is now 145!</T>
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>The highest score doesn't just win — it <strong>dominates</strong>. This is good: you WANT the most relevant word to stand out.</T>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}><strong>But</strong> — if scores are too huge (like 12, 18, 25), softmax amplifies TOO aggressively → 99.99% on one word. That's why we <strong>scale first</strong> (previous chapter) to keep scores in a range where softmax amplifies usefully but doesn't go extreme.</T>
        </Box>
      )}

      {/* Sub 6: Summary */}
      {sub >= 6 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>So softmax is just two steps:</T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
              <span style={{ background: `${C.purple}20`, color: C.purple, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, flexShrink: 0 }}>1</span>
              <div style={{ flex: 1 }}>
                <T color={C.purple} bold center size={19}>e^score for each score</T>
                <T color={C.dim} size={16}>Makes everything positive (no matter how negative the input)</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
              <span style={{ background: `${C.yellow}20`, color: C.yellow, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, flexShrink: 0 }}>2</span>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold center size={19}>Divide by the sum</T>
                <T color={C.dim} size={16}>Makes everything add up to 1 (valid percentages)</T>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>Output: valid percentages (all positive, sum to 100%) that respect the original ranking. But there's one problem we need to solve first — the raw scores can be TOO BIG for softmax to handle well →</T>
        </Box>
      )}

      {sub < 6 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  const Ch3_17 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>Softmax: raw scores → probabilities (sum = 1)</T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.dim} size={18} center>For "I" row: [0.27, 0.40, 0.52]</T>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "10px 0" }}>
              {[{ s: 0.27, e: 1.31 }, { s: 0.40, e: 1.49 }, { s: 0.52, e: 1.68 }].map(({ s, e }, i) => (
                <div key={i} style={{ textAlign: "center" }}><T color={C.dim} size={14}>e^{s}</T><T color={C.pink} bold center size={20}>{e}</T></div>
              ))}
            </div>
            <T color={C.dim} size={18} center>sum = 4.48</T>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              {[{ w: "I", v: "0.29" }, { w: "love", v: "0.33" }, { w: "cats", v: "0.37" }].map(({ w, v }) => (
                <div key={w} style={{ textAlign: "center", padding: "6px 12px", borderRadius: 6, background: `${C.pink}10`, border: `1px solid ${C.pink}20` }}><T color={C.dim} size={14}>{w}</T><T color={C.pink} bold center size={20}>{v}</T></div>
              ))}
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>Full attention weights:</T>
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
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>Each row sums to 1.0. "I" pays 37% attention to "cats", 33% to "love", 29% to itself.</T>
        </Box>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  const Ch3_18 = () => (
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
      {sub >= 1 && <Box color={C.yellow}><T color={C.yellow} bold center>This [0.315, 0.452] is the NEW vector for "I".</T><T color="#ffe082" style={{ marginTop: 4 }}>It's no longer just about "I". It has absorbed context from "love" (33%) and "cats" (37%). It's now a <strong>context-aware representation</strong>. Same happens for every word.</T></Box>}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  const Ch3_19 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 14, padding: "20px", border: `1px solid ${C.yellow}25`, width: "100%" }}>
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Everything above in one line</T>
          <T color={C.yellow} bold size={24} center>Attention(Q, K, V) = softmax( Q×K<sup>T</sup> / √d<sub>k</sub> ) × V</T>
        </div>
      )}
      {sub >= 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {[
            { f: "Q × Kᵀ", m: "Dot product of every query with every key", r: "= score matrix", c: C.blue },
            { f: "/ √d_k", m: "Scale down to prevent extreme softmax", r: "= manageable scores", c: C.orange },
            { f: "softmax", m: "Convert to probabilities (rows sum to 1)", r: "= attention weights", c: C.pink },
            { f: "× V", m: "Weighted sum of values", r: "= context-aware output", c: C.green },
          ].map(({ f, m, r, c }) => (
            <div key={f} style={{ display: "grid", gridTemplateColumns: "68px 1fr", gap: 10, padding: "8px 12px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12`, alignItems: "center" }}>
              <code style={{ color: c, fontWeight: 700, fontSize: 18 }}>{f}</code>
              <div style={{ flex: 1 }}><T color={C.mid} size={18}>{m}</T><T color={c} size={16} bold center>{r}</T></div>
            </div>
          ))}
        </div>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 18: Why Multi-Head — The Compromise Problem ═══════
  const Ch3_20 = () => (
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
      {sub >= 1 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>But one head produces ONE set of weights — forced to compromise:</T>
          <div style={{ marginTop: 8 }}>
            {[
              { w: "cat", pct: 40, c: C.cyan, note: "got some" },
              { w: "mat", pct: 30, c: C.orange, note: "got some" },
              { w: "last week", pct: 5, c: C.purple, note: "almost NOTHING!" },
              { w: "others", pct: 25, c: C.dim, note: "scattered" },
            ].map(({ w, pct, c, note }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16, color: C.dim, minWidth: 54, textAlign: "right" }}>{w}</span>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: c }} />
                </div>
                <span style={{ fontSize: 16, color: c, fontWeight: 600, minWidth: 28 }}>{pct}%</span>
                <span style={{ fontSize: 12, color: pct <= 5 ? C.red : C.dim }}>{note}</span>
              </div>
            ))}
          </div>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>Temporal info ("last week") got only 5% — almost lost! One head can't focus on all relationships.</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>Solution: give it MULTIPLE heads — like multiple ears.</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>Each head has its OWN W_Q, W_K, W_V, so each asks a DIFFERENT question:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { head: 1, label: "subject-verb", q: "\"who is my subject?\"", finds: "cat (70%)", color: C.cyan },
              { head: 2, label: "verb-location", q: "\"where am I happening?\"", finds: "mat (65%)", color: C.orange },
              { head: 3, label: "temporal", q: "\"when am I happening?\"", finds: "week (55%)", color: C.purple },
            ].map(({ head, label, q, finds, color }) => (
              <div key={head} style={{ display: "grid", gridTemplateColumns: "62px 1fr 74px", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 6, background: `${color}06`, border: `1px solid ${color}12` }}>
                <div style={{ flex: 1 }}><T color={color} bold center size={16}>Head {head}</T><T color={C.dim} size={12}>{label}</T></div>
                <T color={C.dim} size={16}>sat asks: {q}</T>
                <T color={color} bold center size={16} style={{ textAlign: "right" }}>→ {finds}</T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>Now NO info is lost. Each head specializes in one relationship and captures it fully.</T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 19: The Split ═══════
  const Ch3_21 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>One set of three grids can only ask ONE type of question.</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>"love"'s Query can point in only one direction. So we create 8 sets of three grids. Each set starts with different random numbers → gets nudged differently during training → ends up asking a different type of question.</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>We DON'T run the full thing 8 times — that would be 8× the computation. Instead, we <strong>split the dimensions</strong>:</T>
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
      {sub >= 1 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>We create 8 sets of three grids.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>Each set has its own W_Q, W_K, W_V — all starting with different random numbers, all trained independently:</T>
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
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>Same input embedding goes into ALL 8 sets. Each set's different grids extract different aspects — 8 different Q, K, V outputs, 8 different attention patterns. Each head produces its own output — a list of numbers per word.</T>
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
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
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>Same input, 8 perspectives. The W matrices create these "tunings" — learned during training.</T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 20: Inside Each Head ═══════
  const Ch3_22 = () => (
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
              &nbsp;&nbsp;scores₁ = Q₁ × K₁ᵀ / √64 <span style={{ color: C.dim }}>[3×3 score matrix]</span><br />
              &nbsp;&nbsp;weights₁ = softmax(scores₁) <span style={{ color: C.dim }}>[3×3 attention weights]</span><br />
              &nbsp;&nbsp;output₁ = weights₁ × V₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>Same runs for all 8 heads. Each produces [3 words × 64 dims].</T>
        </Box>
      )}
      {sub >= 1 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center>The KEY: each head's attention weights are DIFFERENT.</T>
          <T color={C.dim} size={18} style={{ marginTop: 4 }}>Because their W_Q, W_K, W_V are different. Here's what "sat" sees in each head:</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { head: 1, label: "subject-verb", c: C.cyan, bars: [{ w: "cat", p: 70 }, { w: "mat", p: 8 }, { w: "week", p: 5 }, { w: "others", p: 17 }] },
              { head: 2, label: "verb-location", c: C.orange, bars: [{ w: "cat", p: 10 }, { w: "mat", p: 65 }, { w: "week", p: 8 }, { w: "others", p: 17 }] },
              { head: 3, label: "temporal", c: C.purple, bars: [{ w: "cat", p: 8 }, { w: "mat", p: 7 }, { w: "week", p: 55 }, { w: "others", p: 30 }] },
            ].map(({ head, label, c, bars }) => (
              <div key={head} style={{ padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}>
                <T color={c} bold center size={16}>Head {head} — "sat" attends to: ({label})</T>
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
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>Each head found what the single head missed. Head 3 got "last week" at 55% — single head only gave it 5%.</T>
        </Box>
      )}
      {sub < 1 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 21: Concat + W_O ═══════
  const Ch3_23 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Step 7 — outputs are separate */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>The outputs are separate — we need to combine them.</T>
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
          <T color="#ffe082" style={{ marginTop: 6 }}>One long list — 512 numbers. But there's a problem.</T>
        </Box>
      )}

      {/* Sub 1: Step 8 — Sealed envelopes */}
      {sub >= 1 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>The problem — these results are like 8 sealed envelopes.</T>
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
          <T color="#ff8a80" style={{ marginTop: 8 }}>Now someone tapes all 8 envelopes together in a row. That's concatenation — they're physically together, but each envelope is still <strong>sealed</strong>. The information inside Envelope 1 has NO idea what Envelope 2 says.</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>If your boss asks: "Give me a one-line summary of this case" — you can't answer from any single envelope. Envelope 1 only knows about the suspect. Envelope 2 only knows about the location. Nobody has the full picture.</T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>That's exactly the problem with just concatenating. The numbers in positions 1-2 (from Head 1) only know about subject-verb. The numbers in positions 3-4 (from Head 2) only know about verb-object. They're taped together but not talking.</T>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 6 }}>We need someone to open ALL the envelopes, read everything, and write one combined summary.</T>
        </Box>
      )}

      {/* Sub 2: Step 9 — W_O */}
      {sub >= 2 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>W_O — the person who opens all the envelopes.</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>W_O is one more grid of numbers. Just like W_Q, W_K, W_V — it's a table of numbers. Nothing new or special about what it IS. It works the same way: multiply input by a grid → get an output.</T>
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
        </Box>
      )}

      {/* Sub 3: Step 10 — W_O training */}
      {sub >= 3 && (
        <Box color={C.orange} style={{ width: "100%" }}>
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
              <div key={n} style={{ display: "flex", gap: 6, alignItems: "flex-start", padding: "5px 8px", borderRadius: 5, background: `${c}06` }}>
                <span style={{ color: c, fontWeight: 800, fontSize: 16, minWidth: 16 }}>{n}.</span>
                <T color={C.mid} size={16}>{text}</T>
              </div>
            ))}
          </div>
          <T color={C.orange} style={{ marginTop: 8 }}>The training discovers the best way to combine the 8 heads' findings into one useful output. Nobody programs this — it emerges from training.</T>
        </Box>
      )}

      {/* Sub 4: Connect back to I love cats */}
      {sub >= 4 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Back to "I love cats" — what W_O does for "love":</T>
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
          <T color={C.orange} size={18} style={{ marginTop: 6 }}>This is what we set out to do in Chapter 1 — transform "love" from an isolated word into a context-aware representation.</T>
        </Box>
      )}

      {/* Sub 5: Why W_O is learned, not hardcoded */}
      {sub >= 5 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>W_O is LEARNED — not hardcoded.</T>
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
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>Nobody programs what to combine. W_O's 512×512 = 262,144 weights are all learned through backpropagation — the same process from chapters 1.3–1.9.</T>
        </Box>
      )}

      {sub < 5 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 22: Why 8 + Params + Big Picture ═══════
  const Ch3_24 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Why 8 heads? Why not 4 or 16?</T>
          <T color={C.orange} style={{ marginTop: 6 }}>There's a tradeoff — the total dims (512) get divided equally:</T>
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
      {sub >= 1 && (
        <Box color={C.green} style={{ width: "100%" }}>
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
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>Surprising: same count as single-head!</T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>Single-head with 512-dim Q, K, V needs 512×512 per matrix = same total. Multi-head doesn't add parameters — it <strong>reorganizes them into 8 independent groups</strong>. Same budget, much better results.</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>How does this scale in a full model?</T>
          <T color="#80deea" style={{ marginTop: 6 }}>We learned that one attention layer has ~1 million parameters. A Transformer stacks <strong>multiple layers</strong> on top of each other — each layer refines the context further:</T>
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
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>More layers = deeper understanding. Each layer's attention asks different questions about the same words, building increasingly rich representations. Same mechanism we learned — just stacked.</T>
        </Box>
      )}
      {sub < 3 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 23: Is W_O constant? ═══════
  const Ch3_25 = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>Is W_O constant? Does it change?</T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>There are two phases in a model's life: <strong>training</strong> and <strong>usage</strong>. The answer depends on which phase you're asking about.</T>
        </Box>
      )}
      {sub >= 1 && (
        <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
          <Box color={C.orange} style={{ flex: 1 }}>
            <T color={C.orange} bold center size={18}>During training: W_O changes.</T>
            <T color={C.orange} size={16} style={{ marginTop: 6 }}>Every time the model sees a new batch of sentences and makes prediction errors, every number in W_O gets nudged slightly. Over billions of examples, W_O gradually improves. It changes millions of times during training — getting better and better at blending heads.</T>
          </Box>
          <Box color={C.green} style={{ flex: 1 }}>
            <T color="#80e8a5" bold center size={18}>After training is done: W_O is FROZEN. Completely constant.</T>
            <T color="#80e8a5" size={16} style={{ marginTop: 6 }}>Once training is complete, the model is saved to a file. W_O's numbers are written to disk and they NEVER change again. When you use the model (send it a sentence), W_O is loaded from disk and used as-is.</T>
          </Box>
        </div>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <div style={{ padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.mid} size={18} style={{ lineHeight: 2.2 }}>
              You type "I love cats" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
              You type "dogs are great" &nbsp;&nbsp;&nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
              You type "the weather is nice" → model uses the <strong style={{ color: C.green }}>SAME</strong> W_O<br />
              Someone else types anything &nbsp;→ model uses the <strong style={{ color: C.green }}>SAME</strong> W_O
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>The SAME grid of numbers. Every input. Every user. Every sentence. Forever (until someone retrains the model).</T>
        </Box>
      )}
      {sub >= 3 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
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
        </Box>
      )}
      {sub >= 4 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>Why do different sentences get different results if the grids are constant?</T>
          <T color={C.blue} style={{ marginTop: 6 }}>Because the grids are like a <strong>coffee machine</strong>. The machine (W_O) is always the same. But the coffee beans you put in (your sentence) are different each time. Same machine + different beans = different coffee.</T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.red}06` }}><T color={C.mid} size={16}>Same W_O × "I love cats" embeddings <strong style={{ color: C.red }}>= one output</strong></T></div>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.purple}06` }}><T color={C.mid} size={16}>Same W_O × "dogs are great" embeddings <strong style={{ color: C.purple }}>= completely different output</strong></T></div>
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>The grids don't need to change. They've already learned the GENERAL SKILL of "how to blend heads" or "how to extract queries." That skill works on ANY input. Just like a coffee machine doesn't need to be rebuilt for each type of bean — it already knows how to grind and brew.</T>
        </Box>
      )}
      {sub < 4 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );

  // ═══════ CH 24: The Complete Picture ═══════
  const Ch3_26 = () => (
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
      {sub >= 1 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff">Every single "grid" in this process (W_Q, W_K, W_V, W_O) is just a table of numbers that started random, got nudged into useful values during training, and then <strong>stays frozen forever after</strong>. They all work the same way — multiply input by grid, get output. The only difference is WHAT each grid was trained to do:</T>
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
        </Box>
      )}
      {sub >= 2 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold size={21} center>The grids are the machine. Your sentence is the raw material.</T>
          <T color="#80deea" center style={{ marginTop: 6 }}>Same machine, different raw material, different product — every single time.</T>
        </Box>
      )}
      {sub < 2 && <SubBtn onClick={() => setSub(s => s + 1)} />}
    </div>
  );



  // ═══════ TABLE OF CONTENTS ═══════
  const ChTOC = () => {
    const [expanded, setExpanded] = useState(null);
    const parts = [
      { num: 1, name: "Neural Network Foundations", color: C.red, desc: "What neural networks are, how they learn, forward/backward pass" },
      { num: 2, name: "The Road to Transformers", color: C.orange, desc: "CNN → RNN → why RNN fails → the Transformer arrives" },
      { num: 3, name: "Transformer Input Pipeline", color: C.cyan, desc: "Architecture overview, embeddings, positional encoding" },
      { num: 4, name: "Attention — Understanding Q, K, V", color: C.purple, desc: "Why attention works, Query/Key/Value concepts, analogies" },
      { num: 5, name: "Attention — The Full Computation", color: C.green, desc: "Step-by-step math, multi-head, W_O, the complete picture" },
    ];
    const partStart = { 1: 1, 2: 11, 3: 15, 4: 23, 5: 34 };
    const partChapters = {};
    chapters.forEach((c, i) => { if (c.part > 0) { if (!partChapters[c.part]) partChapters[c.part] = []; partChapters[c.part].push({ ...c, idx: i }); } });

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold size={21} center>Your roadmap to understanding AI from scratch.</T>
          <T color="#b8a9ff" center style={{ marginTop: 6 }}>{chapters.length - 1} chapters. Zero prerequisites. Every concept built on the one before it.</T>
        </Box>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {parts.map(p => {
            const isOpen = expanded === p.num;
            const chs = partChapters[p.num] || [];
            return (
              <div key={p.num} style={{ borderRadius: 10, background: `${p.color}06`, border: `1px solid ${isOpen ? `${p.color}35` : `${p.color}15`}`, overflow: "hidden", transition: "all 0.3s" }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : p.num)}
                  style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ background: `${p.color}20`, color: p.color, fontWeight: 800, fontSize: 21, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.num}</span>
                    <div>
                      <T color={p.color} bold size={18}>{p.name}</T>
                      {!isOpen && <T color={C.dim} size={12}>{p.desc}</T>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <T color={C.dim} size={12}>{chs.length} {chs.length === 1 ? "Chapter" : "Chapters"}</T>
                    <span style={{ color: C.dim, fontSize: 14, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <T color={C.dim} size={12} style={{ marginBottom: 4, paddingLeft: 40 }}>{p.desc}</T>
                    {chs.map(c => (
                      <div
                        key={c.id}
                        onClick={(e) => { e.stopPropagation(); goTo(c.idx); }}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 40px", borderRadius: 6, cursor: "pointer", background: "transparent", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = `${p.color}10`}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ color: `${p.color}88`, fontSize: 14, fontWeight: 700, minWidth: 24 }}>{c.id}</span>
                        <T color={C.mid} size={16}>{c.title}</T>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <T color={C.dim} size={16} center style={{ marginTop: 4 }}>Tap any part to expand, tap a chapter to jump there.</T>
      </div>
    );
  };

  const allCh = [ChTOC, Ch1_1, Ch1_2, Ch1_3, Ch1_4, Ch1_ReLU, Ch1_5, Ch1_6, Ch1_7, Ch1_8, Ch1_9, Ch1_10, Ch1_11, Ch1_12, Ch1_13, Ch2_1, Ch2_2, Ch2_3, Ch2_4, Ch2_5, Ch2_6, Ch2_7, Ch3_1, Ch3_2, Ch3_3, Ch3_4, Ch3_5, Ch3_6, Ch3_7, Ch3_8, Ch3_12, Ch3_9, Ch3_10, Ch3_11, Ch3_13, Ch3_14, Ch3_15, Ch3_16, Ch3_17, Ch3_18, Ch3_19, Ch3_20, Ch3_21, Ch3_22, Ch3_23, Ch3_24, Ch3_25, Ch3_26];
  const Current = allCh[ch];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "14px 18px 80px",
    }}>
      <h1 style={{
        fontSize: 29, fontWeight: 800, margin: "0 0 2px", textAlign: "center",
        background: "linear-gradient(135deg, #ff6b6b, #a78bfa, #00e676, #00b8d4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Learn AI</h1>
      <T color={C.dim} size={14} center>The complete visual guide to understanding AI — from scratch</T>

      {/* Progress */}
      <div style={{ display: "flex", gap: 1.5, margin: "14px 0 6px", width: "100%", maxWidth: 800 }}>
        {chapters.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            flex: 1, height: 4, borderRadius: 2, cursor: "pointer",
            background: i === ch ? "linear-gradient(90deg, #a78bfa, #00e676)"
              : i < ch ? `${C.purple}45` : "rgba(255,255,255,0.05)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
      {ch > 0 ? (
        <>
          <T color={C.dim} size={12} center>
            Chapter {chapters[ch].id} — Part {chapters[ch].part}: {partNames[chapters[ch].part]}
          </T>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 14px", color: C.bright, textAlign: "center" }}>
            {chapters[ch].title}
          </h2>
        </>
      ) : (
        <T color={C.dim} size={14} center style={{ margin: "6px 0 10px" }}>{Object.keys(partNames).length - 1} parts · {chapters.length - 1} chapters · tap to begin</T>
      )}

      <div style={{
        width: "100%", maxWidth: 840,
        opacity: (fade && subFade) ? 1 : 0,
        transform: fade ? (subFade ? "translateY(0)" : "translateY(4px)") : "translateY(12px)",
        transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <Current />
      </div>

      {/* Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 10,
        padding: "10px 14px 14px",
        background: "linear-gradient(transparent, #08080d 30%)",
      }}>
        <button onClick={() => goTo(ch - 1)} disabled={ch === 0} style={{
          padding: "9px 18px", borderRadius: 10,
          border: `1px solid ${ch === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)"}`,
          background: ch === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)",
          color: ch === 0 ? "rgba(255,255,255,0.12)" : "#fff",
          cursor: ch === 0 ? "default" : "pointer", fontSize: 18, fontWeight: 600,
        }}>← Prev Chapter</button>
        <button onClick={() => goTo(ch + 1)} disabled={ch === chapters.length - 1} style={{
          padding: "9px 18px", borderRadius: 10, border: "none",
          background: ch === chapters.length - 1 ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, #6c5ce7, #a855f7)",
          color: ch === chapters.length - 1 ? "rgba(255,255,255,0.12)" : "#fff",
          cursor: ch === chapters.length - 1 ? "default" : "pointer", fontSize: 18, fontWeight: 600,
          boxShadow: ch < chapters.length - 1 ? "0 4px 14px rgba(108,92,231,0.3)" : "none",
        }}>Next Chapter →</button>
      </div>
    </div>
  );
}
