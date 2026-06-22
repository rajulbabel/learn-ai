import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const GUARD_CONTENT_CATEGORIES = [
  {
    name: "Disallowed",
    color: "red",
    examples: "Hate Speech, CSAM, Self-Harm Instruction",
    action: "Block + Audit Log",
  },
  {
    name: "Off-Topic",
    color: "yellow",
    examples: "Chitchat, Unrelated Politics, Recipes",
    action: "Refuse Politely",
  },
  {
    name: "Legitimate Support",
    color: "green",
    examples: "Refunds, Password Reset, Billing",
    action: "Allow Through To Model",
  },
];

export default function Guardrails(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Filters Sit On Both Sides Of The Model
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            A guardrail is a deterministic filter that runs before and after the model. Input guardrails sanitize what
            enters the model. Output guardrails check what leaves. The model itself is never trusted to enforce safety
            alone.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 200" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Horizontal guardrail pipeline diagram: user input flows into the input guardrail box (content filter,
                PII detect, injection check), then to the model, then to the output guardrail box (response validation,
                PII redaction, tool action gate), and finally to the user or tool. Guardrails on both sides of the
                model.
              </desc>
              {(() => {
                const stages = [
                  { name: "User Input", color: "yellow", w: 100 },
                  { name: "Input Guardrail", color: "red", w: 160, sub: "Content Filter / PII / Injection" },
                  { name: "Model", color: "purple", w: 100 },
                  { name: "Output Guardrail", color: "orange", w: 170, sub: "Validate / Redact / Gate" },
                  { name: "User / Tool", color: "green", w: 110 },
                ];
                const gap = 12;
                const total = stages.reduce((a, s) => a + s.w, 0) + gap * (stages.length - 1);
                const xStart = (720 - total) / 2;
                let cur = xStart;
                return (
                  <g>
                    {stages.map((s, i) => {
                      const x = cur;
                      cur += s.w + gap;
                      const accent = C[s.color];
                      const soft = SOFT[s.color];
                      return (
                        <g key={s.name}>
                          <rect
                            x={x}
                            y={60}
                            width={s.w}
                            height={70}
                            fill={`${accent}33`}
                            stroke={accent}
                            strokeWidth={1.5}
                            rx={6}
                          />
                          <text x={x + s.w / 2} y={92} fill={soft} fontSize="14" fontWeight="700" textAnchor="middle">
                            {s.name}
                          </text>
                          {s.sub && (
                            <text x={x + s.w / 2} y={112} fill={soft} fontSize="11" textAnchor="middle">
                              {s.sub}
                            </text>
                          )}
                          {i < stages.length - 1 && (
                            <line
                              x1={x + s.w + 2}
                              y1={95}
                              x2={x + s.w + gap - 2}
                              y2={95}
                              stroke={SOFT.pink}
                              strokeWidth={1.6}
                              markerEnd="url(#arrow-pink)"
                            />
                          )}
                        </g>
                      );
                    })}
                    <defs>
                      <marker id="arrow-pink" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <polygon points="0 0, 8 4, 0 8" fill={SOFT.pink} />
                      </marker>
                    </defs>
                  </g>
                );
              })()}
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            Each guardrail runs in milliseconds. Cheap on the latency budget, but blocks the failure modes that the
            model alone cannot resist (injection, PII leak, schema violation, destructive action).
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Block Disallowed Categories Before Model Sees It
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            A cheap classification step categorizes the input. Disallowed categories never reach the model. Off-topic
            gets a polite refusal. Legitimate support passes through. On a typical SaaS support corpus, 0.1 to 0.3% of
            incoming messages hit the block list.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {GUARD_CONTENT_CATEGORIES.map((cat) => {
              const accent = C[cat.color];
              const soft = SOFT[cat.color];
              return (
                <div key={cat.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>CATEGORY</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {cat.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {cat.examples}
                  </T>
                  <T color={accent} center size={14} bold style={{ marginTop: 10 }}>
                    {cat.action}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Audit every block. Even rare, blocked inputs are a signal: the same attack often shows up across multiple
            users in a short window.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Strip Personally Identifying Data
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            User messages carry PII (SSN, address, credit card, phone). The agent rarely needs the raw value. Redact
            before the model sees it. Redaction protects the agent&apos;s logs, the model provider&apos;s logs, and the
            user&apos;s privacy. Required for any agent processing regulated data.
          </T>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <T color={SOFT.orange} center size={13} bold style={{ marginBottom: 8 }}>
              Before Redaction
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                textAlign: "left",
                color: SOFT.red,
                fontSize: 14,
                padding: 8,
                background: `${C.red}11`,
                borderRadius: 6,
                marginBottom: 14,
              }}
            >
              {`User: "My SSN is 123-45-6789 and I live at 42 Main St.\n       Can you reset my password?"`}
            </div>
            <T color={SOFT.green} center size={13} bold style={{ marginBottom: 8 }}>
              After Redaction (Model Receives This)
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                textAlign: "left",
                color: SOFT.green,
                fontSize: 14,
                padding: 8,
                background: `${C.green}11`,
                borderRadius: 6,
              }}
            >
              {`User: "My SSN is [REDACTED-SSN] and I live at [REDACTED-ADDRESS].\n       Can you reset my password?"`}
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Redaction is mandatory for HIPAA, PCI-DSS, GDPR, and most SOC 2 audits. Treat the redactor as part of the
            agent runtime, not as an optional feature flag.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Reject Outputs That Fail Schema
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The output guardrail validates every structured response against its schema. Bad JSON, missing fields, wrong
            types - all blocked. If the response fails, retry once with a fix instruction. If it still fails, fall back
            to a deterministic error reply. This is the runtime version of Section 24.3 structured output.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 220" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Output validation flow diagram. Model emits a response, the schema validator checks it. If valid, the
                response is sent. If invalid, the runtime retries once with a fix prompt. If retry still fails, it falls
                back to a deterministic error response.
              </desc>
              {(() => {
                return (
                  <g>
                    {/* Linear chain */}
                    <rect
                      x={30}
                      y={90}
                      width={130}
                      height={40}
                      fill={`${C.yellow}33`}
                      stroke={C.yellow}
                      strokeWidth={1.4}
                      rx={4}
                    />
                    <text x={95} y={114} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                      Model Response
                    </text>
                    <line
                      x1={160}
                      y1={110}
                      x2={198}
                      y2={110}
                      stroke={SOFT.yellow}
                      strokeWidth={1.6}
                      markerEnd="url(#arrow-y)"
                    />
                    <rect
                      x={200}
                      y={90}
                      width={140}
                      height={40}
                      fill={`${C.orange}33`}
                      stroke={C.orange}
                      strokeWidth={1.4}
                      rx={4}
                    />
                    <text x={270} y={114} fill={SOFT.orange} fontSize="13" fontWeight="700" textAnchor="middle">
                      Validate Schema
                    </text>
                    {/* Branches */}
                    <line
                      x1={340}
                      y1={110}
                      x2={378}
                      y2={45}
                      stroke={SOFT.green}
                      strokeWidth={1.6}
                      markerEnd="url(#arrow-g)"
                    />
                    <rect
                      x={380}
                      y={30}
                      width={180}
                      height={36}
                      fill={`${C.green}33`}
                      stroke={C.green}
                      strokeWidth={1.4}
                      rx={4}
                    />
                    <text x={470} y={52} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                      Valid: Send Response
                    </text>
                    <line
                      x1={340}
                      y1={110}
                      x2={378}
                      y2={110}
                      stroke={SOFT.red}
                      strokeWidth={1.6}
                      markerEnd="url(#arrow-r)"
                    />
                    <rect
                      x={380}
                      y={90}
                      width={240}
                      height={40}
                      fill={`${C.red}33`}
                      stroke={C.red}
                      strokeWidth={1.4}
                      rx={4}
                    />
                    <text x={500} y={114} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                      Invalid: Retry With Fix Prompt
                    </text>
                    <line
                      x1={340}
                      y1={110}
                      x2={378}
                      y2={175}
                      stroke={SOFT.purple}
                      strokeWidth={1.6}
                      markerEnd="url(#arrow-p)"
                    />
                    <rect
                      x={380}
                      y={150}
                      width={260}
                      height={40}
                      fill={`${C.purple}33`}
                      stroke={C.purple}
                      strokeWidth={1.4}
                      rx={4}
                    />
                    <text x={510} y={174} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                      Retry Fails: Deterministic Fallback
                    </text>
                    <defs>
                      <marker id="arrow-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <polygon points="0 0, 8 4, 0 8" fill={SOFT.yellow} />
                      </marker>
                      <marker id="arrow-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <polygon points="0 0, 8 4, 0 8" fill={SOFT.green} />
                      </marker>
                      <marker id="arrow-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <polygon points="0 0, 8 4, 0 8" fill={SOFT.red} />
                      </marker>
                      <marker id="arrow-p" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <polygon points="0 0, 8 4, 0 8" fill={SOFT.purple} />
                      </marker>
                    </defs>
                  </g>
                );
              })()}
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            One retry is the sweet spot. Two retries doubles latency on the failure path without improving success rate
            much. After one failure, fall back to a hand-written deterministic response: &quot;Sorry, I had trouble with
            that. A human agent will follow up.&quot;
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Require Approval Before Destructive Tools
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Some tool calls cannot be undone: refund, send_email, delete_account. An action gate intercepts the tool
            call BEFORE it executes, inspects the args against policy, and either auto-approves, blocks, or escalates
            for human approval. The gate lives in the runtime, separate from the agent loop.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 220" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Action gate diagram for process_refund. Agent requests refund of $350. Gate inspects, sees amount
                exceeds the $200 auto-approve threshold, blocks the tool call and requests human approval. Approved or
                denied response feeds back to the agent.
              </desc>
              {/* Agent box */}
              <rect
                x={30}
                y={40}
                width={140}
                height={50}
                fill={`${C.purple}33`}
                stroke={C.purple}
                strokeWidth={1.4}
                rx={6}
              />
              <text x={100} y={70} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent Request
              </text>
              <text x={100} y={85} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                process_refund($350)
              </text>
              {/* Gate */}
              <line
                x1={170}
                y1={65}
                x2={218}
                y2={65}
                stroke={SOFT.purple}
                strokeWidth={1.6}
                markerEnd="url(#arrow-gp)"
              />
              <polygon
                points="200,30 360,30 380,65 360,100 200,100 220,65"
                fill={`${C.red}33`}
                stroke={C.red}
                strokeWidth={1.6}
              />
              <text x={290} y={56} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Action Gate
              </text>
              <text x={290} y={76} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Cap: $200, Got: $350
              </text>
              <text x={290} y={92} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Threshold Exceeded
              </text>
              {/* Path: human approval */}
              <line x1={380} y1={65} x2={423} y2={65} stroke={SOFT.red} strokeWidth={1.6} markerEnd="url(#arrow-gr)" />
              <rect
                x={425}
                y={40}
                width={170}
                height={50}
                fill={`${C.orange}33`}
                stroke={C.orange}
                strokeWidth={1.4}
                rx={6}
              />
              <text x={510} y={64} fill={SOFT.orange} fontSize="13" fontWeight="700" textAnchor="middle">
                Human Approval
              </text>
              <text x={510} y={82} fill={SOFT.orange} fontSize="11" textAnchor="middle">
                Approve / Deny
              </text>
              <line
                x1={595}
                y1={65}
                x2={633}
                y2={65}
                stroke={SOFT.orange}
                strokeWidth={1.6}
                markerEnd="url(#arrow-go)"
              />
              <rect
                x={635}
                y={40}
                width={70}
                height={50}
                fill={`${C.green}33`}
                stroke={C.green}
                strokeWidth={1.4}
                rx={6}
              />
              <text x={670} y={70} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Decision
              </text>
              {/* Loopback */}
              <text x={360} y={170} fill={SOFT.purple} fontSize="12" textAnchor="middle">
                Decision Returns To Agent. Loop Continues With Approved / Denied Result
              </text>
              <defs>
                <marker id="arrow-gp" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={SOFT.purple} />
                </marker>
                <marker id="arrow-gr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={SOFT.red} />
                </marker>
                <marker id="arrow-go" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={SOFT.orange} />
                </marker>
              </defs>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            The gate is enforced by the runtime, not by the model. Even if the model decides $350 is fine, the runtime
            says no. This is the difference between &quot;model with guardrails&quot; and &quot;model with hopes and
            prayers&quot;.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
