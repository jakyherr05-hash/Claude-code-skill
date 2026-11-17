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

## Openings
The first seconds set the tempo for the whole site, so make them intentional and short.
- Content first: the headline (usually the LCP element) is in the HTML and visible at first paint. The intro *adds* light, depth or movement to it; it never withholds it. Readable content within ~1.5 s, no full-screen preloader for a page that weighs under a few MB.
- If assets truly need loading (image sequence, 3D), show the poster/first frame immediately and stream the rest. A progress counter is a design element, not an excuse.
- One opening per session: returning to the home page or navigating back skips the intro.

## Scroll storytelling: storyboard before timeline
For any page that tells a story with scroll (pinned chapters, image sequences, camera moves), write the beats in ANIMATION_SPECIFICATION.md **before** writing a tween:

| Beat | What the visitor should feel/learn | Picture (what is on screen) | Words (≤ 12 at a time) | Scroll length | Mobile expression | Reduced motion |
|---|---|---|---|---|---|---|

- **One idea per beat.** Text and picture change together; a caption describes the frame it sits on.
- **Budget scroll length** per beat (≈ 50–120 % of a viewport) and per page; total pinned length ≤ ~4 viewports before the visitor gets control back. Leave a rest at the end of each pin.
- **Pace like film:** establish → tension → reveal → release. Alternate dense, pinned beats with free-scrolling, quiet ones.
- **Choose the cheapest medium that tells it:** CSS/GSAP transforms → video → image sequence (gsap-motion recipe 15) → WebGL. Go up a step only when the step below can't express the beat.
- **Mobile is its own cut,** not a shrunk desktop: shorter pins, fewer frames, vertical crops, captions below rather than over the picture where contrast is fragile.
- Verify the storyboard against the rendered filmstrip (`visual-critique.md` §F).

## Transitions
Page transitions ≤ 1.2s total; keep the next page's content interactive as soon as it's visible; move focus to the new page's `h1`/main for screen readers.

## Reduced motion
Under `prefers-reduced-motion: reduce`: no smooth scroll interpolation, no parallax, no pinned scrubbing that hides content, no auto-playing video; replace with instant states or ≤ 0.2s opacity fades. Content must be fully readable without any animation having run.
