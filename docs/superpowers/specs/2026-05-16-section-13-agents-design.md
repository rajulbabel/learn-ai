# Section 13: AI Agents - Design

**Date:** 2026-05-16
**Status:** Design approved, ready for implementation plan

## Overview

Add a new Section 13 "AI Agents" to the learn-ai app. A 52-chapter interactive section that teaches production-grade AI agents at depth: how prompting becomes tool use, how tool use becomes a loop, how loops become agents, how agents become multi-agent systems, and how all of it is operated in production. Covers the full discipline (prompting foundations, tools, protocols, agent loops, agent memory, multi-agent architectures, evaluation, production hardening, framework decision). Excludes deprecated patterns and framework-tutorial pacing.

No code. No external reading list. Self-contained visual section, same pattern as Sections 1-12.

## Motivation

Sections 1-12 give the learner the model side (training, attention, transformer), the storage side (vector DBs), and the retrieval side (RAG). What they do not yet have is the action side: how to wrap a model in tools, give it a goal, let it loop, persist its memory across sessions, coordinate multiple agents, evaluate behavior, and ship the whole thing into production without it falling over.

This is the section that turns "I know how LLMs work" into "I can ship an AI feature my team can run". Without it, the learner can run a RAG query but cannot:

- Decide between prompting, fine-tuning, RAG, and agents for a new use case.
- Wire an LLM to real tools (function calling, MCP, A2A).
- Build a loop that reasons, acts, observes, and terminates safely.
- Choose between working / episodic / semantic / procedural memory for an agent's needs.
- Orchestrate multiple agents without infinite loops or cost runaway.
- Design evals that catch silent agent failures.
- Defend agents against prompt injection, tool abuse, and runaway cost.
- Pick a framework (or build from scratch) from underlying patterns, not marketing.

A learner who has finished Sections 1-12 has the substrate; Section 13 is where they learn to build something on top of that substrate that survives a real on-call rotation.

## Goals

1. **Production-focused.** Every pattern taught is one production systems actually use today. No deprecated/superseded techniques as primary content.
2. **Full depth, not a survey.** Each major capability (prompting, tools, MCP, loops, memory, multi-agent, eval, ops) gets enough chapters to show the actual mechanics + tradeoffs.
3. **First-principles over framework abstractions.** Patterns taught as ideas, not as `LangGraph.StateGraph` (the class). Frameworks discussed in one comparison act at the end.
4. **Tradeoff literacy.** Four axes: capability, latency, cost, safety. Every chapter foregrounds one.
5. **Self-contained.** No papers to read, no blog posts to track. Visuals, message-shape artifacts, and worked examples are the teaching.
6. **Production-grade decision-making.** Same outcome target as Sections 11 and 12. Learner can lead an agent project.
7. **Visual-first density.** Less text, more diagrams. Every diagram intuitively self-explanatory at a glance.

## Non-goals

- **No code.** No Python/JS/SDK calls. EXCEPTIONS, all rendered as styled monospace **text** blocks (visually distinct from code blocks):
  - Tool JSON schema *shape* (one canonical example).
  - Tool-use / tool-result message *shape* (one canonical example).
  - MCP message *shape* (one canonical example).
  - A2A `agent.json` discovery doc *shape* (one canonical example).
  - Prompt templates (system / few-shot / judge rubrics).
  - Eval rubric blocks.
  These are the production *artifact*, not executable code.
- **No framework tutorials.** Not "the LangGraph section" or "the CrewAI section". One act (Act 9) compares framework options with honest current state; the rest is framework-agnostic.
- **No deprecated patterns as primary content.** Excluded:
  - **AutoGPT / BabyAGI patterns** - covered as historical lineage in a sub-step only.
  - **Pure ReAct as the only loop pattern** - ReAct is one of several; plan-execute and reflection covered alongside.
  - **Prompt-only chain-of-thought reliance** - thinking models (covered in Section 10.4) reduce its standalone value; CoT covered as a fundamental but not as the answer to reasoning.
  - **Single-agent "do everything" patterns when multi-agent fits** - covered conceptually so learner knows the failure mode.
- **No vendor decision matrix that ages.** Framework comparison stays at "what each does + when it fits" - not "LangGraph vs CrewAI pricing in Q3 2026".
- **No use of the word "architect"** in chapter titles, descriptions, or content. (Same rule as Sections 11 and 12. Production-grade decision-making framing translates without that word.)
- **No re-teaching of prior sections' primitives.** Vector DBs (Section 11), RAG retrieval (Section 12), attention (Section 7), tokenization (Section 2.1, 2.10), SFT/RLHF/DPO (Section 2.7-2.9): brief 1-paragraph recap + back-reference (e.g., "Vector storage - covered in Section 11.6 - here we use it as the substrate for episodic memory").
- **No coding assignments / lab tasks.** Visual-first interactive learning; learner does no typing during the section. Decisions and patterns are the deliverable.
- **No tutorial pacing.** Not "build your first agent in an hour". Depth-first.
- **No voice / multimodal / browser-use agent specifics.** One paragraph mention in Act 9, no deep dive. Future section.
- **No robot embodiment / physical agents.** Out of scope.
- **No agent training (RL, agent-as-policy).** Section 10.4 Thinking covers reasoning-model base; agent training is a separate concern.
- **No carry-over brand names anywhere.** The customer support corpus (introduced in Section 12) is referred to generically as "the customer support knowledge base"; example URLs use the IETF-reserved `example.com`. Never reintroduce a fictional company name, a brand, or a real-vendor domain in the corpus framing.

