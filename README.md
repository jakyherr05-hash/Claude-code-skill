# Premium Web Studio for Claude Code

A Claude Code **plugin** that runs website production like a small senior digital agency. An orchestrator skill delegates to **12 specialist agents**, which draw on **10 skills**, a **researched reference library** and **tested templates** for GSAP, Lenis and WebGL. Each agent works from shared project documents and must back every PASS with evidence before a gate opens.

```bash
claude plugin marketplace add jakyherr05-hash/claude-code-skill
claude plugin install premium-web-studio@premium-web-studio-marketplace
```
Then describe your project, e.g. *"Build a launch page for our €6k carbon e-bike — engineered and calm, not sporty."* Other install methods (user/project scope copy, cloud sessions, claude.ai) are in [docs/INSTALL.md](docs/INSTALL.md).

## What's inside
| Path | What |
|---|---|
| `plugins/premium-web-studio/skills/web-studio/` | **Orchestrator**: tracks (spot/sprint/full), 10 phases, Gates A/B, delegation and HANDOFF protocol, `studio/` doc templates + `init-project.sh` |
| `plugins/premium-web-studio/agents/` | **12 agents**: creative-director, reference-researcher, ui-ux-designer, typography-spacing, gsap-animator, lenis-scroll, webgl-specialist, ai-visual-producer, frontend-engineer, performance-engineer, qa-engineer, tech-lead |
| `…/skills/design-intelligence/` | 14 design languages, industry playbooks, visual + motion systems, WCAG contrast script |
| `…/skills/typography-system/` | Licence-verified font library (Fontsource OFL, Fontshare ITF FFL), pairings, fluid `clamp()` scale generator, grid/spacing |
| `…/skills/gsap-motion/` | GSAP 3.15 architecture: registry, tokens, SplitText "lit" primitive, React lifecycle rules, 14 recipes, tested examples (pinned sequence, Flip filter, quickTo interactive, page transition) |
| `…/skills/lenis-scroll/` | One Lenis 1.3 instance on `gsap.ticker`, anchors with focus, scroll lock, restoration (tested template) |
| `…/skills/webgl-three/` | When 3D is worth it; raw WebGL2 light renderer + React wrapper; Three.js stage with full disposal (tested) |
| `…/skills/ai-visual-pipeline/` | Provider registry with licences checked against the HF model API, `providers.py` (check/generate, honest BLOCKED), AVIF/WebP optimiser, H.264/VP9/AV1 encoder |
| `…/skills/reference-study/` | Playwright capture tool that measures a live site (fonts, stack, scroll smoothing, timings) |
| `…/skills/reference-library/` | **25 researched sites** with [M]/[O]/[I]/[?]-labelled reports, evidence screenshots and a search CLI |
| `…/skills/web-qa/` | Playwright suite template, Lighthouse runner, scroll-jank probe, QA report template |
| `demo/` | **Penumbra**, a fictional lighting atelier site built by the agents, with its `studio/` docs and a 39-test Playwright suite |
| `docs/` | Install, usage, orchestration, tool registry, known limitations, **verification report**, evidence |
| `tests/validate.py` | 173 structural checks: manifests, frontmatter, references, scripts, template drift, secrets |
| `eval-workspaces/` | skill-creator evaluation runs (with vs. without skill), graded, plus review viewers |

## Verification
See **[docs/VERIFICATION_REPORT.md](docs/VERIFICATION_REPORT.md)**: every capability is marked PASS, FAIL, NOT TESTED or BLOCKED, with the evidence for each. In summary, plugin install and agent/skill discovery were verified in a fresh Claude Code session, along with real agent delegation, the demo's full Playwright suite, visual regression, Lighthouse, and three independent Gate B reviews. AI image/video **generation** is BLOCKED without a free Hugging Face token or a GPU. See [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).

## Licences
Code in this repository: MIT. Third-party libraries keep their own licences (GSAP: Standard "no charge" licence; Lenis, React, Three.js: MIT; fonts: OFL-1.1). Reference-library screenshots are downsized captures of third-party sites, kept for internal design study only. Don't redistribute them or ship them in products.
