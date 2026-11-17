# Project Status — Halde
_Single source of truth. Track: full · Current phase: COMPLETE — Gate B passed (3/3) · Updated 2026-11-17_

## Phase log
| Phase | Owner(s) | Status | Exit evidence |
|---|---|---|---|
| 1 Discovery | orchestrator | done | studio/PROJECT_BRIEF.md (assumptions A1–A7) |
| 2 Research | reference-researcher | done | studio/REFERENCE_RESEARCH.md (6 library refs, no new captures) |
| 3 Creative direction | creative-director | done | studio/CREATIVE_DIRECTION.md ("Centred by hand") |
| 4 Design spec | ui-ux-designer ∥ typography-spacing → gsap-animator | done | DESIGN_SPECIFICATION, TYPOGRAPHY_SYSTEM, SPACING_SYSTEM, ANIMATION_SPECIFICATION |
| 5 Architecture | frontend-engineer → tech-lead Gate A | done | TECHNICAL_ARCHITECTURE.md; Gate A PASS after C1–C3 |
| 6 Development | frontend ∥ ai-visual → typography (tokens) → CD critique r1 FIX FIRST → fixes → r2 PASS | done | studio/critique/layout-critique-r1/r2.md, layout-r2b-*.png |
| 7 Motion | lenis-scroll → gsap-animator → CD critique r1 (2 majors) → fixes → r2 PASS | done | critique/scroll-samples.json, motion-critique-r1/r2.md, motion-r2b-*.png |
| 8 Visual production | ai-visual-producer | done | studio/ASSET_MANIFEST.md (typographic/CSS only, 0 media) |
| 9 Testing | qa-engineer ∥ performance-engineer → fixes → tech-lead ruling → re-run | done | QA_REPORT.md, tests/results.json, PERFORMANCE_REPORT.md, THIRD_PARTY_NOTICES.md |
| 10 Final approval | creative-director ∥ tech-lead ∥ qa-engineer → fix loop → re-checks | done | studio/gateB/creative/VERDICT.md, QA_REPORT.md Gate B |

## Gates
| Gate | Reviewer | Verdict | Evidence |
|---|---|---|---|
| A · Architecture | tech-lead | PASS (r1 conditions C1–C3 closed) | /tmp/gateA_probe.js, /tmp/gateA2/probe5.js; ANIM_SPEC:14,25,40; TECH_ARCH:19,25,26 |
| B · Creative | creative-director | PASS (r1 PASS WITH NOTES → 3 notes fixed → re-check PASS) | studio/gateB/creative/VERDICT.md, film-*.png, recheck-*.png |
| B · Technical | tech-lead | PASS WITH NOTES (condition closed) | 63/63 own run from copy :8793; baselines newer than source; lede-only bbox; CTA 8→0; vendor sha256 = Gate A; JS 140.85/53.42 KiB, CSS 14.05/4.75 |
| B · QA | qa-engineer | PASS WITH NOTES (63/63 after copy-only re-baseline) | tests/results.json, tests/gateB/bbox.mjs, QA_REPORT.md |

## Open tasks
| Task | Owner | Blocked by |
|---|---|---|
| Confirm Lenis upstream copyright line in THIRD_PARTY_NOTICES.md before public deploy | orchestrator/tech-lead | network |
| Enable gzip/brotli on production host | deployer | hosting |
| Commit approved working tree (only vendor/ is committed) | user | approval |

## Handoffs (condensed; latest first)
- P10 final: Gate B 3/3 — CD PASS, TL PASS WITH NOTES, QA PASS WITH NOTES. Not tested: Lighthouse, real devices, Firefox/WebKit.
- P10 re-checks: CD PASS (contact h2 .7 at entry, glaze full while plate whole, copy approved); QA 63/63 (diff bbox = lede line only; tol 0.01%); TL CTA monotonic, sizes in budget.
- P10 r1 all PASS WITH NOTES (TL: .cta transition; QA: self-comparing baselines) → fix loop: GB1 frontend (.cta transition, dead CSS, "two potters"); GB2 gsap (contact top 100%, scrub end bottom 75%); GB3 qa (PORT, stored baselines, --update-baselines).
- P9: QA 57 checks, 1 FAIL (label-in-name) → fixed; perf LCP 772/132 ms, CLS 0, p95 frame 16.8 ms; caps revised by TL (comments overage, no-build); notices added.
- P8: manifest verified (7 same-origin requests, 0 image/font/media).
- P7: Lenis eased samples + reduced=native; motion r1 glaze read as pie → radial pool + eccentric rings; r2 PASS.
- P2–P5: refs, concept, specs; Gate A caught 3 spec defects. P6: layout r1 blocker (sticky plate over contact) → .plate-col wrapper; wordmark DejaVu-safe; r2 PASS.
