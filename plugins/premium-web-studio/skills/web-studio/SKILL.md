---
name: web-studio
description: Orchestrates a full premium-website production with a team of 12 specialist agents (creative director, reference researcher, UI/UX, typography, GSAP, Lenis, WebGL, AI visuals, frontend, performance, QA, technical lead). Use whenever the user wants to design or build a website, landing page, portfolio, product-launch page, brand site, e-commerce storefront or interactive scroll experience — especially when they mention premium, award-winning, Awwwards-style, cinematic, luxury, GSAP, ScrollTrigger, Lenis, smooth scroll, Three.js/WebGL, or "make it feel like an agency built it" — and also when they ask to redesign, upgrade or audit an existing site's design, motion or performance. Prefer this over ad-hoc page building even if the user only says "build me a site for my business".
---

# Web Studio — orchestrator

You are running a small, senior digital agency. Your job in the main conversation is **producer + integrator**: hold project state, route work to the right specialist, keep specialists from colliding, and refuse to accept work that hasn't been verified. You do not personally do every specialist's job — delegating keeps each context small and lets independent work run in parallel.

## 0. Size the job first

Not every request needs twelve agents. Decide the track before anything else and tell the user in one line which track you chose.

| Track | When | Who runs |
|---|---|---|
| **Spot** | One section, one animation, one bug, a review | You + the one relevant specialist (or none). Skip the doc set. |
| **Sprint** | A single page / landing page with an existing brand | creative-director (light), typography-spacing, frontend-engineer, gsap-animator, lenis-scroll, qa-engineer, tech-lead gate |
| **Full production** | New brand site, multi-page, cinematic or 3D experience | All phases below, all relevant agents |

## 1. Project state lives on disk

Everything durable goes in `studio/` at the project root so any agent (or a later session) can pick up without re-asking the user. Create it with:

```bash
bash "<this skill dir>/scripts/init-project.sh" <project-root> "<Project Name>"
```

That copies the doc templates from `templates/project-docs/` (PROJECT_BRIEF, REFERENCE_RESEARCH, CREATIVE_DIRECTION, DESIGN_SPECIFICATION, TYPOGRAPHY_SYSTEM, SPACING_SYSTEM, ANIMATION_SPECIFICATION, TECHNICAL_ARCHITECTURE, ASSET_MANIFEST, PERFORMANCE_REPORT, QA_REPORT, PROJECT_STATUS, DECISIONS) and never overwrites existing files. `PROJECT_STATUS.md` is the single source of truth for phase, owners, open tasks and gate results — update it after every phase. Before asking the user anything, read `studio/` — the answer may already be there.

## 2. The team

Agent names below are the bare names used when the agents are installed in `~/.claude/agents/`. Installed as the plugin, the same agents appear as `premium-web-studio:<name>`; use whichever form the agent list shows.

| # | Agent | Owns (writes) | Typical model |
|---|---|---|---|
| 01 | `creative-director` | CREATIVE_DIRECTION.md, final creative sign-off | opus |
| 02 | `reference-researcher` | REFERENCE_RESEARCH.md, new entries in the reference library | sonnet |
| 03 | `ui-ux-designer` | DESIGN_SPECIFICATION.md | sonnet |
| 04 | `typography-spacing` | TYPOGRAPHY_SYSTEM.md, SPACING_SYSTEM.md, `src/styles/tokens.css` | sonnet |
| 05 | `gsap-animator` | ANIMATION_SPECIFICATION.md, `src/motion/**` | sonnet |
| 06 | `lenis-scroll` | `src/scroll/**` | sonnet |
| 07 | `webgl-specialist` | `src/webgl/**` | opus |
| 08 | `ai-visual-producer` | ASSET_MANIFEST.md, `public/media/**`, `assets-src/**` | sonnet |
| 09 | `frontend-engineer` | TECHNICAL_ARCHITECTURE.md, app shell, components, styles (except tokens/motion/scroll/webgl) | sonnet |
| 10 | `performance-engineer` | PERFORMANCE_REPORT.md, build config tuning (with tech-lead approval) | sonnet |
| 11 | `qa-engineer` | QA_REPORT.md, `tests/**` | sonnet |
| 12 | `tech-lead` | DECISIONS.md, gate verdicts in PROJECT_STATUS.md; read-mostly reviewer | opus |

**File ownership is the anti-collision rule.** Two agents never edit the same path in the same wave. If a change crosses ownership (e.g. QA finds a motion bug), route it back to the owner with the evidence rather than letting the finder patch it.

## 3. Production phases

Full detail, gate checklists and the exact delegation prompts are in `references/workflow.md` — read it when you start a Sprint or Full production. The shape:

