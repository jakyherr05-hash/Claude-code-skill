# Project Status — Halde
_Single source of truth. Update at every phase boundary._

- Track: full
- Current phase: 10 · Gate B
- Last updated: 2026-11-16

## Phase log
| Phase | Owner(s) | Status | Exit evidence | Date |
|---|---|---|---|---|
| 1 Discovery | orchestrator | done | studio/PROJECT_BRIEF.md | 2026-11-16 |
| 2 Research | reference-researcher | done | studio/REFERENCE_RESEARCH.md (40 lines; no ceramics refs in library — stated) | 2026-11-16 |
| 3 Creative direction | creative-director | done | studio/CREATIVE_DIRECTION.md (35 lines; contrast hand-computed, script NOT TESTED) | 2026-11-16 |
| 4 Design spec | ui-ux-designer ∥ typography-spacing, then gsap-animator | done | DESIGN_SPECIFICATION.md (36), TYPOGRAPHY_SYSTEM.md (40), SPACING_SYSTEM.md (37), ANIMATION_SPECIFICATION.md (36) | 2026-11-16 |
| 5 Architecture | frontend-engineer, gsap-animator; Gate A tech-lead | done | TECHNICAL_ARCHITECTURE.md (40), DECISIONS.md, Gate A r4 PASS | 2026-11-16 |
| 6 Development | frontend-engineer (W1), typography-spacing (W2), ai-visual-producer | done | index.html/styles.css/main.js; evidence/phase6/w1-390-full.png, w1-1440-full.png (orchestrator render: no overflow, 0 console errors) | 2026-11-16 |
| 7 Motion | lenis-scroll (W3) → gsap-animator (W4); webgl-specialist not used (no 3D in concept) | done (W3+W4) | evidence/phase7/lenis-samples.txt, motion-samples.txt (orchestrator-run probes) | 2026-11-16 |
| 7b Fix wave W5 | frontend-engineer, typography-spacing (docs) | done | evidence/phase7b/w5-probe.mjs output (orchestrator-run: focus PASS click/enter/reduced; 0 text/ring overlap; no overflow), w5-390-contact.png, w5-1440-contact.png | 2026-11-16 |
| 8 Visual production | ai-visual-producer | done | studio/ASSET_MANIFEST.md (40; 0 KB media, CSS-only, licences UNVERIFIED) | 2026-11-16 |
| 9 Testing | qa-engineer ∥ performance-engineer (orchestrator executed scripts: agent shells denied) | done | tests/qa-results.json (44 PASS/0 FAIL), tests/shots/, studio/QA_REPORT.md, studio/PERFORMANCE_REPORT.md, evidence/phase9/measured*.txt | 2026-11-16 |
| 10 Gate B | creative-director, tech-lead, qa-engineer (independent) | in progress | | |

## Gates
| Gate | Reviewer | Verdict | Evidence | Date |
|---|---|---|---|---|
| A · Architecture | tech-lead | PASS on round 4 (r1 FAIL TA-1..8, r2 FAIL R2-1..6, r3 FAIL R2-3/5b) | studio/DECISIONS.md, vendor/PROVENANCE.md | 2026-11-16 |
| B · Creative | creative-director | pending | | |
| B · Technical | tech-lead | pending | | |
| B · QA | qa-engineer | pending | | |

## Open tasks
| Task | Owner | Blocked by |
|---|---|---|
| Fix probe URL shadow bug | lenis-scroll | — |
| Lenis/GSAP licence text + sha256 vs npm (before public launch) | user/tech-lead | no network; UNVERIFIED |
| gzip size measurement | performance-engineer | build |
| IIFE for main.js; Lenis anchor pushState | frontend-engineer / lenis-scroll | code |

## Handoffs received (latest first, ≤10 lines each)
- P2 reference-researcher: 4 refs (Typewolf, Instrument, Lenis site, Locomotive) from library; no captures; screenshots NOT TESTED; open: no craft ref, Instrument serif size unknown.
- P3 creative-director: concept 'Brought to centre'; signature 'Coming to centre' (CSS rings settle on scroll); 6-colour palette; contrast NOT TESTED by script → web-qa.
- P4 ui-ux: 38-line spec, hooks data-ring/data-step; open: ring budget. typography: system serif, 6 clamp steps, tokens in docs; render NOT TESTED. gsap-animator: 5 ScrollTriggers, no pin, Lenis lerp .12; all runtime checks NOT TESTED yet.
- P5 frontend-engineer draft arch; tech-lead Gate A FAIL: lerp overridden by duration, .js-motion hides content on vendor failure, live RM toggle, ownership gaps, no visual regression plan, Lenis licence unverified.
- P5 Gate A r2 (tech-lead): TA-1,4-8 PASS; TA-3 reopened (matchMedia live vs reload), TA-2 late-main.js race. Licences UNVERIFIED → private preview only.
- P5 Gate A r4 PASS (tech-lead). Conditions: no global scrollTo, gzip unmeasured, licences UNVERIFIED (private preview only), fallback LCP ~2.5s accepted.
- P6 frontend W1: page built, browser check NOT TESTED by agent (denied); orchestrator ran it: PASS no overflow/errors, defect: contact rings over text. typography W2: tokens landed, undefined-var grep PASS. ai-visual: ASSET_MANIFEST (0 media).
- P7 W3 lenis-scroll: code written, agent could not run Bash; orchestrator ran probe: 1 Lenis, smoothing PASS, anchors+focus PASS in motion; focus FAIL in reduced-motion native path.
- P7 W4 gsap-animator: initMotion written; agent could not run Bash; orchestrator ran probe: 5 triggers at load, hero scrub 0→centred, no pin, 0 errors, reduced=0 triggers; defect: RM step overlay hidden.
- P7b W5 frontend: anchor focus, contact rings, RM step overlay fixed; agent could not run Bash, orchestrator ran probe (PASS). Minor: Back button after anchor jump (pushState, no popstate). Rings now below email, not around it (creative to judge).
- P9 QA: 44 PASS/0 FAIL (1st run 2 FAIL = test timing defect, fixed by QA, rerun PASS); NOT TESTED: axe, baselines, FF/WebKit, devices. Perf: JS gz 54,810 (≤70KB), throttled LCP 1352ms median, CLS 0; Lighthouse/INP NOT TESTED.
