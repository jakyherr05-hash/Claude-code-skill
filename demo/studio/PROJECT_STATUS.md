# Project Status — Penumbra — Light Atelier (demo)
_Single source of truth. Update at every phase boundary._

- Track: spot | sprint | full
- Current phase: 10 · Final approval — Gate B round 2 done (2026-11-17); majors fixed and closed by the reviewer
- Last updated: 2026-11-17

## Phase log
| Phase | Owner(s) | Status | Exit evidence | Date |
|---|---|---|---|---|
| 1 Discovery | orchestrator | in progress | | |

## Gates
| Gate | Reviewer | Verdict | Evidence | Date |
|---|---|---|---|---|
| A · Architecture | tech-lead | CHANGES REQUIRED → doc fixes A1–A3 applied (ownership map, ratified budget, spec corrections) | npm ls / npm view / dist grep; TECHNICAL_ARCHITECTURE.md; ANIMATION_SPECIFICATION.md | 2026-11-15 |
| B · Technical (round 1) | tech-lead | CHANGES REQUIRED: B1 loseContext stall, B2 probe context, B4 LCP, B5 focus frame; QA D-1 verified fixed @0a69e55 | scroll-motion 8/8 @HEAD; long-task probes; Lighthouse mobile JSON | 2026-11-15 |
| B · Creative (round 1) | creative-director | FAIL: blocker = mobile hero contrast (shaft behind text); majors = poster/shader intro, manifesto underline, hour stills, detail H1 fold, Method mobile labels | gate-b-cd captures (1440/390/no-WebGL/reduced), measured contrast | 2026-11-15 |
| B · QA (round 1) | qa-engineer | CONDITIONAL: 37/39 (reduced-motion wheel D-1, flaky sync test D-3); D-2 labels; visual 12/12; axe clean | QA_REPORT.md, results.json | 2026-11-15 |
| B · Creative (round 2) | creative-director | PASS (0 blockers, 2 majors) → majors fixed (W34 detail crops + wide renders, W36 Hour exposure) → closure re-check: both CLOSED | docs/BUGS-FIXES.md W34–W41; reviewer captures | 2026-11-17 |
| B · QA (round 2) | qa-engineer | FAIL on one intermittent test → root cause + deterministic test (S14) → suite 56/56 | docs/evidence/playwright-gate-b-r2.json | 2026-11-17 |
| B · Technical (round 2) | tech-lead | code correct; FAIL on stale evidence counts + in-progress tree → evidence regenerated at the final commit, docs reconciled, templates in sync | docs/VALIDATION-REPORT.md B.6 | 2026-11-17 |
| B · QA closure (round 2) | qa-engineer | **PASS**: rewritten Lenis test not weaker, 5/5; evidence covers all 56 tests | scratchpad closure-qa.md (summarised here) | 2026-11-17 |
| B · Technical closure (round 2) | tech-lead | both round-2 required fixes CLOSED; new FAIL: Hour preset test load-sensitive + 3 stale doc statements → fixed (S15, README, BUGS-FIXES); narrow re-gate pending | docs/BUGS-FIXES.md S15 | 2026-11-17 |
| B · Technical re-gate (round 2) | tech-lead | **PASS** once its two doc lines were fixed (verified by grep): Hour preset test 3/3 quiet + 3/3 under load, own full suite 56/56, templates in sync, validate 173/173; later evidence run 57/57 at `cf4ebca` (adds the separator regression test) | docs/evidence/playwright-gate-b-r2.json | 2026-11-18 |
## Open tasks
| Task | Owner | Blocked by |
|---|---|---|
| ~~B1/B2 stalls; portrait hero; lab capture mode~~ DONE (W4, W5, W14, W20) | webgl-specialist | — |
| ~~Shader-rendered posters and six Hour stills~~ DONE (W15, W16) | ai-visual-producer | — |
| ~~Portrait poster + preloads; Hour stills in strip and fallback~~ DONE | frontend-engineer | — |
| ~~Lighthouse re-measure~~ DONE (docs/VALIDATION-REPORT.md B.3); font budget fixed (W23) | performance-engineer | — |
| Detail→Home long tasks (161–754 ms in hero getContext, SwiftShader) — real-GPU trace | webgl-specialist | a real GPU |
| ~~Gate B round 2~~ DONE | creative-director, tech-lead, qa-engineer | — |

## Handoffs received (latest first, ≤10 lines each)

- **2026-11-15 · Fix wave after Gate B round 1 (orchestrator):** QA D-1/D-2/D-3/D-5/D-7 fixed (0a69e55). Tech-lead B4 → static prerender + route-matched hydration + font preloads; B5 focus frame; N1 strict leak test; N4–N10, N12. Creative fixes 3, 5, 6, 7, 8, 9, 10, 11, 12, 13 applied and browser-measured (detail H1 bottom 747/900 and 639/844; Hour caption gap 16 px; contact x = manifesto x = 157; underline 100% drawn). Fix 2 continuous intro (CSS warm-on + shader continues from poster opacity) implemented; posters pending.
