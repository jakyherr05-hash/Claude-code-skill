# Decision Log — Halde

| Date | Decision | Alternatives | Rationale | Decided by |
|---|---|---|---|---|
| 2026-11-16 | Plain no-build stack (index.html/styles.css/main.js + vendor/) | Vite+React default | Brief mandates no build step, local vendor only | user brief |
| 2026-11-16 | System serif stack, no bundled fonts | Web fonts | No network/fonts offline; no licence exposure | typography-spacing |
| 2026-11-16 | Gate A FAIL → fixes TA-1..TA-8 required before code | Approve with notes | Defects found in vendor code, not the doc (see below) | tech-lead |
| 2026-11-16 | Lenis wheel = lerp-only (lerp .12, no `duration`); anchor scrollTo keeps its own duration/easing | duration+lerp | Vendor code: numeric duration + non-function easing makes duration win, lerp never used | tech-lead |
| 2026-11-16 | Lenis licence UNVERIFIED: vendor/lenis.min.js (18,815 B, sha256 80f53e77…a6da7) and lenis.css (513 B) contain no licence text; upstream "MIT" unconfirmed (no network). Record as unverified in docs + vendor/PROVENANCE.md; flag to user | Assume MIT | An assumption is not licence evidence | tech-lead |
| 2026-11-16 | GSAP/ScrollTrigger: headers read "3.15.1 … Copyright 2026 GreenSock, Subject to gsap.com/standard-license"; terms not fetched (UNVERIFIED); headers must stay intact; core + ScrollTrigger only | n/a | Licence is part of done | tech-lead |
| 2026-11-16 | `.js-motion` removed if a vendor global is missing + CSS-only reveal fallback; favicon via `data:,` link (keeps 7 requests) | none | h1 is LCP; content must never stay hidden | tech-lead |
| 2026-11-16 | Licence ruling: prototype may pass Gate A with Lenis/GSAP licences UNVERIFIED, for local/private preview only. Before any public/commercial launch: upstream Lenis LICENSE + GSAP standard-license terms stored in vendor/LICENSES/, sha256 vs official npm packages, Gate B fails if still UNVERIFIED | Block on licences | Brief mandates these vendor copies; no network | tech-lead |
| 2026-11-16 | Gate A r2 FAIL: R2-1 reduced motion read once (no matchMedia for it); R2-2 late main.js must not re-hide h1; R2-3 anchors+focus without Lenis; R2-4 no licence claims; R2-5 extra tests; R2-6 single boot vendor check | n/a | tech-lead re-check | tech-lead |
| 2026-11-16 | Gate A r3 FAIL: anchor+focus handler must be `initAnchors()` outside regions, called in boot() before the vendor gate (native fragment nav does not move focus); R2-5(b) reworded: h1 visible by ≤2.6s then never re-hidden | n/a | tech-lead | tech-lead |
| 2026-11-16 | Gate A r4 PASS (R2-3, R2-5 b/b2 consistent; no regressions). Carried: IIFE/rename scrollTo hook (no global), Lenis anchor path preventDefault+pushState, gzip to measure, licences UNVERIFIED → private preview only | n/a | tech-lead | tech-lead |
| 2026-11-16 | Steps 3-up at 1024 (design spec wins over spacing doc 768); header wordmark stays --step-2, h1 stays --step-3 (--step-4 unused → doc corrected, token may stay); Gate B creative may revisit | Follow typography doc | Built render at 390/1440 reads well; avoids reflow work | orchestrator |

TA items: 1 lerp-vs-duration; 2 content hidden on vendor failure; 3 reduced-motion toggle; 4 ownership gaps; 5 shared-file waves; 6 visual-regression/test plan; 7 Lenis licence; 8 sizes/requests.
Gate A source: tech-lead handoff (2026-11-16). Raw sizes measured: gsap 73,357 B; ScrollTrigger 44,683 B; lenis.min 18,815 B; lenis.css 513 B. Gzip: NOT TESTED.
