# Agent & skill validation (Claude Code)

This report covers the **plugin itself**. Website results are in VALIDATION-REPORT.md part B. Every row was executed in this environment: Claude Code 2.1.325, Linux, plugin installed from the local marketplace (`claude plugin marketplace add ./` + `claude plugin install premium-web-studio@premium-web-studio-marketplace`).

Status vocabulary: **PASS** (executed, evidence linked) · **FAIL** · **NOT TESTED** · **BLOCKED**.

## 1. Loading, recognition, installation

| Check | Method | Result | Evidence |
|---|---|---|---|
| Manifests valid | `claude plugin validate` (plugin + marketplace) | PASS | `tests/validate.py` |
| Install via marketplace (user scope) | `claude plugin install …` → `claude plugin list` shows enabled 1.0.0 | PASS | session log; `claude plugin list` |
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

See §3 detail below (filled in from the Run B transcript).

## 4. Scripts, templates, referenced files

| Check | Result | Evidence |
|---|---|---|
| `tests/skill-scripts.sh`: **executes** all 12 bundled scripts with assertions (init-project, contrast, type-scale math, library search/stale/build determinism, live capture of a served page, providers check + BLOCKED path, AVIF/WebP optimisation incl. no-upscale + magic bytes, H.264/VP9/AV1 encode via ffprobe, lighthouse usage, install/uninstall, template drift, validator) | **21/21 PASS** | run log in VALIDATION-REPORT |
| `tests/validate.py`: 173 structural checks (frontmatter fields, name/dir match, description length, tool names, models, every path referenced in a SKILL.md exists, script syntax, template drift, index freshness, secrets scan, `claude plugin validate`) | 173/173 PASS (necessary, **not** sufficient on its own) | — |
| Templates = tested code | 23 files byte-identical to the demo exercised by the 49-test suite (`sync-templates.sh --check`) | PASS |
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
