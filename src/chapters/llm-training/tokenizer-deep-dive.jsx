import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function TokenizerDeepDive(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Recap: BPE (Byte-Pair Encoding)
          </T>
          <T color={C.blue} style={{ marginTop: 6 }}>
            In <ChapterLink to="5.1">chapter 5.1</ChapterLink>, we learned BPE: start with characters, merge the most frequent pair, repeat. Let's trace
            "low" through BPE from scratch:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "Start", tokens: ['"l"', '"o"', '"w"'], desc: "Split into individual characters", highlight: -1 },
              { step: "Merge 1", tokens: ['"lo"', '"w"'], desc: 'Most frequent pair: l + o → "lo"', highlight: 0 },
              { step: "Merge 2", tokens: ['"low"'], desc: 'Next frequent pair: lo + w → "low"', highlight: 0 },
            ].map(({ step, tokens, desc, highlight }) => (
              <div
                key={step}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                }}
              >
                <T color={C.blue} bold size={16}>
                  {step}
                </T>
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tokens.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 5,
                        background: i === highlight ? `${C.green}20` : `${C.blue}10`,
                        border: `1px solid ${i === highlight ? C.green : C.blue}25`,
                      }}
                    >
                      <code style={{ color: i === highlight ? C.green : C.blue, fontSize: 16, fontWeight: 600 }}>
                        {t}
                      </code>
                    </div>
                  ))}
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>
            BPE is used by GPT-2, GPT-3, GPT-4. It picks merges by <strong>raw frequency count</strong>.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            WordPiece (used by BERT)
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Similar to BPE, but instead of raw frequency, WordPiece merges the pair that{" "}
            <strong>most increases the training data likelihood</strong>.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={16}>
                BPE merge criterion
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                count("lo") = 847 - highest count wins
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                WordPiece merge criterion
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                score("lo") = count("lo") / (count("l") x count("o")) - likelihood ratio wins
              </T>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            Key visual marker: the <strong>##</strong> prefix marks sub-word continuations.
          </T>
          <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              Example: "playing"
            </T>
            <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center" }}>
              {[
                { t: "play", c: C.purple },
                { t: "##ing", c: C.orange },
              ].map(({ t, c }) => (
                <div
                  key={t}
                  style={{ padding: "6px 12px", borderRadius: 6, background: `${c}15`, border: `1px solid ${c}30` }}
                >
                  <code style={{ color: c, fontSize: 17, fontWeight: 700 }}>{t}</code>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} center style={{ marginTop: 6 }}>
              The ## means "I'm a continuation of the previous token, not a standalone word"
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            SentencePiece (used by LLaMA, T5)
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            SentencePiece takes a fundamentally different approach: it treats the input as{" "}
            <strong>raw bytes/unicode</strong>. No pre-tokenization step - no word splitting first.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold size={16}>
                BPE / WordPiece: pre-tokenize first
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                "I love cats" → split on spaces → ["I", "love", "cats"] → then apply merges within each word
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                SentencePiece: raw stream
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                "I love cats" → treat as raw character stream including spaces → apply merges directly
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Why this matters: languages without spaces
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { lang: "Chinese", ex: "I love cats", note: "No spaces between characters" },
                { lang: "Japanese", ex: "I love cats", note: "Mixed scripts, no consistent word boundaries" },
                { lang: "Thai", ex: "I love cats", note: "Words run together without separators" },
              ].map(({ lang, note }) => (
                <div key={lang} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                  <T color={C.cyan} bold size={15} style={{ minWidth: 70 }}>
                    {lang}
                  </T>
                  <T color={C.dim} size={14}>
                    {note}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Pre-tokenizers that split on spaces would fail completely. SentencePiece handles all of these naturally
              because it works on raw bytes.
            </T>
          </div>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Under the hood, SentencePiece can use either BPE or a <strong>Unigram</strong> model (which starts with a
            large vocabulary and prunes it down, the reverse of BPE).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Why tokenization matters more than you think
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            The same concept can cost wildly different numbers of tokens depending on how it is written:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Numbers: inconsistent splits break arithmetic
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { input: '"12345"', tokens: '["123", "45"]', count: "2 tokens" },
                  { input: '"67890"', tokens: '["678", "90"]', count: "2 tokens" },
                  { input: '"12345 + 67890"', tokens: '["123", "45", " +", " ", "678", "90"]', count: "6 tokens" },
                ].map(({ input, tokens, count }) => (
                  <div key={input} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                    <code style={{ color: C.orange, fontSize: 15, minWidth: 130 }}>{input}</code>
                    <T color={C.dim} size={14}>
                      → {tokens}
                    </T>
                    <T color={C.mid} size={13} bold style={{ marginLeft: "auto" }}>
                      {count}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                The digit boundary shifts depending on the number. The model never sees "12345" as a single unit, making
                arithmetic unreliable.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={16}>
                Non-English: same meaning, 3x the cost
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { word: '"Hello"', tokens: "1 token", cost: "1x", color: C.green },
                  { word: '"Bonjour"', tokens: "1-2 tokens", cost: "1-2x", color: C.yellow },
                  { word: '"Namaste"', tokens: "3 tokens", cost: "3x", color: C.red },
                ].map(({ word, tokens, cost, color }) => (
                  <div key={word} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                    <code style={{ color, fontSize: 16, fontWeight: 600, minWidth: 90 }}>{word}</code>
                    <T color={C.dim} size={14}>
                      {tokens}
                    </T>
                    <T color={color} bold size={14} style={{ marginLeft: "auto" }}>
                      {cost}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                English dominates the training data, so English words get single tokens. Other languages pay a token
                tax.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={16}>
                Code: similar words, different token counts
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { word: '"print"', tokens: '["print"]', count: "1 token" },
                  { word: '"println"', tokens: '["print", "ln"]', count: "2 tokens" },
                  { word: '"printf"', tokens: '["print", "f"]', count: "2 tokens" },
                ].map(({ word, tokens, count }) => (
                  <div key={word} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 8px" }}>
                    <code style={{ color: C.cyan, fontSize: 15, fontWeight: 600, minWidth: 90 }}>{word}</code>
                    <T color={C.dim} size={14}>
                      → {tokens}
                    </T>
                    <T color={C.mid} size={13} bold style={{ marginLeft: "auto" }}>
                      {count}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                More tokens = slower inference (each token needs a full forward pass through the model).
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Vocabulary size tradeoffs
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            How many tokens should the vocabulary contain? It is a direct tradeoff:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold center size={17}>
                  Bigger vocab (100K)
                </T>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                  <T color={C.dim} size={14}>
                    + Shorter sequences (fewer tokens per sentence)
                  </T>
                  <T color={C.dim} size={14}>
                    + Faster inference
                  </T>
                  <T color={C.dim} size={14}>
                    - More embedding parameters
                  </T>
                  <T color={C.dim} size={14}>
                    - 100K x 4096 dims = <strong style={{ color: C.red }}>409M</strong> just for embeddings
                  </T>
                </div>
              </div>
              <div
                style={{ padding: "10px", borderRadius: 8, background: `${C.blue}06`, border: `1px solid ${C.blue}12` }}
              >
                <T color={C.blue} bold center size={17}>
                  Smaller vocab (32K)
                </T>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                  <T color={C.dim} size={14}>
                    + Fewer embedding parameters
                  </T>
                  <T color={C.dim} size={14}>
                    + 32K x 4096 = <strong style={{ color: C.green }}>131M</strong> for embeddings
                  </T>
                  <T color={C.dim} size={14}>
                    - Longer sequences (more tokens per sentence)
                  </T>
                  <T color={C.dim} size={14}>
                    - Slower inference
                  </T>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <T color="#ffe082" bold center size={16}>
              Real-world vocabulary sizes
            </T>
            {[
              {
                model: "GPT-2",
                vocab: "50,257",
                dims: "768",
                embParams: "38.6M",
                note: "First widely-used BPE tokenizer",
              },
              {
                model: "LLaMA",
                vocab: "32,000",
                dims: "4,096",
                embParams: "131M",
                note: "Smaller vocab, more languages",
              },
              {
                model: "GPT-4",
                vocab: "~100,000",
                dims: "~4,096",
                embParams: "~409M",
                note: "Largest vocab, shortest sequences",
              },
            ].map(({ model, vocab, dims, embParams, note }) => (
              <div
                key={model}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 70px 60px 60px 1fr",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                  alignItems: "center",
                }}
              >
                <T color={C.yellow} bold size={14}>
                  {model}
                </T>
                <T color={C.mid} size={13}>
                  {vocab}
                </T>
                <T color={C.dim} size={13}>
                  {dims}d
                </T>
                <T color={C.mid} size={13}>
                  {embParams}
                </T>
                <T color={C.dim} size={12}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              Why LLaMA chose 32K
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              Meta wanted LLaMA to handle many languages efficiently. A smaller vocab means each token is more "general"
              (sub-word pieces that appear across languages). The tradeoff: slightly longer sequences, but a much
              smaller embedding table and better multilingual coverage per parameter.
            </T>
          </div>
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
