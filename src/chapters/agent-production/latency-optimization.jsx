import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const LATENCY_T2_WATERFALL = [
  { name: "LLM Call 1", color: "red", ms: 1200, label: "Decide: Call lookup_customer" },
  { name: "Tool: lookup_customer", color: "orange", ms: 200, label: "Customer Profile Returned" },
  { name: "LLM Call 2", color: "red", ms: 1100, label: "Decide: Call reset_password" },
  { name: "Tool: reset_password", color: "orange", ms: 200, label: "Token Generated" },
  { name: "LLM Call 3", color: "red", ms: 700, label: "Final Answer" },
];

const LATENCY_CACHE_TARGETS = [
  {
    name: "Customer Profile",
    color: "red",
    ttl: "TTL: 5 Minutes",
    why: "Profile Rarely Changes Mid-Session",
  },
  {
    name: "KB Article Body",
    color: "orange",
    ttl: "TTL: 1 Hour",
    why: "KB Updates Are Infrequent",
  },
  {
    name: "Routing / Classification",
    color: "yellow",
    ttl: "TTL: Per Conversation",
    why: "Topic Rarely Shifts Mid-Convo",
  },
];

export default function LatencyOptimization(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Waterfall layout (sub=0)
  const wfViewW = 720;
  const totalMs = LATENCY_T2_WATERFALL.reduce((a, s) => a + s.ms, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Where The Seconds Go
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            Ticket T2 takes 3.4 seconds end-to-end. Break it down into spans and the story is
            blunt: LLM calls are the bulk. Tool calls are nearly free. If you want T2 faster,
            shorten LLM time first. Tool optimization is third or fourth on the list.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${wfViewW} 260`}
              style={{ width: "100%", maxWidth: wfViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Gantt-style latency waterfall for ticket T2 with 5 spans summing to 3400
                milliseconds: LLM call 1 1200ms, lookup_customer tool 200ms, LLM call 2 1100ms,
                reset_password tool 200ms, LLM call 3 700ms. LLM calls dominate the timeline.
              </desc>
              {(() => {
                const innerW = wfViewW - 200;
                let cursor = 0;
                return LATENCY_T2_WATERFALL.map((s, i) => {
                  const w = (s.ms / 3400) * innerW;
                  const y = 30 + i * 42;
                  const x = 180 + cursor;
                  cursor += w;
                  const accent = C[s.color];
                  return (
                    <g key={s.name}>
                      <text x={170} y={y + 20} fill={SOFT[s.color]} fontSize="13" fontWeight="700" textAnchor="end">
                        {s.name}
                      </text>
                      <rect x={x} y={y + 4} width={w} height={26} fill={`${accent}55`} stroke={accent} strokeWidth={1.4} rx={3} />
                      <text x={x + w + 6} y={y + 22} fill={SOFT[s.color]} fontSize="12">
                        {s.ms}ms
                      </text>
                      <text x={x + w / 2} y={y + 20} fill={SOFT[s.color]} fontSize="11" textAnchor="middle">
                        {s.label}
                      </text>
                    </g>
                  );
                });
              })()}
              <text x={wfViewW / 2} y={250} fill={C.pink} fontSize="17" fontWeight="700" textAnchor="middle">
                Total Latency: {totalMs}ms (3.4 Seconds)
              </text>
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            Three LLM calls = 3000ms of the 3400ms. Two tool calls = 400ms. The optimization
            order is forced by the numbers: shorten LLM time first.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Show Progress Token By Token
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Streaming doesn&apos;t make the answer arrive faster. It makes the user FEEL faster.
            Without streaming, the user stares at a spinner for 1.5 seconds. With streaming,
            the first token appears at 200ms and text scrolls in. Same total time. Different
            perceived latency.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two side-by-side timelines comparing perceived latency. Without streaming, the
                user sees nothing for 1500 milliseconds then the full response. With streaming,
                the user sees the first token at 200 milliseconds with text scrolling in until
                1500 milliseconds. Same total time, very different perception.
              </desc>
              {/* Without streaming */}
              <text x={20} y={40} fill={SOFT.red} fontSize="14" fontWeight="700">
                Without Streaming
              </text>
              <rect x={20} y={50} width={500} height={28} fill={`${C.red}22`} stroke={`${C.red}55`} strokeWidth={1.2} rx={3} />
              <rect x={500} y={50} width={20} height={28} fill={`${C.red}88`} stroke={C.red} strokeWidth={1.4} rx={3} />
              <text x={270} y={70} fill={SOFT.red} fontSize="12" textAnchor="middle">
                User Sees Spinner For 1.5s, Then Full Answer
              </text>
              {/* With streaming */}
              <text x={20} y={120} fill={SOFT.green} fontSize="14" fontWeight="700">
                With Streaming
              </text>
              <rect x={20} y={130} width={66} height={28} fill={`${C.green}22`} stroke={`${C.green}55`} strokeWidth={1.2} rx={3} />
              <rect x={86} y={130} width={434} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={300} y={150} fill={SOFT.green} fontSize="12" textAnchor="middle">
                First Token At 200ms, Text Scrolls In Through 1.5s
              </text>
              <text x={320} y={185} fill={C.red} fontSize="14" fontWeight="700" textAnchor="middle">
                Perceived Latency Drops From 1.5s To 200ms
              </text>
            </svg>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Cheap win, large UX impact. Always stream the final answer. Stream intermediate
            tool-call narration too when the agent is multi-step.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Run Independent Tools Concurrently
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Ticket T4 (cancel + refund) needs two lookups before deciding. Serial: 400ms total
            tool latency. Parallel: 200ms total. Same outputs. Half the time. Section 13.10
            covers the tool_choice setting that lets the model emit multiple tool calls in one
            response.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Serial vs parallel tool call timelines for ticket T4. Serial timeline: 200ms
                lookup_customer followed by 200ms lookup_subscription, 400ms total. Parallel
                timeline: both tool calls run concurrently in 200ms total. Half the time for
                identical results.
              </desc>
              {/* Serial */}
              <text x={20} y={40} fill={SOFT.orange} fontSize="14" fontWeight="700">
                Serial (T4)
              </text>
              <rect x={20} y={50} width={200} height={28} fill={`${C.orange}55`} stroke={C.orange} strokeWidth={1.4} rx={3} />
              <text x={120} y={70} fill={SOFT.orange} fontSize="12" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <rect x={220} y={50} width={200} height={28} fill={`${C.orange}55`} stroke={C.orange} strokeWidth={1.4} rx={3} />
              <text x={320} y={70} fill={SOFT.orange} fontSize="12" textAnchor="middle">
                lookup_subscription (200ms)
              </text>
              <text x={440} y={70} fill={C.orange} fontSize="13" fontWeight="700">
                400ms Total
              </text>
              {/* Parallel */}
              <text x={20} y={130} fill={SOFT.green} fontSize="14" fontWeight="700">
                Parallel (T4)
              </text>
              <rect x={20} y={140} width={200} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={120} y={160} fill={SOFT.green} fontSize="12" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <rect x={20} y={172} width={200} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={120} y={192} fill={SOFT.green} fontSize="12" textAnchor="middle">
                lookup_subscription (200ms)
              </text>
              <text x={240} y={170} fill={C.green} fontSize="13" fontWeight="700">
                200ms Total
              </text>
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Section 13.10 (Parallel Tools + Tool Choice) is the API-level mechanism. The latency
            payoff: 200ms saved per applicable turn. In multi-tool tickets like T4 this adds up
            fast.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Run Likely Steps Before Confirming
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Speculative execution starts the next probable tool call BEFORE the LLM finishes its
            decision. While the model is still generating &quot;I&apos;ll look up your account...&quot;
            the runtime speculatively kicks off lookup_customer for the customer already
            referenced earlier. If the model ends up requesting it, the result is already in
            cache. If not, the work is discarded.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Speculative execution timeline showing the LLM generating its decision in 1.2
                seconds while a speculative lookup_customer tool call runs in parallel and
                completes at 200 milliseconds. When the LLM finishes, the tool result is
                already available with zero added wait.
              </desc>
              <text x={20} y={40} fill={SOFT.yellow} fontSize="14" fontWeight="700">
                LLM Generating Decision
              </text>
              <rect x={20} y={50} width={520} height={28} fill={`${C.yellow}55`} stroke={C.yellow} strokeWidth={1.4} rx={3} />
              <text x={280} y={70} fill={SOFT.yellow} fontSize="12" textAnchor="middle">
                &quot;I&apos;ll look up your account...&quot; (1200ms)
              </text>
              <text x={20} y={120} fill={SOFT.purple} fontSize="14" fontWeight="700">
                Speculative Tool Call
              </text>
              <rect x={20} y={130} width={87} height={28} fill={`${C.purple}55`} stroke={C.purple} strokeWidth={1.4} rx={3} strokeDasharray="4 3" />
              <text x={63} y={150} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <text x={130} y={150} fill={SOFT.purple} fontSize="12">
                Result Cached, Waiting
              </text>
              <text x={320} y={195} fill={C.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                When LLM Requests It At 1200ms, Result Returns In 0ms (Already Computed)
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            The tradeoff is real: speculative calls pay for sometimes-wasted work in exchange
            for real-time response. Use only on tool calls where the wasted-work cost is small
            (read-only lookups). Never speculate on mutation tools.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Cache What Doesn&apos;t Change
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Result caching is the last latency lever. Three categories of result are stable
            enough to cache safely with conservative TTLs. Pair every cache with an invalidate
            hook on the matching mutation event.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {LATENCY_CACHE_TARGETS.map((t) => {
              const accent = C[t.color];
              const soft = SOFT[t.color];
              return (
                <div key={t.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>CACHEABLE</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {t.name}
                  </T>
                  <T color={soft} center size={14} bold style={{ marginTop: 8 }}>
                    {t.ttl}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {t.why}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Cache invalidation is the hard part. Pick conservative TTLs (5 minutes for profile,
            1 hour for KB) and invalidate on mutation events (profile-updated, kb-doc-edited).
            Better to miss the cache than to serve a stale answer.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
