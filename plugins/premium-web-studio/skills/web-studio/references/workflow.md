# Production workflow — phases, delegation prompts, gates

Contents: 1 Discovery · 2 Research · 3 Creative direction · 4 Design spec · 5 Architecture (Gate A) · 6 Development · 7 Motion · 8 Visual production · 9 Testing · 10 Final approval (Gate B) · Sprint track · Spot track

Each phase lists **who**, **reads**, **writes**, **parallel with**, a **delegation prompt** you can adapt, and **exit criteria**. Update `studio/PROJECT_STATUS.md` when a phase exits.

---

## 1 · Discovery (you)

Ask in **one** message, at most five questions, each with a default the user can accept:

1. What is the business and who must this site convince? (default: infer from what they told you)
2. What single feeling should a visitor leave with? (e.g. "quiet confidence", "this is the future", "I want to touch it")
3. What content exists? (copy, logo, product shots, video) — what must be created?
4. Constraints: stack preference, hosting, deadline, accessibility/legal requirements, budget for paid assets/fonts (default: free/open licences only).
5. 1–3 sites they love or hate (optional).

Write answers + assumptions to `PROJECT_BRIEF.md`. Don't run a questionnaire; unknowns become recorded assumptions the creative director may revisit.

**Exit:** PROJECT_BRIEF.md complete, track chosen, PROJECT_STATUS.md phase = Research.

## 2 · Research — `reference-researcher`

**Reads:** PROJECT_BRIEF.md, the reference library index. **Writes:** REFERENCE_RESEARCH.md, new library entries.

> Read studio/PROJECT_BRIEF.md. Search the reference library (reference-library skill) for sites relevant to <industry/feeling>. Select 4–8 references that each teach something specific for this brief. Inspect any that aren't already in the library with the reference-study capture script. Write studio/REFERENCE_RESEARCH.md: for each reference, the lesson it teaches for THIS project, labelled measured/observed/inferred, plus a "patterns to adopt / patterns to avoid" section. Return the handoff block.

**Exit:** every reference has a URL, date, confidence, and a project-specific lesson; anything not inspectable is marked `not inspected`.

## 3 · Creative direction — `creative-director`

**Reads:** brief, research. **Writes:** CREATIVE_DIRECTION.md.

> Read studio/PROJECT_BRIEF.md and studio/REFERENCE_RESEARCH.md. Load the design-intelligence skill. Develop ONE original concept (offer up to two alternates only as short paragraphs). Fill CREATIVE_DIRECTION.md: concept line, narrative arc across the page, design language and why it fits this audience, palette with roles and contrast targets, type personality (not final fonts), image/video direction, motion personality, signature moment(s), how the first viewport composes at 390 / 768 / 1440, and what we deliberately won't do. Return the handoff block.

**Exit:** a concept you can say in one sentence; a signature moment that justifies any heavy tech (WebGL, video); no copied reference identity. Show the user the concept line + signature moment and continue unless they object.

## 4 · Design specification — `ui-ux-designer` ∥ `typography-spacing`, then `gsap-animator`

`ui-ux-designer` → DESIGN_SPECIFICATION.md: sitemap, section-by-section structure (purpose, content, layout per breakpoint, interaction, a11y notes), navigation model, states (hover/focus/active/loading/empty/error), CTA strategy.

`typography-spacing` → TYPOGRAPHY_SYSTEM.md + SPACING_SYSTEM.md: chosen fonts with licence + source, variable axes, fluid type scale (clamp values), line-height/tracking per step, grid, containers, section rhythm. Produces the token list later landed in `src/styles/tokens.css`.

Then `gsap-animator` → ANIMATION_SPECIFICATION.md: the opening (time to readable content), a **story-beat table** for any scroll-driven section (design-intelligence → motion-system "Scroll storytelling"), then per section: trigger, timeline, durations/eases from the motion scale, scrub/pin decisions, reduced-motion variant, mobile variant, performance notes.

**Exit:** a developer could build every section without inventing anything; every animation has a stated purpose and a reduced-motion variant.

## 5 · Technical architecture — `frontend-engineer`, **Gate A** by `tech-lead`

TECHNICAL_ARCHITECTURE.md: stack and why, dependency list (name, version, licence, size, reason), directory layout with **owner per path**, motion/scroll architecture (one Lenis + GSAP ticker, `useGSAP` scoping), asset pipeline, performance budget (LCP, CLS, INP targets, JS KB gz, image/video KB per view), test plan.

