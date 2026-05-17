import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const TOOL_SEC_CAPABILITIES = [
  {
    role: "Triage Agent",
    color: "yellow",
    tools: "search_kb, lookup_customer",
    note: "Read-Only. No Mutations.",
  },
  {
    role: "Billing Specialist",
    color: "orange",
    tools: "Read Tools + process_refund (Cap $200) + change_subscription",
    note: "Mutation Allowed With Hard Cap.",
  },
  {
    role: "Escalation Agent",
    color: "red",
    tools: "escalate_human + send_email",
    note: "Hands Off To Humans Only.",
  },
];

const TOOL_SEC_RATE_LIMITS = [
  { tool: "search_kb", limit: "100 / Agent / Hour", purpose: "Cheap Read" },
  { tool: "lookup_customer", limit: "50 / Agent / Hour", purpose: "Cheap Read" },
  { tool: "process_refund", limit: "5 / Agent / Hour", purpose: "Cost Containment" },
  { tool: "escalate_human", limit: "10 / Agent / Hour", purpose: "Human-Wall Pressure" },
];

export default function ToolSecurity(ctx) {
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
            Tools Run In A Cage
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            Every tool runs inside a sandbox boundary. Inside the cage: the tool process, its
            allowed filesystem reads, its allowed outbound network destinations. Outside the
            cage: everything else - the agent itself, the host OS, customer data unrelated to
            this session. If the tool gets compromised, the cage limits the damage.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 720 240"
              style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}
            >
              <desc>
                Sandbox boundary diagram. The inner cage contains the tool process, its allowed
                filesystem reads, and its allowed outbound network destinations. Outside the
                cage are the agent itself, the host OS, and customer data unrelated to this
                session. If a tool is compromised, the cage limits damage.
              </desc>
              {/* Outer world */}
              <rect x={30} y={20} width={660} height={200} fill={`${C.pink}11`} stroke={`${C.pink}33`} strokeWidth={1.4} strokeDasharray="6 4" rx={10} />
              <text x={360} y={42} fill={SOFT.pink} fontSize="13" fontWeight="700" textAnchor="middle">
                Host Environment (Outside The Cage)
              </text>
              {/* Inside cage */}
              <rect x={220} y={70} width={280} height={130} fill={`${C.green}11`} stroke={C.green} strokeWidth={1.6} rx={10} />
              <text x={360} y={92} fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Sandbox / Cage
              </text>
              <text x={360} y={120} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Tool Process
              </text>
              <text x={360} y={140} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Allowed Filesystem Reads
              </text>
              <text x={360} y={160} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Allowed Outbound Network
              </text>
              <text x={360} y={186} fill={C.green} fontSize="12" fontWeight="700" textAnchor="middle">
                Limited Capability Surface
              </text>
              {/* Outside labels */}
              <text x={120} y={120} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Agent Runtime
              </text>
              <text x={120} y={140} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Host OS
              </text>
              <text x={120} y={160} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Customer Data
              </text>
              <text x={600} y={120} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Secrets Store
              </text>
              <text x={600} y={140} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Other Customers
              </text>
              <text x={600} y={160} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Internal APIs
              </text>
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            The cage is a runtime contract enforced by the platform (container, VM, process
            isolation). The tool author declares what it needs; the runtime grants only that.
            Compromised tools cannot escape what they were never given.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Different Agents, Different Tool Sets
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Capability scope is per-role. The triage agent reads. The billing specialist
            mutates with caps. The escalation agent only hands off. Even if any one agent is
            compromised, the blast radius is bounded. This is defense in depth at the
            capability layer.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr 1.4fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.red }}>Agent Role</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.red }}>Tool Set</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.red }}>Note</div>
              {TOOL_SEC_CAPABILITIES.map((cap) => {
                const accent = C[cap.color];
                const soft = SOFT[cap.color];
                return (
                  <Fragment key={cap.role}>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.red}22`, color: accent, fontWeight: 700 }}>
                      {cap.role}
                    </div>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.red}22`, color: soft }}>
                      {cap.tools}
                    </div>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.red}22`, color: soft }}>
                      {cap.note}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Capability tokens travel with the agent identity. The runtime verifies the agent&apos;s
            role against the tool registry before executing any tool call. No role, no call.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Every Tool Call Logged
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Audit logging is non-negotiable. Every tool call produces one entry with timestamp,
            agent identity, customer, tool name, input args, result, and consent metadata.
            Logs are immutable. Retention: 7 years for financial actions, per typical
            SOC 2 / financial-services rule.
          </T>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              maxWidth: 620,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={pill(C.orange)}>AUDIT LOG ENTRY (SHAPE)</span>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.orange,
                fontSize: 14,
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              {`{
  "timestamp":   "2026-05-16T10:34:12Z",
  "agent_id":    "billing-specialist-v2",
  "customer_id": "c-9924",
  "tool":        "process_refund",
  "input": {
    "invoice_id": "INV-9924",
    "reason":     "customer requested",
    "amount":     150
  },
  "result": {
    "status":     "success",
    "refund_id":  "rf-7821"
  },
  "consent": {
    "auto_approved": true,
    "rule":          "amount < 200"
  }
}`}
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Logs are append-only and signed. They feed three downstream systems: incident
            response (recent tool calls per customer), compliance audits (retention proof), and
            anomaly detection (deviations from normal call patterns).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Cap The Frequency
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Even within scope, rate-limit each tool. Cheap reads can be generous. Expensive
            mutations need tight caps. Escalations need a moderate cap so spam-escalation
            doesn&apos;t overwhelm the human queue. Hitting the limit forces a hard stop or
            re-routes to a different agent.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.4fr 1.6fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.yellow }}>Tool</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.yellow }}>Rate Limit</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.yellow }}>Why</div>
              {TOOL_SEC_RATE_LIMITS.map((row) => (
                <Fragment key={row.tool}>
                  <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.yellow}22`, color: C.yellow, fontWeight: 700, fontFamily: "monospace" }}>
                    {row.tool}
                  </div>
                  <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.yellow}22`, color: SOFT.yellow }}>
                    {row.limit}
                  </div>
                  <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.yellow}22`, color: SOFT.yellow }}>
                    {row.purpose}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            Rate limits live in the runtime, not in the agent. The model cannot raise them by
            asking. When the limit is hit, the runtime returns a tool_error result so the agent
            can adapt: escalate to human, queue for later, or refuse politely.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Ask Before Doing Big Things
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            For any tool that mutates state above a threshold, the runtime asks for human
            consent before executing. The agent waits. The human approves or denies. The
            decision goes into the audit log alongside the request.
          </T>

          <div
            style={{
              ...tintedCard(C.purple),
              padding: 14,
              marginTop: 14,
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <T color={SOFT.purple} center size={13} bold style={{ marginBottom: 10 }}>
              Consent Prompt (UX Mockup)
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                textAlign: "left",
                color: SOFT.purple,
                fontSize: 14,
                padding: 10,
                background: `${C.purple}11`,
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              {`The agent wants to call:
  process_refund

  invoice_id : INV-9924
  amount     : $150
  reason     : "customer requested"

Allow this action?

  [ Approve ]   [ Deny ]   [ Always Allow For This Customer ]`}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Consent prompts close the production-hardening loop: sandboxing limits damage,
            capability scope limits reach, audit logs preserve the record, rate limits cap
            volume, and consent prompts keep a human in the loop for the highest-stakes calls.
            Five layers, one safe agent.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
