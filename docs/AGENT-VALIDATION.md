# Agent & skill validation (Claude Code)

This report covers the **plugin itself**. Website results are in VALIDATION-REPORT.md part B. Every row was executed in this environment: Claude Code 2.1.325, Linux, plugin installed from the local marketplace (`claude plugin marketplace add ./` + `claude plugin install premium-web-studio@premium-web-studio-marketplace`).

Status vocabulary: **PASS** (executed, evidence linked) · **FAIL** · **NOT TESTED** · **BLOCKED**.

## 1. Loading, recognition, installation

| Check | Method | Result | Evidence |
|---|---|---|---|
| Manifests valid | `claude plugin validate` (plugin + marketplace) | PASS | `tests/validate.py` |
| Install via marketplace (user scope) | `claude plugin install …` → `claude plugin list` shows enabled 1.0.0 | PASS | session log; `claude plugin list` |
| Install from GitHub exactly as the README says (`claude plugin marketplace add jakyherr05-hash/claude-code-skill` + `plugin install`), isolated `CLAUDE_CONFIG_DIR` | PASS: cloned the pushed commit `0fe7c42`; a fresh session in a new repo listed all 12 agents and 10 skills | [evidence/github-install.txt](evidence/github-install.txt) |
| Discovery in a fresh session | `claude -p` lists all 12 `premium-web-studio:*` agents and 10 skills | PASS | `docs/evidence/discovery.txt` |
| Global availability across separate projects | Roll call run from an unrelated temp git repo (`projA`), and the ten-phase run from another (`projB`) | PASS | `docs/evidence/agent-rollcall.md`, §3 |
| Alternative install: project scope via `install.sh --project` | Fresh `claude -p` in a third temp repo (`projC`) lists the unprefixed agents and skills | PASS | session log (see VALIDATION-REPORT A.1) |
| Installer safety | `tests/skill-scripts.sh`: keeps the user's existing agent, `--uninstall` removes only its own files; `--force` backs up (earlier test) | PASS | `tests/skill-scripts.sh` |
| claude.ai upload compatibility | Frontmatter limited to Agent-Skills spec fields (`validate.py`) | PASS (static) / upload NOT TESTED | `tests/validate.py` |

## 2. Every agent: delegation, skill loading, model selection, handoff, failure handling

One headless session in an unrelated project delegated 12 micro-tasks **in parallel**. Each could only be answered correctly from the agent's own skill. The table below is read from the stream-json transcript, not from the model's summary.

| Agent | Model served (frontmatter) | Skill loaded via Skill tool | Answer correct? | HANDOFF |
|---|---|---|---|---|
| creative-director | claude-opus-5-5 (opus) | design-intelligence | yes: Minimalist + an accent language, with reasons | yes |
| reference-researcher | sonnet | reference-library, and **ran** `library.py search` | yes: top slug `lenis`, high confidence | yes |
| ui-ux-designer | sonnet | design-intelligence | yes: all 8 required states | yes |
| typography-spacing | sonnet | typography-system, and **ran** `type-scale.mjs` | yes: exact clamp() | yes |
| gsap-animator | sonnet | gsap-motion | yes: useGSAP scope; reverts tweens, ScrollTriggers, SplitText, matchMedia | yes |
| lenis-scroll | sonnet | lenis-scroll | yes: double-counted offset → keep CSS and drop the JS offset (the iteration-2 rule) | yes |
| webgl-specialist | claude-opus-5-5 (opus) | webgl-three | yes: raw WebGL2, with the reason | yes |
| ai-visual-producer | sonnet | ai-visual-pipeline, and **ran** `providers.py check` + `image` | yes: **exit 3, BLOCKED** (no key); no file written | yes |
| frontend-engineer | sonnet | gsap-motion, lenis-scroll | yes: Vite+React+TS default; Next.js for SSR/SEO/CMS | yes |
| performance-engineer | sonnet | web-qa | yes: TBT as the labelled lab proxy for INP | yes |
| qa-engineer | sonnet | web-qa | yes: 360/390/768/1024/1440/1920 | yes |
| tech-lead | claude-opus-5-5 (opus) | none (its body names none) | asked to *fix* a typo → **declined**; NOTES.md byte-identical afterwards | yes |

