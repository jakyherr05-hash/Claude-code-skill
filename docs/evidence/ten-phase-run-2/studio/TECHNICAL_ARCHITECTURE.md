# Technical Architecture — Halde
_Owner: frontend-engineer · Gate A: PASS 2026-11-17 (tech-lead approval)_
## Stack & rationale
No build, no npm, no network. `index.html` + `styles.css` + `main.js` served statically (brief constraint). Plain CSS custom properties, vanilla JS (no modules, no bundler). System font stacks (A1), so 0 font requests. One page: hero, how-we-work (3 steps), contact. Head: `<link rel="icon" href="data:,">` (no favicon request), `<link vendor/lenis.css>`, `<link styles.css>`, then before `</body>` classic `<script defer>` in order: `vendor/gsap.min.js` → `vendor/ScrollTrigger.min.js` → `vendor/lenis.min.js` → `main.js` (defer keeps execution order and non-blocking parse). Next/React/Vite rejected: no SSR/CMS need, 1 page.
## Dependencies
| Name | Version (from file) | Licence | Raw KiB | Reason |
|---|---|---|---|---|
| gsap.min.js | 3.15.1 (banner `GSAP 3.15.1`) | GSAP Standard 'No Charge' License (free, not open source); banner and terms in THIRD_PARTY_NOTICES.md | 71.6 | timelines, matchMedia, ticker |
| ScrollTrigger.min.js | 3.15.1 (banner) | same banner / licence | 43.6 | scrub + reveal triggers |
| lenis.min.js | 1.3.27 (code `var e=\`1.3.27\``) | MIT (upstream darkroomengineering/lenis); no notice in vendored file; see THIRD_PARTY_NOTICES.md (copyright line to confirm before public deploy) | 18.4 | smooth wheel scroll |
| lenis.css | n/a | no banner; MIT upstream, see THIRD_PARTY_NOTICES.md | 513 B | `.lenis` rules |
Vendor JS total 133.6 KiB raw / 50.7 KiB gz. No CDN.
## Directory layout & ownership
| Path | Owner |
|---|---|
| `index.html` (landmarks, one h1, skip link, `data-*` hooks) | frontend-engineer |
| `styles.css` block `/* == TOKENS == */…/* == /TOKENS == */` (top of file) | typography-spacing |
| `styles.css` everything after TOKENS (reset, layout, components, focus, reduced-motion final state) | frontend-engineer |
| `main.js` IIFE wrapper `(function(){ … })();` + all marker pairs, written in frontend's first pass | frontend-engineer |
| `main.js` `/* == SCROLL == */…/* == /SCROLL == */` (first; declares `let lenis = null`) | lenis-scroll |
| `main.js` block `/* == MOTION == */…/* == /MOTION == */` (second) | gsap-animator |
| `vendor/**` read-only; `studio/**` per file header → tech-lead; `tests/**` (Playwright, not linked) → qa-engineer | see left |
Edit order (sequential): frontend → typography-spacing → lenis-scroll → gsap-animator → qa. Each touches only its block; nobody moves another owner's markers.
## Scroll & motion architecture
Per ANIMATION_SPECIFICATION. SCROLL block first: if `matchMedia('(prefers-reduced-motion: reduce)')` matches, create no Lenis. Else one `new Lenis({lerp:.1})` (syncTouch false), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t=>lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. Never a second scroll loop or autoRaf. MOTION block: `registerPlugin(ScrollTrigger)` once, one `gsap.matchMedia()` with the three branches (≥1024 / <1024 / reduce = nothing created). `.plate__glaze` is a radial pool with a feathered rim; GSAP animates its `scale`/`opacity` (CSS final state is scale 1, opacity 1; no `--glaze-angle`). CSS registers `@property --ring-blur` (`<length>`, `inherits:false`, 0px), tweened on `.plate__rings`, whose `transform` is left to GSAP (small translate); no `CSS.supports` guard. Initial hidden states are set by JS (`gsap.set`/`from`), never CSS, so content is visible by default. Anchors: `lenis.scrollTo` with scroll-margin offset, focus moved to target. Nav `aria-current` via IntersectionObserver.
No-JS / failure: page is complete and readable with CSS alone (final state is the CSS state; mailto works). Guard is the first statement inside the main.js IIFE (top-level `return` is a SyntaxError in classic scripts): `if(!window.gsap||!window.ScrollTrigger||!window.Lenis) return;` so a missing vendor file leaves static content and zero console errors from our code.
## Performance budget (mobile lab, 4x CPU throttle, Slow 4G; localhost wall-clock for Playwright)
| Metric | Budget |
|---|---|
| LCP (h1 text) | ≤ 1.2 s (≤ 2.5 s hard fail) |
| CLS | 0 (≤ 0.01 hard) |
| TBT (long-task proxy, median of 5, 4x CPU) | ≤ 100 ms; hard fail if the median is >100 or any run is >200 ms |
| JS total | ≤ 145 KiB raw / ≤ 55 KiB gz (vendor 133.6 raw / 50.7 gz; main.js ≤ 8 raw / ≤ 3 gz) |
| CSS total | ≤ 15 KiB raw / ≤ 5 KiB gz (sum of per-file gzip -9, incl. lenis.css) |
| Images / fonts | 0 / 0 |
| Requests | ≤ 7 (html, 2 css, 4 js), all same origin, 0 third party |
## Test plan (qa-engineer, `tests/`, Playwright Chromium, server `python3 -m http.server 8790` from repo root)
- Viewports required: 390x844, 768x1024, 1024x768, 1440x900 (360, 1920 optional). Pixel-diff baselines at 390/1440, normal + reduced motion. Per viewport: open screenshots, `scrollWidth <= innerWidth` (no horizontal overflow), console errors/pageerrors = 0, failed requests = 0, all requests same origin.
- Reduced-motion run (`reducedMotion:'reduce'`): no Lenis class on html, `ScrollTrigger.getAll().length===0`, no inline style on plate/`[data-reveal]`. JS-disabled run: all text and mailto visible. Vendor-blocked run: no errors, content visible. Trigger counts 5 / 4 / 0 per spec; resize 1440→768 leaves no stale transform.
- Keyboard: first Tab = skip link, visible, jumps to main; `:focus-visible` ring on every link; anchors land below header with focus on target; one h1; landmarks. A11y: scripted DOM checks plus axe-core (accepted alongside them; test-only, imported from an absolute external path, as are the Playwright imports). Budget: transferred bytes, CLS via PerformanceObserver, long tasks, CDP CPU/network throttling; Lighthouse NOT TESTED unless installed.
