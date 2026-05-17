import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function WhyMultiHead(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Single-head attention has a problem.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Our "I love cats" example has only 3 words with 2 main relationships (who loves? what's loved?). To really
            see why one head isn't enough, we need a longer sentence with more relationships.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Consider: "The cat that I adopted last week <strong>sat</strong> on the mat."
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            "sat" needs answers to MULTIPLE questions at once:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { q: "Who sat?", answer: "cat", rel: "subject ↔ verb", color: C.cyan },
              { q: "Sat where?", answer: "mat", rel: "verb ↔ location", color: C.orange },
              { q: "Sat when?", answer: "last week", rel: "verb ↔ time", color: C.purple },
            ].map(({ q, answer, rel, color }) => (
              <div
                key={q}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px auto 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold center size={18}>
                  {q}
                </T>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tag color={color}>{answer}</Tag>
                </div>
                <T color={C.dim} size={14}>
                  {rel}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            But one head produces one set of weights - forced to compromise:
          </T>
          <div style={{ marginTop: 8 }}>
            {[
              { w: "cat", pct: 40, c: C.cyan, note: "got some" },
              { w: "mat", pct: 30, c: C.orange, note: "got some" },
              { w: "last week", pct: 5, c: C.purple, note: "almost nothing!" },
              { w: "others", pct: 25, c: C.dim, note: "scattered" },
            ].map(({ w, pct, c, note }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16, color: C.dim, minWidth: 70, textAlign: "right" }}>{w}</span>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: c }} />
                </div>
                <span style={{ fontSize: 16, color: c, fontWeight: 600, minWidth: 28 }}>{pct}%</span>
                <span style={{ fontSize: 12, color: pct <= 5 ? C.red : C.dim }}>{note}</span>
              </div>
            ))}
          </div>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>
            Temporal info ("last week") got only 5% - almost lost! One head can't focus on all relationships.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Solution: give it MULTIPLE heads - like multiple ears.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Each head has its own W_Q, W_K, W_V, so each asks a different question:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { head: 1, label: "subject-verb", q: '"who is my subject?"', finds: "cat (70%)", color: C.cyan },
              { head: 2, label: "verb-location", q: '"where am I happening?"', finds: "mat (65%)", color: C.orange },
              { head: 3, label: "temporal", q: '"when am I happening?"', finds: "week (55%)", color: C.purple },
            ].map(({ head, label, q, finds, color }) => (
              <div
                key={head}
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr 74px",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div>
                  <T color={color} bold center size={16}>
                    Head {head}
                  </T>
                  <T color={C.dim} center size={12}>
                    {label}
                  </T>
                </div>
                <T color={C.dim} size={16}>
                  sat asks: {q}
                </T>
                <T color={color} bold center size={16} style={{ textAlign: "right" }}>
                  → {finds}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            Now NO info is lost. Each head specializes in one relationship and captures it fully.
          </T>
        </Box>
      </Reveal>
      {sub < 2 && (
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
