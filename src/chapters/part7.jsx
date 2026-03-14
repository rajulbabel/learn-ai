import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

export const Ch7_1 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The discovery (2020):</T>
        <T color="#80deea" style={{ marginTop: 6 }}>OpenAI found that language model performance follows <strong>predictable mathematical patterns</strong> as you scale three things:</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>The three scaling axes:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { axis: "Parameters", symbol: "N", example: "1B → 7B → 70B → 175B", desc: "Model size (weights)" },
            { axis: "Data (Tokens)", symbol: "D", example: "100B tokens → 1T tokens", desc: "Total training data" },
            { axis: "Compute", symbol: "C", example: "1 GPU → 1000 GPUs", desc: "GPU hours, FLOPs (total math operations - each multiply or add counts as one)" },
          ].map(({ axis, symbol, example, desc }) => (
            <div key={axis} style={{ padding: "8px 12px", borderRadius: 6, background: `${C.yellow}08`, border: `1px solid ${C.yellow}12` }}>
              <T color={C.yellow} bold size={15}>{symbol}. {axis}</T>
              <T color={C.dim} size={13}>{desc}</T>
              <T color={C.dim} size={12}>Examples: {example}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>The key scaling law:</T>
        <T color="#ffb74d" style={{ marginTop: 8 }}>Scale all three together → smooth, predictable improvement</T>
        <T color="#ffb74d" style={{ marginTop: 6 }}>Scale one alone → diminishing returns</T>
        <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
          <T color="#ffb74d" size={14} bold>Loss ∝ N^(-α) × D^(-β) × C^(-γ)</T>
          <T color={C.dim} size={12} style={{ marginTop: 4 }}>Performance improves as a power law with size.</T>
        </div>
        <T color="#ffb74d" style={{ marginTop: 8 }}>Like a recipe: more flour alone doesn't make more cake without more eggs and butter.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Real examples:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { model: "GPT-2", params: "1.5B", capabilities: "Can complete text decently" },
            { model: "GPT-3", params: "175B", capabilities: "Can do in-context learning, few-shot prompting" },
            { model: "GPT-4", params: "~1.8T (estimated)", capabilities: "Can reason, code, multimodal, passes LSAT" },
          ].map(({ model, params, capabilities }) => (
            <div key={model} style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={14}>{model}: {params}</T>
              <T color={C.dim} size={13}>{capabilities}</T>
            </div>
          ))}
        </div>
        <T color="#80e8a5" style={{ marginTop: 8 }}>Each jump in scale = major capability leap.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>The practical impact:</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>Train a small model (1B params). Measure performance.</T>
        <T color="#b8a9ff">Use the scaling law to <strong>predict</strong> how a 175B model will perform.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>This <strong>saves millions in compute</strong>. You don't need to actually train the giant model to forecast results.</T>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>Chinchilla Scaling (DeepMind 2022):</T>
        <T color="#ce93d8" style={{ marginTop: 8 }}>People were training models with way too few tokens relative to size.</T>
        <T color="#ce93d8" style={{ marginTop: 6 }}><strong>Most models are under-trained, not too small.</strong></T>
        <T color="#ce93d8" style={{ marginTop: 6 }}>Optimal: match data tokens to parameters. 200B params = 20T tokens (rough rule).</T>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 3.2 Parameters at Scale ═══════