## Prerequisites (already taught in Sections 1-12)

- Anatomy of an LLM forward pass (Section 1, Section 7)
- Tokenization (Sections 2.1, 2.10)
- Attention + context-window mechanics (Section 7)
- Output-head: linear + softmax (Section 9.4)
- Cross-entropy loss (Section 2.3) - referenced in eval chapters
- Autoregressive generation (Section 2.6)
- SFT, RLHF, DPO (Sections 2.7-2.9) - referenced in "Prompt vs Fine-Tune vs RAG vs Agent"
- KV cache + inference cost (Section 10.1) - referenced in latency optimization
- Thinking / reasoning models (Section 10.4) - referenced in plan-execute + CoT chapters
- Vector DB internals (Section 11) - referenced as substrate for long-term memory
- RAG pipeline (Section 12) - referenced as substrate for KB lookup tool + as the alternative to agentic retrieval
- Cosine / dot-product similarity (Sections 1.17, 11.4)
- Embeddings as dense vectors (Section 5.2)

Not assumed: any prior exposure to LangGraph / CrewAI / AutoGen / Claude Agent SDK / OpenAI Agents, any MCP or A2A familiarity, any eval framework familiarity (LangSmith, Weave, Phoenix, ragas).

## Section metadata

| Field | Value |
|---|---|
| Section number | 13 |
| Section name | "AI Agents" |
| Section color | `#00838f` (deep teal - distinct from Section 12 indigo, Section 11 rose, Section 4 purple, Section 7 magenta, Section 10 cyan) |
| Placement | After Section 12 (Retrieval-Augmented Generation) |
| Total chapters | 52 |
| Total acts | 9 |
| Total milestones | 6 |

## Running example

**Primary scenario: customer-support agent operating on the same customer support knowledge base introduced in Section 12.** The agent handles tickets end-to-end: triages intent, retrieves from the KB, calls account tools, holds state across multi-turn conversations, escalates when needed.

**Canonical tool inventory (re-used across all 52 chapters wherever applicable):**

| Tool | Signature | Purpose |
|---|---|---|
| `search_kb` | `(query: string)` | Calls into the same RAG retrieval pipeline from Section 12. Returns top-k chunks. |
| `lookup_customer` | `(email: string)` | Profile, subscription tier, account state. |
| `lookup_subscription` | `(customer_id: string)` | Plan, status, renewal date, payment method. |
| `reset_password` | `(customer_id: string)` | Triggers password-reset email. |
| `change_email` | `(customer_id: string, new_email: string)` | Updates account email. |
| `process_refund` | `(invoice_id: string, reason: string)` | Refund flow. Capped at $200 without human approval. |
| `escalate_human` | `(transcript: string, urgency: enum)` | Hand-off to human agent. |
| `send_email` | `(template_id: string, vars: object)` | Outbound notification. |

**Standard tickets (5, cycled across chapters):**

| Ticket | Description | What it tests |
|---|---|---|
| T1 | "I can't log in - reset my password" | Single-tool happy path. |
| T2 | "Reset my password but my email also changed" | Multi-tool sequence; memory of customer state. |
| T3 | "My dashboard is slow and showing 500 errors" | KB retrieval + multi-issue troubleshooting. |
| T4 | "Cancel my subscription and refund my last invoice" | Multi-step; refund > cap triggers escalation. |
| T5 | "What's the difference between Pro and Enterprise?" | KB-only, no account tools needed; tests router/intent. |

**Standard memory contents (cycled across memory chapters):**

| Memory type | Example content for ticket T2 |
|---|---|
| Working (short-term scratchpad) | "Customer: alice@example.com. Issue: password reset blocked by stale email. Lookups done: customer_id=c-9924, tier=pro. Next: change_email then reset_password." |
| Episodic (long-term events) | "2026-03-04: Alice opened ticket #4521 for failed password reset. Resolution: human-escalated due to legacy MFA bug." |
| Semantic (long-term facts) | "Alice = Pro tier, signed up 2024-08, prefers email contact, primary contact `alice@example.com`, billing currency USD." |
| Procedural (long-term skills) | "Refund > $200: require human approval. Multi-tool sequences: always lookup before mutate." |

