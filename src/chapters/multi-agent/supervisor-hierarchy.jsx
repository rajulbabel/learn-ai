import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const HIERARCHY_DECISION = [
  {
    pick: "Orchestrator-Worker",
    color: "teal",
    when: "Workers Are Peer Specialists At One Level.",
    example: "3 KB Search Workers Run In Parallel.",
  },
  {
    pick: "Hierarchical",
    color: "cyan",
    when: "Domain Has Clear Sub-Domains.",
    example: "Billing Has Refund / Invoice / Tier-Change As Sub-Areas.",
  },
  {
    pick: "Avoid Hierarchical",
    color: "red",
    when: "Tree Depth > 3 Levels.",
    example: "Usually Means Over-Engineering; Flatten The Design.",
  },
];

const SUPPORT_TREE = {
  root: "Support Supervisor",
  branches: [
    {
      name: "Billing Supervisor",
      color: "teal",
      leaves: ["Refund Specialist", "Invoice Specialist", "Tier-Change Specialist"],
    },
    {
      name: "Troubleshooting Supervisor",
      color: "cyan",
      leaves: ["Database Specialist", "Network Specialist"],
    },
    {
      name: "Escalation Supervisor",
      color: "blue",
      leaves: ["Human Hand-Off (escalate_human)"],
    },
  ],
};

export default function SupervisorHierarchy(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Multiple Levels Of Delegation
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Hierarchical multi-agent is a tree. A supervisor delegates to sub-supervisors which
            delegate to leaf specialists. Each leaf has 1-2 narrow tools. Multiple LEVELS, not the
            single level of orchestrator-worker.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three-level agent hierarchy: top supervisor delegates to three middle-level
                supervisors which each delegate to two leaf specialists, with planar parent-child
                edges and no crossings.
              </desc>
              {/* Top supervisor */}
              <rect x={230} y={10} width={100} height={36} rx={8} fill={`${C.green}24`} stroke={C.green} strokeWidth={2} />
              <text x={280} y={32} fill={SOFT.green} fontSize="12" fontWeight="700" textAnchor="middle">
                Supervisor
              </text>

              {/* Mid 3 sub-supervisors at x = 120, 280, 440 */}
              {[120, 280, 440].map((x, i) => (
                <g key={`mid-${i}`}>
                  <line x1={280} y1={46} x2={x} y2={90} stroke={C.green} strokeWidth={1.5} />
                  <rect x={x - 60} y={90} width={120} height={36} rx={8} fill={`${C.teal}1f`} stroke={C.teal} strokeWidth={1.6} />
                  <text x={x} y={112} fill={SOFT.teal} fontSize="12" fontWeight="700" textAnchor="middle">
                    Sub-Supervisor {i + 1}
                  </text>
                </g>
              ))}

              {/* Leaves: 2 per sub-supervisor at offsets -40, +40 */}
              {[120, 280, 440].map((parentX) =>
                [-40, 40].map((dx, j) => {
                  const x = parentX + dx;
                  return (
                    <g key={`leaf-${parentX}-${j}`}>
                      <line x1={parentX} y1={126} x2={x} y2={170} stroke={C.cyan} strokeWidth={1.2} />
                      <rect x={x - 35} y={170} width={70} height={32} rx={6} fill={`${C.cyan}14`} stroke={C.cyan} strokeWidth={1.4} />
                      <text x={x} y={190} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                        Leaf
                      </text>
                    </g>
                  );
                })
              )}

              <text x={280} y={222} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Top = Supervisor. Mid = Sub-Supervisors. Leaves = Specialists (Tools).
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Three levels is the practical sweet spot. Two levels is just orchestrator-worker
            renamed. Four levels usually signals over-engineering.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Each Supervisor: Plan + Route Down
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            At each level, a supervisor takes a sub-task, picks which child agent handles it (or
            breaks further and picks multiple children), waits for results, aggregates, and
            returns up to its own parent.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              { phase: "Receive", detail: "Get A Sub-Task From The Parent." },
              { phase: "Plan", detail: "Decide: Single Child Handles, Or Break Into Smaller Sub-Tasks." },
              { phase: "Route Down", detail: "Pick The Child Agent(s) Best Matched To The Sub-Task." },
              { phase: "Aggregate", detail: "Wait For Children, Combine Their Results." },
              { phase: "Return Up", detail: "Send The Aggregated Result To The Parent Supervisor." },
            ].map((p, i) => (
              <div key={`step-${i}`} style={{ ...tintedCard(C.teal), padding: 12 }}>
                <span style={pill(C.teal)}>{p.phase.toUpperCase()}</span>
                <T color={SOFT.teal} center size={13} style={{ marginTop: 8 }}>
                  {p.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Every supervisor does the same 5 things at its level. Routing is the new responsibility
            compared to orchestrator-worker - a supervisor must know which child agent is right for
            which sub-task type.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Hierarchical When The Domain Has Sub-Specialties
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Choosing hierarchical over orchestrator-worker is a domain shape question. If your
            workflow has clear sub-areas with their own internal structure, the tree pays off. If
            it does not, flatten.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {HIERARCHY_DECISION.map((d) => {
              const accent = C[d.color];
              const soft = SOFT[d.color];
              return (
                <div key={d.pick} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{d.pick.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {d.pick}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {d.when}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Example: {d.example}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            Most production customer-support agents fit hierarchical because billing and
            troubleshooting are genuinely different sub-domains with different tools and policies.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Support Tree
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The customer-support agent fits hierarchical cleanly. Three sub-supervisors handle
            billing, troubleshooting, and escalation; each has its own specialists below.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.green), padding: 12 }}>
              <span style={pill(C.green)}>ROOT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                {SUPPORT_TREE.root}
              </T>
              <T color={SOFT.green} center size={12} style={{ marginTop: 6 }}>
                All-Tickets Entry Point. Classifies And Routes.
              </T>
            </div>

            {SUPPORT_TREE.branches.map((b) => {
              const accent = C[b.color];
              const soft = SOFT[b.color];
              return (
                <div key={b.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>SUB-SUPERVISOR</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {b.name}
                  </T>
                  <ul style={{ marginTop: 8, paddingLeft: 18, textAlign: "left", color: soft }}>
                    {b.leaves.map((l, i) => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Each leaf specialist has 1-3 tools from the canonical 8-tool inventory: refund
            specialists use process_refund + lookup_subscription, network specialists use
            search_kb, escalation calls escalate_human.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            When To Escalate Up
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            A leaf specialist that cannot finish its task escalates up to its supervisor. The
            supervisor decides: retry with a different leaf, or escalate to ITS own parent.
            Eventually a top-level escalation reaches the Escalation Supervisor which calls
            escalate_human.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              { actor: "Refund Specialist", color: "cyan", action: "Hit business_rule Error On $250 Refund. Escalates Up." },
              { actor: "Billing Supervisor", color: "teal", action: "Considers Tier-Change Leaf, Rules It Out. Escalates Up." },
              { actor: "Support Supervisor", color: "green", action: "Routes To Escalation Supervisor." },
              { actor: "Escalation Supervisor", color: "blue", action: "Calls escalate_human With Full Trace." },
            ].map((row, i) => (
              <div key={`up-${i}`} style={{ ...tintedCard(C[row.color]), padding: 12 }}>
                <span style={pill(C[row.color])}>{row.actor.toUpperCase()}</span>
                <T color={SOFT[row.color]} center size={13} style={{ marginTop: 8 }}>
                  {row.action}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Escalation up the tree is the safety net. Without it, a leaf failure becomes a silent
            stall. With it, every dead-end eventually reaches escalate_human or a successful
            re-route.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
