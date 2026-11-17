# Performance Report — Halde
_Owner: performance-engineer · 2026-11-17 · Build: working tree (no commit), static files, no build step_
## Method (all MEASURED unless marked inferred)
- Playwright Chromium 153.0.8010.12 headless, in a container; `python3 -m http.server 8791` (no compression, so transfer = raw; gz is `gzip -9` locally = what a gzip host would send). Lab run, not field data.
- Mobile: 390x844 DPR2, CDP Network.emulateNetworkConditions (150 ms RTT, 1.6 Mbps down) + CPU 4x. Desktop: 1440x900 unthrottled. 5 fresh-context runs each; median reported with spread.
- Lighthouse: NOT TESTED (not installed). INP: NOT TESTED (needs real input); TBT from longtask entries is the proxy (inferred: sum of (duration-50) of long tasks, not Lighthouse's FCP-TTI window).
## Results vs budget
| Metric | Budget | Mobile 390 | Desktop 1440 | Status |
|---|---|---|---|---|
| LCP (element: h1) | ≤1.2 s | 772 ms (740–812) | 132 ms (108–144) | PASS |
| CLS | 0 | 0 (5/5) | 0 (5/5) | PASS |
| TBT proxy | median ≤100, any run ≤200 | 47 ms median (26–109) | 0 | PASS (rule: median ≤100, no run >200; DECISIONS 2026-11-17) |
| Long tasks at load | 0 >50 ms beyond init | 1–2 per run, 63–114 ms | none | init-only, see below |
| Console/page errors | 0 | 0 | 0 | PASS |
| Requests | ≤7 | 7 | 7 | PASS (all same origin) |
| Images / fonts | 0 / 0 | 0 / 0 | 0 / 0 | PASS |
## Bundle (re-measured with wc -c and gzip -9c; caps per tech-lead revision)
| File (gsap 73,357/28,415; ScrollTrigger 44,683/18,034; lenis 18,815/5,425; main.js 7,314/2,790) | Raw | gz |
|---|---|---|
| **JS total** | **144,169 = 140.79 KiB** | 54,664 = 53.38 KiB |
| styles.css + lenis.css | 14,697 = 14.35 KiB | 4,930 = 4.81 KiB |
- Revised caps: JS raw 140.79 KiB vs ≤145: PASS; JS gz 53.38 vs ≤55: PASS; main.js 7.14 KiB raw / 2.72 KiB gz vs ≤8 / ≤3: PASS; CSS raw 14.35 vs ≤15: PASS; CSS gz (sum of per-file) 4.81 vs ≤5: PASS. (Vs the original Gate A caps these were over; superseded.)
- index.html 3,920 B raw / 1,301 gz (one aria-label added; no other served file changed). Page total 162,786 B raw / 60,895 B (59.5 KiB) gz over 7 requests; measured transfer 164,124 B incl. headers (uncompressed server).
- All JS is `defer`; none blocks parse. Single route, so no further splitting applies.
## Media
0 images, 0 fonts, 0 video (system font stack); responsive selection N/A.
## Runtime (1440, motion on, wheel scroll 100 px/16 ms through .steps to page end, 2.96 s, 177 frames)
- Frame deltas rAF: p50 16.7 ms, p95 16.8 ms, max 16.8, >32 ms: 0, >20 ms: 0. Long tasks during scroll: 0. MEASURED, but headless rAF is vsync-capped at 60 Hz and software-rendered: it shows no main-thread jank, not GPU/paint cost.
- CDP counters before->after scroll: LayoutCount 29->40, RecalcStyleCount 136->348 (+212, about 1.2 per frame, expected from GSAP/Lenis style writes), Layout dur 17->19 ms, Recalc dur 24->47 ms, Script 30->65 ms, Task 115->277 ms total over ~3 s (about 5% main-thread). JS heap 2.35->2.44 MB, nodes 227->237. No layout thrash.
- Grain `body::after` overlay and ring blur: no excess main-thread cost observed. Actual compositor/raster cost of the fixed overlay and filter blur is NOT TESTED (no GPU; needs DevTools layer/paint profiling on a real device).
## Mobile load long tasks
Under 4x CPU, script init yields 63–114 ms tasks (gsap + ScrollTrigger + Lenis + main.js execute, then matchMedia setup). They occur after LCP (772 ms = FCP). Not scroll-time. 4x throttle on a fast host is an approximation of a mid phone (inferred).
## Recommended (no code edited by me)
1. Withdrawn: deferring Lenis/ScrollTrigger <1024 (rejected by tech-lead, DECISIONS 2026-11-17: mobile branch builds reveal triggers and hero start state before first paint). Profile first only if TBT median ever exceeds 100 ms.
2. devops/host: enable gzip/brotli at deploy; the local python server sends none (gz figures assume it).
3. Real-device pass, Lighthouse once installed, INP: NOT TESTED (see Method).
