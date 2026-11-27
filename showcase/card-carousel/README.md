# Card carousel (GSAP)

A swipeable 3D ring carousel: the square cards sit round a turning drum. Moves ease in and out (`power3.inOut`), and drag and wheel input is smoothed. The page opens with the stacked deck swinging round the ring and fanning out. Slides are 1:1.

- `src/carousel.ts`: every card's pose comes from one continuous `progress` value, so a swipe turns the ring with the finger (smoothed on `gsap.ticker`), then glides into the nearest slot (flick = one slide, hard flick = two). A trackpad or mouse wheel over the ring turns it too. Buttons, dots and arrow keys tween the same value. Uses GSAP `Observer` (registered in `src/motion/registry.ts`, the pattern from the `gsap-motion` skill).
- Autoplay is off; `createCarousel(root, { autoplay: true })` turns on the self-running loop.
- Reduced motion: no entry choreography, short crossfade-like snaps.
- `public/slides/`: the five images, pre-cropped to 1080×1080.

```bash
npm install
npm run dev            # local
npm run build && npm run preview   # serves dist/ on :4175
npm test               # Playwright checks against :4175 (phone swipe, mouse drag, entry, 1:1, keys, dots, reduced motion)
```
