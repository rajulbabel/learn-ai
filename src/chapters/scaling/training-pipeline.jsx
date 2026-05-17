import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function TrainingPipeline(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={22}>
            Let's zoom out.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            You've now learned every stage of how an LLM is built - tokenization, pretraining, loss functions, SFT,
            RLHF, scaling laws, distillation, and CLIP.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Here's the full journey from "pile of internet text" to "ChatGPT answering your questions."
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Phase 1: Pretraining
          </T>
          <T color={C.dim} center size={13}>
            2-3 months · $10-100 million
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
            <T color="#ff8a80" size={14}>
              Feed the model trillions of words from the internet - books, Wikipedia, code, websites, forums,
              everything.
            </T>
            <T color="#ff8a80" size={14} style={{ marginTop: 6 }}>
              The model learns by playing the prediction game millions of times:
            </T>
            <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.dim} size={13}>
                "The cat sat on the ___"
              </T>
              <T color={C.green} size={13}>
                Model predicts: "mat" (checks answer, adjusts weights, repeats)
              </T>
            </div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
              <T color={C.green} bold size={13}>
                Gains
              </T>
              <T color={C.dim} size={12}>
                Knowledge, language, reasoning, patterns
              </T>
            </div>
            <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.red}10`, textAlign: "center" }}>
              <T color={C.red} bold size={13}>
                Lacks
              </T>
              <T color={C.dim} size={12}>
                Can't answer questions - just autocompletes
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Phase 2: SFT (Supervised Fine-Tuning)
          </T>
          <T color={C.dim} center size={13}>
            1-2 weeks · $1,000-10,000
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
            <T color="#ffe082" size={14}>
              Humans write 10,000-100,000 perfect Q&A examples. The model trains on these to learn:
            </T>
            <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.dim} size={13}>
                Q: "How do I boil an egg?"
              </T>
              <T color={C.green} size={13}>
                A: "Put egg in water, boil, 6 min for soft, 12 for hard."
              </T>
            </div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}>
              <T color={C.green} bold size={13}>
                Gains
              </T>
              <T color={C.dim} size={12}>
                Answers questions, follows instructions, right tone
              </T>
            </div>
            <div style={{ flex: 1, padding: "6px", borderRadius: 6, background: `${C.red}10`, textAlign: "center" }}>
              <T color={C.red} bold size={13}>
                Lacks
              </T>
              <T color={C.dim} size={12}>
                Might still be rude, harmful, or confidently wrong
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>
            Phase 3: RLHF (Human Feedback)
          </T>
          <T color={C.dim} center size={13}>
            1-2 weeks · $1,000-10,000
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
            <T color="#ce93d8" size={14}>
              Humans compare pairs of responses and pick the better one. A reward model learns their preferences, then
              the LLM optimizes for higher reward.
            </T>
            <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
              <T color={C.green} size={13}>
                Answer A: helpful, clear, safe → Human picks this
              </T>
              <T color={C.red} size={13}>
                Answer B: rude, misleading → Rejected
              </T>
            </div>
          </div>
          <div
            style={{ marginTop: 8, padding: "8px", borderRadius: 6, background: `${C.green}10`, textAlign: "center" }}
          >
            <T color={C.green} bold size={14}>
              Result: Helpful, harmless, honest assistant
            </T>
            <T color={C.dim} size={12}>
              This is what becomes ChatGPT, Claude, Gemini
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            After launch - Optional upgrades
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            The 3 phases above create the base model. But companies often add extra capabilities:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}
            >
              <T color={C.cyan} bold size={15}>
                Distillation - make it smaller & cheaper
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 3 }}>
                GPT-4 is brilliant but expensive. So the big model "teaches" a smaller one. The student learns 90% of
                the teacher's ability at 1/100th the cost. That's how GPT-4 Mini and Claude Haiku exist - fast, cheap,
                and still smart.
              </T>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}15`,
              }}
            >
              <T color={C.purple} bold size={15}>
                CLIP - make it understand images
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 3 }}>
                The base model only understands text. To make it "see" photos, you plug in a CLIP-style image encoder.
                The image gets converted into the same number space as text, so the model can "read" the photo. That's
                how ChatGPT and Claude understand screenshots, diagrams, and photos you upload.
              </T>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <T color={C.yellow} bold size={15}>
                RAG - give it access to fresh info
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 3 }}>
                The model's knowledge is frozen at training time. It doesn't know today's news. RAG (Retrieval-Augmented
                Generation) lets the model search a database or the web BEFORE answering - like giving a student an
                open-book exam. That's how ChatGPT can browse the web and cite sources.
              </T>
            </div>
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}
            >
              <T color={C.green} bold size={15}>
                Domain fine-tuning - make it an expert
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 3 }}>
                Want an AI that's amazing at medicine? Law? Finance? Take the general model and train it further on
                domain-specific data. A hospital might fine-tune on millions of medical records. The model keeps its
                general intelligence but becomes an expert in that field.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={22}>
            Parts 2 & 3 - Complete
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            You now understand the full lifecycle of an LLM:
          </T>
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
              <div
                key={num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: `${color}20`,
                    border: `1px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <T color={color} bold size={12}>
                    {num}
                  </T>
                </div>
                <T color={C.dim} size={13}>
                  {text}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: `${C.purple}12`,
              borderRadius: 8,
              border: `2px solid ${C.purple}35`,
            }}
          >
            <T color={C.purple} size={15} center bold>
              Next up: the architecture that makes all of this possible - Transformers and Attention.
            </T>
          </div>
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