Result: **12/12 PASS**. Frontmatter `model` values were honoured exactly (3 opus, 9 sonnet). This is the token-efficiency design working as specified: judgement-heavy roles on opus, the rest on sonnet. Evidence: `docs/evidence/agent-rollcall.md`; prompt: `tests/agent-rollcall.prompt.txt` (re-runnable).

Earlier single-agent test: the main session delegated to `typography-spacing`, which loaded `typography-system` via the Skill tool and ran the bundled script from the plugin path (`docs/evidence/delegation.md`).

## 3. Orchestration through all ten phases (fresh project, headless)

`claude -p "/premium-web-studio:web-studio <brief>"` in an unrelated temp repo (prompt: `tests/ten-phase.prompt.txt`). The brief was a fictional ceramics studio, one page, no build step, local GSAP/Lenis copies. The main session was sonnet; specialists used their frontmatter models. Evidence: `docs/evidence/ten-phase-run/` (all 13 studio docs + Gate B verdict files).

| Phase | Who ran it (from the transcript) | Outcome | Evidence |
|---|---|---|---|
| 1 Discovery | orchestrator (no questions, as instructed; assumptions recorded) | done | `studio/PROJECT_BRIEF.md` |
| 2 Research | reference-researcher (library only, as instructed) | done; stated honestly that the library had no ceramics references | `REFERENCE_RESEARCH.md` |
| 3 Creative direction | creative-director (opus) | done | `CREATIVE_DIRECTION.md` |
| 4 Design spec | ui-ux-designer ∥ typography-spacing (parallel), then gsap-animator | done | `DESIGN_SPECIFICATION.md`, `TYPOGRAPHY_SYSTEM.md`, `SPACING_SYSTEM.md`, `ANIMATION_SPECIFICATION.md` |
| 5 Architecture + **Gate A** | frontend-engineer; tech-lead (opus) | **Gate A failed 3 times** (TA-1..8, R2-1..6, R2-3/5b); owners revised each time; **PASS on round 4** | `TECHNICAL_ARCHITECTURE.md`, `DECISIONS.md`, `PROJECT_STATUS.md` |
| 6 Development | frontend-engineer, ai-visual-producer, typography-spacing (tokens) | done: `index.html`, `styles.css`, `main.js` | project files |
| 7 Motion | lenis-scroll → gsap-animator, then frontend fixes | done | `evidence/phase7*` |
| 8 Visual production | ai-visual-producer (typographic/CSS assets, as briefed) | done | `ASSET_MANIFEST.md` |
| 9 Testing | qa-engineer ∥ performance-engineer; QA wrote `tests/qa-run.mjs` and **ran Chromium** at 390/1440 | done: 44 → 56 checks, all PASS; QA also fixed its own test-timing defect | `QA_REPORT.md`, `PERFORMANCE_REPORT.md`, `tests/qa-results.json` |
| 10 **Gate B** | creative-director ∥ tech-lead ∥ qa-engineer, independently | Round 1: creative PASS (1 major), QA PASS, **technical FAIL** (evidence gaps) → fixes → Round 2: creative **PASS**, QA **PASS**, technical **FAIL** (the axe scan was reported impossible, but tooling exists). The tech-lead **re-ran QA's suite itself** (56/0) rather than trusting the report | `gate-b-verdicts/*` |

