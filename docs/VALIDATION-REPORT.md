# Validation report

Status vocabulary: **PASS** (executed here, evidence linked) · **FAIL** · **PARTIAL** · **NOT TESTED** · **BLOCKED** (cannot run without something this environment lacks). Nothing in this file is inferred from files merely existing.

Environment: Linux container, Claude Code 2.1.325, Node 22, Playwright 1.63 with Chromium only, WebGL through SwiftShader (software rendering, no GPU), Lighthouse 13.6, ffmpeg with x264/VP9/SVT-AV1.

- **Part A** – the Claude Code plugin (the product).
- **Part B** – the demo website used to exercise it.
- **Part C** – known limitations and open issues.

---

## Part A · Claude Code plugin

Full detail, per-agent tables and transcripts: [AGENT-VALIDATION.md](AGENT-VALIDATION.md).

### A.1 Installation and discovery
| Check | Result | Evidence |
|---|---|---|
| `claude plugin validate` on plugin and marketplace | PASS | `tests/validate.py` |
| Marketplace install, user scope; `claude plugin list` shows it enabled | PASS | AGENT-VALIDATION §1 |
| Fresh session lists all 12 `premium-web-studio:*` agents and 10 skills | PASS | [evidence/discovery.txt](evidence/discovery.txt) |
| Available from unrelated projects (two separate temp repos) | PASS | [evidence/agent-rollcall.md](evidence/agent-rollcall.md), AGENT-VALIDATION §3 |
| Project-scope install via `install.sh --project`: a fresh `claude -p` in a third temp repo listed the unprefixed agents and skills | PASS | AGENT-VALIDATION §1 (session log, not saved as a file) |
| Installer keeps existing user files; `--uninstall` removes only its own | PASS | `tests/skill-scripts.sh` |
| Upload to claude.ai, Windows/macOS install | NOT TESTED | — |

### A.2 Agents, delegation, model selection
| Check | Result | Evidence |
|---|---|---|
| Real delegation to all 12 agents from an unrelated project; each loaded its own skill, answered correctly and returned a HANDOFF block | PASS (12/12) | [evidence/agent-rollcall.md](evidence/agent-rollcall.md) |
| Frontmatter models honoured (3 opus: creative-director, webgl-specialist, tech-lead; 9 sonnet) | PASS | same transcript |
| Failure handling: ai-visual-producer without a key returns BLOCKED (exit 3), writes no file | PASS | same; [evidence/ai-providers-check.txt](evidence/ai-providers-check.txt) |
| Gatekeeper discipline: tech-lead asked to edit a file declined; file byte-identical | PASS | same |

### A.3 Ten-phase orchestration (fresh project)
| Check | Result | Evidence |
|---|---|---|
| All ten phases ran through the correct specialists | PASS | [evidence/ten-phase-run/](evidence/ten-phase-run/) |
| Handoffs | PASS (40/40 delegations returned HANDOFF) | AGENT-VALIDATION §3 |
| Gate A enforced (FAIL ×3 → PASS on round 4) | PASS | `ten-phase-run/studio/PROJECT_STATUS.md` |
| Gate B: round 1 tech FAIL; round 2 creative PASS, QA PASS (56/0, re-run by the tech-lead), **tech FAIL** (axe scan skipped) | enforced correctly | `ten-phase-run/gate-b-verdicts/` |
| Run 1 reaches a full Gate B pass | PARTIAL: stopped by the account's 5-hour usage limit after round 2 (exit 124) | `verdict-technical-r2.FROM-TRANSCRIPT.md` |
| **Run 2 (fresh project, same prompt, 2026-11-17) reaches a full Gate B pass** | **PASS.** All ten phases through the right specialists; Gate A PASS after conditions C1–C3; the new render-critique loop ran (layout r1/r2, motion r1/r2) and caught real defects; Gate B creative PASS, technical PASS with notes, QA PASS with notes (63/63 checks). Interrupted once by the usage limit in phase 9 and resumed in the same session (`--resume`), exit 0 | [evidence/ten-phase-run-2/](evidence/ten-phase-run-2/RUN-SUMMARY.md) |