export const Ch7_2 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>What is a parameter?</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Every weight. Every bias. One number = one parameter.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>When people say "LLaMA-7B", they mean 7 billion parameters. 7,000,000,000 floating-point numbers.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Counting parameters in a simple layer:</T>
        <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
          <T color="#80deea" size={14}>Input layer: 4 neurons</T>
          <T color="#80deea" size={14}>Output layer: 3 neurons</T>
          <T color="#80deea" size={14} bold style={{ marginTop: 6 }}>Weight matrix W: 4 × 3 = <strong>12 weights</strong></T>
          <T color="#80deea" size={14} bold>Bias vector b: <strong>3 biases</strong></T>
          <T color={C.green} size={14} bold style={{ marginTop: 4 }}>Total: 12 + 3 = <strong>15 parameters</strong></T>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>Scaling up to real models:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { model: "LLaMA-7B", params: "7 billion", scale: "Like a notebook of facts" },
            { model: "GPT-3", params: "175 billion", scale: "Like a library" },
            { model: "GPT-4 (estimated)", params: "~1.8 trillion", scale: "Like all of human knowledge" },
          ].map(({ model, params, scale }) => (
            <div key={model} style={{ padding: "8px 10px", borderRadius: 6, background: `${C.orange}08`, border: `1px solid ${C.orange}12` }}>
              <T color={C.orange} bold size={14}>{model}</T>
              <T color={C.dim} size={13}>{params} - {scale}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Where do the parameters live?</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { component: "Embedding matrix", role: "Token → vector", fraction: "~20%" },
            { component: "Attention (Q, K, V, O)", role: "Query/Key/Value computation", fraction: "~20%" },
            { component: "FFN layers", role: "Feed-forward networks", fraction: "~50%" },
            { component: "Output projection", role: "Vector → logits (token probabilities)", fraction: "~10%" },
          ].map(({ component, role, fraction }) => (
            <div key={component} style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={13}>{component}: {fraction}</T>
              <T color={C.dim} size={12}>{role}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.blue} style={{ width: "100%" }}>
        <T color="#42a5f5" bold center size={20}>The critical insight:</T>
        <T color="#42a5f5" style={{ marginTop: 8 }}>More parameters ≠ smarter.</T>
        <T color="#42a5f5" style={{ marginTop: 6 }}>Parameters are <strong>capacity</strong>. Like a student with a big brain but no education. Still needs:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3, paddingLeft: 12 }}>
          {["Quality training data (not just volume)", "Proper training time", "Good optimization"].map((item, i) => (
            <T key={i} color="#42a5f5" size={14}>• {item}</T>
          ))}
        </div>
        <T color="#42a5f5" style={{ marginTop: 6 }}>You can have 1 trillion parameters trained poorly (worse than 7B parameters trained well).</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 3.3 Knowledge Distillation ═══════
