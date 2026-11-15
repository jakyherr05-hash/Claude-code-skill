---
name: lenis-scroll
description: Single, accessible smooth-scroll architecture with Lenis 1.3 + GSAP ScrollTrigger — one instance on gsap.ticker, ScrollTrigger sync, header-offset anchors with focus management, scroll lock for menus/modals, route-change reset and scroll restoration, touch/mobile behaviour, nested scroll areas, resize, prefers-reduced-motion and React cleanup. Use whenever adding smooth scrolling, when ScrollTrigger positions drift with smooth scroll, when anchors/menus/modals fight the scroll, when mobile scrolling feels wrong, or when two scroll libraries might be competing.
---

# Lenis scroll architecture

## Verified baseline (2026-11-15)
- `lenis@1.3.27` (MIT) is the latest on npm. The package name is `lenis`, not the deprecated `@studio-freight/lenis`. Exports: `lenis`, `lenis/react`, `lenis/snap`, `lenis/vue`, and `lenis/dist/lenis.css`.
- README integration for GSAP (quoted from the 1.3.27 README):
  ```js
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
  ```
- `respectReducedMotion` defaults to `true`: smoothing is disabled and programmatic scrolls are instant, but scroll still runs on the main thread. The `prefersReducedMotion` getter exposes this. The demo's tests confirm it in a browser (see QA report).
- Lenis wraps **native** scroll, so `position: sticky`, find-in-page, keyboard scrolling and screen readers keep working. Include `lenis.css`: it sets `height: auto` and `overflow: clip` while stopped.

## Install
```bash
npm i lenis@^1.3 gsap@^3.15 @gsap/react@^2.1
```
Copy `assets/SmoothScroll.tsx` to `src/scroll/`. It imports gsap from your `src/motion/registry.ts` (see `gsap-motion`). Wrap the app:
```tsx
<SmoothScroll><App/></SmoothScroll>
```
Then set a `--header-h` CSS variable if you have a fixed header; anchor offsets read it.

## What the template gives you
| Feature | How |
|---|---|
| One loop | `autoRaf: false`; Lenis is driven by `gsap.ticker`, and ScrollTrigger updates on Lenis `scroll` events |
| Anchors | A delegated click handler on `a[href^="#"]` → `lenis.scrollTo(el, { offset: -headerH })`, then **moves focus** to the target (`tabindex=-1`) for keyboard and screen-reader users, and updates the URL hash |
| Scroll lock | `useScrollLock(open)` is ref-counted; `lenis.stop()` + `html.is-scroll-locked`. Blocks wheel, touch and keyboard |
| Route changes | Router calls `lenis.scrollTo(0 or savedY, { immediate: true, force: true })`, then `ScrollTrigger.refresh()` next frame. `history.scrollRestoration = 'manual'`, with positions saved in `history.state` |
| Touch | `syncTouch: false` keeps native momentum on iOS/Android (most robust). Only enable `syncTouch` when a scene truly needs synchronous touch, and test on real devices |
| Reduced motion | Lenis' built-in `respectReducedMotion` |
| Cleanup | On unmount: ticker callback removed, `lagSmoothing` restored, `lenis.destroy()` (removes `lenis` classes) |
| Debug | `window.__lenis` in dev or `?debug` |

## Rules
- **Fixed-header offset — use ONE mechanism.** `lenis.scrollTo(element)` already subtracts the target's CSS `scroll-margin-top` **and** the scroller's `scroll-padding-top` (Lenis 1.3.27 source, `lenis.mjs` lines 787–790). Combining either with an `offset: -headerH` double-counts (verified in a browser: a 72px header produced a 144px gap with one CSS rule and 216px with two). Prefer CSS `scroll-margin-top: var(--header-h)` on targets — it also fixes native/no-JS and initial `#hash` loads — and pass **no** offset; or pass an offset and set no CSS. The template detects CSS margins/padding and skips its own offset.
- **Exactly one smooth-scroll system.** Remove `scroll-behavior: smooth` from CSS (it fights Lenis' programmatic scrolls), and don't add ScrollSmoother or Locomotive Scroll.
- **Pins** use `anticipatePin: 1`. No `scrollerProxy` is needed, because Lenis scrolls the window.
- **Nested scrollables** (modals, code blocks, maps): use `data-lenis-prevent` on the element, or the `allowNestedScroll: true` option (costlier).
- **Horizontal drag areas:** `data-lenis-prevent-touch` / `-wheel`.
- **iframes** get `pointer-events: none` while smoothing (from lenis.css); allow interaction when idle if needed.
- **Never hijack** wheel into fixed "slides" unless the spec demands it and keyboard parity exists.

## Test recipe (Playwright) — see `web-qa` assets for the full spec
1. Smoothing: one `mouse.wheel(0, 600)`, then sample `scrollY` at 16/100/250/500 ms. The value is interpolated when motion is allowed, and reaches 600 within about a frame when `reducedMotion: 'reduce'` is emulated.
2. Sync: a ScrollTrigger's `progress` changes while Lenis animates (not only at the end).
3. Anchors: clicking a nav link lands the section top at `--header-h` (±2px), and `document.activeElement` is the target.
4. Lock: with the menu open, wheel does not change `scrollY`; Escape closes the menu and focus returns to the toggle.
5. Cleanup: after unmount, `document.documentElement.classList` has no `lenis` class.