### A.4 Scripts, templates, structure
| Check | Result | Evidence |
|---|---|---|
| `tests/skill-scripts.sh` executes all 10 skill scripts, the `ImageSequence.js` helper and the repo tooling with assertions | PASS (23/23) | [evidence/skill-scripts-run.log](evidence/skill-scripts-run.log) |
| `tests/validate.py` structural checks | PASS (173/173) — see the finalization re-run below | — |
| Skill templates byte-identical to the tested demo (`sync-templates.sh --check`) | **FAIL at `4ebc866`** (router template drifted, S9) → fixed and PASS in the finalization commit | [BUGS-FIXES.md](BUGS-FIXES.md) S9 |
| Skill evals (with vs without skill) | web-studio 8/8 vs 5/8; lenis-scroll 9/9 vs 8/9 (iteration 2) | AGENT-VALIDATION §5, `eval-workspaces/` |

---

## Part B · Demo website (Penumbra)

Production build (static prerender + route-matched hydration), served by `vite preview`, Chromium with SwiftShader.

### B.1 Playwright suite (functional, scroll/motion, responsive, accessibility, resilience, contrast, visual)
| Run | Commit | Result | Evidence |
|---|---|---|---|
| Before the font and router changes | `486c933` | PASS 49/49, 0 flaky | [evidence/playwright-final.json](evidence/playwright-final.json) |
| Finalization re-run 1 (fonts + router changed since) | `ea8d6e9` | **FAIL 45/49**: 4 visual baselines. The 390 px Hour intent grew 28 px with "was." alone on a third line (real regression, W24); 3 others glyph-only (mono 500 → 400 face, same size and layout) | `/tmp` log, summarised in [BUGS-FIXES.md](BUGS-FIXES.md) W24 |
| Finalization re-run 2, after the W24 fix and regenerating the 4 changed baselines | `c38f050` + baselines | **PASS 49/49**, 0 flaky, 0 skipped | [evidence/playwright-finalization.json](evidence/playwright-finalization.json), [run log](evidence/playwright-finalization-run.log) |
| **Final state after Gate B round 2** (axe at 3 widths, header-over-hero contrast guard, deterministic Lenis sync test, title assertions) | `7d51f1e` | **PASS 56/56**, 0 flaky, 0 skipped | [evidence/playwright-gate-b-r2.json](evidence/playwright-gate-b-r2.json) |

Covered by the suite: routing, back/forward restore, anchor offsets, mobile menu focus trap and scroll lock, Flip filter, The Hour presets and keyboard, Lenis/ScrollTrigger sync, pinned Method sequence, route-change leak test (renderer and tween counts), reduced motion, 6-width responsive matrix, axe (WCAG 2.2 AA, 0 serious/critical) on home and detail at 1440/768/390, header-link contrast over the project heroes at 1024/1440/1920, per-page titles, keyboard order, fonts/images blocked, no-WebGL fallback, hero text contrast at 8 viewports, 12 visual baselines (0.1 % tolerance).

### B.2 Hero contrast (axe cannot read pixels under a WebGL canvas)
Worst pixel under each line's glyph rectangles, measured from screenshots: kicker and sub ≥ 4.5:1 and H1 ≥ 3:1 at 360, 390, 430, 768, 1024×768, 1366×768, 1440 and 1920: **PASS**. Landscape H1 ≥ 11.5:1, mobile ≥ 13.2:1 (W14, W20).

### B.3 Lighthouse (median of 3, quiet host) – measured **before** the font change, at `486c933`
| Profile | Perf | A11y | BP | SEO | LCP | CLS | TBT | Status |
|---|---|---|---|---|---|---|---|---|
| Mobile, WebGL on (SwiftShader) | 69 | 97 | 100 | 100 | 763 ms | 0 | 4,471 ms | TBT informational: software GL |
| Mobile, WebGL off (`--disable-3d-apis`) — the gating number | 98 | — | — | — | 756 ms | 0 | **152 ms** (157/120/152) | PASS (budget ≤ 200 ms) |
| Desktop, WebGL on | 71 | 97 | 100 | 100 | 209 ms | 0 | 920 ms | TBT informational |