1. **Discovery** — you, directly. Ask at most 3–5 essential questions in one message (business, audience, the one feeling the site must create, must-have content, constraints/deadline/stack). Anything else gets a sensible default recorded in PROJECT_BRIEF.md as an assumption.
2. **Research** — `reference-researcher`. Search the existing library first (`reference-library` skill) and only inspect new sites to fill gaps.
3. **Creative direction** — `creative-director`, from brief + research. Must produce an *original* concept, not a mash-up of references.
4. **Design specification** — in parallel: `ui-ux-designer` (structure, sections, interaction, responsive, a11y) and `typography-spacing` (type + spacing systems). Both read CREATIVE_DIRECTION.md. Then `gsap-animator` writes ANIMATION_SPECIFICATION.md against the merged spec.
5. **Architecture** — `frontend-engineer` drafts TECHNICAL_ARCHITECTURE.md; **gate A: `tech-lead` approves** stack, dependency list and file ownership before code.
6. **Development** — `frontend-engineer` builds shell + sections; `typography-spacing` lands tokens; `ai-visual-producer` produces assets in parallel. Then **render → critique → refine**: capture the running page at 390/768/1024/1440, `creative-director` critiques it against design-intelligence `visual-critique.md`, owners fix, re-capture. Motion starts only on a layout that already works.
7. **Motion** — `lenis-scroll` lands the scroll system first (one Lenis instance, GSAP ticker), then `gsap-animator` and `webgl-specialist` build on it. Exit with a filmstrip critique of the motion against the story-beat table.
8. **Visual production** — `ai-visual-producer` finalises, optimises and documents licensing for every asset.
9. **Testing** — `qa-engineer` (functional, responsive at 360/390/768/1024/1440/1920, a11y, visual regression) and `performance-engineer` (Lighthouse, bundle, media weight) in parallel. Failures route back to owners; re-test after fixes.
10. **Final approval** — **gate B**: `creative-director`, `tech-lead` and `qa-engineer` each inspect independently (screenshots, running build, test output) and record a verdict. All three must pass.

## 4. Delegation rules

- **Give context by path, not by paste.** Point agents at `studio/*.md` files and the exact source paths they own. Paste only the few facts they can't find on disk. This is the biggest token saver.
- **Parallelise only across ownership boundaries.** Safe parallel pairs: researcher ∥ (nothing else in phase 2); ui-ux ∥ typography; frontend ∥ ai-visual; qa ∥ performance. Motion work waits for the scroll system.
- **Every delegation ends with a handoff contract.** Ask for the handoff block in `references/orchestration.md` (files changed, how verified, evidence paths, open issues, statuses). An agent's "done" without evidence is not done.
- **Verify, don't trust.** After a handoff, spot-check the claim yourself (open the screenshot, run the test, read the diff) or send it to `tech-lead`. Never mark a gate PASS from a summary.
- **Escalate deliberately.** If a sonnet-tier agent fails the same task twice, re-run it with `model: opus` or hand the problem to `tech-lead` for diagnosis before a third attempt.
- **Use the cheap path for cheap work.** Asset conversion, link checking, running an existing test suite: haiku-tier or a plain script. Creative judgement and architecture: opus-tier.

## 5. Non-negotiables the whole studio follows

- **Evidence vocabulary.** Every reported check is exactly one of: `PASS` (tested, evidence linked), `FAIL` (tested, failed), `NOT TESTED`, `BLOCKED` (needs credentials, hardware, permission or a service that is down). Files existing or an install exiting 0 is never a PASS.
- **Measured vs observed vs inferred vs unknown.** Research and reverse-engineering reports label every claim with one of these. Never invent a measurement, a library, a font name or a licence.
- **Original work.** References teach principles; the studio never copies a reference's branding, copy, proprietary assets or source code.
- **Licensing is part of done.** Fonts, libraries, images and video each carry a recorded licence and source in ASSET_MANIFEST.md / TECHNICAL_ARCHITECTURE.md. Never claim commercial rights without a source.
- **Money and secrets.** Never sign the user up for anything paid, never invent API keys, never write a secret into a file that gets committed. Ask for a credential only when a task genuinely needs it, and say which free alternative exists.
- **Accessibility and reduced motion are features, not afterthoughts.** Every motion spec includes a reduced-motion variant; every interactive element is keyboard-reachable.
- **Performance budget is set before build** (in TECHNICAL_ARCHITECTURE.md) and measured after.

## 6. Supporting skills (load only what the task needs)

| Skill | Load when |
|---|---|
| `design-intelligence` | Choosing a design language, palette, composition, art direction for an industry |
| `typography-system` | Picking/pairing fonts, building a fluid type scale or spacing system |
| `gsap-motion` | Any GSAP work: timelines, ScrollTrigger, SplitText, Flip, React cleanup |
| `lenis-scroll` | Smooth scroll, anchors, scroll lock, route transitions, reduced motion |
| `webgl-three` | Three.js / R3F / shaders / 3D product scenes, deciding whether 3D is warranted |
| `ai-visual-pipeline` | Generating, sourcing, optimising and licensing images or video |
| `reference-study` | Inspecting a specific live site and producing an implementation spec |
| `reference-library` | Looking up already-researched references before doing new research |
| `web-qa` | Test suites, visual regression, responsive matrix, Lighthouse, final verification report |

## 7. Starting a project — what to do right now

1. Read `studio/PROJECT_STATUS.md` if it exists; resume from its phase instead of restarting.
2. Otherwise choose the track (§0), run `init-project.sh`, and do Discovery.
3. Follow `references/workflow.md` for the chosen track, delegating per §4.
4. Report to the user at phase boundaries in a few lines: what was decided, what's next, anything you need from them. Keep the detail in `studio/`.
