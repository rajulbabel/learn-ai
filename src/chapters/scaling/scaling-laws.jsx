import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function ScalingLaws(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The discovery (2020):
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            OpenAI found that language model performance follows <strong>predictable mathematical patterns</strong> as
            you scale three things:
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The three scaling axes:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { axis: "Parameters", symbol: "N", example: "1B → 7B → 70B → 175B", desc: "Model size (weights)" },
              { axis: "Data (Tokens)", symbol: "D", example: "100B tokens → 1T tokens", desc: "Total training data" },
              {
                axis: "Compute",
                symbol: "C",
                example: "1 GPU → 1000 GPUs",
                desc: "GPU hours, FLOPs (total math operations - each multiply or add counts as one)",
              },
            ].map(({ axis, symbol, example, desc }) => (
              <div
                key={axis}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.yellow} bold size={15}>
                  {symbol}. {axis}
                </T>
                <T color={C.dim} size={13}>
                  {desc}
                </T>
                <T color={C.dim} size={12}>
                  Examples: {example}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            The key scaling law:
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Scale all three together → smooth, predictable improvement
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Scale one alone → diminishing returns
          </T>
          <div
            style={{
              margin: "14px 0",
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold size={24} center>
              Loss ∝ N<sup style={{ fontSize: 16 }}>-α</sup> × D<sup style={{ fontSize: 16 }}>-β</sup> × C
              <sup style={{ fontSize: 16 }}>-γ</sup>
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Performance improves as a power law with size.
            </T>
          </div>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Like a recipe: more flour alone doesn't make more cake without more eggs and butter.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Real examples:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { model: "GPT-2", params: "1.5B", capabilities: "Can complete text decently" },
              { model: "GPT-3", params: "175B", capabilities: "Can do in-context learning, few-shot prompting" },
              {
                model: "GPT-4",
                params: "~1.8T (estimated)",
                capabilities: "Can reason, code, multimodal, passes LSAT",
              },
            ].map(({ model, params, capabilities }) => (
              <div
                key={model}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold size={14}>
                  {model}: {params}
                </T>
                <T color={C.dim} size={13}>
                  {capabilities}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Each jump in scale = major capability leap.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The practical impact:
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Train a small model (1B params). Measure performance.
          </T>
          <T color="#b8a9ff">
            Use the scaling law to <strong>predict</strong> how a 175B model will perform.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            This <strong>saves millions in compute</strong>. You don't need to actually train the giant model to
            forecast results.
          </T>
        </Box>
      </Reveal>
      {/* ── Sub 5: Chinchilla - The Problem ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>
            Chinchilla (DeepMind 2022): Models Were Undertrained
          </T>
          <T color="#ce93d8" style={{ marginTop: 8 }}>
            Before Chinchilla, the AI world had one strategy: <strong>make the model bigger</strong>. GPT-3 had 175B
            parameters - but was only trained on 300B tokens.
          </T>
          <T color="#ce93d8" style={{ marginTop: 8 }}>
            Think about it. You have a brilliant student (175 billion parameters of "brain capacity") but you only gave
            them <strong>two textbooks to read</strong> (300B tokens). That student is undertrained - not too small.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color={C.pink} bold size={16}>
              The question DeepMind asked:
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 6 }}>
              If you have a fixed compute budget (say, $10 million of GPU time), should you spend it on a{" "}
              <strong>bigger model with less data</strong>, or a <strong>smaller model with more data</strong>?
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 6: Chinchilla vs Gopher - The Proof ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Proof: Chinchilla vs Gopher
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            DeepMind trained two models with <strong>the same compute budget</strong>, but split it differently:
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "stretch" }}>
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
                Gopher (old strategy)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={15}>
                  Parameters: <strong style={{ color: C.red }}>280B</strong>
                </T>
                <T color={C.dim} size={15}>
                  Training tokens: <strong style={{ color: C.red }}>300B</strong>
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4, fontStyle: "italic" }}>
                  Giant brain, tiny reading list
                </T>
              </div>
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
                Chinchilla (new strategy)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={15}>
                  Parameters: <strong style={{ color: C.green }}>70B</strong>
                </T>
                <T color={C.dim} size={15}>
                  Training tokens: <strong style={{ color: C.green }}>1.4T</strong>
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4, fontStyle: "italic" }}>
                  Smaller brain, massive reading list
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={17}>
              Chinchilla won. On every benchmark.
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              A model 4x smaller beat the big one - because it saw 4.6x more data. The "smaller" model was actually
              better trained.
            </T>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            This proved that <strong>data matters as much as size</strong>. Throwing parameters at a problem without
            enough training data is waste.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 7: The 20:1 Rule ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The 20:1 Rule
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Chinchilla's key finding: for optimal training, use roughly <strong>20 tokens per parameter</strong>.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                model: "7B model",
                calc: "7B x 20 = 140B tokens",
                example: "LLaMA 7B used ~1T (well above optimal - even better!)",
                color: C.green,
              },
              {
                model: "70B model",
                calc: "70B x 20 = 1.4T tokens",
                example: "Chinchilla hit exactly this ratio",
                color: C.cyan,
              },
              {
                model: "175B model",
                calc: "175B x 20 = 3.5T tokens",
                example: "GPT-3 only used 300B tokens (10x too few!)",
                color: C.red,
              },
            ].map(({ model, calc, example, color }) => (
              <div
                key={model}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold size={16}>
                  {model}
                </T>
                <div style={{ marginTop: 4, textAlign: "center" }}>
                  <T color={C.bright} size={15} style={{ fontFamily: "monospace" }}>
                    {calc}
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {example}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold size={16}>
              The impact on the industry:
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 6 }}>
              After Chinchilla, labs stopped just making models bigger. LLaMA (Meta, 2023) proved a 7B model trained on
              1T+ tokens per parameter could match much larger models. Today, training data quality and quantity matter
              as much as parameter count.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub < 7 && (
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
