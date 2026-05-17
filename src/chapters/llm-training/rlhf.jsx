import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function RLHF(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            RLHF: Reinforcement Learning from Human Feedback
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            After SFT, the model is better - but not perfect. It may be verbose, unsafe, or disagreeable. How do we
            optimize for qualities humans care about?
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            RLHF is a 4-step process that uses human judgments to train a reward model, then uses that to optimize the
            LLM.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Step 1: Generate multiple responses
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            For a given prompt, the SFT model generates MULTIPLE candidate responses. Temperature controls diversity.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <T color={C.mid} size={15} style={{ fontStyle: "italic", textAlign: "center" }}>
              Prompt: "What's the best programming language for beginners?"
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  resp: "Python is best - simple syntax, huge libraries, great community.",
                  rank: 1,
                  label: "Clear & actionable",
                },
                { resp: "Python or Go. Python for web, Go for systems. Depends on goals.", rank: 2, label: "Nuanced" },
                {
                  resp: "JavaScript. Runs everywhere, but quirky syntax can confuse newcomers.",
                  rank: 3,
                  label: "Decent but flawed reasoning",
                },
                {
                  resp: "Rust. Memory safety. Compile-time errors catch bugs early.",
                  rank: 4,
                  label: "Incorrect - too hard for beginners",
                },
                { resp: "I am an AI and cannot learn programming.", rank: 5, label: "Nonsensical" },
              ].map(({ resp, rank, label }) => (
                <div
                  key={resp.substring(0, 20)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red}06`,
                    border: `1px solid ${rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red}12`,
                  }}
                >
                  <T color={rank <= 2 ? C.green : rank <= 3 ? C.orange : C.red} size={14}>
                    {resp}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    ← Rank #{rank}: {label}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Step 2: Human annotators rank responses
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Humans read pairs of responses and judge: "Which is better?" This creates a dataset of pairwise comparisons.
          </T>
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
                  <div
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 6,
                      background: winner === "A" ? `${C.green}12` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${winner === "A" ? C.green : "transparent"}12`,
                    }}
                  >
                    <T color={C.dim} size={12} bold>
                      Response A:
                    </T>
                    <T color={C.mid} size={14} style={{ marginTop: 4 }}>
                      {resp_a}
                    </T>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 6,
                      background: winner === "B" ? `${C.green}12` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${winner === "B" ? C.green : "transparent"}12`,
                    }}
                  >
                    <T color={C.dim} size={12} bold>
                      Response B:
                    </T>
                    <T color={C.mid} size={14} style={{ marginTop: 4 }}>
                      {resp_b}
                    </T>
                  </div>
                </div>
                <T color={winner === "A" ? C.green : C.yellow} bold size={14} style={{ marginTop: 8 }}>
                  Winner: {winner}
                </T>
                <T color={C.dim} size={13} style={{ marginTop: 2 }}>
                  Reason: {reason}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            From tens of thousands of such comparisons, we build training data for a reward model.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 3: Reward model - what it is + how it learns ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Step 3: Train a reward model
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The reward model is a separate neural network. Its job is simple: take a prompt and a response, and output a
            single number - how good is this response? Higher number = more helpful, safer, better.
          </T>

          {/* What it is */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>Input:</strong> a prompt + a complete response (as one block of text)
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <T color={C.dim} size={20}>
                ↓
              </T>
            </div>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>Output:</strong> one single number (e.g., 8.5)
              </T>
            </div>
          </div>

          {/* How it trains */}
          <T color="#80e8a5" bold size={16} style={{ marginTop: 14 }}>
            How does it learn to score?
          </T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>
            From the human comparisons in Step 2. Each comparison is a training example: a winner response and a loser
            response for the same prompt.
          </T>
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
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}10`,
                }}
              >
                <T color={C.dim} size={13} style={{ fontStyle: "italic" }}>
                  Prompt: "{prompt}"
                </T>
                <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div
                    style={{ flex: 1, minWidth: 180, padding: "6px 8px", borderRadius: 6, background: `${C.green}10` }}
                  >
                    <T color={C.green} size={12} bold>
                      WINNER
                    </T>
                    <T color={C.mid} size={13} style={{ marginTop: 2 }}>
                      {winner}
                    </T>
                  </div>
                  <div
                    style={{ flex: 1, minWidth: 180, padding: "6px 8px", borderRadius: 6, background: `${C.red}08` }}
                  >
                    <T color={C.red} size={12} bold>
                      LOSER
                    </T>
                    <T color={C.mid} size={13} style={{ marginTop: 2 }}>
                      {loser}
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                  {why}
                </T>
              </div>
            ))}
          </div>

          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The reward model is trained with one rule:{" "}
            <strong>the winner must get a higher score than the loser</strong>. After seeing tens of thousands of these
            pairs, it learns to detect what makes a response helpful, accurate, and safe.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 4: Reward model - scored responses after training ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            After training: the reward model can score any response
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { resp: "Python - simple, huge community.", score: 8.5, color: C.green },
              { resp: "Depends... Python vs Go...", score: 7.2, color: C.green },
              { resp: "Rust is safest.", score: 2.1, color: C.red },
              { resp: "I cannot answer.", score: 1.0, color: C.red },
            ].map(({ resp, score, color }) => (
              <div
                key={resp.substring(0, 15)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                }}
              >
                <T color={C.mid} size={13} style={{ flex: 1 }}>
                  {resp}
                </T>
                <div
                  style={{
                    width: 80,
                    height: 10,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${score * 10}%`,
                      height: "100%",
                      background: color,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <T color={color} bold size={15} style={{ minWidth: 35 }}>
                  {score.toFixed(1)}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Now we have a machine that can score any response automatically. This is what PPO will use in Step 4 -
            instead of asking a human to grade every response (too slow and expensive), we ask the reward model (instant
            and free).
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 5: PPO - The 4-step loop ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Step 4: PPO - How the model actually improves
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            PPO (Proximal Policy Optimization) is the training loop that uses the reward model to make the LLM better.
            Here is exactly what happens, step by step, for one training round:
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                num: "1",
                label: "Generate",
                detail:
                  'Give the model a prompt like "Best language for beginners?" and let it write a full response. It produces: "Python is great for beginners because of its simple syntax and large community."',
                color: C.cyan,
              },
              {
                num: "2",
                label: "Score",
                detail:
                  "Feed the prompt + response into the reward model. It outputs a single number: 8.5 out of 10. This means the response is helpful, clear, and accurate.",
                color: C.green,
              },
              {
                num: "3",
                label: "Compare",
                detail:
                  "The original SFT model (before PPO training started) also looks at the same prompt. We measure: how different is the PPO model's response from what the SFT model would have said? This difference is called the KL divergence. If the PPO model has drifted too far from the SFT model, we penalize it.",
                color: C.orange,
              },
              {
                num: "4",
                label: "Nudge",
                detail:
                  "If reward was high and the model hasn't drifted too far: nudge the weights to make this kind of response MORE likely. If reward was low: nudge the weights to make this kind of response LESS likely. If the model drifted too far from SFT: pull it back, even if the reward was high.",
                color: C.purple,
              },
            ].map(({ num, label, detail, color }) => (
              <div
                key={num}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `${color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <T color={color} bold size={14}>
                      {num}
                    </T>
                  </div>
                  <T color={color} bold size={17}>
                    {label}
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ paddingLeft: 38 }}>
                  {detail}
                </T>
              </div>
            ))}
          </div>

          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            This loop repeats thousands of times. Generate, score, compare, nudge. Over time, the model learns to
            produce responses that get high reward scores while staying close to the well-behaved SFT model.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 6: KL divergence - concrete example ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold size={20} center>
            What is KL (Kullback-Leibler) divergence? A concrete example
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            KL divergence just measures: how different are the PPO model's word predictions from the original SFT
            model's predictions? Here is a real comparison for the first word after "Best language for beginners?":
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              {
                label: "SFT model (original)",
                probs: [
                  { w: "Python", p: 40 },
                  { w: "I", p: 15 },
                  { w: "The", p: 12 },
                  { w: "others", p: 33 },
                ],
                color: C.cyan,
              },
              {
                label: "PPO model (after 500 rounds)",
                probs: [
                  { w: "Python", p: 85 },
                  { w: "I", p: 3 },
                  { w: "The", p: 2 },
                  { w: "others", p: 10 },
                ],
                color: C.purple,
              },
            ].map(({ label, probs, color }) => (
              <div
                key={label}
                style={{ flex: 1, minWidth: 180, padding: "8px 10px", borderRadius: 6, background: "rgba(0,0,0,0.2)" }}
              >
                <T color={color} bold size={13} center>
                  {label}
                </T>
                {probs.map(({ w, p }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <T color={C.dim} size={12} style={{ width: 50, flexShrink: 0 }}>
                      {w}
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 3, opacity: 0.6 }}
                      />
                    </div>
                    <T color={C.dim} size={11} style={{ minWidth: 28, textAlign: "right" }}>
                      {p}%
                    </T>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The SFT model was spread out (40%, 15%, 12%...). The PPO model is concentrated (85% on one word). These
            distributions look very different, so the KL divergence is high: <strong>1.8</strong>.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 7: Formula + worked examples + why KL needed ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold size={20} center>
            The formula: Final Score = Reward - (β x KL)
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: `${C.green}06`,
              }}
            >
              <T color={C.green} bold size={14} style={{ minWidth: 70 }}>
                Reward
              </T>
              <T color={C.dim} size={14}>
                How good is this response? (from the reward model). Higher = better.
              </T>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: `${C.orange}06`,
              }}
            >
              <T color={C.orange} bold size={14} style={{ minWidth: 70 }}>
                KL
              </T>
              <T color={C.dim} size={14}>
                How far has the model drifted from the SFT model? Higher = more different.
              </T>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: `${C.purple}06`,
              }}
            >
              <T color={C.purple} bold size={14} style={{ minWidth: 70 }}>
                β (beta)
              </T>
              <T color={C.dim} size={14}>
                A dial engineers set (0.1 to 0.5). Higher β = stricter penalty for drifting.
              </T>
            </div>
          </div>

          {/* Worked examples */}
          <T color="#ffcc80" bold size={14} style={{ marginTop: 12 }}>
            Three examples with β = 0.2:
          </T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                resp: "Python - simple syntax, huge community, tons of tutorials.",
                reward: 8.5,
                kl: 0.02,
                color: C.green,
                verdict: "Good response, barely drifted. Almost full reward kept.",
              },
              {
                resp: "Just learn Python I guess, whatever works, who cares.",
                reward: 3.1,
                kl: 0.15,
                color: C.orange,
                verdict: "Lazy response. Low reward, small nudge.",
              },
              {
                resp: "PYTHON PYTHON PYTHON PYTHON BEST BEST BEST!!!",
                reward: 9.2,
                kl: 24.0,
                color: C.red,
                verdict: "Reward hacking! High score but model went crazy. KL penalty wipes out the reward entirely.",
              },
            ].map(({ resp, reward, kl, color, verdict }) => {
              const penalty = 0.2 * kl;
              const final_score = reward - penalty;
              return (
                <div
                  key={resp.substring(0, 15)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${color}06`,
                    border: `1px solid ${color}10`,
                  }}
                >
                  <T color={C.mid} size={13} style={{ fontStyle: "italic" }}>
                    "{resp}"
                  </T>
                  <div
                    style={{
                      marginTop: 6,
                      padding: "6px 8px",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.3)",
                      fontFamily: "monospace",
                    }}
                  >
                    <T color={C.dim} size={13}>
                      Final = <strong style={{ color: C.green }}>{reward.toFixed(1)}</strong> - (0.2 x{" "}
                      <strong style={{ color: C.orange }}>{kl.toFixed(2)}</strong>) = {reward.toFixed(1)} -{" "}
                      {penalty.toFixed(2)} = <strong style={{ color }}>{final_score.toFixed(2)}</strong>
                    </T>
                  </div>
                  <T color={color} size={12} style={{ marginTop: 4 }}>
                    {verdict}
                  </T>
                </div>
              );
            })}
          </div>

          {/* Why KL is needed */}
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 8,
              background: "rgba(255,107,107,0.06)",
              border: "1px solid rgba(255,107,107,0.10)",
            }}
          >
            <T color="#ef9a9a" bold size={15}>
              Why is the KL penalty necessary?
            </T>
            <T color="#ef9a9a" style={{ marginTop: 6 }}>
              Without it, the model finds shortcuts. The reward model is not perfect - it has blind spots. The PPO model
              can discover responses that <strong>trick</strong> the reward model into giving high scores even though a
              human would hate them. Repeating keywords, using an overly confident tone, or stuffing filler words that
              the reward model likes. The KL penalty prevents this by saying:{" "}
              <strong>"you can improve, but you cannot become a completely different model."</strong>
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 8: Why RLHF matters ── */}
      <Reveal when={sub >= 8}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            Why RLHF matters: what it fixes that SFT cannot
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            SFT teaches the model to follow instructions by showing it good examples. But it has a fundamental limit: it
            can only learn from the exact examples humans wrote. RLHF goes further.
          </T>
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
              <div
                key={problem.substring(0, 20)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={C.orange} size={14} bold>
                  The problem
                </T>
                <T color={C.dim} size={14}>
                  {problem}
                </T>
                <T color={color} size={14} bold style={{ marginTop: 6 }}>
                  How RLHF fixes it
                </T>
                <T color={C.dim} size={14}>
                  {fix}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {sub < 8 && (
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
