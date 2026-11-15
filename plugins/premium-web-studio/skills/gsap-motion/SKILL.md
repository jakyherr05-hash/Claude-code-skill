---
name: gsap-motion
description: GSAP 3 animation architecture for premium websites — plugin registry (ScrollTrigger, SplitText, Flip, Observer, Draggable, Inertia, CustomEase, MorphSVG, DrawSVG — all free in the public gsap package), React integration with useGSAP scoping and cleanup, gsap.matchMedia for responsive and reduced-motion branches, timelines, scroll-scrubbed pinned sequences, text reveals, clip-path/mask transitions, Flip layout morphs, horizontal scroll, parallax, magnetic/cursor effects and page transitions. Use for any GSAP or ScrollTrigger work, any scroll-driven or cinematic animation, and whenever animations leak, duplicate, jank, or break after route changes or resizes.
---

# GSAP motion architecture

## Verified baseline (2026-11-15)
- `gsap@3.15.1` is the latest on npm. Its licence field is "Standard 'no charge' license" (gsap.com/standard-license): free for commercial sites, including client work. The one Prohibited Use is building no-code *visual animation builder* tools that compete with Webflow. All plugins ship in the public package: ScrollTrigger, ScrollSmoother, SplitText, Flip, Observer, Draggable, InertiaPlugin, CustomEase, CustomBounce, CustomWiggle, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, ScrollToPlugin, Physics2D, PhysicsProps, GSDevTools, and more.
- `@gsap/react@2.1.2` provides `useGSAP`.
- Re-check before a new project: `npm view gsap version license` and `ls node_modules/gsap/*.js`.
- Use ScrollSmoother **or** Lenis, never both. This studio standardises on Lenis (`lenis-scroll` skill).

## Architecture (copy `assets/` into `src/motion/`)
| File | Role |
|---|---|
| `assets/registry.ts` | Registers plugins **once**, creates the project's CustomEases, sets defaults, `ScrollTrigger.config({ ignoreMobileResize: true })`. Everything imports gsap from here. |
| `assets/tokens.ts` | Motion tokens (durations, eases, staggers) mirrored from ANIMATION_SPECIFICATION.md + `prefersReducedMotion()` |
| `assets/lit.ts` | Example reusable text primitive: SplitText with `aria:'auto'`, `autoSplit`, and `onSplit` returning the tween. Adapt the reveal to the brand (lit, masked, slid…). |
| `assets/useReducedMotion.ts` | Live `prefers-reduced-motion` hook for DOM-level switches (e.g. render static steps instead of a pin) |
| `assets/examples/*.tsx` | Tested patterns from the reference demo: pinned scrubbed sequence (Method), Flip filter (ScheduleIndex), quickTo-driven interactive (TheHour), once-reveals (Rooms), route transition veil (Router) |

These files are the verified implementation from `demo/` in this repo, exercised by its Playwright suite (cleanup across routes, reduced motion, scroll sync).

## Rules that prevent 90% of GSAP bugs in React
1. **Every animation lives inside `useGSAP(() => {...}, { scope: ref })`**. The context reverts all tweens, ScrollTriggers, SplitTexts and matchMedia branches on unmount. Event-handler animations use `contextSafe`.
2. **Never create ScrollTriggers at module scope** or in plain `useEffect` without reverting them. Never call `ScrollTrigger.killAll()` as a cleanup strategy.
3. **One `gsap.matchMedia()` per section** with `motion`/`reduce` (and desktop/mobile) conditions. Initial hidden states are set *inside* the motion branch, so no-JS and reduced-motion users see final content.
4. **Strict Mode safe:** `useGSAP` handles React 18/19 double-invocation. Verify with a leak check: `ScrollTrigger.getAll().length` returns to baseline after navigating away and back.
5. **Refresh after layout changes:** after fonts load (`document.fonts.ready.then(() => ScrollTrigger.refresh())`), after filtering lists, and after route content mounts. `invalidateOnRefresh: true` on any trigger whose values are computed from layout.
6. **Pin correctly:** pin an *inner* wrapper, keep `pinSpacing`, give it a `min-height: 100svh` that doesn't depend on webfonts, and use `anticipatePin: 1` with Lenis. Use one pin per experience; stacked pins confuse users.
7. **Animate cheap properties:** transform, opacity, clip-path; CSS variables only on small subtrees. Avoid width/height/top/left in scrubbed timelines, and read layout before writing (GSAP batches its own writes).
8. **`will-change` only while animating**, and only on a few layers.

## Recipes
`references/recipes.md` has tested or documented patterns for: cinematic hero sequence, SplitText reveals (chars/words/lines, masked), clip-path and mask transitions, pinned scrub storytelling, horizontal scroll section (`containerAnimation`), parallax layers, Flip state morphs, Observer-driven gesture sections, Draggable + Inertia carousels, magnetic buttons, cursor followers, SVG morph/draw, image distortion handoff to WebGL, page transitions, and 3D scroll with a WebGL camera.

`references/react-lifecycle.md` covers route changes, resize, content changes and debugging leaks.

## Purposeful motion checklist (before you animate)
- What does this animation *communicate* (hierarchy, causality, state, brand material)? If nothing, delete it.
- Is it the signature moment, or should it stay quiet?
- What does reduced motion show instead? (It must remain fully understandable.)
- What is the mobile expression? (Hover effects need a touch alternative; pins get shorter.)
- How many ScrollTriggers does the page create? Write the inventory into the spec so QA can assert it.
