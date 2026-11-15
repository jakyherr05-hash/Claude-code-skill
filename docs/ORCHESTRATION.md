# Agent orchestration

## Architecture
```
                         ┌─────────────────────────── main session ───────────────────────────┐
 user ─► web-studio skill│ producer/integrator: sizes the job, owns studio/PROJECT_STATUS.md,  │
                         │ delegates by phase, enforces file ownership, verifies every handoff │
                         └───────┬───────────────┬────────────────┬───────────────┬────────────┘
                                 │ (parallel when write-sets are disjoint)        │
   research ─ reference-researcher (sonnet)      │                                │
   concept  ─ creative-director (opus)           │                                │
   spec     ─ ui-ux-designer ∥ typography-spacing (sonnet) → gsap-animator (spec) │
   gate A   ─ tech-lead (opus, read-only tools)  │                                │
   build    ─ frontend-engineer ∥ typography-spacing (tokens) ∥ ai-visual-producer
   motion   ─ lenis-scroll → gsap-animator ∥ webgl-specialist (opus)
   test     ─ qa-engineer ∥ performance-engineer (sonnet)
   gate B   ─ creative-director ∥ tech-lead ∥ qa-engineer (independent reviews)
```
Specialists never spawn each other. Cross-cutting findings come back to the orchestrator in a HANDOFF block, and the orchestrator routes them to the owner of the affected files.

## Mechanisms (all documented Claude Code features)
| Need | Mechanism |
|---|---|
| Specialist identity, tools, model | `agents/*.md` frontmatter (`name`, `description`, `tools`, `model`, `color`) |
| Domain knowledge per specialist | The agent body tells it to load its skill with the **Skill** tool. Verified: a fresh session's `typography-spacing` agent called `Skill(premium-web-studio:typography-system)` and ran the bundled script (`docs/evidence/delegation.md`). |
| Shared state, token economy | `studio/*.md` on disk. Prompts pass **paths**, not pasted content. |
| Collision avoidance | The ownership map in TECHNICAL_ARCHITECTURE.md; parallel waves only across disjoint write-sets |
| Quality gates | `tech-lead` has no Write/Edit tools, so reviews stay independent. Gate verdicts need reproduced evidence. |
| Cheap vs smart | `model:` per agent (opus for judgement/graphics, sonnet for build/research); override per call when escalating |

## How the demo was actually produced (this run)
| Phase | Agent(s) | Ran in parallel with | Output |
|---|---|---|---|
| Research | reference-researcher ×3 (batches of 8–9 sites) | each other + creative-director | 25 library entries |
| Concept | creative-director | researchers | CREATIVE_DIRECTION.md |
| Spec + build wave 1 | typography-spacing, webgl-specialist, ai-visual-producer, gsap-animator (spec) | each other, plus orchestrator integration | tokens/fonts, shader + Three lab, 42 media files, ANIMATION_SPECIFICATION.md |
| Integration | orchestrator (as frontend/motion/scroll integrator) | — | sections, router, scroll system, tests |
| Fix routing | webgl-specialist (re-engaged with context) | — | doorway/altar toggles after visual review |
| Measure | performance-engineer | orchestrator fixes | PERFORMANCE_REPORT.md |
| Gate B | creative-director, tech-lead, qa-engineer | each other | verdicts in PROJECT_STATUS.md |

In this session the plugin had not yet been installed when the session started, so its agents could not be addressed by name (Claude Code loads agent directories present at session start). Each specialist was therefore run as a subagent whose instructions were **its agent file's body**. A later fresh session confirmed that real plugin-agent delegation works (`docs/evidence/`).

## Handoff contract
See `plugins/premium-web-studio/skills/web-studio/references/orchestration.md`: delegation prompt template, HANDOFF block, parallel-safety map, model selection, conflict resolution.
