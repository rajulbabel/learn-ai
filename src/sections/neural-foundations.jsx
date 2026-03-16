import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

export const WhatIsNN = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>Pattern Recognition Machines</T>
          <div style={{ marginTop: 20 }}>
            <T color="#80deea" bold size={18}>You've used AI - ChatGPT, image generators, voice assistants.</T>
            <T color="#80deea" size={16} style={{ marginTop: 12 }}>But what's actually happening inside?</T>
            <T color="#80deea" size={17} style={{ marginTop: 16, lineHeight: 1.6 }}>
              A neural network is a computer program that learns patterns from examples. Not magic, not a brain - just math that adjusts itself.
            </T>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 20 }}>Example: Spam Detection</T>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 0, justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "8px 12px", background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 8, textAlign: "center" }}>
                  <T color={C.red} bold size={15}>word count</T>
                  <T color={C.red} size={16} style={{ marginTop: 4, fontWeight: 600 }}>152</T>
                </div>
                <div style={{ padding: "8px 12px", background: `${C.green}06`, border: `1px solid ${C.green}20`, borderRadius: 8, textAlign: "center" }}>
                  <T color={C.green} bold size={15}>has 'free'</T>
                  <T color={C.green} size={16} style={{ marginTop: 4, fontWeight: 600 }}>yes</T>
                </div>
                <div style={{ padding: "8px 12px", background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8, textAlign: "center" }}>
                  <T color={C.yellow} bold size={15}>links</T>
                  <T color={C.yellow} size={16} style={{ marginTop: 4, fontWeight: 600 }}>12</T>
                </div>
              </div>
              <div style={{ fontSize: 20, color: "#b8a9ff", fontWeight: 600 }}>→</div>
              <div style={{ padding: 16, background: `${C.purple}06`, borderRadius: 8, border: `1px solid ${C.purple}20`, textAlign: "center", minWidth: 140 }}>
                <T color={C.purple} bold size={14}>Neural Network</T>
                <T color="#b8a9ff" size={13} style={{ marginTop: 6 }}>(math)</T>
              </div>
              <div style={{ fontSize: 20, color: "#b8a9ff", fontWeight: 600 }}>→</div>
              <div style={{ padding: 14, background: C.red, borderRadius: 8, textAlign: "center", minWidth: 120 }}>
                <T color={C.bright} bold size={17}>92%</T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>Spam</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 20 }}>Two Ways to Make Rules</T>
            <div style={{ display: "flex", gap: 16, marginTop: 0 }}>
              <div style={{ flex: 1, padding: 16, background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}20` }}>
                <T color={C.orange} bold size={16}>Traditional Programming</T>
                <T color="#ffe082" size={15} style={{ marginTop: 12, lineHeight: 1.6 }}>Human writes rules: if email contains 'free' AND has more than 5 links then mark as spam.</T>
              </div>
              <div style={{ flex: 1, padding: 16, background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}20` }}>
                <T color={C.green} bold size={16}>Neural Network</T>
                <T color="#80e8a5" size={15} style={{ marginTop: 12, lineHeight: 1.6 }}>Human provides examples (thousands of emails labeled spam/not-spam), the network DISCOVERS the rules itself.</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>What's Inside?</T>
            <T color="#ffb74d" size={17} style={{ lineHeight: 1.6 }}>
              It's made of tiny units called neurons connected together. Each connection has a number called a weight. These weights are what the network learns during training.
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <svg viewBox="0 0 500 260" style={{ display: "block", width: "100%", maxWidth: 500 }}>
                {/* Column labels */}
                <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Input</text>
                <text x={250} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Hidden Layer</text>
                <text x={430} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Output</text>

                {/* Edges FIRST (behind nodes) */}
                {/* Input→Hidden: every input to every hidden (fully connected) */}
                {[60, 120, 180].map(iy => [60, 120, 180].map(hy => (
                  <line key={`i${iy}h${hy}`} x1={94} y1={iy} x2={226} y2={hy} stroke={`${iy === 60 ? C.red : iy === 120 ? C.yellow : C.green}${Math.abs(iy - hy) < 10 ? '50' : '25'}`} strokeWidth={1.5} />
                )))}
                {/* Hidden→Output */}
                {[60, 120, 180].map(hy => [90, 150].map(oy => (
                  <line key={`h${hy}o${oy}`} x1={274} y1={hy} x2={406} y2={oy} stroke={`${C.cyan}${Math.abs(hy - oy) < 40 ? '50' : '25'}`} strokeWidth={1.5} />
                )))}

                {/* Input neurons - y=60, 120, 180 (r=22, 60px apart = no touching) */}
                <circle cx={70} cy={60} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
                <text x={70} y={65} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>x₁</text>

                <circle cx={70} cy={120} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
                <text x={70} y={125} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>x₂</text>

                <circle cx={70} cy={180} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={70} y={185} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>x₃</text>

                {/* Hidden layer dashed box - well around the hidden nodes */}
                <rect x={180} y={30} width={140} height={180} fill="none" stroke={`${C.cyan}30`} strokeWidth={2} strokeDasharray="5,5" rx={8} />

                {/* Hidden neurons */}
                <circle cx={250} cy={60} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={65} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>h₁</text>

                <circle cx={250} cy={120} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={125} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>h₂</text>

                <circle cx={250} cy={180} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={185} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>h₃</text>

                {/* Output neurons - y=90, 150 */}
                <circle cx={430} cy={90} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={430} y={95} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>o₁</text>

                <circle cx={430} cy={150} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={430} y={155} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>o₂</text>

                {/* Bottom label - well below all content */}
                <text x={250} y={250} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">Every input connects to every hidden neuron</text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const InsideNeuron = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20} style={{ marginBottom: 16 }}>One Neuron, Three Steps</T>
          <T color={C.bright} bold size={18}>A neuron is the basic building block.</T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            It takes a few numbers in and produces ONE number out. Think of it as a tiny decision-maker that weighs different pieces of evidence.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 480 220" style={{ display: "block", width: "100%", maxWidth: 480 }}>
              {/* Column labels */}
              <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Inputs</text>
              <text x={240} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Neuron</text>
              <text x={410} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Output</text>

              {/* Input nodes - r=22, spaced at y=45, 110, 175 (65px apart, well clear of r=22) */}
              <circle cx={70} cy={45} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={70} y={50} fill={C.red} fontSize={14} textAnchor="middle" fontWeight={700}>i₁</text>

              <circle cx={70} cy={110} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={70} y={115} fill={C.yellow} fontSize={14} textAnchor="middle" fontWeight={700}>i₂</text>

              <circle cx={70} cy={175} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={70} y={180} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>i₃</text>

              {/* Edges to neuron */}
              <line x1={92} y1={45} x2={207} y2={98} stroke={`${C.red}50`} strokeWidth={1.5} />
              <line x1={92} y1={110} x2={207} y2={110} stroke={`${C.yellow}50`} strokeWidth={1.5} />
              <line x1={92} y1={175} x2={207} y2={122} stroke={`${C.green}50`} strokeWidth={1.5} />

              {/* Central neuron - centered at y=110 */}
              <circle cx={240} cy={110} r={30} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
              <text x={240} y={115} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>Neuron</text>

              {/* Edge to output */}
              <line x1={270} y1={110} x2={383} y2={110} stroke={`${C.cyan}50`} strokeWidth={1.5} />
              <polygon points="383,110 377,106 377,114" fill={`${C.cyan}50`} />

              {/* Output node - centered at y=110 */}
              <circle cx={410} cy={110} r={26} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={410} y={115} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>out</text>

              {/* Bottom label */}
              <text x={240} y={215} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>3 inputs → 1 neuron → 1 output</text>
            </svg>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.red} style={{ width: "100%" }}>
            <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>Example: Detecting Flu from Symptoms</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 0 }}>
              <div style={{ padding: 14, background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 8, fontFamily: "monospace" }}>
                <T color={C.red} bold size={15}>Input 1: fever = 38.5°C</T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>weight: 0.6 (very important)</T>
              </div>
              <div style={{ padding: 14, background: `${C.green}06`, border: `1px solid ${C.green}20`, borderRadius: 8, fontFamily: "monospace" }}>
                <T color={C.green} bold size={15}>Input 2: cough = 1 (yes)</T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>weight: 0.3 (somewhat important)</T>
              </div>
              <div style={{ padding: 14, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8, fontFamily: "monospace" }}>
                <T color={C.yellow} bold size={15}>Input 3: fatigue = 0.8</T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>weight: 0.1 (less important)</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>The Step-by-Step Math</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 0 }}>
              <div style={{ padding: 14, background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
                <T color={C.red} bold size={15}>Step 1: Multiply each input by its weight</T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "fever", iv: "38.5", wv: "0.6", r: "23.10" },
                    { label: "cough", iv: "1.0", wv: "0.3", r: "0.30" },
                    { label: "fatigue", iv: "0.8", wv: "0.1", r: "0.08" },
                  ].map(({ label, iv, wv, r }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: C.dim, fontSize: 13, minWidth: 52 }}>{label}:</span>
                      <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>{iv}</span>
                      <span style={{ color: C.dim, fontSize: 14 }}>×</span>
                      <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>{wv}</span>
                      <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                      <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: C.cyan, fontSize: 15, fontWeight: 700 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 14, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
                <T color={C.yellow} bold size={15}>Step 2: Sum them up</T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {["23.10", "0.30", "0.08"].map((v, i) => (
                    <span key={i} style={{ display: "contents" }}>
                      {i > 0 && <span style={{ color: C.dim, fontSize: 14 }}>+</span>}
                      <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: C.cyan, fontSize: 15, fontWeight: 600 }}>{v}</span>
                    </span>
                  ))}
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span style={{ padding: "3px 10px", background: `${C.yellow}20`, borderRadius: 4, color: C.yellow, fontSize: 16, fontWeight: 700 }}>23.48</span>
                </div>
              </div>
              <div style={{ padding: 14, background: `${C.cyan}06`, border: `1px solid ${C.cyan}20`, borderRadius: 8 }}>
                <T color={C.cyan} bold size={15}>Step 3: Add a bias (a fixed number added every time)</T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>23.48</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                  <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>(-14.0)</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span style={{ padding: "3px 10px", background: `${C.cyan}20`, borderRadius: 4, color: C.cyan, fontSize: 16, fontWeight: 700 }}>9.48</span>
                </div>
                <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 4 }}>The bias shifts the result up or down - you will learn more about it in chapter 1.4</T>
              </div>
              <div style={{ padding: 14, background: `${C.green}06`, border: `1px solid ${C.green}20`, borderRadius: 8 }}>
                <T color={C.green} bold size={15}>Step 4: Apply a rule - if negative, output 0; if positive, keep it</T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 15, fontWeight: 600 }}>9.48</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>is positive → keep →</span>
                  <span style={{ padding: "3px 10px", background: `${C.green}20`, borderRadius: 4, color: C.green, fontSize: 16, fontWeight: 700 }}>9.48</span>
                </div>
                <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 4 }}>This rule has a name (activation function) - you'll meet it in chapter 1.6</T>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 14, background: C.green, borderRadius: 8, textAlign: "center" }}>
              <T color="#000" bold size={16}>Output: 9.48 → HIGH flu risk</T>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ letterSpacing: 1 }}>THE NEURON FORMULA</T>
            <div style={{ marginTop: 18, padding: 14, background: "rgba(0,0,0,0.4)", borderRadius: 8, border: `1px solid ${C.yellow}25`, fontFamily: "monospace", fontSize: 16, textAlign: "center" }}>
              <div style={{ color: C.bright }}>
                output = <span style={{ color: C.orange }}>activation</span>( <span style={{ color: C.cyan }}>&Sigma;</span>(<span style={{ color: C.red }}>input</span> <span style={{ color: "rgba(255,255,255,0.4)" }}>&times;</span> <span style={{ color: C.yellow }}>weight</span>) + <span style={{ color: C.purple }}>bias</span> )
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.red, borderRadius: 6, fontSize: 13, fontWeight: 600, color: C.bright, minWidth: 60 }}>input</div>
                <T color="#ffe082" size={16}>values coming in (symptoms, pixels, words...)</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.yellow, borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#000", minWidth: 60 }}>weight</div>
                <T color="#ffe082" size={16}>how important each input is (learned during training)</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.cyan, borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#000", minWidth: 60 }}>Σ</div>
                <T color="#ffe082" size={16}>sum all (input × weight) pairs</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.purple, borderRadius: 6, fontSize: 13, fontWeight: 600, color: C.bright, minWidth: 60 }}>bias</div>
                <T color="#ffe082" size={16}>a fixed number added to shift the result (learned during training)</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.orange, borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#000", minWidth: 60 }}>activation</div>
                <T color="#ffe082" size={16}>a simple rule applied at the end (explained in chapter 1.6)</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "6px 10px", background: C.green, borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#000", minWidth: 60 }}>output</div>
                <T color="#ffe082" size={16}>this neuron's final value</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>That's ALL a Neuron Does</T>
            <T color={C.bright} size={17} style={{ lineHeight: 1.6 }}>
              Every neuron in every AI - from ChatGPT to image generators - does this exact same thing: multiply, sum, add bias, activate.
            </T>
            <T color={C.green} size={17} style={{ marginTop: 16, fontWeight: 600 }}>
              The magic is in the WEIGHTS - the network learns the right ones during training.
            </T>
          </Box>
        </Reveal>
      )}
      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const WhatIsLayer = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>A Group of Neurons Working Together</T>
          <T color={C.bright} bold size={18}>One neuron finds ONE pattern.</T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            But to understand something complex, you need to detect MANY patterns at the same time. A layer is a group of neurons working side by side.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 520 260" style={{ display: "block", width: "100%", maxWidth: 520 }}>
              {/* Column labels */}
              <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Inputs</text>
              <text x={260} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Layer (3 neurons)</text>
              <text x={450} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Outputs</text>

              {/* Edges input→layer (behind nodes, all 9 connections) */}
              <line x1={94} y1={70} x2={236} y2={70} stroke={`${C.red}40`} strokeWidth={1.5} />
              <line x1={94} y1={70} x2={236} y2={130} stroke={`${C.red}25`} strokeWidth={1.5} />
              <line x1={94} y1={70} x2={236} y2={190} stroke={`${C.red}20`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={70} stroke={`${C.yellow}25`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={130} stroke={`${C.yellow}40`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={190} stroke={`${C.yellow}25`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={70} stroke={`${C.green}20`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={130} stroke={`${C.green}25`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={190} stroke={`${C.green}40`} strokeWidth={1.5} />

              {/* Edges layer→output (1:1 mapping) */}
              <line x1={284} y1={70} x2={426} y2={70} stroke={`${C.red}40`} strokeWidth={1.5} />
              <line x1={284} y1={130} x2={426} y2={130} stroke={`${C.yellow}40`} strokeWidth={1.5} />
              <line x1={284} y1={190} x2={426} y2={190} stroke={`${C.purple}40`} strokeWidth={1.5} />

              {/* Input neurons - y=70, 130, 190 */}
              <circle cx={70} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={70} y={75} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>fever</text>

              <circle cx={70} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={70} y={135} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>cough</text>

              <circle cx={70} cy={190} r={24} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={70} y={195} fill={C.green} fontSize={12} textAnchor="middle" fontWeight={700}>fatigue</text>

              {/* Layer dashed box */}
              <rect x={170} y={38} width={180} height={180} fill="none" stroke={`${C.purple}30`} strokeWidth={2} strokeDasharray="5,5" rx={8} />

              {/* Layer neurons - y=70, 130, 190 matching inputs */}
              <circle cx={260} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={260} y={75} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>Flu</text>

              <circle cx={260} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={260} y={135} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>Cold</text>

              <circle cx={260} cy={190} r={24} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
              <text x={260} y={195} fill="#d8a9ff" fontSize={12} textAnchor="middle" fontWeight={700}>Allergy</text>

              {/* Output neurons - same y positions */}
              <circle cx={450} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={450} y={75} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>9.48</text>

              <circle cx={450} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={450} y={135} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>3.51</text>

              <circle cx={450} cy={190} r={24} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
              <text x={450} y={195} fill="#d8a9ff" fontSize={13} textAnchor="middle" fontWeight={700}>0.26</text>

              {/* Bottom label */}
              <text x={260} y={248} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">Each neuron looks at ALL inputs but with different weights</text>
            </svg>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color="#b8a9ff" bold center size={20} style={{ marginBottom: 8 }}>Three Neurons, Same Inputs, Different Weights</T>
            <T color="#b8a9ff" size={16} style={{ marginBottom: 12, lineHeight: 1.6 }}>
              Each neuron gets ALL 3 inputs but has its own weights. The weights determine what each neuron "cares about."
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 520 310" style={{ display: "block", width: "100%", maxWidth: 520 }}>
                {/* Column labels */}
                <text x={65} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Inputs</text>
                <text x={280} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Neurons</text>

                {/* Edges with weight labels - 9 connections */}
                {/* Edges with weight labels 25% from source node */}
                {[
                  { x1: 93, y1: 60, x2: 248, y2: 55, c: C.red, w: "0.6", oy: -9 },
                  { x1: 93, y1: 60, x2: 248, y2: 150, c: C.red, w: "0.1", oy: -8 },
                  { x1: 93, y1: 60, x2: 248, y2: 245, c: C.red, w: "0", oy: -8 },
                  { x1: 93, y1: 150, x2: 248, y2: 55, c: C.yellow, w: "0.3", oy: 12 },
                  { x1: 93, y1: 150, x2: 248, y2: 150, c: C.yellow, w: "0.5", oy: -9 },
                  { x1: 93, y1: 150, x2: 248, y2: 245, c: C.yellow, w: "0.2", oy: -8 },
                  { x1: 93, y1: 240, x2: 248, y2: 55, c: C.green, w: "0.1", oy: 12 },
                  { x1: 93, y1: 240, x2: 248, y2: 150, c: C.green, w: "0.2", oy: 12 },
                  { x1: 93, y1: 240, x2: 248, y2: 245, c: C.green, w: "0.7", oy: -9 },
                ].map(({ x1, y1, x2, y2, c, w, oy = 0 }, i) => {
                  const t = 0.25;
                  const lx = x1 + (x2 - x1) * t;
                  const ly = y1 + (y2 - y1) * t + oy;
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${c}25`} strokeWidth={1.2} />
                      <rect x={lx - 14} y={ly - 9} width={28} height={16} rx={3} fill="#08080dee" />
                      <text x={lx} y={ly + 4} fill={c} fontSize={10} textAnchor="middle" fontWeight={700}>{w}</text>
                    </g>
                  );
                })}

                {/* Input nodes */}
                {[
                  { y: 60, label: "fever", val: "38.5", c: C.red },
                  { y: 150, label: "cough", val: "1", c: C.yellow },
                  { y: 240, label: "fatigue", val: "0.8", c: C.green },
                ].map(({ y, label, val, c }) => (
                  <g key={label}>
                    <circle cx={65} cy={y} r={26} fill={`${c}12`} stroke={c} strokeWidth={2} />
                    <text x={65} y={y - 6} fill={c} fontSize={10} textAnchor="middle" fontWeight={700}>{label}</text>
                    <text x={65} y={y + 10} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">{val}</text>
                  </g>
                ))}

                {/* Neuron nodes with bias and output */}
                {[
                  { y: 55, label: "Flu", bias: "-14", out: "9.48", c: C.red, ct: "#ef9a9a" },
                  { y: 150, label: "Cold", bias: "-1", out: "3.51", c: C.orange, ct: "#ffb74d" },
                  { y: 245, label: "Allergy", bias: "-0.5", out: "0.26", c: C.purple, ct: "#b8a9ff" },
                ].map(({ y, label, bias, out, c, ct }) => (
                  <g key={label}>
                    <circle cx={280} cy={y} r={30} fill={`${c}12`} stroke={c} strokeWidth={2} />
                    <text x={280} y={y - 8} fill={c} fontSize={12} textAnchor="middle" fontWeight={700}>{label}</text>
                    <text x={280} y={y + 7} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle">b={bias}</text>
                    {/* Output arrow */}
                    <line x1={310} y1={y} x2={380} y2={y} stroke={`${c}50`} strokeWidth={1.5} />
                    <polygon points={`380,${y - 4} 388,${y} 380,${y + 4}`} fill={c} />
                    {/* Output value */}
                    <rect x={392} y={y - 14} width={68} height={28} rx={6} fill={`${c}12`} stroke={`${c}30`} strokeWidth={1} />
                    <text x={426} y={y + 4} fill={ct} fontSize={14} textAnchor="middle" fontWeight={700}>{out}</text>
                  </g>
                ))}

                {/* Bottom insight */}
                <text x={260} y={295} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">Flu cares about fever (0.6) | Allergy ignores fever (0) but focuses on fatigue (0.7)</text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>The Output of a Layer is a LIST</T>
            <T color="#ffe082" size={17} style={{ lineHeight: 1.6 }}>
              One number from each neuron. The input is a list. The output is also a list. A layer transforms one list of numbers into a different list of numbers.
            </T>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ padding: "10px 14px", background: `${C.red}06`, border: `1px solid ${C.red}12`, borderRadius: 8 }}>
                <T color={C.red} bold size={14}>Input</T>
                <T color="#ef9a9a" size={16} style={{ fontFamily: "monospace", marginTop: 4 }}>[38.5, 1, 0.8]</T>
              </div>
              <T color={C.dim} bold size={20}>→</T>
              <div style={{ padding: "10px 14px", background: `${C.cyan}06`, border: `1px solid ${C.cyan}12`, borderRadius: 8 }}>
                <T color={C.cyan} bold size={14}>Layer</T>
                <T color="#80deea" size={14} style={{ marginTop: 4 }}>3 neurons process</T>
              </div>
              <T color={C.dim} bold size={20}>→</T>
              <div style={{ padding: "10px 14px", background: `${C.green}06`, border: `1px solid ${C.green}12`, borderRadius: 8 }}>
                <T color={C.green} bold size={14}>Output</T>
                <T color="#80e8a5" size={16} style={{ fontFamily: "monospace", marginTop: 4 }}>[9.48, 3.51, 0.26]</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>Stacking Layers</T>
            <T color={C.orange} size={17} style={{ marginBottom: 18, lineHeight: 1.6 }}>
              The output of Layer 1 becomes the input to Layer 2. Each layer builds on what the previous one found.
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Input", val: "[38.5, 1, 0.8]", c: C.red, ct: "#ef9a9a" },
                { label: "Layer 1", val: "[9.48, 3.51, 0.26]", c: C.cyan, ct: "#80deea" },
                { label: "Layer 2", val: "[0.91]", c: C.purple, ct: "#b8a9ff" },
                { label: "Result", val: "91% flu", c: C.green, ct: "#000", solid: true },
              ].map(({ label, val, c, ct, solid }, i) => (
                <div key={label} style={{ display: "contents" }}>
                  {i > 0 && <T color={C.dim} bold size={20}>→</T>}
                  <div style={{ padding: "8px 12px", background: solid ? c : `${c}06`, border: solid ? "none" : `1px solid ${c}12`, borderRadius: 8, textAlign: "center" }}>
                    <T color={solid ? ct : c} bold size={13}>{label}</T>
                    <div style={{ marginTop: 3, fontFamily: "monospace", fontSize: 14, color: solid ? ct : ct, fontWeight: solid ? 700 : 400 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>What is a Layer PHYSICALLY?</T>
            <T color="#80deea" size={17} style={{ lineHeight: 1.6 }}>
              It's not something you can touch. It's a group of math operations that happen at the same time. On modern GPUs, thousands of neurons compute simultaneously. A layer is just how we organize and think about these parallel computations.
            </T>
          </Box>
        </Reveal>
      )}
      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const WeightsBiases = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>Every Connection Has a Weight</T>
          <T color={C.bright} bold size={18}>Weight = how important is this input?</T>
          <T color={C.bright} size={17} style={{ marginTop: 12, lineHeight: 1.6 }}>
            Think of a doctor diagnosing flu. They look at symptoms: Fever - very important (high weight). Headache - somewhat important (medium weight). Shoe color - irrelevant (weight close to 0). A weight is a number that says how much to care about this input.
          </T>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>Bias = a Baseline Shift</T>
            <T color="#b8a9ff" size={17} style={{ marginBottom: 12, lineHeight: 1.6 }}>
              House price example: without bias, price = sqft × weight. This forces price to zero when sqft is zero. But even a tiny plot has land value!
            </T>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>Without bias:</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: C.green, fontSize: 15, fontWeight: 600 }}>price</span>
              <span style={{ color: C.dim }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>sqft</span>
              <span style={{ color: C.dim }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>weight</span>
            </div>
            <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 8 }}>Forces price = 0 when sqft = 0</T>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>With bias:</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: C.green, fontSize: 15, fontWeight: 600 }}>price</span>
              <span style={{ color: C.dim }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>sqft</span>
              <span style={{ color: C.dim }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>weight</span>
              <span style={{ color: C.dim }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>bias</span>
            </div>
            <T color="#b8a9ff" size={13} style={{ marginTop: 8, fontWeight: 600 }}>bias adds base amount regardless of input</T>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>A Neuron with Labeled Parts</T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 520 190" style={{ display: "block", width: "100%", maxWidth: 520 }}>
                {/* Layout: inputs at x=55, sum at x=190, activation at x=310, output at x=440. Center y=80. */}

                {/* Edges FIRST (behind everything) */}
                <line x1={79} y1={50} x2={162} y2={72} stroke={C.red} strokeWidth={2} />
                <line x1={79} y1={110} x2={162} y2={88} stroke={C.yellow} strokeWidth={2} />
                <line x1={218} y1={80} x2={282} y2={80} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                <polygon points="282,80 276,76 276,84" fill="rgba(255,255,255,0.3)" />
                <line x1={338} y1={80} x2={410} y2={80} stroke={C.green} strokeWidth={2} />
                <polygon points="410,80 404,76 404,84" fill={C.green} />

                {/* Bias dashed line */}
                <line x1={190} y1={108} x2={190} y2={142} stroke={C.purple} strokeWidth={1.5} strokeDasharray="4,3" />
                <polygon points="190,108 187,115 193,115" fill={C.purple} />

                {/* Input nodes */}
                <circle cx={55} cy={50} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
                <text x={55} y={45} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>x₁</text>
                <text x={55} y={60} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">1500</text>

                <circle cx={55} cy={110} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
                <text x={55} y={105} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>x₂</text>
                <text x={55} y={120} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">3</text>

                {/* Weight labels ABOVE edges (offset from line) */}
                <text x={118} y={48} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>w=0.5</text>
                <text x={118} y={118} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>w=50</text>

                {/* Sum node */}
                <circle cx={190} cy={80} r={28} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={190} y={76} fill={C.cyan} fontSize={17} textAnchor="middle" fontWeight={700}>Σ</text>
                <text x={190} y={92} fill={C.cyan} fontSize={10} textAnchor="middle">+bias</text>

                {/* Bias label */}
                <rect x={158} y={145} width={64} height={18} rx={4} fill={`${C.purple}12`} stroke={`${C.purple}30`} strokeWidth={1} />
                <text x={190} y={158} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>bias = 50</text>

                {/* Activation node - larger, just says "f" */}
                <circle cx={310} cy={80} r={28} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} />
                <text x={310} y={86} fill={C.orange} fontSize={16} textAnchor="middle" fontWeight={700}>f(x)</text>
                <text x={310} y={46} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={600}>activation</text>

                {/* Output node */}
                <circle cx={440} cy={80} r={28} fill={`${C.green}15`} stroke={C.green} strokeWidth={2} />
                <text x={440} y={86} fill={C.green} fontSize={18} textAnchor="middle" fontWeight={700}>950</text>
                <text x={440} y={46} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={600}>output</text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>Step by Step: Multiply, Sum, Add Bias, Activate</T>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={16}>Step 1: Multiply each input by its weight</T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, paddingLeft: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 13, minWidth: 24 }}>x₁:</span>
                  <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>1500</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>×</span>
                  <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>0.5</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: C.red, fontSize: 15, fontWeight: 700 }}>750</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 13, minWidth: 24 }}>x₂:</span>
                  <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>3</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>×</span>
                  <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>50</span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: C.yellow, fontSize: 15, fontWeight: 700 }}>150</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 8, padding: "12px 14px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
              <T color={C.cyan} bold size={16}>Step 2: Sum</T>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {["750", "150"].map((v, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 && <span style={{ color: C.dim, fontSize: 14 }}>+</span>}
                    <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: C.cyan, fontSize: 15, fontWeight: 600 }}>{v}</span>
                  </span>
                ))}
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <span style={{ padding: "3px 10px", background: `${C.cyan}20`, borderRadius: 4, color: C.cyan, fontSize: 16, fontWeight: 700 }}>900</span>
              </div>
            </div>
            <div style={{ marginTop: 8, padding: "12px 14px", borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
              <T color="#b8a9ff" bold size={16}>Step 3: Add bias</T>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 15, fontWeight: 600 }}>900</span>
                <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>50</span>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <span style={{ padding: "3px 10px", background: `${C.purple}20`, borderRadius: 4, color: "#b8a9ff", fontSize: 16, fontWeight: 700 }}>950</span>
              </div>
            </div>
            <div style={{ marginTop: 8, padding: "12px 14px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>Step 4: Activation</T>
              <div style={{ marginTop: 6, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>950 is positive → keep it</T>
              </div>
              <div style={{ marginTop: 8, textAlign: "center", padding: "6px 10px", background: `${C.green}10`, borderRadius: 6 }}>
                <T color={C.green} bold size={16}>Output = $950k</T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>Key Takeaway</T>
            <T color="#80e8a5" size={17} style={{ lineHeight: 1.6 }}>
              A neuron is just: multiply, sum, add bias, activate. The weights and bias are what the network LEARNS. Everything else is fixed math.
            </T>
          </Box>
        </Reveal>
      )}
      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const WhyLinear = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>Lines Can Only Do So Much</T>
          <T color={C.bright} bold size={18}>A neuron without activation does y = mx + b</T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Strip away the activation and a neuron computes: output = (input × weight) + bias. m is the weight (slope), b is the bias (y-intercept).
          </T>
          <div style={{ padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: `1px solid ${C.green}25`, marginTop: 8 }}>
            <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 18, color: C.green, fontWeight: 700 }}>y = mx + b</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "4px 10px", background: `${C.yellow}15`, borderRadius: 6, border: `1px solid ${C.yellow}25` }}>
                  <code style={{ color: C.yellow, fontSize: 14, fontWeight: 700 }}>m (slope)</code>
                </div>
                <T color="#ffe082" size={15}>= the weight. Controls how steep the line is.</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "4px 10px", background: `${C.purple}15`, borderRadius: 6, border: `1px solid ${C.purple}25` }}>
                  <code style={{ color: C.purple, fontSize: 14, fontWeight: 700 }}>b (bias)</code>
                </div>
                <T color="#b8a9ff" size={15}>= the bias. Shifts the line up or down.</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "4px 10px", background: `${C.red}15`, borderRadius: 6, border: `1px solid ${C.red}25` }}>
                  <code style={{ color: C.red, fontSize: 14, fontWeight: 700 }}>x (input)</code>
                </div>
                <T color="#ef9a9a" size={15}>= the input value going in.</T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ padding: "4px 10px", background: `${C.green}15`, borderRadius: 6, border: `1px solid ${C.green}25` }}>
                  <code style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>y (output)</code>
                </div>
                <T color="#80e8a5" size={15}>= the output. Always a straight line.</T>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 10, background: `${C.red}06`, borderRadius: 6, border: `1px solid ${C.red}15`, textAlign: "center" }}>
              <T color="#ef9a9a" bold size={15}>Key problem: no matter what m and b are, this is ALWAYS a straight line.</T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>Why is This a Problem? Real Patterns are Curved</T>
            <div style={{ display: "flex", gap: 14, marginTop: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ padding: 12, background: `${C.green}06`, border: `1px solid ${C.green}20`, borderRadius: 8, textAlign: "center", marginBottom: 8 }}>
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={25} y1={78} x2={118} y2={18} stroke={C.green} strokeWidth={2.5} />
                    <circle cx={25} cy={78} r={3} fill={C.green} />
                    <circle cx={118} cy={18} r={3} fill={C.green} />
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">study hours</text>
                    <text x={8} y={50} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle" transform="rotate(-90,8,50)">grade</text>
                  </svg>
                </div>
                <T color={C.green} bold size={14} style={{ textAlign: "center" }}>A straight line can model this ✓</T>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: 12, background: `${C.orange}06`, border: `1px solid ${C.orange}20`, borderRadius: 8, textAlign: "center", marginBottom: 8 }}>
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <path d="M 25 70 Q 70 12 118 70" fill="none" stroke={C.orange} strokeWidth={2.5} />
                    <circle cx={25} cy={70} r={3} fill={C.orange} />
                    <circle cx={70} cy={15} r={3} fill={C.orange} />
                    <circle cx={118} cy={70} r={3} fill={C.orange} />
                    <text x={70} y={9} fill={C.yellow} fontSize={9} fontWeight={600} textAnchor="middle">peak</text>
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">temperature</text>
                    <text x={8} y={50} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle" transform="rotate(-90,8,50)">growth</text>
                  </svg>
                </div>
                <T color={C.orange} bold size={14} style={{ textAlign: "center" }}>No straight line fits this curve ✗</T>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: 12, background: `${C.orange}06`, border: `1px solid ${C.orange}20`, borderRadius: 8, textAlign: "center", marginBottom: 8 }}>
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <path d="M 25 78 C 50 78 60 20 80 20 C 100 20 110 60 118 60" fill="none" stroke={C.orange} strokeWidth={2.5} />
                    <circle cx={25} cy={78} r={3} fill={C.orange} />
                    <circle cx={80} cy={20} r={3} fill={C.orange} />
                    <circle cx={118} cy={60} r={3} fill={C.orange} />
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">drug dose</text>
                    <text x={8} y={50} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle" transform="rotate(-90,8,50)">effect</text>
                  </svg>
                </div>
                <T color={C.orange} bold size={14} style={{ textAlign: "center" }}>Or this S-curve ✗</T>
              </div>
            </div>
            <T color="#ffb74d" size={16} style={{ marginTop: 14, lineHeight: 1.7 }}>
              Think about real-world patterns. A 1500 sqft house costs more than 1000 sqft - that's roughly linear. But plant growth vs temperature? A plant grows faster as temperature rises from 10°C to 25°C, then STOPS growing and DIES above 40°C. No straight line can go up, peak, and then come down. Same with medicine dosage: 100mg helps, 200mg helps more, but 1000mg is toxic. These real patterns require curves that bend and change direction. A straight line always goes in one direction.
            </T>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>The Fatal Problem: Stacking Without Activation</T>
            <T color="#ffe082" size={16} style={{ marginBottom: 12 }}>Maybe adding more layers helps?</T>
            <div style={{ padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 15, color: "#ffe082", lineHeight: 1.9 }}>
              <div>Layer 1: output₁ = input × 3 + 1</div>
              <div>Layer 2: output₂ = output₁ × 2 + 5</div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 10 }}>Substitute:</div>
              <div>output₂ = (input × 3 + 1) × 2 + 5</div>
              <div style={{ color: "#ffe082", fontWeight: 600, marginTop: 6 }}>=&gt; output₂ = input × 6 + 7</div>
            </div>
            <div style={{ marginTop: 14, padding: 14, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T color={C.yellow} bold size={16}>Still just y = 6x + 7. A straight line!</T>
              <T color="#ffe082" size={15} style={{ marginTop: 10 }}>No matter how many layers: 2 layers, 10 layers, 100 layers - without activation they ALL collapse into one straight line. 100 layers = 1 layer.</T>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>What We Need: a BEND in the Line</T>
            <T color="#80e8a5" size={17} style={{ lineHeight: 1.6 }}>
              We need something that adds a bend to the line. Something that breaks the linearity so layers actually DO different things when stacked. That something is called an activation function.
            </T>
          </Box>
        </Reveal>
      )}
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const ReLU = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const Graph = ({ points, color, width = 300, height = 140, xLabel = "", yLabel = "", title = "", annotations = [] }) => {
    const pad = { l: 36, r: 12, t: 24, b: 32 };
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
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1={pad.l} y1={pad.t + h} x2={pad.l + w} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {minY < 0 && maxY > 0 && <line x1={pad.l} y1={scaleY(0)} x2={pad.l + w} y2={scaleY(0)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={i} cx={scaleX(p[0])} cy={scaleY(p[1])} r="3.5" fill={color} />)}
        {xLabel && <text x={pad.l + w / 2} y={height - 2} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">{xLabel}</text>}
        {yLabel && <text x={4} y={pad.t + h / 2} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" transform={`rotate(-90, 4, ${pad.t + h / 2})`}>{yLabel}</text>}
        {title && <text x={pad.l + w / 2} y={18} fill={color} fontSize="11" textAnchor="middle" fontWeight="700">{title}</text>}
        {points.filter((_, i) => i % (points.length > 10 ? 2 : 1) === 0).map((p, i) => (
          <text key={`x${i}`} x={scaleX(p[0])} y={pad.t + h + 16} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{p[0]}</text>
        ))}
        {annotations.map(({ x, y, text: t, color: ac }, i) => (
          <g key={`a${i}`}>
            <circle cx={scaleX(x)} cy={scaleY(y)} r="6" fill="none" stroke={ac || C.yellow} strokeWidth="1.5" />
            <text x={scaleX(x) + 10} y={scaleY(y) - 8} fill={ac || C.yellow} fontSize="9" fontWeight="600">{t}</text>
          </g>
        ))}
      </svg>
    );
  };

  const neuron1 = [[0,0],[1,0],[2,0],[3,0],[4,1],[5,2],[6,3],[7,4]];
  const neuron2 = [[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[6,0],[7,0]];
  const combined = neuron1.map((p, i) => [p[0], p[1] + neuron2[i][1]]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>Activation (ReLU)</T>
          <T color={C.bright} bold size={18}>The ReLU Rule</T>
          <T color={C.bright} size={16} style={{ marginTop: 12, marginBottom: 16 }}>After each neuron's math, apply ONE simple rule:</T>
          <div style={{ padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: `2px solid ${C.yellow}`, textAlign: "center" }}>
            <T color={C.yellow} bold size={17}>If negative → 0    |    If positive → keep</T>
          </div>
          <T color="rgba(255,255,255,0.5)" size={14} style={{ marginTop: 16, textAlign: "center", fontStyle: "italic", fontFamily: "monospace" }}>Formally: ReLU(x) = max(0, x)</T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>-5</span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: C.red, fontSize: 15, fontWeight: 700 }}>0</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>-100</span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: C.red, fontSize: 15, fontWeight: 700 }}>0</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#81c784", fontSize: 15, fontWeight: 600 }}>3</span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#81c784", fontSize: 15, fontWeight: 700 }}>3</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#81c784", fontSize: 15, fontWeight: 600 }}>950</span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#81c784", fontSize: 15, fontWeight: 700 }}>950</span>
              </div>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>One Neuron with ReLU Gives a BENT Line</T>
            <T color="#80deea" size={16} style={{ marginBottom: 14 }}>Flat at 0 from inputs 0-3 (ReLU kills negatives), then rises. A bent line, not straight!</T>
            <div style={{ display: "flex", justifyContent: "center" }}>{Graph({ points: neuron1, color: C.cyan, title: "Neuron 1: flat, then rises", annotations: [{ x: 3, y: 0, text: "bend!", color: C.cyan }] })}</div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>A Different Neuron: Different Bend</T>
            <T color="#ffe082" size={16} style={{ marginBottom: 14 }}>Different weights and bias create a different bend point.</T>
            <div style={{ display: "flex", justifyContent: "center" }}>{Graph({ points: neuron2, color: C.yellow, title: "Neuron 2: slopes down, then flat", annotations: [{ x: 5, y: 0, text: "bend!", color: C.yellow }] })}</div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>Add Both Neurons Together: a VALLEY Curve</T>
            <T color="#b8a9ff" size={16} style={{ marginBottom: 14 }}>Two bent lines create a valley shape - a curve. No straight line can do this.</T>
            <div style={{ display: "flex", justifyContent: "center" }}>{Graph({ points: combined, color: C.purple, title: "Combined: a valley shape", annotations: [{ x: 3, y: 2, text: "1st bend", color: C.cyan }, { x: 5, y: 2, text: "2nd bend", color: C.purple }] })}</div>
            <div style={{ marginTop: 14, fontSize: 15, textAlign: "center", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>0</span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span style={{ padding: "2px 6px", background: `${C.purple}15`, borderRadius: 3, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>5</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>3</span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span style={{ padding: "2px 6px", background: `${C.purple}15`, borderRadius: 3, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>2</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>4</span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span style={{ padding: "2px 6px", background: `${C.purple}15`, borderRadius: 3, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>2</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>7</span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span style={{ padding: "2px 6px", background: `${C.purple}15`, borderRadius: 3, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>4</span>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>Scale This Up</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
                <T color="#ffb74d" bold size={16}>2 neurons</T>
                <T color="rgba(255,255,255,0.6)" size={15}>→ 2 bends → valley/hill</T>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
                <T color="#ffb74d" bold size={16}>10 neurons</T>
                <T color="rgba(255,255,255,0.6)" size={15}>→ 10 bends → waves, zigzags</T>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
                <T color="#ffb74d" bold size={16}>1000 neurons</T>
                <T color="rgba(255,255,255,0.6)" size={15}>→ 1000 bends → any curve</T>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
                <T color="#ffb74d" bold size={16}>Millions</T>
                <T color="rgba(255,255,255,0.6)" size={15}>→ millions of bends → language, images, anything</T>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 14, background: `${C.orange}06`, border: `1px solid ${C.orange}20`, borderRadius: 8 }}>
              <T color={C.orange} bold size={16}>Without ReLU: 100 layers = 1 layer (straight line)</T>
              <T color={C.orange} bold size={16} style={{ marginTop: 10 }}>With ReLU: each neuron adds a bend → millions of bends → learn ANY pattern</T>
            </div>
          </Box>
        </Reveal>
      )}
      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const ForwardPass = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>The Network We Will Trace</T>
          <T color={C.bright} size={17} style={{ marginTop: 10, lineHeight: 1.6 }}>Let's trace EVERY number through a real network - no skipping, no hand-waving. Weights are on the edges, biases inside each neuron.</T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 520 270" style={{ display: "block", width: "100%", maxWidth: 520 }}>
              {/* Column labels */}
              <text x={65} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Input</text>
              <text x={260} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Hidden</text>
              <text x={455} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>Output</text>

              {/* Edges with weight labels 25% from source node */}
              {[
                { x1: 93, y1: 70, x2: 232, y2: 80, c: C.red, w: "0.5", oy: -9 },
                { x1: 93, y1: 80, x2: 232, y2: 175, c: C.red, w: "0.1", oy: -8 },
                { x1: 93, y1: 185, x2: 232, y2: 90, c: C.yellow, w: "50", oy: 12 },
                { x1: 93, y1: 190, x2: 232, y2: 180, c: C.yellow, w: "10", oy: -9 },
                { x1: 288, y1: 90, x2: 427, y2: 125, c: C.cyan, w: "0.8", oy: -9 },
                { x1: 288, y1: 180, x2: 427, y2: 140, c: C.orange, w: "0.2", oy: 12 },
              ].map(({ x1, y1, x2, y2, c, w, oy = 0 }, i) => {
                const t = 0.25;
                const lx = x1 + (x2 - x1) * t;
                const ly = y1 + (y2 - y1) * t + oy;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${c}45`} strokeWidth={1.5} />
                    <rect x={lx - 14} y={ly - 9} width={28} height={16} rx={3} fill="#08080dee" />
                    <text x={lx} y={ly + 4} fill={c} fontSize={11} textAnchor="middle" fontWeight={700}>{w}</text>
                  </g>
                );
              })}

              {/* Input nodes */}
              <circle cx={65} cy={78} r={28} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={65} y={73} fill={C.red} fontSize={15} textAnchor="middle" fontWeight={700}>x₁</text>
              <text x={65} y={91} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">1500</text>

              <circle cx={65} cy={190} r={28} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={65} y={185} fill={C.yellow} fontSize={15} textAnchor="middle" fontWeight={700}>x₂</text>
              <text x={65} y={203} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">3</text>

              {/* Hidden nodes with bias */}
              <circle cx={260} cy={85} r={28} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
              <text x={260} y={80} fill={C.cyan} fontSize={14} textAnchor="middle" fontWeight={700}>h₁</text>
              <text x={260} y={96} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">950</text>
              <text x={260} y={122} fill={C.cyan} fontSize={10} textAnchor="middle" fontWeight={600}>b=50</text>

              <circle cx={260} cy={185} r={28} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} />
              <text x={260} y={180} fill={C.orange} fontSize={14} textAnchor="middle" fontWeight={700}>h₂</text>
              <text x={260} y={196} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">185</text>
              <text x={260} y={222} fill={C.orange} fontSize={10} textAnchor="middle" fontWeight={600}>b=5</text>

              {/* Output node with bias */}
              <circle cx={455} cy={135} r={28} fill={`${C.green}15`} stroke={C.green} strokeWidth={2} />
              <text x={455} y={130} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>y</text>
              <text x={455} y={146} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">807</text>
              <text x={455} y={172} fill={C.green} fontSize={10} textAnchor="middle" fontWeight={600}>b=10</text>

              {/* Bottom label */}
              <text x={260} y={256} fill="rgba(255,255,255,0.4)" fontSize={13} textAnchor="middle" fontWeight={600}>2 inputs → 2 hidden neurons → 1 output</text>
            </svg>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color="#80deea" bold center size={20} style={{ marginBottom: 16 }}>LAYER 1: Each Hidden Neuron Processes the Inputs</T>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 0 }}>
              {[
                { name: "Neuron h₁", c: C.cyan, ct: "#80deea", label: "h₁",
                  muls: [{ input: "x₁", iv: "1500", wv: "0.5", r: "750" }, { input: "x₂", iv: "3", wv: "50", r: "150" }],
                  sumParts: "750 + 150", sumResult: "900", biasVal: "50", biasResult: "950", reluIn: "950", reluOut: "950", pos: true },
                { name: "Neuron h₂", c: C.orange, ct: "#ffb74d", label: "h₂",
                  muls: [{ input: "x₁", iv: "1500", wv: "0.1", r: "150" }, { input: "x₂", iv: "3", wv: "10", r: "30" }],
                  sumParts: "150 + 30", sumResult: "180", biasVal: "5", biasResult: "185", reluIn: "185", reluOut: "185", pos: true },
              ].map(({ name, c, ct, label, muls, sumParts, sumResult, biasVal, biasResult, reluIn, reluOut, pos }) => (
                <div key={name} style={{ padding: "14px", borderRadius: 10, background: `${c}06`, border: `1px solid ${c}15` }}>
                  <T color={c} bold size={17} center>{name}</T>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
                      <T color={C.red} bold size={14}>Step 1: Multiply</T>
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                        {muls.map(({ input, iv, wv, r }) => (
                          <div key={input} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: C.dim, fontSize: 13, minWidth: 20 }}>{input}:</span>
                            <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>{iv}</span>
                            <span style={{ color: C.dim, fontSize: 14 }}>×</span>
                            <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>{wv}</span>
                            <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                            <span style={{ padding: "2px 8px", background: `${c}15`, borderRadius: 4, color: c, fontSize: 15, fontWeight: 700 }}>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
                      <T color={C.yellow} bold size={14}>Step 2: Sum</T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>{sumParts}</span>
                        <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                        <span style={{ padding: "3px 10px", background: `${C.yellow}20`, borderRadius: 4, color: C.yellow, fontSize: 16, fontWeight: 700 }}>{sumResult}</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
                      <T color="#b8a9ff" bold size={14}>Step 3: Add bias</T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>{sumResult}</span>
                        <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                        <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>{biasVal}</span>
                        <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                        <span style={{ padding: "3px 10px", background: `${C.purple}20`, borderRadius: 4, color: C.purple, fontSize: 16, fontWeight: 700 }}>{biasResult}</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
                      <T color={C.green} bold size={14}>Step 4: ReLU</T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>{reluIn}</span>
                        <span style={{ color: "#80e8a5", fontSize: 15, fontWeight: 600 }}>is positive → keep →</span>
                        <span style={{ padding: "3px 10px", background: `${C.green}20`, borderRadius: 4, color: C.green, fontSize: 16, fontWeight: 700 }}>{reluOut}</span>
                        <span style={{ color: C.green, fontSize: 16 }}> ✓</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, textAlign: "center", padding: "8px", background: `${c}15`, borderRadius: 8 }}>
                    <T color={c} bold size={18}>{label} = {reluOut}</T>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}25`, textAlign: "center" }}>
              <T color={C.yellow} bold size={18}>Layer 1 output: [950, 185]</T>
            </div>
          </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color="#80e8a5" bold center size={20} style={{ marginBottom: 16 }}>LAYER 2: The Output Neuron</T>
            <T color="#80e8a5" size={16} style={{ marginBottom: 14 }}>The output neuron takes Layer 1's output [950, 185] as input.</T>
            <div style={{ padding: "14px", borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}15` }}>
              <T color={C.green} bold size={17} center>Output Neuron</T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
                  <T color={C.red} bold size={14}>Step 1: Multiply</T>
                  <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {[{ input: "h₁", iv: "950", wv: "0.8", r: "760" }, { input: "h₂", iv: "185", wv: "0.2", r: "37" }].map(({ input, iv, wv, r }) => (
                      <div key={input} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: C.dim, fontSize: 13, minWidth: 20 }}>{input}:</span>
                        <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 15, fontWeight: 600 }}>{iv}</span>
                        <span style={{ color: C.dim, fontSize: 14 }}>×</span>
                        <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>{wv}</span>
                        <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                        <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: C.green, fontSize: 15, fontWeight: 700 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.yellow}06`, border: `1px solid ${C.yellow}12` }}>
                  <T color={C.yellow} bold size={14}>Step 2: Sum</T>
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>760 + 37</span>
                    <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                    <span style={{ padding: "3px 10px", background: `${C.yellow}20`, borderRadius: 4, color: C.yellow, fontSize: 16, fontWeight: 700 }}>797</span>
                  </div>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}>
                  <T color="#b8a9ff" bold size={14}>Step 3: Add bias</T>
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>797</span>
                    <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                    <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>10</span>
                    <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                    <span style={{ padding: "3px 10px", background: `${C.purple}20`, borderRadius: 4, color: C.purple, fontSize: 16, fontWeight: 700 }}>807</span>
                  </div>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
                  <T color={C.green} bold size={14}>Step 4: ReLU</T>
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 15, fontWeight: 600 }}>807</span>
                    <span style={{ color: "#80e8a5", fontSize: 15, fontWeight: 600 }}>is positive → keep →</span>
                    <span style={{ padding: "3px 10px", background: `${C.green}20`, borderRadius: 4, color: C.green, fontSize: 16, fontWeight: 700 }}>807</span>
                    <span style={{ color: C.green, fontSize: 16 }}> ✓</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, textAlign: "center", padding: "8px", background: `${C.green}15`, borderRadius: 8 }}>
                <T color={C.green} bold size={18}>Output = 807</T>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}25`, textAlign: "center" }}>
              <T color={C.yellow} bold size={20}>Final Prediction: $807k</T>
            </div>
          </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
          <Box color={C.red} style={{ width: "100%" }}>
            <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>Our Prediction vs Actual</T>
            <div style={{ display: "flex", gap: 14, marginTop: 0 }}>
              <div style={{ flex: 1, padding: 14, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8, textAlign: "center" }}>
                <T color={C.yellow} bold size={15}>Predicted</T>
                <T color={C.yellow} bold size={18} style={{ marginTop: 8 }}>$807k</T>
              </div>
              <div style={{ flex: 1, padding: 14, background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 8, textAlign: "center" }}>
                <T color={C.red} bold size={15}>Actual</T>
                <T color={C.red} bold size={18} style={{ marginTop: 8 }}>$900k</T>
              </div>
            </div>
            <T color="rgba(255,255,255,0.5)" size={15} style={{ marginTop: 14, textAlign: "center" }}>We're off by $93k</T>
            <T color="#ef9a9a" size={17} style={{ marginTop: 16, lineHeight: 1.6 }}>
              How do we measure exactly how wrong we are? And more importantly - how do we IMPROVE? That's what comes next.
            </T>
          </Box>
      </Reveal>
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};