Budget: LCP ≤ 2.5 s PASS · CLS ≤ 0.05 PASS · TBT ≤ 200 ms PASS with WebGL off; **with software WebGL it fails**, and real-GPU cost is NOT TESTED. Raw numbers: [evidence/lighthouse-486c933.txt](evidence/lighthouse-486c933.txt).

**Re-measured after the font change (W23/W24), WebGL off, mobile:** LCP 754–766 ms, CLS 0, fonts 212,608 B: PASS. TBT is noisy on this host (the container restarted between the two measurements). Right after the suite, two series gave medians 343 and 258 ms. An interleaved A/B on the same host then gave **old build 170.5 ms vs new build 198.5 ms** (ranges 155–192 vs 165–218 overlap). Verdict: **TBT PASS, marginal** (198.5 ≤ 200 ms). There is no clear regression from the font change, but there is no headroom either. Evidence: [evidence/lighthouse-finalization.txt](evidence/lighthouse-finalization.txt).

### B.4 Weight
| Item | Budget | Measured | Status |
|---|---|---|---|
| First-load fonts | ≤ 220 KB | 347–355 KB at `486c933` → **212,608 B** after W23 (four files, same at 390 and 1440; preloads match downloads; confirmed by Lighthouse on the final build) | PASS after fix |
| Initial JS | ≤ 170 KB gz | 152 KB transferred | PASS |

### B.5 Static-host build (`VITE_MEMORY_ROUTER=1`, used for the hosted preview)
Served from a nested sub-path at 1440×900 and 390×844: 0 failed requests, 0 console errors; project page opens; logo and browser Back return home: **PASS**. The default build does not use this mode; it is covered by the B.1 re-run.

### B.6 Independent reviews of the demo
| Review | Result |
|---|---|
| Gate A (tech-lead) | CHANGES REQUIRED → fixes A1–A3 applied |
| Gate B round 1: creative-director, tech-lead, qa-engineer | FAIL / CHANGES REQUIRED / CONDITIONAL → fix wave (W4–W19), all re-tested by the suite |
| **Gate B round 2 on the finished demo** (2026-11-17, three independent reviewers) | Creative: PASS (0 blockers, 2 majors) → both majors fixed and **closed by the reviewer** (detail-hero crops incl. wide renders for Capela/Museu; The Hour exposure). QA: FAIL on one intermittent test → root cause found (frame starvation on a shared host), test made deterministic; final suite 56/56. Technical: code correct; FAIL on stale evidence counts and an in-progress tree → evidence regenerated at the final commit, docs reconciled, tree clean and templates in sync. Details: [BUGS-FIXES.md](BUGS-FIXES.md) W34–W41, S12–S14 |

---

## Part C · Known limitations and open issues

