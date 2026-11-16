# Performance Report - Halde
_Owner: performance-engineer · Date: 2026-11-16 · Round 3 (sync) · Build: none (static files)_

## Method
- Sources: `evidence/phase9/measured.txt` (unthrottled) and `evidence/phase9/measured-throttled.txt` (throttled). The orchestrator ran both and a `gzip -9c` loop. I did not run them myself.
- Server: local python http.server, no compression. Chromium via Playwright, 3 runs each, in a container. Lab data, not field data. Gz figures are local `gzip -9`, not the server's encoding.
- Throttled run: mobile 390x844 DPR2, CDP CPU 4x, 150 ms RTT, 1.6 Mbps down / 750 Kbps up. This is a Playwright CDP throttle approximating Lighthouse slow-4G. It is not Lighthouse.

## Results vs budget
| Metric | Budget | Measured | Status |
|---|---|---|---|
| LCP (throttled mobile, 3 runs) | <= 1.8 s | 1340 / 1360 / 1352 ms (median 1352) | PASS |
| CLS (throttled mobile) | <= 0.02 | 0 / 0 / 0 (unthrottled also 0 / 0 / 0) | PASS |
| TBT proxy (long-task excess over 50 ms, not Lighthouse TBT) | <= 100 ms | 41 / 21 / 36 ms (median 36) | PASS |
| INP | <= 150 ms | no interaction trace | NOT TESTED |
| Lighthouse mobile + desktop, 3 runs each | n/a | no binary, nothing installed | NOT TESTED |
| Compressed transfer | n/a | local server uncompressed: 160,138 B | NOT TESTED |
| JS total gz | <= 70 KB | 54,810 B (28,511 + 18,028 + 5,413 + 2,858) | PASS |
| main.js gz | <= 8 KB | 2,858 B (raw 7,918) | PASS |
| CSS gz | <= 8 KB | 3,338 B (3,097 + 241) | PASS |
| Requests | <= 7, 0 third-party | 7 in all runs; no third-party | PASS |
| Long tasks in wheel scroll (unthrottled) | none | 0 / 0 / 0 | PASS |
| Media weight | n/a | 0 KB (no images, video, fonts, canvas) | PASS |

Unthrottled desktop LCP was 260 / 260 / 236 ms (informational only).

## Bundle
- Raw / gz bytes: index.html 4,694 / 1,503; styles.css 10,158 / 3,097; main.js 7,918 / 2,858; gsap 73,357 / 28,511; ScrollTrigger 44,683 / 18,028; lenis 18,815 / 5,413; lenis.css 513 / 241.
- Vendor JS is 136,855 B of 144,773 B raw JS. All of it is in the initial route, loaded with `defer`.
- Media, fonts: none requested. Frame-time p50/p95 and heap across route cycling: NOT TESTED.

## Known trade-off (documented, not a defect)
The h1 appears ~2.5-2.6 s only when main.js fails. The CSS fallback reveals content after 2.5 s, and the h1 is the LCP element. Latest QA run (`tests/qa-results.json`): R2-5b (main.js delayed 3 s) firstVisibleMs 2538, rehiddenFrames 0; R2-5b2 (main.js blocked) firstVisibleMs 2616. Both PASS against QA's <= 2800 ms check. This exceeds the 1.8 s LCP budget by design, so content is never hidden. Not measured under throttling. An earlier figure of 2537-2571 ms is superseded.

## Staleness
Frontend changed hero copy/meta and contact padding after the measurements. The size table (and the gz figures above) predates that micro-edit, so index.html, styles.css and main.js bytes may differ slightly. Re-measurement was NOT done: Bash was denied to me when I tried to re-run `gzip -9c`. Status for those rows is as of the earlier build.

## Actions
- Taken: none. No site files were edited. Recommended: none, since every measured budget is met.
- Open: run Lighthouse and measure INP once tooling exists. Measure compressed transfer on a compressing server.
