# Gate B · Technical — tech-lead verdict, round 1: FAIL (code PASS; evidence gaps)
_Written by orchestrator from the tech-lead HANDOFF (reviewer had no Write tool and Bash was denied). Reproduction by reviewer: BLOCKED._

## Code review (read index.html, styles.css, main.js in full): PASS
1 Lenis on gsap.ticker (main.js:64-66), lagSmoothing(0); no second rAF/scroll listener/CSS scroll-behavior; refresh() only in SCROLL (:85-88); 5 ScrollTriggers by reading (1 hero in matchMedia branch + 3 steps + 1 contact); reduced motion read once in head script; vendor-missing path OK; no globals; anchors preventDefault+pushState; late-main.js branch never re-hides; no network/secrets; a11y basics OK.

## Gate A conditions: gzip PASS (orchestrator log), 5 ST/1 Lenis PASS, fallback LCP trade-off documented, licences UNVERIFIED → private preview only (upheld).

## Required changes
1 qa-engineer: add R2-5(a) live emulateMedia toggle both directions, R2-5(c) anchor click with vendor blocked focuses heading, reduced-mode anchor focus.
2 qa-engineer + perf-engineer: report timings (2561/2537; 2537–2571) do not match tests/qa-results.json (2545/2528 at that run); remove stale 'NOT yet rerun' line.
3 orchestrator: rerun qa-run.mjs + sha256sum vendor/* vs vendor/PROVENANCE.md and attach raw output.
Non-blocking: modifier/middle-click guard in initAnchors; #hash-on-load and back/forward untested; axe/baselines NOT TESTED; lenis.min.js.map comment 404 in devtools.
Licence gate: preview only; public launch blocked until Lenis LICENSE + GSAP terms in vendor/LICENSES/ and sha256 vs official npm.

GATE B · TECHNICAL: FAIL
