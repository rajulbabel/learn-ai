import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function DPO(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: RLHF recap - why it's painful ── */}
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            RLHF Works - But It Needs 4 Models
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            In <ChapterLink to="5.8">chapter 5.8</ChapterLink> we learned the RLHF pipeline. It aligns the model with human values - but look at what it
            takes:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                label: "1. Policy model",
                desc: "The LLM being trained - generates responses",
                color: C.green,
              },
              {
                label: "2. Reference model",
                desc: "Frozen copy of the policy before RLHF - prevents drift",
                color: C.blue,
              },
              {
                label: "3. Reward model",
                desc: "Separate neural net that scores how 'good' a response is",
                color: C.orange,
              },
              {
                label: "4. Value model",
                desc: "Another neural net that estimates future rewards for PPO",
                color: C.red,
              },
            ].map(({ label, desc, color }) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold size={17}>
                  {label}
                </T>
                <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" style={{ marginTop: 12 }}>
            That is <strong>4 models in GPU memory at once</strong>. Plus RL training (PPO) is unstable - the reward
            model can be gamed, hyperparameters are tricky, and training often crashes.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            <strong>Can we get the same result with less machinery?</strong>
          </T>
        </Box>
      )}

      {/* ── Sub 1: DPO's key insight ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            DPO: Skip the Reward Model Entirely
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Direct Preference Optimization (Rafailov et al., 2023) has a simple insight:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px 16px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={17} style={{ lineHeight: 1.6 }}>
              Why train a separate judge to score responses, then do complex RL to optimize for those scores... when you
              can just directly adjust the model to prefer what humans preferred?
            </T>
          </div>
          <T color="#80e8a5" style={{ marginTop: 12 }}>
            Think of it like this. RLHF says: "Hire a food critic, have them score every dish, then optimize your
            cooking to maximize the critic's score." DPO says: "Just ask diners which dish they liked better, and{" "}
            <strong>directly</strong> learn from their preference."
          </T>
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                RLHF
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                Preferences → Train reward model → RL loop (PPO) → Better policy
              </T>
              <T color={C.red} size={14} style={{ marginTop: 4 }}>
                3 training stages, 4 models
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                DPO
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                Preferences → Better policy
              </T>
              <T color={C.green} size={14} style={{ marginTop: 4 }}>
                1 training stage, 2 models
              </T>
            </div>
          </div>
          <T color="#80e8a5" style={{ marginTop: 10 }}>
            DPO folds the reward model and RL loop into a <strong>single supervised loss function</strong>. Let's see
            exactly how.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 2: Concrete training example ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            One DPO Training Step - Real Example
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            DPO needs exactly what RLHF's Step 2 already collected: human preference pairs. Here is one:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <T color={C.bright} bold size={16}>
              Prompt: "What's the best programming language for beginners?"
            </T>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                Preferred (Winner)
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                "Python - simple syntax, huge libraries, great community."
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold size={16}>
                Rejected (Loser)
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                "Rust. Memory safety. Compile-time errors catch bugs early."
              </T>
            </div>
          </div>
          <T color="#ffcc80" style={{ marginTop: 12 }}>
            A human said: <strong>"The Python answer is better."</strong> That single judgment is ALL DPO needs for this
            training step. No scores, no rankings - just "A is better than B."
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold size={16}>
              What DPO will do:
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              Nudge the model to assign <strong>higher probability</strong> to the Python answer, and{" "}
              <strong>lower probability</strong> to the Rust answer - but not too much, so the model does not go off the
              rails.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 3: The log-ratio trick with real numbers ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The Log-Ratio - Measuring Change
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            DPO compares the <strong>current model</strong> against a <strong>frozen reference copy</strong> (the model
            before DPO training). This prevents the model from changing too much.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            For each response, we ask: "How much did the model's probability change relative to the reference?"
          </T>
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
              }}
            >
              <T color={C.blue} bold center size={16}>
                Reference Model (frozen)
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                P(Python answer) = <strong style={{ color: C.green }}>0.030</strong>
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                P(Rust answer) = <strong style={{ color: C.red }}>0.025</strong>
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                Probabilities are tiny because the model distributes across thousands of possible responses
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Current Model (training)
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                P(Python answer) = <strong style={{ color: C.green }}>0.045</strong>
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                P(Rust answer) = <strong style={{ color: C.red }}>0.015</strong>
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                Model is learning: boosted preferred, reduced rejected
              </T>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.green} bold size={16}>
                Preferred log-ratio:
              </T>
              <div style={{ marginTop: 6, textAlign: "center" }}>
                <T color={C.bright} size={16} style={{ fontFamily: "monospace" }}>
                  log(0.045 / 0.030) = log(1.50) = <strong>+0.41</strong>
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Positive! Model boosted the preferred response by 50% relative to reference.
              </T>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.red} bold size={16}>
                Rejected log-ratio:
              </T>
              <div style={{ marginTop: 6, textAlign: "center" }}>
                <T color={C.bright} size={16} style={{ fontFamily: "monospace" }}>
                  log(0.015 / 0.025) = log(0.60) = <strong>-0.51</strong>
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Negative! Model reduced the rejected response by 40% relative to reference.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={16}>
                The gap:
              </T>
              <div style={{ marginTop: 6, textAlign: "center" }}>
                <T color={C.bright} bold size={17} style={{ fontFamily: "monospace" }}>
                  (+0.41) - (-0.51) = <strong style={{ color: C.green }}>+0.92</strong>
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Positive gap = the model is learning in the right direction. It is simultaneously boosting what humans
                preferred AND reducing what they rejected.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 4: The full DPO loss formula ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Full DPO Loss Formula
          </T>
          <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={16} style={{ fontFamily: "monospace", lineHeight: 2 }}>
              Loss = -log( sigmoid( beta x gap ) )
            </T>
            <T color={C.dim} center size={14} style={{ marginTop: 4 }}>
              where gap = log(pi/pi_ref) for preferred - log(pi/pi_ref) for rejected
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 12 }}>
            Let's plug in our numbers with <strong>beta = 0.1</strong>:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                step: "1. The gap (from above)",
                calc: "+0.92",
                color: C.yellow,
              },
              {
                step: "2. Scale by beta",
                calc: "0.1 x 0.92 = 0.092",
                color: C.orange,
              },
              {
                step: "3. Apply sigmoid",
                calc: "sigmoid(0.092) = 0.523",
                color: C.purple,
              },
              {
                step: "4. Take -log",
                calc: "-log(0.523) = 0.649",
                color: C.red,
              },
            ].map(({ step, calc, color }) => (
              <div
                key={step}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <T color={color} bold size={16}>
                  {step}
                </T>
                <T color={C.bright} size={16} style={{ fontFamily: "monospace" }}>
                  {calc}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <T color={C.bright} bold size={17}>
              Loss = 0.649
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={16}>
              How does loss decrease?
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              As the gap grows (model gets better at preferring what humans prefer), sigmoid approaches 1, and -log(1) =
              0. So the loss falls toward zero. The model is doing exactly what the formula rewards:{" "}
              <strong>boost preferred, reduce rejected</strong>.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 5: Beta - the safety leash ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Beta - The Safety Leash
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Beta controls how much the model can change from the reference. Same gap of 0.92, two different betas:
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={17}>
                beta = 0.1 (loose leash)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  0.1 x 0.92 = 0.092
                </T>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  sigmoid(0.092) = 0.523
                </T>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  Loss = 0.649
                </T>
              </div>
              <T color={C.orange} size={14} style={{ marginTop: 8 }}>
                Loss is barely below the maximum (0.693). The model needs a HUGE gap to reduce loss much. It keeps
                changing, drifting far from the reference.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                beta = 0.5 (tight leash)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  0.5 x 0.92 = 0.46
                </T>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  sigmoid(0.46) = 0.613
                </T>
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  Loss = 0.489
                </T>
              </div>
              <T color={C.green} size={14} style={{ marginTop: 8 }}>
                Same gap already gives much lower loss. The model gets "credit" for smaller changes, so it stops sooner.
                Stays close to the reference.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              In practice:
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              Most DPO implementations use beta between 0.1 and 0.5. Lower beta = model learns aggressively but risks
              going off the rails. Higher beta = safer, more conservative changes. Typical default:{" "}
              <strong>beta = 0.1</strong>.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 6: RLHF vs DPO comparison ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            RLHF vs DPO - The Full Comparison
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 1fr",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <T color={C.bright} bold size={15}></T>
              <T color={C.red} bold center size={15}>
                RLHF
              </T>
              <T color={C.green} bold center size={15}>
                DPO
              </T>
            </div>
            {[
              {
                label: "Models needed",
                rlhf: "4 (policy, ref, reward, value)",
                dpo: "2 models (policy + reference)",
              },
              {
                label: "Training type",
                rlhf: "RL loop (PPO) - unstable",
                dpo: "Supervised loss - stable",
              },
              {
                label: "Reward hacking",
                rlhf: "Real risk - model games the reward model",
                dpo: "No reward model to hack",
              },
              {
                label: "Hyperparams",
                rlhf: "Many (PPO clip, LR, KL penalty...)",
                dpo: "Mainly just beta",
              },
              {
                label: "GPU memory",
                rlhf: "4 models loaded at once",
                dpo: "2 models loaded at once",
              },
              {
                label: "Quality",
                rlhf: "High",
                dpo: "Comparable (within 1-2%)",
              },
            ].map(({ label, rlhf, dpo }) => (
              <div
                key={label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <T color={C.mid} bold size={14}>
                  {label}
                </T>
                <T color={C.dim} size={14}>
                  {rlhf}
                </T>
                <T color={C.dim} size={14}>
                  {dpo}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              DPO Variants
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "IPO", desc: "Fixes overfitting by using a squared loss instead of log-sigmoid" },
                { name: "KTO", desc: "Works with thumbs-up/down (no pairs needed)" },
                { name: "ORPO", desc: "Combines SFT + alignment in a single training step" },
              ].map(({ name, desc }) => (
                <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "4px 8px" }}>
                  <T color={C.purple} bold size={16} style={{ minWidth: 50 }}>
                    {name}
                  </T>
                  <T color={C.dim} size={14}>
                    {desc}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color={C.blue} style={{ marginTop: 10 }}>
            Same quality, a fraction of the complexity. DPO and its variants have largely replaced RLHF in practice.
          </T>
        </Box>
      </Reveal>

      {sub < 6 && (
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