// Section 1, Chapters 1.8-1.12
// Loss Function, Learning, Derivatives, Backward Pass, Gradient Descent

export const LossFunction = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>Measuring Our Mistakes</T>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>Loss is a single number that measures how wrong our prediction was.</T>
          <div style={{ margin: "16px 0", padding: "16px", background: `${C.cyan}06`, borderRadius: 12, border: `1px solid ${C.cyan}12`, textAlign: "center" }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.cyan} bold size={16}>Loss</T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>(actual</span>
              <span style={{ color: C.dim, fontSize: 14 }}>−</span>
              <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 15, fontWeight: 600 }}>predicted)</span>
              <span style={{ color: C.dim, fontSize: 14 }}>²</span>
            </div>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>We square the error to make all errors positive (so they don't cancel out), and big errors get punished much more than small ones.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>Our Example Calculation</T>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>Predicted: 807k</T>
            </div>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>Actual: 900k</T>
            </div>
          </div>
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.yellow}25`, textAlign: "center" }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
              <T color={C.yellow} bold size={16}>Loss</T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>900</span>
              <span style={{ color: C.dim, fontSize: 14 }}>−</span>
              <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 15, fontWeight: 600 }}>807</span>
              <span style={{ color: C.dim, fontSize: 14 }}>)²</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
              <T color={C.yellow} bold size={16}>Loss</T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 15, fontWeight: 600 }}>(93)</span>
              <span style={{ color: C.dim, fontSize: 14 }}>²</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.yellow} bold size={18}>Loss</T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span style={{ padding: "3px 10px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 16, fontWeight: 700 }}>8,649</span>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>The Key Insight</T>
          <T color="#ff8a80" size={16} style={{ marginTop: 12 }}>The loss depends on the prediction. The prediction depends on weights and biases. So if we change a weight, the prediction changes, and the loss changes.</T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>There exists some perfect set of weights that makes the loss as small as possible. Our job is to find those values.</T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>But how do we know which direction to change them? We need to understand derivatives first.</T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 340 160" style={{ display: "block", width: "100%", maxWidth: 340 }}>
              {/* Baseline */}
              <line x1={30} y1={130} x2={210} y2={130} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

              {/* Predicted bar */}
              <rect x={40} y={40} width={60} height={90} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} rx={4} />
              <text x={70} y={85} fill={C.yellow} fontSize={16} textAnchor="middle" fontWeight={700}>807k</text>
              <text x={70} y={148} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={600}>Predicted</text>

              {/* Actual bar - taller */}
              <rect x={130} y={15} width={60} height={115} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} rx={4} />
              <text x={160} y={75} fill={C.red} fontSize={16} textAnchor="middle" fontWeight={700}>900k</text>
              <text x={160} y={148} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={600}>Actual</text>

              {/* Error bracket */}
              <line x1={105} y1={40} x2={125} y2={40} stroke={C.orange} strokeWidth={2} />
              <line x1={115} y1={15} x2={115} y2={40} stroke={C.orange} strokeWidth={2} />
              <polygon points="115,15 112,21 118,21" fill={C.orange} />
              <polygon points="115,40 112,34 118,34" fill={C.orange} />
              <text x={115} y={10} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>93k gap</text>

              {/* Chain: weights → prediction → loss */}
              <text x={255} y={50} fill={C.purple} fontSize={11} fontWeight={600} textAnchor="middle">weights</text>
              <text x={255} y={80} fill={C.dim} fontSize={18} textAnchor="middle">↓</text>
              <text x={255} y={100} fill={C.cyan} fontSize={11} fontWeight={600} textAnchor="middle">prediction</text>
              <text x={255} y={120} fill={C.dim} fontSize={18} textAnchor="middle">↓</text>
              <text x={255} y={140} fill={C.orange} fontSize={11} fontWeight={600} textAnchor="middle">loss</text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>Why Square the Error?</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>1. Big Errors Get Punished More</T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>Error of 2 gives loss of 4. Error of 10 gives loss of 100. A 5x error becomes 25x loss.</T>
            </div>
            <div style={{ padding: "12px", background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={16}>2. Smooth Curve for Derivatives</T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>The derivative of x² is 2x (simple, works everywhere). Backpropagation needs smooth derivatives to work cleanly.</T>
            </div>
            <div style={{ padding: "12px", background: `${C.purple}06`, borderRadius: 8, border: `1px solid ${C.purple}12` }}>
              <T color={C.purple} bold size={16}>3. One Clear Minimum</T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>Squared loss creates a parabolic bowl - one clear lowest point. Gradient descent rolls down smoothly to find it.</T>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const WhatIsLearning = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>What Changes During Training?</T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>When a neural network is first created, all weights and biases are random numbers. It knows nothing. It makes garbage predictions.</T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>Our network predicted 807k but the correct answer was 900k. That's how bad random weights are.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>A Network Starts Dumb</T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16 }}>Learning is adjusting weights and biases until predictions get good. The loop has 4 steps:</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>1</div>
              <div style={{ flex: 1 }}>
                <T color={C.cyan} bold size={16}>Forward Pass</T>
                <T color={C.dim} size={14}>Feed input through network, get prediction</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>2</div>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold size={16}>Calculate Loss</T>
                <T color={C.dim} size={14}>Compare prediction with correct answer</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>3</div>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold size={16}>Backward Pass</T>
                <T color={C.dim} size={14}>Figure out which weights caused the error</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>4</div>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold size={16}>Update Weights</T>
                <T color={C.dim} size={14}>Nudge each weight to reduce error</T>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", background: `${C.purple}06`, borderRadius: 8, border: `1px solid ${C.purple}12` }}>
            <T color={C.purple} bold size={16}>↻ Repeat until loss is small enough</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>Backpropagation + Gradient Descent</T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>This process has a name: "Backpropagation + Gradient Descent."</T>
          <div style={{ marginTop: 16, padding: "12px", background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}12` }}>
            <T color={C.orange} bold size={16}>Backpropagation</T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>Step 3 - figuring out which weights to blame for the error</T>
          </div>
          <div style={{ marginTop: 12, padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12` }}>
            <T color={C.green} bold size={16}>Gradient Descent</T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>Step 4 - actually updating the weights</T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>Together, they ARE "training." When someone says "training a model," they mean running this loop millions of times.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={20}>After Millions of Loops</T>
          <T color="#ffb3e6" size={16} style={{ marginTop: 12 }}>After running this loop millions of times, the weights converge to values that make good predictions. The network has "learned."</T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>Those final weight values ARE the model. When you download GPT-3, you are downloading 175 billion carefully-tuned weight values that have been optimized through this exact process.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const Derivatives = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>How Sensitive Is the Output?</T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>A derivative answers one simple question: "If I nudge the input a tiny bit, how much does the output change?"</T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>No Greek symbols, no limits, no complicated math. Just: small change in, how much change out?</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>Concrete Example</T>
          <T color={C.dim} size={16} style={{ marginBottom: 12 }}>Our network: weight = 0.5, input = 1500, bias = 50</T>
          <div style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, marginBottom: 12, border: `1px solid ${C.cyan}12` }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
              <T color={C.cyan} bold size={14}>Prediction</T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 14, fontWeight: 600 }}>1500</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>0.5</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>50</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 14, fontWeight: 600 }}>800</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
              <T color={C.cyan} bold size={14}>Actual</T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>900</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.cyan} bold size={14}>Loss</T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>(900</span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 14, fontWeight: 600 }}>800)²</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>10,000</span>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginBottom: 16 }}>Now what if we nudge the weight to 0.6?</T>
          <div style={{ padding: "12px", background: `${C.yellow}06`, borderRadius: 8, border: `1px solid ${C.yellow}12`, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
              <T color={C.yellow} bold size={14}>New Prediction</T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 14, fontWeight: 600 }}>1500</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>0.6</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>50</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>950</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.yellow} bold size={14}>New Loss</T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>(900</span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>950)²</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 14, fontWeight: 600 }}>2,500</span>
            </div>
          </div>
          <div style={{ padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12` }}>
            <T color={C.green} size={16}>Weight changed by +0.1 → Loss changed by -7,500. Increasing the weight made loss go DOWN. Good direction!</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>The Derivative Ratio</T>
          <T color="#ff8a80" size={16} style={{ marginBottom: 16, marginTop: 12 }}>The derivative is this ratio:</T>
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.purple}25`, textAlign: "center" }}>
            <T color={C.purple} bold size={18} style={{ fontFamily: "monospace", marginBottom: 12 }}>∂ Loss / ∂ weight</T>
            <T color={C.dim} size={14} style={{ marginBottom: 8 }}>how much loss changed / how much weight changed</T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>The ∂ symbol (read "partial") just means "tiny change in." So ∂Loss/∂weight means "the tiny change in loss caused by a tiny change in weight."</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>What the Derivative Tells Us</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>Negative (-)</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Increasing weight → loss goes DOWN → increase the weight!</T>
            </div>
            <div style={{ padding: "12px", background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={16}>Positive (+)</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Increasing weight → loss goes UP → decrease the weight!</T>
            </div>
            <div style={{ padding: "12px", background: `${C.yellow}06`, borderRadius: 8, border: `1px solid ${C.yellow}12` }}>
              <T color={C.yellow} bold size={16}>Large Number</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Loss is very sensitive to this weight → matters a lot</T>
            </div>
            <div style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, border: `1px solid ${C.cyan}12` }}>
              <T color={C.cyan} bold size={16}>Small Number</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Loss barely changes → matters little</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>The Derivative is Your Compass</T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>The derivative tells us which direction to adjust each weight to reduce loss.</T>
          <T color={C.bright} size={16} style={{ marginTop: 16 }}>With multiple weights, we turn one knob at a time. ∂L/∂w means "how does loss change when we nudge only w, holding everything else constant?" That is what "partial" means - changing one thing, leaving everything else still.</T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 320 200" maxWidth="100%" style={{ maxWidth: 320 }}>
              {/* Axes */}
              <line x1={40} y1={160} x2={280} y2={160} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <line x1={40} y1={160} x2={40} y2={30} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Axis labels */}
              <text x={260} y={175} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>weight</text>
              <text x={20} y={25} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>loss</text>

              {/* Parabola (loss curve) */}
              <path d="M 50 140 Q 80 70 110 60 Q 140 55 160 60 Q 190 70 220 140" fill="none" stroke={C.purple} strokeWidth={2.5} />

              {/* Current point on curve */}
              <circle cx={110} cy={60} r={5} fill={C.yellow} stroke={C.bright} strokeWidth={2} />
              <text x={110} y={40} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>current</text>

              {/* Tangent line (derivative) */}
              <line x1={70} y1={90} x2={150} y2={30} stroke={C.red} strokeWidth={2} />

              {/* Slope annotation */}
              <text x={150} y={15} fill={C.red} fontSize={12} fontWeight={700}>slope = derivative</text>

              {/* Direction arrow showing negative slope */}
              <path d="M 160 25 L 180 35" stroke={C.green} strokeWidth={2} />
              <polygon points="180,35 176,32 179,38" fill={C.green} />
              <text x={190} y={30} fill={C.green} fontSize={11} fontWeight={600}>→ go this way</text>

              {/* Minimum point */}
              <circle cx={160} cy={60} r={4} fill={C.cyan} stroke={C.bright} strokeWidth={1.5} />
              <text x={160} y={75} fill={C.cyan} fontSize={11} textAnchor="middle">minimum</text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const BackwardPass = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>Tracing the Blame Backwards</T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16, marginTop: 12 }}>There are MULTIPLE steps between weight and loss. We have to trace through all of them:</T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "weight", val: "w = 0.5", c: C.red },
              { label: "compute", val: "1500 × w + 50", c: C.orange },
              { label: "prediction", val: "800", c: C.cyan },
              { label: "subtract actual", val: "800 - 900", c: C.yellow },
              { label: "error", val: "-100", c: C.purple },
              { label: "square it", val: "(-100)²", c: C.green },
              { label: "loss", val: "10,000", c: C.red },
            ].map(({ label, val, c }, i) => (
              <div key={label} style={{ display: "contents" }}>
                {i > 0 && <T color={C.dim} bold size={18}>→</T>}
                <div style={{ padding: "8px 10px", background: `${c}06`, borderRadius: 8, border: `1px solid ${c}12`, textAlign: "center", minWidth: 70 }}>
                  <T color={C.dim} size={11} center>{label}</T>
                  <T color={c} bold size={14} center style={{ marginTop: 2 }}>{val}</T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>The Chain Rule: Work Backwards</T>
          <T color="#b8a9ff" size={16} style={{ marginBottom: 16, marginTop: 12 }}>Work backwards, one step at a time. Multiply all the derivatives together.</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>Step 1: Loss with respect to Error</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>loss = error²</T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>derivative = 2 x error = 2 x (-100) = <strong style={{ color: C.red }}>-200</strong></T>
              </div>
            </div>
            <div style={{ padding: "12px", background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={16}>Step 2: Error with respect to Prediction</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>error = prediction - 900</T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>derivative = <strong style={{ color: C.orange }}>1</strong></T>
              </div>
            </div>
            <div style={{ padding: "12px", background: `${C.yellow}06`, borderRadius: 8, border: `1px solid ${C.yellow}12` }}>
              <T color={C.yellow} bold size={16}>Step 3: Prediction with respect to Weight</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>prediction = 1500 x w + 50</T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>derivative = <strong style={{ color: C.yellow }}>1500</strong></T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>Multiply Them Together</T>
          <T color="#5eb3ff" size={16} style={{ marginBottom: 16, marginTop: 12 }}>Now multiply them all together (that is the chain rule):</T>
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.purple}25`, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>∂Loss/∂weight =</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 15, fontWeight: 600 }}>-200</span>
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.blue}15`, borderRadius: 4, color: "#5eb3ff", fontSize: 15, fontWeight: 600 }}>1</span>
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 15, fontWeight: 600 }}>1500</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ color: C.purple, fontSize: 18, fontWeight: 700 }}>=</span>
              <span style={{ padding: "3px 10px", background: `${C.red}15`, borderRadius: 4, color: C.red, fontSize: 18, fontWeight: 700 }}>-300,000</span>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>This is negative - increasing weight will decrease loss. The magnitude (300,000) tells us the loss is very sensitive to this weight.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>Same for Bias</T>
          <T color="#80e8a5" size={16} style={{ marginBottom: 12, marginTop: 12 }}>The same process works for bias:</T>
          <div style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, border: `1px solid ${C.cyan}12`, marginBottom: 16 }}>
            <T color={C.cyan} bold size={16} style={{ fontFamily: "monospace" }}>∂Loss/∂bias = -200 × 1 × 1 = -200</T>
          </div>
          <T color={C.dim} size={16} style={{ marginBottom: 12 }}>The prediction formula is prediction = 1500w + bias. So the derivative of prediction with respect to bias is 1 (bias is directly added).</T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>Now we have a gradient for every learnable parameter: weight and bias. Time to update them.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const GradientDescent = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>The Weight Update Rule</T>
          <T color="#80deea" size={16} style={{ marginBottom: 16, marginTop: 12 }}>Each weight gets updated using this rule:</T>
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: `1px solid ${C.green}25`, textAlign: "center" }}>
            <T color={C.green} bold size={18} style={{ fontFamily: "monospace" }}>new_weight = old_weight - learning_rate × gradient</T>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "old_weight", desc: "the weight's current value (before this update)", c: C.red },
              { label: "gradient", desc: "how much loss changes when this weight changes (from backward pass)", c: C.yellow },
              { label: "learning_rate", desc: "a small number (like 0.001) that controls step size", c: C.purple },
              { label: "new_weight", desc: "the updated value we'll use going forward", c: C.green },
            ].map(({ label, desc, c }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ padding: "4px 8px", background: `${c}10`, borderRadius: 6, border: `1px solid ${c}20`, minWidth: 110, textAlign: "center" }}>
                  <code style={{ color: c, fontSize: 13, fontWeight: 700 }}>{label}</code>
                </div>
                <T color={C.dim} size={14}>{desc}</T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>We move in the OPPOSITE direction of the gradient. If the gradient says "loss increases when you go right," we go left.</T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <svg viewBox="0 0 320 180" maxWidth="100%" style={{ maxWidth: 320 }}>
              {/* Axes */}
              <line x1={40} y1={140} x2={280} y2={140} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <line x1={40} y1={140} x2={40} y2={20} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Axis labels */}
              <text x={260} y={155} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>weight</text>
              <text x={15} y={20} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>loss</text>

              {/* Loss curve (parabola) */}
              <path d="M 50 110 Q 80 60 110 50 Q 140 45 160 50 Q 190 60 220 110" fill="none" stroke={C.cyan} strokeWidth={2.5} />

              {/* Ball at starting position (high loss) */}
              <circle cx={80} cy={70} r={8} fill={C.orange} stroke={C.bright} strokeWidth={2} />
              <text x={80} y={95} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>step 1</text>

              {/* Ball after one update */}
              <circle cx={115} cy={52} r={8} fill={C.yellow} stroke={C.bright} strokeWidth={2} opacity={0.7} />
              <text x={115} y={77} fill={C.yellow} fontSize={11} textAnchor="middle">step 2</text>

              {/* Ball near minimum */}
              <circle cx={150} cy={48} r={8} fill={C.green} stroke={C.bright} strokeWidth={2} opacity={0.5} />
              <text x={150} y={73} fill={C.green} fontSize={11} textAnchor="middle">step N</text>

              {/* Arrows showing descent */}
              <path d="M 85 62 L 108 56" stroke={C.red} strokeWidth={2} fill="none" markerEnd="url(#arrowhead)" />
              <path d="M 120 50 L 143 48" stroke={C.red} strokeWidth={2} fill="none" markerEnd="url(#arrowhead)" />

              {/* Gradient vectors at each step */}
              <line x1={80} y1={70} x2={92} y2={58} stroke={`${C.red}70`} strokeWidth={2} strokeDasharray="3,2" />
              <line x1={115} y1={52} x2={130} y2={48} stroke={`${C.red}70`} strokeWidth={2} strokeDasharray="3,2" />

              {/* Minimum annotation */}
              <text x={160} y={30} fill={C.cyan} fontSize={11} fontWeight={600}>minimum</text>
              <line x1={160} y1={35} x2={160} y2={45} stroke={C.cyan} strokeWidth={1.5} />
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>Learning Rate Scaling</T>
          <T color="#b8a9ff" size={16} style={{ marginBottom: 12, marginTop: 12 }}>Our gradient is -300,000. If applied directly: new_w = 0.5 - (-300,000) = 300,000.5. Insane!</T>
          <T color={C.dim} size={16} style={{ marginBottom: 16 }}>The learning rate (like 0.0000001) scales the step to something reasonable:</T>
          <div style={{ padding: "12px", background: `${C.yellow}06`, borderRadius: 8, border: `1px solid ${C.yellow}12`, marginBottom: 12 }}>
            <T color={C.yellow} bold size={14}>Weight update:</T>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_w =</span>
              <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 13, fontWeight: 600 }}>0.5</span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ color: C.dim, fontSize: 13 }}>(</span>
              <span style={{ padding: "2px 6px", background: `${C.blue}15`, borderRadius: 3, color: "#5eb3ff", fontSize: 13, fontWeight: 600 }}>0.0000001</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>-300,000</span>
              <span style={{ color: C.dim, fontSize: 13 }}>)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_w =</span>
              <span style={{ padding: "2px 6px", background: `${C.yellow}15`, borderRadius: 3, color: "#ffe082", fontSize: 13, fontWeight: 600 }}>0.5</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>0.03</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 700 }}>0.53</span>
            </div>
          </div>
          <div style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, border: `1px solid ${C.cyan}12` }}>
            <T color={C.cyan} bold size={14}>Bias update:</T>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_b =</span>
              <span style={{ padding: "2px 6px", background: `${C.cyan}15`, borderRadius: 3, color: "#80deea", fontSize: 13, fontWeight: 600 }}>50</span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ color: C.dim, fontSize: 13 }}>(</span>
              <span style={{ padding: "2px 6px", background: `${C.blue}15`, borderRadius: 3, color: "#5eb3ff", fontSize: 13, fontWeight: 600 }}>0.0000001</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>-200</span>
              <span style={{ color: C.dim, fontSize: 13 }}>)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_b =</span>
              <span style={{ padding: "2px 6px", background: `${C.cyan}15`, borderRadius: 3, color: "#80deea", fontSize: 13, fontWeight: 600 }}>50</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>0.00002</span>
              <span style={{ color: C.dim, fontSize: 13 }}>≈</span>
              <span style={{ padding: "2px 6px", background: `${C.cyan}15`, borderRadius: 3, color: "#80deea", fontSize: 13, fontWeight: 700 }}>50.00002</span>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>Verify the Improvement</T>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", marginTop: 12 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12`, flex: 1, minWidth: 180 }}>
              <T color={C.red} bold size={14}>Before Update</T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>w=</span>
                  <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>0.5</span>
                  <span style={{ color: C.dim, fontSize: 13 }}>, b=</span>
                  <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>50</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>pred=</span>
                  <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>800</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>loss=</span>
                  <span style={{ padding: "2px 6px", background: `${C.red}15`, borderRadius: 3, color: C.red, fontSize: 13, fontWeight: 700 }}>10,000</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12`, flex: 1, minWidth: 180 }}>
              <T color={C.green} bold size={14}>After Update</T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>w=</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>0.53</span>
                  <span style={{ color: C.dim, fontSize: 13 }}>, b≈</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>50</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>pred=</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>1500</span>
                  <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>0.53</span>
                  <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>50</span>
                  <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: "#81c784", fontSize: 13, fontWeight: 600 }}>845</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>loss=</span>
                  <span style={{ padding: "2px 6px", background: `${C.green}15`, borderRadius: 3, color: C.green, fontSize: 13, fontWeight: 700 }}>3,025</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px", background: `${C.bright}20`, borderRadius: 8, border: `1px solid ${C.bright}40` }}>
            <T color={C.bright} size={16}>Loss dropped from 10,000 to 3,025! Repeat thousands of times and loss approaches zero.</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>The Landscape Analogy</T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16, marginTop: 12 }}>Imagine you are blindfolded on a hilly landscape. Height represents loss. You want to reach the lowest valley.</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>Start (w=0.5)</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>High up on the hill, loss is 10,000</T>
            </div>
            <div style={{ padding: "12px", background: `${C.orange}06`, borderRadius: 8, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={16}>Gradient tells us the slope</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Which direction is downhill? That is what the derivative shows.</T>
            </div>
            <div style={{ padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>Goal (minimum loss)</T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>Weights that make excellent predictions, loss near zero</T>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>Learning rate too big: you jump over the valley. Learning rate too small: takes forever. Just right: steady descent to the minimum.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>The Full Picture</T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>That is backpropagation + gradient descent!</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>1</div>
              <T color={C.dim} size={16}>Forward - Feed input through network → get prediction</T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>2</div>
              <T color={C.dim} size={16}>Loss - Compare prediction with correct answer</T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>3</div>
              <T color={C.dim} size={16}>Backward - Chain rule to find gradients</T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#08080d" }}>4</div>
              <T color={C.dim} size={16}>Update - Nudge weights opposite to gradient</T>
            </div>
          </div>
          <T color={C.bright} size={16} style={{ marginTop: 16 }}>In real networks with millions of weights, the exact same process happens - just with longer chains and more derivatives. The math scales, the idea stays identical.</T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};



export const Vectors = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>From One Number to Many</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>A vector is just a list of numbers.</T>
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center", width: 100 }}>
                <T size={14} color={C.mid}>Scalar (one number)</T>
              </div>
              <div style={{ width: 32 }} />
              <div style={{ textAlign: "center" }}>
                <T size={14} color={C.mid}>Vector (list)</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
              <div style={{ width: 100, height: 100, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                <T size={24} bold color={C.cyan}>42</T>
              </div>
              <div style={{ fontSize: 32, color: C.mid, lineHeight: 1 }}>→</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[3, 7, 2, 5].map((num, i) => (
                  <div key={i} style={{ width: 90, height: 90, background: `${[C.cyan, C.green, C.yellow, C.orange][i]}15`, border: `1px solid ${[C.cyan, C.green, C.yellow, C.orange][i]}30`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                    <T size={20} bold color={[C.cyan, C.green, C.yellow, C.orange][i]}>{num}</T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>A single number describes one thing. A vector bundles multiple numbers together.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>In Neural Networks, Everything is Vectors</T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 12 }}>Inputs? A vector. Hidden layer outputs? Vectors. Every layer takes a vector in and produces a vector out.</T>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <div style={{ textAlign: "center", width: 152 }}>
                <T size={14} color={C.mid}>Input Vector</T>
              </div>
              <div style={{ width: 24 }} />
              <div style={{ textAlign: "center", width: 152 }}>
                <T size={14} color={C.mid}>Output Vector</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", marginTop: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[1500, 3].map((n, i) => (
                  <div key={i} style={{ width: 70, height: 50, background: `${C.green}20`, border: `1px solid ${C.green}40`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 14, color: C.green, fontFamily: "monospace", fontWeight: "bold" }}>
                    {n}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 24, color: C.mid, lineHeight: 1 }}>→</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[950, 185].map((n, i) => (
                  <div key={i} style={{ width: 70, height: 50, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 14, color: C.orange, fontFamily: "monospace", fontWeight: "bold" }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>Words Become Vectors</T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 12 }}>A word like "cat" can't go into a neural network as letters. Instead, it becomes a vector of 512 numbers, where each number captures some aspect of meaning.</T>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 14 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 10 }}>The word "cat" - first 8 of 512 numbers:</T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[0.8, -0.2, 0.5, 0.1, -0.7, 0.3, 0.9, -0.4].map((num, i) => {
                const bgColor = num > 0 ? C.green : C.red;
                return (
                  <div key={i} style={{ background: `${bgColor}25`, border: `1px solid ${bgColor}40`, padding: "6px 10px", borderRadius: 4, color: bgColor, fontSize: 13, fontFamily: "monospace", fontWeight: "bold" }}>
                    {num.toFixed(1)}
                  </div>
                );
              })}
            </div>
            <T size={13} color={C.dim} style={{ marginTop: 8 }}>...504 more numbers</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>Similar Words Have Similar Vectors</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "12px 14px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} bold color={C.green}>"cat"</T>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[0.80, -0.20, 0.50, 0.10].map((n, i) => (
                  <div key={i} style={{ flex: 1, background: `${C.green}20`, border: `1px solid ${C.green}40`, padding: 8, borderRadius: 4, color: C.green, fontSize: 13, fontFamily: "monospace", textAlign: "center", fontWeight: "bold" }}>
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 14px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} bold color={C.green}>"kitten"</T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>Very similar to cat</T>
              <div style={{ display: "flex", gap: 6 }}>
                {[0.75, -0.18, 0.48, 0.08].map((n, i) => (
                  <div key={i} style={{ flex: 1, background: `${C.green}20`, border: `1px solid ${C.green}40`, padding: 8, borderRadius: 4, color: C.green, fontSize: 13, fontFamily: "monospace", textAlign: "center", fontWeight: "bold" }}>
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 14px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} bold color={C.red}>"pizza"</T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>Completely different</T>
              <div style={{ display: "flex", gap: 6 }}>
                {[-0.30, 0.60, -0.10, 0.90].map((n, i) => (
                  <div key={i} style={{ flex: 1, background: `${C.red}20`, border: `1px solid ${C.red}40`, padding: 8, borderRadius: 4, color: C.red, fontSize: 13, fontFamily: "monospace", textAlign: "center", fontWeight: "bold" }}>
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 16, textAlign: "center" }}>The network learns these numbers during training. Similar meanings lead to similar vectors.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const DotProductIntro = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Multiplying Vectors Together</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>How do you compare two vectors? The dot product.</T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>It is the most important operation in all of AI.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>The Recipe: Multiply Matching Positions, Then Add Up</T>
          <div style={{ marginTop: 14, padding: "14px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.purple}25`, textAlign: "center" }}>
            <T size={17} bold color={C.purple}>A = [2, 3]   B = [4, 1]</T>
            <div style={{ marginTop: 12, fontSize: 15 }}>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <T color="#b8a9ff" bold size={15}>Step 1:</T>
                <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>2</span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>4</span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>8</span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>3</span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>1</span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>3</span>
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <T color="#b8a9ff" bold size={15}>Step 2:</T>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>8</span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 14, fontWeight: 600 }}>3</span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 14, fontWeight: 600 }}>11</span>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.purple}30` }}>
              <T size={18} bold color={C.purple}>A · B = 11</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>What Does It Mean?</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>[2, 3] · [4, 6] = 26</T>
              <div style={{ width: "100%", height: 14, background: `${C.green}40`, borderRadius: 4 }} />
              <T size={13} color={C.green} style={{ marginTop: 6 }}>Same direction (similar)</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>[2, 3] · [4, 1] = 11</T>
              <div style={{ width: "100%", height: 14, background: `${C.yellow}40`, borderRadius: 4 }} />
              <T size={13} color={C.yellow} style={{ marginTop: 6 }}>Somewhat similar</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>[2, 3] · [0, 0] = 0</T>
              <div style={{ width: "100%", height: 14, background: `${C.mid}40`, borderRadius: 4 }} />
              <T size={13} color={C.mid} style={{ marginTop: 6 }}>Zero vector</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>[2, 3] · [-2, -3] = -13</T>
              <div style={{ width: "100%", height: 14, background: `${C.red}40`, borderRadius: 4 }} />
              <T size={13} color={C.red} style={{ marginTop: 6 }}>Opposite direction</T>
            </div>
          </div>
          <div style={{ padding: "10px 12px", background: `${C.red}06`, border: `1px solid ${C.red}15`, borderRadius: 8, marginTop: 14 }}>
            <T size={14} color={C.dim}><span style={{ color: "#ef9a9a", fontWeight: "bold" }}>Note on cosine similarity:</span> The dot product is affected by magnitude. When you only care about direction, normalize to length 1 first. That is cosine similarity.</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>Wait - THIS is What a Neuron Does!</T>
          <T color="#ffe082" size={15} style={{ marginTop: 12 }}>A neuron takes inputs [38.5, 1.0, 0.8] and weights [0.6, 0.3, 0.1] and computes:</T>
          <div style={{ padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}25`, textAlign: "center", marginTop: 12 }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 14, fontWeight: 600 }}>38.5</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>0.6</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.yellow}15`, borderRadius: 4, color: "#ffe082", fontSize: 14, fontWeight: 600 }}>1.0</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>0.3</span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.purple}15`, borderRadius: 4, color: "#b8a9ff", fontSize: 14, fontWeight: 600 }}>0.8</span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 14, fontWeight: 600 }}>0.1</span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.cyan}15`, borderRadius: 4, color: "#80deea", fontSize: 14, fontWeight: 600 }}>23.48</span>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 12 }}>That is a dot product! A neuron IS a dot product machine.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const Matrices = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>From 1D to 2D: The Grid</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>A matrix is a grid of numbers arranged in rows and columns.</T>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center", width: 54 }}><T size={14} color={C.mid}>A vector is 1D</T></div>
              <div style={{ width: 32 }} />
              <div style={{ textAlign: "center", width: 170 }}><T size={14} color={C.mid}>A matrix is 2D</T></div>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[10, 20, 30].map((n, i) => (
                  <div key={i} style={{ width: 54, height: 54, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
                    <span style={{ color: C.cyan, fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{n}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 32, color: C.mid }}>→</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[[1, 2, 3], [4, 5, 6]].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div key={j} style={{ width: 54, height: 54, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
                        <span style={{ color: C.cyan, fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{n}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>The matrix on the right is 2 rows × 3 columns. We write this as a 2×3 matrix.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>A Matrix Transforms a Vector Into a New Vector</T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 10 }}>Each ROW does a dot product with the input vector.</T>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <div style={{ textAlign: "center", width: 112 }}><T size={14} color={C.mid}>Matrix (3 rows)</T></div>
              <div style={{ width: 20 }} />
              <div style={{ textAlign: "center", width: 54 }}><T size={14} color={C.mid}>Vector</T></div>
              <div style={{ width: 20 }} />
              <div style={{ textAlign: "center", width: 54 }}><T size={14} color={C.mid}>Result</T></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[[1, 2], [3, 4], [5, 6]].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div key={j} style={{ width: 54, height: 54, background: `${C.purple}15`, border: `1px solid ${C.purple}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontFamily: "monospace", fontWeight: "bold", color: C.purple, borderRadius: 6 }}>
                        {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <T size={20} color={C.mid}>×</T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[2, 3].map((n, i) => (
                  <div key={i} style={{ width: 54, height: 54, background: `${C.purple}25`, border: `1px solid ${C.purple}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontFamily: "monospace", fontWeight: "bold", color: C.purple, borderRadius: 6 }}>
                    {n}
                  </div>
                ))}
              </div>
              <T size={20} color={C.mid}>=</T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[8, 20, 32].map((n, i) => (
                  <div key={i} style={{ width: 54, height: 54, background: `${C.orange}15`, border: `1px solid ${C.orange}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontFamily: "monospace", fontWeight: "bold", color: C.orange, borderRadius: 6 }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>The Math Step-by-Step</T>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 12 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>Row 1 [1, 2] · [2, 3]:</T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>1</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>2</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>2</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>3</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>2</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>6</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 13, fontWeight: 600 }}>8</span>
            </div>
          </div>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 10 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>Row 2 [3, 4] · [2, 3]:</T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>3</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>2</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>4</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>3</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>6</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>12</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 13, fontWeight: 600 }}>18</span>
            </div>
          </div>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 10 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>Row 3 [5, 6] · [2, 3]:</T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>5</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>2</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>6</span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span style={{ padding: "2px 8px", background: `${C.red}15`, borderRadius: 4, color: "#ef9a9a", fontSize: 13, fontWeight: 600 }}>3</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>10</span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span style={{ padding: "2px 8px", background: `${C.green}15`, borderRadius: 4, color: "#80e8a5", fontSize: 13, fontWeight: 600 }}>18</span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span style={{ padding: "2px 8px", background: `${C.orange}15`, borderRadius: 4, color: "#ffb74d", fontSize: 13, fontWeight: 600 }}>28</span>
            </div>
          </div>
          <T size={15} color="#ef9a9a" style={{ marginTop: 14 }}>Result: [8, 18, 28]</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>This is What a Layer Does!</T>
          <T color="#ffe082" size={15} style={{ marginTop: 10 }}>In chapter 1.2, a layer with weights [[0.6, 0.3, 0.1], [0.2, 0.8, 0.5]] transforming input [10, 20, 30] is matrix multiplication.</T>
          <div style={{ padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}25`, marginTop: 12, textAlign: "center" }}>
            <T size={16} color={C.yellow} bold style={{ fontFamily: "monospace", marginBottom: 8 }}>Layer weights are a matrix.</T>
            <T size={14} color={C.dim}>Passing input through a layer IS matrix multiplication.</T>
          </div>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const LayerIsMatMul = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Connecting the Dots</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>You have already seen everything. A neural network layer is just a matrix multiplication.</T>
          <T size={15} color="#80deea" style={{ marginTop: 12 }}>Let us connect the dots.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>From Chapter 1.2: A Neuron Sums Weighted Inputs</T>
          <div style={{ padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.purple}25`, marginTop: 12, textAlign: "center" }}>
            <T size={15} color={C.purple} bold style={{ fontFamily: "monospace" }}>neuron_output = 38.5×0.6 + 1.0×0.3 + 0.8×0.1</T>
          </div>
          <T size={15} color="#b8a9ff" style={{ marginTop: 12 }}>This IS a dot product of inputs and weights.</T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>A Layer Has Many Neurons</T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>If a layer has 3 neurons, you compute 3 separate dot products. Each neuron has its own weights. Stack them as matrix rows - now you have a matrix.</T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <svg viewBox="0 0 480 280" style={{ display: "block", width: "100%", maxWidth: 480 }}>
              {/* Column labels */}
              <text x={60} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Inputs</text>
              <text x={340} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>Neurons (Layer)</text>

              {/* Edges with weight labels placed 25% from source node */}
              {[
                { x1: 88, y1: 60, x2: 312, y2: 60, c: C.red, w: "0.6", oy: -9 },
                { x1: 88, y1: 60, x2: 312, y2: 140, c: C.red, w: "0.2", oy: -8 },
                { x1: 88, y1: 60, x2: 312, y2: 220, c: C.red, w: "0.4", oy: -8 },
                { x1: 88, y1: 140, x2: 312, y2: 60, c: C.yellow, w: "0.3", oy: 12 },
                { x1: 88, y1: 140, x2: 312, y2: 140, c: C.yellow, w: "0.8", oy: -9 },
                { x1: 88, y1: 140, x2: 312, y2: 220, c: C.yellow, w: "0.1", oy: -8 },
                { x1: 88, y1: 220, x2: 312, y2: 60, c: C.green, w: "0.1", oy: 12 },
                { x1: 88, y1: 220, x2: 312, y2: 140, c: C.green, w: "0.5", oy: 12 },
                { x1: 88, y1: 220, x2: 312, y2: 220, c: C.green, w: "0.9", oy: -9 },
              ].map(({ x1, y1, x2, y2, c, w, oy = 0 }, i) => {
                const t = 0.25;
                const lx = x1 + (x2 - x1) * t;
                const ly = y1 + (y2 - y1) * t + oy;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${c}30`} strokeWidth={1.2} />
                    <rect x={lx - 14} y={ly - 9} width={28} height={16} rx={3} fill="#08080dee" />
                    <text x={lx} y={ly + 4} fill={c} fontSize={10} textAnchor="middle" fontWeight={700}>{w}</text>
                  </g>
                );
              })}

              {/* Input nodes */}
              {[
                { y: 60, label: "fever", val: "38.5", c: C.red },
                { y: 140, label: "cough", val: "1", c: C.yellow },
                { y: 220, label: "fatigue", val: "0.8", c: C.green },
              ].map(({ y, label, val, c }) => (
                <g key={label}>
                  <circle cx={60} cy={y} r={24} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text x={60} y={y - 6} fill={c} fontSize={10} textAnchor="middle" fontWeight={700}>{label}</text>
                  <text x={60} y={y + 10} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">{val}</text>
                </g>
              ))}

              {/* Neuron nodes with outputs */}
              {[
                { y: 60, label: "Flu", val: "23.5", c: C.red, ct: "#ef9a9a" },
                { y: 140, label: "Cold", val: "31.3", c: C.orange, ct: "#ffb74d" },
                { y: 220, label: "Allergy", val: "32.1", c: C.purple, ct: "#b8a9ff" },
              ].map(({ y, label, val, c, ct }) => (
                <g key={label}>
                  <circle cx={340} cy={y} r={28} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text x={340} y={y - 6} fill={c} fontSize={11} textAnchor="middle" fontWeight={700}>{label}</text>
                  <text x={340} y={y + 10} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">{val}</text>
                  {/* Output arrow */}
                  <line x1={368} y1={y} x2={420} y2={y} stroke={`${c}50`} strokeWidth={1.5} />
                  <polygon points={`420,${y - 4} 428,${y} 420,${y + 4}`} fill={c} />
                  <text x={448} y={y + 4} fill={ct} fontSize={13} textAnchor="middle" fontWeight={700}>{val}</text>
                </g>
              ))}

              {/* Bottom label */}
              <text x={240} y={270} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>3 inputs × 3 neurons = matrix multiplication</text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>The Big Picture</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082">Neuron</T>
              <T size={14} color={C.dim}>One dot product (inputs × one weight row)</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082">Layer</T>
              <T size={14} color={C.dim}>Many neurons = many rows = many dot products = matrix multiplication</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082">Neural Network</T>
              <T size={14} color={C.dim}>Stack layers, chain matrix multiplications, apply activation functions</T>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 14, textAlign: "center" }}>Matrix multiplication is the heartbeat of deep learning.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const ActivationFunctions = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Beyond ReLU: The Full Menu</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>A layer is matrix multiplication: output = W · input.</T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>But layers alone are linear. To compute anything interesting, we need nonlinearity. That is where activation functions come in.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>ReLU (Rectified Linear Unit)</T>
          <div style={{ padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.purple}25`, textAlign: "center", marginTop: 12 }}>
            <T color={C.purple} bold size={18}>ReLU(x) = max(0, x)</T>
          </div>
          <T size={15} color="#b8a9ff" style={{ marginTop: 12 }}>If x is negative, output 0. If x is positive, output x. That is it.</T>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff" style={{ marginBottom: 8 }}>ReLU(-2.5)</T>
              <T size={13} color={C.dim}>max(0, -2.5) = 0</T>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff" style={{ marginBottom: 8 }}>ReLU(1.3)</T>
              <T size={13} color={C.dim}>max(0, 1.3) = 1.3</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>Why ReLU? It Creates the Bend</T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>Multiple linear layers stacked together are still just one big linear function. ReLU breaks that. It creates folds and corners. That is how networks learn nonlinear patterns.</T>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 14 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>Without activation:</T>
            <T size={14} color={C.dim}>Layer1(x) = W1·x, Layer2(y) = W2·y</T>
            <T size={13} color={C.dim} style={{ marginTop: 6 }}>Combined: (W2·W1)·x → still linear!</T>
          </div>
          <div style={{ padding: "12px 14px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8, marginTop: 10 }}>
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>With ReLU:</T>
            <T size={14} color={C.dim}>Layer1(x) = ReLU(W1·x), Layer2(y) = ReLU(W2·y)</T>
            <T size={13} color={C.dim} style={{ marginTop: 6 }}>Combined: ReLU(W2·ReLU(W1·x)) → nonlinear!</T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>Other Activation Functions</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>Sigmoid</T>
              <T size={13} color={C.dim}>σ(x) = 1 / (1 + e^-x) — squashes output to [0, 1]</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>Tanh</T>
              <T size={13} color={C.dim}>tanh(x) = (e^x - e^-x) / (e^x + e^-x) — squashes to [-1, 1]</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>Softmax</T>
              <T size={13} color={C.dim}>Normalizes a vector to probabilities summing to 1</T>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 14, textAlign: "center" }}>ReLU dominates modern networks because it is simple and works well.</T>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const WhatDeepMeans = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Layers on Layers on Layers</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>A "deep" network has many layers stacked on top of each other.</T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>The depth is the number of layers.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>Shallow vs Deep</T>
          <div style={{ display: "flex", gap: 16, marginTop: 14, alignItems: "flex-start" }}>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>Shallow (1-2 layers)</T>
              <T size={13} color={C.dim}>Input → Hidden → Output</T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>Limited feature learning. Can only learn simple patterns.</T>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>Deep (50+ layers)</T>
              <T size={13} color={C.dim}>Input → H1 → H2 → ... → H50 → Output</T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>Each layer learns richer, more abstract features.</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>Feature Abstraction Through Depth</T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>Early layers learn low-level features. Later layers learn high-level concepts.</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Layer 1</T>
              <T size={13} color={C.dim}>Detects edges, colors, simple shapes</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Layers 2-5</T>
              <T size={13} color={C.dim}>Detects textures, parts (eyes, ears, nose)</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Layers 6+</T>
              <T size={13} color={C.dim}>Detects objects (cat, dog, person)</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>Why Does Depth Matter?</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>Composability</T>
              <T size={13} color={C.dim}>Each layer builds on the previous. Layers can reuse and combine earlier features.</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>Efficiency</T>
              <T size={13} color={C.dim}>Deep networks solve problems with fewer parameters than shallow ones.</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}>
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>Expressiveness</T>
              <T size={13} color={C.dim}>Some functions cannot be learned by shallow networks at all.</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={19}>Training vs Inference</T>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 8 }}>
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>Training</T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>Update weights</T>
                  <T size={12} color={C.dim}>Backprop changes every parameter</T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>Dropout active</T>
                  <T size={12} color={C.dim}>Random units deactivated</T>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 8 }}>
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>Inference</T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>Weights FROZEN</T>
                  <T size={12} color={C.dim}>No changes, no gradients</T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>Dropout off</T>
                  <T size={12} color={C.dim}>All units active</T>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const SameBuildingBlocks = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>One Architecture, Many Applications</T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>Every neural network, no matter how big or complex, is built from the same pieces.</T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>You now understand them all.</T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>The Universal Pieces</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff">1. Matrix multiplication</T>
              <T size={13} color={C.dim}>Transforms a vector into a new vector via weights</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff">2. Activation function</T>
              <T size={13} color={C.dim}>Introduces nonlinearity (ReLU, Sigmoid, Tanh)</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff">3. Loss function</T>
              <T size={13} color={C.dim}>Measures error between output and target</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff">4. Backpropagation</T>
              <T size={13} color={C.dim}>Computes gradients via the chain rule</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 8 }}>
              <T size={14} color="#b8a9ff">5. Gradient descent</T>
              <T size={13} color={C.dim}>Updates weights to reduce loss</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>From Simple to Complex</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Linear regression</T>
              <T size={13} color={C.dim}>One matrix × input, no activation</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Simple network</T>
              <T size={13} color={C.dim}>Input → Hidden (matrix + ReLU) → Output</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">Deep network</T>
              <T size={13} color={C.dim}>Many layers stacked, same pieces repeated</T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
              <T size={14} color="#ef9a9a">GPT (Large Language Model)</T>
              <T size={13} color={C.dim}>Thousands of layers, same matrix + activation pattern</T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>You Now Understand the Foundation</T>
          <T color="#ffe082" size={15} style={{ marginTop: 10 }}>Everything in deep learning builds on these concepts. Transformers, RNNs, CNNs, attention mechanisms - they are all variations on the same core ideas you just learned.</T>
          <div style={{ padding: "14px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: `1px solid ${C.yellow}25`, marginTop: 14, textAlign: "center" }}>
            <T size={16} color={C.yellow} bold>You are ready for the next level.</T>
          </div>
        </Box>
      </Reveal>

      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

