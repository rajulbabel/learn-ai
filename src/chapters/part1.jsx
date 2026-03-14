import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

export const Ch1_1 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.red}><T color={C.red} bold center>Think of it like a factory assembly line:</T><T>Raw material (input) → processing stations (layers) → finished product (output).</T></Box>}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 14, padding: "18px 12px", border: `1px solid ${C.border}`, width: "100%", display: "flex", justifyContent: "center" }}>
        <svg width="380" height="200" viewBox="0 0 380 200" style={{ maxWidth: "100%", overflow: "visible" }}>

          {/* Positions - input: x=55, hidden: x=190, output: x=325 */}
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
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow}><T color={C.yellow} bold center>Each connection has a "weight" (a number).</T><T>Training = finding the right weights so predictions become accurate. That's ALL learning is.</T></Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple}><T color={C.purple} bold center>At each neuron:</T><T><code style={{ background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3, fontSize: 18 }}>output = activation( Σ(input × weight) + bias )</code><br /><br /><span style={{ display: "block", paddingLeft: 8, marginTop: 4 }}>1. Multiply each input by its weight<br />2. Sum them all up<br />3. Add a bias (a shift)<br />4. Pass through activation function (e.g. ReLU: if negative → 0, if positive → keep)</span></T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.2 FFNN ═══════
export const Ch1_2 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.yellow}><T color={C.yellow} bold center>The simplest neural network - data flows in ONE direction.</T><T>Input → Hidden layers → Output. No loops, no memory.</T></Box>}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
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
      </div></Reveal>
    <Reveal when={sub >= 2}><><Box color={C.green}><T color="#80cbc4" bold center>✅ Good for:</T><T color="#80cbc4">Simple classification - spam/not spam, cat/dog, approve/reject.</T></Box><Box color={C.red}><T color="#ff8a80" bold center>❌ Fatal limitations:</T><T color="#ff8a80"><strong>Fixed input size</strong> - sentences have variable length. Can't handle that.<br /><strong>No order</strong> - "dog bites man" = "man bites dog" to this network.</T></Box></></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.3 What is Learning ═══════
export const Ch1_3 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center>Imagine predicting sales from marketing budget: <strong>y = mx + c</strong>.</T><T color="#80deea"><strong>m</strong> = weight (how much budget affects sales), <strong>c</strong> = bias (baseline sales). Learning = finding the best m and c.</T></Box>}
    <Reveal when={sub >= 1}><Box color={C.purple}><T color={C.purple} bold center size={20}>A neural network starts DUMB.</T><T>When you first create a network, all its internal numbers (called <strong>weights</strong> and <strong>biases</strong>) are set to <strong>random values</strong>. It knows nothing. It makes garbage predictions.</T></Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.green}><T color="#80e8a5" bold center>This whole process is called "Backpropagation + Gradient Descent".</T><T color="#80e8a5">But what are weights and biases? Let's understand them first →</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.4 Weights & Biases ═══════
