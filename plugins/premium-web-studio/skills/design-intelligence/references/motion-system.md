# Motion system

## Principles (pick 3 per project and write them down)
- **Purposeful** — every animation clarifies hierarchy, causality, or state.
- **Choreographed** — elements move in reading order with stagger that reflects their relationship.
- **Material** — mass and friction match the brand (heavy = longer, decelerating; light = quick, springy).
- **Responsive to the user** — scroll-linked motion is scrubbed (the user is in control); time-based motion is short.
- **Quiet by default** — most of the page doesn't move; the signature moment does.

## Duration scale (adjust per brand tempo)
| Token | Default | Use |
|---|---|---|
| `--dur-xs` | 0.15s | hover/focus feedback |
| `--dur-s` | 0.3s | small UI state changes |
| `--dur-m` | 0.6s | element reveals |
| `--dur-l` | 1.0s | section reveals, image masks |
| `--dur-xl` | 1.6s | hero intro, page transitions |
Luxury multiplies by ~1.3; tech/brutalist by ~0.7.

## Easing vocabulary
- Entrances: `expo.out` / `power4.out` (decisive deceleration).
- Exits: `power2.in` (get out of the way quickly).
- State morphs (Flip): `power3.inOut`.
- Scroll scrub: `none` (linear) on the scrubbed tween; character comes from `scrub: 0.5–1.2` smoothing.
- Signature: a `CustomEase` defined once (e.g. `"M0,0 C0.2,0 0.05,1 1,1"`) and reused for the brand's key moments.

## Stagger
Stagger only siblings of equal importance. 0.03–0.06s for characters, 0.06–0.12s for words/lines, 0.1–0.2s for cards. Use `from: "start"` for reading order; `"center"`/`"edges"` only for symmetrical compositions.

## Scroll behaviour
- Smooth scroll via one Lenis instance; never fight native gestures on touch unless essential.
- Pin only when the content truly needs time (a sequence, a comparison, a story beat). Every pinned section must be escapable by normal scrolling and keyboard.
- Parallax ≤ 15% displacement for content, more only for decorative layers.
- Scroll-triggered reveals fire once (`once: true` or `toggleActions: "play none none none"`) unless the spec says otherwise — replays are distracting.

## Transitions
Page transitions ≤ 1.2s total; keep the next page's content interactive as soon as it's visible; move focus to the new page's `h1`/main for screen readers.

## Reduced motion
Under `prefers-reduced-motion: reduce`: no smooth scroll interpolation, no parallax, no pinned scrubbing that hides content, no auto-playing video; replace with instant states or ≤ 0.2s opacity fades. Content must be fully readable without any animation having run.
