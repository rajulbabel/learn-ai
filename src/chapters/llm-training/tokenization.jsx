import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Tokenization(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Computers only understand numbers.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Text is useless to an AI - no matter how eloquent. First step: convert <strong>"I love cats"</strong> into
            [0, 1, 2].
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            This is <strong>Tokenization</strong> - slicing text into chunks and assigning each a number from a
            vocabulary.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Three tokenization strategies exist:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                name: "Character-level",
                ex: "'love' → ['l','o','v','e']",
                nums: "[108, 111, 118, 101]",
                pros: "Works for ANY word. New letters rare",
                cons: "Way too granular. Sequences become huge.",
                color: C.red,
              },
              {
                name: "Word-level",
                ex: "'unhappy' → ['unhappy']",
                nums: "[5942]",
                pros: "Human intuitive",
                cons: "50K+ vocab needed. New words crash the model",
                color: C.orange,
              },
              {
                name: "Sub-word (BPE)",
                ex: "'unhappy' → ['un','##happy']",
                nums: "[100, 6420]",
                pros: "Sweet spot. ~50K tokens covers everything",
                cons: "Need to learn splits first",
                color: C.green,
              },
            ].map(({ name, ex, nums, pros, cons, color }) => (
              <div
                key={name}
                style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}
              >
                <T color={color} bold size={18}>
                  {name}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {ex}
                </T>
                <T color={C.mid} size={14} style={{ marginTop: 2 }}>
                  {nums}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                  ✓ {pros}
                </T>
                <T color={C.dim} size={14}>
                  ✗ {cons}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Byte-Pair Encoding (BPE) - the gold standard
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            BPE learns which character pairs appear together most. It starts with characters, then merges the most
            common pairs repeatedly.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={16} bold>
                Step 0: Split into characters
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                {["I", "␣", "l", "o", "v", "e", "␣", "c", "a", "t", "s"].map((ch, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 32,
                      padding: "6px 8px",
                      borderRadius: 4,
                      background: `${C.cyan}15`,
                      border: `1px solid ${C.cyan}30`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.cyan} bold size={15}>
                      {ch}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={16} bold>
                Step 1: Count adjacent pairs
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { p: "l + o", n: 1 },
                  { p: "o + v", n: 1 },
                  { p: "v + e", n: 1 },
                  { p: "c + a", n: 1 },
                  { p: "a + t", n: 1 },
                  { p: "t + s", n: 1 },
                ].map(({ p, n }, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: `${C.orange}10`,
                      border: `1px solid ${C.orange}20`,
                    }}
                  >
                    <T color={C.orange} size={14}>
                      {p} <strong>= {n}</strong>
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <T color={C.yellow} size={16} bold>
                Step 2: Merge most common pair
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                All pairs tie at frequency 1. Pick l + o → lo
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                {["I", "␣", "lo", "v", "e", "␣", "c", "a", "t", "s"].map((ch, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 32,
                      padding: "6px 8px",
                      borderRadius: 4,
                      background: ch === "lo" ? `${C.green}25` : `${C.cyan}15`,
                      border: `1px solid ${ch === "lo" ? C.green : C.cyan}30`,
                      textAlign: "center",
                    }}
                  >
                    <T color={ch === "lo" ? C.green : C.cyan} bold size={15}>
                      {ch}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={16} bold>
                Step 3: Repeat merging
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Recount pairs. lo + v is highest. Merge → lov. Then lov + e → love. Then c + a + t + s → cats.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                {["I", "␣", "love", "␣", "cats"].map((ch, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 32,
                      padding: "6px 10px",
                      borderRadius: 4,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}35`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.green} bold size={15}>
                      {ch}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} size={16} bold>
                Final tokens → IDs
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { t: "I", id: 0 },
                  { t: "␣", id: 1 },
                  { t: "love", id: 2 },
                  { t: "␣", id: 1 },
                  { t: "cats", id: 3 },
                ].map(({ t, id }, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 44,
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${C.green}15`,
                      border: `1px solid ${C.green}30`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.green} bold size={16}>
                      {t}
                    </T>
                    <T color={C.dim} size={12}>
                      {id}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6, textAlign: "center" }}>
                This sequence [0, 1, 2, 1, 3] is what gets fed to the model
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Real example: GPT tokenizer
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Modern tokenizers like GPT-2 use learned vocabularies of ~50,000 tokens. One sentence becomes a sequence of
            IDs:
          </T>
          <div style={{ marginTop: 12 }}>
            <T color={C.bright} size={16} center style={{ marginBottom: 10 }}>
              The cat sat on the mat last week
            </T>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { w: "The", id: "464", c: C.red },
                { w: "cat", id: "3797", c: C.orange },
                { w: "sat", id: "2906", c: C.yellow },
                { w: "on", id: "319", c: C.green },
                { w: "the", id: "262", c: C.cyan },
                { w: "mat", id: "4416", c: C.blue },
                { w: "last", id: "1297", c: C.purple },
                { w: "week", id: "1285", c: C.red },
              ].map(({ w, id, c }) => (
                <div
                  key={w + id}
                  style={{
                    minWidth: 56,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${c}10`,
                    border: `1px solid ${c}25`,
                    textAlign: "center",
                  }}
                >
                  <T color={c} bold size={18} center>
                    {w}
                  </T>
                  <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                    {id}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} center style={{ marginTop: 10 }}>
              Sequence: [464, 3797, 2906, 319, 262, 4416, 1297, 1285]
            </T>
          </div>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Each token ID points to a learned embedding (a 768-dimensional vector in GPT-3). The model never sees text -
            only numbers.
          </T>
        </Box>
      </Reveal>

      {sub < 3 && (
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