**Outcome: PARTIAL.** Every phase executed through the right specialists, with **40 delegations, all 40 returning a HANDOFF block**. Parallelism followed the ownership rules, and both gates enforced quality through real FAIL→fix loops (Gate A three times, Gate B twice). The run **stopped before completion**: the account hit its 5-hour usage limit ("resets 9:10am UTC") after the Gate B round-2 verdicts, so the orchestrator never routed the final tech-lead item. The run then hit my 60-minute timeout (exit 124). The mini-site therefore did **not** reach a full Gate B pass in this run.

**Run 2 (2026-11-17, fresh project "Halde", same prompt): PASS.** All ten phases ran through the right specialists, including the new render → critique → refine loop (layout critique r1/r2, motion critique r1/r2, which caught a pinned plate covering the contact button and a pie-chart glaze). Gate A passed after three conditions; Gate B: creative PASS, technical PASS with notes, QA PASS with notes (63/63 checks, axe 0 violations, LCP 772 ms throttled mobile). The account usage limit interrupted phase 9 once; the run was resumed in the same session with `claude -p --resume` and finished with exit 0. Evidence: [evidence/ten-phase-run-2/](evidence/ten-phase-run-2/RUN-SUMMARY.md) (studio docs, critiques, Gate B verdict, site files).

Observations for users (not skill defects):
- With a narrow `--allowedTools` such as `Bash(node:*)`, the tech-lead's compound commands (`cd … && node …`) were denied, and it reproduced partly with Read/Glob. Grant the commands reviewers need, or run interactively.
- Long full-production runs are token-heavy (40 delegations for a one-page site). Use the Sprint or Spot tracks for small jobs, as the skill instructs.

## 4. Scripts, templates, referenced files

| Check | Result | Evidence |
|---|---|---|
| `tests/skill-scripts.sh`: **executes** all 10 skill scripts plus the tested `ImageSequence.js` helper and the repo tooling, with assertions (init-project, contrast, type-scale math, library search/stale/build determinism, live capture of a served page incl. `--filmstrip`/`--tablet` and unchanged defaults, providers check + BLOCKED path, AVIF/WebP optimisation incl. no-upscale + magic bytes, image sequence via the optimiser, H.264/VP9/AV1 encode via ffprobe, lighthouse usage, install/uninstall, template drift, validator) | **23/23 PASS** (was 21/21 before the design-first checks were added) | [evidence/skill-scripts-run.log](evidence/skill-scripts-run.log) |
| `tests/validate.py`: 173 structural checks (frontmatter fields, name/dir match, description length, tool names, models, every path referenced in a SKILL.md exists, script syntax, template drift, index freshness, secrets scan, `claude plugin validate`) | 173/173 PASS (necessary, **not** sufficient on its own) | — |
| Templates = tested code | 23 files byte-identical to the demo exercised by the 57-test suite (`sync-templates.sh --check`) | PASS |
| `lighthouse.sh`, `scroll-probe.mjs` used for real | Run by performance-engineer on the demo | PASS (PERFORMANCE_REPORT) |
| `capture-reference.mjs` on live sites | 25 sites captured; 3 blocked sites correctly marked `blocked` | PASS |

## 5. Skill quality evals (skill-creator method, with vs. without skill)

| Skill | Iteration | With skill | Without | Note |
|---|---|---|---|---|
| web-studio (sprint direction + type system) | 1 | 8/8 | 5/8 | Baseline's contrast ratios were wrong when re-measured; licences unverified |
| lenis-scroll | 1 | 8/9 | 8/9 | Both failed the anchor offset at **runtime** (144/216 px) → skill fixed |
| lenis-scroll | 2 | **9/9** | 8/9 | With skill lands at exactly 72 px; baseline repeats the double-count |

Graders' runtime checks used Playwright on Vite builds of each output. Viewers: `eval-workspaces/*.html`. One run per configuration, so there is no variance estimate.

## 6. Limits of this validation
- Agent-team mode, Cowork and claude.ai upload: NOT TESTED.
- Windows/macOS install paths: NOT TESTED (Linux only).
- Long-term behaviour across many real projects: NOT TESTED; the eval set is small (2 skills, 1 case each).
