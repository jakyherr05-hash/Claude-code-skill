# Technical Architecture — Halde
_Owner: frontend-engineer · Gate A round 3 fixes applied, awaiting tech-lead · 2026-11-16_
## Stack & rationale
No-build static site: `index.html` + `styles.css` + `main.js` + `vendor/`, classic `<script defer>`, no npm/bundler/framework. **Overrides the default Vite/React/TS stack** (DECISIONS): brief requires no build step, local vendor only, static hosting; one page, no state or routing. Plain ES2020, `"use strict"`, no globals beyond vendor ones.
## Dependencies
| Package | Version | Licence | Raw bytes (gz) | Why |
|---|---|---|---|---|
| gsap core `vendor/gsap.min.js` | 3.15.1 | UNVERIFIED: header cites gsap.com/standard-license, terms not fetched; header stays intact | 73,357 (gz not measured) | reveals, hero scrub |
| ScrollTrigger `vendor/ScrollTrigger.min.js` | 3.15.1 | UNVERIFIED, same header | 44,683 (gz not measured) | 5 triggers |
| Lenis `vendor/lenis.min.js` + `lenis.css` | 1.3.27 | UNVERIFIED: no licence text in files; upstream licence unconfirmed | 18,815 + css 513 (gz not measured) | smooth wheel scroll |
Raw total 137,368 B + css/main.js; the "~70 KB gz JS" budget is unproven until perf-engineer gzips. Licence text to `vendor/LICENSES/` before any public or commercial launch; also sha256 vs official npm packages (vendor/PROVENANCE.md). No fonts, images, video, WebGL, CDN or analytics; LCP element is the h1 text.
## Script load order and failure behaviour
Inline head script reads `matchMedia('(prefers-reduced-motion: no-preference)')` once and adds `.js-motion` to `<html>` only if it matches. Head: `styles.css`, `vendor/lenis.css`, `<link rel="icon" href="data:,">` (budget 7 requests: html, 2 css, 4 js). Scripts, all `defer`: `gsap.min.js` → `ScrollTrigger.min.js` → `lenis.min.js` → `main.js`.
**Single boot (R2-6):** one `boot()` at the top of main.js does the vendor-missing check (`gsap`, `ScrollTrigger`, `Lenis` globals). `initAnchors()` runs first, before the check, so anchors work even with vendors missing. Missing: remove `.js-motion`, return, content shows. Else `registerPlugin(ScrollTrigger); initScroll(); initMotion();`.
**No-flash and fallback (R2-2):** CSS `.js-motion:not(.motion-ready) [data-reveal]` hides; the same selector has `animation: reveal-fallback .01s 2.5s forwards` (opacity 1, transform none), so a blocked or slow main.js never leaves content hidden. `.motion-ready` is set together with the GSAP opening state, which cancels the fallback. A main.js arriving after 2.5 s (fallback already fired) skips the reveal and never re-hides content. Failure mode: h1 (LCP) paints ~2.5 s late, over the 1.8 s budget, but is never hidden.
## Directory layout & ownership
| Path | Owner |
|---|---|
| `index.html` (landmarks, skip link, one h1, `data-*` hooks) | frontend-engineer |
| `styles.css` except token block; `.gitignore` | frontend-engineer |
| `styles.css` `/* TOKENS */` block | typography-spacing |
| `main.js` `boot()`, `initAnchors()` (outside SCROLL/MOTION regions), nav observer, other code outside regions | frontend-engineer |
| `main.js` `/* SCROLL */` → `initScroll()`, the only `ScrollTrigger.refresh()` (`fonts.ready`, `load`) | lenis-scroll |
| `main.js` `/* MOTION */` → `initMotion()` | gsap-animator |
| `vendor/**`, `vendor/PROVENANCE.md` | tech-lead |
| `tests/**`, playwright config, test runner, static-server script | qa-engineer |
| `studio/ASSET_MANIFEST.md` | ai-visual-producer |
| `studio/DECISIONS.md`, `PROJECT_STATUS.md` | orchestrator; other `studio/*.md` → their named owners (PERFORMANCE_REPORT perf-engineer, QA_REPORT qa-engineer) |
## Scroll & motion architecture
One Lenis, no other scroll system (no CSS `scroll-behavior:smooth`, no second rAF). **Lerp-only wheel (TA-1):** `new Lenis({lerp:.12,smoothWheel:true,syncTouch:false,anchors:false,autoRaf:false})`, no `duration` (a numeric duration overrides lerp); anchor `scrollTo` carries its own duration/easing. `lenis.on('scroll',ScrollTrigger.update)`; `gsap.ticker.add(t=>lenis.raf(t*1000))`; `lagSmoothing(0)`. **Reduced motion (R2-1):** read once at load by the head script; no `matchMedia` listener or `gsap.matchMedia` for it; changing the OS setting takes effect on reload. Reduced: no `.js-motion`, `initScroll()` returns null, `initMotion()` creates nothing. Content visible by default; tweens use transform/opacity only. **Anchors (R3):** targets (section headings) carry `tabindex="-1"` and `scroll-margin-top` = header height. `initAnchors()` (frontend-engineer, outside regions, called in `boot()` before the vendor check) handles anchor clicks: native jump, then `focus({preventScroll:true})`, since native fragment navigation does not move focus. When Lenis exists, `initScroll()` swaps in `lenis.scrollTo` for the jump.
## Performance budget
| Metric | Budget | Measured |
|---|---|---|
| LCP (mobile lab, 4x CPU, slow 4G) | ≤ 1.8 s | NOT TESTED |
| CLS / INP / TBT | ≤ 0.02 / ≤ 150 ms / ≤ 100 ms | NOT TESTED |
| JS initial (gz) / requests | ≤ 70 KB incl. main.js ≤ 8 KB / ≤ 7, 0 third-party; CSS ≤ 8 KB gz | not measured / 7 by design |
## Edit sequencing (one writer per file at a time, never parallel)
W1 frontend-engineer creates `index.html`, `styles.css`, `main.js` with `/* TOKENS */`, `/* SCROLL */`, `/* MOTION */` markers → W2 typography-spacing TOKENS → W3 lenis-scroll SCROLL → W4 gsap-animator MOTION → W5 frontend-engineer fixes outside regions → W6 perf-engineer + qa-engineer read-only. After W6 each fix has one owner per file; defects go to the region owner. Never reformat another owner's region; each wave ends committed.
## Test plan (qa-engineer)
Playwright borrowed from `/home/user/Claude-code-skill/demo/node_modules` (no `npm install`) against a local static server. `toHaveScreenshot` at 390 and 1440, motion and reduced. Blocked-vendor test (abort each vendor file: content visible, 0 uncaught errors, `.js-motion` removed). **R2-5:** (a) live `emulateMedia` reduce toggle both directions: content stays visible, and when loaded reduced no triggers are created; (b) main.js delayed 3 s: h1 visible by ≤2.6 s, then never re-hidden through load and end of main.js; (b2) main.js blocked entirely: h1 visible via CSS fallback ≤2.6 s; (c) anchor click focuses the target heading with vendor blocked. Also anchor + focus in motion and reduced; 360/768/1024/1920 no overflow, touch targets ≥ 44 px ≤768; 0 console errors/failed requests on load and after full scroll; motion: 1 Lenis, 5 ScrollTriggers; reduced: 0 triggers, no Lenis; JS off readable; keyboard order, `:focus-visible`; axe 0 serious/critical. Lighthouse: NOT TESTED/BLOCKED if unavailable, never inferred.
