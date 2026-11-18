# OZONE — progress log (persistent)
_Plan: /root/.claude/plans/sunny-conjuring-waterfall.md (approved 2026-11-18). Resume from the last verified commit; never redo a task marked DONE._

## Status by task
| ID | Task | Status | Evidence / commit |
|---|---|---|---|
| T0 | Demo: detail-head baselines, full suite, tech-lead narrow re-gate | DONE: 57/57 at `cf4ebca`; technical re-gate PASS; recorded in `db7d366` | docs/evidence/playwright-gate-b-r2.json |
| T1 | Docs reset (brief, facts, progress, superseded concept) | DONE | `08441c1` |
| T2 | California sources retry | DONE → still BLOCKED (CDPH 503, leginfo 403, OAG silent) | FACTS_AND_SOURCES.md |
| T3 | Research delta (graphic-novel / illustrated scroll stories) | DONE: 3 new captures + The Boat past its gate; no reachable proof of one-stage camera transitions (accepted as engineering risk, prototyped + filmstrip-measured in T9) | REFERENCE_RESEARCH.md, library 55 entries |
| T4 | Creative direction (art, character, 7 scenes, loader, 6 transitions, audio) | DONE: concept "Your Ink"; client decisions pending at Gate A (gender read open; Scene 6 adult customer; M7 off; placeholder wordmark) | CREATIVE_DIRECTION.md |
| T5 | Specs (design, type/spacing, animation ownership, audio score) | DONE: all 6 specs; AUDIO covers every `sfx:`/`cue:` label (checked by grep); decisions AU-1..AU-5 | AUDIO_SPECIFICATION.md, DECISIONS.md |
| T6 | Architecture + Gate A → **client review (stop)** | IN PROGRESS: architecture aligned with A-1 and AU-1..AU-5; tech-lead Gate A review running | — |
| T7–T12 | Rig, scenes, transitions+loader, audio, QA/perf, Gate B | NOT STARTED (gated by T6) | — |

## Carried over from the vaping brief (kept, still valid)
- Research method and library entries: 14 references incl. pudding-pockets, brightiris, terminal-industries, real-cost-hhs (`REFERENCE_RESEARCH.md`, commit `0d62281`). The pacing, legibility and number-staging findings still apply; vaping-specific items do not.
- Studio workflow and templates; the demo's tested GSAP / test patterns (reused, not copied into the plugin).
- Not carried over: vaping facts and the concept "The Layer" (superseded; history in `0c03e24`).

## Log
- 2026-11-18 · Client brief replaced (cigarettes-only graphic novel, sound-first, SVG art, California). Plan revised per the client audit; approved.
- 2026-11-18 · Facts re-verified at FDA/CDC (M1–M7, L1–L3). California: CDPH HTTP 503, leginfo HTTP 403 → BLOCKED. Facts file rewritten.
- 2026-11-18 · T0: W42 separators were off-centre (more space before each "·" than after) and narrower than a literal " · " → fixed with 3ch gaps centred in the mono face. `detail-head` now matches the original baselines (no update needed); full suite re-run pending.

- 2026-11-18 · Decisions A-1..A-4 recorded; TECHNICAL_ARCHITECTURE track height corrected to budget + 100svh (A-1).
- 2026-11-18 · Audio agent hit the usage limit, resumed after reset, delivered AUDIO_SPECIFICATION (211 lines). All 21 animation labels present. Open questions settled as AU-1..AU-5.

## Open failures / blockers
- California legal sources unreadable from this environment (BLOCKED).
- Account 5-hour usage limit has interrupted agents 3 times (resume via SendMessage to the same agent).
