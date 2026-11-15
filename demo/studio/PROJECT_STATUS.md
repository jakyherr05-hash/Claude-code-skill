# Project Status — Penumbra — Light Atelier (demo)
_Single source of truth. Update at every phase boundary._

- Track: spot | sprint | full
- Current phase: 10 · Final approval — Gate B re-review pending after fix wave
- Last updated: 2026-11-15

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
| B · round 2 | all three | pending re-review after fix wave | — | — |
## Open tasks
| Task | Owner | Blocked by |
|---|---|---|
| B1/B2 WebGL main-thread stalls; portrait hero composition (CD fix 1); lab capture mode for shader-rendered posters | webgl-specialist | — |
| Shader-rendered posters (landscape + portrait) and six Hour stills (CD fixes 1, 2, 4) | ai-visual-producer | webgl capture mode |
| Wire portrait poster `<picture>` source + preloads; Hour stills in detail strip and no-WebGL fallback | frontend-engineer (orchestrator) | assets |
| Re-measure Lighthouse (median of 3, quiet host) after fixes | performance-engineer | fix wave |
| Gate B round 2 | creative-director, tech-lead, qa-engineer | all of the above |

## Handoffs received (latest first, ≤10 lines each)

- **2026-11-15 · Fix wave after Gate B round 1 (orchestrator):** QA D-1/D-2/D-3/D-5/D-7 fixed (0a69e55). Tech-lead B4 → static prerender + route-matched hydration + font preloads; B5 focus frame; N1 strict leak test; N4–N10, N12. Creative fixes 3, 5, 6, 7, 8, 9, 10, 11, 12, 13 applied and browser-measured (detail H1 bottom 747/900 and 639/844; Hour caption gap 16 px; contact x = manifesto x = 157; underline 100% drawn). Fix 2 continuous intro (CSS warm-on + shader continues from poster opacity) implemented; posters pending.
