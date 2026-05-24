import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function CrossEntropy(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            How do we grade the model?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The model predicts probabilities for every word in the vocabulary. But how do we turn that into one number
            that says "how good are your predictions?"
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            We need a <strong>loss function</strong> - a single score that tells us how wrong the model was. Lower loss
            = better predictions. The loss function used by every LLM is called <strong>cross-entropy loss</strong>.
          </T>
        </Box>
      )}

      {/* ── Sub 1: The formula (SVG) + the -log(P) graph + explanation ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The formula: Loss = -log(P)
          </T>

          {/* ── SVG Formula ── */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.green}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <T color={C.dim} size={13} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              The Cross-Entropy Loss Formula
            </T>
            <svg viewBox="0 0 440 100" style={{ width: "100%", maxWidth: 400, height: "auto" }}>
              <desc>Cross-entropy loss formula as mathematical notation: Loss equals negative log of P_correct</desc>
              {/* Loss = */}
              <text x="10" y="55" fill={C.bright} fontSize="24" fontFamily="serif" fontWeight="700">
                Loss
              </text>
              <text x="80" y="55" fill={C.dim} fontSize="24" fontFamily="serif">
                =
              </text>
              {/* - */}
              <text x="108" y="55" fill={C.red} fontSize="28" fontFamily="serif" fontWeight="700">
                -
              </text>
              {/* log with subscript e */}
              <text x="128" y="55" fill={C.green} fontSize="24" fontFamily="serif" fontWeight="700">
                log
              </text>
              <text x="172" y="64" fill={C.green} fontSize="13" fontFamily="serif" fontStyle="italic">
                e
              </text>
              {/* ( */}
              <text x="185" y="55" fill={C.dim} fontSize="28" fontFamily="serif">
                (
              </text>
              {/* P_correct */}
              <text x="200" y="55" fill={C.cyan} fontSize="24" fontFamily="serif" fontStyle="italic" fontWeight="700">
                P
              </text>
              <text x="220" y="68" fill={C.purple} fontSize="13" fontFamily="serif" fontStyle="italic">
                correct
              </text>
              {/* ) */}
              <text x="275" y="55" fill={C.dim} fontSize="28" fontFamily="serif">
                )
              </text>
              {/* Annotations */}
              <text x="300" y="42" fill={C.cyan} fontSize="11" fontFamily="sans-serif">
                ← the probability the model
              </text>
              <text x="308" y="56" fill={C.cyan} fontSize="11" fontFamily="sans-serif">
                assigned to the actual
              </text>
              <text x="308" y="70" fill={C.cyan} fontSize="11" fontFamily="sans-serif">
                next word
              </text>
              <text x="108" y="85" fill={C.red} fontSize="11" fontFamily="sans-serif">
                ↑ negative sign flips it
              </text>
            </svg>
          </div>

          <T color="#80e8a5" style={{ marginTop: 4 }}>
            In plain English:{" "}
            <strong>
              take the natural log of how confident the model was in the right answer, then flip the sign.
            </strong>
          </T>

          {/* ── The -log(P) Graph ── */}
          <T color="#80e8a5" bold size={16} style={{ marginTop: 16 }}>
            The graph of -log(P): why this shape matters
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "16px 12px",
              background: "rgba(0,0,0,0.35)",
              borderRadius: 12,
              border: `1px solid ${C.green}20`,
            }}
          >
            <svg
              viewBox="0 0 400 240"
              style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", margin: "0 auto" }}
            >
              <desc>
                Plotted negative log probability curve showing loss vs probability with annotated points demonstrating
                exponential penalty for low confidence
              </desc>
              {/* Axes */}
              <line x1="50" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              {/* Y axis label */}
              <text
                x="15"
                y="115"
                fill={C.red}
                fontSize="13"
                fontFamily="sans-serif"
                transform="rotate(-90,15,115)"
                textAnchor="middle"
                fontWeight="700"
              >
                Loss (-log P)
              </text>
              {/* X axis label */}
              <text
                x="215"
                y="232"
                fill={C.cyan}
                fontSize="13"
                fontFamily="sans-serif"
                textAnchor="middle"
                fontWeight="700"
              >
                probability assigned to correct word
              </text>
              {/* Y axis ticks */}
              {[0, 1, 2, 3, 4].map((v) => {
                const y = 200 - (v / 4.6) * 180;
                return (
                  <g key={v}>
                    <line x1="45" y1={y} x2="50" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x="40" y={y + 4} fill={C.dim} fontSize="11" fontFamily="sans-serif" textAnchor="end">
                      {v.toFixed(1)}
                    </text>
                    <line x1="50" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  </g>
                );
              })}
              {/* X axis ticks */}
              {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => {
                const x = 50 + v * 330;
                return (
                  <g key={v}>
                    <line x1={x} y1="200" x2={x} y2="205" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x={x} y="216" fill={C.dim} fontSize="11" fontFamily="sans-serif" textAnchor="middle">
                      {v.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              {/* The -log(P) curve */}
              <path
                d={(() => {
                  const pts = [];
                  for (let i = 1; i <= 100; i++) {
                    const p = i / 100;
                    const loss = -Math.log(p);
                    const x = 50 + p * 330;
                    const y = 200 - (loss / 4.6) * 180;
                    pts.push(`${i === 1 ? "M" : "L"}${x.toFixed(1)},${Math.max(20, y).toFixed(1)}`);
                  }
                  return pts.join(" ");
                })()}
                fill="none"
                stroke={C.green}
                strokeWidth="2.5"
              />
              {/* Annotated points */}
              {[
                { p: 0.95, label: "P=0.95", sublabel: "confident & right", loss: -Math.log(0.95), color: C.green },
                { p: 0.5, label: "P=0.50", sublabel: "coin flip", loss: -Math.log(0.5), color: C.yellow },
                { p: 0.1, label: "P=0.10", sublabel: "wrong guess", loss: -Math.log(0.1), color: C.orange },
                { p: 0.01, label: "P=0.01", sublabel: "very wrong", loss: -Math.log(0.01), color: C.red },
              ].map(({ p, label, sublabel, loss, color }) => {
                const x = 50 + p * 330;
                const y = Math.max(20, 200 - (loss / 4.6) * 180);
                return (
                  <g key={p}>
                    <circle cx={x} cy={y} r="5" fill={color} opacity="0.9" />
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2="200"
                      stroke={color}
                      strokeWidth="0.8"
                      strokeDasharray="3,3"
                      opacity="0.4"
                    />
                    <text
                      x={Math.min(x + 8, 350)}
                      y={y - 8}
                      fill={color}
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight="700"
                    >
                      {label}
                    </text>
                    <text
                      x={Math.min(x + 8, 350)}
                      y={y + 4}
                      fill={color}
                      fontSize="9"
                      fontFamily="sans-serif"
                      opacity="0.8"
                    >
                      {sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Where does "correct" come from? ── */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color="#80deea" bold size={15}>
              But wait - how does the formula know what the right answer is?
            </T>
            <T color="#80deea" size={14} style={{ marginTop: 6 }}>
              The formula is Loss = -ln(P<sub>correct</sub>). But where does "correct" come from? It is NOT inside the
              formula. It comes from the <strong>training data</strong>.
            </T>
            <T color="#80deea" size={14} style={{ marginTop: 6 }}>
              During training, the model sees real text like "The cat sat on the <strong>mat</strong>". We already know
              the next word is "mat" because it is right there in the sentence. The model outputs 50,000 probabilities
              (one per word). We reach into that list, pull out the one probability the model assigned to "mat", and
              plug THAT number into the formula.
            </T>
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={14}>
                Model output: {"{"}the: 2%, cat: 5%, mat: <strong style={{ color: C.green }}>62%</strong>, dog: 1%, ...
                {"}"}
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                Correct answer (from training data): <strong style={{ color: C.green }}>"mat"</strong>
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                So P<sub>correct</sub> = P("mat") = <strong style={{ color: C.green }}>0.62</strong>
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                Loss = -ln(0.62) = <strong style={{ color: C.yellow }}>0.48</strong>
              </T>
            </div>
            <T color="#80deea" size={14} style={{ marginTop: 8 }}>
              The "comparison" between actual and expected is implicit: we only look at the probability the model gave
              to the <strong>known correct word</strong>. If that probability is high, loss is low. If that probability
              is low, loss is high. There is no subtraction (actual - expected). The entire comparison is: "how
              confident were you in the right answer?"
            </T>
          </div>

          {/* ── Graph explanation tied to LLM context ── */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <T color="#80e8a5" bold size={15}>
              What does this graph mean for our model?
            </T>
            {[
              {
                scenario: 'Model gives "mat" P=0.95 (the correct answer from training data)',
                loss: "0.05",
                reaction: "Almost zero loss. The model was confident and correct. Barely any weight adjustment needed.",
                color: C.green,
              },
              {
                scenario: 'Model gives "mat" P=0.50 (correct answer, but model wasn\'t sure)',
                loss: "0.69",
                reaction:
                  "Medium loss. Right word, but not confident enough. Weights get nudged to be more confident next time.",
                color: C.yellow,
              },
              {
                scenario: 'Model gives "mat" P=0.01 (correct answer, but model almost ignored it)',
                loss: "4.60",
                reaction:
                  'Massive loss. The model was almost certain "mat" was wrong - but it was right. Weights get a huge correction.',
                color: C.red,
              },
            ].map(({ scenario, loss, reaction, color }) => (
              <div
                key={loss}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} size={14}>
                  {scenario}
                </T>
                <T color={C.bright} bold size={14} style={{ marginTop: 4 }}>
                  Loss = {loss}
                </T>
                <T color={C.dim} size={13} style={{ marginTop: 2 }}>
                  {reaction}
                </T>
              </div>
            ))}
          </div>

          <T color="#80e8a5" style={{ marginTop: 10 }}>
            The curve is steep on the left (low probability = massive penalty) and flat on the right (high probability =
            tiny penalty). This is exactly what we want: the model gets{" "}
            <strong>punished harshly for being confidently wrong</strong>, but barely punished when it's already doing
            well.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Why -log? The intuition
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Imagine you're a weather forecaster. You say "70% chance of rain". If it does rain, you did well (70% ≠
            100%, but decent). If it doesn't rain, you were wrong (you said 70%!).
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Loss measures your mistake: <strong>Loss = -log(your prediction for what actually happened)</strong>
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { you_said: "It WILL rain (P=0.95)", actual: "IT DID RAIN", loss: 0.05, grade: "A+" },
              { you_said: "Maybe rain (P=0.50)", actual: "It rained", loss: 0.69, grade: "C" },
              { you_said: "Probably dry (P=0.10)", actual: "It rained", loss: 2.3, grade: "F" },
            ].map(({ you_said, actual, loss, grade }) => (
              <div
                key={you_said}
                style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}
              >
                <T color={C.dim} size={14}>
                  <strong>You:</strong> {you_said}
                </T>
                <T color={C.mid} size={14} style={{ marginTop: 2 }}>
                  <strong>Reality:</strong> {actual}
                </T>
                <T color={C.yellow} size={14} style={{ marginTop: 4 }}>
                  <strong>Loss = {loss.toFixed(2)}</strong> ({grade})
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Cross-entropy formula in detail
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            When predicting one token from a 50K vocabulary:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "16px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.yellow}25`,
            }}
          >
            <T color={C.bright} size={18} center>
              <strong>
                Loss = -log<sub>e</sub>(P<sub>correct</sub>)
              </strong>
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 8, textAlign: "center" }}>
              where P_correct is between 0 and 1 (it's a probability)
            </T>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { prob_correct: 0.99, loss: 0.01, bar_width: 2 },
              { prob_correct: 0.9, loss: 0.1, bar_width: 10 },
              { prob_correct: 0.5, loss: 0.69, bar_width: 69 },
              { prob_correct: 0.1, loss: 2.3, bar_width: 100 },
              { prob_correct: 0.01, loss: 4.6, bar_width: 100 },
            ].map(({ prob_correct, loss, bar_width }) => (
              <div key={prob_correct} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={C.mid} size={14} style={{ minWidth: 80 }}>
                  P = {prob_correct.toFixed(2)}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 16,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(bar_width, 100)}%`,
                      height: "100%",
                      background: C.red,
                      borderRadius: 6,
                    }}
                  />
                </div>
                <T color={C.yellow} bold size={15} style={{ minWidth: 50 }}>
                  L={loss.toFixed(2)}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            As probability increases, loss approaches zero. As probability drops, loss explodes. This penalizes
            confident wrong answers.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why cross-entropy, not MSE?
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            MSE (Mean Squared Error) is the default loss for predicting numbers - like "predict the house price." But
            language models predict probabilities over a vocabulary. Why does that need a different loss?
          </T>
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
              <div
                key={method}
                style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}
              >
                <T color={color} bold size={17}>
                  {method}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  <strong>Formula:</strong> {formula}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  <strong>Example:</strong> {example}
                </T>
                <T color={C.mid} size={14} style={{ marginTop: 2 }}>
                  <strong>Why:</strong> {problem}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Batch loss: averaging across examples
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            During training, we compute loss on a BATCH of examples, then take the mean:
          </T>
          <div
            style={{
              marginTop: 12,
              fontFamily: "monospace",
              padding: "12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Example 1: Predict 'sat' → model says P=0.4 → loss = 0.92",
                "Example 2: Predict 'on'  → model says P=0.8 → loss = 0.22",
                "Example 3: Predict 'mat' → model says P=0.1 → loss = 2.30",
                "",
                "Batch Loss = (0.92 + 0.22 + 2.30) / 3 = 1.15",
              ].map((line, i) => (
                <T key={i} color={line.includes("Loss") ? C.yellow : C.dim} size={14}>
                  {line}
                </T>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The model updates weights to reduce this batch loss. Then the next batch is loaded and loss is recomputed.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
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
}