| Item | Status | Detail |
|---|---|---|
| **Detail→Home navigation long tasks** | OPEN | 161–754 ms main-thread tasks, all inside the hero canvas's `getContext('webgl2')` under SwiftShader. Home→Detail is 69 ms. Software GL compiles shaders on the CPU, so this probably overstates a real GPU, but that is an inference: **real-GPU trace NOT TESTED**. Candidate fix if it reproduces on hardware: keep the hero context alive across routes, or create it after the route-in transition. |
| Software-rendered WebGL | LIMITATION | Every WebGL timing (TBT with WebGL on, route-change tasks, frame cost) comes from SwiftShader. These numbers bound CPU cost, not real-device GPU cost. |
| Firefox, Safari/WebKit | NOT TESTED | only Chromium is installed |
| Real phones, real GPUs, real-user INP | NOT TESTED | TBT is the lab proxy |
| AI image/video generation | BLOCKED | needs a free Hugging Face token or a local GPU; demo assets are shader-rendered instead ([evidence/ai-generation-attempt.txt](evidence/ai-generation-attempt.txt)) |
| 21st.dev MCP | BLOCKED | needs an API key |
| Ten-phase run to a full Gate B pass | PASS (run 2) | A.3 |
| Demo Gate B round 2 | DONE: majors closed, evidence reconciled | B.6 |
| Mono labels at weight 500 now render with the 400 face | ACCEPTED trade-off | keeps fonts under budget; creative sign-off not obtained |
| Mobile TBT headroom (WebGL off) | MARGINAL / host-dependent | 198.5 ms median on 2026-11-16; on 2026-11-17 the host benchmarked ~16 % slower and both the original and the current build measured ~274–288 ms (interleaved A/B: no regression from the Gate B fixes). Needs a quiet, fixed host or a real phone to settle ([evidence/lighthouse-gate-b-r2.txt](evidence/lighthouse-gate-b-r2.txt)) |
| Italic intent at 360–390 px now three lines (was two) | ACCEPTED | wider static italic; no single-word last line (W24) |
| Agent-team mode, Cowork, claude.ai upload | NOT TESTED | AGENT-VALIDATION §6 |

---

## Part D · Design-first upgrade (2026-11-17)

### D.1 Rendered website (visual results)
| Check | Result | Evidence |
|---|---|---|
| Independent rubric critique r1 of the built demo (390/768/1024/1440 + filmstrip) | FAIL: 4 majors, 12 minors (3 majors at 768, never checked by earlier reviews) | [evidence/design-critique/critique-r1.md](evidence/design-critique/critique-r1.md) |
| Blind re-critique r2 after fixes (same prompt, rubric and widths) | PASS (conditional): none of r1's 4 majors reported again; 2 new majors in older, untouched code | [critique-r2.md](evidence/design-critique/critique-r2.md) |
| r2 majors fixed (Method drawing label size and placement) | PASS by measurement (11.6 px at 1024; no text overlaps 390–1920, both motion modes). No r3 critique was run | [BUGS-FIXES](BUGS-FIXES.md) W32, W33 |
| Before/after screenshots at identical widths and scroll positions | 8 comparisons | [evidence/design-critique/](evidence/design-critique/README.md) |
| Full demo suite on the design-upgrade state (`0fe7c42`) | PASS 49/49, 0 flaky (superseded by B.1's 56/56 at `7d51f1e`) | [evidence/playwright-design-upgrade.json](evidence/playwright-design-upgrade.json) |
| The plugin produces better *new* websites | **NOT TESTED**: the loop improved one existing site; no new site was built with and without the upgrade | — |

### D.2 Plugin and tooling (code-quality changes, not visual results by themselves)
| Check | Result | Evidence |
|---|---|---|
| `capture-reference.mjs` defaults unchanged (no flags → same 4 files, no new keys) | PASS | `tests/skill-scripts.sh` |
| `--filmstrip N` samples the whole page, detects a pinned scene; `--tablet` adds 768×1024 / 1024×768 | PASS (local fixture); on the demo, 12 frames reached the end of 14,071 px | `tests/skill-scripts.sh`, design-critique README |
| `--filmstrip` on 19 live sites | 12 sampled end to end; 7 did not scroll under wheel input (virtual scrollers, gates). Documented as a blind spot | reference-library entries |
| Image-sequence recipe run as documented (frames → `optimize-images.mjs` 640/320 → `imageSequence()`) | PASS: desktop 48 × 640 w frames 0→24→47; mobile 24 × 320 w 0→12→23; reduced motion 1 still, no pin; cleanup 0 triggers. React wrapper, Safari/Firefox: NOT TESTED | `tests/skill-scripts.sh` |
| `tests/skill-scripts.sh` | PASS 23/23 | [evidence/skill-scripts-run.log](evidence/skill-scripts-run.log) |
| `tests/validate.py` | PASS 173/173 | — |
| Award examples dated 2025–2026 | 6 Awwwards Site of the Day, Nov 9–15 2026, quoted verbatim from each site's Awwwards page | reference-library entries tagged `awwwards-sotd-2026` |