export const Ch7_3 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>The problem: big models are expensive</T>
        <T color="#ce93d8" style={{ marginTop: 8 }}>GPT-4 has 1.8 trillion parameters. Running it costs a fortune. It's slow.</T>
        <T color="#ce93d8" style={{ marginTop: 6 }}>But your phone app needs instant replies. You can't run GPT-4 on a phone.</T>
        <T color="#ce93d8" style={{ marginTop: 8 }}>Question: Can we make a SMALL model that's almost as smart as the big one?</T>
        <T color="#ce93d8" style={{ marginTop: 4 }}>Yes. The trick is called <strong>knowledge distillation</strong> - and it works like a teacher and student.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Teacher teaches Student</T>
        <T color="#80deea" style={{ marginTop: 8 }}>Instead of training the small model from scratch (expensive!), let the big model teach it.</T>
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.purple}12`, border: `1px solid ${C.purple}25`, textAlign: "center" }}>
            <T color={C.purple} bold size={16}>Teacher</T>
            <T color={C.purple} size={13}>GPT-4</T>
            <T color={C.dim} size={12}>1.8 trillion params</T>
            <T color={C.dim} size={12}>Slow, expensive</T>
            <T color={C.dim} size={12}>Extremely smart</T>
          </div>
          <T color={C.dim} size={24}>→</T>
          <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.green}12`, border: `1px solid ${C.green}25`, textAlign: "center" }}>
            <T color={C.green} bold size={16}>Student</T>
            <T color={C.green} size={13}>GPT-4 Mini</T>
            <T color={C.dim} size={12}>8 billion params</T>
            <T color={C.dim} size={12}>Fast, cheap</T>
            <T color={C.dim} size={12}>Learns from teacher</T>
          </div>
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>How? Show both models the same questions. The student tries to copy the teacher's answers - not just the final answer, but HOW the teacher thinks.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>What does "copy how the teacher thinks" mean?</T>
        <T color="#ffe082" style={{ marginTop: 8 }}>Question: "What is the capital of France?"</T>
        <T color="#ffe082" style={{ marginTop: 8 }}>A lazy teacher just says the answer:</T>
        <div style={{ marginTop: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.red} bold size={14}>Just the answer: "Paris"</T>
          <T color={C.dim} size={13} style={{ marginTop: 4 }}>That's it. Right or wrong. No nuance.</T>
        </div>
        <T color="#ffe082" style={{ marginTop: 10 }}>A great teacher shares their full thinking - as confidence bars:</T>
        <div style={{ marginTop: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.green} bold size={14} style={{ marginBottom: 6 }}>Teacher's confidence on each option:</T>
          {[
            { word: "Paris", pct: 85, color: C.green },
            { word: "London", pct: 8, color: C.yellow },
            { word: "Lyon", pct: 5, color: C.orange },
            { word: "Berlin", pct: 2, color: C.red },
          ].map(({ word, pct, color }) => (
            <div key={word} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <T color={C.dim} size={13} style={{ width: 55, textAlign: "right" }}>{word}</T>
              <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 6 }}>
                  {pct > 10 && <T color="#000" bold size={11}>{pct}%</T>}
                </div>
              </div>
              {pct <= 10 && <T color={C.dim} size={11}>{pct}%</T>}
            </div>
          ))}
        </div>
        <T color="#ffe082" style={{ marginTop: 8 }}>This full set of confidences is called <strong>"soft probabilities"</strong> - and it's the key to distillation.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Why soft probabilities are magic</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>Look at the teacher's confidences again. The "wrong" answers tell a story:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}10`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 30, background: C.green, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><T color="#000" bold size={12}>85%</T></div>
            <div><T color={C.green} bold size={14}>Paris</T><T color={C.dim} size={12}>Correct answer</T></div>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.yellow}08`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 30, background: C.yellow, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><T color="#000" bold size={12}>8%</T></div>
            <div><T color={C.yellow} bold size={14}>London</T><T color={C.dim} size={12}>Wrong - but it IS a European capital</T></div>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.orange}08`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 30, background: C.orange, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><T color="#000" bold size={12}>5%</T></div>
            <div><T color={C.orange} bold size={14}>Lyon</T><T color={C.dim} size={12}>Wrong - but it IS a French city</T></div>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 30, background: C.red, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><T color="#000" bold size={12}>0%</T></div>
            <div><T color={C.red} bold size={14}>Pizza</T><T color={C.dim} size={12}>Not even a city</T></div>
          </div>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 10 }}>If you only said "Paris = right, everything else = wrong" - the student would think London and Pizza are equally wrong.</T>
        <T color="#b8a9ff" style={{ marginTop: 4 }}>But the soft probabilities teach: "London is close (it's a capital). Lyon is related (it's French). Pizza is nonsense." The student absorbs how concepts relate - for free.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>This is everywhere</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>Most AI models you actually use daily are distilled students:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { teacher: "GPT-4", student: "GPT-4 Mini", why: "100× cheaper API calls" },
            { teacher: "Claude Opus", student: "Claude Haiku", why: "Fast enough for your phone" },
            { teacher: "LLaMA 70B", student: "LLaMA 7B", why: "Runs on a laptop" },
          ].map(({ teacher, student, why }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}12` }}>
              <div style={{ padding: "3px 8px", borderRadius: 4, background: `${C.purple}15` }}>
                <T color={C.purple} size={12}>{teacher}</T>
              </div>
              <T color={C.dim} size={14}>→</T>
              <div style={{ padding: "3px 8px", borderRadius: 4, background: `${C.green}15` }}>
                <T color={C.green} size={12}>{student}</T>
              </div>
              <T color={C.dim} size={12}>{why}</T>
            </div>
          ))}
        </div>
        <T color="#80e8a5" style={{ marginTop: 10 }}>The big expensive model trains once. Then it teaches smaller, faster models. That's why you can chat with AI instantly on your phone - you're talking to a student who learned from a genius.</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 3.4 Contrastive Learning - Connecting Images & Text (CLIP) ═══════