Default stack when the user has no preference: **Vite + React + TypeScript**, plain CSS with custom-property tokens (Tailwind only if the user's team uses it), GSAP + @gsap/react, Lenis, Three.js lazy-loaded only if the concept needs it, Playwright for tests. Use Next.js when the site needs SSR/SEO-heavy multi-page routing or a CMS.

**Gate A checklist (tech-lead):** dependencies justified and licence-checked; no competing scroll/animation systems; ownership map covers every path; budget is numeric; test plan covers the responsive matrix and reduced motion. Verdict recorded in PROJECT_STATUS.md.

## 6 · Development

Wave 1 (parallel): `frontend-engineer` (app shell, routing, section components with semantic HTML, no motion), `typography-spacing` (tokens.css + font loading), `ai-visual-producer` (first asset pass, placeholders with correct aspect ratios).

Wave 2: `frontend-engineer` integrates tokens and assets.

**Render → critique → refine (before motion begins).** Layout must work with zero animation. Capture the running build at 390, 768, 1024 and 1440 (`capture-reference.mjs <local url> studio/critique --id layout-r1 --tablet --filmstrip 12` from the reference-study skill), then delegate the critique to `creative-director` with design-intelligence → `references/visual-critique.md` (sections A–E, G). Fixes go to their owners (layout → frontend-engineer, type/spacing → typography-spacing, crops → ai-visual-producer); re-capture and compare. Repeat until no blocker and ≤ 3 majors. This loop is cheap now and expensive after motion is layered on.

## 7 · Motion

Wave 1: `lenis-scroll` lands `src/scroll/` from the lenis-scroll skill template and proves sync (handoff must include the measured scroll-sample evidence).
Wave 2 (parallel, disjoint paths): `gsap-animator` (`src/motion/**` + hooks into sections via data attributes / refs agreed in the spec), `webgl-specialist` (`src/webgl/**`).

**Exit:** every spec'd animation exists, reduced-motion path verified, `ScrollTrigger.getAll().length` stable across route changes, and a motion critique passed: re-capture with `--filmstrip`, compare the frames with the story-beat table, and run visual-critique §F (readable pinned frames, text in step with picture, opening ≤ ~1.5 s to content, reduced-motion final state complete).

## 8 · Visual production — `ai-visual-producer`

Final assets generated or sourced, art-directed against CREATIVE_DIRECTION.md, converted to AVIF/WebP (+ fallback) at responsive widths, video encoded (H.264 MP4 baseline + VP9/AV1 WebM where it helps), poster frames, every asset in ASSET_MANIFEST.md with source, prompt/seed, model + licence, and commercial-use status.

## 9 · Testing — `qa-engineer` ∥ `performance-engineer`

QA: functional, navigation, forms, console errors, broken links, responsive matrix (360, 390, 768, 1024, 1440, 1920), keyboard + screen-reader landmarks, axe scan, reduced-motion run, visual regression baseline/compare, scroll + animation verification. Writes QA_REPORT.md with screenshots it has actually looked at.

Performance: production build, bundle analysis, Lighthouse (mobile + desktop, ≥3 runs, median), media weight, long tasks during scroll. Writes PERFORMANCE_REPORT.md against the budget.

Fix loop: each failure → owner agent with evidence → fix → the same check re-run by QA/perf. Don't close a failure on the fixer's word.

## 10 · Final approval — **Gate B**

Three independent verdicts, each recorded in PROJECT_STATUS.md with evidence links:

- `creative-director`: screenshots at 390/768/1024/1440 + the scroll filmstrip, judged with the full visual-critique rubric — does it deliver the concept and signature moment? Any off-brand or generic detail?
- `tech-lead`: code review of the diff, dependency audit, build + test run reproduced personally.
- `qa-engineer`: full suite green, no unexplained visual diffs, a11y and reduced motion pass.

Then deliver to the user: what was built, how to run it, the verification table, known limitations.

---

## Sprint track (single page, existing brand)

Brief (3 questions max) → `creative-director` light pass (concept line + signature moment, 1 page) → `typography-spacing` ∥ `frontend-engineer` → `lenis-scroll` → `gsap-animator` → `qa-engineer` → `tech-lead` gate. Docs: PROJECT_BRIEF, CREATIVE_DIRECTION, ANIMATION_SPECIFICATION, QA_REPORT, PROJECT_STATUS.

## Spot track

Load the one relevant skill, do the work (or delegate to its specialist), verify it in a browser, report with the status vocabulary. No doc set unless `studio/` already exists — if it does, append to PROJECT_STATUS.md.
