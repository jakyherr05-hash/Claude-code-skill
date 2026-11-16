# Animation Specification — Halde
_Owner: gsap-animator · 2026-11-16 · GSAP 3.15.1 core + ScrollTrigger only, Lenis 1.3.27, plain script tags from ./vendor. No SplitText/CustomEase/other plugins. Plain main.js, no build._
## Motion tokens
Scale: `dur.s .9` (reveal), `dur.m 1.2` (ring/fade), `dur.l 1.6` (foot rings); `gap .18` (stagger = reading order). Eases: `ease.settle = "power3.out"` (heavy coast-down, default), `ease.long = "expo.out"` (foot rings only). No bounce/back/elastic. Only transform + opacity are tweened.
## Global systems
- Scroll chain (lenis-scroll writes it, I rely on it): `lenis = new Lenis({lerp:.12, smoothWheel:true, syncTouch:false, anchors:false, autoRaf:false})` (wheel is lerp-only: NO `duration`/`easing` here, because vendor/lenis.min.js `advance()` uses duration+easing whenever both are set and then ignores lerp); `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`. lerp .12 settles in about 0.7s at 60fps (lenis-scroll to measure; adjust lerp, not my code). Touch stays native.
- Anchors: the click + focus handler is `initAnchors()`, OUTSIDE the regions (owner frontend-engineer), called in `boot()` BEFORE the vendor-missing check so it works with no Lenis/reduced motion. Default: native jump honouring CSS `scroll-margin-top` (= header height), then `heading.focus({preventScroll:true})` (native fragment nav does not move focus). Target headings need `tabindex="-1"`. `initAnchors` keeps a module-level `let scrollTo=null` hook (no `window` global); when Lenis exists, `initScroll()` sets it to `(el,done)=>lenis.scrollTo(el,{offset:-headerH, duration:.9, easing:t=>1-(1-t)**4, onComplete:done})` (independent of the wheel config); `done` focuses the heading. `headerH` = header `offsetHeight` read per click.
- Reduced motion: no Lenis, no ScrollTrigger, no tweens. Rings centred and still, all content visible. `initMotion()` reads the decision ONCE: `document.documentElement.classList.contains('js-motion')`; if absent it returns at once (zero ScrollTriggers). `gsap.matchMedia()` is used ONLY for the `(min-width:768px)` / `(max-width:767px)` branches, never for reduced motion. Toggling the OS preference takes effect on reload (no live toggling).
- Vendor-missing fallback: ONE boot function at the top of main.js checks `window.gsap`, `ScrollTrigger`, `Lenis`; if any is absent it removes `.js-motion` from `<html>` and skips `initScroll()`/`initMotion()` (`initAnchors()` has already run). No other region repeats this check.
- No-flash: a head script adds `.js-motion` only when motion is allowed. Hide rule: `.js-motion:not(.motion-ready) [data-reveal]` (plus the `[data-step-ring].is-active` overlay). `.motion-ready` is set on `<html>` in the same frame as the GSAP opening state (`gsap.set`), so nothing re-hides. If the CSS fallback (2.5s) already ran (`performance.now() > 2500`), skip the load reveal entirely so the h1 never re-hides, but still add `.motion-ready` to `<html>` on that path. No JS or reduced motion means final state.
- Page transitions: none (one page).
## main.js ownership (marked regions, edit only your own)
- `/* SCROLL (lenis-scroll) */` `initScroll()` returns `lenis|null` (null when reduced): Lenis, ticker wiring, the `scrollTo` hook swap for `initAnchors()`, the ONLY owner of `ScrollTrigger.refresh()` on `document.fonts.ready` and `load`.
- `/* MOTION (gsap-animator) */` `initMotion()`: reads `js-motion` once, matchMedia for 768px only, all tweens/ScrollTriggers. Never creates Lenis or a ticker loop. Boot order: `initAnchors();` then the vendor check, then `const lenis=initScroll(); initMotion();`. `initAnchors` is outside both regions. The nav IntersectionObserver is frontend-engineer's, outside both regions.
## Per-section choreography
### S1 Hero
- Purpose: the off-true vessel settles as the chef scrolls: the concept made visible.
- Load: `data-reveal` (label, h1, sub, CTA) opacity 0→1, `dur.s` for h1 and `dur.m` for the rest, `ease.settle`, stagger `.18`, no y. No wait for fonts (LCP). Wordmark/nav never move.
- Scrub: one ScrollTrigger on `#top`, `start:"top top"`, `end:"bottom 35%"`, `scrub:true` (Lenis already smooths, so no extra scrub lag), no pin. Timeline length 1.1: ring n (1 outer … 7 foot) `fromTo` x/y ±(2+1.5n) px alternating sign, scale `1+.012n` → 0/0/1, at position `(n-1)*.08`, duration .6, `ease.settle`. Ring 5 (glaze) trails like the rest. Ends fully concentric.
- Mobile (<768): offsets ×.6, end `"bottom 25%"` (shorter hero); same effect, no pin, touch-native scroll.
- Reduced: no offsets, no fades; rings concentric.
- Perf: 7 elements, transform only. `will-change:transform` set on enter, cleared on leave/complete (onToggle), so layers exist only while the hero is on screen.
### S2 How we work
- Purpose: one ring darkens per step, so the 3 steps read in order.
- Trigger: 3 ScrollTriggers (`data-step="n"`, `start:"top 75%"`, `once:true`) add `.is-active`. CSS fades an iron `::after` overlay on the ring (opacity .0→1, `dur.m`, `ease.settle`, as CSS transition with matching cubic-bezier(.215,.61,.355,1)). Border-colour is never animated. Steps stagger by natural scroll (stacked) or `delay: (n-1)*.18` when 3-up in one row.
- Mobile/Reduced: same trigger; reduced adds `.is-active` to all three at once, transition none. No pin, no text movement.
- Perf: 3 ring elements, opacity only, no will-change.
### S3 Contact
- Purpose: the rings come to rest around the email, resolved.
- Trigger: one ScrollTrigger on `[data-rings=foot]`, `start:"top 85%"`, `once:true`. Tween the wrapper (not 3 spans) opacity 0→1, `dur.l`, `ease.long`; the 3 rings inside stagger `.18` from `opacity:0` to 1 (3 elements). Email, copy, link never move.
- Mobile: same. Reduced: rings visible and static.
- Perf: opacity only; `pointer-events:none`.
## Element budget (ui-ux open item, resolved)
Animated: 7 hero (scrub) + 3 step overlays + 3 foot rings (+1 wrapper) = 14 nodes, never more than 7 composited at once (hero) plus the text reveals (4, load only). Accepted: all cheap opacity/transform. Do not add rings. Page ScrollTrigger inventory for QA: 1 hero + 3 steps + 1 foot = 5. MOTION never calls refresh (lenis-scroll region owns it); `invalidateOnRefresh:true` on hero.
## Plugins used
gsap 3.15.1 core, ScrollTrigger 3.15.1 (`gsap.registerPlugin(ScrollTrigger)` once), Lenis 1.3.27: licence UNVERIFIED, see vendor/PROVENANCE.md. Nothing else.
