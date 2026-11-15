# Usage guide

## Start a project
Describe the business and the experience you want. The `web-studio` skill triggers on website/landing-page/portfolio requests, or you can call it explicitly:

```
/premium-web-studio:web-studio  We're Aster, a Rotterdam e-bike maker launching a €6k carbon model in March.
Audience: design-minded commuters. I want it to feel engineered and calm, not sporty. Next.js please.
```

What happens:
1. **Track:** the orchestrator picks Spot / Sprint / Full production and tells you which.
2. **Discovery:** at most 3–5 questions in one message, each with a default you can accept.
3. **`studio/` docs** are created in your repo (brief, research, creative direction, specs, architecture, asset manifest, reports, status, decisions). Later sessions resume from `studio/PROJECT_STATUS.md`.
4. **Specialists** are delegated by phase, in parallel where their files don't overlap: reference research → creative direction → UI/UX ∥ typography → animation spec → architecture (**Gate A**, tech-lead) → build waves → scroll system → motion ∥ WebGL ∥ assets → QA ∥ performance → **Gate B** (creative director, tech lead and QA each verify independently).
5. You get a short update at each phase boundary. The detail stays in `studio/`.

## Use one specialist directly
```
@agent-premium-web-studio:gsap-animator  The pinned section in src/sections/Story.tsx jumps after resize.
@agent-premium-web-studio:reference-researcher  Study https://example.com — how is the hero type sized and what scroll library is it using?
@agent-premium-web-studio:qa-engineer  Run the responsive matrix and axe on localhost:5173 and write studio/QA_REPORT.md.
```
(With the `install.sh` method the names are unprefixed: `@agent-gsap-animator`.)

## Use a skill on its own
| Ask | Skill |
|---|---|
| "Which fonts for a heritage watchmaker? Give me a type scale." | `typography-system` |
| "Add Lenis to this Next.js app without breaking ScrollTrigger." | `lenis-scroll` |
| "Make this section a pinned scroll story." | `gsap-motion` |
| "Is a Three.js hero worth it here?" | `webgl-three` |
| "Generate a consistent set of hero images — free options only." | `ai-visual-pipeline` |
| "What do top studios do for dark editorial sites?" | `reference-library` |
| "Test the site at all breakpoints and give me a QA report." | `web-qa` |

## Useful scripts (run from the skill folder or via absolute path)
```bash
node reference-study/scripts/capture-reference.mjs https://site.com ./evidence --id site
python3 reference-library/scripts/library.py search webgl dark --min-confidence medium
node typography-system/scripts/type-scale.mjs --min-base 17 --max-base 19 --max-ratio 1.333
node design-intelligence/scripts/contrast.mjs "#0d0c0b" "#ece6da" "#d9a05b"
python3 ai-visual-pipeline/scripts/providers.py check
node ai-visual-pipeline/scripts/optimize-images.mjs raw/ public/media --widths 720,1280,1920 --no-jpg
bash ai-visual-pipeline/scripts/encode-video.sh clip.mov public/media 1920
bash web-studio/scripts/init-project.sh . "Project Name"
bash web-qa/scripts/lighthouse.sh http://localhost:4173/ lighthouse 3
node web-qa/scripts/scroll-probe.mjs http://localhost:4173/ 1440
```

## Reference demo
`demo/` is a complete project built by the studio: `studio/` docs, a Vite + React + GSAP + Lenis + WebGL2 site, and a Playwright suite.
```bash
cd demo && npm ci && npm run dev       # http://localhost:5173
npm test                               # builds, serves the production build, runs the suite
```