export const Ch7_4 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>A weird question to start with</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>You see a photo of a golden retriever catching a frisbee on a beach.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Someone asks: "Which caption goes with this photo?"</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}10`, border: `1px solid ${C.green}25` }}>
            <T color={C.green} size={14}>A) "A dog catching a frisbee on a beach"</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} size={14}>B) "A car parked in a garage"</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}15` }}>
            <T color={C.red} size={14}>C) "A person cooking dinner"</T>
          </div>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>Obviously A. Your brain instantly matched the image to the right words.</T>
        <T color="#b8a9ff" style={{ marginTop: 4 }}>But how do you teach a computer to do this? Images are pixels. Text is words. They're completely different things. How do you even compare them?</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The idea: translate both into the same language</T>
        <T color="#80deea" style={{ marginTop: 8 }}>You can't directly compare a photo to a sentence. But what if you could convert BOTH into numbers?</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 80, padding: "8px", borderRadius: 6, background: `${C.cyan}12`, textAlign: "center" }}>
              <T color={C.cyan} bold size={13}>Photo</T>
              <T color={C.dim} size={11}>dog + beach</T>
            </div>
            <T color={C.dim} size={16}>→</T>
            <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.yellow}10` }}>
              <T color={C.yellow} size={11}>Image Encoder</T>
            </div>
            <T color={C.dim} size={16}>→</T>
            <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
              <T color={C.green} size={12}>[0.8, 0.3, -0.5, 0.9, ...]</T>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 80, padding: "8px", borderRadius: 6, background: `${C.purple}12`, textAlign: "center" }}>
              <T color={C.purple} bold size={13}>Caption</T>
              <T color={C.dim} size={11}>"dog on beach"</T>
            </div>
            <T color={C.dim} size={16}>→</T>
            <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.yellow}10` }}>
              <T color={C.yellow} size={11}>Text Encoder</T>
            </div>
            <T color={C.dim} size={16}>→</T>
            <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
              <T color={C.green} size={12}>[0.79, 0.31, -0.48, 0.88, ...]</T>
            </div>
          </div>
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>Two separate translators (encoders) convert images and text into lists of numbers (vectors).</T>
        <T color="#80deea" style={{ marginTop: 4 }}>If the image and text describe the same thing, their numbers end up <strong>almost identical</strong>. Notice how close the two rows of numbers are above!</T>
        <T color="#80deea" style={{ marginTop: 4 }}>This system is called <strong>CLIP</strong> (Contrastive Language-Image Pretraining), built by OpenAI.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>How does CLIP learn? The matching game</T>
        <T color="#ffe082" style={{ marginTop: 8 }}>Collect millions of image + caption pairs from the internet. Then play a matching game:</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Here are 4 images and 4 captions. Which goes with which?</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr", gap: 4, alignItems: "center" }}>
            <div />
            <T color={C.dim} size={11} center>"dog on beach"</T>
            <T color={C.dim} size={11} center>"red car"</T>
            <T color={C.dim} size={11} center>"sunset"</T>
            <T color={C.dim} size={11} center>"birthday cake"</T>

            <T color={C.dim} size={11}>dog photo</T>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}><T color={C.green} bold size={13}>YES</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>

            <T color={C.dim} size={11}>car photo</T>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}><T color={C.green} bold size={13}>YES</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>

            <T color={C.dim} size={11}>sunset photo</T>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}><T color={C.green} bold size={13}>YES</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>

            <T color={C.dim} size={11}>cake photo</T>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}><T color={C.red} size={12}>no</T></div>
            <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}><T color={C.green} bold size={13}>YES</T></div>
          </div>
        </div>
        <T color="#ffe082" style={{ marginTop: 8 }}>The green diagonal = correct matches. Everything else = wrong.</T>
        <T color="#ffe082" style={{ marginTop: 4 }}>The model adjusts until matching pairs produce similar numbers and non-matching pairs produce very different numbers. This is called <strong>contrastive learning</strong> - learning by contrast (what matches vs what doesn't).</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>How "similar" are two vectors?</T>
        <T color="#ffb74d" style={{ marginTop: 8 }}>After encoding, we get two lists of numbers. We need a way to check: are they similar?</T>
        <T color="#ffb74d" style={{ marginTop: 6 }}>The method is called <strong>cosine similarity</strong> - it gives a score from -1 to 1:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { score: "0.95", pair: "dog photo + \"dog on beach\"", verdict: "Almost identical!", color: C.green, width: "95%" },
            { score: "0.40", pair: "dog photo + \"animal playing\"", verdict: "Somewhat related", color: C.yellow, width: "40%" },
            { score: "0.05", pair: "dog photo + \"red sports car\"", verdict: "Completely different", color: C.red, width: "5%" },
          ].map(({ score, pair, verdict, color, width }, i) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: `${color}08` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <T color={C.dim} size={12}>{pair}</T>
                <T color={color} bold size={14}>{score}</T>
              </div>
              <div style={{ marginTop: 4, height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width, height: "100%", background: color, borderRadius: 4 }} />
              </div>
              <T color={C.dim} size={11} style={{ marginTop: 2 }}>{verdict}</T>
            </div>
          ))}
        </div>
        <T color="#ffb74d" style={{ marginTop: 8 }}>During training, the model is rewarded for making correct pairs score HIGH and wrong pairs score LOW. Millions of image-caption pairs later, it becomes incredibly good at understanding what images and text mean.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>Why this changes everything</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>Once images and text live in the same number space, you can do magical things:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}>
            <T color={C.cyan} bold size={15}>Google Image Search</T>
            <T color={C.dim} size={13}>You type "fluffy cat sleeping" → encode text to numbers → find photos with the closest numbers. No one manually tagged those photos - CLIP just knows they match.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
            <T color={C.purple} bold size={15}>DALL-E / Midjourney</T>
            <T color={C.dim} size={13}>You type "astronaut riding a horse on Mars" → text becomes numbers → image generator creates pixels that produce those same numbers. The shared space IS the bridge.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
            <T color={C.yellow} bold size={15}>ChatGPT / Claude understanding photos</T>
            <T color={C.dim} size={13}>You upload a photo to ChatGPT → image encoder converts it to numbers → those numbers go into the same space as text → now the model can "read" the image as if it were words.</T>
          </div>
        </div>
        <T color="#80e8a5" style={{ marginTop: 10 }}>Every time AI "sees" an image, contrastive learning is behind it. It's the reason AI can understand photos, generate art, and search billions of images by typing words.</T>
      </Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

