# Technical Architecture — Penumbra — Light Atelier (demo)
_Owner: frontend-engineer (written by the orchestrator acting as integrator) · Gate A: see PROJECT_STATUS.md_

> Process note: in this validation run Gate A was held **after** the first build wave, not before it, because the stack had already been fixed by DECISIONS.md and the studio's defaults. The tech-lead reviews this document and the code together.

## Stack & rationale
- **Vite 8 + React 19 + TypeScript (strict).** This is the studio default for a static, two-route marketing site. There is no SSR need because content is static and the site is a demo. Next.js would add a server runtime and routing weight without benefit here.
- **Plain CSS + custom-property tokens** (`tokens.css` from typography-spacing, plus `base.css` and `sections.css`). No Tailwind, because there's no team convention to match.
- **GSAP 3.15.1 + @gsap/react** for all motion, with **Lenis 1.3.27** as the single smooth-scroll system.
- **Raw WebGL2** single full-screen shader for light rendering. **No three.js in the bundle** (DECISIONS.md). The Three.js template is verified separately in `lab/`.
- **In-house 70-line router** (`src/router/Router.tsx`), with a Dim/Rise transition, scroll restoration and focus management.

## Dependencies
Runtime (versions pinned exactly; licences read from each installed `package.json`):
| Package | Version | Licence | Why | Verified how |
|---|---|---|---|---|
| react, react-dom | 19.3.1 | MIT | UI | npm + installed package.json |
| gsap | 3.15.1 | GSAP Standard "no charge" | Timelines, ScrollTrigger, SplitText, Flip, CustomEase | npm; plugins present in package |
| @gsap/react | 2.1.2 | GSAP Standard (see gsap.com/standard-license) | `useGSAP` scoping and cleanup | installed package.json |
| lenis | 1.3.27 | MIT | Smooth scroll on native scroll | npm + README integration |
| @fontsource-variable/newsreader | 5.3.0 | OFL-1.1 | Display serif (opsz) | `npm view … license` |
| @fontsource-variable/hanken-grotesk | 5.3.0 | OFL-1.1 | Text | same |
| @fontsource-variable/jetbrains-mono | 5.3.0 | OFL-1.1 | Numerals / spec | same |

Dev: vite 8.3.8 (MIT), @vitejs/plugin-react 6.3.0 (MIT), typescript 7.0.2 (Apache-2.0), @playwright/test 1.63.0 (Apache-2.0, pinned to the installed Chromium 1243), @axe-core/playwright 4.14.0 (MPL-2.0), three 0.187.0 + @types/three (MIT, lab only).

Registered GSAP plugins: ScrollTrigger, SplitText, Flip, CustomEase. Draggable and InertiaPlugin were removed because they're unused (ANIMATION_SPECIFICATION flag).

## Directory layout & ownership
| Path | Owner agent |
|---|---|
| `src/styles/tokens.css`, `src/styles/fonts.css` | typography-spacing |
| `src/motion/**` | gsap-animator (implemented by integrator per ANIMATION_SPECIFICATION.md) |
| `src/scroll/**` | lenis-scroll (implemented by integrator per lenis-scroll skill) |
| `src/webgl/**`, `lab/**` | webgl-specialist |
| `public/media/**`, `assets-src/**`, `scripts/render-assets.mjs` | ai-visual-producer |
| `src/components/**`, `src/sections/**`, `src/pages/**`, `src/router/**`, `src/styles/base.css`, `src/styles/sections.css`, `src/data/**`, `index.html`, build config | frontend-engineer |
| `tests/**`, `playwright.config.ts` | qa-engineer |

## Scroll & motion architecture
```
gsap.ticker ──► lenis.raf(t*1000) ──► lenis 'scroll' ──► ScrollTrigger.update
           └──► LightCanvas.tick ──► renderer.render() (only if dirty + on screen + tab visible)
```
- One Lenis instance (`autoRaf:false`, `lerp 0.1`, `syncTouch:false`), `lagSmoothing(0)`. Anchors are handled with a resolved header offset (`cssVarPx('--header-h')`) and focus moves to the target.
- Each section owns one `useGSAP({ scope })` with a `gsap.matchMedia()` split (motion / reduce, desktop / mobile). Initial states are set only in the motion branch.
- The Method section is the only pin (+300% desktop, +200% mobile, scrub 0.8). Reduced motion renders three static steps instead (different DOM, no pin).
- Route change: Dim (veil) → swap (old contexts revert) → `lenis.resize()` → scroll to 0 or the restored y → `ScrollTrigger.refresh()` → Rise → focus `h1`. Every step has a wall-clock fallback so navigation never depends on rAF (background tabs, CPU starvation).
- Debug hooks under `?debug`: `window.__lenis`, `window.__gsapStats()`, `window.__ScrollTrigger`, `window.__lightRenderers`.

## Asset pipeline
`scripts/render-assets.mjs` (Playwright) → `assets-src/*.png` masters (gitignored, regenerable) → `optimize-images.mjs` (sharp) → `public/media/<id>-<w>.{avif,webp}` → `<Picture>` with explicit width/height (no CLS), lazy below the fold, `fetchpriority=high` + `<link rel=preload>` for the hero poster.

## Performance budget
| Metric | Budget | Measured (→ PERFORMANCE_REPORT) |
|---|---|---|
| LCP (mobile, lab) | ≤ 2.5 s | see report |
| CLS | ≤ 0.05 | see report |
| TBT (INP lab proxy) | ≤ 200 ms | see report |
| JS initial (gz) | ≤ 170 KB | see report |
| Hero media | ≤ 60 KB | 8.3 KB AVIF @1920 (ASSET_MANIFEST) |
| Total media, full scroll at 390 | ≤ 600 KB | see report |

## Test plan
`tests/functional.spec.ts`, `tests/scroll-motion.spec.ts`, `tests/responsive-a11y.spec.ts` and `tests/visual.spec.ts`, run against the production build. Covered: the 6-width matrix, reduced motion, axe WCAG 2.2 AA, keyboard order, resilience with no WebGL2 and with fonts/images blocked, a ×3 route leak test, and Lenis/ScrollTrigger sync. Only Chromium is available in this environment.
