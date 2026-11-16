# Gate B - QA verdict round 2: PASS (conditional, Chromium-verified private preview)

## Evidence
- Own rerun of `node tests/qa-run.mjs` (127.0.0.1:8790): "done: 56 pass / 0 fail". Re-read tests/qa-results.json afterwards: 56 rows, 0 non-PASS. Matches QA_REPORT.
- Opened: frame-390-03-y732 (header clear; step 01/02 rings drawn, 03 ring faded = mid reveal), frame-1440-04-y1101 (header over scrolled cards, as expected for a fixed header; contact card below), toggle-np-to-reduce.png (full page after live switch to reduce: hero, 3 cards with rings, contact all visible; the header mid-page is the known fullPage stitching artifact), w390-vp-h-contact (header 65px, contact heading clear below it, no clipping).
- sha256-vendor.txt: 4 hashes recorded, all "match PROVENANCE". Compared to official npm: not done (disclosed).

## Do the new tests bite?
- R2-5(a) np->reduce: asserts every [data-reveal] (4), h1, email opacity "1" after emulateMedia, plus no page errors. Reasonably non-vacuous: the page has been loaded and idle 2.8 s with no scroll, so below-fold reveals would otherwise still be pending. Weakness: no "before" assertion that reveals were NOT already 1, so it could pass trivially for in-view items. Lenis kept running is documented, not asserted.
- R2-5(a) reload under reduce: asserts 0 Lenis, 0 ST, content visible. Real.
- R2-5(a) reduce->np: weakest. After a reduce load the state is 0 ST/no Lenis, and the test asserts that stays so. It proves "no crash, content stays visible", not that anything re-initialises. Acceptable because the product choice is "reload to change".
- R2-5(c): anchorCheck repeated with gsap, ScrollTrigger and lenis.min.js blocked, asserting heading position below the 65px header (289/386). Real, and covers the focus path tech-lead asked for. Reduced-mode anchors likewise (289/386).
- Modifier-click guard: no dedicated assertion seen in the grep; NOT TESTED.

## Timing threshold
- Original limit 2600 ms; R2-5b2 measured 2616 and failed it, then the limit became 2800. This is partly test-fitting. It is defensible, because the product delay is a fixed 2500 ms CSS fallback and 2538/2616 are +38/+116 ms of paint/load jitter, leaving about 180 ms headroom. I judge it an honest jitter allowance, but the assertion is one-sided. Recommend adding a lower bound (>= ~2400 ms) so "fallback fired at its designed time" is checked, and not just "not too late". Non-blocking.

## Gaps (all NOT TESTED)
axe, toHaveScreenshot baselines, Firefox/WebKit, real devices, INP/Lighthouse, back/forward, hash-on-load focus (record-only: lands correctly, focus stays on BODY), modifier-click guard. Acceptable for a Chromium-verified private preview of a static single page. Before public launch: axe, baselines, cross-browser/device, INP/Lighthouse, hash-on-load focus. Also QA_REPORT says the post-edit screenshots were not re-opened; I opened four of them here and they look fine, but I did not re-open the full matrix.

## Defects
None confirmed.

GATE B · QA: PASS
