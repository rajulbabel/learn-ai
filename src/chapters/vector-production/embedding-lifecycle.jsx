import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function EmbeddingLifecycle(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            You indexed 500M vectors two years ago. The model has moved on.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Two years ago the team shipped a retrieval system with 500M documents indexed via OpenAI&apos;s
            text-embedding-ada-002 (d = 1536). Today that model is deprecated and text-embedding-3-large (d = 3072) is
            the new default. Every vector in the existing index is &quot;wrong&quot; in the sense that it was produced
            by an encoder that is no longer the state of the art. How do you move forward?
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Timeline of an indexed-years-ago corpus
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              2024: <span style={{ color: C.cyan }}>500M docs</span> embedded with ada-002 (d = 1536)
              <br />
              2025: OpenAI <span style={{ color: C.cyan }}>upgrades</span> to text-embedding-3-large (d = 3072)
              <br />
              2026: ada-002 announced deprecated
              <br />
              Production system runs on two-year-old encoders
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
            This is the most common silent pain in production vector search. Models change, and what used to be a
            state-of-the-art embedding decays into yesterday&apos;s encoder.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Dimension mismatch is a hard migration
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }} center>
            The new model outputs a different vector dimension. ada-002 emits 1536 dims; text-embedding-3-large emits
            3072. Vector DBs pin the collection to one dimension at creation time - you cannot mix 1536-dim vectors with
            3072-dim vectors in the same index. Every migration path has to deal with this up front.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Dimension mismatch
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.red}08`,
                  border: `1px solid ${C.red}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold size={14} center>
                  Old index
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: C.red }}>1536 dims</div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  Ada-002
                </T>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={14} center>
                  New index
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: C.green }}>3072 dims</div>
                <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                  Text-embedding-3-large
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Vector DB collections are <span style={{ color: C.yellow }}>dimension-pinned</span>
            <br />
            No mixing 1536-dim and 3072-dim in the same index
            <br />
            Any migration starts with creating a new collection
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Matryoshka embeddings (chapter 11.16) partly ease this: truncating a 3072-dim Matryoshka to 1536 is still a
            sensible embedding, though not from the older model.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Option 1: re-embed everything, swap indexes
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The conceptually clean option. Keep the source text around (if you still have it), run every doc through the
            new model, build a fresh index, atomically swap. You pay the full re-embed cost one time.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              Re-embed cost estimate at 500M docs, 500 tokens each
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Tokens: 500M &middot; 500 = <span style={{ color: C.green }}>250 billion</span>
              <br />
              Price: <span style={{ color: C.green }}>$0.00013</span> per 1K tokens (text-embedding-3-large)
              <br />
              Total: <span style={{ color: C.green }}>~$32,500</span> one-time bill
              <br />
              Time: ~<span style={{ color: C.green }}>1 week</span> at API rate limits, parallelized
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Requires <span style={{ color: C.green }}>retained source text</span> (huge gotcha if you dropped it)
            <br />
            Cost scales linearly with N and token budget
            <br />
            Clean cut-over, no two versions to maintain
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Re-embedding is often the cheapest option measured over a year. The upfront bill is what blocks it -
            engineering teams are reluctant to spend five figures on something that looks like cleanup.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Option 2: parallel indexes during migration, serve from old, populate new
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Stand up the new index alongside the old. Dual-write every new or updated doc to both. Backfill the old
            corpus to the new index in the background. Compare quality on real traffic by shadow-querying. When the new
            index is caught up and its quality is verified, flip traffic. Then deprecate the old one.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              Parallel migration timeline
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Week 0: create new collection, start dual-write on new docs
              <br />
              Week 1-3: backfill old corpus into new index in background
              <br />
              Week 4: shadow-query both, measure recall delta
              <br />
              Week 5: <span style={{ color: C.orange }}>cutover</span> traffic to new index
              <br />
              Week 6: retire old index
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Traffic stays on the old index the whole time
            <br />
            Double storage cost during the overlap window
            <br />
            Quality can be <span style={{ color: C.orange }}>flipped back</span> if the new index underperforms
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the standard low-risk path. It costs more - you run two indexes for weeks - but regressions never
            reach production traffic.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Option 3: pin the old model forever (pin and pray)
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The do-nothing option. Pin the embedding model version, keep using it, never migrate. Works until the
            provider deprecates the model or drift quietly erodes quality. Many teams end up here because upgrading
            feels optional; a year later they discover retrieval quality has decayed and they now face a forced
            migration under deadline pressure.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={16}>
              The failure modes of pinning
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  name: "Provider deprecation",
                  text: "Vendor sunsets the old model, forced migration under a deadline",
                },
                {
                  name: "Silent drift",
                  text: "Model did not change but the domain did - recall decays over time",
                },
                {
                  name: "New language / domain",
                  text: "Content types the old model never saw are served poorly",
                },
                {
                  name: "Missed capability",
                  text: "Competitors ship features (longer context, better multilingual) that the pinned model cannot match",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.red}08`,
                    border: `1px solid ${C.red}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold size={14} center>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                    {r.text}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Pinning is <span style={{ color: C.red }}>short-term cheap, long-term expensive</span>
            <br />
            Works fine for 6-12 months, pain compounds after
            <br />
            Drift is invisible unless you monitor it
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Pinning is a valid choice as long as you plan the exit. Shipping without a re-embedding story is the failure
            mode.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Drift monitoring: periodic ground-truth evals
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The cure for silent quality decay is explicit monitoring. Keep a held-out set of (query, relevant-doc)
            pairs. Every week or month, run the current index against the eval set and record recall@k. Any sudden drop
            signals either a model change, a content change, or an index regression - each demands a different response.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Drift monitoring stack
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  name: "Ground-truth eval set",
                  note: "1K to 10K (query, relevant-doc) pairs, refreshed quarterly",
                },
                {
                  name: "Weekly recall@10 run",
                  note: "Run the eval, record the curve, alert on regression",
                },
                {
                  name: "Content-change monitor",
                  note: "Track the embedding distribution (mean, variance) per ingest batch",
                },
                {
                  name: "Model-change signal",
                  note: "Lock embedding model version, surface drift when you bump it",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.purple} bold size={14} center>
                    {r.name}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }} center>
                    {r.note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Monitor <span style={{ color: C.purple }}>recall &middot; drift &middot; eval</span> or discover regression
            after users notice
            <br />
            Ground-truth sampling is cheap; a quality regression is not
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Whatever migration option you pick, drift monitoring is the common prerequisite. Without it, none of the
            other three can be operated safely.
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
