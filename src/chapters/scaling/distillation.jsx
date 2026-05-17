import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Distillation(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>
            The problem: big models are expensive
          </T>
          <T color="#ce93d8" style={{ marginTop: 8 }}>
            GPT-4 has 1.8 trillion parameters. Running it costs a fortune. It's slow.
          </T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>
            But your phone app needs instant replies. You can't run GPT-4 on a phone.
          </T>
          <T color="#ce93d8" style={{ marginTop: 8 }}>
            Question: Can we make a small model that's almost as smart as the big one?
          </T>
          <T color="#ce93d8" style={{ marginTop: 4 }}>
            Yes. The trick is called <strong>knowledge distillation</strong> - and it works like a teacher and student.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Teacher teaches Student
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Instead of training the small model from scratch (expensive!), let the big model teach it.
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.purple}12`,
                border: `1px solid ${C.purple}25`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold size={16}>
                Teacher
              </T>
              <T color={C.purple} size={13}>
                GPT-4
              </T>
              <T color={C.dim} size={12}>
                1.8 trillion params
              </T>
              <T color={C.dim} size={12}>
                Slow, expensive
              </T>
              <T color={C.dim} size={12}>
                Extremely smart
              </T>
            </div>
            <T color={C.dim} size={24}>
              →
            </T>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}12`,
                border: `1px solid ${C.green}25`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold size={16}>
                Student
              </T>
              <T color={C.green} size={13}>
                GPT-4 Mini
              </T>
              <T color={C.dim} size={12}>
                8 billion params
              </T>
              <T color={C.dim} size={12}>
                Fast, cheap
              </T>
              <T color={C.dim} size={12}>
                Learns from teacher
              </T>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            How? Show both models the same questions. The student tries to copy the teacher's answers - not just the
            final answer, but how the teacher thinks.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            What does "copy how the teacher thinks" mean?
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Question: "What is the capital of India?"
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            A lazy teacher just says the answer:
          </T>
          <div style={{ marginTop: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.red} bold size={14}>
              Just the answer: "Delhi"
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>
              That's it. Right or wrong. No nuance.
            </T>
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            A great teacher shares their full thinking - as confidence bars:
          </T>
          <div style={{ marginTop: 6, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.green} bold size={14} style={{ marginBottom: 6 }}>
              Teacher's confidence on each option:
            </T>
            {[
              { word: "Delhi", pct: 85, color: C.green },
              { word: "London", pct: 8, color: C.yellow },
              { word: "Mumbai", pct: 5, color: C.orange },
              { word: "Berlin", pct: 2, color: C.red },
            ].map(({ word, pct, color }) => (
              <div key={word} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <T color={C.dim} size={13} style={{ width: 55, textAlign: "right" }}>
                  {word}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 18,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
                </div>
                <T color={color} bold size={11} style={{ minWidth: 30, textAlign: "right" }}>
                  {pct}%
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            This full set of confidences is called <strong>"soft probabilities"</strong> - and it's the key to
            distillation.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why soft probabilities are magic
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Look at the teacher's confidences again. The "wrong" answers tell a story:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.green}10`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 30,
                  background: C.green,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="#000" bold size={12}>
                  85%
                </T>
              </div>
              <div>
                <T color={C.green} bold size={14}>
                  Delhi
                </T>
                <T color={C.dim} size={12}>
                  Correct answer
                </T>
              </div>
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.yellow}08`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 30,
                  background: C.yellow,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="#000" bold size={12}>
                  8%
                </T>
              </div>
              <div>
                <T color={C.yellow} bold size={14}>
                  London
                </T>
                <T color={C.dim} size={12}>
                  Wrong - but it is a European capital
                </T>
              </div>
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.orange}08`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 30,
                  background: C.orange,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="#000" bold size={12}>
                  5%
                </T>
              </div>
              <div>
                <T color={C.orange} bold size={14}>
                  Mumbai
                </T>
                <T color={C.dim} size={12}>
                  Wrong - but it is an Indian city
                </T>
              </div>
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.red}06`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 30,
                  background: C.red,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="#000" bold size={12}>
                  0%
                </T>
              </div>
              <div>
                <T color={C.red} bold size={14}>
                  Pizza
                </T>
                <T color={C.dim} size={12}>
                  Not even a city
                </T>
              </div>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            If you only said "Delhi = right, everything else = wrong" - the student would think London and Pizza are
            equally wrong.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 4 }}>
            But the soft probabilities teach: "London is close (it's a capital). Mumbai is related (it's Indian). Pizza
            is nonsense." The student absorbs how concepts relate - for free.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}25`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              The temperature trick
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              To get even softer probabilities, we divide the logits by a{" "}
              <strong style={{ color: C.purple }}>temperature T</strong> before softmax: softmax(z_i / T)
            </T>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.cyan}08` }}>
                <T color={C.cyan} bold center size={13}>
                  T = 1 (normal)
                </T>
                <T color={C.dim} size={12}>
                  Delhi: 85%
                </T>
                <T color={C.dim} size={12}>
                  London: 8%
                </T>
                <T color={C.dim} size={12}>
                  Mumbai: 5%
                </T>
                <T color={C.dim} size={12}>
                  Berlin: 2%
                </T>
              </div>
              <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: `${C.purple}08` }}>
                <T color={C.purple} bold center size={13}>
                  T = 3 (soft)
                </T>
                <T color={C.dim} size={12}>
                  Delhi: 45%
                </T>
                <T color={C.dim} size={12}>
                  London: 20%
                </T>
                <T color={C.dim} size={12}>
                  Mumbai: 18%
                </T>
                <T color={C.dim} size={12}>
                  Berlin: 17%
                </T>
              </div>
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>
              Higher temperature = softer distribution = more information about the relationships between tokens. This
              is also the same "temperature" slider you see in ChatGPT settings - higher T = more creative (spread out),
              lower T = more focused (peaked).
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            This is everywhere
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Most AI models you actually use daily are distilled students:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { teacher: "GPT-4", student: "GPT-4 Mini", why: "100× cheaper API calls" },
              { teacher: "Claude Opus", student: "Claude Haiku", why: "Fast enough for your phone" },
              { teacher: "LLaMA 70B", student: "LLaMA 7B", why: "Runs on a laptop" },
            ].map(({ teacher, student, why }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <div style={{ padding: "3px 8px", borderRadius: 4, background: `${C.purple}15` }}>
                  <T color={C.purple} size={12}>
                    {teacher}
                  </T>
                </div>
                <T color={C.dim} size={14}>
                  →
                </T>
                <div style={{ padding: "3px 8px", borderRadius: 4, background: `${C.green}15` }}>
                  <T color={C.green} size={12}>
                    {student}
                  </T>
                </div>
                <T color={C.dim} size={12}>
                  {why}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" style={{ marginTop: 10 }}>
            The big expensive model trains once. Then it teaches smaller, faster models. That's why you can chat with AI
            instantly on your phone - you're talking to a student who learned from a genius.
          </T>
        </Box>
      </Reveal>
      {sub < 4 && (
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
