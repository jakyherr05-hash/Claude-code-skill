# Orchestration protocol

## How delegation actually works in Claude Code

- The main conversation (running the `web-studio` skill) is the only place that spawns specialists. Specialists don't spawn each other — a reviewer that needs a fix sends the finding back to you in its handoff, and you route it.
- A specialist starts **without** this conversation's history. It gets its own system prompt (the agent file), CLAUDE.md, and your delegation prompt. So the delegation prompt must name the files to read and the paths it owns.
- Specialists run in the background by default; launch independent ones in the same turn and continue integrating while they work.
- Agents installed via the plugin are addressed as `premium-web-studio:<name>`; via `~/.claude/agents/` as `<name>`.

## Delegation prompt template

```
Project: <name> — studio docs in <abs path>/studio/
Phase: <n · name>. Track: <spot|sprint|full>.
Read first: <exact files>.
You own (may write): <paths>. Do not edit anything else; report needed changes elsewhere as open issues.
Task: <one paragraph, outcome-focused>.
Constraints: <budget, licences, browsers, deadlines — only what applies>.
Done means: <verifiable exit criteria>.
Return the HANDOFF block.
```

## HANDOFF block (every specialist returns this)

```
HANDOFF
agent: <name>
phase: <n>
summary: <2–4 lines>
files_changed: <list of paths>
verification:
  - check: <what> | status: PASS|FAIL|NOT TESTED|BLOCKED | evidence: <path / command + output excerpt>
open_issues:
  - <issue> → owner: <agent> | severity: blocker|major|minor
decisions_needed: <for the user or tech-lead, or "none">
next_suggested: <agent + task>
```

You copy the key lines into `PROJECT_STATUS.md` and append any decisions to `DECISIONS.md` (date, decision, alternatives, why, decided by).

## Parallel-safety map

| Wave | Run together | Must wait for |
|---|---|---|
| Research | reference-researcher | brief |
| Spec | ui-ux-designer ∥ typography-spacing | creative direction |
| Spec-2 | gsap-animator (animation spec) | design + type spec |
| Build-1 | frontend-engineer ∥ typography-spacing (tokens) ∥ ai-visual-producer | Gate A |
| Motion-1 | lenis-scroll | layout works without motion |
| Motion-2 | gsap-animator ∥ webgl-specialist | scroll system verified |
| Test | qa-engineer ∥ performance-engineer | feature-complete build |
| Gate B | creative-director ∥ tech-lead ∥ qa-engineer (read-only reviews) | all fixes re-tested |

Rule of thumb: parallel only when the write-sets are disjoint. Read-only reviewers can always run in parallel.

## Model selection

Agent files set a default `model`. Override per call only with reason:

- **opus** — creative-director, tech-lead, webgl-specialist (judgement-heavy, shader/math work), and any escalation.
- **sonnet** — most build and research work.
- **haiku** — mechanical tasks: running an existing test suite and summarising, batch image conversion, link checks, file inventory.

## Context hygiene

- Point to files; don't paste them.
- Ask specialists for handoff blocks, not narratives.
- Keep the research library as the long-term memory for references; don't re-research a site that has a recent entry (< 6 months) unless the task needs details the entry lacks.
- When a phase finishes, summarise it in PROJECT_STATUS.md in ≤10 lines; later phases read the summary, not the transcripts.

## Conflict resolution

1. Two specialists disagree (e.g. animator wants a pinned 300vh section, performance engineer objects): both state their case in one paragraph each in DECISIONS.md → `tech-lead` decides technical questions, `creative-director` decides experiential ones, the user decides anything touching budget, brand or scope.
2. A gate fails: the gatekeeper lists failures with evidence; you route each to its owner; the gatekeeper re-checks only the failed items plus anything the fix touched.
