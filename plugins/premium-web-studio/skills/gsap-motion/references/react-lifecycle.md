# GSAP in React: lifecycle, routes, resize, content changes

## Scoping
```tsx
const root = useRef<HTMLElement>(null);
useGSAP(() => {
  gsap.from('.item', { opacity: 0 });          // selector text is scoped to root
}, { scope: root });                           // reverted on unmount
```
- `dependencies: [x]` re-runs when `x` changes. With `revertOnUpdate: true` the previous run is reverted first (use this when the DOM itself changes with the dependency, e.g. a different project slug).
- Animations triggered by events: `const { contextSafe } = useGSAP({ scope }); const onClick = contextSafe(() => gsap.to(...))`. Otherwise they escape the context and leak.

## Route changes
1. Unmount the old page → its `useGSAP` contexts revert (ScrollTriggers killed, SplitText restored, pins removed).
2. Mount the new page → reset scroll (`lenis.scrollTo(0, { immediate: true })`) **before** the new page's triggers measure.
3. `ScrollTrigger.refresh()` in the next frame.
4. Leak test (Playwright): read `ScrollTrigger.getAll().length` on page A, navigate A → B → A, then read again; it must equal the first value. The demo exposes this as `window.__gsapStats()` under `?debug`.

In Next.js App Router, page components stay mounted during layout transitions in some cases. Key the page wrapper by pathname so contexts revert.

## Resize
- ScrollTrigger auto-refreshes on resize (debounced). Values computed from layout must be functions (`end: () => ...`, `x: () => ...`) with `invalidateOnRefresh: true`.
- `ScrollTrigger.config({ ignoreMobileResize: true })` avoids refresh jumps when mobile URL bars show/hide.
- `gsap.matchMedia()` rebuilds only the branch whose condition changed (e.g. crossing 64rem).

## Content changes
- After content changes height (filter, accordion, images without dimensions, late fonts), call `ScrollTrigger.refresh()` once it's settled. Always give images width/height to avoid this altogether.
- SplitText with `autoSplit: true` re-splits after font load and container resize. Return the tween from `onSplit` so it's re-synced.

## Debugging checklist
- Duplicate animations → an effect without cleanup, or registration in a component body. Move registration to `registry.ts`.
- Pins jump → fonts or images changed layout after measure. Refresh after `document.fonts.ready`, and set explicit dimensions.
- Animation "already finished" on revisit → `once: true` trigger created outside a context, or state kept at module level.
- `markers: true` (dev only) shows trigger positions. Remove before shipping.