**Multi-agent variant (Act 6 only):** triage agent classifies ticket intent → routes to specialist (billing / troubleshooting / product) → escalation agent if specialist fails. Same tool inventory; different agents see different subsets per role.

**Standard agent-side numeric constants (visuals vs production math):**

| Variable | Value (visuals) | Value (production math) |
|---|---|---|
| Context window | 8k tokens (drawable) | 128k - 1M tokens (modern) |
| Max iterations per agent loop | 5 (visuals) | 10-20 (production) |
| Tool call median latency | 200ms (drawable) | 50-500ms (typical) |
| LLM call median latency | 1.5s (drawable) | 300ms - 6s (model + length dependent) |
| Cost (input tokens) | $3 / 1M tokens | mid-tier model price band |
| Cost (output tokens) | $15 / 1M tokens | mid-tier model price band |
| Retry policy | 3 attempts, exp backoff | 3-5 attempts, exp backoff + jitter |
| Episodic memory retrieval top-k | 3 | 5-10 |

**Consistency rule:** the same ticket on the same agent variant produces the same trace across chapters unless the chapter is teaching a deliberate change (e.g., "with reflection, ticket T4 now self-corrects before refund").

**Secondary scenarios (used for one chapter each, where the primary doesn't fit):**

| Where used | Scenario | Why |
|---|---|---|
| Agentic RAG (13.36) | Research-agent style query: "Find all customer-impact issues in past 90 days and summarize" | Single ticket doesn't exercise iterative-retrieval loop; the agent must search, judge, re-search, summarize. |
| Coding-assistant comparison (Act 9, mention only) | Read/edit/run-tests loop | Used as 1-paragraph point of contrast to show that the same agent loop generalizes beyond support. |

## Audience outcome

**Framing**: production-grade decision-making + agent design. The learner is the person who has to ensure the AI feature reaches and sustains production grade.

The learner who finishes Section 13 can:

1. **Decide** between prompting, fine-tuning, RAG, and agents for a new use case, with mechanics-grounded reasoning.
2. **Design** a production agent from first principles: tools, loop pattern, memory layers, eval set, observability, guardrails.
3. **Build out** the tool layer correctly: JSON schemas, parallel calls, error returns, retry policy, capability scope.
4. **Choose** between MCP, A2A, and bespoke tool wiring based on the trust boundary and integration shape.
5. **Pick** a loop pattern (ReAct vs plan-execute vs reflection vs workflow-only) for the task at hand, with clear termination conditions.
6. **Design** the memory architecture: which layers are needed, what gets summarized, what gets persisted, what gets retrieved.
7. **Compose** a multi-agent system that avoids the common failure modes (drift, infinite loops, deadlock, cost runaway).
8. **Evaluate** an agent across correctness, latency, cost, and safety - using LLM-as-Judge calibrated against trace-level evals.
9. **Operate** an agent in production with observability, cost controls, retries, guardrails, and prompt-injection defenses.
10. **Choose** a framework (or no framework) from underlying patterns, not vendor marketing.
11. **Lead the conversation** in design reviews and tradeoff debates.

**Tone**: same as Sections 11 and 12 - production-focused, tradeoff-literate, vendor-skeptical, math-honest. Every concept gets the real version: real tool schema shape, real eval rubric wording, real failure mode. No watered-down summaries.

**Anti-outcome (NOT what learner gets)**: this is not "build your first agent in 30 minutes". The section gives the depth a learner needs *after* the tutorial: what every choice means, when each pattern applies, how to operate the system in production.

## Arc (9 acts)

1. **Prompting Foundations** (6 ch) - the substrate every agent runs on: system prompts, few-shot, CoT, structured output, decision matrix (prompt vs tune vs RAG vs agent), context engineering.
2. **Tool Calling** (5 ch) - turning the LLM into an orchestrator: tool schemas, lifecycle, parallel calls, error handling, tool-design patterns.
3. **Protocols (MCP + A2A)** (6 ch) - moving from ad-hoc tool wiring to standardized contracts: MCP architecture and primitives, building MCP servers, MCP security, A2A.
4. **Workflows & Agent Loops** (6 ch) - the workflow-vs-agent split (Anthropic's distinction), workflow primitives (chaining, routing, parallelization), the agent loop, ReAct, plan-execute + reflection, loop termination.
5. **Agent Memory** (6 ch) - the layers above the context window: working, episodic, semantic, procedural memory; summary + context-window management.
6. **Multi-Agent Architectures** (7 ch) - division of labor: orchestrator-worker, supervisor / hierarchical, hand-offs, critic / debate, failure modes, agentic RAG.
7. **Evals** (5 ch) - how production agents are graded: dimensions, LLM-as-Judge, trace evals, eval sets, continuous eval.
8. **Production Hardening** (6 ch) - the operational layer: observability + tracing, cost control, latency optimization, guardrails, prompt-injection defenses, tool security.
9. **Frameworks & Decision** (5 ch) - the closer: LangGraph, CrewAI / AutoGen, vendor SDKs (Claude Agent SDK + OpenAI Agents), custom / no-framework, and the final decision framework.

## Full chapter list (52 chapters)

### Act 1 - Prompting Foundations (6 chapters)

| ID | Component | Title |
|---|---|---|
| 13.1 | AnatomyOfLlmCall | Anatomy of an LLM Call |
| 13.2 | SystemPromptContract | System Prompts - The Role Contract |
| 13.3 | FewShotStructuredOutput | Few-Shot + Structured Output |
| 13.4 | ChainOfThoughtSelfConsistency | Chain of Thought + Self-Consistency |
| 13.5 | PromptVsTuneVsRagVsAgent | Prompt vs Fine-Tune vs RAG vs Agent |
| 13.6 | ContextEngineering | Context Engineering |

**Visual focus:** message-block diagram (system/user/assistant) with token-count bar; system prompt as labeled contract (persona / constraints / output rules); few-shot example as 3-row labeled box + structured-output schema artifact; CoT trace as labeled reasoning chain + self-consistency multi-path majority vote; 4-way decision matrix (axes: data fixed-vs-changing, capability gap, latency budget, cost budget); prompt assembly stack with lost-in-the-middle annotation.

### Act 2 - Tool Calling (5 chapters)

| ID | Component | Title |
|---|---|---|
| 13.7 | ToolUseAsBridge | Tool Use - LLM as Orchestrator |
| 13.8 | JsonSchemaForTools | JSON Schemas + Tool Descriptions |
| 13.9 | ToolCallLifecycle | Tool Call Lifecycle |
| 13.10 | ParallelToolsAndChoice | Parallel Tools + Tool Choice |
| 13.11 | ToolErrorsRetries | Tool Errors, Retries, Validation |

**Visual focus:** LLM-as-orchestrator vs LLM-only diagram; canonical tool-schema artifact (the *shape* as labeled JSON, NOT code); request → tool_use → runtime → tool_result → continuation swim-lane; parallel-tool fan-out diagram with merge point; tool_choice mode comparison (auto / required / none / specific); 4-class error taxonomy (transient / permanent / malformed / business-rule) with handling matrix.

### Act 3 - Protocols (MCP + A2A) (6 chapters)

| ID | Component | Title |
|---|---|---|
| 13.12 | WhyProtocols | Why Protocols? |
| 13.13 | McpArchitecture | MCP Architecture |
| 13.14 | McpPrimitives | MCP Primitives - Tools, Resources, Prompts |
| 13.15 | BuildingMcpServer | Building an MCP Server |
| 13.16 | McpSecurity | MCP Security |
| 13.17 | A2AProtocol | A2A - Agent-to-Agent Protocol |

**Visual focus:** ad-hoc tools vs protocol-mediated tools (sprawl vs hub-and-spoke); MCP host/client/server topology with transport arrows (stdio / HTTP / SSE); 3-primitive comparison table (tools vs resources vs prompts) with example artifacts; MCP-server build flowchart (declare → handle → register); security boundaries (sandbox / capability scope / OAuth flow / consent prompts); A2A discovery + delegation flow on the customer-support scenario (triage agent delegates to billing agent via A2A).

### Act 4 - Workflows & Agent Loops (6 chapters)

| ID | Component | Title |
|---|---|---|
| 13.18 | WorkflowVsAgent | Workflow vs Agent |
| 13.19 | WorkflowPrimitives | Workflow Primitives - Chaining, Routing, Parallelization |
| 13.20 | AgentLoop | The Agent Loop |
| 13.21 | ReActPattern | ReAct Pattern |
| 13.22 | PlanExecuteReflect | Plan-Execute + Reflection |
| 13.23 | LoopTermination | Loop Termination |

**Visual focus:** workflow (fixed DAG) vs agent (open loop) side-by-side; three workflow primitives as labeled topology diagrams (chain / router with intent classification / parallel fan-out + aggregator); reason-act-observe cycle as ladder diagram; ReAct trace on ticket T2 with explicit Thought/Action/Observation rows; plan-execute as two-phase (plan tree → execute leaves) vs reactive ReAct comparison; reflection loop with critic step; termination conditions matrix (success / max-iters / budget exhaustion / explicit stop) with example budgets.

### Act 5 - Agent Memory (6 chapters)

| ID | Component | Title |
|---|---|---|
| 13.24 | MemoryTaxonomy | Memory Taxonomy - Short vs Long |
| 13.25 | WorkingMemory | Working Memory - The Scratchpad |
| 13.26 | EpisodicMemory | Episodic Memory - Past Events |
| 13.27 | SemanticMemory | Semantic Memory - Learned Facts |
| 13.28 | ProceduralMemory | Procedural Memory - Learned Skills |
| 13.29 | SummaryAndContextMgmt | Summary Memory + Context Window Management |

**Visual focus:** taxonomy tree (short → {working} / long → {episodic, semantic, procedural}); working-memory scratchpad shown as live-updated note panel across loop steps; episodic store as time-stamped event log + vector retrieval back-reference to Section 11.7 HNSW; semantic profile card growing across sessions; procedural memory as cached-skill library with retrieval-by-task-similarity; rolling summary visual (100 turns → 3-paragraph summary) + context-window assembly with recency-vs-relevance bar.

### Act 6 - Multi-Agent Architectures (7 chapters)

| ID | Component | Title |
|---|---|---|
| 13.30 | WhyMultiAgent | Why Multi-Agent? |
| 13.31 | OrchestratorWorker | Orchestrator-Worker |
| 13.32 | SupervisorHierarchy | Supervisor / Hierarchical |
| 13.33 | AgentHandoffs | Hand-Offs |
| 13.34 | CriticDebate | Critic / Debate / Reflection-as-Multi-Agent |
| 13.35 | MultiAgentFailures | Multi-Agent Failure Modes |
| 13.36 | AgenticRag | Agentic RAG |

**Visual focus:** single-agent capacity ceiling vs multi-agent specialization; orchestrator-worker topology (1 planner + N workers + aggregator); supervisor tree (supervisor → specialists → sub-specialists); hand-off ring (Swarm-style agents-as-routes) on the support-triage scenario; critic-debate as paired-agent loop; 4 failure modes shown as traces (drift, infinite loop, deadlock, cost runaway) with diagnostic signal each; agentic RAG loop (query → retrieve → judge → refine → retrieve again) compared against Section 12's naive RAG pipeline.

### Act 7 - Evals (5 chapters)

| ID | Component | Title |
|---|---|---|
| 13.37 | WhyEvalAgents | Why Eval Agents Differently |
| 13.38 | EvalDimensions | Eval Dimensions |
| 13.39 | LlmAsJudge | LLM-as-Judge |
| 13.40 | TraceEvals | Trace Evals |
| 13.41 | EvalSetsContinuous | Eval Sets + Continuous Eval |

**Visual focus:** agent-eval-vs-LLM-eval comparison (non-determinism, multi-step, silent failure); 4-axis eval radar (correctness / latency / cost / safety) with target zones; LLM-as-Judge rubric artifact (pairwise + scalar + criteria-list) + bias chart; trace tree with per-step grades (which step failed); eval-set composition flow (golden + adversarial + regression); continuous-eval pipeline (online sampling → judge → drift signal).

### Act 8 - Production Hardening (6 chapters)

| ID | Component | Title |
|---|---|---|
| 13.42 | ObservabilityTracing | Observability & Tracing |
| 13.43 | CostControl | Cost Control |
| 13.44 | LatencyOptimization | Latency Optimization |
| 13.45 | Guardrails | Guardrails |
| 13.46 | PromptInjectionDefenses | Prompt Injection Defenses |
| 13.47 | ToolSecurity | Tool Security |

**Visual focus:** OTel-style span tree for one agent run (turn → LLM call → tool calls → continuation), with latency + cost overlays; cost breakdown bar (input tokens / output tokens / tool calls / retries) + prompt-cache prefix savings diagram (back-ref Section 12.36); latency waterfall with streaming + parallel-call optimizations highlighted; input/output guardrail filter pipeline; prompt-injection taxonomy (direct / indirect / jailbreak) with attack diagrams on the support agent; tool-security boundaries (sandbox / capability scope / audit log / consent prompts).

### Act 9 - Frameworks & Decision (5 chapters)

| ID | Component | Title |
|---|---|---|
| 13.48 | LangGraphFramework | LangGraph |
| 13.49 | CrewAiAutoGen | CrewAI / AutoGen |
| 13.50 | VendorSdks | Claude Agent SDK + OpenAI Agents |
| 13.51 | CustomNoFramework | Custom / No-Framework |
| 13.52 | AgentDecisionFramework | The Complete Agent Decision Framework |

**Visual focus:** LangGraph as state-machine + graph (nodes / edges / state object); CrewAI / AutoGen as role-based agents + conversational orchestration side-by-side; vendor-SDK comparison (Claude Agent SDK loop primitive + OpenAI Agents hand-off primitive); custom-build cost/benefit decision tree; final decision framework assembling every chapter's choice into one walkthrough (designing a production agent for a new use case) - the capstone that ties Sections 1-13 together.

## Design rules - MANDATORY

Every chapter MUST follow CLAUDE.md visual rules in full, plus the Section-12-established rules below (re-stated here for emphasis and to ensure milestone executors don't have to cross-reference).

### Visual quality (zero tolerance)

These are MANDATORY validation gates. A chapter is not "done" until all of these pass:

1. **Zero overlap.** No diagram, visual, or illustration component overlaps another in any manner. Enforced by Chrome visual validation, not eyeballed at code-write time.
2. **Edges + nodes + boxes consistently aligned.** Every node/edge/box in any diagram is vertically AND horizontally center-aligned within its container, with symmetric padding. SVG `viewBox` content centered with computed symmetric `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case capitalization for diagram box text.** Every WORD inside a diagram box has its first letter capitalized (stricter than CLAUDE.md's "first letter of line" rule). Example: a box labeled "Retrieve Top K Documents" not "Retrieve top k documents". Exceptions: officially lowercase brand names (pgvector, numpy), variable identifiers in formulas (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line/sentence capitalized.** CLAUDE.md mandate, re-stated. All visible text fragments - monospace lines, table cells, bullet points, column headers, card descriptions, SVG text labels - start with a capital letter.
5. **Titles always center-aligned.** Every Box title, sub-step title, section heading inside a Box uses the T component's `center` prop. Inside card layouts, the title T MUST have `center`, the description T MUST have `center`, AND the parent card div MUST have `textAlign: "center"`.
6. **Standalone formulas always centered** with `textAlign: "center"` on the container div.
7. **Colored boxes, not invisible ones.** Never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** on every SVG; corresponding entry in `src/data/svg-descriptions.json`.
9. **No em-dashes.** Use hyphens or rewrite. Enforced by the Stop hook `.claude/scripts/check-sections.sh`.
10. **Dot product notation** uses the middle dot, not a multiplication sign.
11. **Font sizes 16-20 for content body**, 20-24 for titles. Never below 14px except tiny SVG annotations.
12. **Inner element pattern** uses tinted backgrounds (`${color}06`) and soft borders (`1px solid ${color}12`); never `opacity` for transparency.
13. **No next-chapter hints** in content. Navigation is handled by the app shell.
14. **No use of the word "architect"** in chapter titles, descriptions, or content.

### Chrome browser visual validation - MANDATORY

Every chapter at every sub-step MUST be validated in Chrome via the `mcp__claude-in-chrome__*` tools before being marked complete. Use the `check-visuals` skill in this project.

Validation checklist per chapter:

- Open the chapter in the running dev server.
- Step through every sub-step (Reveal click).
- Check: no overlapping elements anywhere on the page.
- Check: every diagram is centered horizontally + vertically within its container.
- Check: every diagram-box label is title-case.
- Check: every line of text starts with a capital letter.
- Check: every Box has a real color (not `C.card`).
- Check: every standalone formula is centered.
- Take a screenshot for visual reference.

A chapter that passes tests but fails Chrome validation is NOT done. Fix in code, re-validate.

### Density: visual-first

- **Less text, more diagrams.** Default to "show with a diagram" over "describe in prose". A chapter with 5 paragraphs of text and 1 diagram is failing this rule. A chapter with 1 paragraph and 5 diagrams is succeeding.
- **Every diagram intuitively self-explanatory.** A learner glancing at the diagram should grasp the concept without reading the surrounding text. Text supplements the diagram, not the other way around.
- **Build piece by piece** with Reveal sub-steps. Each click adds one clear idea; never dump everything on screen at once. Most chapters land at 5-8 sub-steps.
- **Concrete over abstract.** Use the customer-support agent + 5 standard tickets throughout. "Ticket T2" / "Customer alice@example.com" naming. Never "some user" / "some ticket".
- **Real depth, simple language.** Show the real tool schema shape, the real eval rubric, the real failure-mode trace. Never paraphrase the artifact.
- **Show the WHY.** Every tool design, every loop pattern, every memory layer, every framework choice: explain the tradeoff that picks it.

### Artifact treatment - Section-13-specific rule

Section 13 has more text artifacts than any prior section: tool schemas, message blocks, prompt templates, eval rubrics, MCP messages, A2A discovery docs. ALL of these are rendered as styled monospace **text** blocks visually distinct from code:

- Background tint matching the box color (e.g., `${C.teal}06`).
- Soft border `1px solid ${C.teal}12`.
- Monospace font, 14-16px.
- Highlight variable placeholders (`{query}`, `{customer_id}`, `<schema>`) in distinct color.
- Label the block as one of: "Tool Schema (shape)", "Tool-Use Message", "Tool-Result Message", "MCP Message", "A2A Discovery Doc", "Prompt Template", "Eval Rubric".
- One canonical example per artifact type per act. Re-use that canonical shape across chapters in the same act.
- NEVER render as executable code. NEVER include language fences (no `\`\`\`python`, no `\`\`\`json` with executable framing). These are *shape* artifacts, not runnable code.

### Consistency rules

- **Re-use the customer-support agent + 5 standard tickets + canonical tool inventory** across all 52 chapters wherever applicable.
- **Re-use the canonical numeric constants** in the running-example table - same ticket on the same agent variant produces the same trace across chapters unless the chapter is teaching a deliberate change.
- **Cross-section back-references** use the format: "X - covered in Section N.M - here we focus on ...". Always include the chapter number. Example: "Vector storage - covered in Section 11.6 - here we use it as the substrate for episodic memory."
- **Per-act color scheme** - use one Box color family per act for visual continuity. Tentative assignment (finalize during milestone implementation):
  - Act 1 (Prompting Foundations): blue
  - Act 2 (Tool Calling): cyan
  - Act 3 (Protocols MCP+A2A): purple
  - Act 4 (Workflows & Loops): orange
  - Act 5 (Memory): amber
  - Act 6 (Multi-Agent): green
  - Act 7 (Evals): red
  - Act 8 (Production Hardening): pink
  - Act 9 (Frameworks & Decision): teal (matches section color)
- **Chapter ID consistency** - config.js `id: "13.N"`, component name = topic-PascalCase (e.g., `AgentLoop`, `LlmAsJudge`, `McpPrimitives`). Filenames lowercase kebab-case.

### CLAUDE.md update flagged

The "title-case for diagram box text" rule established by Section 12 will continue to be enforced in Section 13. If during Section 13 milestone work additional rules emerge that should propagate globally, flag them here for a CLAUDE.md update at section-ship time.

## Implementation file split

| File | Acts covered | Chapter count |
|---|---|---|
| `src/sections/agent-prompting.jsx` | Act 1 (prompting foundations) | 6 |
| `src/sections/agent-tools.jsx` | Acts 2 + 3 (tool calling + MCP + A2A) | 11 |
| `src/sections/agent-loops.jsx` | Acts 4 + 5 (workflows / loops + memory) | 12 |
| `src/sections/multi-agent.jsx` | Act 6 (multi-agent) | 7 |
| `src/sections/agent-evals.jsx` | Act 7 (evals) | 5 |
| `src/sections/agent-production.jsx` | Acts 8 + 9 (production + frameworks + decision) | 11 |

Total: 6 files, 52 chapters. No file exceeds ~12 chapters. Keeps each file focused and reasonable for editing. Filenames are lowercase kebab-case per CLAUDE.md.

## Other infrastructure changes

- **`src/config.js`** - add 52 chapter entries; add Section 13 to `sectionNames` and `sectionColors` (`13: "AI Agents"`, `13: "#00838f"`).
- **`src/learn-ai.jsx`** - import the 6 new section files and spread into the lookup object.
- **`src/__tests__/sections.test.jsx`** - add tests for every new chapter at every sub-level.
- **`src/__tests__/lookup.test.js`** - tests already iterate config; new entries auto-covered, but verify after registration.
- **`src/data/svg-descriptions.json`** - add entries for every new SVG.
- **`CLAUDE.md`** - update the mapping table to add Section 13; update project structure tree to include 6 new section files.
- **`public/llms.txt`** - update topic list to include AI Agents (prompting + tools + MCP + agent loops + memory + multi-agent + eval + production).
- **`index.html`** - update JSON-LD `teaches` array to include AI Agents topics.
- **TOC** (`src/sections/toc.jsx`) - register Section 13 in sections array.

## Milestones

Section 13 is split into 6 milestones, mirroring Sections 11 and 12. Each milestone is independently shippable (tests green, coverage maintained, Chrome-validated).

| M | Acts | Chapter range | Count | Theme |
|---|---|---|---|---|
| M1 | Acts 1 + 2 | 13.1 - 13.11 | 11 | Prompting + Tool Calling (foundations) |
| M2 | Acts 3 + 4 | 13.12 - 13.23 | 12 | Protocols (MCP + A2A) + Workflows / Agent Loops |
| M3 | Acts 5 + 6 | 13.24 - 13.36 | 13 | Memory + Multi-Agent |
| M4 | Act 7 | 13.37 - 13.41 | 5 | Evals |
| M5 | Act 8 | 13.42 - 13.47 | 6 | Production Hardening |
| M6 | Act 9 | 13.48 - 13.52 | 5 | Frameworks + Decision (capstone) |

Each milestone plan must include (mirroring Section 12's milestone template):

1. **Prerequisites** - prior milestone status, baseline gate.
2. **File Structure** - new / modified / unchanged files.
3. **Standard running-example values** - re-stated per milestone for executor convenience.
4. **Visual rules MANDATORY** - re-stated per milestone (zero overlap, Chrome validation, title-case diagram text, etc.).
5. **Cross-file dependency map** - which files must be touched when adding a chapter, when adding a section file, when registering a new section, when updating learn-ai.jsx loaders. Prevents silent gaps where one of `config.js` / `learn-ai.jsx` / `sections.test.jsx` / `svg-descriptions.json` / `CLAUDE.md` / `llms.txt` / `index.html` is missed.
6. **Implementation order** - numbered task sequence.
7. **Task 0: Name This Session** - set session title (e.g., `section13-milestone1`).
8. **Task 1: Verify green baseline** - run tests, lint, format, build.
9. **Tasks 2..N: TDD per chapter** - red (test fails) → impl → green → Chrome validation gate.
10. **Task N-2: Update CLAUDE.md mapping** - section mapping table + project structure tree.
11. **Task N-1: Discoverability sync** - `public/llms.txt`, `index.html` JSON-LD `teaches` array (for M1 only; later milestones add chapter entries if needed).
12. **Task N: Final M(n) verification** - full test smoke gate, coverage check, lint, format, build.
13. **Task N+1: Plan Refinement Checkpoint for M(n+1)** - lessons-feed-forward:
    - Step 1: Lessons capture in `docs/superpowers/lessons/section-13-m(n)-lessons.md` (3-5 honest bullet observations).
    - Step 2: Read M(n+1) plan with M(n) lessons in mind.
    - Step 3: Edit M(n+1) plan inline if needed.
    - Step 4: Full test smoke gate.
    - Step 5: Scope verification (`git status` + `git diff --stat`).
    - Step 6: Commit lessons file + any plan edits.
    - Step 7: Generate `docs/superpowers/starter-prompts/section-13-m(n+1)-starter.md` - a ready-to-paste prompt for starting the next milestone in a fresh Claude Code session (references plan, spec, prior lessons; specifies opus subagents, TDD mandate, Chrome validation gate, first task = session naming).
    - Step 8: Commit starter prompt file. M(n) complete.
14. **Notes for next session executor** - reminders before pasting the starter prompt (review lessons, verify M(n) commits on main, verify `npm run test` green).
15. **What Comes Next** - one-line summary of the next milestone's theme.
16. **Self-Review Notes** - lessons captured from drafting this plan, for future plan-drafting sessions.

For M6 (the final milestone), the Plan Refinement Checkpoint task becomes a section-ship task instead: lessons capture for the whole section, CLAUDE.md final update, discoverability re-index reminders (Google Search Console URL Inspection, Bing Webmaster Tools URL Submission per CLAUDE.md Discoverability Sync Rules).

### Brand-cleanup status

Section 12's initial drafting carried a fictional company name and matching URL into spec / plans / one section file. That brand has been stripped from:

- `docs/superpowers/specs/2026-05-16-section-12-rag-design.md`
- All 6 Section 12 milestone plans
- `src/sections/rag-ingestion.jsx` (URL replaced with `docs.example.com`)

Pending: `src/data/chunks.json` and `src/data/chunk-cache.json` still hold the old URL because they are auto-generated. They refresh on the next `npm run search:extract` run, which is part of the normal search-index regeneration that runs when sections change. Section 13 work starts on a brand-free baseline; no further cleanup action required before M1.

## Success criteria - when is Section 13 done

1. All 52 chapters implemented, in `config.js`, exported from one of 6 section files, lookup-resolved by `learn-ai.jsx`.
2. Tests added in `sections.test.jsx` for every chapter at every sub-level (TDD per CLAUDE.md mandate).
3. `npm run test` green, coverage 100% lines, branches >= 97.7%.
4. `npm run lint` clean, `npm run format` clean.
5. Every SVG has `<desc>` + entry in `svg-descriptions.json`.
6. **Discoverability sync:** `public/llms.txt`, `index.html` JSON-LD `teaches`, `CLAUDE.md` mapping table all updated for Section 13. User reminded to request re-indexing in Google Search Console + Bing Webmaster Tools after push.
7. **Chrome browser visual review** of all 52 chapters at all sub-levels - no overlapping elements, all diagrams centered, all diagram-box text title-case, all line-start text capitalized, no `Box color={C.card}`, all standalone formulas centered. Screenshots filed for reference.
8. **No carry-over brand references** anywhere in code, content, specs, plans, or data files. Verified by scanning `src/`, `public/`, `docs/`, and `index.html` for any prior brand-name string and confirming zero hits.
9. **No em-dashes** anywhere (Stop hook clean across all section files).
10. **CLAUDE.md visual-rule update** flagged in this spec applied if any new global rule emerged during Section 13 work.
11. **Lessons + starter prompts archived** for all 6 milestones in `docs/superpowers/lessons/` and `docs/superpowers/starter-prompts/`.

## Open questions for implementation phase (NOT spec-blocking)

- Exact wording of every chapter title (working titles in this spec - final names may be refined during chapter design).
- Per-act Box color assignment (tentative above - finalize during milestone implementation).
- Specific tool-schema artifact wording per chapter (drafted during chapter design, not spec).
- Specific eval-rubric wording per chapter (drafted during chapter design, not spec).
- Section 13 splash treatment in the TOC (match Sections 11/12 style).
- Whether to add a small Section-13-specific test helper for tool-schema-block / message-block rendering (evaluate during M1 plan writing).
- Final list of frameworks named in Act 9 (LangGraph, CrewAI, AutoGen, Claude Agent SDK, OpenAI Agents are baseline; may add LangChain Agents, Pydantic AI, or vendor-specific runtimes if they're production-relevant at milestone time).
- Whether to include a brief "voice agents / browser-use agents / computer-use" pointer paragraph in Act 9's closer, or leave entirely out of scope.
