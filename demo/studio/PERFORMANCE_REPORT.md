# Performance Report — Penumbra — Light Atelier (demo)
_Owner: performance-engineer · Date: 2026-11-15 · Build: git-less identity, built 2026-11-15 04:32:28 UTC from the working tree (integrator still editing src/); `assets/index-DQyiAVZi.js` 453,797 B, `assets/index-BdIY170V.css` 31,906 B (full listing: `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/perf/build-id.txt`)_

All numbers below were measured in this run unless tagged **(est.)**. Raw outputs: `/tmp/claude-0/-home-user-Claude-code-skill/224276a2-c2aa-5898-b6d9-eebe905c6165/scratchpad/perf/`.

## Method
- Build: `vite build` (Vite 8.3.8) to a private dir, served with `vite preview` on :4180 (never the dev server). Server is plain Node preview: **no compression, no cache headers**; transfer sizes in Lighthouse are therefore ~raw sizes (see Bundle for gzip).
- Lighthouse 13.6.0 via `web-qa/scripts/lighthouse.sh`, 3 runs mobile (Lighthouse default: Moto G Power emulation, Slow-4G simulated throttle rtt 150 ms / 1638 kbps, CPU 4x) + 3 runs desktop preset. Chrome = Google Chrome for Testing 153.0.8010.12 (`CHROME_PATH` was preset in the env to /usr/bin/google-chrome, so the script's auto-detect did not run), headless, in a container, **software GL (SwiftShader), no GPU**. Lab numbers are indicative only; the WebGL cost in particular is inflated.
- Playwright (Chromium via repo's playwright) for network/fonts/media (1440@1x and 390@3x touch/mobile), CDP heap, and a CPU-profile diagnostic (4x CPU throttle). `scroll-probe.mjs` for scroll frames/long tasks.
- INP not measurable in lab; **TBT is the proxy**. Real-device / real-GPU performance: NOT TESTED.

## Results vs budget
Budget: ARCHITECTURE had none, so the defaults given are adopted as proposed (needs tech-lead ratification): mobile lab LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 200 ms, initial JS ≤ 170 KB gz, hero media ≤ 60 KB.

| Metric | Budget | Mobile (median of 3; range) | Desktop (median of 3; range) | Status |
|---|---|---|---|---|
| LCP | ≤ 2.5 s | **5,317 ms** (4,959–5,327) | 820 ms (206–842) | **FAIL** mobile · PASS desktop |
| CLS | ≤ 0.05 | 0.0006 (0.0006–0.0006) | 0.0042 (0.0042) | PASS |
| TBT (INP proxy) | ≤ 200 ms | **4,554 ms** (4,440–4,714) | **779 ms** (739–945) | **FAIL** both (SwiftShader-inflated, see Runtime) |
| JS initial, gzip | ≤ 170 KB | 152,529 B = 152.5 KB (gzip -9; Vite reports 154.45 kB) | same (single chunk, eager) | PASS (headroom ~17 KB) |
| Hero media (poster) | ≤ 60 KB | 2,811 B @960 / 8,338 B @1920 AVIF (mobile@3x downloads both: 11.1 KB) | 8,338 B | PASS — but see grain.png below |
| Perf score (info) | — | 48 (48–50) | 72 (70–73) | — |
| FCP / Speed Index (info) | — | 755 ms / 3,922 ms | 204 ms / 1,290 ms | — |
| A11y / Best-practices / SEO (info) | — | 94 / 100 / 92 | 94 / 100 / 92 | — |

Notes
- FCP is fast (755 ms mobile) but LCP is 5.3 s: LCP element is `p.hero__sub` (text), with ~1.83 s element render delay in the breakdown of mobile run 2 (TTFB 17 ms). Cause: `Hero.tsx` sets that text to opacity 0 and GSAP fades it in after `delay: 1.1` + stagger 0.25, and the main thread is blocked by WebGL work (below). Text with opacity 0 is not an LCP candidate. The full-bleed poster is not the LCP candidate (**inference**, not verified: Chrome ignores very low-entropy images, the poster is 2.8 KB).
- Desktop run 1 reported LCP 206 ms vs 820/842 for runs 2/3 — candidate selection differed between runs; not investigated.
- CLS: only shift is `h1#hero-title` (font swap, 0.0006 mobile / 0.0042 desktop). The metric-matched fallbacks work; font-swap CLS is negligible and within budget. Playwright-observed CLS: 0 at 390, 0.0046 at 1440.
- Non-perf Lighthouse failures seen incidentally (owners: a11y/dev): `aria-label` on `<p class="manifesto__text">` and `<p class="atelier__line">` (aria-prohibited-attr); color-contrast 1.1:1 on manifesto lines (#191816 on #0d0c0b) — this is the pre-"lit" state of the scroll reveal captured un-scrolled, probably by design, but a11y should confirm; robots.txt invalid because there is no `public/robots.txt` and preview serves the SPA fallback for it.

## Bundle
Method: per-file gzip via `gzip -9 -c | wc -c`; attribution of the main chunk from a second build with `--sourcemap` (scratch dir), decoding the source-map mappings into bytes of minified output per source (`attr.mjs`; no source-map-explorer). Gzip per dependency is **(est.)**, proportional to raw share.

| File | Raw | gzip -9 |
|---|---|---|
| assets/index-DQyiAVZi.js (single chunk, loaded eagerly, no code splitting) | 453,797 | 152,529 |
| assets/index-BdIY170V.css (render-blocking) | 31,906 | 10,191 |

Main chunk attribution (of 442,709 B mapped): react-dom 46.9% (~71 KB gz est.), gsap core+ScrollTrigger+SplitText+Flip+CustomEase 34.3% (~52 KB gz est.), lenis 4.2% (~6 KB gz est.), react+scheduler+@gsap/react 2.7%, app code 11.8% (largest: content.ts 1.6%, lightRenderer.ts 1.6%, TheHour/ProjectPage/MethodDrawing/Method ~1% each). Lighthouse unused-javascript: **66 KiB (43.9%) of index.js unused at load** (measured).
Nothing is lazy: ProjectPage, below-fold sections, the shader renderer and the Flip/SplitText/CustomEase plugins are all in the initial chunk. Also: `media/grain.png` is 62,543 B (a PNG; Lighthouse estimates 50 KiB saving with a modern format) and is fetched on first load; hero-adjacent media total 70.9 KB incl. grain.

## Fonts
Faces declared: 4 families/styles x (latin / latin-ext / vietnamese / …) = 15 woff2 files built; `unicode-range` works — only the latin subset of 4 faces is downloaded (same at 1440 and 390):

| File | Bytes |
|---|---|
| newsreader-latin-opsz-italic | 146,872 |
| newsreader-latin-opsz-normal | 132,000 |
| jetbrains-mono-latin-wght-normal | 40,404 |
| hanken-grotesk-latin-wght-normal | 34,704 |
| **Total first load** | **353,980** |

No font `<link rel=preload>` exists in index.html (fonts are discovered via CSS, a 2-hop chain css→woff2). Newsreader italic (147 KB, 41% of font bytes) is downloaded on first load although italic is "emphasis only". CLS attributable to font swap: 0.0006 (mobile) / 0.0042 (desktop) — PASS.

## Media
Only the hero poster is eager; everything else is `loading=lazy`, AVIF-first <picture> with srcset/sizes. Right candidate selected (checked via `currentSrc`):

| View | Top viewport (load + 2.5 s) | Full scroll-through (additional) | Candidates picked |
|---|---|---|---|
| 390 @3x mobile | image 3 files 73,692 B (poster-960 preload 2,811 + poster-1920 8,338 + grain 62,543) | +4 images 62,137 B in the first pass (page not fully scrolled); complete pass: media total 172,965 B incl. atelier 960px AVIFs | poster 1920 (needs 1170 px), work cards 1280 (349 css px x3), atelier 960 |
| 1440 @1x | image 2 files 70,881 B (poster-1920 8,338 + grain 62,543) | +7 images 44,648 B | poster 1920, work cards 720 (666 px), atelier 480 (360 px) |

Finding: at 390@3x the `<link rel=preload media="(max-width:960px)">` fetches poster-960, but the `<img>` then selects poster-1920 (DPR 3), so the preload is wasted (2.8 KB) and the real image is not preloaded. At DPR ~1.75 (Lighthouse mobile) the 960 file is selected and the preload matches. No video is used.

## Runtime (scroll long tasks, FPS sampling, memory)
Scroll probe (Lenis wheel scroll over the entire page, 388/303/386 frames; script now confirms reaching the bottom):

| Run | p50 / p95 frame | frames > 20 ms | long tasks | reached bottom |
|---|---|---|---|---|
| 1440 | 16.7 / 16.7 ms | 0% | 0 | yes (13,279 px) |
| 390 (844 px tall) | 16.7 / 16.8 ms | 0% | 0 | yes (10,235 px) |
| 1440 `--reduced` | 16.7 / 16.7 ms | 0.3% | 0 | yes (13,087 px) |

Scrolling is smooth in steady state (SwiftShader, headless: rAF is vsync-capped at 60 Hz here, so this shows no jank rather than real-device FPS). The probe starts 2.5 s after networkidle, so it does **not** cover load.

Load-time blocking (the Lighthouse TBT finding):
- Lighthouse mobile run 2: 12 long tasks, longest 2,128 ms, all attributed to index.js; main-thread "Other" 7.4 s of 9.0 s.
- Diagnostic Lighthouse mobile run with `--disable-3d-apis` (single run, **not** a median): perf 84, **TBT 149 ms** (vs 4,554 ms), LCP 4,302 ms. So the TBT failure is almost entirely the WebGL shader under SwiftShader; the LCP failure is **not** WebGL-driven (LCP stays ~4.3 s). The WebGL share is inflated by software GL (a real GPU is far cheaper), but the shader should still be started after first paint and be resolution-capped.
- Playwright 4x CPU profile (no network throttle): long tasks 85+363+98+319 ms → ~665 ms TBT-equivalent with WebGL vs ~493 ms with getContext stubbed to null: framework/GSAP/layout init alone is ~0.5 s at 4x.

JS heap, 3 cycles Home → /work/capela-do-silencio → Home (`?debug`, forced GC before each sample, Chromium + SwiftShader):

| | baseline | after cycle 1 | cycle 2 | cycle 3 |
|---|---|---|---|---|
| 1440 used heap | 3.33 MB | 3.87 | 4.00 | 4.12 |
| 390 used heap | 3.37 MB | 3.90 | 4.03 | 4.15 |
| DOM nodes | 431 / 435 | same | same | same |
| `__gsapStats` Home | scrollTriggers 10, globalChildren 20, lightRenderers 2 | 5 / 12 (390: 9) / 2 | 5 / 12 / 2 | 5 / 12 / 2 |
| `__gsapStats` on project page | — | 1 / 1 / 0 each cycle | | |

Reading: no leak in ScrollTriggers/tweens/renderers (identical every cycle, renderers go to 0 on the project page and back to 2). Heap grows +0.8 MB on first round trip then ~+0.12 MB per cycle (3 cycles is too few to call this a slow leak; run a 20-cycle soak before launch). Open question for the integrator: Home has 10 ScrollTriggers on first load but 5 after every return — confirm whether the first-load set is a duplicated/StrictMode-style double init or an intentional intro. No console/page errors during cycles.

## Actions taken / recommended (ranked by impact; I did not touch app source)
1. **Defer + cap the WebGL light renderer** (owner: motion/webgl dev). Start it after first paint (rIC / after hero text is visible), render at ≤ 0.5–0.75 resolution on mobile, pause when off-screen, and gate on a quick capability/perf check. Measured: TBT 4,554 → 149 ms in the lab with WebGL off (SwiftShader-inflated; re-verify on a real mid-range phone). Fixes the TBT FAIL.
2. **Make the LCP element visible without JS**: do not animate `opacity: 0 → 1` on `.hero__sub`/h1 with a 1.1 s delay; reveal via transform/clip or shorten to ≤ 0.2 s and ensure the hero copy is in the first paint. Measured: LCP is still 4.3 s with WebGL off, driven by the delayed GSAP reveal and ~1 s of script eval at 4x CPU; expected LCP ≈ 1.2–1.8 s **(est.)**. Fixes the LCP FAIL.
3. **Fonts**: preload only the critical face (Newsreader latin normal, `crossorigin`), and load Newsreader italic on demand (or `font-display: optional`/subset). Saves up to 147 KB (41%) of first-load font bytes (measured size; saving **est.**). Also consider whether Hanken + JetBrains Mono both need first-load.
4. **Code-split**: lazy-load `ProjectPage`, below-fold sections, and rarely-needed GSAP plugins (Flip/CustomEase/SplitText) behind dynamic `import()`; Lighthouse shows 66 KiB unused JS at load (measured). Expected initial JS saving 15–25 KB gz **(est.)**. Budget currently passes (152.5 / 170 KB), so this is for headroom.
5. **grain.png → AVIF/WebP or an SVG feTurbulence/tiny tile**: 62.5 KB → ~10 KB **(est.; Lighthouse estimates 50 KiB savings, measured)**. It is currently the largest first-load image and alone exceeds the 60 KB hero-media budget when added to the poster (70.9 KB total).
6. **Inline critical CSS** or reduce render blocking: Lighthouse estimates 140–153 ms (measured est.); CSS is 10.2 KB gz.
7. **Hero preload at high DPR**: preload mismatches the chosen candidate at DPR ≥ ~2.5 (2.8 KB waste); use `imagesrcset`/`imagesizes` on the preload link (est. trivial).
8. **Hosting**: confirm gzip/brotli + immutable cache headers on the real host (preview has neither; the JS is 454 KB raw / 152.5 KB gz).
9. Non-perf: add `public/robots.txt`; remove `aria-label` from `<p>` elements; a11y to confirm the 1.1:1 contrast is only the pre-reveal state.

### Tooling notes (web-qa scripts validated)
- `lighthouse.sh`: works as-is (3+3 runs, summary table and JSON written). Observation, no fix: a pre-set `CHROME_PATH` suppresses auto-detection (it used /usr/bin/google-chrome 153, not the Playwright Chromium); echoed in the first line of its output.
- `scroll-probe.mjs` **edited** (two fixes): (1) at widths < 600 the viewport height was width x 0.625 (244 px at 390), unrealistic for phones; now 844 px; (2) it did not prove the page was fully scrolled; output now includes `scrolledToPx`, `maxScrollPx`, `reachedBottom`, and the note states that load-time long tasks are excluded. Needs `NODE_PATH=$(npm root -g)` to resolve playwright.
- Not covered: Firefox/WebKit, real devices, real GPU, INP with real interactions, network compression, > 3 route cycles.