// ═══════ 3.5 The Complete Training Pipeline ═══════
export const Ch7_5 = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={22}>Let's zoom out.</T>
        <T color="#80deea" style={{ marginTop: 8 }}>You've now learned every stage of how an LLM is built - tokenization, pretraining, loss functions, SFT, RLHF, scaling laws, distillation, and CLIP.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Here's the full journey from "pile of internet text" to "ChatGPT answering your questions."</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>Phase 1: Pretraining</T>
        <T color={C.dim} center size={13}>2-3 months · $10-100 million</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color="#ff8a80" size={14}>Feed the model trillions of words from the internet - books, Wikipedia, code, websites, forums, everything.</T>
          <T color="#ff8a80" size={14} style={{ marginTop: 6 }}>The model learns by playing the prediction game millions of times:</T>
          <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
            <T color={C.dim} size={13}>"The cat sat on the ___"</T>
            <T color={C.green} size={13}>Model predicts: "mat" (checks answer, adjusts weights, repeats)</T>
          </div>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
            <T color={C.green} bold size={13}>Gains</T>
            <T color={C.dim} size={12}>Knowledge, language, reasoning, patterns</T>
          </div>
          <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.red}10`, textAlign: "center" }}>
            <T color={C.red} bold size={13}>Lacks</T>
            <T color={C.dim} size={12}>Can't answer questions - just autocompletes</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>Phase 2: SFT (Supervised Fine-Tuning)</T>
        <T color={C.dim} center size={13}>1-2 weeks · $1,000-10,000</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color="#ffe082" size={14}>Humans write 10,000-100,000 perfect Q&A examples. The model trains on these to learn:</T>
          <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
            <T color={C.dim} size={13}>Q: "How do I boil an egg?"</T>
            <T color={C.green} size={13}>A: "Put egg in water, boil, 6 min for soft, 12 for hard."</T>
          </div>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
            <T color={C.green} bold size={13}>Gains</T>
            <T color={C.dim} size={12}>Answers questions, follows instructions, right tone</T>
          </div>
          <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.red}10`, textAlign: "center" }}>
            <T color={C.red} bold size={13}>Lacks</T>
            <T color={C.dim} size={12}>Might still be rude, harmful, or confidently wrong</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>Phase 3: RLHF (Human Feedback)</T>
        <T color={C.dim} center size={13}>1-2 weeks · $1,000-10,000</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
          <T color="#ce93d8" size={14}>Humans compare pairs of responses and pick the better one. A reward model learns their preferences, then the LLM optimizes for higher reward.</T>
          <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
            <T color={C.green} size={13}>Answer A: helpful, clear, safe → Human picks this</T>
            <T color={C.red} size={13}>Answer B: rude, misleading → Rejected</T>
          </div>
        </div>
        <div style={{ marginTop: 8, padding: "8px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
          <T color={C.green} bold size={14}>Result: Helpful, harmless, honest assistant</T>
          <T color={C.dim} size={12}>This is what becomes ChatGPT, Claude, Gemini</T>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.orange} style={{ width: "100%" }}>
        <T color="#ffb74d" bold center size={20}>After launch - Optional upgrades</T>
        <T color="#ffb74d" style={{ marginTop: 6 }}>The 3 phases above create the base model. But companies often add extra capabilities:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}>
            <T color={C.cyan} bold size={15}>Distillation - make it smaller & cheaper</T>
            <T color={C.dim} size={13} style={{ marginTop: 3 }}>GPT-4 is brilliant but expensive. So the big model "teaches" a smaller one (chapter 3.3). The student learns 90% of the teacher's ability at 1/100th the cost. That's how GPT-4 Mini and Claude Haiku exist - fast, cheap, and still smart.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
            <T color={C.purple} bold size={15}>CLIP - make it understand images</T>
            <T color={C.dim} size={13} style={{ marginTop: 3 }}>The base model only understands text. To make it "see" photos, you plug in a CLIP-style image encoder (chapter 3.4). The image gets converted into the same number space as text, so the model can "read" the photo. That's how ChatGPT and Claude understand screenshots, diagrams, and photos you upload.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.yellow}08`, border: `1px solid ${C.yellow}15` }}>
            <T color={C.yellow} bold size={15}>RAG - give it access to fresh info</T>
            <T color={C.dim} size={13} style={{ marginTop: 3 }}>The model's knowledge is frozen at training time. It doesn't know today's news. RAG (Retrieval-Augmented Generation) lets the model search a database or the web BEFORE answering - like giving a student an open-book exam. That's how ChatGPT can browse the web and cite sources.</T>
          </div>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
            <T color={C.green} bold size={15}>Domain fine-tuning - make it an expert</T>
            <T color={C.dim} size={13} style={{ marginTop: 3 }}>Want an AI that's amazing at medicine? Law? Finance? Take the general model and train it further on domain-specific data. A hospital might fine-tune on millions of medical records. The model keeps its general intelligence but becomes an expert in that field.</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 5}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={22}>Parts 2 & 3 - Complete</T>
        <T color="#80e8a5" style={{ marginTop: 8 }}>You now understand the full lifecycle of an LLM:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { num: "1", text: "Tokenization - how text becomes numbers", color: C.cyan },
            { num: "2", text: "Pretraining - learn language by predicting next words", color: C.red },
            { num: "3", text: "Cross-entropy loss - how the model measures its mistakes", color: C.yellow },
            { num: "4", text: "SFT - teach it to answer questions properly", color: C.orange },
            { num: "5", text: "RLHF - teach it to be helpful, safe, and honest", color: C.pink },
            { num: "6", text: "Scaling laws - bigger model + more data = predictably better", color: C.purple },
            { num: "7", text: "Distillation - shrink the model without losing smarts", color: C.cyan },
            { num: "8", text: "CLIP - connect images and text in one shared space", color: C.green },
          ].map(({ num, text, color }) => (
            <div key={num} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${color}06` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <T color={color} bold size={12}>{num}</T>
              </div>
              <T color={C.dim} size={13}>{text}</T>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "12px", background: `${C.purple}12`, borderRadius: 8, border: `2px solid ${C.purple}35` }}>
          <T color={C.purple} size={15} center bold>Next up: the architecture that makes all of this possible - Transformers and Attention.</T>
        </div>
      </Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} />}
  </div>
); }