export const Ch1_4 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
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
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Bias = a baseline shift</T>
        <T color="#80deea" style={{ marginTop: 6 }}>
          Imagine you're predicting house price from square footage.<br /><br />
          Without bias: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 3 }}>price = sqft × weight</code><br />
          This forces price = 0 when sqft = 0. But even a tiny house has land value!<br /><br />
          With bias: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 3 }}>price = sqft × weight + bias</code><br />
          The bias adds a <strong>base amount</strong> (like land value) regardless of input.
        </T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center>In <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 4px", borderRadius: 2 }}>y = mx + c</code>: weight (m) = the slope, bias (c) = the y-intercept.</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>Weight controls the angle, bias shifts the line up/down.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
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
      </div></Reveal>
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.green}><T color="#80e8a5" bold center>So a neuron is just: multiply, sum, add bias, activate.</T><T color="#80e8a5" center size={18}>The <strong>weights</strong> and <strong>bias</strong> are what the network LEARNS. Everything else is fixed math. Now let's see the forward pass →</T></Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.5 ReLU - Activation Functions ═══════
export const Ch1_ReLU = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx;
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

      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 10, padding: "10px", border: `1px solid ${C.border}`, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Graph points={straightLine} color={C.red} title="100 layers without activation = still one straight line" xLabel="input" yLabel="output" />
          </div>
          <T color="#ff8a80" size={16} center style={{ marginTop: 4 }}>No matter how many layers you stack, it always simplifies to y = mx + b. A straight line cannot learn curves. <strong>100 layers = 1 layer.</strong></T>
        </div></Reveal>

      {/* Step 2: ReLU rule */}
      <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
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
        </Box></Reveal>

      {/* Step 3: One neuron with ReLU - bent line */}
      <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>Neuron 1: output = ReLU(input × 1 − 3)</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <Graph points={neuron1} color={C.cyan} title="Neuron 1: flat, then rises (bend at input=3)" xLabel="input" yLabel="output"
              annotations={[{ x: 3, y: 0, text: "bend!", color: C.yellow }]} />
          </div>
          <T color="#80deea" size={16}>Flat at 0 from input 0→3 (ReLU kills the negatives), then rises. That's a <strong>bent line</strong> - NOT straight anymore! The bend happens where the neuron's math crosses zero.</T>
        </Box></Reveal>

      {/* Step 4: Second neuron - different bend */}
      <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>Neuron 2: output = ReLU(input × (−1) + 5)</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <Graph points={neuron2} color={C.purple} title="Neuron 2: slopes down, then flat (bend at input=5)" xLabel="input" yLabel="output"
              annotations={[{ x: 5, y: 0, text: "bend!", color: C.yellow }]} />
          </div>
          <T color="#b8a9ff" size={16}>Different weight and bias = different bend point. This one slopes downward and goes flat. Each neuron's weight & bias control <strong>where</strong> and <strong>how</strong> it bends.</T>
        </Box></Reveal>

      {/* Step 5: ADD them - curve appears! */}
      <Reveal when={sub >= 5}><Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>Now ADD both neurons' outputs together:</T>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <Graph points={combined} color={C.yellow} title="Combined: a VALLEY shape - a curve!" xLabel="input" yLabel="output"
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
          <T color="#ffe082" size={18} style={{ marginTop: 6 }}>Down, then flat, then up. A <strong>valley shape</strong> - a curve - made from just two bent lines added together. <strong>No single straight line can do this.</strong></T>
        </Box></Reveal>

      {/* Step 6: Scale up - the big picture */}
      <Reveal when={sub >= 6}><Box color={C.green} style={{ width: "100%" }}>
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
        </Box></Reveal>

      <Reveal when={sub >= 7}><Box color={C.blue} style={{ width: "100%" }}>
          <T color="#42a5f5" bold center>A brief history of activation functions:</T>
          <T color="#42a5f5" style={{ marginTop: 6 }}>Sigmoid → vanishing gradients in deep networks → ReLU (max(0,x)) → Modern: SWIGLU in GPT-4/LLaMA. The function changes; the purpose stays: add non-linearity so stacking layers isn't just y = big_mx + big_c.</T>
        </Box></Reveal>

      {sub < 7 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
    </div>
  );
};

// ═══════ 1.5 Forward Pass ═══════
export const Ch1_5 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center size={20}>Forward Pass = feeding input through the network to get a prediction.</T><T color="#80deea">Let's use a super simple network: 1 input → 1 neuron → 1 output. We're predicting house price from square footage.</T></Box>}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
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
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>The computation:</T>
        <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.dim} size={18}>① Multiply: 1500 × 0.5 = <strong style={{ color: C.yellow }}>750</strong></T>
          <T color={C.dim} size={18}>② Add bias: 750 + 50 = <strong style={{ color: C.orange }}>800</strong></T>
          <T color={C.dim} size={18}>③ ReLU(800) = <strong style={{ color: C.green }}>800</strong> (positive, so unchanged)</T>
        </div>
        <T color="#ffe082" size={18} style={{ marginTop: 6 }}>Our network predicts the house costs <strong>$800k</strong>.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.red}><T color="#ff8a80" bold center>But the actual price was $900k.</T><T color="#ff8a80">We're off by $100k. How do we measure this error precisely? That's what the <strong>loss function</strong> does →</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.6 Loss ═══════
