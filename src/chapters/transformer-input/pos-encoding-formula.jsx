import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingFormula(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${C.cyan}20`,
            borderRadius: 10,
            padding: "16px",
            width: "100%",
          }}
        >
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            The Formula
          </T>
          <div
            style={{ fontFamily: "monospace", fontSize: 19, color: "#80cbc4", textAlign: "center", lineHeight: 2.2 }}
          >
            <div>
              Even dims (0,2,4...): <strong>sin</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )
            </div>
            <div>
              Odd dims (1,3,5...): <strong>cos</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )
            </div>
          </div>
        </div>
      )}
      <Reveal when={sub >= 1}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {[
            { term: "pos", desc: "Position of word in sentence (0, 1, 2...)", c: C.red },
            { term: "i", desc: "Which of the 512 dimensions we're computing", c: C.purple },
            { term: "d_model", desc: "Size of embedding (512)", c: C.cyan },
            { term: "10000^(i/d)", desc: "Controls wave speed. Small i = fast. Large i = slow.", c: C.yellow },
            { term: "sin/cos", desc: "Output always between -1 and +1. Never explodes!", c: C.green },
          ].map(({ term, desc, c }) => (
            <div
              key={term}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 6,
                background: `${c}06`,
              }}
            >
              <code
                style={{
                  color: c,
                  fontWeight: 700,
                  fontSize: 18,
                  minWidth: 72,
                  background: `${c}10`,
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {term}
              </code>
              <T color={C.mid} size={16}>
                {desc}
              </T>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow}>
          <T color={C.yellow} bold center>
            The KEY insight: 10000^(i/d_model)
          </T>
          <T color="#ffe082">
            When i=0, divisor=1 → pos/1 = pos → wave oscillates fast.
            <br />
            When i=510, divisor≈10000 → pos/10000 ≈ tiny → wave changes barely.
            <br />
            <br />
            Like a clock: <strong style={{ color: C.cyan }}>seconds hand</strong> (fast) +{" "}
            <strong style={{ color: C.purple }}>hours hand</strong> (slow) = exact time.
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