export const Ch1_6 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
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
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>The KEY insight:</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>
          The loss depends on the prediction. The prediction depends on <strong>weight</strong> and <strong>bias</strong>. So:<br /><br />
          <strong>If we change the weight → the prediction changes → the loss changes.</strong><br /><br />
          There exists some perfect value of weight and bias that makes the loss as small as possible. Our job: <strong>find those values</strong>.
        </T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>But how do we know which direction to change them? We need to understand <strong>derivatives</strong> first →</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>But wait - why SQUARE the error?</T>
        <T color={C.dim} size={16} style={{ marginTop: 4 }}>Why not just use |actual − predicted| (absolute error)? Three killer reasons:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.red}08`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} bold size={18}>① Big errors get punished WAY more</T>
            <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
                <T color={C.dim} size={15}>Small error = <strong style={{ color: C.yellow }}>2</strong></T>
                <T color={C.dim} size={15}>|2| = 2 &nbsp;vs&nbsp; 2² = <strong style={{ color: C.red }}>4</strong></T>
              </div>
              <div style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
                <T color={C.dim} size={15}>Big error = <strong style={{ color: C.yellow }}>10</strong></T>
                <T color={C.dim} size={15}>|10| = 10 &nbsp;vs&nbsp; 10² = <strong style={{ color: C.red }}>100</strong></T>
              </div>
            </div>
            <T color="#ff8a80" size={15} style={{ marginTop: 6 }}>Squaring forces the model to fix big mistakes first - a 10x error becomes 100x loss, not just 10x.</T>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}>
            <T color={C.cyan} bold size={18}>② Smooth curve - derivatives work cleanly</T>
            <T color="#80deea" size={15} style={{ marginTop: 4 }}>Derivative of x² = <strong>2x</strong> - simple, works at every point including zero.</T>
            <T color="#80deea" size={15}>Derivative of |x| = <strong>undefined at 0</strong> (sharp corner). At zero, is the slope +1 or −1? Nobody knows.</T>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.yellow} bold size={15}>Why does this matter?</T>
              <T color={C.dim} size={14} style={{ marginTop: 3 }}>Backpropagation calculates derivatives at every step to know <strong style={{ color: "#80deea" }}>which direction to adjust weights</strong>. If the derivative is undefined (like |x| at 0), the model gets STUCK - it has no signal telling it which way to go. With x², the derivative 2x always gives a clear answer: "move left" or "move right" and "by how much."</T>
              <T color={C.dim} size={14} style={{ marginTop: 3 }}>Think of it like driving with GPS. Smooth curve = GPS always works, always knows the next turn. Sharp corner = GPS loses signal exactly when you need it most.</T>
            </div>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={18}>③ Parabolic bowl - one clear minimum</T>
            <T color="#80e8a5" size={15} style={{ marginTop: 4 }}>Plot loss vs weight → x² makes a smooth U-shaped bowl. |x| makes a V-shaped valley with a sharp point at the bottom.</T>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.yellow} bold size={15}>Why does this matter?</T>
              <T color={C.dim} size={14} style={{ marginTop: 3 }}>Gradient descent works by rolling a ball downhill. In a <strong style={{ color: "#80e8a5" }}>smooth U-bowl</strong>, the ball gently slows down as it approaches the bottom - it naturally settles at the perfect spot (the minimum loss).</T>
              <T color={C.dim} size={14} style={{ marginTop: 3 }}>In a <strong style={{ color: C.red }}>V-shape</strong>, the ball races full speed to the bottom and <strong style={{ color: C.red }}>overshoots</strong> - bouncing back and forth across the sharp point, never settling. The model's weights keep jumping around the answer instead of converging to it.</T>
              <T color={C.dim} size={14} style={{ marginTop: 3 }}>The U-bowl also has a unique property: the <strong style={{ color: "#80e8a5" }}>steeper you are from the bottom, the bigger the gradient</strong>. Far away = big steps (fast progress). Close to bottom = tiny steps (precise landing). It's a built-in speed control.</T>
            </div>
          </div>
        </div>
      </Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.7 Derivatives ═══════
export const Ch1_7 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx;
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
      <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
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
        </Box></Reveal>
      <Reveal when={sub >= 2}><Box color={C.pink} style={{ width: "100%" }}>
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
        </Box></Reveal>
      <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
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
        </Box></Reveal>
      <Reveal when={sub >= 4}><Box color={C.purple}><T color="#b8a9ff" bold center>The derivative is our COMPASS - it tells us which direction to adjust each weight.</T><T color="#b8a9ff" center size={18} style={{ marginTop: 4 }}>But in a network with many steps, how do we compute this derivative? That's the <strong>chain rule</strong> →</T></Box></Reveal>
      <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>With 2 knobs (w, b), we turn ONE knob at a time.</T>
          <T color="#80deea" style={{ marginTop: 6 }}>∂L/∂w = 'how loss changes when I nudge only w.' This is a <strong>PARTIAL derivative</strong> - partial because we're holding everything else constant.</T>
        </Box></Reveal>
      {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
    </div>
  );
};

// ═══════ 1.8 Backward Pass ═══════
export const Ch1_8 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
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
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.pink} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.cyan} style={{ width: "100%" }}>
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
      </Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.9 Gradient Descent ═══════
export const Ch1_9 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
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
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={19}>Learning Rate (α) - How Big a Step?</T>
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
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center>Let's verify - did we improve?</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.dim} size={18}><strong>Before:</strong> w=0.5, b=50 → pred = 1500×0.5+50 = <strong style={{ color: C.red }}>800</strong> → loss = <strong style={{ color: C.red }}>10,000</strong></T>
          <T color={C.dim} size={18}><strong>After:</strong> w=0.53, b≈50 → pred = 1500×0.53+50 = <strong style={{ color: C.green }}>845</strong> → loss = <strong style={{ color: C.green }}>3,025</strong></T>
        </div>
        <T color={C.orange} size={18} style={{ marginTop: 6 }}>Loss dropped from 10,000 → 3,025! We're getting closer to the actual price of $900k. Repeat this loop thousands of times and the loss approaches zero.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.blue} style={{ width: "100%" }}>
        <T color="#42a5f5" bold center>Advanced: Momentum</T>
        <T color="#42a5f5" style={{ marginTop: 6 }}>A ball rolling downhill keeps rolling past small bumps instead of getting stuck. Momentum does the same: accumulate velocity in the descent direction, so updates are smoother and faster.</T>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.green}>
        <T color="#80e8a5" bold center size={20}>✅ That's backpropagation + gradient descent!</T>
        <T color="#80e8a5" center size={18} style={{ marginTop: 6 }}>
          In real networks with <strong>millions of weights and biases</strong>, the exact same process happens - just with longer chains and more derivatives. The math scales, the idea stays identical.<br /><br />
          Forward → Loss → Backward (chain rule) → Update → Repeat.
        </T>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.10 CNN ═══════
export const Ch1_10 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center>Built for images. A small "filter" slides across the image detecting patterns.</T></Box>}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
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
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.purple}><T color="#b8a9ff" bold center>Layers build on each other:</T><T color="#b8a9ff">Layer 1: <strong>edges</strong> → Layer 2: <strong>shapes</strong> → Layer 3: <strong>parts</strong> (eyes) → Layer 4: <strong>objects</strong> (face)</T></Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.red}><T color="#ff8a80" bold center>❌ Not great for language:</T><T color="#ff8a80">Related words can be far apart: "The cat <em>that I saw yesterday</em> <strong>was</strong> sleeping." - "cat" and "was" are 6 words apart but grammatically linked. CNN only looks at local windows.</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.11 RNN ═══════
export const Ch1_11 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx;
  const words = ["The", "cat", "sat", "on", "mat"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.pink}><T color="#ce93d8" bold center>Built for sequences. Reads one word at a time, passing "memory" forward.</T><T>Like reading a book left-to-right, remembering what you read.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}>
          <svg width="370" height="110">
            {words.map((w, i) => {
              const x = 15 + i * 72;
              const op = Math.max(0.15, 0.7 - i * 0.14);
              return (<g key={i}><text x={x + 20} y="100" fill={C.pink} fontSize="12" textAnchor="middle" fontWeight="600">{w}</text><line x1={x + 20} y1="88" x2={x + 20} y2="65" stroke={`${C.pink}40`} strokeWidth="1.5" /><rect x={x} y="32" width="40" height="30" rx="7" fill={`${C.pink}12`} stroke={`${C.pink}45`} strokeWidth="1.5" /><text x={x + 20} y="51" fill={C.pink} fontSize="9" textAnchor="middle" fontWeight="700">RNN</text>{i < 4 && <><line x1={x + 42} y1="47" x2={x + 68} y2="47" stroke={`rgba(224,64,251,${op})`} strokeWidth="2" /><polygon points={`${x + 66},43 ${x + 72},47 ${x + 66},51`} fill={`rgba(224,64,251,${op})`} /></>}<text x={x + 20} y="26" fill={`rgba(224,64,251,${op})`} fontSize="7" textAnchor="middle">{i === 0 ? "memory" : i >= 3 ? "fading..." : "memory"}</text></g>);
            })}
            <text x="185" y="14" fill={C.dim} fontSize="9" textAnchor="middle">→ must finish word 1 before starting word 2 →</text>
          </svg>
        </div></Reveal>
      <Reveal when={sub >= 2}><Box color={C.green}><T color="#80cbc4" bold center>✅ Understands order!</T><T color="#80cbc4">"Dog bites man" ≠ "Man bites dog" because the memory builds differently.</T></Box></Reveal>
      {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
    </div>
  );
};

// ═══════ 1.12 RNN Flaws ═══════
export const Ch1_12 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
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
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
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
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green}><T color="#80e8a5" bold center>We need: ⚡ parallel processing + 🧠 perfect memory + 📍 order awareness</T><T color={C.yellow} center bold size={21} style={{ marginTop: 6 }}>Enter: The Transformer →</T></Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 1.13 Transformer Arrives ═══════
export const Ch1_13 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx;
  const words = ["The", "cat", "sat", "on", "mat"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.green}><T color="#80e8a5" bold center size={20}>2017 - "Attention Is All You Need"</T><T color="#80e8a5">The key idea: let every word look at every other word <strong>simultaneously</strong>.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, width: "100%", display: "flex", justifyContent: "center" }}>
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
        </div></Reveal>
      <Reveal when={sub >= 2}><div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
          <Box color={C.red} style={{ flex: 1 }}><T color="#ff8a80" bold center size={16}>RNN</T><T color={C.dim} size={14} center>Sequential, slow<br />Forgets distant words</T></Box>
          <Box color={C.green} style={{ flex: 1 }}><T color="#80e8a5" bold center size={16}>Transformer</T><T color={C.mid} size={14} center>Parallel, blazing fast<br />Every word sees every word</T></Box>
        </div></Reveal>
      <Reveal when={sub >= 3}><Box color={C.yellow}><T color={C.yellow} bold center>Powers GPT, Claude, LLaMA, Gemini - ALL modern AI.</T><T center size={18} style={{ marginTop: 4 }}>Now let's see the full architecture →</T></Box></Reveal>
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
    </div>
  );
};

// ═══════ 2.1 Full Architecture (faithful SVG diagram) ═══════
